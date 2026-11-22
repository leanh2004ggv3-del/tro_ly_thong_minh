/* Dựng Word (.docx) từ mô hình khối — Times New Roman 13 toàn bộ. Không thư viện ngoài (JSZip nhúng sẵn).
   Mô hình: phần = [{ngang:bool, khoi:[...]}]
   khối đoạn  : {t:"p", r:[run], jc:"left|center|right|both", truoc, sau, thut, treo, tab:[vị trí twip], giu:true}
   run        : {t:"chữ", b, i, u, va:"superscript|subscript", mau:"RRGGBB", tab:true}
   khối bảng  : {t:"bang", cot:[cm...], hang:[[ô]], dau:số hàng đầu, vien:true|false, rong:cm}
   ô          : {p:[khối đoạn] | t:"chữ", span, vm:"s"|"c", nen:"RRGGBB", jc, b, giua:true}
*/
const DX = (() => {
  const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const x = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const cm = v => Math.round(v * 567);
  /* tách x^2, H_2O, 10^{-3} thành run chỉ số */
  function chu(s, o) {   // công thức $…$ → run công thức (Equation Word); phần chữ thường tách chỉ số
    o = o || {}; const out = [];
    CT.tach(s).forEach(p => { if (p.t === "ct") out.push(Object.assign({}, o, { math: p.src })); else out.push(...chuThuong(p.s, o)); });
    return out;
  }
  function chuThuong(s, o) {
    const out = []; let i = 0, m;
    const re = /([\^_])(\{([^{}]*)\}|[+\-−]?[0-9]+|[A-Za-zα-ωΑ-Ω])/g;
    while ((m = re.exec(s))) {
      if (m.index > i) out.push(Object.assign({}, o, { t: s.slice(i, m.index) }));
      out.push(Object.assign({}, o, { t: (m[3] != null ? m[3] : m[2]).replace(/-/g, "−"), va: m[1] === "^" ? "superscript" : "subscript" }));
      i = re.lastIndex;
    }
    if (i < s.length) out.push(Object.assign({}, o, { t: s.slice(i) }));
    return out.filter(r => r.t);
  }
  const P = (r, o) => Object.assign({ t: "p", r: typeof r === "string" ? chu(r) : r }, o || {});

  /* ---------- XML ---------- */
  let demCT = 0;
  function rXml(r) {
    if (r.math != null) { demCT++; return `<m:oMath>${CT.omml(r.math)}</m:oMath>`; }
    let pr = "";
    if (r.b) pr += "<w:b/><w:bCs/>";
    if (r.i) pr += "<w:i/><w:iCs/>";
    if (r.mau) pr += `<w:color w:val="${r.mau}"/>`;
    if (r.u) pr += '<w:u w:val="single"/>';
    if (r.va) pr += `<w:vertAlign w:val="${r.va}"/>`;
    const nd = r.tab ? "<w:tab/>" : "";
    return `<w:r>${pr ? "<w:rPr>" + pr + "</w:rPr>" : ""}${nd}${r.t ? `<w:t xml:space="preserve">${x(r.t)}</w:t>` : ""}</w:r>`;
  }
  function pXml(p, sect) {
    let pr = "";
    if (p.giu) pr += "<w:keepNext/>";
    if (p.tab && p.tab.length) pr += "<w:tabs>" + p.tab.map(v => `<w:tab w:val="left" w:pos="${v}"/>`).join("") + "</w:tabs>";
    pr += `<w:spacing w:before="${p.truoc || 0}" w:after="${p.sau == null ? 40 : p.sau}" w:line="${p.dong || 264}" w:lineRule="auto"/>`;
    if (p.thut || p.treo) pr += `<w:ind w:left="${p.thut || 0}"${p.treo ? ` w:hanging="${p.treo}"` : ""}/>`;
    pr += `<w:jc w:val="${p.jc || "both"}"/>`;
    if (sect) pr += sect;
    const rs = (p.r || []).filter(r => r.math != null || r.t || r.tab);
    // đoạn chỉ có công thức: Word tự coi là công thức riêng dòng và căn giữa → giữ căn như đoạn chữ
    if (rs.length && rs.every(r => r.math != null)) return `<w:p><w:pPr>${pr}</w:pPr><m:oMathPara><m:oMathParaPr><m:jc m:val="${p.jc === "center" ? "center" : p.jc === "right" ? "right" : "left"}"/></m:oMathParaPr>${rs.map(rXml).join("")}</m:oMathPara></w:p>`;
    return `<w:p><w:pPr>${pr}</w:pPr>${(p.r || []).map(rXml).join("")}</w:p>`;
  }
  const VIEN = c => `<w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(k => `<w:${k} w:val="${c ? "single" : "nil"}" w:sz="4" w:space="0" w:color="000000"/>`).join("")}</w:tblBorders>`;
  function oP(o) {
    if (o.p) return o.p;
    return String(o.t == null ? "" : o.t).split("\n").map(d => P(chu(d, { b: o.b, i: o.i }), { jc: o.jc || "left", sau: 0, dong: 240 }));
  }
  function bangXml(b) {
    const tw = b.cot.map(cm), tong = tw.reduce((a, c) => a + c, 0);
    let s = `<w:tbl><w:tblPr><w:tblW w:w="${tong}" w:type="dxa"/>${b.giua === false ? "" : '<w:jc w:val="center"/>'}${VIEN(b.vien !== false)}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="20" w:type="dxa"/><w:left w:w="${b.le == null ? 70 : b.le}" w:type="dxa"/><w:bottom w:w="20" w:type="dxa"/><w:right w:w="${b.le == null ? 70 : b.le}" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${tw.map(w => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>`;
    b.hang.forEach((h, ih) => {
      s += `<w:tr><w:trPr><w:cantSplit/>${ih < (b.dau || 0) ? "<w:tblHeader/>" : ""}</w:trPr>`;
      let c = 0;
      h.forEach(o => {
        const sp = o.span || 1, w = tw.slice(c, c + sp).reduce((a, v) => a + v, 0); c += sp;
        let pr = `<w:tcW w:w="${w}" w:type="dxa"/>`;
        if (sp > 1) pr += `<w:gridSpan w:val="${sp}"/>`;
        if (o.vm) pr += o.vm === "s" ? '<w:vMerge w:val="restart"/>' : "<w:vMerge/>";
        if (o.nen) pr += `<w:shd w:val="clear" w:color="auto" w:fill="${o.nen}"/>`;
        pr += `<w:vAlign w:val="${o.giua === false ? "top" : "center"}"/>`;
        const ps = o.vm === "c" ? [P([], { sau: 0 })] : oP(o);
        s += `<w:tc><w:tcPr>${pr}</w:tcPr>${ps.map(p => pXml(p)).join("")}</w:tc>`;
      });
      s += "</w:tr>";
    });
    return s + "</w:tbl>";
  }
  function sectXml(ngang, cuoi) {
    const sz = ngang ? '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>' : '<w:pgSz w:w="11906" w:h="16838"/>';
    const mar = ngang ? '<w:pgMar w:top="1134" w:right="851" w:bottom="1021" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>'
      : '<w:pgMar w:top="1134" w:right="851" w:bottom="1134" w:left="1701" w:header="567" w:footer="567" w:gutter="0"/>';
    return `<w:sectPr><w:footerReference w:type="default" r:id="rIdF1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><w:type w:val="nextPage"/>${sz}${mar}<w:cols w:space="720"/></w:sectPr>`;
  }
  function docXml(phan) {
    let body = "";
    phan.forEach((ph, i) => {
      ph.khoi.forEach(k => { body += k.t === "bang" ? bangXml(k) + pXml(P([], { sau: 0 })) : pXml(k); });
      if (i < phan.length - 1) body += pXml(P([], { sau: 0 }), sectXml(ph.ngang));
      else body += sectXml(ph.ngang);
    });
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<w:document xmlns:w="${W}" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}</w:body></w:document>`;
  }
  const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<w:styles xmlns:w="${W}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="40" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
  const FOOTER = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<w:ftr xmlns:w="${W}"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:t xml:space="preserve">Trang </w:t></w:r><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:t>1</w:t></w:r><w:r><w:rPr><w:sz w:val="26"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
  async function taoDocx(phan) {
    const z = new JSZip();
    z.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
    z.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');
    z.file("word/_rels/document.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdS1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdF1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>');
    z.file("docProps/core.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Đề kiểm tra — Tổ trưởng số</dc:title><dc:creator>Tổ trưởng số — Soạn đề CV 7991</dc:creator></cp:coreProperties>');
    z.file("word/styles.xml", STYLES);
    z.file("word/footer1.xml", FOOTER);
    // kiểm trước khi tải: XML đúng cấu trúc, đủ công thức
    let can = 0; const dem = k => { if (k.t === "bang") k.hang.forEach(h => h.forEach(o => { if (o.vm !== "c") oP(o).forEach(dem); })); else (k.r || []).forEach(r => { if (r.math != null) can++; }); };
    phan.forEach(ph => ph.khoi.forEach(dem));
    demCT = 0; const xml = docXml(phan);
    if (demCT !== can) throw new Error(`Số công thức trong file (${demCT}) khác số công thức đã soạn (${can}) — chưa xuất để tránh mất công thức.`);
    if (typeof DOMParser !== "undefined") {
      const d = new DOMParser().parseFromString(xml, "application/xml"), e = d.getElementsByTagName("parsererror")[0];
      if (e) throw new Error("File Word dựng ra bị lỗi cấu trúc (thường do công thức): " + (e.textContent || "").slice(0, 160));
      if (d.getElementsByTagNameNS("http://schemas.openxmlformats.org/officeDocument/2006/math", "oMath").length !== can) throw new Error("Công thức trong file không khớp số đã soạn — chưa xuất.");
    }
    z.file("word/document.xml", xml);
    return z.generateAsync({ type: "blob", compression: "DEFLATE", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  /* ---------- HTML xem trước (cùng mô hình) ---------- */
  const h = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function rHtml(r) {
    if (r.math != null) return CT.html(r.math);
    let s = h(r.t);
    if (r.va) s = `<${r.va === "superscript" ? "sup" : "sub"}>${s}</${r.va === "superscript" ? "sup" : "sub"}>`;
    if (r.b) s = "<b>" + s + "</b>"; if (r.i) s = "<i>" + s + "</i>"; if (r.u) s = "<u>" + s + "</u>";
    if (r.mau) s = `<span style="color:#${r.mau}">${s}</span>`;
    return (r.tab ? '<span class="tb"></span>' : "") + s;
  }
  function pHtml(p) {
    const st = `text-align:${p.jc === "both" || !p.jc ? "justify" : p.jc};margin:${(p.truoc || 0) / 20}pt 0 ${(p.sau == null ? 40 : p.sau) / 20}pt ${((p.thut || 0) - (p.treo || 0)) / 567 * 37.8}px` + (p.treo ? `;padding-left:${p.treo / 567 * 37.8}px;text-indent:-${p.treo / 567 * 37.8}px` : "");
    if (p.tab && p.tab.length) {
      const o = [[]]; (p.r || []).forEach(r => { if (r.tab) o.push([]); if (r.t || r.math != null) o[o.length - 1].push(Object.assign({}, r, { tab: false })); });
      return `<p style="${st}" class="cot c${o.length}">${o.map(g => "<span>" + g.map(rHtml).join("") + "</span>").join("")}</p>`;
    }
    const nd = (p.r || []).map(rHtml).join("");
    return `<p style="${st}">${nd || "&nbsp;"}</p>`;
  }
  function bangHtml(b) {
    const tong = b.cot.reduce((a, c) => a + c, 0);
    let s = `<table class="${b.vien === false ? "kv" : "cv"}" style="width:${Math.min(100, tong / (b.rongTrang || tong) * 100)}%"><colgroup>${b.cot.map(c => `<col style="width:${c / tong * 100}%">`).join("")}</colgroup>`;
    // gộp dọc: đếm rowSpan
    const rs = b.hang.map(hg => hg.map(() => 1));
    b.hang.forEach((hg, i) => {
      let c = 0; hg.forEach((o, j) => {
        if (o.vm === "s") {
          let n = 1;
          for (let k = i + 1; k < b.hang.length; k++) {
            let cc = 0, tim = null; b.hang[k].forEach(q => { if (cc === c) tim = q; cc += q.span || 1; });
            if (tim && tim.vm === "c") n++; else break;
          }
          rs[i][j] = n;
        }
        c += o.span || 1;
      });
    });
    b.hang.forEach((hg, i) => {
      s += "<tr>";
      hg.forEach((o, j) => {
        if (o.vm === "c") return;
        s += `<td${o.span > 1 ? ` colspan="${o.span}"` : ""}${rs[i][j] > 1 ? ` rowspan="${rs[i][j]}"` : ""} style="${o.nen ? "background:#" + o.nen + ";" : ""}vertical-align:${o.giua === false ? "top" : "middle"}">${oP(o).map(pHtml).join("")}</td>`;
      });
      s += "</tr>";
    });
    return s + "</table>";
  }
  function xemHtml(ph) {
    return `<div class="trang${ph.ngang ? " ngang" : ""}">` + ph.khoi.map(k => k.t === "bang" ? bangHtml(k) : pHtml(k)).join("") + "</div>";
  }
  return { chu, P, taoDocx, xemHtml, docXml, cm };
})();
