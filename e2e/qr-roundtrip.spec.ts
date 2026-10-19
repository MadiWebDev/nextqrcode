import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import path from 'node:path';

/**
 * Phase 2 — UI round-trip: drive the real generator pages, then decode the
 * rendered canvas in-browser with jsQR and assert the exact payload.
 *
 * bypassCSP: the app ships a nonce-based Content-Security-Policy (Phase 9);
 * jsQR is injected into the test page via addScriptTag, which the CSP would
 * block. Bypassing CSP is test-only and does not weaken the app's policy.
 */
test.use({ bypassCSP: true });

const JSQR_PATH = path.join(__dirname, '..', 'node_modules', 'jsqr', 'dist', 'jsQR.js');

// The onboarding tour opens a modal on first visit; seed localStorage so tests
// interact with the page directly.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('qr-onboarded', 'true');
    window.localStorage.setItem('qrs_cookie_consent', 'rejected');
  });
});

async function decodeVisibleQr(page: Page): Promise<string | null> {
  await page.addScriptTag({ path: JSQR_PATH });
  return page.evaluate(() => {
    const canvas = document.querySelector(
      'div[aria-label^="QR code for"] canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas || canvas.style.display === 'none') return null;
    const ctx = canvas.getContext('2d');
    if (!ctx || canvas.width === 0) return null;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const w = window as unknown as {
      jsQR: (data: Uint8ClampedArray, w: number, h: number) => { data: string } | null;
    };
    return w.jsQR(imageData.data, imageData.width, imageData.height)?.data ?? null;
  });
}

async function waitForQr(page: Page) {
  await page.waitForFunction(
    () => {
      const c = document.querySelector(
        'div[aria-label^="QR code for"] canvas'
      ) as HTMLCanvasElement | null;
      return !!c && c.width > 0 && c.style.display !== 'none';
    },
    { timeout: 15000 }
  );
  // Let the debounced render finish drawing
  await page.waitForTimeout(800);
}

test('UI round-trip: URL QR decodes to the exact URL', async ({ page }) => {
  await page.goto('/url-qr-code-generator');
  await page.locator('#url').fill('https://example.com/e2e-roundtrip');
  await waitForQr(page);
  expect(await decodeVisibleQr(page)).toBe('https://example.com/e2e-roundtrip');
});

test('UI round-trip: WiFi QR decodes to the exact WIFI payload', async ({ page }) => {
  await page.goto('/wifi-qr-code-generator');
  await page.locator('#ssid').fill('E2E-Test-Net');
  // Encryption is a required Radix Select — pick WPA/WPA2
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'WPA/WPA2' }).click();
  await waitForQr(page);
  expect(await decodeVisibleQr(page)).toBe('WIFI:S:E2E-Test-Net;T:WPA;P:;');
});

test('UI round-trip: vCard QR decodes to the exact payload', async ({ page }) => {
  await page.goto('/vcard-qr-code-generator');
  await page.locator('#name').fill('E2E Tester');
  await waitForQr(page);
  const decoded = await decodeVisibleQr(page);
  expect(decoded).toContain('BEGIN:VCARD');
  expect(decoded).toContain('E2E Tester');
});
