import React, { useState, useRef } from 'react';
import { LessonTemplateStructure } from '../types/lessonPlan';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Plus,
  Eye,
  Star,
  Copy,
  Table,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface TemplateManagerTabProps {
  templates: LessonTemplateStructure[];
  activeTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onSaveTemplate: (template: LessonTemplateStructure) => void;
  onDeleteTemplate: (templateId: string) => void;
  onSetDefaultTemplate: (templateId: string) => void;
  onSwitchToCreate: () => void;
}

export const TemplateManagerTab: React.FC<TemplateManagerTabProps> = ({
  templates,
  activeTemplateId,
  onSelectTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  onSetDefaultTemplate,
  onSwitchToCreate,
}) => {
  const [templateName, setTemplateName] = useState('');
  const [subjectName, setSubjectName] = useState('Hoạt động trải nghiệm, hướng nghiệp');
  const [gradeLevel, setGradeLevel] = useState('Lớp 9');
  const [templateText, setTemplateText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<LessonTemplateStructure | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const response = await fetch('/api/ai/parse-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            fileName: file.name,
            fileType: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
            category: 'reference',
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Máy chủ đang xử lý dữ liệu lớn. Vui lòng thử lại.');
        }
        const data = await response.json();
        const extracted = data.extractedText || data.textContent;

        if (extracted && extracted.trim().length > 0) {
          setTemplateText(extracted);
          if (!templateName) {
            setTemplateName(`Mẫu từ tệp: ${file.name.replace(/\.[^.]+$/, '')}`);
          }
          // Now trigger template analysis
          await handleAnalyzeTemplateText(extracted, file.name);
        } else {
          setAnalysisError('Không thể trích xuất nội dung văn bản từ tệp mẫu. Vui lòng sao chép và dán trực tiếp nội dung vào ô bên dưới.');
        }
      } catch (err: any) {
        setAnalysisError(err.message || 'Lỗi khi đọc tệp mẫu giáo án.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.onerror = () => {
      setIsAnalyzing(false);
      setAnalysisError('Lỗi đọc tệp từ thiết bị.');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAnalyzeTemplateText = async (rawText: string, fileName?: string) => {
    if (!rawText.trim()) {
      setAnalysisError('Vui lòng nhập hoặc tải lên nội dung giáo án mẫu.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/ai/analyze-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateText: rawText,
          templateName: templateName || (fileName ? `Mẫu: ${fileName}` : 'Mẫu giáo án mới'),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Máy chủ phản hồi định dạng không hợp lệ.');
      }
      const data = await response.json();
      if (data && data.success && data.analysis) {
        const newTemplate: LessonTemplateStructure = {
          id: `template-${Date.now()}`,
          name: templateName || data.analysis.name || 'Mẫu giáo án chuẩn hóa',
          subject: subjectName,
          gradeLevel: gradeLevel,
          sourceFileName: fileName,
          identifiedSections: data.analysis.identifiedSections || [],
          hasTwoColumnTable: Boolean(data.analysis.hasTwoColumnTable),
          rawText: rawText,
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };

        setPreviewTemplate(newTemplate);
      } else {
        throw new Error(data.error || 'Lỗi nhận diện cấu trúc');
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'Không thể phân tích cấu trúc mẫu');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmSave = () => {
    if (!previewTemplate) return;
    onSaveTemplate(previewTemplate);
    onSelectTemplate(previewTemplate.id);
    setPreviewTemplate(null);
    setTemplateText('');
    setTemplateName('');
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white rounded-2xl p-6 shadow-xl border border-blue-700/50">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-200 border border-sky-400/30">
              TAB 2: QUẢN LÝ MẪU GIÁO ÁN
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              NHẬN DIỆN VÀ THIẾT LẬP CẤU TRÚC GIÁO ÁN MẪU
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Tải lên giáo án mẫu (PDF, Word .docx/.doc) hoặc dán văn bản. AI sẽ phân tích chính xác từng đề mục, cách đánh số, bảng 2 cột để áp dụng 100% làm khuôn mẫu khi tạo giáo án mới.
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Soạn bài với Mẫu đã chọn</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload & Input Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Tải lên hoặc Dán nội dung giáo án mẫu</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">TÊN MẪU GIÁO ÁN:</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ví dụ: Mẫu HĐTN 9 THCS Tịnh Biên..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">MÔN HỌC / HOẠT ĐỘNG:</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Ví dụ: Hoạt động trải nghiệm, Toán, Ngữ văn..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CẤP HỌC / KHỐI LỚP:</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                placeholder="Ví dụ: THCS - Lớp 9, Lớp 7..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-5 bg-blue-50/40 text-center hover:bg-blue-50/70 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.doc,.pdf,.txt"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-3 bg-blue-600 text-white rounded-full shadow-md">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Chọn tệp giáo án mẫu từ máy tính (PDF, Word .docx, .doc)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Hệ thống hỗ trợ nạp giáo án mẫu thật để nhận diện chính xác cấu trúc
                </p>
              </div>
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang nạp và phân tích tệp...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tải tệp mẫu lên</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Text Area Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                HOẶC DÁN TRỰC TIẾP NỘI DUNG VĂN BẢN GIÁO ÁN MẪU:
              </label>
              {templateText && (
                <span className="text-[11px] text-slate-400 font-mono">
                  {templateText.length.toLocaleString('vi-VN')} ký tự
                </span>
              )}
            </div>
            <textarea
              rows={8}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              placeholder="Dán toàn bộ văn bản giáo án mẫu (tiêu đề, mục tiêu, thiết bị, bảng hoạt động GV-HS và sản phẩm)..."
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50 leading-relaxed"
            />
          </div>

          {analysisError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{analysisError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isAnalyzing || !templateText.trim()}
              onClick={() => handleAnalyzeTemplateText(templateText)}
              className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang phân tích cấu trúc...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PHÂN TÍCH VÀ NHẬN DIỆN CẤU TRÚC</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Analysis Card */}
          {previewTemplate && (
            <div className="mt-4 p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  KẾT QUẢ NHẬN DIỆN CẤU TRÚC THÀNH CÔNG
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  {previewTemplate.hasTwoColumnTable ? 'Có bảng 2 cột' : 'Dạng tiến trình bước'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-800">
                <p>
                  <strong>Tên mẫu:</strong> {previewTemplate.name}
                </p>
                <p>
                  <strong>Môn / Cấp:</strong> {previewTemplate.subject} ({previewTemplate.gradeLevel})
                </p>
                <div>
                  <strong>Các đề mục đã nhận diện ({previewTemplate.identifiedSections.length} mục):</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-700">
                    {previewTemplate.identifiedSections.map((sec, idx) => (
                      <li key={idx}>
                        <span className="font-semibold text-blue-950">{sec.title}</span>
                        {sec.description && <span className="text-slate-500 italic"> — {sec.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>XÁC NHẬN VÀ LƯU VÀO KHO MẪU</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: List of Templates */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Kho mẫu giáo án ({templates.length})</span>
            </h3>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
            {templates.map((tpl) => {
              const isActive = tpl.id === activeTemplateId;

              return (
                <div
                  key={tpl.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                        {tpl.isDefault && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            Mặc định
                          </span>
                        )}
                        {isActive && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white">
                            Đang áp dụng
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {tpl.subject || 'Môn học chung'} • {tpl.gradeLevel || 'THCS'}
                      </p>
                      <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                        <p>• {tpl.identifiedSections.length} đề mục chuẩn</p>
                        <p>• {tpl.hasTwoColumnTable ? 'Bố trí bảng 2 cột' : 'Bố trí theo bước'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onSelectTemplate(tpl.id)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isActive ? 'Đang chọn' : 'Áp dụng mẫu này'}
                    </button>

                    <div className="flex items-center gap-1">
                      {!tpl.isDefault && (
                        <button
                          type="button"
                          onClick={() => onSetDefaultTemplate(tpl.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded hover:bg-slate-100 cursor-pointer"
                          title="Đặt làm mẫu mặc định"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {templates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa mẫu "${tpl.name}"?`)) {
                              onDeleteTemplate(tpl.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
                          title="Xóa mẫu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Ghi chú:</strong> Mẫu được chọn sẽ được AI áp dụng làm khuôn mẫu cấu trúc chính xác (tiêu đề, cách đánh số, bảng 2 cột) khi bạn tạo giáo án trong Tab "TẠO GIÁO ÁN MỚI".
          </div>
        </div>
      </div>
    </div>
  );
};
