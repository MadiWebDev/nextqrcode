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
import { Download, FileText, Plus, Receipt, Trash2 } from 'lucide-react';
import JsPDF from 'jspdf';

interface DebitItem {
  id: number;
  description: string;
  qty: string;
  price: string;
}

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

const reasons = [
  'Price undercharged on original invoice',
  'Additional goods delivered',
  'Additional services provided',
  'Freight or delivery not billed',
  'Tax short-charged',
  'Quantity correction',
  'Other',
];

function parseAmount(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function formatDate(iso: string): string {
  if (!iso) return 'Not set';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const faqs = [
  {
    question: 'What is the difference between a debit note and a credit note?',
    answer:
      'They move an invoice balance in opposite directions. A credit note reduces what the customer owes — used for returns, damage or overcharging. A debit note increases what the customer owes — used when the original invoice charged too little, missed goods or services that were actually supplied, or short-charged tax. Both documents reference the original invoice and leave it untouched, so the audit trail always shows the original charge plus the correction, rather than a silently rewritten invoice.',
  },
  {
    question: 'Can I issue a debit note after the customer has already paid the invoice?',
    answer:
      'Yes, provided the extra amount is genuinely owed under the agreement — for example freight that was always chargeable but left off the invoice, or additional units the customer received and accepted. Send the debit note with a clear explanation and the evidence (delivery note, signed timesheet, agreed rate card). The customer then pays the difference as a separate balance. What you cannot do is invent new charges after payment that were never part of the deal; a debit note corrects billing, it does not renegotiate the price.',
  },
  {
    question: 'Does a debit note change the GST or VAT I owe?',
    answer:
      'Yes. A debit note that increases the taxable value of a supply normally increases the output tax on it, charged at the same rate as the original invoice and reported in the tax period in which the debit note is issued (the exact timing rule varies by country). That is why the tax rate and label on the debit note should match the original invoice, and why the note must carry its own sequential number and a clear reference to the invoice it corrects. This page is a document tool, not tax advice — for material amounts, confirm the treatment with your accountant.',
  },
  {
    question: 'Should the customer sign or accept the debit note?',
    answer:
      'A debit note is issued by the seller, so a customer signature is not usually a legal requirement. In practice, though, debit notes are disputed more often than invoices because the customer is being asked for more money than the original bill. Sending the note with the supporting evidence and asking the customer to acknowledge it in writing — even a reply email — dramatically reduces disputes and gives your accounts team something to chase against if payment stalls.',
  },
  {
    question: 'Can I use one debit note to correct several invoices?',
    answer:
      'It is much safer not to. Tax rules and customer accounts-payable systems both work invoice by invoice: each debit note should reference exactly one original invoice, so the correction, its tax and its payment can all be matched cleanly. If you under-billed three invoices, issue three debit notes. The few minutes saved by combining them are repaid many times over at audit or reconciliation time, when nobody can tell which part of a lump correction belongs to which sale.',
  },
];

export default function DebitNoteGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [fortnightAgo] = useState(
    () => new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const [sellerName, setSellerName] = useState('Brightline Traders');
  const [sellerAddress, setSellerAddress] = useState('22 Shahrah-e-Faisal, Karachi, Pakistan');
  const [sellerEmail, setSellerEmail] = useState('accounts@brightline.example');
  const [customerName, setCustomerName] = useState('Northwind Traders');
  const [customerAddress, setCustomerAddress] = useState(
    'Office 402, Trade Centre, Karachi, Pakistan'
  );
  const [debitNoteNumber, setDebitNoteNumber] = useState('DN-001');
  const [debitNoteDate, setDebitNoteDate] = useState(today);
  const [dueDate, setDueDate] = useState(
    () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState('INV-1042');
  const [originalInvoiceDate, setOriginalInvoiceDate] = useState(fortnightAgo);
  const [currency, setCurrency] = useState('PKR');
  const [reason, setReason] = useState('Freight or delivery not billed');
  const [reasonNotes, setReasonNotes] = useState(
    'Delivery charges for the October shipment were agreed in the order confirmation but were left off invoice INV-1042 in error. This note bills those charges only; no goods values are changed.'
  );
  const [items, setItems] = useState<DebitItem[]>([
    { id: 1, description: 'Delivery — Karachi to Lahore, 1 truck', qty: '1', price: '45000' },
    { id: 2, description: 'Loading and unloading labour', qty: '1', price: '6000' },
  ]);
  const nextId = useRef(3);
  const [taxPercent, setTaxPercent] = useState('0');
  const [taxLabel, setTaxLabel] = useState('GST');
  const [paymentNote, setPaymentNote] = useState(
    'Please pay this additional amount by the due date shown, quoting debit note DN-001 and original invoice INV-1042 with your payment.'
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseAmount(item.qty) * parseAmount(item.price),
      0
    );
    const taxRate = Math.min(Math.max(parseAmount(taxPercent), 0), 100);
    const taxAmount = (subtotal * taxRate) / 100;
    return { subtotal, taxRate, taxAmount, totalDebit: subtotal + taxAmount };
  }, [items, taxPercent]);

  const updateItem = (id: number, field: keyof DebitItem, value: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [...current, { id, description: '', qty: '1', price: '0' }]);
  };

  const removeItem = (id: number) => {
    setItems((current) =>
      current.length > 1 ? current.filter((item) => item.id !== id) : current
    );
  };

  const downloadPdf = () => {
    const doc = new JsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('DEBIT NOTE', margin, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Debit Note No: ${debitNoteNumber || '-'}`, pageWidth - margin, y, {
      align: 'right',
    });
    y += 6;
    doc.setFontSize(10);
    doc.text(`Date: ${formatDate(debitNoteDate)}`, pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.text(`Due: ${formatDate(dueDate)}`, pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.text(
      `Against invoice: ${originalInvoiceNumber || '-'} dated ${formatDate(originalInvoiceDate)}`,
      pageWidth - margin,
      y,
      { align: 'right' }
    );
    y += 6;
    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('From', margin, y);
    doc.text('To', pageWidth / 2, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const from = doc.splitTextToSize(
      [sellerName, sellerAddress, sellerEmail].filter(Boolean).join('\n'),
      80
    ) as string[];
    const to = doc.splitTextToSize([customerName, customerAddress].filter(Boolean).join('\n'), 80) as string[];
    doc.text(from, margin, y);
    doc.text(to, pageWidth / 2, y);
    y += Math.max(from.length, to.length) * 4.6 + 4;
    doc.setFont('helvetica', 'bold');
    doc.text(`Reason: ${reason}`, margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const rn = doc.splitTextToSize(reasonNotes, pageWidth - margin * 2) as string[];
    doc.text(rn, margin, y);
    y += rn.length * 4.6 + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 4.5, pageWidth - margin * 2, 7, 'F');
    doc.text('Description', margin + 1, y);
    doc.text('Qty', 138, y, { align: 'right' });
    doc.text('Unit price', 163, y, { align: 'right' });
    doc.text('Amount', pageWidth - margin, y, { align: 'right' });
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    for (const item of items) {
      const amount = parseAmount(item.qty) * parseAmount(item.price);
      const desc = doc.splitTextToSize(item.description || 'Item', 95) as string[];
      doc.text(desc, margin + 1, y);
      doc.text(String(parseAmount(item.qty)), 138, y, { align: 'right' });
      doc.text(formatMoney(parseAmount(item.price), currency), 163, y, { align: 'right' });
      doc.text(formatMoney(amount, currency), pageWidth - margin, y, { align: 'right' });
      y += Math.max(desc.length, 1) * 4.4 + 1.6;
    }
    y += 2;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    const lx = 128;
    const rx = pageWidth - margin;
    doc.text('Subtotal', lx, y);
    doc.text(formatMoney(totals.subtotal, currency), rx, y, { align: 'right' });
    y += 5.4;
    if (totals.taxRate > 0) {
      doc.text(`${taxLabel} (${totals.taxRate}%)`, lx, y);
      doc.text(formatMoney(totals.taxAmount, currency), rx, y, { align: 'right' });
      y += 5.4;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total additional amount due', lx, y);
    doc.text(formatMoney(totals.totalDebit, currency), rx, y, { align: 'right' });
    y += 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const pn = doc.splitTextToSize(paymentNote, pageWidth - margin * 2) as string[];
    doc.text(pn, margin, y);
    y += pn.length * 4.6 + 6;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      'Debit note created with the free Debit Note Generator — freeqrcode.tools',
      margin,
      y
    );
    doc.save(`debit-note-${debitNoteNumber || 'note'}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Debit Note Generator', href: '/debit-note-generator' },
        ]}
      />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Debit Note Generator
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Create a debit note when an invoice you already issued charged too little — missed
          freight, extra goods delivered, a pricing slip or short-charged tax. The note
          references the original invoice, explains the correction and produces a clean PDF
          your customer&rsquo;s accounts team can match and pay. Everything runs in your
          browser; nothing is uploaded.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-semibold">Seller and customer</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dn-seller">Your business name</Label>
                <Input id="dn-seller" value={sellerName} onChange={(e) => setSellerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-seller-email">Your email</Label>
                <Input id="dn-seller-email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dn-seller-address">Your address</Label>
              <Textarea id="dn-seller-address" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} rows={2} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dn-customer">Customer name</Label>
                <Input id="dn-customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-customer-address">Customer address</Label>
                <Textarea id="dn-customer-address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-semibold">Debit note details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dn-number">Debit note number</Label>
                <Input id="dn-number" value={debitNoteNumber} onChange={(e) => setDebitNoteNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-date">Note date</Label>
                <Input id="dn-date" type="date" value={debitNoteDate} onChange={(e) => setDebitNoteDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-due">Payment due</Label>
                <Input id="dn-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="dn-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dn-inv">Original invoice number</Label>
                <Input id="dn-inv" value={originalInvoiceNumber} onChange={(e) => setOriginalInvoiceNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-inv-date">Original invoice date</Label>
                <Input id="dn-inv-date" type="date" value={originalInvoiceDate} onChange={(e) => setOriginalInvoiceDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dn-reason">Reason for the debit note</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="dn-reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dn-reason-notes">Explanation (shown on the note)</Label>
              <Textarea id="dn-reason-notes" value={reasonNotes} onChange={(e) => setReasonNotes(e.target.value)} rows={3} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Additional charges</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add line
              </Button>
            </div>
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_70px_110px_36px] gap-2 items-end">
                <div className="space-y-1">
                  <Label htmlFor={`dn-item-${item.id}`}>Description</Label>
                  <Input id={`dn-item-${item.id}`} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dn-qty-${item.id}`}>Qty</Label>
                  <Input id={`dn-qty-${item.id}`} type="number" min="0" step="0.01" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dn-price-${item.id}`}>Unit price</Label>
                  <Input id={`dn-price-${item.id}`} type="number" min="0" step="0.01" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove line">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="dn-tax-label">Tax label</Label>
                <Input id="dn-tax-label" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-tax">Tax % on the additional amount</Label>
                <Input id="dn-tax" type="number" min="0" max="100" step="0.1" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dn-pay-note">Payment note</Label>
                <Input id="dn-pay-note" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} />
              </div>
            </div>
          </Card>
        </div>

        <section className="space-y-4" aria-label="Debit note preview">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> Live preview
            </h2>
            <Button type="button" onClick={downloadPdf}>
              <Download className="h-4 w-4 mr-2" /> Download PDF debit note
            </Button>
          </div>
          <div className="border rounded-lg bg-white text-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-2xl font-bold tracking-wide">DEBIT NOTE</p>
                <p className="text-sm text-slate-600">
                  Additional amount owed against an earlier invoice.
                </p>
              </div>
              <div className="text-sm text-right">
                <p>
                  <span className="font-semibold">Debit Note No:</span> {debitNoteNumber || '—'}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {formatDate(debitNoteDate)}
                </p>
                <p>
                  <span className="font-semibold">Due:</span> {formatDate(dueDate)}
                </p>
                <p>
                  <span className="font-semibold">Against invoice:</span>{' '}
                  {originalInvoiceNumber || '—'} dated {formatDate(originalInvoiceDate)}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-1">From</p>
                <p className="font-medium">{sellerName || 'Your Business'}</p>
                {sellerAddress ? <p className="whitespace-pre-line">{sellerAddress}</p> : null}
                {sellerEmail ? <p>{sellerEmail}</p> : null}
              </div>
              <div>
                <p className="font-semibold mb-1">To</p>
                <p className="font-medium">{customerName || 'Customer'}</p>
                {customerAddress ? (
                  <p className="whitespace-pre-line">{customerAddress}</p>
                ) : null}
              </div>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Reason: {reason}</p>
              {reasonNotes ? <p className="text-slate-600 mt-1">{reasonNotes}</p> : null}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 font-semibold">Description</th>
                  <th className="py-2 font-semibold text-right">Qty</th>
                  <th className="py-2 font-semibold text-right">Unit price</th>
                  <th className="py-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2">{item.description || 'Item'}</td>
                    <td className="py-2 text-right">{parseAmount(item.qty)}</td>
                    <td className="py-2 text-right">
                      {formatMoney(parseAmount(item.price), currency)}
                    </td>
                    <td className="py-2 text-right">
                      {formatMoney(parseAmount(item.qty) * parseAmount(item.price), currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ml-auto w-64 text-sm space-y-1.5">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(totals.subtotal, currency)}</span>
              </p>
              {totals.taxRate > 0 && (
                <p className="flex justify-between">
                  <span>
                    {taxLabel} ({totals.taxRate}%)
                  </span>
                  <span>{formatMoney(totals.taxAmount, currency)}</span>
                </p>
              )}
              <p className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total additional amount due</span>
                <span>{formatMoney(totals.totalDebit, currency)}</span>
              </p>
            </div>
            {paymentNote ? <p className="text-sm text-slate-600">{paymentNote}</p> : null}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" /> Need to reduce an invoice instead? Use the free
            Credit Note Generator.
          </p>
        </section>
      </div>

      <AdSlot id="debit-note-generator-after-tool" format="horizontal-banner" />

      <section className="prose prose-neutral dark:prose-invert max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold">What a debit note is, and when you must issue one</h2>
        <p>
          A debit note is a formal correction document a seller sends when an invoice that has
          already been issued turns out to be too low. The original invoice stays exactly as it
          was — same number, same date, same amounts — and the debit note adds a second,
          separately numbered document that increases the customer&rsquo;s balance by the
          difference. Together, invoice plus debit note equal the true value of the sale. This
          two-document trail is what accountants and tax auditors expect: a billing history
          where nothing is ever quietly edited after the fact.
        </p>
        <p>
          The everyday triggers are mundane. A warehouse ships twelve cartons against an
          invoice written for ten. A courier charge that the customer agreed to bear never
          made it onto the bill. A price was keyed from last quarter&rsquo;s rate card. Tax was
          charged at the standard rate when a higher rate applied, or an agreed surcharge for
          urgent work was forgotten. In each case the goods or services were genuinely
          supplied and genuinely owed — only the paperwork under-recorded them. The debit note
          fixes the paperwork.
        </p>
        <h2 className="text-2xl font-bold">Debit note vs credit note vs supplementary invoice</h2>
        <p>
          A credit note is the mirror image: it reduces a balance after returns, damage or
          overcharging, and it is also issued by the seller. Some businesses instead raise a
          supplementary or additional invoice for the missed amount. That can work commercially,
          but it blurs the trail — the customer&rsquo;s system now holds two invoices for one
          delivery, and matching payments, stock and tax across them is harder. A debit note
          keeps the correction explicitly tied to the single original invoice it adjusts,
          which is why most accounting standards and tax administrations treat it as the
          cleaner instrument. Terminology also varies by side of the transaction: a buyer who
          discovers an undercharge may notify the seller with their own debit note as a
          request — but the seller&rsquo;s document is the one that legally raises the amount
          owed.
        </p>
        <h2 className="text-2xl font-bold">What a debit note must contain</h2>
        <p>
          A defensible debit note carries: its own sequential number from a separate debit-note
          series; the issue date and a payment due date; the seller&rsquo;s and buyer&rsquo;s
          names and addresses; the number and date of the original invoice — without this
          link, the note is just an unexplained extra bill; a plain-language reason for the
          increase; an itemised list of the additional goods, services or charges with
          quantities and prices; the tax charged on the additional amount, at the same rate as
          the original invoice; and the total additional amount due. If your original invoice
          carried tax registration numbers, repeat them here too. Where the tax was the
          problem — a short-charged rate — state the original rate, the correct rate and the
          difference being billed, so the customer&rsquo;s tax team can mirror the adjustment.
        </p>
        <h2 className="text-2xl font-bold">Bookkeeping, numbering and disputes</h2>
        <p>
          Keep debit notes in their own numbered series (DN-001, DN-002…) rather than mixing
          them into the invoice sequence, and record them in the same period you issue them —
          the additional output tax belongs to that period in most systems. Because a debit
          note asks a customer for more than the original bill, it is the document most likely
          to be queried: attach the evidence when you send it (the signed delivery note
          showing twelve cartons, the order email agreeing to freight, the corrected rate
          card) and reference the agreed facts in the explanation field. A customer who can
          see exactly why the extra amount is owed pays it; a customer who receives a bare
          number files it under disputes. Finally, never use a debit note to backdate a price
          increase the customer never agreed to — it corrects billing errors, nothing more,
          and using it as a renegotiation tool destroys trust and, in many jurisdictions,
          simply does not hold up.
        </p>
      </section>

      <AdSlot id="debit-note-generator-in-content" format="in-article" />

      <section className="max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          }}
        />
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="text-muted-foreground mt-1">{faq.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
