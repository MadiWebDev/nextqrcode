'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchCheck } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const REQUIRED = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
const OPTIONAL = ['utm_term', 'utm_content', 'utm_id'] as const;
const KNOWN_MEDIUMS = [
  'organic',
  'cpc',
  'cpm',
  'email',
  'social',
  'referral',
  'qr',
  'print',
  'sms',
  'push',
  'affiliate',
  'display',
];

type Issue = { severity: 'error' | 'warning' | 'ok'; text: string };

export default function QRUTMAuditCheckerPage() {
  const [url, setUrl] = useState(
    'https://example.com/landing?utm_source=poster&utm_medium=qr&utm_campaign=spring_sale'
  );

  const result = useMemo(() => {
    const issues: Issue[] = [];
    let params: URLSearchParams | null = null;
    let parsed: URL | null = null;
    try {
      parsed = new URL(url.trim());
      params = parsed.searchParams;
    } catch {
      issues.push({
        severity: 'error',
        text: 'The URL could not be parsed. Enter a full URL including https://.',
      });
      return {
        issues,
        params: [] as Array<[string, string]>,
        verdict: 'Invalid URL',
        verdictClass: 'text-red-600',
      };
    }
    const allParams = Array.from(params.entries());
    const names = allParams.map(([k]) => k);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    for (const key of REQUIRED) {
      const value = params.get(key);
      if (value === null || value === '') {
        issues.push({
          severity: 'error',
          text: `Missing ${key} — without it, analytics cannot attribute this traffic.`,
        });
      }
    }
    for (const key of OPTIONAL) {
      if (params.get(key) === '')
        issues.push({ severity: 'warning', text: `${key} is present but empty.` });
    }
    for (const [key, value] of allParams) {
      if (!key.startsWith('utm_')) continue;
      if (value !== value.toLowerCase())
        issues.push({
          severity: 'warning',
          text: `${key} contains uppercase characters ("${value}"). Lowercase keeps reports from splitting into duplicate rows.`,
        });
      if (/\s/.test(value))
        issues.push({
          severity: 'warning',
          text: `${key} contains a space ("${value}"). Spaces become %20 and make reports messy — use hyphens or underscores.`,
        });
      if (/[^a-zA-Z0-9_\-.]/.test(value))
        issues.push({
          severity: 'warning',
          text: `${key} contains unusual characters ("${value}"). Stick to letters, numbers, hyphens, underscores, and dots.`,
        });
    }
    if (dupes.length > 0)
      issues.push({
        severity: 'warning',
        text: `Duplicate parameter(s): ${Array.from(new Set(dupes)).join(', ')}. Analytics tools typically keep only one value.`,
      });
    const medium = params.get('utm_medium');
    if (medium && !KNOWN_MEDIUMS.includes(medium.toLowerCase())) {
      issues.push({
        severity: 'warning',
        text: `utm_medium "${medium}" is not a common medium value. Common values include: ${KNOWN_MEDIUMS.join(', ')}.`,
      });
    }
    if (parsed.protocol !== 'https:')
      issues.push({
        severity: 'warning',
        text: `The URL uses ${parsed.protocol} instead of https:. Scanners and browsers may warn about it.`,
      });
    if (allParams.length === 0)
      issues.push({
        severity: 'error',
        text: 'No query parameters at all — there are no UTM parameters to audit.',
      });
    if (issues.length === 0)
      issues.push({
        severity: 'ok',
        text: 'All three required UTM parameters are present, lowercase, and clean.',
      });
    const hasError = issues.some((i) => i.severity === 'error');
    const hasWarning = issues.some((i) => i.severity === 'warning');
    return {
      issues,
      params: allParams,
      verdict: hasError ? 'Needs fixing' : hasWarning ? 'Usable with warnings' : 'Clean',
      verdictClass: hasError ? 'text-red-600' : hasWarning ? 'text-amber-600' : 'text-emerald-600',
    };
  }, [url]);

  const faqs = [
    {
      question: 'Which UTM parameters are required?',
      answer:
        'utm_source (where the traffic comes from), utm_medium (the channel, e.g. qr), and utm_campaign (the campaign name). Without all three, analytics cannot attribute the traffic to this placement.',
    },
    {
      question: 'Why does casing matter?',
      answer:
        'Analytics tools treat UTM values as case-sensitive: "QR" and "qr" become two separate rows in reports. Picking lowercase everywhere keeps each campaign in one row.',
    },
    {
      question: 'Does this check whether the URL actually works?',
      answer:
        'No. This tool audits the UTM parameters in the URL text only — it does not fetch the URL or check that the page loads. Open the link yourself to confirm the destination is live.',
    },
    {
      question: 'Should a QR code destination have UTM parameters?',
      answer:
        'Yes, when the code is part of a campaign you want to measure. UTM parameters let you separate QR scans from other traffic to the same page, and separate one placement from another.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR UTM Audit Checker',
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
          { label: 'QR UTM Audit Checker', href: '/qr-utm-audit-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <SearchCheck className="w-3.5 h-3.5" />
          <span>Analytics Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR UTM Audit Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a destination URL and audit its UTM parameters: missing or empty values, uppercase,
          spaces, unusual characters, duplicates, and non-https destinations. The audit recomputes
          on every edit, entirely in your browser.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Paste the destination URL</h2>
            <div className="space-y-2">
              <Label htmlFor="url">URL to audit</Label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page?utm_source=...&utm_medium=...&utm_campaign=..."
              />
            </div>
            {result.params.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Parameters found</h3>
                <div className="space-y-1">
                  {result.params.map(([k, v], i) => (
                    <div
                      key={i}
                      className="flex justify-between gap-4 rounded-md bg-muted px-3 py-1.5 text-xs font-mono"
                    >
                      <span
                        className={k.startsWith('utm_') ? 'font-semibold' : 'text-muted-foreground'}
                      >
                        {k}
                      </span>
                      <span className="break-all text-right">{v || '(empty)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Audit verdict</div>
              <div className={`text-3xl font-extrabold ${result.verdictClass}`}>
                {result.verdict}
              </div>
            </div>
            <ul className="space-y-2">
              {result.issues.map((issue, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <span aria-hidden="true">
                    {issue.severity === 'error' ? '✕' : issue.severity === 'warning' ? '!' : '✓'}
                  </span>
                  <span
                    className={
                      issue.severity === 'error'
                        ? 'text-red-600 dark:text-red-400'
                        : issue.severity === 'warning'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600'
                    }
                  >
                    {issue.text}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <AdSlot id="qr-utm-audit-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Clean UTMs, Trustworthy Reports</h2>
        <p className="text-base leading-relaxed">
          UTM parameters are only useful if they are consistent. One campaign spelled two ways, one
          medium in capitals, or one missing source turns a clean report into a puzzle: the same
          traffic appears under several labels, and nobody trusts the totals. Auditing the URL
          before it goes to print is cheap; fixing it afterwards means reprinting.
        </p>
        <AdSlot id="qr-utm-audit-checker-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">A naming habit that scales</h3>
        <p className="text-base leading-relaxed">
          Agree on lowercase names once — source for the placement, medium for the channel, campaign
          for the campaign — and reuse them verbatim. Write the convention down where everyone who
          builds links can find it, and audit every new URL before it ships.
        </p>
      </article>
      <AdSlot id="qr-utm-audit-checker-pre-related" format="horizontal-banner" />
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
      <AdSlot id="qr-utm-audit-checker-bottom" format="horizontal-banner" />
    </div>
  );
}
