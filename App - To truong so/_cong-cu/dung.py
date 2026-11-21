# -*- coding: utf-8 -*-
"""Ghép bộ app «Tổ trưởng số»: chèn chung.css + chung.js + chân trang vào từng file src/*.html
-> ../to-truong/<tên>.html (mỗi app là MỘT file, chạy không cần mạng).
Cách dùng:  python dung.py            (ghép tất cả)
            python dung.py lich-nam   (ghép một app)
"""
import sys, re, base64
from pathlib import Path

GOC = Path(__file__).resolve().parent
RA = GOC.parent / "to-truong"
CSS = (GOC / "chung.css").read_text(encoding="utf-8")
JS = (GOC / "chung.js").read_text(encoding="utf-8")
CHAN = """<footer class="cuoi">
  <div class="nhap">✅ BẢN NHÁP — thầy/cô duyệt trước khi dùng</div>
  <div>Dữ liệu chỉ nằm trong trình duyệt máy này, không gửi đi đâu. Cuối tuần bấm <b>Sao lưu</b> để giữ một bản trên máy.</div>
  <div style="margin-top:8px"><a class="nut phu nho" href="index.html">⬅ Về trang chủ Tổ trưởng số</a></div>
</footer>"""


def ghep(f: Path):
    s = f.read_text(encoding="utf-8")
    s = s.replace("<!--CSS-->", "<style>\n" + CSS + "\n</style>")
    s = s.replace("<!--JS-->", "<script>\n" + JS + "\n</script>")
    s = s.replace("<!--CHAN-->", CHAN if f.stem != "index" else CHAN.replace(
        '<div style="margin-top:8px"><a class="nut phu nho" href="index.html">⬅ Về trang chủ Tổ trưởng số</a></div>', ""))
    s = re.sub(r"<!--NHUNG:([^>]+)-->", lambda m: (GOC / m.group(1)).read_text(encoding="utf-8").replace("</script", "<\\/script"), s)
    s = re.sub(r"<!--B64:([^>]+)-->", lambda m: base64.b64encode((GOC / m.group(1)).read_bytes()).decode(), s)
    for k in ("<!--CSS-->", "<!--JS-->", "<!--NHUNG:", "<!--B64:"):
        assert k not in s
    RA.mkdir(exist_ok=True)
    (RA / f.name).write_text(s, encoding="utf-8")
    print("✔", (RA / f.name).name, f"{len(s)//1024} KB")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    ten = sys.argv[1:]
    for f in sorted((GOC / "src").glob("*.html")):
        if not ten or f.stem in ten:
            ghep(f)
