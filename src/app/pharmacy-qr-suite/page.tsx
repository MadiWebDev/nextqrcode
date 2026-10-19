'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, Download, QrCode, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import QRCodeLib from 'qrcode';

type Preset = {
  id: string;
  name: string;
  hint: string;
  fields: Array<{ key: string; label: string }>;
  template: string;
};

const PRESETS: Preset[] = [
  {
    id: 'refill',
    name: 'Refill QR',
    hint: 'Link to the prescription refill request page so patients can reorder without calling.',
    fields: [{ key: 'url', label: 'Refill request URL' }],
    template: '{url}',
  },
  {
    id: 'medinfo',
    name: 'Medication-Info QR',
    hint: 'Link to patient information about a medication: how to take it, side effects, and storage.',
    fields: [{ key: 'url', label: 'Medication info URL' }],
    template: '{url}',
  },
  {
    id: 'hours',
    name: 'Opening-Hours QR',
    hint: 'Link to a page with opening hours, holiday hours, and contact details.',
    fields: [{ key: 'url', label: 'Opening hours page URL' }],
    template: '{url}',
  },
  {
    id: 'feedback',
    name: 'Feedback QR',
    hint: 'Link to a patient feedback form. Place it at the counter and on the bag label.',
    fields: [{ key: 'url', label: 'Feedback form URL' }],
    template: '{url}',
  },
];
const faqs = [
  {
    question: 'Is it safe to put prescription details in a QR code?',
    answer:
      'No. Never encode patient details, prescription numbers, or dosage instructions in a QR code. The code should point to a secure page or form, and health data should stay on secure systems.',
  },
  {
    question: 'What should a medication-info page include?',
    answer:
      'How to take the medicine, what to do if a dose is missed, side effects that need attention, and storage instructions, all in plain language.',
  },
  {
    question: 'Should refill requests confirm when the medication is ready?',
    answer:
      'Yes. A refill page that confirms the request and gives a ready time prevents follow-up calls and tells the patient exactly when to come in.',
  },
  {
    question: 'Do QR codes replace talking to the pharmacist?',
    answer:
      'Never. Codes handle routine tasks like refills and hours, but patients must always be able to speak to a pharmacist about their medication.',
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

export default function PharmacyQrSuitePage() {
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
    a.download = `pharmacy-qr-suite-${active.id}.png`;
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
    a.download = `pharmacy-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pharmacy QR Suite',
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
          { label: 'Pharmacy QR Suite', href: '/pharmacy-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Pill className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Pharmacy QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          A pharmacy toolkit in one place: refill QR, medication-info QR, opening-hours QR, and
          feedback QR presets, each generating a real working QR code.
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

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to Use the Pharmacy QR Suite</h2>
        <p className="text-base leading-relaxed">
          A pharmacy counter is a queue, and QR codes shorten it. Patients can request refills
          without calling, read medication information at home instead of at the counter, check
          opening hours from the door, and give feedback without a form. Each code works only if it
          points to exactly the right page, because a patient who lands on a generic homepage will
          join the queue anyway, which defeats the purpose.
        </p>
        <p className="text-base leading-relaxed">
          Refill codes should open a request flow that confirms the request and tells the patient
          when the medication will be ready, since a refill page that leaves the patient guessing
          will generate a follow-up call. Medication-info codes should link to patient information
          written in plain language: how to take the medicine, what to do if a dose is missed, side
          effects that need attention, and how to store it. Opening-hours codes should show current
          hours including holiday changes, because an out-of-date hours page sends a patient to a
          closed pharmacy. Feedback codes should be short and anonymous by default, since patients
          are more honest when the form is quick and private.
        </p>
        <p className="text-base leading-relaxed">
          The trade-off in a pharmacy is between convenience and safety. QR codes make it easy to
          share information, but medication information must be accurate, current, and matched to
          the right medicine. Never encode patient details, prescription numbers, or dosage
          instructions inside a QR code: the code should point to a page or form, and personal
          health data should live only on secure systems. Keep a staffed counter for every QR flow,
          because some patients need to talk to a pharmacist, and a code must never replace that
          conversation.
        </p>
        <p className="text-base leading-relaxed">
          Test every code as a patient would: scan it at the counter, complete a refill request, and
          read the medication page on a phone. Print counter codes at a size that scans from a
          normal standing distance, put the hours code on the door where it is visible when the
          pharmacy is closed, and review the linked pages whenever a medication leaflet or holiday
          schedule changes. Tell patients what each code is for in plain words next to it, since a
          code with no explanation will not be scanned.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps pharmacy codes safe is the leaflet review. Whenever a medication
          leaflet or holiday schedule changes, check every code that points to it and confirm the
          linked page still matches the current information. Medication information that is out of
          date is worse than no information at all, because a patient may act on it. Also confirm
          the refill flow still confirms the request and gives a realistic ready time, and that the
          paper alternative for every QR flow is still available at the counter. A pharmacy must
          never make access to medication depend on owning a phone.
        </p>
      </article>

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
    </div>
  );
}
