import React, { useState } from 'react';
import { OrderItem, QuotationItem, DeliveryItem, InvoiceItem, PaymentItem } from '../types';
import { 
  Truck, 
  Calculator, 
  Receipt, 
  CreditCard, 
  HelpCircle, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Building2,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';

interface SupplierViewProps {
  orders: OrderItem[];
  quotations: QuotationItem[];
  deliveries: DeliveryItem[];
  invoices: InvoiceItem[];
  payments: PaymentItem[];
  onOpenQuotationModal: (order: OrderItem) => void;
  onOpenDeliveryModal: (order: OrderItem) => void;
  onOpenInvoiceModal: (order: OrderItem) => void;
  onOpenManual: (manualId: string) => void;
  onViewOrderPdf?: (order: OrderItem) => void;
  onViewInvoicePdf?: (invoice: InvoiceItem) => void;
}

export const SupplierView: React.FC<SupplierViewProps> = ({
  orders,
  quotations,
  deliveries,
  invoices,
  payments,
  onOpenQuotationModal,
  onOpenDeliveryModal,
  onOpenInvoiceModal,
  onOpenManual,
  onViewOrderPdf,
  onViewInvoicePdf
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'quotations' | 'deliveries' | 'invoices' | 'payments'>('dashboard');

  // Orders that are pending or quoted
  const ordersNeedingQuotation = orders.filter((o) => o.status === 'PENDING' || o.status === 'QUOTED');
  // Orders that are approved and ready for dispatch/delivery
  const approvedOrdersForDispatch = orders.filter((o) => o.status === 'APPROVED');
  // Orders delivered/inspected that need invoices
  const deliveredOrdersNeedingInvoice = orders.filter((o) => o.status === 'DELIVERED');

  const totalSalesAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalReceivedAmount = invoices
    .filter((inv) => inv.paymentStatus === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const outstandingAmount = totalSalesAmount - totalReceivedAmount;

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3.5 py-2 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'dashboard'
                ? 'bg-apple-blue text-ice'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>공급사 대시보드</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quotations')}
            className={`px-3.5 py-2 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'quotations'
                ? 'bg-apple-blue text-ice'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>견적 관리 ({quotations.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('deliveries')}
            className={`px-3.5 py-2 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'deliveries'
                ? 'bg-apple-blue text-ice'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>출하 및 배차 ({deliveries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`px-3.5 py-2 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'invoices'
                ? 'bg-apple-blue text-ice'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>송장 청구 ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('payments')}
            className={`px-3.5 py-2 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'payments'
                ? 'bg-apple-blue text-ice'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>수금/정산 현황</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenManual('man-06')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>공급업체 업무 매뉴얼(MAN-06~09)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">총 납품 청구액 (송장)</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {totalSalesAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">원</span>
                </span>
                <span className="text-[11px] text-emerald-600 block mt-1">부가가치세 10% 포함</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">수금 완료 정산액</span>
                <span className="text-xl font-black text-emerald-600 font-mono">
                  {totalReceivedAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">원</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">법인 계좌 입금 확인</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">미수금 (결제 대기)</span>
                <span className="text-xl font-black text-amber-600 font-mono">
                  {outstandingAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">원</span>
                </span>
                <span className="text-[11px] text-amber-600 block mt-1">지급 기한 내 입금 예정</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">배차 필요 발주 승인건</span>
                <span className="text-xl font-black text-cyan-600 font-mono">
                  {approvedOrdersForDispatch.length} <span className="text-xs font-normal text-slate-500">건</span>
                </span>
                <span className="text-[11px] text-cyan-600 block mt-1">차량 배차 및 출하 대기</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Action Callout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Orders needing quotation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  견적서 제출 가능 발주 건 ({ordersNeedingQuotation.length})
                </h3>
                <button
                  onClick={() => onOpenManual('man-06')}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>견적 매뉴얼</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {ordersNeedingQuotation.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-mono font-bold text-blue-600">{order.orderNumber}</span>
                        <span>•</span>
                        <span>{order.siteName}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        {order.materialName} ({order.quantity} {order.unit})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        납기희망: {order.requestedDeliveryDate} | 예산단가: {order.unitPrice.toLocaleString()}원
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenQuotationModal(order)}
                      className="px-3 py-1.5 btn-primary btn-sm rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>견적 작성</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Approved orders ready for delivery dispatch */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-600" />
                  출하 및 배차 등록 필요 건 ({approvedOrdersForDispatch.length})
                </h3>
                <button
                  onClick={() => onOpenManual('man-07')}
                  className="text-xs text-cyan-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>배송 매뉴얼</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {approvedOrdersForDispatch.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-cyan-50/50 rounded-xl border border-cyan-200/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-mono font-bold text-blue-600">{order.orderNumber}</span>
                        <span>•</span>
                        <span>{order.siteName}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        {order.materialName} ({order.quantity} {order.unit})
                      </div>
                      <div className="text-[11px] text-cyan-800 font-medium">
                        발주 승인 완료 • 즉시 배차 등록 가능
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onViewOrderPdf?.(order)}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                        title="승인된 전자 발주서 PDF 다운로드 및 인쇄"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>발주서 PDF</span>
                      </button>
                      <button
                        onClick={() => onOpenDeliveryModal(order)}
                        className="px-3 py-1.5 btn-primary btn-sm rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>출하 등록</span>
                      </button>
                    </div>
                  </div>
                ))}

                {approvedOrdersForDispatch.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    현재 즉시 출하 대기 중인 발주 승인 건이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUOTATIONS */}
      {activeSubTab === 'quotations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-subheading font-semibold text-carbon">제출된 자재 단가 견적서(Quotation) 목록</h3>
              <p className="text-body-sm text-ash">현장 발주 건에 대해 제안한 단가, 납기 소요 일수 및 승인 채택 상태</p>
            </div>
            <button
              onClick={() => onOpenManual('man-06')}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>견적서 작성 매뉴얼(MAN-06)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">견적번호</th>
                    <th className="py-3 px-4">연계 발주</th>
                    <th className="py-3 px-4">품목 및 사양</th>
                    <th className="py-3 px-4">제안 단가</th>
                    <th className="py-3 px-4">제안 총 공급액</th>
                    <th className="py-3 px-4">납기 소요</th>
                    <th className="py-3 px-4">유효기한</th>
                    <th className="py-3 px-4">채택 상태</th>
                    <th className="py-3 px-4">제출일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        {q.quotationNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {q.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{q.materialName}</div>
                        <div className="text-[11px] text-slate-400">{q.specification}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {q.proposedUnitPrice.toLocaleString()}원/{q.unit}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {q.totalAmount.toLocaleString()}원
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {q.leadTimeDays}일 이내
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {q.validUntil}
                      </td>
                      <td className="py-3 px-4">
                        {q.status === 'ACCEPTED' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            채택 승인됨
                          </span>
                        ) : q.status === 'REJECTED' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            미채택
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            심사중
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {q.submittedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERIES */}
      {activeSubTab === 'deliveries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-subheading font-semibold text-carbon">자재 출하 및 실시간 배송(Delivery) 현황</h3>
              <p className="text-body-sm text-ash">운송 화물차량 번호, 기사 연락처, 예상 도착 시간 및 현장 검수 진행 상태</p>
            </div>
            <button
              onClick={() => onOpenManual('man-07')}
              className="text-xs text-cyan-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>출하 배차 매뉴얼(MAN-07)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries.map((del) => (
              <div
                key={del.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {del.deliveryNumber}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      del.trackingStatus === 'INSPECTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {del.trackingStatus === 'INSPECTED' ? '현장 검수 완료' : '출하 운송중'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">{del.materialName}</h4>
                  <div className="text-xs text-slate-500 mb-2">
                    수량: <b className="text-cyan-700">{del.quantity} {del.unit}</b>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                    <div>배차차량: <b className="text-slate-800">{del.vehicleNumber}</b></div>
                    <div>운송기사: <b className="text-slate-800">{del.driverName}</b> ({del.driverContact})</div>
                    <div>출하일시: <b className="text-slate-800">{del.dispatchedAt}</b></div>
                    <div>도착예정: <b className="text-slate-800">{del.expectedArrival}</b></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {del.trackingStatus === 'INSPECTED' ? (
                    <div className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>현장 인수 서명 완료됨</span>
                    </div>
                  ) : (
                    <div className="text-cyan-700 text-xs font-medium flex items-center gap-1">
                      <Truck className="w-4 h-4 animate-bounce" />
                      <span>현장으로 운송 이동중입니다</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-subheading font-semibold text-carbon">전자세금계산서/송장(Invoice) 발행 및 청구 내역</h3>
              <p className="text-body-sm text-ash">검수 완료 자재에 대한 공급가액/부가세 계산서 발행 및 현장 청구</p>
            </div>
            <button
              onClick={() => onOpenManual('man-08')}
              className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>송장 발행 매뉴얼(MAN-08)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Orders eligible for new invoice */}
          {deliveredOrdersNeedingInvoice.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                현장 검수 완료되어 즉시 송장 발행 가능한 발주건이 있습니다:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {deliveredOrdersNeedingInvoice.map((o) => (
                  <div key={o.id} className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-700">{o.orderNumber}</span>
                      <div className="text-xs font-bold text-slate-900">{o.materialName}</div>
                      <div className="text-[11px] text-slate-500">{o.siteName} ({o.totalAmount.toLocaleString()}원)</div>
                    </div>
                    <button
                      onClick={() => onOpenInvoiceModal(o)}
                      className="px-3 py-1.5 btn-primary btn-sm rounded-full text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>송장 발행</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {inv.invoiceNumber}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      inv.paymentStatus === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.paymentStatus === 'PAID' ? '수금 완료 (PAID)' : '입금 대기중'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-2">
                    청구 대상 현장: <b className="text-slate-800">{inv.siteName}</b> (발주번호: {inv.orderNumber})
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">공급가액:</span>
                      <span className="font-bold text-slate-800">{inv.supplyAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">부가세 (10%):</span>
                      <span className="font-bold text-slate-800">{inv.taxAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-purple-900 font-black text-sm">
                      <span>총 청구액:</span>
                      <span>{inv.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                    <div>입금 계좌: <b className="text-slate-700">{inv.bankName} {inv.accountNumber}</b> ({inv.accountHolder})</div>
                    <div>지급기한: <b className="text-slate-700">{inv.dueDate}</b> (발행일: {inv.issueDate})</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => onViewInvoicePdf?.(inv)}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    title="국세청 전자세금계산서 PDF 다운로드 및 인쇄"
                  >
                    <Receipt className="w-3.5 h-3.5 text-purple-600" />
                    <span>전자세금계산서 PDF / 인쇄</span>
                  </button>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">국세청 표준 양식</span>
                    {inv.paymentStatus === 'PAID' ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        입금 확인 완료
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        현장 결제 승인 대기
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENTS */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-subheading font-semibold text-carbon">수금 및 자재 대금 결제 확인 대장</h3>
              <p className="text-body-sm text-ash">현장에서 지급 완료된 법인 계좌이체 및 정산 마감 내역</p>
            </div>
            <button
              onClick={() => onOpenManual('man-09')}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>수금 정산 매뉴얼(MAN-09)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">결제 승인번호</th>
                    <th className="py-3 px-4">연계 송장</th>
                    <th className="py-3 px-4">연계 발주</th>
                    <th className="py-3 px-4">입금 완료액</th>
                    <th className="py-3 px-4">결제 방식</th>
                    <th className="py-3 px-4">송금 집행처</th>
                    <th className="py-3 px-4">처리 상태</th>
                    <th className="py-3 px-4">지급 완료일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                        {p.paymentNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {p.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {p.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">
                        {p.amount.toLocaleString()}원
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {p.paymentMethod === 'BANK_TRANSFER' ? '법인 계좌이체' : '전자어음'}
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {p.payerName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          정산 완료 (COMPLETED)
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {p.paymentDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
