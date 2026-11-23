/* Đọc tài liệu nguồn (giáo án, SGK) kèm ẢNH: Word → chữ + ảnh đúng vị trí dòng; PDF → chữ theo trang,
   ảnh nhúng trong trang, và ảnh trang để thầy cô tự khoanh vùng cắt hình. Mọi thứ chạy trong trình duyệt. */
const DN = (() => {
  const WNS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const MNS = "http://schemas.openxmlformats.org/officeDocument/2006/math";
  const RNS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const gon = DF.gon;

  /* ảnh bất kì (bytes) → PNG/JPEG dùng được trong PowerPoint + kích thước */
  async function chuanAnh(data, mime) {
    const blob = new Blob([data], { type: mime });
    let bm;
    try { bm = await createImageBitmap(blob); } catch (e) { return null; }
    const w = bm.width, h = bm.height;
    if (/png|jpe?g/.test(mime)) { const url = await new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(blob); }); return { data: new Uint8Array(data), ext: /png/.test(mime) ? "png" : "jpeg", w, h, url }; }
    const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(bm, 0, 0);
    const b = await new Promise(ok => c.toBlob(ok, "image/png"));
    return { data: new Uint8Array(await b.arrayBuffer()), ext: "png", w, h, url: c.toDataURL("image/png") };
  }
  const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", bmp: "image/bmp", webp: "image/webp", tif: "image/tiff", tiff: "image/tiff" };

  /* ---------- Word ---------- */
  async function docWord(buf, tenFile) {
    const z = await JSZip.loadAsync(buf);
    const f = z.file("word/document.xml");
    if (!f) throw new Error("File này không phải Word .docx (file .doc cũ: mở bằng Word → Lưu thành .docx).");
    const doc = new DOMParser().parseFromString(await f.async("string"), "application/xml");
    const relF = z.file("word/_rels/document.xml.rels"), rel = {};
    if (relF) { const r = new DOMParser().parseFromString(await relF.async("string"), "application/xml"); for (const e of r.getElementsByTagName("Relationship")) rel[e.getAttribute("Id")] = e.getAttribute("Target"); }
    const dong = [], moc = []; let nCT = 0, nOle = 0;
    const di = (e, anh) => {
      if (e.nodeType !== 1) return "";
      if (e.namespaceURI === MNS && e.localName === "oMath") { nCT++; return " $" + DF.tex(e).replace(/\s+/g, " ").trim() + "$ "; }
      if (e.localName === "blip") { const id = e.getAttributeNS(RNS, "embed") || e.getAttribute("r:embed"); if (id) anh.push(id); return ""; }
      if (e.localName === "imagedata") { const id = e.getAttributeNS(RNS, "id") || e.getAttribute("r:id"); if (id) anh.push(id); return ""; }
      if (e.localName === "object") nOle++;
      if (e.namespaceURI === WNS && e.localName === "r") {
        const va = e.getElementsByTagNameNS(WNS, "vertAlign")[0], v = va && va.getAttribute("w:val");
        let t = "";
        for (const c of e.childNodes) if (c.nodeType === 1) {
          if (c.namespaceURI === WNS && c.localName === "t") t += c.textContent;
          else if (c.namespaceURI === WNS && (c.localName === "tab" || c.localName === "br")) t += " ";
          else di(c, anh);
        }
        if (t && v === "superscript") t = "^{" + t + "}"; else if (t && v === "subscript") t = "_{" + t + "}";
        return t;
      }
      if (e.localName === "Fallback") return "";
      let s = ""; for (const c of e.childNodes) s += di(c, anh); return s;
    };
    for (const p of doc.getElementsByTagNameNS(WNS, "p")) {
      let bo = false; for (let a = p.parentNode; a; a = a.parentNode) if (a.localName === "Fallback" || (a.localName === "p" && a !== p)) { bo = true; break; }
      if (bo) continue;
      const anh = [], s = gon(di(p, anh));
      if (s) dong.push(s);
      anh.forEach(id => moc.push({ id, dong: Math.max(0, dong.length - 1) }));
    }
    // lấy bytes ảnh (bỏ EMF/WMF của MathType, ảnh quá nhỏ)
    const ds = [], daCo = {}; let boQua = 0;
    for (const m of moc) {
      const t = rel[m.id]; if (!t) continue;
      const duong = "word/" + t.replace(/^\.?\//, "").replace(/^\/word\//, "");
      if (daCo[duong]) continue;
      const ext = (duong.split(".").pop() || "").toLowerCase();
      if (!MIME[ext]) { boQua++; continue; }
      const zf = z.file(duong); if (!zf) continue;
      const a = await chuanAnh(await zf.async("uint8array"), MIME[ext]);
      if (!a || a.w < 60 || a.h < 60) continue;
      daCo[duong] = 1;
      ds.push(Object.assign(a, { dong: m.dong, ten: (tenFile || "Word") + " – ảnh " + (ds.length + 1), nguon: "file" }));
    }
    return { dong, anh: ds, thongTin: { nCT, nOle, boQua }, kieu: "Word" };
  }

  /* ---------- PDF ---------- */
  const pdfMo = {};   // tên file → pdf.js document (để vẽ trang, cắt hình)
  async function docPdf(buf, tenFile) {
    const r = await DF.docPdf(buf.slice(0));
    const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    pdfMo[tenFile] = pdf;
    const anh = [];
    // ảnh nhúng trong trang (hình vẽ, ảnh chụp của SGK)
    for (let n = 1; n <= pdf.numPages && anh.length < 80; n++) {
      try {
        const pg = await pdf.getPage(n), ops = await pg.getOperatorList();
        const dongDau = r.trangDong.indexOf(n);
        for (let i = 0; i < ops.fnArray.length; i++) {
          if (ops.fnArray[i] !== pdfjsLib.OPS.paintImageXObject) continue;
          const ten = ops.argsArray[i][0];
          const o = await new Promise(ok => { try { (ten.startsWith("g_") ? pg.commonObjs : pg.objs).get(ten, ok); } catch (e) { ok(null); } setTimeout(() => ok(null), 3000); });
          if (!o || o.width < 120 || o.height < 90) continue;
          const c = document.createElement("canvas"); c.width = o.width; c.height = o.height; const g = c.getContext("2d");
          if (o.bitmap) g.drawImage(o.bitmap, 0, 0);
          else if (o.data) {
            const id = g.createImageData(o.width, o.height), d = id.data, s = o.data, nPx = o.width * o.height;
            if (s.length === nPx * 4) d.set(s);
            else if (s.length === nPx * 3) for (let k = 0, j = 0; k < nPx; k++) { d[j++] = s[k * 3]; d[j++] = s[k * 3 + 1]; d[j++] = s[k * 3 + 2]; d[j++] = 255; }
            else continue;
            g.putImageData(id, 0, 0);
          } else continue;
          const b = await new Promise(ok => c.toBlob(ok, "image/jpeg", 0.9));
          anh.push({ data: new Uint8Array(await b.arrayBuffer()), ext: "jpeg", w: o.width, h: o.height, url: c.toDataURL("image/jpeg", 0.9), dong: Math.max(0, dongDau), trang: n, ten: `${tenFile} – trang ${n}`, nguon: "file" });
        }
      } catch (e) { /* trang lỗi: bỏ qua, vẫn cắt tay được */ }
    }
    return { dong: r.dong, trangDong: r.trangDong, anh, soTrang: pdf.numPages, kieu: "PDF " + pdf.numPages + " trang", tenPdf: tenFile };
  }
  /* vẽ một trang PDF ra canvas (để xem nhỏ hoặc cắt hình) */
  async function veTrang(tenPdf, n, rongPx) {
    const pdf = pdfMo[tenPdf]; if (!pdf) throw new Error("PDF đã đóng — thầy cô nạp lại file giúp ạ.");
    const pg = await pdf.getPage(n), vp0 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: rongPx / vp0.width });
    const c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    return c;
  }
  const coPdf = ten => !!pdfMo[ten];
  const soTrang = ten => pdfMo[ten] ? pdfMo[ten].numPages : 0;

  /* ---------- một file bất kì ---------- */
  async function doc(file) {
    const ten = file.name.replace(/\.[^.]+$/, ""), buf = await file.arrayBuffer();
    if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") {
      if (!window.pdfjsLib) await DF.docPdf(new Uint8Array(0)).catch(() => {});   // nạp bộ đọc PDF
      return docPdf(buf, ten);
    }
    if (/\.docx$/i.test(file.name)) return docWord(buf, ten);
    if (/\.(txt|md)$/i.test(file.name)) return { dong: new TextDecoder().decode(buf).split(/\r?\n/).map(gon).filter(Boolean), anh: [], kieu: "chữ" };
    if (/^image\//.test(file.type)) { const a = await chuanAnh(buf, file.type); if (!a) throw new Error("Không đọc được ảnh " + file.name); a.ten = ten; a.nguon = "tai"; return { dong: [], anh: [a], kieu: "ảnh" }; }
    if (/\.(pptx?|doc)$/i.test(file.name)) throw new Error("File " + file.name.split(".").pop().toUpperCase() + " chưa đọc được — thầy cô lưu thành Word .docx hoặc PDF giúp ạ.");
    throw new Error("App nhận Word (.docx), PDF, ảnh (PNG, JPG) hoặc file chữ.");
  }
  return { doc, veTrang, coPdf, soTrang, chuanAnh };
})();
