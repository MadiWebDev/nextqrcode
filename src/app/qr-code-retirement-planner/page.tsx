'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hourglass } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const CADENCES: Record<string, { label: string; days: number }> = {
  weekly: { label: 'Weekly', days: 7 },
  monthly: { label: 'Monthly', days: 30 },
  quarterly: { label: 'Quarterly', days: 91 },
};

function fmt(d: Date): string {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + 'T00:00:00');
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function QRCodeRetirementPlannerPage() {
  const [campaignEnd, setCampaignEnd] = useState('2026-12-31');
  const [linkExpiry, setLinkExpiry] = useState('');
  const [cadence, setCadence] = useState('monthly');
  const [lastReview, setLastReview] = useState(() => new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    const end = parseDate(campaignEnd);
    const expiry = parseDate(linkExpiry);
    const review = parseDate(lastReview);
    const candidates: Array<{ date: Date; reason: string }> = [];
    if (end) candidates.push({ date: end, reason: 'Campaign ends' });
    if (expiry) candidates.push({ date: expiry, reason: 'Destination link expires' });
    candidates.sort((a, b) => a.date.getTime() - b.date.getTime());
    const retirement = candidates[0] ?? null;
    const nextReview = review
      ? new Date(review.getTime() + CADENCES[cadence].days * 86400000)
      : null;
    return { retirement, nextReview, candidates };
  }, [campaignEnd, linkExpiry, cadence, lastReview]);

  const faqs = [
    {
      question: 'What does "retire" mean for a QR code?',
      answer:
        'Retire means stop relying on it: take down the print, remove the code from the page, and point the destination at a sunset notice or a current campaign. Printed codes cannot be edited, so retirement is a physical and digital tidy-up, not a single switch.',
    },
    {
      question: 'Why does the earlier date win?',
      answer:
        'A code is only useful while both the campaign is live and the destination works. Whichever ends first ends the code’s useful life — a live campaign pointing at an expired link is as dead as an ended campaign.',
    },
    {
      question: 'What if I have no link expiry date?',
      answer:
        'Leave it blank and the plan uses the campaign end date alone. But an open-ended link is itself a risk: a page that moves or is deleted later silently breaks every printed code pointing at it. Prefer a link you control with a known review date.',
    },
    {
      question: 'How is this different from checking one code’s expiry?',
      answer:
        'An expiry checker answers "is this code expired?" for one code. This planner answers "when should we retire this campaign’s codes, why, and when do we next review them?" — a schedule, not a single check.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Code Retirement Planner',
    applicationCategory: 'BusinessApplication',
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
          { label: 'QR Code Retirement Planner', href: '/qr-code-retirement-planner' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Hourglass className="w-3.5 h-3.5" />
          <span>Campaign Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Retirement Planner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Plan when to retire a campaign&apos;s QR codes from the campaign end date, the destination
          link expiry, and a review cadence. The retirement date is the earliest limiting date, with
          the reason stated.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter campaign dates</h2>
            <div className="space-y-2">
              <Label htmlFor="end">Campaign end date</Label>
              <Input
                id="end"
                type="date"
                value={campaignEnd}
                onChange={(e) => setCampaignEnd(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Destination link expiry date (optional)</Label>
              <Input
                id="expiry"
                type="date"
                value={linkExpiry}
                onChange={(e) => setLinkExpiry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cadence">Link-health review cadence</Label>
              <select
                id="cadence"
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(CADENCES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} (every {v.days} days)
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Last link-health review</Label>
              <Input
                id="review"
                type="date"
                value={lastReview}
                onChange={(e) => setLastReview(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Rule: retirement date = the earliest of campaign end and link expiry. Next review =
              last review + cadence interval. If a date is blank it is ignored, not treated as zero.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Retire codes by</div>
              <div className="text-3xl font-extrabold text-primary">
                {result.retirement ? fmt(result.retirement.date) : 'No date entered'}
              </div>
              <div className="text-sm text-muted-foreground">
                {result.retirement
                  ? `Reason: ${result.retirement.reason}`
                  : 'Enter a campaign end date.'}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {result.candidates.map((c, i) => (
                <div key={i} className="flex justify-between border-b border-border/50 py-1.5">
                  <span className="text-muted-foreground">{c.reason}</span>
                  <span className="font-semibold">{fmt(c.date)}</span>
                </div>
              ))}
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Next link-health review</span>
                <span className="font-semibold">
                  {result.nextReview ? fmt(result.nextReview) : '—'}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Diary the retirement date now. On the day, verify the destination still works, then
              remove or replace the printed codes — do not leave dead codes in the wild.
            </p>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-code-retirement-planner-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Every Code Needs an End Date</h2>
        <p className="text-base leading-relaxed">
          QR codes are easy to put up and easy to forget. A campaign ends, a page moves, a domain
          lapses — and the printed code keeps promising something that no longer exists. A
          retirement plan made at launch costs minutes and prevents months of dead scans, confused
          customers, and, in the worst case, a lapsed domain re-registered by someone else.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-code-retirement-planner-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Make retirement a habit</h3>
        <p className="text-base leading-relaxed">
          Record the retirement date alongside the campaign, review link health on the cadence you
          chose, and treat retirement day as a real task: check the destination, remove the print,
          and update any page that still shows the code.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-code-retirement-planner-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-code-retirement-planner-bottom" format="horizontal-banner" />
    </div>
  );
}
