/* Bộ chung «Tổ trưởng số» — không gọi mạng, dữ liệu chỉ nằm trong trình duyệt máy này. */
const TT = (() => {
  const TIEN_TO = "tts_";
  const MAU = /(^|[#&])mau\b/.test(location.hash);
  function load(k, def) {
    if (MAU) return def;
    try { const v = localStorage.getItem(TIEN_TO + k); return v ? JSON.parse(v) : def; } catch (e) { return def; }
  }
  function save(k, v) {
    if (MAU) return false;
    try { localStorage.setItem(TIEN_TO + k, JSON.stringify(v)); return true; } catch (e) { return false; }
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function toast(msg, loai) {
    let h = document.getElementById("tts-toast");
    if (!h) { h = document.createElement("div"); h.id = "tts-toast"; document.body.appendChild(h); }
    const d = document.createElement("div"); d.className = loai || ""; d.textContent = msg; h.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }
  let ac = null;
  function am(tan, dai, kieu, to) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = kieu || "sine"; o.frequency.value = tan; g.gain.value = to || 0.08;
      o.connect(g); g.connect(ac.destination); const t = ac.currentTime;
      g.gain.setValueAtTime(to || 0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dai);
      o.start(t); o.stop(t + dai);
    } catch (e) {}
  }
  function ting() { am(880, .18); setTimeout(() => am(1320, .25), 90); }
  function buzz() { am(180, .25, "sawtooth", .05); }
  function phaoGiay(x, y) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"); c.className = "phao"; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    const g = c.getContext("2d"), mau = ["#6366f1", "#14b8a6", "#f59e0b", "#ec4899", "#22c55e", "#8b5cf6"];
    x = x == null ? innerWidth / 2 : x; y = y == null ? innerHeight / 3 : y;
    const ht = Array.from({ length: 90 }, () => ({ x, y, vx: (Math.random() - .5) * 11, vy: -Math.random() * 10 - 3, r: Math.random() * 6 + 3, m: mau[Math.random() * 6 | 0], q: Math.random() * 6 }));
    let n = 0;
    (function ve() {
      g.clearRect(0, 0, c.width, c.height);
      ht.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.q += .2; g.save(); g.translate(p.x, p.y); g.rotate(p.q); g.fillStyle = p.m; g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore(); });
      if (++n < 90) requestAnimationFrame(ve); else c.remove();
    })();
  }
  function taiVe(ten, noiDung, kieu) {
    const b = new Blob([noiDung], { type: kieu || "text/plain;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = ten;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function homNay() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function saoLuu(khoa, tenFile) {
    const goi = { ung_dung: "to-truong-so", ngay: homNay(), du_lieu: {} };
    khoa.forEach(k => goi.du_lieu[k] = load(k, null));
    taiVe((tenFile || "sao-luu") + "-" + homNay() + ".json", JSON.stringify(goi, null, 2), "application/json");
    toast("Đã tải file sao lưu về máy", "ok");
  }
  function nhapLai(khoa, xong) {
    const i = document.createElement("input"); i.type = "file"; i.accept = ".json,application/json";
    i.onchange = () => {
      const f = i.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const goi = JSON.parse(r.result);
          if (!goi || goi.ung_dung !== "to-truong-so") throw 0;
          let n = 0; Object.keys(goi.du_lieu || {}).forEach(k => { if ((!khoa || khoa.includes(k)) && goi.du_lieu[k] != null) { save(k, goi.du_lieu[k]); n++; } });
          toast("Đã nhập lại " + n + " phần dữ liệu", "ok"); ting(); xong && xong();
        } catch (e) { toast("File này không phải file sao lưu của Tổ trưởng số", "loi"); buzz(); }
      };
      r.readAsText(f);
    };
    i.click();
  }
  function csv(hang) { return "﻿" + hang.map(r => r.map(o => { o = String(o == null ? "" : o); return /[",\n;]/.test(o) ? '"' + o.replace(/"/g, '""') + '"' : o; }).join(",")).join("\r\n"); }
  function docCSV(text) {
    const dong = text.replace(/\r/g, "").split("\n").filter(d => d.trim());
    if (!dong.length) return [];
    const tach = dong[0].includes("\t") ? "\t" : (dong[0].split(";").length > dong[0].split(",").length ? ";" : ",");
    return dong.map(d => {
      const out = []; let o = "", q = false;
      for (let i = 0; i < d.length; i++) {
        const c = d[i];
        if (q) { if (c === '"' && d[i + 1] === '"') { o += '"'; i++; } else if (c === '"') q = false; else o += c; }
        else if (c === '"') q = true; else if (c === tach) { out.push(o.trim()); o = ""; } else o += c;
      }
      out.push(o.trim()); return out;
    });
  }
  /* Biểu đồ cột (canvas, không thư viện). nhom: [{ten, mau, gt:[...]}] */
  function bieuDoCot(cv, nhan, nhom, tuyChon) {
    tuyChon = tuyChon || {};
    const dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 600, H = cv.clientHeight || 260;
    cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext("2d"); g.scale(dpr, dpr); g.clearRect(0, 0, W, H);
    const tren = 18, duoi = 34, trai = 34, phai = 8, cao = H - tren - duoi, rong = W - trai - phai;
    let max = tuyChon.max || Math.max(1, ...nhom.flatMap(n => n.gt));
    const buoc = max <= 5 ? 1 : max <= 12 ? 2 : Math.ceil(max / 5);
    max = Math.ceil(max / buoc) * buoc;
    g.font = "12px Segoe UI, Arial"; g.fillStyle = "#64748b"; g.strokeStyle = "#e2e8f0"; g.textAlign = "right";
    for (let v = 0; v <= max; v += buoc) { const y = tren + cao - v / max * cao; g.beginPath(); g.moveTo(trai, y); g.lineTo(W - phai, y); g.stroke(); g.fillText(v + (tuyChon.donVi || ""), trai - 5, y + 4); }
    const o = rong / nhan.length, cot = Math.min(46, (o * .74) / nhom.length);
    nhan.forEach((t, i) => {
      nhom.forEach((n, j) => {
        const v = n.gt[i] || 0, h = v / max * cao, x = trai + i * o + (o - cot * nhom.length) / 2 + j * cot, y = tren + cao - h;
        const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, n.mau); gr.addColorStop(1, n.mau2 || n.mau + "99");
        g.fillStyle = gr; const r = Math.min(6, cot / 2, h);
        g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.lineTo(x + cot - 2 - r, y); g.quadraticCurveTo(x + cot - 2, y, x + cot - 2, y + r); g.lineTo(x + cot - 2, y + h); g.fill();
        if (v && tuyChon.soTren !== false) { g.fillStyle = "#1e1b4b"; g.textAlign = "center"; g.font = "bold 12px Segoe UI, Arial"; g.fillText(tuyChon.dinhDang ? tuyChon.dinhDang(v) : v, x + cot / 2 - 1, y - 4); g.font = "12px Segoe UI, Arial"; }
      });
      g.fillStyle = "#475569"; g.textAlign = "center"; g.fillText(t, trai + i * o + o / 2, H - duoi + 18);
    });
  }
  /* Vành tròn SVG: phan [{gt, mau}] */
  function vanh(phan, kich, day, giua) {
    kich = kich || 140; day = day || 18; const r = (kich - day) / 2, cv = 2 * Math.PI * r, tong = phan.reduce((a, p) => a + p.gt, 0) || 1;
    let bd = 0, s = `<svg viewBox="0 0 ${kich} ${kich}" width="${kich}" height="${kich}" role="img"><circle cx="${kich / 2}" cy="${kich / 2}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="${day}"/>`;
    phan.forEach(p => { const l = p.gt / tong * cv; if (l > 0) s += `<circle cx="${kich / 2}" cy="${kich / 2}" r="${r}" fill="none" stroke="${p.mau}" stroke-width="${day}" stroke-dasharray="${l} ${cv - l}" stroke-dashoffset="${-bd}" transform="rotate(-90 ${kich / 2} ${kich / 2})" stroke-linecap="butt"/>`; bd += l; });
    if (giua) s += `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="${kich / 5.2}" font-weight="800" fill="#1e1b4b">${giua}</text>`;
    return s + "</svg>";
  }
  function moDau() {
    if (MAU) { const r = document.createElement("div"); r.className = "mau-ribbon"; r.textContent = "DỮ LIỆU THỬ"; document.body.appendChild(r); }
  }
  document.addEventListener("DOMContentLoaded", moDau);
  return { MAU, load, save, esc, uid, toast, ting, buzz, phaoGiay, taiVe, homNay, saoLuu, nhapLai, csv, docCSV, bieuDoCot, vanh };
})();
