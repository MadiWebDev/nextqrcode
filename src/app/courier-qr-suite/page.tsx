'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Download, QrCode, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

type Preset = {
  id: string;
  name: string;
  hint: string;
  fields: Array<{ key: string; label: string }>;
  template: string;
  raw?: boolean;
};

const PRESETS: Preset[] = [
  {
    id: 'track-parcel',
    name: 'Track Parcel QR',
    hint: 'Link to tracking with the parcel number attached.',
    fields: [
      { key: 'url', label: 'Tracking page URL' },
      { key: 'tracking', label: 'Tracking number' },
    ],
    template: '{url}?tracking={tracking}',
  },
  {
    id: 'pickup-booking',
    name: 'Pickup Booking QR',
    hint: 'Book a pickup, with the pickup address attached.',
    fields: [
      { key: 'url', label: 'Pickup booking URL' },
      { key: 'address', label: 'Pickup address' },
    ],
    template: '{url}?address={address}',
  },
  {
    id: 'rate-card',
    name: 'Rate Card QR',
    hint: 'Link to the rate card so senders check prices before booking.',
    fields: [{ key: 'url', label: 'Rate card URL' }],
    template: '{url}',
  },
  {
    id: 'support',
    name: 'Support QR',
    hint: 'Link to support, with the topic attached.',
    fields: [
      { key: 'url', label: 'Support page URL' },
      { key: 'topic', label: 'Support topic' },
    ],
    template: '{url}?topic={topic}',
  },
];

const faqs = [
  {
    question: 'What does the track-parcel code contain?',
    answer:
      'The tracking page URL plus the tracking number as a link parameter, so the page can show that parcel\u2019s status when it supports it. If it does not, the code still opens the tracking page.',
  },
  {
    question: 'What does the pickup-booking code contain?',
    answer:
      'The pickup booking URL plus the pickup address as a link parameter, so the booking form arrives pre-filled when the page supports it. The sender still confirms the booking on the page itself.',
  },
  {
    question: 'Can I change the destination without reprinting the codes?',
    answer:
      'Yes, if the code points to a URL you control. Update the page behind it and every printed code shows the new content. If the code points to a page you do not control, a change there can break your printed cards.',
  },
  {
    question: 'Will these QR codes work on iPhone and Android?',
    answer:
      'Yes, in nearly all cases. Modern iPhone and Android cameras read QR codes natively. Test on both platforms before a large print run, keep the quiet zone clear, and use dark modules on a light background with strong contrast.',
  },
];

function buildPayload(preset: Preset, values: Record<string, string>): string {
  const rawMode =
    preset.raw === true ||
    preset.template.startsWith('WIFI:') ||
    preset.template.startsWith('BEGIN:');
  let out = preset.template;
  preset.fields.forEach((f) => {
    const v = values[f.key] || '';
    const sub = rawMode || f.key === 'url' ? v : encodeURIComponent(v);
    out = out.split(`{${f.key}}`).join(sub);
  });
  out = out.replace(/([?&])[a-zA-Z]+=(?=&|$)/g, '$1').replace(/[?&]$/, '');
  return out;
}

export default function CourierQrSuitePage() {
  const [activeId, setActiveId] = useState(PRESETS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState('');
  const [qrError, setQrError] = useState('');

  const active = PRESETS.find((p) => p.id === activeId) || PRESETS[0];
  const payload = useMemo(() => buildPayload(active, values), [active, values]);
  const missing = active.fields.filter((f) => !(values[f.key] || '').trim());

  useEffect(() => {
    let cancelled = false;
    if (!payload || missing.length > 0) return;
    QRCodeLib.toDataURL(payload, { width: 512, margin: 2, errorCorrectionLevel: 'M' })
      .then((url) => {
        if (!cancelled) {
          setQrUrl(url);
          setQrError('');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrUrl('');
          setQrError(
            'Could not generate a QR code from these values. Check for unsupported characters.'
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [payload, missing.length]);

  function selectPreset(id: string) {
    setActiveId(id);
    setValues({});
  }

  function downloadPng() {
    if (!payload || missing.length > 0 || !qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `courier-qr-suite-${active.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function downloadSvg() {
    if (!payload || missing.length > 0) return;
    const svg = await QRCodeLib.toString(payload, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courier-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Courier QR Suite',
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
          { label: 'Courier QR Suite', href: '/courier-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Package className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Courier QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          QR presets for couriers: track parcel, pickup booking, rate card and support. Pick a
          preset, fill in its fields, and each one generates a real working QR code with PNG and SVG
          downloads.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold">1. Choose a preset</h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPreset(p.id)}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${activeId === p.id ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-border hover:border-border/80 text-muted-foreground'}`}
                >
                  <div className="text-foreground font-semibold">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {p.hint}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">2. Fill in the details for {active.name}</h2>
            {active.fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={`field-${f.key}`}>{f.label}</Label>
                <Input
                  id={`field-${f.key}`}
                  value={values[f.key] || ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Every preset generates a real QR code from exactly what you type. Nothing is uploaded;
              the code is generated in your browser.
            </p>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" /> {active.name}
              </span>
            </div>
            {payload && missing.length === 0 && qrUrl ? (
              <div className="rounded-xl bg-white p-4 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`QR code for ${active.name}`}
                  className="w-full max-w-[320px] h-auto mx-auto"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                <QrCode className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                Fill in {missing.length > 0
                  ? missing.map((m) => m.label).join(', ')
                  : 'the fields'}{' '}
                to see your QR code.
              </div>
            )}
            {qrError && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{qrError}</span>
              </div>
            )}
            {payload && missing.length === 0 && (
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Encoded payload
                </p>
                <p className="text-xs font-mono break-all text-foreground whitespace-pre-wrap">
                  {payload}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={downloadPng}
                disabled={!payload || missing.length > 0 || !qrUrl}
                className="gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download PNG
              </Button>
              <Button
                onClick={downloadSvg}
                disabled={!payload || missing.length > 0 || !qrUrl}
                variant="outline"
                className="gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download SVG
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="courier-qr-suite-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to Use the Courier QR Suite</h2>
        <p className="text-base leading-relaxed">
          Courier QR codes earn their keep when they remove uncertainty: recipients track without
          typing a long number, senders book a pickup with the address already attached, prices are
          one scan away, and support starts from the right topic. Build one code per job, then place
          each where its moment happens.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Place each code where its moment happens
        </h3>
        <p className="text-base leading-relaxed">
          The tracking code belongs on the shipping label and the receipt, pickup booking on flyers
          and the website, the rate card at the counter, and support on labels and receipts. A code
          in the wrong place gets ignored, however good it is.
        </p>
        <AdSlot id="courier-qr-suite-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          Keep destinations under your control
        </h3>
        <p className="text-base leading-relaxed">
          Point printed codes at URLs you control, such as short redirects, so you can swap the
          destination without reprinting. A tracking page that moves should not orphan every printed
          label.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Test before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size, scan it on two different phones in real counter lighting,
          and confirm the whole journey works, from scan to tracking. Keep the quiet zone clear and
          use dark modules on a light background.
        </p>
      </article>

      <AdSlot id="courier-qr-suite-pre-related" format="horizontal-banner" />
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

      <AdSlot id="courier-qr-suite-bottom" format="horizontal-banner" />
    </div>
  );
}
