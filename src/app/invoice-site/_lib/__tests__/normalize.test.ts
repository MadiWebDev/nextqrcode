// Data-compatibility tests (spec §11/§18): saves written by older versions
// of the app must keep loading with safe defaults after every upgrade.
import { describe, expect, it } from 'vitest';
import {
  normalizeClient,
  normalizeInvoice,
  normalizeProfile,
} from '../../InvoiceApp';

describe('normalizeInvoice', () => {
  it('fills every field for an empty object', () => {
    const inv = normalizeInvoice({});
    expect(inv.status).toBe('draft');
    expect(inv.taxMode).toBe('afterDiscount');
    expect(inv.items).toHaveLength(1);
    expect(inv.items[0].taxable).toBe(true);
    expect(inv.template).toBe('modern');
    expect(inv.templateSettings.paperSize).toBe('a4');
  });

  it('upgrades a pre-Phase-2 saved invoice (no item extras, no tax mode)', () => {
    const old = {
      id: 'x1',
      number: 'INV-0007',
      currency: 'PKR',
      items: [{ id: 'i1', description: 'Logo design', qty: 1, unitPrice: 5000 }],
      discountPct: 10,
      taxPct: 17,
      status: 'sent',
    } as never;
    const inv = normalizeInvoice(old);
    expect(inv.number).toBe('INV-0007');
    expect(inv.items[0]).toMatchObject({
      description: 'Logo design',
      discountPct: 0,
      discountFixed: 0,
      taxable: true,
      sku: '',
      unit: '',
    });
    expect(inv.discountValue).toBe(10); // legacy discountPct mirrored
    expect(inv.additionalCharges).toBe(0);
    expect(inv.roundingAdjustment).toBe(0);
    expect(inv.internalNotes).toBe('');
  });

  it('rejects unknown statuses and templates', () => {
    const inv = normalizeInvoice({ status: 'weird', template: 'neon' } as never);
    expect(inv.status).toBe('draft');
    expect(inv.template).toBe('modern');
  });

  it('clamps the recurring interval into 1..36', () => {
    const inv = normalizeInvoice({
      recurring: { frequency: 'weekly', intervalCount: 99, nextDate: '2026-12-01', active: true },
    } as never);
    expect(inv.recurring?.intervalCount).toBe(36);
    expect(inv.recurring?.frequency).toBe('weekly');
  });
});

describe('normalizeProfile', () => {
  it('assigns an id and numbering defaults to a legacy single profile', () => {
    const p = normalizeProfile({ businessName: 'Studio', nextInvoiceNumber: 42 });
    expect(p.id).not.toBe('');
    expect(p.nextInvoiceNumber).toBe(42);
    expect(p.numberPrefix).toBe('INV-');
    expect(p.taxId).toBe('');
    expect(p.defaultTerms).toBe('');
  });
});

describe('normalizeClient', () => {
  it('fills the extended client fields', () => {
    const c = normalizeClient({ name: 'Acme' });
    expect(c.company).toBe('');
    expect(c.defaultCurrency).toBe('');
    expect(c.terms).toBe('');
    expect(c.shippingAddress).toBe('');
  });
});
