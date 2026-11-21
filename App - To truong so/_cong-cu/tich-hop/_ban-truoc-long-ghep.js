/* Tích hợp NLS – NLAI vào giáo án: đọc .docx (giữ nguyên XML gốc, chỉ CHÈN đoạn mới) hoặc .pdf (dựng lại Word).
   Mọi xử lí chạy trong trình duyệt, không gửi file đi đâu. */
const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const XNS = "http://www.w3.org/XML/1998/namespace";
const MNS = "http://schemas.openxmlformats.org/officeDocument/2006/math";

/* ---------- công thức: đếm để chắc chắn KHÔNG mất gì sau khi chèn ---------- */
const VAT = { oMath: "công thức Word (Equation)", object: "đối tượng MathType / Equation", pict: "hình kiểu cũ", drawing: "hình ảnh", vertAlign: "chỉ số trên/dưới", fldChar: "trường (field)", fldSimple: "trường (field)", txbxContent: "hộp chữ" };
function demVat(doc, boQua) {
  const kq = {};
  Object.keys(VAT).forEach(k => kq[k] = 0);
  for (const e of doc.getElementsByTagName("*")) {
    const k = e.localName;
    if (!(k in kq)) continue;
    if (k === "oMath" && e.namespaceURI !== MNS) continue;
    if (boQua && boQua.size) { let a = e, bo = false; while (a) { if (boQua.has(a)) { bo = true; break; } a = a.parentNode; } if (bo) continue; }
    kq[k]++;
  }
  return kq;
}
function moTaVat(kq) {
  const gop = {};
  Object.keys(kq).forEach(k => { if (kq[k]) gop[VAT[k]] = (gop[VAT[k]] || 0) + kq[k]; });
  return Object.keys(gop).map(t => gop[t] + " " + t).join(" · ");
}
/* Gõ chỉ số trong nội dung tích hợp: x^2  H_2O  10^{-3}  SO_4^{2-}  → chỉ số trên/dưới thật trong Word */
function chiaChiSo(s) {
  const out = []; let i = 0, m;
  const re = /([\^_])(\{([^{}]*)\}|[+\-−]?[0-9]+|[A-Za-zα-ωΑ-Ω])/g;
  while ((m = re.exec(s))) {
    if (m.index > i) out.push({ t: s.slice(i, m.index) });
    out.push({ t: (m[3] != null ? m[3] : m[2]).replace(/-/g, "−"), va: m[1] === "^" ? "superscript" : "subscript" });
    i = re.lastIndex;
  }
  if (i < s.length) out.push({ t: s.slice(i) });
  return out.filter(x => x.t);
}
const coChiSo = s => /[\^_](\{[^{}]*\}|[+\-−]?[0-9]+|[A-Za-z])/.test(s);
/* chữ của công thức OMML (chỉ để xem trước) */
function chuToan(e) {
  const con = (el, ten) => [...el.childNodes].find(c => c.localName === ten);
  const di = el => {
    if (!el || el.nodeType !== 1) return "";
    const k = el.localName;
    if (k === "t") return el.textContent;
    if (/Pr$/.test(k)) return "";
    if (k === "f") return "(" + di(con(el, "num")) + ")/(" + di(con(el, "den")) + ")";
    if (k === "sSup") return di(con(el, "e")) + "^" + di(con(el, "sup"));
    if (k === "sSub") return di(con(el, "e")) + "_" + di(con(el, "sub"));
    if (k === "sSubSup") return di(con(el, "e")) + "_" + di(con(el, "sub")) + "^" + di(con(el, "sup"));
    if (k === "rad") { const dg = di(con(el, "deg")); return (dg ? dg : "") + "√(" + di(con(el, "e")) + ")"; }
    return [...el.childNodes].map(di).join("");
  };
  return di(e);
}
const MAU_CHU = { nls: "EE0000", nlai: "0070C0" };
const TEN_LOAI = { nls: "Năng lực số", nlai: "Năng lực AI" };
const VT_TEN = { mtBai: "Mục tiêu bài học (phần Năng lực)", mtHd: "a) Mục tiêu của hoạt động", tc: "d) Tổ chức thực hiện – bước giao nhiệm vụ", sp: "c) Sản phẩm" };

let GA = null;      // {ten, nguon, zip, xml, ps:[{i,text,cha}], cau}
let DS = TT.load("tichhop_ds", []);   // các nội dung tích hợp
const $ = id => document.getElementById(id);
const norm = s => String(s || "").normalize("NFC").replace(/[\s ]+/g, " ").trim();
const ngan = (s, n) => (s = norm(s)).length > n ? s.slice(0, n - 1) + "…" : s;

/* ---------- tra mã ---------- */
const khoaMa = s => norm(s).toUpperCase().replace(/[\s.]/g, "");
const BANG = {};
MA_NLS.forEach(x => BANG[khoaMa(x.ma)] = Object.assign({ loai: "nls" }, x));
MA_NLAI.forEach(x => BANG[khoaMa(x.ma)] = Object.assign({ loai: "nlai" }, x));
function traMa(ma) { return BANG[khoaMa(ma)] || null; }
function doanLoai(ma) {
  const k = khoaMa(ma);
  if (/^\d\d?TC\d[A-D]?$/.test(k)) return "nls";
  if (/^\d[A-D]\d\d$/.test(k)) return "nlai";
  return null;
}

/* ---------- đọc paragraphs ---------- */
function laDoan(p) {
  for (let a = p.parentNode; a; a = a.parentNode) {
    const n = a.localName;
    if (n === "txbxContent" || n === "Fallback") return false;
    if (n === "body") return true;
  }
  return false;
}
function chuCua(p) {
  let s = "";
  p.querySelectorAll ? null : null;
  const it = p.getElementsByTagName("*");
  for (const e of it) {
    if (e.namespaceURI !== W && e.namespaceURI !== MNS) continue;
    if (e.localName === "t") s += e.textContent;
    else if (e.localName === "tab") s += " ";
    else if (e.localName === "br") s += " ";
  }
  return norm(s);
}
function layDoan(doc) {
  const ps = [];
  for (const p of doc.getElementsByTagNameNS(W, "p")) if (laDoan(p)) ps.push({ p, i: ps.length, text: chuCua(p), cha: p.parentNode });
  return ps;
}

/* ---------- nhận ra khung giáo án ---------- */
const RE = {
  mt: /^(I\s*[.\-–:)]\s*)?M[ỤU]C TI[ÊE]U\b/,
  mt2: /^I\s*[.\-–:)]\s*Mục tiêu/i,
  tb: /^II\s*[.\-–:)]|^(THIẾT BỊ|CHUẨN BỊ|ĐỒ DÙNG)/,
  tt: /^III\s*[.\-–:)]|^TIẾN TRÌNH|^Tiến trình dạy học/,
  nl: /^((\d+|[a-dđ])\s*[.)]\s*)?(Về\s+)?(năng lực|NĂNG LỰC)\b/i,
  pc: /^((\d+|[a-dđ])\s*[.)]\s*)?(Về\s+)?(phẩm chất|PHẨM CHẤT)\b/i,
  hd: /^((\d+(\.\d+)*|[IVX]+|[A-ZĐ])\s*[.):\-–]\s*)?(Hoạt động|HOẠT ĐỘNG|HĐ)\s*(\d+(\.\d+)*[a-z]?|[IVX]+)?\s*[.:\-–)]/,
  hdKw: /^(([A-ZĐ]|\d+(\.\d+)*|[IVX]+)\s*[.):\-–]\s*)?(KHỞI ĐỘNG|MỞ ĐẦU|HÌNH THÀNH KIẾN THỨC|KHÁM PHÁ|LUYỆN TẬP|VẬN DỤNG|THỰC HÀNH|CỦNG CỐ|TÌM TÒI|MỞ RỘNG|Khởi động|Mở đầu|Hình thành kiến thức|Luyện tập|Vận dụng)\b/,
  khongHd: /^Hoạt động (của|nhóm|cá nhân|cặp)|^HOẠT ĐỘNG CỦA/i,
  a: /^a\s*[.)]\s*Mục tiêu|^Mục tiêu( của)?( hoạt động)?\s*:/i, b: /^b\s*[.)]\s*Nội dung|^Nội dung( hoạt động)?\s*:/i,
  c: /^c\s*[.)]\s*Sản phẩm|^Sản phẩm( dự kiến| học tập)?\s*:/i,
  d: /^d\s*[.)]\s*Tổ chức|^Tổ chức (thực hiện|hoạt động)/i,
  b1: /^(\*\s*)?(Bước\s*1\b|Chuyển giao nhiệm vụ|Giao nhiệm vụ)/i,
  b2: /^(\*\s*)?(Bước\s*2\b|Thực hiện nhiệm vụ)/i
};
function loaiHd(t) {
  t = t.toLowerCase();
  if (/khởi động|mở đầu/.test(t)) return "kd";
  if (/luyện tập|củng cố/.test(t)) return "lt";
  if (/vận dụng|mở rộng|tìm tòi/.test(t)) return "vd";
  if (/hình thành|khám phá|tìm hiểu|kiến thức mới|thực hành/.test(t)) return "ht";
  return "";
}
function capHd(t) { const m = t.match(/(\d+(?:\.\d+)+)/); return m ? m[1].split(".").length : 1; }
function phanTich(ps, themMoc) {
  const tim = (re, tu, den) => { for (let i = tu || 0; i < (den == null ? ps.length : den); i++) if (re.test(ps[i].text)) return i; return -1; };
  const cau = {};
  cau.mt = tim(RE.mt); if (cau.mt < 0) cau.mt = tim(RE.mt2);
  cau.tb = tim(RE.tb, cau.mt + 1);
  cau.tt = tim(RE.tt, Math.max(cau.mt, cau.tb) + 1);
  const hetMt = cau.tb > 0 ? cau.tb : (cau.tt > 0 ? cau.tt : Math.min(ps.length, cau.mt + 40));
  if (cau.mt >= 0) {
    cau.nl = tim(RE.nl, cau.mt + 1, hetMt); cau.pc = tim(RE.pc, cau.mt + 1, hetMt);
    // cuối phần Năng lực (trước Phẩm chất); không có mục Năng lực thì cuối phần Mục tiêu
    if (cau.pc > cau.nl && cau.nl >= 0) cau.mocMt = cau.pc - 1;
    else if (cau.nl >= 0) cau.mocMt = hetMt - 1;
    else if (cau.pc > cau.mt) cau.mocMt = cau.pc - 1;
    else cau.mocMt = hetMt - 1;
    while (cau.mocMt > cau.mt && (!ps[cau.mocMt].text || ps[cau.mocMt].cha !== ps[cau.mt].cha)) cau.mocMt--;
  } else cau.mocMt = -1;
  cau.vungMt = [Math.max(0, cau.mt), cau.mt >= 0 ? hetMt : Math.min(ps.length, 60)];
  // hoạt động
  const batDau = cau.tt >= 0 ? cau.tt + 1 : (cau.tb >= 0 ? cau.tb + 1 : 0);
  const hd = [];
  for (let i = batDau; i < ps.length; i++) {
    const t = ps[i].text;
    if (!t || t.length > 160 || RE.khongHd.test(t) || /^[-+•●▪*]/.test(t)) continue;
    if (RE.hd.test(t) || RE.hdKw.test(t) || (themMoc || []).includes(i)) hd.push({ i, ten: t, loai: loaiHd(t), cap: capHd(t) });
  }
  (themMoc || []).forEach(i => { if (i < batDau && !hd.some(h => h.i === i)) hd.push({ i, ten: ps[i].text, loai: loaiHd(ps[i].text), cap: 1 }); });
  hd.sort((x, y) => x.i - y.i);
  hd.forEach((h, k) => {
    h.het = k + 1 < hd.length ? hd[k + 1].i : ps.length;
    h.con = hd.slice(k + 1).some(x => x.i < (hd.find((y, j) => j > k && y.cap <= h.cap) || { i: ps.length }).i && x.cap > h.cap);
    const s = {};
    ["a", "b", "c", "d", "b1", "b2"].forEach(k2 => s[k2] = tim(RE[k2], h.i + 1, h.het));
    h.s = s;
    const cuoiKhoi = (dau, keTiep) => {   // đoạn cuối của khối bắt đầu ở "dau", cùng khung (thân bài/ô bảng)
      if (dau < 0) return -1;
      const het = keTiep > dau ? keTiep : h.het;
      let m = dau;
      for (let j = dau + 1; j < het; j++) if (ps[j].cha === ps[dau].cha && ps[j].text) m = j;
      return m;
    };
    const sau = x => Math.min(...["a", "b", "c", "d"].map(k2 => s[k2]).filter(v => v > x).concat([h.het]));
    const tieuDeBang = t => /^(hoạt động của|dự kiến sản phẩm|sản phẩm dự kiến|sản phẩm|nội dung|kết quả|ghi bảng)\b/i.test(t);
    const tim2 = (dk, tu) => { for (let j = tu; j < h.het; j++) if (ps[j].text && dk(ps[j], j)) return j; return -1; };
    // Tổ chức thực hiện: tự tìm theo thứ tự ưu tiên
    let tc = -1, cachTc = "";
    if (s.b1 >= 0) { tc = cuoiKhoi(s.b1, s.b2 > s.b1 ? s.b2 : -1); cachTc = "cuối bước giao nhiệm vụ"; }
    if (tc < 0 && s.d >= 0) {   // bảng 2 cột sau d): ô đầu tiên của hàng nội dung (bỏ hàng tiêu đề)
      const o = tim2(p => p.cha && p.cha.localName === "tc" && !tieuDeBang(p.text), s.d + 1);
      if (o >= 0) { tc = cuoiKhoi(o, h.het); cachTc = "cuối ô giao nhiệm vụ đầu tiên của bảng"; }
      else { tc = cuoiKhoi(s.d, h.het); cachTc = "cuối mục Tổ chức thực hiện"; }
    }
    if (tc < 0) {   // không có a) b) c) d): sau dòng việc của GV đầu tiên
      const gv = tim2(p => /^([-+•*]\s*)?(GV|Giáo viên|Nhiệm vụ|NV\s*\d|Bước\s*\d)(?=[\s:.,\d)]|$)/i.test(p.text), h.i + 1);
      if (gv >= 0) { tc = gv; cachTc = "sau dòng giao việc của GV"; }
    }
    if (tc < 0) { tc = cuoiKhoi(h.i, h.het); cachTc = "cuối hoạt động"; }
    h.moc = {
      mtHd: s.a >= 0 ? cuoiKhoi(s.a, sau(s.a)) : h.i,
      sp: s.c >= 0 ? cuoiKhoi(s.c, sau(s.c)) : (s.a >= 0 ? cuoiKhoi(s.a, sau(s.a)) : h.i),
      tc
    };
    h.cach = { mtHd: s.a >= 0 ? "cuối mục a) Mục tiêu" : "ngay dưới tên hoạt động", tc: cachTc, sp: s.c >= 0 ? "cuối mục c) Sản phẩm" : "dưới mục tiêu hoạt động" };
  });
  // chọn hoạt động "mẹ" (VD Hoạt động 2 gồm 2.1, 2.2) mà nó không có mục riêng → dùng chỗ của hoạt động con đầu tiên
  hd.forEach((h, k) => {
    const coMuc = ["a", "b", "c", "d", "b1"].some(k2 => h.s[k2] >= 0);
    const con = hd[k + 1];
    if (h.con && !coMuc && con) { h.moc = con.moc; h.cach = Object.assign({}, con.cach, { ghi: "trong " + ngan(con.ten, 50) }); }
  });
  cau.hd = hd;
  return cau;
}

/* ---------- tạo đoạn mới (mượn định dạng đoạn mốc) ---------- */
const THU_TU_RPR = "rStyle rFonts b bCs i iCs caps smallCaps strike dstrike outline shadow emboss imprint noProof snapToGrid vanish webHidden color spacing w kern position sz szCs highlight u effect bdr shd fitText vertAlign rtl cs em lang eastAsianLayout specVanish oMath".split(" ");
function datCon(rpr, ten, val) {
  let cu = null;
  for (const c of rpr.childNodes) if (c.localName === ten) cu = c;
  if (cu) rpr.removeChild(cu);
  const e = rpr.ownerDocument.createElementNS(W, "w:" + ten);
  if (val != null) e.setAttributeNS(W, "w:val", val);
  const vt = THU_TU_RPR.indexOf(ten);
  let truoc = null;
  for (const c of rpr.childNodes) if (c.nodeType === 1 && THU_TU_RPR.indexOf(c.localName) > vt) { truoc = c; break; }
  rpr.insertBefore(e, truoc);
}
function boCon(cha, ten) { for (const c of [...cha.childNodes]) if (ten.includes(c.localName)) cha.removeChild(c); }
function rprMau(p) {
  let mau = null;
  for (const r of p.getElementsByTagNameNS(W, "r")) {
    const t = [...r.childNodes].find(c => c.localName === "t");
    if (t && t.textContent.trim()) { const rp = [...r.childNodes].find(c => c.localName === "rPr"); mau = rp || mau || r.ownerDocument.createElementNS(W, "w:rPr"); if (rp && ![...rp.childNodes].some(c => c.localName === "b")) break; }
  }
  return mau;
}
function taoDoan(doc, mocP, phan, loai) {
  const p = doc.createElementNS(W, "w:p");
  const pprGoc = [...mocP.childNodes].find(c => c.localName === "pPr");
  if (pprGoc) {
    const ppr = pprGoc.cloneNode(true);
    boCon(ppr, ["sectPr", "rPr", "outlineLvl", "pageBreakBefore", "numPr", "pPrChange", "keepNext"]);
    for (const c of [...ppr.childNodes]) if (c.localName === "pStyle" && /heading|title|tieu|muc|toc/i.test(c.getAttributeNS(W, "val") || c.getAttribute("w:val") || "")) ppr.removeChild(c);
    p.appendChild(ppr);
  }
  const goc = rprMau(mocP);
  phan.forEach(([chu, dam]) => {
    if (!chu) return;
    chiaChiSo(chu).forEach(doan => {
      const r = doc.createElementNS(W, "w:r");
      const rpr = goc ? goc.cloneNode(true) : doc.createElementNS(W, "w:rPr");
      boCon(rpr, ["rStyle", "b", "bCs", "i", "iCs", "u", "color", "highlight", "shd", "caps", "smallCaps", "strike", "dstrike", "vertAlign", "vanish", "rPrChange", "position", "oMath"]);
      if (dam) { datCon(rpr, "b"); datCon(rpr, "bCs"); }
      datCon(rpr, "color", MAU_CHU[loai]);
      if (doan.va) datCon(rpr, "vertAlign", doan.va);
      r.appendChild(rpr);
      const t = doc.createElementNS(W, "w:t");
      t.setAttributeNS(XNS, "xml:space", "preserve"); t.textContent = doan.t;
      r.appendChild(t); p.appendChild(r);
    });
  });
  return p;
}

/* ---------- câu chữ chèn vào ---------- */
const cham = s => (s = norm(s)) && !/[.!?…:;]$/.test(s) ? s + "." : s;
const thuong = s => (s = norm(s)) && !/^\S[A-ZĐ0-9]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
function tenHdNgan(h) { return h ? ngan(h.ten.replace(/^((\d+(\.\d+)*|[IVX]+|[A-ZĐ])\s*[.)]\s*)/, "").replace(/[.:]\s*$/, ""), 70) : ""; }
function cauChen(x, vt, h) {
  const nhan = x.loai === "nls" ? "NLS" : "NLAI";
  const ma = norm(x.ma);
  if (vt === "mtBai") return [[`- ${TEN_LOAI[x.loai]} (${nhan} ${ma}): `, true], [cham(x.nd).replace(/\.$/, "") + (norm(x.viec) ? ". Cụ thể: " + thuong(x.viec).replace(/[.]$/, "") : "") + (h ? ` (${tenHdNgan(h)})` : "") + ".", false]];
  if (vt === "mtHd") return [[`- Tích hợp ${TEN_LOAI[x.loai]} – ${nhan} ${ma}: `, true], [cham(x.nd), false]];
  if (vt === "tc") return [[`★ Tích hợp ${nhan} ${ma}: `, true], [cham(x.viec), false]];
  if (vt === "sp") return [[`- Sản phẩm tích hợp ${nhan} ${ma}: `, true], [cham(x.sp), false]];
  return [];
}

/* ---------- áp tích hợp vào một bản sao XML ---------- */
function apTichHop(xmlGoc, chiXem) {
  const doc = new DOMParser().parseFromString(xmlGoc, "application/xml");
  const ps = layDoan(doc);
  const cau = phanTich(ps, GA.themMoc);
  const moi = new Set(), sauMoc = new Map(), canhBao = [];
  const chen = (iMoc, phan, loai) => {
    if (iMoc == null || iMoc < 0 || !ps[iMoc] || !phan.length) return false;
    const moc = ps[iMoc].p, np = taoDoan(doc, moc, phan, loai);
    const truoc = sauMoc.get(iMoc) || moc;
    truoc.parentNode.insertBefore(np, truoc.nextSibling);
    sauMoc.set(iMoc, np); moi.add(np); return true;
  };
  // thứ tự: mục tiêu bài trước, rồi theo hoạt động
  DS.filter(x => x.bat !== false && norm(x.ma) && norm(x.nd)).forEach(x => {
    const h = cau.hd.find(y => y.i === x.hd);
    const vts = x.vt || {};
    if (vts.mtBai) { const i = x.moc && x.moc.mtBai != null ? x.moc.mtBai : cau.mocMt; if (!chen(i, cauChen(x, "mtBai", h), x.loai)) canhBao.push(`${x.ma}: giáo án không có phần “Mục tiêu” — app bỏ qua dòng mục tiêu bài, vẫn chèn vào hoạt động.`); }
    if (!h) { if (vts.mtHd || vts.tc || vts.sp) canhBao.push(`${x.ma}: chưa chọn hoạt động.`); return; }
    ["mtHd", "sp", "tc"].forEach(vt => {
      if (!vts[vt]) return;
      if (vt === "tc" && !norm(x.viec)) { canhBao.push(`${x.ma}: chưa ghi nội dung cần tích hợp (GV – HS làm gì).`); return; }
      if (vt === "sp" && !norm(x.sp)) { canhBao.push(`${x.ma}: chưa ghi sản phẩm.`); return; }
      const i = x.moc && x.moc[vt] != null ? x.moc[vt] : h.moc[vt];
      chen(i, cauChen(x, vt, h), x.loai);
    });
  });
  if (chiXem) return { doc, moi, canhBao };
  let s = new XMLSerializer().serializeToString(doc);
  if (!/^<\?xml/.test(s)) s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' + s;
  // KIỂM: đọc lại file vừa ghi, đếm công thức/hình/chỉ số của phần gốc — phải đúng bằng bản gốc
  const doc2 = new DOMParser().parseFromString(s, "application/xml");
  if (doc2.getElementsByTagName("parsererror").length) throw new Error("File ghi ra bị lỗi cấu trúc — em dừng, không xuất.");
  const goc = demVat(new DOMParser().parseFromString(xmlGoc, "application/xml"));
  const cMoi = demVat(doc), cMoiChen = {};
  const tong2 = demVat(doc2), chiGoc = demVat(doc, moi);
  Object.keys(goc).forEach(k => cMoiChen[k] = cMoi[k] - chiGoc[k]);
  const lech = Object.keys(goc).filter(k => goc[k] !== chiGoc[k] || tong2[k] !== goc[k] + cMoiChen[k]);
  if (lech.length) throw new Error("Phần gốc bị thay đổi ở: " + lech.map(k => VAT[k]).join(", ") + " — em dừng, không xuất.");
  return { xml: s, moi, canhBao, giu: goc };
}

/* ---------- PDF → Word dựng lại ---------- */
function napThuVien(url) { return new Promise((ok, loi) => { const s = document.createElement("script"); s.src = url; s.onload = ok; s.onerror = () => loi(new Error("Không tải được bộ đọc PDF (cần có mạng).")); document.head.appendChild(s); }); }
async function docPdf(buf) {
  if (!window.pdfjsLib) {
    await napThuVien("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const doan = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const pg = await pdf.getPage(n), vp = pg.getViewport({ scale: 1 });
    const tc = await pg.getTextContent();
    try { await pg.getOperatorList(); } catch (e) {}
    const dam = {};
    const laDam = fn => { if (fn in dam) return dam[fn]; let ten = ""; try { const f = pg.commonObjs.get(fn); ten = (f && (f.name || f.loadedName)) || ""; } catch (e) {} return dam[fn] = /bold|black|heavy|demi|semibold|,B/i.test(ten); };
    const it = tc.items.filter(x => x.str && x.str.trim()).map(x => ({ s: x.str, x: x.transform[4], y: x.transform[5], h: Math.abs(x.transform[3]) || x.height || 10, w: x.width, b: laDam(x.fontName) }));
    // 1) gom thành dòng theo độ cao (chỉ số trên/dưới lệch ít nên vẫn vào cùng dòng), 2) trong dòng xếp theo x
    it.sort((p, q) => q.y - p.y);
    const cum = [];
    it.forEach(x => {
      const c = cum[cum.length - 1];
      if (c && c.y0 - x.y <= Math.max(c.h, x.h) * .7 && x.y - c.yMin <= Math.max(c.h, x.h) * .7) { c.ds.push(x); c.h = Math.max(c.h, x.h); c.yMin = Math.min(c.yMin, x.y); }
      else cum.push({ y0: x.y, yMin: x.y, h: x.h, ds: [x] });
    });
    const dong = [];
    cum.forEach(c => {
      c.ds.sort((p, q) => p.x - q.x);
      const chinh = c.ds.reduce((m, x) => x.h > m.h ? x : m, c.ds[0]), H = chinh.h, Y = chinh.y;
      const d = { s: "", x: c.ds[0].x, x2: c.ds[0].x, y: Y, h: H, nb: 0, n: 0 };
      c.ds.forEach(x => {
        const gap = x.x - d.x2, nho = x.h < H * .82;
        let chu = x.s;
        if (nho && x.y > Y + H * .18) chu = "\u0001S" + x.s + "\u0002";          // chỉ số trên: x², 10⁻³
        else if (nho && x.y < Y - H * .06) chu = "\u0001B" + x.s + "\u0002";     // chỉ số dưới: H₂O
        d.s += (!d.s || chu !== x.s ? "" : gap > H * 1.5 ? "   " : gap > H * .15 && !/\s$/.test(d.s) && !/^\s/.test(x.s) ? " " : "") + chu;
        d.x2 = x.x + x.w; d.nb += x.b ? x.s.length : 0; d.n += x.s.length;
      });
      dong.push(d);
    });
    if (!dong.length) continue;
    const trai = Math.min(...dong.map(d => d.x)), phai = Math.max(...dong.map(d => d.x2));
    let cu = null;
    dong.forEach(d => {
      const t = norm(d.s), b = d.nb > d.n * .6;
      const giua = d.x > trai + 30 && Math.abs((d.x + d.x2) / 2 - (trai + phai) / 2) < 25 && d.x2 - d.x < (phai - trai) * .75;
      const moiDoan = !cu || cu.y - d.y > d.h * 1.9 || /^([-–+•●▪*]|\d+(\.\d+)*\s*[.)]|[a-dđ]\s*[.)]|[IVX]+\s*[.\-–]|Hoạt động|HOẠT ĐỘNG|Bước\s*\d)/.test(t) || /[:.;!?]$/.test(cu.text) || b !== cu.b || giua || cu.giua;
      if (moiDoan) { cu = { text: t, b, giua, y: d.y }; doan.push(cu); }
      else { cu.text += " " + t; cu.y = d.y; }
    });
  }
  if (!doan.length) throw new Error("File PDF này là bản quét (ảnh), app không đọc được chữ. Thầy cô dùng file Word gốc giúp ạ.");
  const ex = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const runs = d => d.text.split(/(\u0001[SB][^\u0002]*\u0002)/).filter(Boolean).map(t => {
    const va = t[0] === "\u0001" ? (t[1] === "S" ? "superscript" : "subscript") : "";
    if (va) t = t.slice(2, -1);
    return `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>${d.b ? "<w:b/><w:bCs/>" : ""}<w:sz w:val="26"/><w:szCs w:val="26"/>${va ? `<w:vertAlign w:val="${va}"/>` : ""}</w:rPr><w:t xml:space="preserve">${ex(t)}</w:t></w:r>`;
  }).join("");
  const body = doan.map(d => `<w:p><w:pPr><w:spacing w:after="60" w:line="276" w:lineRule="auto"/>${d.giua ? '<w:jc w:val="center"/>' : '<w:jc w:val="both"/>'}</w:pPr>${runs(d)}</w:p>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<w:document xmlns:w="${W}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const zip = new JSZip();
  zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  zip.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  zip.file("word/document.xml", xml);
  return { zip, xml, trang: pdf.numPages };
}

/* ---------- nạp file ---------- */
async function napFile(f) {
  const ten = f.name, duoi = (ten.split(".").pop() || "").toLowerCase();
  if (duoi === "doc") { TT.toast("File .doc đời cũ: mở bằng Word → Lưu thành (Save As) → chọn .docx rồi đưa lên lại ạ.", "loi"); TT.buzz(); return; }
  if (!["docx", "pdf"].includes(duoi)) { TT.toast("App nhận file Word (.docx) hoặc PDF.", "loi"); TT.buzz(); return; }
  $("trangThai").innerHTML = "⏳ Đang đọc <b>" + TT.esc(ten) + "</b>…";
  try {
    const buf = await f.arrayBuffer();
    let zip, xml, nguon = duoi, ghiChu = "";
    if (duoi === "docx") {
      zip = await JSZip.loadAsync(buf);
      const f2 = zip.file("word/document.xml");
      if (!f2) throw new Error("File này không phải giáo án Word hợp lệ.");
      xml = await f2.async("string");
    } else {
      const r = await docPdf(buf); zip = r.zip; xml = r.xml;
      ghiChu = `PDF ${r.trang} trang đã được dựng lại thành Word (chữ Times New Roman 13). Bảng, hình, khung trong PDF <b>không giữ được</b>; chỉ số trên/dưới (x², H₂O) app cố giữ, còn <b>phân số, căn, công thức nhiều tầng sẽ bị vỡ</b>. Môn Toán, KHTN, Vật lí, Hoá: thầy cô đưa <b>file Word gốc</b> để giữ nguyên công thức.`;
    }
    GA = { ten: ten.replace(/\.(docx|pdf)$/i, ""), nguon, zip, xml, ghiChu, themMoc: [] };
    phanTichLai(true);
    TT.ting(); TT.toast("Đã đọc xong giáo án", "ok");
  } catch (e) { GA = null; $("trangThai").textContent = "❌ " + (e.message || "Không đọc được file."); TT.buzz(); veHet(); }
}
function phanTichLai(fileMoi) {
  const doc = new DOMParser().parseFromString(GA.xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) throw new Error("Không đọc được nội dung file Word.");
  GA.ps = layDoan(doc); GA.cau = phanTich(GA.ps, GA.themMoc);
  if (fileMoi) GA.vat = moTaVat(demVat(doc));
  // file mới: tìm lại hoạt động theo TÊN đã chọn, bỏ chỗ chèn chọn tay của file cũ
  DS.forEach(x => {
    const h = GA.cau.hd.find(y => y.i === x.hd);
    if (fileMoi) x.moc = {};
    if (h && (!x.hdTen || norm(h.ten) === norm(x.hdTen))) return;
    const h2 = x.hdTen && GA.cau.hd.find(y => norm(y.ten) === norm(x.hdTen));
    x.hd = h2 ? h2.i : null;
  });
  luu();
  veHet();
}

/* ---------- giao diện ---------- */
function luu() { TT.save("tichhop_ds", DS); }
function moiMuc(loai) { return { id: TT.uid(), loai: loai || "nls", ma: "", nd: "", hd: null, cuThe: "", viec: "", sp: "", vt: { mtBai: true, mtHd: true, tc: true, sp: false }, moc: {} }; }
function veKhung() {
  const k = $("khungGa");
  if (!GA) { k.innerHTML = '<p class="mo">Chưa có giáo án. Đưa file lên ở bước 1.</p>'; $("trangThai").innerHTML = $("trangThai").innerHTML.startsWith("❌") ? $("trangThai").innerHTML : "Chưa có file."; return; }
  const c = GA.cau, ps = GA.ps;
  $("trangThai").innerHTML = `✅ <b>${TT.esc(GA.ten)}</b>.${GA.nguon === "pdf" ? "pdf" : "docx"} · ${ps.length} đoạn · nhận ra ${c.hd.length} hoạt động` + (GA.vat && GA.nguon === "docx" ? `<div class="giu">🛡️ Có ${TT.esc(GA.vat)} — app không động vào, file tải về giữ nguyên.</div>` : "") + (GA.ghiChu ? `<div class="canh">⚠️ ${GA.ghiChu}</div>` : "");
  const dong = [];
  dong.push(`<div class="kg ${c.mocMt >= 0 ? "ok" : "thieu"}"><b>Mục tiêu bài học</b> ${c.nl >= 0 ? "· mục Năng lực: “" + TT.esc(ngan(ps[c.nl].text, 50)) + "”" : '· <span class="do">chưa thấy mục “Năng lực”</span>'}</div>`);
  c.hd.forEach(h => {
    const co = ["a", "b", "c", "d"].filter(k2 => h.s[k2] >= 0);
    dong.push(`<div class="kg ok" style="margin-left:${(h.cap - 1) * 18}px"><span class="the-hd l-${h.loai || "x"}">${{ kd: "Khởi động", ht: "Hình thành KT", lt: "Luyện tập", vd: "Vận dụng" }[h.loai] || "Hoạt động"}</span> ${TT.esc(ngan(h.ten, 80))} <span class="mo">${co.length ? "· có mục " + co.join(", ") : h.con ? "· (gồm các hoạt động con)" : "· không thấy mục a, b, c, d"}${h.s.b1 >= 0 ? " · có Bước 1" : ""}</span></div>`);
  });
  if (!c.hd.length) dong.push('<div class="kg thieu">Chưa nhận ra hoạt động nào. Bấm <b>＋ Thêm mốc hoạt động</b> để tự chọn tên hoạt động trong giáo án.</div>');
  k.innerHTML = dong.join("");
  // ô thêm mốc
  const tu = c.tt >= 0 ? c.tt + 1 : 0;
  $("chonMoc").innerHTML = '<option value="">— chọn một dòng tên hoạt động —</option>' + ps.slice(tu).filter(x => x.text && x.text.length < 140 && !c.hd.some(h => h.i === x.i)).map(x => `<option value="${x.i}">${TT.esc(ngan(x.text, 90))}</option>`).join("");
}
function luaChonHd(x) {
  if (!GA) return '<option value="">(đưa giáo án lên trước)</option>';
  return '<option value="">— chọn hoạt động —</option>' + GA.cau.hd.map(h => `<option value="${h.i}" ${x.hd === h.i ? "selected" : ""}>${"  ".repeat(h.cap - 1)}${TT.esc(ngan(h.ten, 70))}${h.con ? " (có HĐ con)" : ""}</option>`).join("");
}
function luaChonMoc(x, vt) {
  if (!GA) return "";
  const c = GA.cau, h = c.hd.find(y => y.i === x.hd);
  let tu, den, md;
  if (vt === "mtBai") { [tu, den] = c.vungMt; md = c.mocMt; }
  else { if (!h) return ""; tu = h.i; den = h.het; md = h.moc[vt]; }
  const chon = x.moc && x.moc[vt] != null ? x.moc[vt] : md;
  const ds = GA.ps.slice(tu, den).filter(p => p.text);
  return `<select data-moc="${vt}" title="Chèn ngay SAU đoạn này">` + ds.map(p => `<option value="${p.i}" ${p.i === chon ? "selected" : ""}>${p.i === md ? "★ " : ""}sau: ${TT.esc(ngan(p.text, 64))}</option>`).join("") + "</select>";
}
/* Dòng báo: app TỰ chèn vào đâu (thầy cô không phải chọn) */
function veTuDong(x, h) {
  if (!GA) return '<div class="tudong cho">📍 Đưa giáo án lên, chọn hoạt động — app sẽ tự tìm chỗ chèn.</div>';
  if (!h) return '<div class="tudong cho">📍 Chọn <b>hoạt động</b> ở trên — app tự tìm chỗ chèn trong giáo án.</div>';
  const c = GA.cau, vts = x.vt || {}, dong = [];
  const chu = i => i != null && i >= 0 && GA.ps[i] ? "“" + TT.esc(ngan(GA.ps[i].text, 60)) + "”" : "";
  const mocCua = vt => x.moc && x.moc[vt] != null ? x.moc[vt] : (vt === "mtBai" ? c.mocMt : h.moc[vt]);
  const tay = vt => x.moc && x.moc[vt] != null ? ' <span class="tay">đã sửa tay</span>' : "";
  if (vts.mtBai) dong.push(mocCua("mtBai") >= 0 ? `<li><b>Mục tiêu bài học</b> — ${c.nl >= 0 ? "cuối phần Năng lực" : "cuối phần Mục tiêu"}, sau ${chu(mocCua("mtBai"))}${tay("mtBai")}</li>` : `<li class="do">Mục tiêu bài học — giáo án không có phần Mục tiêu, bỏ qua</li>`);
  if (vts.mtHd) dong.push(`<li><b>Mục tiêu của hoạt động</b> — ${h.cach.mtHd}, sau ${chu(mocCua("mtHd"))}${tay("mtHd")}</li>`);
  if (vts.sp) dong.push(`<li><b>Sản phẩm</b> — ${h.cach.sp}, sau ${chu(mocCua("sp"))}${tay("sp")}</li>`);
  if (vts.tc) dong.push(`<li><b>Tổ chức thực hiện</b> — ${h.cach.tc}, sau ${chu(mocCua("tc"))}${tay("tc")}${norm(x.viec) ? "" : ' <span class="do">(cần ghi nội dung cần tích hợp)</span>'}</li>`);
  return `<div class="tudong">📍 <b>App tự chèn vào ${dong.length} chỗ</b>${h.cach.ghi ? " (" + TT.esc(h.cach.ghi) + ")" : ""}:<ol>${dong.join("")}</ol></div>`;
}
function veDs() {
  const k = $("dsTich");
  if (!DS.length) { k.innerHTML = '<p class="mo">Chưa có nội dung tích hợp. Bấm <b>＋ NLS</b> / <b>＋ NLAI</b> hoặc dán dòng tích hợp từ PPCT.</p>'; return; }
  const dem = {};
  DS.forEach(x => { const kk = khoaMa(x.ma); if (kk) dem[kk] = (dem[kk] || 0) + 1; });
  k.innerHTML = DS.map((x, n) => {
    const tra = traMa(x.ma), h = GA && GA.cau.hd.find(y => y.i === x.hd);
    const lap = dem[khoaMa(x.ma)] > 1;
    return `<div class="muc l-${x.loai}" data-id="${x.id}">
      <div class="dau-muc"><span class="so">${n + 1}</span>
        <div class="chon-loai"><button data-loai="nls" class="${x.loai === "nls" ? "chon" : ""}">NLS · đỏ</button><button data-loai="nlai" class="${x.loai === "nlai" ? "chon" : ""}">NLAI · xanh</button></div>
        <button class="nut phu nho" data-xoa title="Xoá nội dung này">🗑</button></div>
      <div class="hang">
        <label class="o" style="flex:0 1 170px">Mã tích hợp<input data-f="ma" list="dsMa" value="${TT.esc(x.ma)}" placeholder="${x.loai === "nls" ? "1.1.TC2c" : "9.B2.1"}"></label>
        <label class="o" style="flex:1 1 300px">Hoạt động được tích hợp<select data-f="hd">${luaChonHd(x)}</select></label>
      </div>
      ${tra ? `<div class="tra">📖 Bảng tra: <b>${TT.esc(tra.ma)}</b>${tra.tp ? " · " + TT.esc(tra.tp) : ""}${khoaMa(x.ma) && norm(x.nd) !== norm(tra.nd) ? ` <button class="nut phu nho" data-laynd>Dùng câu bảng tra</button>` : ""}</div>` : norm(x.ma) ? '<div class="tra canh">Mã này chưa có trong bảng tra của tổ — thầy cô tự ghi nội dung chỉ báo.</div>' : ""}
      ${lap ? '<div class="tra canh">⚠️ Mã này đang tích hợp ở hơn một chỗ. Luật của tổ: mỗi nội dung tích hợp chỉ ở <b>một</b> hoạt động.</div>' : ""}
      <label class="o">Nội dung chỉ báo (theo mã)<textarea data-f="nd" rows="2" placeholder="VD: Mô tả được cách truy cập dữ liệu, thông tin…">${TT.esc(x.nd)}</textarea></label>
      <label class="o">Nội dung cần tích hợp (GV – HS làm gì trong hoạt động)<textarea data-f="viec" rows="3" placeholder="VD: GV chiếu video số về giâm, chiết, ghép; HS quan sát, ghi lại các bước vào phiếu học tập.">${TT.esc(x.viec)}</textarea></label>
      <div class="mo nho2">🔬 Có công thức: gõ <code>x^2</code> → x<sup>2</sup>, <code>H_2O</code> → H<sub>2</sub>O, <code>10^{-3}</code> → 10<sup>−3</sup>, <code>SO_4^{2-}</code> → SO<sub>4</sub><sup>2−</sup> (xem ở bước 4). Phân số, căn: tải về rồi chèn bằng Word/MathType vào đoạn màu.</div>
      <div class="hang" style="margin-top:6px"><button class="nut phu nho" data-goiy>💡 Gợi ý câu chữ</button><span class="mo nho2">Gợi ý là câu khung — thầy cô sửa cho đúng bài.</span></div>
      ${veTuDong(x, h)}
      <details class="vitri" ${x.mo ? "open" : ""}><summary class="mo nho2">⚙️ App đặt chưa đúng chỗ? Sửa tại đây (thường không cần)</summary>
        ${Object.keys(VT_TEN).map(vt => `<div class="vt"><label class="tick"><input type="checkbox" data-vt="${vt}" ${x.vt && x.vt[vt] ? "checked" : ""}> ${VT_TEN[vt]}</label>${x.vt && x.vt[vt] ? luaChonMoc(x, vt) : ""}</div>`).join("")}
        ${x.vt && x.vt.sp ? `<label class="o">Sản phẩm tích hợp<input data-f="sp" value="${TT.esc(x.sp)}" placeholder="VD: Sơ đồ các bước do nhóm tạo bằng Canva"></label>` : ""}
        <div class="mo nho2">★ = chỗ app tự chọn. Đoạn mới được chèn ngay <b>sau</b> đoạn đã chọn, mượn đúng phông, cỡ chữ, lề của đoạn đó.</div>
      </details>
    </div>`;
  }).join("");
}
function veXem() {
  const k = $("xemTruoc");
  if (!GA) { k.innerHTML = '<p class="mo">Đưa giáo án lên để xem trước.</p>'; $("canhBao").innerHTML = ""; return; }
  let r;
  try { r = apTichHop(GA.xml, true); } catch (e) { k.textContent = "Lỗi xem trước: " + e.message; return; }
  const ps = layDoan(r.doc);
  const chiMoi = $("chiQuanh").checked;
  const giu = new Set();
  if (chiMoi) ps.forEach((p, i) => { if (r.moi.has(p.p)) for (let j = i - 2; j <= i + 1; j++) giu.add(j); });
  let html = "", bo = false;
  ps.forEach((p, i) => {
    if (chiMoi && !giu.has(i)) { if (!bo) { html += '<div class="bo">⋯</div>'; bo = true; } return; }
    bo = false;
    const la = r.moi.has(p.p);
    const loai = la ? ([...p.p.getElementsByTagNameNS(W, "color")][0] || {}).getAttribute?.("w:val") : null;
    const trongBang = p.cha && p.cha.localName === "tc";
    html += `<p class="${la ? "moi " + (loai === MAU_CHU.nls ? "c-nls" : "c-nlai") : ""}${trongBang ? " o-bang" : ""}">${chuCoDam(p.p) || "&nbsp;"}</p>`;
  });
  k.innerHTML = html || '<p class="mo">(giáo án trống)</p>';
  $("soMoi").textContent = r.moi.size;
  $("canhBao").innerHTML = r.canhBao.map(c => `<div>⚠️ ${TT.esc(c)}</div>`).join("");
}
function chuCoDam(p) {   // chữ của đoạn để xem trước: đậm, chỉ số trên/dưới, công thức, MathType, hình
  let s = "";
  const giaTri = e => e.getAttributeNS(W, "val") || e.getAttribute("w:val") || "";
  const chip = (lop, chu, tieuDe) => `<span class="${lop}" title="${tieuDe}">${chu}</span>`;
  const run = r => {
    const rp = [...r.childNodes].find(c => c.localName === "rPr");
    const b = rp && [...rp.childNodes].find(c => c.localName === "b");
    const dam = b && !/^(0|false|off)$/i.test(giaTri(b));
    const va = rp && [...rp.childNodes].find(c => c.localName === "vertAlign");
    let t = "";
    for (const c of r.childNodes) {
      const k = c.localName;
      if (k === "t") t += TT.esc(c.textContent);
      else if (k === "tab" || k === "br") t += " ";
      else if (k === "object" || k === "pict") {
        const ole = c.getElementsByTagName("*"); let prog = "";
        for (const e of ole) if (e.localName === "OLEObject") prog = e.getAttribute("ProgID") || "";
        t += /equation|dsmt|mathtype/i.test(prog) ? chip("vat", "∑ MathType", "Công thức MathType/Equation — giữ nguyên") : chip("vat", "▣ đối tượng", "Đối tượng nhúng — giữ nguyên");
      } else if (k === "drawing") t += chip("vat", "🖼 hình", "Hình — giữ nguyên");
    }
    if (!t) return "";
    if (va && /superscript/.test(giaTri(va))) t = "<sup>" + t + "</sup>";
    else if (va && /subscript/.test(giaTri(va))) t = "<sub>" + t + "</sub>";
    return dam ? "<b>" + t + "</b>" : t;
  };
  const di = n => {
    for (const c of n.childNodes) {
      if (c.nodeType !== 1) continue;
      const k = c.localName;
      if (k === "oMath" && c.namespaceURI === MNS) { s += chip("ct", TT.esc(chuToan(c)), "Công thức Word — giữ nguyên"); continue; }
      if (k === "r" && c.namespaceURI === W) { s += run(c); continue; }
      if (k === "pPr" || k === "txbxContent") continue;
      di(c);
    }
  };
  di(p);
  return s;
}
function veHet() { veKhung(); veDs(); veXem(); }

/* ---------- gợi ý câu khung ---------- */
const GOI_Y_NLS = {
  1: "GV cung cấp tài liệu số (video, hình ảnh, tệp bài giảng) về nội dung bài; HS truy cập, quan sát, chọn lọc thông tin cần thiết để hoàn thành nhiệm vụ",
  2: "HS chia sẻ, trao đổi kết quả của nhóm qua công cụ số lớp đang dùng (nhóm lớp, Padlet, Google Drive…) dưới sự hướng dẫn của GV; ghi rõ nguồn khi chia sẻ",
  3: "HS dùng phần mềm (PowerPoint, Canva, Word…) tạo sản phẩm số (sơ đồ, áp phích, bài trình chiếu) trình bày kết quả; dùng hình ảnh đúng bản quyền",
  4: "GV nêu tình huống trong môi trường số; HS thảo luận cách bảo vệ thiết bị, dữ liệu cá nhân và sức khoẻ khi dùng thiết bị số",
  5: "HS lựa chọn công cụ số phù hợp (máy tính, ứng dụng, phần mềm mô phỏng…) để giải quyết nhiệm vụ; tự xử lí sự cố kĩ thuật đơn giản khi sử dụng",
  6: "GV hướng dẫn HS dùng công cụ AI phù hợp để hỗ trợ nhiệm vụ học tập; HS đối chiếu kết quả AI với SGK và tự quyết định nội dung cuối cùng"
};
const VIEC_THEO_HD = { kd: "để khơi gợi vấn đề mở đầu bài", ht: "để tìm hiểu kiến thức mới", lt: "để luyện tập, củng cố", vd: "để vận dụng vào thực tế", "": "" };
function goiY(x) {
  const h = GA && GA.cau.hd.find(y => y.i === x.hd), them = h ? VIEC_THEO_HD[h.loai] : "";
  let viec;
  if (x.loai === "nls") {
    const mien = (norm(x.ma).match(/^(\d)/) || [])[1];
    viec = (GOI_Y_NLS[mien] || GOI_Y_NLS[1]) + (them ? " " + them : "");
  } else {
    const lop = +(norm(x.ma).match(/^(\d)/) || [])[1];
    viec = (lop && lop <= 7 ? "GV thao tác công cụ AI trên màn hình chiếu (HS chưa tự đăng nhập); HS quan sát, nêu nhận xét về kết quả AI đưa ra" : "GV hướng dẫn HS đặt câu lệnh cho công cụ AI (Gemini, ChatGPT, Canva…); HS kiểm chứng kết quả AI với SGK, chỉnh sửa và chịu trách nhiệm với sản phẩm cuối cùng") + (them ? " " + them : "") + "; không nhập thông tin cá nhân vào công cụ AI";
  }
  return { cuThe: x.nd ? "HS " + thuong(x.nd).replace(/\.$/, "") + (h ? " trong " + thuong(tenHdNgan(h)) : "") : "", viec };
}

/* ---------- dán dòng tích hợp từ PPCT ---------- */
function tachPPCT(s) {
  s = norm(s);
  const reMa = /(\d\.\d\.?\s*TC\s*\d\s*[a-d])|(\b\d\.[A-D]\d\.\d\b)/gi;
  const ds = []; let m; const vt = [];
  while ((m = reMa.exec(s))) vt.push({ i: m.index, ma: m[0].replace(/\s+/g, ""), het: reMa.lastIndex });
  vt.forEach((v, k) => {
    let phan = s.slice(v.het, k + 1 < vt.length ? vt[k + 1].i : s.length);
    phan = phan.replace(/^[\s:.\-–]+/, "").replace(/[-–\s]*(NLS|NLAI|NL\s*AI|Năng lực số|Năng lực AI)\s*[:\-–]?\s*$/i, "").replace(/[\s;,\-–]+$/, "");
    const loai = doanLoai(v.ma) || "nls", tra = traMa(v.ma);
    const x = moiMuc(loai); x.ma = v.ma; x.nd = tra ? tra.nd : ""; x.viec = phan; x.cuThe = phan;
    ds.push(x);
  });
  return ds;
}

/* ---------- xuất Word ---------- */
async function xuatWord() {
  if (!GA) { TT.toast("Đưa giáo án lên trước ạ", "loi"); TT.buzz(); return; }
  let r;
  try { r = apTichHop(GA.xml, false); } catch (e) { TT.toast(e.message, "loi"); TT.buzz(); $("canhBao").innerHTML = `<div>❌ ${TT.esc(e.message)}</div>`; return; }
  if (!r.moi.size) { TT.toast("Chưa có đoạn tích hợp nào để chèn", "loi"); TT.buzz(); return; }
  GA.zip.file("word/document.xml", r.xml);
  let blob;
  try {
    blob = await GA.zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", compression: "DEFLATE" });
    // kiểm gói: mọi phần khác (hình, MathType, phông nhúng…) phải còn đủ, đúng kích cỡ
    const z2 = await JSZip.loadAsync(blob), thieu = [];
    for (const ten of Object.keys(GA.zip.files)) {
      if (GA.zip.files[ten].dir || ten === "word/document.xml") continue;
      const f2 = z2.file(ten);
      if (!f2) { thieu.push(ten); continue; }
      const [a, b] = await Promise.all([GA.zip.file(ten).async("uint8array"), f2.async("uint8array")]);
      if (a.length !== b.length) thieu.push(ten);
    }
    if (thieu.length) throw new Error("Thiếu hoặc hỏng " + thieu.length + " phần trong file (" + thieu.slice(0, 3).join(", ") + ") — em dừng, không xuất.");
  } catch (e) { GA.zip.file("word/document.xml", GA.xml); TT.toast(e.message, "loi"); TT.buzz(); $("canhBao").innerHTML = `<div>❌ ${TT.esc(e.message)}</div>`; return; }
  GA.zip.file("word/document.xml", GA.xml);   // trả lại bản gốc để còn sửa tiếp
  const mt = moTaVat(r.giu);
  $("giuNguyen").innerHTML = `🛡️ Đã kiểm file tải về: phần gốc giữ nguyên${mt ? " — " + TT.esc(mt) : ""}.`;
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = GA.ten + " - tich hop NLS NLAI.docx";
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  TT.ting(); TT.phaoGiay(); TT.toast(`Đã xuất Word: thêm ${r.moi.size} đoạn tích hợp`, "ok");
  return blob;
}

/* ---------- gắn sự kiện ---------- */
function timMuc(e) { const m = e.target.closest(".muc"); return m ? DS.find(x => x.id === m.dataset.id) : null; }
document.addEventListener("DOMContentLoaded", () => {
  $("dsMa").innerHTML = MA_NLS.concat(MA_NLAI).map(x => `<option value="${x.ma}">${TT.esc(ngan(x.nd, 80))}</option>`).join("");
  const o = $("oTha"), chon = $("chonFile");
  o.onclick = () => chon.click();
  o.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chon.click(); } };
  chon.onchange = () => { if (chon.files[0]) napFile(chon.files[0]); chon.value = ""; };
  ["dragenter", "dragover"].forEach(t => o.addEventListener(t, e => { e.preventDefault(); o.classList.add("keo"); }));
  ["dragleave", "drop"].forEach(t => o.addEventListener(t, e => { e.preventDefault(); o.classList.remove("keo"); }));
  o.addEventListener("drop", e => { const f = e.dataTransfer.files[0]; if (f) napFile(f); });
  $("bThemNls").onclick = () => { DS.push(moiMuc("nls")); luu(); veDs(); veXem(); };
  $("bThemNlai").onclick = () => { DS.push(moiMuc("nlai")); luu(); veDs(); veXem(); };
  $("bTach").onclick = () => {
    const ds = tachPPCT($("oPPCT").value);
    if (!ds.length) { TT.toast("Không thấy mã NLS/NLAI trong đoạn dán", "loi"); TT.buzz(); return; }
    DS.push(...ds); luu(); veDs(); veXem(); $("oPPCT").value = "";
    TT.ting(); TT.toast(`Đã tách ${ds.length} nội dung — chọn hoạt động cho từng nội dung`, "ok");
  };
  $("bThemMoc").onclick = () => { const v = $("chonMoc").value; if (!GA || v === "") return; GA.themMoc.push(+v); phanTichLai(); TT.toast("Đã thêm mốc hoạt động", "ok"); };
  $("bXoaHet").onclick = () => { if (!DS.length || !confirm("Xoá hết các nội dung tích hợp đang nhập?")) return; DS = []; luu(); veDs(); veXem(); };
  $("chiQuanh").onchange = veXem;
  $("bWord").onclick = xuatWord; $("bWord2").onclick = xuatWord;
  const ds = $("dsTich");
  ds.addEventListener("input", e => {
    const x = timMuc(e), f = e.target.dataset.f; if (!x || !f || f === "hd") return;
    x[f] = e.target.value;
    if (f === "ma") { const l = doanLoai(x.ma), tra = traMa(x.ma); if (l) x.loai = l; if (tra && !norm(x.nd)) x.nd = tra.nd; }
    luu(); clearTimeout(ds._t); ds._t = setTimeout(() => { if (f === "ma") { const vt = e.target.selectionStart; veDs(); const i = ds.querySelector(`.muc[data-id="${x.id}"] [data-f="ma"]`); if (i) { i.focus(); i.setSelectionRange(vt, vt); } } veXem(); }, f === "ma" ? 450 : 300);
  });
  ds.addEventListener("change", e => {
    const x = timMuc(e); if (!x) return;
    if (e.target.dataset.f === "hd") { x.hd = e.target.value === "" ? null : +e.target.value; const h = GA && GA.cau.hd.find(y => y.i === x.hd); x.hdTen = h ? h.ten : ""; x.moc = {}; }
    else if (e.target.dataset.vt) { x.vt = x.vt || {}; x.vt[e.target.dataset.vt] = e.target.checked; x.mo = true; }
    else if (e.target.dataset.moc) { x.moc = x.moc || {}; x.moc[e.target.dataset.moc] = +e.target.value; x.mo = true; }
    else return;
    luu(); veDs(); veXem();
  });
  ds.addEventListener("click", e => {
    const x = timMuc(e); if (!x) return;
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.loai) { x.loai = b.dataset.loai; }
    else if ("xoa" in b.dataset) { DS = DS.filter(y => y !== x); }
    else if ("laynd" in b.dataset) { const t = traMa(x.ma); if (t) x.nd = t.nd; }
    else if ("goiy" in b.dataset) {
      const g = goiY(x);
      if ((norm(x.cuThe) || norm(x.viec)) && !confirm("Thay câu đang có bằng câu gợi ý?")) return;
      x.cuThe = g.cuThe; x.viec = g.viec;
    } else return;
    luu(); veDs(); veXem();
  });
  ds.addEventListener("toggle", e => { const x = timMuc(e); if (x && e.target.tagName === "DETAILS") { x.mo = e.target.open; luu(); } }, true);
  if (TT.MAU) napMau(); else veHet();
});
async function napMau() {
  const bin = atob(MAU_DOCX), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  await napFile(new File([u8], "Giao an mau - Bai 4 cay nhan.docx"));
  DS = [];
  const a = moiMuc("nls"); a.ma = "1.1.TC2c"; a.nd = traMa(a.ma).nd; a.hd = GA.cau.hd.find(h => /2\.1/.test(h.ten)).i;
  a.cuThe = "HS khai thác thông tin số đơn giản về thời vụ, tưới nước và bón phân cho cây nhãn do giáo viên cung cấp";
  a.viec = "GV gửi đường dẫn tài liệu số (video, hình ảnh) về kĩ thuật trồng nhãn; HS truy cập, xem và ghi các bước trồng vào phiếu học tập";
  const b = moiMuc("nlai"); b.ma = "9.A3.1"; b.nd = traMa(b.ma).nd; b.hd = GA.cau.hd.find(h => /Vận dụng/.test(h.ten)).i;
  b.cuThe = "HS dùng giọng nói hỏi công cụ AI về lịch tưới nước, bón phân; thảo luận phản biện để điều chỉnh lời khuyên của AI cho phù hợp thực tế địa phương";
  b.viec = "GV hướng dẫn HS hỏi công cụ AI (Gemini/ChatGPT) bằng giọng nói về lịch chăm sóc cây nhãn; HS so sánh câu trả lời với SGK, chỉ ra chỗ chưa phù hợp với địa phương; không nhập thông tin cá nhân";
  [a, b].forEach(x => x.hdTen = GA.cau.hd.find(h => h.i === x.hd).ten);
  DS.push(a, b); veHet();
}
