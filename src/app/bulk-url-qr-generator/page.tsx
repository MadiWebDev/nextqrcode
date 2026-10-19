'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Link2 } from 'lucide-react';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';

export default function BulkURLQRGeneratorPage() {
  const [raw, setRaw] = useState(
    'https://example.com/menu\nhttps://example.com/booking\nhttps://example.com/reviews'
  );
  const [items, setItems] = useState<Array<{ label: string; payload: string; dataUrl: string }>>(
    []
  );
  const [invalid, setInvalid] = useState<string[]>([]);
  const [parseError, setParseError] = useState('');
  const [busy, setBusy] = useState(false);

  const parseRows = () => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const ok: Array<{ label: string; payload: string }> = [];
    const bad: string[] = [];
    lines.forEach((line) => {
      try {
        const u = new URL(line.startsWith('http') ? line : `https://${line}`);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad scheme');
        ok.push({ label: u.hostname + u.pathname, payload: u.toString() });
      } catch {
        bad.push(line);
      }
    });
    return { ok, bad };
  };

  const generate = async () => {
    setParseError('');
    const { ok, bad } = parseRows();
    setInvalid(bad);
    if (ok.length === 0) {
      setParseError('No valid rows found. Check the format and try again.');
      setItems([]);
      return;
    }
    if (ok.length > 500) {
      setParseError('Limit is 500 rows per batch. Split larger lists into multiple batches.');
      return;
    }
    setBusy(true);
    try {
      const out: Array<{ label: string; payload: string; dataUrl: string }> = [];
      for (const row of ok) {
        const dataUrl = await QRCodeLib.toDataURL(row.payload, {
          errorCorrectionLevel: 'M',
          width: 512,
          margin: 2,
        });
        out.push({ ...row, dataUrl });
      }
      setItems(out);
    } catch {
      setParseError('Generation failed. Check that every payload is valid and try again.');
    } finally {
      setBusy(false);
    }
  };
  const downloadZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();
    const seen = new Set<string>();
    items.forEach((it, i) => {
      const base =
        it.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60) || 'qr';
      let name = `${String(i + 1).padStart(3, '0')}-${base}.png`;
      let n = 1;
      while (seen.has(name)) {
        n += 1;
        name = `${String(i + 1).padStart(3, '0')}-${base}-${n}.png`;
      }
      seen.add(name);
      zip.file(name, it.dataUrl.split(',')[1], { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: 'How many URLs can I generate at once?',
      answer:
        'Up to 500 rows per batch. Larger lists should be split into multiple batches so the browser stays responsive and each ZIP stays easy to audit.',
    },
    {
      question: 'What format should the list be in?',
      answer:
        'One URL per line, with no extra columns or quotes. A missing scheme is treated as https. Only http and https URLs are accepted; anything else is reported as invalid.',
    },
    {
      question: 'Do my URLs leave my browser?',
      answer:
        'No. Generation and ZIP packaging run entirely in your browser. Nothing is uploaded, and nothing is stored — the list exists only on the page until you close it.',
    },
    {
      question: 'Why should bulk codes point at redirects?',
      answer:
        'A redirect you control lets the destination change without reprinting. For long-lived printed codes, that turns a future URL change from a production job into a quick edit.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk URL QR Generator',
    applicationCategory: 'DesignApplication',
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
          { label: 'Bulk URL QR Generator', href: '/bulk-url-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Link2 className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk URL QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste up to 500 URLs and generate all their QR codes at once — preview grid, then download
          the whole batch as a ZIP of PNG files.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your rows</h2>
            <p className="text-xs text-muted-foreground">
              One URL per line. A missing scheme is treated as https. Only http and https URLs are
              accepted.
            </p>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={10}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={busy}>
                {busy ? 'Generating…' : 'Generate QR codes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRaw(
                    'https://example.com/menu\nhttps://example.com/booking\nhttps://example.com/reviews'
                  );
                }}
              >
                Load sample rows
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRaw('');
                  setItems([]);
                }}
              >
                Clear
              </Button>
            </div>
            {parseError && <p className="text-sm text-red-600">{parseError}</p>}
            {invalid.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                <p className="font-semibold text-amber-700">
                  {invalid.length} row(s) skipped — fix and re-generate:
                </p>
                <ul className="list-disc pl-5 mt-1 text-amber-800">
                  {invalid.slice(0, 10).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm text-muted-foreground">
              {items.length > 0
                ? `${items.length} QR code(s) ready.`
                : 'Generate to see a preview grid and download a ZIP.'}
            </p>
            {items.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {items.slice(0, 12).map((it, i) => (
                    <div key={i} className="rounded-lg border p-2 text-center">
                      <img src={it.dataUrl} alt={it.label} className="w-full h-auto" />
                      <p className="text-[10px] text-muted-foreground truncate mt-1">{it.label}</p>
                    </div>
                  ))}
                </div>
                {items.length > 12 && (
                  <p className="text-xs text-muted-foreground">
                    Showing first 12 of {items.length}. The ZIP contains all of them.
                  </p>
                )}
                <Button onClick={downloadZip} className="w-full">
                  Download ZIP of PNGs
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Generating Hundreds of QR Codes Without the Drudgery
        </h2>
        <p className="text-base leading-relaxed">
          Making one QR code is a minute&apos;s work. Making three hundred, one at a time, is an
          afternoon of copy, paste, download, and rename — and every repetition is a chance to
          mistype a URL or mislabel a file. Bulk generation exists to collapse that whole job into
          one pass: paste the list, check the validation report, preview the grid, and download a
          ZIP whose filenames match the destinations. The tool on this page runs entirely in your
          browser, so the list never leaves your computer, and it caps batches at 500 rows so the
          browser stays responsive.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Preparing a clean list</h3>
        <p className="text-base leading-relaxed">
          Bulk output is only as good as the input list, so the preparation matters more than the
          generation. Keep one URL per line, with no extra columns, quotes, or trailing spaces.
          Decide the canonical form before you paste: pick one host spelling, one trailing-slash
          rule, and one set of tracking parameters, and apply them uniformly. A list that mixes www
          and bare domains, or that carries a different UTM tag on every line, produces codes that
          look identical but behave differently, and the mix-up surfaces weeks later in analytics.
          If the destinations share a pattern, generate the list in a spreadsheet with a formula so
          the pattern is consistent, then paste the finished column.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Validation before download</h3>
        <p className="text-base leading-relaxed">
          The tool validates every line as a URL and reports the ones it could not parse, so a typo
          does not silently become a broken code. Still, validation only checks the shape of the
          address, not whether the page exists. Before a large print run, open a sample of the
          destinations — especially any typed by hand — and confirm each one loads. For codes that
          will live a long time, the strongest move is to point them at redirects you control: the
          printed code then survives any future change to the destination, and a bulk reprint
          becomes an edit instead of a production job.
        </p>
        <h3 className="text-xl font-semibold text-foreground">From ZIP to finished job</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Check the ZIP filenames against your list before sending anything to print — filenames
            are your audit trail.
          </li>
          <li>
            Test-scan a handful of codes from the ZIP at final print size, on two different phones.
          </li>
          <li>
            Keep short URLs where possible: shorter payloads mean lower-version codes with larger,
            more forgiving modules.
          </li>
          <li>
            For labelled batches, keep the source list with the job file so reprints and corrections
            are traceable.
          </li>
          <li>
            Split lists over 500 rows into multiple batches, and name each ZIP by its contents.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Bulk generation turns a tedious afternoon into a ten-minute job. Spend the saved time on
          the list and the proof, which is where the quality actually lives.
        </p>
      </article>
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
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
