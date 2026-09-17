import React, { useRef, useState } from 'react';
import { OrderItem, InvoiceItem } from '../types';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  FileText, 
  Receipt, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Hash, 
  ZoomIn, 
  ZoomOut, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DocumentPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderItem | null;
  invoice?: InvoiceItem | null;
  allOrders?: OrderItem[];
}

// 숫자를 한글 금액 표기로 변환하는 유틸리티 (예: 47,520,000 -> 사천칠백오십이만)
function numberToKoreanCurrency(amount: number): string {
  if (amount === 0) return '영';
  const units = ['', '만', '억', '조'];
  const smallUnits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const tenUnits = ['', '십', '백', '천'];

  let result = '';
  let unitIndex = 0;
  let tempAmount = Math.floor(amount);

  while (tempAmount > 0) {
    const chunk = tempAmount % 10000;
    if (chunk > 0) {
      let chunkStr = '';
      let chunkTemp = chunk;
      for (let i = 0; i < 4; i++) {
        const digit = chunkTemp % 10;
        if (digit > 0) {
          chunkStr = smallUnits[digit] + tenUnits[i] + chunkStr;
        }
        chunkTemp = Math.floor(chunkTemp / 10);
      }
      result = chunkStr + units[unitIndex] + ' ' + result;
    }
    tempAmount = Math.floor(tempAmount / 10000);
    unitIndex++;
  }

  return '금 ' + result.trim() + ' 원정';
}

export const DocumentPdfModal: React.FC<DocumentPdfModalProps> = ({
  isOpen,
  onClose,
  order,
  invoice,
  allOrders = []
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  // 세금계산서 전용: 공급받는자 보관용 (청색) vs 공급자 보관용 (적색)
  const [invoiceType, setInvoiceType] = useState<'RECEIVER' | 'SUPPLIER'>('RECEIVER');

  if (!isOpen || (!order && !invoice)) return null;

  const isOrder = !!order;
  const isInvoice = !!invoice;

  // 세금계산서의 경우 연계된 발주 정보 탐색
  const relatedOrder = isInvoice 
    ? allOrders.find((o) => o.orderNumber === invoice?.orderNumber || o.id === invoice?.orderId)
    : null;

  const docTitle = isOrder 
    ? `승인 발주서 (${order?.orderNumber})` 
    : `전자세금계산서 (${invoice?.invoiceNumber})`;

  // 클립보드 복사
  const handleCopyNumber = () => {
    const textToCopy = isOrder ? order?.orderNumber || '' : invoice?.invoiceNumber || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. PDF 다운로드 핸들러 (html2canvas + jsPDF)
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;

    try {
      setIsGeneratingPdf(true);

      // 렌더링 품질을 위해 일시적으로 확대 배율을 100%로 초기화한 후 캡처
      const element = documentRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, // 2x 고해상도
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // A4 비율 계산 (여백 포함)
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // 이미지가 1페이지를 초과하지 않도록 높이 조절
      if (imgHeight > pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 5, imgWidth, imgHeight);
      }

      const fileName = isOrder 
        ? `[승인발주서]_${order?.orderNumber || 'ORDER'}.pdf`
        : `[전자세금계산서]_${invoice?.invoiceNumber || 'INVOICE'}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 브라우저 인쇄(PDF로 저장)를 이용해주세요.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. 인쇄 핸들러 (Print)
  const handlePrint = () => {
    if (!documentRef.current) return;

    // iframe 환경을 고려하여 인쇄 전용 스타일 적용 후 window.print() 호출
    // 또는 인쇄 전용 숨김 iframe 생성 방식
    try {
      const printContents = documentRef.current.innerHTML;
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${docTitle}</title>
              <meta charset="utf-8" />
              <style>
                @page { size: A4 portrait; margin: 10mm; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", "Apple SD Gothic Neo", sans-serif;
                  margin: 0;
                  padding: 0;
                  background: #fff;
                  color: #000;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                * { box-sizing: border-box; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #333; padding: 4px 6px; font-size: 11px; }
              </style>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
            </head>
            <body>
              <div style="padding: 10px;">
                ${printContents}
              </div>
              <script>
                window.onload = function() {
                  window.focus();
                  window.print();
                  setTimeout(function() {
                    window.frameElement.parentNode.removeChild(window.frameElement);
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `);
        doc.close();
      } else {
        window.print();
      }
    } catch (e) {
      console.warn('Iframe print failed, falling back to direct window.print()', e);
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[96vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* 상단 컨트롤 툴바 */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white ${isOrder ? 'bg-blue-600' : 'bg-purple-600'}`}>
              {isOrder ? <FileText className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  {isOrder ? '국토교통부 표준 전자 발주서 (Approved PO)' : '국세청 표준 전자세금계산서 (Tax Invoice)'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  인증 완료
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono">{isOrder ? order?.orderNumber : invoice?.invoiceNumber}</span>
                <button
                  onClick={handleCopyNumber}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  title="번호 복사"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{copied ? '복사됨' : '복사'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 세금계산서 보관용 구분 토글 (공급받는자용 청색 vs 공급자용 적색) */}
          {isInvoice && (
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setInvoiceType('RECEIVER')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  invoiceType === 'RECEIVER'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                공급받는자 보관용 (청색)
              </button>
              <button
                onClick={() => setInvoiceType('SUPPLIER')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  invoiceType === 'SUPPLIER'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                공급자 보관용 (적색)
              </button>
            </div>
          )}

          {/* 확대/축소 및 인쇄/다운로드 액션 버튼들 */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-800 rounded-xl px-2 py-1 border border-slate-700 text-xs text-slate-300 gap-1">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="축소"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-mono font-semibold">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="확대"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* 인쇄하기 버튼 */}
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="브라우저 인쇄 다이얼로그 호출"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>인쇄하기</span>
            </button>

            {/* PDF 다운로드 버튼 */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>PDF 생성 중...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>PDF 다운로드</span>
                </>
              )}
            </button>

            {/* 닫기 */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 문서 미리보기 영역 (A4 사이즈 백색 캔버스) */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-950/60 flex justify-center">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150"
          >
            {/* ------------------------------------------------------------- */}
            {/* DOCUMENT 1: 표준 전자 발주서 (APPROVED PURCHASE ORDER)           */}
            {/* ------------------------------------------------------------- */}
            {isOrder && order && (
              <div
                id="printable-document"
                ref={documentRef}
                className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-10 shadow-2xl rounded-sm border border-slate-300 relative flex flex-col justify-between font-sans selection:bg-blue-100"
              >
                {/* 배경 위조방지 워터마크 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                  <div className="text-8xl font-black rotate-[-25deg] text-slate-900">
                    KOREA CONST CPMS
                  </div>
                </div>

                <div>
                  {/* 발주서 메인 헤더 */}
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-blue-600 tracking-wider uppercase mb-1 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>건설 산업 조달 관리 시스템 (CPMS) 공인 문서</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          전 자 발 주 서
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">PURCHASE ORDER (전자서명 승인 문서)</p>
                      </div>

                      {/* 발주 승인 인증 스탬프 & 바코드 */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-mono">발주번호 (PO No.)</div>
                          <div className="font-mono font-black text-blue-700 text-sm">{order.orderNumber}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">발주일: {order.createdAt}</div>
                        </div>

                        {/* 전자 승인 직인 뱃지 */}
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-600 bg-emerald-50/70 flex flex-col items-center justify-center text-emerald-800 rotate-[-5deg] shadow-xs">
                          <span className="text-[9px] font-bold tracking-tighter">조달승인</span>
                          <span className="text-[12px] font-black leading-none">APPROVED</span>
                          <span className="text-[8px] font-mono">한국건설</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 발주자 (수급인) vs 수주공급처 (협력업체) 정보 2단 테이블 */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                    {/* 발주처 (구매자) */}
                    <div className="border border-slate-300 rounded-lg overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 border-b border-slate-300 flex items-center justify-between">
                        <span>[발주처] 구매자 정보</span>
                        <span className="text-[10px] font-mono text-slate-500">원도급사</span>
                      </div>
                      <table className="w-full text-left">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="w-24 bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">상 호</td>
                            <td className="p-2 font-bold text-slate-900">(주)한국건설엔지니어링</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">사업자등록번호</td>
                            <td className="p-2 font-mono font-medium">120-81-45678</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">현장명</td>
                            <td className="p-2 font-bold text-blue-900">{order.siteName}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">배송/반입지</td>
                            <td className="p-2 text-slate-700">{order.deliveryAddress}</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">현장 대리인</td>
                            <td className="p-2 text-slate-800">홍길동 현장소장 (02-555-8901)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 수주처 (공급업체) */}
                    <div className="border border-slate-300 rounded-lg overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 border-b border-slate-300 flex items-center justify-between">
                        <span>[공급처] 수주 협력사 정보</span>
                        <span className="text-[10px] font-mono text-slate-500">협력업체</span>
                      </div>
                      <table className="w-full text-left">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="w-24 bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">상 호</td>
                            <td className="p-2 font-bold text-slate-900">{order.supplierName}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">사업자등록번호</td>
                            <td className="p-2 font-mono font-medium">214-82-90123</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">업태 / 종목</td>
                            <td className="p-2 text-slate-700">제조업 / 건축토목자재 공급</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">사업장 주소</td>
                            <td className="p-2 text-slate-700">서울특별시 영등포구 국제금융로 10</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-50 p-2 font-semibold text-slate-600 border-r border-slate-200">영업 담당자</td>
                            <td className="p-2 text-slate-800">김철수 팀장 (010-8877-1234)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 총 발주금액 배너 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-900 block mb-0.5">총 발주 계약 합계금액 (VAT 포함)</span>
                      <span className="text-sm font-bold text-blue-800 font-sans">
                        {numberToKoreanCurrency(Math.round(order.totalAmount * 1.1))}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-blue-600 font-medium">합계 (원): </span>
                      <span className="text-xl font-black text-blue-900 font-mono">
                        ₩ {Math.round(order.totalAmount * 1.1).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 발주 품목 상세 명세표 */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span>[발주 품목 명세 (Item Specifications)]</span>
                      <span className="text-[10px] text-slate-500 font-normal">통화단위: KRW (원화)</span>
                    </h3>
                    <div className="border border-slate-300 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                          <tr>
                            <th className="p-2.5 text-center w-10">No.</th>
                            <th className="p-2.5 w-24">품목 ID</th>
                            <th className="p-2.5">품목명 (Material Name)</th>
                            <th className="p-2.5">규격 및 사양 (Specification)</th>
                            <th className="p-2.5 text-center w-16">수량</th>
                            <th className="p-2.5 text-center w-12">단위</th>
                            <th className="p-2.5 text-right w-24">단가(원)</th>
                            <th className="p-2.5 text-right w-28">공급가액(원)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 text-center font-mono text-slate-500">1</td>
                            <td className="p-2.5 font-mono font-bold text-blue-600">{order.materialId || 'MAT-STD-01'}</td>
                            <td className="p-2.5 font-bold text-slate-900">{order.materialName}</td>
                            <td className="p-2.5 text-slate-700">{order.specification}</td>
                            <td className="p-2.5 text-center font-bold text-slate-800">{order.quantity.toLocaleString()}</td>
                            <td className="p-2.5 text-center text-slate-600">{order.unit}</td>
                            <td className="p-2.5 text-right font-mono">{order.unitPrice.toLocaleString()}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">{order.totalAmount.toLocaleString()}</td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300 text-xs">
                          <tr>
                            <td colSpan={6} className="p-2.5 text-right text-slate-600">소계 (공급가액):</td>
                            <td colSpan={2} className="p-2.5 text-right font-mono">{order.totalAmount.toLocaleString()} 원</td>
                          </tr>
                          <tr>
                            <td colSpan={6} className="p-2.5 text-right text-slate-600">부가가치세 (VAT 10%):</td>
                            <td colSpan={2} className="p-2.5 text-right font-mono">{Math.round(order.totalAmount * 0.1).toLocaleString()} 원</td>
                          </tr>
                          <tr className="bg-blue-100/50 text-blue-950 font-black">
                            <td colSpan={6} className="p-2.5 text-right">총 발주 합계금액:</td>
                            <td colSpan={2} className="p-2.5 text-right font-mono text-sm text-blue-900">
                              {Math.round(order.totalAmount * 1.1).toLocaleString()} 원
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* 납품 및 계약 준수 조건 */}
                  <div className="border border-slate-200 rounded-lg p-3.5 mb-6 text-[11px] text-slate-600 space-y-1 bg-slate-50/50">
                    <div className="font-bold text-slate-800 mb-1">[발주 및 납품 준수조건 (Terms & Conditions)]</div>
                    <div>1. <b>납품 기한:</b> <u>{order.requestedDeliveryDate}</u>까지 지정 현장 게이트에 반입을 완료해야 합니다.</div>
                    <div>2. <b>품질 기준:</b> 한국산업표준(KS) 승인 규격품이어야 하며, 자재 반입 시 공인 시험성적서 및 밀시트(Mill Sheet)를 필히 제출해야 합니다.</div>
                    <div>3. <b>검수 조건:</b> 현장 하역 전 책임감리원 및 현장대리인의 규격 실측과 수량 계량을 통과하여야 정식 입고 인수증이 발급됩니다.</div>
                    <div>4. <b>대금 결제:</b> 납품 검수 완료 후 국세청 전자세금계산서 청구 시 본사 대금 결제 규정에 의거 법인 계좌로 지급합니다.</div>
                    {order.notes && (
                      <div className="text-blue-700 font-medium">5. <b>현장 특이사항:</b> {order.notes}</div>
                    )}
                  </div>
                </div>

                {/* 하단 서명 및 전자직인 날인 영역 */}
                <div className="pt-4 border-t-2 border-slate-900">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">문서 식별 번호: SHA256-CPMS-{order.orderNumber}-CERT</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        본 문서는 국토교통부 전자조달 및 계약 기준에 의거 전자 서명 검증을 필한 정식 법적 효력 문서입니다.
                      </div>
                    </div>

                    {/* 발주자 직인 */}
                    <div className="flex items-center gap-4 relative">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-medium">{order.createdAt.slice(0, 10)}</div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                          (주)한국건설엔지니어링 대표이사 이대한
                        </div>
                      </div>

                      {/* 붉은색 전자 인감 도장 그래픽 */}
                      <div className="w-16 h-16 rounded-full border-2 border-red-600 text-red-600 flex flex-col items-center justify-center font-bold rotate-[-8deg] relative">
                        <span className="text-[8px] leading-tight font-black">한국건설</span>
                        <span className="text-[11px] leading-tight font-black tracking-widest">대표이사</span>
                        <span className="text-[9px] leading-tight font-black">의인(印)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* DOCUMENT 2: 국세청 표준 전자세금계산서 (TAX INVOICE)           */}
            {/* ------------------------------------------------------------- */}
            {isInvoice && invoice && (
              <div
                id="printable-document"
                ref={documentRef}
                className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 shadow-2xl rounded-sm border-2 ${
                  invoiceType === 'RECEIVER' ? 'border-blue-700' : 'border-red-700'
                } relative flex flex-col justify-between font-sans selection:bg-purple-100`}
              >
                {/* 상단 국세청 헤더 & 타이틀 */}
                <div>
                  <div className="flex items-center justify-between border-b-2 pb-3 mb-4 border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-1 rounded text-white text-xs font-black ${
                        invoiceType === 'RECEIVER' ? 'bg-blue-700' : 'bg-red-700'
                      }`}>
                        국세청 NTS 연동
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        승인번호: 20260315-41000088-99201482-01
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                        invoiceType === 'RECEIVER' 
                          ? 'bg-blue-50 text-blue-700 border-blue-300' 
                          : 'bg-red-50 text-red-700 border-red-300'
                      }`}>
                        {invoiceType === 'RECEIVER' ? '공급받는자 보관용 (청색)' : '공급자 보관용 (적색)'}
                      </span>
                    </div>
                  </div>

                  {/* 세금계산서 메인 타이틀 */}
                  <div className="text-center my-3">
                    <h1 className={`text-3xl font-black tracking-widest inline-block px-6 py-1 border-b-2 ${
                      invoiceType === 'RECEIVER' ? 'text-blue-800 border-blue-800' : 'text-red-800 border-red-800'
                    }`}>
                      전 자 세 금 계 산 서
                    </h1>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">
                      (부가가치세법 시행규칙 별지 제11호 서식)
                    </div>
                  </div>

                  {/* 공급자 (빨강) vs 공급받는자 (파랑) 국세청 표준 테이블 */}
                  <div className="grid grid-cols-2 gap-1 border-2 border-slate-700 text-xs mb-4">
                    {/* 공급자 영역 */}
                    <div className="border-r border-slate-700 p-2 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          공 급 자
                        </span>
                        <span className="text-[10px] text-slate-400">발행자</span>
                      </div>
                      <table className="w-full text-left text-xs border border-slate-300">
                        <tbody>
                          <tr className="border-b border-slate-300">
                            <td className="w-20 bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">등록번호</td>
                            <td colSpan={3} className="p-1.5 font-mono font-bold text-slate-900">214-82-90123</td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">상 호</td>
                            <td className="p-1.5 font-bold">{invoice.supplierName}</td>
                            <td className="w-14 bg-slate-100 p-1.5 font-bold text-slate-700 border-x border-slate-300">성 명</td>
                            <td className="p-1.5 relative">
                              <span>김철수</span>
                              {/* 사각 공급자 직인 */}
                              <span className="inline-block ml-2 text-red-600 border border-red-600 text-[9px] px-1 font-bold">
                                (인)
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">사업장주소</td>
                            <td colSpan={3} className="p-1.5 text-[11px]">서울특별시 영등포구 국제금융로 10</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">업태 / 종목</td>
                            <td className="p-1.5 text-[11px]">제조업</td>
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-x border-slate-300">종목</td>
                            <td className="p-1.5 text-[11px]">건축자재</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 공급받는자 영역 */}
                    <div className="p-2 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          공급받는자
                        </span>
                        <span className="text-[10px] text-slate-400">청구대상</span>
                      </div>
                      <table className="w-full text-left text-xs border border-slate-300">
                        <tbody>
                          <tr className="border-b border-slate-300">
                            <td className="w-20 bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">등록번호</td>
                            <td colSpan={3} className="p-1.5 font-mono font-bold text-slate-900">120-81-45678</td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">상 호</td>
                            <td className="p-1.5 font-bold">(주)한국건설엔지니어링</td>
                            <td className="w-14 bg-slate-100 p-1.5 font-bold text-slate-700 border-x border-slate-300">성 명</td>
                            <td className="p-1.5">이대한 (인)</td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">사업장주소</td>
                            <td colSpan={3} className="p-1.5 text-[11px]">서울특별시 서초구 강남대로 300 (현장: {invoice.siteName})</td>
                          </tr>
                          <tr>
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-r border-slate-300">업태 / 종목</td>
                            <td className="p-1.5 text-[11px]">건설업</td>
                            <td className="bg-slate-100 p-1.5 font-bold text-slate-700 border-x border-slate-300">종목</td>
                            <td className="p-1.5 text-[11px]">종합건설</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 금액 종합 테이블 (작성일자, 공급가액, 세액) */}
                  <div className="border border-slate-400 mb-4 overflow-hidden">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                        <tr>
                          <th className="p-2 border-r border-slate-300 w-32">작성일자</th>
                          <th className="p-2 border-r border-slate-300">공급가액 (원)</th>
                          <th className="p-2 border-r border-slate-300">세액 (VAT 10%)</th>
                          <th className="p-2 w-36">비고 (발주번호)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="font-mono text-sm">
                          <td className="p-2.5 font-bold text-slate-800 border-r border-slate-300">
                            {invoice.issueDate}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300">
                            ₩ {invoice.supplyAmount.toLocaleString()}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300">
                            ₩ {invoice.taxAmount.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-xs text-blue-700 font-bold">
                            {invoice.orderNumber}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 품목 명세 테이블 */}
                  <div className="border border-slate-400 mb-4 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400 text-center">
                        <tr>
                          <th className="p-2 border-r border-slate-300 w-16">월 / 일</th>
                          <th className="p-2 border-r border-slate-300">품목 / 규격</th>
                          <th className="p-2 border-r border-slate-300 w-16">수량</th>
                          <th className="p-2 border-r border-slate-300 w-24">단가</th>
                          <th className="p-2 border-r border-slate-300 w-28">공급가액</th>
                          <th className="p-2 border-r border-slate-300 w-24">세액</th>
                          <th className="p-2 w-20">비고</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        <tr>
                          <td className="p-2 text-center font-mono">{invoice.issueDate.slice(5)}</td>
                          <td className="p-2">
                            <div className="font-bold text-slate-900">
                              {relatedOrder?.materialName || '건설 자재 납품'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {relatedOrder?.specification || '표준 KS 규격품'}
                            </div>
                          </td>
                          <td className="p-2 text-center font-mono">
                            {relatedOrder ? `${relatedOrder.quantity.toLocaleString()}` : '1'}
                          </td>
                          <td className="p-2 text-right font-mono">
                            {relatedOrder ? relatedOrder.unitPrice.toLocaleString() : invoice.supplyAmount.toLocaleString()}
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {invoice.supplyAmount.toLocaleString()}
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {invoice.taxAmount.toLocaleString()}
                          </td>
                          <td className="p-2 text-center text-slate-500 text-[11px]">검수완료</td>
                        </tr>
                        {/* 여백 행 */}
                        <tr>
                          <td className="p-2 text-center">&nbsp;</td>
                          <td className="p-2">&nbsp;</td>
                          <td className="p-2">&nbsp;</td>
                          <td className="p-2">&nbsp;</td>
                          <td className="p-2">&nbsp;</td>
                          <td className="p-2">&nbsp;</td>
                          <td className="p-2">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 합계금액 및 영수/청구 구분 */}
                  <div className="border border-slate-400 p-3 bg-slate-50 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-semibold block">총 합계금액 (Total Amount)</span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        ₩ {invoice.totalAmount.toLocaleString()} 원
                      </span>
                      <span className="text-xs text-slate-600 ml-2">
                        ({numberToKoreanCurrency(invoice.totalAmount)})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">이 금액을</span>
                        <span className="text-sm font-black text-slate-900">
                          {invoice.paymentStatus === 'PAID' ? '영수(領收)함' : '청구(請求)함'}
                        </span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg border font-black text-xs ${
                        invoice.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-purple-100 text-purple-800 border-purple-300'
                      }`}>
                        {invoice.paymentStatus === 'PAID' ? '입금완료' : '지급요청'}
                      </div>
                    </div>
                  </div>

                  {/* 입금 계좌 및 지급 기한 */}
                  <div className="border border-slate-300 rounded p-3 text-xs bg-white space-y-1">
                    <div className="font-bold text-slate-800 mb-1">[대금 지급 계좌 정보]</div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">지정 입금계좌:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {invoice.bankName} {invoice.accountNumber} (예금주: {invoice.accountHolder})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">결제 약정 지급기한:</span>
                      <span className="font-mono font-bold text-red-600">{invoice.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* 하단 국세청 홈택스 전송 인증 바코드 & 타임스탬프 */}
                <div className="pt-4 border-t border-slate-400">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>국세청 홈택스(Hometax) 전자세금계산서 시스템 정상 전송 완료</span>
                    </div>
                    <div className="font-mono">
                      발행일시: {invoice.issueDate} 09:30:00 KST
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 모달 하단 안내 푸터 */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>
              {isOrder 
                ? '승인된 발주서는 정식 법적 효력을 갖는 전자서명 문서이며 A4 표준 규격으로 PDF 저장 및 인쇄가 가능합니다.'
                : '국세청 표준 규격 전자세금계산서 양식으로 공급받는자/공급자 보관용 토글 후 PDF 및 인쇄가 지원됩니다.'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            닫기 (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
