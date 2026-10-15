import { LessonPlan, GradeLevel } from '../types/lessonPlan';

export interface SamplePreset {
  grade: GradeLevel;
  topic: string;
  week: string;
  lessonTitle: string;
  duration: string;
  nlsCode: string;
  nlaiCode: string;
  nlsTargetActivities?: ('flagSalute' | 'topicActivity' | 'classMeeting')[];
  nlaiTargetActivities?: ('flagSalute' | 'topicActivity' | 'classMeeting')[];
  flagSaluteNotes: string;
  topicActivityNotes: string;
  classMeetingNotes: string;
}

export const CURRICULUM_PRESETS: SamplePreset[] = [
  {
    grade: '9',
    topic: 'CHỦ ĐỀ 1: EM VỚI NHÀ TRƯỜNG',
    week: 'Tuần 1',
    lessonTitle: 'Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô',
    duration: '3 tiết (1 tiết SHDC, 1 tiết HĐGD, 1 tiết SHL)',
    nlsCode: 'NLS 2.5.TC2b',
    nlaiCode: 'NLAI 9.A3.1',
    nlsTargetActivities: ['topicActivity', 'classMeeting'],
    nlaiTargetActivities: ['topicActivity'],
    flagSaluteNotes: 'Tiết 1: Sinh hoạt dưới cờ (Tổ chức tại lớp học). Chủ đề: Tham gia cuộc phát động phong trào thi đua "Xây dựng truyền thống nhà trường" (Do Giáo viên được phân công phụ trách điều hành tại phòng học, lớp chia 6 nhóm).',
    topicActivityNotes: 'Tiết 2: HĐGD theo chủ đề. Nội dung: Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô. Tích hợp NLS 2.5.TC2b (nguyên tắc Stop & Think trước khi bình luận trên mạng) và NLAI 9.A3.1 (sự đồng cảm, cảm xúc chân thật là năng lực đặc quyền của con người mà AI không thể thay thế).',
    classMeetingNotes: 'Tiết 3: Sinh hoạt lớp. Chủ đề: Xây dựng nội quy tự quản & Bản cam kết văn hóa lớp học 9 (gồm văn hóa ứng xử đời thực và môi trường số, không dùng AI chế giễu bạn bè, ký cam kết trên giấy A0).'
  },
  {
    grade: '6',
    topic: 'CHỦ ĐỀ 1: EM VỚI NHÀ TRƯỜNG VÀ BẠN BÈ MỚI',
    week: 'Tuần 1 - 2',
    lessonTitle: 'Khám phá môi trường học tập mới và thiết lập mối quan hệ bạn bè',
    duration: '3 tiết',
    nlsCode: 'NLS 2.1TC1b',
    nlaiCode: 'NLAI 6.A1.3',
    flagSaluteNotes: 'Tiết 1 SHDC tại lớp (GV bộ môn điều hành, chia 6 nhóm): Tìm hiểu truyền thống nhà trường THCS và nội quy học sinh.',
    topicActivityNotes: 'Tiết 2 HĐGD: Làm quen bạn mới, thích ứng với môi trường THCS. Tích hợp NLS 2.1TC1b (giao tiếp số an toàn) và NLAI 6.A1.3 (con người đưa ra quyết định cuối cùng khi dùng công cụ hỗ trợ).',
    classMeetingNotes: 'Tiết 3 SHL: Bầu ban cán sự lớp, xây dựng quy tắc ứng xử văn minh trong lớp học và nhóm mạng của lớp.'
  },
  {
    grade: '7',
    topic: 'CHỦ ĐỀ 2: RÈN LUYỆN TÍNH KIÊN TRÌ VÀ SỰ CHĂM CHỈ',
    week: 'Tuần 5 - 6',
    lessonTitle: 'Rèn luyện tính kiên trì và chăm chỉ trong học tập và đời sống',
    duration: '3 tiết',
    nlsCode: 'NLS 2.5TC1a',
    nlaiCode: 'NLAI 7.A1.1',
    flagSaluteNotes: 'Tiết 1 SHDC tại lớp (GV bộ môn điều hành, chia 6 nhóm): Tọa đàm tấm gương sáng vượt khó, phát động phong trào "Mỗi ngày một việc tốt".',
    topicActivityNotes: 'Tiết 2 HĐGD: Phân tích biểu hiện kiên trì, xử lý trì hoãn. Tích hợp NLS 2.5TC1a (chuẩn mực hành vi số) và NLAI 7.A1.1 (con người giữ quyền ra quyết định để đảm bảo công bằng).',
    classMeetingNotes: 'Tiết 3 SHL: Báo cáo tuần đầu thực hiện Nhật ký 21 ngày kiên trì, lập các cặp đôi bạn cùng tiến.'
  },
  {
    grade: '8',
    topic: 'CHỦ ĐỀ 4: TỰ HÀO TRUYỀN THỐNG QUÊ HƯƠNG VÀ VĂN HÓA ỨNG XỬ',
    week: 'Tuần 13 - 14',
    lessonTitle: 'Tôn vinh nét đẹp truyền thống và xây dựng văn hóa ứng xử văn minh',
    duration: '3 tiết',
    nlsCode: 'NLS 4.2TC2a',
    nlaiCode: 'NLAI 8.A1.1',
    flagSaluteNotes: 'Tiết 1 SHDC tại lớp (GV bộ môn điều hành, chia 6 nhóm): Giới thiệu danh lam thắng cảnh, di tích lịch sử quê hương.',
    topicActivityNotes: 'Tiết 2 HĐGD: Ứng xử văn hóa nơi công cộng và không gian mạng. Tích hợp NLS 4.2TC2a (bảo vệ dữ liệu cá nhân) và NLAI 8.A1.1 (AI không thể thay thế cảm xúc và trải nghiệm nhân văn của con người).',
    classMeetingNotes: 'Tiết 3 SHL: Trưng bày sản phẩm truyền thông số giới thiệu quê hương của 4 tổ và ký cam kết ứng xử văn minh.'
  }
];

export const DEFAULT_INITIAL_LESSON_PLAN: LessonPlan = {
  id: 'plan-thcs-tinhbien-lop9-chude1',
  grade: '9',
  schoolName: 'TRƯỜNG THCS TỊNH BIÊN',
  teacherName: 'Đặng Văn Sạch',
  departmentName: 'Tổ: Công nghệ - Hướng nghiệp',
  schoolYear: '2026 - 2027',
  semester: 'Học kỳ: I - Tuần 1',
  topic: 'CHỦ ĐỀ 1: EM VỚI NHÀ TRƯỜNG',
  week: 'Tuần 1',
  lessonTitle: 'Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô',
  duration: '3 tiết (Tiết 1: SHDC, Tiết 2: HĐGD, Tiết 3: SHL)',
  createdAt: new Date().toLocaleDateString('vi-VN'),
  updatedAt: new Date().toLocaleDateString('vi-VN'),

  // MỤC TIÊU CHUNG CỦA CHỦ ĐỀ 1
  generalTopicObjectives: {
    knowledge: [
      'Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô;',
      'Xây dựng kế hoạch tổ chức hoạt động phòng chống bắt nạt học đường;',
      'Xác định mục tiêu và xây dựng kế hoạch cho các buổi lao động công ích;',
      'Làm các sản phẩm đóng góp xây dựng truyền thống nhà trường.'
    ],
    qualities: [
      'Nhân ái, khoan dung, tôn trọng mọi người;',
      'Trách nhiệm thông qua các hoạt động phòng chống bắt nạt học đường và lao động công ích.'
    ],
    competencies: [
      'Thích ứng với cuộc sống; Thiết kế và tổ chức hoạt động;',
      'Tự chủ trong các mối quan hệ với bạn bè, thầy cô; Giao tiếp và hợp tác nhóm.'
    ]
  },

  // CHI TIẾT 3 TIẾT THEO CHUẨN MẪU TỊNH BIÊN
  periods: {
    flagSalute: {
      enabled: true,
      periodNumber: 1,
      periodType: 'flagSalute',
      title: 'TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)',
      subTitle: 'CHỦ ĐỀ: THAM GIA CUỘC PHÁT ĐỘNG PHONG TRÀO THI ĐUA "XÂY DỰNG TRUYỀN THỐNG NHÀ TRƯỜNG"',
      note: '(Do Giáo viên được phân công phụ trách điều hành tại phòng học)',
      objectives: {
        knowledge: [
          'Học sinh hiểu và thực hiện được các hoạt động làm sản phẩm đóng góp xây dựng truyền thống nhà trường, bồi đắp lòng tự hào về truyền thống trường học; Định hướng các hoạt động trải nghiệm trong Nội dung 1 của chủ đề.'
        ],
        competencies: [
          'Giao tiếp và hợp tác hiệu quả khi tham gia hoạt động chung trong không gian lớp học; Tự chủ trong các mối quan hệ với bạn bè, thầy cô;',
          'Năng lực công dân số khi tương tác tích cực trên các nền tảng truyền thông số của nhà trường.'
        ],
        qualities: [
          'Nhân ái, khoan dung, tôn trọng bạn bè và mọi người; Trách nhiệm đóng góp xây dựng môi trường học tập tích cực.'
        ]
      },
      equipment: {
        teacher: [
          'Máy tính, tivi/máy chiếu phòng học, loa lớp; Slide hình ảnh, video clip ngắn về truyền thống nhà trường; Kế hoạch phát động thi đua cấp lớp và bộ câu hỏi giao lưu.'
        ],
        students: [
          'SGK, SBT Hoạt động trải nghiệm, hướng nghiệp 9; Sổ ghi chép; Đội văn nghệ/Ban cán sự lớp chuẩn bị kịch bản điều hành theo sự phân công.'
        ]
      },
      steps: [
        {
          stepId: 'shdc-1',
          stepName: '1. Hoạt động Khởi động (Chào cờ tại lớp & Khai mạc - 5 phút)',
          objective: 'Tạo không khí trang nghiêm, phấn khởi, chuẩn bị tâm thế cho buổi sinh hoạt đầu năm học.',
          method: 'Phương pháp hoạt động tập thể, nghi thức Đội, trò chơi âm nhạc tương tác.',
          teacherStudentAction: `* Mục tiêu: Tạo không khí trang nghiêm, phấn khởi, chuẩn bị tâm thế cho buổi sinh hoạt đầu năm học.
* Phương pháp thực hiện: Phương pháp hoạt động tập thể, nghi thức Đội, trò chơi âm nhạc tương tác.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên phụ trách phổ biến nghi thức chào cờ tại phòng học và giới thiệu tiết mục văn nghệ khai mạc.
+ Lớp trưởng nhận nhiệm vụ điều hành toàn bộ học sinh trong lớp ổn định vị trí, chỉnh đốn trang phục.
- Bước 2: Thực hiện nhiệm vụ
+ Lớp trưởng điều hành lớp thực hiện Nghi lễ Chào cờ tại phòng học (Học sinh đứng nghiêm trang hướng về Quốc kỳ/ảnh Bác, hát Quốc ca).
+ Đội văn nghệ lớp biểu diễn 1 - 2 tiết mục văn nghệ chào mừng theo phân công.
+ Giáo viên phụ trách trình chiếu video clip ngắn (2 - 3 phút) giới thiệu truyền thống nhà trường.
- Bước 3: Báo cáo, thảo luận
+ Học sinh chia sẻ nhanh cảm xúc sau nghi lễ chào cờ và các tiết mục văn nghệ.
+ Cả lớp vỗ tay hưởng ứng không khí phấn khởi đầu tuần.
- Bước 4: Kết luận, nhận định
+ Giáo viên phụ trách biểu dương tinh thần nghiêm túc, trang trọng của học sinh toàn lớp trong nghi lễ chào cờ tại lớp.
+ Dẫn dắt vào nội dung tuyên bố lý do và chủ đề sinh hoạt dưới cờ.`,
          expectedProduct: `- Nghi lễ Chào cờ: Thực hiện trang nghiêm, đúng quy định tại lớp học.
- Bầu không khí: Học sinh hào hứng, trật tự, tập trung theo dõi các tiết mục văn nghệ và video truyền thống.`
        },
        {
          stepId: 'shdc-2',
          stepName: '2. Hoạt động Tuyên bố lý do, giới thiệu nội dung & Phân chia 6 nhóm (5 phút)',
          objective: 'Xác định rõ mục đích, nội dung buổi Sinh hoạt dưới cờ tại lớp và phân công nhiệm vụ 6 nhóm.',
          method: 'Phương pháp thuyết trình gợi mở, giao nhiệm vụ theo nhóm.',
          teacherStudentAction: `* Mục tiêu: Xác định rõ mục đích, nội dung buổi Sinh hoạt dưới cờ tại lớp và phân công nhiệm vụ 6 nhóm.
* Phương pháp thực hiện: Phương pháp thuyết trình gợi mở, giao nhiệm vụ theo nhóm.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ MC (Học sinh) tuyên bố lý do buổi sinh hoạt chủ đề "Tham gia cuộc phát động phong trào thi đua Xây dựng truyền thống nhà trường".
+ Giáo viên phụ trách chia lớp thành 6 nhóm học tập (mỗi nhóm 6 - 7 học sinh), phân công nhóm trưởng và thư ký.
+ Giáo viên giao phiếu nhiệm vụ cho từng nhóm.
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh nhanh chóng di chuyển về cụm bàn của 6 nhóm, cử nhóm trưởng điều hành và thư ký ghi chép.
+ Các nhóm kiểm tra tài liệu và tiếp nhận yêu cầu thảo luận từ giáo viên.
- Bước 3: Báo cáo, thảo luận
+ Đại diện 6 nhóm trưởng báo cáo tình hình chuẩn bị và tinh thần sẵn sàng của nhóm.
+ Lớp trưởng tổng hợp và báo cáo sĩ số, nề nếp với giáo viên phụ trách.
- Bước 4: Kết luận, nhận định
+ Giáo viên phụ trách ghi nhận sự khẩn trương, nghiêm túc của các nhóm.
+ Giáo viên chính thức phát động nội dung hoạt động thi đua của tiết học.`,
          expectedProduct: `- 6 nhóm học tập nhanh chóng ổn định với đầy đủ nhóm trưởng, thư ký.
- 100% học sinh nắm chắc tiến trình và các yêu cầu nội dung trọng tâm của buổi sinh hoạt dưới cờ tại lớp.`
        },
        {
          stepId: 'shdc-3',
          stepName: '3. Hoạt động Thực hiện chương trình chủ đề (Phát động thi đua & Giao lưu tại lớp - 23 phút)',
          objective: 'Quán triệt phong trào thi đua và giúp học sinh nâng cao hiểu biết về truyền thống nhà trường qua 6 nhóm.',
          method: 'Phương pháp thảo luận nhóm, trò chơi tương tác "Theo dòng lịch sử trường em", đàm thoại gợi mở.',
          teacherStudentAction: `* Mục tiêu: Quán triệt phong trào thi đua và giúp học sinh nâng cao hiểu biết về truyền thống nhà trường qua 6 nhóm.
* Phương pháp thực hiện: Phương pháp thảo luận nhóm, trò chơi tương tác "Theo dòng lịch sử trường em", đàm thoại gợi mở.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên phụ trách phát động thi đua cấp lớp: Cụ thể hóa kế hoạch thi đua của Đoàn/Đội thành các chỉ tiêu rèn luyện cho lớp 9.
+ Giáo viên giao nhiệm vụ trò chơi "Theo dòng lịch sử trường em" với bộ câu hỏi tương tác về truyền thống nhà trường.
+ Các nhóm nhận bảng phụ và chuẩn bị nội dung thảo luận cam kết thi đua.
- Bước 2: Thực hiện nhiệm vụ
+ 6 nhóm thảo luận sôi nổi, ghi các chỉ tiêu rèn luyện và giải pháp thực hiện lên bảng nhóm.
+ Học sinh các nhóm tích cực thảo luận và bấm chuông/giơ bảng trả lời các câu hỏi lịch sử nhà trường.
+ Giáo viên phụ trách di chuyển qua các nhóm quan sát, khích lệ và giải đáp thắc mắc.
- Bước 3: Báo cáo, thảo luận
+ Đại diện các nhóm lần lượt trình bày chỉ tiêu thi đua và câu trả lời giao lưu trước lớp.
+ Các nhóm khác lắng nghe, nhận xét chéo và bổ sung ý kiến phản biện tích cực.
+ Đại diện học sinh (Lớp trưởng/Bí thư) phát biểu hưởng ứng quyết tâm của chi đội khối 9.
- Bước 4: Kết luận, nhận định
+ Giáo viên phụ trách tổng kết các câu trả lời đúng, trao biểu trưng thi đua cho các nhóm xuất sắc.
+ Giáo viên chuẩn hóa mục tiêu thi đua, nhấn mạnh vai trò gương mẫu của học sinh khối 9 trong việc gìn giữ và phát huy truyền thống nhà trường.`,
          expectedProduct: `- Bảng chỉ tiêu thi đua hoàn thiện của 6 nhóm với cam kết nề nếp và học tập vững chắc.
- Học sinh trả lời xuất sắc các câu hỏi lịch sử nhà trường, khắc sâu niềm tự hào trường lớp.
- Bản phát biểu hưởng ứng đầy nhiệt huyết của đại diện học sinh khối 9.`
        },
        {
          stepId: 'shdc-4',
          stepName: '4. Hoạt động Đánh giá, tổng kết thi đua (7 phút)',
          objective: 'Đánh giá tinh thần, thái độ tham gia của học sinh toàn lớp trong giờ sinh hoạt.',
          method: 'Phương pháp đánh giá đồng đẳng, tự đánh giá, nhận xét sư phạm tích cực.',
          teacherStudentAction: `* Mục tiêu: Đánh giá tinh thần, thái độ tham gia của học sinh toàn lớp trong giờ sinh hoạt.
* Phương pháp thực hiện: Phương pháp đánh giá đồng đẳng, tự đánh giá, nhận xét sư phạm tích cực.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên phụ trách hướng dẫn các nhóm tự đánh giá và chấm điểm chéo theo thang điểm thi đua (Tốt - Khá - Đạt).
+ Ban cán sự lớp nhận phiếu tổng hợp điểm của 6 nhóm.
- Bước 2: Thực hiện nhiệm vụ
+ Các nhóm tiến hành hội ý nhanh trong 2 phút, tự chấm điểm tinh thần tham gia của các thành viên.
+ Thư ký các nhóm nộp kết quả về cho Ban cán sự lớp tổng hợp.
- Bước 3: Báo cáo, thảo luận
+ Lớp phó học tập công bố kết quả đánh giá thi đua của 6 nhóm trong tiết học.
+ Đại diện các nhóm phát biểu đồng thuận hoặc nêu ý kiến xây dựng.
- Bước 4: Kết luận, nhận định
+ Giáo viên phụ trách biểu dương các nhóm dẫn đầu và tuyên dương cá nhân tích cực giao lưu phát biểu.
+ Giáo viên chốt thông điệp cốt lõi: "Mỗi học sinh lớp 9 không chỉ là người tiếp nối mà còn là người trực tiếp viết nên những trang truyền thống mới cho nhà trường thông qua từng việc làm nhỏ hàng ngày."`,
          expectedProduct: `- Bảng tổng hợp thi đua tiết học được công bố rõ ràng, dân chủ, tạo không khí phấn khởi.
- Học sinh nhận thức sâu sắc thông điệp giáo dục truyền thống và trách nhiệm của bản thân.`
        },
        {
          stepId: 'shdc-5',
          stepName: '5. Hoạt động Dặn dò – Nhiệm vụ tiếp nối (5 phút)',
          objective: 'Định hướng nhiệm vụ rèn luyện và chuẩn bị cho các tiết học tiếp theo trong tuần.',
          method: 'Phương pháp giao nhiệm vụ, hướng dẫn tự học và chuẩn bị bài.',
          teacherStudentAction: `* Mục tiêu: Định hướng nhiệm vụ rèn luyện và chuẩn bị cho các tiết học tiếp theo trong tuần.
* Phương pháp thực hiện: Phương pháp giao nhiệm vụ, hướng dẫn tự học và chuẩn bị bài.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên phụ trách giao nhiệm vụ chuẩn bị cho Tiết 2 Hoạt động giáo dục theo chủ đề: Đọc trước nội dung "Tôn trọng sự khác biệt và sống hài hòa với các bạn, thầy cô" (SGK tr. 5, 6).
+ Giáo viên hướng dẫn các nhóm chuẩn bị tình huống thực tế đời sống và môi trường mạng.
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh lắng nghe, ghi chép nhiệm vụ dặn dò vào sổ tay/vở ghi Hoạt động trải nghiệm.
+ Ban cán sự lớp ghi nhận lịch phân công và các yêu cầu đồ dùng học tập.
- Bước 3: Báo cáo, thảo luận
+ Đại diện 1 - 2 học sinh nhắc lại các yêu cầu cần chuẩn bị cho Tiết 2 để cả lớp cùng ghi nhớ.
+ Cả lớp xác nhận đã nắm rõ nhiệm vụ.
- Bước 4: Kết luận, nhận định
+ Giáo viên phụ trách nhấn mạnh yêu cầu về tính chủ động và tinh thần hợp tác.
+ Giáo viên chúc cả lớp có một tuần học tập đạt nhiều thành tích tốt.`,
          expectedProduct: `- Nhiệm vụ học sinh: Nắm chắc công việc cần chuẩn bị tài liệu và tinh thần cho Tiết 2.`
        }
      ]
    },

    topicActivity: {
      enabled: true,
      periodNumber: 2,
      periodType: 'topicActivity',
      title: 'TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ',
      subTitle: 'NỘI DUNG: TÔN TRỌNG SỰ KHÁC BIỆT VÀ SỐNG HÀI HOÀ VỚI BẠN BÈ, THẦY CÔ',
      objectives: {
        knowledge: [
          'Học sinh nhận biết, tôn trọng sự khác biệt về sở thích, phong cách, cá tính và biết cách sống hài hòa với bạn bè, thầy cô; Biết ứng xử lịch sự, hòa nhã trong cuộc sống hàng ngày cũng như trên không gian mạng.'
        ],
        integratedCompetencies: {
          digital: {
            code: 'NLS 2.5.TC2b',
            title: 'Năng lực số (NLS 2.5.TC2b)',
            details: 'Thảo luận các chiến lược giao tiếp phù hợp trong môi trường số. Cụ thể: Học sinh thực hành nguyên tắc "dừng lại và suy nghĩ" (Stop & Think) trước khi bình luận về một hình ảnh hoặc bài viết của bạn có phong cách, sở thích khác mình trên mạng xã hội, đảm bảo ứng xử văn minh.'
          },
          ai: {
            code: 'NLAI 9.A3.1',
            title: 'Năng lực Trí tuệ nhân tạo (NLAI 9.A3.1)',
            details: 'Hiểu được rằng trong thế giới có AI, con người cần: Biết học cách học, phát triển tư duy phản biện, giữ vững tính sáng tạo và cảm xúc con người, nâng cao kỹ năng hợp tác và giao tiếp. Cụ thể: Học sinh nhận thức được rằng dù AI có thể hỗ trợ giao tiếp, nhưng sự đồng cảm, khả năng chấp nhận cá tính riêng và cảm xúc chân thật để sống hài hòa với thầy cô, bạn bè là năng lực đặc quyền của con người cần được trau dồi.'
          }
        },
        qualities: [
          'Bồi dưỡng lòng nhân ái, sự khoan dung, tôn trọng cá tính riêng của bạn bè và thầy cô.'
        ]
      },
      equipment: {
        teacher: [
          'Máy tính, máy chiếu, bảng phụ, các thẻ tình huống thảo luận (kết hợp bối cảnh đời thực, mạng xã hội và công cụ AI).'
        ],
        students: [
          'Sách giáo khoa Hoạt động trải nghiệm 9, giấy A0/A4, bút màu.'
        ]
      },
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
+ Đại diện 2 - 3 học sinh phát biểu tự do suy nghĩ về phản ứng của bản thân trước các sở thích, phong cách độc đáo của bạn bè.
+ Cả lớp lắng nghe, trao đổi ngắn về các ý kiến chia sẻ.
- Bước 4: Kết luận, nhận định
+ Giáo viên khen ngợi các câu trả lời chân thành, tích cực của học sinh.
+ Giáo viên dẫn dắt vào bài mới: Sự khác biệt làm nên sự đa dạng của cuộc sống. Hôm nay chúng ta sẽ cùng tìm hiểu cách tôn trọng sự khác biệt cả trong đời thực lẫn trên môi trường số và thời đại AI.`,
          expectedProduct: `- Học sinh hào hứng quan sát các hình ảnh bài đăng trên mạng xã hội.
- Học sinh tự do phát biểu suy nghĩ cá nhân về cách phản ứng khi gặp sở thích, phong cách độc đáo của bạn bè.
- Tạo tâm thế cởi mở, sẵn sàng tiếp nhận bài học về tôn trọng sự khác biệt.`
        },
        {
          stepId: 'hdgd-2',
          stepName: '2. Hoạt động 2: Khám phá – Thảo luận tình huống tôn trọng sự khác biệt (15 phút)',
          objective: 'Học sinh phân tích các hành vi ứng xử với sự khác biệt, thực hành kỹ năng giao tiếp số văn minh và nhận thức vai trò đặc quyền của cảm xúc con người.',
          method: 'Phương pháp nghiên cứu trường hợp (tình huống), thảo luận nhóm, giải quyết vấn đề.',
          teacherStudentAction: `* Mục tiêu: Học sinh phân tích các hành vi ứng xử với sự khác biệt, thực hành kỹ năng giao tiếp số văn minh và nhận thức vai trò đặc quyền của cảm xúc con người.
* Phương pháp thực hiện: Phương pháp nghiên cứu trường hợp (tình huống), thảo luận nhóm, giải quyết vấn đề.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên chia lớp thành 4 nhóm (hoặc 6 nhóm), phát Phiếu học tập số 1 và giao 2 tình huống mở rộng:
Tình huống 1: Bạn Vân thích hát dân ca và chầu văn. Vân quay video bài hát của mình và đăng lên trang cá nhân. Một số bạn trong lớp vào thả biểu cảm giễu cợt và bình luận rằng Vân "lạc hậu, kỳ dị".
Tình huống 2: Cô Hải dạy thay thầy Hùng môn KHTN với phong cách giảng dạy hoàn toàn mới. Một số bạn trong lớp đã dùng công cụ AI tạo bài viết châm biếm phong cách của cô rồi chia sẻ vào nhóm chat chung của lớp.
+ Giáo viên nêu yêu cầu thảo luận trong 7 phút: Nhận xét hành vi của các bạn và đề xuất cách ứng xử phù hợp.
- Bước 2: Thực hiện nhiệm vụ
+ Các nhóm tiến hành thảo luận sôi nổi, nhóm trưởng điều hành, thư ký ghi chép ý kiến vào bảng phụ/phiếu A3.
+ Giáo viên di chuyển quan sát, hướng dẫn các nhóm phân tích sâu hành vi văn hóa mạng và vai trò của cảm xúc.
[NLS] - Tích hợp NLS 2.5.TC2b: Giáo viên hướng dẫn học sinh phân tích Tình huống 1 dưới góc độ ứng xử trên mạng. Học sinh thảo luận và chốt lại nguyên tắc "Dừng lại và suy nghĩ" (Stop & Think) trước khi gõ bất kỳ bình luận hay thả biểu cảm nào dưới bài viết của bạn có sở thích khác mình. Rèn luyện thói quen tự đặt câu hỏi: "Lời bình luận này có xúc phạm bạn không?", "Nếu là mình thì mình cảm thấy thế nào?" để đảm bảo ứng xử văn minh trên môi trường số.
[NLAI] - Tích hợp NLAI 9.A3.1: Giáo viên gợi mở ở Tình huống 2: "AI có thể tạo ra văn bản hay hình ảnh châm biếm rất nhanh, nhưng AI có biết đau lòng hay biết thương cảm không?" Từ đó, học sinh thảo luận và nhận thức rằng: AI chỉ là công cụ vô cảm, còn sự đồng cảm, khả năng thấu hiểu, chấp nhận phong cách riêng của thầy cô/bạn bè và cảm xúc chân thật là năng lực đặc quyền của con người, giúp chúng ta xây dựng mối quan hệ chân thành và sống hài hòa với nhau.
- Bước 3: Báo cáo, thảo luận
+ Đại diện Nhóm 1 và Nhóm 3 lên bảng trình bày kết quả phân tích Tình huống 1 và Tình huống 2.
+ Nhóm 2 và Nhóm 4 lắng nghe, nhận xét chéo và đặt câu hỏi phản biện.
- Bước 4: Kết luận, nhận định
+ Giáo viên nhận xét, chuẩn hóa kiến thức trên slide: Việc giễu cợt sở thích là thiếu văn minh; dùng AI châm biếm là thiếu tôn trọng.
+ Học sinh tiếp thu, ghi nhớ bài học về sự đồng cảm và nguyên tắc Stop & Think vào vở.`,
          expectedProduct: `- Phân tích Tình huống 1: Việc giễu cợt sở thích cá nhân của Vân là hành vi thiếu văn minh. Cần tôn trọng nét đẹp đam mê của bạn.
- Phân tích Tình huống 2: Dùng AI chế giễu cô giáo là thiếu tôn trọng. Cần cởi mở, hợp tác và đón nhận phong cách dạy học mới của thầy cô.
[NLS] - Tích hợp NLS: Nắm vững và cam kết thực hiện quy tắc "Stop & Think" trước khi tương tác trên không gian mạng.
[NLAI] - Tích hợp NLAI: Nhận thức rõ ràng AI không có cảm xúc; con người cần phát huy sự đồng cảm chân thành để gắn kết.`
        },
        {
          stepId: 'hdgd-3',
          stepName: '3. Hoạt động 3: Luyện tập – Sắm vai xử lý tình huống (15 phút)',
          objective: 'Học sinh thực hành nguyên tắc giao tiếp số văn minh và thể hiện năng lực đồng cảm, tôn trọng cá tính riêng thông qua sắm vai.',
          method: 'Phương pháp sắm vai (đóng kịch tình huống), luyện tập thực hành, phản hồi tích cực.',
          teacherStudentAction: `* Mục tiêu: Học sinh thực hành nguyên tắc giao tiếp số văn minh và thể hiện năng lực đồng cảm, tôn trọng cá tính riêng thông qua sắm vai.
* Phương pháp thực hiện: Phương pháp sắm vai (đóng kịch tình huống), luyện tập thực hành, phản hồi tích cực.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên phân công nhiệm vụ sắm vai xử lý tình huống thực tế cho các nhóm:
Nhóm 1 & 2: Sắm vai xử lý Tình huống 1 (Một nhóm bạn định vào bình luận chê bai video hát chầu văn của Vân, nhưng một bạn đã nhắc nhở áp dụng nguyên tắc "Dừng lại và suy nghĩ" để viết lời động viên văn minh).
Nhóm 3 & 4: Sắm vai xử lý Tình huống 2 (Một nhóm bạn lơ là giờ học của cô Hải và dùng AI tạo tin nhắn trêu đùa, nhưng lớp trưởng đã đứng ra nhắc nhở về sự chân thành, biết ơn và tư duy phản biện để thích nghi với phong cách dạy mới của cô).
+ Các nhóm chuẩn bị kịch bản ngắn trong 4 phút.
- Bước 2: Thực hiện nhiệm vụ
+ Các nhóm phân công vai diễn, tập luyện biểu cảm và lời thoại.
+ Giáo viên theo dõi, hướng dẫn cách thể hiện hành vi văn minh và cảm xúc chân thật.
- Bước 3: Báo cáo, thảo luận
+ Đại diện các nhóm lên sân khấu lớp trình diễn tiểu phẩm (3 phút/nhóm).
[NLS] - Tích hợp NLS 2.5.TC2b: Học sinh thể hiện rõ hành động dừng lại 3 giây trước màn hình điện thoại, xóa dòng bình luận tiêu cực và thay bằng lời khen ngợi sự tự tin và nét đẹp truyền thống trong bài hát của bạn Vân.
[NLAI] - Tích hợp NLAI 9.A3.1: Nhân vật trong vai đóng thoại nhấn mạnh: "Công nghệ AI có thể giúp chúng ta tìm kiếm thông tin nhanh chóng, nhưng nó không thể thay thế được sự tôn trọng và tình cảm chân thành mà học sinh dành cho thầy cô. Hãy lắng nghe cô bằng sự đồng cảm của con người!"
+ Cả lớp theo dõi, vỗ tay cổ vũ và nhận xét theo tiêu chí rubric.
- Bước 4: Kết luận, nhận định
+ Giáo viên đánh giá phần thể hiện sáng tạo, sâu sắc của các nhóm.
+ Chốt lại kỹ năng ứng xử tôn trọng sự khác biệt trong đời sống hàng ngày.`,
          expectedProduct: `- Kịch bản đóng vai sinh động, chân thực, xử lý khéo léo các tình huống ứng xử.
[NLS] - Học sinh thực hành thành thạo thói quen "Stop & Think" trên điện thoại/mạng xã hội.
[NLAI] - Thể hiện được thái độ kính trọng thầy cô, yêu thương bạn bè thông qua cảm xúc chân thành của con người.`
        },
        {
          stepId: 'hdgd-4',
          stepName: '4. Hoạt động 4: Vận dụng & Cam kết hành động (10 phút)',
          objective: 'Củng cố bài học và đưa ra thông điệp cam kết hành động cụ thể tại trường lớp và gia đình.',
          method: 'Phương pháp dạy học dự án vi mô, viết cam kết hành động cá nhân.',
          teacherStudentAction: `* Mục tiêu: Củng cố bài học và đưa ra thông điệp cam kết hành động cụ thể tại trường lớp và gia đình.
* Phương pháp thực hiện: Phương pháp dạy học dự án vi mô, viết cam kết hành động cá nhân.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên phát giấy nhớ (stick-note) cho 100% học sinh trong lớp.
+ Yêu cầu mỗi học sinh viết 01 thông điệp ngắn cam kết hành động: "Tôn trọng sự khác biệt – Kết nối bằng trái tim chân thành" để dán lên "Cây văn hóa lớp học".
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh suy ngẫm độc lập, viết thông điệp cam kết của bản thân trong 3 phút.
+ Giáo viên quan sát, khích lệ sự chân thành và quyết tâm của từng học sinh.
- Bước 3: Báo cáo, thảo luận
+ Lần lượt từng dãy bàn lên dán thông điệp lên "Cây văn hóa lớp học" tại góc bảng tin.
+ Giáo viên mời 2 - 3 học sinh đọc to thông điệp cam kết trước lớp.
- Bước 4: Kết luận, nhận định
+ Giáo viên tổng kết toàn bộ nội dung tiết học, tuyên dương tinh thần học tập tích cực.
[NLS] & [NLAI] - Chốt lại 2 thông điệp: Luôn thực hành "Stop & Think" trên mạng xã hội; Làm chủ công nghệ và phát huy sự đồng cảm của con người.
+ Dặn dò học sinh chuẩn bị bài cho tiết Sinh hoạt lớp cuối tuần.`,
          expectedProduct: `- 100% học sinh hoàn thành thông điệp cam kết hành động cá nhân dán lên "Cây văn hóa lớp học".
[NLS] & [NLAI] - Học sinh ghi nhớ và thẩm thấu hai quy tắc cốt lõi về Năng lực số và Năng lực AI trong đời sống.`
        }
      ]
    },

    classMeeting: {
      enabled: true,
      periodNumber: 3,
      periodType: 'classMeeting',
      title: 'TIẾT 3: SINH HOẠT LỚP',
      subTitle: 'CHỦ ĐỀ: XÂY DỰNG NỘI QUY TỰ QUẢN & BẢN CAM KẾT VĂN HÓA LỚP HỌC 9',
      objectives: {
        competencies: [
          'Năng lực giao tiếp và hợp tác: Học sinh biết cách thảo luận nhóm, lắng nghe ý kiến của bạn và mạnh dạn trình bày quan điểm cá nhân để xây dựng tập thể;',
          'Năng lực tự quản và ứng xử văn minh trên không gian mạng và các nhóm hội thảo trực tuyến của lớp.'
        ],
        qualities: [
          'Trách nhiệm: Tự giác chấp hành và giám sát việc thực hiện nội quy lớp học; Tôn trọng sự khác biệt và giữ gìn tình bạn đoàn kết.'
        ]
      },
      equipment: {
        teacher: [
          'Bản cam kết văn hóa lớp học in trên khổ giấy A0, bút dạ, bảng nhóm, máy chiếu.'
        ],
        students: [
          'Sổ tay, bút, suy nghĩ trước về các điều khoản nội quy tự quản lớp học và văn hóa ứng xử số.'
        ]
      },
      steps: [
        {
          stepId: 'shl-1',
          stepName: '1. Hoạt động Khởi động (5 phút)',
          objective: 'Tạo không khí vui vẻ, gắn kết, dẫn dắt vào nội dung tiết sinh hoạt lớp.',
          method: 'Phương pháp trò chơi tương tác "Tôi cần, tôi cần", trình chiếu trực quan.',
          teacherStudentAction: `* Mục tiêu: Tạo không khí vui vẻ, gắn kết, dẫn dắt vào nội dung tiết sinh hoạt lớp.
* Phương pháp thực hiện: Phương pháp trò chơi tương tác "Tôi cần, tôi cần", trình chiếu trực quan.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Ban Văn nghệ và Lớp trưởng điều hành trò chơi tương tác "Tôi cần, tôi cần" để khởi động tiết học.
+ Giáo viên chủ nhiệm trình chiếu đoạn clip/hình ảnh ngắn về tập thể lớp học đoàn kết, nề nếp tốt.
- Bước 2: Thực hiện nhiệm vụ
+ Toàn thể học sinh trong lớp hào hứng tham gia phản ứng nhanh theo hiệu lệnh trò chơi.
+ Học sinh chú ý quan sát hình ảnh/video clip và cảm nhận thông điệp về sự gắn bó tập thể.
- Bước 3: Báo cáo, thảo luận
+ Học sinh chia sẻ nhanh niềm vui, giải tỏa áp lực học tập và cảm nghĩ về hình ảnh lớp học gương mẫu.
+ Cả lớp vỗ tay khởi động tinh thần làm việc tích cực.
- Bước 4: Kết luận, nhận định
+ Giáo viên chủ nhiệm nhận xét sự sôi nổi của lớp và dẫn dắt: "Để tập thể chúng ta luôn vững mạnh, tôn trọng lẫn nhau cả đời thực lẫn trên mạng, hôm nay chúng ta sẽ cùng nhau tự tay xây dựng Nội quy tự quản và Bản cam kết văn hóa cho lớp 9A2."`,
          expectedProduct: `- Tạo tâm thế hào hứng, cởi mở, gắn kết 100% học sinh trong lớp học.
- Học sinh sẵn sàng tiếp nhận nhiệm vụ xây dựng văn hóa tập thể.`
        },
        {
          stepId: 'shl-2',
          stepName: '2. Hoạt động Học sinh chia sẻ kết quả vận dụng trong nhóm (10 phút)',
          objective: 'Học sinh phản hồi, đánh giá lại những thói quen nề nếp thực tế đã quan sát/thực hiện thời gian qua, từ đó chắt lọc thành quy tắc.',
          method: 'Phương pháp thảo luận nhóm theo tổ, kỹ thuật ghi bảng phụ/phiếu A0.',
          teacherStudentAction: `* Mục tiêu: Học sinh phản hồi, đánh giá lại những thói quen nề nếp thực tế đã quan sát/thực hiện thời gian qua, từ đó chắt lọc thành quy tắc.
* Phương pháp thực hiện: Phương pháp thảo luận nhóm theo tổ, kỹ thuật ghi bảng phụ/phiếu A0.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên chia lớp thành 4 nhóm (theo 4 tổ), phát cho mỗi nhóm 1 tờ giấy A0 và bút dạ.
+ Giáo viên giao nhiệm vụ trong 7 phút: Thảo luận và viết ra:
  * 03 điều cần KHUYẾN KHÍCH làm (Văn hóa ứng xử: Tôn trọng sự khác biệt, áp dụng quy tắc Stop & Think khi tương tác trực tuyến, giúp đỡ nhau học tập...).
  * 03 điều NGHIÊM CẤM (Nội quy kỷ luật: Không nói tục, không trễ giờ, không dùng AI hay công cụ số để bôi nhọ, châm biếm bạn bè và thầy cô...).
- Bước 2: Thực hiện nhiệm vụ
+ Các tổ trưởng điều hành thảo luận sôi nổi, các thành viên trong tổ lần lượt nêu ý kiến.
+ Thư ký các tổ tổng hợp, chọn lọc và ghi 3 điều khuyến khích, 3 điều nghiêm cấm lên giấy A0.
+ Giáo viên chủ nhiệm quan sát, gợi mở và hỗ trợ các nhóm đưa ra quy tắc mang tính giáo dục thực chất.
- Bước 3: Báo cáo, thảo luận
+ Các tổ dán sản phẩm giấy A0 lên bảng lớp theo thứ tự Tổ 1, 2, 3, 4.
+ Thành viên các tổ quan sát sản phẩm của nhóm bạn.
- Bước 4: Kết luận, nhận định
+ Giáo viên chủ nhiệm ghi nhận tinh thần thảo luận trung thực, nghiêm túc và trách nhiệm của cả 4 tổ.
+ Chuyển giao sang phần báo cáo chi tiết trước lớp.`,
          expectedProduct: `- 04 bản ghi chép hoàn chỉnh 3 điều khuyến khích và 3 điều nghiêm cấm của 4 tổ.
- Học sinh thể hiện rõ trách nhiệm cá nhân đối với nề nếp và kỷ luật tập thể.`
        },
        {
          stepId: 'shl-3',
          stepName: '3. Hoạt động Đại diện các nhóm chia sẻ trước lớp (10 phút)',
          objective: 'Rèn luyện kĩ năng thuyết trình, tổng hợp ý kiến từ các nhóm và lắng nghe phản hồi.',
          method: 'Phương pháp thuyết trình, đàm thoại, phản biện tích cực.',
          teacherStudentAction: `* Mục tiêu: Rèn luyện kĩ năng thuyết trình, tổng hợp ý kiến từ các nhóm và lắng nghe phản hồi.
* Phương pháp thực hiện: Phương pháp thuyết trình, đàm thoại, phản biện tích cực.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Lớp trưởng điều hành: Mời lần lượt đại diện của 4 tổ lên trình bày đề xuất quy tắc của tổ mình (2 phút/tổ).
+ Yêu cầu các tổ khác lắng nghe, ghi chú lại các điểm tương đồng và các điều khoản cần góp ý.
- Bước 2: Thực hiện nhiệm vụ
+ Đại diện Tổ 1, Tổ 2, Tổ 3, Tổ 4 lần lượt thuyết trình tự tin trước lớp, giải thích ngắn gọn lý do chọn các điều khoản dựa trên thực tế lớp học.
+ Học sinh cả lớp chú ý theo dõi và chuẩn bị câu hỏi góp ý.
- Bước 3: Báo cáo, thảo luận
+ Các tổ đặt câu hỏi chất vấn, góp ý điều chỉnh từ ngữ cho các điều khoản để đảm bảo tính khả thi và văn minh.
+ Đại diện các tổ tiếp thu ý kiến đóng góp và giải trình rõ ràng.
- Bước 4: Kết luận, nhận định
+ Giáo viên chủ nhiệm đánh giá cao sự chuẩn bị chu đáo và khả năng diễn đạt lưu loát của đại diện các tổ.
+ Định hướng tổng hợp các ý kiến thành một bộ quy chuẩn chung nhất của lớp.`,
          expectedProduct: `- 04 bài trình bày ngắn gọn, súc tích và các câu hỏi thảo luận, phản biện của các nhóm.
- Thống nhất các ý kiến tương đồng về văn hóa ứng xử và kỷ luật nề nếp.`
        },
        {
          stepId: 'shl-4',
          stepName: '4. Hoạt động Thảo luận, nhận xét và thống nhất (10 phút)',
          objective: 'Phản biện dân chủ, đi đến thống nhất chung về Nội quy tự quản và Bản cam kết văn hóa lớp học.',
          method: 'Phương pháp đàm thoại gợi mở, giải quyết vấn đề, biểu quyết dân chủ.',
          teacherStudentAction: `* Mục tiêu: Phản biện dân chủ, đi đến thống nhất chung về Nội quy tự quản và Bản cam kết văn hóa lớp học.
* Phương pháp thực hiện: Phương pháp đàm thoại gợi mở, giải quyết vấn đề, biểu quyết dân chủ.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên chủ nhiệm cùng Ban cán sự lớp điều phối tổng hợp, gộp những ý kiến trùng nhau của 4 tổ.
+ Đưa ra thảo luận các hình thức khen thưởng và biện pháp hỗ trợ tích cực (như tưới cây, hỗ trợ trực nhật thay cho hình thức xử phạt tiêu cực).
- Bước 2: Thực hiện nhiệm vụ
+ Toàn bộ học sinh trong lớp lắng nghe, trao đổi thẳng thắn và biểu quyết giơ tay thông qua từng điều khoản.
+ Lớp trưởng ghi chép lại các điều khoản được 100% học sinh tán thành lên bảng lớp.
- Bước 3: Báo cáo, thảo luận
+ Lớp trưởng đọc lại dự thảo 5 điều cốt lõi của "Bản cam kết văn hóa lớp học".
+ Cả lớp thống nhất cao độ và không còn ý kiến băn khoăn.
- Bước 4: Kết luận, nhận định
+ Giáo viên chủ nhiệm nhận xét quá trình làm việc dân chủ, công bằng của lớp.
+ Chuẩn hóa 5 điều cốt lõi của Bản cam kết văn hóa lớp học cả ở đời thực lẫn trên môi trường số.`,
          expectedProduct: `- Bảng "Nội quy tự quản & Văn hóa ứng xử Lớp 9A2" thống nhất 100% với 5 điều cốt lõi.
- Học sinh tự giác cam kết chấp hành với tinh thần trách nhiệm cao.`
        },
        {
          stepId: 'shl-5',
          stepName: '5. Hoạt động Đánh giá chủ đề, ký Bản cam kết văn hóa lớp học khổ A0 & Dặn dò (10 phút)',
          objective: 'Chính thức hóa nội quy, tăng tính cam kết và trách nhiệm cá nhân; đánh giá và dặn dò nhiệm vụ tuần tới.',
          method: 'Phương pháp ký cam kết tập thể, nghi thức cam kết, dặn dò sư phạm.',
          teacherStudentAction: `* Mục tiêu: Chính thức hóa nội quy, tăng tính cam kết và trách nhiệm cá nhân; đánh giá và dặn dò nhiệm vụ tuần tới.
* Phương pháp thực hiện: Phương pháp ký cam kết tập thể, nghi thức cam kết, dặn dò sư phạm.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên chủ nhiệm cùng Ban cán sự lớp trang trọng trải BẢN CAM KẾT VĂN HÓA LỚP HỌC in sẵn trên khổ giấy A0 tại bàn trung tâm lớp.
+ Lớp trưởng phổ biến nghi thức ký tên/in dấu vân tay cam kết.
- Bước 2: Thực hiện nhiệm vụ
+ Lớp trưởng đọc to nội dung toàn văn 5 điều khoản Bản cam kết văn hóa lớp học.
+ Lần lượt từng học sinh theo tổ trật tự bước lên ký tên/in dấu vân tay màu vào bản cam kết khổ A0.
+ Giáo viên chủ nhiệm ký tên xác nhận ở vị trí trang trọng tại trung tâm bản cam kết.
- Bước 3: Báo cáo, thảo luận
+ Ban cán sự lớp cùng Giáo viên chủ nhiệm giơ cao Bản cam kết đã hoàn tất chữ ký trước toàn thể lớp học.
+ Cả lớp vỗ tay thể hiện sự quyết tâm thực hiện nghiêm túc trong suốt năm học.
- Bước 4: Kết luận, nhận định
+ Giáo viên chủ nhiệm tổng kết tiết sinh hoạt lớp, biểu dương tinh thần trách nhiệm của toàn thể học sinh.
+ Dặn dò Ban cán sự lớp treo bản cam kết khổ A0 ở vị trí trang trọng nhất trên bảng tin lớp học để theo dõi, thực hiện hằng ngày.`,
          expectedProduct: `- Bản cam kết văn hóa lớp học khổ A0 có đầy đủ chữ ký/dấu vân tay của toàn thể học sinh và GVCN.
- Học sinh ghi nhớ sâu sắc các cam kết rèn luyện và chuẩn bị tốt cho tuần học mới.`
        }
      ]
    }
  },

  // Backward compatible references
  objectives: {
    knowledge: [
      'Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô;',
      'Xây dựng kế hoạch tổ chức hoạt động phòng chống bắt nạt học đường;'
    ],
    competencies: {
      general: ['Tự chủ và tự học', 'Giao tiếp và hợp tác', 'Giải quyết vấn đề và sáng tạo'],
      specific: ['Thích ứng với cuộc sống', 'Thiết kế và tổ chức hoạt động'],
      manifestations: ['Tôn trọng sự khác biệt', 'Ứng dụng nguyên tắc Stop & Think']
    },
    qualities: {
      items: ['Nhân ái', 'Trách nhiệm', 'Chăm chỉ'],
      manifestations: ['Khoan dung, giúp đỡ bạn bè', 'Chấp hành nghiêm túc nội quy']
    }
  },
  equipment: {
    teacher: ['Máy tính, máy chiếu, bảng phụ, kế hoạch bài dạy'],
    students: ['SGK, vở ghi, giấy A0/A4, bút màu']
  },
  activities: {},
  evaluationNotes: '• Đánh giá thường xuyên quá trình tham gia hoạt động nhóm và tinh thần ứng xử văn minh trên môi trường số.\n• Khen thưởng các tấm gương tích cực, nhắc nhở kịp thời hành vi vi phạm đạo đức số.',

  validationReport: {
    isPassed: true,
    score: 100,
    passedItems: [
      'Bám sát 100% cấu trúc mẫu giáo án THCS Tịnh Biên theo GDPT 2018.',
      'Đầy đủ thông tin: Trường, Giáo viên, Tổ, Năm học, Học kỳ, Tuần.',
      'Có đầy đủ phần MỤC TIÊU CHUNG CỦA CHỦ ĐỀ (Kiến thức, Phẩm chất, Năng lực).',
      'Tiết 1: Sinh hoạt dưới cờ (Tổ chức tại lớp học, do GV bộ môn điều hành, chia nhóm rõ ràng).',
      'Tiết 2: Hoạt động giáo dục theo chủ đề - Tích hợp Năng lực số (NLS 2.5.TC2b - tô màu đỏ) và Năng lực AI (NLAI 9.A3.1 - tô màu xanh dương) theo đúng TT 02/2025, CV 3456 và QĐ 2422.',
      'Tiến trình dạy học bảng 2 cột thể hiện rõ nét các hoạt động tích hợp NLS (đỏ) và NLAI (xanh).',
      'Tiết 3: Sinh hoạt lớp - Xây dựng nội quy tự quản & Bản cam kết văn hóa lớp học gồm ứng xử đời thực và môi trường số.'
    ],
    pendingItems: [],
    details: [
      { criterion: 'Cấu trúc mẫu chuẩn THCS Tịnh Biên', status: 'passed', detail: 'Đầy đủ các phần I, II, III cho từng tiết học và Mục tiêu chung của chủ đề.' },
      { criterion: 'Tích hợp Năng lực số (TT 02 & CV 3456)', status: 'passed', detail: 'Mã NLS 2.5.TC2b tô màu đỏ chuẩn mực.' },
      { criterion: 'Tích hợp Năng lực AI (QĐ 2422)', status: 'passed', detail: 'Mã NLAI 9.A3.1 tô màu xanh dương chuẩn mực.' },
      { criterion: 'Tiến trình bảng 2 cột GV-HS & Sản phẩm', status: 'passed', detail: '100% các bước đều hiển thị bảng 2 cột song song.' }
    ],
    checkedAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
  }
};
