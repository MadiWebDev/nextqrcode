'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MapPin } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'latitude', label: 'Latitude', ph: '40.7128', kind: 'text' },
    { key: 'longitude', label: 'Longitude', ph: '-74.0060', kind: 'text' },
    {
      key: 'label',
      label: 'Place label (optional)',
      ph: 'Riverside Market entrance',
      kind: 'text',
    },
  ];

const DEFAULTS = { latitude: '', longitude: '', label: '' };

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
    const lat = parseFloat(f.latitude || '');
    const lng = parseFloat(f.longitude || '');
    if ((f.latitude || '').trim() === '' || Number.isNaN(lat)) return 'Enter a numeric latitude.';
    if (lat < -90 || lat > 90) return 'Latitude must be between -90 and 90.';
    if ((f.longitude || '').trim() === '' || Number.isNaN(lng)) return 'Enter a numeric longitude.';
    if (lng < -180 || lng > 180) return 'Longitude must be between -180 and 180.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    let p = 'geo:' + (f.latitude || '').trim() + ',' + (f.longitude || '').trim();
    if ((f.label || '').trim()) p += '?q=' + encodeURIComponent((f.label || '').trim());
    return p;
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
    a.download = 'geo-qr-code-generator.png';
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
    a.download = 'geo-qr-code-generator.svg';
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
        'It contains a geo: URI with the latitude and longitude, plus an optional q parameter carrying the place label. The payload is shown verbatim on this page so you can check it before printing.',
    },
    {
      question: 'What happens when someone scans this QR code?',
      answer:
        "Scanning opens the phone's map app with a pin dropped at the coordinates. The scanner can then get directions to the pin. Behaviour varies slightly by phone and map app, so test on both iPhone and Android.",
    },
    {
      question: 'How do I find the coordinates for a place?',
      answer:
        'Stand at the exact spot, open your map app, and drop a pin there. The app shows the latitude and longitude. Copy them here exactly, and check the pin on the map link in the preview before printing.',
    },
    {
      question: 'Why not just encode a maps link instead?',
      answer:
        "A maps link depends on one provider's URL format and opens that provider's app. A geo: URI is a provider-neutral standard that opens whichever map app the scanner uses, which is what you want on printed signs.",
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Geo QR Code Generator',
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
          { label: 'Geo QR Code Generator', href: '/geo-qr-code-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Location QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Geo QR Code Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code that opens a map pin for any latitude and longitude, for print, signage,
          and trail markers.
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
              The payload is a geo: URI: latitude and longitude, with an optional q parameter
              carrying the place label.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Geo QR</h2>
            <p className="text-sm text-muted-foreground">Scan to open the map pin</p>
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
            <h2 className="text-lg font-bold">Map pin preview</h2>
            <p className="text-sm text-muted-foreground">What scanners reach after scanning.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-lg font-bold">{form.label || 'Map pin'}</p>
              <p className="mt-2 font-mono text-sm text-slate-700">
                {form.latitude || '—'}, {form.longitude || '—'}
              </p>
              {payload && (
                <p className="mt-3 text-sm text-slate-600">
                  <a
                    href={
                      'https://www.openstreetmap.org/?mlat=' +
                      (form.latitude || '').trim() +
                      '&mlon=' +
                      (form.longitude || '').trim() +
                      '#map=16/' +
                      (form.latitude || '').trim() +
                      '/' +
                      (form.longitude || '').trim()
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-700 hover:underline"
                  >
                    Open this pin on OpenStreetMap
                  </a>
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

      <AdSlot id="geo-qr-code-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to use the Geo QR Code Generator</h2>
        <h3 className="text-xl font-semibold text-foreground">A pin without an address</h3>
        <p className="text-base leading-relaxed">
          Some places do not have a useful street address: a trailhead, a market stall, a festival
          gate, a viewpoint, a rural workshop. A geo: code stores the coordinates themselves, so the
          scan opens the phone&apos;s map app with a pin dropped at exactly that spot. The scanner
          gets walking directions to the pin instead of to the nearest building with a similar name,
          which is the failure mode of every address-based code in the countryside.
        </p>
        <AdSlot id="geo-qr-code-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Get the coordinates right</h3>
        <p className="text-base leading-relaxed">
          Stand at the exact spot with your phone, drop a pin in your map app, and copy the
          coordinates it shows. Latitude runs from -90 to 90 and longitude from -180 to 180, and
          this tool checks both ranges before generating the code. Check the pin on the map after
          entering it: a swapped or mistyped digit can move the pin to another town, and a printed
          code keeps that mistake forever. Add a short label, such as the entrance name, so the pin
          is recognisable when it opens.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size, stick it where it will actually live, and scan it with
          two different phones, one iPhone and one Android, in the real lighting. Confirm the map
          pin lands where you stood, and that directions to it make sense. Keep the quiet zone
          around the code and print dark modules on a light background with strong contrast. For
          outdoor signs, use weatherproof stock and test under the actual sun and shade.
        </p>
      </article>

      <AdSlot id="geo-qr-code-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="geo-qr-code-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
