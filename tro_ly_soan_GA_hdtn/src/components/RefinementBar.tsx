import React, { useState } from 'react';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  ListPlus,
  Shuffle,
  PackagePlus,
  CheckCircle,
  FileDown,
  Edit3,
  Loader2,
  Wand2
} from 'lucide-react';

interface RefinementBarProps {
  onRefine: (action: string, customInstruction?: string) => void;
  onValidate: () => void;
  onExportWord: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  isLoading: boolean;
}

export const RefinementBar: React.FC<RefinementBarProps> = ({
  onRefine,
  onValidate,
  onExportWord,
  isEditing,
  onToggleEdit,
  isLoading,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomBox, setShowCustomBox] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onRefine('custom', customPrompt.trim());
    setCustomPrompt('');
    setShowCustomBox(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-4 mb-8 border border-slate-800">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/20 rounded-lg text-sky-400">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide">CÔNG CỤ TINH CHỈNH &amp; HOÀN THIỆN GIÁO ÁN</h3>
            <p className="text-[11px] text-slate-400">
              Nhấn các nút để AI hỗ trợ mở rộng, tối ưu tiến trình hoặc tự động kiểm tra chất lượng
            </p>
          </div>
        </div>

        {/* Primary Action Buttons: KIỂM TRA LẠI & XUẤT WORD */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleEdit}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isEditing
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Đang chế độ sửa' : 'Chỉnh sửa trực tiếp'}</span>
          </button>

          <button
            onClick={onValidate}
            type="button"
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>KIỂM TRA GIÁO ÁN</span>
          </button>

          <button
            onClick={onExportWord}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <FileDown className="w-4 h-4" />
            <span>XUẤT GIÁO ÁN WORD</span>
          </button>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800 scrollbar-thin">
        {/* CHI TIẾT HÓA TIẾN TRÌNH - Prominent special button */}
        <button
          onClick={() => onRefine('expand_steps')}
          disabled={isLoading}
          type="button"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
          title="Mở rộng phần Hoạt động của GV – HS thành các bước cụ thể hơn"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>CHI TIẾT HÓA TIẾN TRÌNH</span>
        </button>

        {/* VIẾT CHI TIẾT HƠN */}
        <button
          onClick={() => onRefine('detail')}
          disabled={isLoading}
          type="button"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Viết chi tiết hơn</span>
        </button>

        {/* RÚT GỌN */}
        <button
          onClick={() => onRefine('shorten')}
          disabled={isLoading}
          type="button"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <Minimize2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Rút gọn</span>
        </button>

        {/* BỔ SUNG HOẠT ĐỘNG */}
        <button
          onClick={() => onRefine('add_activity')}
          disabled={isLoading}
          type="button"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <ListPlus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bổ sung hoạt động</span>
        </button>

        {/* THAY ĐỔI HÌNH THỨC TỔ CHỨC */}
        <button
          onClick={() => onRefine('change_format')}
          disabled={isLoading}
          type="button"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5 text-orange-400" />
          <span>Thay đổi hình thức</span>
        </button>

        {/* BỔ SUNG SẢN PHẨM */}
        <button
          onClick={() => onRefine('add_product')}
          disabled={isLoading}
          type="button"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <PackagePlus className="w-3.5 h-3.5 text-pink-400" />
          <span>Bổ sung sản phẩm</span>
        </button>

        {/* TÙY CHỌN YÊU CẦU RIÊNG */}
        <button
          onClick={() => setShowCustomBox(!showCustomBox)}
          type="button"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <span>Yêu cầu tùy chỉnh...</span>
        </button>
      </div>

      {/* Custom prompt input box */}
      {showCustomBox && (
        <form onSubmit={handleCustomSubmit} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Nhập yêu cầu chỉnh sửa riêng (ví dụ: Thêm trò chơi đố vui có thưởng ở phần khởi động)..."
            className="flex-1 bg-slate-800 text-white placeholder-slate-400 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !customPrompt.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Thực hiện
          </button>
        </form>
      )}

      {isLoading && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-sky-300 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>AI đang phân tích và cập nhật giáo án... Vui lòng chờ vài giây.</span>
        </div>
      )}
    </div>
  );
};
