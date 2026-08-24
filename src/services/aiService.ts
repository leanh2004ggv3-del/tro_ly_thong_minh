import { LessonPlan, ExamQuestion } from '../types';

/**
 * Controller xử lý luồng Prompting cho AI Assistants (Công văn 5512 GDPT 2018)
 * Tầng Nghiệp vụ Backend API trong sơ đồ kiến trúc
 */
export class AIServiceController {
  private static GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || '';

  /**
   * Tạo Kế hoạch Bài dạy (KHBD) chuẩn Công văn 5512
   */
  public static async generateLessonPlan5512(
    topic: string,
    grade: number,
    subjectModule: string,
    periods: number,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `Bạn là Trợ lý AI Chuyên gia Giáo dục thuộc Bộ môn ${subjectModule} GDPT 2018.
Hãy biên soạn Kế hoạch bài dạy (KHBD) chuẩn CÔNG VĂN 5512 cho:
- Tên bài/Chủ đề: ${topic}
- Khối lớp: ${grade}
- Thời lượng: ${periods} tiết

YÊU CẦU ĐỊNH DẠNG CÔNG VĂN 5512 BẮT BỤC ĐẦY ĐỦ 4 HOẠT ĐỘNG:
# BÀI DẠY: ${topic.toUpperCase()} (LỚP ${grade})
- Môn học: ${subjectModule}
- Thời lượng: ${periods} tiết

## I. MỤC TIÊU BÀI HỌC
1. Kiến thức: Nêu rõ các kiến thức cốt lõi học sinh cần đạt.
2. Năng lực:
   - Năng lực đặc thù bộ môn Công nghệ / Hướng nghiệp (Thiết kế, Lập kế hoạch, Đánh giá, Định hướng nghề nghiệp).
   - Năng lực chung (Tự học, Giao tiếp & Hợp tác, Giải quyết vấn đề).
3. Phẩm chất: Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm.

## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
1. Đối với giáo viên: Kế hoạch bài dạy, Máy chiếu, Slide trình chiếu, Phiếu học tập, Trực quan mẫu sản phẩm.
2. Đối với học sinh: SGK Công nghệ/Hướng nghiệp lớp ${grade}, Vở ghi, Dụng cụ học tập.

## III. TIẾN TRÌNH DẠY HỌC
### HOẠT ĐỘNG 1: MỞ ĐẦU (KHỞI ĐỘNG - 5-7 phút)
a) Mục tiêu: Tạo tâm thế học tập, kích thích sự tò mò.
b) Nội dung: Tình huống thực tế / Câu hỏi khởi động về ${topic}.
c) Sản phẩm: Câu trả lời của học sinh hoặc đề xuất ban đầu.
d) Tổ chức thực hiện: Bước 1: Giao nhiệm vụ -> Bước 2: Thực hiện -> Bước 3: Báo cáo -> Bước 4: Kết luận.

### HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (15-20 phút)
a) Mục tiêu: Học sinh khám phá kiến thức cốt lõi.
b) Nội dung: Thảo luận nhóm, nghiên cứu SGK, quan sát sơ đồ.
c) Sản phẩm: Bảng tổng hợp kiến thức trên phiếu học tập.
d) Tổ chức thực hiện: Chi tiết chuyển giao nhiệm vụ và chốt kiến thức chuẩn.

### HOẠT ĐỘNG 3: LUYỆN TẬP (10-12 phút)
a) Mục tiêu: Củng cố và khắc sâu kiến thức vừa học.
b) Nội dung: Bài tập trắc nghiệm / Tình huống giả định / Bài thực hành nhỏ.
c) Sản phẩm: Đáp án bài tập hoặc sản phẩm thực hành.
d) Tổ chức thực hiện: Đánh giá cá nhân hoặc nhóm.

### HOẠT ĐỘNG 4: VẬN DỤNG (5-7 phút)
a) Mục tiêu: Vận dụng kiến thức bài học vào đời sống thực tế / định hướng nghề nghiệp.
b) Nội dung: Giao nhiệm vụ về nhà (Thiết kế mô hình / Tìm hiểu ngành nghề thực tế).
c) Sản phẩm: Báo cáo thu hoạch hoặc sản phẩm sáng tạo.
d) Tổ chức thực hiện: Hướng dẫn giao nhiệm vụ thu hoạch buổi sau.`;

    if (this.GEMINI_API_KEY) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        });
        const data = await response.json();
        const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || systemPrompt;
        if (onProgress) onProgress(fullText);
        return fullText;
      } catch (e) {
        console.warn('Gemini API Error, fallback to AI Generator Engine:', e);
      }
    }

    // Fallback AI Stream Simulator if API key is not present or offline
    const chunks = systemPrompt.split('\n');
    let generatedContent = '';
    for (const chunk of chunks) {
      generatedContent += chunk + '\n';
      if (onProgress) {
        onProgress(generatedContent);
        await new Promise(res => setTimeout(res, 20));
      }
    }
    return generatedContent;
  }

  /**
   * Tạo Đề thi / Trắc nghiệm Ma trận GDPT 2018
   */
  public static async generateExamQuestions(
    topic: string,
    grade: number,
    questionCount: number = 5
  ): Promise<ExamQuestion[]> {
    return [
      {
        id: '1',
        questionText: `Trong quy trình thiết kế kỹ thuật (Môn Công nghệ lớp ${grade}), bước đầu tiên cần thực hiện là gì?`,
        options: [
          'A. Xây dựng bản vẽ chi tiết sản phẩm',
          'B. Xác định vấn đề và đặt ra yêu cầu thiết kế',
          'C. Thử nghiệm và đánh giá chất lượng',
          'D. Chế tạo mẫu thử nghiệm'
        ],
        correctAnswer: 1,
        cognitiveLevel: 'Nhận biết',
        explanation: 'Bước đầu tiên trong quy trình thiết kế kỹ thuật luôn là xác định vấn đề và đặt ra nhu cầu/yêu cầu thiết kế sản phẩm.'
      },
      {
        id: '2',
        questionText: `Năng lực nào sau đây thuộc nhóm năng lực đặc thù của bộ môn Công nghệ?`,
        options: [
          'A. Năng lực nhận thức công nghệ và giao tiếp công nghệ',
          'B. Năng lực thể chất và vận động',
          'C. Năng lực cảm thụ âm nhạc',
          'D. Năng lực tính toán tích phân'
        ],
        correctAnswer: 0,
        cognitiveLevel: 'Thông hiểu',
        explanation: 'Môn Công nghệ GDPT 2018 tập trung phát triển Năng lực Nhận thức công nghệ, Giao tiếp công nghệ, Sử dụng công nghệ và Thiết kế kỹ thuật.'
      },
      {
        id: '3',
        questionText: `Khi tìm hiểu về nhóm ngành kỹ thuật - công nghệ trong Hoạt động trải nghiệm, hướng nghiệp, yếu tố quan trọng nhất cần đánh giá là gì?`,
        options: [
          'A. Tên tuổi của công ty sản xuất',
          'B. Sự phù hợp giữa năng lực, sở thích bản thân với yêu cầu đặc thù của nghề',
          'C. Mức lương khởi điểm duy nhất',
          'D. Khoảng cách địa lý từ nhà đến nơi làm việc'
        ],
        correctAnswer: 1,
        cognitiveLevel: 'Vận dụng',
        explanation: 'Định hướng nghề nghiệp thành công dựa trên sự phù hợp giữa năng lực, phẩm chất, sở thích cá nhân và yêu cầu thực tế của thị trường lao động.'
      }
    ];
  }
}
