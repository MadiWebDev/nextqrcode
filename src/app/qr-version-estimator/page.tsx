'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Grid3x3 } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

// Maximum payload length (characters) in BYTE mode per version (1–40), per error-correction level.
// Source: QR code capacity tables (Thonky / ISO 18004). Byte-mode capacity is used for every
// payload here, so numeric/alphanumeric payloads get a conservative (safe) estimate.
const BYTE_CAPACITY: Record<string, number[]> = {
  L: [
    17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858,
    929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431,
    2563, 2699, 2809, 2953,
  ],
  M: [
    14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666,
    711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722, 1809, 1911, 1989,
    2113, 2239, 2369,
  ],
  Q: [
    11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442, 482,
    528, 572, 622, 676, 750, 813, 871, 911, 985, 1063, 1115, 1175, 1241, 1326, 1407, 1492, 1576,
    1661, 1762, 1866,
  ],
  H: [
    7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382, 403,
    439, 461, 511, 535, 593, 625, 658, 698, 742, 788, 842, 898, 958, 983, 1051, 1093, 1139, 1219,
    1273,
  ],
};

function detectMode(payload: string): string {
  if (payload.length === 0) return 'Empty';
  if (/^[0-9]+$/.test(payload)) return 'Numeric';
  if (/^[0-9A-Z $%*+\-./:]+$/.test(payload)) return 'Alphanumeric';
  return 'Byte';
}

export default function QRVersionEstimatorPage() {
  const [payload, setPayload] = useState('https://example.com/menu');
  const [ec, setEc] = useState('M');

  const result = useMemo(() => {
    // Length in bytes (UTF-8) is the honest measure for byte-mode capacity.
    const bytes = new TextEncoder().encode(payload).length;
    const capacities = BYTE_CAPACITY[ec];
    const versionIndex = capacities.findIndex((cap) => bytes <= cap);
    const version = versionIndex === -1 ? null : versionIndex + 1;
    const capacity = version === null ? capacities[39] : capacities[version - 1];
    return {
      bytes,
      chars: payload.length,
      mode: detectMode(payload),
      version,
      modules: version === null ? null : 17 + 4 * version,
      capacity,
      usedPct: capacity > 0 ? (bytes / capacity) * 100 : 0,
    };
  }, [payload, ec]);

  const faqs = [
    {
      question: 'What is a QR version?',
      answer:
        'The version is the size class of the code: version 1 is a 21×21 module grid, and each version adds 4 modules per side, up to version 40 at 177×177. A longer payload or a higher error-correction level needs a higher version.',
    },
    {
      question: 'Why is this estimate conservative for numbers and letters?',
      answer:
        'The capacity table used here is byte mode, which stores every character as 8 bits. Numeric and alphanumeric modes pack characters more tightly, so a numeric-only or alphanumeric-only payload may fit a slightly lower version in practice. The byte-mode answer is always safe.',
    },
    {
      question: 'Which error-correction level should I pick?',
      answer:
        'M is the usual default: it recovers about 15% damage. Use H (about 30%) for codes that will be handled, scratched, or printed small, and L (about 7%) only for clean, controlled environments where you need maximum capacity.',
    },
    {
      question: 'What if my payload does not fit even version 40?',
      answer:
        'Shorten the payload — use a short URL instead of a long one, or move the content behind a link. A code above version 10 is already dense; at version 40 it is extremely hard to print and scan reliably.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Version Estimator',
    applicationCategory: 'DeveloperApplication',
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
          { label: 'QR Version Estimator', href: '/qr-version-estimator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Grid3x3 className="w-3.5 h-3.5" />
          <span>Developer Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Version Estimator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enter a payload and an error-correction level to find the smallest QR version that holds
          it, the module count, and how full that version is. Capacity is looked up in the standard
          byte-mode capacity table.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Enter the payload</h2>
            <div className="space-y-2">
              <Label htmlFor="payload">Payload (exactly what the code will contain)</Label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec">Error-correction level</Label>
              <select
                id="ec"
                value={ec}
                onChange={(e) => setEc(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="L">L — recovers ~7% damage, most capacity</option>
                <option value="M">M — recovers ~15% damage</option>
                <option value="Q">Q — recovers ~25% damage</option>
                <option value="H">H — recovers ~30% damage, least capacity</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Method: payload length is measured in UTF-8 bytes and matched against the standard
              byte-mode capacity table for the chosen error-correction level; the smallest version
              whose capacity covers the payload wins. Module count = 17 + 4 × version.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Minimum version (EC level {ec})</div>
              <div className="text-4xl font-extrabold text-primary">
                {result.version === null ? 'Does not fit' : `Version ${result.version}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {result.modules === null
                  ? 'Exceeds version 40 capacity'
                  : `${result.modules} × ${result.modules} modules`}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Payload length</span>
                <span className="font-semibold">
                  {result.bytes} bytes ({result.chars} characters)
                </span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Detected mode</span>
                <span className="font-semibold">{result.mode}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">Capacity of this version</span>
                <span className="font-semibold">{result.capacity} bytes</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Capacity used</span>
                <span className="font-semibold">{result.usedPct.toFixed(1)}%</span>
              </div>
            </div>
            {result.version !== null && result.version >= 11 && (
              <p className="text-sm text-amber-600 dark:text-amber-400" role="alert">
                Version {result.version} is dense. Print it large, keep contrast high, and test-scan
                a proof — or shorten the payload.
              </p>
            )}
            {result.version === null && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                This payload exceeds version 40 capacity at EC level {ec}. Shorten it or lower the
                error-correction level.
              </p>
            )}
          </Card>
        </div>
      </div>
      <AdSlot id="qr-version-estimator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why Version Matters Before You Design
        </h2>
        <p className="text-base leading-relaxed">
          The version decides how dense the code is: the same physical size holds more modules as
          the version rises, so each module shrinks and the code gets harder to print and scan. A
          payload that fits version 3 is a forgiving code; the same payload at version 15 needs
          careful printing. Checking the version early tells you whether a short link, a lower
          error-correction level, or a larger print size is the right move.
        </p>
        <AdSlot id="qr-version-estimator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">Short payloads scan better</h3>
        <p className="text-base leading-relaxed">
          Shortening a URL — removing tracking parameters you do not need, or pointing at a short
          redirect — often drops the version by several steps. That is the cheapest readability
          improvement available.
        </p>
      </article>
      <AdSlot id="qr-version-estimator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="qr-version-estimator-bottom" format="horizontal-banner" />
    </div>
  );
}
