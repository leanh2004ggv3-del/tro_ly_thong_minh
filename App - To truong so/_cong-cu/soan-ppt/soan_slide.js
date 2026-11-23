/* Từ nội dung đã nạp → dàn ý slide (tự tách theo giáo án / SGK), câu lệnh AI và đọc trả lời AI,
   gắn ảnh minh hoạ cho MỌI slide (ảnh tài liệu đúng chỗ → hình học / đồ thị → tranh chủ đề). */
const SS = (() => {
  const uid = () => Math.random().toString(36).slice(2, 9);
  const gon = s => String(s || "").replace(/\s+/g, " ").trim();
  const RE_HD = /^(HOẠT ĐỘNG|Hoạt động|HĐ)\s*(\d+(?:\.\d+)*)\s*[.:\-–)]?\s*(.*)$/;
  const RE_ABCD = /^([a-dđ])\s*[).]\s*(Mục tiêu|Nội dung|Sản phẩm|Tổ chức thực hiện|Tổ chức|Tiến trình|Phương thức)\b\s*[:.]?\s*(.*)$/i;
  const RE_MT = /^(I\s*[.\-–:)]\s*)?(MỤC TIÊU|Mục tiêu bài học|YÊU CẦU CẦN ĐẠT)\b/;
  const RE_HET_MT = /^(II|III)\s*[.\-–:)]|^(THIẾT BỊ|CHUẨN BỊ|TIẾN TRÌNH)/i;
  const RE_NANG_LUC = /^(\d\s*[.)]\s*)?(Về\s+)?(Năng lực|Phẩm chất)/i;
  const RE_VE_NHA = /(hướng dẫn (về nhà|tự học)|về nhà|dặn dò)/i;
  const RE_TD_SGK = /^((?:[IVX]+|\d{1,2})\s*[.)]\s+\S.{1,90}|(?:Hoạt động|Khám phá|Luyện tập|Vận dụng|Thực hành|Ví dụ|Định nghĩa|Định lí|Định lý|Tính chất|Chú ý|Nhận xét|Kết luận|Ghi nhớ|Em có biết|Câu hỏi|Bài tập|Thí nghiệm|Tìm hiểu|Mở đầu|Khởi động|Thử thách|Tranh luận|Đọc hiểu|Trải nghiệm|Hình thành kiến thức|Quy tắc|Hệ quả)\b.{0,90})$/;
  const RE_CAU = /^(Câu|Bài)\s*(\d+)\s*[.:)]\s*(.*)$/i;
  const RE_LC = /^\s*([A-D])\s*[.)]\s*\S/;
  const laTieuDeSGK = s => s.length < 95 && RE_TD_SGK.test(s) && !/[;,]$/.test(s) && !RE_LC.test(s);

  /* nối dòng PDF bị ngắt giữa câu */
  function noiDong(dong, trang) {
    const ra = [], tr = [];
    dong.forEach((s, i) => {
      const t = ra.length - 1;
      if (t >= 0 && trang && !/[.:;!?)"]$/.test(ra[t]) && /^[a-zà-ỹđ(]/.test(s) && !laTieuDeSGK(s) && ra[t].length > 40) { ra[t] += " " + s; return; }
      ra.push(s); tr.push(trang ? trang[i] : 0);
    });
    return { dong: ra, trang: tr };
  }
  const gach = s => /^[-+•*–✓]/.test(s) || RE_LC.test(s) ? s : "- " + s;

  /* gom các câu hỏi trắc nghiệm trong một đoạn dòng → slide «cau» */
  function tachCau(ds, tieuDeGoc, nguon) {
    const ra = []; let cu = null;
    ds.forEach(s => {
      const m = s.match(RE_CAU);
      if (m) { cu = { hoi: [m[3] || ""], lc: [], so: m[2] }; ra.push(cu); return; }
      if (cu && RE_LC.test(s)) {
        // "A. 1 B. 2 C. 3 D. 4" trên một dòng → tách
        const nhieu = s.split(/\s+(?=[B-D]\s*[.)]\s)/);
        nhieu.forEach(x => cu.lc.push(x.trim()));
        return;
      }
      if (cu && !cu.lc.length) cu.hoi.push(s); else cu = null;
    });
    return ra.filter(c => c.lc.length >= 2).map(c => ({ id: uid(), loai: "cau", tieuDe: (tieuDeGoc ? tieuDeGoc + " — " : "") + "Câu " + c.so, noiDung: c.hoi.filter(Boolean).join("\n") + "\n" + c.lc.join("\n"), anh: [], nguon }));
  }

  /* ---------- tự dàn ý ---------- */
  function tuDan(nguon, tt) {
    const { dong, trang } = noiDong(nguon.dong || [], nguon.trangDong);
    const slides = [];
    const tenBai = tt.bai || (DF.tach(dong, "")[0] || {}).ten || "Bài học";
    const laKHBD = dong.filter(s => RE_HD.test(s)).length >= 2 || dong.filter(s => RE_ABCD.test(s)).length >= 3;
    const phu = [[tt.mon, tt.lop ? "Lớp " + tt.lop : ""].filter(Boolean).join(" – "), tt.boSach ? "Bộ sách: " + tt.boSach : "", tt.gv ? "Giáo viên: " + tt.gv : "", tt.truong || ""].filter(Boolean).join("\n");
    slides.push({ id: uid(), loai: "bia", tieuDe: tenBai.replace(/^(bài|BÀI)\s*/, m => m), nhan: tt.mon ? (tt.mon + (tt.lop ? " " + tt.lop : "")).toUpperCase() : "", phu, anh: [], nguon: [0, 0] });

    // mục tiêu (yêu cầu cần đạt)
    let mt = [], trongMt = false, iMt = -1;
    dong.forEach((s, i) => {
      if (RE_MT.test(s)) { trongMt = true; iMt = i; return; }
      if (trongMt && (RE_HET_MT.test(s) || (RE_NANG_LUC.test(s) && mt.length))) { trongMt = false; return; }
      if (trongMt && s.length > 10 && !/^\d\s*[.)]\s*(Về\s+)?(Kiến thức|Yêu cầu)/i.test(s) && mt.length < 8) mt.push(s);
    });
    if (mt.length) slides.push({ id: uid(), loai: "nd", tieuDe: "Mục tiêu bài học", noiDung: "Sau bài học này, em sẽ:\n" + mt.map(s => gach(s.replace(/^[-+•*–]\s*/, ""))).join("\n"), anh: [], nguon: [iMt, iMt + mt.length] });

    if (laKHBD) {
      // chia theo hoạt động
      const hd = [];
      dong.forEach((s, i) => { const m = s.length < 160 && s.match(RE_HD); if (m) hd.push({ i, so: m[2], ten: gon(m[3]).replace(/^[:.\-–]\s*/, "") }); });
      hd.forEach((h, k) => {
        const het = k + 1 < hd.length ? hd[k + 1].i : dong.length;
        const con = hd.slice(k + 1).some(x => x.so.startsWith(h.so + "."));
        const tenHD = `Hoạt động ${h.so}${h.ten ? ": " + h.ten : ""}`;
        if (!h.so.includes(".")) slides.push({ id: uid(), loai: "muc", tieuDe: tenHD.toUpperCase(), phu: "", anh: [], nguon: [h.i, h.i] });
        if (con) return;
        // các mục a) b) c) d)
        const muc = {}; let cur = null;
        for (let i = h.i + 1; i < het; i++) {
          const s = dong[i], m = s.match(RE_ABCD);
          if (m) { const t = m[2].toLowerCase(); cur = /nội dung/.test(t) ? "nd" : /sản phẩm/.test(t) ? "sp" : /mục tiêu/.test(t) ? "mt" : "tc"; muc[cur] = muc[cur] || { ds: [], i }; if (m[3]) muc[cur].ds.push(m[3]); continue; }
          if (RE_VE_NHA.test(s) && s.length < 60) break;
          if (cur) muc[cur].ds.push(s);
        }
        const nd = (muc.nd || {}).ds || [], sp = (muc.sp || {}).ds || [], tc = (muc.tc || {}).ds || [];
        const tenSl = h.so.includes(".") ? tenHD : (h.ten || tenHD);
        const cau = tachCau([...nd, ...tc], "", [h.i, het]);
        if (cau.length) { slides.push(...cau); }
        else if (nd.length) slides.push({ id: uid(), loai: "nd", tieuDe: tenSl, noiDung: nd.slice(0, 14).map(gach).join("\n"), anh: [], ghiChu: tc.slice(0, 14).join("\n"), nguon: [muc.nd.i, het] });
        // kết luận: sản phẩm, hoặc lời GV chốt trong bước kết luận
        let kl = sp.filter(s => !(s.length < 70 && /^(các |những )?(câu trả lời|bài làm|phiếu học tập|kết quả|dự đoán|ý kiến|sản phẩm|báo cáo|bảng|vở ghi).*(hs|học sinh|nhóm|cá nhân)/i.test(s)) && s.length > 12);
        const iChot = tc.findIndex(s => /(chốt|kết luận, nhận định|bước 4)/i.test(s));
        if (kl.length < 2 && iChot >= 0) {
          const chot = tc.slice(iChot).map(s => s.replace(/^(bước\s*4\s*[:.]?\s*)?(kết luận, nhận định\s*[:.]?\s*)?/i, "").replace(/^(GV|Giáo viên)\s+(chốt|kết luận|nhận xét)[^:]*:\s*/i, "")).filter(s => s.length > 12 && !/^(GV|Giáo viên|HS|Học sinh)\s/i.test(s)).slice(0, 10);
          if (chot.length) kl = [...kl, ...chot];
        }
        if (kl.length && !cau.length) slides.push({ id: uid(), loai: "nd", tieuDe: tenSl + " — Kết luận", noiDung: kl.slice(0, 14).map(gach).join("\n"), anh: [], nguon: [(muc.sp || muc.tc || { i: h.i }).i, het] });
      });
    } else {
      // SGK / chữ thường: chia theo tiêu đề mục
      let cu = null; const nhom = [];
      dong.forEach((s, i) => {
        if (i <= iMt + mt.length && iMt >= 0) return;
        if ((/^(BÀI|Bài|CHỦ ĐỀ|Chủ đề)\s+\d/.test(s) && i < 4) || gon(s).toLowerCase() === gon(tenBai).toLowerCase() || /^(KẾ HOẠCH BÀI DẠY|GIÁO ÁN)$/i.test(s)) return;
        if (laTieuDeSGK(s)) { cu = { ten: s.replace(/[:.]\s*$/, ""), ds: [], i }; nhom.push(cu); return; }
        if (!cu) { cu = { ten: tenBai, ds: [], i }; nhom.push(cu); }
        cu.ds.push(s);
      });
      nhom.forEach((n, k) => {
        const het = k + 1 < nhom.length ? nhom[k + 1].i : dong.length;
        if (/^[IVX]+\s*[.)]/.test(n.ten) && !n.ds.length) { slides.push({ id: uid(), loai: "muc", tieuDe: n.ten.toUpperCase(), phu: "", anh: [], nguon: [n.i, n.i] }); return; }
        const cau = tachCau(n.ds, n.ten.length < 40 ? n.ten : "", [n.i, het]);
        if (cau.length) { slides.push(...cau); return; }
        if (!n.ds.length) return;
        slides.push({ id: uid(), loai: "nd", tieuDe: n.ten, noiDung: n.ds.slice(0, 16).map(gach).join("\n"), anh: [], nguon: [n.i, het] });
      });
    }
    // dặn dò
    const iVN = dong.findIndex(s => RE_VE_NHA.test(s) && s.length < 80);
    const vn = iVN >= 0 ? dong.slice(iVN + 1, iVN + 6).filter(s => !RE_HD.test(s) && s.length > 5) : [];
    slides.push({ id: uid(), loai: "ket", tieuDe: "Hướng dẫn về nhà", noiDung: vn.length ? vn.map(gach).join("\n") : `- Ôn lại nội dung **${tenBai.replace(/^(Bài|BÀI)\s*\d+\s*[.:]\s*/, "")}**.\n- Hoàn thành các bài tập được giao.\n- Chuẩn bị bài học tiếp theo.`, anh: [], nguon: [Math.max(0, iVN), Math.max(0, iVN) + 6] });
    return slides;
  }

  /* ---------- gắn ảnh cho mọi slide ---------- */
  // khoAnh: [{id, dong, ...}] ảnh lấy từ tài liệu · taoAnh(spec) → id ảnh tự tạo
  function ganAnh(slides, khoAnh, tt, taoAnh) {
    const daDung = new Set(), dem = {}; let truoc = "";
    slides.forEach(sl => { (sl.anh || []).forEach(id => daDung.add(id)); });
    slides.forEach(sl => {
      if (sl.anh && sl.anh.length) return;
      sl.anh = [];
      // 1) ảnh trong tài liệu nằm trong đoạn nguồn của slide
      if (sl.nguon && sl.loai !== "bia" && sl.loai !== "ket") {
        const [a, b] = sl.nguon;
        khoAnh.filter(x => x.dong >= a && x.dong <= b && !daDung.has(x.id)).slice(0, 2).forEach(x => { sl.anh.push(x.id); daDung.add(x.id); });
        if (sl.anh.length) return;
      }
      const chu = (sl.tieuDe || "") + "\n" + (sl.noiDung || "") + "\n" + (sl.moTaAnh || "");
      // 2) đồ thị hàm số
      const ham = (sl.moTaAnh || sl.noiDung || "").match(/(?:đồ thị|vẽ)[^$\n]*\$?\s*(y\s*=\s*[^$\n,;]+)\$?/i);
      if (ham && AT.hamJS(ham[1])) { sl.anh.push(taoAnh({ kieu: "dothi", bt: gon(ham[1]) })); return; }
      // 3) hình học (môn Toán hoặc ảnh mô tả là hình)
      const hh = AT.nhanHinh((sl.moTaAnh || "") + " " + (sl.tieuDe || "") + " " + (sl.noiDung || "").slice(0, 300));
      if (hh && sl.loai !== "bia" && sl.loai !== "muc" && sl.loai !== "ket" && (/toán|hình/i.test(tt.mon || "") || /hình/i.test(sl.moTaAnh || ""))) { sl.anh.push(taoAnh({ kieu: "hinh", ten: hh })); return; }
      // 4) tranh chủ đề
      let ten;
      if (sl.loai === "bia") ten = /toán/i.test(tt.mon) ? (/đồ thị|hàm số/i.test(chu) ? "dothi" : "toan") : /tin/i.test(tt.mon) ? "maytinh" : /văn|tiếng việt/i.test(tt.mon) ? "van" : /sinh/i.test(tt.mon) ? "sinhhoc" : /lí|lý|vật/i.test(tt.mon) ? "luc" : /hoá|hóa/i.test(tt.mon) ? "hoahoc" : /địa|sử/i.test(tt.mon) ? "traidat" : AT.chonTranh(chu + " " + (tt.mon || ""), "nd");
      else if (sl.loai === "muc") ten = /khởi động|mở đầu/i.test(chu) ? "ytuong" : /hình thành|khám phá|kiến thức/i.test(chu) ? "khampha" : /luyện tập/i.test(chu) ? "luyentap" : /vận dụng|mở rộng/i.test(chu) ? "vandung" : AT.chonTranh(chu, "nd");
      else ten = AT.chonTranh(chu, sl.loai, tt.mon);
      if (ten === truoc || (dem[ten] || 0) >= 2) { const khac = AT.tranhKhac(tt.mon, sl.loai).find(t => t !== truoc && (dem[t] || 0) < 2) || AT.tranhKhac(tt.mon, sl.loai).find(t => t !== truoc); if (khac) ten = khac; }
      truoc = ten; dem[ten] = (dem[ten] || 0) + 1;
      sl.anh.push(taoAnh({ kieu: "tranh", ten }));
    });
    return slides;
  }

  /* ---------- câu lệnh AI ---------- */
  function lenhAI(nguon, tt, khoAnh, soSlide) {
    const chu = (nguon.dong || []).join("\n");
    const cat = chu.length > 14000 ? chu.slice(0, 14000) + "\n[…đã lược bớt phần cuối…]" : chu;
    const dsAnh = khoAnh.map((a, i) => `[${i + 1}] ${a.ten}${a.dong != null && nguon.dong[a.dong] ? " — gần dòng: «" + nguon.dong[a.dong].slice(0, 70) + "»" : ""}`).join("\n");
    return `Bạn là giáo viên ${tt.mon || ""}${tt.lop ? " lớp " + tt.lop : ""} giỏi thiết kế bài giảng PowerPoint theo Chương trình GDPT 2018${tt.boSach ? ", bộ sách " + tt.boSach : ""}.
Hãy soạn DÀN Ý SLIDE trình chiếu cho bài: «${tt.bai || "(xem nội dung bên dưới)"}», khoảng ${soSlide || "12–18"} slide, theo tiến trình: Mở đầu/Khởi động → Hình thành kiến thức → Luyện tập → Vận dụng → Hướng dẫn về nhà.

YÊU CẦU
- Chỉ dùng kiến thức trong NỘI DUNG bên dưới; không bịa số liệu, không thêm số trang SGK.
- Mỗi slide ngắn gọn: tối đa 6 ý, mỗi ý tối đa 2 dòng (chữ trên slide cỡ 24 trở lên).
- Công thức Toán, Lí, Hoá viết LaTeX giữa hai dấu $: $\\frac{a}{b}$, $\\sqrt{x}$, $x^2$, $H_2SO_4$, $\\Delta = b^2-4ac$, $2H_2 + O_2 \\xrightarrow{t^\\circ} 2H_2O$. Không viết công thức bằng chữ thường.
- Từ khoá quan trọng đặt giữa hai dấu ** (VD: **biệt thức**).
- Câu hỏi trắc nghiệm: mỗi câu một slide loại cau, các phương án viết trên dòng riêng bắt đầu A. B. C. D.
- Mỗi slide PHẢI có dòng ẢNH: chọn số ảnh tài liệu [n] nếu hợp, hoặc mô tả ngắn ảnh cần vẽ (VD: «đồ thị y = x^2», «hình tam giác vuông ABC», «thí nghiệm đốt khí hiđro»).
- GHI CHÚ: lời giảng / gợi ý tổ chức cho giáo viên (1–3 câu).

KHUÔN TRẢ LỜI (giữ đúng, không thêm lời mở đầu, không dùng bảng):
=== SLIDE | bia | <Tên bài>
PHỤ: <Môn – Lớp>
ẢNH: <…>
=== SLIDE | muc | HOẠT ĐỘNG 1: KHỞI ĐỘNG
ẢNH: <…>
=== SLIDE | nd | <Tiêu đề slide>
- <ý 1>
- <ý 2>
  - <ý con, thụt 2 dấu cách>
ẢNH: <…>
GHI CHÚ: <…>
=== SLIDE | cau | Luyện tập — Câu 1
<Câu hỏi>
A. <…>
B. <…>
C. <…>
D. <…>
ẢNH: <…>
GHI CHÚ: Đáp án: <…>
=== SLIDE | ket | Hướng dẫn về nhà
- <…>
ẢNH: <…>
(loại slide: bia = bìa, muc = chuyển hoạt động, nd = nội dung, cau = câu hỏi trắc nghiệm, ket = kết thúc)
${dsAnh ? "\nẢNH CÓ TRONG TÀI LIỆU:\n" + dsAnh + "\n" : ""}
NỘI DUNG (giáo án / SGK thầy cô đưa vào):
"""
${cat}
"""`;
  }
  /* ---------- đọc trả lời AI ---------- */
  function docAI(text, khoAnh) {
    const ra = []; let cu = null, vung = "nd";
    String(text || "").replace(/\r/g, "").split("\n").forEach(l => {
      const t = l.replace(/^\s*[*_#>]+\s*(?==)/, "").replace(/\*\*(=+\s*SLIDE[^*]*)\*\*/i, "$1");
      const m = t.match(/^\s*={2,}\s*SLIDE\s*\d*\s*\|\s*([a-zA-Zà-ỹ]+)\s*\|\s*(.*?)\s*=*\s*$/i);
      if (m) {
        const lo = m[1].toLowerCase(), loai = /^bia|bìa/.test(lo) ? "bia" : /^muc|mục/.test(lo) ? "muc" : /^cau|câu/.test(lo) ? "cau" : /^ket|kết/.test(lo) ? "ket" : "nd";
        cu = { id: uid(), loai, tieuDe: m[2].replace(/^\*\*|\*\*$/g, ""), noiDung: "", phu: "", ghiChu: "", anh: [] }; ra.push(cu); vung = "nd"; return;
      }
      if (!cu) return;
      const k = l.match(/^\s*(PHỤ|ẢNH|HÌNH|GHI CHÚ|LỜI GIẢNG)\s*:\s*(.*)$/i);
      if (k) {
        const ten = k[1].toUpperCase();
        if (ten === "PHỤ") { cu.phu += (cu.phu ? "\n" : "") + k[2]; vung = "phu"; }
        else if (ten === "ẢNH" || ten === "HÌNH") {
          const so = k[2].match(/^\s*\[(\d+)\]/);
          if (so && khoAnh[+so[1] - 1]) cu.anh.push(khoAnh[+so[1] - 1].id); else cu.moTaAnh = k[2].trim();
          vung = "anh";
        } else { cu.ghiChu += (cu.ghiChu ? "\n" : "") + k[2]; vung = "gc"; }
        return;
      }
      if (!l.trim()) return;
      if (vung === "gc") { cu.ghiChu += "\n" + l.trim(); return; }
      if (vung === "phu" && cu.loai === "bia") { cu.phu += "\n" + l.trim(); return; }
      cu.noiDung += (cu.noiDung ? "\n" : "") + l.replace(/^\s*[*•]\s+/, "- ").replace(/\s+$/, "");
    });
    ra.forEach(s => { s.tieuDe = s.tieuDe.replace(/\*\*/g, ""); if (s.loai === "bia" && !s.phu && s.noiDung) { s.phu = s.noiDung; s.noiDung = ""; } });
    return ra;
  }
  /* câu lệnh tạo ảnh cho AI vẽ tranh (Gemini, Copilot, ChatGPT…) */
  function lenhAnh(sl, tt) {
    const y = (sl.moTaAnh || sl.tieuDe || "").replace(/\$/g, "");
    return `Vẽ một ảnh minh hoạ cho slide bài giảng ${tt.mon || ""}${tt.lop ? " lớp " + tt.lop : ""}: «${y}». Phong cách tranh phẳng (flat illustration), màu tươi sáng, nền sáng đơn giản, bố cục rõ ràng, phù hợp học sinh Việt Nam; KHÔNG có chữ, chữ số hay kí hiệu sai trong ảnh; tỉ lệ 4:3.`;
  }
  return { tuDan, ganAnh, lenhAI, docAI, lenhAnh };
})();
