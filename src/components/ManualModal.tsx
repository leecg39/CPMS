import React from 'react';
import { ManualSection } from '../types';
import { 
  X, 
  BookOpen, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  Code2, 
  ArrowRight,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface ManualModalProps {
  manual: ManualSection | null;
  onClose: () => void;
  onNavigateToScreen?: (screen: string) => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({
  manual,
  onClose,
  onNavigateToScreen
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!manual) return null;

  const handleCopyApi = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-blue-500/30 text-blue-300 text-xs font-mono font-bold border border-blue-400/30">
              {manual.code}
            </span>
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                {manual.badge}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {manual.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="매뉴얼 인쇄"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Summary Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              업무 개요 및 핵심 요약
            </h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              {manual.summary}
            </p>
            {manual.relatedScreen && (
              <div className="mt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">관련 시스템 화면:</span> {manual.relatedScreen}
              </div>
            )}
          </div>

          {/* Prerequisites */}
          {manual.prerequisites && manual.prerequisites.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                사전 필요 요건 (Prerequisites)
              </h4>
              <ul className="space-y-1.5 pl-2">
                {manual.prerequisites.map((req, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step-by-Step Procedure */}
          {manual.steps && manual.steps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                단계별 표준 처리 절차 (Standard Operating Procedure)
              </h4>
              <div className="space-y-3">
                {manual.steps.map((step) => (
                  <div 
                    key={step.stepNumber}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-bold text-slate-900 mb-1">
                          {step.title}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {step.description}
                        </p>
                        <div className="bg-slate-50 p-2 rounded-lg text-xs font-mono text-slate-700 border border-slate-200/60 flex items-start gap-1.5">
                          <span className="font-semibold text-blue-600 shrink-0">[실행 경로]</span>
                          <span>{step.actionDetail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cautions */}
          {manual.cautions && manual.cautions.length > 0 && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900">
              <h4 className="text-xs font-bold flex items-center gap-1.5 mb-2 text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                현장 준수 주의사항 및 위반 시 조치
              </h4>
              <ul className="space-y-1.5 pl-1">
                {manual.cautions.map((caution, i) => (
                  <li key={i} className="text-xs flex items-start gap-2 text-amber-900/90 leading-relaxed">
                    <span className="font-bold text-amber-600">⚠️</span>
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {manual.tips && manual.tips.length > 0 && (
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900">
              <h4 className="text-xs font-bold flex items-center gap-1.5 mb-2 text-blue-950">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                실무 활용 팁 & 권장사항
              </h4>
              <ul className="space-y-1.5 pl-1">
                {manual.tips.map((tip, i) => (
                  <li key={i} className="text-xs flex items-start gap-2 text-blue-900/90 leading-relaxed">
                    <span className="font-bold text-blue-600">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs */}
          {manual.faqs && manual.faqs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                자주 묻는 질문 (FAQ)
              </h4>
              <div className="space-y-2.5">
                {manual.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-xs font-bold text-slate-900 mb-1 flex items-start gap-2">
                      <span className="text-blue-600 font-black">Q.</span>
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

          {/* API Reference */}
          {manual.apiReference && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-900 text-slate-200 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono font-bold">{manual.apiReference.method}</span>
                  <span className="text-xs font-mono text-emerald-400">{manual.apiReference.endpoint}</span>
                </div>
                {manual.apiReference.requestSample && (
                  <button
                    onClick={() => handleCopyApi(manual.apiReference?.requestSample || '')}
                    className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? '복사완료' : 'JSON 복사'}</span>
                  </button>
                )}
              </div>
              <div className="p-3 bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto space-y-2">
                <div className="text-slate-400 text-[11px] mb-1">
                  // {manual.apiReference.description}
                </div>
                {manual.apiReference.requestSample && (
                  <div>
                    <span className="text-amber-400 text-[10px] block mb-1">Request Payload:</span>
                    <pre className="text-emerald-300 text-[11px] leading-snug">
                      {manual.apiReference.requestSample}
                    </pre>
                  </div>
                )}
                {manual.apiReference.responseSample && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-amber-400 text-[10px] block mb-1">Response Sample:</span>
                    <pre className="text-blue-300 text-[11px] leading-snug">
                      {manual.apiReference.responseSample}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            한국 건설자재 조달 표준업무지침 v2.4 반영
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
