'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Trash2 } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const PRINTERS: Record<string, { label: string; typicalWaste: number }> = {
  desktop: { label: 'Desktop inkjet', typicalWaste: 5 },
  laser: { label: 'Office laser', typicalWaste: 3 },
  thermal: { label: 'Thermal label printer', typicalWaste: 2 },
  commercial: { label: 'Commercial offset / digital press', typicalWaste: 4 },
  wide: { label: 'Wide-format', typicalWaste: 8 },
};

export default function QRPrintWasteEstimatorPage() {
  const [runSize, setRunSize] = useState(1000);
  const [printer, setPrinter] = useState('laser');
  const [wasteRate, setWasteRate] = useState(3);
  const [costPerUnit, setCostPerUnit] = useState(0.12);

  const result = useMemo(() => {
    const rate = Math.min(0.95, Math.max(0, wasteRate / 100));
    const totalPrints = runSize > 0 && rate < 1 ? Math.ceil(runSize / (1 - rate)) : 0;
    const waste = Math.max(0, totalPrints - runSize);
    const goodCost = runSize * costPerUnit;
    const totalCost = totalPrints * costPerUnit;
    return { totalPrints, waste, goodCost, totalCost, wasteCost: totalCost - goodCost };
  }, [runSize, wasteRate, costPerUnit]);

  const faqs = [
    {
      question: 'Why do I need to print more codes than I need?',
      answer:
        'Some prints always fail: misfeeds, smudges, misalignment, colour shifts, and codes that fail a test scan. If your misprint rate is 3%, printing exactly 1,000 codes yields about 970 good ones. This tool computes how many extra prints cover the waste.',
    },
    {
      question: 'What counts as waste here?',
      answer:
        'Any print you cannot ship: misprints, test proofs, setup sheets, and codes that fail a scan check. Reprints caused by a wrong payload count too, but they come from proofing failures, not the printer — fix those with a pre-press check, not a bigger waste allowance.',
    },
    {
      question: 'How do I pick a realistic misprint rate?',
      answer:
        'Use your last comparable run: spoiled sheets divided by total sheets printed. If you have no history, start with the typical rate shown for your printer type and adjust after your first measured run.',
    },
    {
      question: 'Does this include the cost of the good codes?',
      answer:
        'Yes. The result separates the cost of the good codes from the cost of the wasted prints, so you can see exactly what waste adds to the job instead of a single blended total.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Print Waste Estimator',
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
          { label: 'QR Print Waste Estimator', href: '/qr-print-waste-estimator' },
        ]}
      />

      <AdSlot id="qr-print-waste-estimator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Trash2 className="w-3.5 h-3.5" />
          <span>Print Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Print Waste Estimator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Estimate how many extra prints a run needs to cover misprints, how many prints will be
          wasted, and what the waste actually costs. Everything is computed from your run size,
          misprint rate, and cost per print.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Describe the print run</h2>
            <div className="space-y-2">
              <Label htmlFor="run">Good codes needed</Label>
              <Input
                id="run"
                type="number"
                min={1}
                value={runSize}
                onChange={(e) => setRunSize(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="printer">Printer type</Label>
              <select
                id="printer"
                value={printer}
                onChange={(e) => {
                  setPrinter(e.target.value);
                  setWasteRate(PRINTERS[e.target.value].typicalWaste);
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(PRINTERS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} — typical waste {v.typicalWaste}%
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Selecting a printer fills in a starting misprint rate. Change it to your own
                measured rate.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Misprint / waste rate: {wasteRate}%</Label>
              <Slider
                value={[wasteRate]}
                min={0}
                max={30}
                step={0.5}
                onValueChange={([v]) => setWasteRate(v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost per print (your currency)</Label>
              <Input
                id="cost"
                type="number"
                min={0}
                step={0.01}
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formula: total prints = good codes ÷ (1 − waste rate). Waste prints = total prints −
              good codes. Total cost = total prints × cost per print. Waste cost = waste prints ×
              cost per print.
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
                Print this many to get {runSize.toLocaleString()} good codes
              </div>
              <div className="text-4xl font-extrabold text-primary">
                {result.totalPrints.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Expected waste prints</span>
                <span className="font-semibold">{result.waste.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Cost of good codes</span>
                <span className="font-semibold">{result.goodCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Cost of waste</span>
                <span className="font-semibold">{result.wasteCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">True total cost</span>
                <span className="font-semibold">{result.totalCost.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Budget the true total, not the good-code cost — waste is a real line item, and quoting
              without it is how print jobs quietly lose money.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-print-waste-estimator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Price the Waste, Not Just the Good Codes
        </h2>
        <p className="text-base leading-relaxed">
          A quote based only on the codes you ship understates the job. Every run has setup sheets,
          misfeeds, smudges, and codes that fail a scan check. Those prints consume the same paper,
          ink, and machine time as the good ones. Working out the total prints first — good codes
          divided by one minus the waste rate — gives you an honest quantity to order and an honest
          cost to charge.
        </p>

        <AdSlot id="qr-print-waste-estimator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Cutting waste</h3>
        <p className="text-base leading-relaxed">
          The cheapest waste is the waste you prevent: proof the payload before the run, test-scan
          the first sheet off the press, and keep the printer calibrated. If your measured waste
          rate is much higher than the typical rate for your printer type, look at stock, humidity,
          and feed settings before ordering a bigger overrun.
        </p>
      </article>

      <AdSlot id="qr-print-waste-estimator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-print-waste-estimator-bottom" format="horizontal-banner" />

    </div>
  );
}
