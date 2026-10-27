'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Home } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    {
      key: 'propertyTitle',
      label: 'Property title',
      ph: '3-bed townhouse, Maple Street',
      kind: 'text',
    },
    { key: 'address', label: 'Address', ph: '14 Maple Street, Riverside', kind: 'text' },
    { key: 'price', label: 'Price', ph: '385000', kind: 'text' },
    { key: 'beds', label: 'Bedrooms', ph: '3', kind: 'number' },
    { key: 'baths', label: 'Bathrooms', ph: '2', kind: 'number' },
    {
      key: 'tourUrl',
      label: 'Virtual tour URL',
      ph: 'https://example.com/tours/maple-14',
      kind: 'text',
    },
  ];

const DEFAULTS = { propertyTitle: '', address: '', price: '', beds: '', baths: '', tourUrl: '' };

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
    if (!(f.propertyTitle || '').trim()) return 'Enter the property title.';
    if (!isValidUrl(f.tourUrl || ''))
      return 'Enter a valid virtual tour URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.tourUrl;
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
    a.download = 'property-tour-qr-generator.png';
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
    a.download = 'property-tour-qr-generator.svg';
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
        'It contains the virtual tour URL for this property, exactly as shown in the encoded payload box. The price, bedrooms, and bathrooms are shown in the preview and belong on the listing page itself.',
    },
    {
      question: 'How is this different from a real-estate suite?',
      answer:
        'A suite is a multi-preset hub covering many property codes at once. This is a single-purpose generator for one virtual tour: one property, one code, one tour.',
    },
    {
      question: 'Does the tour need to work on a phone?',
      answer:
        'Yes. Most sign-board scanners are on a phone, standing on the pavement. The tour should load quickly in a mobile browser without forcing an app install or a login.',
    },
    {
      question: 'What should I do when the property sells?',
      answer:
        'Take the board down and update the tour page to say the property is sold. A printed code keeps working until it is removed, so stale tour codes are the most common mistake with this tool.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Property Tour QR Generator',
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
          { label: 'Property Tour QR Generator', href: '/property-tour-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Home className="w-3.5 h-3.5" />
          <span>Real Estate QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Property Tour QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code for a virtual property tour, plus a tour card with the property summary
          that buyers check on the sign board.
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
              The QR encodes the virtual tour URL. The price, bedrooms, and bathrooms are shown in
              the preview here and belong on the listing page itself.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Property Tour QR</h2>
            <p className="text-sm text-muted-foreground">Scan to take the virtual tour</p>
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
            <h2 className="text-lg font-bold">Tour card</h2>
            <p className="text-sm text-muted-foreground">What buyers check on the sign board.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-xl font-bold">{form.propertyTitle || 'Property title'}</p>
              {form.address && <p className="mt-1 text-sm text-slate-600">{form.address}</p>}
              <p className="mt-2 text-3xl font-extrabold">{form.price ? form.price : 'Price'}</p>
              <p className="mt-1 text-sm text-slate-600">
                {form.beds || '—'} bedrooms · {form.baths || '—'} bathrooms
              </p>
              <p className="mt-3 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Scan for virtual tour
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

      {/* After-tool AdSlot */}
      <AdSlot id="property-tour-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Property Tour QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One code per property</h3>
        <p className="text-base leading-relaxed">
          A sign-board code lets a passer-by walk the property from the pavement, at any hour,
          without an appointment. The code opens that property&apos;s virtual tour, not the agency
          homepage. Generate one code per listing, and use the tour URL for that specific property.
          A buyer who lands on a homepage has to search again, and most will not bother, especially
          after hours when the moment of interest is strongest.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="property-tour-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">What belongs on the board</h3>
        <p className="text-base leading-relaxed">
          Put the property title, address, price, bedrooms, and bathrooms in plain text beside the
          code, so the board works even for someone who does not scan. Add one line that says what
          happens after the scan, such as Scan for virtual tour. Keep the code large enough to scan
          from a comfortable standing distance on the pavement, and test it from there, not from
          arm&apos;s length.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing and removal</h3>
        <p className="text-base leading-relaxed">
          Print a sample, scan it, and confirm the tour that opens is the right property, loads
          quickly on a phone, and works without forcing an app install. Test in daylight and at
          dusk, and keep the quiet zone around the code. The moment a property sells or lets, take
          the board down and update the tour page. A stale code on a sold property sends buyers to a
          tour that no longer matters.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="property-tour-qr-generator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="property-tour-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
