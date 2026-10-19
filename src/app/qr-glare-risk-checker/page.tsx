'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sun } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function Page() {
  const [finish, setFinish] = useState('Matte');
  const [lighting, setLighting] = useState('Diffuse / overcast');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const finishPts: Record<string, number> = { Matte: 0, Satin: 1, Gloss: 2, 'Glass or metal': 3 };
    const lightPts: Record<string, number> = {
      'Diffuse / overcast': 0,
      'Overhead indoor': 1,
      'Direct front light': 2,
      'Low sun or window behind viewer': 3,
    };
    const score = (finishPts[finish] ?? 0) + (lightPts[lighting] ?? 0);
    const verdict =
      score <= 1 ? 'Low glare risk' : score <= 3 ? 'Moderate glare risk' : 'High glare risk';
    const color = score <= 1 ? 'text-emerald-600' : score <= 3 ? 'text-amber-600' : 'text-red-600';
    const mitigation =
      score <= 1
        ? 'This combination should scan well in most light. Keep the quiet zone clear and test a printed proof in the real spot.'
        : score <= 3
          ? 'Reduce reflections: tilt the sign slightly away from the light, shade the code, or switch to a matte finish or matte lamination. Test-scan at the brightest time of day.'
          : 'Expect failed scans when the light hits the surface. Use a matte finish, move the code out of the direct light path, add a shade or hood, or place a second code where the light cannot strike it. Test-scan at the worst time of day before committing.';
    return { error: '', score, verdict, color, mitigation, finish, lighting };
  }, [finish, lighting]);

  const copyResult = async () => {
    if (result.error) return;
    await navigator.clipboard.writeText(
      `Glare risk: ${result.verdict} (score ${result.score} of 6). Finish: ${result.finish}. Lighting: ${result.lighting}. Mitigation: ${result.mitigation}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What is glare risk?',
      answer:
        'The chance that reflected light washes out the code so a phone camera cannot tell dark modules from light ones. It depends on how reflective the surface is and where the light sits relative to the viewer.',
    },
    {
      question: 'Why does finish matter so much?',
      answer:
        'Matte surfaces scatter reflected light in all directions, so no single viewing angle gets a bright reflection. Gloss, glass, and metal reflect in a tight beam, which can overwhelm the camera from exactly the angle a viewer stands at.',
    },
    {
      question: 'Is this a measurement of my surface?',
      answer:
        'No. It is a planning guide computed from the two factors you selected. The real test is a printed proof scanned in the real spot at the worst time of day.',
    },
    {
      question: 'How is this different from a fade-risk check?',
      answer:
        'Fade risk is about UV light bleaching the print over weeks or months. Glare risk is about reflection at scan time \u2014 a code can be unfaded and still unscannable because of glare.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Glare Risk Checker',
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
          { label: 'QR Glare Risk Checker', href: '/qr-glare-risk-checker' },
        ]}
      />

      <AdSlot id="qr-glare-risk-checker-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Sun className="w-3.5 h-3.5" />
          <span>Scan-Safety Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Glare Risk Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Check the glare risk for a printed QR code: pick the surface finish and the lighting, and
          get a risk verdict plus the mitigation that fits.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter your numbers</h2>
            <div className="space-y-2">
              <Label htmlFor="finish">Surface finish</Label>
              <select
                id="finish"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option key="Matte" value="Matte">
                  Matte
                </option>
                <option key="Satin" value="Satin">
                  Satin
                </option>
                <option key="Gloss" value="Gloss">
                  Gloss
                </option>
                <option key="Glass or metal" value="Glass or metal">
                  Glass or metal
                </option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lighting">Lighting</Label>
              <select
                id="lighting"
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option key="Diffuse / overcast" value="Diffuse / overcast">
                  Diffuse / overcast
                </option>
                <option key="Overhead indoor" value="Overhead indoor">
                  Overhead indoor
                </option>
                <option key="Direct front light" value="Direct front light">
                  Direct front light
                </option>
                <option
                  key="Low sun or window behind viewer"
                  value="Low sun or window behind viewer"
                >
                  Low sun or window behind viewer
                </option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Risk score = finish points + lighting points, each 0 to 3. Finish: Matte 0, Satin 1,
              Gloss 2, Glass or metal 3. Lighting: Diffuse / overcast 0, Overhead indoor 1, Direct
              front light 2, Low sun or window behind viewer 3. Score 0–1 is Low, 2–3 Moderate, 4–6
              High. The score is a planning guide from the two factors you selected, not a
              measurement of your surface.
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
                  <div className="text-xs text-muted-foreground">Glare risk</div>
                  <div className={`text-3xl font-extrabold ${result.color}`}>{result.verdict}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Score {result.score} of 6
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/50 py-1.5">
                    <span className="text-muted-foreground">Surface finish</span>
                    <span className="font-semibold">{result.finish}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Lighting</span>
                    <span className="font-semibold">{result.lighting}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.mitigation}</p>
              </>
            )}
            <Button variant="outline" size="sm" onClick={copyResult} disabled={!!result.error}>
              {copied ? 'Copied!' : 'Copy result'}
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-glare-risk-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to use the QR Glare Risk Checker</h2>
        <h3 className="text-xl font-semibold text-foreground">How this checker works</h3>
        <p className="text-base leading-relaxed">
          Glare happens when light reflects off the code surface into the camera, washing out the
          dark and light modules the scanner needs to tell apart. Two factors dominate: how
          reflective the surface is, and where the light sits relative to the viewer. This checker
          scores those two factors and turns the total into a verdict with the mitigation that fits.
        </p>

        <AdSlot id="qr-glare-risk-checker-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">What makes glare worse</h3>
        <p className="text-base leading-relaxed">
          Glossy lamination, glass, and metal reflect light in a tight beam, so a small change in
          viewing angle can flip a code from readable to unreadable. Low sun and windows behind the
          viewer are the worst lighting, because the reflection travels straight back toward the
          camera. Matte surfaces scatter the light instead, which is why they are the first fix.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Checking the result in the real world
        </h3>
        <p className="text-base leading-relaxed">
          Test a printed proof in the real spot at the worst time of day, not the best. Stand where
          viewers stand, scan with an ordinary phone, and move a step in each direction — glare
          often appears and disappears within a few degrees. If the code fails at any likely viewing
          position, change the finish or the position rather than hoping viewers find the one good
          angle.
        </p>
      </article>

      <AdSlot id="qr-glare-risk-checker-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-glare-risk-checker-bottom" format="horizontal-banner" />

    </div>
  );
}
