# -*- coding: utf-8 -*-
"""Dựng giáo án MẪU (dữ liệu thử cho app) theo khung CV 5512: mau-ga.docx"""
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
d = Document()
st = d.styles["Normal"]; st.font.name = "Times New Roman"; st.font.size = Pt(13)
st.element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
for s in d.sections: s.left_margin = Cm(3); s.right_margin = Cm(2); s.top_margin = s.bottom_margin = Cm(2)
def p(*phan, can=None, cell=None):
    q = (cell.add_paragraph() if cell else d.add_paragraph())
    if can == "giua": q.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for t in phan:
        b = t.startswith("**"); r = q.add_run(t.strip("*")); r.bold = b
    q.paragraph_format.space_after = Pt(2)
    return q
p("Tuần: …   Tiết: …", "     Ngày soạn: …")
p("**BÀI 4. KĨ THUẬT TRỒNG VÀ CHĂM SÓC CÂY NHÃN", can="giua")
p("(Giáo án mẫu để thử app – không phải giáo án thật)", can="giua")
p("**I. MỤC TIÊU")
p("**1. Kiến thức")
p("- Trình bày được đặc điểm thực vật học và yêu cầu ngoại cảnh của cây nhãn.")
p("- Trình bày được quy trình trồng và chăm sóc cây nhãn.")
p("**2. Năng lực")
p("**a) Năng lực chung:")
p("- Tự chủ và tự học: chủ động đọc SGK, tìm hiểu thông tin.")
p("- Giao tiếp và hợp tác: thảo luận nhóm, trình bày kết quả.")
p("**b) Năng lực công nghệ:")
p("- Nhận thức công nghệ: nêu được các bước trồng, chăm sóc cây nhãn.")
p("**3. Phẩm chất")
p("- Chăm chỉ, có trách nhiệm trong học tập và lao động.")
p("**II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU")
p("- GV: SGK, ti vi, máy tính, tranh ảnh về cây nhãn.")
p("- HS: SGK, vở ghi.")
p("**III. TIẾN TRÌNH DẠY HỌC")
def hd(ten, mt, nd, sp, buoc):
    p("**" + ten)
    p("**a) Mục tiêu: ", mt)
    p("**b) Nội dung: ", nd)
    p("**c) Sản phẩm: ", sp)
    p("**d) Tổ chức thực hiện:")
    t = d.add_table(rows=1, cols=2); t.style = "Table Grid"
    h = t.rows[0].cells; h[0].text = ""; h[1].text = ""
    h[0].paragraphs[0].add_run("Hoạt động của GV và HS").bold = True
    h[1].paragraphs[0].add_run("Dự kiến sản phẩm").bold = True
    for b, viec, kq in buoc:
        r = t.add_row().cells
        r[0].paragraphs[0].add_run(b).bold = True
        for v in viec: p(v, cell=r[0])
        r[1].paragraphs[0].add_run(kq)
hd("Hoạt động 1: Khởi động (Mở đầu)", "Tạo hứng thú, kết nối hiểu biết của HS về cây nhãn.",
   "HS quan sát tranh, kể tên các giống nhãn em biết.", "Câu trả lời của HS.",
   [("Bước 1: Chuyển giao nhiệm vụ", ["- GV chiếu tranh cây nhãn, đặt câu hỏi."], ""),
    ("Bước 2: Thực hiện nhiệm vụ", ["- HS quan sát, suy nghĩ."], ""),
    ("Bước 3: Báo cáo, thảo luận", ["- 2–3 HS trả lời."], "Tên một số giống nhãn."),
    ("Bước 4: Kết luận, nhận định", ["- GV nhận xét, dẫn vào bài."], "")])
p("**Hoạt động 2: Hình thành kiến thức mới")
hd("Hoạt động 2.1: Tìm hiểu kĩ thuật trồng cây nhãn", "Trình bày được các bước trồng cây nhãn.",
   "HS đọc SGK, thảo luận nhóm.", "Phiếu học tập của nhóm.",
   [("Bước 1: Chuyển giao nhiệm vụ", ["- GV chia nhóm, phát phiếu học tập."], ""),
    ("Bước 2: Thực hiện nhiệm vụ", ["- HS đọc SGK, thảo luận, hoàn thành phiếu."], ""),
    ("Bước 3: Báo cáo, thảo luận", ["- Đại diện nhóm trình bày."], "Các bước trồng cây nhãn."),
    ("Bước 4: Kết luận, nhận định", ["- GV chốt kiến thức."], "")])
hd("Hoạt động 2.2: Tìm hiểu kĩ thuật chăm sóc cây nhãn", "Trình bày được các công việc chăm sóc cây nhãn.",
   "HS đọc SGK, trả lời câu hỏi.", "Câu trả lời của HS.",
   [("Bước 1: Chuyển giao nhiệm vụ", ["- GV nêu câu hỏi."], ""),
    ("Bước 2: Thực hiện nhiệm vụ", ["- HS làm việc cặp đôi."], ""),
    ("Bước 3: Báo cáo, thảo luận", ["- HS trình bày."], "Các công việc chăm sóc."),
    ("Bước 4: Kết luận, nhận định", ["- GV chốt."], "")])
hd("Hoạt động 3: Luyện tập", "Củng cố kiến thức về trồng và chăm sóc cây nhãn.",
   "HS trả lời câu hỏi luyện tập trong SGK.", "Đáp án của HS.",
   [("Bước 1: Chuyển giao nhiệm vụ", ["- GV giao câu hỏi."], ""),
    ("Bước 2: Thực hiện nhiệm vụ", ["- HS làm cá nhân."], ""),
    ("Bước 3: Báo cáo, thảo luận", ["- HS trình bày."], "Đáp án."),
    ("Bước 4: Kết luận, nhận định", ["- GV nhận xét."], "")])
hd("Hoạt động 4: Vận dụng", "Vận dụng kiến thức vào việc chăm sóc cây ăn quả ở gia đình.",
   "HS tìm hiểu cách chăm sóc cây ăn quả ở gia đình, địa phương.", "Bài báo cáo ngắn.",
   [("Bước 1: Chuyển giao nhiệm vụ", ["- GV giao nhiệm vụ về nhà."], ""),
    ("Bước 2: Thực hiện nhiệm vụ", ["- HS thực hiện ở nhà."], ""),
    ("Bước 3: Báo cáo, thảo luận", ["- HS nộp báo cáo tiết sau."], "Báo cáo."),
    ("Bước 4: Kết luận, nhận định", ["- GV nhận xét."], "")])
d.save("mau-ga.docx"); print("ok")
