'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel, Download, QrCode, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
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
    id: 'checkin',
    name: 'Check-In QR',
    hint: 'Link to online check-in so guests can arrive with paperwork already done.',
    fields: [{ key: 'url', label: 'Check-in page URL' }],
    template: '{url}',
  },
  {
    id: 'wifi',
    name: 'WiFi QR',
    hint: 'Encode the network name and password so guests join the WiFi by scanning, without typing a long password.',
    fields: [
      { key: 'ssid', label: 'WiFi network name' },
      { key: 'password', label: 'WiFi password' },
    ],
    template: 'WIFI:T:WPA;S:{ssid};P:{password};;',
  },
  {
    id: 'roomservice',
    name: 'Room-Service QR',
    hint: 'Link to the room-service menu and ordering page.',
    fields: [
      { key: 'url', label: 'Room-service menu URL' },
      { key: 'room', label: 'Room number (optional)' },
    ],
    template: '{url}?room={room}',
  },
  {
    id: 'guide',
    name: 'Local-Guide QR',
    hint: 'Link to a local guide with restaurants, transport, and hotel facilities.',
    fields: [{ key: 'url', label: 'Local guide URL' }],
    template: '{url}',
  },
];
const faqs = [
  {
    question: 'Is a WiFi QR code secure?',
    answer:
      'It contains the WiFi password in readable form, so use it only for an isolated guest network that is rotated regularly. Never encode staff network credentials in a public code.',
  },
  {
    question: 'Should room-service codes include the room number?',
    answer:
      'They can, so orders arrive at the right door. If the code is printed per room, the room number is already implied, and a generic code is simpler to reprint.',
  },
  {
    question: 'What should a hotel local guide include?',
    answer:
      'Breakfast and checkout times, transport options, nearby restaurants, and hotel facilities. The information guests actually ask about at reception.',
  },
  {
    question: 'Do WiFi QR codes work on both iPhone and Android?',
    answer:
      'Yes, both platforms support WiFi QR codes, though the exact prompts differ. Test with both before printing the full run.',
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

export default function HotelQrSuitePage() {
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
    a.download = `hotel-qr-suite-${active.id}.png`;
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
    a.download = `hotel-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hotel QR Suite',
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
          { label: 'Hotel QR Suite', href: '/hotel-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Hotel className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Hotel QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          A hotel toolkit in one place: check-in QR, WiFi QR, room-service QR, and local-guide QR
          presets, each generating a real working QR code.
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

      <AdSlot id="hotel-qr-suite-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to Use the Hotel QR Suite</h2>
        <p className="text-base leading-relaxed">
          A guest&apos;s first hour at a hotel sets the tone for the whole stay, and QR codes remove
          the small annoyances that fill it: typing a long WiFi password, hunting for the
          room-service menu, or asking reception for the check-in form. Put a check-in code in the
          pre-arrival message, a WiFi code on the desk and the bedside table, a room-service code in
          the room, and a local-guide code in the lobby, and guests will feel looked after before
          they ask for anything.
        </p>
        <p className="text-base leading-relaxed">
          Check-in codes should open a flow that genuinely finishes check-in, not a page that asks
          the guest to call reception anyway. WiFi codes should use the exact network name and
          password, tested on both iPhone and Android, because a single wrong character turns a
          convenience into a support call. Room-service codes should open a menu with prices and
          ordering, and can carry the room number so the order arrives at the right door.
          Local-guide codes should lead to a page with the information guests actually ask about:
          breakfast times, checkout time, transport, and nearby restaurants.
        </p>

        <AdSlot id="hotel-qr-suite-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          The trade-off with WiFi codes is security. A WiFi QR code contains the network password in
          readable form, so anyone who scans it can read the password. That is acceptable for a
          guest network that is isolated from staff systems and changed regularly, but it is not
          acceptable for a network that reaches staff files or payment systems. Keep guest WiFi
          separate, rotate the password on a schedule, and reprint the codes when you rotate it.
          Never encode staff network credentials in a QR code placed in a public area.
        </p>
        <p className="text-base leading-relaxed">
          Test every code in a real room with a real guest&apos;s phone, on both major platforms,
          before you print the full run. Print WiFi codes at a size that scans from the bed or desk,
          keep room-service codes near where guests sit, and keep the local guide current, because a
          guide that recommends a closed restaurant makes the hotel look careless. Review which
          codes guests actually scan, and fix the ones they ignore, because an ignored code is
          usually a code in the wrong place or pointing at the wrong page.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps hotel codes working is the room check. When a room is cleaned and
          inspected, the housekeeper should confirm the WiFi code scans, the room-service code opens
          the current menu, and the local guide shows current information. Guests judge a hotel by
          the details in their room, and a code that opens last season&apos;s guide or a retired
          menu makes the hotel look careless. Keep a small stock of replacement cards at
          housekeeping so a damaged card is swapped immediately rather than left for the next guest
          to discover. Review the local guide monthly, because restaurants close and transport
          changes.
        </p>
      </article>

      <AdSlot id="hotel-qr-suite-pre-related" format="horizontal-banner" />
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

      <AdSlot id="hotel-qr-suite-bottom" format="horizontal-banner" />
    </div>
  );
}
