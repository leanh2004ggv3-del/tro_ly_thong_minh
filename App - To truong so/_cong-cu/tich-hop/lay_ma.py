# -*- coding: utf-8 -*-
"""Đọc 2 bảng tra mã (📖 TÀI LIỆU THAM KHẢO) -> ma_nl.js cho app Tích hợp NLS – NLAI."""
import re, json, sys, warnings
from pathlib import Path
warnings.filterwarnings("ignore")
import pymupdf
sys.stdout.reconfigure(encoding="utf-8")
TK = Path(__file__).resolve().parents[5] / "📖 TÀI LIỆU THAM KHẢO"

def dong(f):
    d = pymupdf.open(TK / f)
    return [l.strip() for p in d for l in p.get_text().split("\n")]

def nls():
    out, mien, tp, ma, buf = [], "", "", None, []
    def xong():
        if ma: out.append({"ma": ma, "nd": re.sub(r"\s+", " ", " ".join(buf)).replace("&", "và").replace("nguex", "ngữ").strip(), "mien": mien, "tp": tp})
    for l in dong("BẢNG TRA CỨU NĂNG LỰC SỐ CỦA HS.pdf"):
        if not l or re.fullmatch(r"\d+", l) or l in ("BẢNG TRA CỨU NLS CỦA HS", "Mã NLS", "Mô tả chỉ báo năng lực"):
            continue
        if re.fullmatch(r"\d\.\dTC\d[a-d]", l):
            xong(); ma, buf = l, []; continue
        m = re.match(r"^(\d)\.(\d)\.\s+(.+)", l)
        if m: xong(); ma = None; tp = l; continue
        m = re.match(r"^(\d)\.\s+(.+)", l)
        if m: xong(); ma = None; mien = l; continue
        if ma: buf.append(l)
    xong(); return out

def nlai():
    out, ma, buf, ok = [], None, [], False
    def xong():
        if ma: out.append({"ma": ma, "nd": re.sub(r"\s+", " ", " ".join(buf)).strip()})
    for l in dong("BẢNG TRA CỨU NĂNG LỰC AI  CỦA HS TỪ LỚP 6-9.pdf"):
        if l.startswith("BẢNG TRA CỨU NĂNG LỰC AI –"): xong(); ma = None; ok = True; continue
        if not ok or not l or l in ("Mã", "NL", "Yêu cầu cần đạt", "Yêu cầu cần đạt"): continue
        if re.fullmatch(r"\d\.[A-D]\d\.\d", l): xong(); ma, buf = l, []; continue
        if ma: buf.append(l)
    xong(); return out

a, b = nls(), nlai()
print(len(a), "mã NLS ·", len(b), "mã NLAI")
for x in a[:2] + a[-1:] + b[:1] + b[-1:]: print(x)
Path(__file__).with_name("ma_nl.js").write_text(
    "/* Trích từ 2 bảng tra trong 📖 TÀI LIỆU THAM KHẢO — tài liệu tham khảo, đối chiếu TT 02/2025 và QĐ 2422/2026 trước khi dùng. */\n"
    "const MA_NLS = " + json.dumps(a, ensure_ascii=False) + ";\nconst MA_NLAI = " + json.dumps(b, ensure_ascii=False) + ";\n", encoding="utf-8")
