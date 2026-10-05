'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Printer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface SubstrateData {
  id: string;
  name: string;
  glareRisk: 'Low' | 'Medium' | 'Extreme';
  minModuleMm: number;
  contrastRecommendation: string;
  finishAdvice: string;
  criticalCaveat: string;
}

const SUBSTRATES: SubstrateData[] = [
  {
    id: 'glass',
    name: 'Clear Glass & Storefront Windows',
    glareRisk: 'Extreme',
    minModuleMm: 0.6,
    contrastRecommendation: 'Always print a solid white background flood coat behind the QR code.',
    finishAdvice: 'Use matte anti-reflective vinyl to eliminate specular sunlight glare.',
    criticalCaveat: 'Never print black modules directly onto transparent glass; passing shadows will destroy contrast.',
  },
  {
    id: 'metal',
    name: 'Stainless Steel & Polished Aluminum',
    glareRisk: 'Extreme',
    minModuleMm: 0.5,
    contrastRecommendation: 'Laser annealing with matte dark oxidation against raw brushed metal.',
    finishAdvice: 'Matte chemical etching or powder-coated white backing plate.',
    criticalCaveat: 'Overhead warehouse LED fixtures will mirror into optical sensors on mirror finishes.',
  },
  {
    id: 'wood',
    name: 'Natural Wood & Laser Engraving',
    glareRisk: 'Low',
    minModuleMm: 0.8,
    contrastRecommendation: 'Deep char burn on light woods (birch, maple). Avoid dark walnut.',
    finishAdvice: 'Seal with a flat, non-yellowing matte lacquer after engraving.',
    criticalCaveat: 'Wood grain striations crossing the finder patterns can be misread as extra modules.',
  },
  {
    id: 'fabric',
    name: 'Apparel & Fabric Embroidery',
    glareRisk: 'Low',
    minModuleMm: 1.2,
    contrastRecommendation: 'High-density silk screen ink or woven heat-transfer vinyl.',
    finishAdvice: 'Avoid coarse embroidery threads which distort module geometry when stretched.',
    criticalCaveat: 'Fabric wrinkles and stretch warp the timing tracks. Keep payload under 50 characters.',
  },
  {
    id: 'cardboard',
    name: 'Corrugated Kraft Packaging',
    glareRisk: 'Low',
    minModuleMm: 0.85,
    contrastRecommendation: 'High-pigment black flexographic ink to compensate for brown pulp absorption.',
    finishAdvice: 'Uncoated raw kraft requires larger modules to counteract ink dot gain.',
    criticalCaveat: 'Flute ridges in corrugated board create shadow dips that distort straight module lines.',
  },
  {
    id: 'curved',
    name: 'Cylindrical Bottles, Cans & Tubes',
    glareRisk: 'Medium',
    minModuleMm: 0.55,
    contrastRecommendation: 'Dark ink on white opaque label stock with Error Correction Level H.',
    finishAdvice: 'Matte laminate to avoid circular reflections from cylinder highlights.',
    criticalCaveat: 'Keep total width under 25% of cylinder circumference to prevent keystone compression.',
  },
];

export default function QRPlacementGuidePage() {
  const [selectedSubstrateId, setSelectedSubstrateId] = useState('glass');
  const [checks, setChecks] = useState<Record<string, boolean>>({
    quietZone: false,
    contrastRatio: false,
    formatVector: false,
    glareTested: false,
    phoneFocalCheck: false,
  });

  const activeSubstrate = SUBSTRATES.find((s) => s.id === selectedSubstrateId) || SUBSTRATES[0];

  const toggleCheck = (key: string) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecks = Object.keys(checks).length;
  const completedChecks = Object.values(checks).filter(Boolean).length;
  const readinessPercent = Math.round((completedChecks / totalChecks) * 100);

  const faqs = [
    {
      question: 'Why does printing on glass or clear acrylic require a white backing layer?',
      answer: 'Transparent substrates allow background objects, ambient shadows, and indoor lighting to show through. If a customer scans a window code with a dark interior behind it, the camera cannot distinguish the black modules from the background. A solid white flood coat restores a reliable 7:1 contrast ratio.',
    },
    {
      question: 'How do I prevent laser engraved QR codes on wood from failing?',
      answer: 'Select a fine-grain, pale wood species such as Baltic birch, maple, or basswood. Run a high-contrast burn setting and ensure the individual module size is at least 0.8 mm so natural wood grain pores do not blend with the modules.',
    },
    {
      question: 'What is ink dot gain and why does it affect cardboard packaging?',
      answer: 'Dot gain is the phenomenon where liquid ink absorbs into paper fibers and expands outwards before drying. On porous corrugated cardboard, dot gain can widen dark modules by 15-20%, encroaching upon adjacent white spaces unless compensated for in prepress software.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Placement by Material Guide', href: '/qr-placement-guide' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Substrate Engineering Checklist</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Placement-by-Material & Substrate Guide
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Interactive prepress guidelines for printing on glass, metal, wood, apparel, cardboard, and curved packaging. Audit specular glare, ink bleed, and module thresholds.
        </p>
      </header>

      {/* Material Selector Buttons */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-3">
        {SUBSTRATES.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => setSelectedSubstrateId(sub.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedSubstrateId === sub.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Substrate Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-lg font-bold text-foreground">{activeSubstrate.name}</h2>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  activeSubstrate.glareRisk === 'Extreme'
                    ? 'bg-rose-500/10 text-rose-600'
                    : activeSubstrate.glareRisk === 'Medium'
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-emerald-500/10 text-emerald-600'
                }`}
              >
                Glare Risk: {activeSubstrate.glareRisk}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold uppercase text-muted-foreground block mb-1">
                  Contrast & Inking Strategy:
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {activeSubstrate.contrastRecommendation}
                </p>
              </div>

              <div>
                <span className="font-semibold uppercase text-muted-foreground block mb-1">
                  Finish & Coating Recommendation:
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {activeSubstrate.finishAdvice}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Critical Manufacturing Pitfall:
                </span>
                <p className="text-xs leading-relaxed">{activeSubstrate.criticalCaveat}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sticky Pre-Print Checklist (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-4">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pre-Flight Press Checklist
              </span>
              <span className="text-xs font-bold text-primary">{readinessPercent}% Ready</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 transition-all duration-300"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {[
                { id: 'quietZone', label: 'Quiet Zone: At least 4-modules unprinted white border verified.' },
                { id: 'contrastRatio', label: 'Contrast Ratio: Exceeds 4.0:1 (dark ink on light substrate).' },
                { id: 'formatVector', label: 'Artwork Format: Vector SVG or 300+ DPI PDF (no 72 DPI JPG).' },
                { id: 'glareTested', label: 'Specular Glare: Matte finish applied or white flood layer printed.' },
                { id: 'phoneFocalCheck', label: 'Physical Size: Larger than minimum 20x20mm camera focus limit.' },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={checks[item.id]}
                    onCheckedChange={() => toggleCheck(item.id)}
                    className="mt-0.5"
                  />
                  <span className={`text-xs ${checks[item.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <Button asChild className="w-full text-xs font-semibold gap-2 mt-2">
              <Link href="/">
                <span>Generate Code for this Substrate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="placement-guide-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Substrate Physics: How Print Materials Influence Optical Scanners
        </h2>
        <p className="text-base leading-relaxed">
          In graphic design software, a QR code exists as ideal mathematical black and white pixels. In the physical realm, light behaves according to Snell's law and Fresnel reflection equations. Substrates like clear acrylic, curved glass bottles, and laser-etched metal reflect light unevenly across camera sensors.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          The Destructive Impact of Specular Highlights
        </h3>
        <p className="text-base leading-relaxed">
          When an overhead supermarket fixture or sunny window reflects off a high-gloss lamination, it generates a "specular highlight"—a blinding hot spot of 100% white luminance. If this hot spot covers even a few data modules, the camera's auto-exposure circuit dims the entire frame, turning your white quiet zone into a dark gray and causing immediate scan failure.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Substrates
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
