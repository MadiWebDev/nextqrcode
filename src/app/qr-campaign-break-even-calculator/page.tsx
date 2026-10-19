'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRCampaignBreakEvenCalculatorPage() {
  const [fixedCost, setFixedCost] = useState(500);
  const [costPerScan, setCostPerScan] = useState(0);
  const [valuePerScan, setValuePerScan] = useState(2.5);
  const [expectedScans, setExpectedScans] = useState(1000);

  const result = useMemo(() => {
    const margin = valuePerScan - costPerScan;
    const breakEven = margin > 0 ? Math.ceil(fixedCost / margin) : null;
    const revenue = expectedScans * valuePerScan;
    const totalCost = fixedCost + expectedScans * costPerScan;
    const profit = revenue - totalCost;
    return { margin, breakEven, revenue, totalCost, profit };
  }, [fixedCost, costPerScan, valuePerScan, expectedScans]);

  const faqs = [
    {
      question: 'What counts as campaign cost here?',
      answer:
        'Enter all fixed costs — design, printing, placement fees, and tooling — in the fixed-cost field, and any per-scan cost (for example a per-redirect or per-landing fee) in the variable field. Leaving a real cost out makes the break-even point look easier than it is.',
    },
    {
      question: 'What is "value per scan"?',
      answer:
        'The average gross value one scan produces for you: conversion rate × average order or lead value. If 5% of scanners buy and the average order is $50, value per scan is $2.50. Use your own measured numbers, not a guess, when the decision matters.',
    },
    {
      question: 'What if value per scan is lower than cost per scan?',
      answer:
        'Then the campaign can never break even: every scan loses money. No volume fixes that. You must raise value per scan (better landing page, better offer) or cut the per-scan cost before scaling.',
    },
    {
      question: 'Does this include the value of brand exposure?',
      answer:
        'No. This calculator covers direct measurable value per scan only. If exposure has value to you, estimate it separately and add it to value per scan explicitly so the assumption stays visible.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Campaign Break-Even Calculator',
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
            label: 'QR Campaign Break-Even Calculator',
            href: '/qr-campaign-break-even-calculator',
          },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Campaign Calculator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Campaign Break-Even Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out how many scans a QR campaign needs before it pays for itself, and what profit or
          loss an expected scan volume produces. All figures are computed from the costs and
          per-scan value you enter.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter campaign economics</h2>
            <div className="space-y-2">
              <Label htmlFor="fixed">Fixed campaign cost (design, print, placement)</Label>
              <Input
                id="fixed"
                type="number"
                min={0}
                step={0.01}
                value={fixedCost}
                onChange={(e) => setFixedCost(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vps">Variable cost per scan (optional, 0 if none)</Label>
              <Input
                id="vps"
                type="number"
                min={0}
                step={0.01}
                value={costPerScan}
                onChange={(e) => setCostPerScan(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Average value per scan</Label>
              <Input
                id="value"
                type="number"
                min={0}
                step={0.01}
                value={valuePerScan}
                onChange={(e) => setValuePerScan(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected">Expected scans (for the profit projection)</Label>
              <Input
                id="expected"
                type="number"
                min={0}
                value={expectedScans}
                onChange={(e) => setExpectedScans(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formulas: margin per scan = value per scan − variable cost per scan. Break-even scans
              = fixed cost ÷ margin per scan, rounded up. Profit at expected scans = (expected scans
              × value per scan) − (fixed cost + expected scans × variable cost per scan).
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Break-even scans</div>
              <div className="text-4xl font-extrabold text-primary">
                {result.breakEven === null ? 'Never' : result.breakEven.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                margin per scan: {result.margin.toFixed(2)}
              </div>
            </div>
            {result.breakEven === null && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                Value per scan does not cover the variable cost per scan, so the campaign cannot
                break even at any volume.
              </p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">
                  Revenue at {expectedScans.toLocaleString()} scans
                </span>
                <span className="font-semibold">{result.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">
                  Total cost at {expectedScans.toLocaleString()} scans
                </span>
                <span className="font-semibold">{result.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Projected profit / (loss)</span>
                <span
                  className={`font-semibold ${result.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {result.profit.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-campaign-break-even-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Know the Number Before You Print</h2>
        <p className="text-base leading-relaxed">
          A campaign feels successful when scans climb, but scans alone do not pay for printing,
          design, and placement. The break-even point turns a vague goal into one number: this many
          scans and the campaign has paid for itself. Everything past that point is profit; anything
          short of it is a loss. Deciding whether that number is realistic — given footfall,
          placement, and past campaigns — is the real go / no-go decision.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-campaign-break-even-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">If the number looks unreachable</h3>
        <p className="text-base leading-relaxed">
          You have three honest levers: cut fixed costs (cheaper placement, smaller run), raise
          value per scan (a stronger offer or a better landing page), or pick a placement with more
          qualified traffic. Spending more to buy scans at a loss only makes the loss bigger.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-campaign-break-even-calculator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-campaign-break-even-calculator-bottom" format="horizontal-banner" />
    </div>
  );
}
