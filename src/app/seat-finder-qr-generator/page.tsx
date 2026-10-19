'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Armchair } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS = [
  { key: 'venue', label: 'Venue', ph: 'Grand Arena', kind: 'text' },
  { key: 'section', label: 'Section', ph: 'A', kind: 'text' },
  { key: 'row', label: 'Row', ph: '5', kind: 'text' },
  { key: 'seat', label: 'Seat', ph: '12', kind: 'text' },
  {
    key: 'mapUrl',
    label: 'Seat map URL (optional)',
    ph: 'https://example.com/arenas/grand/seat-map',
    kind: 'text',
  },
];

const DEFAULTS = { venue: '', section: '', row: '', seat: '', mapUrl: '' };

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.venue || '').trim()) return 'Enter the venue.';
    if (!(f.seat || '').trim()) return 'Enter the seat.';
    if ((f.mapUrl || '').trim()) {
      try {
        new URL((f.mapUrl || '').trim());
      } catch {
        return 'Enter a valid seat map URL starting with https://, or leave it blank.';
      }
    }
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    try {
      if ((f.mapUrl || '').trim()) return (f.mapUrl || '').trim();
      const lines = ['SEAT', 'Venue: ' + (f.venue || '').trim()];
      if ((f.section || '').trim()) lines.push('Section: ' + (f.section || '').trim());
      if ((f.row || '').trim()) lines.push('Row: ' + (f.row || '').trim());
      lines.push('Seat: ' + (f.seat || '').trim());
      return lines.join('\n');
    } catch {
      return '';
    }
  }, [form, error]);

  useEffect(() => {
    let live = true;
    if (!payload) return;
    QRCodeLib.toDataURL(payload, { width: 512, margin: 2, errorCorrectionLevel: 'M' })
      .then((u) => {
        if (live) setQrUrl(u);
      })
      .catch(() => {
        if (live) setQrUrl('');
      });
    return () => {
      live = false;
    };
  }, [payload]);

  const downloadPng = () => {
    if (!payload || !qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'seat-finder-qr-generator.png';
    a.click();
  };
  const downloadSvg = async () => {
    if (!payload) return;
    const svg = await QRCodeLib.toString(payload, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seat-finder-qr-generator.svg';
    a.click();
    URL.revokeObjectURL(url);
  };
  const copyPayload = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What happens when someone scans this QR code?',
      answer:
        'If you entered a seat map URL, scanning opens that map. Otherwise scanning shows the seat locator as plain text, readable by any phone camera.',
    },
    {
      question: 'Do I need a seat map link?',
      answer:
        'No. Leave the seat map URL blank and the code stores the venue, section, row, and seat as text. A map link helps in large venues where a text locator alone is hard to follow.',
    },
    {
      question: 'Should the seat also be printed as text?',
      answer:
        'Yes. The ticket should show the seat label in readable text, so the seat is still findable if the phone battery dies or the code cannot scan.',
    },
    {
      question: 'Can I print this QR code on tickets?',
      answer:
        'Keep the quiet zone around the code, print dark modules on a light background with strong contrast, and use a size suited to the viewing distance \u2014 at least 2 cm wide for hand-held items and larger for posters. Always print a test copy and scan it in place before the full run.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Seat Finder QR Generator',
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
          { label: 'Seat Finder QR Generator', href: '/seat-finder-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Armchair className="w-3.5 h-3.5" />
          <span>Venue QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Seat Finder QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a seat-specific QR for a venue — venue, section, row, and seat — that opens the
          seat map, plus a seat-label preview for the ticket.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter the details</h2>
            {FIELDS.map(
              (fd: {
                key: string;
                label: string;
                ph: string;
                kind: string;
                options?: string[];
              }) => (
                <div key={fd.key} className="space-y-2">
                  <Label htmlFor={fd.key}>{fd.label}</Label>
                  {fd.kind === 'textarea' ? (
                    <textarea
                      id={fd.key}
                      value={form[fd.key] || ''}
                      onChange={(e) => set(fd.key, e.target.value)}
                      placeholder={fd.ph}
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  ) : fd.kind === 'select' ? (
                    <select
                      id={fd.key}
                      value={form[fd.key] || ''}
                      onChange={(e) => set(fd.key, e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {(fd.options || []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={fd.key}
                      type={
                        fd.kind === 'number'
                          ? 'number'
                          : fd.kind === 'datetime-local' || fd.kind === 'date'
                            ? fd.kind
                            : 'text'
                      }
                      value={form[fd.key] || ''}
                      onChange={(e) => set(fd.key, e.target.value)}
                      placeholder={fd.ph}
                    />
                  )}
                </div>
              )
            )}
            <div className="space-y-2">
              <Label>QR preview size: {qrSize}px</Label>
              <Slider
                value={[qrSize]}
                min={140}
                max={320}
                step={10}
                onValueChange={([v]) => setQrSize(v)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </Card>

          <Card className="p-6 border-border/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold">Encoded payload</h2>
            <p className="text-xs text-muted-foreground">
              This is exactly what the QR code contains. Check it before printing.
            </p>
            <pre className="whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs font-mono">
              {payload || 'Fill in the fields above to generate the payload.'}
            </pre>
            <p className="text-xs text-muted-foreground">
              If you entered a seat map URL, the code opens that map. Otherwise it stores the seat
              locator as plain text that any scanner can read.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Seat QR</h2>
            <p className="text-sm text-muted-foreground">Scan to find the seat</p>
            <div className="rounded-xl bg-white p-4 text-center border">
              {payload && qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt="Generated QR code"
                  style={{ width: qrSize, height: qrSize }}
                  className="mx-auto"
                />
              ) : (
                <div
                  className="flex items-center justify-center text-sm text-muted-foreground"
                  style={{ height: qrSize }}
                >
                  Enter valid details to generate your QR code.
                </div>
              )}
              <div className="mt-3 text-left space-y-1">
                <p className="text-sm font-semibold text-slate-900">{form.venue}</p>
                <p className="text-base font-bold text-slate-900">
                  Section {form.section || '—'} · Row {form.row || '—'} · Seat {form.seat}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadPng} disabled={!payload || !qrUrl} className="text-xs">
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={downloadSvg}
                disabled={!payload}
                className="text-xs"
              >
                Download SVG
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG is best for everyday printing. SVG stays sharp at poster and banner sizes.
            </p>
          </Card>
        </div>
      </div>
      <AdSlot id="seat-finder-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Seat Finder QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this QR code works</h3>
        <p className="text-base leading-relaxed">
          This code carries the seat locator two ways. With a seat map URL, scanning opens the map
          so the ticket holder can find the seat visually. Without one, the code stores the locator
          itself as plain text — venue, section, row, seat — so it works with no map at all. Either
          way, the seat label is printed as readable text on the ticket, because a lost phone should
          not mean a lost seat.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Writing a seat label that ushers can read
        </h3>
        <p className="text-base leading-relaxed">
          Keep the label in the order people navigate: venue, section, row, seat. Use the venue’s
          own naming for sections — if the venue calls it Block A, print Block A, not Section A. One
          consistent format across every ticket means ushers can direct people without decoding each
          ticket.
        </p>
        <AdSlot id="seat-finder-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a ticket at its real size and scan it at the distance an usher holds a ticket.
          Confirm the seat map page, if linked, shows the right venue and loads quickly on a phone
          standing in a crowded foyer.
        </p>
      </article>

      <AdSlot id="seat-finder-qr-generator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="seat-finder-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
