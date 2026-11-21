/* SONG NGỮ VIỆT – ANH CHO GIÁO ÁN — giữ nguyên giáo án cũ, chỉ THÊM tiếng Anh (chữ xanh):
   đề mục khung, tên bài, lời GV trên lớp từng bước, từ vựng trọng tâm, câu dịch (thầy cô tự gõ hoặc nhờ AI dịch rồi dán lại).
   Có bộ đọc mẫu: mỗi câu đọc lặp lại nhiều lần, lần sau chậm hơn lần trước, nghỉ để thầy cô đọc theo.
   Mọi xử lí chạy trong trình duyệt, không gửi file đi đâu. */
const MAU_SN = { xanh: "0070C0", la: "00B050" };
const MAC_DINH = { mon: "", lop: "", tenEn: "", mau: "xanh", che: { ten: true, khung: true, lenh: true, tu: true, dich: true }, dich: {}, tuTay: [], doc: { giong: "", vung: "en-US", lap: 3, toc: 0.95, giam: 0.2, nghi: "tu", cum: true } };
let SN = Object.assign({}, MAC_DINH, TT.load("songngu", {}));
SN.che = Object.assign({}, MAC_DINH.che, SN.che); SN.doc = Object.assign({}, MAC_DINH.doc, SN.doc); SN.dich = SN.dich || {}; SN.tuTay = SN.tuTay || [];
let GA = null;        // {ten, nguon, zip, xml, ps, cau, tim:[từ tìm thấy], tuChon:Set, chon:Set, phien:[]}
let MUC = [];         // các câu tiếng Anh để luyện đọc (từ lần áp gần nhất)
const luu = () => TT.save("songngu", SN);
const khoaDich = t => norm(t).slice(0, 400);
const hoaHet = s => s === s.toUpperCase() && /\p{Lu}/u.test(s);
const boNhay = s => norm(s).replace(/^["“”']+|["“”']+$/g, "");

/* ---------- so khớp tiếng Việt (hoá = hóa, kĩ = kỹ) ---------- */
const THANH = /[̣̀́̃̉]/g;
function khoaViet(s) {
  return norm(s).toLowerCase().normalize("NFD").split(/[^\p{L}\p{M}\p{N}]+/u).filter(Boolean)
    .map(w => { const t = (w.match(THANH) || [""])[0]; return w.replace(THANH, "").replace(/y/g, "i") + t; }).join(" ");
}
const TU_KHOA = TU.map(x => Object.assign({ k: " " + khoaViet(x.vi) + " " }, x));

/* ---------- chạy chữ: mượn định dạng, tô màu xanh ---------- */
function taoRunsSN(doc, mauP, phan, giuDam) {
  const goc = rprMau(mauP, giuDam), out = [];
  phan.forEach(([chu, dam]) => {
    if (!chu) return;
    chiaChiSo(chu).forEach(doan => {
      const r = doc.createElementNS(W, "w:r");
      const rpr = goc ? goc.cloneNode(true) : doc.createElementNS(W, "w:rPr");
      boCon(rpr, ["rStyle", "i", "iCs", "u", "color", "highlight", "shd", "caps", "smallCaps", "strike", "dstrike", "vertAlign", "vanish", "rPrChange", "position", "oMath"].concat(giuDam ? [] : ["b", "bCs"]));
      if (dam) { datCon(rpr, "b"); datCon(rpr, "bCs"); }
      datCon(rpr, "color", MAU_SN[SN.mau] || MAU_SN.xanh);
      if (doan.va) datCon(rpr, "vertAlign", doan.va);
      r.appendChild(rpr);
      const t = doc.createElementNS(W, "w:t");
      t.setAttributeNS(XNS, "xml:space", "preserve"); t.textContent = doan.t;
      r.appendChild(t); out.push(r);
    });
  });
  return out;
}
function taoDoanSN(doc, mauP, phan, giuDam) {
  const p = doc.createElementNS(W, "w:p");
  const pprGoc = [...mauP.childNodes].find(c => c.localName === "pPr");
  if (pprGoc) {
    const ppr = pprGoc.cloneNode(true);
    boCon(ppr, ["sectPr", "rPr", "outlineLvl", "pageBreakBefore", "numPr", "pPrChange", "keepNext"]);
    for (const c of [...ppr.childNodes]) if (c.localName === "pStyle" && /heading|title|tieu|muc|toc/i.test(c.getAttributeNS(W, "val") || c.getAttribute("w:val") || "")) ppr.removeChild(c);
    p.appendChild(ppr);
  }
  taoRunsSN(doc, mauP, phan, giuDam).forEach(r => p.appendChild(r));
  return p;
}
/* các chữ w:t gốc của đoạn (bỏ công thức, hộp chữ, chữ đã xoá, chữ mới chèn) */
function tGoc(p, boQua) {
  const out = [];
  for (const r of p.getElementsByTagNameNS(W, "r")) {
    if (boQua && boQua.has(r)) continue;
    let a = r.parentNode, bo = false;
    while (a && a !== p) { if (a.namespaceURI === MNS || ["txbxContent", "Fallback", "del", "moveFrom"].includes(a.localName)) { bo = true; break; } a = a.parentNode; }
    if (bo) continue;
    for (const c of r.childNodes) if (c.localName === "t" && c.namespaceURI === W) out.push({ r, t: c });
  }
  return out;
}
const chuTho = (p, boQua) => tGoc(p, boQua).map(x => x.t.textContent).join("");
/* chèn các run mới vào ĐÚNG vị trí chữ thứ pos của đoạn — chữ cũ giữ nguyên, chỉ tách run làm hai nếu cần */
function chenTai(p, pos, runs, boQua) {
  const ds = tGoc(p, boQua);
  let dem = 0;
  for (const { r, t } of ds) {
    const L = t.textContent.length;
    if (pos > dem + L) { dem += L; continue; }
    const k = pos - dem, con = [...r.childNodes], idx = con.indexOf(t);
    const conSau = con.slice(idx + 1).some(c => c.localName !== "rPr");
    let sau = r;
    if (k === 0 && !con.slice(0, idx).some(c => c.localName !== "rPr")) { runs.forEach(n => r.parentNode.insertBefore(n, r)); return true; }
    if (k < L || conSau) {
      const r2 = r.cloneNode(true), con2 = [...r2.childNodes];
      con2.forEach((c, j) => { if (j < idx && c.localName !== "rPr") r2.removeChild(c); });
      con.forEach((c, j) => { if (j > idx) r.removeChild(c); });
      const trai = t.textContent.slice(0, k), phai = t.textContent.slice(k);
      t.textContent = trai; t.setAttributeNS(XNS, "xml:space", "preserve");
      con2[idx].textContent = phai; con2[idx].setAttributeNS(XNS, "xml:space", "preserve");
      if (!phai) r2.removeChild(con2[idx]);
      if (!trai) r.removeChild(t);
      r.parentNode.insertBefore(r2, r.nextSibling);
      if (![...r2.childNodes].some(c => c.localName !== "rPr")) r2.parentNode.removeChild(r2);
      if (![...r.childNodes].some(c => c.localName !== "rPr")) { sau = r.previousSibling; const cha = r.parentNode; cha.removeChild(r); if (!sau) { runs.forEach(n => cha.insertBefore(n, cha.firstChild && cha.firstChild.localName === "pPr" ? cha.firstChild.nextSibling : cha.firstChild)); return true; } }
    }
    let moc = sau;
    runs.forEach(n => { moc.parentNode.insertBefore(n, moc.nextSibling); moc = n; });
    return true;
  }
  runs.forEach(n => p.appendChild(n));
  return true;
}

/* ---------- lời GV theo việc ghi trong từng bước ---------- */
function lenhCho(buoc, chu, loai, them) {
  const ra = [], co = new Set();
  const day = c => { if (c && !co.has(c[0]) && ra.length < 3) { co.add(c[0]); ra.push(c); } };
  if (buoc === 1 && them && them.mo) day(them.mo);
  if (buoc === 1 && LENH_MO_HD[loai] && !(them && them.mo)) day(LENH_MO_HD[loai]);
  for (const [b, re, f] of LENH) {
    if (b && b !== buoc) continue;
    const m = chu.match(re);
    if (m) day(f(m, buoc, chu));
  }
  if (!ra.length || (ra.length === 1 && them && them.mo && buoc === 1)) day(LENH_MAC_DINH[buoc]);
  if (them && them.ket) { if (ra.length >= 3) ra.pop(); day(them.ket); }
  return ra;
}

/* ---------- áp song ngữ vào một bản sao XML ---------- */
function timTen(ps) {
  for (let i = 0; i < Math.min(ps.length, 16); i++) {
    const t = ps[i].text, m = t.match(/^(?:(TIẾT|Tiết)\s*(\d+)\s*[.:\-–,]?\s*)?(BÀI|Bài|CHỦ ĐỀ|Chủ đề|Chủ Đề)\s*(\d+[a-z]?)/u) || t.match(/^(TIẾT|Tiết)\s*(\d+)\s*[.:\-–]\s*\S/u);
    if (m) return { i, tiet: m[2], loai: m[3] ? (/ch/i.test(m[3]) ? "Topic" : "Lesson") : "", so: m[4] || "" };
  }
  return null;
}
function timNhan(raw, trongTb) {
  for (const k of KHUNG) {
    if (k.vung === "tb" && !trongTb) continue;
    const m = raw.match(k.re);
    if (m) { const nhan = m[1]; return { pos: m.index + m[0].length, en: hoaHet(nhan) && nhan.length > 3 ? k.en.toUpperCase() : k.en, vi: norm(nhan), thuan: /^[\s:.\-–]*$/.test(raw.slice(m.index + m[0].length)) }; }
  }
  return null;
}
function apSongNgu(xmlGoc, chiXem) {
  const doc = new DOMParser().parseFromString(xmlGoc, "application/xml");
  const ps = layDoan(doc), cau = phanTich(ps, GA.themMoc), C = SN.che;
  const moi = new Set(), moiRun = new Set(), sua = new Set(), sauMoc = new Map(), muc = [], canhBao = [], daXong = new Set();
  const ghi = (en, vi, nhom, p) => muc.push({ en: boNhay(en), vi: norm(vi), nhom, p });
  const chen = (iMoc, phan, iMau, giuDam) => {
    if (iMoc == null || iMoc < 0 || !ps[iMoc]) return null;
    const np = taoDoanSN(doc, ps[iMau != null && iMau >= 0 ? iMau : iMoc].p, phan, giuDam);
    const truoc = sauMoc.get(iMoc) || ps[iMoc].p;
    truoc.parentNode.insertBefore(np, truoc.nextSibling);
    sauMoc.set(iMoc, np); moi.add(np); return np;
  };
  const chenTrong = (i, pos, chu, giuDam) => {
    const p = ps[i].p, runs = taoRunsSN(doc, p, [[chu, false]], giuDam);
    runs.forEach(r => moiRun.add(r));
    chenTai(p, pos, runs, moiRun); sua.add(p);
  };
  const dich = i => (C.dich && SN.dich[khoaDich(ps[i].text)]) || "";
  const laDam = p => { const rp = rprMau(p, true); return !!(rp && [...rp.childNodes].some(c => c.localName === "b" && !/^(0|false)$/i.test(c.getAttributeNS(W, "val") || c.getAttribute("w:val") || ""))); };
  const laHd = new Map(cau.hd.map(h => [h.i, h]));
  const ten = timTen(ps);
  // 1) Tên bài: dòng tiếng Anh ngay dưới tên bài
  if (ten && (C.ten || dich(ten.i))) {
    const t = ps[ten.i].text, d = dich(ten.i);
    let en = d || [ten.tiet ? "Period " + ten.tiet + "." : "", ten.loai ? ten.loai + " " + ten.so + (SN.tenEn ? ":" : "") : "", norm(SN.tenEn)].filter(Boolean).join(" ");
    if (!d && hoaHet(t.replace(/\(.*?\)/g, ""))) en = en.toUpperCase();
    if (en) { const np = chen(ten.i, [[en, false]], ten.i, true); ghi(en, t, "ten", np); daXong.add(ten.i); }
  }
  // 2) Đề mục khung giáo án + tên hoạt động (thêm "(English)" ngay sau đề mục)
  const vungTb = cau.tb >= 0 ? [cau.tb, cau.tt > cau.tb ? cau.tt : cau.tb + 30] : [-1, -1];
  ps.forEach((x, i) => {
    if (!x.text || daXong.has(i)) return;
    const raw = chuTho(x.p), d = dich(i), h = laHd.get(i);
    if (h) {   // tên hoạt động
      if (!C.khung && !d) return;
      const m = h.ten.match(/(?:Hoạt động|HOẠT ĐỘNG|HĐ)\s*(\d+(?:\.\d+)*)/u);
      const coKieu = /khởi động|mở đầu|hình thành kiến thức|kiến thức mới|luyện tập|củng cố|vận dụng|mở rộng|tìm tòi/i.test(h.ten);
      let en = d || [m ? "Activity " + m[1] : "", coKieu && LOAI_HD_EN[h.loai] ? LOAI_HD_EN[h.loai] : ""].filter(Boolean).join(": ");
      if (!en) return;
      if (!d && hoaHet(raw)) en = en.toUpperCase();
      chenTrong(i, raw.length, " (" + en + ")", true); ghi(en, x.text, d ? "dich" : "khung", x.p); daXong.add(i); return;
    }
    if (i < 8 && /:/.test(raw) && raw.length < 160 && NHAN_DAU.some(n => { n.re.lastIndex = 0; return n.re.test(raw); })) {   // dòng "Tuần: … Tiết: … Ngày soạn: …"
      if (!C.khung) return;
      const cho = [];
      NHAN_DAU.forEach(n => { n.re.lastIndex = 0; let m; while ((m = n.re.exec(raw))) { const pos = m.index + m[0].length; if (!cho.some(c => Math.abs(c.pos - pos) < 3)) cho.push({ pos, en: n.en, vi: m[1] }); } });
      cho.sort((a, b) => b.pos - a.pos).forEach(c => { chenTrong(i, c.pos, " (" + c.en + ")", false); ghi(c.en, c.vi, "khung", x.p); });
      daXong.add(i); return;
    }
    if (d && x.text.length <= 90 && laDam(x.p) && !timNhan(raw, false)) {   // đề mục đậm có câu dịch → thêm ngay sau đề mục
      chenTrong(i, raw.length, " (" + d + ")", true); ghi(d, x.text, "dich", x.p); daXong.add(i); return;
    }
    if (!C.khung || d && !(timNhan(raw, false) || {}).thuan) return;
    const n = timNhan(raw, i > vungTb[0] && i < vungTb[1]);
    if (!n) return;
    chenTrong(i, n.pos, " (" + n.en + ")", true); ghi(n.en, n.vi, "khung", x.p);
    if (n.thuan) daXong.add(i);
  });
  // 3) Từ vựng trọng tâm: cuối phần Mục tiêu
  const tu = C.tu ? dsTuChon() : [];
  if (tu.length) {
    let moc = -1;
    if (cau.mt >= 0) {
      moc = (cau.tb > cau.mt ? cau.tb : cau.tt > cau.mt ? cau.tt : Math.min(ps.length, cau.mt + 30)) - 1;
      while (moc > cau.mt && (!ps[moc].text || ps[moc].cha !== ps[cau.mt].cha)) moc--;
    } else if (cau.tt > 0) { moc = cau.tt - 1; while (moc > 0 && !ps[moc].text) moc--; }
    if (moc >= 0) {
      const np0 = chen(moc, [["* Key vocabulary", true], [" (Từ vựng trọng tâm):", false]], moc);
      ghi("Key vocabulary", "Từ vựng trọng tâm", "tu", np0);
      tu.forEach(x => { const np = chen(moc, [["- ", false], [x.en, true], [": " + x.vi, false]], moc); ghi(x.en, x.vi, "tu", np); });
    } else canhBao.push("Không thấy phần “Mục tiêu” — chưa chèn được Từ vựng trọng tâm.");
  }
  // 4) Lời GV trên lớp (Classroom English) cuối từng bước của từng hoạt động
  if (C.lenh) {
    const dsHd = cau.hd.filter(h => !h.thay && !(h.con && !["a", "b", "c", "d", "b1"].some(k => h.s[k] >= 0)));
    const chuKhoang = (a, b) => ps.slice(Math.max(0, a), b + 1).map(x => x.text).join(" ; ");
    const loiMo = ["Good morning, class! " + (norm(SN.tenEn) ? "Today we are going to learn about " + norm(SN.tenEn).replace(/[.!]+$/, "").replace(/^\p{Lu}(?=\p{Ll})/u, c => c.toLowerCase()) + "." : "Let's start our lesson."), "Chào cả lớp! Hôm nay chúng ta học bài mới."];
    const loiKet = ["That's all for today. Goodbye, class!", "Hôm nay đến đây là hết. Chào cả lớp!"];
    dsHd.forEach((h, k) => {
      const dau = k === 0, cuoi = k === dsHd.length - 1;
      const viet = (iMoc, ds) => {
        if (iMoc == null || iMoc < 0 || !ds.length) return;
        const np = chen(iMoc, [["- Teacher: ", true], ["“" + ds.map(c => c[0]).join(" ") + "”", false]], iMoc);
        ds.forEach(c => ghi(c[0], c[1], "lenh", np));
      };
      if (h.s.b1 >= 0) {
        const bat = ["b1", "b2", "b3", "b4"].map(b => h.s[b]);
        ["cg", "th", "bc", "kl"].forEach((key, j) => {
          if (bat[j] < 0 || !h.vt[key]) return;
          const het = h.vt[key].i;
          viet(het, lenhCho(j + 1, het > bat[j] ? chuKhoang(bat[j] + 1, het) : chuTho(ps[het].p).replace(KHUNG.find(q => q.re.test(chuTho(ps[het].p)))?.re || /^/, ""), h.loai, { mo: dau && j === 0 ? loiMo : null, ket: cuoi && j === 3 ? loiKet : null }));
        });
      } else {
        const moc = h.vt.cg ? h.vt.cg.i : h.i;
        const ds = lenhCho(1, chuKhoang(h.i, h.het - 1), h.loai, { mo: dau ? loiMo : null, ket: cuoi ? loiKet : null });
        viet(moc, ds);
      }
    });
    if (!dsHd.length) canhBao.push("Chưa nhận ra hoạt động nào — chưa chèn được lời GV trên lớp. Dùng «＋ Thêm mốc hoạt động» ở bước 2.");
  }
  // 5) Câu dịch: dòng tiếng Anh ngay dưới đoạn gốc (mượn định dạng đoạn gốc)
  if (C.dich) ps.forEach((x, i) => {
    if (daXong.has(i) || !x.text) return;
    const d = dich(i);
    if (!d) return;
    const np = chen(i, [[d, false]], i, laDam(x.p) && x.text.length <= 90);
    ghi(d, x.text, "dich", np);
  });
  if (chiXem) return { doc, moi, sua, muc, canhBao };
  let s = new XMLSerializer().serializeToString(doc);
  if (!/^<\?xml/.test(s)) s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' + s;
  // KIỂM 1: từng đoạn gốc còn nguyên từng chữ
  const docGoc = new DOMParser().parseFromString(xmlGoc, "application/xml"), psGoc = layDoan(docGoc);
  const lechChu = psGoc.filter((x, i) => !ps[i] || chuTho(x.p) !== chuTho(ps[i].p, moiRun)).length;
  if (lechChu) throw new Error(lechChu + " đoạn gốc bị thay đổi chữ — em dừng, không xuất.");
  // KIỂM 2: công thức, hình, chỉ số… của phần gốc phải đủ như cũ
  const doc2 = new DOMParser().parseFromString(s, "application/xml");
  if (doc2.getElementsByTagName("parsererror").length) throw new Error("File ghi ra bị lỗi cấu trúc — em dừng, không xuất.");
  const tatCaMoi = new Set([...moi, ...moiRun]);
  const goc = demVat(docGoc), cMoi = demVat(doc), chiGoc = demVat(doc, tatCaMoi), tong2 = demVat(doc2);
  const lech = Object.keys(goc).filter(k => goc[k] !== chiGoc[k] || tong2[k] !== goc[k] + (cMoi[k] - chiGoc[k]));
  if (lech.length) throw new Error("Phần gốc bị thay đổi ở: " + lech.map(k => VAT[k]).join(", ") + " — em dừng, không xuất.");
  return { xml: s, moi, sua, muc, canhBao, giu: goc };
}

/* ---------- từ vựng ---------- */
function timTu(ps) {
  const khoa = ps.filter(x => x.text).map(x => " " + khoaViet(x.text) + " ");
  const dem = new Map();
  TU_KHOA.forEach(x => {
    let n = 0;
    khoa.forEach(k => { let j = k.indexOf(x.k); while (j >= 0) { n++; j = k.indexOf(x.k, j + 1); } });
    if (!n) return;
    const cu = dem.get(x.k);
    if (!cu || (SN.mon && x.mon === SN.mon && cu.mon !== SN.mon)) dem.set(x.k, Object.assign({ n }, x));
  });
  return [...dem.values()].sort((a, b) => (a.mon === SN.mon ? 0 : 1) - (b.mon === SN.mon ? 0 : 1) || b.n - a.n);
}
function tuMacDinh() {
  const ds = GA.tim.filter(x => x.mon !== "Dùng chung" && (!SN.mon || x.mon === SN.mon));
  const gon = ds.filter(x => !ds.some(y => y !== x && y.k.length > x.k.length && y.k.includes(x.k)));   // "cây nhãn" thì bỏ "nhãn"
  return new Set(gon.slice(0, 12).map(x => x.k));
}
function dsTuChon() {
  const ra = [], co = new Set();
  if (GA) GA.tim.forEach(x => { if (GA.tuChon.has(x.k) && !co.has(x.en.toLowerCase())) { co.add(x.en.toLowerCase()); ra.push({ vi: x.vi, en: x.en }); } });
  SN.tuTay.forEach(x => { if (norm(x.vi) && norm(x.en) && !co.has(norm(x.en).toLowerCase())) { co.add(norm(x.en).toLowerCase()); ra.push({ vi: norm(x.vi), en: norm(x.en) }); } });
  return ra;
}

/* ---------- đoạn cần dịch ---------- */
function nhomDoan(x, i, cau) {
  const t = x.text, n = [];
  if (cau.hd.some(h => h.i === i) || (timTen(GA.ps) || {}).i === i) n.push("ten");
  if (cau.mt >= 0 && i > cau.mt && i < (cau.tb > 0 ? cau.tb : cau.vungMt[1])) n.push("mt");
  if (/^[a-c]\s*[.)]\s*(Mục tiêu|Nội dung|Sản phẩm)/i.test(t)) n.push("abc");
  const h = cau.hd.filter(y => y.i < i).pop();
  if (h) {
    const s = h.s, trong = (a, b) => a >= 0 && i > a && (b < 0 || i < b);
    if (trong(s.b1, s.b2 >= 0 ? s.b2 : h.het) || (s.b1 < 0 && /^[-+•*]?\s*(GV|Giáo viên|Nhiệm vụ)/i.test(t))) n.push("giao");
    if (trong(s.b4, h.het) || /^[-+•*]?\s*(GV|Giáo viên)\s*(chốt|kết luận)/i.test(t) || (x.cha && x.cha.localName === "tc" && x.cha.previousElementSibling && x.cha.previousElementSibling.localName === "tc" && i > (s.d >= 0 ? s.d : h.i))) n.push("chot");
    if (/\?\s*$/.test(t)) n.push("hoi");
  }
  return n;
}
function dsDoanDich() {
  if (!GA) return [];
  const c = GA.cau, ra = [];
  GA.ps.forEach((x, i) => {
    const t = x.text;
    if (!t || t.length < 3 || /^[.…\s:]+$/.test(t) || /^[\d\s.,…:/()-]+$/.test(t)) return;
    const n = timNhan(chuTho(x.p), true);
    if (n && n.thuan) return;   // đề mục khung — app tự dịch
    if (/^(Tuần|Tiết|Ngày soạn|Ngày dạy)\b/.test(t) && t.length < 120) return;
    ra.push({ i, t, k: khoaDich(t), nhom: nhomDoan(x, i, c) });
  });
  return ra;
}
function cauLenhAI(ds) {
  const mon = SN.mon && SN.mon !== "Dùng chung" ? SN.mon : "của bài này", lop = SN.lop ? " lớp " + SN.lop : "";
  return `Bạn là giáo viên dạy song ngữ Việt – Anh môn ${mon}${lop} (Chương trình GDPT 2018 của Việt Nam).
Hãy dịch từng dòng dưới đây sang tiếng Anh chuẩn (Anh–Mỹ), câu ngắn gọn, rõ ràng, dễ đọc thành tiếng trên lớp, dùng đúng thuật ngữ của môn học.
- Giữ nguyên số thứ tự trong ngoặc vuông, kí hiệu, công thức, con số, tên riêng.
- Viết tắt GV dịch là "the teacher", HS dịch là "students"; SGK là "the textbook".
- Không giải thích, không thêm dòng nào khác.
Trả lời đúng mẫu, mỗi dòng một câu:
[1] câu tiếng Anh
[2] câu tiếng Anh

${ds.map((x, n) => `[${n + 1}] ${x.t}`).join("\n")}`;
}
function napBanDich(s) {
  if (!GA || !GA.phien || !GA.phien.length) return 0;
  let n = 0;
  s.replace(/\r/g, "").split("\n").forEach(d => {
    const m = d.match(/^\s*(?:\*\*)?\[?(\d+)[\]).:]\s*(?:\*\*)?\s*(.+)$/);
    if (!m) return;
    const k = GA.phien[+m[1] - 1], en = norm(m[2]).replace(/^\*\*|\*\*$/g, "");
    if (k && en) { SN.dich[k] = en; n++; }
  });
  luu(); return n;
}

/* ---------- ĐỌC MẪU: lặp lại, lần sau chậm hơn, nghỉ để thầy cô đọc theo ---------- */
const CO_DOC = "speechSynthesis" in window;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let PHIEN = 0;
const GIU_U = [];
const cho = ms => new Promise(ok => setTimeout(ok, ms));
const CO_CHU_VIET = /[àáảãạăắằẳẵặâấầẩẫậèẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
function giongAnh() { return CO_DOC ? speechSynthesis.getVoices().filter(v => /^en([-_]|$)/i.test(v.lang)) : []; }
function diemGiong(v) {
  let d = 0;
  if (/natural|neural|online|premium|enhanced/i.test(v.name)) d += 4;
  if (/google/i.test(v.name)) d += 3;
  if (/microsoft|samantha|daniel|karen|moira|serena/i.test(v.name)) d += 1;
  if (v.lang.replace("_", "-").toLowerCase() === SN.doc.vung.toLowerCase()) d += 6;
  if (v.localService === false) d += .5;
  return d;
}
function giongDung() {
  const ds = giongAnh();
  if (SN.doc.giong) { const v = ds.find(v => v.voiceURI === SN.doc.giong); if (v) return v; }
  return ds.sort((a, b) => diemGiong(b) - diemGiong(a))[0] || null;
}
function tocDo(k) { return Math.max(.4, Math.round((SN.doc.toc - k * SN.doc.giam) * 100) / 100); }
function noiMot(chu, rate, khiDen) {
  return new Promise(ok => {
    const v = giongDung();
    if (!v || CO_CHU_VIET.test(chu)) { ok(); return; }   // không bao giờ để giọng khác đọc
    const u = new SpeechSynthesisUtterance(chu);
    u.voice = v; u.lang = v.lang;
    u.rate = rate; u.pitch = 1;
    u.onboundary = e => khiDen && khiDen(e.charIndex || 0);
    let xong = false; const het = () => { if (!xong) { xong = true; ok(); } };
    u.onend = het; u.onerror = het;
    setTimeout(het, 1500 + chu.length * 220 / rate);   // phòng máy không báo đọc xong
    GIU_U.push(u); if (GIU_U.length > 30) GIU_U.shift();
    speechSynthesis.speak(u);
  });
}
function cumTu(chu) {
  const ra = [];
  chu.split(/(?<=[,;:])\s+/).forEach(c => {
    const w = c.split(/\s+/);
    if (w.length <= 6) ra.push(c); else for (let i = 0; i < w.length; i += 4) ra.push(w.slice(i, i + 4).join(" "));
  });
  return ra.filter(Boolean);
}
const soTu = s => (s.match(/[A-Za-z0-9']+/g) || []).length;
function nghiTheo(chu, rate) { return SN.doc.nghi === "tu" ? Math.min(15, Math.max(2, 1.2 + soTu(chu) * .55 / rate)) : +SN.doc.nghi; }
function dungDoc() { PHIEN++; if (CO_DOC) speechSynthesis.cancel(); document.querySelectorAll(".cau.dang").forEach(e => e.classList.remove("dang")); document.querySelectorAll(".tt-doc").forEach(e => e.textContent = ""); }
function sangTu(el, vt) { if (!el) return; let chon = null; el.querySelectorAll(".w").forEach(w => { w.classList.remove("sang"); if (+w.dataset.c <= vt) chon = w; }); if (chon) chon.classList.add("sang"); }
async function docLap(item, el, motLan) {
  if (!CO_DOC) { TT.toast("Trình duyệt này không có giọng đọc. Thầy cô dùng Chrome hoặc Edge ạ.", "loi"); return; }
  // chỉ đọc TIẾNG ANH bằng GIỌNG TIẾNG ANH: câu có chữ Việt hoặc máy không có giọng Anh thì không đọc
  if (CO_CHU_VIET.test(item.en)) { TT.toast("Câu này có chữ tiếng Việt — app chỉ đọc mẫu câu tiếng Anh.", "loi"); TT.buzz(); return; }
  if (!giongDung()) { TT.toast("Máy chưa có giọng tiếng Anh — xem hướng dẫn cài giọng ở mục 6.", "loi"); TT.buzz(); $("khongGiong").hidden = false; return; }
  const phien = ++PHIEN; speechSynthesis.cancel(); await cho(80);
  const o = el && el.querySelector(".tt-doc"), hop = el && el.querySelector(".en");
  document.querySelectorAll(".cau.dang").forEach(e => e.classList.remove("dang"));
  if (el) { el.classList.add("dang"); el.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  const lap = motLan ? 1 : Math.max(1, +SN.doc.lap || 1), chu = item.en;
  for (let k = 0; k < lap; k++) {
    if (phien !== PHIEN) return;
    const rate = motLan === "cham" ? tocDo(Math.max(1, lap - 1)) : tocDo(k);
    if (o) o.textContent = `🔊 Lần ${k + 1}/${lap} · tốc độ ${rate}×`;
    if (!motLan && lap > 1 && k === lap - 1 && SN.doc.cum && soTu(chu) > 6) {
      let dau = 0;
      for (const c of cumTu(chu)) {
        if (phien !== PHIEN) return;
        const goc = chu.indexOf(c, dau); dau = goc + c.length;
        await noiMot(c, rate, b => sangTu(hop, goc + b)); await cho(450);
      }
    } else await noiMot(chu, rate, b => sangTu(hop, b));
    if (phien !== PHIEN) return;
    if (motLan) break;
    const giay = nghiTheo(chu, rate);
    for (let s = Math.ceil(giay); s > 0; s--) { if (phien !== PHIEN) return; if (o) o.textContent = `🗣️ Thầy cô đọc theo… ${s}`; await cho(Math.min(1000, giay * 1000 / Math.ceil(giay))); }
  }
  if (phien !== PHIEN) return;
  if (o) o.textContent = "✓ Xong"; if (hop) hop.querySelectorAll(".w").forEach(w => w.classList.remove("sang"));
  if (el) el.classList.remove("dang");
  return true;
}
async function docCaDs() {
  const ds = [...document.querySelectorAll("#dsDoc .cau")];
  if (!ds.length) { TT.toast("Chưa có câu tiếng Anh nào để đọc", "loi"); return; }
  const phien0 = PHIEN + 1;
  for (const el of ds) {
    const it = MUC_HIEN[+el.dataset.n];
    const xong = await docLap(it, el);
    if (!xong || PHIEN !== phien0 + ds.indexOf(el)) return;
    await cho(500);
  }
}
/* thầy cô đọc thử — so với câu mẫu */
const tachTu = s => (s.toLowerCase().replace(/[’‘]/g, "'").match(/[a-z0-9']+/g) || []).map(w => w.replace(/^'+|'+$/g, ""));
function soKhop(goc, nghe) {
  const a = tachTu(goc), b = tachTu(nghe), n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const dung = new Array(n).fill(false);
  for (let i = 0, j = 0; i < n && j < m;) { if (a[i] === b[j]) { dung[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  return { dung, diem: n ? dung.filter(Boolean).length / n : 0 };
}
function thuDoc(item, el) {
  if (!SR) { TT.toast("Máy này chưa nghe được giọng. Thầy cô dùng Chrome hoặc Edge ạ.", "loi"); return; }
  dungDoc();
  const r = new SR(), o = el.querySelector(".tt-doc"), hop = el.querySelector(".en");
  r.lang = (giongDung() || {}).lang || SN.doc.vung; r.interimResults = false; r.maxAlternatives = 3;
  o.textContent = "🎤 Mời thầy cô đọc câu này…"; el.classList.add("nghe");
  r.onresult = e => {
    const alts = [...e.results[0]].map(a => a.transcript);
    let tot = null; alts.forEach(a => { const k = soKhop(item.en, a); if (!tot || k.diem > tot.diem) tot = Object.assign({ nghe: a }, k); });
    let j = 0;
    hop.querySelectorAll(".w").forEach(w => { const so = tachTu(w.textContent).length; if (!so) return; const ok = tot.dung.slice(j, j + so).every(Boolean); j += so; w.classList.toggle("dung", ok); w.classList.toggle("sai", !ok); });
    const pt = Math.round(tot.diem * 100);
    o.innerHTML = `${pt >= 85 ? "🌟" : pt >= 60 ? "👍" : "🔁"} Khớp <b>${pt}%</b> · máy nghe được: “${TT.esc(tot.nghe)}”${pt < 85 ? " — chữ đỏ: nghe lại mẫu rồi đọc lại" : ""}`;
    if (pt >= 85) TT.ting();
  };
  r.onerror = e => { o.textContent = e.error === "not-allowed" ? "Chưa cho phép dùng micro — bấm biểu tượng ổ khoá trên thanh địa chỉ để cho phép." : e.error === "no-speech" ? "Chưa nghe thấy giọng, thầy cô thử lại ạ." : "Không nghe được (" + e.error + ")."; };
  r.onend = () => el.classList.remove("nghe");
  try { r.start(); } catch (e) { o.textContent = "Micro đang bận, thử lại sau giây lát."; }
}

/* ---------- nạp file ---------- */
async function napFile(f) {
  const ten = f.name, duoi = (ten.split(".").pop() || "").toLowerCase();
  if (duoi === "doc") { TT.toast("File .doc đời cũ: mở bằng Word → Lưu thành (Save As) → chọn .docx rồi đưa lên lại ạ.", "loi"); TT.buzz(); return; }
  if (!["docx", "pdf"].includes(duoi)) { TT.toast("App nhận file Word (.docx) hoặc PDF.", "loi"); TT.buzz(); return; }
  $("trangThai").innerHTML = "⏳ Đang đọc <b>" + TT.esc(ten) + "</b>…";
  try {
    const buf = await f.arrayBuffer();
    let zip, xml, ghiChu = "";
    if (duoi === "docx") {
      zip = await JSZip.loadAsync(buf);
      const f2 = zip.file("word/document.xml");
      if (!f2) throw new Error("File này không phải giáo án Word hợp lệ.");
      xml = await f2.async("string");
    } else {
      const r = await docPdf(buf); zip = r.zip; xml = r.xml;
      ghiChu = `PDF ${r.trang} trang đã được dựng lại thành Word (Times New Roman 13). Bảng, hình, khung trong PDF <b>không giữ được</b>; công thức nhiều tầng sẽ vỡ. Muốn giữ đúng cấu trúc giáo án cũ, thầy cô đưa <b>file Word gốc</b>.`;
    }
    GA = { ten: ten.replace(/\.(docx|pdf)$/i, ""), nguon: duoi, zip, xml, ghiChu, themMoc: [], phien: [] };
    phanTichLai(true);
    TT.ting(); TT.toast("Đã đọc xong giáo án", "ok");
  } catch (e) { GA = null; $("trangThai").textContent = "❌ " + (e.message || "Không đọc được file."); TT.buzz(); veHet(); }
}
function phanTichLai(fileMoi) {
  const doc = new DOMParser().parseFromString(GA.xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) throw new Error("Không đọc được nội dung file Word.");
  GA.ps = layDoan(doc); GA.cau = phanTich(GA.ps, GA.themMoc);
  if (fileMoi) {
    GA.vat = moTaVat(demVat(doc)); GA.tim = timTu(GA.ps); GA.tuChon = tuMacDinh();
    GA.chon = new Set(dsDoanDich().filter(x => x.nhom.includes("mt") || x.nhom.includes("ten")).map(x => x.k));
    if (!SN.mon) { const dem = {}; GA.tim.forEach(x => { if (x.mon !== "Dùng chung") dem[x.mon] = (dem[x.mon] || 0) + x.n; }); const best = Object.keys(dem).sort((a, b) => dem[b] - dem[a])[0]; if (best) { SN.mon = best; $("chonMon").value = best; GA.tim = timTu(GA.ps); GA.tuChon = tuMacDinh(); } }
  }
  veHet();
}

/* ---------- giao diện ---------- */
const TEN_NHOM = { ten: "Tên bài, tên HĐ", mt: "Mục tiêu", abc: "a) b) c)", giao: "Giao nhiệm vụ (Bước 1)", chot: "Kiến thức chốt", hoi: "Câu hỏi" };
const TEN_NHOM_DOC = { tat: "Tất cả", tu: "Từ vựng", lenh: "Lời GV trên lớp", dich: "Câu dịch", ten: "Tên bài", khung: "Đề mục khung" };
let LOC_DOC = "tat", LOC_DICH = "";
let MUC_HIEN = [];
function veKhung() {
  const k = $("khungGa");
  if (!GA) { k.innerHTML = '<p class="mo">Chưa có giáo án. Đưa file lên ở bước 1.</p>'; if (!$("trangThai").innerHTML.startsWith("❌")) $("trangThai").innerHTML = "Chưa có file."; return; }
  const c = GA.cau, ps = GA.ps, ten = timTen(ps);
  $("trangThai").innerHTML = `✅ <b>${TT.esc(GA.ten)}</b>.${GA.nguon} · ${ps.length} đoạn · nhận ra ${c.hd.length} hoạt động` + (GA.vat && GA.nguon === "docx" ? `<div class="giu">🛡️ Có ${TT.esc(GA.vat)} — app không động vào, file tải về giữ nguyên.</div>` : "") + (GA.ghiChu ? `<div class="canh">⚠️ ${GA.ghiChu}</div>` : "");
  const soKhung = ps.filter((x, i) => x.text && timNhan(chuTho(x.p), i > c.tb && i < c.tt)).length;
  const dong = [
    `<div class="kg ${ten ? "ok" : "thieu"}"><b>Tên bài</b> ${ten ? "· “" + TT.esc(ngan(ps[ten.i].text, 60)) + "”" : '· <span class="do">chưa thấy dòng “Bài …/Tiết …”</span>'}</div>`,
    `<div class="kg ${soKhung ? "ok" : "thieu"}"><b>Đề mục khung</b> · ${soKhung} đề mục app tự thêm tiếng Anh (Mục tiêu, Năng lực, Bước 1…)</div>`,
    `<div class="kg ${c.mt >= 0 ? "ok" : "thieu"}"><b>Mục tiêu</b> ${c.mt >= 0 ? "· từ vựng trọng tâm chèn ở cuối phần này" : '· <span class="do">chưa thấy</span>'}</div>`
  ];
  c.hd.forEach(h => {
    const buoc = ["b1", "b2", "b3", "b4"].filter(k2 => h.s[k2] >= 0).length;
    dong.push(`<div class="kg ok" style="margin-left:${(h.cap - 1) * 18}px"><span class="the-hd l-${h.loai || "x"}">${{ kd: "Khởi động", ht: "Hình thành KT", lt: "Luyện tập", vd: "Vận dụng" }[h.loai] || "Hoạt động"}</span> ${TT.esc(ngan(h.ten, 80))} <span class="mo">${h.thay ? "· (gồm HĐ con)" : buoc ? "· " + buoc + "/4 bước → lời GV từng bước" : "· không chia bước → 1 dòng lời GV"}</span></div>`);
  });
  if (!c.hd.length) dong.push('<div class="kg thieu">Chưa nhận ra hoạt động nào. Bấm <b>＋ Thêm mốc hoạt động</b> để tự chọn tên hoạt động trong giáo án.</div>');
  k.innerHTML = dong.join("");
  const tu = c.tt >= 0 ? c.tt + 1 : 0;
  $("chonMoc").innerHTML = '<option value="">— chọn một dòng tên hoạt động —</option>' + ps.slice(tu).filter(x => x.text && x.text.length < 140 && !c.hd.some(h => h.i === x.i)).map(x => `<option value="${x.i}">${TT.esc(ngan(x.text, 90))}</option>`).join("");
}
function veTu() {
  const k = $("dsTu");
  if (!GA) { k.innerHTML = '<p class="mo">Đưa giáo án lên — app dò thuật ngữ có trong bài.</p>'; }
  else if (!GA.tim.length) k.innerHTML = '<p class="mo">Chưa thấy thuật ngữ nào trong từ điển của app. Thầy cô thêm tay ở dưới.</p>';
  else {
    const mon = GA.tim.filter(x => x.mon === SN.mon), khac = GA.tim.filter(x => x.mon !== SN.mon);
    const chip = x => `<label class="chip ${GA.tuChon.has(x.k) ? "chon" : ""}" title="${TT.esc(x.mon)} · gặp ${x.n} lần"><input type="checkbox" data-tu="${TT.esc(x.k)}" ${GA.tuChon.has(x.k) ? "checked" : ""}><b>${TT.esc(x.en)}</b> <span>${TT.esc(x.vi)}</span><button class="loa" data-nghe="${TT.esc(x.en)}" title="Nghe">🔊</button></label>`;
    k.innerHTML = (mon.length ? `<div class="mo nho2">Môn ${TT.esc(SN.mon)} (${mon.length}):</div><div class="chips">${mon.map(chip).join("")}</div>` : "") +
      (khac.length ? `<details ${mon.length ? "" : "open"}><summary class="nho2">Thuật ngữ môn khác / dùng chung có trong bài (${khac.length})</summary><div class="chips">${khac.map(chip).join("")}</div></details>` : "");
  }
  $("dsTuTay").innerHTML = SN.tuTay.map((x, n) => `<div class="hang tu-tay" data-n="${n}"><input data-tt="vi" placeholder="tiếng Việt" value="${TT.esc(x.vi)}"><input data-tt="en" placeholder="English" value="${TT.esc(x.en)}"><button class="nut phu nho" data-nghe="${TT.esc(x.en)}">🔊</button><button class="nut phu nho" data-xoatu="${n}">🗑</button></div>`).join("");
  $("soTu").textContent = dsTuChon().length;
}
function veDich() {
  const k = $("dsDich");
  if (!GA) { k.innerHTML = '<p class="mo">Đưa giáo án lên để chọn đoạn cần dịch.</p>'; $("soChon").textContent = "0"; return; }
  const ds = dsDoanDich().filter(x => !LOC_DICH || x.nhom.includes(LOC_DICH) || (LOC_DICH === "co" && SN.dich[x.k]));
  k.innerHTML = ds.length ? ds.map(x => `<div class="dd ${GA.chon.has(x.k) ? "chon" : ""}" data-k="${TT.esc(x.k)}">
      <label class="tick"><input type="checkbox" data-chon ${GA.chon.has(x.k) ? "checked" : ""}><span class="vi">${TT.esc(x.t)}</span></label>
      <div class="hang"><input data-en placeholder="Câu tiếng Anh (dán từ AI hoặc tự gõ)…" value="${TT.esc(SN.dich[x.k] || "")}">${SN.dich[x.k] ? `<button class="nut phu nho" data-nghe="${TT.esc(SN.dich[x.k])}">🔊</button>` : ""}</div></div>`).join("") : '<p class="mo">Không có đoạn nào ở nhóm này.</p>';
  $("soChon").textContent = GA.chon.size;
  $("soDich").textContent = dsDoanDich().filter(x => SN.dich[x.k]).length;
}
function veXem() {
  const k = $("xemTruoc");
  if (!GA) { k.innerHTML = '<p class="mo">Đưa giáo án lên để xem trước.</p>'; $("canhBao").innerHTML = ""; MUC = []; veDoc(); return; }
  let r;
  try { r = apSongNgu(GA.xml, true); } catch (e) { k.textContent = "Lỗi xem trước: " + e.message; return; }
  MUC = r.muc;
  const ps = layDoan(r.doc), chiMoi = $("chiQuanh").checked, giu = new Set();
  const enCua = new Map(); r.muc.forEach(m => { if (m.p) enCua.set(m.p, (enCua.get(m.p) || []).concat(m.en)); });
  if (chiMoi) ps.forEach((p, i) => { if (r.moi.has(p.p) || r.sua.has(p.p)) for (let j = i - 1; j <= i + 1; j++) giu.add(j); });
  let html = "", bo = false;
  ps.forEach((p, i) => {
    if (chiMoi && !giu.has(i)) { if (!bo) { html += '<div class="bo">⋯</div>'; bo = true; } return; }
    bo = false;
    const la = r.moi.has(p.p), en = enCua.get(p.p);
    html += `<p class="${la ? "moi" : ""}${r.sua.has(p.p) ? " sua" : ""}${p.cha && p.cha.localName === "tc" ? " o-bang" : ""}">${chuCoDam(p.p) || "&nbsp;"}${en ? ` <button class="loa" data-nghe="${TT.esc(en.join(" "))}" title="Nghe đọc mẫu">🔊</button>` : ""}</p>`;
  });
  k.innerHTML = html || '<p class="mo">(giáo án trống)</p>';
  $("soMoi").textContent = r.moi.size + " dòng mới · " + r.sua.size + " đề mục thêm tiếng Anh";
  $("canhBao").innerHTML = r.canhBao.map(c => `<div>⚠️ ${TT.esc(c)}</div>`).join("");
  veDoc();
}
function veChu(en) {   // tách từ để tô sáng khi đọc, tô đúng/sai khi đọc thử
  let c = 0;
  return en.split(/(\s+)/).map(t => { const s = /\S/.test(t) ? `<span class="w" data-c="${c}">${TT.esc(t)}</span>` : t; c += t.length; return s; }).join("");
}
function veDoc() {
  const k = $("dsDoc"), co = new Set();
  const THU_TU = { ten: 0, tu: 1, lenh: 2, dich: 3, khung: 4 };
  MUC_HIEN = MUC.filter(m => m.en && (LOC_DOC === "tat" || m.nhom === LOC_DOC) && !co.has(m.en.toLowerCase()) && co.add(m.en.toLowerCase()))
    .map((m, i) => [m, i]).sort((a, b) => THU_TU[a[0].nhom] - THU_TU[b[0].nhom] || a[1] - b[1]).map(x => x[0]);
  const dem = { tat: 0 }; const co2 = new Set();
  MUC.forEach(m => { if (!m.en || co2.has(m.nhom + m.en.toLowerCase())) return; co2.add(m.nhom + m.en.toLowerCase()); dem[m.nhom] = (dem[m.nhom] || 0) + 1; dem.tat++; });
  $("locDoc").innerHTML = Object.keys(TEN_NHOM_DOC).filter(n => n === "tat" || dem[n]).map(n => `<button class="${LOC_DOC === n ? "chon" : ""}" data-loc="${n}">${TEN_NHOM_DOC[n]} <span>${dem[n] || 0}</span></button>`).join("");
  k.innerHTML = MUC_HIEN.length ? MUC_HIEN.map((m, n) => `<div class="cau" data-n="${n}">
      <div class="noi-dung"><div class="en">${veChu(m.en)}</div><div class="vi">${TT.esc(m.vi)}</div><div class="tt-doc"></div></div>
      <div class="nut-doc"><button class="nut nho" data-doc title="Đọc ${SN.doc.lap} lần, lần sau chậm hơn">🔊 ×${SN.doc.lap}</button><button class="nut phu nho" data-cham title="Nghe 1 lần thật chậm">🐢</button>${SR ? '<button class="nut phu nho" data-thu title="Thầy cô đọc thử, máy so với câu mẫu">🎤</button>' : ""}</div></div>`).join("")
    : '<p class="mo">Chưa có câu tiếng Anh. Đưa giáo án lên, chọn phần song ngữ ở bước 2–4.</p>';
}
function veGiong() {
  const s = $("chonGiong"), ds = giongAnh().sort((a, b) => diemGiong(b) - diemGiong(a));
  s.innerHTML = `<option value="">Tự chọn giọng tốt nhất${giongDung() ? " (" + TT.esc(giongDung().name) + ")" : ""}</option>` + ds.map(v => `<option value="${TT.esc(v.voiceURI)}" ${v.voiceURI === SN.doc.giong ? "selected" : ""}>${TT.esc(v.name)} · ${v.lang}</option>`).join("");
  $("khongGiong").hidden = !!ds.length || !CO_DOC;
  $("khongDoc").hidden = CO_DOC;
  $("dsTocDo").textContent = Array.from({ length: Math.max(1, +SN.doc.lap) }, (_, k) => `Lần ${k + 1}: ${tocDo(k)}×`).join(" · ");
}
function veHet() { veKhung(); veTu(); veDich(); veXem(); }

/* ---------- xuất Word ---------- */
async function xuatWord() {
  if (!GA) { TT.toast("Đưa giáo án lên trước ạ", "loi"); TT.buzz(); return; }
  let r;
  try { r = apSongNgu(GA.xml, false); } catch (e) { TT.toast(e.message, "loi"); TT.buzz(); $("canhBao").innerHTML = `<div>❌ ${TT.esc(e.message)}</div>`; return; }
  if (!r.moi.size && !r.sua.size) { TT.toast("Chưa có nội dung song ngữ nào để thêm", "loi"); TT.buzz(); return; }
  GA.zip.file("word/document.xml", r.xml);
  let blob;
  try {
    blob = await GA.zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", compression: "DEFLATE" });
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
  GA.zip.file("word/document.xml", GA.xml);
  const mt = moTaVat(r.giu);
  $("giuNguyen").innerHTML = `🛡️ Đã kiểm file tải về: mọi đoạn gốc còn nguyên từng chữ, chỉ thêm ${r.moi.size} dòng tiếng Anh và ${r.sua.size} đề mục song ngữ${mt ? " — còn đủ " + TT.esc(mt) : ""}.`;
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = GA.ten + " - song ngu.docx";
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  TT.ting(); TT.phaoGiay(); TT.toast(`Đã xuất Word song ngữ: ${r.moi.size + r.sua.size} chỗ`, "ok");
  return blob;
}

/* ---------- gắn sự kiện ---------- */
function nghe(chu) { if (chu) docLap({ en: chu }, null, true); }
document.addEventListener("DOMContentLoaded", () => {
  $("chonMon").innerHTML = '<option value="">— chọn môn —</option>' + DS_MON.filter(m => m !== "Dùng chung").map(m => `<option>${m}</option>`).join("") + "<option>Môn khác</option>";
  $("chonMon").value = SN.mon; $("chonLop").value = SN.lop; $("tenEn").value = SN.tenEn; $("chonMau").value = SN.mau;
  Object.keys(SN.che).forEach(k => { const o = document.querySelector(`[data-che="${k}"]`); if (o) o.checked = SN.che[k]; });
  ["lap", "toc", "giam", "nghi", "vung"].forEach(k => { $("d_" + k).value = SN.doc[k]; });
  $("d_cum").checked = SN.doc.cum;
  const o = $("oTha"), chon = $("chonFile");
  o.onclick = () => chon.click();
  o.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chon.click(); } };
  chon.onchange = () => { if (chon.files[0]) napFile(chon.files[0]); chon.value = ""; };
  ["dragenter", "dragover"].forEach(t => o.addEventListener(t, e => { e.preventDefault(); o.classList.add("keo"); }));
  ["dragleave", "drop"].forEach(t => o.addEventListener(t, e => { e.preventDefault(); o.classList.remove("keo"); }));
  o.addEventListener("drop", e => { const f = e.dataTransfer.files[0]; if (f) napFile(f); });
  $("chonMon").onchange = e => { SN.mon = e.target.value; luu(); if (GA) { GA.tim = timTu(GA.ps); GA.tuChon = tuMacDinh(); } veHet(); };
  $("chonLop").onchange = e => { SN.lop = e.target.value; luu(); };
  $("chonMau").onchange = e => { SN.mau = e.target.value; luu(); veXem(); };
  let hen;
  $("tenEn").oninput = e => { SN.tenEn = e.target.value; luu(); clearTimeout(hen); hen = setTimeout(veXem, 400); };
  document.querySelectorAll("[data-che]").forEach(c => c.onchange = () => { SN.che[c.dataset.che] = c.checked; luu(); veXem(); });
  $("bThemMoc").onclick = () => { const v = $("chonMoc").value; if (!GA || v === "") return; GA.themMoc.push(+v); phanTichLai(); TT.toast("Đã thêm mốc hoạt động", "ok"); };
  // từ vựng
  $("dsTu").addEventListener("change", e => { const k = e.target.dataset.tu; if (k == null) return; e.target.checked ? GA.tuChon.add(k) : GA.tuChon.delete(k); veTu(); veXem(); });
  $("bThemTu").onclick = () => { SN.tuTay.push({ vi: "", en: "" }); luu(); veTu(); const ip = $("dsTuTay").querySelectorAll("input"); if (ip.length) ip[ip.length - 2].focus(); };
  $("dsTuTay").addEventListener("input", e => { const h = e.target.closest(".tu-tay"); if (!h) return; SN.tuTay[+h.dataset.n][e.target.dataset.tt] = e.target.value; luu(); $("soTu").textContent = dsTuChon().length; clearTimeout(hen); hen = setTimeout(veXem, 600); });
  $("dsTuTay").addEventListener("click", e => { const b = e.target.closest("[data-xoatu]"); if (!b) return; SN.tuTay.splice(+b.dataset.xoatu, 1); luu(); veTu(); veXem(); });
  // dịch
  $("locDich").addEventListener("click", e => { const b = e.target.closest("button"); if (!b || !GA) return;
    const g = b.dataset.g;
    if (g === "tat") dsDoanDich().forEach(x => GA.chon.add(x.k));
    else if (g === "bo") GA.chon.clear();
    else if (g === "xem") { LOC_DICH = b.dataset.v; document.querySelectorAll("#locDich [data-g=xem]").forEach(x => x.classList.toggle("chon", x === b)); }
    else if (g) dsDoanDich().filter(x => x.nhom.includes(g)).forEach(x => GA.chon.add(x.k));
    veDich(); });
  $("dsDich").addEventListener("change", e => { if (!("chon" in e.target.dataset)) return; const k = e.target.closest(".dd").dataset.k; e.target.checked ? GA.chon.add(k) : GA.chon.delete(k); e.target.closest(".dd").classList.toggle("chon", e.target.checked); $("soChon").textContent = GA.chon.size; });
  $("dsDich").addEventListener("input", e => { if (!("en" in e.target.dataset)) return; const k = e.target.closest(".dd").dataset.k, v = norm(e.target.value); if (v) SN.dich[k] = v; else delete SN.dich[k]; luu(); clearTimeout(hen); hen = setTimeout(() => { veXem(); $("soDich").textContent = dsDoanDich().filter(x => SN.dich[x.k]).length; }, 600); });
  $("bLenhAI").onclick = async () => {
    if (!GA) { TT.toast("Đưa giáo án lên trước ạ", "loi"); return; }
    const ds = dsDoanDich().filter(x => GA.chon.has(x.k));
    if (!ds.length) { TT.toast("Tick chọn ít nhất một đoạn cần dịch", "loi"); TT.buzz(); return; }
    GA.phien = ds.map(x => x.k);
    const s = cauLenhAI(ds);
    $("oLenh").value = s; $("hopLenh").open = true;
    try { await navigator.clipboard.writeText(s); TT.ting(); TT.toast(`Đã chép câu lệnh (${ds.length} đoạn) — dán vào ChatGPT/Gemini`, "ok"); }
    catch (e) { $("oLenh").select(); TT.toast("Bấm Ctrl+C để chép câu lệnh", "ok"); }
  };
  $("bNapDich").onclick = () => {
    if (!GA || !GA.phien.length) { TT.toast("Bấm «Chép câu lệnh cho AI» trước, rồi dán câu trả lời của AI vào đây", "loi"); TT.buzz(); return; }
    const n = napBanDich($("oDan").value);
    if (!n) { TT.toast("Không thấy dòng nào dạng [1] … trong câu trả lời", "loi"); TT.buzz(); return; }
    $("oDan").value = ""; veDich(); veXem(); TT.ting(); TT.toast(`Đã đưa ${n} câu dịch vào giáo án`, "ok");
  };
  $("bXoaDich").onclick = () => { if (!GA) return; const ds = dsDoanDich().filter(x => SN.dich[x.k]); if (!ds.length || !confirm(`Xoá ${ds.length} câu dịch của giáo án này?`)) return; ds.forEach(x => delete SN.dich[x.k]); luu(); veDich(); veXem(); };
  // xem trước, xuất
  $("chiQuanh").onchange = veXem;
  $("bWord").onclick = xuatWord; $("bWord2").onclick = xuatWord;
  // đọc mẫu
  const doiDoc = () => { ["lap", "toc", "giam", "nghi", "vung"].forEach(k => { const v = $("d_" + k).value; SN.doc[k] = ["lap", "toc", "giam"].includes(k) ? +v : v; }); SN.doc.cum = $("d_cum").checked; SN.doc.giong = $("chonGiong").value; luu(); veGiong(); veDoc(); };
  ["d_lap", "d_toc", "d_giam", "d_nghi", "d_vung", "d_cum", "chonGiong"].forEach(id => $(id).onchange = doiDoc);
  $("d_vung").addEventListener("change", () => { SN.doc.giong = ""; luu(); veGiong(); });
  $("locDoc").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; LOC_DOC = b.dataset.loc; veDoc(); });
  $("dsDoc").addEventListener("click", e => {
    const el = e.target.closest(".cau"), b = e.target.closest("button"); if (!el || !b) return;
    const it = MUC_HIEN[+el.dataset.n];
    if ("doc" in b.dataset) docLap(it, el); else if ("cham" in b.dataset) docLap(it, el, "cham"); else if ("thu" in b.dataset) thuDoc(it, el);
  });
  $("bDocHet").onclick = docCaDs; $("bDung").onclick = dungDoc;
  $("bDocTu").onclick = () => { const v = norm($("oTuDo").value); if (!v) return; const el = $("cauTuDo"); el.querySelector(".en").innerHTML = veChu(v); docLap({ en: v }, el); };
  $("bThuTu").onclick = () => { const v = norm($("oTuDo").value); if (!v) return; const el = $("cauTuDo"); el.querySelector(".en").innerHTML = veChu(v); thuDoc({ en: v }, el); };
  if (!SR) $("bThuTu").hidden = true;
  document.addEventListener("click", e => { const b = e.target.closest("[data-nghe]"); if (b) { e.preventDefault(); e.stopPropagation(); nghe(b.dataset.nghe); } }, true);
  if (CO_DOC) { speechSynthesis.onvoiceschanged = veGiong; setTimeout(veGiong, 400); }
  veGiong();
  if (TT.MAU) napMau(); else veHet();
});
async function napMau() {
  const bin = atob(MAU_DOCX), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  SN.mon = "Công nghệ"; SN.lop = "9"; SN.tenEn = "Longan planting and care techniques";
  $("chonMon").value = SN.mon; $("chonLop").value = SN.lop; $("tenEn").value = SN.tenEn;
  SN.dich = {
    [khoaDich("- Trình bày được đặc điểm thực vật học và yêu cầu ngoại cảnh của cây nhãn.")]: "- Describe the botanical characteristics and environmental requirements of the longan tree.",
    [khoaDich("- Trình bày được quy trình trồng và chăm sóc cây nhãn.")]: "- Describe the process of planting and caring for longan trees.",
    [khoaDich("Hoạt động 2.1: Tìm hiểu kĩ thuật trồng cây nhãn")]: "Activity 2.1: Learning about longan planting techniques",
    [khoaDich("Hoạt động 2.2: Tìm hiểu kĩ thuật chăm sóc cây nhãn")]: "Activity 2.2: Learning about longan care techniques",
    [khoaDich("Các bước trồng cây nhãn.")]: "Steps for planting longan trees."
  };
  await napFile(new File([u8], "Giao an mau - Bai 4 cay nhan.docx"));
}
