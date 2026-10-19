'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Footprints } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const PLACEMENT_FACTORS: Record<string, { label: string; factor: number }> = {
  poor: { label: 'Poor — behind / above eye level, no call to action', factor: 0.4 },
  average: { label: 'Average — visible, small call to action', factor: 0.8 },
  good: { label: 'Good — eye level, clear call to action', factor: 1 },
  prime: { label: 'Prime — in the path, staff mention it, strong offer', factor: 1.4 },
};

export default function QRFootfallScanEstimatorPage() {
  const [footfall, setFootfall] = useState(5000);
  const [noticeRate, setNoticeRate] = useState(20);
  const [scanRate, setScanRate] = useState(5);
  const [placement, setPlacement] = useState('good');

  const result = useMemo(() => {
    const base =
      footfall * (noticeRate / 100) * (scanRate / 100) * PLACEMENT_FACTORS[placement].factor;
    return { low: Math.round(base * 0.6), mid: Math.round(base), high: Math.round(base * 1.6) };
  }, [footfall, noticeRate, scanRate, placement]);

  const faqs = [
    {
      question: 'Is this a prediction of actual scans?',
      answer:
        'No — it is an estimate computed from the assumptions you enter (footfall, notice rate, scan rate, placement). Use it to compare placements and set expectations, then replace the assumed rates with measured rates from a pilot once you have real scan data.',
    },
    {
      question: 'What is the difference between notice rate and scan rate?',
      answer:
        'Notice rate is the share of passers-by who actually see the code. Scan rate is the share of those who notice it and decide to scan. Splitting them shows whether a weak result is a visibility problem or an offer problem — the fixes are different.',
    },
    {
      question: 'Why is there a range instead of one number?',
      answer:
        'Because the inputs are estimates. The range (±40% around the central estimate, wider upward) reflects that uncertainty honestly instead of pretending a single precise figure is known.',
    },
    {
      question: 'How do I improve the estimate?',
      answer:
        'Run a short pilot: count footfall, count scans from your analytics, and derive the real notice and scan rates. Feed those back in and the estimate becomes a forecast grounded in your own location.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Footfall Scan Estimator',
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
          { label: 'QR Footfall Scan Estimator', href: '/qr-footfall-scan-estimator' },
        ]}
      />

      <AdSlot id="qr-footfall-scan-estimator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Footprints className="w-3.5 h-3.5" />
          <span>Campaign Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Footfall Scan Estimator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Estimate how many scans a location should produce from daily foot traffic, how many people
          notice the code, and how many of those decide to scan. The range is computed from your
          assumptions — it is a planning estimate, not a measured forecast.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter your assumptions</h2>
            <div className="space-y-2">
              <Label htmlFor="footfall">Daily footfall past the code</Label>
              <Input
                id="footfall"
                type="number"
                min={0}
                value={footfall}
                onChange={(e) => setFootfall(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label>Notice rate: {noticeRate}% of passers-by see the code</Label>
              <Slider
                value={[noticeRate]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => setNoticeRate(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Scan rate: {scanRate}% of those who notice it scan</Label>
              <Slider
                value={[scanRate]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={([v]) => setScanRate(v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placement">Placement quality</Label>
              <select
                id="placement"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(PLACEMENT_FACTORS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (×{v.factor})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Formula: central estimate = footfall × notice rate × scan rate × placement factor.
              Range = 0.6× to 1.6× the central estimate, reflecting uncertainty in the assumed
              rates.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Expected scans per day</div>
              <div className="text-4xl font-extrabold text-primary">
                {result.low.toLocaleString()} – {result.high.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                central estimate: {result.mid.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">People who notice it</span>
                <span className="font-semibold">
                  {Math.round(footfall * (noticeRate / 100)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Weekly scans (central)</span>
                <span className="font-semibold">{(result.mid * 7).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If the range is too low for your goal, the levers are visibility (bigger code, eye
              level, better lighting) and motivation (a clearer offer next to the code).
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-footfall-scan-estimator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Footfall Is Not Scans</h2>
        <p className="text-base leading-relaxed">
          A busy street does not guarantee scans. Most passers-by never look at the code, and most
          who do look decide not to scan. Breaking the journey into footfall, notice, and scan
          decision makes the bottleneck visible: a code nobody sees needs placement work, while a
          code people see but ignore needs a better reason to scan.
        </p>

        <AdSlot id="qr-footfall-scan-estimator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Using the estimate</h3>
        <p className="text-base leading-relaxed">
          Start with conservative rates, compare two or three candidate placements, and treat the
          winning placement as a hypothesis to test with a short pilot. Once real scans are flowing,
          replace the assumed rates with measured ones and the estimate becomes a reliable forecast.
        </p>
      </article>

      <AdSlot id="qr-footfall-scan-estimator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-footfall-scan-estimator-bottom" format="horizontal-banner" />

    </div>
  );
}
