'use client';

import React, { useState, useRef } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PawPrint, Upload, Download, FileSpreadsheet, Printer } from 'lucide-react';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';
import { AdSlot } from '@/components/AdSlot';

type Row = { label: string; payload: string; dataUrl: string };

const SAMPLE_CSV = `PetName,OwnerName,OwnerPhone,Breed,Notes
Biscuit,Sam Rivera,+15551234567,Beagle,Microchipped
Mochi,Priya Patel,+15559876543,Shiba Inu,Shy around strangers
Pepper,Alex Kim,+15553334444,Tabby cat,Indoor cat`;

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

export default function BulkPetTagQrGeneratorPage() {
  const [raw, setRaw] = useState(SAMPLE_CSV);
  const [rows, setRows] = useState<Row[]>([]);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [parseError, setParseError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const buildRow = (
    get: (key: string, fallback: number) => string
  ): { label: string; payload: string } | { error: string } => {
    const pet = get('petname', 0);
    const owner = get('ownername', 1);
    const phone = get('ownerphone', 2);
    const breed = get('breed', 3);
    const notes = get('notes', 4);
    if (!pet || !phone) return { error: 'PetName and OwnerPhone are required.' };
    return {
      label: `${pet} — ${owner || 'Owner'}`,
      payload: `Lost pet — please call owner\nPet: ${pet}\nBreed: ${breed}\nOwner: ${owner}\nPhone: ${phone}\nNotes: ${notes}`,
    };
  };

  const generate = async () => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      setParseError('Paste a header row plus at least one data row.');
      setRows([]);
      return;
    }
    const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const ok: Array<{ label: string; payload: string }> = [];
    const bad: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCsvLine(lines[i]);
      const get = (key: string, fallback: number) => {
        const idx = header.indexOf(key);
        const v = idx >= 0 ? cols[idx] : cols[fallback];
        return (v || '').trim();
      };
      const built = buildRow(get);
      if ('error' in built) {
        bad.push(`Row ${i + 1}: ${built.error} — ${lines[i]}`);
        continue;
      }
      ok.push(built);
    }
    setInvalid(bad);
    if (ok.length === 0) {
      setParseError('No valid rows found. Check the format and try again.');
      setRows([]);
      return;
    }
    if (ok.length > 500) {
      setParseError('Limit is 500 rows per batch. Split larger lists into multiple batches.');
      return;
    }
    setBusy(true);
    try {
      const out: Row[] = [];
      for (const row of ok) {
        const dataUrl = await QRCodeLib.toDataURL(row.payload, {
          errorCorrectionLevel: 'M',
          width: 512,
          margin: 2,
        });
        out.push({ ...row, dataUrl });
      }
      setRows(out);
      setParseError('');
    } catch {
      setParseError('Generation failed. Check that every payload is valid and try again.');
    } finally {
      setBusy(false);
    }
  };

  const downloadSvg = async (row: Row, i: number) => {
    const svg = await QRCodeLib.toString(row.payload, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-pet-tag-qr-generator-${String(i + 1).padStart(3, '0')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadZip = async () => {
    if (rows.length === 0) return;
    const zip = new JSZip();
    const seen = new Set<string>();
    rows.forEach((row, i) => {
      const base =
        row.label
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
      zip.file(name, row.dataUrl.split(',')[1], { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-pet-tag-qr-generator.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-pet-tag-qr-generator-sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setRaw(String(event.target?.result || ''));
    };
    reader.readAsText(file);
  };

  const faqs = [
    {
      question: 'What format do the rows need?',
      answer:
        'A header row PetName,OwnerName,OwnerPhone,Breed,Notes, then one animal per row. PetName and OwnerPhone are required; the phone number is what makes the tag useful, so double-check every number before printing.',
    },
    {
      question: 'What does each pet-tag QR code contain?',
      answer:
        'Plain text with the pet name, breed, owner name, owner phone number and any notes. Scanning shows a finder exactly who to call, without needing any special app.',
    },
    {
      question: 'Is my owner list uploaded anywhere?',
      answer:
        'No. The CSV parsing and QR rendering happen entirely in your browser. Owner names and phone numbers never leave the device.',
    },
    {
      question: 'Can I print the tags as a sheet?',
      answer:
        'Yes. Generate the batch, then use the Print All button to print the preview cards. Check alignment and readability on the printed sheet, and confirm each tag is attached to the right animal.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Pet Tag QR Generator',
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
          { label: 'Bulk Pet Tag QR Generator', href: '/bulk-pet-tag-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <PawPrint className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Pet Tag QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate one pet-tag QR code per animal from a CSV list: paste PetName, OwnerName,
          OwnerPhone, Breed and Notes, and every row becomes its own scannable tag code with per-row
          PNG/SVG downloads and a ZIP of the whole batch.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                CSV Input Data:
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSample}
                className="text-[11px] h-7 gap-1"
              >
                <FileSpreadsheet className="w-3 h-3 text-primary" />
                Download Sample CSV
              </Button>
            </div>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-muted/20"
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFile}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <div className="text-xs font-semibold text-foreground">Upload CSV File</div>
            </div>
            <div>
              <Textarea
                rows={10}
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder="PetName,OwnerName,OwnerPhone,Breed,Notes..."
                className="font-mono text-xs"
              />
            </div>
            <Button
              onClick={generate}
              disabled={busy}
              className="w-full text-xs font-semibold gap-2"
            >
              {busy
                ? 'Generating…'
                : `Generate QR Codes (${Math.max(raw.split(/\n/).filter((l) => l.trim()).length - 1, 0)} Rows)`}
            </Button>
            {parseError && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {parseError}
              </p>
            )}
            {invalid.length > 0 && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  {invalid.length} row(s) skipped — valid rows still generated:
                </p>
                <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1 max-h-40 overflow-y-auto">
                  {invalid.map((m, i) => (
                    <li key={i} className="break-all">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-7 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Generated Codes ({rows.length})
              </span>
              {rows.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={downloadZip}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download All (ZIP)
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print All
                  </Button>
                </div>
              )}
            </div>
            {rows.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-xs space-y-2">
                <PawPrint className="w-10 h-10 mx-auto stroke-1 opacity-40" />
                <p>
                  Paste or upload your CSV on the left, then generate to see one QR code per row.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto p-1">
                {rows.map((row, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-xl p-3 bg-card shadow-2xs flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={row.dataUrl}
                        alt={row.label}
                        className="w-20 h-20 shrink-0 bg-white"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-foreground break-words">
                          {row.label}
                        </div>
                        <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap break-all mt-1">
                          {row.payload}
                        </pre>
                      </div>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border/40 flex justify-end gap-3">
                      <a
                        download={`bulk-pet-tag-qr-generator-${String(i + 1).padStart(3, '0')}.png`}
                        href={row.dataUrl}
                        className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        PNG
                      </a>
                      <button
                        type="button"
                        onClick={() => downloadSvg(row, i)}
                        className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        SVG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="bulk-pet-tag-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to Use Bulk Pet Tag QR Codes</h2>
        <p className="text-base leading-relaxed">
          A pet tag earns its keep in the worst minute of an owner’s day: a stranger finds a lost
          animal and needs a phone number, fast. One code per animal, generated from a single CSV,
          keeps every tag consistent and makes it practical to tag a whole shelter or litter at
          once.
        </p>

        <AdSlot id="bulk-pet-tag-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">
          Put the phone number first in your checks
        </h3>
        <p className="text-base leading-relaxed">
          The owner phone number is the whole point of the tag. Before printing, call or message
          each number in the CSV to confirm it is current, and include a second contact in Notes
          when one exists. A tag with a dead number is worse than no tag, because it looks like help
          is available.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Print for the real world, then test
        </h3>
        <p className="text-base leading-relaxed">
          Print a sample tag at the real size and scan it outdoors in daylight, then confirm the
          scanned text matches the animal record. Keep the quiet zone clear, use dark modules on a
          light background, and protect tags from water and chewing with a durable holder.
        </p>
      </article>

      <AdSlot id="bulk-pet-tag-qr-generator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="bulk-pet-tag-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
