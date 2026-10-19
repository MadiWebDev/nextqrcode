'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Droplets } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRInkCoverageEstimatorPage() {
  const [version, setVersion] = useState(5);
  const [codeSize, setCodeSize] = useState(50);
  const [darkFraction, setDarkFraction] = useState(50);
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const modules = 21 + 4 * (version - 1);
  const codeAreaCm2 = Math.pow(codeSize / 10, 2);
  const inkFactor = fg.toLowerCase() === '#000000' ? 1 : 0.85;
  const coverage = (darkFraction / 100) * inkFactor * 100;
  const inkAreaCm2 = codeAreaCm2 * (coverage / 100);
  const bgInk = bg.toLowerCase() === '#ffffff' ? 0 : 25;
  const totalCoverage = Math.min(100, coverage + bgInk);
  const guidance =
    totalCoverage > 60
      ? 'Very heavy coverage — expect high toner use and slow drying on absorbent stock.'
      : totalCoverage > 35
        ? 'Moderate to heavy coverage — allow drying time and confirm with a proof.'
        : 'Light to moderate coverage — comfortable for most desktop and office printers.';

  const faqs = [
    {
      question: 'What is ink coverage for a QR code?',
      answer:
        "The share of the code's printed area covered in ink. Since roughly half of a QR code's modules are dark, a black-on-white code sits near 50% coverage of its own area — far above a typical text page.",
    },
    {
      question: 'Why does coverage affect toner cost?',
      answer:
        'Toner and ink use scales with coverage. Per-page cost figures usually assume around 5% coverage for text, so a sheet of dense QR labels can use several times more toner than the same number of text pages.',
    },
    {
      question: 'Does a coloured QR code use less ink?',
      answer:
        'It uses less black ink, but the coloured channel still prints at full coverage for its own modules, and a flooded coloured background adds a full layer. The calculator applies a planning factor for non-black foregrounds and an allowance for non-white backgrounds.',
    },
    {
      question: 'How do I reduce coverage problems in print?',
      answer:
        'Shorten the payload to lower the version, keep the background white, choose a stock suited to heavy coverage, allow proper drying time, and always proof and scan at final size on the real substrate.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Ink Coverage Estimator',
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
          { label: 'QR Ink Coverage Estimator', href: '/qr-ink-coverage-estimator' },
        ]}
      />

      <AdSlot id="qr-ink-coverage-estimator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Droplets className="w-3.5 h-3.5" />
          <span>Print Cost Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Ink Coverage Estimator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Estimate what share of the printed area a QR code covers in ink, from module density, code
          size, and colour — useful for toner budgeting and substrate choice.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Code and colours</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="iver">QR version</Label>
                <Input
                  id="iver"
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
                <Label htmlFor="isize">Printed code width (mm)</Label>
                <Input
                  id="isize"
                  type="number"
                  min="10"
                  max="2000"
                  step="1"
                  value={codeSize}
                  onChange={(e) => setCodeSize(Math.max(10, parseFloat(e.target.value) || 10))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[codeSize]}
                min={15}
                max={300}
                step={1}
                onValueChange={([v]) => setCodeSize(v)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="dark">Share of modules that are dark (%)</Label>
                <Input
                  id="dark"
                  type="number"
                  min="20"
                  max="80"
                  step="1"
                  value={darkFraction}
                  onChange={(e) =>
                    setDarkFraction(Math.min(80, Math.max(20, parseInt(e.target.value) || 50)))
                  }
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[darkFraction]}
                min={20}
                max={80}
                step={1}
                onValueChange={([v]) => setDarkFraction(v)}
              />
              <p className="text-[11px] text-muted-foreground">
                Typical QR codes are roughly half dark modules. Dense payloads and finder patterns
                shift the share; 50% is a sound default if you have not measured it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ifg">Foreground</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="ifg"
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
                <Label htmlFor="ibg">Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="ibg"
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
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-2">Formula and assumptions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Code-area coverage = dark-module share × ink factor, where the ink factor is 1.0 for
              pure black and 0.85 for other foreground colours (a stated planning factor for lighter
              inks). A non-white background adds a further 25-point allowance as a rough planning
              figure for a light flood coat. This is an estimate for budgeting and substrate choice,
              not a printer&apos;s densitometer reading — real toner use depends on the printer,
              halftoning, and ink.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estimate
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">
                Estimated ink coverage of code area
              </div>
              <div className="text-4xl font-extrabold text-primary">
                {totalCoverage.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ≈ {inkAreaCm2.toFixed(2)} cm² of solid ink per code
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Code area</span>
                <span className="font-semibold">{codeAreaCm2.toFixed(1)} cm²</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Dark-module share</span>
                <span className="font-semibold">{darkFraction}%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Background ink allowance</span>
                <span className="font-semibold">{bgInk}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{guidance}</p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-ink-coverage-estimator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why Ink Coverage Matters for QR Codes
        </h2>
        <p className="text-base leading-relaxed">
          A QR code is, from the printer&apos;s point of view, a dense patch of ink. Roughly half
          its modules are dark, and those dark modules sit edge to edge with no white space between
          them. That makes a QR code one of the heaviest-coverage elements on a typical label or
          flyer. Heavy coverage costs toner, slows drying, and stresses paper — and when it is not
          planned for, it shows up as smudged codes, cockled sheets, and toner that never quite
          sets. Estimating coverage before printing is how you avoid those surprises.
        </p>
        <h3 className="text-xl font-semibold text-foreground">What coverage does to the print</h3>
        <p className="text-base leading-relaxed">
          On absorbent uncoated stock, heavy coverage means more ink soaking into the fibres, which
          softens module edges and can close up small white gaps. On coated stock, the same ink sits
          on the surface and needs more drying time; stacking sheets too soon causes offsetting,
          where ink transfers to the back of the sheet above. In laser and office printers, a page
          of dense QR labels draws noticeably more toner than a page of text, so per-page cost
          estimates based on a standard 5% coverage page will badly understate the cost of a label
          run. The calculator&apos;s estimate gives you a number to plan around: multiply the
          per-code ink area by the run length and you have a sense of the toner load.
        </p>

        <AdSlot id="qr-ink-coverage-estimator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">The levers you can pull</h3>
        <p className="text-base leading-relaxed">
          The most powerful lever is the payload: a shorter payload means a lower version, larger
          modules, and a less dense code — though the dark share stays near half, the modules
          themselves are bigger and more forgiving of ink spread. Colour is the second lever. A
          coloured foreground uses less black toner but can still print at full coverage in its own
          channel, and it must keep the contrast ratio high. Background choice matters most of all:
          a white background prints nothing, while a flooded coloured background prints the whole
          area, which is why the calculator adds a planning allowance for non-white backgrounds. For
          the heaviest runs, talk to the printer about ink limits and drying: they may suggest a
          different stock, a longer drying time, or a coating.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Practical checks</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Print a proof at final size on the real stock and check module edges with a loupe or a
            phone macro photo.
          </li>
          <li>
            For large runs, confirm the printer&apos;s maximum recommended coverage for the chosen
            stock.
          </li>
          <li>
            Allow extra drying and interleaving for heavy-coverage sheets rather than stacking them
            immediately.
          </li>
          <li>Test-scan the proof after it has fully dried, not straight off the printer.</li>
        </ul>
        <p className="text-base leading-relaxed">
          Coverage is not a reason to avoid QR codes. It is a reason to plan the print like a
          printer would, so the code that leaves the press is the code your customers can scan.
        </p>
      </article>

      <AdSlot id="qr-ink-coverage-estimator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-ink-coverage-estimator-bottom" format="horizontal-banner" />

    </div>
  );
}
