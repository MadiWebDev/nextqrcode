'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  FileText,
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

const SAMPLE = `Product Manual, https://example.com/manual.pdf
Price List 2026, https://example.com/prices.pdf
Safety Sheet, https://example.com/safety.pdf`;
const COLUMNS: Array<{ name: string; kind: string; required: boolean }> = [
  { name: 'Title', kind: 'text', required: true },
  { name: 'PDF URL', kind: 'url', required: true },
];

const faqs = [
  {
    question: 'What happens if a URL in my list is invalid?',
    answer:
      'That row is flagged in the error list and no QR code is generated for it, so a broken link never silently enters your batch. Fix the URL, keeping the https:// prefix, and generate again.',
  },
  {
    question: 'Should I link directly to the PDF or to a landing page?',
    answer:
      'Direct PDF links are fastest for manuals and safety sheets. A landing page is better for brochures where you want context and related links. Either works with this tool, since the QR code simply encodes the URL you provide.',
  },
  {
    question: 'Why do longer PDF URLs make harder-to-scan codes?',
    answer:
      'A QR code stores the whole URL, so a longer URL needs more modules. More modules mean smaller squares at the same print size, which are harder for cameras to resolve. Short URLs on your own domain scan more reliably at small sizes.',
  },
  {
    question: 'Can I regenerate the batch if a PDF moves to a new URL?',
    answer:
      'If you set up a redirect from the old URL, existing printed codes keep working with no reprint. Otherwise, update the URL in your list and generate a fresh batch, then reprint the affected codes.',
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

export default function BulkPdfQrGeneratorPage() {
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
        errs.push(`Line ${i + 1}: ${bad}. Expected columns: Title, PDF URL.`);
        continue;
      }
      const serial = `PDF-${String(i + 1).padStart(3, '0')}`;
      const payload = ((f, i, serial) => f[1])(f, i, serial);
      const label = ((f, i, serial) => f[0])(f, i, serial);
      const fileName = ((f, i, serial) =>
        `pdf-${String(i + 1).padStart(3, '0')}-${f[0]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')}`)(f, i, serial);
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
    a.download = 'bulk-pdf-qr-generator.zip';
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
    a.download = 'bulk-pdf-qr-generator-manifest.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk PDF QR Generator',
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
          { label: 'Bulk PDF QR Generator', href: '/bulk-pdf-qr-generator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk PDF QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate QR codes for many PDF URLs from pasted rows, with URL validation, a preview grid,
          and a ZIP download of every code.
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
            One PDF per line. Columns separated by commas, semicolons, tabs, or pipes: Title, PDF
            URL. Every URL must start with https:// or http://. Columns: Title, PDF URL. Up to 500
            rows per batch. Nothing is uploaded; everything is generated in your browser.
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
        <h2 className="text-2xl font-bold text-foreground">How to Use the Bulk PDF QR Generator</h2>
        <p className="text-base leading-relaxed">
          Linking a QR code to a PDF is one of the most practical uses of QR codes: a brochure,
          manual, menu, price list, or safety sheet can be updated on your server while the printed
          code stays the same. This tool takes a list of titles and PDF URLs and turns each one into
          a QR code, so you can produce a whole set of document codes in one batch instead of
          building them one at a time. The result is a ZIP of PNG files plus a manifest that records
          which code points to which document.
        </p>
        <p className="text-base leading-relaxed">
          Before you paste your rows, make sure every PDF lives at a stable public URL that does not
          require a login. A code that opens a sign-in page instead of the document will confuse the
          person who scanned it. Prefer short, readable URLs on your own domain, and avoid links
          with long tracking strings, because longer URLs produce denser QR codes that need a larger
          print size to scan reliably. If a document moves, set up a redirect from the old URL
          rather than reprinting the code.
        </p>
        <p className="text-base leading-relaxed">
          There is a trade-off between linking straight to a PDF and linking to a landing page that
          then links to the PDF. A direct PDF link is the fastest experience for the scanner, but
          some phones download the file instead of previewing it, which can feel abrupt. A landing
          page lets you add context, a download button, and related documents, at the cost of one
          extra tap. For manuals and safety sheets where speed matters, link directly; for marketing
          brochures where presentation matters, a landing page usually wins.
        </p>
        <p className="text-base leading-relaxed">
          Print each code at a size suited to where it will be seen, and always test the full
          journey: scan the printed code, confirm the correct PDF opens, and check that the PDF is
          readable on a phone screen without pinching and zooming. Keep your PDFs reasonably small
          and mobile-friendly, name the files clearly in your manifest, and re-check the links
          periodically, because a PDF code is only as good as the document it points to.
        </p>
        <p className="text-base leading-relaxed">
          A detail that is easy to overlook is the file name of the PDF itself. When a scanned
          document downloads to a guest&apos;s phone, the file name is what they see in their
          downloads folder, so a name like price-list-march-2026.pdf is far more useful than
          document-final-v7.pdf. Keep file names short, dated, and descriptive, and match them to
          the title in your manifest so you can find the right file months later. If a document is
          updated, keep the same URL and file name where possible, because a stable link protects
          every code you have already printed.
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
