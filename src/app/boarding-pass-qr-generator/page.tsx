'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plane } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS = [
  {
    key: 'checkinUrl',
    label: 'Check-in URL',
    ph: 'https://www.example-airline.com/check-in',
    kind: 'text',
  },
  { key: 'bookingRef', label: 'Booking reference', ph: 'ABC123', kind: 'text' },
  { key: 'passenger', label: 'Passenger', ph: 'Alex Morgan', kind: 'text' },
  { key: 'flight', label: 'Flight', ph: 'AB 1234', kind: 'text' },
];

const DEFAULTS = { checkinUrl: '', bookingRef: '', passenger: '', flight: '' };

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.checkinUrl || '').trim()) return 'Enter the check-in URL.';
    try {
      new URL((f.checkinUrl || '').trim());
    } catch {
      return 'Enter a valid check-in URL starting with https://.';
    }
    if (!(f.bookingRef || '').trim()) return 'Enter the booking reference.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    try {
      return (f.checkinUrl || '').trim();
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
    a.download = 'boarding-pass-qr-generator.png';
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
    a.download = 'boarding-pass-qr-generator.svg';
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
        'Scanning opens the destination with the details you entered already filled in or shown. The scanner reviews it before anything is sent or saved, so nothing happens silently.',
    },
    {
      question: 'Is this a boarding pass?',
      answer:
        'No. This code opens the airline check-in page. The airline issues the actual boarding pass at check-in. Keep the booking reference printed as text so check-in works even without a scan.',
    },
    {
      question: 'Why is the booking reference not inside the QR code?',
      answer:
        'Airline check-in pages expect the traveller to enter the reference in the page form. Putting the reference on the printed card keeps it readable for agents and usable if the scan fails.',
    },
    {
      question: 'Can I print this QR code on an itinerary?',
      answer:
        'Keep the quiet zone around the code, print dark modules on a light background with strong contrast, and use a size suited to the viewing distance \u2014 at least 2 cm wide for hand-held items and larger for posters. Always print a test copy and scan it in place before the full run.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Boarding Pass QR Generator',
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
          { label: 'Boarding Pass QR Generator', href: '/boarding-pass-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Plane className="w-3.5 h-3.5" />
          <span>Travel QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Boarding Pass QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code that opens your airline check-in page, with a check-in card showing
          passenger, flight, and booking reference alongside it.
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
              Encoded as the check-in URL itself. The booking reference, passenger, and flight are
              shown on the card next to the code — they are not embedded in the QR payload.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Check-in QR</h2>
            <p className="text-sm text-muted-foreground">Scan to open check-in</p>
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
                {form.passenger.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Passenger: </span>
                    {form.passenger}
                  </p>
                )}
                {form.flight.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Flight: </span>
                    {form.flight}
                  </p>
                )}
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Booking ref: </span>
                  {form.bookingRef}
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

      <AdSlot id="boarding-pass-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Boarding Pass QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this QR code works</h3>
        <p className="text-base leading-relaxed">
          This code stores the airline’s check-in URL, and the card next to it carries the booking
          reference, passenger, and flight. Scanning opens check-in in the browser, where the
          traveller enters the booking reference shown on the card. Keep the reference on the
          printed card as readable text too, so check-in still works if the phone cannot scan.
        </p>

        <AdSlot id="boarding-pass-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">What this code is not</h3>
        <p className="text-base leading-relaxed">
          This is a link to online check-in, not an airline boarding pass. A real boarding pass is
          issued by the airline at check-in with its own secure barcode, and this tool does not
          create one. Use this code on itineraries, confirmations, and travel documents to get
          travellers to check-in quickly.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size, stick it where it will actually live, and scan it with
          two different phones in the real lighting. Check the whole journey, not just the scan: the
          page that opens should load quickly and show the right content. If any step fails, fix the
          destination before reprinting the code.
        </p>
      </article>

      <AdSlot id="boarding-pass-qr-generator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="boarding-pass-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
