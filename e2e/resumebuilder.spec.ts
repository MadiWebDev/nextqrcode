import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

/**
 * Resume Builder browser QA (Phase 9 gate).
 *
 * The app lives on its own subdomain; Chromium is told to resolve the
 * host to the local server so the real proxy routing is exercised.
 * Run against a served production build:
 *   PLAYWRIGHT_BASE_URL=http://resumebuilder.freeqrcode.tools:3100 \
 *     npx playwright test e2e/resumebuilder.spec.ts --project=chromium
 *
 * Privacy contract under test: resume content must never appear in any
 * network request (the app is local-first by design).
 */
test.use({
  // Full Chromium (not the headless shell): the shell ignores
  // --host-resolver-rules, which this host-routing setup depends on.
  channel: 'chromium',
  launchOptions: {
    args: [
      '--host-resolver-rules=MAP resumebuilder.freeqrcode.tools 127.0.0.1',
      '--no-proxy-server',
      // The test origin is plain HTTP on a real hostname, which Chromium
      // does not treat as a secure context; service workers (used in
      // production over HTTPS) need this test-only exception.
      '--unsafely-treat-insecure-origin-as-secure=http://resumebuilder.freeqrcode.tools:3100',
    ],
  },
});

const MARKER = 'Zqx E2e Person';

// The site-wide cookie-consent bar is a fixed bottom strip (z-50) that
// covers the editor's floating Download button (z-40) until dismissed —
// seed a rejected consent, as the main site's a11y spec does, so the
// tests exercise the product rather than the consent flow.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('qrs_cookie_consent', 'rejected');
  });
});

async function createAndOpenResume(page: import('@playwright/test').Page) {
  await page.goto('/app');
  await page.getByRole('button', { name: /Create a resume/ }).first().click();
  await expect(page.getByLabel('Full name')).toBeVisible({ timeout: 20_000 });
}

/** Export actions: on desktop they sit in the export card; on mobile they
 * live in the sheet behind the floating Download button. */
async function clickDocx(page: import('@playwright/test').Page) {
  const floating = page.getByRole('button', { name: 'Download', exact: true });
  if (await floating.isVisible().catch(() => false)) await floating.click();
  await page.getByRole('button', { name: 'DOCX', exact: true }).last().click();
}

async function showPreview(page: import('@playwright/test').Page) {
  const tab = page.getByRole('tab', { name: 'Preview' });
  if (await tab.isVisible().catch(() => false)) await tab.click();
}

test.describe('Resume Builder', () => {
  test('landing renders with guides section linking the SEO pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Free Resume Builder/);
    await expect(page.locator('h1')).toContainText('Free resume builder');
    await expect(page.getByRole('link', { name: /Nurse resume template/ })).toBeVisible();
    await page.getByRole('link', { name: /Nurse resume template/ }).click();
    await expect(page.locator('h1')).toContainText('Nurse resume template');
  });

  test('SEO role page carries Article + FAQ schema and a template card', async ({ page }) => {
    await page.goto('/resume-templates/nurse');
    await expect(page.getByText('What employers look for')).toBeVisible();
    await expect(page.getByText('Recommended template:')).toBeVisible();
    const ldTypes = await page.evaluate(() => {
      const out: string[] = [];
      document
        .querySelectorAll('script[type="application/ld+json"]')
      .forEach((s) => {
          try {
            const j = JSON.parse(s.textContent || '{}');
            if (j['@type']) out.push(j['@type']);
          } catch {
            /* ignore */
          }
        });
      return out;
    });
    expect(ldTypes).toContain('Article');
    expect(ldTypes).toContain('FAQPage');
    expect(ldTypes).toContain('BreadcrumbList');
  });

  test('unknown SEO slug returns 404', async ({ page }) => {
    const res = await page.goto('/resume-templates/definitely-not-a-role');
    expect(res?.status()).toBe(404);
  });

  test('gallery lists 47 templates and starting one opens the editor', async ({ page }) => {
    await page.goto('/templates');
    await expect(page.getByText(/of 47 templates/)).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: /Use this template/ }).first().click();
    // The gallery creates the resume and lands on the library; Open enters the editor.
    // (exact name: the mobile header also has an "Open menu" button.)
    await expect(page.getByRole('button', { name: 'Open', exact: true }).first()).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Open', exact: true }).first().click();
    await expect(page.getByLabel('Full name')).toBeVisible({ timeout: 20_000 });
  });

  test('create, edit, preview and reload persistence', async ({ page }) => {
    await createAndOpenResume(page);
    await page.getByLabel('Full name').fill(MARKER);
    await showPreview(page);
    await expect(page.locator('#resume-preview-root')).toContainText(MARKER, { timeout: 15_000 });
    // Wait for the autosave to land before leaving the editor.
    await expect(page.getByText(/Saved locally at/)).toBeVisible({ timeout: 15_000 });
    // Back to the library: the resume is listed under the person's name.
    await page.goto('/app');
    await expect(page.getByText(MARKER)).toBeVisible({ timeout: 15_000 });
    await page.reload();
    await expect(page.getByText(MARKER)).toBeVisible({ timeout: 15_000 });
  });

  test('resume content never leaves the browser over the network', async ({ page }) => {
    test.setTimeout(90_000);
    const leaks: string[] = [];
    page.on('request', (req) => {
      const body = req.postData() || '';
      if (body.includes('Zqx') || decodeURIComponent(req.url()).includes('Zqx')) {
        leaks.push(`${req.method()} ${req.url()}`);
      }
    });
    await createAndOpenResume(page);
    await page.getByLabel('Full name').fill(MARKER);
    await page.waitForTimeout(2_500); // autosave debounce window
    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await clickDocx(page);
    await downloadPromise;
    expect(leaks).toEqual([]);
  });

  test('DOCX export downloads a real Word file', async ({ page }) => {
    test.setTimeout(90_000);
    await createAndOpenResume(page);
    await page.getByLabel('Full name').fill(MARKER);
    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await clickDocx(page);
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.docx$/);
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('print pipeline produces a selectable-text PDF with the name first', async ({ page }) => {
    await createAndOpenResume(page);
    await page.getByLabel('Full name').fill(MARKER);
    await showPreview(page);
    await expect(page.locator('#resume-preview-root')).toContainText(MARKER, { timeout: 15_000 });
    await page.evaluate(() => document.fonts.ready);
    // Mirror exactly what the PDF (print) button does before window.print():
    // inject the @page rule for the document's page size (ExportBar.printPdf).
    await page.addStyleTag({ content: '@page { size: A4; margin: 0; }' });
    await page.emulateMedia({ media: 'print' });
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    expect(pdf.subarray(0, 4).toString('latin1')).toBe('%PDF');
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjs.getDocument({ data: new Uint8Array(pdf) }).promise;
    let text = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      const tc = await p.getTextContent();
      text += tc.items.map((it) => ('str' in it ? it.str : '')).join('\n') + '\n';
    }
    expect(text).toContain(MARKER);
    const firstLine = text.split('\n').map((l) => l.trim()).filter(Boolean)[0] || '';
    expect(firstLine).toContain(MARKER);
  });

  test('photo upload and crop save', async ({ page }) => {
    await createAndOpenResume(page);
    const shot = await page.screenshot();
    await page
      .locator('input[aria-label="Choose a photo file"]')
      .setInputFiles({ name: 'portrait.png', mimeType: 'image/png', buffer: shot });
    await expect(page.getByText(/Photo added/)).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Save crop' }).click();
    await expect(page.getByText(/Crop saved/)).toBeVisible({ timeout: 20_000 });
  });

  test('job tracker adds an application card', async ({ page }) => {
    await page.goto('/tracker');
    await page.getByLabel('Company').fill('E2E Example Ltd');
    await page.getByLabel('Role').fill('Support Specialist');
    await page.getByRole('button', { name: 'Add application' }).click();
    await expect(page.getByText('E2E Example Ltd', { exact: true })).toBeVisible({ timeout: 10_000 });
  });

  test('works offline after first load (service worker)', async ({ page, context }) => {
    await page.goto('/app');
    await expect(page.getByRole('button', { name: /Create a resume/ }).first()).toBeVisible({
      timeout: 20_000,
    });
    // First load installs the worker; a reload is controlled by it.
    await page.reload();
    await page.waitForFunction(
      () => !!navigator.serviceWorker?.controller,
      undefined,
      { timeout: 30_000 },
    );
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('button', { name: /Create a resume/ }).first()).toBeVisible({
      timeout: 20_000,
    });
    await context.setOffline(false);
  });

  for (const path of ['/', '/templates', '/resume-templates/nurse', '/guides/ats-resume-guide', '/app']) {
    test(`axe: zero critical/serious violations on ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator('main').first()).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
        .analyze();
      const bad = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      expect(
        bad,
        bad.map((v) => `[${v.impact}] ${v.id}: ${v.description} (nodes: ${v.nodes.length})`).join('\n'),
      ).toEqual([]);
    });
  }
});
