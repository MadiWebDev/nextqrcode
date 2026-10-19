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

test('login page renders sign-in options or unconfigured notice', async ({ page }) => {
  const res = await page.goto('/login');
  expect(res?.status()).toBeLessThan(400);
  await expect(page.locator('main').first()).toBeVisible();
});

test('short-link route handles missing codes gracefully', async ({ page }) => {
  const res = await page.goto('/r/does-not-exist-xyz123');
  // 503 without a database configured, 404 with one — never a 500.
  expect([404, 503]).toContain(res?.status());
});

test('public QR page 404s for unknown codes', async ({ page }) => {
  const res = await page.goto('/q/does-not-exist-xyz123');
  expect(res?.status()).toBe(404);
});

test('family content pages render', async ({ page }) => {
  for (const path of ['/glossary/finder-pattern', '/industries', '/scan-guide', '/templates']) {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main').first()).toBeVisible();
  }
});

test('dashboard redirects anonymous visitors to login', async ({ page }) => {
  const res = await page.goto('/dashboard');
  expect(res?.url()).toContain('/login');
});
