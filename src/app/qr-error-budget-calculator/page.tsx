'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ShieldCheck } from 'lucide-react';

export default function QRErrorBudgetCalculatorPage() {
  const [version, setVersion] = useState(5);
  const [payloadLen, setPayloadLen] = useState(40);
  const modules = 21 + 4 * (version - 1);
  const totalModules = modules * modules;
  const levels = [
    { level: 'L', pct: 7 },
    { level: 'M', pct: 15 },
    { level: 'Q', pct: 25 },
    { level: 'H', pct: 30 },
  ];
  const [selected, setSelected] = useState('H');
  const sel = levels.find((l) => l.level === selected)!;
  const recoverable = Math.floor(totalModules * (sel.pct / 100));
  const logoBudget = Math.floor(recoverable * 0.5);
  const logoSidePct = Math.sqrt(logoBudget / totalModules) * 100;

  const faqs = [
    {
      question: 'What do the error-correction levels mean in practice?',
      answer:
        'They set roughly how much of the code can be damaged and still decode: L about 7%, M about 15%, Q about 25%, H about 30%. The percentages apply to codewords in the specification; this page converts them to an approximate module budget for planning.',
    },
    {
      question: 'Can I spend the whole error budget on a logo?',
      answer:
        'No. The logo shares the budget with real-world damage such as scuffs, glare, and fading. This calculator reserves half the budget for that damage and lets a logo use at most the other half — a conservative rule that keeps codes robust.',
    },
    {
      question: 'Does damage location matter?',
      answer:
        "Yes. Damage over the corner finder patterns or timing patterns hurts far more than the same area in the middle of the data region, because those patterns carry the code's geometry. A central logo is the least harmful place to spend budget.",
    },
    {
      question: 'Does raising the error level shrink capacity?',
      answer:
        'Yes. Higher levels reserve more of the code for redundancy, leaving less room for payload. A version-1 code holds 17 byte-mode characters at L but only 7 at H, so a payload that just fits at H may need a higher version.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Error Budget Calculator',
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
          { label: 'QR Error Budget Calculator', href: '/qr-error-budget-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Damage Tolerance Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Error Budget Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          See how much damage each error-correction level tolerates for your code&apos;s version and
          payload, and how much of that budget a logo or overlay may safely use.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Your code</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="ever">QR version (1–40)</Label>
                <Input
                  id="ever"
                  type="number"
                  min="1"
                  max="40"
                  step="1"
                  value={version}
                  onChange={(e) =>
                    setVersion(Math.min(40, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[version]}
                min={1}
                max={40}
                step={1}
                onValueChange={([v]) => setVersion(v)}
              />
              <p className="text-[11px] text-muted-foreground">
                Version {version} = {modules} × {modules} = {totalModules.toLocaleString()} modules.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="plen">Payload length (characters)</Label>
                <Input
                  id="plen"
                  type="number"
                  min="1"
                  max="3000"
                  step="1"
                  value={payloadLen}
                  onChange={(e) => setPayloadLen(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[payloadLen]}
                min={1}
                max={500}
                step={1}
                onValueChange={([v]) => setPayloadLen(v)}
              />
              <p className="text-[11px] text-muted-foreground">
                Payload length is shown for context — the tolerance percentages apply to the code as
                a whole. Longer payloads raise the version and shrink every module.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Error-correction level
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {levels.map((l) => (
                  <button
                    key={l.level}
                    type="button"
                    onClick={() => setSelected(l.level)}
                    className={`p-3 text-center rounded-xl border text-xs ${selected === l.level ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    Level {l.level}
                    <span className="block text-[10px] text-muted-foreground">
                      ≈{l.pct}% recovery
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-3">Tolerance at every level</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-2">Level</th>
                    <th className="text-right py-2 px-2">Recovery</th>
                    <th className="text-right py-2 px-2">Approx. recoverable modules</th>
                    <th className="text-right py-2 pl-2">Conservative logo budget</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((l) => (
                    <tr key={l.level} className="border-b border-border/50">
                      <td className="py-1.5 pr-2 font-semibold">{l.level}</td>
                      <td className="text-right py-1.5 px-2">≈{l.pct}%</td>
                      <td className="text-right py-1.5 px-2">
                        {Math.floor(totalModules * (l.pct / 100)).toLocaleString()}
                      </td>
                      <td className="text-right py-1.5 pl-2">
                        {Math.floor(totalModules * (l.pct / 100) * 0.5).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Approximation: recovery percentages apply to codewords in the specification, not
              literally to modules. Module counts here are a planning proxy so different levels can
              be compared. Always verify a logo or overlay with printed test scans.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result — level {selected}
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Approx. recoverable modules</div>
              <div className="text-4xl font-extrabold text-primary">
                {recoverable.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ≈{sel.pct}% of {totalModules.toLocaleString()} modules
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Conservative logo / overlay budget</span>
                <span className="font-semibold">{logoBudget.toLocaleString()} modules</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Same budget as logo side</span>
                <span className="font-semibold">≈{logoSidePct.toFixed(1)}% of code width</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Remaining headroom after a max logo</span>
                <span className="font-semibold">
                  {(recoverable - logoBudget).toLocaleString()} modules
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Rule used: reserve half the recovery budget for real-world damage (scuffs, glare,
              fading) and spend at most the other half on a logo or overlay. Damage is rarely a neat
              central square — irregular damage near finder patterns hurts more than the same area
              in the centre.
            </p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Your QR Code&apos;s Error Budget Is Not Free Money
        </h2>
        <p className="text-base leading-relaxed">
          Error correction is the reason QR codes survive the real world. A portion of every code is
          redundancy: extra data that lets the scanner reconstruct the payload when part of the
          pattern is damaged, dirty, or covered. Level L reserves about 7% of the code for that
          purpose, M about 15%, Q about 25%, and H about 30%. Those percentages are the code&apos;s
          budget for everything that can go wrong — and a logo spends from the same budget as a
          scuff, a shadow, or a fading patch. The calculator shows how big that budget is in modules
          for your version, and how much of it a logo can safely consume while leaving headroom for
          reality.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Why the budget is smaller than it looks
        </h3>
        <p className="text-base leading-relaxed">
          Two details shrink the usable budget. First, the recovery percentages in the specification
          apply to codewords, the internal data units, not literally to printed modules — the module
          counts on this page are a planning proxy that makes levels comparable, and real behaviour
          depends on where damage lands. Damage over the corner finder patterns or the timing
          patterns hurts far more than the same area lost in the middle of the data region, because
          those patterns carry the code&apos;s geometry. Second, real damage is never the tidy
          central square of a logo. A coffee stain, a fold, or a peeling corner is irregular, and it
          arrives on top of whatever the logo already consumed. That is why the calculator reserves
          half the budget for the world and lets a logo spend at most the other half.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Spending the budget wisely</h3>
        <p className="text-base leading-relaxed">
          The hierarchy is simple. Spend the budget on the things you cannot avoid first: outdoor
          exposure, handling, textured stock, and the odd splash. Then, if budget remains, spend it
          on a logo — centred, clear of the finder patterns, at level H, inside the conservative
          size the calculator shows. Never stack a logo on top of an already-hostile environment
          without enlarging the code or shortening the payload to buy back margin. And remember that
          raising the error-correction level itself costs capacity: a code at H holds far less data
          than the same version at L, so a payload that only just fits at H may need a version bump,
          which shrinks the modules and spends a different kind of margin.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          A testing rule that beats arithmetic
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Generate the code at the chosen level with the logo applied, then print it at final
            size.
          </li>
          <li>
            Scan it on several phones, including an older one, in good light and in dim light.
          </li>
          <li>Deliberately abuse the proof: smudge a corner, tilt it, scan from an angle.</li>
          <li>
            If any test is flaky, shrink the logo, enlarge the code, or drop the logo entirely.
          </li>
          <li>
            For high-stakes print, keep a plain no-logo version in the artwork file as a fallback.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          An error budget is a safety margin, and safety margins are for the unexpected. Spend half
          of it on purpose, keep half in reserve, and the code will survive the surprises.
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
