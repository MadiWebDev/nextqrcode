'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Download, Copy, CheckCircle2 } from 'lucide-react';
import QRCodeLib from 'qrcode';

interface PresetField {
  key: string;
  label: string;
  hint: string;
}

interface Preset {
  id: string;
  label: string;
  hint: string;
  fields: PresetField[];
  build: (v: Record<string, string>) => string;
}

const PRESETS: Preset[] = [
  {
    id: 'booking',
    label: 'Booking QR',
    hint: 'Let a passenger open the booking page from a card or window sign.',
    fields: [
      { key: 'url', label: 'Booking page URL', hint: 'Example: https://yourcab.example/book' },
      { key: 'phone', label: 'Booking phone number', hint: 'Example: +1 555 014 2200' },
      { key: 'area', label: 'Service area', hint: 'Example: Downtown and airport' },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Taxi booking — Call: ${v.phone || 'See cab door sign'} | Area: ${v.area || 'Local service'}`,
  },
  {
    id: 'driver',
    label: 'Driver Profile QR',
    hint: 'Show a passenger who their driver is before the ride.',
    fields: [
      { key: 'name', label: 'Driver name', hint: 'Example: Sam Delgado' },
      { key: 'licence', label: 'Licence or badge number', hint: 'Example: Badge 4817' },
      { key: 'vehicle', label: 'Vehicle', hint: 'Example: Silver sedan, plate ABC-1234' },
    ],
    build: (v) =>
      `Driver: ${v.name || 'Your driver'} | Badge: ${v.licence || '—'} | Vehicle: ${v.vehicle || '—'}`,
  },
  {
    id: 'fare',
    label: 'Fare Estimate QR',
    hint: 'Show the fare for a fixed route before anyone gets in.',
    fields: [
      { key: 'from', label: 'From', hint: 'Example: Central Station' },
      { key: 'to', label: 'To', hint: 'Example: Airport Terminal 2' },
      { key: 'fare', label: 'Estimated fare', hint: 'Example: 28 (currency shown on sign)' },
    ],
    build: (v) =>
      `Fare estimate — From: ${v.from || '—'} | To: ${v.to || '—'} | Estimated fare: ${v.fare || 'Ask driver for meter rate'}`,
  },
  {
    id: 'receipt',
    label: 'Receipt QR',
    hint: 'Give passengers a code that opens or identifies their receipt.',
    fields: [
      { key: 'trip', label: 'Trip or receipt ID', hint: 'Example: TRIP-77812' },
      { key: 'fare', label: 'Fare charged', hint: 'Example: 31.50' },
      { key: 'date', label: 'Date', hint: 'Example: 2027-04-11' },
    ],
    build: (v) =>
      `Taxi receipt — Trip: ${v.trip || '—'} | Fare: ${v.fare || '—'} | Date: ${v.date || '—'}`,
  },
];

const FAQS = [
  {
    question: 'Should a taxi booking QR code link to a page or show a phone number?',
    answer:
      'Do both: the code links to the booking page, and the phone number is printed in readable text beside it. A passenger with a dead battery, no signal, or an older phone can still call, and a passenger who prefers booking online gets a one-scan route.',
  },
  {
    question: 'What driver details are safe to put in a profile QR code?',
    answer:
      'First name, badge or licence number, vehicle description, and plate number — the same details a passenger is entitled to see in the cab. Never encode home addresses, personal phone numbers, or national ID numbers in a code that anyone in the vehicle can photograph.',
  },
  {
    question: 'Is a fare-estimate QR code a binding price?',
    answer:
      'Only if the printed sign says so. Most estimates are guides that change with traffic, route, and waiting time. Print the word estimate beside the fare, state what is included, and say that the metered fare is the final charge where meters are required.',
  },
  {
    question: 'How should receipt QR codes handle passenger privacy?',
    answer:
      'Keep the payload to the trip reference, fare, and date. Pickup and drop-off addresses are sensitive — a receipt code that encodes a home address can expose where someone lives. If a full receipt is needed, link to a receipt page that asks the passenger to confirm the trip reference first.',
  },
];

export default function TaxiQRSuitePage() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const payload = useMemo(() => preset.build(values), [preset, values]);

  useEffect(() => {
    let live = true;
    QRCodeLib.toDataURL(payload, { errorCorrectionLevel: 'M', width: 512, margin: 2 })
      .then((u) => {
        if (live) setQrUrl(u);
      })
      .catch(() => {
        if (live) setQrUrl('');
      });
    return () => {
      live = false;
    };
  }, [payload]);

  const downloadSvg = async () => {
    const svg = await QRCodeLib.toString(payload, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 2,
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taxi-qr-${preset.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyPayload = async () => {
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Taxi QR Suite',
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
          { label: 'Taxi QR Suite', href: '/taxi-qr-suite' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Car className="w-3.5 h-3.5" />
          <span>Taxi Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Taxi QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build booking, driver-profile, fare-estimate, and receipt QR codes. Pick a preset, fill in
          the details, and download a working code for cards, window signs, and receipts.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">1. Choose a preset</h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPresetId(p.id);
                    setValues({});
                  }}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${
                    presetId === p.id
                      ? 'border-primary bg-primary/5 font-semibold'
                      : 'border-border hover:border-border/80 text-muted-foreground'
                  }`}
                >
                  <div className="text-foreground text-sm">{p.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{p.hint}</div>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">2. Fill in the details</h2>
            {preset.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={`taxi-${f.key}`}>{f.label}</Label>
                <Input
                  id={`taxi-${f.key}`}
                  value={values[f.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
                <p className="text-[11px] text-muted-foreground">{f.hint}</p>
              </div>
            ))}
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Your QR code</h2>
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="Taxi QR code preview"
                className="w-56 h-56 mx-auto rounded-lg border"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">Generating preview…</p>
            )}
            <div className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{payload}</div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <a href={qrUrl} download={`taxi-qr-${preset.id}.png`}>
                  <Download className="w-3.5 h-3.5" /> PNG
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={downloadSvg} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> SVG
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={copyPayload} className="w-full gap-1.5">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy payload text'}
            </Button>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          QR codes that make taxi rides smoother and safer
        </h2>
        <p className="text-base leading-relaxed">
          A taxi ride is a short, high-trust interaction between strangers. The passenger needs to
          know three things quickly: that this is the right vehicle, what the ride will cost, and
          how to get a receipt afterwards. QR codes can answer all three without forcing the
          passenger to install an app or hand over personal details. The codes that work best in
          cabs are the simplest ones, printed where a seated passenger can scan them without leaning
          across the driver, and paired with the same information in readable print.
        </p>
        <p className="text-base leading-relaxed">
          Booking codes belong where future passengers will see them: on a business card, a hotel
          desk, a restaurant counter, or a window sign at a rank. The code should open the booking
          page in one scan, and the phone number should be printed beside it for anyone who cannot
          scan. Keep the booking page light and fast, because a passenger at a rank is often on a
          weak signal and in a hurry. If the booking page changes address, update the printed cards
          at the same time — a stack of cards pointing at a dead page is worse than no cards at all.
        </p>
        <p className="text-base leading-relaxed">
          Driver-profile codes serve safety. A passenger who can check the driver&apos;s name, badge
          number, vehicle, and plate against what is in front of them can confirm they are in the
          right car before the doors close. The trade-off is privacy: the code should carry only the
          details a passenger is entitled to see in the cab. Never encode a driver&apos;s home
          address, personal phone number, or national ID in a code that any passenger can photograph
          and keep. If a profile page exists, it should show the same limited details and nothing
          more.
        </p>
        <p className="text-base leading-relaxed">
          Fare-estimate codes prevent the most common taxi argument: the gap between the price a
          passenger expected and the price on the meter. A fixed-route fare card — station to
          airport, hotel to conference centre — with a scannable estimate gives both sides a shared
          reference. The word estimate must be on the card, with a note about what affects the final
          fare: traffic, route changes, waiting time, and luggage. Where meters are legally
          required, say plainly that the metered fare is the final charge. A fare card that
          over-promises a low price will generate complaints that no code can fix.
        </p>
        <p className="text-base leading-relaxed">
          Receipt codes close the ride. The useful payload is small: trip reference, fare, and date.
          Pickup and drop-off addresses are sensitive — a receipt that encodes a home address can
          expose where someone lives — so keep addresses off the code itself and behind a
          confirmation step if a full receipt page is offered. Print the trip reference in readable
          text beside the code, so a passenger with a cracked screen or a dead battery can still
          claim expenses. Check the codes regularly, reprint faded ones, and retire booking cards
          the moment the booking page moves.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Taxi QR Codes
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
    </div>
  );
}
