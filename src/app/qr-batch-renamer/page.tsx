'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Files } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'Why pad the counter with zeros?',
    answer:
      'So files sort in numeric order. Without padding, menu-10 sorts before menu-2. Three-digit padding keeps batches up to 999 files in true order everywhere.',
  },
  {
    question: 'Are my original files changed?',
    answer:
      'No. The tool reads your files and writes renamed copies into a ZIP. Your originals stay exactly as they were.',
  },
  {
    question: 'Can labels contain spaces or special characters?',
    answer:
      'Labels are sanitized to letters, numbers, dashes, and underscores. Spaces and symbols are replaced or removed so filenames work in links, scripts, and every operating system.',
  },
  {
    question: 'What if my label list is shorter than my file list?',
    answer:
      'Files without a matching label are renamed with just the prefix and counter. Files with labels get the label appended. Check the preview to confirm the alignment.',
  },
];

export default function QrBatchRenamerPage() {
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

  const [files, setFiles] = useState<{ name: string; file: File }[]>([]);
  const [prefix, setPrefix] = useState('qr');
  const [separator, setSeparator] = useState('-');
  const [start, setStart] = useState(1);
  const [pad, setPad] = useState(3);
  const [labels, setLabels] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const labelList = labels.split('\n').map((l) => l.trim());
  const renamed = files.map((f, i) => {
    const ext = f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.')) : '';
    const num = String(start + i).padStart(pad, '0');
    const label = labelList[i]
      ? separator + labelList[i].replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '')
      : '';
    return { oldName: f.name, newName: `${prefix}${separator}${num}${label}${ext}` };
  });
  function onFiles(list: FileList | null) {
    if (!list) return;
    setFiles(Array.from(list).map((f) => ({ name: f.name, file: f })));
    setStatus('');
    setError('');
  }
  async function downloadZip() {
    try {
      if (files.length === 0) {
        setError('Add files first.');
        return;
      }
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (let i = 0; i < files.length; i++) {
        const buf = await files[i].file.arrayBuffer();
        zip.file(renamed[i].newName, buf);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, 'renamed-qr-files.zip');
      setStatus(
        `ZIP downloaded with ${files.length} renamed file${files.length === 1 ? '' : 's'}.`
      );
    } catch {
      setError('ZIP download failed. Try again with fewer files.');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Batch Renamer',
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
          { label: 'QR Batch Renamer', href: '/qr-batch-renamer' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Files className="w-3.5 h-3.5" />
          <span>Batch Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Batch Renamer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Rename many downloaded QR files by pattern — prefix plus counter plus label — entirely
          in-browser, then download the ZIP.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="br-files">Select QR files to rename</Label>
            <Input id="br-files" type="file" multiple onChange={(e) => onFiles(e.target.files)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="br-prefix">Prefix</Label>
              <Input id="br-prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="br-sep">Separator</Label>
              <Input
                id="br-sep"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="br-start">Start number</Label>
              <Input
                id="br-start"
                type="number"
                min={0}
                value={start}
                onChange={(e) => setStart(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Zero padding: {pad}</Label>
              <Slider value={[pad]} min={1} max={5} step={1} onValueChange={([v]) => setPad(v)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="br-labels">Optional labels, one per line (matched in file order)</Label>
            <textarea
              id="br-labels"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              placeholder={'menu\nwindow\nreceipt'}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-emerald-600">{status}</p>}
          <Button onClick={downloadZip} disabled={files.length === 0}>
            Download renamed ZIP
          </Button>
          <p className="text-xs text-muted-foreground">
            Files never leave your browser. Original files are untouched; the ZIP contains copies
            under the new names.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Rename preview ({renamed.length})
          </p>
          {renamed.length === 0 ? (
            <p className="text-sm text-muted-foreground">Select files to see the new names.</p>
          ) : (
            <ul className="space-y-2 text-xs font-mono">
              {renamed.map((r, i) => (
                <li key={i} className="rounded border p-2">
                  <span className="text-muted-foreground line-through">{r.oldName}</span>
                  <br />
                  <span>{r.newName}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-batch-renamer-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Rename a Batch of QR Files Without Losing Track
        </h2>
        <p className="text-base leading-relaxed">
          A folder full of files named qrcode-1, qrcode-2, and download-47 is a mistake waiting to
          happen. The wrong file goes to the printer, the menu code ends up on the receipt, and
          nobody notices until customers start scanning. A naming pattern fixes this by making every
          filename carry its own meaning: a prefix that says what the batch is, a counter that keeps
          files in order, and a label that says where the code goes. The pattern in this tool
          produces names like menu-001-window or campaign-012-receipt, which sort correctly, read
          clearly, and survive being emailed, zipped, and handed to a printer.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-batch-renamer-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Zero padding is the detail that makes sorting work. Without it, a computer sorts menu-1,
          menu-10, menu-11, menu-2, which scrambles any batch larger than nine files. With
          three-digit padding, menu-001 through menu-120 sort in true numeric order in every file
          manager, every ZIP tool, and every print queue. Choose the padding from the size of the
          batch: three digits covers up to 999 files, and four digits covers larger runs. Keep the
          separator consistent across the whole batch, because mixing dashes and underscores creates
          two sorting schemes in one folder and invites errors when files are matched by script or
          by eye.
        </p>
        <p className="text-base leading-relaxed">
          Labels should be short, lowercase, and free of spaces and special characters. Spaces in
          filenames break links, confuse command-line tools, and get encoded as percent-20 in URLs.
          Accented characters and symbols can behave differently on different operating systems, so
          this tool sanitizes labels to letters, numbers, dashes, and underscores automatically.
          Write labels that describe the placement or purpose, such as window, table-4, or checkout,
          rather than the content, because the content can change while the placement stays the
          same. One label per line, matched to the file order shown in the preview, keeps the
          mapping honest.
        </p>
        <p className="text-base leading-relaxed">
          Always check the preview before downloading the ZIP. The preview shows every old name next
          to its new name, so a misaligned label list or a wrong start number is visible before it
          becomes a problem. A common error is pasting labels in a different order than the files
          were selected, which silently assigns the wrong label to every file. If the preview looks
          wrong, fix the labels and check again; the original files are never modified, so a mistake
          costs a minute, not a print run. Keep the start number meaningful as well: continuing a
          sequence from a previous batch avoids duplicate names when two batches land in the same
          folder.
        </p>
        <p className="text-base leading-relaxed">
          After downloading, keep one record of what each file contains. A filename says where a
          code goes, but it does not say what URL it encodes, and that is the mapping you will need
          when a link changes. A simple spreadsheet or manifest with filename, destination URL, and
          placement is enough, and it turns a future update from a scavenger hunt into a five-minute
          job. Store that record with the ZIP, not in a separate folder, so the next person who
          opens the batch finds the map with the territory.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-batch-renamer-pre-related" format="horizontal-banner" />

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

      {/* Bottom AdSlot */}
      <AdSlot id="qr-batch-renamer-bottom" format="horizontal-banner" />
    </div>
  );
}
