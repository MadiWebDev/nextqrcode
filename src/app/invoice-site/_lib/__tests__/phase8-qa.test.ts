// Phase 8 final-QA tests (spec §18): status derivation edges the engine
// suite does not cover, PDF robustness (unicode, long content, JPY/KWD,
// watermarks), ZIP archive validity, and backup export→import round-trip
// fidelity at the data layer (the exact normalize-on-import path used by
// handleImportData in InvoiceApp).
import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import {
  effectiveStatus,
  normalizeClient,
  normalizeInvoice,
  normalizeProfile,
  type Invoice,
} from '../../InvoiceApp';
import { buildInvoicePdf, type PdfInvoice, type PdfProfile, type PdfTotals } from '../pdf';
import { computeInvoice } from '../invoice-engine';
import { DEFAULT_TEMPLATE_SETTINGS } from '../templates';

function makeStatusInvoice(patch: Partial<Invoice> = {}): Invoice {
  return normalizeInvoice({
    id: 'qa-inv-1',
    number: 'INV-QA-1',
    status: 'sent',
    issueDate: '2026-01-01',
    dueDate: '2999-01-01',
    currency: 'USD',
    clientName: 'QA Client',
    items: [
      {
        id: 'li-1',
        description: 'Consulting',
        detail: '',
        sku: '',
        unit: 'hours',
        qty: 2,
        unitPrice: 50,
        discountPct: 0,
        discountFixed: 0,
        taxable: true,
      },
    ],
    payments: [],
    ...patch,
  });
}

describe('effectiveStatus derivation (§18: fully paid / overdue / partial)', () => {
  it('fully paid invoice derives paid', () => {
    const inv = makeStatusInvoice({
      payments: [
        { id: 'p1', date: '2026-01-02', amount: 100, method: 'Bank transfer', note: '' },
      ],
    });
    expect(effectiveStatus(inv)).toBe('paid');
  });

  it('past-due invoice with a balance derives overdue', () => {
    const inv = makeStatusInvoice({ dueDate: '2020-06-01' });
    expect(effectiveStatus(inv)).toBe('overdue');
  });

  it('part-paid invoice past due is overdue, not partial (balance still owed)', () => {
    const inv = makeStatusInvoice({
      dueDate: '2020-06-01',
      payments: [{ id: 'p1', date: '2020-05-01', amount: 40, method: 'Cash', note: 'advance' }],
    });
    expect(effectiveStatus(inv)).toBe('overdue');
  });

  it('advance/part payment before the due date derives partial', () => {
    const inv = makeStatusInvoice({
      payments: [{ id: 'p1', date: '2026-01-02', amount: 40, method: 'Cash', note: 'deposit' }],
    });
    expect(effectiveStatus(inv)).toBe('partial');
  });

  it('draft stays draft even when past due; cancelled stays cancelled', () => {
    expect(effectiveStatus(makeStatusInvoice({ status: 'draft', dueDate: '2020-06-01' }))).toBe(
      'draft'
    );
    expect(effectiveStatus(makeStatusInvoice({ status: 'cancelled' }))).toBe('cancelled');
  });

  it('unpaid, not-yet-due invoice keeps its stored sent/viewed status', () => {
    expect(effectiveStatus(makeStatusInvoice({ status: 'sent' }))).toBe('sent');
    expect(effectiveStatus(makeStatusInvoice({ status: 'viewed' }))).toBe('viewed');
  });
});

/* ── PDF robustness ─────────────────────────────────────────────────── */

const pdfProfile: PdfProfile = {
  businessName: 'QA Studio — Ünïcode',
  email: 'billing@qa.example',
  phone: '+92 300 0000000',
  address: '1 Main Street',
  logoDataUrl: '',
  stampDataUrl: '',
  brandColor: '#1d4ed8',
  paymentDetails: 'IBAN: PK36 QA00 0000 0000 0000 00',
};

function makePdfInvoice(patch: Partial<PdfInvoice> = {}): PdfInvoice {
  return {
    number: 'INV-QA-1',
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
    items: [
      {
        description: 'Service line',
        detail: '',
        sku: '',
        unit: 'hours',
        qty: 2,
        unitPrice: 50,
      },
    ],
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

describe('buildInvoicePdf robustness (§18 PDF matrix)', () => {
  it('renders unicode names, long descriptions and a long client address', async () => {
    const inv = makePdfInvoice({
      clientName: 'Björk Guðmundsdóttir — 東京クライアント — عميل تجريبي',
      clientAddress:
        'Floor 12, Tower B\nLong Business District Avenue\nSecond line of the address block\nKarachi, Pakistan',
      items: [
        {
          description: `Detailed engagement notes ${'— with extensive supporting detail '.repeat(20)}`,
          detail: 'フェーズ 8 のテスト',
          sku: 'QA-Ω-1',
          unit: 'days',
          qty: 1.5,
          unitPrice: 333.33,
        },
      ],
    });
    const doc = await buildInvoicePdf(inv, pdfProfile, totalsFor(inv), 'Sent', null);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    expect(doc.output('datauristring')).toContain('application/pdf');
  });

  it('renders JPY (0-decimal) and KWD (3-decimal) invoices', async () => {
    const jpy = makePdfInvoice({
      currency: 'JPY',
      items: [
        { description: 'Tokyo work', detail: '', sku: '', unit: 'hours', qty: 3, unitPrice: 1500 },
      ],
    });
    const jpyDoc = await buildInvoicePdf(jpy, pdfProfile, totalsFor(jpy), 'Sent', null);
    expect(jpyDoc.getNumberOfPages()).toBeGreaterThanOrEqual(1);

    const kwd = makePdfInvoice({
      currency: 'KWD',
      taxPct: 5,
      items: [
        { description: 'Kuwait work', detail: '', sku: '', unit: 'pcs', qty: 7, unitPrice: 12.345 },
      ],
    });
    const kwdDoc = await buildInvoicePdf(kwd, pdfProfile, totalsFor(kwd), 'Sent', null);
    expect(kwdDoc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });

  it('renders PAID, OVERDUE and DRAFT watermarks without throwing', async () => {
    const cases = [
      ['Paid', 'PAID'],
      ['Overdue', 'OVERDUE'],
      ['Draft', 'DRAFT'],
    ] as const;
    for (const [statusLabel, stamp] of cases) {
      const inv = makePdfInvoice();
      const doc = await buildInvoicePdf(inv, pdfProfile, totalsFor(inv), statusLabel, stamp);
      expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    }
  });

  it('produces a valid ZIP archive of invoice PDFs', async () => {
    const zip = new JSZip();
    for (const n of ['INV-QA-1', 'INV-QA-2']) {
      const inv = makePdfInvoice({ number: n });
      const doc = await buildInvoicePdf(inv, pdfProfile, totalsFor(inv), 'Sent', null);
      zip.file(`${n}.pdf`, doc.output('arraybuffer'));
    }
    const buf = await zip.generateAsync({ type: 'arraybuffer' });
    const loaded = await JSZip.loadAsync(buf);
    const names = Object.keys(loaded.files).sort();
    expect(names).toEqual(['INV-QA-1.pdf', 'INV-QA-2.pdf']);
    const first = await loaded.files['INV-QA-1.pdf'].async('uint8array');
    // %PDF magic bytes
    expect([first[0], first[1], first[2], first[3]]).toEqual([0x25, 0x50, 0x44, 0x46]);
  });
});

/* ── Backup round-trip (§18 data matrix) ────────────────────────────── */

describe('backup export → import round-trip (§18 data matrix)', () => {
  it('re-normalizing an exported v2 backup reproduces the same records', () => {
    const profiles = [
      normalizeProfile({
        id: 'prof-1',
        businessName: 'QA Studio',
        email: 'hi@qa.example',
        currency: 'PKR',
      }),
      normalizeProfile({ id: 'prof-2', businessName: 'Second Co', currency: 'JPY' }),
    ];
    const clients = [
      normalizeClient({ id: 'cli-1', name: 'Client Co', email: 'ap@client.example' }),
    ];
    const invoices = [makeStatusInvoice()];
    const backup = {
      app: 'invoicegenerator',
      version: 2,
      exportedAt: '2026-11-13T00:00:00.000Z',
      profile: profiles[0],
      profiles,
      clients,
      invoices,
    };
    const parsed = JSON.parse(JSON.stringify(backup)) as typeof backup;
    // This is exactly what handleImportData applies on import.
    expect(parsed.profiles.map(normalizeProfile)).toEqual(profiles);
    expect(parsed.clients.map(normalizeClient)).toEqual(clients);
    expect(parsed.invoices.map(normalizeInvoice)).toEqual(invoices);
  });

  it('corrupt backup text fails JSON parsing (the handler rejects it before touching state)', () => {
    expect(() => JSON.parse('{"app":"invoicegenerator", broken')).toThrow();
    expect(() => JSON.parse('not a backup at all')).toThrow();
  });
});
