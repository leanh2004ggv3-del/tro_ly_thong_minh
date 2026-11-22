/* App «Trợ lý soạn đề kiểm tra theo CV 7991» — bộ Tổ trưởng số. Mọi thứ chạy trong trình duyệt. */
const $ = id => document.getElementById(id);
const DANG = ["NLC", "DS", "TLN", "TL"];
const TEN = { NLC: "Nhiều lựa chọn", DS: "Đúng – Sai", TLN: "Trả lời ngắn", TL: "Tự luận" };
const TEN_DAI = { NLC: "Câu trắc nghiệm nhiều phương án lựa chọn", DS: "Câu trắc nghiệm đúng sai", TLN: "Câu trắc nghiệm trả lời ngắn", TL: "Tự luận" };
const MAU_D = { NLC: "#6366f1", DS: "#0d9488", TLN: "#f59e0b", TL: "#ec4899" };
const MUC = ["B", "H", "V"], TENM = { B: "Biết", H: "Hiểu", V: "Vận dụng" }, TENM2 = { B: "Biết", H: "Hiểu", V: "VD" };
const MAU_M = { B: "#16a34a", H: "#0284c7", V: "#ea580c" }, NEN_M = { B: "E2EFDA", H: "DDEBF7", V: "FCE4D6" };
const LA = ["I", "II", "III", "IV"];
const f2 = v => { v = Math.round((+v || 0) * 100) / 100; return (Number.isInteger(v) ? v.toFixed(1) : String(v)).replace(".", ","); };
const pt = v => (Math.round(v * 10) / 10).toString().replace(".", ",") + " %";
const pt2 = v => (Math.round(v * 10) / 10).toString().replace(".", ",") + "%";
const so = s => parseFloat(String(s == null ? "" : s).replace(",", ".")) || 0;
const tong = a => a.reduce((x, y) => x + y, 0);
const esc = TT.esc;

function moi() {
  return {
    tt: { so: "", truong: "", to: "", mon: "", lop: "", ky: "GIỮA HỌC KÌ I", nam: "2026 – 2027", phut: 45, maDe: "", nguoiSoan: "", toTruong: "", cap: "THCS" },
    cd: [],
    dang: { NLC: { bat: true, d: 0.25 }, DS: { bat: true, d: 1, cham: "764" }, TLN: { bat: true, d: 0.25 }, TL: { bat: true, d: 1 } },
    o: {}, tlDiem: {}, cau: {}, muc: { B: 40, H: 30, V: 30 }
  };
}
let S = TT.MAU ? JSON.parse(JSON.stringify(MAU_DE)) : (TT.load("soande", null) || moi());
function luu() { clearTimeout(luu.t); luu.t = setTimeout(() => TT.save("soande", S), 250); }
function oCua(id) {
  S.o[id] = S.o[id] || {};
  DANG.forEach(d => { S.o[id][d] = S.o[id][d] || { B: 0, H: 0, V: 0 }; });
  return S.o[id];
}

/* ================= KHE CÂU HỎI TỪ MA TRẬN ================= */
function khe() {
  const P = { NLC: [], DS: [], TLN: [], TL: [] };
  S.cd.forEach(c => {
    const o = oCua(c.id);
    DANG.forEach(d => {
      if (!S.dang[d].bat) return;
      if (d === "DS") {
        const ys = []; MUC.forEach(m => { for (let i = 0; i < (o.DS[m] || 0); i++) ys.push(m); });
        for (let j = 0; j * 4 < ys.length; j++) P.DS.push({ k: `DS|${c.id}|${j}`, d, cd: c, ys: ys.slice(j * 4, j * 4 + 4), diem: S.dang.DS.d });
      } else MUC.forEach(m => {
        for (let i = 0; i < (o[d][m] || 0); i++) {
          const k = `${d}|${c.id}|${m}|${i}`;
          P[d].push({ k, d, cd: c, m, diem: d === "TL" ? (S.tlDiem[k] != null ? S.tlDiem[k] : S.dang.TL.d) : S.dang[d].d });
        }
      });
    });
  });
  P.phan = DANG.filter(d => S.dang[d].bat && P[d].length);
  P.phan.forEach((d, i) => P[d].forEach((s, j) => { s.la = LA[i]; s.so = j + 1; }));
  return P;
}
function tinh(P) {
  const t = { dang: { NLC: 0, DS: 0, TLN: 0, TL: 0 }, muc: { B: 0, H: 0, V: 0 }, cd: {}, dm: {}, tong: 0 };
  DANG.forEach(d => { t.dm[d] = { B: 0, H: 0, V: 0 }; });
  P.phan.forEach(d => P[d].forEach(s => {
    if (d === "DS") s.ys.forEach(m => { const v = s.diem / 4; t.muc[m] += v; t.dm.DS[m] += v; t.cd[s.cd.id] = (t.cd[s.cd.id] || 0) + v; });
    else { t.muc[s.m] += s.diem; t.dm[d][s.m] += s.diem; t.cd[s.cd.id] = (t.cd[s.cd.id] || 0) + s.diem; }
    t.dang[d] += s.diem; t.tong += s.diem;
  }));
  return t;
}

/* ================= CHIA THEO KHUNG CV 7991 ================= */
function chia(n, w) {
  const t = tong(w) || 1, a = w.map(v => n * v / t), f = a.map(Math.floor); let r = n - tong(f);
  a.map((v, i) => ({ i, fr: v - f[i] })).sort((p, q) => q.fr - p.fr).forEach(o => { if (r > 0) { f[o.i]++; r--; } });
  return f;
}
function chia2(hang, cot) {
  const N = tong(cot); if (!N) return hang.map(() => cot.map(() => 0));
  const a = hang.map(r => cot.map(c => r * c / N)), f = a.map(r => r.map(Math.floor));
  const dh = hang.map((r, i) => r - tong(f[i])), dc = cot.map((c, j) => c - tong(f.map(r => r[j])));
  const ung = []; a.forEach((r, i) => r.forEach((v, j) => ung.push({ i, j, fr: v - f[i][j] })));
  ung.sort((p, q) => q.fr - p.fr);
  for (let vong = 0; vong < 6; vong++) ung.forEach(u => { if (dh[u.i] > 0 && dc[u.j] > 0) { f[u.i][u.j]++; dh[u.i]--; dc[u.j]--; } });
  return f;
}
function apKhung() {
  if (!S.cd.length) { TT.toast("Thầy cô nạp nội dung hoặc thêm chủ đề ở bước ② trước ạ", "loi"); TT.buzz(); return; }
  const D = S.dang, goc = { NLC: 3, DS: 2, TLN: 2, TL: 3 };
  if (!D.TLN.bat && D.DS.bat) goc.DS += 2;
  const bat = DANG.filter(d => D[d].bat);
  if (!bat.length) { TT.toast("Thầy cô bật ít nhất một dạng câu ạ", "loi"); return; }
  const coDiem = tong(bat.map(d => goc[d]));
  const diem = {}; bat.forEach(d => diem[d] = goc[d] * 10 / coDiem);
  const FR = {
    NLC: { B: 2 / 3, H: 1 / 3, V: 0 },
    DS: Math.abs((diem.DS || 0) - 2) < .01 ? { B: .5, H: .25, V: .25 } : Math.abs((diem.DS || 0) - 4) < .01 ? { B: .25, H: .375, V: .375 } : { B: .4, H: .3, V: .3 },
    TLN: { B: 0, H: .5, V: .5 }, TL: { B: 1 / 3, H: 1 / 6, V: .5 }
  };
  const w = S.cd.map(c => Math.max(0, so(c.tiet)) || 0), ww = tong(w) ? w : S.cd.map(() => 1);
  S.cd.forEach(c => { const o = oCua(c.id); DANG.forEach(d => MUC.forEach(m => o[d][m] = 0)); });
  S.tlDiem = {};
  // 1) danh sách câu theo dạng + mức (đúng tỉ lệ 4 · 3 · 3)
  const cau = [];   // {d, m | ys, p}
  bat.forEach(d => {
    if (d === "TL") {
      MUC.forEach(m => { const p = Math.round(diem.TL * FR.TL[m] * 4) / 4; if (p <= 0) return; if (p > 2) { const a = Math.round(p / 2 * 4) / 4; cau.push({ d, m, p: a }, { d, m, p: p - a }); } else cau.push({ d, m, p }); });
    } else if (d === "DS") {
      const nCau = Math.max(1, Math.round(diem.DS / D.DS.d)), nY = chia(nCau * 4, MUC.map(m => FR.DS[m]));
      const ys = []; MUC.forEach((m, j) => { for (let i = 0; i < nY[j]; i++) ys.push(m); });
      const ds = Array.from({ length: nCau }, () => []); ys.forEach((m, i) => ds[i % nCau].push(m));
      ds.forEach(y => cau.push({ d, ys: y, p: D.DS.d }));
    } else {
      const n = Math.max(1, Math.round(diem[d] / D[d].d)), c = chia(n, MUC.map(m => FR[d][m]));
      MUC.forEach((m, j) => { for (let i = 0; i < c[j]; i++) cau.push({ d, m, p: D[d].d }); });
    }
  });
  // 2) giao từng câu cho bài đang «thiếu điểm» nhất so với thời lượng (câu điểm lớn giao trước)
  const tw = tong(ww), muc = ww.map(v => tong(cau.map(c => c.p)) * v / tw), da = ww.map(() => 0);
  cau.map((c, i) => Object.assign(c, { i })).sort((a, b) => b.p - a.p || a.i - b.i).forEach(c => {
    let k = 0; muc.forEach((v, j) => { if (v - da[j] > muc[k] - da[k] + 1e-9) k = j; });
    da[k] += c.p; c.cd = S.cd[k].id;
  });
  cau.sort((a, b) => a.i - b.i).forEach(c => {
    const o = oCua(c.cd);
    if (c.d === "DS") c.ys.forEach(m => o.DS[m]++);
    else { const q = o[c.d][c.m]; o[c.d][c.m]++; if (c.d === "TL") S.tlDiem[`TL|${c.cd}|${c.m}|${q}`] = c.p; }
  });
  luu(); ve(); TT.ting(); TT.toast("Đã chia theo khung CV 7991 — thầy cô chỉnh từng ô nếu cần", "ok");
}

/* ================= SOÁT ================= */
const KHOA_PA = /(cả\s+[A-D]\s+(và|,)|tất cả|cả (hai|ba|bốn)|đều (đúng|sai)|không có phương án|^[A-D]\s+và\s+[A-D])/i;
/* đáp án đúng là phương án dài nhất hẳn (dài hơn mọi nhiễu từ 2 kí tự) → HS dễ đoán */
function daiNhat(q) {
  if (!q || !q.pa || q.pa.length !== 4 || q.dung == null || q.pa.some(p => !String(p || "").trim())) return false;
  const n = q.pa.map(p => DF.gon(p).length), L = n[q.dung], M = Math.max(...n.filter((_, i) => i !== q.dung));
  return L >= M + 2;
}
function daXong(s) {
  const q = S.cau[s.k]; if (!q || !String(q.de || "").trim()) return false;
  if (s.d === "NLC") return q.pa && q.pa.length === 4 && q.pa.every(p => String(p || "").trim()) && q.dung != null;
  if (s.d === "DS") return q.y && q.y.length === s.ys.length && q.y.every(y => String(y.t || "").trim() && typeof y.d === "boolean");
  if (s.d === "TLN") return String(q.da || "").trim() !== "";
  if (s.d === "TL") return q.hdc && q.hdc.length > 0;
  return false;
}
function soat(P, t) {
  const kq = [], them = (muc, chu) => kq.push({ m: muc, t: chu });
  const nSlot = tong(P.phan.map(d => P[d].length));
  if (!nSlot) { them("loi", "Ma trận chưa có câu nào — bấm «Chia theo khung CV 7991» hoặc nhập số câu vào từng ô."); return kq; }
  Math.abs(t.tong - 10) < .001 ? them("ok", "Tổng điểm đúng 10,0.") : them("loi", `Tổng điểm đang là ${f2(t.tong)} (cần 10,0).`);
  const lech = MUC.filter(m => Math.abs(t.muc[m] - S.muc[m] / 10) > .5 + 1e-9);
  lech.length ? them("canh", "Tỉ lệ mức lệch quá 0,5 điểm: " + lech.map(m => `${TENM[m]} ${f2(t.muc[m])}/${f2(S.muc[m] / 10)}`).join(" · ") + " (CV 7991 ghi «khoảng» 4 · 3 · 3).")
    : them("ok", `Mức độ: Biết ${f2(t.muc.B)} · Hiểu ${f2(t.muc.H)} · Vận dụng ${f2(t.muc.V)}.`);
  const tt = tong(S.cd.map(c => so(c.tiet)));
  if (tt) S.cd.forEach(c => {
    const p = (t.cd[c.id] || 0) * 10, q = so(c.tiet) / tt * 100;
    if (so(c.tiet) > 0 && !(t.cd[c.id] > 0)) them("canh", `«${c.ten}» có ${c.tiet} tiết mà chưa có câu nào.`);
    else if (Math.abs(p - q) > 10) them("canh", `«${c.ten}»: ${pt(p)} điểm so với ${pt(q)} thời lượng (lệch quá 10 %) — ghi lí do dưới ma trận nếu tổ đồng ý.`);
  });
  S.cd.forEach(c => { const n = MUC.reduce((a, m) => a + (oCua(c.id).DS[m] || 0), 0); if (S.dang.DS.bat && n % 4) them("loi", `Đúng – Sai «${c.ten}» có ${n} ý — mỗi câu phải đủ 4 ý (số ý là bội của 4).`); });
  if (S.dang.DS.bat && S.dang.DS.cham === "764" && Math.abs(S.dang.DS.d - 1) > .001) them("canh", "Thang QĐ 764 (0,1 · 0,25 · 0,5 · 1) dành cho câu Đúng – Sai 1 điểm.");
  const trong = P.phan.flatMap(d => P[d]).filter(s => !daXong(s));
  trong.length ? them("loi", `Còn ${trong.length}/${nSlot} câu chưa đủ: ` + trong.slice(0, 8).map(s => s.la + "." + s.so).join(", ") + (trong.length > 8 ? "…" : ""))
    : them("ok", `Đủ ${nSlot}/${nSlot} câu, câu nào cũng có đáp án.`);
  // đáp án nhiều lựa chọn
  const da = P.NLC.map(s => S.cau[s.k]).filter(q => q && q.dung != null).map(q => q.dung);
  if (da.length >= 4) {
    const dem = [0, 1, 2, 3].map(i => da.filter(x => x === i).length), tb = da.length / 4;
    let lien = 0, maxL = 0; da.forEach((x, i) => { lien = i && x === da[i - 1] ? lien + 1 : 1; maxL = Math.max(maxL, lien); });
    const lechDa = dem.some(c => Math.abs(c - tb) > Math.max(1, tb * .35));
    (lechDa || maxL > 2) ? them("canh", `Đáp án A–B–C–D: ${dem.map((c, i) => "ABCD"[i] + " " + c).join(" · ")}${maxL > 2 ? ` · có ${maxL} câu liền cùng đáp án` : ""} → bấm «Cân đáp án».`)
      : them("ok", `Đáp án rải đều: ${dem.map((c, i) => "ABCD"[i] + " " + c).join(" · ")}.`);
  }
  P.TLN.forEach(s => { const q = S.cau[s.k]; if (q && q.da && !/^-?\d+([.,]\d+)?$/.test(String(q.da).trim())) them("canh", `Câu ${s.la}.${s.so}: đáp án trả lời ngắn nên là MỘT SỐ (đang là «${q.da}»).`); else if (q && q.da && String(q.da).trim().length > 4) them("canh", `Câu ${s.la}.${s.so}: đáp án quá 4 kí tự — phiếu trả lời ngắn thường có 4 ô.`); });
  P.TL.forEach(s => { const q = S.cau[s.k]; if (q && q.hdc && q.hdc.length) { const c = tong(q.hdc.map(h => so(h.d))); if (Math.abs(c - s.diem) > .001) them("loi", `Câu ${s.la}.${s.so}: hướng dẫn chấm cộng ${f2(c)} điểm, câu là ${f2(s.diem)} điểm.`); } });
  const de = {}; P.phan.forEach(d => P[d].forEach(s => { const q = S.cau[s.k]; if (!q || !q.de) return; const k = DF.gon(q.de).toLowerCase(); if (de[k]) them("canh", `Câu ${s.la}.${s.so} trùng câu dẫn với ${de[k]}.`); else de[k] = s.la + "." + s.so; }));
  const dai = P.NLC.filter(s => daiNhat(S.cau[s.k]));
  if (dai.length) them("canh", `Đáp án đúng đang là phương án DÀI NHẤT ở ${dai.length} câu: ${dai.map(s => s.la + "." + s.so).join(", ")} — học sinh dễ đoán. Sửa cho phương án nhiễu dài tương đương, hoặc bấm «Câu lệnh sửa phương án».`);
  else if (P.NLC.some(s => S.cau[s.k] && S.cau[s.k].dung != null)) them("ok", "Không câu nào có đáp án đúng dài nhất hẳn so với phương án nhiễu.");
  P.NLC.forEach(s => { const q = S.cau[s.k]; if (q && q.pa && new Set(q.pa.map(p => DF.gon(p).toLowerCase())).size < 4 && q.pa.every(p => p)) them("loi", `Câu ${s.la}.${s.so} có hai phương án giống nhau.`); });
  return kq;
}
function canDapAn() {
  const P = khe(), ds = P.NLC.map(s => S.cau[s.k]).filter(q => q && q.pa && q.pa.length === 4 && q.dung != null);
  if (ds.length < 4) { TT.toast("Cần ít nhất 4 câu nhiều lựa chọn có đáp án", "loi"); return; }
  const dem = [0, 0, 0, 0], kq = [];
  ds.forEach((q, i) => {
    let muon;
    if (q.pa.some(p => KHOA_PA.test(p))) muon = q.dung;
    else {
      const cam = i >= 2 && kq[i - 1] === kq[i - 2] ? kq[i - 1] : -1;
      const ung = [0, 1, 2, 3].filter(x => x !== cam), min = Math.min(...ung.map(x => dem[x]));
      const chon = ung.filter(x => dem[x] === min); muon = chon[Math.random() * chon.length | 0];
      if (muon !== q.dung) { const t = q.pa[muon]; q.pa[muon] = q.pa[q.dung]; q.pa[q.dung] = t; q.dung = muon; }
    }
    dem[muon]++; kq.push(muon);
  });
  luu(); veSoan(); veKiem(); TT.ting(); TT.toast("Đã đổi chỗ phương án cho đáp án rải đều (câu có «Cả A và B», «Tất cả» giữ nguyên)", "ok");
}

/* ================= CÂU LỆNH CHO AI ================= */
function moTaO(s) {
  const c = s.cd, ycm = m => (c.yc && c.yc[m] ? c.yc[m].replace(/\n/g, " ") : "(theo nội dung bài)");
  if (s.d === "DS") return `[${s.la}.${s.so}] Chủ đề: ${c.ten} | ${s.ys.map((m, i) => "abcd"[i] + ") " + TENM[m]).join(", ")} | YCCĐ: ${[...new Set(s.ys)].map(m => TENM[m] + ": " + ycm(m)).join(" ; ")}`;
  return `[${s.la}.${s.so}] Chủ đề: ${c.ten} | Mức: ${TENM[s.m]}${s.d === "TL" ? " | " + f2(s.diem) + " điểm" : ""} | YCCĐ ${TENM[s.m]}: ${ycm(s.m)}`;
}
function lenhAI(chiTrong) {
  const P = khe(), tt = S.tt;
  const ds = P.phan.flatMap(d => P[d]).filter(s => !chiTrong || !daXong(s));
  if (!ds.length) return "";
  const co = d => ds.some(s => s.d === d), la = d => (P[d][0] || {}).la;
  const TRAN = 26000, nd = S.cd.filter(c => ds.some(s => s.cd.id === c.id));
  const dai = tong(nd.map(c => (c.text || "").length)) || 1;
  const noiDung = nd.map(c => { const m = Math.max(1500, Math.floor(TRAN * (c.text || "").length / dai)); let t = c.text || "(thầy cô chưa nạp nội dung — dựa vào chương trình môn)"; if (t.length > m) t = t.slice(0, m) + " […]"; return `=== ${c.ten} ===\n${t}`; }).join("\n\n");
  let s = `Bạn là giáo viên ${tt.mon ? "môn " + tt.mon : ""}${tt.lop ? " lớp " + tt.lop : ""} nhiều kinh nghiệm ra đề. Hãy soạn câu hỏi cho ĐỀ KIỂM TRA ${tt.ky || ""} theo ma trận, bản đặc tả (tham khảo phụ lục Công văn 7991/BGDĐT-GDTrH), chương trình GDPT 2018.

YÊU CẦU CHUNG
- Chỉ dùng kiến thức trong phần NỘI DUNG BÀI HỌC ở cuối (giáo viên cung cấp). Không đưa kiến thức ngoài phạm vi, không bịa số liệu.
- Mỗi câu đo đúng yêu cầu cần đạt (YCCĐ) và đúng mức độ ghi ở từng câu. Ngữ liệu, số liệu, tình huống mới — không chép nguyên câu hỏi, bài tập có sẵn trong bài.
- Lệnh hỏi rõ, một nghĩa, đúng thuật ngữ của sách. Viết tiếng Việt chuẩn.
- Chỉ số viết x^2, H_2O, 10^{-3}. Không dùng LaTeX, không dùng Markdown (không **, không #, không bảng).
- Giữ đúng nhãn [${ds[0].la}.${ds[0].so}]… ở đầu mỗi câu, đúng thứ tự, không thêm lời mở đầu hay kết luận.
`;
  if (co("NLC")) s += `- Phần ${la("NLC")} (nhiều lựa chọn): 4 phương án A, B, C, D, chỉ 1 phương án đúng; các phương án dài tương đương, cùng cấu trúc ngữ pháp, nhiễu hợp lí; ĐÁP ÁN ĐÚNG KHÔNG ĐƯỢC LÀ PHƯƠNG ÁN DÀI NHẤT — luôn có ít nhất một phương án nhiễu dài bằng hoặc dài hơn, đáp án đúng không chi tiết hơn hẳn các phương án khác; không dùng «Cả A và B», «Tất cả đều đúng». Cuối câu ghi «Đáp án: X».
`;
  if (co("DS")) s += `- Phần ${la("DS")} (đúng – sai): mỗi câu có câu dẫn (thông tin, tình huống) và đúng 4 ý a), b), c), d); mỗi ý là một nhận định chỉ đúng hoặc sai, đo đúng mức ghi cho ý đó. Cuối câu ghi «Đáp án: a) Đ, b) S, c) Đ, d) S».
`;
  if (co("TLN")) s += `- Phần ${la("TLN")} (trả lời ngắn): đáp án là MỘT SỐ, tối đa 4 kí tự kể cả dấu phẩy và dấu trừ; ghi rõ yêu cầu làm tròn nếu có. Không hỏi «mấy câu», «mấy từ». Cuối câu ghi «Đáp án: …».
`;
  if (co("TL")) s += `- Phần ${la("TL")} (tự luận): ghi đúng số điểm của câu; có thể chia ý a), b). Sau câu hỏi viết dòng «Hướng dẫn chấm:» rồi từng ý một dòng, cuối mỗi dòng ghi điểm trong ngoặc, ví dụ «- Nêu đúng …(0,5 điểm)»; tổng điểm các ý bằng điểm của câu.
`;
  s += `
KHUÔN TRẢ LỜI (làm đúng như mẫu)
`;
  if (co("NLC")) s += `[${la("NLC")}.1] Câu hỏi …
A. …
B. …
C. …
D. …
Đáp án: B
`;
  if (co("DS")) s += `[${la("DS")}.1] Câu dẫn …
a) …
b) …
c) …
d) …
Đáp án: a) Đ, b) S, c) S, d) Đ
`;
  if (co("TLN")) s += `[${la("TLN")}.1] Câu hỏi …
Đáp án: 12,5
`;
  if (co("TL")) s += `[${la("TL")}.1] Câu hỏi …
a) …
b) …
Hướng dẫn chấm:
- … (0,5 điểm)
- … (0,5 điểm)
`;
  s += `
DANH SÁCH ${ds.length} CÂU CẦN SOẠN
${ds.map(moTaO).join("\n")}

NỘI DUNG BÀI HỌC (giáo viên cung cấp)
${noiDung}
`;
  return s;
}

/* câu lệnh sửa các câu có đáp án đúng dài nhất */
function lenhSuaDai() {
  const P = khe(), ds = P.NLC.filter(s => daiNhat(S.cau[s.k]));
  if (!ds.length) return "";
  return `Dưới đây là ${ds.length} câu trắc nghiệm nhiều lựa chọn${S.tt.mon ? " môn " + S.tt.mon : ""}${S.tt.lop ? " lớp " + S.tt.lop : ""}. Ở mỗi câu, đáp án đúng đang là phương án DÀI NHẤT nên học sinh dễ đoán. Hãy viết lại các phương án:
- Giữ nguyên câu hỏi, giữ nguyên nội dung và VỊ TRÍ (chữ cái) của đáp án đúng.
- Làm cho 4 phương án dài tương đương, cùng cấu trúc: viết gọn đáp án đúng và/hoặc viết các phương án nhiễu đầy đủ hơn, sao cho ít nhất một phương án nhiễu dài bằng hoặc dài hơn đáp án đúng.
- Phương án nhiễu vẫn phải SAI rõ ràng, hợp lí, đúng phạm vi bài học; không dùng «Cả A và B», «Tất cả đều đúng».
- Không dùng Markdown. Trả lời đúng khuôn, giữ nguyên nhãn, không thêm lời mở đầu:
[I.1] Câu hỏi …
A. …
B. …
C. …
D. …
Đáp án: X

CÁC CÂU CẦN SỬA
${ds.map(s => { const q = S.cau[s.k]; return `[${s.la}.${s.so}] ${q.de}\n${q.pa.map((p, i) => "ABCD"[i] + ". " + p).join("\n")}\nĐáp án: ${"ABCD"[q.dung]}`; }).join("\n\n")}
`;
}

/* ================= ĐỌC CÂU TRẢ LỜI CỦA AI ================= */
const RE_DA = /^(Đáp án|ĐÁP ÁN|Đáp án đúng|ĐA)\s*[:：.]?\s*/;
function docCau(d, than, s) {
  let dong = than.split("\n").map(x => x.trim()).filter(Boolean);
  if (dong.length && /^\((Chủ đề|Mức|Biết|Hiểu|Vận dụng|[0-9][,.]?[0-9]*\s*điểm)/i.test(dong[0])) dong[0] = dong[0].replace(/^\([^)]*\)\s*/, "");
  dong = dong.map(x => x.replace(/^Câu\s*\d+\s*[.:]\s*/i, "")).filter(Boolean);
  if (d === "NLC") {
    const vt = dong.findIndex(x => /^A\s*[.)]\s*/.test(x));
    if (vt < 0) return null;
    const de = dong.slice(0, vt).join("\n"); let con = [], da = null;
    dong.slice(vt).forEach(x => { const m = x.match(RE_DA); if (m) { const k = x.slice(m[0].length).match(/[A-D]/); if (k) da = "ABCD".indexOf(k[0]); } else con.push(x); });
    const chuoi = " " + con.join(" "), pa = [];
    const re = /\s([A-D])\s*[.)]\s+/g; let m, moc = [];
    while ((m = re.exec(chuoi))) moc.push({ c: m[1], i: m.index, j: re.lastIndex });
    const thu = []; let can = 0;
    moc.forEach(x => { if (x.c === "ABCD"[can]) { thu.push(x); can++; } });
    thu.forEach((x, i) => pa.push(chuoi.slice(x.j, i + 1 < thu.length ? thu[i + 1].i : undefined).trim().replace(/\s*\(?(đúng|đáp án)\)?$/i, "")));
    if (pa.length !== 4) return null;
    return { de, pa, dung: da };
  }
  if (d === "DS") {
    const vt = dong.findIndex(x => /^a\s*\)/.test(x));
    if (vt < 0) return null;
    const de = dong.slice(0, vt).join("\n"), y = []; let daDong = "";
    dong.slice(vt).forEach(x => {
      if (RE_DA.test(x)) { daDong += " " + x.replace(RE_DA, ""); return; }
      const m = x.match(/^([a-d])\s*\)\s*(.*)$/);
      if (m) {
        let t = m[2], dd;
        const k = t.match(/\s*(?:[-–→]\s*|\()\s*(Đúng|Sai|Đ|S)\s*\)?\s*\.?$/);
        if (k) { dd = /^Đ/.test(k[1]); t = t.slice(0, k.index).trim(); }
        y.push({ t, d: dd });
      } else if (y.length) y[y.length - 1].t += " " + x;
    });
    const re = /([a-d])\s*\)?\s*[:\-–=]?\s*(Đúng|Sai|Đ|S)(?=[\s,;.)]|$)/gi; let m;
    while ((m = re.exec(daDong))) { const i = "abcd".indexOf(m[1].toLowerCase()); if (y[i]) y[i].d = /^đ/i.test(m[2]); }
    if (y.length !== 4) return null;
    return { de, y };
  }
  if (d === "TLN") {
    const vt = dong.findIndex(x => RE_DA.test(x));
    if (vt < 0) return { de: dong.join("\n"), da: "" };
    return { de: dong.slice(0, vt).join("\n"), da: dong[vt].replace(RE_DA, "").replace(/\.$/, "").trim() };
  }
  if (d === "TL") {
    const vt = dong.findIndex(x => /^(Hướng dẫn chấm|HƯỚNG DẪN CHẤM|HDC|Đáp án|ĐÁP ÁN|Gợi ý đáp án)/i.test(x));
    const de = (vt < 0 ? dong : dong.slice(0, vt)).join("\n").replace(/^\(\s*\d+([,.]\d+)?\s*điểm\s*\)\s*/i, "");
    const hdc = vt < 0 ? [] : dong.slice(vt + 1).map(x => {
      x = x.replace(/^[-+•*]\s*/, "");
      const m = x.match(/\(?\s*(\d+(?:[.,]\d+)?)\s*(điểm|đ)\s*\)?\s*\.?$/i);
      return m ? { nd: x.slice(0, m.index).trim().replace(/[:–-]\s*$/, ""), d: m[1].replace(".", ",") } : { nd: x, d: "" };
    }).filter(h => h.nd);
    return { de, hdc };
  }
  return null;
}
function docTraLoi(txt) {
  const P = khe(), map = {};
  P.phan.forEach(d => P[d].forEach(s => map[s.la + "." + s.so] = s));
  txt = String(txt || "").replace(/\r/g, "").replace(/\*\*|__|`/g, "").replace(/^#+\s*/gm, "").replace(/\\\(|\\\)|\$/g, "");
  const re = /^\s*\[?\s*(IV|I{1,3})\s*[.\-]\s*(\d+)\s*\]?\s*[:.)]?/gm, moc = []; let m;
  while ((m = re.exec(txt))) moc.push({ k: m[1] + "." + m[2], i: m.index, j: re.lastIndex });
  let duoc = 0, loi = [];
  moc.forEach((x, i) => {
    const s = map[x.k]; if (!s) { loi.push(x.k + " (không có trong ma trận)"); return; }
    const q = docCau(s.d, txt.slice(x.j, i + 1 < moc.length ? moc[i + 1].i : undefined), s);
    if (!q) { loi.push(x.k); return; }
    S.cau[s.k] = q; duoc++;
  });
  luu();
  return { duoc, loi, tong: moc.length };
}

/* ================= DỰNG WORD ================= */
const P_ = DX.P, R = (t, o) => DX.chu(t, o);
const NHAP = () => P_([{ t: "BẢN NHÁP — thầy/cô duyệt trước khi dùng (xoá dòng này khi in).", i: true, mau: "7F7F7F" }], { jc: "center", truoc: 120 });
function dauVb(rong, tieuDe) {
  const tt = S.tt, trai = rong > 20 ? 10 : 7;
  const tr = [tt.so || "", tt.truong || "", tt.to || ""].filter(Boolean);
  const pTrai = tr.map((t, i) => P_([{ t, b: i > 0 && i < 2 }], { jc: "center", sau: 0 }));
  if (pTrai.length) pTrai.push(P_([{ t: "––––––––––––" }], { jc: "center", sau: 0 }));
  const pPhai = tieuDe.map(([t, o]) => P_(R(t, o), { jc: "center", sau: 0 }));
  return { t: "bang", vien: false, cot: [trai, rong - trai], le: 30, hang: [[{ p: pTrai.length ? pTrai : [P_([], { sau: 0 })], giua: false }, { p: pPhai, giua: false }]] };
}
const tenKy = () => (S.tt.ky || "").toUpperCase();
const monLop = () => `MÔN: ${(S.tt.mon || "…").toUpperCase()}${S.tt.lop ? " – LỚP " + S.tt.lop : ""}`;
function hdrCot(P, them) {  // các hàng đầu bảng (ma trận / đặc tả)
  const tn = P.phan.filter(d => d !== "TL"), coTL = P.phan.includes("TL"), nhom = P.phan.length * 3;
  const H = n => ({ t: n, b: true, jc: "center", nen: "D9E2F3" });
  const r1 = [...them.dau.map(t => Object.assign(H(t), { vm: "s" })), Object.assign(H(them.giua), { span: nhom }), ...them.cuoi1];
  const r2 = [...them.dau.map(() => ({ vm: "c" }))];
  if (tn.length) r2.push(Object.assign(H("TNKQ"), { span: tn.length * 3 }));
  if (coTL) r2.push(Object.assign(H("Tự luận"), { span: 3, vm: "s" }));
  r2.push(...them.cuoi2);
  const r3 = [...them.dau.map(() => ({ vm: "c" }))];
  tn.forEach(d => r3.push(Object.assign(H(TEN[d]), { span: 3 })));
  if (coTL) r3.push({ vm: "c", span: 3 });
  r3.push(...them.cuoi2);
  const r4 = [...them.dau.map(() => ({ vm: "c" }))];
  P.phan.forEach(() => MUC.forEach(m => r4.push({ t: TENM2[m], b: true, jc: "center", nen: NEN_M[m] })));
  r4.push(...them.cuoi4);
  return [r1, r2, r3, r4];
}
function nhanCau(s) { return s.d === "DS" ? s.so : s.so; }
function phanMaTran(P, t) {
  const rong = 26.2, nC = P.phan.length * 3 + 3, wC = 1.12, ndW = Math.max(3.6, rong - .9 - 3 - 1.5 - nC * wC);
  const cot = [.9, 3, ndW, ...Array(nC).fill(wC), 1.5];
  const H = n => ({ t: n, b: true, jc: "center", nen: "D9E2F3" });
  const hang = hdrCot(P, {
    dau: ["TT", "Chủ đề/Chương", "Nội dung/đơn vị kiến thức"], giua: "Mức độ đánh giá",
    cuoi1: [Object.assign(H("Tổng"), { span: 3, vm: "s" }), Object.assign(H("Tỉ lệ % điểm"), { vm: "s" })],
    cuoi2: [{ vm: "c", span: 3 }, { vm: "c" }],
    cuoi4: [...MUC.map(m => ({ t: TENM2[m], b: true, jc: "center", nen: NEN_M[m] })), { vm: "c" }]
  });
  const demO = (c, d, m) => d === "DS" ? (oCua(c.id).DS[m] || 0) : (oCua(c.id)[d][m] || 0);
  let cuChuong = null;
  S.cd.forEach((c, i) => {
    const ch = c.chuong || c.ten, cungTren = i > 0 && c.chuong && c.chuong === S.cd[i - 1].chuong;
    const h = [{ t: String(i + 1), jc: "center" }, cungTren ? { vm: "c" } : { t: ch, b: true, vm: S.cd[i + 1] && c.chuong && S.cd[i + 1].chuong === c.chuong ? "s" : undefined }, { t: c.chuong ? c.ten : "Toàn chủ đề" }];
    const tg = { B: 0, H: 0, V: 0 };
    P.phan.forEach(d => MUC.forEach(m => { const n = demO(c, d, m); tg[m] += n; h.push({ t: n ? String(n) : "", jc: "center" }); }));
    MUC.forEach(m => h.push({ t: tg[m] ? String(tg[m]) : "", jc: "center", b: true }));
    h.push({ t: pt2((t.cd[c.id] || 0) * 10), jc: "center" });
    hang.push(h); cuChuong = ch;
  });
  const nhan = (t2, o) => [Object.assign({ t: t2, b: true, span: 3, nen: "F2F2F2" }, o || {})];
  const rS = nhan("Tổng số câu"), rD = nhan("Tổng số điểm"), rT = nhan("Tỉ lệ %");
  const tgM = { B: 0, H: 0, V: 0 };
  P.phan.forEach(d => {
    MUC.forEach(m => { const n = tong(S.cd.map(c => demO(c, d, m))); tgM[m] += n; rS.push({ t: n ? String(n) : "", jc: "center", b: true, nen: "F2F2F2" }); });
    rD.push({ t: f2(t.dang[d]), jc: "center", b: true, span: 3, nen: "F2F2F2" });
    rT.push({ t: pt2(t.dang[d] * 10), jc: "center", b: true, span: 3, nen: "F2F2F2" });
  });
  MUC.forEach(m => { rS.push({ t: String(tgM[m]), jc: "center", b: true, nen: "F2F2F2" }); rD.push({ t: f2(t.muc[m]), jc: "center", b: true, nen: "F2F2F2" }); rT.push({ t: pt2(t.muc[m] * 10), jc: "center", b: true, nen: "F2F2F2" }); });
  rS.push({ t: "", nen: "F2F2F2" }); rD.push({ t: f2(t.tong), jc: "center", b: true, nen: "F2F2F2" }); rT.push({ t: pt2(t.tong * 10), jc: "center", b: true, nen: "F2F2F2" });
  hang.push(rS, rD, rT);
  const tt = S.tt, khoi = [
    dauVb(rong, [[`MA TRẬN ĐỀ KIỂM TRA ${tenKy()}`, { b: true }], [`NĂM HỌC ${tt.nam || "…"}`, { b: true }], [monLop(), { b: true }], [`Thời gian làm bài: ${tt.phut || "…"} phút`, { i: true }]]),
    P_([{ t: "(Tham khảo phụ lục Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GD&ĐT" + (tt.cap === "THPT" ? "" : "; thực hiện theo hướng dẫn của Sở và quy chế kiểm tra, đánh giá của trường") + ")", i: true }], { jc: "center", truoc: 60, sau: 120 }),
    { t: "bang", cot, dau: 4, hang, le: 40 }, ...ghiChuMt(P), NHAP()
  ];
  return { ngang: true, khoi };
}
function ghiChuMt(P) {
  const D = S.dang, g = [];
  g.push(P_([{ t: "Ghi chú:", b: true, i: true }], { truoc: 80, sau: 0 }));
  if (P.phan.includes("NLC")) g.push(P_(R(`– Nhiều lựa chọn: mỗi câu ${f2(D.NLC.d)} điểm; số trong ô là số câu.`, { i: true }), { sau: 0 }));
  if (P.phan.includes("DS")) g.push(P_(R(`– Đúng – Sai: mỗi câu có 4 ý, tối đa ${f2(D.DS.d)} điểm; số trong ô là số ý (quy đổi ${f2(D.DS.d / 4)} điểm/ý để tính tỉ lệ).`, { i: true }), { sau: 0 }));
  if (P.phan.includes("TLN")) g.push(P_(R(`– Trả lời ngắn: mỗi câu ${f2(D.TLN.d)} điểm; học sinh chỉ ghi kết quả.`, { i: true }), { sau: 0 }));
  if (!D.TLN.bat && D.DS.bat) g.push(P_(R("– Môn không dùng dạng trả lời ngắn: số điểm của dạng này chuyển sang Đúng – Sai (theo chú thích phụ lục CV 7991).", { i: true }), { sau: 0 }));
  if (P.phan.includes("TL")) g.push(P_(R("– Tự luận: điểm từng câu ghi ở đề và hướng dẫn chấm. VD: Vận dụng.", { i: true }), { sau: 0 }));
  if (S.ghiChu) g.push(P_(R("– " + S.ghiChu, { i: true }), { sau: 0 }));
  return g;
}
function phanDacTa(P, t) {
  const rong = 26.2, nC = P.phan.length * 3, wC = 1.12, ycW = Math.max(6, rong - .9 - 2.6 - 3 - nC * wC);
  const cot = [.9, 2.6, 3, ycW, ...Array(nC).fill(wC)];
  const H = n => ({ t: n, b: true, jc: "center", nen: "D9E2F3" });
  const hang = hdrCot(P, { dau: ["TT", "Chủ đề/Chương", "Nội dung/đơn vị kiến thức", "Yêu cầu cần đạt"], giua: "Số câu hỏi ở các mức độ đánh giá", cuoi1: [], cuoi2: [], cuoi4: [] });
  // vị trí câu theo (chủ đề, dạng, mức)
  const viTri = (c, d, m) => {
    if (d === "DS") { const ds = []; P.DS.filter(s => s.cd.id === c.id).forEach(s => { const y = []; s.ys.forEach((mm, i) => { if (mm === m) y.push("abcd"[i]); }); if (y.length) ds.push(s.so + (y.length > 2 && "abcd".indexOf(y[y.length - 1]) - "abcd".indexOf(y[0]) === y.length - 1 ? y[0] + "–" + y[y.length - 1] : y.join(","))); }); ds.n = tong(P.DS.filter(s => s.cd.id === c.id).map(s => s.ys.filter(mm => mm === m).length)); return ds; }
    return P[d].filter(s => s.cd.id === c.id && s.m === m).map(s => String(s.so));
  };
  S.cd.forEach((c, i) => {
    const cacM = MUC.filter(m => (c.yc && String(c.yc[m] || "").trim()) || P.phan.some(d => viTri(c, d, m).length));
    const ms = cacM.length ? cacM : ["B"];
    ms.forEach((m, k) => {
      const dau = k === 0, vm = ms.length > 1 ? (dau ? "s" : "c") : undefined;
      const h = [dau ? { t: String(i + 1), jc: "center", vm } : { vm: "c" }, dau ? { t: c.chuong || c.ten, b: true, vm } : { vm: "c" }, dau ? { t: c.chuong ? c.ten : "Toàn chủ đề", vm } : { vm: "c" }];
      const yc = String((c.yc && c.yc[m]) || "").trim() || "- (Thầy cô ghi yêu cầu cần đạt.)";
      h.push({ p: [P_([{ t: TENM[m] + ":", b: true, mau: { B: "375623", H: "1F4E79", V: "843C0C" }[m] }], { jc: "left", sau: 0, dong: 240 }), ...yc.split("\n").map(d => P_(R(d), { jc: "both", sau: 0, dong: 240 }))], giua: false });
      P.phan.forEach(d => MUC.forEach(mm => {
        const v = mm === m ? viTri(c, d, m) : [];
        h.push(v.length ? { p: [P_([{ t: String(v.n || v.length), b: true }], { jc: "center", sau: 0, dong: 240 }), P_([{ t: "(" + v.join(", ") + ")", i: true }], { jc: "center", sau: 0, dong: 240 })], nen: NEN_M[m] } : { t: "" });
      }));
      hang.push(h);
    });
  });
  const nh = t2 => [{ t: t2, b: true, span: 4, nen: "F2F2F2" }];
  const rS = nh("Tổng số câu"), rD = nh("Tổng số điểm"), rT = nh("Tỉ lệ %");
  P.phan.forEach(d => {
    MUC.forEach(m => { const n = d === "DS" ? tong(S.cd.map(c => oCua(c.id).DS[m] || 0)) : tong(S.cd.map(c => oCua(c.id)[d][m] || 0)); rS.push({ t: n ? String(n) : "", jc: "center", b: true, nen: "F2F2F2" }); });
    rD.push({ t: f2(t.dang[d]), jc: "center", b: true, span: 3, nen: "F2F2F2" });
    rT.push({ t: pt2(t.dang[d] * 10), jc: "center", b: true, span: 3, nen: "F2F2F2" });
  });
  hang.push(rS, rD, rT);
  const tt = S.tt;
  return { ngang: true, khoi: [
    dauVb(rong, [[`BẢN ĐẶC TẢ ĐỀ KIỂM TRA ${tenKy()}`, { b: true }], [`NĂM HỌC ${tt.nam || "…"}`, { b: true }], [monLop(), { b: true }], [`Thời gian làm bài: ${tt.phut || "…"} phút`, { i: true }]]),
    P_([{ t: "(Số trong ô: số câu/ý; trong ngoặc: câu số mấy ở từng phần của đề — Đúng – Sai ghi kèm ý a, b, c, d)", i: true }], { jc: "center", truoc: 60, sau: 120 }),
    { t: "bang", cot, dau: 4, hang, le: 40 }, kyTen(rong), NHAP()
  ] };
}
function kyTen(rong) {
  const tt = S.tt, o = (a, b) => ({ p: [P_([{ t: a, b: true }], { jc: "center", sau: 0 }), P_([{ t: "(Kí, ghi rõ họ tên)", i: true }], { jc: "center", sau: 900 }), P_([{ t: b || "", b: true }], { jc: "center", sau: 0 })], giua: false });
  return { t: "bang", vien: false, cot: [rong / 3, rong / 3, rong / 3], hang: [[o("DUYỆT CỦA BAN GIÁM HIỆU", ""), o("TỔ TRƯỞNG CHUYÊN MÔN", tt.toTruong), o("NGƯỜI RA ĐỀ", tt.nguoiSoan)]] };
}
function luaChon(q, rong) {
  const tw = DX.cm(rong), thut = 284, len = Math.max(...q.pa.map(p => String(p).length));
  const r = i => [{ t: "ABCD"[i] + ". ", b: true }, ...R(q.pa[i])];
  if (len <= 15) { const b = (tw - thut) / 4; return [P_([...r(0), { tab: true }, ...r(1), { tab: true }, ...r(2), { tab: true }, ...r(3)], { thut, tab: [1, 2, 3].map(k => Math.round(thut + b * k)), jc: "left" })]; }
  if (len <= 34) { const b = (tw - thut) / 2; return [P_([...r(0), { tab: true }, ...r(1)], { thut, tab: [Math.round(thut + b)], jc: "left" }), P_([...r(2), { tab: true }, ...r(3)], { thut, tab: [Math.round(thut + b)], jc: "left" })]; }
  return [0, 1, 2, 3].map(i => P_(r(i), { thut: thut + 340, treo: 340 }));
}
function phanDe(P, t) {
  const rong = 16.5, tt = S.tt, khoi = [];
  khoi.push(dauVb(rong, [[`ĐỀ KIỂM TRA ${tenKy()}`, { b: true }], [`NĂM HỌC ${tt.nam || "…"}`, { b: true }], [monLop(), { b: true }], [`Thời gian làm bài: ${tt.phut || "…"} phút`, { i: true }], ["(không kể thời gian phát đề)", { i: true }]]));
  if (tt.maDe) khoi.push(P_([{ t: "Mã đề: " + tt.maDe, b: true }], { jc: "right", sau: 0 }));
  khoi.push(P_([{ t: "Họ và tên: ………………………………………………… Lớp: ………… SBD: …………" }], { truoc: 160, sau: 160, jc: "left" }));
  P.phan.forEach(d => {
    const ds = P[d], la = ds[0].la, n = ds.length, diem = t.dang[d];
    const loi = { NLC: ` Học sinh trả lời từ câu 1 đến câu ${n}. Mỗi câu hỏi học sinh chỉ chọn một phương án.`, DS: ` Học sinh trả lời từ câu 1 đến câu ${n}. Trong mỗi ý a), b), c), d) ở mỗi câu, học sinh chọn đúng hoặc sai.`, TLN: ` Học sinh trả lời từ câu 1 đến câu ${n}.`, TL: "" }[d];
    khoi.push(P_([{ t: `PHẦN ${la}. ${TEN_DAI[d]} (${f2(diem)} điểm).`, b: true }, { t: loi }], { truoc: 120, sau: 60, giu: true }));
    ds.forEach(s => {
      const q = S.cau[s.k] || {}, dong = String(q.de || "…").split("\n");
      const dau = d === "TL" ? [{ t: `Câu ${s.so} (${f2(s.diem)} điểm). `, b: true }] : [{ t: `Câu ${s.so}. `, b: true }];
      khoi.push(P_([...dau, ...R(dong[0])], { giu: true }));
      dong.slice(1).forEach(x => khoi.push(P_(R(x), { thut: /^[a-dđ]\)/.test(x) ? 284 : 0, giu: d !== "TL" })));
      if (d === "NLC" && q.pa) khoi.push(...luaChon(q, rong));
      if (d === "DS" && q.y) q.y.forEach((y, i) => khoi.push(P_([{ t: "abcd"[i] + ") ", b: true }, ...R(y.t)], { thut: 284 + 340, treo: 340 })));
    });
  });
  khoi.push(P_([{ t: "———— HẾT ————", b: true }], { jc: "center", truoc: 200, sau: 40 }));
  khoi.push(P_([{ t: "Học sinh không được sử dụng tài liệu. Cán bộ coi kiểm tra không giải thích gì thêm.", i: true }], { jc: "center" }));
  khoi.push(NHAP());
  return { ngang: false, khoi };
}
function phanHdc(P, t) {
  const rong = 16.5, tt = S.tt, D = S.dang, khoi = [];
  khoi.push(dauVb(rong, [["HƯỚNG DẪN CHẤM", { b: true }], [`ĐỀ KIỂM TRA ${tenKy()}`, { b: true }], [`NĂM HỌC ${tt.nam || "…"}`, { b: true }], [monLop(), { b: true }]]));
  if (tt.maDe) khoi.push(P_([{ t: "Mã đề: " + tt.maDe, b: true }], { jc: "right", sau: 0 }));
  const H = n => ({ t: n, b: true, jc: "center", nen: "D9E2F3" });
  P.phan.forEach(d => {
    const ds = P[d], la = ds[0].la;
    khoi.push(P_([{ t: `PHẦN ${la}. ${TEN_DAI[d]} (${f2(t.dang[d])} điểm)`, b: true }], { truoc: 160, sau: 40, giu: true }));
    if (d === "NLC" || d === "TLN") {
      const moi = d === "NLC" ? 10 : 8;
      khoi.push(P_(R(`Mỗi câu trả lời đúng được ${f2(D[d].d)} điểm.`, { i: true }), { giu: true }));
      for (let i = 0; i < ds.length; i += moi) {
        const doan = ds.slice(i, i + moi), w = (rong - 2.1) / moi;
        khoi.push({ t: "bang", cot: [2.1, ...Array(moi).fill(w)], hang: [
          [H("Câu"), ...doan.map(s => H(String(s.so))), ...Array(moi - doan.length).fill({ t: "" })],
          [{ t: "Đáp án", b: true, jc: "center" }, ...doan.map(s => { const q = S.cau[s.k] || {}; return { p: [P_(R(d === "NLC" ? (q.dung != null ? "ABCD"[q.dung] : "?") : (q.da || "?"), { b: true, mau: "C00000" }), { jc: "center", sau: 0 })] }; }), ...Array(moi - doan.length).fill({ t: "" })]
        ] });
      }
    }
    if (d === "DS") {
      if (D.DS.cham === "764") khoi.push(P_(R(`Điểm tối đa của 01 câu là ${f2(D.DS.d)} điểm. Học sinh chọn chính xác 01 ý trong 01 câu được 0,1 điểm; 02 ý được 0,25 điểm; 03 ý được 0,5 điểm; cả 04 ý được 1 điểm (cách tính theo đề thi tốt nghiệp THPT — QĐ 764/QĐ-BGDĐT; trường có quy chế riêng thì theo quy chế).`, { i: true }), { giu: true }));
      else khoi.push(P_(R(`Mỗi ý chọn đúng được ${f2(D.DS.d / 4)} điểm; tối đa ${f2(D.DS.d)} điểm/câu.`, { i: true }), { giu: true }));
      const w = (rong - 2.1) / 4;
      khoi.push({ t: "bang", cot: [2.1, w, w, w, w], hang: [[H("Câu"), H("a)"), H("b)"), H("c)"), H("d)")],
        ...ds.map(s => { const q = S.cau[s.k] || {}; return [{ t: String(s.so), b: true, jc: "center" }, ...[0, 1, 2, 3].map(i => { const y = (q.y || [])[i]; return { p: [P_([{ t: y && typeof y.d === "boolean" ? (y.d ? "Đúng" : "Sai") : "?", b: true, mau: y && y.d ? "C00000" : "1F4E79" }], { jc: "center", sau: 0 })] }; })]; })] });
    }
    if (d === "TL") {
      const hang = [[H("Câu"), H("Nội dung"), H("Điểm")]];
      ds.forEach(s => {
        const q = S.cau[s.k] || {}, hd = q.hdc && q.hdc.length ? q.hdc : [{ nd: "(Thầy cô ghi hướng dẫn chấm.)", d: "" }];
        hd.forEach((h, i) => hang.push([i === 0 ? { p: [P_([{ t: "Câu " + s.so, b: true }], { jc: "center", sau: 0 }), P_([{ t: "(" + f2(s.diem) + " điểm)", i: true }], { jc: "center", sau: 0 })], vm: hd.length > 1 ? "s" : undefined } : { vm: "c" },
          { p: [P_(R(h.nd), { sau: 0, dong: 252 })], giua: false }, { t: h.d ? f2(so(h.d)) : "", jc: "center" }]));
      });
      khoi.push({ t: "bang", cot: [2.2, rong - 2.2 - 1.8, 1.8], dau: 1, hang });
    }
  });
  khoi.push(P_([{ t: "Lưu ý: ", b: true, i: true }, { t: "Học sinh làm cách khác đúng, lập luận chặt chẽ vẫn cho điểm tối đa phần đó. Điểm toàn bài làm tròn theo quy định.", i: true }], { truoc: 120 }));
  khoi.push(P_([{ t: "Tổng điểm toàn bài: " + f2(t.tong) + " điểm.", b: true }], { sau: 120 }));
  khoi.push(kyTen(rong)); khoi.push(NHAP());
  return { ngang: false, khoi };
}
function dungPhan(chon) {
  const P = khe(), t = tinh(P), out = [];
  if (!P.phan.length) return out;
  if (chon.mt) out.push(phanMaTran(P, t));
  if (chon.dt) out.push(phanDacTa(P, t));
  if (chon.de) out.push(phanDe(P, t));
  if (chon.hd) out.push(phanHdc(P, t));
  return out;
}
