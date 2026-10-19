'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';
import { Contact } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function BulkMeCardGeneratorPage() {
  const [raw, setRaw] = useState(
    'first, last, phone, email, url, org\nAyesha,Khan,+92 300 1234567,ayesha@example.com,https://example.com,Example Ltd\nBilal,Ahmed,+92 321 7654321,bilal@example.com,https://example.com,Example Ltd\nSara,Ali,+92 333 1112233,sara@example.com,https://example.com,Example Ltd'
  );
  const [items, setItems] = useState<Array<{ label: string; payload: string; dataUrl: string }>>(
    []
  );
  const [invalid, setInvalid] = useState<string[]>([]);
  const [parseError, setParseError] = useState('');
  const [busy, setBusy] = useState(false);
  const splitCsvLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        out.push(cur.trim());
        cur = '';
      } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };
  const parseRows = () => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const ok: Array<{ label: string; payload: string }> = [];
    const bad: string[] = [];
    lines.forEach((line) => {
      if (
        /^[^,]*,(title|name|first|guest|attendee|recipient|product|dish|tracking|survey|code|offer)/i.test(
          line
        ) &&
        lines.indexOf(line) === 0
      )
        return;
      const parts = line.includes(',') ? splitCsvLine(line) : line.split('|').map((p) => p.trim());
      const row = (i: number) => (parts[i] || '').trim();
      const built = (() => {
        const first = row(0);
        const last = row(1);
        if (!first && !last) return null;
        const tel = row(2);
        const email = row(3);
        const url = row(4);
        const org = row(5);
        const payload =
          'MECARD:N:' +
          last +
          ',' +
          first +
          ';' +
          (org ? 'ORG:' + org + ';' : '') +
          (tel ? 'TEL:' + tel + ';' : '') +
          (email ? 'EMAIL:' + email + ';' : '') +
          (url ? 'URL:' + url + ';' : '') +
          ';';
        return { label: (first + ' ' + last).trim(), payload };
      })();
      if (!built) {
        bad.push(line);
        return;
      }
      ok.push(built);
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
      for (const row2 of ok) {
        const dataUrl = await QRCodeLib.toDataURL(row2.payload, {
          errorCorrectionLevel: 'M',
          width: 512,
          margin: 2,
        });
        out.push({ ...row2, dataUrl });
      }
      setItems(out);
    } catch {
      setParseError('Generation failed. Check that every payload is valid and try again.');
    } finally {
      setBusy(false);
    }
  };
  const downloadOne = (it: { label: string; dataUrl: string }) => {
    const a = document.createElement('a');
    a.href = it.dataUrl;
    a.download =
      it.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) + '.png';
    a.click();
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
      let name = String(i + 1).padStart(3, '0') + '-' + base + '.png';
      let n = 1;
      while (seen.has(name)) {
        n += 1;
        name = String(i + 1).padStart(3, '0') + '-' + base + '-' + n + '.png';
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
      question: 'What format do the rows need?',
      answer:
        'One row per line, comma-separated, or with the | separator. The first row is treated as a header and skipped when it looks like a header row. Rows that are missing a required field are reported and skipped without blocking the valid rows.',
    },
    {
      question: 'Can I use a spreadsheet?',
      answer:
        'Yes. Export the sheet as CSV, then paste the CSV text here. Keep one record per row and keep the column order shown above the input.',
    },
    {
      question: 'How many rows can I generate at once?',
      answer:
        'Up to 500 rows per batch. Split larger lists into multiple batches and label each ZIP.',
    },
    {
      question: 'Does my data leave my browser?',
      answer: 'No. Every QR code is generated locally in your browser. Nothing is uploaded.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk MeCard Generator',
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
          { label: 'Bulk MeCard Generator', href: '/bulk-mecard-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Contact className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk MeCard Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate many compact MeCard contact QR codes at once from CSV rows — smaller payloads
          than vCard, ideal for printed cards and badges.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your rows</h2>
            <p className="text-xs text-muted-foreground">
              Columns: first, last, phone, email, url, org. First or last name is required. Example:
              Ayesha,Khan,+92 300 1234567,ayesha@example.com,https://example.com,Example Ltd
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
                onClick={() =>
                  setRaw(
                    'first, last, phone, email, url, org\nAyesha,Khan,+92 300 1234567,ayesha@example.com,https://example.com,Example Ltd\nBilal,Ahmed,+92 321 7654321,bilal@example.com,https://example.com,Example Ltd\nSara,Ali,+92 333 1112233,sara@example.com,https://example.com,Example Ltd'
                  )
                }
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
            {parseError && (
              <p className="text-sm text-red-600" role="alert">
                {parseError}
              </p>
            )}
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
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm text-muted-foreground">
              {items.length > 0
                ? items.length + ' QR code(s) ready.'
                : 'Generate to see a preview grid and download a ZIP.'}
            </p>
            {items.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {items.slice(0, 12).map((it, i) => (
                    <div key={i} className="rounded-lg border p-2 text-center">
                      <img src={it.dataUrl} alt={it.label} className="w-full h-auto" />
                      <p className="text-[10px] text-muted-foreground truncate mt-1">{it.label}</p>
                      <button
                        type="button"
                        onClick={() => downloadOne(it)}
                        className="text-[10px] font-semibold text-primary underline"
                      >
                        PNG
                      </button>
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
                <Button variant="outline" onClick={() => window.print()} className="w-full">
                  Print sheet
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="bulk-mecard-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Compact Contact Codes for Teams</h2>
        <p className="text-base leading-relaxed">
          MeCard is the compact cousin of vCard: name, organisation, phone, email, and URL in a
          single short string. Shorter payloads make simpler QR codes that scan faster and print
          smaller, which is why MeCard is a good fit for printed contact cards, badges, and
          directories where space is tight.
        </p>

        <AdSlot id="bulk-mecard-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">MeCard vs vCard</h3>
        <p className="text-base leading-relaxed">
          vCard carries more fields and richer structure; MeCard carries the essentials in fewer
          characters. Use MeCard when the contact is a name, a phone number, an email, and a link.
          Use vCard when you need addresses, multiple numbers, or notes. Both are read by modern
          phones.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Before you print the batch</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Scan a sample code and confirm the contact saves with the right name and number.</li>
          <li>Check phone numbers include the country code so the card works for every scanner.</li>
          <li>Keep email addresses free of typos — a wrong letter sends replies nowhere.</li>
          <li>Re-check the list after edits: a duplicate row creates a duplicate card.</li>
        </ul>
      </article>
      <AdSlot id="bulk-mecard-generator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="bulk-mecard-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
