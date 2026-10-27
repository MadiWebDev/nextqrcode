'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Package } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'What is in the manifest CSV?',
    answer:
      'One row per image with three columns: filename, payload (the URL or text the code encodes), and notes (placement, size, quantity). It opens in any spreadsheet app.',
  },
  {
    question: 'Why record the payload if the filename already says it?',
    answer:
      'Filenames are unreliable: a file named menu-final may encode an old or staging link. The manifest lets anyone scan the code and compare the result against the intended destination.',
  },
  {
    question: 'Which image formats should I send to print?',
    answer:
      'SVG or high-resolution PNG. Avoid JPEG, whose compression softens the sharp module edges scanners need.',
  },
  {
    question: 'Do my files leave the browser?',
    answer:
      'No. The ZIP and manifest are built entirely in your browser. Nothing is uploaded to any server.',
  },
];

export default function QrZipPackagerPage() {
  function downloadBlob(blob: Blob | null, filename: string): void {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = src;
    });
  }
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error('Could not read file'));
      r.readAsDataURL(file);
    });
  }
  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const v =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const n = parseInt(v, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function luminance(hex: string): number {
    const [r, g, b] = hexToRgb(hex).map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrastRatio(a: string, b: string): number {
    const l1 = luminance(a);
    const l2 = luminance(b);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  const [rows, setRows] = useState<{ name: string; file: File; payload: string; notes: string }[]>(
    []
  );
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  async function onFiles(list: FileList | null) {
    if (!list) return;
    setRows(Array.from(list).map((f) => ({ name: f.name, file: f, payload: '', notes: '' })));
    setStatus('');
    setError('');
  }
  function update(i: number, field: 'payload' | 'notes', value: string) {
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, [field]: value } : r)));
  }
  function csvEscape(v: string): string {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  async function downloadZip() {
    try {
      if (rows.length === 0) {
        setError('Add QR images first.');
        return;
      }
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (const r of rows) zip.file(r.name, await r.file.arrayBuffer());
      const lines = [
        'filename,payload,notes',
        ...rows.map((r) => [csvEscape(r.name), csvEscape(r.payload), csvEscape(r.notes)].join(',')),
      ];
      zip.file('manifest.csv', lines.join('\n'));
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, 'qr-print-handoff.zip');
      setStatus(
        `ZIP downloaded: ${rows.length} image${rows.length === 1 ? '' : 's'} plus manifest.csv.`
      );
    } catch {
      setError('ZIP download failed. Try again with fewer files.');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR ZIP Packager',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
          { label: 'QR ZIP Packager', href: '/qr-zip-packager' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Package className="w-3.5 h-3.5" />
          <span>Batch Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR ZIP Packager
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Package uploaded QR images into a ZIP with a manifest CSV (filename, payload, notes) for
          handoff to print.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="zp-files">Select QR images to package</Label>
            <Input
              id="zp-files"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-emerald-600">{status}</p>}
          <Button onClick={downloadZip} disabled={rows.length === 0}>
            Download ZIP with manifest
          </Button>
          <p className="text-xs text-muted-foreground">
            The manifest records the payload (destination URL or text) and your notes for each file,
            so the printer or designer can verify every code without guessing. Files never leave
            your browser.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Manifest entries ({rows.length})
          </p>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Select images to fill in the manifest.</p>
          ) : (
            <div className="space-y-4">
              {rows.map((r, i) => (
                <div key={i} className="rounded border p-3 space-y-2">
                  <p className="text-xs font-mono font-semibold">{r.name}</p>
                  <div className="space-y-1">
                    <Label>Payload (URL or text the code encodes)</Label>
                    <Input
                      value={r.payload}
                      onChange={(e) => update(i, 'payload', e.target.value)}
                      placeholder="https://example.com/menu"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Notes (placement, size, quantity)</Label>
                    <Input
                      value={r.notes}
                      onChange={(e) => update(i, 'notes', e.target.value)}
                      placeholder="Window, 150mm, 2 copies"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <AdSlot id="qr-zip-packager-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Hand Off QR Artwork to Print Without Errors
        </h2>
        <p className="text-base leading-relaxed">
          Most QR print errors are not design errors. They are handoff errors: the printer receives
          a folder of images with cryptic names, no record of what each code links to, and no note
          about where it goes or how big it should be. The printer guesses, the wrong code ends up
          on the wrong sign, and the mistake is discovered by a customer. A manifest fixes this by
          traveling with the artwork. It is a simple table, one row per file, recording the
          filename, the payload the code encodes, and the placement notes. Anyone who opens the ZIP
          can verify every code without asking a single question.
        </p>
        <p className="text-base leading-relaxed">
          The payload column is the most valuable part of the manifest, because filenames cannot be
          trusted to describe content. A file named menu-final-v3 may encode last season&apos;s
          menu, a staging URL, or a link with a typo, and nothing in the filename will say so.
          Writing the intended destination next to each filename makes verification possible: the
          printer or designer can scan the code and compare the result against the manifest in
          seconds. Do this before you send the ZIP, not after, because a mismatch caught at your
          desk costs a minute and a mismatch caught after printing costs the whole run.
        </p>
        <AdSlot id="qr-zip-packager-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          Notes should answer the three questions the printer will ask: where does this go, how big
          should it be, and how many do I print. Window, 150 millimeters, two copies is a complete
          instruction. Table tents, 60 millimeters, 40 copies is another. Include the material or
          finish if it matters, such as matte laminate for outdoor use, and flag anything unusual,
          such as a code that sits on a curved surface or behind glass. If a code has already been
          test-scanned at final size, say so in the notes; it tells the printer the artwork is
          approved and stops a well-meaning operator from resizing it to fit a layout.
        </p>
        <p className="text-base leading-relaxed">
          File hygiene matters as much as the manifest. Send the highest-resolution files you have,
          keep filenames stable after the manifest is written, and never rename a file without
          updating its manifest row. Export for print in SVG or high-resolution PNG, and avoid JPEG,
          whose compression softens the module edges. If the handoff includes codes for several
          locations or campaigns, split them into clearly named folders or separate ZIPs rather than
          mixing them into one long manifest where a row can be skipped. A handoff that is boring to
          read is a handoff that works: every row identical in structure, every field filled, no
          surprises.
        </p>
        <p className="text-base leading-relaxed">
          Keep a copy of the exact ZIP you sent. When a reprint is needed months later, the sent ZIP
          plus its manifest is the only reliable record of what was actually printed. If a
          destination URL changes, update the code, the manifest, and the stored ZIP together, and
          note the change in the manifest notes. That discipline turns QR artwork from a pile of
          disposable images into a controlled set of assets that can be audited, reprinted, and
          trusted.
        </p>
      </article>
      <AdSlot id="qr-zip-packager-pre-related" format="horizontal-banner" />
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq, i) => (
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
      <AdSlot id="qr-zip-packager-bottom" format="horizontal-banner" />
    </div>
  );
}
