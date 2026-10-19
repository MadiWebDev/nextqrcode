'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardCheck, Printer, CheckCircle2 } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

interface Item {
  id: string;
  group: string;
  text: string;
  blocker: boolean;
}

const ITEMS: Item[] = [
  {
    id: 'size',
    group: 'Size',
    text: 'Printed at the planned size, not scaled down to fit the layout',
    blocker: true,
  },
  {
    id: 'distance',
    group: 'Size',
    text: 'Scanned from the real viewing distance the audience will use',
    blocker: true,
  },
  {
    id: 'contrast',
    group: 'Contrast',
    text: 'Dark modules on a light background with strong contrast (no reversed or low-contrast colour pairs)',
    blocker: true,
  },
  {
    id: 'quiet',
    group: 'Contrast',
    text: 'Quiet zone of at least 4 modules clear on all four sides — no text, logos, or edges touching the code',
    blocker: true,
  },
  {
    id: 'ios',
    group: 'Test scans',
    text: 'Scanned successfully with an iPhone camera (no third-party app)',
    blocker: true,
  },
  {
    id: 'android',
    group: 'Test scans',
    text: 'Scanned successfully with an Android camera or a common scanner app',
    blocker: true,
  },
  {
    id: 'oldphone',
    group: 'Test scans',
    text: 'Scanned successfully with the oldest phone the audience might use',
    blocker: false,
  },
  {
    id: 'angle',
    group: 'Test scans',
    text: 'Scanned from a slight angle and in the real lighting (dim, sunlight, through glass if applicable)',
    blocker: false,
  },
  {
    id: 'lamination',
    group: 'Finishing',
    text: 'Scanned after lamination, coating, or protective film is applied',
    blocker: true,
  },
  {
    id: 'destination',
    group: 'Finishing',
    text: 'Destination page loads on a slow mobile connection and matches the printed text beside the code',
    blocker: true,
  },
  {
    id: 'proof',
    group: 'Finishing',
    text: 'Proofread: payload text matches the intended URL or text exactly, character for character',
    blocker: true,
  },
  {
    id: 'fallback',
    group: 'Finishing',
    text: 'Printed fallback beside the code (short URL, reference number, or phone number) in case scanning fails',
    blocker: false,
  },
];

const FAQS = [
  {
    question: 'When should the print proof checklist be completed?',
    answer:
      'On the final proof, from the final files, on the final stock — not on a screen mock-up or an early draft. Colour, size, and finishing all change between a screen proof and a printed sheet, so a checklist signed off on a mock-up proves little about the delivered job.',
  },
  {
    question: 'Who should sign the sign-off sheet?',
    answer:
      'The person who will be accountable if the job fails: usually the designer or production lead, plus the client or campaign owner who approved the destination. Two signatures — one for the artwork, one for the destination — catch the two different kinds of mistake.',
  },
  {
    question: 'Why test on an old phone?',
    answer:
      'Because your audience does not all carry this year’s flagship. Older phones have slower autofocus, smaller sensors, and weaker low-light performance. A code that scans instantly on a new phone and fails on a three-year-old one will fail for a real share of your audience.',
  },
  {
    question: 'What is the single most common print failure?',
    answer:
      'The quiet zone. Designers crop it to fit a layout, printers trim it, and neighbouring graphics crowd it. A code with a damaged quiet zone can fail on every phone, and the failure looks like a bad code rather than a bad margin. Guard the margin as fiercely as the code itself.',
  },
];

export default function QRPrintProofChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [job, setJob] = useState('');
  const [checker, setChecker] = useState('');
  const [date, setDate] = useState('');

  const done = ITEMS.filter((i) => checked[i.id]).length;
  const blockersOpen = useMemo(() => ITEMS.filter((i) => i.blocker && !checked[i.id]), [checked]);
  const allBlockersDone = blockersOpen.length === 0;

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const printSheet = () => window.print();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Print Proof Checklist',
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

  const groups = ['Size', 'Contrast', 'Test scans', 'Finishing'];

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
          { label: 'QR Print Proof Checklist', href: '/qr-print-proof-checklist' },
        ]}
      />

      <AdSlot id="qr-print-proof-checklist-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Print Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Print Proof Checklist
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Work through the pre-press checks — size, contrast, quiet zone, test scans, finishing —
          then complete the sign-off sheet and print it. Items marked as blockers must all pass
          before the job is approved.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Pre-press checks</h2>
              <p className="text-xs text-muted-foreground">
                {done} of {ITEMS.length} checks done · {blockersOpen.length} blocker(s) open
              </p>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(done / ITEMS.length) * 100}%` }}
              />
            </div>
            {groups.map((g) => (
              <div key={g} className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {g}
                </h3>
                {ITEMS.filter((i) => i.group === g).map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 text-sm cursor-pointer rounded-lg border border-border/60 p-3"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="mt-0.5"
                    />
                    <span className={checked[item.id] ? 'line-through text-muted-foreground' : ''}>
                      {item.text}
                      {item.blocker && (
                        <span className="ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-700 dark:text-red-300">
                          BLOCKER
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="proof-notes">Notes / issues found</Label>
              <Textarea
                id="proof-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Sign-off sheet</h2>
            <div className="space-y-1.5">
              <Label htmlFor="proof-job">Job / artwork name</Label>
              <Input id="proof-job" value={job} onChange={(e) => setJob(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proof-checker">Checked by</Label>
              <Input
                id="proof-checker"
                value={checker}
                onChange={(e) => setChecker(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proof-date">Date</Label>
              <Input
                id="proof-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div
              className={`rounded-lg p-3 text-sm flex gap-2 ${allBlockersDone ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {allBlockersDone
                  ? 'All blocker checks pass. The job is ready for sign-off.'
                  : `${blockersOpen.length} blocker check(s) still open: ${blockersOpen.map((b) => b.text).join('; ')}`}
              </span>
            </div>
            <div className="rounded-lg border p-4 text-sm space-y-3">
              <p className="font-semibold">Sign-off summary</p>
              <p>
                <span className="text-muted-foreground">Job: </span>
                {job || '—'}
              </p>
              <p>
                <span className="text-muted-foreground">Checked by: </span>
                {checker || '—'}
              </p>
              <p>
                <span className="text-muted-foreground">Date: </span>
                {date || '—'}
              </p>
              <p>
                <span className="text-muted-foreground">Checks passed: </span>
                {done} of {ITEMS.length}
              </p>
              <p className="whitespace-pre-wrap">
                <span className="text-muted-foreground">Notes: </span>
                {notes || '—'}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-6">Artwork approval signature</p>
                  <div className="border-b border-foreground/40" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-6">
                    Destination approval signature
                  </p>
                  <div className="border-b border-foreground/40" />
                </div>
              </div>
            </div>
            <Button onClick={printSheet} className="w-full gap-1.5">
              <Printer className="w-3.5 h-3.5" /> Print sign-off sheet
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-print-proof-checklist-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why print proofing deserves its own checklist
        </h2>
        <p className="text-base leading-relaxed">
          A QR code that looks perfect on screen can fail on paper, and the failure is usually
          discovered by the customer, not the printer. Screens are backlit, high-contrast, and
          perfectly flat. Print is none of those things. Ink spreads on uncoated stock, laminate
          adds glare, folding puts a crease through the code, and trimming shaves the quiet zone. A
          proof checklist exists to force the physical checks that a screen review cannot perform —
          on the final proof, on the final stock, before the run.
        </p>
        <p className="text-base leading-relaxed">
          Size is the first check because it is the easiest to get wrong under layout pressure. A
          code sized for a poster gets squeezed to fit a flyer; a code sized for a flyer gets
          squeezed onto a business card. Each squeeze shrinks the modules and narrows the margin for
          every other error. Check the printed size against the plan with a ruler, not by eye, and
          scan the proof at the distance the audience will actually use. A code that scans from a
          desk chair may fail at poster distance, and a code that scans at poster distance may fail
          when a customer holds a card at arm&apos;s length.
        </p>

        <AdSlot id="qr-print-proof-checklist-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Contrast and the quiet zone are the next pair, and they fail together. Designers love
          reversed codes, coloured codes, and codes tucked against photography — and each of those
          choices eats into the scanner&apos;s ability to find the pattern. Dark modules on a light
          background remain the safest choice; anything else needs a physical test, not an opinion.
          The quiet zone — four modules of clear space on every side — is the scanner&apos;s frame
          of reference. Cropping it or letting graphics touch the finder squares is the single most
          common print failure, and it looks like a bad code rather than a bad margin.
        </p>
        <p className="text-base leading-relaxed">
          Test scans are where the checklist earns its keep. Scan with an iPhone and an Android
          device, because their camera pipelines differ. Scan with the oldest phone the audience
          might carry, because it has the weakest autofocus and the worst low-light behaviour. Scan
          after lamination and after mounting behind glass, because both add reflections that did
          not exist on the screen proof. Scan from a slight angle, as a passerby would. And scan the
          destination on a slow connection, because a code that opens a page that never loads has
          failed just as surely as a code that never scans.
        </p>
        <p className="text-base leading-relaxed">
          Finally, make the sign-off mean something. Two signatures — one for the artwork, one for
          the destination — catch the two different kinds of mistake: the code that is beautifully
          printed and points at the wrong page, and the code that points at the right page and
          cannot be scanned. Keep the signed sheet with the job file. When a customer reports a dead
          code six months later, the sheet tells you what was checked, by whom, and when — and that
          record is worth more than any apology.
        </p>
      </article>

      <AdSlot id="qr-print-proof-checklist-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Print Proofing
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

      <AdSlot id="qr-print-proof-checklist-bottom" format="horizontal-banner" />

    </div>
  );
}
