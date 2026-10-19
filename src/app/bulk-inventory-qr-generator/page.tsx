'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Package,
  Download,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Trash2,
  FileArchive,
} from 'lucide-react';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';

type Item = { label: string; payload: string; dataUrl: string; fileName: string };

const SAMPLE = `SKU-1001, Bluetooth Speaker, Shelf A3
SKU-1002, USB-C Cable 2m, Shelf B1
SKU-1003, Laptop Stand, Shelf A3`;
const COLUMNS: Array<{ name: string; kind: string; required: boolean }> = [
  { name: 'SKU', kind: 'text', required: true },
  { name: 'Item Name', kind: 'text', required: true },
  { name: 'Location', kind: 'text', required: false },
];

const faqs = [
  {
    question: 'What should I do if two items share a SKU?',
    answer:
      'Fix the catalogue before printing. Duplicate SKUs mean a scan cannot tell two items apart, which defeats the purpose of labelling. Give each distinct item its own SKU, then regenerate the batch.',
  },
  {
    question: 'Should the location be inside the QR code or only on the label?',
    answer:
      'If items move often, keep location as printed text only and encode just the SKU and name, so a move means reprinting a label rather than changing what the code means. If locations are stable, encoding the location makes the scan self-explanatory.',
  },
  {
    question: 'How large should inventory labels be?',
    answer:
      "Large enough to scan from a normal working distance, typically at least 3 cm of QR code width for shelf labels scanned at arm's length, with a clear white margin. Larger labels suit high shelves scanned from the floor.",
  },
  {
    question: 'Can I use these codes with my existing stock system?',
    answer:
      'Yes, if your system can accept a scanned SKU. The payload starts with the SKU, so most barcode and QR scanners will deliver it as typed input. Test one label with your system before printing the full run.',
  },
];

function kindOf(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('url')) return 'url';
  if (n.includes('email')) return 'email';
  if (n.includes('phone')) return 'phone';
  return 'text';
}

function splitLine(line: string): string[] {
  const delim = line.includes('|')
    ? '|'
    : line.includes('\t')
      ? '\t'
      : line.includes(';')
        ? ';'
        : ',';
  return line.split(delim).map((s) => s.trim());
}

function validValue(kind: string, value: string): boolean {
  if (kind === 'url') return /^https?:\/\/[^\s]+$/.test(value);
  if (kind === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (kind === 'phone') return /^[+\d][\d\s().-]{5,}$/.test(value);
  return value.length > 0;
}

export default function BulkInventoryQrGeneratorPage() {
  const [raw, setRaw] = useState('');
  const [size, setSize] = useState(512);
  const [items, setItems] = useState<Item[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleGenerate() {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const errs: string[] = [];
    if (lines.length === 0) {
      setErrors(['Paste at least one row before generating.']);
      setItems([]);
      setDone(false);
      return;
    }
    if (lines.length > 500) {
      setErrors([
        'This tool handles up to 500 rows per batch. Split larger lists into batches of 500.',
      ]);
      setItems([]);
      setDone(false);
      return;
    }
    setBusy(true);
    setErrors([]);
    setDone(false);
    const out: Item[] = [];
    for (let i = 0; i < lines.length; i++) {
      const f = splitLine(lines[i]);
      let bad = '';
      COLUMNS.forEach((c, ci) => {
        const v = f[ci] || '';
        if (c.required && !v) bad = `missing ${c.name}`;
        else if (v && !validValue(c.kind, v)) bad = `invalid ${c.name} (${v})`;
      });
      if (bad) {
        errs.push(`Line ${i + 1}: ${bad}. Expected columns: SKU, Item Name, Location (optional).`);
        continue;
      }
      const serial = `INV-${String(i + 1).padStart(4, '0')}`;
      const payload = ((f, i, serial) => `SKU:${f[0]} | ${f[1]} | Loc: ${f[2] || 'Unassigned'}`)(
        f,
        i,
        serial
      );
      const label = ((f, i, serial) => `${f[0]} - ${f[1]}${f[2] ? ' (' + f[2] + ')' : ''}`)(
        f,
        i,
        serial
      );
      const fileName = ((f, i, serial) =>
        `inventory-${f[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)(f, i, serial);
      try {
        const dataUrl = await QRCodeLib.toDataURL(payload, {
          width: size,
          margin: 2,
          errorCorrectionLevel: 'M',
        });
        out.push({ label, payload, dataUrl, fileName });
      } catch {
        errs.push(`Line ${i + 1}: could not generate a QR code for this row.`);
      }
    }
    setItems(out);
    setErrors(errs);
    setBusy(false);
    setDone(true);
  }

  function downloadOne(item: Item) {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = `${item.fileName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function downloadZip() {
    if (items.length === 0) return;
    const zip = new JSZip();
    items.forEach((item) => {
      zip.file(`${item.fileName}.png`, item.dataUrl.split(',')[1], { base64: true });
    });
    const manifest = [
      'fileName,label,payload',
      ...items.map(
        (it) =>
          `"${it.fileName}.png","${it.label.replace(/"/g, '""')}","${it.payload.replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ),
    ].join('\n');
    zip.file('manifest.csv', manifest);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-inventory-qr-generator.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadManifest() {
    const manifest = [
      'fileName,label,payload',
      ...items.map(
        (it) =>
          `"${it.fileName}.png","${it.label.replace(/"/g, '""')}","${it.payload.replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ),
    ].join('\n');
    const blob = new Blob([manifest], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-inventory-qr-generator-manifest.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Inventory QR Generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Bulk Inventory QR Generator', href: '/bulk-inventory-qr-generator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Package className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Inventory QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate QR labels for inventory SKUs from pasted SKU and name rows, with a label-sheet
          preview and a ZIP download of every code.
        </p>
      </header>

      <Card className="p-6 border-border/80 shadow-xs space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="bulk-input">Paste your rows (one per line)</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setRaw(SAMPLE)}>
                Load sample rows
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRaw('');
                  setItems([]);
                  setErrors([]);
                  setDone(false);
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
              </Button>
            </div>
          </div>
          <textarea
            id="bulk-input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="text-xs text-muted-foreground mt-2">
            One item per line. Columns separated by commas, semicolons, tabs, or pipes: SKU, Item
            Name, Location (optional). Columns: SKU, Item Name, Location (optional). Up to 500 rows
            per batch. Nothing is uploaded; everything is generated in your browser.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <Label htmlFor="qr-size">QR code size: {size} px</Label>
          </div>
          <Slider
            value={[size]}
            min={256}
            max={1024}
            step={64}
            onValueChange={([v]) => setSize(v)}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>256 px (small)</span>
            <span>512 px (standard)</span>
            <span>1024 px (print)</span>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={busy} className="gap-2">
          <QrCode className="w-4 h-4" />
          {busy ? 'Generating...' : `Generate ${items.length > 0 ? 'again' : 'QR codes'}`}
        </Button>

        {errors.length > 0 && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Some rows were skipped
            </p>
            {errors.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        )}

        {done && items.length === 0 && errors.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No valid rows found. Check the column format and try again.
          </p>
        )}

        {items.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> {items.length} QR code
                {items.length === 1 ? '' : 's'} generated
              </span>
              <Button size="sm" onClick={downloadZip} className="gap-1.5">
                <FileArchive className="w-3.5 h-3.5" /> Download ZIP of all PNGs
              </Button>
              <Button size="sm" variant="outline" onClick={downloadManifest}>
                Download manifest CSV
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.fileName}
                  className="rounded-xl border border-border/70 bg-card p-3 text-center"
                >
                  <img
                    src={item.dataUrl}
                    alt={`QR code for ${item.label}`}
                    className="w-full h-auto rounded-md bg-white p-1"
                  />
                  <p className="text-xs font-medium mt-2 break-words">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground break-all mt-1">{item.payload}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full gap-1"
                    onClick={() => downloadOne(item)}
                  >
                    <Download className="w-3 h-3" /> PNG
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Use the Bulk Inventory QR Generator
        </h2>
        <p className="text-base leading-relaxed">
          Inventory labels work best when the QR code carries the identifier your whole operation
          already uses: the SKU. Scanning a shelf label should take a worker straight to the right
          record, not to a mystery code that only makes sense after a lookup table is consulted.
          This tool encodes the SKU, the item name, and the location in every code, so a scan is
          readable even on a phone with no stock app installed, and the label doubles as a
          human-readable shelf tag.
        </p>
        <p className="text-base leading-relaxed">
          Start from a clean export of your stock list, one row per item, and decide on a single SKU
          format before you print. SKUs with mixed formats, duplicate SKUs, or SKUs that differ only
          by a space are the most common cause of inventory errors, and no label tool can fix a
          messy catalogue. Keep the item name short and consistent, and use the location column to
          record where the item actually lives, not where it is supposed to live, because the label
          will be trusted on the shelf.
        </p>
        <p className="text-base leading-relaxed">
          The main trade-off is between encoding a short SKU-only payload and a richer payload with
          name and location. SKU-only codes are smaller, scan faster, and stay valid if you rename
          an item or move it. Richer payloads are self-explanatory and keep working if your stock
          system is down, but they become stale the moment an item moves. A good middle ground is to
          encode the SKU plus the name, and treat location as printed text on the label rather than
          as data inside the code, so moves only require reprinting the label, not changing the
          code&apos;s meaning.
        </p>
        <p className="text-base leading-relaxed">
          Print on durable labels suited to the environment: moisture-resistant stock for warehouses
          with condensation, and strong adhesive for bins that are handled often. Place labels at a
          consistent height and angle so scanning becomes a habit rather than a hunt. After
          printing, scan a sample of labels from a normal working distance to confirm the codes read
          on the first try, and reprint any that need a second attempt.
        </p>
        <p className="text-base leading-relaxed">
          One habit that keeps an inventory system honest is the weekly spot check. Pick a small
          random sample of items, scan their labels, and compare what the scan says with what is
          actually on the shelf. If a scan disagrees with the shelf, fix the record on the spot
          rather than noting it for later, because small discrepancies compound into stock counts
          nobody trusts. Over time, the spot checks will also reveal which labels fail first: labels
          near windows, near heat, or on bins that are handled daily. Replace those with tougher
          stock before they become unreadable.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
