# ĐẶC TẢ — Bộ app «TỔ TRƯỞNG SỐ»          ✅ BẢN NHÁP — thầy/cô duyệt trước khi dùng

1. **Vấn đề thật:** tổ trưởng chuyên môn làm nhiều việc lặp lại mỗi tháng (lịch việc, phân công, biên bản, theo dõi tiến độ, phân tích bài kiểm tra, rà ma trận đề) bằng giấy hoặc Excel rời rạc; muốn chia sẻ công cụ cho tổ trưởng các tổ khác trong trường qua trang web của sếp.
2. **Ai dùng:** tổ trưởng, tổ phó trên máy tính/điện thoại của mình.
3. **Chạy ở đâu:** trang GitHub Pages của sếp (`…/tro_ly_thong_minh/to-truong/`) hoặc mở file trực tiếp; **không cần mạng khi chạy**, không gọi máy chủ.
4. **Dữ liệu:** lưu trong trình duyệt máy đang dùng (localStorage, khoá `tts_…`); mỗi app có nút **Sao lưu / Nhập lại**; trang chủ có **Sao lưu tất cả**. Học sinh chỉ dùng **mã** (HS01…); bản mẫu dùng mã GV (GV01…).
5. **Sáu app:**
   | App | Làm gì |
   |---|---|
   | 🗓️ Lịch việc tổ | vòng 12 tháng (8 → 7), tick việc, thêm việc riêng, xuất lịch .ics vào Google Calendar |
   | 👥 Phân công tiết | tổng tiết dạy + kiêm nhiệm từng GV so với định mức **sếp tự nhập**; xuất bảng đề xuất |
   | 📝 Biên bản họp tổ | điền theo khung sổ ghi chép của tổ, xem trước khổ A4, xuất Word (.doc), lưu các lần họp |
   | 📈 Tiến độ chương trình | so tiết đã dạy với tiết lẽ ra phải tới theo tuần, báo lớp chậm |
   | 📊 Kết quả kiểm tra | dán bảng điểm (mã HS) → phổ điểm, so lớp, câu nhiều em sai |
   | 🧩 Kiểm ma trận đề | nhập từng câu (chủ đề, dạng, mức, điểm) → so tỉ lệ mục tiêu, tổng 10 điểm |
6. **KHÔNG làm:** không đăng nhập, không gửi dữ liệu đi, không xếp loại giáo viên hay giờ dạy, không tính điểm trung bình môn / mức đánh giá học sinh (việc của `tinh_ket_qua_tt22.py`), không ghi sẵn định mức tiết (TT 05/2025 cấp THCS–THPT kho chưa đối chiếu → sếp nhập theo phân công của trường), không gọi tỉ lệ ma trận là quy định Bộ (THCS theo hướng dẫn của Sở — CV 7991).
7. **Đo hiệu quả:** số phút tổ trưởng làm biên bản + báo cáo tháng trước/sau (sếp tự bấm giờ 1 tháng); số tổ trưởng khác dùng thử.
8. **AI ở đâu:** (a) khi làm ra: trợ lý AI viết mã, vẽ hình theo yêu cầu của sếp; (b) khi dùng: chưa có — có thể thêm bước «AI gợi ý kết luận biên bản» sau, tổ trưởng duyệt.
