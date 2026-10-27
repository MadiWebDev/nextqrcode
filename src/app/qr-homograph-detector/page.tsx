'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScanEye } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

// Confusable characters mapped to the ASCII letter they visually resemble.
// Cyrillic, Greek, and other scripts that contain lookalikes of Latin letters.
const CONFUSABLES: Record<string, string> = {
  а: 'a',
  е: 'e',
  о: 'o',
  р: 'p',
  с: 'c',
  х: 'x',
  у: 'y',
  ј: 'j',
  ѕ: 's',
  і: 'i',
  ї: 'i',
  һ: 'h',
  ԁ: 'd',
  ԛ: 'q',
  ԝ: 'w',
  ᴍ: 'm',
  Α: 'A',
  Β: 'B',
  Ε: 'E',
  Η: 'H',
  Ι: 'I',
  Κ: 'K',
  Μ: 'M',
  Ν: 'N',
  Ο: 'O',
  Ρ: 'P',
  Τ: 'T',
  Χ: 'X',
  Ζ: 'Z',
  α: 'a',
  ο: 'o',
  ε: 'e',
  ι: 'i',
  κ: 'k',
  ν: 'v',
  ρ: 'p',
  τ: 't',
  χ: 'x',
  υ: 'u',
  ᴏ: 'o',
  ｂ: 'b',
  '０': '0',
  '１': '1',
  ｌ: 'l',
  Ｉ: 'I',
  '｜': 'l',
  ǀ: 'l',
  ɡ: 'g',
  ı: 'i',
  ſ: 's',
  K: 'K',
  Å: 'A',
  ꓒ: 'D',
  ꓭ: 'L',
  ꓽ: 'S',
};

function scriptOf(ch: string): string {
  const code = ch.codePointAt(0) ?? 0;
  if (code < 128) return 'ascii';
  if (code >= 0x0400 && code <= 0x04ff) return 'cyrillic';
  if (code >= 0x0370 && code <= 0x03ff) return 'greek';
  if (code >= 0xff00 && code <= 0xffef) return 'fullwidth';
  if (code >= 0x0100 && code <= 0x024f) return 'latin-extended';
  return 'other';
}

export default function QRHomographDetectorPage() {
  const [domain, setDomain] = useState('paypa1.com');

  const result = useMemo(() => {
    const input = domain.trim();
    const chars = Array.from(input);
    const flags = chars
      .map((ch, i) => ({ ch, i, lookalike: CONFUSABLES[ch], script: scriptOf(ch) }))
      .filter((f) => f.lookalike !== undefined);
    const skeleton = chars.map((ch) => CONFUSABLES[ch] ?? ch).join('');
    const scripts = new Set(chars.map((ch) => scriptOf(ch)));
    const mixedScript = scripts.size > 1;
    const nonAscii = chars.some((ch) => (ch.codePointAt(0) ?? 0) >= 128);
    const verdict =
      flags.length > 0
        ? 'Homograph risk — confusable characters found'
        : mixedScript && nonAscii
          ? 'Mixed scripts — review carefully'
          : 'No confusable characters found';
    return { flags, skeleton, mixedScript, nonAscii, verdict, input };
  }, [domain]);

  const faqs = [
    {
      question: 'What is a homograph attack?',
      answer:
        'An attacker registers a domain that looks identical to a trusted one by swapping in characters from another alphabet — for example a Cyrillic "а" in place of a Latin "a". The two domains look the same but go to different places. This tool flags those swaps.',
    },
    {
      question: 'What is the "ASCII skeleton"?',
      answer:
        'The domain with every known confusable character replaced by the ASCII letter it resembles. If the skeleton differs from what you typed, the typed domain contains lookalikes. Comparing the skeleton to the brand name you expected is the quickest check.',
    },
    {
      question: 'Does a clean result mean the domain is safe?',
      answer:
        'No. This tool checks only for Unicode confusables in the text you enter. A domain can be clean here and still be a typo-squat, a lookalike brand name, or a malicious site. Treat a clean result as one check passed, not a safety verdict.',
    },
    {
      question: 'Why flag mixed scripts at all?',
      answer:
        'Legitimate domains occasionally mix scripts, but a domain that mixes Latin with Cyrillic or Greek in a single label is unusual and is exactly the shape homograph attacks take. Mixed script alone is a warning, not proof of malice.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Homograph Detector',
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
          { label: 'QR Homograph Detector', href: '/qr-homograph-detector' },
        ]}
      />

      <AdSlot id="qr-homograph-detector-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ScanEye className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Homograph Detector
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Check a domain for Unicode confusable characters — letters from other alphabets that look
          identical to Latin letters. Each flagged character is shown with its position and the
          ASCII letter it imitates. Everything runs in your browser; nothing is sent anywhere.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter the domain</h2>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain to check (no https:// needed)</Label>
              <Input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Method: every character is compared against a table of known confusable characters
              (Cyrillic, Greek, fullwidth, and other lookalikes) mapped to the ASCII letter they
              resemble. The skeleton is the domain with each confusable replaced by its ASCII
              lookalike.
            </p>
            {result.flags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Confusable characters found</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="py-1 pr-3">Position</th>
                        <th className="py-1 pr-3">Character</th>
                        <th className="py-1 pr-3">Code point</th>
                        <th className="py-1 pr-3">Script</th>
                        <th className="py-1">Looks like</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.flags.map((f, i) => (
                        <tr key={i} className="border-t border-border/50">
                          <td className="py-1.5 pr-3 font-mono">{f.i + 1}</td>
                          <td className="py-1.5 pr-3 font-mono text-base">{f.ch}</td>
                          <td className="py-1.5 pr-3 font-mono">
                            U+
                            {(f.ch.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')}
                          </td>
                          <td className="py-1.5 pr-3">{f.script}</td>
                          <td className="py-1.5 font-mono">{f.lookalike}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            <div
              className={`text-center rounded-xl border p-4 ${result.flags.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}
            >
              <div className="text-xs text-muted-foreground">Verdict</div>
              <div
                className={`text-xl font-extrabold ${result.flags.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}
              >
                {result.verdict}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Confusables found</span>
                <span className="font-semibold">{result.flags.length}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Mixed scripts</span>
                <span className="font-semibold">{result.mixedScript ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">ASCII skeleton</span>
                <span className="font-semibold font-mono break-all text-right">
                  {result.skeleton || '—'}
                </span>
              </div>
            </div>
            {result.flags.length > 0 && (
              <p className="text-sm text-muted-foreground leading-relaxed" role="alert">
                This domain visually impersonates{' '}
                <span className="font-mono font-semibold">{result.skeleton}</span>. Do not trust it,
                and do not print a QR code pointing at it.
              </p>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="qr-homograph-detector-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Domain That Is Not What It Looks Like
        </h2>
        <p className="text-base leading-relaxed">
          Homograph attacks work because people read shapes, not code points. A Cyrillic
          &ldquo;а&rdquo; and a Latin &ldquo;a&rdquo; are indistinguishable on screen, but to a
          computer they are different characters leading to different domains. On a printed QR code
          the danger is worse: the scanner never sees the domain at all until the code is already
          scanned, so a lookalike destination hides in plain sight.
        </p>

        <AdSlot id="qr-homograph-detector-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">How to check a destination</h3>
        <p className="text-base leading-relaxed">
          Paste the domain here, compare the ASCII skeleton with the brand you expect, and treat any
          confusable as a hard stop. For domains you own, register the lookalike variants
          defensively or monitor them — attackers only need one victim to click.
        </p>
      </article>

      <AdSlot id="qr-homograph-detector-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-homograph-detector-bottom" format="horizontal-banner" />

    </div>
  );
}
