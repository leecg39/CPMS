import React from 'react';
import { 
  FileText, 
  Calculator, 
  CheckCircle, 
  Truck, 
  ClipboardCheck, 
  Receipt, 
  CreditCard,
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface WorkflowBarProps {
  onSelectManual: (manualId: string) => void;
  activeFilter?: string;
  onFilterWorkflow?: (phase: string) => void;
}

export const InteractiveWorkflowBar: React.FC<WorkflowBarProps> = ({
  onSelectManual,
  activeFilter,
  onFilterWorkflow
}) => {
  const steps = [
    {
      id: 'order',
      title: '1. 발주 신청',
      role: '현장 관리자',
      icon: FileText,
      manualId: 'man-02',
      color: 'blue',
      desc: '필요 규격·수량·납기일 산출 및 발주서 작성'
    },
    {
      id: 'quote',
      title: '2. 견적 제출',
      role: '공급업체',
      icon: Calculator,
      manualId: 'man-06',
      color: 'indigo',
      desc: '공급 가능 단가 및 납기 리드타임 회신'
    },
    {
      id: 'approve',
      title: '3. 발주 승인',
      role: '현장 관리자',
      icon: CheckCircle,
      manualId: 'man-03',
      color: 'emerald',
      desc: '견적 비교 분석 및 최종 계약/출하 지시'
    },
    {
      id: 'dispatch',
      title: '4. 출하·배송',
      role: '공급업체',
      icon: Truck,
      manualId: 'man-07',
      color: 'cyan',
      desc: '배차 차량/기사 등록 및 실시간 운송 추적'
    },
    {
      id: 'inspect',
      title: '5. 현장 검수',
      role: '현장 관리자',
      icon: ClipboardCheck,
      manualId: 'man-04',
      color: 'amber',
      desc: '수량 계량, 성적서 대조 및 전자 인수 서명'
    },
    {
      id: 'invoice',
      title: '6. 송장 발행',
      role: '공급업체',
      icon: Receipt,
      manualId: 'man-08',
      color: 'purple',
      desc: '검수 완료 물량 공급가액/부가세 계산서 청구'
    },
    {
      id: 'payment',
      title: '7. 대금 지급',
      role: '현장 관리자',
      icon: CreditCard,
      manualId: 'man-05',
      color: 'rose',
      desc: '회계 전결 승인 및 계좌이체/어음 정산 마감'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            건설 조달 표준 7단계 업무 라이프사이클 파이프라인
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            각 단계를 클릭하여 해당 공정의 공식 한글 표준 운영 매뉴얼(SOP)을 즉시 열람할 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => onSelectManual('man-01')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>전체 프로세스 개요 매뉴얼</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="group relative bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 rounded-xl p-2.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    STEP 0{idx + 1}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-medium bg-slate-200/80 text-slate-700">
                    {step.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-white text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{step.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">
                  {step.desc}
                </p>
              </div>

              <button
                onClick={() => onSelectManual(step.manualId)}
                className="mt-2 text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between pt-1.5 border-t border-slate-200/60 transition-colors cursor-pointer"
              >
                <span>매뉴얼 보기</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
