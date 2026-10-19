'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function Page() {
  const [outerDia, setOuterDia] = useState('200');
  const [coreDia, setCoreDia] = useState('76');
  const [thickness, setThickness] = useState('0.15');
  const [labelHeight, setLabelHeight] = useState('50');
  const [gap, setGap] = useState('3');
  const [totalLabels, setTotalLabels] = useState('10000');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const od = Number(outerDia);
    const cd = Number(coreDia);
    const th = Number(thickness);
    const lh = Number(labelHeight);
    const g = Number(gap);
    const total = Number(totalLabels);
    if (!Number.isFinite(od) || od <= 0)
      return {
        error: 'Enter an outer diameter greater than 0.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    if (!Number.isFinite(cd) || cd < 0)
      return {
        error: 'Enter a core diameter of 0 or more.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    if (cd >= od)
      return {
        error: 'Core diameter must be smaller than outer diameter.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    if (!Number.isFinite(th) || th <= 0)
      return {
        error: 'Enter a material thickness greater than 0.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    if (!Number.isFinite(lh) || lh <= 0)
      return {
        error: 'Enter a label height greater than 0.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    if (!Number.isFinite(g) || g < 0)
      return {
        error: 'Enter a gap of 0 or more.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    if (!Number.isFinite(total) || total < 1)
      return {
        error: 'Enter total labels needed of 1 or more.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    const area = Math.PI * (Math.pow(od / 2, 2) - Math.pow(cd / 2, 2));
    const rollLengthM = area / th / 1000;
    const pitch = lh + g;
    const perRoll = Math.floor((rollLengthM * 1000) / pitch);
    if (perRoll < 1)
      return {
        error: 'These dimensions give less than one label per roll — check the inputs.',
        rollLengthM: 0,
        perRoll: 0,
        rolls: 0,
        leftover: 0,
        total: 0,
        pitch: 0,
      };
    const rolls = Math.ceil(total / perRoll);
    const leftover = rolls * perRoll - total;
    return { error: '', rollLengthM, perRoll, rolls, leftover, total, pitch };
  }, [outerDia, coreDia, thickness, labelHeight, gap, totalLabels]);

  const copyResult = async () => {
    if (result.error) return;
    await navigator.clipboard.writeText(
      `Roll length: ${result.rollLengthM.toFixed(1)} m. Labels per roll: ${result.perRoll}. Rolls needed for ${result.total} labels: ${result.rolls}. Leftover labels on the last roll: ${result.leftover}.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'Why derive roll length from diameters?',
      answer:
        'Suppliers sometimes quote only outer and core diameters plus material thickness. The annulus formula turns those into a roll length; if your supplier quotes a length directly, use that instead.',
    },
    {
      question: 'What about leader and trailer length?',
      answer:
        'The calculation assumes no leader or trailer. Real rolls lose a little length at the start and end, so order with a small margin and confirm the usable length with your supplier.',
    },
    {
      question: 'Does label width matter here?',
      answer:
        'Not for labels per roll: rolls feed along the length, so the count depends on label height plus gap. Width matters for choosing the roll width and printer, not for this count.',
    },
    {
      question: 'Why round rolls up?',
      answer:
        'You cannot order part of a roll for a job that needs whole labels. Rounding up gives the full rolls that cover the total, and the leftover figure shows how many labels remain on the last roll.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Roll Label Planner',
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
          { label: 'QR Roll Label Planner', href: '/qr-roll-label-planner' },
        ]}
      />

      <AdSlot id="qr-roll-label-planner-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Print Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Roll Label Planner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Plan a roll of QR labels: enter the roll and label dimensions, and get the roll length,
          labels per roll, rolls needed, and leftover labels.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter your numbers</h2>
            <div className="space-y-2">
              <Label htmlFor="outerDia">Roll outer diameter (mm)</Label>
              <Input
                id="outerDia"
                type="number"
                value={outerDia}
                onChange={(e) => setOuterDia(e.target.value)}
                placeholder="200"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coreDia">Core diameter (mm)</Label>
              <Input
                id="coreDia"
                type="number"
                value={coreDia}
                onChange={(e) => setCoreDia(e.target.value)}
                placeholder="76"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Material thickness (mm)</Label>
              <Input
                id="thickness"
                type="number"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="0.15"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labelHeight">Label height (mm)</Label>
              <Input
                id="labelHeight"
                type="number"
                value={labelHeight}
                onChange={(e) => setLabelHeight(e.target.value)}
                placeholder="50"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gap">Gap between labels (mm)</Label>
              <Input
                id="gap"
                type="number"
                value={gap}
                onChange={(e) => setGap(e.target.value)}
                placeholder="3"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalLabels">Total labels needed</Label>
              <Input
                id="totalLabels"
                type="number"
                value={totalLabels}
                onChange={(e) => setTotalLabels(e.target.value)}
                placeholder="10000"
                min="1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Roll length comes from the annulus area: length = π × ((outer/2)² − (core/2)²) /
              thickness. Pitch = label height + gap. Labels per roll = floor(roll length / pitch).
              Rolls needed = ceil(total labels / labels per roll). This assumes the material winds
              uniformly with no leader or trailer.
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
                  <div className="text-xs text-muted-foreground">Labels per roll</div>
                  <div className="text-4xl font-extrabold text-primary">
                    {result.perRoll.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Roll length about {result.rollLengthM.toFixed(1)} m
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">
                      Rolls needed for {result.total.toLocaleString()} labels
                    </span>
                    <span className="font-semibold">{result.rolls}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Leftover labels on the last roll</span>
                    <span className="font-semibold">{result.leftover.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Pitch (label + gap)</span>
                    <span className="font-semibold">{result.pitch} mm</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Confirm the roll length with your supplier: leader, trailer, and winding tension
                  all take a little length, so order with a small margin.
                </p>
              </>
            )}
            <Button variant="outline" size="sm" onClick={copyResult} disabled={!!result.error}>
              {copied ? 'Copied!' : 'Copy result'}
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-roll-label-planner-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to use the QR Roll Label Planner</h2>
        <h3 className="text-xl font-semibold text-foreground">How this planner works</h3>
        <p className="text-base leading-relaxed">
          A wound roll is an annulus: the material area is the area of the outer circle minus the
          area of the core, and dividing that area by the material thickness gives the length of
          material on the roll. Dividing the length by the pitch — one label plus one gap — gives
          labels per roll, and dividing your total need by labels per roll, rounded up, gives rolls
          needed.
        </p>

        <AdSlot id="qr-roll-label-planner-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Why the inputs matter</h3>
        <p className="text-base leading-relaxed">
          Outer diameter and core diameter set how much material fits; thickness sets how tightly it
          packs. A small error in thickness moves the roll length a lot, because the whole area is
          divided by it. If your supplier quotes roll length directly, use that figure instead of
          deriving it — the derivation is for when you only have diameters and a calliper.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Ordering with margin</h3>
        <p className="text-base leading-relaxed">
          The calculation assumes perfect winding with no leader or trailer. Real rolls lose some
          length to the start and end, so add a small margin when ordering, and keep one spare roll
          for long runs. Check the first roll against the plan before committing the whole order.
        </p>
      </article>

      <AdSlot id="qr-roll-label-planner-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-roll-label-planner-bottom" format="horizontal-banner" />

    </div>
  );
}
