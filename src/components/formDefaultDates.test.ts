import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

function read(name: string): string {
  return readFileSync(path.join(here, name), 'utf8');
}

const newOrder = read('NewOrderModal.tsx');
assert.ok(newOrder.includes('defaultRequestedDeliveryDate'));
assert.ok(newOrder.includes('flawedSampleDeliveryDate'));
assert.ok(newOrder.includes('draftOrderNumber'));
assert.equal(newOrder.includes('ORD-2026-NEW'), false);
assert.equal(newOrder.includes("'2026-09-25'"), false);
assert.equal(newOrder.includes("'2026-08-01'"), false);
assert.equal(newOrder.includes("'2026-09-24'"), false);

const supplier = read('SupplierActionModals.tsx');
assert.ok(supplier.includes('defaultQuoteValidUntil'));
assert.ok(supplier.includes('defaultExpectedArrival'));
assert.ok(supplier.includes('defaultInvoiceDueDate'));
assert.ok(supplier.includes('toLocalIsoDate'));
assert.ok(supplier.includes('toLocalDateTime'));
for (const frozen of ['2026-09-28', '2026-09-18 14:00', '2026-10-20']) {
  assert.equal(supplier.includes(`'${frozen}'`), false, `supplier still freezes ${frozen}`);
}

const dashboard = read('ProcurementEfficiencyDashboard.tsx');
assert.ok(dashboard.includes('orderCreatedInPeriod'));
assert.ok(dashboard.includes('CURRENT_MONTH'));
assert.equal(dashboard.includes("startsWith('2026-09')"), false);

const app = readFileSync(path.join(here, '../App.tsx'), 'utf8');
assert.ok(app.includes('documentNumber'));
assert.ok(app.includes('toLocalDateTime'));
assert.equal(app.includes('ORD-2026-'), false);
assert.equal(app.includes('toISOString()'), false);

console.log('formDefaultDates tests passed');
