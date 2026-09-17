import React, { useState } from 'react';
import { OrderItem, QuotationItem, DeliveryItem, InvoiceItem } from '../types';
import { X, Calculator, Truck, Receipt, HelpCircle, Check, Plus } from 'lucide-react';
import {
  defaultExpectedArrival,
  defaultInvoiceDueDate,
  defaultQuoteValidUntil,
  toLocalDateTime,
  toLocalIsoDate
} from '../utils/liveDates';

interface NewQuotationModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quotation: Omit<QuotationItem, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>) => void;
  onOpenManual: (manualId: string) => void;
}

export const NewQuotationModal: React.FC<NewQuotationModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmit,
  onOpenManual
}) => {
  const [proposedUnitPrice, setProposedUnitPrice] = useState<number>(order?.unitPrice || 850000);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(2);
  const [validUntil, setValidUntil] = useState<string>(defaultQuoteValidUntil);
  const [remarks, setRemarks] = useState<string>('KS 인증서 첨부, 당사 직영 차량 하역 지원, 파레트 래핑 무료');
  const [supplierName, setSupplierName] = useState<string>('동국제강(주) 수도권영업소');

  if (!isOpen || !order) return null;

  const totalAmount = order.quantity * (proposedUnitPrice || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      orderId: order.id,
      orderNumber: order.orderNumber,
      supplierId: 'sup-my-company',
      supplierName,
      materialName: order.materialName,
      specification: order.specification,
      proposedUnitPrice: Number(proposedUnitPrice),
      quantity: order.quantity,
      unit: order.unit,
      totalAmount,
      leadTimeDays: Number(leadTimeDays),
      validUntil,
      remarks
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">자재 단가 견적서(Quotation) 제출</h2>
              <p className="text-xs text-slate-400">발주번호: {order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenManual('man-06')}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>견적 매뉴얼(MAN-06)</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-900 text-sm">{order.materialName} ({order.quantity} {order.unit})</div>
          <div><span className="font-semibold">현장:</span> {order.siteName}</div>
          <div><span className="font-semibold">규격:</span> {order.specification}</div>
          <div><span className="font-semibold">희망 납기일:</span> {order.requestedDeliveryDate}</div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">제출 공급사명</label>
            <input
              type="text"
              required
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs font-semibold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">제안 단가 (원/{order.unit}) *</label>
              <input
                type="number"
                required
                min={0}
                step={100}
                value={proposedUnitPrice}
                onChange={(e) => setProposedUnitPrice(Number(e.target.value))}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">납기 소요 일수 (Lead Time)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min={1}
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs font-semibold outline-none"
                />
                <span className="shrink-0 font-bold text-slate-500">일 이내</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">제안 총 공급가액:</span>
            <span className="text-base font-black text-indigo-700 font-mono">
              {totalAmount.toLocaleString()} 원
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">견적 유효기한</label>
            <input
              type="date"
              required
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">견적 비고 및 공급 조건</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 btn-outline btn-sm text-xs font-bold rounded-full cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 btn-primary btn-sm text-xs font-bold rounded-full cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>견적서 제출 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface NewDeliveryModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (delivery: Omit<DeliveryItem, 'id' | 'deliveryNumber' | 'inspectionResult'>) => void;
  onOpenManual: (manualId: string) => void;
}

export const NewDeliveryModal: React.FC<NewDeliveryModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmit,
  onOpenManual
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('경기88바9922 (25톤 카고)');
  const [driverName, setDriverName] = useState('이진수');
  const [driverContact, setDriverContact] = useState('010-9283-4411');
  const [expectedArrival, setExpectedArrival] = useState(defaultExpectedArrival);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      orderId: order.id,
      orderNumber: order.orderNumber,
      supplierName: order.supplierName,
      siteName: order.siteName,
      materialName: order.materialName,
      quantity: order.quantity,
      unit: order.unit,
      vehicleNumber,
      driverName,
      driverContact,
      trackingStatus: 'SHIPPED',
      dispatchedAt: toLocalDateTime(new Date()),
      expectedArrival
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-600 text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">신규 자재 출하 및 배차(Delivery) 등록</h2>
              <p className="text-xs text-slate-400">발주번호: {order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenManual('man-07')}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>배송 매뉴얼(MAN-07)</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-900 text-sm">{order.materialName} ({order.quantity} {order.unit})</div>
          <div><span className="font-semibold">도착 현장:</span> {order.siteName} ({order.deliveryAddress})</div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">운송 차량 번호 및 차종 *</label>
            <input
              type="text"
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs font-semibold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">담당 운송 기사 성명 *</label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">기사 휴대폰 번호 *</label>
              <input
                type="text"
                required
                value={driverContact}
                onChange={(e) => setDriverContact(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs font-semibold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">현장 도착 예정 일시</label>
            <input
              type="text"
              required
              value={expectedArrival}
              onChange={(e) => setExpectedArrival(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs font-semibold outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 btn-outline btn-sm text-xs font-bold rounded-full cursor-pointer">
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 btn-primary btn-sm text-xs font-bold rounded-full cursor-pointer flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>배송 출하 등록 확정</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface NewInvoiceModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoice: Omit<InvoiceItem, 'id' | 'invoiceNumber' | 'paymentStatus'>) => void;
  onOpenManual: (manualId: string) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmit,
  onOpenManual
}) => {
  const [bankName, setBankName] = useState('신한은행');
  const [accountNumber, setAccountNumber] = useState('110-384-998821');
  const [accountHolder, setAccountHolder] = useState('동국제강(주)');
  const [dueDate, setDueDate] = useState(defaultInvoiceDueDate);

  if (!isOpen || !order) return null;

  const supplyAmount = order.totalAmount;
  const taxAmount = Math.round(supplyAmount * 0.1);
  const totalAmount = supplyAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      orderId: order.id,
      orderNumber: order.orderNumber,
      supplierName: order.supplierName,
      siteName: order.siteName,
      supplyAmount,
      taxAmount,
      totalAmount,
      issueDate: toLocalIsoDate(new Date()),
      dueDate,
      bankName,
      accountNumber,
      accountHolder
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">전자세금계산서/송장(Invoice) 발행</h2>
              <p className="text-xs text-slate-400">발주번호: {order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenManual('man-08')}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>송장 매뉴얼(MAN-08)</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-900 text-sm">{order.materialName} ({order.quantity} {order.unit})</div>
          <div><span className="font-semibold">공급업체:</span> {order.supplierName}</div>
          <div><span className="font-semibold">청구 대상 현장:</span> {order.siteName}</div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Amounts */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-slate-600 text-xs">
              <span>공급가액:</span>
              <span className="font-bold text-slate-900">{supplyAmount.toLocaleString()} 원</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 text-xs">
              <span>부가가치세 (10%):</span>
              <span className="font-bold text-slate-900">{taxAmount.toLocaleString()} 원</span>
            </div>
            <div className="pt-2 border-t border-purple-200 flex items-center justify-between text-purple-900 text-sm font-black">
              <span>총 청구 금액:</span>
              <span className="text-base text-purple-700">{totalAmount.toLocaleString()} 원</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">지급 요청 기한 (Due Date) *</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 text-xs font-semibold outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">입금 은행 *</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">계좌 번호 *</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">예금주 *</label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 btn-outline btn-sm text-xs font-bold rounded-full cursor-pointer">
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 btn-primary btn-sm text-xs font-bold rounded-full cursor-pointer flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>세금계산서 청구 발행</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
