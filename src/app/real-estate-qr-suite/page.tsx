'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Download, QrCode, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

type Preset = {
  id: string;
  name: string;
  hint: string;
  fields: Array<{ key: string; label: string }>;
  template: string;
};

const PRESETS: Preset[] = [
  {
    id: 'listing',
    name: 'Listing QR',
    hint: 'Link to the property listing with photos, price, and details.',
    fields: [{ key: 'url', label: 'Listing URL' }],
    template: '{url}',
  },
  {
    id: 'viewing',
    name: 'Viewing-Booking QR',
    hint: 'Link to the viewing booking form so passers-by can book a viewing from the sign board.',
    fields: [{ key: 'url', label: 'Viewing booking URL' }],
    template: '{url}',
  },
  {
    id: 'agent',
    name: 'Agent-Card QR',
    hint: "Encode the agent's contact details as a vCard so a prospect can save them with one scan.",
    fields: [
      { key: 'name', label: 'Agent name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
    ],
    template: 'BEGIN:VCARD\nVERSION:3.0\nFN:{name}\nTEL:{phone}\nEMAIL:{email}\nEND:VCARD',
  },
  {
    id: 'brochure',
    name: 'Brochure QR',
    hint: 'Link to the property brochure PDF or brochure page.',
    fields: [{ key: 'url', label: 'Brochure URL' }],
    template: '{url}',
  },
];
const faqs = [
  {
    question: 'How large should a QR code on a for-sale board be?',
    answer:
      'At least 10 cm wide, tested from the distance a passer-by stands from the board, with a clear white margin. A small code on a board will not be scanned.',
  },
  {
    question: 'Should board codes point to my own site or a portal?',
    answer:
      'Your own page is better for board codes: you control updates, the enquiry comes to you, and no competing listings appear alongside. Portal links belong on the portal.',
  },
  {
    question: 'What should an agent-card QR code contain?',
    answer:
      "The agent's name, direct phone, and email as a vCard, so a prospect can save the contact with one tap. Keep it minimal so it scans at card size.",
  },
  {
    question: 'What happens to codes when a property sells?',
    answer:
      "Update or remove them immediately. A code that advertises a sold property wastes buyers' time and makes the agency look careless.",
  },
];

function buildPayload(preset: Preset, values: Record<string, string>): string {
  const rawMode = preset.template.startsWith('BEGIN:VCARD') || preset.template.startsWith('WIFI:');
  let out = preset.template;
  preset.fields.forEach((f) => {
    const v = values[f.key] || '';
    const sub =
      rawMode || f.key === 'url' || f.key === 'ssid' || f.key === 'password'
        ? v
        : encodeURIComponent(v);
    out = out.split(`{${f.key}}`).join(sub);
  });
  out = out.replace(/([?&])[a-z]+=(?=&|$)/g, '$1').replace(/[?&]$/, '');
  return out;
}

export default function RealEstateQrSuitePage() {
  const [activeId, setActiveId] = useState(PRESETS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState('');
  const [qrError, setQrError] = useState('');

  const active = PRESETS.find((p) => p.id === activeId) || PRESETS[0];
  const payload = useMemo(() => buildPayload(active, values), [active, values]);
  const missing = active.fields.filter((f) => !(values[f.key] || '').trim());

  useEffect(() => {
    let cancelled = false;
    if (!payload || missing.length > 0) return;
    QRCodeLib.toDataURL(payload, { width: 512, margin: 2, errorCorrectionLevel: 'M' })
      .then((url) => {
        if (!cancelled) {
          setQrUrl(url);
          setQrError('');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrUrl('');
          setQrError(
            'Could not generate a QR code from these values. Check for unsupported characters.'
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [payload, missing.length]);

  function selectPreset(id: string) {
    setActiveId(id);
    setValues({});
  }

  function downloadPng() {
    if (!payload || missing.length > 0 || !qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `real-estate-qr-suite-${active.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function downloadSvg() {
    if (!payload || missing.length > 0) return;
    const svg = await QRCodeLib.toString(payload, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `real-estate-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Real Estate QR Suite',
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
          { label: 'Real Estate QR Suite', href: '/real-estate-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Real Estate QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          A real-estate toolkit in one place: listing QR, viewing-booking QR, agent-card QR, and
          brochure QR presets, each generating a real working QR code.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold">1. Choose a preset</h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPreset(p.id)}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${activeId === p.id ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-border hover:border-border/80 text-muted-foreground'}`}
                >
                  <div className="text-foreground font-semibold">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {p.hint}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">2. Fill in the details for {active.name}</h2>
            {active.fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={`field-${f.key}`}>{f.label}</Label>
                <Input
                  id={`field-${f.key}`}
                  value={values[f.key] || ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Every preset generates a real QR code from exactly what you type. Nothing is uploaded;
              the code is generated in your browser.
            </p>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" /> {active.name}
              </span>
            </div>
            {payload && missing.length === 0 && qrUrl ? (
              <div className="rounded-xl bg-white p-4 text-center">
                <img
                  src={qrUrl}
                  alt={`QR code for ${active.name}`}
                  className="w-full max-w-[320px] h-auto mx-auto"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                <QrCode className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                Fill in {missing.length > 0
                  ? missing.map((m) => m.label).join(', ')
                  : 'the fields'}{' '}
                to see your QR code.
              </div>
            )}
            {qrError && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{qrError}</span>
              </div>
            )}
            {payload && missing.length === 0 && (
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Encoded payload
                </p>
                <p className="text-xs font-mono break-all text-foreground whitespace-pre-wrap">
                  {payload}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={downloadPng}
                disabled={!payload || missing.length > 0 || !qrUrl}
                className="gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download PNG
              </Button>
              <Button
                onClick={downloadSvg}
                disabled={!payload || missing.length > 0 || !qrUrl}
                variant="outline"
                className="gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download SVG
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <AdSlot id="real-estate-qr-suite-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to Use the Real Estate QR Suite</h2>
        <p className="text-base leading-relaxed">
          A for-sale board is seen for seconds, and a QR code is what turns that glance into a
          viewing. A listing code takes a passer-by to photos and details, a viewing-booking code
          lets them book without calling, an agent-card code saves the agent&apos;s details to their
          phone, and a brochure code delivers the full particulars. The suite works when each code
          is placed where its moment happens: listing and viewing codes on the board, agent cards on
          business cards and flyers, and brochure codes on the printed particulars.
        </p>
        <p className="text-base leading-relaxed">
          Listing codes should point to the live listing, not to a homepage or a search page,
          because a buyer who lands on the wrong page will not search for the property.
          Viewing-booking codes should open a form that shows real availability and confirms
          instantly, since a form that asks the buyer to wait for a callback loses momentum.
          Agent-card codes should encode the agent&apos;s direct phone and email as a vCard, so the
          prospect can save the contact in one tap. Brochure codes should point to a current
          brochure or brochure page, and the brochure must match the listing, because a mismatch
          between the two destroys trust.
        </p>
        <AdSlot id="real-estate-qr-suite-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          The trade-off is between a code that points to your own listing and one that points to a
          portal. Your own page can be updated the moment the price changes or the property goes
          under offer, and it keeps the enquiry with you. A portal page brings a bigger audience but
          controls the enquiry flow and may show competing listings alongside yours. Many agents use
          both: the board code points to their own page, and the portal link lives on the portal.
          Whatever you choose, keep the printed codes pointing at URLs you control, so a status
          change does not require reprinting the board.
        </p>
        <p className="text-base leading-relaxed">
          Test every code from the pavement, at the distance a passer-by stands from the board, in
          daylight and in the evening. Print board codes large, at least 10 cm wide, with a clear
          margin, because a small code on a board is invisible to a driver or a pedestrian. Update
          or remove codes the moment a property is sold or let, because a code that advertises a
          sold property wastes everyone&apos;s time and makes the agency look careless.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps property codes honest is the status check. Every time a listing changes
          status, whether a price drop, an offer accepted, or a sale agreed, check that every code
          for that property reflects it. A board code that advertises a property already sold wastes
          buyers&apos; time and damages the agency&apos;s reputation. Keep a simple list linking
          each property to its codes, so when a property is withdrawn you know exactly which boards,
          flyers, and brochures must be pulled. Buyers remember the agency that wasted their
          afternoon far longer than they remember the property.
        </p>
      </article>

      <AdSlot id="real-estate-qr-suite-pre-related" format="horizontal-banner" />
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
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
      <AdSlot id="real-estate-qr-suite-bottom" format="horizontal-banner" />
    </div>
  );
}
