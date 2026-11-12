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
import { Download, FileText, Plus, Receipt, Trash2, Undo2 } from 'lucide-react';
import JsPDF from 'jspdf';

interface CreditedItem {
  id: number;
  description: string;
  qty: string;
  price: string;
}

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

const reasons = [
  'Goods returned',
  'Damaged goods',
  'Pricing error',
  'Discount after sale',
  'Service not rendered',
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

const faqs = [
  {
    question: 'Can I just refund the money without issuing a credit note?',
    answer:
      'You can refund the money, but you should still issue the credit note. The refund is the movement of cash; the credit note is the accounting and tax document that explains why the original sale was reduced. Without it, your sales records still show the full invoice value, your stock may be wrong if goods came back, and the GST or VAT you charged on the original invoice stays overstated. Auditors and customer accounts teams both ask for the credit note, not just proof of the bank transfer.',
  },
  {
    question: 'Does the customer need to sign a credit note?',
    answer:
      'In most countries a credit note does not legally require a customer signature, because it is issued by the seller and reduces, rather than creates, an amount owed. What matters is that the customer receives a copy and that you can prove it was sent, for example by email. Some larger companies do ask for an acknowledgement or a signed copy before they adjust their own payable records, so if a customer requests one, signing and returning a copy is a reasonable courtesy, not a legal burden.',
  },
  {
    question: 'Can a credit note be worth more than the original invoice?',
    answer:
      'No. A credit note corrects a specific earlier invoice, so its total should never exceed the value of that invoice, including the tax charged on it. If you credited the full invoice by mistake or the customer is owed extra compensation beyond the invoice value, handle the excess separately — for example with a separate payment or goodwill gesture — rather than inflating the credit note. Keeping the credit at or below the original invoice value keeps your tax adjustment clean and defensible.',
  },
  {
    question: 'How long after an invoice can I issue a credit note?',
    answer:
      'There is no single worldwide deadline, but tax rules in many countries tie the adjustment to a time limit or to the tax period in which the correction is reported. In practice, issue the credit note as soon as the return, damage or error is agreed — ideally in the same month as the original invoice, and almost always within the same financial year. The longer you wait, the harder it becomes for both sides to match the credit to the sale, reclaim the tax correctly, and close the period.',
  },
  {
    question: 'What is the difference between a credit note and a revised invoice?',
    answer:
      'A credit note leaves the original invoice untouched and adds a second document that reduces it, so the audit trail shows both the original charge and the correction. A revised or corrected invoice replaces the original, which many tax systems only allow before the original has been reported or paid. Once an invoice has been sent, booked and especially once tax has been filed on it, the credit note is usually the correct tool, because deleting or rewriting the original breaks the numbered sequence accountants rely on.',
  },
];

export default function CreditNoteGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [fortnightAgo] = useState(() =>
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const [sellerName, setSellerName] = useState('Brightline Traders');
  const [sellerAddress, setSellerAddress] = useState(
    '22 Shahrah-e-Faisal, Karachi, Pakistan'
  );
  const [sellerEmail, setSellerEmail] = useState('accounts@brightline.example');
  const [customerName, setCustomerName] = useState('Northwind Traders');
  const [customerAddress, setCustomerAddress] = useState(
    'Office 402, Trade Centre, Karachi, Pakistan'
  );
  const [creditNoteNumber, setCreditNoteNumber] = useState('CN-001');
  const [creditNoteDate, setCreditNoteDate] = useState(today);
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState('INV-1042');
  const [originalInvoiceDate, setOriginalInvoiceDate] = useState(fortnightAgo);
  const [currency, setCurrency] = useState('PKR');
  const [reason, setReason] = useState('Goods returned');
  const [reasonNotes, setReasonNotes] = useState(
    'Customer returned part of the October delivery after inspection. Goods were received back into stock in resalable condition.'
  );
  const [items, setItems] = useState<CreditedItem[]>([
    { id: 1, description: 'Ceiling fan 56 inch — returned, unopened', qty: '2', price: '8500' },
    { id: 2, description: 'LED panel light 24W — wrong size supplied', qty: '4', price: '1250' },
  ]);
  const nextId = useRef(3);
  const [taxPercent, setTaxPercent] = useState('18');
  const [taxLabel, setTaxLabel] = useState('GST');
  const [adjustmentNote, setAdjustmentNote] = useState(
    'This credit will be applied against invoice INV-1042. Any balance remaining after the credit will be refunded to the original payment method.'
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseAmount(item.qty) * parseAmount(item.price),
      0
    );
    const taxRate = Math.min(Math.max(parseAmount(taxPercent), 0), 100);
    const taxAmount = (subtotal * taxRate) / 100;
    return { subtotal, taxRate, taxAmount, totalCredit: subtotal + taxAmount };
  }, [items, taxPercent]);

  const updateItem = (id: number, field: keyof CreditedItem, value: string) => {
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
    doc.text('CREDIT NOTE', 15, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${creditNoteNumber || 'CN-001'}`, pageWidth - 15, y, { align: 'right' });
    y += 8;
    doc.setFontSize(10);
    doc.text(`Credit note date: ${creditNoteDate}`, pageWidth - 15, y, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('From', 15, y);
    doc.text('Credit to', 110, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const sellerLines = doc.splitTextToSize(
      [sellerName, sellerAddress, sellerEmail].filter(Boolean).join('\n'),
      85
    ) as string[];
    const customerLines = doc.splitTextToSize(
      [customerName, customerAddress].filter(Boolean).join('\n'),
      85
    ) as string[];
    const blockLines = Math.max(sellerLines.length, customerLines.length);
    ensureSpace(blockLines * 5 + 10);
    sellerLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
    customerLines.forEach((line, index) => doc.text(line, 110, y + index * 5));
    y += blockLines * 5 + 8;

    doc.setFont('helvetica', 'bold');
    ensureSpace(16);
    doc.text(
      `Against invoice: ${originalInvoiceNumber || '-'} dated ${originalInvoiceDate || '-'}`,
      15,
      y
    );
    y += 6;
    doc.text(`Reason: ${reason}`, 15, y);
    y += 8;
    doc.setFont('helvetica', 'normal');

    if (reasonNotes.trim()) {
      const reasonLines = doc.splitTextToSize(reasonNotes.trim(), pageWidth - 30) as string[];
      ensureSpace(reasonLines.length * 5 + 4);
      reasonLines.forEach((line) => {
        doc.text(line, 15, y);
        y += 5;
      });
      y += 4;
    }

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
      doc.text(formatMoney(parseAmount(item.price), currency), 150, y, { align: 'right' });
      doc.text(formatMoney(amount, currency), pageWidth - 15, y, { align: 'right' });
      y += rowHeight + 2;
    });

    y += 4;
    const totalRows: Array<[string, string, boolean]> = [
      ['Subtotal credited', formatMoney(totals.subtotal, currency), false],
      [
        `${taxLabel || 'Tax'} credit (${totals.taxRate}%)`,
        formatMoney(totals.taxAmount, currency),
        false,
      ],
      ['TOTAL CREDIT', formatMoney(totals.totalCredit, currency), true],
    ];
    totalRows.forEach(([label, value, bold]) => {
      ensureSpace(7);
      if (bold) doc.setFont('helvetica', 'bold');
      doc.text(label, 120, y);
      doc.text(value, pageWidth - 15, y, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 6;
    });

    y += 4;
    const effectLines = doc.splitTextToSize(
      `This credit note reduces the amount owed by ${customerName || 'the customer'} on invoice ${originalInvoiceNumber || '-'} by ${formatMoney(totals.totalCredit, currency)}.`,
      pageWidth - 30
    ) as string[];
    ensureSpace(effectLines.length * 5 + 4);
    effectLines.forEach((line) => {
      doc.text(line, 15, y);
      y += 5;
    });

    if (adjustmentNote.trim()) {
      y += 3;
      const noteLines = doc.splitTextToSize(adjustmentNote.trim(), pageWidth - 30) as string[];
      ensureSpace(noteLines.length * 5 + 4);
      noteLines.forEach((line) => {
        doc.text(line, 15, y);
        y += 5;
      });
    }

    doc.save(`${creditNoteNumber || 'credit-note'}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[{ label: 'Credit Note Generator', href: '/credit-note-generator' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Undo2 className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Credit Note Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          A sale does not always end the way the invoice said it would. Goods come back,
          prices turn out to be wrong, or a service is cancelled after billing — and when
          that happens you need a credit note, not a quietly edited invoice. This generator
          builds a proper credit note tied to the original invoice number and date, with
          the reason, the credited items and the tax shown separately, and downloads it as
          a clean PDF you can send to your customer and keep for your own records.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Seller and customer</h2>
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
                <Label htmlFor="customer-name">Customer name</Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
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
                <Label htmlFor="customer-address">Customer address</Label>
                <Textarea
                  id="customer-address"
                  value={customerAddress}
                  onChange={(event) => setCustomerAddress(event.target.value)}
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
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Credit note details</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credit-note-number">Credit note number</Label>
                <Input
                  id="credit-note-number"
                  value={creditNoteNumber}
                  onChange={(event) => setCreditNoteNumber(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit-note-date">Credit note date</Label>
                <Input
                  id="credit-note-date"
                  type="date"
                  value={creditNoteDate}
                  onChange={(event) => setCreditNoteDate(event.target.value)}
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
            <h2 className="text-lg font-semibold">Original invoice reference</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every credit note must point back to the invoice it corrects. Enter the
              original invoice number and its date exactly as they appeared on that
              invoice — this reference is what lets your customer, your accountant and the
              tax authority match the credit to the original sale.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="original-invoice-number">Original invoice number</Label>
                <Input
                  id="original-invoice-number"
                  value={originalInvoiceNumber}
                  onChange={(event) => setOriginalInvoiceNumber(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original-invoice-date">Original invoice date</Label>
                <Input
                  id="original-invoice-date"
                  type="date"
                  value={originalInvoiceDate}
                  onChange={(event) => setOriginalInvoiceDate(event.target.value)}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for the credit</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="reason" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason-notes">Reason notes</Label>
                <Textarea
                  id="reason-notes"
                  value={reasonNotes}
                  onChange={(event) => setReasonNotes(event.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Credited items</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4" />
                Add item
              </Button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              List the goods or services being credited back, at the same quantities and
              unit prices used on the original invoice. Partial credits are fine — credit
              only the lines that changed.
            </p>
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
                      placeholder="Goods or service being credited"
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
            <div className="grid sm:grid-cols-2 gap-4">
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
              <Label htmlFor="adjustment-note">Adjustment note</Label>
              <Textarea
                id="adjustment-note"
                value={adjustmentNote}
                onChange={(event) => setAdjustmentNote(event.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Say how the credit will be settled: applied against the original invoice,
                held against a future order, or refunded to the original payment method.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Live preview
            </h2>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    <Receipt className="w-6 h-6" />
                    CREDIT NOTE
                  </p>
                  <p className="text-sm text-slate-600">{creditNoteNumber || 'CN-001'}</p>
                </div>
                <div className="text-sm text-right text-slate-600">
                  <p>Date: {creditNoteDate}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">From</p>
                  <p>{sellerName}</p>
                  <p className="whitespace-pre-line text-slate-600">{sellerAddress}</p>
                  <p className="text-slate-600">{sellerEmail}</p>
                </div>
                <div>
                  <p className="font-semibold">Credit to</p>
                  <p>{customerName}</p>
                  <p className="whitespace-pre-line text-slate-600">{customerAddress}</p>
                </div>
              </div>
              <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3 text-sm space-y-1">
                <p className="font-semibold">
                  Against invoice: {originalInvoiceNumber || '-'} dated{' '}
                  {originalInvoiceDate || '-'}
                </p>
                <p>
                  <span className="font-semibold">Reason:</span> {reason}
                </p>
                {reasonNotes.trim() ? (
                  <p className="text-slate-600 whitespace-pre-line">{reasonNotes}</p>
                ) : null}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 pr-3">Description</th>
                      <th className="py-2 pr-3 text-right">Qty</th>
                      <th className="py-2 pr-3 text-right">Unit price</th>
                      <th className="py-2 text-right">Amount credited</th>
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
                  <span>Subtotal credited</span>
                  <span>{formatMoney(totals.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {taxLabel || 'Tax'} credit ({totals.taxRate}%)
                  </span>
                  <span>{formatMoney(totals.taxAmount, currency)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 text-base">
                  <span>TOTAL CREDIT</span>
                  <span>{formatMoney(totals.totalCredit, currency)}</span>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                This credit note reduces the amount owed by {customerName || 'the customer'}{' '}
                on invoice {originalInvoiceNumber || '-'} by{' '}
                {formatMoney(totals.totalCredit, currency)}. It is a correction to that
                invoice, not a new charge.
              </p>
              {adjustmentNote.trim() ? (
                <p className="text-sm text-slate-600 whitespace-pre-line">{adjustmentNote}</p>
              ) : null}
            </div>
            <Button type="button" onClick={downloadPdf} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download credit note as PDF
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="credit-note-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What a credit note is, and when you must issue one</h2>
        <p className="text-muted-foreground leading-relaxed">
          A credit note is a formal document a seller issues to reduce the amount a buyer
          owes on an earlier invoice. It does not erase the original invoice and it does not
          pretend the sale never happened. Instead, it sits alongside the invoice in both
          sets of books and records that part — or all — of the charge has been reversed,
          with a stated reason. That paper trail is exactly why credit notes exist: sales,
          stock and tax records all stay consistent, and anyone reviewing the transaction
          later can follow the story from invoice to correction without guessing.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Issue one whenever the amount on a sent invoice turns out to be too high or no
          longer payable. The common triggers are goods returned by the customer, goods
          that arrived damaged or faulty, a pricing or quantity error discovered after
          billing, a discount agreed after the invoice was sent, an order cancelled before
          delivery, and a service that was billed but never actually rendered. If the
          invoice has not been sent yet, simply fix and reissue it. Once the invoice is in
          the hands of the customer — and certainly once it has been paid or reported for
          tax — the correction belongs on a credit note, not on a quietly edited document.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Credit note vs debit note vs refund</h2>
        <p className="text-muted-foreground leading-relaxed">
          These three are often confused because all of them follow a sale that changed.
          A credit note is issued by the seller and reduces what the buyer owes. A debit
          note moves in the opposite direction: it is typically issued by the buyer when
          returning goods, to tell the seller that the buyer has debited the amount in
          their own books, or by a seller to increase an amount that was undercharged. In
          many trading relationships the buyer sends a debit note for a return and the
          seller answers with a matching credit note, and the two documents together close
          the loop.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          A refund is different again: it is the actual return of money, by bank transfer,
          card reversal or cash. A credit note creates the right to that refund or to a
          reduced future payment, but it is not itself a payment. If the customer has
          already paid the original invoice in full, the credit note is normally followed
          by a refund of the same amount — or, if the customer agrees, the credit is held
          on account and set against the next order. If the invoice is still unpaid, no
          money moves at all: the customer simply pays the invoice minus the credit.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What a credit note must contain to satisfy tax rules</h2>
        <p className="text-muted-foreground leading-relaxed">
          Tax authorities treat a credit note as a tax document, because it changes the tax
          you originally charged. To hold up, it needs its own sequential credit note
          number and issue date, the full names and addresses of seller and buyer, and —
          most importantly — a clear reference to the original invoice number and date it
          corrects. It must state the reason for the credit and list the credited goods or
          services with quantities and prices that match the original invoice, so the
          adjustment can be traced line by line.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The tax itself must be shown separately, at the same rate and under the same tax
          label used on the original invoice. That separation is not decoration: it is what
          allows you to reduce your output GST or VAT in the current period, and what
          allows a tax-registered customer to adjust the input tax they claimed. If the
          original invoice charged 18 percent GST, the credit note must reverse 18 percent
          GST on the credited amount — never a different rate, and never a blended figure
          with the tax buried inside the total. Where either party has a tax registration
          number, include it in the address blocks so the document matches the registration
          records on both sides.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Bookkeeping, numbering and record keeping</h2>
        <p className="text-muted-foreground leading-relaxed">
          In your books, a credit note reduces two things at once: your receivables, because
          the customer now owes less, and your recorded sales and output tax, because part
          of the sale has been reversed. If goods came back, remember the third entry —
          returned stock goes back into inventory once it has been inspected, and damaged
          stock should be written down rather than quietly returned to the shelf at full
          value. The customer mirrors the same entries on their side, reducing what they
          owe you and adjusting the tax they claimed, which is why business customers ask
          for the document promptly instead of accepting a verbal promise of a discount.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Number credit notes in their own unbroken sequence — CN-001, CN-002, CN-003 — and
          never reuse or delete a number. A cancelled credit note stays in the sequence,
          marked as cancelled, just like a cancelled invoice. File each credit note with a
          copy of the original invoice it corrects, plus any return paperwork, delivery
          evidence or correspondence that supports the reason, and keep the set for the
          full retention period your tax law requires, commonly five to seven years. When
          an auditor or a customer queries a balance two years later, that small bundle of
          matched documents is what settles the question in minutes instead of weeks.
        </p>
      </section>

      <AdSlot id="credit-note-generator-in-content" format="in-article" />

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
