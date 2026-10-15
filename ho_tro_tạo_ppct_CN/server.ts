import express from 'express';
import multer from 'multer';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, BorderStyle } from 'docx';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mammoth from 'mammoth';

const app = express();
const PORT = 3000;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set up Multer for handling file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const responseSchema: Schema = {
  type: Type.ARRAY,
  description: "Danh sách phân phối chương trình. Tổng số tiết phải bằng với totalPeriods được yêu cầu.",
  items: {
    type: Type.OBJECT,
    properties: {
      tietPpct: { type: Type.STRING, description: "Tiết chương trình, ví dụ: '1', '2-3', '4'" },
      baiHoc: { type: Type.STRING, description: "Tên bài học hoặc chủ đề" },
      soTiet: { type: Type.INTEGER, description: "Số tiết cho bài học này" },
      thoiDiem: { type: Type.STRING, description: "Thời điểm dạy học, ví dụ: 'Tuần 1', 'Tuần 2'" },
      thietBi: { type: Type.STRING, description: "Thiết bị dạy học, ví dụ 'SGK, máy chiếu' hoặc 'SGK'" },
      diaDiem: { type: Type.STRING, description: "Địa điểm dạy học, ví dụ 'Lớp học' hoặc 'Phòng thực hành'" },
      ghiChu: { type: Type.STRING, description: "Ghi chú, có thể để trống" },
    },
    required: ["tietPpct", "baiHoc", "soTiet", "thoiDiem", "thietBi", "diaDiem", "ghiChu"],
  },
};

app.post('/api/generate', upload.single('textbook'), async (req, res) => {
  let fileToUploadPath = '';
  let uploadedFile = null;
  const ai = getAI();

  try {
    const file = req.file;
    const subject = req.body.subject || 'Công nghệ';
    const grade = req.body.grade;
    const totalPeriods = parseInt(req.body.totalPeriods, 10);

    if (!file) {
      return res.status(400).json({ error: 'Vui lòng tải lên tệp Sách giáo khoa.' });
    }
    
    if (isNaN(totalPeriods) || !grade) {
      return res.status(400).json({ error: 'Vui lòng nhập Khối lớp và Tổng số tiết.' });
    }

    let mimeType = 'text/plain';
    fileToUploadPath = file.path;

    // Handle DOCX files
    const isDocx = file.originalname.toLowerCase().endsWith('.docx') || 
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isPdf = file.originalname.toLowerCase().endsWith('.pdf') || file.mimetype === 'application/pdf';

    if (isDocx) {
      const result = await mammoth.extractRawText({ path: file.path });
      const textContent = result.value || "Không tìm thấy nội dung trong tài liệu.";
      const txtPath = file.path + '.txt';
      fs.writeFileSync(txtPath, textContent);
      fileToUploadPath = txtPath;
      mimeType = 'text/plain';
    } else if (isPdf) {
      mimeType = 'application/pdf';
    } else if (file.originalname.toLowerCase().endsWith('.doc')) {
      return res.status(400).json({ error: 'Định dạng .doc cũ không được hỗ trợ. Vui lòng lưu dưới dạng .docx hoặc .pdf.' });
    }

    try {
      uploadedFile = await ai.files.upload({
        file: fileToUploadPath,
        config: {
          mimeType: mimeType,
        }
      });

      const prompt = `Bạn là một chuyên gia giáo dục. Hãy lập Phân phối chương trình môn ${subject} lớp ${grade} với tổng số tiết là ${totalPeriods} tiết cho cả năm học. 
Dựa vào tài liệu đính kèm (sách giáo khoa), hãy phân bổ số tiết hợp lí cho từng bài học. 
Nhiệm vụ bắt buộc: 
- Bạn phải chia nhỏ các bài học sao cho CỘNG lại tất cả các cột "soTiet" BẰNG ĐÚNG ${totalPeriods} tiết. 
- Không tự ý thêm nội dung ngoài sách.
- Trả về danh sách JSON tương thích chính xác với format yêu cầu.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [
              { fileData: { fileUri: uploadedFile.uri, mimeType: uploadedFile.mimeType } },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        }
      });

      let data;
      try {
        data = JSON.parse(response.text || '[]');
      } catch (parseErr) {
        console.error("Error parsing JSON response:", response.text);
        throw new Error("Lỗi khi đọc kết quả từ AI. Định dạng không hợp lệ.");
      }

      // Cleanup
      try {
        await ai.files.delete({ name: uploadedFile.name });
      } catch(e) { console.error("Error deleting file from AI:", e); }
      
      try { fs.unlinkSync(file.path); } catch(e) {}
      if (fileToUploadPath !== file.path) {
        try { fs.unlinkSync(fileToUploadPath); } catch(e) {}
      }

      res.json(data);
    } catch (apiError: any) {
      console.error("API Error:", apiError);
      let errorMsg = apiError.message || 'Lỗi khi gọi tới mô hình AI. Thử lại sau.';
      if (apiError.message && apiError.message.includes('429')) {
        errorMsg = 'Hệ thống AI đang quá tải hoặc hết hạn mức (Quota exceeded). Vui lòng thử lại sau ít phút.';
      }
      
      // Attempt cleanup
      if (uploadedFile) {
        try { await ai.files.delete({ name: uploadedFile.name }); } catch(e) {}
      }
      try { fs.unlinkSync(file.path); } catch(e) {}
      if (fileToUploadPath !== file.path) {
        try { fs.unlinkSync(fileToUploadPath); } catch(e) {}
      }
      
      res.status(500).json({ error: errorMsg });
    }
  } catch (error: any) {
    console.error("General Error:", error);
    try { if (req.file) fs.unlinkSync(req.file.path); } catch(e) {}
    if (fileToUploadPath && fileToUploadPath !== req.file?.path) {
       try { fs.unlinkSync(fileToUploadPath); } catch(e) {}
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.post('/api/export-docx', async (req, res) => {
  try {
    const data = req.body.data;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data array' });
    }

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tiết ppct", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Bài học / Chủ đề", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Số tiết", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Thời điểm (tuần)", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Thiết bị dạy học", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Địa điểm dạy học", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ghi chú", bold: true })] })] }),
        ],
      }),
    ];

    data.forEach(item => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(String(item.tietPpct))] }),
            new TableCell({ children: [new Paragraph(String(item.baiHoc))] }),
            new TableCell({ children: [new Paragraph(String(item.soTiet))] }),
            new TableCell({ children: [new Paragraph(String(item.thoiDiem))] }),
            new TableCell({ children: [new Paragraph(String(item.thietBi))] }),
            new TableCell({ children: [new Paragraph(String(item.diaDiem))] }),
            new TableCell({ children: [new Paragraph(String(item.ghiChu || ''))] }),
          ],
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "PHÂN PHỐI CHƯƠNG TRÌNH",
              heading: "Heading1",
              alignment: "center",
            }),
            new Paragraph({ text: "" }),
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=PhanPhoiChuongTrinh.docx');
    res.send(buffer);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
