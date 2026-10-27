'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Ruler } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'What is the 10:1 rule for QR size?',
    answer:
      'The scanning distance should be no more than 10 times the code width. A code scanned from 1.5 metres should be at least 150 mm wide. In dim light or behind glass, use 8:1 and print larger.',
  },
  {
    question: 'What is the smallest QR code I can print?',
    answer:
      'For a card scanned from 20 to 25 cm away, about 20 to 25 mm wide is the practical floor. Smaller codes fail on many phone cameras because they cannot focus that close.',
  },
  {
    question: 'How many pixels do I need at 300 DPI?',
    answer:
      'Multiply the printed width in inches by 300. A 2.4-inch (60 mm) code needs about 720 pixels, so a 1024px export is a safe choice.',
  },
  {
    question: 'Can I put a QR code on a billboard?',
    answer:
      'Only where people stand still, such as transit platforms or pedestrian plazas. Never target drivers: scanning while driving is dangerous, and no code size makes it safe.',
  },
];

export default function QrSizePresetsPage() {
  const PRESETS = [
    {
      id: 'business-card',
      label: 'Business card',
      distance: 0.25,
      note: "Handed over, scanned at arm's length.",
    },
    {
      id: 'flyer',
      label: 'Flyer / handout',
      distance: 0.6,
      note: 'Held in the hand, scanned while reading.',
    },
    {
      id: 'poster',
      label: 'Poster',
      distance: 1.5,
      note: 'Wall-mounted, scanned from a step back.',
    },
    {
      id: 'window',
      label: 'Shop window',
      distance: 3,
      note: 'Scanned by passers-by from the pavement.',
    },
    {
      id: 'billboard',
      label: 'Billboard',
      distance: 15,
      note: 'Large-format signage. Never target drivers.',
    },
  ];
  const [presetId, setPresetId] = useState('flyer');
  const [distance, setDistance] = useState(0.6);
  const [dpi, setDpi] = useState(300);
  const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[1];
  function applyPreset(id: string) {
    setPresetId(id);
    const p = PRESETS.find((x) => x.id === id);
    if (p) setDistance(p.distance);
  }
  const widthMm = Math.max(15, (distance * 1000) / 10);
  const widthIn = widthMm / 25.4;
  const widthPx = Math.round(widthIn * dpi);
  const quietMm = widthMm / 10;
  const scale = Math.min(1, 220 / widthMm);
  const boxPx = Math.max(24, Math.round(widthMm * scale));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Size Presets',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
          { label: 'QR Size Presets', href: '/qr-size-presets' },
        ]}
      />

      <AdSlot id="qr-size-presets-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Ruler className="w-3.5 h-3.5" />
          <span>Sizing Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Size Presets
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Pick a use case — business card, flyer, poster, billboard — and get exact QR dimensions in
          mm, inches, and pixels with a preview box.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Use case</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.id}
                  size="sm"
                  variant={presetId === p.id ? 'default' : 'outline'}
                  onClick={() => applyPreset(p.id)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{preset.note}</p>
          </div>
          <div className="space-y-2">
            <Label>Expected scan distance: {distance} m</Label>
            <Slider
              value={[distance]}
              min={0.2}
              max={20}
              step={0.1}
              onValueChange={([v]) => setDistance(v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Print resolution: {dpi} DPI</Label>
            <Slider
              value={[dpi]}
              min={150}
              max={600}
              step={50}
              onValueChange={([v]) => setDpi(v)}
            />
          </div>
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recommended QR width</span>
              <strong>
                {widthMm.toFixed(0)} mm ({widthIn.toFixed(2)} in)
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pixels at {dpi} DPI</span>
              <strong>
                {widthPx} x {widthPx} px
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quiet zone (each side)</span>
              <strong>about {quietMm.toFixed(0)} mm</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rule used</span>
              <strong>10:1 distance-to-size</strong>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Formula: width = scan distance / 10. In dim light, behind glass, or for dense payloads,
            divide by 8 instead and print larger.
          </p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-4">
            Preview box (scaled to fit)
          </p>
          <div
            className="mx-auto border-2 border-dashed border-primary/50 bg-primary/5 flex items-center justify-center text-xs text-muted-foreground"
            style={{ width: boxPx, height: boxPx }}
          >
            {widthMm.toFixed(0)} mm
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            The box shows relative size, not print size. Use the numbers above for your layout.
          </p>
        </Card>
      </div>

      <AdSlot id="qr-size-presets-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Picking the Right QR Size for Every Surface
        </h2>
        <p className="text-base leading-relaxed">
          The size of a QR code should be decided by one number first: how far away the scanner will
          stand. Everything else, from the paper size to the design layout, comes second. The
          working rule is the 10:1 ratio: the scanning distance should be no more than ten times the
          width of the code. A business card handed to someone is scanned from about 25 centimeters
          away, so a 25 millimeter code is the floor, and a little extra is wise. A poster on a wall
          is scanned from a metre or more, so it needs a code at least 100 to 150 millimeters wide.
          When you start from distance instead of from the space left over in the layout, the code
          works the first time.
        </p>
        <p className="text-base leading-relaxed">
          Each common use case has its own trap. Business cards tempt designers to shrink the code
          to make room for a name and a logo, but a card scanned at arm&apos;s length with a code
          under 20 millimeters wide will fail on many phones. Flyers and handouts are usually read
          at 50 to 60 centimeters, so a 50 to 60 millimeter code is the safe target, and it should
          sit where a thumb does not cover it when the sheet is held. Posters need more than people
          expect, because viewers step back to read the headline before they approach, and a code
          sized for close reading will be too small from that first step back. Shop windows add
          glare and glass into the equation, so a window code should be sized generously and placed
          where reflections are weakest.
        </p>

        <AdSlot id="qr-size-presets-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Billboards deserve a special warning. The arithmetic says a billboard scanned from 15
          metres needs a code 1.5 metres wide, and from 25 metres it needs 2.5 metres. That is
          physically possible, but a QR code on a roadside billboard is a bad idea when the audience
          is driving, because nobody should be scanning while driving. Reserve billboard-sized codes
          for places where people stand still and look up: transit platforms, stadium concourses,
          and pedestrian plazas. If the audience is moving in a vehicle, use a short memorable URL
          or a brand name instead of a code.
        </p>
        <p className="text-base leading-relaxed">
          Pixels enter the picture when the code goes to print. A code that is 60 millimeters wide
          is about 2.4 inches, and at 300 DPI it needs roughly 700 pixels across to print crisply.
          Exporting a 512 pixel image for that job leaves the edges slightly soft, while a 1024
          pixel export covers it with room to spare. The quiet zone follows the same arithmetic: it
          should be at least a tenth of the code width on each side, because it is defined as four
          modules and modules are roughly a twenty-fifth of the code width. If the margin in your
          layout is thinner than that, the code is too big for the space, and the fix is a shorter
          payload or a different placement.
        </p>
        <p className="text-base leading-relaxed">
          Treat these presets as starting points, then verify with a printed proof. Print the code
          at the recommended size, mount it where it will live, walk to the real viewing distance,
          and scan it with a phone in the worst light that spot gets. If the scan is instant, you
          are done. If it hesitates, go one size up before you blame the design, because size is the
          cheapest fix in the whole process and it solves more failures than any color or styling
          change.
        </p>
      </article>

      <AdSlot id="qr-size-presets-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq, i) => (
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

      <AdSlot id="qr-size-presets-bottom" format="horizontal-banner" />

    </div>
  );
}
