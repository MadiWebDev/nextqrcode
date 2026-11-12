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
import { Download, FileText, Globe2, Plus, Trash2 } from 'lucide-react';
import JsPDF from 'jspdf';

interface GoodsItem {
  id: number;
  description: string;
  hsCode: string;
  origin: string;
  qty: string;
  unitPrice: string;
  netWeight: string;
}

const currencies = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'CNY', 'JPY'];
const incoterms = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

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
    question: 'What is the difference between a commercial invoice and a proforma invoice?',
    answer:
      'Timing and legal weight. A proforma invoice is issued before shipment as a quotation-like document the buyer uses to arrange payment, import licences or letters of credit — the goods may not even be packed yet, and quantities can still change. A commercial invoice is issued for the actual shipment, with the final quantities, weights and values, and it is the document customs uses to assess duty. Never ship against a proforma: if the values clear customs on the wrong document, correcting them afterwards is slow and can draw penalties in strict regimes.',
  },
  {
    question: 'What is an HS code and where do I find the right one?',
    answer:
      'The Harmonized System code is the international classification number customs uses to identify what a product is and which duty rate applies. The first six digits are the same worldwide; countries append their own digits for finer categories. Find yours through your national customs tariff (most publish a searchable online tariff), your freight forwarder, or a customs broker — and use the same code on every shipment of the same product. Guessing a code because it carries a lower duty is misdeclaration, even when the goods themselves are perfectly legal.',
  },
  {
    question: 'Why does customs care about country of origin on every line?',
    answer:
      'Origin decides preferential duty rates under trade agreements, anti-dumping duties, sanctions and import restrictions. Two identical-looking products can face very different duty depending on where they were made, so each line of the invoice states its own origin — a single mixed shipment can legitimately contain goods of several origins. Note that origin means where the goods were manufactured or last substantially transformed, not the country you are shipping from.',
  },
  {
    question: 'Do freight and insurance belong on the commercial invoice?',
    answer:
      'That depends on the Incoterm. Under CIF or CIP the seller arranges and pays freight and insurance to destination, and customs in many countries values goods on a CIF basis, so both amounts should be shown separately so the customs value can be verified. Under FOB the invoice value usually stops at the port of loading, and adding destination freight would overstate it. The safest habit: always show freight and insurance as separate lines (this tool does) and let the declared total match the basis your Incoterm implies.',
  },
  {
    question: 'Can I declare a lower value to reduce the buyer’s duty?',
    answer:
      'No — that is undervaluation, a customs offence in every serious jurisdiction, and it backfires on the buyer as well: duty, penalties and shipment seizure are assessed against them, and their import record is flagged for future inspections. Declare the real transaction value — what the buyer actually pays for the goods. If the price is genuinely low because of a discount or a sample shipment, say so in words on the invoice ("samples supplied free of charge — value for customs purposes only") rather than inventing a number.',
  },
];

export default function CommercialInvoiceGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const [exporterName, setExporterName] = useState('Indus Textile Exports (Pvt) Ltd');
  const [exporterAddress, setExporterAddress] = useState(
    'Plot 14, Korangi Industrial Area, Karachi, Pakistan'
  );
  const [exporterTaxId, setExporterTaxId] = useState('NTN 1234567-8');
  const [exporterEmail, setExporterEmail] = useState('exports@industextile.example');
  const [importerName, setImporterName] = useState('Northgate Retail GmbH');
  const [importerAddress, setImporterAddress] = useState(
    'Hafenstraße 9, 20457 Hamburg, Germany'
  );
  const [importerTaxId, setImporterTaxId] = useState('VAT DE123456789');

  const [invoiceNumber, setInvoiceNumber] = useState('EXP-2026-014');
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [currency, setCurrency] = useState('USD');
  const [incoterm, setIncoterm] = useState('CIF');
  const [incotermPlace, setIncotermPlace] = useState('Hamburg');
  const [portLoading, setPortLoading] = useState('Karachi, Pakistan');
  const [portDischarge, setPortDischarge] = useState('Hamburg, Germany');
  const [paymentTerms, setPaymentTerms] = useState('30 days from bill of lading date');
  const [packages, setPackages] = useState('48 cartons');

  const [items, setItems] = useState<GoodsItem[]>([
    {
      id: 1,
      description: 'Cotton bed sheets, woven, dyed — set of 2',
      hsCode: '6302.31',
      origin: 'Pakistan',
      qty: '1200',
      unitPrice: '6.40',
      netWeight: '0.9',
    },
    {
      id: 2,
      description: 'Cotton bath towels, terry towelling',
      hsCode: '6302.60',
      origin: 'Pakistan',
      qty: '800',
      unitPrice: '3.85',
      netWeight: '0.45',
    },
  ]);
  const nextId = useRef(3);
  const [freight, setFreight] = useState('1150');
  const [insurance, setInsurance] = useState('85');

  const totals = useMemo(() => {
    const goods = items.reduce(
      (sum, item) => sum + parseAmount(item.qty) * parseAmount(item.unitPrice),
      0
    );
    const totalWeight = items.reduce(
      (sum, item) => sum + parseAmount(item.qty) * parseAmount(item.netWeight),
      0
    );
    const freightNum = parseAmount(freight);
    const insuranceNum = parseAmount(insurance);
    return {
      goods,
      totalWeight,
      freight: freightNum,
      insurance: insuranceNum,
      grandTotal: goods + freightNum + insuranceNum,
    };
  }, [items, freight, insurance]);

  const updateItem = (id: number, field: keyof GoodsItem, value: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [
      ...current,
      { id, description: '', hsCode: '', origin: '', qty: '1', unitPrice: '0', netWeight: '0' },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((current) =>
      current.length > 1 ? current.filter((item) => item.id !== id) : current
    );
  };

  const declarationOrigin =
    [...new Set(items.map((i) => i.origin.trim()).filter(Boolean))].join(', ') || '—';
  const declaration = `We hereby certify that the goods described in this invoice are of ${declarationOrigin} origin, that the quantities, weights and values stated are true and correct, and that this invoice is the only invoice issued for this shipment.`;

  const downloadPdf = () => {
    const doc = new JsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.text('COMMERCIAL INVOICE', margin, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${invoiceNumber || '-'}`, pageWidth - margin, y, { align: 'right' });
    y += 6;
    doc.setFontSize(10);
    doc.text(`Date: ${formatDate(invoiceDate)}`, pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.text(`Incoterms: ${incoterm} ${incotermPlace}`, pageWidth - margin, y, {
      align: 'right',
    });
    y += 6;
    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Exporter', margin, y);
    doc.text('Importer / Consignee', pageWidth / 2, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const from = doc.splitTextToSize(
      [exporterName, exporterAddress, exporterTaxId, exporterEmail].filter(Boolean).join('\n'),
      82
    ) as string[];
    const to = doc.splitTextToSize(
      [importerName, importerAddress, importerTaxId].filter(Boolean).join('\n'),
      82
    ) as string[];
    doc.text(from, margin, y);
    doc.text(to, pageWidth / 2, y);
    y += Math.max(from.length, to.length) * 4.6 + 4;
    doc.setFontSize(9.5);
    doc.text(
      `From: ${portLoading}   To: ${portDischarge}   Packages: ${packages}   Payment: ${paymentTerms}`,
      margin,
      y
    );
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 4.5, pageWidth - margin * 2, 7, 'F');
    doc.text('Description', margin + 1, y);
    doc.text('HS', 96, y);
    doc.text('Origin', 112, y);
    doc.text('Qty', 132, y, { align: 'right' });
    doc.text('Unit', 150, y, { align: 'right' });
    doc.text('Net kg', 166, y, { align: 'right' });
    doc.text('Amount', pageWidth - margin, y, { align: 'right' });
    y += 7;
    doc.setFont('helvetica', 'normal');
    for (const item of items) {
      const qty = parseAmount(item.qty);
      const amount = qty * parseAmount(item.unitPrice);
      const desc = doc.splitTextToSize(item.description || 'Goods', 58) as string[];
      doc.text(desc, margin + 1, y);
      doc.text(item.hsCode || '—', 96, y);
      doc.text(item.origin || '—', 112, y);
      doc.text(String(qty), 132, y, { align: 'right' });
      doc.text(formatMoney(parseAmount(item.unitPrice), currency), 150, y, { align: 'right' });
      doc.text((qty * parseAmount(item.netWeight)).toFixed(2), 166, y, { align: 'right' });
      doc.text(formatMoney(amount, currency), pageWidth - margin, y, { align: 'right' });
      y += Math.max(desc.length, 1) * 4.4 + 1.6;
    }
    y += 2;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    const lx = 122;
    const rx = pageWidth - margin;
    doc.text('Goods value', lx, y);
    doc.text(formatMoney(totals.goods, currency), rx, y, { align: 'right' });
    y += 5.4;
    if (totals.freight > 0) {
      doc.text('Freight', lx, y);
      doc.text(formatMoney(totals.freight, currency), rx, y, { align: 'right' });
      y += 5.4;
    }
    if (totals.insurance > 0) {
      doc.text('Insurance', lx, y);
      doc.text(formatMoney(totals.insurance, currency), rx, y, { align: 'right' });
      y += 5.4;
    }
    doc.text(`Total net weight: ${totals.totalWeight.toFixed(2)} kg`, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Total (${incoterm})`, lx, y);
    doc.text(formatMoney(totals.grandTotal, currency), rx, y, { align: 'right' });
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const dec = doc.splitTextToSize(declaration, pageWidth - margin * 2) as string[];
    doc.text(dec, margin, y);
    y += dec.length * 4.4 + 10;
    doc.line(margin, y, margin + 55, y);
    doc.text('Signature and stamp of exporter', margin, y + 5);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      'Commercial invoice created with the free Commercial Invoice Generator — freeqrcode.tools',
      margin,
      y + 14
    );
    doc.save(`commercial-invoice-${invoiceNumber || 'export'}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Commercial Invoice Generator', href: '/commercial-invoice-generator' },
        ]}
      />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Commercial Invoice Generator for Export &amp; Customs
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Build the commercial invoice customs actually wants: exporter and importer details,
          HS codes, country of origin per line, net weights, Incoterms, freight and insurance,
          and a signed origin declaration — with a live preview and a clean PDF for your
          forwarder. Everything runs in your browser; nothing is uploaded.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-semibold">Exporter and importer</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ci-exporter">Exporter (seller)</Label>
                <Input id="ci-exporter" value={exporterName} onChange={(e) => setExporterName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-exporter-tax">Exporter tax / registration ID</Label>
                <Input id="ci-exporter-tax" value={exporterTaxId} onChange={(e) => setExporterTaxId(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ci-exporter-address">Exporter address</Label>
              <Textarea id="ci-exporter-address" value={exporterAddress} onChange={(e) => setExporterAddress(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ci-exporter-email">Exporter email</Label>
              <Input id="ci-exporter-email" value={exporterEmail} onChange={(e) => setExporterEmail(e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ci-importer">Importer (buyer / consignee)</Label>
                <Input id="ci-importer" value={importerName} onChange={(e) => setImporterName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-importer-tax">Importer VAT / tax ID</Label>
                <Input id="ci-importer-tax" value={importerTaxId} onChange={(e) => setImporterTaxId(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ci-importer-address">Importer address</Label>
              <Textarea id="ci-importer-address" value={importerAddress} onChange={(e) => setImporterAddress(e.target.value)} rows={2} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-semibold">Shipment details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ci-number">Invoice number</Label>
                <Input id="ci-number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-date">Invoice date</Label>
                <Input id="ci-date" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="ci-currency">
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
              <div className="space-y-2">
                <Label htmlFor="ci-incoterm">Incoterm</Label>
                <Select value={incoterm} onValueChange={setIncoterm}>
                  <SelectTrigger id="ci-incoterm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incoterms.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ci-inco-place">Incoterm named place</Label>
                <Input id="ci-inco-place" value={incotermPlace} onChange={(e) => setIncotermPlace(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-packages">Packages (count and type)</Label>
                <Input id="ci-packages" value={packages} onChange={(e) => setPackages(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-pol">Port / place of loading</Label>
                <Input id="ci-pol" value={portLoading} onChange={(e) => setPortLoading(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-pod">Port / place of discharge</Label>
                <Input id="ci-pod" value={portDischarge} onChange={(e) => setPortDischarge(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ci-terms">Payment terms</Label>
              <Input id="ci-terms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Goods</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add line
              </Button>
            </div>
            {items.map((item) => (
              <div key={item.id} className="space-y-2 border-b border-border/50 pb-4 last:border-0">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={`ci-desc-${item.id}`}>Description of goods</Label>
                    <Input id={`ci-desc-${item.id}`} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="mt-6" onClick={() => removeItem(item.id)} aria-label="Remove line">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`ci-hs-${item.id}`}>HS code</Label>
                    <Input id={`ci-hs-${item.id}`} value={item.hsCode} onChange={(e) => updateItem(item.id, 'hsCode', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`ci-origin-${item.id}`}>Origin</Label>
                    <Input id={`ci-origin-${item.id}`} value={item.origin} onChange={(e) => updateItem(item.id, 'origin', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`ci-qty-${item.id}`}>Qty</Label>
                    <Input id={`ci-qty-${item.id}`} type="number" min="0" step="0.01" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`ci-price-${item.id}`}>Unit price</Label>
                    <Input id={`ci-price-${item.id}`} type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`ci-weight-${item.id}`}>Net kg / unit</Label>
                    <Input id={`ci-weight-${item.id}`} type="number" min="0" step="0.01" value={item.netWeight} onChange={(e) => updateItem(item.id, 'netWeight', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="ci-freight">Freight (if charged to buyer)</Label>
                <Input id="ci-freight" type="number" min="0" step="0.01" value={freight} onChange={(e) => setFreight(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci-insurance">Insurance (if charged to buyer)</Label>
                <Input id="ci-insurance" type="number" min="0" step="0.01" value={insurance} onChange={(e) => setInsurance(e.target.value)} />
              </div>
            </div>
          </Card>
        </div>

        <section className="space-y-4" aria-label="Commercial invoice preview">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> Live preview
            </h2>
            <Button type="button" onClick={downloadPdf}>
              <Download className="h-4 w-4 mr-2" /> Download PDF commercial invoice
            </Button>
          </div>
          <div className="border rounded-lg bg-white text-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-2xl font-bold tracking-wide">COMMERCIAL INVOICE</p>
                <p className="text-sm text-slate-600">For customs and export purposes.</p>
              </div>
              <div className="text-sm text-right">
                <p>
                  <span className="font-semibold">Invoice No:</span> {invoiceNumber || '—'}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {formatDate(invoiceDate)}
                </p>
                <p>
                  <span className="font-semibold">Incoterms:</span> {incoterm} {incotermPlace}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-1">Exporter</p>
                <p className="font-medium">{exporterName || 'Exporter'}</p>
                {exporterAddress ? <p className="whitespace-pre-line">{exporterAddress}</p> : null}
                {exporterTaxId ? <p>{exporterTaxId}</p> : null}
                {exporterEmail ? <p>{exporterEmail}</p> : null}
              </div>
              <div>
                <p className="font-semibold mb-1">Importer / Consignee</p>
                <p className="font-medium">{importerName || 'Importer'}</p>
                {importerAddress ? <p className="whitespace-pre-line">{importerAddress}</p> : null}
                {importerTaxId ? <p>{importerTaxId}</p> : null}
              </div>
            </div>
            <p className="text-sm text-slate-600">
              From: {portLoading} · To: {portDischarge} · Packages: {packages} · Payment:{' '}
              {paymentTerms}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 font-semibold">Description</th>
                    <th className="py-2 font-semibold">HS</th>
                    <th className="py-2 font-semibold">Origin</th>
                    <th className="py-2 font-semibold text-right">Qty</th>
                    <th className="py-2 font-semibold text-right">Unit</th>
                    <th className="py-2 font-semibold text-right">Net kg</th>
                    <th className="py-2 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-2">{item.description || 'Goods'}</td>
                      <td className="py-2">{item.hsCode || '—'}</td>
                      <td className="py-2">{item.origin || '—'}</td>
                      <td className="py-2 text-right">{parseAmount(item.qty)}</td>
                      <td className="py-2 text-right">
                        {formatMoney(parseAmount(item.unitPrice), currency)}
                      </td>
                      <td className="py-2 text-right">
                        {(parseAmount(item.qty) * parseAmount(item.netWeight)).toFixed(2)}
                      </td>
                      <td className="py-2 text-right">
                        {formatMoney(parseAmount(item.qty) * parseAmount(item.unitPrice), currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap justify-between gap-4 text-sm">
              <p>
                Total net weight:{' '}
                <span className="font-semibold">{totals.totalWeight.toFixed(2)} kg</span>
              </p>
              <div className="w-64 space-y-1.5">
                <p className="flex justify-between">
                  <span>Goods value</span>
                  <span>{formatMoney(totals.goods, currency)}</span>
                </p>
                {totals.freight > 0 && (
                  <p className="flex justify-between">
                    <span>Freight</span>
                    <span>{formatMoney(totals.freight, currency)}</span>
                  </p>
                )}
                {totals.insurance > 0 && (
                  <p className="flex justify-between">
                    <span>Insurance</span>
                    <span>{formatMoney(totals.insurance, currency)}</span>
                  </p>
                )}
                <p className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total ({incoterm})</span>
                  <span>{formatMoney(totals.grandTotal, currency)}</span>
                </p>
              </div>
            </div>
            <div className="text-sm border-t pt-4">
              <p className="text-slate-600">{declaration}</p>
              <p className="mt-8 text-slate-500">Signature and stamp of exporter: ____________</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" /> Shipping before the final values are known? Start
            with the free Proforma Invoice Generator, then issue the commercial invoice for the
            actual shipment.
          </p>
        </section>
      </div>

      <AdSlot id="commercial-invoice-generator-after-tool" format="horizontal-banner" />

      <section className="prose prose-neutral dark:prose-invert max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold">What a commercial invoice is, and why customs runs on it</h2>
        <p>
          The commercial invoice is the single most important document in an export shipment.
          It is the seller&rsquo;s formal statement of what is being shipped, who made it,
          what it is worth and who is receiving it — and it is the primary source customs
          officers use to classify the goods, assess duty and tax, check restrictions and
          release the cargo. Your buyer&rsquo;s broker builds the import declaration from it;
          your own export declaration mirrors it; the bank under a letter of credit examines
          it word by word. When the three tell different stories, the shipment stops.
        </p>
        <p>
          Unlike a domestic invoice, a commercial invoice is written for officials who know
          nothing about your business. Vague descriptions that work fine at home — &quot;spare
          parts&quot;, &quot;garments&quot;, &quot;samples&quot; — are red flags at a border. A customs-grade
          description says what the item is, what it is made of and what it is used for:
          &quot;men&rsquo;s woven cotton shirts&quot; clears; &quot;shirts&quot; invites an examination, a delay
          and a storage bill.
        </p>
        <h2 className="text-2xl font-bold">What a commercial invoice must contain</h2>
        <p>
          A complete commercial invoice carries the exporter&rsquo;s full legal name, address
          and tax or registration number; the importer&rsquo;s (consignee&rsquo;s) name,
          address and VAT or importer number; a unique invoice number and date; the currency;
          the Incoterm with its named place; ports of loading and discharge; the number and
          type of packages; and, per line, a precise description, the HS code, the country of
          origin, the quantity, the unit price, the line total and the net weight. Freight and
          insurance appear as separate lines when the Incoterm puts them on the seller. It
          closes with the total, the payment terms and the exporter&rsquo;s signed declaration
          that the particulars are true — a formula some countries require almost verbatim.
        </p>
        <h2 className="text-2xl font-bold">Incoterms, value and the mistakes that hold shipments</h2>
        <p>
          The Incoterm is not decoration: it tells customs which costs form part of the value
          and tells both parties where risk passes. Quote it with a named place — &quot;CIF
          Hamburg&quot; is a term; &quot;CIF&quot; alone is an argument waiting to happen. The declared value
          must be the real transaction value, consistent with the payment the buyer actually
          makes; customs administrations compare invoice values against payments, reference
          prices and your past shipments. The recurring causes of holds are boring and
          preventable: invoice totals that do not match the packing list; weights that differ
          between documents; missing HS codes or origin; a consignee name that differs from
          the bill of lading by one word; and totals in figures that disagree with the goods
          lines. Five minutes of cross-checking against the packing list before the documents
          leave your desk is worth days at the port.
        </p>
        <h2 className="text-2xl font-bold">Commercial invoice, proforma and packing list — who does what</h2>
        <p>
          The proforma opens the transaction: issued before shipment, it lets the buyer arrange
          funds, licences and letters of credit against expected values. The commercial invoice
          closes the documentation: issued for the goods as actually shipped, at their final
          values, it is the basis for duty. The packing list is its physical twin — same
          shipment described by packages, dimensions and gross and net weights rather than by
          money. Keep all three consistent, and keep copies for the years your tax and customs
          rules require (commonly five to ten). This generator produces the commercial invoice;
          nothing here is legal or customs advice, and for a first shipment to a new market a
          licensed customs broker is money well spent.
        </p>
      </section>

      <AdSlot id="commercial-invoice-generator-in-content" format="in-article" />

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
