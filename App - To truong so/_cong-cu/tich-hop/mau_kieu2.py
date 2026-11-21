# -*- coding: utf-8 -*-
"""GA thử KIỂU KHÁC (để kiểm app tự tìm chỗ chèn): hoạt động A. B. C. D., không có a) b) c) d), bảng 2 cột không có 'Bước 1'."""
from docx import Document
from docx.shared import Pt
d = Document(); d.styles["Normal"].font.name = "Times New Roman"; d.styles["Normal"].font.size = Pt(13)
def p(t, b=False, cell=None):
    q = cell.add_paragraph() if cell else d.add_paragraph(); r = q.add_run(t); r.bold = b; return q
p("TIẾT 12. BÀI 5: PHÉP CỘNG PHÂN SỐ (GA thử kiểu khác)", True)
p("I. MỤC TIÊU", True)
p("- Kiến thức: cộng được hai phân số.")
p("- Kĩ năng: vận dụng tính nhanh.")
p("- Thái độ: cẩn thận, chính xác.")
p("II. CHUẨN BỊ", True); p("- Máy chiếu, phiếu học tập.")
p("III. TIẾN TRÌNH DẠY HỌC", True)
p("A. KHỞI ĐỘNG", True)
p("- GV đặt câu hỏi tình huống về chia bánh.")
p("- HS suy nghĩ trả lời.")
p("B. HÌNH THÀNH KIẾN THỨC", True)
t = d.add_table(rows=1, cols=2); t.style = "Table Grid"
t.rows[0].cells[0].paragraphs[0].add_run("HOẠT ĐỘNG CỦA GV VÀ HS").bold = True
t.rows[0].cells[1].paragraphs[0].add_run("NỘI DUNG").bold = True
r = t.add_row().cells; r[0].paragraphs[0].add_run("GV yêu cầu HS đọc ví dụ 1."); p("HS làm theo nhóm đôi.", cell=r[0]); r[1].paragraphs[0].add_run("1. Cộng hai phân số cùng mẫu")
r = t.add_row().cells; r[0].paragraphs[0].add_run("GV chốt quy tắc."); r[1].paragraphs[0].add_run("Quy tắc")
p("C. LUYỆN TẬP", True)
p("Nhiệm vụ: HS làm bài 1, 2 SGK.")
p("GV gọi HS lên bảng, nhận xét.")
p("D. VẬN DỤNG", True)
p("HS tìm ví dụ cộng phân số trong đời sống.")
d.save("thu-kieu2.docx"); print("ok")
