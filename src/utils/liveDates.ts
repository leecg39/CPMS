export function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addLocalDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function toLocalDateTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${toLocalIsoDate(date)} ${hours}:${minutes}`;
}

export function localDatePlusDays(days: number, now: Date = new Date()): string {
  return toLocalIsoDate(addLocalDays(now, days));
}

export function localYearMonth(now: Date = new Date()): string {
  return toLocalIsoDate(now).slice(0, 7);
}

export function currentMonthOptionLabel(now: Date = new Date()): string {
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 당월`;
}

export function orderCreatedInPeriod(
  createdAt: string,
  period: string,
  now: Date = new Date()
): boolean {
  if (period === 'ALL') {
    return true;
  }
  if (period === 'CURRENT_MONTH') {
    return createdAt.startsWith(localYearMonth(now));
  }
  return true;
}

export function defaultRequestedDeliveryDate(now: Date = new Date()): string {
  return localDatePlusDays(7, now);
}

export function flawedSampleDeliveryDate(now: Date = new Date()): string {
  return localDatePlusDays(-30, now);
}

export function defaultQuoteValidUntil(now: Date = new Date()): string {
  return localDatePlusDays(10, now);
}

export function defaultExpectedArrival(now: Date = new Date()): string {
  return `${localDatePlusDays(1, now)} 14:00`;
}

export function defaultInvoiceDueDate(now: Date = new Date()): string {
  return localDatePlusDays(30, now);
}

export function documentNumber(
  prefix: string,
  sequence: number,
  pad: number,
  now: Date = new Date()
): string {
  const year = String(now.getFullYear());
  return `${prefix}-${year}-${String(sequence).padStart(pad, '0')}`;
}

export function draftOrderNumber(now: Date = new Date()): string {
  return `ORD-${now.getFullYear()}-NEW`;
}
