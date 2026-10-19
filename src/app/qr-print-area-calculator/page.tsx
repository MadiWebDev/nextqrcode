'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Frame } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRPrintAreaCalculatorPage() {
  const [width, setWidth] = useState(210);
  const [height, setHeight] = useState(297);
  const [marginLeft, setMarginLeft] = useState(10);
  const [marginRight, setMarginRight] = useState(10);
  const [marginTop, setMarginTop] = useState(10);
  const [marginBottom, setMarginBottom] = useState(10);
  const [bleed, setBleed] = useState(3);

  const result = useMemo(() => {
    const usableW = Math.max(0, width - marginLeft - marginRight - 2 * bleed);
    const usableH = Math.max(0, height - marginTop - marginBottom - 2 * bleed);
    const stockArea = width * height;
    const usableArea = usableW * usableH;
    const lostPct = stockArea > 0 ? ((stockArea - usableArea) / stockArea) * 100 : 0;
    return { usableW, usableH, stockArea, usableArea, lostPct };
  }, [width, height, marginLeft, marginRight, marginTop, marginBottom, bleed]);

  const faqs = [
    {
      question: 'What is the difference between margin and bleed?',
      answer:
        'Margin is the blank space inside the finished piece that content must stay out of. Bleed is extra artwork extending past the trim edge so the cut does not leave a white sliver. Both shrink the usable area, but for different reasons — margin protects content, bleed protects the edge.',
    },
    {
      question: 'Why subtract bleed twice?',
      answer:
        'Bleed applies on both sides of each dimension: left and right for width, top and bottom for height. A 3 mm bleed removes 6 mm from the usable width and 6 mm from the usable height.',
    },
    {
      question: 'Can the QR code sit in the bleed area?',
      answer:
        'No. The code must sit fully inside the usable area, with its quiet zone clear of the margin. Anything in the bleed or margin risks being trimmed off or crowded by the edge.',
    },
    {
      question: 'What units does this use?',
      answer:
        'Any consistent unit — millimetres, centimetres, or inches — as long as every field uses the same one. The areas come out in that unit squared.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Print Area Calculator',
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
          { label: 'QR Print Area Calculator', href: '/qr-print-area-calculator' },
        ]}
      />

      <AdSlot id="qr-print-area-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Frame className="w-3.5 h-3.5" />
          <span>Design Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Print Area Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enter stock size, margins, and bleed to get the usable print area that a QR code and its
          quiet zone must fit inside. All values use the same unit you enter.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter stock and margins</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Stock width</Label>
                <Input
                  id="width"
                  type="number"
                  min={0}
                  step={0.1}
                  value={width}
                  onChange={(e) => setWidth(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Stock height</Label>
                <Input
                  id="height"
                  type="number"
                  min={0}
                  step={0.1}
                  value={height}
                  onChange={(e) => setHeight(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ml">Left margin</Label>
                <Input
                  id="ml"
                  type="number"
                  min={0}
                  step={0.1}
                  value={marginLeft}
                  onChange={(e) => setMarginLeft(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mr">Right margin</Label>
                <Input
                  id="mr"
                  type="number"
                  min={0}
                  step={0.1}
                  value={marginRight}
                  onChange={(e) => setMarginRight(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mt">Top margin</Label>
                <Input
                  id="mt"
                  type="number"
                  min={0}
                  step={0.1}
                  value={marginTop}
                  onChange={(e) => setMarginTop(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mb">Bottom margin</Label>
                <Input
                  id="mb"
                  type="number"
                  min={0}
                  step={0.1}
                  value={marginBottom}
                  onChange={(e) => setMarginBottom(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bleed">Bleed (each edge)</Label>
              <Input
                id="bleed"
                type="number"
                min={0}
                step={0.1}
                value={bleed}
                onChange={(e) => setBleed(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formulas: usable width = stock width − left margin − right margin − 2 × bleed. Usable
              height = stock height − top margin − bottom margin − 2 × bleed. Usable area = usable
              width × usable height.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Usable print area</div>
              <div className="text-4xl font-extrabold text-primary">
                {result.usableArea.toFixed(1)} sq units
              </div>
              <div className="text-sm text-muted-foreground">
                {result.usableW.toFixed(1)} × {result.usableH.toFixed(1)} units
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Stock area</span>
                <span className="font-semibold">{result.stockArea.toFixed(1)} sq units</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Area lost to margins + bleed</span>
                <span className="font-semibold">{result.lostPct.toFixed(1)}%</span>
              </div>
            </div>
            {(result.usableW <= 0 || result.usableH <= 0) && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                Margins plus bleed consume the whole stock. Reduce them — there is no usable area
                left.
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              The QR code plus its quiet zone must fit inside the usable width and height. If it
              does not, enlarge the stock or shrink the margins — never shrink the quiet zone.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-print-area-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Design Inside the Usable Area</h2>
        <p className="text-base leading-relaxed">
          A layout that fits the stock size on screen can still fail on press if margins and bleed
          were never subtracted. The usable area is the only space that is guaranteed to survive
          trimming and stay clear of the edge. Sizing the QR code against that rectangle — not the
          full stock — is what keeps the code and its quiet zone intact on the finished piece.
        </p>

        <AdSlot id="qr-print-area-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">A quick check</h3>
        <p className="text-base leading-relaxed">
          Compare the usable width and height with the code size your viewing distance requires. If
          the code does not fit, change the layout or the stock size; squeezing the code or its
          quiet zone trades away scans.
        </p>
      </article>

      <AdSlot id="qr-print-area-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-print-area-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
