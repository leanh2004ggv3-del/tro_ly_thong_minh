# 🚀 Classroom App - Trợ Lý AI Hỗ Trợ Bộ Môn Công Nghệ & Hướng Nghiệp

> 📍 **Học viên:** dangvansach86  
> 📅 **Phiên bản xuất bản:** 24/08/2026 19:39  
> 🏛️ **Kiến trúc hệ thống:** 4 Tầng (Frontend React/Vite, Vercel Edge CDN & Supabase Auth, Backend API Controllers, Supabase PostgreSQL & Storage)

---

## 🌟 GIỚI THIỆU DỰ ÁN

Ứng dụng web/app **Classroom App** được xây dựng nhằm hỗ trợ Giáo viên bộ môn **Công nghệ** và **Hoạt động trải nghiệm, hướng nghiệp** tự động hóa quy trình giảng dạy theo chương trình GDPT 2018.

### ✨ Các Tính Năng Nổi Bật:
1. **Trợ lý AI Soạn Kế Hoạch Bài Dạy (KHBD):** Tự động tạo giáo án chuẩn **Công văn 5512** (Bộ GD&ĐT) đầy đủ 4 hoạt động (*Mở đầu, Hình thành kiến thức, Luyện tập, Vận dụng*).
2. **Ngân hàng Câu hỏi & Đề Kiểm tra:** Tạo đề thi theo ma trận 4 cấp độ tư duy (*Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao*).
3. **Material Controller & Thư viện Học liệu:** Quản lý upload/download Slide bài giảng trình chiếu, file vẽ kỹ thuật CAD, video thực hành trên Supabase Storage.
4. **Xuất Báo cáo & File Văn bản:** Xuất giáo án trực tiếp ra file **Word (.docx)** và **PDF** đúng font chuẩn trình bày giáo dục.
5. **Giao diện Scientific & Vibrant UI:** Thiết kế đậm tính khoa học, màu sắc nhã nhặn (Xanh Slate, Ngọc Emerald, Cyan), tuân thủ tuyệt đối quy tắc Purple Ban (không dùng màu tím), tương thích hoàn hảo mọi thiết bị.

---

## 🗄️ CẤU TRÚC HỆ THỐNG (4 TẦNG THEO SƠ ĐỒ)

```
ho_tro_bo_mon_cn_hn/
├── index.html                    ← 🌐 Single-Page Web App chạy trực tiếp trên mọi Trình duyệt
├── database/
│   └── schema.sql                ← 🗄️ Script SQL khởi tạo Supabase PostgreSQL & Policies RLS
├── src/
│   ├── types/
│   │   └── index.ts              ← TypeScript Interfaces (Profile, LessonPlan, Material, Stats)
│   ├── services/
│   │   ├── aiService.ts          ← AI Controller & Prompting Công văn 5512 (Gemini LLM)
│   │   ├── supabase.ts           ← Middleware Auth Guard & Database Client
│   │   └── exportService.ts      ← Export Worker xuất file Word/PDF
│   └── components/
│       └── Navbar.tsx            ← Thanh Navigation chuẩn Scientific Slate
└── README.md                     ← Tài liệu hướng dẫn cài đặt & Deploy Hosting
```

---

## 🛠️ HƯỚNG DẪN CHẠY & DEPLOY HOSTING

### 1. Trải nghiệm nhanh không cần cài đặt Node.js:
Chỉ cần nhấp đúp vào tập tin `index.html` hoặc mở bằng bất kỳ trình duyệt web nào (Chrome, Edge, Cốc Cốc, Firefox) để trải nghiệm đầy đủ giao diện và tính năng.

### 2. Khởi tạo Cơ sở dữ liệu Supabase PostgreSQL:
1. Đăng nhập vào [Supabase Console](https://supabase.com).
2. Tạo dự án mới (Project).
3. Mở mục **SQL Editor** trong điều hướng Supabase.
4. Sao chép và dán toàn bộ nội dung từ tập tin `database/schema.sql` vào SQL Editor và nhấn **Run**.

### 3. Deploy lên Vercel Hosting:
1. Đưa mã nguồn lên GitHub Repository.
2. Kết nối Repository với [Vercel](https://vercel.com).
3. Đặt các biến môi trường (Environment Variables) trong Vercel Project Settings:
   - `VITE_SUPABASE_URL` = `https://<your-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<your-anon-key>`
   - `VITE_GEMINI_API_KEY` = `<your-gemini-api-key>`
4. Nhấn **Deploy** để xuất bản ứng dụng lên CDN toàn cầu.
