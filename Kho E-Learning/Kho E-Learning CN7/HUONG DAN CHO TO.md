# Kho E-Learning Công nghệ 7 — hướng dẫn cho Tổ
✅ BẢN NHÁP — thầy/cô duyệt trước khi dùng

## Trong kho
- `00 - MUC LUC KHO E-LEARNING CN7.html`: HS mở file này trước rồi chọn bài.
- 16 bài tự học (HTML, không cần mạng), xếp theo thứ tự PPCT của Tổ: Trồng trọt (B1–B6) · Lâm nghiệp (B7–B8) · Thuỷ sản (B14–B16, học ở HK II trước) · Chăn nuôi (B9–B13).

## Tích hợp NLS, NLAI (theo PPCT CN 7 của Tổ, chép đúng mã)
| Bài | NLS | NLAI |
|---|---|---|
| B1 Giới thiệu về trồng trọt | 1.1TC1b: tạo từ khoá, lọc nguồn, ghi nguồn | — |
| B3 Gieo trồng, chăm sóc, phòng trừ sâu bệnh | — | 7.A1.MR1: bắt lỗi gợi ý AI giả định, đối chiếu SGK |
| B4 Thu hoạch | 3.1TC1a: áp phích số (phiếu soát + bảng tóm tắt) | — |
| B6 Dự án trồng rau an toàn | 3.1TC1a: nhật kí, báo cáo số | 7.B3.1: tạo câu lệnh, kiểm chứng, dòng khai báo dùng AI |
| B14 Giới thiệu về thuỷ sản | 1.1TC1b | — |
| B9 Giới thiệu về chăn nuôi | 1.1TC1b | — |
| B13 Lập kế hoạch nuôi vật nuôi | 3.1TC1a: bảng dự toán tự tính + làm lại trên Excel | 7.B3.1: tự phân tích gợi ý AI, khai báo |
Các bài còn lại PPCT không ghi tích hợp nên em không thêm.

## Tổ cần xem
- **B8, Hình 8.2 (trồng cây rễ trần):** KHBD ghi gợi ý thứ tự ảnh «a → e → c → d → b», nhưng khi em xem hình thì thấy có thể là a → c → e → d → b. Vì vậy bài tự học chỉ cho HS xếp **5 bước bằng chữ** (lấy theo SGK), còn thứ tự ảnh thì để HS tự trả lời và thầy cô chữa trên lớp.
- **B12, Hình 12.3 (chọn chuồng):** câu này để HS trả lời mở, thầy cô chữa (KHBD gợi ý chuồng a).
- **B13 NLAI 7.B3.1:** trong PPCT, nội dung này kết thúc bằng dấu «;». Em giữ đúng như PPCT, Tổ xem có cần ghi thêm phần sau không.
- **B6, B13, B16:** bảng tính chi phí do HS tự điền số lượng và đơn giá (lấy theo bảng SGK hoặc giá đi khảo sát). Bảng tự tính tổng, không có phần lãi/lỗ.
- **Số ví dụ để luyện tính:** độ trong Secchi ở B15 (28 cm và 24 cm) là số em tự đặt. Các bài tính tổng ở B13 (mèo ta: 5 060 000 đ) và B16 (930 000 đ) lấy theo đơn giá trong SGK.
- **An toàn:** B5 (thuốc kích thích ra rễ), B8 (cuốc xẻng), B11, B12 (vật nuôi ốm hoặc chết), B15 (thuốc cho cá, mép ao) đều có hộp nhắc: HS không tự dùng thuốc, phải báo người lớn và cán bộ thú y hoặc kĩ sư thuỷ sản.
- Nội dung và số liệu lấy theo trang SGK Công nghệ 7 KNTT (bản quét) đối chiếu với KHBD CN7 (tháng 10/2026). Hình là ảnh cắt từ SGK.

## Đưa lên kho, sửa
- Nén cả thư mục thành `.zip` để HS tải về, giải nén rồi mở `00 - MUC LUC…`. Chỉ chia sẻ trong trường vì trong bài có hình chụp SGK.
- Muốn sửa: mở `🗂️ VIỆC ĐÃ LÀM/2026-11/_cong-cu-elearning-CN/cn7/bXX_phan.html` (sửa nội dung) hoặc `bXX.js` (sửa câu hỏi), rồi chạy `python dung.py cn7 bXX` (hoặc `python dung.py cn7` để dựng lại cả khối). Phiếu kiểm nằm ở `_cong-cu-elearning-CN/_phieu-kiem-cn7/`.
