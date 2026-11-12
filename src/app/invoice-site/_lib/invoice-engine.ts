// _lib/invoice-engine.ts
// Money engine: every amount is converted to integer minor units (cents, paisa, fils...)
// before any arithmetic, so totals never drift and always equal the sum of the figures shown.
// Rounding rule: half away from zero, applied once per derived amount (line, discount, tax).

import { currencyDigits } from '../_data/currencies';

export type TaxMode = 'afterDiscount' | 'beforeDiscount';

export interface EngineItem {
  qty: number;
  unitPrice: number;
  /** Optional per-line percentage discount (0–100). */
  discountPct?: number;
  /** Optional per-line fixed discount in major units. Applied after the % discount. */
  discountFixed?: number;
  /** Defaults to true. Non-taxable lines are excluded from the tax base. */
  taxable?: boolean;
}

export interface EngineInput {
  currency?: string;
  items: EngineItem[];
  discountType?: 'pct' | 'fixed';
  discountValue?: number;
  /** Legacy field, used when discountValue is missing. */
  discountPct?: number;
  taxPct?: number;
  /** afterDiscount (default): tax is charged on the discounted amount. beforeDiscount: on the undiscounted amount. */
  taxMode?: TaxMode;
  shipping?: number;
  /** Extra charges such as handling or late fees (major units, >= 0). */
  additionalCharges?: number;
  amountPaid?: number;
  payments?: { amount: number }[];
}

export interface EngineResult {
  digits: number;
  /** Everything below is in major units, already rounded to the currency's decimals. */
  subtotal: number;
  itemDiscounts: number;
  discountAmount: number;
  taxableBase: number;
  taxAmount: number;
  shipping: number;
  additionalCharges: number;
  total: number;
  totalPaid: number;
  balance: number;
  paidInFull: boolean;
}

const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};
const clampPct = (v: unknown): number => Math.min(100, Math.max(0, num(v)));

/** Half away from zero, tolerant of binary float noise such as 1.005 * 100 = 100.49999999999999. */
export function roundHalfUp(x: number): number {
  const fixed = Number(x.toPrecision(15));
  return fixed < 0 ? -Math.round(-fixed) : Math.round(fixed);
}

export const toMinor = (major: number, digits: number): number =>
  roundHalfUp(num(major) * 10 ** digits);

export const fromMinor = (minor: number, digits: number): number => minor / 10 ** digits;

export function computeInvoice(inv: EngineInput): EngineResult {
  const digits = currencyDigits(inv.currency ?? 'USD');
  const f = 10 ** digits;

  let gross = 0; // sum of qty * price
  let itemDiscounts = 0;
  let net = 0; // sum of line nets
  let taxableNet = 0;

  for (const it of inv.items ?? []) {
    const lineGross = roundHalfUp(num(it.qty) * toMinor(num(it.unitPrice), digits));
    const pctOff = roundHalfUp((lineGross * clampPct(it.discountPct)) / 100);
    const fixedOff = Math.min(
      Math.max(0, toMinor(num(it.discountFixed), digits)),
      lineGross - pctOff
    );
    const off = pctOff + fixedOff;
    const lineNet = lineGross - off;
    gross += lineGross;
    itemDiscounts += off;
    net += lineNet;
    if (it.taxable !== false) taxableNet += lineNet;
  }

  const type = inv.discountType ?? 'pct';
  const dv = inv.discountValue ?? inv.discountPct ?? 0;
  const discount =
    type === 'fixed'
      ? Math.min(Math.max(0, toMinor(num(dv), digits)), net)
      : roundHalfUp((net * clampPct(dv)) / 100);

  // Spread the invoice-level discount across taxable / non-taxable lines in proportion.
  const taxableDiscount = net > 0 ? roundHalfUp((discount * taxableNet) / net) : 0;
  const mode: TaxMode = inv.taxMode ?? 'afterDiscount';
  const taxableBase =
    mode === 'beforeDiscount' ? taxableNet : Math.max(0, taxableNet - taxableDiscount);
  const tax = roundHalfUp((taxableBase * clampPct(inv.taxPct)) / 100);

  const shipping = Math.max(0, toMinor(num(inv.shipping), digits));
  const extra = Math.max(0, toMinor(num(inv.additionalCharges), digits));
  const total = net - discount + tax + shipping + extra;

  const paid =
    Math.max(0, toMinor(num(inv.amountPaid), digits)) +
    (inv.payments ?? []).reduce((s, p) => s + toMinor(num(p.amount), digits), 0);
  const balance = Math.max(0, total - paid);

  const m = (x: number) => x / f;
  return {
    digits,
    subtotal: m(net),
    itemDiscounts: m(itemDiscounts),
    discountAmount: m(discount),
    taxableBase: m(taxableBase),
    taxAmount: m(tax),
    shipping: m(shipping),
    additionalCharges: m(extra),
    total: m(total),
    totalPaid: m(paid),
    balance: m(balance),
    paidInFull: total > 0 && paid >= total,
  };
}
