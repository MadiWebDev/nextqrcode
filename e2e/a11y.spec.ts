import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

/**
 * Phase 9 — accessibility gate: axe-core checks on representative pages.
 * Fails on any critical or serious violation under WCAG 2.2 AA tags.
 *
 * Route notes: `/industries/restaurants` and `/glossary/qr-code` do not exist
 * as literal slugs (both are `[slug]` routes), so the closest real pages —
 * `/industries/restaurant-digital-menu` and `/glossary/static-qr-code` —
 * stand in as the family and glossary representatives.
 */

// The onboarding tour opens a modal on first visit; seed localStorage so axe
// scans the real page content instead of the tour overlay (same pattern as
// e2e/qr-roundtrip.spec.ts).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('qr-onboarded', 'true');
    window.localStorage.setItem('qrs_cookie_consent', 'rejected');
  });
});

const pages = [
  '/',
  '/wifi-qr-code-generator',
  '/industries/restaurant-digital-menu',
  '/glossary/static-qr-code',
  '/qr-scanner',
  '/es',
];

function formatViolations(violations: Result[]): string {
  return violations
    .map(
      (v) =>
        `  - [${v.impact}] ${v.id}: ${v.description} ` +
        `(WCAG: ${v.tags.filter((t) => t.startsWith('wcag')).join(', ') || 'n/a'}) ` +
        `nodes: ${v.nodes.length}`
    )
    .join('\n');
}

for (const path of pages) {
  test(`axe: zero critical/serious violations on ${path}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main').first()).toBeVisible();

    const results: AxeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');
    const serious = results.violations.filter((v) => v.impact === 'serious');

    expect(critical, `Critical axe violations on ${path}:\n${formatViolations(critical)}`).toEqual(
      []
    );
    expect(serious, `Serious axe violations on ${path}:\n${formatViolations(serious)}`).toEqual([]);
  });
}
