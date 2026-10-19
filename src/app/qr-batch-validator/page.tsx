'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ListFilter, Download, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

type Status = 'pass' | 'warn' | 'fail';

interface Row {
  line: number;
  url: string;
  status: Status;
  issues: string[];
}

function validateLine(raw: string, line: number, seen: Map<string, number>): Row {
  const url = raw.trim();
  const issues: string[] = [];
  if (!url)
    return {
      line,
      url: '(blank line)',
      status: 'fail',
      issues: ['Empty line. Remove it or paste a URL.'],
    };
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      line,
      url,
      status: 'fail',
      issues: [
        'Does not parse as a valid absolute URL. Include the scheme, e.g. https://example.com/page.',
      ],
    };
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    issues.push(
      `Scheme is ${parsed.protocol.replace(':', '')} — QR destinations should use https (http tolerated only for local testing).`
    );
  }
  if (parsed.protocol === 'http:')
    issues.push('Plain HTTP — data sent to this destination is not encrypted.');
  if (!parsed.hostname) issues.push('No host in this URL.');
  if (parsed.username || parsed.password)
    issues.push('URL embeds credentials before the @ sign — remove them.');
  if (/\s/.test(url))
    issues.push('Contains whitespace — a URL with a space will break when scanned or copied.');
  if (/[\u0000-\u001F\u007F]/.test(url)) issues.push('Contains control characters.');
  if (url.length > 2048)
    issues.push(
      `Very long (${url.length} characters) — long URLs make dense, hard-to-scan codes. Use a short redirect you control.`
    );
  const norm = url.toLowerCase().replace(/\/+$/, '');
  const firstSeen = seen.get(norm);
  if (firstSeen !== undefined) {
    issues.push(`Duplicate of line ${firstSeen} (case-insensitive, trailing slashes ignored).`);
  } else {
    seen.set(norm, line);
  }
  let status: Status = 'pass';
  if (
    issues.some(
      (i) =>
        i.startsWith('Duplicate') ||
        i.startsWith('Does not parse') ||
        i.startsWith('Contains whitespace') ||
        i.startsWith('Contains control') ||
        i.startsWith('No host') ||
        i.startsWith('URL embeds')
    )
  )
    status = 'fail';
  else if (issues.length > 0) status = 'warn';
  return { line, url, status, issues };
}

function toCsv(rows: Row[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [['Line', 'URL', 'Status', 'Issues'].map(esc).join(',')];
  for (const r of rows)
    lines.push([String(r.line), r.url, r.status, r.issues.join(' | ')].map(esc).join(','));
  return lines.join('\r\n');
}

const FAQS = [
  {
    question: 'Does this tool check whether the URLs actually load?',
    answer:
      'No. It validates format, scheme, length, duplicates, and dangerous patterns — all offline, in your browser. Reachability needs a network request, and browsers block most cross-origin reads, so a fetch-based check from this page would mostly report unknown. Validate format here, then check reachability with your own monitoring or a terminal request.',
  },
  {
    question: 'Why flag duplicates case-insensitively?',
    answer:
      'Because hosts are case-insensitive and most servers treat paths with only case differences as the same page. Two lines that differ only by case or a trailing slash usually mean the same destination was pasted twice, which wastes print and splits any tracking between two codes.',
  },
  {
    question: 'What counts as a pass, a warning, and a failure?',
    answer:
      'Pass means no issues found. Warning means the URL is usable but has a weakness worth fixing, such as plain HTTP or extreme length. Failure means the URL is broken or risky as written — unparseable, containing credentials or whitespace, or a duplicate. Fix every failure before printing.',
  },
  {
    question: 'How many URLs can I validate at once?',
    answer:
      'Up to 500 lines. Beyond that, split the batch. Large batches are usually a sign the list should live in a spreadsheet or a redirect manager, where validation and deduplication happen once instead of at print time.',
  },
];

export default function QRBatchValidatorPage() {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | Status>('all');

  const rows = useMemo(() => {
    const lines = input.split('\n').slice(0, 500);
    const seen = new Map<string, number>();
    return lines
      .filter((l) => l.trim() !== '' || input.trim() !== '')
      .map((l, i) => validateLine(l, i + 1, seen));
  }, [input]);

  const filtered = useMemo(
    () => (filter === 'all' ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );
  const counts = useMemo(() => {
    const c: Record<Status, number> = { pass: 0, warn: 0, fail: 0 };
    for (const r of rows) c[r.status] += 1;
    return c;
  }, [rows]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-batch-validation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setInput(
      [
        'https://example.com/menu',
        'https://example.com/menu/',
        'http://example.com/old-page',
        'example.com/missing-scheme',
        'https://example.com/very-long-page?x=1',
      ].join('\n')
    );
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Batch Validator',
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
          { label: 'QR Batch Validator', href: '/qr-batch-validator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ListFilter className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Batch Validator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Validate many QR destination URLs at once — format, scheme, length, whitespace, and
          duplicate detection — with a pass/warn/fail table you can filter and export as CSV. Up to
          500 lines, all checked offline in your browser.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Paste URLs (one per line)</h2>
            <div className="space-y-1.5">
              <Label htmlFor="batch-urls">Destination URLs</Label>
              <Textarea
                id="batch-urls"
                rows={12}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/menu — up to 500 lines.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadExample}>
              Load a small demo list
            </Button>
            <p className="text-xs text-muted-foreground">
              {rows.length} URL(s) checked — {counts.pass} pass · {counts.warn} warning ·{' '}
              {counts.fail} fail
            </p>
          </Card>
        </div>
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Results</h2>
              <div className="flex flex-wrap gap-2">
                {(['all', 'pass', 'warn', 'fail'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${filter === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {f === 'all'
                      ? 'All'
                      : f === 'pass'
                        ? 'Pass'
                        : f === 'warn'
                          ? 'Warning'
                          : 'Fail'}
                  </button>
                ))}
                <Button size="sm" variant="outline" onClick={exportCsv} className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </Button>
              </div>
            </div>
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Paste URLs on the left to see the validation table here.
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No rows match this filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Line</th>
                      <th className="py-2 pr-3 font-semibold">URL</th>
                      <th className="py-2 pr-3 font-semibold">Status</th>
                      <th className="py-2 font-semibold">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.line} className="border-t border-border/50 align-top">
                        <td className="py-2 pr-3">{r.line}</td>
                        <td className="py-2 pr-3 font-mono break-all max-w-[240px]">{r.url}</td>
                        <td className="py-2 pr-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${r.status === 'pass' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : r.status === 'warn' ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}
                          >
                            {r.status === 'pass' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : r.status === 'warn' ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {r.status === 'pass'
                              ? 'Pass'
                              : r.status === 'warn'
                                ? 'Warning'
                                : 'Fail'}
                          </span>
                        </td>
                        <td className="py-2">{r.issues.length === 0 ? '—' : r.issues.join(' ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Validating a batch of QR destinations before anything goes to print
        </h2>
        <p className="text-base leading-relaxed">
          A single wrong URL is a typo. A hundred wrong URLs is a print run in the bin. Batch
          validation exists for the moment when a list of destinations leaves a spreadsheet and
          heads for a printer: dozens or hundreds of codes, each one a promise to a scanner.
          Checking them one at a time is slow and unreliable, and skipping the check means the first
          person to find a mistake is a customer. The discipline is simple — validate the whole
          list, fix every failure, review every warning, and only then generate the codes.
        </p>
        <p className="text-base leading-relaxed">
          The failures this tool catches are the quiet ones. A missing scheme turns a URL into plain
          text that no scanner will open. Whitespace copied from a spreadsheet cell breaks the link
          invisibly. Credentials embedded in a URL — user:pass@host — leak secrets into every
          printed copy. Duplicates are the most wasteful failure of all: two codes, two labels, two
          tracking entries, all pointing at the same page, because the list was merged from two
          sources and nobody noticed. Catching duplicates case-insensitively matters, since hosts
          ignore case and trailing slashes rarely change the destination.
        </p>
        <p className="text-base leading-relaxed">
          Warnings deserve attention even though they are not failures. Plain HTTP destinations
          work, but they train visitors to accept unencrypted pages and they fail the trust test for
          anything involving a form or payment. Very long URLs work too, but they encode as dense
          symbols that need larger print and better cameras. Both are fixable upstream: serve the
          page over HTTPS, and point the code at a short redirect you control rather than a URL with
          a long query string. Fixing the destination is almost always cheaper than compensating
          with print size.
        </p>
        <p className="text-base leading-relaxed">
          Know what batch validation does not cover. It checks format, not reachability: a perfectly
          formatted URL can still point at a page that returns an error, a campaign that ended, or a
          redirect that now leads elsewhere. Pair format validation with a reachability check from
          your own monitoring or a terminal request, and with a human glance at the destinations
          themselves. A list that passes format validation and points at last year&apos;s campaign
          is still a failure — just a well-formatted one.
        </p>
        <p className="text-base leading-relaxed">
          Finally, treat the validated list as the single source of truth. Generate the codes from
          it, keep it with the job file, and re-validate it whenever it changes. A list that lives
          in a spreadsheet, gets edited by three people, and is pasted into a generator from memory
          will drift. A list that is validated, exported, and versioned will not. The cost is
          minutes; the saving is a reprint.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Batch Validation
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
    </div>
  );
}
