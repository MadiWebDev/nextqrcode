'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardList } from 'lucide-react';
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

export default function QRExpiryPolicyBuilderPage() {
  const [campaign, setCampaign] = useState('Spring menu');
  const [owner, setOwner] = useState('');
  const [start, setStart] = useState('2026-04-01');
  const [end, setEnd] = useState('2026-06-30');
  const [cadence, setCadence] = useState('monthly');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const startD = parseDate(start);
    const endD = parseDate(end);
    const reminders: Date[] = [];
    if (endD) {
      for (const daysBefore of [30, 7, 1]) {
        reminders.push(new Date(endD.getTime() - daysBefore * 86400000));
      }
    }
    const reviews: Date[] = [];
    if (startD && endD && startD <= endD) {
      const step = CADENCES[cadence].days * 86400000;
      let cur = new Date(startD.getTime() + step);
      while (cur <= endD) {
        reviews.push(new Date(cur));
        cur = new Date(cur.getTime() + step);
      }
    }
    const policy = [
      `QR Expiry & Retention Policy — ${campaign || 'Unnamed campaign'}`,
      `Owner: ${owner || '(assign an owner)'}`,
      `Campaign period: ${startD ? fmt(startD) : '—'} to ${endD ? fmt(endD) : '—'}`,
      `Review cadence: ${CADENCES[cadence].label} link-health review (destination loads, content current, no redirect change).`,
      '',
      'Rules:',
      '1. Every printed code has a retirement date: the campaign end date, or the destination link expiry, whichever is earlier.',
      '2. On each scheduled review, test-scan the code and confirm the destination. Log the result with the date.',
      '3. If a review fails, fix or replace the destination within one business day, or retire the code.',
      '4. Reminders are sent 30, 7, and 1 day before expiry.',
      '5. On the retirement date, remove or replace the printed codes and update any page still showing the code.',
      '6. Keep this policy with the campaign record for one year after retirement.',
      '',
      `Scheduled reviews (${reviews.length}):`,
      ...reviews.map((d) => `- ${fmt(d)}`),
      '',
      'Expiry reminders:',
      ...reminders.map((d) => `- ${fmt(d)}`),
    ].join('\n');
    return { policy, reviews, reminders, valid: Boolean(startD && endD && startD <= endD) };
  }, [campaign, owner, start, end, cadence]);

  const copyPolicy = async () => {
    await navigator.clipboard.writeText(result.policy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const downloadPolicy = () => {
    const blob = new Blob([result.policy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-expiry-policy.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: 'What is an expiry policy for QR codes?',
      answer:
        'A written rule for how long a campaign’s codes stay live, who checks them, how often, and what happens on the retirement date. Without one, codes linger long after the campaign ends and keep pointing at stale or dead pages.',
    },
    {
      question: 'Why reminders at 30, 7, and 1 days?',
      answer:
        'Thirty days gives time to plan a replacement, seven days is the last comfortable moment to reprint, and one day is the final check. Three reminders at shrinking intervals are hard to sleep through.',
    },
    {
      question: 'Does this policy change the QR code itself?',
      answer:
        'No. A printed QR code cannot be edited or given an expiry. The policy governs the destination and the print: what you check, when you retire it, and who is responsible.',
    },
    {
      question: 'How is this different from checking one code’s expiry?',
      answer:
        'An expiry checker answers "is this code expired?" for one code. This builder writes the standing policy — dates, cadence, reminders, and rules — that governs every code in a campaign.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Expiry Policy Builder',
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
          { label: 'QR Expiry Policy Builder', href: '/qr-expiry-policy-builder' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Campaign Planning Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Expiry Policy Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build an expiry and retention policy for a QR campaign: enter the campaign dates and
          review cadence, and get policy text plus a review schedule and expiry reminders you can
          copy or download.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter campaign details</h2>
            <div className="space-y-2">
              <Label htmlFor="campaign">Campaign name</Label>
              <Input
                id="campaign"
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="Spring menu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Policy owner (name or role)</Label>
              <Input
                id="owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Marketing lead"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Campaign start</Label>
                <Input
                  id="start"
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">Campaign end / expiry</Label>
                <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
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
            {!result.valid && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                Enter a start date on or before the end date to generate the schedule.
              </p>
            )}
          </Card>
          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">Generated policy</h2>
            <pre className="whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-xs font-mono max-h-96 overflow-y-auto">
              {result.policy}
            </pre>
            <div className="flex gap-2">
              <Button size="sm" onClick={copyPolicy}>
                {copied ? 'Copied!' : 'Copy policy'}
              </Button>
              <Button size="sm" variant="outline" onClick={downloadPolicy}>
                Download .txt
              </Button>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Scheduled reviews</div>
              <div className="text-4xl font-extrabold text-primary">{result.reviews.length}</div>
              <div className="text-sm text-muted-foreground">
                {CADENCES[cadence].label} cadence · 3 expiry reminders
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Review dates</h3>
              {result.reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No reviews fall inside the campaign period.
                </p>
              )}
              {result.reviews.map((d, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  — {fmt(d)}
                </p>
              ))}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Expiry reminders</h3>
              {result.reminders.map((d, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  — {fmt(d)}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-expiry-policy-builder-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Write the Ending at the Start</h2>
        <p className="text-base leading-relaxed">
          The cheapest time to decide when a QR code dies is the day it is born. A written policy
          names the owner, the review rhythm, and the retirement date before anyone is busy, before
          the campaign ends, and before the destination quietly breaks. Codes without a policy do
          not retire — they decay, and each one becomes a small broken promise to whoever scans it.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-expiry-policy-builder-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Make the policy real</h3>
        <p className="text-base leading-relaxed">
          Copy the generated policy into the campaign record, put the review dates and reminders in
          the owner&apos;s calendar, and treat a failed review as a same-day task, not a note for
          later.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-expiry-policy-builder-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-expiry-policy-builder-bottom" format="horizontal-banner" />
    </div>
  );
}
