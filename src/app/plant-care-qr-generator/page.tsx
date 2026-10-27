'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Leaf } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS = [
  { key: 'plantName', label: 'Plant name', ph: 'Monstera deliciosa', kind: 'text' },
  {
    key: 'light',
    label: 'Light',
    ph: 'Bright indirect',
    kind: 'select',
    options: ['Bright indirect', 'Direct sun', 'Low light', 'Partial shade'],
  },
  {
    key: 'water',
    label: 'Water',
    ph: 'Weekly',
    kind: 'select',
    options: ['Weekly', 'Every 2 weeks', 'Twice a week', 'Keep soil moist', 'Let soil dry out'],
  },
  {
    key: 'notes',
    label: 'Care notes (optional)',
    ph: 'Mist leaves in dry weather',
    kind: 'textarea',
  },
  {
    key: 'careUrl',
    label: 'Full care page URL (optional)',
    ph: 'https://example.com/care/monstera',
    kind: 'text',
  },
];

const DEFAULTS = {
  plantName: '',
  light: 'Bright indirect',
  water: 'Weekly',
  notes: '',
  careUrl: '',
};

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.plantName || '').trim()) return 'Enter the plant name.';
    if ((f.careUrl || '').trim()) {
      try {
        new URL((f.careUrl || '').trim());
      } catch {
        return 'Enter a valid care page URL starting with https://, or leave it blank.';
      }
    }
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    try {
      if ((f.careUrl || '').trim()) return (f.careUrl || '').trim();
      const lines = [
        'PLANT CARE',
        'Plant: ' + (f.plantName || '').trim(),
        'Light: ' + f.light,
        'Water: ' + f.water,
      ];
      if ((f.notes || '').trim()) lines.push('Notes: ' + (f.notes || '').trim());
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
    a.download = 'plant-care-qr-generator.png';
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
    a.download = 'plant-care-qr-generator.svg';
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
        'If you entered a care page URL, scanning opens that page. Otherwise scanning shows the care summary as plain text, readable by any phone camera.',
    },
    {
      question: 'Do I need a website to use this?',
      answer:
        'No. Leave the care page URL blank and the code stores the plant name, light, water, and notes as text. A website only helps if you want a longer guide behind the code.',
    },
    {
      question: 'Can one code cover a whole species?',
      answer:
        'Yes. If the care is the same for every plant of that species, print the same code on all of their tags. Make a separate code only when the care differs.',
    },
    {
      question: 'Can I print this QR code on a plant tag?',
      answer:
        'Yes. Keep the code at least 2 cm wide, keep the quiet zone clear, and use water-resistant stock or lamination so watering does not smudge it.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Plant Care QR Generator',
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
          { label: 'Plant Care QR Generator', href: '/plant-care-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Leaf className="w-3.5 h-3.5" />
          <span>Home & Garden QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Plant Care QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code for a plant tag that shows care instructions — light and water at a
          glance — or opens your full care page.
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
              If you entered a care page URL, the code opens that page. Otherwise it stores the care
              summary as plain text that any scanner can read.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Plant Care QR</h2>
            <p className="text-sm text-muted-foreground">Scan for care instructions</p>
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
                <p className="text-sm font-semibold text-slate-900">{form.plantName}</p>
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Light: </span>
                  {form.light}
                </p>
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Water: </span>
                  {form.water}
                </p>
                {form.notes.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Notes: </span>
                    {form.notes}
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

      {/* After-tool AdSlot */}
      <AdSlot id="plant-care-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Plant Care QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this QR code works</h3>
        <p className="text-base leading-relaxed">
          This code carries the care summary two ways. With a care page URL, scanning opens the full
          guide. Without one, the code stores the summary itself as plain text — plant, light,
          water, and notes — so it works with no website at all. Nurseries can print one code per
          species and reuse it across every plant of that kind.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="plant-care-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          Writing care instructions that get followed
        </h3>
        <p className="text-base leading-relaxed">
          Keep the tag to the two decisions a buyer makes every week: where the plant sits and when
          it gets watered. One clear line for light and one for water beats a paragraph of botany.
          Put the detail on the linked page, and keep the tag short enough to read at arm’s length
          in a shop.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print the tag at its real size, push it into a pot, and scan it at the distance a shopper
          stands from the shelf. Tags get wet, so laminate paper or print on weather-resistant
          stock, and check the scan again after watering — a smudged code helps nobody.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="plant-care-qr-generator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="plant-care-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
