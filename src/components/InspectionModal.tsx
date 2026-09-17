import React, { useState } from 'react';
import { DeliveryItem, InspectionResult } from '../types';
import { X, CheckCircle2, AlertTriangle, XCircle, HelpCircle, Truck, UserCheck, ShieldCheck } from 'lucide-react';

interface InspectionModalProps {
  delivery: DeliveryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitInspection: (
    deliveryId: string,
    result: InspectionResult,
    inspectorName: string,
    notes: string,
    signature: string
  ) => void;
  onOpenManual: (manualId: string) => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  delivery,
  isOpen,
  onClose,
  onSubmitInspection,
  onOpenManual
}) => {
  const [result, setResult] = useState<InspectionResult>('PASS');
  const [inspectorName, setInspectorName] = useState('김영호 책임감리원');
  const [notes, setNotes] = useState('KS 표준 규격 검사 합격, 납품 수량 계량표 대조 이상 없음.');
  const [signature, setSignature] = useState('김영호 (전자서명 확인)');

  if (!isOpen || !delivery) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInspection(delivery.id, result, inspectorName, notes, signature);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                현장 자재 반입 입고 검수(Inspection)
              </h2>
              <p className="text-xs text-slate-400">
                실물 수량 계량 및 규격/품질 검수 확인서
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenManual('man-04')}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>검수 매뉴얼(MAN-04)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delivery Details Summary Card */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-blue-600 font-bold">{delivery.deliveryNumber}</span>
            <span className="text-slate-500 font-medium">연계 발주: {delivery.orderNumber}</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">
            {delivery.materialName} ({delivery.quantity} {delivery.unit})
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
            <div><span className="font-semibold">공급업체:</span> {delivery.supplierName}</div>
            <div><span className="font-semibold">도착 현장:</span> {delivery.siteName}</div>
            <div><span className="font-semibold">운송 차량:</span> {delivery.vehicleNumber}</div>
            <div><span className="font-semibold">기사 연락처:</span> {delivery.driverName} ({delivery.driverContact})</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Inspection Result Options */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              자재 품질/수량 검수 판정 결과 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label 
                className={`p-3 rounded-lg border flex flex-col items-center text-center cursor-pointer transition-all ${
                  result === 'PASS'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="result"
                  value="PASS"
                  checked={result === 'PASS'}
                  onChange={() => setResult('PASS')}
                  className="sr-only"
                />
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-bold text-xs">합격 (PASS)</span>
                <span className="text-[10px] text-slate-500 mt-0.5">정상 수량·규격 완비</span>
              </label>

              <label 
                className={`p-3 rounded-lg border flex flex-col items-center text-center cursor-pointer transition-all ${
                  result === 'CONDITIONAL_PASS'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="result"
                  value="CONDITIONAL_PASS"
                  checked={result === 'CONDITIONAL_PASS'}
                  onChange={() => setResult('CONDITIONAL_PASS')}
                  className="sr-only"
                />
                <AlertTriangle className="w-5 h-5 text-amber-600 mb-1" />
                <span className="font-bold text-xs">조건부 합격</span>
                <span className="text-[10px] text-slate-500 mt-0.5">일부 수량 부족/보완</span>
              </label>

              <label 
                className={`p-3 rounded-lg border flex flex-col items-center text-center cursor-pointer transition-all ${
                  result === 'FAIL'
                    ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="result"
                  value="FAIL"
                  checked={result === 'FAIL'}
                  onChange={() => setResult('FAIL')}
                  className="sr-only"
                />
                <XCircle className="w-5 h-5 text-red-600 mb-1" />
                <span className="font-bold text-xs">불합격 (FAIL)</span>
                <span className="text-[10px] text-slate-500 mt-0.5">반품 및 재출하 요구</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              검수자 성명 및 직책 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white text-xs font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              검수 세부 의견 및 시험성적서 대조 메모
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="밀시트 대조 결과, 실측 수량, 외관 변형 여부 등을 기재"
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white text-xs outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              현장 인수 서명 (전자 서명 대조) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white text-xs font-mono font-bold outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * 서명 완료 시 공급업체는 해당 납품에 대해 전자세금계산서/송장을 즉시 발행할 수 있습니다.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              닫기
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>검수 완료 및 인수증 서명 승인</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
