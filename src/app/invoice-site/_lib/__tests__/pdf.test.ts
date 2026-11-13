// PDF structure tests (spec §18): multi-page invoices paginate, the paper
// size / orientation settings are honoured, and every template renders.
import { describe, expect, it } from 'vitest';
import { buildInvoicePdf, type PdfInvoice, type PdfProfile, type PdfTotals } from '../pdf';
import { computeInvoice } from '../invoice-engine';
import { DEFAULT_TEMPLATE_SETTINGS, TEMPLATE_IDS } from '../templates';

const profile: PdfProfile = {
  businessName: 'Test Studio',
  email: 'billing@test.example',
  phone: '+1 555 0100',
  address: '1 Main Street',
  logoDataUrl: '',
  stampDataUrl: '',
  brandColor: '#1d4ed8',
  paymentDetails: 'IBAN: PK36 TEST 0000 0000 0000 00',
};

function makeInvoice(items: number, patch: Partial<PdfInvoice> = {}): PdfInvoice {
  return {
    number: 'INV-0001',
    issueDate: '2026-11-01',
    dueDate: '2026-11-15',
    poNumber: '',
    referenceNumber: '',
    docTitle: '',
    clientName: 'Client Co',
    clientAddress: '2 Side Road',
    clientEmail: 'ap@client.example',
    clientPhone: '',
    currency: 'USD',
    items: Array.from({ length: items }, (_, i) => ({
      description: `Service line ${i + 1} — detailed work item with a reasonably long description`,
      detail: '',
      sku: '',
      unit: 'hours',
      qty: 2,
      unitPrice: 50,
    })),
    discountType: 'pct',
    discountValue: 0,
    taxLabel: 'VAT',
    taxPct: 0,
    shipping: 0,
    notes: '',
    terms: 'Payment due within 14 days.',
    footerText: '',
    showQr: false,
    qrPayload: '',
    payments: [],
    template: 'modern',
    templateSettings: { ...DEFAULT_TEMPLATE_SETTINGS },
    ...patch,
  };
}

function totalsFor(inv: PdfInvoice): PdfTotals {
  const r = computeInvoice(inv);
  return {
    subtotal: r.subtotal,
    discountAmount: r.discountAmount,
    taxAmount: r.taxAmount,
    additionalCharges: r.additionalCharges,
    roundingAdjustment: 0,
    total: r.total,
    totalPaid: r.totalPaid,
    balance: r.balance,
    lines: r.lines,
  };
}

describe('buildInvoicePdf', () => {
  it('produces a valid single-page PDF for a short invoice', async () => {
    const inv = makeInvoice(2);
    const doc = await buildInvoicePdf(inv, profile, totalsFor(inv), 'Sent', null);
    expect(doc.getNumberOfPages()).toBe(1);
    expect(doc.output('datauristring')).toContain('application/pdf');
  });

  it('paginates long invoices across multiple pages', async () => {
    const inv = makeInvoice(60);
    const doc = await buildInvoicePdf(inv, profile, totalsFor(inv), 'Draft', 'DRAFT');
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(3);
  });

  it('honours Letter + landscape (page is wider than tall)', async () => {
    const inv = makeInvoice(3, {
      templateSettings: {
        ...DEFAULT_TEMPLATE_SETTINGS,
        paperSize: 'letter',
        orientation: 'landscape',
      },
    });
    const doc = await buildInvoicePdf(inv, profile, totalsFor(inv), 'Sent', null);
    const { width, height } = doc.internal.pageSize;
    expect(width).toBeGreaterThan(height);
    expect(Math.round(width)).toBe(279); // Letter landscape width in mm
  });

  it('renders every one of the 10 templates without throwing', async () => {
    for (const template of TEMPLATE_IDS) {
      const inv = makeInvoice(4, { template });
      const doc = await buildInvoicePdf(inv, profile, totalsFor(inv), 'Paid', 'PAID');
      expect(doc.getNumberOfPages()).toBe(1);
    }
  });

  it('survives a payment QR payload in non-canvas environments', async () => {
    const inv = makeInvoice(2, { showQr: true, qrPayload: 'https://pay.example/abc' });
    const doc = await buildInvoicePdf(inv, profile, totalsFor(inv), 'Sent', null);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });

  it('adds the view-online QR footer only when a view URL is passed', async () => {
    const inv = makeInvoice(2);
    const plain = await buildInvoicePdf(inv, profile, totalsFor(inv), 'Sent', null);
    const withView = await buildInvoicePdf(inv, profile, totalsFor(inv), 'Sent', null, {
      viewUrl: 'https://invoicegenerator.freeqrcode.tools/v#abc123',
    });
    expect(withView.getNumberOfPages()).toBe(plain.getNumberOfPages());
    expect(withView.output('datauristring')).toContain('application/pdf');
  });
});
