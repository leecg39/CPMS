import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MANUAL_SECTIONS } from '../data/manualData';
import { WORKFLOW_STEPS } from './InteractiveWorkflowBar';

const here = path.dirname(fileURLToPath(import.meta.url));

assert.equal(WORKFLOW_STEPS.length, 7);
assert.deepEqual(
  WORKFLOW_STEPS.map((step) => step.title),
  ['발주 신청', '견적 제출', '발주 승인', '출하·배송', '현장 검수', '송장 발행', '대금 지급']
);

const workflowIds: string[] = WORKFLOW_STEPS.map((step) => step.manualId);
const otherManuals = MANUAL_SECTIONS.filter((manual) => !workflowIds.includes(manual.id));
assert.equal(workflowIds.length + otherManuals.length, MANUAL_SECTIONS.length);
assert.ok(otherManuals.some((manual) => manual.id === 'man-01'));
assert.ok(otherManuals.some((manual) => manual.id === 'man-09'));
assert.ok(otherManuals.some((manual) => manual.id === 'man-10'));
assert.ok(otherManuals.some((manual) => manual.id === 'man-11'));
assert.ok(otherManuals.some((manual) => manual.id === 'man-12'));

const barSource = readFileSync(path.join(here, 'InteractiveWorkflowBar.tsx'), 'utf8');
assert.equal(barSource.includes('lg:grid-cols-7'), false);
assert.ok(barSource.includes('기타 매뉴얼'));
assert.ok(barSource.includes('시스템 개요'));
assert.ok(barSource.includes('FAQ / 문제 해결'));
assert.ok(barSource.includes('API 명세'));
assert.ok(barSource.includes('aria-label="조달 매뉴얼"'));
assert.ok(barSource.includes('hidden lg:block w-[280px]'));

const appSource = readFileSync(path.join(here, '../App.tsx'), 'utf8');
assert.ok(appSource.includes('lg:flex-row'));
assert.ok(appSource.includes('selectedManualId={selectedManual?.id}'));
assert.ok(appSource.indexOf('<InteractiveWorkflowBar') < appSource.indexOf('flex-1 min-w-0'));

console.log(`manualSidebar tests passed (${WORKFLOW_STEPS.length} steps, ${otherManuals.length} other manuals)`);
