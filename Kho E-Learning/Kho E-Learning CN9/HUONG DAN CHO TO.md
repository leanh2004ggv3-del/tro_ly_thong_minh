# Kho E-Learning Công nghệ 9 — hướng dẫn cho Tổ
✅ BẢN NHÁP — thầy/cô duyệt trước khi dùng

## Trong kho
- `00 - MUC LUC KHO E-LEARNING CN9.html` — HS mở file này trước, chọn bài.
- 13 bài tự học (mỗi bài 1 file HTML, không cần mạng): Trồng cây ăn quả B1 – B8 (`CN9 - TCAQ …`), Định hướng nghề nghiệp B1 – B5 (`CN9 - DHNN …`).
- 4 thư mục `App - … 3D CN9` — app thực hành ảo, mở từ Bài 2, 3, 8 (phải để **chung thư mục** với các bài).

## Mỗi bài có
Mục tiêu (YCCĐ chép nguyên SGK) · nội dung theo SGK, số liệu đối chiếu từng trang · hình cắt từ SGK · câu hỏi tự chấm (trắc nghiệm, đúng/sai, ghép nối, xếp thứ tự, nhận biết qua ảnh) · luyện tập ngẫu nhiên · vận dụng, phiếu in được · tổng kết + nguồn.

## Tích hợp NLS, NLAI (theo PPCT CN 9 của Tổ)
Chép đúng mã PPCT, ghi ở mục tiêu, mỗi nội dung ở **một** phần riêng; NLS chữ đỏ, NLAI chữ xanh.

| Bài | NLS | NLAI |
|---|---|---|
| TCAQ B1 | 1.1.TC2b nhận biết cây qua ảnh, vai trò qua Hình 1.2 | 9.D1.1 tạo ảnh vườn cây bằng AI, soát với thực tế |
| TCAQ B2 | 1.1.TC2c nhận ra bước giâm/chiết/ghép qua ảnh + app 3D | 9.B2.1 cẩm nang chiết cành với AI, kiểm chứng SGK |
| TCAQ B3 | 1.1TC2b nhận biết sâu bệnh cây có múi qua ảnh | 9.D2.1 kiểm thử AI chẩn đoán bệnh lá |
| TCAQ B4 | 1.1.TC2c tra bảng số thời vụ, bón phân, tưới | 9.A3.1 hỏi AI bằng giọng nói, phản biện |
| TCAQ B5 | 1.1.TC2c bộ phận, sâu bệnh xoài qua ảnh | — (PPCT không ghi) |
| TCAQ B6 | 1.1TC2b sơ đồ hố/ụ, bộ phận, sâu bệnh qua ảnh | 9.C3.1 so sánh câu hỏi chung chung – cụ thể |
| TCAQ B7 | 1.1.TC2c tranh cách bón phân, sâu bệnh, chống đổ | — |
| TCAQ B8 | 3.1.TC2a chụp, đặt tên, lưu ảnh minh chứng dự án | — |
| DHNN B1 | 1.1.TC2b nghề KT-CN qua ảnh, thông tin số | — |
| DHNN B2 | 1.1.TC2b đọc sơ đồ hệ thống giáo dục, kiểm chứng nguồn | 9.A3.2 hỏi AI, vẽ sơ đồ con đường học tập |
| DHNN B3 | 1.1.TC2c đọc bản tin thị trường lao động, đánh giá nguồn | — |
| DHNN B4 | 5.2.TC2a phiếu điện tử đối chiếu bản thân – nghề | 9.B2.1 AI gợi ý nghề, đoạn văn tự quyết định |
| DHNN B5 | 3.1.TC2a lưu giữ, trình bày kết quả bằng công cụ số | 9.A3.3 AI soát bài, Canva 3 slide |

## Tổ cần xem
- **Số liệu theo SGK, không theo GA cũ.** GA cũ TCAQ B1 ghi nhiệt độ 25 – 28 °C, pH 5,5 – 6,5 — không có trong SGK; bài E-Learning dùng số SGK (chuối 25 – 35 °C, cam quýt 23 – 29 °C…).
- PPCT TCAQ B1 ghi **NLS 1.1.TC2b**, KHBD đã duyệt ghi **1.1.TC2a** → E-Learning theo PPCT.
- PPCT TCAQ B2 ghi «sơ đồ **5 bước** chiết cành», SGK chỉ có **4 bước** → theo SGK.
- SGK TCAQ B6 Bảng 6.2 in nhầm tên «…cho xoài…» (nội dung là sầu riêng) — bài có ghi chú.
- Câu hỏi có «ví dụ giả định» (giá tiền Bài 8, câu trả lời AI giả định) đều ghi rõ là giả định.
- Phiếu tự đánh giá (Bài 1 Holland theo Bảng 1.1; DHNN B4 phiếu Tổ soạn) chỉ để tham khảo.

## Đưa lên kho
- Google Drive **không chạy** HTML khi xem trước → nén cả thư mục thành `.zip`, HS tải về, giải nén, mở `00 - MUC LUC…`.
- Chỉ chia sẻ trong trường, **không công khai** (có hình chụp SGK).
- Điện thoại mở được các bài; app 3D chạy trên máy tính.
- Tiến độ, điểm tự học lưu trong trình duyệt của máy HS; HS bấm «Tải phiếu kết quả» để nộp (không có tên, chỉ ghi mã HS tay).

## Sửa, dựng lại
Công cụ ở `🗂️ VIỆC ĐÃ LÀM/2026-11/_cong-cu-elearning-CN/`: sửa `bXX_phan.html` (nội dung) hoặc `bXX.js` (câu hỏi) → `python dung.py bXX` (hoặc `python dung.py` dựng cả kho). Duyệt xong: xoá dòng BẢN NHÁP trong `khung.html` và trong `dung.py` (trang mục lục), dựng lại. Phiếu kiểm từng bài ở `_cong-cu-elearning-CN/_phieu-kiem/`.
