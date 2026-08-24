import { LessonPlan } from '../types';

/**
 * Worker xử lý xuất báo cáo & Giáo án chuẩn Word (.docx) & PDF
 * Tầng Nghiệp vụ (Backend API / Export Worker) trong sơ đồ
 */
export class ExportWorkerService {
  /**
   * Xuất giáo án sang dạng định dạng văn bản chuẩn trình bày giáo dục
   */
  public static exportToDocxFormat(plan: LessonPlan): void {
    const header = `TRƯỜNG THCS / THPT CHUYÊN\nTỔ MÔN: CÔNG NGHỆ - HƯỚNG NGHIỆP\n\n`;
    const fullContent = `${header}KẾ HOẠCH BÀI DẠY (CÔNG VĂN 5512)\nTên bài: ${plan.title}\nMôn: ${plan.subjectModule} - Lớp ${plan.gradeLevel}\nThời lượng: ${plan.durationPeriods} tiết\n\n--------------------------------------------------\n${plan.contentMarkdown}`;

    const blob = new Blob([fullContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KHBD_${plan.topicName.replace(/\s+/g, '_')}_Lop${plan.gradeLevel}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Xuất file PDF hoặc in ấn trực tiếp
   */
  public static exportToPdf(plan: LessonPlan): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${plan.title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #111; }
            h1 { text-align: center; font-size: 18pt; text-transform: uppercase; margin-bottom: 5px; }
            h2 { font-size: 14pt; color: #0f172a; border-bottom: 2px solid #059669; padding-bottom: 4px; margin-top: 20px; }
            .header-table { width: 100%; margin-bottom: 20px; font-weight: bold; }
            .meta { margin-bottom: 20px; font-style: italic; background: #f8fafc; padding: 12px; border-left: 4px solid #0891b2; }
            pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; word-wrap: break-word; font-size: 13pt; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>TRƯỜNG THCS CHU VĂN AN<br>TỔ CÔNG NGHỆ - HƯỚNG NGHIỆP</td>
              <td style="text-align: right;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc</td>
            </tr>
          </table>
          <h1>KẾ HOẠCH BÀI DẠY (CÔNG VĂN 5512)</h1>
          <div class="meta">
            <strong>Bài dạy:</strong> ${plan.title}<br>
            <strong>Môn học:</strong> ${plan.subjectModule} | <strong>Lớp:</strong> ${plan.gradeLevel} | <strong>Thời lượng:</strong> ${plan.durationPeriods} tiết
          </div>
          <div>
            <pre>${plan.contentMarkdown}</pre>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
