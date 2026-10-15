import React, { useState } from 'react';
import { ActivityStep } from '../types/lessonPlan';
import { Edit3, Check, Plus, Trash2, HelpCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface TwoColumnActivityTableProps {
  steps: ActivityStep[];
  onUpdateSteps: (newSteps: ActivityStep[]) => void;
  isEditable?: boolean;
}

export const TwoColumnActivityTable: React.FC<TwoColumnActivityTableProps> = ({
  steps,
  onUpdateSteps,
  isEditable = true,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleStepChange = (index: number, field: keyof ActivityStep, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateSteps(updated);
  };

  const handleAddStep = () => {
    const newStep: ActivityStep = {
      stepId: `step-${Date.now()}`,
      stepName: `${steps.length + 1}. Hoạt động ${steps.length + 1}: [Tên hoạt động] (10 phút)`,
      objective: 'Tạo không khí cởi mở, gợi mở vấn đề bài học cho học sinh.',
      method: 'Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề, thảo luận nhóm.',
      teacherStudentAction: `* Mục tiêu: Tạo không khí cởi mở, gợi mở vấn đề bài học cho học sinh.
* Phương pháp thực hiện: Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề, thảo luận nhóm.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên trình chiếu tư liệu/hình ảnh/nhiệm vụ học tập và đặt câu hỏi gợi mở: "..."
+ Học sinh tiếp nhận nhiệm vụ, lắng nghe yêu cầu của giáo viên.
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh suy nghĩ cá nhân, thảo luận theo cặp đôi/nhóm để hoàn thành nhiệm vụ.
+ Giáo viên quan sát, gợi mở và hỗ trợ các nhóm gặp khó khăn.
- Bước 3: Báo cáo, thảo luận
+ Đại diện 2 - 3 nhóm học sinh xung phong phát biểu trình bày kết quả.
+ Các nhóm khác chú ý lắng nghe, nhận xét và đóng góp ý kiến phản biện tích cực.
- Bước 4: Kết luận, nhận định
+ Giáo viên nhận xét tinh thần học tập, chuẩn hóa kiến thức cốt lõi của hoạt động.
+ Học sinh tiếp thu, ghi nhớ các nội dung trọng tâm vào vở.`,
      expectedProduct: `- Học sinh hào hứng tham gia quan sát và tiếp nhận nhiệm vụ bài học.
- Học sinh tự do phát biểu suy nghĩ cá nhân, trả lời đầy đủ câu hỏi gợi mở.
- Tạo tâm thế cởi mở, sẵn sàng tiếp nhận kiến thức mới.`,
    };
    onUpdateSteps([...steps, newStep]);
    setEditingIndex(steps.length);
  };

  const handleDeleteStep = (index: number) => {
    if (confirm('Thầy/Cô có chắc chắn muốn xóa hoạt động này không?')) {
      const updated = steps.filter((_, i) => i !== index);
      onUpdateSteps(updated);
      if (editingIndex === index) setEditingIndex(null);
    }
  };

  const handleInsertTag = (
    index: number,
    field: 'teacherStudentAction' | 'expectedProduct',
    tagType: 'NLS' | 'NLAI'
  ) => {
    const currentText = steps[index][field] || '';
    let snippet = '';
    if (tagType === 'NLS') {
      snippet =
        field === 'teacherStudentAction'
          ? '\n[NLS] - Tích hợp NLS (Quy ước ĐỎ): Hướng dẫn học sinh thực hành nguyên tắc "Stop & Think" (Dừng lại và suy nghĩ) trước khi tương tác trên môi trường số.'
          : '\n[NLS] - Tích hợp NLS: Sản phẩm số / Cam kết ứng xử văn minh và bảo vệ dữ liệu cá nhân trên không gian mạng.';
    } else {
      snippet =
        field === 'teacherStudentAction'
          ? '\n[NLAI] - Tích hợp NLAI (Quy ước XANH): Giáo viên gợi mở nhận thức AI là công cụ hỗ trợ, cảm xúc chân thành và sự đồng cảm là năng lực đặc quyền của con người.'
          : '\n[NLAI] - Tích hợp NLAI: Nhận thức phân biệt giá trị giữa công cụ AI và sự tôn trọng chân thành giữa con người.';
    }
    handleStepChange(index, field, currentText + snippet);
  };

  const handleInsertStandardTemplate = (index: number) => {
    const template = `* Mục tiêu: Tạo không khí cởi mở, hướng dẫn học sinh tiếp nhận và thực hiện nhiệm vụ bài học.
* Phương pháp thực hiện: Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề, thảo luận nhóm.
* Tổ chức thực hiện:
- Bước 1: Chuyển giao nhiệm vụ
+ Giáo viên trình chiếu tư liệu/hình ảnh/nhiệm vụ học tập và đặt câu hỏi gợi mở cụ thể.
+ Học sinh tiếp nhận nhiệm vụ, lắng nghe yêu cầu của giáo viên.
- Bước 2: Thực hiện nhiệm vụ
+ Học sinh suy nghĩ cá nhân, thảo luận theo cặp đôi/nhóm để hoàn thành nhiệm vụ.
+ Giáo viên quan sát, gợi mở và hỗ trợ các nhóm gặp khó khăn.
- Bước 3: Báo cáo, thảo luận
+ Đại diện học sinh xung phong phát biểu trình bày kết quả thảo luận.
+ Các nhóm khác chú ý lắng nghe, nhận xét và phản biện tích cực.
- Bước 4: Kết luận, nhận định
+ Giáo viên nhận xét tinh thần học tập, chuẩn hóa kiến thức cốt lõi của hoạt động.
+ Học sinh tiếp thu, ghi nhớ các nội dung trọng tâm vào vở.`;
    handleStepChange(index, 'teacherStudentAction', template);
  };

  const renderActionLine = (rawLine: string, lIdx: number) => {
    const line = rawLine.trim();
    if (!line) return null;

    const isNLS =
      line.includes('[NLS]') ||
      line.includes('Tích hợp NLS') ||
      line.includes('NLS 2.') ||
      line.includes('NLS 3.') ||
      line.includes('NLS 4.') ||
      line.includes('NLS 5.') ||
      line.includes('NLS 1.');

    const isNLAI =
      line.includes('[NLAI]') ||
      line.includes('Tích hợp NLAI') ||
      line.includes('NLAI 6.') ||
      line.includes('NLAI 7.') ||
      line.includes('NLAI 8.') ||
      line.includes('NLAI 9.');

    if (isNLS) {
      return (
        <div
          key={lIdx}
          className="text-xs sm:text-sm text-rose-700 font-semibold bg-rose-50/90 p-2 rounded-lg border border-rose-300 my-1.5 leading-relaxed flex items-start gap-2 shadow-xs"
        >
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-600 text-white shrink-0 mt-0.5 tracking-wide">
            NLS (MÀU ĐỎ)
          </span>
          <span className="flex-1">{line.replace(/^\[NLS\]\s*/, '')}</span>
        </div>
      );
    }

    if (isNLAI) {
      return (
        <div
          key={lIdx}
          className="text-xs sm:text-sm text-blue-700 font-semibold bg-blue-50/90 p-2 rounded-lg border border-blue-300 my-1.5 leading-relaxed flex items-start gap-2 shadow-xs"
        >
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-600 text-white shrink-0 mt-0.5 tracking-wide">
            NLAI (MÀU XANH)
          </span>
          <span className="flex-1">{line.replace(/^\[NLAI\]\s*/, '')}</span>
        </div>
      );
    }

    // * Mục tiêu:
    if (
      line.startsWith('* Mục tiêu:') ||
      line.startsWith('• Mục tiêu:') ||
      line.startsWith('Mục tiêu:') ||
      line.startsWith('* Mục tiêu')
    ) {
      const content = line.replace(/^[\*\•]?\s*Mục tiêu[:\s]*/i, '');
      return (
        <div key={lIdx} className="text-xs sm:text-sm text-slate-800 leading-relaxed my-1 flex items-start gap-1.5">
          <span className="font-extrabold text-blue-950 bg-blue-100/70 text-[11px] px-2 py-0.5 rounded border border-blue-200 shrink-0 uppercase tracking-wide">
            * Mục tiêu:
          </span>
          <span className="font-medium text-slate-900">{content}</span>
        </div>
      );
    }

    // * Phương pháp thực hiện:
    if (
      line.startsWith('* Phương pháp thực hiện:') ||
      line.startsWith('• Phương pháp thực hiện:') ||
      line.startsWith('Phương pháp thực hiện:') ||
      line.startsWith('* Phương pháp:') ||
      line.startsWith('• Phương pháp:')
    ) {
      const content = line.replace(/^[\*\•]?\s*(?:Phương pháp thực hiện|Phương pháp)[:\s]*/i, '');
      return (
        <div key={lIdx} className="text-xs sm:text-sm text-slate-800 leading-relaxed my-1 flex items-start gap-1.5">
          <span className="font-extrabold text-emerald-950 bg-emerald-100/70 text-[11px] px-2 py-0.5 rounded border border-emerald-200 shrink-0 uppercase tracking-wide">
            * Phương pháp thực hiện:
          </span>
          <span className="text-slate-800">{content}</span>
        </div>
      );
    }

    // * Tổ chức thực hiện:
    if (
      line.startsWith('* Tổ chức thực hiện:') ||
      line.startsWith('• Tổ chức thực hiện:') ||
      line.startsWith('Tổ chức thực hiện:') ||
      line.startsWith('* Tổ chức thực hiện')
    ) {
      return (
        <div key={lIdx} className="text-xs sm:text-sm font-extrabold text-slate-950 mt-2.5 mb-1 uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-blue-700 rounded-xs"></span>
          <span>* Tổ chức thực hiện:</span>
        </div>
      );
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
      return (
        <div key={lIdx} className="pt-2 pb-0.5">
          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 text-[11px] font-black border border-indigo-200 shadow-2xs">
              Bước 1
            </span>
            <span className="font-bold text-slate-900">Chuyển giao nhiệm vụ</span>
          </div>
          {content ? <div className="pl-3 mt-0.5 text-slate-800 text-xs sm:text-sm leading-relaxed">{content}</div> : null}
        </div>
      );
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
      return (
        <div key={lIdx} className="pt-2 pb-0.5">
          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-black border border-amber-200 shadow-2xs">
              Bước 2
            </span>
            <span className="font-bold text-slate-900">Thực hiện nhiệm vụ</span>
          </div>
          {content ? <div className="pl-3 mt-0.5 text-slate-800 text-xs sm:text-sm leading-relaxed">{content}</div> : null}
        </div>
      );
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
      return (
        <div key={lIdx} className="pt-2 pb-0.5">
          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-900 text-[11px] font-black border border-sky-200 shadow-2xs">
              Bước 3
            </span>
            <span className="font-bold text-slate-900">Báo cáo, thảo luận</span>
          </div>
          {content ? <div className="pl-3 mt-0.5 text-slate-800 text-xs sm:text-sm leading-relaxed">{content}</div> : null}
        </div>
      );
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
      return (
        <div key={lIdx} className="pt-2 pb-0.5">
          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-black border border-emerald-200 shadow-2xs">
              Bước 4
            </span>
            <span className="font-bold text-slate-900">Kết luận, nhận định</span>
          </div>
          {content ? <div className="pl-3 mt-0.5 text-slate-800 text-xs sm:text-sm leading-relaxed">{content}</div> : null}
        </div>
      );
    }

    // Sub-tasks with +
    if (line.startsWith('+')) {
      return (
        <div key={lIdx} className="pl-2 text-slate-800 leading-relaxed text-xs sm:text-sm">
          {line}
        </div>
      );
    }

    // Images or Scenarios
    if (line.startsWith('Hình 1:') || line.startsWith('Hình 2:') || line.startsWith('Hình 3:') || line.startsWith('Tình huống 1:') || line.startsWith('Tình huống 2:')) {
      return (
        <div key={lIdx} className="pl-4 text-slate-700 italic text-xs sm:text-sm">
          {line}
        </div>
      );
    }

    return (
      <div key={lIdx} className={line.startsWith('-') || line.startsWith('•') ? 'pl-2 text-slate-800 text-xs sm:text-sm' : 'text-slate-700 text-xs sm:text-sm'}>
        {line}
      </div>
    );
  };

  const renderProductLine = (prod: string, pIdx: number) => {
    const isNLS =
      prod.includes('[NLS]') ||
      prod.includes('Tích hợp NLS') ||
      prod.includes('NLS 2.') ||
      prod.includes('NLS 3.') ||
      prod.includes('NLS 4.') ||
      prod.includes('NLS 5.') ||
      prod.includes('NLS 1.');

    const isNLAI =
      prod.includes('[NLAI]') ||
      prod.includes('Tích hợp NLAI') ||
      prod.includes('NLAI 6.') ||
      prod.includes('NLAI 7.') ||
      prod.includes('NLAI 8.') ||
      prod.includes('NLAI 9.');

    if (isNLS) {
      return (
        <div
          key={pIdx}
          className="text-xs sm:text-sm text-rose-700 font-semibold bg-rose-50/90 p-2 rounded-lg border border-rose-300 my-1 flex items-start gap-1.5 shadow-xs"
        >
          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-600 text-white shrink-0 mt-0.5">
            NLS (ĐỎ)
          </span>
          <span>{prod.replace(/^\[NLS\]\s*/, '')}</span>
        </div>
      );
    }

    if (isNLAI) {
      return (
        <div
          key={pIdx}
          className="text-xs sm:text-sm text-blue-700 font-semibold bg-blue-50/90 p-2 rounded-lg border border-blue-300 my-1 flex items-start gap-1.5 shadow-xs"
        >
          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-blue-600 text-white shrink-0 mt-0.5">
            NLAI (XANH)
          </span>
          <span>{prod.replace(/^\[NLAI\]\s*/, '')}</span>
        </div>
      );
    }

    const cleanText = prod.replace(/^[\-\•\*]\s*/, '').trim();
    if (!cleanText) return null;

    return (
      <div key={pIdx} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed my-0.5">
        <span className="text-slate-700 font-bold shrink-0">-</span>
        <span>{cleanText}</span>
      </div>
    );
  };

  // Helper to compile all action lines ensuring standard structure
  const getCompiledActionLines = (step: ActivityStep): string[] => {
    const rawAction = step.teacherStudentAction || '';
    const hasObjectiveInAction = rawAction.includes('* Mục tiêu:') || rawAction.includes('• Mục tiêu:') || rawAction.includes('Mục tiêu:');
    const hasMethodInAction = rawAction.includes('* Phương pháp thực hiện:') || rawAction.includes('• Phương pháp thực hiện:') || rawAction.includes('Phương pháp thực hiện:');
    const hasOrgInAction = rawAction.includes('* Tổ chức thực hiện:') || rawAction.includes('• Tổ chức thực hiện:') || rawAction.includes('Tổ chức thực hiện:');

    const lines: string[] = [];

    if (!hasObjectiveInAction && step.objective) {
      lines.push(`* Mục tiêu: ${step.objective}`);
    }

    if (!hasMethodInAction) {
      lines.push(`* Phương pháp thực hiện: ${step.method || 'Phương pháp trực quan (quan sát hình ảnh), vấn đáp gợi mở và nêu vấn đề, thảo luận nhóm.'}`);
    }

    if (!hasOrgInAction && !hasObjectiveInAction) {
      lines.push('* Tổ chức thực hiện:');
    }

    lines.push(...rawAction.split('\n'));
    return lines.filter((l) => l.trim().length > 0);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-6">
      {/* Table Banner */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
            2C
          </span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Cấu trúc bảng 2 cột chuẩn Công văn 5512 & GDPT 2018
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1 text-rose-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            Tích hợp NLS (Tô Đỏ)
          </span>
          <span className="flex items-center gap-1 text-blue-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Tích hợp NLAI (Tô Xanh)
          </span>
          {isEditable && (
            <button
              onClick={handleAddStep}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg transition-colors ml-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm hoạt động</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory 2-Column Table matching teacher's sample */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1B365D] text-white text-sm font-bold border-b border-slate-300">
              <th className="w-[60%] p-3.5 border-r border-blue-900 text-center uppercase tracking-wider text-white font-bold">
                HOẠT ĐỘNG CỦA GV VÀ HS
              </th>
              <th className="w-[40%] p-3.5 text-center uppercase tracking-wider text-white font-bold">
                DỰ KIẾN SẢN PHẨM
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700 text-sm">
            {steps.map((step, idx) => {
              const isEditing = editingIndex === idx;
              const actionLines = getCompiledActionLines(step);

              return (
                <tr key={step.stepId || idx} className="hover:bg-slate-50/60 transition-colors align-top">
                  {/* Left Column: Hoạt động của GV - HS */}
                  <td className="p-4 border-r border-slate-200 relative group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={step.stepName}
                          onChange={(e) => handleStepChange(idx, 'stepName', e.target.value)}
                          className="w-full font-bold text-slate-900 border border-blue-400 rounded px-2 py-1 text-sm bg-blue-50/50"
                          placeholder="Tên hoạt động (ví dụ: 1. Hoạt động 1: Khởi động (5 phút))..."
                        />
                      ) : (
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {step.stepName}
                        </h4>
                      )}

                      {isEditable && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingIndex(isEditing ? null : idx)}
                            type="button"
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                            title={isEditing ? 'Lưu chỉnh sửa' : 'Chỉnh sửa hoạt động này'}
                          >
                            {isEditing ? <Check className="w-4 h-4 text-emerald-600 font-bold" /> : <Edit3 className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteStep(idx)}
                            type="button"
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Xóa hoạt động"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Teacher - Student Action Content */}
                    {isEditing ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Nội dung chi tiết hoạt động GV - HS (* Mục tiêu, * Phương pháp thực hiện, * Tổ chức thực hiện: - Bước 1 đến Bước 4):
                          </label>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleInsertStandardTemplate(idx)}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-900 hover:bg-indigo-200 border border-indigo-300 cursor-pointer flex items-center gap-1"
                              title="Tự động điền khung Mục tiêu, Phương pháp thực hiện và Tổ chức thực hiện 4 bước"
                            >
                              <span>★ Khung 4 bước CV 5512</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTag(idx, 'teacherStudentAction', 'NLS')}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300 cursor-pointer"
                            >
                              + [NLS] Đỏ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTag(idx, 'teacherStudentAction', 'NLAI')}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 cursor-pointer"
                            >
                              + [NLAI] Xanh
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={12}
                          value={step.teacherStudentAction}
                          onChange={(e) => handleStepChange(idx, 'teacherStudentAction', e.target.value)}
                          className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-relaxed"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs sm:text-sm leading-relaxed text-slate-800">
                        {actionLines.map((line, lIdx) => renderActionLine(line, lIdx))}
                      </div>
                    )}
                  </td>

                  {/* Right Column: Dự kiến sản phẩm */}
                  <td className="p-4 bg-slate-50/40">
                    {isEditing ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Dự kiến sản phẩm:
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleInsertTag(idx, 'expectedProduct', 'NLS')}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300 cursor-pointer"
                            >
                              + Chèn [NLS] Đỏ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTag(idx, 'expectedProduct', 'NLAI')}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 cursor-pointer"
                            >
                              + Chèn [NLAI] Xanh
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={9}
                          value={step.expectedProduct}
                          onChange={(e) => handleStepChange(idx, 'expectedProduct', e.target.value)}
                          className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {step.expectedProduct.split('\n').filter(Boolean).map((prod, pIdx) =>
                          renderProductLine(prod, pIdx)
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {steps.length === 0 && (
        <div className="p-8 text-center text-slate-400">
          <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p>Chưa có bước nào trong tiến trình hoạt động này.</p>
          <button
            onClick={handleAddStep}
            type="button"
            className="mt-3 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            + Thêm hoạt động đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};
