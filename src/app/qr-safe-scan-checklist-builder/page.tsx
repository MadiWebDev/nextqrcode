'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ClipboardCheck } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRSafeScanChecklistBuilderPage() {
  const [context, setContext] = useState('Street poster / public sign');
  const BASE_ITEMS = [
    'Read the destination preview before tapping through.',
    'Check that the domain matches the business on the sign.',
    'Do not enter a password after scanning a code from a public place.',
    'If the code is a sticker over another code, treat it as suspicious.',
  ];
  const PER_CONTEXT: Record<string, string[]> = {
    'Street poster / public sign': [
      'Check the code is printed on the poster, not stuck on top of it.',
      'Look for signs of tampering: peeling edges, a second code, or a mismatched design.',
      'Preview the link; if the domain is a URL shortener, be extra careful.',
      'Do not scan if someone is pressuring you to scan quickly.',
    ],
    'Email or message': [
      'Check who really sent the message — a familiar name can be spoofed.',
      'Be wary of urgency: threats, prizes, and expiring accounts are pressure tactics.',
      'Hover or long-press to preview the link before opening it.',
      'Do not scan a code in an unexpected message, even from a known contact.',
    ],
    'Package or product': [
      'Check the code is part of the printed packaging, not a sticker added later.',
      'Compare the brand spelling on the package with the domain in the preview.',
      'A code promising a prize for scanning a parcel is a common lure.',
      'If the package arrived unexpectedly, do not scan its code.',
    ],
    'Restaurant table': [
      'Check the code is printed on the table card, not a sticker on top.',
      'Confirm the menu domain matches the restaurant name.',
      'You should not need to download an app to see a menu.',
      'Do not enter payment details on a page reached from a table code without checking the domain.',
    ],
    'Payment / payment request': [
      'Verify the recipient name and amount before confirming anything.',
      'Never approve a payment you did not initiate and expect.',
      'Check that the payment page domain belongs to your payment provider.',
      'If the amount or recipient looks wrong, stop and contact the seller directly.',
    ],
    'Event ticket': [
      'Check the ticket came from the official seller or organiser.',
      'Confirm the event name, date, and venue in the preview before opening.',
      'Do not share a screenshot of your ticket code — it can be copied and used.',
      'Beware of codes in resale messages that promise a cheaper ticket.',
    ],
    'Unknown / unlabelled code': [
      'Do not scan a code with no context about who placed it or why.',
      'If you must check it, preview the link without opening it.',
      'Do not enter any personal details after scanning an unlabelled code.',
      'When in doubt, leave it unscanned.',
    ],
  };
  const items = [...BASE_ITEMS, ...(PER_CONTEXT[context] || [])];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const done = items.filter((i) => checked[i]).length;
  const [copied, setCopied] = useState(false);
  const copyList = async () => {
    await navigator.clipboard.writeText(
      'Safe-scan checklist — ' +
        context +
        '\n' +
        items.map((i, n) => (checked[i] ? '[x] ' : '[ ] ') + (n + 1) + '. ' + i).join('\n')
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'Is a checklist enough to make scanning safe?',
      answer:
        'No. It makes the important checks explicit, but a careful-looking code can still lead to a malicious page. Stay alert after scanning.',
    },
    {
      question: 'What is the most important single check?',
      answer:
        'Preview the destination and compare its domain against what you expect. Most attacks fail that one check.',
    },
    {
      question: 'Should children use this checklist?',
      answer:
        'Yes. The steps are written for anyone: check the sticker, check the domain, and ask a grown-up before entering anything.',
    },
    {
      question: 'Can I print the checklist?',
      answer: 'Yes. Use the Print checklist button to print the list for the selected context.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Safe Scan Checklist Builder',
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
          { label: 'QR Safe Scan Checklist Builder', href: '/qr-safe-scan-checklist-builder' },
        ]}
      />

      <AdSlot id="qr-safe-scan-checklist-builder-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Scan-Safety Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Safe Scan Checklist Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Pick where you found a QR code — a poster, an email, a package, a table, a payment request
          — and get a checklist tuned to that context, with tick boxes, progress, and a copyable
          list.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Where did you find the code?</h2>
            <div className="space-y-2">
              <Label htmlFor="ctx">Scan context</Label>
              <select
                id="ctx"
                value={context}
                onChange={(e) => {
                  setContext(e.target.value);
                  setChecked({});
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.keys(PER_CONTEXT).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              The checklist changes with the context: a sticker on a poster needs a tamper check,
              while a code in an email needs a sender check.
            </p>
            <div className="space-y-2">
              {items.map((it, i) => (
                <label key={i} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!checked[it]}
                    onChange={(e) => setChecked((p) => ({ ...p, [it]: e.target.checked }))}
                    className="mt-1 shrink-0"
                  />
                  <span>
                    {i + 1}. {it}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyList}>
                {copied ? 'Copied!' : 'Copy checklist'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                Print checklist
              </Button>
              <Button variant="outline" size="sm" onClick={() => setChecked({})}>
                Reset ticks
              </Button>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm font-semibold">
              {done} of {items.length} checks ticked
            </p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: (items.length ? (done / items.length) * 100 : 0) + '%' }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {done === items.length
                ? 'All checks ticked. If every check passed, the scan is as safe as a checklist can make it — stay alert on the page itself.'
                : 'Work through the checks before scanning. Any check that fails is a reason to stop.'}
            </p>
            <p className="text-xs text-muted-foreground">
              A checklist cannot prove a code is safe. It makes the checks you should already do
              explicit, in the order that matters for this context.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-safe-scan-checklist-builder-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          A Checklist That Fits Where You Found the Code
        </h2>
        <p className="text-base leading-relaxed">
          Generic advice — be careful — is easy to ignore because it does not say what to actually
          do. The risks of a code on a street poster are different from the risks of a code in an
          email: the poster can be tampered with by a sticker, while the email can be spoofed by a
          familiar name. A checklist tuned to the context turns vague caution into concrete actions:
          check the sticker, check the sender, preview the link, verify the recipient.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          The three checks that apply everywhere
        </h3>
        <p className="text-base leading-relaxed">
          Whatever the context, three checks always apply. First, preview the destination before
          opening it — every modern phone shows the link. Second, compare the domain in that preview
          against the business or sender you expect. Third, never enter a password, payment, or
          personal detail on a page reached from a code you have not verified. Those three checks
          stop most QR attacks on their own.
        </p>

        <AdSlot id="qr-safe-scan-checklist-builder-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Using this checklist with others</h3>
        <p className="text-base leading-relaxed">
          Print it for a shop counter, a classroom, or a staff room. Tick boxes make the routine
          visible: a new team member can follow the same steps a security reviewer would. For
          payment contexts, add your own rule — a second person verifying the recipient — on top of
          the list.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Post the checklist where codes are scanned, not in a policy document nobody reads.
          </li>
          <li>
            Re-check after any change: a reprinted poster or a new supplier means a new checklist
            run.
          </li>
          <li>
            If one check fails, stop. A failed check is the checklist working, not an inconvenience.
          </li>
        </ul>
      </article>

      <AdSlot id="qr-safe-scan-checklist-builder-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-safe-scan-checklist-builder-bottom" format="horizontal-banner" />

    </div>
  );
}
