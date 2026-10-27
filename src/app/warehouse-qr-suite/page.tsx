'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Download, Copy, CheckCircle2 } from 'lucide-react';
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
    id: 'bin',
    label: 'Bin Location QR',
    hint: 'Stick on racking so a scanner lands on the right bin.',
    fields: [
      { key: 'bin', label: 'Bin code', hint: 'Example: A-04-12' },
      { key: 'aisle', label: 'Aisle', hint: 'Example: Aisle 4' },
      { key: 'zone', label: 'Zone', hint: 'Example: Ambient' },
    ],
    build: (v) =>
      `Bin: ${v.bin || 'Unassigned'} | Aisle: ${v.aisle || '—'} | Zone: ${v.zone || '—'}`,
  },
  {
    id: 'stock',
    label: 'Stock Check QR',
    hint: 'Link a shelf edge to a live stock record.',
    fields: [
      { key: 'sku', label: 'SKU', hint: 'Example: SKU-88412' },
      { key: 'name', label: 'Product name', hint: 'Example: 12mm hex bolt, box of 200' },
      {
        key: 'url',
        label: 'Stock record URL',
        hint: 'Example: https://your-warehouse.example/stock/SKU-88412',
      },
    ],
    build: (v) =>
      v.url?.trim()
        ? v.url.trim()
        : `Stock check — SKU: ${v.sku || 'Unknown'} | Product: ${v.name || 'Unknown product'}`,
  },
  {
    id: 'pick',
    label: 'Pick List QR',
    hint: 'Attach a pick run reference to a tote or trolley.',
    fields: [
      { key: 'pick', label: 'Pick list ID', hint: 'Example: PICK-2027-0311' },
      { key: 'order', label: 'Order reference', hint: 'Example: ORD-99104' },
      { key: 'note', label: 'Note', hint: 'Example: Fragile — top shelf only' },
    ],
    build: (v) =>
      `Pick list: ${v.pick || 'Unassigned'} | Order: ${v.order || '—'}${v.note ? ` | Note: ${v.note}` : ''}`,
  },
  {
    id: 'asset',
    label: 'Asset QR',
    hint: 'Tag equipment with an ID that opens its record.',
    fields: [
      { key: 'asset', label: 'Asset ID', hint: 'Example: AST-0147' },
      { key: 'name', label: 'Asset name', hint: 'Example: Forklift FL-2' },
      { key: 'location', label: 'Usual location', hint: 'Example: Dock B' },
    ],
    build: (v) =>
      `Asset: ${v.asset || 'Unassigned'} | ${v.name || 'Unnamed asset'} | Location: ${v.location || '—'}`,
  },
];

const FAQS = [
  {
    question: 'Should warehouse QR codes contain the data or link to a system?',
    answer:
      'Bin and asset codes can safely contain the identifier itself, because a bin code is not sensitive and stays useful even if the network drops. Stock-check codes should link to the live record instead, since a quantity printed into a code goes stale the moment someone picks from the bin.',
  },
  {
    question: 'How large should a bin-location QR code be?',
    answer:
      'Size follows scanning distance. A code scanned by a handheld scanner at arm length can be small, while a code scanned by a forklift-mounted reader from a metre or more away needs to be much larger. Test at the real distance, on the real hardware, before printing a full run of labels.',
  },
  {
    question: 'What material survives a warehouse?',
    answer:
      'Paper labels fail quickly where forklifts, dust, and damp are involved. Polyester or vinyl labels with a protective laminate hold up far better on racking, and engraved or metal tags suit outdoor yards. Whatever you choose, test one label in the harshest spot for a week before committing.',
  },
  {
    question: 'How do we stop duplicate bin codes after a re-layout?',
    answer:
      'Keep one list that owns the truth: bin code, aisle, zone, and the date it was created. When racking moves, retire the old codes in the list and print new ones. Never reuse a retired bin code for a different location, because an old label somewhere will still point at it.',
  },
];

export default function WarehouseQRSuitePage() {
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
    a.download = `warehouse-qr-${preset.id}.svg`;
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
    name: 'Warehouse QR Suite',
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
          { label: 'Warehouse QR Suite', href: '/warehouse-qr-suite' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Package className="w-3.5 h-3.5" />
          <span>Warehouse Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Warehouse QR Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build bin-location, stock-check, pick-list, and asset QR codes. Pick a preset, fill in the
          details, and download a working code for labels and racking.
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
                <Label htmlFor={`warehouse-${f.key}`}>{f.label}</Label>
                <Input
                  id={`warehouse-${f.key}`}
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
                alt="Warehouse QR code preview"
                className="w-56 h-56 mx-auto rounded-lg border"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">Generating preview…</p>
            )}
            <div className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{payload}</div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <a href={qrUrl} download={`warehouse-qr-${preset.id}.png`}>
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
      <AdSlot id="warehouse-qr-suite-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          QR codes that survive a working warehouse
        </h2>
        <p className="text-base leading-relaxed">
          A warehouse QR code is judged by one thing: whether it scans on the first attempt while
          someone is holding a box, driving a truck, or counting under a deadline. Everything else —
          design, branding, clever encoding — is secondary. The codes that fail in warehouses
          usually fail for practical reasons: they are too small for the scanner distance, they are
          printed on paper that peels in damp air, they sit where a pallet scrapes them, or they
          encode information that went stale a week ago. Getting these four decisions right matters
          more than any feature of the code itself.
        </p>
        <p className="text-base leading-relaxed">
          The first decision is what the code carries. Bin codes and asset tags should carry the
          identifier itself: a bin code is stable, it is not sensitive, and it keeps working when
          the Wi-Fi drops in a far corner of the building. Stock-check codes are the opposite case.
          A quantity baked into a printed code is wrong the moment the next pick happens, so stock
          codes should link to the live record and let the system supply the number. Pick lists sit
          in between: the pick-list reference goes in the code, while the line items stay in the
          system where they can be updated if an order changes mid-shift.
        </p>
        <AdSlot id="warehouse-qr-suite-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          The second decision is size and placement. Measure the real scanning distance for each
          use, not the distance you imagine. A handheld scanner at arm length is a different problem
          from a forklift-mounted reader scanning racking from the aisle. Print a test label, mount
          it where it will live, and scan it with the actual devices your team uses, including the
          oldest one. Place bin labels at a consistent height and orientation on every bay, keep
          them clear of the edges where pallets strike, and never let a label overlap a beam or a
          neighbouring bay&apos;s label.
        </p>
        <p className="text-base leading-relaxed">
          The third decision is material. Standard paper labels are a false economy in a space with
          dust, moisture, temperature swings, and forklift traffic. Polyester or vinyl labels with a
          laminate survive far longer on racking, and engraved or metal tags suit outdoor yards and
          cold stores. Test your chosen label in the worst spot in the building for a week — the
          damp corner, the sun-struck dock door — before printing hundreds of them. A label that
          peels, fades, or smears will be ignored, and an ignored label is soon a wrong label.
        </p>
        <p className="text-base leading-relaxed">
          The fourth decision is governance: one list owns the truth. Every bin code, asset ID, and
          pick-list prefix should exist in exactly one register with a creation date and an owner.
          When racking is reconfigured, retire the old codes in the register and print new ones, and
          never reuse a retired bin code for a different location — an old label hiding behind a
          pallet will still point at it. Walk the floor on a schedule, scan a sample of labels, and
          replace damaged ones before they cause a mispick. A warehouse that treats its labels as
          infrastructure, with owners and inspections, gets the speed QR codes promise; one that
          treats them as stickers gets confusion at scale.
        </p>
      </article>

      <AdSlot id="warehouse-qr-suite-pre-related" format="horizontal-banner" />
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Warehouse QR Codes
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
      <AdSlot id="warehouse-qr-suite-bottom" format="horizontal-banner" />
    </div>
  );
}
