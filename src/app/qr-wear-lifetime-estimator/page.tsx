'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarClock } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const MATERIALS: Record<string, { label: string; baseMonths: number }> = {
  paper: { label: 'Plain paper / card', baseMonths: 6 },
  vinyl: { label: 'Adhesive vinyl', baseMonths: 24 },
  polyester: { label: 'Polyester label', baseMonths: 48 },
  aluminium: { label: 'Aluminium plate', baseMonths: 96 },
  engraved: { label: 'Engraved / etched metal', baseMonths: 180 },
};

const ENVIRONMENTS: Record<string, { label: string; factor: number }> = {
  indoor: { label: 'Indoors, dry', factor: 1 },
  sheltered: { label: 'Sheltered outdoor (under cover)', factor: 0.6 },
  outdoor: { label: 'Full outdoor, direct sun + rain', factor: 0.35 },
  harsh: { label: 'Harsh: coastal, industrial, chemical washdown', factor: 0.2 },
};

const LAMINATIONS: Record<string, { label: string; factor: number }> = {
  none: { label: 'No lamination', factor: 1 },
  matte: { label: 'Matte laminate', factor: 1.4 },
  uv: { label: 'UV-resistant laminate', factor: 1.8 },
  sealed: { label: 'Overlaminate + sealed edges', factor: 2.2 },
};

export default function QRWearLifetimeEstimatorPage() {
  const [material, setMaterial] = useState('vinyl');
  const [environment, setEnvironment] = useState('indoor');
  const [lamination, setLamination] = useState('none');
  const [installDate, setInstallDate] = useState(() => new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    const months = Math.max(
      1,
      Math.round(
        MATERIALS[material].baseMonths *
          ENVIRONMENTS[environment].factor *
          LAMINATIONS[lamination].factor
      )
    );
    const installed = new Date(installDate + 'T00:00:00');
    const replace = new Date(installed);
    replace.setMonth(replace.getMonth() + months);
    const inspect = new Date(installed);
    inspect.setMonth(inspect.getMonth() + Math.max(1, Math.floor(months / 2)));
    return {
      months,
      years: (months / 12).toFixed(1),
      replace: replace.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      inspect: inspect.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  }, [material, environment, lamination, installDate]);

  const faqs = [
    {
      question: 'Is this a measured lifetime or an estimate?',
      answer:
        'It is an estimate computed from the assumptions you enter: a baseline lifetime for the material, adjusted by environment and lamination factors. Real lifetimes vary with sun exposure, cleaning chemicals, and print quality, so treat the date as a planning target and verify with test scans.',
    },
    {
      question: 'Why does lamination extend the lifetime?',
      answer:
        'Lamination shields the printed modules from UV light, water, abrasion, and cleaning chemicals — the main causes of fading and scuffing. Sealed edges matter outdoors because moisture creeps in from the edge of an unsealed label.',
    },
    {
      question: 'How often should I test-scan a printed code?',
      answer:
        'Scan it at installation, again at the mid-life inspection date this tool shows, and any time the surface is cleaned, repainted, or exposed to unusual weather. A code that scans slowly or only at close range is already degrading.',
    },
    {
      question: 'What kills printed QR codes fastest?',
      answer:
        'Direct UV sunlight fades inks, pressure washing and solvents strip print, and abrasion wears modules away. Coastal salt air and industrial chemicals accelerate all three, which is why the harsh-environment factor is so low.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Wear Lifetime Estimator',
    applicationCategory: 'UtilitiesApplication',
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
          { label: 'QR Wear Lifetime Estimator', href: '/qr-wear-lifetime-estimator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <CalendarClock className="w-3.5 h-3.5" />
          <span>Print Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Wear Lifetime Estimator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Estimate how long a printed QR code will stay scannable from its material, environment,
          and lamination, and get a replacement date plus a mid-life inspection date. All outputs
          are computed from the assumptions you enter — they are planning estimates, not measured
          guarantees.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Describe the printed code</h2>
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <select
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(MATERIALS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} — baseline {v.baseMonths} months indoors
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <select
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(ENVIRONMENTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (×{v.factor})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lamination">Lamination</Label>
              <select
                id="lamination"
                value={lamination}
                onChange={(e) => setLamination(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(LAMINATIONS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (×{v.factor})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="install">Installation date</Label>
              <Input
                id="install"
                type="date"
                value={installDate}
                onChange={(e) => setInstallDate(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formula: estimated lifetime = material baseline × environment factor × lamination
              factor, rounded to whole months. The replacement date is the installation date plus
              that lifetime; the inspection date is the halfway point.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Estimated scannable lifetime</div>
              <div className="text-4xl font-extrabold text-primary">{result.months} months</div>
              <div className="text-sm text-muted-foreground">about {result.years} years</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Plan replacement by</span>
                <span className="font-semibold">{result.replace}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Mid-life test-scan</span>
                <span className="font-semibold">{result.inspect}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Schedule the replacement before this date, not on it — a code usually gets slow and
              unreliable before it stops scanning entirely.
            </p>
          </Card>
        </div>
      </div>
      <AdSlot id="qr-wear-lifetime-estimator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Why Printed Codes Have a Lifetime</h2>
        <p className="text-base leading-relaxed">
          A printed QR code is ink on a surface, and both degrade. Sunlight fades ink, rain and
          cleaning chemicals attack it, and feet, hands, and machinery abrade it. Scanners tolerate
          some damage thanks to error correction, but once enough modules are unreadable the code
          fails — often gradually, scanning slowly or only at close range first. Planning a
          replacement date before that happens is cheaper than discovering a dead code on a sign
          that has been failing for months.
        </p>
        <AdSlot id="qr-wear-lifetime-estimator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">How to use the estimate</h3>
        <p className="text-base leading-relaxed">
          Pick the material you actually plan to print on, the environment the code will really live
          in, and the lamination you will actually pay for. Use the replacement date to diary a
          reprint, and use the mid-life inspection date to test-scan the code in place. If a code
          already scans poorly at inspection, replace it then rather than waiting for the planned
          date.
        </p>
      </article>
      <AdSlot id="qr-wear-lifetime-estimator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="qr-wear-lifetime-estimator-bottom" format="horizontal-banner" />
    </div>
  );
}
