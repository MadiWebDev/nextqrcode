'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
import { Download, FileText, Plus, QrCode, Receipt, Trash2 } from 'lucide-react';
import JsPDF from 'jspdf';
import { toDataURL } from 'qrcode';

interface LineItem {
  id: number;
  description: string;
  qty: string;
  price: string;
}

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

function parseAmount(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const faqs = [
  {
    question: 'Is this invoice generator really free, and do I need an account?',
    answer:
      'Yes. The tool is completely free and needs no account, no sign-up and no installation. Everything runs in your browser: you type the invoice details, watch the totals update, and download a finished PDF. Nothing is uploaded to a server, so client names, prices and bank details stay on your own device.',
  },
  {
    question: 'Can I charge GST, VAT or sales tax on an invoice here?',
    answer:
      'Yes. Set any tax rate from 0 to 100 percent and rename the tax label to match your country, for example GST in Pakistan, India, Canada and Australia, VAT in the United Kingdom, the European Union and the UAE, or Sales Tax in the United States. The tax is calculated on the discounted subtotal, and both the rate and the amount appear as separate lines in the preview and in the PDF.',
  },
  {
    question: 'What payment terms should I put on a freelance invoice?',
    answer:
      'Net 14 and Net 30 are the most common terms, meaning payment is due 14 or 30 days after the issue date. Many freelancers use Net 7 or payment on receipt for small jobs under 500 dollars. Whatever you choose, write the exact due date on the invoice, repeat it in the notes, and state any late fee clearly, for example 1.5 percent per month on overdue balances where local law allows it.',
  },
  {
    question: 'How does the optional payment QR code work?',
    answer:
      'Tick the payment QR option and paste a payment link, a wallet address, or your IBAN and account details as plain text. The tool turns exactly that text into a QR code, shows it in the live preview, and prints it on the PDF. Your client scans the code with a phone camera and lands on your payment page or sees your bank details. A QR code holds roughly 3 KB of text, so a short payment link works better than a long paragraph of instructions.',
  },
  {
    question: 'How should I number my invoices?',
    answer:
      'Use a simple, unbroken sequence such as INV-001, INV-002 and INV-003, or a year-based sequence such as 2026-001. Never reuse a number and never delete a number from the sequence: tax authorities in most countries expect invoice numbers to run in order with no gaps. If an invoice is cancelled, keep the number and mark the document as cancelled instead of reusing it for another client.',
  },
];

export default function InvoiceGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [defaultDue] = useState(() =>
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const [sellerName, setSellerName] = useState('Ayesha Khan Design Studio');
  const [sellerAddress, setSellerAddress] = useState(
    '14-B Main Boulevard, Gulberg III, Lahore, Pakistan'
  );
  const [sellerEmail, setSellerEmail] = useState('billing@example.com');
  const [sellerPhone, setSellerPhone] = useState('+92 300 1234567');
  const [buyerName, setBuyerName] = useState('Northwind Traders');
  const [buyerAddress, setBuyerAddress] = useState(
    'Office 402, Trade Centre, Karachi, Pakistan'
  );
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(defaultDue);
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: 'Website design — homepage and inner pages', qty: '1', price: '850' },
    { id: 2, description: 'Copywriting, per hour', qty: '6', price: '40' },
  ]);
  const nextId = useRef(3);
  const [discountPercent, setDiscountPercent] = useState('0');
  const [taxPercent, setTaxPercent] = useState('0');
  const [taxLabel, setTaxLabel] = useState('GST');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState(
    'Payment due within 14 days of the issue date. Please quote the invoice number with your payment. Thank you for your business.'
  );
  const [paymentQrEnabled, setPaymentQrEnabled] = useState(false);
  const [paymentText, setPaymentText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const text = paymentText.trim();
    if (!paymentQrEnabled || !text) {
      return;
    }
    let cancelled = false;
    toDataURL(text, { width: 280, margin: 1 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [paymentQrEnabled, paymentText]);
  const effectiveQrDataUrl = paymentQrEnabled && paymentText.trim() ? qrDataUrl : '';

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseAmount(item.qty) * parseAmount(item.price),
      0
    );
    const discountRate = Math.min(Math.max(parseAmount(discountPercent), 0), 100);
    const discountAmount = (subtotal * discountRate) / 100;
    const taxable = subtotal - discountAmount;
    const taxRate = Math.min(Math.max(parseAmount(taxPercent), 0), 100);
    const taxAmount = (taxable * taxRate) / 100;
    return {
      subtotal,
      discountRate,
      discountAmount,
      taxRate,
      taxAmount,
      grandTotal: taxable + taxAmount,
    };
  }, [items, discountPercent, taxPercent]);

  const updateItem = (id: number, field: keyof LineItem, value: string) => {
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
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 18;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 18;
      }
    };

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 15, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${invoiceNumber || 'INV-001'}`, pageWidth - 15, y, { align: 'right' });
    y += 8;
    doc.setFontSize(10);
    doc.text(`Issue date: ${issueDate}`, pageWidth - 15, y, { align: 'right' });
    y += 5;
    doc.text(`Due date: ${dueDate}`, pageWidth - 15, y, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('From', 15, y);
    doc.text('Bill to', 110, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const sellerLines = doc.splitTextToSize(
      [sellerName, sellerAddress, sellerEmail, sellerPhone].filter(Boolean).join('\n'),
      85
    ) as string[];
    const buyerLines = doc.splitTextToSize(
      [buyerName, buyerAddress].filter(Boolean).join('\n'),
      85
    ) as string[];
    const blockLines = Math.max(sellerLines.length, buyerLines.length);
    ensureSpace(blockLines * 5 + 10);
    sellerLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
    buyerLines.forEach((line, index) => doc.text(line, 110, y + index * 5));
    y += blockLines * 5 + 8;

    doc.setFont('helvetica', 'bold');
    ensureSpace(10);
    doc.text('Description', 15, y);
    doc.text('Qty', 115, y, { align: 'right' });
    doc.text('Unit price', 150, y, { align: 'right' });
    doc.text('Amount', pageWidth - 15, y, { align: 'right' });
    y += 2;
    doc.line(15, y, pageWidth - 15, y);
    y += 6;
    doc.setFont('helvetica', 'normal');

    items.forEach((item) => {
      const amount = parseAmount(item.qty) * parseAmount(item.price);
      const descriptionLines = doc.splitTextToSize(item.description || '-', 95) as string[];
      const rowHeight = Math.max(descriptionLines.length * 5, 5);
      ensureSpace(rowHeight + 2);
      descriptionLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
      doc.text(String(parseAmount(item.qty)), 115, y, { align: 'right' });
      doc.text(formatMoney(parseAmount(item.price), currency), 150, y, {
        align: 'right',
      });
      doc.text(formatMoney(amount, currency), pageWidth - 15, y, { align: 'right' });
      y += rowHeight + 2;
    });

    y += 4;
    const totalRows: Array<[string, string]> = [
      ['Subtotal', formatMoney(totals.subtotal, currency)],
      [
        `Discount (${totals.discountRate}%)`,
        `-${formatMoney(totals.discountAmount, currency)}`,
      ],
      [
        `${taxLabel || 'Tax'} (${totals.taxRate}%)`,
        formatMoney(totals.taxAmount, currency),
      ],
      ['Grand total', formatMoney(totals.grandTotal, currency)],
    ];
    totalRows.forEach(([label, value], index) => {
      ensureSpace(7);
      if (index === totalRows.length - 1) doc.setFont('helvetica', 'bold');
      doc.text(label, 120, y);
      doc.text(value, pageWidth - 15, y, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 6;
    });

    if (notes.trim()) {
      y += 4;
      const noteLines = doc.splitTextToSize(`Notes: ${notes.trim()}`, pageWidth - 30) as string[];
      ensureSpace(noteLines.length * 5 + 4);
      noteLines.forEach((line) => {
        doc.text(line, 15, y);
        y += 5;
      });
    }

    if (effectiveQrDataUrl) {
      y += 6;
      ensureSpace(48);
      doc.setFont('helvetica', 'bold');
      doc.text('Scan to pay', 15, y);
      y += 4;
      doc.addImage(effectiveQrDataUrl, 'PNG', 15, y, 38, 38);
      doc.setFont('helvetica', 'normal');
      const paymentLines = doc.splitTextToSize(paymentText.trim(), 120) as string[];
      paymentLines.forEach((line, index) => doc.text(line, 58, y + 8 + index * 5));
      y += 42;
    }

    doc.save(`${invoiceNumber || 'invoice'}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'Invoice Generator', href: '/invoice-generator' }]} />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Receipt className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Invoice Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Create a clean, professional invoice in about two minutes, without a spreadsheet,
          a word processor template, or an accounting subscription. Type in who you are,
          who you are billing, and what you sold, and this tool adds up the line items,
          applies your discount and your GST, VAT or sales tax, and produces a print-ready
          PDF with a running total you can trust. Add an optional payment QR code and your
          client can pay straight from the document.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Seller and buyer</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seller-name">Your name or business name</Label>
                <Input
                  id="seller-name"
                  value={sellerName}
                  onChange={(event) => setSellerName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-name">Bill to — client name</Label>
                <Input
                  id="buyer-name"
                  value={buyerName}
                  onChange={(event) => setBuyerName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-address">Your address</Label>
                <Textarea
                  id="seller-address"
                  value={sellerAddress}
                  onChange={(event) => setSellerAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-address">Client address</Label>
                <Textarea
                  id="buyer-address"
                  value={buyerAddress}
                  onChange={(event) => setBuyerAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-email">Your email</Label>
                <Input
                  id="seller-email"
                  type="email"
                  value={sellerEmail}
                  onChange={(event) => setSellerEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-phone">Your phone</Label>
                <Input
                  id="seller-phone"
                  value={sellerPhone}
                  onChange={(event) => setSellerPhone(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Invoice details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice number</Label>
                <Input
                  id="invoice-number"
                  value={invoiceNumber}
                  onChange={(event) => setInvoiceNumber(event.target.value)}
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
                <Label htmlFor="due-date">Due date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Line items</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4" />
                Add item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-12 sm:col-span-5 space-y-1">
                    <Label htmlFor={`item-desc-${item.id}`}>
                      Description {index + 1}
                    </Label>
                    <Input
                      id={`item-desc-${item.id}`}
                      value={item.description}
                      onChange={(event) =>
                        updateItem(item.id, 'description', event.target.value)
                      }
                      placeholder="Service or product"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2 space-y-1">
                    <Label htmlFor={`item-qty-${item.id}`}>Qty</Label>
                    <Input
                      id={`item-qty-${item.id}`}
                      type="number"
                      min="0"
                      step="any"
                      value={item.qty}
                      onChange={(event) => updateItem(item.id, 'qty', event.target.value)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 space-y-1">
                    <Label htmlFor={`item-price-${item.id}`}>Unit price</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="number"
                      min="0"
                      step="any"
                      value={item.price}
                      onChange={(event) =>
                        updateItem(item.id, 'price', event.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-sm font-medium pb-2">
                    {formatMoney(
                      parseAmount(item.qty) * parseAmount(item.price),
                      currency
                    )}
                  </div>
                  <div className="col-span-1 pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={discountPercent}
                  onChange={(event) => setDiscountPercent(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-label">Tax label</Label>
                <Input
                  id="tax-label"
                  value={taxLabel}
                  onChange={(event) => setTaxLabel(event.target.value)}
                  placeholder="GST, VAT or Sales tax"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={taxPercent}
                  onChange={(event) => setTaxPercent(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes and payment terms</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                id="payment-qr"
                type="checkbox"
                className="h-4 w-4"
                checked={paymentQrEnabled}
                onChange={(event) => setPaymentQrEnabled(event.target.checked)}
              />
              <Label htmlFor="payment-qr" className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                Add a payment QR code to this invoice
              </Label>
            </div>
            {paymentQrEnabled ? (
              <div className="space-y-2">
                <Label htmlFor="payment-text">Payment link, wallet address or IBAN</Label>
                <Input
                  id="payment-text"
                  value={paymentText}
                  onChange={(event) => setPaymentText(event.target.value)}
                  placeholder="https://your-payment-link.example/pay or PK36 MEZN 0001 2345 6789 0123"
                />
                <p className="text-xs text-muted-foreground">
                  The QR code encodes exactly the text above, character for character.
                  Nothing is shortened, tracked or redirected.
                </p>
              </div>
            ) : null}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Live preview
            </h2>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold">INVOICE</p>
                  <p className="text-sm text-slate-600">{invoiceNumber || 'INV-001'}</p>
                </div>
                <div className="text-sm text-right text-slate-600">
                  <p>Issued: {issueDate}</p>
                  <p>Due: {dueDate}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">From</p>
                  <p>{sellerName}</p>
                  <p className="whitespace-pre-line text-slate-600">{sellerAddress}</p>
                  <p className="text-slate-600">{sellerEmail}</p>
                  <p className="text-slate-600">{sellerPhone}</p>
                </div>
                <div>
                  <p className="font-semibold">Bill to</p>
                  <p>{buyerName}</p>
                  <p className="whitespace-pre-line text-slate-600">{buyerAddress}</p>
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
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-2 pr-3">{item.description || '-'}</td>
                        <td className="py-2 pr-3 text-right">{parseAmount(item.qty)}</td>
                        <td className="py-2 pr-3 text-right">
                          {formatMoney(parseAmount(item.price), currency)}
                        </td>
                        <td className="py-2 text-right">
                          {formatMoney(
                            parseAmount(item.qty) * parseAmount(item.price),
                            currency
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ml-auto max-w-xs w-full text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(totals.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({totals.discountRate}%)</span>
                  <span>-{formatMoney(totals.discountAmount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {taxLabel || 'Tax'} ({totals.taxRate}%)
                  </span>
                  <span>{formatMoney(totals.taxAmount, currency)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 text-base">
                  <span>Grand total</span>
                  <span>{formatMoney(totals.grandTotal, currency)}</span>
                </div>
              </div>
              {notes.trim() ? (
                <p className="text-sm text-slate-600 whitespace-pre-line">{notes}</p>
              ) : null}
              {effectiveQrDataUrl ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={effectiveQrDataUrl} alt="Payment QR code" className="w-28 h-28" />
                  <div className="text-sm">
                    <p className="font-semibold">Scan to pay</p>
                    <p className="text-slate-600 break-all">{paymentText}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <Button type="button" onClick={downloadPdf} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download invoice as PDF
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="invoice-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How it works, step by step</h2>
        <p className="text-muted-foreground leading-relaxed">
          An invoice is a simple document with a strict job: it tells a buyer exactly what
          was supplied, what it costs, what tax applies, and when and how to pay. This
          generator follows the same order a bookkeeper would, so the finished PDF reads
          the way clients and accountants expect.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Add your details once.</strong> Enter your
            name or business name, address, email and phone number. These appear in the
            From block at the top of the invoice, which is also where a client looks when
            they need to contact you about payment.
          </li>
          <li>
            <strong className="text-foreground">Name the buyer.</strong> Add the client
            name and address exactly as they appear on their own records. For a registered
            company, use the full legal name rather than a trading nickname, because their
            accounts team will match your invoice against a purchase order or contract.
          </li>
          <li>
            <strong className="text-foreground">Set the number and dates.</strong> Give
            the invoice the next number in your sequence, set the issue date to today, and
            pick a due date that matches your agreed terms — seven, fourteen or thirty
            days later are the usual choices.
          </li>
          <li>
            <strong className="text-foreground">List each item separately.</strong> Add
            one row per product or service, with a clear description, a quantity and a
            unit price. Ten hours of design work at 40 per hour is far easier for a client
            to approve than one unexplained line that says services, 400.
          </li>
          <li>
            <strong className="text-foreground">Apply discount and tax in that order.</strong>{' '}
            Enter a discount percentage if you agreed one, then set your tax rate and
            label. The tool discounts the subtotal first and charges tax on what remains,
            which is the order most tax rules require, and shows every step in the totals
            block so there is nothing hidden.
          </li>
          <li>
            <strong className="text-foreground">Check the preview, then download.</strong>{' '}
            Read the live preview once, top to bottom, then download the PDF and send it
            by email. Keep your own copy with the same file name as the invoice number so
            you can find it at tax time.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Who uses an invoice generator like this?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Freelancers are the heaviest users: designers, writers, developers, translators
          and consultants who bill two to twenty clients a month and cannot justify a full
          accounting package for that volume. A generator gives them a numbered, dated,
          correctly totalled document in minutes, and the payment QR shortens the gap
          between sending the invoice and seeing the money arrive.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Small shops and tradespeople use it differently. A phone repair shop in Lahore, a
          bakery taking a wedding order in Dubai, or an electrician in Manchester finishing
          a rewiring job all need the same thing on the spot: a written record of parts and
          labour, with GST or VAT shown separately, that the customer can keep for warranty
          and expenses. Online sellers and tutors use it for one-off sales that never pass
          through a checkout — a bulk order arranged over chat, a month of lessons paid in
          advance, or a deposit on a booking. In each case the invoice is the proof of the
          deal for both sides, and it costs nothing to issue properly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Features and specifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Currencies</td>
                <td className="py-2 px-3 text-muted-foreground">
                  PKR, USD, EUR, GBP, INR and AED, printed on every amount
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Line items</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Unlimited rows, each with description, quantity and unit price
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Discount</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Percentage discount, applied before tax
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Tax</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Any rate from 0 to 100 percent, with an editable GST, VAT or Sales tax
                  label
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Output</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Multi-page PDF — long invoices flow onto extra pages automatically
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Payment QR</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Optional QR encoding your exact payment link, wallet address or IBAN,
                  shown in the preview and printed on the PDF
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Privacy</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Fully in-browser. No account, no upload, no copy of your invoice kept by
                  this site
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Totals are recalculated on every keystroke: the subtotal is the sum of quantity
          times unit price across all rows, the discount is taken off that subtotal, tax is
          charged on the discounted amount, and the grand total is the result. Amounts are
          shown with two decimal places and thousand separators, so an invoice for 12,500
          never reads as 12500.00 buried in a wall of digits.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Practical tips for invoices that get paid faster</h2>
        <p className="text-muted-foreground leading-relaxed">
          Send the invoice the day the work is delivered, not at the end of the month.
          Studies of small-business payments consistently show that invoices sent within 24
          hours of delivery are paid days sooner than invoices batched monthly, simply
          because the work is still fresh in the mind of the client. Address the invoice to
          a named person or accounts department where you can, and use the exact due date —
          Friday 28 November — rather than a vague phrase such as payment on receipt, which
          different readers interpret differently.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Describe work in the language of the buyer. Hours booked, pages designed and
          parts fitted are easy to approve; internal job codes are not. If you are
          registered for GST or VAT, add your registration number to the seller address
          block so the buyer can reclaim the tax, and keep the rate consistent with your
          registration — in Pakistan the standard GST rate on goods is 18 percent, in the
          United Kingdom VAT is commonly 20 percent, and in the UAE VAT is 5 percent, but rates
          and exemptions vary by trade and province, so check your own obligation before
          you bill. Finally, keep a simple register — even a notebook list of number,
          client, amount and date paid — and chase politely on the due date, again a week
          later, and again at thirty days. Most late payment is forgetfulness, not refusal,
          and a prompt, courteous reminder with the invoice attached again solves most of
          it.
        </p>
      </section>

      <AdSlot id="invoice-generator-in-content" format="in-article" />

      <section className="space-y-4">
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
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="border rounded-lg p-4 space-y-2">
              <dt className="font-semibold">{faq.question}</dt>
              <dd className="text-muted-foreground leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
