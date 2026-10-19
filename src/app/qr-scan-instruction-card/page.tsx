'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Smartphone } from 'lucide-react';

const FAQS = [
  {
    question: 'Do people still need a QR scanner app?',
    answer:
      "No. Modern iPhones and Android phones scan QR codes with the built-in Camera app. The card's steps use only that app, with no downloads.",
  },
  {
    question: 'What if nothing happens when I point the camera?',
    answer:
      'Hold the phone steady a little longer, move slightly closer or further away, and check that QR scanning is enabled in the camera settings. On some Android phones the setting is under Camera settings or Lens suggestions.',
  },
  {
    question: 'Which languages should I print the card in?',
    answer:
      'The languages your visitors actually read. Print a complete card in each language rather than cramming several translations onto one small sheet.',
  },
  {
    question: 'Where should the card go?',
    answer:
      'At eye level, directly beside the QR code, in large legible type. If the code is behind glass or in dim light, the card should be in the same spot, not on a different wall.',
  },
];

export default function QrScanInstructionCardPage() {
  const LANGS: Record<
    string,
    { title: string; iphone: string[]; android: string[]; note: string }
  > = {
    en: {
      title: 'How to Scan This QR Code',
      iphone: [
        'Open the Camera app.',
        'Point your iPhone at the code. Hold steady.',
        'Tap the yellow notification banner that appears.',
      ],
      android: [
        'Open the Camera app.',
        'Point your phone at the code. Hold steady.',
        'Tap the pop-up link that appears.',
      ],
      note: 'No special app is needed. If nothing appears, check that QR scanning is enabled in your camera settings.',
    },
    es: {
      title: 'Cómo escanear este código QR',
      iphone: [
        'Abre la app Cámara.',
        'Apunta tu iPhone al código. Mantén el teléfono quieto.',
        'Toca el aviso amarillo que aparece.',
      ],
      android: [
        'Abre la app Cámara.',
        'Apunta tu teléfono al código. Mantén el teléfono quieto.',
        'Toca el enlace emergente que aparece.',
      ],
      note: 'No necesitas ninguna aplicación especial. Si no aparece nada, comprueba que el escaneo de códigos QR está activado en los ajustes de la cámara.',
    },
    fr: {
      title: 'Comment scanner ce QR code',
      iphone: [
        'Ouvrez l\u2019app Appareil photo.',
        'Pointez votre iPhone vers le code. Tenez-le immobile.',
        'Touchez la bannière jaune qui apparaît.',
      ],
      android: [
        'Ouvrez l\u2019app Appareil photo.',
        'Pointez votre téléphone vers le code. Tenez-le immobile.',
        'Touchez le lien qui apparaît.',
      ],
      note: 'Aucune application spéciale n\u2019est nécessaire. Si rien n\u2019apparaît, vérifiez que la lecture des QR codes est activée dans les réglages de l\u2019appareil photo.',
    },
    de: {
      title: 'So scannen Sie diesen QR-Code',
      iphone: [
        'Öffnen Sie die Kamera-App.',
        'Richten Sie Ihr iPhone auf den Code. Halten Sie es ruhig.',
        'Tippen Sie auf das gelbe Benachrichtigungsbanner.',
      ],
      android: [
        'Öffnen Sie die Kamera-App.',
        'Richten Sie Ihr Handy auf den Code. Halten Sie es ruhig.',
        'Tippen Sie auf den eingeblendeten Link.',
      ],
      note: 'Es ist keine spezielle App erforderlich. Wenn nichts erscheint, prüfen Sie, ob das QR-Scannen in den Kameraeinstellungen aktiviert ist.',
    },
  };
  const [lang, setLang] = useState('en');
  const [layout, setLayout] = useState<'stacked' | 'side'>('side');
  const [headline, setHeadline] = useState('');
  const t = LANGS[lang];
  const shownTitle = headline.trim() || t.title;
  function printCard() {
    window.print();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Scan Instruction Card',
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
          { label: 'QR Scan Instruction Card', href: '/qr-scan-instruction-card' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Print Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Scan Instruction Card
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate a printable How to scan instruction card — iPhone and Android steps — in several
          languages and layouts.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Language</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(LANGS).map((l) => (
                <Button
                  key={l}
                  size="sm"
                  variant={lang === l ? 'default' : 'outline'}
                  onClick={() => setLang(l)}
                >
                  {l === 'en'
                    ? 'English'
                    : l === 'es'
                      ? 'Español'
                      : l === 'fr'
                        ? 'Français'
                        : 'Deutsch'}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Layout</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={layout === 'side' ? 'default' : 'outline'}
                onClick={() => setLayout('side')}
              >
                Side by side
              </Button>
              <Button
                size="sm"
                variant={layout === 'stacked' ? 'default' : 'outline'}
                onClick={() => setLayout('stacked')}
              >
                Stacked
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sic-headline">Custom headline (optional)</Label>
            <Input
              id="sic-headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder={t.title}
            />
          </div>
          <Button onClick={printCard}>Print instruction card</Button>
          <p className="text-xs text-muted-foreground">
            Print this card and place it next to any QR code used by the public. The steps use only
            the built-in camera app — no downloads, no special scanner.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Card preview</p>
          <div className="rounded-xl border bg-white text-slate-900 p-5 shadow-sm">
            <h3 className="text-lg font-bold text-center mb-4">{shownTitle}</h3>
            <div className={layout === 'side' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-sm mb-2">iPhone</p>
                <ol className="list-decimal pl-4 space-y-1 text-xs">
                  {t.iphone.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-sm mb-2">Android</p>
                <ol className="list-decimal pl-4 space-y-1 text-xs">
                  {t.android.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">{t.note}</p>
          </div>
        </Card>
      </div>
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why a Scan Instruction Card Earns You More Scans
        </h2>
        <p className="text-base leading-relaxed">
          A large share of people who do not scan a QR code are not uninterested. They are unsure.
          They do not know whether their phone can scan it, whether they need an app, or what will
          happen when they point the camera. An instruction card removes that uncertainty in three
          short steps, and it does so at exactly the moment of decision, next to the code itself.
          For venues that serve older visitors, tourists, or anyone who is not confident with
          phones, a card is often the difference between a code that gets used and a code that gets
          ignored.
        </p>
        <p className="text-base leading-relaxed">
          The steps themselves should be as short and as ordinary as possible. Open the Camera app,
          point the phone at the code, tap the banner that appears is the entire procedure on both
          major platforms, and it should be written that way. Avoid jargon like decode, capture, or
          launch the scanner, and avoid telling people to download a QR reader, because that advice
          is outdated and it adds a step that makes many people give up. The single most reassuring
          sentence on the card is the note that no special app is needed, because the fear of
          installing something unknown is the biggest barrier for cautious users.
        </p>
        <p className="text-base leading-relaxed">
          Language choice is a practical decision, not a decorative one. A card in the language your
          visitors actually read will outperform a prettier card in the wrong language every time.
          Tourist venues, transport hubs, and hospitals should print cards in the two or three
          languages most common among their visitors, and each card should be complete in one
          language rather than cramming three translations onto one small sheet. If you serve a
          multilingual audience and can only place one card, pick the language of the majority and
          add a short line in the second language pointing to staff who can help.
        </p>
        <p className="text-base leading-relaxed">
          Placement and print quality matter as much as the wording. The card belongs at eye level,
          beside the code, in type large enough to read at the distance from which people will
          stand. Small grey text under a poster is not an instruction card; it is decoration. Print
          on matte stock so the card itself does not glare, and keep the card close enough to the
          code that a reader can follow the steps without looking away and losing their place. If
          the code is behind glass or in a dim corner, the card should be there too, in the same
          light.
        </p>
        <p className="text-base leading-relaxed">
          Test the card the way you test the code: hand it to someone who has never scanned a code
          in your venue and watch them follow it without help. If they hesitate at any step, rewrite
          that step. The most common hesitation is what to do after pointing the camera, so make the
          tap-the-banner step explicit and name the banner&apos;s color and position. A card that a
          stranger can follow in ten seconds without asking a question is a card that is doing its
          job, and it will keep earning scans long after the novelty of the code itself has worn
          off.
        </p>
      </article>
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
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
