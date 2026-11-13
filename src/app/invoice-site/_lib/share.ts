// _lib/share.ts — shareable read-only invoice links ("view QR").
//
// A finished invoice can be turned into a link (and a QR code of that link)
// that opens a read-only view of the invoice at /v. The invoice data travels
// INSIDE the URL fragment (#…): fragments are never sent to a server, so
// nothing is uploaded or stored anywhere — the recipient's browser decodes
// the invoice locally. The trade-off is stated in the share UI: anyone who
// holds the link or QR code can view that invoice.
//
// Deliberately excluded from the payload: logo / stamp / signature images
// (they would explode the URL size), the payment-ledger detail (only the
// total paid travels, so the shared totals are identical), and the private
// internal notes (they must never leave the device by accident).
//
// This module is pure: it takes the app's Invoice/Profile shapes as types
// only (no runtime import of InvoiceApp, so there is no import cycle) and
// reconstructs full objects on decode, which callers then pass through the
// app's normalizers as a final safety pass.
import type { DiscountType, Invoice, InvoiceStatus, Profile } from '../InvoiceApp';
import { DEFAULT_TEMPLATE_SETTINGS, TEMPLATE_IDS, type TemplateName } from './templates';
import type { TaxMode } from './invoice-engine';

/** The subdomain the invoice site is served on; share links use its root. */
export const INVOICE_SITE_HOST = 'invoicegenerator.freeqrcode.tools';

/** Above this URL length a QR code gets very dense — warn, but still render. */
export const SHARE_URL_DENSE_LIMIT = 2000;

export interface ShareItem {
  name: string;
  detail: string;
  sku: string;
  unit: string;
  qty: number;
  price: number;
  discountPct: number;
  discountFixed: number;
  taxable: boolean;
}

export interface SharePayloadV1 {
  v: 1;
  number: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: string;
  docTitle: string;
  poNumber: string;
  referenceNumber: string;
  business: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    phone: string;
    taxId: string;
    vatNumber: string;
    brandColor: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: ShareItem[];
  discountType: DiscountType;
  discountValue: number;
  taxLabel: string;
  taxPct: number;
  taxMode: TaxMode;
  shipping: number;
  additionalCharges: number;
  roundingAdjustment: number;
  /** Total paid (manual field + ledger sum). The ledger itself is not shared. */
  paidTotal: number;
  notes: string;
  terms: string;
  footerText: string;
  template: TemplateName;
}

/** Build the compact payload for a saved invoice + its business profile. */
export function buildSharePayload(
  invoice: Invoice,
  profile: Profile,
  totalPaid: number
): SharePayloadV1 {
  return {
    v: 1,
    number: invoice.number,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    status: invoice.status,
    currency: invoice.currency,
    docTitle: invoice.docTitle,
    poNumber: invoice.poNumber,
    referenceNumber: invoice.referenceNumber,
    business: {
      name: profile.businessName,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      postalCode: profile.postalCode,
      country: profile.country,
      email: profile.email,
      phone: profile.phone,
      taxId: profile.taxId,
      vatNumber: profile.vatNumber,
      brandColor: profile.brandColor,
    },
    client: {
      name: invoice.clientName,
      email: invoice.clientEmail,
      phone: invoice.clientPhone,
      address: invoice.clientAddress,
    },
    items: invoice.items.map((it) => ({
      name: it.description,
      detail: it.detail,
      sku: it.sku,
      unit: it.unit,
      qty: it.qty,
      price: it.unitPrice,
      discountPct: it.discountPct,
      discountFixed: it.discountFixed,
      taxable: it.taxable,
    })),
    discountType: invoice.discountType,
    discountValue: invoice.discountValue,
    taxLabel: invoice.taxLabel,
    taxPct: invoice.taxPct,
    taxMode: invoice.taxMode,
    shipping: invoice.shipping,
    additionalCharges: invoice.additionalCharges,
    roundingAdjustment: invoice.roundingAdjustment,
    paidTotal: totalPaid,
    notes: invoice.notes,
    terms: invoice.terms,
    footerText: invoice.footerText,
    template: invoice.template,
  };
}

/* ── base64url (UTF-8 safe) ─────────────────────────────────────────────── */

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(text: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(text)) return null;
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  try {
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

export function encodeSharePayload(payload: SharePayloadV1): string {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

/* ── decoding with strict structural validation ─────────────────────────── */

function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === 'object' && !Array.isArray(x);
}

function asString(x: unknown): string {
  return typeof x === 'string' ? x : '';
}

function asNumber(x: unknown): number | null {
  return typeof x === 'number' && Number.isFinite(x) ? x : null;
}

const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'sent', 'viewed', 'paid', 'cancelled'];

export function decodeSharePayload(encoded: string): SharePayloadV1 | null {
  if (!encoded) return null;
  const bytes = base64UrlToBytes(encoded.trim());
  if (!bytes) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    return null;
  }
  if (!isRecord(parsed) || parsed.v !== 1) return null;

  const currency = asString(parsed.currency).toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) return null;

  if (!Array.isArray(parsed.items) || parsed.items.length === 0) return null;
  const items: ShareItem[] = [];
  for (const raw of parsed.items) {
    if (!isRecord(raw)) return null;
    const qty = asNumber(raw.qty);
    const price = asNumber(raw.price);
    const discountPct = asNumber(raw.discountPct);
    const discountFixed = asNumber(raw.discountFixed);
    if (qty === null || price === null || discountPct === null || discountFixed === null) {
      return null;
    }
    items.push({
      name: asString(raw.name),
      detail: asString(raw.detail),
      sku: asString(raw.sku),
      unit: asString(raw.unit),
      qty,
      price,
      discountPct,
      discountFixed,
      taxable: raw.taxable !== false,
    });
  }

  const discountValue = asNumber(parsed.discountValue);
  const taxPct = asNumber(parsed.taxPct);
  const shipping = asNumber(parsed.shipping);
  const additionalCharges = asNumber(parsed.additionalCharges);
  const roundingAdjustment = asNumber(parsed.roundingAdjustment);
  const paidTotal = asNumber(parsed.paidTotal);
  if (
    discountValue === null ||
    taxPct === null ||
    shipping === null ||
    additionalCharges === null ||
    roundingAdjustment === null ||
    paidTotal === null
  ) {
    return null;
  }

  const business = isRecord(parsed.business) ? parsed.business : {};
  const client = isRecord(parsed.client) ? parsed.client : {};
  const brandColor = asString(business.brandColor);
  const status = INVOICE_STATUSES.includes(parsed.status as InvoiceStatus)
    ? (parsed.status as InvoiceStatus)
    : 'sent';

  return {
    v: 1,
    number: asString(parsed.number),
    issueDate: asString(parsed.issueDate),
    dueDate: asString(parsed.dueDate),
    status,
    currency,
    docTitle: asString(parsed.docTitle),
    poNumber: asString(parsed.poNumber),
    referenceNumber: asString(parsed.referenceNumber),
    business: {
      name: asString(business.name),
      address: asString(business.address),
      city: asString(business.city),
      state: asString(business.state),
      postalCode: asString(business.postalCode),
      country: asString(business.country),
      email: asString(business.email),
      phone: asString(business.phone),
      taxId: asString(business.taxId),
      vatNumber: asString(business.vatNumber),
      brandColor: /^#[0-9a-f]{6}$/i.test(brandColor) ? brandColor : '#1d4ed8',
    },
    client: {
      name: asString(client.name),
      email: asString(client.email),
      phone: asString(client.phone),
      address: asString(client.address),
    },
    items,
    discountType: parsed.discountType === 'fixed' ? 'fixed' : 'pct',
    discountValue,
    taxLabel: asString(parsed.taxLabel) || 'VAT',
    taxPct,
    taxMode: parsed.taxMode === 'beforeDiscount' ? 'beforeDiscount' : 'afterDiscount',
    shipping,
    additionalCharges,
    roundingAdjustment,
    paidTotal,
    notes: asString(parsed.notes),
    terms: asString(parsed.terms),
    footerText: asString(parsed.footerText),
    template: TEMPLATE_IDS.includes(parsed.template as TemplateName)
      ? (parsed.template as TemplateName)
      : 'modern',
  };
}

/* ── reconstruction into full app objects ───────────────────────────────── */

/**
 * Rebuild a full Invoice from a validated payload. The paid total becomes
 * the manual `amountPaid` field with an empty ledger, which the totals
 * engine treats identically (total paid = amountPaid + sum(payments)).
 * Fields that are never shared (internal notes, recurring plan, images,
 * payment QR) get their safe defaults.
 */
export function sharePayloadToInvoice(payload: SharePayloadV1): Invoice {
  return {
    id: '',
    number: payload.number,
    issueDate: payload.issueDate,
    dueDate: payload.dueDate,
    dueTerms: 'custom',
    poNumber: payload.poNumber,
    referenceNumber: payload.referenceNumber,
    docTitle: payload.docTitle,
    clientId: null,
    clientName: payload.client.name,
    clientEmail: payload.client.email,
    clientPhone: payload.client.phone,
    clientAddress: payload.client.address,
    currency: payload.currency,
    items: payload.items.map((it, i) => ({
      id: `shared-${i + 1}`,
      description: it.name,
      detail: it.detail,
      sku: it.sku,
      unit: it.unit,
      qty: it.qty,
      unitPrice: it.price,
      discountPct: it.discountPct,
      discountFixed: it.discountFixed,
      taxable: it.taxable,
    })),
    discountPct: payload.discountType === 'pct' ? payload.discountValue : 0,
    discountType: payload.discountType,
    discountValue: payload.discountValue,
    taxPct: payload.taxPct,
    taxLabel: payload.taxLabel,
    taxMode: payload.taxMode,
    shipping: payload.shipping,
    additionalCharges: payload.additionalCharges,
    roundingAdjustment: payload.roundingAdjustment,
    amountPaid: payload.paidTotal,
    payments: [],
    status: payload.status,
    notes: payload.notes,
    internalNotes: '',
    terms: payload.terms,
    footerText: payload.footerText,
    template: payload.template,
    templateSettings: { ...DEFAULT_TEMPLATE_SETTINGS },
    showQr: false,
    qrPayload: '',
    recurring: null,
    createdAt: '',
    updatedAt: '',
  };
}

/** Rebuild the issuing business as a Profile (no images, no bank details). */
export function sharePayloadToProfile(payload: SharePayloadV1): Profile {
  return {
    id: 'shared',
    businessName: payload.business.name,
    email: payload.business.email,
    phone: payload.business.phone,
    address: payload.business.address,
    city: payload.business.city,
    state: payload.business.state,
    postalCode: payload.business.postalCode,
    country: payload.business.country,
    taxId: payload.business.taxId,
    vatNumber: payload.business.vatNumber,
    bankName: '',
    accountTitle: '',
    iban: '',
    swift: '',
    defaultTerms: '',
    defaultFooter: '',
    logoDataUrl: '',
    stampDataUrl: '',
    currency: payload.currency,
    taxLabel: payload.taxLabel,
    taxRate: payload.taxPct,
    paymentDetails: '',
    brandColor: payload.business.brandColor,
    nextInvoiceNumber: 1,
    numberPrefix: 'INV-',
    numberSuffix: '',
  };
}

/**
 * The shareable view URL for an invoice. On the invoice subdomain the view
 * page is served at the root (/v); anywhere else the app lives under
 * /invoice-site, so the link points there instead.
 */
export function buildShareUrl(
  invoice: Invoice,
  profile: Profile,
  totalPaid: number,
  loc: { origin: string; hostname: string }
): string {
  const base = loc.hostname === INVOICE_SITE_HOST ? '' : '/invoice-site';
  return `${loc.origin}${base}/v#${encodeSharePayload(buildSharePayload(invoice, profile, totalPaid))}`;
}
