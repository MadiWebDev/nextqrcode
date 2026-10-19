'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Monitor } from 'lucide-react';

export default function QRDPICalculatorPage() {
  const [sizeMm, setSizeMm] = useState(50);
  const [dpi, setDpi] = useState(300);
  const [version, setVersion] = useState(5);
  const sizeIn = sizeMm / 25.4;
  const px = Math.round(sizeIn * dpi);
  const modules = 21 + 4 * (version - 1);
  const pxPerModule = px / modules;
  const verdict =
    dpi >= 300 && pxPerModule >= 4
      ? 'Print-ready'
      : dpi >= 150
        ? 'Acceptable for large sizes only'
        : 'Too low — expect blurry modules';

  const faqs = [
    {
      question: 'What DPI should a printed QR code be?',
      answer:
        '300 DPI is the standard planning target for print. Use 600 DPI for very small codes, engraving, or embossing. Vector SVG is even better because it has no DPI limit at all and stays sharp at any size.',
    },
    {
      question: 'Can I just enlarge a small PNG for print?',
      answer:
        'No. Upscaling a small PNG stretches the existing pixels and softens module edges, which is one of the most common causes of print failures. Export at the pixel size the calculator gives, or use SVG.',
    },
    {
      question: 'Why is JPEG bad for QR codes?',
      answer:
        'JPEG compression is designed for photographs and smears hard edges. On a QR code it adds ringing and blur around every module boundary, which can flip modules near the threshold. Use PNG or SVG for codes.',
    },
    {
      question: 'How many pixels per module do I need?',
      answer:
        'Aim for at least 4 pixels per module at the final printed size, and more for small codes or absorbent paper where ink spread softens edges. The calculator shows your exact figure for the version and size you enter.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR DPI Calculator',
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
          { label: 'QR DPI Calculator', href: '/qr-dpi-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Monitor className="w-3.5 h-3.5" />
          <span>Print Export Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR DPI Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out the pixel dimensions a QR code needs at your target print size and DPI, and get
          export guidance so the printed code stays sharp instead of soft and blobby.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Print target</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="dsize">Print width (mm)</Label>
                <Input
                  id="dsize"
                  type="number"
                  min="5"
                  max="3000"
                  step="1"
                  value={sizeMm}
                  onChange={(e) => setSizeMm(Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[sizeMm]}
                min={10}
                max={500}
                step={1}
                onValueChange={([v]) => setSizeMm(v)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Output resolution (DPI)
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[72, 150, 300, 600].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDpi(d)}
                    className={`p-3 text-center rounded-xl border text-xs ${dpi === d ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {d} DPI
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="dver">QR version</Label>
                <Input
                  id="dver"
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
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pixels = (print width in mm ÷ 25.4) × DPI. Pixels per module = total pixels ÷ modules
              per side, where modules per side = 21 + 4 × (version − 1). As a rule of thumb, aim for
              at least 4 pixels per module at final print size; below that, edges soften and small
              modules can merge. Vector SVG has no DPI limit and is the safest export for print
              whenever your workflow accepts it.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Required pixel dimensions</div>
              <div className="text-4xl font-extrabold text-primary">
                {px} × {px} px
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                at {dpi} DPI · {sizeMm} mm ({sizeIn.toFixed(2)} in) wide
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Pixels per module</span>
                <span className="font-semibold">{pxPerModule.toFixed(1)} px</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Modules per side</span>
                <span className="font-semibold">{modules}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Verdict</span>
                <span className="font-semibold">{verdict}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              For print, export SVG when possible. If you must use PNG, export at the exact pixel
              size shown here or larger — never upscale a small PNG afterwards.
            </p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          DPI, Pixels, and Why QR Codes Go Soft in Print
        </h2>
        <p className="text-base leading-relaxed">
          A QR code is a grid of hard-edged squares, which makes it unusually unforgiving of low
          resolution. A photograph can survive being a little soft; a QR code cannot, because soft
          edges shift the boundary between dark and light modules and the scanner starts guessing.
          The most common cause is exporting a small PNG — often 72 DPI screen resolution — and then
          scaling it up in a layout program. The pixels stretch, the edges blur, and a code that
          scanned perfectly on screen fails on paper. The fix is to decide the print size and DPI
          first, then export pixels to match.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          What DPI actually means for a QR code
        </h3>
        <p className="text-base leading-relaxed">
          DPI, dots per inch, says how many printer dots cover one inch of paper. A 50 mm code at
          300 DPI needs about 591 × 591 pixels. At 72 DPI the same code is only about 142 × 142
          pixels, so each module of a version-5 code is covered by roughly four pixels — barely
          enough to hold a clean edge, and not enough once ink spreads on uncoated stock. Higher DPI
          is not automatically better either: 600 DPI doubles the file size and rarely improves
          scanning on ordinary paper, but it is worth it for very small codes, fine substrates, or
          engraving and embossing where edge precision matters.
        </p>
        <h3 className="text-xl font-semibold text-foreground">The hierarchy of safe exports</h3>
        <p className="text-base leading-relaxed">
          Vector SVG is the safest choice for print, because it describes the squares mathematically
          and renders sharply at any size. If your printer or layout tool needs a raster file,
          export PNG at the exact pixel dimensions the calculator gives, at 300 DPI or above, and
          place it at 100% scale — do not resize it in the layout. JPEG is the worst option for QR
          codes: its compression smears high-contrast edges and adds ringing around every module
          boundary. If a JPEG is unavoidable, use the highest quality setting and never re-save it
          repeatedly.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Production checklist</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Confirm the final printed size before exporting, including whether the stated size
            covers the quiet zone.
          </li>
          <li>
            Export SVG for print whenever the workflow allows it; otherwise PNG at 300 DPI or more.
          </li>
          <li>
            Keep at least 4 pixels per module at final size, and more for small codes or absorbent
            paper.
          </li>
          <li>
            Turn off any automatic image sharpening, resampling, or compression in the layout tool.
          </li>
          <li>
            Print a proof at final size on the real substrate and scan it before the full run.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Resolution is a one-way street: you can always downscale a sharp export, but you can never
          recover sharpness from a blurry one. Export generously, then let the printer do its job.
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
