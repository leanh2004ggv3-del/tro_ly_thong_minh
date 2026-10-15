import React, { useState } from 'react';
import {
  DIGITAL_COMPETENCIES,
  AI_COMPETENCIES,
  DigitalCompetencyItem,
  AiCompetencyItem,
} from '../data/digitalAndAiCompetencies';
import {
  BookOpen,
  Cpu,
  Search,
  X,
  Copy,
  Check,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CompetencyLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompetency?: (type: 'nls' | 'nlai', code: string, text: string) => void;
  currentGrade?: string;
}

export const CompetencyLookupModal: React.FC<CompetencyLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectCompetency,
  currentGrade = '9',
}) => {
  const [activeTab, setActiveTab] = useState<'nls' | 'nlai' | 'legal'>('nls');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>(currentGrade);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredNls = DIGITAL_COMPETENCIES.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const filteredNlai = AI_COMPETENCIES.filter((item) => {
    const matchGrade = selectedGradeFilter === 'all' || item.grade === selectedGradeFilter;
    const matchSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <FileCheck2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>BẢNG TRA CỨU NĂNG LỰC SỐ (NLS) &amp; NĂNG LỰC AI (NLAI)</span>
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Căn cứ: Thông tư 02/2025/TT-BGDĐT &bull; Công văn 3456/BGDĐT-GDPT &bull; Quyết định 2422/QĐ-BGDĐT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 pt-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('nls')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t-2 ${
                activeTab === 'nls'
                  ? 'bg-white text-rose-700 border-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <span>1. Khung Năng lực số (TT 02 &amp; CV 3456)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nlai')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t-2 ${
                activeTab === 'nlai'
                  ? 'bg-white text-blue-700 border-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Khung Năng lực AI (QĐ 2422)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('legal')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t-2 ${
                activeTab === 'legal'
                  ? 'bg-white text-indigo-700 border-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. Văn bản pháp lý &amp; Quy ước mã hóa</span>
            </button>
          </div>

          {/* Quick Search Box */}
          <div className="pb-2 flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã hoặc từ khóa..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white w-48 sm:w-60 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: NĂNG LỰC SỐ (TT02 & CV 3456) */}
          {activeTab === 'nls' && (
            <div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-4 text-xs text-rose-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Quy ước màu sắc:</strong> Toàn bộ nội dung tích hợp Năng lực số (NLS) trong giáo án sẽ được hiển thị bằng <span className="font-bold text-rose-600 underline">chữ màu đỏ</span>.
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    Mã chỉ báo năng lực bao gồm: Số thứ tự miền năng lực + TC1 (Khối 6-7) hoặc TC2 (Khối 8-9) + Thứ tự chữ cái (ví dụ: <code>NLS 2.5.TC2b</code>: Thảo luận chiến lược giao tiếp trên môi trường số, Stop &amp; Think).
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-3 w-28 text-rose-700">Mã NLS</th>
                      <th className="p-3 w-56">Miền &amp; Năng lực thành phần</th>
                      <th className="p-3">Mô tả chỉ báo năng lực</th>
                      <th className="p-3 w-24 text-center">Khối lớp</th>
                      <th className="p-3 w-24 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredNls.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-rose-600">
                          {item.code}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-900 block">{item.subDomain}</span>
                          <span className="text-[11px] text-slate-500">{item.domain}</span>
                        </td>
                        <td className="p-3 text-slate-800 leading-relaxed">
                          {item.description}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            Lớp {item.applicableGrades}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopy(`NLS ${item.code}`)}
                              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
                              title="Sao chép mã"
                            >
                              {copiedCode === `NLS ${item.code}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {onSelectCompetency && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectCompetency('nls', `NLS ${item.code}`, item.description);
                                  onClose();
                                }}
                                className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors"
                              >
                                Chọn
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: NĂNG LỰC TRÍ TUỆ NHÂN TẠO (QĐ 2422) */}
          {activeTab === 'nlai' && (
            <div>
              {/* Grade Filter Pill Buttons */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-600">Lọc theo khối lớp:</span>
                  {(['6', '7', '8', '9', 'all'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGradeFilter(g)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedGradeFilter === g
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {g === 'all' ? 'Tất cả 6-9' : `Khối ${g}`}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quy ước màu sắc: Tích hợp NLAI được hiển thị <span className="underline">chữ màu xanh dương</span></span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-3 w-24 text-blue-700">Mã NL AI</th>
                      <th className="p-3 w-20 text-center">Khối</th>
                      <th className="p-3 w-56">Mạch nội dung &amp; Chủ đề</th>
                      <th className="p-3">Yêu cầu cần đạt</th>
                      <th className="p-3 w-24 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredNlai.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-600">
                          {item.code}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                            Lớp {item.grade}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-900 block">{item.topicName}</span>
                          <span className="text-[11px] text-slate-500">{item.domain}</span>
                        </td>
                        <td className="p-3 text-slate-800 leading-relaxed">
                          {item.requirement}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopy(`NLAI ${item.code}`)}
                              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
                              title="Sao chép mã"
                            >
                              {copiedCode === `NLAI ${item.code}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {onSelectCompetency && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectCompetency('nlai', `NLAI ${item.code}`, item.requirement);
                                  onClose();
                                }}
                                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors"
                              >
                                Chọn
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: VĂN BẢN PHÁP LÝ & QUY ƯỚC */}
          {activeTab === 'legal' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  1. Thông tư số 02/2025/TT-BGDĐT &amp; Công văn số 3456/BGDĐT-GDPT
                </h4>
                <p className="mb-2">
                  Quy định Khung năng lực số cho người học gồm <strong>6 miền năng lực</strong> với <strong>24 năng lực thành phần</strong>:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li><strong>Khai thác dữ liệu và thông tin:</strong> Duyệt, tìm kiếm, đánh giá và quản lý dữ liệu số.</li>
                  <li><strong>Giao tiếp và hợp tác trong môi trường số:</strong> Tương tác, chia sẻ, trách nhiệm công dân, hợp tác, quy tắc ứng xử trên mạng, quản lý danh tính số.</li>
                  <li><strong>Sáng tạo nội dung số:</strong> Phát triển, tích hợp, bản quyền, lập trình.</li>
                  <li><strong>An toàn:</strong> Bảo vệ thiết bị, bảo vệ dữ liệu cá nhân &amp; quyền riêng tư, bảo vệ sức khỏe và an sinh số, bảo vệ môi trường.</li>
                  <li><strong>Giải quyết vấn đề:</strong> Kỹ thuật, nhu cầu &amp; giải pháp công nghệ, sáng tạo công nghệ số, cải thiện NLS.</li>
                  <li><strong>Ứng dụng trí tuệ nhân tạo:</strong> Hiểu biết về AI, sử dụng AI có đạo đức và trách nhiệm, đánh giá các công cụ AI.</li>
                </ol>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  2. Quyết định số 2422/QĐ-BGDĐT về Khung giáo dục Trí tuệ nhân tạo (AI)
                </h4>
                <p className="mb-2">
                  Khung gồm 4 mạch kiến thức chính tương ứng 4 miền năng lực:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><strong>Mạch A:</strong> Tư duy lấy con người làm trung tâm (A1: Tính chủ động, A2: AI vì sự tiến bộ, A3: Công dân trong kỉ nguyên AI).</li>
                  <li><strong>Mạch B:</strong> Đạo đức AI (B1: Khía cạnh đạo đức, B2: Sử dụng an toàn &amp; có trách nhiệm, B3: Nguyên tắc đạo đức &amp; trách nhiệm xã hội).</li>
                  <li><strong>Mạch C:</strong> Các kĩ thuật và ứng dụng AI (C1: Đặc điểm, C2: Ứng dụng, C3: Công nghệ, C4: Dữ liệu, C5: Kĩ thuật &amp; thuật toán).</li>
                  <li><strong>Mạch D:</strong> Thiết kế hệ thống AI (D1: Nhận diện &amp; giải pháp, D2: Cấu trúc, tương tác &amp; cải tiến).</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900">
                <h4 className="font-bold text-xs uppercase mb-1">
                  Quy định định dạng hiển thị &amp; tô màu trong Kế hoạch bài dạy
                </h4>
                <p>
                  - Mọi nội dung liên quan đến <strong>Năng lực số (NLS)</strong>: Bắt buộc được làm nổi bật với <span className="font-bold text-rose-600">MÀU ĐỎ (#DC2626)</span>.<br />
                  - Mọi nội dung liên quan đến <strong>Trí tuệ nhân tạo (NLAI)</strong>: Bắt buộc được làm nổi bật với <span className="font-bold text-blue-600">MÀU XANH DƯƠNG (#1D4ED8)</span>.<br />
                  - Cả trên giao diện xem trước lẫn tệp Word xuất ra (.docx) đều áp dụng chính xác mã màu này.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Hệ thống tự động đồng bộ theo TT 02/2025/TT-BGDĐT &bull; CV 3456/BGDĐT-GDPT &bull; QĐ 2422/QĐ-BGDĐT
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-slate-800 transition-colors"
          >
            Đóng bảng tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};
