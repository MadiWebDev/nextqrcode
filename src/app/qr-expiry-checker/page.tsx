'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hourglass, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

interface CheckResult {
  verdict: string;
  kind: 'active' | 'expired' | 'unknown' | 'error';
  details: string[];
}

const FAQS = [
  {
    question: 'Can a QR code itself expire?',
    answer:
      'A static QR code — one whose payload is printed into the pattern — never expires on its own. What expires is the thing behind it: a campaign page, a ticket, a booking link, a short URL. A dynamic QR code, where the printed pattern points at a redirect you control, can be retired by changing or removing the redirect.',
  },
  {
    question: 'Why does the fetch attempt often fail to give an answer?',
    answer:
      'Because a web page may only read responses from destinations that allow cross-origin reads. Many sites refuse, which makes the fetch fail even though the site is fine. Browsers also hide redirect details from pages. A failed fetch is an unknown result, not evidence the destination is dead.',
  },
  {
    question: 'How should I check whether a destination is really dead?',
    answer:
      'Open it in your browser and watch what happens, use a command-line request that follows redirects and prints each status code, or check it with a monitoring service you trust. If the page belongs to you, check your own server logs and redirect rules — a changed slug or a retired campaign is the most common cause of a dead QR destination.',
  },
  {
    question: 'What should I do with QR codes whose campaigns have ended?',
    answer:
      'Retire them deliberately: point the redirect at a short page that says the campaign ended and where to go next, or remove the code from circulation. A dead end teaches scanners not to trust your next code, while a polite landing page preserves the relationship.',
  },
];

export default function QRExpiryCheckerPage() {
  const [url, setUrl] = useState('');
  const [expiry, setExpiry] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const check = async () => {
    setError('');
    setResult(null);
    const details: string[] = [];
    let host = '';
    try {
      const u = new URL(url.trim());
      host = u.hostname;
      details.push(
        `Destination host: ${host}. Scheme: ${u.protocol.replace(':', '').toUpperCase()}.`
      );
      if (u.protocol !== 'https:') details.push('Note: this destination does not use HTTPS.');
    } catch {
      setError(
        'That does not parse as a valid absolute URL. Include the scheme, for example https://example.com/page.'
      );
      return;
    }
    let dateVerdict: 'active' | 'expired' | 'none' = 'none';
    if (expiry) {
      const d = new Date(expiry + 'T23:59:59');
      if (Number.isNaN(d.getTime())) {
        details.push('The expiry date could not be parsed — it was ignored.');
      } else if (d.getTime() < Date.now()) {
        dateVerdict = 'expired';
        details.push(
          `The expiry date you entered (${expiry}) has passed, so this destination should be treated as expired regardless of the fetch outcome.`
        );
      } else {
        dateVerdict = 'active';
        details.push(`The expiry date you entered (${expiry}) is still in the future.`);
      }
    } else {
      details.push(
        'No expiry date entered — the check below covers reachability only, not expiry.'
      );
    }
    setChecking(true);
    let fetchDetail = '';
    let fetchWorked = false;
    try {
      const res = await fetch(url.trim(), {
        method: 'GET',
        redirect: 'follow',
        credentials: 'omit',
      });
      fetchWorked = true;
      fetchDetail = `Browser fetch returned HTTP ${res.status}${res.redirected ? ' after following at least one redirect' : ''}. Final URL observed: ${res.url || url.trim()}.`;
      if (res.status >= 400)
        fetchDetail += ' A 4xx/5xx response means the destination answered but reported an error.';
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Fetch failed';
      fetchDetail = `Browser fetch could not complete (${msg}). This usually means the destination blocks cross-origin reads (CORS) or the network blocked the request. It does NOT prove the destination is dead or alive.`;
    }
    setChecking(false);
    details.push(fetchDetail);
    if (dateVerdict === 'expired') {
      setResult({ verdict: 'EXPIRED (by the date you entered)', kind: 'expired', details });
    } else if (fetchWorked) {
      setResult({
        verdict: 'FETCH ANSWERED — expiry still depends on your date',
        kind: 'active',
        details,
      });
    } else {
      setResult({
        verdict: 'UNKNOWN — fetch was blocked, not conclusive',
        kind: 'unknown',
        details,
      });
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Expiry Checker',
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
          { label: 'QR Expiry Checker', href: '/qr-expiry-checker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Hourglass className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Expiry Checker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Check whether a QR destination is expired, redirected, or unreachable. Enter the
          destination URL and, if the campaign had one, its expiry date. The tool compares the date
          and attempts a real browser fetch — and reports the outcome honestly, including when the
          browser cannot tell.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Check a destination</h2>
            <div className="space-y-1.5">
              <Label htmlFor="expiry-url">Destination URL from the QR code</Label>
              <Input
                id="expiry-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                inputMode="url"
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/spring-offer
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expiry-date">Campaign expiry date (optional)</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                The date the campaign or ticket was meant to end. Leave blank if there was none.
              </p>
            </div>
            <Button onClick={check} disabled={checking || !url.trim()}>
              {checking ? 'Checking…' : 'Check destination'}
            </Button>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Read the verdict carefully. A failed browser fetch usually means the destination
                blocks cross-origin reads (CORS) — it does not mean the destination is dead. Only
                the expiry-date comparison is a firm verdict, and only for the date you entered.
              </span>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <Card className="p-6 space-y-3">
              <h2 className="text-lg font-bold">Result</h2>
              <p
                className={`flex gap-2 text-sm font-semibold rounded-lg p-3 ${result.kind === 'expired' ? 'bg-red-500/10 text-red-700 dark:text-red-300' : result.kind === 'active' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-800 dark:text-amber-300'}`}
              >
                {result.kind === 'expired' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : result.kind === 'active' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                {result.verdict}
              </p>
              <ul className="space-y-2">
                {result.details.map((d, i) => (
                  <li key={i} className="text-xs leading-relaxed rounded-lg bg-muted p-3">
                    {d}
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                Enter a URL and run the check to see the verdict here.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-expiry-checker-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why QR destinations die, and how to tell
        </h2>
        <p className="text-base leading-relaxed">
          A QR code almost never dies; the thing behind it does. The most common cause is
          embarrassingly ordinary: a campaign page is taken down, a product slug changes, a
          ticketing platform retires an event, or a short link is deleted in a tidy-up. Because the
          printed code cannot change, every poster, package, and business card carrying it quietly
          becomes a dead end. The fix is organisational, not technical: someone must own each
          destination, know when it ends, and retire it deliberately.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-expiry-checker-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The first distinction to make is between a static and a dynamic code. A static code has
          the destination baked into its pattern; if the page moves, the code is wrong and only
          reprinting fixes it. A dynamic code points at a redirect you control, so you can change
          the destination behind the printed pattern. Dynamic codes cost you a redirect service to
          maintain, but they are the only sane choice for anything with a lifespan — campaigns,
          events, menus, tickets. If you print static codes for temporary things, you are scheduling
          future dead ends.
        </p>
        <p className="text-base leading-relaxed">
          The second distinction is between expiry and reachability. Expiry is a fact about your own
          plan: the campaign ended on this date, the ticket was valid until that date. Only you can
          state it, which is why this tool asks you for the date instead of guessing. Reachability
          is a fact about the network: does the destination answer? A browser page like this one can
          attempt a fetch, but cross-origin rules mean many destinations will refuse to be read, and
          the browser will not reveal intermediate redirect hops. A failed fetch from this page is
          therefore an unknown, and this tool labels it as such rather than dressing it up as a
          verdict.
        </p>
        <p className="text-base leading-relaxed">
          For a conclusive reachability answer, use a tool that is allowed to see the full picture:
          open the link in your browser and watch the address bar, issue a redirect-following
          request from a terminal and read each status code, or rely on a monitoring service that
          checks your destinations on a schedule. If the destination is yours, your own server logs
          and redirect rules are the fastest source of truth — a changed slug or a retired campaign
          shows up there immediately.
        </p>
        <p className="text-base leading-relaxed">
          Finally, retire codes with the same care you used to launch them. Point a retired redirect
          at a short page that says the campaign ended and where to go next, rather than leaving a
          bare error. Remove codes from circulation where you can, and keep a register of every live
          code, its destination, its owner, and its end date. A register turns expiry from a
          surprise into a scheduled task — and a QR programme with a register is one whose codes
          keep working.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="qr-expiry-checker-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Expiry
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

      {/* Bottom AdSlot */}
      <AdSlot id="qr-expiry-checker-bottom" format="horizontal-banner" />
    </div>
  );
}
