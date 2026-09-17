import { ManualSection } from '../types';

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'man-01',
    code: 'MAN-01',
    title: '시스템 개요 및 엔드-투-엔드 조달 프로세스',
    category: 'OVERVIEW',
    targetRole: 'ALL',
    badge: '공통 / 기본 개요',
    summary: '건설 산업 조달 관리 시스템의 목적, 주요 참여 주체(현장 관리자 vs 공급업체), 그리고 발주부터 대금 지급까지의 전체 7단계 라이프사이클을 안내합니다.',
    prerequisites: [
      '시스템 접근 계정 (현장 관리자 권한 또는 자재 공급업체 사업자 번호 등록 계정)',
      '해당 공구/현장(Site) 코드 지정'
    ],
    steps: [
      {
        stepNumber: 1,
        title: '현장 자재 소요 파악 및 발주(Order) 등록',
        description: '현장소장 또는 공무담당자가 공정 계획에 맞춰 필요한 규격, 수량, 납기일을 지정하여 발주 신청서를 작성합니다.',
        actionDetail: '상단 메뉴 [현장 관리자] → [신규 발주 신청]에서 공종, 규격, 수량 입력 후 제출'
      },
      {
        stepNumber: 2,
        title: '공급사 견적(Quotation) 접수 및 비교 채택',
        description: '등록된 발주 건에 대해 협력 공급업체가 납기 가능 일자와 제안 단가를 회신하면, 현장에서 최적 조건을 승인합니다.',
        actionDetail: '상단 메뉴 [공급업체] → [견적서 제출] 및 [현장 관리자] → [견적 채택 승인]'
      },
      {
        stepNumber: 3,
        title: '발주 최종 승인 및 계약 확정',
        description: '예산 범위 내에서 발주가 승인되면 공급사에게 정식 출하 지시가 전달됩니다.',
        actionDetail: '상태가 "발주 승인(APPROVED)"으로 변경되며 공급사에 알림 발송'
      },
      {
        stepNumber: 4,
        title: '자재 출하 및 배송(Delivery) 정보 등록',
        description: '공급업체는 출하 시 운송 차량번호, 기사 연락처, 예상 도착 시간을 입력하여 실시간 추적을 개시합니다.',
        actionDetail: '[공급업체] → [배송/출하 관리] → [신규 배송 등록]'
      },
      {
        stepNumber: 5,
        title: '현장 자재 도착 및 품질/수량 검수(Inspection)',
        description: '현장 자재 반입 시 현장 기사가 실물 수량, 시험성적서 및 외관 손상을 검수하고 전자 서명합니다.',
        actionDetail: '[현장 관리자] → [배송/검수] → [검수 완료 및 인수증 서명]'
      },
      {
        stepNumber: 6,
        title: '전자세금계산서/송장(Invoice) 발행',
        description: '검수 완료된 자재에 대해 공급업체가 청구 공급가액과 부가세를 명시한 송장을 발행합니다.',
        actionDetail: '[공급업체] → [송장 관리] → [신규 송장 발행]'
      },
      {
        stepNumber: 7,
        title: '대금 지급 결제(Payment) 및 정산 종결',
        description: '현장 경리 및 본사 회계팀에서 송장 내역을 검토한 후 지정 계좌로 송금 처리하여 발주를 최종 종결합니다.',
        actionDetail: '[현장 관리자] → [대금 결제] → [지급 완료 처리]'
      }
    ],
    cautions: [
      '발주 승인 전 공급업체가 임의 출하한 자재는 현장 반입이 거부될 수 있습니다.',
      '검수 결과가 "불합격(FAIL)"인 경우 즉시 회수 요청 및 재배송 절차를 진행해야 합니다.'
    ],
    tips: [
      '우측 상단의 역할 전환 버튼(현장 관리자 ↔ 공급업체)을 통해 각 사용자 관점의 화면을 즉시 체험할 수 있습니다.',
      '모든 화면 상단의 "이 화면 매뉴얼" 버튼을 누르면 해당 기능의 가이드가 즉시 열립니다.'
    ],
    relatedScreen: '전체 화면 공통'
  },
  {
    id: 'man-02',
    code: 'MAN-02',
    title: '[현장관리자] 발주신청서 양식 정밀 체크 및 4단계 발주요청 프로세스',
    category: 'SITE_MANAGER',
    targetRole: 'SITE_MANAGER',
    badge: '현장 관리자 / 발주 양식 체크 및 등록',
    summary: '국토교통부 CPMS 표준 발주신청서 양식에 맞추어 6대 핵심 항목(품목 ID, 수량, 단위, 희망일, 배송 위치, 규격)의 누락, 모호한 표현, 단위 오류를 사전에 감지하고 [자동 체크 ➔ 스마트 수정 ➔ 사전 검수 ➔ 발주요청] 4단계 순서로 등록을 종결합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '1단계: 자동 체크 (Auto Check & Validation)',
        description: '발주신청서 6대 필수 항목(품목 ID, 수량, 단위, 희망일, 배송 위치, 규격)을 실시간으로 전수 검사하여 누락된 값, 모호한 구어체 표현(예: "좋은 거", "현장 알아서"), 품목별 잘못된 거래 단위(예: 레미콘에 "개" 또는 "kg" 표기)를 자동 식별합니다.',
        actionDetail: '신규 발주 모달에서 1단계 실시간 진단 상태 및 적합도 점수를 확인합니다. "모호한 표현 테스트용 샘플"을 통해 결함 감지 엔진을 시험할 수 있습니다.'
      },
      {
        stepNumber: 2,
        title: '2단계: 스마트 수정 (Smart Correction & Auto-Fix)',
        description: '감지된 결함에 대해 한국산업표준(KS) 및 현장 시방 규정 기반의 권장값으로 "원클릭 일괄 자동 교정" 또는 개별 항목별 추천값 적용을 실행합니다.',
        actionDetail: '품목 ID 코드 부여(MAT-XXX), 공인 규격 단위 치환(m³, 톤, 포 등), 반입 게이트 번호 자동 완성, KS 상세 규격(강도, 슬럼프 등)을 표준화합니다.'
      },
      {
        stepNumber: 3,
        title: '3단계: 사전 적합성 검수 (Pre-flight Inspection)',
        description: '수정 완료된 6대 항목이 100점 만점으로 적합 판정을 받았는지 종합 검수표를 통해 최종 확인하고, 현장 공무담당자 확인 서명 체크박스를 승인합니다.',
        actionDetail: '6대 항목 체크리스트 녹색 승인 뱃지 확인 후 [검수 책임자 확인]에 체크하여 4단계 발주요청 권한을 활성화합니다.'
      },
      {
        stepNumber: 4,
        title: '4단계: 발주신청서 발주요청 (Submit Order Request)',
        description: '공식 전자 발주신청서(PO) 미리보기를 통해 공급가액, 공급업체, 우선순위를 최종 대조하고 공급업체 견적 접수 시스템으로 정식 전송합니다.',
        actionDetail: '[발주신청서 전송 및 발주요청 완료]를 클릭하면 발주 번호가 부여되며 실시간 파이프라인에 등록됩니다.'
      }
    ],
    cautions: [
      '단위 오류 주의: 레미콘은 반드시 "m³", 철근/형강은 "톤(TON)", 시멘트는 "포", 거푸집은 "매" 단위를 준수해야 합니다.',
      '배송 위치는 단순 "현장" 또는 "서울" 표기를 금지하며, 반드시 [반입 게이트 번호 + 하역 및 양중 구역]을 명시해야 배차 거부를 방지할 수 있습니다.',
      '희망일은 현재 일자 이전(과거 일자)을 지정할 수 없으며, 당일 긴급 반입 시 초긴급(EMERGENCY) 승인 절차가 수반됩니다.'
    ],
    tips: [
      '모달 상단의 [🧪 모호한 표현/틀린 단위 테스트용 샘플 불러오기]를 클릭하면 시스템의 실시간 누락 감지 및 원클릭 자동 교정 프로세스를 즉시 시뮬레이션할 수 있습니다.',
      'KS 표준 자재 프리셋 버튼(철근, 레미콘, 시멘트, H형강)을 활용하면 6대 항목이 사전에 완벽히 검증된 상태로 신속 발주가 가능합니다.'
    ],
    relatedScreen: '현장관리자 > 발주 관리 > 신규 발주'
  },
  {
    id: 'man-03',
    code: 'MAN-03',
    title: '[현장관리자] 견적서(Quotation) 비교 분석 및 발주 승인 절차',
    category: 'SITE_MANAGER',
    targetRole: 'SITE_MANAGER',
    badge: '현장 관리자 / 견적 및 승인',
    summary: '등록된 발주 요청에 대해 복수의 공급업체로부터 접수된 견적(제안 단가, 납기 리드타임, 공급 조건)을 다각도로 비교 검토하여 최적 업체를 선정하고 최종 발주를 승인합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '발주 목록에서 견적 접수 건 확인',
        description: '상태가 "견적 접수됨(QUOTED)"인 발주 항목을 클릭하여 상세 모달창을 엽니다.',
        actionDetail: '해당 발주 건에 제출된 공급사들의 견적 금액과 리드타임 목록을 조회합니다.'
      },
      {
        stepNumber: 2,
        title: '견적 조건 비교 (단가 vs 납기)',
        description: '최저가 제안뿐만 아니라 공사 크리티컬 패스에 지장을 주지 않는 납기 준수 가능 여부를 종합 평가합니다.',
        actionDetail: '단가 절감률(%)과 제안 납기일을 확인합니다.'
      },
      {
        stepNumber: 3,
        title: '최적 견적 채택 및 발주 승인(Approve)',
        description: '선정된 업체의 [견적 채택 및 발주 승인] 버튼을 누르면 상태가 즉시 [발주 승인(APPROVED)]으로 변경됩니다.',
        actionDetail: '승인 확인 팝업에서 승인 사유를 확인하고 확정합니다.'
      }
    ],
    cautions: [
      '유효기간(Valid Until)이 지난 견적서는 채택이 불가능하며, 재견적을 요청해야 합니다.'
    ],
    relatedScreen: '현장관리자 > 발주 관리 > 발주 요약/상세'
  },
  {
    id: 'man-04',
    code: 'MAN-04',
    title: '[현장관리자] 현장 반입 자재 검수(Inspection) 및 전자 인수증 서명',
    category: 'SITE_MANAGER',
    targetRole: 'SITE_MANAGER',
    badge: '현장 관리자 / 입고 검수',
    summary: '공급업체로부터 자재가 현장에 도착했을 때, 품질 성적서 확인, 수량 계량표 대조, 외관 손상 검사를 진행한 뒤 전자 서명으로 납품을 최종 승인하는 절차입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '도착 자재 운송 정보 확인',
        description: '배송 목록에서 도착한 차량번호(예: 경기88바5678)와 자재 송장을 확인합니다.',
        actionDetail: '[배송/검수 현황] 탭에서 해당 배송 건의 [검수하기] 버튼을 클릭합니다.'
      },
      {
        stepNumber: 2,
        title: '품질 및 실물 수량 정밀 검수',
        description: '공장 출하 송장의 수량과 실제 반입 물량을 대조하고 규격 일치 여부를 육안 및 계측 검사합니다.',
        actionDetail: '검수 결과 항목에서 [합격(PASS)] / [조건부 합격] / [불합격(FAIL)]을 체크합니다.'
      },
      {
        stepNumber: 3,
        title: '현장 인수자 서명 및 검수 의견 저장',
        description: '검수자 성명 입력 및 전자 인수증에 서명(또는 검수자 확인 서명 입력) 후 [검수 완료 처리]를 실행합니다.',
        actionDetail: '검수 완료 시 상태가 [검수 완료/DELIVERED]로 변경되며 공급업체에 송장 발행 권한이 부여됩니다.'
      }
    ],
    cautions: [
      '철근 반입 시 밀시트(Mill Sheet, 품질보증서) 및 인장강도 시험성적서 미지참 시 불합격 처리해야 합니다.',
      '수량 부족 발견 시 반드시 검수 의견란에 실측 수량을 명기하여 정산 시 차감 반영되도록 해야 합니다.'
    ],
    relatedScreen: '현장관리자 > 배송/입고 검수'
  },
  {
    id: 'man-05',
    code: 'MAN-05',
    title: '[현장관리자] 송장(Invoice) 검토 및 대금 결제(Payment) 승인',
    category: 'SITE_MANAGER',
    targetRole: 'SITE_MANAGER',
    badge: '현장 관리자 / 대금 결제',
    summary: '공급업체가 청구한 전자세금계산서/송장의 공급가액과 부가세를 검수 완료 내역과 일치하는지 확인하고, 법인계좌 이체/전자어음 결제를 실행합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '청구 송장 목록 조회 및 대조',
        description: '미결제 상태인 청구 송장을 열람하여 검수 완료된 물량 및 계약 단가와 계산서 금액이 일치하는지 대조합니다.',
        actionDetail: '[대금 결제 관리]에서 청구 금액 및 지급 기한(Due Date)을 확인합니다.'
      },
      {
        stepNumber: 2,
        title: '결제 수단 선택 및 입금 계좌 확인',
        description: '지급 조건(계좌이체 / 전자어음 / 법인카드)을 선택하고 공급업체의 등록 은행 및 계좌번호를 확인합니다.',
        actionDetail: '결제 수단 드롭다운에서 결제 방식을 선택합니다.'
      },
      {
        stepNumber: 3,
        title: '결제 승인 및 정산 종결',
        description: '[결제 승인 및 송금 완료] 버튼을 클릭하면 송장 상태가 [결제 완료(PAID)]로 전환되고 정산 번호가 생성됩니다.',
        actionDetail: '관련 발주 항목의 전체 프로세스가 [종결(COMPLETED)] 상태로 자동 마감됩니다.'
      }
    ],
    relatedScreen: '현장관리자 > 대금 결제 관리'
  },
  {
    id: 'man-06',
    code: 'MAN-06',
    title: '[공급업체] 신규 발주 접수 및 견적서(Quotation) 작성/제출',
    category: 'SUPPLIER',
    targetRole: 'SUPPLIER',
    badge: '공급업체 / 견적 작성',
    summary: '건설 현장에서 요청된 자재 발주 건을 실시간으로 확인하고, 보유 재고와 생산 일정을 고려하여 경쟁력 있는 제안 단가 및 납기 리드타임을 작성하여 견적서를 제출합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '견적 요청 발주 건 검색 및 상세 검토',
        description: '공급업체 대시보드에서 견적 제출이 가능한 발주 목록을 확인합니다.',
        actionDetail: '[견적 관리] 탭에서 상태가 [대기중(PENDING)]인 발주를 클릭하여 규격 및 필요 수량을 확인합니다.'
      },
      {
        stepNumber: 2,
        title: '제안 단가 및 납기 일수(Lead Time) 산정',
        description: '현재 원자재 시세 및 운반비를 반영한 단위당 공급 단가와 납기 소요 일수를 산정합니다.',
        actionDetail: '제안 단가(원/단위)를 입력하면 총액이 자동으로 계산됩니다.'
      },
      {
        stepNumber: 3,
        title: '견적 유효기간 및 특약사항 기재 후 제출',
        description: '견적서의 유효기간(통상 7일~14일)과 하역 조건, 포장 상태 등의 비고 사항을 입력하고 제출합니다.',
        actionDetail: '[견적서 제출] 버튼을 누르면 발주 상태가 [견적 접수됨(QUOTED)]으로 즉시 갱신됩니다.'
      }
    ],
    cautions: [
      '원자재 시세 급변동 위험이 있는 철강/유류 자재는 유효기간을 7일 이내로 설정할 것을 권장합니다.'
    ],
    relatedScreen: '공급업체 > 견적 관리 > 견적서 제출'
  },
  {
    id: 'man-07',
    code: 'MAN-07',
    title: '[공급업체] 승인 발주건 출하 등록 및 배송(Delivery) 배차 관리',
    category: 'SUPPLIER',
    targetRole: 'SUPPLIER',
    badge: '공급업체 / 출하 및 배송',
    summary: '현장에서 승인된 발주 건에 대해 공장/창고에서 출하를 진행하고, 운송 기사 정보와 차량 번호, 출하 시간을 시스템에 등록하여 현장에 실시간 도착 정보를 제공합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '승인된 발주 확인',
        description: '[배송/출하 관리] 탭에서 상태가 [발주 승인(APPROVED)]인 건을 선택합니다.',
        actionDetail: '우측 상단의 [신규 배송/출하 등록] 버튼을 클릭합니다.'
      },
      {
        stepNumber: 2,
        title: '배차 정보 및 운송 기사 연락처 입력',
        description: '자재를 적재한 화물차량 번호(예: 서울82아1234)와 담당 기사 성명, 휴대폰 번호를 기재합니다.',
        actionDetail: '운송 기사에게 현장 게이트 진입 시 유의사항을 사전에 전파합니다.'
      },
      {
        stepNumber: 3,
        title: '출하 등록 및 배송 추적 개시',
        description: '[출하 등록 완료]를 누르면 배송 번호(DEL-xxx)가 생성되고 상태가 [배송중(IN_DELIVERY)]으로 전환됩니다.',
        actionDetail: '현장 관리자 화면에 해당 차량 정보와 예상 도착 시간이 실시간 노출됩니다.'
      }
    ],
    cautions: [
      '현장 교통 혼잡 시간대(출퇴근 및 레미콘 집중 타설 시간대)를 피해 배차 일정을 조율해야 합니다.'
    ],
    relatedScreen: '공급업체 > 배송/출하 관리 > 신규 출하'
  },
  {
    id: 'man-08',
    code: 'MAN-08',
    title: '[공급업체] 전자세금계산서/송장(Invoice) 발행 및 대금 청구',
    category: 'SUPPLIER',
    targetRole: 'SUPPLIER',
    badge: '공급업체 / 송장 청구',
    summary: '현장에서 검수가 완료된 자재에 대하여 국세청 전자세금계산서 양식에 준하는 송장을 발행하고, 입금받을 사업자 통장 계좌를 지정하여 대금을 정식 청구합니다.',
    steps: [
      {
        stepNumber: 1,
        title: '검수 완료 건 선택',
        description: '[송장/계산서 관리] 탭에서 자재 검수가 통과된 건(DELIVERED)을 확인합니다.',
        actionDetail: '[신규 송장 발행] 버튼을 클릭합니다.'
      },
      {
        stepNumber: 2,
        title: '공급가액 및 부가세 자동 검산',
        description: '납품 수량 x 단가로 계산된 공급가액에 부가가치세 10%가 자동 가산되어 총 청구 금액이 산출됩니다.',
        actionDetail: '지급 기한(통상 마감일 기준 익월 말일 등)을 설정합니다.'
      },
      {
        stepNumber: 3,
        title: '수금 전용 계좌 입력 후 발행 확정',
        description: '공급업체의 은행명, 계좌번호, 예금주를 정확히 기재하고 [송장 청구 발행]을 완료합니다.',
        actionDetail: '현장 관리자에게 결제 대기 상태로 즉시 인계됩니다.'
      }
    ],
    relatedScreen: '공급업체 > 송장/계산서 관리 > 신규 송장'
  },
  {
    id: 'man-09',
    code: 'MAN-09',
    title: '[공급업체] 대금 수금(Payment) 확인 및 월별 거래 정산 마감',
    category: 'SUPPLIER',
    targetRole: 'SUPPLIER',
    badge: '공급업체 / 수금 관리',
    summary: '현장에서 송금 처리된 대금의 입금 내역을 확인하고, 미수금 현황과 월별 자재 납품 거래 내역을 결산하는 방법입니다.',
    steps: [
      {
        stepNumber: 1,
        title: '수금 현황 대시보드 조회',
        description: '[수금/정산 관리] 탭에서 총 청구액, 입금 완료액, 미수 잔액을 실시간으로 확인합니다.',
        actionDetail: '결제 상태가 [결제 완료(PAID)]인 내역의 결제 번호와 입금일자를 조회합니다.'
      },
      {
        stepNumber: 2,
        title: '입금액과 세금계산서 청구액 대조',
        description: '실제 통장 입금액과 시스템 송장 금액 간에 단수 차이 및 수수료 공제 내역이 있는지 대조 확인합니다.',
        actionDetail: '차액 발생 시 현장 담당자에게 확인 요청을 전달합니다.'
      }
    ],
    relatedScreen: '공급업체 > 수금/정산 관리'
  },
  {
    id: 'man-10',
    code: 'MAN-10',
    title: '[규정 및 지침] 자재 조달 승인 규정, 긴급 발주 및 반품 처리 기준',
    category: 'REGULATIONS',
    targetRole: 'ALL',
    badge: '규정 / 표준 지침',
    summary: '건설 자재 조달 시 준수해야 하는 결재 전결 규정, 긴급 발주 요건, 품질 불량 시의 자재 반품 및 손해 배상 처리 기준을 상세히 명시합니다.',
    cautions: [
      '[전결 규정] 1천만 원 이하: 현장소장 전결 | 1천만 원~5천만 원: 공사부서장 승인 | 5천만 원 초과: 본사 조달본부장 승인',
      '[긴급 발주 규정] 기상 악화, 안전 비상사태, 후속 공정 즉시 지연 위험이 명백할 경우에 한해 우선순위 [EMERGENCY] 지정 가능 (사후 24시간 내 사유서 제출 필수)',
      '[불합격 반품 규정] 검수 불합격(FAIL) 판정 시 공급업체는 48시간 이내에 현장 밖으로 반출하여야 하며, 미이행 시 현장 임의 폐기 및 비용 청구 가능'
    ],
    tips: [
      '모든 자재는 최초 반입 시 KS인증서 사본 또는 공인기관 시험성적서를 원본 대조필하여 시스템에 첨부해야 합니다.'
    ],
    relatedScreen: '전체 규정'
  },
  {
    id: 'man-11',
    code: 'MAN-11',
    title: '[FAQ 및 트러블슈팅] 자주 묻는 질문과 긴급 상황 대처법',
    category: 'FAQ',
    targetRole: 'ALL',
    badge: 'FAQ / 문제 해결',
    summary: '자재 납품 지연, 수량 상이, 계좌 오류 등 현장에서 빈번히 발생하는 문제 상황에 대한 원인 분석 및 해결 절차를 제공합니다.',
    faqs: [
      {
        question: '배송 기사가 예정된 도착 시간보다 2시간 이상 지연될 경우 어떻게 조치하나요?',
        answer: '배송 관리 화면에서 해당 배송 건의 [기사 연락처]로 직통 유선 확인을 실시하고, 레미콘 등 시간 제한 자재인 경우 즉시 공급사 대표번호로 연락하여 슬럼프 저하 전 대체 차량 배차를 요청하십시오.'
      },
      {
        question: '현장 실측 수량이 송장 수량보다 부족할 때는 어떻게 처리하나요?',
        answer: '검수 화면에서 결과를 [조건부 합격(CONDITIONAL_PASS)]으로 지정하고 검수 메모란에 "실측 18톤(송장 20톤 대비 2톤 부족)"과 같이 명시하십시오. 공급업체는 수정된 실측 수량 기준으로 송장을 재발행해야 합니다.'
      },
      {
        question: '이미 발행된 송장의 금액이나 계좌번호를 수정할 수 있나요?',
        answer: '현장 관리자가 대금을 지급하기 전(UNPAID 상태)인 경우 공급업체는 기존 송장을 취소하고 올바른 정보로 신규 송장을 즉시 재발행할 수 있습니다.'
      },
      {
        question: '단가 변동성이 큰 철근의 경우 견적 유효기간 이후엔 어떻게 되나요?',
        answer: '유효기간이 경과한 견적서는 시스템에서 자동 만료 처리되므로, 현장 관리자는 공급사에게 [재견적 요청]을 클릭하여 최신 단가를 제출받아야 합니다.'
      }
    ],
    relatedScreen: '문제 해결 센터'
  },
  {
    id: 'man-12',
    code: 'MAN-12',
    title: '[시스템/API 가이드] 백엔드 REST API 연동 규격서',
    category: 'API_DEV',
    targetRole: 'DEV',
    badge: '개발자 / API 명세',
    summary: '본 조달 관리 시스템(PMS)의 Backend (Express + MongoDB/PostgreSQL)와 연동되는 핵심 REST API 엔드포인트 규격과 페이로드 스키마를 설명합니다.',
    apiReference: {
      endpoint: '/api/order',
      method: 'POST',
      description: '신규 건설 자재 발주 등록 API',
      requestSample: `{
  "siteName": "강남 르네상스타워",
  "materialName": "고장력 철근 SD400 D19",
  "category": "골조 자재",
  "quantity": 50,
  "unit": "TON",
  "unitPrice": 850000,
  "priority": "URGENT",
  "requestedDeliveryDate": "2026-09-25"
}`,
      responseSample: `{
  "status": "success",
  "code": 201,
  "data": {
    "orderId": "ORD-2026-006",
    "status": "PENDING",
    "totalAmount": 42500000,
    "createdAt": "2026-09-17T10:00:00Z"
  }
}`
    },
    steps: [
      {
        stepNumber: 1,
        title: 'GET /api/order',
        description: '현장별, 상태별 발주 목록 조회',
        actionDetail: 'Query 파라미터: siteName, status, priority'
      },
      {
        stepNumber: 2,
        title: 'POST /api/quotation',
        description: '공급사의 단가 견적서 제출',
        actionDetail: 'Payload: orderId, supplierId, proposedUnitPrice, leadTimeDays'
      },
      {
        stepNumber: 3,
        title: 'POST /api/delivery',
        description: '출하 등록 및 운송 차량 배차 정보 생성',
        actionDetail: 'Payload: orderId, vehicleNumber, driverName, driverContact'
      },
      {
        stepNumber: 4,
        title: 'POST /api/invoice',
        description: '검수 완료 건에 대한 세금계산서/송장 발행',
        actionDetail: 'Payload: orderId, supplyAmount, taxAmount, bankDetails'
      },
      {
        stepNumber: 5,
        title: 'POST /api/payment',
        description: '송장에 대한 대금 지급 실행 및 발주 종결 처리',
        actionDetail: 'Payload: invoiceId, amount, paymentMethod, payerName'
      }
    ],
    relatedScreen: '백엔드 연동'
  }
];
