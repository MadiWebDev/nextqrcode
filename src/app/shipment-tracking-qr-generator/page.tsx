'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Package } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'trackingNumber', label: 'Tracking number', ph: '1Z999AA10123456784', kind: 'text' },
    {
      key: 'carrier',
      label: 'Carrier',
      ph: '',
      kind: 'select',
      options: ['UPS', 'FedEx', 'DHL', 'USPS', 'Custom'],
    },
    {
      key: 'customUrl',
      label: 'Custom tracking page URL (for Custom only)',
      ph: 'https://example.com/track',
      kind: 'text',
    },
  ];

const DEFAULTS = { trackingNumber: '', carrier: 'UPS', customUrl: '' };

function withParam(url: string, key: string, value: string) {
  try {
    const u = new URL(url);
    u.searchParams.set(key, value);
    return u.href;
  } catch {
    return '';
  }
}

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
    if (!(f.trackingNumber || '').trim()) return 'Enter the tracking number.';
    if (f.carrier === 'Custom' && !isValidUrl(f.customUrl || ''))
      return 'For a custom carrier, enter a valid tracking page URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    const n = encodeURIComponent((f.trackingNumber || '').trim());
    if (f.carrier === 'UPS') return 'https://www.ups.com/track?tracknum=' + n;
    if (f.carrier === 'FedEx') return 'https://www.fedex.com/fedextrack/?trknbr=' + n;
    if (f.carrier === 'DHL') return 'https://www.dhl.com/en/express/tracking.html?AWB=' + n;
    if (f.carrier === 'USPS')
      return 'https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=' + n;
    return withParam(f.customUrl, 'tracking', (f.trackingNumber || '').trim());
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
    a.download = 'shipment-tracking-qr-generator.png';
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
    a.download = 'shipment-tracking-qr-generator.svg';
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
        "It contains the carrier's tracking URL with your tracking number filled in, or your custom tracking page URL with the number added as a tracking parameter. The payload is shown verbatim on this page so you can check it before printing.",
    },
    {
      question: 'Which carriers are supported?',
      answer:
        'UPS, FedEx, DHL, and USPS have built-in tracking URL patterns. Any other carrier works through the Custom option: enter your tracking page URL and the tool adds the tracking number as a parameter.',
    },
    {
      question: 'Will the tracking page show the live status?',
      answer:
        "Yes, if the carrier's page accepts the tracking number in the URL, which the built-in patterns do. The status itself comes from the carrier after the scan; the code only carries the link.",
    },
    {
      question: 'What if the carrier changes its tracking page?',
      answer:
        'Scan a sample label before a big dispatch run and confirm the carrier page opens with the number applied. If the carrier changed its URL pattern, use the Custom option with the new tracking page URL.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Shipment Tracking QR Generator',
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
          { label: 'Shipment Tracking QR Generator', href: '/shipment-tracking-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Package className="w-3.5 h-3.5" />
          <span>Shipping QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Shipment Tracking QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code with the tracking number and a direct link to the carrier&apos;s tracking
          page, plus a tracking summary card for the parcel label.
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
              The payload is the carrier&apos;s tracking URL with your tracking number filled in.
              For a custom carrier it is your tracking page URL with the tracking number added as a
              tracking parameter.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Shipment Tracking QR</h2>
            <p className="text-sm text-muted-foreground">Scan to track this parcel</p>
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
            <h2 className="text-lg font-bold">Tracking summary</h2>
            <p className="text-sm text-muted-foreground">What goes on the parcel label.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Carrier: {form.carrier}
              </p>
              <p className="mt-2 font-mono text-xl font-bold tracking-wide">
                {form.trackingNumber || 'Tracking number'}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Scan to open live tracking for this parcel. Keep the tracking number readable in
                plain text beside the code in case the label is damaged.
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
      <AdSlot id="shipment-tracking-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Shipment Tracking QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One scan, no typing</h3>
        <p className="text-base leading-relaxed">
          Tracking numbers are long, and one mistyped character gives a stranger&apos;s parcel or an
          error page. A tracking QR removes the typing: the scan opens the carrier&apos;s tracking
          page with the number already filled in. Print the code on the parcel label and on the
          order confirmation, and keep the tracking number readable in plain text beside it as a
          fallback. Buyers check tracking far more often than sellers expect, so every scan that
          works is a support message you never receive.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Carrier links change</h3>
        <p className="text-base leading-relaxed">
          Carriers redesign their tracking pages from time to time, and a tracking URL that worked
          last year may redirect or break. Before a big dispatch run, scan a sample label and
          confirm the carrier page opens with the tracking number applied. If you ship with a
          carrier not listed here, use the Custom option with your own tracking page URL, and make
          sure that page reads the tracking parameter.
        </p>
        <AdSlot id="shipment-tracking-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">What the code does not do</h3>
        <p className="text-base leading-relaxed">
          The code carries the tracking link, not the parcel&apos;s live status. Status comes from
          the carrier&apos;s page after the scan. The code cannot tell you where the parcel is, and
          it cannot update itself if the carrier changes the tracking number. If a parcel is
          re-labelled, generate a fresh code for the new number and use that one on the label.
        </p>
      </article>

      <AdSlot id="shipment-tracking-qr-generator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="shipment-tracking-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
