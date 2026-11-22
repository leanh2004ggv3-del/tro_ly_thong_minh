/* Công thức Toán, Lí, Hoá: chữ kiểu LaTeX trong $…$ → công thức Word thật (OMML/Equation) + HTML xem trước.
   Hỗ trợ: \frac \sqrt[n]{} ^ _ \left( \right) \begin{cases}/array/aligned \widehat \vec \overline \xrightarrow{t^\circ}
   \sum \int \lim, hàm sin cos log ln…, chữ Hi Lạp, kí hiệu (≤ ≥ ≠ ≈ ± · × ∈ ⇒ ⇔ → ⇌ °…), \text{}, \mathrm{}, \mathbb{R}. */
const CT = (() => {
  const SYM = {
    cdot: "·", times: "×", div: ":", pm: "±", mp: "∓", le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", approx: "≈", equiv: "≡", sim: "∼", simeq: "≃",
    infty: "∞", in: "∈", notin: "∉", ni: "∋", subset: "⊂", subseteq: "⊆", supset: "⊃", cup: "∪", cap: "∩", setminus: "∖", emptyset: "∅", varnothing: "∅", forall: "∀", exists: "∃",
    Rightarrow: "⇒", Leftarrow: "⇐", Leftrightarrow: "⇔", rightarrow: "→", to: "→", leftarrow: "←", leftrightarrow: "↔", rightleftharpoons: "⇌", leftrightarrows: "⇄", uparrow: "↑", downarrow: "↓", longrightarrow: "⟶", implies: "⇒", iff: "⇔",
    perp: "⊥", parallel: "∥", angle: "∠", triangle: "△", circ: "∘", degree: "°", prime: "′", ldots: "…", cdots: "⋯", dots: "…", vdots: "⋮", star: "⋆", bullet: "•", mid: "∣", nmid: "∤", propto: "∝", ell: "ℓ", hbar: "ℏ", partial: "∂", nabla: "∇", backslash: "\\",
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", vartheta: "ϑ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", varphi: "φ", chi: "χ", psi: "ψ", omega: "ω",
    Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π", Sigma: "Σ", Upsilon: "Υ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
    "%": "%", "$": "$", "#": "#", "&": "&", "_": "_", "{": "{", "}": "}", ",": " ", ";": " ", ":": " ", "!": "", " ": " ", quad: " ", qquad: "  ", "|": "‖", lbrace: "{", rbrace: "}", langle: "⟨", rangle: "⟩", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉"
  };
  const HAM = new Set(["sin", "cos", "tan", "cot", "tg", "cotg", "log", "ln", "lg", "exp", "max", "min", "det", "arcsin", "arccos", "arctan", "sinh", "cosh"]);
  const NARY = { sum: "∑", prod: "∏", int: "∫", iint: "∬", iiint: "∭", oint: "∮" };
  const ACC = { widehat: "̂", hat: "̂", vec: "⃗", overrightarrow: "⃗", tilde: "̃", widetilde: "̃", dot: "̇" };
  const BB = { R: "ℝ", N: "ℕ", Z: "ℤ", Q: "ℚ", C: "ℂ" };
  const BO_QUA = new Set(["displaystyle", "textstyle", "limits", "nolimits", "big", "Big", "bigg", "Bigg", "bigl", "bigr", "Bigl", "Bigr", "biggl", "biggr", "nonumber", "notag"]);
  const CHU = new Set(["text", "textrm", "mbox", "mathrm", "operatorname", "textit", "textbf", "textnormal", "rm"]);
  const xe = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------- đọc LaTeX thành cây ---------- */
  function phanTich(src, loi) {
    let i = 0;
    const khop = d => src.startsWith(d, i) && !(d[0] === "\\" && /[a-zA-Z]/.test(src[i + d.length] || ""));
    const boTrang = () => { while (i < src.length && /\s/.test(src[i])) i++; };
    const ten = () => { const m = src.slice(i).match(/^\\([a-zA-Z]+|.)/); if (!m) { i++; return ""; } i += m[0].length; return m[1]; };
    function tho() {
      boTrang(); if (src[i] !== "{") return src[i++] || "";
      let d = 0, j = i; for (; j < src.length; j++) { if (src[j] === "{") d++; else if (src[j] === "}") { d--; if (!d) break; } }
      if (j >= src.length) loi.push("thiếu dấu }");
      const s = src.slice(i + 1, j); i = j + 1; return s;
    }
    function doiSo() {
      boTrang();
      if (src[i] === "{") { i++; const g = nhom("}"); if (src[i] === "}") i++; return g; }
      if (src[i] === "\\") { const ds = []; lenh(ds); return ds; }
      if (i < src.length) return [{ t: "x", s: src[i++] }];
      loi.push("thiếu phần sau ^ / _ / \\frac"); return [];
    }
    function ngoac() {
      boTrang();
      if (src[i] === "\\") { const n = ten(); return { "{": "{", "}": "}", lbrace: "{", rbrace: "}", "|": "‖", langle: "⟨", rangle: "⟩", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉" }[n] || ""; }
      const c = src[i++]; return c === "." || c == null ? "" : c;
    }
    function lenh(ds) {
      const n = ten();
      if (n === "frac" || n === "dfrac" || n === "tfrac" || n === "cfrac") { const a = doiSo(), b = doiSo(); ds.push({ t: "frac", a, b }); return; }
      if (n === "sqrt") { boTrang(); let k = null; if (src[i] === "[") { i++; k = nhom("]"); if (src[i] === "]") i++; } ds.push({ t: "sqrt", k, a: doiSo() }); return; }
      if (n === "left") { const l = ngoac(); const a = nhom("\\right"); let r = ""; if (khop("\\right")) { i += 6; r = ngoac(); } else loi.push("thiếu \\right"); ds.push({ t: "d", l, r, a }); return; }
      if (n === "right") { ngoac(); loi.push("thừa \\right"); return; }
      if (n === "begin") {
        const env = tho(); if (/array|tabular/.test(env)) { boTrang(); if (src[i] === "{") tho(); }
        const a = nhom("\\end"); if (khop("\\end")) { i += 4; tho(); } else loi.push("thiếu \\end{" + env + "}");
        const rows = [[]]; a.forEach(x => { if (x.t === "nl") rows.push([]); else if (x.t !== "amp") rows[rows.length - 1].push(x); });
        const r = rows.filter(x => x.length);
        if (/matrix/.test(env)) ds.push({ t: "d", l: env[0] === "b" ? "[" : env[0] === "v" ? "|" : "(", r: env[0] === "b" ? "]" : env[0] === "v" ? "|" : ")", a: [{ t: "arr", rows: r }] });
        else ds.push({ t: "arr", cases: env === "cases", rows: r });
        return;
      }
      if (n === "end") { tho(); loi.push("thừa \\end"); return; }
      if (n === "\\") { boTrang(); if (src[i] === "[") { while (i < src.length && src[i] !== "]") i++; i++; } ds.push({ t: "nl" }); return; }
      if (CHU.has(n)) { ds.push({ t: "x", s: tho().replace(/\\([%$#&_{}])/g, "$1").replace(/~/g, " "), up: true }); return; }
      if (n === "mathbb" || n === "Bbb") { const s = tho(); ds.push({ t: "x", s: [...s].map(c => BB[c] || c).join(""), up: true }); return; }
      if (n === "mathbf" || n === "boldsymbol" || n === "mathit" || n === "mathcal" || n === "bm") { ds.push({ t: "g", a: doiSo() }); return; }
      if (ACC[n]) { ds.push({ t: "acc", c: ACC[n], a: doiSo() }); return; }
      if (n === "overline" || n === "bar") { ds.push({ t: "bar", a: doiSo() }); return; }
      if (/^x(right|left)/.test(n)) {
        boTrang(); if (src[i] === "[") { i++; nhom("]"); if (src[i] === "]") i++; }
        ds.push({ t: "mui", c: /harpoons/.test(n) ? "⇌" : /^xleftrightarrow/.test(n) ? "⟷" : /^xleft/.test(n) ? "⟵" : "⟶", a: doiSo() }); return;
      }
      if (n === "overset" || n === "stackrel") { const tren = doiSo(), duoi = doiSo(); ds.push({ t: "mui", c: duoi.map(x => x.s || "").join("") || "→", a: tren }); return; }
      if (NARY[n]) { ds.push({ t: "nary", c: NARY[n] }); return; }
      if (n === "lim") { ds.push({ t: "x", s: "lim", up: true, lim: true }); return; }
      if (HAM.has(n)) { ds.push({ t: "x", s: n, up: true }); return; }
      if (BO_QUA.has(n)) return;
      if (n in SYM) { if (SYM[n]) ds.push({ t: "x", s: SYM[n] }); return; }
      loi.push("lệnh lạ \\" + n); ds.push({ t: "x", s: n, up: true });
    }
    function nhom(dung) {
      const ds = [];
      while (i < src.length) {
        if (dung && khop(dung)) return ds;
        const c = src[i];
        if (c === "{") { i++; ds.push({ t: "g", a: nhom("}") }); if (src[i] === "}") i++; continue; }
        if (c === "}") { i++; loi.push("thừa dấu }"); continue; }
        if (c === "^" || c === "_") {
          i++; const a = doiSo(); let b = ds.pop() || { t: "x", s: "" };
          if (b.t !== "sc") b = { t: "sc", e: b };
          if (c === "^") { if (b.sup) loi.push("hai số mũ liền nhau (dùng ngoặc {})"); b.sup = a; } else { if (b.sub) loi.push("hai chỉ số dưới liền nhau"); b.sub = a; }
          ds.push(b); continue;
        }
        if (c === "\\") { lenh(ds); continue; }
        if (c === "&") { i++; ds.push({ t: "amp" }); continue; }
        if (c === "~") { i++; ds.push({ t: "x", s: " " }); continue; }
        if (/\s/.test(c)) { i++; continue; }
        if (c === "'") { i++; ds.push({ t: "x", s: "′" }); continue; }
        // nhiều chữ số / số thập phân đi liền: một khối
        const m = src.slice(i).match(/^\d+(?:[.,]\d+)*/);
        if (m) { ds.push({ t: "x", s: m[0] }); i += m[0].length; continue; }
        ds.push({ t: "x", s: c }); i++;
      }
      if (dung === "}") loi.push("thiếu dấu }");
      else if (dung === "]") loi.push("thiếu dấu ]");
      return ds;
    }
    return nhom(null);
  }
  /* công thức hoá học (H_2SO_4, Fe^{3+}, phương trình có mũi tên) → chữ đứng, không nghiêng */
  function laHoa(src) {
    const s = src.replace(/\\x(right|left)[a-z]*(\[[^\]]*\])?\{[^}]*\}/g, " ").replace(/\\(text|mathrm)\{[^}]*\}/g, " ").replace(/\^\\circ/g, " ").replace(/\\[a-zA-Z]+/g, " ");
    if (!/[A-Z]/.test(s) || /[a-z]/.test(s.replace(/[A-Z][a-z]?/g, ""))) return false;
    return /_\{?\d|\\x?(right|left)|→|⇌|⟶|\^\{?\d*[+-]\}?/.test(src);
  }

  /* ---------- cây → OMML (Word) ---------- */
  function rO(s, up) {
    return `<m:r>${up ? '<m:rPr><m:sty m:val="p"/></m:rPr>' : ""}<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><m:t xml:space="preserve">${xe(s)}</m:t></m:r>`;
  }
  const doDo = n => n.sup && n.sup.length === 1 && n.sup[0].t === "x" && /^[∘°]$/.test(n.sup[0].s) && !n.sub;
  function om(ds, hoa) {
    let s = "", buf = "", up = null;
    const xa = () => { if (buf) s += rO(buf, up); buf = ""; };
    for (let k = 0; k < ds.length; k++) {
      const n = ds[k];
      if (n.t === "x") {   // chữ biến (x, y, α) nghiêng; số, dấu, chữ Hi Lạp hoa, đơn vị: đứng
        for (const c of (n.up || hoa ? [n.s] : n.s.match(/[A-Za-zα-ω]+|[^A-Za-zα-ω]+/g) || [])) {
          const u = !!(n.up || hoa || !/^[A-Za-zα-ω]/.test(c)); if (buf && u !== up) xa(); up = u; buf += c;
        }
        continue;
      }
      xa();
      if (n.t === "nl" || n.t === "amp") continue;
      if (n.t === "g") s += om(n.a, hoa);
      else if (n.t === "frac") s += `<m:f><m:num>${om(n.a, hoa)}</m:num><m:den>${om(n.b, hoa)}</m:den></m:f>`;
      else if (n.t === "sqrt") s += n.k && n.k.length ? `<m:rad><m:deg>${om(n.k, hoa)}</m:deg><m:e>${om(n.a, hoa)}</m:e></m:rad>` : `<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>${om(n.a, hoa)}</m:e></m:rad>`;
      else if (n.t === "d") s += `<m:d><m:dPr><m:begChr m:val="${xe(n.l)}"/><m:endChr m:val="${xe(n.r)}"/></m:dPr><m:e>${om(n.a, hoa)}</m:e></m:d>`;
      else if (n.t === "arr") { const a = `<m:eqArr>${n.rows.map(r => `<m:e>${om(r, hoa)}</m:e>`).join("") || "<m:e/>"}</m:eqArr>`; s += n.cases ? `<m:d><m:dPr><m:begChr m:val="{"/><m:endChr m:val=""/></m:dPr><m:e>${a}</m:e></m:d>` : a; }
      else if (n.t === "acc") s += `<m:acc><m:accPr><m:chr m:val="${n.c}"/></m:accPr><m:e>${om(n.a, hoa)}</m:e></m:acc>`;
      else if (n.t === "bar") s += `<m:bar><m:barPr><m:pos m:val="top"/></m:barPr><m:e>${om(n.a, hoa)}</m:e></m:bar>`;
      else if (n.t === "mui") s += `<m:limUpp><m:e>${rO(n.c, true)}</m:e><m:lim>${om(n.a, hoa)}</m:lim></m:limUpp>`;
      else if (n.t === "nary") { s += nary(n.c, null, null, ds.slice(k + 1), hoa); k = ds.length; }
      else if (n.t === "sc") {
        const e = n.e;
        if (e.t === "nary") { s += nary(e.c, n.sub, n.sup, ds.slice(k + 1), hoa); k = ds.length; continue; }
        if (e.lim && n.sub && !n.sup) { s += `<m:limLow><m:e>${om([e], hoa)}</m:e><m:lim>${om(n.sub, hoa)}</m:lim></m:limLow>`; continue; }
        if (doDo(n)) { s += om([e, { t: "x", s: "°", up: true }], hoa); continue; }
        const E = `<m:e>${om([e], hoa)}</m:e>`;
        if (n.sub && n.sup) s += `<m:sSubSup>${E}<m:sub>${om(n.sub, hoa)}</m:sub><m:sup>${om(n.sup, hoa)}</m:sup></m:sSubSup>`;
        else if (n.sup) s += `<m:sSup>${E}<m:sup>${om(n.sup, hoa)}</m:sup></m:sSup>`;
        else s += `<m:sSub>${E}<m:sub>${om(n.sub || [], hoa)}</m:sub></m:sSub>`;
      }
    }
    xa(); return s;
  }
  function nary(c, sub, sup, con, hoa) {
    return `<m:nary><m:naryPr><m:chr m:val="${c}"/>${sub ? "" : '<m:subHide m:val="1"/>'}${sup ? "" : '<m:supHide m:val="1"/>'}</m:naryPr><m:sub>${sub ? om(sub, hoa) : ""}</m:sub><m:sup>${sup ? om(sup, hoa) : ""}</m:sup><m:e>${om(con, hoa)}</m:e></m:nary>`;
  }

  /* ---------- cây → HTML (xem trước) ---------- */
  function ht(ds, hoa) {
    let s = "";
    for (let k = 0; k < ds.length; k++) {
      const n = ds[k];
      if (n.t === "x") { s += !n.up && !hoa && /^[A-Za-zα-ω]+$/.test(n.s) ? `<i>${xe(n.s)}</i>` : xe(n.s).replace(/^ $/, "&nbsp;"); continue; }
      if (n.t === "nl" || n.t === "amp") continue;
      if (n.t === "g") s += ht(n.a, hoa);
      else if (n.t === "frac") s += `<span class="ct-f"><span>${ht(n.a, hoa)}</span><span>${ht(n.b, hoa)}</span></span>`;
      else if (n.t === "sqrt") s += `<span class="ct-r">${n.k && n.k.length ? `<sup>${ht(n.k, hoa)}</sup>` : ""}√<span class="ct-rr">${ht(n.a, hoa)}</span></span>`;
      else if (n.t === "d") s += `${xe(n.l)}${ht(n.a, hoa)}${xe(n.r)}`;
      else if (n.t === "arr") s += `<span class="ct-he">${n.cases ? '<span class="ct-ng">{</span>' : ""}<span class="ct-dong">${n.rows.map(r => `<span>${ht(r, hoa)}</span>`).join("")}</span></span>`;
      else if (n.t === "acc") s += `<span class="ct-acc" data-c="${n.c === "⃗" ? "→" : n.c === "̃" ? "~" : "^"}">${ht(n.a, hoa)}</span>`;
      else if (n.t === "bar") s += `<span style="text-decoration:overline">${ht(n.a, hoa)}</span>`;
      else if (n.t === "mui") s += `<span class="ct-mui"><small>${ht(n.a, hoa)}</small><span>${xe(n.c)}</span></span>`;
      else if (n.t === "nary") s += `<span class="ct-n">${n.c}</span>`;
      else if (n.t === "sc") {
        const e = n.e;
        if (e.lim && n.sub && !n.sup) { s += `<span class="ct-mui"><span>lim</span><small>${ht(n.sub, hoa)}</small></span>`; continue; }
        if (doDo(n)) { s += ht([e], hoa) + "°"; continue; }
        s += (e.t === "nary" ? `<span class="ct-n">${e.c}</span>` : ht([e], hoa)) + (n.sup ? `<sup>${ht(n.sup, hoa)}</sup>` : "") + (n.sub ? `<sub>${ht(n.sub, hoa)}</sub>` : "");
      }
    }
    return s;
  }

  /* ---------- dùng ngoài ---------- */
  function tach(s) {   // chữ thường / công thức $…$ ; \$ là dấu đô la thật
    s = String(s == null ? "" : s); const out = []; let i = 0, chu = "";
    while (i < s.length) {
      if (s[i] === "\\" && s[i + 1] === "$") { chu += "$"; i += 2; continue; }
      if (s[i] === "$") {
        let j = i + 1; while (j < s.length && !(s[j] === "$" && s[j - 1] !== "\\")) j++;
        if (j >= s.length) { chu += s.slice(i); break; }
        if (chu) out.push({ t: "chu", s: chu }); chu = "";
        out.push({ t: "ct", src: s.slice(i + 1, j) }); i = j + 1; continue;
      }
      chu += s[i++];
    }
    if (chu) out.push({ t: "chu", s: chu });
    return out;
  }
  const cache = new Map();
  function cay(src) { if (!cache.has(src)) { const loi = []; const c = phanTich(src, loi); cache.set(src, { c, loi: [...new Set(loi)], hoa: laHoa(src) }); if (cache.size > 3000) cache.clear(); } return cache.get(src); }
  const omml = src => { const k = cay(src); return om(k.c, k.hoa); };
  const html = src => { const k = cay(src); return `<span class="ct">${ht(k.c, k.hoa)}</span>`; };
  function kiem(s) {   // lỗi công thức trong một đoạn chữ
    const loi = [];
    String(s == null ? "" : s).split("\n").forEach(d => {
      const so$ = (d.replace(/\\\$/g, "").match(/\$/g) || []).length;
      if (so$ % 2) loi.push("thiếu một dấu $ (công thức phải nằm giữa hai dấu $)");
      tach(d).forEach(p => { if (p.t === "ct") cay(p.src).loi.forEach(l => loi.push(l + " trong $" + p.src.slice(0, 40) + (p.src.length > 40 ? "…" : "") + "$")); });
      // LaTeX viết ngoài $…$
      tach(d).forEach(p => { if (p.t === "chu" && /\\(frac|sqrt|left|begin|cdot|times|le|ge|ne|pi|alpha|Delta|widehat|xrightarrow|circ)\b/.test(p.s)) loi.push("có lệnh công thức nằm ngoài $…$"); });
    });
    return [...new Set(loi)];
  }
  const coCT = s => /\$[^$]+\$/.test(String(s || ""));
  const htmlChu = s => tach(s).map(p => p.t === "ct" ? html(p.src) : xe(p.s).replace(/([\^_])(\{([^{}]*)\}|[+\-−]?[0-9]+|[A-Za-z])/g, (m, a, b, c) => `<${a === "^" ? "sup" : "sub"}>${c != null ? c : b}</${a === "^" ? "sup" : "sub"}>`)).join("");
  const thuan = s => htmlChu(s).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  return { tach, omml, html, htmlChu, kiem, thuan, coCT, laHoa };
})();
if (typeof module !== "undefined") module.exports = CT;
