'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School, Download, QrCode, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
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
    id: 'newsletter',
    name: 'Newsletter QR',
    hint: 'Link to the school newsletter so families can read it on their phones instead of losing a paper copy.',
    fields: [{ key: 'url', label: 'Newsletter URL' }],
    template: '{url}',
  },
  {
    id: 'homework',
    name: 'Homework QR',
    hint: 'Link to the homework page or assignment list for a class.',
    fields: [
      { key: 'url', label: 'Homework page URL' },
      { key: 'name', label: 'Class name' },
    ],
    template: '{url}?class={name}',
  },
  {
    id: 'event',
    name: 'Event QR',
    hint: 'Link to a school event page with date, time, location, and any signup form.',
    fields: [{ key: 'url', label: 'Event page URL' }],
    template: '{url}',
  },
  {
    id: 'permission',
    name: 'Permission-Slip QR',
    hint: 'Link to the permission form for a trip or activity so parents can complete it from their phones.',
    fields: [{ key: 'url', label: 'Permission form URL' }],
    template: '{url}',
  },
];
const faqs = [
  {
    question: 'Should schools stop sending paper letters if they use QR codes?',
    answer:
      'No. Keep paper copies for families who need them. QR codes are a second path to the same information, not a replacement that leaves some families out.',
  },
  {
    question: 'What should a permission-slip form collect?',
    answer:
      "Only what the trip requires: the child's name, the activity, consent, and an emergency contact. Keep the data on the school's secure form, never inside the QR code.",
  },
  {
    question: 'How do homework QR codes help families?',
    answer:
      'They take parents straight to the current assignment list for the right class, so a missed paper note does not mean missed homework.',
  },
  {
    question: "Can children's personal details go in a school QR code?",
    answer:
      "No. Never encode a child's personal details in a QR code. Codes should point to pages, and personal data should stay on secure school systems.",
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

export default function SchoolQrSuitePage() {
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
    a.download = `school-qr-suite-${active.id}.png`;
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
    a.download = `school-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'School QR Suite',
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
          { label: 'School QR Suite', href: '/school-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <School className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          School QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          A school toolkit in one place: newsletter QR, homework QR, event QR, and permission-slip
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
        <h2 className="text-2xl font-bold text-foreground">How to Use the School QR Suite</h2>
        <p className="text-base leading-relaxed">
          Schools send home a lot of paper, and much of it never arrives. QR codes on letters,
          noticeboards, and classroom doors give families a second path to the same information:
          scan the newsletter code to read the week&apos;s news, the homework code to see
          assignments, the event code to check the date and sign up, and the permission-slip code to
          complete a form from a phone. The goal is not to replace paper overnight, but to make sure
          no family misses information because a sheet stayed in a school bag.
        </p>
        <p className="text-base leading-relaxed">
          Newsletter codes should point to the current issue, not to an archive page, because a
          parent who lands on last term&apos;s news will assume nothing new happened. Homework codes
          should point to a page that is updated on the day homework is set, with the class name in
          the URL so families land on the right class. Event codes should carry the full details:
          date, time, location, cost, and the signup form, all on one page. Permission-slip codes
          should open a form that can be completed and submitted from a phone in under two minutes,
          with a confirmation message parents can screenshot.
        </p>
        <p className="text-base leading-relaxed">
          The trade-off is between reach and access. QR codes reach families who use smartphones and
          have data, but not every family does, and a school must not make essential information
          available only through a code. Keep paper copies for families who need them, keep the
          pages the codes point to light and readable on older phones, and never put a child&apos;s
          personal details inside a QR code. A permission form should collect only what the trip
          requires, and the data should live on the school&apos;s secure form, not in the code.
        </p>
        <p className="text-base leading-relaxed">
          Test each code with a parent&apos;s phone, not just a teacher&apos;s, and check the whole
          journey: scan, read, and complete the form. Print codes on letters and posters at a size
          that scans from a normal reading distance, and keep the linked pages current, because an
          out-of-date homework page teaches families to ignore the codes. Tell families what each
          code is for in plain words next to it, since a code with no explanation will not be
          scanned.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps school codes trusted is the weekly link check. Once a week, scan every
          code the school has in circulation and confirm each one opens the current page: this
          week&apos;s newsletter, today&apos;s homework, the upcoming event, the live permission
          form. School pages change constantly, and a code that opens last week&apos;s newsletter
          teaches families to stop scanning. Also keep a simple list of where every code is posted,
          so when a page moves you know exactly which posters, letters, and noticeboards need
          reprinting. A code that nobody maintains becomes a code that nobody trusts.
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
