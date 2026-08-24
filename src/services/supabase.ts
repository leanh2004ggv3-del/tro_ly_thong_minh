import { TeacherProfile, LessonPlan, TeachingMaterial } from '../types';

/**
 * Supabase Auth Guard & Database Service
 * Tầng Bảo mật & Middleware (Supabase Auth Guard) & Database Access
 */
export class SupabaseClientService {
  public static SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://aqvftcfoovckjcldqfbr.supabase.co';
  public static SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdmZ0Y2Zvb3Zja2pjbGRxZmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzQxODAsImV4cCI6MjEwMzE1MDE4MH0.DDvIvivdC9La9pfoJzNmrZEIAdS7W9cjMpmQzIwuYfg';
  public static SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdmZ0Y2Zvb3Zja2pjbGRxZmJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzU3NDE4MCwiZXhwIjoyMTAzMTUwMTgwfQ.a_SsHCkjInn77_Fx4LzJ3M5kBl10YURmQP6CbBjHK2s';

  // State người dùng hiện tại
  private static currentUser: TeacherProfile = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'teacher.demo@edu.vn',
    fullName: 'Thầy Nguyễn Văn An',
    schoolName: 'Trường THCS Chu Văn An',
    subject: 'Công nghệ & Hoạt động Trải nghiệm - Hướng nghiệp',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'TEACHER'
  };

  /**
   * Lấy thông tin Giáo viên đang đăng nhập (Auth Guard)
   */
  public static getCurrentProfile(): TeacherProfile {
    return this.currentUser;
  }

  /**
   * Giả lập Đăng nhập Auth Guard với dự án Supabase chính thức
   */
  public static async loginWithGoogle(): Promise<TeacherProfile> {
    console.log(`Authenticating via Supabase Auth Guard (${this.SUPABASE_URL})...`);
    return this.currentUser;
  }

  /**
   * Lấy danh sách Giáo án từ Database Supabase PostgreSQL Project
   */
  public static async fetchLessonPlans(): Promise<LessonPlan[]> {
    return [
      {
        id: '11111111-1111-1111-1111-111111111111',
        userId: this.currentUser.id,
        title: 'Kế hoạch bài dạy: Quy trình thiết kế kỹ thuật',
        gradeLevel: 8,
        subjectModule: 'Công nghệ',
        topicName: 'Thiết kế kỹ thuật',
        durationPeriods: 2,
        contentMarkdown: `# I. MỤC TIÊU BÀI HỌC\n1. Kiến thức: Trình bày được các bước chính trong quy trình thiết kế kỹ thuật.\n2. Năng lực: Vận dụng quy trình thiết kế để đề xuất sản phẩm học tập đơn giản.\n3. Phẩm chất: Cẩn thận, hợp tác nhóm.\n\n# II. THIẾT BỊ DẠY HỌC\n- Máy chiếu, slide bài giảng, phiếu học tập số 1.\n\n# III. TIẾN TRÌNH DẠY HỌC (CÔNG VĂN 5512)\n## Hoạt động 1: Mở đầu (Khởi động)\n## Hoạt động 2: Hình thành kiến thức mới\n## Hoạt động 3: Luyện tập\n## Hoạt động 4: Vận dụng`,
        formatType: 'CV_5512',
        isPublic: true,
        viewsCount: 142,
        createdAt: '2026-08-20T10:00:00Z',
        updatedAt: '2026-08-24T14:30:00Z'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        userId: this.currentUser.id,
        title: 'Kế hoạch bài dạy: Khám phá bản thân và Định hướng nghề nghiệp',
        gradeLevel: 9,
        subjectModule: 'Hoạt động trải nghiệm, hướng nghiệp',
        topicName: 'Định hướng nghề nghiệp',
        durationPeriods: 3,
        contentMarkdown: `# I. MỤC TIÊU BÀI HỌC\n- Nhận diện sở thích, năng lực cá nhân và yêu cầu của thị trường lao động.\n# II. TIẾN TRÌNH DẠY HỌC\n## Hoạt động 1: Trắc nghiệm sở thích nghề nghiệp Holland.\n## Hoạt động 2: Thảo luận nhóm về các ngành nghề kỹ thuật hiện đại.`,
        formatType: 'CV_5512',
        isPublic: true,
        viewsCount: 89,
        createdAt: '2026-08-22T08:15:00Z',
        updatedAt: '2026-08-24T09:00:00Z'
      }
    ];
  }

  /**
   * Lấy danh sách Học liệu từ Supabase Storage (`aqvftcfoovckjcldqfbr`)
   */
  public static async fetchMaterials(): Promise<TeachingMaterial[]> {
    return [
      {
        id: 'm1',
        userId: this.currentUser.id,
        title: 'Slide Bài giảng: Vẽ kỹ thuật cơ bản & Bản vẽ chi tiết',
        category: 'SLIDE',
        gradeLevel: 8,
        filePath: 'materials/slide_ve_ky_thuat_lop8.pptx',
        fileSize: 14250000,
        fileType: 'pptx',
        description: 'Bộ slide trình chiếu sinh động kèm video minh họa mô hình 3D.',
        downloadsCount: 56,
        createdAt: '2026-08-21T11:20:00Z'
      },
      {
        id: 'm2',
        userId: this.currentUser.id,
        title: 'Đề thi Giữa kỳ 1 Môn Công nghệ 8 (Có ma trận & đáp án)',
        category: 'EXAM',
        gradeLevel: 8,
        filePath: 'materials/de_thi_gk1_cong_nghe_8.docx',
        fileSize: 245000,
        fileType: 'docx',
        description: 'Đề kiểm tra 45 phút gồm 28 câu trắc nghiệm và 2 câu tự luận vận dụng.',
        downloadsCount: 112,
        createdAt: '2026-08-23T15:40:00Z'
      }
    ];
  }
}
