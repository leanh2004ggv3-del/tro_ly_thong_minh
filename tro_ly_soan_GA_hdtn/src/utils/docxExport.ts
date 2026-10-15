import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
  convertInchesToTwip
} from 'docx';
import { LessonPlan, ActivityStep, PeriodSection } from '../types/lessonPlan';
import { DIGITAL_AI_STANDARDS } from '../data/digitalAiStandards';

export async function exportLessonPlanToDocx(plan: LessonPlan): Promise<void> {
  // Document setup with Times New Roman font, A4 margins (Bám sát 100% mẫu giáo án PDF THCS Tịnh Biên)
  const children: (Paragraph | Table)[] = [];

  // 1. Khung Tiêu đề đầu trang (Bảng 2 cột chuẩn mẫu trang 1)
  children.push(createHeaderTable(plan));
  children.push(new Paragraph({ spacing: { after: 120 } }));

  // 2. Tên Chủ đề & Tuần (Căn giữa theo mẫu trang 1)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: (plan.topic || 'CHỦ ĐỀ 1: EM VỚI NHÀ TRƯỜNG').toUpperCase(),
          bold: true,
          size: 28, // 14pt
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `(${plan.week || 'Tuần 1'})`,
          bold: true,
          size: 24, // 12pt
          color: '000000',
        }),
      ],
    })
  );

  // 3. MỤC TIÊU CHUNG CỦA CHỦ ĐỀ
  const generalObjs = plan.generalTopicObjectives || {
    knowledge: plan.objectives?.knowledge || [],
    qualities: plan.objectives?.qualities?.items || [],
    competencies: [
      ...(plan.objectives?.competencies?.specific || []),
      ...(plan.objectives?.competencies?.general || []),
    ],
  };

  const topicHeaderTitle = plan.topic?.includes('CHỦ ĐỀ')
    ? plan.topic.split(':')[0].trim().toUpperCase()
    : 'CHỦ ĐỀ 1';

  children.push(
    new Paragraph({
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: `MỤC TIÊU CHUNG CỦA ${topicHeaderTitle}`,
          bold: true,
          size: 26, // 13pt
          color: '000000',
        }),
      ],
    })
  );

  // Thứ tự: Kiến thức -> Phẩm chất -> Năng lực (theo đúng mẫu trang 1)
  children.push(
    new Paragraph({
      indent: { left: convertInchesToTwip(0.15) },
      spacing: { before: 30, after: 30 },
      children: [
        new TextRun({
          text: '• Kiến thức: ',
          bold: true,
          size: 24,
        }),
        new TextRun({
          text:
            generalObjs.knowledge && generalObjs.knowledge.length > 0
              ? generalObjs.knowledge.join(' ')
              : 'Tôn trọng sự khác biệt và sống hài hòa với bạn bè, thầy cô; Xây dựng kế hoạch tổ chức hoạt động phòng chống bắt nạt học đường; Xác định mục tiêu và xây dựng kế hoạch cho các buổi lao động công ích; Làm các sản phẩm đóng góp xây dựng truyền thống nhà trường.',
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      indent: { left: convertInchesToTwip(0.15) },
      spacing: { before: 30, after: 30 },
      children: [
        new TextRun({
          text: '• Phẩm chất: ',
          bold: true,
          size: 24,
        }),
        new TextRun({
          text:
            generalObjs.qualities && generalObjs.qualities.length > 0
              ? generalObjs.qualities.join(' ')
              : 'Nhân ái, khoan dung, tôn trọng mọi người; Trách nhiệm thông qua các hoạt động phòng chống bắt nạt học đường và lao động công ích.',
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      indent: { left: convertInchesToTwip(0.15) },
      spacing: { before: 30, after: 30 },
      children: [
        new TextRun({
          text: '• Năng lực: ',
          bold: true,
          size: 24,
        }),
        new TextRun({
          text:
            generalObjs.competencies && generalObjs.competencies.length > 0
              ? generalObjs.competencies.join(' ')
              : 'Thích ứng với cuộc sống; Thiết kế và tổ chức hoạt động; Tự chủ trong các mối quan hệ với bạn bè, thầy cô; Giao tiếp và hợp tác nhóm.',
          size: 24,
        }),
      ],
    })
  );

  children.push(new Paragraph({ spacing: { after: 180 } }));

  // Helper references for 3 periods
  const flagPeriod: PeriodSection | undefined =
    plan.periods?.flagSalute ||
    (plan.activities?.flagSalute?.enabled
      ? {
          enabled: true,
          periodNumber: 1,
          periodType: 'flagSalute',
          title: 'TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)',
          subTitle: `CHỦ ĐỀ: THAM GIA CUỘC PHÁT ĐỘNG PHONG TRÀO THI ĐUA "XÂY DỰNG TRUYỀN THỐNG NHÀ TRƯỜNG"`,
          note: '(Do Giáo viên được phân công phụ trách điều hành tại phòng học)',
          objectives: {
            knowledge: plan.objectives?.knowledge || [],
            competencies: plan.objectives?.competencies?.general || [],
            qualities: plan.objectives?.qualities?.items || [],
          },
          equipment: {
            teacher: plan.equipment?.teacher || ['Máy tính, tivi/máy chiếu phòng học, loa lớp; Slide hình ảnh, video clip ngắn về truyền thống nhà trường; Kế hoạch phát động thi đua cấp lớp và bộ câu hỏi giao lưu.'],
            students: plan.equipment?.students || ['SGK, SBT Hoạt động trải nghiệm, hướng nghiệp 9; Sổ ghi chép; Đội văn nghệ/Ban cán sự lớp chuẩn bị kịch bản điều hành theo sự phân công.'],
          },
          steps: plan.activities.flagSalute.steps || [],
        }
      : undefined);

  const topicPeriod: PeriodSection | undefined =
    plan.periods?.topicActivity ||
    (plan.activities?.topicActivity?.enabled
      ? {
          enabled: true,
          periodNumber: 2,
          periodType: 'topicActivity',
          title: 'TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ',
          subTitle: `NỘI DUNG: ${plan.lessonTitle.toUpperCase()}`,
          objectives: {
            knowledge: plan.objectives?.knowledge || [],
            integratedCompetencies: plan.periods?.topicActivity?.objectives?.integratedCompetencies,
            qualities: plan.objectives?.qualities?.items || [],
          },
          equipment: {
            teacher: plan.equipment?.teacher || ['Máy tính, máy chiếu, bảng phụ, các thẻ tình huống thảo luận.'],
            students: plan.equipment?.students || ['Sách giáo khoa Hoạt động trải nghiệm, giấy A0/A4, bút màu.'],
          },
          steps: plan.activities.topicActivity.steps || [],
        }
      : undefined);

  const classPeriod: PeriodSection | undefined =
    plan.periods?.classMeeting ||
    (plan.activities?.classMeeting?.enabled
      ? {
          enabled: true,
          periodNumber: 3,
          periodType: 'classMeeting',
          title: 'TIẾT 3: SINH HOẠT LỚP',
          subTitle: `CHỦ ĐỀ: XÂY DỰNG NỘI QUY TỰ QUẢN & BẢN CAM KẾT VĂN HÓA LỚP HỌC ${plan.grade}`,
          objectives: {
            competencies: plan.objectives?.competencies?.general || [],
            qualities: plan.objectives?.qualities?.items || [],
          },
          equipment: {
            teacher: plan.equipment?.teacher || ['Bản cam kết văn hóa lớp học in trên khổ giấy A0, bút dạ, bảng nhóm, máy chiếu.'],
            students: plan.equipment?.students || ['Sổ tay, bút, suy nghĩ trước về các điều khoản nội quy tự quản lớp học và văn hóa ứng xử số.'],
          },
          steps: plan.activities.classMeeting.steps || [],
        }
      : undefined);

  // ==================== TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC) ====================
  if (flagPeriod && flagPeriod.enabled !== false) {
    // Tiêu đề Tiết 1
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 40 },
        children: [
          new TextRun({
            text: (flagPeriod.title || 'TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)').toUpperCase(),
            bold: true,
            size: 26,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text: (flagPeriod.subTitle || 'CHỦ ĐỀ: THAM GIA CUỘC PHÁT ĐỘNG PHONG TRÀO THI ĐUA "XÂY DỰNG TRUYỀN THỐNG NHÀ TRƯỜNG"').toUpperCase(),
            bold: true,
            size: 24,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: flagPeriod.note || '(Do Giáo viên được phân công phụ trách điều hành tại phòng học)',
            size: 22,
            italics: true,
            color: '000000',
          }),
        ],
      })
    );

    // I. MỤC TIÊU TIẾT HỌC
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: 'I. MỤC TIÊU TIẾT HỌC',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      })
    );

    if (flagPeriod.objectives?.knowledge?.length) {
      children.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.15) },
          spacing: { before: 25, after: 25 },
          children: [
            new TextRun({
              text: '1. Về kiến thức: ',
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: flagPeriod.objectives.knowledge.join(' '),
              size: 24,
            }),
          ],
        })
      );
    }

    if (flagPeriod.objectives?.competencies?.length) {
      children.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.15) },
          spacing: { before: 25, after: 25 },
          children: [
            new TextRun({
              text: '2. Về năng lực: ',
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: flagPeriod.objectives.competencies.join(' '),
              size: 24,
            }),
          ],
        })
      );
    }

    if (flagPeriod.objectives?.qualities?.length) {
      children.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.15) },
          spacing: { before: 25, after: 25 },
          children: [
            new TextRun({
              text: '3. Về phẩm chất: ',
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: flagPeriod.objectives.qualities.join(' '),
              size: 24,
            }),
          ],
        })
      );
    }

    // Nếu Tiết 1 có tích hợp NLS / NLAI
    const flagIntegrated = flagPeriod.objectives?.integratedCompetencies;
    if (flagIntegrated?.digital || flagIntegrated?.ai) {
      children.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.15) },
          spacing: { before: 40, after: 25 },
          children: [
            new TextRun({
              text: '4. Về năng lực tích hợp (NLS & NLAI):',
              bold: true,
              size: 24,
            }),
          ],
        })
      );
      if (flagIntegrated.digital) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: `- Năng lực số (${flagIntegrated.digital.code || 'NLS'}): `,
                bold: true,
                size: 24,
                color: 'C00000', // ĐỎ
              }),
              new TextRun({
                text: flagIntegrated.digital.details,
                size: 24,
                color: 'C00000', // ĐỎ
              }),
            ],
          })
        );
      }
      if (flagIntegrated.ai) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: `- Năng lực Trí tuệ nhân tạo (${flagIntegrated.ai.code || 'NLAI'}): `,
                bold: true,
                size: 24,
                color: '0070C0', // XANH DƯƠNG
              }),
              new TextRun({
                text: flagIntegrated.ai.details,
                size: 24,
                color: '0070C0', // XANH DƯƠNG
              }),
            ],
          })
        );
      }
    }

    // II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 25 },
        children: [
          new TextRun({
            text: '- Đối với Giáo viên phụ trách: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: flagPeriod.equipment?.teacher?.join('; ') || 'Máy tính, tivi/máy chiếu phòng học, loa lớp; Slide hình ảnh, video clip ngắn về truyền thống nhà trường; Kế hoạch phát động thi đua cấp lớp và bộ câu hỏi giao lưu.',
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 40 },
        children: [
          new TextRun({
            text: '- Đối với Học sinh: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: flagPeriod.equipment?.students?.join('; ') || 'SGK, SBT Hoạt động trải nghiệm, hướng nghiệp 9; Sổ ghi chép; Đội văn nghệ/Ban cán sự lớp chuẩn bị kịch bản điều hành theo sự phân công.',
            size: 24,
          }),
        ],
      })
    );

    // III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG (TỔ CHỨC TRỰC TIẾP TẠI LỚP)
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({
            text: 'III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC (TỔ CHỨC TRỰC TIẾP TẠI LỚP)',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      })
    );
    children.push(createTwoColumnActivityTable(flagPeriod.steps || []));
    children.push(new Paragraph({ spacing: { after: 180 } }));
  }

  // ==================== TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ ====================
  if (topicPeriod && topicPeriod.enabled !== false) {
    // Tiêu đề Tiết 2 - Bắt đầu trang mới chuẩn A4
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 40 },
        children: [
          new TextRun({
            text: (topicPeriod.title || 'TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ').toUpperCase(),
            bold: true,
            size: 26,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 120 },
        children: [
          new TextRun({
            text: (topicPeriod.subTitle || `NỘI DUNG: ${plan.lessonTitle}`).toUpperCase(),
            bold: true,
            size: 24,
            color: '000000',
          }),
        ],
      })
    );

    // I. MỤC TIÊU TIẾT HỌC
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: 'I. MỤC TIÊU TIẾT HỌC',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 25 },
        children: [
          new TextRun({
            text: '1. Về kiến thức và năng lực đặc thù: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: topicPeriod.objectives?.knowledge?.join(' ') || 'Học sinh nhận biết, tôn trọng sự khác biệt về sở thích, phong cách, cá tính và biết cách sống hài hòa với bạn bè, thầy cô; Biết ứng xử lịch sự, hòa nhã trong cuộc sống hàng ngày cũng như trên không gian mạng.',
            size: 24,
          }),
        ],
      })
    );

    // 2. Về năng lực tích hợp (NLS & NLAI) - Chỉ xuất hiện khi có tích hợp NLS hoặc NL AI
    const topicIntegrated = topicPeriod.objectives?.integratedCompetencies;
    const hasTopicIntegrated = Boolean(topicIntegrated?.digital || topicIntegrated?.ai);

    if (hasTopicIntegrated) {
      children.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.15) },
          spacing: { before: 25, after: 25 },
          children: [
            new TextRun({
              text: '2. Về năng lực tích hợp (NLS & NLAI):',
              bold: true,
              size: 24,
            }),
          ],
        })
      );

      if (topicIntegrated?.digital) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: `- Năng lực số (${topicIntegrated.digital.code || 'NLS'}): `,
                bold: true,
                size: 24,
                color: 'C00000', // ĐỎ
              }),
              new TextRun({
                text: topicIntegrated.digital.details,
                size: 24,
                color: 'C00000', // ĐỎ
              }),
            ],
          })
        );
      }

      if (topicIntegrated?.ai) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: `- Năng lực Trí tuệ nhân tạo (${topicIntegrated.ai.code || 'NLAI'}): `,
                bold: true,
                size: 24,
                color: '0070C0', // XANH DƯƠNG
              }),
              new TextRun({
                text: topicIntegrated.ai.details,
                size: 24,
                color: '0070C0', // XANH DƯƠNG
              }),
            ],
          })
        );
      }
    }

    // Về phẩm chất (đánh số 3 nếu có tích hợp, đánh số 2 nếu không tích hợp)
    children.push(
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 40 },
        children: [
          new TextRun({
            text: `${hasTopicIntegrated ? '3' : '2'}. Về phẩm chất: `,
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: topicPeriod.objectives?.qualities?.join(' ') || 'Bồi dưỡng lòng nhân ái, sự khoan dung, tôn trọng cá tính riêng của bạn bè và thầy cô.',
            size: 24,
          }),
        ],
      })
    );

    // II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 25 },
        children: [
          new TextRun({
            text: '• Đối với Giáo viên: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: topicPeriod.equipment?.teacher?.join('; ') || 'Máy tính, máy chiếu, bảng phụ, các thẻ tình huống thảo luận (kết hợp bối cảnh đời thực, mạng xã hội và công cụ AI).',
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 40 },
        children: [
          new TextRun({
            text: '• Đối với Học sinh: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: topicPeriod.equipment?.students?.join('; ') || 'Sách giáo khoa Hoạt động trải nghiệm 9, giấy A0/A4, bút màu.',
            size: 24,
          }),
        ],
      })
    );

    // III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC (BẢNG 2 CỘT TÍCH HỢP)
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({
            text: 'III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      })
    );
    children.push(createTwoColumnActivityTable(topicPeriod.steps || []));
    children.push(new Paragraph({ spacing: { after: 180 } }));
  }

  // ==================== TIẾT 3: SINH HOẠT LỚP ====================
  if (classPeriod && classPeriod.enabled !== false) {
    // Tiêu đề Tiết 3 - Bắt đầu trang mới chuẩn A4
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 40 },
        children: [
          new TextRun({
            text: (classPeriod.title || 'TIẾT 3: SINH HOẠT LỚP').toUpperCase(),
            bold: true,
            size: 26,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 120 },
        children: [
          new TextRun({
            text: (classPeriod.subTitle || `CHỦ ĐỀ: XÂY DỰNG NỘI QUY TỰ QUẢN & BẢN CAM KẾT VĂN HÓA LỚP HỌC ${plan.grade}`).toUpperCase(),
            bold: true,
            size: 24,
            color: '000000',
          }),
        ],
      })
    );

    // I. MỤC TIÊU TIẾT HỌC
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: 'I. MỤC TIÊU TIẾT HỌC',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 25 },
        children: [
          new TextRun({
            text: '1. Năng lực: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: classPeriod.objectives?.competencies?.join(' ') || 'Năng lực giao tiếp và hợp tác: Học sinh biết cách thảo luận nhóm, lắng nghe ý kiến của bạn và mạnh dạn trình bày quan điểm cá nhân để xây dựng tập thể; Năng lực tự quản và ứng xử văn minh trên không gian mạng và các nhóm hội thảo trực tuyến của lớp.',
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 25 },
        children: [
          new TextRun({
            text: '2. Phẩm chất: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: classPeriod.objectives?.qualities?.join(' ') || 'Trách nhiệm: Tự giác chấp hành và giám sát việc thực hiện nội quy lớp học; Tôn trọng sự khác biệt và giữ gìn tình bạn đoàn kết.',
            size: 24,
          }),
        ],
      })
    );

    // Nếu Tiết 3 có tích hợp NLS / NLAI
    const classIntegrated = classPeriod.objectives?.integratedCompetencies;
    if (classIntegrated?.digital || classIntegrated?.ai) {
      children.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.15) },
          spacing: { before: 25, after: 25 },
          children: [
            new TextRun({
              text: '3. Về năng lực tích hợp (NLS & NLAI):',
              bold: true,
              size: 24,
            }),
          ],
        })
      );
      if (classIntegrated.digital) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: `- Năng lực số (${classIntegrated.digital.code || 'NLS'}): `,
                bold: true,
                size: 24,
                color: 'C00000',
              }),
              new TextRun({
                text: classIntegrated.digital.details,
                size: 24,
                color: 'C00000',
              }),
            ],
          })
        );
      }
      if (classIntegrated.ai) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: `- Năng lực Trí tuệ nhân tạo (${classIntegrated.ai.code || 'NLAI'}): `,
                bold: true,
                size: 24,
                color: '0070C0',
              }),
              new TextRun({
                text: classIntegrated.ai.details,
                size: 24,
                color: '0070C0',
              }),
            ],
          })
        );
      }
    }

    // II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 25 },
        children: [
          new TextRun({
            text: '- Đối với Giáo viên: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: classPeriod.equipment?.teacher?.join('; ') || 'Bản cam kết văn hóa lớp học in trên khổ giấy A0, bút dạ, bảng nhóm, máy chiếu.',
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        indent: { left: convertInchesToTwip(0.15) },
        spacing: { before: 25, after: 40 },
        children: [
          new TextRun({
            text: '- Đối với Học sinh: ',
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: classPeriod.equipment?.students?.join('; ') || 'Sổ tay, bút, suy nghĩ trước về các điều khoản nội quy tự quản lớp học và văn hóa ứng xử số.',
            size: 24,
          }),
        ],
      })
    );

    // III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG (Dạng danh sách Bước theo đúng chuẩn trang 8 & 9)
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({
            text: 'III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC',
            bold: true,
            size: 25,
            color: '000000',
          }),
        ],
      })
    );

    // Xuất dạng danh sách Bước chuẩn mẫu trang 8-9 của PDF
    children.push(...createStepListForDocx(classPeriod.steps || []));
    children.push(new Paragraph({ spacing: { after: 180 } }));
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              after: 80,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.79), // ~2cm
              bottom: convertInchesToTwip(0.79), // ~2cm
              left: convertInchesToTwip(1.18), // ~3cm
              right: convertInchesToTwip(0.79), // ~2cm
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Format clean file name: Giao_an_HDTN_Lop_[Lop]_[Chu_de].docx
  const cleanGrade = plan.grade;
  const cleanTopic = plan.topic
    .replace(/[^a-zA-Z0-9À-ỹ\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 30);
  const fileName = `Giao_an_HDTN_Lop_${cleanGrade}_${cleanTopic}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper formatting functions
function createHeaderTable(plan: LessonPlan): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Cột trái: TRƯỜNG THCS TỊNH BIÊN / Họ và tên GV / Tổ
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 30 },
                children: [
                  new TextRun({
                    text: (plan.schoolName || 'TRƯỜNG THCS TỊNH BIÊN').toUpperCase(),
                    bold: true,
                    size: 24, // 12pt
                    color: '000000',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({
                    text: 'Họ và tên GV: ',
                    bold: true,
                    size: 24,
                    color: '000000',
                  }),
                  new TextRun({
                    text: plan.teacherName || 'Đặng Văn Sạch',
                    size: 24,
                    color: '000000',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 20, after: 0 },
                children: [
                  new TextRun({
                    text: 'Tổ: ',
                    bold: true,
                    size: 24,
                    color: '000000',
                  }),
                  new TextRun({
                    text: plan.departmentName || 'Công nghệ - Hướng nghiệp',
                    size: 24,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
          // Cột phải: GIÁO ÁN HOẠT ĐỘNG TRẢI NGHIỆM / Năm học / Học kỳ - Tuần
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 30 },
                children: [
                  new TextRun({
                    text: `GIÁO ÁN HOẠT ĐỘNG TRẢI NGHIỆM ${plan.grade || '9'}`,
                    bold: true,
                    size: 24, // 12pt
                    color: '000000',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({
                    text: 'Năm học: ',
                    bold: true,
                    size: 24,
                    color: '000000',
                  }),
                  new TextRun({
                    text: plan.schoolYear || '2026 - 2027',
                    size: 24,
                    color: '000000',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 20, after: 0 },
                children: [
                  new TextRun({
                    text: plan.semester || `Học kỳ: I - ${plan.week || 'Tuần 1'}`,
                    bold: true,
                    size: 24,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Xuất tiến trình Tiết 3 theo dạng các Bước tuần tự (chuẩn trang 8 & 9)
function createStepListForDocx(steps: ActivityStep[]): Paragraph[] {
  const paras: Paragraph[] = [];

  steps.forEach((step) => {
    // Tên Bước (ví dụ: Bước 1: Khởi động (5 phút))
    paras.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({
            text: step.stepName,
            bold: true,
            size: 24, // 12pt
            color: '000000',
          }),
        ],
      })
    );

    // Mục tiêu (nếu có)
    if (step.objective) {
      paras.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.15) },
          spacing: { before: 20, after: 25 },
          children: [
            new TextRun({
              text: '• Mục tiêu: ',
              bold: true,
              size: 24,
              color: '000000',
            }),
            new TextRun({
              text: step.objective,
              size: 24,
              color: '000000',
            }),
          ],
        })
      );
    }

    // Các dòng hoạt động
    const actionLines = step.teacherStudentAction.split('\n').filter(Boolean);
    actionLines.forEach((line) => {
      paras.push(formatStepLineForDocx(line));
    });

    // Nếu có sản phẩm riêng biệt và chưa xuất hiện trong action
    if (step.expectedProduct && !step.teacherStudentAction.includes(step.expectedProduct)) {
      const prodLines = step.expectedProduct.split('\n').filter(Boolean);
      prodLines.forEach((pLine) => {
        paras.push(formatStepLineForDocx(pLine));
      });
    }
  });

  return paras;
}

function formatStepLineForDocx(line: string): Paragraph {
  const isNLS =
    line.includes('[NLS]') ||
    line.includes('Tích hợp NLS') ||
    line.includes('NLS 2.5') ||
    line.includes('NLS 2.1') ||
    line.includes('NLS 3.2') ||
    line.includes('NLS 4.2') ||
    line.includes('NLS 5.1');

  const isNLAI =
    line.includes('[NLAI]') ||
    line.includes('Tích hợp NLAI') ||
    line.includes('NLAI 9.A') ||
    line.includes('NLAI 6.A') ||
    line.includes('NLAI 7.A') ||
    line.includes('NLAI 8.A');

  const indentTwips = line.startsWith('+')
    ? convertInchesToTwip(0.3)
    : line.startsWith('-') || line.startsWith('•')
    ? convertInchesToTwip(0.15)
    : convertInchesToTwip(0.15);

  const cleanText = line.replace(/^\[NLS\]\s*/, '').replace(/^\[NLAI\]\s*/, '');

  if (isNLS) {
    return new Paragraph({
      indent: { left: indentTwips },
      spacing: { before: 25, after: 25 },
      children: [
        new TextRun({
          text: cleanText,
          size: 24,
          bold: true,
          color: 'C00000', // ĐỎ
        }),
      ],
    });
  }

  if (isNLAI) {
    return new Paragraph({
      indent: { left: indentTwips },
      spacing: { before: 25, after: 25 },
      children: [
        new TextRun({
          text: cleanText,
          size: 24,
          bold: true,
          color: '0070C0', // XANH DƯƠNG
        }),
      ],
    });
  }

  // Format * Mục tiêu:
  if (line.startsWith('* Mục tiêu:') || line.startsWith('• Mục tiêu:') || line.startsWith('Mục tiêu:')) {
    const content = line.replace(/^[\*\•]?\s*Mục tiêu[:\s]*/i, '').trim();
    return new Paragraph({
      indent: { left: convertInchesToTwip(0.15) },
      spacing: { before: 30, after: 20 },
      children: [
        new TextRun({ text: '* Mục tiêu: ', bold: true, size: 24, color: '0F3460' }),
        new TextRun({ text: content, size: 24, color: '000000' }),
      ],
    });
  }

  // Format * Phương pháp thực hiện:
  if (line.startsWith('* Phương pháp thực hiện:') || line.startsWith('• Phương pháp thực hiện:') || line.startsWith('Phương pháp thực hiện:') || line.startsWith('* Phương pháp:')) {
    const content = line.replace(/^[\*\•]?\s*(?:Phương pháp thực hiện|Phương pháp)[:\s]*/i, '').trim();
    return new Paragraph({
      indent: { left: convertInchesToTwip(0.15) },
      spacing: { before: 20, after: 20 },
      children: [
        new TextRun({ text: '* Phương pháp thực hiện: ', bold: true, size: 24, color: '0F3460' }),
        new TextRun({ text: content, size: 24, color: '000000' }),
      ],
    });
  }

  // Format * Tổ chức thực hiện:
  if (line.startsWith('* Tổ chức thực hiện:') || line.startsWith('• Tổ chức thực hiện:') || line.startsWith('Tổ chức thực hiện:')) {
    return new Paragraph({
      indent: { left: convertInchesToTwip(0.15) },
      spacing: { before: 40, after: 20 },
      children: [
        new TextRun({ text: '* Tổ chức thực hiện:', bold: true, size: 24, color: '0F3460' }),
      ],
    });
  }

  // Format - Bước 1: Chuyển giao nhiệm vụ
  if (line.startsWith('- Bước 1:') || line.startsWith('Bước 1:') || line.includes('Bước 1: Chuyển giao nhiệm vụ') || line.startsWith('1. Bước 1:')) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 1[:\s\-\(]*(?:Chuyển giao nhiệm vụ|Giao nhiệm vụ)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 1: Chuyển giao nhiệm vụ', bold: true, size: 24, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 24, color: '000000' }));
    }
    return new Paragraph({
      indent: { left: convertInchesToTwip(0.2) },
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  // Format - Bước 2: Thực hiện nhiệm vụ
  if (line.startsWith('- Bước 2:') || line.startsWith('Bước 2:') || line.includes('Bước 2: Thực hiện nhiệm vụ') || line.startsWith('2. Bước 2:')) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 2[:\s\-\(]*(?:Thực hiện nhiệm vụ|Thực hiện)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 2: Thực hiện nhiệm vụ', bold: true, size: 24, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 24, color: '000000' }));
    }
    return new Paragraph({
      indent: { left: convertInchesToTwip(0.2) },
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  // Format - Bước 3: Báo cáo, thảo luận
  if (line.startsWith('- Bước 3:') || line.startsWith('Bước 3:') || line.includes('Bước 3: Báo cáo, thảo luận') || line.startsWith('3. Bước 3:')) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 3[:\s\-\(]*(?:Báo cáo,?\s*thảo luận|Báo cáo\s*-\s*Thảo luận|Báo cáo)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 3: Báo cáo, thảo luận', bold: true, size: 24, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 24, color: '000000' }));
    }
    return new Paragraph({
      indent: { left: convertInchesToTwip(0.2) },
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  // Format - Bước 4: Kết luận, nhận định
  if (line.startsWith('- Bước 4:') || line.startsWith('Bước 4:') || line.includes('Bước 4: Kết luận, nhận định') || line.startsWith('4. Bước 4:')) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 4[:\s\-\(]*(?:Kết luận,?\s*nhận định|Nhận định\s*-\s*Kết luận|Kết luận)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 4: Kết luận, nhận định', bold: true, size: 24, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 24, color: '000000' }));
    }
    return new Paragraph({
      indent: { left: convertInchesToTwip(0.2) },
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  const isBoldHeader =
    line.startsWith('• Cách thức tổ chức:') ||
    line.startsWith('• Dẫn dắt:') ||
    line.startsWith('• Chốt lại:') ||
    line.startsWith('• Dặn dò:') ||
    line.startsWith('- 03 điều cần KHUYẾN KHÍCH') ||
    line.startsWith('- 03 điều NGHIÊM CẤM');

  return new Paragraph({
    indent: { left: indentTwips },
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({
        text: cleanText,
        size: 24,
        bold: isBoldHeader,
        color: '000000',
      }),
    ],
  });
}

function createSectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: '0F3460',
      }),
    ],
  });
}

function createSubSectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 25,
        color: '1E3A8A',
      }),
    ],
  });
}

function createSubHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 90, after: 50 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
      }),
    ],
  });
}

function createPeriodBanner(title: string, colorHex: string = '1E3A8A'): Paragraph {
  return new Paragraph({
    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
    spacing: { before: 200, after: 60 },
    children: [
      new TextRun({
        text: `★ ${title.toUpperCase()}`,
        bold: true,
        size: 26,
        color: colorHex,
      }),
    ],
  });
}

function createItalicNote(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 30, after: 60 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 22,
        color: '334155',
      }),
    ],
  });
}

function createItalicLabel(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 30 },
    children: [
      new TextRun({
        text,
        italics: true,
        bold: true,
        size: 23,
      }),
    ],
  });
}

function createBullet(text: string): Paragraph {
  return new Paragraph({
    indent: { left: convertInchesToTwip(0.25) },
    spacing: { before: 25, after: 25 },
    children: [
      new TextRun({
        text: `• ${text}`,
        size: 23,
      }),
    ],
  });
}

// TWO COLUMN TABLE WITH FULL HIGHLIGHTING FOR NLS (RED) AND NLAI (BLUE)
function createTwoColumnActivityTable(steps: ActivityStep[]): Table {
  const borderConfig = {
    style: BorderStyle.SINGLE,
    size: 6,
    color: '4B5563',
  };

  const tableRows: TableRow[] = [
    // Header Row with Navy Blue styling
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          shading: { fill: '1B365D', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
              children: [
                new TextRun({
                  text: 'HOẠT ĐỘNG CỦA GV VÀ HS',
                  bold: true,
                  size: 24,
                  color: 'FFFFFF',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          shading: { fill: '1B365D', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
              children: [
                new TextRun({
                  text: 'DỰ KIẾN SẢN PHẨM',
                  bold: true,
                  size: 24,
                  color: 'FFFFFF',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  steps.forEach((step) => {
    // Left Column
    const leftChildren: Paragraph[] = [
      new Paragraph({
        spacing: { before: 60, after: 40 },
        children: [
          new TextRun({
            text: step.stepName,
            bold: true,
            size: 24,
            color: '000000',
          }),
        ],
      }),
    ];

    const rawAction = step.teacherStudentAction || '';
    const hasObjectiveInAction = rawAction.includes('* Mục tiêu:') || rawAction.includes('• Mục tiêu:') || rawAction.includes('Mục tiêu:');
    const hasMethodInAction = rawAction.includes('* Phương pháp thực hiện:') || rawAction.includes('• Phương pháp thực hiện:') || rawAction.includes('Phương pháp thực hiện:');
    const hasOrgInAction = rawAction.includes('* Tổ chức thực hiện:') || rawAction.includes('• Tổ chức thực hiện:') || rawAction.includes('Tổ chức thực hiện:');

    if (!hasObjectiveInAction && step.objective) {
      leftChildren.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: '* Mục tiêu: ', bold: true, size: 23 }),
            new TextRun({ text: step.objective, size: 23 }),
          ],
        })
      );
    }

    if (!hasMethodInAction) {
      leftChildren.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: '* Phương pháp thực hiện: ', bold: true, size: 23 }),
            new TextRun({ text: step.method || 'Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề, thảo luận nhóm.', size: 23 }),
          ],
        })
      );
    }

    if (!hasOrgInAction && !hasObjectiveInAction) {
      leftChildren.push(
        new Paragraph({
          spacing: { before: 30, after: 20 },
          children: [
            new TextRun({ text: '* Tổ chức thực hiện:', bold: true, size: 23 }),
          ],
        })
      );
    }

    const actionLines = rawAction.split('\n').filter((l) => l.trim().length > 0);
    actionLines.forEach((line) => {
      leftChildren.push(formatActivityLineForDocx(line));
    });

    // Right Column
    const rightChildren: Paragraph[] = [];
    const productLines = (step.expectedProduct || '').split('\n').filter((l) => l.trim().length > 0);
    productLines.forEach((line) => {
      rightChildren.push(formatProductLineForDocx(line));
    });

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            margins: {
              top: convertInchesToTwip(0.08),
              bottom: convertInchesToTwip(0.08),
              left: convertInchesToTwip(0.12),
              right: convertInchesToTwip(0.12),
            },
            children: leftChildren,
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            margins: {
              top: convertInchesToTwip(0.08),
              bottom: convertInchesToTwip(0.08),
              left: convertInchesToTwip(0.12),
              right: convertInchesToTwip(0.12),
            },
            children: rightChildren,
          }),
        ],
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderConfig,
      bottom: borderConfig,
      left: borderConfig,
      right: borderConfig,
      insideHorizontal: borderConfig,
      insideVertical: borderConfig,
    },
    rows: tableRows,
  });
}

// Smart paragraph formatter that highlights NLS in RED and NLAI in BLUE, and formats CV 5512 steps
function formatActivityLineForDocx(rawLine: string): Paragraph {
  const line = rawLine.trim();

  const isNLS =
    line.includes('[NLS]') ||
    line.includes('Tích hợp NLS') ||
    line.includes('NLS 2.5') ||
    line.includes('NLS 2.1') ||
    line.includes('NLS 3.2') ||
    line.includes('NLS 4.2') ||
    line.includes('NLS 5.1');

  const isNLAI =
    line.includes('[NLAI]') ||
    line.includes('Tích hợp NLAI') ||
    line.includes('NLAI 9.A') ||
    line.includes('NLAI 6.A') ||
    line.includes('NLAI 7.A') ||
    line.includes('NLAI 8.A');

  if (isNLS) {
    return new Paragraph({
      spacing: { before: 30, after: 30 },
      children: [
        new TextRun({
          text: line,
          bold: true,
          size: 23,
          color: 'C00000', // RED COLOR FOR NLS
        }),
      ],
    });
  }

  if (isNLAI) {
    return new Paragraph({
      spacing: { before: 30, after: 30 },
      children: [
        new TextRun({
          text: line,
          bold: true,
          size: 23,
          color: '0070C0', // BLUE COLOR FOR NLAI
        }),
      ],
    });
  }

  // * Mục tiêu:
  if (line.startsWith('* Mục tiêu:') || line.startsWith('• Mục tiêu:')) {
    const content = line.replace(/^[\*\•]\s*Mục tiêu:\s*/, '');
    return new Paragraph({
      spacing: { before: 20, after: 20 },
      children: [
        new TextRun({ text: '* Mục tiêu: ', bold: true, size: 23 }),
        new TextRun({ text: content, size: 23 }),
      ],
    });
  }

  // * Phương pháp thực hiện:
  if (line.startsWith('* Phương pháp thực hiện:') || line.startsWith('• Phương pháp thực hiện:')) {
    const content = line.replace(/^[\*\•]\s*Phương pháp thực hiện:\s*/, '');
    return new Paragraph({
      spacing: { before: 20, after: 20 },
      children: [
        new TextRun({ text: '* Phương pháp thực hiện: ', bold: true, size: 23 }),
        new TextRun({ text: content, size: 23 }),
      ],
    });
  }

  // * Tổ chức thực hiện:
  if (line.startsWith('* Tổ chức thực hiện:') || line.startsWith('• Tổ chức thực hiện:')) {
    return new Paragraph({
      spacing: { before: 30, after: 20 },
      children: [
        new TextRun({ text: '* Tổ chức thực hiện:', bold: true, size: 23 }),
      ],
    });
  }

  // - Bước 1: Chuyển giao nhiệm vụ
  if (
    line.startsWith('- Bước 1:') ||
    line.startsWith('Bước 1:') ||
    line.includes('Bước 1: Chuyển giao nhiệm vụ') ||
    line.includes('Bước 1 (Giao nhiệm vụ)') ||
    line.includes('Bước 1: Giao nhiệm vụ') ||
    line.startsWith('1. Bước 1:')
  ) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 1[:\s\-\(]*(?:Chuyển giao nhiệm vụ|Giao nhiệm vụ)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 1: Chuyển giao nhiệm vụ', bold: true, size: 23, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 23 }));
    }
    return new Paragraph({
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  // - Bước 2: Thực hiện nhiệm vụ
  if (
    line.startsWith('- Bước 2:') ||
    line.startsWith('Bước 2:') ||
    line.includes('Bước 2: Thực hiện nhiệm vụ') ||
    line.includes('Bước 2 (Thực hiện nhiệm vụ)') ||
    line.includes('Bước 2 (Thực hiện)') ||
    line.startsWith('2. Bước 2:')
  ) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 2[:\s\-\(]*(?:Thực hiện nhiệm vụ|Thực hiện)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 2: Thực hiện nhiệm vụ', bold: true, size: 23, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 23 }));
    }
    return new Paragraph({
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  // - Bước 3: Báo cáo, thảo luận
  if (
    line.startsWith('- Bước 3:') ||
    line.startsWith('Bước 3:') ||
    line.includes('Bước 3: Báo cáo, thảo luận') ||
    line.includes('Bước 3 (Báo cáo - Thảo luận)') ||
    line.includes('Bước 3: Báo cáo') ||
    line.startsWith('3. Bước 3:')
  ) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 3[:\s\-\(]*(?:Báo cáo,?\s*thảo luận|Báo cáo\s*-\s*Thảo luận|Báo cáo)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 3: Báo cáo, thảo luận', bold: true, size: 23, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 23 }));
    }
    return new Paragraph({
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  // - Bước 4: Kết luận, nhận định
  if (
    line.startsWith('- Bước 4:') ||
    line.startsWith('Bước 4:') ||
    line.includes('Bước 4: Kết luận, nhận định') ||
    line.includes('Bước 4 (Nhận định - Kết luận)') ||
    line.includes('Bước 4: Kết luận') ||
    line.startsWith('4. Bước 4:')
  ) {
    const content = line.replace(/^[\-\•\d\.]?\s*Bước 4[:\s\-\(]*(?:Kết luận,?\s*nhận định|Nhận định\s*-\s*Kết luận|Kết luận)?(?:\))?[:\s]*/i, '').trim();
    const children = [new TextRun({ text: '- Bước 4: Kết luận, nhận định', bold: true, size: 23, color: '1E3A8A' })];
    if (content) {
      children.push(new TextRun({ text: `: ${content}`, size: 23 }));
    }
    return new Paragraph({
      spacing: { before: 40, after: 20 },
      children,
    });
  }

  // Sub-items starting with +
  if (line.startsWith('+')) {
    return new Paragraph({
      spacing: { before: 15, after: 15 },
      indent: { left: convertInchesToTwip(0.15) },
      children: [
        new TextRun({ text: line, size: 23 }),
      ],
    });
  }

  return new Paragraph({
    spacing: { before: 15, after: 15 },
    children: [
      new TextRun({
        text: line,
        size: 23,
      }),
    ],
  });
}

function formatProductLineForDocx(rawLine: string): Paragraph {
  const line = rawLine.trim();

  const isNLS = line.includes('[NLS]') || line.includes('Tích hợp NLS');
  const isNLAI = line.includes('[NLAI]') || line.includes('Tích hợp NLAI');

  if (isNLS) {
    return new Paragraph({
      spacing: { before: 30, after: 30 },
      children: [
        new TextRun({
          text: line.startsWith('-') ? line : `- ${line}`,
          bold: true,
          size: 23,
          color: 'C00000',
        }),
      ],
    });
  }

  if (isNLAI) {
    return new Paragraph({
      spacing: { before: 30, after: 30 },
      children: [
        new TextRun({
          text: line.startsWith('-') ? line : `- ${line}`,
          bold: true,
          size: 23,
          color: '0070C0',
        }),
      ],
    });
  }

  const cleanText = line.replace(/^[\-\•\*]\s*/, '').trim();
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({
        text: `- ${cleanText}`,
        size: 23,
      }),
    ],
  });
}

// Appendix Table of NLS & NL AI Standards in Word Document
function createDigitalAiLookupTableDocx(grade: string): Table {
  const borderConfig = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: '64748B',
  };

  const relevantStandards = DIGITAL_AI_STANDARDS.filter(
    (s) => s.grades.includes(grade as any) || s.grades.length >= 3
  );

  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: '0F172A', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Mã số & Loại', bold: true, size: 21, color: 'FFFFFF' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: '0F172A', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Tên năng lực / Miền', bold: true, size: 21, color: 'FFFFFF' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { fill: '0F172A', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Biểu hiện hành vi & Căn cứ', bold: true, size: 21, color: 'FFFFFF' })],
            }),
          ],
        }),
      ],
    }),
  ];

  relevantStandards.forEach((item) => {
    const isNLS = item.category === 'NLS';
    const colorHex = isNLS ? 'C00000' : '0070C0';

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${item.code}\n(${item.colorName.toUpperCase()})`,
                    bold: true,
                    size: 21,
                    color: colorHex,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.title,
                    bold: true,
                    size: 21,
                  }),
                  new TextRun({
                    text: `\n[${item.domain}]`,
                    italics: true,
                    size: 19,
                    color: '64748B',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.behaviorIndicator,
                    size: 21,
                  }),
                  new TextRun({
                    text: `\nCăn cứ: ${item.legalBasis}`,
                    italics: true,
                    size: 19,
                    color: '475569',
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderConfig,
      bottom: borderConfig,
      left: borderConfig,
      right: borderConfig,
      insideHorizontal: borderConfig,
      insideVertical: borderConfig,
    },
    rows,
  });
}

function createSignatureTable(plan: LessonPlan): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'DUYỆT CỦA TỔ CHUYÊN MÔN / BGH',
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '(Ký và ghi rõ họ tên)',
                    italics: true,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({ spacing: { before: 800 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '...........................................................',
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Tịnh Biên, ngày ..... tháng ..... năm 202...`,
                    italics: true,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'GIÁO VIÊN SOẠN BÀI',
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '(Ký và ghi rõ họ tên)',
                    italics: true,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({ spacing: { before: 800 } }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: plan.teacherName || 'Đặng Văn Sạch',
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
