'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function Page() {
  const [spend, setSpend] = useState('500');
  const [scans, setScans] = useState('2500');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = Number(spend);
    const n = Number(scans);
    if (!Number.isFinite(s) || s < 0)
      return {
        error: 'Enter a total spend of 0 or more.',
        perScan: 0,
        perThousand: 0,
        scansPer100: 0,
        s: 0,
        n: 0,
      };
    if (!Number.isFinite(n) || n < 1)
      return {
        error: 'Enter total scans of 1 or more.',
        perScan: 0,
        perThousand: 0,
        scansPer100: 0,
        s: 0,
        n: 0,
      };
    const perScan = s / n;
    return {
      error: '',
      perScan,
      perThousand: perScan * 1000,
      scansPer100: s > 0 ? (n / s) * 100 : 0,
      s,
      n,
    };
  }, [spend, scans]);

  const copyResult = async () => {
    if (result.error) return;
    await navigator.clipboard.writeText(
      `Cost per scan: $${result.perScan.toFixed(4)}. Cost per 1,000 scans: $${result.perThousand.toFixed(2)}. Scans per $100 spent: ${result.scansPer100.toFixed(1)}.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What is a good cost per scan?',
      answer:
        'There is no universal good figure \u2014 it depends on what a scan is worth to you. A scan that leads to a high-value booking can justify far more than a scan that leads to a brochure view. Compare your own campaigns against each other, and against what you would pay for an equivalent click elsewhere.',
    },
    {
      question: 'Should I include design and placement costs?',
      answer:
        'Yes. Include every cost the campaign incurred: design, printing, placement, and platform fees. The result only means something if the spend is complete.',
    },
    {
      question: 'Does a low cost per scan mean the campaign worked?',
      answer:
        'Not by itself. Cost per scan measures efficiency, not outcomes. Pair it with what happened after the scan \u2014 sign-ups, purchases, or bookings \u2014 before judging the campaign.',
    },
    {
      question: 'Why show cost per 1,000 scans too?',
      answer:
        'Cost per scan can be a tiny decimal that is hard to compare at a glance. Cost per 1,000 scans is the same figure scaled up, which makes small differences easier to see and discuss.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Cost Per Scan Calculator',
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
          { label: 'QR Cost Per Scan Calculator', href: '/qr-cost-per-scan-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Coins className="w-3.5 h-3.5" />
          <span>Marketing QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Cost Per Scan Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out what each QR scan really cost: enter your total campaign spend and total scans,
          and get cost per scan, cost per 1,000 scans, and scans per $100.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter your numbers</h2>
            <div className="space-y-2">
              <Label htmlFor="spend">Total campaign spend ($)</Label>
              <Input
                id="spend"
                type="number"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                placeholder="500"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scans">Total scans</Label>
              <Input
                id="scans"
                type="number"
                value={scans}
                onChange={(e) => setScans(e.target.value)}
                placeholder="2500"
                min="1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Cost per scan = total spend / total scans. Cost per 1,000 scans = cost per scan ×
              1,000. Scans per $100 = scans / spend × 100. Enter the spend and scans you actually
              measured for the campaign.
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
                  <div className="text-xs text-muted-foreground">Cost per scan</div>
                  <div className="text-4xl font-extrabold text-primary">
                    ${result.perScan.toFixed(4)}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Cost per 1,000 scans</span>
                    <span className="font-semibold">${result.perThousand.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Scans per $100 spent</span>
                    <span className="font-semibold">{result.scansPer100.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Inputs</span>
                    <span className="font-semibold">
                      ${result.s.toFixed(2)} / {result.n} scans
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compare campaigns on cost per scan, not on raw scan counts: a campaign with twice
                  the scans at three times the spend is the worse deal.
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
      <AdSlot id="qr-cost-per-scan-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the QR Cost Per Scan Calculator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this calculator works</h3>
        <p className="text-base leading-relaxed">
          Cost per scan is total spend divided by total scans. It turns two numbers that are hard to
          compare across campaigns — money out, scans in — into one number you can compare directly.
          Cost per 1,000 scans is the same figure scaled up for readability, and scans per $100 is
          the same relationship read the other way round.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-cost-per-scan-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">What counts as spend</h3>
        <p className="text-base leading-relaxed">
          Include everything the campaign cost: design, printing, placement, and any platform fees,
          not just the print bill. Leaving costs out flatters the result and makes campaigns look
          cheaper than they were. If a placement carries several campaigns, split its cost across
          them on a stated basis rather than assigning the whole bill to one.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Using the result</h3>
        <p className="text-base leading-relaxed">
          Use cost per scan to compare like with like: the same placement across months, or two
          placements in the same campaign. A scan is not a sale, so pair this figure with what
          happened after the scan — sign-ups, purchases, or bookings — before calling a campaign a
          success.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="qr-cost-per-scan-calculator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-cost-per-scan-calculator-bottom" format="horizontal-banner" />
    </div>
  );
}
