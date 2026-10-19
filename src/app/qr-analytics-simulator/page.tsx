'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChartColumn } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'Where should my scan rate assumption come from?',
    answer:
      "From your own past campaigns or a small pilot run. This tool supplies no benchmark rates, because a rate from someone else's audience, placement, and offer does not predict yours.",
  },
  {
    question: 'What is an exposure in this simulator?',
    answer:
      'One person close enough to the code to read the call to action. A handed flyer gets about one exposure; a poster in a corridor gets many. Count only people who could realistically notice the code.',
  },
  {
    question: 'Which number should drive the go or no-go decision?',
    answer:
      'Cost per conversion, compared with what you already pay for a conversion through other channels. Total scans alone can hide a campaign that is expensive for every real result.',
  },
  {
    question: 'What if the campaign only works at an optimistic scan rate?',
    answer:
      'Treat that as a no-go. Run pessimistic, realistic, and optimistic scenarios; if only the optimistic one pays off, the campaign is not sound. Pilot first, or improve the offer and placement.',
  },
];

export default function QrAnalyticsSimulatorPage() {
  const [prints, setPrints] = useState(5000);
  const [exposures, setExposures] = useState(2);
  const [scanRate, setScanRate] = useState(3);
  const [conversionRate, setConversionRate] = useState(20);
  const [orderValue, setOrderValue] = useState(25);
  const [unitCost, setUnitCost] = useState(0.4);
  const [fixedCost, setFixedCost] = useState(500);
  const totalExposures = prints * exposures;
  const scans = totalExposures * (scanRate / 100);
  const conversions = scans * (conversionRate / 100);
  const revenue = conversions * orderValue;
  const totalCost = prints * unitCost + fixedCost;
  const costPerScan = scans > 0 ? totalCost / scans : 0;
  const costPerConversion = conversions > 0 ? totalCost / conversions : 0;
  const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0;
  const breakEven =
    orderValue * (conversionRate / 100) > 0 ? totalCost / (orderValue * (conversionRate / 100)) : 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Analytics Simulator',
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
          { label: 'QR Analytics Simulator', href: '/qr-analytics-simulator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ChartColumn className="w-3.5 h-3.5" />
          <span>Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Analytics Simulator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enter your own assumptions — prints, scan rate, conversion — and see projected scans and
          conversions with every formula shown.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <p className="text-xs text-muted-foreground">
            Every number below is your own assumption. The tool computes only arithmetic from what
            you enter — it contains no industry benchmarks and no pre-filled performance claims.
          </p>
          <div className="space-y-2">
            <Label htmlFor="as-prints">Pieces printed / distributed</Label>
            <Input
              id="as-prints"
              type="number"
              min={0}
              value={prints}
              onChange={(e) => setPrints(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Average views per piece: {exposures}</Label>
            <Slider
              value={[exposures]}
              min={1}
              max={50}
              step={1}
              onValueChange={([v]) => setExposures(v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Your assumed scan rate: {scanRate}%</Label>
            <Slider
              value={[scanRate]}
              min={0}
              max={50}
              step={0.5}
              onValueChange={([v]) => setScanRate(v)}
            />
            <p className="text-xs text-muted-foreground">
              Percent of exposures that become scans. Enter a rate from your own past campaigns, not
              a guess from the internet.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Your assumed conversion rate: {conversionRate}%</Label>
            <Slider
              value={[conversionRate]}
              min={0}
              max={100}
              step={1}
              onValueChange={([v]) => setConversionRate(v)}
            />
            <p className="text-xs text-muted-foreground">
              Percent of scans that become the desired action (purchase, signup, booking).
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="as-value">Avg. order value ($)</Label>
              <Input
                id="as-value"
                type="number"
                min={0}
                step={0.01}
                value={orderValue}
                onChange={(e) => setOrderValue(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="as-unit">Cost per piece ($)</Label>
              <Input
                id="as-unit"
                type="number"
                min={0}
                step={0.01}
                value={unitCost}
                onChange={(e) => setUnitCost(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="as-fixed">Fixed costs ($)</Label>
              <Input
                id="as-fixed"
                type="number"
                min={0}
                step={1}
                value={fixedCost}
                onChange={(e) => setFixedCost(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Projected results (from your assumptions)
          </p>
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total exposures</span>
              <strong>{totalExposures.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projected scans</span>
              <strong>{Math.round(scans).toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projected conversions</span>
              <strong>{Math.round(conversions).toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projected revenue</span>
              <strong>${revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total cost</span>
              <strong>${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost per scan</span>
              <strong>${costPerScan.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost per conversion</span>
              <strong>${costPerConversion.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Return on spend</span>
              <strong>{roi.toFixed(1)}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Break-even scans</span>
              <strong>{Math.ceil(breakEven).toLocaleString()}</strong>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-xs space-y-1 font-mono">
            <p className="font-sans font-semibold">Every formula used</p>
            <p>exposures = prints x views per piece</p>
            <p>scans = exposures x scan rate</p>
            <p>conversions = scans x conversion rate</p>
            <p>revenue = conversions x avg. order value</p>
            <p>total cost = (prints x cost per piece) + fixed costs</p>
            <p>cost per scan = total cost / scans</p>
            <p>cost per conversion = total cost / conversions</p>
            <p>return = (revenue - total cost) / total cost</p>
            <p>break-even scans = total cost / (order value x conversion rate)</p>
          </div>
          <p className="text-xs text-muted-foreground">
            A projection is only as good as its assumptions. Run the numbers with a pessimistic, a
            realistic, and an optimistic scan rate before deciding anything.
          </p>
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-analytics-simulator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Forecast a QR Campaign Without Inventing Numbers
        </h2>
        <p className="text-base leading-relaxed">
          Forecasting a QR campaign is simple arithmetic wrapped around hard assumptions. The
          arithmetic is the easy part: exposures times scan rate gives scans, scans times conversion
          rate gives conversions, conversions times order value gives revenue. The hard part is the
          two rates, because they are the numbers that decide everything and the numbers nobody can
          know in advance. This simulator keeps those two things separate on purpose. It does the
          arithmetic for you, shows every formula, and refuses to supply the rates, because any rate
          it supplied would be invented. Your job is to bring rates from your own past campaigns, a
          pilot run, or an explicit scenario you are willing to defend.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-analytics-simulator-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The most honest way to get a scan rate is a small pilot. Print a few hundred pieces, place
          them exactly as the full run would place them, and count real scans for a week. That pilot
          rate, even from a small sample, beats any published benchmark, because it reflects your
          audience, your placement, and your offer rather than someone else&apos;s. If a pilot is
          impossible, run three scenarios instead of one: a pessimistic rate, a realistic rate, and
          an optimistic rate. If the campaign only works in the optimistic scenario, it does not
          work, and you have learned that before spending the print budget rather than after.
        </p>
        <p className="text-base leading-relaxed">
          Exposures per piece is the assumption people forget. A flyer handed to one person gets one
          exposure. A poster in a busy corridor gets many. A code on a receipt gets one exposure
          from the buyer and possibly none from anyone else. Estimating exposures honestly is what
          stops the forecast from drifting: if you assume a poster is seen fifty times a day for
          thirty days, write down why you believe that, and check it against foot traffic you can
          actually observe. An exposure is a person close enough to the code to read the call to
          action, not a person who walked past the building.
        </p>
        <p className="text-base leading-relaxed">
          Cost per conversion is the number that should drive the decision, not total scans. A
          campaign that produces many cheap scans and few conversions can be worse than a campaign
          with fewer scans that convert well, because every scan that does not convert still cost
          print, placement, and attention. Compare the cost per conversion against what you would
          pay for the same conversion through another channel you already use. If the QR route is
          more expensive per conversion, the QR route needs a better offer, a better placement, or a
          smaller print run, not a bigger one.
        </p>
        <p className="text-base leading-relaxed">
          Finally, treat the forecast as a plan for measurement, not a prediction. Decide before
          launch what scan rate would make the campaign a success, what rate would trigger a change
          of placement or offer, and what rate would end it. Write those thresholds down, measure
          the real numbers weekly, and adjust the campaign against them. A forecast that is never
          compared against reality is decoration. A forecast with decision thresholds becomes a
          management tool, and it is the difference between a campaign that drifts and a campaign
          that improves.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-analytics-simulator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-analytics-simulator-bottom" format="horizontal-banner" />
    </div>
  );
}
