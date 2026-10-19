'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlaskConical } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function Page() {
  const [sampleSize, setSampleSize] = useState('100');
  const [failures, setFailures] = useState('5');
  const [batchSize, setBatchSize] = useState('1000');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = Number(sampleSize);
    const k = Number(failures);
    const batch = Number(batchSize);
    if (!Number.isFinite(n) || n < 1)
      return {
        error: 'Enter a sample size of 1 or more.',
        p: 0,
        lo: 0,
        hi: 0,
        expected: 0,
        expLo: 0,
        expHi: 0,
        batch: 0,
      };
    if (!Number.isFinite(k) || k < 0)
      return {
        error: 'Enter failures of 0 or more.',
        p: 0,
        lo: 0,
        hi: 0,
        expected: 0,
        expLo: 0,
        expHi: 0,
        batch: 0,
      };
    if (k > n)
      return {
        error: 'Failures cannot exceed the sample size.',
        p: 0,
        lo: 0,
        hi: 0,
        expected: 0,
        expLo: 0,
        expHi: 0,
        batch: 0,
      };
    if (!Number.isFinite(batch) || batch < 1)
      return {
        error: 'Enter a batch size of 1 or more.',
        p: 0,
        lo: 0,
        hi: 0,
        expected: 0,
        expLo: 0,
        expHi: 0,
        batch: 0,
      };
    const z = 1.96;
    const p = k / n;
    const den = 1 + (z * z) / n;
    const centre = (p + (z * z) / (2 * n)) / den;
    const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
    const lo = Math.max(0, centre - half);
    const hi = Math.min(1, centre + half);
    return {
      error: '',
      p,
      lo,
      hi,
      expected: p * batch,
      expLo: lo * batch,
      expHi: hi * batch,
      batch,
    };
  }, [sampleSize, failures, batchSize]);

  const copyResult = async () => {
    if (result.error) return;
    await navigator.clipboard.writeText(
      `Estimated failure rate: ${(result.p * 100).toFixed(2)}% (95% CI ${(result.lo * 100).toFixed(2)}% to ${(result.hi * 100).toFixed(2)}%). Expected failures in a batch of ${result.batch}: ${Math.round(result.expected)} (range ${Math.round(result.expLo)} to ${Math.round(result.expHi)}).`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What does the confidence interval mean?',
      answer:
        'Roughly this: if you repeated the same sampling many times, about 95% of the intervals computed this way would contain the true batch failure rate. It is a statement about the procedure and your sample size, not a promise that the true rate sits inside this particular interval.',
    },
    {
      question: 'How many codes should I sample?',
      answer:
        'More is better, and the interval shows you the payoff: doubling the sample narrows it noticeably. As a working rule, sample across the whole run \u2014 early, middle, and late \u2014 rather than taking one handful from the top of the pile.',
    },
    {
      question: 'Why use the Wilson interval instead of the simple percentage?',
      answer:
        'The simple percentage pretends the sample is the whole batch. The Wilson interval accounts for the fact that a sample can mislead, especially a small one, and it behaves sensibly at the extremes \u2014 for example, zero failures in a small sample does not mean a zero failure rate.',
    },
    {
      question: 'Does this validate the QR payloads?',
      answer:
        'No. This estimates scan failures from your sample outcomes. Checking that payloads are correctly formatted is a different job \u2014 validate the payloads separately before printing.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Batch Failure Estimator',
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
          { label: 'QR Batch Failure Estimator', href: '/qr-batch-failure-estimator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Print QA Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Batch Failure Estimator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Estimate a print batch’s failure rate from your own sample scan results: enter how many
          codes you tested and how many failed, and get the estimated failure rate with a 95%
          confidence interval.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter your numbers</h2>
            <div className="space-y-2">
              <Label htmlFor="sample">Codes tested (sample size)</Label>
              <Input
                id="sample"
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="failures">Codes that failed to scan</Label>
              <Input
                id="failures"
                type="number"
                value={failures}
                onChange={(e) => setFailures(e.target.value)}
                placeholder="5"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Full batch size</Label>
              <Input
                id="batch"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                placeholder="1000"
                min="1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Wilson 95% confidence interval (z = 1.96): centre = (p + z² / 2n) / (1 + z² / n),
              half-width = z · √(p(1 − p) / n + z² / 4n²) / (1 + z² / n), where p is failures /
              sample size. The interval reflects sampling uncertainty in your own test — it is not a
              measured property of the batch.
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
                  <div className="text-xs text-muted-foreground">Estimated failure rate</div>
                  <div className="text-4xl font-extrabold text-primary">
                    {(result.p * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    95% confidence interval: {(result.lo * 100).toFixed(2)}% to{' '}
                    {(result.hi * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">
                      Expected failures in batch of {result.batch}
                    </span>
                    <span className="font-semibold">{Math.round(result.expected)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Plausible range in batch</span>
                    <span className="font-semibold">
                      {Math.round(result.expLo)} to {Math.round(result.expHi)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Sample tested</span>
                    <span className="font-semibold">
                      {sampleSize} codes, {failures} failed
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Plan reprints against the top of the interval, not the point estimate: with a
                  small sample, the true failure rate could plausibly be that high.
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
      <AdSlot id="qr-batch-failure-estimator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the QR Batch Failure Estimator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this estimator works</h3>
        <p className="text-base leading-relaxed">
          You test a sample of codes from the batch and count how many fail to scan. The failure
          rate in your sample is the point estimate for the whole batch, and the Wilson interval
          shows how far the true batch rate could plausibly be from that estimate given the sample
          size. A small sample gives a wide interval; a large sample narrows it. The interval is
          about sampling uncertainty in your test, not a guarantee about any particular code.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-batch-failure-estimator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Taking a sample you can trust</h3>
        <p className="text-base leading-relaxed">
          Test codes pulled from across the run, not just the top of the pile: early, middle, and
          late sheets, and from each printer or plate if several are involved. Scan each sampled
          code the way the audience will — at the real distance, in the real light, with an ordinary
          phone — and count a code as failed if it does not scan on the first reasonable attempt. A
          tidy sample tested under ideal conditions tells you less than a messy sample tested
          honestly.
        </p>
        <h3 className="text-xl font-semibold text-foreground">What to do with the result</h3>
        <p className="text-base leading-relaxed">
          If the top of the interval is above the failure level your job can absorb, reprint or
          re-test before shipping. If the interval is too wide to decide, test more codes rather
          than guessing — doubling the sample narrows the interval noticeably. Keep the failed
          codes: checking what they have in common, such as one corner of the sheet or one ink,
          often finds the cause faster than statistics alone.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="qr-batch-failure-estimator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-batch-failure-estimator-bottom" format="horizontal-banner" />
    </div>
  );
}
