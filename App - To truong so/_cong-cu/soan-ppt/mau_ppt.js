/* Dữ liệu thử (#mau, #mau=khtn) — giáo án ngắn do trợ lý tự viết để chạy thử, KHÔNG chép từ SGK. */
const MAU_PPT = {
  toan: {
    tt: { mon: "Toán", lop: "9", bai: "Công thức nghiệm của phương trình bậc hai một ẩn", boSach: "", gv: "", truong: "" },
    chu: `KẾ HOẠCH BÀI DẠY
Bài: Công thức nghiệm của phương trình bậc hai một ẩn
I. MỤC TIÊU
1. Kiến thức
- Nhận biết được biệt thức $\\Delta = b^2 - 4ac$ của phương trình bậc hai.
- Giải được phương trình bậc hai một ẩn bằng công thức nghiệm.
- Vận dụng được công thức nghiệm vào bài toán thực tế đơn giản.
2. Năng lực
- Năng lực tư duy và lập luận toán học.
II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- Máy chiếu, phiếu học tập.
III. TIẾN TRÌNH DẠY HỌC
Hoạt động 1: Khởi động
a) Mục tiêu: Gợi nhu cầu tìm cách giải nhanh phương trình bậc hai.
b) Nội dung: Giải phương trình $x^2 - 4x + 3 = 0$ bằng cách đưa về dạng tích.
Có cách nào giải mọi phương trình $ax^2 + bx + c = 0$ mà không cần đoán cách phân tích?
c) Sản phẩm: Câu trả lời của HS.
d) Tổ chức thực hiện:
GV chiếu phương trình, HS làm cá nhân 2 phút rồi chia sẻ.
GV đặt vấn đề vào bài.
Hoạt động 2: Hình thành kiến thức
Hoạt động 2.1: Biệt thức Delta
a) Mục tiêu: HS nhận biết biệt thức và cách tính.
b) Nội dung: Cho phương trình $ax^2 + bx + c = 0\\ (a \\ne 0)$.
Biến đổi về dạng $\\left(x + \\dfrac{b}{2a}\\right)^2 = \\dfrac{b^2 - 4ac}{4a^2}$.
Đặt **biệt thức** $\\Delta = b^2 - 4ac$.
c) Sản phẩm: Biểu thức của biệt thức Delta.
d) Tổ chức thực hiện:
GV hướng dẫn HS biến đổi từng bước theo nhóm đôi.
Bước 4: Kết luận, nhận định
GV chốt: dấu của $\\Delta$ quyết định số nghiệm của phương trình.
Hoạt động 2.2: Công thức nghiệm
a) Mục tiêu: HS phát biểu được công thức nghiệm.
b) Nội dung: Xét dấu của $\\Delta$ để kết luận nghiệm của phương trình $ax^2 + bx + c = 0\\ (a \\ne 0)$.
c) Sản phẩm:
Nếu $\\Delta > 0$: phương trình có hai nghiệm phân biệt $x_1 = \\dfrac{-b + \\sqrt{\\Delta}}{2a}$; $x_2 = \\dfrac{-b - \\sqrt{\\Delta}}{2a}$.
Nếu $\\Delta = 0$: phương trình có nghiệm kép $x_1 = x_2 = -\\dfrac{b}{2a}$.
Nếu $\\Delta < 0$: phương trình vô nghiệm.
d) Tổ chức thực hiện:
HS thảo luận nhóm 4, hoàn thành phiếu học tập số 1.
GV chốt kiến thức, HS ghi vở.
Hoạt động 3: Luyện tập
a) Mục tiêu: Áp dụng công thức nghiệm.
b) Nội dung:
Câu 1: Biệt thức của phương trình $x^2 - 5x + 6 = 0$ bằng
A. $1$
B. $-1$
C. $49$
D. $25$
Câu 2: Phương trình $2x^2 + 3x + 5 = 0$
A. có hai nghiệm phân biệt
B. có nghiệm kép
C. vô nghiệm
D. có vô số nghiệm
c) Sản phẩm: Câu 1: A; Câu 2: C.
d) Tổ chức thực hiện: HS trả lời trên bảng con.
Hoạt động 4: Vận dụng
a) Mục tiêu: Vận dụng vào bài toán thực tế.
b) Nội dung: Một mảnh vườn hình chữ nhật có chiều dài hơn chiều rộng $3$ m và diện tích $40\\ m^2$.
Gọi chiều rộng là $x$ (m), ta có phương trình $x(x + 3) = 40$, tức là $x^2 + 3x - 40 = 0$.
Quan sát đồ thị $y = x^2 + 3x - 4$ để thấy giao điểm với trục hoành.
c) Sản phẩm: Chiều rộng $5$ m, chiều dài $8$ m.
d) Tổ chức thực hiện: HS làm theo nhóm, báo cáo kết quả.
Hướng dẫn về nhà
- Học thuộc công thức nghiệm và cách xét dấu $\\Delta$.
- Hoàn thành các bài tập trong phiếu học tập số 2.
- Đọc trước nội dung công thức nghiệm thu gọn.`
  },
  khtn: {
    tt: { mon: "Khoa học tự nhiên", lop: "8", bai: "Phản ứng hoá học và định luật bảo toàn khối lượng", boSach: "", gv: "", truong: "" },
    chu: `Bài: Phản ứng hoá học và định luật bảo toàn khối lượng
I. MỤC TIÊU
- Nêu được khái niệm phản ứng hoá học, chất phản ứng và sản phẩm.
- Phát biểu được định luật bảo toàn khối lượng.
- Lập được phương trình hoá học của một số phản ứng đơn giản.
II. THIẾT BỊ DẠY HỌC
- Ống nghiệm, cân điện tử, dung dịch $BaCl_2$, dung dịch $Na_2SO_4$.
III. TIẾN TRÌNH DẠY HỌC
Hoạt động 1: Mở đầu
a) Mục tiêu: Tạo hứng thú.
b) Nội dung: Khi đốt cháy một mẩu than, khối lượng than giảm đi. Vậy khối lượng các chất có bị mất đi không?
c) Sản phẩm: Dự đoán của HS.
d) Tổ chức thực hiện: GV nêu câu hỏi, HS dự đoán.
Hoạt động 2: Hình thành kiến thức mới
Hoạt động 2.1: Phản ứng hoá học
a) Mục tiêu: Nêu được khái niệm phản ứng hoá học.
b) Nội dung: Quan sát thí nghiệm đốt khí hiđro trong oxi.
Phương trình chữ: Khí hiđro + Khí oxi → Nước.
c) Sản phẩm:
**Phản ứng hoá học** là quá trình biến đổi từ chất này thành chất khác.
Phương trình hoá học: $2H_2 + O_2 \\xrightarrow{t^\\circ} 2H_2O$.
Chất phản ứng: $H_2$, $O_2$; sản phẩm: $H_2O$.
d) Tổ chức thực hiện: GV làm thí nghiệm biểu diễn, HS quan sát và trả lời câu hỏi.
Hoạt động 2.2: Định luật bảo toàn khối lượng
a) Mục tiêu: Phát biểu được định luật.
b) Nội dung: Đặt hai cốc đựng dung dịch $BaCl_2$ và $Na_2SO_4$ lên cân, đổ vào nhau, quan sát số chỉ của cân.
$BaCl_2 + Na_2SO_4 \\rightarrow BaSO_4\\downarrow + 2NaCl$
c) Sản phẩm:
Trong một phản ứng hoá học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng.
$m_{BaCl_2} + m_{Na_2SO_4} = m_{BaSO_4} + m_{NaCl}$
d) Tổ chức thực hiện: HS làm thí nghiệm theo nhóm, ghi số chỉ của cân trước và sau phản ứng.
Hoạt động 3: Luyện tập
b) Nội dung:
Câu 1: Đốt cháy hoàn toàn $3$ g magnesium cần $2$ g khí oxygen. Khối lượng magnesium oxide tạo thành là
A. $1$ g
B. $5$ g
C. $6$ g
D. $1{,}5$ g
c) Sản phẩm: Câu 1: B.
d) Tổ chức thực hiện: HS làm cá nhân.
Hoạt động 4: Vận dụng
b) Nội dung: Giải thích vì sao khi nung đá vôi, khối lượng chất rắn sau phản ứng giảm: $CaCO_3 \\xrightarrow{t^\\circ} CaO + CO_2\\uparrow$
c) Sản phẩm: Khí $CO_2$ bay ra ngoài nên khối lượng chất rắn giảm, tổng khối lượng vẫn bảo toàn.
d) Tổ chức thực hiện: HS thảo luận nhóm đôi.
Hướng dẫn về nhà
- Học thuộc nội dung định luật bảo toàn khối lượng.
- Viết phương trình hoá học của phản ứng đốt cháy than: $C + O_2 \\xrightarrow{t^\\circ} CO_2$.`
  }
};
