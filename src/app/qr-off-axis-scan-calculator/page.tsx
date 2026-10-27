'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Angle } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function Page() {
  const [width, setWidth] = useState('10');
  const [angle, setAngle] = useState(30);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = Number(width);
    const a = Number(angle);
    if (!Number.isFinite(w) || w <= 0)
      return {
        error: 'Enter a code width greater than 0.',
        w: 0,
        a: 0,
        effective: 0,
        recommended: 0,
        lost: 0,
        uplift: 0,
      };
    if (!Number.isFinite(a) || a < 0 || a > 80)
      return {
        error: 'Enter a viewing angle between 0 and 80 degrees.',
        w: 0,
        a: 0,
        effective: 0,
        recommended: 0,
        lost: 0,
        uplift: 0,
      };
    const rad = (a * Math.PI) / 180;
    const cos = Math.cos(rad);
    const effective = w * cos;
    const recommended = w / cos;
    const lost = (1 - cos) * 100;
    return { error: '', w, a, effective, recommended, lost, uplift: (1 / cos - 1) * 100 };
  }, [width, angle]);

  const copyResult = async () => {
    if (result.error) return;
    await navigator.clipboard.writeText(
      `At ${result.a} degrees off-axis, a ${result.w} cm code has an effective width of ${result.effective.toFixed(2)} cm (${result.lost.toFixed(1)}% lost). Recommended printed width: ${result.recommended.toFixed(2)} cm.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What angle should I enter?',
      answer:
        'The angle between the viewer\u2019s line of sight and a line straight out from the code. 0\u00b0 is head-on; a viewer standing well to the side might see the code at 45\u00b0 or more. Measure from where people actually stand.',
    },
    {
      question: 'Why does the height not change?',
      answer:
        'Tilting a flat code sideways squeezes its apparent width but leaves its apparent height the same. The squeeze is what distorts the grid and makes the code hard to read.',
    },
    {
      question: 'Does this apply to curved surfaces too?',
      answer:
        'No. Curved surfaces wrap the code, which is a different distortion. This tool covers flat codes viewed at an angle only.',
    },
    {
      question: 'What if the angle is beyond 60 degrees?',
      answer:
        'The tool still computes the numbers, but warns you: beyond 60\u00b0 the code is heavily foreshortened and many scanners will struggle. Reposition the sign or add a code facing the approach path.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Off-Axis Scan Calculator',
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
          { label: 'QR Off-Axis Scan Calculator', href: '/qr-off-axis-scan-calculator' },
        ]}
      />

      <AdSlot id="qr-off-axis-scan-calculator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Angle className="w-3.5 h-3.5" />
          <span>Signage QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Off-Axis Scan Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          See what an oblique viewing angle does to a QR code: enter the code width and the viewing
          angle, and get the effective width, the width lost, and the size uplift needed.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter your numbers</h2>
            <div className="space-y-2">
              <Label htmlFor="width">Printed code width (cm)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="10"
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label>Viewing angle from head-on: {angle}&deg;</Label>
              <Slider
                value={[angle]}
                min={0}
                max={80}
                step={1}
                onValueChange={([v]) => setAngle(v)}
              />
              <p className="text-xs text-muted-foreground">
                0&deg; is straight in front of the code. 80&deg; is almost side-on.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Effective width = printed width × cos(angle). Recommended width = printed width /
              cos(angle). Width lost = (1 − cos(angle)) × 100%. The cosine rule is pure geometry: a
              flat code seen at an angle presents a narrower width to the viewer.
            </p>
            {result.error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {result.error}
              </p>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Result</h2>
            {!result.error && (
              <>
                <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <div className="text-xs text-muted-foreground">
                    Effective width at {result.a}&deg;
                  </div>
                  <div className="text-4xl font-extrabold text-primary">
                    {result.effective.toFixed(2)} cm
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {result.lost.toFixed(1)}% of the printed width lost
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Printed width</span>
                    <span className="font-semibold">{result.w} cm</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Recommended printed width</span>
                    <span className="font-semibold">{result.recommended.toFixed(2)} cm</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Size uplift needed</span>
                    <span className="font-semibold">+{result.uplift.toFixed(1)}%</span>
                  </div>
                </div>
                {result.a > 60 && (
                  <p
                    className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed"
                    role="alert"
                  >
                    Beyond 60&deg;, the code is heavily foreshortened and many scanners will
                    struggle even at the uplifted size. Move the sign or add a second code facing
                    the approach path if you can.
                  </p>
                )}
              </>
            )}
            <Button variant="outline" size="sm" onClick={copyResult} disabled={!!result.error}>
              {copied ? 'Copied!' : 'Copy result'}
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-off-axis-scan-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the QR Off-Axis Scan Calculator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this calculator works</h3>
        <p className="text-base leading-relaxed">
          A flat code seen from an angle presents a narrower width to the viewer: the width the
          scanner sees is the printed width times the cosine of the viewing angle. The recommended
          width reverses that: dividing by the cosine gives the printed size that presents the width
          you originally planned. The height is unchanged, so the code appears squeezed, which is
          exactly what makes angled codes hard to scan.
        </p>

        <AdSlot id="qr-off-axis-scan-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Where off-axis viewing happens</h3>
        <p className="text-base leading-relaxed">
          Signage on walls beside a walking route, codes on pillars, and posters at the end of a
          corridor are all read at an angle. The angle that matters is the one from the viewer’s
          actual position, not from directly in front of the sign — measure it where people really
          stand.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Fixing an angled code</h3>
        <p className="text-base leading-relaxed">
          The honest fixes are a bigger code, a better position, or a second code facing the
          approach path. Uplifting the size helps up to a point, but beyond about 60 degrees the
          foreshortening is so severe that repositioning beats enlarging. Test at the real angle
          with an ordinary phone before committing to a large print.
        </p>
      </article>

      <AdSlot id="qr-off-axis-scan-calculator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-off-axis-scan-calculator-bottom" format="horizontal-banner" />

    </div>
  );
}
