export type GradeLevel = '6' | '7' | '8' | '9';

export type ActivityCategory = 'flagSalute' | 'topicActivity' | 'classMeeting';

export interface ObjectiveItem {
  knowledge: string[];
  competencies: {
    general: string[];
    specific: string[];
    manifestations: string[];
  };
  qualities: {
    items: string[];
    manifestations: string[];
  };
}

export interface EquipmentItem {
  teacher: string[];
  students: string[];
}

export interface ActivityStep {
  stepId: string;
  stepName: string; // ví dụ: "1. Hoạt động 1: Khởi động (5 phút)"
  objective?: string; // * Mục tiêu: Tạo không khí cởi mở, gợi mở vấn đề...
  method?: string; // * Phương pháp thực hiện: Phương pháp trực quan, vấn đáp gợi mở...
  teacherStudentAction: string; // Nội dung chi tiết: * Mục tiêu:, * Phương pháp thực hiện:, * Tổ chức thực hiện: - Bước 1: Chuyển giao nhiệm vụ, - Bước 2: Thực hiện nhiệm vụ, - Bước 3: Báo cáo, thảo luận, - Bước 4: Kết luận, nhận định
  expectedProduct: string; // Dự kiến sản phẩm tương ứng (các gạch đầu dòng - ...)
}

export interface PeriodSection {
  enabled: boolean;
  periodNumber: number; // 1 | 2 | 3
  periodType: 'flagSalute' | 'topicActivity' | 'classMeeting';
  title: string; // e.g. "TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)"
  subTitle?: string; // e.g. "CHỦ ĐỀ: THAM GIA CUỘC PHÁT ĐỘNG PHONG TRÀO THI ĐUA..."
  note?: string; // e.g. "(Do Giáo viên được phân công phụ trách điều hành tại phòng học)"
  
  // I. Mục tiêu tiết học
  objectives: {
    knowledge?: string[]; // Kiến thức hoặc kiến thức & năng lực đặc thù
    competencies?: string[]; // Năng lực
    integratedCompetencies?: {
      digital?: {
        code: string; // ví dụ "NLS 2.5.TC2b"
        title: string;
        details: string;
      };
      ai?: {
        code: string; // ví dụ "NLAI 9.A3.1"
        title: string;
        details: string;
      };
    };
    qualities?: string[]; // Phẩm chất
  };

  // II. Thiết bị dạy học và học liệu
  equipment: {
    teacher: string[];
    students: string[];
  };

  // III. Tiến trình tổ chức hoạt động (Bảng 2 cột)
  steps: ActivityStep[];
}

export interface LessonPlan {
  id: string;
  grade: GradeLevel;
  topic: string; // CHỦ ĐỀ 1: EM VỚI NHÀ TRƯỜNG
  week: string; // Tuần 1
  lessonTitle: string; // Tên bài học / hoạt động
  duration: string; // 3 tiết
  schoolName: string; // TRƯỜNG THCS TỊNH BIÊN
  teacherName: string; // Họ và tên GV: Đặng Văn Sạch
  departmentName: string; // Tổ: Công nghệ - Hướng nghiệp
  schoolYear: string; // Năm học: 2026 - 2027
  semester: string; // Học kỳ: I - Tuần 1
  createdAt?: string;
  updatedAt?: string;

  // MỤC TIÊU CHUNG CỦA CHỦ ĐỀ
  generalTopicObjectives: {
    knowledge: string[];
    qualities: string[];
    competencies: string[];
  };

  // CÁC TIẾT HỌC (Tiết 1: SHDC, Tiết 2: HĐGD, Tiết 3: SHL)
  periods: {
    flagSalute?: PeriodSection;
    topicActivity?: PeriodSection;
    classMeeting?: PeriodSection;
  };

  // Deprecated backward-compatible fields
  objectives?: ObjectiveItem;
  equipment?: EquipmentItem;
  activities?: {
    flagSalute?: any;
    topicActivity?: any;
    classMeeting?: any;
  };

  evaluationNotes?: string;
  validationReport?: ValidationReport;
}

export interface ValidationItem {
  criterion: string;
  status: 'passed' | 'warning' | 'failed';
  detail: string;
  recommendation?: string;
}

export interface ValidationReport {
  isPassed: boolean;
  score: number;
  passedItems: string[];
  pendingItems: string[];
  details: ValidationItem[];
  checkedAt: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'sgk' | 'old_lesson' | 'reference';
  base64Data?: string;
  textContent?: string;
  extractedSummary?: string;
  status: 'uploading' | 'ready' | 'error';
  errorMessage?: string;
}

export interface LessonTemplateStructure {
  id: string;
  name: string;
  subject?: string;
  gradeLevel?: string;
  sourceFileName?: string;
  identifiedSections: Array<{
    title: string;
    level: number;
    type: 'header' | 'objectives' | 'equipment' | 'procedure_table' | 'procedure_steps' | 'evaluation' | 'general';
    description?: string;
  }>;
  hasTwoColumnTable: boolean;
  rawText?: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface SavedLessonPlanItem {
  id: string;
  title: string;
  topic: string;
  subject: string;
  grade: string;
  week: string;
  schoolYear: string;
  teacherName: string;
  schoolName: string;
  createdAt: string;
  updatedAt: string;
  plan: LessonPlan;
}

export interface PlanGenerationInput {
  grade: GradeLevel;
  selectedActivities: ActivityCategory[];
  mode: 'new' | 'edit_old';
  topicName: string;
  lessonName: string;
  weekNumber: string;
  durationString: string;
  schoolName?: string;
  teacherName?: string;
  departmentName?: string;
  schoolYear?: string;
  semester?: string;
  
  // Mẫu giáo án áp dụng
  templateId?: string;
  
  // Tích hợp NLS và NLAI (TT02, CV 2422, CV 3456)
  selectedNlsCode?: string;
  nlsContent?: string;
  nlsTargetActivities?: ActivityCategory[]; // Vị trí chọn tích hợp NLS vào hoạt động nào (SHDC, HĐGD, SHL)
  
  selectedNlaiCode?: string;
  nlaiContent?: string;
  nlaiTargetActivities?: ActivityCategory[]; // Vị trí chọn tích hợp NL AI vào hoạt động nào (SHDC, HĐGD, SHL)

  flagSaluteNotes: string;
  topicActivityNotes: string;
  classMeetingNotes: string;

  // Trường bổ sung cho mọi môn học
  subjectName?: string;
  textbookName?: string;
  coreKnowledge?: string;
  teachingMethods?: string;
  customRequirements?: string;

  uploadedFiles: Array<{
    name: string;
    type: string;
    category: 'sgk' | 'old_lesson' | 'reference';
    textContent?: string;
    base64Data?: string;
  }>;
}
