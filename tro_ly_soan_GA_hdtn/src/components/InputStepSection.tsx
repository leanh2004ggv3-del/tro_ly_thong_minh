import React, { useState, useRef } from 'react';
import { GradeLevel, ActivityCategory, UploadedFileItem, PlanGenerationInput } from '../types/lessonPlan';
import { CURRICULUM_PRESETS, SamplePreset } from '../data/curriculumSamples';
import { DIGITAL_AI_STANDARDS } from '../data/digitalAiStandards';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  FileCheck,
  Sparkles,
  Loader2,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  BookOpen
} from 'lucide-react';

interface InputStepSectionProps {
  onGeneratePlan: (input: PlanGenerationInput) => void;
  onOpenLookupModal?: () => void;
  isLoading: boolean;
}

export const InputStepSection: React.FC<InputStepSectionProps> = ({
  onGeneratePlan,
  onOpenLookupModal,
  isLoading,
}) => {
  // Step 1: Grade Selection
  const [grade, setGrade] = useState<GradeLevel>('7');

  // Step 2: Activity Categories Selection
  const [selectedActivities, setSelectedActivities] = useState<ActivityCategory[]>([
    'flagSalute',
    'topicActivity',
    'classMeeting',
  ]);

  // Step 3: Mode & Document Upload
  const [mode, setMode] = useState<'new' | 'edit_old'>('new');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isParsingDoc, setIsParsingDoc] = useState(false);

  // Common Info
  const [topicName, setTopicName] = useState('Chủ đề 2: Rèn luyện tính kiên trì và sự chăm chỉ');
  const [lessonName, setLessonName] = useState('Rèn luyện tính kiên trì, chăm chỉ trong học tập và cuộc sống');
  const [weekNumber, setWeekNumber] = useState('Tuần 5 - 6');
  const [durationString, setDurationString] = useState('3 tiết');

  // Dedicated NLS & NL AI Input Fields (Bình thường ĐỂ TRỐNG, không tự động tích hợp trừ khi người dùng chọn và điền)
  const [selectedNlsCode, setSelectedNlsCode] = useState('');
  const [nlsContent, setNlsContent] = useState('');
  // Vị trí chọn tích hợp NLS vào hoạt động nào (SHDC, HĐGD, SHL) - mặc định để trống []
  const [nlsTargetActivities, setNlsTargetActivities] = useState<ActivityCategory[]>([]);

  const [selectedNlaiCode, setSelectedNlaiCode] = useState('');
  const [nlaiContent, setNlaiContent] = useState('');
  // Vị trí chọn tích hợp NL AI vào hoạt động nào (SHDC, HĐGD, SHL) - mặc định để trống []
  const [nlaiTargetActivities, setNlaiTargetActivities] = useState<ActivityCategory[]>([]);

  const clearAllIntegration = () => {
    setSelectedNlsCode('');
    setNlsContent('');
    setNlsTargetActivities([]);
    setSelectedNlaiCode('');
    setNlaiContent('');
    setNlaiTargetActivities([]);
  };

  const clearNls = () => {
    setSelectedNlsCode('');
    setNlsContent('');
    setNlsTargetActivities([]);
  };

  const clearNlai = () => {
    setSelectedNlaiCode('');
    setNlaiContent('');
    setNlaiTargetActivities([]);
  };

  const toggleNlsTarget = (cat: ActivityCategory) => {
    setNlsTargetActivities((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleNlaiTarget = (cat: ActivityCategory) => {
    setNlaiTargetActivities((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // 3 Dedicated Input Boxes
  const [flagSaluteNotes, setFlagSaluteNotes] = useState(
    'Tiết Sinh hoạt dưới cờ do GV bộ môn được phân công thực hiện và tổ chức tại lớp học. Lớp chia thành 6 nhóm học sinh. Chủ đề: Tấm gương sáng về lòng kiên trì và tinh thần vượt khó. 6 nhóm thảo luận, chia sẻ thông điệp bài học và phát động phong trào thi đua tại lớp.'
  );
  const [topicActivityNotes, setTopicActivityNotes] = useState(
    'Tên bài: Rèn luyện tính kiên trì và chăm chỉ. Tiết 2 theo phân phối chương trình. Yêu cầu cần đạt: Nhận diện biểu hiện tính kiên trì; tự đánh giá mức độ kiên trì của bản thân; đề xuất và thực hiện Kế hoạch 21 ngày rèn thói quen kiên trì. Hoạt động: Khởi động (Trò chơi Tháp giấy), Khám phá (Phiếu học tập 1), Luyện tập (Sắm vai xử lý trì hoãn), Vận dụng (Kế hoạch 21 ngày).'
  );
  const [classMeetingNotes, setClassMeetingNotes] = useState(
    'Nội dung: Học sinh chia sẻ tiến độ 3 ngày đầu thực hiện Kế hoạch 21 ngày rèn tính kiên trì. Thảo luận các trở ngại (mạng xã hội, game, lười biếng) và thành lập các cặp "Đôi bạn cùng tiến". Giáo viên nhận xét, khen thưởng động viên thi đua.'
  );

  // Old Lesson Plan text if mode is edit_old
  const [oldLessonPlanText, setOldLessonPlanText] = useState('');

  // Preset selector toggle
  const [showPresets, setShowPresets] = useState(false);

  const fileInputRefSGK = useRef<HTMLInputElement>(null);
  const fileInputRefOld = useRef<HTMLInputElement>(null);

  const toggleActivity = (cat: ActivityCategory) => {
    if (selectedActivities.includes(cat)) {
      if (selectedActivities.length === 1) return; // Must keep at least one
      setSelectedActivities(selectedActivities.filter((a) => a !== cat));
    } else {
      setSelectedActivities([...selectedActivities, cat]);
    }
  };

  const handleApplyPreset = (preset: SamplePreset) => {
    setGrade(preset.grade);
    setTopicName(preset.topic);
    setLessonName(preset.lessonTitle);
    setWeekNumber(preset.week);
    setDurationString(preset.duration);
    setFlagSaluteNotes(preset.flagSaluteNotes);
    setTopicActivityNotes(preset.topicActivityNotes);
    setClassMeetingNotes(preset.classMeetingNotes);
    if (preset.nlsTargetActivities) {
      setNlsTargetActivities(preset.nlsTargetActivities);
    }
    if (preset.nlaiTargetActivities) {
      setNlaiTargetActivities(preset.nlaiTargetActivities);
    }
    if (preset.nlsCode) {
      setSelectedNlsCode(preset.nlsCode);
      const matched = DIGITAL_AI_STANDARDS.find((s) => s.code === preset.nlsCode);
      if (matched) {
        setNlsContent(`${matched.title}. Biểu hiện: ${matched.behaviorIndicator}`);
      }
    }
    if (preset.nlaiCode) {
      setSelectedNlaiCode(preset.nlaiCode);
      const matched = DIGITAL_AI_STANDARDS.find((s) => s.code === preset.nlaiCode);
      if (matched) {
        setNlaiContent(`${matched.title}. Biểu hiện: ${matched.behaviorIndicator}`);
      }
    }
    setShowPresets(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: 'sgk' | 'old_lesson') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsParsingDoc(true);

    // Process files sequentially or in parallel
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file-${Date.now()}-${i}`;

      // Inferred MIME type
      let resolvedType = file.type;
      if (!resolvedType || resolvedType === 'application/octet-stream') {
        const lower = file.name.toLowerCase();
        if (lower.endsWith('.pdf')) resolvedType = 'application/pdf';
        else if (lower.endsWith('.docx')) resolvedType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (lower.endsWith('.doc')) resolvedType = 'application/msword';
        else if (lower.endsWith('.txt')) resolvedType = 'text/plain';
        else if (lower.endsWith('.png')) resolvedType = 'image/png';
        else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) resolvedType = 'image/jpeg';
        else if (lower.endsWith('.webp')) resolvedType = 'image/webp';
      }

      // Add file immediately to uploaded list with 'uploading' status
      const initialFileItem: UploadedFileItem = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: resolvedType || 'application/octet-stream',
        category,
        status: 'uploading',
      };
      setUploadedFiles((prev) => [...prev.filter((f) => f.id !== fileId), initialFileItem]);

      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        const resp = await fetch('/api/ai/parse-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            fileName: file.name,
            fileType: resolvedType,
            category,
          }),
        });

        const contentType = resp.headers.get('content-type') || '';
        let data: any = {};
        if (contentType.includes('application/json')) {
          data = await resp.json();
        } else {
          throw new Error('Máy chủ phản hồi không đúng định dạng JSON.');
        }
        const extractedContent = data.textContent || data.extractedText || '';

        if (resp.ok && data.success && extractedContent) {
          setUploadedFiles((prev) =>
            prev.map((f) => {
              if (f.id === fileId) {
                return {
                  ...f,
                  base64Data,
                  textContent: extractedContent,
                  extractedSummary: data.summary || extractedContent.slice(0, 300),
                  status: 'ready',
                };
              }
              return f;
            })
          );

          if (category === 'old_lesson') {
            setOldLessonPlanText(extractedContent);
            setMode('edit_old');
          } else {
            const excerpt = data.summary || (extractedContent.length > 500 ? extractedContent.slice(0, 500) + '...' : extractedContent);
            setTopicActivityNotes((prev) => {
              const snippet = `[Trích xuất từ tài liệu SGK ${file.name}]:\n${excerpt}`;
              return prev ? `${prev}\n\n${snippet}` : snippet;
            });
          }
        } else {
          const errMsg = data.error || 'Không thể trích xuất nội dung từ tệp';
          setUploadedFiles((prev) =>
            prev.map((f) => {
              if (f.id === fileId) {
                return {
                  ...f,
                  status: 'error',
                  errorMessage: errMsg,
                };
              }
              return f;
            })
          );
        }
      } catch (err: any) {
        console.error('File parsing failed:', err);
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileId) {
              return {
                ...f,
                status: 'error',
                errorMessage: err?.message || 'Lỗi khi tải hoặc đọc tệp tin',
              };
            }
            return f;
          })
        );
      }
    }

    setIsParsingDoc(false);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasNls = Boolean(nlsContent.trim() && nlsTargetActivities.length > 0);
    const hasNlai = Boolean(nlaiContent.trim() && nlaiTargetActivities.length > 0);

    const teacherName = (document.getElementById('field-teacher-name') as HTMLInputElement)?.value || 'Đặng Văn Sạch';
    const schoolName = (document.getElementById('field-school-name') as HTMLInputElement)?.value || 'TRƯỜNG THCS TỊNH BIÊN';
    const departmentName = (document.getElementById('field-department-name') as HTMLInputElement)?.value || 'Tổ: Công nghệ - Hướng nghiệp';
    const schoolYear = (document.getElementById('field-school-year') as HTMLInputElement)?.value || '2026 - 2027';
    const semester = (document.getElementById('field-semester') as HTMLInputElement)?.value || 'Học kỳ I';
    const subjectName = (document.getElementById('field-subject-name') as HTMLInputElement)?.value || 'Hoạt động trải nghiệm, hướng nghiệp';
    const textbookName = (document.getElementById('field-textbook-series') as HTMLSelectElement)?.value || 'Kết nối tri thức với cuộc sống';

    onGeneratePlan({
      grade,
      selectedActivities,
      mode,
      topicName,
      lessonName,
      weekNumber,
      durationString,
      teacherName,
      schoolName,
      departmentName,
      schoolYear,
      semester,
      subjectName,
      textbookName,
      selectedNlsCode: hasNls ? selectedNlsCode : '',
      nlsContent: hasNls ? nlsContent.trim() : '',
      nlsTargetActivities: hasNls ? nlsTargetActivities : [],
      selectedNlaiCode: hasNlai ? selectedNlaiCode : '',
      nlaiContent: hasNlai ? nlaiContent.trim() : '',
      nlaiTargetActivities: hasNlai ? nlaiTargetActivities : [],
      flagSaluteNotes,
      topicActivityNotes,
      classMeetingNotes,
      uploadedFiles: uploadedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        category: f.category,
        textContent: f.textContent,
        base64Data: f.base64Data,
      })),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden mb-10">
      {/* Form Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Thiết lập Kế hoạch bài dạy HĐTN, HN 6–9</span>
          </h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Tích hợp Năng lực số (NLS) & Trí tuệ nhân tạo (NL AI) theo TT02, CV 2422 & CV 3456 &bull; Chuẩn bảng 2 cột CV 5512
          </p>
        </div>

        {/* Quick presets button */}
        <button
          onClick={() => setShowPresets(!showPresets)}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/20 transition-all text-white active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gợi ý chủ đề SGK 6-9</span>
          {showPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Preset drawer */}
      {showPresets && (
        <div className="bg-indigo-50/70 p-4 border-b border-indigo-100">
          <div className="text-xs font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Chọn nhanh mẫu chủ đề có sẵn tích hợp NLS và NL AI:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CURRICULUM_PRESETS.map((preset) => (
              <div
                key={preset.grade}
                onClick={() => handleApplyPreset(preset)}
                className="cursor-pointer bg-white p-3 rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                    Lớp {preset.grade}
                  </span>
                  <span className="text-[11px] text-slate-500">{preset.week}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-1">
                  {preset.topic}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{preset.lessonTitle}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    NLS: {preset.nlsCode}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    NLAI: {preset.nlaiCode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* ================= STEP 1: CHỌN LỚP ================= */}
        <div className="border-b border-slate-150 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold shadow-xs">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              BƯỚC 1. CHỌN LỚP <span className="text-red-500">*</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">(Bắt buộc chọn trước khi soạn)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['6', '7', '8', '9'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`p-3.5 rounded-xl border-2 font-bold text-base transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  grade === g
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Lớp {g}</span>
                <span className="text-[11px] font-normal text-slate-500">GDPT 2018</span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= STEP 2: CHỌN LOẠI HOẠT ĐỘNG ================= */}
        <div className="border-b border-slate-150 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold shadow-xs">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              BƯỚC 2. CHỌN LOẠI HOẠT ĐỘNG <span className="text-red-500">*</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">(Có thể chọn một hoặc cả 3 loại)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Flag Salute */}
            <div
              onClick={() => toggleActivity('flagSalute')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedActivities.includes('flagSalute')
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm tracking-wide">
                    SINH HOẠT DƯỚI CỜ
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes('flagSalute')}
                    readOnly
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tổ chức trực tiếp tại lớp học (GV bộ môn điều hành, lớp chia 6 nhóm thảo luận và báo cáo).
                </p>
              </div>
              <span className="mt-3 text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md inline-block w-fit">
                Tiết 1 • Tại lớp học
              </span>
            </div>

            {/* Topic Activity */}
            <div
              onClick={() => toggleActivity('topicActivity')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedActivities.includes('topicActivity')
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm tracking-wide">
                    HOẠT ĐỘNG GD THEO CHỦ ĐỀ
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes('topicActivity')}
                    readOnly
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khởi động &rarr; Khám phá &rarr; Luyện tập &rarr; Vận dụng (Tích hợp NLS Đỏ &amp; NL AI Xanh).
                </p>
              </div>
              <span className="mt-3 text-[11px] font-semibold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md inline-block w-fit">
                Tiết 2 • Tích hợp NLS &amp; NLAI
              </span>
            </div>

            {/* Class Meeting */}
            <div
              onClick={() => toggleActivity('classMeeting')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedActivities.includes('classMeeting')
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm tracking-wide">
                    SINH HOẠT LỚP
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes('classMeeting')}
                    readOnly
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Phản hồi kết quả vận dụng, thảo luận nề nếp, cam kết văn hóa lớp học đời thực &amp; môi trường số.
                </p>
              </div>
              <span className="mt-3 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block w-fit">
                Tiết 3 • Bản cam kết A0
              </span>
            </div>
          </div>
        </div>

        {/* ================= STEP 3: CUNG CẤP TÀI LIỆU ================= */}
        <div className="border-b border-slate-150 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold shadow-xs">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              BƯỚC 3. CUNG CẤP TÀI LIỆU &amp; THÔNG TIN BÀI DẠY
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-slate-700">
              <input
                type="radio"
                name="mode"
                checked={mode === 'new'}
                onChange={() => setMode('new')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Soạn mới giáo án (Từ tài liệu SGK / ghi chú)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-slate-700">
              <input
                type="radio"
                name="mode"
                checked={mode === 'edit_old'}
                onChange={() => setMode('edit_old')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Tải giáo án cũ lên để chuẩn hóa sang bảng 2 cột 5512</span>
            </label>
          </div>

          {/* Upload Area */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-dashed border-slate-300 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <input
                type="file"
                ref={fileInputRefSGK}
                onChange={(e) => handleFileUpload(e, 'sgk')}
                accept=".docx,.doc,.pdf,.txt,image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRefSGK.current?.click()}
                disabled={isParsingDoc}
                className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-slate-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {isParsingDoc ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-blue-600" />
                )}
                <span>+ TẢI SGK / TÀI LIỆU NỘI DUNG (Word, PDF, Ảnh, Text)</span>
              </button>

              <input
                type="file"
                ref={fileInputRefOld}
                onChange={(e) => handleFileUpload(e, 'old_lesson')}
                accept=".docx,.doc,.pdf,.txt,image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRefOld.current?.click()}
                disabled={isParsingDoc}
                className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-slate-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {isParsingDoc ? (
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                ) : (
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                )}
                <span>+ TẢI GIÁO ÁN CŨ CẦN CHỈNH SỬA (Word, PDF)</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3 text-center sm:text-left">
              💡 Hỗ trợ: Sách giáo khoa PDF, Word (.docx, .doc), ảnh chụp trang sách (.png, .jpg), tệp .txt. Hệ thống sẽ trích xuất nội dung văn bản tự động để làm căn cứ bài dạy.
            </p>

            {/* Uploaded File List */}
            {uploadedFiles.length > 0 ? (
              <div className="space-y-2 pt-1">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      file.status === 'ready'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : file.status === 'uploading'
                        ? 'bg-blue-50/80 border-blue-200 text-blue-950 animate-pulse'
                        : 'bg-red-50/80 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {file.status === 'uploading' ? (
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                        ) : file.status === 'ready' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            file.category === 'sgk'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {file.category === 'sgk' ? 'Tài liệu SGK' : 'Giáo án cũ'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Xóa tệp"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {file.status === 'uploading' && (
                      <div className="mt-1.5 text-[11px] text-blue-700 flex items-center gap-1.5">
                        <span>Đang đọc và trích xuất nội dung văn bản từ tệp...</span>
                      </div>
                    )}

                    {file.status === 'ready' && file.textContent && (
                      <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px]">
                        <div className="font-semibold text-emerald-900 flex items-center gap-1 mb-1">
                          <span>✓ Trích xuất thành công ({file.textContent.length.toLocaleString('vi-VN')} ký tự):</span>
                        </div>
                        <p className="line-clamp-2 italic text-slate-600 bg-white/80 p-2 rounded border border-emerald-100 font-sans">
                          "{file.extractedSummary || file.textContent.slice(0, 200)}..."
                        </p>
                      </div>
                    )}

                    {file.status === 'error' && (
                      <div className="mt-1.5 text-[11px] text-red-700 flex items-center gap-1.5">
                        <span>
                          {file.errorMessage || 'Lỗi đọc tệp. Vui lòng thử chuyển tệp sang dạng .docx hoặc sao chép nội dung dán vào ô bên dưới.'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-slate-400">
                Chưa có tài liệu nào được tải lên (Có thể nhập trực tiếp vào các ô bên dưới)
              </div>
            )}

            {mode === 'edit_old' && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Nội dung Giáo án cũ cần chuẩn hóa sang bảng 2 cột 5512:
                </label>
                <textarea
                  rows={4}
                  value={oldLessonPlanText}
                  onChange={(e) => setOldLessonPlanText(e.target.value)}
                  placeholder="Dán nội dung giáo án cũ vào đây nếu không tải tệp..."
                  className="w-full text-xs font-mono p-2.5 border border-amber-300 rounded-lg bg-amber-50/30"
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= KHU VỰC THÔNG TIN HÀNH CHÍNH & MÔN HỌC (21 TRƯỜNG ĐẦY ĐỦ) ================= */}
        <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Thông tin hành chính, nhà trường &amp; Chương trình dạy học</span>
            </h3>
            <span className="text-[11px] text-slate-500">Giáo viên có thể để trống thông tin không bắt buộc</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">1. TÊN GIÁO VIÊN:</label>
              <input
                type="text"
                defaultValue="Đặng Văn Sạch"
                id="field-teacher-name"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Họ và tên giáo viên..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">2. TÊN TRƯỜNG:</label>
              <input
                type="text"
                defaultValue="TRƯỜNG THCS TỊNH BIÊN"
                id="field-school-name"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Tên trường học..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">3. TỔ CHUYÊN MÔN:</label>
              <input
                type="text"
                defaultValue="Tổ: Công nghệ - Hướng nghiệp"
                id="field-department-name"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Tổ chuyên môn..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">4. NĂM HỌC &amp; HỌC KỲ:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  defaultValue="2026 - 2027"
                  id="field-school-year"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Năm học..."
                />
                <input
                  type="text"
                  defaultValue="Học kỳ I"
                  id="field-semester"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Học kỳ..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">5. CẤP HỌC &amp; KHỐI LỚP:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  defaultValue="THCS"
                  id="field-education-level"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Mầm non">Mầm non</option>
                  <option value="Tiểu học">Tiểu học</option>
                  <option value="THCS">THCS</option>
                  <option value="THPT">THPT</option>
                </select>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                >
                  <option value="6">Lớp 6</option>
                  <option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">6. MÔN HỌC / HOẠT ĐỘNG:</label>
              <input
                type="text"
                defaultValue="Hoạt động trải nghiệm, hướng nghiệp"
                id="field-subject-name"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Tên môn học hoặc hoạt động giáo dục..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">7. BỘ SÁCH GIÁO KHOA:</label>
              <select
                defaultValue="Kết nối tri thức với cuộc sống"
                id="field-textbook-series"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức với cuộc sống</option>
                <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
                <option value="Cánh Diều">Cánh Diều</option>
                <option value="Tài liệu địa phương / Riêng của trường">Tài liệu địa phương / Riêng của trường</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">8. TRANG SÁCH GIÁO KHOA:</label>
              <input
                type="text"
                id="field-textbook-page"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: SGK tr. 5 – 8..."
              />
            </div>
          </div>
        </div>

        {/* ================= KHU VỰC THÔNG TIN BÀI HỌC ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">9. TÊN CHỦ ĐỀ:</label>
            <input
              type="text"
              required
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Ví dụ: Chủ đề 2: Rèn luyện tính kiên trì..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">10. TÊN BÀI HỌC / HOẠT ĐỘNG:</label>
            <input
              type="text"
              required
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Ví dụ: Rèn luyện tính kiên trì, chăm chỉ..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">11. TUẦN THỰC HIỆN:</label>
            <input
              type="text"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              placeholder="Ví dụ: Tuần 5 - 6"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">12. SỐ TIẾT &amp; THỜI LƯỢNG:</label>
            <input
              type="text"
              value={durationString}
              onChange={(e) => setDurationString(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
              placeholder="Ví dụ: 3 tiết (45 phút/tiết)"
            />
          </div>
        </div>

        {/* ================= VỊ TRÍ ĐIỀN NỘI DUNG TÍCH HỢP NĂNG LỰC SỐ (NLS) & NL AI VÀ VỊ TRÍ CHỌN HOẠT ĐỘNG TÍCH HỢP ================= */}
        <div className="bg-gradient-to-r from-rose-50/70 via-indigo-50/40 to-blue-50/70 rounded-2xl p-5 border-2 border-indigo-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-indigo-150">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-700 text-white text-xs font-bold shadow-xs">
                  ★
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  VỊ TRÍ ĐIỀN NỘI DUNG TÍCH HỢP NĂNG LỰC SỐ (NLS) &amp; NĂNG LỰC AI (NL AI)
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Theo <strong className="text-blue-900">Thông tư 02 (TT02)</strong>, <strong className="text-blue-900">Công văn 2422</strong> và <strong className="text-blue-900">Công văn 3456/BGDĐT-GDTrH</strong>. Thầy/Cô điền nội dung cần tích hợp và <strong>chọn hoạt động cụ thể</strong> để đưa nội dung vào bài dạy.
              </p>
            </div>

            {onOpenLookupModal && (
              <button
                type="button"
                onClick={onOpenLookupModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 border border-amber-300 transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>Tra cứu Bảng chuẩn NLS &amp; NL AI</span>
              </button>
            )}
          </div>

          {/* SUMMARY BANNER: TRẠNG THÁI VÀ VỊ TRÍ TÍCH HỢP */}
          {(() => {
            const isNlsActive = Boolean(nlsContent.trim() && nlsTargetActivities.length > 0);
            const isNlaiActive = Boolean(nlaiContent.trim() && nlaiTargetActivities.length > 0);
            const isBothEmpty = !nlsContent.trim() && nlsTargetActivities.length === 0 && !nlaiContent.trim() && nlaiTargetActivities.length === 0;

            const formatActs = (arr: ActivityCategory[]) =>
              arr.map((a) => (a === 'flagSalute' ? 'Tiết 1 (SHDC)' : a === 'topicActivity' ? 'Tiết 2 (HĐGD)' : 'Tiết 3 (SHL)')).join(', ');

            return (
              <div className="bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-indigo-200 space-y-3 text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-extrabold text-slate-900 uppercase tracking-wide">
                        Trạng thái tích hợp NLS &amp; NL AI:
                      </span>
                      {isBothEmpty && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                          Bình thường để trống (Không tích hợp)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      💡 <em>Quy tắc:</em> Chỉ khi Thầy/Cô <strong>điền nội dung</strong> VÀ <strong>chọn hoạt động</strong> thì hệ thống mới tích hợp. Không chọn vị trí nào và không điền nội dung thì <strong>hoàn toàn không tự động tích hợp</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={clearAllIntegration}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer shadow-2xs"
                    >
                      ✕ Để trống tất cả (Không tích hợp)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNlsTargetActivities(['topicActivity']);
                        setNlaiTargetActivities(['topicActivity']);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 cursor-pointer"
                    >
                      Chọn vị trí Tiết 2
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNlsTargetActivities(['flagSalute', 'topicActivity', 'classMeeting']);
                        setNlaiTargetActivities(['flagSalute', 'topicActivity', 'classMeeting']);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                    >
                      Chọn vị trí cả 3 tiết
                    </button>
                  </div>
                </div>

                {/* Status indicator badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                  {/* NLS status */}
                  {isNlsActive ? (
                    <span className="font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-300 flex items-center gap-1">
                      <span>✓ NLS (Đỏ):</span>
                      <strong>Tích hợp vào {formatActs(nlsTargetActivities)}</strong>
                    </span>
                  ) : nlsContent.trim() && nlsTargetActivities.length === 0 ? (
                    <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                      ⚠️ NLS: Đã điền nội dung nhưng CHƯA CHỌN VỊ TRÍ &rarr; Không tích hợp
                    </span>
                  ) : !nlsContent.trim() && nlsTargetActivities.length > 0 ? (
                    <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                      ⚠️ NLS: Đã chọn vị trí nhưng CHƯA ĐIỀN NỘI DUNG &rarr; Không tích hợp
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      ⚪ NLS: Để trống (Không tích hợp)
                    </span>
                  )}

                  {/* NL AI status */}
                  {isNlaiActive ? (
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-300 flex items-center gap-1">
                      <span>✓ NL AI (Xanh):</span>
                      <strong>Tích hợp vào {formatActs(nlaiTargetActivities)}</strong>
                    </span>
                  ) : nlaiContent.trim() && nlaiTargetActivities.length === 0 ? (
                    <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                      ⚠️ NL AI: Đã điền nội dung nhưng CHƯA CHỌN VỊ TRÍ &rarr; Không tích hợp
                    </span>
                  ) : !nlaiContent.trim() && nlaiTargetActivities.length > 0 ? (
                    <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                      ⚠️ NL AI: Đã chọn vị trí nhưng CHƯA ĐIỀN NỘI DUNG &rarr; Không tích hợp
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      ⚪ NL AI: Để trống (Không tích hợp)
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* KHỐI 1: NĂNG LỰC SỐ (NLS) - MÀU ĐỎ */}
            <div className="bg-white rounded-xl p-4.5 border-2 border-rose-300 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-100 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase bg-rose-600 text-white flex items-center gap-1.5 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    1. TÍCH HỢP NĂNG LỰC SỐ (NLS) - QUY ƯỚC MÀU ĐỎ
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      TT02 &amp; CV 3456
                    </span>
                    {(nlsContent || nlsTargetActivities.length > 0 || selectedNlsCode) && (
                      <button
                        type="button"
                        onClick={clearNls}
                        className="text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-0.5 rounded border border-rose-300 cursor-pointer"
                        title="Xóa trắng để không tích hợp NLS"
                      >
                        ✕ Xóa/Để trống
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Select NLS Code Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Gợi ý nhanh mã NLS (nhấp để điền nhanh):
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { code: 'NLS 2.5.TC2b', title: 'Stop & Think (Đạo đức số)' },
                      { code: 'NLS 2.1TC1b', title: 'Tìm kiếm thông tin an toàn' },
                      { code: 'NLS 2.5TC1a', title: 'Quy tắc ứng xử nhóm lớp' },
                      { code: 'NLS 3.2TC2a', title: 'Hợp tác trên nền tảng số' },
                      { code: 'NLS 4.2TC2a', title: 'Bảo vệ dữ liệu cá nhân' },
                      { code: 'NLS 5.1TC1b', title: 'Sáng tạo thông điệp số' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setSelectedNlsCode(item.code);
                          const matched = DIGITAL_AI_STANDARDS.find((s) => s.code === item.code);
                          if (matched) {
                            setNlsContent(`${matched.title}. Biểu hiện: ${matched.behaviorIndicator}`);
                          }
                        }}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          selectedNlsCode === item.code
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {item.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input for NLS Code */}
                <div>
                  <label className="block text-xs font-bold text-rose-950 mb-1">
                    Mã Năng lực số (NLS) áp dụng:
                  </label>
                  <input
                    type="text"
                    value={selectedNlsCode}
                    onChange={(e) => setSelectedNlsCode(e.target.value)}
                    placeholder="Mã NLS (để trống nếu không tích hợp, ví dụ: NLS 2.5.TC2b)"
                    className="w-full text-xs font-bold text-rose-700 border border-rose-300 rounded-lg p-2 bg-rose-50/30 focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                {/* VỊ TRÍ ĐIỀN NỘI DUNG CẦN TÍCH HỢP NLS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-rose-950">
                      Vị trí điền nội dung cần tích hợp Năng lực số (NLS) vào bài dạy (Tô chữ Đỏ):
                    </label>
                    <span className="text-[10px] text-slate-500 italic">Bình thường để trống</span>
                  </div>
                  <textarea
                    rows={4}
                    value={nlsContent}
                    onChange={(e) => setNlsContent(e.target.value)}
                    placeholder="Bình thường để trống (không tự động tích hợp). Điền nội dung tại đây và chọn vị trí ở ô bên dưới nếu Thầy/Cô muốn tích hợp NLS..."
                    className="w-full text-xs p-2.5 border border-rose-300 rounded-lg bg-white focus:ring-2 focus:ring-rose-500 leading-relaxed text-slate-800"
                  />
                </div>

                {/* VỊ TRÍ CHỌN NỘI DUNG TÍCH HỢP VÀO HOẠT ĐỘNG NÀO CHO NLS */}
                <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-rose-950">
                      🎯 Vị trí chọn tích hợp NLS vào hoạt động nào:
                    </label>
                    <span className="text-[10px] text-rose-700 font-semibold">
                      {nlsTargetActivities.length === 0 ? 'Chưa chọn vị trí (Không tích hợp)' : `Đã chọn: ${nlsTargetActivities.length} tiết`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { key: 'flagSalute' as ActivityCategory, name: 'Sinh hoạt dưới cờ', sub: 'Tiết 1 (tại lớp - 6 nhóm)' },
                      { key: 'topicActivity' as ActivityCategory, name: 'HĐGD theo chủ đề', sub: 'Tiết 2 (Tiến trình 4 bước)' },
                      { key: 'classMeeting' as ActivityCategory, name: 'Sinh hoạt lớp', sub: 'Tiết 3 (Vận dụng & cam kết)' },
                    ].map((act) => {
                      const isSelected = nlsTargetActivities.includes(act.key);
                      return (
                        <button
                          key={act.key}
                          type="button"
                          onClick={() => toggleNlsTarget(act.key)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                              : 'bg-white text-slate-700 border-rose-200 hover:bg-rose-50/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold leading-tight">{act.name}</span>
                            <span className="text-xs font-black">
                              {isSelected ? '✓' : '+'}
                            </span>
                          </div>
                          <span className={`text-[10px] mt-1 ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                            {act.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-rose-700 bg-rose-50/80 p-2 rounded-lg border border-rose-200/80">
                💡 <strong>Lưu ý:</strong> Phải <strong>có chọn vị trí</strong> và <strong>điền nội dung</strong> thì mới tích hợp. Nếu không chọn vị trí nào hoặc để trống nội dung thì hệ thống <strong>sẽ không tự động tích hợp NLS</strong>.
              </div>
            </div>

            {/* KHỐI 2: NĂNG LỰC TRÍ TUỆ NHÂN TẠO (NL AI) - MÀU XANH DƯƠNG */}
            <div className="bg-white rounded-xl p-4.5 border-2 border-blue-300 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-blue-100 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase bg-blue-600 text-white flex items-center gap-1.5 shadow-2xs">
                    <Cpu className="w-3.5 h-3.5" />
                    2. TÍCH HỢP TRÍ TUỆ NHÂN TẠO (NL AI) - QUY ƯỚC MÀU XANH DƯƠNG
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      CV 2422 &amp; CV 3456
                    </span>
                    {(nlaiContent || nlaiTargetActivities.length > 0 || selectedNlaiCode) && (
                      <button
                        type="button"
                        onClick={clearNlai}
                        className="text-[11px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded border border-blue-300 cursor-pointer"
                        title="Xóa trắng để không tích hợp NL AI"
                      >
                        ✕ Xóa/Để trống
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Select NL AI Code Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Gợi ý nhanh mã NL AI (nhấp để điền nhanh):
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { code: 'NLAI 6.A1.3', title: 'Con người ra quyết định tối hậu' },
                      { code: 'NLAI 7.A1.1', title: 'Dùng AI an toàn & tự rèn luyện' },
                      { code: 'NLAI 8.A1.1', title: 'AI không thay thế được cảm xúc' },
                      { code: 'NLAI 9.A3.1', title: 'Đồng cảm & tư duy phản biện với AI' },
                      { code: 'NLAI 9.A3.2', title: 'Xu hướng nghề nghiệp kỷ nguyên AI' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setSelectedNlaiCode(item.code);
                          const matched = DIGITAL_AI_STANDARDS.find((s) => s.code === item.code);
                          if (matched) {
                            setNlaiContent(`${matched.title}. Biểu hiện: ${matched.behaviorIndicator}`);
                          }
                        }}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          selectedNlaiCode === item.code
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        {item.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input for NL AI Code */}
                <div>
                  <label className="block text-xs font-bold text-blue-950 mb-1">
                    Mã Năng lực Trí tuệ nhân tạo (NL AI) áp dụng:
                  </label>
                  <input
                    type="text"
                    value={selectedNlaiCode}
                    onChange={(e) => setSelectedNlaiCode(e.target.value)}
                    placeholder="Mã NL AI (để trống nếu không tích hợp, ví dụ: NLAI 9.A3.1)"
                    className="w-full text-xs font-bold text-blue-700 border border-blue-300 rounded-lg p-2 bg-blue-50/30 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                {/* VỊ TRÍ ĐIỀN NỘI DUNG CẦN TÍCH HỢP NL AI */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-blue-950">
                      Vị trí điền nội dung cần tích hợp Năng lực AI (NL AI) vào bài dạy (Tô chữ Xanh):
                    </label>
                    <span className="text-[10px] text-slate-500 italic">Bình thường để trống</span>
                  </div>
                  <textarea
                    rows={4}
                    value={nlaiContent}
                    onChange={(e) => setNlaiContent(e.target.value)}
                    placeholder="Bình thường để trống (không tự động tích hợp). Điền nội dung tại đây và chọn vị trí ở ô bên dưới nếu Thầy/Cô muốn tích hợp NL AI..."
                    className="w-full text-xs p-2.5 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-800"
                  />
                </div>

                {/* VỊ TRÍ CHỌN NỘI DUNG TÍCH HỢP VÀO HOẠT ĐỘNG NÀO CHO NL AI */}
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-blue-950">
                      🎯 Vị trí chọn tích hợp NL AI vào hoạt động nào:
                    </label>
                    <span className="text-[10px] text-blue-700 font-semibold">
                      {nlaiTargetActivities.length === 0 ? 'Chưa chọn vị trí (Không tích hợp)' : `Đã chọn: ${nlaiTargetActivities.length} tiết`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { key: 'flagSalute' as ActivityCategory, name: 'Sinh hoạt dưới cờ', sub: 'Tiết 1 (tại lớp - 6 nhóm)' },
                      { key: 'topicActivity' as ActivityCategory, name: 'HĐGD theo chủ đề', sub: 'Tiết 2 (Tiến trình 4 bước)' },
                      { key: 'classMeeting' as ActivityCategory, name: 'Sinh hoạt lớp', sub: 'Tiết 3 (Vận dụng & cam kết)' },
                    ].map((act) => {
                      const isSelected = nlaiTargetActivities.includes(act.key);
                      return (
                        <button
                          key={act.key}
                          type="button"
                          onClick={() => toggleNlaiTarget(act.key)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                              : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-50/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold leading-tight">{act.name}</span>
                            <span className="text-xs font-black">
                              {isSelected ? '✓' : '+'}
                            </span>
                          </div>
                          <span className={`text-[10px] mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                            {act.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-blue-700 bg-blue-50/80 p-2 rounded-lg border border-blue-200/80">
                💡 <strong>Lưu ý:</strong> Phải <strong>có chọn vị trí</strong> và <strong>điền nội dung</strong> thì mới tích hợp. Nếu không chọn vị trí nào hoặc để trống nội dung thì hệ thống <strong>sẽ không tự động tích hợp NL AI</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* ================= KHU VỰC 3 Ô NHẬP NỘI DUNG RIÊNG BIỆT CHO 3 TIẾT ================= */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
              KHU VỰC NHẬP NỘI DUNG CHI TIẾT THEO TỪNG TIẾT HỌC
            </span>
          </div>

          {/* Ô 1: SINH HOẠT DƯỚI CỜ */}
          {selectedActivities.includes('flagSalute') && (
            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200">
              <label className="block text-sm font-bold text-amber-900 mb-1">
                Ô 1: NỘI DUNG TIẾT 1 - SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP – 6 NHÓM)
              </label>
              <p className="text-xs text-slate-600 mb-2">
                Do GV bộ môn được phân công thực hiện tại lớp học (mỗi lớp chia 6 nhóm). Nhập chủ đề, nội dung, yêu cầu, nhiệm vụ thảo luận của 6 nhóm, ý tưởng báo cáo/chia sẻ:
              </p>
              <textarea
                rows={3}
                value={flagSaluteNotes}
                onChange={(e) => setFlagSaluteNotes(e.target.value)}
                placeholder="Ví dụ: Chủ đề: Tấm gương sáng vượt khó. GV bộ môn chia 6 nhóm thảo luận tình huống/câu chuyện tấm gương, cử đại diện chia sẻ, nhận xét chéo..."
                className="w-full text-xs p-3 border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>
          )}

          {/* Ô 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ */}
          {selectedActivities.includes('topicActivity') && (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
              <label className="block text-sm font-bold text-blue-900 mb-1">
                Ô 2: NỘI DUNG TIẾT 2 - HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ
              </label>
              <p className="text-xs text-slate-600 mb-2">
                Nhập tên bài, nội dung SGK, số tiết, yêu cầu cần đạt, nhiệm vụ học tập, hoạt động dự kiến (Khởi động, Khám phá, Luyện tập, Vận dụng):
              </p>
              <textarea
                rows={4}
                value={topicActivityNotes}
                onChange={(e) => setTopicActivityNotes(e.target.value)}
                placeholder="Ví dụ: Yêu cầu cần đạt: Chỉ ra được các biểu hiện kiên trì; tự đánh giá mức độ kiên trì của bản thân... Hoạt động: Khởi động (Trò chơi Tháp giấy), Khám phá (Phiếu học tập 1)..."
                className="w-full text-xs p-3 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          )}

          {/* Ô 3: SINH HOẠT LỚP */}
          {selectedActivities.includes('classMeeting') && (
            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
              <label className="block text-sm font-bold text-emerald-900 mb-1">
                Ô 3: NỘI DUNG TIẾT 3 - SINH HOẠT LỚP
              </label>
              <p className="text-xs text-slate-600 mb-2">
                Nhập nội dung phản hồi, kết quả hoạt động vận dụng, nội dung đánh giá chủ đề, nhiệm vụ tiếp theo, phân công đôi bạn cùng tiến:
              </p>
              <textarea
                rows={3}
                value={classMeetingNotes}
                onChange={(e) => setClassMeetingNotes(e.target.value)}
                placeholder="Ví dụ: Học sinh chia sẻ kết quả thực hiện Kế hoạch 21 ngày rèn luyện kiên trì; thảo luận các trở ngại gặp phải; thành lập các cặp đôi bạn cùng tiến..."
                className="w-full text-xs p-3 border border-emerald-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Cam kết: Tiến trình tự động định dạng bảng 2 cột đúng tinh thần Công văn 5512, tích hợp NLS Đỏ và NLAI Xanh.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || isParsingDoc}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 hover:from-blue-800 hover:to-sky-800 shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang phân tích &amp; Soạn giáo án chi tiết...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>SOẠN GIÁO ÁN CHI TIẾT</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
