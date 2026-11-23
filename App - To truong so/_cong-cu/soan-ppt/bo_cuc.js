/* Dàn trang slide: đo chữ thật (Times New Roman), chọn cỡ chữ (không dưới 24), đặt ảnh cân đối,
   tự tách sang slide «(tiếp)» khi nội dung dài. Kết quả dùng chung cho xem trước (HTML) và file PPTX. */
const BC = (() => {
  const IN = 914400, PT = 12700, W = 12192000, H = 6858000;
  const CO_MIN = 24;
  const BANG_MAU = {
    bien: { ten: "Biển xanh", c1: "1D4ED8", c2: "0891B2", nhan: "F59E0B", nen: "F8FAFC", nen2: "EFF6FF", nhat: "BFDBFE" },
    la: { ten: "Lá non", c1: "15803D", c2: "0D9488", nhan: "F59E0B", nen: "F7FEF9", nen2: "ECFDF5", nhat: "BBF7D0" },
    tim: { ten: "Tím mộng", c1: "6D28D9", c2: "DB2777", nhan: "F59E0B", nen: "FAF8FF", nen2: "F5F3FF", nhat: "DDD6FE" },
    hoang: { ten: "Hoàng hôn", c1: "C2410C", c2: "DB2777", nhan: "0891B2", nen: "FFFBF7", nen2: "FFF7ED", nhat: "FED7AA" },
    son: { ten: "Đỏ son", c1: "B91C1C", c2: "D97706", nhan: "1D4ED8", nen: "FFFAFA", nen2: "FEF2F2", nhat: "FECACA" },
    xam: { ten: "Thanh lịch", c1: "334155", c2: "0F766E", nhan: "F59E0B", nen: "F8FAFC", nen2: "F1F5F9", nhat: "CBD5E1" }
  };
  const CHU = "1E293B";

  /* ---------- đo chữ ---------- */
  let cv = null;
  function rong(s, sz, b, i) {           // bề rộng (pt) của chuỗi ở cỡ sz pt
    if (typeof document !== "undefined") {
      cv = cv || document.createElement("canvas").getContext("2d");
      cv.font = `${i ? "italic " : ""}${b ? "bold " : ""}${sz}px "Times New Roman", Times, serif`;
      return cv.measureText(s).width;
    }
    return [...s].length * sz * (b ? 0.55 : 0.5);
  }
  // các mẩu không ngắt được của một đoạn: chữ (theo từ), công thức (cả khối)
  function manh(s, sz, b) {
    const ra = [];
    String(s || "").split("**").forEach((m, k) => {
      const bb = b || k % 2 === 1;
      CT.tach(m).forEach(p => {
        if (p.t === "ct") {
          const don = PX.congThucDon(p.src), t = CT.thuan("$" + p.src + "$");
          const kho = !don, cao = kho ? (/\\[dt]?frac|\\begin|\\sum|\\int|\\lim|\\cfrac/.test(p.src) ? 2.05 : /\\sqrt|\\overline|\\vec|\\widehat|\\x(right|left)|\\overset/.test(p.src) ? 1.3 : 1.1) : 1;
          let w = rong(t + (don ? "  " : ""), sz, bb, true) * (kho ? (cao > 2 ? 0.8 : 1.15) : 1.05);
          ra.push({ w, cao, ct: true });
        } else (p.s.match(/\S+\s*|\s+/g) || []).forEach(t => ra.push({ w: rong(t.replace(/[\^_]\{([^{}]*)\}/g, "$1"), sz, bb), cao: 1 }));
      });
    });
    return ra;
  }
  const LUI = { 0: 0, 1: 27, 2: 54, 3: 27 };
  // chiều cao (pt) một đoạn trong khung rộng wPt
  function caoDoan(d, wPt) {
    const sz = d.sz, w = wPt - (LUI[d.cap || 0] || 0);
    let dong = [{ w: 0, cao: 1 }];
    manh(d.s, sz, d.b).forEach(m => {
      const c = dong[dong.length - 1];
      if (c.w + m.w > w && c.w > 0) dong.push({ w: m.w, cao: m.cao }); else { c.w += m.w; c.cao = Math.max(c.cao, m.cao); }
    });
    // một mẩu dài hơn cả dòng (công thức rất dài) → coi như nhiều dòng
    const tong = dong.reduce((t, x) => t + x.cao * Math.max(1, Math.ceil(x.w / w - 0.02)), 0);
    return { cao: tong * sz * 1.18 * ((d.dong || 100) / 100) + (d.kc == null ? 6 : d.kc) + (d.kcTruoc || 0), dong: dong.length };
  }
  const caoKhoi = (ds, wPt) => ds.reduce((t, d) => t + caoDoan(d, wPt).cao, 0);

  /* ---------- nội dung chữ → đoạn ---------- */
  function doan(noiDung, sz, m) {
    const ra = [];
    String(noiDung || "").split(/\n/).forEach(l => {
      if (!l.trim()) return;
      let cap = 0, s = l;
      if (/^(\s{2,}|\t+)[-+•*–]\s*/.test(l)) { cap = 2; s = l.replace(/^\s*[-+•*–]\s*/, ""); }
      else if (/^\s*[-+•*–]\s+/.test(l)) { cap = 1; s = l.replace(/^\s*[-+•*–]\s+/, ""); }
      else if (/^\s*[✓✔]\s*/.test(l)) { cap = 3; s = l.replace(/^\s*[✓✔]\s*/, ""); }
      else s = l.trim();
      const tieuMuc = cap === 0 && s.length < 70 && /:$/.test(s.replace(/\*\*/g, ""));
      ra.push({ s, sz, cap, b: tieuMuc, mau: tieuMuc ? m.c1 : CHU, mauDam: m.c1, mauDau: cap === 2 ? m.c2 : m.c1, kc: 8 });
    });
    return ra;
  }
  const docLuaChon = noiDung => {
    const ds = String(noiDung || "").split(/\n/), lc = [], hoi = [];
    ds.forEach(l => { const m = l.match(/^\s*([A-D])\s*[.)]\s*(.+)$/); if (m) lc.push({ c: m[1], s: m[2].trim() }); else if (l.trim()) hoi.push(l); });
    return lc.length >= 2 ? { hoi: hoi.join("\n"), lc } : null;
  };

  /* ---------- ảnh vừa khung, giữ tỉ lệ ---------- */
  function vua(a, x, y, w, h) {
    const tl = (a && a.w && a.h) ? a.w / a.h : 4 / 3;
    let ww = w, hh = w / tl; if (hh > h) { hh = h; ww = h * tl; }
    return { x: x + (w - ww) / 2, y: y + (h - hh) / 2, w: ww, h: hh };
  }
  const khungAnh = (id, r, m, trang) => [
    { loai: "anh", anh: id, x: r.x, y: r.y, w: r.w, h: r.h, hinh: "roundRect", bo: 6000, vien: trang ? "FFFFFF" : m.c1, vienDay: trang ? 4 : 2, bong: true }
  ];
  const trangTri = (m, dam) => dam ? [
    { x: W - 2.9 * IN, y: -1.6 * IN, w: 4.2 * IN, h: 4.2 * IN, hinh: "ellipse", nen: "FFFFFF", trong: 0.88 },
    { x: -1.2 * IN, y: H - 1.9 * IN, w: 3.2 * IN, h: 3.2 * IN, hinh: "ellipse", nen: "FFFFFF", trong: 0.9 }
  ] : [
    { x: W - 1.9 * IN, y: -1.3 * IN, w: 3.0 * IN, h: 3.0 * IN, hinh: "ellipse", nen: m.c2, trong: 0.9 },
    { x: -0.9 * IN, y: H - 1.1 * IN, w: 2.0 * IN, h: 2.0 * IN, hinh: "ellipse", nen: m.c1, trong: 0.93 },
    { x: 0, y: H - 0.12 * IN, w: W, h: 0.12 * IN, nen: m.c1, nen2: m.c2 }
  ];

  /* tiêu đề slide nội dung: cỡ 36 → 32 → 28, tối đa 2 dòng */
  function tieuDe(s, m, wPt) {
    for (const sz of [36, 34, 32, 30, 28]) {
      const d = { s, sz, b: true, mau: m.c1, mauDam: m.c2, kc: 0, dong: 95 };
      const c = caoDoan(d, wPt);
      if (c.dong <= (sz > 32 ? 1 : 2)) return { d, cao: c.cao };
    }
    const d = { s, sz: 28, b: true, mau: m.c1, mauDam: m.c2, kc: 0, dong: 95 };
    return { d, cao: caoDoan(d, wPt).cao };
  }

  /* ---------- dàn một slide (có thể ra nhiều trang khi dài) ---------- */
  // sl: {loai, tieuDe, phu, noiDung, anh:[id], ghiChu} · kho: {id: {w,h}} · tc: {mau, co}
  function danSlide(sl, kho, tc, canhBao, soThu) {
    const m = BANG_MAU[tc.mau] || BANG_MAU.bien, coGoc = Math.max(CO_MIN, tc.co || 28);
    const anh = (sl.anh || []).filter(id => kho[id]);
    const ghiChu = sl.ghiChu || "";
    if (!anh.length) canhBao.push({ slide: soThu, loi: "chưa có ảnh minh hoạ" });

    if (sl.loai === "bia" || sl.loai === "muc") {
      const bia = sl.loai === "bia";
      const khoi = trangTri(m, true);
      const coAnh = anh.length > 0;
      const aW = coAnh ? (bia ? 5.0 : 4.6) * IN : 0;
      const xT = 0.8 * IN, wT = W - xT - (coAnh ? aW + 1.3 * IN : 0.8 * IN), wPt = wT / PT - 15;
      const nhan = [], phu = String(sl.phu || "").split(/\n/).filter(Boolean);
      let szT = bia ? 48 : 44, dT;
      for (; szT >= 32; szT -= 2) { dT = { s: sl.tieuDe || "", sz: szT, b: true, mau: "FFFFFF", mauDam: "FEF08A", kc: 10, dong: 95 }; if (caoDoan(dT, wPt).dong <= 3) break; }
      if (szT < 32) szT = 32;
      if (sl.nhan) nhan.push({ s: sl.nhan, sz: 28, b: true, mau: "FEF08A", kc: 12 });
      const dsP = phu.map(s => ({ s, sz: bia ? 28 : 28, mau: "FFFFFF", mauDam: "FEF08A", kc: 6 }));
      const dsN = doan(sl.noiDung, 24, m).map(d => Object.assign(d, { mau: "FFFFFF", mauDam: "FEF08A", mauDau: "FEF08A" }));
      let tat = [...nhan, dT, ...dsP, ...dsN];
      while (caoKhoi(tat, wPt) > (H - 1.4 * IN) / PT && tat.some(d => d.sz > CO_MIN)) tat.forEach(d => { if (d.sz > CO_MIN) d.sz -= 2; });
      if (caoKhoi(tat, wPt) > (H - 1.4 * IN) / PT) canhBao.push({ slide: soThu, loi: "chữ bìa quá dài, nên rút gọn" });
      khoi.push({ x: xT - 0.05 * IN, y: 0.7 * IN, w: wT, h: H - 1.4 * IN, doan: tat, neo: "ctr", le: 45720, ten: "Tiêu đề" });
      const T = Math.min(caoKhoi(tat, wPt) * PT, H - 1.4 * IN);
      khoi.push({ x: xT - 0.32 * IN, y: H / 2 - T / 2 + 0.05 * IN, w: 0.1 * IN, h: T - 0.1 * IN, nen: m.nhan, hinh: "roundRect", bo: 50000, ten: "Gạch nhấn" });
      if (coAnh) {
        const vung = anh.length > 1 ? anh.slice(0, 2) : anh;
        const hV = (H - 1.4 * IN - (vung.length - 1) * 0.25 * IN) / vung.length;
        vung.forEach((id, k) => khoi.push(...khungAnh(id, vua(kho[id], W - aW - 0.7 * IN, 0.7 * IN + k * (hV + 0.25 * IN), aW, hV), m, true)));
      }
      return [{ khoi, ghiChu, nen: m.c1, nen2: m.c2, goc: 45 }];
    }

    if (sl.loai === "cau") {
      const lc = docLuaChon(sl.noiDung);
      if (lc) return danCau(sl, lc, anh, kho, m, coGoc, ghiChu, canhBao, soThu);
    }

    // ----- slide nội dung / kết -----
    const ket = sl.loai === "ket";
    const xL = 0.6 * IN, xR = W - 0.6 * IN;
    const td = tieuDe(sl.tieuDe || "", m, (xR - xL - (ket ? 0 : 1.2 * IN)) / PT - 15);
    const yTd = 0.32 * IN, hTd = Math.max(0.85 * IN, td.cao * PT + 0.15 * IN);
    const yB = yTd + hTd + 0.32 * IN, hB = H - yB - 0.42 * IN;
    const dsGoc = doan(sl.noiDung, coGoc, m);
    const ra = [];
    const dung = (ds, co) => ds.map(d => Object.assign({}, d, { sz: co }));
    // thử các cách đặt ảnh: bên phải (rộng theo tỉ lệ ảnh) / bên dưới (ảnh ngang, chữ ít)
    function cach(ds, chiaAnh) {
      const a0 = anh[0] && kho[anh[0]], tl = a0 && a0.w && a0.h ? a0.w / a0.h : 4 / 3;
      const ketQua = [];
      if (anh.length) {
        for (const ti of [0.44, 0.40, 0.36, 0.32]) {   // phần bề ngang dành cho ảnh
          const aW = Math.min((xR - xL) * ti, tl >= 1 ? (xR - xL) * ti : hB * tl + 0.1 * IN);
          ketQua.push({ kieu: "phai", wChu: xR - xL - aW - 0.35 * IN, aW });
        }
        if (tl >= 1.5 && anh.length === 1) ketQua.push({ kieu: "duoi", wChu: xR - xL });
      } else ketQua.push({ kieu: "khong", wChu: xR - xL });
      return ketQua;
    }
    // tìm cỡ chữ & cách đặt cho một nhóm đoạn
    function thu(ds) {
      // nội dung ngắn: phóng chữ to hơn cỡ đã chọn (tối đa +4) nếu vẫn thoáng
      for (let co = Math.min(36, coGoc + 4); co >= CO_MIN; co -= 2) {
        const phong = co > coGoc;
        for (const c of cach()) {
          const dd = dung(ds, co), wPt = (c.wChu - 0.5 * IN) / PT;
          const cao = caoKhoi(dd, wPt) * PT * 1.07 + 0.42 * IN;
          if (c.kieu === "duoi") {
            if (cao <= hB * (phong ? 0.4 : 0.48)) return { c, dd, co, cao };
          } else if (cao <= hB * (phong ? 0.72 : 1)) return { c, dd, co, cao };
        }
      }
      return null;
    }
    // tách đoạn sang nhiều trang khi không vừa
    let conLai = dsGoc.slice(), lan = 0;
    while (lan++ < 12) {
      let n = conLai.length, kq = null;
      for (; n >= 1; n--) { kq = thu(conLai.slice(0, n)); if (kq) break; }
      if (!kq) {   // một đoạn quá dài: cắt đôi theo câu
        const d = conLai[0], cau = d.s.split(/(?<=[.;!?])\s+/);
        if (cau.length > 1) { const g = Math.ceil(cau.length / 2); conLai.splice(0, 1, Object.assign({}, d, { s: cau.slice(0, g).join(" ") }), Object.assign({}, d, { s: cau.slice(g).join(" "), cap: d.cap ? d.cap : 0 })); continue; }
        kq = { c: cach()[0], dd: dung([d], CO_MIN), co: CO_MIN, cao: hB }; n = 1;
        canhBao.push({ slide: soThu, loi: "một đoạn quá dài, chữ có thể tràn — nên tách ý" });
      }
      ra.push(kq); conLai = conLai.slice(n);
      if (!conLai.length) break;
    }
    if (!ra.length) ra.push({ c: cach()[0], dd: [], co: coGoc, cao: 0 });
    // trang cuối chỉ còn 1 ý ngắn → chuyển bớt ý của trang trước sang cho cân
    for (let lan2 = 0; lan2 < 3 && ra.length > 1; lan2++) {
      const cuoi = ra[ra.length - 1], truoc = ra[ra.length - 2];
      if (cuoi.dd.length > 1 || truoc.dd.length < 3 || String(cuoi.dd[0] && cuoi.dd[0].s).length > 80) break;
      const a = thu(truoc.dd.slice(0, -1)), b = thu([truoc.dd[truoc.dd.length - 1], ...cuoi.dd]);
      if (!a || !b) break;
      ra[ra.length - 2] = a; ra[ra.length - 1] = b;
    }
    if (ra.length > 1) canhBao.push({ slide: soThu, loi: `nội dung dài → tự tách thành ${ra.length} slide`, nhe: true });

    return ra.map((kq, k) => {
      const khoi = trangTri(m, false);
      if (ket) khoi.push({ x: 0, y: 0, w: W, h: yB - 0.12 * IN, nen: m.c1, nen2: m.c2 });
      const ten = (sl.tieuDe || "") + (k ? " (tiếp)" : "");
      const tdd = Object.assign({}, td.d, { s: ten, mau: ket ? "FFFFFF" : m.c1, mauDam: ket ? "FEF08A" : m.c2 });
      khoi.push({ x: xL, y: yTd, w: xR - xL - (ket ? 0 : 1.2 * IN), h: hTd, doan: [tdd], neo: "ctr", le: 45720, ten: "Tiêu đề" });
      if (!ket) khoi.push({ x: xL + 0.04 * IN, y: yTd + hTd + 0.04 * IN, w: 1.7 * IN, h: 0.09 * IN, nen: m.c1, nen2: m.c2, hinh: "roundRect", bo: 50000, ten: "Gạch nhấn" });
      const c = Object.assign({}, kq.c), a = anh;
      // ảnh hẹp hơn cột dành cho nó → nhường phần thừa cho thẻ chữ, ảnh sát lề phải
      let oAnh = [];
      if (a.length && c.kieu === "phai") {
        const ds = a.slice(0, 2), gap = 0.25 * IN, hA = (hB - gap * (ds.length - 1)) / ds.length;
        oAnh = ds.map((id, j) => vua(kho[id], xR - c.aW, yB + j * (hA + gap), c.aW, hA));
        const thua = c.aW - Math.max(...oAnh.map(r => r.w));
        if (thua > 0.05 * IN) { c.wChu += thua; oAnh.forEach(r => { r.x = xR - r.w; }); }
      }
      // khung chữ: thẻ trắng bo góc
      const hChu = c.kieu === "duoi" ? Math.min(kq.cao, hB * 0.48) : Math.min(hB, Math.max(kq.cao, hB * (a.length ? 0.62 : 0.5)));
      const yChu = c.kieu === "duoi" ? yB : yB + (hB - hChu) / 2 * 0.35;
      if (kq.dd.length) khoi.push({ x: xL, y: yChu, w: c.wChu, h: hChu, nen: "FFFFFF", vien: m.nhat, vienDay: 1.25, hinh: "roundRect", bo: 5000, bong: true, doan: kq.dd, neo: c.kieu === "duoi" ? "t" : "ctr", le: 0.25 * IN, leTren: 0.2 * IN, ten: "Nội dung" });
      if (a.length) {
        if (c.kieu === "duoi") {
          const yA = yChu + hChu + 0.25 * IN;
          khoi.push(...khungAnh(a[0], vua(kho[a[0]], xL, yA, xR - xL, H - yA - 0.4 * IN), m));
        } else oAnh.forEach((r, j) => khoi.push(...khungAnh(a[j], r, m)));
      }
      return { khoi, ghiChu: k ? "" : ghiChu, nen: m.nen, nen2: m.nen2, goc: 90 };
    });
  }

  /* câu hỏi trắc nghiệm: câu dẫn + 4 ô A B C D */
  function danCau(sl, lc, anh, kho, m, coGoc, ghiChu, canhBao, soThu) {
    const khoi = trangTri(m, false);
    const xL = 0.6 * IN, xR = W - 0.6 * IN;
    const td = tieuDe(sl.tieuDe || "Câu hỏi", m, (xR - xL - 1.2 * IN) / PT - 15);
    const yTd = 0.32 * IN, hTd = Math.max(0.85 * IN, td.cao * PT + 0.15 * IN);
    khoi.push({ x: xL, y: yTd, w: xR - xL - 1.2 * IN, h: hTd, doan: [td.d], neo: "ctr", le: 45720, ten: "Tiêu đề" });
    khoi.push({ x: xL + 0.04 * IN, y: yTd + hTd + 0.04 * IN, w: 1.7 * IN, h: 0.09 * IN, nen: m.c1, nen2: m.c2, hinh: "roundRect", bo: 50000 });
    const yB = yTd + hTd + 0.3 * IN;
    const a0 = anh[0] && kho[anh[0]], tl = a0 && a0.w ? a0.w / a0.h : 4 / 3;
    let co = coGoc, hHoi, dHoi, hO, ok = false, aW = anh.length ? 3.4 * IN : 0, hA = 0;
    const hai = lc.lc.length <= 4 && lc.lc.every(x => rong(CT.thuan(x.s), 28) < ((xR - xL) / 2 - 1.2 * IN) / PT * 1.6);
    for (; co >= CO_MIN; co -= 2) {
      dHoi = doan(lc.hoi, co, m);
      const wHoi = xR - xL - (aW ? aW + 0.3 * IN : 0);
      hHoi = caoKhoi(dHoi, (wHoi - 0.5 * IN) / PT) * PT + 0.35 * IN;
      hA = aW ? Math.max(hHoi, Math.min(2.3 * IN, aW / tl)) : hHoi;
      const cot = hai ? 2 : 1, wO = (xR - xL - (cot - 1) * 0.3 * IN) / cot;
      hO = Math.max(...lc.lc.map(x => caoKhoi([{ s: x.s, sz: co, kc: 0 }], (wO - 1.2 * IN) / PT) * PT + 0.3 * IN), 0.75 * IN);
      const tong = hA + 0.3 * IN + (Math.ceil(lc.lc.length / cot)) * (hO + 0.22 * IN);
      if (tong <= H - yB - 0.35 * IN) { ok = true; break; }
    }
    if (!ok) { co = CO_MIN; canhBao.push({ slide: soThu, loi: "câu hỏi dài, có thể tràn — nên rút gọn" }); }
    const wHoi = xR - xL - (aW ? aW + 0.3 * IN : 0);
    if (dHoi.length) khoi.push({ x: xL, y: yB, w: wHoi, h: hA, nen: "FFFFFF", vien: m.nhat, vienDay: 1.25, hinh: "roundRect", bo: 6000, bong: true, doan: dHoi, neo: "ctr", le: 0.25 * IN, leTren: 0.15 * IN, ten: "Câu hỏi" });
    if (aW) khoi.push(...khungAnh(anh[0], vua(kho[anh[0]], xR - aW, yB, aW, hA), m));
    const cot = hai ? 2 : 1, wO = (xR - xL - (cot - 1) * 0.3 * IN) / cot, y0 = yB + hA + 0.3 * IN;
    const mauO = [m.c1, m.c2, m.nhan, "7C3AED"];
    lc.lc.forEach((x, j) => {
      const r = Math.floor(j / cot), c = j % cot, x0 = xL + c * (wO + 0.3 * IN), yy = y0 + r * (hO + 0.22 * IN);
      khoi.push({ x: x0, y: yy, w: wO, h: hO, nen: "FFFFFF", vien: mauO[j % 4], vienDay: 2.25, hinh: "roundRect", bo: 18000, bong: true, doan: [{ s: x.s, sz: co, mau: CHU, mauDam: m.c1, kc: 0 }], neo: "ctr", le: 0.95 * IN, leTren: 0.08 * IN, ten: "Phương án " + x.c });
      const d = Math.min(hO - 0.16 * IN, 0.62 * IN);
      khoi.push({ x: x0 + 0.16 * IN, y: yy + (hO - d) / 2, w: d, h: d, hinh: "ellipse", nen: mauO[j % 4], doan: [{ s: x.c, sz: 24, b: true, mau: "FFFFFF", canh: "ctr", kc: 0 }], neo: "ctr", le: 0, leTren: 0, ten: "Chữ " + x.c });
    });
    return [{ khoi, ghiChu, nen: m.nen, nen2: m.nen2, goc: 90 }];
  }

  /* ---------- cả bài ---------- */
  function danBai(ds, kho, tc) {
    const canhBao = [], trang = [];
    ds.forEach((sl, i) => danSlide(sl, kho, tc, canhBao, i + 1).forEach(t => { t.goc = i; trang.push(t); }));
    return { trang, canhBao };
  }

  /* ---------- xem trước HTML (đúng toạ độ file PPT) ---------- */
  const hx = h => "#" + h;
  function rgba(hex, trong) { const n = parseInt(hex, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${trong ? (1 - trong).toFixed(2) : 1})`; }
  function htmlChu(s) { return String(s || "").split("**").map((m, k) => k % 2 ? `<b class="dam">${CT.htmlChu(m)}</b>` : CT.htmlChu(m)).join(""); }
  function htmlTrang(t, rongPx, urlAnh) {
    const k = rongPx / W, px = v => (v * k).toFixed(1) + "px", pt = sz => (sz * PT * k).toFixed(2) + "px";
    const nen = t.nen2 ? `linear-gradient(${t.goc === 45 ? "135deg" : "180deg"},${hx(t.nen)},${hx(t.nen2)})` : hx(t.nen || "FFFFFF");
    let s = `<div class="tr-sl" style="width:${px(W)};height:${px(H)};background:${nen}">`;
    t.khoi.forEach(b => {
      const bo = b.hinh === "ellipse" ? "50%" : b.hinh === "roundRect" ? px(Math.min(b.w, b.h) * (b.bo == null ? 16667 : b.bo) / 100000) : "0";
      const nenK = b.nen ? (b.nen2 ? `linear-gradient(90deg,${hx(b.nen)},${hx(b.nen2)})` : rgba(b.nen, b.trong)) : "transparent";
      const st = `left:${px(b.x)};top:${px(b.y)};width:${px(b.w)};height:${px(b.h)};border-radius:${bo};${b.vien ? `border:${Math.max(1, (b.vienDay || 1.5) * PT * k).toFixed(1)}px solid ${hx(b.vien)};` : ""}${b.bong ? "box-shadow:0 3px 10px rgba(15,23,42,.18);" : ""}`;
      if (b.loai === "anh") { s += `<img class="tr-a" style="${st}object-fit:cover" src="${urlAnh(b.anh) || ""}" alt="">`; return; }
      let ch = "";
      if (b.doan) ch = b.doan.map(d => {
        const lui = d.cap ? LUI[d.cap] : 0;
        const dau = d.cap === 1 ? "•" : d.cap === 2 ? "–" : d.cap === 3 ? "✓" : "";
        return `<p style="font-size:${pt(d.sz)};${d.b ? "font-weight:700;" : ""}color:${hx(d.mau || CHU)};text-align:${d.canh === "ctr" ? "center" : "left"};margin:${pt(d.kcTruoc || 0)} 0 ${pt(d.kc == null ? 6 : d.kc)};padding-left:${pt(lui)};line-height:${(1.15 * (d.dong || 100) / 100).toFixed(2)};--dam:${hx(d.mauDam || d.mau || CHU)}">${dau ? `<span class="tr-dau" style="color:${hx(d.mauDau || d.mau || CHU)};width:${pt(lui)};margin-left:-${pt(lui)}">${dau}</span>` : ""}${htmlChu(d.s)}</p>`;
      }).join("");
      const le = b.le == null ? 91440 : b.le, leT = b.leTren == null ? 45720 : b.leTren;
      s += `<div class="tr-k" style="${st}background:${nenK};padding:${px(leT)} ${px(le)};justify-content:${b.neo === "ctr" ? "center" : "flex-start"}">${ch}</div>`;
    });
    return s + "</div>";
  }
  return { danBai, htmlTrang, BANG_MAU, CO_MIN, docLuaChon, W, H, IN };
})();
if (typeof module !== "undefined") module.exports = BC;
