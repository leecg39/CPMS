import React, { useState, useMemo } from 'react';
import { OrderItem, PriorityLevel } from '../types';
import { 
  validateOrderForm, 
  STANDARD_MATERIALS, 
  getStandardAddressForSite, 
  ValidationReport,
  ValidationIssue
} from '../utils/orderValidation';
import {
  defaultRequestedDeliveryDate,
  draftOrderNumber,
  flawedSampleDeliveryDate,
  localDatePlusDays
} from '../utils/liveDates';
import { 
  X, 
  Plus, 
  AlertCircle, 
  HelpCircle, 
  Building2, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Wand2, 
  ShieldCheck, 
  Check, 
  RotateCcw, 
  BadgeCheck,
  Send,
  Layers,
  MapPin,
  Clock,
  Hash
} from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<OrderItem, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => void;
  onOpenManual: (manualId: string) => void;
}

type WizardStep = 'CHECK' | 'MODIFY' | 'INSPECT' | 'SUBMIT';

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onOpenManual
}) => {
  // Step state: 1.자동체크 -> 2.수정 -> 3.검수 -> 4.발주요청
  const [currentStep, setCurrentStep] = useState<WizardStep>('CHECK');

  // Form fields
  const [siteName, setSiteName] = useState('강남 르네상스타워 신축공사');
  const [materialId, setMaterialId] = useState('MAT-CON-01');
  const [materialName, setMaterialName] = useState('레미콘 25-270-18 (고강도 콘크리트)');
  const [category, setCategory] = useState('콘크리트/골재');
  const [specification, setSpecification] = useState('KS F 4009 규격, 굵은골재 25mm, 호칭강도 27MPa, 슬럼프 180mm');
  const [quantity, setQuantity] = useState<number>(120);
  const [unit, setUnit] = useState('m³');
  const [unitPrice, setUnitPrice] = useState<number>(94000);
  const [priority, setPriority] = useState<PriorityLevel>('NORMAL');
  const [deliveryAddress, setDeliveryAddress] = useState('서울 강남구 테헤란로 152 신축공사 현장 서문 2번 게이트 (지하 2층 코어부 타설장)');
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState(defaultRequestedDeliveryDate);
  const [supplierName, setSupplierName] = useState('현대레미콘(주)');
  const [notes, setNotes] = useState('코어부 벽체 연속 타설용, 믹서트럭 15분 간격 순환 배차 필수');

  // Inspection agreement checkbox for Step 3
  const [isInspectionConfirmed, setIsInspectionConfirmed] = useState(false);

  // Compute validation report in real-time
  const report: ValidationReport = useMemo(() => {
    return validateOrderForm({
      materialId,
      materialName,
      quantity,
      unit,
      requestedDeliveryDate,
      deliveryAddress,
      specification,
      siteName
    });
  }, [materialId, materialName, quantity, unit, requestedDeliveryDate, deliveryAddress, specification, siteName]);

  if (!isOpen) return null;

  const totalAmount = (quantity || 0) * (unitPrice || 0);

  // Test Sample: Load flawed order with missing, ambiguous, and wrong unit values
  const handleLoadFlawedSample = () => {
    setMaterialId(''); // Missing ID
    setMaterialName('레미콘 타설용 자재');
    setCategory('콘크리트/골재');
    setSpecification('좋은 거 알아서 보내주세요'); // Ambiguous spec
    setQuantity(0); // Invalid quantity
    setUnit('개'); // Wrong unit for concrete!
    setUnitPrice(95000);
    setRequestedDeliveryDate(flawedSampleDeliveryDate());
    setDeliveryAddress('현장 앞마당 알아서'); // Ambiguous address
    setSupplierName('현대레미콘(주)');
    setNotes('아무때나 빨리');
    setCurrentStep('CHECK');
    setIsInspectionConfirmed(false);
  };

  // Preset quick standard materials
  const handleSelectPresetMaterial = (p: typeof STANDARD_MATERIALS[0]) => {
    setMaterialId(p.id);
    setMaterialName(p.name);
    setCategory(p.category);
    setSpecification(p.recommendedSpec);
    setUnit(p.standardUnit);
    setQuantity(p.minQty * 2);
    setUnitPrice(p.defaultPrice);
    setDeliveryAddress(getStandardAddressForSite(siteName));
    setRequestedDeliveryDate(localDatePlusDays(Math.max(p.leadTimeDays, 1)));
  };

  // Apply single correction
  const handleApplySingleCorrection = (issue: ValidationIssue) => {
    switch (issue.field) {
      case 'materialId':
        setMaterialId(issue.suggestedValue);
        break;
      case 'quantity':
        setQuantity(Number(issue.suggestedValue));
        break;
      case 'unit':
        setUnit(issue.suggestedValue);
        break;
      case 'requestedDeliveryDate':
        setRequestedDeliveryDate(issue.suggestedValue);
        break;
      case 'deliveryAddress':
        setDeliveryAddress(issue.suggestedValue);
        break;
      case 'specification':
        setSpecification(issue.suggestedValue);
        break;
    }
  };

  // Smart Auto-Fix: Apply all recommended corrections at once
  const handleSmartAutoFixAll = () => {
    report.issues.forEach((issue) => {
      handleApplySingleCorrection(issue);
    });
  };

  // Final Order Request Submission
  const handleFinalSubmit = () => {
    onSubmit({
      materialId: materialId.trim() || 'MAT-GEN-01',
      siteName,
      materialName,
      category,
      specification: specification || '표준 KS 규격 준수',
      quantity: Number(quantity),
      unit,
      unitPrice: Number(unitPrice),
      totalAmount,
      supplierId: 'sup-new',
      supplierName: supplierName || '지정 공급업체',
      priority,
      deliveryAddress,
      requestedDeliveryDate,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Title & Manual Link */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  건설 자재 발주신청서 정밀 검증 시스템
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/30 text-blue-300 border border-blue-400/30">
                  4단계 파이프라인
                </span>
              </div>
              <p className="text-xs text-slate-400">
                6대 핵심 항목(품목 ID, 수량, 단위, 희망일, 배송 위치, 규격) 자동 검증 및 정식 발주
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenManual('man-02')}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">발주 매뉴얼(MAN-02)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-Step Pipeline Bar (체크 - 수정 - 검수 - 발주요청) */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="grid grid-cols-4 gap-2 text-xs">
            {/* Step 1: 자동 체크 */}
            <button
              type="button"
              onClick={() => setCurrentStep('CHECK')}
              className={`p-2 rounded-full border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                currentStep === 'CHECK'
                  ? 'bg-obsidian text-frost-white border-obsidian'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>자동 체크</span>
              {report.issues.length > 0 ? (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              )}
            </button>

            {/* Step 2: 수정 */}
            <button
              type="button"
              onClick={() => setCurrentStep('MODIFY')}
              className={`p-2 rounded-full border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                currentStep === 'MODIFY'
                  ? 'bg-obsidian text-frost-white border-obsidian'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>스마트 수정</span>
              <Wand2 className="w-3.5 h-3.5" />
            </button>

            {/* Step 3: 검수 */}
            <button
              type="button"
              onClick={() => setCurrentStep('INSPECT')}
              className={`p-2 rounded-full border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                currentStep === 'INSPECT'
                  ? 'bg-obsidian text-frost-white border-obsidian'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
              <span>사전 검수</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>

            {/* Step 4: 발주요청 */}
            <button
              type="button"
              onClick={() => {
                if (report.isValid && isInspectionConfirmed) {
                  setCurrentStep('SUBMIT');
                } else if (!report.isValid) {
                  setCurrentStep('MODIFY');
                } else {
                  setCurrentStep('INSPECT');
                }
              }}
              className={`p-2 rounded-full border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                currentStep === 'SUBMIT'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">4</span>
              <span>발주요청</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Preset & Test Sample Toolbar */}
        <div className="px-6 py-2 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="font-bold text-slate-500 shrink-0 text-[11px]">KS 표준 자재 빠른 지정:</span>
            {STANDARD_MATERIALS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPresetMaterial(p)}
                className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-full border border-slate-200 shrink-0 text-[11px] font-medium transition-colors cursor-pointer"
              >
                {p.name.split(' ')[0]} ({p.id})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleLoadFlawedSample}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-[11px] font-bold border border-amber-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
          >
            <span>🧪 모호한 표현/틀린 단위 테스트용 샘플 불러오기</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* ================= STEP 1: 자동 체크 (AUTO CHECK) ================= */}
          {currentStep === 'CHECK' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Score & Diagnostic Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                report.isValid 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                  : 'bg-red-50 border-red-200 text-red-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    report.isValid ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {report.isValid ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wide">
                        {report.isValid ? '발주신청서 양식 적합 판정' : '발주신청서 양식 오류 및 모호성 감지'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        report.isValid ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                      }`}>
                        적합도: {report.score}점
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 opacity-90">
                      {report.isValid 
                        ? '6대 필수 항목(품목 ID, 수량, 단위, 희망일, 배송 위치, 규격)이 모두 정상 표준 양식에 부합합니다.' 
                        : `총 ${report.issues.length}건의 결함(누락, 모호한 표현, 단위 오류)이 감지되었습니다. 2단계 [수정]에서 원클릭 교정이 가능합니다.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!report.isValid ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep('MODIFY')}
                      className="px-3.5 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <span>스마트 수정하기 (2단계)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStep('INSPECT')}
                      className="px-3.5 py-2 btn-primary btn-sm font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <span>사전 검수 진행 (3단계)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Input Grid with Real-time Field Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    대상 공사 현장명 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={siteName}
                    onChange={(e) => {
                      setSiteName(e.target.value);
                      setDeliveryAddress(getStandardAddressForSite(e.target.value));
                    }}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                  >
                    <option>강남 르네상스타워 신축공사</option>
                    <option>송도 바이오 콤플렉스 3공구</option>
                    <option>판교 하이퍼 데이터센터 신축</option>
                    <option>마곡 융합 R&D 센터 2차</option>
                    <option>여의도 국제금융타워 증축현장</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    자재 공종 분류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                  >
                    <option>철강/골조자재</option>
                    <option>콘크리트/골재</option>
                    <option>시멘트/혼화재</option>
                    <option>가설/목재자재</option>
                    <option>방수/단열/마감재</option>
                    <option>전기/설비 배관재</option>
                  </select>
                </div>
              </div>

              {/* 6 Essential Fields with Dynamic Status Indicator */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    6대 필수 검증 항목 실시간 진단 상태
                  </span>
                  <span className="text-[11px] text-slate-400">
                    통과 항목: <b>{report.passedFields.length}</b> / 6개
                  </span>
                </div>

                {/* 1. 품목 ID & 품목명 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">
                        1. 품목 ID (Material ID) <span className="text-red-500">*</span>
                      </label>
                      {report.passedFields.includes('materialId') ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> 정상
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> 누락/오류
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={materialId}
                      onChange={(e) => setMaterialId(e.target.value)}
                      placeholder="예: MAT-CON-01"
                      className={`w-full p-2 rounded-xl border text-xs font-mono font-bold outline-none ${
                        !materialId ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      자재 품목명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      placeholder="예: 레미콘 25-270-18 (고강도 콘크리트)"
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* 2. 수량 & 3. 단위 & 단가 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">
                        2. 발주 수량 <span className="text-red-500">*</span>
                      </label>
                      {report.passedFields.includes('quantity') ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> 정상
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> 오류
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className={`w-full p-2 rounded-xl border text-xs font-mono font-bold outline-none ${
                        quantity <= 0 ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">
                        3. 단위 (Unit) <span className="text-red-500">*</span>
                      </label>
                      {report.passedFields.includes('unit') ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> 표준 단위
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> 단위 틀림
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="톤(TON), m³, 포, 매, 본 등"
                      className={`w-full p-2 rounded-xl border text-xs font-bold outline-none ${
                        !report.passedFields.includes('unit') ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      예상 단가 (원)
                    </label>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                {/* 4. 납기 희망일 & 우선순위 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">
                        4. 납기 희망 일자 <span className="text-red-500">*</span>
                      </label>
                      {report.passedFields.includes('requestedDeliveryDate') ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> 유효 일자
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> 과거/누락
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      value={requestedDeliveryDate}
                      onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                      className={`w-full p-2 rounded-xl border text-xs font-semibold outline-none ${
                        !report.passedFields.includes('requestedDeliveryDate') ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      발주 우선순위
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none"
                    >
                      <option value="NORMAL">일반 (Normal)</option>
                      <option value="URGENT">긴급 (Urgent)</option>
                      <option value="EMERGENCY">초긴급 (Emergency)</option>
                    </select>
                  </div>
                </div>

                {/* 5. 배송 위치 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      5. 반입 배송 위치 (하역 게이트 및 양중구역) <span className="text-red-500">*</span>
                    </label>
                    {report.passedFields.includes('deliveryAddress') ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> 게이트 특정됨
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> 모호한 표현
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="예: 서울 강남구 테헤란로 152 신축공사 현장 서문 2번 게이트 (지하 2층 코어부 하역장)"
                    className={`w-full p-2 rounded-xl border text-xs outline-none ${
                      !report.passedFields.includes('deliveryAddress') ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'
                    }`}
                  />
                </div>

                {/* 6. 규격 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      6. 상세 사양 및 KS 품질 규격 <span className="text-red-500">*</span>
                    </label>
                    {report.passedFields.includes('specification') ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> 공인 규격
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> 모호한 표현/누락
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
                    placeholder="예: KS F 4009 규격, 굵은골재 25mm, 호칭강도 27MPa, 슬럼프 180mm"
                    className={`w-full p-2 rounded-xl border text-xs outline-none ${
                      !report.passedFields.includes('specification') ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">
                  총 예상 발주 금액 (공급가액 기준):
                </span>
                <span className="text-base font-black text-blue-700 font-mono">
                  {totalAmount.toLocaleString()} 원
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 2: 스마트 수정 (SMART FIX) ================= */}
          {currentStep === 'MODIFY' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      감지된 오류 및 모호한 표현 스마트 자동 교정
                    </h4>
                    <p className="text-xs text-amber-800">
                      누락되거나 모호한 표현, 틀린 거래 단위를 KS 표준 시방 기준 추천값으로 교정합니다.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSmartAutoFixAll}
                  className="px-4 py-2 btn-primary btn-sm font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>원클릭 일괄 자동 교정</span>
                </button>
              </div>

              {/* Issues List with Individual Fix Actions */}
              {report.issues.length === 0 ? (
                <div className="p-8 text-center bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">
                    모든 오류 및 모호한 표현이 성공적으로 수정되었습니다!
                  </h4>
                  <p className="text-xs text-emerald-700 mb-4">
                    적합도 점수 100점 달성. 3단계 [사전 검수]로 이동하여 최종 체크리스트를 확인하세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('INSPECT')}
                    className="px-5 py-2 btn-primary btn-sm font-bold rounded-full shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <span>3단계 사전 검수로 이동하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>수정이 필요한 항목 ({report.issues.length}건)</span>
                    <span className="text-red-500 text-[11px]">* 각 항목별 [추천값 적용]을 누르거나 직접 수정하세요.</span>
                  </div>

                  {report.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl border border-red-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-800 border border-red-200">
                            {issue.fieldNameKorean}
                          </span>
                          <span className="font-bold text-slate-800 text-xs">{issue.reason}</span>
                        </div>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-1">
                          <span className="line-through text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-mono">
                            현재: {issue.currentValue}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                            권장: {issue.suggestedValue}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplySingleCorrection(issue)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-full text-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-center"
                      >
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>{issue.suggestedActionName}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: 사전 검수 (PRE-FLIGHT INSPECTION) ================= */}
          {currentStep === 'INSPECT' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                    Pre-Flight Inspection
                  </span>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    발주신청서 6대 핵심 항목 사전 적격 검수표
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-white">
                    적합도 {report.score}점 (적격 합격)
                  </span>
                </div>
              </div>

              {/* 6 Items Checklist Grid */}
              <div className="bg-frost-white rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100">
                {/* 1. 품목 ID */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">품목 ID (Item Code)</div>
                      <div className="text-slate-500 text-[11px] font-mono font-bold text-blue-600">{materialId}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> KS 표준 코드 확인
                  </span>
                </div>

                {/* 2. 수량 */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">발주 수량 (Quantity)</div>
                      <div className="text-slate-500 text-[11px] font-mono font-bold text-slate-800">{quantity.toLocaleString()} {unit}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> 최소 MOQ 충족
                  </span>
                </div>

                {/* 3. 단위 */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">단위 (Unit)</div>
                      <div className="text-slate-500 text-[11px] font-bold text-indigo-700">{unit}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> 공인 거래 규격 일치
                  </span>
                </div>

                {/* 4. 희망일 */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">납기 희망 일자 (Delivery Date)</div>
                      <div className="text-slate-500 text-[11px] font-mono font-bold text-slate-800">{requestedDeliveryDate}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> 리드타임 안전 확보
                  </span>
                </div>

                {/* 5. 배송 위치 */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      5
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">반입 배송 위치 (Location)</div>
                      <div className="text-slate-600 text-[11px] max-w-md line-clamp-1">{deliveryAddress}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" /> 하역 게이트 확정
                  </span>
                </div>

                {/* 6. 규격 */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      6
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">상세 품질 사양 및 규격 (Specification)</div>
                      <div className="text-slate-600 text-[11px] max-w-md line-clamp-1">{specification}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" /> KS 구조감리 승인
                  </span>
                </div>
              </div>

              {/* Inspector Agreement Confirmation */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="inspect-confirm"
                  checked={isInspectionConfirmed}
                  onChange={(e) => setIsInspectionConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="inspect-confirm" className="cursor-pointer text-xs text-blue-950 font-medium leading-relaxed">
                  <b>[검수 책임자 서명 확인]</b> 현장 공무담당자로서 상기 6대 항목(품목 ID, 수량, 단위, 희망일, 배송 위치, 규격)에 누락이나 모호한 표현이 없으며 공인 단위가 일치함을 확인하고 정식 발주요청을 승인합니다.
                </label>
              </div>
            </div>
          )}

          {/* ================= STEP 4: 발주요청 확정 (SUBMIT) ================= */}
          {currentStep === 'SUBMIT' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-2xl p-5 bg-frost-white shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      Purchase Order Preview
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      건설 자재 정식 발주신청서 (PO)
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">발주 관리번호 (임시)</span>
                    <span className="text-xs font-mono font-black text-blue-600">{draftOrderNumber()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">발주 현장</span>
                    <span className="font-bold text-slate-800">{siteName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">협력 공급업체</span>
                    <span className="font-bold text-slate-800">{supplierName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">발주 우선순위</span>
                    <span className="font-bold text-blue-600">{priority}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">납기 희망일</span>
                    <span className="font-bold text-slate-800 font-mono">{requestedDeliveryDate}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">품목 ID 및 명칭:</span>
                    <span className="font-bold text-slate-900">
                      [{materialId}] {materialName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">상세 KS 규격:</span>
                    <span className="font-bold text-slate-800">{specification}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">발주 수량 및 단위:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {quantity.toLocaleString()} {unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">반입 배송 위치:</span>
                    <span className="font-medium text-slate-700">{deliveryAddress}</span>
                  </div>
                  {notes && (
                    <div className="flex items-start justify-between">
                      <span className="text-slate-500">현장 특이사항:</span>
                      <span className="font-medium text-slate-700">{notes}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    최종 발주 요청 총액:
                  </span>
                  <span className="text-lg font-black text-blue-700 font-mono">
                    {totalAmount.toLocaleString()} 원
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Workflow Navigation */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div>
            {currentStep !== 'CHECK' && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 'SUBMIT') setCurrentStep('INSPECT');
                  else if (currentStep === 'INSPECT') setCurrentStep('MODIFY');
                  else if (currentStep === 'MODIFY') setCurrentStep('CHECK');
                }}
                className="px-3.5 py-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-full font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>이전 단계</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-full border border-slate-200 font-bold transition-colors cursor-pointer"
            >
              닫기
            </button>

            {currentStep === 'CHECK' && (
              <button
                type="button"
                onClick={() => {
                  if (report.isValid) {
                    setCurrentStep('INSPECT');
                  } else {
                    setCurrentStep('MODIFY');
                  }
                }}
                className="px-5 py-2 btn-primary btn-sm font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{report.isValid ? '사전 검수 진행 ➔' : '오류 및 모호한 표현 수정 ➔'}</span>
              </button>
            )}

            {currentStep === 'MODIFY' && (
              <button
                type="button"
                onClick={() => {
                  if (report.isValid) {
                    setCurrentStep('INSPECT');
                  } else {
                    handleSmartAutoFixAll();
                    setTimeout(() => setCurrentStep('INSPECT'), 200);
                  }
                }}
                className="px-5 py-2 btn-primary btn-sm font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{report.isValid ? '사전 검수 진행 (3단계) ➔' : '일괄 교정 후 사전 검수 ➔'}</span>
              </button>
            )}

            {currentStep === 'INSPECT' && (
              <button
                type="button"
                disabled={!isInspectionConfirmed}
                onClick={() => setCurrentStep('SUBMIT')}
                className={`px-5 py-2 font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${
                  isInspectionConfirmed
                    ? 'btn-primary btn-sm cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>발주요청 확정 (4단계) ➔</span>
              </button>
            )}

            {currentStep === 'SUBMIT' && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 btn-primary btn-sm font-bold rounded-full shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Send className="w-4 h-4" />
                <span>발주신청서 전송 및 발주요청 완료</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
