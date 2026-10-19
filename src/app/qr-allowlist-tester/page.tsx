'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListChecks } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

// Convert one allowlist pattern to a matcher. Supported forms:
//   "example.com"           — exact host
//   "*.example.com"         — host and all subdomains
//   "https://example.com/*" — scheme + host + path wildcard
//   "example.com/shop/*"    — host + path wildcard
// "*" in a pattern matches any characters (including slashes) within that segment.
function matchPattern(pattern: string, url: string): boolean {
  const p = pattern.trim();
  if (!p) return false;
  if (p === '*') return true;
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(p);
  const full = hasScheme ? p : `https://${p}`;
  const [patternHostPath] = full.split('#');
  const [patternHost, ...pathParts] = patternHostPath
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
    .split('/');
  const patternPath = `/${pathParts.join('/')}`;
  const host = parsed.hostname.toLowerCase();
  let hostMatch = false;
  const ph = patternHost.toLowerCase();
  if (ph.startsWith('*.')) {
    const base = ph.slice(2);
    hostMatch = host === base || host.endsWith(`.${base}`);
  } else if (ph.includes('*')) {
    const re = new RegExp(`^${ph.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
    hostMatch = re.test(host);
  } else {
    hostMatch = host === ph;
  }
  if (!hostMatch) return false;
  if (hasScheme && !p.toLowerCase().startsWith(`${parsed.protocol}//`)) return false;
  if (pathParts.length === 0 || patternPath === '/') return true;
  const pathRe = new RegExp(
    `^${patternPath.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`
  );
  return pathRe.test(parsed.pathname);
}

export default function QRAllowlistTesterPage() {
  const [url, setUrl] = useState('https://shop.example.com/checkout');
  const [list, setList] = useState(
    'https://example.com/*\nhttps://*.trusted-partner.com/*\nshop.example.com'
  );

  const result = useMemo(() => {
    const patterns = list
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const matched = patterns.filter((p) => matchPattern(p, url.trim()));
    let parsed = false;
    try {
      new URL(url.trim());
      parsed = true;
    } catch {
      parsed = false;
    }
    return { patterns, matched, allowed: parsed && matched.length > 0, parsed };
  }, [url, list]);

  const faqs = [
    {
      question: 'How do the patterns work?',
      answer:
        'One pattern per line. "example.com" matches that host exactly. "*.example.com" matches the host and all its subdomains. Adding a path with "*" matches any path under it, e.g. "example.com/shop/*". A lone "*" matches everything — useful for testing, dangerous as a real policy.',
    },
    {
      question: 'What does "deny" mean here?',
      answer:
        'Deny means the URL matched no allowlist entry, so a scanner enforcing this list would refuse it. It does not mean the URL is malicious — it means it is not on the list.',
    },
    {
      question: 'Does this check whether the URL is safe?',
      answer:
        'No. Allowlist matching checks membership only. An allowed domain can still host a malicious page, and a denied domain can be perfectly safe. This tester checks policy fit, not safety.',
    },
    {
      question: 'Is anything sent to a server?',
      answer:
        'No. The URL and the list are matched entirely in your browser. Nothing leaves the page.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Allowlist Tester',
    applicationCategory: 'SecurityApplication',
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
          { label: 'QR Allowlist Tester', href: '/qr-allowlist-tester' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ListChecks className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Allowlist Tester
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Test a URL against your own allowlist with wildcard matching. Editing the URL or the list
          recomputes the allow / deny verdict and names the matching rule. Everything runs in your
          browser.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter the URL and the allowlist</h2>
            <div className="space-y-2">
              <Label htmlFor="url">URL to test</Label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list">Allowlist — one pattern per line</Label>
              <textarea
                id="list"
                value={list}
                onChange={(e) => setList(e.target.value)}
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Matching: host must match exactly or via a *. wildcard (which also covers the bare
              domain); a scheme prefix restricts the scheme; a path ending in * matches any path
              under it. Patterns without a scheme match any scheme.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div
              className={`text-center rounded-xl border p-4 ${!result.parsed ? 'bg-amber-500/10 border-amber-500/30' : result.allowed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}
            >
              <div className="text-xs text-muted-foreground">Verdict</div>
              <div
                className={`text-3xl font-extrabold ${!result.parsed ? 'text-amber-600' : result.allowed ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {!result.parsed ? 'Invalid URL' : result.allowed ? 'ALLOW' : 'DENY'}
              </div>
              <div className="text-sm text-muted-foreground">
                {!result.parsed
                  ? 'The URL could not be parsed.'
                  : result.allowed
                    ? `${result.matched.length} matching rule(s)`
                    : 'No allowlist entry matched.'}
              </div>
            </div>
            {result.matched.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Matched rules</h3>
                {result.matched.map((m, i) => (
                  <p
                    key={i}
                    className="rounded-md bg-muted px-3 py-1.5 text-xs font-mono break-all"
                  >
                    {m}
                  </p>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.parsed && !result.allowed
                ? 'A deny here means "not on the list", not "malicious". Add the destination to the allowlist only after verifying it is yours and trustworthy.'
                : ''}
            </p>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-allowlist-tester-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Test the Policy Before It Ships</h2>
        <p className="text-base leading-relaxed">
          An allowlist is only as good as its matching. A pattern that looks right can miss a
          subdomain, a path, or a scheme — and the first time anyone notices is when a legitimate
          scan is refused, or a URL that should have been refused slips through. Testing each real
          destination against the exact list before deployment turns policy into evidence.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-allowlist-tester-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Keep the list tight</h3>
        <p className="text-base leading-relaxed">
          Prefer exact hosts and specific paths over broad wildcards. Every * is a hole someone else
          can walk through — a wildcard subdomain covers every future subdomain, including ones you
          have not created yet.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-allowlist-tester-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-allowlist-tester-bottom" format="horizontal-banner" />
    </div>
  );
}
