import React from 'react';
import { BookOpen, CheckCircle2, Sparkles, FileText, Cpu, ShieldCheck, Layers, Folder, FileCheck } from 'lucide-react';

interface HeaderProps {
  onLoadSample: () => void;
  onReset: () => void;
  onOpenLookupModal?: () => void;
  hasPlan: boolean;
  activeAppTab?: 'create' | 'template' | 'editor' | 'validate' | 'warehouse';
  onSelectAppTab?: (tab: 'create' | 'template' | 'editor' | 'validate' | 'warehouse') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadSample,
  onReset,
  onOpenLookupModal,
  hasPlan,
  activeAppTab = 'create',
  onSelectAppTab,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white shadow-xl border-b border-blue-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 backdrop-blur-sm shadow-inner">
                <BookOpen className="w-6 h-6 text-sky-300" />
              </div>
              <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30">
                Chương trình GDPT 2018
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Mầm non, Tiểu học, THCS, THPT
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Bám sát 100% mẫu tải lên
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Bảng 2 cột &amp; Tiến trình
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              TRỢ LÝ SOẠN GIÁO ÁN THEO MẪU GIÁO VIÊN
            </h1>
            <p className="text-sm text-blue-200/90 mt-1 max-w-3xl">
              Nhận diện cấu trúc tệp giáo án mẫu (PDF, Word) của giáo viên &bull;{' '}
              Tự động tái tạo đúng <strong className="text-amber-300 font-semibold">bố cục, cách đánh số, bảng 2 cột</strong> và{' '}
              <strong className="text-sky-300 font-semibold">độ chi tiết sâu sắc</strong> cho bài dạy mới &bull; Mọi môn học và cấp học.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onOpenLookupModal && (
              <button
                onClick={onOpenLookupModal}
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition-all shadow-md active:scale-95 border border-amber-300 cursor-pointer"
                title="Mở Bảng tra cứu chuẩn Năng lực số (NLS) và Trí tuệ nhân tạo (NL AI) theo TT02, CV 2422, CV 3456"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>Tra cứu NLS &amp; NL AI</span>
              </button>
            )}

            <button
              onClick={onLoadSample}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Tải giáo án mẫu chuẩn để xem thử"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Xem giáo án mẫu</span>
            </button>

            {hasPlan && (
              <button
                onClick={onReset}
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600/80 hover:bg-sky-600 text-white transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Soạn bài mới</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 MAIN APPLICATION TABS NAVIGATION */}
        {onSelectAppTab && (
          <div className="mt-5 pt-3 border-t border-blue-700/50 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'create' as const, name: 'TAB 1. TẠO GIÁO ÁN MỚI', icon: FileText, desc: 'Nhập thông tin bài dạy' },
              { id: 'template' as const, name: 'TAB 2. QUẢN LÝ MẪU GIÁO ÁN', icon: Layers, desc: 'Nhận diện mẫu PDF/Word' },
              { id: 'editor' as const, name: 'TAB 3. SOẠN GIÁO ÁN', icon: Sparkles, desc: 'Chi tiết từng phần & chỉnh sửa' },
              { id: 'validate' as const, name: 'TAB 4. KIỂM TRA GIÁO ÁN', icon: FileCheck, desc: 'Thẩm định 14 tiêu chí 5512' },
              { id: 'warehouse' as const, name: 'TAB 5. KHO GIÁO ÁN', icon: Folder, desc: 'Lưu trữ & tra cứu bài dạy' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAppTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectAppTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : 'bg-blue-800/60 hover:bg-blue-700/80 text-blue-100 hover:text-white border border-blue-600/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-sky-300'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
