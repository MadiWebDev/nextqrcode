'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Copy,
  Download,
  FilePlus2,
  Pencil,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
  Upload,
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

/* ── Types ─────────────────────────────────────────────────────────── */

export interface Profile {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  logoDataUrl: string;
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
}

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid';
export type TemplateName = 'classic' | 'modern' | 'minimal';

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  currency: string;
  items: LineItem[];
  discountPct: number;
  taxPct: number;
  taxLabel: string;
  shipping: number;
  amountPaid: number;
  status: InvoiceStatus;
  notes: string;
  terms: string;
  template: TemplateName;
  showQr: boolean;
  qrPayload: string;
  createdAt: string;
  updatedAt: string;
}

interface Totals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  balance: number;
  paidInFull: boolean;
}

/* ── Constants & helpers ───────────────────────────────────────────── */

const PROFILE_KEY = 'invoicegenerator:profile';
const CLIENTS_KEY = 'invoicegenerator:clients';
const INVOICES_KEY = 'invoicegenerator:invoices';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'SAR', 'QAR', 'CAD', 'AUD'];

const DEFAULT_PROFILE: Profile = {
  businessName: '',
  email: '',
  phone: '',
  address: '',
  logoDataUrl: '',
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

function formatInvoiceNumber(n: number): string {
  return `INV-${String(Math.max(1, Math.floor(n) || 1)).padStart(4, '0')}`;
}

function money(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function clampPct(v: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(v) ? v : 0));
}

function computeTotals(inv: Pick<Invoice, 'items' | 'discountPct' | 'taxPct' | 'shipping' | 'amountPaid'>): Totals {
  const subtotal = inv.items.reduce((sum, it) => sum + (it.qty || 0) * (it.unitPrice || 0), 0);
  const discountAmount = (subtotal * clampPct(inv.discountPct)) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * clampPct(inv.taxPct)) / 100;
  const total = taxable + taxAmount + Math.max(0, inv.shipping || 0);
  const balance = Math.max(0, total - (inv.amountPaid || 0));
  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
    balance,
    paidInFull: total > 0 && (inv.amountPaid || 0) >= total,
  };
}

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

function makeDraft(profile: Profile): Invoice {
  const today = todayIso();
  return {
    id: '',
    number: formatInvoiceNumber(profile.nextInvoiceNumber),
    issueDate: today,
    dueDate: addDaysIso(today, 14),
    clientId: null,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    currency: profile.currency,
    items: [{ id: uid(), description: '', qty: 1, unitPrice: 0 }],
    discountPct: 0,
    taxPct: profile.taxRate,
    taxLabel: profile.taxLabel,
    shipping: 0,
    amountPaid: 0,
    status: 'draft',
    notes: '',
    terms: 'Payment is due within 14 days of the issue date. Please quote the invoice number with your payment.',
    template: 'modern',
    showQr: false,
    qrPayload: '',
    createdAt: '',
    updatedAt: '',
  };
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

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border border-slate-300',
  sent: 'bg-amber-100 text-amber-800 border border-amber-300',
  paid: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
};

/* ── Main app ──────────────────────────────────────────────────────── */

export function InvoiceApp() {
  const [profile, setProfile] = useState<Profile>(() => loadLS(PROFILE_KEY, DEFAULT_PROFILE));
  const [clients, setClients] = useState<Client[]>(() => loadLSArray<Client>(CLIENTS_KEY));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadLSArray<Invoice>(INVOICES_KEY));
  const [draft, setDraft] = useState<Invoice>(() =>
    makeDraft(loadLS(PROFILE_KEY, DEFAULT_PROFILE))
  );
  const [view, setView] = useState<'create' | 'invoices' | 'settings'>('create');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [savedNote, setSavedNote] = useState('');

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
  const qrPayloadText = draft.showQr
    ? draft.qrPayload.trim() || profile.paymentDetails.trim()
    : '';
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

  const patchDraft = (patch: Partial<Invoice>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const patchItem = (id: string, patch: Partial<LineItem>) =>
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  /* ── Invoice actions ── */

  const handleSave = () => {
    const now = new Date().toISOString();
    let clientId = draft.clientId;
    let savedClients = clients;
    if (clientId === 'new' && draft.clientName.trim()) {
      const created: Client = {
        id: uid(),
        name: draft.clientName.trim(),
        email: draft.clientEmail.trim(),
        address: draft.clientAddress.trim(),
      };
      savedClients = [...clients, created];
      setClients(savedClients);
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
    setDraft({ ...inv, items: inv.items.map((it) => ({ ...it })) });
    setSavedNote('');
    setView('create');
  };

  const handleDuplicate = (inv: Invoice) => {
    const today = todayIso();
    setDraft({
      ...inv,
      id: '',
      number: formatInvoiceNumber(profile.nextInvoiceNumber),
      issueDate: today,
      dueDate: addDaysIso(today, 14),
      status: 'draft',
      amountPaid: 0,
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
    setInvoices((list) =>
      list.map((i) =>
        i.id === inv.id
          ? { ...i, amountPaid: t.total, status: 'paid' as InvoiceStatus, updatedAt: new Date().toISOString() }
          : i
      )
    );
    if (draft.id === inv.id) {
      setDraft((d) => ({ ...d, amountPaid: t.total, status: 'paid' }));
    }
  };

  const handleClientSelect = (value: string) => {
    if (value === 'manual') {
      patchDraft({ clientId: null });
      return;
    }
    if (value === 'new') {
      patchDraft({ clientId: 'new', clientName: '', clientEmail: '', clientAddress: '' });
      return;
    }
    const c = clients.find((x) => x.id === value);
    if (c) {
      patchDraft({ clientId: c.id, clientName: c.name, clientEmail: c.email, clientAddress: c.address });
    }
  };

  /* ── PDF ── */

  const downloadPdf = () => {
    const doc = new JsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const brand = hexToRgb(profile.brandColor || '#1d4ed8');
    const inv = draft;
    const t = totals;
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
          doc.addImage(profile.logoDataUrl, profile.logoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG', pageW - 45, y - 6, 30, 12);
        } catch { /* logo is decorative in the PDF */ }
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
    ensure(30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`Issue date: ${inv.issueDate}`, pageW - 15, y, { align: 'right' });
    doc.text(`Due date: ${inv.dueDate}`, pageW - 15, y + 5, { align: 'right' });
    doc.text(`Status: ${inv.status.toUpperCase()}`, pageW - 15, y + 10, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text('Bill to', 15, y);
    doc.setFont('helvetica', 'normal');
    const billLines = doc.splitTextToSize(
      [inv.clientName || 'Client', inv.clientAddress, inv.clientEmail].filter(Boolean).join('\n'),
      95
    ) as string[];
    billLines.forEach((line, i) => doc.text(line, 15, y + 5 + i * 4.5));
    y += Math.max(16, 5 + billLines.length * 4.5) + 4;

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
      doc.text(money(item.unitPrice || 0, inv.currency), 152, y, { align: 'right' });
      doc.text(money((item.qty || 0) * (item.unitPrice || 0), inv.currency), pageW - 17, y, {
        align: 'right',
      });
      y += Math.max(6, desc.length * 4.8) + 1.5;
    });

    // Totals
    ensure(42);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(118, y - 3, pageW - 15, y - 3);
    const rows: Array<[string, string, boolean]> = [
      ['Subtotal', money(t.subtotal, inv.currency), false],
      ...(t.discountAmount > 0
        ? [[`Discount (${clampPct(inv.discountPct)}%)`, `− ${money(t.discountAmount, inv.currency)}`, false] as [string, string, boolean]]
        : []),
      ...(t.taxAmount > 0
        ? [[`${inv.taxLabel || 'Tax'} (${clampPct(inv.taxPct)}%)`, money(t.taxAmount, inv.currency), false] as [string, string, boolean]]
        : []),
      ...(inv.shipping > 0
        ? [['Shipping', money(inv.shipping, inv.currency), false] as [string, string, boolean]]
        : []),
      ['Total', money(t.total, inv.currency), true],
      ...(inv.amountPaid > 0
        ? [['Amount paid', money(inv.amountPaid, inv.currency), false] as [string, string, boolean]]
        : []),
      ['Balance due', money(t.balance, inv.currency), true],
    ];
    rows.forEach(([label, value, bold]) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.text(label, 120, y);
      doc.text(value, pageW - 15, y, { align: 'right' });
      y += 5.5;
    });
    doc.setFont('helvetica', 'normal');

    // QR + notes + terms
    if (effectiveQr) {
      ensure(48);
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('Scan to pay', 15, y);
      try {
        doc.addImage(effectiveQr, 'PNG', 15, y + 3, 34, 34);
      } catch { /* QR is optional in the PDF */ }
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

  const clientSelectValue =
    draft.clientId === 'new' ? 'new' : draft.clientId ?? 'manual';

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
                <Field label="Issue date">
                  <Input
                    type="date"
                    value={draft.issueDate}
                    onChange={(e) => patchDraft({ issueDate: e.target.value })}
                  />
                </Field>
                <Field label="Due date">
                  <Input
                    type="date"
                    value={draft.dueDate}
                    onChange={(e) => patchDraft({ dueDate: e.target.value })}
                  />
                </Field>
                <Field label="Currency">
                  <Select
                    value={draft.currency}
                    onValueChange={(v) => patchDraft({ currency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <SelectItem value="new">+ New client (saved when you save the invoice)</SelectItem>
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
                <Field label="Discount %">
                  <NumInput
                    value={draft.discountPct}
                    onChange={(n) => patchDraft({ discountPct: n })}
                    min={0}
                    max={100}
                  />
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
                <Field label="Amount already paid">
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
                <p className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                  <span>Balance due</span>
                  <span>{money(totals.balance, draft.currency)}</span>
                </p>
              </div>
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
            {savedNote && <p className="text-sm text-emerald-600">{savedNote}</p>}
            {draft.id && (
              <p className="text-xs text-muted-foreground">
                You are editing {draft.number}. Saving overwrites the stored copy.
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
          onLoad={handleLoad}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onMarkPaid={handleMarkPaid}
          onNew={handleNew}
        />
      )}

      {view === 'settings' && (
        <SettingsView
          profile={profile}
          setProfile={setProfile}
          clients={clients}
          setClients={setClients}
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
  return (
    <div className="bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
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
              <img src={profile.logoDataUrl} alt="Business logo" className="max-h-14 max-w-32 object-contain" />
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
              <img src={profile.logoDataUrl} alt="Business logo" className="max-h-12 max-w-28 object-contain" />
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
          </div>
          <div className="text-sm text-right">
            {inv.template !== 'modern' && <p className="font-semibold">{inv.number}</p>}
            <p className="text-slate-500">Issued: {inv.issueDate}</p>
            <p className="text-slate-500">Due: {inv.dueDate}</p>
            <span
              className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_STYLES[inv.status]}`}
            >
              {totals.paidInFull ? 'Paid in full' : inv.status}
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
                <dt className="text-slate-500">Discount ({clampPct(inv.discountPct)}%)</dt>
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
            {inv.amountPaid > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Amount paid</dt>
                <dd>{money(inv.amountPaid, inv.currency)}</dd>
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
              <img src={qrDataUrl} alt="Payment QR code" className="w-24 h-24 border border-slate-200 rounded" />
              <div className="text-xs text-slate-500 max-w-44">
                <p className="font-semibold text-slate-700 text-sm">Scan to pay</p>
                <p className="mt-0.5 break-words">{payText}</p>
              </div>
            </div>
          )}
          <div className="text-xs text-slate-500 flex-1 min-w-52 space-y-2">
            {inv.notes.trim() && <p className="whitespace-pre-line">{inv.notes}</p>}
            {inv.terms.trim() && <p className="whitespace-pre-line">{inv.terms}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Invoices list ─────────────────────────────────────────────────── */

function InvoicesView({
  invoices,
  onLoad,
  onDuplicate,
  onDelete,
  onMarkPaid,
  onNew,
}: {
  invoices: Invoice[];
  onLoad: (inv: Invoice) => void;
  onDuplicate: (inv: Invoice) => void;
  onDelete: (inv: Invoice) => void;
  onMarkPaid: (inv: Invoice) => void;
  onNew: () => void;
}) {
  const summary = useMemo(() => {
    const byCurrency = new Map<string, { invoiced: number; collected: number; outstanding: number }>();
    for (const inv of invoices) {
      const t = computeTotals(inv);
      const row = byCurrency.get(inv.currency) ?? { invoiced: 0, collected: 0, outstanding: 0 };
      row.invoiced += t.total;
      row.collected += Math.min(inv.amountPaid || 0, t.total);
      row.outstanding += t.balance;
      byCurrency.set(inv.currency, row);
    }
    return [...byCurrency.entries()];
  }, [invoices]);

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
        <div className="space-y-3">
          {invoices.map((inv) => {
            const t = computeTotals(inv);
            return (
              <Card key={inv.id} className="p-4 flex flex-wrap items-center gap-x-4 gap-y-3">
                <div className="min-w-44">
                  <p className="font-semibold">{inv.number}</p>
                  <p className="text-xs text-muted-foreground">
                    {inv.clientName || 'Unnamed client'} · {inv.issueDate} → {inv.dueDate}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_STYLES[inv.status]}`}
                >
                  {inv.status}
                </span>
                <div className="text-sm ml-auto text-right">
                  <p className="font-semibold">{money(t.total, inv.currency)}</p>
                  <p className="text-xs text-muted-foreground">
                    Balance: {money(t.balance, inv.currency)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => onLoad(inv)} className="gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Open
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDuplicate(inv)} className="gap-1.5">
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </Button>
                  {inv.status !== 'paid' && (
                    <Button size="sm" variant="outline" onClick={() => onMarkPaid(inv)}>
                      Mark paid
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => onDelete(inv)} className="gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Settings: profile + clients ───────────────────────────────────── */

function SettingsView({
  profile,
  setProfile,
  clients,
  setClients,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}) {
  const [newClient, setNewClient] = useState({ name: '', email: '', address: '' });
  const patch = (p: Partial<Profile>) => setProfile((cur) => ({ ...cur, ...p }));

  const handleLogo = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ logoDataUrl: String(reader.result || '') });
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
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
                onChange={(e) => handleLogo(e.target.files?.[0] ?? null)}
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
                <Button size="sm" variant="ghost" onClick={() => patch({ logoDataUrl: '' })} className="gap-1">
                  <X className="w-3.5 h-3.5" /> Remove
                </Button>
              </>
            )}
          </div>
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
                    {c}
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
              <Input value={profile.brandColor} onChange={(e) => patch({ brandColor: e.target.value })} />
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
                      {[c.email, c.address].filter(Boolean).join(' · ')}
                    </p>
                  </div>
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
                  },
                ]);
                setNewClient({ name: '', email: '', address: '' });
              }}
            >
              <Plus className="w-4 h-4" /> Add client
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Your data stays here</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
            Your profile, clients and invoices are stored only in this browser&apos;s local
            storage, on this device. There is no account and no server copy — refresh the page,
            close the tab, come back next week: everything is exactly where you left it. Clearing
            your browser&apos;s site data deletes it permanently, so keep your downloaded PDFs as
            your long-term records.
          </p>
        </Card>
      </div>
    </div>
  );
}
