'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Copy, CheckCircle2 } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

type Placement = 'indoor' | 'outdoor' | 'vehicle' | 'public-street';
type Risk = 'low' | 'medium' | 'high';
type Surface = 'flat' | 'curved' | 'glass' | 'rough';

const FAQS = [
  {
    question: 'What is a tamper-evident QR label?',
    answer:
      'A label that shows visible damage when someone tries to peel, lift, or replace it. Common types include destructible vinyl that fragments on removal, void tape that leaves a VOID pattern behind, and security laminates that delaminate. The point is not to make removal impossible — it is to make replacement visible to the next person who looks.',
  },
  {
    question: 'How often should public QR codes be inspected?',
    answer:
      'It depends on exposure and risk. A code in a staffed lobby can be checked weekly; a code on an unstaffed street sign in a high-risk location deserves a daily glance, ideally by someone whose route already passes it. The planner on this page turns your answers into a starting cadence — adjust it after your first month of real inspection logs.',
  },
  {
    question: 'What should staff do when they find a tampered code?',
    answer:
      'Remove or cover the code immediately so nobody scans it, photograph it for the record, log the time and location, and report it to whoever owns that code. Do not peel it off and throw it away before documenting it — the pattern of tampering tells you whether it was weather, vandalism, or a sticker overlay attack.',
  },
  {
    question: 'Can tamper-evident labels stop sticker overlay attacks?',
    answer:
      'Not on their own. An attacker can stick a new code on top of any label. Tamper-evident materials help when combined with placement that is hard to reach, a printed frame that makes an overlay obvious, and inspections that notice changes. The strongest single defence is a code whose destination your team monitors, so a swapped code is caught quickly.',
  },
];

export default function QRTamperEvidencePlannerPage() {
  const [placement, setPlacement] = useState<Placement>('indoor');
  const [risk, setRisk] = useState<Risk>('medium');
  const [surface, setSurface] = useState<Surface>('flat');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [copied, setCopied] = useState(false);

  const spec = useMemo(() => {
    const seal =
      placement === 'outdoor' || placement === 'public-street'
        ? 'Destructible vinyl label with UV-stable laminate, or a void-tape seal over the code edge'
        : surface === 'glass'
          ? 'Static-cling or void-tape seal applied to the inside face, so it cannot be lifted from outside'
          : 'Destructible vinyl label (fragments on peel) with a printed security frame';
    const cadence =
      risk === 'high'
        ? placement === 'public-street' || placement === 'outdoor'
          ? 'Daily visual check, plus a scan test every week'
          : 'Visual check twice a week, plus a scan test every week'
        : risk === 'medium'
          ? 'Visual check weekly, plus a scan test every two weeks'
          : 'Visual check every two weeks, plus a scan test monthly';
    const mounting =
      surface === 'curved'
        ? 'Use a flexible label sized to the curve; avoid wrapping the code around the curve. Flat-mount on a rigid plate if the curve is tight.'
        : surface === 'rough'
          ? 'Mount on a smooth rigid plate first; rough surfaces cause uneven adhesion and early peeling.'
          : surface === 'glass'
            ? 'Mount on the inside face where possible. Keep the code clear of glare and confirm it scans through the glass.'
            : 'Apply to a clean, dry, flat area. Leave the full quiet zone clear of frames and edges.';
    const escalation =
      risk === 'high'
        ? '1) Cover or remove the code immediately. 2) Photograph it and log time + location. 3) Notify the code owner within the hour. 4) Check nearby codes for the same tampering. 5) Verify the destination before reissuing.'
        : '1) Cover or remove the code immediately. 2) Photograph it and log time + location. 3) Notify the code owner the same day. 4) Verify the destination before reissuing.';
    const extras: string[] = [];
    if (placement === 'public-street')
      extras.push(
        'Place the code above comfortable reach where possible, and print a recognisable frame so an overlay sticker stands out.'
      );
    if (placement === 'vehicle')
      extras.push(
        'Use a label rated for vibration and temperature swings; check adhesion after the first week of service.'
      );
    if (placement === 'outdoor')
      extras.push(
        'Use UV-stable inks and laminate; check for fading and water ingress on each inspection.'
      );
    if (risk === 'high')
      extras.push(
        'Consider a code whose destination is monitored, so a swapped code pointing elsewhere is noticed quickly.'
      );
    return { seal, cadence, mounting, escalation, extras };
  }, [placement, risk, surface]);

  const specText = useMemo(() => {
    return [
      `Tamper-evidence spec${location ? ` — ${location}` : ''}`,
      `Owner: ${owner || '(assign an owner)'}`,
      `Placement: ${placement} | Surface: ${surface} | Risk: ${risk}`,
      '',
      `Seal type: ${spec.seal}`,
      `Inspection cadence: ${spec.cadence}`,
      `Mounting: ${spec.mounting}`,
      '',
      'Escalation:',
      spec.escalation,
      '',
      'Extra measures:',
      ...spec.extras.map((e) => `- ${e}`),
    ].join('\n');
  }, [spec, placement, surface, risk, location, owner]);

  const copySpec = async () => {
    await navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Tamper Evidence Planner',
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
          { label: 'QR Tamper Evidence Planner', href: '/qr-tamper-evidence-planner' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Tamper Evidence Planner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Answer placement, surface, and risk questions to generate a tamper-evidence spec: seal
          type, inspection cadence, mounting guidance, and escalation steps. Copy the spec into your
          own printing or facilities brief.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Describe the installation</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tamper-location">Location (optional)</Label>
                <Input
                  id="tamper-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Example: Lobby entrance, north wall
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tamper-owner">Code owner (optional)</Label>
                <Input id="tamper-owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
                <p className="text-[11px] text-muted-foreground">Example: Facilities team</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Placement
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['indoor', 'Indoor'],
                    ['outdoor', 'Outdoor, sheltered'],
                    ['public-street', 'Public street'],
                    ['vehicle', 'On a vehicle'],
                  ] as [Placement, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPlacement(id)}
                    className={`p-3 text-left rounded-xl border text-xs ${placement === id ? 'border-primary bg-primary/5 font-semibold' : 'border-border text-muted-foreground'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Surface
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['flat', 'Flat, smooth'],
                    ['curved', 'Curved'],
                    ['glass', 'Glass'],
                    ['rough', 'Rough / textured'],
                  ] as [Surface, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSurface(id)}
                    className={`p-3 text-left rounded-xl border text-xs ${surface === id ? 'border-primary bg-primary/5 font-semibold' : 'border-border text-muted-foreground'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Risk if this code is swapped
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ['low', 'Low — info page'],
                    ['medium', 'Medium — sign-up / form'],
                    ['high', 'High — payment / login'],
                  ] as [Risk, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRisk(id)}
                    className={`p-3 text-left rounded-xl border text-xs ${risk === id ? 'border-primary bg-primary/5 font-semibold' : 'border-border text-muted-foreground'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                A code that leads to payment or login deserves the strictest spec. A code that opens
                an info page does not.
              </p>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Your tamper-evidence spec</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Seal type</p>
                <p className="mt-0.5 leading-relaxed">{spec.seal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Inspection cadence
                </p>
                <p className="mt-0.5 leading-relaxed">{spec.cadence}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Mounting</p>
                <p className="mt-0.5 leading-relaxed">{spec.mounting}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Escalation</p>
                <p className="mt-0.5 leading-relaxed">{spec.escalation}</p>
              </div>
              {spec.extras.length > 0 && (
                <ul className="space-y-1.5">
                  {spec.extras.map((e, i) => (
                    <li key={i} className="text-xs flex gap-2 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={copySpec} className="w-full gap-1.5">
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy spec as text'}
            </Button>
          </Card>
        </div>
      </div>
      <AdSlot id="qr-tamper-evidence-planner-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Planning tamper evidence for public QR codes
        </h2>
        <p className="text-base leading-relaxed">
          A printed QR code in a public place has a weakness no encoding choice can fix: anyone can
          stick a different code on top of it. The attack is cheap, quiet, and hard to spot at a
          glance — a small sticker, placed in seconds, redirecting every future scanner to a
          phishing page or a payment form the owner never approved. Tamper evidence does not make
          that attack impossible. It makes it visible, so that the next person who looks at the code
          notices something is wrong before more people scan it.
        </p>
        <p className="text-base leading-relaxed">
          Start by sorting your codes by consequence. A code that opens an information page failing
          is an embarrassment; a code that collects payment or login credentials failing is an
          incident. That sorting should drive everything: the seal, the inspection cadence, and the
          escalation. High-consequence codes deserve destructible materials, frequent checks, and an
          escalation path measured in minutes, not days. Low-consequence codes can live with a
          simpler spec — but they still deserve an owner and a schedule, because an unowned code is
          a code nobody checks.
        </p>
        <AdSlot id="qr-tamper-evidence-planner-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          Materials matter, and each has a trade-off. Destructible vinyl fragments when peeled,
          which makes removal obvious but also means weather damage can look like tampering. Void
          tape leaves a visible VOID pattern on the surface when lifted, which is dramatic and
          clear, but it needs a clean, flat surface to bond properly. Security laminates protect
          against weather and scuffing while showing delamination when disturbed. On glass, mounting
          on the inside face removes the easiest attack entirely, since a passerby cannot reach the
          label. On curved or rough surfaces, mount on a smooth rigid plate first; a label that
          peels on its own teaches staff to ignore peeling, which is exactly the signal you need
          them to notice.
        </p>
        <p className="text-base leading-relaxed">
          Placement and presentation are the cheapest defences you have. A code above comfortable
          reach is harder to sticker. A printed frame around the code — a border, a logo, a line of
          text that an overlay would cover — makes a foreign sticker stand out to anyone who has
          seen the original. Keep a dated photograph of each installed code so inspectors can
          compare what they see against what should be there, rather than relying on memory. And
          route inspections along paths people already walk: the person who opens the building, the
          cleaner, the security round. A check that needs a special trip will be skipped; a check
          folded into an existing round gets done.
        </p>
        <p className="text-base leading-relaxed">
          Finally, plan the response before you need it. When someone finds a tampered code, the
          first step is always the same: cover or remove it so nobody else scans it. Then document —
          photograph it, log the time and location — and notify the owner. Verify the destination
          before reissuing, and check neighbouring codes for the same treatment. Keep a log of every
          finding, because the pattern matters: weather damage clusters by location, vandalism
          clusters by night, and a sticker attack may cluster by campaign. A spec is only as good as
          the inspections and the response behind it.
        </p>
      </article>

      <AdSlot id="qr-tamper-evidence-planner-pre-related" format="horizontal-banner" />
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Tamper Evidence
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
      <AdSlot id="qr-tamper-evidence-planner-bottom" format="horizontal-banner" />
    </div>
  );
}
