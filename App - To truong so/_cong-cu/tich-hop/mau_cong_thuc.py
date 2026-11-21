# -*- coding: utf-8 -*-
"""Dựng giáo án THỬ có công thức Toán (OMML), KHTN (chỉ số dưới/trên), đối tượng MathType (OLE) và hình
-> thu-cong-thuc.docx (chỉ để kiểm app, không tải lên web)."""
import zipfile, io, struct, zlib, re
from docx import Document
from docx.shared import Cm
from lxml import etree
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
M = "http://schemas.openxmlformats.org/officeDocument/2006/math"
def png(w, h, rgb):
    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    ch = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    return b"\x89PNG\r\n\x1a\n" + ch(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + ch(b"IDAT", zlib.compress(raw)) + ch(b"IEND", b"")
open("_hinh.png", "wb").write(png(120, 40, (200, 230, 255)))
d = Document("mau-ga.docx")
ps = d.paragraphs
def sau(txt): return next(p for p in ps if p.text.startswith(txt))
# hình thường trong ô bảng
d.tables[1].rows[2].cells[0].add_paragraph().add_run().add_picture("_hinh.png", width=Cm(3))
# KHTN: chỉ số dưới/trên
p = sau("- Trình bày được quy trình trồng")
q = p.insert_paragraph_before("- KHTN: nước ")
for t, k in [("H", 0), ("2", "sub"), ("O, khí CO", 0), ("2", "sub"), (", gia tốc 2 m/s", 0), ("2", "sup"), (", ion SO", 0), ("4", "sub"), ("2−", "sup"), (".", 0)]:
    r = q.add_run(t); r.font.subscript = k == "sub"; r.font.superscript = k == "sup"
d.save("_tam.docx")
z = zipfile.ZipFile("_tam.docx"); x = z.read("word/document.xml").decode()
omml = lambda s: f'<m:oMath xmlns:m="{M}">{s}</m:oMath>'
mr = lambda t: f'<m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t>{t}</m:t></m:r>'
phanso = omml(mr("x=") + f'<m:f><m:num>{mr("−b±")}<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>{mr("Δ")}</m:e></m:rad></m:num><m:den>{mr("2a")}</m:den></m:f>')
mu = omml(f'<m:sSup><m:e>{mr("a")}</m:e><m:sup>{mr("2")}</m:sup></m:sSup>' + mr("+") + f'<m:sSup><m:e>{mr("b")}</m:e><m:sup>{mr("2")}</m:sup></m:sSup>' + mr("=") + f'<m:sSup><m:e>{mr("c")}</m:e><m:sup>{mr("2")}</m:sup></m:sSup>')
# 1) công thức nằm NGAY trong đoạn mốc của mục tiêu bài (đoạn cuối phần Năng lực)
x = x.replace("nêu được các bước trồng, chăm sóc cây nhãn.</w:t></w:r>", "nêu được các bước trồng, chăm sóc cây nhãn: </w:t></w:r>" + mu, 1)
# 2) công thức trong ô Bước 1 của HĐ 2.1 (đoạn mốc của Tổ chức thực hiện)
x = x.replace("phát phiếu học tập.</w:t></w:r>", "phát phiếu học tập, công thức </w:t></w:r>" + phanso, 1)
# 3) đối tượng MathType (OLE) ngay trong a) Mục tiêu HĐ 3
ole = ('<w:r><w:object w:dxaOrig="1200" w:dyaOrig="400"><v:shape xmlns:v="urn:schemas-microsoft-com:vml" id="_x0000_i1099" type="#_x0000_t75" style="width:60pt;height:20pt" o:ole="" xmlns:o="urn:schemas-microsoft-com:office:office">'
       '<v:imagedata r:id="rIdTh1" o:title="" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/></v:shape>'
       '<o:OLEObject xmlns:o="urn:schemas-microsoft-com:office:office" Type="Embed" ProgID="Equation.DSMT4" ShapeID="_x0000_i1099" DrawAspect="Content" ObjectID="_1700000001" r:id="rIdTh2" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/></w:object></w:r>')
x = x.replace("Củng cố kiến thức về trồng và chăm sóc cây nhãn.</w:t></w:r>", "Củng cố kiến thức, tính </w:t></w:r>" + ole, 1)
rels = z.read("word/_rels/document.xml.rels").decode().replace("</Relationships>",
    '<Relationship Id="rIdTh1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/thu_ole.png"/>'
    '<Relationship Id="rIdTh2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject" Target="embeddings/oleObject99.bin"/></Relationships>')
ct = z.read("[Content_Types].xml").decode()
if 'Extension="bin"' not in ct: ct = ct.replace("</Types>", '<Default Extension="bin" ContentType="application/vnd.openxmlformats-officedocument.oleObject"/></Types>')
if 'Extension="png"' not in ct: ct = ct.replace("</Types>", '<Default Extension="png" ContentType="image/png"/></Types>')
out = zipfile.ZipFile("thu-cong-thuc.docx", "w", zipfile.ZIP_DEFLATED)
for i in z.infolist():
    dl = {"word/document.xml": x, "word/_rels/document.xml.rels": rels, "[Content_Types].xml": ct}.get(i.filename)
    out.writestr(i, dl.encode() if dl is not None else z.read(i))
out.writestr("word/media/thu_ole.png", png(80, 26, (255, 240, 200)))
out.writestr("word/embeddings/oleObject99.bin", b"\xd0\xcf\x11\xe0" + b"\x00" * 508)
out.close()
print("oMath", x.count("<m:oMath"), "object", x.count("<w:object"), "vertAlign", x.count("w:vertAlign"), "drawing", x.count("<w:drawing"))
