'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Square } from 'lucide-react';

export default function QRModuleSizeCalculatorPage() {
  const [version, setVersion] = useState(5);
  const [printSize, setPrintSize] = useState(40);
  const [includeQuiet, setIncludeQuiet] = useState(false);
  const [dpi, setDpi] = useState(300);
  const modules = 21 + 4 * (version - 1);
  const codeMm = includeQuiet ? printSize * (modules / (modules + 8)) : printSize;
  const moduleMm = codeMm / modules;
  const pxPerModule = (moduleMm / 25.4) * dpi;
  const status =
    moduleMm >= 0.5
      ? 'Comfortable'
      : moduleMm >= 0.35
        ? 'Acceptable — test on budget phones'
        : moduleMm >= 0.25
          ? 'Risky — below the 0.35 mm guideline'
          : 'Too small — enlarge the code or shorten the payload';

  const faqs = [
    {
      question: 'What is a QR module?',
      answer:
        'One square cell of the QR grid. A version-5 code has 37 × 37 modules. Module size is the printed width divided by the module count, and it is the smallest feature the camera must resolve.',
    },
    {
      question: 'Why is 0.35 mm the threshold?',
      answer:
        'It is a widely used print-planning guideline reflecting what typical phone cameras resolve at normal scanning distances. Below it, budget phones in dim light start to fail; above 0.5 mm, codes are comfortable for almost any phone.',
    },
    {
      question: 'Does higher DPI fix small modules?',
      answer:
        "No. DPI improves how sharply modules are printed, but it cannot make them physically larger. The camera's optics become the limit. Enlarge the print or shorten the payload instead.",
    },
    {
      question: 'My size includes the quiet zone — does that matter?',
      answer:
        'Yes. The quiet zone adds 8 modules of width, so the code itself is smaller than the total footprint. Tick the checkbox on this page and the calculator recovers the true code width before computing module size.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Module Size Calculator',
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
          { label: 'QR Module Size Calculator', href: '/qr-module-size-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Square className="w-3.5 h-3.5" />
          <span>Print Spec Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Module Size Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out the size of one QR module in millimetres from the version and print size, and see
          whether it clears the 0.35 mm safety threshold for reliable scanning.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Your code</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="mver">QR version (1–40)</Label>
                <Input
                  id="mver"
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
                Version {version} = {modules} × {modules} modules.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="msize">Printed width (mm)</Label>
                <Input
                  id="msize"
                  type="number"
                  min="5"
                  max="3000"
                  step="1"
                  value={printSize}
                  onChange={(e) => setPrintSize(Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[printSize]}
                min={10}
                max={300}
                step={1}
                onValueChange={([v]) => setPrintSize(v)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="qz"
                type="checkbox"
                checked={includeQuiet}
                onChange={(e) => setIncludeQuiet(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="qz" className="text-sm">
                My width includes the quiet zone (total footprint)
              </Label>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="mdpi">Print DPI (for pixels per module)</Label>
                <Input
                  id="mdpi"
                  type="number"
                  min="72"
                  max="1200"
                  step="1"
                  value={dpi}
                  onChange={(e) => setDpi(Math.max(72, parseInt(e.target.value) || 72))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[dpi]}
                min={72}
                max={600}
                step={1}
                onValueChange={([v]) => setDpi(v)}
              />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Module size = code width ÷ modules per side, where modules per side = 21 + 4 ×
              (version − 1). If the width you entered includes the quiet zone, the code width is
              recovered as total width × modules ÷ (modules + 8), since the quiet zone adds 4
              modules per side. Pixels per module = (module size in mm ÷ 25.4) × DPI. The 0.35 mm
              guideline is a widely used print-planning threshold: below it, budget phone cameras
              struggle to resolve modules.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Module size</div>
              <div className="text-4xl font-extrabold text-primary">{moduleMm.toFixed(3)} mm</div>
              <div className="text-xs text-muted-foreground mt-1">
                {pxPerModule.toFixed(1)} px per module at {dpi} DPI
              </div>
            </div>
            <p
              className={`font-semibold text-sm ${moduleMm < 0.35 ? 'text-amber-600' : 'text-emerald-600'}`}
            >
              {status}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Code width (excl. quiet zone)</span>
                <span className="font-semibold">{codeMm.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Modules per side</span>
                <span className="font-semibold">{modules}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">0.35 mm threshold</span>
                <span className="font-semibold">{moduleMm >= 0.35 ? 'Cleared' : 'Not met'}</span>
              </div>
            </div>
            {moduleMm < 0.35 && (
              <p className="text-xs text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                Below 0.35 mm, modules approach the resolution limit of budget phone cameras,
                especially in dim light. Enlarge the print, shorten the payload to drop the version,
                or both.
              </p>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Module Size: The Smallest Number That Matters
        </h2>
        <p className="text-base leading-relaxed">
          A QR code is a grid of modules, and the size of one module is the smallest physical
          feature the camera must resolve. Everything else about a printed code — its version, its
          print size, its quiet zone — funnels down to this one number. If modules are large, the
          code is forgiving: it scans in dim light, at an angle, on an average phone. If modules are
          tiny, the code becomes fragile, and no amount of contrast or careful design fully rescues
          it. The calculator gives you the module size for your version and print size, and flags
          the widely used 0.35 mm planning threshold.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Why 0.35 mm is the line</h3>
        <p className="text-base leading-relaxed">
          The 0.35 mm figure is a practical guideline from print production, not a law of physics.
          It reflects what typical phone cameras can resolve at a normal scanning distance, with
          ordinary lighting and a steady-enough hand. Above 0.5 mm, codes are comfortable for almost
          any phone. Between 0.35 and 0.5 mm, they work but deserve a test on a budget handset
          rather than only on a flagship. Below 0.35 mm, failures become common, especially in dim
          light, at an angle, or through glass. Below 0.25 mm, the code is effectively decorative.
          These bands are why two codes printed at the same size can behave so differently: the one
          with the longer payload has a higher version, more modules, and therefore smaller modules.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          The two fixes, and when to use each
        </h3>
        <p className="text-base leading-relaxed">
          If the module size is too small, you have exactly two levers. Enlarge the print: doubling
          the print size doubles the module size, and it is the right answer whenever space allows.
          Or shorten the payload: a shorter URL or a leaner contact record drops the version, which
          reduces the module count and enlarges every remaining module at the same print size. In
          practice the best answer is often a little of both — a modestly larger print and a shorter
          payload. What does not fix the problem is raising the DPI. A sharper print of tiny modules
          is still tiny modules; the camera&apos;s optics, not the printer, become the limit.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Watch the quiet-zone trap</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            If your stated size includes the quiet zone, the code itself is smaller than you think —
            tick the checkbox so the calculator corrects for it.
          </li>
          <li>
            On absorbent stock, ink spread eats into white modules, so effective module size shrinks
            further.
          </li>
          <li>On curved surfaces, edge modules foreshorten and behave as if they were smaller.</li>
          <li>
            Always test-scan the printed piece on an older phone, not just the newest one in the
            office.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Module size is a humble number, but it is the one that decides whether a code works in the
          hands of a real customer. Check it before you print, and let it settle every argument
          about size.
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
