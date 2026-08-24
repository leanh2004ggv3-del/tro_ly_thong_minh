export interface TeacherProfile {
  id: string;
  email: string;
  fullName: string;
  schoolName: string;
  subject: string;
  avatarUrl: string;
  role: 'TEACHER' | 'ADMIN' | 'HEAD_OF_DEPT';
}

export interface LessonPlan {
  id: string;
  userId: string;
  title: string;
  gradeLevel: number; // 6 to 12
  subjectModule: 'Công nghệ' | 'Hoạt động trải nghiệm, hướng nghiệp';
  topicName: string;
  durationPeriods: number;
  contentMarkdown: string;
  formatType: 'CV_5512' | 'STEM_PROJECT';
  isPublic: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeachingMaterial {
  id: string;
  userId: string;
  title: string;
  category: 'SLIDE' | 'EXAM' | 'CAD_DRAWING' | 'VIDEO' | 'DOCUMENT';
  gradeLevel: number;
  filePath: string;
  fileSize: number;
  fileType: string;
  description: string;
  downloadsCount: number;
  createdAt: string;
}

export interface UsageStat {
  id: string;
  userId: string;
  actionType: 'GENERATE_LESSON' | 'GENERATE_EXAM' | 'EXPORT_DOCX' | 'UPLOAD_MATERIAL' | 'AI_CHAT';
  tokensUsed: number;
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0..3 index
  cognitiveLevel: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  explanation: string;
}
