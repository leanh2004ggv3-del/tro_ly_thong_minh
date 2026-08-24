-- ==============================================================================
-- CƠ SỞ DỮ LIỆU SUPABASE POSTGRESQL FOR CLASSROOM APP (TRỢ LÝ AI CÔNG NGHỆ)
-- Tác giả: AI Antigravity Specialist
-- Ngày tạo: 2026-08-24
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG HỒ SƠ GIÁO VIÊN (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    school_name TEXT DEFAULT 'Trường THCS / THPT Chuyên',
    subject TEXT DEFAULT 'Công nghệ & Hoạt động Trải nghiệm - Hướng nghiệp',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role TEXT DEFAULT 'TEACHER' CHECK (role IN ('TEACHER', 'ADMIN', 'HEAD_OF_DEPT')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG KẾ HOẠCH BÀI DẠY / GIÁO ÁN (LESSON_PLANS)
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 12),
    subject_module TEXT NOT NULL, -- 'Công nghệ', 'Hoạt động trải nghiệm, hướng nghiệp'
    topic_name TEXT NOT NULL, -- Ví dụ: 'Thiết kế kỹ thuật', 'Trồng trọt công nghệ cao', 'Chọn nghề tương lai'
    duration_periods INT DEFAULT 2, -- Số tiết
    content_markdown TEXT NOT NULL,
    format_type TEXT DEFAULT 'CV_5512', -- Standard Công văn 5512
    is_public BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG THƯ VIỆN HỌC LIỆU & TÀI LIỆU (MATERIALS)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('SLIDE', 'EXAM', 'CAD_DRAWING', 'VIDEO', 'DOCUMENT')),
    grade_level INT DEFAULT 8,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL, -- bytes
    file_type TEXT NOT NULL, -- pdf, docx, pptx, dwg, mp4
    description TEXT,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG THỐNG KÊ LƯỢT SỬ DỤNG AI & EXPORT (USAGE_STATS)
CREATE TABLE IF NOT EXISTS public.usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('GENERATE_LESSON', 'GENERATE_EXAM', 'EXPORT_DOCX', 'UPLOAD_MATERIAL', 'AI_CHAT')),
    tokens_used INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES CHO TỐI ƯU TỐC ĐỘ TRUY VẤN
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_lesson_plans_user_id ON public.lesson_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_grade ON public.lesson_plans(grade_level);
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON public.materials(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_id ON public.usage_stats(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - BẢO MẬT DỮ LIỆU NGUYÊN TẮC SUPABASE
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

-- Policy Profiles
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policy Lesson Plans
CREATE POLICY "Users read own and public lessons" ON public.lesson_plans 
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users insert own lessons" ON public.lesson_plans 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lessons" ON public.lesson_plans 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own lessons" ON public.lesson_plans 
    FOR DELETE USING (auth.uid() = user_id);

-- Policy Materials
CREATE POLICY "Users read own materials" ON public.materials 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own materials" ON public.materials 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own materials" ON public.materials 
    FOR DELETE USING (auth.uid() = user_id);

-- Policy Usage Stats
CREATE POLICY "Users view own stats" ON public.usage_stats 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System insert stats" ON public.usage_stats 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- SAMPLE SEED DATA FOR DEMO / TESTING
-- ==============================================================================
INSERT INTO public.profiles (id, email, full_name, school_name, subject, role)
VALUES 
('00000000-0000-0000-0000-000000000001', 'teacher.demo@edu.vn', 'Thầy Nguyễn Văn An', 'Trường THCS Chu Văn An', 'Công nghệ & Hướng nghiệp', 'TEACHER')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lesson_plans (id, user_id, title, grade_level, subject_module, topic_name, duration_periods, content_markdown, is_public)
VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Kế hoạch bài dạy: Quy trình thiết kế kỹ thuật', 8, 'Công nghệ', 'Thiết kế kỹ thuật', 2, 
'# I. MỤC TIÊU BÀI HỌC\n1. Kiến thức: Trình bày được các bước chính trong quy trình thiết kế kỹ thuật.\n2. Năng lực: Vận dụng quy trình thiết kế để đề xuất sản phẩm học tập đơn giản.\n3. Phẩm chất: Cẩn thận, hợp tác nhóm.\n\n# II. THIẾT BỊ DẠY HỌC\n- Máy chiếu, slide bài giảng, phiếu học tập số 1.\n\n# III. TIẾN TRÌNH DẠY HỌC (CÔNG VĂN 5512)\n## Hoạt động 1: Mở đầu (Khởi động)\n## Hoạt động 2: Hình thành kiến thức mới\n## Hoạt động 3: Luyện tập\n## Hoạt động 4: Vận dụng', true)
ON CONFLICT (id) DO NOTHING;
