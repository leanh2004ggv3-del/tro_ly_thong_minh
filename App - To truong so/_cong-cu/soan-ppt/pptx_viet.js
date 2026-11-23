/* Ghi file PowerPoint (.pptx) ngay trong trình duyệt — không cần thư viện ngoài, chỉ cần JSZip.
   Công thức $…$ (LaTeX) → Equation thật của PowerPoint (OMML trong a14:m), kèm bản dự phòng chữ thường
   cho phần mềm không hiểu Equation (Google Slides, LibreOffice).
   Đầu vào là các slide ĐÃ DÀN TRANG (toạ độ EMU) do bo_cuc.js tính. */
const PX = (() => {
  const W = 12192000, H = 6858000;              // 16:9 — 13,333 × 7,5 inch
  const FONT = "Times New Roman";
  const NS_A = "http://schemas.openxmlformats.org/drawingml/2006/main";
  const NS_P = "http://schemas.openxmlformats.org/presentationml/2006/main";
  const NS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const NS_M = "http://schemas.openxmlformats.org/officeDocument/2006/math";
  const NS_MC = "http://schemas.openxmlformats.org/markup-compatibility/2006";
  const NS_A14 = "http://schemas.microsoft.com/office/drawing/2010/main";
  const xe = s => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const R = n => Math.round(n);
  const mauHex = m => String(m || "000000").replace(/^#/, "").toUpperCase();
  const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

  /* ---------- chữ thường + chỉ số ^{} _{} ngoài công thức ---------- */
  function rPr(o, them) {
    return `<a:rPr lang="vi-VN" sz="${R(o.sz * 100)}" b="${o.b ? 1 : 0}" i="${o.i ? 1 : 0}"${o.u ? ' u="sng"' : ""}${them || ""} dirty="0"><a:solidFill><a:srgbClr val="${mauHex(o.mau)}"/></a:solidFill><a:latin typeface="${FONT}"/><a:ea typeface="${FONT}"/><a:cs typeface="${FONT}"/></a:rPr>`;
  }
  function runChu(s, o) {
    let out = "", i = 0;
    const re = /([\^_])(\{([^{}]*)\}|[+\-−]?[0-9]+)/g; let m;
    const r = (t, bl) => { if (t) out += `<a:r>${rPr(o, bl ? ` baseline="${bl}"` : "")}<a:t>${xe(t)}</a:t></a:r>`; };
    while ((m = re.exec(s))) { r(s.slice(i, m.index)); r(m[3] != null ? m[3] : m[2], m[1] === "^" ? "30000" : "-25000"); i = re.lastIndex; }
    r(s.slice(i));
    return out;
  }
  /* ---------- công thức: OMML của CT (viết cho Word) → OMML cho PowerPoint ---------- */
  function ommlPpt(src, o) {
    const a = `<a:rPr lang="vi-VN" sz="${R(o.sz * 100)}" b="${o.b ? 1 : 0}" dirty="0"><a:solidFill><a:srgbClr val="${mauHex(o.mau)}"/></a:solidFill><a:latin typeface="Cambria Math"/><a:cs typeface="Cambria Math"/></a:rPr>`;
    return CT.omml(src).replace(/<w:rPr>[\s\S]*?<\/w:rPr>/g, a);
  }
  /* Công thức đơn giản (chỉ chữ, số, dấu, mũ, chỉ số một tầng) → viết bằng chữ Times New Roman: biến nghiêng,
     số đứng, mũ/chỉ số nâng hạ. Có phân số, căn, hệ, mũi tên có chữ… → null (dùng Equation). */
  function congThucDon(src) {
    const h = CT.html(src);
    if (/class="ct-|style=/.test(h.replace(/^<span class="ct">/, ""))) return null;
    const ra = []; let i = 0, bl = 0, sau = 0, nghieng = 0;
    const re = /<(\/?)(i|sup|sub|span)[^>]*>|&nbsp;|&amp;|&lt;|&gt;|&quot;|[^<&]+/g; let m;
    while ((m = re.exec(h))) {
      const t = m[0];
      if (m[2]) {
        const dong = m[1] === "/";
        if (m[2] === "i") nghieng += dong ? -1 : 1;
        else if (m[2] === "sup" || m[2] === "sub") { if (dong) { sau--; bl = 0; } else { if (sau) return null; sau++; bl = m[2] === "sup" ? 1 : -1; } }
        continue;
      }
      const s = { "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"' }[t] || t;
      const cu = ra[ra.length - 1];
      if (cu && cu.i === !!nghieng && cu.bl === bl) cu.s += s; else ra.push({ s, i: !!nghieng, bl });
      i++;
    }
    // dấu = + − < > giữa các vế: thêm khoảng trắng cho dễ đọc như Equation
    ra.forEach(x => { x.s = x.s.replace(/-/g, "−"); if (!x.bl && !x.i) x.s = x.s.replace(/\s*([=<>≤≥≠≈+−±→⇒⇔⇌])\s*/g, " $1 ").replace(/\s+/g, " "); });
    if (ra.length && !ra[0].bl && !ra[0].i) ra[0].s = ra[0].s.replace(/^\s*([−+±])\s*/, "$1").replace(/^\s+/, "");
    // dấu trừ ngay sau "(" hoặc "=": dấu âm, bỏ khoảng sau
    ra.forEach(x => { if (!x.bl && !x.i) x.s = x.s.replace(/([(\[]) ?([−+]) /g, "$1$2"); });
    const cuoi = ra[ra.length - 1]; if (cuoi && !cuoi.bl && !cuoi.i) cuoi.s = cuoi.s.replace(/\s+$/, "");
    // giữ công thức liền một khối, không ngắt dòng giữa chừng
    ra.forEach(x => { x.s = x.s.replace(/ /g, " "); });
    return ra.filter(x => x.s);
  }
  /* một đoạn: [{s, sz, b, i, mau, cap:0|1|2 (đầu dòng), canh, kc (giãn sau, pt)}] */
  function doan(d, coCT) {
    const o = { sz: d.sz || 28, b: d.b, i: d.i, mau: d.mau || "1F2937" };
    const canh = d.canh || "l";
    let pPr = `<a:pPr algn="${canh}"`;
    const bu = d.cap === 1 ? "•" : d.cap === 2 ? "–" : d.cap === 3 ? "✓" : "";
    const lui = d.cap === 2 ? 2 : 1;
    if (bu) pPr += ` marL="${R(lui * 342900)}" indent="-${R(342900 * 0.9)}"`;
    pPr += `><a:lnSpc><a:spcPct val="${d.dong || 100}000"/></a:lnSpc><a:spcBef><a:spcPts val="${R((d.kcTruoc || 0) * 100)}"/></a:spcBef><a:spcAft><a:spcPts val="${R((d.kc == null ? 6 : d.kc) * 100)}"/></a:spcAft>`;
    pPr += bu ? `<a:buClr><a:srgbClr val="${mauHex(d.mauDau || d.mau || "1F2937")}"/></a:buClr><a:buSzPct val="100000"/><a:buFont typeface="${FONT}"/><a:buChar char="${bu}"/>` : "<a:buNone/>";
    pPr += "</a:pPr>";
    let r = "";
    String(d.s || "").split("**").forEach((manh, k) => {
      const oo = k % 2 ? Object.assign({}, o, { b: true, mau: d.mauDam || o.mau }) : o;
      CT.tach(manh).forEach(p => {
        if (p.t === "ct") {
          const don = congThucDon(p.src);
          if (don) r += don.map(x => `<a:r>${rPr(Object.assign({}, oo, { i: x.i }), x.bl ? ` baseline="${x.bl > 0 ? 30000 : -25000}"` : "")}<a:t>${xe(x.s)}</a:t></a:r>`).join("");
          else if (coCT) r += `<a14:m><m:oMath xmlns:m="${NS_M}">${ommlPpt(p.src, oo)}</m:oMath></a14:m>`;
          else r += runChu(CT.thuan("$" + p.src + "$"), oo);
        } else r += runChu(p.s, oo);
      });
    });
    return `<a:p>${pPr}${r}<a:endParaRPr lang="vi-VN" sz="${R(o.sz * 100)}" dirty="0"><a:latin typeface="${FONT}"/></a:endParaRPr></a:p>`;
  }

  /* ---------- các khối ---------- */
  function spPr(k, hinh) {
    const fill = k.nen ? (k.nen2 ? `<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="${mauHex(k.nen)}"${k.trong ? `><a:alpha val="${R((1 - k.trong) * 100000)}"/></a:srgbClr>` : "/>"}</a:gs><a:gs pos="100000"><a:srgbClr val="${mauHex(k.nen2)}"/></a:gs></a:gsLst><a:lin ang="${R((k.goc || 0) * 60000)}" scaled="0"/></a:gradFill>` : `<a:solidFill><a:srgbClr val="${mauHex(k.nen)}"${k.trong ? `><a:alpha val="${R((1 - k.trong) * 100000)}"/></a:srgbClr>` : "/>"}</a:solidFill>`) : "<a:noFill/>";
    const ln = k.vien ? `<a:ln w="${R((k.vienDay || 1.5) * 12700)}"><a:solidFill><a:srgbClr val="${mauHex(k.vien)}"/></a:solidFill></a:ln>` : "<a:ln><a:noFill/></a:ln>";
    const adj = k.bo != null && (hinh === "roundRect") ? `<a:avLst><a:gd name="adj" fmla="val ${R(k.bo)}"/></a:avLst>` : "<a:avLst/>";
    const bong = k.bong ? `<a:effectLst><a:outerShdw blurRad="152400" dist="38100" dir="5400000" algn="t" rotWithShape="0"><a:srgbClr val="0F172A"><a:alpha val="22000"/></a:srgbClr></a:outerShdw></a:effectLst>` : "";
    return `<p:spPr><a:xfrm${k.xoay ? ` rot="${R(k.xoay * 60000)}"` : ""}><a:off x="${R(k.x)}" y="${R(k.y)}"/><a:ext cx="${R(k.w)}" cy="${R(k.h)}"/></a:xfrm><a:prstGeom prst="${hinh || "rect"}">${adj}</a:prstGeom>${fill}${ln}${bong}</p:spPr>`;
  }
  function sp(id, k, coCT) {
    const doanXml = (k.doan || []).map(d => doan(d, coCT)).join("") || `<a:p><a:endParaRPr lang="vi-VN" sz="2400"/></a:p>`;
    const le = k.le == null ? 91440 : k.le;
    const body = `<a:bodyPr wrap="square" lIns="${le}" tIns="${k.leTren == null ? 45720 : k.leTren}" rIns="${le}" bIns="${k.leTren == null ? 45720 : k.leTren}" anchor="${k.neo || "t"}" rtlCol="0"><a:noAutofit/></a:bodyPr><a:lstStyle/>`;
    return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${xe(k.ten || (k.doan ? "Chữ " : "Hình ") + id)}"/><p:cNvSpPr${k.doan ? ' txBox="1"' : ""}/><p:nvPr/></p:nvSpPr>${spPr(k, k.hinh || "rect")}<p:txBody>${body}${doanXml}</p:txBody></p:sp>`;
  }
  function pic(id, k, rid) {
    const crop = k.cat ? `<a:srcRect l="${R(k.cat.l * 1000)}" t="${R(k.cat.t * 1000)}" r="${R(k.cat.r * 1000)}" b="${R(k.cat.b * 1000)}"/>` : "";
    return `<p:pic><p:nvPicPr><p:cNvPr id="${id}" name="Ảnh ${id}" descr="${xe(k.moTa || "")}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${rid}"/>${crop}<a:stretch><a:fillRect/></a:stretch></p:blipFill>${spPr(k, k.hinh || "rect")}</p:pic>`;
  }
  const coCongThuc = k => (k.doan || []).some(d => CT.coCT(d.s));

  function slideXml(sl, rids) {
    let id = 2, cay = "";
    sl.khoi.forEach(k => {
      if (k.loai === "anh") { cay += pic(id++, k, rids[k.anh]); return; }
      if (coCongThuc(k)) {
        const i = id++;
        cay += `<mc:AlternateContent xmlns:mc="${NS_MC}"><mc:Choice xmlns:a14="${NS_A14}" Requires="a14">${sp(i, k, true)}</mc:Choice><mc:Fallback>${sp(i, k, false)}</mc:Fallback></mc:AlternateContent>`;
      } else cay += sp(id++, k, false);
    });
    const nen = sl.nen ? `<p:bg><p:bgPr>${sl.nen2 ? `<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="${mauHex(sl.nen)}"/></a:gs><a:gs pos="100000"><a:srgbClr val="${mauHex(sl.nen2)}"/></a:gs></a:gsLst><a:lin ang="${R((sl.goc == null ? 90 : sl.goc) * 60000)}" scaled="0"/></a:gradFill>` : `<a:solidFill><a:srgbClr val="${mauHex(sl.nen)}"/></a:solidFill>`}<a:effectLst/></p:bgPr></p:bg>` : "";
    const hieuUng = sl.hieuUng === false ? "" : `<mc:AlternateContent xmlns:mc="${NS_MC}"><mc:Choice xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" Requires="p14"><p:transition spd="med" p14:dur="700"><p:fade/></p:transition></mc:Choice><mc:Fallback><p:transition spd="med"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`;
    return XML + `<p:sld xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}"><p:cSld>${nen}<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${cay}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>${hieuUng}</p:sld>`;
  }
  function notesXml(chu) {
    const ds = String(chu || "").split(/\n/).map(s => `<a:p><a:r><a:rPr lang="vi-VN" sz="1400" dirty="0"><a:latin typeface="${FONT}"/><a:cs typeface="${FONT}"/></a:rPr><a:t>${xe(CT.thuan(s))}</a:t></a:r></a:p>`).join("");
    return XML + `<p:notes xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Ảnh slide"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Ghi chú"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/>${ds || "<a:p/>"}</p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>`;
  }

  /* ---------- phần khung cố định ---------- */
  function theme(ten) {
    const f = `<a:latin typeface="${FONT}"/><a:ea typeface=""/><a:cs typeface="${FONT}"/>`;
    const ss = c => `<a:solidFill><a:schemeClr val="${c}"/></a:solidFill>`;
    return XML + `<a:theme xmlns:a="${NS_A}" name="${xe(ten)}"><a:themeElements><a:clrScheme name="Triway"><a:dk1><a:srgbClr val="1F2937"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1E3A8A"/></a:dk2><a:lt2><a:srgbClr val="F1F5F9"/></a:lt2><a:accent1><a:srgbClr val="2563EB"/></a:accent1><a:accent2><a:srgbClr val="0D9488"/></a:accent2><a:accent3><a:srgbClr val="F59E0B"/></a:accent3><a:accent4><a:srgbClr val="DC2626"/></a:accent4><a:accent5><a:srgbClr val="7C3AED"/></a:accent5><a:accent6><a:srgbClr val="16A34A"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme><a:fontScheme name="Times New Roman"><a:majorFont>${f}</a:majorFont><a:minorFont>${f}</a:minorFont></a:fontScheme><a:fmtScheme name="Triway"><a:fillStyleLst>${ss("phClr")}${ss("phClr")}${ss("phClr")}</a:fillStyleLst><a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="12700"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="19050"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst>${ss("phClr")}${ss("phClr")}${ss("phClr")}</a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;
  }
  const lvl = (n, sz) => `<a:lvl${n}pPr marL="${(n - 1) * 457200}" algn="l" defTabSz="914400"><a:defRPr sz="${sz}"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="${FONT}"/><a:cs typeface="${FONT}"/></a:defRPr></a:lvl${n}pPr>`;
  const cayRong = `<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree>`;
  const CLR = `<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>`;
  const master = () => XML + `<p:sldMaster xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}"><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg>${cayRong}</p:cSld>${CLR}<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle>${lvl(1, 4000)}</p:titleStyle><p:bodyStyle>${[1, 2, 3].map(n => lvl(n, 2800)).join("")}</p:bodyStyle><p:otherStyle>${lvl(1, 2400)}</p:otherStyle></p:txStyles></p:sldMaster>`;
  const layout = () => XML + `<p:sldLayout xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}" type="blank" preserve="1"><p:cSld name="Trống">${cayRong}</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;
  const notesMaster = () => XML + `<p:notesMaster xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}"><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Ảnh slide"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg" idx="2"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="381000" y="685800"/><a:ext cx="6096000" cy="3429000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="12700"><a:solidFill><a:prstClr val="black"/></a:solidFill></a:ln></p:spPr></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Ghi chú"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" sz="quarter" idx="3"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="685800" y="4343400"/><a:ext cx="5486400" cy="4114800"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"/><a:lstStyle/><a:p><a:endParaRPr lang="vi-VN"/></a:p></p:txBody></p:sp></p:spTree></p:cSld>${CLR}<p:notesStyle>${lvl(1, 1400)}</p:notesStyle></p:notesMaster>`;
  const rel = (ds) => XML + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${ds.map(([id, loai, dich]) => `<Relationship Id="${id}" Type="${loai.startsWith("http") ? loai : "http://schemas.openxmlformats.org/officeDocument/2006/relationships/" + loai}" Target="${xe(dich)}"/>`).join("")}</Relationships>`;

  /* ---------- dựng cả file ---------- */
  // bo = { ten, tacGia, slides:[{khoi:[...], ghiChu, nen, nen2}], anh:{ id: {data:Uint8Array, ext:"png"|"jpeg"} } }
  async function taoPptx(bo) {
    const z = new JSZip(), n = bo.slides.length;
    const media = {}; let soAnh = 0;
    Object.keys(bo.anh || {}).forEach(id => { const a = bo.anh[id]; media[id] = `image${++soAnh}.${a.ext === "jpg" ? "jpeg" : a.ext}`; z.file("ppt/media/" + media[id], a.data); });
    const coGhiChu = bo.slides.some(s => s.ghiChu && s.ghiChu.trim());
    const ext = new Set(Object.values(media).map(f => f.split(".").pop()));
    z.file("[Content_Types].xml", XML + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${[...ext].map(e => `<Default Extension="${e}" ContentType="image/${e}"/>`).join("")}<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${coGhiChu ? `<Override PartName="/ppt/theme/theme2.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml"/>` : ""}<Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/><Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/><Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>${bo.slides.map((s, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>${s.ghiChu && s.ghiChu.trim() ? `<Override PartName="/ppt/notesSlides/notesSlide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/>` : ""}`).join("")}</Types>`);
    z.file("_rels/.rels", rel([["rId1", "officeDocument", "ppt/presentation.xml"], ["rId2", "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", "docProps/core.xml"], ["rId3", "extended-properties", "docProps/app.xml"]]));
    const nay = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    z.file("docProps/core.xml", XML + `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xe(bo.ten)}</dc:title><dc:creator>${xe(bo.tacGia || "")}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${nay}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${nay}</dcterms:modified></cp:coreProperties>`);
    z.file("docProps/app.xml", XML + `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Microsoft Office PowerPoint</Application><Slides>${n}</Slides><PresentationFormat>Trình chiếu 16:9</PresentationFormat></Properties>`);
    const pr = [["rId1", "slideMaster", "slideMasters/slideMaster1.xml"], ["rId2", "theme", "theme/theme1.xml"], ["rId3", "presProps", "presProps.xml"], ["rId4", "viewProps", "viewProps.xml"], ["rId5", "tableStyles", "tableStyles.xml"]];
    if (coGhiChu) pr.push(["rId6", "notesMaster", "notesMasters/notesMaster1.xml"]);
    bo.slides.forEach((s, i) => pr.push(["rId" + (10 + i), "slide", `slides/slide${i + 1}.xml`]));
    z.file("ppt/_rels/presentation.xml.rels", rel(pr));
    z.file("ppt/presentation.xml", XML + `<p:presentation xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}" saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>${coGhiChu ? '<p:notesMasterIdLst><p:notesMasterId r:id="rId6"/></p:notesMasterIdLst>' : ""}<p:sldIdLst>${bo.slides.map((s, i) => `<p:sldId id="${256 + i}" r:id="rId${10 + i}"/>`).join("")}</p:sldIdLst><p:sldSz cx="${W}" cy="${H}"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle>${lvl(1, 2800)}</p:defaultTextStyle></p:presentation>`);
    z.file("ppt/presProps.xml", XML + `<p:presentationPr xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}"/>`);
    z.file("ppt/viewProps.xml", XML + `<p:viewPr xmlns:a="${NS_A}" xmlns:r="${NS_R}" xmlns:p="${NS_P}"><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>`);
    z.file("ppt/tableStyles.xml", XML + `<a:tblStyleLst xmlns:a="${NS_A}" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`);
    z.file("ppt/theme/theme1.xml", theme("Triway"));
    z.file("ppt/slideMasters/slideMaster1.xml", master());
    z.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", rel([["rId1", "slideLayout", "../slideLayouts/slideLayout1.xml"], ["rId2", "theme", "../theme/theme1.xml"]]));
    z.file("ppt/slideLayouts/slideLayout1.xml", layout());
    z.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", rel([["rId1", "slideMaster", "../slideMasters/slideMaster1.xml"]]));
    if (coGhiChu) {
      z.file("ppt/theme/theme2.xml", theme("Ghi chú"));
      z.file("ppt/notesMasters/notesMaster1.xml", notesMaster());
      z.file("ppt/notesMasters/_rels/notesMaster1.xml.rels", rel([["rId1", "theme", "../theme/theme2.xml"]]));
    }
    let soCT = 0;
    bo.slides.forEach((s, i) => {
      const r = [["rId1", "slideLayout", "../slideLayouts/slideLayout1.xml"]], rids = {};
      [...new Set(s.khoi.filter(k => k.loai === "anh").map(k => k.anh))].forEach((a, j) => { if (!media[a]) throw new Error("Thiếu ảnh " + a + " ở slide " + (i + 1)); rids[a] = "rId" + (3 + j); r.push([rids[a], "image", "../media/" + media[a]]); });
      if (s.ghiChu && s.ghiChu.trim()) {
        r.push(["rId2", "notesSlide", `../notesSlides/notesSlide${i + 1}.xml`]);
        z.file(`ppt/notesSlides/notesSlide${i + 1}.xml`, notesXml(s.ghiChu));
        z.file(`ppt/notesSlides/_rels/notesSlide${i + 1}.xml.rels`, rel([["rId1", "notesMaster", "../notesMasters/notesMaster1.xml"], ["rId2", "slide", `../slides/slide${i + 1}.xml`]]));
      }
      const x = slideXml(s, rids);
      soCT += (x.match(/<mc:Choice[^>]*Requires="a14"[\s\S]*?<\/mc:Choice>/g) || []).reduce((t, c) => t + (c.match(/<m:oMath\b/g) || []).length, 0);
      z.file(`ppt/slides/slide${i + 1}.xml`, x);
      z.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, rel(r));
    });
    // tự kiểm: mọi phần XML phải đọc được
    if (typeof DOMParser !== "undefined") {
      for (const f of Object.keys(z.files)) if (/\.(xml|rels)$/.test(f)) {
        const d = new DOMParser().parseFromString(await z.file(f).async("string"), "application/xml");
        if (d.getElementsByTagName("parsererror").length) throw new Error("Lỗi XML ở " + f);
      }
    }
    const kieu = typeof window === "undefined" ? "nodebuffer" : "blob";
    const tep = await z.generateAsync({ type: kieu, mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", compression: "DEFLATE" });
    return { tep, soCT, soSlide: n };
  }
  return { taoPptx, congThucDon, W, H, FONT };
})();
if (typeof module !== "undefined") module.exports = PX;
