'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Receipt } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRBatchCostCalculatorPage() {
  type Item = { name: string; qty: number; unit: number };
  const [items, setItems] = useState<Item[]>([
    { name: 'Design and artwork', qty: 1, unit: 150 },
    { name: 'Printing (labels / signage)', qty: 1000, unit: 0.12 },
    { name: 'Placement / installation', qty: 1, unit: 200 },
    { name: 'Tracking and redirect hosting (per year)', qty: 1, unit: 60 },
    { name: 'Proofing and test prints', qty: 1, unit: 40 },
  ]);
  const [expectedScans, setExpectedScans] = useState(2000);
  const [codes, setCodes] = useState(1000);
  const update = (i: number, key: keyof Item, v: number | string) =>
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  const addItem = () => setItems((prev) => [...prev, { name: 'New line item', qty: 1, unit: 0 }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, j) => j !== i));
  const total = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit) || 0), 0);
  const perCode = codes > 0 ? total / codes : 0;
  const perScan = expectedScans > 0 ? total / expectedScans : 0;

  const faqs = [
    {
      question: 'What should a QR campaign budget include?',
      answer:
        'Design and artwork, printing, placement or installation, proofing and test prints, tracking or redirect hosting, and maintenance such as annual destination reviews. The calculator starts with those line items and lets you edit, add, or remove any of them.',
    },
    {
      question: 'Why track cost per scan, not just total cost?',
      answer:
        'Total cost tells you what you spent; cost per scan tells you what you bought. Comparing placements by cost per expected scan shows whether an expensive high-traffic spot is actually better value than a cheap quiet one.',
    },
    {
      question: 'How do I estimate expected scans realistically?',
      answer:
        'Start from foot traffic past the placement, then discount heavily for people who do not notice, do not care, or cannot scan comfortably in that spot. A realistic estimate beats an optimistic one — it keeps the budget honest.',
    },
    {
      question: 'How can I avoid reprint costs when a destination changes?',
      answer:
        'Point printed codes at a short redirect you control, not at the final destination. When the destination changes, you edit the redirect and the printed code keeps working. That one habit saves more money than any volume discount.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Batch Cost Calculator',
    applicationCategory: 'DesignApplication',
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
          { label: 'QR Batch Cost Calculator', href: '/qr-batch-cost-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Receipt className="w-3.5 h-3.5" />
          <span>Campaign Budget Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Batch Cost Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Budget a whole QR batch campaign — design, print, placement, and tracking — with editable
          line items, cost per code, and cost per scan at your expected scan volume.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Line items (edit freely)</h2>
            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs">Item</Label>
                    <Input
                      value={it.name}
                      onChange={(e) => update(i, 'name', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="0"
                      value={it.qty}
                      onChange={(e) => update(i, 'qty', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm text-right"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">Unit cost ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={it.unit}
                      onChange={(e) => update(i, 'unit', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm text-right"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(i)}
                      aria-label="Remove line item"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addItem}>
              + Add line item
            </Button>
            <p className="text-xs text-muted-foreground">
              Line total = quantity × unit cost. All figures are your own planning numbers in
              dollars — this page stores nothing and sends nothing anywhere.
            </p>
          </Card>
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">2. Volume assumptions</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="codes">QR codes produced</Label>
                <Input
                  id="codes"
                  type="number"
                  min="1"
                  value={codes}
                  onChange={(e) => setCodes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[codes]}
                min={10}
                max={10000}
                step={10}
                onValueChange={([v]) => setCodes(v)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="scans">Expected scans over the campaign</Label>
                <Input
                  id="scans"
                  type="number"
                  min="0"
                  value={expectedScans}
                  onChange={(e) => setExpectedScans(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-28 text-right h-8 text-sm"
                />
              </div>
              <Slider
                value={[expectedScans]}
                min={0}
                max={20000}
                step={100}
                onValueChange={([v]) => setExpectedScans(v)}
              />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Budget
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Estimated campaign total</div>
              <div className="text-4xl font-extrabold text-primary">${total.toFixed(2)}</div>
            </div>
            <div className="space-y-2 text-xs">
              {items.map((it, i) => (
                <div key={i} className="flex justify-between border-b border-border/50 py-1.5">
                  <span className="text-muted-foreground">{it.name}</span>
                  <span className="font-semibold">
                    ${((Number(it.qty) || 0) * (Number(it.unit) || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Cost per code</span>
                <span className="font-semibold">${perCode.toFixed(3)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Cost per scan (at expected volume)</span>
                <span className="font-semibold">
                  {expectedScans > 0 ? `$${perScan.toFixed(3)}` : '—'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-batch-cost-calculator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Budgeting a QR Campaign Honestly</h2>
        <p className="text-base leading-relaxed">
          QR codes themselves are free to generate, which makes it easy to forget that a QR campaign
          is not free. Somebody designs the artwork, somebody prints and places it, somebody keeps
          the destination alive, and somebody checks that it still scans in month six. When those
          costs are not budgeted, they get discovered mid-campaign, usually as a surprise invoice or
          a dead link. This calculator lays the whole campaign out as editable line items so the
          total, the cost per code, and the cost per scan are all visible before you commit.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-batch-cost-calculator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">The line items people forget</h3>
        <p className="text-base leading-relaxed">
          Design and proofing are the first forgotten costs: a code that is checked on screen but
          never printed as a proof will eventually produce a reprint. Placement is the second —
          installing signage, applying labels, or paying a venue fee is real labour. Tracking is the
          third: redirect hosting, analytics, and the time spent reviewing them. Then there is
          maintenance, the cost nobody budgets for at all. Destinations change, campaigns end, and
          printed codes keep working long after anyone remembers them. Budgeting an annual review,
          and the reprint it may trigger, is cheaper than discovering a dead code on a warehouse
          wall two years later.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Cost per scan keeps expectations honest
        </h3>
        <p className="text-base leading-relaxed">
          Total cost alone does not tell you whether a campaign is worth running. Cost per scan
          does, because it connects spending to attention. A five-hundred-dollar campaign that earns
          five hundred scans costs a dollar per scan; the same campaign at fifty scans costs ten
          dollars each, which is a very different proposition. The expected scan figure you enter
          should be a genuine estimate, not a hope — look at foot traffic past the placement, the
          share of people who notice printed calls to action, and the friction of scanning in that
          location. If the cost per scan looks high at a realistic estimate, the fix is usually
          better placement or a stronger call to action, not a bigger print run.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Using the budget as a decision tool
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Compare placements by cost per expected scan, not by total cost — a pricey high-traffic
            spot often wins.
          </li>
          <li>
            Keep fixed costs (design, setup) separate from per-code costs so you can see what
            scaling actually costs.
          </li>
          <li>
            Point codes at redirects you control, so a destination change costs an edit, not a
            reprint.
          </li>
          <li>
            Schedule a destination and scannability review at least once a year for long-lived
            codes.
          </li>
          <li>
            Record actual scans against the estimate, so the next campaign starts from evidence.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          A QR campaign budgeted this way rarely produces surprises. The numbers are small, the
          assumptions are explicit, and the decision to run it is made with eyes open.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-batch-cost-calculator-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
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

      {/* Bottom AdSlot */}
      <AdSlot id="qr-batch-cost-calculator-bottom" format="horizontal-banner" />
    </div>
  );
}
