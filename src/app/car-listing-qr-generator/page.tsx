'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CarFront } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'listingTitle', label: 'Listing title', ph: '2022 Honda Civic 1.5 Turbo', kind: 'text' },
    { key: 'vin', label: 'VIN', ph: '1HGBH41JXMN109186', kind: 'text' },
    { key: 'price', label: 'Price', ph: '18900', kind: 'text' },
    { key: 'mileage', label: 'Mileage', ph: '24500 km', kind: 'text' },
    { key: 'year', label: 'Year', ph: '2022', kind: 'number' },
    {
      key: 'listingUrl',
      label: 'Listing page URL',
      ph: 'https://example.com/cars/civic-2022',
      kind: 'text',
    },
  ];

const DEFAULTS = { listingTitle: '', vin: '', price: '', mileage: '', year: '', listingUrl: '' };

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
    if (!(f.listingTitle || '').trim()) return 'Enter the listing title.';
    if ((f.vin || '').trim() && !/^[A-HJ-NPR-Z0-9]{17}$/i.test((f.vin || '').trim()))
      return 'A VIN has 17 characters (letters except I, O, Q, plus digits).';
    if (!isValidUrl(f.listingUrl || ''))
      return 'Enter a valid listing page URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.listingUrl;
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
    a.download = 'car-listing-qr-generator.png';
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
    a.download = 'car-listing-qr-generator.svg';
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
        'It contains the listing page URL for this car, exactly as shown in the encoded payload box. The VIN, price, and mileage are shown in the preview and belong on the listing page itself.',
    },
    {
      question: 'Why does the tool check my VIN?',
      answer:
        'A real VIN has 17 characters, using digits and letters except I, O, and Q, which are never used because they look like 1 and 0. The check catches typos before they reach a printed card.',
    },
    {
      question: 'What should I do when the car sells?',
      answer:
        'Take the card down and update the listing page to say the car is sold. A printed code keeps working until it is removed, so stale listing codes are the most common mistake with this tool.',
    },
    {
      question: 'Can buyers check the car history from the code?',
      answer:
        'The code opens your listing page. Buyers can copy the VIN from the page or the printed card and run their own history check with it. The code itself does not carry the history report.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Car Listing QR Generator',
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
          { label: 'Car Listing QR Generator', href: '/car-listing-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <CarFront className="w-3.5 h-3.5" />
          <span>Automotive QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Car Listing QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code for a car listing with the VIN, price, and specs, plus a listing card
          buyers can check on the forecourt.
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
              The QR encodes the listing page URL. The VIN, price, and mileage are shown in the
              preview here and belong on the listing page itself, where they stay accurate.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Car Listing QR</h2>
            <p className="text-sm text-muted-foreground">Scan to view this car</p>
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
            <h2 className="text-lg font-bold">Listing card</h2>
            <p className="text-sm text-muted-foreground">What buyers check on the forecourt.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-xl font-bold">{form.listingTitle || 'Listing title'}</p>
              <p className="mt-2 text-3xl font-extrabold">{form.price ? form.price : 'Price'}</p>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                {form.year && <p>Year: {form.year}</p>}
                {form.mileage && <p>Mileage: {form.mileage}</p>}
                {form.vin && <p className="font-mono">VIN: {form.vin}</p>}
              </div>
              <p className="mt-3 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Scan for full details
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

      <AdSlot id="car-listing-qr-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Car Listing QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One code per car</h3>
        <p className="text-base leading-relaxed">
          A forecourt buyer wants the full story on one car, not a search page. The code opens that
          car&apos;s listing, with the price, mileage, and VIN already in front of them. Generate
          one code per vehicle, and use the listing URL for that specific car. A code that opens the
          dealer homepage sends the buyer back to searching, which is exactly the friction that
          loses sales after hours, when nobody is there to help.
        </p>
        <AdSlot id="car-listing-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">The VIN is the check</h3>
        <p className="text-base leading-relaxed">
          Buyers use the VIN to check history, recalls, and whether the car in front of them is the
          car in the listing. Print it in plain text beside the code, in capitals, exactly as it
          appears on the vehicle plate. This tool checks that a VIN you enter has 17 characters
          using only the letters and digits a real VIN allows. If the VIN on the car and the VIN on
          the card disagree, fix the card before the car is shown to anyone.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing and removal</h3>
        <p className="text-base leading-relaxed">
          Print a sample, scan it, and confirm the listing that opens is the right car at the right
          price. Test under forecourt lighting, including at night, and keep the quiet zone around
          the code. The moment a car sells, take its card down and update the listing page to say
          so. A stale code on a sold car sends buyers to a listing that no longer exists.
        </p>
      </article>

      <AdSlot id="car-listing-qr-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="car-listing-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
