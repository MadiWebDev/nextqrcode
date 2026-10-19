'use client';

import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShoppingBag,
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
    id: 'price',
    name: 'Price-Tag QR',
    hint: 'Link a shelf tag to the product page so shoppers can check details and stock without finding staff.',
    fields: [
      { key: 'url', label: 'Product page URL' },
      { key: 'name', label: 'Product name' },
    ],
    template: '{url}?tag=price&item={name}',
  },
  {
    id: 'info',
    name: 'Product-Info QR',
    hint: 'Link to specs, sizing, care instructions, or a how-to video for the product.',
    fields: [{ key: 'url', label: 'Product info URL' }],
    template: '{url}',
  },
  {
    id: 'review',
    name: 'Review QR',
    hint: 'Link to the product or store review page. Put it on receipts and at the exit.',
    fields: [{ key: 'url', label: 'Review page URL' }],
    template: '{url}',
  },
  {
    id: 'loyalty',
    name: 'Loyalty QR',
    hint: 'Encode a loyalty program and member ID so the till can identify the member with one scan.',
    fields: [
      { key: 'program', label: 'Program name' },
      { key: 'member', label: 'Member ID' },
    ],
    template: 'LOYALTY|{program}|{member}',
  },
];
const faqs = [
  {
    question: 'Should the price be encoded in the QR code?',
    answer:
      'No. Encode a pointer to the product page and keep the price on the page and on the printed tag. Prices in the payload go stale the moment a price changes.',
  },
  {
    question: 'Where should product-info codes point?',
    answer:
      "To the exact product's details: specifications, sizing, care instructions, or a short video. Never to the homepage, where the shopper must search for the product.",
  },
  {
    question: 'How do loyalty QR codes work at the till?',
    answer:
      'The code carries the program name and member ID. Staff scan it to identify the member and apply points, without typing a number or searching for an account.',
  },
  {
    question: 'Where should review codes be placed in a store?',
    answer:
      'On receipts and near the exit, where the visit is complete. A review code only at the entrance is seen before the customer has anything to review.',
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

export default function RetailQrSuitePage() {
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
    a.download = `retail-qr-suite-${active.id}.png`;
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
    a.download = `retail-qr-suite-${active.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Retail QR Suite',
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
          { label: 'Retail QR Suite', href: '/retail-qr-suite' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Industry Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Retail QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          A retail toolkit in one place: price-tag QR, product-info QR, review QR, and loyalty QR
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

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How to Use the Retail QR Suite</h2>
        <p className="text-base leading-relaxed">
          In a shop, a QR code is a silent salesperson: it answers the questions a customer has
          while staff are busy. Price-tag codes let shoppers check details and stock, product-info
          codes explain sizing, care, and compatibility, review codes capture the visit while it is
          fresh, and loyalty codes make sign-up and points effortless. The suite works when each
          code has one job and one destination; a code that tries to do everything ends up doing
          nothing well.
        </p>
        <p className="text-base leading-relaxed">
          Price-tag codes should land on the exact product page, not the homepage, because a shopper
          who lands on the wrong page will not search for the right one. Product-info codes are the
          place for the details that do not fit on a label: full specifications, sizing charts, care
          instructions, and short demonstration videos. Review codes belong on receipts and at the
          exit, where the visit is over and the customer can judge it. Loyalty codes should make
          joining or identifying a member take seconds, because any friction at the till creates a
          queue.
        </p>
        <p className="text-base leading-relaxed">
          The trade-off with price-tag codes is whether the price itself lives in the code or on the
          page it points to. Prices inside a QR payload go stale the moment a price changes, and a
          stale price on a shelf is worse than no price at all. Prices on the linked page stay
          current, and the code itself never needs reprinting for a price change. Keep the code as a
          pointer to the product, and keep the price on the page and on the printed tag text.
        </p>
        <p className="text-base leading-relaxed">
          Test codes with real shoppers, not just staff: watch whether they notice the code, whether
          they scan it, and whether the page answers their question. Print shelf codes at a size
          that scans from a comfortable browsing distance, keep them at a consistent height, and
          check weekly for damaged or missing tags. Review the pages the codes point to as often as
          you review the shop floor, because a broken product page turns a helpful code into a dead
          end.
        </p>
        <p className="text-base leading-relaxed">
          A habit that keeps retail codes useful is the weekly shelf walk. Once a week, walk the
          aisles, scan a sample of codes, and confirm each one opens the right product page with the
          right price. Products move, prices change, and pages get retired, and a code that opens
          the wrong product is worse than no code at all. While you walk, check the physical tags:
          replace any that are torn, faded, or missing, and confirm the printed price on each tag
          still matches the till. The shelf walk takes minutes, and it is the difference between a
          store where customers trust the codes and one where they have learned to ignore them.
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
