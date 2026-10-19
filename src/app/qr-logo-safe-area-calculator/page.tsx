'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Image } from 'lucide-react';

export default function QRLogoSafeAreaCalculatorPage() {
  const [codeSize, setCodeSize] = useState(50);
  const [ec, setEc] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const frac: Record<string, number> = { L: 0.1, M: 0.15, Q: 0.2, H: 0.3 };
  const recovery: Record<string, string> = { L: '≈7%', M: '≈15%', Q: '≈25%', H: '≈30%' };
  const logoMm = codeSize * frac[ec];
  const logoPx300 = Math.round((logoMm / 25.4) * 300);
  const areaPct = Math.round(frac[ec] * frac[ec] * 100);

  const faqs = [
    {
      question: 'How large can a logo on a QR code be?',
      answer:
        'As a conservative rule: up to 10% of the code width at level L, 15% at M, 20% at Q, and 30% at H. Treat these as ceilings, not targets, and always test-scan printed proofs.',
    },
    {
      question: 'Which error-correction level should logo codes use?',
      answer:
        'Level H, which tolerates about 30% damage. Lower levels leave too little budget once the logo hides modules, and the code becomes fragile in poor light or on older phones.',
    },
    {
      question: 'Can the logo cover a corner of the QR code?',
      answer:
        'No. The three corner finder patterns are how the scanner locates and orients the code. Keep the logo centred and well clear of all three corners.',
    },
    {
      question: 'Does a white border around the logo help?',
      answer:
        'Yes. A small solid white halo separates the logo from surrounding dark modules so the scanner can still read the boundary cleanly. It is especially valuable for dark or detailed logos.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Logo Safe Area Calculator',
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
          { label: 'Logo Safe Area Calculator', href: '/qr-logo-safe-area-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Image className="w-3.5 h-3.5" />
          <span>Branding Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Logo Safe Area Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out the largest logo you can safely place over a QR code at your chosen
          error-correction level, and see the conservative coverage rule behind the number.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Your code</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="csize">Printed code width (mm)</Label>
                <Input
                  id="csize"
                  type="number"
                  min="10"
                  max="2000"
                  step="1"
                  value={codeSize}
                  onChange={(e) => setCodeSize(Math.max(10, parseFloat(e.target.value) || 10))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[codeSize]}
                min={15}
                max={300}
                step={1}
                onValueChange={([v]) => setCodeSize(v)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Error-correction level
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setEc(l)}
                    className={`p-3 text-center rounded-xl border text-xs ${ec === l ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    Level {l}
                    <span className="block text-[10px] text-muted-foreground">
                      {recovery[l]} recovery
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Rule of thumb</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Maximum logo side = code width × a conservative width fraction: 10% at L, 15% at M,
              20% at Q, 30% at H. These fractions are deliberately conservative planning rules, not
              guarantees — a logo also hides the modules behind it, and real scanners vary. Centre
              the logo, keep it away from the three corner finder patterns, and always test-scan
              printed proofs on several phones.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-3">Visual guide</h2>
            <div className="flex items-center justify-center">
              <div
                className="relative border-2 border-foreground/70 bg-white"
                style={{ width: 240, height: 240 }}
              >
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-black" />
                <div className="absolute top-2 right-2 w-12 h-12 border-4 border-black" />
                <div className="absolute bottom-2 left-2 w-12 h-12 border-4 border-black" />
                <div
                  className="absolute bg-primary/80 text-white text-[10px] font-bold flex items-center justify-center"
                  style={{
                    width: 240 * frac[ec],
                    height: 240 * frac[ec],
                    left: 120 - (240 * frac[ec]) / 2,
                    top: 120 - (240 * frac[ec]) / 2,
                  }}
                >
                  LOGO
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Diagram only, not a scannable code. The shaded square shows the maximum logo width at
              level {ec}.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Maximum safe logo side</div>
              <div className="text-4xl font-extrabold text-primary">{logoMm.toFixed(1)} mm</div>
              <div className="text-xs text-muted-foreground mt-1">
                ≈ {logoPx300} px at 300 DPI · {areaPct}% of code area
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Code width</span>
                <span className="font-semibold">{codeSize} mm</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Error-correction level</span>
                <span className="font-semibold">
                  {ec} ({recovery[ec]} recovery)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Width fraction</span>
                <span className="font-semibold">{Math.round(frac[ec] * 100)}% of code width</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Use level H for logo codes. If the code also faces outdoor light, scuffing, or a
              textured surface, go smaller than this maximum.
            </p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Logos on QR Codes: How Big Is Too Big?
        </h2>
        <p className="text-base leading-relaxed">
          A logo in the middle of a QR code is the most requested branding treatment and the most
          common way to break an otherwise perfect code. The logo works by hiding modules, and the
          code survives only because error correction reconstructs the missing pieces. Every logo is
          therefore a bet against the error-correction budget: the bigger the logo, the less damage
          the code can absorb from anything else, such as glare, scuffing, or a slightly blurry
          print. The calculator gives a conservative maximum based on the error-correction level,
          and the word conservative is doing real work — it leaves headroom for the rest of the
          world to be imperfect.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Why level H is the only sensible choice for logo codes
        </h3>
        <p className="text-base leading-relaxed">
          At level H, roughly 30% of the code can be damaged and still decode, which is what makes a
          central logo feasible at all. At level L, only about 7% can be lost, so even a modest logo
          can push the code over the edge. Many design tools default to level M, which is how logo
          codes end up silently fragile: they scan on the designer&apos;s phone in good light and
          fail on a customer&apos;s older phone in a dim restaurant. If a logo is going on the code,
          set level H first, then size the logo inside the budget the calculator shows, and treat
          that number as a ceiling, not a target.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Placement rules that matter as much as size
        </h3>
        <p className="text-base leading-relaxed">
          The logo must sit in the centre, clear of the three corner finder patterns, because those
          patterns are how the scanner locates and orients the code. Covering or clipping one of
          them is fatal even if the logo is small. Give the logo a small white halo or backing so
          its edges do not merge with dark modules around it, and avoid logos with fine detail or
          thin lines that will vanish at print size. A flat, bold mark reads better than a detailed
          one, and a square or circular mark is easier to judge against the budget than an irregular
          shape.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Before you commit</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Generate the code at level H with the logo applied, then print it at final size on the
            real substrate.
          </li>
          <li>
            Scan it on at least three different phones, including an older one, in bright light,
            shade, and indoors.
          </li>
          <li>Tilt the print and scan from a slight angle, as customers actually do.</li>
          <li>
            If any test fails, shrink the logo or drop it — a code that scans beats a code that
            looks branded.
          </li>
          <li>
            For critical uses such as packaging or tickets, keep a plain backup code in the artwork
            file.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          A logo should be a confident accent, not a gamble. Size it inside the budget, test it like
          a sceptic, and it will earn its place.
        </p>
      </article>
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
    </div>
  );
}
