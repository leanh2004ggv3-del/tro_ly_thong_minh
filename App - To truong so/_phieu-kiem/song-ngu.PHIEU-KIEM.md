# PHIẾU KIỂM — D:\TRIWAY GIAO VIEN THCS-THPT - Sach\3-CUA-TOI\🗂️ VIỆC ĐÃ LÀM\2026-11\App - To truong so\to-truong\song-ngu.html

**Kết luận: 🔴 ĐỎ — CHƯA GIAO, sửa 1 lỗi rồi kiểm lại**

Kiểm lúc 11:21 21/11/2026 bằng `kiem_san_pham.py`. Máy kiểm bắt lỗi kỹ thuật; **nội dung, đáp án, tính đúng với SGK vẫn do thầy cô duyệt.**

| | Mục | Chi tiết |
|---|---|---|
| 🔴 ĐỎ | Giọng đọc có thể ra giọng Anh | song-ngu.html dòng 1272 tự gọi speechSynthesis — máy chỉ có giọng Anh sẽ đọc chữ Việt bằng giọng Anh. Dùng khối chuẩn: python 0-LOI-CHUNG/cong-cu/giong_viet.py chen "song-ngu.html" rồi gọi docGiongViet("câu") |
| 🟢 ĐẠT | Không gọi mạng | không nạp thư viện ngoài, không gửi dữ liệu đi |
| 🟢 ĐẠT | Lưu dữ liệu | lưu trong trình duyệt + có nút Xuất/Sao lưu ra file |
| 🟢 ĐẠT | Đồ hoạ | song-ngu.html: hình vẽ SVG, canvas/3D/mô phỏng, nền chuyển màu, chuyển động, âm thanh phản hồi, biểu tượng màu |
| 🟢 ĐẠT | Cú pháp JavaScript | 3 khối mã, không lỗi (node --check) |
| 🟢 ĐẠT | Bấm thử (máy tính 1366×768) | tự bấm 32 lần, không lỗi |
| 🟢 ĐẠT | Bấm thử (điện thoại 390×844) | tự bấm 32 lần, không lỗi |

## Ảnh chụp màn hình

- `song-ngu.anh-kiem/may-tinh-1366x768.png`
- `song-ngu.anh-kiem/dien-thoai-390x844.png`

Chưa XANH thì không giao. Sửa xong chạy lại: `python kiem_san_pham.py "D:\TRIWAY GIAO VIEN THCS-THPT - Sach\3-CUA-TOI\🗂️ VIỆC ĐÃ LÀM\2026-11\App - To truong so\to-truong\song-ngu.html"`

## Ngoại lệ đã duyệt

Sếp chốt 21/11/2026: **giữ phần đọc tiếng Anh, giao được**. Mục ĐỎ «Giọng đọc có thể ra giọng Anh» là ngoại lệ (xem 📏 LUẬT RIÊNG 21/11/2026): app chỉ đọc tiếng Anh bằng giọng Anh, chặn câu có chữ Việt, không đọc khi máy thiếu giọng Anh. Các mục khác đều 🟢 XANH. Kiểm lại sau mỗi lần sửa: mọi mục ngoài luật 9 phải XANH.
