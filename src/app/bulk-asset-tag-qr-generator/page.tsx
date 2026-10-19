'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Tags,
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
import { AdSlot } from '@/components/AdSlot';

type Item = { label: string; payload: string; dataUrl: string; fileName: string };

const SAMPLE = `AST-001, Laptop, Office 2
AST-002, Projector, Meeting Room A
AST-003, Drill, Workshop`;
const COLUMNS: Array<{ name: string; kind: string; required: boolean }> = [
  { name: 'Asset ID', kind: 'text', required: true },
  { name: 'Category', kind: 'text', required: true },
  { name: 'Location', kind: 'text', required: true },
];

const faqs = [
  {
    question: 'Should I encode the asset details or just the ID?',
    answer:
      'ID plus category suits most offices: the code stays small and useful even offline, without leaking sensitive details. ID-only codes are best for high-value or public-facing assets, since the details stay in your register.',
  },
  {
    question: 'What if an asset moves to a different room?',
    answer:
      'Update your register and reprint the tag with the new location. Leaving a stale tag on the asset will mislead the next audit and can send someone hunting in the wrong room.',
  },
  {
    question: 'Can I reuse an asset ID after an item is disposed of?',
    answer:
      'Do not reuse IDs. Retired assets keep their records, and a reused ID would make old and new records indistinguishable. Retire the ID along with the asset.',
  },
  {
    question: 'What information should never go on an asset tag?',
    answer:
      'Avoid purchase prices, sensitive serial numbers, and personal data. Tags can be scanned by anyone who can see them, so keep the payload to what a visitor may safely read.',
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

export default function BulkAssetTagQrGeneratorPage() {
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
        errs.push(`Line ${i + 1}: ${bad}. Expected columns: Asset ID, Category, Location.`);
        continue;
      }
      const serial = `AST-${String(i + 1).padStart(4, '0')}`;
      const payload = ((f, i, serial) =>
        `ASSET|${f[0]}|${f[1] || 'General'}|${f[2] || 'Unassigned'}`)(f, i, serial);
      const label = ((f, i, serial) => `${f[0]} - ${f[1] || 'General'}${f[2] ? ' - ' + f[2] : ''}`)(
        f,
        i,
        serial
      );
      const fileName = ((f, i, serial) =>
        `asset-${f[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)(f, i, serial);
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
    a.download = 'bulk-asset-tag-qr-generator.zip';
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
    a.download = 'bulk-asset-tag-qr-generator-manifest.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Asset Tag QR Generator',
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
          { label: 'Bulk Asset Tag QR Generator', href: '/bulk-asset-tag-qr-generator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Tags className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Asset Tag QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate asset-tag QR codes with IDs, categories, and locations from pasted rows, with a
          tag-sheet preview and a ZIP download.
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
            One asset per line. Columns separated by commas, semicolons, tabs, or pipes: Asset ID,
            Category, Location. Category and Location are optional. Columns: Asset ID, Category,
            Location. Up to 500 rows per batch. Nothing is uploaded; everything is generated in your
            browser.
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

      <AdSlot id="bulk-asset-tag-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Use the Bulk Asset Tag QR Generator
        </h2>
        <p className="text-base leading-relaxed">
          Asset tags answer a simple question: what is this thing, who owns it, and where does it
          belong. A QR asset tag makes that answer available to anyone with a phone, which is far
          more useful than a barcode that only your asset software understands. This tool turns a
          list of asset IDs, categories, and locations into printable tags in one batch, so you can
          label a whole office, classroom block, or workshop in an afternoon.
        </p>
        <p className="text-base leading-relaxed">
          Give every asset a stable ID that never gets reused, even after the asset is retired.
          Reusing IDs creates confusion in audits, because an old record and a new item will share
          the same tag. Keep categories broad and consistent, such as Laptop, Projector, or Tool,
          and record the location where the asset normally lives. If an asset moves permanently,
          update your register and reprint its tag rather than leaving a tag that points to the
          wrong room.
        </p>

        <AdSlot id="bulk-asset-tag-qr-generator-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          The trade-off with asset tags is between a code that encodes the details and a code that
          encodes only the ID. An ID-only code is small, scans fast, and never goes stale, but it is
          useless without your register. A detailed payload is self-explanatory during an audit in a
          room with no connectivity, but it can leak information if the asset is in a public space.
          For most offices, ID plus category is the right balance; avoid encoding purchase prices,
          serial numbers of sensitive equipment, or personal data on tags that visitors can scan.
        </p>
        <p className="text-base leading-relaxed">
          Choose tag material for the environment: laminated paper for office equipment, metal or
          tough polyester for tools and outdoor assets. Place tags where they are visible but not
          where they will be worn away by hands or heat. After tagging, walk the site and scan a
          sample from each area, then record the audit date, because a tagging project that is never
          checked will quietly drift out of date.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps asset tags useful is the annual audit walk. Once a year, walk every
          room with your register, scan each tag, and note anything missing, damaged, or in the
          wrong place. The audit is also the moment to remove tags from disposed assets and to
          record their disposal, so the register never carries ghost assets that inflate your
          inventory. If an audit finds the same room losing tags repeatedly, the cause is usually
          environmental, such as heat, moisture, or cleaning chemicals, and switching that room to
          tougher tag material will fix it more reliably than reprinting the same tags again.
        </p>
      </article>

      <AdSlot id="bulk-asset-tag-qr-generator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="bulk-asset-tag-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
