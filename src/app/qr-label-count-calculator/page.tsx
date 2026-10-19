'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LayoutGrid } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRLabelCountCalculatorPage() {
  const [sheetW, setSheetW] = useState(210);
  const [sheetH, setSheetH] = useState(297);
  const [labelW, setLabelW] = useState(50);
  const [labelH, setLabelH] = useState(30);
  const [gap, setGap] = useState(3);
  const [margin, setMargin] = useState(5);
  const [total, setTotal] = useState(1000);
  const usableW = Math.max(0, sheetW - margin * 2);
  const usableH = Math.max(0, sheetH - margin * 2);
  const cols = Math.max(0, Math.floor((usableW + gap) / (labelW + gap)));
  const rows = Math.max(0, Math.floor((usableH + gap) / (labelH + gap)));
  const perSheet = cols * rows;
  const sheets = perSheet > 0 ? Math.ceil(total / perSheet) : 0;
  const waste =
    usableW * usableH > 0
      ? Math.max(0, 100 - ((perSheet * labelW * labelH) / (usableW * usableH)) * 100)
      : 0;
  const preset = (w: number, h: number) => {
    setSheetW(w);
    setSheetH(h);
  };

  const faqs = [
    {
      question: 'How many labels fit on an A4 sheet?',
      answer:
        'It depends on the label size, gap, and edge margin your printer needs. Enter those numbers and the calculator gives columns, rows, and labels per sheet. For example, 50 × 30 mm labels with a 3 mm gap and 5 mm margins fit 4 columns × 9 rows = 36 per A4 sheet.',
    },
    {
      question: 'Why does my printer need an edge margin?',
      answer:
        'Printers need a grip edge and registration area, and cutters need clearance from the sheet edge. The margin is a production requirement, not optional padding — confirm the real values with your supplier before finalising artwork.',
    },
    {
      question: 'Can I rotate labels to fit more per sheet?',
      answer:
        'Often yes. Rotating 90 degrees can recover a wasted strip along one edge. Keep the QR code itself at a safe size and re-check the quiet zone after rotating; never shrink the code to make the layout fit.',
    },
    {
      question: 'What is the waste percentage telling me?',
      answer:
        'It is the share of the usable sheet area not covered by labels, counting the gaps between them. High waste suggests trying a rotation, a slightly different label size, or a different standard sheet size.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Label Count Calculator',
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
          { label: 'QR Label Count Calculator', href: '/qr-label-count-calculator' },
        ]}
      />

      <AdSlot id="qr-label-count-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Print Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Label Count Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out how many QR labels fit on one sheet or roll, how many sheets a run needs, and how
          much of each sheet is wasted.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Sheet and label</h2>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => preset(210, 297)}>
                A4 (210 × 297)
              </Button>
              <Button size="sm" variant="outline" onClick={() => preset(216, 279)}>
                US Letter (216 × 279)
              </Button>
              <Button size="sm" variant="outline" onClick={() => preset(100, 150)}>
                Roll 100 mm wide
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sw">Sheet width (mm)</Label>
                <Input
                  id="sw"
                  type="number"
                  min="10"
                  value={sheetW}
                  onChange={(e) => setSheetW(Math.max(10, parseFloat(e.target.value) || 10))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sh">Sheet height (mm)</Label>
                <Input
                  id="sh"
                  type="number"
                  min="10"
                  value={sheetH}
                  onChange={(e) => setSheetH(Math.max(10, parseFloat(e.target.value) || 10))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lw">Label width (mm)</Label>
                <Input
                  id="lw"
                  type="number"
                  min="5"
                  value={labelW}
                  onChange={(e) => setLabelW(Math.max(5, parseFloat(e.target.value) || 5))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lh">Label height (mm)</Label>
                <Input
                  id="lh"
                  type="number"
                  min="5"
                  value={labelH}
                  onChange={(e) => setLabelH(Math.max(5, parseFloat(e.target.value) || 5))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gap">Gap between labels (mm)</Label>
                <Input
                  id="gap"
                  type="number"
                  min="0"
                  value={gap}
                  onChange={(e) => setGap(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marg">Edge margin (mm)</Label>
                <Input
                  id="marg"
                  type="number"
                  min="0"
                  value={margin}
                  onChange={(e) => setMargin(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="tot">Total labels needed</Label>
                <Input
                  id="tot"
                  type="number"
                  min="1"
                  value={total}
                  onChange={(e) => setTotal(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[total]}
                min={10}
                max={10000}
                step={10}
                onValueChange={([v]) => setTotal(v)}
              />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Usable width = sheet width − 2 × margin, and likewise for height. Columns =
              floor((usable width + gap) ÷ (label width + gap)); rows likewise. Labels per sheet =
              columns × rows. Sheets needed = ceil(total ÷ labels per sheet). Waste % = 1 − (labels
              × label area) ÷ usable sheet area. The gap and margin are printer and cutter
              requirements, not optional padding — confirm them with your supplier.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Labels per sheet</div>
              <div className="text-4xl font-extrabold text-primary">{perSheet}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {cols} columns × {rows} rows
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">
                  Sheets needed for {total.toLocaleString()} labels
                </span>
                <span className="font-semibold">{sheets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Labels on last sheet</span>
                <span className="font-semibold">
                  {perSheet > 0 ? total - (sheets - 1) * perSheet : 0}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Unused area per sheet (approx.)</span>
                <span className="font-semibold">{waste.toFixed(1)}%</span>
              </div>
            </div>
            {perSheet === 0 && (
              <p className="text-xs text-red-700 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                No label fits: the label plus margins exceed the sheet. Reduce the label size or
                margins, or use a larger sheet.
              </p>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="qr-label-count-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Fitting Labels on a Sheet Without Wasting Stock
        </h2>
        <p className="text-base leading-relaxed">
          Label planning is arithmetic with consequences. A layout that fits one extra column per
          sheet can cut the sheet count for a large run by a fifth, while a layout that ignores the
          cutter&apos;s minimum gap produces sheets that cannot be cut cleanly. The calculator
          handles the arithmetic: given a sheet size, a label size, the gap between labels, and the
          edge margin the printer needs, it tells you how many labels fit, how many sheets the run
          needs, and roughly how much of each sheet goes unused. The rest is judgement about which
          trade-offs are worth making.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Why gaps and margins are not optional
        </h3>
        <p className="text-base leading-relaxed">
          The gap between labels is what the cutter or die needs to separate them without nicking a
          neighbour, and the edge margin is what the printer needs to grip and register the sheet.
          Both vary by supplier and by process, so the defaults here are starting points, not
          gospel. If you plan with a 2 mm gap and the printer needs 3 mm, your layout does not fit
          and the job comes back with a changed specification or a higher price. Confirm both
          numbers before you commit artwork, and re-run the calculator with the real values. For
          roll printing, the same logic applies along the web width, with the added constraint that
          the roll&apos;s usable width is fixed by the press.
        </p>

        <AdSlot id="qr-label-count-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Small changes, large savings</h3>
        <p className="text-base leading-relaxed">
          When a layout wastes a strip of sheet along one edge, a small change often recovers it:
          rotating the label 90 degrees, trimming a millimetre of padding, or switching to a
          slightly different standard sheet size. Each change must be checked against the QR code
          itself, though. A label that shrinks the code below its safe print size, or squeezes the
          quiet zone, is a false saving that produces unscannable labels. Keep the code size fixed
          and adjust the label&apos;s padding, text, and white space first. If the label genuinely
          cannot hold a scannable code at the size you want, the answer is a larger label, not a
          smaller code.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Planning the run</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Order a few percent extra sheets for setup, misprints, and application mistakes.</li>
          <li>
            Ask whether the supplier counts the last partial sheet as a full sheet for pricing.
          </li>
          <li>
            For multi-design runs, confirm whether each design needs its own setup or shares the
            run.
          </li>
          <li>
            Print one sheet first and scan codes from several positions on it — edge labels can
            print differently from centre ones.
          </li>
          <li>Keep a sample sheet from the approved run to compare against reprints.</li>
        </ul>
        <p className="text-base leading-relaxed">
          A sheet that fits well is cheaper, faster to cut, and easier to apply. Do the arithmetic
          before the artwork, not after.
        </p>
      </article>

      <AdSlot id="qr-label-count-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-label-count-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
