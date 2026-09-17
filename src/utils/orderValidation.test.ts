import assert from 'node:assert/strict';
import { STANDARD_MATERIALS, validateOrderForm, type MaterialStandard } from './orderValidation';

function catalogMaterial(id: string): MaterialStandard {
  const found = STANDARD_MATERIALS.find((material) => material.id === id);
  if (!found) {
    throw new Error(`catalog must include ${id}`);
  }
  return found;
}

function localIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addLocalDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

const CONCRETE = catalogMaterial('MAT-CON-01');

const now = new Date();
const today = localIsoDate(now);
const yesterday = localIsoDate(addLocalDays(now, -1));
const nextWeek = localIsoDate(addLocalDays(now, 7));

const validAddress =
  '서울 강남구 테헤란로 152 신축공사 현장 서문 2번 게이트 (지하 2층 코어부 하역장)';

function baseOrder(overrides: Partial<Parameters<typeof validateOrderForm>[0]> = {}) {
  return {
    materialId: CONCRETE.id,
    materialName: CONCRETE.name,
    quantity: CONCRETE.minQty * 2,
    unit: CONCRETE.standardUnit,
    requestedDeliveryDate: nextWeek,
    deliveryAddress: validAddress,
    specification: CONCRETE.recommendedSpec,
    siteName: '강남 르네상스타워 신축공사',
    ...overrides
  };
}

const missingIdReport = validateOrderForm(baseOrder({ materialId: '' }));
const missingIdIssue = missingIdReport.issues.find((issue) => issue.field === 'materialId');
assert.equal(missingIdIssue?.type, 'ERROR', 'missing materialId must be ERROR');
assert.ok(
  STANDARD_MATERIALS.some((material) => material.id === missingIdIssue?.suggestedValue),
  `suggested materialId ${missingIdIssue?.suggestedValue} must be a catalog id`
);

const vagueSpecReport = validateOrderForm(baseOrder({ specification: '좋은 거' }));
const specIssue = vagueSpecReport.issues.find((issue) => issue.field === 'specification');
assert.equal(specIssue?.type, 'ERROR', 'vague spec 좋은 거 must be ERROR');
assert.equal(specIssue?.suggestedValue, CONCRETE.recommendedSpec);

const wrongUnitReport = validateOrderForm(baseOrder({ unit: '개' }));
const unitIssue = wrongUnitReport.issues.find((issue) => issue.field === 'unit');
assert.equal(unitIssue?.type, 'ERROR', 'unit 개 must be ERROR');
assert.equal(
  unitIssue?.suggestedValue,
  CONCRETE.standardUnit,
  'suggested unit must be the matched material standard unit'
);

const pastDateReport = validateOrderForm(baseOrder({ requestedDeliveryDate: yesterday }));
const pastIssue = pastDateReport.issues.find((issue) => issue.field === 'requestedDeliveryDate');
assert.equal(pastIssue?.type, 'ERROR', `납기일 ${yesterday} (before real today ${today}) must be ERROR`);
assert.match(pastIssue?.suggestedValue ?? '', /^\d{4}-\d{2}-\d{2}$/);
assert.ok(
  (pastIssue?.suggestedValue ?? '') >= today,
  `suggested 납기일 ${pastIssue?.suggestedValue} must be on or after real today ${today}`
);

const frozenLiteral = '2026-09-17';
if (frozenLiteral < today) {
  const frozenReport = validateOrderForm(baseOrder({ requestedDeliveryDate: frozenLiteral }));
  const frozenIssue = frozenReport.issues.find((issue) => issue.field === 'requestedDeliveryDate');
  assert.equal(
    frozenIssue?.type,
    'ERROR',
    `frozen calendar string ${frozenLiteral} is before real today ${today} and must be ERROR, not treated as today`
  );
}

const validReport = validateOrderForm(baseOrder());
assert.equal(validReport.isValid, true, 'representative valid order must have zero ERROR');
assert.ok(validReport.passedFields.includes('materialId'));
assert.ok(validReport.passedFields.includes('unit'));
assert.ok(validReport.passedFields.includes('specification'));
assert.ok(validReport.passedFields.includes('requestedDeliveryDate'));

const clockNow = addLocalDays(now, 40);
const clockToday = localIsoDate(clockNow);
const clockYesterday = localIsoDate(addLocalDays(clockNow, -1));
const clockReport = validateOrderForm(
  baseOrder({ requestedDeliveryDate: clockYesterday }),
  { now: clockNow }
);
const clockIssue = clockReport.issues.find((issue) => issue.field === 'requestedDeliveryDate');
assert.equal(clockIssue?.type, 'ERROR', 'injected clock must still flag a date before that clock');
assert.ok(
  (clockIssue?.suggestedValue ?? '') >= clockToday,
  `injected-clock suggested 납기일 ${clockIssue?.suggestedValue} must be on or after ${clockToday}`
);

console.log(`orderValidation tests passed (today=${today})`);
