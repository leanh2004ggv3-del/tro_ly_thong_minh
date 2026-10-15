export interface DigitalAiItem {
  id: string;
  code: string; // ví dụ: "NLS 2.5.TC2b" hoặc "NLAI 9.A3.1"
  category: 'NLS' | 'NLAI'; // Năng lực số hay Năng lực Trí tuệ nhân tạo
  grades: ('6' | '7' | '8' | '9')[];
  domain: string; // Miền năng lực
  title: string;
  description: string;
  behaviorIndicator: string; // Biểu hiện hành vi cụ thể
  pedagogicalApplication: string; // Gợi ý áp dụng trong HĐTN, HN
  colorHex: string; // Mã màu: Đỏ cho NLS (#C00000), Xanh cho NLAI (#0070C0)
  colorName: string; // "Đỏ" | "Xanh dương"
  legalBasis: string; // "TT 02/2024/TT-BGDĐT", "CV 2422/BGDĐT-GDTrH", "CV 3456/BGDĐT-GDTrH"
}

export const LEGAL_FRAMEWORKS = [
  {
    code: 'TT02',
    name: 'Thông tư số 02/2024/TT-BGDĐT',
    authority: 'Bộ Giáo dục và Đào tạo',
    summary: 'Quy định chuẩn năng lực số và định hướng tích hợp giáo dục công nghệ số trong chương trình GDPT.'
  },
  {
    code: 'CV 2422',
    name: 'Công văn 2422/BGDĐT-GDTrH',
    authority: 'Vụ Giáo dục Trung học - Bộ GDĐT',
    summary: 'Hướng dẫn thực hiện nhiệm vụ giáo dục trung học: đẩy mạnh chuyển đổi số, tích hợp giáo dục STEM và ứng dụng công nghệ/AI trong đổi mới phương pháp dạy học.'
  },
  {
    code: 'CV 3456',
    name: 'Công văn 3456/BGDĐT-GDTrH',
    authority: 'Bộ Giáo dục và Đào tạo',
    summary: 'Hướng dẫn triển khai thí điểm và tích hợp Năng lực số (NLS) cùng Trí tuệ nhân tạo (AI - NLAI) vào kế hoạch bài dạy các môn học và Hoạt động trải nghiệm, hướng nghiệp cấp THCS.'
  }
];

export const DIGITAL_AI_STANDARDS: DigitalAiItem[] = [
  // --- NĂNG LỰC SỐ (NLS) - MÀU ĐỎ (RED) - THEO TT02 & CV 3456 ---
  {
    id: 'nls-2.5-tc2b',
    code: 'NLS 2.5.TC2b',
    category: 'NLS',
    grades: ['8', '9'],
    domain: 'Miền 2: Khai thác thông tin & Đạo đức giao tiếp số',
    title: 'Thảo luận và áp dụng các chiến lược giao tiếp văn minh trên môi trường số',
    description: 'Học sinh biết nhận diện các tình huống xung đột hoặc khác biệt quan điểm trên mạng; thực hành nguyên tắc "Stop & Think" (Dừng lại và suy nghĩ) trước khi bình luận, thả biểu cảm hoặc chia sẻ hình ảnh của bạn bè.',
    behaviorIndicator: 'Dừng lại 3-5 giây suy ngẫm trước khi phản hồi; không công kích, không bình luận khiếm nhã về sự khác biệt của người khác trên mạng.',
    pedagogicalApplication: 'Áp dụng trong thảo luận tình huống tôn trọng sự khác biệt, phòng chống bạo lực mạng, xây dựng quy tắc ứng xử văn minh trong nhóm lớp.',
    colorHex: '#C00000',
    colorName: 'Đỏ',
    legalBasis: 'TT02 & CV 3456'
  },
  {
    id: 'nls-2.1-tc1b',
    code: 'NLS 2.1TC1b',
    category: 'NLS',
    grades: ['6', '7'],
    domain: 'Miền 2: Khai thác thông tin và dữ liệu số',
    title: 'Tìm kiếm và chọn lọc thông tin phục vụ học tập và hoạt động trải nghiệm',
    description: 'Biết sử dụng công cụ tìm kiếm trên Internet có định hướng để tra cứu các tài liệu, gương người tốt việc tốt hoặc truyền thống nhà trường.',
    behaviorIndicator: 'Sử dụng từ khóa chính xác, chọn lọc nguồn thông tin đáng tin cậy (trang web nhà trường, báo chí chính thống).',
    pedagogicalApplication: 'Áp dụng trong hoạt động tìm hiểu lịch sử trường, truyền thống quê hương, sưu tầm gương sáng kiên trì vượt khó.',
    colorHex: '#C00000',
    colorName: 'Đỏ',
    legalBasis: 'TT02 & CV 3456'
  },
  {
    id: 'nls-2.5-tc1a',
    code: 'NLS 2.5TC1a',
    category: 'NLS',
    grades: ['6', '7'],
    domain: 'Miền 2: Chuẩn mực hành vi & Giao tiếp số',
    title: 'Thực hiện chuẩn mực hành vi khi tương tác trực tuyến',
    description: 'Tuân thủ các quy tắc ứng xử cơ bản trong phòng học trực tuyến, nhóm Zalo/Teams lớp học; không spam tin nhắn, chào hỏi lễ phép.',
    behaviorIndicator: 'Dùng từ ngữ lịch sự, tôn trọng thời gian riêng của thầy cô và bạn bè khi nhắn tin trong nhóm lớp.',
    pedagogicalApplication: 'Áp dụng trong tiết Sinh hoạt lớp khi xây dựng "Nội quy tự quản và Bản cam kết văn hóa lớp học".',
    colorHex: '#C00000',
    colorName: 'Đỏ',
    legalBasis: 'TT02 & CV 3456'
  },
  {
    id: 'nls-3.2-tc2a',
    code: 'NLS 3.2TC2a',
    category: 'NLS',
    grades: ['7', '8', '9'],
    domain: 'Miền 3: Hợp tác và chia sẻ trong môi trường số',
    title: 'Sử dụng công cụ số để cộng tác nhóm hoàn thành nhiệm vụ trải nghiệm',
    description: 'Sử dụng bảng tương tác (Padlet, Google Jamboard, Canva) để cùng các bạn trong nhóm chia sẻ ý tưởng, hoàn thành poster hoặc sơ đồ tư duy.',
    behaviorIndicator: 'Tích cực đóng góp ý kiến vào bảng làm việc chung của nhóm; tôn trọng sản phẩm của bạn bè.',
    pedagogicalApplication: 'Áp dụng trong phần Thực hiện nhiệm vụ nhóm của Tiết 1 (SHDC tại lớp chia 6 nhóm) và Tiết 2 (HĐGD theo chủ đề).',
    colorHex: '#C00000',
    colorName: 'Đỏ',
    legalBasis: 'TT02 & CV 2422'
  },
  {
    id: 'nls-4.2-tc2a',
    code: 'NLS 4.2TC2a',
    category: 'NLS',
    grades: ['7', '8', '9'],
    domain: 'Miền 4: An toàn và bảo mật thông tin cá nhân',
    title: 'Bảo vệ dữ liệu riêng tư và phòng tránh rủi ro trên không gian mạng',
    description: 'Hiểu và thực hiện các biện pháp bảo vệ mật khẩu, thông tin cá nhân, hình ảnh riêng tư của bản thân và bạn bè; không tự ý đăng ảnh bạn bè khi chưa được phép.',
    behaviorIndicator: 'Hỏi ý kiến bạn bè trước khi đăng ảnh tập thể lên mạng xã hội; biết cách thiết lập quyền riêng tư cho tài khoản.',
    pedagogicalApplication: 'Áp dụng trong chủ đề Xây dựng tình bạn đẹp, Tôn trọng quyền riêng tư cá nhân và ứng xử văn hóa học đường.',
    colorHex: '#C00000',
    colorName: 'Đỏ',
    legalBasis: 'TT02 & CV 3456'
  },
  {
    id: 'nls-5.1-tc1b',
    code: 'NLS 5.1TC1b',
    category: 'NLS',
    grades: ['6', '7', '8', '9'],
    domain: 'Miền 5: Sáng tạo nội dung số',
    title: 'Thiết kế thông điệp truyền thông số về chủ đề trải nghiệm',
    description: 'Sử dụng phần mềm đơn giản để làm thiệp chúc mừng, thông điệp tri ân thầy cô, poster tuyên truyền phòng chống bắt nạt học đường.',
    behaviorIndicator: 'Tạo sản phẩm số có bố cục hài hòa, thông điệp tích cực, ghi rõ nguồn học liệu.',
    pedagogicalApplication: 'Sản phẩm dự kiến ở Hoạt động 4 (Vận dụng) hoặc phong trào thi đua tiết Sinh hoạt dưới cờ.',
    colorHex: '#C00000',
    colorName: 'Đỏ',
    legalBasis: 'CV 2422 & CV 3456'
  },

  // --- NĂNG LỰC TRÍ TUỆ NHÂN TẠO (NL AI) - MÀU XANH DƯƠNG (BLUE) - THEO CV 3456 & CV 2422 ---
  {
    id: 'nlai-6-a1.3',
    code: 'NLAI 6.A1.3',
    category: 'NLAI',
    grades: ['6'],
    domain: 'Nhận thức AI & Quyền quyết định của con người',
    title: 'Nhận biết AI là công cụ hỗ trợ và con người giữ quyền quyết định tối hậu',
    description: 'Học sinh nhận thức được các ứng dụng AI xung quanh (trợ lý ảo, nhận diện giọng nói, gợi ý video); hiểu rằng AI chỉ làm theo chỉ dẫn và con người luôn là người quyết định cuối cùng.',
    behaviorIndicator: 'Không lệ thuộc hoàn toàn vào kết quả gợi ý của máy tính; biết tự kiểm chứng và đưa ra ý kiến cá nhân.',
    pedagogicalApplication: 'Áp dụng trong chủ đề Thích ứng với môi trường học tập mới và rèn luyện tính tự chủ lớp 6.',
    colorHex: '#0070C0',
    colorName: 'Xanh dương',
    legalBasis: 'CV 3456 & CV 2422'
  },
  {
    id: 'nlai-7-a1.1',
    code: 'NLAI 7.A1.1',
    category: 'NLAI',
    grades: ['7'],
    domain: 'Sử dụng AI an toàn & Trách nhiệm học tập',
    title: 'Sử dụng công nghệ AI có trách nhiệm và giữ vững ý thức tự rèn luyện',
    description: 'Hiểu rằng việc lạm dụng AI để làm bài hộ sẽ làm thui chột tính kiên trì và khả năng tự suy nghĩ của bản thân; con người cần nỗ lực tự thân để phát triển phẩm chất chăm chỉ.',
    behaviorIndicator: 'Tự giác hoàn thành bài tập và nhiệm vụ rèn luyện; không sao chép nguyên văn nội dung do AI tạo ra.',
    pedagogicalApplication: 'Áp dụng trong Chủ đề rèn luyện tính kiên trì, sự chăm chỉ, vượt qua cám dỗ trì hoãn công nghệ.',
    colorHex: '#0070C0',
    colorName: 'Xanh dương',
    legalBasis: 'CV 3456 & CV 2422'
  },
  {
    id: 'nlai-8-a1.1',
    code: 'NLAI 8.A1.1',
    category: 'NLAI',
    grades: ['8'],
    domain: 'Đạo đức AI & Giá trị nhân văn của con người',
    title: 'Nhận thức ranh giới giữa AI và cảm xúc chân thật của con người',
    description: 'Hiểu rằng AI không có khả năng thấu cảm, không biết yêu thương hay sẻ chia; tình bạn, tình thầy trò và lòng nhân ái là giá trị độc quyền của con người cần gìn giữ.',
    behaviorIndicator: 'Thể hiện thái độ tôn trọng sự khác biệt, đồng cảm với nỗi buồn/niềm vui của bạn bè qua hành động trực tiếp.',
    pedagogicalApplication: 'Áp dụng trong chủ đề Xây dựng văn hóa ứng xử, phòng chống bạo lực học đường và xây dựng tình bạn.',
    colorHex: '#0070C0',
    colorName: 'Xanh dương',
    legalBasis: 'CV 3456 & CV 2422'
  },
  {
    id: 'nlai-9-a3.1',
    code: 'NLAI 9.A3.1',
    category: 'NLAI',
    grades: ['9'],
    domain: 'Kỹ năng thời đại AI & Tư duy phản biện',
    title: 'Phát triển các năng lực đặc quyền của con người trong thế giới có AI',
    description: 'Hiểu được rằng trong thế giới có AI, con người cần: Biết học cách học, phát triển tư duy phản biện, giữ vững tính sáng tạo độc bản, sự đồng cảm và năng lực giao tiếp trực tiếp chân thành. AI có thể sinh ra lời nói hay văn bản rất nhanh nhưng không thể thay thế sự tôn trọng và tình cảm giữa con người với nhau.',
    behaviorIndicator: 'Chủ động lắng nghe người khác; dùng tư duy phản biện để đánh giá thông tin; không dùng AI để chế giễu hay xúc phạm người khác.',
    pedagogicalApplication: 'Áp dụng trong chủ đề Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô; định hướng nghề nghiệp thời đại số.',
    colorHex: '#0070C0',
    colorName: 'Xanh dương',
    legalBasis: 'CV 3456 & CV 2422'
  },
  {
    id: 'nlai-9-a3.2',
    code: 'NLAI 9.A3.2',
    category: 'NLAI',
    grades: ['9'],
    domain: 'Định hướng nghề nghiệp & Thích ứng với chuyển đổi số',
    title: 'Nhận thức tác động của AI đối với các ngành nghề tương lai',
    description: 'Tìm hiểu xu hướng nghề nghiệp trong kỷ nguyên số; nhận biết các công việc có thể được tự động hóa và những năng lực người lao động cần trang bị (sáng tạo, giải quyết vấn đề phức tạp, đạo đức nghề nghiệp).',
    behaviorIndicator: 'Lập kế hoạch học tập cá nhân gắn liền với rèn luyện kỹ năng số và tư duy thích ứng nghề nghiệp.',
    pedagogicalApplication: 'Áp dụng trong mạch nội dung Hoạt động hướng nghiệp Lớp 9 (Chủ đề Khám phá nghề nghiệp tương lai).',
    colorHex: '#0070C0',
    colorName: 'Xanh dương',
    legalBasis: 'CV 3456 & TT02'
  }
];
