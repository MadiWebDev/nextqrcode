'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2 } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRUrlAnatomyCheckerPage() {
  const [url, setUrl] = useState(
    'https://shop.example.co.uk/deals/summer?utm_source=qr&ref=poster#top'
  );
  const parsed = useMemo(() => {
    try {
      const u = new URL(url);
      const host = u.hostname;
      const labels = host.split('.').filter(Boolean);
      const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.includes(':');
      const params = Array.from(u.searchParams.entries());
      const flags: string[] = [];
      if (u.protocol !== 'https:')
        flags.push('Not HTTPS — data sent to this destination is not encrypted in transit.');
      if (isIp)
        flags.push('Host is an IP address, not a domain — legitimate sites rarely do this.');
      if (host.includes('xn--'))
        flags.push('Host contains punycode (xn--) — check for lookalike Unicode characters.');
      if (labels.length > 4)
        flags.push(
          'Deep subdomain chain (' +
            labels.length +
            ' labels) — often used to bury the real domain.'
        );
      if (url.length > 200)
        flags.push(
          'Very long URL (' + url.length + ' characters) — long URLs hide the real destination.'
        );
      if (u.username || u.password)
        flags.push(
          'URL contains embedded credentials — never trust a link with a username or password in it.'
        );
      if (u.port) flags.push('Non-default port ' + u.port + ' — unusual for a public link.');
      if (params.length > 8)
        flags.push(
          'Many query parameters (' +
            params.length +
            ') — review them for tracking or personal data.'
        );
      return { ok: true as const, u, host, labels, isIp, params, flags };
    } catch {
      return {
        ok: false as const,
        flags: [
          'Could not parse this as a URL. A QR destination should be a complete URL starting with https://.',
        ],
        params: [] as Array<[string, string]>,
        host: '',
        labels: [] as string[],
        isIp: false,
        u: null as unknown as URL,
      };
    }
  }, [url]);
  const tld = parsed.labels.length ? parsed.labels[parsed.labels.length - 1] : '';
  const registrable = parsed.labels.length >= 2 ? parsed.labels.slice(-2).join('.') : parsed.host;
  const subdomains = parsed.labels.length > 2 ? parsed.labels.slice(0, -2) : [];

  const faqs = [
    {
      question: 'What is the registrable domain?',
      answer:
        'The domain plus its public suffix \u2014 for example example.co.uk. Subdomains sit to its left and do not change who owns the site.',
    },
    {
      question: 'Why does subdomain depth matter?',
      answer:
        'A long subdomain chain can bury the real domain, so a reader stops at a familiar word and misses who actually owns the site.',
    },
    {
      question: 'Is an IP address host always malicious?',
      answer:
        'No, but it is unusual for a public link. Legitimate sites use domain names; bare-IP links deserve a second check.',
    },
    {
      question: 'Does this tool fetch the URL?',
      answer:
        'No. It parses the text locally. It never requests the destination, so it cannot tell you what the page contains.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR URL Anatomy Checker',
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
          { label: 'QR URL Anatomy Checker', href: '/qr-url-anatomy-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Link2 className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR URL Anatomy Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a QR destination URL and see it taken apart — scheme, subdomains, registrable
          domain, TLD, path, parameters, punycode, and IP hosts — with a risk flag on each risky
          part.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste the destination URL</h2>
            <div className="space-y-2">
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page?x=1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Parsed live in your browser with the standard URL parser. Nothing is fetched or sent
              anywhere.
            </p>
            {!parsed.ok && (
              <p className="text-sm text-red-600" role="alert">
                Could not parse this as a URL. Enter a complete URL starting with https://
              </p>
            )}
            {parsed.ok && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Scheme</span>
                  <span className="font-mono font-semibold">{parsed.u.protocol}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Host</span>
                  <span className="font-mono font-semibold break-all">{parsed.host}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Registrable domain</span>
                  <span className="font-mono font-semibold">{registrable}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">TLD</span>
                  <span className="font-mono font-semibold">{tld}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Subdomain depth</span>
                  <span className="font-mono font-semibold">
                    {subdomains.length} ({subdomains.join('.') || 'none'})
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Path</span>
                  <span className="font-mono font-semibold break-all">{parsed.u.pathname}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Fragment</span>
                  <span className="font-mono font-semibold">{parsed.u.hash || '(none)'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">URL length</span>
                  <span className="font-mono font-semibold">{url.length} chars</span>
                </div>
              </div>
            )}
            {parsed.ok && parsed.params.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">
                  Query parameters ({parsed.params.length})
                </h3>
                <div className="space-y-1">
                  {parsed.params.map(([k, v], i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="font-mono font-semibold break-all">{k}</span>
                      <span className="font-mono break-all text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm font-semibold">
              {parsed.ok
                ? parsed.flags.length
                  ? parsed.flags.length + ' risk flag(s) found'
                  : 'No risk flags in the anatomy'
                : 'Unparseable URL'}
            </p>
            <div className="space-y-2">
              {parsed.flags.map((f, i) => (
                <p
                  key={i}
                  className="text-sm text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
                >
                  {f}
                </p>
              ))}
            </div>
            {parsed.ok && parsed.flags.length === 0 && (
              <p className="text-sm text-muted-foreground">
                A clean anatomy does not prove a destination is safe — the page itself could still
                be malicious. Use it as one check among several.
              </p>
            )}
            {parsed.ok && (
              <p className="text-xs text-muted-foreground">
                The registrable domain is the part you should compare against the brand on the sign.
                Subdomains to its left do not change who owns the site.
              </p>
            )}
          </Card>
        </div>
      </div>
      <AdSlot id="qr-url-anatomy-checker-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Reading a URL Like a Security Reviewer
        </h2>
        <p className="text-base leading-relaxed">
          Most phishing links do not look obviously fake. They bury the real domain under
          subdomains, stretch the URL so the important part scrolls off screen, or swap in a
          lookalike domain with a different top-level domain. The anatomy view fights that by
          splitting the URL into its structural parts: the scheme, the host, the registrable domain,
          the subdomain chain, the path, and every query parameter. Read the registrable domain
          first — that is who actually owns the site.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          The registrable domain is the truth
        </h3>
        <p className="text-base leading-relaxed">
          In shop.example.co.uk, the registrable domain is example.co.uk; shop is just a subdomain.
          In secure-login.example.com.evil.example, the registrable domain is evil.example and
          everything before it is decoration. Attackers rely on readers stopping at the first
          familiar word. Always read the domain from the right, and compare the registrable domain
          against the brand on the sign.
        </p>
        <AdSlot id="qr-url-anatomy-checker-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">
          Anatomy signals that deserve a second look
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>HTTP instead of HTTPS: the connection is not encrypted.</li>
          <li>An IP address as the host: legitimate public sites rarely link to bare IPs.</li>
          <li>Punycode (xn--) in the host: the domain may contain lookalike Unicode characters.</li>
          <li>A deep subdomain chain burying the real domain.</li>
          <li>Embedded credentials (user:pass@host) — a classic disguise.</li>
          <li>A long tail of query parameters carrying tracking IDs or personal data.</li>
        </ul>
        <p className="text-base leading-relaxed">
          None of these alone proves a link is malicious, and a clean anatomy does not prove it is
          safe. Anatomy tells you where to look; the destination page itself still needs a check
          before you sign in or pay.
        </p>
      </article>
      <AdSlot id="qr-url-anatomy-checker-pre-related" format="horizontal-banner" />
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
      <AdSlot id="qr-url-anatomy-checker-bottom" format="horizontal-banner" />
    </div>
  );
}
