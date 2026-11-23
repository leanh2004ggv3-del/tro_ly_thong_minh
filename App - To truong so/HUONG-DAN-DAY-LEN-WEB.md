# Đưa bộ «TỔ TRƯỞNG SỐ» lên trang web của sếp          ✅ BẢN NHÁP

Trang của sếp: `https://leanh2004ggv3-del.github.io/tro_ly_thong_minh/`
Sau khi tải lên, bộ app sẽ ở: **`https://leanh2004ggv3-del.github.io/tro_ly_thong_minh/to-truong/`**

## Bước 1 — Tải thư mục lên GitHub (khoảng 3 phút)
1. Mở kho `tro_ly_thong_minh` trên github.com (đăng nhập tài khoản của sếp).
2. Bấm **Add file → Upload files**.
3. **Kéo nguyên thư mục `to-truong`** (trong thư mục này) thả vào trang. GitHub giữ đúng tên thư mục, gồm 9 file:
   `index.html` · `lich-nam.html` · `phan-cong.html` · `bien-ban.html` · `tien-do.html` · `ket-qua-kt.html` · `ma-tran-de.html` · `tich-hop.html` *(20/11: Tích hợp NLS – NLAI)* · `song-ngu.html` *(21/11: Song ngữ Việt – Anh cho giáo án)* · `soan-de.html` *(mới 22/11: Trợ lý soạn đề kiểm tra theo CV 7991)*
   > **Cập nhật 23/11 chiều (đọc PDF dạng ảnh):** tải lại `to-truong/soan-ppt.html` và `to-truong/soan-de.html` (ghi đè) — cả hai app tự nhận chữ tiếng Việt từ PDF quét/in từ ảnh.
   > **Cập nhật 23/11 (app 10 Soạn giáo án PowerPoint):** tải thêm `to-truong/soan-ppt.html` + `to-truong/index.html` (ghi đè) và `trang-chinh/index.html` (nhãn menu đổi thành 10).
   > **Cập nhật 22/11 (app 9 Soạn đề):** chỉ cần tải thêm `to-truong/soan-de.html` + `to-truong/index.html` (ghi đè) và `trang-chinh/index.html` (nhãn menu đổi 8 → 9). Không tải thư mục `_cong-cu/`, `_phieu-kiem/`.
> Nếu sếp **đã tải** bộ trước đó: chỉ cần tải thêm `to-truong/song-ngu.html` + `to-truong/index.html` (ghi đè) và `trang-chinh/index.html` (nhãn menu đổi 7 → 8). Chưa tải `tich-hop.html` thì tải luôn.
4. Ô *Commit changes* ghi: `Thêm bộ Tổ trưởng số` → bấm **Commit changes**.
5. Chờ 1–2 phút, mở link `…/tro_ly_thong_minh/to-truong/` để thử.

> **Không** tải lên các thư mục `_cong-cu`, `_phieu-kiem`, `anh-san-pham` (đó là đồ nghề, phiếu kiểm của em).

## Bước 2 — Thay file `index.html` của trang chính (đã gắn sẵn nút menu)
Em đã thêm mục **«Tổ Trưởng Số»** (biểu tượng cặp tài liệu, nhãn 7) vào **menu trái** và **thanh menu điện thoại**, ngay dưới «Kho E-Learning CN». Bấm vào thì 7 công cụ hiện ngay trong trang, có nút «Mở Tab Riêng».
1. Trên GitHub, **Add file → Upload files**, kéo file `trang-chinh/index.html` thả vào → **Commit changes** (ghi đè file cũ cùng tên).
2. Chờ 1–2 phút, tải lại trang chính (Ctrl + F5).

> File em sửa là **bản đang chạy trên web lúc 16:27 ngày 20/11/2026** (bản gốc giữ ở `trang-chinh/index-goc (ban dang chay 20-11).html`). Nếu sau giờ đó sếp đã sửa trang ở chỗ khác mà chưa đưa lên, **đừng tải đè**: gửi em bản mới, em gắn lại nút.
> Ba chỗ em thêm đều có ghi chú `TO_TRUONG` / `TỔ TRƯỞNG SỐ` trong mã, dễ tìm khi cần gỡ.

## Sửa app về sau
- Nội dung nằm ở `_cong-cu/src/<tên>.html`, khung chung ở `_cong-cu/chung.css`, `_cong-cu/chung.js`.
- Sửa xong chạy: `python _cong-cu/dung.py` → ra lại thư mục `to-truong/` → tải các file đổi lên GitHub (cùng chỗ, ghi đè).

## Nói với tổ trưởng các tổ khác
- Mở link là dùng, **không đăng nhập**, dữ liệu **chỉ nằm trong trình duyệt máy họ** — mỗi người một bản riêng, không ai xem được của ai.
- Cuối tuần bấm **Sao lưu tất cả** ở trang chủ để giữ file .json; đổi máy thì **Nhập lại**.
- Bảng điểm chỉ dán **mã học sinh**. Bảng phân công là **đề xuất**, hiệu trưởng quyết.

## App «Tích hợp NLS – NLAI vào giáo án» (thêm 20/11/2026)
1. Đưa giáo án lên: **Word .docx** (giữ nguyên 100% bảng, phông, lề — chỉ chèn thêm đoạn) hoặc **PDF** (app dựng lại thành Word, mất bảng/khung; PDF quét ảnh thì không đọc được). File .doc đời cũ: mở Word → Lưu thành .docx.
2. App tự nhận khung: mục Năng lực trong Mục tiêu, các Hoạt động (Khởi động, Hình thành KT, Luyện tập, Vận dụng…) và mục a) b) c) d), Bước 1.
3. Bấm **＋ NLS / ＋ NLAI** (hoặc dán dòng tích hợp từ PPCT → **Tách**): gõ **mã** (app tự điền nội dung chỉ báo theo bảng tra), chép **nội dung cần tích hợp** từ PPCT, chọn **hoạt động**.
4. **App tự lồng ghép cả bài** (theo mẫu Bài 1 CN9 của sếp), không phải chọn chỗ: mục tiêu bài có mục mới «2.3. Năng lực số (NLS)», «2.4. Năng lực Trí tuệ nhân tạo (NLAI)» (đánh số tiếp theo giáo án) · thiết bị của GV, HS · nối câu vào cuối a) Mục tiêu, b) Nội dung · thêm dòng ở c) Sản phẩm · thêm dòng cuối từng bước Chuyển giao – Thực hiện – Báo cáo – Kết luận; cuối câu ghi (NLS mã)/(NLAI mã). Câu soạn sẵn theo nội dung PPCT; bấm «✏️ Xem / sửa từng câu» để sửa hoặc bỏ tích phần không cần.
5. Xem trước (đoạn mới tô đỏ/xanh) → **Tải giáo án đã tích hợp (.docx)**. NLS chữ đỏ DC0000, NLAI chữ xanh 0066CC (như mẫu Bài 1), phông – cỡ chữ mượn của đoạn đứng trước; chữ cũ của giáo án không bị sửa.
- File giáo án **không tải lên mạng** (đọc ngay trong trình duyệt). Riêng PDF cần mạng để tải bộ đọc PDF lần đầu.
- Bảng tra mã lấy từ 2 file tham khảo của tổ (bảng NLS: 109 mã TC1–TC2; bảng NLAI lớp 6–9: 64 mã) — là **tài liệu tham khảo**, đối chiếu TT 02/2025 và QĐ 2422/2026 khi cần.

## App «Song ngữ Việt – Anh cho giáo án» (thêm 21/11/2026) — mọi môn
1. Đưa giáo án lên (**Word .docx** giữ nguyên 100% bảng, phông, công thức; PDF thì dựng lại thành Word). Chọn **môn, lớp**; gõ **tên bài bằng tiếng Anh** nếu có.
2. Tick phần cần song ngữ — mọi chữ tiếng Anh thêm vào đều **chữ xanh** (chọn được xanh dương 0070C0 hoặc xanh lá 00B050), chữ cũ giữ nguyên:
   - **Tên bài**: dòng `LESSON 4: …` ngay dưới tên bài.
   - **Đề mục khung**: `I. MỤC TIÊU (OBJECTIVES)`, `Bước 1: Chuyển giao nhiệm vụ (Step 1: Assigning tasks)`, `Tự chủ và tự học (Self-control and self-study)`… — 80 đề mục CV 5512 và kiểu giáo án cũ.
   - **Lời GV trên lớp** (Classroom English): cuối từng bước của từng hoạt động thêm `- Teacher: “Work in groups. Complete the worksheet.”` — app chọn câu theo việc ghi trong giáo án (nhóm, cặp, quan sát hình, đọc SGK trang…, bài 1 và 2, đại diện nhóm trình bày…).
   - **Từ vựng trọng tâm**: app dò thuật ngữ có trong giáo án (từ điển 13 nhóm môn, hơn 600 thuật ngữ) → chèn `* Key vocabulary (Từ vựng trọng tâm)` cuối phần Mục tiêu; thêm được từ của thầy cô.
   - **Câu dịch**: tick đoạn cần dịch → **Chép câu lệnh cho AI** → dán vào ChatGPT/Gemini → dán câu trả lời lại → app đặt từng câu tiếng Anh ngay dưới đoạn gốc. Sửa được từng câu.
3. Xem trước → **Tải giáo án song ngữ (.docx)**. Trước khi cho tải, app đọc lại **từng đoạn gốc** (phải còn nguyên từng chữ) và đếm công thức, MathType, hình — lệch là dừng.
4. **Luyện đọc** (mục 6): mỗi câu đọc **3 lần, lần sau chậm hơn** (VD 0,95× → 0,75× → 0,55×), giữa các lần **nghỉ để thầy cô đọc theo** (đếm ngược); lần chậm nhất đọc từng cụm từ. Chọn giọng Anh–Mỹ / Anh–Anh, số lần, tốc độ. 🎤 **Đọc thử**: máy nghe thầy cô đọc rồi tô chữ khớp (xanh) / chưa khớp (đỏ) — Chrome/Edge gửi tiếng nói tới máy chủ nhận dạng của hãng trình duyệt.
- Giọng đọc là giọng tiếng Anh có sẵn trên máy (Edge/Chrome có giọng tự nhiên). Máy chưa có giọng Anh thì app không đọc, hiện hướng dẫn cài. App **không đọc câu có chữ Việt**.
- Câu tiếng Anh của app (đề mục, lời GV, thuật ngữ) và câu AI dịch đều là **bản nháp** — thầy cô (hoặc GV tiếng Anh của trường) soát trước khi dạy.

## App «Trợ lý soạn giáo án PowerPoint» (thêm 23/11/2026)
1. **Bước 1 — Nạp:** điền Môn, Lớp, Tên bài; kéo thả giáo án/SGK Word (.docx), PDF hoặc ảnh. App lấy chữ, công thức Equation và **hình trong file** (ảnh Word gắn đúng mục; PDF lấy ảnh nhúng). Công thức MathType dạng ảnh: app báo để gõ lại kiểu `$…$`.
2. **Bước 2 — Dàn slide:** ⚡ *App tự dàn* (nhận Hoạt động, a/b/c/d của KHBD hoặc mục 1., 2., Ví dụ, Luyện tập của SGK; câu trắc nghiệm → slide ô A-B-C-D; phần Tổ chức thực hiện → ghi chú lời giảng) hoặc 🤖 *Nhờ AI* (chép câu lệnh → dán trả lời có dòng `=== SLIDE | loại | tiêu đề`).
3. **Bước 3 — Sửa slide & ảnh:** xem trước đúng như PowerPoint; mỗi slide **ít nhất 1 ảnh** — app tự gắn; muốn đổi bấm 🖼: ảnh tài liệu · ✂️ cắt vùng trên trang PDF · tải lên / Ctrl+V dán · 🎨 tự tạo (21 tranh chủ đề, đồ thị y = f(x), 14 hình học) · 🤖 câu lệnh nhờ AI vẽ.
4. **Bước 4 — Tải:** 6 bảng màu; máy soát phông, cỡ chữ, ảnh, công thức → **Tải PowerPoint (.pptx)** 16:9.
- **PDF dạng ảnh** (quét, chụp, in bằng «Microsoft Print to PDF» từ ảnh): app **tự nhận chữ tiếng Việt (OCR)**, tối đa 30 trang, lần đầu cần mạng để tải bộ nhận chữ (vài MB). Lời văn đọc khá đúng; **công thức, số mũ trong ảnh thì máy bỏ qua hoặc đọc sai** → nên dùng Cách 2: chép câu lệnh + đính kèm file PDF cho ChatGPT/Gemini. Ảnh chụp trang sách: tích ô «Ảnh là trang sách chụp».
- **Times New Roman** mọi chữ; nội dung **≥ 24** (mặc định 28, nội dung ngắn tự phóng 30–32); dài quá thì **tự tách slide «(tiếp)»**, không thu chữ dưới 24.
- **Công thức:** mũ, chỉ số, hoá học in bằng chữ Times New Roman; phân số, căn, hệ… thành **Equation thật** của PowerPoint (Office luôn vẽ Equation bằng phông Cambria Math — không đổi được). App đếm lại số Equation trong file, lệch là dừng.
- Đã kiểm bằng PowerPoint trên máy: bài thử Toán 9 (16 slide) và KHTN 8 (16 slide) không tràn chữ, đủ Equation — file mẫu ở `_phieu-kiem/soan-ppt-MAU-*.pptx` (không tải lên web).
- Sửa app: `_cong-cu/soan-ppt/*.js`, `_cong-cu/src/soan-ppt.html` → `python _cong-cu/dung.py soan-ppt`. Thử: `soan-ppt.html#mau` (Toán), `#mau=khtn`.
