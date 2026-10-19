'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScanLine } from 'lucide-react';

export default function QRMinimumSizeCheckerPage() {
  const [planned, setPlanned] = useState(40);
  const [distance, setDistance] = useState(1);
  const [device, setDevice] = useState('average');
  const [lighting, setLighting] = useState('good');
  const ratio = lighting === 'poor' ? 8 : device === 'old' ? 9 : 10;
  const requiredMm = (distance * 1000) / ratio;
  const marginPct = ((planned - requiredMm) / requiredMm) * 100;
  const pass = planned >= requiredMm;
  const minModuleNote =
    'At the required size, a version-5 code (37 modules) has modules of about ' +
    (requiredMm / 37).toFixed(2) +
    ' mm.';

  const faqs = [
    {
      question: 'What is the 10:1 rule for QR codes?',
      answer:
        'The code width should be at least one tenth of the scanning distance: 1 metre of distance needs a 100 mm code. It is the standard optical rule of thumb, tightened to 9:1 for older phones and 8:1 for dim light or glare in this checker.',
    },
    {
      question: 'My code passes the size check but still fails — why?',
      answer:
        'Size is necessary, not sufficient. Contrast, a cropped quiet zone, a dense payload, glare, or a damaged print can each fail a correctly sized code. Check contrast, margin, and a printed proof as well.',
    },
    {
      question: 'Should I design for flagship phones or budget phones?',
      answer:
        'Budget phones. Your audience carries a mix, and a code that only works on a flagship silently excludes a large share of scanners. The checker applies a stricter ratio when older or budget phones are expected.',
    },
    {
      question: 'Does moving the code closer really help?',
      answer:
        'Yes — distance is the dominant factor. A code at eye level on the door, scanned from under a metre, can be far smaller than the same code placed high on a window and scanned from three metres away.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Minimum Size Checker',
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
          { label: 'QR Minimum Size Checker', href: '/qr-minimum-size-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ScanLine className="w-3.5 h-3.5" />
          <span>Go / No-Go Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Minimum Size Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Check whether a planned QR size is safe for its scan distance, device class, and lighting
          — with the required size and the margin you have.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Your plan</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="planned">Planned QR width (mm)</Label>
                <Input
                  id="planned"
                  type="number"
                  min="5"
                  max="5000"
                  step="1"
                  value={planned}
                  onChange={(e) => setPlanned(Math.max(5, parseFloat(e.target.value) || 5))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[planned]}
                min={10}
                max={300}
                step={1}
                onValueChange={([v]) => setPlanned(v)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="cdist">Expected scan distance (m)</Label>
                <Input
                  id="cdist"
                  type="number"
                  min="0.1"
                  max="200"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[distance]}
                min={0.2}
                max={20}
                step={0.1}
                onValueChange={([v]) => setDistance(v)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Device class
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['flagship', 'Flagship phone'],
                  ['average', 'Average phone'],
                  ['old', 'Older / budget phone'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setDevice(k)}
                    className={`p-3 text-center rounded-xl border text-xs ${device === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Lighting
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['good', 'Bright / good'],
                  ['mixed', 'Mixed'],
                  ['poor', 'Dim / glare'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setLighting(k)}
                    className={`p-3 text-center rounded-xl border text-xs ${lighting === k ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula and assumptions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Required width = scan distance ÷ ratio, with the ratio set by conditions: 10:1 for
              good light on an average or better phone, 9:1 when the audience includes older or
              budget phones, and 8:1 for dim light or glare. These ratios are stated planning rules
              built on the standard 10:1 optical rule of thumb. The check compares your planned
              width against the required width and reports the margin; a positive margin means the
              plan passes with room to spare.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Verdict
            </span>
            <div
              className={`text-center rounded-xl border p-4 ${pass ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}
            >
              <div className="text-3xl font-extrabold">
                {pass ? '✓ Safe to print' : '✕ Too small'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Required: {requiredMm.toFixed(1)} mm · Planned: {planned} mm · Margin:{' '}
                {marginPct >= 0 ? '+' : ''}
                {marginPct.toFixed(0)}%
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Ratio applied</span>
                <span className="font-semibold">{ratio}:1 distance-to-size</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Scan distance</span>
                <span className="font-semibold">{distance} m</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Conditions</span>
                <span className="font-semibold">
                  {device}, {lighting} lighting
                </span>
              </div>
            </div>
            {!pass && (
              <p className="text-xs text-red-700 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                Enlarge the code to at least {Math.ceil(requiredMm)} mm, shorten the payload so the
                modules grow, or move the code closer to where people stand.
              </p>
            )}
            <p className="text-xs text-muted-foreground">{minModuleNote}</p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">A Go / No-Go Check Before You Print</h2>
        <p className="text-base leading-relaxed">
          Most QR failures are decided before the file ever reaches the printer, in the moment
          someone chooses a size that looks right on screen. On a laptop, a 25 mm code looks
          generous. On a poster viewed from three metres away, the same code is a speck. The checker
          on this page turns that judgement into arithmetic: given the distance people will actually
          scan from, the phones they will use, and the light they will stand in, it tells you the
          minimum width that stands a chance, and whether your planned size clears it. It is a go /
          no-go gate, and it belongs before artwork approval, not after.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Distance is the dominant factor</h3>
        <p className="text-base leading-relaxed">
          The rule is the standard 10:1 distance-to-size ratio: the code should be at least a tenth
          as wide as the distance from which it will be scanned. A code on a table tent scanned from
          40 cm needs 40 mm. A code on a window scanned from 3 metres needs 300 mm. The ratio
          tightens when conditions worsen — 9:1 when the audience includes older or budget phones
          with weaker cameras, and 8:1 in dim light or glare. Those adjustments are planning rules,
          not laboratory measurements, and they exist because the real world is rarely the best
          case. The most common sizing error is measuring the distance from the nearest kerb instead
          of from where people actually stand, so measure the real viewing position.
        </p>
        <h3 className="text-xl font-semibold text-foreground">What to do when the plan fails</h3>
        <p className="text-base leading-relaxed">
          A failing check leaves three honest options. Enlarge the code, which is the right answer
          whenever space allows. Shorten the payload, which drops the version and enlarges every
          module without changing the print size — a short redirect is the classic fix. Or move the
          code closer to the viewer: a code on the door at eye level beats a code high on the
          window, even if the window version looks more impressive. What is not an option is hoping
          customers will walk closer. Some will, most will not, and the ones who do not are the
          campaign&apos;s lost conversions. A code that fails the check should not be printed on the
          assumption that behaviour will save it.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          The check that still matters after the maths
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Print a proof at final size on the real substrate and scan it from the real distance.
          </li>
          <li>Test on an older phone, not just the newest one in the office.</li>
          <li>
            Test in the actual light: daylight, dusk, and artificial light if the code lives
            outdoors.
          </li>
          <li>
            Check the quiet zone survived the layout — a cropped margin fails codes that the maths
            approved.
          </li>
          <li>Re-check after any change to payload, placement, or substrate.</li>
        </ul>
        <p className="text-base leading-relaxed">
          The maths takes ten seconds. The proof takes ten minutes. Both are cheaper than a reprint.
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
