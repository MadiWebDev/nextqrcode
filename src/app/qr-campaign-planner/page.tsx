'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Megaphone } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'What belongs in a QR campaign brief?',
    answer:
      'A measurable goal, the destination URL, the owner, the dates, every placement with its quantity and code size, and the QA checklist. The brief is the single record the whole team works from.',
  },
  {
    question: 'How do I set a realistic campaign goal?',
    answer:
      'Give it a number, a source, and a deadline \u2014 for example, 800 menu views from in-store codes in 4 weeks. If you cannot defend the number, run a pilot first or pick a smaller one.',
  },
  {
    question: 'How many placements should a campaign have?',
    answer:
      'Few and well-chosen. Three placements with correct sizes and real quantities beat eight placements that were never measured, owned, or checked.',
  },
  {
    question: 'What happens when the campaign ends?',
    answer:
      "Remove or cover the codes, and update the destination if the offer is gone. A campaign without an end date leaves codes pointing at expired offers, which wastes scanners' trust.",
  },
];

export default function QrCampaignPlannerPage() {
  const [name, setName] = useState('Spring menu launch');
  const [goal, setGoal] = useState('Get 800 menu views from in-store codes in 4 weeks');
  const [destination, setDestination] = useState('https://example.com/menu');
  const [placements, setPlacements] = useState([
    { label: 'Table tents', qty: 40, codeSize: '60 mm', selected: true },
    { label: 'Window poster', qty: 2, codeSize: '150 mm', selected: true },
    { label: 'Receipts / flyers', qty: 5000, codeSize: '30 mm', selected: true },
    { label: 'Social / email', qty: 1, codeSize: 'Digital', selected: false },
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [owner, setOwner] = useState('');
  const [brief, setBrief] = useState('');
  const selected = placements.filter((p) => p.selected);
  const totalPieces = selected.reduce((s, p) => s + p.qty, 0);
  function toggle(i: number) {
    setPlacements((prev) => prev.map((p, j) => (j === i ? { ...p, selected: !p.selected } : p)));
  }
  function updateQty(i: number, qty: number) {
    setPlacements((prev) => prev.map((p, j) => (j === i ? { ...p, qty: Math.max(0, qty) } : p)));
  }
  const QA = [
    'Destination URL tested in a browser and matches the brief.',
    'Each code scanned from a printed proof at real distance and lighting.',
    'Quiet zone intact on every code; nothing overlaps the modules.',
    'Call to action matches the destination and names the benefit.',
    'Print files are SVG or high-resolution PNG, never enlarged JPEGs.',
    'Overrun of 5-10% added to every printed quantity.',
    'Owner and end date assigned; expiry or removal plan written down.',
  ];
  function buildBrief() {
    const lines = [
      `CAMPAIGN BRIEF: ${name}`,
      `Goal: ${goal}`,
      `Destination: ${destination}`,
      `Owner: ${owner || 'Not assigned'}`,
      `Dates: ${startDate || 'Not set'} to ${endDate || 'Not set'}`,
      '',
      'PLACEMENTS',
      ...selected.map((p) => `- ${p.label}: ${p.qty} pieces, code ${p.codeSize}`),
      `Total pieces: ${totalPieces}`,
      '',
      'QA CHECKLIST',
      ...QA.map((q, i) => `${i + 1}. [ ] ${q}`),
      '',
      'LAUNCH RULE: Do not print until every QA item is checked against a printed proof.',
    ];
    setBrief(lines.join('\n'));
  }
  async function copyBrief() {
    if (!brief) buildBrief();
    try {
      await navigator.clipboard.writeText(brief || '');
    } catch {
      /* user can select the text manually */
    }
  }
  function printBrief() {
    window.print();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Campaign Planner',
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
          { label: 'QR Campaign Planner', href: '/qr-campaign-planner' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Megaphone className="w-3.5 h-3.5" />
          <span>Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Campaign Planner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Plan a QR campaign: goals, placements, quantities, timeline, and QA steps; exports a
          printable campaign brief.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="cp-name">Campaign name</Label>
            <Input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-goal">Goal (specific, measurable)</Label>
            <Input id="cp-goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-dest">Destination URL</Label>
            <Input
              id="cp-dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cp-start">Start date</Label>
              <Input
                id="cp-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-end">End date</Label>
              <Input
                id="cp-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-owner">Owner</Label>
              <Input
                id="cp-owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Placements</Label>
            {placements.map((p, i) => (
              <div key={p.label} className="flex items-center gap-2 rounded border p-2 text-sm">
                <input type="checkbox" checked={p.selected} onChange={() => toggle(i)} />
                <span className="flex-1">
                  {p.label} — code {p.codeSize}
                </span>
                <Input
                  type="number"
                  min={0}
                  value={p.qty}
                  onChange={(e) => updateQty(i, parseInt(e.target.value) || 0)}
                  className="w-20 h-8"
                />
                <span className="text-xs text-muted-foreground">pcs</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Selected total: {totalPieces.toLocaleString()} pieces.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={buildBrief}>Build campaign brief</Button>
            <Button variant="outline" onClick={copyBrief}>
              Copy brief
            </Button>
            <Button variant="outline" onClick={printBrief}>
              Print brief
            </Button>
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Campaign brief</p>
          {brief ? (
            <pre className="rounded-lg bg-muted p-4 text-xs whitespace-pre-wrap break-words">
              {brief}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              Fill in the campaign details and press Build campaign brief. The brief is a plain-text
              record you can paste into a doc, an email, or a ticket.
            </p>
          )}
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            QA checklist (before printing)
          </p>
          <ul className="space-y-2 text-xs">
            {QA.map((q, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-campaign-planner-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Plan a QR Campaign That Survives Contact with Reality
        </h2>
        <p className="text-base leading-relaxed">
          A QR campaign is a small logistics operation wearing a marketing costume. The creative
          work is the visible part, but the campaign succeeds or fails on unglamorous details:
          whether every code points at the right destination, whether the print quantities match the
          placements, whether someone owns the campaign after launch, and whether anyone knows when
          it ends. The brief this tool produces exists to force those details into the open before
          money is spent. A campaign with a written brief is a plan; a campaign without one is a
          hope with a print order attached.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-campaign-planner-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The goal is the first line of the brief for a reason. A goal like get 800 menu views from
          in-store codes in four weeks can be measured, and it tells you what to count and when to
          declare success. A goal like raise awareness cannot be measured, and it lets any result
          count as success, which means the campaign teaches nothing. Write the goal with a number,
          a source, and a deadline, and make the number one you would defend to a sceptical
          colleague. If you cannot defend it, run a pilot or pick a smaller number, because an
          indefensible goal produces either a false failure or a false victory.
        </p>
        <p className="text-base leading-relaxed">
          Placements are the second decision, and they should be chosen from where the audience
          already stands, not where space happens to be free. A code on a table tent is seen by
          seated customers with time to scan. A code on a receipt is seen once, briefly, by a buyer
          walking away. A code on a window is seen by passers-by who may not stop. Each placement
          needs its own code size, its own quantity, and its own expectation, because a table tent
          code and a window code are different tools. Keep the placements few: three well-chosen
          placements with correct sizes outperform eight placements that were never measured, never
          owned, and never checked.
        </p>
        <p className="text-base leading-relaxed">
          Quantities deserve a moment of arithmetic rather than a round number. Count the real
          locations, multiply by the real copies per location, and then add five to ten percent
          overrun for damage, misprints, and late additions. A round order of five thousand flyers
          for a venue with forty tables is not a plan; it is a guess that will end in either a
          shortage or a storeroom full of expired codes. File the quantity math with the brief so a
          reprint reproduces the same numbers instead of requiring a fresh guess. And assign an
          owner and an end date, because a campaign without an owner is a campaign nobody updates,
          and a campaign without an end date is a code that keeps pointing at last season&apos;s
          offer.
        </p>
        <p className="text-base leading-relaxed">
          The QA checklist is the last gate before printing, and it should be treated as a gate, not
          a formality. Every item is a check against a printed proof, not a check against a screen.
          Scan each code from a print, at the real distance, in the real light. Confirm the quiet
          zone survived every handoff. Confirm the call to action matches the destination. Confirm
          the file format is fit for print. A campaign that passes QA can be launched with
          confidence; a campaign that skips QA is gambling the whole print budget on the assumption
          that nothing went wrong in the handoffs, which is exactly when things go wrong.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-campaign-planner-pre-related" format="horizontal-banner" />

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

      {/* Bottom AdSlot */}
      <AdSlot id="qr-campaign-planner-bottom" format="horizontal-banner" />
    </div>
  );
}
