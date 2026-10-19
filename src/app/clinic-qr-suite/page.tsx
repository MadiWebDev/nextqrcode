'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Stethoscope,
  Download,
  QrCode,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
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
    id: 'intake',
    name: 'Intake-Form QR',
    hint: 'Link to your patient intake form so patients can complete it before arrival or in the waiting room.',
    fields: [{ key: 'url', label: 'Intake form URL' }],
    template: '{url}',
  },
  {
    id: 'appointment',
    name: 'Appointment QR',
    hint: 'Link to your booking page so patients can book or reschedule without calling.',
    fields: [{ key: 'url', label: 'Booking page URL' }],
    template: '{url}',
  },
  {
    id: 'aftercare',
    name: 'Aftercare QR',
    hint: 'Link to aftercare instructions the patient can re-read at home, with medication and warning-sign guidance.',
    fields: [{ key: 'url', label: 'Aftercare page URL' }],
    template: '{url}',
  },
  {
    id: 'feedback',
    name: 'Feedback QR',
    hint: 'Link to a patient feedback form. Place it in the waiting room and on discharge paperwork.',
    fields: [{ key: 'url', label: 'Feedback form URL' }],
    template: '{url}',
  },
];
const faqs = [
  {
    question: 'Is it safe to put patient information in a QR code?',
    answer:
      'No. Never encode patient details, diagnoses, or appointment specifics in a QR code. The code should point to a secure page, and the data should live only on that page behind proper access controls.',
  },
  {
    question: 'Should intake forms be completed before or at the clinic?',
    answer:
      'Before is better: it shortens the visit and lets staff review the form in advance. Keep a waiting-room code and a paper form for patients who could not complete it at home.',
  },
  {
    question: 'What should aftercare instructions include?',
    answer:
      'Plain-language medication timing, activity guidance, and clear warning signs that mean seek help, plus a contact number. Patients remember only part of what they hear, so the written version matters.',
  },
  {
    question: 'Should clinic feedback be anonymous?',
    answer:
      'Anonymous by default encourages honesty, especially about sensitive experiences. Offer an optional contact field for patients who want a follow-up.',
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

export default function ClinicQrSuitePage() {
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
    a.download = `clinic-qr-suite-${active.id}.png`;
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
    a.download = `clinic-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Clinic QR Suite',
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
          { label: 'Clinic QR Suite', href: '/clinic-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Clinic QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          A clinic toolkit in one place: intake-form QR, appointment QR, aftercare QR, and feedback
          QR presets, each generating a real working QR code.
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
        <h2 className="text-2xl font-bold text-foreground">How to Use the Clinic QR Suite</h2>
        <p className="text-base leading-relaxed">
          A clinic&apos;s waiting room is full of moments where a QR code saves everyone time.
          Patients can complete intake forms before they arrive, book or reschedule without calling,
          re-read aftercare instructions at home, and give feedback while the visit is fresh. Each
          of these works only if the code points to exactly the right form or page, because a
          patient who lands on a generic homepage will give up and join the phone queue instead.
        </p>
        <p className="text-base leading-relaxed">
          Intake codes should point to a secure form that patients can complete on their own device,
          ideally before the appointment, so the visit starts with care rather than paperwork.
          Appointment codes should open a booking flow that shows real availability and confirms
          instantly, because a booking page that asks the patient to call anyway has solved nothing.
          Aftercare codes should link to instructions written in plain language, with medication
          timing and warning signs that mean seek help, since patients remember only a fraction of
          what they hear in the room. Feedback codes should be short and anonymous by default,
          because patients are more honest when the form is quick and private.
        </p>
        <p className="text-base leading-relaxed">
          The trade-off in a clinic is between convenience and privacy. QR codes make it easy to
          collect information, but health information is sensitive, and a code that collects patient
          data must be backed by a secure form, a clear privacy notice, and a retention policy.
          Never encode patient details, diagnoses, or appointment specifics inside a QR code itself:
          the code should be a pointer to a secure page, and the data should live only there. Keep a
          paper alternative for every QR flow, because some patients cannot or will not use a phone.
        </p>
        <p className="text-base leading-relaxed">
          Test every code as a patient would: scan it in the waiting room, complete the form on a
          phone, and confirm the submission arrives in the right place. Print codes at a size that
          scans from a seated position, place intake and booking codes where patients wait, and put
          aftercare codes on the discharge paperwork patients take home. Review the forms regularly,
          remove questions you do not act on, and tell patients what happens with their feedback,
          because a feedback form that never leads to visible change will stop being used.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps clinic codes safe is the regular review of every form the codes point
          to. Once a quarter, read each form as a patient would, remove any question the clinic does
          not act on, and confirm the privacy notice still describes what actually happens to the
          answers. Forms grow by accumulation: someone adds a question, nobody removes it, and
          patients end up answering questions nobody reads. Shorter forms get completed more often
          and respected more. Also confirm the paper alternative for every QR flow is still
          available, because a clinic must never make care depend on owning a phone.
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
