'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  Copy,
  Download,
  FilePlus2,
  FileText,
  GripVertical,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Pencil,
  Plus,
  Printer,
  Repeat,
  Save,
  Search,
  Settings as SettingsIcon,
  Trash2,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import JsPDF from 'jspdf';
import { toDataURL } from 'qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ALL_CURRENCIES, currencyDigits, currencyLabel } from './_data/currencies';
import { computeInvoice, type TaxMode } from './_lib/invoice-engine';
import {
  DEFAULT_TEMPLATE_SETTINGS,
  TEMPLATE_IDS,
  TEMPLATES,
  normalizeTemplateSettings,
  templateDef,
  type TemplateName,
  type TemplateSettings,
} from './_lib/templates';
import { buildInvoicePdf } from './_lib/pdf';
import { parseCsv, toCsv } from './_lib/csv';

export type { TaxMode };

/** Unit types offered for invoice lines ('' renders as no unit). */
const UNIT_TYPES: Array<{ value: string; label: string }> = [
  { value: '', label: 'Unit' },
  { value: 'pcs', label: 'pieces' },
  { value: 'hours', label: 'hours' },
  { value: 'days', label: 'days' },
  { value: 'weeks', label: 'weeks' },
  { value: 'months', label: 'months' },
  { value: 'services', label: 'services' },
  { value: 'projects', label: 'projects' },
  { value: 'sessions', label: 'sessions' },
  { value: 'kg', label: 'kg' },
];

/* ── Types ─────────────────────────────────────────────────────────── */

export interface Profile {
  /** Stable id — a user can keep several business profiles. */
  id: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  /** Tax identification number (NTN, EIN, TRN…). */
  taxId: string;
  /** VAT / GST registration number, when registered. */
  vatNumber: string;
  bankName: string;
  accountTitle: string;
  iban: string;
  swift: string;
  /** Default terms + footer applied to new invoices from this profile. */
  defaultTerms: string;
  defaultFooter: string;
  logoDataUrl: string;
  stampDataUrl: string;
  currency: string;
  taxLabel: string;
  taxRate: number;
  paymentDetails: string;
  brandColor: string;
  nextInvoiceNumber: number;
  /** Invoice numbers are built as prefix + zero-padded number + suffix. */
  numberPrefix: string;
  numberSuffix: string;
}

export interface Client {
  id: string;
  name: string;
  /** Company / organisation name, when different from the contact name. */
  company: string;
  contactPerson: string;
  email: string;
  address: string;
  shippingAddress: string;
  phone: string;
  taxId: string;
  country: string;
  notes: string;
  /** Preferred currency for new invoices to this client ('' = profile default). */
  defaultCurrency: string;
  /** Client-specific payment terms text ('' = profile default). */
  terms: string;
}

export interface LineItem {
  id: string;
  description: string;
  /** Longer detail shown under the item name on the document. */
  detail: string;
  /** SKU / product code. */
  sku: string;
  /** Unit type: hours, pieces, days, services… ('' = unspecified). */
  unit: string;
  qty: number;
  unitPrice: number;
  /** Per-line percentage discount (0–100). */
  discountPct: number;
  /** Per-line fixed discount in the invoice currency. */
  discountFixed: number;
  /** Non-taxable lines are excluded from the tax base. */
  taxable: boolean;
}

export type PaymentMethod = 'Cash' | 'Bank transfer' | 'Card' | 'Cheque' | 'Other';

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  note: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'cancelled';
export type EffectiveStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'partial'
  | 'overdue'
  | 'paid'
  | 'cancelled';
export type DiscountType = 'pct' | 'fixed';
export type DueTerms = 'receipt' | 'net7' | 'net14' | 'net30' | 'net60' | 'custom';
export type RecurringFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Recurring {
  frequency: RecurringFrequency;
  /** Repeat every N x frequency (1 = plain weekly/monthly/…). */
  intervalCount: number;
  nextDate: string;
  active: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  dueTerms: DueTerms;
  poNumber: string;
  /** Separate reference (contract, order confirmation…) shown next to the PO field. */
  referenceNumber: string;
  /** Document heading override, e.g. "TAX INVOICE" ('' = default "INVOICE"). */
  docTitle: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  currency: string;
  items: LineItem[];
  /** Legacy mirror of discountValue when discountType is 'pct' (kept for older saved data). */
  discountPct: number;
  discountType: DiscountType;
  discountValue: number;
  taxPct: number;
  taxLabel: string;
  /** Whether tax is charged on the amount after or before the invoice discount. */
  taxMode: TaxMode;
  shipping: number;
  /** Extra charges (handling, late fee…) added after tax. */
  additionalCharges: number;
  /** Manual rounding adjustment applied to the final total (may be negative). */
  roundingAdjustment: number;
  /** Manual lump-sum paid field (legacy). Total paid = amountPaid + sum(payments). */
  amountPaid: number;
  payments: Payment[];
  status: InvoiceStatus;
  notes: string;
  /** Private notes — never printed on the preview or the PDF. */
  internalNotes: string;
  terms: string;
  /** Custom footer line printed at the bottom of the document ('' = none). */
  footerText: string;
  template: TemplateName;
  templateSettings: TemplateSettings;
  showQr: boolean;
  qrPayload: string;
  recurring: Recurring | null;
  createdAt: string;
  updatedAt: string;
}

interface Totals {
  subtotal: number;
  /** Sum of per-line discounts (already reflected in the subtotal). */
  itemDiscounts: number;
  discountAmount: number;
  taxAmount: number;
  additionalCharges: number;
  roundingAdjustment: number;
  total: number;
  totalPaid: number;
  balance: number;
  paidInFull: boolean;
  /** Per-line net amounts, aligned by index with the invoice's items. */
  lines: Array<{ gross: number; discount: number; net: number }>;
}

/* ── Constants & helpers ───────────────────────────────────────────── */

const PROFILE_KEY = 'invoicegenerator:profile';
const PROFILES_KEY = 'invoicegenerator:profiles';
const DRAFT_KEY = 'invoicegenerator:draft';
const CLIENTS_KEY = 'invoicegenerator:clients';
const INVOICES_KEY = 'invoicegenerator:invoices';

const CURRENCIES = ALL_CURRENCIES.map((c) => c.code);
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank transfer', 'Card', 'Cheque', 'Other'];
const DUE_TERMS_LABELS: Record<DueTerms, string> = {
  receipt: 'Due on receipt',
  net7: 'Net 7',
  net14: 'Net 14',
  net30: 'Net 30',
  net60: 'Net 60',
  custom: 'Custom date',
};
const DUE_TERMS_DAYS: Partial<Record<DueTerms, number>> = {
  net7: 7,
  net14: 14,
  net30: 30,
  net60: 60,
};
export function recurringLabel(rec: Recurring): string {
  const base = RECURRING_LABELS[rec.frequency];
  return rec.intervalCount > 1 ? `Every ${rec.intervalCount} × ${base.toLowerCase()}` : base;
}

const RECURRING_LABELS: Record<RecurringFrequency, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

const DEFAULT_PROFILE: Profile = {
  id: '',
  businessName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  taxId: '',
  vatNumber: '',
  bankName: '',
  accountTitle: '',
  iban: '',
  swift: '',
  defaultTerms: '',
  defaultFooter: '',
  logoDataUrl: '',
  stampDataUrl: '',
  currency: 'USD',
  taxLabel: 'VAT',
  taxRate: 0,
  paymentDetails: '',
  brandColor: '#1d4ed8',
  nextInvoiceNumber: 1,
  numberPrefix: 'INV-',
  numberSuffix: '',
};

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function addMonthsIso(iso: string, months: number): string {
  const d = new Date(`${iso}T00:00:00`);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return d.toISOString().slice(0, 10);
}

function shiftDateByFrequency(
  iso: string,
  frequency: RecurringFrequency,
  intervalCount = 1
): string {
  const n = Math.min(36, Math.max(1, Math.floor(intervalCount) || 1));
  switch (frequency) {
    case 'weekly':
      return addDaysIso(iso, 7 * n);
    case 'monthly':
      return addMonthsIso(iso, n);
    case 'quarterly':
      return addMonthsIso(iso, 3 * n);
    case 'yearly':
      return addMonthsIso(iso, 12 * n);
  }
}

/** Due date implied by a terms preset, or null for the custom preset. */
function dueDateForPreset(preset: DueTerms, issueIso: string): string | null {
  if (preset === 'receipt') return issueIso;
  const days = DUE_TERMS_DAYS[preset];
  return days ? addDaysIso(issueIso, days) : null;
}

function formatInvoiceNumber(n: number, prefix = 'INV-', suffix = ''): string {
  return `${prefix}${String(Math.max(1, Math.floor(n) || 1)).padStart(4, '0')}${suffix}`;
}

function money(value: number, currency: string, forPdf = false): string {
  const digits = currencyDigits(currency);
  try {
    const out = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      // The PDF uses built-in Latin fonts, which cannot draw symbols such as ₹ ₩ ₪ ₫,
      // so PDFs show the ISO code (e.g. "INR 1,000.00") instead of a symbol.
      currencyDisplay: forPdf ? 'code' : 'symbol',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
    return forPdf ? out.replace(/\u00a0/g, ' ') : out;
  } catch {
    return `${currency} ${value.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })}`;
  }
}

function clampPct(v: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(v) ? v : 0));
}

function paymentsSum(inv: Pick<Invoice, 'payments'>): number {
  return (inv.payments ?? []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

function computeTotals(
  inv: Pick<
    Invoice,
    | 'items'
    | 'discountPct'
    | 'discountType'
    | 'discountValue'
    | 'taxPct'
    | 'taxMode'
    | 'shipping'
    | 'additionalCharges'
    | 'roundingAdjustment'
    | 'amountPaid'
    | 'payments'
  > &
    Partial<Pick<Invoice, 'currency'>>
): Totals {
  // All arithmetic happens in integer minor units inside the engine (see _lib/invoice-engine.ts).
  const r = computeInvoice(inv);
  // The rounding adjustment is a deliberate, user-entered correction to the
  // final total (e.g. rounding a cash total to the nearest whole unit). It is
  // applied after the engine so the engine's own figures stay exact.
  const adj = Number(inv.roundingAdjustment) || 0;
  const total = Math.max(0, r.total + adj);
  const balance = Math.max(0, total - r.totalPaid);
  return {
    subtotal: r.subtotal,
    itemDiscounts: r.itemDiscounts,
    discountAmount: r.discountAmount,
    taxAmount: r.taxAmount,
    additionalCharges: r.additionalCharges,
    roundingAdjustment: adj,
    total,
    totalPaid: r.totalPaid,
    balance,
    paidInFull: total > 0 && r.totalPaid >= total,
    lines: r.lines,
  };
}

/**
 * The status a client would understand: stored 'draft' stays draft; a fully
 * covered invoice is paid; a past-due balance is overdue; a part-paid invoice
 * is partial; everything else falls back to the stored status.
 */
export function effectiveStatus(inv: Invoice): EffectiveStatus {
  if (inv.status === 'cancelled') return 'cancelled';
  if (inv.status === 'draft') return 'draft';
  const t = computeTotals(inv);
  if (t.total > 0 && t.totalPaid >= t.total) return 'paid';
  if (t.balance > 0 && inv.dueDate && inv.dueDate < todayIso()) return 'overdue';
  if (t.totalPaid > 0) return 'partial';
  if (inv.status === 'paid') return 'paid';
  return inv.status === 'viewed' ? 'viewed' : 'sent';
}

const STATUS_LABELS: Record<EffectiveStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  partial: 'Partially paid',
  overdue: 'Overdue',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

const STATUS_STYLES: Record<EffectiveStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border border-slate-300',
  sent: 'bg-blue-100 text-blue-800 border border-blue-300',
  viewed: 'bg-violet-100 text-violet-800 border border-violet-300',
  partial: 'bg-amber-100 text-amber-800 border border-amber-300',
  overdue: 'bg-red-100 text-red-800 border border-red-300',
  paid: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  cancelled: 'bg-neutral-200 text-neutral-500 border border-neutral-300',
};

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) } as T;
  } catch {
    return fallback;
  }
}

function loadLSArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function saveLS(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full (usually a large logo) — the app keeps working in memory.
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return { r: 29, g: 78, b: 216 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** A fresh, fully-populated line item (all fields present, amounts zero). */
export function blankLineItem(): LineItem {
  return {
    id: uid(),
    description: '',
    detail: '',
    sku: '',
    unit: '',
    qty: 1,
    unitPrice: 0,
    discountPct: 0,
    discountFixed: 0,
    taxable: true,
  };
}

const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'sent', 'viewed', 'paid', 'cancelled'];

/** Fill every field an older saved invoice might be missing, with safe defaults. */
export function normalizeInvoice(raw: Partial<Invoice>): Invoice {
  const payments: Payment[] = Array.isArray(raw.payments)
    ? raw.payments
        .filter((p): p is Payment => !!p && typeof p === 'object')
        .map((p) => ({
          id: p.id || uid(),
          date: p.date || '',
          amount: Number(p.amount) || 0,
          method: PAYMENT_METHODS.includes(p.method) ? p.method : 'Other',
          note: p.note || '',
        }))
    : [];
  const discountType: DiscountType = raw.discountType === 'fixed' ? 'fixed' : 'pct';
  const discountValue = raw.discountValue ?? raw.discountPct ?? 0;
  const recurring: Recurring | null =
    raw.recurring && typeof raw.recurring === 'object'
      ? {
          frequency: (
            ['weekly', 'monthly', 'quarterly', 'yearly'] as RecurringFrequency[]
          ).includes(raw.recurring.frequency)
            ? raw.recurring.frequency
            : 'monthly',
          intervalCount: Math.min(
            36,
            Math.max(1, Math.floor(Number(raw.recurring.intervalCount) || 1))
          ),
          nextDate: raw.recurring.nextDate || todayIso(),
          active: raw.recurring.active !== false,
        }
      : null;
  return {
    id: raw.id ?? '',
    number: raw.number ?? '',
    issueDate: raw.issueDate ?? todayIso(),
    dueDate: raw.dueDate ?? todayIso(),
    dueTerms: raw.dueTerms ?? 'custom',
    poNumber: raw.poNumber ?? '',
    referenceNumber: raw.referenceNumber ?? '',
    docTitle: raw.docTitle ?? '',
    clientId: raw.clientId ?? null,
    clientName: raw.clientName ?? '',
    clientEmail: raw.clientEmail ?? '',
    clientPhone: raw.clientPhone ?? '',
    clientAddress: raw.clientAddress ?? '',
    currency: raw.currency ?? 'USD',
    items:
      Array.isArray(raw.items) && raw.items.length > 0
        ? raw.items.map((it) => ({
            id: it.id || uid(),
            description: it.description ?? '',
            detail: it.detail ?? '',
            sku: it.sku ?? '',
            unit: it.unit ?? '',
            qty: Number(it.qty) || 0,
            unitPrice: Number(it.unitPrice) || 0,
            discountPct: Number(it.discountPct) || 0,
            discountFixed: Number(it.discountFixed) || 0,
            taxable: it.taxable !== false,
          }))
        : [blankLineItem()],
    discountPct: discountType === 'pct' ? discountValue : (raw.discountPct ?? 0),
    discountType,
    discountValue,
    taxPct: raw.taxPct ?? 0,
    taxLabel: raw.taxLabel ?? 'VAT',
    taxMode: raw.taxMode === 'beforeDiscount' ? 'beforeDiscount' : 'afterDiscount',
    shipping: raw.shipping ?? 0,
    additionalCharges: Number(raw.additionalCharges) || 0,
    roundingAdjustment: Number(raw.roundingAdjustment) || 0,
    amountPaid: raw.amountPaid ?? 0,
    payments,
    status: INVOICE_STATUSES.includes(raw.status as InvoiceStatus)
      ? (raw.status as InvoiceStatus)
      : 'draft',
    notes: raw.notes ?? '',
    internalNotes: raw.internalNotes ?? '',
    terms: raw.terms ?? '',
    footerText: raw.footerText ?? '',
    template: TEMPLATE_IDS.includes(raw.template as TemplateName)
      ? (raw.template as TemplateName)
      : 'modern',
    templateSettings: normalizeTemplateSettings(raw.templateSettings),
    showQr: raw.showQr ?? false,
    qrPayload: raw.qrPayload ?? '',
    recurring,
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
  };
}

/** Fill every field an older saved profile might be missing. */
export function normalizeProfile(raw: Partial<Profile>): Profile {
  return {
    ...DEFAULT_PROFILE,
    ...raw,
    id: raw.id || uid(),
    nextInvoiceNumber: Math.max(1, Math.floor(Number(raw.nextInvoiceNumber) || 1)),
    numberPrefix: raw.numberPrefix ?? 'INV-',
    numberSuffix: raw.numberSuffix ?? '',
  };
}

export function normalizeClient(raw: Partial<Client>): Client {
  return {
    id: raw.id || uid(),
    name: raw.name ?? '',
    company: raw.company ?? '',
    contactPerson: raw.contactPerson ?? '',
    email: raw.email ?? '',
    address: raw.address ?? '',
    shippingAddress: raw.shippingAddress ?? '',
    phone: raw.phone ?? '',
    taxId: raw.taxId ?? '',
    country: raw.country ?? '',
    notes: raw.notes ?? '',
    defaultCurrency: raw.defaultCurrency ?? '',
    terms: raw.terms ?? '',
  };
}

/** The postal address block printed on documents: free-text address, then
 * the structured city/state/postal line, then the country. */
export function profileAddressLines(profile: Profile): string[] {
  const cityLine = [profile.city, profile.state, profile.postalCode]
    .map((x) => (x || '').trim())
    .filter(Boolean)
    .join(', ');
  return [profile.address, cityLine, profile.country]
    .map((x) => (x || '').trim())
    .filter(Boolean);
}

/** Bank details assembled from the structured fields, when paymentDetails is empty. */
export function profileBankText(profile: Profile): string {
  const lines: string[] = [];
  if (profile.bankName.trim()) lines.push(`Bank: ${profile.bankName.trim()}`);
  if (profile.accountTitle.trim()) lines.push(`Account title: ${profile.accountTitle.trim()}`);
  if (profile.iban.trim()) lines.push(`IBAN: ${profile.iban.trim()}`);
  if (profile.swift.trim()) lines.push(`SWIFT/BIC: ${profile.swift.trim()}`);
  return lines.join('\n');
}

/**
 * Generate draft invoices for any due recurring templates. Runs inside the
 * invoices state initialiser: reads the stored list, appends due drafts
 * (bounded at 12 missed occurrences per template) and advances each
 * template's next date past today.
 */
function generateRecurringDrafts(
  stored: Invoice[],
  profile: Profile
): { list: Invoice[]; generatedCount: number; nextNumber: number } {
  const today = todayIso();
  const nowIso = new Date().toISOString();
  let nextNumber = profile.nextInvoiceNumber;
  const generated: Invoice[] = [];
  const updated = stored.map((inv) => {
    const rec = inv.recurring;
    if (!rec || !rec.active || !rec.nextDate || rec.nextDate > today) return inv;
    const spanDays = Math.max(
      0,
      Math.round((Date.parse(inv.dueDate) - Date.parse(inv.issueDate)) / 86400000) || 0
    );
    let nextDate = rec.nextDate;
    let count = 0;
    while (nextDate <= today && count < 12) {
      generated.push(
        normalizeInvoice({
          ...inv,
          id: uid(),
          number: formatInvoiceNumber(nextNumber, profile.numberPrefix, profile.numberSuffix),
          issueDate: nextDate,
          dueDate: addDaysIso(nextDate, spanDays),
          status: 'draft',
          amountPaid: 0,
          payments: [],
          recurring: null,
          createdAt: nowIso,
          updatedAt: nowIso,
        })
      );
      nextNumber += 1;
      count += 1;
      nextDate = shiftDateByFrequency(nextDate, rec.frequency, rec.intervalCount);
    }
    if (count === 0) return inv;
    return { ...inv, recurring: { ...rec, nextDate } };
  });
  return {
    list: [...generated.reverse(), ...updated],
    generatedCount: generated.length,
    nextNumber,
  };
}

function makeDraft(profile: Profile): Invoice {
  const today = todayIso();
  return {
    id: '',
    number: formatInvoiceNumber(profile.nextInvoiceNumber, profile.numberPrefix, profile.numberSuffix),
    issueDate: today,
    dueDate: addDaysIso(today, 14),
    dueTerms: 'net14',
    poNumber: '',
    referenceNumber: '',
    docTitle: '',
    clientId: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    currency: profile.currency,
    items: [blankLineItem()],
    discountPct: 0,
    discountType: 'pct',
    discountValue: 0,
    taxPct: profile.taxRate,
    taxLabel: profile.taxLabel,
    taxMode: 'afterDiscount',
    shipping: 0,
    additionalCharges: 0,
    roundingAdjustment: 0,
    amountPaid: 0,
    payments: [],
    status: 'draft',
    notes: '',
    internalNotes: '',
    terms:
      profile.defaultTerms ||
      'Payment is due within 14 days of the issue date. Please quote the invoice number with your payment.',
    footerText: profile.defaultFooter || '',
    template: 'modern',
    templateSettings: { ...DEFAULT_TEMPLATE_SETTINGS },
    showQr: false,
    qrPayload: '',
    recurring: null,
    createdAt: '',
    updatedAt: '',
  };
}

/* ── Sharing / downloads ───────────────────────────────────────────── */

function invoiceSummaryText(inv: Invoice, profile: Profile): string {
  const t = computeTotals(inv);
  const lines = [
    `Invoice ${inv.number} from ${profile.businessName || 'us'}`,
    `Items: ${inv.items.length}`,
    `Total: ${money(t.total, inv.currency)}`,
    `Paid so far: ${money(t.totalPaid, inv.currency)}`,
    `Balance due: ${money(t.balance, inv.currency)}`,
    `Due date: ${inv.dueDate}`,
  ];
  if (profile.paymentDetails.trim()) {
    lines.push('', `Payment details: ${profile.paymentDetails.trim()}`);
  }
  lines.push('', 'Sent with the free Invoice Generator — invoicegenerator.freeqrcode.tools');
  return lines.join('\n');
}

function emailHref(inv: Invoice, profile: Profile): string {
  const subject = `Invoice ${inv.number} from ${profile.businessName || 'Invoice Generator'}`;
  return `mailto:${inv.clientEmail.trim()}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(invoiceSummaryText(inv, profile))}`;
}

function whatsappHref(inv: Invoice, profile: Profile): string {
  const digits = (inv.clientPhone || '').replace(/\D/g, '');
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(invoiceSummaryText(inv, profile))}`;
}

function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function csvCell(value: string | number): string {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Invoices that belong to a client: by stored id, or by matching typed name. */
function invoicesForClient(client: Client, invoices: Invoice[]): Invoice[] {
  return invoices
    .filter(
      (inv) =>
        inv.clientId === client.id ||
        (!inv.clientId &&
          inv.clientName.trim().toLowerCase() === client.name.trim().toLowerCase() &&
          client.name.trim() !== '')
    )
    .sort((a, b) => a.issueDate.localeCompare(b.issueDate));
}

/* ── Small shared inputs ───────────────────────────────────────────── */

function NumInput({
  value,
  onChange,
  min,
  max,
  step,
  className,
  ariaLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Input
      type="number"
      inputMode="decimal"
      aria-label={ariaLabel}
      min={min}
      max={max}
      step={step ?? 'any'}
      className={className}
      placeholder="0"
      value={value === 0 ? '' : value}
      onChange={(e) => {
        const n = parseFloat(e.target.value);
        onChange(Number.isFinite(n) ? n : 0);
      }}
    />
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const SHARE_BTN_CLASS =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 transition-colors';

/* ── Main app ──────────────────────────────────────────────────────── */

type ViewName = 'create' | 'invoices' | 'dashboard' | 'settings';

export function InvoiceApp() {
  /*
   * Invoices initialise FIRST: the initialiser normalises stored invoices and
   * generates any due recurring drafts, persisting the combined list (and the
   * advanced invoice-number sequence) back to storage immediately, so the
   * profile initialiser below reads the already-updated profile.
   */
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const prof = loadLS(PROFILE_KEY, DEFAULT_PROFILE);
    const stored = loadLSArray<Invoice>(INVOICES_KEY).map(normalizeInvoice);
    const gen = generateRecurringDrafts(stored, prof);
    if (gen.generatedCount > 0) {
      saveLS(INVOICES_KEY, gen.list);
      saveLS(PROFILE_KEY, { ...prof, nextInvoiceNumber: gen.nextNumber });
    }
    return gen.list;
  });
  const [profile, setProfileState] = useState<Profile>(() =>
    normalizeProfile(loadLS(PROFILE_KEY, DEFAULT_PROFILE))
  );
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const stored = loadLSArray<Profile>(PROFILES_KEY).map(normalizeProfile);
    if (stored.length > 0) return stored;
    // Migration: the previous single profile becomes the first saved profile.
    return [normalizeProfile(loadLS(PROFILE_KEY, DEFAULT_PROFILE))];
  });
  /** setProfile also keeps the profiles list in sync (same id is replaced). */
  const setProfile: React.Dispatch<React.SetStateAction<Profile>> = (action) => {
    setProfileState((cur) => {
      const next =
        typeof action === 'function' ? (action as (p: Profile) => Profile)(cur) : action;
      setProfiles((list) => {
        const idx = list.findIndex((p) => p.id === next.id);
        if (idx >= 0) {
          const copy = [...list];
          copy[idx] = next;
          return copy;
        }
        return [...list, next];
      });
      return next;
    });
  };
  const [clients, setClients] = useState<Client[]>(() =>
    loadLSArray<Client>(CLIENTS_KEY).map(normalizeClient)
  );
  const [draft, setDraft] = useState<Invoice>(() => {
    // Restore the autosaved working draft when there is one (§11/§14):
    // closing the tab mid-invoice no longer loses the work.
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(DRAFT_KEY);
        if (raw) return normalizeInvoice(JSON.parse(raw) as Partial<Invoice>);
      } catch {
        /* fall through to a fresh draft */
      }
    }
    return makeDraft(normalizeProfile(loadLS(PROFILE_KEY, DEFAULT_PROFILE)));
  });
  const [draftSavedAt, setDraftSavedAt] = useState('');
  const [view, setView] = useState<ViewName>('create');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [payForm, setPayForm] = useState<{
    date: string;
    amount: number;
    method: PaymentMethod;
    note: string;
  }>(() => ({ date: todayIso(), amount: 0, method: 'Bank transfer', note: '' }));

  /* Persist on change (writes only — no state is set inside effects). */
  useEffect(() => {
    saveLS(PROFILE_KEY, profile);
  }, [profile]);
  useEffect(() => {
    saveLS(CLIENTS_KEY, clients);
  }, [clients]);
  useEffect(() => {
    saveLS(PROFILES_KEY, profiles);
  }, [profiles]);
  useEffect(() => {
    saveLS(INVOICES_KEY, invoices);
  }, [invoices]);

  /* Draft autosave (debounced) — the indicator tells the user it is safe. */
  useEffect(() => {
    const t = window.setTimeout(() => {
      saveLS(DRAFT_KEY, draft);
      setDraftSavedAt(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    }, 400);
    return () => window.clearTimeout(t);
  }, [draft]);

  /* Payment QR — generated asynchronously; state is set only in callbacks. */
  const qrPayloadText = draft.showQr ? draft.qrPayload.trim() || profile.paymentDetails.trim() : '';
  useEffect(() => {
    if (!qrPayloadText) return;
    let cancelled = false;
    toDataURL(qrPayloadText, { width: 280, margin: 1 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [qrPayloadText]);
  const effectiveQr = qrPayloadText ? qrDataUrl : '';

  const totals = useMemo(() => computeTotals(draft), [draft]);
  const draftStatus = effectiveStatus(draft);

  const patchDraft = (patch: Partial<Invoice>) => setDraft((d) => ({ ...d, ...patch }));

  const patchSettings = (patch: Partial<TemplateSettings>) =>
    setDraft((d) => ({ ...d, templateSettings: { ...d.templateSettings, ...patch } }));

  const patchItem = (id: string, patch: Partial<LineItem>) =>
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  /* Drag-and-drop line reordering (native HTML5 DnD on the row handle). */
  const [dragItemId, setDragItemId] = useState<string | null>(null);
  const moveItem = (fromId: string, toId: string) =>
    setDraft((d) => {
      const items = [...d.items];
      const from = items.findIndex((i) => i.id === fromId);
      const to = items.findIndex((i) => i.id === toId);
      if (from < 0 || to < 0 || from === to) return d;
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      return { ...d, items };
    });

  /* ── Invoice actions ── */

  const handleSave = () => {
    const now = new Date().toISOString();
    let clientId = draft.clientId;
    if (clientId === 'new' && draft.clientName.trim()) {
      const created: Client = normalizeClient({
        id: uid(),
        name: draft.clientName.trim(),
        email: draft.clientEmail.trim(),
        address: draft.clientAddress.trim(),
        phone: draft.clientPhone.trim(),
      });
      setClients((list) => [...list, created]);
      clientId = created.id;
    }
    const record: Invoice = {
      ...draft,
      clientId: clientId === 'new' ? null : clientId,
      id: draft.id || uid(),
      createdAt: draft.createdAt || now,
      updatedAt: now,
    };
    setInvoices((list) => {
      const idx = list.findIndex((i) => i.id === record.id);
      if (idx >= 0) {
        const copy = [...list];
        copy[idx] = record;
        return copy;
      }
      return [record, ...list];
    });
    setDraft(record);
    if (!draft.id && draft.number === formatInvoiceNumber(profile.nextInvoiceNumber, profile.numberPrefix, profile.numberSuffix)) {
      setProfile((p) => ({ ...p, nextInvoiceNumber: p.nextInvoiceNumber + 1 }));
    }
    setSavedNote(`Saved ${record.number} — find it any time under My invoices.`);
  };

  const handleNew = () => {
    setDraft(makeDraft(profile));
    setSavedNote('');
    setView('create');
  };

  const handleLoad = (inv: Invoice) => {
    const copy = normalizeInvoice({ ...inv, items: inv.items.map((it) => ({ ...it })) });
    setDraft(copy);
    setSavedNote('');
    setView('create');
  };

  const handleDuplicate = (inv: Invoice) => {
    const today = todayIso();
    setDraft({
      ...normalizeInvoice(inv),
      id: '',
      number: formatInvoiceNumber(profile.nextInvoiceNumber, profile.numberPrefix, profile.numberSuffix),
      issueDate: today,
      dueDate: addDaysIso(today, 14),
      dueTerms: 'net14',
      status: 'draft',
      amountPaid: 0,
      payments: [],
      recurring: null,
      createdAt: '',
      updatedAt: '',
      items: inv.items.map((it) => ({ ...it, id: uid() })),
    });
    setSavedNote('');
    setView('create');
  };

  const handleDelete = (inv: Invoice) => {
    if (!window.confirm(`Delete invoice ${inv.number}? This cannot be undone.`)) return;
    setInvoices((list) => list.filter((i) => i.id !== inv.id));
    if (draft.id === inv.id) handleNew();
  };

  const handleMarkPaid = (inv: Invoice) => {
    const t = computeTotals(inv);
    const manual = Math.max(0, t.total - paymentsSum(inv));
    const stampUpdate = (i: Invoice): Invoice =>
      i.id === inv.id
        ? { ...i, amountPaid: manual, status: 'paid', updatedAt: new Date().toISOString() }
        : i;
    setInvoices((list) => list.map(stampUpdate));
    if (draft.id === inv.id) {
      setDraft((d) => ({ ...d, amountPaid: manual, status: 'paid' }));
    }
  };

  const handleToggleRecurring = (inv: Invoice) => {
    if (!inv.recurring) return;
    const next: Invoice = {
      ...inv,
      recurring: { ...inv.recurring, active: !inv.recurring.active },
      updatedAt: new Date().toISOString(),
    };
    setInvoices((list) => list.map((i) => (i.id === inv.id ? next : i)));
    if (draft.id === inv.id) setDraft(next);
  };

  const handleStopRecurring = (inv: Invoice) => {
    if (
      !window.confirm(
        `Stop ${inv.number} repeating? The invoice itself stays in your list; it just won't create new drafts.`
      )
    )
      return;
    const next: Invoice = { ...inv, recurring: null, updatedAt: new Date().toISOString() };
    setInvoices((list) => list.map((i) => (i.id === inv.id ? next : i)));
    if (draft.id === inv.id) setDraft(next);
  };

  const handleImportData = (data: {
    profile?: Partial<Profile>;
    profiles?: Partial<Profile>[];
    clients?: Partial<Client>[];
    invoices?: Partial<Invoice>[];
  }) => {
    // v2 backups carry the full profiles list; v1 backups carry one profile.
    const importedProfiles = Array.isArray(data.profiles)
      ? data.profiles.map(normalizeProfile)
      : [];
    const newProfile: Profile =
      importedProfiles.find((p) => p.id === (data.profile?.id ?? '')) ??
      importedProfiles[0] ??
      normalizeProfile(data.profile ?? {});
    setProfiles(importedProfiles.length > 0 ? importedProfiles : [newProfile]);
    setProfileState(newProfile);
    setClients(Array.isArray(data.clients) ? data.clients.map(normalizeClient) : []);
    setInvoices(Array.isArray(data.invoices) ? data.invoices.map(normalizeInvoice) : []);
    setDraft(makeDraft(newProfile));
    setSavedNote('');
  };

  const switchProfile = (id: string) => {
    const next = profiles.find((p) => p.id === id);
    if (!next || next.id === profile.id) return;
    setProfileState(next);
    // A fresh, unsaved draft adopts the newly selected profile's defaults.
    if (!draft.id) setDraft(makeDraft(next));
  };

  const addProfile = () => {
    const copy = normalizeProfile({
      ...profile,
      id: uid(),
      businessName: profile.businessName ? `${profile.businessName} (copy)` : '',
      nextInvoiceNumber: 1,
    });
    setProfiles((list) => [...list, copy]);
    setProfileState(copy);
    if (!draft.id) setDraft(makeDraft(copy));
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const target = profiles.find((p) => p.id === id);
    if (!target) return;
    if (
      !window.confirm(
        `Delete the business profile "${target.businessName || 'Unnamed business'}"? Your invoices and clients are not affected.`
      )
    )
      return;
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    if (profile.id === id) {
      setProfileState(remaining[0]);
      if (!draft.id) setDraft(makeDraft(remaining[0]));
    }
  };

  const handleClientSelect = (value: string) => {
    if (value === 'manual') {
      patchDraft({ clientId: null });
      return;
    }
    if (value === 'new') {
      patchDraft({
        clientId: 'new',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
      });
      return;
    }
    const c = clients.find((x) => x.id === value);
    if (c) {
      patchDraft({
        clientId: c.id,
        clientName: c.company || c.name,
        clientEmail: c.email,
        clientPhone: c.phone,
        clientAddress: c.address,
        ...(c.defaultCurrency ? { currency: c.defaultCurrency } : {}),
        ...(c.terms ? { terms: c.terms } : {}),
      });
    }
  };

  const handleDueTerms = (value: DueTerms) => {
    const due = dueDateForPreset(value, draft.issueDate);
    patchDraft({ dueTerms: value, ...(due ? { dueDate: due } : {}) });
  };

  const handleIssueDate = (value: string) => {
    const due = dueDateForPreset(draft.dueTerms, value);
    patchDraft({ issueDate: value, ...(due ? { dueDate: due } : {}) });
  };

  const handleDiscountType = (type: DiscountType) => {
    patchDraft({
      discountType: type,
      discountPct: type === 'pct' ? draft.discountValue : draft.discountPct,
    });
  };

  const handleAddPayment = () => {
    if (payForm.amount <= 0) return;
    const payment: Payment = {
      id: uid(),
      date: payForm.date || todayIso(),
      amount: payForm.amount,
      method: payForm.method,
      note: payForm.note.trim(),
    };
    patchDraft({ payments: [...draft.payments, payment] });
    setPayForm((f) => ({ ...f, amount: 0, note: '' }));
  };

  /* ── PDF (shared renderer in _lib/pdf.ts) ── */

  const stampFor = (eff: EffectiveStatus): 'PAID' | 'OVERDUE' | 'DRAFT' | null =>
    eff === 'paid' ? 'PAID' : eff === 'overdue' ? 'OVERDUE' : eff === 'draft' ? 'DRAFT' : null;

  const buildPdf = () =>
    buildInvoicePdf(draft, profile, totals, STATUS_LABELS[draftStatus], stampFor(draftStatus));

  const downloadPdf = async () => {
    const doc = await buildPdf();
    doc.save(`${draft.number || 'invoice'}.pdf`);
  };

  const printPdf = async () => {
    const doc = await buildPdf();
    const url = doc.output('bloburl');
    window.open(url, '_blank');
  };

  const downloadInvoicesZip = async (selected: Invoice[]) => {
    if (selected.length === 0) return;
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const usedNames = new Set<string>();
    for (const inv of selected) {
      const t = computeTotals(inv);
      const eff = effectiveStatus(inv);
      const doc = await buildInvoicePdf(
        inv,
        profile,
        t,
        STATUS_LABELS[eff],
        stampFor(eff)
      );
      let name = `${inv.number || inv.id}.pdf`;
      let n = 2;
      while (usedNames.has(name)) {
        name = `${inv.number || inv.id}-${n}.pdf`;
        n += 1;
      }
      usedNames.add(name);
      zip.file(name, doc.output('arraybuffer'));
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-${todayIso()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  /* ── Render ── */

  const clientSelectValue = draft.clientId === 'new' ? 'new' : (draft.clientId ?? 'manual');
  const recurringCount = invoices.filter((i) => i.recurring).length;

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Invoice workspace">
        <Button
          variant={view === 'create' ? 'default' : 'outline'}
          onClick={() => setView('create')}
          className="gap-2"
        >
          <FilePlus2 className="w-4 h-4" /> Create invoice
        </Button>
        <Button
          variant={view === 'invoices' ? 'default' : 'outline'}
          onClick={() => setView('invoices')}
          className="gap-2"
        >
          <Save className="w-4 h-4" /> My invoices ({invoices.length})
        </Button>
        <Button
          variant={view === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setView('dashboard')}
          className="gap-2"
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Button>
        <Button
          variant={view === 'settings' ? 'default' : 'outline'}
          onClick={() => setView('settings')}
          className="gap-2"
        >
          <SettingsIcon className="w-4 h-4" /> Business &amp; clients
        </Button>
      </div>

      {view === 'create' && (
        <>
          {profiles.length > 1 && (
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-sm font-medium">Business profile</span>
              <Select value={profile.id} onValueChange={switchProfile}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.businessName || 'Unnamed business'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                Branding, currency and tax defaults for this invoice come from the selected
                profile.
              </span>
            </div>
          )}
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* ── Editor ── */}
          <div className="space-y-5">
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold">Invoice details</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Invoice number">
                  <Input
                    value={draft.number}
                    onChange={(e) => patchDraft({ number: e.target.value })}
                  />
                </Field>
                <Field label="Status">
                  <Select
                    value={draft.status}
                    onValueChange={(v) => patchDraft({ status: v as InvoiceStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="PO / reference number">
                  <Input
                    value={draft.poNumber}
                    onChange={(e) => patchDraft({ poNumber: e.target.value })}
                    placeholder="e.g. PO-2026-118"
                  />
                </Field>
                <Field label="Reference number">
                  <Input
                    value={draft.referenceNumber}
                    onChange={(e) => patchDraft({ referenceNumber: e.target.value })}
                    placeholder="Contract, order or job ref"
                  />
                </Field>
                <Field label="Document title">
                  <Input
                    value={draft.docTitle}
                    onChange={(e) => patchDraft({ docTitle: e.target.value })}
                    placeholder="INVOICE (or TAX INVOICE, PROFORMA…)"
                  />
                </Field>
                <Field label="Currency">
                  <Select value={draft.currency} onValueChange={(v) => patchDraft({ currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {currencyLabel(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Issue date">
                  <Input
                    type="date"
                    value={draft.issueDate}
                    onChange={(e) => handleIssueDate(e.target.value)}
                  />
                </Field>
                <Field label="Payment terms">
                  <Select
                    value={draft.dueTerms}
                    onValueChange={(v) => handleDueTerms(v as DueTerms)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(DUE_TERMS_LABELS) as DueTerms[]).map((k) => (
                        <SelectItem key={k} value={k}>
                          {DUE_TERMS_LABELS[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Due date">
                  <Input
                    type="date"
                    value={draft.dueDate}
                    onChange={(e) => patchDraft({ dueDate: e.target.value, dueTerms: 'custom' })}
                  />
                </Field>
                <Field label="Brand colour (Modern template)">
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      className="w-14 h-10 p-1 cursor-pointer"
                      value={profile.brandColor}
                      onChange={(e) => setProfile((p) => ({ ...p, brandColor: e.target.value }))}
                    />
                    <Input
                      value={profile.brandColor}
                      onChange={(e) => setProfile((p) => ({ ...p, brandColor: e.target.value }))}
                    />
                  </div>
                </Field>
              </div>

              <div className="border-t border-border pt-4">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary"
                    checked={!!draft.recurring}
                    onChange={(e) =>
                      patchDraft({
                        recurring: e.target.checked
                          ? {
                              frequency: 'monthly',
                              intervalCount: 1,
                              nextDate: shiftDateByFrequency(draft.issueDate, 'monthly'),
                              active: true,
                            }
                          : null,
                      })
                    }
                  />
                  <Repeat className="w-4 h-4 text-primary" /> Make this a recurring invoice
                </label>
                {draft.recurring && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Field label="Repeats">
                      <Select
                        value={draft.recurring.frequency}
                        onValueChange={(v) =>
                          patchDraft({
                            recurring: {
                              ...draft.recurring!,
                              frequency: v as RecurringFrequency,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(RECURRING_LABELS) as RecurringFrequency[]).map((k) => (
                            <SelectItem key={k} value={k}>
                              {RECURRING_LABELS[k]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Every (interval)">
                      <NumInput
                        value={draft.recurring.intervalCount}
                        min={1}
                        max={36}
                        step={1}
                        onChange={(n) =>
                          patchDraft({
                            recurring: {
                              ...draft.recurring!,
                              intervalCount: Math.min(36, Math.max(1, Math.floor(n) || 1)),
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="Next issue date">
                      <Input
                        type="date"
                        value={draft.recurring.nextDate}
                        onChange={(e) =>
                          patchDraft({
                            recurring: { ...draft.recurring!, nextDate: e.target.value },
                          })
                        }
                      />
                    </Field>
                    <label className="flex items-center gap-2 h-10 text-sm cursor-pointer col-span-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary"
                        checked={draft.recurring.active}
                        onChange={(e) =>
                          patchDraft({
                            recurring: { ...draft.recurring!, active: e.target.checked },
                          })
                        }
                      />
                      Active — a fresh draft is created in this app when each date arrives
                    </label>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-semibold">Template &amp; design</h3>
              <p className="text-xs text-muted-foreground -mt-2">
                Ten print-ready designs. Switching templates never changes your figures — only how
                the invoice looks, in the preview and the PDF alike.
              </p>
              <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Invoice template">
                {TEMPLATES.map((t) => {
                  const active = draft.template === t.id;
                  const brand = profile.brandColor || '#1d4ed8';
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => patchDraft({ template: t.id })}
                      className={`text-left rounded-lg border p-2 transition-shadow hover:shadow ${
                        active ? 'border-primary ring-2 ring-primary/40' : 'border-border'
                      }`}
                    >
                      <span className="block h-16 rounded border border-slate-200 bg-white relative overflow-hidden">
                        {t.header === 'band' && (
                          <span
                            className="block h-4 w-full"
                            style={{
                              backgroundColor: t.bandTone === 'dark' ? '#1e293b' : brand,
                            }}
                          />
                        )}
                        {t.header === 'side' && (
                          <span
                            className="absolute inset-y-0 left-0 w-1.5"
                            style={{ backgroundColor: brand }}
                          />
                        )}
                        {t.header === 'serif' && (
                          <span className="block px-2 pt-1.5 font-serif text-[13px] font-bold text-slate-800">
                            Invoice
                          </span>
                        )}
                        {t.header === 'centered' && (
                          <span className="block pt-1.5 text-center text-[10px] font-bold text-slate-700">
                            YOUR BUSINESS
                          </span>
                        )}
                        <span className="block px-2 pt-1.5 space-y-1">
                          <span
                            className={`block h-1 rounded ${
                              t.table === 'filled' ? '' : 'bg-slate-200'
                            }`}
                            style={t.table === 'filled' ? { backgroundColor: brand } : undefined}
                          />
                          <span className="block h-1 w-5/6 rounded bg-slate-100" />
                          <span className="block h-1 w-4/6 rounded bg-slate-100" />
                          <span className="block h-1 w-3/6 rounded bg-slate-200 ml-auto" />
                        </span>
                      </span>
                      <span className="block mt-1.5 text-xs font-semibold">{t.name}</span>
                      <span className="block text-[11px] text-muted-foreground leading-snug">
                        {t.blurb}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                <Field label="Secondary colour">
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      className="w-14 h-10 p-1 cursor-pointer"
                      value={draft.templateSettings.secondaryColor || profile.brandColor}
                      onChange={(e) => patchSettings({ secondaryColor: e.target.value })}
                    />
                    <Input
                      value={draft.templateSettings.secondaryColor}
                      onChange={(e) => patchSettings({ secondaryColor: e.target.value })}
                      placeholder="Brand colour"
                    />
                  </div>
                </Field>
                <Field label="Text size">
                  <Select
                    value={draft.templateSettings.fontScale}
                    onValueChange={(v) =>
                      patchSettings({ fontScale: v as TemplateSettings['fontScale'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="PDF paper size">
                  <Select
                    value={draft.templateSettings.paperSize}
                    onValueChange={(v) =>
                      patchSettings({ paperSize: v as TemplateSettings['paperSize'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="PDF orientation">
                  <Select
                    value={draft.templateSettings.orientation}
                    onValueChange={(v) =>
                      patchSettings({ orientation: v as TemplateSettings['orientation'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {(
                  [
                    ['showLogo', 'Logo'],
                    ['showStamp', 'Stamp / signature'],
                    ['showPayments', 'Payments list'],
                    ['showNotes', 'Notes'],
                    ['showTerms', 'Terms'],
                  ] as Array<[keyof TemplateSettings, string]>
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                      checked={Boolean(draft.templateSettings[key])}
                      onChange={(e) => patchSettings({ [key]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-semibold">Client</h3>
              <Field label="Choose from your address book, or type a new client">
                <Select value={clientSelectValue} onValueChange={handleClientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Type details manually</SelectItem>
                    <SelectItem value="new">
                      + New client (saved when you save the invoice)
                    </SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Client name">
                  <Input
                    value={draft.clientName}
                    onChange={(e) => patchDraft({ clientName: e.target.value })}
                    placeholder="Northwind Traders"
                  />
                </Field>
                <Field label="Client email">
                  <Input
                    value={draft.clientEmail}
                    onChange={(e) => patchDraft({ clientEmail: e.target.value })}
                    placeholder="accounts@client.com"
                  />
                </Field>
                <Field label="Client phone (for WhatsApp)">
                  <Input
                    value={draft.clientPhone}
                    onChange={(e) => patchDraft({ clientPhone: e.target.value })}
                    placeholder="+92 300 1234567"
                  />
                </Field>
              </div>
              <Field label="Client address">
                <Textarea
                  rows={2}
                  value={draft.clientAddress}
                  onChange={(e) => patchDraft({ clientAddress: e.target.value })}
                  placeholder={'Street, city, country'}
                />
              </Field>
              {!profile.businessName && (
                <p className="text-xs text-muted-foreground">
                  Tip: add your business name, logo and payment details once under{' '}
                  <button
                    type="button"
                    className="underline underline-offset-2"
                    onClick={() => setView('settings')}
                  >
                    Business &amp; clients
                  </button>{' '}
                  and they will appear on every invoice automatically.
                </p>
              )}
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-semibold">Items</h3>
              <div className="space-y-3">
                {draft.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border border-border/70 p-2.5 space-y-2 ${
                      dragItemId === item.id ? 'opacity-50' : ''
                    }`}
                    onDragOver={(e) => {
                      if (dragItemId && dragItemId !== item.id) e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragItemId) moveItem(dragItemId, item.id);
                      setDragItemId(null);
                    }}
                  >
                    <div className="flex gap-2 items-start">
                      <button
                        type="button"
                        draggable
                        aria-label="Drag to reorder item"
                        title="Drag to reorder"
                        className="pt-2.5 cursor-grab text-muted-foreground hover:text-foreground"
                        onDragStart={() => setDragItemId(item.id)}
                        onDragEnd={() => setDragItemId(null)}
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <Input
                        className="flex-1"
                        placeholder="Description of work or product"
                        value={item.description}
                        onChange={(e) => patchItem(item.id, { description: e.target.value })}
                        aria-label="Item description"
                      />
                      <NumInput
                        ariaLabel="Quantity"
                        className="w-20"
                        value={item.qty}
                        onChange={(n) => patchItem(item.id, { qty: n })}
                      />
                      <NumInput
                        ariaLabel="Unit price"
                        className="w-28"
                        value={item.unitPrice}
                        onChange={(n) => patchItem(item.id, { unitPrice: n })}
                      />
                      <span className="w-24 text-right text-sm font-medium pt-2.5">
                        {money(totals.lines[idx]?.net ?? 0, draft.currency)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Duplicate item"
                        onClick={() =>
                          setDraft((d) => {
                            const at = d.items.findIndex((it) => it.id === item.id);
                            const copy = { ...item, id: uid() };
                            const items = [...d.items];
                            items.splice(at + 1, 0, copy);
                            return { ...d, items };
                          })
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Remove item"
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            items:
                              d.items.length > 1
                                ? d.items.filter((it) => it.id !== item.id)
                                : d.items,
                          }))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center pl-6">
                      <Input
                        className="flex-1 min-w-44 h-8 text-xs"
                        placeholder="Detail (optional — scope, dates, specs…)"
                        value={item.detail}
                        onChange={(e) => patchItem(item.id, { detail: e.target.value })}
                        aria-label="Item detail"
                      />
                      <Input
                        className="w-24 h-8 text-xs"
                        placeholder="SKU"
                        value={item.sku}
                        onChange={(e) => patchItem(item.id, { sku: e.target.value })}
                        aria-label="SKU or product code"
                      />
                      <Select
                        value={item.unit}
                        onValueChange={(v) => patchItem(item.id, { unit: v })}
                      >
                        <SelectTrigger className="w-28 h-8 text-xs" aria-label="Unit type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIT_TYPES.map((u) => (
                            <SelectItem key={u.value || 'none'} value={u.value}>
                              {u.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Disc %</span>
                        <NumInput
                          ariaLabel="Item discount percent"
                          className="w-16 h-8 text-xs"
                          value={item.discountPct}
                          min={0}
                          max={100}
                          onChange={(n) => patchItem(item.id, { discountPct: n })}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Disc {draft.currency}</span>
                        <NumInput
                          ariaLabel="Item fixed discount"
                          className="w-20 h-8 text-xs"
                          value={item.discountFixed}
                          min={0}
                          onChange={(n) => patchItem(item.id, { discountFixed: n })}
                        />
                      </div>
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 accent-primary"
                          checked={item.taxable}
                          onChange={(e) => patchItem(item.id, { taxable: e.target.checked })}
                        />
                        Taxable
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    items: [...d.items, blankLineItem()],
                  }))
                }
              >
                <Plus className="w-4 h-4" /> Add item
              </Button>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-semibold">Totals, tax &amp; payment</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Discount">
                  <div className="flex gap-2">
                    <NumInput
                      className="flex-1"
                      value={draft.discountValue}
                      onChange={(n) =>
                        patchDraft({
                          discountValue: n,
                          discountPct: draft.discountType === 'pct' ? n : draft.discountPct,
                        })
                      }
                      min={0}
                      max={draft.discountType === 'pct' ? 100 : undefined}
                    />
                    <div className="flex rounded-md border border-border overflow-hidden shrink-0">
                      <button
                        type="button"
                        aria-label="Discount as a percentage"
                        className={`px-2.5 text-sm font-medium ${
                          draft.discountType === 'pct'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-muted'
                        }`}
                        onClick={() => handleDiscountType('pct')}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        aria-label="Discount as a fixed amount"
                        className={`px-2.5 text-sm font-medium ${
                          draft.discountType === 'fixed'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-muted'
                        }`}
                        onClick={() => handleDiscountType('fixed')}
                      >
                        {draft.currency}
                      </button>
                    </div>
                  </div>
                </Field>
                <Field label="Shipping / delivery">
                  <NumInput
                    value={draft.shipping}
                    onChange={(n) => patchDraft({ shipping: Math.max(0, n) })}
                    min={0}
                  />
                </Field>
                <Field label="Additional charges">
                  <NumInput
                    value={draft.additionalCharges}
                    onChange={(n) => patchDraft({ additionalCharges: Math.max(0, n) })}
                    min={0}
                  />
                </Field>
                <Field label="Tax label">
                  <Input
                    value={draft.taxLabel}
                    onChange={(e) => patchDraft({ taxLabel: e.target.value })}
                    placeholder="VAT / GST / Sales tax"
                  />
                </Field>
                <Field label="Tax rate %">
                  <NumInput
                    value={draft.taxPct}
                    onChange={(n) => patchDraft({ taxPct: n })}
                    min={0}
                    max={100}
                  />
                </Field>
                <Field label="Tax calculated">
                  <Select
                    value={draft.taxMode}
                    onValueChange={(v) => patchDraft({ taxMode: v as TaxMode })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="afterDiscount">After discount</SelectItem>
                      <SelectItem value="beforeDiscount">Before discount</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Rounding adjustment (+/−)">
                  <NumInput
                    value={draft.roundingAdjustment}
                    onChange={(n) => patchDraft({ roundingAdjustment: n })}
                  />
                </Field>
                <Field label="Other amount paid (manual lump sum)">
                  <NumInput
                    value={draft.amountPaid}
                    onChange={(n) => patchDraft({ amountPaid: Math.max(0, n) })}
                    min={0}
                  />
                </Field>
                <Field label="Payment QR code">
                  <label className="flex items-center gap-2 h-10 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                      checked={draft.showQr}
                      onChange={(e) => patchDraft({ showQr: e.target.checked })}
                    />
                    Print a payment QR on this invoice
                  </label>
                </Field>
              </div>
              {draft.showQr && (
                <Field label="QR content (leave blank to use your saved payment details)">
                  <Input
                    value={draft.qrPayload}
                    onChange={(e) => patchDraft({ qrPayload: e.target.value })}
                    placeholder="https://your-payment-link or IBAN + account title"
                  />
                </Field>
              )}
              <Field label="Notes (printed on the invoice)">
                <Textarea
                  rows={2}
                  value={draft.notes}
                  onChange={(e) => patchDraft({ notes: e.target.value })}
                  placeholder="Thank you for your business."
                />
              </Field>
              <Field label="Terms (printed on the invoice)">
                <Textarea
                  rows={2}
                  value={draft.terms}
                  onChange={(e) => patchDraft({ terms: e.target.value })}
                />
              </Field>
              <Field label="Custom footer (printed at the bottom of the invoice)">
                <Input
                  value={draft.footerText}
                  onChange={(e) => patchDraft({ footerText: e.target.value })}
                  placeholder="e.g. Registered in Pakistan · NTN 1234567-8"
                />
              </Field>
              <Field label="Internal notes (private — never printed)">
                <Textarea
                  rows={2}
                  value={draft.internalNotes}
                  onChange={(e) => patchDraft({ internalNotes: e.target.value })}
                  placeholder="Reminders for yourself: promised discount next time, client prefers email…"
                />
              </Field>
              <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm space-y-1">
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{money(totals.subtotal, draft.currency)}</span>
                </p>
                {totals.itemDiscounts > 0 && (
                  <p className="flex justify-between text-muted-foreground">
                    <span>Item discounts (already deducted)</span>
                    <span>− {money(totals.itemDiscounts, draft.currency)}</span>
                  </p>
                )}
                {totals.discountAmount > 0 && (
                  <p className="flex justify-between">
                    <span>Discount</span>
                    <span>− {money(totals.discountAmount, draft.currency)}</span>
                  </p>
                )}
                {totals.taxAmount > 0 && (
                  <p className="flex justify-between">
                    <span>{draft.taxLabel || 'Tax'}</span>
                    <span>{money(totals.taxAmount, draft.currency)}</span>
                  </p>
                )}
                {totals.additionalCharges > 0 && (
                  <p className="flex justify-between">
                    <span>Additional charges</span>
                    <span>{money(totals.additionalCharges, draft.currency)}</span>
                  </p>
                )}
                {totals.roundingAdjustment !== 0 && (
                  <p className="flex justify-between">
                    <span>Rounding adjustment</span>
                    <span>
                      {totals.roundingAdjustment > 0 ? '+' : '−'}{' '}
                      {money(Math.abs(totals.roundingAdjustment), draft.currency)}
                    </span>
                  </p>
                )}
                <p className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{money(totals.total, draft.currency)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Total paid so far</span>
                  <span>{money(totals.totalPaid, draft.currency)}</span>
                </p>
                <p className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                  <span>Balance due</span>
                  <span>{money(totals.balance, draft.currency)}</span>
                </p>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Payments received
              </h3>
              <p className="text-xs text-muted-foreground -mt-2">
                Record each payment as it arrives — bank transfer, cash, card — and the balance due
                updates instantly. Save the invoice to keep the record.
              </p>
              {draft.payments.length > 0 ? (
                <ul className="divide-y divide-border">
                  {draft.payments.map((p) => (
                    <li key={p.id} className="py-2 flex items-center gap-3 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {money(p.amount, draft.currency)}
                          <span className="text-muted-foreground font-normal">
                            {' '}
                            · {p.method} · {p.date || 'No date'}
                          </span>
                        </p>
                        {p.note && (
                          <p className="text-xs text-muted-foreground truncate">{p.note}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Delete payment"
                        onClick={() =>
                          patchDraft({ payments: draft.payments.filter((x) => x.id !== p.id) })
                        }
                        className="gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No payments recorded yet for this invoice.
                </p>
              )}
              <div className="border-t border-border pt-4 grid grid-cols-2 gap-3">
                <Field label="Payment date">
                  <Input
                    type="date"
                    value={payForm.date}
                    onChange={(e) => setPayForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </Field>
                <Field label="Amount">
                  <NumInput
                    value={payForm.amount}
                    onChange={(n) => setPayForm((f) => ({ ...f, amount: Math.max(0, n) }))}
                    min={0}
                  />
                </Field>
                <Field label="Method">
                  <Select
                    value={payForm.method}
                    onValueChange={(v) => setPayForm((f) => ({ ...f, method: v as PaymentMethod }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Note (optional)">
                  <Input
                    value={payForm.note}
                    onChange={(e) => setPayForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="e.g. First instalment"
                  />
                </Field>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                disabled={payForm.amount <= 0}
                onClick={handleAddPayment}
              >
                <Plus className="w-4 h-4" /> Add payment
              </Button>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" /> {draft.id ? 'Save changes' : 'Save invoice'}
              </Button>
              <Button variant="outline" onClick={downloadPdf} className="gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button variant="outline" onClick={printPdf} className="gap-2">
                <Printer className="w-4 h-4" /> Print / preview PDF
              </Button>
              <Button variant="ghost" onClick={handleNew} className="gap-2">
                <FilePlus2 className="w-4 h-4" /> New invoice
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href={emailHref(draft, profile)} className={SHARE_BTN_CLASS}>
                <Mail className="w-4 h-4" /> Email invoice
              </a>
              <a
                href={whatsappHref(draft, profile)}
                target="_blank"
                rel="noreferrer"
                className={SHARE_BTN_CLASS}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <span className="text-xs text-muted-foreground">
                Opens your email app — attach the PDF you downloaded.
              </span>
            </div>
            {savedNote && <p className="text-sm text-emerald-600">{savedNote}</p>}
            {draftSavedAt && (
              <p className="text-xs text-muted-foreground">
                Draft autosaved at {draftSavedAt} — safe to close; it will be restored when you
                return.
              </p>
            )}
            {draft.id && (
              <p className="text-xs text-muted-foreground">
                You are editing {draft.number}. Saving overwrites the stored copy.
              </p>
            )}
            {recurringCount > 0 && view === 'create' && (
              <p className="text-xs text-muted-foreground">
                {recurringCount} recurring template{recurringCount === 1 ? '' : 's'} active in your
                list — manage them under My invoices.
              </p>
            )}
          </div>

          {/* ── Live preview ── */}
          <div className="lg:sticky lg:top-6">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              LIVE PREVIEW — exactly what your client receives
            </p>
            <InvoicePreview inv={draft} profile={profile} totals={totals} qrDataUrl={effectiveQr} />
          </div>
        </div>
        </>
      )}

      {view === 'invoices' && (
        <InvoicesView
          invoices={invoices}
          profile={profile}
          onLoad={handleLoad}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onMarkPaid={handleMarkPaid}
          onToggleRecurring={handleToggleRecurring}
          onStopRecurring={handleStopRecurring}
          onNew={handleNew}
          onDownloadZip={downloadInvoicesZip}
        />
      )}

      {view === 'dashboard' && <DashboardView invoices={invoices} profile={profile} />}

      {view === 'settings' && (
        <SettingsView
          profile={profile}
          setProfile={setProfile}
          profiles={profiles}
          onSwitchProfile={switchProfile}
          onAddProfile={addProfile}
          onDeleteProfile={deleteProfile}
          clients={clients}
          setClients={setClients}
          invoices={invoices}
          onImportData={handleImportData}
        />
      )}
    </div>
  );
}

/* ── Live preview ──────────────────────────────────────────────────── */

function InvoicePreview({
  inv,
  profile,
  totals,
  qrDataUrl,
}: {
  inv: Invoice;
  profile: Profile;
  totals: Totals;
  qrDataUrl: string;
}) {
  const brand = profile.brandColor || '#1d4ed8';
  const def = templateDef(inv.template);
  const settings = inv.templateSettings;
  const secondary = settings.secondaryColor || brand;
  const payText = inv.qrPayload.trim() || profile.paymentDetails.trim();
  const eff = effectiveStatus(inv);
  const stampText =
    eff === 'paid' ? 'Paid' : eff === 'overdue' ? 'Overdue' : eff === 'draft' ? 'Draft' : null;
  const logoImg = settings.showLogo && profile.logoDataUrl && (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={profile.logoDataUrl} alt="Business logo" className="max-h-14 max-w-32 object-contain" />
  );
  return (
    <div
      className={`relative bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 overflow-hidden ${
        def.font === 'serif' ? 'font-serif' : ''
      }`}
    >
      {stampText && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span
            className={`inline-block -rotate-[18deg] rounded-lg border-4 px-6 py-2 text-5xl font-extrabold uppercase tracking-[0.2em] opacity-25 ${
              eff === 'paid'
                ? 'border-emerald-600 text-emerald-600'
                : eff === 'overdue'
                  ? 'border-red-600 text-red-600'
                  : 'border-slate-500 text-slate-500'
            }`}
          >
            {stampText}
          </span>
        </div>
      )}
      {def.header === 'band' && (
        <div
          className="px-6 py-5 text-white flex items-start justify-between gap-4"
          style={{ backgroundColor: def.bandTone === 'dark' ? '#1e293b' : brand }}
        >
          <div className="min-w-0">
            <p className="font-bold text-lg leading-tight truncate">
              {profile.businessName || 'Your Business'}
            </p>
            <p className="text-xs opacity-90 mt-1 whitespace-pre-line">
              {[...profileAddressLines(profile), profile.email, profile.phone].filter(Boolean).join('\n')}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold tracking-tight">{inv.docTitle || 'INVOICE'}</p>
            <p className="text-sm opacity-90">{inv.number}</p>
            {logoImg}
          </div>
        </div>
      )}
      {def.header === 'serif' && (
        <div className="px-6 pt-6">
          <div
            className="flex items-start justify-between gap-4 pb-3"
            style={{ borderBottom: '4px double #334155' }}
          >
            <div>
              <p className="font-serif text-3xl font-bold">{inv.docTitle || 'INVOICE'}</p>
              <p className="font-semibold mt-1">{profile.businessName || 'Your Business'}</p>
              <p className="text-xs text-slate-500 whitespace-pre-line">
                {[...profileAddressLines(profile), profile.email, profile.phone].filter(Boolean).join('\n')}
              </p>
            </div>
            {logoImg}
          </div>
        </div>
      )}
      {def.header === 'centered' && (
        <div className="px-6 pt-6 text-center border-b border-slate-200 pb-4">
          {logoImg && <div className="flex justify-center mb-2">{logoImg}</div>}
          <p className="font-bold text-lg">{profile.businessName || 'Your Business'}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {[...profileAddressLines(profile), profile.email, profile.phone].filter(Boolean).join(' · ')}
          </p>
          <p
            className="text-2xl font-extrabold tracking-wide mt-3"
            style={{ color: secondary }}
          >
            {inv.docTitle || 'INVOICE'}
          </p>
          <p className="text-sm text-slate-500">{inv.number}</p>
        </div>
      )}
      {def.header === 'side' && (
        <div className="flex">
          <div className="w-2 shrink-0" style={{ backgroundColor: brand }} />
          <div className="flex-1 px-5 pt-5 pb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-2xl font-extrabold tracking-tight" style={{ color: brand }}>
                {inv.docTitle || 'INVOICE'}
              </p>
              <p className="font-semibold mt-1">{profile.businessName || 'Your Business'}</p>
              <p className="text-xs text-slate-500">
                {[...profileAddressLines(profile), profile.email, profile.phone].filter(Boolean).join(' · ')}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold">{inv.number}</p>
              {logoImg}
            </div>
          </div>
        </div>
      )}
      {def.header === 'plain' && (
        <div className="px-6 pt-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500">
                {inv.docTitle || 'Invoice'}
              </p>
              <p className="font-medium mt-1">{profile.businessName || 'Your Business'}</p>
              <p className="text-xs text-slate-500">
                {[...profileAddressLines(profile), profile.email, profile.phone].filter(Boolean).join(' · ')}
              </p>
            </div>
            {logoImg}
          </div>
        </div>
      )}

      <div
        className={`px-6 py-5 ${
          settings.fontScale === 'compact'
            ? 'text-[13px]'
            : settings.fontScale === 'large'
              ? 'text-[15px]'
              : ''
        }`}
      >
        <div className="flex flex-wrap justify-between gap-4">
          <div className="text-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Bill to</p>
            <p className="font-semibold mt-0.5">{inv.clientName || 'Client name'}</p>
            <p className="text-slate-500 whitespace-pre-line">{inv.clientAddress}</p>
            <p className="text-slate-500">{inv.clientEmail}</p>
            <p className="text-slate-500">{inv.clientPhone}</p>
          </div>
          <div className="text-sm text-right">
            {inv.template !== 'modern' && <p className="font-semibold">{inv.number}</p>}
            <p className="text-slate-500">Issued: {inv.issueDate}</p>
            <p className="text-slate-500">Due: {inv.dueDate}</p>
            {inv.poNumber.trim() && (
              <p className="text-slate-500">PO / Ref: {inv.poNumber.trim()}</p>
            )}
            {inv.referenceNumber.trim() && (
              <p className="text-slate-500">Reference: {inv.referenceNumber.trim()}</p>
            )}
            {profile.taxId.trim() && (
              <p className="text-slate-500">Tax ID: {profile.taxId.trim()}</p>
            )}
            {profile.vatNumber.trim() && (
              <p className="text-slate-500">VAT/GST: {profile.vatNumber.trim()}</p>
            )}
            <span
              className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_STYLES[eff]}`}
            >
              {eff === 'paid' ? 'Paid in full' : STATUS_LABELS[eff]}
            </span>
          </div>
        </div>

        <table className="w-full text-sm mt-5">
          <thead>
            <tr
              className={
                def.table === 'filled'
                  ? 'text-white'
                  : def.table === 'striped'
                    ? 'bg-slate-100 text-slate-700'
                    : def.table === 'plain'
                      ? 'text-slate-500'
                      : 'text-slate-600 border-b border-slate-300'
              }
              style={def.table === 'filled' ? { backgroundColor: brand } : undefined}
            >
              <th className="text-left font-semibold px-2 py-2">Description</th>
              <th className="text-right font-semibold px-2 py-2 w-14">Qty</th>
              <th className="text-right font-semibold px-2 py-2 w-24">Unit price</th>
              <th className="text-right font-semibold px-2 py-2 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-b border-slate-100 align-top ${
                  def.table === 'striped' && idx % 2 === 1 ? 'bg-slate-50' : ''
                }`}
              >
                <td className="px-2 py-2">
                  <span>{item.description || '—'}</span>
                  {item.detail.trim() && (
                    <span className="block text-xs text-slate-500 mt-0.5">{item.detail}</span>
                  )}
                  {item.sku.trim() && (
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      SKU: {item.sku}
                    </span>
                  )}
                  {(totals.lines[idx]?.discount ?? 0) > 0 && (
                    <span className="block text-[11px] text-emerald-600 mt-0.5">
                      Item discount: −{money(totals.lines[idx].discount, inv.currency)}
                    </span>
                  )}
                </td>
                <td className="px-2 py-2 text-right">
                  {item.qty}
                  {item.unit ? <span className="text-slate-400"> {item.unit}</span> : null}
                </td>
                <td className="px-2 py-2 text-right">{money(item.unitPrice, inv.currency)}</td>
                <td className="px-2 py-2 text-right font-medium">
                  {money(totals.lines[idx]?.net ?? 0, inv.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <dl
            className={`w-60 text-sm space-y-1 ${
              def.totals === 'boxed' ? 'border rounded-lg p-3' : ''
            }`}
            style={def.totals === 'boxed' ? { borderColor: secondary } : undefined}
          >
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd>{money(totals.subtotal, inv.currency)}</dd>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">
                  Discount
                  {inv.discountType === 'pct' ? ` (${clampPct(inv.discountValue)}%)` : ''}
                </dt>
                <dd>− {money(totals.discountAmount, inv.currency)}</dd>
              </div>
            )}
            {totals.taxAmount > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">
                  {inv.taxLabel || 'Tax'} ({clampPct(inv.taxPct)}%)
                </dt>
                <dd>{money(totals.taxAmount, inv.currency)}</dd>
              </div>
            )}
            {inv.shipping > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Shipping</dt>
                <dd>{money(inv.shipping, inv.currency)}</dd>
              </div>
            )}
            {totals.additionalCharges > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Additional charges</dt>
                <dd>{money(totals.additionalCharges, inv.currency)}</dd>
              </div>
            )}
            {totals.roundingAdjustment !== 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Rounding adjustment</dt>
                <dd>
                  {totals.roundingAdjustment > 0 ? '+' : '−'}{' '}
                  {money(Math.abs(totals.roundingAdjustment), inv.currency)}
                </dd>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-1.5">
              <dt>Total</dt>
              <dd>{money(totals.total, inv.currency)}</dd>
            </div>
            {totals.totalPaid > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Total paid</dt>
                <dd>{money(totals.totalPaid, inv.currency)}</dd>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <dt>Balance due</dt>
              <dd>{money(totals.balance, inv.currency)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          {qrDataUrl && (
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Payment QR code"
                className="w-24 h-24 border border-slate-200 rounded"
              />
              <div className="text-xs text-slate-500 max-w-44">
                <p className="font-semibold text-slate-700 text-sm">Scan to pay</p>
                <p className="mt-0.5 break-words">{payText}</p>
              </div>
            </div>
          )}
          <div className="text-xs text-slate-500 flex-1 min-w-52 space-y-2">
            {settings.showNotes && inv.notes.trim() && (
              <p className="whitespace-pre-line">{inv.notes}</p>
            )}
            {settings.showTerms && inv.terms.trim() && (
              <p className="whitespace-pre-line">{inv.terms}</p>
            )}
            {settings.showStamp && profile.stampDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.stampDataUrl}
                alt="Business stamp or signature"
                className="max-h-16 max-w-44 object-contain opacity-90 pt-1"
              />
            )}
          </div>
        </div>
        {inv.footerText.trim() && (
          <p className="text-center text-xs text-slate-400 mt-6">{inv.footerText}</p>
        )}
      </div>
    </div>
  );
}

/* ── Invoices list ─────────────────────────────────────────────────── */

function InvoicesView({
  invoices,
  profile,
  onLoad,
  onDuplicate,
  onDelete,
  onMarkPaid,
  onToggleRecurring,
  onStopRecurring,
  onNew,
  onDownloadZip,
}: {
  invoices: Invoice[];
  profile: Profile;
  onLoad: (inv: Invoice) => void;
  onDuplicate: (inv: Invoice) => void;
  onDelete: (inv: Invoice) => void;
  onMarkPaid: (inv: Invoice) => void;
  onToggleRecurring: (inv: Invoice) => void;
  onStopRecurring: (inv: Invoice) => void;
  onNew: () => void;
  onDownloadZip: (selected: Invoice[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const [statusFilter, setStatusFilter] = useState<'all' | EffectiveStatus>('all');

  const summary = useMemo(() => {
    const byCurrency = new Map<
      string,
      { invoiced: number; collected: number; outstanding: number }
    >();
    for (const inv of invoices) {
      if (inv.status === 'cancelled') continue;
      const t = computeTotals(inv);
      const row = byCurrency.get(inv.currency) ?? { invoiced: 0, collected: 0, outstanding: 0 };
      row.invoiced += t.total;
      row.collected += Math.min(t.totalPaid, t.total);
      row.outstanding += t.balance;
      byCurrency.set(inv.currency, row);
    }
    return [...byCurrency.entries()];
  }, [invoices]);

  const recurringTemplates = useMemo(() => invoices.filter((i) => i.recurring), [invoices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && effectiveStatus(inv) !== statusFilter) return false;
      if (!q) return true;
      return inv.clientName.toLowerCase().includes(q) || inv.number.toLowerCase().includes(q);
    });
  }, [invoices, query, statusFilter]);

  return (
    <div className="space-y-5">
      {summary.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Summary</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {summary.map(([currency, row]) => (
              <div key={currency} className="rounded-lg bg-muted/60 px-4 py-3 text-sm">
                <p className="font-semibold">{currency}</p>
                <p className="flex justify-between mt-1.5">
                  <span className="text-muted-foreground">Invoiced</span>
                  <span>{money(row.invoiced, currency)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Collected</span>
                  <span>{money(row.collected, currency)}</span>
                </p>
                <p className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span>{money(row.outstanding, currency)}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {recurringTemplates.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-1">
            <Repeat className="w-4 h-4" /> Recurring invoices
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            When a next-issue date arrives, a fresh draft is created here the next time you open
            this app — nothing is ever sent automatically. Review, adjust and send each draft
            yourself.
          </p>
          <div className="space-y-2.5">
            {recurringTemplates.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border px-4 py-3"
              >
                <div className="min-w-44">
                  <p className="font-medium text-sm">
                    {inv.number} · {inv.clientName || 'Unnamed client'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {recurringLabel(inv.recurring!)} · next issue{' '}
                    {inv.recurring!.nextDate} · {money(computeTotals(inv).total, inv.currency)}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase border ${
                    inv.recurring!.active
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {inv.recurring!.active ? 'Active' : 'Paused'}
                </span>
                <div className="flex flex-wrap gap-1.5 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoad(inv)}
                    className="gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Open
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onToggleRecurring(inv)}>
                    {inv.recurring!.active ? 'Pause' : 'Resume'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onStopRecurring(inv)}>
                    Stop repeating
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {invoices.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-semibold">No saved invoices yet</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Create your first invoice and save it — it will appear here with its status and balance,
            ready to reopen, duplicate or mark as paid.
          </p>
          <Button onClick={onNew} className="mt-4 gap-2">
            <FilePlus2 className="w-4 h-4" /> Create an invoice
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-52">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by client name or invoice number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search invoices"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as 'all' | EffectiveStatus)}
            >
              <SelectTrigger className="w-48" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="partial">Partially paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2.5">
              <p className="text-sm font-medium">
                {selectedIds.size} invoice{selectedIds.size === 1 ? '' : 's'} selected
              </p>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => onDownloadZip(invoices.filter((i) => selectedIds.has(i.id)))}
              >
                <Download className="w-3.5 h-3.5" /> Download ZIP of PDFs
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                Clear selection
              </Button>
            </div>
          )}

          {filtered.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="font-semibold">No invoices match</p>
              <p className="text-sm text-muted-foreground mt-1.5">
                Try a different search term, or clear the status filter.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((inv) => {
                const t = computeTotals(inv);
                const eff = effectiveStatus(inv);
                return (
                  <Card key={inv.id} className="p-4 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary shrink-0"
                      checked={selectedIds.has(inv.id)}
                      onChange={() => toggleSelected(inv.id)}
                      aria-label={`Select invoice ${inv.number} for ZIP download`}
                    />
                    <div className="min-w-44">
                      <p className="font-semibold">{inv.number}</p>
                      <p className="text-xs text-muted-foreground">
                        {inv.clientName || 'Unnamed client'} · {inv.issueDate} → {inv.dueDate}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_STYLES[eff]}`}
                    >
                      {STATUS_LABELS[eff]}
                    </span>
                    {inv.recurring && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Repeat className="w-3.5 h-3.5" />
                        {recurringLabel(inv.recurring)}
                      </span>
                    )}
                    <div className="text-sm ml-auto text-right">
                      <p className="font-semibold">{money(t.total, inv.currency)}</p>
                      <p className="text-xs text-muted-foreground">
                        Balance: {money(t.balance, inv.currency)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onLoad(inv)}
                        className="gap-1.5"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDuplicate(inv)}
                        className="gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                      </Button>
                      <a
                        href={emailHref(inv, profile)}
                        className={SHARE_BTN_CLASS}
                        aria-label={`Email invoice ${inv.number}`}
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                      <a
                        href={whatsappHref(inv, profile)}
                        target="_blank"
                        rel="noreferrer"
                        className={SHARE_BTN_CLASS}
                        aria-label={`Send invoice ${inv.number} on WhatsApp`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      {eff !== 'paid' && (
                        <Button size="sm" variant="outline" onClick={() => onMarkPaid(inv)}>
                          Mark paid
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(inv)}
                        className="gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────── */

type DashRange = 'all' | 'today' | '7d' | '30d' | 'month' | 'lastMonth' | 'year' | 'custom';

function dashRangeBounds(
  range: DashRange,
  customFrom: string,
  customTo: string
): { from: string | null; to: string | null } {
  const today = todayIso();
  if (range === 'all') return { from: null, to: null };
  if (range === 'custom') return { from: customFrom || null, to: customTo || null };
  if (range === 'today') return { from: today, to: today };
  if (range === '7d') return { from: addDaysIso(today, -6), to: today };
  if (range === '30d') return { from: addDaysIso(today, -29), to: today };
  const now = new Date();
  if (range === 'month')
    return { from: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`, to: today };
  if (range === 'year') return { from: `${now.getFullYear()}-01-01`, to: today };
  // lastMonth
  const firstThis = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastPrev = new Date(firstThis.getTime() - 86400000);
  const firstPrev = new Date(lastPrev.getFullYear(), lastPrev.getMonth(), 1);
  return { from: toIsoLocal(firstPrev), to: toIsoLocal(lastPrev) };
}

function toIsoLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function DashboardView({ invoices, profile }: { invoices: Invoice[]; profile: Profile }) {
  const [range, setRange] = useState<DashRange>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [chartMode, setChartMode] = useState<'billed' | 'received'>('billed');
  const [chartSpan, setChartSpan] = useState<6 | 12>(6);

  const data = useMemo(() => {
    const bounds = dashRangeBounds(range, customFrom, customTo);
    const inRange = (iso: string) =>
      (!bounds.from || iso >= bounds.from) && (!bounds.to || iso <= bounds.to);
    const issuedAll = invoices.filter((i) => i.status !== 'draft' && i.status !== 'cancelled');
    const issuedRange = issuedAll.filter((i) => inRange(i.issueDate));

    interface CurRow {
      billed: number;
      collectedPeriod: number;
      count: number;
      outstanding: number;
      overdueAmount: number;
      overdueCount: number;
    }
    const perCurrency = new Map<string, CurRow>();
    const rowFor = (cur: string): CurRow => {
      const r = perCurrency.get(cur) ?? {
        billed: 0,
        collectedPeriod: 0,
        count: 0,
        outstanding: 0,
        overdueAmount: 0,
        overdueCount: 0,
      };
      perCurrency.set(cur, r);
      return r;
    };
    // Payments received inside the period: ledger entries by their own date;
    // the legacy lump sum is attributed to the invoice's issue date.
    const collectedInPeriod = (inv: Invoice, t: Totals): number => {
      let sum = inv.amountPaid > 0 && inRange(inv.issueDate) ? inv.amountPaid : 0;
      for (const pay of inv.payments) if (inRange(pay.date)) sum += pay.amount;
      return Math.min(t.total, sum);
    };
    for (const inv of issuedRange) {
      const t = computeTotals(inv);
      const r = rowFor(inv.currency);
      r.billed += t.total;
      r.collectedPeriod += collectedInPeriod(inv, t);
      r.count += 1;
    }
    const aging = new Map<
      string,
      { notDue: number; b30: number; b60: number; b90: number; b90plus: number }
    >();
    const todayMs = Date.parse(todayIso());
    for (const inv of issuedAll) {
      const t = computeTotals(inv);
      const r = rowFor(inv.currency);
      r.outstanding += t.balance;
      if (effectiveStatus(inv) === 'overdue') {
        r.overdueAmount += t.balance;
        r.overdueCount += 1;
      }
      if (t.balance > 0) {
        const a = aging.get(inv.currency) ?? {
          notDue: 0,
          b30: 0,
          b60: 0,
          b90: 0,
          b90plus: 0,
        };
        const daysOverdue = Math.floor((todayMs - Date.parse(inv.dueDate)) / 86400000);
        if (daysOverdue <= 0) a.notDue += t.balance;
        else if (daysOverdue <= 30) a.b30 += t.balance;
        else if (daysOverdue <= 60) a.b60 += t.balance;
        else if (daysOverdue <= 90) a.b90 += t.balance;
        else a.b90plus += t.balance;
        aging.set(inv.currency, a);
      }
    }

    // Status distribution — counts only (never money), across every invoice.
    const statusDist = new Map<EffectiveStatus, number>();
    for (const inv of invoices) {
      const eff = effectiveStatus(inv);
      statusDist.set(eff, (statusDist.get(eff) ?? 0) + 1);
    }

    // Chart series in the profile currency: billed by issue month, or
    // payments received by payment month (lump sums at their issue month).
    const months: Array<{ key: string; label: string; total: number }> = [];
    const now = new Date();
    for (let i = chartSpan - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        key,
        label:
          chartSpan === 12
            ? `${d.toLocaleDateString('en-US', { month: 'short' })} ${String(
                d.getFullYear()
              ).slice(2)}`
            : d.toLocaleDateString('en-US', { month: 'short' }),
        total: 0,
      });
    }
    const monthIndex = new Map(months.map((m, i) => [m.key, i]));
    const clientTotals = new Map<string, { billed: number; outstanding: number }>();
    for (const inv of issuedAll) {
      if (inv.currency !== profile.currency) continue;
      const t = computeTotals(inv);
      if (chartMode === 'billed') {
        const idx = monthIndex.get(inv.issueDate.slice(0, 7));
        if (idx !== undefined) months[idx].total += t.total;
      } else {
        if (inv.amountPaid > 0) {
          const idx = monthIndex.get(inv.issueDate.slice(0, 7));
          if (idx !== undefined) months[idx].total += inv.amountPaid;
        }
        for (const pay of inv.payments) {
          const idx = monthIndex.get(pay.date.slice(0, 7));
          if (idx !== undefined) months[idx].total += pay.amount;
        }
      }
      const name = inv.clientName.trim() || 'Unnamed client';
      const c = clientTotals.get(name) ?? { billed: 0, outstanding: 0 };
      c.billed += t.total;
      c.outstanding += t.balance;
      clientTotals.set(name, c);
    }
    const topClients = [...clientTotals.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.billed - a.billed)
      .slice(0, 5);

    // Revenue by year, per currency — billed and collected (all-time basis).
    const byYear = new Map<string, Map<string, { billed: number; collected: number }>>();
    for (const inv of issuedAll) {
      const t = computeTotals(inv);
      const year = inv.issueDate.slice(0, 4) || 'Unknown';
      const years = byYear.get(inv.currency) ?? new Map();
      const y = years.get(year) ?? { billed: 0, collected: 0 };
      y.billed += t.total;
      y.collected += Math.min(t.totalPaid, t.total);
      years.set(year, y);
      byYear.set(inv.currency, years);
    }

    const currenciesUsed = new Set(issuedAll.map((i) => i.currency));
    return {
      perCurrency: [...perCurrency.entries()].filter(([, r]) => r.count > 0 || r.outstanding > 0),
      aging: [...aging.entries()],
      statusDist: [...statusDist.entries()],
      months,
      topClients,
      byYear: [...byYear.entries()].map(([cur, years]) => ({
        currency: cur,
        years: [...years.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)),
      })),
      multiCurrency: currenciesUsed.size > 1,
      issuedCount: issuedAll.length,
      rangeCount: issuedRange.length,
    };
  }, [invoices, profile.currency, range, customFrom, customTo, chartMode, chartSpan]);

  if (data.issuedCount === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-semibold">Nothing to chart yet</p>
        <p className="text-sm text-muted-foreground mt-1.5">
          The dashboard comes alive once you have saved an invoice and marked it as sent.
          Drafts are excluded — this page tracks money you have actually billed.
        </p>
      </Card>
    );
  }

  const chartMax = Math.max(...data.months.map((m) => m.total), 0);
  const statusOrder: EffectiveStatus[] = [
    'draft',
    'sent',
    'viewed',
    'partial',
    'overdue',
    'paid',
    'cancelled',
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Date range (issue date)">
          <Select value={range} onValueChange={(v) => setRange(v as DashRange)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {range === 'custom' && (
          <>
            <Field label="From">
              <Input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </Field>
            <Field label="To">
              <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
            </Field>
          </>
        )}
        <p className="text-xs text-muted-foreground pb-2">
          {data.rangeCount} invoice{data.rangeCount === 1 ? '' : 's'} in this period. Money is
          always shown per currency — amounts in different currencies are never added together.
          Outstanding and aging always reflect today, whatever range you pick.
        </p>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Invoices by status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOrder
            .filter((st) => (data.statusDist.find(([k]) => k === st)?.[1] ?? 0) > 0)
            .map((st) => (
              <span
                key={st}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[st]}`}
              >
                {STATUS_LABELS[st]}: {data.statusDist.find(([k]) => k === st)?.[1]}
              </span>
            ))}
        </div>
      </Card>

      {data.perCurrency.map(([currency, row]) => (
        <div key={currency}>
          <h3 className="font-semibold mb-3">{currency} overview</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Billed in period
              </p>
              <p className="text-xl font-bold mt-1">{money(row.billed, currency)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {row.count} invoice{row.count === 1 ? '' : 's'}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Collected in period
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-600">
                {money(row.collectedPeriod, currency)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Average invoice value
              </p>
              <p className="text-xl font-bold mt-1">
                {row.count > 0 ? money(row.billed / row.count, currency) : '—'}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Collection rate
              </p>
              <p className="text-xl font-bold mt-1">
                {row.billed > 0
                  ? `${Math.round((row.collectedPeriod / row.billed) * 100)}%`
                  : '—'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Of this period&rsquo;s billing, collected within the period
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Outstanding now
              </p>
              <p className="text-xl font-bold mt-1">{money(row.outstanding, currency)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Overdue now
              </p>
              <p className="text-xl font-bold mt-1 text-red-600">
                {money(row.overdueAmount, currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {row.overdueCount} invoice{row.overdueCount === 1 ? '' : 's'} past due
              </p>
            </Card>
          </div>
        </div>
      ))}

      <div className="grid gap-5 lg:grid-cols-2 items-start">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">
              {chartMode === 'billed' ? 'Billed' : 'Payments received'} — last {chartSpan}{' '}
              months ({profile.currency})
            </h3>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={chartMode === 'billed' ? 'default' : 'outline'}
                onClick={() => setChartMode('billed')}
              >
                Billed
              </Button>
              <Button
                size="sm"
                variant={chartMode === 'received' ? 'default' : 'outline'}
                onClick={() => setChartMode('received')}
              >
                Received
              </Button>
              <Button
                size="sm"
                variant={chartSpan === 6 ? 'default' : 'outline'}
                onClick={() => setChartSpan(6)}
              >
                6 mo
              </Button>
              <Button
                size="sm"
                variant={chartSpan === 12 ? 'default' : 'outline'}
                onClick={() => setChartSpan(12)}
              >
                12 mo
              </Button>
            </div>
          </div>
          {data.multiCurrency && (
            <p className="text-xs text-muted-foreground mt-1">
              Your invoices use more than one currency; this chart and the client ranking
              show {profile.currency} only.
            </p>
          )}
          {chartMax <= 0 ? (
            <p className="text-sm text-muted-foreground mt-4">
              No {profile.currency}{' '}
              {chartMode === 'billed' ? 'invoices were issued' : 'payments were received'} in
              the last {chartSpan} months.
            </p>
          ) : (
            <div className="mt-5">
              <div className="flex items-end gap-3 h-40">
                {data.months.map((m) => (
                  <div
                    key={m.key}
                    className="flex-1 flex flex-col items-center justify-end h-full gap-2 min-w-0"
                  >
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {m.total > 0 ? money(m.total, profile.currency) : ''}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-primary/80 min-h-1"
                      style={{ height: `${Math.max(3, (m.total / chartMax) * 100)}%` }}
                      title={`${m.label}: ${money(m.total, profile.currency)}`}
                    />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Who owes what — aging</h3>
            <div className="space-y-4">
              {data.aging.map(([currency, a]) => (
                <div key={currency} className="text-sm">
                  {data.aging.length > 1 && <p className="font-semibold mb-1.5">{currency}</p>}
                  {(
                    [
                      ['Not yet due', a.notDue],
                      ['0–30 days overdue', a.b30],
                      ['31–60 days overdue', a.b60],
                      ['61–90 days overdue', a.b90],
                      ['Over 90 days overdue', a.b90plus],
                    ] as Array<[string, number]>
                  ).map(([label, amount]) => (
                    <p
                      key={label}
                      className="flex justify-between py-1 border-b border-border/50 last:border-0"
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <span
                        className={
                          amount > 0 && label !== 'Not yet due'
                            ? 'font-medium text-red-600'
                            : 'font-medium'
                        }
                      >
                        {money(amount, currency)}
                      </span>
                    </p>
                  ))}
                </div>
              ))}
              {data.aging.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nothing outstanding — every issued invoice is fully paid.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Top clients ({profile.currency})</h3>
            {data.topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No {profile.currency} invoices yet.
              </p>
            ) : (
              <ol className="space-y-2.5">
                {data.topClients.map((c, i) => (
                  <li key={c.name} className="flex items-baseline gap-3 text-sm">
                    <span className="font-bold text-primary w-5">{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="font-medium block truncate">{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Outstanding: {money(c.outstanding, profile.currency)}
                      </span>
                    </span>
                    <span className="font-semibold">{money(c.billed, profile.currency)}</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>

      {data.byYear.some((g) => g.years.length > 0) && (
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Revenue by year</h3>
          <div className="space-y-4">
            {data.byYear.map((g) => (
              <div key={g.currency} className="text-sm">
                {data.byYear.length > 1 && (
                  <p className="font-semibold mb-1.5">{g.currency}</p>
                )}
                {g.years.map(([year, y]) => (
                  <p
                    key={year}
                    className="flex flex-wrap justify-between gap-2 py-1 border-b border-border/50 last:border-0"
                  >
                    <span className="text-muted-foreground">{year}</span>
                    <span>
                      Billed <span className="font-medium">{money(y.billed, g.currency)}</span>
                      {'  ·  '}Collected{' '}
                      <span className="font-medium text-emerald-600">
                        {money(y.collected, g.currency)}
                      </span>
                    </span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}
      <p className="text-xs text-muted-foreground">
        Drafts and cancelled invoices are excluded from every money figure on this page.
      </p>
    </div>
  );
}


/* ── Client statement PDF ──────────────────────────────────────────── */

function downloadClientStatement(profile: Profile, client: Client, invoices: Invoice[]): void {
  const doc = new JsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const brand = hexToRgb(profile.brandColor || '#1d4ed8');
  const rows = invoicesForClient(client, invoices);
  let y = 15;

  doc.setFillColor(brand.r, brand.g, brand.b);
  doc.rect(0, 0, pageW, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(profile.businessName || 'Your Business', 15, 11);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text([profile.email, profile.phone].filter(Boolean).join(' · '), 15, 18);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('STATEMENT', pageW - 15, 14, { align: 'right' });
  doc.setTextColor(30, 30, 30);
  y = 34;

  doc.setFontSize(10.5);
  doc.text(`Statement for: ${client.name}`, 15, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const clientLines = doc.splitTextToSize(
    [client.address, client.email, client.phone].filter(Boolean).join('\n'),
    120
  ) as string[];
  clientLines.forEach((line, i) => doc.text(line, 15, y + 5 + i * 4.5));
  doc.text(`Period: all invoices to ${todayIso()}`, pageW - 15, y, { align: 'right' });
  y += 8 + clientLines.length * 4.5;

  const drawHeader = () => {
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y - 4.5, pageW - 30, 7.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Number', 17, y + 1);
    doc.text('Issued', 52, y + 1);
    doc.text('Due', 76, y + 1);
    doc.text('Status', 100, y + 1);
    doc.text('Total', 148, y + 1, { align: 'right' });
    doc.text('Paid', 170, y + 1, { align: 'right' });
    doc.text('Balance', pageW - 17, y + 1, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 8;
  };
  const ensure = (need: number) => {
    if (y + need > pageH - 18) {
      doc.addPage();
      y = 15;
      drawHeader();
    }
  };

  drawHeader();
  doc.setFontSize(9.5);
  if (rows.length === 0) {
    doc.text('No invoices on record for this client yet.', 17, y + 2);
    y += 10;
  }
  const totalsByCurrency = new Map<string, { total: number; paid: number; balance: number }>();
  rows.forEach((inv) => {
    const t = computeTotals(inv);
    const eff = effectiveStatus(inv);
    ensure(7);
    doc.text(inv.number || '—', 17, y);
    doc.text(inv.issueDate, 52, y);
    doc.text(inv.dueDate, 76, y);
    doc.text(STATUS_LABELS[eff], 100, y);
    doc.text(money(t.total, inv.currency), 148, y, { align: 'right' });
    doc.text(money(Math.min(t.totalPaid, t.total), inv.currency), 170, y, { align: 'right' });
    doc.text(money(t.balance, inv.currency), pageW - 17, y, { align: 'right' });
    y += 6;
    const agg = totalsByCurrency.get(inv.currency) ?? { total: 0, paid: 0, balance: 0 };
    agg.total += t.total;
    agg.paid += Math.min(t.totalPaid, t.total);
    agg.balance += t.balance;
    totalsByCurrency.set(inv.currency, agg);
  });

  y += 4;
  ensure(10 + totalsByCurrency.size * 14);
  doc.setDrawColor(180, 180, 180);
  doc.line(15, y - 3, pageW - 15, y - 3);
  [...totalsByCurrency.entries()].forEach(([currency, agg]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Totals (${currency})`, 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoiced: ${money(agg.total, currency)}`, 15, y + 5.5);
    doc.text(`Paid: ${money(agg.paid, currency)}`, 85, y + 5.5);
    y += 11;
    if (agg.balance > 0) {
      doc.setFillColor(254, 226, 226);
      doc.rect(15, y - 4.5, pageW - 30, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(153, 27, 27);
      doc.text(`AMOUNT OUTSTANDING: ${money(agg.balance, currency)}`, 17, y + 1);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'normal');
      y += 8;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.text('Nothing outstanding — account fully settled.', 15, y);
      doc.setFont('helvetica', 'normal');
      y += 6;
    }
    y += 3;
  });

  if (profile.paymentDetails.trim()) {
    ensure(16);
    y += 2;
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(
      `Payment details: ${profile.paymentDetails.trim()}`,
      pageW - 30
    ) as string[];
    lines.forEach((line) => {
      ensure(5);
      doc.text(line, 15, y);
      y += 4.5;
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    'Statement created with the free Invoice Generator — invoicegenerator.freeqrcode.tools',
    pageW / 2,
    pageH - 8,
    { align: 'center' }
  );
  doc.save(`statement-${client.name.replace(/[^\w-]+/g, '-').toLowerCase() || 'client'}.pdf`);
}

/* ── Settings: profile + clients ───────────────────────────────────── */

interface ImportPayload {
  version?: number;
  profile?: Partial<Profile>;
  profiles?: Partial<Profile>[];
  clients?: Partial<Client>[];
  invoices?: Partial<Invoice>[];
}

const CLIENT_CSV_HEADER = [
  'Name',
  'Company',
  'Contact person',
  'Email',
  'Phone',
  'Billing address',
  'Shipping address',
  'Tax ID',
  'Country',
  'Default currency',
  'Terms',
  'Notes',
];

function clientsToCsv(clients: Client[]): string {
  return toCsv([
    CLIENT_CSV_HEADER,
    ...clients.map((c) => [
      c.name,
      c.company,
      c.contactPerson,
      c.email,
      c.phone,
      c.address,
      c.shippingAddress,
      c.taxId,
      c.country,
      c.defaultCurrency,
      c.terms,
      c.notes,
    ]),
  ]);
}

/** Parse a clients CSV. A header row (containing "name") maps columns by
 * title; without one, columns are positional: name, email, phone, address. */
function clientsFromCsv(text: string): { clients: Partial<Client>[]; skipped: number } {
  const rows = parseCsv(text);
  if (rows.length === 0) return { clients: [], skipped: 0 };
  const first = rows[0].map((c) => c.trim().toLowerCase());
  const hasHeader = first.some((c) => c === 'name' || c === 'client name');
  const col = (names: string[], pos: number): number => {
    if (!hasHeader) return pos;
    for (const n of names) {
      const i = first.indexOf(n);
      if (i >= 0) return i;
    }
    return -1;
  };
  const idx = {
    name: col(['name', 'client name'], 0),
    company: col(['company', 'company name'], -1),
    contactPerson: col(['contact person', 'contact'], -1),
    email: col(['email', 'e-mail'], 1),
    phone: col(['phone', 'telephone'], 2),
    address: col(['billing address', 'address'], 3),
    shippingAddress: col(['shipping address'], -1),
    taxId: col(['tax id', 'taxid', 'ntn'], -1),
    country: col(['country'], -1),
    defaultCurrency: col(['default currency', 'currency'], -1),
    terms: col(['terms', 'payment terms'], -1),
    notes: col(['notes', 'note'], -1),
  };
  const get = (row: string[], i: number) => (i >= 0 ? (row[i] ?? '').trim() : '');
  const out: Partial<Client>[] = [];
  let skipped = 0;
  for (const row of rows.slice(hasHeader ? 1 : 0)) {
    const name = get(row, idx.name);
    if (!name) {
      skipped++;
      continue;
    }
    out.push({
      name,
      company: get(row, idx.company),
      contactPerson: get(row, idx.contactPerson),
      email: get(row, idx.email),
      phone: get(row, idx.phone),
      address: get(row, idx.address),
      shippingAddress: get(row, idx.shippingAddress),
      taxId: get(row, idx.taxId),
      country: get(row, idx.country),
      defaultCurrency: get(row, idx.defaultCurrency).toUpperCase(),
      terms: get(row, idx.terms),
      notes: get(row, idx.notes),
    });
  }
  return { clients: out, skipped };
}

function SettingsView({
  profile,
  setProfile,
  profiles,
  onSwitchProfile,
  onAddProfile,
  onDeleteProfile,
  clients,
  setClients,
  invoices,
  onImportData,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  profiles: Profile[];
  onSwitchProfile: (id: string) => void;
  onAddProfile: () => void;
  onDeleteProfile: (id: string) => void;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  invoices: Invoice[];
  onImportData: (data: ImportPayload) => void;
}) {
  const [section, setSection] = useState<'profile' | 'clients' | 'data'>('profile');
  const patch = (p: Partial<Profile>) => setProfile((cur) => ({ ...cur, ...p }));

  /* ── Backup / storage ── */
  const importRef = useRef<HTMLInputElement>(null);
  const readStorageKb = (): number | null => {
    if (typeof window === 'undefined') return null;
    try {
      const keys = [PROFILE_KEY, PROFILES_KEY, CLIENTS_KEY, INVOICES_KEY, DRAFT_KEY];
      const bytes = keys.reduce(
        (sum, k) => sum + (window.localStorage.getItem(k)?.length ?? 0),
        0
      );
      return Math.round((bytes / 1024) * 10) / 10;
    } catch {
      return null;
    }
  };
  const [storageKb, setStorageKb] = useState<number | null>(() => readStorageKb());

  const handleImage = (file: File | null, field: 'logoDataUrl' | 'stampDataUrl') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('That file is not an image. Please choose a PNG, JPG or SVG file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert(
        'That image is larger than 2 MB. Browser storage is limited — please resize it and try again.'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ [field]: String(reader.result || '') });
    reader.readAsDataURL(file);
  };

  const handleExportCsv = () => {
    const header = [
      'Number',
      'Issue date',
      'Due date',
      'Client',
      'Currency',
      'Total',
      'Paid',
      'Balance',
      'Status',
    ];
    const lines = invoices.map((inv) => {
      const t = computeTotals(inv);
      return [
        csvCell(inv.number),
        csvCell(inv.issueDate),
        csvCell(inv.dueDate),
        csvCell(inv.clientName),
        csvCell(inv.currency),
        csvCell(t.total.toFixed(2)),
        csvCell(Math.min(t.totalPaid, t.total).toFixed(2)),
        csvCell(t.balance.toFixed(2)),
        csvCell(STATUS_LABELS[effectiveStatus(inv)]),
      ].join(',');
    });
    downloadTextFile(
      'invoices.csv',
      [header.join(','), ...lines].join('\n'),
      'text/csv;charset=utf-8'
    );
  };

  const handleExportBackup = () => {
    const backup = {
      app: 'invoicegenerator',
      version: 2,
      exportedAt: new Date().toISOString(),
      profile,
      profiles,
      clients,
      invoices,
    };
    downloadTextFile(
      `invoice-generator-backup-${todayIso()}.json`,
      JSON.stringify(backup, null, 2),
      'application/json'
    );
  };

  const handleImportFile = (file: File | null) => {
    if (!file) return;
    file
      .text()
      .then((text) => {
        let data: ImportPayload | null = null;
        try {
          data = JSON.parse(text) as ImportPayload;
        } catch {
          data = null;
        }
        if (
          !data ||
          typeof data !== 'object' ||
          (!data.profile && !data.profiles && !data.clients && !data.invoices)
        ) {
          window.alert('That file does not look like an Invoice Generator backup.');
          return;
        }
        // Duplicate detection: imported invoices that match an existing one
        // by id, or by number + client, are reported before anything changes.
        const imported = Array.isArray(data.invoices) ? data.invoices : [];
        const dupes = imported.filter(
          (inv) =>
            !!inv &&
            invoices.some(
              (cur) =>
                (inv.id && cur.id === inv.id) ||
                (!!inv.number && cur.number === inv.number && cur.clientName === inv.clientName)
            )
        ).length;
        const dupeNote =
          dupes > 0
            ? `\n\n${dupes} of the ${imported.length} invoices in this file look like duplicates of invoices you already have.`
            : '';
        if (
          !window.confirm(
            `Import this backup? It will REPLACE your current business profiles, clients and invoices in this browser.${dupeNote}`
          )
        )
          return;
        onImportData(data);
        window.alert('Backup imported. Your data has been restored from the file.');
      })
      .catch(() => {
        window.alert('Could not read that file.');
      });
  };

  /* ── Clients ── */
  const [clientQuery, setClientQuery] = useState('');
  const [clientForm, setClientForm] = useState<Partial<Client>>({});
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const clientImportRef = useRef<HTMLInputElement>(null);

  const saveClientForm = () => {
    if (!clientForm.name?.trim()) return;
    const saved = normalizeClient({ ...clientForm, id: editingClientId ?? uid() });
    setClients((list) =>
      editingClientId
        ? list.map((c) => (c.id === editingClientId ? saved : c))
        : [...list, saved]
    );
    setClientForm({});
    setEditingClientId(null);
  };

  const handleClientCsvImport = (file: File | null) => {
    if (!file) return;
    file
      .text()
      .then((text) => {
        const { clients: parsed, skipped } = clientsFromCsv(text);
        if (parsed.length === 0) {
          window.alert('No clients with a name were found in that file.');
          return;
        }
        setClients((list) => [...list, ...parsed.map((c) => normalizeClient(c))]);
        window.alert(
          `Imported ${parsed.length} client${parsed.length === 1 ? '' : 's'}.` +
            (skipped > 0 ? ` ${skipped} row${skipped === 1 ? '' : 's'} skipped (no name).` : '')
        );
      })
      .catch(() => window.alert('Could not read that file.'));
  };

  const visibleClients = clients.filter((c) => {
    const q = clientQuery.trim().toLowerCase();
    if (!q) return true;
    return [c.name, c.company, c.contactPerson, c.email, c.phone]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  const sectionBtn = (key: typeof section, label: string) => (
    <Button
      key={key}
      variant={section === key ? 'default' : 'outline'}
      size="sm"
      onClick={() => {
        setSection(key);
        if (key === 'data') setStorageKb(readStorageKb());
      }}
    >
      {label}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Business settings sections">
        {sectionBtn('profile', 'Business profiles')}
        {sectionBtn('clients', `Clients (${clients.length})`)}
        {sectionBtn('data', 'Backup & data')}
      </div>

      {section === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Business profile
            </h3>
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex-1 min-w-52">
                <Field label="Active profile">
                  <Select value={profile.id} onValueChange={onSwitchProfile}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.businessName || 'Unnamed business'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Button variant="outline" size="sm" onClick={onAddProfile} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={profiles.length <= 1}
                onClick={() => onDeleteProfile(profile.id)}
                className="gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Run several businesses? Keep a profile for each — its own logo, currency, tax
              defaults and payment details. Switching profiles changes the branding and defaults
              for new invoices; saved invoices never change.
            </p>
            <Field label="Business name">
              <Input
                value={profile.businessName}
                onChange={(e) => patch({ businessName: e.target.value })}
                placeholder="Ayesha Khan Design Studio"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <Input
                  value={profile.email}
                  onChange={(e) => patch({ email: e.target.value })}
                  placeholder="billing@yourbusiness.com"
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={profile.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                  placeholder="+92 300 1234567"
                />
              </Field>
            </div>
            <Field label="Business address">
              <Textarea
                rows={2}
                value={profile.address}
                onChange={(e) => patch({ address: e.target.value })}
                placeholder={'Street address'}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <Input value={profile.city} onChange={(e) => patch({ city: e.target.value })} />
              </Field>
              <Field label="State / province">
                <Input value={profile.state} onChange={(e) => patch({ state: e.target.value })} />
              </Field>
              <Field label="Postal code">
                <Input
                  value={profile.postalCode}
                  onChange={(e) => patch({ postalCode: e.target.value })}
                />
              </Field>
              <Field label="Country">
                <Input
                  value={profile.country}
                  onChange={(e) => patch({ country: e.target.value })}
                />
              </Field>
              <Field label="Tax ID (NTN / EIN / TRN)">
                <Input value={profile.taxId} onChange={(e) => patch({ taxId: e.target.value })} />
              </Field>
              <Field label="VAT / GST registration no.">
                <Input
                  value={profile.vatNumber}
                  onChange={(e) => patch({ vatNumber: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Logo">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4" /> Upload logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImage(e.target.files?.[0] ?? null, 'logoDataUrl')}
                  />
                </label>
                {profile.logoDataUrl && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.logoDataUrl}
                      alt="Your business logo"
                      className="max-h-10 max-w-24 object-contain border border-border rounded bg-white p-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => patch({ logoDataUrl: '' })}
                      className="gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </>
                )}
              </div>
            </Field>
            <Field label="Stamp or signature image">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4" /> Upload stamp
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImage(e.target.files?.[0] ?? null, 'stampDataUrl')}
                  />
                </label>
                {profile.stampDataUrl && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.stampDataUrl}
                      alt="Your business stamp or signature"
                      className="max-h-10 max-w-24 object-contain border border-border rounded bg-white p-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => patch({ stampDataUrl: '' })}
                      className="gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                A scanned signature or company stamp (PNG/JPG, up to 2 MB). It prints beside the
                totals on every invoice and PDF — a transparent PNG works best.
              </p>
            </Field>
          </Card>

          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold">Defaults for new invoices</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Default currency">
                  <Select value={profile.currency} onValueChange={(v) => patch({ currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {currencyLabel(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Next invoice number">
                  <NumInput
                    value={profile.nextInvoiceNumber}
                    onChange={(n) =>
                      patch({ nextInvoiceNumber: Math.max(1, Math.floor(n) || 1) })
                    }
                    min={1}
                    step={1}
                  />
                </Field>
                <Field label="Invoice number prefix">
                  <Input
                    value={profile.numberPrefix}
                    onChange={(e) => patch({ numberPrefix: e.target.value })}
                    placeholder="INV-"
                  />
                </Field>
                <Field label="Invoice number suffix">
                  <Input
                    value={profile.numberSuffix}
                    onChange={(e) => patch({ numberSuffix: e.target.value })}
                    placeholder="e.g. /2026"
                  />
                </Field>
                <Field label="Default tax label">
                  <Input
                    value={profile.taxLabel}
                    onChange={(e) => patch({ taxLabel: e.target.value })}
                    placeholder="VAT / GST / Sales tax"
                  />
                </Field>
                <Field label="Default tax rate %">
                  <NumInput
                    value={profile.taxRate}
                    onChange={(n) => patch({ taxRate: n })}
                    min={0}
                    max={100}
                  />
                </Field>
                <Field label="Brand colour">
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      className="w-14 h-10 p-1 cursor-pointer"
                      value={profile.brandColor}
                      onChange={(e) => patch({ brandColor: e.target.value })}
                    />
                    <Input
                      value={profile.brandColor}
                      onChange={(e) => patch({ brandColor: e.target.value })}
                    />
                  </div>
                </Field>
              </div>
              <Field label="Default terms (used on new invoices)">
                <Textarea
                  rows={2}
                  value={profile.defaultTerms}
                  onChange={(e) => patch({ defaultTerms: e.target.value })}
                  placeholder="Leave blank for the built-in 14-day wording."
                />
              </Field>
              <Field label="Default invoice footer">
                <Input
                  value={profile.defaultFooter}
                  onChange={(e) => patch({ defaultFooter: e.target.value })}
                  placeholder="e.g. Registered in Pakistan · NTN 1234567-8"
                />
              </Field>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-semibold">Bank &amp; payment details</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bank name">
                  <Input
                    value={profile.bankName}
                    onChange={(e) => patch({ bankName: e.target.value })}
                  />
                </Field>
                <Field label="Account title">
                  <Input
                    value={profile.accountTitle}
                    onChange={(e) => patch({ accountTitle: e.target.value })}
                  />
                </Field>
                <Field label="IBAN">
                  <Input value={profile.iban} onChange={(e) => patch({ iban: e.target.value })} />
                </Field>
                <Field label="SWIFT / BIC">
                  <Input
                    value={profile.swift}
                    onChange={(e) => patch({ swift: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Payment details (default QR content — payment link, wallet, or bank details)">
                <Textarea
                  rows={3}
                  value={profile.paymentDetails}
                  onChange={(e) => patch({ paymentDetails: e.target.value })}
                  placeholder="https://your-payment-link — or — IBAN: PK36 …, Account title: …"
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                The QR code on an invoice simply displays these details (or opens your payment
                link) so your client can pay you through their own bank — this app never processes
                payments itself.
              </p>
            </Card>
          </div>
        </div>
      )}

      {section === 'clients' && (
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-semibold flex-1">Client address book</h3>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() =>
                  downloadTextFile('clients.csv', clientsToCsv(clients), 'text/csv;charset=utf-8')
                }
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => clientImportRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5" /> Import CSV
              </Button>
              <input
                ref={clientImportRef}
                type="file"
                accept="text/csv,.csv"
                className="hidden"
                onChange={(e) => {
                  handleClientCsvImport(e.target.files?.[0] ?? null);
                  e.target.value = '';
                }}
              />
            </div>
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search clients by name, company, email or phone"
                value={clientQuery}
                onChange={(e) => setClientQuery(e.target.value)}
                aria-label="Search clients"
              />
            </div>
            {clients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No clients saved yet. Add your first client below, or choose &ldquo;New
                client&rdquo; while creating an invoice — they are saved here automatically when
                you save the invoice.
              </p>
            ) : visibleClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients match your search.</p>
            ) : (
              <ul className="divide-y divide-border">
                {visibleClients.map((c) => {
                  const history = invoicesForClient(c, invoices);
                  const totals = new Map<
                    string,
                    { invoiced: number; paid: number; outstanding: number }
                  >();
                  for (const inv of history) {
                    if (inv.status === 'cancelled') continue;
                    const t = computeTotals(inv);
                    const row = totals.get(inv.currency) ?? {
                      invoiced: 0,
                      paid: 0,
                      outstanding: 0,
                    };
                    row.invoiced += t.total;
                    row.paid += Math.min(t.totalPaid, t.total);
                    row.outstanding += t.balance;
                    totals.set(inv.currency, row);
                  }
                  return (
                    <li key={c.id} className="py-3">
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">
                            {c.name}
                            {c.company && (
                              <span className="text-muted-foreground font-normal">
                                {' '}
                                · {c.company}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {[c.contactPerson, c.email, c.phone, c.country]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                          {[...totals.entries()].map(([currency, row]) => (
                            <p key={currency} className="text-xs mt-0.5">
                              {currency}: invoiced {money(row.invoiced, currency)} · paid{' '}
                              {money(row.paid, currency)} · outstanding{' '}
                              {money(row.outstanding, currency)}
                            </p>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setExpandedClientId(expandedClientId === c.id ? null : c.id)
                            }
                            className="gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> History
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadClientStatement(profile, c, invoices)}
                            className="gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> Statement
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setClientForm({ ...c });
                              setEditingClientId(c.id);
                            }}
                            className="gap-1"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setClients((list) => [
                                ...list,
                                normalizeClient({ ...c, id: uid(), name: `${c.name} (copy)` }),
                              ])
                            }
                            className="gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" /> Duplicate
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete client ${c.name}? Their invoices stay in your list.`
                                )
                              ) {
                                setClients((list) => list.filter((x) => x.id !== c.id));
                              }
                            }}
                            className="gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </div>
                      </div>
                      {expandedClientId === c.id && (
                        <div className="mt-2 rounded-lg bg-muted/50 px-4 py-3">
                          {history.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              No invoices on record for this client yet.
                            </p>
                          ) : (
                            <ul className="space-y-1">
                              {history.map((inv) => {
                                const t = computeTotals(inv);
                                return (
                                  <li
                                    key={inv.id}
                                    className="flex flex-wrap justify-between gap-2 text-xs"
                                  >
                                    <span>
                                      {inv.number} · {inv.issueDate} ·{' '}
                                      {STATUS_LABELS[effectiveStatus(inv)]}
                                    </span>
                                    <span>
                                      {money(t.total, inv.currency)} · balance{' '}
                                      {money(t.balance, inv.currency)}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="font-medium text-sm">
                {editingClientId ? 'Edit client' : 'Add a client'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Client name *">
                  <Input
                    value={clientForm.name ?? ''}
                    onChange={(e) => setClientForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </Field>
                <Field label="Company">
                  <Input
                    value={clientForm.company ?? ''}
                    onChange={(e) => setClientForm((f) => ({ ...f, company: e.target.value }))}
                  />
                </Field>
                <Field label="Contact person">
                  <Input
                    value={clientForm.contactPerson ?? ''}
                    onChange={(e) =>
                      setClientForm((f) => ({ ...f, contactPerson: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Email">
                  <Input
                    value={clientForm.email ?? ''}
                    onChange={(e) => setClientForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={clientForm.phone ?? ''}
                    onChange={(e) => setClientForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+92 300 1234567"
                  />
                </Field>
                <Field label="Tax ID">
                  <Input
                    value={clientForm.taxId ?? ''}
                    onChange={(e) => setClientForm((f) => ({ ...f, taxId: e.target.value }))}
                  />
                </Field>
                <Field label="Country">
                  <Input
                    value={clientForm.country ?? ''}
                    onChange={(e) => setClientForm((f) => ({ ...f, country: e.target.value }))}
                  />
                </Field>
                <Field label="Default currency">
                  <Select
                    value={clientForm.defaultCurrency || 'profile'}
                    onValueChange={(v) =>
                      setClientForm((f) => ({
                        ...f,
                        defaultCurrency: v === 'profile' ? '' : v,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profile">Profile default</SelectItem>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {currencyLabel(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Billing address">
                <Textarea
                  rows={2}
                  value={clientForm.address ?? ''}
                  onChange={(e) => setClientForm((f) => ({ ...f, address: e.target.value }))}
                />
              </Field>
              <Field label="Shipping address">
                <Textarea
                  rows={2}
                  value={clientForm.shippingAddress ?? ''}
                  onChange={(e) =>
                    setClientForm((f) => ({ ...f, shippingAddress: e.target.value }))
                  }
                />
              </Field>
              <Field label="Payment terms for this client">
                <Textarea
                  rows={2}
                  value={clientForm.terms ?? ''}
                  onChange={(e) => setClientForm((f) => ({ ...f, terms: e.target.value }))}
                  placeholder="Applied automatically when you pick this client on an invoice."
                />
              </Field>
              <Field label="Notes">
                <Textarea
                  rows={2}
                  value={clientForm.notes ?? ''}
                  onChange={(e) => setClientForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </Field>
              <div className="flex gap-2">
                <Button
                  className="gap-2"
                  disabled={!clientForm.name?.trim()}
                  onClick={saveClientForm}
                >
                  <Plus className="w-4 h-4" /> {editingClientId ? 'Save changes' : 'Add client'}
                </Button>
                {editingClientId && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setClientForm({});
                      setEditingClientId(null);
                    }}
                  >
                    Cancel editing
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {section === 'data' && (
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold">Your data — backup &amp; export</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Everything lives in this browser — it does not synchronise between devices. Export a
              backup file regularly and you can restore your profiles, clients and invoices on any
              computer. Import replaces what is currently stored here, after asking you to confirm
              and warning you about duplicates.
            </p>
            {storageKb !== null && (
              <p className="text-sm">
                Storage used by this app in this browser:{' '}
                <strong>{storageKb < 1024 ? `${storageKb} KB` : `${(storageKb / 1024).toFixed(2)} MB`}</strong>{' '}
                <span className="text-muted-foreground">
                  (browsers typically allow around 5 MB per site — large logo images use it
                  fastest.)
                </span>
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleExportCsv} className="gap-2">
                <Download className="w-4 h-4" /> Export invoices (CSV)
              </Button>
              <Button variant="outline" onClick={handleExportBackup} className="gap-2">
                <Download className="w-4 h-4" /> Export backup (JSON)
              </Button>
              <Button
                variant="outline"
                onClick={() => importRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" /> Import backup
              </Button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  handleImportFile(e.target.files?.[0] ?? null);
                  e.target.value = '';
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The invoices CSV opens in Excel or Google Sheets: one row per invoice with totals,
              amounts paid, balances and statuses. Backups are version 2 (all business profiles
              included); version 1 backup files still import correctly.
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold">Your data stays here</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
              Your profiles, clients and invoices are stored only in this browser&apos;s local
              storage, on this device. There is no account and no server copy — refresh the page,
              close the tab, come back next week: everything is exactly where you left it, and the
              invoice you are editing is autosaved as you type. Clearing your browser&apos;s site
              data deletes it permanently, so keep your downloaded PDFs — and a JSON backup from
              this section — as your long-term records.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
