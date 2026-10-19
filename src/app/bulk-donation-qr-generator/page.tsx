'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  HeartHandshake,
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

const SAMPLE = `School Meals Fund, https://example.com/donate, 25
Library Fund, https://example.com/donate, 50
Flood Relief, https://example.com/donate, 100`;
const COLUMNS: Array<{ name: string; kind: string; required: boolean }> = [
  { name: 'Campaign', kind: 'text', required: true },
  { name: 'Donation Page URL', kind: 'url', required: true },
  { name: 'Suggested Amount', kind: 'text', required: false },
];

const faqs = [
  {
    question: 'How is the campaign tracked?',
    answer:
      'The campaign name is appended to your donation page URL as a campaign parameter, plus the suggested amount if you set one. Your donation platform must capture these parameters from the URL.',
  },
  {
    question: 'Is it safe to put a suggested amount in the QR code?',
    answer:
      'Yes, as long as the amount is only a suggestion passed to your secure donation page. Never encode bank details or payment credentials in a QR code; payment always happens on your donation page.',
  },
  {
    question: 'Should the code go straight to payment or to an appeal page?',
    answer:
      'Direct payment is fastest for audiences who already know the cause. An appeal page converts better for new donors who need to understand the cause first. Match the destination to the audience.',
  },
  {
    question: 'How do I test donation codes safely?',
    answer:
      "Make a small test donation through each code and confirm it appears under the right campaign in your reports, then refund or void the test gift according to your payment provider's process.",
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

export default function BulkDonationQrGeneratorPage() {
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
        errs.push(
          `Line ${i + 1}: ${bad}. Expected columns: Campaign, Donation Page URL, Suggested Amount (optional).`
        );
        continue;
      }
      const serial = `DON-${String(i + 1).padStart(3, '0')}`;
      const payload = ((f, i, serial) =>
        `${f[1]}${f[1].includes('?') ? '&' : '?'}campaign=${encodeURIComponent(f[0])}${f[2] ? '&amount=' + encodeURIComponent(f[2]) : ''}`)(
        f,
        i,
        serial
      );
      const label = ((f, i, serial) => `${f[0]}${f[2] ? ' - Suggested $' + f[2] : ''}`)(
        f,
        i,
        serial
      );
      const fileName = ((f, i, serial) =>
        `donate-${f[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)(f, i, serial);
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
    a.download = 'bulk-donation-qr-generator.zip';
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
    a.download = 'bulk-donation-qr-generator-manifest.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Donation QR Generator',
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
          { label: 'Bulk Donation QR Generator', href: '/bulk-donation-qr-generator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Donation QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate donation QR codes per campaign or cause from pasted rows, with printable appeal
          cards and a ZIP download.
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
            One campaign per line. Columns separated by commas, semicolons, tabs, or pipes:
            Campaign, Donation Page URL, Suggested Amount (optional). Columns: Campaign, Donation
            Page URL, Suggested Amount (optional). Up to 500 rows per batch. Nothing is uploaded;
            everything is generated in your browser.
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

      <AdSlot id="bulk-donation-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Use the Bulk Donation QR Generator
        </h2>
        <p className="text-base leading-relaxed">
          Donation QR codes turn a poster, appeal letter, or collection table into a way to give in
          under a minute. This tool generates one code per campaign, with the campaign name and an
          optional suggested amount attached to the URL, so donations arrive already tagged to the
          right cause. That tagging matters: it lets you thank donors for the specific appeal they
          answered, report honestly on what each campaign raised, and avoid the common problem of a
          single generic donate link that hides which appeal actually worked.
        </p>
        <p className="text-base leading-relaxed">
          Write campaign names that a donor can understand at a glance, and keep them consistent
          with your appeal materials, because a mismatch between the poster and the donation page
          makes donors hesitate. The suggested amount is a nudge, not a limit: pick an amount that
          reflects a typical gift for that campaign, and make sure the donation page still lets the
          donor change it freely. A suggested amount that cannot be changed will cost you both
          smaller gifts and larger ones.
        </p>

        <AdSlot id="bulk-donation-qr-generator-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          The trade-off with donation codes is between speed and trust. The fastest path is a code
          that lands directly on a payment form with the amount prefilled, but donors who have never
          heard of your organization may want to read about the cause first. A code that lands on a
          short appeal page with a clear donate button is slightly slower but converts better for
          new donors, because it answers the two questions every donor asks: what will my money do,
          and can I trust this organization. For events and collection tables where people already
          know the cause, the direct payment link wins.
        </p>
        <p className="text-base leading-relaxed">
          Never encode payment details, account numbers, or personal data in a donation QR code. The
          code should point to your secure donation page, and the payment itself should happen
          there, over HTTPS, with your payment provider. Test every code by making a small test
          donation for each campaign and confirming it appears under the right campaign in your
          reports. Print appeal cards with the campaign name, the suggested amount, and a short line
          about what the gift funds, because a code alone does not persuade anyone to give.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps donors giving is the thank-you. Every donation that arrives through a
          campaign code should be acknowledged with a message that names the campaign the donor
          supported and says what the gift will do. Generic thank-you messages feel automated, while
          a message tied to the specific appeal reminds the donor why they gave. Keep the thank-you
          prompt and honest: say what the gift funds, say when the donor will hear about progress,
          and then actually send that update. Donors who hear back give again; donors who hear
          nothing usually do not.
        </p>
      </article>

      <AdSlot id="bulk-donation-qr-generator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="bulk-donation-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
