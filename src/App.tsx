import React, { useState } from 'react';
import { 
  UserRole, 
  OrderItem, 
  QuotationItem, 
  DeliveryItem, 
  InvoiceItem, 
  PaymentItem,
  ManualSection,
  InspectionResult
} from './types';
import { 
  INITIAL_ORDERS, 
  INITIAL_QUOTATIONS, 
  INITIAL_DELIVERIES, 
  INITIAL_INVOICES, 
  INITIAL_PAYMENTS 
} from './data/initialData';
import { MANUAL_SECTIONS } from './data/manualData';
import { documentNumber, toLocalDateTime } from './utils/liveDates';

import { Header } from './components/Header';
import { InteractiveWorkflowBar } from './components/InteractiveWorkflowBar';
import { SiteManagerView } from './components/SiteManagerView';
import { SupplierView } from './components/SupplierView';
import { ManualView } from './components/ManualView';
import { ProcurementEfficiencyDashboard } from './components/ProcurementEfficiencyDashboard';
import { ManualModal } from './components/ManualModal';
import { NewOrderModal } from './components/NewOrderModal';
import { InspectionModal } from './components/InspectionModal';
import { 
  NewQuotationModal, 
  NewDeliveryModal, 
  NewInvoiceModal 
} from './components/SupplierActionModals';
import { DocumentPdfModal } from './components/DocumentPdfModal';

import { 
  BookOpen, 
  CheckCircle2, 
  Building2, 
  Truck, 
  HardHat, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Roles & View State
  const [currentRole, setCurrentRole] = useState<UserRole>('SITE_MANAGER');
  const [activeTab, setActiveTab] = useState<string>('site-dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Core Data States
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [quotations, setQuotations] = useState<QuotationItem[]>(INITIAL_QUOTATIONS);
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(INITIAL_DELIVERIES);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);

  // Modal States
  const [selectedManual, setSelectedManual] = useState<ManualSection | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [selectedDeliveryForInspection, setSelectedDeliveryForInspection] = useState<DeliveryItem | null>(null);
  const [selectedOrderForQuotation, setSelectedOrderForQuotation] = useState<OrderItem | null>(null);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<OrderItem | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderItem | null>(null);
  const [selectedOrderForPdf, setSelectedOrderForPdf] = useState<OrderItem | null>(null);
  const [selectedInvoiceForPdf, setSelectedInvoiceForPdf] = useState<InvoiceItem | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handler: Open Manual Modal by ID
  const handleOpenManual = (manualId?: string) => {
    if (!manualId) {
      setSelectedManual(MANUAL_SECTIONS[0]);
      return;
    }
    const found = MANUAL_SECTIONS.find((m) => m.id === manualId);
    if (found) {
      setSelectedManual(found);
    } else {
      setSelectedManual(MANUAL_SECTIONS[0]);
    }
  };

  // Handler: Create New Order (현장 관리자)
  const handleCreateOrder = (
    newOrderData: Omit<OrderItem, 'id' | 'orderNumber' | 'createdAt' | 'status'>
  ) => {
    const nextIdNumber = orders.length + 1;
    const orderNumber = documentNumber('ORD', nextIdNumber, 3);
    const newOrder: OrderItem = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'PENDING',
      createdAt: toLocalDateTime(new Date())
    };

    setOrders([newOrder, ...orders]);
    showToast(`발주서 [${orderNumber}]가 정상 등록되었습니다. 공급업체 견적 접수가 시작됩니다.`);
  };

  // Handler: Submit Quotation (공급업체)
  const handleSubmitQuotation = (
    newQuotationData: Omit<QuotationItem, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>
  ) => {
    const nextIdNumber = quotations.length + 80;
    const quotationNumber = documentNumber('QT', nextIdNumber, 0);
    const newQuotation: QuotationItem = {
      ...newQuotationData,
      id: `quot-${Date.now()}`,
      quotationNumber,
      status: 'SUBMITTED',
      submittedAt: toLocalDateTime(new Date())
    };

    setQuotations([newQuotation, ...quotations]);

    // Update order status to QUOTED
    setOrders((prev) =>
      prev.map((o) =>
        o.id === newQuotationData.orderId ? { ...o, status: 'QUOTED' } : o
      )
    );

    showToast(`견적서 [${quotationNumber}]가 제출되었습니다. 현장 관리자의 승인을 기다립니다.`);
  };

  // Handler: Approve Quotation & Order (현장 관리자)
  const handleApproveQuotation = (quotationId: string, orderId: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'ACCEPTED' } : q))
    );

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'APPROVED' } : o))
    );

    showToast(`해당 견적이 채택되어 발주가 [발주 승인(APPROVED)] 처리되었습니다. 공급업체 출하가 가능합니다.`);
  };

  // Handler: Create Delivery / Dispatch (공급업체)
  const handleCreateDelivery = (
    newDeliveryData: Omit<DeliveryItem, 'id' | 'deliveryNumber' | 'inspectionResult'>
  ) => {
    const nextIdNumber = deliveries.length + 42;
    const deliveryNumber = documentNumber('DEL', nextIdNumber, 3);
    const newDelivery: DeliveryItem = {
      ...newDeliveryData,
      id: `del-${Date.now()}`,
      deliveryNumber,
      inspectionResult: 'PENDING'
    };

    setDeliveries([newDelivery, ...deliveries]);

    // Update order status to IN_DELIVERY
    setOrders((prev) =>
      prev.map((o) =>
        o.id === newDeliveryData.orderId ? { ...o, status: 'IN_DELIVERY' } : o
      )
    );

    showToast(`자재 출하 및 배송 [${deliveryNumber}]이 등록되었습니다. 현장으로 차량이 출발했습니다.`);
  };

  // Handler: Inspect Delivery & Sign (현장 관리자)
  const handleInspectDelivery = (
    deliveryId: string,
    result: InspectionResult,
    inspectorName: string,
    notes: string,
    signature: string
  ) => {
    const now = toLocalDateTime(new Date());

    let relatedOrderId = '';

    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          relatedOrderId = d.orderId;
          return {
            ...d,
            trackingStatus: 'INSPECTED',
            inspectedAt: now,
            inspectorName,
            inspectionResult: result,
            inspectionNotes: notes,
            recipientSignature: signature
          };
        }
        return d;
      })
    );

    if (result === 'PASS' || result === 'CONDITIONAL_PASS') {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === relatedOrderId ? { ...o, status: 'DELIVERED' } : o
        )
      );
      showToast(`자재 입고 검수 및 전자 인수 서명이 완료되었습니다. 공급업체 송장 발행이 승인되었습니다.`);
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === relatedOrderId ? { ...o, status: 'REJECTED' } : o
        )
      );
      showToast(`자재 검수 결과 [불합격(FAIL)]으로 판정되어 반품 요청이 전달되었습니다.`);
    }
  };

  // Handler: Create Invoice (공급업체)
  const handleCreateInvoice = (
    newInvoiceData: Omit<InvoiceItem, 'id' | 'invoiceNumber' | 'paymentStatus'>
  ) => {
    const nextIdNumber = invoices.length + 95;
    const invoiceNumber = documentNumber('INV', nextIdNumber, 4);
    const newInvoice: InvoiceItem = {
      ...newInvoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      paymentStatus: 'PAYMENT_REQUESTED'
    };

    setInvoices([newInvoice, ...invoices]);
    showToast(`전자세금계산서/송장 [${invoiceNumber}]이 발행되어 현장에 청구되었습니다.`);
  };

  // Handler: Approve Payment (현장 관리자)
  const handleApprovePayment = (invoiceId: string) => {
    const targetInvoice = invoices.find((i) => i.id === invoiceId);
    if (!targetInvoice) return;

    const paymentNumber = documentNumber('PAY', payments.length + 35, 4);
    const now = toLocalDateTime(new Date());

    const newPayment: PaymentItem = {
      id: `pay-${Date.now()}`,
      paymentNumber,
      invoiceId: targetInvoice.id,
      invoiceNumber: targetInvoice.invoiceNumber,
      orderNumber: targetInvoice.orderNumber,
      amount: targetInvoice.totalAmount,
      paymentMethod: 'BANK_TRANSFER',
      paymentDate: now,
      status: 'COMPLETED',
      payerName: `${targetInvoice.siteName} 공무/재무팀`,
      note: '전자세금계산서 청구분 법인계좌 실시간 이체 완료'
    };

    setPayments([newPayment, ...payments]);

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, paymentStatus: 'PAID' } : inv
      )
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === targetInvoice.orderNumber ? { ...o, status: 'COMPLETED' } : o
      )
    );

    showToast(`대금 지급 [${paymentNumber}]이 집행되어 정산이 최종 종결되었습니다.`);
  };

  // Stage headline figures (act 2 — dark feature stage)
  const isSiteManager = currentRole === 'SITE_MANAGER';
  const activeOrders = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'REJECTED').length;
  const totalContract = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const pendingInspections = deliveries.filter((d) => d.inspectionResult === 'PENDING').length;
  const unpaidInvoices = invoices.filter((i) => i.paymentStatus !== 'PAID').length;
  const paidTotal = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-pure-black text-frost-white">
      {/* Toast Notification — obsidian card floating on the stage, no elevation */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-obsidian text-frost-white px-5 py-3.5 rounded-[28px] flex items-center gap-3 text-body max-w-md animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-halo-blue shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenManualModal={handleOpenManual}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {/* ACT 1 — Hero Stage: pure black, headline bottom-left, single blue CTA */}
        <section className="w-full bg-pure-black">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 min-h-[58vh] flex flex-col justify-end pt-24 pb-16">
            <div className="max-w-[980px]">
              <p className="flex items-center gap-2 text-[17px] font-semibold text-frost-white tracking-[-0.19px] mb-5">
                <Building2 className="w-4 h-4" strokeWidth={1.75} />
                <span>CPMS · {isSiteManager ? '현장 관리자' : '협력 공급업체'}</span>
              </p>
              <h1 className="font-display text-display sm:text-hero font-bold text-frost-white tracking-hero">
                발주부터 정산까지,<br className="hidden sm:block" /> 하나의 흐름으로.
              </h1>
              <div className="mt-8 flex items-center gap-2 flex-wrap">
                <span className="btn-ghost-label text-frost-white pl-0">
                  진행 중 발주 {activeOrders}건 · 누계 {totalContract.toLocaleString()}원
                </span>
                {isSiteManager ? (
                  <button onClick={() => setIsNewOrderModalOpen(true)} className="btn-primary cursor-pointer">
                    신규 발주 신청
                  </button>
                ) : (
                  <button onClick={() => setActiveTab('supplier-dashboard')} className="btn-primary cursor-pointer">
                    공급사 대시보드
                  </button>
                )}
                <button onClick={() => handleOpenManual('man-01')} className="link-dark text-body px-3 py-2.5 cursor-pointer">
                  전체 매뉴얼 보기 ›
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ACT 2 — Dark Feature Stage: obsidian, standalone section headline + one photo-card-style panel */}
        <section className="w-full bg-obsidian stage-fade">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24 lg:py-28">
            <h2 className="font-display text-heading-lg sm:text-display font-bold text-frost-white tracking-display max-w-[980px]">
              {isSiteManager
                ? `검수 대기 ${pendingInspections}건. 미결제 송장 ${unpaidInvoices}건.`
                : `수금 완료 ${paidTotal.toLocaleString()}원. 미수 송장 ${unpaidInvoices}건.`}
            </h2>
            <div className="mt-14 rounded-[28px] bg-carbon p-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
              <div className="max-w-[460px]">
                <p className="text-body text-frost-white leading-relaxed">
                  7단계 라이프사이클을 좌측 패널에서 단계별로 열람하고, 아래 워크스페이스에서 발주·견적·출하·검수·송장·결제를 실행합니다. 각 단계는 공식 한글 표준 운영 매뉴얼(SOP)과 연결되어 있습니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveTab('analytics-dashboard')} className="btn-secondary-dark cursor-pointer">
                  효율성 차트
                </button>
                <button onClick={() => setActiveTab('manual-hub')} className="btn-secondary-dark cursor-pointer">
                  전체 매뉴얼
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ACT 3 — Light Detail Band: paper white, sidebar + workspace */}
        <section className="w-full bg-paper-white text-obsidian">
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 pt-16 pb-24 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <InteractiveWorkflowBar
          onSelectManual={handleOpenManual}
          selectedManualId={selectedManual?.id}
        />

        <div className="flex-1 min-w-0 flex flex-col gap-16">
        {/* VIEW 1: MANUAL HUB (전체 한글 매뉴얼) */}
        {activeTab === 'manual-hub' && (
          <ManualView onSelectManual={handleOpenManual} searchTerm={searchTerm} />
        )}

        {/* VIEW 2: PROCUREMENT EFFICIENCY ANALYTICS DASHBOARD */}
        {activeTab === 'analytics-dashboard' && (
          <ProcurementEfficiencyDashboard
            orders={orders}
            quotations={quotations}
            deliveries={deliveries}
            invoices={invoices}
            payments={payments}
            onOpenManual={handleOpenManual}
          />
        )}

        {/* VIEW 3: SITE MANAGER VIEW (현장 관리자) */}
        {activeTab !== 'manual-hub' && activeTab !== 'analytics-dashboard' && currentRole === 'SITE_MANAGER' && (
          <SiteManagerView
            orders={orders}
            quotations={quotations}
            deliveries={deliveries}
            invoices={invoices}
            payments={payments}
            onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
            onOpenInspectionModal={(del) => setSelectedDeliveryForInspection(del)}
            onApproveQuotation={handleApproveQuotation}
            onApprovePayment={handleApprovePayment}
            onOpenManual={handleOpenManual}
            onViewOrderPdf={(ord) => setSelectedOrderForPdf(ord)}
            onViewInvoicePdf={(inv) => setSelectedInvoiceForPdf(inv)}
          />
        )}

        {/* VIEW 4: SUPPLIER VIEW (협력 공급업체) */}
        {activeTab !== 'manual-hub' && activeTab !== 'analytics-dashboard' && currentRole === 'SUPPLIER' && (
          <SupplierView
            orders={orders}
            quotations={quotations}
            deliveries={deliveries}
            invoices={invoices}
            payments={payments}
            onOpenQuotationModal={(ord) => setSelectedOrderForQuotation(ord)}
            onOpenDeliveryModal={(ord) => setSelectedOrderForDelivery(ord)}
            onOpenInvoiceModal={(ord) => setSelectedOrderForInvoice(ord)}
            onOpenManual={handleOpenManual}
            onViewOrderPdf={(ord) => setSelectedOrderForPdf(ord)}
            onViewInvoicePdf={(inv) => setSelectedInvoiceForPdf(inv)}
          />
        )}
        </div>
        </div>
        </section>
      </main>

      {/* Footer — obsidian, typographic, smoke hairlines */}
      <footer className="bg-obsidian border-t hairline-dark text-caption text-platinum">
        <div className="max-w-[980px] mx-auto px-6 py-12 flex flex-col gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="font-semibold text-frost-white mb-2.5">시스템</div>
              <ul className="space-y-2">
                <li><button onClick={() => handleOpenManual('man-01')} className="hover:underline cursor-pointer">시스템 개요</button></li>
                <li><button onClick={() => setActiveTab('analytics-dashboard')} className="hover:underline cursor-pointer">조달 효율성 차트</button></li>
                <li><button onClick={() => setActiveTab('manual-hub')} className="hover:underline cursor-pointer">전체 한글 매뉴얼</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-frost-white mb-2.5">현장 관리자</div>
              <ul className="space-y-2">
                <li><button onClick={() => handleOpenManual('man-02')} className="hover:underline cursor-pointer">발주 신청</button></li>
                <li><button onClick={() => handleOpenManual('man-03')} className="hover:underline cursor-pointer">발주 승인</button></li>
                <li><button onClick={() => handleOpenManual('man-04')} className="hover:underline cursor-pointer">현장 검수</button></li>
                <li><button onClick={() => handleOpenManual('man-05')} className="hover:underline cursor-pointer">대금 지급</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-frost-white mb-2.5">공급업체</div>
              <ul className="space-y-2">
                <li><button onClick={() => handleOpenManual('man-06')} className="hover:underline cursor-pointer">견적 제출</button></li>
                <li><button onClick={() => handleOpenManual('man-07')} className="hover:underline cursor-pointer">출하·배송</button></li>
                <li><button onClick={() => handleOpenManual('man-08')} className="hover:underline cursor-pointer">송장 발행</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-frost-white mb-2.5">지원</div>
              <ul className="space-y-2">
                <li><button onClick={() => handleOpenManual('man-10')} className="hover:underline cursor-pointer">조달 승인 규정</button></li>
                <li><button onClick={() => handleOpenManual('man-12')} className="hover:underline cursor-pointer">개발자 API 명세</button></li>
                <li><button onClick={() => handleOpenManual('man-11')} className="hover:underline cursor-pointer">FAQ / 트러블슈팅</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t hairline-dark pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-platinum" />
              <span>건설 산업 조달 관리 시스템 (CPMS) v2.4</span>
            </div>
            <span>모든 기능 및 매뉴얼 100% 한글 패치 완료</span>
          </div>
        </div>
      </footer>

      {/* Contextual Manual Drawer/Modal */}
      <ManualModal
        manual={selectedManual}
        onClose={() => setSelectedManual(null)}
      />

      {/* New Order Creation Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSubmit={handleCreateOrder}
        onOpenManual={handleOpenManual}
      />

      {/* Site Manager Delivery Inspection Modal */}
      <InspectionModal
        delivery={selectedDeliveryForInspection}
        isOpen={!!selectedDeliveryForInspection}
        onClose={() => setSelectedDeliveryForInspection(null)}
        onSubmitInspection={handleInspectDelivery}
        onOpenManual={handleOpenManual}
      />

      {/* Supplier: Quotation Submission Modal */}
      <NewQuotationModal
        order={selectedOrderForQuotation}
        isOpen={!!selectedOrderForQuotation}
        onClose={() => setSelectedOrderForQuotation(null)}
        onSubmit={handleSubmitQuotation}
        onOpenManual={handleOpenManual}
      />

      {/* Supplier: Delivery Registration Modal */}
      <NewDeliveryModal
        order={selectedOrderForDelivery}
        isOpen={!!selectedOrderForDelivery}
        onClose={() => setSelectedOrderForDelivery(null)}
        onSubmit={handleCreateDelivery}
        onOpenManual={handleOpenManual}
      />

      {/* Supplier: Invoice Issuance Modal */}
      <NewInvoiceModal
        order={selectedOrderForInvoice}
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        onSubmit={handleCreateInvoice}
        onOpenManual={handleOpenManual}
      />

      {/* Official Document PDF & Print Modal: Purchase Order */}
      <DocumentPdfModal
        isOpen={!!selectedOrderForPdf}
        onClose={() => setSelectedOrderForPdf(null)}
        order={selectedOrderForPdf || undefined}
      />

      {/* Official Document PDF & Print Modal: Tax Invoice */}
      <DocumentPdfModal
        isOpen={!!selectedInvoiceForPdf}
        onClose={() => setSelectedInvoiceForPdf(null)}
        invoice={selectedInvoiceForPdf || undefined}
      />
    </div>
  );
}
