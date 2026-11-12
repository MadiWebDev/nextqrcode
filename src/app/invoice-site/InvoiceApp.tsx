'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  Copy,
  Download,
  FilePlus2,
  FileText,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Pencil,
  Plus,
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

/* ── Types ─────────────────────────────────────────────────────────── */

export interface Profile {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  logoDataUrl: string;
  stampDataUrl: string;
  currency: string;
  taxLabel: string;
  taxRate: number;
  paymentDetails: string;
  brandColor: string;
  nextInvoiceNumber: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export type PaymentMethod = 'Cash' | 'Bank transfer' | 'Card' | 'Cheque' | 'Other';

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  note: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid';
export type EffectiveStatus = 'draft' | 'sent' | 'partial' | 'overdue' | 'paid';
export type TemplateName = 'classic' | 'modern' | 'minimal';
export type DiscountType = 'pct' | 'fixed';
export type DueTerms = 'receipt' | 'net7' | 'net14' | 'net30' | 'net60' | 'custom';
export type RecurringFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Recurring {
  frequency: RecurringFrequency;
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
  shipping: number;
  /** Manual lump-sum paid field (legacy). Total paid = amountPaid + sum(payments). */
  amountPaid: number;
  payments: Payment[];
  status: InvoiceStatus;
  notes: string;
  terms: string;
  template: TemplateName;
  showQr: boolean;
  qrPayload: string;
  recurring: Recurring | null;
  createdAt: string;
  updatedAt: string;
}

interface Totals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  totalPaid: number;
  balance: number;
  paidInFull: boolean;
}

/* ── Constants & helpers ───────────────────────────────────────────── */

const PROFILE_KEY = 'invoicegenerator:profile';
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
const RECURRING_LABELS: Record<RecurringFrequency, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

const DEFAULT_PROFILE: Profile = {
  businessName: '',
  email: '',
  phone: '',
  address: '',
  logoDataUrl: '',
  stampDataUrl: '',
  currency: 'USD',
  taxLabel: 'VAT',
  taxRate: 0,
  paymentDetails: '',
  brandColor: '#1d4ed8',
  nextInvoiceNumber: 1,
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

function shiftDateByFrequency(iso: string, frequency: RecurringFrequency): string {
  switch (frequency) {
    case 'weekly':
      return addDaysIso(iso, 7);
    case 'monthly':
      return addMonthsIso(iso, 1);
    case 'quarterly':
      return addMonthsIso(iso, 3);
    case 'yearly':
      return addMonthsIso(iso, 12);
  }
}

/** Due date implied by a terms preset, or null for the custom preset. */
function dueDateForPreset(preset: DueTerms, issueIso: string): string | null {
  if (preset === 'receipt') return issueIso;
  const days = DUE_TERMS_DAYS[preset];
  return days ? addDaysIso(issueIso, days) : null;
}

function formatInvoiceNumber(n: number): string {
  return `INV-${String(Math.max(1, Math.floor(n) || 1)).padStart(4, '0')}`;
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
    | 'shipping'
    | 'amountPaid'
    | 'payments'
  >
): Totals {
  const subtotal = inv.items.reduce((sum, it) => sum + (it.qty || 0) * (it.unitPrice || 0), 0);
  const discountType: DiscountType = inv.discountType ?? 'pct';
  const discountValue = inv.discountValue ?? inv.discountPct ?? 0;
  const discountAmount =
    discountType === 'fixed'
      ? Math.min(Math.max(0, discountValue || 0), subtotal)
      : (subtotal * clampPct(discountValue)) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * clampPct(inv.taxPct)) / 100;
  const total = taxable + taxAmount + Math.max(0, inv.shipping || 0);
  const totalPaid = Math.max(0, inv.amountPaid || 0) + paymentsSum(inv);
  const balance = Math.max(0, total - totalPaid);
  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
    totalPaid,
    balance,
    paidInFull: total > 0 && totalPaid >= total,
  };
}

/**
 * The status a client would understand: stored 'draft' stays draft; a fully
 * covered invoice is paid; a past-due balance is overdue; a part-paid invoice
 * is partial; everything else falls back to the stored status.
 */
export function effectiveStatus(inv: Invoice): EffectiveStatus {
  if (inv.status === 'draft') return 'draft';
  const t = computeTotals(inv);
  if (t.total > 0 && t.totalPaid >= t.total) return 'paid';
  if (t.balance > 0 && inv.dueDate && inv.dueDate < todayIso()) return 'overdue';
  if (t.totalPaid > 0) return 'partial';
  return inv.status === 'paid' ? 'paid' : 'sent';
}

const STATUS_LABELS: Record<EffectiveStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  partial: 'Partially paid',
  overdue: 'Overdue',
  paid: 'Paid',
};

const STATUS_STYLES: Record<EffectiveStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border border-slate-300',
  sent: 'bg-blue-100 text-blue-800 border border-blue-300',
  partial: 'bg-amber-100 text-amber-800 border border-amber-300',
  overdue: 'bg-red-100 text-red-800 border border-red-300',
  paid: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
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
            qty: Number(it.qty) || 0,
            unitPrice: Number(it.unitPrice) || 0,
          }))
        : [{ id: uid(), description: '', qty: 1, unitPrice: 0 }],
    discountPct: discountType === 'pct' ? discountValue : (raw.discountPct ?? 0),
    discountType,
    discountValue,
    taxPct: raw.taxPct ?? 0,
    taxLabel: raw.taxLabel ?? 'VAT',
    shipping: raw.shipping ?? 0,
    amountPaid: raw.amountPaid ?? 0,
    payments,
    status: raw.status ?? 'draft',
    notes: raw.notes ?? '',
    terms: raw.terms ?? '',
    template: raw.template ?? 'modern',
    showQr: raw.showQr ?? false,
    qrPayload: raw.qrPayload ?? '',
    recurring,
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
  };
}

function normalizeClient(raw: Partial<Client>): Client {
  return {
    id: raw.id || uid(),
    name: raw.name ?? '',
    email: raw.email ?? '',
    address: raw.address ?? '',
    phone: raw.phone ?? '',
  };
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
          number: formatInvoiceNumber(nextNumber),
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
      nextDate = shiftDateByFrequency(nextDate, rec.frequency);
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
    number: formatInvoiceNumber(profile.nextInvoiceNumber),
    issueDate: today,
    dueDate: addDaysIso(today, 14),
    dueTerms: 'net14',
    poNumber: '',
    clientId: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    currency: profile.currency,
    items: [{ id: uid(), description: '', qty: 1, unitPrice: 0 }],
    discountPct: 0,
    discountType: 'pct',
    discountValue: 0,
    taxPct: profile.taxRate,
    taxLabel: profile.taxLabel,
    shipping: 0,
    amountPaid: 0,
    payments: [],
    status: 'draft',
    notes: '',
    terms:
      'Payment is due within 14 days of the issue date. Please quote the invoice number with your payment.',
    template: 'modern',
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
  const [profile, setProfile] = useState<Profile>(() => loadLS(PROFILE_KEY, DEFAULT_PROFILE));
  const [clients, setClients] = useState<Client[]>(() =>
    loadLSArray<Client>(CLIENTS_KEY).map(normalizeClient)
  );
  const [draft, setDraft] = useState<Invoice>(() =>
    makeDraft(loadLS(PROFILE_KEY, DEFAULT_PROFILE))
  );
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
    saveLS(INVOICES_KEY, invoices);
  }, [invoices]);

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

  const patchItem = (id: string, patch: Partial<LineItem>) =>
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  /* ── Invoice actions ── */

  const handleSave = () => {
    const now = new Date().toISOString();
    let clientId = draft.clientId;
    if (clientId === 'new' && draft.clientName.trim()) {
      const created: Client = {
        id: uid(),
        name: draft.clientName.trim(),
        email: draft.clientEmail.trim(),
        address: draft.clientAddress.trim(),
        phone: draft.clientPhone.trim(),
      };
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
    if (!draft.id && draft.number === formatInvoiceNumber(profile.nextInvoiceNumber)) {
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
      number: formatInvoiceNumber(profile.nextInvoiceNumber),
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
    clients?: Partial<Client>[];
    invoices?: Partial<Invoice>[];
  }) => {
    const newProfile: Profile = { ...DEFAULT_PROFILE, ...(data.profile ?? {}) };
    setProfile(newProfile);
    setClients(Array.isArray(data.clients) ? data.clients.map(normalizeClient) : []);
    setInvoices(Array.isArray(data.invoices) ? data.invoices.map(normalizeInvoice) : []);
    setDraft(makeDraft(newProfile));
    setSavedNote('');
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
        clientName: c.name,
        clientEmail: c.email,
        clientPhone: c.phone,
        clientAddress: c.address,
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

  /* ── PDF ── */

  const downloadPdf = () => {
    const doc = new JsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const brand = hexToRgb(profile.brandColor || '#1d4ed8');
    const inv = draft;
    const t = totals;
    const eff = draftStatus;
    let y = 15;

    const ensure = (need: number) => {
      if (y + need > pageH - 15) {
        doc.addPage();
        y = 15;
      }
    };

    // Header per template
    if (inv.template === 'modern') {
      doc.setFillColor(brand.r, brand.g, brand.b);
      doc.rect(0, 0, pageW, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(profile.businessName || 'Your Business', 15, 13);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(profile.email || '', 15, 20);
      doc.text(profile.phone || '', 15, 25);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', pageW - 15, 14, { align: 'right' });
      doc.setFontSize(10);
      doc.text(inv.number, pageW - 15, 21, { align: 'right' });
      doc.setTextColor(30, 30, 30);
      y = 40;
      if (profile.logoDataUrl) {
        try {
          doc.addImage(
            profile.logoDataUrl,
            profile.logoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG',
            pageW - 45,
            y - 6,
            30,
            12
          );
        } catch {
          /* logo is decorative in the PDF */
        }
      }
    } else if (inv.template === 'classic') {
      doc.setFont('times', 'bold');
      doc.setFontSize(26);
      doc.text('INVOICE', 15, y + 6);
      doc.setFontSize(12);
      doc.text(inv.number, pageW - 15, y + 6, { align: 'right' });
      y += 12;
      doc.setLineWidth(0.8);
      doc.line(15, y, pageW - 15, y);
      doc.setLineWidth(0.25);
      doc.line(15, y + 1.2, pageW - 15, y + 1.2);
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(profile.businessName || 'Your Business', 15, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const lines = doc.splitTextToSize(
        [profile.address, profile.email, profile.phone].filter(Boolean).join('\n'),
        80
      ) as string[];
      lines.forEach((line, i) => doc.text(line, 15, y + 5 + i * 4.5));
      y += 6 + lines.length * 4.5;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(15);
      doc.setTextColor(90, 90, 90);
      doc.text('Invoice', 15, y + 4);
      doc.setFontSize(11);
      doc.text(inv.number, pageW - 15, y + 4, { align: 'right' });
      doc.setTextColor(30, 30, 30);
      y += 10;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(15, y, pageW - 15, y);
      y += 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(profile.businessName || 'Your Business', 15, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const lines = doc.splitTextToSize(
        [profile.address, profile.email, profile.phone].filter(Boolean).join(' · '),
        180
      ) as string[];
      lines.forEach((line, i) => doc.text(line, 15, y + 4.5 + i * 4.5));
      y += 6 + lines.length * 4.5;
    }

    // Dates + bill to
    ensure(34);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`Issue date: ${inv.issueDate}`, pageW - 15, y, { align: 'right' });
    doc.text(`Due date: ${inv.dueDate}`, pageW - 15, y + 5, { align: 'right' });
    let metaY = y + 10;
    if (inv.poNumber.trim()) {
      doc.text(`PO / Ref: ${inv.poNumber.trim()}`, pageW - 15, metaY, { align: 'right' });
      metaY += 5;
    }
    doc.text(`Status: ${STATUS_LABELS[eff].toUpperCase()}`, pageW - 15, metaY, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text('Bill to', 15, y);
    doc.setFont('helvetica', 'normal');
    const billLines = doc.splitTextToSize(
      [inv.clientName || 'Client', inv.clientAddress, inv.clientEmail, inv.clientPhone]
        .filter(Boolean)
        .join('\n'),
      95
    ) as string[];
    billLines.forEach((line, i) => doc.text(line, 15, y + 5 + i * 4.5));
    y += Math.max(16, metaY - y + 5, 5 + billLines.length * 4.5) + 4;

    // Items table
    ensure(12);
    if (inv.template === 'modern') {
      doc.setFillColor(brand.r, brand.g, brand.b);
      doc.rect(15, y - 4.5, pageW - 30, 7.5, 'F');
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setDrawColor(160, 160, 160);
      doc.line(15, y + 3, pageW - 15, y + 3);
      doc.setTextColor(30, 30, 30);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('Description', 17, y + 1);
    doc.text('Qty', 118, y + 1, { align: 'right' });
    doc.text('Unit price', 152, y + 1, { align: 'right' });
    doc.text('Amount', pageW - 17, y + 1, { align: 'right' });
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    y += 8;

    inv.items.forEach((item) => {
      const desc = doc.splitTextToSize(item.description || '-', 92) as string[];
      ensure(Math.max(6, desc.length * 4.8) + 2);
      desc.forEach((line, i) => doc.text(line, 17, y + i * 4.8));
      doc.text(String(item.qty || 0), 118, y, { align: 'right' });
      doc.text(money(item.unitPrice || 0, inv.currency, true), 152, y, { align: 'right' });
      doc.text(money((item.qty || 0) * (item.unitPrice || 0), inv.currency, true), pageW - 17, y, {
        align: 'right',
      });
      y += Math.max(6, desc.length * 4.8) + 1.5;
    });

    // Totals
    ensure(48);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(118, y - 3, pageW - 15, y - 3);
    const discountLabel =
      inv.discountType === 'fixed' ? 'Discount' : `Discount (${clampPct(inv.discountValue)}%)`;
    const rows: Array<[string, string, boolean]> = [
      ['Subtotal', money(t.subtotal, inv.currency, true), false],
      ...(t.discountAmount > 0
        ? [
            [discountLabel, `-${money(t.discountAmount, inv.currency, true)}`, false] as [
              string,
              string,
              boolean,
            ],
          ]
        : []),
      ...(t.taxAmount > 0
        ? [
            [
              `${inv.taxLabel || 'Tax'} (${clampPct(inv.taxPct)}%)`,
              money(t.taxAmount, inv.currency, true),
              false,
            ] as [string, string, boolean],
          ]
        : []),
      ...(inv.shipping > 0
        ? [
            ['Shipping', money(inv.shipping, inv.currency, true), false] as [
              string,
              string,
              boolean,
            ],
          ]
        : []),
      ['Total', money(t.total, inv.currency, true), true],
      ...(t.totalPaid > 0
        ? [
            ['Total paid', money(t.totalPaid, inv.currency, true), false] as [
              string,
              string,
              boolean,
            ],
          ]
        : []),
      ['Balance due', money(t.balance, inv.currency, true), true],
    ];
    rows.forEach(([label, value, bold]) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.text(label, 120, y);
      doc.text(value, pageW - 15, y, { align: 'right' });
      y += 5.5;
    });
    doc.setFont('helvetica', 'normal');

    // Business stamp / signature image, beside the totals block
    if (profile.stampDataUrl) {
      try {
        doc.addImage(
          profile.stampDataUrl,
          profile.stampDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG',
          15,
          y - 26,
          40,
          20
        );
      } catch {
        /* stamp is decorative in the PDF */
      }
    }

    // Payment history (from the ledger)
    if (inv.payments.length > 0) {
      ensure(12 + inv.payments.length * 5);
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('Payments received', 15, y);
      doc.setFont('helvetica', 'normal');
      y += 5;
      inv.payments.forEach((p) => {
        ensure(5);
        const line = `${p.date || '—'} · ${p.method}${p.note ? ` · ${p.note}` : ''}`;
        doc.text(line, 15, y);
        doc.text(money(p.amount, inv.currency, true), 100, y, { align: 'right' });
        y += 4.8;
      });
      y += 2;
    }

    // QR + notes + terms
    if (effectiveQr) {
      ensure(48);
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('Scan to pay', 15, y);
      try {
        doc.addImage(effectiveQr, 'PNG', 15, y + 3, 34, 34);
      } catch {
        /* QR is optional in the PDF */
      }
      doc.setFont('helvetica', 'normal');
      const payLines = doc.splitTextToSize(qrPayloadText, 120) as string[];
      payLines.slice(0, 6).forEach((line, i) => doc.text(line, 54, y + 8 + i * 4.8));
      y += 42;
    }
    if (inv.notes.trim()) {
      ensure(14);
      y += 3;
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(`Notes: ${inv.notes.trim()}`, pageW - 30) as string[];
      lines.forEach((line) => {
        ensure(5);
        doc.text(line, 15, y);
        y += 4.5;
      });
    }
    if (inv.terms.trim()) {
      ensure(14);
      y += 2;
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(`Terms: ${inv.terms.trim()}`, pageW - 30) as string[];
      lines.forEach((line) => {
        ensure(5);
        doc.text(line, 15, y);
        y += 4.5;
      });
    }

    // PAID / OVERDUE stamp, drawn last so it sits on top of the page
    if (eff === 'paid' || eff === 'overdue') {
      const pageCount = doc.getNumberOfPages();
      doc.setPage(pageCount);
      if (eff === 'paid') doc.setTextColor(120, 195, 150);
      else doc.setTextColor(235, 150, 150);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(54);
      doc.text(eff === 'paid' ? 'PAID' : 'OVERDUE', pageW / 2, pageH / 2, {
        align: 'center',
        angle: 24,
      });
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'normal');
    }

    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      'Created with the free Invoice Generator — invoicegenerator.freeqrcode.tools',
      pageW / 2,
      pageH - 8,
      { align: 'center' }
    );
    doc.save(`${inv.number || 'invoice'}.pdf`);
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
                      <SelectItem value="paid">Paid</SelectItem>
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
                <Field label="Template">
                  <Select
                    value={draft.template}
                    onValueChange={(v) => patchDraft({ template: v as TemplateName })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
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
              <div className="space-y-2">
                {draft.items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <Input
                      className="flex-1"
                      placeholder="Description of work or product"
                      value={item.description}
                      onChange={(e) => patchItem(item.id, { description: e.target.value })}
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
                      {money(item.qty * item.unitPrice, draft.currency)}
                    </span>
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
                ))}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    items: [...d.items, { id: uid(), description: '', qty: 1, unitPrice: 0 }],
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
              <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm space-y-1">
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{money(totals.subtotal, draft.currency)}</span>
                </p>
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
        />
      )}

      {view === 'dashboard' && <DashboardView invoices={invoices} profile={profile} />}

      {view === 'settings' && (
        <SettingsView
          profile={profile}
          setProfile={setProfile}
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
  const payText = inv.qrPayload.trim() || profile.paymentDetails.trim();
  const eff = effectiveStatus(inv);
  return (
    <div className="relative bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {(eff === 'paid' || eff === 'overdue') && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span
            className={`inline-block -rotate-[18deg] rounded-lg border-4 px-6 py-2 text-5xl font-extrabold uppercase tracking-[0.2em] opacity-25 ${
              eff === 'paid' ? 'border-emerald-600 text-emerald-600' : 'border-red-600 text-red-600'
            }`}
          >
            {eff === 'paid' ? 'Paid' : 'Overdue'}
          </span>
        </div>
      )}
      {inv.template === 'modern' && (
        <div
          className="px-6 py-5 text-white flex items-start justify-between gap-4"
          style={{ backgroundColor: brand }}
        >
          <div className="min-w-0">
            <p className="font-bold text-lg leading-tight truncate">
              {profile.businessName || 'Your Business'}
            </p>
            <p className="text-xs opacity-90 mt-1 whitespace-pre-line">
              {[profile.address, profile.email, profile.phone].filter(Boolean).join('\n')}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold tracking-tight">INVOICE</p>
            <p className="text-sm opacity-90">{inv.number}</p>
          </div>
        </div>
      )}
      {inv.template === 'classic' && (
        <div className="px-6 pt-6">
          <div
            className="flex items-start justify-between gap-4 pb-3"
            style={{ borderBottom: '4px double #334155' }}
          >
            <div>
              <p className="font-serif text-3xl font-bold">INVOICE</p>
              <p className="font-semibold mt-1">{profile.businessName || 'Your Business'}</p>
              <p className="text-xs text-slate-500 whitespace-pre-line">
                {[profile.address, profile.email, profile.phone].filter(Boolean).join('\n')}
              </p>
            </div>
            {profile.logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logoDataUrl}
                alt="Business logo"
                className="max-h-14 max-w-32 object-contain"
              />
            )}
          </div>
        </div>
      )}
      {inv.template === 'minimal' && (
        <div className="px-6 pt-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500">Invoice</p>
              <p className="font-medium mt-1">{profile.businessName || 'Your Business'}</p>
              <p className="text-xs text-slate-500">
                {[profile.address, profile.email, profile.phone].filter(Boolean).join(' · ')}
              </p>
            </div>
            {profile.logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logoDataUrl}
                alt="Business logo"
                className="max-h-12 max-w-28 object-contain"
              />
            )}
          </div>
        </div>
      )}

      <div className="px-6 py-5">
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
                inv.template === 'modern'
                  ? 'text-white'
                  : 'text-slate-600 border-b border-slate-300'
              }
              style={inv.template === 'modern' ? { backgroundColor: brand } : undefined}
            >
              <th className="text-left font-semibold px-2 py-2">Description</th>
              <th className="text-right font-semibold px-2 py-2 w-14">Qty</th>
              <th className="text-right font-semibold px-2 py-2 w-24">Unit price</th>
              <th className="text-right font-semibold px-2 py-2 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="px-2 py-2">{item.description || '—'}</td>
                <td className="px-2 py-2 text-right">{item.qty}</td>
                <td className="px-2 py-2 text-right">{money(item.unitPrice, inv.currency)}</td>
                <td className="px-2 py-2 text-right font-medium">
                  {money(item.qty * item.unitPrice, inv.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <dl className="w-60 text-sm space-y-1">
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
            {inv.notes.trim() && <p className="whitespace-pre-line">{inv.notes}</p>}
            {inv.terms.trim() && <p className="whitespace-pre-line">{inv.terms}</p>}
            {profile.stampDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.stampDataUrl}
                alt="Business stamp or signature"
                className="max-h-16 max-w-44 object-contain opacity-90 pt-1"
              />
            )}
          </div>
        </div>
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
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EffectiveStatus>('all');

  const summary = useMemo(() => {
    const byCurrency = new Map<
      string,
      { invoiced: number; collected: number; outstanding: number }
    >();
    for (const inv of invoices) {
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
                    {RECURRING_LABELS[inv.recurring!.frequency]} · next issue{' '}
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
                <SelectItem value="partial">Partially paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                        {RECURRING_LABELS[inv.recurring.frequency]}
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

function DashboardView({ invoices, profile }: { invoices: Invoice[]; profile: Profile }) {
  const data = useMemo(() => {
    const issued = invoices.filter((i) => i.status !== 'draft');
    const perCurrency = new Map<
      string,
      {
        billed: number;
        collected: number;
        outstanding: number;
        overdueAmount: number;
        overdueCount: number;
      }
    >();
    const aging = new Map<string, { current: number; d30: number; d60: number; d60plus: number }>();
    const todayMs = Date.parse(todayIso());
    for (const inv of issued) {
      const t = computeTotals(inv);
      const eff = effectiveStatus(inv);
      const row = perCurrency.get(inv.currency) ?? {
        billed: 0,
        collected: 0,
        outstanding: 0,
        overdueAmount: 0,
        overdueCount: 0,
      };
      row.billed += t.total;
      row.collected += Math.min(t.totalPaid, t.total);
      row.outstanding += t.balance;
      if (eff === 'overdue') {
        row.overdueAmount += t.balance;
        row.overdueCount += 1;
      }
      perCurrency.set(inv.currency, row);
      if (t.balance > 0) {
        const a = aging.get(inv.currency) ?? { current: 0, d30: 0, d60: 0, d60plus: 0 };
        const daysOverdue = Math.floor((todayMs - Date.parse(inv.dueDate)) / 86400000);
        if (daysOverdue <= 0) a.current += t.balance;
        else if (daysOverdue <= 30) a.d30 += t.balance;
        else if (daysOverdue <= 60) a.d60 += t.balance;
        else a.d60plus += t.balance;
        aging.set(inv.currency, a);
      }
    }

    // Last 6 months billed, profile currency only
    const months: Array<{ key: string; label: string; total: number }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        key,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        total: 0,
      });
    }
    const monthIndex = new Map(months.map((m, i) => [m.key, i]));
    // Top clients, profile currency
    const clientTotals = new Map<string, { billed: number; outstanding: number }>();
    for (const inv of issued) {
      if (inv.currency !== profile.currency) continue;
      const t = computeTotals(inv);
      if (monthIndex.has(inv.issueDate.slice(0, 7))) {
        months[monthIndex.get(inv.issueDate.slice(0, 7))!].total += t.total;
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
    const currenciesUsed = new Set(issued.map((i) => i.currency));
    return {
      perCurrency: [...perCurrency.entries()],
      aging: [...aging.entries()],
      months,
      topClients,
      multiCurrency: currenciesUsed.size > 1,
      issuedCount: issued.length,
    };
  }, [invoices, profile.currency]);

  if (data.issuedCount === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-semibold">Nothing to chart yet</p>
        <p className="text-sm text-muted-foreground mt-1.5">
          The dashboard comes alive once you have saved an invoice and marked it as sent. Drafts are
          excluded — this page tracks money you have actually billed.
        </p>
      </Card>
    );
  }

  const chartMax = Math.max(...data.months.map((m) => m.total), 0);

  return (
    <div className="space-y-5">
      {data.perCurrency.map(([currency, row]) => (
        <div key={currency}>
          <h3 className="font-semibold mb-3">{currency} overview</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total billed
              </p>
              <p className="text-xl font-bold mt-1">{money(row.billed, currency)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Collected
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-600">
                {money(row.collected, currency)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Outstanding
              </p>
              <p className="text-xl font-bold mt-1">{money(row.outstanding, currency)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Overdue
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
          <h3 className="font-semibold">Billed — last 6 months ({profile.currency})</h3>
          {data.multiCurrency && (
            <p className="text-xs text-muted-foreground mt-1">
              Your invoices use more than one currency; this chart and the client ranking show{' '}
              {profile.currency} only.
            </p>
          )}
          {chartMax <= 0 ? (
            <p className="text-sm text-muted-foreground mt-4">
              No {profile.currency} invoices were issued in the last 6 months.
            </p>
          ) : (
            <div className="mt-5">
              <div className="flex items-end gap-3 h-40">
                {data.months.map((m) => (
                  <div
                    key={m.key}
                    className="flex-1 flex flex-col items-center justify-end h-full gap-2"
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
                      ['Not yet due', a.current],
                      ['1–30 days overdue', a.d30],
                      ['31–60 days overdue', a.d60],
                      ['Over 60 days overdue', a.d60plus],
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
              <p className="text-sm text-muted-foreground">No {profile.currency} invoices yet.</p>
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
      <p className="text-xs text-muted-foreground">
        Drafts are excluded from every figure on this page.
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
  profile?: Partial<Profile>;
  clients?: Partial<Client>[];
  invoices?: Partial<Invoice>[];
}

function SettingsView({
  profile,
  setProfile,
  clients,
  setClients,
  invoices,
  onImportData,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  invoices: Invoice[];
  onImportData: (data: ImportPayload) => void;
}) {
  const [newClient, setNewClient] = useState({ name: '', email: '', address: '', phone: '' });
  const importRef = useRef<HTMLInputElement>(null);
  const patch = (p: Partial<Profile>) => setProfile((cur) => ({ ...cur, ...p }));

  const handleImage = (file: File | null, field: 'logoDataUrl' | 'stampDataUrl') => {
    if (!file) return;
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
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
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
          (!data.profile && !data.clients && !data.invoices)
        ) {
          window.alert('That file does not look like an Invoice Generator backup.');
          return;
        }
        if (
          !window.confirm(
            'Import this backup? It will REPLACE your current business profile, clients and invoices in this browser.'
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

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <div className="space-y-6">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Your business profile
          </h3>
          <p className="text-xs text-muted-foreground -mt-2">
            Saved once, printed on every invoice. Stored only in this browser.
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
              placeholder={'Street, city, country'}
            />
          </Field>
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
              A scanned signature or company stamp. It prints beside the totals on every invoice and
              PDF — a transparent PNG works best.
            </p>
          </Field>
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
                onChange={(n) => patch({ nextInvoiceNumber: Math.max(1, Math.floor(n) || 1) })}
                min={1}
                step={1}
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
          <Field label="Payment details (default QR content — payment link, wallet, or bank details)">
            <Textarea
              rows={3}
              value={profile.paymentDetails}
              onChange={(e) => patch({ paymentDetails: e.target.value })}
              placeholder="https://your-payment-link — or — IBAN: PK36 …, Account title: …"
            />
          </Field>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Your data — backup &amp; export</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Everything lives in this browser. Export a backup file regularly and you can restore
            your profile, clients and invoices on any computer — import replaces what is currently
            stored here, after asking you to confirm.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExportCsv} className="gap-2">
              <Download className="w-4 h-4" /> Export invoices (CSV)
            </Button>
            <Button variant="outline" onClick={handleExportBackup} className="gap-2">
              <Download className="w-4 h-4" /> Export backup (JSON)
            </Button>
            <Button variant="outline" onClick={() => importRef.current?.click()} className="gap-2">
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
            The CSV opens in Excel or Google Sheets: one row per invoice with totals, amounts paid,
            balances and statuses.
          </p>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Client address book</h3>
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No clients saved yet. Add your first client below, or choose &ldquo;New client&rdquo;
              while creating an invoice — they are saved here automatically when you save the
              invoice.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {clients.map((c) => (
                <li key={c.id} className="py-2.5 flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[c.email, c.phone, c.address].filter(Boolean).join(' · ')}
                    </p>
                  </div>
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
                    onClick={() => setClients((list) => list.filter((x) => x.id !== c.id))}
                    className="gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="New client name">
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient((s) => ({ ...s, name: e.target.value }))}
                />
              </Field>
              <Field label="New client email">
                <Input
                  value={newClient.email}
                  onChange={(e) => setNewClient((s) => ({ ...s, email: e.target.value }))}
                />
              </Field>
              <Field label="New client phone">
                <Input
                  value={newClient.phone}
                  onChange={(e) => setNewClient((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="+92 300 1234567"
                />
              </Field>
            </div>
            <Field label="New client address">
              <Textarea
                rows={2}
                value={newClient.address}
                onChange={(e) => setNewClient((s) => ({ ...s, address: e.target.value }))}
              />
            </Field>
            <Button
              className="gap-2"
              disabled={!newClient.name.trim()}
              onClick={() => {
                setClients((list) => [
                  ...list,
                  {
                    id: uid(),
                    name: newClient.name.trim(),
                    email: newClient.email.trim(),
                    address: newClient.address.trim(),
                    phone: newClient.phone.trim(),
                  },
                ]);
                setNewClient({ name: '', email: '', address: '', phone: '' });
              }}
            >
              <Plus className="w-4 h-4" /> Add client
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Your data stays here</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
            Your profile, clients and invoices are stored only in this browser&apos;s local storage,
            on this device. There is no account and no server copy — refresh the page, close the
            tab, come back next week: everything is exactly where you left it. Clearing your
            browser&apos;s site data deletes it permanently, so keep your downloaded PDFs — and a
            JSON backup from the Data section — as your long-term records.
          </p>
        </Card>
      </div>
    </div>
  );
}
