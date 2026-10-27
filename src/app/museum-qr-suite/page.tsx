'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, Download, Copy, CheckCircle2 } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

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
    id: 'exhibit',
    label: 'Exhibit QR',
    hint: 'Link an object label to a deeper story page.',
    fields: [
      { key: 'title', label: 'Exhibit title', hint: 'Example: The Bronze Horse' },
      { key: 'id', label: 'Exhibit ID or gallery number', hint: 'Example: Gallery 3, Case 12' },
      {
        key: 'url',
        label: 'Exhibit page URL',
        hint: 'Example: https://yourmuseum.org/exhibits/bronze-horse',
      },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Museum exhibit: ${v.title || 'Untitled exhibit'}${v.id ? ` (ID: ${v.id})` : ''}`,
  },
  {
    id: 'audio',
    label: 'Audio Guide QR',
    hint: 'Start an audio stop without an app download.',
    fields: [
      { key: 'title', label: 'Audio stop title', hint: 'Example: Stop 4 — The Foundry' },
      {
        key: 'url',
        label: 'Audio file or page URL',
        hint: 'Example: https://yourmuseum.org/audio/stop-4.mp3',
      },
      { key: 'lang', label: 'Language', hint: 'Example: English' },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Audio guide: ${v.title || 'Untitled stop'}${v.lang ? ` (Language: ${v.lang})` : ''}`,
  },
  {
    id: 'ticket',
    label: 'Ticket QR',
    hint: 'Encode a ticket reference visitors show at entry.',
    fields: [
      { key: 'name', label: 'Visitor name', hint: 'Example: Alex Rivera' },
      { key: 'exhibition', label: 'Exhibition', hint: 'Example: Ancient Trade Routes' },
      { key: 'date', label: 'Visit date', hint: 'Example: 2027-03-14' },
    ],
    build: (v) =>
      `Museum ticket — Visitor: ${v.name || 'Guest'} | Exhibition: ${v.exhibition || 'General admission'} | Date: ${v.date || 'Open date'}`,
  },
  {
    id: 'donation',
    label: 'Donation QR',
    hint: 'Send visitors to a giving page from any gallery.',
    fields: [
      { key: 'campaign', label: 'Campaign name', hint: 'Example: Restore the East Wing' },
      { key: 'url', label: 'Donation page URL', hint: 'Example: https://yourmuseum.org/donate' },
      { key: 'amount', label: 'Suggested amount (optional)', hint: 'Example: 25' },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Museum donation — Campaign: ${v.campaign || 'General fund'}${v.amount ? ` | Suggested gift: ${v.amount}` : ''}`,
  },
];

const FAQS = [
  {
    question: 'Should a museum exhibit QR code link to a page or contain the text itself?',
    answer:
      'Link to a page whenever the content might change. A printed label can stay in place for years, so the page behind it should be one your team controls and can update without reprinting. Put the text directly in the code only for short, permanent facts such as an object number that will never change.',
  },
  {
    question: 'How do audio-guide QR codes work for visitors without the museum app?',
    answer:
      'The code links to a normal web page that plays audio in the browser, so no app install is needed. Keep the page light, put the play button at the top, and offer a transcript on the same page for visitors who prefer reading or who use assistive technology.',
  },
  {
    question: 'What belongs on a museum ticket QR code?',
    answer:
      'A short ticket reference plus the exhibition and date is enough. Avoid encoding personal details such as addresses or payment information in a ticket code, since anyone who photographs it can read the payload. Your ticketing system should resolve the reference to the full record.',
  },
  {
    question: 'Where should donation QR codes be placed in a gallery?',
    answer:
      'Place them where visitors naturally pause and feel a connection to the work: near the end of a popular gallery, beside a conservation story, or at the exit. Pair the code with one clear sentence about what the gift supports, and keep the donation page short so a visitor standing in the gallery can finish it.',
  },
];

export default function MuseumQRSuitePage() {
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
    a.download = `museum-qr-${preset.id}.svg`;
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
    name: 'Museum QR Suite',
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
          { label: 'Museum QR Suite', href: '/museum-qr-suite' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Landmark className="w-3.5 h-3.5" />
          <span>Museum Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Museum QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build exhibit, audio-guide, ticket, and donation QR codes for galleries. Pick a preset,
          fill in the details, and download a working code for print or display.
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
                <Label htmlFor={`museum-${f.key}`}>{f.label}</Label>
                <Input
                  id={`museum-${f.key}`}
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
                alt="Museum QR code preview"
                className="w-56 h-56 mx-auto rounded-lg border"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">Generating preview…</p>
            )}
            <div className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{payload}</div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <a href={qrUrl} download={`museum-qr-${preset.id}.png`}>
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

      <AdSlot id="museum-qr-suite-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How museums use QR codes well</h2>
        <p className="text-base leading-relaxed">
          A museum label has a hard limit: a visitor standing in a gallery will read a few dozen
          words before moving on. A QR code earns its place when it carries a visitor from that
          short label to something the wall cannot hold — a longer story, a voice, a film clip, or a
          way to support the work. The codes that get scanned are the ones with a clear reason to
          scan. A bare code with no explanation is easy to ignore, while a code under a line such as
          &quot;Hear the artist describe this piece — 2 minutes&quot; tells the visitor exactly what
          they will get and how long it will take.
        </p>
        <p className="text-base leading-relaxed">
          Exhibit codes deserve the most care because they live the longest. A temporary exhibition
          label might be up for three months, but a permanent-gallery label can stay for years.
          Point exhibit codes at pages your own team controls, and keep the page address stable even
          when you redesign the site. If the page moves, the printed code becomes a dead end that no
          one notices until a visitor complains. Before a gallery opens, scan every code from the
          distance a visitor will stand, on more than one phone, and check that the page loads
          quickly on gallery Wi-Fi or a weak mobile signal.
        </p>

        <AdSlot id="museum-qr-suite-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          Audio-guide codes solve a different problem: they replace a queue for a rented device with
          a page that plays in the browser. The trade-off is that visitors now depend on their own
          phone battery, headphones, and connection. Help them by keeping the audio page extremely
          light, putting the play button above the fold, and offering a transcript on the same page.
          Transcripts also serve visitors who are deaf or hard of hearing and visitors who would
          rather read quietly in a shared gallery. If your audio lives on a streaming platform,
          confirm that it plays without forcing an account sign-in, because a login wall in the
          middle of a gallery is where most visitors give up.
        </p>
        <p className="text-base leading-relaxed">
          Ticket codes carry a different kind of risk. They are credentials, so they should encode
          as little as possible: a short reference that your system resolves at the door, plus the
          exhibition and date for human readability. Never encode payment details, addresses, or
          full membership records in a ticket code, since a photograph of a ticket can be read by
          anyone. Print ticket codes at a size that scans on the first attempt at a busy entrance,
          and keep a fallback — a readable reference number printed beside the code — for the moment
          a screen is cracked or a battery dies.
        </p>
        <p className="text-base leading-relaxed">
          Donation codes work best where a visitor already feels something: beside a conservation
          story, at the end of a gallery that moved them, or near the exit after a good visit. One
          honest sentence about what the gift supports outperforms a generic appeal, and the
          donation page should be finishable in under a minute from a phone. After launch, check the
          basics regularly: scan each code once a season, confirm the destination still exists, and
          replace any code whose page has drifted into irrelevance. A small museum with twenty
          working codes serves visitors better than a large one with two hundred forgotten ones.
        </p>
      </article>

      <AdSlot id="museum-qr-suite-pre-related" format="horizontal-banner" />
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Museum QR Codes
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

      <AdSlot id="museum-qr-suite-bottom" format="horizontal-banner" />
    </div>
  );
}
