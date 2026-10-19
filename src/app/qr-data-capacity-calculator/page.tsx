'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Database } from 'lucide-react';
import QRCodeLib from 'qrcode';

export default function QRDataCapacityCalculatorPage() {
  const [payload, setPayload] = useState('https://example.com/summer-menu');
  const [ec, setEc] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [versionFound, setVersionFound] = useState<number | null>(null);
  const [error, setError] = useState('');
  const checkCapacity = () => {
    try {
      let found: number | null = null;
      for (let v = 1; v <= 40; v++) {
        try {
          const qr = QRCodeLib.create(payload, { errorCorrectionLevel: ec, version: v });
          const size = (qr as unknown as { modules: { size: number } }).modules?.size ?? 0;
          if (size > 0) {
            found = v;
            break;
          }
        } catch {
          continue;
        }
      }
      setVersionFound(found);
      setError(
        found
          ? ''
          : 'Payload exceeds the maximum capacity of a version-40 code at this error-correction level.'
      );
    } catch {
      setError('Capacity check is unavailable in this browser build.');
      setVersionFound(null);
    }
  };
  const byteCaps: Array<[number, number, number, number, number]> = [
    [1, 17, 14, 11, 7],
    [2, 32, 26, 20, 14],
    [3, 53, 44, 35, 24],
    [4, 78, 64, 50, 34],
    [5, 106, 86, 68, 44],
    [10, 271, 213, 151, 119],
    [40, 2953, 2331, 1663, 1273],
  ];

  const faqs = [
    {
      question: 'What is a QR code version?',
      answer:
        'The version, 1 to 40, sets the grid size: version 1 is 21 × 21 modules and version 40 is 177 × 177. Higher versions hold more data but have smaller modules at the same print size, so they are harder to scan.',
    },
    {
      question: 'Which error-correction level should I use?',
      answer:
        'Level M (about 15% recovery) is the default for clean print. Use Q or H (about 25% or 30%) when the code carries a logo, may be scuffed, or is printed outdoors or on textured surfaces. Higher levels reduce capacity.',
    },
    {
      question: 'Why does my long URL make such a dense QR code?',
      answer:
        'Longer payloads need higher versions with more, smaller modules. Shortening the URL — for example with a short redirect you control — drops the version and makes every module larger and easier to scan.',
    },
    {
      question: 'What happens if my payload is too large for version 40?',
      answer:
        'A single QR code cannot hold it. Either shorten the payload, move the content to a web page and encode its short link, or split the content across multiple codes.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Data Capacity Calculator',
    applicationCategory: 'DesignApplication',
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
          { label: 'QR Data Capacity Calculator', href: '/qr-data-capacity-calculator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>Encoding Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Data Capacity Calculator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a payload and see the smallest QR version that fits it at each error-correction
          level, plus reference capacities so you can judge how close to the limit you are.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Your payload</h2>
            <div className="space-y-2">
              <Label htmlFor="payload">Text or URL to encode</Label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {payload.length} characters (byte-mode length; multi-byte characters may consume
                more capacity).
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Error-correction level
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setEc(l)}
                    className={`p-3 text-center rounded-xl border text-xs ${ec === l ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    Level {l}
                    <span className="block text-[10px] text-muted-foreground">
                      {l === 'L'
                        ? '≈7% recovery'
                        : l === 'M'
                          ? '≈15% recovery'
                          : l === 'Q'
                            ? '≈25% recovery'
                            : '≈30% recovery'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={checkCapacity} className="w-full sm:w-auto">
              Find minimum version
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-3">Reference: maximum byte-mode characters</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-2">Version</th>
                    <th className="text-right py-2 px-2">L</th>
                    <th className="text-right py-2 px-2">M</th>
                    <th className="text-right py-2 px-2">Q</th>
                    <th className="text-right py-2 px-2">H</th>
                  </tr>
                </thead>
                <tbody>
                  {byteCaps.map(([v, l, m, q, h]) => (
                    <tr key={v} className="border-b border-border/50">
                      <td className="py-1.5 pr-2 font-semibold">V{v}</td>
                      <td className="text-right py-1.5 px-2">{l.toLocaleString()}</td>
                      <td className="text-right py-1.5 px-2">{m.toLocaleString()}</td>
                      <td className="text-right py-1.5 px-2">{q.toLocaleString()}</td>
                      <td className="text-right py-1.5 px-2">{h.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Byte-mode maxima per the QR specification. Numeric and alphanumeric payloads pack more
              efficiently, so a short numeric string may fit a smaller version than this table
              suggests.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            {versionFound ? (
              <>
                <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <div className="text-xs text-muted-foreground">Minimum version at level {ec}</div>
                  <div className="text-4xl font-extrabold text-primary">V{versionFound}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {21 + 4 * (versionFound - 1)} × {21 + 4 * (versionFound - 1)} modules
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Higher versions mean smaller modules at the same print size, so a payload near the
                  top of a version band deserves a larger print size or a shorter payload.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter a payload and press “Find minimum version”. The tool tries versions 1–40 using
                the same encoder that generates QR codes on this site.
              </p>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How Much Data Fits in a QR Code?</h2>
        <p className="text-base leading-relaxed">
          Every QR code has a version, numbered 1 to 40, that sets how many modules it contains.
          Version 1 is a 21 × 21 grid; version 40 is a 177 × 177 grid. More modules mean more data,
          but also smaller modules at any given print size, which is why a code stuffed with data
          becomes harder to scan. The error-correction level works in the opposite direction: higher
          correction reserves more of the code for redundancy, so less room remains for your
          payload. Capacity is therefore a three-way trade-off between how much you encode, how much
          damage you want to survive, and how large you are willing to print.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          What the four error-correction levels buy you
        </h3>
        <p className="text-base leading-relaxed">
          Level L recovers about 7% of damaged codewords, M about 15%, Q about 25%, and H about 30%.
          Those percentages describe the share of the code that can be lost or obscured and still
          decode. Level M is the default for ordinary printed codes. Level H is the right choice
          when the code carries a logo, sits somewhere it may be scuffed, or will be printed on a
          textured surface. The price of H is capacity: a version-1 code holds 17 byte-mode
          characters at L but only 7 at H. At version 40 the same trade-off runs from 2,953
          characters at L down to 1,273 at H. If your payload only just fits at H, consider
          shortening it rather than accepting a denser code.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Why shorter payloads scan better</h3>
        <p className="text-base leading-relaxed">
          A short URL produces a low-version code with large, forgiving modules. A long URL with
          tracking parameters, or a full contact record, pushes the version up and shrinks every
          module. That is why the single most effective optimisation for scannability is shortening
          the payload: use a short redirect you control instead of a long destination URL, strip
          unnecessary tracking parameters, and keep vCards to the fields people actually need. The
          redirect has a second benefit — the destination can change without reprinting the code.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Practical rules</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Keep marketing codes at version 10 or below when you can; above that, increase the print
            size.
          </li>
          <li>
            Use level M for clean indoor print, level Q or H for logos, outdoor use, or rough
            surfaces.
          </li>
          <li>
            Count multi-byte characters carefully: emoji and some non-Latin scripts consume several
            bytes each.
          </li>
          <li>
            If the payload exceeds version 40, split the content across codes or link to a page
            instead of encoding everything.
          </li>
          <li>
            Always test-scan the real payload at the real print size — capacity fitting is
            necessary, not sufficient.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          Capacity tells you what is possible. Print size, contrast, and testing decide what
          actually works.
        </p>
      </article>
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
    </div>
  );
}
