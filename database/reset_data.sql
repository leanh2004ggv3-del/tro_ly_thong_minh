-- ==============================================================================
-- CÂU LỆNH XÓA SẠCH TOÀN BỘ DỮ LIỆU (RESET DATA - GIỮ NGUYÊN CẤU TRÚC DATABASE)
-- Tác giả: Super Agent Database Specialist
-- Ngày tạo: 2026-08-25
-- ==============================================================================

-- ⚠️ CAUTION: Câu lệnh này sẽ XÓA TOÀN BỘ DỮ LIỆU trong các bảng, 
-- nhưng GIỮ NGUYÊN 100% CẤU TRÚC BẢNG, CỘT, RLS POLICIES, INDEXES VÀ TRIGGERS.

-- LỰA CHỌN 1: XÓA SẠCH TẤT CẢ CÁC BẢNG (Dùng lệnh TRUNCATE CASCADE)
TRUNCATE TABLE 
    public.usage_stats,
    public.materials,
    public.lesson_plans,
    public.ppct_plans,
    public.profiles
RESTART IDENTITY CASCADE;

-- LỰA CHỌN 2: XÓA SẠCH DỮ LIỆU NHƯNG GIỮ LẠI TÀI KHOẢN ADMIN ĐẶNG VĂN SẠCH
/*
DELETE FROM public.usage_stats;
DELETE FROM public.materials;
DELETE FROM public.lesson_plans;
DELETE FROM public.ppct_plans;
DELETE FROM public.profiles WHERE email != 'dangvansach86@gmail.com';
*/

-- ==============================================================================
-- LỆNH PHỤC HỒI DỮ LIỆU TÀI KHOẢN ADMIN ĐẶNG VĂN SẠCH (NẾU ĐÃ LỠ XÓA TRƯỚC ĐÓ)
-- ==============================================================================
INSERT INTO public.profiles (id, email, full_name, school_name, subject, role)
VALUES (
  '00000000-0000-0000-0000-000000000099',
  'dangvansach86@gmail.com',
  'Đặng Văn Sạch',
  'Ban Quản Trị Hệ Thống (Super Admin)',
  'Quản trị viên Hệ thống AI Master',
  'ADMIN'
)
ON CONFLICT (id) DO UPDATE SET role = 'ADMIN', full_name = 'Đặng Văn Sạch';
