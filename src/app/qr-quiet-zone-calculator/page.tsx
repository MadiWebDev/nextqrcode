'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Ruler } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRQuietZoneCalculatorPage() {
  const [version, setVersion] = useState(5);
  const [printSize, setPrintSize] = useState(40);
  const modules = 21 + 4 * (version - 1);
  const moduleMm = printSize / modules;
  const quietMm = moduleMm * 4;
  const totalMm = printSize + quietMm * 2;
  const mmToIn = (mm: number) => mm / 25.4;

  const faqs = [
    {
      question: 'How wide must the quiet zone be?',
      answer:
        'At least 4 modules on all four sides, per ISO/IEC 18004. A module is one square cell of the code, so the margin in millimetres depends on the version and the printed size — use this calculator to get the exact number.',
    },
    {
      question: 'Can the quiet zone be a colour other than white?',
      answer:
        'Yes, as long as the whole margin is a single solid colour with strong contrast against the code, and the code plus margin sit on that colour. Gradients, photos, or textures inside the margin can be misread as part of the code.',
    },
    {
      question: 'What happens if text touches the quiet zone?',
      answer:
        'The scanner may fail to isolate the code from its surroundings, especially near the corner finder patterns. Even a thin rule or a nearby headline can cause intermittent failures that are hard to reproduce in testing.',
    },
    {
      question: 'Does the quiet zone count as part of the QR code size?',
      answer:
        'For layout and print, yes — always plan around the total footprint including the margin. If you brief a designer with only the code width, the margin is the first thing that gets squeezed when space runs short.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Quiet Zone Calculator',
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
          { label: 'Quiet Zone Calculator', href: '/qr-quiet-zone-calculator' },
        ]}
      />

      <AdSlot id="qr-quiet-zone-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Ruler className="w-3.5 h-3.5" />
          <span>Print Spec Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Quiet Zone Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out the quiet-zone margin a QR code needs from its version and printed size, in
          millimetres and inches, including the total footprint with the margin.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Your code</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="ver">QR version (1–40)</Label>
                <Input
                  id="ver"
                  type="number"
                  min="1"
                  max="40"
                  step="1"
                  value={version}
                  onChange={(e) =>
                    setVersion(Math.min(40, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[version]}
                min={1}
                max={40}
                step={1}
                onValueChange={([v]) => setVersion(v)}
              />
              <p className="text-[11px] text-muted-foreground">
                Version {version} = {modules} × {modules} modules. Higher versions pack more data
                into the same size, so each module gets smaller.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="psize">Printed code width, excluding quiet zone (mm)</Label>
                <Input
                  id="psize"
                  type="number"
                  min="5"
                  max="2000"
                  step="1"
                  value={printSize}
                  onChange={(e) => setPrintSize(Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[printSize]}
                min={10}
                max={300}
                step={1}
                onValueChange={([v]) => setPrintSize(v)}
              />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Modules per side = 21 + 4 × (version − 1). Module size = printed width ÷ modules per
              side. Quiet zone per side = 4 × module size (the ISO/IEC 18004 requirement of a
              4-module margin). Total footprint = printed width + 8 × module size. The quiet zone
              must be the background colour, empty of text, logos, and graphics.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Quiet zone per side</div>
              <div className="text-4xl font-extrabold text-primary">{quietMm.toFixed(2)} mm</div>
              <div className="text-xs text-muted-foreground mt-1">
                ({mmToIn(quietMm).toFixed(3)} inches)
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Module size</span>
                <span className="font-semibold">{moduleMm.toFixed(3)} mm</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Code width (no margin)</span>
                <span className="font-semibold">
                  {printSize} mm ({mmToIn(printSize).toFixed(2)} in)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Total footprint incl. quiet zone</span>
                <span className="font-semibold">
                  {totalMm.toFixed(1)} mm ({mmToIn(totalMm).toFixed(2)} in)
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              When briefing a designer, give the total footprint, not just the code width —
              otherwise the margin gets squeezed when the artwork is laid out.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-quiet-zone-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Quiet Zone: Four Modules That Decide Everything
        </h2>
        <p className="text-base leading-relaxed">
          The quiet zone is the empty margin around a QR code, and it is the single most common
          reason professionally designed codes fail. The rule is simple: the margin must be at least
          four modules wide on all four sides, where a module is one square cell of the code. A
          designer who crops that margin to make a layout look tidy has not improved the design,
          they have removed the boundary the scanner uses to find the code in the first place. The
          scanner looks for the finder patterns, the three large squares in the corners, and it can
          only separate them from their surroundings when a clean margin isolates them.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Why the margin scales with the code
        </h3>
        <p className="text-base leading-relaxed">
          Because the rule is expressed in modules, the quiet zone in millimetres depends on both
          the version and the printed size. A small, low-version code printed at 30 mm has chunky
          modules and a generous margin in absolute terms. A high-version code carrying a long URL,
          printed at the same 30 mm, has tiny modules and therefore a much smaller margin — and much
          less room for error. That is one reason long payloads are risky in small print:
          everything, including the margin, shrinks together. Shortening the payload or enlarging
          the print restores margin and module size at the same time.
        </p>

        <AdSlot id="qr-quiet-zone-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          What counts as breaking the quiet zone
        </h3>
        <p className="text-base leading-relaxed">
          Anything that is not the background colour counts as breaking it: text, rules, photos,
          shadows, a neighbouring graphic, or even a fold or a cut edge that runs through the
          margin. A coloured background is fine as long as the whole quiet zone is that colour and
          the contrast against the code still passes. A gradient or textured background inside the
          margin is not fine, because the scanner may read the texture as part of the code. If a
          code sits on a photograph, place a solid box behind the code and its margin rather than
          hoping the photo is quiet enough.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Getting it right in production</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Brief designers with the total footprint including the quiet zone, and show the margin
            as a visible guide box in proofs.
          </li>
          <li>
            Never let a crop, bleed, or die-cut line pass through the margin. If the code is near a
            page edge, move it inward.
          </li>
          <li>
            On curved or folded packaging, keep the margin clear of the fold line as well as the
            code itself.
          </li>
          <li>
            When a code is exported with transparency, confirm the receiving layout keeps a solid
            background behind the margin.
          </li>
          <li>
            Test-scan the final printed piece, not just the screen proof — cropping happens at print
            time.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Four modules of nothing is not wasted space. It is the frame that makes the code readable,
          and it is the cheapest insurance in print production.
        </p>
      </article>

      <AdSlot id="qr-quiet-zone-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-quiet-zone-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
