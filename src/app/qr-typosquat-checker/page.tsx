'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, AlertTriangle, Info } from 'lucide-react';

interface Variant {
  domain: string;
  kind: string;
  why: string;
}

const KEYBOARD: Record<string, string> = {
  q: 'wa',
  w: 'qeas',
  e: 'wrds',
  r: 'etdf',
  t: 'ryfg',
  y: 'tugh',
  u: 'yihj',
  i: 'uojk',
  o: 'ipkl',
  p: 'ol',
  a: 'qwsz',
  s: 'awedxz',
  d: 'serfcx',
  f: 'drtgvc',
  g: 'ftyhbv',
  h: 'gyujnb',
  j: 'huikmn',
  k: 'jiolm',
  l: 'kop',
  z: 'asx',
  x: 'zsdc',
  c: 'xdfv',
  v: 'cfgb',
  b: 'vghn',
  n: 'bhjm',
  m: 'njk',
};

const HOMOGLYPHS: [RegExp, string, string][] = [
  [/o/g, '0', 'Letter o replaced with digit 0'],
  [/l/g, '1', 'Letter l replaced with digit 1'],
  [/rn/g, 'm', 'Letters rn merged into m'],
  [/m/g, 'rn', 'Letter m split into rn'],
  [/a/g, 'à', 'Letter a with a lookalike accent'],
  [/e/g, 'é', 'Letter e with a lookalike accent'],
  [/c/g, 'ç', 'Letter c with a lookalike cedilla'],
  [/i/g, 'ı', 'Letter i with a dotless lookalike'],
];

const TLDS = ['com', 'net', 'org', 'io', 'co', 'biz', 'info', 'xyz'];

function buildVariants(host: string): Variant[] {
  const out: Variant[] = [];
  const push = (domain: string, kind: string, why: string) => {
    if (domain !== host && !out.some((v) => v.domain === domain)) out.push({ domain, kind, why });
  };
  const lastDot = host.lastIndexOf('.');
  if (lastDot <= 0) return out;
  const name = host.slice(0, lastDot);
  const tld = host.slice(lastDot + 1);
  // Omission: delete each character of the name
  for (let i = 0; i < name.length; i++) {
    push(
      `${name.slice(0, i)}${name.slice(i + 1)}.${tld}`,
      'Character omission',
      `Missing the character at position ${i + 1} — easy to mistype and hard to notice.`
    );
  }
  // Transposition: swap each adjacent pair
  for (let i = 0; i < name.length - 1; i++) {
    push(
      `${name.slice(0, i)}${name[i + 1]}${name[i]}${name.slice(i + 2)}.${tld}`,
      'Adjacent swap',
      `Two neighbouring characters swapped — a classic typing slip.`
    );
  }
  // Duplication: double each character
  for (let i = 0; i < name.length; i++) {
    push(
      `${name.slice(0, i)}${name[i]}${name[i]}${name.slice(i + 1)}.${tld}`,
      'Character duplication',
      `A character typed twice — common on fast typing.`
    );
  }
  // Keyboard neighbours: replace each char with an adjacent key
  for (let i = 0; i < name.length; i++) {
    const neighbours = KEYBOARD[name[i].toLowerCase()];
    if (!neighbours) continue;
    for (const n of neighbours) {
      push(
        `${name.slice(0, i)}${n}${name.slice(i + 1)}.${tld}`,
        'Keyboard neighbour',
        `Character at position ${i + 1} replaced with nearby key ${n}.`
      );
    }
  }
  // Homoglyph lookalikes
  for (const [re, replacement, why] of HOMOGLYPHS) {
    re.lastIndex = 0;
    if (re.test(name)) push(`${name.replace(re, replacement)}.${tld}`, 'Homoglyph lookalike', why);
  }
  // Hyphen tricks
  push(
    `${name.replace(/-/g, '')}.${tld}`,
    'Hyphen removed',
    'Hyphens are easy to drop when typing a domain from memory.'
  );
  if (!name.includes('-'))
    push(
      `${name.slice(0, Math.max(1, Math.floor(name.length / 2)))}-${name.slice(Math.max(1, Math.floor(name.length / 2)))}.${tld}`,
      'Hyphen inserted',
      'An added hyphen can look legitimate in a printed code label.'
    );
  // TLD swaps
  for (const alt of TLDS) {
    if (alt !== tld)
      push(
        `${name}.${alt}`,
        'TLD swap',
        `Same name with a different ending — the most common impersonation pattern.`
      );
  }
  return out;
}

function inspectInput(host: string): string[] {
  const notes: string[] = [];
  if (/xn--/.test(host))
    notes.push(
      'Contains punycode (xn--) — the displayed name may look like a familiar brand while pointing elsewhere.'
    );
  if (/[0-9]/.test(host) && /[a-z]/.test(host))
    notes.push('Mixes letters and digits — check for 0-for-o or 1-for-l substitutions.');
  if (host.split('.').length > 3)
    notes.push(
      'Many subdomains — the registrable domain is the rightmost part; check it carefully.'
    );
  if (host.startsWith('-') || host.endsWith('-'))
    notes.push('Starts or ends with a hyphen, which is unusual for a real brand domain.');
  return notes;
}

const FAQS = [
  {
    question: 'Does this tool check whether the lookalike domains are registered?',
    answer:
      'No. It generates the typo variants algorithmically and explains each one. It does not query DNS or registration records, so it cannot tell you whether a variant is owned by someone. Treat every variant as a domain that could be registered, and check any that matter through your registrar or a DNS lookup.',
  },
  {
    question: 'Why generate variants instead of checking the domain I typed?',
    answer:
      'Because the threat is not the domain you typed — it is the domains near it. An attacker registers a lookalike of your brand, prints it in a QR code, and relies on scanners not noticing the difference. Listing the neighbours shows you which ones to watch, register defensively, or warn customers about.',
  },
  {
    question: 'Should I register all the typo variants of my brand?',
    answer:
      'Register the closest and most dangerous ones — the TLD swaps, the single-omission variants, and the homoglyphs — and redirect them to your real site. You cannot register every variant, so pair defensive registration with monitoring: watch for new registrations that resemble your brand and act on the ones that get used.',
  },
  {
    question: 'What should I do if I find a lookalike domain impersonating my brand?',
    answer:
      'Document it with dates and screenshots, report it to the registrar and the hosting provider, and file a complaint with the relevant dispute process if it uses your trademark. If it is being used in QR codes or phishing, warn your customers through your normal channels and report the phishing page to the major safe-browsing programmes.',
  },
];

export default function QRTyposquatCheckerPage() {
  const [domain, setDomain] = useState('');
  const [submitted, setSubmitted] = useState('');

  const normalized = useMemo(() => {
    const d = submitted
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .split(':')[0]
      .replace(/^\.+/, '')
      .replace(/\.+$/, '');
    return d;
  }, [submitted]);

  const variants = useMemo(
    () => (normalized.includes('.') ? buildVariants(normalized) : []),
    [normalized]
  );
  const notes = useMemo(() => (normalized ? inspectInput(normalized) : []), [normalized]);

  const check = () => {
    if (!domain.trim()) return;
    setSubmitted(domain);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Typosquat Checker',
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
          { label: 'QR Typosquat Checker', href: '/qr-typosquat-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Eye className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Typosquat Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enter a domain to see the typo variants an attacker could use against it — omissions,
          swaps, duplications, keyboard neighbours, homoglyph lookalikes, and TLD swaps. The
          variants are generated algorithmically in your browser; the tool does not check whether
          any of them are registered.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Check a domain</h2>
            <div className="space-y-1.5">
              <Label htmlFor="typo-domain">Your brand domain</Label>
              <Input
                id="typo-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                inputMode="url"
              />
              <p className="text-[11px] text-muted-foreground">Example: example.com</p>
            </div>
            <Button onClick={check}>Generate lookalike variants</Button>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Honest limits: these variants are possibilities, not findings. This tool does not
                look up DNS or registration records, so it cannot say whether a variant is owned,
                live, or malicious. Check any variant that matters through your registrar or a DNS
                lookup before acting.
              </span>
            </div>
            {submitted && !normalized.includes('.') && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Enter a domain with a TLD, for example example.com.
              </p>
            )}
          </Card>
          {notes.length > 0 && (
            <Card className="p-6 space-y-2">
              <h2 className="text-lg font-bold">Notes on the domain you entered</h2>
              {notes.map((n, i) => (
                <p key={i} className="text-xs flex gap-2 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{n}</span>
                </p>
              ))}
            </Card>
          )}
        </div>
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">
              {variants.length > 0
                ? `${variants.length} lookalike variants of ${normalized}`
                : 'Variants'}
            </h2>
            {variants.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Enter a domain and generate variants to see the list here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Variant</th>
                      <th className="py-2 pr-3 font-semibold">Type</th>
                      <th className="py-2 font-semibold">Why it is risky</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => (
                      <tr key={v.domain} className="border-t border-border/50 align-top">
                        <td className="py-2 pr-3 font-mono break-all">{v.domain}</td>
                        <td className="py-2 pr-3 whitespace-nowrap">{v.kind}</td>
                        <td className="py-2">{v.why}</td>
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
          How typosquatting works, and why QR codes make it worse
        </h2>
        <p className="text-base leading-relaxed">
          Typosquatting is impersonation by near-miss. An attacker registers a domain that differs
          from a real brand by one character — a missing letter, a swapped pair, a zero where an o
          should be, a different ending — and then uses it in places where the difference is hard to
          spot. In a browser address bar, a careful reader might catch it. In a QR code, there is no
          address bar to read: the code is opaque, the destination is hidden, and the scanner shows
          the URL only after the decision to scan has already been made. That is why lookalike
          domains are a QR problem first and a typing problem second.
        </p>
        <p className="text-base leading-relaxed">
          The variant families each exploit a different human weakness. Omissions and duplications
          exploit fast typing and careless proofreading: a missing letter in a long domain is easy
          to miss in a hurry. Adjacent swaps exploit the way fingers stumble on a keyboard.
          Keyboard-neighbour substitutions exploit the same stumble one key over. Homoglyphs exploit
          vision itself — rn rendered as m, a dotless i, an accented letter that looks identical at
          small sizes — and they defeat even careful readers. TLD swaps exploit assumption: the
          reader sees the familiar name, stops reading, and never notices that the ending changed
          from .com to .co or .xyz.
        </p>
        <p className="text-base leading-relaxed">
          Defence starts with seeing the neighbours. Generating the variant list for your own brand
          shows you which lookalikes are closest and therefore most dangerous. The TLD swaps and
          single-omission variants deserve defensive registration — buy them and point them at your
          real site, so an attacker cannot. You cannot register every variant, and trying is a
          losing game against an endless list, so pair registration with monitoring: watch for new
          registrations resembling your brand, and act fast on the ones that actually get used in
          codes, messages, or ads.
        </p>
        <p className="text-base leading-relaxed">
          For the person scanning, the defence is reading the host from the right. The registrable
          domain is the rightmost part; everything left of it is a subdomain the owner controls. A
          host such as yourbank.com.attacker.com is attacker.com, no matter how reassuring the
          left-hand side looks. Check the scheme, look for punycode, and be suspicious of any link
          that arrives unexpectedly and demands credentials or payment. If a code promises your
          bank, your inbox, or your payment provider, type the address yourself or use a bookmark
          instead of trusting the code.
        </p>
        <p className="text-base leading-relaxed">
          If you find a lookalike impersonating your brand, document it — dates, screenshots, where
          the code appeared — and report it to the registrar and the hosting provider. Warn your
          customers through channels they already trust, and report phishing pages to the major
          safe-browsing programmes. Speed matters: a lookalike domain is cheap, and every day it
          stays up is a day of scanners who trusted a pattern they could not read.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Typosquatting
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
