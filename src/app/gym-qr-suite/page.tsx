'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Download, QrCode, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
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
    id: 'membership',
    name: 'Membership QR',
    hint: 'Encode a member ID so check-in at the front desk takes one scan.',
    fields: [
      { key: 'member', label: 'Member ID' },
      { key: 'program', label: 'Gym name' },
    ],
    template: 'MEMBER|{program}|{member}',
  },
  {
    id: 'classes',
    name: 'Class-Booking QR',
    hint: 'Link to the class timetable and booking page.',
    fields: [{ key: 'url', label: 'Class booking URL' }],
    template: '{url}',
  },
  {
    id: 'trainer',
    name: 'Trainer-Profile QR',
    hint: "Link to a trainer's profile with specialties, availability, and booking.",
    fields: [
      { key: 'url', label: 'Trainer profile URL' },
      { key: 'name', label: 'Trainer name' },
    ],
    template: '{url}?trainer={name}',
  },
  {
    id: 'feedback',
    name: 'Feedback QR',
    hint: 'Link to a member feedback form. Place it at reception and in the changing area.',
    fields: [{ key: 'url', label: 'Feedback form URL' }],
    template: '{url}',
  },
];
const faqs = [
  {
    question: 'Can a membership QR code be shared with someone else?',
    answer:
      "Treat it like a membership card: anyone with the code can present it at check-in. Keep it on the member's own device or card, and verify identity for account changes.",
  },
  {
    question: 'Should class-booking codes point to a live timetable?',
    answer:
      'Yes. A static schedule goes stale when classes move or fill up. Link to the live timetable so members always see current availability.',
  },
  {
    question: 'What should a trainer-profile page include?',
    answer:
      "Specialties, availability, and a booking button. A profile without a next step wastes the member's interest.",
  },
  {
    question: 'Where should gym feedback codes go?',
    answer:
      'At reception and in the changing area, where the visit ends. Keep the form short and anonymous by default to encourage honest responses.',
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

export default function GymQrSuitePage() {
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
    a.download = `gym-qr-suite-${active.id}.png`;
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
    a.download = `gym-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gym QR Suite',
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
          { label: 'Gym QR Suite', href: '/gym-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Gym QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          A gym toolkit in one place: membership QR, class-booking QR, trainer-profile QR, and
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
        <h2 className="text-2xl font-bold text-foreground">How to Use the Gym QR Suite</h2>
        <p className="text-base leading-relaxed">
          A gym runs on routines, and QR codes remove the small frictions that break them. Members
          check in with one scan instead of spelling a name at the desk, book classes from a poster
          instead of calling, find the right trainer for a goal, and leave feedback while the
          workout is fresh. The codes work when they match the moment: check-in at the entrance,
          booking where members plan their week, trainer profiles where members look for help, and
          feedback where the visit ends.
        </p>
        <p className="text-base leading-relaxed">
          Membership codes should encode the member ID in a format your check-in system already
          accepts, so a scan is a check-in, not a lookup task. Class-booking codes should point to
          the live timetable, not a static schedule, because a class that moved or filled up will
          frustrate a member who trusted the poster. Trainer-profile codes should lead to a page
          with specialties, availability, and a booking button, since a profile without a next step
          wastes the member&apos;s interest. Feedback codes should be short and anonymous by
          default, because members are more honest when the form is quick and private.
        </p>
        <p className="text-base leading-relaxed">
          The trade-off is between a code that identifies the member and a code that only opens a
          page. A membership code that encodes an ID is convenient, but it is also a credential:
          anyone who photographs it can impersonate the member at check-in. Keep membership codes on
          the member&apos;s own device or card, never on public posters, and make sure staff verify
          identity for anything beyond entry, such as freezing a membership or changing payment
          details. Public codes should only ever point to pages, never to credentials.
        </p>
        <p className="text-base leading-relaxed">
          Test the check-in flow at peak time, when the desk is busy and the queue is real, because
          that is when a slow scan costs you members. Print class and trainer codes at a size that
          scans from a comfortable standing distance, and keep the timetable page current, since a
          stale timetable teaches members to stop trusting the codes. Review feedback weekly and
          post what changed, because a feedback form that never leads to visible improvement will
          stop receiving responses.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps gym codes working is the monthly timetable audit. Once a month, scan
          the class-booking code, confirm the timetable shows the current classes and real
          availability, and confirm a test booking goes through. Classes move, instructors change,
          and popular classes fill up, and a poster that promises a class that no longer exists will
          frustrate a member who trusted it. While you audit, check the physical codes too: replace
          any that are peeling, faded, or hidden behind new posters, and confirm the membership
          check-in scan still works at peak time when the queue is real.
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
