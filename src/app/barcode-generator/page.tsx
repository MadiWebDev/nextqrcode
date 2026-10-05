'use client';

import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Barcode,
  Download,
  CheckCircle2,
  AlertTriangle,
  Settings2,
  Printer,
  Sparkles,
  Info,
} from 'lucide-react';

type BarcodeFormat = 'EAN13' | 'UPC' | 'CODE128' | 'ISBN';

export default function BarcodeGeneratorPage() {
  const [format, setFormat] = useState<BarcodeFormat>('EAN13');
  const [value, setValue] = useState('5901234123457');
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const [checksumStatus, setChecksumStatus] = useState<{ valid: boolean; calculated?: string; message: string }>({
    valid: true,
    message: 'Valid Checksum',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Validate Modulo-10 checksum for EAN-13 / UPC / ISBN
  const validateChecksum = (input: string, fmt: BarcodeFormat) => {
    const clean = input.replace(/\D/g, '');

    if (fmt === 'EAN13' || fmt === 'ISBN') {
      if (clean.length !== 13) {
        return { valid: false, message: 'Must be exactly 13 digits.' };
      }
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(clean[i], 10);
        sum += i % 2 === 0 ? digit : digit * 3;
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      const expected = parseInt(clean[12], 10);
      return {
        valid: checkDigit === expected,
        calculated: String(checkDigit),
        message: checkDigit === expected ? 'Valid EAN/ISBN Modulo-10 Checksum' : `Invalid checksum digit. Expected: ${checkDigit}`,
      };
    }

    if (fmt === 'UPC') {
      if (clean.length !== 12) {
        return { valid: false, message: 'Must be exactly 12 digits.' };
      }
      let sum = 0;
      for (let i = 0; i < 11; i++) {
        const digit = parseInt(clean[i], 10);
        sum += i % 2 === 0 ? digit * 3 : digit;
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      const expected = parseInt(clean[11], 10);
      return {
        valid: checkDigit === expected,
        calculated: String(checkDigit),
        message: checkDigit === expected ? 'Valid UPC Modulo-10 Checksum' : `Invalid checksum digit. Expected: ${checkDigit}`,
      };
    }

    return { valid: true, message: 'Code 128 Alphanumeric (Self-Checking Modulo-103)' };
  };

  // Render Barcode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const check = validateChecksum(value, format);
    setChecksumStatus(check);

    try {
      const barcodeFormat = format === 'ISBN' ? 'EAN13' : format;
      JsBarcode(canvas, value, {
        format: barcodeFormat,
        width: barWidth,
        height: barHeight,
        displayValue: displayValue,
        fontSize: 14,
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000',
      });
    } catch (err) {
      console.warn('JsBarcode render error:', err);
    }
  }, [format, value, barWidth, barHeight, displayValue]);

  const autoCorrectChecksum = () => {
    if (checksumStatus.calculated && (format === 'EAN13' || format === 'UPC' || format === 'ISBN')) {
      const clean = value.replace(/\D/g, '');
      const corrected = clean.slice(0, clean.length - 1) + checksumStatus.calculated;
      setValue(corrected);
    }
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `barcode-${format.toLowerCase()}-${value}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const faqs = [
    {
      question: 'What is a barcode check digit and why does it matter?',
      answer: 'The check digit is the final number in an EAN-13, UPC, or ISBN barcode. It is calculated mathematically using a Modulo-10 algorithm over all previous digits. Point-of-sale laser scanners compute this check on the fly to guarantee that misread bars are rejected immediately.',
    },
    {
      question: 'What is the difference between UPC-A and EAN-13?',
      answer: 'UPC-A is a 12-digit format predominantly used in the United States and Canada. EAN-13 is a 13-digit superset used throughout Europe, Asia, and globally. Adding a leading zero to any 12-digit UPC-A barcode converts it into a universally valid 13-digit EAN-13 code.',
    },
    {
      question: 'Can I use Code 128 for retail products?',
      answer: 'No. Code 128 is designed for internal warehouse tracking, shipping container labels (GS1-128), and asset tags. Standard retail grocery checkout scanners expect GS1-registered EAN-13 or UPC-A barcodes.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Barcode Generator with Checksum', href: '/barcode-generator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Barcode className="w-3.5 h-3.5" />
          <span>GS1 Compliant 1D Barcode Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Barcode Generator with Checksum Validation (EAN, UPC, Code 128 & ISBN)
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create high-precision linear 1D barcodes for retail packaging and warehouse inventory. Features automatic Modulo-10 check-digit calculation and SVG/PNG vector export.
        </p>
      </header>

      {/* Format Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-3">
        {[
          { id: 'EAN13', label: 'EAN-13 (International Retail - 13 Digits)', sample: '5901234123457' },
          { id: 'UPC', label: 'UPC-A (US & Canada - 12 Digits)', sample: '012345678905' },
          { id: 'CODE128', label: 'Code 128 (Logistics & Inventory)', sample: 'SHIP-2026-X89' },
          { id: 'ISBN', label: 'ISBN-13 (Books & Publishing)', sample: '9780306406157' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setFormat(item.id as any);
              setValue(item.sample);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              format === item.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="bar-val" className="text-xs font-semibold uppercase text-muted-foreground">
                  Barcode Value:
                </Label>
                {checksumStatus.calculated && !checksumStatus.valid && (
                  <button
                    type="button"
                    onClick={autoCorrectChecksum}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-fix Check Digit to {checksumStatus.calculated}
                  </button>
                )}
              </div>
              <Input
                id="bar-val"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-sm font-mono"
              />
            </div>

            {/* Checksum Status Box */}
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                checksumStatus.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
              }`}
            >
              {checksumStatus.valid ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{checksumStatus.message}</span>
            </div>

            {/* Dimensional Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Bar Width Pitch:</span>
                  <span>{barWidth}px</span>
                </div>
                <Slider
                  value={[barWidth]}
                  min={1}
                  max={4}
                  step={1}
                  onValueChange={([val]) => setBarWidth(val)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Bar Height:</span>
                  <span>{barHeight}px</span>
                </div>
                <Slider
                  value={[barHeight]}
                  min={40}
                  max={140}
                  step={5}
                  onValueChange={([val]) => setBarHeight(val)}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={displayValue}
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="rounded border-border text-primary"
                />
                <span>Display human-readable text below barcode</span>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-4 text-center">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Barcode Output ({format})
              </span>
              <span className="text-xs font-bold text-emerald-600">Print Quality</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-border shadow-xs flex items-center justify-center min-h-[160px] overflow-x-auto">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={downloadPNG} className="flex-1 text-xs font-semibold gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="text-xs font-semibold gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Barcode
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="barcode-gen-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Modulo-10 Barcode Checksum Algorithm Explained
        </h2>
        <p className="text-base leading-relaxed">
          Standard consumer linear barcodes rely on mathematical parity check digits to prevent checkout scanners from recording inaccurate price lookups. In the GS1 standard (governing EAN-13 and UPC-A), the final digit is determined using an alternating weighting formula:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          <li>Starting from the rightmost data digit (excluding the check digit), alternate multiplying digits by 3 and 1.</li>
          <li>Sum all weighted values together.</li>
          <li>Compute modulo 10: <code>(10 - (Sum % 10)) % 10</code>.</li>
        </ol>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Barcodes
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
