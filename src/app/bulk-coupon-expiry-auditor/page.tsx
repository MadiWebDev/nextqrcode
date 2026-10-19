'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ticket } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function BulkCouponExpiryAuditorPage() {
  const [raw, setRaw] = useState(
    'code, offer, expiry, url\nWELCOME20,20% off first order,2026-10-01,https://example.com/shop\nCOFFEE-FREE,Free coffee,2026-11-15,https://example.com/shop\nWEEKEND10,10% off weekends,2027-04-30,https://example.com/shop\nOLD50,50% off clearance,not-a-date,https://example.com/shop'
  );
  const [within, setWithin] = useState(30);
  const [filter, setFilter] = useState('All');
  const [copied, setCopied] = useState(false);
  const splitCsvLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        out.push(cur.trim());
        cur = '';
      } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };
  const rows = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line, idx) => {
        if (idx === 0 && /^[^,]*,(offer|code|expiry)/i.test(line)) return null;
        const parts = line.includes(',')
          ? splitCsvLine(line)
          : line.split('|').map((p) => p.trim());
        const code = (parts[0] || '').trim();
        const offer = (parts[1] || '').trim();
        const expiry = (parts[2] || '').trim();
        const url = (parts[3] || '').trim();
        const d = expiry ? new Date(expiry + (expiry.length === 10 ? 'T00:00:00' : '')) : null;
        const valid = !!d && !isNaN(d.getTime());
        const days = valid && d ? Math.round((d.getTime() - today.getTime()) / 86400000) : null;
        const status = !code
          ? 'Missing code'
          : !valid
            ? 'Invalid date'
            : (days as number) < 0
              ? 'Expired'
              : (days as number) <= within
                ? 'Expiring soon'
                : 'Valid';
        return { code, offer, expiry, url, status, days };
      })
      .filter(
        (
          r
        ): r is {
          code: string;
          offer: string;
          expiry: string;
          url: string;
          status: string;
          days: number | null;
        } => r !== null
      );
  }, [raw, within]);
  const counts = {
    expired: rows.filter((r) => r.status === 'Expired').length,
    expiring: rows.filter((r) => r.status === 'Expiring soon').length,
    valid: rows.filter((r) => r.status === 'Valid').length,
    bad: rows.filter((r) => r.status === 'Invalid date' || r.status === 'Missing code').length,
  };
  const shown = filter === 'All' ? rows : rows.filter((r) => r.status === filter);
  const copySummary = async () => {
    const txt =
      'Coupon expiry audit: ' +
      rows.length +
      ' coupons — ' +
      counts.expired +
      ' expired, ' +
      counts.expiring +
      ' expiring within ' +
      within +
      ' days, ' +
      counts.valid +
      ' valid, ' +
      counts.bad +
      ' with problems.\n' +
      rows
        .map((r) =>
          [r.code, r.offer, r.expiry, r.status, r.days === null ? '' : r.days + ' days'].join(',')
        )
        .join('\n');
    await navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const downloadCsv = () => {
    const csv =
      'code,offer,expiry,url,status,days_remaining\n' +
      rows
        .map((r) =>
          [r.code, r.offer, r.expiry, r.url, r.status, r.days === null ? '' : String(r.days)].join(
            ','
          )
        )
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coupon-expiry-audit.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: 'Does the auditor delete expired coupons?',
      answer: 'No. It flags them. You decide whether to remove, extend, or replace each one.',
    },
    {
      question: 'What date format should expiry use?',
      answer: 'YYYY-MM-DD, for example 2027-04-30. A full date with a time also parses.',
    },
    {
      question: "What does 'days remaining' mean for an expired coupon?",
      answer:
        'A negative number: how many days ago it expired. Expired 5 days ago shows as 5 days ago in the row detail.',
    },
    {
      question: 'Can I audit a list with a header row?',
      answer:
        'Yes. A first row that looks like a header (code, offer, expiry) is skipped automatically.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Coupon Expiry Auditor',
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
          { label: 'Bulk Coupon Expiry Auditor', href: '/bulk-coupon-expiry-auditor' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Ticket className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Coupon Expiry Auditor
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a CSV of coupons and audit every expiry at once — expired, expiring soon, valid, and
          rows with missing or invalid dates — with counts, filters, and an audited CSV download.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your coupon list</h2>
            <div className="space-y-2">
              <Label htmlFor="raw">CSV rows: code, offer, expiry, url</Label>
              <textarea
                id="raw"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={10}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="within">Expiring-soon window (days)</Label>
              <Input
                id="within"
                type="number"
                min={1}
                max={365}
                value={within}
                onChange={(e) => setWithin(Math.max(1, parseInt(e.target.value || '30', 10)))}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Expired', 'Expiring soon', 'Valid', 'Invalid date', 'Missing code'].map(
                (f) => (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </Button>
                )
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copySummary}>
                {copied ? 'Copied!' : 'Copy audit summary'}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCsv}>
                Download audited CSV
              </Button>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                <div className="text-2xl font-extrabold">{counts.expired}</div>
                <div className="text-xs text-muted-foreground">Expired</div>
              </div>
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
                <div className="text-2xl font-extrabold">{counts.expiring}</div>
                <div className="text-xs text-muted-foreground">Expiring soon</div>
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3">
                <div className="text-2xl font-extrabold">{counts.valid}</div>
                <div className="text-xs text-muted-foreground">Valid</div>
              </div>
              <div className="rounded-lg bg-muted border p-3">
                <div className="text-2xl font-extrabold">{counts.bad}</div>
                <div className="text-xs text-muted-foreground">Problems</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {rows.length} coupon(s) audited. Showing {shown.length}.
            </p>
            <div className="space-y-2 max-h-96 overflow-auto">
              {shown.map((r, i) => (
                <div key={i} className="rounded-lg border border-border/70 p-3">
                  <div className="flex justify-between gap-2">
                    <span className="font-mono text-xs font-semibold">{r.code || '(no code)'}</span>
                    <span className="text-xs font-semibold shrink-0">{r.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {r.offer} — expiry {r.expiry || '(none)'}
                    {r.days !== null
                      ? ' (' +
                        (r.days < 0
                          ? Math.abs(r.days) + ' days ago'
                          : r.days === 0
                            ? 'today'
                            : 'in ' + r.days + ' days') +
                        ')'
                      : ''}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="bulk-coupon-expiry-auditor-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Auditing a Coupon List Before It Embarrasses You
        </h2>
        <p className="text-base leading-relaxed">
          An expired coupon that still circulates costs goodwill at the till: staff either honour a
          dead offer or argue with a customer who printed it in good faith. A list nobody audits
          grows stale quietly, because each coupon looks fine on its own. This auditor reads the
          whole list at once and sorts it into expired, expiring soon, valid, and broken rows, so
          the cleanup is one pass instead of a line-by-line hunt.
        </p>

        <AdSlot id="bulk-coupon-expiry-auditor-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">What counts as expiring soon</h3>
        <p className="text-base leading-relaxed">
          The expiring-soon window is yours to set — 30 days by default. A coupon inside the window
          is still valid, but it needs a decision: extend it, replace it, or let it lapse and remove
          it from circulation. Coupons with missing codes or unparseable dates are listed
          separately, because they cannot be honoured reliably even if the offer text looks fine.
        </p>
        <h3 className="text-xl font-semibold text-foreground">After the audit</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Remove expired codes from every place they appear — posters, emails, and the till list.
          </li>
          <li>Decide on expiring-soon codes before they lapse, not after.</li>
          <li>Fix broken rows: a coupon with an invalid date is a dispute waiting to happen.</li>
          <li>
            Keep the audited CSV with the campaign file as the record of what was live and when.
          </li>
        </ul>
      </article>
      <AdSlot id="bulk-coupon-expiry-auditor-pre-related" format="horizontal-banner" />

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

      <AdSlot id="bulk-coupon-expiry-auditor-bottom" format="horizontal-banner" />
    </div>
  );
}
