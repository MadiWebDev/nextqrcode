// Money-engine tests (spec §18): every amount runs through integer minor
// units, so each expectation below is exact — no float tolerances.
import { describe, expect, it } from 'vitest';
import { computeInvoice, roundHalfUp, toMinor } from '../invoice-engine';

describe('rounding helpers', () => {
  it('rounds half away from zero and tolerates float noise', () => {
    expect(roundHalfUp(100.49999999999999)).toBe(101); // 1.005 * 100 in binary
    expect(roundHalfUp(2.5)).toBe(3);
    expect(roundHalfUp(-2.5)).toBe(-3);
    expect(roundHalfUp(2.4)).toBe(2);
  });
  it('converts major to minor per currency digits', () => {
    expect(toMinor(1.005, 2)).toBe(101);
    expect(toMinor(100, 0)).toBe(100);
    expect(toMinor(1.234, 3)).toBe(1234);
  });
});

describe('line totals', () => {
  it('sums multiple items exactly', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [
        { qty: 2, unitPrice: 50 },
        { qty: 1, unitPrice: 25.5 },
      ],
    });
    expect(r.subtotal).toBe(125.5);
    expect(r.total).toBe(125.5);
    expect(r.lines.map((l) => l.net)).toEqual([100, 25.5]);
  });
  it('handles decimal quantities with a single rounding per line', () => {
    const r = computeInvoice({ currency: 'USD', items: [{ qty: 2.5, unitPrice: 33.33 }] });
    expect(r.lines[0].gross).toBe(83.33); // 8332.5 minor rounds half-up to 8333
    expect(r.total).toBe(83.33);
  });
  it('zero quantity and zero price contribute nothing', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [
        { qty: 0, unitPrice: 99 },
        { qty: 3, unitPrice: 0 },
      ],
    });
    expect(r.subtotal).toBe(0);
    expect(r.total).toBe(0);
    expect(r.paidInFull).toBe(false);
  });
  it('empty invoice totals zero', () => {
    const r = computeInvoice({ currency: 'USD', items: [] });
    expect(r.total).toBe(0);
    expect(r.balance).toBe(0);
  });
});

describe('item-level discounts', () => {
  it('percentage discount per line', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 100, discountPct: 10 }],
    });
    expect(r.itemDiscounts).toBe(10);
    expect(r.subtotal).toBe(90);
    expect(r.lines[0]).toEqual({ gross: 100, discount: 10, net: 90 });
  });
  it('fixed discount per line, capped at the line gross', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [
        { qty: 1, unitPrice: 100, discountFixed: 15 },
        { qty: 1, unitPrice: 20, discountFixed: 50 },
      ],
    });
    expect(r.itemDiscounts).toBe(35);
    expect(r.subtotal).toBe(85);
  });
  it('percentage then fixed discount stack on one line', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 100, discountPct: 10, discountFixed: 5 }],
    });
    expect(r.lines[0].net).toBe(85);
  });
});

describe('invoice-level discounts', () => {
  it('percentage discount', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 200 }],
      discountType: 'pct',
      discountValue: 10,
    });
    expect(r.discountAmount).toBe(20);
    expect(r.total).toBe(180);
  });
  it('fixed discount, capped at the subtotal', () => {
    const capped = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 200 }],
      discountType: 'fixed',
      discountValue: 500,
    });
    expect(capped.discountAmount).toBe(200);
    expect(capped.total).toBe(0);
  });
  it('clamps percentages above 100', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 80 }],
      discountType: 'pct',
      discountValue: 150,
    });
    expect(r.discountAmount).toBe(80);
    expect(r.total).toBe(0);
  });
  it('falls back to the legacy discountPct field', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 100 }],
      discountPct: 25,
    });
    expect(r.discountAmount).toBe(25);
  });
});

describe('tax', () => {
  it('taxes only taxable lines', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [
        { qty: 1, unitPrice: 100 },
        { qty: 1, unitPrice: 100, taxable: false },
      ],
      taxPct: 10,
    });
    expect(r.taxableBase).toBe(100);
    expect(r.taxAmount).toBe(10);
    expect(r.total).toBe(210);
  });
  it('after-discount mode taxes the discounted base (default)', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 200 }],
      discountType: 'pct',
      discountValue: 10,
      taxPct: 10,
    });
    expect(r.taxableBase).toBe(180);
    expect(r.taxAmount).toBe(18);
    expect(r.total).toBe(198);
  });
  it('before-discount mode taxes the undiscounted base', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 200 }],
      discountType: 'pct',
      discountValue: 10,
      taxPct: 10,
      taxMode: 'beforeDiscount',
    });
    expect(r.taxableBase).toBe(200);
    expect(r.taxAmount).toBe(20);
    expect(r.total).toBe(200);
  });
  it('spreads the invoice discount proportionally over taxable lines', () => {
    const after = computeInvoice({
      currency: 'USD',
      items: [
        { qty: 1, unitPrice: 100 },
        { qty: 1, unitPrice: 100, taxable: false },
      ],
      discountType: 'pct',
      discountValue: 10,
      taxPct: 10,
    });
    expect(after.taxableBase).toBe(90); // half the 20 discount lands on the taxable line
    expect(after.taxAmount).toBe(9);
  });
});

describe('shipping, extra charges and payments', () => {
  it('adds shipping and additional charges; ignores negatives', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 100 }],
      shipping: 10,
      additionalCharges: 5,
    });
    expect(r.total).toBe(115);
    const neg = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 100 }],
      shipping: -4,
      additionalCharges: -2,
    });
    expect(neg.total).toBe(100);
  });
  it('sums the manual lump sum and the payments ledger', () => {
    const r = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 300 }],
      amountPaid: 25,
      payments: [{ amount: 100 }, { amount: 50 }],
    });
    expect(r.totalPaid).toBe(175);
    expect(r.balance).toBe(125);
    expect(r.paidInFull).toBe(false);
  });
  it('detects full payment and never reports a negative balance', () => {
    const exact = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 300 }],
      payments: [{ amount: 300 }],
    });
    expect(exact.paidInFull).toBe(true);
    expect(exact.balance).toBe(0);
    const over = computeInvoice({
      currency: 'USD',
      items: [{ qty: 1, unitPrice: 300 }],
      payments: [{ amount: 450 }],
    });
    expect(over.balance).toBe(0);
    expect(over.paidInFull).toBe(true);
  });
});

describe('currency exponents', () => {
  it('JPY (0 digits): whole-yen rounding everywhere', () => {
    const r = computeInvoice({
      currency: 'JPY',
      items: [{ qty: 3, unitPrice: 333 }],
      taxPct: 10,
    });
    expect(r.digits).toBe(0);
    expect(r.subtotal).toBe(999);
    expect(r.taxAmount).toBe(100); // 99.9 rounds to 100
    expect(r.total).toBe(1099);
  });
  it('JPY: fractional yen prices round to whole yen', () => {
    const r = computeInvoice({ currency: 'JPY', items: [{ qty: 1, unitPrice: 99.9 }] });
    expect(r.subtotal).toBe(100);
  });
  it('KWD (3 digits): fils-level precision is preserved', () => {
    const r = computeInvoice({
      currency: 'KWD',
      items: [{ qty: 2, unitPrice: 1.234 }],
      taxPct: 5,
    });
    expect(r.digits).toBe(3);
    expect(r.subtotal).toBe(2.468);
    expect(r.taxAmount).toBe(0.123); // 0.1234 rounds to 0.123
    expect(r.total).toBe(2.591);
  });
  it('unknown currency codes default to 2 digits', () => {
    const r = computeInvoice({ currency: 'XXX', items: [{ qty: 1, unitPrice: 1.5 }] });
    expect(r.digits).toBe(2);
    expect(r.total).toBe(1.5);
  });
});
