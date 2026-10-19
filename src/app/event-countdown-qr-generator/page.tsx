'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CalendarClock } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'eventName', label: 'Event name', ph: 'Spring Makers Market', kind: 'text' },
    { key: 'eventUrl', label: 'Event page URL', ph: 'https://example.com/event', kind: 'text' },
    { key: 'eventDate', label: 'Event start date and time', ph: '', kind: 'datetime-local' },
  ];

const DEFAULTS = { eventName: '', eventUrl: '', eventDate: '' };

function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function inputTypeFor(kind: string) {
  if (kind === 'number' || kind === 'date' || kind === 'datetime-local') return kind;
  return 'text';
}

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const countdown = useMemo(() => {
    const target = Date.parse(form.eventDate || '');
    if (!target) return null;
    const diff = Math.max(0, target - now);
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
      past: target <= now,
    };
  }, [form.eventDate, now]);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.eventName || '').trim()) return 'Enter the event name.';
    if (!isValidUrl(f.eventUrl || ''))
      return 'Enter a valid event page URL starting with https://.';
    if (!(f.eventDate || '').trim() || Number.isNaN(Date.parse(f.eventDate || '')))
      return 'Enter the event start date and time.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.eventUrl;
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
    a.download = 'event-countdown-qr-generator.png';
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
    a.download = 'event-countdown-qr-generator.svg';
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
      question: 'Does the QR code itself show the countdown?',
      answer:
        'No. A QR code stores a link, not a live display. The code opens your event page, and the countdown runs there. The preview on this page shows the same countdown so you can check it before printing.',
    },
    {
      question: 'What happens after the event starts?',
      answer:
        'The countdown reaches zero and the preview shows that the event has started. The QR code still opens the event page, so update the page after the event with photos, results, or the next date rather than leaving a stale countdown.',
    },
    {
      question: 'Which time zone does the countdown use?',
      answer:
        "The countdown counts down to the date and time you enter, interpreted in the browser's local time zone. Enter the event's local start time, and label the time zone on the event page so scanners in other zones are not confused.",
    },
    {
      question: 'Will this QR code work on iPhone and Android?',
      answer:
        'Yes. Modern iPhone and Android cameras read QR codes natively and open the event page in the browser. Test on both platforms before a large print run if your audience is mixed.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Event Countdown QR Generator',
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
          { label: 'Event Countdown QR Generator', href: '/event-countdown-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <CalendarClock className="w-3.5 h-3.5" />
          <span>Event QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Event Countdown QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code that opens your event page with a live countdown, so every poster, flyer,
          and ticket builds anticipation right up to the start.
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
                    type={inputTypeFor(fd.kind)}
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
              The QR encodes the event page URL. The countdown lives on that page or in your
              promotion: the code itself points scanners at the page where the countdown runs.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Event Countdown QR</h2>
            <p className="text-sm text-muted-foreground">Scan to open the event page</p>
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

          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold">Countdown preview</h2>
            <p className="text-sm text-muted-foreground">Live countdown to the event start.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-lg font-bold">{form.eventName || 'Your event'}</p>
              {countdown ? (
                countdown.past ? (
                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    The event has started.
                  </p>
                ) : (
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    {[
                      { v: countdown.days, l: 'Days' },
                      { v: countdown.hours, l: 'Hours' },
                      { v: countdown.minutes, l: 'Minutes' },
                      { v: countdown.seconds, l: 'Seconds' },
                    ].map((u) => (
                      <div key={u.l} className="rounded-lg border bg-slate-50 px-1 py-2">
                        <div className="text-2xl font-extrabold">{u.v}</div>
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">
                          {u.l}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Enter a start date and time to preview the countdown.
                </p>
              )}
              {form.eventDate && (
                <p className="mt-3 text-xs text-slate-500">
                  Starts: {new Date(form.eventDate).toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-y-1">
              {FIELDS.filter((fd) => (form[fd.key] || '').trim()).map((fd) => (
                <p key={fd.key} className="text-xs text-slate-700">
                  <span className="font-semibold">{fd.label}: </span>
                  {form[fd.key]}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="event-countdown-qr-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Event Countdown QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">Why a countdown helps</h3>
        <p className="text-base leading-relaxed">
          A date on a poster is easy to ignore. A countdown is not: it turns an abstract date into
          time running out, which is what makes people decide to buy a ticket, save the date, or
          share the poster. Put the QR code on everything the event touches, from flyers and shop
          windows to tickets and social posts, and every scan lands on the event page where the
          countdown keeps the urgency alive.
        </p>
        <AdSlot id="event-countdown-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Get the time zone right</h3>
        <p className="text-base leading-relaxed">
          Enter the start time in the time zone the event actually happens in, and say so on the
          event page. A countdown that is three hours off because of a time-zone mix-up looks broken
          and costs trust. If the audience spans time zones, the event page should show the start
          time in the event local time plus a clear time-zone label. Test the countdown the way your
          audience will see it: open the event page on a phone and confirm the numbers match what
          you entered.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size, stick it where it will actually live, and scan it with
          two different phones, one iPhone and one Android, in the real lighting. Check the whole
          journey: the page that opens should load quickly, show the right event, and work without
          forcing an app install or a login. Keep the quiet zone around the code and print dark
          modules on a light background with strong contrast.
        </p>
      </article>

      <AdSlot id="event-countdown-qr-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="event-countdown-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
