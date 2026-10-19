'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Download, Copy, CheckCircle2 } from 'lucide-react';
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
    id: 'catalogue',
    label: 'Catalogue QR',
    hint: 'Link a shelf or display to a catalogue record.',
    fields: [
      { key: 'title', label: 'Book title', hint: 'Example: The History of Maps' },
      { key: 'author', label: 'Author', hint: 'Example: Jane Okafor' },
      {
        key: 'url',
        label: 'Catalogue record URL',
        hint: 'Example: https://yourlibrary.org/catalog/12345',
      },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Library catalogue: ${v.title || 'Untitled'}${v.author ? ` by ${v.author}` : ''}`,
  },
  {
    id: 'event',
    label: 'Event QR',
    hint: 'Promote story time, talks, and workshops.',
    fields: [
      { key: 'event', label: 'Event name', hint: 'Example: Saturday Story Time' },
      { key: 'when', label: 'Date and time', hint: 'Example: Saturdays, 10:30 AM' },
      {
        key: 'url',
        label: 'Event page or booking URL',
        hint: 'Example: https://yourlibrary.org/events/story-time',
      },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Library event: ${v.event || 'Event'} | ${v.when || 'See library schedule'}`,
  },
  {
    id: 'membership',
    label: 'Membership QR',
    hint: 'Send new readers to the sign-up form.',
    fields: [
      { key: 'name', label: 'Library name', hint: 'Example: Riverside Public Library' },
      {
        key: 'url',
        label: 'Membership sign-up URL',
        hint: 'Example: https://yourlibrary.org/join',
      },
      {
        key: 'note',
        label: 'What to bring (optional)',
        hint: 'Example: Bring photo ID and proof of address',
      },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Library membership: ${v.name || 'Your library'}${v.note ? ` — ${v.note}` : ''}`,
  },
  {
    id: 'book-label',
    label: 'Book Label QR',
    hint: 'Stick a code inside a cover for quick lookup.',
    fields: [
      { key: 'title', label: 'Book title', hint: 'Example: Field Guide to Birds' },
      { key: 'call', label: 'Call number', hint: 'Example: 598.2 FIE' },
      { key: 'shelf', label: 'Shelf or section', hint: 'Example: Nature shelf, Row B' },
    ],
    build: (v) =>
      `Book label — ${v.title || 'Untitled'} | Call number: ${v.call || 'Ask at desk'} | Shelf: ${v.shelf || 'See catalogue'}`,
  },
];

const FAQS = [
  {
    question: 'What should a catalogue QR code link to?',
    answer:
      'Link to the catalogue record for that title, not to the library homepage. A visitor who scans a code beside a display wants that book: its availability, its shelf location, and a way to place a hold. Every extra click between the scan and that answer loses readers.',
  },
  {
    question: 'How do libraries use QR codes for events without reprinting posters?',
    answer:
      'Print the event code on a reusable poster frame or stand, and point the code at an events page your team can update. When one event ends, the same printed poster can promote the next one by changing the page it links to, as long as the printed text beside the code stays general.',
  },
  {
    question: 'Should a membership QR code collect personal data?',
    answer:
      'The code itself should only link to your normal sign-up form. Do not encode personal details in a printed code. Keep the form short, explain what the library uses the data for, and offer a paper form for anyone who prefers it.',
  },
  {
    question: 'Do book-label QR codes survive normal library wear?',
    answer:
      'Codes printed on the inside cover or on a protective label last far longer than codes on a dust jacket, which gets replaced or removed. Print at a size that scans from a comfortable reading distance, and test a label after it has been covered with protective film, since glare can hurt scanning.',
  },
];

export default function LibraryQRSuitePage() {
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
    a.download = `library-qr-${preset.id}.svg`;
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
    name: 'Library QR Suite',
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
          { label: 'Library QR Suite', href: '/library-qr-suite' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Library Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Library QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build catalogue, event, membership, and book-label QR codes. Pick a preset, fill in the
          details, and download a working code for shelves, posters, and books.
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
                <Label htmlFor={`library-${f.key}`}>{f.label}</Label>
                <Input
                  id={`library-${f.key}`}
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
                alt="Library QR code preview"
                className="w-56 h-56 mx-auto rounded-lg border"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">Generating preview…</p>
            )}
            <div className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{payload}</div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <a href={qrUrl} download={`library-qr-${preset.id}.png`}>
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
          How libraries use QR codes without adding friction
        </h2>
        <p className="text-base leading-relaxed">
          A library is one of the few places where a QR code competes with something simpler: a
          person at a desk who can answer the question. Codes earn their place when they save a trip
          to the desk or when the desk is closed. A catalogue code beside a display lets a reader
          check availability and place a hold without hunting for a catalogue terminal. An event
          code on a poster lets a parent book a place from the bus. A membership code in a school
          newsletter lets a family start the sign-up at home. In each case the code is a shortcut,
          not a replacement for staff help, and the printed material should say so.
        </p>
        <p className="text-base leading-relaxed">
          Catalogue codes work best when they link to the specific record, not to a search page or
          the library homepage. A reader who scans beside a display wants one book, and every extra
          click is a chance to give up. If your catalogue URLs are long, use a short, stable
          redirect that your team controls, and test the link after every catalogue system upgrade,
          since upgrades are the most common moment for catalogue URLs to change shape. Print the
          call number beside the code as a fallback, so the code is a convenience and not the only
          route to the shelf.
        </p>
        <p className="text-base leading-relaxed">
          Event codes have a different lifespan. A poster for a single workshop is temporary, so the
          cost of reprinting is part of the plan. A better approach for recurring programs is a
          durable poster that promotes the series and links to a living events page. When the poster
          text stays general — &quot;Story time every Saturday, scan for times&quot; — the same
          printed poster can serve for months while the page behind it changes. Check the page after
          each season change, and take down posters whose events have passed, because a code that
          leads to last month&apos;s event teaches visitors not to scan the next one.
        </p>
        <p className="text-base leading-relaxed">
          Membership and book-label codes raise questions of privacy and durability. A membership
          code should only open the normal sign-up form; it should never encode personal details,
          and the form should explain in plain language what the library does with the data. A
          book-label code lives inside a cover, which means it must survive shelving, cleaning, and
          protective film. Print labels on stock that tolerates handling, test a finished label
          after the film is applied, and keep the payload short so the code stays scannable even
          after years of wear. A code that stops scanning is worse than no code, because visitors
          blame themselves before they blame the label.
        </p>
        <p className="text-base leading-relaxed">
          Finally, remember that not every visitor can or wants to scan. Keep the essential
          information in print beside every code: the call number, the event time, the desk phone
          number. Offer paper forms alongside digital ones, and make sure the pages your codes link
          to work with screen readers and keyboard navigation. A library that treats QR codes as one
          option among several — rather than the only option — keeps its doors open to every reader.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Library QR Codes
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
