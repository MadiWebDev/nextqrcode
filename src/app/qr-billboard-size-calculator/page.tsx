'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RectangleHorizontal } from 'lucide-react';

export default function QRBillboardSizeCalculatorPage() {
  const [distance, setDistance] = useState(30);
  const [speed, setSpeed] = useState(0);
  const [dwell, setDwell] = useState(5);
  const baseWidthM = distance / 10;
  const motionFactor = 1 + speed / 100;
  const recommendedM = baseWidthM * motionFactor;
  const recommendedCm = recommendedM * 100;
  const scanWindowS = speed > 0 ? distance / (speed / 3.6) : dwell;
  const enoughTime = dwell >= 3;

  const faqs = [
    {
      question: 'How big should a QR code be on a billboard?',
      answer:
        "At minimum, one tenth of the viewing distance: 30 metres of distance means a 3-metre code. Moving viewers need more, so use the calculator's motion adjustment and confirm with a full-size printed proof scanned from the real viewing spot.",
    },
    {
      question: 'Can drivers scan a billboard QR code?',
      answer:
        'They should not be expected to. Scanning while driving is dangerous and the viewing window is too short. Design billboard codes for passengers, pedestrians, and stopped traffic, and never make driver scanning part of the plan.',
    },
    {
      question: 'Does a longer URL change the billboard size?',
      answer:
        'Yes. A longer payload packs more modules into the code, so each module gets smaller and harder to resolve at distance. Keep billboard destinations short, ideally a short redirect you control, so the code stays coarse and scannable.',
    },
    {
      question: 'Why add a motion factor instead of just using 10:1?',
      answer:
        'The 10:1 ratio assumes a stationary viewer with time to aim. A moving viewer has less time to notice, raise the phone, and focus, so a larger code compensates. The factor used here is a stated planning rule of thumb, and a printed proof test is still essential.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Billboard QR Size Calculator',
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
          { label: 'Billboard QR Size Calculator', href: '/qr-billboard-size-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <RectangleHorizontal className="w-3.5 h-3.5" />
          <span>Large-Signage Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Billboard QR Size Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work out how large a QR code must be on a billboard or large sign so people can actually
          scan it from the real viewing distance, including an adjustment for moving viewers.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Viewing conditions</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="dist">Viewing distance (m)</Label>
                <Input
                  id="dist"
                  type="number"
                  min="1"
                  max="300"
                  step="1"
                  value={distance}
                  onChange={(e) => setDistance(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[distance]}
                min={1}
                max={150}
                step={1}
                onValueChange={([v]) => setDistance(v)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="speed">Viewer speed (km/h, 0 = standing still)</Label>
                <Input
                  id="speed"
                  type="number"
                  min="0"
                  max="130"
                  step="1"
                  value={speed}
                  onChange={(e) => setSpeed(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[speed]}
                min={0}
                max={130}
                step={1}
                onValueChange={([v]) => setSpeed(v)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="dwell">Time the code is comfortably visible (seconds)</Label>
                <Input
                  id="dwell"
                  type="number"
                  min="1"
                  max="60"
                  step="1"
                  value={dwell}
                  onChange={(e) => setDwell(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[dwell]}
                min={1}
                max={30}
                step={1}
                onValueChange={([v]) => setDwell(v)}
              />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula and assumptions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Base width = viewing distance ÷ 10 (the standard 10:1 distance-to-size ratio). Moving
              viewers get a motion adjustment: recommended width = base width × (1 + speed in km/h ÷
              100). That adjustment is a stated planning rule of thumb, not a measured optical law —
              it reflects that a moving viewer has less time to notice, aim, and focus. The dwell
              check treats 3 seconds as the minimum comfortable window to notice the code, open the
              camera, and scan.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Minimum QR width</div>
              <div className="text-4xl font-extrabold text-primary">
                {recommendedM >= 1
                  ? `${recommendedM.toFixed(2)} m`
                  : `${recommendedCm.toFixed(0)} cm`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Base 10:1 width:{' '}
                {baseWidthM >= 1
                  ? `${baseWidthM.toFixed(2)} m`
                  : `${(baseWidthM * 100).toFixed(0)} cm`}
                {speed > 0 ? ` · motion factor ×${motionFactor.toFixed(2)}` : ''}
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Viewing distance</span>
                <span className="font-semibold">{distance} m</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Viewer speed</span>
                <span className="font-semibold">{speed} km/h</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Visible window</span>
                <span className="font-semibold">{dwell} s</span>
              </div>
            </div>
            {!enoughTime && (
              <p className="text-xs text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                Warning: under 3 seconds is a very short window. Most people will not notice, aim,
                and scan in time. Prefer a pedestrian location, or pair the billboard with a short
                memorable URL.
              </p>
            )}
            {speed >= 60 && (
              <p className="text-xs text-red-700 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                Safety note: never design a QR code to be scanned by a driver. Target passengers,
                pedestrians, or stopped traffic only.
              </p>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Why Billboard QR Codes Fail So Often</h2>
        <p className="text-base leading-relaxed">
          A billboard QR code looks simple: print it big, people scan it. In practice most of them
          fail, because the viewing distance is far larger than anyone estimated, the viewer is
          moving, and the code is competing with traffic, glare, and a few seconds of attention. The
          physics is unforgiving. A phone camera needs the code to cover enough pixels on its
          sensor, and distance eats pixels fast. That is why a code that looks enormous on a proof
          can be a postage stamp from the pavement across the road.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Start from the 10:1 rule, then adjust for motion
        </h3>
        <p className="text-base leading-relaxed">
          The standard 10:1 distance-to-size ratio says the code width should be at least one tenth
          of the viewing distance. Thirty metres of distance means a three-metre code. That is the
          floor for a stationary viewer in good light. A moving viewer needs more, because they must
          notice the code, decide to scan it, raise the phone, and hold it steady while the angle
          changes. The calculator applies a motion factor that grows with speed, and treats it as a
          planning rule of thumb rather than a precise optical law. If the adjusted size does not
          fit the board, the honest answer is that the placement is wrong for a QR code, not that
          the code should be squeezed in anyway.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Dwell time is the hidden constraint
        </h3>
        <p className="text-base leading-relaxed">
          Scanning takes seconds, not instants. A pedestrian walking past a storefront has a
          generous window. A passenger in a car at highway speed may have two or three seconds of
          usable angle before the board is behind them. The calculator flags windows under three
          seconds as too short, and that is the point where many campaigns should switch strategy: a
          short memorable web address or a campaign name people can search later will outperform a
          code nobody has time to scan. Codes belong where people wait, walk slowly, or stand still
          — station platforms, queues, pedestrian streets, and building entrances.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Practical checklist for large signage
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Measure the real viewing distance from where people actually stand, not from the kerb
            nearest the board.
          </li>
          <li>
            Keep the code high-contrast, black on white, with a full quiet zone — no logos, no
            gradients, no background photos at this scale.
          </li>
          <li>
            Use a short destination URL so the code has fewer modules and each module stays larger.
          </li>
          <li>
            Test with a full-size printed proof, scanned from the real viewing position, in daylight
            and at dusk.
          </li>
          <li>
            Never aim a code at drivers. Design for passengers, pedestrians, and stopped traffic.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          A billboard code that respects distance, motion, and dwell time can work well. One that
          ignores them is an expensive decoration.
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
