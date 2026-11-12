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
import { Download, FileText, Globe, Plus, QrCode, Trash2 } from 'lucide-react';
import JsPDF from 'jspdf';
import { toDataURL } from 'qrcode';

interface LineItem {
  id: number;
  description: string;
  qty: string;
  price: string;
}

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

const PROFORMA_NOTICE =
  'Proforma invoice — not a tax invoice. Issued for quotation, customs and advance-payment purposes; a final tax invoice follows delivery.';

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
    question: 'Is a proforma invoice legally binding?',
    answer:
      'On its own, no. A proforma invoice is a statement of intent: it records what the seller expects to supply, at what price, and on what terms, but it is not a demand for payment and it does not by itself create a contract. It becomes commercially meaningful when the buyer accepts it — for example by paying an advance against it, signing it, or using it to open a letter of credit — because that acceptance, together with the proforma, evidences the deal. If you need a binding commitment, follow the accepted proforma with a written sales contract or a signed purchase order.',
  },
  {
    question: 'Can a customer pay against a proforma invoice?',
    answer:
      'Yes, and advance payment against a proforma is one of its main uses. Exporters routinely ask for a deposit or full prepayment before production or shipment, and the proforma gives the buyer a precise document to pay against: the right amount, the right currency, and a reference number to quote. The seller still issues a final commercial and tax invoice when the goods are delivered, and that final invoice — not the proforma — is the document both sides use in their accounts.',
  },
  {
    question: 'Does a proforma invoice count for tax or VAT?',
    answer:
      'No. A proforma invoice is not a tax invoice: it creates no tax point, it is not entered as a sale in the seller accounts, and the buyer cannot reclaim GST or VAT from it. Tax is charged and recorded on the final invoice issued at delivery. This is exactly why the document must be clearly headed as a proforma — if a proforma looks identical to a tax invoice, an auditor or a customs officer may treat it as one, and the confusion can delay clearance or a tax claim.',
  },
  {
    question: 'How long should the validity period on a proforma invoice be?',
    answer:
      'Thirty days is the most common validity period, and it is the default in this generator. Shorter periods, such as 7 to 14 days, suit goods whose prices move quickly, like metals, electronics or anything priced in a volatile currency. Longer periods, up to 90 days, are normal for made-to-order machinery or project work where the buyer needs time to arrange finance or import licences. Whatever you choose, print the expiry date on the document: a proforma without a validity date invites the buyer to hold you to an old price months later.',
  },
  {
    question: 'What is the difference between a proforma invoice and a quotation?',
    answer:
      'A quotation is an offer: it names your price for goods or services, often with options and alternatives, and it may not even name a specific buyer. A proforma invoice is that offer rewritten in final invoice format for one named buyer, with exact quantities, a single total, a document number and a validity date. Banks, customs authorities and finance departments prefer the proforma because it is precise enough to pay against, clear a shipment against, or attach to a letter of credit — none of which a general quotation can do.',
  },
];

export default function ProformaInvoiceGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [defaultExpiry] = useState(() =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const [sellerName, setSellerName] = useState('Sahara Textile Exports');
  const [sellerAddress, setSellerAddress] = useState(
    'Plot 88, Industrial Estate, Kot Lakhpat, Lahore, Pakistan'
  );
  const [sellerEmail, setSellerEmail] = useState('exports@saharatextile.example');
  const [sellerPhone, setSellerPhone] = useState('+92 42 3512 8890');
  const [buyerName, setBuyerName] = useState('Baltic Home GmbH');
  const [buyerAddress, setBuyerAddress] = useState(
    'Am Sandtorkai 42, 20457 Hamburg, Germany'
  );
  const [proformaNumber, setProformaNumber] = useState('PI-2026-014');
  const [issueDate, setIssueDate] = useState(today);
  const [expiryDate, setExpiryDate] = useState(defaultExpiry);
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 1,
      description: 'Cotton bed sheet set, 400 TC, king size (cartons of 12)',
      qty: '40',
      price: '96',
    },
    {
      id: 2,
      description: 'Cotton bath towels, 600 GSM, white (bales of 50)',
      qty: '25',
      price: '58',
    },
  ]);
  const nextId = useRef(3);
  const [discountPercent, setDiscountPercent] = useState('0');
  const [taxPercent, setTaxPercent] = useState('0');
  const [taxLabel, setTaxLabel] = useState('GST');
  const [currency, setCurrency] = useState('EUR');
  const [notes, setNotes] = useState(
    'Prices are FOB Karachi. Shipment within 21 days of advance payment confirmation. This proforma is valid until the expiry date shown above.'
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
    doc.text('PROFORMA INVOICE', 15, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${proformaNumber || 'PI-001'}`, pageWidth - 15, y, { align: 'right' });
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const noticeLines = doc.splitTextToSize(PROFORMA_NOTICE, pageWidth - 30) as string[];
    noticeLines.forEach((line) => {
      doc.text(line, 15, y);
      y += 4.5;
    });
    doc.setFont('helvetica', 'normal');
    y += 2;
    doc.setFontSize(10);
    doc.text(`Issue date: ${issueDate}`, pageWidth - 15, y, { align: 'right' });
    y += 5;
    doc.text(`Valid until: ${expiryDate}`, pageWidth - 15, y, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Seller', 15, y);
    doc.text('Buyer', 110, y);
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
      const noteLines = doc.splitTextToSize(
        `Notes and terms: ${notes.trim()}`,
        pageWidth - 30
      ) as string[];
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
      doc.text('Scan to pay the advance', 15, y);
      y += 4;
      doc.addImage(effectiveQrDataUrl, 'PNG', 15, y, 38, 38);
      doc.setFont('helvetica', 'normal');
      const paymentLines = doc.splitTextToSize(paymentText.trim(), 120) as string[];
      paymentLines.forEach((line, index) => doc.text(line, 58, y + 8 + index * 5));
      y += 42;
    }

    doc.save(`${proformaNumber || 'proforma-invoice'}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Proforma Invoice Generator', href: '/proforma-invoice-generator' },
        ]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Globe className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Proforma Invoice Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Create a proforma invoice that a buyer, a bank or a customs officer can act on
          immediately. This generator lays out your goods or services in final-invoice
          format — named buyer, exact quantities, one clear total in your chosen currency
          and a validity date — while marking the document plainly as a proforma, not a
          tax invoice. Use it to win advance payment, support an import declaration or
          anchor a letter of credit, then download a clean PDF in seconds.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Seller and buyer</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seller-name">Seller name or business name</Label>
                <Input
                  id="seller-name"
                  value={sellerName}
                  onChange={(event) => setSellerName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-name">Buyer name</Label>
                <Input
                  id="buyer-name"
                  value={buyerName}
                  onChange={(event) => setBuyerName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-address">Seller address</Label>
                <Textarea
                  id="seller-address"
                  value={sellerAddress}
                  onChange={(event) => setSellerAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-address">Buyer address</Label>
                <Textarea
                  id="buyer-address"
                  value={buyerAddress}
                  onChange={(event) => setBuyerAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-email">Seller email</Label>
                <Input
                  id="seller-email"
                  type="email"
                  value={sellerEmail}
                  onChange={(event) => setSellerEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-phone">Seller phone</Label>
                <Input
                  id="seller-phone"
                  value={sellerPhone}
                  onChange={(event) => setSellerPhone(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Proforma details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proforma-number">Proforma number</Label>
                <Input
                  id="proforma-number"
                  value={proformaNumber}
                  onChange={(event) => setProformaNumber(event.target.value)}
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
                <Label htmlFor="expiry-date">Valid until (expiry date)</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(event.target.value)}
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
                      placeholder="Goods or services, with packing details"
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
              <Label htmlFor="notes">Notes and terms</Label>
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
                Add a payment QR code for the advance payment
              </Label>
            </div>
            {paymentQrEnabled ? (
              <div className="space-y-2">
                <Label htmlFor="payment-text">Payment link, wallet address or IBAN</Label>
                <Input
                  id="payment-text"
                  value={paymentText}
                  onChange={(event) => setPaymentText(event.target.value)}
                  placeholder="https://your-payment-link.example/pay or your IBAN for the advance"
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
                <div className="space-y-2">
                  <p className="text-2xl font-bold">PROFORMA INVOICE</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    Proforma — not a tax invoice
                  </span>
                </div>
                <div className="text-sm text-right text-slate-600">
                  <p className="font-medium text-slate-900">{proformaNumber || 'PI-001'}</p>
                  <p>Issued: {issueDate}</p>
                  <p>Valid until: {expiryDate}</p>
                </div>
              </div>
              <div className="border border-amber-300 bg-amber-50 rounded-md px-3 py-2 text-sm text-amber-900">
                {PROFORMA_NOTICE}
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Seller</p>
                  <p>{sellerName}</p>
                  <p className="whitespace-pre-line text-slate-600">{sellerAddress}</p>
                  <p className="text-slate-600">{sellerEmail}</p>
                  <p className="text-slate-600">{sellerPhone}</p>
                </div>
                <div>
                  <p className="font-semibold">Buyer</p>
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
                  <img
                    src={effectiveQrDataUrl}
                    alt="Payment QR code"
                    className="w-28 h-28"
                  />
                  <div className="text-sm">
                    <p className="font-semibold">Scan to pay the advance</p>
                    <p className="text-slate-600 break-all">{paymentText}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <Button type="button" onClick={downloadPdf} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download proforma invoice as PDF
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="proforma-invoice-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          What a proforma invoice is — and how it differs from other documents
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A proforma invoice is a preliminary bill of sale sent before goods are shipped
          or services are delivered. The word proforma means for the sake of form: the
          document looks and reads like a final invoice, with a named seller and buyer,
          itemised goods, quantities, prices and a total, but it is issued in advance of
          the actual transaction. Its job is to let everyone downstream — the buyer, the
          buyer bank, a customs authority, an insurer — work from exact figures rather
          than estimates, while no sale has yet been recorded and no tax has yet fallen
          due.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          That timing is what separates it from a commercial or tax invoice. A commercial
          invoice is issued when goods actually move, it declares the real value of a real
          shipment, and it becomes an entry in the seller accounts and a tax document for
          both parties. A proforma, by contrast, records an intention: quantities can
          still change, shipment can still be cancelled, and if the deal dies the proforma
          is simply voided — there is nothing to credit or reverse. It also differs from a
          quotation. A quotation is an offer that may cover several options, optional
          extras and alternative prices, often without naming a buyer at all. A proforma
          commits to one configuration for one buyer at one total, which is why banks and
          customs desks ask for a proforma and will not work from a quotation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">When a proforma invoice is used</h2>
        <p className="text-muted-foreground leading-relaxed">
          The most common use is international trade. An importer in Hamburg buying
          textiles from Lahore needs a document before the goods exist as a shipment: the
          proforma supports the import declaration, lets customs estimate duty in advance,
          and gives the buyer the exact figure needed to apply for foreign exchange or an
          import licence. Without it, the first time anyone official sees the value of the
          order is when the container is already on the water.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Advance payment is the second big use. Exporters and made-to-order manufacturers
          rarely start production on a promise, so the proforma becomes the basis for a
          deposit or full prepayment: the buyer pays against a numbered document and quotes
          that number on the transfer, and both sides can reconcile the payment in seconds.
          Closely related is the letter of credit, where a bank guarantees payment if the
          seller ships exactly what was agreed — the proforma is usually the document the
          credit is opened from, so its descriptions and totals must match the eventual
          commercial invoice line for line. Proformas also appear in quieter corners of
          business: a company may need one to get internal budget approval for a purchase,
          a traveller may need one to support a business visa application, and insurers use
          proforma values to quote cover for goods in transit. In each case the pattern is
          the same — a formal, priced, time-limited statement of a deal that has been
          agreed but not yet executed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What customs officers and banks expect to see</h2>
        <p className="text-muted-foreground leading-relaxed">
          Officials read proformas quickly and reject them for predictable reasons. The
          fields below are the ones that matter most, and every one of them can be filled
          in with this generator.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Full legal names and addresses</strong> for
            both seller and buyer — a trading nickname or a missing country can stall a
            customs file or a bank compliance check.
          </li>
          <li>
            <strong className="text-foreground">Precise goods descriptions</strong> with
            quantities, unit prices and packing details. Cotton bed sheets, 400 thread
            count, cartons of 12 clears faster than a single line that says textiles.
          </li>
          <li>
            <strong className="text-foreground">One currency, used consistently,</strong>{' '}
            with the total written once and matching the sum of the lines. Mixed
            currencies are the single most common reason a bank returns a proforma.
          </li>
          <li>
            <strong className="text-foreground">A document number and issue date,</strong>{' '}
            plus a validity date, so the reader can tell the offer is current and can cite
            the document unambiguously.
          </li>
          <li>
            <strong className="text-foreground">Delivery terms in the notes,</strong> such
            as FOB Karachi or CIF Hamburg, naming who pays freight and insurance. Add your
            tax registration number to the seller block if you have one.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Tips for proformas that clear without questions</h2>
        <p className="text-muted-foreground leading-relaxed">
          Always set a validity date, and make it realistic. Thirty days is the default
          here because it gives a buyer time to arrange payment or a letter of credit
          while protecting you from raw-material price rises. If your inputs are priced in
          a volatile currency, shorten the window to 14 days and say so in the notes —
          buyers respect a stated reason far more than a silent price increase later.
          State your Incoterms in the notes field as well: three letters such as FOB, CIF
          or EXW, followed by a named place, decide who pays for freight, insurance and
          export clearance, and leaving them out is an invitation for a dispute after the
          goods ship.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Keep your numbering consistent across the whole deal. A tidy pattern is to give
          the proforma a PI number, then issue the final commercial invoice with a closely
          related number and a note that it follows proforma PI-2026-014. Bank staff
          reconciling a letter of credit compare the two documents side by side; matching
          descriptions, quantities and totals make that check take a minute, while even a
          small unexplained difference can hold payment for weeks. Finally, mark the
          document clearly. This generator prints a banner stating that the document is
          not a tax invoice — keep that wording intact. It protects the buyer from trying
          to reclaim tax on a document that carries none, and it protects you if the
          proforma is ever filed in the wrong folder at audit time.
        </p>
      </section>

      <AdSlot id="proforma-invoice-generator-in-content" format="in-article" />

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
