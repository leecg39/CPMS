import React, { useState } from 'react';
import { OrderItem, QuotationItem, DeliveryItem, InvoiceItem, PaymentItem } from '../types';
import { ProcurementEfficiencyDashboard } from './ProcurementEfficiencyDashboard';
import { 
  Building2, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  ClipboardCheck, 
  Receipt, 
  CreditCard, 
  HelpCircle,
  ArrowUpRight,
  Filter,
  Check,
  XCircle,
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface SiteManagerViewProps {
  orders: OrderItem[];
  quotations: QuotationItem[];
  deliveries: DeliveryItem[];
  invoices: InvoiceItem[];
  payments: PaymentItem[];
  onOpenNewOrderModal: () => void;
  onOpenInspectionModal: (delivery: DeliveryItem) => void;
  onApproveQuotation: (quotationId: string, orderId: string) => void;
  onApprovePayment: (invoiceId: string) => void;
  onOpenManual: (manualId: string) => void;
  onViewOrderPdf?: (order: OrderItem) => void;
  onViewInvoicePdf?: (invoice: InvoiceItem) => void;
}

export const SiteManagerView: React.FC<SiteManagerViewProps> = ({
  orders,
  quotations,
  deliveries,
  invoices,
  payments,
  onOpenNewOrderModal,
  onOpenInspectionModal,
  onApproveQuotation,
  onApprovePayment,
  onOpenManual,
  onViewOrderPdf,
  onViewInvoicePdf
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'analytics' | 'orders' | 'deliveries' | 'payments'>('dashboard');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('ALL');

  const sites = [
    'ALL',
    '강남 르네상스타워 신축공사',
    '송도 바이오 콤플렉스 3공구',
    '판교 하이퍼 데이터센터 신축',
    '마곡 융합 R&D 센터 2차',
    '여의도 국제금융타워 증축현장'
  ];

  const filteredOrders = orders.filter(
    (o) => selectedSiteFilter === 'ALL' || o.siteName === selectedSiteFilter
  );

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const inDeliveryCount = orders.filter((o) => o.status === 'IN_DELIVERY').length;
  const needInspectionCount = deliveries.filter((d) => d.trackingStatus === 'SHIPPED' || d.inspectionResult === 'PENDING').length;
  const unpaidInvoicesCount = invoices.filter((i) => i.paymentStatus === 'UNPAID' || i.paymentStatus === 'PAYMENT_REQUESTED').length;

  const totalOrderAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">승인 대기</span>;
      case 'QUOTED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">견적 접수</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">발주 승인</span>;
      case 'IN_DELIVERY':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">출하/배송중</span>;
      case 'DELIVERED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">검수 완료</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">정산 종결</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">반려</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'EMERGENCY') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-500 text-white animate-pulse">초긴급</span>;
    }
    if (priority === 'URGENT') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white">긴급</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600">일반</span>;
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation & Site Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>현장 대시보드</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>조달 효율성 분석 차트</span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>발주 관리 ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('deliveries')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'deliveries'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>입고 및 품질 검수 ({deliveries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('payments')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'payments'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>대금 결제 승인 ({invoices.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedSiteFilter}
              onChange={(e) => setSelectedSiteFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              {sites.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? '전체 현장 보기' : s}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenNewOrderModal}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>신규 발주 신청</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">총 발주 계약 누계</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {totalOrderAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">원</span>
                </span>
                <span className="text-[11px] text-blue-600 block mt-1">총 {orders.length}개 공종 자재</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">승인/견적 대기 건수</span>
                <span className="text-xl font-black text-amber-600 font-mono">
                  {pendingOrdersCount} <span className="text-xs font-normal text-slate-500">건</span>
                </span>
                <span className="text-[11px] text-amber-700 block mt-1">긴급 발주건 우선 심사 요망</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">운송 중 / 검수 대기</span>
                <span className="text-xl font-black text-cyan-600 font-mono">
                  {inDeliveryCount + needInspectionCount} <span className="text-xs font-normal text-slate-500">건</span>
                </span>
                <span className="text-[11px] text-cyan-700 block mt-1">현장 반입 계량 및 인수 대기</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">미결제 청구 송장</span>
                <span className="text-xl font-black text-purple-600 font-mono">
                  {unpaidInvoicesCount} <span className="text-xs font-normal text-slate-500">건</span>
                </span>
                <span className="text-[11px] text-purple-700 block mt-1">지급 기한 검토 필요</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Efficiency Analytics Quick Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 rounded-2xl shadow-xs border border-blue-900/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    조달 효율성 빅데이터 분석
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    종합 효율성 95.2점 (S등급)
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  현장별 발주·납품·결제 3대 축 조달 효율성 및 공급망 성과 분석
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  5개 건설 현장과 5개 주요 협력 공급사 간 적기 납품률(96.5%), 품질 합격률(100%), 자금 결제 집행률 비교 차트를 제공합니다.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab('analytics')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>조달 효율성 차트 분석 대시보드 열기</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice Callout for Site Manager Manuals */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950">
                  현장 관리자 전용 표준 운영 매뉴얼 패치 안내
                </h4>
                <p className="text-xs text-blue-800/80">
                  발주 등록 기준(MAN-02), 견적 채택 및 승인(MAN-03), 현장 입고 검수 및 전자서명(MAN-04), 대금 결제 집행(MAN-05) 지침을 확인하세요.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onOpenManual('man-02')}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                발주 매뉴얼
              </button>
              <button
                onClick={() => onOpenManual('man-04')}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                검수 매뉴얼
              </button>
            </div>
          </div>

          {/* Recent Deliveries Requiring Inspection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  현장 도착 자재 실시간 검수 대기 리스트
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  도착 차량의 실물 수량 및 품질 성적서를 확인하고 전자 서명을 완료해 주세요.
                </p>
              </div>
              <button
                onClick={() => onOpenManual('man-04')}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>검수 SOP 안내</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {deliveries.map((del) => (
                <div
                  key={del.id}
                  className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700">{del.deliveryNumber}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-xs font-bold text-slate-900">{del.siteName}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-xs text-slate-500 font-medium">연계 발주: {del.orderNumber}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {del.materialName} - <span className="text-blue-600">{del.quantity} {del.unit}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                      <span>공급사: <b className="text-slate-700">{del.supplierName}</b></span>
                      <span>차량: <b className="text-slate-700">{del.vehicleNumber}</b></span>
                      <span>기사: <b className="text-slate-700">{del.driverName} ({del.driverContact})</b></span>
                      <span>도착예정: <b className="text-slate-700">{del.expectedArrival}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {del.inspectionResult === 'PASS' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>검수 합격 ({del.inspectorName})</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onOpenInspectionModal(del)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        <span>현장 실물 검수 및 서명</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROCUREMENT EFFICIENCY ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <ProcurementEfficiencyDashboard
          orders={orders}
          quotations={quotations}
          deliveries={deliveries}
          invoices={invoices}
          payments={payments}
          onOpenManual={onOpenManual}
        />
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Validation Pipeline Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white shadow-xs border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-blue-300">
                    발주신청서 양식 자동 체크 및 정밀 검증
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    4단계 순서 검증
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  누락·모호한 표현·단위 오류 자동 체크 ➔ 스마트 수정 ➔ 사전 검수 ➔ 발주요청
                </h4>
                <p className="text-[11px] text-slate-300">
                  6대 핵심 항목(품목 ID, 수량, 단위, 희망일, 배송 위치, 규격)을 검증하여 발주 반려를 사전에 차단합니다.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenNewOrderModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>발주신청서 양식 체크 및 등록</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">전체 자재 발주(Order) 현황 목록</h3>
              <p className="text-xs text-slate-500">공종별 소요 자재 발주 내역 및 공급사 견적 채택 현황</p>
            </div>
            <button
              onClick={() => onOpenManual('man-02')}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>발주 작성 가이드 매뉴얼(MAN-02)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">발주번호 / 품목 ID</th>
                    <th className="py-3 px-4">현장명</th>
                    <th className="py-3 px-4">자재품목 및 규격</th>
                    <th className="py-3 px-4">수량/단위</th>
                    <th className="py-3 px-4">예상 총액</th>
                    <th className="py-3 px-4">우선순위</th>
                    <th className="py-3 px-4">상태</th>
                    <th className="py-3 px-4">납기희망일</th>
                    <th className="py-3 px-4 text-right">조치</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const relatedQuotations = quotations.filter((q) => q.orderId === order.id);
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-600 block">
                            {order.orderNumber}
                          </span>
                          {order.materialId && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 rounded font-mono text-[10px] font-bold">
                              {order.materialId}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div>{order.siteName}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[140px]" title={order.deliveryAddress}>
                            {order.deliveryAddress}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{order.materialName}</div>
                          <div className="text-[11px] text-slate-400">{order.specification}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {order.quantity} {order.unit}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {order.totalAmount.toLocaleString()}원
                        </td>
                        <td className="py-3 px-4">
                          {getPriorityBadge(order.priority)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {order.requestedDeliveryDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {order.status === 'QUOTED' && relatedQuotations.length > 0 && (
                              <button
                                onClick={() => onApproveQuotation(relatedQuotations[0].id, order.id)}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-xs"
                                title="공급사 제안 견적 채택 및 발주 승인"
                              >
                                견적 채택 승인
                              </button>
                            )}

                            {['APPROVED', 'IN_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(order.status) && (
                              <button
                                onClick={() => onViewOrderPdf?.(order)}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                title="승인된 전자 발주서 PDF 다운로드 및 인쇄"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                <span>승인 발주서 PDF</span>
                              </button>
                            )}

                            {order.status === 'PENDING' && (
                              <span className="text-[11px] text-amber-600 font-medium">견적 대기중</span>
                            )}

                            {order.status === 'REJECTED' && (
                              <span className="text-[11px] text-red-500 font-medium">발주 반려</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERIES & INSPECTION */}
      {activeSubTab === 'deliveries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">현장 자재 입고 및 품질 검수(Inspection) 대장</h3>
              <p className="text-xs text-slate-500">배송 도착 차량 확인, 실물 수량 계측, 시험성적서 대조 및 전자 인수증 서명</p>
            </div>
            <button
              onClick={() => onOpenManual('man-04')}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>입고 검수 규정 매뉴얼(MAN-04)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries.map((del) => (
              <div
                key={del.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                      {del.deliveryNumber}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      del.inspectionResult === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : del.inspectionResult === 'FAIL'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {del.inspectionResult === 'PASS' ? '검수 합격' : del.inspectionResult === 'FAIL' ? '불합격' : '검수 대기'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {del.materialName}
                  </h4>
                  <div className="text-xs text-slate-500 mb-3">
                    수량: <b className="text-blue-600">{del.quantity} {del.unit}</b>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div><span className="font-semibold text-slate-700">도착 현장:</span> {del.siteName}</div>
                    <div><span className="font-semibold text-slate-700">공급사:</span> {del.supplierName}</div>
                    <div><span className="font-semibold text-slate-700">차량/기사:</span> {del.vehicleNumber} ({del.driverName})</div>
                    <div><span className="font-semibold text-slate-700">연락처:</span> {del.driverContact}</div>
                    {del.inspectedAt && (
                      <div className="text-emerald-700 font-medium pt-1 border-t border-slate-200">
                        검수일시: {del.inspectedAt} ({del.inspectorName})
                      </div>
                    )}
                    {del.inspectionNotes && (
                      <div className="text-[11px] text-slate-500 italic">
                        "{del.inspectionNotes}"
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {del.inspectionResult === 'PASS' ? (
                    <div className="w-full py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center border border-emerald-200 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>서명 완료됨 ({del.recipientSignature})</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenInspectionModal(del)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>품질 검수 및 전자 인수 서명</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">공급업체 청구 송장 및 대금 지급 승인</h3>
              <p className="text-xs text-slate-500">검수 완료 자재에 대한 전자세금계산서 검토 및 법인 계좌이체/어음 결제 집행</p>
            </div>
            <button
              onClick={() => onOpenManual('man-05')}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>대금 결제 매뉴얼(MAN-05)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
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
                      {inv.paymentStatus === 'PAID' ? '지급 완료 (PAID)' : '결제 승인 대기'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-2">
                    공급사: <b className="text-slate-800">{inv.supplierName}</b> | 현장: <b className="text-slate-800">{inv.siteName}</b>
                  </div>

                  <div className="p-3 bg-purple-50/60 rounded-xl space-y-1 font-mono text-xs border border-purple-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">공급가액:</span>
                      <span className="font-bold text-slate-800">{inv.supplyAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">부가가치세 (10%):</span>
                      <span className="font-bold text-slate-800">{inv.taxAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-purple-200 text-purple-900 font-black text-sm">
                      <span>총 청구액:</span>
                      <span>{inv.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                    <div>입금은행: <b className="text-slate-700">{inv.bankName} {inv.accountNumber}</b> ({inv.accountHolder})</div>
                    <div>지급기한: <b className="text-slate-700">{inv.dueDate}</b> (발행일: {inv.issueDate})</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onViewInvoicePdf?.(inv)}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    title="국세청 표준 전자세금계산서 PDF 다운로드 및 인쇄"
                  >
                    <Receipt className="w-3.5 h-3.5 text-purple-600" />
                    <span>전자세금계산서 PDF / 인쇄</span>
                  </button>

                  {inv.paymentStatus === 'PAID' ? (
                    <div className="w-full py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>송금 및 정산 완료 종결됨</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onApprovePayment(inv.id)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>대금 결제 승인 및 송금 완료 처리</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
