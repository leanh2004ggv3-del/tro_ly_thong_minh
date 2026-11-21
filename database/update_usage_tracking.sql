-- ==============================================================================
-- CÂU LỆNH SQL HOÀN CHỈNH: CẬP NHẬT CỘT & NẠP DỮ LIỆU GIÁO VIÊN VÀO BẢNG PROFILES
-- Dự án: Trợ lý AI Giảng dạy Bộ môn Công nghệ & Hướng nghiệp THCS Tịnh Biên
-- ==============================================================================

-- 1. Bổ sung các cột mới vào bảng profiles (nếu chưa có)
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS login_count INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS plans_created INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';

-- 2. Đảm bảo id có thể tự sinh UUID nếu không dùng Supabase Auth cứng
ALTER TABLE IF EXISTS public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. NẠP DỮ LIỆU DANH SÁCH GIÁO VIÊN & ADMIN ĐẦY ĐỦ VÀO BẢNG PROFILES
INSERT INTO public.profiles (id, email, phone, full_name, school_name, subject, role, login_count, plans_created, status)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'dangvansach86@gmail.com',
    '0912345686',
    'Thầy Đặng Văn Sạch',
    'THCS Tịnh Biên',
    'Công nghệ & Hướng nghiệp',
    'ADMIN',
    48,
    36,
    'ACTIVE'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'an.nguyen@edu.vn',
    '0987654321',
    'Thầy Nguyễn Văn An',
    'THCS Tịnh Biên',
    'Công nghệ 8-9',
    'TEACHER',
    32,
    24,
    'ACTIVE'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'mai.tran@edu.vn',
    '0905123456',
    'Cô Trần Thị Mai',
    'THCS Tịnh Biên',
    'HĐTN - HN 7',
    'TEACHER',
    27,
    19,
    'ACTIVE'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'nam.le@edu.vn',
    '0938765432',
    'Thầy Lê Hoàng Nam',
    'THCS Tịnh Biên',
    'Công nghệ 6-7',
    'TEACHER',
    21,
    15,
    'ACTIVE'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'lan.pham@edu.vn',
    '0918234567',
    'Cô Phạm Thị Lan',
    'THCS Tịnh Biên',
    'HĐTN - HN 8',
    'TEACHER',
    16,
    12,
    'ACTIVE'
  )
ON CONFLICT (id) DO UPDATE 
SET 
  phone = EXCLUDED.phone,
  login_count = EXCLUDED.login_count,
  plans_created = EXCLUDED.plans_created,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- 4. BẬT BẢO MẬT VÀ CẤP QUYỀN ĐỌC GHI RLS (ROW LEVEL SECURITY)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.web_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.monthly_email_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all access for profiles" ON public.profiles;
CREATE POLICY "Enable all access for profiles" ON public.profiles FOR ALL USING (true);

-- 5. NẠP DỮ LIỆU VÀO BẢNG BÁO CÁO GỬI EMAIL NGÀY 30 (MONTHLY_EMAIL_REPORTS)
INSERT INTO public.monthly_email_reports (recipient_email, report_title, month_period, status, sent_by, summary_data)
VALUES (
    'leanh2004ggv3@gmail.com',
    'Báo cáo định kỳ số lượng sử dụng web tháng 11/2026',
    '2026-11',
    'SUCCESS',
    'CRON_AUTO',
    '{"total_users": 5, "total_visits": 144, "total_plans": 106}'::jsonb
);

-- 2. Tạo bảng Nhật ký hoạt động sử dụng web chi tiết (WEB_USAGE_LOGS)
CREATE TABLE IF NOT EXISTS public.web_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'LOGIN', 'GENERATE_LESSON_5512', 'GENERATE_HDTN', 'GENERATE_PPCT', 'EXPORT_WORD', 'EXPORT_REPORT'
    action_name TEXT NOT NULL,
    action_detail TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index tối ưu truy vấn thời gian thực
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.web_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.web_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON public.web_usage_logs(action_type);

-- 3. Tạo bảng Báo cáo tổng hợp số lượng sử dụng web theo định kỳ (WEB_USAGE_REPORTS)
CREATE TABLE IF NOT EXISTS public.web_usage_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_title TEXT NOT NULL,
    report_period TEXT NOT NULL, -- 'WEEKLY', 'MONTHLY', 'SEMESTER', 'ALL_TIME'
    total_users INT NOT NULL,
    total_visits INT NOT NULL,
    total_plans_created INT NOT NULL,
    total_exports INT NOT NULL,
    report_data_json JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bật chính sách Row Level Security (RLS) bảo mật
ALTER TABLE IF EXISTS public.web_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.web_usage_reports ENABLE ROW LEVEL SECURITY;

-- Xóa chính sách cũ nếu đã tồn tại để tránh lỗi "already exists"
DROP POLICY IF EXISTS "Users can insert own usage logs" ON public.web_usage_logs;
DROP POLICY IF EXISTS "Allow authenticated insert usage logs" ON public.web_usage_logs;
DROP POLICY IF EXISTS "Users can view own logs, Admin views all" ON public.web_usage_logs;
DROP POLICY IF EXISTS "Admin view all logs, teacher view own" ON public.web_usage_logs;

-- Cho phép tất cả người dùng ghi nhận log hoạt động của chính mình
CREATE POLICY "Allow authenticated insert usage logs" ON public.web_usage_logs
    FOR INSERT WITH CHECK (true);

-- Chỉ Quản trị viên (ADMIN) và chính giáo viên mới được xem log của mình
CREATE POLICY "Admin view all logs, teacher view own" ON public.web_usage_logs
    FOR SELECT USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
        )
    );

-- 5. CÂU LỆNH TRUY VẤN XUẤT SỐ LIỆU BÁO CÁO NHANH:

-- a. Thống kê tổng số lượng sử dụng toàn hệ thống:
-- SELECT 
--     COUNT(DISTINCT p.id) AS tong_nguoi_dung,
--     SUM(p.login_count) AS tong_luot_dang_nhap,
--     SUM(p.plans_created) AS tong_bai_da_soan
-- FROM public.profiles p;

-- b. Thống kê số lượng hoạt động theo từng giáo viên để xuất báo cáo:
-- SELECT 
--     p.full_name AS ho_va_ten,
--     p.email,
--     p.phone AS so_dien_thoai,
--     p.school_name AS truong,
--     p.subject AS mon_day,
--     p.role AS vai_tro,
--     p.login_count AS so_luot_truy_cap,
--     p.plans_created AS so_bai_da_soan,
--     p.last_login_at AS dang_nhap_cuoi
-- FROM public.profiles p
-- ORDER BY p.login_count DESC;

-- 6. BẢNG GHI NHẬN LỊCH SỬ GỬI BÁO CÁO ĐỊNH KỲ ĐẾN GMAIL (MONTHLY_EMAIL_REPORTS)
CREATE TABLE IF NOT EXISTS public.monthly_email_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL DEFAULT 'leanh2004ggv3@gmail.com',
    report_title TEXT NOT NULL,
    month_period TEXT NOT NULL, -- Ví dụ: '2026-11'
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED', 'PENDING'
    sent_by TEXT DEFAULT 'CRON_AUTO', -- 'CRON_AUTO' hoặc 'ADMIN_MANUAL'
    summary_data JSONB
);

-- 7. THIẾT LẬP CRON JOB TỰ ĐỘNG GỬI BÁO CÁO VÀO 08:00 SÁNG NGÀY 30 HÀNG THÁNG
-- (Áp dụng extension pg_cron trên Supabase Database)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule(
--     'monthly-report-to-gmail-leanh2004',
--     '0 8 30 * *', -- Lúc 08:00 sáng, ngày 30 hàng tháng
--     $$
--       INSERT INTO public.monthly_email_reports(recipient_email, report_title, month_period, status, sent_by, summary_data)
--       VALUES (
--           'leanh2004ggv3@gmail.com',
--           'Báo cáo tự động số lượng sử dụng web tháng ' || to_char(NOW(), 'MM/YYYY'),
--           to_char(NOW(), 'YYYY-MM'),
--           'SUCCESS',
--           'CRON_AUTO',
--           jsonb_build_object(
--               'total_users', (SELECT COUNT(*) FROM public.profiles),
--               'total_visits', (SELECT COALESCE(SUM(login_count), 0) FROM public.profiles),
--               'total_plans', (SELECT COALESCE(SUM(plans_created), 0) FROM public.profiles)
--           )
--       );
--     $$
-- );
