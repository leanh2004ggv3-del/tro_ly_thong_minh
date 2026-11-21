/* Phần đọc – ghi Word dùng chung, chép từ tich-hop/tich_hop.js (20/11/2026): đọc đoạn, nhận khung giáo án, mượn định dạng, đọc PDF, xem trước. */
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

const $ = id => document.getElementById(id);
const norm = s => String(s || "").normalize("NFC").replace(/[\s ]+/g, " ").trim();
const ngan = (s, n) => (s = norm(s)).length > n ? s.slice(0, n - 1) + "…" : s;

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
