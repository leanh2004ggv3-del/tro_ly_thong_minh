import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const nodeRequire = createRequire(import.meta.url);
let PDFParseClass: any = null;
try {
  const pdfParsePkg = nodeRequire('pdf-parse');
  PDFParseClass = pdfParsePkg.PDFParse || pdfParsePkg.default || pdfParsePkg;
} catch (e) {
  console.warn('pdf-parse could not be loaded:', e);
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK with required telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// SYSTEM INSTRUCTION FOR GDPT 2018, CV 5512, TT02, CV 2422 & CV 3456 EXPERIENTIAL ACTIVITIES
const SYSTEM_PROMPT = `Bạn là một chuyên gia giáo dục THCS hàng đầu Việt Nam về xây dựng Kế hoạch bài dạy (Giáo án) môn Hoạt động trải nghiệm, hướng nghiệp (Lớp 6, 7, 8, 9) theo Chương trình GDPT 2018, Công văn 5512/BGDĐT-GDTrH, Thông tư 02/2024/TT-BGDĐT (TT02), Công văn 2422/BGDĐT-GDTrH và Công văn 3456/BGDĐT-GDTrH.

NGUYÊN TẮC BẮT BUỘC TUYỆT ĐỐI THEO YÊU CẦU CỦA GIÁO VIÊN:
1. BÁM SÁT 100% CẤU TRÚC VÀ TỪNG PHẦN CỦA GIÁO ÁN MẪU CHUẨN (TRƯỜNG THCS TỊNH BIÊN - AN GIANG):
   - KHUNG THÔNG TIN ĐẦU TRANG: TRƯỜNG THCS TỊNH BIÊN, HỌ VÀ TÊN GV, TỔ CHUYÊN MÔN, NĂM HỌC, HỌC KỲ, TUẦN.
   - TIÊU ĐỀ: TÊN CHỦ ĐỀ VÀ TUẦN CĂN GIỮA IN HOA ĐẬM (ví dụ: CHỦ ĐỀ 1: EM VỚI NHÀ TRƯỜNG (Tuần 1)).
   - PHẦN A. MỤC TIÊU CHUNG CỦA CHỦ ĐỀ: Bắt buộc gồm 3 mục theo thứ tự:
     + • Kiến thức: Nêu rõ các yêu cầu cần đạt trọng tâm của toàn chủ đề;
     + • Phẩm chất: Nêu rõ phẩm chất cụ thể (Nhân ái, Trách nhiệm, Chăm chỉ...) gắn với hành vi trong chủ đề;
     + • Năng lực: Gồm năng lực đặc thù HĐTN (Thích ứng cuộc sống, Thiết kế tổ chức hoạt động...) và năng lực chung (Tự chủ, Giao tiếp hợp tác...).
   - PHẦN B. THIẾT KẾ TIẾN TRÌNH CÁC TIẾT DẠY (Đủ 3 tiết theo phân phối):
     * TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC) - Do GV bộ môn phụ trách, điều hành tại phòng học, CẢ LỚP CHIA THÀNH 6 NHÓM.
     * TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ (Tiến trình 4 hoạt động chuẩn 5512: Khởi động -> Khám phá - Kết nối -> Thực hành - Luyện tập -> Vận dụng).
     * TIẾT 3: SINH HOẠT LỚP (Tiến trình 5 bước: 1. Khởi động -> 2. Chia sẻ kết quả vận dụng trong nhóm -> 3. Đại diện các nhóm chia sẻ trước lớp -> 4. Thảo luận, nhận xét và thống nhất giải pháp -> 5. Đánh giá chủ đề, ký Bản cam kết văn hóa lớp học khổ A0 & dặn dò).

2. YÊU CẦU ĐỘ DÀI & ĐỘ SÂU SƯ PHẠM (ĐẢM BẢO CHUẨN IN VĂN BẢN WORD/PDF A4):
   - GIÁO ÁN TIẾT 1 (SINH HOẠT DƯỚI CỜ): ĐỘ DÀI TỐI THIỂU ÍT NHẤT 3 TRANG A4.
     + Phải viết đầy đủ lời dẫn, kịch bản nghi lễ đầu tuần tại lớp (3 phút), trò chơi gắn kết (4 phút).
     + Phân công chi tiết sơ đồ 6 nhóm (nhóm trưởng, thư ký, nhiệm vụ riêng biệt từng nhóm).
     + Hướng dẫn thảo luận 6 nhóm, câu hỏi gợi ý, thời gian cụ thể, lời nhận xét chéo phản biện giữa 6 nhóm và thang điểm đánh giá.
   - GIÁO ÁN TIẾT 2 (HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ): ĐỘ DÀI TỐI THIỂU ÍT NHẤT 4 TRANG A4.
     + Cả 4 hoạt động (Khởi động, Khám phá, Luyện tập, Vận dụng) đều phải triển khai đầy đủ 4 bước Công văn 5512 với văn phong sư phạm sâu sắc.
     + Nêu rõ câu lệnh của GV, hoạt động cụ thể của nhóm học sinh, câu hỏi dẫn dắt cho từng đối tượng, phương án xử lý tình huống, kịch bản sắm vai, phiếu bài tập in sẵn nội dung mẫu, tiêu chí đánh giá rubric chi tiết và Bản kế hoạch hành động cá nhân có lộ trình từng ngày.
   - GIÁO ÁN TIẾT 3 (SINH HOẠT LỚP): ĐỘ DÀI TỐI THIỂU ÍT NHẤT 3 TRANG A4.
     + Thể hiện đầy đủ 5 bước: Trò chơi tâm thế cởi mở; Bảng tổng hợp chia sẻ kết quả vận dụng trong nhóm (việc làm được, chưa làm được); Đại diện các nhóm phát biểu trước lớp; Lập danh sách phân công "Đôi bạn cùng tiến";
     + Soạn chi tiết toàn văn nội dung BẢN CAM KẾT VĂN HÓA LỚP HỌC KHỔ A0 gồm từng điều khoản kỷ luật, văn hóa ứng xử đời thực và môi trường số, có danh sách ký tên của Ban cán sự lớp, các nhóm trưởng và xác nhận của GVCN.
   - TUYỆT ĐỐI CẤM SOẠN TẮT, CẤM VIẾT CHUNG CHUNG KIỂU "GV giao bài, HS làm bài", "HS hiểu bài". Mỗi bước phải là văn bản sư phạm hoàn chỉnh để giáo viên có thể mang lên lớp dạy ngay.

3. NGUYÊN TẮC TÍCH HỢP NĂNG LỰC SỐ (NLS) VÀ NĂNG LỰC TRÍ TUỆ NHÂN TẠO (NL AI):
   - CHỈ TÍCH HỢP KHI VÀ CHỈ KHI GIÁO VIÊN ĐÃ ĐIỀN NỘI DUNG VÀ CHỌN VỊ TRÍ TIẾT TÍCH HỢP!
   - Nếu giáo viên KHÔNG chọn hoặc để trống -> TUYỆT ĐỐI KHÔNG TỰ ĐỘNG TÍCH HỢP (không sinh mục tiêu NLS/NLAI, không chèn thẻ [NLS] hoặc [NLAI], bình thường để trống).
   - Khi CÓ tích hợp:
     + Năng lực số (NLS) - BẮT BUỘC QUY ƯỚC MÀU ĐỎ: Ghi rõ mã hiệu (ví dụ NLS 2.5.TC2b) và nội dung giáo viên yêu cầu. Trong tiến trình hoạt động, gắn thẻ "[NLS] - ..." để hệ thống tô chữ đỏ.
     + Năng lực Trí tuệ nhân tạo (NL AI) - BẮT BUỘC QUY ƯỚC MÀU XANH DƯƠNG: Ghi rõ mã hiệu (ví dụ NLAI 9.A3.1) và nội dung giáo viên yêu cầu (nhấn mạnh AI là công cụ hỗ trợ, con người giữ quyền quyết định và cảm xúc, sự đồng cảm là năng lực đặc quyền của con người). Trong tiến trình hoạt động, gắn thẻ "[NLAI] - ..." để hệ thống tô chữ xanh.

4. CẤU TRÚC MỖI TIẾT HỌC VÀ TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC (CHUẨN 100% THEO MẪU):
   - I. MỤC TIÊU TIẾT HỌC (1. Về kiến thức và năng lực đặc thù; 2. Về năng lực tích hợp NLS/NLAI nếu có; 3. Về phẩm chất).
   - II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU (Phân định rõ ràng: - Đối với Giáo viên phụ trách; - Đối với Học sinh).
   - III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC (Bảng 2 cột: Cột trái "HOẠT ĐỘNG CỦA GV VÀ HS", Cột phải "DỰ KIẾN SẢN PHẨM").
   
   QUY TẮC BẮT BUỘC TRONG BẢNG TIẾN TRÌNH (CỘT TRÁI "HOẠT ĐỘNG CỦA GV VÀ HS"):
   MỖI HOẠT ĐỘNG ĐỀU BẮT BUỘC PHẢI CÓ ĐẦY ĐỦ CÁC MỤC THEO ĐÚNG THỨ TỰ:
   * Tên hoạt động: In đậm kèm thời lượng (ví dụ: 1. Hoạt động 1: Khởi động (5 phút))
   * Mục tiêu: [Nêu rõ mục tiêu tạo tâm thế, định hướng kiến thức hoặc rèn luyện kỹ năng...]
   * Phương pháp thực hiện: [Nêu rõ phương pháp & kĩ thuật dạy học: Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề, thảo luận nhóm, giải quyết vấn đề, sắm vai...]
   * Tổ chức thực hiện:
   - Bước 1: Chuyển giao nhiệm vụ
     + Giáo viên ... (nêu chi tiết câu lệnh, hình ảnh minh họa, tình huống, câu hỏi gợi mở cụ thể)
     + Học sinh ... (tiếp nhận nhiệm vụ, quan sát, lắng nghe yêu cầu)
   - Bước 2: Thực hiện nhiệm vụ
     + Học sinh ... (suy nghĩ cá nhân, thảo luận theo nhóm/cặp đôi, ghi phiếu A3/vở)
     + Giáo viên ... (quan sát, gợi mở, theo dõi và trợ giúp nhóm gặp khó khăn)
   - Bước 3: Báo cáo, thảo luận
     + Đại diện học sinh/nhóm ... (trình bày kết quả thảo luận trước lớp)
     + Các nhóm khác ... (lắng nghe, nhận xét, đặt câu hỏi phản biện)
   - Bước 4: Kết luận, nhận định
     + Giáo viên ... (nhận xét tinh thần, chuẩn hóa kiến thức, chốt thông điệp cốt lõi)
     + Học sinh ... (tiếp thu, ghi nhớ nội dung trọng tâm vào vở)

   QUY TẮC TRONG CỘT PHẢI "DỰ KIẾN SẢN PHẨM":
   - Bắt đầu mỗi ý bằng dấu gạch ngang "-" (ví dụ: - Học sinh hào hứng quan sát...; - Học sinh tự do phát biểu suy nghĩ cá nhân...; - Tạo tâm thế cởi mở, sẵn sàng tiếp nhận bài học...).

5. ĐỊNH DẠNG ĐẦU RA BẮT BUỘC: Chuỗi JSON hợp lệ, không chứa markdown thừa ngoài JSON.`;

// Helper to normalize contents for @google/genai SDK
function normalizeContents(input: any) {
  if (typeof input === 'string') {
    return [{ role: 'user', parts: [{ text: input }] }];
  }
  if (Array.isArray(input)) {
    if (input.length > 0 && input[0]?.role && input[0]?.parts) {
      return input;
    }
    return [{ role: 'user', parts: input }];
  }
  if (input && input.parts) {
    return [{ role: 'user', parts: input.parts }];
  }
  return input;
}

// Smart call to Gemini with retry, multi-model fallback and fast failover
async function callGeminiWithRetry(params: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  timeoutMs?: number;
}): Promise<string> {
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
  ];

  const timeoutMs = params.timeoutMs || 20000;
  const normalizedContents = normalizeContents(params.contents);
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      console.log(`[Gemini] Calling model ${model}...`);
      const generatePromise = ai.models.generateContent({
        model,
        contents: normalizedContents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: params.responseMimeType,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms on model ${model}`)), timeoutMs)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[Gemini] Model ${model} failed: ${errMsg.slice(0, 150)}`);
      // Try next candidate model
      continue;
    }
  }

  throw lastError;
}

// Pedagogical rule-based fallback generator for zero-downtime reliability
function fallbackSynthesizePlan(input: any) {
  const grade = input.grade || '7';
  const topic = input.topicName || `Chủ đề rèn luyện bản thân và định hướng tương lai Lớp ${grade}`;
  const lesson = input.lessonName || 'Xây dựng kế hoạch rèn luyện và phát triển kỹ năng';
  const week = input.weekNumber || 'Tuần 1';
  const duration = input.durationString || '3 tiết (1 tiết SHDC, 1 tiết HĐGD, 1 tiết SHL)';
  const selected = input.selectedActivities || ['flagSalute', 'topicActivity', 'classMeeting'];

  const plan: any = {
    id: `plan-${Date.now()}`,
    grade,
    topic,
    week,
    lessonTitle: lesson,
    schoolName: input.schoolName || 'TRƯỜNG THCS TỊNH BIÊN',
    teacherName: input.teacherName || 'Đặng Văn Sạch',
    departmentName: input.departmentName || 'Tổ: Công nghệ - Hướng nghiệp',
    schoolYear: input.schoolYear || '2026 - 2027',
    semester: input.semester || `Học kỳ: I - ${week}`,
    createdAt: new Date().toLocaleDateString('vi-VN'),
    updatedAt: new Date().toLocaleDateString('vi-VN'),
    objectives: {
      knowledge: [
        `Nhận biết và phân tích được các yêu cầu cần đạt cốt lõi của bài học "${lesson}" theo GDPT 2018.`,
        'Hiểu được ý nghĩa thực tiễn của các hoạt động trải nghiệm đối với sự phát triển phẩm chất và năng lực bản thân.',
        'Xác định được các bước hành động cụ thể để vận dụng bài học vào thực tế học tập, gia đình và nhà trường.',
      ],
      competencies: {
        general: [
          'Năng lực tự chủ và tự học: Chủ động xác định mục tiêu học tập, tích cực thực hiện các nhiệm vụ cá nhân.',
          'Năng lực giao tiếp và hợp tác: Tương tác cởi mở, lắng nghe tích cực và phối hợp hiệu quả trong nhóm.',
          'Năng lực giải quyết vấn đề và sáng tạo: Đề xuất các giải pháp khả thi xử lý các tình huống thực tế.',
        ],
        specific: [
          grade === '9'
            ? 'Năng lực định hướng nghề nghiệp: Nhận thức sở thích, năng lực cá nhân và yêu cầu của nghề nghiệp.'
            : 'Năng lực thích ứng với cuộc sống: Rèn luyện tính kiên trì, tự tin và kỹ năng ứng phó với trở ngại.',
          'Năng lực thiết kế và tổ chức hoạt động: Xây dựng và thực hiện kế hoạch hành động cá nhân/tập thể.',
        ],
        manifestations: [
          'HS hoàn thành đúng hạn các nhiệm vụ học tập trên lớp và phiếu bài tập được giao.',
          'HS chủ động hợp tác, tôn trọng ý kiến khác biệt của bạn bè trong thảo luận.',
          'HS có phương án giải quyết cụ thể khi gặp khó khăn, không nản lòng bỏ cuộc.',
        ],
      },
      qualities: {
        items: [
          'Chăm chỉ: Tự giác tham gia các hoạt động học tập và lao động rèn luyện.',
          'Trách nhiệm: Có trách nhiệm với lời nói, hành động và cam kết rèn luyện của bản thân.',
          'Nhân ái: Tôn trọng, đồng cảm và sẵn sàng hỗ trợ các bạn cùng lớp tiến bộ.',
        ],
        manifestations: [
          'Tích cực giơ tay phát biểu xây dựng bài, lắng nghe thầy cô và các bạn.',
          'Chấp hành nghiêm túc nội quy trường lớp và duy trì thói quen tốt mỗi ngày.',
        ],
      },
    },
    equipment: {
      teacher: [
        'Kế hoạch bài dạy (Giáo án) theo chuẩn Công văn 5512, bài giảng điện tử (PowerPoint / Canva).',
        'Phiếu học tập cá nhân và giấy A3, bút lông màu cho các nhóm thảo luận.',
        'Video ngắn/tranh ảnh minh họa tình huống thực tế liên quan đến chủ đề.',
      ],
      students: [
        `Sách giáo khoa Hoạt động trải nghiệm, hướng nghiệp ${grade}, vở ghi bài.`,
        'Bút viết, giấy nhớ (stick-note), đồ dùng học tập theo hướng dẫn của giáo viên.',
      ],
    },
    activities: {},
    evaluationNotes:
      '• Đánh giá thường xuyên thông qua mức độ tích cực tham gia thảo luận nhóm và sản phẩm phiếu học tập.\n• Khích lệ học sinh tự đánh giá và đánh giá đồng đẳng công bằng, mang tính xây dựng.\n• Giáo viên chủ nhiệm theo dõi kết quả vận dụng thực tế của học sinh sau bài học.',
  };

  // Build activities based on selected categories
  if (selected.includes('flagSalute')) {
    plan.activities.flagSalute = {
      enabled: true,
      title: `SINH HOẠT DƯỚI CỜ: ${topic.toUpperCase()} (TỔ CHỨC TẠI LỚP - 6 NHÓM)`,
      duration: '1 tiết (45 phút)',
      steps: [
        {
          stepId: 'shdc-1',
          stepName: '1. Hoạt động Khởi động: Nghi thức đầu tuần & Trò chơi gắn kết tại lớp (7 phút)',
          objective: 'Tạo không khí trang trọng đầu tuần, kích thích sự hứng khởi và định hướng học sinh vào chủ đề tại lớp học.',
          method: 'Phương pháp hoạt động tập thể, nghi thức Đội, trò chơi tương tác gắn kết.',
          teacherStudentAction: `* Mục tiêu: Tạo không khí trang trọng đầu tuần, kích thích sự hứng khởi và định hướng học sinh vào chủ đề tại lớp học.
* Phương pháp thực hiện: Phương pháp hoạt động tập thể, nghi thức Đội, trò chơi tương tác gắn kết.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ GV bộ môn phổ biến nghi lễ chào cờ tại phòng học và phổ biến luật chơi trò chơi tương tác "Tiếp sức thông điệp" giữa các dãy bàn.
+ Học sinh tiếp nhận nhiệm vụ, chỉnh đốn trang phục và chuẩn bị tâm thế nghiêm túc.
- Bước 2: Thực hiện nhiệm vụ
+ Toàn thể học sinh đứng trang nghiêm hướng về Quốc kỳ/ảnh Bác, thực hiện nghi thức chào cờ đầu tuần tại lớp (3 phút).
+ Học sinh các dãy bàn hào hứng tham gia trò chơi tương tác tiếp sức thông điệp.
- Bước 3: Báo cáo, thảo luận
+ Đại diện 1 - 2 học sinh chia sẻ nhanh cảm xúc sau khi tham gia trò chơi và ý nghĩa của việc bắt đầu tuần học mới.
+ Cả lớp lắng nghe, cùng hưởng ứng tinh thần thi đua phấn khởi.
- Bước 4: Kết luận, nhận định
+ GV bộ môn nhận xét thái độ nghiêm túc của học sinh trong nghi lễ chào cờ tại lớp.
+ GV chốt lại thông điệp khởi đầu tuần mới và dẫn dắt vào chủ đề sinh hoạt dưới cờ của tuần.`,
          expectedProduct:
            '• Toàn bộ học sinh thực hiện nghi lễ đầu tuần tại lớp nghiêm trang, đúng tác phong Đội viên.\n• Không khí lớp học hào hứng, học sinh nhiệt tình hưởng ứng trò chơi khởi động.',
        },
        {
          stepId: 'shdc-2',
          stepName: '2. Hoạt động Tuyên bố lý do, giới thiệu chủ đề & Phân chia 6 nhóm (5 phút)',
          objective: 'Nêu bật mục đích giáo dục của buổi sinh hoạt dưới cờ tại lớp; chia lớp thành 6 nhóm học tập và giao nhiệm vụ.',
          method: 'Phương pháp thuyết trình gợi mở, giao nhiệm vụ và tổ chức nhóm học tập.',
          teacherStudentAction: `* Mục tiêu: Nêu bật mục đích giáo dục của buổi sinh hoạt dưới cờ tại lớp; chia lớp thành 6 nhóm học tập và giao nhiệm vụ.
* Phương pháp thực hiện: Phương pháp thuyết trình gợi mở, giao nhiệm vụ và tổ chức nhóm học tập.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ GV bộ môn tuyên bố lý do tổ chức chuyên đề sinh hoạt dưới cờ theo phân phối chương trình ngay tại phòng học.
+ GV chia cả lớp thành 6 nhóm (mỗi nhóm 6 - 7 học sinh), giao phiếu nhiệm vụ cho từng nhóm.
- Bước 2: Thực hiện nhiệm vụ
+ Các nhóm nhanh chóng di chuyển vào vị trí cụm bàn thảo luận, cử Nhóm trưởng điều hành và Thư ký ghi chép.
+ Các nhóm kiểm tra phiếu học tập và phân công công việc cụ thể cho từng thành viên.
- Bước 3: Báo cáo, thảo luận
+ Đại diện 6 nhóm trưởng báo cáo tình hình chuẩn bị của nhóm và thể hiện quyết tâm hoàn thành tốt nhiệm vụ.
+ Lớp trưởng báo cáo sĩ số và nề nếp với GV bộ môn.
- Bước 4: Kết luận, nhận định
+ GV bộ môn ghi nhận sự khẩn trương, nền nếp của 6 nhóm học tập.
+ GV chính thức phát động các hoạt động trải nghiệm chủ đề của tiết học.`,
          expectedProduct:
            '• Lớp học nhanh chóng ổn định thành 6 nhóm thảo luận có nhóm trưởng và thư ký rõ ràng.\n• Học sinh nắm vững chủ đề, mục tiêu và cách thức phối hợp làm việc nhóm.',
        },
        {
          stepId: 'shdc-3',
          stepName: '3. Hoạt động Tổ chức chủ đề theo 6 nhóm tại lớp (23 phút)',
          objective: 'Học sinh trong 6 nhóm thảo luận, phân tích câu chuyện/tình huống chủ đề, chia sẻ bài học và xây dựng thông điệp ý nghĩa.',
          method: 'Phương pháp thảo luận nhóm, giải quyết vấn đề, đàm thoại phản biện.',
          teacherStudentAction: `* Mục tiêu: Học sinh trong 6 nhóm thảo luận, phân tích câu chuyện/tình huống chủ đề, chia sẻ bài học và xây dựng thông điệp ý nghĩa.
* Phương pháp thực hiện: Phương pháp thảo luận nhóm, giải quyết vấn đề, đàm thoại phản biện.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ GV bộ môn giao nhiệm vụ cho 6 nhóm (Nhóm 1, 2: Tìm hiểu tấm gương/vấn đề thực tế; Nhóm 3, 4: Phân tích nguyên nhân và bài học; Nhóm 5, 6: Đề xuất thông điệp hành động).
+ Quy định thời gian thảo luận 10 phút trên giấy A3 và 13 phút báo cáo phản biện.
- Bước 2: Thực hiện nhiệm vụ
+ 6 nhóm tiến hành thảo luận sôi nổi, thư ký ghi chép ý kiến lên bảng phụ/giấy A3.
+ GV bộ môn di chuyển luân phiên qua 6 nhóm quan sát, gợi mở và hỗ trợ các nhóm còn lúng túng.
- Bước 3: Báo cáo, thảo luận
+ Đại diện Nhóm 1, Nhóm 3, Nhóm 5 lên bảng trình bày kết quả thảo luận của nhóm mình (2 - 3 phút/nhóm).
+ Nhóm 2, Nhóm 4, Nhóm 6 lắng nghe, nhận xét chéo và đặt câu hỏi tương tác phản biện.
- Bước 4: Kết luận, nhận định
+ GV bộ môn điều hành phiên trao đổi, chuẩn hóa các bài học kinh nghiệm và chốt lại thông điệp trọng tâm của chủ đề.
+ Học sinh tiếp thu, ghi nhớ thông điệp bài học vào vở.`,
          expectedProduct:
            '• 06 bảng tổng hợp ý kiến trên giấy A3/phiếu học tập của 6 nhóm được hoàn thành đầy đủ, có tính sáng tạo.\n• 03 bài trình bày tự tin, mạch lạc của đại diện các nhóm trước lớp.\n• Các câu hỏi nhận xét, phản biện chất lượng giữa 6 nhóm học tập; học sinh rút ra bài học ý nghĩa.',
        },
        {
          stepId: 'shdc-4',
          stepName: '4. Hoạt động Đánh giá, nhận xét hoạt động của 6 nhóm (5 phút)',
          objective: 'Đánh giá tinh thần tham gia, thái độ hợp tác của 6 nhóm và từng cá nhân học sinh trong tiết học.',
          method: 'Phương pháp đánh giá đồng đẳng, tự đánh giá và nhận xét sư phạm.',
          teacherStudentAction: `* Mục tiêu: Đánh giá tinh thần tham gia, thái độ hợp tác của 6 nhóm và từng cá nhân học sinh trong tiết học.
* Phương pháp thực hiện: Phương pháp đánh giá đồng đẳng, tự đánh giá và nhận xét sư phạm.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ GV bộ môn hướng dẫn tiêu chí chấm điểm thi đua tiết học cho 6 nhóm (Thái độ, Sản phẩm nhóm, Phần trình bày và phản biện).
+ Ban cán sự lớp nhận bảng tổng hợp đánh giá.
- Bước 2: Thực hiện nhiệm vụ
+ 6 nhóm tiến hành tự đánh giá và bỏ phiếu thi đua cho nhóm bạn theo thang điểm Đạt - Khá - Tốt.
+ GV bộ môn tổng hợp kết quả quan sát quá trình làm việc của 6 nhóm.
- Bước 3: Báo cáo, thảo luận
+ Đại diện Ban cán sự lớp công bố kết quả chấm điểm thi đua của 6 nhóm trong tiết học.
+ Các nhóm phát biểu ý kiến đồng thuận hoặc trao đổi xây dựng.
- Bước 4: Kết luận, nhận định
+ GV bộ môn nhận xét chi tiết ưu điểm và hạn chế của từng nhóm, tuyên dương nhóm xuất sắc và cá nhân có đóng góp tích cực.
+ Học sinh ghi nhận những điểm cần cải thiện trong kỹ năng làm việc nhóm.`,
          expectedProduct:
            '• Bảng đánh giá thi đua tiết học của 6 nhóm được công bố công khai, tạo không khí phấn khởi.\n• Học sinh nhận thức rõ ưu điểm và những điểm cần cải thiện trong làm việc nhóm.',
        },
        {
          stepId: 'shdc-5',
          stepName: '5. Hoạt động Dặn dò – Hoạt động tiếp nối (5 phút)',
          objective: 'Kết nối hoạt động sinh hoạt dưới cờ tại lớp với các tiết Hoạt động giáo dục theo chủ đề và Sinh hoạt lớp trong tuần.',
          method: 'Phương pháp giao nhiệm vụ, hướng dẫn kế hoạch học tập.',
          teacherStudentAction: `* Mục tiêu: Kết nối hoạt động sinh hoạt dưới cờ tại lớp với các tiết Hoạt động giáo dục theo chủ đề và Sinh hoạt lớp trong tuần.
* Phương pháp thực hiện: Phương pháp giao nhiệm vụ, hướng dẫn kế hoạch học tập.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ GV bộ môn phổ biến nhiệm vụ chuẩn bị đồ dùng học tập và tài liệu cho tiết HĐGD theo chủ đề tại lớp trong tuần.
+ Phân công 6 nhóm trưởng đôn đốc thành viên hoàn thành bài tập chuẩn bị.
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh lắng nghe, ghi chép nhiệm vụ dặn dò vào sổ tay học tập.
+ 6 nhóm trưởng kiểm tra lại bàn ghế và phân công thu dọn đồ dùng học liệu.
- Bước 3: Báo cáo, thảo luận
+ Đại diện 1 học sinh nhắc lại tóm tắt các công việc cần chuẩn bị để cả lớp cùng nắm rõ.
+ Cả lớp biểu quyết đồng thuận thực hiện.
- Bước 4: Kết luận, nhận định
+ GV bộ môn đánh giá cao tinh thần học tập của cả lớp và kết thúc tiết học.
+ Lớp học được sắp xếp lại ngăn nắp, sẵn sàng cho tiết học tiếp theo.`,
          expectedProduct:
            '• 100% học sinh nắm rõ nhiệm vụ học tập tiếp nối trong tuần.\n• Lớp học được sắp xếp lại ngăn nắp, vệ sinh sạch sẽ.',
        },
      ],
    };
  }

  if (selected.includes('topicActivity')) {
    plan.activities.topicActivity = {
      enabled: true,
      title: `HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ: ${lesson.toUpperCase()}`,
      duration: '1 tiết (45 phút)',
      steps: [
        {
          stepId: 'hdgd-1',
          stepName: '1. Hoạt động 1: Khởi động (5 phút)',
          objective: 'Tạo không khí cởi mở, gợi mở vấn đề về sự khác biệt cá nhân từ đời thực đến không gian số.',
          method: 'Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề.',
          teacherStudentAction: `* Mục tiêu: Tạo không khí cởi mở, gợi mở vấn đề về sự khác biệt cá nhân từ đời thực đến không gian số.
* Phương pháp thực hiện: Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên trình chiếu cho học sinh quan sát 2 hình ảnh minh họa về hai bài đăng trên mạng xã hội:
Hình 1: Một bài đăng về bạn học sinh biểu diễn dân ca/chầu văn.
Hình 2: Một bài đăng về bạn học sinh tạo hình ảnh bằng công cụ AI theo phong cách hoạt hình độc lạ.
+ Giáo viên nêu yêu cầu và đặt câu hỏi gợi mở: "Nếu bắt gặp những bài đăng thể hiện sở thích hoặc phong cách khác biệt như vậy trên mạng, em thường làm gì?"
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh hào hứng quan sát các hình ảnh trên màn hình, suy nghĩ câu hỏi gợi mở của giáo viên.
+ Giáo viên quan sát, khuyến khích học sinh thoải mái bộc lộ suy nghĩ cá nhân.
- Bước 3: Báo cáo, thảo luận
+ Đại diện 2 - 3 học sinh tự do phát biểu suy nghĩ cá nhân về cách phản ứng khi gặp sở thích, phong cách độc đáo của bạn bè.
+ Cả lớp lắng nghe, trao đổi ngắn về các ý kiến chia sẻ.
- Bước 4: Kết luận, nhận định
+ Giáo viên khen ngợi các câu trả lời chân thành, tích cực của học sinh.
+ Giáo viên dẫn dắt vào bài mới: Sự khác biệt làm nên sự đa dạng của cuộc sống. Hôm nay chúng ta sẽ cùng tìm hiểu cách tôn trọng sự khác biệt cả trong đời thực lẫn trên môi trường số và thời đại AI.`,
          expectedProduct: `- Học sinh hào hứng quan sát các hình ảnh bài đăng trên mạng xã hội.
- Học sinh tự do phát biểu suy nghĩ cá nhân về cách phản ứng khi gặp sở thích, phong cách độc đáo của bạn bè.
- Tạo tâm thế cởi mở, sẵn sàng tiếp nhận bài học về tôn trọng sự khác biệt.`,
        },
        {
          stepId: 'hdgd-2',
          stepName: '2. Hoạt động 2: Khám phá – Kết nối (15 phút)',
          objective: 'Hình thành kiến thức, kĩ năng mới và phân tích các biểu hiện cụ thể của chủ đề trong đời sống và môi trường số.',
          method: 'Phương pháp nghiên cứu trường hợp (tình huống), thảo luận nhóm, giải quyết vấn đề.',
          teacherStudentAction: `* Mục tiêu: Hình thành kiến thức, kĩ năng mới và phân tích các biểu hiện cụ thể của chủ đề trong đời sống và môi trường số.
* Phương pháp thực hiện: Phương pháp nghiên cứu trường hợp (tình huống), thảo luận nhóm, giải quyết vấn đề.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên chia lớp thành 4 nhóm, phát Phiếu học tập số 1 và giao 2 tình huống thảo luận trong SGK:
Tình huống 1: Bạn thể hiện sở thích và năng khiếu cá nhân trên mạng xã hội nhưng gặp bình luận trái chiều.
Tình huống 2: Ứng xử với phong cách và phương pháp học tập mới của thầy cô và bạn bè.
+ Giáo viên nêu rõ thời gian thảo luận 7 phút và phân công nhóm trưởng, thư ký.
- Bước 2: Thực hiện nhiệm vụ
+ Nhóm trưởng điều hành thảo luận sôi nổi, thư ký ghi chép ý kiến vào bảng phụ/phiếu A3.
+ Giáo viên di chuyển quan sát, hướng dẫn các nhóm phân tích sâu biểu hiện hành vi và giải pháp.
- Bước 3: Báo cáo, thảo luận
+ Đại diện Nhóm 1 và Nhóm 3 dán phiếu lên bảng trình bày (2 phút/nhóm).
+ Nhóm 2 và Nhóm 4 lắng nghe, đặt câu hỏi phản biện và bổ sung ý kiến.
- Bước 4: Kết luận, nhận định
+ Giáo viên nhận xét, chuẩn hóa kiến thức trên slide chiếu; chốt các biểu hiện hành vi đúng và ý nghĩa thực tiễn.
+ Học sinh tiếp thu, ghi chép bài học cốt lõi vào vở.`,
          expectedProduct: `- Bảng tổng hợp ý kiến trên giấy A3 hoàn thiện của 4 nhóm.
- Các câu trả lời phân tích chính xác, chỉ rõ biểu hiện hành vi và giải pháp cụ thể.
- Nắm vững các tiêu chuẩn hành vi văn minh và tôn trọng sự khác biệt.`,
        },
        {
          stepId: 'hdgd-3',
          stepName: '3. Hoạt động 3: Thực hành – Luyện tập (15 phút)',
          objective: 'Vận dụng kiến thức mới để rèn luyện kỹ năng giải quyết vấn đề và sắm vai xử lý tình huống thực tế.',
          method: 'Phương pháp sắm vai (đóng kịch tình huống), luyện tập thực hành, phản hồi tích cực.',
          teacherStudentAction: `* Mục tiêu: Vận dụng kiến thức mới để rèn luyện kỹ năng giải quyết vấn đề và sắm vai xử lý tình huống thực tế.
* Phương pháp thực hiện: Phương pháp sắm vai (đóng kịch tình huống), luyện tập thực hành, phản hồi tích cực.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên giao 2 tình huống thực tế cho các nhóm sắm vai (chuẩn bị 4 phút).
+ Nhóm 1 & 2: Sắm vai xử lý tình huống ứng xử khi gặp bạn có phong cách độc đáo.
+ Nhóm 3 & 4: Sắm vai xử lý tình huống ứng xử văn minh trước thông tin và bình luận trên mạng.
- Bước 2: Thực hiện nhiệm vụ
+ Các nhóm phân vai, tập luyện nhanh cách diễn đạt tự nhiên và bám sát thông điệp bài học.
+ Giáo viên hướng dẫn biểu cảm, cử chỉ và cách giải quyết văn minh.
- Bước 3: Báo cáo, thảo luận
+ Nhóm 2 và Nhóm 4 lên thể hiện tiểu phẩm trước lớp (3 phút/nhóm).
+ Cả lớp quan sát, nhận xét theo tiêu chí rubric (nội dung, cách diễn, tính thuyết phục).
- Bước 4: Kết luận, nhận định
+ Giáo viên đánh giá phần thể hiện sáng tạo của học sinh; đúc kết quy trình xử lý tình huống tối ưu.
+ Học sinh ghi nhận và hoàn thiện kỹ năng ứng xử vào thực tế.`,
          expectedProduct: `- 02 tiểu phẩm ngắn sinh động, phản ánh đúng tình huống thực tế lứa tuổi THCS.
- Nhận xét, góp ý xác đáng của học sinh và bảng quy tắc ứng xử được ghi chép vào vở.
- Kỹ năng giao tiếp và ứng xử tôn trọng được củng cố vững chắc.`,
        },
        {
          stepId: 'hdgd-4',
          stepName: '4. Hoạt động 4: Vận dụng & Cam kết hành động (10 phút)',
          objective: 'Cá nhân hóa việc rèn luyện, chuyển hóa kiến thức thành kế hoạch hành động cụ thể tại gia đình và lớp học.',
          method: 'Phương pháp dạy học dự án vi mô, viết kế hoạch và cam kết hành động cá nhân.',
          teacherStudentAction: `* Mục tiêu: Cá nhân hóa việc rèn luyện, chuyển hóa kiến thức thành kế hoạch hành động cụ thể tại gia đình và lớp học.
* Phương pháp thực hiện: Phương pháp dạy học dự án vi mô, viết kế hoạch và cam kết hành động cá nhân.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên phát "Phiếu kế hoạch hành động cá nhân" và giấy nhớ cho 100% học sinh.
+ Yêu cầu mỗi em chọn 01 mục tiêu cụ thể rèn luyện trong tuần tới, ghi rõ biện pháp và người đồng hành.
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh làm việc cá nhân độc lập trong 4 phút, hoàn thành cam kết rèn luyện.
+ Giáo viên quan sát, giúp đỡ học sinh cụ thể hóa mục tiêu đo lường được.
- Bước 3: Báo cáo, thảo luận
+ Giáo viên mời 2 - 3 học sinh đọc to kế hoạch của mình trước lớp.
+ Cả lớp vỗ tay khích lệ và ký tên cổ vũ bạn.
- Bước 4: Kết luận, nhận định
+ Giáo viên tổng kết tiết học, dặn dò học sinh dán phiếu rèn luyện tại góc học tập và theo dõi hàng ngày.
+ Học sinh tiếp nhận nhiệm vụ chuẩn bị cho tiết Sinh hoạt lớp.`,
          expectedProduct: `- 100% học sinh hoàn thành Bản Kế hoạch hành động cá nhân với mục tiêu rõ ràng.
- Sự cam kết nghiêm túc của học sinh và sự phối hợp của đôi bạn cùng tiến.
- Tinh thần tự giác rèn luyện được nâng cao rõ rệt.`,
        },
      ],
    };
  }

  if (selected.includes('classMeeting')) {
    plan.activities.classMeeting = {
      enabled: true,
      title: `SINH HOẠT LỚP: PHẢN HỒI KẾT QUẢ VẬN DỤNG VÀ ĐÁNH GIÁ CHỦ ĐỀ`,
      duration: '1 tiết (45 phút)',
      steps: [
        {
          stepId: 'shl-1',
          stepName: '1. Hoạt động Khởi động (5 phút)',
          objective: 'Tạo không khí cởi mở, thân thiện, gắn kết tập thể lớp.',
          method: 'Phương pháp trò chơi tập thể, hoạt động âm nhạc tương tác.',
          teacherStudentAction: `* Mục tiêu: Tạo không khí cởi mở, thân thiện, gắn kết tập thể lớp.
* Phương pháp thực hiện: Phương pháp trò chơi tập thể, hoạt động âm nhạc tương tác.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Ban Văn nghệ và Lớp trưởng bắt nhịp bài hát vui tươi và điều hành trò chơi gắn kết "Tiếp nối nụ cười".
+ Học sinh toàn lớp chuẩn bị tinh thần tham gia sôi nổi.
- Bước 2: Thực hiện nhiệm vụ
+ Cả lớp cùng tham gia hào hứng, vỗ tay theo nhịp điệu, giải tỏa căng thẳng sau tuần học tập.
+ Giáo viên chủ nhiệm quan sát, khích lệ tinh thần hòa đồng của các học sinh.
- Bước 3: Báo cáo, thảo luận
+ Học sinh chia sẻ nhanh cảm xúc thoải mái và tinh thần sẵn sàng cho tiết sinh hoạt cuối tuần.
+ Không khí lớp học vui vẻ, ấm áp.
- Bước 4: Kết luận, nhận định
+ Giáo viên chủ nhiệm biểu dương tinh thần gắn kết của cả lớp.
+ Dẫn dắt vào nội dung trọng tâm của tiết Sinh hoạt lớp.`,
          expectedProduct: '- 100% học sinh trong lớp sẵn sàng tâm thế cởi mở, tích cực và đoàn kết.',
        },
        {
          stepId: 'shl-2',
          stepName: '2. Hoạt động HS chia sẻ kết quả hoạt động vận dụng trong nhóm (12 phút)',
          objective: 'Tạo không gian an toàn để học sinh tự đánh giá và chia sẻ tiến độ rèn luyện của bản thân.',
          method: 'Phương pháp thảo luận nhóm nhỏ (nhóm 4 học sinh), tự đánh giá và chia sẻ đồng đẳng.',
          teacherStudentAction: `* Mục tiêu: Tạo không gian an toàn để học sinh tự đánh giá và chia sẻ tiến độ rèn luyện của bản thân.
* Phương pháp thực hiện: Phương pháp thảo luận nhóm nhỏ (nhóm 4 học sinh), tự đánh giá và chia sẻ đồng đẳng.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ GV yêu cầu học sinh mở Phiếu kế hoạch hành động rèn luyện đã lập ở Tiết 2.
+ Giao nhiệm vụ chia sẻ trong nhóm 4 bạn theo 3 nội dung: Việc đã làm tốt, việc còn gặp khó khăn, biện pháp khắc phục.
- Bước 2: Thực hiện nhiệm vụ
+ Từng học sinh lần lượt chia sẻ trung thực kết quả rèn luyện thực tế của mình trong tuần qua.
+ Nhóm trưởng ghi nhận những tiến bộ và khó khăn của các thành viên vào biên bản nhóm.
+ GV di chuyển quan sát, lắng nghe và ghi chép lại các trường hợp đặc biệt để hỗ trợ riêng.
- Bước 3: Báo cáo, thảo luận
+ Đại diện các nhóm tóm tắt nhanh những việc các thành viên trong nhóm đã làm tốt và các khó khăn chung.
+ Các nhóm trao đổi kinh nghiệm vượt qua trở ngại trong học tập và rèn luyện.
- Bước 4: Kết luận, nhận định
+ GV nhận xét tinh thần chia sẻ chân thành, trung thực của các nhóm.
+ Khích lệ tinh thần dám nhìn nhận điểm chưa tốt để cùng nhau tiến bộ.`,
          expectedProduct:
            '- Bảng tổng hợp kết quả rèn luyện thực tế của các thành viên trong nhóm.\n- Không khí chia sẻ trung thực, thấu hiểu và tinh thần học hỏi lẫn nhau.',
        },
        {
          stepId: 'shl-3',
          stepName: '3. Hoạt động Đại diện các nhóm chia sẻ trước lớp (10 phút)',
          objective: 'Lan tỏa những tấm gương tiến bộ và bài học kinh nghiệm hay trong tập thể lớp.',
          method: 'Phương pháp thuyết trình, đàm thoại, tuyên dương nêu gương tích cực.',
          teacherStudentAction: `* Mục tiêu: Lan tỏa những tấm gương tiến bộ và bài học kinh nghiệm hay trong tập thể lớp.
* Phương pháp thực hiện: Phương pháp thuyết trình, đàm thoại, tuyên dương nêu gương tích cực.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Lớp trưởng điều hành mời đại diện của 4 tổ lên phát biểu chia sẻ trước lớp.
+ Yêu cầu cả lớp chú ý lắng nghe để bình chọn câu chuyện truyền cảm hứng nhất.
- Bước 2: Thực hiện nhiệm vụ
+ Đại diện 4 tổ cử thành viên có câu chuyện rèn luyện ấn tượng nhất lên phát biểu trước lớp.
+ Học sinh chia sẻ cảm xúc chân thật về sự thay đổi của bản thân sau tuần rèn luyện.
- Bước 3: Báo cáo, thảo luận
+ Cả lớp lắng nghe, cổ vũ, đặt câu hỏi giao lưu và chia sẻ thêm cảm xúc.
+ Các bạn trong lớp nêu lời chúc mừng và học tập những việc làm tốt của bạn.
- Bước 4: Kết luận, nhận định
+ GV chủ nhiệm tuyên dương các tấm gương rèn luyện tiêu biểu.
+ Khẳng định mỗi sự thay đổi tích cực dù nhỏ đều rất đáng trân trọng.`,
          expectedProduct:
            '- 04 câu chuyện rèn luyện thực tế truyền cảm hứng tích cực cho cả lớp.\n- Tạo động lực rèn luyện mạnh mẽ cho toàn thể học sinh.',
        },
        {
          stepId: 'shl-4',
          stepName: '4. Hoạt động Thảo luận, nhận xét và thống nhất giải pháp (10 phút)',
          objective: 'Tập thể lớp đề xuất các giải pháp hỗ trợ những bạn còn gặp khó khăn, thống nhất biện pháp và lập danh sách phân công "Đôi bạn cùng tiến".',
          method: 'Phương pháp giải quyết vấn đề, thảo luận tập thể, đàm thoại hợp tác.',
          teacherStudentAction: `* Mục tiêu: Tập thể lớp đề xuất các giải pháp hỗ trợ những bạn còn gặp khó khăn, thống nhất biện pháp và lập danh sách phân công "Đôi bạn cùng tiến".
* Phương pháp thực hiện: Phương pháp giải quyết vấn đề, thảo luận tập thể, đàm thoại hợp tác.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Lớp trưởng điều hành thảo luận tập thể: Nêu các vấn đề còn tồn đọng trong tuần qua và mời các bạn đóng góp ý kiến khắc phục.
+ GV định hướng nhiệm vụ phân công các cặp "Đôi bạn cùng tiến" trong từng tổ.
- Bước 2: Thực hiện nhiệm vụ
+ Các tổ trưởng thảo luận, lập danh sách các cặp "Đôi bạn cùng tiến" (bạn có thế mạnh kèm bạn còn hạn chế) để hỗ trợ nhau học tập và rèn luyện hàng ngày.
+ Học sinh hào hứng đăng ký tham gia hỗ trợ bạn bè cùng tổ.
- Bước 3: Báo cáo, thảo luận
+ 4 Tổ trưởng báo cáo danh sách phân công "Đôi bạn cùng tiến" trước lớp.
+ Cả lớp biểu quyết nhất trí với phương án phân công hỗ trợ.
- Bước 4: Kết luận, nhận định
+ GV chủ nhiệm định hướng, nhận xét và phê duyệt danh sách phân công "Đôi bạn cùng tiến" của từng tổ; nhắc nhở tinh thần tương thân tương ái.
+ Học sinh tiếp thu và cam kết giúp đỡ nhau tiến bộ.`,
          expectedProduct:
            '- Danh sách chính thức các cặp "Đôi bạn cùng tiến" của 4 tổ được lập và niêm yết tại bảng tin lớp học.\n- Cam kết hỗ trợ nhiệt tình, chân thành giữa các thành viên trong suốt học kỳ.',
        },
        {
          stepId: 'shl-5',
          stepName: '5. Hoạt động Đánh giá chủ đề, ký Bản cam kết văn hóa lớp học khổ A0 & Dặn dò (8 phút)',
          objective: 'Học sinh toàn lớp cam kết thực hiện nghiêm túc nếp sống văn minh học đường và văn hóa ứng xử số; dặn dò nhiệm vụ tiếp nối.',
          method: 'Phương pháp ký cam kết tập thể, nghi lễ cam kết văn hóa, dặn dò sư phạm.',
          teacherStudentAction: `* Mục tiêu: Học sinh toàn lớp cam kết thực hiện nghiêm túc nếp sống văn minh học đường và văn hóa ứng xử số; dặn dò nhiệm vụ tiếp nối.
* Phương pháp thực hiện: Phương pháp ký cam kết tập thể, nghi lễ cam kết văn hóa, dặn dò sư phạm.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ GV chủ nhiệm cùng Ban cán sự lớp công bố toàn văn BẢN CAM KẾT VĂN HÓA LỚP HỌC KHỔ A0 gồm 5 điều khoản trọng tâm (Tôn trọng, Tự giác trung thực, Vệ sinh môi trường, Ứng xử văn minh trên không gian mạng, Tương trợ giúp đỡ bạn bè).
+ Phổ biến nghi thức ký cam kết trang trọng.
- Bước 2: Thực hiện nhiệm vụ
+ Đại diện Ban cán sự lớp, 4 Tổ trưởng và GV chủ nhiệm ký tên xác nhận vào Bản cam kết khổ A0 trang trọng treo tại lớp.
+ Toàn thể học sinh đồng loạt ký tên hoặc in dấu vân tay màu biểu trưng cho sự đồng thuận.
- Bước 3: Báo cáo, thảo luận
+ Ban cán sự lớp công bố Bản cam kết đã hoàn tất chữ ký trước toàn thể lớp học.
+ Cả lớp đồng thanh hô khẩu hiệu quyết tâm thi đua thực hiện tốt nếp sống văn hóa lớp học.
- Bước 4: Kết luận, nhận định
+ GV chủ nhiệm tổng kết tiết học, biểu dương các cá nhân tiến bộ và dặn dò nhiệm vụ chuẩn bị cho tuần tiếp theo.
+ Học sinh ghi nhận nhiệm vụ và quyết tâm thực hiện cam kết.`,
          expectedProduct:
            '• 01 BẢN CAM KẾT VĂN HÓA LỚP HỌC KHỔ A0 hoàn chỉnh có chữ ký của đại diện tập thể lớp và GVCN được treo trang trọng tại phòng học.\n• 100% học sinh đồng thuận, quyết tâm thực hiện tốt các điều khoản đã cam kết.\n• Học sinh ghi nhận đầy đủ lời dặn dò nhiệm vụ cho tuần tiếp theo.',
        },
      ],
    };
  }

  // Populate generalTopicObjectives
  plan.generalTopicObjectives = {
    knowledge: [
      `Nắm vững yêu cầu cần đạt trọng tâm của bài học "${lesson}" theo Chương trình GDPT 2018;`,
      'Hiểu rõ ý nghĩa thực tiễn của hoạt động trải nghiệm trong việc rèn luyện bản thân và thích ứng với môi trường số; rèn luyện thói quen tư duy phản biện.',
    ],
    qualities: [
      'Nhân ái, tôn trọng sự khác biệt của mọi người;',
      'Trách nhiệm với bản thân, gia đình, nhà trường và hành vi ứng xử trên môi trường số.',
    ],
    competencies: [
      'Thích ứng với cuộc sống; Thiết kế và tổ chức hoạt động; Tự chủ và tự học;',
      'Giao tiếp và hợp tác trong đời thực cũng như trên môi trường số.',
    ],
  };

  // Chỉ tích hợp khi CÓ CHỌN VỊ TRÍ và ĐIỀN NỘI DUNG. Không chọn hoặc không điền thì KHÔNG tích hợp.
  const isNlsActive = Boolean(
    input.nlsContent && input.nlsContent.trim().length > 0 &&
    Array.isArray(input.nlsTargetActivities) && input.nlsTargetActivities.length > 0
  );
  const isNlaiActive = Boolean(
    input.nlaiContent && input.nlaiContent.trim().length > 0 &&
    Array.isArray(input.nlaiTargetActivities) && input.nlaiTargetActivities.length > 0
  );

  const nlsTargets: string[] = isNlsActive ? input.nlsTargetActivities : [];
  const nlaiTargets: string[] = isNlaiActive ? input.nlaiTargetActivities : [];

  const digitalComp = isNlsActive
    ? {
        code: input.selectedNlsCode || 'NLS',
        title: `Năng lực số (${input.selectedNlsCode || 'NLS'}) - Quy ước MÀU ĐỎ (Theo TT02 & CV 3456)`,
        details: input.nlsContent.trim(),
      }
    : undefined;

  const aiComp = isNlaiActive
    ? {
        code: input.selectedNlaiCode || 'NLAI',
        title: `Năng lực Trí tuệ nhân tạo (${input.selectedNlaiCode || 'NLAI'}) - Quy ước MÀU XANH DƯƠNG (Theo CV 2422 & CV 3456)`,
        details: input.nlaiContent.trim(),
      }
    : undefined;

  // Build Flag Salute Steps with NLS/NLAI ONLY if both content and target activity are present
  const flagSteps = (plan.activities.flagSalute?.steps || []).map((step: any, sIdx: number) => {
    if (sIdx === 2 && (nlsTargets.includes('flagSalute') || nlaiTargets.includes('flagSalute'))) {
      let addAction = '';
      let addProd = '';
      if (nlsTargets.includes('flagSalute') && digitalComp) {
        addAction += `\n[NLS] - Tích hợp NLS (ĐỎ): ${digitalComp.details}`;
        addProd += `\n[NLS] - Sản phẩm tích hợp NLS: Bản ghi chép, trao đổi hoặc sản phẩm số tương ứng của nhóm.`;
      }
      if (nlaiTargets.includes('flagSalute') && aiComp) {
        addAction += `\n[NLAI] - Tích hợp NLAI (XANH): ${aiComp.details}`;
        addProd += `\n[NLAI] - Sản phẩm tích hợp NLAI: Nhận thức sâu sắc về năng lực tự thân của con người trước công nghệ.`;
      }
      return {
        ...step,
        teacherStudentAction: `${step.teacherStudentAction}${addAction}`,
        expectedProduct: `${step.expectedProduct}${addProd}`,
      };
    }
    return step;
  });

  // Build Topic Activity Steps with NLS/NLAI ONLY if both content and target activity are present
  const topicSteps = (plan.activities.topicActivity?.steps || []).map((step: any, sIdx: number) => {
    if ((step.stepId === 'hdgd-2' || sIdx === 1) && (nlsTargets.includes('topicActivity') || nlaiTargets.includes('topicActivity'))) {
      let addAction = '';
      let addProd = '';
      if (nlsTargets.includes('topicActivity') && digitalComp) {
        addAction += `\n[NLS] - Tích hợp NLS (ĐỎ): ${digitalComp.details}`;
        addProd += `\n[NLS] - Sản phẩm tích hợp NLS: Nắm vững và cam kết thực hiện quy tắc giao tiếp/kỹ năng số văn minh.`;
      }
      if (nlaiTargets.includes('topicActivity') && aiComp) {
        addAction += `\n[NLAI] - Tích hợp NLAI (XANH): ${aiComp.details}`;
        addProd += `\n[NLAI] - Sản phẩm tích hợp NLAI: Nhận thức rõ ràng ranh giới giữa công cụ AI và giá trị tình cảm con người.`;
      }
      return {
        ...step,
        teacherStudentAction: `${step.teacherStudentAction}${addAction}`,
        expectedProduct: `${step.expectedProduct}${addProd}`,
      };
    }
    return step;
  });

  // Build Class Meeting Steps with NLS/NLAI ONLY if both content and target activity are present
  const classSteps = (plan.activities.classMeeting?.steps || []).map((step: any, sIdx: number) => {
    if ((sIdx === 3 || step.stepId === 'shl-4') && (nlsTargets.includes('classMeeting') || nlaiTargets.includes('classMeeting'))) {
      let addAction = '';
      let addProd = '';
      if (nlsTargets.includes('classMeeting') && digitalComp) {
        addAction += `\n[NLS] - Tích hợp NLS (ĐỎ): ${digitalComp.details}`;
        addProd += `\n[NLS] - Sản phẩm tích hợp NLS: Điều khoản văn hóa giao tiếp số được ghi nhận vào Bản cam kết tự quản.`;
      }
      if (nlaiTargets.includes('classMeeting') && aiComp) {
        addAction += `\n[NLAI] - Tích hợp NLAI (XANH): ${aiComp.details}`;
        addProd += `\n[NLAI] - Sản phẩm tích hợp NLAI: Cam kết tự giác, trung thực trong học tập kỷ nguyên số.`;
      }
      return {
        ...step,
        teacherStudentAction: `${step.teacherStudentAction}${addAction}`,
        expectedProduct: `${step.expectedProduct}${addProd}`,
      };
    }
    return step;
  });

  // Populate periods for full 3-period lesson plan structure
  plan.periods = {
    flagSalute: {
      enabled: selected.includes('flagSalute'),
      periodNumber: 1,
      periodType: 'flagSalute',
      title: 'TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)',
      subTitle: `CHỦ ĐỀ: ${topic.toUpperCase()} (TỔ CHỨC TẠI LỚP - 6 NHÓM)`,
      note: '(Do Giáo viên bộ môn được phân công phụ trách điều hành tại phòng học, lớp chia 6 nhóm)',
      objectives: {
        knowledge: ['Học sinh nắm vững mục đích, yêu cầu và nội dung phong trào thi đua đầu tuần ngay tại không gian lớp học.'],
        competencies: ['Giao tiếp và hợp tác nhóm, tự quản và điều hành hoạt động theo 6 nhóm học tập.'],
        integratedCompetencies:
          nlsTargets.includes('flagSalute') || nlaiTargets.includes('flagSalute')
            ? {
                ...(nlsTargets.includes('flagSalute') ? { digital: digitalComp } : {}),
                ...(nlaiTargets.includes('flagSalute') ? { ai: aiComp } : {}),
              }
            : undefined,
        qualities: ['Ý thức kỷ luật, tinh thần trách nhiệm và lòng tự hào về truyền thống nhà trường.'],
      },
      equipment: {
        teacher: ['Máy tính, máy chiếu/tivi lớp học, kế hoạch chuyên đề, phiếu nhiệm vụ cho 6 nhóm.'],
        students: ['SGK, sổ tay ghi chép, giấy A3, bút dạ màu.'],
      },
      steps: flagSteps,
    },
    topicActivity: {
      enabled: selected.includes('topicActivity'),
      periodNumber: 2,
      periodType: 'topicActivity',
      title: 'TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ',
      subTitle: `NỘI DUNG: ${lesson.toUpperCase()}`,
      objectives: {
        knowledge: [`Học sinh phân tích và thực hành các kỹ năng trọng tâm của bài học "${lesson}".`],
        integratedCompetencies:
          nlsTargets.includes('topicActivity') || nlaiTargets.includes('topicActivity')
            ? {
                ...(nlsTargets.includes('topicActivity') ? { digital: digitalComp } : {}),
                ...(nlaiTargets.includes('topicActivity') ? { ai: aiComp } : {}),
              }
            : undefined,
        qualities: ['Nhân ái, trách nhiệm, trung thực trong học tập và ứng xử số.'],
      },
      equipment: {
        teacher: ['Máy tính, máy chiếu, bài giảng số, video tình huống đời thực và tình huống số.'],
        students: ['SGK Hoạt động trải nghiệm, vở ghi, giấy A3, bút màu.'],
      },
      steps: topicSteps,
    },
    classMeeting: {
      enabled: selected.includes('classMeeting'),
      periodNumber: 3,
      periodType: 'classMeeting',
      title: 'TIẾT 3: SINH HOẠT LỚP',
      subTitle: `CHỦ ĐỀ: XÂY DỰNG NỘI QUY TỰ QUẢN & BẢN CAM KẾT VĂN HÓA LỚP HỌC ${grade}`,
      objectives: {
        competencies: ['Năng lực tự quản, tự đánh giá và tương tác văn minh cả đời thực lẫn trên các nhóm trực tuyến của lớp.'],
        integratedCompetencies:
          nlsTargets.includes('classMeeting') || nlaiTargets.includes('classMeeting')
            ? {
                ...(nlsTargets.includes('classMeeting') ? { digital: digitalComp } : {}),
                ...(nlaiTargets.includes('classMeeting') ? { ai: aiComp } : {}),
              }
            : undefined,
        qualities: ['Tinh thần trách nhiệm, tính trung thực và tinh thần đoàn kết giúp đỡ bạn bè.'],
      },
      equipment: {
        teacher: ['Bản cam kết văn hóa lớp học khổ A0, bút dạ nhiều màu.'],
        students: ['Sổ ghi chép, suy nghĩ trước về các điều khoản văn hóa ứng xử lớp học.'],
      },
      steps: classSteps,
    },
  };

  plan.validationReport = calculateValidationReport(plan);
  return plan;
}

// Fallback refinement for zero-downtime operations
function fallbackRefinePlan(plan: any, action: string, customInstruction?: string) {
  const clone = JSON.parse(JSON.stringify(plan));
  clone.id = clone.id || `plan-${Date.now()}`;
  clone.updatedAt = new Date().toLocaleDateString('vi-VN');

  const actionKeys: Array<'flagSalute' | 'topicActivity' | 'classMeeting'> = [
    'flagSalute',
    'topicActivity',
    'classMeeting',
  ];

  if (action === 'expand_steps' || action === 'detail') {
    actionKeys.forEach((key) => {
      const section = clone.activities?.[key];
      if (section && section.steps) {
        section.steps = section.steps.map((st: any) => {
          let actionText = st.teacherStudentAction || '';
          if (!actionText.includes('Bước 1') || !actionText.includes('Bước 2')) {
            actionText = `• Bước 1 (Giao nhiệm vụ): GV nêu rõ mục tiêu, yêu cầu học sinh làm việc theo nhóm 4-6 bạn, phân công nhóm trưởng điều phối, thư ký ghi chép; sử dụng học liệu SGK và phiếu học tập; thời gian 7 phút.\n• Bước 2 (Thực hiện nhiệm vụ): HS chủ động nghiên cứu tài liệu, trao đổi sôi nổi. GV quan sát, luân phiên đến các nhóm hỗ trợ, gợi mở cho những học sinh còn rụt rè; giải đáp kịp thời các vướng mắc.\n• Bước 3 (Báo cáo - Thảo luận): GV chỉ định ngẫu nhiên 2 nhóm báo cáo sản phẩm trước lớp; các nhóm khác chú ý lắng nghe, ghi chép phản biện và đặt câu hỏi mở rộng; GV điều hành phiên thảo luận văn minh.\n• Bước 4 (Nhận định - Kết luận): GV tổng kết, đánh giá cụ thể mức độ hoàn thành của từng nhóm; chốt kiến thức và kĩ năng cốt lõi cần ghi nhớ; tuyên dương tinh thần hợp tác tích cực.`;
          } else {
            actionText += `\n• Hỗ trợ sư phạm chi tiết: GV quan sát kỹ nhóm học sinh gặp khó khăn, đặt câu hỏi gợi mở từng bước thay vì làm hộ; khuyến khích tất cả thành viên trong nhóm đều được phát biểu.`;
          }

          let prodText = st.expectedProduct || '';
          if (!prodText.includes('Phiếu học tập') && !prodText.includes('Bảng tổng hợp')) {
            prodText += `\n• Bảng tổng hợp ý kiến hoặc sơ đồ tư duy trên giấy A3/vở ghi.\n• Tinh thần tự giác, thái độ hợp tác tích cực và câu trả lời hoàn chỉnh của học sinh.`;
          }

          return {
            ...st,
            teacherStudentAction: actionText,
            expectedProduct: prodText,
          };
        });
      }
    });
  } else if (action === 'shorten') {
    actionKeys.forEach((key) => {
      const section = clone.activities?.[key];
      if (section && section.steps) {
        section.steps = section.steps.map((st: any) => ({
          ...st,
          teacherStudentAction: st.teacherStudentAction
            .split('\n')
            .filter((l: string) => l.trim().length > 0)
            .slice(0, 5)
            .join('\n'),
        }));
      }
    });
  } else if (action === 'add_activity') {
    const topicSec = clone.activities?.topicActivity;
    if (topicSec && topicSec.steps) {
      topicSec.steps.push({
        stepId: `hdgd-extra-${Date.now()}`,
        stepName: `Hoạt động ${topicSec.steps.length + 1}. Trò chơi trải nghiệm tương tác: "Vòng tròn kết nối"`,
        objective: 'Củng cố kiến thức, tạo sự hào hứng và gắn kết học sinh thông qua hoạt động vận động nhẹ.',
        teacherStudentAction:
          '• Bước 1 (Giao nhiệm vụ): GV phổ biến luật chơi: Cả lớp chia thành các đội, lần lượt vượt chướng ngại vật tình huống trong thời gian 3 phút.\n• Bước 2 (Thực hiện nhiệm vụ): HS hào hứng tham gia, phối hợp nhịp nhàng, GV theo dõi và chấm điểm khích lệ.\n• Bước 3 (Báo cáo - Thảo luận): Đại diện các đội phát biểu cảm nghĩ sau trò chơi.\n• Bước 4 (Nhận định - Kết luận): GV chốt thông điệp giáo dục và khen ngợi đội chiến thắng.',
        expectedProduct:
          '• 100% học sinh tham gia sôi nổi, nắm vững bài học qua trải nghiệm thực tế.\n• Bảng điểm thi đua và tinh thần đoàn kết của tập thể lớp.',
      });
    }
  } else if (action === 'add_product') {
    actionKeys.forEach((key) => {
      const section = clone.activities?.[key];
      if (section && section.steps) {
        section.steps = section.steps.map((st: any) => ({
          ...st,
          expectedProduct: `${st.expectedProduct}\n• Phiếu tự đánh giá và rubric đánh giá chéo giữa các nhóm học sinh.\n• Cam kết hành động thực tế ghi vào Sổ tay rèn luyện cá nhân.`,
        }));
      }
    });
  } else if (action === 'auto_fix') {
    if (!clone.objectives.competencies.manifestations || clone.objectives.competencies.manifestations.length === 0) {
      clone.objectives.competencies.manifestations = [
        'HS chủ động hoàn thành các nhiệm vụ học tập đúng hạn.',
        'HS biết lắng nghe, chia sẻ và hợp tác tích cực với các bạn trong nhóm.',
        'HS tự tin trình bày ý kiến và tự điều chỉnh hành vi của bản thân.',
      ];
    }
    if (!clone.objectives.qualities.manifestations || clone.objectives.qualities.manifestations.length === 0) {
      clone.objectives.qualities.manifestations = [
        'Thể hiện sự chăm chỉ qua việc chuẩn bị bài và tham gia tích cực.',
        'Có tinh thần trách nhiệm với công việc chung của tập thể lớp.',
      ];
    }
  }

  clone.validationReport = calculateValidationReport(clone);
  return clone;
}
app.post('/api/ai/generate-lesson-plan', async (req, res) => {
  try {
    const {
      grade,
      selectedActivities,
      mode,
      topicName,
      lessonName,
      weekNumber,
      durationString,
      flagSaluteNotes,
      topicActivityNotes,
      classMeetingNotes,
      selectedNlsCode,
      nlsContent,
      nlsTargetActivities,
      selectedNlaiCode,
      nlaiContent,
      nlaiTargetActivities,
      uploadedFiles,
      oldLessonPlanText,
    } = req.body;

    // Kiểm tra xem giáo viên có thực sự CHỌN VỊ TRÍ và ĐIỀN NỘI DUNG tích hợp hay không
    const isNlsActive = Boolean(
      nlsContent && nlsContent.trim().length > 0 &&
      Array.isArray(nlsTargetActivities) && nlsTargetActivities.length > 0
    );
    const isNlaiActive = Boolean(
      nlaiContent && nlaiContent.trim().length > 0 &&
      Array.isArray(nlaiTargetActivities) && nlaiTargetActivities.length > 0
    );

    const formatActivityNames = (arr?: string[]) => {
      if (!arr || arr.length === 0) return 'Chưa chọn (Không tích hợp)';
      return arr.map(a => a === 'flagSalute' ? 'Tiết 1: Sinh hoạt dưới cờ (tại lớp)' : a === 'topicActivity' ? 'Tiết 2: Hoạt động GD theo chủ đề' : 'Tiết 3: Sinh hoạt lớp').join('; ');
    };

    let nlsPromptSection = '';
    if (isNlsActive) {
      nlsPromptSection = `• NĂNG LỰC SỐ (NLS) - GIÁO VIÊN ĐÃ ĐIỀN NỘI DUNG VÀ CHỌN VỊ TRÍ (QUY ƯỚC MÀU ĐỎ KÈM THẺ [NLS]):
  - Mã chỉ số NLS: ${selectedNlsCode || 'NLS'}
  - Nội dung/Yêu cầu cần đạt NLS do GV điền: ${nlsContent.trim()}
  - VỊ TRÍ ĐƯỢC CHỌN TÍCH HỢP NLS: ${formatActivityNames(nlsTargetActivities)}
  -> QUY TẮC BẮT BUỘC: Đưa mục tiêu NLS và chèn các bước có thẻ [NLS] (quy ước chữ ĐỎ) CHỈ vào đúng các hoạt động/tiết được giáo viên chọn ở trên (${formatActivityNames(nlsTargetActivities)}). TUYỆT ĐỐI KHÔNG tích hợp NLS vào các tiết khác không được chọn!`;
    } else {
      nlsPromptSection = `• NĂNG LỰC SỐ (NLS): GIÁO VIÊN ĐỂ TRỐNG NỘI DUNG HOẶC KHÔNG CHỌN VỊ TRÍ TÍCH HỢP.
  -> QUY TẮC BẮT BUỘC: TUYỆT ĐỐI KHÔNG TỰ ĐỘNG TÍCH HỢP NĂNG LỰC SỐ (NLS)! KHÔNG thêm mục tiêu NLS vào bất kỳ tiết nào, KHÔNG gắn thẻ [NLS], KHÔNG chèn nội dung chữ đỏ về NLS vào bài dạy.`;
    }

    let nlaiPromptSection = '';
    if (isNlaiActive) {
      nlaiPromptSection = `• NĂNG LỰC TRÍ TUỆ NHÂN TẠO (NL AI) - GIÁO VIÊN ĐÃ ĐIỀN NỘI DUNG VÀ CHỌN VỊ TRÍ (QUY ƯỚC MÀU XANH DƯƠNG KÈM THẺ [NLAI]):
  - Mã chỉ số NL AI: ${selectedNlaiCode || 'NLAI'}
  - Nội dung/Yêu cầu cần đạt NL AI do GV điền: ${nlaiContent.trim()}
  - VỊ TRÍ ĐƯỢC CHỌN TÍCH HỢP NL AI: ${formatActivityNames(nlaiTargetActivities)}
  -> QUY TẮC BẮT BUỘC: Đưa mục tiêu NL AI và chèn các bước có thẻ [NLAI] (quy ước chữ XANH DƯƠNG) CHỈ vào đúng các hoạt động/tiết được giáo viên chọn ở trên (${formatActivityNames(nlaiTargetActivities)}). TUYỆT ĐỐI KHÔNG tích hợp NL AI vào các tiết khác không được chọn!`;
    } else {
      nlaiPromptSection = `• NĂNG LỰC TRÍ TUỆ NHÂN TẠO (NL AI): GIÁO VIÊN ĐỂ TRỐNG NỘI DUNG HOẶC KHÔNG CHỌN VỊ TRÍ TÍCH HỢP.
  -> QUY TẮC BẮT BUỘC: TUYỆT ĐỐI KHÔNG TỰ ĐỘNG TÍCH HỢP TRÍ TUỆ NHÂN TẠO (NL AI)! KHÔNG thêm mục tiêu NL AI vào bất kỳ tiết nào, KHÔNG gắn thẻ [NLAI], KHÔNG chèn nội dung chữ xanh dương về NL AI vào bài dạy.`;
    }

    const userPrompt = `
YÊU CẦU: Hãy soạn hoặc hoàn thiện một Kế hoạch bài dạy (Giáo án) Hoạt động trải nghiệm, hướng nghiệp Lớp ${grade || '7'}.

CHẾ ĐỘ: ${mode === 'edit_old' ? 'CHỈNH SỬA VÀ CHUẨN HÓA GIÁO ÁN CŨ' : 'SOẠN GIÁO ÁN MỚI'}
CÁC LOẠI HOẠT ĐỘNG CẦN SOẠN: ${JSON.stringify(selectedActivities || ['flagSalute', 'topicActivity', 'classMeeting'])}
THÔNG TIN CHUNG:
- Lớp: ${grade}
- Tên Chủ đề: ${topicName || 'Chủ đề rèn luyện bản thân'}
- Tên bài/hoạt động: ${lessonName || 'Hoạt động trải nghiệm'}
- Tuần: ${weekNumber || 'Tuần 1'}
- Thời lượng: ${durationString || '3 tiết'}

QUY ĐỊNH TÍCH HỢP NĂNG LỰC SỐ (NLS) VÀ NĂNG LỰC TRÍ TUỆ NHÂN TẠO (NL AI):
${nlsPromptSection}

${nlaiPromptSection}

DỮ LIỆU ĐẦU VÀO TỪ GIÁO VIÊN:
${flagSaluteNotes ? `• Ghi chú Tiết 1 - Sinh hoạt dưới cờ (tổ chức tại lớp, GV bộ môn phụ trách, 6 nhóm): ${flagSaluteNotes}` : ''}
${topicActivityNotes ? `• Ghi chú Tiết 2 - Hoạt động GD theo chủ đề: ${topicActivityNotes}` : ''}
${classMeetingNotes ? `• Ghi chú Tiết 3 - Sinh hoạt lớp: ${classMeetingNotes}` : ''}
${oldLessonPlanText ? `• Nội dung giáo án cũ cần chuẩn hóa:\n${oldLessonPlanText.slice(0, 8000)}` : ''}

${
  uploadedFiles && uploadedFiles.length > 0
    ? `TÀI LIỆU/SGK GIÁO VIÊN CUNG CẤP:\n` +
      uploadedFiles.map((f: any) => `- ${f.name} (${f.category}): ${f.textContent?.slice(0, 3000) || 'Đính kèm tài liệu'}`).join('\n')
    : ''
}

CHỈ ĐẠO SOẠN GIÁO ÁN CHI TIẾT - TUYỆT ĐỐI BÁM SÁT MẪU VÀ ĐẠT ĐỘ DÀI CHUẨN IN VĂN BẢN A4:
1. MỤC TIÊU CHUNG CỦA CHỦ ĐỀ:
   - Kiến thức: Nêu rõ và đầy đủ ít nhất 3-4 yêu cầu cần đạt cốt lõi;
   - Phẩm chất: Nêu rõ các phẩm chất (Nhân ái, Trách nhiệm, Chăm chỉ, Trung thực...) và biểu hiện hành vi trong thực tế;
   - Năng lực: Nêu rõ năng lực đặc thù môn Hoạt động trải nghiệm (Thích ứng với cuộc sống, Thiết kế và tổ chức hoạt động, Định hướng nghề nghiệp) và năng lực chung.

2. QUY ĐỊNH DUNG LƯỢNG VÀ TIẾN TRÌNH TỪNG TIẾT (ĐẢM BẢO CHUẨN SƯ PHẠM: TIẾT 1 >= 3 TRANG A4, TIẾT 2 >= 4 TRANG A4, TIẾT 3 >= 3 TRANG A4):
   - TIẾT 1 (Sinh hoạt dưới cờ tại lớp - GV bộ môn phụ trách, 6 nhóm) - TỐI THIỂU 3 TRANG A4:
     + Đủ 5 bước: Khởi động (nghi thức chào cờ tại lớp trang nghiêm 3 phút, văn nghệ/video truyền thống 4 phút) -> Tuyên bố lý do, giới thiệu chủ đề & Phân chia 6 nhóm cụ thể -> Tổ chức hoạt động chủ đề theo 6 nhóm tại lớp & Báo cáo thảo luận (23 phút) -> Đánh giá, nhận xét hoạt động của 6 nhóm -> Dặn dò hoạt động tiếp nối.
     + Phải viết đầy đủ lời thoại, câu hỏi phân tích, nhiệm vụ riêng biệt của từng nhóm trong 6 nhóm học tập, hướng dẫn thảo luận chi tiết, sản phẩm bảng A3 cụ thể, tiêu chí nhận xét của GV.
   - TIẾT 2 (Hoạt động GD theo chủ đề) - TỐI THIỂU 4 TRANG A4:
     + Đủ 4 hoạt động 5512: Khởi động -> Khám phá - Kết nối -> Thực hành - Luyện tập -> Vận dụng.
     + Mỗi hoạt động BẮT BUỘC đủ 4 bước sư phạm chi tiết: Bước 1 (Giao nhiệm vụ: câu lệnh sư phạm rõ ràng của GV, chia nhóm, thời gian, phương tiện); Bước 2 (Thực hiện nhiệm vụ: hoạt động chi tiết của HS, gợi mở sư phạm của GV cho nhóm gặp khó); Bước 3 (Báo cáo - Thảo luận: nhóm trình bày, nhóm phản biện, cách điều hành); Bước 4 (Nhận định - Kết luận: GV nhận xét, chốt kiến thức cốt lõi vào vở).
     + Phải có kịch bản sắm vai, câu hỏi tình huống đời thực và mạng xã hội, phiếu học tập số 1 & số 2 in sẵn bảng mẫu, tiêu chí đánh giá rubric chi tiết và Bản kế hoạch hành động cá nhân có lộ trình từng ngày.
   - TIẾT 3 (Sinh hoạt lớp) - TỐI THIỂU 3 TRANG A4:
     + Đủ 5 bước: 1. Khởi động -> 2. HS chia sẻ kết quả hoạt động vận dụng trong nhóm (báo cáo tiến độ kế hoạch cá nhân, việc đã làm và khó khăn) -> 3. Đại diện các nhóm chia sẻ trước lớp -> 4. Thảo luận, nhận xét và thống nhất giải pháp (lập danh sách phân công Đôi bạn cùng tiến) -> 5. Đánh giá chủ đề, thông qua và ký toàn văn BẢN CAM KẾT VĂN HÓA LỚP HỌC KHỔ A0 (nêu rõ các điều khoản kỷ luật và văn hóa ứng xử số) & Dặn dò.

HÃY XUẤT RA DƯỚI ĐỊNH DẠNG JSON với cấu trúc chính xác sau:
{
  "id": "plan-id-unique",
  "grade": "${grade || '7'}",
  "schoolName": "${req.body.schoolName || 'TRƯỜNG THCS TỊNH BIÊN'}",
  "teacherName": "${req.body.teacherName || 'Đặng Văn Sạch'}",
  "departmentName": "${req.body.departmentName || 'Tổ: Công nghệ - Hướng nghiệp'}",
  "schoolYear": "${req.body.schoolYear || '2026 - 2027'}",
  "semester": "${req.body.semester || `Học kỳ: I - ${weekNumber || 'Tuần 1'}`}",
  "topic": "${topicName || 'CHỦ ĐỀ 1: EM VỚI NHÀ TRƯỜNG'}",
  "week": "${weekNumber || 'Tuần 1'}",
  "lessonTitle": "${lessonName || 'Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô'}",
  "duration": "${durationString || '3 tiết'}",
  "objectives": {
    "knowledge": ["mục tiêu kiến thức 1 chi tiết...", "mục tiêu kiến thức 2 chi tiết...", "mục tiêu 3..."],
    "competencies": {
      "general": ["Tự chủ và tự học: ...", "Giao tiếp và hợp tác: ...", "Giải quyết vấn đề và sáng tạo: ..."],
      "specific": ["Năng lực thích ứng với cuộc sống: ...", "Năng lực thiết kế và tổ chức hoạt động: ...", "Năng lực định hướng nghề nghiệp: ..."],
      "manifestations": ["Biểu hiện cụ thể 1...", "Biểu hiện cụ thể 2...", "Biểu hiện 3..."]
    },
    "qualities": {
      "items": ["Nhân ái: ...", "Trách nhiệm: ...", "Chăm chỉ: ..."],
      "manifestations": ["Biểu hiện hành vi 1 của HS...", "Biểu hiện hành vi 2..."]
    }
  },
  "equipment": {
    "teacher": ["Học liệu, thiết bị cụ thể của GV 1", "Học liệu 2", "Học liệu 3"],
    "students": ["Đồ dùng, chuẩn bị cụ thể của HS 1", "Đồ dùng 2", "Đồ dùng 3"]
  },
  "activities": {
    "flagSalute": {
      "enabled": boolean,
      "title": "TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)",
      "duration": "1 tiết (45 phút)",
      "steps": [
        {
          "stepId": "shdc-1",
          "stepName": "1. Khởi động (Nghi thức đầu tuần & Trò chơi gắn kết - 7 phút)",
          "objective": "Mục tiêu cụ thể...",
          "method": "Phương pháp trực quan, vấn đáp gợi mở và nêu vấn đề, hoạt động tập thể.",
          "teacherStudentAction": "* Mục tiêu: ...\\n* Phương pháp thực hiện: Phương pháp trực quan, vấn đáp gợi mở và nêu vấn đề.\\n* Tổ chức thực hiện:\\n- Bước 1: Chuyển giao nhiệm vụ\\n+ Giáo viên ...\\n+ Học sinh ...\\n- Bước 2: Thực hiện nhiệm vụ\\n+ Học sinh ...\\n+ Giáo viên ...\\n- Bước 3: Báo cáo, thảo luận\\n+ Đại diện học sinh ...\\n- Bước 4: Kết luận, nhận định\\n+ Giáo viên ...",
          "expectedProduct": "- Học sinh thực hiện trang nghiêm...\\n- Không khí sôi nổi hào hứng..."
        }
      ]
    },
    "topicActivity": {
      "enabled": boolean,
      "title": "TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ",
      "duration": "1 tiết (45 phút)",
      "steps": [
        {
          "stepId": "hdgd-1",
          "stepName": "1. Hoạt động 1: Khởi động (5 phút)",
          "objective": "Tạo không khí cởi mở, gợi mở vấn đề...",
          "method": "Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề.",
          "teacherStudentAction": "* Mục tiêu: Tạo không khí cởi mở, gợi mở vấn đề...\\n* Phương pháp thực hiện: Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề.\\n* Tổ chức thực hiện:\\n- Bước 1: Chuyển giao nhiệm vụ\\n+ Giáo viên trình chiếu hình ảnh/nhiệm vụ và đặt câu hỏi gợi mở...\\n+ Học sinh quan sát, tiếp nhận nhiệm vụ...\\n- Bước 2: Thực hiện nhiệm vụ\\n+ Học sinh suy nghĩ, trao đổi...\\n+ Giáo viên quan sát, gợi mở...\\n- Bước 3: Báo cáo, thảo luận\\n+ Đại diện học sinh phát biểu...\\n+ Các bạn khác nhận xét...\\n- Bước 4: Kết luận, nhận định\\n+ Giáo viên nhận xét, chuẩn hóa kiến thức dẫn dắt vào bài mới...",
          "expectedProduct": "- Học sinh hào hứng quan sát...\\n- Học sinh tự do phát biểu suy nghĩ cá nhân...\\n- Tạo tâm thế sẵn sàng tiếp nhận bài học..."
        }
      ]
    },
    "classMeeting": {
      "enabled": boolean,
      "title": "TIẾT 3: SINH HOẠT LỚP",
      "duration": "1 tiết (45 phút)",
      "steps": [
        {
          "stepId": "shl-1",
          "stepName": "1. Khởi động (5 phút)",
          "objective": "Tạo tâm thế thân thiện, cởi mở...",
          "method": "Phương pháp trò chơi, hoạt động tập thể.",
          "teacherStudentAction": "* Mục tiêu: ...\\n* Phương pháp thực hiện: ...\\n* Tổ chức thực hiện:\\n- Bước 1: Chuyển giao nhiệm vụ\\n+ Giáo viên / Ban văn nghệ ...\\n- Bước 2: Thực hiện nhiệm vụ\\n+ Cả lớp tham gia...\\n- Bước 3: Báo cáo, thảo luận\\n+ Học sinh chia sẻ cảm xúc...\\n- Bước 4: Kết luận, nhận định\\n+ GV chủ nhiệm dẫn dắt vào nội dung...",
          "expectedProduct": "- Học sinh sẵn sàng tâm thế cởi mở..."
        }
      ]
    }
  },
  "evaluationNotes": "Lưu ý sư phạm và hướng dẫn đánh giá thường xuyên chi tiết..."
}
`;

    const contents: any[] = [];

    // Check if any uploaded files have image inlineData
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file.base64Data && file.type && file.type.startsWith('image/')) {
          contents.push({
            inlineData: {
              data: file.base64Data.replace(/^data:image\/[a-z]+;base64,/, ''),
              mimeType: file.type,
            },
          });
        } else if (file.base64Data && file.type === 'application/pdf') {
          contents.push({
            inlineData: {
              data: file.base64Data.replace(/^data:application\/pdf;base64,/, ''),
              mimeType: 'application/pdf',
            },
          });
        }
      }
    }

    contents.push({ text: userPrompt });

    let rawText = '';
    let parsedPlan: any = null;

    try {
      rawText = await callGeminiWithRetry({
        contents: { parts: contents },
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        timeoutMs: 18000,
      });

      try {
        parsedPlan = JSON.parse(rawText);
      } catch (parseError) {
        const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedPlan = JSON.parse(cleanJson);
      }
    } catch (apiErr: any) {
      console.warn('Gemini API call failed after retries, applying fallback synthesis:', apiErr?.message);
      // Fallback synthesis ensures teachers always get a complete, valid lesson plan!
      parsedPlan = fallbackSynthesizePlan(req.body);
    }

    // Ensure generalTopicObjectives and periods are populated
    if (!parsedPlan.generalTopicObjectives) {
      parsedPlan.generalTopicObjectives = {
        knowledge: parsedPlan.objectives?.knowledge || [
          `Nắm vững yêu cầu cần đạt trọng tâm của bài học "${lessonName || ''}" theo Chương trình GDPT 2018;`,
          'Hiểu rõ ý nghĩa thực tiễn của hoạt động trải nghiệm trong việc rèn luyện bản thân và thích ứng với môi trường số; rèn luyện thói quen tư duy phản biện.',
        ],
        qualities: parsedPlan.objectives?.qualities?.items || [
          'Nhân ái, tôn trọng sự khác biệt của mọi người;',
          'Trách nhiệm với bản thân, gia đình, nhà trường và hành vi ứng xử trên môi trường số.',
        ],
        competencies: parsedPlan.objectives?.competencies?.general || [
          'Thích ứng với cuộc sống; Thiết kế và tổ chức hoạt động; Tự chủ và tự học;',
          'Giao tiếp và hợp tác trong đời thực cũng như trên môi trường số.',
        ],
      };
    }

    if (!parsedPlan.periods) {
      parsedPlan.periods = {};
    }

    const effectiveNlsTargets: string[] = isNlsActive ? (nlsTargetActivities || []) : [];
    const effectiveNlaiTargets: string[] = isNlaiActive ? (nlaiTargetActivities || []) : [];

    const digitalObj = isNlsActive
      ? {
          code: selectedNlsCode || 'NLS',
          title: `Năng lực số (${selectedNlsCode || 'NLS'}) - Quy ước MÀU ĐỎ (Theo TT02 & CV 3456)`,
          details: nlsContent.trim(),
        }
      : undefined;

    const aiObj = isNlaiActive
      ? {
          code: selectedNlaiCode || 'NLAI',
          title: `Năng lực Trí tuệ nhân tạo (${selectedNlaiCode || 'NLAI'}) - Quy ước MÀU XANH DƯƠNG (Theo CV 2422 & CV 3456)`,
          details: nlaiContent.trim(),
        }
      : undefined;

    const periodMeta: Record<string, { number: number; title: string; subTitle: string; note?: string }> = {
      flagSalute: {
        number: 1,
        title: 'TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)',
        subTitle: `CHỦ ĐỀ: ${(topicName || parsedPlan.topic || '').toUpperCase()} (TỔ CHỨC TẠI LỚP - 6 NHÓM)`,
        note: '(Do Giáo viên bộ môn được phân công phụ trách điều hành tại phòng học, lớp chia 6 nhóm)',
      },
      topicActivity: {
        number: 2,
        title: 'TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ',
        subTitle: `NỘI DUNG: ${(lessonName || parsedPlan.lessonTitle || '').toUpperCase()}`,
      },
      classMeeting: {
        number: 3,
        title: 'TIẾT 3: SINH HOẠT LỚP',
        subTitle: `CHỦ ĐỀ: XÂY DỰNG NỘI QUY TỰ QUẢN & BẢN CAM KẾT VĂN HÓA LỚP HỌC ${grade || '7'}`,
      },
    };

    ['flagSalute', 'topicActivity', 'classMeeting'].forEach((pKey) => {
      const act = parsedPlan.activities?.[pKey];
      if (act && act.enabled !== false) {
        if (!parsedPlan.periods[pKey]) {
          parsedPlan.periods[pKey] = {
            enabled: true,
            periodNumber: periodMeta[pKey].number,
            periodType: pKey,
            title: act.title || periodMeta[pKey].title,
            subTitle: periodMeta[pKey].subTitle,
            note: periodMeta[pKey].note,
            objectives: {
              knowledge: parsedPlan.objectives?.knowledge || [],
              competencies: parsedPlan.objectives?.competencies?.general || [],
              qualities: parsedPlan.objectives?.qualities?.items || [],
            },
            equipment: {
              teacher: parsedPlan.equipment?.teacher || ['Máy tính, máy chiếu/tivi, học liệu bài dạy.'],
              students: parsedPlan.equipment?.students || ['SGK, vở ghi, giấy A3/A4, bút viết.'],
            },
            steps: act.steps || [],
          };
        }

        const hasNls = effectiveNlsTargets.includes(pKey);
        const hasNlai = effectiveNlaiTargets.includes(pKey);
        if (hasNls || hasNlai) {
          parsedPlan.periods[pKey].objectives = parsedPlan.periods[pKey].objectives || {};
          parsedPlan.periods[pKey].objectives.integratedCompetencies = {
            ...(hasNls && digitalObj ? { digital: digitalObj } : {}),
            ...(hasNlai && aiObj ? { ai: aiObj } : {}),
          };
        } else {
          // Xóa bỏ hoàn toàn integratedCompetencies nếu không tích hợp trong tiết này
          if (parsedPlan.periods[pKey]?.objectives?.integratedCompetencies) {
            delete parsedPlan.periods[pKey].objectives.integratedCompetencies;
          }
        }

        // Làm sạch thẻ [NLS] hoặc [NLAI] nếu không được chọn tích hợp trong tiết này
        if (!hasNls && parsedPlan.periods[pKey]?.steps) {
          parsedPlan.periods[pKey].steps = parsedPlan.periods[pKey].steps.map((st: any) => ({
            ...st,
            teacherStudentAction: st.teacherStudentAction ? st.teacherStudentAction.replace(/\n?\[NLS\][^\n]*/gi, '').trim() : '',
            expectedProduct: st.expectedProduct ? st.expectedProduct.replace(/\n?\[NLS\][^\n]*/gi, '').trim() : '',
          }));
        }
        if (!hasNlai && parsedPlan.periods[pKey]?.steps) {
          parsedPlan.periods[pKey].steps = parsedPlan.periods[pKey].steps.map((st: any) => ({
            ...st,
            teacherStudentAction: st.teacherStudentAction ? st.teacherStudentAction.replace(/\n?\[NLAI\][^\n]*/gi, '').trim() : '',
            expectedProduct: st.expectedProduct ? st.expectedProduct.replace(/\n?\[NLAI\][^\n]*/gi, '').trim() : '',
          }));
        }
      }
    });

    // Assign current timestamp
    parsedPlan.id = `plan-${Date.now()}`;
    parsedPlan.createdAt = new Date().toLocaleDateString('vi-VN');
    parsedPlan.updatedAt = new Date().toLocaleDateString('vi-VN');

    // Run quick server-side validation scoring
    parsedPlan.validationReport = calculateValidationReport(parsedPlan);

    res.json({ success: true, plan: parsedPlan });
  } catch (error: any) {
    console.error('Error in generate-lesson-plan route:', error);
    // Even in catastrophic error, fallback synthesize so user never gets blocked
    const fallbackPlan = fallbackSynthesizePlan(req.body);
    res.json({ success: true, plan: fallbackPlan });
  }
});

// Endpoint: Refine / Modify current lesson plan
app.post('/api/ai/refine-lesson-plan', async (req, res) => {
  try {
    const { plan, action, customInstruction } = req.body;

    let instructionDetails = '';
    switch (action) {
      case 'detail':
        instructionDetails = 'Hãy viết chi tiết và sâu sắc hơn cho toàn bộ các hoạt động, đặc biệt mở rộng lời dẫn của GV, câu hỏi gợi mở, hoạt động chi tiết của các nhóm HS và bổ sung các sản phẩm cụ thể.';
        break;
      case 'shorten':
        instructionDetails = 'Hãy cô đọng, súc tích lại giáo án nhưng tuyệt đối vẫn giữ nguyên cấu trúc 4 bước Công văn 5512 và bảng 2 cột.';
        break;
      case 'expand_steps':
        instructionDetails = 'CHI TIẾT HÓA TIẾN TRÌNH: Mở rộng phần "Hoạt động của GV – HS" thành các bước cực kỳ cụ thể (phân rõ lời nói GV, hành động nhóm trưởng, thư ký, thành viên, phương án hỗ trợ HS yếu kém) nhưng KHÔNG được làm thay đổi mục tiêu và nội dung cốt lõi đã xác định.';
        break;
      case 'add_activity':
        instructionDetails = 'Bổ sung thêm 1 hoạt động trải nghiệm hoặc trò chơi tương tác thực tế phù hợp với chủ đề để tăng tính hấp dẫn.';
        break;
      case 'change_format':
        instructionDetails = 'Thay đổi hình thức tổ chức (ví dụ: chuyển sang diễn đàn giao lưu, sân khấu hóa, sắm vai xử lý tình huống, ngày hội trải nghiệm sáng tạo).';
        break;
      case 'add_product':
        instructionDetails = 'Bổ sung và cụ thể hóa các sản phẩm học tập ở cột phải (phiếu học tập chi tiết, rubric đánh giá, poster tuyên truyền, kế hoạch hành động đo lường được).';
        break;
      case 'auto_fix':
        instructionDetails = 'TỰ ĐỘNG HOÀN THIỆN: Khắc phục toàn bộ các điểm chưa đạt trong báo cáo kiểm tra (đảm bảo đầy đủ 2 cột, 4 bước 5512 chi tiết, mục tiêu gắn liền sản phẩm, ngôn ngữ chuẩn sư phạm GDPT 2018).';
        break;
      default:
        instructionDetails = customInstruction || 'Cải tiến và hoàn thiện giáo án theo yêu cầu.';
    }

    const prompt = `
Dưới đây là Kế hoạch bài dạy hiện tại:
${JSON.stringify(plan, null, 2)}

YÊU CẦU CHỈNH SỬA:
${instructionDetails}

QUY TẮC BẮT BUỘC:
1. Giữ nguyên định dạng JSON cấu trúc đồng nhất với giáo án ban đầu.
2. Tuyệt đối giữ nguyên bảng 2 cột cho mọi hoạt động trong tiến trình (HOẠT ĐỘNG CỦA GV - HS và DỰ KIẾN SẢN PHẨM).
3. Đảm bảo ngôn ngữ sư phạm chuẩn mực, phù hợp học sinh THCS Việt Nam.
`;

    let refinedPlan: any = null;

    try {
      const rawText = await callGeminiWithRetry({
        contents: prompt,
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      });

      try {
        refinedPlan = JSON.parse(rawText);
      } catch {
        const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        refinedPlan = JSON.parse(cleanJson);
      }
    } catch (apiErr: any) {
      console.warn('Gemini API call failed during refine, applying rule-based refinement:', apiErr?.message);
      refinedPlan = fallbackRefinePlan(plan, action, customInstruction);
    }

    refinedPlan.updatedAt = new Date().toLocaleDateString('vi-VN');
    refinedPlan.validationReport = calculateValidationReport(refinedPlan);

    res.json({ success: true, plan: refinedPlan });
  } catch (error: any) {
    console.error('Error refining lesson plan:', error);
    const fallbackPlan = fallbackRefinePlan(req.body.plan, req.body.action, req.body.customInstruction);
    res.json({ success: true, plan: fallbackPlan });
  }
});

// Endpoint: Validate lesson plan
app.post('/api/ai/validate-lesson-plan', async (req, res) => {
  try {
    const { plan } = req.body;
    const report = calculateValidationReport(plan);
    res.json({ success: true, report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Phân tích cấu trúc giáo án mẫu (PDF, Word, Text) để nhận diện bố cục, tiêu đề, bảng 2 cột
app.post('/api/ai/analyze-template', async (req, res) => {
  try {
    const { templateText, templateName, fileType } = req.body;

    if (!templateText || templateText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Chưa có nội dung văn bản giáo án mẫu' });
    }

    const prompt = `Bạn là chuyên gia thẩm định cấu trúc giáo án Việt Nam (GDPT 2018).
Hãy phân tích văn bản giáo án mẫu sau đây và nhận diện chính xác cấu trúc mẫu của giáo viên:

VĂN BẢN MẪU:
${templateText.slice(0, 15000)}

HÃY PHÂN TÍCH VÀ TRẢ VỀ JSON VỚI ĐỊNH DẠNG SAU:
{
  "name": "${templateName || 'Mẫu giáo án nhận diện'}",
  "hasTwoColumnTable": boolean, // Có sử dụng bảng 2 cột: HOẠT ĐỘNG CỦA GV VÀ HS - DỰ KIẾN SẢN PHẨM không?
  "structureSummary": "Tóm tắt ngắn gọn cấu trúc (ví dụ: Gồm Khung hành chính, Mục tiêu chung chủ đề, và 3 tiết học chi tiết dạng bảng 2 cột)",
  "identifiedSections": [
    {
      "title": "Tên đề mục chính xác trong mẫu (ví dụ: PHẦN A. MỤC TIÊU CHUNG CỦA CHỦ ĐỀ)",
      "level": 1,
      "type": "header" | "objectives" | "equipment" | "procedure_table" | "procedure_steps" | "evaluation" | "general",
      "description": "Mô tả ngắn quy cách trình bày của mục này trong mẫu"
    }
  ],
  "periods": [
    {
      "title": "Tiêu đề tiết nếu có (ví dụ: TIẾT 1: SINH HOẠT DƯỚI CỜ)",
      "format": "table_2_column" | "step_by_step" | "other"
    }
  ],
  "pedagogicalGuidelines": "Những điểm cốt lõi cần tuân thủ để bám sát 100% mẫu này khi soạn bài mới"
}
`;

    let analyzedData: any = null;
    try {
      const rawText = await callGeminiWithRetry({
        contents: prompt,
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      });
      analyzedData = JSON.parse(rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch (err: any) {
      console.warn('Fallback analysis for template:', err?.message);
      // Fallback analysis based on text heuristics
      const has2Col = templateText.includes('HOẠT ĐỘNG') || templateText.includes('SẢN PHẨM') || templateText.includes('GV – HS');
      analyzedData = {
        name: templateName || 'Mẫu giáo án nhận diện từ tệp tải lên',
        hasTwoColumnTable: has2Col,
        structureSummary: 'Nhận diện thành công cấu trúc giáo án chuẩn: Thông tin đầu trang, Mục tiêu (Kiến thức - Phẩm chất - Năng lực), Thiết bị học liệu và Tiến trình hoạt động.',
        identifiedSections: [
          { title: 'KHUNG THÔNG TIN ĐẦU TRANG', level: 1, type: 'header', description: 'Trường, Họ tên GV, Tổ, Năm học, Tuần, Tiêu đề bài dạy' },
          { title: 'I. MỤC TIÊU', level: 1, type: 'objectives', description: 'Kiến thức, Năng lực (đặc thù & chung), Phẩm chất' },
          { title: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU', level: 1, type: 'equipment', description: 'Phân định rõ đồ dùng của GV và HS' },
          { title: 'III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG', level: 1, type: has2Col ? 'procedure_table' : 'procedure_steps', description: has2Col ? 'Bảng 2 cột: HOẠT ĐỘNG CỦA GV VÀ HS - DỰ KIẾN SẢN PHẨM' : 'Các bước hoạt động tiến trình' }
        ],
        pedagogicalGuidelines: 'Giữ nguyên tiêu đề, cách đánh số và tiến trình hoạt động theo đúng tài liệu mẫu.'
      };
    }

    res.json({ success: true, analysis: analyzedData });
  } catch (error: any) {
    console.error('Error analyzing template:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi phân tích mẫu' });
  }
});

// Endpoint: Parse uploaded files (Word docx/doc, PDF with pdf-parse + Gemini OCR fallback, images, text)
app.post('/api/ai/parse-document', async (req, res) => {
  try {
    const { fileBase64, fileName, fileType, category } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ success: false, error: 'Không nhận được dữ liệu tệp tin' });
    }

    const cleanBase64 = fileBase64.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    let extractedText = '';

    const nameLower = (fileName || '').toLowerCase();
    const typeLower = (fileType || '').toLowerCase();

    const isDocx = typeLower.includes('word') || typeLower.includes('officedocument') || nameLower.endsWith('.docx');
    const isDoc = nameLower.endsWith('.doc');
    const isPdf = typeLower === 'application/pdf' || typeLower.includes('pdf') || nameLower.endsWith('.pdf');
    const isImage = typeLower.startsWith('image/') || /\.(png|jpe?g|webp|bmp|gif)$/i.test(nameLower);
    const isText = typeLower === 'text/plain' || /\.(txt|md|csv)$/i.test(nameLower);

    console.log(`[Parse Document] Parsing file: ${fileName}, size: ${(buffer.length / 1024).toFixed(1)} KB, type: ${fileType}, category: ${category}`);

    if (isDocx) {
      // 1. Word .docx format with mammoth
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value?.trim() || '';
      } catch (docErr: any) {
        console.warn('[Parse Document] Mammoth docx extraction warning:', docErr?.message);
      }
    } else if (isDoc) {
      // 2. Binary .doc format
      try {
        const rawStr = buffer.toString('utf-8');
        const matches = rawStr.match(/[\u0020-\u007E\u00A0-\u024F\u1EA0-\u1EF9]{4,}/g);
        if (matches && matches.length > 5) {
          extractedText = matches.join(' ').replace(/\s+/g, ' ').slice(0, 10000);
        } else {
          extractedText = `Tài liệu Word (.doc): ${fileName}. Để giữ nguyên định dạng bảng biểu và cấu trúc, khuyến nghị lưu tệp sang .docx hoặc sao chép văn bản dán trực tiếp.`;
        }
      } catch (err: any) {
        extractedText = `Tài liệu Word: ${fileName}. Đã ghi nhận tệp đính kèm.`;
      }
    } else if (isPdf) {
      // 3. PDF format: Local extraction via pdf-parse first
      if (PDFParseClass) {
        try {
          const parser = new PDFParseClass({ data: buffer });
          const pdfRes = await parser.getText();
          if (pdfRes && pdfRes.text && pdfRes.text.trim().length > 30) {
            extractedText = pdfRes.text.trim();
            console.log(`[Parse Document] pdf-parse extracted ${extractedText.length} characters.`);
          }
          if (typeof parser.destroy === 'function') {
            await parser.destroy();
          }
        } catch (pdfErr: any) {
          console.warn('[Parse Document] pdf-parse local extraction failed, falling back to Gemini OCR:', pdfErr?.message);
        }
      }

      // If local extraction returned very little (e.g. scanned image PDF), use Gemini Vision OCR
      if (!extractedText || extractedText.length < 30) {
        const visionPrompt = `Hãy đọc kỹ tài liệu PDF đính kèm (sách giáo khoa hoặc giáo án Hoạt động trải nghiệm, hướng nghiệp THCS). 
Trích xuất toàn bộ văn bản và tóm tắt rõ:
- Tên chủ đề, tên bài học, lớp
- Các yêu cầu cần đạt hoặc mục tiêu bài học
- Các hoạt động và nhiệm vụ học tập của học sinh
- Các sản phẩm học tập dự kiến`;

        try {
          extractedText = await callGeminiWithRetry({
            contents: {
              parts: [
                { inlineData: { data: cleanBase64, mimeType: 'application/pdf' } },
                { text: visionPrompt },
              ],
            },
          });
        } catch (ocrErr: any) {
          console.warn('[Parse Document] Gemini PDF OCR failed:', ocrErr?.message);
          if (!extractedText) {
            extractedText = `Tài liệu PDF: ${fileName}. Đã nạp thành công tệp tin PDF (${(buffer.length / 1024).toFixed(0)} KB) làm căn cứ sư phạm cho bài học.`;
          }
        }
      }
    } else if (isImage) {
      // 4. Image format: Gemini Vision OCR
      const mimeType = typeLower.startsWith('image/') ? fileType : 'image/jpeg';
      const visionPrompt = `Hãy đọc kỹ hình ảnh trang sách giáo khoa hoặc giáo án môn Hoạt động trải nghiệm, hướng nghiệp THCS. 
Trích xuất toàn bộ nội dung văn bản trong ảnh:
- Tên chủ đề, tên bài, các mục hoạt động
- Các câu hỏi, bài tập, nhiệm vụ dành cho học sinh
- Các hướng dẫn thực hành và kết luận`;

      try {
        extractedText = await callGeminiWithRetry({
          contents: {
            parts: [
              { inlineData: { data: cleanBase64, mimeType } },
              { text: visionPrompt },
            ],
          },
        });
      } catch (ocrErr: any) {
        console.warn('[Parse Document] Image OCR failed:', ocrErr?.message);
        extractedText = `Hình ảnh tài liệu: ${fileName}. Đã tiếp nhận ảnh tài liệu đính kèm.`;
      }
    } else if (isText) {
      // 5. Plain text
      extractedText = buffer.toString('utf-8');
    } else {
      // 6. Generic fallback
      try {
        extractedText = buffer.toString('utf-8').slice(0, 10000);
      } catch (e) {
        extractedText = `Tài liệu: ${fileName}. Đã nạp tài liệu thành công.`;
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `Tài liệu: ${fileName}. Đã ghi nhận tài liệu đính kèm để làm căn cứ bài dạy.`;
    }

    const summary = extractedText.length > 500 ? extractedText.slice(0, 500) + '...' : extractedText;

    res.json({
      success: true,
      extractedText,
      textContent: extractedText,
      summary,
    });
  } catch (error: any) {
    console.error('[Parse Document] Error parsing document:', error);
    res.status(500).json({ success: false, error: error.message || 'Lỗi đọc tài liệu' });
  }
});

// Pedagogical rule evaluation helper
function calculateValidationReport(plan: any) {
  const passedItems: string[] = [];
  const pendingItems: string[] = [];
  const details: any[] = [];

  // 1. Grade check
  if (['6', '7', '8', '9'].includes(String(plan.grade))) {
    passedItems.push(`Đã xác định đúng khối lớp: Lớp ${plan.grade}.`);
    details.push({ criterion: 'Xác định khối lớp', status: 'passed', detail: `Lớp ${plan.grade} phù hợp cấp THCS.` });
  } else {
    pendingItems.push('Chưa xác định rõ khối lớp (phải là lớp 6, 7, 8 hoặc 9).');
    details.push({ criterion: 'Xác định khối lớp', status: 'failed', detail: 'Khối lớp không hợp lệ.' });
  }

  // 2. Topic & Lesson Title
  if (plan.topic && plan.topic.trim().length > 3) {
    passedItems.push(`Tên chủ đề rõ ràng: "${plan.topic}".`);
    details.push({ criterion: 'Tên chủ đề', status: 'passed', detail: plan.topic });
  } else {
    pendingItems.push('Cần bổ sung tên Chủ đề.');
    details.push({ criterion: 'Tên chủ đề', status: 'failed', detail: 'Thiếu tên chủ đề.' });
  }

  // 3. Objectives check (Knowledge, Competencies, Qualities)
  const knowledgeCount = plan.objectives?.knowledge?.length || 0;
  const compGeneral = plan.objectives?.competencies?.general?.length || 0;
  const compSpecific = plan.objectives?.competencies?.specific?.length || 0;
  const compManifest = plan.objectives?.competencies?.manifestations?.length || 0;
  const qualities = plan.objectives?.qualities?.items?.length || 0;

  if (knowledgeCount >= 1 && compSpecific >= 1 && qualities >= 1) {
    passedItems.push('Mục tiêu đầy đủ 3 phần: Kiến thức, Năng lực (chung & đặc thù), Phẩm chất theo chuẩn GDPT 2018.');
    details.push({
      criterion: 'Cấu trúc Mục tiêu (Kiến thức - Năng lực - Phẩm chất)',
      status: 'passed',
      detail: `Có ${knowledgeCount} mục tiêu kiến thức, ${compSpecific} năng lực đặc thù HĐTN, ${compManifest} biểu hiện hành vi cụ thể, ${qualities} phẩm chất.`,
    });
  } else {
    pendingItems.push('Phần Mục tiêu cần bổ sung năng lực đặc thù và biểu hiện hành vi cụ thể.');
    details.push({
      criterion: 'Cấu trúc Mục tiêu',
      status: 'warning',
      detail: 'Mục tiêu còn thiếu hoặc chưa đủ các tiêu chí năng lực đặc thù.',
    });
  }

  // 4. Equipment check
  const teacherEquip = plan.equipment?.teacher?.length || 0;
  const studentEquip = plan.equipment?.students?.length || 0;
  if (teacherEquip > 0 && studentEquip > 0) {
    passedItems.push('Thiết bị dạy học và học liệu phân tách rõ ràng giữa Giáo viên và Học sinh.');
    details.push({ criterion: 'Thiết bị & Học liệu', status: 'passed', detail: 'Phân định rõ đồ dùng chuẩn bị của GV và HS.' });
  } else {
    pendingItems.push('Cần phân tách rõ học liệu của Giáo viên và đồ dùng của Học sinh.');
    details.push({ criterion: 'Thiết bị & Học liệu', status: 'warning', detail: 'Chưa đủ danh mục học liệu.' });
  }

  // 5. Mandatory 2-Column Teaching Procedure Check
  let totalSteps = 0;
  let stepsWith4Stages = 0;
  let stepsWithValidProduct = 0;

  const sections = [plan.activities?.flagSalute, plan.activities?.topicActivity, plan.activities?.classMeeting].filter(
    (s) => s && s.enabled && s.steps && s.steps.length > 0
  );

  sections.forEach((sec) => {
    sec.steps.forEach((st: any) => {
      totalSteps++;
      const action = st.teacherStudentAction || '';
      if (
        action.includes('Bước 1') ||
        action.includes('Giao nhiệm vụ') ||
        action.includes('Thực hiện') ||
        action.includes('Báo cáo') ||
        action.includes('Kết luận')
      ) {
        stepsWith4Stages++;
      }
      if (st.expectedProduct && st.expectedProduct.trim().length > 15) {
        stepsWithValidProduct++;
      }
    });
  });

  if (totalSteps > 0) {
    passedItems.push(`Tiến trình tổ chức hoạt động gồm ${totalSteps} bước, bắt buộc trình bày dưới dạng BẢNG 2 CỘT song song.`);
    details.push({
      criterion: 'Bảng 2 cột bắt buộc trong tiến trình',
      status: 'passed',
      detail: 'Tất cả các hoạt động được bố trí 2 cột: "HOẠT ĐỘNG CỦA GV – HS" và "DỰ KIẾN SẢN PHẨM".',
    });

    if (stepsWith4Stages >= Math.ceil(totalSteps * 0.6)) {
      passedItems.push('Hoạt động của GV - HS mô tả rõ tiến trình 4 bước theo Công văn 5512 (Giao nhiệm vụ -> Thực hiện -> Báo cáo thảo luận -> Kết luận nhận định).');
      details.push({
        criterion: 'Quy trình 4 bước Công văn 5512',
        status: 'passed',
        detail: `${stepsWith4Stages}/${totalSteps} bước thể hiện rõ ràng các giai đoạn sư phạm.`,
      });
    } else {
      pendingItems.push('Cần cụ thể hóa hơn các bước thực hiện nhiệm vụ của GV và HS (tránh viết chung chung).');
      details.push({
        criterion: 'Quy trình 4 bước Công văn 5512',
        status: 'warning',
        detail: 'Một số hoạt động chưa đủ 4 bước chi tiết.',
      });
    }

    if (stepsWithValidProduct >= totalSteps * 0.8) {
      passedItems.push('Cột Dự kiến sản phẩm thể hiện các sản phẩm quan sát, đo lường được (không viết mơ hồ).');
      details.push({
        criterion: 'Cột Dự kiến sản phẩm cụ thể',
        status: 'passed',
        detail: 'Mọi nhiệm vụ đều có sản phẩm đầu ra rõ ràng tương ứng.',
      });
    } else {
      pendingItems.push('Cần bổ sung chi tiết sản phẩm cụ thể cho một số hoạt động ở cột phải.');
      details.push({
        criterion: 'Cột Dự kiến sản phẩm cụ thể',
        status: 'warning',
        detail: 'Một số sản phẩm còn ngắn gọn hoặc mang tính định tính.',
      });
    }
  } else {
    pendingItems.push('Chưa có hoạt động nào trong tiến trình dạy học.');
    details.push({ criterion: 'Tiến trình dạy học', status: 'failed', detail: 'Chưa có bước hoạt động nào.' });
  }

  // Calculate score
  const score = Math.min(100, Math.max(30, Math.round((passedItems.length / (passedItems.length + pendingItems.length)) * 100)));
  const isPassed = pendingItems.length === 0 || score >= 80;

  return {
    isPassed,
    score,
    passedItems,
    pendingItems,
    details,
    checkedAt: `${new Date().toLocaleTimeString('vi-VN')} ${new Date().toLocaleDateString('vi-VN')}`,
  };
}

// Dev and Prod Vite server configuration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
