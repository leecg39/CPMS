export type UserRole = 'SITE_MANAGER' | 'SUPPLIER' | 'ADMIN';

export type OrderStatus =
  | 'PENDING'       // 승인 대기
  | 'QUOTED'        // 견적 접수됨
  | 'APPROVED'      // 발주 승인
  | 'IN_DELIVERY'   // 배송/출하 중
  | 'DELIVERED'     // 현장 도착/검수 완료
  | 'COMPLETED'     // 정산/종결
  | 'REJECTED';     // 반려

export type PriorityLevel = 'NORMAL' | 'URGENT' | 'EMERGENCY';

export interface OrderItem {
  id: string;
  orderNumber: string;
  materialId?: string;       // 품목 ID (예: MAT-STL-01)
  siteName: string;          // 현장명 (예: 강남 르네상스타워)
  materialName: string;      // 품목명 (예: 고장력 철근 SD400 D19)
  category: string;          // 자재 분류 (철근/콘크리트/목재/전기설비 등)
  specification: string;     // 규격/사양
  quantity: number;          // 수량
  unit: string;              // 단위 (톤, m3, 포, 매 등)
  unitPrice: number;         // 예정 단가 (원)
  totalAmount: number;       // 합계 금액 (원)
  supplierId: string;
  supplierName: string;
  status: OrderStatus;
  priority: PriorityLevel;
  deliveryAddress: string;   // 납품 장소
  requestedDeliveryDate: string; // 납기 요청일
  createdAt: string;
  notes?: string;
}

export type QuotationStatus = 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';

export interface QuotationItem {
  id: string;
  quotationNumber: string;
  orderId: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  materialName: string;
  specification: string;
  proposedUnitPrice: number;
  quantity: number;
  unit: string;
  totalAmount: number;
  leadTimeDays: number;
  validUntil: string;
  status: QuotationStatus;
  remarks: string;
  submittedAt: string;
}

export type DeliveryTrackingStatus = 'PREPARING' | 'SHIPPED' | 'ARRIVED' | 'INSPECTED';
export type InspectionResult = 'PENDING' | 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';

export interface DeliveryItem {
  id: string;
  deliveryNumber: string;
  orderId: string;
  orderNumber: string;
  supplierName: string;
  siteName: string;
  materialName: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;      // 운송차량번호 (예: 경기88바1234)
  driverName: string;         // 운송기사명
  driverContact: string;      // 기사 연락처
  trackingStatus: DeliveryTrackingStatus;
  dispatchedAt: string;       // 출하일시
  expectedArrival: string;    // 도착 예정일시
  arrivedAt?: string;
  inspectedAt?: string;
  inspectorName?: string;
  inspectionResult: InspectionResult;
  inspectionNotes?: string;
  recipientSignature?: string; // 서명 여부/텍스트
}

export type InvoicePaymentStatus = 'UNPAID' | 'PAYMENT_REQUESTED' | 'PAID' | 'OVERDUE';

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  deliveryId?: string;
  supplierName: string;
  siteName: string;
  supplyAmount: number;       // 공급가액
  taxAmount: number;          // 부가세 (10%)
  totalAmount: number;        // 청구 총액
  issueDate: string;          // 계산서 발행일
  dueDate: string;            // 지급 기한
  paymentStatus: InvoicePaymentStatus;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface PaymentItem {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  orderNumber: string;
  amount: number;
  paymentMethod: 'BANK_TRANSFER' | 'NOTE' | 'CORPORATE_CARD'; // 계좌이체, 전자어음, 법인카드
  paymentDate: string;
  status: 'COMPLETED' | 'PROCESSING';
  payerName: string;
  note?: string;
}

export interface ManualStep {
  stepNumber: number;
  title: string;
  description: string;
  actionDetail: string;
  tip?: string;
}

export interface ManualSection {
  id: string;
  code: string;               // e.g. "MAN-01"
  title: string;
  category: 'OVERVIEW' | 'SITE_MANAGER' | 'SUPPLIER' | 'WORKFLOW' | 'REGULATIONS' | 'API_DEV' | 'FAQ';
  targetRole: 'ALL' | 'SITE_MANAGER' | 'SUPPLIER' | 'DEV';
  badge: string;
  summary: string;
  prerequisites?: string[];
  steps?: ManualStep[];
  cautions?: string[];
  tips?: string[];
  relatedScreen?: string;
  faqs?: { question: string; answer: string }[];
  apiReference?: {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    description: string;
    requestSample?: string;
    responseSample?: string;
  };
}
