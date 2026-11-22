# ĐẶC TẢ — App 9 (sếp duyệt 22/11/2026) «Trợ lý soạn đề kiểm tra theo CV 7991» (bộ Tổ trưởng số)          ✅ BẢN NHÁP — thầy/cô duyệt trước khi dùng

1. **Vấn đề thật:** mỗi kỳ GV mất nhiều buổi để làm đủ 4 thứ cho một đề định kì (ma trận · bản đặc tả · đề · hướng dẫn chấm), hay lệch nhau (câu trong đề không khớp ô ma trận, tổng điểm khác 10, đáp án dồn một phương án), trình bày mỗi người một kiểu.
2. **Ai dùng:** GV bộ môn, tổ trưởng — trên máy tính, qua trang `…/tro_ly_thong_minh/to-truong/soan-de.html`.
3. **Chạy ở đâu · mạng:** một file .html, thư viện đọc Word (JSZip) nhúng sẵn trong file; đọc PDF bằng pdf.js giống app Tích hợp NLS. **File giáo án/SGK chỉ đọc trong trình duyệt, không tải lên đâu cả.**
4. **Dữ liệu lưu:** bản đề đang làm lưu trong trình duyệt máy này (khoá `tts_soande`), nút Sao lưu / Nhập lại. Không có dữ liệu học sinh.
5. **Màn hình (5 bước, thanh tiến trình trên đầu):**
   | Bước | Làm gì |
   |---|---|
   | ① Thông tin đề | trường, tổ, môn, lớp, giữa/cuối kỳ, HK, năm học, thời gian (45/60/90') |
   | ② Nạp nội dung | kéo thả **Word (.docx) hoặc PDF** giáo án / trang SGK (nhiều file) → app tách chữ, tự nhận các **bài / chủ đề** → GV sửa tên, nhập số tiết; ô dán chữ cho ai không có file |
   | ③ Chọn dạng câu | bật/tắt 4 dạng: ☑ Nhiều lựa chọn · ☑ Đúng – Sai (4 ý) · ☑ Trả lời ngắn · ☑ Tự luận; chọn sẵn khung **CV 7991 (3 · 2 · 2 · 3 điểm; Biết 4 · Hiểu 3 · VD 3)**; tắt Trả lời ngắn → điểm tự dồn sang Đúng – Sai (chú thích phụ lục); GV chỉnh số câu từng ô → **ma trận vẽ ngay**, vành tròn tỉ lệ dạng/mức, báo đỏ khi tổng ≠ 10, lệch mức > 0,5đ, chủ đề có tiết mà 0 điểm |
   | ④ Soạn câu hỏi | app tạo **câu lệnh cho AI** (gồm nội dung đã nạp + ma trận + YCCĐ + khuôn trả lời bắt buộc) → GV bấm Sao chép, dán vào ChatGPT/Gemini/Copilot, dán kết quả lại → app đọc thành từng câu; GV sửa từng câu, đổi đáp án, thêm câu tay. Máy soát: mỗi câu khớp 1 ô ma trận, Đ-S đủ 4 ý, đáp án NLC rải đều A–B–C–D (không quá 2 câu liền), trả lời ngắn là một số, tổng 10 điểm |
   | ⑤ Xuất Word | xem trước khổ A4 → **một file .docx** gồm 4 phần, mỗi phần sang trang mới: **Ma trận** (khổ ngang) · **Bản đặc tả** (khổ ngang) · **Đề** (khổ dọc, có ô họ tên/lớp, Phần I–IV) · **Hướng dẫn chấm** (bảng đáp án, thang điểm Đ-S theo QĐ 764, tự luận chia ý) — **toàn bộ Times New Roman cỡ 13**, bảng kẻ viền, đầu bảng tô nhạt, lề 2 – 1,5 – 2 – 3 cm. Nút phụ: xuất riêng từng phần |
6. **KHÔNG làm:** không tự gọi AI hay gửi file đi (GV tự dán qua AI mình dùng — vì trang web tĩnh không có AI); không đăng nhập; không gọi tỉ lệ là "quy định" với THCS (ghi *"tham khảo phụ lục CV 7991 — theo hướng dẫn của Sở/quy chế trường"*); không cam đoan câu hỏi đúng — **dòng BẢN NHÁP ở cuối mọi phần**, GV duyệt kiến thức.
7. **Đo hiệu quả:** số phút làm xong bộ 4 phần cho một đề, trước/sau (GV tự bấm giờ 1 đề); số lỗi tổ phát hiện khi duyệt đề.
8. **AI ở đâu:** (a) khi làm ra: trợ lý AI viết mã theo yêu cầu của sếp; (b) khi dùng: AI soạn câu hỏi từ nội dung GV nạp, theo đúng ma trận — **GV soát, sửa, duyệt**; app tự soát lỗi kỹ thuật.
