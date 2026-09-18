import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  CheckCircle,
  Truck,
  ClipboardCheck,
  Receipt,
  CreditCard,
  BookOpen,
  ChevronRight,
  X
} from 'lucide-react';
import { MANUAL_SECTIONS } from '../data/manualData';

interface WorkflowBarProps {
  onSelectManual: (manualId: string) => void;
  selectedManualId?: string | null;
}

export const WORKFLOW_STEPS = [
  {
    id: 'order',
    title: '발주 신청',
    role: '현장 관리자',
    icon: FileText,
    manualId: 'man-02',
    desc: '필요 규격·수량·납기일 산출 및 발주서 작성'
  },
  {
    id: 'quote',
    title: '견적 제출',
    role: '공급업체',
    icon: Calculator,
    manualId: 'man-06',
    desc: '공급 가능 단가 및 납기 리드타임 회신'
  },
  {
    id: 'approve',
    title: '발주 승인',
    role: '현장 관리자',
    icon: CheckCircle,
    manualId: 'man-03',
    desc: '견적 비교 분석 및 최종 계약/출하 지시'
  },
  {
    id: 'dispatch',
    title: '출하·배송',
    role: '공급업체',
    icon: Truck,
    manualId: 'man-07',
    desc: '배차 차량/기사 등록 및 실시간 운송 추적'
  },
  {
    id: 'inspect',
    title: '현장 검수',
    role: '현장 관리자',
    icon: ClipboardCheck,
    manualId: 'man-04',
    desc: '수량 계량, 성적서 대조 및 전자 인수 서명'
  },
  {
    id: 'invoice',
    title: '송장 발행',
    role: '공급업체',
    icon: Receipt,
    manualId: 'man-08',
    desc: '검수 완료 물량 공급가액/부가세 계산서 청구'
  },
  {
    id: 'payment',
    title: '대금 지급',
    role: '현장 관리자',
    icon: CreditCard,
    manualId: 'man-05',
    desc: '회계 전결 승인 및 계좌이체/어음 정산 마감'
  }
] as const;

const WORKFLOW_MANUAL_IDS: Set<string> = new Set(WORKFLOW_STEPS.map((step) => step.manualId));

const OTHER_MANUAL_LABELS: Record<string, string> = {
  'man-01': '시스템 개요',
  'man-09': '대금 수금',
  'man-10': '조달 규정',
  'man-11': 'FAQ / 문제 해결',
  'man-12': 'API 명세'
};

function otherManualLabel(id: string, title: string): string {
  return OTHER_MANUAL_LABELS[id] ?? title.replace(/^\[[^\]]+\]\s*/, '');
}

export const InteractiveWorkflowBar: React.FC<WorkflowBarProps> = ({
  onSelectManual,
  selectedManualId
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const otherManuals = MANUAL_SECTIONS.filter((manual) => !WORKFLOW_MANUAL_IDS.has(manual.id));

  const handleSelect = (manualId: string) => {
    onSelectManual(manualId);
    setMobileOpen(false);
  };

  const nav = (
    <nav aria-label="조달 매뉴얼" className="px-4 py-5">
      <div className="mb-5">
        <h2 className="font-display text-body font-semibold text-carbon">
          7단계 조달 라이프사이클
        </h2>
        <p className="text-caption text-ash mt-1 leading-snug">
          단계를 선택하면 해당 표준 운영 매뉴얼이 열립니다.
        </p>
      </div>

      <ol className="space-y-0.5">
        {WORKFLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = selectedManualId === step.manualId;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => handleSelect(step.manualId)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left rounded-lg px-2.5 py-2 transition-colors cursor-pointer ${
                  isActive ? 'bg-ice' : 'hover:bg-frost'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-caption text-ash tabular-nums w-5 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <Icon className="w-4 h-4 text-carbon shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-body-sm font-semibold leading-snug ${isActive ? 'text-apple-blue' : 'text-carbon'}`}>
                        {step.title}
                      </span>
                      <span className="text-caption px-2 py-0.5 rounded-full bg-pebble text-carbon shrink-0">
                        {step.role}
                      </span>
                    </div>
                    <p className="text-caption text-ash leading-snug mt-0.5 line-clamp-2">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 pt-5 border-t hairline">
        <h2 className="text-caption font-semibold text-ash tracking-wide mb-2">
          기타 매뉴얼
        </h2>
        <ul className="space-y-0.5">
          {otherManuals.map((manual) => {
            const isActive = selectedManualId === manual.id;
            return (
              <li key={manual.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(manual.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left rounded-lg px-2.5 py-2 transition-colors cursor-pointer ${
                    isActive ? 'bg-ice' : 'hover:bg-frost'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-caption text-ash shrink-0">
                      {manual.code}
                    </span>
                    <span className={`text-body-sm leading-snug ${isActive ? 'text-apple-blue font-semibold' : 'text-carbon'}`}>
                      {otherManualLabel(manual.id, manual.title)}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-mist ml-auto shrink-0" />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border hairline rounded-lg text-body-sm text-carbon cursor-pointer"
          aria-expanded={mobileOpen}
          aria-controls="manual-sidebar"
        >
          <span className="inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>매뉴얼 패널</span>
          </span>
          <span className="text-caption text-ash">7단계 + 기타 {otherManuals.length}건</span>
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 cursor-pointer"
            aria-label="매뉴얼 패널 닫기"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            id="manual-sidebar"
            className="absolute left-0 top-0 bottom-0 w-[min(20rem,92vw)] bg-white overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b hairline">
              <span className="text-body-sm font-semibold text-carbon">매뉴얼</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-full hover:bg-frost cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-4 h-4 text-carbon" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}

      <aside
        id="manual-sidebar-desktop"
        className="hidden lg:block w-[280px] shrink-0 self-start sticky top-[100px] max-h-[calc(100vh-116px)] overflow-y-auto bg-white border hairline rounded-lg"
      >
        {nav}
      </aside>
    </>
  );
};
