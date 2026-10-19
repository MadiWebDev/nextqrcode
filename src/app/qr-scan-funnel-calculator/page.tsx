'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRScanFunnelCalculatorPage() {
  const [exposures, setExposures] = useState(10000);
  const [scanRate, setScanRate] = useState(4);
  const [landingRate, setLandingRate] = useState(85);
  const [conversionRate, setConversionRate] = useState(10);

  const result = useMemo(() => {
    const scans = exposures * (scanRate / 100);
    const landings = scans * (landingRate / 100);
    const conversions = landings * (conversionRate / 100);
    const overall = exposures > 0 ? (conversions / exposures) * 100 : 0;
    return { scans, landings, conversions, overall };
  }, [exposures, scanRate, landingRate, conversionRate]);

  const faqs = [
    {
      question: 'What are the funnel stages?',
      answer:
        'Exposures (people who could see the code) → scans → successful landing-page loads → conversions (the action you want: purchase, signup, download). Each stage loses some people; the calculator shows exactly where.',
    },
    {
      question: 'Why separate landing success from conversion?',
      answer:
        'Because a scan that never loads the page is a technical failure, not a persuasion failure. Slow pages, dead links, and app-install walls lose scanners before your offer is even seen — fix the page before rewriting the offer.',
    },
    {
      question: 'What is a good overall conversion rate?',
      answer:
        'There is no universal benchmark — it depends on the offer, the audience, and the friction of the action. Compare against your own past campaigns and against the same funnel with one stage improved, not against an invented industry average.',
    },
    {
      question: 'How do I use this to improve a campaign?',
      answer:
        'Enter your measured rates, then raise one stage at a time and watch the overall conversion move. The stage with the biggest drop-off is usually the cheapest place to gain conversions.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Scan Funnel Calculator',
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

  const stages = [
    { label: 'Exposures', value: exposures, pct: 100 },
    { label: 'Scans', value: Math.round(result.scans), pct: scanRate },
    {
      label: 'Landing page loads',
      value: Math.round(result.landings),
      pct: result.scans > 0 ? (result.landings / result.scans) * 100 : 0,
    },
    { label: 'Conversions', value: Math.round(result.conversions), pct: conversionRate },
  ];

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
          { label: 'QR Scan Funnel Calculator', href: '/qr-scan-funnel-calculator' },
        ]}
      />

      <AdSlot id="qr-scan-funnel-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Filter className="w-3.5 h-3.5" />
          <span>Campaign Calculator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Scan Funnel Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Turn stage conversion rates into stage counts and an overall conversion rate, so you can
          see exactly where a QR campaign loses people. Everything recomputes from the rates you
          enter.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter stage rates</h2>
            <div className="space-y-2">
              <Label htmlFor="exposures">Exposures (people who could see the code)</Label>
              <Input
                id="exposures"
                type="number"
                min={0}
                value={exposures}
                onChange={(e) => setExposures(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label>Exposure → scan rate: {scanRate}%</Label>
              <Slider
                value={[scanRate]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={([v]) => setScanRate(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Scan → landing load rate: {landingRate}%</Label>
              <Slider
                value={[landingRate]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={([v]) => setLandingRate(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Landing → conversion rate: {conversionRate}%</Label>
              <Slider
                value={[conversionRate]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={([v]) => setConversionRate(v)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formulas: scans = exposures × scan rate; landings = scans × landing rate; conversions
              = landings × conversion rate; overall conversion = conversions ÷ exposures × 100.
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
                Overall conversion (exposure → conversion)
              </div>
              <div className="text-4xl font-extrabold text-primary">
                {result.overall.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(result.conversions).toLocaleString()} conversions from{' '}
                {exposures.toLocaleString()} exposures
              </div>
            </div>
            <div className="space-y-3">
              {stages.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold">{s.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${Math.max(0, Math.min(100, s.label === 'Exposures' ? 100 : (s.value / Math.max(1, exposures)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-scan-funnel-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Find the Leak Before You Spend More</h2>
        <p className="text-base leading-relaxed">
          A campaign with weak results is rarely weak everywhere. Usually one stage leaks most of
          the audience — the code is not seen, the page does not load, or the offer does not
          convert. Measuring the funnel stage by stage tells you which fix pays: more visibility, a
          faster page, or a better offer. Spending more on exposure when the landing page drops 60%
          of scanners just buys more drop-offs.
        </p>

        <AdSlot id="qr-scan-funnel-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">A practical order of fixes</h3>
        <p className="text-base leading-relaxed">
          Fix load failures first (they waste every other improvement), then the scan rate
          (placement and call to action), then conversion (offer and page). Recompute after each fix
          with your measured rates to confirm the gain.
        </p>
      </article>

      <AdSlot id="qr-scan-funnel-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-scan-funnel-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
