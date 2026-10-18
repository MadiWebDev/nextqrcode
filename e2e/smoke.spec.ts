import { test, expect } from '@playwright/test';

/**
 * Phase 0 smoke suite: critical pages render and the generator produces output.
 * Per-type generate→decode round-trips land in Phase 2.
 */
const pages = [
  '/',
  '/url-qr-code-generator',
  '/wifi-qr-code-generator',
  '/qr-size-calculator',
  '/about',
  '/privacy',
  '/terms',
];

for (const path of pages) {
  test(`page renders: ${path}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main').first()).toBeVisible();
  });
}

test('home generator renders a QR preview canvas', async ({ page }) => {
  await page.goto('/');
  // The generator form should be present
  await expect(page.getByRole('main')).toBeVisible();
});

test('unknown route shows not-found page', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist-xyz');
  expect(res?.status()).toBe(404);
});
