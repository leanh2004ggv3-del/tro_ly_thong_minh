/* Giao diện app Soạn đề — vẽ lại từng phần, giữ con trỏ khi gõ. */
function giuFocus(fn) {
  const a = document.activeElement, id = a && a.dataset ? a.dataset.f : null;
  let ss = null, se = null; try { ss = a.selectionStart; se = a.selectionEnd; } catch (e) {}
  fn();
  if (id) { const b = document.querySelector(`[data-f="${CSS.escape(id)}"]`); if (b) { b.focus(); try { if (ss != null) b.setSelectionRange(ss, se); } catch (e) {} } }
}
const ICON = {
  NLC: '<svg viewBox="0 0 40 40" width="34" height="34"><rect x="3" y="3" width="34" height="34" rx="9" fill="#6366f1"/><circle cx="12" cy="13" r="3.2" fill="#fff"/><circle cx="12" cy="27" r="3.2" fill="none" stroke="#fff" stroke-width="2"/><rect x="18" y="11" width="13" height="4" rx="2" fill="#fff"/><rect x="18" y="25" width="13" height="4" rx="2" fill="#c7d2fe"/></svg>',
  DS: '<svg viewBox="0 0 40 40" width="34" height="34"><rect x="3" y="3" width="34" height="34" rx="9" fill="#0d9488"/><path d="M9 14l3 3 6-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M10 24l7 7M17 24l-7 7" stroke="#fde68a" stroke-width="3" stroke-linecap="round"/><rect x="22" y="12" width="10" height="3" rx="1.5" fill="#fff"/><rect x="22" y="26" width="10" height="3" rx="1.5" fill="#fff"/></svg>',
  TLN: '<svg viewBox="0 0 40 40" width="34" height="34"><rect x="3" y="3" width="34" height="34" rx="9" fill="#f59e0b"/><rect x="8" y="14" width="24" height="12" rx="3" fill="#fff"/><text x="20" y="24" text-anchor="middle" font-size="10" font-weight="800" fill="#b45309" font-family="Segoe UI,Arial">12,5</text></svg>',
  TL: '<svg viewBox="0 0 40 40" width="34" height="34"><rect x="3" y="3" width="34" height="34" rx="9" fill="#ec4899"/><rect x="9" y="10" width="22" height="3" rx="1.5" fill="#fff"/><rect x="9" y="17" width="22" height="3" rx="1.5" fill="#fff"/><rect x="9" y="24" width="14" height="3" rx="1.5" fill="#fff"/><path d="M26 31l7-9 2 2-7 9h-2z" fill="#fde68a"/></svg>'
};
const MUC_CHIP = m => `<span class="chipm m${m}">${TENM[m]}</span>`;

/* ---------- bước 1 ---------- */
function veB1() {
  document.querySelectorAll("[data-tt]").forEach(i => { const k = i.dataset.tt; if (document.activeElement !== i) i.value = S.tt[k] == null ? "" : S.tt[k]; });
}
/* ---------- bước 2 ---------- */
function veB2() {
  const h = $("dsCd");
  $("soCd").textContent = S.cd.length;
  if (!S.cd.length) { h.innerHTML = `<div class="trong"><svg width="90" height="70" viewBox="0 0 90 70"><rect x="14" y="8" width="46" height="56" rx="6" fill="#e0e7ff"/><rect x="22" y="18" width="30" height="4" rx="2" fill="#a5b4fc"/><rect x="22" y="28" width="24" height="4" rx="2" fill="#a5b4fc"/><rect x="22" y="38" width="28" height="4" rx="2" fill="#a5b4fc"/><circle cx="66" cy="48" r="14" fill="#6366f1"/><path d="M66 41v14M59 48h14" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg><div>Chưa có bài nào. Kéo thả file giáo án, SGK vào ô bên trái, hoặc bấm <b>＋ Thêm chủ đề</b>.</div></div>`; return; }
  const tt = tong(S.cd.map(c => so(c.tiet)));
  h.innerHTML = S.cd.map((c, i) => {
    const nYc = MUC.filter(m => c.yc && String(c.yc[m] || "").trim()).length;
    return `<div class="cd hien" style="--m:${["#6366f1", "#0d9488", "#f59e0b", "#ec4899", "#8b5cf6", "#0ea5e9"][i % 6]}">
      <div class="cd-dau"><span class="cd-so">${i + 1}</span>
        <input data-f="cc-${c.id}" data-id="${c.id}" data-k="chuong" value="${esc(c.chuong)}" placeholder="Chủ đề/Chương (để trống nếu không có)" class="cd-ch">
        <input data-f="ct-${c.id}" data-id="${c.id}" data-k="ten" value="${esc(c.ten)}" placeholder="Tên bài / nội dung" class="cd-ten">
        <label class="cd-tiet" title="Số tiết theo KH dạy học của tổ">Tiết <input data-f="cti-${c.id}" data-id="${c.id}" data-k="tiet" inputmode="numeric" value="${esc(c.tiet)}" placeholder="?"></label>
        <span class="nhan ${nYc ? "n-dung" : "n-canh"}" title="Yêu cầu cần đạt đã có">${nYc}/3 YCCĐ</span>
        <span class="nhan n-tt" title="Số chữ nội dung đã nạp">${((c.text || "").length / 1000).toFixed(1).replace(".", ",")}k chữ</span>
        ${tt ? `<span class="thanh" title="Tỉ lệ thời lượng"><i style="width:${so(c.tiet) / tt * 100}%"></i></span>` : ""}
        <span class="cd-nut">${i ? `<button class="nut phu nho" data-gop="${c.id}" title="Gộp vào bài phía trên">⤴ Gộp</button>` : ""}<button class="nut phu nho" data-xoa="${c.id}" title="Xoá bài này">🗑</button></span>
      </div>
      <details class="cd-ct"><summary>Yêu cầu cần đạt (app tự nhận theo động từ — thầy cô soát) · nội dung đã nạp</summary>
        <div class="luoi l3" style="margin-top:8px">${MUC.map(m => `<label class="o yc y${m}">${TENM[m]}<textarea data-f="cy${m}-${c.id}" data-id="${c.id}" data-k="yc.${m}" rows="4" placeholder="- ${m === "B" ? "Nêu được…" : m === "H" ? "Giải thích được…" : "Vận dụng được…"}">${esc((c.yc || {})[m] || "")}</textarea></label>`).join("")}</div>
        <label class="o" style="margin-top:8px">Nội dung dùng để ra câu hỏi (có thể xoá bớt phần không kiểm tra)<textarea data-f="cx-${c.id}" data-id="${c.id}" data-k="text" rows="5">${esc(c.text || "")}</textarea></label>
      </details></div>`;
  }).join("");
}
function themCd(ds, nguon) {
  ds.forEach(c => S.cd.push({ id: TT.uid(), chuong: c.chuong || "", ten: c.ten || "Chủ đề " + (S.cd.length + 1), tiet: c.tiet || "", yc: c.yc || { B: "", H: "", V: "" }, text: c.text || "", nguon: nguon || "" }));
  luu(); ve();
}
async function napFile(files) {
  const tt = $("trangThai");
  for (const f of files) {
    tt.innerHTML = `<span class="xoay"></span> Đang đọc <b>${esc(f.name)}</b>…`;
    try {
      const r = await DF.doc(f, (chu, ti) => { if (chu) tt.innerHTML = `<span class="xoay"></span> ${esc(chu)} <b>${Math.round((ti || 0) * 100)}%</b> <span class="mo nho2">— lần đầu cần mạng để tải bộ nhận chữ tiếng Việt</span>`; });
      themCd(r.cd, f.name);
      const nYc = tong(r.cd.map(c => MUC.filter(m => c.yc[m]).length));
      tt.innerHTML = `<div class="ok-dong">✔ ${esc(f.name)} (${r.kieu}): nhận ra <b>${r.cd.length}</b> bài/chủ đề, ${nYc} nhóm yêu cầu cần đạt. Thầy cô nhập <b>số tiết</b> từng bài.</div>` + (r.ct && r.ct.nCT ? `<div class="ok-dong" style="margin-top:6px">∑ Giữ được <b>${r.ct.nCT}</b> công thức Equation (phân số, căn, mũ…) để AI đọc đúng.</div>` : "") + (r.ct && r.ct.nOle ? `<div class="canh" style="margin-top:6px">⚠ File có <b>${r.ct.nOle}</b> công thức MathType/đối tượng nhúng — app không đọc được chữ bên trong. Thầy cô gõ lại công thức quan trọng vào ô «Nội dung» của bài, hoặc trong Word chọn MathType → Convert Equations sang Word Equation rồi nạp lại.</div>` : "") + (r.ocr ? `<div class="canh" style="margin-top:6px">📷 File PDF dạng ảnh: app đã <b>nhận chữ từ ảnh</b> ${r.ocr.soTrang} trang${r.ocr.conLai ? ` (còn ${r.ocr.conLai} trang chưa đọc — tách file nhỏ hơn)` : ""}. Chữ nhận từ ảnh có thể sai chính tả, <b>công thức, số mũ thường bị mất hoặc sai</b>: thầy cô xem lại ô «Nội dung» của từng bài, gõ lại công thức kiểu $…$. Khi chép câu lệnh cho AI, nên <b>đính kèm luôn file PDF</b> để AI đọc trực tiếp trang sách.</div>` : "");
      TT.ting();
    } catch (e) { tt.innerHTML = `<div class="canh">✖ ${esc(f.name)}: ${esc(e.message || e)}</div>`; TT.buzz(); }
  }
}
/* ---------- bước 3 ---------- */
function veDang() {
  $("dsDang").innerHTML = DANG.map(d => {
    const D = S.dang[d], nhan = d === "DS" ? "Điểm mỗi câu (4 ý)" : d === "TL" ? "Điểm mặc định mỗi câu" : "Điểm mỗi câu";
    return `<div class="dang ${D.bat ? "bat" : ""}" style="--m:${MAU_D[d]}">
      <label class="dang-dau"><input type="checkbox" data-dang="${d}" ${D.bat ? "checked" : ""}>${ICON[d]}<span><b>${TEN[d]}</b><small>${{ NLC: "4 phương án A, B, C, D", DS: "câu dẫn + 4 ý a, b, c, d", TLN: "đáp án là một số", TL: "chia ý, có điểm từng ý" }[d]}</small></span></label>
      <div class="hang dang-o"><label class="o">${nhan}<input data-f="dd-${d}" data-dd="${d}" value="${f2(D.d)}" inputmode="decimal"></label>
      ${d === "DS" ? `<label class="o">Cách chấm<select data-cham="1"><option value="764" ${D.cham === "764" ? "selected" : ""}>QĐ 764: 0,1·0,25·0,5·1</option><option value="deu" ${D.cham === "deu" ? "selected" : ""}>Đều nhau từng ý</option></select></label>` : ""}</div>
    </div>`;
  }).join("");
}
function veB3() {
  veDang();
  const P = khe(), t = tinh(P), bat = DANG.filter(d => S.dang[d].bat), h = $("maTran");
  if (!S.cd.length || !bat.length) { h.innerHTML = `<div class="trong">Ma trận hiện ở đây khi đã có bài (bước ②) và bật ít nhất một dạng câu.</div>`; }
  else {
    let s = `<table class="mt"><thead><tr><th rowspan="2" class="tc">Chủ đề / bài</th>${bat.map(d => `<th colspan="3" style="--m:${MAU_D[d]}" class="td">${TEN[d]}${d === "DS" ? " <small>(số ý)</small>" : ""}</th>`).join("")}<th rowspan="2">Điểm</th><th rowspan="2">% điểm / % tiết</th></tr><tr>${bat.map(() => MUC.map(m => `<th class="th${m}">${TENM2[m]}</th>`).join("")).join("")}</tr></thead><tbody>`;
    const tt = tong(S.cd.map(c => so(c.tiet)));
    S.cd.forEach((c, i) => {
      const o = oCua(c.id), p = (t.cd[c.id] || 0), q = tt ? so(c.tiet) / tt * 100 : 0, lech = tt && Math.abs(p * 10 - q) > 10;
      s += `<tr><td class="tc"><b>${i + 1}.</b> ${esc(c.ten)}${c.tiet ? ` <small class="mo">(${esc(c.tiet)} tiết)</small>` : ""}</td>`;
      bat.forEach(d => MUC.forEach(m => { const v = o[d][m] || 0; s += `<td class="o-mt ${v ? "co m" + m : ""}"><input data-f="o-${c.id}-${d}-${m}" data-o="${c.id}|${d}|${m}" value="${v || ""}" inputmode="numeric" aria-label="${esc(c.ten)} ${TEN[d]} ${TENM[m]}"></td>`; }));
      s += `<td class="so"><b>${f2(p)}</b></td><td><div class="ss ${lech ? "lech" : ""}"><span class="a" style="width:${Math.min(100, p * 10)}%"></span><span class="b" style="width:${Math.min(100, q)}%"></span></div><small>${pt(p * 10)}${tt ? " / " + pt(q) : ""}</small></td></tr>`;
    });
    s += `</tbody><tfoot><tr><td>Tổng số câu / ý</td>${bat.map(d => MUC.map(m => `<td>${tong(S.cd.map(c => oCua(c.id)[d][m] || 0)) || ""}</td>`).join("")).join("")}<td rowspan="2" class="so tongd ${Math.abs(t.tong - 10) < .001 ? "dat" : "chua"}">${f2(t.tong)}</td><td rowspan="2"></td></tr>
      <tr><td>Điểm theo dạng</td>${bat.map(d => `<td colspan="3" style="color:${MAU_D[d]}"><b>${f2(t.dang[d])}</b> <small>(${pt(t.dang[d] * 10)})</small></td>`).join("")}</tr></tfoot></table>`;
    h.innerHTML = s;
  }
  $("vanhDang").innerHTML = TT.vanh(bat.map(d => ({ gt: t.dang[d], mau: MAU_D[d] })), 148, 22, f2(t.tong)) + `<div class="chu-giai">${bat.map(d => `<span style="--m:${MAU_D[d]}">${TEN[d]} <b>${f2(t.dang[d])}</b></span>`).join("")}</div>`;
  $("vanhMuc").innerHTML = TT.vanh(MUC.map(m => ({ gt: t.muc[m], mau: MAU_M[m] })), 148, 22, "B·H·VD") + `<div class="chu-giai">${MUC.map(m => `<span style="--m:${MAU_M[m]}">${TENM[m]} <b>${f2(t.muc[m])}</b> <small>/ ${f2(S.muc[m] / 10)}</small></span>`).join("")}</div>`;
  // điểm câu tự luận
  const tl = P.TL;
  $("hopTl").classList.toggle("an", !tl.length);
  $("dsTl").innerHTML = tl.map(s => `<label class="tl-o">Câu ${s.la}.${s.so} ${MUC_CHIP(s.m)} <span class="mo">${esc(s.cd.ten)}</span><input data-f="tl-${s.k}" data-tl="${s.k}" value="${f2(s.diem)}" inputmode="decimal"> điểm</label>`).join("");
  MUC.forEach(m => { const i = $("muc" + m); if (document.activeElement !== i) i.value = S.muc[m]; });
  if (document.activeElement !== $("ghiChu")) $("ghiChu").value = S.ghiChu || "";
}
/* ---------- bước 4 ---------- */
/* xem trước công thức của một câu (chỉ hiện khi câu có công thức hoặc chỉ số) */
function xemCau(q, d) {
  if (!q) return "";
  const o = [q.de, ...(q.pa || []), ...((q.y || []).map(y => y && y.t)), q.da, ...((q.hdc || []).map(h => h && h.nd))].filter(Boolean);
  if (!o.some(x => CT.coCT(x) || /[\^_]/.test(x))) return "";
  const h = CT.htmlChu, dong = [];
  String(q.de || "").split("\n").forEach(x => dong.push(h(x)));
  if (d === "NLC" && q.pa) dong.push(`<span class="xem-pa">${q.pa.map((p, i) => `<span><b>${"ABCD"[i]}.</b> ${h(p)}</span>`).join("")}</span>`);
  if (d === "DS" && q.y) q.y.forEach((y, i) => dong.push(`<b>${"abcd"[i]})</b> ${h(y && y.t)}`));
  if (d === "TLN" && q.da) dong.push(`<b>Đáp án:</b> ${h(q.da)}`);
  if (d === "TL" && q.hdc) q.hdc.forEach(x => x && x.nd && dong.push("– " + h(x.nd)));
  const loi = o.flatMap(x => CT.kiem(x));
  return `<div class="xem-nhan">∑ Xem trước công thức (như trong Word)${loi.length ? ` <span class="do">· ${esc(loi[0])}</span>` : ""}</div>` + dong.map(x => `<div>${x}</div>`).join("");
}
function moiCau(s) {
  if (s.d === "NLC") return { de: "", pa: ["", "", "", ""], dung: null };
  if (s.d === "DS") return { de: "", y: s.ys.map(() => ({ t: "", d: null })) };
  if (s.d === "TLN") return { de: "", da: "" };
  return { de: "", hdc: [{ nd: "", d: "" }] };
}
function veSoan() {
  const P = khe(), h = $("dsCau");
  const tatCa = P.phan.flatMap(d => P[d]), xong = tatCa.filter(daXong).length;
  $("vanhSoan").innerHTML = TT.vanh([{ gt: xong, mau: "#16a34a" }, { gt: tatCa.length - xong, mau: "#e2e8f0" }], 96, 14, xong + "/" + tatCa.length);
  if (!tatCa.length) { h.innerHTML = `<div class="trong">Chưa có câu nào — làm ma trận ở bước ③ trước ạ.</div>`; veDapAn(P); return; }
  const loc = S.loc || "";
  h.innerHTML = P.phan.map(d => `<div class="nhom-cau" style="--m:${MAU_D[d]}"><div class="nhom-dau">${ICON[d]}<b>PHẦN ${P[d][0].la}. ${TEN[d]}</b><span class="nhan n-tt">${P[d].filter(daXong).length}/${P[d].length} câu</span></div>` +
    P[d].filter(s => !loc || (loc === "trong" ? !daXong(s) : true)).map(s => {
      const q = S.cau[s.k] || moiCau(s), ok = daXong(s), k = esc(s.k);
      let b = `<textarea data-f="q-${k}" data-q="${k}" data-x="de" rows="2" placeholder="Câu hỏi / câu dẫn…">${esc(q.de || "")}</textarea>`;
      if (d === "NLC") b += `<div class="pa">${[0, 1, 2, 3].map(i => `<label class="pa-o ${q.dung === i ? "dung" : ""}${q.dung === i && daiNhat(q) ? " dai" : ""}"><input type="radio" name="r-${k}" aria-label="Đáp án đúng ${"ABCD"[i]}" data-q="${k}" data-dung="${i}" ${q.dung === i ? "checked" : ""}><b>${"ABCD"[i]}</b><input data-f="p${i}-${k}" data-q="${k}" data-x="pa.${i}" value="${esc((q.pa || [])[i] || "")}"></label>`).join("")}</div>`;
      if (d === "DS") b += `<div class="ds">${s.ys.map((m, i) => { const y = (q.y || [])[i] || {}; return `<div class="ds-o"><b>${"abcd"[i]})</b>${MUC_CHIP(m)}<input data-f="y${i}-${k}" data-q="${k}" data-x="y.${i}" value="${esc(y.t || "")}"><span class="ds-ds"><button class="${y.d === true ? "chon d" : ""}" data-q="${k}" data-yd="${i}|1">Đúng</button><button class="${y.d === false ? "chon s" : ""}" data-q="${k}" data-yd="${i}|0">Sai</button></span></div>`; }).join("")}</div>`;
      if (d === "TLN") b += `<label class="o tln">Đáp án (một số)<input data-f="da-${k}" data-q="${k}" data-x="da" value="${esc(q.da || "")}" inputmode="decimal" placeholder="VD: 12,5"></label>`;
      if (d === "TL") b += `<div class="hdc"><div class="mo nho2">Hướng dẫn chấm — tổng phải bằng <b>${f2(s.diem)}</b> điểm (đang ${f2(tong((q.hdc || []).map(x => so(x.d))))})</div>${(q.hdc || []).map((x, i) => `<div class="hdc-o"><input data-f="h${i}-${k}" data-q="${k}" data-x="hdc.${i}.nd" value="${esc(x.nd)}" placeholder="Ý cần đạt…"><input class="hdc-d" data-f="hd${i}-${k}" data-q="${k}" data-x="hdc.${i}.d" value="${esc(x.d)}" placeholder="điểm" inputmode="decimal"><button class="nut phu nho" data-q="${k}" data-bohdc="${i}">✕</button></div>`).join("")}<button class="nut phu nho" data-q="${k}" data-themhdc="1">＋ Thêm ý chấm</button></div>`;
      return `<div class="cau-o ${ok ? "xong" : ""}" id="c-${k}"><div class="cau-dau"><span class="cau-so">${s.la}.${s.so}</span>${d === "DS" ? [...new Set(s.ys)].map(MUC_CHIP).join("") : MUC_CHIP(s.m)}<span class="mo nho2">${esc(s.cd.ten)}${d === "TL" ? " · " + f2(s.diem) + " điểm" : ""}</span><span class="canh-dai"${d === "NLC" && daiNhat(q) ? "" : " hidden"} title="Học sinh dễ đoán đáp án đúng vì nó dài nhất">⚠ đáp án đúng dài nhất</span><span class="cau-tt">${ok ? "✔ đủ" : "… chưa đủ"}</span><button class="nut phu nho" data-q="${k}" data-xoacau="1" title="Xoá nội dung câu">🧹</button></div>${b}<div class="xem-ct" data-xem="${k}">${xemCau(S.cau[s.k], d)}</div></div>`;
    }).join("") + "</div>").join("");
  veDapAn(P);
}
function veDapAn(P) {
  const da = P.NLC.map(s => S.cau[s.k]).filter(q => q && q.dung != null).map(q => q.dung);
  $("dayDa").innerHTML = da.length ? da.map((x, i) => `<span class="o-da" style="--m:${["#6366f1", "#0d9488", "#f59e0b", "#ec4899"][x]}" title="Câu ${i + 1}">${"ABCD"[x]}</span>`).join("") : `<span class="mo nho2">Chưa có đáp án phần nhiều lựa chọn.</span>`;
  const cv = $("bdDa");
  if (cv.offsetParent) TT.bieuDoCot(cv, ["A", "B", "C", "D"], [{ ten: "Số câu", mau: "#6366f1", mau2: "#a5b4fc", gt: [0, 1, 2, 3].map(i => da.filter(x => x === i).length) }], { max: Math.max(3, Math.ceil(da.length / 4) + 1) });
}
function veKiem() {
  const P = khe(), t = tinh(P), kq = soat(P, t);
  const nLoi = kq.filter(x => x.m === "loi").length, nCanh = kq.filter(x => x.m === "canh").length;
  $("dsKiem").innerHTML = kq.map(x => `<div class="kq ${x.m}"><span>${x.m === "ok" ? "✔" : x.m === "canh" ? "⚠" : "✖"}</span>${esc(x.t)}</div>`).join("");
  $("tomKiem").innerHTML = nLoi ? `<span class="nhan n-sai">${nLoi} lỗi</span>` : nCanh ? `<span class="nhan n-canh">${nCanh} cần xem</span>` : `<span class="nhan n-dung">Sạch</span>`;
  $("dsKiem2").innerHTML = $("dsKiem").innerHTML;
  return { nLoi, nCanh };
}
/* ---------- nhiều đề ---------- */
const xuatChon = new Set();
function tienDoDe(i) { return voiDe(i, () => { const P = khe(), tat = P.phan.flatMap(d => P[d]); return { xong: tat.filter(daXong).length, tong: tat.length }; }); }
function veDe() {
  const n = S.bo.length;
  if (document.activeElement !== $("soDe")) $("soDe").value = n;
  $("soDeIcon").textContent = n;
  $("dsMaDe").innerHTML = S.bo.map((b, i) => `<label>Đề ${i + 1} · mã đề <input data-f="ma-${i}" data-ma="${i}" value="${esc(b.ma)}" placeholder="${n > 1 ? "VD: " + (101 + i) : "(nếu có)"}"></label>`).join("");
  const nut = S.bo.map((b, i) => { const p = tienDoDe(i), du = p.tong && p.xong === p.tong; return `<button data-de="${i}" class="${i === S.deHien ? "chon" : ""}${du ? " du" : ""}">${du ? "✔ " : ""}${esc(tenDe(i))}<small>${p.xong}/${p.tong} câu</small><i><b style="width:${p.tong ? p.xong / p.tong * 100 : 0}%"></b></i></button>`; }).join("");
  $("chonDe4").innerHTML = n > 1 ? `<span class="nho2 mo" style="align-self:center">Đang soạn:</span>` + nut : "";
  $("chonDe5").innerHTML = n > 1 ? `<span class="nho2 mo" style="align-self:center">Xem trước:</span>` + nut : "";
  for (const i of [...xuatChon]) if (i >= n) xuatChon.delete(i);
  $("hopXuatDe").classList.toggle("an", n < 2);
  $("xuatDe").innerHTML = S.bo.map((b, i) => `<label class="tl-o"><input type="checkbox" data-xd="${i}" ${xuatChon.has(i) ? "checked" : ""} style="width:18px;min-height:0"> 📄 ${esc(tenDe(i))} + hướng dẫn chấm</label>`).join("");
}
function datSoDe(n) {
  n = Math.max(1, Math.min(10, n | 0));
  if (n < S.bo.length) {
    const bo = S.bo.slice(n).filter(b => Object.keys(b.cau).length);
    if (bo.length && !confirm(`Bớt còn ${n} đề sẽ xoá câu hỏi đã soạn của ${S.bo.length - n} đề cuối. Tiếp tục?`)) { veDe(); return; }
    S.bo.length = n;
  }
  while (S.bo.length < n) { const tr = S.bo[S.bo.length - 1].ma, so = /^\d+$/.test(tr) ? String(+tr + 1) : ""; S.bo.push({ ma: so, cau: {} }); xuatChon.add(S.bo.length - 1); }
  if (S.deHien >= n) S.deHien = n - 1;
  luu(); ve(); TT.ting();
}
/* ---------- bước 5 ---------- */
let tabXem = "de";
function chonPhan() { const c = {}; document.querySelectorAll("[data-p]").forEach(i => c[i.dataset.p] = i.checked); return c; }
function veXem() {
  clearTimeout(veXem.t);
  veXem.t = setTimeout(() => {
    document.querySelectorAll("#tabXem button").forEach(b => b.classList.toggle("chon", b.dataset.tab === tabXem));
    const c = { mt: false, dt: false, de: false, hd: false }; c[tabXem] = true;
    const ph = dungPhan(c);
    const a4 = $("a4");
    a4.innerHTML = ph.length ? ph.map(DX.xemHtml).join("") : `<div class="trong">Chưa có gì để xem — làm ma trận ở bước ③.</div>`;
    a4.querySelectorAll(".trang").forEach(tr => { tr.style.zoom = ""; const k = (a4.clientWidth - 34) / tr.offsetWidth; if (k > 0 && k < 1) tr.style.zoom = k.toFixed(3); });
  }, 120);
}
function veBuoc() {
  const P = khe(), t = tinh(P), tat = P.phan.flatMap(d => P[d]);
  const tr = [!!(S.tt.mon && S.tt.lop), S.cd.length > 0, tat.length > 0 && Math.abs(t.tong - 10) < .001, tat.length > 0 && S.bo.every((b, i) => { const p = tienDoDe(i); return p.tong && p.xong === p.tong; }), !!S.daXuat];
  document.querySelectorAll("#thanhBuoc a").forEach((a, i) => { a.classList.toggle("xong", tr[i]); });
  $("tienDo").style.width = (tr.filter(Boolean).length / 5 * 100) + "%";
}
function ve() { veB1(); veB2(); veB3(); veDe(); veSoan(); veKiem(); veXem(); veBuoc(); }

/* ---------- gắn sự kiện ---------- */
function datGiaTri(q, duong, v) {
  const p = duong.split("."); let o = q;
  if (p[0] === "y") { q.y = q.y || []; const i = +p[1]; q.y[i] = q.y[i] && typeof q.y[i] === "object" ? q.y[i] : { t: "", d: null }; q.y[i].t = v; return; }
  for (let i = 0; i < p.length - 1; i++) { const k = /^\d+$/.test(p[i]) ? +p[i] : p[i]; if (o[k] == null) o[k] = /^\d+$/.test(p[i + 1]) ? [] : {}; o = o[k]; }
  const cuoi = /^\d+$/.test(p[p.length - 1]) ? +p[p.length - 1] : p[p.length - 1];
  if (typeof o[cuoi] === "object" && o[cuoi] && "t" in o[cuoi]) o[cuoi].t = v; else o[cuoi] = v;
}
function timKhe(k) { const P = khe(); return P.phan.flatMap(d => P[d]).find(s => s.k === k); }
function layCau(k) { if (!S.cau[k]) { const s = timKhe(k); S.cau[k] = s ? moiCau(s) : {}; } return S.cau[k]; }
function capNhat() { luu(); veKiem(); veBuoc(); veXem(); clearTimeout(capNhat.t); capNhat.t = setTimeout(() => giuFocus(veDe), 400); }

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-tt]").forEach(i => i.addEventListener("input", () => { S.tt[i.dataset.tt] = i.dataset.tt === "phut" ? (+i.value || i.value) : i.value; capNhat(); }));
  // bước 2
  const tha = $("oTha"), chon = $("chonFile");
  tha.addEventListener("click", () => chon.click());
  tha.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chon.click(); } });
  ["dragenter", "dragover"].forEach(k => tha.addEventListener(k, e => { e.preventDefault(); tha.classList.add("keo"); }));
  ["dragleave", "drop"].forEach(k => tha.addEventListener(k, e => { e.preventDefault(); tha.classList.remove("keo"); }));
  tha.addEventListener("drop", e => napFile([...e.dataTransfer.files]));
  chon.addEventListener("change", () => { napFile([...chon.files]); chon.value = ""; });
  $("bDanChu").addEventListener("click", () => {
    const v = $("oDanChu").value.trim(); if (!v) { TT.toast("Thầy cô dán nội dung vào ô trước ạ", "loi"); return; }
    const ds = DF.tach(v.split(/\r?\n/).map(DF.gon).filter(Boolean), "Nội dung dán vào");
    themCd(ds, "dán chữ"); $("oDanChu").value = ""; TT.ting(); TT.toast(`Đã thêm ${ds.length} bài/chủ đề`, "ok");
  });
  $("bThemCd").addEventListener("click", () => { themCd([{ ten: "" }], "gõ tay"); setTimeout(() => { const i = document.querySelector(`[data-f="ct-${S.cd[S.cd.length - 1].id}"]`); i && i.focus(); }, 30); });
  $("dsCd").addEventListener("input", e => {
    const i = e.target, c = S.cd.find(x => x.id === i.dataset.id); if (!c) return;
    const k = i.dataset.k; if (k.startsWith("yc.")) { c.yc = c.yc || {}; c.yc[k.slice(3)] = i.value; } else c[k] = i.value;
    luu(); if (k === "tiet" || k === "ten") giuFocus(() => { veB3(); veSoan(); }); veKiem(); veBuoc(); veXem();
  });
  $("dsCd").addEventListener("change", e => { if (e.target.dataset.k === "tiet" || e.target.dataset.k === "ten") giuFocus(veB2); });
  $("dsCd").addEventListener("click", e => {
    const g = e.target.closest("[data-gop]"), x = e.target.closest("[data-xoa]");
    if (g) { const i = S.cd.findIndex(c => c.id === g.dataset.gop); if (i > 0) { const a = S.cd[i - 1], b = S.cd[i]; a.text = (a.text ? a.text + "\n" : "") + b.ten + "\n" + (b.text || ""); MUC.forEach(m => a.yc[m] = [a.yc[m], b.yc[m]].filter(Boolean).join("\n")); a.tiet = so(a.tiet) + so(b.tiet) || a.tiet; S.cd.splice(i, 1); delete S.o[b.id]; luu(); ve(); TT.toast("Đã gộp vào bài phía trên", "ok"); } }
    if (x) { const c = S.cd.find(c => c.id === x.dataset.xoa); if (c && confirm(`Xoá «${c.ten || "bài này"}» khỏi đề?`)) { S.cd = S.cd.filter(z => z !== c); delete S.o[c.id]; luu(); ve(); } }
  });
  // bước 3
  $("dsDang").addEventListener("change", e => {
    const i = e.target;
    if (i.dataset.dang) { S.dang[i.dataset.dang].bat = i.checked; if (i.dataset.dang === "TLN" && !i.checked) TT.toast("Tắt trả lời ngắn: bấm «Chia theo khung» để chuyển điểm sang Đúng – Sai", ""); }
    if (i.dataset.cham) S.dang.DS.cham = i.value;
    if (i.dataset.dd) { const v = so(i.value); if (v > 0) S.dang[i.dataset.dd].d = v; }
    luu(); giuFocus(() => { veB3(); veSoan(); }); veKiem(); veBuoc(); veXem();
  });
  $("bKhung").addEventListener("click", apKhung);
  $("maTran").addEventListener("input", e => {
    const i = e.target; if (!i.dataset.o) return;
    const [id, d, m] = i.dataset.o.split("|"), v = Math.max(0, Math.min(60, parseInt(i.value, 10) || 0));
    oCua(id)[d][m] = v; luu(); giuFocus(() => { veB3(); veSoan(); }); veKiem(); veBuoc(); veXem();
  });
  $("maTran").addEventListener("keydown", e => {   // mũi tên di chuyển giữa các ô
    const i = e.target; if (!i.dataset.o || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) return;
    const tat = [...$("maTran").querySelectorAll("input[data-o]")], td = i.closest("td"), tr = td.parentNode, cot = [...tr.children].indexOf(td);
    let dich = null;
    if (e.key === "ArrowLeft") dich = tat[tat.indexOf(i) - 1]; else if (e.key === "ArrowRight") dich = tat[tat.indexOf(i) + 1];
    else { const hang = e.key === "ArrowUp" ? tr.previousElementSibling : tr.nextElementSibling; dich = hang && hang.children[cot] && hang.children[cot].querySelector("input"); }
    if (dich) { e.preventDefault(); dich.focus(); dich.select(); }
  });
  $("dsTl").addEventListener("input", e => { const i = e.target; if (!i.dataset.tl) return; S.tlDiem[i.dataset.tl] = so(i.value); luu(); giuFocus(() => { veB3(); veSoan(); }); veKiem(); veBuoc(); veXem(); });
  MUC.forEach(m => $("muc" + m).addEventListener("input", () => { S.muc[m] = so($("muc" + m).value); luu(); giuFocus(veB3); veKiem(); }));
  $("ghiChu").addEventListener("input", () => { S.ghiChu = $("ghiChu").value; capNhat(); });
  // nhiều đề
  S.bo.forEach((b, i) => xuatChon.add(i));
  $("bDeTru").addEventListener("click", () => datSoDe(S.bo.length - 1));
  $("bDeCong").addEventListener("click", () => datSoDe(S.bo.length + 1));
  $("soDe").addEventListener("change", () => datSoDe(parseInt($("soDe").value, 10) || 1));
  $("dsMaDe").addEventListener("input", e => { const i = e.target.dataset.ma; if (i == null) return; S.bo[+i].ma = e.target.value.trim(); luu(); giuFocus(veDe); veXem(); });
  ["chonDe4", "chonDe5"].forEach(id => $(id).addEventListener("click", e => { const b = e.target.closest("[data-de]"); if (!b) return; S.deHien = +b.dataset.de; luu(); ve(); TT.toast("Đang soạn " + tenDe(S.deHien), ""); }));
  $("xuatDe").addEventListener("change", e => { const i = e.target.dataset.xd; if (i == null) return; e.target.checked ? xuatChon.add(+i) : xuatChon.delete(+i); });
  // bước 4
  $("bLenh").addEventListener("click", () => chepLenh(false));
  $("bLenhTrong").addEventListener("click", () => chepLenh(true));
  $("bLenhDai").addEventListener("click", () => chepLenh("dai"));
  $("bDoc").addEventListener("click", () => {
    const v = $("oDan").value; if (!v.trim()) { TT.toast("Thầy cô dán câu trả lời của AI vào ô trước ạ", "loi"); TT.buzz(); return; }
    const r = docTraLoi(v);
    giuFocus(veSoan); veKiem(); veBuoc(); veXem();
    if (r.duoc) { TT.ting(); TT.phaoGiay(); TT.toast(`Đã đọc ${r.duoc} câu vào đề${r.loi.length ? " · chưa đọc được: " + r.loi.slice(0, 5).join(", ") : ""}`, r.loi.length ? "" : "ok"); }
    else { TT.buzz(); TT.toast("Chưa đọc được câu nào — câu trả lời cần giữ nhãn [I.1], [II.1]… như câu lệnh", "loi"); }
    $("ketQuaDoc").innerHTML = `Đọc được <b>${r.duoc}</b>/${r.tong} khối${r.loi.length ? ` · <span class="do">chưa đọc được: ${esc(r.loi.join(", "))}</span> — sửa tay ở khung bên dưới hoặc bấm «Câu lệnh cho câu còn trống»` : ""}.`;
  });
  $("bCan").addEventListener("click", canDapAn);
  document.querySelectorAll("#locCau button").forEach(b => b.addEventListener("click", () => { S.loc = b.dataset.loc; document.querySelectorAll("#locCau button").forEach(x => x.classList.toggle("chon", x === b)); veSoan(); }));
  $("dsCau").addEventListener("input", e => {
    const i = e.target; if (!i.dataset.q || !i.dataset.x) return;
    const q = layCau(i.dataset.q); datGiaTri(q, i.dataset.x, i.value);
    const the = i.closest(".cau-o"), s = timKhe(i.dataset.q); if (the && s) { const ok = daXong(s); the.classList.toggle("xong", ok); the.querySelector(".cau-tt").textContent = ok ? "✔ đủ" : "… chưa đủ"; the.querySelector(".xem-ct").innerHTML = xemCau(S.cau[s.k], s.d); if (s.d === "NLC") { const dn = daiNhat(S.cau[s.k]); the.querySelector(".canh-dai").hidden = !dn; the.querySelectorAll(".pa-o").forEach((o, i) => o.classList.toggle("dai", dn && S.cau[s.k].dung === i)); } }
    capNhat();
  });
  $("dsCau").addEventListener("click", e => {
    const b = e.target.closest("[data-q]"); if (!b) return; const k = b.dataset.q;
    if (b.dataset.dung != null) { layCau(k).dung = +b.dataset.dung; luu(); TT.ting(); }
    else if (b.dataset.yd) { const [i, v] = b.dataset.yd.split("|"), q = layCau(k); q.y = q.y || []; q.y[+i] = q.y[+i] || { t: "" }; q.y[+i].d = v === "1"; luu(); }
    else if (b.dataset.themhdc) { const q = layCau(k); q.hdc = q.hdc || []; q.hdc.push({ nd: "", d: "" }); luu(); }
    else if (b.dataset.bohdc != null) { const q = layCau(k); q.hdc.splice(+b.dataset.bohdc, 1); luu(); }
    else if (b.dataset.xoacau) { if (!confirm("Xoá nội dung câu này?")) return; delete S.cau[k]; luu(); }
    else return;
    giuFocus(veSoan); veKiem(); veBuoc(); veXem();
  });
  // bước 5
  document.querySelectorAll("#tabXem button").forEach(b => b.addEventListener("click", () => { tabXem = b.dataset.tab; veXem(); }));
  $("bXuat").addEventListener("click", xuatWord); $("bXuat2").addEventListener("click", xuatWord);
  $("bSaoLuu").addEventListener("click", () => TT.saoLuu(["soande"], "soan-de"));
  $("bNhap").addEventListener("click", () => TT.nhapLai(["soande"], () => { S = chuan(TT.load("soande", moi())); xuatChon.clear(); S.bo.forEach((b, i) => xuatChon.add(i)); ve(); }));
  $("bMoi").addEventListener("click", () => { if (!confirm("Làm đề mới? Đề đang làm sẽ bị xoá khỏi máy này (thầy cô Sao lưu trước nếu cần).")) return; const giu = S.tt; S = chuan(moi()); xuatChon.clear(); xuatChon.add(0); ["so", "truong", "to", "mon", "nguoiSoan", "toTruong", "nam", "cap"].forEach(k => S.tt[k] = giu[k]); luu(); ve(); });
  document.querySelectorAll("#thanhBuoc a").forEach(a => a.addEventListener("click", e => { e.preventDefault(); $(a.getAttribute("href").slice(1)).scrollIntoView({ behavior: "smooth", block: "start" }); }));
  window.addEventListener("resize", () => veDapAn(khe()));
  ve();
  // chế độ chụp: #mau&b3, #mau&b5&xem=mt
  const h = location.hash, mb = h.match(/[#&]b([1-5])\b/), mx = h.match(/xem=(mt|dt|de|hd)/);
  if (mx) { tabXem = mx[1]; veXem(); }
  if (/[#&]lenh\b/.test(h)) { $("oLenh").value = lenhAI(false); $("hopLenh").open = true; }
  // chế độ chụp: chỉ hiện đúng bước được gọi (máy chụp không cuộn trang)
  if (mb && mb[1] !== "1") { document.querySelectorAll("section.the").forEach(s => { if (s.id !== "b" + mb[1]) s.style.display = "none"; }); veDapAn(khe()); veXem(); }
});
function chepLenh(chiTrong) {
  const s = chiTrong === "dai" ? lenhSuaDai() : lenhAI(chiTrong);
  if (!s && chiTrong === "dai") { TT.toast("Không câu nào có đáp án đúng dài nhất 👍", "ok"); return; }
  if (!s) { TT.toast(chiTrong ? "Không còn câu nào trống 👍" : "Chưa có câu nào trong ma trận — làm bước ③ trước ạ", chiTrong ? "ok" : "loi"); return; }
  $("oLenh").value = s; $("hopLenh").open = true;
  const xong = () => { TT.ting(); TT.toast("Đã chép câu lệnh — dán vào ChatGPT, Gemini hoặc Copilot", "ok"); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(xong, () => { $("oLenh").select(); document.execCommand("copy"); xong(); });
  else { $("oLenh").select(); document.execCommand("copy"); xong(); }
}
async function xuatWord() {
  const c = chonPhan();
  if (!Object.values(c).some(Boolean)) { TT.toast("Thầy cô chọn ít nhất một phần để xuất ạ", "loi"); return; }
  c.ds = S.bo.length > 1 ? [...xuatChon].sort((a, b) => a - b) : [0];
  if ((c.de || c.hd) && !c.ds.length) { TT.toast("Thầy cô tick ít nhất một đề để xuất ạ", "loi"); return; }
  const ph = dungPhan(c);
  if (!ph.length) { TT.toast("Ma trận chưa có câu nào", "loi"); TT.buzz(); return; }
  const k = veKiem();
  try {
    const blob = await DX.taoDocx(ph);
    const ten = ("De KT " + (S.tt.ky || "") + " " + (S.tt.mon || "") + " " + (S.tt.lop || "")).trim().replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "_") + (c.ds.length > 1 && (c.de || c.hd) ? "_" + c.ds.length + "-de" : S.bo.length > 1 && (c.de || c.hd) ? "_" + tenDe(c.ds[0]).replace(/\s+/g, "-") : "") + ".docx";
    TT.taiVe(ten, blob, blob.type);
    S.daXuat = true; luu(); veBuoc();
    if (k.nLoi) TT.toast(`Đã xuất Word — còn ${k.nLoi} lỗi ở phần soát, thầy cô xem lại trước khi dùng`, "");
    else { TT.ting(); TT.phaoGiay(); TT.toast("Đã xuất Word: " + ten, "ok"); }
  } catch (e) { TT.buzz(); TT.toast("Không tạo được file Word: " + (e.message || e), "loi"); }
}
