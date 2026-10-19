'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRBatchDuplicateDetectorPage() {
  const [raw, setRaw] = useState(
    'https://example.com/menu\nhttps://example.com/menu/\nhttps://example.com/menu?\nhttps://example.com/menus\nhttps://EXAMPLE.com/menu\nhttps://example.com/about'
  );
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSlash, setIgnoreSlash] = useState(true);
  const lev = (a: string, b: string) => {
    const m = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let i = 1; i <= a.length; i++) {
      m[0][i] = i;
    }
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        m[j][i] = Math.min(
          m[j][i - 1] + 1,
          m[j - 1][i] + 1,
          m[j - 1][i - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return m[b.length][a.length];
  };
  const analysis = useMemo(() => {
    const norm = (s: string) => {
      let x = s.trim();
      if (ignoreCase) x = x.toLowerCase();
      x = x.replace(/^https?:\/\//, '').replace(/^www\./, '');
      if (ignoreSlash) x = x.replace(/\/+$/, '');
      return x;
    };
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const groups = new Map<string, string[]>();
    lines.forEach((l) => {
      const k = norm(l);
      const g = groups.get(k) || [];
      g.push(l);
      groups.set(k, g);
    });
    const dupGroups = Array.from(groups.entries()).filter(([, v]) => v.length > 1);
    const uniques = Array.from(groups.keys());
    const near: Array<[string, string, number]> = [];
    for (let i = 0; i < uniques.length; i++)
      for (let j = i + 1; j < uniques.length; j++) {
        const d = lev(uniques[i], uniques[j]);
        const maxLen = Math.max(uniques[i].length, uniques[j].length);
        if (maxLen > 0 && d > 0 && d <= 2 && d / maxLen <= 0.12)
          near.push([uniques[i], uniques[j], d]);
      }
    return {
      lines,
      dupGroups,
      uniques,
      near,
      dupCount: dupGroups.reduce((n, [, v]) => n + v.length - 1, 0),
    };
  }, [raw, ignoreCase, ignoreSlash]);

  const faqs = [
    {
      question: 'Does it delete duplicates?',
      answer: 'No. It groups them and shows you the copies so you decide which one to keep.',
    },
    {
      question: 'Why do https://example.com/menu and https://example.com/menu/ group together?',
      answer:
        'A trailing slash is ignored when that option is on, because most servers treat the two as the same destination.',
    },
    {
      question: 'What is edit distance?',
      answer:
        'The smallest number of single-character insertions, deletions, or substitutions needed to turn one string into another. A distance of 1 or 2 usually means a typo.',
    },
    {
      question: 'Can I paste payloads that are not URLs?',
      answer:
        'Yes. Any text payload works \u2014 vCards, Wi-Fi strings, plain text \u2014 as long as there is one payload per line.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Batch Duplicate Detector',
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
          { label: 'QR Batch Duplicate Detector', href: '/qr-batch-duplicate-detector' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Copy className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Batch Duplicate Detector
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a list of payloads or URLs and find exact duplicates plus near-duplicates — the
          typos and trailing-slash copies that silently create two codes for one destination.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your payloads</h2>
            <div className="space-y-2">
              <Label htmlFor="raw">One payload or URL per line</Label>
              <textarea
                id="raw"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={10}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
              />{' '}
              Ignore letter case when comparing
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ignoreSlash}
                onChange={(e) => setIgnoreSlash(e.target.checked)}
              />{' '}
              Ignore a trailing slash
            </label>
            <p className="text-xs text-muted-foreground">
              Normalisation also strips the scheme (http/https) and a leading www. so the same
              destination written two ways still groups together.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <div className="text-2xl font-extrabold">{analysis.lines.length}</div>
                <div className="text-xs text-muted-foreground">Rows</div>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <div className="text-2xl font-extrabold">{analysis.uniques.length}</div>
                <div className="text-xs text-muted-foreground">Unique</div>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <div className="text-2xl font-extrabold">{analysis.dupCount}</div>
                <div className="text-xs text-muted-foreground">Extra copies</div>
              </div>
            </div>
            {analysis.dupGroups.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">
                  Exact duplicate groups ({analysis.dupGroups.length})
                </h3>
                <div className="space-y-2">
                  {analysis.dupGroups.map(([k, v], i) => (
                    <div key={i} className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                      <p className="font-mono text-xs break-all">{k}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Appears {v.length} times: {v.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analysis.near.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">
                  Near-duplicates ({analysis.near.length})
                </h3>
                <div className="space-y-2">
                  {analysis.near.map(([a, b, d], i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"
                    >
                      <p className="font-mono text-xs break-all">{a}</p>
                      <p className="font-mono text-xs break-all">{b}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Edit distance {d} — one may be a typo of the other.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analysis.dupGroups.length === 0 && analysis.near.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No duplicates or near-duplicates found in this list.
              </p>
            )}
          </Card>
        </div>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-batch-duplicate-detector-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why Duplicate QR Codes Are a Real Problem
        </h2>
        <p className="text-base leading-relaxed">
          Two codes for one destination split your scan counts, confuse staff who cannot tell which
          code is current, and leave an old code in circulation after the campaign ends. Duplicates
          creep in quietly: someone re-exports a batch, a URL gains a trailing slash, a colleague
          retypes a link with different capitalisation, and suddenly the same destination has three
          codes. This detector groups the list after normalisation, so copies that look different on
          the surface still land in one group.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-batch-duplicate-detector-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Exact vs near-duplicates</h3>
        <p className="text-base leading-relaxed">
          Exact duplicates match after normalisation — same destination, different spelling of the
          same text. Near-duplicates are different strings a small edit distance apart, such as menu
          and menus, which are usually a typo but could be two genuinely different pages. The tool
          flags near-duplicates for a human decision instead of deleting them, because only you know
          whether both pages are meant to exist.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Cleaning a batch before printing</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Paste the full payload list, not just the labels — labels can match while payloads
            differ.
          </li>
          <li>Resolve every exact duplicate: keep one code per destination.</li>
          <li>Check each near-duplicate pair and confirm both pages are intended.</li>
          <li>Re-run the check after edits: fixing one duplicate can reveal another.</li>
          <li>Keep the cleaned list with the job file so the next reprint starts from it.</li>
        </ul>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-batch-duplicate-detector-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-batch-duplicate-detector-bottom" format="horizontal-banner" />
    </div>
  );
}
