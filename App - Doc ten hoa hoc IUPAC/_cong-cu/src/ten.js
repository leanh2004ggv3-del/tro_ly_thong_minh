/* ten.js — dữ liệu + bộ ghép tên Hoá học theo IUPAC (dùng chung cho app và cho lệnh liệt kê câu cần thu tiếng).
   ✅ BẢN NHÁP — GV Hoá/KHTN soát lại tên, phiên âm trước khi dùng.
   Nguồn quy tắc: IUPAC «Nomenclature of Inorganic Chemistry» (Red Book 2005) · «Nomenclature of Organic Chemistry» (Blue Book 2013).
   Phiên âm IPA: giọng Anh – Anh theo từ điển phổ thông. «Gợi ý đọc» chỉ là cách ghi gần đúng bằng chữ Việt, CHỮ IN HOA = âm nhấn. */
(function (G) {
"use strict";

/* Z|kí hiệu|tên IUPAC|IPA|gợi ý đọc|tên tiếng Việt quen gọi (SGK trước 2018)|nhóm */
const NT_THO = `1|H|hydrogen|ˈhaɪdrədʒən|HAI-đrơ-giần|hiđro|pk
2|He|helium|ˈhiːliəm|HI-li-ầm|heli|kh
3|Li|lithium|ˈlɪθiəm|LI-thi-ầm|liti|k
4|Be|beryllium|bəˈrɪliəm|bơ-RI-li-ầm|beri|kt
5|B|boron|ˈbɔːrɒn|BO-rơn|bo|a
6|C|carbon|ˈkɑːbən|CA-bần|cacbon|pk
7|N|nitrogen|ˈnaɪtrədʒən|NAI-trơ-giần|nitơ|pk
8|O|oxygen|ˈɒksɪdʒən|OC-xi-giần|oxi|pk
9|F|fluorine|ˈflɔːriːn|FLO-rin|flo|h
10|Ne|neon|ˈniːɒn|NI-on|neon|kh
11|Na|sodium|ˈsəʊdiəm|XÂU-đi-ầm|natri|k
12|Mg|magnesium|mæɡˈniːziəm|mắc-NI-di-ầm|magie|kt
13|Al|aluminium|ˌæljəˈmɪniəm|a-liu-MI-ni-ầm|nhôm|kl
14|Si|silicon|ˈsɪlɪkən|XI-li-cần|silic|a
15|P|phosphorus|ˈfɒsfərəs|PHỐT-phơ-rợt|photpho|pk
16|S|sulfur|ˈsʌlfə|XAN-phờ|lưu huỳnh|pk
17|Cl|chlorine|ˈklɔːriːn|CLO-rin|clo|h
18|Ar|argon|ˈɑːɡɒn|A-gon|agon|kh
19|K|potassium|pəˈtæsiəm|pơ-TA-xi-ầm|kali|k
20|Ca|calcium|ˈkælsiəm|CAN-xi-ầm|canxi|kt
21|Sc|scandium|ˈskændiəm|XCAN-đi-ầm||cht
22|Ti|titanium|tɪˈteɪniəm|ti-TÂY-ni-ầm|titan|cht
23|V|vanadium|vəˈneɪdiəm|vơ-NÂY-đi-ầm||cht
24|Cr|chromium|ˈkrəʊmiəm|CRÂU-mi-ầm|crom|cht
25|Mn|manganese|ˈmæŋɡəniːz|MĂNG-gơ-niz|mangan|cht
26|Fe|iron|ˈaɪən|AI-ần|sắt|cht
27|Co|cobalt|ˈkəʊbɒlt|CÂU-bôn|coban|cht
28|Ni|nickel|ˈnɪkl|NÍCH-cồ|niken|cht
29|Cu|copper|ˈkɒpə|CÓP-pờ|đồng|cht
30|Zn|zinc|zɪŋk|DINH-k|kẽm|cht
31|Ga|gallium|ˈɡæliəm|GA-li-ầm|gali|kl
32|Ge|germanium|dʒəˈmeɪniəm|giơ-MÂY-ni-ầm||a
33|As|arsenic|ˈɑːsnɪk|A-xơ-ních|asen|a
34|Se|selenium|səˈliːniəm|xơ-LI-ni-ầm||pk
35|Br|bromine|ˈbrəʊmiːn|BRÂU-min|brom|h
36|Kr|krypton|ˈkrɪptɒn|CRÍP-tơn||kh
37|Rb|rubidium|ruːˈbɪdiəm|ru-BI-đi-ầm||k
38|Sr|strontium|ˈstrɒntiəm|XTRÔN-ti-ầm||kt
39|Y|yttrium|ˈɪtriəm|Í-tri-ầm||cht
40|Zr|zirconium|zɜːˈkəʊniəm|dơ-CÂU-ni-ầm||cht
41|Nb|niobium|naɪˈəʊbiəm|nai-ÂU-bi-ầm||cht
42|Mo|molybdenum|məˈlɪbdənəm|mơ-LÍP-đơ-nầm||cht
43|Tc|technetium|tekˈniːʃiəm|téc-NI-si-ầm||cht
44|Ru|ruthenium|ruːˈθiːniəm|ru-THI-ni-ầm||cht
45|Rh|rhodium|ˈrəʊdiəm|RÂU-đi-ầm||cht
46|Pd|palladium|pəˈleɪdiəm|pơ-LÂY-đi-ầm||cht
47|Ag|silver|ˈsɪlvə|XIU-vờ|bạc|cht
48|Cd|cadmium|ˈkædmiəm|CÁT-mi-ầm||cht
49|In|indium|ˈɪndiəm|IN-đi-ầm||kl
50|Sn|tin|tɪn|TIN|thiếc|kl
51|Sb|antimony|ˈæntɪməni|AN-ti-mơ-ni||a
52|Te|tellurium|təˈlʊəriəm|tơ-LUA-ri-ầm||a
53|I|iodine|ˈaɪədiːn|AI-ơ-đin|iot|h
54|Xe|xenon|ˈzenɒn|DE-non||kh
55|Cs|caesium|ˈsiːziəm|XI-di-ầm||k
56|Ba|barium|ˈbeəriəm|BE-ri-ầm|bari|kt
57|La|lanthanum|ˈlænθənəm|LAN-thơ-nầm||la
58|Ce|cerium|ˈsɪəriəm|XIA-ri-ầm||la
59|Pr|praseodymium|ˌpreɪziəˈdɪmiəm|prây-di-ơ-ĐI-mi-ầm||la
60|Nd|neodymium|ˌniːəˈdɪmiəm|ni-ơ-ĐI-mi-ầm||la
61|Pm|promethium|prəˈmiːθiəm|prơ-MI-thi-ầm||la
62|Sm|samarium|səˈmeəriəm|xơ-ME-ri-ầm||la
63|Eu|europium|jʊəˈrəʊpiəm|diu-RÂU-pi-ầm||la
64|Gd|gadolinium|ˌɡædəˈlɪniəm|ga-đơ-LI-ni-ầm||la
65|Tb|terbium|ˈtɜːbiəm|TƠ-bi-ầm||la
66|Dy|dysprosium|dɪsˈprəʊziəm|đít-PRÂU-di-ầm||la
67|Ho|holmium|ˈhəʊlmiəm|HÂU-mi-ầm||la
68|Er|erbium|ˈɜːbiəm|Ơ-bi-ầm||la
69|Tm|thulium|ˈθjuːliəm|THIU-li-ầm||la
70|Yb|ytterbium|ɪˈtɜːbiəm|i-TƠ-bi-ầm||la
71|Lu|lutetium|luːˈtiːʃiəm|lu-TI-si-ầm||la
72|Hf|hafnium|ˈhæfniəm|HÁP-ni-ầm||cht
73|Ta|tantalum|ˈtæntələm|TAN-tơ-lầm||cht
74|W|tungsten|ˈtʌŋstən|TĂNG-xtần|vonfram|cht
75|Re|rhenium|ˈriːniəm|RI-ni-ầm||cht
76|Os|osmium|ˈɒzmiəm|ÔT-mi-ầm||cht
77|Ir|iridium|ɪˈrɪdiəm|i-RI-đi-ầm||cht
78|Pt|platinum|ˈplætɪnəm|PLA-ti-nầm|platin|cht
79|Au|gold|ɡəʊld|GÂU-đ|vàng|cht
80|Hg|mercury|ˈmɜːkjəri|MƠ-kiu-ri|thuỷ ngân|cht
81|Tl|thallium|ˈθæliəm|THA-li-ầm||kl
82|Pb|lead|led|LÉT|chì|kl
83|Bi|bismuth|ˈbɪzməθ|BÍT-mợt|bitmut|kl
84|Po|polonium|pəˈləʊniəm|pơ-LÂU-ni-ầm||kl
85|At|astatine|ˈæstətiːn|A-xtơ-tin||h
86|Rn|radon|ˈreɪdɒn|RÂY-đon||kh
87|Fr|francium|ˈfrænsiəm|FRAN-xi-ầm||k
88|Ra|radium|ˈreɪdiəm|RÂY-đi-ầm||kt
89|Ac|actinium|ækˈtɪniəm|ắc-TI-ni-ầm||ac
90|Th|thorium|ˈθɔːriəm|THO-ri-ầm||ac
91|Pa|protactinium|ˌprəʊtækˈtɪniəm|prâu-tắc-TI-ni-ầm||ac
92|U|uranium|jʊˈreɪniəm|diu-RÂY-ni-ầm|urani|ac
93|Np|neptunium|nepˈtjuːniəm|nép-TIU-ni-ầm||ac
94|Pu|plutonium|pluːˈtəʊniəm|plu-TÂU-ni-ầm||ac
95|Am|americium|ˌæməˈrɪsiəm|a-mơ-RI-xi-ầm||ac
96|Cm|curium|ˈkjʊəriəm|KIUA-ri-ầm||ac
97|Bk|berkelium|bɜːˈkiːliəm|bơ-KI-li-ầm||ac
98|Cf|californium|ˌkælɪˈfɔːniəm|ca-li-PHO-ni-ầm||ac
99|Es|einsteinium|aɪnˈstaɪniəm|ai-XTAI-ni-ầm||ac
100|Fm|fermium|ˈfɜːmiəm|PHƠ-mi-ầm||ac
101|Md|mendelevium|ˌmendəˈliːviəm|men-đơ-LI-vi-ầm||ac
102|No|nobelium|nəʊˈbiːliəm|nâu-BI-li-ầm||ac
103|Lr|lawrencium|lɒˈrensiəm|lo-REN-xi-ầm||ac
104|Rf|rutherfordium|ˌrʌðəˈfɔːdiəm|ra-đơ-PHO-đi-ầm||cht
105|Db|dubnium|ˈduːbniəm|ĐÚP-ni-ầm||cht
106|Sg|seaborgium|siːˈbɔːɡiəm|xi-BO-gi-ầm||cht
107|Bh|bohrium|ˈbɔːriəm|BO-ri-ầm||cht
108|Hs|hassium|ˈhæsiəm|HA-xi-ầm||cht
109|Mt|meitnerium|maɪtˈnɪəriəm|mai-NIA-ri-ầm||cr
110|Ds|darmstadtium|dɑːmˈʃtætiəm|đam-STA-ti-ầm||cr
111|Rg|roentgenium|rɜːntˈɡeniəm|rơnt-GHE-ni-ầm||cr
112|Cn|copernicium|ˌkəʊpəˈnɪsiəm|câu-pơ-NI-xi-ầm||cr
113|Nh|nihonium|nɪˈhəʊniəm|ni-HÂU-ni-ầm||cr
114|Fl|flerovium|fləˈrəʊviəm|flơ-RÂU-vi-ầm||cr
115|Mc|moscovium|mɒsˈkəʊviəm|mốt-CÂU-vi-ầm||cr
116|Lv|livermorium|ˌlɪvəˈmɔːriəm|li-vơ-MO-ri-ầm||cr
117|Ts|tennessine|ˈtenəsiːn|TE-nơ-xin||cr
118|Og|oganesson|ˌɒɡəˈnesɒn|o-gơ-NE-xơn||cr`;

const NHOM = {
  k:  ["Kim loại kiềm", "#ff7a59"], kt: ["Kim loại kiềm thổ", "#ffb347"], cht: ["Kim loại chuyển tiếp", "#f6d365"],
  kl: ["Kim loại khác", "#9bd77a"], a: ["Á kim", "#4fd1c5"], pk: ["Phi kim", "#63b3ff"], h: ["Halogen", "#a78bfa"],
  kh: ["Khí hiếm", "#f472b6"], la: ["Họ lanthanide", "#fda4af"], ac: ["Họ actinide", "#fdba74"], cr: ["Chưa rõ tính chất", "#94a3b8"]
};

/* Ghi chú chính tả IUPAC hay nhầm */
const GHI_CHU_NT = {
  S: "IUPAC viết «sulfur» — không viết «sulphur» (cách viết cũ của Anh).",
  Al: "IUPAC viết «aluminium». Ở Mỹ hay viết «aluminum».",
  Cs: "IUPAC viết «caesium». Ở Mỹ hay viết «cesium».",
  Na: "Kí hiệu Na lấy từ tên Latin natrium, nhưng tên IUPAC là «sodium».",
  K: "Kí hiệu K lấy từ tên Latin kalium, nhưng tên IUPAC là «potassium».",
  Fe: "Kí hiệu Fe lấy từ tên Latin ferrum; tên IUPAC là «iron», đọc /ˈaɪən/, không đọc «ai-rôn».",
  Cu: "Kí hiệu Cu lấy từ tên Latin cuprum; tên IUPAC là «copper».",
  Ag: "Kí hiệu Ag lấy từ tên Latin argentum; tên IUPAC là «silver».",
  Au: "Kí hiệu Au lấy từ tên Latin aurum; tên IUPAC là «gold».",
  Hg: "Kí hiệu Hg lấy từ tên Latin hydrargyrum; tên IUPAC là «mercury».",
  Pb: "Kí hiệu Pb lấy từ tên Latin plumbum; tên IUPAC là «lead», đọc /led/ (như «led»).",
  Sn: "Kí hiệu Sn lấy từ tên Latin stannum; tên IUPAC là «tin».",
  W: "Kí hiệu W lấy từ tên wolfram; tên IUPAC là «tungsten».",
  Sb: "Kí hiệu Sb lấy từ tên Latin stibium; tên IUPAC là «antimony».",
  F: "Viết «fluorine» — chữ u đứng trước o (không viết «flourine»).",
  I: "Tên IUPAC là «iodine»; gốc trong hợp chất là «iod-»: iodide."
};

const NT = NT_THO.split("\n").map(d => {
  const [z, k, ten, ipa, goi, cu, nhom] = d.split("|");
  return { z: +z, k, ten, ipa, goi, cu, nhom };
});
const NT_K = {}; NT.forEach(e => NT_K[e.k] = e);

/* Vị trí trên bảng tuần hoàn: [hàng, cột]; hàng 9–10 là họ lanthanide/actinide */
function viTri(z) {
  if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
  const chuKi = [[3, 10, 2], [11, 18, 3]];
  for (const [a, b, h] of chuKi) if (z >= a && z <= b) { const i = z - a; return [h, i < 2 ? i + 1 : i + 11]; }
  if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
  if (z <= 56) return [6, z - 54]; if (z <= 71) return [9, z - 57 + 3]; if (z <= 86) return [6, z - 68];
  if (z <= 88) return [7, z - 86]; if (z <= 103) return [10, z - 89 + 3]; return [7, z - 100];
}

/* Kim loại: hoá trị (điện tích ion) có thể có. Nhiều hơn 1 → phải ghi số La Mã. */
const KL = { Li:[1],Na:[1],K:[1],Rb:[1],Cs:[1],Ag:[1],Be:[2],Mg:[2],Ca:[2],Sr:[2],Ba:[2],Zn:[2],Cd:[2],Al:[3],Ga:[3],
  Fe:[2,3],Cu:[1,2],Cr:[2,3,6],Mn:[2,3,4,7],Co:[2,3],Ni:[2,3],Pb:[2,4],Sn:[2,4],Hg:[1,2],Au:[1,3],Pt:[2,4],Ti:[2,3,4],V:[2,3,4,5] };
const LA_MA = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const SO_DOC = ["", "one", "two", "three", "four", "five", "six", "seven", "eight"];

/* Gốc acid / anion: công thức | điện tích | mảnh tên | tên acid | tên gốc tiếng Việt cũ | tên acid tiếng Việt cũ */
const AN_THO = [
  ["F", 1, "fluor:an ide:d", "hydrofluoric acid", "florua", "axit flohiđric"],
  ["Cl", 1, "chlor:an ide:d", "hydrochloric acid", "clorua", "axit clohiđric"],
  ["Br", 1, "brom:an ide:d", "hydrobromic acid", "bromua", "axit bromhiđric"],
  ["I", 1, "iod:an ide:d", "hydroiodic acid", "iotua", "axit iothiđric"],
  ["O", 2, "ox:an ide:d", "", "oxit", ""],
  ["S", 2, "sulf:an ide:d", "hydrosulfuric acid", "sunfua", "axit sunfuhiđric"],
  ["N", 3, "nitr:an ide:d", "", "nitrua", ""],
  ["P", 3, "phosph:an ide:d", "", "photphua", ""],
  ["H", 1, "hydr:an ide:d", "", "hiđrua", ""],
  ["OH", 1, "hydrox:an ide:d", "", "hiđroxit", ""],
  ["CN", 1, "cyan:an ide:d", "hydrocyanic acid", "xianua", "axit xianhiđric"],
  ["NO3", 1, "nitr:an ate:d", "nitric acid", "nitrat", "axit nitric"],
  ["NO2", 1, "nitr:an ite:d", "nitrous acid", "nitrit", "axit nitrơ"],
  ["SO4", 2, "sulf:an ate:d", "sulfuric acid", "sunfat", "axit sunfuric"],
  ["SO3", 2, "sulf:an ite:d", "sulfurous acid", "sunfit", "axit sunfurơ"],
  ["HSO4", 1, "hydrogen:t sulf:an ate:d", "", "hiđrosunfat", ""],
  ["HSO3", 1, "hydrogen:t sulf:an ite:d", "", "hiđrosunfit", ""],
  ["CO3", 2, "carbon:an ate:d", "carbonic acid", "cacbonat", "axit cacbonic"],
  ["HCO3", 1, "hydrogen:t carbon:an ate:d", "", "hiđrocacbonat", ""],
  ["PO4", 3, "phosph:an ate:d", "phosphoric acid", "photphat", "axit photphoric"],
  ["HPO4", 2, "hydrogen:t phosph:an ate:d", "", "hiđrophotphat", ""],
  ["H2PO4", 1, "dihydrogen:t phosph:an ate:d", "", "đihiđrophotphat", ""],
  ["SiO3", 2, "silic:an ate:d", "silicic acid", "silicat", "axit silicic"],
  ["ClO", 1, "hypo:t chlor:an ite:d", "hypochlorous acid", "hipoclorit", "axit hipoclorơ"],
  ["ClO3", 1, "chlor:an ate:d", "chloric acid", "clorat", "axit cloric"],
  ["ClO4", 1, "per:t chlor:an ate:d", "perchloric acid", "peclorat", "axit pecloric"],
  ["MnO4", 1, "per:t mangan:an ate:d", "permanganic acid", "pemanganat", "axit pemanganic"],
  ["CrO4", 2, "chrom:an ate:d", "chromic acid", "cromat", "axit cromic"],
  ["Cr2O7", 2, "di:t chrom:an ate:d", "dichromic acid", "đicromat", "axit đicromic"],
  ["CH3COO", 1, "ethano:an ate:d", "ethanoic acid", "axetat", "axit axetic"]
];
const AN = {}; AN_THO.forEach(([ct, q, m, acid, cu, acidCu]) => {
  AN[ct] = { ct, q, manh: m.split(" ").map(x => { const [t, k] = x.split(":"); return { t, k }; }), acid, cu, acidCu };
});
AN.CH3COO.thuong = "acetate"; AN.CH3COO.acidThuong = "acetic acid";

/* Phi kim — thứ tự IUPAC khi gọi tên hợp chất hai phi kim (nguyên tố đứng trước gọi trước) */
const THU_TU_PK = ["Rn","Xe","Kr","B","Si","C","Sb","As","P","N","H","Te","Se","S","At","I","Br","Cl","O","F"];
const GOC_PK = { O:"ox", S:"sulf", N:"nitr", P:"phosph", C:"carb", Si:"silic", Se:"selen", Te:"tellur", As:"arsen", H:"hydr", B:"bor", F:"fluor", Cl:"chlor", Br:"brom", I:"iod", Sb:"antimon", Xe:"xen", Kr:"krypt" };
const TIEN_TO = ["", "mono", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "nona", "deca"];
const TIEN_TO_VN = ["", "mono", "đi", "tri", "tetra", "penta", "hexa", "hepta", "octa", "nona", "đeca"];

/* Chất có tên riêng (IUPAC chấp nhận) — tra trước khi ghép */
const RIENG = {
  "H2O": ["water", "nước", "Tên riêng được IUPAC giữ lại; tên hệ thống: oxidane."],
  "H2O2": ["hydrogen peroxide", "hiđro peoxit", "Gốc peroxide O₂²⁻ (hai O nối nhau)."],
  "Na2O2": ["sodium peroxide", "natri peoxit", "Gốc peroxide O₂²⁻."],
  "K2O2": ["potassium peroxide", "kali peoxit", "Gốc peroxide O₂²⁻."],
  "BaO2": ["barium peroxide", "bari peoxit", "Gốc peroxide O₂²⁻."],
  "NH3": ["ammonia", "amoniac", "Tên riêng được IUPAC giữ lại; tên hệ thống: azane."],
  "CH4": ["methane", "metan", "Alkane đơn giản nhất."],
  "PH3": ["phosphane", "photphin", "Tên cũ: phosphine."],
  "SiH4": ["silane", "silan", ""],
  "H2S": ["hydrogen sulfide", "hiđro sunfua", "Khí H₂S. Khi tan trong nước gọi là hydrosulfuric acid."],
  "HCl": ["hydrogen chloride", "hiđro clorua", "Khí HCl. Dung dịch trong nước: hydrochloric acid."],
  "HF": ["hydrogen fluoride", "hiđro florua", "Khí HF. Dung dịch trong nước: hydrofluoric acid."],
  "HBr": ["hydrogen bromide", "hiđro bromua", "Khí HBr. Dung dịch trong nước: hydrobromic acid."],
  "HI": ["hydrogen iodide", "hiđro iotua", "Khí HI. Dung dịch trong nước: hydroiodic acid."],
  "O3": ["ozone", "ozon", "Tên hệ thống: trioxygen."],
  "O2": ["oxygen", "oxi", "Phân tử O₂, tên hệ thống: dioxygen."],
  "N2": ["nitrogen", "nitơ", "Phân tử N₂, tên hệ thống: dinitrogen."],
  "H2": ["hydrogen", "hiđro", "Phân tử H₂, tên hệ thống: dihydrogen."],
  "Cl2": ["chlorine", "clo", "Phân tử Cl₂, tên hệ thống: dichlorine."],
  "Br2": ["bromine", "brom", "Phân tử Br₂."], "I2": ["iodine", "iot", "Phân tử I₂."], "F2": ["fluorine", "flo", "Phân tử F₂."],
  "Fe3O4": ["iron(II,III) oxide", "oxit sắt từ", "Hỗn hợp FeO·Fe₂O₃: có cả Fe²⁺ và Fe³⁺."],
  "NH4OH": ["ammonium hydroxide", "amoni hiđroxit", "Thực chất là dung dịch NH₃ trong nước."],
  "P4O10": ["tetraphosphorus decaoxide", "điphotpho pentaoxit", "Hay viết gọn là P₂O₅: diphosphorus pentaoxide."]
};

/* Chất hữu cơ hay gặp (tra theo công thức) — tên hệ thống | tên thường | tên tiếng Việt cũ */
const HUU_CO = {
  "C2H6": ["ethane", "", "etan"], "C3H8": ["propane", "", "propan"], "C4H10": ["butane", "", "butan"],
  "C2H4": ["ethene", "ethylene", "etilen"], "C3H6": ["propene", "propylene", "propilen"], "C2H2": ["ethyne", "acetylene", "axetilen"],
  "C6H6": ["benzene", "", "benzen"], "C6H5CH3": ["methylbenzene", "toluene", "toluen"],
  "CH3OH": ["methanol", "", "ancol metylic"], "C2H5OH": ["ethanol", "", "ancol etylic"], "CH3CH2OH": ["ethanol", "", "ancol etylic"],
  "C3H7OH": ["propan-1-ol", "", "ancol propylic"], "C6H5OH": ["phenol", "", "phenol"],
  "C2H4(OH)2": ["ethane-1,2-diol", "ethylene glycol", "etylen glicol"], "C3H5(OH)3": ["propane-1,2,3-triol", "glycerol", "glixerol"],
  "HCHO": ["methanal", "formaldehyde", "anđehit fomic"], "CH3CHO": ["ethanal", "acetaldehyde", "anđehit axetic"],
  "HCOOH": ["methanoic acid", "formic acid", "axit fomic"], "CH3COOH": ["ethanoic acid", "acetic acid", "axit axetic"],
  "CH3COCH3": ["propanone", "acetone", "axeton"], "CH3COOC2H5": ["ethyl ethanoate", "ethyl acetate", "etyl axetat"],
  "CH3Cl": ["chloromethane", "methyl chloride", "metyl clorua"], "CH2Cl2": ["dichloromethane", "", "điclometan"],
  "CHCl3": ["trichloromethane", "chloroform", "clorofom"], "CCl4": ["tetrachloromethane", "carbon tetrachloride", "cacbon tetraclorua"],
  "C2H5Cl": ["chloroethane", "ethyl chloride", "etyl clorua"], "CH3NH2": ["methanamine", "methylamine", "metylamin"],
  "C2H5NH2": ["ethanamine", "ethylamine", "etylamin"], "C6H5NH2": ["aniline", "", "anilin"],
  "C6H12O6": ["glucose", "", "glucozơ"], "C12H22O11": ["sucrose", "", "saccarozơ"]
};


/* Hợp chất hay gặp ở THCS–THPT (dùng cho tra cứu, luyện tập, thu tiếng cả câu) */
const DS_HC = ("H2O H2O2 NH3 CH4 O3 CO CO2 SO2 SO3 NO NO2 N2O N2O5 P2O5 SiO2 CS2 PCl3 PCl5 " +
  "HCl HF HBr HI H2S H2SO4 H2SO3 HNO3 HNO2 H3PO4 H2CO3 HClO HClO3 HClO4 HCN " +
  "NaOH KOH LiOH Ca(OH)2 Ba(OH)2 Mg(OH)2 Al(OH)3 Fe(OH)2 Fe(OH)3 Cu(OH)2 Zn(OH)2 NH4OH " +
  "Na2O K2O CaO MgO BaO Al2O3 ZnO FeO Fe2O3 Fe3O4 CuO Cu2O MnO2 PbO CrO3 Cr2O3 Ag2O HgO " +
  "NaCl KCl CaCl2 MgCl2 BaCl2 AlCl3 FeCl2 FeCl3 CuCl2 ZnCl2 AgCl NH4Cl NaBr KBr KI AgBr AgI NaF CaF2 " +
  "Na2S K2S FeS ZnS CuS PbS Ag2S " +
  "Na2SO4 K2SO4 CuSO4 FeSO4 Fe2(SO4)3 Al2(SO4)3 ZnSO4 MgSO4 CaSO4 BaSO4 (NH4)2SO4 NaHSO4 Na2SO3 " +
  "NaNO3 KNO3 AgNO3 Ca(NO3)2 Cu(NO3)2 Fe(NO3)3 Pb(NO3)2 NH4NO3 NaNO2 " +
  "Na2CO3 K2CO3 CaCO3 MgCO3 BaCO3 NaHCO3 Ca(HCO3)2 (NH4)2CO3 " +
  "Na3PO4 Ca3(PO4)2 Ca(H2PO4)2 (NH4)3PO4 NaH2PO4 Na2HPO4 Na2SiO3 " +
  "KMnO4 KClO3 NaClO K2Cr2O7 K2CrO4 KCN CH3COONa (CH3COO)2Ca NaH CuSO4·5H2O " +
  "C2H6 C3H8 C4H10 C2H4 C3H6 C2H2 C6H6 CH3OH C2H5OH C3H5(OH)3 C6H5OH HCHO CH3CHO HCOOH CH3COOH CH3COCH3 CH3COOC2H5 CH3Cl CHCl3 CCl4 CH3NH2 C6H5NH2 C6H12O6 C12H22O11").split(" ");

/* ---------- Đọc công thức ---------- */
const CHI_SO = { "₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9" };
function chuan(ct) { return String(ct || "").replace(/[₀-₉]/g, c => CHI_SO[c]).replace(/\s+/g, "").replace(/[\[{]/g, "(").replace(/[\]}]/g, ")").replace(/[.*•]/g, "·"); }

function phanTich(s) { // → [{e:'Fe',n:2} | {g:[...], n:3, chu:'SO4'}]
  let i = 0;
  function so() { let t = ""; while (i < s.length && /\d/.test(s[i])) t += s[i++]; return t ? +t : 1; }
  function day(dong) {
    const ra = [];
    while (i < s.length) {
      const c = s[i];
      if (c === "(") { const bd = ++i; const g = day(true); const chu = s.slice(bd, i); if (s[i] !== ")") throw "Thiếu dấu ngoặc đóng «)»."; i++; ra.push({ g, n: so(), chu }); }
      else if (c === ")") { if (!dong) throw "Thừa dấu ngoặc đóng «)»."; return ra; }
      else if (/[A-Z]/.test(c)) { let e = c; i++; if (i < s.length && /[a-z]/.test(s[i])) e += s[i++];
        if (!NT_K[e]) { if (e.length === 2 && NT_K[e[0]]) { e = e[0]; i--; } else throw "Không có nguyên tố «" + e + "». Kí hiệu viết chữ hoa đầu, chữ thường sau (Co là cobalt, CO là carbon monoxide)."; }
        ra.push({ e, n: so() }); }
      else if (/[a-z]/.test(c)) throw "Kí hiệu nguyên tố phải bắt đầu bằng chữ HOA: gõ «" + c.toUpperCase() + "…» thay cho «" + c + "…».";
      else if (/\d/.test(c)) throw "Chỉ số đứng SAU kí hiệu nguyên tố (VD H2O, không gõ 2HO).";
      else throw "Kí tự lạ «" + c + "» trong công thức.";
    }
    if (dong) throw "Thiếu dấu ngoặc đóng «)».";
    return ra;
  }
  return day(false);
}
function demNT(ds, k, ra) { ra = ra || {}; ds.forEach(u => { if (u.e) ra[u.e] = (ra[u.e] || 0) + u.n * k; else demNT(u.g, u.n * k, ra); }); return ra; }
function chuDon(ds) { return ds.map(u => u.e ? u.e + (u.n > 1 ? u.n : "") : "(" + u.chu + ")" + (u.n > 1 ? u.n : "")).join(""); }

/* ---------- Ghép tên ---------- */
function ketQua(manh, cu, buoc, them) {
  const ten = manh.map(m => m.t).join("");
  return Object.assign({ ok: true, ten, manh, cu: cu || "", buoc: buoc || [] }, them || {});
}
function m(t, k) { return { t, k }; }
function tenCation(e, q) {
  const kl = KL[e], ten = e === "NH4" ? "ammonium" : NT_K[e].ten;
  const cu = e === "NH4" ? "amoni" : (NT_K[e].cu || NT_K[e].ten);
  const manh = [m(ten, "cat")]; let cuTen = cu;
  if (kl && kl.length > 1) { manh.push(m("(" + LA_MA[q] + ")", "so")); cuTen += "(" + LA_MA[q] + ")"; }
  return { manh, cu: cuTen };
}

function ghep(ctVao) {
  const s0 = chuan(ctVao);
  if (!s0) return { ok: false, loi: "Sếp gõ công thức, VD: Fe2(SO4)3" };
  // ngậm nước: CuSO4·5H2O
  const nn = s0.match(/^(.+)·(\d*)H2O$/);
  if (nn) {
    const r = ghep(nn[1]); if (!r.ok) return r;
    const k = nn[2] ? +nn[2] : 1;
    const manh = r.manh.concat([m(" ", ""), m(TIEN_TO[k] === "mono" ? "mono" : TIEN_TO[k], "t"), m("hydrate", "d")]);
    return ketQua(manh, r.cu + " ngậm " + k + " phân tử nước", r.buoc.concat(["Có " + k + " phân tử nước kết tinh → thêm «" + TIEN_TO[k] + "hydrate»."]), { loai: r.loai });
  }
  if (RIENG[s0]) { const [t, cu, gc] = RIENG[s0]; return ketQua([m(t, "rieng")], cu, ["Chất này có tên riêng được IUPAC chấp nhận."], { ghiChu: gc, loai: "riêng" }); }
  if (HUU_CO[s0]) { const [t, th, cu] = HUU_CO[s0]; return ketQua([m(t, "rieng")], cu, ["Chất hữu cơ — tra bảng chất hay gặp. Muốn hiểu cách ghép tên, mở mục «Hữu cơ»."], { thuong: th, loai: "hữu cơ" }); }

  // muối acetate: CH3COONa, (CH3COO)2Ca
  let ac = s0.match(/^\(CH3COO\)(\d+)([A-Z][a-z]?)$/) || s0.match(/^CH3COO([A-Z][a-z]?)$/);
  let ds;
  try { ds = ac ? null : phanTich(s0); } catch (e) { return { ok: false, loi: e }; }
  let cat, catN, anCt, anN;
  if (ac) { if (ac.length === 3) { anN = +ac[1]; cat = ac[2]; } else { anN = 1; cat = ac[1]; } catN = 1; anCt = "CH3COO"; }
  else {
    const dem = demNT(ds, 1); const loai = Object.keys(dem);
    if (loai.length === 1) { const e = NT_K[loai[0]]; return ketQua([m(e.ten, "cat")], e.cu || e.ten, ["Chỉ có một nguyên tố → đơn chất, gọi theo tên nguyên tố."], { loai: "đơn chất" }); }
    if (ds[0].e === "C" && dem.H) return { ok: false, loi: "Chất hữu cơ này chưa có trong bảng tra. Sếp mở mục «Hữu cơ» để dựng mạch carbon và ghép tên." };
    // tách cation
    let u0 = ds[0], phan = ds.slice(1);
    if (u0.g && u0.chu === "NH4") { cat = "NH4"; catN = u0.n; }
    else if (u0.e === "N" && ds[1] && ds[1].e === "H" && ds[1].n === 4 && ds.length > 2) { cat = "NH4"; catN = 1; phan = ds.slice(2); }
    else if (u0.e) { cat = u0.e; catN = u0.n; }
    else return { ok: false, loi: "Công thức nên viết phần dương (kim loại, H hoặc NH4) trước, gốc âm sau." };
    if (phan.length === 0) return { ok: false, loi: "Công thức chưa có phần gốc âm." };
    if (phan.length === 1 && phan[0].g) { anCt = phan[0].chu; anN = phan[0].n; }
    else if (phan.length === 1 && phan[0].e) { anCt = phan[0].e; anN = phan[0].n; }
    else { anCt = chuDon(phan); anN = 1; }
    if (anCt === "OH" || anCt === "HO") anCt = "OH";
  }

  const an = AN[anCt];
  const laKL = cat === "NH4" || !!KL[cat];
  // hai phi kim
  if (!laKL) {
    const e2 = /^[A-Z][a-z]?$/.test(anCt) ? { e: anCt, n: anN } : null;
    const coPK = e2 && THU_TU_PK.indexOf(cat) >= 0 && THU_TU_PK.indexOf(e2.e) >= 0 && cat !== e2.e;
    if (cat === "H" && an && !coPK) { /* acid có oxygen — xử lí ở dưới */ }
    else if (coPK && !(cat === "H" && an && an.acid)) {
      const n1 = catN, n2 = e2.n, a = NT_K[cat], b = e2.e;
      const t1 = n1 > 1 ? TIEN_TO[n1] : "";
      let t2 = TIEN_TO[n2];
      if (b === "O" && n2 === 1) t2 = "mon"; // monoxide: ngoại lệ IUPAC cho phép bỏ «o»
      const manh = []; if (t1) manh.push(m(t1, "t")); manh.push(m(a.ten, "cat")); manh.push(m(" ", "")); manh.push(m(t2, "t")); manh.push(m(GOC_PK[b], "an")); manh.push(m("ide", "d"));
      const vn1 = (n1 > 1 ? TIEN_TO_VN[n1] : "") + (a.cu || a.ten);
      const vnGoc = { O: "oxit", S: "sunfua", N: "nitrua", Cl: "clorua", F: "florua", Br: "bromua", I: "iotua", H: "hiđrua", P: "photphua", C: "cacbua", Se: "selenua" }[b] || GOC_PK[b] + "ua";
      const vn2 = (b === "O" && n2 === 1 ? "mono" : n2 > 1 ? TIEN_TO_VN[n2] : "") + vnGoc;
      const buoc = ["Hai phi kim liên kết với nhau → dùng tiền tố chỉ số nguyên tử: mono-1, di-2, tri-3, tetra-4, penta-5, hexa-6, hepta-7.",
        "Phi kim đứng trước: tên nguyên tố" + (n1 > 1 ? " kèm tiền tố «" + t1 + "»" : " (chỉ 1 nguyên tử thì không ghi mono)") + ".",
        "Phi kim đứng sau: tiền tố «" + TIEN_TO[n2] + "» + gốc «" + GOC_PK[b] + "» + đuôi «-ide»." + (b === "O" && n2 === 1 ? " Riêng «monooxide» viết gọn là «monoxide»." : "")];
      if (THU_TU_PK.indexOf(cat) > THU_TU_PK.indexOf(b)) buoc.push("⚠️ Theo IUPAC, " + b + " thường được viết và gọi trước " + cat + ".");
      return ketQua(manh, vn1 + " " + vn2, buoc, { loai: "hai phi kim", n1, n2 });
    }
    else if (cat !== "H") return { ok: false, loi: "Em chưa có quy tắc cho «" + s0 + "». Bản này ghép được: muối, oxide, acid, base vô cơ và hợp chất hai phi kim; chất hữu cơ xem mục «Hữu cơ»." };
  }
  if (!an) {
    return { ok: false, loi: "Em chưa nhận ra gốc «" + anCt + "». Các gốc em biết: " + Object.keys(AN).filter(k => k !== "H").join(", ") + "." };
  }
  const tongAm = an.q * anN;
  // acid
  if (cat === "H") {
    if (catN !== an.q) return { ok: false, loi: "Gốc " + anCt + " có điện tích " + an.q + "−, nên acid cần " + an.q + " nguyên tử H (không phải " + catN + ")." };
    if (!an.acid) return { ok: false, loi: "Gốc «" + anCt + "» không tạo acid thông dụng." };
    const [goc, ...sau] = an.acid.split(" ");
    let manh;
    const daDuoi = an.acid.match(/^(hydro)?(.+?)(ic|ous) acid$/);
    if (daDuoi) { manh = []; if (daDuoi[1]) manh.push(m("hydro", "t")); manh.push(m(daDuoi[2], "an")); manh.push(m(daDuoi[3], "d")); manh.push(m(" acid", "acid")); }
    else manh = [m(an.acid, "acid")];
    const coO = /O/.test(anCt);
    const buoc = [coO ? "Acid có oxygen: lấy tên gốc, đổi «-ate» → «-ic acid», «-ite» → «-ous acid»." : "Acid không có oxygen: «hydro» + gốc phi kim + «-ic acid».",
      "Gốc " + anCt + " (" + an.manh.map(x => x.t).join("") + ") → " + an.acid + "."];
    return ketQua(manh, an.acidCu, buoc, { loai: "acid", thuong: an.acidThuong || "" });
  }
  // muối / oxide / base
  let q = tongAm / catN;
  const hopLe = cat === "NH4" ? [1] : KL[cat];
  if (!hopLe) return { ok: false, loi: NT_K[cat].ten + " (" + cat + ") không phải kim loại; em chưa ghép được kiểu chất này." };
  if (!Number.isInteger(q) || hopLe.indexOf(q) < 0) {
    return { ok: false, loi: "Hoá trị không khớp: " + anN + " × " + anCt + "(" + an.q + "−) = " + tongAm + "−, chia cho " + catN + " " + cat + " thì mỗi " + cat + " mang " + (Number.isInteger(q) ? q : q.toFixed(2)) + "+. Nhưng " + cat + " chỉ có hoá trị " + hopLe.join(", ") + ". Sếp xem lại chỉ số nhé.", goiY: hopLe.map(h => goiYCT(cat, h, anCt, an.q)) };
  }
  const c = tenCation(cat, q);
  const manh = c.manh.concat([m(" ", "")]).concat(an.manh.map(x => m(x.t, x.k)));
  const loai = anCt === "O" ? "oxide" : anCt === "OH" ? "base (hydroxide)" : "muối";
  const buoc = [];
  if (KL[cat] && KL[cat].length > 1) buoc.push(cat + " có nhiều hoá trị (" + KL[cat].map(h => LA_MA[h]).join(", ") + ") → tính: " + anN + " × " + an.q + "− = " + tongAm + "−, chia " + catN + " nguyên tử " + cat + " → " + cat + " mang " + q + "+ → ghi (" + LA_MA[q] + ") ngay sau tên, không cách.");
  else buoc.push((cat === "NH4" ? "Cation NH₄⁺ gọi là ammonium" : cat + " chỉ có một hoá trị (" + LA_MA[q] + ") → không ghi số La Mã") + ".");
  buoc.push("Gốc " + anCt + ": " + an.manh.map(x => x.t).join("") + (anCt === "O" ? " (oxide)." : anCt === "OH" ? " (hydroxide)." : an.manh.some(x => x.t === "ate") ? " — gốc có oxygen nhiều hơn → đuôi «-ate»." : an.manh.some(x => x.t === "ite") ? " — gốc có oxygen ít hơn → đuôi «-ite»." : " — gốc không có oxygen → đuôi «-ide»."));
  buoc.push("Ghép: tên cation + dấu cách + tên gốc.");
  const r = ketQua(manh, c.cu + " " + an.cu, buoc, { loai, cat, q, anCt, coSo: !!(KL[cat] && KL[cat].length > 1) });
  if (an.thuong) r.thuong = r.ten.replace(/ethanoate$/, "acetate");
  return r;
}
function phan1(ct) { const r = ct.match(/^([A-Z][a-z]?)(\d*)$/); return r && NT_K[r[1]] ? { e: r[1], n: r[2] ? +r[2] : 1 } : null; }
function bcnn(a, b) { const g = (x, y) => y ? g(y, x % y) : x; return a * b / g(a, b); }
function goiYCT(cat, q, anCt, aq) {
  const l = bcnn(q, aq), nc = l / q, na = l / aq;
  const goc = anCt.length > 2 || /\d/.test(anCt) && na > 1 ? "(" + anCt + ")" : anCt;
  return cat + (nc > 1 ? nc : "") + (na > 1 ? (/^[A-Z][a-z]?$/.test(anCt) ? anCt : "(" + anCt + ")") + na : anCt);
}

/* ---------- Hữu cơ: dựng mạch ---------- */
const GOC_HC = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
const GOC_HC_VN = ["", "met", "et", "prop", "but", "pent", "hex", "hept", "oct", "non", "đec"];
const HO = {
  an:  { ten: "Alkane", duoi: "ane", ct: "CₙH₂ₙ₊₂", min: 1, vt: false },
  en:  { ten: "Alkene", duoi: "ene", ct: "CₙH₂ₙ", min: 2, vt: true },
  yn:  { ten: "Alkyne", duoi: "yne", ct: "CₙH₂ₙ₋₂", min: 2, vt: true },
  ol:  { ten: "Alcohol", duoi: "ol", ct: "CₙH₂ₙ₊₁OH", min: 1, vt: true },
  al:  { ten: "Aldehyde", duoi: "al", ct: "Cₙ₋₁H₂ₙ₋₁CHO", min: 1, vt: false },
  oic: { ten: "Carboxylic acid", duoi: "oic acid", ct: "Cₙ₋₁H₂ₙ₋₁COOH", min: 1, vt: false },
  one: { ten: "Ketone", duoi: "one", ct: "CₙH₂ₙO", min: 3, vt: true },
  amin:{ ten: "Amine", duoi: "amine", ct: "CₙH₂ₙ₊₁NH₂", min: 1, vt: true }
};
const THUONG_HC = { "ethene": "ethylene", "propene": "propylene", "ethyne": "acetylene", "methanal": "formaldehyde", "ethanal": "acetaldehyde",
  "methanoic acid": "formic acid", "ethanoic acid": "acetic acid", "propanone": "acetone", "methanamine": "methylamine", "ethanamine": "ethylamine" };
function viTriHopLe(n, loai) { // danh sách vị trí nhỏ nhất có thể
  if (!HO[loai].vt) return [1];
  if (loai === "en" || loai === "yn") { const ra = []; for (let i = 1; i <= Math.floor(n / 2); i++) ra.push(i); return ra; }
  if (loai === "one") { const ra = []; for (let i = 2; i <= Math.ceil(n / 2); i++) ra.push(i); return ra; }
  const ra = []; for (let i = 1; i <= Math.ceil(n / 2); i++) ra.push(i); return ra;
}
function tenHuuCo(n, loai, vt) {
  const h = HO[loai]; vt = vt || 1;
  if (n < h.min) return { ok: false, loi: h.ten + " cần ít nhất " + h.min + " nguyên tử carbon." };
  let dao = false;
  if (h.vt) {
    const doiXung = (loai === "en" || loai === "yn") ? n - vt : n + 1 - vt;
    if (vt > doiXung) { vt = doiXung; dao = true; }
  }
  const canSo = h.vt && ((loai === "en" || loai === "yn") ? n >= 4 : loai === "one" ? n >= 4 : n >= 3);
  const manh = [m(GOC_HC[n], "goc")];
  if (loai === "an") manh.push(m("ane", "bao"));
  else if (loai === "en" || loai === "yn") { if (canSo) manh.push(m("-" + vt + "-", "vt")); manh.push(m(h.duoi, "bao")); }
  else if (loai === "al") manh.push(m("an", "bao"), m("al", "d"));
  else if (loai === "oic") manh.push(m("an", "bao"), m("oic acid", "d"));
  else { manh.push(m("an", "bao")); if (canSo) manh.push(m("-" + vt + "-", "vt")); manh.push(m(h.duoi, "d")); }
  const ten = manh.map(x => x.t).join("");
  // công thức phân tử
  const H = loai === "an" ? 2 * n + 2 : loai === "en" ? 2 * n : loai === "yn" ? 2 * n - 2 : loai === "ol" ? 2 * n + 2 : loai === "al" || loai === "one" ? 2 * n : loai === "oic" ? 2 * n : 2 * n + 3;
  const O = loai === "ol" || loai === "al" || loai === "one" ? 1 : loai === "oic" ? 2 : 0; const N = loai === "amin" ? 1 : 0;
  const ctpt = "C" + (n > 1 ? n : "") + "H" + H + (N ? "N" : "") + (O ? "O" + (O > 1 ? O : "") : "");
  const buoc = ["Mạch chính có " + n + " C → gốc «" + GOC_HC[n] + "».",
    loai === "an" ? "Toàn liên kết đơn → «-ane»." : loai === "en" ? "Có một liên kết đôi C=C → «-ene»." : loai === "yn" ? "Có một liên kết ba C≡C → «-yne»." : "Mạch no → «-an-», rồi thêm đuôi nhóm chức «-" + h.duoi + "».",
    canSo ? "Đánh số từ đầu mạch GẦN nhóm chức hơn → vị trí " + vt + "; ghi số giữa hai gạch nối." : (h.vt ? "Mạch ngắn, nhóm chức chỉ có một vị trí → không cần ghi số." : "Nhóm chức luôn ở C số 1 → không ghi số.")];
  if (dao) buoc.push("⚠️ Sếp chọn vị trí ở nửa sau mạch → em đánh số lại từ đầu kia cho số nhỏ nhất.");
  return { ok: true, ten, manh, ctpt, vt, dao, thuong: THUONG_HC[ten] || "", cu: GOC_HC_VN[n] + (loai === "an" ? "an" : loai === "en" ? "en" : loai === "yn" ? "in" : ""), buoc };
}

/* ---------- Đọc thành lời (cho tiếng) ---------- */
function loiDoc(ten) {
  return String(ten).replace(/\((I{1,3}|IV|V|VI{0,3}|II,III)\)/g, (a, r) => " " + r.split(",").map(x => SO_DOC[LA_MA.indexOf(x)]).join(" ") + " ")
    .replace(/-(\d)(,\d)*-/g, (a) => " " + a.slice(1, -1).split(",").map(x => SO_DOC[+x]).join(" ") + " ")
    .replace(/hydrogen(?=[a-z])/g, "hydrogen ").replace(/\s+/g, " ").trim();
}
function slug(t) { return loiDoc(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

const API = { DS_HC, NT, NT_K, NHOM, GHI_CHU_NT, viTri, KL, AN, RIENG, HUU_CO, HO, GOC_HC, viTriHopLe, tenHuuCo, ghep, chuan, loiDoc, slug, LA_MA, TIEN_TO, THU_TU_PK };
if (typeof module !== "undefined" && module.exports) module.exports = API; else G.TEN = API;
})(typeof window !== "undefined" ? window : globalThis);
