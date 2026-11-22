#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""dung.py — dựng app «Đọc chuẩn Hoá học · IUPAC» ra thư mục hoa-hoc/ (index.html + am/*.mp3).

  python dung.py            -> ghép index.html; thu tiếng còn thiếu (CẦN MẠNG lúc thu, chỉ gửi tên hoá học)
  python dung.py --khong-thu -> chỉ ghép index.html, không thu tiếng

Tiếng: giọng Anh – Anh en-GB-SoniaNeural (edge-tts). Thu xong, trang chạy không cần mạng.
"""
import asyncio, json, subprocess, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
GOC = Path(__file__).resolve().parent
RA = GOC.parent / "hoa-hoc"
AM = RA / "am"
GIONG, TOC = "en-GB-SoniaNeural", "-8%"


def liet_ke():
    kq = subprocess.run(["node", str(GOC / "liet_ke.js")], capture_output=True, text=True, encoding="utf-8", check=True)
    return json.loads(kq.stdout)


def node_eval(js, ds):
    kq = subprocess.run(["node", "-e", js, json.dumps(ds)], capture_output=True, text=True, encoding="utf-8", check=True, cwd=GOC)
    return json.loads(kq.stdout)


async def thu(viec):
    import edge_tts
    sem = asyncio.Semaphore(6)
    loi = []

    async def mot(slug, loi_doc):
        dich = AM / (slug + ".mp3")
        async with sem:
            for lan in range(3):
                try:
                    du = b""
                    async for k in edge_tts.Communicate(loi_doc, GIONG, rate=TOC).stream():
                        if k["type"] == "audio":
                            du += k["data"]
                    if len(du) > 3000:  # tệp quá ngắn = bị cắt giữa chừng → thu lại
                        dich.write_bytes(du)
                        return
                except Exception as e:  # noqa: BLE001
                    if lan == 2:
                        loi.append((slug, str(e)))
                    await asyncio.sleep(1.5)
    await asyncio.gather(*(mot(s, l) for s, l in viec))
    return loi


DA_CAT = GOC / "da_cat_lang.json"
LOC = ("silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,"
       "silenceremove=start_periods=1:start_silence=0.08:start_threshold=-45dB,areverse")


def cat_lang():
    """Cắt khoảng lặng đầu/cuối mỗi tệp (giọng máy để thừa ~1,2 giây) → đọc ghép từng từ liền mạch."""
    try:
        import imageio_ffmpeg
        ff = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:  # noqa: BLE001
        print("⚠️ Không có ffmpeg (pip install imageio-ffmpeg) — bỏ qua bước cắt khoảng lặng")
        return
    from concurrent.futures import ThreadPoolExecutor
    da = set(json.loads(DA_CAT.read_text(encoding="utf-8"))) if DA_CAT.exists() else set()
    can = [p for p in AM.glob("*.mp3") if p.stem not in da]

    def mot(p):
        tam = p.with_suffix(".tmp.mp3")
        r = subprocess.run([ff, "-y", "-loglevel", "error", "-i", str(p), "-af", LOC, "-ac", "1", "-ar", "24000", "-b:a", "48k", str(tam)])
        if r.returncode == 0 and tam.exists() and tam.stat().st_size > 1500:
            tam.replace(p)
            return p.stem
        tam.unlink(missing_ok=True)
        return None
    with ThreadPoolExecutor(8) as ex:
        for s in ex.map(mot, can):
            if s:
                da.add(s)
    DA_CAT.write_text(json.dumps(sorted(da)), encoding="utf-8")
    print(f"Cắt khoảng lặng: {len(can)} tệp mới")


def main():
    khong_thu = "--khong-thu" in sys.argv
    AM.mkdir(parents=True, exist_ok=True)
    ds = liet_ke()
    tat_ca = ds["cau"] + ds["tu"]
    cap = node_eval("const T=require('./src/ten.js');const a=JSON.parse(process.argv[1]);"
                    "process.stdout.write(JSON.stringify(a.map(t=>[T.slug(t),T.loiDoc(t)])))", tat_ca)
    can = {}
    for s, l in cap:
        if s and s not in can:
            can[s] = l
    thieu = [(s, l) for s, l in can.items() if not (AM / (s + ".mp3")).exists()]
    print(f"Cần {len(can)} tệp tiếng · đã có {len(can) - len(thieu)} · thiếu {len(thieu)}")
    if thieu and not khong_thu:
        loi = asyncio.run(thu(thieu))
        if loi:
            print("⚠️ Chưa thu được", len(loi), "tệp:", ", ".join(s for s, _ in loi[:10]))
    cat_lang()
    co = sorted(p.stem for p in AM.glob("*.mp3"))
    html = (GOC / "src" / "app.html").read_text(encoding="utf-8")
    html = html.replace("/*TEN_JS*/", (GOC / "src" / "ten.js").read_text(encoding="utf-8"))
    html = html.replace("/*DS_AM*/[]", json.dumps(co, separators=(",", ":")))
    (RA / "index.html").write_text(html, encoding="utf-8")
    kb = sum(p.stat().st_size for p in AM.glob("*.mp3")) // 1024
    print(f"✅ {RA / 'index.html'} · {len(co)} tệp tiếng ({kb} KB)")


if __name__ == "__main__":
    main()
