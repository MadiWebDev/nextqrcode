import { test, expect } from '@playwright/test';

/**
 * Invoice workspace browser smoke test.
 *
 * This test class exists because Phases 2–8 of the invoice-platform program
 * shipped a workspace that was completely dead in a real browser while every
 * curl/unit gate stayed green: the proxy's CSP carried a nonce that a fully
 * static (SSG) site can never apply to its inline scripts, so browsers
 * refused Next.js's inline flight-data scripts and React hydration never
 * ran — dropdowns stayed empty, totals never updated, Save / Download PDF /
 * Print were all inert, with no visible error. Only a real browser that
 * interacts with the page can catch this class of failure.
 *
 * It also guards the related first-visit regression: the main site's QR
 * onboarding tour (root layout) must never open over the invoice workspace.
 *
 * Runs against the production build served by `next start`
 * (see playwright.config.ts webServer).
 */
test.describe('invoice workspace (live browser)', () => {
  test('workspace hydrates and the full create → save → PDF flow works', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        pageErrors.push(msg.text());
      }
    });

    await page.goto('/invoice-site');

    // Hydration must have run: the workspace's currency control is live.
    const currencyTrigger = page
      .locator(
        'xpath=//label[normalize-space(.)="Currency"]/following-sibling::div[1]//*[@role="combobox"]',
      )
      .first();
    await expect(currencyTrigger).toBeVisible();

    // The QR onboarding tour belongs to the main site; it must not open here.
    await expect(page.getByRole('dialog', { name: 'Welcome to QR Code Tools' })).toHaveCount(0);
    await expect(page.getByText('Choose a QR Type')).toHaveCount(0);

    // The site-wide cookie banner does appear on first visit — dismiss it so
    // it can't overlay the workspace controls during the flow.
    const rejectCookies = page.getByRole('button', { name: 'Reject Non-Essential' });
    if (await rejectCookies.isVisible().catch(() => false)) {
      await rejectCookies.click();
    }

    // --- Currency: options exist, switching updates the money formatting ---
    await currencyTrigger.click();
    const options = page.getByRole('option');
    expect(await options.count()).toBeGreaterThanOrEqual(20);
    await expect(options.filter({ hasText: /^PKR/ }).first()).toBeVisible();
    await options.filter({ hasText: /^EUR/ }).first().click();
    await expect(currencyTrigger).toContainText('EUR');

    // --- Items: 2 × 50 must flow into line total, Subtotal, Total, preview --
    await page.getByLabel('Item description').first().fill('Consulting work');
    await page.getByLabel('Quantity').first().fill('2');
    await page.getByLabel('Unit price').first().fill('50');

    const lineTotal = page
      .locator('xpath=//input[@aria-label="Unit price"]/following-sibling::span[1]')
      .first();
    await expect(lineTotal).toContainText('€100.00');

    const totalsRow = (label: string) =>
      page.locator(`xpath=//p[span[1][normalize-space()="${label}"]]`).first();
    await expect(totalsRow('Subtotal')).toContainText('€100.00');
    await expect(totalsRow('Total')).toContainText('€100.00');
    await expect(totalsRow('Balance due')).toContainText('€100.00');

    // Live preview (the printable invoice) shows the same total.
    const previewTotal = page
      .locator('xpath=//dt[normalize-space()="Total"]/following-sibling::dd[1]')
      .first();
    await expect(previewTotal).toContainText('€100.00');

    // --- Save: the invoice lands in My invoices ------------------------------
    await page.getByRole('button', { name: 'Save invoice' }).click();
    await expect(page.getByText(/find it any time under My invoices/)).toBeVisible();
    await expect(page.getByRole('button', { name: /My invoices \(1\)/ })).toBeVisible();

    // --- Download PDF: a real .pdf download is produced ----------------------
    const downloadPromise = page.waitForEvent('download', { timeout: 20_000 });
    await page.getByRole('button', { name: 'Download PDF' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

    // --- The whole session must be error-free ---------------------------------
    expect(pageErrors, `browser errors during workspace session:\n${pageErrors.join('\n')}`).toEqual(
      [],
    );
  });
});
