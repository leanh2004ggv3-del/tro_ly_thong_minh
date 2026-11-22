# -*- coding: utf-8 -*-
"""Dựng mau.json (dữ liệu thử #mau của app Soạn đề) từ đề GK1 CN9 sếp đã duyệt (29/10/2026).
Tên trường, tên người để trống vì app đưa lên web công khai.
Chạy: python mau.py"""
import json, sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
NGUON = Path(__file__).resolve().parents[4] / "2026-10" / "_cong-cu-de-GK1-CN9"
sys.path.insert(0, str(NGUON))
import noi_dung as n

MUC = {"B": "B", "H": "H", "VD": "V"}
cd = []
for ma, ten, tiet in n.BAI:
    yc = {m: n.YCCD.get((ma, k), "") for k, m in MUC.items()}
    cd.append({"id": ma, "chuong": "Trồng cây ăn quả", "ten": ten, "tiet": tiet, "yc": yc,
               "text": f"(Dữ liệu thử) {ten} — SGK Công nghệ 9, Trồng cây ăn quả.", "nguon": "dữ liệu thử"})
o = {c["id"]: {d: {"B": 0, "H": 0, "V": 0} for d in ("NLC", "DS", "TLN", "TL")} for c in cd}
cau, dem, tlDiem = {}, {}, {}
khoa = n.KHOA[1]
for i, (ma, muc, sgk, de, dung, nhieu) in enumerate(n.DE1_TN):
    m = MUC[muc]; k = (ma, m); j = dem.get(("N",) + k, 0); dem[("N",) + k] = j + 1
    o[ma]["NLC"][m] += 1
    vt = "ABCD".index(khoa[i]); pa = list(nhieu); pa.insert(vt, dung)
    cau[f"NLC|{ma}|{m}|{j}"] = {"de": de, "pa": pa, "dung": vt}
for ma, muc, sgk, dan, y in n.DE1_DS:
    m = MUC[muc]; j = dem.get(("D", ma), 0); dem[("D", ma)] = j + 1
    o[ma]["DS"][m] += 4
    cau[f"DS|{ma}|{j}"] = {"de": dan, "y": [{"t": t, "d": d} for t, d in y]}
for ma, muc, sgk, diem, dan, y, hdc in n.DE1_TL:
    m = MUC[muc]; j = dem.get(("T", ma, m), 0); dem[("T", ma, m)] = j + 1
    o[ma]["TL"][m] += 1
    k = f"TL|{ma}|{m}|{j}"
    tlDiem[k] = float(diem.replace(",", "."))
    de = dan + "".join(f"\n{a}) ({d} điểm) {t}" for a, d, t in y)
    hd = [{"nd": f"{a}) {nd}" if q == 0 else nd, "d": dd} for a, ds in hdc for q, (nd, dd) in enumerate(ds)]
    cau[k] = {"de": de, "hdc": hd}
S = {"tt": {"so": "UBND PHƯỜNG ……………", "truong": "TRƯỜNG THCS ……………", "to": "TỔ: CÔNG NGHỆ – HƯỚNG NGHIỆP",
            "mon": "Công nghệ", "lop": "9", "ky": "GIỮA HỌC KÌ I", "nam": "2026 – 2027", "phut": 45,
            "maDe": "", "nguoiSoan": "", "toTruong": "", "cap": "THCS"},
     "cd": cd,
     "dang": {"NLC": {"bat": True, "d": 0.25}, "DS": {"bat": True, "d": 1, "cham": "deu"},
              "TLN": {"bat": False, "d": 0.25}, "TL": {"bat": True, "d": 1}},
     "o": o, "tlDiem": tlDiem, "cau": cau, "muc": {"B": 40, "H": 30, "V": 30}}
(Path(__file__).parent / "mau.json").write_text(json.dumps(S, ensure_ascii=False), encoding="utf-8")
print("✔ mau.json:", len(cau), "câu")
