'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  GraduationCap,
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

const SAMPLE = `Ayesha Khan, STU-2026-001, Grade 9-A
Bilal Ahmed, STU-2026-002, Grade 9-A
Chen Wei, STU-2026-003, Grade 10-B`;
const COLUMNS: Array<{ name: string; kind: string; required: boolean }> = [
  { name: 'Name', kind: 'text', required: true },
  { name: 'Student ID', kind: 'text', required: true },
  { name: 'Class', kind: 'text', required: false },
];

const faqs = [
  {
    question: 'What data should a student ID QR code contain?',
    answer:
      'Only what the card needs: the student ID, the name, and the class. Never encode dates of birth, addresses, phone numbers, or grades, since cards can be lost and codes can be scanned by anyone.',
  },
  {
    question: 'What should happen when a student loses their card?',
    answer:
      'Report it, block the old card in your system, and issue a replacement. A lost card with a working QR code should not keep authorizing attendance, loans, or payments.',
  },
  {
    question: 'Does the student ID change when a student changes class?',
    answer:
      'In most schools the ID stays the same for the whole enrollment and only the printed class changes. Keep the ID stable and reprint the card when the class changes.',
  },
  {
    question: 'Can these codes be used for attendance?',
    answer:
      'Yes, if your attendance system accepts a scanned student ID. Test with your actual scanners first, and keep a manual fallback for students who forget their cards.',
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

export default function BulkStudentIdQrGeneratorPage() {
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
        errs.push(`Line ${i + 1}: ${bad}. Expected columns: Name, Student ID, Class (optional).`);
        continue;
      }
      const serial = `STU-${String(i + 1).padStart(4, '0')}`;
      const payload = ((f, i, serial) => `STUDENT|${f[1]}|${f[0]}|${f[2] || ''}`)(f, i, serial);
      const label = ((f, i, serial) => `${f[0]} - ${f[1]}${f[2] ? ' (' + f[2] + ')' : ''}`)(
        f,
        i,
        serial
      );
      const fileName = ((f, i, serial) =>
        `student-${f[1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)(f, i, serial);
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
    a.download = 'bulk-student-id-qr-generator.zip';
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
    a.download = 'bulk-student-id-qr-generator-manifest.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Student ID QR Generator',
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
          { label: 'Bulk Student ID QR Generator', href: '/bulk-student-id-qr-generator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Student ID QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate student-ID QR codes from pasted name, ID, and class rows, with an ID-card layout
          preview and a ZIP download.
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
            One student per line. Columns separated by commas, semicolons, tabs, or pipes: Name,
            Student ID, Class (optional). Columns: Name, Student ID, Class (optional). Up to 500
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
        <h2 className="text-2xl font-bold text-foreground">
          How to Use the Bulk Student ID QR Generator
        </h2>
        <p className="text-base leading-relaxed">
          Student ID cards with QR codes make attendance, library loans, and canteen payments
          faster, because a scan replaces typing a long ID number by hand. This tool builds a batch
          of student QR codes from a simple roster: name, student ID, and class. Each code encodes
          the student ID first, so a scanner delivers the identifier your school system already
          uses, with the name and class alongside for human verification.
        </p>
        <p className="text-base leading-relaxed">
          Work from your official enrollment roster, not from a hand-typed list, and double-check ID
          numbers before printing, because a wrong digit on an ID card can follow a student for a
          whole year. Keep the class column current, and decide in advance whether the card is
          reprinted when a student changes class. For most schools, the ID number stays the same for
          the student&apos;s whole enrollment while the class is printed text that can be updated at
          the next reprint.
        </p>
        <p className="text-base leading-relaxed">
          The important trade-off is privacy. A student ID code is convenient, but it is also
          personal data about a minor, so it must be treated with care. Encode only what the card
          needs to function: the ID, the name, and the class. Do not encode dates of birth, home
          addresses, phone numbers, or grades. Cards should be collected or deactivated when a
          student leaves, and lost cards should be reported so the old ID can be blocked rather than
          trusted.
        </p>
        <p className="text-base leading-relaxed">
          Print on sturdy card stock or laminate the cards, and include the student&apos;s name in
          large readable text next to the code so staff can verify identity without a scanner. Test
          scanning with the school&apos;s actual devices, including older phones, and keep a small
          number of blank spare cards for replacements. Review your card policy with school
          leadership so everyone agrees on what a scan authorizes and what it does not.
        </p>
        <p className="text-base leading-relaxed">
          A detail that matters more than it seems is the photo policy. If your ID cards carry a
          photo, decide in advance who takes it, where it is stored, and who may see it, because a
          student photo is personal data just like the ID number. Cards should be printed from the
          school&apos;s own systems, not sent to an outside printer with an unencrypted roster, and
          spare cards should be stored securely rather than left in an open drawer. When a student
          leaves, collect the card and remove their record from the active list, so a former
          student&apos;s card cannot keep opening doors it should no longer open.
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
