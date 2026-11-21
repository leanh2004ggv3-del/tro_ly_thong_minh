/* Tích hợp NLS – NLAI vào giáo án: đọc .docx (giữ nguyên chữ cũ, chỉ CHÈN đoạn mới / NỐI câu vào cuối đoạn) hoặc .pdf (dựng lại Word).
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
const MAU_CHU = { nls: "DC0000", nlai: "0066CC" };   // màu theo mẫu GA Bài 1 CN9 sếp gửi 20/11/2026
const TEN_LOAI = { nls: "Năng lực số", nlai: "Năng lực AI" };
const TEN_LOAI_THUONG = { nls: "năng lực số", nlai: "năng lực AI" };
const TEN_MUC = { nls: "Năng lực số (NLS)", nlai: "Năng lực Trí tuệ nhân tạo (NLAI)" };
const PHAN = [["mtBai", "Mục tiêu bài học"], ["tbGv", "Thiết bị – chuẩn bị của GV"], ["tbHs", "Thiết bị – chuẩn bị của HS"],
  ["mtHd", "a) Mục tiêu của hoạt động"], ["ndHd", "b) Nội dung"], ["sp", "c) Sản phẩm"],
  ["cg", "Bước 1 – Chuyển giao nhiệm vụ"], ["th", "Bước 2 – Thực hiện nhiệm vụ"], ["bc", "Bước 3 – Báo cáo, thảo luận"], ["kl", "Bước 4 – Kết luận, nhận định"]];

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
  b1: /^(\*\s*)?(Bước\s*1(?=[\s:.)]|$)|Chuyển giao|Giao nhiệm vụ)/i,
  b2: /^(\*\s*)?(Bước\s*2(?=[\s:.)]|$)|Thực hiện nhiệm vụ)/i,
  b3: /^(\*\s*)?(Bước\s*3(?=[\s:.)]|$)|Báo cáo)/i,
  b4: /^(\*\s*)?(Bước\s*4(?=[\s:.)]|$)|Kết luận|Đánh giá kết quả)/i,
  gv: /^(\d+\s*[.)]\s*)?(Chuẩn bị của giáo viên|Đối với giáo viên|Giáo viên\s*:?$)|^[-+•*]?\s*(GV|Giáo viên)\s*[:.]/i,
  hs: /^(\d+\s*[.)]\s*)?(Chuẩn bị của học sinh|Đối với học sinh|Học sinh\s*:?$)|^[-+•*]?\s*(HS|Học sinh)\s*[:.]/i,
  nlsH: /^((\d+(\.\d+)*\.?|[a-dđ][.)]|[-+*•])\s*)?Năng lực số\b/i,
  nlaiH: /^((\d+(\.\d+)*\.?|[a-dđ][.)]|[-+*•])\s*)?(Năng lực (Trí tuệ nhân tạo|AI)\b|NLAI\b)/i
};
const TEN_BUOC = ["giao nhiệm vụ", "thực hiện nhiệm vụ", "báo cáo, thảo luận", "kết luận, nhận định"];
const CHU_CAI = "abcdeghiklmn";
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
  const cuoi = (dau, het) => { let m = dau; for (let j = dau + 1; j < het; j++) if (ps[j].cha === ps[dau].cha && ps[j].text) m = j; return m; };
  const cau = {};
  cau.mt = tim(RE.mt); if (cau.mt < 0) cau.mt = tim(RE.mt2);
  cau.tb = tim(RE.tb, cau.mt + 1);
  cau.tt = tim(RE.tt, Math.max(cau.mt, cau.tb) + 1);
  const hetMt = cau.tb > 0 ? cau.tb : (cau.tt > 0 ? cau.tt : Math.min(ps.length, cau.mt + 40));
  cau.coMuc = { nls: -1, nlai: -1 }; cau.so = null; cau.mauMuc = -1; cau.nl = -1;
  if (cau.mt >= 0) {
    cau.nl = tim(RE.nl, cau.mt + 1, hetMt); cau.pc = tim(RE.pc, cau.mt + 1, hetMt);
    // cuối phần Năng lực (trước Phẩm chất); không có mục Năng lực thì cuối phần Mục tiêu
    if (cau.pc > cau.nl && cau.nl >= 0) cau.mocMt = cau.pc - 1;
    else if (cau.nl >= 0) cau.mocMt = hetMt - 1;
    else if (cau.pc > cau.mt) cau.mocMt = cau.pc - 1;
    else cau.mocMt = hetMt - 1;
    while (cau.mocMt > cau.mt && (!ps[cau.mocMt].text || ps[cau.mocMt].cha !== ps[cau.mt].cha)) cau.mocMt--;
    const hetNl = cau.pc > cau.mt ? cau.pc : hetMt;
    cau.coMuc = { nls: tim(RE.nlsH, cau.mt + 1, hetNl), nlai: tim(RE.nlaiH, cau.mt + 1, hetNl) };
    // đánh số mục mới theo mục con đang có: 2.1. 2.2. → 2.3. ; a) b) → c)
    if (cau.nl >= 0) {
      const mNl = ps[cau.nl].text.match(/^(\d+)\s*[.)]/);
      let max = 0;
      for (let j = cau.nl + 1; j < hetNl; j++) {
        const t = ps[j].text, m1 = t.match(/^(\d+)\.(\d+)(\.?)\s/), m2 = t.match(/^([a-n])\s*([.)])\s/);
        if (m1 && (!mNl || m1[1] === mNl[1])) { if (+m1[2] >= max) { max = +m1[2]; cau.mauMuc = j; } cau.so = { goc: m1[1], tiep: max + 1, cham: m1[3] }; }
        else if (m2 && !(cau.so && cau.so.goc)) { cau.mauMuc = j; cau.so = { chu: CHU_CAI[CHU_CAI.indexOf(m2[1]) + 1] || "x", dau: m2[2] }; }
      }
    }
  } else cau.mocMt = -1;
  cau.vungMt = [Math.max(0, cau.mt), cau.mt >= 0 ? hetMt : Math.min(ps.length, 60)];
  // thiết bị: cuối phần của GV, cuối phần của HS
  cau.tbGv = cau.tbHs = -1;
  if (cau.tb >= 0) {
    const hetTb = cau.tt > cau.tb ? cau.tt : Math.min(ps.length, cau.tb + 30);
    const gv = tim(RE.gv, cau.tb + 1, hetTb), hs = tim(RE.hs, cau.tb + 1, hetTb);
    if (gv >= 0) cau.tbGv = cuoi(gv, hs > gv ? hs : hetTb);
    else { let i = (hs > cau.tb ? hs : hetTb) - 1; while (i > cau.tb && !ps[i].text) i--; cau.tbGv = i; }
    if (hs >= 0) cau.tbHs = cuoi(hs, gv > hs ? gv : hetTb);
  }
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
    ["a", "b", "c", "d"].forEach(k2 => s[k2] = tim(RE[k2], h.i + 1, h.het));
    ["b1", "b2", "b3", "b4"].forEach(k2 => s[k2] = tim(RE[k2], (s.d >= 0 ? s.d : h.i) + 1, h.het));
    h.s = s;
    const cuoiKhoi = (dau, keTiep) => (dau < 0 ? -1 : cuoi(dau, keTiep > dau ? keTiep : h.het));
    const sau = x => Math.min(...["a", "b", "c", "d"].map(k2 => s[k2]).filter(v => v > x).concat([h.het]));
    const tieuDeBang = t => /^(hoạt động của|dự kiến sản phẩm|sản phẩm dự kiến|sản phẩm|nội dung|kết quả|ghi bảng)\b/i.test(t);
    const tim2 = (dk, tu) => { for (let j = tu; j < h.het; j++) if (ps[j].text && dk(ps[j], j)) return j; return -1; };
    // chỗ chung cho Tổ chức thực hiện khi giáo án không chia 4 bước
    let tc = -1, cachTc = "";
    if (s.d >= 0) {
      const o = tim2(p => p.cha && p.cha.localName === "tc" && !tieuDeBang(p.text), s.d + 1);
      if (o >= 0) { tc = cuoiKhoi(o, h.het); cachTc = "cuối ô hoạt động của GV – HS"; }
      else { tc = cuoiKhoi(s.d, h.het); cachTc = "cuối mục Tổ chức thực hiện"; }
    }
    if (tc < 0) {
      const gv = tim2(p => /^([-+•*]\s*)?(GV|Giáo viên|Nhiệm vụ|NV\s*\d|Bước\s*\d)(?=[\s:.,\d)]|$)/i.test(p.text), h.i + 1);
      if (gv >= 0) { tc = gv; cachTc = "sau dòng giao việc của GV"; }
    }
    if (tc < 0) { tc = cuoiKhoi(h.i, h.het); cachTc = "cuối hoạt động"; }
    // a) b): nối câu vào cuối mục; mục chỉ có nhãn thì thêm dòng dưới
    const trongMuc = (k2, reNhan, ten) => {
      if (s[k2] < 0) return null;
      const last = cuoiKhoi(s[k2], sau(s[k2])), chiNhan = last === s[k2] && reNhan.test(ps[last].text);
      return { i: last, kieu: chiNhan ? "sau" : "noi", mota: chiNhan ? "dòng mới dưới mục " + ten : "nối vào cuối mục " + ten };
    };
    h.vt = {
      mtHd: trongMuc("a", /^(a\s*[.)]\s*)?Mục tiêu[^:]*:?\s*$/i, "a) Mục tiêu") || { i: h.i, kieu: "sau", mota: "dòng mới ngay dưới tên hoạt động" },
      ndHd: trongMuc("b", /^(b\s*[.)]\s*)?Nội dung[^:]*:?\s*$/i, "b) Nội dung"),
      sp: s.c >= 0 ? { i: cuoiKhoi(s.c, sau(s.c)), kieu: "sau", mota: "dòng mới ở mục c) Sản phẩm" } : null
    };
    ["b1", "b2", "b3", "b4"].forEach((b, k2) => {
      const khoa = ["cg", "th", "bc", "kl"][k2];
      if (s[b] >= 0) {
        const tiep = Math.min(...["b1", "b2", "b3", "b4"].map(x => s[x]).filter(v => v > s[b]).concat([h.het]));
        h.vt[khoa] = { i: cuoiKhoi(s[b], tiep), kieu: "sau", mota: "cuối bước " + TEN_BUOC[k2] };
      } else h.vt[khoa] = { i: tc, kieu: "sau", mota: cachTc + " (giáo án không tách bước " + TEN_BUOC[k2] + ")" };
    });
  });
  // hoạt động "mẹ" (VD Hoạt động 2 gồm 2.1, 2.2) không có mục riêng → lồng vào hoạt động con đầu tiên
  hd.forEach((h, k) => {
    const coMuc = ["a", "b", "c", "d", "b1"].some(k2 => h.s[k2] >= 0);
    if (h.con && !coMuc && hd[k + 1]) { h.vt = hd[k + 1].vt; h.thay = hd[k + 1]; }
  });
  cau.hd = hd;
  return cau;
}

/* ---------- tạo đoạn / chữ mới (mượn định dạng chữ có sẵn) ---------- */
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
function rprMau(p, layDau) {
  let mau = null;
  for (const r of p.getElementsByTagNameNS(W, "r")) {
    if (r.parentNode && r.parentNode.namespaceURI === MNS) continue;
    const t = [...r.childNodes].find(c => c.localName === "t");
    if (t && t.textContent.trim()) {
      const rp = [...r.childNodes].find(c => c.localName === "rPr");
      if (layDau) return rp || null;
      mau = rp || mau || r.ownerDocument.createElementNS(W, "w:rPr");
      if (rp && ![...rp.childNodes].some(c => c.localName === "b")) break;
    }
  }
  return mau;
}
function taoRuns(doc, mauP, phan, loai, giuDam) {
  const goc = rprMau(mauP, giuDam), out = [];
  phan.forEach(([chu, dam]) => {
    if (!chu) return;
    chiaChiSo(chu).forEach(doan => {
      const r = doc.createElementNS(W, "w:r");
      const rpr = goc ? goc.cloneNode(true) : doc.createElementNS(W, "w:rPr");
      boCon(rpr, ["rStyle", "i", "iCs", "u", "color", "highlight", "shd", "caps", "smallCaps", "strike", "dstrike", "vertAlign", "vanish", "rPrChange", "position", "oMath"].concat(giuDam ? [] : ["b", "bCs"]));
      if (dam) { datCon(rpr, "b"); datCon(rpr, "bCs"); }
      datCon(rpr, "color", MAU_CHU[loai]);
      if (doan.va) datCon(rpr, "vertAlign", doan.va);
      r.appendChild(rpr);
      const t = doc.createElementNS(W, "w:t");
      t.setAttributeNS(XNS, "xml:space", "preserve"); t.textContent = doan.t;
      r.appendChild(t); out.push(r);
    });
  });
  return out;
}
function taoDoan(doc, mauP, phan, loai, giuDam) {
  const p = doc.createElementNS(W, "w:p");
  const pprGoc = [...mauP.childNodes].find(c => c.localName === "pPr");
  if (pprGoc) {
    const ppr = pprGoc.cloneNode(true);
    boCon(ppr, ["sectPr", "rPr", "outlineLvl", "pageBreakBefore", "numPr", "pPrChange", "keepNext"]);
    for (const c of [...ppr.childNodes]) if (c.localName === "pStyle" && /heading|title|tieu|muc|toc/i.test(c.getAttributeNS(W, "val") || c.getAttribute("w:val") || "")) ppr.removeChild(c);
    p.appendChild(ppr);
  }
  taoRuns(doc, mauP, phan, loai, giuDam).forEach(r => p.appendChild(r));
  return p;
}

/* ---------- soạn câu lồng ghép (theo mẫu GA Bài 1 CN9 sếp duyệt 20/11/2026) ---------- */
const cham = s => (s = norm(s)) && !/[.!?…:;]$/.test(s) ? s + "." : s;
const thuong = s => (s = norm(s)) && !/^\S[A-ZĐ0-9]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
const hoa = s => (s = norm(s)) ? s[0].toUpperCase() + s.slice(1) : s;
const boCham = s => norm(s).replace(/[.;,\s]+$/, "");
function tenHdNgan(h) { return h ? ngan(h.ten.replace(/^((\d+(\.\d+)*|[IVX]+|[A-ZĐ])\s*[.)]\s*)/, "").replace(/[.:]\s*$/, ""), 70) : ""; }
function congCu(s) {
  const lay = re => [...new Set((s.match(re) || []).map(t => norm(t)))];
  return {
    ai: lay(/Canva( AI)?|Gemini|ChatGPT|Copilot|Teachable Machine|Scratch|Quick,? Draw|Meta AI|Perplexity|NotebookLM|Bing/gi),
    so: lay(/video|tranh ảnh|hình ảnh|slide|bài trình chiếu|Padlet|Google [A-Z]\w+|Quizizz|Kahoot|Azota|YouTube|PowerPoint|Excel|bản đồ số|phần mềm mô phỏng|mô phỏng/gi).map(t => /^[A-Z]/.test(t) ? t : t.toLowerCase())
  };
}
function chuHS(nd) { nd = boCham(nd); return /^(HS|Học sinh|GV|Giáo viên|Nhóm|Các nhóm|Cá nhân|Đại diện)\b/i.test(nd) ? nd : "HS " + thuong(nd); }
const lopAi = x => +(norm(x.ma).match(/^(\d)/) || [])[1];
const mienNls = x => (norm(x.ma).match(/^(\d)/) || [])[1] || "1";
function sinhLG(x, h) {
  const nhan = x.loai === "nls" ? "NLS" : "NLAI", the = `(${nhan} ${norm(x.ma)})`;
  const nd = boCham(x.viec) || boCham(x.nd), hs = chuHS(nd);
  const cc = congCu(nd + " " + (x.nd || "")), ai = cc.ai.length ? cc.ai.join("/") : "Gemini/Canva";
  const hocLieu = cc.so.length ? cc.so.join(", ") : "tranh ảnh, video, slide trình chiếu";
  const cuLieu = cc.so.concat(cc.ai).join(", ");
  const hdNho = h ? "hoạt động " + tenHdNgan(h.thay || h).replace(/^(Hoạt động|HĐ)\s*[\d.]*\s*[:.\-–]?\s*/i, "") : "bài học";
  const g = {
    mtBai: `${nhan} ${norm(x.ma)}: ${hoa(nd)}.`,
    mtHd: `Phát triển ${TEN_LOAI_THUONG[x.loai]} ${the}: ${thuong(boCham(x.nd || nd))}.`,
    ndHd: `${hs} ${the}.`,
    th: `${hs} ${the}.`
  };
  const coDoiChieu = /đối chiếu|so sánh|kiểm chứng|chỉ ra|phản biện|kiểm tra/i.test(nd);
  const mien = x.loai === "nls" ? mienNls(x) : "ai";
  if (mien === "ai" || mien === "6") {
    const nho = x.loai === "nlai" && lopAi(x) && lopAi(x) <= 7;
    Object.assign(g, nho ? {
      tbGv: `Công cụ AI (${ai}) trên máy GV để thao tác mẫu trước lớp ${the}.`, tbHs: "",
      cg: `GV thao tác mẫu công cụ AI (${ai}) trên màn hình chiếu, giao nhiệm vụ quan sát và nhận xét kết quả AI ${the}.`,
      th: `${hs}; quan sát kết quả AI đưa ra và nêu nhận xét ${the}.`
    } : {
      tbGv: `Mẫu câu lệnh gợi ý (prompt) và công cụ AI (${ai}) cho HS trải nghiệm ${the}.`,
      tbHs: `Thiết bị thông minh (điện thoại/máy tính có kết nối Internet) theo hướng dẫn của GV ${the}.`,
      cg: `GV hướng dẫn HS sử dụng công cụ AI (${ai}), nhập câu lệnh (prompt) theo mẫu gợi ý; giao nhiệm vụ đối chiếu kết quả AI với SGK, thực tế ${the}.`,
      th: coDoiChieu ? `${hs} ${the}.` : `${hs}; ghi lại những điểm kết quả AI chưa đúng hoặc chưa phù hợp với SGK, thực tế ${the}.`
    }, {
      sp: `Sản phẩm HS tạo bằng công cụ AI (${ai}) và bản nhận xét, đối chiếu kết quả AI với SGK, thực tế ${the}.`,
      bc: `HS trình bày kết quả từ công cụ AI, chỉ ra điểm AI chưa đúng so với SGK, thực tế; HS khác nhận xét, phản biện ${the}.`,
      kl: `GV chốt: AI chỉ là công cụ hỗ trợ, con người kiểm tra, quyết định và chịu trách nhiệm với kết quả cuối cùng; không đưa thông tin cá nhân lên công cụ AI ${the}.`
    });
    return g;
  }
  const M = {
    "1": { tbGv: `Học liệu số: ${hocLieu} phục vụ ${hdNho} ${the}.`, tbHs: "",
      sp: `Thông tin HS khai thác được từ học liệu số (ghi vào phiếu học tập/vở) ${the}.`,
      cg: `GV trình chiếu/cung cấp học liệu số (${hocLieu}), hướng dẫn HS cách quan sát, khai thác thông tin ${the}.`,
      bc: `Đại diện HS/nhóm trình bày kết quả khai thác từ học liệu số; HS khác nhận xét, bổ sung ${the}.`,
      kl: `GV nhận xét cách HS khai thác, chọn lọc thông tin từ học liệu số; nhắc HS sử dụng nguồn thông tin tin cậy ${the}.` },
    "2": { tbGv: `Công cụ số để HS chia sẻ, trao đổi kết quả (${cuLieu || "nhóm lớp, Padlet, Google Drive"}) ${the}.`,
      tbHs: `Thiết bị số (máy tính/điện thoại) theo hướng dẫn của GV ${the}.`,
      sp: `Kết quả, sản phẩm nhóm chia sẻ qua công cụ số ${the}.`,
      cg: `GV hướng dẫn HS cách chia sẻ, trao đổi kết quả qua công cụ số ${the}.`,
      bc: `Các nhóm chia sẻ kết quả qua công cụ số; HS khác xem, nhận xét, phản hồi lịch sự ${the}.`,
      kl: `GV nhận xét, nhắc HS ứng xử văn minh và ghi rõ nguồn khi chia sẻ trên môi trường số ${the}.` },
    "3": { tbGv: `Phần mềm/ứng dụng tạo sản phẩm số (${cuLieu || "PowerPoint, Canva"}) và tiêu chí đánh giá sản phẩm ${the}.`,
      tbHs: `Thiết bị số (máy tính/điện thoại) để tạo sản phẩm theo hướng dẫn của GV ${the}.`,
      sp: `Sản phẩm số do HS tạo ${the}.`,
      cg: `GV giao nhiệm vụ tạo sản phẩm số, nêu tiêu chí đánh giá sản phẩm ${the}.`,
      bc: `HS trình bày sản phẩm số; HS khác nhận xét theo tiêu chí ${the}.`,
      kl: `GV nhận xét sản phẩm số; nhắc HS tôn trọng bản quyền hình ảnh, nội dung khi sử dụng ${the}.` },
    "4": { tbGv: `Tình huống, hình ảnh minh hoạ về an toàn trong môi trường số ${the}.`, tbHs: "",
      sp: `Ý kiến của HS về cách ứng xử an toàn trong môi trường số ${the}.`,
      cg: `GV nêu tình huống về an toàn trong môi trường số, giao nhiệm vụ thảo luận cách xử lí ${the}.`,
      bc: `HS trình bày cách xử lí tình huống; HS khác nhận xét, bổ sung ${the}.`,
      kl: `GV chốt cách bảo vệ thiết bị, dữ liệu cá nhân và sức khoẻ khi sử dụng công nghệ số ${the}.` },
    "5": { tbGv: `Thiết bị, phần mềm số phục vụ nhiệm vụ (${cuLieu || "máy tính, phần mềm mô phỏng"}) ${the}.`,
      tbHs: `Thiết bị số theo hướng dẫn của GV ${the}.`,
      sp: `Kết quả HS giải quyết nhiệm vụ bằng công cụ số ${the}.`,
      cg: `GV giao nhiệm vụ, gợi ý lựa chọn công cụ số phù hợp ${the}.`,
      bc: `HS trình bày cách sử dụng công cụ số để giải quyết nhiệm vụ; HS khác nhận xét ${the}.`,
      kl: `GV chốt cách lựa chọn công cụ số phù hợp với nhiệm vụ và xử lí sự cố đơn giản ${the}.` }
  };
  return Object.assign(g, M[mien] || M["1"]);
}
const giaTriLG = (x, g, k) => (x.lg && x.lg[k] != null ? x.lg[k] : g[k]) || "";
const batLG = (x, k) => !(x.tat && x.tat[k]);

/* ---------- áp tích hợp vào một bản sao XML ---------- */
function apTichHop(xmlGoc, chiXem) {
  const doc = new DOMParser().parseFromString(xmlGoc, "application/xml");
  const ps = layDoan(doc);
  const cau = phanTich(ps, GA.themMoc);
  const moi = new Set(), moiRun = new Set(), sua = new Set(), sauMoc = new Map(), canhBao = [];
  const chen = (iMoc, phan, loai, iMau, giuDam) => {
    if (iMoc == null || iMoc < 0 || !ps[iMoc] || !phan.length) return false;
    const moc = ps[iMoc].p, np = taoDoan(doc, ps[iMau != null && iMau >= 0 ? iMau : iMoc].p, phan, loai, giuDam);
    const truoc = sauMoc.get(iMoc) || moc;
    truoc.parentNode.insertBefore(np, truoc.nextSibling);
    sauMoc.set(iMoc, np); moi.add(np); return true;
  };
  const noi = (i, chu, loai) => {   // nối câu vào cuối đoạn có sẵn (chữ cũ giữ nguyên)
    const p = ps[i].p, cu = chuCua(p), xong = /[.;:!?…]$/.test(cu);
    const runs = taoRuns(doc, p, [[(cu ? (xong ? " " : "; ") : "") + (xong || !cu ? hoa(chu) : thuong(chu)), false]], loai);
    runs.forEach(r => { p.appendChild(r); moiRun.add(r); }); sua.add(p);
  };
  const ds = DS.filter(x => x.bat !== false && norm(x.ma) && (norm(x.viec) || norm(x.nd)));
  const sinh = new Map(ds.map(x => [x, sinhLG(x, cau.hd.find(y => y.i === x.hd))]));
  // 1) Mục tiêu bài học: mục "2.3. Năng lực số (NLS)", "2.4. Năng lực Trí tuệ nhân tạo (NLAI)"
  const so = cau.so ? Object.assign({}, cau.so) : null;
  ["nls", "nlai"].forEach(loai => {
    const nhom = ds.filter(x => x.loai === loai && batLG(x, "mtBai") && giaTriLG(x, sinh.get(x), "mtBai"));
    if (!nhom.length) return;
    let moc = -1, mau = cau.mocMt;
    if (cau.coMuc[loai] >= 0) {   // giáo án đã có mục này → thêm dòng vào cuối mục
      moc = cau.coMuc[loai];
      for (let j = moc + 1; j < ps.length && j < cau.vungMt[1]; j++) { if (!ps[j].text) continue; if (/^[-+•*]/.test(ps[j].text)) moc = j; else break; }
      mau = moc;
    } else if (cau.mocMt >= 0) {
      const muc = so ? (so.chu ? `${so.chu}${so.dau} ` : `${so.goc}.${so.tiep}${so.cham} `) : "";
      const mauDau = cau.mauMuc >= 0 ? cau.mauMuc : cau.nl;
      chen(cau.mocMt, [[muc + TEN_MUC[loai], false]], loai, mauDau >= 0 ? mauDau : cau.mocMt, mauDau >= 0);
      if (so) { if (so.chu) so.chu = CHU_CAI[CHU_CAI.indexOf(so.chu) + 1] || "x"; else so.tiep++; }
      moc = cau.mocMt;
    } else { canhBao.push("Giáo án không có phần “Mục tiêu” — app bỏ qua dòng mục tiêu bài, vẫn lồng ghép vào hoạt động."); return; }
    nhom.forEach(x => chen(moc, [["- " + giaTriLG(x, sinh.get(x), "mtBai"), false]], loai, mau));
  });
  // 2) Thiết bị dạy học và học liệu
  let baoTb = false;
  ds.forEach(x => [["tbGv", cau.tbGv], ["tbHs", cau.tbHs]].forEach(([k, i]) => {
    const v = batLG(x, k) && giaTriLG(x, sinh.get(x), k);
    if (!v) return;
    if (i >= 0) chen(i, [["- " + v, false]], x.loai);
    else if (k === "tbGv" && !baoTb) { baoTb = true; canhBao.push("Không thấy phần “Thiết bị dạy học và học liệu” — app bỏ qua dòng thiết bị."); }
  }));
  // 3) Trong hoạt động: a) mục tiêu, b) nội dung, c) sản phẩm, 4 bước tổ chức
  ds.forEach(x => {
    const h = cau.hd.find(y => y.i === x.hd), g = sinh.get(x);
    if (!h) { canhBao.push(`${x.ma}: chưa chọn hoạt động.`); return; }
    ["mtHd", "ndHd", "sp", "cg", "th", "bc", "kl"].forEach(k => {
      const v = h.vt[k], chu = batLG(x, k) && boCham(giaTriLG(x, g, k));
      if (!v || !chu) return;
      if (v.kieu === "noi") noi(v.i, cham(chu), x.loai); else chen(v.i, [["- " + cham(chu), false]], x.loai);
    });
  });
  if (chiXem) return { doc, moi, sua, canhBao };
  let s = new XMLSerializer().serializeToString(doc);
  if (!/^<\?xml/.test(s)) s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' + s;
  // KIỂM: đọc lại file vừa ghi, đếm công thức/hình/chỉ số của phần gốc — phải đúng bằng bản gốc
  const doc2 = new DOMParser().parseFromString(s, "application/xml");
  if (doc2.getElementsByTagName("parsererror").length) throw new Error("File ghi ra bị lỗi cấu trúc — em dừng, không xuất.");
  const tatCaMoi = new Set([...moi, ...moiRun]);
  const goc = demVat(new DOMParser().parseFromString(xmlGoc, "application/xml"));
  const cMoi = demVat(doc), cMoiChen = {};
  const tong2 = demVat(doc2), chiGoc = demVat(doc, tatCaMoi);
  Object.keys(goc).forEach(k => cMoiChen[k] = cMoi[k] - chiGoc[k]);
  const lech = Object.keys(goc).filter(k => goc[k] !== chiGoc[k] || tong2[k] !== goc[k] + cMoiChen[k]);
  if (lech.length) throw new Error("Phần gốc bị thay đổi ở: " + lech.map(k => VAT[k]).join(", ") + " — em dừng, không xuất.");
  return { xml: s, moi, sua, canhBao, giu: goc };
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
  // file mới: tìm lại hoạt động theo TÊN đã chọn
  DS.forEach(x => {
    const h = GA.cau.hd.find(y => y.i === x.hd);
    if (h && (!x.hdTen || norm(h.ten) === norm(x.hdTen))) return;
    const h2 = x.hdTen && GA.cau.hd.find(y => norm(y.ten) === norm(x.hdTen));
    x.hd = h2 ? h2.i : null;
  });
  luu();
  veHet();
}

/* ---------- giao diện ---------- */
function luu() { TT.save("tichhop_ds", DS); }
function moiMuc(loai) { return { id: TT.uid(), loai: loai || "nls", ma: "", nd: "", hd: null, viec: "", lg: {}, tat: {} }; }
function veKhung() {
  const k = $("khungGa");
  if (!GA) { k.innerHTML = '<p class="mo">Chưa có giáo án. Đưa file lên ở bước 1.</p>'; $("trangThai").innerHTML = $("trangThai").innerHTML.startsWith("❌") ? $("trangThai").innerHTML : "Chưa có file."; return; }
  const c = GA.cau, ps = GA.ps;
  $("trangThai").innerHTML = `✅ <b>${TT.esc(GA.ten)}</b>.${GA.nguon === "pdf" ? "pdf" : "docx"} · ${ps.length} đoạn · nhận ra ${c.hd.length} hoạt động` + (GA.vat && GA.nguon === "docx" ? `<div class="giu">🛡️ Có ${TT.esc(GA.vat)} — app không động vào, file tải về giữ nguyên.</div>` : "") + (GA.ghiChu ? `<div class="canh">⚠️ ${GA.ghiChu}</div>` : "");
  const dong = [];
  dong.push(`<div class="kg ${c.mocMt >= 0 ? "ok" : "thieu"}"><b>Mục tiêu bài học</b> ${c.nl >= 0 ? "· mục Năng lực: “" + TT.esc(ngan(ps[c.nl].text, 40)) + "”" : '· <span class="do">chưa thấy mục “Năng lực”</span>'}${c.so ? " · mục mới đánh số tiếp: " + (c.so.chu ? c.so.chu + c.so.dau : c.so.goc + "." + c.so.tiep + c.so.cham) : ""}</div>`);
  dong.push(`<div class="kg ${c.tbGv >= 0 ? "ok" : "thieu"}"><b>Thiết bị, học liệu</b> ${c.tbGv >= 0 ? "· phần GV" + (c.tbHs >= 0 ? " · phần HS" : "") : '· <span class="do">chưa thấy</span>'}</div>`);
  c.hd.forEach(h => {
    const co = ["a", "b", "c", "d"].filter(k2 => h.s[k2] >= 0), buoc = ["b1", "b2", "b3", "b4"].filter(k2 => h.s[k2] >= 0).length;
    dong.push(`<div class="kg ok" style="margin-left:${(h.cap - 1) * 18}px"><span class="the-hd l-${h.loai || "x"}">${{ kd: "Khởi động", ht: "Hình thành KT", lt: "Luyện tập", vd: "Vận dụng" }[h.loai] || "Hoạt động"}</span> ${TT.esc(ngan(h.ten, 80))} <span class="mo">${co.length ? "· có mục " + co.join(", ") : h.con ? "· (gồm các hoạt động con)" : "· không thấy mục a, b, c, d"}${buoc ? " · " + buoc + "/4 bước" : ""}</span></div>`);
  });
  if (!c.hd.length) dong.push('<div class="kg thieu">Chưa nhận ra hoạt động nào. Bấm <b>＋ Thêm mốc hoạt động</b> để tự chọn tên hoạt động trong giáo án.</div>');
  k.innerHTML = dong.join("");
  const tu = c.tt >= 0 ? c.tt + 1 : 0;
  $("chonMoc").innerHTML = '<option value="">— chọn một dòng tên hoạt động —</option>' + ps.slice(tu).filter(x => x.text && x.text.length < 140 && !c.hd.some(h => h.i === x.i)).map(x => `<option value="${x.i}">${TT.esc(ngan(x.text, 90))}</option>`).join("");
}
function luaChonHd(x) {
  if (!GA) return '<option value="">(đưa giáo án lên trước)</option>';
  return '<option value="">— chọn hoạt động —</option>' + GA.cau.hd.map(h => `<option value="${h.i}" ${x.hd === h.i ? "selected" : ""}>${"  ".repeat(h.cap - 1)}${TT.esc(ngan(h.ten, 70))}${h.con ? " (có HĐ con)" : ""}</option>`).join("");
}
/* Khung: app TỰ lồng ghép vào đâu, câu gì (thầy cô không phải chọn chỗ) */
function veLongGhep(x, h) {
  if (!GA) return '<div class="tudong cho">🧩 Đưa giáo án lên, chọn hoạt động — app tự lồng ghép.</div>';
  if (!h) return '<div class="tudong cho">🧩 Chọn <b>hoạt động</b> ở trên — app tự lồng ghép vào mục tiêu, thiết bị và từng bước của hoạt động.</div>';
  const c = GA.cau, g = sinhLG(x, h);
  const viTri = k => {
    if (k === "mtBai") return c.coMuc[x.loai] >= 0 ? "thêm vào mục “" + ngan(GA.ps[c.coMuc[x.loai]].text, 40) + "” đã có" : c.mocMt >= 0 ? "mục mới “" + TEN_MUC[x.loai] + "” cuối phần Năng lực" : null;
    if (k === "tbGv") return c.tbGv >= 0 ? "cuối phần chuẩn bị của GV" : null;
    if (k === "tbHs") return c.tbHs >= 0 ? "cuối phần chuẩn bị của HS" : null;
    return h.vt[k] ? h.vt[k].mota : null;
  };
  let so = 0;
  const hang = PHAN.map(([k, ten]) => {
    const vt = viTri(k), v = giaTriLG(x, g, k);
    if (!vt) return `<div class="lg bo"><b>${ten}</b> <span class="mo nho2">— giáo án không có mục này, bỏ qua</span></div>`;
    if (!v && !(x.lg && x.lg[k] != null)) return `<div class="lg bo"><b>${ten}</b> <span class="mo nho2">— loại tích hợp này không cần, bỏ qua</span></div>`;
    const tat = !batLG(x, k);
    if (!tat) so++;
    return `<div class="lg ${tat ? "tat" : ""}"><label class="tick"><input type="checkbox" data-tat="${k}" ${tat ? "" : "checked"}> <b>${ten}</b> <span class="mo nho2">— ${TT.esc(vt)}</span>${x.lg && x.lg[k] != null ? ' <span class="tay">đã sửa</span>' : ""}</label>${tat ? "" : `<textarea data-lg="${k}" rows="2">${TT.esc(v)}</textarea>`}</div>`;
  });
  return `<div class="tudong">🧩 <b>App tự lồng ghép vào ${so} chỗ</b>${h.thay ? " (trong " + TT.esc(ngan(h.thay.ten, 50)) + ")" : ""}: mục tiêu bài, thiết bị, a) b) c) và cả 4 bước của hoạt động. Câu đã soạn sẵn theo nội dung — xem ở bước 4.
      <div class="hang" style="margin-top:6px"><button class="nut phu nho" data-mo>✏️ ${x.mo ? "Thu gọn" : "Xem / sửa từng câu"}</button>${x.lg && Object.keys(x.lg).length ? '<button class="nut phu nho" data-taolai>↺ Soạn lại theo nội dung</button>' : ""}</div></div>
    ${x.mo ? `<div class="dslg">${hang.join("")}</div>` : ""}`;
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
        <label class="o" style="flex:0 1 170px">Mã tích hợp<input data-f="ma" list="dsMa" value="${TT.esc(x.ma)}" placeholder="${x.loai === "nls" ? "1.1.TC2a" : "9.D1.1"}"></label>
        <label class="o" style="flex:1 1 300px">Hoạt động được tích hợp<select data-f="hd">${luaChonHd(x)}</select></label>
      </div>
      ${tra ? `<div class="tra">📖 Bảng tra: <b>${TT.esc(tra.ma)}</b>${tra.tp ? " · " + TT.esc(tra.tp) : ""}${khoaMa(x.ma) && norm(x.nd) !== norm(tra.nd) ? ` <button class="nut phu nho" data-laynd>Dùng câu bảng tra</button>` : ""}</div>` : norm(x.ma) ? '<div class="tra canh">Mã này chưa có trong bảng tra của tổ — thầy cô tự ghi nội dung chỉ báo.</div>' : ""}
      ${lap ? '<div class="tra canh">⚠️ Mã này đang tích hợp ở hơn một chỗ. Luật của tổ: mỗi nội dung tích hợp chỉ ở <b>một</b> hoạt động.</div>' : ""}
      <label class="o">Nội dung cần tích hợp (chép từ PPCT: HS làm gì, dùng công cụ gì)<textarea data-f="viec" rows="3" placeholder="VD: Sử dụng tranh ảnh, video hoặc học liệu số do giáo viên cung cấp để nhận biết một số cây ăn quả phổ biến ở địa phương.">${TT.esc(x.viec)}</textarea></label>
      <label class="o">Nội dung chỉ báo theo mã (app tự điền, dùng cho a) Mục tiêu hoạt động)<textarea data-f="nd" rows="2" placeholder="VD: Minh họa được nhu cầu thông tin">${TT.esc(x.nd)}</textarea></label>
      <div class="mo nho2">🔬 Có công thức: gõ <code>x^2</code> → x<sup>2</sup>, <code>H_2O</code> → H<sub>2</sub>O, <code>10^{-3}</code> → 10<sup>−3</sup>, <code>SO_4^{2-}</code> → SO<sub>4</sub><sup>2−</sup>. Phân số, căn: tải về rồi chèn bằng Word/MathType vào đoạn màu.</div>
      <div class="hang" style="margin-top:2px"><button class="nut phu nho" data-goiy>💡 Gợi ý nội dung</button><span class="mo nho2">Khi PPCT chưa ghi rõ — câu khung, thầy cô sửa cho đúng bài.</span></div>
      ${veLongGhep(x, h)}
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
  if (chiMoi) ps.forEach((p, i) => { if (r.moi.has(p.p) || r.sua.has(p.p)) for (let j = i - 2; j <= i + 1; j++) giu.add(j); });
  let html = "", bo = false;
  ps.forEach((p, i) => {
    if (chiMoi && !giu.has(i)) { if (!bo) { html += '<div class="bo">⋯</div>'; bo = true; } return; }
    bo = false;
    const la = r.moi.has(p.p);
    const loai = la ? ([...p.p.getElementsByTagNameNS(W, "color")][0] || {}).getAttribute?.("w:val") : null;
    const trongBang = p.cha && p.cha.localName === "tc";
    html += `<p class="${la ? "moi " + (loai === MAU_CHU.nls ? "c-nls" : "c-nlai") : ""}${r.sua.has(p.p) ? " sua" : ""}${trongBang ? " o-bang" : ""}">${chuCoDam(p.p) || "&nbsp;"}</p>`;
  });
  k.innerHTML = html || '<p class="mo">(giáo án trống)</p>';
  $("soMoi").textContent = r.moi.size + " đoạn mới · " + r.sua.size + " đoạn nối thêm câu";
  $("canhBao").innerHTML = r.canhBao.map(c => `<div>⚠️ ${TT.esc(c)}</div>`).join("");
}
function chuCoDam(p) {   // chữ của đoạn để xem trước: đậm, màu, chỉ số trên/dưới, công thức, MathType, hình
  let s = "";
  const giaTri = e => e.getAttributeNS(W, "val") || e.getAttribute("w:val") || "";
  const chip = (lop, chu, tieuDe) => `<span class="${lop}" title="${tieuDe}">${chu}</span>`;
  const run = r => {
    const rp = [...r.childNodes].find(c => c.localName === "rPr");
    const con = ten => rp && [...rp.childNodes].find(c => c.localName === ten);
    const b = con("b"), dam = b && !/^(0|false|off)$/i.test(giaTri(b));
    const va = con("vertAlign"), mau = con("color"), mv = mau ? giaTri(mau) : "";
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
    if (dam) t = "<b>" + t + "</b>";
    if (/^[0-9A-F]{6}$/i.test(mv) && !/^(000000|FFFFFF)$/i.test(mv)) t = `<span style="color:#${mv}">${t}</span>`;
    return t;
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

/* ---------- gợi ý nội dung khi PPCT chưa ghi rõ ---------- */
const GOI_Y_NLS = {
  1: "Sử dụng tranh ảnh, video hoặc học liệu số do giáo viên cung cấp để tìm hiểu nội dung bài học",
  2: "Chia sẻ, trao đổi kết quả của nhóm qua công cụ số lớp đang dùng (nhóm lớp, Padlet, Google Drive…); ghi rõ nguồn khi chia sẻ",
  3: "Dùng phần mềm (PowerPoint, Canva…) tạo sản phẩm số (sơ đồ, áp phích, bài trình chiếu) trình bày kết quả học tập",
  4: "Thảo luận cách bảo vệ thiết bị, dữ liệu cá nhân và sức khoẻ khi sử dụng thiết bị số trong học tập",
  5: "Lựa chọn công cụ số phù hợp (máy tính, ứng dụng, phần mềm mô phỏng…) để giải quyết nhiệm vụ học tập",
  6: "Dùng công cụ AI (Gemini/Canva) hỗ trợ nhiệm vụ học tập; đối chiếu kết quả AI với SGK và tự quyết định nội dung cuối cùng"
};
function goiY(x) {
  if (x.loai === "nls") return GOI_Y_NLS[mienNls(x)] || GOI_Y_NLS[1];
  const lop = lopAi(x);
  return lop && lop <= 7 ? "Quan sát GV thao tác công cụ AI (Gemini/Canva) trên màn hình chiếu, nêu nhận xét về kết quả AI đưa ra so với SGK"
    : "Dùng công cụ AI (Gemini/Canva) để hỗ trợ nhiệm vụ học tập; đối chiếu kết quả AI với SGK, thực tế địa phương để chỉ ra điểm AI chưa đúng";
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
    const x = moiMuc(loai); x.ma = v.ma; x.nd = tra ? tra.nd : ""; x.viec = phan;
    ds.push(x);
  });
  return ds;
}

/* ---------- xuất Word ---------- */
async function xuatWord() {
  if (!GA) { TT.toast("Đưa giáo án lên trước ạ", "loi"); TT.buzz(); return; }
  let r;
  try { r = apTichHop(GA.xml, false); } catch (e) { TT.toast(e.message, "loi"); TT.buzz(); $("canhBao").innerHTML = `<div>❌ ${TT.esc(e.message)}</div>`; return; }
  if (!r.moi.size && !r.sua.size) { TT.toast("Chưa có nội dung tích hợp nào để lồng ghép", "loi"); TT.buzz(); return; }
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
  $("giuNguyen").innerHTML = `🛡️ Đã kiểm file tải về: chữ cũ giữ nguyên, chỉ thêm ${r.moi.size} đoạn mới và nối câu vào ${r.sua.size} đoạn${mt ? " — còn đủ " + TT.esc(mt) : ""}.`;
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = GA.ten + " - tich hop NLS NLAI.docx";
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  TT.ting(); TT.phaoGiay(); TT.toast(`Đã xuất Word: lồng ghép ${r.moi.size + r.sua.size} chỗ`, "ok");
  return blob;
}

/* ---------- gắn sự kiện ---------- */
function timMuc(e) { const m = e.target.closest(".muc"); return m ? DS.find(x => x.id === m.dataset.id) : null; }
function veLaiGiuCon(x, sel) {   // vẽ lại thẻ mà con trỏ vẫn ở ô đang gõ
  const ds = $("dsTich"), cu = document.activeElement, vt = cu && cu.selectionStart;
  veDs();
  const o = ds.querySelector(`.muc[data-id="${x.id}"] ${sel}`);
  if (o) { o.focus(); try { o.setSelectionRange(vt, vt); } catch (e) {} }
}
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
    const x = timMuc(e); if (!x) return;
    const f = e.target.dataset.f, lg = e.target.dataset.lg;
    if (lg) { x.lg = x.lg || {}; x.lg[lg] = e.target.value; luu(); clearTimeout(ds._t); ds._t = setTimeout(veXem, 350); return; }
    if (!f || f === "hd") return;
    x[f] = e.target.value;
    if (f === "ma") { const l = doanLoai(x.ma), tra = traMa(x.ma); if (l) x.loai = l; if (tra && !norm(x.nd)) x.nd = tra.nd; }
    luu(); clearTimeout(ds._t);
    ds._t = setTimeout(() => { veLaiGiuCon(x, `[data-f="${f}"]`); veXem(); }, 500);
  });
  ds.addEventListener("change", e => {
    const x = timMuc(e); if (!x) return;
    if (e.target.dataset.f === "hd") { x.hd = e.target.value === "" ? null : +e.target.value; const h = GA && GA.cau.hd.find(y => y.i === x.hd); x.hdTen = h ? h.ten : ""; }
    else if (e.target.dataset.tat) { x.tat = x.tat || {}; x.tat[e.target.dataset.tat] = !e.target.checked; }
    else return;
    luu(); veDs(); veXem();
  });
  ds.addEventListener("click", e => {
    const x = timMuc(e); if (!x) return;
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.loai) { x.loai = b.dataset.loai; }
    else if ("xoa" in b.dataset) { DS = DS.filter(y => y !== x); }
    else if ("laynd" in b.dataset) { const t = traMa(x.ma); if (t) x.nd = t.nd; }
    else if ("mo" in b.dataset) { x.mo = !x.mo; luu(); veDs(); return; }
    else if ("taolai" in b.dataset) { if (!confirm("Bỏ các câu đã sửa tay, soạn lại theo nội dung?")) return; x.lg = {}; }
    else if ("goiy" in b.dataset) { if (norm(x.viec) && !confirm("Thay nội dung đang có bằng câu gợi ý?")) return; x.viec = goiY(x); }
    else return;
    luu(); veDs(); veXem();
  });
  if (TT.MAU) napMau(); else veHet();
});
async function napMau() {
  const bin = atob(MAU_DOCX), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  await napFile(new File([u8], "Giao an mau - Bai 4 cay nhan.docx"));
  DS = [];
  const a = moiMuc("nls"); a.ma = "1.1.TC2c"; a.nd = traMa(a.ma).nd; a.hd = GA.cau.hd.find(h => /2\.1/.test(h.ten)).i;
  a.viec = "Khai thác thông tin số đơn giản (video, hình ảnh) về thời vụ, tưới nước và bón phân cho cây nhãn do giáo viên cung cấp";
  const b = moiMuc("nlai"); b.ma = "9.A3.1"; b.nd = traMa(b.ma).nd; b.hd = GA.cau.hd.find(h => /Vận dụng/.test(h.ten)).i;
  b.viec = "HS dùng giọng nói hỏi Gemini/ChatGPT về lịch tưới nước, bón phân cho cây nhãn; thảo luận phản biện để điều chỉnh lời khuyên của AI cho phù hợp thực tế địa phương";
  [a, b].forEach(x => x.hdTen = GA.cau.hd.find(h => h.i === x.hd).ten);
  DS.push(a, b); veHet();
}
