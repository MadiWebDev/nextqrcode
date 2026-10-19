'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const Z_VALUES: Record<string, number> = { '90': 1.645, '95': 1.96, '99': 2.576 };
const POWER_Z: Record<string, number> = { '80': 0.842, '90': 1.282 };

export default function QRScanTestSampleCalculatorPage() {
  const [confidence, setConfidence] = useState('95');
  const [power, setPower] = useState('80');
  const [baseline, setBaseline] = useState(5);
  const [mde, setMde] = useState(2);

  const result = useMemo(() => {
    const z = Z_VALUES[confidence];
    const zb = POWER_Z[power];
    const p = baseline / 100;
    const e = mde / 100;
    // One-sample proportion: n = z² · p(1−p) / e², where e is the margin of error.
    const oneSample = e > 0 ? Math.ceil((z * z * p * (1 - p)) / (e * e)) : 0;
    // Two-sample A/B: per-variant n = (zα + zβ)² · [p1(1−p1) + p2(1−p2)] / (p2−p1)².
    const p2 = Math.min(0.999, p + e);
    const ab =
      p2 > p ? Math.ceil(((z + zb) ** 2 * (p * (1 - p) + p2 * (1 - p2))) / (p2 - p) ** 2) : 0;
    return { oneSample, abPerVariant: ab, abTotal: ab * 2 };
  }, [confidence, power, baseline, mde]);

  const faqs = [
    {
      question: 'What is the difference between the two sample sizes?',
      answer:
        'The one-sample figure sizes a single measurement (e.g. estimating one code’s scan rate within a margin of error). The A/B figure sizes a two-variant comparison: it is the number of scans needed per variant to detect the stated improvement with the chosen power.',
    },
    {
      question: 'What is minimum detectable effect (MDE)?',
      answer:
        'The smallest improvement you care about detecting, in percentage points. A smaller MDE needs a much larger sample — halving the MDE roughly quadruples the required sample size.',
    },
    {
      question: 'What does power mean here?',
      answer:
        'Power is the chance of detecting a real improvement of the MDE size: 80% power means a 1-in-5 chance of missing a real effect. Higher power needs a larger sample.',
    },
    {
      question: 'Why is the A/B sample so much bigger than the one-sample figure?',
      answer:
        'Comparing two noisy rates needs more data than measuring one rate, because the difference between two estimates is noisier than either estimate alone. That is normal — budget for the A/B figure when you plan a test.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Scan Test Sample Calculator',
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
          { label: 'QR Scan Test Sample Calculator', href: '/qr-scan-test-sample-calculator' },
        ]}
      />

      <AdSlot id="qr-scan-test-sample-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Testing Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Scan Test Sample Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out how many scans a test needs: one figure for measuring a single rate within a
          margin of error, and one per-variant figure for an A/B test that can detect a given
          improvement. Both are computed from your inputs with standard sample-size formulas.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter test parameters</h2>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence level</Label>
              <select
                id="confidence"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="90">90% (z = 1.645)</option>
                <option value="95">95% (z = 1.96)</option>
                <option value="99">99% (z = 2.576)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="power">Statistical power (A/B only)</Label>
              <select
                id="power"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="80">80% (z = 0.842)</option>
                <option value="90">90% (z = 1.282)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Baseline conversion rate: {baseline}%</Label>
              <Slider
                value={[baseline]}
                min={0.5}
                max={90}
                step={0.5}
                onValueChange={([v]) => setBaseline(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Margin of error / minimum detectable effect: ±{mde} percentage points</Label>
              <Slider
                value={[mde]}
                min={0.5}
                max={20}
                step={0.5}
                onValueChange={([v]) => setMde(v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baselineInput">Or type the baseline rate (%)</Label>
              <Input
                id="baselineInput"
                type="number"
                min={0.1}
                max={99}
                step={0.1}
                value={baseline}
                onChange={(e) =>
                  setBaseline(Math.min(99, Math.max(0.1, Number(e.target.value) || 0.1)))
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formulas: one-sample n = z² · p(1−p) / E². Two-sample per-variant n = (zα + zβ)² ·
              [p₁(1−p₁) + p₂(1−p₂)] / (p₂−p₁)², where p₂ = baseline + MDE. Results are rounded up to
              whole scans.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">
                A/B test — scans needed per variant
              </div>
              <div className="text-4xl font-extrabold text-primary">
                {result.abPerVariant.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {result.abTotal.toLocaleString()} total across both variants
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">One-sample measurement</span>
                <span className="font-semibold">{result.oneSample.toLocaleString()} scans</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Target rate to detect</span>
                <span className="font-semibold">
                  {(baseline + mde).toFixed(1)}% (from {baseline}%)
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plan the test to reach the A/B figure before judging the winner — stopping early
              because the result looks good inflates false positives.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-scan-test-sample-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Decide the Sample Size Before the Test
        </h2>
        <p className="text-base leading-relaxed">
          A test judged too early is a coin flip dressed as data. The sample-size formulas used here
          turn your ambition — how small an improvement you need to detect, and how sure you want to
          be — into a concrete number of scans. The honest trade-off is that small effects need
          large samples: if the required sample exceeds the traffic the placement will ever get, the
          test cannot answer the question, and you should either accept a larger detectable effect
          or pick a busier placement.
        </p>

        <AdSlot id="qr-scan-test-sample-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">After the test</h3>
        <p className="text-base leading-relaxed">
          Run to the planned size, then judge the result with a significance test on the final
          numbers — do not re-decide the sample size mid-test based on interim results.
        </p>
      </article>

      <AdSlot id="qr-scan-test-sample-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-scan-test-sample-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
