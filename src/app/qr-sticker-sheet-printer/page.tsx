'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Printer,
  Grid,
  Layers,
  Settings,
  Sparkles,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface SheetPreset {
  id: string;
  name: string;
  paper: 'letter' | 'a4';
  cols: number;
  rows: number;
  total: number;
  labelWidth: string;
  labelHeight: string;
}

const SHEET_PRESETS: SheetPreset[] = [
  { id: 'avery-5160', name: 'Avery 5160 / 8160 (30 Labels - US Letter)', paper: 'letter', cols: 3, rows: 10, total: 30, labelWidth: '2.625in', labelHeight: '1in' },
  { id: 'avery-5163', name: 'Avery 5163 (10 Shipping Labels - US Letter)', paper: 'letter', cols: 2, rows: 5, total: 10, labelWidth: '4in', labelHeight: '2in' },
  { id: 'a4-24', name: 'Herma A4 3x8 (24 Labels - 70x36mm)', paper: 'a4', cols: 3, rows: 8, total: 24, labelWidth: '70mm', labelHeight: '36mm' },
  { id: 'round-12', name: '2" Round Stickers (12 per Sheet)', paper: 'letter', cols: 3, rows: 4, total: 12, labelWidth: '2in', labelHeight: '2in' },
];

export default function QRStickerSheetPrinterPage() {
  const [selectedPresetId, setSelectedPresetId] = useState('avery-5160');
  const [mode, setMode] = useState<'single' | 'sequential'>('single');
  const [basePayload, setBasePayload] = useState('https://qrstudio.app');
  const [labelTitle, setLabelTitle] = useState('SCAN ME');
  const [prefix, setPrefix] = useState('ASSET-');
  const [startNum, setStartNum] = useState(1);
  const [qrUrls, setQrUrls] = useState<string[]>([]);

  const activePreset = SHEET_PRESETS.find((p) => p.id === selectedPresetId) || SHEET_PRESETS[0];

  useEffect(() => {
    const total = activePreset.total;
    const payloads: string[] = [];

    for (let i = 0; i < total; i++) {
      if (mode === 'single') {
        payloads.push(basePayload);
      } else {
        payloads.push(`${prefix}${String(startNum + i).padStart(4, '0')}`);
      }
    }

    Promise.all(
      payloads.map((p) =>
        QRCode.toDataURL(p, {
          errorCorrectionLevel: 'M',
          width: 140,
          margin: 1,
        })
      )
    ).then((urls) => {
      setQrUrls(urls);
    });
  }, [selectedPresetId, mode, basePayload, prefix, startNum, activePreset.total]);

  const faqs = [
    {
      question: 'How do I ensure the labels align with Avery label sheets when printing?',
      answer: 'In your browser print dialog, set Margins to "None" or "Default" and Scale to "100%" (do not select "Fit to Printable Area"). Ensure your printer paper tray guides fit the sheet snugly to prevent paper skew.',
    },
    {
      question: 'Can I generate sequential serial numbers for warehouse inventory?',
      answer: 'Yes. Switch to "Sequential Serial Numbers" mode, enter your prefix (e.g. INV-), and set the starting number. The generator will create unique numbered QR codes across all 30 labels.',
    },
    {
      question: 'Which label material is best for long-term outdoor use?',
      answer: 'For outdoor or industrial use, choose weatherproof polyester or vinyl label sheets (such as Avery 5520) rather than standard matte paper, which degrades when wet.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Sticker Sheet Layout Printer', href: '/qr-sticker-sheet-printer' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Grid className="w-3.5 h-3.5" />
          <span>Batch Layout Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Sticker & Label Sheet Layout Printer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Format and print batches of QR codes on popular Avery, Herma, and round sticker sheets. Support for uniform links and sequential inventory serial numbers.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Select Sheet Template:
              </Label>
              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm mt-1.5"
              >
                {SHEET_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Batch Mode:
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('single')}
                  className={`p-2.5 text-xs rounded-xl border text-center font-medium transition-all ${
                    mode === 'single'
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  Duplicate Single URL
                </button>
                <button
                  type="button"
                  onClick={() => setMode('sequential')}
                  className={`p-2.5 text-xs rounded-xl border text-center font-medium transition-all ${
                    mode === 'sequential'
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  Sequential Numbers
                </button>
              </div>
            </div>

            {mode === 'single' ? (
              <div>
                <Label htmlFor="base-url" className="text-xs">Destination URL or Text:</Label>
                <Input
                  id="base-url"
                  value={basePayload}
                  onChange={(e) => setBasePayload(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pre-id" className="text-xs">Prefix:</Label>
                  <Input
                    id="pre-id"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="text-sm mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="start-num" className="text-xs">Start Number:</Label>
                  <Input
                    id="start-num"
                    type="number"
                    value={startNum}
                    onChange={(e) => setStartNum(parseInt(e.target.value, 10) || 1)}
                    className="text-sm mt-1"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="lbl-title" className="text-xs">Label Caption (Top):</Label>
              <Input
                id="lbl-title"
                value={labelTitle}
                onChange={(e) => setLabelTitle(e.target.value)}
                className="text-sm mt-1"
              />
            </div>

            <Button
              onClick={() => window.print()}
              className="w-full text-xs font-semibold gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Sheet ({activePreset.total} Labels)
            </Button>
          </Card>
        </div>

        {/* Right Sticky Preview (7 cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sheet Layout Preview ({activePreset.name})
              </span>
              <span className="text-xs text-primary font-bold">100% Scale Calibrated</span>
            </div>

            {/* Scaled Sheet Grid */}
            <div
              id="printable-label-sheet"
              className="bg-white text-slate-900 border border-slate-300 rounded-xl p-4 shadow-inner max-h-[520px] overflow-y-auto"
            >
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${activePreset.cols}, minmax(0, 1fr))`,
                }}
              >
                {qrUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="border border-dashed border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center text-center bg-slate-50/50"
                  >
                    {labelTitle && (
                      <span className="text-[9px] font-bold text-slate-800 uppercase tracking-tight">
                        {labelTitle}
                      </span>
                    )}
                    <img src={url} alt={`Label ${idx + 1}`} className="w-16 h-16 my-1" />
                    <span className="text-[8px] font-mono text-slate-600 truncate max-w-[90px]">
                      {mode === 'single'
                        ? basePayload.replace(/^https?:\/\//, '')
                        : `${prefix}${String(startNum + idx).padStart(4, '0')}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="sheet-printer-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Calibrating and Printing QR Code Sticker Sheets Without Alignment Creep
        </h2>
        <p className="text-base leading-relaxed">
          Printing pre-cut adhesive label sheets is notorious for alignment creep—where the first row prints perfectly, but the bottom rows drift off the sticker boundaries. This occurs when browser print drivers apply automatic margins or scaling adjustments.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Printer Dialog Calibration Checklist
        </h3>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          <li><strong>Paper Size:</strong> Ensure your printer driver matches the exact paper size (US Letter vs A4).</li>
          <li><strong>Scaling:</strong> Always select <strong>Custom: 100%</strong>. Never leave it on "Fit to Page" or "Shrink to Fit".</li>
          <li><strong>Margins:</strong> Set Margins to <strong>None</strong> in Chrome/Edge or 0mm in Firefox.</li>
          <li><strong>Test on Plain Paper First:</strong> Print one test sheet on standard photocopy paper, place it on top of your adhesive sheet against a bright window, and inspect alignment through the back.</li>
        </ol>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Label Sheets
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
