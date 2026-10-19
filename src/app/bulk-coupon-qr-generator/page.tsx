'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Ticket } from 'lucide-react';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';

export default function BulkCouponQRGeneratorPage() {
  const [raw, setRaw] = useState(
    '20% off your first order | WELCOME20 | 2027-03-31\nFree coffee with any pastry | COFFEE-FREE | 2027-02-28\n10% off weekend bookings | WEEKEND10 | 2027-04-30'
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
    const seen = new Set<string>();
    lines.forEach((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const offer = parts[0] || '';
      const code = parts[1] || '';
      const expiry = parts[2] || '';
      if (!offer || !code) {
        bad.push(line);
        return;
      }
      if (seen.has(code.toLowerCase())) {
        bad.push(line + ' (duplicate code)');
        return;
      }
      seen.add(code.toLowerCase());
      ok.push({
        label: code,
        payload: `Coupon: ${offer}\nCode: ${code}${expiry ? `\nExpires: ${expiry}` : ''}`,
      });
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
      question: 'What format do the rows need?',
      answer:
        'One row per line: offer | code | expiry, using the vertical bar as the separator. Offer and code are required; expiry is optional. Duplicate codes are reported and skipped so every coupon stays unique.',
    },
    {
      question: 'What does a coupon QR code contain?',
      answer:
        'The offer text, the unique code, and the expiry when provided, as plain text. Scanning shows staff exactly what to honour without needing any special app.',
    },
    {
      question: 'How do I stop coupons being copied and reused?',
      answer:
        'Use unique codes, record each redemption, state the expiry and terms on the coupon, and for high-value offers require a second check such as a name or order number. A code nobody validates at the till can always be reused.',
    },
    {
      question: 'Can I print the coupons as a sheet?',
      answer:
        'Yes. Generate the batch, then use the Print coupon sheet button to print the preview cards. Check alignment and readability on the printed sheet before the full run.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Coupon QR Generator',
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
          { label: 'Bulk Coupon QR Generator', href: '/bulk-coupon-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Ticket className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Coupon QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate many unique coupon QR codes at once from offer and code rows — printable coupon
          cards, plus a ZIP of PNG files for the whole batch.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your rows</h2>
            <p className="text-xs text-muted-foreground">
              One row per line: offer | code | expiry, using the | separator. Offer and code are
              required; expiry is optional. Duplicate codes are reported and skipped.
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
                    '20% off your first order | WELCOME20 | 2027-03-31\nFree coffee with any pastry | COFFEE-FREE | 2027-02-28\n10% off weekend bookings | WEEKEND10 | 2027-04-30'
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
                <Button variant="outline" onClick={() => window.print()} className="w-full">
                  Print coupon sheet
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Coupon Batches That Staff Can Actually Redeem
        </h2>
        <p className="text-base leading-relaxed">
          A coupon QR code carries the offer and a unique code in one scannable package. The
          customer shows it, the staff member scans it, and the code tells them exactly what to
          honour — no handwriting to decipher, no photocopied voucher of uncertain origin. The value
          of the batch stands or falls on uniqueness: if every coupon carries the same code, the
          offer cannot be tracked, limited, or retired, and one share online turns a local promotion
          into an unlimited one. Bulk generation takes a table of offers and codes and produces a
          set where every code is distinct, with duplicates flagged before anything is printed.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Designing codes that behave</h3>
        <p className="text-base leading-relaxed">
          Keep codes short, readable, and self-describing: WELCOME20 beats a random string because
          staff can read it back to a customer and spot a fake. Include the expiry in the payload
          and on the printed card, in plain words, so there is no argument at the till. Decide the
          redemption rule before printing — one use per code, one per customer, or unlimited within
          the window — and make sure the till process matches it. A unique code that nobody records
          at redemption is unique in name only. If you need strict one-time redemption, the printed
          code must be checked against a list at the point of sale, whether that is a spreadsheet or
          a till system.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Fraud, sharing, and honest limits</h3>
        <p className="text-base leading-relaxed">
          Any coupon that can be photographed can be shared, and any code that is not validated can
          be copied. The practical defences are boring but effective: unique codes, a stated expiry,
          a per-code redemption record, and terms printed on the coupon. For high-value offers, add
          a second check — a name, an order number, or a membership ID — so a screenshot alone is
          not enough. For low-value offers, accept a little leakage as the cost of doing business
          and set the discount accordingly. What you should never do is print an unlimited-use code
          for a generous offer and hope it stays local. The internet is very good at finding
          generous offers.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Before you print the batch</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Scan a sample coupon and confirm the offer, code, and expiry read correctly.</li>
          <li>Brief staff on the redemption rule and what to do with an already-used code.</li>
          <li>Keep the source list with the job file so redemptions can be checked.</li>
          <li>Print the coupon sheet and check that codes, offers, and cut lines align.</li>
          <li>Split lists over 500 rows into multiple batches and label each ZIP.</li>
        </ul>
        <p className="text-base leading-relaxed">
          Coupons are promises. A batch of unique, scannable, clearly-expiring codes keeps those
          promises cheap to honour and hard to abuse.
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
