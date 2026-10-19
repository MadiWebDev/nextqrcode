'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Printer } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRDotGainToleranceCheckerPage() {
  const [moduleSize, setModuleSize] = useState(0.5);
  const [dotGain, setDotGain] = useState(0.08);
  const [misregistration, setMisregistration] = useState(0.03);

  const result = useMemo(() => {
    const totalSpread = dotGain + misregistration;
    const ratio = moduleSize > 0 ? totalSpread / moduleSize : Infinity;
    const pass = ratio <= 0.25;
    const minSafe = totalSpread / 0.25;
    const effectiveDark = moduleSize + 2 * dotGain;
    const effectiveLight = Math.max(0, moduleSize - 2 * dotGain);
    return { totalSpread, ratio, pass, minSafe, effectiveDark, effectiveLight };
  }, [moduleSize, dotGain, misregistration]);

  const faqs = [
    {
      question: 'What is dot gain?',
      answer:
        'Dot gain is the spread of ink beyond its intended area as it soaks into stock or squashes under press pressure. Dark modules grow and light modules shrink, so a code printed with heavy dot gain can lose its light gaps even though the artwork was correct.',
    },
    {
      question: 'Why is the limit 25% of the module size?',
      answer:
        'This tool uses a conservative production rule: total spread (dot gain plus misregistration) should stay at or below one quarter of a module. Beyond that, light modules narrow enough that scanners start misreading them, especially on small codes.',
    },
    {
      question: 'How do I measure dot gain for my printer?',
      answer:
        'Print a test patch with known module sizes, measure the printed modules with a loupe or scanner, and subtract the intended size. Your printer or press vendor can also supply a dot-gain figure for a given stock and ink.',
    },
    {
      question: 'What if my code fails this check?',
      answer:
        'Increase the module size (print the code larger), switch to a smoother stock with less ink spread, reduce ink density, or use a printer with tighter registration. Do not just hope the scanner compensates — it may on one phone and not on another.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Dot Gain Tolerance Checker',
    applicationCategory: 'DesignApplication',
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
          { label: 'QR Dot Gain Tolerance Checker', href: '/qr-dot-gain-tolerance-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Printer className="w-3.5 h-3.5" />
          <span>Print Production Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Dot Gain Tolerance Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Check whether a module size survives your printer&apos;s dot gain and misregistration, and
          find the minimum safe module size if it does not. All values are computed from the numbers
          you enter.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter print measurements (mm)</h2>
            <div className="space-y-2">
              <Label>Module size: {moduleSize.toFixed(2)} mm</Label>
              <Slider
                value={[moduleSize]}
                min={0.1}
                max={2}
                step={0.01}
                onValueChange={([v]) => setModuleSize(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Dot gain (ink spread per edge): {dotGain.toFixed(2)} mm</Label>
              <Slider
                value={[dotGain]}
                min={0}
                max={0.5}
                step={0.01}
                onValueChange={([v]) => setDotGain(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Misregistration: {misregistration.toFixed(2)} mm</Label>
              <Slider
                value={[misregistration]}
                min={0}
                max={0.5}
                step={0.01}
                onValueChange={([v]) => setMisregistration(v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moduleInput">Or type the module size (mm)</Label>
              <Input
                id="moduleInput"
                type="number"
                min={0.01}
                step={0.01}
                value={moduleSize}
                onChange={(e) => setModuleSize(Math.max(0.01, Number(e.target.value) || 0.01))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Rule used: total spread = dot gain + misregistration. Pass when total spread ≤ 25% of
              the module size. Minimum safe module = total spread ÷ 0.25. Effective dark module =
              module + 2 × dot gain; effective light module = module − 2 × dot gain.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div
              className={`text-center rounded-xl border p-4 ${result.pass ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}
            >
              <div className="text-xs text-muted-foreground">Verdict</div>
              <div
                className={`text-3xl font-extrabold ${result.pass ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {result.pass ? 'PASS' : 'FAIL'}
              </div>
              <div className="text-sm text-muted-foreground">
                total spread {result.totalSpread.toFixed(2)} mm = {(result.ratio * 100).toFixed(1)}%
                of module
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Minimum safe module</span>
                <span className="font-semibold">{result.minSafe.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Effective dark module</span>
                <span className="font-semibold">{result.effectiveDark.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Effective light module</span>
                <span className="font-semibold">{result.effectiveLight.toFixed(2)} mm</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.pass
                ? 'This module size has enough headroom for the entered dot gain and misregistration.'
                : 'Print larger, reduce ink spread, or tighten registration — at this size the light modules will narrow enough to risk misreads.'}
            </p>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-dot-gain-tolerance-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Small Codes Are Where Dot Gain Bites</h2>
        <p className="text-base leading-relaxed">
          A large poster code can absorb a tenth of a millimetre of ink spread without anyone
          noticing. A tiny code on a label cannot: the same spread is a large fraction of each
          module, the light gaps close up, and the scanner sees a dark blur. That is why dot gain is
          a print-production check, not a design preference — it depends on the actual printer,
          stock, and ink, and it must be checked at the actual printed size.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-dot-gain-tolerance-checker-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">If the check fails</h3>
        <p className="text-base leading-relaxed">
          The most reliable fix is a larger code. If the layout cannot grow, reduce ink density,
          choose a smoother, less absorbent stock, or move the job to a printer with tighter
          registration. Always confirm with a printed proof scanned on two different phones.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-dot-gain-tolerance-checker-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-dot-gain-tolerance-checker-bottom" format="horizontal-banner" />
    </div>
  );
}
