import React, { useState } from 'react';
import { LessonPlan, ActivityStep, PeriodSection } from '../types/lessonPlan';
import { TwoColumnActivityTable } from './TwoColumnActivityTable';
import {
  FileText,
  Target,
  Wrench,
  Sun,
  Users,
  Compass,
  CheckSquare,
  Download,
  Eye,
  Edit2,
  Sparkles,
  ShieldCheck,
  Cpu,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface PlanViewerProps {
  plan: LessonPlan;
  onUpdatePlan: (updatedPlan: LessonPlan) => void;
  onValidate: () => void;
  onExportWord: () => void;
  onOpenLookupModal?: () => void;
  isEditing: boolean;
}

export type TabKey =
  | 'all'
  | 'topicObjectives'
  | 'flagSalute'
  | 'topicActivity'
  | 'classMeeting'
  | 'validation'
  | 'exportWord';

export const PlanViewer: React.FC<PlanViewerProps> = ({
  plan,
  onUpdatePlan,
  onValidate,
  onExportWord,
  onOpenLookupModal,
  isEditing,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [classMeetingViewMode, setClassMeetingViewMode] = useState<'steps' | 'table'>('steps');

  // Helper getters to support both new `periods` structure and legacy structures
  const flagSalutePeriod: PeriodSection | undefined =
    plan.periods?.flagSalute ||
    (plan.activities?.flagSalute?.enabled
      ? {
          enabled: true,
          periodNumber: 1,
          periodType: 'flagSalute',
          title: plan.activities.flagSalute.title || 'TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC)',
          subTitle: plan.topic,
          note: '(Do Giáo viên được phân công phụ trách điều hành tại phòng học)',
          objectives: {
            knowledge: plan.objectives?.knowledge || [],
            competencies: plan.objectives?.competencies?.general || [],
            qualities: plan.objectives?.qualities?.items || [],
          },
          equipment: {
            teacher: plan.equipment?.teacher || [],
            students: plan.equipment?.students || [],
          },
          steps: plan.activities.flagSalute.steps || [],
        }
      : undefined);

  const topicActivityPeriod: PeriodSection | undefined =
    plan.periods?.topicActivity ||
    (plan.activities?.topicActivity?.enabled
      ? {
          enabled: true,
          periodNumber: 2,
          periodType: 'topicActivity',
          title: plan.activities.topicActivity.title || 'TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ',
          subTitle: `NỘI DUNG: ${plan.lessonTitle.toUpperCase()}`,
          objectives: {
            knowledge: plan.objectives?.knowledge || [],
            integratedCompetencies: plan.periods?.topicActivity?.objectives?.integratedCompetencies,
            qualities: plan.objectives?.qualities?.items || [],
          },
          equipment: {
            teacher: plan.equipment?.teacher || [],
            students: plan.equipment?.students || [],
          },
          steps: plan.activities.topicActivity.steps || [],
        }
      : undefined);

  const classMeetingPeriod: PeriodSection | undefined =
    plan.periods?.classMeeting ||
    (plan.activities?.classMeeting?.enabled
      ? {
          enabled: true,
          periodNumber: 3,
          periodType: 'classMeeting',
          title: plan.activities.classMeeting.title || 'TIẾT 3: SINH HOẠT LỚP',
          subTitle: `CHỦ ĐỀ: XÂY DỰNG NỘI QUY TỰ QUẢN & BẢN CAM KẾT VĂN HÓA LỚP HỌC ${plan.grade}`,
          objectives: {
            competencies: plan.objectives?.competencies?.general || [],
            qualities: plan.objectives?.qualities?.items || [],
          },
          equipment: {
            teacher: plan.equipment?.teacher || [],
            students: plan.equipment?.students || [],
          },
          steps: plan.activities.classMeeting.steps || [],
        }
      : undefined);

  const handleUpdatePeriodSteps = (
    periodKey: 'flagSalute' | 'topicActivity' | 'classMeeting',
    newSteps: ActivityStep[]
  ) => {
    const updatedPeriods = { ...(plan.periods || {}) };
    if (updatedPeriods[periodKey]) {
      updatedPeriods[periodKey] = {
        ...updatedPeriods[periodKey]!,
        steps: newSteps,
      };
    }
    // Update legacy activities as well
    const updatedActivities = { ...(plan.activities || {}) };
    if (updatedActivities[periodKey]) {
      updatedActivities[periodKey] = {
        ...updatedActivities[periodKey],
        steps: newSteps,
      };
    }

    onUpdatePlan({
      ...plan,
      periods: updatedPeriods,
      activities: updatedActivities,
    });
  };

  const generalObjectives = plan.generalTopicObjectives || {
    knowledge: plan.objectives?.knowledge || [],
    qualities: plan.objectives?.qualities?.items || [],
    competencies: [
      ...(plan.objectives?.competencies?.general || []),
      ...(plan.objectives?.competencies?.specific || []),
    ],
  };

  const renderPeriodIntegratedSection = (
    periodKey: 'flagSalute' | 'topicActivity' | 'classMeeting',
    periodObj: PeriodSection,
    labelNumber: string = '2'
  ) => {
    const integrated = periodObj.objectives?.integratedCompetencies;
    if (!integrated || (!integrated.digital && !integrated.ai)) return null;

    return (
      <div className="space-y-2 pt-2 pb-1">
        <div className="flex items-center justify-between">
          <strong className="font-semibold text-slate-900 block text-xs sm:text-sm">
            {labelNumber}. Về năng lực tích hợp (NLS &amp; NLAI):{' '}
            <span className="font-normal text-xs text-slate-500">
              (Theo TT02, CV 2422 &amp; CV 3456)
            </span>
          </strong>
          {onOpenLookupModal && (
            <button
              type="button"
              onClick={onOpenLookupModal}
              className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Tra cứu Bảng chuẩn</span>
            </button>
          )}
        </div>

        {/* Năng lực số - RED HIGHLIGHT */}
        {integrated.digital && (
          <div className="p-3 bg-rose-50/90 border border-rose-200 rounded-xl text-rose-900">
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-rose-600 text-white shrink-0 mt-0.5">
                {integrated.digital.code || 'NLS (MÀU ĐỎ)'}
              </span>
              <div className="flex-1">
                <strong className="text-rose-700 block">
                  - {integrated.digital.title || 'Năng lực số'}:
                </strong>
                {isEditing ? (
                  <div className="mt-1 space-y-1">
                    <input
                      type="text"
                      value={integrated.digital.code || ''}
                      onChange={(e) => {
                        const updatedPeriods = { ...(plan.periods || {}) };
                        const target = updatedPeriods[periodKey];
                        if (target) {
                          updatedPeriods[periodKey] = {
                            ...target,
                            objectives: {
                              ...target.objectives,
                              integratedCompetencies: {
                                ...target.objectives.integratedCompetencies,
                                digital: {
                                  ...(target.objectives.integratedCompetencies?.digital || { title: 'Năng lực số', details: '' }),
                                  code: e.target.value,
                                },
                              },
                            },
                          };
                          onUpdatePlan({ ...plan, periods: updatedPeriods });
                        }
                      }}
                      placeholder="Mã NLS (ví dụ NLS 2.5.TC2b)..."
                      className="w-full text-xs font-bold border border-rose-300 rounded px-2 py-1 bg-white text-rose-800"
                    />
                    <textarea
                      rows={2}
                      value={integrated.digital.details || ''}
                      onChange={(e) => {
                        const updatedPeriods = { ...(plan.periods || {}) };
                        const target = updatedPeriods[periodKey];
                        if (target) {
                          updatedPeriods[periodKey] = {
                            ...target,
                            objectives: {
                              ...target.objectives,
                              integratedCompetencies: {
                                ...target.objectives.integratedCompetencies,
                                digital: {
                                  ...(target.objectives.integratedCompetencies?.digital || { code: 'NLS', title: 'Năng lực số' }),
                                  details: e.target.value,
                                },
                              },
                            },
                          };
                          onUpdatePlan({ ...plan, periods: updatedPeriods });
                        }
                      }}
                      placeholder="Nội dung chi tiết tích hợp NLS..."
                      className="w-full text-xs border border-rose-300 rounded p-1.5 bg-white text-rose-900"
                    />
                  </div>
                ) : (
                  <p className="mt-0.5 text-rose-800">
                    {integrated.digital.details || 'Thực hành các quy tắc ứng xử trên môi trường số.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Năng lực AI - BLUE HIGHLIGHT */}
        {integrated.ai && (
          <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl text-blue-900">
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-blue-600 text-white shrink-0 mt-0.5">
                {integrated.ai.code || 'NLAI (MÀU XANH)'}
              </span>
              <div className="flex-1">
                <strong className="text-blue-700 block">
                  - {integrated.ai.title || 'Năng lực Trí tuệ nhân tạo'}:
                </strong>
                {isEditing ? (
                  <div className="mt-1 space-y-1">
                    <input
                      type="text"
                      value={integrated.ai.code || ''}
                      onChange={(e) => {
                        const updatedPeriods = { ...(plan.periods || {}) };
                        const target = updatedPeriods[periodKey];
                        if (target) {
                          updatedPeriods[periodKey] = {
                            ...target,
                            objectives: {
                              ...target.objectives,
                              integratedCompetencies: {
                                ...target.objectives.integratedCompetencies,
                                ai: {
                                  ...(target.objectives.integratedCompetencies?.ai || { title: 'Năng lực Trí tuệ nhân tạo', details: '' }),
                                  code: e.target.value,
                                },
                              },
                            },
                          };
                          onUpdatePlan({ ...plan, periods: updatedPeriods });
                        }
                      }}
                      placeholder="Mã NL AI (ví dụ NLAI 9.A3.1)..."
                      className="w-full text-xs font-bold border border-blue-300 rounded px-2 py-1 bg-white text-blue-800"
                    />
                    <textarea
                      rows={2}
                      value={integrated.ai.details || ''}
                      onChange={(e) => {
                        const updatedPeriods = { ...(plan.periods || {}) };
                        const target = updatedPeriods[periodKey];
                        if (target) {
                          updatedPeriods[periodKey] = {
                            ...target,
                            objectives: {
                              ...target.objectives,
                              integratedCompetencies: {
                                ...target.objectives.integratedCompetencies,
                                ai: {
                                  ...(target.objectives.integratedCompetencies?.ai || { code: 'NLAI', title: 'Năng lực Trí tuệ nhân tạo' }),
                                  details: e.target.value,
                                },
                              },
                            },
                          };
                          onUpdatePlan({ ...plan, periods: updatedPeriods });
                        }
                      }}
                      placeholder="Nội dung chi tiết tích hợp NL AI..."
                      className="w-full text-xs border border-blue-300 rounded p-1.5 bg-white text-blue-900"
                    />
                  </div>
                ) : (
                  <p className="mt-0.5 text-blue-800">
                    {integrated.ai.details ||
                      'Nhận thức con người giữ vai trò trung tâm, cảm xúc và sự đồng cảm là năng lực đặc quyền của con người.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Ước tính số trang in A4 chuẩn Times New Roman theo dung lượng nội dung sư phạm
  const calcPeriodPages = (period?: PeriodSection, minPages = 3.0) => {
    if (!period || period.enabled === false) return 0;
    const textLength = [
      period.title,
      period.subTitle,
      period.note,
      ...(period.objectives?.knowledge || []),
      ...(period.objectives?.competencies || []),
      ...(period.objectives?.qualities || []),
      ...(period.equipment?.teacher || []),
      ...(period.equipment?.students || []),
      ...(period.steps || []).map((s) => `${s.stepName} ${s.objective} ${s.teacherStudentAction} ${s.expectedProduct}`),
    ].join(' ').length;
    // Bảng 2 cột chiếm nhiều khoảng trống và dòng, trung bình ~1300 ký tự cho 1 trang A4 bảng
    const est = Math.max(minPages, Number((textLength / 1300).toFixed(1)));
    return est;
  };

  const flagPages = calcPeriodPages(flagSalutePeriod, 3.2);
  const topicPages = calcPeriodPages(topicActivityPeriod, 4.4);
  const classPages = calcPeriodPages(classMeetingPeriod, 3.2);
  const totalEstimatedPages = (
    (flagSalutePeriod && flagSalutePeriod.enabled !== false ? flagPages : 0) +
    (topicActivityPeriod && topicActivityPeriod.enabled !== false ? topicPages : 0) +
    (classMeetingPeriod && classMeetingPeriod.enabled !== false ? classPages : 0)
  ).toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
      {/* Tab Navigation Header */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 pt-3 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveTab('all')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t-2 ${
              activeTab === 'all'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>XEM TOÀN BỘ GIÁO ÁN</span>
          </button>

          <button
            onClick={() => setActiveTab('topicObjectives')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t-2 ${
              activeTab === 'topicObjectives'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-600" />
            <span>MỤC TIÊU CHUNG CHỦ ĐỀ</span>
          </button>

          {flagSalutePeriod && (
            <button
              onClick={() => setActiveTab('flagSalute')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t-2 ${
                activeTab === 'flagSalute'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>TIẾT 1: SHDC (TẠI LỚP)</span>
            </button>
          )}

          {topicActivityPeriod && (
            <button
              onClick={() => setActiveTab('topicActivity')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t-2 ${
                activeTab === 'topicActivity'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>TIẾT 2: HĐGD (NLS &amp; NLAI)</span>
            </button>
          )}

          {classMeetingPeriod && (
            <button
              onClick={() => setActiveTab('classMeeting')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t-2 ${
                activeTab === 'classMeeting'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>TIẾT 3: SINH HOẠT LỚP</span>
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('validation');
              onValidate();
            }}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t-2 ${
              activeTab === 'validation'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>KIỂM TRA GIÁO ÁN</span>
          </button>

          <button
            onClick={() => setActiveTab('exportWord')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t-2 ${
              activeTab === 'exportWord'
                ? 'bg-white text-blue-900 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>XUẤT WORD</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {/* ================= HEADER BÁM SÁT MẪU TỊNH BIÊN ================= */}
        <div className="mb-6 pb-6 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-800 pb-3 border-b border-slate-200">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-900">
                {plan.schoolName || 'TRƯỜNG THCS TỊNH BIÊN'}
              </p>
              <p className="mt-1">
                Họ và tên GV: <span className="font-bold text-slate-900">{plan.teacherName || 'Đặng Văn Sạch'}</span>
              </p>
              <p>
                Tổ: <span className="font-medium text-slate-700">{plan.departmentName || 'Công nghệ - Hướng nghiệp'}</span>
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-900">
                GIÁO ÁN HOẠT ĐỘNG TRẢI NGHIỆM {plan.grade}
              </p>
              <p className="mt-1">
                Năm học: <span className="font-bold text-slate-900">{plan.schoolYear || '2026 - 2027'}</span>
              </p>
              <p>
                Học kỳ: <span className="font-medium text-slate-700">{plan.semester || `I - ${plan.week}`}</span>
              </p>
            </div>
          </div>

          {/* Topic Title */}
          <div className="text-center mt-5 mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-tight">
              {plan.topic}
            </h2>
            <p className="text-sm font-bold text-slate-600 italic mt-0.5">({plan.week})</p>
          </div>
        </div>

        {/* BANNER TỔNG HỢP VỊ TRÍ TÍCH HỢP NLS & NLAI */}
        <div className="mb-6 p-3.5 bg-gradient-to-r from-rose-50/80 via-white to-blue-50/80 rounded-xl border border-indigo-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-slate-900 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Vị trí tích hợp trong kế hoạch:
            </span>
            {(flagSalutePeriod?.objectives?.integratedCompetencies?.digital || topicActivityPeriod?.objectives?.integratedCompetencies?.digital || classMeetingPeriod?.objectives?.integratedCompetencies?.digital) && (
              <span className="font-bold text-rose-700 bg-rose-100/90 px-2.5 py-0.5 rounded-md border border-rose-300">
                NLS (Đỏ): {[
                  flagSalutePeriod?.objectives?.integratedCompetencies?.digital && 'Tiết 1 (SHDC)',
                  topicActivityPeriod?.objectives?.integratedCompetencies?.digital && 'Tiết 2 (HĐGD)',
                  classMeetingPeriod?.objectives?.integratedCompetencies?.digital && 'Tiết 3 (SHL)',
                ].filter(Boolean).join(', ')}
              </span>
            )}
            {(flagSalutePeriod?.objectives?.integratedCompetencies?.ai || topicActivityPeriod?.objectives?.integratedCompetencies?.ai || classMeetingPeriod?.objectives?.integratedCompetencies?.ai) && (
              <span className="font-bold text-blue-700 bg-blue-100/90 px-2.5 py-0.5 rounded-md border border-blue-300">
                NL AI (Xanh): {[
                  flagSalutePeriod?.objectives?.integratedCompetencies?.ai && 'Tiết 1 (SHDC)',
                  topicActivityPeriod?.objectives?.integratedCompetencies?.ai && 'Tiết 2 (HĐGD)',
                  classMeetingPeriod?.objectives?.integratedCompetencies?.ai && 'Tiết 3 (SHL)',
                ].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {onOpenLookupModal && (
            <button
              type="button"
              onClick={onOpenLookupModal}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg border border-amber-300 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bảng tra cứu Chuẩn TT02 &amp; CV 2422</span>
            </button>
          )}
        </div>

        {/* THANH ĐÁNH GIÁ ĐỘ DÀI & ĐẠT CHUẨN TRANG IN A4 THEO YÊU CẦU */}
        <div className="mb-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Chuẩn Sư Phạm GDPT 2018 &bull; Định mức văn bản A4
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white mt-1">
                ĐÁNH GIÁ ĐỘ DÀI &amp; MỨC ĐỘ CHI TIẾT TỪNG TIẾT HỌC
              </h4>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Toàn bộ giáo án tuần: ~{totalEstimatedPages} trang A4</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {/* Tiết 1 */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-amber-300">TIẾT 1 (SHDC TẠI LỚP)</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ĐẠT &ge; 3 TRANG
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ước tính: <strong className="text-white font-black">{flagPages} trang A4</strong> (5 bước chi tiết, 6 nhóm tại lớp)
              </p>
            </div>

            {/* Tiết 2 */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-sky-300">TIẾT 2 (HĐGD THEO CHỦ ĐỀ)</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ĐẠT &ge; 4 TRANG
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ước tính: <strong className="text-white font-black">{topicPages} trang A4</strong> (4 hoạt động 5512, bảng 2 cột, NLS &amp; NLAI)
              </p>
            </div>

            {/* Tiết 3 */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-teal-300">TIẾT 3 (SINH HOẠT LỚP)</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ĐẠT &ge; 3 TRANG
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ước tính: <strong className="text-white font-black">{classPages} trang A4</strong> (5 bước, đôi bạn, Bản cam kết A0)
              </p>
            </div>
          </div>
        </div>

        {/* ================= MỤC TIÊU CHUNG CỦA CHỦ ĐỀ ================= */}
        {(activeTab === 'topicObjectives' || activeTab === 'all') && (
          <div className="mb-8 p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-sky-50/70 rounded-2xl border border-blue-200 shadow-xs">
            <h3 className="text-base font-extrabold text-blue-950 uppercase tracking-wide flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-700" />
              <span>MỤC TIÊU CHUNG CỦA CHỦ ĐỀ</span>
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed pl-2">
              <div>
                <strong className="text-blue-950 font-bold">• Kiến thức: </strong>
                <span>{generalObjectives.knowledge.join(' ')}</span>
              </div>
              <div>
                <strong className="text-blue-950 font-bold">• Phẩm chất: </strong>
                <span>{generalObjectives.qualities.join(' ')}</span>
              </div>
              <div>
                <strong className="text-blue-950 font-bold">• Năng lực: </strong>
                <span>{generalObjectives.competencies.join(' ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TIẾT 1: SINH HOẠT DƯỚI CỜ (TỔ CHỨC TẠI LỚP HỌC) ================= */}
        {flagSalutePeriod && (activeTab === 'flagSalute' || activeTab === 'all') && (
          <div className="mb-10 pt-4 border-t-2 border-slate-200 first:border-0 first:pt-0">
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                {flagSalutePeriod.title}
              </h3>
              {flagSalutePeriod.subTitle && (
                <p className="text-sm sm:text-base font-extrabold text-blue-900 uppercase mt-1">
                  {flagSalutePeriod.subTitle}
                </p>
              )}
              {flagSalutePeriod.note && (
                <p className="text-xs text-slate-600 italic mt-0.5">{flagSalutePeriod.note}</p>
              )}
            </div>

            {/* I. MỤC TIÊU TIẾT HỌC */}
            <div className="mb-5 pl-2">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-2">
                I. MỤC TIÊU TIẾT HỌC
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-slate-800 pl-3 leading-relaxed">
                {flagSalutePeriod.objectives.knowledge && flagSalutePeriod.objectives.knowledge.length > 0 && (
                  <div>
                    <strong className="font-semibold text-slate-900">1. Về kiến thức: </strong>
                    <span>{flagSalutePeriod.objectives.knowledge.join(' ')}</span>
                  </div>
                )}
                {flagSalutePeriod.objectives.competencies && flagSalutePeriod.objectives.competencies.length > 0 && (
                  <div>
                    <strong className="font-semibold text-slate-900">2. Về năng lực: </strong>
                    <span>{flagSalutePeriod.objectives.competencies.join(' ')}</span>
                  </div>
                )}
                {flagSalutePeriod.objectives.qualities && flagSalutePeriod.objectives.qualities.length > 0 && (
                  <div>
                    <strong className="font-semibold text-slate-900">3. Về phẩm chất: </strong>
                    <span>{flagSalutePeriod.objectives.qualities.join(' ')}</span>
                  </div>
                )}
                {renderPeriodIntegratedSection('flagSalute', flagSalutePeriod, '4')}
              </div>
            </div>

            {/* II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU */}
            <div className="mb-5 pl-2">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-2">
                II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
              </h4>
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 pl-3">
                <p>
                  <strong className="font-semibold text-slate-900">- Đối với Giáo viên phụ trách: </strong>
                  <span>{flagSalutePeriod.equipment.teacher.join('; ')}</span>
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">- Đối với Học sinh: </strong>
                  <span>{flagSalutePeriod.equipment.students.join('; ')}</span>
                </p>
              </div>
            </div>

            {/* III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG (BẢNG 2 CỘT) */}
            <div className="mb-5">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-3 pl-2">
                III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC (TỔ CHỨC TRỰC TIẾP TẠI LỚP)
              </h4>
              <TwoColumnActivityTable
                steps={flagSalutePeriod.steps}
                onUpdateSteps={(steps) => handleUpdatePeriodSteps('flagSalute', steps)}
                isEditable={isEditing}
              />
            </div>
          </div>
        )}

        {/* ================= TIẾT 2: HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ (TÍCH HỢP NLS & NLAI) ================= */}
        {topicActivityPeriod && (activeTab === 'topicActivity' || activeTab === 'all') && (
          <div className="mb-10 pt-6">
            {activeTab === 'all' && (
              <div className="relative my-8 border-t-2 border-dashed border-sky-400 text-center">
                <span className="relative -top-3.5 px-4 py-1.5 bg-sky-100 text-sky-950 text-xs font-black uppercase rounded-full border border-sky-300 shadow-sm inline-flex items-center gap-1.5">
                  <span>📄 VỊ TRÍ NGẮT TRANG IN A4: BẮT ĐẦU TIẾT 2</span>
                  <span className="text-sky-700 font-bold">(HĐGD THEO CHỦ ĐỀ - ĐẠT CHUẨN &ge; 4 TRANG A4)</span>
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                {topicActivityPeriod.title}
              </h3>
              {topicActivityPeriod.subTitle && (
                <p className="text-sm sm:text-base font-extrabold text-blue-900 uppercase mt-1">
                  {topicActivityPeriod.subTitle}
                </p>
              )}
            </div>

            {/* I. MỤC TIÊU TIẾT HỌC */}
            <div className="mb-5 pl-2">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>I. MỤC TIÊU TIẾT HỌC</span>
                {onOpenLookupModal && (
                  <button
                    type="button"
                    onClick={onOpenLookupModal}
                    className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tra cứu mã NLS &amp; NLAI</span>
                  </button>
                )}
              </h4>
              <div className="space-y-3 text-xs sm:text-sm text-slate-800 pl-3 leading-relaxed">
                {/* 1. Về kiến thức và năng lực đặc thù */}
                <div>
                  <strong className="font-semibold text-slate-900">
                    1. Về kiến thức và năng lực đặc thù:{' '}
                  </strong>
                  <span>{topicActivityPeriod.objectives.knowledge?.join(' ')}</span>
                </div>

                {/* 2. Về năng lực tích hợp (NLS & NLAI) - TÔ MÀU ĐỎ NLS VÀ MÀU XANH NLAI (Chỉ hiển thị khi có tích hợp) */}
                {renderPeriodIntegratedSection('topicActivity', topicActivityPeriod, '2')}

                {/* Về phẩm chất (Đánh số 3 nếu có tích hợp, đánh số 2 nếu không tích hợp) */}
                <div>
                  <strong className="font-semibold text-slate-900">
                    {topicActivityPeriod.objectives?.integratedCompetencies?.digital || topicActivityPeriod.objectives?.integratedCompetencies?.ai
                      ? '3. Về phẩm chất: '
                      : '2. Về phẩm chất: '}
                  </strong>
                  <span>{topicActivityPeriod.objectives.qualities?.join(' ')}</span>
                </div>
              </div>
            </div>

            {/* II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU */}
            <div className="mb-5 pl-2">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-2">
                II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
              </h4>
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 pl-3">
                <p>
                  <strong className="font-semibold text-slate-900">• Đối với Giáo viên: </strong>
                  <span>{topicActivityPeriod.equipment.teacher.join('; ')}</span>
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">• Đối với Học sinh: </strong>
                  <span>{topicActivityPeriod.equipment.students.join('; ')}</span>
                </p>
              </div>
            </div>

            {/* III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC (BẢNG 2 CỘT TÍCH HỢP) */}
            <div className="mb-5">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-3 pl-2">
                III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC
              </h4>
              <TwoColumnActivityTable
                steps={topicActivityPeriod.steps}
                onUpdateSteps={(steps) => handleUpdatePeriodSteps('topicActivity', steps)}
                isEditable={isEditing}
              />
            </div>
          </div>
        )}

        {/* ================= TIẾT 3: SINH HOẠT LỚP ================= */}
        {classMeetingPeriod && (activeTab === 'classMeeting' || activeTab === 'all') && (
          <div className="mb-10 pt-6">
            {activeTab === 'all' && (
              <div className="relative my-8 border-t-2 border-dashed border-teal-400 text-center">
                <span className="relative -top-3.5 px-4 py-1.5 bg-teal-100 text-teal-950 text-xs font-black uppercase rounded-full border border-teal-300 shadow-sm inline-flex items-center gap-1.5">
                  <span>📄 VỊ TRÍ NGẮT TRANG IN A4: BẮT ĐẦU TIẾT 3</span>
                  <span className="text-teal-700 font-bold">(SINH HOẠT LỚP - ĐẠT CHUẨN &ge; 3 TRANG A4)</span>
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                {classMeetingPeriod.title}
              </h3>
              {classMeetingPeriod.subTitle && (
                <p className="text-sm sm:text-base font-extrabold text-blue-900 uppercase mt-1">
                  {classMeetingPeriod.subTitle}
                </p>
              )}
            </div>

            {/* I. MỤC TIÊU TIẾT HỌC */}
            <div className="mb-5 pl-2">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-2">
                I. MỤC TIÊU TIẾT HỌC
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-slate-800 pl-3 leading-relaxed">
                {classMeetingPeriod.objectives.competencies && (
                  <div>
                    <strong className="font-semibold text-slate-900">1. Năng lực: </strong>
                    <span>{classMeetingPeriod.objectives.competencies.join(' ')}</span>
                  </div>
                )}
                {classMeetingPeriod.objectives.qualities && (
                  <div>
                    <strong className="font-semibold text-slate-900">2. Phẩm chất: </strong>
                    <span>{classMeetingPeriod.objectives.qualities.join(' ')}</span>
                  </div>
                )}
                {renderPeriodIntegratedSection('classMeeting', classMeetingPeriod, '3')}
              </div>
            </div>

            {/* II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU */}
            <div className="mb-5 pl-2">
              <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide mb-2">
                II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
              </h4>
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 pl-3">
                <p>
                  <strong className="font-semibold text-slate-900">- Đối với Giáo viên: </strong>
                  <span>{classMeetingPeriod.equipment.teacher.join('; ')}</span>
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">- Đối với Học sinh: </strong>
                  <span>{classMeetingPeriod.equipment.students.join('; ')}</span>
                </p>
              </div>
            </div>

            {/* III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG (CHUẨN MẪU TRANG 8 & 9) */}
            <div className="mb-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pl-2">
                <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                  III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG DẠY HỌC
                </h4>
                <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setClassMeetingViewMode('steps')}
                    className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                      classMeetingViewMode === 'steps'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mẫu danh sách Bước (Trang 8-9 PDF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassMeetingViewMode('table')}
                    className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                      classMeetingViewMode === 'table'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bảng 2 cột song song
                  </button>
                </div>
              </div>

              {classMeetingViewMode === 'steps' ? (
                <div className="space-y-4 pl-3">
                  {classMeetingPeriod.steps.map((step, sIdx) => {
                    const actionLines = step.teacherStudentAction.split('\n').filter(Boolean);

                    return (
                      <div
                        key={step.stepId || sIdx}
                        className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-900 shrink-0">Tên bước:</span>
                              <input
                                type="text"
                                value={step.stepName}
                                onChange={(e) => {
                                  const updatedSteps = [...classMeetingPeriod.steps];
                                  updatedSteps[sIdx] = { ...updatedSteps[sIdx], stepName: e.target.value };
                                  handleUpdatePeriodSteps('classMeeting', updatedSteps);
                                }}
                                className="w-full text-xs sm:text-sm font-bold border border-blue-300 rounded px-2.5 py-1 bg-white text-blue-950"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700 shrink-0">Mục tiêu:</span>
                              <input
                                type="text"
                                value={step.objective || ''}
                                onChange={(e) => {
                                  const updatedSteps = [...classMeetingPeriod.steps];
                                  updatedSteps[sIdx] = { ...updatedSteps[sIdx], objective: e.target.value };
                                  handleUpdatePeriodSteps('classMeeting', updatedSteps);
                                }}
                                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-700 block mb-1">
                                Nội dung tổ chức thực hiện:
                              </span>
                              <textarea
                                rows={6}
                                value={step.teacherStudentAction}
                                onChange={(e) => {
                                  const updatedSteps = [...classMeetingPeriod.steps];
                                  updatedSteps[sIdx] = { ...updatedSteps[sIdx], teacherStudentAction: e.target.value };
                                  handleUpdatePeriodSteps('classMeeting', updatedSteps);
                                }}
                                className="w-full text-xs font-mono border border-slate-300 rounded p-2 bg-white text-slate-800"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                            <h5 className="font-bold text-slate-900 text-sm sm:text-base text-blue-950 pb-1 border-b border-slate-200">
                              {step.stepName}
                            </h5>
                            {!step.teacherStudentAction.includes('* Mục tiêu:') && step.objective && (
                              <p className="text-slate-800 flex items-start gap-1.5 pt-1">
                                <span className="font-extrabold text-blue-950 bg-blue-100/70 text-[11px] px-2 py-0.5 rounded border border-blue-200 shrink-0 uppercase">
                                  * Mục tiêu:
                                </span>
                                <span className="font-medium text-slate-900">{step.objective}</span>
                              </p>
                            )}
                            {actionLines.map((line, lIdx) => {
                              const isNLS =
                                line.includes('[NLS]') ||
                                line.includes('Tích hợp NLS') ||
                                line.includes('NLS 2.') ||
                                line.includes('NLS 1.') ||
                                line.includes('NLS 3.') ||
                                line.includes('NLS 4.');
                              const isNLAI =
                                line.includes('[NLAI]') ||
                                line.includes('Tích hợp NLAI') ||
                                line.includes('NLAI 9.') ||
                                line.includes('NLAI 6.') ||
                                line.includes('NLAI 7.');

                              if (isNLS) {
                                return (
                                  <p key={lIdx} className="font-bold text-rose-700 bg-rose-50/80 p-2 rounded-lg border border-rose-200">
                                    {line.replace(/^\[NLS\]\s*/, '')}
                                  </p>
                                );
                              }
                              if (isNLAI) {
                                return (
                                  <p key={lIdx} className="font-bold text-blue-700 bg-blue-50/80 p-2 rounded-lg border border-blue-200">
                                    {line.replace(/^\[NLAI\]\s*/, '')}
                                  </p>
                                );
                              }

                              // * Mục tiêu:
                              if (line.startsWith('* Mục tiêu:') || line.startsWith('• Mục tiêu:') || line.startsWith('Mục tiêu:')) {
                                const content = line.replace(/^[\*\•]?\s*Mục tiêu[:\s]*/i, '');
                                return (
                                  <div key={lIdx} className="flex items-start gap-1.5 pt-1">
                                    <span className="font-extrabold text-blue-950 bg-blue-100/70 text-[11px] px-2 py-0.5 rounded border border-blue-200 shrink-0 uppercase">
                                      * Mục tiêu:
                                    </span>
                                    <span className="font-medium text-slate-900">{content}</span>
                                  </div>
                                );
                              }

                              // * Phương pháp thực hiện:
                              if (line.startsWith('* Phương pháp thực hiện:') || line.startsWith('• Phương pháp thực hiện:') || line.startsWith('Phương pháp thực hiện:') || line.startsWith('* Phương pháp:')) {
                                const content = line.replace(/^[\*\•]?\s*(?:Phương pháp thực hiện|Phương pháp)[:\s]*/i, '');
                                return (
                                  <div key={lIdx} className="flex items-start gap-1.5 pt-1">
                                    <span className="font-extrabold text-emerald-950 bg-emerald-100/70 text-[11px] px-2 py-0.5 rounded border border-emerald-200 shrink-0 uppercase">
                                      * Phương pháp thực hiện:
                                    </span>
                                    <span className="text-slate-800">{content}</span>
                                  </div>
                                );
                              }

                              // * Tổ chức thực hiện:
                              if (line.startsWith('* Tổ chức thực hiện:') || line.startsWith('• Tổ chức thực hiện:') || line.startsWith('Tổ chức thực hiện:')) {
                                return (
                                  <div key={lIdx} className="font-extrabold text-slate-950 mt-2 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                    <span className="w-1.5 h-4 bg-blue-700 rounded-xs"></span>
                                    <span>* Tổ chức thực hiện:</span>
                                  </div>
                                );
                              }

                              // - Bước 1 đến Bước 4
                              const stepMatch = line.match(/^[\-\•\d\.]?\s*Bước\s*([1-4])[:\s\-\(]*(?:Chuyển giao nhiệm vụ|Thực hiện nhiệm vụ|Báo cáo,?\s*thảo luận|Kết luận,?\s*nhận định|Giao nhiệm vụ|Thực hiện|Báo cáo|Kết luận)?(?:\))?[:\s]*(.*)/i);
                              if (stepMatch) {
                                const sNum = stepMatch[1];
                                const sTitles: Record<string, { title: string; color: string }> = {
                                  '1': { title: 'Chuyển giao nhiệm vụ', color: 'bg-indigo-100 text-indigo-900 border-indigo-200' },
                                  '2': { title: 'Thực hiện nhiệm vụ', color: 'bg-amber-100 text-amber-900 border-amber-200' },
                                  '3': { title: 'Báo cáo, thảo luận', color: 'bg-sky-100 text-sky-900 border-sky-200' },
                                  '4': { title: 'Kết luận, nhận định', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
                                };
                                const meta = sTitles[sNum] || { title: `Bước ${sNum}`, color: 'bg-slate-100 text-slate-900 border-slate-200' };
                                const sContent = stepMatch[2]?.trim();
                                return (
                                  <div key={lIdx} className="pt-2">
                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-black border ${meta.color}`}>
                                        Bước {sNum}
                                      </span>
                                      <span>{meta.title}</span>
                                    </div>
                                    {sContent ? <div className="pl-3 mt-0.5 text-slate-800 leading-relaxed">{sContent}</div> : null}
                                  </div>
                                );
                              }

                              const isBoldTitle =
                                line.startsWith('• Cách thức tổ chức:') ||
                                line.startsWith('• Dẫn dắt:') ||
                                line.startsWith('• Chốt lại:') ||
                                line.startsWith('• Dặn dò:') ||
                                line.startsWith('- 03 điều cần KHUYẾN KHÍCH') ||
                                line.startsWith('- 03 điều NGHIÊM CẤM');

                              return (
                                <p
                                  key={lIdx}
                                  className={
                                    line.startsWith('+')
                                      ? 'pl-4 text-slate-700'
                                      : line.startsWith('-')
                                      ? 'pl-2 text-slate-800 font-medium'
                                      : isBoldTitle
                                      ? 'font-semibold text-slate-900'
                                      : 'text-slate-800'
                                  }
                                >
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <TwoColumnActivityTable
                  steps={classMeetingPeriod.steps}
                  onUpdateSteps={(steps) => handleUpdatePeriodSteps('classMeeting', steps)}
                  isEditable={isEditing}
                />
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: KIỂM TRA GIÁO ÁN ================= */}
        {activeTab === 'validation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <span>Báo cáo kiểm tra chất lượng giáo án (Chuẩn Tịnh Biên &amp; CV 5512, TT 02, QĐ 2422)</span>
              </h3>
              <button
                onClick={onValidate}
                type="button"
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200"
              >
                Kiểm tra lại
              </button>
            </div>

            {plan.validationReport && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Điểm đánh giá chuẩn</span>
                    <h4 className="text-xl font-extrabold text-blue-700">
                      {plan.validationReport.score}/100
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.validationReport.isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {plan.validationReport.isPassed ? 'ĐẠT CHUẨN XUẤT SẮC' : 'CẦN BỔ SUNG'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                    <h5 className="font-bold text-xs uppercase text-emerald-800 mb-2">
                      NHỮNG PHẦN ĐÃ ĐẠT ({plan.validationReport.passedItems.length})
                    </h5>
                    <ul className="space-y-1.5 text-xs text-emerald-950">
                      {plan.validationReport.passedItems.map((p, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                    <h5 className="font-bold text-xs uppercase text-amber-800 mb-2">
                      NHỮNG PHẦN CẦN BỔ SUNG ({plan.validationReport.pendingItems.length})
                    </h5>
                    {plan.validationReport.pendingItems.length > 0 ? (
                      <ul className="space-y-1.5 text-xs text-amber-950">
                        {plan.validationReport.pendingItems.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">!</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Không có phần nào cần bổ sung.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: XUẤT WORD ================= */}
        {activeTab === 'exportWord' && (
          <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-200 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-950">
                XUẤT GIÁO ÁN MICROSOFT WORD (.DOCX) CHUẨN TỊNH BIÊN
              </h4>
              <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1 leading-relaxed">
                Tệp Word giữ nguyên đầy đủ tiêu đề trường/tổ, Mục tiêu chung của chủ đề, các mục I, II, III của từng tiết học, bảng 2 cột rõ ràng, 
                đặc biệt <span className="text-rose-600 font-bold">Màu Đỏ cho Năng lực số</span> và <span className="text-blue-600 font-bold">Màu Xanh Dương cho Năng lực AI</span>.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onExportWord}
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 shadow-lg shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>TẢI FILE WORD (.DOCX) CHUẨN MẪU NGAY</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Tên file mặc định: <code className="bg-white px-2 py-0.5 rounded border border-slate-200">Giao_an_HDTN_Lop_{plan.grade}_{plan.topic.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.docx</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
