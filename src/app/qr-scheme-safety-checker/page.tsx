'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

type Classification = { scheme: string; risk: string; riskClass: string; explanation: string };

function classify(input: string): Classification {
  const trimmed = input.trim();
  const m = trimmed.match(/^([a-z][a-z0-9+.-]*):/i);
  if (!m) {
    return {
      scheme: '(none — plain text)',
      risk: 'Low',
      riskClass: 'text-emerald-600',
      explanation:
        'No scheme prefix: most scanners treat this as plain text and will not act on it automatically.',
    };
  }
  const scheme = m[1].toLowerCase();
  switch (scheme) {
    case 'https':
      return {
        scheme,
        risk: 'Low',
        riskClass: 'text-emerald-600',
        explanation:
          'Encrypted web link. The destination can still be malicious, so the domain matters — but the scheme itself is the safe standard for QR destinations.',
      };
    case 'http':
      return {
        scheme,
        risk: 'Medium',
        riskClass: 'text-amber-600',
        explanation:
          'Unencrypted web link. Traffic can be observed or altered in transit. Prefer https: for anything the scanner will interact with.',
      };
    case 'mailto':
      return {
        scheme,
        risk: 'Low',
        riskClass: 'text-emerald-600',
        explanation:
          'Opens a mail compose window. Nothing is sent without the scanner reviewing and pressing send.',
      };
    case 'tel':
      return {
        scheme,
        risk: 'Low',
        riskClass: 'text-emerald-600',
        explanation:
          'Opens the dialler with the number filled in. The call is not placed until the scanner confirms it.',
      };
    case 'sms':
    case 'smsto':
      return {
        scheme,
        risk: 'Low',
        riskClass: 'text-emerald-600',
        explanation:
          'Opens a message compose window with the number (and body) filled in. Nothing is sent until the scanner confirms it.',
      };
    case 'geo':
      return {
        scheme,
        risk: 'Low',
        riskClass: 'text-emerald-600',
        explanation:
          'Opens a map at the coordinates. No data is sent by scanning; the scanner chooses whether to navigate.',
      };
    case 'wifi':
      return {
        scheme,
        risk: 'Medium',
        riskClass: 'text-amber-600',
        explanation:
          'Offers to join a Wi-Fi network. The network name and password are embedded in the code in plain text — anyone who scans it can read them, and joining an unknown network exposes the device.',
      };
    case 'vcard':
    case 'mecard':
      return {
        scheme,
        risk: 'Low',
        riskClass: 'text-emerald-600',
        explanation:
          'Contact data. The scanner reviews it before saving, and nothing is shared back to the code creator.',
      };
    case 'bitcoin':
      return {
        scheme,
        risk: 'Medium',
        riskClass: 'text-amber-600',
        explanation:
          'Opens a wallet payment to the embedded address. Crypto payments are irreversible, so the address must be verified independently.',
      };
    case 'javascript':
    case 'vbscript':
    case 'data':
      return {
        scheme,
        risk: 'Dangerous',
        riskClass: 'text-red-600',
        explanation:
          'Can execute code or smuggle content if a scanner mishandles it. Never print this scheme in a QR code; most scanners block it.',
      };
    case 'file':
      return {
        scheme,
        risk: 'Dangerous',
        riskClass: 'text-red-600',
        explanation:
          'Points at a local file on the scanning device. It has no legitimate use in a printed QR code and can expose local paths.',
      };
    case 'intent':
      return {
        scheme,
        risk: 'Dangerous',
        riskClass: 'text-red-600',
        explanation:
          'Can launch Android app components with embedded extras. It has been abused to trigger privileged actions; never print it in a QR code.',
      };
    default:
      return {
        scheme,
        risk: 'Unknown — treat with caution',
        riskClass: 'text-amber-600',
        explanation: `Scheme "${scheme}" is not one this checker recognises. An unknown scheme may open an unexpected app; verify what it does before printing it.`,
      };
  }
}

export default function QRSchemeSafetyCheckerPage() {
  const [input, setInput] = useState('https://example.com/menu');

  const result = useMemo(() => classify(input), [input]);

  const faqs = [
    {
      question: 'Does a "Low" risk scheme mean the destination is safe?',
      answer:
        'No. The scheme says what kind of action scanning triggers; it says nothing about the destination. An https: link to a phishing site is still a phishing site. Check the domain and the content separately.',
    },
    {
      question: 'Why is WIFI: rated medium?',
      answer:
        'Joining a network is a trust decision: the device may then send traffic through that network. The password is also embedded in the code in plain text, so anyone who scans it learns the password. WIFI: codes are fine for your own guest network, not for networks you do not control.',
    },
    {
      question: 'Why are javascript: and data: dangerous?',
      answer:
        'They do not point at a resource — they carry code or content that a mishandling scanner may execute or render. They have no legitimate use in a printed QR code, and most scanners refuse them.',
    },
    {
      question: 'What scheme should a QR code use?',
      answer:
        'https: for anything on the web, and the standard schemes (mailto:, tel:, geo:, WIFI:) for their specific jobs. If a destination needs an unusual scheme, that is a reason to reconsider the destination.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Scheme Safety Checker',
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
          { label: 'QR Scheme Safety Checker', href: '/qr-scheme-safety-checker' },
        ]}
      />

      <AdSlot id="qr-scheme-safety-checker-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Scheme Safety Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a QR destination and see its URL scheme classified — https, http, javascript:,
          data:, intent:, WIFI:, and more — with a risk verdict and what scanning it actually does.
          The classification recomputes on every edit, entirely in your browser.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Paste the destination</h2>
            <div className="space-y-2">
              <Label htmlFor="dest">QR destination (payload)</Label>
              <Input
                id="dest"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The scheme is the part before the first colon (e.g. https in https://…). The checker
              classifies that scheme against a fixed table — it does not fetch the destination.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Scheme</div>
              <div className="text-3xl font-extrabold text-primary font-mono">{result.scheme}</div>
              <div className={`text-lg font-semibold ${result.riskClass}`}>{result.risk}</div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-scheme-safety-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Scheme Decides What Scanning Does
        </h2>
        <p className="text-base leading-relaxed">
          A QR code is not just a link — it is an instruction. The scheme tells the phone which app
          to open and what action to take: browse, dial, mail, join a network, or worse. Two
          payloads that look alike can do very different things, and the scheme is the part that
          decides. Checking it before printing is a one-second habit that catches the most dangerous
          class of QR mistakes.
        </p>

        <AdSlot id="qr-scheme-safety-checker-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          A safe scheme is not a safe destination
        </h3>
        <p className="text-base leading-relaxed">
          Scheme checking is one layer. A safe scheme pointing at a phishing page is still phishing.
          Always verify the domain and the page content as well — especially for codes you did not
          create yourself.
        </p>
      </article>

      <AdSlot id="qr-scheme-safety-checker-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-scheme-safety-checker-bottom" format="horizontal-banner" />

    </div>
  );
}
