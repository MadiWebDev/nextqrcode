'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RefreshCw } from 'lucide-react';

export default function QRCurvedSurfaceCalculatorPage() {
  const [diameter, setDiameter] = useState(66);
  const [maxAngle, setMaxAngle] = useState(45);
  const circumference = Math.PI * diameter;
  const maxWidth = (maxAngle / 360) * circumference;
  const flatWidth = 2 * (diameter / 2) * Math.sin((maxAngle * Math.PI) / 180 / 2);
  const verdict =
    maxAngle <= 45
      ? 'Conservative — good for most scanners'
      : maxAngle <= 60
        ? 'Workable — test carefully on several phones'
        : 'Risky — edge modules are heavily foreshortened';

  const faqs = [
    {
      question: 'Can QR codes go on curved bottles and cans?',
      answer:
        'Yes, if the code wraps only a small part of the circumference. As a planning rule, keep the wrap to 45° or less; 60° is an outer limit. Beyond that, edge modules are too foreshortened to read reliably.',
    },
    {
      question: 'What diameter is too small for a QR code?',
      answer:
        'It depends on the code size you need. A narrow container forces a small code, which may fall below the safe print size for its payload. Use the calculator, and if the maximum width is too small, shorten the payload or move the code to a flat label.',
    },
    {
      question: 'Does a short URL help on curved surfaces?',
      answer:
        'Yes, twice over. A shorter payload means a lower-version code with larger modules, and larger modules survive perspective distortion better than small ones. A short redirect is the best single move for curved packaging.',
    },
    {
      question: 'Why does my bottle code scan sometimes but not always?',
      answer:
        'Angle, lighting, and phone differences all change how much distortion the scanner must correct. A code near the wrap limit may decode when aligned perfectly and fail a few degrees off. Shrinking the code restores margin.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Curved Surface QR Calculator',
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
          { label: 'Curved Surface QR Calculator', href: '/qr-curved-surface-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Packaging Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Curved Surface QR Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Estimate the largest QR code that stays scannable on a bottle, can, or other cylinder,
          from the diameter and a safe wrap-angle limit.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Cylinder and limit</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="diam">Cylinder diameter (mm)</Label>
                <Input
                  id="diam"
                  type="number"
                  min="5"
                  max="1000"
                  step="1"
                  value={diameter}
                  onChange={(e) => setDiameter(Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[diameter]}
                min={10}
                max={300}
                step={1}
                onValueChange={([v]) => setDiameter(v)}
              />
              <p className="text-[11px] text-muted-foreground">
                A standard drinks can is about 66 mm across; a wine bottle is about 75–90 mm at its
                widest.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Maximum wrap angle
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setMaxAngle(a)}
                    className={`p-3 text-center rounded-xl border text-xs ${maxAngle === a ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {a}°
                    <span className="block text-[10px] text-muted-foreground">
                      {a === 30 ? 'Very safe' : a === 45 ? 'Recommended' : 'Outer limit'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula and assumptions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Circumference = π × diameter. Maximum code width along the curve = (wrap angle ÷ 360)
              × circumference. Flat-projected width = diameter × sin(wrap angle ÷ 2). The wrap-angle
              limits are stated planning rules: 45° is the recommended ceiling, 60° the outer limit,
              because modules near the edges are foreshortened and shaded as the surface curves away
              from the camera. These are guidance values, not a measured optical law — always test
              on the real container.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Maximum QR width on the curve</div>
              <div className="text-4xl font-extrabold text-primary">{maxWidth.toFixed(1)} mm</div>
              <div className="text-xs text-muted-foreground mt-1">
                Flat-projected width ≈ {flatWidth.toFixed(1)} mm · {maxAngle}° wrap
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Cylinder diameter</span>
                <span className="font-semibold">{diameter} mm</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Circumference</span>
                <span className="font-semibold">{circumference.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Verdict</span>
                <span className="font-semibold">{verdict}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Remember the quiet zone: the total footprint including the 4-module margin must fit
              within this width, not just the code itself.
            </p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          QR Codes on Bottles, Cans, and Other Curves
        </h2>
        <p className="text-base leading-relaxed">
          A QR code is designed to be flat. Wrapped around a cylinder, its outer modules tilt away
          from the camera, shrink in perspective, and fall into shadow, while the code&apos;s own
          geometry assumes a perfect square grid. A small code on a large bottle is barely affected.
          A large code on a narrow bottle is a different story: the edges wrap so far around the
          curve that the scanner sees a distorted trapezoid instead of a square. The calculator
          turns that intuition into a number by limiting how many degrees of the cylinder the code
          is allowed to wrap.
        </p>
        <h3 className="text-xl font-semibold text-foreground">The wrap-angle idea</h3>
        <p className="text-base leading-relaxed">
          Think of the code as an arc on the cylinder&apos;s circumference. A 45° wrap means the
          code spans an eighth of the way around the container — the edges tilt 22.5° from the
          centre line, which most scanners handle. At 60° the edges tilt 30°, and reliability starts
          to depend on the phone, the light, and the exact payload. Beyond that, the outer modules
          are so foreshortened that decoding becomes a lottery. These limits are planning rules of
          thumb, not guarantees, and they assume the code is viewed roughly face-on. If customers
          will scan from below, above, or at an angle — as they often do with bottles on a shelf —
          the effective distortion is worse, and a smaller code is the safe choice.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Design choices that help</h3>
        <p className="text-base leading-relaxed">
          Short payloads help twice over: they produce lower-version codes with larger modules, and
          larger modules survive foreshortening better. A short redirect URL is the single best move
          for a curved-surface code. High contrast matters more than usual, because the curved edges
          also catch glare and shadow; black on white beats any coloured treatment here. Keep the
          code away from shoulders, tapers, and seams where the curvature changes, and never let it
          cross a ridge or an embossed logo. On very small diameters, consider moving the code to a
          flat part of the packaging — a neck tag, a cap label, or a flat side panel — instead of
          fighting the curve.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing on the real container</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Print at final size, apply to the real container, and scan it while the container sits
            on a shelf at normal height.
          </li>
          <li>
            Test on several phones, including an older one, and in store lighting as well as
            daylight.
          </li>
          <li>
            Rotate the container a few degrees each way — customers will not align it perfectly.
          </li>
          <li>Test with condensation, since cold bottles fog and bead with water.</li>
          <li>
            If any test is flaky, shrink the code or move it to a flat area rather than hoping
            customers hold it better.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Curved surfaces reward restraint. A modest code that scans every time is worth far more
          than an ambitious one that scans sometimes.
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
