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
    <section className="text-carbon">
      <div className="text-center max-w-[720px] mx-auto mb-10">
        <h2 className="font-display text-heading-sm sm:text-heading font-semibold text-carbon tracking-heading">
          7단계 조달 라이프사이클
        </h2>
        <p className="text-subheading font-light text-carbon mt-2">
          각 단계를 선택하면 공식 한글 표준 운영 매뉴얼(SOP)이 열립니다.
        </p>
        <button
          onClick={() => onSelectManual('man-01')}
          className="link text-body inline-flex items-center gap-1 mt-3 cursor-pointer"
        >
          <span>전체 프로세스 개요 매뉴얼</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Typographic step row — hairline dividers, no card containers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 border-t hairline lg:divide-x divide-hairline">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="group flex flex-col justify-between pt-5 pb-6 px-4 border-b hairline lg:border-b-0"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-caption text-ash">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-caption px-2.5 py-0.5 rounded-full bg-pebble text-carbon">
                    {step.role}
                  </span>
                </div>
                <Icon className="w-5 h-5 text-carbon mb-2.5" strokeWidth={1.5} />
                <div className="text-body font-semibold text-carbon leading-snug mb-1">
                  {step.title.replace(/^\d+\.\s*/, '')}
                </div>
                <p className="text-body-sm text-ash leading-snug">
                  {step.desc}
                </p>
              </div>

              <button
                onClick={() => onSelectManual(step.manualId)}
                className="link text-body-sm mt-4 inline-flex items-center gap-0.5 self-start cursor-pointer"
              >
                <span>매뉴얼 보기</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
