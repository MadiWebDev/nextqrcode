'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BadgeAlert } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRBrandImpersonationCheckerPage() {
  const [brand, setBrand] = useState('nextqrcode');
  const [domain, setDomain] = useState('nextqrcode-login.com');
  const lev = (a: string, b: string) => {
    const m: number[][] = Array.from({ length: b.length + 1 }, (_, j) =>
      Array.from({ length: a.length + 1 }, (_, i) => (j === 0 ? i : i === 0 ? j : 0))
    );
    for (let j = 1; j <= b.length; j++)
      for (let i = 1; i <= a.length; i++)
        m[j][i] = Math.min(
          m[j][i - 1] + 1,
          m[j - 1][i] + 1,
          m[j - 1][i - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
    return m[b.length][a.length];
  };
  const result2 = useMemo(() => {
    const b = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const host = domain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split(':')[0];
    const labels = host.split('.').filter(Boolean);
    const registrable = labels.length >= 2 ? labels.slice(-2).join('.') : host;
    const sld = labels.length >= 2 ? labels[labels.length - 2] : host;
    const tricks: Array<{ name: string; detail: string; points: number }> = [];
    if (!b)
      return {
        tricks: [],
        score: 0,
        host,
        registrable,
        sld,
        verdict: 'Enter a brand name to compare against.',
      };
    if (registrable === b + '.com' || sld === b)
      tricks.push({
        name: 'Exact brand domain',
        detail:
          'The domain is the brand itself. This may be the genuine domain — verify it through a channel you already trust.',
        points: 0,
      });
    if (sld.includes(b) && sld !== b) {
      if (sld.startsWith(b + '-') || sld.startsWith(b))
        tricks.push({
          name: 'Brand + suffix',
          detail: 'The domain starts with the brand and adds extra words or a suffix: ' + sld + '.',
          points: 30,
        });
      if (sld.endsWith('-' + b) || sld.endsWith(b))
        tricks.push({
          name: 'Brand + prefix',
          detail: 'The domain ends with the brand after extra words: ' + sld + '.',
          points: 30,
        });
    }
    const KEYWORDS = [
      'login',
      'signin',
      'secure',
      'verify',
      'support',
      'help',
      'account',
      'update',
      'official',
      'app',
      'wallet',
      'pay',
    ];
    KEYWORDS.forEach((k) => {
      if (sld.includes(b) && sld.includes(k) && sld !== b)
        tricks.push({
          name: 'Trust keyword: ' + k,
          detail: 'The domain combines the brand with a trust word (' + k + ') to sound official.',
          points: 15,
        });
    });
    if (labels.length > 2 && labels.slice(0, -2).join('.').includes(b))
      tricks.push({
        name: 'Brand in subdomain only',
        detail:
          'The brand appears in a subdomain, but the registrable domain is ' +
          registrable +
          ' — a different owner.',
        points: 35,
      });
    const d = lev(sld, b);
    if (d > 0 && d <= 2)
      tricks.push({
        name: 'Near-miss spelling',
        detail:
          'The domain is ' +
          d +
          ' edit(s) away from the brand (' +
          sld +
          ' vs ' +
          b +
          ') — a possible typo-squat.',
        points: 35,
      });
    if (host.includes('xn--'))
      tricks.push({
        name: 'Punycode present',
        detail: 'The domain contains xn--, which can hide lookalike Unicode characters.',
        points: 25,
      });
    if (registrable !== b + '.com' && sld === b)
      tricks.push({
        name: 'Unusual TLD for the brand',
        detail:
          'The brand name is on a different top-level domain than the usual .com: ' +
          registrable +
          '.',
        points: 15,
      });
    if (sld.replace(/0/g, 'o').replace(/1/g, 'l').replace(/5/g, 's') === b && sld !== b)
      tricks.push({
        name: 'Digit lookalike',
        detail:
          'Digits in the domain stand in for letters of the brand (0 for o, 1 for l, 5 for s).',
        points: 25,
      });
    const score = Math.min(
      100,
      tricks.reduce((n, t) => n + t.points, 0)
    );
    const verdict =
      tricks.length === 0
        ? 'No impersonation tricks found in this comparison.'
        : score >= 60
          ? 'High impersonation risk — treat this domain as suspicious.'
          : score >= 30
            ? 'Moderate impersonation risk — verify through a trusted channel.'
            : 'Low score — check the remaining notes before trusting it.';
    return { tricks, score, host, registrable, sld, verdict };
  }, [brand, domain]);

  const faqs = [
    {
      question: 'Does a high score prove the domain is malicious?',
      answer:
        "No. It means the domain's shape matches known impersonation tricks. A legitimate partner or reseller can share a name with a brand \u2014 verify through a channel you already trust.",
    },
    {
      question: 'What if the brand name is a common word?',
      answer:
        'Common-word brands produce more false positives. Treat the score as a prompt to verify, not as a verdict.',
    },
    {
      question: 'Why does the registrable domain matter more than the subdomain?',
      answer:
        'The registrable domain decides who owns the site. Anything in a subdomain is decoration controlled by that owner.',
    },
    {
      question: 'Does this tool check who owns the domain?',
      answer:
        'No. It compares the two strings you enter. Ownership checks need a domain lookup, which this tool does not perform.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Brand Impersonation Checker',
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
          { label: 'QR Brand Impersonation Checker', href: '/qr-brand-impersonation-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <BadgeAlert className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Brand Impersonation Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enter a brand name and a suspect domain. The checker scores impersonation tricks — prefix,
          suffix, trust keywords, near-miss spelling, punycode, and brand-in-subdomain — and lists
          each one it finds.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Enter the brand and the suspect domain</h2>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand name</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Suspect domain</Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="suspect-domain.com"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Comparison is computed from the two strings you enter. The tool does not look up who
              owns the domain — a high score means the shape matches known impersonation tricks, not
              a confirmed verdict about the owner.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Impersonation score</div>
              <div className="text-4xl font-extrabold text-primary">{result2.score} / 100</div>
            </div>
            <p className="font-semibold">{result2.verdict}</p>
            <p className="text-xs text-muted-foreground">
              Registrable domain: <span className="font-mono">{result2.registrable}</span>
            </p>
            {result2.tricks.length > 0 && (
              <div className="space-y-2">
                {result2.tricks.map((t, i) => (
                  <div key={i} className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <p className="font-semibold text-sm">
                      {t.name} <span className="text-xs text-muted-foreground">(+{t.points})</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t.detail}</p>
                  </div>
                ))}
              </div>
            )}
            {result2.tricks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No prefix, suffix, keyword, near-miss, punycode, or subdomain tricks were found for
                this pair.
              </p>
            )}
          </Card>
        </div>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-brand-impersonation-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How Brand Impersonation Works</h2>
        <p className="text-base leading-relaxed">
          Impersonation domains do not need to be convincing at a glance — they need to survive a
          half-second look. The common tricks are all variations on one idea: put the real brand
          name somewhere in the domain where a hurried reader will see it, while the part that
          actually decides ownership — the registrable domain — belongs to someone else. A domain
          such as brand-login.example can look like the brand&apos;s login page until you notice
          that the registrable domain is example, not the brand.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-brand-impersonation-checker-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">The tricks this checker looks for</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Prefix / suffix: the brand plus extra words, such as brand-support or support-brand.
          </li>
          <li>
            Trust keywords: login, secure, verify, support, or official added to sound legitimate.
          </li>
          <li>Brand in a subdomain only: brand.evil.example is owned by evil.example.</li>
          <li>
            Near-miss spelling: one or two characters changed, such as a missing or swapped letter.
          </li>
          <li>Digit lookalikes: 0 for o, 1 for l, 5 for s.</li>
          <li>Punycode: xn-- hiding lookalike Unicode characters.</li>
          <li>An unexpected top-level domain for a brand you know as .com.</li>
        </ul>
        <h3 className="text-xl font-semibold text-foreground">
          What to do with a suspicious domain
        </h3>
        <p className="text-base leading-relaxed">
          Do not open it from the link you were given. If you need the brand&apos;s site, type its
          address yourself or use a bookmark you already trust. If the domain is impersonating a
          brand you manage, report it to the registrar and the brand&apos;s security team, and
          record the evidence with the incident report builder.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-brand-impersonation-checker-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-brand-impersonation-checker-bottom" format="horizontal-banner" />
    </div>
  );
}
