# MAN-12 · [시스템/API 가이드] 백엔드 REST API 연동 규격서

> 본 조달 관리 시스템(PMS)의 Backend (Express + MongoDB/PostgreSQL)와 연동되는 핵심 REST API 엔드포인트 규격과 페이로드 스키마를 설명합니다.

| 항목 | 내용 |
|------|------|
| 문서 코드 | `MAN-12` |
| 분류 | 개발자 / API |
| 대상 사용자 | 개발자 / 시스템 연동 담당 |
| 배지 | 개발자 / API 명세 |
| 관련 화면 | 백엔드 연동 |

## 대표 API 명세

- **엔드포인트**: `POST /api/order`
- **설명**: 신규 건설 자재 발주 등록 API

### 요청 예시

```json
{
  "siteName": "강남 르네상스타워",
  "materialName": "고장력 철근 SD400 D19",
  "category": "골조 자재",
  "quantity": 50,
  "unit": "TON",
  "unitPrice": 850000,
  "priority": "URGENT",
  "requestedDeliveryDate": "2026-09-25"
}
```

### 응답 예시

```json
{
  "status": "success",
  "code": 201,
  "data": {
    "orderId": "ORD-2026-006",
    "status": "PENDING",
    "totalAmount": 42500000,
    "createdAt": "2026-09-17T10:00:00Z"
  }
}
```

## 엔드포인트 목록

### 1. GET /api/order

현장별, 상태별 발주 목록 조회

- **파라미터**: Query 파라미터: siteName, status, priority

### 2. POST /api/quotation

공급사의 단가 견적서 제출

- **파라미터**: Payload: orderId, supplierId, proposedUnitPrice, leadTimeDays

### 3. POST /api/delivery

출하 등록 및 운송 차량 배차 정보 생성

- **파라미터**: Payload: orderId, vehicleNumber, driverName, driverContact

### 4. POST /api/invoice

검수 완료 건에 대한 세금계산서/송장 발행

- **파라미터**: Payload: orderId, supplyAmount, taxAmount, bankDetails

### 5. POST /api/payment

송장에 대한 대금 지급 실행 및 발주 종결 처리

- **파라미터**: Payload: invoiceId, amount, paymentMethod, payerName

---

건설 산업 조달 관리 시스템 (CPMS) v2.4 · 공식 한글 표준 매뉴얼 · 원본: `src/data/manualData.ts`
