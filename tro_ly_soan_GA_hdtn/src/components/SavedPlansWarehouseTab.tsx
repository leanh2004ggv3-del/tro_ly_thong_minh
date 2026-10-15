import React, { useState } from 'react';
import { SavedLessonPlanItem, LessonPlan } from '../types/lessonPlan';
import {
  Folder,
  Search,
  Download,
  Trash2,
  Copy,
  Edit2,
  Calendar,
  School,
  User,
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface SavedPlansWarehouseTabProps {
  savedPlans: SavedLessonPlanItem[];
  onOpenPlan: (plan: LessonPlan) => void;
  onClonePlan: (planItem: SavedLessonPlanItem) => void;
  onDeletePlan: (planId: string) => void;
  onExportWord: (plan: LessonPlan) => void;
  onSwitchToCreate: () => void;
}

export const SavedPlansWarehouseTab: React.FC<SavedPlansWarehouseTabProps> = ({
  savedPlans,
  onOpenPlan,
  onClonePlan,
  onDeletePlan,
  onExportWord,
  onSwitchToCreate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  const filteredPlans = savedPlans.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.topic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.teacherName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.schoolName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = filterGrade === 'all' || item.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-700/50">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
              TAB 5: KHO GIÁO ÁN ĐÃ TẠO
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              LƯU TRỮ, TRA CỨU VÀ TÁI SỬ DỤNG GIÁO ÁN
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl leading-relaxed">
              Quản lý toàn bộ danh sách giáo án đã tạo theo các khối lớp, tuần, môn học. Cho phép mở lại để chỉnh sửa, sao chép sang lớp khác hoặc xuất file Word ngay lập tức.
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Soạn giáo án mới</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên bài, chủ đề, môn học, giáo viên, trường..."
            className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">Lọc khối lớp:</span>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả các khối</option>
            <option value="6">Lớp 6</option>
            <option value="7">Lớp 7</option>
            <option value="8">Lớp 8</option>
            <option value="9">Lớp 9</option>
          </select>
        </div>
      </div>

      {/* List of Plans */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Lớp {item.grade} • {item.week}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.updatedAt || item.createdAt}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-2 line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs font-medium text-slate-600 mt-1 line-clamp-1 italic">
                  {item.topic}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>GV: {item.teacherName || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{item.schoolName || 'Chưa cập nhật trường'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPlan(item.plan)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Mở xem &amp; sửa</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onExportWord(item.plan)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Xuất Word (.docx)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onClonePlan(item)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Sao chép tạo bản sao mới"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa giáo án "${item.title}" khỏi kho lưu trữ?`)) {
                        onDeletePlan(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Xóa giáo án"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Chưa tìm thấy giáo án nào phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy thử tìm kiếm với từ khóa khác, hoặc nhấn nút bên dưới để tạo và lưu giáo án mới vào kho.
          </p>
          <button
            type="button"
            onClick={onSwitchToCreate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 cursor-pointer"
          >
            Soạn giáo án mới
          </button>
        </div>
      )}

      {/* Storage Note */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
        <strong>Lưu ý về lưu trữ:</strong> Kho giáo án được lưu trữ an toàn trong bộ nhớ trình duyệt (LocalStorage). Để bảo đảm lưu trữ vĩnh viễn trên máy tính, thầy cô nên thường xuyên sử dụng tính năng <strong>"Xuất Word (.docx)"</strong> để lưu giữ tệp bài dạy trên ổ cứng của mình.
      </div>
    </div>
  );
};
