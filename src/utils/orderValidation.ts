// Order Form Auto-Validation & Correction Engine

export interface MaterialStandard {
  id: string;
  name: string;
  category: string;
  standardUnit: string;
  allowedUnits: string[];
  recommendedSpec: string;
  defaultPrice: number;
  minQty: number;
  leadTimeDays: number;
}

// Master Standard Material Catalog
export const STANDARD_MATERIALS: MaterialStandard[] = [
  {
    id: 'MAT-STL-01',
    name: '고장력 철근 SD400 D25',
    category: '철강/골조자재',
    standardUnit: '톤(TON)',
    allowedUnits: ['톤(TON)', '본'],
    recommendedSpec: 'KSD 3504 규격, 고장력 이형철근 SD400, 8.0m 정척',
    defaultPrice: 870000,
    minQty: 10,
    leadTimeDays: 2
  },
  {
    id: 'MAT-STL-02',
    name: '고장력 철근 SD400 D19',
    category: '철강/골조자재',
    standardUnit: '톤(TON)',
    allowedUnits: ['톤(TON)', '본'],
    recommendedSpec: 'KSD 3504 규격, 직경 19mm, 8.0m 정척 배근용',
    defaultPrice: 860000,
    minQty: 10,
    leadTimeDays: 2
  },
  {
    id: 'MAT-STL-03',
    name: '구조용 H형강 400x400',
    category: '철강/골조자재',
    standardUnit: '톤(TON)',
    allowedUnits: ['톤(TON)', '본'],
    recommendedSpec: 'KSD 3503 / SHN460 내진 압연 H형강 H-400x400x13x21',
    defaultPrice: 1150000,
    minQty: 5,
    leadTimeDays: 3
  },
  {
    id: 'MAT-CON-01',
    name: '레미콘 25-270-18 (고강도 콘크리트)',
    category: '콘크리트/골재',
    standardUnit: 'm³',
    allowedUnits: ['m³'],
    recommendedSpec: 'KS F 4009 규격, 굵은골재 25mm, 호칭강도 27MPa, 슬럼프 180mm',
    defaultPrice: 94000,
    minQty: 6,
    leadTimeDays: 1
  },
  {
    id: 'MAT-CON-02',
    name: '레미콘 25-240-15 (보통 콘크리트)',
    category: '콘크리트/골재',
    standardUnit: 'm³',
    allowedUnits: ['m³'],
    recommendedSpec: 'KS F 4009 규격, 굵은골재 25mm, 호칭강도 24MPa, 슬럼프 150mm',
    defaultPrice: 89000,
    minQty: 6,
    leadTimeDays: 1
  },
  {
    id: 'MAT-CEM-01',
    name: '포틀랜드 1종 보통 시멘트 40kg',
    category: '시멘트/혼화재',
    standardUnit: '포',
    allowedUnits: ['포', '톤(TON)'],
    recommendedSpec: 'KS L 5201 1종 보통 포틀랜드 시멘트 40kg 지대포장, 방수 래핑',
    defaultPrice: 7800,
    minQty: 50,
    leadTimeDays: 1
  },
  {
    id: 'MAT-WOD-01',
    name: '유로폼 가설 거푸집 12T',
    category: '가설/목재자재',
    standardUnit: '매',
    allowedUnits: ['매', 'm²'],
    recommendedSpec: 'KS F 3110 고내구성 코팅합판 12T, 스틸프레임 600x1200mm',
    defaultPrice: 18500,
    minQty: 100,
    leadTimeDays: 2
  },
  {
    id: 'MAT-PIP-01',
    name: '위생배관용 스테인리스 파이프 STS304',
    category: '전기/설비 배관재',
    standardUnit: '본',
    allowedUnits: ['본', 'm'],
    recommendedSpec: 'KS D 3576 Sch 10S 100A 직경 114.3mm x 6.0m 정척',
    defaultPrice: 175000,
    minQty: 20,
    leadTimeDays: 3
  },
  {
    id: 'MAT-BLT-01',
    name: '구조용 고장력 볼트 세트 M24',
    category: '철강/골조자재',
    standardUnit: '세트',
    allowedUnits: ['세트'],
    recommendedSpec: 'KS B 1010 F10T 고장력볼트 M24x80L (너트1, 와셔2 포함)',
    defaultPrice: 15500,
    minQty: 200,
    leadTimeDays: 2
  }
];

// Ambiguous words dictionary
export const AMBIGUOUS_WORDS = [
  '좋은 거', '좋은거', '품질 좋은 것', '최고급', '기본', '표준', '알아서', '상동', 
  '전과 동일', '동일 규격', '적당한 크기', '적당히', '대충', '아무거나', '보통', 
  '현장', '근처', '서울', '본사', '앞마당', '도착후 전화', '미정', '추후 통보', 
  '빨리', '아무때나', '내일쯤', '급함', '최대한 빨리', '다음주'
];

export interface ValidationIssue {
  field: 'materialId' | 'quantity' | 'unit' | 'requestedDeliveryDate' | 'deliveryAddress' | 'specification';
  fieldNameKorean: string;
  type: 'ERROR' | 'WARNING';
  reason: string;
  currentValue: string;
  suggestedValue: string;
  suggestedActionName: string;
}

export interface ValidationReport {
  isValid: boolean;
  score: number; // 0 to 100
  issues: ValidationIssue[];
  passedFields: string[];
}

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addLocalDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

const SAME_DAY_BUFFER_DAYS = 3;

// Check Order Form Fields
export function validateOrderForm(data: {
  materialId?: string;
  materialName: string;
  quantity: number;
  unit: string;
  requestedDeliveryDate: string;
  deliveryAddress: string;
  specification: string;
  siteName: string;
}, options?: { now?: Date }): ValidationReport {
  const issues: ValidationIssue[] = [];
  const passedFields: string[] = [];

  // Match closest standard material
  const matchedMat = STANDARD_MATERIALS.find(
    (m) =>
      (data.materialId && m.id === data.materialId) ||
      data.materialName.toLowerCase().includes(m.name.slice(0, 4).toLowerCase()) ||
      m.name.toLowerCase().includes(data.materialName.slice(0, 4).toLowerCase())
  ) || STANDARD_MATERIALS[0];

  // 1. 품목 ID (materialId) Check
  if (!data.materialId || !data.materialId.trim()) {
    issues.push({
      field: 'materialId',
      fieldNameKorean: '품목 ID',
      type: 'ERROR',
      reason: '표준 자재 품목 식별 코드(Item Code)가 누락되었습니다.',
      currentValue: '(미지정)',
      suggestedValue: matchedMat.id,
      suggestedActionName: `${matchedMat.id} 자동 매핑`
    });
  } else if (!/^MAT-[A-Z]{3}-\d{2,3}$/.test(data.materialId.trim())) {
    issues.push({
      field: 'materialId',
      fieldNameKorean: '품목 ID',
      type: 'WARNING',
      reason: '국토부 CPMS 표준 자재 식별 코드 형식(MAT-XXX-00)과 다릅니다.',
      currentValue: data.materialId,
      suggestedValue: matchedMat.id,
      suggestedActionName: `${matchedMat.id} 표준 코드로 정규화`
    });
  } else {
    passedFields.push('materialId');
  }

  // 2. 수량 (quantity) Check
  if (!data.quantity || isNaN(Number(data.quantity)) || Number(data.quantity) <= 0) {
    issues.push({
      field: 'quantity',
      fieldNameKorean: '수량',
      type: 'ERROR',
      reason: '수량이 누락되었거나 0 이하의 잘못된 숫자입니다.',
      currentValue: String(data.quantity || 0),
      suggestedValue: String(matchedMat.minQty),
      suggestedActionName: `표준 최소 발주량(${matchedMat.minQty}) 설정`
    });
  } else if (matchedMat && Number(data.quantity) < matchedMat.minQty) {
    issues.push({
      field: 'quantity',
      fieldNameKorean: '수량',
      type: 'WARNING',
      reason: `해당 품목의 최소 주문 단위(MOQ ${matchedMat.minQty} ${matchedMat.standardUnit}) 미달로 운송 배차 지연이 발생할 수 있습니다.`,
      currentValue: `${data.quantity} ${data.unit}`,
      suggestedValue: String(matchedMat.minQty),
      suggestedActionName: `최소 출하 단위(${matchedMat.minQty} ${matchedMat.standardUnit})로 보정`
    });
  } else {
    passedFields.push('quantity');
  }

  // 3. 단위 (unit) Check
  const trimmedUnit = data.unit ? data.unit.trim() : '';
  const isVagueUnit = ['개', '박스', '대충', '묶음', '통', '개입', 'box'].includes(trimmedUnit.toLowerCase());
  
  if (!trimmedUnit) {
    issues.push({
      field: 'unit',
      fieldNameKorean: '단위',
      type: 'ERROR',
      reason: '조달 발주 기본 거래 단위가 누락되었습니다.',
      currentValue: '(누락)',
      suggestedValue: matchedMat.standardUnit,
      suggestedActionName: `표준 단위(${matchedMat.standardUnit}) 지정`
    });
  } else if (isVagueUnit) {
    issues.push({
      field: 'unit',
      fieldNameKorean: '단위',
      type: 'ERROR',
      reason: `'${trimmedUnit}'는 모호한 일반 포장 단위입니다. KS 표준 거래 단위(${matchedMat.standardUnit})를 사용해야 검수가 가능합니다.`,
      currentValue: trimmedUnit,
      suggestedValue: matchedMat.standardUnit,
      suggestedActionName: `공인 단위(${matchedMat.standardUnit})로 변경`
    });
  } else if (matchedMat && !matchedMat.allowedUnits.includes(trimmedUnit)) {
    issues.push({
      field: 'unit',
      fieldNameKorean: '단위',
      type: 'ERROR',
      reason: `${matchedMat.name} 품목에는 '${trimmedUnit}' 단위를 사용할 수 없습니다. (허용 단위: ${matchedMat.allowedUnits.join(', ')})`,
      currentValue: trimmedUnit,
      suggestedValue: matchedMat.standardUnit,
      suggestedActionName: `올바른 단위(${matchedMat.standardUnit})로 자동 교정`
    });
  } else {
    passedFields.push('unit');
  }

  // 4. 납기 희망일 (requestedDeliveryDate) Check
  const dateStr = data.requestedDeliveryDate ? data.requestedDeliveryDate.trim() : '';
  const now = options?.now ?? new Date();
  const todayStr = toLocalIsoDate(now);
  const leadDays = Math.max(matchedMat.leadTimeDays, 1);
  const suggestedFromLead = toLocalIsoDate(addLocalDays(now, leadDays));
  const suggestedFromBuffer = toLocalIsoDate(addLocalDays(now, SAME_DAY_BUFFER_DAYS));

  if (!dateStr) {
    issues.push({
      field: 'requestedDeliveryDate',
      fieldNameKorean: '희망일',
      type: 'ERROR',
      reason: '자재 현장 반입 납기 희망 일자가 누락되었습니다.',
      currentValue: '(누락)',
      suggestedValue: suggestedFromLead,
      suggestedActionName: `적정 리드타임 납기일(${suggestedFromLead}) 지정`
    });
  } else if (dateStr < todayStr) {
    issues.push({
      field: 'requestedDeliveryDate',
      fieldNameKorean: '희망일',
      type: 'ERROR',
      reason: `납기 희망일(${dateStr})이 현재 일자(${todayStr})보다 과거입니다.`,
      currentValue: dateStr,
      suggestedValue: suggestedFromLead,
      suggestedActionName: `유효한 반입일(${suggestedFromLead})로 변경`
    });
  } else if (dateStr === todayStr) {
    issues.push({
      field: 'requestedDeliveryDate',
      fieldNameKorean: '희망일',
      type: 'WARNING',
      reason: '당일 반입은 초긴급(EMERGENCY) 배차 승인과 현장 타설/양중 크레인 우선 배정이 요구됩니다.',
      currentValue: dateStr,
      suggestedValue: suggestedFromBuffer,
      suggestedActionName: `안전 납기 버퍼 적용(${suggestedFromBuffer})`
    });
  } else {
    passedFields.push('requestedDeliveryDate');
  }

  // 5. 배송 위치 (deliveryAddress) Check
  const addr = data.deliveryAddress ? data.deliveryAddress.trim() : '';
  const isVagueAddr = !addr || 
    addr.length < 5 ||
    ['현장', '알아서', '근처', '서울', '본사', '앞마당', '도착후 전화', '상동', '미정', '아무데나'].some((w) => addr === w || (addr.length < 10 && addr.includes(w)));
  
  const hasSpecificGate = addr.includes('게이트') || addr.includes('문') || addr.includes('하역') || addr.includes('야적') || addr.includes('타설') || addr.includes('구역');

  if (!addr) {
    issues.push({
      field: 'deliveryAddress',
      fieldNameKorean: '배송 위치',
      type: 'ERROR',
      reason: '반입 현장 주소 및 하역 위치가 누락되었습니다.',
      currentValue: '(누락)',
      suggestedValue: getStandardAddressForSite(data.siteName),
      suggestedActionName: '현장 표준 하역장 주소 자동 완성'
    });
  } else if (isVagueAddr || !hasSpecificGate) {
    issues.push({
      field: 'deliveryAddress',
      fieldNameKorean: '배송 위치',
      type: 'ERROR',
      reason: `'${addr}' 표현은 모호합니다. 덤프/트레일러 진입 게이트 번호 및 하역·양중 구역이 명시되어야 합니다.`,
      currentValue: addr,
      suggestedValue: getStandardAddressForSite(data.siteName),
      suggestedActionName: '정밀 하역 구역 표준 주소로 교정'
    });
  } else {
    passedFields.push('deliveryAddress');
  }

  // 6. 규격 (specification) Check
  const spec = data.specification ? data.specification.trim() : '';
  const isVagueSpec = !spec ||
    spec.length < 4 ||
    ['좋은 거', '좋은거', '품질 좋은 것', '최고급', '기본', '표준', '알아서', '상동', '전과 동일', '동일 규격', '적당한 크기', '아무거나', '보통', '대충'].some((w) => spec === w || spec.includes(w));

  if (!spec) {
    issues.push({
      field: 'specification',
      fieldNameKorean: '규격',
      type: 'ERROR',
      reason: '자재 상세 물리/화학적 품질 규격이 누락되었습니다.',
      currentValue: '(누락)',
      suggestedValue: matchedMat.recommendedSpec,
      suggestedActionName: '공인 KS 표준 시방 규격 적용'
    });
  } else if (isVagueSpec) {
    issues.push({
      field: 'specification',
      fieldNameKorean: '규격',
      type: 'ERROR',
      reason: `'${spec}'는 모호한 구어체 표현입니다. 구조감리 승인용 한국산업표준(KS) 규격 문구로 대체해야 합니다.`,
      currentValue: spec,
      suggestedValue: matchedMat.recommendedSpec,
      suggestedActionName: '공인 KS 표준 시방 규격으로 정밀 치환'
    });
  } else {
    passedFields.push('specification');
  }

  // Calculate score
  const errorCount = issues.filter((i) => i.type === 'ERROR').length;
  const warningCount = issues.filter((i) => i.type === 'WARNING').length;
  const score = Math.max(0, 100 - (errorCount * 20 + warningCount * 8));
  const isValid = errorCount === 0;

  return {
    isValid,
    score,
    issues,
    passedFields
  };
}

export function getStandardAddressForSite(siteName: string): string {
  if (siteName.includes('강남')) {
    return '서울 강남구 테헤란로 152 신축공사 현장 서문 2번 게이트 (지하 2층 코어부 하역장)';
  }
  if (siteName.includes('송도')) {
    return '인천 연수구 송도동 214-1 바이오단지 3공구 북문 화물게이트 (클린룸 설비동 야적장)';
  }
  if (siteName.includes('판교')) {
    return '경기 성남시 분당구 삼평동 680 판교테크노밸리 C-2블록 남문 1호 게이트 (기초 기계실 양중부)';
  }
  if (siteName.includes('마곡')) {
    return '서울 강서구 마곡동 727-1 융합 R&D센터 2차 동문 게이트 (지상 자재 적재장)';
  }
  if (siteName.includes('여의도')) {
    return '서울 영등포구 여의도동 34-1 국제금융타워 증축 현장 3번 게이트 (타워크레인 2호기 하역구역)';
  }
  return '현장 지정 반입 게이트 번호 및 지상 크레인 하역장';
}
