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
import { Download, FileText, Plus, Trash2, Truck } from 'lucide-react';
import JsPDF from 'jspdf';

interface DeliveryItem {
  id: number;
  description: string;
  qty: string;
  unit: string;
  remarks: string;
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
    question: 'What is the difference between a delivery note and an invoice?',
    answer:
      'A delivery note proves that goods moved from the seller to the buyer: it lists what was dispatched, in what quantities, on which vehicle, and it comes back signed as evidence of receipt. An invoice asks for money: it lists prices, tax and payment terms. The delivery note usually travels with the goods and is signed at the door, while the invoice is sent to the accounts office, often after delivery. Quantities on the signed delivery note and the invoice should always match, which is why accountants compare the two before paying.',
  },
  {
    question: 'Is a signed delivery note proof of delivery?',
    answer:
      'Yes, a signed delivery note is the standard proof of delivery in most trade disputes. The signature, the printed receiver name and the date together show that a named person at the delivery address accepted the listed goods. It is much stronger evidence than a dispatch record, which only proves the goods left your premises. Keep the signed copy — or a clear phone photo of it — filed against the order and the invoice, because months later it is the document that settles claims about short delivery or non-arrival.',
  },
  {
    question: 'What should the receiver do if goods are damaged on arrival?',
    answer:
      'The receiver should note the damage on the delivery note itself before signing — for example, two cartons crushed, one bag torn — and sign with that remark, rather than signing a clean copy and complaining later. Photographs taken at the vehicle, before unloading finishes, add strong support. The sender then knows the claim concerns transit damage, the driver has a record that the damage was seen on arrival, and the replacement or credit process can start from a document both sides already share.',
  },
  {
    question: 'Do I really need vehicle and driver details on a delivery note?',
    answer:
      'For anything leaving your premises in a vehicle, yes. The vehicle number and driver name connect the paper to a physical journey: the receiver can verify the right vehicle at the gate, security staff can log it in and out, and if a shipment goes missing or is delayed, the details identify exactly which trip to investigate. In Pakistan and India, gate staff and buyers routinely refuse or query challans without a vehicle number. For hand-delivered or courier parcels, write the courier name and tracking number in the same fields instead.',
  },
  {
    question: 'Can one challan cover a split delivery?',
    answer:
      'It is better practice to issue a separate challan for each physical trip, even when all the trips belong to one order. Each vehicle load gets signed on its own, so a shortage on the second trip does not cast doubt on the first. Reference the same order number on every challan and mark them clearly — part 1 of 2, part 2 of 2 — so the receiver can confirm when the order is complete. The final invoice then simply totals the quantities across the signed challans for that order.',
  },
];

export default function DeliveryNoteGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const [senderName, setSenderName] = useState('Metro Wholesale Supplies');
  const [senderAddress, setSenderAddress] = useState(
    'Plot 18, SITE Industrial Area, Karachi, Pakistan'
  );
  const [senderPhone, setSenderPhone] = useState('+92 21 3255 0148');
  const [receiverName, setReceiverName] = useState('City Mart — Gulberg Branch');
  const [receiverAddress, setReceiverAddress] = useState(
    '88 Main Boulevard, Gulberg III, Lahore, Pakistan'
  );
  const [receiverPhone, setReceiverPhone] = useState('+92 300 9876543');
  const [challanNumber, setChallanNumber] = useState('CH-001');
  const [challanDate, setChallanDate] = useState(today);
  const [orderRef, setOrderRef] = useState('PO-7781 / Order #4521');
  const [vehicleNumber, setVehicleNumber] = useState('LEA-24-5831');
  const [driverName, setDriverName] = useState('Muhammad Imran');
  const [showPrices, setShowPrices] = useState(false);
  const [currency, setCurrency] = useState('PKR');
  const [items, setItems] = useState<DeliveryItem[]>([
    { id: 1, description: 'Cooking oil 5L bottles', qty: '20', unit: 'cartons', remarks: 'Keep upright', price: '2450' },
    { id: 2, description: 'Basmati rice 10kg', qty: '50', unit: 'bags', remarks: 'Dry storage only', price: '3850' },
    { id: 3, description: 'Detergent powder 1kg', qty: '100', unit: 'pcs', remarks: '', price: '320' },
  ]);
  const nextId = useRef(4);
  const [receivedBy, setReceivedBy] = useState('Store Manager, City Mart Gulberg');
  const [notes, setNotes] = useState(
    'Deliver between 9am and 5pm. Call the receiver 30 minutes before arrival. Stack cartons no more than five high and keep rice bags off the floor.'
  );

  const totalAmount = useMemo(
    () =>
      items.reduce((sum, item) => sum + parseAmount(item.qty) * parseAmount(item.price), 0),
    [items]
  );

  const updateItem = (id: number, field: keyof DeliveryItem, value: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [
      ...current,
      { id, description: '', qty: '1', unit: 'pcs', remarks: '', price: '0' },
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

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('DELIVERY NOTE / CHALLAN', 15, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${challanNumber || 'CH-001'}`, pageWidth - 15, y, { align: 'right' });
    y += 8;
    doc.setFontSize(10);
    doc.text(`Date: ${challanDate}`, pageWidth - 15, y, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('From (sender)', 15, y);
    doc.text('Deliver to (receiver)', 110, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const senderLines = doc.splitTextToSize(
      [senderName, senderAddress, senderPhone].filter(Boolean).join('\n'),
      85
    ) as string[];
    const receiverLines = doc.splitTextToSize(
      [receiverName, receiverAddress, receiverPhone].filter(Boolean).join('\n'),
      85
    ) as string[];
    const blockLines = Math.max(senderLines.length, receiverLines.length);
    ensureSpace(blockLines * 5 + 10);
    senderLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
    receiverLines.forEach((line, index) => doc.text(line, 110, y + index * 5));
    y += blockLines * 5 + 6;

    const metaLines = [
      `Challan no: ${challanNumber || 'CH-001'}`,
      `Date: ${challanDate}`,
      orderRef.trim() ? `Order ref: ${orderRef.trim()}` : '',
      vehicleNumber.trim() ? `Vehicle: ${vehicleNumber.trim()}` : '',
      driverName.trim() ? `Driver: ${driverName.trim()}` : '',
    ].filter(Boolean);
    ensureSpace(metaLines.length * 5 + 6);
    doc.setFont('helvetica', 'bold');
    metaLines.forEach((line) => {
      doc.text(line, 15, y);
      y += 5;
    });
    doc.setFont('helvetica', 'normal');
    y += 4;

    const amountX = pageWidth - 15;
    const priceX = pageWidth - 45;
    doc.setFont('helvetica', 'bold');
    ensureSpace(10);
    doc.text('Description', 15, y);
    doc.text('Qty', 105, y, { align: 'right' });
    doc.text('Unit', 112, y);
    if (showPrices) {
      doc.text('Unit price', priceX, y, { align: 'right' });
      doc.text('Amount', amountX, y, { align: 'right' });
    } else {
      doc.text('Remarks', 140, y);
    }
    y += 2;
    doc.line(15, y, pageWidth - 15, y);
    y += 6;
    doc.setFont('helvetica', 'normal');

    items.forEach((item) => {
      const descriptionLines = doc.splitTextToSize(item.description || '-', 85) as string[];
      const remarksLines = showPrices
        ? []
        : (doc.splitTextToSize(item.remarks || '-', 55) as string[]);
      const rowHeight = Math.max(descriptionLines.length * 5, remarksLines.length * 5, 5);
      ensureSpace(rowHeight + 2);
      descriptionLines.forEach((line, index) => doc.text(line, 15, y + index * 5));
      doc.text(item.qty || '0', 105, y, { align: 'right' });
      doc.text(item.unit || '-', 112, y);
      if (showPrices) {
        doc.text(formatMoney(parseAmount(item.price), currency), priceX, y, {
          align: 'right',
        });
        doc.text(
          formatMoney(parseAmount(item.qty) * parseAmount(item.price), currency),
          amountX,
          y,
          { align: 'right' }
        );
      } else {
        remarksLines.forEach((line, index) => doc.text(line, 140, y + index * 5));
      }
      y += rowHeight + 2;
    });

    if (showPrices) {
      y += 4;
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Total', 120, y);
      doc.text(formatMoney(totalAmount, currency), amountX, y, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 8;
    }

    if (notes.trim()) {
      y += 4;
      const noteLines = doc.splitTextToSize(`Notes: ${notes.trim()}`, pageWidth - 30) as string[];
      ensureSpace(noteLines.length * 5 + 4);
      noteLines.forEach((line) => {
        doc.text(line, 15, y);
        y += 5;
      });
    }

    y += 8;
    ensureSpace(38);
    doc.setFont('helvetica', 'bold');
    doc.text('Goods received in good condition', 15, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Received by: ${receivedBy || ''}`, 15, y);
    doc.text(`Date: ${challanDate}`, 130, y);
    y += 12;
    doc.text('Signature:', 15, y);
    doc.line(38, y, 110, y);
    doc.text('Date:', 130, y);
    doc.line(145, y, pageWidth - 15, y);

    doc.save(`${challanNumber || 'delivery-note'}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Delivery Note / Challan Generator', href: '/delivery-note-generator' },
        ]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Truck className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Delivery Note / Challan Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          When goods leave your warehouse, they should travel with a document that says
          exactly what was loaded, where it is going, and who carried it. That document is
          the delivery note — called a delivery challan across Pakistan and India. This
          generator builds one in minutes: sender and receiver blocks, challan number,
          order reference, vehicle and driver details, an item table with quantities and
          units, and a signed receipt block at the bottom. Prices stay off by default, as
          they should, and can be switched on when a delivery genuinely needs them.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Sender and receiver</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender-name">Sender — business name</Label>
                <Input
                  id="sender-name"
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver-name">Receiver — customer name</Label>
                <Input
                  id="receiver-name"
                  value={receiverName}
                  onChange={(event) => setReceiverName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-address">Sender address</Label>
                <Textarea
                  id="sender-address"
                  value={senderAddress}
                  onChange={(event) => setSenderAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver-address">Delivery address</Label>
                <Textarea
                  id="receiver-address"
                  value={receiverAddress}
                  onChange={(event) => setReceiverAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-phone">Sender phone</Label>
                <Input
                  id="sender-phone"
                  value={senderPhone}
                  onChange={(event) => setSenderPhone(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver-phone">Receiver phone</Label>
                <Input
                  id="receiver-phone"
                  value={receiverPhone}
                  onChange={(event) => setReceiverPhone(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Challan and transport details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="challan-number">Challan number</Label>
                <Input
                  id="challan-number"
                  value={challanNumber}
                  onChange={(event) => setChallanNumber(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challan-date">Date</Label>
                <Input
                  id="challan-date"
                  type="date"
                  value={challanDate}
                  onChange={(event) => setChallanDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-ref">Order reference</Label>
                <Input
                  id="order-ref"
                  value={orderRef}
                  onChange={(event) => setOrderRef(event.target.value)}
                  placeholder="PO number or order number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-number">Vehicle number</Label>
                <Input
                  id="vehicle-number"
                  value={vehicleNumber}
                  onChange={(event) => setVehicleNumber(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver-name">Driver name</Label>
                <Input
                  id="driver-name"
                  value={driverName}
                  onChange={(event) => setDriverName(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  id="show-prices"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={showPrices}
                  onChange={(event) => setShowPrices(event.target.checked)}
                />
                <Label htmlFor="show-prices">Show prices on the note</Label>
              </div>
              {showPrices ? (
                <div className="flex items-center gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="w-36">
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
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Prices are hidden by default because a delivery note is for checking goods,
              not money. Turn them on only for cash-on-delivery or internal transfers.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Items being delivered</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4" />
                Add item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
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
                      placeholder="Goods being delivered"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1 space-y-1">
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
                  <div className="col-span-3 sm:col-span-1 space-y-1">
                    <Label htmlFor={`item-unit-${item.id}`}>Unit</Label>
                    <Input
                      id={`item-unit-${item.id}`}
                      value={item.unit}
                      onChange={(event) => updateItem(item.id, 'unit', event.target.value)}
                      placeholder="pcs, cartons, kg"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3 space-y-1">
                    <Label htmlFor={`item-remarks-${item.id}`}>Remarks</Label>
                    <Input
                      id={`item-remarks-${item.id}`}
                      value={item.remarks}
                      onChange={(event) =>
                        updateItem(item.id, 'remarks', event.target.value)
                      }
                      placeholder="Handling or batch note"
                    />
                  </div>
                  {showPrices ? (
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
                  ) : null}
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
                <Label htmlFor="received-by">Received by (name)</Label>
                <Input
                  id="received-by"
                  value={receivedBy}
                  onChange={(event) => setReceivedBy(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes and handling instructions</Label>
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
                  <p className="text-2xl font-bold">DELIVERY NOTE / CHALLAN</p>
                  <p className="text-sm text-slate-600">{challanNumber || 'CH-001'}</p>
                </div>
                <div className="text-sm text-right text-slate-600">
                  <p>Date: {challanDate}</p>
                  {orderRef.trim() ? <p>Order ref: {orderRef}</p> : null}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">From (sender)</p>
                  <p>{senderName}</p>
                  <p className="whitespace-pre-line text-slate-600">{senderAddress}</p>
                  <p className="text-slate-600">{senderPhone}</p>
                </div>
                <div>
                  <p className="font-semibold">Deliver to (receiver)</p>
                  <p>{receiverName}</p>
                  <p className="whitespace-pre-line text-slate-600">{receiverAddress}</p>
                  <p className="text-slate-600">{receiverPhone}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm border-y py-2">
                <span>
                  <span className="font-semibold">Challan no:</span> {challanNumber || 'CH-001'}
                </span>
                <span>
                  <span className="font-semibold">Date:</span> {challanDate}
                </span>
                {orderRef.trim() ? (
                  <span>
                    <span className="font-semibold">Order ref:</span> {orderRef}
                  </span>
                ) : null}
                {vehicleNumber.trim() ? (
                  <span>
                    <span className="font-semibold">Vehicle:</span> {vehicleNumber}
                  </span>
                ) : null}
                {driverName.trim() ? (
                  <span>
                    <span className="font-semibold">Driver:</span> {driverName}
                  </span>
                ) : null}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 pr-3">Description</th>
                      <th className="py-2 pr-3 text-right">Qty</th>
                      <th className="py-2 pr-3">Unit</th>
                      <th className="py-2 pr-3">Remarks</th>
                      {showPrices ? (
                        <>
                          <th className="py-2 pr-3 text-right">Unit price</th>
                          <th className="py-2 text-right">Amount</th>
                        </>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-2 pr-3">{item.description || '-'}</td>
                        <td className="py-2 pr-3 text-right">{item.qty || '0'}</td>
                        <td className="py-2 pr-3">{item.unit || '-'}</td>
                        <td className="py-2 pr-3">{item.remarks || '-'}</td>
                        {showPrices ? (
                          <>
                            <td className="py-2 pr-3 text-right">
                              {formatMoney(parseAmount(item.price), currency)}
                            </td>
                            <td className="py-2 text-right">
                              {formatMoney(
                                parseAmount(item.qty) * parseAmount(item.price),
                                currency
                              )}
                            </td>
                          </>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showPrices ? (
                <div className="ml-auto max-w-xs w-full text-sm">
                  <div className="flex justify-between font-bold border-t pt-2 text-base">
                    <span>Total</span>
                    <span>{formatMoney(totalAmount, currency)}</span>
                  </div>
                </div>
              ) : null}
              {notes.trim() ? (
                <p className="text-sm text-slate-600 whitespace-pre-line">{notes}</p>
              ) : null}
              <div className="border rounded-md p-4 space-y-4 text-sm">
                <p className="font-semibold">Goods received in good condition</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <p>
                    Received by: <span className="font-medium">{receivedBy || ''}</span>
                  </p>
                  <p>
                    Date: <span className="font-medium">{challanDate}</span>
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <div className="border-b border-slate-400 h-6" />
                    <p className="text-slate-600 mt-1">Signature</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 h-6" />
                    <p className="text-slate-600 mt-1">Date</p>
                  </div>
                </div>
              </div>
            </div>
            <Button type="button" onClick={downloadPdf} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download delivery note as PDF
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="delivery-note-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What a delivery note or delivery challan is</h2>
        <p className="text-muted-foreground leading-relaxed">
          A delivery note is the document that travels with goods from the moment they leave
          the seller until the moment the buyer accepts them. It names the sender and the
          receiver, carries a unique challan number and date, references the order behind
          the shipment, and lists every item with its quantity and unit — cartons, bags,
          pieces, kilograms. It sits in the gap between dispatch and invoicing: the order
          says what was promised, the delivery note says what was actually sent and
          received, and the invoice, raised from the signed delivery note, says what must
          now be paid.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          That middle position makes the delivery note the most practical document in the
          chain. Warehouse staff pick and pack against it, gate security checks the vehicle
          against it, the driver carries it as his authority to move the goods, and the
          receiver counts against it before signing. When the signed copy comes back, it
          closes the delivery: the seller has proof the goods arrived, in the right
          quantities, into the hands of a named person. Without it, every later argument
          about a shipment starts from memory and goodwill instead of from a signed record.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Why prices are normally left off a delivery note</h2>
        <p className="text-muted-foreground leading-relaxed">
          A delivery note deliberately leaves prices off in most businesses, and the reason
          is division of labour. The person receiving goods — a storekeeper, a site
          supervisor, a branch manager — is responsible for checking physical things: count,
          condition and expiry. Prices belong to the accounts office, which checks them on
          the invoice against the purchase order. Putting prices on the note handed to
          drivers, loaders and gate staff also spreads your commercial terms far beyond the
          people who need them, and a priced note left in a vehicle or a receiving bay can
          end up in front of competitors or the wrong customer.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          There are honest exceptions, and this tool supports them with the prices toggle.
          Cash-on-delivery shipments need the amount printed where the driver can collect
          against it. Transfers between your own branches sometimes carry values for
          internal stock accounting. Some buyers, especially smaller shops, genuinely use a
          priced challan as their only purchase record. In those cases switch prices on,
          pick the currency, and the note gains unit prices, line amounts and a total. For
          ordinary credit deliveries to established customers, leave the toggle off.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">The delivery workflow, step by step</h2>
        <p className="text-muted-foreground leading-relaxed">
          A clean delivery follows the same six movements every time, and the challan is
          created in the middle of them — after packing, before the vehicle moves.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Pick.</strong> Warehouse staff collect the
            items for the order from the shelves, checking product names, sizes and batch
            or expiry dates as they go.
          </li>
          <li>
            <strong className="text-foreground">Pack.</strong> Goods are packed so they
            survive the journey — fragile items separated, liquids upright, cartons sealed
            and labelled with the receiver name.
          </li>
          <li>
            <strong className="text-foreground">Raise the challan.</strong> The packed
            quantities, not the hoped-for quantities, go onto the delivery note, together
            with the order reference, vehicle number and driver name. Two copies are
            printed: one for the receiver to keep, one to be signed and brought back.
          </li>
          <li>
            <strong className="text-foreground">Transport.</strong> The driver carries both
            copies with the goods. If police, excise or gate staff stop the vehicle, the
            challan explains whose goods are moving and where they are going.
          </li>
          <li>
            <strong className="text-foreground">Signed receipt.</strong> The receiver
            counts and inspects, notes any shortage or damage on the note itself, then
            signs the goods-received block. One copy stays with the receiver, the signed
            copy returns with the driver.
          </li>
          <li>
            <strong className="text-foreground">Invoice.</strong> Only now does the invoice
            get raised, from the signed challan quantities. What was signed for is what
            gets billed, and disputes shrink to almost nothing.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Checking goods on arrival, and challan terms explained</h2>
        <p className="text-muted-foreground leading-relaxed">
          The signature at the bottom of a delivery note should be earned by a real check,
          not given at the door out of politeness. Count the cartons or bags against the
          note before the vehicle leaves, open a sample of cartons to confirm the contents
          match the descriptions, look for crushed corners, leaks and broken seals, and
          check expiry dates on anything perishable. If something is short or damaged, do
          not refuse the whole delivery in anger — write the exact shortage or damage on
          both copies of the note, then sign. A signed note with a written remark protects
          the receiver; a clean signature quietly accepts whatever arrived.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Terminology changes with geography, but the document does not. In Pakistan and
          India it is a delivery challan, often shortened to just challan, and the same
          word covers bank payment slips and traffic fines, which is why business people
          say delivery challan in full. A factory may also issue a gate pass — permission
          for goods and vehicle to leave the premises — which works alongside the challan
          rather than replacing it. In the United Kingdom and much of Europe the identical
          document is a delivery note, in the United States a packing slip or bill of
          lading depending on who carries the goods, and in the Gulf a delivery note or
          goods delivery note. Whatever the local name, buyers and auditors everywhere
          recognise the same layout: sender, receiver, items, quantities, vehicle, and a
          signature that turns a delivery into a fact.
        </p>
      </section>

      <AdSlot id="delivery-note-generator-in-content" format="in-article" />

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
