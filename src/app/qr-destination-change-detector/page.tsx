'use client';

import { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRDestinationChangeDetectorPage() {
  const KEY = 'qr-destination-baseline';
  const [baseline, setBaseline] = useState(() => {
    try {
      return window.localStorage.getItem(KEY) || '';
    } catch {
      return '';
    }
  });
  const [current, setCurrent] = useState('https://example.com/menu?location=main');
  const [saved, setSaved] = useState(() => {
    try {
      return window.localStorage.getItem(KEY) || '';
    } catch {
      return '';
    }
  });
  const [savedMsg, setSavedMsg] = useState('');
  const diff = useMemo(() => {
    const changes: string[] = [];
    if (!baseline || !current)
      return { changes, verdict: 'Enter a baseline and a current destination to compare them.' };
    if (baseline === current)
      return { changes, verdict: 'No change — current destination is identical to the baseline.' };
    try {
      const a = new URL(baseline);
      const b = new URL(current);
      if (a.protocol !== b.protocol)
        changes.push('Scheme changed: ' + a.protocol + ' → ' + b.protocol + '.');
      if (a.hostname !== b.hostname)
        changes.push(
          'Host changed: ' +
            a.hostname +
            ' → ' +
            b.hostname +
            '. This is the strongest hijack signal.'
        );
      if (a.pathname !== b.pathname)
        changes.push('Path changed: ' + a.pathname + ' → ' + b.pathname + '.');
      if (a.port !== b.port) changes.push('Port changed.');
      const ap = new Map(Array.from(a.searchParams.entries()));
      const bp = new Map(Array.from(b.searchParams.entries()));
      ap.forEach((v, k) => {
        if (!bp.has(k)) changes.push('Parameter removed: ' + k + '.');
        else if (bp.get(k) !== v)
          changes.push('Parameter changed: ' + k + ' = ' + v + ' → ' + bp.get(k) + '.');
      });
      bp.forEach((v, k) => {
        if (!ap.has(k)) changes.push('Parameter added: ' + k + ' = ' + v + '.');
      });
      if (a.hash !== b.hash) changes.push('Fragment changed.');
    } catch {
      changes.push('One of the two values is not a parseable URL, but the texts differ.');
    }
    return {
      changes,
      verdict: changes.length
        ? changes.length + ' change(s) vs baseline.'
        : 'Texts differ but the URL parts compared are identical (for example whitespace or case).',
    };
  }, [baseline, current]);
  const saveBaseline = () => {
    try {
      window.localStorage.setItem(KEY, baseline);
      setSaved(baseline);
      setSavedMsg('Baseline saved in this browser.');
    } catch {
      setSavedMsg('Could not save — browser storage is unavailable.');
    }
  };
  const clearBaseline = () => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setBaseline('');
    setSaved('');
    setSavedMsg('Baseline cleared.');
  };

  const faqs = [
    {
      question: 'Does this tool fetch the destination?',
      answer:
        'No. You paste the current destination yourself. It compares the two texts locally and never requests either URL.',
    },
    {
      question: 'What is a dynamic QR code?',
      answer:
        'A code that points to a redirect you control, so the destination can change without reprinting the code.',
    },
    {
      question: 'Where is the baseline stored?',
      answer: "In this browser's local storage. It stays on this device and is never uploaded.",
    },
    {
      question: 'The destination matches but the page looks wrong. What now?',
      answer:
        'The page itself may have changed. Check the page content separately and contact the link owner.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Destination Change Detector',
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
          { label: 'QR Destination Change Detector', href: '/qr-destination-change-detector' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Destination Change Detector
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Save the destination a dynamic QR code is supposed to point to, then compare the current
          destination against that baseline. A host change is the hijack signal; path and parameter
          changes get listed one by one.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Baseline and current destination</h2>
            <div className="space-y-2">
              <Label htmlFor="baseline">Baseline destination (expected)</Label>
              <Input
                id="baseline"
                value={baseline}
                onChange={(e) => setBaseline(e.target.value)}
                placeholder="https://example.com/menu?location=main"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">Current destination (checked now)</Label>
              <Input
                id="current"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="https://example.com/menu?location=main"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={saveBaseline} disabled={!baseline}>
                Save baseline
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrent(saved || baseline);
                }}
              >
                Use saved as current
              </Button>
              <Button variant="outline" size="sm" onClick={clearBaseline}>
                Clear baseline
              </Button>
            </div>
            {savedMsg && <p className="text-sm text-muted-foreground">{savedMsg}</p>}
            {saved && (
              <p className="text-xs text-muted-foreground">
                Saved baseline: <span className="font-mono break-all">{saved}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              The baseline is stored in this browser&apos;s local storage only. It is never
              uploaded, and it will not follow you to another device.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="font-semibold">{diff.verdict}</p>
            {diff.changes.length > 0 && (
              <div className="space-y-2">
                {diff.changes.map((c, i) => (
                  <p
                    key={i}
                    className="text-sm text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
                  >
                    {c}
                  </p>
                ))}
              </div>
            )}
            {baseline && current && baseline === current && (
              <p className="text-sm text-muted-foreground">
                Identical destinations. If the page content itself looks wrong, the page may have
                changed even though the destination has not — check the page separately.
              </p>
            )}
            {baseline &&
              current &&
              baseline !== current &&
              diff.changes.some((c) => c.startsWith('Host changed')) && (
                <p className="text-sm text-red-600 font-semibold">
                  Host change detected. Treat the code as potentially hijacked: pause the campaign
                  and verify with the link owner before reprinting or redistributing.
                </p>
              )}
          </Card>
        </div>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-destination-change-detector-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Catching a Hijacked Dynamic QR Code</h2>
        <p className="text-base leading-relaxed">
          A dynamic QR code points to a redirect you control, and the redirect&apos;s destination
          can change without the printed code changing. That is the feature — and the risk. If
          someone gains access to the redirect, or if a colleague edits it by mistake, every printed
          copy silently starts sending scanners somewhere new. The defence is a baseline: the
          destination the code is supposed to point to, recorded when the campaign goes live, and
          checked on a schedule.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-destination-change-detector-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">How to use the baseline</h3>
        <p className="text-base leading-relaxed">
          When the campaign launches, paste the intended destination here and save it as the
          baseline. At each review — weekly for a live campaign, monthly for a long-lived one —
          paste the destination the code currently resolves to and compare. The detector breaks the
          difference down by scheme, host, path, and each query parameter, so a small edit does not
          hide inside a long URL.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Which change matters most</h3>
        <p className="text-base leading-relaxed">
          A host change is the hijack signal: the destination now belongs to a different site. A
          path change may be a legitimate page move or a swap to a lookalike page on the same host.
          A parameter change may be an added tracking ID or an added credential. Any unexplained
          change means the same thing operationally: pause, verify with the link owner, and do not
          reprint until the change is explained.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Save the baseline at launch, not after the first review.</li>
          <li>Check on a schedule, not only when someone reports a problem.</li>
          <li>Record who changed the destination and why, alongside the baseline.</li>
          <li>
            If the host changed and nobody can explain it, treat it as an incident and report it.
          </li>
        </ul>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-destination-change-detector-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-destination-change-detector-bottom" format="horizontal-banner" />
    </div>
  );
}
