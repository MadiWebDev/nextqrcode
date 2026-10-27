'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function Page() {
  const [staticCost, setStaticCost] = useState('120');
  const [dynamicCost, setDynamicCost] = useState('420');
  const [scans, setScans] = useState('5000');
  const [valuePerScan, setValuePerScan] = useState('0.40');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const sc = Number(staticCost);
    const dc = Number(dynamicCost);
    const n = Number(scans);
    const v = Number(valuePerScan);
    if (!Number.isFinite(sc) || sc < 0)
      return {
        error: 'Enter a static cost of 0 or more.',
        revenue: 0,
        roiStatic: 0,
        roiDynamic: 0,
        winner: '',
        extraCost: 0,
        breakEvenExtraScans: 0,
        sc: 0,
        dc: 0,
        n: 0,
        v: 0,
      };
    if (!Number.isFinite(dc) || dc < 0)
      return {
        error: 'Enter a dynamic cost of 0 or more.',
        revenue: 0,
        roiStatic: 0,
        roiDynamic: 0,
        winner: '',
        extraCost: 0,
        breakEvenExtraScans: 0,
        sc: 0,
        dc: 0,
        n: 0,
        v: 0,
      };
    if (!Number.isFinite(n) || n < 0)
      return {
        error: 'Enter expected scans of 0 or more.',
        revenue: 0,
        roiStatic: 0,
        roiDynamic: 0,
        winner: '',
        extraCost: 0,
        breakEvenExtraScans: 0,
        sc: 0,
        dc: 0,
        n: 0,
        v: 0,
      };
    if (!Number.isFinite(v) || v <= 0)
      return {
        error: 'Enter a value per scan greater than 0.',
        revenue: 0,
        roiStatic: 0,
        roiDynamic: 0,
        winner: '',
        extraCost: 0,
        breakEvenExtraScans: 0,
        sc: 0,
        dc: 0,
        n: 0,
        v: 0,
      };
    const revenue = n * v;
    const roi = (cost: number) =>
      cost > 0 ? ((revenue - cost) / cost) * 100 : revenue > 0 ? Infinity : 0;
    const roiStatic = roi(sc);
    const roiDynamic = roi(dc);
    const winner = roiDynamic > roiStatic ? 'Dynamic' : roiStatic > roiDynamic ? 'Static' : 'Tie';
    const extraCost = dc - sc;
    const breakEvenExtraScans = extraCost > 0 ? extraCost / v : 0;
    return {
      error: '',
      revenue,
      roiStatic,
      roiDynamic,
      winner,
      extraCost,
      breakEvenExtraScans,
      sc,
      dc,
      n,
      v,
    };
  }, [staticCost, dynamicCost, scans, valuePerScan]);

  const copyResult = async () => {
    if (result.error) return;
    await navigator.clipboard.writeText(
      `Revenue at ${result.n} scans x $${result.v}: $${result.revenue.toFixed(2)}. Static ROI: ${Number.isFinite(result.roiStatic) ? result.roiStatic.toFixed(1) + '%' : 'not defined (no cost)'}. Dynamic ROI: ${Number.isFinite(result.roiDynamic) ? result.roiDynamic.toFixed(1) + '%' : 'not defined (no cost)'}. Winner: ${result.winner}.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What is a dynamic QR code?',
      answer:
        'A dynamic QR code points at a redirect you control, so you can change the destination after printing and see scan analytics. A static code has the destination baked into the pattern itself, so it cannot be changed after printing.',
    },
    {
      question: 'Why can ROI be not defined?',
      answer:
        'ROI divides by cost. If you enter a cost of zero and the revenue is positive, there is no percentage that expresses the return \u2014 the tool says so instead of inventing one.',
    },
    {
      question: 'Should I use the same scan count for both options?',
      answer:
        'Start with the same scan count so the comparison is fair, then adjust if you have a reason to expect different scan counts \u2014 for example, if one option lets you fix a broken destination mid-campaign.',
    },
    {
      question: 'Does this include reprint savings?',
      answer:
        'Only if you include them in the costs you enter. Enter complete totals for each option over the same period, and do not count the same saving twice.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Dynamic vs Static ROI Calculator',
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
          {
            label: 'QR Dynamic vs Static ROI Calculator',
            href: '/qr-dynamic-vs-static-roi-calculator',
          },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Marketing QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Dynamic vs Static ROI Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Compare dynamic and static QR codes on equal footing: enter each option’s total cost, your
          expected scans, and the value of a scan, and get both ROI figures plus the winner.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter your numbers</h2>
            <div className="space-y-2">
              <Label htmlFor="staticCost">Static QR total cost ($)</Label>
              <Input
                id="staticCost"
                type="number"
                value={staticCost}
                onChange={(e) => setStaticCost(e.target.value)}
                placeholder="120"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dynamicCost">Dynamic QR total cost ($)</Label>
              <Input
                id="dynamicCost"
                type="number"
                value={dynamicCost}
                onChange={(e) => setDynamicCost(e.target.value)}
                placeholder="420"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scans">Expected scans</Label>
              <Input
                id="scans"
                type="number"
                value={scans}
                onChange={(e) => setScans(e.target.value)}
                placeholder="5000"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value per scan ($)</Label>
              <Input
                id="value"
                type="number"
                value={valuePerScan}
                onChange={(e) => setValuePerScan(e.target.value)}
                placeholder="0.40"
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue = expected scans × value per scan. ROI = (revenue − cost) / cost × 100.
              Break-even extra scans for the pricier option = cost difference / value per scan.
              Costs are the totals you enter for each option, including any subscription for the
              dynamic option.
            </p>
            {result.error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {result.error}
              </p>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Result</h2>
            {!result.error && (
              <>
                <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <div className="text-xs text-muted-foreground">Winner on ROI</div>
                  <div className="text-4xl font-extrabold text-primary">{result.winner}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Revenue at {result.n} scans: ${result.revenue.toFixed(2)}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">
                      Static ROI (cost ${result.sc.toFixed(2)})
                    </span>
                    <span className="font-semibold">
                      {Number.isFinite(result.roiStatic)
                        ? result.roiStatic.toFixed(1) + '%'
                        : 'Not defined (no cost)'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">
                      Dynamic ROI (cost ${result.dc.toFixed(2)})
                    </span>
                    <span className="font-semibold">
                      {Number.isFinite(result.roiDynamic)
                        ? result.roiDynamic.toFixed(1) + '%'
                        : 'Not defined (no cost)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">
                      Extra scans for dynamic to cover its extra cost
                    </span>
                    <span className="font-semibold">
                      {result.extraCost > 0
                        ? Math.ceil(result.breakEvenExtraScans).toLocaleString()
                        : 'None — dynamic costs no more'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ROI here is only as good as your value-per-scan estimate. If that number is a
                  guess, run the calculation with a low and a high value and see whether the winner
                  changes.
                </p>
              </>
            )}
            <Button variant="outline" size="sm" onClick={copyResult} disabled={!!result.error}>
              {copied ? 'Copied!' : 'Copy result'}
            </Button>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-dynamic-vs-static-roi-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the QR Dynamic vs Static ROI Calculator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this calculator works</h3>
        <p className="text-base leading-relaxed">
          Both options are judged on the same revenue: expected scans times the value you assign to
          a scan. ROI is revenue minus cost, divided by cost. The winner is the higher ROI, and the
          break-even line tells you how many extra scans the pricier option needs to justify its
          extra cost. The comparison is only fair if both costs are complete totals for the same
          campaign period.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-dynamic-vs-static-roi-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">What to include in each cost</h3>
        <p className="text-base leading-relaxed">
          For the static option, include design, printing, and placement. For the dynamic option,
          include the same plus the platform subscription for the period, and any reprint savings
          you genuinely expect. Do not count benefits twice: if you claim reprint savings in the
          dynamic cost, do not also add them to the scan value.
        </p>
        <h3 className="text-xl font-semibold text-foreground">When the numbers are uncertain</h3>
        <p className="text-base leading-relaxed">
          Expected scans and value per scan are estimates, so treat the winner as a guide, not a
          verdict. Run the calculation three times — low, middle, and high values — and see whether
          the winner survives. If it flips, the choice is genuinely close, and factors like
          editability and scan analytics deserve more weight than the ROI gap.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="qr-dynamic-vs-static-roi-calculator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-dynamic-vs-static-roi-calculator-bottom" format="horizontal-banner" />
    </div>
  );
}
