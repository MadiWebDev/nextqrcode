'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sun } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRFadeRiskCheckerPage() {
  const [sun, setSun] = useState('high');
  const [material, setMaterial] = useState('paper');
  const [laminate, setLaminate] = useState('none');
  const [placement, setPlacement] = useState('south');
  const [months, setMonths] = useState(12);
  const weights: Record<string, Record<string, number>> = {
    sun: { low: 5, medium: 20, high: 40 },
    material: { paper: 25, vinyl: 10, polyester: 5, metal: 2 },
    laminate: { none: 20, standard: 8, uv: 3 },
    placement: { south: 15, eastwest: 8, north: 3, indoor: 0, shaded: 2 },
  };
  const durationFactor = months <= 3 ? 0.5 : months <= 12 ? 1 : months <= 36 ? 1.3 : 1.5;
  const raw =
    (weights.sun[sun] +
      weights.material[material] +
      weights.laminate[laminate] +
      weights.placement[placement]) *
    durationFactor;
  const score = Math.min(100, Math.round(raw));
  const band =
    score < 30
      ? 'Low risk'
      : score < 60
        ? 'Moderate risk'
        : score < 80
          ? 'High risk'
          : 'Very high risk';
  const mitigations = [
    ...(sun === 'high'
      ? ['Move the code to shade, a north-facing surface, or an indoor position if possible.']
      : []),
    ...(material === 'paper'
      ? ['Switch from paper to vinyl or polyester for any outdoor exposure.']
      : []),
    ...(laminate === 'none'
      ? ['Add a UV-stable laminate or overlaminate rated for outdoor use.']
      : []),
    ...(months > 12
      ? ['Plan a replacement schedule and a scannability re-check at least once a year.']
      : []),
    'Use black on white for maximum contrast headroom as fading begins.',
    'Point the code at a redirect you control, so a replacement sign can reuse the same printed code where practical.',
  ];

  const faqs = [
    {
      question: 'How long does an outdoor QR code last?',
      answer:
        'It depends on sun, substrate, laminate, and placement — from weeks for unprotected paper in direct sun to years for a laminated metal or polyester sign in shade. Use the checker to compare your combination, and schedule scan tests at least once a year.',
    },
    {
      question: 'Does laminate stop fading?',
      answer:
        'It slows it. A UV-stable overlaminate protects against ultraviolet, abrasion, and cleaning far better than a standard laminate, but no laminate makes a code immortal. Placement and substrate still matter.',
    },
    {
      question: 'Why do faded codes fail gradually instead of all at once?',
      answer:
        "Fading lowers the contrast ratio a little at a time. The code keeps scanning while contrast stays above the scanner's threshold, becomes intermittent near it, and stops once it falls below. That is why scheduled checks catch the problem before customers do.",
    },
    {
      question: 'Which face of a building is worst for QR fading?',
      answer:
        'In the northern hemisphere, south-facing surfaces receive the most direct sun over the year; in the southern hemisphere it is north-facing. Shaded and indoor placements fade slowest. The checker treats placement as one of four weighted factors.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Fade Risk Checker',
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
          { label: 'QR Fade Risk Checker', href: '/qr-fade-risk-checker' },
        ]}
      />

      <AdSlot id="qr-fade-risk-checker-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Sun className="w-3.5 h-3.5" />
          <span>Outdoor Durability Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Fade Risk Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Score how likely an outdoor QR code is to fade to unreadable, from sun exposure, material,
          laminate, and placement — with mitigations matched to your answers.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Exposure and materials</h2>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Direct sun exposure
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['low', 'Low'],
                  ['medium', 'Medium'],
                  ['high', 'High'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSun(k)}
                    className={`p-3 text-center rounded-xl border text-xs ${sun === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Substrate
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  ['paper', 'Paper'],
                  ['vinyl', 'Vinyl'],
                  ['polyester', 'Polyester'],
                  ['metal', 'Metal'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMaterial(k)}
                    className={`p-3 text-center rounded-xl border text-xs ${material === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Protective laminate
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['none', 'None'],
                  ['standard', 'Standard'],
                  ['uv', 'UV-stable'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setLaminate(k)}
                    className={`p-3 text-center rounded-xl border text-xs ${laminate === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Placement
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['south', 'South-facing'],
                  ['eastwest', 'East / West'],
                  ['north', 'North-facing'],
                  ['shaded', 'Shaded'],
                  ['indoor', 'Indoor'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPlacement(k)}
                    className={`p-3 text-center rounded-xl border text-xs ${placement === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="months">Planned outdoor life (months)</Label>
                <Input
                  id="months"
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  value={months}
                  onChange={(e) => setMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[months]}
                min={1}
                max={60}
                step={1}
                onValueChange={([v]) => setMonths(v)}
              />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">How the score is built</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each answer carries a stated risk weight (sun up to 40, substrate up to 25, laminate
              up to 20, placement up to 15), summed and scaled by planned lifetime (0.5× up to 3
              months, 1× up to 12, 1.3× up to 36, 1.5× beyond). The weights are planning judgements,
              not laboratory measurements: they rank combinations so you can compare options, and
              the mitigations matter more than the exact number.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Fade risk score (0–100)</div>
              <div className="text-4xl font-extrabold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {band} · {months} months planned
              </div>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${score}%` }} />
            </div>
            <h3 className="font-semibold text-sm">Mitigations for this setup</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
              {mitigations.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-fade-risk-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Outdoor QR Codes Fade — Plan for It</h2>
        <p className="text-base leading-relaxed">
          An outdoor QR code is in a slow race against sunlight, rain, and abrasion. The fading is
          gradual, which makes it dangerous: the code scans fine for months, then one week it starts
          failing intermittently, then it stops entirely, and nobody notices until the campaign is
          already over. The contrast that the scanner depends on is exactly what fading removes. A
          code that started at a comfortable contrast ratio drifts downward as the dark modules
          lighten, until it crosses the threshold where the scanner can no longer tell dark from
          light. The checker on this page scores that risk from the factors you control, so you can
          change them before printing rather than after failing.
        </p>
        <h3 className="text-xl font-semibold text-foreground">The four factors that matter most</h3>
        <p className="text-base leading-relaxed">
          Sun exposure dominates: direct sun, especially on a south-facing surface in the northern
          hemisphere, delivers far more ultraviolet than a shaded or north-facing spot. Substrate
          comes next. Paper degrades quickly outdoors even when laminated, because moisture reaches
          the fibres and the print with it. Vinyl is the workhorse for outdoor signage, and
          polyester and metal plates sit above it for long-life installations. Laminate is the third
          factor: a UV-stable overlaminate slows fading and protects against abrasion and cleaning,
          while a standard laminate helps with water and scuffing but offers limited UV protection.
          Duration multiplies everything — a setup that survives a summer may not survive three
          years, and the score reflects that.
        </p>

        <AdSlot id="qr-fade-risk-checker-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Designing for a long outdoor life</h3>
        <p className="text-base leading-relaxed">
          Start with the strongest contrast you can: black on white gives the most headroom to lose.
          Keep the payload short so the modules are large and the code tolerates some edge
          softening. Choose the substrate and laminate for the real lifetime, not the launch date —
          the cheapest option that survives the opening month is a false economy if the sign must
          last two years. And build in a maintenance habit: schedule a scan test at least once a
          year, more often for harsh exposures, and photograph the code each time so you can see the
          drift before it becomes a failure.
        </p>
        <h3 className="text-xl font-semibold text-foreground">When the score is high</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Change the placement first — shade is free and often beats any material upgrade.</li>
          <li>
            Upgrade substrate and laminate together; a good laminate on paper still leaves paper
            underneath.
          </li>
          <li>Shorten the payload and enlarge the code so the code has margin to degrade.</li>
          <li>Plan a replacement date and put it in the calendar, not in someone&apos;s memory.</li>
          <li>
            Point the code at a redirect you control so the destination can move without a reprint.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Fading is predictable. A code that is specified, placed, and maintained with its whole
          lifetime in mind will still be scanning when the campaign ends.
        </p>
      </article>

      <AdSlot id="qr-fade-risk-checker-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-fade-risk-checker-bottom" format="horizontal-banner" />

    </div>
  );
}
