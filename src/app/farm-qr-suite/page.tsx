'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, Download, Copy, CheckCircle2 } from 'lucide-react';
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
    id: 'traceability',
    label: 'Produce Traceability QR',
    hint: 'Let buyers see where this batch came from.',
    fields: [
      { key: 'product', label: 'Product', hint: 'Example: Heirloom tomatoes' },
      { key: 'harvest', label: 'Harvest date', hint: 'Example: 2027-05-02' },
      { key: 'lot', label: 'Lot or batch number', hint: 'Example: LOT-TOM-051' },
      {
        key: 'url',
        label: 'Traceability page URL (optional)',
        hint: 'Example: https://yourfarm.example/trace/LOT-TOM-051',
      },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Produce: ${v.product || 'Farm produce'} | Harvest: ${v.harvest || '—'} | Lot: ${v.lot || '—'}`,
  },
  {
    id: 'shop',
    label: 'Farm Shop QR',
    hint: 'Point visitors to the shop, its hours, and what is in stock.',
    fields: [
      { key: 'name', label: 'Farm shop name', hint: 'Example: Hilltop Farm Shop' },
      { key: 'url', label: 'Shop page URL', hint: 'Example: https://yourfarm.example/shop' },
      { key: 'hours', label: 'Opening hours', hint: 'Example: Fri–Sun, 9 AM – 4 PM' },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Farm shop: ${v.name || 'Farm shop'} | Hours: ${v.hours || 'See farm notice board'}`,
  },
  {
    id: 'stall',
    label: 'Market Stall QR',
    hint: 'Turn a market stall into a repeat-visit channel.',
    fields: [
      { key: 'stall', label: 'Stall name', hint: 'Example: Hilltop Farm — Stall 7' },
      { key: 'market', label: 'Market and day', hint: 'Example: Riverside Market, Saturdays' },
      {
        key: 'products',
        label: 'What you sell',
        hint: 'Example: Eggs, honey, seasonal vegetables',
      },
    ],
    build: (v) =>
      `Market stall: ${v.stall || 'Farm stall'} | ${v.market || 'Local market'} | Sells: ${v.products || 'Seasonal produce'}`,
  },
  {
    id: 'csa',
    label: 'CSA Sign-up QR',
    hint: 'Send market visitors to the box-scheme sign-up.',
    fields: [
      { key: 'name', label: 'CSA or box scheme name', hint: 'Example: Hilltop Weekly Veg Box' },
      { key: 'url', label: 'Sign-up page URL', hint: 'Example: https://yourfarm.example/csa' },
      { key: 'season', label: 'Season', hint: 'Example: Summer 2027 — 12 weeks' },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `CSA sign-up: ${v.name || 'Farm box scheme'} | Season: ${v.season || 'See farm site'}`,
  },
];

const FAQS = [
  {
    question: 'What should a produce traceability QR code show?',
    answer:
      'At minimum: what it is, where it was grown, when it was harvested, and the lot number. Link to a page with those facts plus any certifications and handling notes. Keep the page accurate for the lot the code is printed on — a traceability page that describes a different harvest is worse than none.',
  },
  {
    question: 'Do farm QR codes need internet access to work?',
    answer:
      'Codes that link to a page need a connection, which is not guaranteed in a field, barn, or rural market. Codes that contain the facts themselves — product, lot, harvest date — work offline. For traceability and market stalls, encoding the key facts directly in the code is often the safer choice.',
  },
  {
    question: 'How do I keep market-stall codes useful after the market ends?',
    answer:
      'Put the durable facts in the code — farm name, what you sell, and a stable link such as your main farm page — and keep market-specific details (stall number, this week only offers) in the printed text beside it. That way the code stays valid when the stall moves or the market changes days.',
  },
  {
    question: 'Should CSA sign-up codes promise a price?',
    answer:
      'Only if the price is printed on the same sign and matches the page. A market visitor who scans, sees a different price online, and walks away has lost trust in the farm, not just in the code. Keep prices in one place you control, and update both together.',
  },
];

export default function FarmQRSuitePage() {
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
    a.download = `farm-qr-${preset.id}.svg`;
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
    name: 'Farm QR Suite',
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
          { label: 'Farm QR Suite', href: '/farm-qr-suite' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Sprout className="w-3.5 h-3.5" />
          <span>Farm Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Farm QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build produce-traceability, farm-shop, market-stall, and CSA sign-up QR codes. Pick a
          preset, fill in the details, and download a working code for packaging, stalls, and signs.
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
                <Label htmlFor={`farm-${f.key}`}>{f.label}</Label>
                <Input
                  id={`farm-${f.key}`}
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
                alt="Farm QR code preview"
                className="w-56 h-56 mx-auto rounded-lg border"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">Generating preview…</p>
            )}
            <div className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{payload}</div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <a href={qrUrl} download={`farm-qr-${preset.id}.png`}>
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
          QR codes for farms, markets, and box schemes
        </h2>
        <p className="text-base leading-relaxed">
          A farm sells trust as much as produce. A shopper at a market cannot see how a vegetable
          was grown, when it was picked, or whether the eggs came from the hens they can see across
          the yard. A QR code is a compact way to close that gap, but only when the facts behind it
          are accurate for the exact batch in the shopper&apos;s hand. A traceability code that
          describes a different harvest, a stale shop page, or a sign-up form for a season that
          ended teaches shoppers to ignore the next code they see.
        </p>
        <p className="text-base leading-relaxed">
          Traceability codes deserve the strictest discipline. The lot number is the anchor:
          everything the code says should be true for that lot. At minimum, show the product, the
          farm or field, the harvest date, and the lot number. If you link to a page, keep the page
          live and correct for as long as that lot could plausibly be on a shelf, and include
          handling and storage notes a buyer can act on. For wholesale buyers, a code that carries
          the lot facts directly — rather than a link — keeps working in a cold store with no
          signal, which is exactly where traceability is checked.
        </p>
        <p className="text-base leading-relaxed">
          Farm-shop and market-stall codes live outdoors, in sun, rain, and condensation, and they
          are read by people holding bags in one hand and a phone in the other. Print them larger
          than you think necessary, on weather-resistant stock, and mount them where a shopper can
          stand and scan without blocking the queue. Keep the printed text beside the code short and
          honest: what the farm sells, when the shop is open, where to sign up. A code that promises
          a farm tour or a tasting that no longer runs will cost more goodwill than the code ever
          earned.
        </p>
        <p className="text-base leading-relaxed">
          CSA and box-scheme codes are conversion tools, and they fail for the same reason most
          sign-up links fail: the page behind them asks too much. A market visitor who scans at a
          stall is standing up, possibly in the rain, with a short window of attention. The sign-up
          page should explain the box, the price, the collection point, and the first delivery date
          in one screen, and let the visitor start with a name and an email address. If prices or
          collection points change, update the page and the printed sign together; a mismatch
          between the two is the fastest way to lose a new member.
        </p>
        <p className="text-base leading-relaxed">
          Finally, keep the human fallback. Print the farm name, the product, and the lot number in
          readable text beside every code, so a shopper without a phone or without signal can still
          read what matters. Check printed codes each season: scan them, confirm the page still
          exists, and reprint any that have faded, peeled, or drifted out of date. A farm that
          maintains a small set of honest, working codes builds a reputation that no amount of
          packaging design can buy.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Farm QR Codes
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
