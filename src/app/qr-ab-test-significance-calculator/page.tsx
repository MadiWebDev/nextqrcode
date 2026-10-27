'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlaskConical } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

// Abramowitz & Stegun 7.1.26 error-function approximation.
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const poly =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  const y = 1 - poly * Math.exp(-ax * ax);
  return sign * y;
}
// For 1 degree of freedom, p = 1 - erf(sqrt(chi2 / 2)).
function chiSquarePValue(chi2: number): number {
  if (chi2 <= 0) return 1;
  return Math.max(0, Math.min(1, 1 - erf(Math.sqrt(chi2 / 2))));
}

export default function QRABTestSignificanceCalculatorPage() {
  const [aScans, setAScans] = useState(1000);
  const [aConv, setAConv] = useState(50);
  const [bScans, setBScans] = useState(1000);
  const [bConv, setBConv] = useState(68);

  const result = useMemo(() => {
    const aRate = aScans > 0 ? aConv / aScans : 0;
    const bRate = bScans > 0 ? bConv / bScans : 0;
    const totalScans = aScans + bScans;
    const totalConv = aConv + bConv;
    const totalNon = totalScans - totalConv;
    let chi2 = 0;
    let valid =
      aScans > 0 &&
      bScans > 0 &&
      totalConv > 0 &&
      totalNon > 0 &&
      aConv <= aScans &&
      bConv <= bScans;
    if (valid) {
      // Expected counts: row total × column total / grand total.
      const expected = [
        (aScans * totalConv) / totalScans,
        (aScans * totalNon) / totalScans,
        (bScans * totalConv) / totalScans,
        (bScans * totalNon) / totalScans,
      ];
      const observed = [aConv, aScans - aConv, bConv, bScans - bConv];
      chi2 = observed.reduce(
        (sum, o, i) => sum + (expected[i] > 0 ? (o - expected[i]) ** 2 / expected[i] : 0),
        0
      );
      if (expected.some((e) => e < 5)) valid = false;
    }
    const p = valid ? chiSquarePValue(chi2) : NaN;
    const uplift = aRate > 0 ? ((bRate - aRate) / aRate) * 100 : bRate > 0 ? Infinity : 0;
    return {
      aRate: aRate * 100,
      bRate: bRate * 100,
      chi2,
      p,
      significant: valid && p < 0.05,
      valid,
      uplift,
      winner: bRate > aRate ? 'B' : aRate > bRate ? 'A' : 'Tie',
    };
  }, [aScans, aConv, bScans, bConv]);

  const faqs = [
    {
      question: 'What test does this calculator run?',
      answer:
        'A chi-square test of independence on the 2×2 table (variant × converted / not converted), with 1 degree of freedom. The p-value is the probability of seeing a difference at least this large if both variants truly converted at the same rate.',
    },
    {
      question: 'What does "significant at 5%" mean?',
      answer:
        'It means the p-value is below 0.05: the observed difference would be unusual (under 1-in-20) if there were no real difference. It is not proof the winner is better, and it says nothing about how big the improvement is — check the uplift too.',
    },
    {
      question: 'Why does it warn about small expected counts?',
      answer:
        'The chi-square approximation is unreliable when any expected cell count is below 5. With tiny samples or very rare conversions, collect more data (or use an exact test) instead of trusting the p-value.',
    },
    {
      question: 'Can I peek at the result early and stop?',
      answer:
        'Repeated peeking inflates the false-positive rate: checking daily and stopping at the first significant moment makes "significant" far more common than 5% under no real difference. Decide the sample size in advance and run to it.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR A/B Test Significance Calculator',
    applicationCategory: 'BusinessApplication',
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
          {
            label: 'QR A/B Test Significance Calculator',
            href: '/qr-ab-test-significance-calculator',
          },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Testing Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR A/B Test Significance Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enter scans and conversions for two QR variants and get a real chi-square test: the
          chi-square statistic, the p-value, and a significant / not-significant verdict at the 5%
          level. Everything recomputes from your numbers.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter results per variant</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aScans">Variant A — scans</Label>
                <Input
                  id="aScans"
                  type="number"
                  min={0}
                  value={aScans}
                  onChange={(e) => setAScans(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aConv">Variant A — conversions</Label>
                <Input
                  id="aConv"
                  type="number"
                  min={0}
                  value={aConv}
                  onChange={(e) => setAConv(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bScans">Variant B — scans</Label>
                <Input
                  id="bScans"
                  type="number"
                  min={0}
                  value={bScans}
                  onChange={(e) => setBScans(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bConv">Variant B — conversions</Label>
                <Input
                  id="bConv"
                  type="number"
                  min={0}
                  value={bConv}
                  onChange={(e) => setBConv(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                />
              </div>
            </div>
            {(aConv > aScans || bConv > bScans) && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                Conversions cannot exceed scans for a variant.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Method: chi-square on the 2×2 table, χ² = Σ (observed − expected)² / expected, 1
              degree of freedom. p-value = 1 − erf(√(χ²/2)), using the Abramowitz &amp; Stegun
              error-function approximation. The test needs every expected cell count ≥ 5 to be
              trustworthy.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div
              className={`text-center rounded-xl border p-4 ${result.significant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-primary/5 border-primary/20'}`}
            >
              <div className="text-xs text-muted-foreground">Verdict (α = 0.05)</div>
              <div
                className={`text-3xl font-extrabold ${result.significant ? 'text-emerald-600' : 'text-primary'}`}
              >
                {result.valid
                  ? result.significant
                    ? 'Significant'
                    : 'Not significant'
                  : 'Cannot test'}
              </div>
              <div className="text-sm text-muted-foreground">
                {result.valid
                  ? `p = ${result.p.toFixed(4)} · χ² = ${result.chi2.toFixed(3)}`
                  : 'Check the inputs below.'}
              </div>
            </div>
            {!result.valid && (
              <p className="text-sm text-amber-600 dark:text-amber-400" role="alert">
                The chi-square approximation needs positive scan counts and every expected cell
                count ≥ 5. Collect more data.
              </p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Variant A conversion rate</span>
                <span className="font-semibold">{result.aRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Variant B conversion rate</span>
                <span className="font-semibold">{result.bRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Relative uplift (B vs A)</span>
                <span className="font-semibold">
                  {Number.isFinite(result.uplift) ? `${result.uplift.toFixed(1)}%` : '—'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Leading variant</span>
                <span className="font-semibold">{result.winner}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.valid && !result.significant
                ? 'The difference could plausibly be chance. Keep running to the planned sample size before deciding.'
                : result.significant
                  ? 'The difference is unlikely to be chance alone. Check the uplift is large enough to matter before switching.'
                  : ''}
            </p>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-ab-test-significance-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          A Higher Rate Is Not Always a Real Win
        </h2>
        <p className="text-base leading-relaxed">
          With small samples, one variant can lead by pure luck. The chi-square test asks how
          surprising the gap is if both variants were actually equal. Only when the gap is too large
          to dismiss as chance — conventionally, a p-value under 0.05 — should you treat the winner
          as genuinely better. Even then, significance is about existence of a difference, not its
          size: a tiny but significant uplift may not justify reprinting anything.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-ab-test-significance-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Common traps</h3>
        <p className="text-base leading-relaxed">
          Peeking daily and stopping at the first significant moment, testing on tiny samples, and
          running many variants at once all inflate false positives. Decide the sample size before
          the test, run to it, and judge the winner on uplift as well as significance.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-ab-test-significance-calculator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-ab-test-significance-calculator-bottom" format="horizontal-banner" />
    </div>
  );
}
