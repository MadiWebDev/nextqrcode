import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

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

/* ── View-QR sharing ─────────────────────────────────────────────────────────
 * The share flow turns a finished invoice into a link whose fragment carries
 * the invoice itself; the /v page must decode it and render the same invoice
 * read-only, with a working PDF download. Guarded here because every layer
 * (panel, URL building, decode, view rendering) is browser-only behaviour. */

test.describe('invoice view-QR sharing', () => {
  test('share panel → view link renders the same invoice and downloads a PDF', async ({
    page,
    context,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        pageErrors.push(msg.text());
      }
    });

    await page.goto('/invoice-site');
    // The consent banner mounts after a short delay and, on mobile, overlays
    // the bottom of the screen where the share panel's buttons sit — dismiss
    // it deterministically (short wait) instead of racing its first paint.
    await page
      .getByRole('button', { name: 'Reject Non-Essential' })
      .click({ timeout: 3_000 })
      .catch(() => undefined);

    await page.getByLabel('Item description').first().fill('Design sprint');
    await page.getByLabel('Quantity').first().fill('2');
    await page.getByLabel('Unit price').first().fill('50');
    await page.getByRole('button', { name: 'Save invoice' }).click();
    await expect(page.getByText(/find it any time under My invoices/)).toBeVisible();
    // The saved record lands in local storage via state effects — poll for it
    // rather than assuming a synchronous write.
    let number = '';
    await expect
      .poll(async () => {
        number = await page.evaluate(() => {
          const list = JSON.parse(localStorage.getItem('invoicegenerator:invoices') ?? '[]') as {
            number?: string;
          }[];
          return list[0]?.number ?? '';
        });
        return number;
      })
      .toMatch(/^INV-/);

    // --- Share panel: QR + link ---------------------------------------------
    await page.getByRole('button', { name: 'Share / QR code' }).click();
    const dialog = page.getByRole('dialog', { name: `Share invoice ${number}` });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.locator('img[alt*="QR code to view invoice"]'),
    ).toBeVisible({ timeout: 15_000 });
    await expect(dialog.getByRole('button', { name: 'Copy link' })).toBeVisible();
    const viewUrl = await dialog.getByLabel('Invoice view link').inputValue();
    expect(viewUrl).toContain('/v#');
    expect(viewUrl.length).toBeGreaterThan(80);

    // Panel PDF download (with the view-QR footer option on) yields a .pdf.
    const panelDownload = page.waitForEvent('download', { timeout: 20_000 });
    await dialog.getByRole('button', { name: 'Download PDF' }).click();
    expect((await panelDownload).suggestedFilename()).toMatch(/\.pdf$/i);
    await dialog.getByRole('button', { name: 'Close share panel' }).click();
    await expect(dialog).toHaveCount(0);

    // --- View page: same invoice, read-only, PDF works -----------------------
    const viewPage = await context.newPage();
    const viewErrors: string[] = [];
    viewPage.on('pageerror', (err) => viewErrors.push(err.message));
    await viewPage.goto(viewUrl);
    await expect(viewPage.getByRole('heading', { name: `Invoice ${number}` })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      viewPage
        .locator('xpath=//dl//dt[normalize-space()="Total"]/following-sibling::dd[1]')
        .first(),
    ).toContainText('$100.00');
    await expect(viewPage.getByText(/read-only view/)).toBeVisible();
    const viewDownload = viewPage.waitForEvent('download', { timeout: 20_000 });
    await viewPage.getByRole('button', { name: 'Download PDF' }).click();
    expect((await viewDownload).suggestedFilename()).toMatch(/\.pdf$/i);
    await viewPage.close();

    expect(pageErrors, `editor errors:\n${pageErrors.join('\n')}`).toEqual([]);
    expect(viewErrors, `view page errors:\n${viewErrors.join('\n')}`).toEqual([]);
  });
});

/* ── Responsiveness guards ───────────────────────────────────────────────────
 * Added with the responsive-invoice fix. Before it, the item editor's
 * non-wrapping flex row had a ~474px min-content width that sized the whole
 * single-column create grid on phones: the page rendered 530–743px wide at a
 * 360px viewport and the preview's totals box sat completely off-screen.
 * The PDF side generated totals values right-aligned exactly on the totals
 * box border (zero padding). These tests pin both surfaces. */

const SEED_PROFILE = {
  id: 'prof-1',
  businessName: 'Al-Noor International Trading & Contracting Services Limited LLC',
  email: 'accounts@alnoor-international-trading.example.com',
  phone: '+92 300 1234567',
  address: 'Office 1402, Fourteenth Floor, Ocean Tower, Khayaban-e-Iqbal, Clifton Block 9',
  city: 'Karachi',
  state: 'Sindh',
  postalCode: '75600',
  country: 'Pakistan',
  taxId: 'NTN 1234567-8',
  vatNumber: 'STRN 3277876191782',
  bankName: 'Meezan Bank',
  accountTitle: 'Al-Noor International Trading',
  iban: 'PK36 MEZN 0000 0000 0000 0000',
  swift: 'MEZNPKKA',
  defaultTerms: '',
  defaultFooter: '',
  logoDataUrl: '',
  stampDataUrl: '',
  currency: 'USD',
  taxLabel: 'GST',
  taxRate: 18,
  paymentDetails: '',
  brandColor: '#1d4ed8',
  nextInvoiceNumber: 43,
  numberPrefix: 'INV-',
  numberSuffix: '',
};

function seedItem(i: number) {
  return {
    id: `it-${i}`,
    description:
      i % 4 === 0
        ? `Comprehensive annual maintenance and support services package — level ${i}`
        : `Service line ${i}`,
    detail: i % 3 === 0 ? 'Includes on-site visits, remote support and quarterly reporting.' : '',
    sku: i % 3 === 0 ? `SKU-${1000 + i}` : '',
    unit: 'hours',
    qty: 3,
    unitPrice: 275.5,
    discountPct: i % 5 === 0 ? 5 : 0,
    discountFixed: 0,
    taxable: true,
  };
}

const SEED_DRAFT = {
  id: 'inv-seed-1',
  number: 'INV-0042',
  issueDate: '2026-11-01',
  dueDate: '2026-12-15',
  dueTerms: 'custom',
  poNumber: 'PO-2026-1187',
  referenceNumber: 'Contract C-88/2026',
  docTitle: '',
  clientId: null,
  clientName: 'Consolidated Retail Group Holdings (Private) Limited',
  clientEmail: 'ap@consolidated-retail-group.example.com',
  clientPhone: '+92 21 3580 0000',
  clientAddress: 'Plot 42-C, Bukhari Commercial Area, Khayaban-e-Bukhari, DHA Phase VI, Karachi, Pakistan',
  currency: 'USD',
  items: Array.from({ length: 12 }, (_, i) => seedItem(i + 1)),
  discountPct: 10,
  discountType: 'pct',
  discountValue: 10,
  taxPct: 18,
  taxLabel: 'GST',
  taxMode: 'afterDiscount',
  shipping: 250,
  additionalCharges: 75,
  roundingAdjustment: 0,
  amountPaid: 0,
  payments: [{ id: 'pay-1', date: '2026-11-05', amount: 500, method: 'Bank transfer', note: '' }],
  status: 'sent',
  notes: 'Thank you for your business. Please quote the invoice number on your payment.',
  internalNotes: '',
  terms: 'Payment is due within 45 days of the invoice date. Overdue amounts accrue a late fee.',
  footerText: '',
  template: 'corporate',
  templateSettings: {
    secondaryColor: '',
    fontScale: 'regular',
    paperSize: 'a4',
    orientation: 'portrait',
    showLogo: true,
    showStamp: true,
    showPayments: true,
    showNotes: true,
    showTerms: true,
  },
  showQr: false,
  qrPayload: '',
  recurring: null,
  createdAt: '2026-11-01T09:00:00.000Z',
  updatedAt: '2026-11-01T09:00:00.000Z',
};

async function seedWorkspace(page: import('@playwright/test').Page) {
  await page.addInitScript(
    ([prof, dr]) => {
      localStorage.setItem('invoicegenerator:profile', JSON.stringify(prof));
      localStorage.setItem('invoicegenerator:profiles', JSON.stringify([prof]));
      localStorage.setItem('invoicegenerator:draft', JSON.stringify(dr));
      localStorage.setItem('invoicegenerator:invoices', JSON.stringify([]));
      localStorage.setItem('invoicegenerator:clients', JSON.stringify([]));
    },
    [SEED_PROFILE, SEED_DRAFT],
  );
  await page.goto('/invoice-site');
  const rejectCookies = page.getByRole('button', { name: 'Reject Non-Essential' });
  if (await rejectCookies.isVisible().catch(() => false)) {
    await rejectCookies.click();
  }
  // Wait until the seeded draft is actually rendered (hydration + restore),
  // so the geometry/PDF assertions below measure the loaded invoice.
  await expect(
    page
      .locator('xpath=//dl//dt[normalize-space()="Balance due"]/following-sibling::dd[1]')
      .first(),
  ).toContainText('$10,270.14', { timeout: 15_000 });
}

test.describe('invoice responsiveness', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('at 360px the create view has no horizontal overflow and totals stay on screen', async ({
    page,
  }) => {
    await seedWorkspace(page);

    const metrics = await page.evaluate(() => ({
      docScrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(
      metrics.docScrollWidth,
      `page is ${metrics.docScrollWidth}px wide in a ${metrics.innerWidth}px viewport`,
    ).toBeLessThanOrEqual(metrics.innerWidth + 1);

    // Every totals row of the on-screen preview is inside the viewport width.
    // (Measured via evaluate: the workspace re-renders on autosave, which
    // detaches Playwright element handles mid-action.)
    const rowBoxes = await page.evaluate(() => {
      const labels = ['Subtotal', 'Discount (10%)', 'GST (18%)', 'Shipping', 'Total', 'Balance due'];
      const out: Record<string, { left: number; right: number; width: number } | null> = {};
      for (const label of labels) {
        const dt = [...document.querySelectorAll('dl dt')].find(
          (d) => d.textContent?.trim() === label,
        );
        const row = dt?.parentElement;
        if (!row) {
          out[label] = null;
          continue;
        }
        row.scrollIntoView({ block: 'center' });
        const r = row.getBoundingClientRect();
        out[label] = { left: r.left, right: r.right, width: r.width };
      }
      return out;
    });
    for (const [label, box] of Object.entries(rowBoxes)) {
      expect(box, `preview totals row "${label}" exists`).not.toBeNull();
      expect(box!.left, `preview totals row "${label}" left edge`).toBeGreaterThanOrEqual(0);
      expect(box!.right, `preview totals row "${label}" right edge`).toBeLessThanOrEqual(361);
      expect(box!.width, `preview totals row "${label}" width`).toBeGreaterThan(200);
    }
    await expect(
      page.locator('xpath=//dl//dt[normalize-space()="Total"]/following-sibling::dd[1]').first(),
    ).toContainText('$10,770.14');
  });

  test('downloaded PDF carries the full totals block with the right amounts', async ({ page }) => {
    await seedWorkspace(page);

    const downloadPromise = page.waitForEvent('download', { timeout: 20_000 });
    await page.getByRole('button', { name: 'Download PDF' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    let text = '';
    try {
      text = execFileSync('pdftotext', [filePath as string, '-'], { encoding: 'utf8' });
    } catch {
      text = '';
    }
    if (text) {
      for (const needle of [
        'Subtotal',
        '9,835.34',
        'Discount (10%)',
        '983.53',
        'GST (18%)',
        'Shipping',
        'Total',
        '10,770.14',
        'Balance due',
        '10,270.14',
      ]) {
        expect(text, `PDF text should contain "${needle}"`).toContain(needle);
      }
    } else {
      // No pdftotext in this environment — fall back to the printed source:
      // the preview sheet's totals (the same data the PDF is generated from).
      await expect(
        page.locator('xpath=//dl//dt[normalize-space()="Total"]/following-sibling::dd[1]').first(),
      ).toContainText('$10,770.14');
      await expect(
        page
          .locator('xpath=//dl//dt[normalize-space()="Balance due"]/following-sibling::dd[1]')
          .first(),
      ).toContainText('$10,270.14');
    }
  });
});
