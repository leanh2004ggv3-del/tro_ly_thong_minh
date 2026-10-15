import React from 'react';
import { ValidationReport } from '../types/lessonPlan';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ValidationReportModalProps {
  report: ValidationReport;
  isOpen: boolean;
  onClose: () => void;
  onAutoFix: () => void;
  isLoading: boolean;
}

export const ValidationReportModal: React.FC<ValidationReportModalProps> = ({
  report,
  isOpen,
  onClose,
  onAutoFix,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">KẾT QUẢ KIỂM TRA CHẤT LƯỢNG GIÁO ÁN</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Đối chiếu 14 tiêu chí chuẩn GDPT 2018 &amp; Công văn 5512/BGDĐT-GDTrH
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Score Card */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Đánh giá tổng thể
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {report.score >= 90
                  ? 'Giáo án Xuất sắc • Chuẩn 5512'
                  : report.score >= 75
                  ? 'Giáo án Đạt chuẩn • Cần hoàn thiện nhỏ'
                  : 'Cần bổ sung một số tiêu chí sư phạm'}
              </h4>
              <span className="text-xs text-slate-500 mt-1 block">
                Kiểm tra lúc: {report.checkedAt}
              </span>
            </div>

            <div className="text-right">
              <span className="text-3xl font-extrabold text-blue-700">
                {report.score}
              </span>
              <span className="text-slate-400 text-sm font-semibold">/100</span>
            </div>
          </div>

          {/* NHỮNG PHẦN ĐÃ ĐẠT */}
          <div>
            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>NHỮNG PHẦN ĐÃ ĐẠT ({report.passedItems.length})</span>
            </h4>
            <div className="space-y-2">
              {report.passedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 leading-relaxed"
                >
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NHỮNG PHẦN CẦN BỔ SUNG / CHỈNH SỬA */}
          <div>
            <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>NHỮNG PHẦN CẦN BỔ SUNG / CHỈNH SỬA ({report.pendingItems.length})</span>
            </h4>
            {report.pendingItems.length > 0 ? (
              <div className="space-y-2">
                {report.pendingItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed"
                  >
                    <span className="text-amber-600 font-bold mt-0.5">!</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 text-slate-600 rounded-lg text-xs italic text-center">
                Không có tiêu chí nào cần khắc phục. Giáo án đã đạt đầy đủ các yêu cầu chuyên môn!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>

          {report.pendingItems.length > 0 && (
            <button
              onClick={onAutoFix}
              disabled={isLoading}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>TỰ ĐỘNG HOÀN THIỆN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
