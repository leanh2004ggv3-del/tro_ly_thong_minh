// BẢNG TRA CỨU KHUNG NĂNG LỰC SỐ (TT 02/2025/TT-BGDĐT & CV 3456/BGDĐT-GDPT)
// VÀ KHUNG GIÁO DỤC TRÍ TUỆ NHÂN TẠO (QĐ 2422/QĐ-BGDĐT)

export interface DigitalCompetencyItem {
  code: string;
  domain: string; // Miền năng lực
  subDomain: string; // Năng lực thành phần
  description: string;
  applicableGrades: string; // '6-7' | '8-9' | 'all'
}

export interface AiCompetencyItem {
  code: string; // ví dụ: 6.A1.1, 7.B2.1, 8.C1.1, 9.A3.1
  grade: '6' | '7' | '8' | '9';
  domain: string; // Mạch nội dung: A (Tư duy lấy con người làm trung tâm), B (Đạo đức AI), C (Kĩ thuật và ứng dụng AI), D (Thiết kế hệ thống AI)
  topicName: string; // Tên chủ đề thành phần
  requirement: string; // Yêu cầu cần đạt
}

export const DIGITAL_COMPETENCIES: DigitalCompetencyItem[] = [
  // 1. Khai thác dữ liệu và thông tin
  {
    code: '1.1TC1a',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số',
    description: 'Giải thích được nhu cầu thông tin.',
    applicableGrades: '6-7',
  },
  {
    code: '1.1TC1b',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số',
    description: 'Thực hiện được rõ ràng và theo quy trình các tìm kiếm để tìm dữ liệu, thông tin và nội dung trong môi trường số.',
    applicableGrades: '6-7',
  },
  {
    code: '1.1TC2a',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số',
    description: 'Minh họa được nhu cầu thông tin theo mục tiêu học tập.',
    applicableGrades: '8-9',
  },
  {
    code: '1.1TC2b',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số',
    description: 'Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số.',
    applicableGrades: '8-9',
  },
  {
    code: '1.2TC1a',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.2. Đánh giá dữ liệu, thông tin và nội dung số',
    description: 'Phân tích, so sánh, đánh giá độ tin cậy & độ chính xác của nguồn dữ liệu, thông tin & nội dung số được tổ chức rõ ràng.',
    applicableGrades: '6-7',
  },
  {
    code: '1.2TC2a',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.2. Đánh giá dữ liệu, thông tin và nội dung số',
    description: 'Phân tích, so sánh, đánh giá độ tin cậy & độ chính xác của các nguồn dữ liệu, thông tin & nội dung số đa dạng.',
    applicableGrades: '8-9',
  },
  {
    code: '1.3TC1b',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.3. Quản lý dữ liệu, thông tin và nội dung số',
    description: 'Sắp xếp dữ liệu, thông tin & nội dung một cách trật tự trong môi trường có cấu trúc.',
    applicableGrades: '6-7',
  },
  {
    code: '1.3TC2a',
    domain: '1. Khai thác dữ liệu và thông tin',
    subDomain: '1.3. Quản lý dữ liệu, thông tin và nội dung số',
    description: 'Sắp xếp thông tin, dữ liệu & nội dung để dễ dàng lưu trữ và truy xuất phục vụ học tập.',
    applicableGrades: '8-9',
  },

  // 2. Giao tiếp và hợp tác
  {
    code: '2.1TC1b',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.1. Tương tác thông qua công nghệ số',
    description: 'Lựa chọn được các phương tiện giao tiếp số phù hợp, được xác định rõ ràng cho bối cảnh nhất định.',
    applicableGrades: '6-7',
  },
  {
    code: '2.1TC2b',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.1. Tương tác thông qua công nghệ số',
    description: 'Lựa chọn được nhiều phương tiện truyền thông số phù hợp với bối cảnh cụ thể của lớp học và nhà trường.',
    applicableGrades: '8-9',
  },
  {
    code: '2.2TC1c',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.2. Chia sẻ thông tin và nội dung thông qua công nghệ số',
    description: 'Minh họa rõ ràng và thường xuyên các phương pháp tham chiếu và ghi nguồn khi chia sẻ dữ liệu.',
    applicableGrades: '6-7',
  },
  {
    code: '2.2TC2a',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.2. Chia sẻ thông tin và nội dung thông qua công nghệ số',
    description: 'Vận dụng được các công nghệ số phù hợp để chia sẻ dữ liệu, thông tin và nội dung số.',
    applicableGrades: '8-9',
  },
  {
    code: '2.4TC1a',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.4. Hợp tác thông qua công nghệ số',
    description: 'Lựa chọn được các công cụ và công nghệ số được xác định rõ ràng và thường xuyên cho các quá trình hợp tác nhóm.',
    applicableGrades: '6-7',
  },
  {
    code: '2.4TC2a',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.4. Hợp tác thông qua công nghệ số',
    description: 'Lựa chọn được các công cụ và công nghệ số cho các quá trình hợp tác giải quyết nhiệm vụ trải nghiệm.',
    applicableGrades: '8-9',
  },
  {
    code: '2.5TC1a',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.5. Quy tắc ứng xử trên mạng',
    description: 'Làm rõ được các chuẩn mực hành vi thường xuyên và bí quyết khi sử dụng công nghệ số và tương tác trong môi trường số.',
    applicableGrades: '6-7',
  },
  {
    code: '2.5TC2b',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.5. Quy tắc ứng xử trên mạng',
    description: 'Thảo luận các chiến lược giao tiếp phù hợp trong môi trường số (thực hành nguyên tắc "Dừng lại và suy nghĩ" - Stop & Think).',
    applicableGrades: '8-9',
  },
  {
    code: '2.6TC2b',
    domain: '2. Giao tiếp và hợp tác',
    subDomain: '2.6. Quản lý danh tính số',
    description: 'Thảo luận những cách cụ thể để bảo vệ danh tiếng trực tuyến và danh tính số của bản thân.',
    applicableGrades: '8-9',
  },

  // 3. Sáng tạo nội dung số
  {
    code: '3.1TC1b',
    domain: '3. Sáng tạo nội dung số',
    subDomain: '3.1. Phát triển nội dung số',
    description: 'Thể hiện được bản thân thông qua việc tạo ra các nội dung số thông thường và được xác định rõ ràng.',
    applicableGrades: '6-7',
  },
  {
    code: '3.1TC2b',
    domain: '3. Sáng tạo nội dung số',
    subDomain: '3.1. Phát triển nội dung số',
    description: 'Thể hiện được bản thân thông qua việc tạo ra các sản phẩm truyền thông số, video ngắn hoặc infographic.',
    applicableGrades: '8-9',
  },
  {
    code: '3.3TC2a',
    domain: '3. Sáng tạo nội dung số',
    subDomain: '3.3. Thực thi bản quyền và giấy phép',
    description: 'Thảo luận các quy tắc về bản quyền và giấy phép áp dụng cho thông tin và nội dung số.',
    applicableGrades: '8-9',
  },

  // 4. An toàn
  {
    code: '4.1TC1b',
    domain: '4. An toàn',
    subDomain: '4.1. Bảo vệ thiết bị',
    description: 'Phân biệt được những rủi ro và mối đe dọa cơ bản và phổ biến trong môi trường số.',
    applicableGrades: '6-7',
  },
  {
    code: '4.2TC2a',
    domain: '4. An toàn',
    subDomain: '4.2. Bảo vệ dữ liệu cá nhân và quyền riêng tư',
    description: 'Thảo luận về cách bảo vệ dữ liệu cá nhân và quyền riêng tư trong môi trường số.',
    applicableGrades: '8-9',
  },
  {
    code: '4.3TC1a',
    domain: '4. An toàn',
    subDomain: '4.3. Bảo vệ sức khỏe và an sinh số',
    description: 'Giải thích được những cách thức cơ bản và phổ biến để tránh rủi ro và đe dọa đến sức khỏe thể chất và tinh thần khi sử dụng công nghệ số.',
    applicableGrades: '6-7',
  },
  {
    code: '4.3TC2b',
    domain: '4. An toàn',
    subDomain: '4.3. Bảo vệ sức khỏe và an sinh số',
    description: 'Lựa chọn được cách thức bảo vệ bản thân và người khác khỏi nguy cơ trong môi trường số (ví dụ: bạo lực mạng, bắt nạt trực tuyến).',
    applicableGrades: '8-9',
  },

  // 5. Giải quyết vấn đề
  {
    code: '5.2TC2b',
    domain: '5. Giải quyết vấn đề',
    subDomain: '5.2. Xác định được nhu cầu và giải pháp công nghệ',
    description: 'Lựa chọn được công cụ số có khả năng phù hợp và các giải pháp công nghệ để hỗ trợ giải quyết nhu cầu học tập và sinh hoạt.',
    applicableGrades: '8-9',
  },
  {
    code: '5.3TC2a',
    domain: '5. Giải quyết vấn đề',
    subDomain: '5.3. Sử dụng sáng tạo công nghệ số',
    description: 'Phân biệt được các công cụ và công nghệ số có thể được sử dụng để tạo ra kiến thức và đổi mới quy trình, sản phẩm.',
    applicableGrades: '8-9',
  },

  // 6. Ứng dụng trí tuệ nhân tạo
  {
    code: '6.1TC2a',
    domain: '6. Ứng dụng trí tuệ nhân tạo',
    subDomain: '6.1. Hiểu biết về trí tuệ nhân tạo',
    description: 'Áp dụng được các nguyên tắc cơ bản của AI để giải quyết các vấn đề đơn giản trong học tập.',
    applicableGrades: '6-7',
  },
  {
    code: '6.2TC2c',
    domain: '6. Ứng dụng trí tuệ nhân tạo',
    subDomain: '6.2. Sử dụng trí tuệ nhân tạo',
    description: 'Bảo vệ được dữ liệu cá nhân và tuân thủ các quy định pháp luật về bảo mật thông tin khi sử dụng AI.',
    applicableGrades: '8-9',
  },
];

export const AI_COMPETENCIES: AiCompetencyItem[] = [
  // KHỐI 6
  {
    code: '6.A1.1',
    grade: '6',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Nhận biết và giải thích được rằng AI không tự sinh ra hoặc hoạt động một cách độc lập, mà được con người tạo ra, lập trình và điều khiển để thực hiện những nhiệm vụ cụ thể.',
  },
  {
    code: '6.A1.2',
    grade: '6',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Nêu được một số ví dụ quen thuộc về các công cụ AI mà học sinh có thể gặp trong đời sống hằng ngày (ví dụ: Trợ lý ảo, robot hút bụi...).',
  },
  {
    code: '6.A1.3',
    grade: '6',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Trình bày được AI hoạt động theo lập trình của con người và chỉ là công cụ hỗ trợ, còn người dùng là người quyết định cuối cùng.',
  },
  {
    code: '6.A3.1',
    grade: '6',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A3. Công dân trong kỉ nguyên AI',
    requirement: 'Nhận biết và giải thích được rằng AI có thể giúp con người học hỏi, rèn luyện kỹ năng và mở rộng hiểu biết, nếu con người biết sử dụng AI đúng cách và có mục đích rõ ràng.',
  },
  {
    code: '6.A3.2',
    grade: '6',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A3. Công dân trong kỉ nguyên AI',
    requirement: 'Nhận biết và giải thích được rằng dữ liệu cá nhân là tài sản của mỗi người, và chỉ chủ sở hữu mới có quyền quyết định chia sẻ hoặc cho phép sử dụng.',
  },
  {
    code: '6.B1.1',
    grade: '6',
    domain: 'B. Đạo đức AI',
    topicName: 'B1. Các khía cạnh đạo đức của AI',
    requirement: 'Nhận biết và phân tích được mặt tích cực và hạn chế của một số tính năng AI cụ thể.',
  },
  {
    code: '6.B2.1',
    grade: '6',
    domain: 'B. Đạo đức AI',
    topicName: 'B2. Sử dụng AI an toàn và có trách nhiệm',
    requirement: 'Nêu được một số câu hỏi cơ bản để kiểm tra tính an toàn và minh bạch của ứng dụng AI và áp dụng các câu hỏi đó để nhận xét đơn giản về mức độ an toàn của công cụ.',
  },
  {
    code: '6.D1.1',
    grade: '6',
    domain: 'D. Thiết kế hệ thống AI',
    topicName: 'D1. Nhận diện và hình thành giải pháp',
    requirement: 'Trình bày được ý kiến cá nhân về việc nên hay không nên sử dụng AI trong một số tình huống thực tế cụ thể và giải thích được lý do.',
  },

  // KHỐI 7
  {
    code: '7.A1.1',
    grade: '7',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Giải thích được lý do vì sao con người cần giữ quyền ra quyết định (đảm bảo công bằng, an toàn và bảo vệ quyền lợi con người).',
  },
  {
    code: '7.A1.2',
    grade: '7',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Nêu được hậu quả xảy ra khi không có sự xác thực của con người về độ chính xác của kết quả mà AI đưa ra trong một số trường hợp thực tế.',
  },
  {
    code: '7.A3.1',
    grade: '7',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A3. Công dân trong kỉ nguyên AI',
    requirement: 'Biết về xung đột giữa quyền tự chủ của con người và quyền tự chủ của AI; chỉ ra các tình huống con người cần trực tiếp quyết định.',
  },
  {
    code: '7.B2.1',
    grade: '7',
    domain: 'B. Đạo đức AI',
    topicName: 'B2. Sử dụng AI an toàn và có trách nhiệm',
    requirement: 'Nêu được một số tiêu chí đơn giản (dựa trên các nguyên tắc đạo đức) để đánh giá mức độ phù hợp, an toàn của một ứng dụng AI.',
  },
  {
    code: '7.B3.1',
    grade: '7',
    domain: 'B. Đạo đức AI',
    topicName: 'B3. Nguyên tắc đạo đức và trách nhiệm xã hội',
    requirement: 'Thể hiện được thái độ và cam kết cá nhân trong việc sử dụng AI có trách nhiệm; trung thực khai báo khi sử dụng AI trong sản phẩm học tập.',
  },
  {
    code: '7.C4.1',
    grade: '7',
    domain: 'C. Các kĩ thuật và ứng dụng AI',
    topicName: 'C4. Dữ liệu trong AI',
    requirement: 'Phân tích được các vấn đề đạo đức có thể nảy sinh từ dữ liệu huấn luyện AI (thiếu đa dạng dẫn đến thiên vị, dữ liệu riêng tư bị xâm phạm).',
  },
  {
    code: '7.D1.1',
    grade: '7',
    domain: 'D. Thiết kế hệ thống AI',
    topicName: 'D1. Nhận diện và hình thành giải pháp',
    requirement: 'Nêu được ví dụ cụ thể về một vấn đề trong trường học hoặc cộng đồng có thể được giải quyết hoặc cải thiện bằng AI.',
  },

  // KHỐI 8
  {
    code: '8.A1.1',
    grade: '8',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Nêu được một số lĩnh vực mà AI không nên thay thế con người (giáo dục, y tế, nghệ thuật, sự đồng cảm và thấu hiểu).',
  },
  {
    code: '8.A1.2',
    grade: '8',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Nhận biết được về những rủi ro của việc lạm dụng các công cụ AI sáng tạo (suy giảm tư duy phản biện, kĩ năng sáng tạo, phụ thuộc công nghệ).',
  },
  {
    code: '8.A2.1',
    grade: '8',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A2. AI vì sự tiến bộ của con người',
    requirement: 'Nhận biết và giải thích được rằng một số hệ thống hoặc dịch vụ sử dụng AI có thể thu thập, phân tích dữ liệu cá nhân để thao túng quyết định.',
  },
  {
    code: '8.B1.1',
    grade: '8',
    domain: 'B. Đạo đức AI',
    topicName: 'B1. Các khía cạnh đạo đức của AI',
    requirement: 'Nhận diện và phân loại được một số rủi ro phổ biến khi sử dụng AI (rủi ro dữ liệu, thuật toán thiên vị, lừa đảo bằng nội dung giả mạo deepfake).',
  },
  {
    code: '8.B2.1',
    grade: '8',
    domain: 'B. Đạo đức AI',
    topicName: 'B2. Sử dụng AI an toàn và có trách nhiệm',
    requirement: 'Nêu được hành vi tự giác trong việc bảo vệ dữ liệu cá nhân và tôn trọng bản quyền trong các dự án học tập có sử dụng AI.',
  },
  {
    code: '8.C5.1',
    grade: '8',
    domain: 'C. Các kĩ thuật và ứng dụng AI',
    topicName: 'C5. Kĩ thuật và thuật toán AI',
    requirement: 'Nêu được cách AI nhận diện cảm xúc và nhận xét được độ tin cậy cũng như giới hạn của việc AI nhận diện cảm xúc con người.',
  },

  // KHỐI 9
  {
    code: '9.A1.1',
    grade: '9',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A1. Tính chủ động của con người',
    requirement: 'Hình thành nhận thức và phát triển quan điểm phản biện về những thách thức mà xã hội đang đối mặt trong kỉ nguyên AI.',
  },
  {
    code: '9.A2.2',
    grade: '9',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A2. AI vì sự tiến bộ của con người',
    requirement: 'Giải thích được các vấn đề "thiên vị", "thành kiến" mà AI có thể gây ra đối với xã hội, cũng như tác động của AI đối với các mối quan hệ xã hội.',
  },
  {
    code: '9.A3.1',
    grade: '9',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A3. Công dân trong kỉ nguyên AI',
    requirement: 'Hiểu được rằng trong thế giới có AI, con người cần: Biết học cách học, phát triển tư duy phản biện, giữ vững tính sáng tạo và cảm xúc con người, nâng cao kỹ năng hợp tác và giao tiếp.',
  },
  {
    code: '9.A3.2',
    grade: '9',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A3. Công dân trong kỉ nguyên AI',
    requirement: 'Thực hành xác định mục tiêu học tập cá nhân trong thế giới có AI, tự đặt mục tiêu phát triển kỹ năng mềm mà AI không thay thế được (đồng cảm, sáng tạo, lãnh đạo...).',
  },
  {
    code: '9.A3.4',
    grade: '9',
    domain: 'A. Tư duy lấy con người làm trung tâm',
    topicName: 'A3. Công dân trong kỉ nguyên AI',
    requirement: 'Phân tích được những thay đổi mà AI có thể mang lại cho các ngành nghề trong tương lai; liệt kê các kỹ năng quan trọng cần trang bị để sống và làm việc cùng AI.',
  },
  {
    code: '9.B2.1',
    grade: '9',
    domain: 'B. Đạo đức AI',
    topicName: 'B2. Sử dụng AI an toàn và có trách nhiệm',
    requirement: 'Trình bày được vai trò của người dùng trong kiểm soát và chịu trách nhiệm đối với kết quả cuối cùng do AI tạo ra; khai báo minh bạch việc dùng AI.',
  },
  {
    code: '9.B3.1',
    grade: '9',
    domain: 'B. Đạo đức AI',
    topicName: 'B3. Nguyên tắc đạo đức và trách nhiệm xã hội',
    requirement: 'Giải thích được tầm quan trọng của việc huấn luyện AI theo hướng không phân biệt đối xử và tôn trọng sự đa dạng.',
  },
  {
    code: '9.C2.1',
    grade: '9',
    domain: 'C. Các kĩ thuật và ứng dụng AI',
    topicName: 'C2. Ứng dụng AI trong học tập và cuộc sống',
    requirement: 'Đề xuất được những ý tưởng mới, sáng tạo để giải quyết một vấn đề bằng AI trong học tập và rèn luyện kỹ năng.',
  },
  {
    code: '9.D1.1',
    grade: '9',
    domain: 'D. Thiết kế hệ thống AI',
    topicName: 'D1. Nhận diện và hình thành giải pháp',
    requirement: 'Trình bày được vai trò của con người là đồng sáng tạo và người dẫn dắt trong việc thiết kế, vận hành và phát triển các hệ thống, công cụ AI.',
  },
];
