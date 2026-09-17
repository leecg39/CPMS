import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const forbiddenFills = ['bg-indigo-600', 'bg-cyan-600', 'bg-purple-600', 'bg-emerald-600'];

function submitClassNames(source: string): string[] {
  const matches = source.matchAll(/type="submit"[\s\S]*?className="([^"]+)"/g);
  return [...matches].map((match) => match[1]);
}

function cancelClassNamesNearSubmit(source: string): string[] {
  const blocks = source.split('type="submit"');
  return blocks.slice(0, -1).flatMap((block) => {
    const cancelMatch = [...block.matchAll(/type="button"[\s\S]*?className="([^"]+)"/g)].at(-1);
    return cancelMatch ? [cancelMatch[1]] : [];
  });
}

const supplierSource = readFileSync(path.join(here, 'SupplierActionModals.tsx'), 'utf8');
const inspectionSource = readFileSync(path.join(here, 'InspectionModal.tsx'), 'utf8');

const submitClasses = [
  ...submitClassNames(supplierSource),
  ...submitClassNames(inspectionSource)
];

assert.equal(submitClasses.length, 4, `expected 4 primary submits (견적·출하·송장·검수), got ${submitClasses.length}`);

for (const className of submitClasses) {
  assert.ok(className.includes('btn-primary'), `submit must use Apple filled pill, got: ${className}`);
  for (const fill of forbiddenFills) {
    assert.equal(className.includes(fill), false, `submit must not use leftover fill ${fill}: ${className}`);
  }
}

const cancelClasses = [
  ...cancelClassNamesNearSubmit(supplierSource),
  ...cancelClassNamesNearSubmit(inspectionSource)
];

assert.equal(cancelClasses.length, 4, `expected 4 outlined cancel pills paired with submits, got ${cancelClasses.length}`);

for (const className of cancelClasses) {
  assert.ok(className.includes('btn-outline'), `cancel must use Apple outlined pill, got: ${className}`);
}

console.log(`primarySubmitCtas tests passed (${submitClasses.length} submits, ${cancelClasses.length} cancels)`);
