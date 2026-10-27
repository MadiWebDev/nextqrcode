'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Split } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'What should I change between variant A and B?',
    answer:
      'Exactly one thing: the headline, the code size, the call to action, or the placement. Changing several things at once makes the result uninterpretable.',
  },
  {
    question: 'Why does a small effect need such a large sample?',
    answer:
      'Because small differences are hard to separate from random variation. Halving the minimum detectable effect roughly quadruples the required sample, per the two-proportion formula shown on the page.',
  },
  {
    question: 'Can I stop the test early if a winner appears?',
    answer:
      'No. Early results bounce wildly, and stopping at a peak exaggerates the winner. Run to the planned sample or duration, then decide once using the pre-written rules.',
  },
  {
    question: 'Do I need equal traffic for both variants?',
    answer:
      'Yes, as equal as you can manage, over the same days and in comparable spots. A scan count without its exposure denominator cannot be compared fairly.',
  },
];

export default function QrABTestPlannerPage() {
  const [variantA, setVariantA] = useState('Current poster');
  const [variantB, setVariantB] = useState('New headline + larger code');
  const [metric, setMetric] = useState('Scan rate (scans / exposures)');
  const [baseline, setBaseline] = useState(4);
  const [mde, setMde] = useState(1);
  const [confidence, setConfidence] = useState(95);
  const [duration, setDuration] = useState(14);
  const p = baseline / 100;
  const delta = mde / 100;
  const z = confidence === 95 ? 1.96 : confidence === 90 ? 1.645 : 2.576;
  const pAvg = p + delta / 2;
  const perVariant =
    p > 0 && delta > 0 ? Math.ceil((2 * pAvg * (1 - pAvg) * z * z) / (delta * delta)) : 0;
  const totalNeeded = perVariant * 2;
  const dailyNeeded = duration > 0 ? Math.ceil(totalNeeded / duration) : 0;
  const expectedA = Math.round(perVariant * p);
  const expectedB = Math.round(perVariant * (p + delta));
  function printPlan() {
    window.print();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR A/B Test Planner',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
          { label: 'QR A/B Test Planner', href: '/qr-a-b-test-planner' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Split className="w-3.5 h-3.5" />
          <span>Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR A/B Test Planner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Plan a QR A/B test: variants, sample sizes, success metric, and a printable test plan with
          decision rules.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ab-a">Variant A (control)</Label>
              <Input id="ab-a" value={variantA} onChange={(e) => setVariantA(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ab-b">Variant B (challenger)</Label>
              <Input id="ab-b" value={variantB} onChange={(e) => setVariantB(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ab-metric">Success metric</Label>
            <Input id="ab-metric" value={metric} onChange={(e) => setMetric(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Baseline rate (variant A): {baseline}%</Label>
            <Slider
              value={[baseline]}
              min={0.1}
              max={50}
              step={0.1}
              onValueChange={([v]) => setBaseline(v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum detectable effect: +{mde} percentage points</Label>
            <Slider
              value={[mde]}
              min={0.1}
              max={20}
              step={0.1}
              onValueChange={([v]) => setMde(v)}
            />
            <p className="text-xs text-muted-foreground">
              The smallest improvement worth acting on. Smaller effects need much larger samples.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Confidence level</Label>
            <div className="flex gap-2">
              {[90, 95, 99].map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={confidence === c ? 'default' : 'outline'}
                  onClick={() => setConfidence(c)}
                >
                  {c}%
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Planned test duration: {duration} days</Label>
            <Slider
              value={[duration]}
              min={1}
              max={90}
              step={1}
              onValueChange={([v]) => setDuration(v)}
            />
          </div>
          <Button onClick={printPlan}>Print test plan</Button>
        </Card>
        <Card className="p-6 space-y-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Test plan</p>
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exposures per variant</span>
              <strong>{perVariant.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total exposures needed</span>
              <strong>{totalNeeded.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exposures per day (all variants)</span>
              <strong>{dailyNeeded.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected successes, A / B</span>
              <strong>
                {expectedA.toLocaleString()} / {expectedB.toLocaleString()}
              </strong>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-xs space-y-1 font-mono">
            <p className="font-sans font-semibold">
              Sample-size formula (two-proportion, normal approximation, 80% power)
            </p>
            <p>n per variant = 2 x p_avg x (1 - p_avg) x z^2 / delta^2</p>
            <p>p_avg = baseline + delta / 2 = {(pAvg * 100).toFixed(2)}%</p>
            <p>
              z = {z} for {confidence}% confidence
            </p>
            <p>delta = {mde} percentage points</p>
          </div>
          <div className="rounded-lg border p-4 text-xs leading-relaxed space-y-2">
            <p className="font-semibold">Decision rules (decide before launch)</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                If B beats A by at least the minimum detectable effect at the chosen confidence,
                adopt B.
              </li>
              <li>
                If the difference is smaller than the minimum detectable effect, keep A — the change
                is not worth the switching cost.
              </li>
              <li>If B performs worse than A, stop the test and keep A.</li>
              <li>
                Do not stop early because a result looks good, and do not extend the test until a
                winner appears.
              </li>
              <li>
                Split traffic as evenly as possible and keep placements comparable, so the only
                difference is the variant.
              </li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Plan: A = {variantA}; B = {variantB}; metric = {metric}; duration = {duration} days.
          </p>
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-a-b-test-planner-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Run a QR A/B Test That Actually Means Something
        </h2>
        <p className="text-base leading-relaxed">
          An A/B test compares two versions of the same QR placement and asks one question: which
          one performs better, and by how much. The comparison only means something if the two
          variants are tested fairly, on comparable traffic, with a sample large enough to
          distinguish a real difference from random noise. Most QR tests fail on one of those three
          conditions. They run for a weekend, they compare a poster in a busy entrance with a poster
          in a quiet corridor, or they declare a winner because one variant got three more scans.
          This planner exists to prevent those mistakes by fixing the sample size, the metric, and
          the decision rules before the test starts.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-a-b-test-planner-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Start with a single change. Variant A is the current version; variant B changes one thing,
          such as the headline, the code size, the call to action, or the placement. Changing three
          things at once makes the result uninterpretable: if B wins, you will not know which change
          caused it, and you will not know what to keep. The success metric must also be single and
          measurable. Scan rate is the natural metric for a QR test, but conversion rate or revenue
          per exposure may matter more if the goal is sales rather than scans. Pick the metric that
          matches the business goal, write it down, and do not switch metrics halfway through
          because another one looks better.
        </p>
        <p className="text-base leading-relaxed">
          Sample size is where the arithmetic matters. The smaller the improvement you want to
          detect, the larger the sample you need, and the relationship is punishing: halving the
          minimum detectable effect roughly quadruples the required sample. That is why the planner
          asks for the smallest improvement worth acting on, not the improvement you hope for. If
          the honest answer is that only a large improvement would justify switching, the sample
          stays manageable. If you insist on detecting a tiny effect, the planner will tell you the
          test needs more traffic than the placement can deliver, and the correct response is to run
          the test longer, pick a higher-traffic placement, or accept a larger minimum effect.
        </p>
        <p className="text-base leading-relaxed">
          Fairness in traffic is the condition people overlook. The two variants must see comparable
          audiences, in comparable places, over the same days. Running variant A on weekdays and
          variant B on weekends confounds the test with the calendar. Placing A at eye level and B
          behind a door confounds it with visibility. The cleanest design for physical QR tests is
          alternating placements in the same location on the same days, or two matched locations
          with similar foot traffic. Keep the split as even as you can, and record the exposures per
          variant, not just the scans, because a scan count without its denominator is meaningless.
        </p>
        <p className="text-base leading-relaxed">
          The decision rules must be written before launch, because after launch everyone is tempted
          to move the goalposts. The rules on this planner are deliberately strict: adopt B only if
          it beats A by at least the minimum detectable effect at the chosen confidence; keep A if
          the difference is smaller; stop if B is worse. Do not peek daily and stop the moment a
          result looks good, because early results bounce wildly and stopping at a peak guarantees
          an exaggerated winner. Run the test to its planned sample or its planned duration, then
          decide once, and write the result down with the numbers so the next test starts from
          evidence instead of opinion.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-a-b-test-planner-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq, i) => (
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
      <AdSlot id="qr-a-b-test-planner-bottom" format="horizontal-banner" />
    </div>
  );
}
