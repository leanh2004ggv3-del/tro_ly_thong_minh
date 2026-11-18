# NHẬT KÝ CÂU LỆNH — 9 app thực hành ảo 3D Công nghệ 6, 7, 8          ✅ BẢN NHÁP

| Ngày | Thầy yêu cầu | Trợ lý AI đã làm |
|---|---|---|
| 18/11/2026 | «Dựa theo PPCT, SGK môn Công nghệ, em tiếp tục tạo các bài thực hành 3D cho CN6, 7, 8» | Rà PPCT tổ (khdh-cong-nghe-6/7/8) và mục THỰC HÀNH trong SGK KNTT; đọc ảnh trang SGK CN6 tr.61–63, 66–67, 70; CN7 tr.22–23, 34, 77–78; CN8 tr.41–43; chọn 9 bài, viết đặc tả `DAC-TA.md` |
| 18/11/2026 | «Duyệt, làm cả 9» | Tách khung dùng chung CN6–8 (`khung.html` + thư viện bước `chung.js`: nhận biết bộ phận, làm đúng trình tự, câu hỏi, tìm điểm mất an toàn) + 9 file nội dung; `python dung.py` dựng 9 app vào 3 thư mục theo khối; chạy làm mẫu trọn từng app, thử đường sai, chụp màn, sửa hình; cửa kiểm 9/9 XANH |

**Sửa app:** sửa file `.js` (hoặc `chung.js` / `khung.html` nếu sửa phần chung) → `python dung.py [tên]` → `python 0-LOI-CHUNG/cong-cu/kiem_san_pham.py "<app>.html"`.
Tên: den · noi · bep (CN6) · giam7 · trongbau · donuoc (CN7) · truyen · butthu · socuu (CN8).

## Mức, số liệu app tự đặt — SGK không ghi (thầy xem lại)
**CN6 – Đèn điện:** chức năng «bóng thuỷ tinh – bao kín, bảo vệ sợi đốt» và «đuôi đèn – nối bóng với đui đèn để lấy điện» là trợ lý ghi (SGK chỉ ghi tên bộ phận); 4 bóng mẫu chọn từ dãy thông số SGK (60 W, 36 W, 15 W, 8 W).
**CN6 – Nồi cơm điện:** nhãn «220 V ~ 700 W · 1,8 L» lấy từ Hình 10.2c; thời gian nấu 30 phút trong app là tự đặt; bước 3 bắt buộc «vo gạo trước khi lau khô nồi» (suy từ thứ tự SGK).
**CN6 – Bếp hồng ngoại:** cách bấm từng nút (Nhỏ/Vừa/To ứng 5 mức, mỗi lần +/– hẹn giờ đổi 10 phút, yêu cầu hẹn 30 phút) là của bếp mẫu trong app; SGK chỉ có bảng nút Hình 13.3.
**CN7 – Giâm cành:** giữ các mức của app CN9 (hơi chếch = 45°–80°; đất mất 15 % ẩm/ngày; rễ đạt ngày 11–14); việc «bỏ đoạn ngọn non, đoạn gốc sát thân» app giải thích bằng «không quá non hay quá già» (SGK CN7 không ghi riêng).
**CN7 – Trồng cây con có bầu:** bầu cao 12 cm; cây nghiêng ≤ 5°, lệch tâm ≤ 2 cm; nén đủ 4 phía; vun kín ≥ 6/8 ô quanh gốc; «không nén lên bầu», «giật cây làm vỡ bầu» là kiến thức chung – SGK chỉ có Hình 8.1.
**CN7 – Đo nước ao:** mỗi lượt nhiệt độ ngẫu nhiên 24 – 31,5 °C, độ trong 15 – 38 cm; đọc nhiệt kế sai quá 0,5 °C tính lỗi; lần 1 ghi khi đĩa quá sâu hơn 4 cm so với lúc vừa mất vạch tính «thả quá nhanh».
**CN8 – Truyền chuyển động:** D1 = 80 mm, D2 = 40 mm, Z1 = 20, Z2 = 30, bánh trung gian 12 răng là số của mô hình trong app; đo lệch quá 1 mm tính lỗi.
**CN8 – Bút thử điện, kìm điện:** lỗ có điện và việc ấm rò điện là ngẫu nhiên; ý «không chạm kẹp kim loại thì đèn không sáng» và «ấm rò điện phải ngừng dùng, sửa chữa» là kiến thức chung.
**CN8 – Sơ cứu:** tình huống dây điện đứt rơi, cầu dao ở xa (theo Hình 13.1 mở đầu); «không đổ nước cho nạn nhân bất tỉnh» là kiến thức chung; app chỉ luyện thứ tự và nhịp bấm – không thay buổi tập động tác trên mô hình.
