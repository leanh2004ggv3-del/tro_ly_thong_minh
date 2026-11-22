// liet_ke.js — liệt kê mọi câu (đọc cả tên) và từ (đọc ghép từng từ) cần thu tiếng. In JSON ra stdout.
const T = require("./src/ten.js");
const cau = new Set(), tu = new Set();
const themCau = t => { if (t) cau.add(t); };
const themTu = t => { if (t) T.loiDoc(t).split(" ").forEach(w => w && tu.add(w)); };

T.NT.forEach(e => { themCau(e.ten); themTu(e.ten); });
T.DS_HC.forEach(f => { const r = T.ghep(f); if (r.ok) { themCau(r.ten); themTu(r.ten); if (r.thuong) themCau(r.thuong); } });
Object.values(T.RIENG).forEach(([t]) => { themCau(t); themTu(t); });
Object.values(T.HUU_CO).forEach(([t, th]) => { themCau(t); if (th) themCau(th); });
// hữu cơ: mọi tổ hợp số C × loại × vị trí
for (let n = 1; n <= 10; n++) for (const loai of Object.keys(T.HO)) for (let vt = 1; vt <= n; vt++) {
  const r = T.tenHuuCo(n, loai, vt); if (r.ok) { themCau(r.ten); if (r.thuong) themCau(r.thuong); }
}
// vô cơ ghép tự do: mọi cation × hoá trị × gốc → chỉ cần từ
for (const [kl, ds] of Object.entries(T.KL)) for (const q of ds) for (const an of Object.values(T.AN)) themTu(T.NT_K[kl].ten + (ds.length > 1 ? "(" + T.LA_MA[q] + ")" : "") + " " + an.manh.map(x => x.t).join(""));
for (const an of Object.values(T.AN)) { themTu("ammonium " + an.manh.map(x => x.t).join("")); if (an.acid) themTu(an.acid); }
// hai phi kim: tiền tố × phi kim
const PK = ["B", "Si", "C", "As", "P", "N", "H", "Se", "S", "I", "Br", "Cl", "O", "F"];
for (const a of PK) for (const b of PK) if (a !== b) for (let n1 = 1; n1 <= 4; n1++) for (const n2 of [1, 2, 3, 4, 5, 6, 7, 10]) {
  const ct = a + (n1 > 1 ? n1 : "") + b + (n2 > 1 ? n2 : ""); const r = T.ghep(ct); if (r.ok && r.loai === "hai phi kim") themTu(r.ten);
}
for (let k = 1; k <= 10; k++) themTu(T.TIEN_TO[k] + "hydrate");
process.stdout.write(JSON.stringify({ cau: [...cau], tu: [...tu] }));
