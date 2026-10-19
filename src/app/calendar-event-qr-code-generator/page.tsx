'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CalendarDays } from 'lucide-react';
import QRCodeLib from 'qrcode';

type FieldDef = { key: string; label: string; ph: string; kind: string; options?: string[] };

const FIELDS: FieldDef[] = [
  { key: 'title', label: 'Event title', ph: 'Team offsite planning day', kind: 'text' },
  { key: 'start', label: 'Start date and time', ph: '', kind: 'datetime-local' },
  { key: 'end', label: 'End date and time', ph: '', kind: 'datetime-local' },
  { key: 'location', label: 'Location', ph: 'Room 4, Main Street Hall', kind: 'text' },
  { key: 'description', label: 'Description', ph: 'Bring notes and a laptop.', kind: 'textarea' },
];

const DEFAULTS: Record<string, string> = {
  title: '',
  start: '',
  end: '',
  location: '',
  description: '',
};

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.title || '').trim()) return 'Enter an event title.';
    if (!(f.start || '')) return 'Pick a start date and time.';
    if ((f.end || '') && f.end < f.start) return 'The end time must be after the start time.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    try {
      const fmt = (s: string) => (s || '').replace(/[-:]/g, '').replace('T', 'T');
      const st = fmt(f.start);
      const en = fmt(f.end || f.start);
      const esc = (s: string) =>
        (s || '')
          .replace(/\\/g, '\\\\')
          .replace(/;/g, '\\;')
          .replace(/,/g, '\\,')
          .replace(/\n/g, '\\n');
      return (
        'BEGIN:VEVENT\nSUMMARY:' +
        esc(f.title) +
        '\nDTSTART:' +
        st +
        '\nDTEND:' +
        en +
        '\nLOCATION:' +
        esc(f.location) +
        '\nDESCRIPTION:' +
        esc(f.description) +
        '\nEND:VEVENT'
      );
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
    a.download = 'calendar-event-qr-code-generator.png';
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
    a.download = 'calendar-event-qr-code-generator.svg';
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
        'Scanning opens the right app for this code \u2014 for example a mail, messaging, calendar, wallet or browser app \u2014 with the details you entered already filled in. The scanner reviews it before anything is sent or saved, so nothing happens silently.',
    },
    {
      question: 'Will this QR code work on iPhone and Android?',
      answer:
        'Yes, in nearly all cases. Modern iPhone and Android cameras read QR codes natively, and the formats used here \u2014 links, mailto:, SMSTO:, VEVENT and MeCard \u2014 are handled by the built-in apps. Test on both platforms before a large print run if your audience is mixed.',
    },
    {
      question: 'Do calendar QR codes work on both iPhone and Android?',
      answer:
        'In most cases yes. iPhone and Android calendar apps both recognise the VEVENT format. A small number of older or minimal calendar apps may show the raw text instead, so test on the devices your audience actually uses.',
    },
    {
      question: 'Can I print this QR code on flyers, cards and posters?',
      answer:
        'Yes. Download the PNG for print or the SVG for large formats, keep the quiet zone around the code, and use a size suited to the viewing distance \u2014 at least 2 cm wide for hand-held items and larger for posters. Always print a test copy and scan it in place before the full run.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calendar Event QR Code Generator',
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
          { label: 'Calendar Event QR Code Generator', href: '/calendar-event-qr-code-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Event QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Calendar Event QR Code Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code that adds an event with title, dates, location and description straight
          to the scanner&apos;s phone calendar.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter the details</h2>
            {FIELDS.map((fd) => (
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
                    type={fd.kind === 'datetime-local' || fd.kind === 'date' ? fd.kind : 'text'}
                    value={form[fd.key] || ''}
                    onChange={(e) => set(fd.key, e.target.value)}
                    placeholder={fd.ph}
                  />
                )}
              </div>
            ))}
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
              Encoded as a VEVENT calendar block. Phones offer to add it to the calendar app when
              scanned.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Calendar event</h2>
            <p className="text-sm text-muted-foreground">Scan to save this event</p>
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
                {FIELDS.filter((fd) => (form[fd.key] || '').trim()).map((fd) => (
                  <p key={fd.key} className="text-xs text-slate-700">
                    <span className="font-semibold">{fd.label}: </span>
                    {form[fd.key]}
                  </p>
                ))}
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

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Calendar Event QR Code Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this QR code works</h3>
        <p className="text-base leading-relaxed">
          A calendar QR code stores a VEVENT block with the event title, start and end times,
          location and description. Scanning it prompts the phone to add the event to the calendar,
          which is far more reliable than asking people to copy dates from a poster. Always set an
          end time: an event without one can appear as an all-day entry or a zero-length event
          depending on the calendar app. Use the venue&apos;s full address in the location field so
          the calendar entry can link to maps.
        </p>
        <h3 className="text-xl font-semibold text-foreground">What to put around the code</h3>
        <p className="text-base leading-relaxed">
          Before you print, think about what the scanner sees first. A QR code without context gets
          ignored, so the card around it should say what happens after the scan in one line. Keep
          the destination live and stable: a printed code cannot be edited, so if the link, number
          or address changes, every printed copy goes stale. When the destination is a page you
          control, keep its address short and permanent rather than rebuilding it each season.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Test the code the way your audience will use it. Print a sample at the real size, stick it
          where it will actually live, and scan it with two different phones — one iPhone and one
          Android — in the real lighting. Check the whole journey, not just the scan: the page that
          opens should load quickly, show the right content, and work without forcing an app install
          or a login. If any step fails, fix the destination before reprinting the code.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Print size, contrast and placement
        </h3>
        <p className="text-base leading-relaxed">
          Print quality decides whether the code scans at all. Keep the code at least 2 cm wide for
          hand-held material and larger for anything viewed from a distance. Preserve the quiet zone
          — the blank margin around the code — and print dark modules on a light background with
          strong contrast. Avoid glossy lamination that creates reflections, curved surfaces that
          distort the grid, and tiny codes squeezed into a corner of the layout.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Common mistakes to avoid</h3>
        <p className="text-base leading-relaxed">
          Common mistakes are easy to avoid. The most frequent is a typo in the destination, so
          always open the generated link yourself before printing. The second is printing a code
          that points to a test page, a draft, or a private link the public cannot open. The third
          is forgetting an expiry or a deadline in the surrounding text. A short checklist —
          destination correct, page live, code tested on two phones, text complete — catches nearly
          every failure before it reaches print.
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
