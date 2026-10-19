'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MessageSquare } from 'lucide-react';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';

export default function BulkSMSQRGeneratorPage() {
  const [raw, setRaw] = useState(
    ' +15551234567 | Hi! Thanks for scanning — reply YES to join our list.\n+15557654321 | Your appointment reminder: reply CONFIRM to confirm.'
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
      const parts = line.split('|').map((p) => p.trim());
      const phone = parts[0] || '';
      const msg = parts.slice(1).join('|');
      const digits = phone.replace(/[\s\-()]/g, '');
      if (!/^\+?[0-9]{7,15}$/.test(digits) || !msg) {
        bad.push(line);
        return;
      }
      ok.push({ label: digits, payload: `SMSTO:${digits}:${msg}` });
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
        'One row per line: phone-number | message, using the vertical bar as the separator. Numbers may include a leading + and spaces, dashes, or brackets. The message is required; rows without one are reported as invalid.',
    },
    {
      question: 'What payload does an SMS QR code contain?',
      answer:
        "A SMSTO: payload with the number and the prefilled message. Scanning it opens the phone's messaging app with the recipient and message already filled in, so the user only presses send.",
    },
    {
      question: 'Why use international format for numbers?',
      answer:
        'A local-format number can misdial when scanned by a visitor or a roaming phone. International format with the country code works consistently, which matters for tourist areas, events, and multi-country lists.',
    },
    {
      question: 'Do I need consent to send SMS from these codes?',
      answer:
        'Yes, in most jurisdictions, especially for marketing. Only message people who have agreed to be contacted, make opting out obvious, and match the message to what the code promised. Get legal advice for your jurisdiction if you are unsure.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk SMS QR Generator',
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
          { label: 'Bulk SMS QR Generator', href: '/bulk-sms-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk SMS QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate many SMS QR codes at once from pasted phone-number and message rows — validated,
          previewed, and downloaded as a ZIP of PNG files.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your rows</h2>
            <p className="text-xs text-muted-foreground">
              One row per line: phone-number | message. Use the | separator. Numbers may include a
              leading + and spaces, dashes, or brackets. The message is required.
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
                    ' +15551234567 | Hi! Thanks for scanning — reply YES to join our list.\n+15557654321 | Your appointment reminder: reply CONFIRM to confirm.'
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
          SMS QR Codes at Scale, Without the Typos
        </h2>
        <p className="text-base leading-relaxed">
          An SMS QR code removes the two things people get wrong when texting a business: the number
          and the message. One scan opens the messaging app with both prefilled, so the customer
          only has to press send. That convenience is why SMS codes work well for opt-ins,
          appointment confirmations, feedback requests, and support lines. Generating them one at a
          time for a whole branch list or campaign is slow, and hand-typing numbers invites exactly
          the errors the codes exist to prevent. Bulk generation takes a pasted table of numbers and
          messages and produces the whole batch in one pass.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          The row format and why it is strict
        </h3>
        <p className="text-base leading-relaxed">
          Each line is a phone number, a vertical bar, and a message. The tool checks that the
          number looks like a real dialling string — seven to fifteen digits with an optional
          leading plus — and that a message is present. Rows that fail are listed, not silently
          dropped, so you can fix them and regenerate. Use international format with the country
          code whenever the audience may roam or the list mixes countries; a local-format number
          that works in one city will misdial from another. Keep messages short and purposeful. The
          scanner&apos;s messaging app will show the prefilled text, and the customer can edit it —
          so a clear, honest message gets sent, while a pushy or confusing one gets deleted.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Consent and compliance are not optional
        </h3>
        <p className="text-base leading-relaxed">
          SMS is a regulated channel in most places, and a QR code does not exempt you from the
          rules. Only send marketing texts to people who have agreed to receive them, and make
          opting out obvious in the message itself. Transactional messages — confirmations,
          reminders, delivery updates — have different rules from marketing in many jurisdictions,
          but the safest posture is the same: the customer chose to scan, and the message should
          match what the code promised. Never prefill a message that misrepresents who is sending it
          or what replying will do. If you are unsure, get legal advice for your jurisdiction before
          the campaign, not after the complaints.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Before you print the batch</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Scan a sample code on both iPhone and Android and confirm the number and message prefill
            correctly.
          </li>
          <li>
            Confirm every number belongs to the intended recipient or queue — a wrong digit routes a
            stranger into the conversation.
          </li>
          <li>Keep a copy of the source list with the job file so reprints are traceable.</li>
          <li>
            Test one code from the printed batch, not just from the screen, before the full run.
          </li>
          <li>Split lists over 500 rows into multiple batches and label each ZIP.</li>
        </ul>
        <p className="text-base leading-relaxed">
          Bulk SMS codes are a convenience tool. Used with clean lists, honest messages, and real
          consent, they make texting a business as easy as pointing a camera.
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
