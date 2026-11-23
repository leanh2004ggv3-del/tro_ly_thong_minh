/* Tự tạo ảnh minh hoạ (SVG → PNG) — không cần mạng, không cần AI:
   1) tranh chủ đề (theo từ khoá của slide), 2) đồ thị hàm số y = f(x), 3) hình học có đặt tên đỉnh. */
const AT = (() => {
  const xe = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const h = c => "#" + c;
  function khung(m, noi, nen) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><defs>
<linearGradient id="gn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${h(m.nen2 || "EFF6FF")}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${h(m.c1)}"/><stop offset="1" stop-color="${h(m.c2)}"/></linearGradient>
<linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h(m.nhan)}"/><stop offset="1" stop-color="${h(m.nhan)}" stop-opacity=".75"/></linearGradient>
<filter id="bo" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#0f172a" flood-opacity=".18"/></filter></defs>
${nen === false ? "" : `<rect width="800" height="600" fill="url(#gn)"/><path d="M90 470 C 40 330 120 140 300 110 C 470 80 640 120 700 260 C 760 400 690 520 520 545 C 360 570 140 600 90 470Z" fill="${h(m.nhat)}" opacity=".55"/>
<g fill="${h(m.c2)}" opacity=".35"><circle cx="110" cy="110" r="9"/><circle cx="700" cy="90" r="6"/><circle cx="730" cy="500" r="11"/><circle cx="70" cy="300" r="5"/></g>
<g stroke="${h(m.nhan)}" stroke-width="5" stroke-linecap="round" opacity=".7"><path d="M650 170l18-18M668 170l-18-18"/><path d="M140 520l14-14M154 520l-14-14"/></g>`}
${noi}</svg>`;
  }
  /* ---------- 1) tranh chủ đề ---------- */
  const T = {
    ytuong: m => `<g filter="url(#bo)"><circle cx="400" cy="250" r="125" fill="url(#g2)"/><path d="M345 360h110v40a20 20 0 0 1-20 20h-70a20 20 0 0 1-20-20z" fill="${h(m.c1)}"/><rect x="355" y="430" width="90" height="22" rx="11" fill="${h(m.c2)}"/></g>
<path d="M360 300c0-40 80-40 80 0M400 300v60" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="350" cy="205" r="26" fill="#fff" opacity=".5"/>
<g stroke="${h(m.nhan)}" stroke-width="12" stroke-linecap="round"><path d="M400 70v-30M250 120l-22-22M550 120l22-22M215 250h-35M585 250h35"/></g>`,
    muctieu: m => `<g filter="url(#bo)"><circle cx="380" cy="310" r="190" fill="#fff"/><circle cx="380" cy="310" r="150" fill="url(#g1)"/><circle cx="380" cy="310" r="108" fill="#fff"/><circle cx="380" cy="310" r="68" fill="${h(m.c1)}"/><circle cx="380" cy="310" r="30" fill="${h(m.nhan)}"/></g>
<path d="M385 305L610 120" stroke="#334155" stroke-width="12" stroke-linecap="round"/><path d="M610 120l-8-55 48 22zM610 120l55 8-22 -48z" fill="${h(m.c2)}"/><path d="M600 128l58-58" stroke="${h(m.nhan)}" stroke-width="6"/>`,
    sach: m => `<g filter="url(#bo)"><path d="M150 180c90-40 170-30 250 20v280c-80-50-160-60-250-20z" fill="#fff"/><path d="M650 180c-90-40-170-30-250 20v280c80-50 160-60 250-20z" fill="#fff"/>
<path d="M140 470c95-40 180-30 260 20 80-50 165-60 260-20v18c-95-40-180-30-260 20-80-50-165-60-260-20z" fill="url(#g1)"/></g>
<g stroke="${h(m.nhat)}" stroke-width="10" stroke-linecap="round"><path d="M195 240c55-18 110-14 160 10M195 290c55-18 110-14 160 10M195 340c55-18 110-14 160 10"/></g>
<g stroke="${h(m.c1)}" stroke-width="10" stroke-linecap="round" opacity=".55"><path d="M445 250c50-24 105-28 160-10M445 300c50-24 105-28 160-10M445 350c50-24 80-26 110-18"/></g>
<g transform="rotate(35 610 150)" filter="url(#bo)"><rect x="590" y="40" width="34" height="200" rx="8" fill="${h(m.nhan)}"/><path d="M590 240h34l-17 40z" fill="#fde68a"/><path d="M602 268h10l-5 12z" fill="#334155"/></g>`,
    luyentap: m => `<g filter="url(#bo)" transform="rotate(-6 400 300)"><rect x="200" y="110" width="380" height="420" rx="20" fill="#fff"/><rect x="200" y="110" width="44" height="420" rx="16" fill="url(#g1)"/>
<g stroke="${h(m.nhat)}" stroke-width="6"><path d="M270 200h270M270 260h270M270 320h270M270 380h270M270 440h200"/></g>
<path d="M290 250l28 30 54-60" stroke="${h(m.c2)}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M290 370l28 30 54-60" stroke="${h(m.c2)}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
<g transform="rotate(40 600 320)" filter="url(#bo)"><rect x="580" y="140" width="44" height="260" rx="8" fill="${h(m.nhan)}"/><rect x="580" y="140" width="44" height="36" rx="8" fill="#f472b6"/><path d="M580 400h44l-22 52z" fill="#fde68a"/><path d="M594 434h16l-8 18z" fill="#334155"/></g>`,
    vandung: m => {
      const rang = (cx, cy, r, n, mau) => { let d = ""; for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n; d += `<rect x="${cx - 14}" y="${cy - r - 26}" width="28" height="40" rx="6" fill="${mau}" transform="rotate(${a * 180 / Math.PI} ${cx} ${cy})"/>`; } return d + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${mau}"/><circle cx="${cx}" cy="${cy}" r="${r * .38}" fill="#fff"/>`; };
      return `<g filter="url(#bo)">${rang(320, 320, 120, 10, h(m.c1))}${rang(535, 205, 75, 8, h(m.c2))}${rang(560, 430, 55, 7, h(m.nhan))}</g>`;
    },
    cauhoi: m => `<g filter="url(#bo)"><path d="M170 140h400a50 50 0 0 1 50 50v190a50 50 0 0 1-50 50H330l-90 70 10-70h-80a50 50 0 0 1-50-50V190a50 50 0 0 1 50-50z" fill="url(#g1)"/></g>
<text x="370" y="375" text-anchor="middle" font-family="Georgia, Times New Roman, serif" font-size="230" font-weight="700" fill="#fff">?</text>
<g filter="url(#bo)"><circle cx="630" cy="430" r="70" fill="${h(m.nhan)}"/></g><text x="630" y="462" text-anchor="middle" font-family="Georgia, serif" font-size="96" font-weight="700" fill="#fff">!</text>`,
    khampha: m => `<g filter="url(#bo)"><circle cx="350" cy="260" r="150" fill="#fff"/><circle cx="350" cy="260" r="150" fill="none" stroke="url(#g1)" stroke-width="34"/></g>
<circle cx="350" cy="260" r="116" fill="${h(m.nhat)}" opacity=".6"/><path d="M290 200a80 80 0 0 1 70-40" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/>
<g filter="url(#bo)"><path d="M455 375l40-40 170 170a28 28 0 0 1-40 40z" fill="${h(m.nhan)}"/></g><path d="M455 375l40-40 30 30-40 40z" fill="#334155"/>`,
    hoahoc: m => `<g filter="url(#bo)"><path d="M300 110h120v20h-12v120l120 210a30 30 0 0 1-26 45H218a30 30 0 0 1-26-45l120-210V130h-12z" fill="#fff"/></g>
<path d="M232 400l70-120h116l70 120a30 30 0 0 1-26 45H258a30 30 0 0 1-26-45z" fill="url(#g1)" opacity=".9"/><g fill="#fff" opacity=".7"><circle cx="330" cy="380" r="16"/><circle cx="390" cy="350" r="10"/><circle cx="370" cy="410" r="8"/></g>
<g fill="${h(m.c2)}" opacity=".7"><circle cx="370" cy="80" r="14"/><circle cx="400" cy="45" r="9"/><circle cx="345" cy="40" r="6"/></g>
<g filter="url(#bo)"><rect x="560" y="150" width="56" height="300" rx="28" fill="#fff"/></g><rect x="566" y="300" width="44" height="144" rx="22" fill="${h(m.nhan)}"/><rect x="548" y="140" width="80" height="22" rx="8" fill="${h(m.c1)}"/>`,
    nguyentu: m => `<g fill="none" stroke-width="12" opacity=".9"><ellipse cx="400" cy="300" rx="230" ry="80" stroke="${h(m.c1)}"/><ellipse cx="400" cy="300" rx="230" ry="80" stroke="${h(m.c2)}" transform="rotate(60 400 300)"/><ellipse cx="400" cy="300" rx="230" ry="80" stroke="${h(m.nhan)}" transform="rotate(-60 400 300)"/></g>
<g filter="url(#bo)"><circle cx="400" cy="300" r="52" fill="url(#g1)"/></g><circle cx="384" cy="284" r="14" fill="#fff" opacity=".6"/>
<g filter="url(#bo)"><circle cx="630" cy="300" r="20" fill="${h(m.c1)}"/><circle cx="285" cy="100" r="20" fill="${h(m.c2)}"/><circle cx="285" cy="500" r="20" fill="${h(m.nhan)}"/></g>`,
    sinhhoc: m => `<g filter="url(#bo)"><path d="M400 520C220 470 170 290 260 140c120 10 250 90 250 230 0 70-40 120-110 150z" fill="url(#g1)"/></g>
<path d="M400 520C360 400 320 280 268 160" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/><g stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".85"><path d="M350 400l-70-20M330 330l-60-30M380 440l60-50M355 360l80-60M310 260l-30-40"/></g>
<g filter="url(#bo)"><circle cx="590" cy="230" r="90" fill="#fff"/><circle cx="590" cy="230" r="90" fill="none" stroke="${h(m.c2)}" stroke-width="10"/></g><circle cx="605" cy="220" r="30" fill="${h(m.nhan)}"/><g fill="${h(m.c1)}" opacity=".5"><circle cx="555" cy="270" r="10"/><circle cx="625" cy="280" r="8"/><circle cx="560" cy="190" r="7"/></g>`,
    traidat: m => `<g filter="url(#bo)"><circle cx="400" cy="300" r="190" fill="url(#g1)"/></g>
<path d="M280 180c40-20 70 0 90 30s-10 60 20 80 70-10 80 30-30 70-70 80M480 150c30 10 60 40 50 70M250 330c30 10 50 50 40 90" stroke="#fff" stroke-width="14" fill="none" opacity=".35" stroke-linecap="round"/>
<path d="M300 200c30-20 60 10 50 40s-50 20-60 50 20 50 0 70c-30 10-60-40-60-80s40-60 70-80zM450 260c40-10 80 20 70 60s-50 50-80 30-30-80 10-90z" fill="${h(m.nhan)}" opacity=".9"/>
<ellipse cx="400" cy="300" rx="260" ry="70" fill="none" stroke="${h(m.nhan)}" stroke-width="8" transform="rotate(-18 400 300)" opacity=".8"/>`,
    dien: m => `<g filter="url(#bo)"><rect x="170" y="230" width="300" height="140" rx="26" fill="url(#g1)"/><rect x="470" y="270" width="30" height="60" rx="8" fill="${h(m.c2)}"/></g><rect x="190" y="250" width="120" height="100" rx="16" fill="${h(m.nhan)}"/>
<text x="250" y="322" text-anchor="middle" font-family="Arial" font-weight="700" font-size="64" fill="#fff">+</text>
<g filter="url(#bo)"><path d="M610 90L520 320h70l-40 190 140-260h-80l50-160z" fill="${h(m.nhan)}"/></g>`,
    luc: m => `<g filter="url(#bo)"><path d="M200 140h110v220a90 90 0 0 0 180 0V140h110v220a200 200 0 0 1-400 0z" fill="url(#g1)"/></g>
<rect x="200" y="140" width="110" height="80" fill="#e2e8f0"/><rect x="490" y="140" width="110" height="80" fill="#e2e8f0"/><text x="255" y="198" text-anchor="middle" font-family="Arial" font-weight="700" font-size="52" fill="${h(m.c1)}">N</text><text x="545" y="198" text-anchor="middle" font-family="Arial" font-weight="700" font-size="52" fill="${h(m.c2)}">S</text>
<g stroke="${h(m.nhan)}" stroke-width="10" stroke-linecap="round" fill="none"><path d="M255 100c0-60 290-60 290 0"/><path d="M215 80c0-110 370-110 370 0" opacity=".6"/></g>`,
    toan: m => `<g filter="url(#bo)"><path d="M160 470L420 120l20 15-240 345z" fill="${h(m.nhan)}"/><rect x="160" y="470" width="440" height="56" rx="10" fill="url(#g1)"/></g>
<g stroke="#fff" stroke-width="5"><path d="M200 470v26M240 470v18M280 470v26M320 470v18M360 470v26M400 470v18M440 470v26M480 470v18M520 470v26M560 470v18"/></g>
<g filter="url(#bo)"><circle cx="560" cy="160" r="26" fill="${h(m.c1)}"/><path d="M552 180L470 420M568 180l82 240" stroke="${h(m.c1)}" stroke-width="18" stroke-linecap="round"/></g><path d="M650 420l-6 30" stroke="#334155" stroke-width="8"/>
<path d="M470 420A190 190 0 0 0 650 420" stroke="${h(m.c2)}" stroke-width="6" fill="none" stroke-dasharray="14 10"/>`,
    dothi: m => `<g filter="url(#bo)"><rect x="130" y="90" width="540" height="420" rx="24" fill="#fff"/></g><g stroke="${h(m.nhat)}" stroke-width="3"><path d="M190 150v300M260 150v300M330 150v300M470 150v300M540 150v300M610 150v300M170 190h460M170 260h460M170 400h460M170 470h460"/></g>
<path d="M170 330h470M400 480V130" stroke="#334155" stroke-width="5"/><path d="M640 330l-16-9v18zM400 125l-9 16h18z" fill="#334155"/>
<path d="M200 160Q400 600 600 160" stroke="url(#g1)" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M190 450L610 190" stroke="${h(m.nhan)}" stroke-width="9" stroke-linecap="round"/>`,
    maytinh: m => `<g filter="url(#bo)"><rect x="190" y="120" width="420" height="280" rx="20" fill="#334155"/><rect x="210" y="140" width="380" height="240" rx="10" fill="url(#g1)"/><path d="M130 420h540l-40 50H170z" fill="#94a3b8"/></g>
<g stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none"><path d="M290 220l-40 40 40 40M510 220l40 40-40 40"/><path d="M420 200l-40 120" stroke="${h(m.nhan)}"/></g>`,
    nhom: m => {
      const ng = (x, mau, co) => `<g filter="url(#bo)"><circle cx="${x}" cy="${300 - co}" r="${co * .5}" fill="#fcd9b6"/><path d="M${x - co * .95} ${470}c0-${co * 1.6} ${co * 1.9}-${co * 1.6} ${co * 1.9} 0z" fill="${mau}"/></g><path d="M${x - co * .5} ${300 - co * 1.2}a${co * .5} ${co * .48} 0 0 1 ${co} 0" fill="#334155"/>`;
      return `${ng(250, h(m.c1), 80)}${ng(550, h(m.c2), 80)}${ng(400, h(m.nhan), 92)}<g filter="url(#bo)"><rect x="300" y="60" width="200" height="90" rx="30" fill="#fff"/></g><g fill="${h(m.c1)}"><circle cx="355" cy="105" r="12"/><circle cx="400" cy="105" r="12"/><circle cx="445" cy="105" r="12"/></g>`;
    },
    cup: m => `<g filter="url(#bo)"><path d="M280 120h240v110a120 120 0 0 1-240 0z" fill="url(#g2)"/><rect x="380" y="340" width="40" height="80" fill="${h(m.nhan)}"/><rect x="310" y="420" width="180" height="50" rx="12" fill="url(#g1)"/></g>
<path d="M280 150h-50a60 60 0 0 0 60 90M520 150h50a60 60 0 0 1-60 90" stroke="${h(m.nhan)}" stroke-width="16" fill="none"/><path d="M400 165l14 30 32 4-24 22 6 32-28-16-28 16 6-32-24-22 32-4z" fill="#fff"/>
<g fill="${h(m.c2)}"><path d="M160 120l8 18 20 3-15 14 4 20-17-10-17 10 4-20-15-14 20-3z"/><path d="M640 330l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z"/></g>`,
    dongho: m => `<g filter="url(#bo)"><circle cx="400" cy="300" r="200" fill="url(#g1)"/><circle cx="400" cy="300" r="165" fill="#fff"/></g>
<g stroke="${h(m.c1)}" stroke-width="10" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${400 + 140 * Math.sin(a)} ${300 - 140 * Math.cos(a)}L${400 + 150 * Math.sin(a)} ${300 - 150 * Math.cos(a)}"/>`; }).join("")}</g>
<path d="M400 300V180M400 300l80 50" stroke="#334155" stroke-width="16" stroke-linecap="round"/><circle cx="400" cy="300" r="16" fill="${h(m.nhan)}"/>`,
    bangden: m => `<g filter="url(#bo)"><rect x="110" y="110" width="580" height="360" rx="22" fill="#8b5e34"/><rect x="132" y="132" width="536" height="316" rx="10" fill="#1f4d3a"/></g>
<g font-family="Times New Roman, serif" fill="#f8fafc" font-style="italic"><text x="175" y="225" font-size="64">x²</text><text x="300" y="215" font-size="58">+</text><text x="360" y="225" font-size="64">y</text><text x="530" y="230" font-size="76" font-style="normal">√</text><text x="200" y="380" font-size="70" font-style="normal">π</text><text x="300" y="375" font-size="58" font-style="normal">=</text><text x="380" y="385" font-size="66" font-style="normal">∑</text></g>
<path d="M480 330h120M540 300v0" stroke="#f8fafc" stroke-width="5"/><text x="510" y="315" font-family="Times New Roman" font-size="44" fill="${h(m.nhan)}" font-style="italic">a</text><text x="510" y="385" font-family="Times New Roman" font-size="44" fill="${h(m.nhan)}" font-style="italic">b</text>
<rect x="130" y="470" width="540" height="16" rx="6" fill="#6b4423"/><rect x="520" y="456" width="70" height="16" rx="5" fill="#fff"/><rect x="600" y="456" width="44" height="16" rx="5" fill="${h(m.nhan)}"/>`,
    van: m => `<g filter="url(#bo)"><rect x="180" y="110" width="330" height="400" rx="18" fill="#fff"/></g><rect x="180" y="110" width="330" height="70" rx="18" fill="url(#g1)"/>
<g stroke="${h(m.nhat)}" stroke-width="10" stroke-linecap="round"><path d="M220 230h250M220 280h250M220 330h250M220 380h180M220 430h220"/></g>
<g transform="rotate(30 580 300)" filter="url(#bo)"><path d="M560 90h40v300l-20 50-20-50z" fill="${h(m.nhan)}"/><path d="M560 90h40v40h-40z" fill="${h(m.c1)}"/></g>`
  };
  const TEN_TRANH = { ytuong: "Ý tưởng – khởi động", muctieu: "Mục tiêu", sach: "Sách – kiến thức", luyentap: "Luyện tập", vandung: "Vận dụng", cauhoi: "Câu hỏi", khampha: "Khám phá", hoahoc: "Thí nghiệm hoá học", nguyentu: "Nguyên tử", sinhhoc: "Sinh học – lá, tế bào", traidat: "Trái Đất", dien: "Điện – năng lượng", luc: "Lực – nam châm", toan: "Hình học – thước, compa", dothi: "Đồ thị", maytinh: "Máy tính – tin học", nhom: "Thảo luận nhóm", cup: "Tổng kết – khen", dongho: "Thời gian", van: "Bài viết – văn bản", bangden: "Bảng đen – công thức" };
  const TU_KHOA = [
    ["hoahoc", /hoá|hóa|phản ứng|dung dịch|axit|acid|bazơ|base|muối|oxide|oxit|kim loại|nguyên tố|chất|thí nghiệm|ống nghiệm|mol\b/i],
    ["nguyentu", /nguyên tử|phân tử|electron|hạt nhân|proton|neutron|liên kết|ion\b/i],
    ["dien", /điện|dòng điện|pin|năng lượng|mạch|hiệu điện thế|công suất|nhiệt/i],
    ["luc", /lực|nam châm|từ trường|chuyển động|vận tốc|tốc độ|áp suất|trọng lượng|khối lượng riêng|ánh sáng|âm thanh/i],
    ["sinhhoc", /tế bào|cây|lá|thực vật|động vật|sinh vật|quang hợp|hô hấp|di truyền|gen\b|cơ thể|sinh sản|vi khuẩn|sinh thái/i],
    ["traidat", /trái đất|địa lí|khí hậu|môi trường|bản đồ|lịch sử|quốc gia|biển|đất nước/i],
    ["dothi", /đồ thị|hàm số|toạ độ|tọa độ|parabol|đường thẳng y/i],
    ["toan", /tam giác|đường tròn|góc|hình|cạnh|đoạn thẳng|song song|vuông góc|thước|compa|diện tích|chu vi|thể tích/i],
    ["maytinh", /máy tính|tin học|thuật toán|chương trình|lập trình|dữ liệu|internet|phần mềm/i],
    ["van", /văn bản|đoạn văn|bài văn|tác phẩm|nhân vật|thơ|truyện|viết\b/i],
    ["muctieu", /mục tiêu|yêu cầu cần đạt|sau bài học/i],
    ["ytuong", /khởi động|mở đầu|tình huống|đặt vấn đề|em có biết/i],
    ["cauhoi", /câu hỏi|trả lời|trắc nghiệm|đố|chọn đáp án|\?\s*$/i],
    ["nhom", /nhóm|thảo luận|hợp tác|trò chơi|chia sẻ/i],
    ["luyentap", /luyện tập|bài tập|ví dụ|giải|tính/i],
    ["vandung", /vận dụng|thực tế|thực tiễn|ứng dụng|dự án|tìm tòi|mở rộng/i],
    ["khampha", /khám phá|tìm hiểu|quan sát|hình thành|kiến thức mới/i],
    ["cup", /dặn dò|về nhà|tổng kết|củng cố|ghi nhớ|kết thúc|cảm ơn/i],
    ["sach", /định nghĩa|định lí|tính chất|khái niệm|kết luận|chú ý|nhận xét|quy tắc/i]
  ];
  function chonTranh(chu, loai, mon) {
    if (loai === "ket") return "cup";
    if (loai === "cau") return "cauhoi";
    const toan = /toán/i.test(mon || "");
    for (const [k, re] of TU_KHOA) {
      if (toan && /^(hoahoc|nguyentu|dien|luc|sinhhoc|traidat|van|maytinh)$/.test(k)) continue;   // «tính chất», «lực»… trong bài Toán
      if (re.test(chu)) return k === "sach" && toan ? "bangden" : k;
    }
    return /toán/i.test(mon || "") ? "bangden" : "sach";
  }
  // tranh thay thế khi trùng slide trước (theo môn)
  function tranhKhac(mon, loai) {
    const m = String(mon || "").toLowerCase();
    if (loai === "cau") return ["cauhoi", "luyentap", "nhom", "khampha"];
    if (/toán/.test(m)) return ["bangden", "toan", "dothi", "khampha", "sach", "luyentap", "ytuong"];
    if (/khoa học|khtn|hoá|hóa|lí|lý|sinh/.test(m)) return ["hoahoc", "nguyentu", "sinhhoc", "khampha", "dien", "sach", "traidat"];
    if (/tin/.test(m)) return ["maytinh", "ytuong", "khampha", "sach", "nhom"];
    if (/văn|việt/.test(m)) return ["van", "sach", "ytuong", "nhom", "khampha"];
    return ["sach", "khampha", "ytuong", "nhom", "vandung", "muctieu"];
  }
  const tranh = (ten, m) => khung(m, (T[ten] || T.sach)(m));

  /* ---------- 2) đồ thị hàm số ---------- */
  function hamJS(bt) {   // "2x^2 - 3x + 1", "sqrt(x)", "1/x", "|x|" → hàm JS; null nếu lạ
    let s = String(bt || "").toLowerCase().replace(/^\s*y\s*=\s*/, "").replace(/\$/g, "").replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)").replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)").replace(/\\cdot|×|·/g, "*").replace(/[−–]/g, "-").replace(/\\left|\\right|\\,|\\ /g, "").replace(/[{}]/g, c => c === "{" ? "(" : ")").replace(/,/g, ".").replace(/\s+/g, "");
    s = s.replace(/\|([^|]+)\|/g, "abs($1)").replace(/√\(?([^)+\-*/]+)\)?/g, "sqrt($1)").replace(/π|\\pi/g, "pi");
    if (!/^[0-9x.+\-*/^()a-z]*$/.test(s) || !/x/.test(s)) return null;
    const ok = s.replace(/sqrt|abs|sin|cos|tan|pi|x/g, "");
    if (/[a-z]/.test(ok)) return null;
    s = s.replace(/(\d|\))\s*(?=[a-z(])/g, "$1*").replace(/x(?=[\d(a-z])/g, "x*").replace(/\^/g, "**").replace(/sqrt|abs|sin|cos|tan/g, f => "Math." + f).replace(/pi/g, "Math.PI");
    try { const f = new Function("x", "return " + s + ";"); f(1); return f; } catch (e) { return null; }
  }
  function doThi(bt, m) {
    const f = hamJS(bt); if (!f) return null;
    // khung nhìn: tự chọn theo giá trị hàm
    let xm = -5, xM = 5; const ys = [];
    for (let x = xm; x <= xM; x += 0.05) { const y = f(x); if (isFinite(y)) ys.push(y); }
    if (!ys.length) return null;
    ys.sort((a, b) => a - b);
    let ym = Math.min(-1, ys[Math.floor(ys.length * .05)]), yM = Math.max(1, ys[Math.floor(ys.length * .95)]);
    ym = Math.max(ym, -8); yM = Math.min(yM, 8); if (yM - ym < 4) { yM = Math.max(yM, 2); ym = Math.min(ym, -2); }
    ym = Math.floor(ym) - 0.5; yM = Math.ceil(yM) + 0.5;
    const L = 80, R = 760, Tp = 60, B = 560, sx = (R - L) / (xM - xm), sy = (B - Tp) / (yM - ym);
    const X = x => L + (x - xm) * sx, Y = y => B - (y - ym) * sy;
    let luoi = "";
    for (let x = Math.ceil(xm); x <= xM; x++) luoi += `<path d="M${X(x)} ${Tp}V${B}" stroke="#e2e8f0" stroke-width="2"/>` + (x ? `<text x="${X(x)}" y="${Y(0) + 26}" text-anchor="middle" font-family="Times New Roman" font-size="22" fill="#475569">${x < 0 ? "−" + (-x) : x}</text>` : "");
    for (let y = Math.ceil(ym); y <= yM; y++) luoi += `<path d="M${L} ${Y(y)}H${R}" stroke="#e2e8f0" stroke-width="2"/>` + (y ? `<text x="${X(0) - 10}" y="${Y(y) + 7}" text-anchor="end" font-family="Times New Roman" font-size="22" fill="#475569">${y < 0 ? "−" + (-y) : y}</text>` : "");
    let d = "", len = false;
    for (let x = xm; x <= xM + 1e-9; x += 0.02) {
      const y = f(x);
      if (!isFinite(y) || y < ym - 3 || y > yM + 3) { len = false; continue; }
      d += (len ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1); len = true;
    }
    const ten = "y = " + String(bt).replace(/^\s*y\s*=\s*/i, "").replace(/\$/g, "");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" rx="0" fill="#fff"/><clipPath id="kh"><rect x="${L}" y="${Tp}" width="${R - L}" height="${B - Tp}"/></clipPath>${luoi}
<path d="M${L - 10} ${Y(0)}H${R + 20}M${X(0)} ${B + 10}V${Tp - 20}" stroke="#1e293b" stroke-width="3"/><path d="M${R + 24} ${Y(0)}l-16-8v16zM${X(0)} ${Tp - 24}l-8 16h16z" fill="#1e293b"/>
<text x="${R + 10}" y="${Y(0) - 12}" font-family="Times New Roman" font-style="italic" font-size="28" fill="#1e293b">x</text><text x="${X(0) + 14}" y="${Tp - 8}" font-family="Times New Roman" font-style="italic" font-size="28" fill="#1e293b">y</text><text x="${X(0) - 22}" y="${Y(0) + 26}" font-family="Times New Roman" font-style="italic" font-size="24" fill="#1e293b">O</text>
<path d="${d}" clip-path="url(#kh)" stroke="${h(m.c1)}" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="${L + 10}" y="${Tp + 6}" width="${Math.min(360, 22 + ten.length * 14)}" height="46" rx="10" fill="#fff" stroke="${h(m.c1)}" stroke-width="2.5"/><text x="${L + 22}" y="${Tp + 38}" font-family="Times New Roman" font-style="italic" font-size="28" fill="${h(m.c1)}">${xe(ten)}</text></svg>`;
  }

  /* ---------- 3) hình học ---------- */
  const HINH = { tamgiac: "Tam giác ABC", tgvuong: "Tam giác vuông", tgcan: "Tam giác cân", duongtron: "Đường tròn (O; R)", hcn: "Hình chữ nhật", hvuong: "Hình vuông", hthang: "Hình thang", hbh: "Hình bình hành", hhop: "Hình hộp chữ nhật", lapphuong: "Hình lập phương", tru: "Hình trụ", non: "Hình nón", cau: "Hình cầu", goc: "Góc xOy" };
  function nhanHinh(chu) {
    const t = String(chu || "").toLowerCase();
    return [["tgvuong", /tam giác vuông|tam giác [a-z]{3} vuông|vuông tại|pythagore|py-ta-go|định lí pitago/], ["tgcan", /tam giác cân|tam giác đều/], ["tamgiac", /tam giác/], ["duongtron", /đường tròn|tiếp tuyến|dây cung|cung tròn|hình tròn/], ["hhop", /hình hộp/], ["lapphuong", /lập phương/], ["tru", /hình trụ/], ["non", /hình nón/], ["cau", /hình cầu|mặt cầu/], ["hvuong", /hình vuông/], ["hcn", /hình chữ nhật/], ["hthang", /hình thang/], ["hbh", /bình hành|hình thoi/], ["goc", /\bgóc\b/]].find(([, re]) => re.test(t))?.[0] || null;
  }
  function hinhHoc(kieu, m) {
    const net = `stroke="${h(m.c1)}" stroke-width="6" fill="${h(m.nhat)}" fill-opacity=".45" stroke-linejoin="round"`, an = `stroke="${h(m.c1)}" stroke-width="4" stroke-dasharray="12 10" fill="none"`;
    const chu = (x, y, s, nghieng = true) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Times New Roman" ${nghieng ? "" : 'font-style="normal"'} font-size="40" font-weight="700" fill="#1e293b">${s}</text>`;
    const dinh = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="${h(m.c2)}"/>`;
    const vuong = (x, y, dx, dy) => `<path d="M${x + dx} ${y}v${dy}h${-dx}" stroke="${h(m.nhan)}" stroke-width="4" fill="none" transform="translate(0 0)"/>`;
    let g = "";
    switch (kieu) {
      case "tgvuong": g = `<path d="M180 470L180 130L620 470Z" ${net}/><path d="M180 430h40v40" stroke="${h(m.nhan)}" stroke-width="5" fill="none"/>${dinh(180, 470)}${dinh(180, 130)}${dinh(620, 470)}${chu(150, 500, "A")}${chu(160, 120, "B")}${chu(650, 500, "C")}`; break;
      case "tgcan": g = `<path d="M400 110L170 480H630Z" ${net}/><path d="M400 110V480" ${an}/><path d="M275 300l20-10M505 290l20 10" stroke="${h(m.nhan)}" stroke-width="5"/>${dinh(400, 110)}${dinh(170, 480)}${dinh(630, 480)}${chu(400, 92, "A")}${chu(145, 515, "B")}${chu(655, 515, "C")}${chu(400, 520, "H")}`; break;
      case "duongtron": g = `<circle cx="400" cy="300" r="200" ${net}/><path d="M400 300L573 200" stroke="${h(m.c2)}" stroke-width="5"/><path d="M200 300H600" ${an}/>${dinh(400, 300)}${dinh(573, 200)}${chu(385, 345, "O")}${chu(600, 192, "A")}<text x="500" y="235" font-family="Times New Roman" font-style="italic" font-size="38" fill="${h(m.c2)}">R</text>`; break;
      case "hcn": g = `<path d="M150 160H650V440H150Z" ${net}/><path d="M150 160L650 440" ${an}/>${vuong(150, 160, 0, 0)}${dinh(150, 160)}${dinh(650, 160)}${dinh(650, 440)}${dinh(150, 440)}${chu(125, 150, "A")}${chu(675, 150, "B")}${chu(675, 480, "C")}${chu(125, 480, "D")}`; break;
      case "hvuong": g = `<path d="M230 130H570V470H230Z" ${net}/><path d="M230 130L570 470M570 130L230 470" ${an}/>${dinh(230, 130)}${dinh(570, 130)}${dinh(570, 470)}${dinh(230, 470)}${chu(205, 120, "A")}${chu(595, 120, "B")}${chu(595, 510, "C")}${chu(205, 510, "D")}`; break;
      case "hthang": g = `<path d="M260 160H540L670 450H130Z" ${net}/><path d="M260 160V450" ${an}/>${dinh(260, 160)}${dinh(540, 160)}${dinh(670, 450)}${dinh(130, 450)}${chu(250, 140, "A")}${chu(555, 140, "B")}${chu(695, 490, "C")}${chu(110, 490, "D")}${chu(260, 490, "H")}`; break;
      case "hbh": g = `<path d="M240 160H660L560 450H140Z" ${net}/><path d="M240 160L560 450M660 160L140 450" ${an}/>${dinh(240, 160)}${dinh(660, 160)}${dinh(560, 450)}${dinh(140, 450)}${chu(225, 140, "A")}${chu(680, 140, "B")}${chu(580, 490, "C")}${chu(120, 490, "D")}`; break;
      case "hhop": case "lapphuong": { const a = kieu === "hhop" ? [170, 220, 430, 230] : [210, 200, 300, 300], [x, y, w, hh] = a, dx = 140, dy = -110; g = `<path d="M${x} ${y}h${w}v${hh}h${-w}Z" ${net}/><path d="M${x} ${y}l${dx} ${dy}h${w}l${-dx} ${-dy}M${x + w} ${y}l${dx} ${dy}v${hh}l${-dx} ${-dy}" ${net}/><path d="M${x} ${y + hh}l${dx} ${dy}h${w}M${x + dx} ${y + dy}v${hh}" ${an}/>${chu(x - 20, y + hh + 40, "A")}${chu(x + w + 10, y + hh + 40, "B")}${chu(x - 22, y + 5, "D")}${chu(x + w + 30, y + 30, "C")}`; break; }
      case "tru": g = `<path d="M230 150V450A170 50 0 0 0 570 450V150" ${net}/><ellipse cx="400" cy="150" rx="170" ry="50" ${net}/><path d="M230 450A170 50 0 0 1 570 450" ${an}/><path d="M400 150V450M400 450H570" ${an}/>${dinh(400, 150)}${dinh(400, 450)}<text x="490" y="440" font-family="Times New Roman" font-style="italic" font-size="38" fill="${h(m.c2)}">r</text><text x="410" y="310" font-family="Times New Roman" font-style="italic" font-size="38" fill="${h(m.c2)}">h</text>`; break;
      case "non": g = `<path d="M400 100L220 450A180 50 0 0 0 580 450Z" ${net}/><path d="M220 450A180 50 0 0 1 580 450M400 100V450H580" ${an}/>${dinh(400, 100)}${dinh(400, 450)}${chu(400, 82, "S")}${chu(385, 495, "O")}<text x="480" y="440" font-family="Times New Roman" font-style="italic" font-size="38" fill="${h(m.c2)}">r</text><text x="410" y="300" font-family="Times New Roman" font-style="italic" font-size="38" fill="${h(m.c2)}">h</text>`; break;
      case "cau": g = `<circle cx="400" cy="300" r="200" ${net}/><ellipse cx="400" cy="300" rx="200" ry="55" fill="none" stroke="${h(m.c1)}" stroke-width="4"/><path d="M400 300H600" stroke="${h(m.c2)}" stroke-width="5"/>${dinh(400, 300)}${chu(385, 345, "O")}<text x="490" y="290" font-family="Times New Roman" font-style="italic" font-size="38" fill="${h(m.c2)}">R</text>`; break;
      case "goc": g = `<path d="M170 450H650M170 450L520 130" stroke="${h(m.c1)}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M300 450A130 130 0 0 0 266 362" stroke="${h(m.nhan)}" stroke-width="6" fill="none"/>${dinh(170, 450)}${chu(150, 495, "O")}${chu(675, 470, "x")}${chu(540, 120, "y")}`; break;
      default: g = `<path d="M260 130L140 460H660Z" ${net}/><path d="M260 130L330 460" ${an}/>${dinh(260, 130)}${dinh(140, 460)}${dinh(660, 460)}${chu(255, 110, "A")}${chu(115, 495, "B")}${chu(685, 495, "C")}`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"><rect width="800" height="600" fill="#fff"/>${g}</svg>`;
  }

  /* ---------- SVG → PNG ---------- */
  function png(svg, rongPx = 1200) {
    return new Promise((ok, loi) => {
      const img = new Image(), url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      img.onload = () => {
        const tl = (img.naturalHeight || 600) / (img.naturalWidth || 800), c = document.createElement("canvas");
        c.width = rongPx; c.height = Math.round(rongPx * tl);
        const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        c.toBlob(b => b.arrayBuffer().then(buf => ok({ data: new Uint8Array(buf), ext: "jpeg", w: c.width, h: c.height })), "image/jpeg", 0.9);
      };
      img.onerror = () => { URL.revokeObjectURL(url); loi(new Error("Không vẽ được ảnh")); };
      img.src = url;
    });
  }
  return { tranh, chonTranh, tranhKhac, TEN_TRANH, doThi, hamJS, hinhHoc, nhanHinh, HINH, png, DS_TRANH: Object.keys(T) };
})();
if (typeof module !== "undefined") module.exports = AT;
