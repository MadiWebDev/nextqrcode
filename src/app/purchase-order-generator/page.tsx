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
import { Download, FileText, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import JsPDF from 'jspdf';

interface LineItem {
  id: number;
  sku: string;
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
    question: 'Is a purchase order legally binding?',
    answer:
      'Yes, once the supplier accepts it. A purchase order is an offer to buy on stated terms; when the supplier accepts — by signing an acknowledgement, confirming by email, or simply shipping the goods — that acceptance plus the order forms a contract. This is why the details matter: prices, quantities, delivery date and payment terms on an accepted PO are the terms both sides agreed to. If a supplier wants different terms, the correct move is to amend and reissue the PO, not to rely on a side conversation.',
  },
  {
    question: 'What is three-way matching?',
    answer:
      'Three-way matching is the accounts payable check that compares three documents before money leaves the business: the purchase order (what was ordered and at what price), the delivery note or goods receipt (what actually arrived), and the supplier invoice (what the supplier is charging). If all three agree on items, quantities and prices, the invoice is paid. If the invoice charges for 120 units but only 100 arrived against the PO, the mismatch is caught and queried before payment instead of after.',
  },
  {
    question: 'When should I send a purchase order to a supplier?',
    answer:
      'Send the PO before the supplier starts work or picks the goods — never after delivery. The order is your instruction and your price protection: it fixes what you agreed while there is still time to correct misunderstandings. Sending a PO after the fact, to match an invoice that has already arrived, defeats the purpose, because the business has already accepted whatever price and quantity the supplier chose. For phone or chat orders, confirm with a PO the same day.',
  },
  {
    question: 'Can a supplier reject a purchase order or ask for changes?',
    answer:
      'Yes. A supplier can decline an order — for example if the price is outdated, stock has run out, or the delivery date cannot be met — or acknowledge it with proposed changes. Treat an acknowledgement carefully: if it changes price, quantity or terms, it is a counter-offer, not an acceptance, and you should amend and reissue the PO so the documents agree. Many disputes start because a supplier confirmed with slightly different figures and nobody updated the order.',
  },
  {
    question: 'How should purchase orders be numbered?',
    answer:
      'Use one unbroken sequence for the whole business, such as PO-001, PO-002 and PO-003, or a year-based sequence such as PO-2026-001. Never reuse a number, and if an order is cancelled, keep the number in the sequence and mark it cancelled rather than deleting it. Consistent numbering is what makes three-way matching, filing and auditing fast: anyone should be able to find the order behind any invoice in under a minute.',
  },
];

export default function PurchaseOrderGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [defaultDelivery] = useState(() =>
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const [buyerCompany, setBuyerCompany] = useState('Cafe Aroma (Pvt) Ltd');
  const [buyerAddress, setBuyerAddress] = useState(
    '22-C Khayaban-e-Ittehad, DHA Phase 6, Karachi, Pakistan'
  );
  const [buyerEmail, setBuyerEmail] = useState('procurement@cafearoma.example');
  const [buyerPhone, setBuyerPhone] = useState('+92 21 3588 4410');
  const [buyerContact, setBuyerContact] = useState('Imran Sheikh — Procurement');
  const [supplierName, setSupplierName] = useState('Punjab Packaging Supplies');
  const [supplierAddress, setSupplierAddress] = useState(
    'Industrial Area, Sheikhupura Road, Lahore, Pakistan'
  );
  const [supplierContact, setSupplierContact] = useState(
    'Attn: Sales Desk — sales@punjabpack.example'
  );
  const [shipToName, setShipToName] = useState('Cafe Aroma Central Kitchen');
  const [shipToAddress, setShipToAddress] = useState(
    'Warehouse 4, Korangi Industrial Area, Karachi, Pakistan'
  );
  const [poNumber, setPoNumber] = useState('PO-001');
  const [orderDate, setOrderDate] = useState(today);
  const [deliveryDate, setDeliveryDate] = useState(defaultDelivery);
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 1,
      sku: 'PKG-CUP-12',
      description: 'Double-wall paper cups, 12 oz, printed logo (case of 1,000)',
      qty: '10',
      price: '4200',
    },
    {
      id: 2,
      sku: 'PKG-BOX-M',
      description: 'Kraft takeaway boxes, medium (case of 500)',
      qty: '6',
      price: '3100',
    },
  ]);
  const nextId = useRef(3);
  const [taxPercent, setTaxPercent] = useState('0');
  const [taxLabel, setTaxLabel] = useState('GST');
  const [shipping, setShipping] = useState('1500');
  const [currency, setCurrency] = useState('PKR');
  const [deliveryTerms, setDeliveryTerms] = useState(
    'Deliver to the ship-to address between 9am and 5pm, Monday to Saturday. Quote the PO number on all cartons and on the delivery note.'
  );
  const [paymentTerms, setPaymentTerms] = useState(
    'Payment within 30 days of delivery and receipt of a correct invoice quoting this PO number.'
  );
  const [authorisedBy, setAuthorisedBy] = useState('Imran Sheikh');
  const [notes, setNotes] = useState(
    'Please acknowledge receipt of this order and confirm the delivery date. Prices are fixed as stated; any change requires an amended PO.'
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseAmount(item.qty) * parseAmount(item.price),
      0
    );
    const taxRate = Math.min(Math.max(parseAmount(taxPercent), 0), 100);
    const taxAmount = (subtotal * taxRate) / 100;
    const shippingAmount = parseAmount(shipping);
    return {
      subtotal,
      taxRate,
      taxAmount,
      shippingAmount,
      grandTotal: subtotal + taxAmount + shippingAmount,
    };
  }, [items, taxPercent, shipping]);

  const updateItem = (id: number, field: keyof LineItem, value: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [
      ...current,
      { id, sku: '', description: '', qty: '1', price: '0' },
    ]);
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
    doc.text('PURCHASE ORDER', 15, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${poNumber || 'PO-001'}`, pageWidth - 15, y, { align: 'right' });
    y += 8;
    doc.setFontSize(10);
    doc.text(`Order date: ${orderDate}`, pageWidth - 15, y, { align: 'right' });
    y += 5;
    doc.text(`Required delivery: ${deliveryDate}`, pageWidth - 15, y, {
      align: 'right',
    });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Buyer', 15, y);
    doc.text('Supplier', 110, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const buyerLines = doc.splitTextToSize(
      [buyerCompany, buyerAddress, buyerEmail, buyerPhone, buyerContact]
        .filter(Boolean)
        .join('\n'),
      85
    ) as string[];
    const supplierLines = doc.splitTextToSize(
      [supplierName, supplierAddress, supplierContact].filter(Boolean).join('\n'),
      85
    ) as string[];
    const blockLines = Math.max(buyerLines.length, supplierLines.length);
    ensureSpace(blockLines * 5 + 10);
    buyerLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
    supplierLines.forEach((line, index) => doc.text(line, 110, y + index * 5));
    y += blockLines * 5 + 6;

    doc.setFont('helvetica', 'bold');
    ensureSpace(8);
    doc.text('Ship to', 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const shipLines = doc.splitTextToSize(
      [shipToName, shipToAddress].filter(Boolean).join('\n'),
      pageWidth - 30
    ) as string[];
    ensureSpace(shipLines.length * 5 + 8);
    shipLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
    y += shipLines.length * 5 + 8;

    doc.setFont('helvetica', 'bold');
    ensureSpace(10);
    doc.text('SKU', 15, y);
    doc.text('Description', 42, y);
    doc.text('Qty', 128, y, { align: 'right' });
    doc.text('Unit price', 158, y, { align: 'right' });
    doc.text('Amount', pageWidth - 15, y, { align: 'right' });
    y += 2;
    doc.line(15, y, pageWidth - 15, y);
    y += 6;
    doc.setFont('helvetica', 'normal');

    items.forEach((item) => {
      const amount = parseAmount(item.qty) * parseAmount(item.price);
      const skuLines = doc.splitTextToSize(item.sku || '-', 24) as string[];
      const descriptionLines = doc.splitTextToSize(item.description || '-', 80) as string[];
      const rowHeight = Math.max(skuLines.length * 5, descriptionLines.length * 5, 5);
      ensureSpace(rowHeight + 2);
      skuLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
      descriptionLines.forEach((line, index) => doc.text(line, 42, y + index * 5));
      doc.text(String(parseAmount(item.qty)), 128, y, { align: 'right' });
      doc.text(formatMoney(parseAmount(item.price), currency), 158, y, {
        align: 'right',
      });
      doc.text(formatMoney(amount, currency), pageWidth - 15, y, { align: 'right' });
      y += rowHeight + 2;
    });

    y += 4;
    const totalRows: Array<[string, string]> = [
      ['Subtotal', formatMoney(totals.subtotal, currency)],
      [
        `${taxLabel || 'Tax'} (${totals.taxRate}%)`,
        formatMoney(totals.taxAmount, currency),
      ],
      ['Shipping / freight', formatMoney(totals.shippingAmount, currency)],
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

    const writeBlock = (heading: string, body: string) => {
      if (!body.trim()) return;
      y += 4;
      const bodyLines = doc.splitTextToSize(body.trim(), pageWidth - 30) as string[];
      ensureSpace(bodyLines.length * 5 + 10);
      doc.setFont('helvetica', 'bold');
      doc.text(heading, 15, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      bodyLines.forEach((line) => {
        doc.text(line, 15, y);
        y += 5;
      });
    };

    writeBlock('Delivery terms', deliveryTerms);
    writeBlock('Payment terms', paymentTerms);
    writeBlock('Notes', notes);

    y += 10;
    ensureSpace(22);
    doc.line(15, y + 10, 85, y + 10);
    doc.setFontSize(10);
    doc.text(`Authorised by: ${authorisedBy || ''}`, 15, y + 16);
    doc.text(`Date: ${orderDate}`, 110, y + 16);

    doc.save(`${poNumber || 'purchase-order'}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[{ label: 'Purchase Order Generator', href: '/purchase-order-generator' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <ShoppingCart className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Purchase Order Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Raise a proper purchase order in minutes instead of ordering by phone call and
          hope. This generator produces a numbered PO with your company details, the
          supplier, a separate ship-to address, SKU-coded line items, tax, freight and a
          grand total, plus delivery terms, payment terms and an authorised-by signature
          line. Send the PDF to your supplier and you have a written commitment both
          sides can check the delivery and the invoice against.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Buyer, supplier and delivery address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyer-company">Buyer — your company name</Label>
                <Input
                  id="buyer-company"
                  value={buyerCompany}
                  onChange={(event) => setBuyerCompany(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-name">Supplier name</Label>
                <Input
                  id="supplier-name"
                  value={supplierName}
                  onChange={(event) => setSupplierName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-address">Your company address</Label>
                <Textarea
                  id="buyer-address"
                  value={buyerAddress}
                  onChange={(event) => setBuyerAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-address">Supplier address</Label>
                <Textarea
                  id="supplier-address"
                  value={supplierAddress}
                  onChange={(event) => setSupplierAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-email">Your email</Label>
                <Input
                  id="buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-contact">Supplier contact</Label>
                <Input
                  id="supplier-contact"
                  value={supplierContact}
                  onChange={(event) => setSupplierContact(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-phone">Your phone</Label>
                <Input
                  id="buyer-phone"
                  value={buyerPhone}
                  onChange={(event) => setBuyerPhone(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-contact">Buyer name and department</Label>
                <Input
                  id="buyer-contact"
                  value={buyerContact}
                  onChange={(event) => setBuyerContact(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ship-to-name">Ship to — delivery name</Label>
                <Input
                  id="ship-to-name"
                  value={shipToName}
                  onChange={(event) => setShipToName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ship-to-address">Ship to — delivery address</Label>
                <Textarea
                  id="ship-to-address"
                  value={shipToAddress}
                  onChange={(event) => setShipToAddress(event.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Order details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="po-number">PO number</Label>
                <Input
                  id="po-number"
                  value={poNumber}
                  onChange={(event) => setPoNumber(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-date">Order date</Label>
                <Input
                  id="order-date"
                  type="date"
                  value={orderDate}
                  onChange={(event) => setOrderDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Required delivery date</Label>
                <Input
                  id="delivery-date"
                  type="date"
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
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
              <h2 className="text-lg font-semibold">Items ordered</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4" />
                Add item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6 sm:col-span-2 space-y-1">
                    <Label htmlFor={`item-sku-${item.id}`}>SKU / code</Label>
                    <Input
                      id={`item-sku-${item.id}`}
                      value={item.sku}
                      onChange={(event) => updateItem(item.id, 'sku', event.target.value)}
                      placeholder="SKU-001"
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4 space-y-1">
                    <Label htmlFor={`item-desc-${item.id}`}>
                      Description {index + 1}
                    </Label>
                    <Input
                      id={`item-desc-${item.id}`}
                      value={item.description}
                      onChange={(event) =>
                        updateItem(item.id, 'description', event.target.value)
                      }
                      placeholder="Product or service"
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
                  <div className="col-span-4 sm:col-span-1 text-sm font-medium pb-2">
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
              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping / freight charge</Label>
                <Input
                  id="shipping"
                  type="number"
                  min="0"
                  step="any"
                  value={shipping}
                  onChange={(event) => setShipping(event.target.value)}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery-terms">Delivery terms</Label>
                <Textarea
                  id="delivery-terms"
                  value={deliveryTerms}
                  onChange={(event) => setDeliveryTerms(event.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment terms</Label>
                <Textarea
                  id="payment-terms"
                  value={paymentTerms}
                  onChange={(event) => setPaymentTerms(event.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authorised-by">Authorised by (name)</Label>
                <Input
                  id="authorised-by"
                  value={authorisedBy}
                  onChange={(event) => setAuthorisedBy(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={2}
                />
              </div>
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
                  <p className="text-2xl font-bold">PURCHASE ORDER</p>
                  <p className="text-sm text-slate-600">{poNumber || 'PO-001'}</p>
                </div>
                <div className="text-sm text-right text-slate-600">
                  <p>Order date: {orderDate}</p>
                  <p>Required delivery: {deliveryDate}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Buyer</p>
                  <p>{buyerCompany}</p>
                  <p className="whitespace-pre-line text-slate-600">{buyerAddress}</p>
                  <p className="text-slate-600">{buyerEmail}</p>
                  <p className="text-slate-600">{buyerPhone}</p>
                  <p className="text-slate-600">{buyerContact}</p>
                </div>
                <div>
                  <p className="font-semibold">Supplier</p>
                  <p>{supplierName}</p>
                  <p className="whitespace-pre-line text-slate-600">{supplierAddress}</p>
                  <p className="text-slate-600">{supplierContact}</p>
                </div>
                <div>
                  <p className="font-semibold">Ship to</p>
                  <p>{shipToName}</p>
                  <p className="whitespace-pre-line text-slate-600">{shipToAddress}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 pr-3">SKU</th>
                      <th className="py-2 pr-3">Description</th>
                      <th className="py-2 pr-3 text-right">Qty</th>
                      <th className="py-2 pr-3 text-right">Unit price</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-2 pr-3">{item.sku || '-'}</td>
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
                  <span>
                    {taxLabel || 'Tax'} ({totals.taxRate}%)
                  </span>
                  <span>{formatMoney(totals.taxAmount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping / freight</span>
                  <span>{formatMoney(totals.shippingAmount, currency)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 text-base">
                  <span>Grand total</span>
                  <span>{formatMoney(totals.grandTotal, currency)}</span>
                </div>
              </div>
              {deliveryTerms.trim() ? (
                <div className="text-sm">
                  <p className="font-semibold">Delivery terms</p>
                  <p className="text-slate-600 whitespace-pre-line">{deliveryTerms}</p>
                </div>
              ) : null}
              {paymentTerms.trim() ? (
                <div className="text-sm">
                  <p className="font-semibold">Payment terms</p>
                  <p className="text-slate-600 whitespace-pre-line">{paymentTerms}</p>
                </div>
              ) : null}
              {notes.trim() ? (
                <p className="text-sm text-slate-600 whitespace-pre-line">{notes}</p>
              ) : null}
              <div className="pt-4 text-sm">
                <p className="border-t border-slate-300 pt-2 max-w-xs">
                  Authorised by: {authorisedBy || '________________'} ({authorisedBy},{' '}
                  {orderDate})
                </p>
              </div>
            </div>
            <Button type="button" onClick={downloadPdf} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download purchase order as PDF
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="purchase-order-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What a purchase order is, and why businesses issue them</h2>
        <p className="text-muted-foreground leading-relaxed">
          A purchase order is the buyer document in a business transaction: a formal,
          numbered instruction from a buyer to a supplier that says exactly what is being
          bought, in what quantity, at what agreed price, for delivery where and by when.
          Where an invoice is the seller asking for money, the purchase order is the buyer
          committing to spend it. That commitment is the point. Once a supplier accepts a
          PO, both sides hold the same written version of the deal, and the vague phone
          order — ten cases, the usual price, sometime next week — stops being a source of
          arguments about what was actually agreed.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The second job of a PO only becomes visible later, at payment time, and it is
          called three-way matching. Accounts staff compare the purchase order against the
          delivery note and the supplier invoice: what was ordered, what arrived, and what
          is being charged. When the three agree, the invoice is safe to pay. When they do
          not — the invoice prices a case higher than the PO, or bills for goods that never
          arrived — the mismatch is caught before money leaves the business. Businesses
          that order without POs lose this check entirely, and usually discover overcharges
          months later, if at all. A PO system also creates a spending record as a side
          effect: open orders show what the business has committed to buy but not yet paid
          for, which is information cash-flow planning cannot do without.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">The purchase order workflow, step by step</h2>
        <p className="text-muted-foreground leading-relaxed">
          The workflow is the same in a five-person cafe group and a five-hundred-person
          manufacturer; only the approval chain changes. This generator covers the
          document at the centre of it.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Requisition.</strong> Someone inside the
            business identifies a need — packaging stock running low, a replacement
            machine, a month of cleaning services — and raises a request, ideally with an
            estimate of cost.
          </li>
          <li>
            <strong className="text-foreground">Approval and PO creation.</strong> A
            manager checks the request against budget and approves it. The buyer then
            creates the purchase order with the next number in sequence, the agreed prices
            and a required delivery date, and an authorised person signs it.
          </li>
          <li>
            <strong className="text-foreground">Order sent and acknowledged.</strong> The
            PO goes to the supplier, who acknowledges it — confirming price, quantity and
            date — or comes back with changes that are settled by amending the order.
          </li>
          <li>
            <strong className="text-foreground">Delivery.</strong> Goods arrive at the
            ship-to address with a delivery note quoting the PO number. The receiver counts
            and inspects before signing, and records any shortage or damage the same day.
          </li>
          <li>
            <strong className="text-foreground">Invoice and matching.</strong> The
            supplier invoice arrives quoting the same PO number, and accounts perform the
            three-way match against the order and the delivery record.
          </li>
          <li>
            <strong className="text-foreground">Payment and filing.</strong> A matched
            invoice is paid on the agreed terms, and the PO, delivery note and invoice are
            filed together so the whole purchase can be reconstructed at audit time.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Fields a good PO must contain — and how a PO differs from an invoice and a quote</h2>
        <p className="text-muted-foreground leading-relaxed">
          A purchase order works only if a stranger could act on it without a follow-up
          call. That means a unique PO number, the order date and a required delivery
          date; full buyer, supplier and ship-to details, remembering that the delivery
          address is often not the billing address; an item table with SKU or product
          codes, clear descriptions, quantities and the agreed unit prices; tax and
          freight shown separately rather than buried in a single figure; delivery and
          payment terms in writing; and the name of the person who authorised the spend.
          Every field in that list exists in the form above, because every one of them is
          a question a supplier, a warehouse receiver or an auditor will otherwise have to
          ask later.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Quotation</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Sent by the seller before any commitment. States a price the seller is
                  willing to sell at, usually with a validity period.
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium">Purchase order</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Sent by the buyer in response. Commits the buyer to purchase the stated
                  items at the stated prices on the stated terms.
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Invoice</td>
                <td className="py-2 px-3 text-muted-foreground">
                  Sent by the seller after delivery. Requests payment and should quote the
                  PO number so it can be matched before it is paid.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Read in sequence, the three documents tell the whole story of a purchase: the
          quote proposes, the order commits, and the invoice collects. Confusing them —
          treating a quote as an order, or paying an invoice that references no order at
          all — is how businesses end up paying prices nobody approved.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Tips for small businesses starting a PO system</h2>
        <p className="text-muted-foreground leading-relaxed">
          Start simple and start now: a single numbered sequence, one person who issues
          orders, and a rule that no order is placed without a PO number. Use PO-001,
          PO-002 and so on, or add the year as PO-2026-001, but never restart the sequence
          per supplier or per staff member — duplicate numbers destroy the filing system
          the numbers exist to create. Set approval limits that match your size: perhaps
          the buyer can authorise orders up to a set amount, anything above it needs the
          owner name in the authorised-by field. Limits written on the process, not held
          in one person memory, keep working when that person is on holiday.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Two habits make the system pay for itself. First, insist that suppliers quote
          your PO number on every delivery note and invoice, and say so in the notes field
          of the order itself — an invoice without a PO number goes back to the supplier,
          politely, every time. Second, review open POs monthly: orders placed but never
          delivered, or partly delivered and forgotten, are where stock discrepancies and
          surprise invoices breed. A free generator like this one is a perfectly good
          starting system; move to purchasing software only when the volume of orders —
          not the desire for features — makes the manual register hard to keep.
        </p>
      </section>

      <AdSlot id="purchase-order-generator-in-content" format="in-article" />

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
