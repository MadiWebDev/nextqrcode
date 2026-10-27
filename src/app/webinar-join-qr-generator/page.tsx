'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Video } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    {
      key: 'webinarTitle',
      label: 'Webinar title',
      ph: 'How to Price Your First Product',
      kind: 'text',
    },
    { key: 'joinUrl', label: 'Join URL', ph: 'https://example.com/webinar/join', kind: 'text' },
    { key: 'startTime', label: 'Start date and time', ph: '', kind: 'datetime-local' },
    { key: 'host', label: 'Host', ph: 'Maya Chen', kind: 'text' },
  ];

const DEFAULTS = { webinarTitle: '', joinUrl: '', startTime: '', host: '' };

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

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.webinarTitle || '').trim()) return 'Enter the webinar title.';
    if (!isValidUrl(f.joinUrl || '')) return 'Enter a valid join URL starting with https://.';
    if (!(f.startTime || '').trim() || Number.isNaN(Date.parse(f.startTime || '')))
      return 'Enter the webinar start date and time.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.joinUrl;
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
    a.download = 'webinar-join-qr-generator.png';
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
    a.download = 'webinar-join-qr-generator.svg';
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
      question: 'What does the QR code actually contain?',
      answer:
        'It contains the join URL exactly as you entered it. The tool adds nothing and rewrites nothing, so the code works with any webinar platform.',
    },
    {
      question: 'How is this different from a Zoom meeting QR code?',
      answer:
        'A Zoom-specific generator builds a Zoom link. This one accepts any join link, so it works with whatever platform you host on, and it does not assume anything about the platform.',
    },
    {
      question: 'What if the join link needs a password?',
      answer:
        'If the password is part of the join URL your platform gave you, paste the whole URL and it is included. If the password is separate, attendees will be asked for it after scanning, so include it in the invitation text beside the code.',
    },
    {
      question: 'Will this QR code work on iPhone and Android?',
      answer:
        'Yes. Modern iPhone and Android cameras read QR codes natively and open the join link in the browser. Whether the webinar itself runs in the browser depends on your platform.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Webinar Join QR Generator',
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
          { label: 'Webinar Join QR Generator', href: '/webinar-join-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Video className="w-3.5 h-3.5" />
          <span>Event QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Webinar Join QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a platform-agnostic webinar join QR code that opens any join link, plus a join card
          showing the start time.
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
              The QR encodes the join URL exactly as entered, whatever platform hosts the webinar.
              No platform-specific wrapper is added.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Webinar Join QR</h2>
            <p className="text-sm text-muted-foreground">Scan to join the webinar</p>
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
            <h2 className="text-lg font-bold">Join card</h2>
            <p className="text-sm text-muted-foreground">What attendees see before joining.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-xs uppercase tracking-widest text-slate-500">Live webinar</p>
              <p className="mt-1 text-xl font-bold">{form.webinarTitle || 'Webinar title'}</p>
              {form.host && <p className="mt-1 text-sm text-slate-600">Host: {form.host}</p>}
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Starts: {form.startTime ? new Date(form.startTime).toLocaleString() : 'Not set yet'}
              </p>
              <p className="mt-3 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Scan to join
              </p>
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
      <AdSlot id="webinar-join-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Webinar Join QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">Any platform, one code</h3>
        <p className="text-base leading-relaxed">
          Webinar platforms all hand out join links, and this tool takes whichever one yours gives
          you. Paste the join URL exactly as the platform issued it, including any meeting ID or
          password baked into it, and the code opens that link. Because the code stores the link
          verbatim, it works whether you host on a big webinar platform, a video-call tool, or your
          own site. Never shorten or retype the link by hand: one wrong character sends attendees to
          the wrong room.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Show the start time in plain text</h3>
        <p className="text-base leading-relaxed">
          Put the webinar title, host, and start time in plain text beside the code, with the time
          zone spelled out. Attendees decide in seconds whether to join, and a missing time zone is
          the most common reason people show up an hour early or an hour late. If the audience spans
          time zones, the join page should repeat the start time in the attendee&apos;s local time.
        </p>
        <AdSlot id="webinar-join-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">Testing before you send it</h3>
        <p className="text-base leading-relaxed">
          Scan a sample and confirm the join link opens the right webinar, including whether it asks
          for a name, an email, or a password, and whether it works in a browser without an app
          install. Send the code in the reminder email and on the event page, and keep a plain
          clickable link beside it for anyone who cannot scan. Test the code on two phones, one
          iPhone and one Android, before the invitations go out.
        </p>
      </article>

      <AdSlot id="webinar-join-qr-generator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="webinar-join-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
