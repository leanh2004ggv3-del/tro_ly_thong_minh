/* Đọc chữ từ Word (.docx) / PDF ngay trong trình duyệt + nhận ra bài, chủ đề, yêu cầu cần đạt. */
const DF = (() => {
  const WNS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const MNS = "http://schemas.openxmlformats.org/officeDocument/2006/math";
  const gon = s => String(s || "").normalize("NFC").replace(/[\s ]+/g, " ").trim();

  async function docDocx(buf) {
    const z = await JSZip.loadAsync(buf);
    const f = z.file("word/document.xml");
    if (!f) throw new Error("File này không phải Word .docx (có thể là .doc cũ — thầy cô mở bằng Word, Lưu thành .docx giúp ạ).");
    const doc = new DOMParser().parseFromString(await f.async("string"), "application/xml");
    const dong = []; let nCT = 0;
    // chữ của một nút trong đoạn: run thường (giữ chỉ số trên/dưới), công thức Equation → $LaTeX$
    const di = e => {
      if (e.nodeType !== 1) return "";
      if (e.namespaceURI === MNS && e.localName === "oMath") { nCT++; return " $" + tex(e).replace(/\s+/g, " ").trim() + "$ "; }
      if (e.namespaceURI === WNS && e.localName === "r") {
        const va = e.getElementsByTagNameNS(WNS, "vertAlign")[0], v = va && va.getAttribute("w:val");
        let t = ""; for (const c of e.childNodes) if (c.nodeType === 1 && c.namespaceURI === WNS) { if (c.localName === "t") t += c.textContent; else if (c.localName === "tab" || c.localName === "br") t += " "; }
        if (t && v === "superscript") t = "^{" + t + "}"; else if (t && v === "subscript") t = "_{" + t + "}";
        return t;
      }
      if (e.localName === "txbxContent" || e.localName === "Fallback") return "";
      let s = ""; for (const c of e.childNodes) s += di(c); return s;
    };
    for (const p of doc.getElementsByTagNameNS(WNS, "p")) {
      let bo = false; for (let a = p.parentNode; a; a = a.parentNode) if (a.localName === "txbxContent" || a.localName === "Fallback") { bo = true; break; }
      if (bo) continue;
      const s = gon(di(p)); if (s) dong.push(s);
    }
    // công thức MathType / ảnh: app không đọc được chữ bên trong
    const nOle = doc.getElementsByTagNameNS(WNS, "object").length;
    dong.thongTin = { nCT, nOle };
    return dong;
  }
  /* công thức Word (OMML) → LaTeX gọn để gửi AI */
  const CHR = { "∑": "\\sum", "∏": "\\prod", "∫": "\\int", "∬": "\\iint", "∮": "\\oint" };
  function tex(e) {
    const con = (el, ten) => el && [...el.childNodes].find(c => c.nodeType === 1 && c.localName === ten);
    const gt = (el, ten) => { const p = con(el, ten); return p ? p.getAttributeNS(MNS, "val") || p.getAttribute("m:val") || "" : null; };
    const pr = (el, ten) => con(el, ten);
    const di = el => {
      if (!el || el.nodeType !== 1) return "";
      const k = el.localName;
      if (/Pr$/.test(k) && el.namespaceURI === MNS) return "";
      if (k === "t") return el.textContent;
      if (el.namespaceURI === WNS && k !== "r") return "";
      const e = n => di(con(el, n));
      switch (k) {
        case "f": return `\\frac{${e("num")}}{${e("den")}}`;
        case "sSup": return `{${e("e")}}^{${e("sup")}}`;
        case "sSub": return `{${e("e")}}_{${e("sub")}}`;
        case "sSubSup": return `{${e("e")}}_{${e("sub")}}^{${e("sup")}}`;
        case "sPre": return `{}_{${e("sub")}}^{${e("sup")}}{${e("e")}}`;
        case "rad": { const d = e("deg"); return d.trim() ? `\\sqrt[${d}]{${e("e")}}` : `\\sqrt{${e("e")}}`; }
        case "d": {
          const p = pr(el, "dPr"), b = p && gt(p, "begChr"), c = p && gt(p, "endChr");
          const cac = [...el.childNodes].filter(x => x.nodeType === 1 && x.localName === "e").map(di);
          if (b === "{" && (c === "" || c === null && false) && cac.length === 1 && con(con(el, "e"), "eqArr")) return `\\begin{cases}${di(con(con(el, "e"), "eqArr")).replace(/^\\begin\{array\}\{l\}|\\end\{array\}$/g, "")}\\end{cases}`;
          const L = b == null ? "(" : b, R = c == null ? ")" : c;
          return `\\left${L === "" ? "." : L === "{" ? "\\{" : L}${cac.join(",")}\\right${R === "" ? "." : R === "}" ? "\\}" : R}`;
        }
        case "eqArr": return "\\begin{array}{l}" + [...el.childNodes].filter(x => x.nodeType === 1 && x.localName === "e").map(di).join(" \\\\ ") + "\\end{array}";
        case "nary": { const p = pr(el, "naryPr"), c = (p && gt(p, "chr")) || "∫"; const sb = e("sub"), sp = e("sup"); return `${CHR[c] || c}${sb ? "_{" + sb + "}" : ""}${sp ? "^{" + sp + "}" : ""} ${e("e")}`; }
        case "acc": { const p = pr(el, "accPr"), c = (p && gt(p, "chr")) || "̂"; return c === "⃗" || c === "→" ? `\\vec{${e("e")}}` : c === "̅" || c === "¯" ? `\\overline{${e("e")}}` : `\\widehat{${e("e")}}`; }
        case "bar": return `\\overline{${e("e")}}`;
        case "limLow": return `{${e("e")}}_{${e("lim")}}`;
        case "limUpp": { const b = e("e"); return /[→⟶⇌]/.test(b) ? `\\xrightarrow{${e("lim")}}` : `{${b}}^{${e("lim")}}`; }
        case "func": return `${e("fName")} ${e("e")}`;
        case "groupChr": case "box": case "borderBox": case "phant": return e("e");
        default: return [...el.childNodes].map(di).join("");
      }
    };
    return di(e);
  }
  function napThuVien(url) { return new Promise((ok, loi) => { const s = document.createElement("script"); s.src = url; s.onload = ok; s.onerror = () => loi(new Error("Không tải được bộ đọc PDF (cần có mạng). Thầy cô dùng file Word giúp ạ.")); document.head.appendChild(s); }); }
  async function docPdf(buf) {
    if (!window.pdfjsLib) {
      await napThuVien("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise, dong = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const pg = await pdf.getPage(n), tc = await pg.getTextContent();
      const it = tc.items.filter(v => v.str && v.str.trim()).map(v => ({ s: v.str, x: v.transform[4], y: v.transform[5], h: Math.abs(v.transform[3]) || 10, w: v.width }));
      it.sort((p, q) => q.y - p.y);
      const cum = [];
      it.forEach(v => { const c = cum[cum.length - 1]; if (c && Math.abs(c.y - v.y) <= Math.max(c.h, v.h) * .6) { c.ds.push(v); c.h = Math.max(c.h, v.h); } else cum.push({ y: v.y, h: v.h, ds: [v] }); });
      cum.forEach(c => {
        c.ds.sort((p, q) => p.x - q.x); let s = "", x2 = null;
        c.ds.forEach(v => { if (x2 != null && v.x - x2 > c.h * .15 && !/\s$/.test(s) && !/^\s/.test(v.s)) s += " "; s += v.s; x2 = v.x + v.w; });
        s = gon(s); if (s) dong.push(s);
      });
    }
    if (!dong.length) throw new Error("File PDF này là bản quét (ảnh), app chưa đọc được chữ. Thầy cô dùng file Word, hoặc dán chữ vào ô bên dưới ạ.");
    return { dong, trang: pdf.numPages };
  }

  /* ---- nhận ra bài / chủ đề ---- */
  const RE_BAI = /^(BÀI|Bài|CHỦ ĐỀ|Chủ đề|CHƯƠNG|Chương|CHUYÊN ĐỀ|Chuyên đề|PHẦN|Phần)\s+([0-9]+|[IVXLC]+)\b\s*[.:\-–]?\s*(.*)$/;
  const RE_MT = /^(I\s*[.\-–:)]\s*)?(MỤC TIÊU|Mục tiêu|YÊU CẦU CẦN ĐẠT|Yêu cầu cần đạt)\b/;
  const RE_HET_MT = /^(II|III)\s*[.\-–:)]|^(THIẾT BỊ|Thiết bị|CHUẨN BỊ|TIẾN TRÌNH|Tiến trình)|^\d\s*[.)]\s*(Về\s+)?(Năng lực|NĂNG LỰC|Phẩm chất|PHẨM CHẤT)\s*(chung|CHUNG)|^(\d\s*[.)]\s*)?(Phẩm chất|PHẨM CHẤT)\b/;
  const DT = {
    B: /^(nêu|kể|kể tên|nhận biết|nhận ra|nhận diện|liệt kê|trình bày|mô tả|xác định|phát biểu|chỉ ra|gọi tên|viết được|nhắc lại|nhớ|biết|đọc được|nhận dạng)\b/i,
    H: /^(giải thích|phân biệt|so sánh|phân tích|hiểu|lấy được ví dụ|lấy ví dụ|tóm tắt|phân loại|chứng minh|nhận xét|minh hoạ|minh họa|diễn giải|suy luận|rút ra|mô hình hoá|mô hình hóa)\b/i,
    V: /^(vận dụng|tính|thực hiện|đề xuất|lựa chọn|chọn được|giải quyết|giải được|thiết kế|lập|xây dựng|đánh giá|sử dụng|làm được|thực hành|vẽ|chế tạo|tạo|viết chương trình|lắp|đo|tiến hành|ước lượng|áp dụng)\b/i
  };
  function loaiYc(s) {
    const t = s.replace(/^[-+•●▪*–\s]+/, "").replace(/^(HS|Học sinh)\s+/i, "");
    for (const m of ["V", "H", "B"]) if (DT[m].test(t)) return m;
    return "";
  }
  function tach(dong, tenFile) {
    const cd = []; let cu = null, chuong = "", trongMt = false;
    const moi = ten => { cu = { ten, chuong, dong: [], yc: { B: [], H: [], V: [] } }; cd.push(cu); trongMt = false; };
    dong.forEach(d => {
      const m = d.length < 140 && d.match(RE_BAI);
      if (m) {
        const loai = m[1].toLowerCase();
        if (/chương|phần|chuyên đề/.test(loai) && !/^bài/.test(loai)) { chuong = gon(d); if (cu && !cu.dong.length) cu.chuong = chuong; return; }
        // tên bài lặp ở nhiều trang (đầu trang) → bỏ qua
        if (cu && gon(cu.ten).toLowerCase() === gon(d).toLowerCase()) return;
        moi(gon(d)); return;
      }
      if (!cu) moi(tenFile || "Nội dung đã nạp");
      cu.dong.push(d);
      if (RE_MT.test(d)) { trongMt = true; return; }
      if (trongMt && RE_HET_MT.test(d)) trongMt = false;
      if (trongMt) {
        const l = loaiYc(d);
        if (l && d.length > 12 && d.length < 400) cu.yc[l].push("- " + d.replace(/^[-+•●▪*–\s]+/, "").replace(/;\s*$/, "").replace(/\.$/, "") + ".");
      }
    });
    // phần đầu file trước tên bài (tên trường, tuần, tiết…) ngắn → bỏ, không thành một «bài»
    if (cd.length > 1 && cd[0].ten === (tenFile || "Nội dung đã nạp") && cd[0].dong.join(" ").length < 400) cd.shift();
    return cd.filter(c => c.dong.length).map(c => ({
      ten: c.ten, chuong: c.chuong, text: c.dong.join("\n"),
      yc: { B: [...new Set(c.yc.B)].join("\n"), H: [...new Set(c.yc.H)].join("\n"), V: [...new Set(c.yc.V)].join("\n") }
    }));
  }
  async function doc(file) {
    const ten = file.name.replace(/\.[^.]+$/, ""), buf = await file.arrayBuffer();
    if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") { const r = await docPdf(buf); return { cd: tach(r.dong, ten), dong: r.dong.length, kieu: "PDF " + r.trang + " trang" }; }
    if (/\.docx$/i.test(file.name)) { const d = await docDocx(buf); return { cd: tach(d, ten), dong: d.length, kieu: "Word", ct: d.thongTin }; }
    if (/\.(txt|md)$/i.test(file.name)) { const d = new TextDecoder().decode(buf).split(/\r?\n/).map(gon).filter(Boolean); return { cd: tach(d, ten), dong: d.length, kieu: "chữ" }; }
    throw new Error("App nhận file Word (.docx) hoặc PDF. File .doc cũ: mở bằng Word → Lưu thành .docx.");
  }
  return { doc, tach, loaiYc, gon };
})();
