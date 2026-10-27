'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Contrast } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRContrastCheckerPage() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const lum = (hex: string) => {
    const n = parseInt(hex.replace('#', ''), 16);
    const ch = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * ch((n >> 16) & 255) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255);
  };
  const ratio = useMemo(() => {
    const l1 = lum(fg);
    const l2 = lum(bg);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }, [fg, bg]);
  const verdict =
    ratio >= 4.5
      ? 'Safe to print'
      : ratio >= 3
        ? 'Marginal — test before printing'
        : 'Unsafe — likely to fail scans';
  const verdictColor =
    ratio >= 4.5 ? 'text-emerald-600' : ratio >= 3 ? 'text-amber-600' : 'text-red-600';
  const fix =
    ratio >= 4.5
      ? 'This pair has strong separation. Keep the quiet zone in the background colour and test-scan a printed proof.'
      : ratio >= 3
        ? 'Darken the foreground or lighten the background until the ratio reaches 4.5:1 or higher.'
        : 'Increase separation substantially — for example, use near-black on white, or a deep navy on a pale background.';

  const faqs = [
    {
      question: 'What contrast ratio should a QR code have?',
      answer:
        'Aim for 4.5:1 or higher between the foreground and background. That is the WCAG AA threshold for normal text and a sensible, conservative floor for QR codes, which a phone camera must turn into pure black and white in uneven light.',
    },
    {
      question: 'Can I use a coloured QR code instead of black on white?',
      answer:
        'Yes, as long as the luminance gap stays large. A dark brand colour on a white or very pale background usually passes. Two mid-tone colours, or a code over a photo or gradient, often fail even when they look distinct to the eye.',
    },
    {
      question: 'Do reversed QR codes, light on dark, scan reliably?',
      answer:
        'They can, but many scanners assume a dark code on a light background, so reversed codes need more testing across phones and lighting. Keep the ratio high and verify with printed proofs before committing to a run.',
    },
    {
      question: "Why does my code scan on my phone but not on someone else's?",
      answer:
        'Different cameras, lenses, and lighting change how much contrast the scanner actually sees. A marginal ratio around 3:1 may pass on a flagship phone in daylight and fail on an older phone indoors. Raising the ratio to 4.5:1 or more closes that gap.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Contrast Checker',
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
          { label: 'QR Contrast Checker', href: '/qr-contrast-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Contrast className="w-3.5 h-3.5" />
          <span>Scan-Safety Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Contrast Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enter a foreground and background colour and get the WCAG contrast ratio plus a
          plain-language verdict on whether the pair is safe to print as a QR code.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Pick your colours</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fg">Foreground (code) colour</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fg"
                    type="color"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="w-14 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bg">Background colour</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bg"
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="w-14 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Formula: ratio = (L1 + 0.05) / (L2 + 0.05), where L1 and L2 are the relative
              luminances of the lighter and darker colours. Relative luminance uses the WCAG sRGB
              linearisation: channel &le; 0.03928 divides by 12.92, otherwise ((channel + 0.055) /
              1.055)^2.4, weighted 0.2126 R + 0.7152 G + 0.0722 B.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-3">Preview</h2>
            <div
              className="rounded-xl border p-6 flex items-center justify-center"
              style={{ backgroundColor: bg }}
            >
              <div className="grid grid-cols-7 gap-1" aria-hidden="true">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{
                      backgroundColor: [
                        0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45,
                        46, 47, 48,
                      ].includes(i)
                        ? fg
                        : bg,
                      border: `1px solid ${fg}`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Stylised preview only — it shows how the two colours sit together, not a scannable
              code. Always test-scan the real exported code.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">WCAG Contrast Ratio</div>
              <div className="text-4xl font-extrabold text-primary">{ratio.toFixed(2)} : 1</div>
            </div>
            <p className={`font-semibold ${verdictColor}`}>{verdict}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{fix}</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Safe threshold used</span>
                <span className="font-semibold">4.5 : 1</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Marginal band</span>
                <span className="font-semibold">3.0 – 4.4 : 1</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Foreground luminance</span>
                <span className="font-semibold">{lum(fg).toFixed(3)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-contrast-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why QR Contrast Decides Whether a Code Scans
        </h2>
        <p className="text-base leading-relaxed">
          A QR reader does not see colours the way a person does. It converts the camera image to
          black and white, then decides which modules are dark and which are light. When the
          foreground and background are too close in brightness, that decision becomes guesswork,
          and the code fails even though it looks perfectly clear to the eye. That is why contrast,
          not taste, is the first thing to check on any branded QR code. A beautiful code that does
          not scan is not a design choice, it is a broken link printed on paper.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-contrast-checker-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">How the ratio works</h3>
        <p className="text-base leading-relaxed">
          The WCAG contrast formula compares the relative luminance of the two colours, which is a
          measure of how bright each colour appears after accounting for how human vision weights
          red, green, and blue. The result runs from 1:1, meaning identical colours, to 21:1 for
          pure black on pure white. For QR codes, treat 4.5:1 as your working floor. That number
          comes from the WCAG AA threshold for normal text, and it is a sensible, conservative bar
          for a pattern that a phone camera must binarise in uneven light. Between 3:1 and 4.5:1 a
          code may scan in good light on a good phone and fail everywhere else, so treat that band
          as a warning, not a pass. Below 3:1, expect failures.
        </p>
        <h3 className="text-xl font-semibold text-foreground">The traps designers fall into</h3>
        <p className="text-base leading-relaxed">
          The most common trap is a coloured code on a coloured background where both colours are
          mid-tone, such as teal on grey or red on green. Hue differences do not rescue a code when
          luminance is similar, and some colour-blind users and many camera sensors will see even
          less separation than you do. Another trap is placing a code over a photograph or gradient:
          the contrast varies across the code, so one corner passes while another fails. A third
          trap is reversed codes, light on dark. They can work, but many scanners assume a dark code
          on a light background, so reversed codes need extra testing on several phones and an even
          stronger ratio.
        </p>
        <h3 className="text-xl font-semibold text-foreground">A practical workflow</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Start from black on white, then introduce brand colour in the foreground only, keeping
            the background white or near-white.
          </li>
          <li>
            If you must colour the background, keep it very pale and keep the quiet zone the same
            pale colour.
          </li>
          <li>
            Check the ratio with this tool, then print a proof at final size and scan it on two
            different phones, in shade and in bright light.
          </li>
          <li>
            For outdoor codes, add margin above the 4.5:1 floor, because sun glare and fading eat
            contrast over time.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Contrast is cheap insurance. It costs nothing to darken a foreground by a few shades, and
          it can be the difference between a campaign that converts and a poster that quietly does
          nothing.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-contrast-checker-pre-related" format="horizontal-banner" />

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

      {/* Bottom AdSlot */}
      <AdSlot id="qr-contrast-checker-bottom" format="horizontal-banner" />
    </div>
  );
}
