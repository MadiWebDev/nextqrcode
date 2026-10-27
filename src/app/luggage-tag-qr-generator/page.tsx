'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Luggage } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS = [
  { key: 'ownerName', label: 'Owner name', ph: 'Alex Morgan', kind: 'text' },
  { key: 'phone', label: 'Contact phone', ph: '+1 555 123 4567', kind: 'text' },
  { key: 'flight', label: 'Flight', ph: 'AB 1234', kind: 'text' },
  { key: 'destination', label: 'Destination', ph: 'Lisbon', kind: 'text' },
  { key: 'email', label: 'Contact email (optional)', ph: 'alex@example.com', kind: 'text' },
];

const DEFAULTS = { ownerName: '', phone: '', flight: '', destination: '', email: '' };

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.ownerName || '').trim()) return 'Enter the owner name.';
    if (!(f.phone || '').trim() && !(f.email || '').trim())
      return 'Enter a contact phone or email so a finder can reach you.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    try {
      const lines = ['LUGGAGE TAG', 'Owner: ' + (f.ownerName || '').trim()];
      if ((f.phone || '').trim()) lines.push('Phone: ' + (f.phone || '').trim());
      if ((f.email || '').trim()) lines.push('Email: ' + (f.email || '').trim());
      if ((f.flight || '').trim()) lines.push('Flight: ' + (f.flight || '').trim());
      if ((f.destination || '').trim()) lines.push('Destination: ' + (f.destination || '').trim());
      return lines.join('\n');
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
    a.download = 'luggage-tag-qr-generator.png';
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
    a.download = 'luggage-tag-qr-generator.svg';
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
        'Scanning shows the tag details as plain text: owner, contact, flight, and destination. Any phone camera can read it, with no special app.',
    },
    {
      question: 'Should I put my home address on the tag?',
      answer:
        'No. A phone number or email is enough for a finder to reach you, and it keeps your home address out of circulation if the bag goes astray.',
    },
    {
      question: 'Does this replace the airline bag tag?',
      answer:
        'No. The airline tag routes the bag through the airport system. This tag is a backup that helps a finder contact you if the airline tag comes off.',
    },
    {
      question: 'Can I print this QR code on a luggage tag?',
      answer:
        'Yes. Print on card or laminate paper tags, keep the code at least 2 cm wide, and keep the quiet zone clear so the code still scans after handling.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Luggage Tag QR Generator',
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
          { label: 'Luggage Tag QR Generator', href: '/luggage-tag-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Luggage className="w-3.5 h-3.5" />
          <span>Travel QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Luggage Tag QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code for a luggage tag with the owner and itinerary on it, plus a printable
          tag preview. A finder who scans it sees how to reach you.
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
              Encoded as plain text with the tag details. Any QR scanner can read it — no special
              app is needed.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Luggage Tag</h2>
            <p className="text-sm text-muted-foreground">Scan to see the owner details</p>
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
              <div className="mt-3 text-left space-y-1 border-t border-dashed border-slate-300 pt-2">
                <p className="text-sm font-bold text-slate-900">{form.ownerName}</p>
                {form.flight.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Flight: </span>
                    {form.flight}
                  </p>
                )}
                {form.destination.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Destination: </span>
                    {form.destination}
                  </p>
                )}
                {form.phone.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Phone: </span>
                    {form.phone}
                  </p>
                )}
                {form.email.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Email: </span>
                    {form.email}
                  </p>
                )}
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

      <AdSlot id="luggage-tag-qr-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Luggage Tag QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this QR code works</h3>
        <p className="text-base leading-relaxed">
          This code stores the tag details as plain text: owner, contact, flight, and destination.
          Anyone who finds the bag can scan it with an ordinary phone camera and see how to reach
          you, without installing anything. Print the same details as readable text on the tag too,
          so the tag still works if the code is scratched or the finder has no scanner.
        </p>
        <AdSlot id="luggage-tag-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">What to put on a luggage tag</h3>
        <p className="text-base leading-relaxed">
          A tag needs the owner’s name, one reliable contact, and the destination. Leave out
          anything a stranger does not need, such as your home address — a phone number or email is
          enough for a finder to reach you. If the bag is checked, the airline’s own bag tag does
          the routing; this tag is your backup if that tag comes off.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print the tag at the size it will actually be used, attach it to a bag, and scan it in the
          light of a baggage hall. Laminate paper tags or print on card, because tags get wet,
          rubbed, and folded. Check the scan again after the tag has been handled — a code that only
          scans when pristine will not survive a journey.
        </p>
      </article>

      <AdSlot id="luggage-tag-qr-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="luggage-tag-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
