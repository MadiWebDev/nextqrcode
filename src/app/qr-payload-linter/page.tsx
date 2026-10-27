'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileCheck2 } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

type Finding = { severity: 'error' | 'warning' | 'info'; text: string };

function lintPayload(payload: string): { findings: Finding[]; scheme: string } {
  const findings: Finding[] = [];
  const lines = payload.split(/\r?\n/);
  if (payload.length === 0) {
    return { findings: [{ severity: 'error', text: 'Payload is empty.' }], scheme: '—' };
  }
  if (payload.length > 2953)
    findings.push({
      severity: 'error',
      text: `Payload is ${payload.length} characters — longer than the version 40 byte-mode maximum (2953). It will not fit in a QR code.`,
    });
  if (payload !== payload.trim())
    findings.push({
      severity: 'warning',
      text: 'Payload has leading or trailing whitespace, which scanners may include in the destination.',
    });
  if (/[^\x00-\x7F]/.test(payload))
    findings.push({
      severity: 'info',
      text: 'Payload contains non-ASCII characters. It will be encoded in byte mode, which reduces capacity.',
    });
  if (lines.some((l) => l !== l.trim()))
    findings.push({
      severity: 'warning',
      text: 'At least one line has leading or trailing whitespace.',
    });

  const first = lines[0].trim();
  let scheme = 'Plain text / unknown';
  if (/^https?:\/\//i.test(first)) {
    scheme = 'URL';
    try {
      const u = new URL(first);
      if (u.protocol === 'http:')
        findings.push({
          severity: 'warning',
          text: 'URL uses http:, not https:. Scanners and browsers may warn about it.',
        });
      if (u.username || u.password)
        findings.push({
          severity: 'error',
          text: 'URL contains embedded credentials (user:password@). Remove them — they leak in plain text.',
        });
    } catch {
      findings.push({
        severity: 'error',
        text: 'URL could not be parsed. Check for spaces or illegal characters.',
      });
    }
  } else if (/^mailto:/i.test(first)) {
    scheme = 'mailto:';
    const addr = first.slice(7).split('?')[0];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr))
      findings.push({
        severity: 'error',
        text: `mailto: address "${addr}" is not a valid email address.`,
      });
  } else if (/^tel:/i.test(first)) {
    scheme = 'tel:';
    const num = first.slice(4).split('?')[0];
    if (!/^\+?[0-9\s\-().]+$/.test(num) || num.replace(/\D/g, '').length < 7)
      findings.push({
        severity: 'error',
        text: `tel: number "${num}" looks invalid. Use digits with an optional leading +.`,
      });
  } else if (/^sms:/i.test(first)) {
    scheme = 'sms:';
    const num = first.slice(4).split('?')[0];
    if (!/^\+?[0-9\s\-().]+$/.test(num))
      findings.push({ severity: 'error', text: 'sms: number looks invalid.' });
  } else if (/^geo:/i.test(first)) {
    scheme = 'geo:';
    const m = first.slice(4).match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (!m) {
      findings.push({
        severity: 'error',
        text: 'geo: URI must start with latitude,longitude (e.g. geo:37.7749,-122.4194).',
      });
    } else {
      const lat = Number(m[1]);
      const lng = Number(m[2]);
      if (lat < -90 || lat > 90)
        findings.push({ severity: 'error', text: `Latitude ${lat} is out of range (−90 to 90).` });
      if (lng < -180 || lng > 180)
        findings.push({
          severity: 'error',
          text: `Longitude ${lng} is out of range (−180 to 180).`,
        });
    }
  } else if (/^WIFI:/i.test(first)) {
    scheme = 'WIFI:';
    const body = first.slice(5);
    if (!/S:[^;]+;/.test(body))
      findings.push({
        severity: 'error',
        text: 'WIFI: payload is missing the S: (network name) field.',
      });
    if (!/T:(WPA|WEP|nopass);/i.test(body))
      findings.push({
        severity: 'warning',
        text: 'WIFI: payload has no recognised T: (security type) field. Use T:WPA;, T:WEP;, or T:nopass;.',
      });
    if (/T:nopass/i.test(body) && /P:[^;]+;/.test(body))
      findings.push({
        severity: 'warning',
        text: 'WIFI: payload has both T:nopass and a P: password — the password is pointless on an open network.',
      });
    if (!body.endsWith(';;'))
      findings.push({
        severity: 'warning',
        text: 'WIFI: payload should end with ;; to terminate the last field.',
      });
  } else if (/^BEGIN:VCARD/i.test(first)) {
    scheme = 'vCard';
    const body = lines.map((l) => l.trim()).join('\n');
    if (!/^FN:.+/m.test(body))
      findings.push({
        severity: 'error',
        text: 'vCard is missing the FN: (formatted name) field.',
      });
    if (!/END:VCARD/i.test(body))
      findings.push({ severity: 'error', text: 'vCard is missing END:VCARD.' });
    if (!/VERSION:/i.test(body))
      findings.push({
        severity: 'warning',
        text: 'vCard has no VERSION: field. VERSION:3.0 is the safest choice.',
      });
  } else if (/^BEGIN:VEVENT/i.test(first)) {
    scheme = 'VEVENT';
    const body = lines.map((l) => l.trim()).join('\n');
    if (!/DTSTART:/i.test(body))
      findings.push({ severity: 'error', text: 'VEVENT is missing DTSTART:.' });
    if (!/SUMMARY:/i.test(body))
      findings.push({ severity: 'warning', text: 'VEVENT has no SUMMARY: (event title).' });
    if (!/END:VEVENT/i.test(body))
      findings.push({ severity: 'error', text: 'VEVENT is missing END:VEVENT.' });
  } else if (/^(javascript|data|vbscript|file|intent):/i.test(first)) {
    scheme = first.split(':')[0].toLowerCase() + ':';
    findings.push({
      severity: 'error',
      text: `Scheme "${scheme}" is dangerous in a QR code. Many scanners block it, and it can execute code or expose local files.`,
    });
  } else if (/^[a-z][a-z0-9+.-]*:/i.test(first)) {
    scheme = first.split(':')[0].toLowerCase() + ':';
    findings.push({
      severity: 'info',
      text: `Scheme "${scheme}" is not one of the formats this linter validates in detail. Check it against its specification.`,
    });
  } else {
    findings.push({
      severity: 'info',
      text: 'No recognised scheme prefix. The payload will be treated as plain text by most scanners.',
    });
  }
  if (findings.length === 0)
    findings.push({ severity: 'info', text: 'No problems found for the checks this linter runs.' });
  return { findings, scheme };
}

export default function QRPayloadLinterPage() {
  const [payload, setPayload] = useState('WIFI:T:WPA;S:CoffeeShop;P:secret123;;');

  const result = useMemo(() => lintPayload(payload), [payload]);
  const errors = result.findings.filter((f) => f.severity === 'error').length;
  const warnings = result.findings.filter((f) => f.severity === 'warning').length;

  const faqs = [
    {
      question: 'What does the linter check?',
      answer:
        'Syntax for common QR payload formats: URLs, mailto:, tel:, sms:, geo:, WIFI:, vCard, and calendar events — plus length, whitespace, and dangerous schemes. It checks structure, not whether the destination is live or trustworthy.',
    },
    {
      question: 'Does a clean lint mean the code will scan?',
      answer:
        'It means the payload is well-formed. Whether it scans also depends on print size, contrast, density, and the scanner — a valid payload in a badly printed code still fails.',
    },
    {
      question: 'Why flag dangerous schemes?',
      answer:
        'Schemes like javascript: and data: can execute code or smuggle content when a scanner mishandles them. They have no legitimate place in a printed QR code and most scanners block them.',
    },
    {
      question: 'My payload format is not listed. What then?',
      answer:
        'The linter still runs the generic checks (length, whitespace, non-ASCII, dangerous scheme). For format-specific rules, check the specification of that format — the linter reports the scheme as unvalidated rather than guessing.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Payload Linter',
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
          { label: 'QR Payload Linter', href: '/qr-payload-linter' },
        ]}
      />

      <AdSlot id="qr-payload-linter-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Developer Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Payload Linter
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a QR payload and lint its syntax for known schemes — mailto:, WIFI:, vCard, geo:,
          tel:, calendar events, and URLs — with errors and warnings listed per payload. Findings
          update on every edit, entirely in your browser.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Paste the payload</h2>
            <div className="space-y-2">
              <Label htmlFor="payload">Payload (exactly what the code contains)</Label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The linter detects the scheme from the first line and applies that scheme&apos;s
              rules, plus generic checks: maximum length 2953 characters, stray whitespace, and
              non-ASCII content.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <div className="text-center rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground">Detected format</div>
              <div className="text-3xl font-extrabold text-primary">{result.scheme}</div>
              <div className="text-sm text-muted-foreground">
                {errors} error(s) · {warnings} warning(s) · {payload.length} characters
              </div>
            </div>
            <ul className="space-y-2">
              {result.findings.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <span aria-hidden="true">
                    {f.severity === 'error' ? '✕' : f.severity === 'warning' ? '!' : '·'}
                  </span>
                  <span
                    className={
                      f.severity === 'error'
                        ? 'text-red-600 dark:text-red-400'
                        : f.severity === 'warning'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-muted-foreground'
                    }
                  >
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-payload-linter-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Lint Before You Print</h2>
        <p className="text-base leading-relaxed">
          A QR code with a malformed payload fails silently: the code scans, the app opens, and then
          nothing works — a Wi-Fi code with a missing field, a calendar event without a start time,
          a mailto with a typo. Those failures are invisible in the artwork and obvious to the
          person scanning. Linting the payload before printing catches the structural mistakes that
          proofreading misses.
        </p>

        <AdSlot id="qr-payload-linter-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Lint, then test-scan</h3>
        <p className="text-base leading-relaxed">
          Linting proves the payload is well-formed; only a real test scan proves the whole journey
          works. Do both: lint the payload, print a proof, and scan it on two phones.
        </p>
      </article>

      <AdSlot id="qr-payload-linter-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-payload-linter-bottom" format="horizontal-banner" />

    </div>
  );
}
