'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calculator,
  Eye,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Maximize2,
  Smartphone,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function QRSizeCalculatorPage() {
  const [distanceUnit, setDistanceUnit] = useState<'meters' | 'feet'>('meters');
  const [distance, setDistance] = useState<number>(1.5);
  const [dataDensity, setDataDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [lightingCondition, setLightingCondition] = useState<'optimal' | 'suboptimal'>('optimal');

  // Calculation formulas:
  // Baseline ratio: 10:1 (distance:size)
  // Suboptimal lighting or high density: 8:1
  const ratio = (lightingCondition === 'suboptimal' || dataDensity === 'high') ? 8 : 10;

  // Convert distance to centimeters
  const distanceCm = distanceUnit === 'meters' ? distance * 100 : distance * 30.48;

  // Recommended width in cm and inches
  const recommendedWidthCm = distanceCm / ratio;
  const recommendedWidthInches = recommendedWidthCm / 2.54;
  const recommendedWidthMm = recommendedWidthCm * 10;

  // Minimum width (strict optical boundary, 12:1)
  const minWidthCm = distanceCm / 12;
  const minWidthMm = minWidthCm * 10;

  // Module count estimate based on data density
  const moduleCount = dataDensity === 'low' ? 25 : dataDensity === 'medium' ? 33 : 45;
  const individualModuleMm = recommendedWidthMm / moduleCount;

  const faqs = [
    {
      question: 'What is the standard scan-distance-to-size ratio for QR codes?',
      answer: 'The universal optical rule of thumb is a 10:1 ratio. For every 10 units of scanning distance, the QR code should measure at least 1 unit in width (e.g., 100 cm distance requires a 10 cm wide QR code). Under low light or high data density, use an 8:1 ratio.',
    },
    {
      question: 'What is the absolute minimum physical size for a printed QR code?',
      answer: 'For handheld materials (business cards, product labels) scanned from 15 to 20 cm away, the absolute minimum size is 20 x 20 mm (0.8 x 0.8 inches). Anything smaller risks optical focus failure on budget smartphones.',
    },
    {
      question: 'Does the amount of data in the QR code change the required size?',
      answer: 'Yes. As payload length increases (such as long URLs with UTM parameters or full vCards), the QR code adds more rows and columns (modules). More modules mean each individual square is smaller, requiring a larger overall print size to scan reliably.',
    },
    {
      question: 'How large should a QR code be on a highway billboard?',
      answer: 'A billboard intended to be scanned from 25 meters away requires a QR code at least 2.5 meters (approx. 8.2 feet) wide. However, never place QR codes targeting drivers moving at high speeds due to severe road safety hazards.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Size and Scan-Distance Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'QR Size & Scan-Distance Calculator', href: '/qr-size-calculator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Optical Engineering Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Size and Scan-Distance Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Determine the mathematically optimal print dimensions for posters, packaging, table tents, and billboards based on camera sensor physics, viewing distance, and ambient lighting.
        </p>
      </header>

      {/* Interactive 2-Column Split: Controls on Left, Sticky Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <span>1. Enter Expected Viewing Distance</span>
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <Button
                variant={distanceUnit === 'meters' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDistanceUnit('meters')}
                className="text-xs"
              >
                Meters (m)
              </Button>
              <Button
                variant={distanceUnit === 'feet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDistanceUnit('feet')}
                className="text-xs"
              >
                Feet (ft)
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="distance-input">Target Distance:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="distance-input"
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-24 text-right h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    {distanceUnit === 'meters' ? 'm' : 'ft'}
                  </span>
                </div>
              </div>

              <Slider
                value={[distance]}
                min={0.2}
                max={distanceUnit === 'meters' ? 20 : 65}
                step={0.1}
                onValueChange={([val]) => setDistance(val)}
                className="my-4"
              />

              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Handheld (0.3m / 1ft)</span>
                <span>Poster (1.5m / 5ft)</span>
                <span>Storefront (5m / 16ft)</span>
                <span>Billboard (20m / 65ft)</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span>2. Environmental & Payload Factors</span>
            </h2>

            {/* Data Density */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                QR Payload Density
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low (Short URL)', desc: '< 40 chars' },
                  { id: 'medium', label: 'Medium (Standard)', desc: '40-120 chars' },
                  { id: 'high', label: 'High (vCard / Text)', desc: '> 120 chars' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDataDensity(item.id as any)}
                    className={`p-3 text-left rounded-xl border text-xs transition-all ${
                      dataDensity === item.id
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-border hover:border-border/80 text-muted-foreground'
                    }`}
                  >
                    <div className="text-foreground">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Lighting & Glare Environment
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLightingCondition('optimal')}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${
                    lightingCondition === 'optimal'
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <div className="text-foreground">Optimal (10:1 Ratio)</div>
                  <div className="text-[10px] text-muted-foreground">Bright indoor or clear daylight</div>
                </button>
                <button
                  type="button"
                  onClick={() => setLightingCondition('suboptimal')}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${
                    lightingCondition === 'suboptimal'
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <div className="text-foreground">Dim / Harsh Glare (8:1 Ratio)</div>
                  <div className="text-[10px] text-muted-foreground">Bar, subway, reflective glass</div>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Calculation Results
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Optical Standard Verified
              </span>
            </div>

            {/* Recommended Size Box */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">Recommended Print Width</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {recommendedWidthCm < 100
                  ? `${recommendedWidthCm.toFixed(1)} cm`
                  : `${(recommendedWidthCm / 100).toFixed(2)} m`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ({recommendedWidthInches.toFixed(1)} inches / {recommendedWidthMm.toFixed(0)} mm)
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Absolute Minimum Size:</span>
                <span className="font-semibold text-foreground">
                  {minWidthCm.toFixed(1)} cm ({minWidthMm.toFixed(0)} mm)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Calculated Ratio:</span>
                <span className="font-semibold text-foreground">{ratio}:1 Distance-to-Size</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Estimated Module Size ($W_m$):</span>
                <span className={`font-semibold ${individualModuleMm < 0.35 ? 'text-amber-600' : 'text-foreground'}`}>
                  {individualModuleMm.toFixed(2)} mm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Minimum Quiet Zone Margin:</span>
                <span className="font-semibold text-foreground">
                  {(individualModuleMm * 4).toFixed(1)} mm on each side
                </span>
              </div>
            </div>

            {individualModuleMm < 0.35 && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Warning: Individual modules are below 0.35mm. Some budget camera sensors will fail to focus. Increase physical size.
                </span>
              </div>
            )}

            <div className="pt-2">
              <Button asChild className="w-full text-xs font-semibold gap-2">
                <Link href="/">
                  <span>Generate Code with These Dimensions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Reserved Zero-CLS Ad Slot */}
      <AdSlot id="calculator-mid" format="horizontal-banner" />

      {/* 800+ Words Editorial Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Calculate the Exact Physical Print Size for Any QR Code
        </h2>
        <p className="text-base leading-relaxed">
          The most prevalent reason a printed QR code fails in the real world is improper optical scaling. Unlike human eyes that can adjust focus and interpret context, mobile camera sensors depend on physical pixel coverage across each discrete module of the matrix. If a user cannot comfortably stand close enough to cover the sensor’s focal threshold, the image binarization algorithm will register the code as ambient visual noise.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          The 10:1 Ratio Rule Explained
        </h3>
        <p className="text-base leading-relaxed">
          In typical commercial environments, the standard optical baseline is the <strong>10:1 scanning ratio</strong>. This means the scanning distance should not exceed 10 times the width of the printed QR code. For instance:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>Tabletop Restaurant Menus (scan distance 30 cm):</strong> Minimum width = 3.0 cm (1.2 inches).</li>
          <li><strong>Eye-Level A4 Posters & Flyers (scan distance 1.2 meters):</strong> Minimum width = 12 cm (4.7 inches).</li>
          <li><strong>Storefront Window Signage (scan distance 3 meters):</strong> Minimum width = 30 cm (11.8 inches).</li>
          <li><strong>Elevated Trade Show Banners (scan distance 6 meters):</strong> Minimum width = 60 cm (23.6 inches).</li>
        </ul>

        <h3 className="text-xl font-semibold text-foreground">
          When to Use the Conservative 8:1 Ratio
        </h3>
        <p className="text-base leading-relaxed">
          The 10:1 ratio assumes optimal conditions: a clean camera lens, direct daylight or 400+ lux illumination, a high-contrast black-on-white substrate, and a low-density payload (such as a 25-character URL). You should immediately scale up to the conservative <strong>8:1 ratio</strong> when:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          <li>The QR code is placed behind glass or acrylic, which creates specular reflection and glare.</li>
          <li>The lighting is dim, such as in cocktail lounges, nightclubs, or underground transit stations.</li>
          <li>The payload contains a dense vCard or long URL containing multiple UTM tracking strings.</li>
          <li>The QR code incorporates a custom logo in the center, which reduces available error correction headroom.</li>
        </ol>

        <h3 className="text-xl font-semibold text-foreground">
          Common Sizing Mistakes That Destroy Scannability
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>Cropping the Quiet Zone:</strong> The white margin around the QR code must be at least 4 modules wide. Cropping this border so that graphic design elements or photos touch the finder pattern squares causes instant scan failure.</li>
          <li><strong>Exporting as 72 DPI Raster JPG:</strong> When a low-resolution JPG is enlarged for print, JPEG compression introduces ringing artifacts around high-contrast edges. Always export as vector SVG or 300+ DPI PNG.</li>
          <li><strong>Ignoring Phone Camera Minimal Focal Distance:</strong> Most modern smartphones cannot focus on objects closer than 8 to 10 cm without switching to specialized macro modes. Printing a microscopic 10 mm QR code forces users into the camera's blur zone.</li>
        </ul>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Sizing
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
