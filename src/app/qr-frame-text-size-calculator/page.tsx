'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function Page() {
  const [distance, setDistance] = useState('2');
  const [condition, setCondition] = useState('Indoor');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = Number(distance);
    if (!Number.isFinite(d) || d <= 0)
      return {
        error: 'Enter a viewing distance greater than 0.',
        d: 0,
        factor: 1,
        capHeightMm: 0,
        fontPt: 0,
        fontPtRounded: 0,
        px: 0,
        condition: '',
      };
    const factors: Record<string, number> = {
      Indoor: 1.0,
      Outdoor: 1.5,
      'Low light': 1.3,
      'Moving audience': 1.4,
    };
    const factor = factors[condition] ?? 1.0;
    const capHeightMm = d * 1000 * 0.0029 * factor;
    const fontPt = capHeightMm / 0.7 / 0.3528;
    return {
      error: '',
      d,
      factor,
      capHeightMm,
      fontPt,
      fontPtRounded: Math.ceil(fontPt),
      px: (fontPt * 96) / 72,
      condition,
    };
  }, [distance, condition]);

  const copyResult = async () => {
    if (result.error) return;
    await navigator.clipboard.writeText(
      `At ${result.d} m (${result.condition}), minimum cap height: ${result.capHeightMm.toFixed(1)} mm; minimum font size: ${result.fontPtRounded} pt (about ${result.px.toFixed(0)} px at 96 dpi).`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'Is this a guarantee that the text will be readable?',
      answer:
        'No. It is a guideline built on an angular-size rule plus condition factors. Eyesight, light, contrast, and typeface all change real legibility, so always test a printed proof at the real distance.',
    },
    {
      question: 'Why is outdoor text so much larger?',
      answer:
        'Outdoor viewers are further away, often moving, and dealing with sun and glare. The outdoor factor adds margin for those conditions rather than assuming ideal reading.',
    },
    {
      question: 'Does the typeface change the answer?',
      answer:
        'Yes, somewhat. Condensed or light-weight faces read smaller than their point size suggests. The calculation assumes a normal-weight face; with a light or condensed face, go a size or two larger.',
    },
    {
      question: 'Should the QR code itself scale with distance too?',
      answer:
        'Yes. The code needs its own size calculation based on scanning distance. Size the code and the frame text separately, then check both on a printed proof.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Frame Text Size Calculator',
    applicationCategory: 'DesignApplication',
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
          { label: 'QR Frame Text Size Calculator', href: '/qr-frame-text-size-calculator' },
        ]}
      />

      <AdSlot id="qr-frame-text-size-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Type className="w-3.5 h-3.5" />
          <span>Design QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Frame Text Size Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Find the minimum legible call-to-action text size for a QR frame: enter the viewing
          distance and conditions, and get the minimum cap height and font size.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter your numbers</h2>
            <div className="space-y-2">
              <Label htmlFor="distance">Viewing distance (metres)</Label>
              <Input
                id="distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="2"
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Viewing conditions</Label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option key="Indoor" value="Indoor">
                  Indoor
                </option>
                <option key="Outdoor" value="Outdoor">
                  Outdoor
                </option>
                <option key="Low light" value="Low light">
                  Low light
                </option>
                <option key="Moving audience" value="Moving audience">
                  Moving audience
                </option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Guideline from angular size: minimum cap height = distance × 0.0029 (about 10
              arcminutes) × condition factor. Font size ≈ cap height / 0.7 / 0.3528 mm per point,
              since cap height is roughly 0.7 of the font size. Condition factors: Indoor 1.0, Low
              light 1.3, Moving audience 1.4, Outdoor 1.5. This is a design guideline, not a
              measured legibility guarantee.
            </p>
            {result.error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {result.error}
              </p>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Result</h2>
            {!result.error && (
              <>
                <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <div className="text-xs text-muted-foreground">Minimum font size</div>
                  <div className="text-4xl font-extrabold text-primary">
                    {result.fontPtRounded} pt
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Minimum cap height: {result.capHeightMm.toFixed(1)} mm
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Viewing distance</span>
                    <span className="font-semibold">{result.d} m</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Conditions</span>
                    <span className="font-semibold">
                      {result.condition} (×{result.factor.toFixed(1)})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Exact computed size</span>
                    <span className="font-semibold">{result.fontPt.toFixed(1)} pt</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">About, at 96 dpi</span>
                    <span className="font-semibold">{result.px.toFixed(0)} px</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This is a minimum for legibility. A call to action people must notice and read
                  deserves type comfortably above the minimum, not exactly at it.
                </p>
              </>
            )}
            <Button variant="outline" size="sm" onClick={copyResult} disabled={!!result.error}>
              {copied ? 'Copied!' : 'Copy result'}
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-frame-text-size-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the QR Frame Text Size Calculator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this calculator works</h3>
        <p className="text-base leading-relaxed">
          Readable text needs a minimum angular size at the eye: as the viewer moves further away,
          the letters must grow to subtend the same angle. This tool applies a 10-arcminute rule for
          cap height, then converts cap height to a font size using the usual approximation that cap
          height is about 0.7 of the font size. The condition factor adds margin for outdoor light,
          low light, and viewers who are moving.
        </p>

        <AdSlot id="qr-frame-text-size-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Why the frame text matters</h3>
        <p className="text-base leading-relaxed">
          The call to action is what turns a printed square into a scan: it tells people what they
          get and what to do. Text below the legible minimum might as well not be there, because
          viewers will not slow down to decode it. Short text in large type — a few words — beats a
          sentence nobody can read.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Checking the result in the real world
        </h3>
        <p className="text-base leading-relaxed">
          Print the frame at final size, stand at the real viewing distance, and read it without
          squinting or stepping closer. If you cannot read it instantly, go bigger. Test in the real
          light too: bright sun, dim corridors, and glare all shrink effective legibility below what
          the numbers suggest.
        </p>
      </article>

      <AdSlot id="qr-frame-text-size-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-frame-text-size-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
