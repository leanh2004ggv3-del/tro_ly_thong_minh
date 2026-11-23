/* Giao diện «Trợ lý soạn giáo án PowerPoint» */
(() => {
  const $ = id => document.getElementById(id), esc = TT.esc;
  const KHOA = "soanppt";
  const LOAI = { bia: "Bìa", muc: "Chuyển hoạt động", nd: "Nội dung", cau: "Câu hỏi trắc nghiệm", ket: "Kết thúc / dặn dò" };
  const moi = () => ({ tt: { mon: "", lop: "", bai: "", boSach: "", gv: "", truong: "" }, chu: "", trangDong: null, tep: [], anh: [], slides: [], tc: { mau: "bien", co: 28, hieuUng: 1, ghiChu: 1 }, chon: 0 });
  let S = Object.assign(moi(), TT.load(KHOA, {}) || {});
  const BYTE = {};      // id → {data, ext, url} (ảnh file, tải lên, cắt)

  /* ---------- kho ảnh trong trình duyệt (IndexedDB) ---------- */
  const IDB = (() => {
    let db = null;
    const mo = () => db ? Promise.resolve(db) : new Promise((ok, loi) => { const r = indexedDB.open("tts_soanppt", 1); r.onupgradeneeded = () => r.result.createObjectStore("anh"); r.onsuccess = () => ok(db = r.result); r.onerror = () => loi(r.error); });
    const lam = (che, fn) => mo().then(d => new Promise((ok, loi) => { const t = d.transaction("anh", che), s = t.objectStore("anh"), r = fn(s); t.oncomplete = () => ok(r && r.result); t.onerror = () => loi(t.error); }));
    return { dat: (id, v) => TT.MAU ? Promise.resolve() : lam("readwrite", s => s.put(v, id)).catch(() => {}), lay: id => lam("readonly", s => s.get(id)).catch(() => null), xoa: id => lam("readwrite", s => s.delete(id)).catch(() => {}) };
  })();
  let henLuu = null;
  const luu = () => { clearTimeout(henLuu); henLuu = setTimeout(() => TT.save(KHOA, S), 300); };

  /* ---------- ảnh ---------- */
  const bang = () => BC.BANG_MAU[S.tc.mau] || BC.BANG_MAU.bien;
  function mauAnh(a) { const m = Object.assign({}, bang()); if (a.tao && a.tao.bien % 2) { const t = m.c1; m.c1 = m.c2; m.c2 = t; } return m; }
  function svgCua(a) { const m = mauAnh(a), t = a.tao; return t.kieu === "dothi" ? AT.doThi(t.bt, m) : t.kieu === "hinh" ? AT.hinhHoc(t.ten, m) : AT.tranh(t.ten, m); }
  const urlCache = {};
  function urlAnh(id) {
    const a = S.anh.find(x => x.id === id); if (!a) return "";
    if (a.tao) { const k = id + "|" + S.tc.mau; if (!urlCache[k]) { const s = svgCua(a); urlCache[k] = s ? "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s) : ""; } return urlCache[k]; }
    return (BYTE[id] || {}).url || "";
  }
  const kho = () => { const k = {}; S.anh.forEach(a => { if (a.tao || BYTE[a.id]) k[a.id] = { w: a.w || 1200, h: a.h || 900 }; }); return k; };
  function taoAnh(tao) {
    const cung = S.anh.filter(a => a.tao && a.tao.kieu === tao.kieu && a.tao.ten === tao.ten && a.tao.bt === tao.bt).length;
    if (tao.kieu === "dothi" && !AT.doThi(tao.bt, bang())) return null;
    const ten = tao.kieu === "dothi" ? "Đồ thị " + tao.bt : tao.kieu === "hinh" ? AT.HINH[tao.ten] : "Tranh: " + (AT.TEN_TRANH[tao.ten] || tao.ten);
    const a = { id: "t" + TT.uid(), ten, nguon: "tao", w: 1200, h: 900, tao: Object.assign({ bien: cung }, tao) };
    S.anh.push(a); return a.id;
  }
  function themAnhByte(a, nguon, dong) {
    const id = "a" + TT.uid();
    BYTE[id] = { data: a.data, ext: a.ext, url: a.url };
    S.anh.push({ id, ten: a.ten || "Ảnh", nguon, w: a.w, h: a.h, dong: dong == null ? a.dong : dong, trang: a.trang });
    IDB.dat(id, BYTE[id]);
    return id;
  }

  /* ---------- dàn trang ---------- */
  let DAN = { trang: [], canhBao: [] };
  const dan = () => (DAN = BC.danBai(S.slides, kho(), { mau: S.tc.mau, co: +S.tc.co }));
  const trangCua = i => DAN.trang.filter(t => t.goc === i);

  /* ---------- BƯỚC 1: thông tin + nạp ---------- */
  document.querySelectorAll("[data-tt]").forEach(o => { o.value = S.tt[o.dataset.tt] || ""; o.oninput = () => { S.tt[o.dataset.tt] = o.value; luu(); if (o.dataset.tt === "bai" || o.dataset.tt === "mon") veHet(); }; });
  function veTep() {
    $("dsTep").innerHTML = S.tep.map((t, i) => `<div class="tep"><span>${t.kieu.startsWith("PDF") ? "📕" : t.kieu === "Word" ? "📘" : t.kieu === "ảnh" ? "🖼" : "📝"}</span><b title="${esc(t.ten)}">${esc(t.ten)}</b><span class="mo nho2">${esc(t.kieu)}${t.soDong ? " · " + t.soDong + " dòng" : ""}${t.soAnh ? " · " + t.soAnh + " ảnh" : ""}</span><button class="nut phu nho" data-xoatep="${i}" title="Bỏ file này khỏi danh sách" style="min-height:30px;padding:2px 8px">✕</button></div>${t.ghi ? `<div class="mo nho2" style="margin:2px 0 0 8px">${t.ghi}</div>` : ""}`).join("");
    const ds = S.anh.filter(a => !a.tao);
    $("soAnh").textContent = ds.length + " ảnh";
    $("khoAnh1").innerHTML = ds.map((a, i) => `<div class="o-a" title="${esc(a.ten)}"><img src="${urlAnh(a.id)}" alt="${esc(a.ten)}"><span>${i + 1}</span></div>`).join("") || `<div class="mo nho2" style="grid-column:1/-1">Chưa có ảnh. Không sao: app tự vẽ tranh, đồ thị, hình học cho mỗi slide.</div>`;
    const dong = S.chu ? S.chu.split("\n").length : 0;
    $("soDong").textContent = dong;
    if (document.activeElement !== $("oChu")) $("oChu").value = S.chu;
  }
  $("dsTep").onclick = e => { const b = e.target.closest("[data-xoatep]"); if (!b) return; S.tep.splice(+b.dataset.xoatep, 1); luu(); veTep(); };
  $("oChu").oninput = () => { S.chu = $("oChu").value; S.trangDong = null; $("soDong").textContent = S.chu.split("\n").length; luu(); };
  function baoTienDo(chu, ti) {
    const o = $("tienDoDoc");
    if (!chu) { o.hidden = true; return; }
    o.hidden = false; o.querySelector("span").textContent = chu; o.querySelector("i").style.width = Math.round((ti || 0) * 100) + "%";
  }
  async function napFile(files) {
    for (const f of files) {
      const dongCu = S.chu ? S.chu.split("\n").length : 0;
      TT.toast("Đang đọc " + f.name + "…");
      try {
        const r = await DN.doc(f, baoTienDo, $("ocrAnh").checked);
        if (r.dong.length) { S.chu = (S.chu ? S.chu + "\n" : "") + r.dong.join("\n"); S.trangDong = r.trangDong && !dongCu ? r.trangDong : null; }
        r.anh.forEach(a => themAnhByte(a, a.nguon || "file", a.dong != null ? a.dong + dongCu : null));
        let ghi = "";
        if (r.thongTin && r.thongTin.nOle) ghi += `⚠ Có ${r.thongTin.nOle} công thức MathType (dạng ảnh) — app không đọc được chữ bên trong; thầy cô gõ lại công thức kiểu $…$ ở bước 3. `;
        if (r.thongTin && r.thongTin.nCT) ghi += `✔ Đọc được ${r.thongTin.nCT} công thức Equation. `;
        if (r.thongTin && r.thongTin.boQua) ghi += `${r.thongTin.boQua} ảnh dạng EMF/WMF bỏ qua. `;
        if (r.ocr) ghi += `📷 File dạng ảnh: app đã <b>nhận chữ (OCR)</b> ${r.ocr.soTrang} trang${r.ocr.conLai ? ` (còn ${r.ocr.conLai} trang chưa đọc — tách file nhỏ hơn)` : ""}. Chữ nhận từ ảnh có thể sai, <b>nhất là công thức</b>: thầy cô xem lại ở «Xem chữ app đọc được», gõ công thức kiểu $…$. <b>Nên dùng Cách 2:</b> chép câu lệnh rồi <b>đính kèm luôn file PDF này</b> vào ChatGPT / Gemini (AI đọc được ảnh trang sách) — slide và công thức sẽ chuẩn hơn. Hình trong trang: «Cắt từ trang PDF» ở bước 3. `;
        else if (r.tenPdf) ghi += "Hình vẽ nét trong PDF: dùng «Cắt từ trang PDF» ở bước 3.";
        if (r.ocr && !r.dong.length) ghi += `<span class="do">Không nhận được chữ nào — ảnh mờ hoặc nghiêng.</span>`;
        S.tep.push({ ten: f.name, kieu: r.kieu, soDong: r.dong.length, soAnh: r.anh.length, pdf: r.tenPdf || "", ghi, ocr: !!r.ocr });
        baoTienDo("");
        if (!S.tt.bai && r.dong.length) { const cd = DF.tach(r.dong, "")[0]; if (cd && /^(Bài|BÀI|Chủ đề|CHỦ ĐỀ)/.test(cd.ten)) { S.tt.bai = cd.ten; document.querySelector('[data-tt="bai"]').value = cd.ten; } }
        TT.toast(`Đã đọc ${f.name}: ${r.dong.length} dòng, ${r.anh.length} ảnh`, "ok");
      } catch (e) { baoTienDo(""); TT.toast(e.message || String(e), "loi"); TT.buzz(); }
    }
    luu(); veTep(); veBuoc();
  }
  const oTha = $("oTha");
  oTha.onclick = () => $("chonFile").click();
  oTha.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("chonFile").click(); } };
  $("chonFile").onchange = () => { napFile([...$("chonFile").files]); $("chonFile").value = ""; };
  ["dragenter", "dragover"].forEach(k => oTha.addEventListener(k, e => { e.preventDefault(); oTha.classList.add("keo"); }));
  ["dragleave", "drop"].forEach(k => oTha.addEventListener(k, e => { e.preventDefault(); oTha.classList.remove("keo"); }));
  oTha.addEventListener("drop", e => napFile([...e.dataTransfer.files]));
  $("bDanChu").onclick = () => { const t = $("oDanChu").value.trim(); if (!t) return; S.chu = (S.chu ? S.chu + "\n" : "") + t.split(/\r?\n/).map(s => s.trim()).filter(Boolean).join("\n"); S.trangDong = null; $("oDanChu").value = ""; luu(); veTep(); TT.toast("Đã thêm nội dung", "ok"); };

  /* ---------- BƯỚC 2: dàn slide ---------- */
  const nguon = () => ({ dong: S.chu ? S.chu.split("\n") : [], trangDong: S.trangDong, ocr: S.tep.some(t => t.ocr) });
  const khoAnhFile = () => S.anh.filter(a => !a.tao && a.dong != null);
  function datSlides(ds, them) {
    if (them && S.slides.length) S.slides = S.slides.concat(ds.filter(s => s.loai !== "bia")); else { S.slides = ds; S.chon = 0; }
    SS.ganAnh(S.slides, khoAnhFile(), S.tt, taoAnh);
    luu(); veHet();
  }
  $("bTuDan").onclick = () => {
    if (!S.chu.trim()) { TT.toast("Thầy cô nạp file hoặc dán nội dung ở bước 1 trước ạ", "loi"); TT.buzz(); return; }
    const tenFile = S.tep[0] ? S.tep[0].ten.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").trim() : "";
    const ds = SS.tuDan(nguon(), Object.assign({}, S.tt, { tenFile }));
    if (!S.tt.bai) TT.toast("Thầy cô gõ «Tên bài» ở bước 1 để bìa ghi đúng tên bài ạ", "loi");
    datSlides(ds, $("cheDo").value === "them");
    TT.toast(`Đã dàn ${ds.length} slide — mỗi slide đã có ảnh minh hoạ`, "ok"); TT.ting();
    $("b3").scrollIntoView({ behavior: "smooth" });
  };
  $("bLenh").onclick = async () => {
    if (!S.chu.trim() && !S.tt.bai) { TT.toast("Thầy cô nạp nội dung hoặc ghi tên bài trước ạ", "loi"); return; }
    const l = SS.lenhAI(nguon(), S.tt, khoAnhFile(), $("soSlideAI").value);
    try { await navigator.clipboard.writeText(l); TT.toast("Đã chép câu lệnh — dán vào ChatGPT / Gemini / Copilot", "ok"); }
    catch (e) { $("oDanAI").value = l; $("oDanAI").select(); TT.toast("Trình duyệt chặn chép tự động: câu lệnh đang ở ô dưới, bấm Ctrl+C", "loi"); }
  };
  $("bDocAI").onclick = () => {
    const ds = SS.docAI($("oDanAI").value, khoAnhFile());
    if (!ds.length) { $("kqAI").innerHTML = `<span class="do">Không thấy dòng «=== SLIDE | … | …». Thầy cô chép <b>toàn bộ</b> câu trả lời của AI giúp em ạ.</span>`; TT.buzz(); return; }
    datSlides(ds, $("cheDo").value === "them");
    const loi = S.slides.reduce((t, s) => t + CT.kiem(s.noiDung).length + CT.kiem(s.tieuDe).length, 0);
    $("kqAI").innerHTML = `✔ Đọc được <b>${ds.length}</b> slide${loi ? ` · <span class="do">${loi} lỗi công thức — xem ở bước 3</span>` : " · công thức đọc tốt"}`;
    TT.ting(); $("b3").scrollIntoView({ behavior: "smooth" });
  };

  /* ---------- BƯỚC 3: danh sách + sửa ---------- */
  function veDs() {
    $("demSl").textContent = S.slides.length + " slide · " + DAN.trang.length + " trang chiếu";
    if (!S.slides.length) { $("dsSlide").innerHTML = `<div class="mo nho2">Chưa có slide. Làm bước 2, hoặc bấm «＋ Thêm slide».</div>`; return; }
    $("dsSlide").innerHTML = S.slides.map((sl, i) => {
      const tr = trangCua(i), cb = DAN.canhBao.filter(c => c.slide === i + 1 && !c.nhe), loiCT = CT.kiem(sl.noiDung).length + CT.kiem(sl.tieuDe).length;
      return `<button class="the-sl${i === S.chon ? " chon" : ""}" data-i="${i}"><span class="stt">${i + 1}</span><span class="nho">${tr[0] ? BC.htmlTrang(tr[0], 196, urlAnh) : ""}<div class="ten">${esc(LOAI[sl.loai] || "")}${tr.length > 1 ? " · " + tr.length + " trang" : ""} — ${esc((sl.tieuDe || "").replace(/\*\*/g, ""))}</div>${cb.length || loiCT ? `<div class="canh">⚠ ${esc([...cb.map(c => c.loi), loiCT ? "lỗi công thức" : ""].filter(Boolean).join("; "))}</div>` : ""}</span></button>`;
    }).join("");
  }
  $("dsSlide").onclick = e => { const b = e.target.closest(".the-sl"); if (!b) return; S.chon = +b.dataset.i; luu(); veDs(); veSua(); };
  function veSua() {
    const sl = S.slides[S.chon];
    if (!sl) { $("soSlide").innerHTML = ""; return; }
    const coPhu = sl.loai === "bia" || sl.loai === "muc";
    $("soSlide").innerHTML = `
      <div class="nut-sl"><b style="align-self:center;margin-right:6px">Slide ${S.chon + 1}/${S.slides.length}</b>
        <button class="nut phu" data-lam="len" title="Đưa lên">⬆</button><button class="nut phu" data-lam="xuong" title="Đưa xuống">⬇</button>
        <button class="nut phu" data-lam="nhan">⧉ Nhân đôi</button><button class="nut phu" data-lam="themSau">＋ Slide sau</button><button class="nut do" data-lam="xoa" style="color:#fff">🗑 Xoá</button></div>
      <div class="sua">
        <div class="luoi" style="gap:8px">
          <div class="hang"><label class="o" style="flex:0 0 190px">Loại slide<select id="sLoai">${Object.entries(LOAI).map(([k, v]) => `<option value="${k}"${k === sl.loai ? " selected" : ""}>${v}</option>`).join("")}</select></label>
            ${sl.loai === "bia" ? `<label class="o">Nhãn trên tên bài<input id="sNhan" value="${esc(sl.nhan || "")}" placeholder="VD: TOÁN 9"></label>` : ""}</div>
          <label class="o">Tiêu đề<input id="sTieuDe" value="${esc(sl.tieuDe || "")}"></label>
          ${coPhu ? `<label class="o">Dòng phụ (mỗi dòng một ý)<textarea id="sPhu" rows="3">${esc(sl.phu || "")}</textarea></label>` : ""}
          <label class="o">${sl.loai === "cau" ? "Câu hỏi + phương án (dòng A. B. C. D.)" : "Nội dung"}<textarea id="sNoiDung" rows="${sl.loai === "bia" ? 3 : 9}">${esc(sl.noiDung || "")}</textarea></label>
          <div id="sLoi"></div>
          <div><b class="nho2">Ảnh minh hoạ (${(sl.anh || []).length}/2)</b>
            <div id="sAnh">${(sl.anh || []).map((id, j) => { const a = S.anh.find(x => x.id === id); return `<span class="chip-a"><img src="${urlAnh(id)}" alt="">${esc(a ? a.ten : "?").slice(0, 28)}<button data-boanh="${j}" title="Bỏ ảnh này">✕</button></span>`; }).join("") || '<span class="do nho2">Chưa có ảnh — mỗi slide cần ít nhất 1 ảnh.</span>'}</div>
            <div class="hang" style="margin-top:6px"><button class="nut cam nho" id="sChonAnh">🖼 ${sl.anh && sl.anh.length ? "Đổi / thêm ảnh" : "Chọn ảnh"}</button><button class="nut phu nho" id="sTranhKhac" title="Vẽ lại tranh tự tạo với màu khác">🎲 Tranh khác màu</button></div></div>
          <label class="o">Ghi chú lời giảng (vào phần Notes, không hiện trên slide)<textarea id="sGhiChu" rows="3">${esc(sl.ghiChu || "")}</textarea></label>
        </div>
        <div class="xem-lon" id="sXem"></div>
      </div>`;
    const giu = (id, k) => { const o = $(id); if (o) o.oninput = () => { sl[k] = o.value; luu(); hen(); }; };
    giu("sTieuDe", "tieuDe"); giu("sPhu", "phu"); giu("sNoiDung", "noiDung"); giu("sGhiChu", "ghiChu"); giu("sNhan", "nhan");
    $("sLoai").onchange = () => { sl.loai = $("sLoai").value; luu(); veHet(); };
    $("sChonAnh").onclick = () => moHop();
    $("sTranhKhac").onclick = () => { const k = (sl.anh || []).findIndex(id => (S.anh.find(a => a.id === id) || {}).tao); if (k < 0) { TT.toast("Slide này chưa có tranh tự tạo", "loi"); return; } const a = S.anh.find(x => x.id === sl.anh[k]); a.tao.bien = (a.tao.bien || 0) + 1; Object.keys(urlCache).forEach(c => { if (c.startsWith(a.id + "|")) delete urlCache[c]; }); luu(); veHet(); };
    $("sAnh").onclick = e => { const b = e.target.closest("[data-boanh]"); if (!b) return; sl.anh.splice(+b.dataset.boanh, 1); luu(); veHet(); };
    veXemSua();
  }
  function veXemSua() {
    const sl = S.slides[S.chon]; if (!sl || !$("sXem")) return;
    const loi = [...CT.kiem(sl.tieuDe), ...CT.kiem(sl.noiDung), ...CT.kiem(sl.phu)];
    $("sLoi").innerHTML = loi.length ? `<div class="loi-ct">⚠ Công thức: ${loi.map(esc).join(" · ")}</div>` : "";
    const rong = Math.max(300, Math.min(620, $("sXem").clientWidth || 560));
    const tr = trangCua(S.chon), cb = DAN.canhBao.filter(c => c.slide === S.chon + 1);
    $("sXem").innerHTML = tr.map((t, k) => `<div class="mo nho2">${tr.length > 1 ? `Trang ${k + 1}/${tr.length}` : "Xem trước (đúng như file PowerPoint)"}</div>` + BC.htmlTrang(t, rong, urlAnh)).join("") + cb.map(c => `<div class="kiem ${c.nhe ? "nhe" : "loi"}">${c.nhe ? "ℹ" : "⚠"} ${esc(c.loi)}</div>`).join("");
  }
  let henT = null;
  const hen = () => { clearTimeout(henT); henT = setTimeout(() => { dan(); veDs(); veXemSua(); veXem(); veBuoc(); }, 250); };
  $("soSlide").addEventListener("click", e => {
    const b = e.target.closest("[data-lam]"); if (!b) return;
    const i = S.chon, ds = S.slides;
    if (b.dataset.lam === "len" && i > 0) { [ds[i - 1], ds[i]] = [ds[i], ds[i - 1]]; S.chon--; }
    else if (b.dataset.lam === "xuong" && i < ds.length - 1) { [ds[i + 1], ds[i]] = [ds[i], ds[i + 1]]; S.chon++; }
    else if (b.dataset.lam === "nhan") { ds.splice(i + 1, 0, Object.assign(JSON.parse(JSON.stringify(ds[i])), { id: TT.uid() })); S.chon++; }
    else if (b.dataset.lam === "themSau") themSlide(i + 1);
    else if (b.dataset.lam === "xoa") { if (!confirm("Xoá slide " + (i + 1) + "?")) return; ds.splice(i, 1); S.chon = Math.max(0, Math.min(i, ds.length - 1)); }
    luu(); veHet();
  });
  function themSlide(vt) {
    const sl = { id: TT.uid(), loai: "nd", tieuDe: "Tiêu đề slide mới", noiDung: "- Ý thứ nhất\n- Ý thứ hai", anh: [], ghiChu: "" };
    SS.ganAnh([sl], [], S.tt, taoAnh);
    S.slides.splice(vt, 0, sl); S.chon = vt;
  }
  $("bThemSl").onclick = () => { themSlide(S.slides.length ? S.chon + 1 : 0); luu(); veHet(); };
  $("bAnhTuDong").onclick = () => { const truoc = S.slides.filter(s => !(s.anh || []).length).length; SS.ganAnh(S.slides, khoAnhFile(), S.tt, taoAnh); luu(); veHet(); TT.toast(truoc ? `Đã gắn ảnh cho ${truoc} slide` : "Slide nào cũng đã có ảnh", "ok"); };

  /* ---------- hộp chọn ảnh ---------- */
  let tabHop = "tl", themThu2 = false, pdfChon = "", trangChon = 1, canvasTrang = null;
  function moHop() { $("hopSo").textContent = S.chon + 1; $("hopAnh").classList.add("mo"); veHop(); }
  const dongHop = () => $("hopAnh").classList.remove("mo");
  $("bDongHop").onclick = dongHop;
  $("hopAnh").addEventListener("click", e => { if (e.target === $("hopAnh")) dongHop(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && $("hopAnh").classList.contains("mo")) dongHop(); });
  $("tabAnh").onclick = e => { const b = e.target.closest("[data-t]"); if (!b) return; tabHop = b.dataset.t; veHop(); };
  function ganVaoSlide(id) {
    const sl = S.slides[S.chon]; if (!sl || !id) return;
    sl.anh = sl.anh || [];
    if (themThu2 && sl.anh.length && !sl.anh.includes(id)) sl.anh = [sl.anh[0], id]; else sl.anh = [id];
    luu(); dongHop(); veHet(); TT.toast("Đã gắn ảnh vào slide " + (S.chon + 1), "ok");
  }
  const oThem = () => `<label class="nho2" style="display:flex;gap:6px;align-items:center;margin-bottom:8px"><input type="checkbox" id="hThem2" ${themThu2 ? "checked" : ""} style="width:18px;min-height:0"> Thêm thành <b>ảnh thứ 2</b> (giữ ảnh đang có)</label>`;
  function veHop() {
    document.querySelectorAll("#tabAnh button").forEach(b => b.classList.toggle("chon", b.dataset.t === tabHop));
    const noi = $("tabNoi"), sl = S.slides[S.chon] || {};
    if (tabHop === "tl") {
      const ds = S.anh.filter(a => !a.tao);
      noi.innerHTML = oThem() + (ds.length ? `<div class="kho-anh" id="hDs">${ds.map((a, i) => `<button class="o-a${(sl.anh || []).includes(a.id) ? " chon" : ""}" data-id="${a.id}" title="${esc(a.ten)}"><img src="${urlAnh(a.id)}" alt=""><span>${i + 1}</span></button>`).join("")}</div>` : `<div class="mo">Chưa có ảnh từ tài liệu. Nạp Word/PDF có hình ở bước 1, hoặc dùng tab «Cắt từ trang PDF», «Tải lên», «Tự tạo».</div>`);
    } else if (tabHop === "cat") {
      const pdf = S.tep.filter(t => t.pdf && DN.coPdf(t.pdf));
      if (!pdf.length) { noi.innerHTML = `<div class="mo">Chưa có PDF đang mở. Thầy cô nạp file PDF (SGK, giáo án) ở bước 1 — sau khi tải lại trang cần nạp lại PDF để cắt hình.</div>`; return; }
      if (!pdf.some(t => t.pdf === pdfChon)) { pdfChon = pdf[0].pdf; trangChon = 1; }
      const n = DN.soTrang(pdfChon);
      noi.innerHTML = oThem() + `<div class="hang" style="align-items:center"><label class="o" style="flex:1 1 220px">File PDF<select id="hPdf">${pdf.map(t => `<option ${t.pdf === pdfChon ? "selected" : ""}>${esc(t.pdf)}</option>`).join("")}</select></label><label class="o" style="flex:0 0 120px">Trang (1–${n})<input id="hTrang" type="number" min="1" max="${n}" value="${trangChon}"></label><button class="nut phu nho" id="hCaTrang">📄 Lấy cả trang</button><button class="nut cam nho" id="hCat" disabled>✂️ Lấy vùng đã khoanh</button></div>
        <div class="trang-pdf" id="hDsTrang"></div>
        <div class="mo nho2" style="margin:6px 0">Kéo chuột trên trang để <b>khoanh vùng hình</b> cần lấy.</div>
        <div id="vungCat"><div class="mo">Đang vẽ trang…</div><div id="oCat"></div></div>`;
      $("hPdf").onchange = () => { pdfChon = $("hPdf").value; trangChon = 1; veHop(); };
      $("hTrang").onchange = () => { trangChon = Math.max(1, Math.min(n, +$("hTrang").value || 1)); veTrangLon(); };
      $("hCaTrang").onclick = () => catLay(true);
      $("hCat").onclick = () => catLay(false);
      veDsTrang(n); veTrangLon();
    } else if (tabHop === "tai") {
      noi.innerHTML = oThem() + `<div id="hTai" tabindex="0" style="border:2.5px dashed #fdba74;border-radius:16px;padding:30px;text-align:center;cursor:pointer;background:#fff7ed"><div style="font-size:40px">🖼</div><b>Bấm để chọn ảnh, kéo thả ảnh vào đây, hoặc nhấn Ctrl + V để dán ảnh vừa chụp / chép</b><div class="mo nho2">PNG, JPG… — ảnh chụp trang SGK, ảnh AI vẽ, ảnh thầy cô tự chụp (không có mặt học sinh khi chưa được phép).</div></div><input type="file" id="hTaiF" accept="image/*" multiple hidden>`;
      const o = $("hTai");
      o.onclick = () => $("hTaiF").click();
      $("hTaiF").onchange = () => taiAnh([...$("hTaiF").files]);
      o.ondragover = e => e.preventDefault(); o.ondrop = e => { e.preventDefault(); taiAnh([...e.dataTransfer.files]); };
    } else if (tabHop === "tao") {
      const chu = (sl.tieuDe || "") + " " + (sl.noiDung || "");
      const ham = (chu.match(/y\s*=\s*[^$,;\n]+/) || [""])[0].trim();
      noi.innerHTML = oThem() + `<b>Tranh chủ đề</b> <span class="mo nho2">— đổi màu theo bảng màu đã chọn; app gợi ý: <b>${esc(AT.TEN_TRANH[AT.chonTranh(chu, sl.loai)] || "")}</b></span>
        <div class="kho-anh" id="hTranh" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">${AT.DS_TRANH.map(t => `<button class="o-a" data-tranh="${t}" title="${esc(AT.TEN_TRANH[t])}"><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(AT.tranh(t, bang()))}" alt=""><span>${esc(AT.TEN_TRANH[t])}</span></button>`).join("")}</div>
        <div class="luoi l2" style="margin-top:14px">
          <div><b>Đồ thị hàm số</b><div class="hang" style="margin-top:6px"><label class="o">y =<input id="hHam" value="${esc(ham.replace(/^y\s*=\s*/, ""))}" placeholder="VD: x^2 - 4x + 3 · 2x + 1 · sqrt(x) · 1/x"></label><button class="nut phu nho" id="hVeHam">📈 Vẽ đồ thị</button></div><div id="hXemHam" style="margin-top:6px"></div></div>
          <div><b>Hình học</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${Object.entries(AT.HINH).map(([k, v]) => `<button class="nut phu nho" data-hinh="${k}" style="min-height:34px;padding:4px 10px">${esc(v)}</button>`).join("")}</div></div>
        </div>`;
      const xemHam = () => { const s = AT.doThi($("hHam").value, bang()); $("hXemHam").innerHTML = s ? `<img style="max-width:260px;border:1px solid #e2e8f0;border-radius:10px" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}" alt="">` : `<span class="do nho2">${$("hHam").value ? "Biểu thức chưa vẽ được — dùng x, số, + − * / ^, sqrt(), abs()" : ""}</span>`; };
      $("hHam").oninput = xemHam; xemHam();
      $("hVeHam").onclick = () => { const id = taoAnh({ kieu: "dothi", bt: $("hHam").value.trim() }); if (!id) { TT.toast("Biểu thức chưa vẽ được", "loi"); return; } ganVaoSlide(id); };
    } else if (tabHop === "ai") {
      noi.innerHTML = `<div class="goiy nho2" style="margin-bottom:8px">Muốn ảnh đẹp như thật: chép câu lệnh dưới → dán vào công cụ vẽ ảnh AI (Gemini, Copilot Designer, ChatGPT…) → tải ảnh về → mở tab <b>«Tải lên / dán ảnh»</b> để đưa vào slide. AI hay vẽ sai chữ và số: câu lệnh đã dặn không vẽ chữ.</div>
        <textarea id="hLenhAnh" rows="5">${esc(SS.lenhAnh(sl, S.tt))}</textarea><div class="hang" style="margin-top:6px"><button class="nut" id="hChepAnh">📋 Chép câu lệnh vẽ ảnh</button><button class="nut phu nho" id="hSangTai">⬆ Sang tab tải ảnh lên</button></div>`;
      $("hChepAnh").onclick = async () => { try { await navigator.clipboard.writeText($("hLenhAnh").value); TT.toast("Đã chép câu lệnh vẽ ảnh", "ok"); } catch (e) { $("hLenhAnh").select(); TT.toast("Bấm Ctrl+C để chép", "loi"); } };
      $("hSangTai").onclick = () => { tabHop = "tai"; veHop(); };
    }
    const c2 = $("hThem2"); if (c2) c2.onchange = () => { themThu2 = c2.checked; };
  }
  $("tabNoi").addEventListener("click", e => {
    const a = e.target.closest("[data-id]"); if (a) { ganVaoSlide(a.dataset.id); return; }
    const t = e.target.closest("[data-tranh]"); if (t) { ganVaoSlide(taoAnh({ kieu: "tranh", ten: t.dataset.tranh })); return; }
    const h = e.target.closest("[data-hinh]"); if (h) { ganVaoSlide(taoAnh({ kieu: "hinh", ten: h.dataset.hinh })); return; }
    const p = e.target.closest("[data-trang]"); if (p) { trangChon = +p.dataset.trang; $("hTrang").value = trangChon; veTrangLon(); }
  });
  async function taiAnh(files) {
    let id = null;
    for (const f of files) {
      if (!/^image\//.test(f.type)) continue;
      const a = await DN.chuanAnh(await f.arrayBuffer(), f.type);
      if (!a) { TT.toast("Không đọc được ảnh " + f.name, "loi"); continue; }
      a.ten = f.name || "Ảnh dán"; id = themAnhByte(a, "tai", null);
    }
    if (id) ganVaoSlide(id); else veTep();
  }
  document.addEventListener("paste", e => {
    if (!$("hopAnh").classList.contains("mo")) return;
    const f = [...(e.clipboardData || {}).items || []].filter(i => i.type.startsWith("image/")).map(i => i.getAsFile());
    if (f.length) { e.preventDefault(); taiAnh(f); }
  });
  async function veDsTrang(n) {
    const o = $("hDsTrang"); if (!o) return;
    o.innerHTML = Array.from({ length: n }, (_, i) => `<button data-trang="${i + 1}" class="${i + 1 === trangChon ? "chon" : ""}" title="Trang ${i + 1}"><img alt="Trang ${i + 1}" data-ve="${i + 1}" style="width:80px;height:110px;background:#f1f5f9"><div>${i + 1}</div></button>`).join("");
    const pdf = pdfChon;
    for (let i = 1; i <= n && i <= 60; i++) {
      if (pdf !== pdfChon || !$("hDsTrang")) return;
      try { const c = await DN.veTrang(pdf, i, 160); const im = o.querySelector(`[data-ve="${i}"]`); if (im) { im.src = c.toDataURL("image/jpeg", .7); im.style.width = "auto"; } } catch (e) { return; }
    }
  }
  let keo = null, vung = null;
  async function veTrangLon() {
    const v = $("vungCat"); if (!v) return;
    document.querySelectorAll("#hDsTrang button").forEach(b => b.classList.toggle("chon", +b.dataset.trang === trangChon));
    canvasTrang = await DN.veTrang(pdfChon, trangChon, 900);
    v.innerHTML = ""; v.appendChild(canvasTrang); const o = document.createElement("div"); o.id = "oCat"; v.appendChild(o);
    vung = null; $("hCat").disabled = true;
    const toaDo = e => { const r = canvasTrang.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) }; };
    const ve = () => { if (!vung) { o.style.display = "none"; return; } const r = canvasTrang.getBoundingClientRect(); Object.assign(o.style, { display: "block", left: vung.x * r.width + "px", top: vung.y * r.height + "px", width: vung.w * r.width + "px", height: vung.h * r.height + "px" }); };
    canvasTrang.onpointerdown = e => { e.preventDefault(); canvasTrang.setPointerCapture(e.pointerId); keo = toaDo(e); vung = null; ve(); };
    canvasTrang.onpointermove = e => { if (!keo) return; const p = toaDo(e); vung = { x: Math.min(keo.x, p.x), y: Math.min(keo.y, p.y), w: Math.abs(p.x - keo.x), h: Math.abs(p.y - keo.y) }; ve(); };
    canvasTrang.onpointerup = () => { keo = null; if (vung && (vung.w < 0.03 || vung.h < 0.03)) vung = null; ve(); $("hCat").disabled = !vung; };
  }
  async function catLay(caTrang) {
    const r = caTrang ? { x: 0, y: 0, w: 1, h: 1 } : vung; if (!r) return;
    TT.toast("Đang cắt hình nét cao…");
    const c = await DN.veTrang(pdfChon, trangChon, 2200);
    const x = Math.round(r.x * c.width), y = Math.round(r.y * c.height), w = Math.max(10, Math.round(r.w * c.width)), h = Math.max(10, Math.round(r.h * c.height));
    const o = document.createElement("canvas"); o.width = w; o.height = h; const g = o.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.drawImage(c, x, y, w, h, 0, 0, w, h);
    const b = await new Promise(ok => o.toBlob(ok, "image/png"));
    const id = themAnhByte({ data: new Uint8Array(await b.arrayBuffer()), ext: "png", w, h, url: o.toDataURL("image/png"), ten: `${pdfChon} – trang ${trangChon}${caTrang ? "" : " (cắt)"}` }, "cat", null);
    ganVaoSlide(id);
  }

  /* ---------- BƯỚC 4: màu, soát, xuất ---------- */
  $("dsMau").innerHTML = Object.entries(BC.BANG_MAU).map(([k, m]) => `<button data-mau="${k}"><i style="background:linear-gradient(135deg,#${m.c1},#${m.c2})"></i>${esc(m.ten)}</button>`).join("");
  $("dsMau").onclick = e => { const b = e.target.closest("[data-mau]"); if (!b) return; S.tc.mau = b.dataset.mau; luu(); veHet(); };
  ["coChu", "hieuUng", "coGhiChu"].forEach(id => { const k = { coChu: "co", hieuUng: "hieuUng", coGhiChu: "ghiChu" }[id]; $(id).value = String(S.tc[k]); $(id).onchange = () => { S.tc[k] = +$(id).value; luu(); veHet(); }; });
  function kiemTra() {
    const ra = [];
    ra.push({ ok: true, s: "Mọi chữ dùng phông <b>Times New Roman</b>" });
    let coMin = 99; DAN.trang.forEach(t => t.khoi.forEach(k => (k.doan || []).forEach(d => { if (d.s && d.sz < coMin) coMin = d.sz; })));
    ra.push(coMin >= 24 || coMin === 99 ? { ok: true, s: `Cỡ chữ nhỏ nhất trên slide: <b>${coMin === 99 ? "—" : coMin}</b> (≥ 24)` } : { loi: true, s: `Có chữ cỡ ${coMin} &lt; 24` });
    const thieu = S.slides.map((s, i) => (s.anh || []).filter(id => kho()[id]).length ? 0 : i + 1).filter(Boolean);
    ra.push(thieu.length ? { loi: true, s: `Slide ${thieu.join(", ")} chưa có ảnh minh hoạ`, nut: "anh" } : { ok: true, s: `Mỗi slide đều có ảnh minh hoạ (${S.slides.length}/${S.slides.length})` });
    const loiCT = []; S.slides.forEach((s, i) => { const l = [...CT.kiem(s.tieuDe), ...CT.kiem(s.noiDung), ...CT.kiem(s.phu)]; if (l.length) loiCT.push(`slide ${i + 1}: ${l[0]}`); });
    let nCT = 0, nKho = 0; S.slides.forEach(s => [s.tieuDe, s.noiDung, s.phu].forEach(x => String(x || "").split("**").forEach(m => CT.tach(m).forEach(p => { if (p.t === "ct") { nCT++; if (!PX.congThucDon(p.src)) nKho++; } }))));
    ra.push(loiCT.length ? { loi: true, s: "Lỗi công thức — " + loiCT.map(esc).join("; ") } : { ok: true, s: nCT ? `${nCT} công thức đọc tốt (${nKho} thành Equation, ${nCT - nKho} in chữ Times New Roman)` : "Không có công thức" });
    DAN.canhBao.filter(c => !/ảnh/.test(c.loi)).forEach(c => ra.push(c.nhe ? { nhe: true, s: `Slide ${c.slide}: ${esc(c.loi)}` } : { loi: true, s: `Slide ${c.slide}: ${esc(c.loi)}` }));
    return ra;
  }
  function veXem() {
    const ra = kiemTra();
    $("dsKiem").innerHTML = ra.map(k => `<div class="kiem ${k.ok ? "ok" : k.loi ? "loi" : "nhe"}">${k.ok ? "✔" : k.loi ? "✖" : "ℹ"} <span>${k.s}${k.nut === "anh" ? ' <button class="nut phu nho" id="kAnh" style="min-height:28px;padding:2px 8px">🪄 Tự gắn</button>' : ""}</span></div>`).join("");
    const kA = $("kAnh"); if (kA) kA.onclick = () => $("bAnhTuDong").click();
    document.querySelectorAll("#dsMau button").forEach(b => b.classList.toggle("chon", b.dataset.mau === S.tc.mau));
    const rong = Math.max(280, Math.min(380, ($("luoiXem").clientWidth - 24) / 2 || 300));
    $("luoiXem").innerHTML = DAN.trang.length ? DAN.trang.map((t, i) => `<div class="o">${BC.htmlTrang(t, rong, urlAnh)}<span>Trang ${i + 1} · slide ${t.goc + 1}</span></div>`).join("") : `<div class="mo">Chưa có slide.</div>`;
  }
  function veBuoc() {
    const a = document.querySelectorAll("#thanhBuoc a");
    const ra = kiemTra();
    a[0].classList.toggle("xong", !!S.chu.trim());
    a[1].classList.toggle("xong", S.slides.length > 0);
    a[2].classList.toggle("xong", S.slides.length > 0 && !ra.some(k => k.loi));
    a[3].classList.toggle("xong", !!S.daXuat);
  }
  function veHet() { dan(); veTep(); veDs(); veSua(); veXem(); veBuoc(); }

  async function xuat() {
    if (!S.slides.length) { TT.toast("Chưa có slide — làm bước 2 trước ạ", "loi"); TT.buzz(); return; }
    dan();
    const loi = kiemTra().filter(k => k.loi);
    if (loi.length && !confirm("Máy soát còn " + loi.length + " mục cần sửa:\n- " + loi.map(k => k.s.replace(/<[^>]+>/g, "")).join("\n- ") + "\n\nVẫn tải PowerPoint?")) return;
    TT.toast("Đang dựng PowerPoint…");
    try {
      const dung = new Set(); DAN.trang.forEach(t => t.khoi.forEach(k => { if (k.loai === "anh") dung.add(k.anh); }));
      const anh = {};
      for (const id of dung) {
        const a = S.anh.find(x => x.id === id); if (!a) continue;
        if (a.tao) { const p = await AT.png(svgCua(a), 1200); anh[id] = { data: p.data, ext: p.ext }; }
        else if (BYTE[id]) anh[id] = { data: BYTE[id].data, ext: BYTE[id].ext };
      }
      const slides = DAN.trang.map((t, i) => Object.assign({}, t, { hieuUng: !!S.tc.hieuUng, ghiChu: S.tc.ghiChu ? (i === 0 ? "✅ BẢN NHÁP — thầy/cô duyệt trước khi dùng." + (t.ghiChu ? "\n" + t.ghiChu : "") : t.ghiChu) : "" }));
      // số công thức Equation phải đúng số đã soạn
      let canCo = 0; slides.forEach(t => t.khoi.forEach(k => (k.doan || []).forEach(d => String(d.s || "").split("**").forEach(m => CT.tach(m).forEach(p => { if (p.t === "ct" && !PX.congThucDon(p.src)) canCo++; })))));
      const r = await PX.taoPptx({ ten: S.tt.bai || "Bài giảng", tacGia: S.tt.gv || "", slides, anh });
      if (r.soCT !== canCo) throw new Error(`Kiểm công thức lệch (${r.soCT}/${canCo}) — em dừng để tránh file lỗi.`);
      const ten = ("PPT - " + (S.tt.bai || "bai giang")).replace(/[\\/:*?"<>|$]/g, "").replace(/\s+/g, " ").slice(0, 90) + ".pptx";
      const url = URL.createObjectURL(r.tep), a = document.createElement("a"); a.href = url; a.download = ten; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
      S.daXuat = true; luu(); veBuoc();
      TT.toast(`Đã tải ${ten}: ${r.soSlide} slide, ${r.soCT} công thức Equation`, "ok"); TT.ting(); TT.phaoGiay();
    } catch (e) { console.error(e); TT.toast("Lỗi khi dựng file: " + (e.message || e), "loi"); TT.buzz(); }
  }
  $("bXuat").onclick = xuat; $("bXuat2").onclick = xuat;

  /* ---------- sao lưu (kèm ảnh) ---------- */
  $("bSaoLuu").onclick = async () => {
    const anh = {}; for (const a of S.anh) if (!a.tao && BYTE[a.id]) anh[a.id] = { url: BYTE[a.id].url, ext: BYTE[a.id].ext };
    TT.taiVe("soan-ppt-" + TT.homNay() + ".json", JSON.stringify({ ung_dung: "to-truong-so", ngay: TT.homNay(), du_lieu: { [KHOA]: S }, anh_ppt: anh }), "application/json");
    TT.toast("Đã tải file sao lưu (kèm ảnh)", "ok");
  };
  $("bNhap").onclick = () => {
    const i = document.createElement("input"); i.type = "file"; i.accept = ".json,application/json";
    i.onchange = async () => {
      try {
        const g = JSON.parse(await i.files[0].text());
        if (!g || g.ung_dung !== "to-truong-so" || !g.du_lieu || !g.du_lieu[KHOA]) throw 0;
        S = Object.assign(moi(), g.du_lieu[KHOA]);
        for (const [id, v] of Object.entries(g.anh_ppt || {})) { const b = Uint8Array.from(atob(v.url.split(",")[1]), c => c.charCodeAt(0)); BYTE[id] = { data: b, ext: v.ext, url: v.url }; IDB.dat(id, BYTE[id]); }
        TT.save(KHOA, S); napTT(); veHet(); TT.toast("Đã nhập lại bài", "ok"); TT.ting();
      } catch (e) { TT.toast("File này không phải file sao lưu của app soạn PowerPoint", "loi"); TT.buzz(); }
    };
    i.click();
  };
  const napTT = () => document.querySelectorAll("[data-tt]").forEach(o => { o.value = S.tt[o.dataset.tt] || ""; });
  $("bMoi").onclick = () => { if (S.slides.length && !confirm("Bắt đầu bài mới? Slide đang soạn sẽ bị xoá (nên Sao lưu trước).")) return; S.anh.forEach(a => { if (!a.tao) IDB.xoa(a.id); }); S = moi(); luu(); napTT(); veHet(); };
  function napMau(k) {
    const m = MAU_PPT[k]; S = moi(); S.tt = Object.assign({}, m.tt); S.chu = m.chu;
    S.tep = [{ ten: "Giáo án thử (" + m.tt.mon + " " + m.tt.lop + ")", kieu: "chữ", soDong: m.chu.split("\n").length, soAnh: 0, ghi: "Dữ liệu thử do trợ lý viết, không chép SGK." }];
    S.slides = SS.tuDan({ dong: S.chu.split("\n") }, S.tt); SS.ganAnh(S.slides, [], S.tt, taoAnh);
    if (k === "khtn") S.tc.mau = "la";
    napTT(); luu(); veHet();
  }
  $("bMauToan").onclick = () => { if (S.slides.length && !confirm("Thay bài đang soạn bằng bài thử Toán?")) return; napMau("toan"); };
  $("bMauKhtn").onclick = () => { if (S.slides.length && !confirm("Thay bài đang soạn bằng bài thử KHTN?")) return; napMau("khtn"); };

  /* ---------- mở đầu ---------- */
  (async () => {
    if (TT.MAU) { const m = location.hash.match(/mau=(\w+)/); napMau(m && MAU_PPT[m[1]] ? m[1] : "toan"); const c = location.hash.match(/chon=(\d+)/); if (c) { S.chon = +c[1] - 1; veHet(); } }
    else {
      for (const a of S.anh) if (!a.tao) { const v = await IDB.lay(a.id); if (v) BYTE[a.id] = v; }
      veHet();
    }
    window.addEventListener("resize", () => { clearTimeout(henT); henT = setTimeout(() => { veXemSua(); veXem(); }, 200); });
  })();
})();
