'use client';

import { useMemo, useRef, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
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
import {
  Building2,
  CalendarDays,
  Download,
  FileText,
  PenLine,
  Percent,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import JsPDF from 'jspdf';

const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'] as const;
type Currency = (typeof CURRENCIES)[number];

interface LineItem {
  id: number;
  description: string;
  qty: number;
  unitPrice: number;
  optional: boolean;
}

function toIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIso(date);
}

function formatDate(iso: string): string {
  if (!iso) return 'Not set';
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const faqs = [
  {
    question: 'Is a quotation the same as an invoice?',
    answer:
      'No. A quotation is a pre-sale estimate you send before any work starts, so the client can approve the scope and price first. An invoice is a demand for payment sent after work is agreed or delivered. A quote creates no obligation to pay until the client accepts it, whereas an invoice records money that is already owed.',
  },
  {
    question: 'How long should a quotation stay valid?',
    answer:
      'Fourteen to thirty days is the most common window for services, while trades and suppliers who face fast-moving material prices often use seven to fourteen days. The right length balances two things: long enough that the client can get internal approval, and short enough that your own supplier prices, exchange rates and schedule have not moved underneath you.',
  },
  {
    question: 'What does marking a line item as optional actually do?',
    answer:
      'An optional line is shown on the quotation with its own price, but it is kept out of the subtotal, discount, tax and grand total. That lets a client see the cost of an upgrade, an extra room, a faster turnaround or a premium material without inflating the headline price they are being asked to approve. If they want it, add it as a normal line before they sign.',
  },
  {
    question: 'Can I turn an accepted quote into an invoice later?',
    answer:
      'Yes, and that is the normal workflow. Keep the accepted quotation exactly as signed, then raise the invoice from it using the same line items, prices and tax treatment, changing only what genuinely changed and was agreed in writing. Referencing the quote number on the invoice makes it easy for both sides to prove the final bill matches the price that was approved.',
  },
  {
    question: 'Does the acceptance line on the PDF make the quote a contract?',
    answer:
      'A signed acceptance, together with clear terms, scope and a validity date, is strong evidence that both sides agreed the work and the price. It is not a substitute for a full contract on large or risky jobs, and local law varies, so for high-value work have a qualified professional review your terms. For everyday small and medium jobs, a signed quote is far better protection than a verbal yes.',
  },
];

export default function QuoteGeneratorPage() {
  const todayInitial = toIso(new Date());
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('Q-1001');
  const [issueDate, setIssueDate] = useState(todayInitial);
  const [validUntil, setValidUntil] = useState(addDaysIso(todayInitial, 14));
  const [currency, setCurrency] = useState<Currency>('USD');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [taxLabel, setTaxLabel] = useState('Tax');
  const [notes, setNotes] = useState(
    'Optional items are listed for your consideration and are not included in the grand total unless you ask us to add them before accepting this quote.',
  );
  const [terms, setTerms] = useState(
    'This quotation is an estimate based on the scope described above. It is not an invoice and it is not a demand for payment. Prices hold until the valid-until date shown on this document. Work begins after written acceptance and payment of any deposit agreed at that stage. Changes to the agreed scope will be priced and approved in writing before extra work starts. Payment terms for the invoice raised from this quote will be confirmed on acceptance.',
  );
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 1,
      description: 'Project discovery and written scope plan',
      qty: 1,
      unitPrice: 150,
      optional: false,
    },
    {
      id: 2,
      description: 'Core implementation work, as described in the scope plan',
      qty: 1,
      unitPrice: 850,
      optional: false,
    },
    {
      id: 3,
      description: 'Priority delivery add-on',
      qty: 1,
      unitPrice: 200,
      optional: true,
    },
  ]);
  const [todayIso] = useState(() => toIso(new Date()));
  const nextId = useRef(4);

  const fmt = useMemo(() => {
    return (value: number) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(value);
      } catch {
        return `${currency} ${value.toFixed(2)}`;
      }
    };
  }, [currency]);

  const totals = useMemo(() => {
    const included = items.filter((item) => !item.optional);
    const optional = items.filter((item) => item.optional);
    const subtotal = included.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0,
    );
    const optionalTotal = optional.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0,
    );
    const discountAmount = (subtotal * Math.min(Math.max(discountPercent, 0), 100)) / 100;
    const taxable = Math.max(subtotal - discountAmount, 0);
    const taxAmount = (taxable * Math.max(taxPercent, 0)) / 100;
    return {
      subtotal,
      optionalTotal,
      discountAmount,
      taxable,
      taxAmount,
      grandTotal: taxable + taxAmount,
    };
  }, [items, discountPercent, taxPercent]);

  const daysRemaining = useMemo(() => {
    if (!validUntil || !todayIso) return null;
    const valid = new Date(`${validUntil}T00:00:00`).getTime();
    const today = new Date(`${todayIso}T00:00:00`).getTime();
    if (Number.isNaN(valid) || Number.isNaN(today)) return null;
    return Math.round((valid - today) / 86400000);
  }, [validUntil, todayIso]);

  const validityText =
    daysRemaining === null
      ? 'No validity date set'
      : daysRemaining > 1
        ? `Valid for ${daysRemaining} more days`
        : daysRemaining === 1
          ? 'Valid for 1 more day'
          : daysRemaining === 0
            ? 'Expires today'
            : `Expired ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? '' : 's'} ago`;

  const updateItem = (id: number, patch: Partial<LineItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => {
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [
      ...current,
      { id, description: '', qty: 1, unitPrice: 0, optional: false },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const downloadPdf = () => {
    const doc = new JsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    const ensureSpace = (needed: number) => {
      if (y + needed > 282) {
        doc.addPage();
        y = 18;
      }
    };

    const writeWrapped = (text: string, x: number, width: number, lineHeight = 5) => {
      const lines = doc.splitTextToSize(text || '', width) as string[];
      lines.forEach((line) => {
        ensureSpace(lineHeight);
        doc.text(line, x, y);
        y += lineHeight;
      });
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('QUOTATION', margin, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Quote No: ${quoteNumber || '-'}`, pageWidth - margin, y, {
      align: 'right',
    });
    y += 7;
    doc.setFontSize(10);
    doc.text(`Issued: ${formatDate(issueDate)}`, pageWidth - margin, y, {
      align: 'right',
    });
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`Valid until: ${formatDate(validUntil)} (${validityText})`, pageWidth - margin, y, {
      align: 'right',
    });
    doc.setFont('helvetica', 'normal');
    y += 4;
    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 9;

    const columnWidth = contentWidth / 2 - 4;
    const startY = y;
    doc.setFont('helvetica', 'bold');
    doc.text('From', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    writeWrapped(
      [businessName || 'Your Business', businessAddress, businessEmail, businessPhone]
        .filter(Boolean)
        .join('\n'),
      margin,
      columnWidth,
    );
    const leftEndY = y;
    y = startY;
    const rightX = margin + columnWidth + 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Prepared for', rightX, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    writeWrapped(
      [clientName || 'Client name', clientCompany, clientAddress]
        .filter(Boolean)
        .join('\n'),
      rightX,
      columnWidth,
    );
    y = Math.max(leftEndY, y) + 6;

    ensureSpace(12);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 5, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Description', margin + 2, y);
    doc.text('Qty', margin + 112, y, { align: 'right' });
    doc.text('Unit price', margin + 142, y, { align: 'right' });
    doc.text('Amount', pageWidth - margin - 2, y, { align: 'right' });
    y += 7;
    doc.setFont('helvetica', 'normal');

    items.forEach((item) => {
      const description = item.optional
        ? `${item.description || 'Item'} (Optional)`
        : item.description || 'Item';
      const lines = doc.splitTextToSize(description, 100) as string[];
      ensureSpace(Math.max(lines.length * 5, 6) + 2);
      const rowY = y;
      lines.forEach((line, index) => {
        doc.text(line, margin + 2, rowY + index * 5);
      });
      doc.text(String(item.qty), margin + 112, rowY, { align: 'right' });
      doc.text(fmt(item.qty * item.unitPrice).replace(/^[^\d-]+/, ''), pageWidth - margin - 2, rowY, {
        align: 'right',
      });
      doc.text(fmt(item.unitPrice).replace(/^[^\d-]+/, ''), margin + 142, rowY, {
        align: 'right',
      });
      y = rowY + Math.max(lines.length * 5, 6) + 1;
    });

    y += 3;
    ensureSpace(30);
    const totalsX = pageWidth - margin - 62;
    doc.setFontSize(10);
    doc.text('Subtotal', totalsX, y);
    doc.text(fmt(totals.subtotal), pageWidth - margin, y, { align: 'right' });
    y += 6;
    if (totals.discountAmount > 0) {
      doc.text(`Discount (${discountPercent}%)`, totalsX, y);
      doc.text(`-${fmt(totals.discountAmount)}`, pageWidth - margin, y, {
        align: 'right',
      });
      y += 6;
    }
    if (totals.taxAmount > 0 || taxPercent > 0) {
      doc.text(`${taxLabel || 'Tax'} (${taxPercent}%)`, totalsX, y);
      doc.text(fmt(totals.taxAmount), pageWidth - margin, y, { align: 'right' });
      y += 6;
    }
    if (totals.optionalTotal > 0) {
      doc.text('Optional items (not included)', totalsX, y);
      doc.text(fmt(totals.optionalTotal), pageWidth - margin, y, {
        align: 'right',
      });
      y += 6;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Grand total', totalsX, y);
    doc.text(fmt(totals.grandTotal), pageWidth - margin, y, { align: 'right' });
    y += 10;

    if (notes.trim()) {
      doc.setFontSize(11);
      doc.text('Notes', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      writeWrapped(notes, margin, contentWidth);
      y += 4;
    }

    if (terms.trim()) {
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Terms and conditions', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      writeWrapped(terms, margin, contentWidth);
      y += 6;
    }

    ensureSpace(28);
    y += 6;
    doc.setFontSize(10);
    doc.text('Accepted by (client signature):', margin, y);
    doc.line(margin + 58, y, margin + 118, y);
    doc.text('Date:', margin + 126, y);
    doc.line(margin + 138, y, pageWidth - margin, y);
    y += 7;
    doc.setFontSize(9);
    doc.text(
      'Signing above accepts this quotation, its scope and its terms, at the grand total shown.',
      margin,
      y,
    );

    doc.save(`quotation-${quoteNumber || 'quote'}.pdf`);
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'Quote Generator', href: '/quote-generator' }]} />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Quote Generator — Free Quotation &amp; Estimate Maker
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          A quotation is the document that wins the job before any work begins: it is a
          written, priced promise of what you will do, what it will cost, and how long that
          price will hold. This free generator helps freelancers, tradespeople, agencies and
          small firms turn a conversation into a clear, professional estimate — with scope
          lines, optional extras, a validity window and an acceptance line — then download it
          as a polished PDF you can send the same day. Nothing is uploaded or stored; every
          figure is calculated and rendered in your browser.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Your business
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business name</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  placeholder="e.g. BrightBuild Renovations"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-phone">Phone</Label>
                <Input
                  id="business-phone"
                  value={businessPhone}
                  onChange={(event) => setBusinessPhone(event.target.value)}
                  placeholder="e.g. +92 300 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Email</Label>
                <Input
                  id="business-email"
                  type="email"
                  value={businessEmail}
                  onChange={(event) => setBusinessEmail(event.target.value)}
                  placeholder="quotes@yourbusiness.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-address">Business address</Label>
                <Input
                  id="business-address"
                  value={businessAddress}
                  onChange={(event) => setBusinessAddress(event.target.value)}
                  placeholder="Street, city, country"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" /> Client
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client name</Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Person you are quoting"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-company">Client company</Label>
                <Input
                  id="client-company"
                  value={clientCompany}
                  onChange={(event) => setClientCompany(event.target.value)}
                  placeholder="Company, if applicable"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="client-address">Client address</Label>
                <Input
                  id="client-address"
                  value={clientAddress}
                  onChange={(event) => setClientAddress(event.target.value)}
                  placeholder="Site or billing address for this job"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" /> Quote details and validity
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quote-number">Quote number</Label>
                <Input
                  id="quote-number"
                  value={quoteNumber}
                  onChange={(event) => setQuoteNumber(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-date">Issue date</Label>
                <Input
                  id="issue-date"
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid-until">Valid until</Label>
                <Input
                  id="valid-until"
                  type="date"
                  value={validUntil}
                  onChange={(event) => setValidUntil(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value as Currency)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Validity countdown: <span className="font-medium text-foreground">{validityText}</span>.
              A clear expiry date protects you when supplier prices rise and gives the client a
              gentle, honest reason to decide promptly instead of letting the estimate drift.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> Scope and line items
            </h2>
            <p className="text-sm text-muted-foreground">
              Write each line as a piece of scope the client can recognise, not as an internal
              cost code. Tick <span className="font-medium text-foreground">Optional</span> for
              upgrades and add-ons: they print on the quote with their own price but stay out of
              the grand total until the client asks for them.
            </p>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 sm:grid-cols-[1fr_80px_120px_auto_auto] sm:items-end border rounded-lg p-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`item-desc-${item.id}`}>Description {index + 1}</Label>
                    <Input
                      id={`item-desc-${item.id}`}
                      value={item.description}
                      onChange={(event) =>
                        updateItem(item.id, { description: event.target.value })
                      }
                      placeholder="What is included in this line?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`item-qty-${item.id}`}>Qty</Label>
                    <Input
                      id={`item-qty-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.qty}
                      onChange={(event) =>
                        updateItem(item.id, { qty: Number(event.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`item-price-${item.id}`}>Unit price</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(event) =>
                        updateItem(item.id, { unitPrice: Number(event.target.value) || 0 })
                      }
                    />
                  </div>
                  <label
                    htmlFor={`item-optional-${item.id}`}
                    className="flex items-center gap-2 text-sm pb-2 cursor-pointer"
                  >
                    <input
                      id={`item-optional-${item.id}`}
                      type="checkbox"
                      className="h-4 w-4"
                      checked={item.optional}
                      onChange={(event) =>
                        updateItem(item.id, { optional: event.target.checked })
                      }
                    />
                    Optional
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Remove line item ${index + 1}`}
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" /> Add line item
            </Button>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="h-5 w-5" /> Discount, tax, notes and terms
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount %</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={discountPercent}
                  onChange={(event) =>
                    setDiscountPercent(Number(event.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-percent">Tax %</Label>
                <Input
                  id="tax-percent"
                  type="number"
                  min="0"
                  step="0.01"
                  value={taxPercent}
                  onChange={(event) => setTaxPercent(Number(event.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-label">Tax label</Label>
                <Input
                  id="tax-label"
                  value={taxLabel}
                  onChange={(event) => setTaxLabel(event.target.value)}
                  placeholder="VAT, GST, Sales Tax…"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for the client</Label>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms and conditions</Label>
              <Textarea
                id="terms"
                rows={5}
                value={terms}
                onChange={(event) => setTerms(event.target.value)}
              />
            </div>
          </section>

          <section className="rounded-lg bg-muted/50 p-4 space-y-2" aria-label="Quote summary">
            <h2 className="font-semibold">Live summary — convert totals</h2>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal (agreed scope)</dt>
                <dd className="font-medium">{fmt(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Optional items (excluded)</dt>
                <dd className="font-medium">{fmt(totals.optionalTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Discount ({discountPercent || 0}%)</dt>
                <dd className="font-medium">-{fmt(totals.discountAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>
                  {taxLabel || 'Tax'} ({taxPercent || 0}%)
                </dt>
                <dd className="font-medium">{fmt(totals.taxAmount)}</dd>
              </div>
              <div className="flex justify-between text-base sm:col-span-2 border-t pt-2 mt-1">
                <dt className="font-semibold">Grand total if accepted as quoted</dt>
                <dd className="font-bold">{fmt(totals.grandTotal)}</dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">{validityText} — valid until {formatDate(validUntil)}.</p>
          </section>

          <section className="space-y-4" aria-label="Quotation preview">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <PenLine className="h-5 w-5" /> Live preview
              </h2>
              <Button type="button" onClick={downloadPdf}>
                <Download className="h-4 w-4 mr-2" /> Download PDF quote
              </Button>
            </div>
            <div className="border rounded-lg bg-white text-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4 border-b pb-4">
                <div>
                  <p className="text-2xl font-bold tracking-wide">QUOTATION</p>
                  <p className="text-sm text-slate-600">
                    This is an estimate, not an invoice or a demand for payment.
                  </p>
                </div>
                <div className="text-sm text-right">
                  <p>
                    <span className="font-semibold">Quote No:</span> {quoteNumber || '—'}
                  </p>
                  <p>
                    <span className="font-semibold">Issued:</span> {formatDate(issueDate)}
                  </p>
                  <p className="font-semibold">
                    Valid until: {formatDate(validUntil)} ({validityText})
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-semibold mb-1">From</p>
                  <p className="font-medium">{businessName || 'Your Business'}</p>
                  {businessAddress ? <p>{businessAddress}</p> : null}
                  {businessEmail ? <p>{businessEmail}</p> : null}
                  {businessPhone ? <p>{businessPhone}</p> : null}
                </div>
                <div>
                  <p className="font-semibold mb-1">Prepared for</p>
                  <p className="font-medium">{clientName || 'Client name'}</p>
                  {clientCompany ? <p>{clientCompany}</p> : null}
                  {clientAddress ? <p>{clientAddress}</p> : null}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 pr-3">Description</th>
                      <th className="py-2 pr-3 text-right">Qty</th>
                      <th className="py-2 pr-3 text-right">Unit price</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-2 pr-3">
                          {item.description || 'Item'}
                          {item.optional ? (
                            <span className="ml-2 rounded bg-amber-100 text-amber-900 px-1.5 py-0.5 text-xs font-medium">
                              Optional — not in total
                            </span>
                          ) : null}
                        </td>
                        <td className="py-2 pr-3 text-right">{item.qty}</td>
                        <td className="py-2 pr-3 text-right">{fmt(item.unitPrice)}</td>
                        <td className="py-2 text-right">{fmt(item.qty * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <dl className="w-full sm:w-72 text-sm space-y-1">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>{fmt(totals.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Discount</dt>
                    <dd>-{fmt(totals.discountAmount)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>{taxLabel || 'Tax'}</dt>
                    <dd>{fmt(totals.taxAmount)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Optional items (excluded)</dt>
                    <dd>{fmt(totals.optionalTotal)}</dd>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <dt>Grand total</dt>
                    <dd>{fmt(totals.grandTotal)}</dd>
                  </div>
                </dl>
              </div>
              {notes ? (
                <div className="text-sm">
                  <p className="font-semibold mb-1">Notes</p>
                  <p className="text-slate-700 whitespace-pre-wrap">{notes}</p>
                </div>
              ) : null}
              {terms ? (
                <div className="text-sm">
                  <p className="font-semibold mb-1">Terms and conditions</p>
                  <p className="text-slate-700 whitespace-pre-wrap">{terms}</p>
                </div>
              ) : null}
              <div className="pt-4 border-t text-sm grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="mb-8">Accepted by (client signature):</p>
                  <p className="border-t pt-1 text-slate-600">
                    Signature — acceptance confirms the scope, price and terms above
                  </p>
                </div>
                <div>
                  <p className="mb-8">Date of acceptance:</p>
                  <p className="border-t pt-1 text-slate-600">Date</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Card>

      <AdSlot id="quote-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <p className="leading-relaxed text-muted-foreground">
          Start with the two parties. Your business block tells the client exactly who is
          making the offer, and the client block ties the price to one named person, company
          and site address — important when a quote is forwarded around a family, a facilities
          team or a procurement inbox and someone later asks who this price was actually for.
          Give the document a quote number you can file and reference on the phone, then set
          the issue date and, crucially, the valid-until date. That second date is what turns
          a loose estimate into a quotation: it says this price is firm, but only for this
          window.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Next, build the scope line by line. Each line should describe a result or a clearly
          bounded piece of work — preparation, supply, installation, testing, cleanup — with a
          quantity and a unit price, rather than one large unexplained lump sum. Clients
          compare lump sums on price alone; they compare itemised scope on value. If there is
          an upgrade you would recommend but do not want to force into the headline price, add
          it as an optional line. It appears on the document with its price, it is clearly
          labelled as excluded, and the grand total stays honest. Finally, apply any discount
          deliberately rather than by default, set the tax rate and label that applies in your
          market, read the live summary, check the preview reads like a document you would be
          proud to sign yourself, and download the PDF.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Sending the quote is only half the job. Note the expiry date in your own diary and
          follow up once, politely, a few days before it lapses: a short message saying the
          price holds until Friday and asking whether the scope still matches what they need
          resolves most stalled quotes. If the client accepts, keep the signed copy. When the
          work is done you will raise the invoice from these same lines, and the match between
          the accepted quote and the final bill is what prevents the most common end-of-job
          dispute — the belief that the price was somehow lower.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Who uses a quote generator, and for what</h2>
        <p className="leading-relaxed text-muted-foreground">
          Builders, electricians, plumbers, painters and landscapers use quotations to price
          work that cannot be charged by the hour sight unseen: a bathroom refit, a rewiring,
          a garden redesign. For them the scope lines and the validity window matter most,
          because material prices move and a quote with no expiry can be accepted six months
          later at last season&apos;s prices. Freelance designers, writers, developers and
          photographers use quotes to package project work — discovery, core delivery,
          revisions — and to separate the base package from optional extras such as rush
          delivery or additional concepts, so a client on a tight budget can say yes to the
          core offer instead of walking away from an all-or-nothing price.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Agencies and consultants use a formal quotation to survive internal approval: the
          person you spoke to rarely signs alone, and a clean PDF with a quote number, dates
          and terms is what gets forwarded to a manager or finance team. Event vendors,
          caterers and equipment hire firms quote per head, per day or per item, where
          quantities change late — the live totals here let them re-price a changed headcount
          in front of the client instead of promising to recalculate later. Even internal
          teams benefit: a support or maintenance quote with optional add-ons gives a client a
          documented choice between cover levels, and the acceptance line records which level
          they actually chose.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">A quote is not an invoice</h2>
        <p className="leading-relaxed text-muted-foreground">
          The two documents look similar — parties, line items, tax, a total — which is exactly
          why they get confused, and the confusion costs money. A quote is an offer made
          before work: nothing is owed, nothing is due, and the client is free to decline,
          negotiate the scope or ask for options to be added or removed. An invoice is a
          record of a debt after agreement or delivery: it carries payment terms, a due date
          and, in many tax systems, a formal tax-invoice status that a quote does not have.
          Sending an invoice when you meant to send a quote pressures clients and can create
          tax paperwork for income you have not earned; sending a quote when the work is
          already done weakens your position, because you appear to still be negotiating a
          price that was settled weeks ago. Use this generator for the offer stage. When the
          signed quote comes back, the same figures become the backbone of the invoice — same
          items, same total, with only agreed changes added and explained.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Features and specifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg">
            <tbody>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold align-top w-48">Document type</th>
                <td className="p-3 text-muted-foreground">
                  Pre-sale quotation or estimate, headed QUOTATION in the preview and the PDF,
                  with wording that states plainly it is not a demand for payment.
                </td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold align-top">Validity handling</th>
                <td className="p-3 text-muted-foreground">
                  Issue date and valid-until date on every quote, a live countdown of days
                  remaining in the editor and the preview, and the expiry stated on the PDF.
                </td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold align-top">Line items</th>
                <td className="p-3 text-muted-foreground">
                  Unlimited scope lines with description, quantity and unit price, add and
                  remove controls, and an optional flag per line that prices the item but
                  excludes it from all totals.
                </td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold align-top">Money</th>
                <td className="p-3 text-muted-foreground">
                  Six currencies — PKR, USD, EUR, GBP, INR and AED — with a percentage discount
                  applied before tax, and an editable tax label so the document can say VAT,
                  GST, sales tax or your local equivalent.
                </td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold align-top">Acceptance</th>
                <td className="p-3 text-muted-foreground">
                  A signature and date line for client acceptance at the foot of the preview
                  and the PDF, turning an emailed estimate into a recorded agreement.
                </td>
              </tr>
              <tr>
                <th className="text-left p-3 font-semibold align-top">Privacy and output</th>
                <td className="p-3 text-muted-foreground">
                  Everything runs in your browser with no account and no upload. The PDF is
                  generated locally, wraps long terms text safely and adds pages automatically
                  when a long scope runs over.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Practical tips for quotes that win work</h2>
        <p className="leading-relaxed text-muted-foreground">
          Quote quickly, but never vaguely. Speed matters — the first clear quote often sets
          the frame every competitor is judged against — yet a fast quote that says little
          invites the client to fill the gaps with their own optimistic assumptions. Describe
          what is included and, where it commonly causes arguments, what is not: disposal of
          old materials, parking or access costs, a second site visit, extra revision rounds.
          One honest line about exclusions in the notes protects more margin than any discount
          negotiation. Similarly, name the assumptions underneath the price, such as the site
          being accessible on the agreed date or the client supplying final content by a set
          day, so a delay on their side does not silently become a cost on yours.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Treat the validity window as a professional signal, not a pressure trick. A fair
          window — long enough for a household to discuss or a manager to approve, short
          enough that your prices are real — tells the client you have priced the job properly
          rather than inventing a number that can drift. Use optional lines the same way: a
          well-chosen upgrade, presented beside the core price instead of buried in a follow-up
          email, regularly lifts the value of accepted work without making the base offer look
          expensive. And when you discount, trade it for something — a faster decision, a
          larger deposit, a wider scope — rather than simply lowering the number, because a
          discount given for nothing teaches the client that your first price was never real.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Finally, keep your numbering and filing boringly consistent. Quote numbers that run
          in sequence, one folder per client, and a copy of every signed acceptance mean that
          months later — when the invoice is queried or a warranty question arises — you can
          produce the exact document the client agreed to. That record is the quiet advantage
          of quoting in writing at all: memory fades and chat threads scroll away, but a
          dated, signed quotation still says precisely what was offered, at what price, and
          until when.
        </p>
      </section>

      <AdSlot id="quote-generator-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <dl className="space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="border rounded-lg p-4">
              <dt className="font-semibold">{faq.question}</dt>
              <dd className="mt-2 text-muted-foreground leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
