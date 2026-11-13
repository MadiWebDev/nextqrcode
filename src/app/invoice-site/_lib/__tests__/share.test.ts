// View-QR share link tests: the payload that travels inside a share URL
// fragment must round-trip losslessly (totals identical to the original
// invoice), must never carry images or private internal notes, and damaged
// or foreign payloads must be rejected cleanly by the /v page.
import { describe, expect, it } from 'vitest';
import { computeTotals, normalizeInvoice, normalizeProfile } from '../../InvoiceApp';
import {
  buildSharePayload,
  buildShareUrl,
  decodeSharePayload,
  encodeSharePayload,
  sharePayloadToInvoice,
  sharePayloadToProfile,
} from '../share';

function b64urlOf(text: string): string {
  return Buffer.from(text, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const profile = normalizeProfile({
  id: 'prof-1',
  businessName: 'Acme — Ünïcode Studio 北京',
  email: 'hello@acme.example',
  phone: '+1 555 0100',
  address: '1 Main Street',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'US',
  taxId: 'EIN 12-3456789',
  vatNumber: 'VAT-998',
  brandColor: '#0ea5e9',
  logoDataUrl: 'data:image/png;base64,SECRET_LOGO_BYTES',
  stampDataUrl: 'data:image/png;base64,SECRET_STAMP_BYTES',
});

function sampleInvoice() {
  return normalizeInvoice({
    id: 'inv-1',
    number: 'INV-0101',
    issueDate: '2026-11-01',
    dueDate: '2026-11-15',
    status: 'sent',
    currency: 'EUR',
    clientName: 'Müller & Söhne GmbH',
    clientEmail: 'ap@muller.example',
    clientPhone: '+49 30 000',
    clientAddress: 'Torstraße 1, 10119 Berlin',
    items: [
      {
        id: 'a',
        description: 'Consulting — café ☕ project',
        detail: 'On-site sprint',
        sku: 'SKU-1',
        unit: 'hours',
        qty: 2,
        unitPrice: 50,
        discountPct: 10,
        discountFixed: 0,
        taxable: true,
      },
      {
        id: 'b',
        description: 'Hosting',
        detail: '',
        sku: '',
        unit: '',
        qty: 1,
        unitPrice: 25.5,
        discountPct: 0,
        discountFixed: 5,
        taxable: false,
      },
    ],
    discountType: 'pct',
    discountValue: 5,
    taxPct: 19,
    taxLabel: 'VAT',
    taxMode: 'afterDiscount',
    shipping: 10,
    additionalCharges: 2,
    roundingAdjustment: 0,
    amountPaid: 20,
    payments: [{ id: 'p1', date: '2026-11-03', amount: 30, method: 'Bank transfer', note: '' }],
    notes: 'Thank you for your business.',
    internalNotes: 'DO_NOT_SHARE — chase this client weekly',
    terms: 'Net 14',
    template: 'corporate',
  } as never);
}

function roundTrip(inv: ReturnType<typeof sampleInvoice>) {
  const payload = buildSharePayload(inv, profile, computeTotals(inv).totalPaid);
  const decoded = decodeSharePayload(encodeSharePayload(payload));
  expect(decoded).not.toBeNull();
  const invoice2 = normalizeInvoice(sharePayloadToInvoice(decoded!));
  const profile2 = normalizeProfile(sharePayloadToProfile(decoded!));
  return { payload, decoded: decoded!, invoice2, profile2 };
}

describe('view-QR share payload', () => {
  it('round-trips losslessly — totals, items and parties identical', () => {
    const inv = sampleInvoice();
    const { invoice2, profile2 } = roundTrip(inv);
    const t1 = computeTotals(inv);
    const t2 = computeTotals(invoice2);
    expect(invoice2.number).toBe('INV-0101');
    expect(invoice2.currency).toBe('EUR');
    expect(invoice2.clientName).toBe('Müller & Söhne GmbH');
    expect(invoice2.items).toHaveLength(2);
    expect(invoice2.items[0].description).toBe('Consulting — café ☕ project');
    expect(invoice2.items[0].discountPct).toBe(10);
    expect(invoice2.items[1].discountFixed).toBe(5);
    expect(invoice2.items[1].taxable).toBe(false);
    expect(t2.subtotal).toBeCloseTo(t1.subtotal, 6);
    expect(t2.discountAmount).toBeCloseTo(t1.discountAmount, 6);
    expect(t2.taxAmount).toBeCloseTo(t1.taxAmount, 6);
    expect(t2.total).toBeCloseTo(t1.total, 6);
    // Paid total survives as amountPaid with an empty ledger.
    expect(invoice2.payments).toEqual([]);
    expect(invoice2.amountPaid).toBe(50);
    expect(t2.totalPaid).toBe(t1.totalPaid);
    expect(t2.balance).toBeCloseTo(t1.balance, 6);
    expect(profile2.businessName).toBe(profile.businessName);
    expect(profile2.taxId).toBe('EIN 12-3456789');
    expect(profile2.brandColor).toBe('#0ea5e9');
  });

  it('never carries images or private internal notes', () => {
    const inv = sampleInvoice();
    const payload = buildSharePayload(inv, profile, computeTotals(inv).totalPaid);
    const raw = JSON.stringify(payload);
    expect(raw).not.toContain('SECRET_LOGO_BYTES');
    expect(raw).not.toContain('SECRET_STAMP_BYTES');
    expect(raw).not.toContain('DO_NOT_SHARE');
    expect(raw).not.toContain('logoDataUrl');
    expect(sharePayloadToProfile(payload).logoDataUrl).toBe('');
    expect(sharePayloadToInvoice(payload).internalNotes).toBe('');
  });

  it('round-trips a zero-decimal currency (JPY) with a fixed discount', () => {
    const inv = normalizeInvoice({
      number: 'INV-0200',
      currency: 'JPY',
      status: 'sent',
      items: [
        {
          id: 'j1',
          description: '開発サポート',
          qty: 3,
          unitPrice: 1200,
          discountPct: 0,
          discountFixed: 0,
          taxable: true,
        },
      ],
      discountType: 'fixed',
      discountValue: 100,
      taxPct: 10,
      taxLabel: 'Consumption tax',
      shipping: 0,
    } as never);
    const { invoice2 } = roundTrip(inv);
    const t1 = computeTotals(inv);
    const t2 = computeTotals(invoice2);
    expect(invoice2.currency).toBe('JPY');
    expect(t2.total).toBe(t1.total);
    expect(t2.taxAmount).toBe(t1.taxAmount);
  });

  it('rejects damaged or foreign payloads', () => {
    expect(decodeSharePayload('')).toBeNull();
    expect(decodeSharePayload('%%%not-base64%%%')).toBeNull();
    expect(decodeSharePayload(b64urlOf('not json at all'))).toBeNull();
    expect(decodeSharePayload(b64urlOf('{"v":2,"items":[]}'))).toBeNull();
    expect(decodeSharePayload(b64urlOf('{"v":1,"currency":"EUR"}'))).toBeNull();
    expect(decodeSharePayload(b64urlOf('{"v":1,"currency":"EUR","items":[]}'))).toBeNull();
    expect(
      decodeSharePayload(
        b64urlOf('{"v":1,"currency":"EUR","items":[{"qty":"two","price":10}]}')
      )
    ).toBeNull();
    const good = encodeSharePayload(
      buildSharePayload(sampleInvoice(), profile, computeTotals(sampleInvoice()).totalPaid)
    );
    expect(decodeSharePayload(good.slice(0, Math.floor(good.length / 2)))).toBeNull();
  });

  it('builds URLs on the right base for the invoice host and other hosts', () => {
    const inv = sampleInvoice();
    const paid = computeTotals(inv).totalPaid;
    const sub = buildShareUrl(inv, profile, paid, {
      origin: 'https://invoicegenerator.freeqrcode.tools',
      hostname: 'invoicegenerator.freeqrcode.tools',
    });
    expect(sub.startsWith('https://invoicegenerator.freeqrcode.tools/v#')).toBe(true);
    const local = buildShareUrl(inv, profile, paid, {
      origin: 'http://localhost:3000',
      hostname: 'localhost',
    });
    expect(local.startsWith('http://localhost:3000/invoice-site/v#')).toBe(true);
    const fragment = sub.split('#')[1];
    expect(decodeSharePayload(fragment)).not.toBeNull();
  });
});
