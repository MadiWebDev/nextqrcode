'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Copy } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const PLACEMENTS: Record<string, { label: string; points: number }> = {
  restricted: { label: 'Restricted area (staff only, behind a counter)', points: 5 },
  indoor: { label: 'Indoors, supervised (shop, office)', points: 25 },
  packaging: { label: 'On product packaging / labels', points: 50 },
  public: { label: 'Public street / unsupervised poster', points: 85 },
};

const PROTECTIONS: Record<string, { label: string; points: number }> = {
  none: { label: 'No protection — plain print', points: 30 },
  laminate: { label: 'Laminate only', points: 18 },
  tamper: { label: 'Tamper-evident seal / destructible stock', points: 6 },
  embedded: { label: 'Embedded / engraved / behind glass', points: 2 },
};

const CODE_TYPES: Record<string, { label: string; points: number }> = {
  dynamic: { label: 'Dynamic code (destination can be changed if hijacked)', points: 5 },
  static: { label: 'Static code (reprint needed to fix a hijack)', points: 20 },
};

const MONITORINGS: Record<string, { label: string; points: number }> = {
  automated: { label: 'Automated monitoring (destination checked daily)', points: 0 },
  periodic: { label: 'Periodic manual checks (monthly)', points: 12 },
  none: { label: 'No monitoring', points: 25 },
};

function bandFor(score: number): { label: string; cls: string } {
  if (score < 30) return { label: 'Low risk', cls: 'text-emerald-600' };
  if (score < 60) return { label: 'Medium risk', cls: 'text-amber-600' };
  if (score < 80) return { label: 'High risk', cls: 'text-orange-600' };
  return { label: 'Critical risk', cls: 'text-red-600' };
}

export default function QRCloneRiskScorerPage() {
  const [placement, setPlacement] = useState('indoor');
  const [protection, setProtection] = useState('none');
  const [codeType, setCodeType] = useState('static');
  const [monitoring, setMonitoring] = useState('none');
  const [exposure, setExposure] = useState(50);

  const result = useMemo(() => {
    const exposurePoints = Math.round((exposure / 100) * 20);
    const breakdown = [
      { label: 'Placement', points: PLACEMENTS[placement].points },
      { label: 'Physical protection', points: PROTECTIONS[protection].points },
      { label: 'Code type', points: CODE_TYPES[codeType].points },
      { label: 'Monitoring', points: MONITORINGS[monitoring].points },
      { label: 'Footfall exposure', points: exposurePoints },
    ];
    const raw = breakdown.reduce((s, b) => s + b.points, 0);
    const score = Math.max(0, Math.min(100, raw));
    const band = bandFor(score);
    const mitigations: string[] = [];
    if (PLACEMENTS[placement].points >= 50)
      mitigations.push('Move the code behind a counter, behind glass, or into a supervised area.');
    if (PROTECTIONS[protection].points >= 18)
      mitigations.push('Use tamper-evident seals or destructible stock so an overlay is visible.');
    if (CODE_TYPES[codeType].points >= 20)
      mitigations.push(
        'Use a dynamic code so a hijacked destination can be corrected without reprinting.'
      );
    if (MONITORINGS[monitoring].points >= 12)
      mitigations.push(
        'Check the destination on a schedule — or automatically — and compare it with the intended URL.'
      );
    if (exposurePoints >= 12)
      mitigations.push(
        'In high-traffic spots, inspect the code itself regularly: an overlay sticker is the most common clone attack.'
      );
    if (mitigations.length === 0)
      mitigations.push('Keep the current controls and keep checking the destination on schedule.');
    return { score, band, breakdown, mitigations, exposurePoints };
  }, [placement, protection, codeType, monitoring, exposure]);

  const faqs = [
    {
      question: 'What is QR cloning / overlay?',
      answer:
        'An attacker prints their own QR code — pointing at a phishing page or a payment account they control — and sticks it over yours. Scanners then reach the attacker instead of you. It needs no hacking, just a printer and a sticker.',
    },
    {
      question: 'Is this score a measured probability?',
      answer:
        'No. It is a risk score computed from the factors you enter, on a fixed points scale (0–100). It ranks deployments and shows which controls matter most — it does not predict that an attack will or will not happen.',
    },
    {
      question: 'Why does a dynamic code score better?',
      answer:
        'Because if the destination is hijacked or the code is cloned, a dynamic code lets you change the destination or disable the link without reprinting. A static code can only be fixed by replacing every printed copy.',
    },
    {
      question: 'What is the single most effective mitigation?',
      answer:
        'Physical: make overlays visible — tamper-evident seals, destructible stock, or mounting behind glass. Digital: monitor the destination so a change is caught in hours, not months.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Clone Risk Scorer',
    applicationCategory: 'SecurityApplication',
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
          { label: 'QR Clone Risk Scorer', href: '/qr-clone-risk-scorer' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Copy className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Clone Risk Scorer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Score how easily a printed code could be cloned or overlaid, from placement, physical
          protection, code type, monitoring, and footfall exposure — with mitigations aimed at your
          biggest risk factors. The score is computed from your answers on a fixed points scale.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Describe the deployment</h2>
            <div className="space-y-2">
              <Label htmlFor="placement">Placement</Label>
              <select
                id="placement"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(PLACEMENTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (+{v.points})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="protection">Physical protection</Label>
              <select
                id="protection"
                value={protection}
                onChange={(e) => setProtection(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(PROTECTIONS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (+{v.points})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="codeType">Code type</Label>
              <select
                id="codeType"
                value={codeType}
                onChange={(e) => setCodeType(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(CODE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (+{v.points})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monitoring">Destination monitoring</Label>
              <select
                id="monitoring"
                value={monitoring}
                onChange={(e) => setMonitoring(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(MONITORINGS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (+{v.points})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Footfall exposure: {exposure}% (0 = rarely seen, 100 = constant crowds)</Label>
              <Slider
                value={[exposure]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setExposure(v)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Method: points per factor are summed and clamped to 0–100. Bands: Low &lt; 30, Medium
              30–59, High 60–79, Critical ≥ 80. Footfall contributes up to 20 points, scaled
              linearly from the slider.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Clone risk score</div>
              <div className="text-4xl font-extrabold text-primary">{result.score} / 100</div>
              <div className={`text-lg font-semibold ${result.band.cls}`}>{result.band.label}</div>
            </div>
            <div className="space-y-2 text-sm">
              {result.breakdown.map((b) => (
                <div
                  key={b.label}
                  className="flex justify-between border-b border-border/50 py-1.5"
                >
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-semibold">+{b.points}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Mitigations</h3>
              <ul className="space-y-1.5">
                {result.mitigations.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span aria-hidden="true">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-clone-risk-scorer-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Cheapest Attack Needs Only a Sticker
        </h2>
        <p className="text-base leading-relaxed">
          Cloning a QR code requires no technical skill: print a code that points somewhere
          malicious, stick it over the real one, and wait. Payment codes, parking codes, and
          donation codes are the classic targets, because the victim&apos;s money or credentials
          flow straight to the attacker. The defences are physical and procedural — make overlays
          visible, check the code itself, and watch the destination — because there is no way to
          make a printed pattern uncopyable.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-clone-risk-scorer-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          Inspect the code, not just the destination
        </h3>
        <p className="text-base leading-relaxed">
          A destination monitor catches a hijacked dynamic link, but it cannot see a sticker over a
          static code. For unsupervised placements, schedule physical inspections: look for edges,
          extra thickness, or a code that does not sit quite square on its backing.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-clone-risk-scorer-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-clone-risk-scorer-bottom" format="horizontal-banner" />
    </div>
  );
}
