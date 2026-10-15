import React, { useState } from 'react';
import { DIGITAL_AI_STANDARDS, LEGAL_FRAMEWORKS, DigitalAiItem } from '../data/digitalAiStandards';
import {
  X,
  Search,
  BookOpen,
  Cpu,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Filter,
  FileCheck2,
  Sparkles,
  Info
} from 'lucide-react';

interface DigitalAILookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStandard?: (item: DigitalAiItem, targetPeriod?: 'flagSalute' | 'topicActivity' | 'classMeeting') => void;
}

export const DigitalAILookupModal: React.FC<DigitalAILookupModalProps> = ({
  isOpen,
  onClose,
  onSelectStandard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'NLS' | 'NLAI'>('all');
  const [targetInsertPeriod, setTargetInsertPeriod] = useState<'flagSalute' | 'topicActivity' | 'classMeeting'>('topicActivity');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = DIGITAL_AI_STANDARDS.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.behaviorIndicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pedagogicalApplication.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      selectedGrade === 'all' || item.grades.includes(selectedGrade as any);

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesGrade && matchesCategory;
  });

  const handleCopyCode = (item: DigitalAiItem) => {
    const textToCopy = `[${item.category}] - ${item.code}: ${item.title}\n• Biểu hiện: ${item.behaviorIndicator}\n• Căn cứ: ${item.legalBasis}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 shrink-0 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 text-blue-200 mt-0.5">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  CĂN CỨ: TT02 • CV 2422 • CV 3456
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-400/30">
                  NLS: Tô ĐỎ
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  NLAI: Tô XANH DƯƠNG
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                BẢNG TRA CỨU NĂNG LỰC SỐ (NLS) & TRÍ TUỆ NHÂN TẠO (NL AI)
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
                Chuẩn hóa các mã chỉ số, biểu hiện hành vi và quy ước màu sắc tích hợp trong giáo án Hoạt động trải nghiệm, hướng nghiệp 6–9.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Legal Reference Alert Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Văn bản pháp lý hướng dẫn tích hợp:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] leading-relaxed">
            {LEGAL_FRAMEWORKS.map((fw) => (
              <div key={fw.code} className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-bold text-blue-900">{fw.code}:</span>{' '}
                <span className="text-slate-600">{fw.summary}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 shrink-0 flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã (NLS 2.5, NLAI 9.A3...), từ khóa (Stop & think, bảo mật, cảm xúc, AI...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lớp:
            </span>
            {['all', '6', '7', '8', '9'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g === 'all' ? 'Tất cả lớp' : `Lớp ${g}`}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả loại
            </button>
            <button
              onClick={() => setSelectedCategory('NLS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === 'NLS'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              NLS (Đỏ)
            </button>
            <button
              onClick={() => setSelectedCategory('NLAI')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === 'NLAI'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              NLAI (Xanh)
            </button>
          </div>

          {/* Target Period Selector */}
          {onSelectStandard && (
            <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-1 rounded-xl">
              <span className="text-xs font-semibold text-slate-600 px-1">Chèn vào:</span>
              {[
                { key: 'flagSalute' as const, label: 'Tiết 1 (SHDC)' },
                { key: 'topicActivity' as const, label: 'Tiết 2 (HĐGD)' },
                { key: 'classMeeting' as const, label: 'Tiết 3 (SHL)' },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setTargetInsertPeriod(p.key)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    targetInsertPeriod === p.key
                      ? 'bg-blue-800 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Tìm thấy {filteredItems.length} chuẩn năng lực phù hợp</span>
            <span className="italic">
              Quy ước mẫu: Tô màu chữ và viền đỏ cho NLS, xanh dương cho NLAI
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm font-medium">
                Không tìm thấy chỉ số năng lực nào phù hợp với bộ lọc hiện tại.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('all');
                  setSelectedCategory('all');
                }}
                className="mt-3 px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isNLS = item.category === 'NLS';
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl p-4 sm:p-5 border transition-all duration-200 hover:shadow-md ${
                    isNLS
                      ? 'border-rose-200 hover:border-rose-400 bg-rose-50/20'
                      : 'border-blue-200 hover:border-blue-400 bg-blue-50/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 shadow-2xs ${
                          isNLS
                            ? 'bg-rose-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isNLS ? <ShieldCheck className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                        {item.code} ({isNLS ? 'MÀU ĐỎ' : 'MÀU XANH DƯƠNG'})
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.domain}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Áp dụng: Lớp {item.grades.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleCopyCode(item)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Sao chép nội dung"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      {onSelectStandard && (
                        <button
                          onClick={() => {
                            onSelectStandard(item, targetInsertPeriod);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                            isNLS
                              ? 'bg-rose-600 hover:bg-rose-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Chèn vào {targetInsertPeriod === 'flagSalute' ? 'Tiết 1 (SHDC)' : targetInsertPeriod === 'topicActivity' ? 'Tiết 2 (HĐGD)' : 'Tiết 3 (SHL)'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3
                      className={`text-base font-bold mb-1.5 ${
                        isNLS ? 'text-rose-800' : 'text-blue-800'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2.5">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          🎯 Biểu hiện hành vi cụ thể của học sinh:
                        </span>
                        <p className="text-slate-700">{item.behaviorIndicator}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          💡 Gợi ý tổ chức hoạt động trải nghiệm:
                        </span>
                        <p className="text-slate-700">{item.pedagogicalApplication}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="font-medium">
                        Căn cứ pháp lý: <strong className="text-slate-700">{item.legalBasis}</strong>
                      </span>
                      <span
                        className={`font-semibold ${
                          isNLS ? 'text-rose-600' : 'text-blue-600'
                        }`}
                      >
                        Quy cách trình bày văn bản: Chữ {item.colorName} ({item.colorHex})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600 hidden sm:block">
            Mẹo: Giáo viên có thể nhấp <strong>"Chèn vào Giáo án"</strong> để áp dụng trực tiếp mã chỉ số vào Tiết 2.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors ml-auto cursor-pointer"
          >
            Đóng bảng tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};
