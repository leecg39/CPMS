import assert from 'node:assert/strict';
import {
  currentMonthOptionLabel,
  defaultExpectedArrival,
  defaultInvoiceDueDate,
  defaultQuoteValidUntil,
  defaultRequestedDeliveryDate,
  documentNumber,
  draftOrderNumber,
  flawedSampleDeliveryDate,
  localDatePlusDays,
  localYearMonth,
  orderCreatedInPeriod,
  toLocalDateTime,
  toLocalIsoDate
} from './liveDates';

function localIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

const now = new Date();
const today = localIsoDate(now);
const yesterday = localIsoDate(addDays(now, -1));
const nextWeek = localIsoDate(addDays(now, 7));
const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

assert.equal(toLocalIsoDate(now), today);
assert.equal(localDatePlusDays(0, now), today);
assert.equal(localDatePlusDays(7, now), nextWeek);
assert.ok(localDatePlusDays(-1, now) < today);

assert.equal(defaultRequestedDeliveryDate(now), nextWeek);
assert.ok(defaultRequestedDeliveryDate(now) > today);

assert.equal(flawedSampleDeliveryDate(now), localIsoDate(addDays(now, -30)));
assert.ok(flawedSampleDeliveryDate(now) < today);

assert.equal(defaultQuoteValidUntil(now), localIsoDate(addDays(now, 10)));
assert.ok(defaultQuoteValidUntil(now) > today);

assert.equal(defaultExpectedArrival(now), `${localIsoDate(addDays(now, 1))} 14:00`);
assert.ok(defaultExpectedArrival(now).slice(0, 10) > today);

assert.equal(defaultInvoiceDueDate(now), localIsoDate(addDays(now, 30)));
assert.ok(defaultInvoiceDueDate(now) > today);

assert.equal(localYearMonth(now), yearMonth);
assert.equal(currentMonthOptionLabel(now), `${now.getFullYear()}년 ${now.getMonth() + 1}월 당월`);

assert.equal(orderCreatedInPeriod(`${yearMonth}-15 08:30`, 'ALL', now), true);
assert.equal(orderCreatedInPeriod(`${yearMonth}-15 08:30`, 'CURRENT_MONTH', now), true);
assert.equal(orderCreatedInPeriod(`${yesterday} 08:30`, 'CURRENT_MONTH', now), yesterday.startsWith(yearMonth));
assert.equal(orderCreatedInPeriod('1999-01-01 08:30', 'CURRENT_MONTH', now), false);

const year = String(now.getFullYear());
assert.equal(draftOrderNumber(now), `ORD-${year}-NEW`);
assert.equal(documentNumber('ORD', 1, 3, now), `ORD-${year}-001`);
assert.equal(documentNumber('INV', 95, 4, now), `INV-${year}-0095`);
assert.equal(documentNumber('QT', 80, 0, now).startsWith(`QT-${year}-`), true);

const stamped = toLocalDateTime(now);
assert.match(stamped, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
assert.ok(stamped.startsWith(today));
assert.equal(stamped.includes('T'), false);

const shiftedNow = addDays(now, 40);
assert.equal(defaultRequestedDeliveryDate(shiftedNow), localIsoDate(addDays(shiftedNow, 7)));
assert.ok(defaultRequestedDeliveryDate(shiftedNow) !== defaultRequestedDeliveryDate(now));
assert.ok(flawedSampleDeliveryDate(shiftedNow) < localIsoDate(shiftedNow));

console.log(`liveDates tests passed (today=${today})`);
