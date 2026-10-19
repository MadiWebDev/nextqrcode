'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DollarSign } from 'lucide-react';

export default function QRPrintCostCalculatorPage() {
  const [qty, setQty] = useState(1000);
  const [sizeMm, setSizeMm] = useState(40);
  const [material, setMaterial] = useState('paper');
  const [finish, setFinish] = useState('none');
  const [shape, setShape] = useState('square');
  const materials: Record<string, { label: string; mult: number }> = {
    paper: { label: 'Standard paper', mult: 1 },
    vinyl: { label: 'Vinyl (waterproof)', mult: 1.8 },
    polyester: { label: 'Polyester film', mult: 2.4 },
    kraft: { label: 'Kraft paper', mult: 1.2 },
  };
  const finishes: Record<string, { label: string; mult: number }> = {
    none: { label: 'No finish', mult: 1 },
    laminate: { label: 'Laminate', mult: 1.25 },
    uv: { label: 'UV coating', mult: 1.35 },
  };
  const areaCm2 = Math.pow(sizeMm / 10, 2);
  const shapeFactor = shape === 'circle' ? 0.785 : shape === 'rounded' ? 0.92 : 1;
  const baseUnit = (0.012 + areaCm2 * 0.0011) * shapeFactor;
  const unit = baseUnit * materials[material].mult * finishes[finish].mult;
  const setup = 25;
  const volumeDiscount = qty >= 10000 ? 0.8 : qty >= 5000 ? 0.88 : qty >= 1000 ? 0.94 : 1;
  const discountedUnit = unit * volumeDiscount;
  const total = qty * discountedUnit + setup;

  const faqs = [
    {
      question: 'Is this calculator a real supplier quote?',
      answer:
        'No. It is a planning estimate built from stated estimating factors, so you can compare materials and quantities before talking to suppliers. Real prices vary by region, printer, die-cutting, and shipping, so always get at least two written quotes.',
    },
    {
      question: 'Why does doubling the quantity not halve the unit price?',
      answer:
        'Fixed costs such as setup, dies, and artwork checks are spread across the run, and volume discounts taper off. Once those fixed costs are a small share of the total, further quantity mainly saves on the per-label material and ink cost.',
    },
    {
      question: 'Which material should I choose for outdoor QR labels?',
      answer:
        'Vinyl with laminate is the usual practical choice for outdoor use because it resists water, wiping, and sunlight better than paper. For chemical exposure or very long life, polyester film is the step up. Confirm ratings in writing with your supplier.',
    },
    {
      question: 'How much waste should I allow for?',
      answer:
        'A few percent is a sensible planning allowance for setup, misprints, and application mistakes. Ask your supplier how defective labels are handled and whether reprints are included before approving the job.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Print Cost Calculator',
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
          { label: 'QR Print Cost Calculator', href: '/qr-print-cost-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Estimating Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Print Cost Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Estimate what a run of printed QR labels or stickers will cost from quantity, size,
          material, and finish, with a per-unit breakdown you can compare against real supplier
          quotes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Your print run</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  min="50"
                  max="1000000"
                  step="50"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[qty]}
                min={50}
                max={20000}
                step={50}
                onValueChange={([v]) => setQty(v)}
              />
              <p className="text-[11px] text-muted-foreground">
                50 to 20,000 on the slider; type a larger number if needed.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="size">Label size (one side, mm)</Label>
                <Input
                  id="size"
                  type="number"
                  min="10"
                  max="300"
                  step="1"
                  value={sizeMm}
                  onChange={(e) => setSizeMm(Math.max(10, parseFloat(e.target.value) || 10))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[sizeMm]}
                min={10}
                max={200}
                step={1}
                onValueChange={([v]) => setSizeMm(v)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Material
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(materials).map(([k, m]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMaterial(k)}
                    className={`p-3 text-left rounded-xl border text-xs ${material === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {m.label}
                    <span className="block text-[10px] text-muted-foreground">
                      ×{m.mult.toFixed(2)} cost factor
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Finish
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(finishes).map(([k, f]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFinish(k)}
                    className={`p-3 text-left rounded-xl border text-xs ${finish === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Shape</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['square', 'Square'],
                  ['rounded', 'Rounded corners'],
                  ['circle', 'Circle'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setShape(k)}
                    className={`p-3 text-left rounded-xl border text-xs ${shape === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula and assumptions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unit cost = (0.012 + label area in cm² × 0.0011) × shape factor × material factor ×
              finish factor, then a volume discount (6% at 1,000+, 12% at 5,000+, 20% at 10,000+),
              plus a flat 25 setup fee. These are planning estimates in US dollars, not supplier
              prices: real quotes vary by region, printer, die-cutting, and shipping. Always compare
              this estimate against at least two written quotes before budgeting.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estimate
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Estimated total</div>
              <div className="text-4xl font-extrabold text-primary">${total.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                ${discountedUnit.toFixed(4)} per label · setup ${setup.toFixed(2)} included
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Labels</span>
                <span className="font-semibold">
                  {qty.toLocaleString()} × {sizeMm} mm {shape}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Material</span>
                <span className="font-semibold">{materials[material].label}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Finish</span>
                <span className="font-semibold">{finishes[finish].label}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Base unit (before discount)</span>
                <span className="font-semibold">${unit.toFixed(4)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Volume discount</span>
                <span className="font-semibold">{((1 - volumeDiscount) * 100).toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Estimate only. Add shipping, tax, design time, and any die or plate charges your
              supplier lists separately.
            </p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Budget a QR Label Run Without Surprises
        </h2>
        <p className="text-base leading-relaxed">
          Printed QR labels look like a commodity until the invoice arrives. The unit price on a
          quote is only one part of the total: setup fees, dies, finishes, shipping, and waste all
          push the real cost per usable label higher, and small runs carry those fixed costs across
          far fewer labels. The calculator on this page gives you a planning estimate so you can
          sanity-check quotes, compare materials, and decide where a bigger run actually saves money
          instead of just spending more of it.
        </p>
        <h3 className="text-xl font-semibold text-foreground">What drives the price</h3>
        <p className="text-base leading-relaxed">
          Size is the most obvious driver, because a larger label consumes more substrate and ink,
          but material choice often matters more. Standard paper is cheapest and fine for indoor,
          short-life labels. Vinyl costs more but survives water, wiping, and sunlight, which makes
          it the right choice for equipment, outdoor signage, and anything handled daily. Polyester
          film sits higher still and is chosen for chemical resistance and long life. Finishes add
          cost per label but protect the print: laminate guards against abrasion and moisture, while
          UV coating adds gloss and some fade resistance. Shape matters too, because a circle uses
          less material than the square it is cut from, while custom die-cut shapes add tooling
          cost.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Quantity, waste, and the reorder trap
        </h3>
        <p className="text-base leading-relaxed">
          Volume discounts are real, but they reward ordering only what you will actually use.
          Labels get damaged, misapplied, and superseded when a destination URL changes, so ordering
          a huge run of a code that points at a campaign page you will redesign next quarter is a
          false economy. For codes that must live a long time, point them at a redirect you control,
          so the destination can change without reprinting. Always add a waste allowance of a few
          percent for setup, misprints, and application errors, and ask your supplier how they
          handle reprints of defective labels before you approve the job.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Getting quotes you can compare</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Ask for the same specification from every supplier: size, material, finish, quantity,
            and whether the quiet zone is included in the stated size.
          </li>
          <li>
            Confirm whether the quote includes artwork checks, proofs, die charges, shipping, and
            tax.
          </li>
          <li>
            Request a printed proof at final size and scan it on two phones before the full run.
          </li>
          <li>
            For outdoor or washable labels, ask what the material and laminate are rated for, in
            writing, rather than trusting a marketing label.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Use the estimate here to frame the conversation, then let written quotes decide the order.
          A supplier who explains their charges clearly is usually a better bet than the cheapest
          number on a one-line quote.
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
