'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Car } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'spotNumber', label: 'Spot number', ph: 'B-14', kind: 'text' },
    { key: 'location', label: 'Location', ph: 'Level 2, Riverside Car Park', kind: 'text' },
    { key: 'baseUrl', label: 'Parking page URL', ph: 'https://example.com/parking', kind: 'text' },
    {
      key: 'action',
      label: 'Action',
      ph: '',
      kind: 'select',
      options: ['pay', 'extend', 'report'],
    },
  ];

const DEFAULTS = { spotNumber: '', location: '', baseUrl: '', action: 'pay' };

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
    if (!(f.spotNumber || '').trim()) return 'Enter the spot number.';
    if (!isValidUrl(f.baseUrl || ''))
      return 'Enter a valid parking page URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    const withSpot = withParam(f.baseUrl, 'spot', (f.spotNumber || '').trim());
    return withParam(withSpot, 'action', f.action);
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
    a.download = 'parking-spot-qr-generator.png';
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
    a.download = 'parking-spot-qr-generator.svg';
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
        'It contains your parking page URL with two query parameters added: spot, carrying the spot number, and action, carrying pay, extend, or report. The payload is shown verbatim on this page so you can check it before printing.',
    },
    {
      question: 'Does the code need my parking page to support the parameters?',
      answer:
        'Yes. Your parking page must read the spot and action parameters and pre-select that spot and action. If it ignores them, the code still opens the page, but the driver has to pick the spot by hand.',
    },
    {
      question: 'How big should the spot label be?',
      answer:
        "Big enough to read from the driver's seat: the spot number in large plain text, the QR code at least 3 to 4 cm wide, and both at a height reachable without stepping into traffic. Test under the car park lights at night.",
    },
    {
      question: 'What if a label is damaged or replaced?',
      answer:
        'The spot number in plain text above the code is the fallback, so a driver can still pay by typing it. Keep a spare printed label for every bay, and check labels on a regular walk-through.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Parking Spot QR Generator',
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
          { label: 'Parking Spot QR Generator', href: '/parking-spot-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Car className="w-3.5 h-3.5" />
          <span>Parking QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Parking Spot QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code for one parking spot that opens pay, extend, or report flows for that
          spot, plus a spot label you can fix to the wall.
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
              The payload is your parking page URL with the spot number and the chosen action added
              as query parameters, so the page knows exactly which spot the scanner is at.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Parking Spot QR</h2>
            <p className="text-sm text-muted-foreground">
              Scan to pay, extend, or report for this spot
            </p>
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
            <h2 className="text-lg font-bold">Spot label preview</h2>
            <p className="text-sm text-muted-foreground">What the label on the wall looks like.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-slate-500">Parking Spot</p>
                <p className="mt-1 text-6xl font-extrabold tracking-tight">
                  {form.spotNumber || '—'}
                </p>
                <p className="mt-2 text-sm text-slate-600">{form.location || 'Location'}</p>
                <p className="mt-3 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Scan to {form.action}
                </p>
              </div>
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

      {/* After-tool AdSlot */}
      <AdSlot id="parking-spot-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Parking Spot QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One code per spot</h3>
        <p className="text-base leading-relaxed">
          The whole point of a per-spot code is that the driver never types a spot number. The code
          carries it, so the pay or extend flow opens with the right spot already selected. That
          removes the most common parking error, paying for the wrong bay, and it removes the queue
          at the machine. Generate one code per spot, and check each printed label against the bay
          it is fixed to before the car park opens.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="parking-spot-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Labels that survive a car park</h3>
        <p className="text-base leading-relaxed">
          Car parks are harsh: damp, dusty, dim, and occasionally sunlit. Print labels on
          weatherproof stock, laminate them, and fix them at a height drivers can reach without
          stepping into traffic. Print the spot number big in plain text above the code, so a driver
          can read it even if the code is damaged. Test every label at night under the car park
          lights, because that is when most drivers will use it.
        </p>
        <h3 className="text-xl font-semibold text-foreground">The report action</h3>
        <p className="text-base leading-relaxed">
          The report action is the one operators forget and drivers need most: a broken machine, a
          blocked bay, a light out, a car parked across two spots. Make sure the report flow on your
          parking page asks for as little as possible, ideally one tap and a short note, and that
          reports reach someone who acts on them. A report button that goes nowhere is worse than no
          report button at all.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="parking-spot-qr-generator-pre-related" format="horizontal-banner" />

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

      {/* Bottom AdSlot */}
      <AdSlot id="parking-spot-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
