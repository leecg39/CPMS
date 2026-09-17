import React, { useState } from 'react';
import { MANUAL_SECTIONS } from '../data/manualData';
import { ManualSection } from '../types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Printer, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Code2, 
  FileText, 
  ExternalLink,
  HelpCircle,
  Download
} from 'lucide-react';

interface ManualViewProps {
  onSelectManual: (manualId: string) => void;
  searchTerm: string;
}

export const ManualView: React.FC<ManualViewProps> = ({ onSelectManual, searchTerm: initialSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [activeManualId, setActiveManualId] = useState<string>('man-01');

  const categories = [
    { id: 'ALL', label: '전체 매뉴얼 (12종)' },
    { id: 'OVERVIEW', label: '시스템 개요' },
    { id: 'SITE_MANAGER', label: '현장 관리자 매뉴얼' },
    { id: 'SUPPLIER', label: '공급업체 매뉴얼' },
    { id: 'REGULATIONS', label: '조달 및 전결 규정' },
    { id: 'FAQ', label: 'FAQ 및 문제해결' },
    { id: 'API_DEV', label: '개발자 REST API' },
  ];

  const filteredManuals = MANUAL_SECTIONS.filter((m) => {
    const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentManual = MANUAL_SECTIONS.find((m) => m.id === activeManualId) || MANUAL_SECTIONS[0];

  const handleDownloadManualDoc = () => {
    const content = `[건설 자재 조달 관리 시스템 (CPMS) 종합 업무 매뉴얼 패치본]
발행일자: 2026년 9월 17일
표준 규격: 한국 건설산업기본법 및 전자조달 표준 가이드라인

=== 목차 ===
${MANUAL_SECTIONS.map((m, i) => `${i + 1}. [${m.code}] ${m.title} (${m.badge})\n   - 요약: ${m.summary}`).join('\n\n')}

자세한 인터랙티브 가이드는 시스템 내 실시간 매뉴얼 허브에서 확인하실 수 있습니다.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CPMS_건설조달_전체_한글_매뉴얼_패치본.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="text-carbon py-8 text-center border-b hairline">
        <div className="max-w-[720px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pebble text-carbon text-caption mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>공식 한글 표준 매뉴얼 패치 허브</span>
          </div>
          <h1 className="font-display text-heading-sm sm:text-heading font-semibold tracking-heading text-carbon mb-2">
            매뉴얼 <span className="text-variant text-[0.7em]">hub</span>
          </h1>
          <p className="text-subheading font-light text-carbon leading-snug mb-6">
            발주서 작성부터 대금 결제까지, 모든 업무 절차와 표준 규격(API 포함)을 한글로.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onSelectManual('man-01')}
              className="btn-primary cursor-pointer flex items-center gap-1.5"
            >
              <span>7단계 가이드 열기</span>
            </button>
            <button
              onClick={handleDownloadManualDoc}
              className="btn-outline cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>텍스트 파일 저장</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-apple-blue text-ice'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="매뉴얼 검색 (예: 검수, 견적, API, 레미콘)..."
            className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Side-by-side Dual Column: Manual List & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Manual Section Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-body-sm text-carbon">
              검색된 매뉴얼: <span className="text-blue-600">{filteredManuals.length}</span>건
            </span>
            <span className="text-caption text-ash">
              클릭 시 우측에서 상세 내용 열람
            </span>
          </div>

          <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
            {filteredManuals.map((manual) => {
              const isActive = activeManualId === manual.id;
              return (
                <div
                  key={manual.id}
                  onClick={() => setActiveManualId(manual.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-white border-apple-blue ring-1 ring-apple-blue'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                      {manual.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      manual.targetRole === 'SITE_MANAGER' 
                        ? 'bg-blue-100 text-blue-800' 
                        : manual.targetRole === 'SUPPLIER'
                        ? 'bg-indigo-100 text-indigo-800'
                        : manual.targetRole === 'DEV'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {manual.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {manual.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {manual.summary}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {manual.steps ? `${manual.steps.length}단계 절차 포함` : manual.apiReference ? 'REST API 명세 포함' : 'FAQ 및 규정'}
                    </span>
                    <span className="text-blue-600 font-bold flex items-center gap-0.5">
                      자세히 보기 <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredManuals.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                일치하는 매뉴얼을 찾을 수 없습니다. 검색어를 변경해 보세요.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Manual Detail View */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs sticky top-24 max-h-[820px] overflow-y-auto space-y-6">
            {/* Manual Top bar */}
            <div className="border-b border-slate-200 pb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-mono text-xs font-bold shadow-2xs">
                    {currentManual.code}
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {currentManual.badge}
                  </span>
                </div>
                <button
                  onClick={() => onSelectManual(currentManual.id)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>전체화면 팝업 열람</span>
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {currentManual.title}
              </h2>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl/80">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                개요 및 목적
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentManual.summary}
              </p>
            </div>

            {/* Prerequisites */}
            {currentManual.prerequisites && currentManual.prerequisites.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  사전 준비 사항
                </h4>
                <ul className="bg-emerald-50/50 border border-emerald-200/70 p-3.5 rounded-2xl space-y-1.5">
                  {currentManual.prerequisites.map((p, i) => (
                    <li key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Standard Steps */}
            {currentManual.steps && currentManual.steps.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  단계별 표준 실행 절차 (SOP)
                </h4>
                <div className="space-y-3">
                  {currentManual.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {st.stepNumber}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                            {st.title}
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed mb-2">
                            {st.description}
                          </p>
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono flex items-start gap-2">
                            <span className="font-bold text-blue-600 shrink-0">[시스템 조작]</span>
                            <span>{st.actionDetail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cautions */}
            {currentManual.cautions && currentManual.cautions.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  현장 필수 주의사항
                </h4>
                <ul className="space-y-1.5">
                  {currentManual.cautions.map((c, i) => (
                    <li key={i} className="text-xs text-amber-900/90 leading-relaxed flex items-start gap-2">
                      <span className="font-bold text-amber-600">⚠️</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {currentManual.tips && currentManual.tips.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-900 space-y-2">
                <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  실무 활용 권장사항
                </h4>
                <ul className="space-y-1.5">
                  {currentManual.tips.map((t, i) => (
                    <li key={i} className="text-xs text-blue-900/90 leading-relaxed flex items-start gap-2">
                      <span className="font-bold text-blue-600">💡</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {currentManual.faqs && currentManual.faqs.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  자주 묻는 질문 (FAQ)
                </h4>
                <div className="space-y-2.5">
                  {currentManual.faqs.map((faq, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-3.5">
                      <div className="text-xs font-bold text-slate-900 mb-1 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">Q.</span>
                        <span>{faq.question}</span>
                      </div>
                      <div className="text-xs text-slate-600 pl-4 leading-relaxed flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">A.</span>
                        <span>{faq.answer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Spec */}
            {currentManual.apiReference && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  API 엔드포인트 명세
                </h4>
                <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-xs space-y-3 border border-slate-800">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">
                      {currentManual.apiReference.method}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {currentManual.apiReference.endpoint}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    // {currentManual.apiReference.description}
                  </div>
                  {currentManual.apiReference.requestSample && (
                    <div>
                      <span className="text-amber-400 text-[10px] block mb-1">Request Payload:</span>
                      <pre className="text-emerald-300 text-[11px] overflow-x-auto p-2 bg-slate-900 rounded-lg">
                        {currentManual.apiReference.requestSample}
                      </pre>
                    </div>
                  )}
                  {currentManual.apiReference.responseSample && (
                    <div>
                      <span className="text-amber-400 text-[10px] block mb-1">Response JSON:</span>
                      <pre className="text-blue-300 text-[11px] overflow-x-auto p-2 bg-slate-900 rounded-lg">
                        {currentManual.apiReference.responseSample}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
