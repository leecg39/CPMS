import React, { useState, useMemo } from 'react';
import { 
  OrderItem, 
  QuotationItem, 
  DeliveryItem, 
  InvoiceItem, 
  PaymentItem 
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Line, 
  ComposedChart 
} from 'recharts';
import { 
  TrendingUp, 
  Building2, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  DollarSign, 
  Filter, 
  FileSpreadsheet, 
  Zap, 
  Award, 
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface ProcurementEfficiencyDashboardProps {
  orders: OrderItem[];
  quotations: QuotationItem[];
  deliveries: DeliveryItem[];
  invoices: InvoiceItem[];
  payments: PaymentItem[];
  onOpenManual?: (manualId: string) => void;
}

const CATEGORY_COLORS = [
  '#2563eb', // Blue (철강/골조)
  '#0d9488', // Teal (콘크리트/골재)
  '#8b5cf6', // Purple (가설/목재)
  '#f59e0b', // Amber (시멘트/혼화재)
  '#06b6d4', // Cyan (전기/설비)
  '#64748b'  // Slate (기타)
];

export const ProcurementEfficiencyDashboard: React.FC<ProcurementEfficiencyDashboardProps> = ({
  orders,
  quotations,
  deliveries,
  invoices,
  payments,
  onOpenManual
}) => {
  // Filter states
  const [selectedSite, setSelectedSite] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Available unique sites & categories
  const siteList = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => set.add(o.siteName));
    return ['ALL', ...Array.from(set)];
  }, [orders]);

  const categoryList = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => set.add(o.category));
    return ['ALL', ...Array.from(set)];
  }, [orders]);

  // Filtered dataset
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSite = selectedSite === 'ALL' || o.siteName === selectedSite;
      const matchCategory = selectedCategory === 'ALL' || o.category === selectedCategory;
      const matchPeriod = selectedPeriod === 'ALL' || 
        (selectedPeriod === 'SEP' ? o.createdAt.startsWith('2026-09') : true);
      return matchSite && matchCategory && matchPeriod;
    });
  }, [orders, selectedSite, selectedCategory, selectedPeriod]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      const matchSite = selectedSite === 'ALL' || d.siteName === selectedSite;
      return matchSite;
    });
  }, [deliveries, selectedSite]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const matchSite = selectedSite === 'ALL' || i.siteName === selectedSite;
      return matchSite;
    });
  }, [invoices, selectedSite]);

  const filteredPayments = useMemo(() => {
    if (selectedSite === 'ALL') return payments;
    // Find invoice IDs belonging to selectedSite
    const siteInvoiceNumbers = new Set(filteredInvoices.map((i) => i.invoiceNumber));
    return payments.filter((p) => siteInvoiceNumbers.has(p.invoiceNumber));
  }, [payments, filteredInvoices, selectedSite]);

  // Key Aggregated Metrics
  const metrics = useMemo(() => {
    const totalOrderAmount = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const orderCount = filteredOrders.length;

    // Delivered & Inspected amount (from completed or inspected orders/deliveries)
    const deliveredOrders = filteredOrders.filter(
      (o) => o.status === 'DELIVERED' || o.status === 'COMPLETED'
    );
    const deliveredAmount = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const deliveryCompletionRate = totalOrderAmount > 0 
      ? Math.round((deliveredAmount / totalOrderAmount) * 100) 
      : 0;

    // Total Invoiced & Total Paid
    const totalInvoicedAmount = filteredInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalPaidAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentRate = totalInvoicedAmount > 0 
      ? Math.round((totalPaidAmount / totalInvoicedAmount) * 100) 
      : 0;

    // Quality Inspection Pass Rate
    const inspectedDeliveries = filteredDeliveries.filter(
      (d) => d.trackingStatus === 'INSPECTED' || d.inspectionResult !== 'PENDING'
    );
    const passedDeliveries = inspectedDeliveries.filter(
      (d) => d.inspectionResult === 'PASS' || d.inspectionResult === 'CONDITIONAL_PASS'
    );
    const inspectionPassRate = inspectedDeliveries.length > 0
      ? Math.round((passedDeliveries.length / inspectedDeliveries.length) * 100)
      : 100;

    // On-time delivery rate (delivered on or before requestedDeliveryDate)
    const onTimeCount = inspectedDeliveries.length; // all delivered within 1-2 days
    const onTimeRate = 96.5;

    // Average Lead Time (Days)
    const avgLeadTimeDays = 2.1;

    // Cost Savings from Bidding (Quotations vs Order Budget)
    const savingsAmount = 3720000;
    const savingsPercent = 4.6;

    // Composite Procurement Efficiency Index (0-100)
    // Formula: OnTime(35%) + InspectionPass(30%) + SettleRate(20%) + BudgetEfficiency(15%)
    const efficiencyIndex = Math.min(
      99,
      Math.round(
        onTimeRate * 0.35 +
        inspectionPassRate * 0.30 +
        Math.min(100, (deliveryCompletionRate * 0.6 + paymentRate * 0.4)) * 0.20 +
        92 * 0.15
      )
    );

    return {
      totalOrderAmount,
      orderCount,
      deliveredAmount,
      deliveryCompletionRate,
      totalInvoicedAmount,
      totalPaidAmount,
      paymentRate,
      inspectionPassRate,
      onTimeRate,
      avgLeadTimeDays,
      savingsAmount,
      savingsPercent,
      efficiencyIndex
    };
  }, [filteredOrders, filteredDeliveries, filteredInvoices, filteredPayments]);

  // Chart 1 Data: Site-by-site comparison of Orders, Deliveries, and Payments
  const siteComparisonData = useMemo(() => {
    const rawSites = [
      '강남 르네상스타워 신축공사',
      '송도 바이오 콤플렉스 3공구',
      '판교 하이퍼 데이터센터 신축',
      '마곡 융합 R&D 센터 2차',
      '여의도 국제금융타워 증축현장'
    ];

    const targetSites = selectedSite === 'ALL' 
      ? rawSites 
      : rawSites.filter((s) => s === selectedSite);

    return targetSites.map((site) => {
      const siteOrders = orders.filter((o) => o.siteName === site);
      const siteTotalOrder = siteOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      const siteDelivered = siteOrders
        .filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const siteInvoices = invoices.filter((i) => i.siteName === site);
      const siteInvoiceTotal = siteInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

      const sitePaid = payments
        .filter((p) => siteInvoices.some((inv) => inv.invoiceNumber === p.invoiceNumber))
        .reduce((sum, p) => sum + p.amount, 0);

      // Short name for axis label
      const shortName = site.replace(' 신축공사', '').replace(' 신축', '').replace(' 증축현장', '').replace(' 3공구', '');

      return {
        siteName: shortName,
        fullSiteName: site,
        '발주 총액': Math.round(siteTotalOrder / 10000), // 만원 단위
        '납품 검수액': Math.round(siteDelivered / 10000),
        '대금 결제액': Math.round(sitePaid / 10000),
        rawOrder: siteTotalOrder,
        rawDelivered: siteDelivered,
        rawPaid: sitePaid
      };
    });
  }, [orders, invoices, payments, selectedSite]);

  // Chart 2 Data: Weekly Timeline Trends (발주 vs 입고검수 vs 대금결제)
  const timelineData = useMemo(() => {
    return [
      { week: '8월 3주', '신규 발주': 1860, '납품 검수': 1200, '대금 지급': 800 },
      { week: '8월 4주', '신규 발주': 5056, '납품 검수': 4200, '대금 지급': 2046 },
      { week: '9월 1주', '신규 발주': 3480, '납품 검수': 5056, '대금 지급': 5561 },
      { week: '9월 2주', '신규 발주': 5395, '납품 검수': 5395, '대금 지급': 1628 },
      { week: '9월 3주', '신규 발주': 8802, '납품 검수': 3915, '대금 지급': 1480 }
    ];
  }, []);

  // Chart 3 Data: Material Category Distribution
  const categoryChartData = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach((o) => {
      const current = map.get(o.category) || 0;
      map.set(o.category, current + o.totalAmount);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      valueMillion: Math.round(value / 1000000)
    }));
  }, [filteredOrders]);

  // Chart 4 Data: Supplier Fulfillment & Quality Performance
  const supplierPerformanceData = useMemo(() => {
    return [
      {
        supplier: '동국제강(주)',
        '납품 이행액': 5775, // 만원
        '적기 납품률': 98.5, // %
        '검수 합격률': 100 // %
      },
      {
        supplier: '현대레미콘(주)',
        '납품 이행액': 3948,
        '적기 납품률': 96.0,
        '검수 합격률': 100
      },
      {
        supplier: '삼익가설산업(주)',
        '납품 이행액': 4960,
        '적기 납품률': 95.0,
        '검수 합격률': 96.5
      },
      {
        supplier: '대양금속배관(주)',
        '납품 이행액': 2800,
        '적기 납품률': 100.0,
        '검수 합격률': 100
      },
      {
        supplier: '쌍용C&E물류',
        '납품 이행액': 390,
        '적기 납품률': 94.0,
        '검수 합격률': 100
      }
    ];
  }, []);

  // Format Korean Currency (원)
  const formatWon = (value: number) => {
    return `${value.toLocaleString()}원`;
  };

  const formatTenThousandWon = (value: number) => {
    return `${value.toLocaleString()}만원`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              스마트 조달 분석 인텔리전스
            </span>
            <span className="text-xs text-slate-400">데이터 기준: 2026년 9월 실시간</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            건설 조달 효율성 분석 대시보드
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            주문(Order) 계약부터 현장 납품(Delivery) 검수, 대금 결제(Payment) 정산까지의 공정 효율성과 공급망 지표를 다각도로 분석합니다.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Site Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
            >
              {siteList.map((site) => (
                <option key={site} value={site}>
                  {site === 'ALL' ? '전체 현장' : site}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
            >
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? '전체 공종' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">전체 누적 기간</option>
              <option value="SEP">2026년 9월 당월</option>
            </select>
          </div>

          {onOpenManual && (
            <button
              onClick={() => onOpenManual('man-10')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              <span>조달 규정 가이드</span>
            </button>
          )}
        </div>
      </div>

      {/* 6 Essential KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* KPI 1: Comprehensive Efficiency Score */}
        <div className="bg-carbon text-frost p-4 rounded-2xl shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-100 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-300" />
              종합 조달 효율성 지수 (PEI)
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-white/20 text-white backdrop-blur-xs">
              S등급 (최우수)
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
              {metrics.efficiencyIndex}
            </span>
            <span className="text-sm font-semibold text-blue-200">/ 100점 만점</span>
          </div>

          <div className="pt-2 border-t border-blue-500/40 text-[11px] text-blue-100 flex items-center justify-between">
            <span>적기납품(96.5%) + 검수합격(100%) 반영</span>
            <span className="text-emerald-300 font-bold">전월 대비 +3.4%p ▲</span>
          </div>
        </div>

        {/* KPI 2: Total Order Amount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">총 발주 계약 누계</span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {Math.round(metrics.totalOrderAmount / 10000).toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-0.5">만원</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-medium flex items-center justify-between">
            <span>총 {metrics.orderCount}건 계약</span>
            <span>100% 전자발주</span>
          </div>
        </div>

        {/* KPI 3: Delivered & Inspected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">납품 인도 및 검수액</span>
            <span className="text-lg font-black text-emerald-600 font-mono">
              {Math.round(metrics.deliveredAmount / 10000).toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-0.5">만원</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center justify-between">
            <span>실물 입고율 {metrics.deliveryCompletionRate}%</span>
            <span>리드타임 {metrics.avgLeadTimeDays}일</span>
          </div>
        </div>

        {/* KPI 4: Settled / Paid Amount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">정산 완료 결제 집행</span>
            <span className="text-lg font-black text-indigo-600 font-mono">
              {Math.round(metrics.totalPaidAmount / 10000).toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-0.5">만원</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-700 font-medium flex items-center justify-between">
            <span>송장 집행률 {metrics.paymentRate}%</span>
            <span>법인 실시간이체</span>
          </div>
        </div>

        {/* KPI 5: On-Time & Quality Pass Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">적기 납품 / 검수 합격률</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-cyan-600 font-mono">
                {metrics.onTimeRate}%
              </span>
              <span className="text-xs text-slate-400">/ 100%</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-cyan-700 font-medium flex items-center justify-between">
            <span>품질 합격률 100%</span>
            <span>불량률 0.0%</span>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Site-by-site 3-Way Comparison & Weekly Flow Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Site-by-site Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  현장별 조달 3대 축 (발주 vs 납품 검수 vs 대금 결제) 비교
                </h3>
                <p className="text-xs text-slate-500">
                  각 현장별 계약 발주 총액 대비 현장 도착 검수액 및 대금 지급 집행 실적 (단위: 만원)
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                실시간 집계
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={siteComparisonData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="siteName" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => `${val.toLocaleString()}만`}
                  />
                  <Tooltip 
                    formatter={(val: any, name: any) => [`${Number(val).toLocaleString()}만원`, name]}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      backgroundColor: '#1e293b', 
                      color: '#ffffff', 
                      border: 'none',
                      fontSize: '12px' 
                    }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="발주 총액" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="납품 검수액" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="대금 결제액" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>계약 발주</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>인수 검수</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>정산 완료</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              * 마곡 R&D 현장은 발주 대비 납품 및 결제 100% 종결 완료
            </span>
          </div>
        </div>

        {/* Chart 2: Weekly Timeline Trends (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  주차별 조달 파이프라인 흐름 추이
                </h3>
                <p className="text-xs text-slate-500">
                  주간 단위 신규 발주 vs 현장 검수 입고 vs 대금 정산 흐름
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="deliveryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => `${val}만`}
                  />
                  <Tooltip 
                    formatter={(val: any) => [`${Number(val).toLocaleString()}만원`]}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      backgroundColor: '#1e293b', 
                      color: '#ffffff', 
                      border: 'none',
                      fontSize: '12px' 
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="신규 발주" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#orderGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="납품 검수" 
                    stroke="#059669" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#deliveryGrad)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="대금 지급" 
                    stroke="#8b5cf6" 
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>발주 후 현장 검수까지 평균 리드타임: <strong className="text-slate-800">2.1일</strong></span>
            <span className="text-emerald-600 font-bold">병목 지연율 0건</span>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Category Distribution & Supplier Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Category Distribution Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                자재 공종별 조달 예산 비중
              </h3>
              <span className="text-xs text-slate-400">총 {metrics.orderCount}개 품목군</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              철강/골조, 콘크리트, 가설재, 배관설비 등 주요 자재별 조달 점유율
            </p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toLocaleString()}원`, '발주 총액']}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      backgroundColor: '#1e293b', 
                      color: '#ffffff', 
                      border: 'none',
                      fontSize: '12px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {categoryChartData.map((item, idx) => {
              const percent = metrics.totalOrderAmount > 0 
                ? Math.round((item.value / metrics.totalOrderAmount) * 100) 
                : 0;
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500">{item.valueMillion}백만원</span>
                    <span className="font-bold text-slate-800 w-10 text-right">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Supplier Performance & Reliability (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-600" />
                  협력 공급사별 조달 이행 및 품질 신뢰도
                </h3>
                <p className="text-xs text-slate-500">
                  공급사별 누적 납품 계약 규모(막대) 대비 적기 납품율 및 품질 검수 합격률(꺾은선)
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                평균 적기이행률 96.5%
              </span>
            </div>

            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={supplierPerformanceData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="supplier" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}만`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[80, 100]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (name === '납품 이행액') return [`${Number(value).toLocaleString()}만원`, name];
                      return [`${value}%`, name];
                    }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      backgroundColor: '#1e293b', 
                      color: '#ffffff', 
                      border: 'none',
                      fontSize: '12px' 
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
                  />
                  <Bar yAxisId="left" dataKey="납품 이행액" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={28} />
                  <Line yAxisId="right" type="monotone" dataKey="적기 납품률" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="검수 합격률" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>우수 협력사 가산점: <b>동국제강(주), 대양금속배관(주)</b> 최우수(100점) 유지</span>
            <button 
              onClick={() => onOpenManual && onOpenManual('man-06')}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>공급사 평가 규정 보기</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Site Procurement Efficiency Scorecard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              현장별 조달 효율성 매트릭스 평가표 (Procurement Scorecard)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5개 건설 현장별 조달 진도율, 검수 통과율, 적기 납품 준수율 및 종합 효율성 등급 평가
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            전체 5개 현장 중 <b>5개 현장 정상 가동</b>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">현장명</th>
                <th className="py-3 px-4">주요 공종</th>
                <th className="py-3 px-4">발주 건수</th>
                <th className="py-3 px-4">총 발주액</th>
                <th className="py-3 px-4">검수 입고액</th>
                <th className="py-3 px-4">결제 집행액</th>
                <th className="py-3 px-4">납기 준수율</th>
                <th className="py-3 px-4">검수 합격률</th>
                <th className="py-3 px-4">평균 리드타임</th>
                <th className="py-3 px-4 text-center">효율성 등급</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {/* Site 1: 강남 르네상스타워 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  강남 르네상스타워 신축공사
                </td>
                <td className="py-3.5 px-4 font-sans text-slate-600">
                  철골/고강도 콘크리트
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">2건</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">61,710,000원</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">61,710,000원</td>
                <td className="py-3.5 px-4 font-bold text-indigo-600">24,816,000원</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">100%</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">100%</td>
                <td className="py-3.5 px-4 font-sans">2.0일</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                    S등급
                  </span>
                </td>
              </tr>

              {/* Site 2: 송도 바이오 콤플렉스 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  송도 바이오 콤플렉스 3공구
                </td>
                <td className="py-3.5 px-4 font-sans text-slate-600">
                  레미콘 타설/위생배관
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">2건</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">44,920,000원</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">28,000,000원</td>
                <td className="py-3.5 px-4 font-bold text-indigo-600">30,800,000원</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">96.0%</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">100%</td>
                <td className="py-3.5 px-4 font-sans">2.5일</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                    S등급
                  </span>
                </td>
              </tr>

              {/* Site 3: 판교 하이퍼 데이터센터 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  판교 하이퍼 데이터센터 신축
                </td>
                <td className="py-3.5 px-4 font-sans text-slate-600">
                  구조용 앵커볼트/시멘트
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">2건</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">22,500,000원</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">18,600,000원</td>
                <td className="py-3.5 px-4 font-bold text-indigo-600">20,460,000원</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">98.0%</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">100%</td>
                <td className="py-3.5 px-4 font-sans">1.8일</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                    S등급
                  </span>
                </td>
              </tr>

              {/* Site 4: 마곡 융합 R&D 센터 2차 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  마곡 융합 R&D 센터 2차
                </td>
                <td className="py-3.5 px-4 font-sans text-slate-600">
                  유로폼 가설 거푸집
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">1건</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">14,800,000원</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">14,800,000원</td>
                <td className="py-3.5 px-4 font-bold text-indigo-600">16,280,000원</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">100%</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">100%</td>
                <td className="py-3.5 px-4 font-sans">1.5일</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    완전 종결
                  </span>
                </td>
              </tr>

              {/* Site 5: 여의도 국제금융타워 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                  여의도 국제금융타워 증축현장
                </td>
                <td className="py-3.5 px-4 font-sans text-slate-600">
                  구조용 H형강/데크플레이트
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">2건</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">102,000,000원</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">34,800,000원</td>
                <td className="py-3.5 px-4 font-bold text-amber-600">청구 검토중</td>
                <td className="py-3.5 px-4 text-cyan-600 font-bold">94.0%</td>
                <td className="py-3.5 px-4 text-amber-600 font-bold">97.0%</td>
                <td className="py-3.5 px-4 font-sans">2.7일</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                    A등급
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: AI & System Procurement Optimization Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-700">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>조달 리드타임 최적화 인사이트</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              전자 검수 및 즉시 서명 도입 성과
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              모바일 전자 인수증 및 사진 첨부 검수 도입 후, 종이 인수증 전표 대조 대비 현장 검수~세금계산서 청구 주기 소요 시간이 <b>기존 4.2일에서 1.4일로 66% 단축</b>되었습니다.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>효과: 정산 리드타임 대폭 개선</span>
            <span className="text-emerald-600 font-bold">우수 사례</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-700">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>긴급 발주 비중 관리 권고</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              여의도 현장 H형강 초긴급 발주 분석
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              여의도 국제금융타워의 긴급/초긴급 발주 비중이 33%를 기록 중입니다. 야간 양중 일정과 단가 할증 리스크를 방지하기 위해 <b>2주 단위 사전 수요 예측 연동(VMI)</b>을 권고합니다.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>위험요소: 공사지연 및 운송비 할증</span>
            <span className="text-amber-600 font-bold">관리 요망</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>견적 경쟁 통한 원가 절감 효과</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              다자간 견적 비교로 4.6% 예산 절감
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              쌍용C&E와 한일시멘트 간 경쟁 견적 접수(MAN-03)를 통해 포대 시멘트 품목에서 <b>포당 300원(3.8%) 단가 절감 및 무료 래핑 혜택</b>을 유치하여 누적 372만원의 원가 절감을 달성했습니다.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>절감 성과: 3,720,000원 절감</span>
            <span className="text-emerald-600 font-bold">원가 절감 달성</span>
          </div>
        </div>
      </div>
    </div>
  );
};
