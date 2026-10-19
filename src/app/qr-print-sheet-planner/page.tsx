'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Grid3x3 } from 'lucide-react';

const FAQS = [
  {
    question: 'How many QR codes fit on an A4 sheet?',
    answer:
      'It depends on code size, margin, and gap. At 40 mm codes with a 10 mm margin and 5 mm gaps, an A4 sheet fits 4 columns by 6 rows, or 24 codes. Change any input in the planner to see the new count.',
  },
  {
    question: 'How much gap should I leave between codes?',
    answer:
      'About 5 mm for guillotine cutting, more for hand cutting. The gap is the cut allowance: too small and the blade nicks the quiet zone of the neighboring code.',
  },
  {
    question: 'Do cut guides touch the QR code?',
    answer:
      'No. Cut guides sit in the middle of the gap between codes and must never touch the quiet zone. A guide that crosses a code will damage it when trimmed.',
  },
  {
    question: 'Should I print extra sheets?',
    answer:
      'Yes. Add 5 to 10 percent overrun for misfeeds, test cuts, and damage. Reprinting a few sheets later costs more than printing a few extra now.',
  },
];

export default function QrPrintSheetPlannerPage() {
  const [paper, setPaper] = useState<'A4' | 'Letter'>('A4');
  const [codeMm, setCodeMm] = useState(40);
  const [marginMm, setMarginMm] = useState(10);
  const [gapMm, setGapMm] = useState(5);
  const [cutGuides, setCutGuides] = useState(true);
  const [copies, setCopies] = useState(100);
  const paperW = paper === 'A4' ? 210 : 215.9;
  const paperH = paper === 'A4' ? 297 : 279.4;
  const usableW = paperW - marginMm * 2;
  const usableH = paperH - marginMm * 2;
  const cols = Math.max(1, Math.floor((usableW + gapMm) / (codeMm + gapMm)));
  const rows = Math.max(1, Math.floor((usableH + gapMm) / (codeMm + gapMm)));
  const perSheet = cols * rows;
  const sheets = Math.max(1, Math.ceil(copies / perSheet));
  const scale = 520 / paperW;
  const leftoverW = usableW - (cols * codeMm + (cols - 1) * gapMm);
  const leftoverH = usableH - (rows * codeMm + (rows - 1) * gapMm);
  function printSheet() {
    window.print();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Print Sheet Planner',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
          { label: 'QR Print Sheet Planner', href: '/qr-print-sheet-planner' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Grid3x3 className="w-3.5 h-3.5" />
          <span>Print Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Print Sheet Planner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Plan an A4 or Letter sheet: code size, margins, rows and columns, cut guides; renders a
          printable sheet layout.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Paper size</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={paper === 'A4' ? 'default' : 'outline'}
                onClick={() => setPaper('A4')}
              >
                A4 (210 x 297 mm)
              </Button>
              <Button
                size="sm"
                variant={paper === 'Letter' ? 'default' : 'outline'}
                onClick={() => setPaper('Letter')}
              >
                Letter (8.5 x 11 in)
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Code size: {codeMm} mm</Label>
            <Slider
              value={[codeMm]}
              min={15}
              max={100}
              step={1}
              onValueChange={([v]) => setCodeMm(v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sheet margin: {marginMm} mm</Label>
            <Slider
              value={[marginMm]}
              min={5}
              max={25}
              step={1}
              onValueChange={([v]) => setMarginMm(v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Gap between codes: {gapMm} mm</Label>
            <Slider
              value={[gapMm]}
              min={0}
              max={20}
              step={1}
              onValueChange={([v]) => setGapMm(v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-copies">Total copies needed</Label>
            <Input
              id="ps-copies"
              type="number"
              min={1}
              value={copies}
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cutGuides}
              onChange={(e) => setCutGuides(e.target.checked)}
            />{' '}
            Show cut guides
          </label>
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Layout</span>
              <strong>
                {cols} columns x {rows} rows
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Codes per sheet</span>
              <strong>{perSheet}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sheets for {copies} copies</span>
              <strong>{sheets}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unused width / height</span>
              <strong>
                {leftoverW.toFixed(1)} / {leftoverH.toFixed(1)} mm
              </strong>
            </div>
          </div>
          <Button onClick={printSheet}>Print sheet layout</Button>
          <p className="text-xs text-muted-foreground">
            Formulas: columns = floor((usable width + gap) / (code + gap)). Sheets = ceil(copies /
            per-sheet). Cut guides are drawn between codes when enabled.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Sheet preview ({paper})
          </p>
          <div
            className="mx-auto border bg-white shadow-sm"
            style={{ width: paperW * scale, height: paperH * scale, padding: marginMm * scale }}
          >
            {Array.from({ length: rows }).map((_, r) => (
              <div
                key={r}
                className="flex"
                style={{ gap: gapMm * scale, marginBottom: r < rows - 1 ? gapMm * scale : 0 }}
              >
                {Array.from({ length: cols }).map((_, c) => (
                  <div
                    key={c}
                    className="bg-slate-900 flex items-center justify-center"
                    style={{ width: codeMm * scale, height: codeMm * scale }}
                  >
                    <div
                      className="bg-white"
                      style={{ width: codeMm * scale * 0.72, height: codeMm * scale * 0.72 }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {cutGuides
              ? 'Dashed cut guides would be drawn between codes on the press sheet.'
              : 'Cut guides are off. Enable them to mark where to trim.'}{' '}
            The dark squares stand in for your QR artwork — place the real codes at these positions
            in your layout tool.
          </p>
        </Card>
      </div>
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Plan a QR Print Sheet Without Wasting Paper
        </h2>
        <p className="text-base leading-relaxed">
          Printing QR codes one per page wastes paper, time, and money. Printing them as a planned
          sheet packs as many codes as possible onto each page while leaving enough room to cut them
          apart cleanly. The planning problem has only four inputs: the paper size, the code size,
          the margin around the sheet edge, and the gap between codes. From those four numbers, the
          whole layout follows: columns and rows come from dividing the usable area by the
          code-plus-gap size, codes per sheet is columns times rows, and sheets needed is the total
          copies divided by codes per sheet, rounded up. This tool computes all of it live, so you
          can trade code size against sheet count before you commit.
        </p>
        <p className="text-base leading-relaxed">
          The margin is not just a printer limitation, although it starts as one. Most printers
          cannot print to the very edge of the sheet, so a margin of at least 10 millimeters keeps
          the codes inside the printable area. The margin also gives the cutter something to hold
          and gives the person trimming the sheets a safe place to put their fingers. The gap
          between codes is the cut allowance: too small and the blade nicks the quiet zone of the
          neighboring code, too large and you waste space. Five millimeters is a good default for
          hand cutting with a guillotine, and a little more is wise if the sheets will be cut by
          hand with scissors or a craft knife.
        </p>
        <p className="text-base leading-relaxed">
          Code size on a sheet is decided by the scanning distance, not by how many codes you wish
          fit on the page. A sheet of tiny codes that nobody can scan is not efficient; it is a
          reprint. Decide the code size from the use case first, using the 10:1 distance rule, then
          let the planner tell you how many fit. If the count is too low for the budget, the honest
          options are a larger sheet, a smaller margin within the printer&apos;s limits, or a
          shorter payload that allows a slightly smaller code. Shrinking the code below the scanning
          minimum to hit a sheet count is the wrong trade, and it is the most common one.
        </p>
        <p className="text-base leading-relaxed">
          Cut guides deserve attention because they are what stands between a neat stack of labels
          and a pile of damaged codes. A cut guide is a thin line or crop mark drawn in the gap
          between codes, showing exactly where the blade should go. It must sit in the middle of the
          gap, never touching a quiet zone. When you send the layout to a printer, confirm that they
          will use your guides rather than their own imposition, and confirm the bleed and trim
          settings match. If you are cutting in-house, print one test sheet, cut it, and scan the
          codes from the edges of the sheet, because edge codes are the ones most likely to be
          nicked.
        </p>
        <p className="text-base leading-relaxed">
          Finally, add a small overrun to the sheet count. Print runs always lose a few sheets to
          misfeeds, test cuts, and last-minute damage, and reprinting a handful of sheets later
          costs more than printing a few extra now. Five to ten percent overrun is a sensible
          default for small runs. File the planner settings with the job: paper size, code size,
          margin, gap, and sheet count, so a reprint months later reproduces the same sheet exactly
          instead of requiring the layout to be rebuilt from memory.
        </p>
      </article>
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq, i) => (
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
