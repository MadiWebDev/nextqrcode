'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Gauge } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const LIGHTING: Record<string, { label: string; score: number }> = {
  bright: { label: 'Bright, even indoor light', score: 100 },
  normal: { label: 'Normal indoor / shaded outdoor', score: 75 },
  dim: { label: 'Dim indoor', score: 45 },
  glare: { label: 'Direct sun / strong glare', score: 25 },
};

const DENSITY: Record<string, { label: string; score: number }> = {
  low: { label: 'Low density — short payload (version 1–4)', score: 100 },
  medium: { label: 'Medium density — version 5–10', score: 70 },
  high: { label: 'High density — version 11+', score: 40 },
};

function gradeFor(score: number): string {
  if (score >= 85) return 'A — Excellent';
  if (score >= 70) return 'B — Good';
  if (score >= 50) return 'C — Marginal';
  if (score >= 30) return 'D — Poor';
  return 'F — Likely to fail';
}

export default function QRReadabilityScoreCalculatorPage() {
  const [sizeRatio, setSizeRatio] = useState(100);
  const [contrast, setContrast] = useState(10);
  const [density, setDensity] = useState('medium');
  const [lighting, setLighting] = useState('normal');

  const result = useMemo(() => {
    const sizeScore = Math.max(0, Math.min(100, sizeRatio));
    const contrastScore = Math.max(0, Math.min(100, ((contrast - 1) / (21 - 1)) * 100));
    const densityScore = DENSITY[density].score;
    const lightingScore = LIGHTING[lighting].score;
    const total = Math.round(
      sizeScore * 0.3 + contrastScore * 0.3 + densityScore * 0.2 + lightingScore * 0.2
    );
    const weakest = [
      { label: 'Size vs distance', score: Math.round(sizeScore) },
      { label: 'Contrast', score: Math.round(contrastScore) },
      { label: 'Density', score: densityScore },
      { label: 'Lighting', score: lightingScore },
    ].sort((a, b) => a.score - b.score)[0];
    return {
      total,
      grade: gradeFor(total),
      sizeScore: Math.round(sizeScore),
      contrastScore: Math.round(contrastScore),
      densityScore,
      lightingScore,
      weakest,
    };
  }, [sizeRatio, contrast, density, lighting]);

  const faqs = [
    {
      question: 'Is this score a measured scan rate?',
      answer:
        'No. It is a composite planning score computed from the four factors you enter, weighted 30% size, 30% contrast, 20% density, 20% lighting. It ranks designs and flags the weakest factor — it does not predict a measured scan rate.',
    },
    {
      question: 'What does "size vs distance" mean?',
      answer:
        'How large the printed code is compared with the size it needs at its viewing distance. 100% means the code is exactly the recommended size for the distance; above 100% it is larger than needed (better), below it is undersized.',
    },
    {
      question: 'Why is contrast capped at 21:1?',
      answer:
        '21:1 is the maximum WCAG contrast ratio (pure black on pure white). The contrast sub-score maps your entered ratio linearly from 1:1 (score 0) to 21:1 (score 100).',
    },
    {
      question: 'My score is low. What do I fix first?',
      answer:
        'Fix the weakest factor shown in the result — it is the bottleneck. Raising an already-strong factor while the weakest stays low moves the total only a little.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Readability Score Calculator',
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
          { label: 'QR Readability Score Calculator', href: '/qr-readability-score-calculator' },
        ]}
      />

      <AdSlot id="qr-readability-score-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Gauge className="w-3.5 h-3.5" />
          <span>Design Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Readability Score Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Combine size, contrast, density, and lighting into one 0–100 readability score with a
          grade and the weakest factor to fix. This is a composite planning score from your inputs,
          not a measured scan rate, and it does not replace the single-factor checkers.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Rate the four factors</h2>
            <div className="space-y-2">
              <Label>Printed size vs size needed at viewing distance: {sizeRatio}%</Label>
              <Slider
                value={[sizeRatio]}
                min={10}
                max={200}
                step={5}
                onValueChange={([v]) => setSizeRatio(v)}
              />
              <p className="text-xs text-muted-foreground">
                100% = exactly the recommended size. Below 100% is undersized; above is oversized.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contrast">Contrast ratio (e.g. 10 for 10:1)</Label>
              <Input
                id="contrast"
                type="number"
                min={1}
                max={21}
                step={0.1}
                value={contrast}
                onChange={(e) =>
                  setContrast(Math.min(21, Math.max(1, Number(e.target.value) || 1)))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="density">Code density</Label>
              <select
                id="density"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(DENSITY).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lighting">Lighting where the code will be scanned</Label>
              <select
                id="lighting"
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(LIGHTING).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Formula: score = 0.30 × size sub-score + 0.30 × contrast sub-score + 0.20 × density
              sub-score + 0.20 × lighting sub-score. Contrast sub-score maps 1:1 → 0 and 21:1 → 100
              linearly. Grades: A ≥ 85, B ≥ 70, C ≥ 50, D ≥ 30, else F.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Readability score</div>
              <div className="text-4xl font-extrabold text-primary">{result.total} / 100</div>
              <div className="text-sm text-muted-foreground">Grade: {result.grade}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Size (30%)</span>
                <span className="font-semibold">{result.sizeScore}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Contrast (30%)</span>
                <span className="font-semibold">{result.contrastScore}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Density (20%)</span>
                <span className="font-semibold">{result.densityScore}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Lighting (20%)</span>
                <span className="font-semibold">{result.lightingScore}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Fix first</span>
                <span className="font-semibold">
                  {result.weakest.label} ({result.weakest.score})
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-readability-score-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">One Weak Factor Can Sink a Code</h2>
        <p className="text-base leading-relaxed">
          Readability is not an average of good intentions: a huge, high-contrast code in blinding
          glare can fail, and a perfect code printed too small fails too. A composite score is
          useful because it forces all four factors onto one page and names the weakest one. Fix the
          bottleneck first — improving an already-strong factor while the weakest stays weak barely
          moves the result.
        </p>

        <AdSlot id="qr-readability-score-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Use it to compare designs</h3>
        <p className="text-base leading-relaxed">
          Score each candidate design with the same assumptions and pick the highest score. Then
          confirm with a printed proof scanned on two phones in the real lighting — the score guides
          the choice, the test-scan proves it.
        </p>
      </article>

      <AdSlot id="qr-readability-score-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-readability-score-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
