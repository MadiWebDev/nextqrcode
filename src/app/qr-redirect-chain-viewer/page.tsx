'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitBranch, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface HopAnalysis {
  label: string;
  host: string;
  path: string;
  paramCount: number;
  flags: string[];
}

interface Result {
  parsed: HopAnalysis;
  fetchOutcome: string;
  finalUrl: string;
  verdict: string;
  verdictKind: 'safe' | 'warn' | 'danger' | 'unknown';
}

const SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rebrand.ly',
  'cutt.ly',
  'shorte.st',
];

function analyzeUrl(raw: string): HopAnalysis {
  const u = new URL(raw);
  const flags: string[] = [];
  if (u.protocol !== 'https:')
    flags.push('Not HTTPS — data sent to this destination is not encrypted in transit.');
  if (/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname))
    flags.push('Host is a raw IP address — legitimate public sites normally use a domain name.');
  if (u.username || u.password)
    flags.push(
      'URL contains credentials before the @ sign — a classic disguise for the real host.'
    );
  if (u.hostname.split('.').length > 4)
    flags.push(
      'Unusually many subdomains — check that the rightmost domain is the one you expect.'
    );
  if (SHORTENERS.includes(u.hostname.toLowerCase()))
    flags.push('URL shortener — the real destination is hidden until the link is followed.');
  if (/xn--/.test(u.hostname))
    flags.push(
      'Punycode (xn--) in the host — the displayed name may look like a familiar brand while pointing elsewhere.'
    );
  const params = Array.from(u.searchParams.keys());
  if (params.length > 5)
    flags.push(
      `Many query parameters (${params.length}) — tracking parameters are normal, but check for unexpected redirect or token parameters.`
    );
  if (/redirect|next|url=|return|goto/i.test(u.search))
    flags.push(
      'URL contains a redirect-style parameter — the page may bounce you onward to a different site.'
    );
  return {
    label: 'Pasted destination',
    host: u.hostname,
    path: u.pathname + u.search,
    paramCount: params.length,
    flags,
  };
}

const FAQS = [
  {
    question: 'Why does this tool not list every hop in the redirect chain?',
    answer:
      'Browsers deliberately do not expose intermediate redirect hops to a web page. A page can learn the final URL after redirects, but not the stops in between. A full chain listing needs a server-side fetch or a command-line tool such as curl, which can follow and print each Location header.',
  },
  {
    question: 'If the fetch attempt fails, does that mean the destination is dead?',
    answer:
      'No. A browser fetch from this page fails for many reasons that say nothing about the destination: the site may block cross-origin requests, the network may block the request, or the site may require a browser navigation. Treat a failed fetch as unknown, not as dead.',
  },
  {
    question: 'What is the most reliable way to check a suspicious redirect chain?',
    answer:
      'Use curl with the -L and -I flags from a terminal, which prints each hop and its status code, or open the link in a fresh browser profile and watch the address bar. Never enter credentials on a page you reached through a chain you did not expect.',
  },
  {
    question: 'Are URL shorteners dangerous by themselves?',
    answer:
      'A shortener only hides the destination; it is not proof of harm. Treat a shortened link as unreadable rather than unsafe: expand it with a trusted expander or a command-line request before deciding, and be extra cautious when a shortener arrives in an unexpected message.',
  },
];

export default function QRRedirectChainViewerPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const inspect = async () => {
    setError('');
    setResult(null);
    let parsed: HopAnalysis;
    try {
      parsed = analyzeUrl(url.trim());
    } catch {
      setError(
        'That does not parse as a valid absolute URL. Include the scheme, for example https://example.com/page.'
      );
      return;
    }
    setChecking(true);
    let fetchOutcome = '';
    let finalUrl = '';
    try {
      const res = await fetch(url.trim(), {
        method: 'GET',
        redirect: 'follow',
        credentials: 'omit',
      });
      finalUrl = res.url || url.trim();
      fetchOutcome = `Fetch succeeded: HTTP ${res.status} ${res.statusText || ''}. The browser ${res.redirected ? 'followed at least one redirect' : 'did not report a redirect'} and landed on the final URL shown.`;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Fetch failed';
      fetchOutcome = `Fetch could not complete from this page (${msg}). This is commonly caused by the destination blocking cross-origin reads (CORS) or by a network restriction — it does NOT prove the destination is dead or alive.`;
    }
    setChecking(false);
    const danger = parsed.flags.some(
      (f) => f.startsWith('Not HTTPS') || f.includes('credentials') || f.includes('raw IP')
    );
    const verdict = danger
      ? 'Treat this destination as risky: at least one strong warning flag applies. Do not enter credentials.'
      : parsed.flags.length > 0
        ? 'Proceed with caution: review the flags below before trusting this destination.'
        : 'No static warning flags found. The fetch outcome above is still only a browser-level observation, not a safety guarantee.';
    setResult({
      parsed,
      fetchOutcome,
      finalUrl,
      verdict,
      verdictKind: danger ? 'danger' : parsed.flags.length > 0 ? 'warn' : 'safe',
    });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Redirect Chain Viewer',
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
          { label: 'QR Redirect Chain Viewer', href: '/qr-redirect-chain-viewer' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Redirect Chain Viewer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a QR destination URL to inspect it: static analysis of the host, path, and
          parameters, plus a real browser fetch attempt. Read the caveats — browsers hide
          intermediate redirect hops, so this tool reports exactly what it can observe and nothing
          it cannot.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Inspect a destination URL</h2>
            <div className="space-y-1.5">
              <Label htmlFor="redirect-url">Destination URL from the QR code</Label>
              <Input
                id="redirect-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                inputMode="url"
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/welcome?utm_source=qr
              </p>
            </div>
            <Button onClick={inspect} disabled={checking || !url.trim()}>
              {checking ? 'Checking…' : 'Inspect URL'}
            </Button>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Honest limits: this page can only report the final URL the browser lands on and
                whether a redirect was reported. It cannot list intermediate hops — browsers do not
                expose them to web pages. A failed fetch usually means the site blocks cross-origin
                reads (CORS); it does not mean the site is dead.
              </span>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Inspection result</h2>
              <div className="text-xs space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Host</span>
                  <span className="font-mono break-all text-right">{result.parsed.host}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Path + query</span>
                  <span className="font-mono break-all text-right">
                    {result.parsed.path || '/'}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Query parameters</span>
                  <span className="font-semibold">{result.parsed.paramCount}</span>
                </div>
              </div>
              {result.parsed.flags.length > 0 ? (
                <ul className="space-y-2">
                  {result.parsed.flags.map((f, i) => (
                    <li
                      key={i}
                      className="text-xs flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs flex gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>No static warning flags found for this URL.</span>
                </p>
              )}
              <div className="rounded-lg bg-muted p-3 text-xs leading-relaxed">
                {result.fetchOutcome}
              </div>
              {result.finalUrl && (
                <p className="text-xs break-all">
                  <span className="text-muted-foreground">Final URL observed: </span>
                  <span className="font-mono">{result.finalUrl}</span>
                </p>
              )}
              <p
                className={`text-xs font-semibold rounded-lg p-3 ${result.verdictKind === 'danger' ? 'bg-red-500/10 text-red-700 dark:text-red-300' : result.verdictKind === 'warn' ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}
              >
                {result.verdict}
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                Paste a URL and run the inspection to see the analysis here.
              </p>
            </Card>
          )}
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to read a QR redirect chain without being fooled
        </h2>
        <p className="text-base leading-relaxed">
          A QR code rarely points at a final page directly. Marketing links pass through redirect
          services, tracking domains, and campaign routers before landing somewhere. Each hop is a
          chance for the destination to change, and the address bar a scanner shows you is only the
          first hop, not the last. The discipline is to treat the first URL as a claim and verify
          where it actually leads before trusting it with anything valuable, especially a password
          or payment details.
        </p>
        <p className="text-base leading-relaxed">
          Start with the static structure, because it never lies about itself. Read the host from
          the right: in shop.example.com the registrable domain is example.com, and everything to
          its left is a subdomain the owner controls. A host such as example.com.attacker.com is
          attacker.com, not example.com, no matter how convincing the left-hand part looks. Check
          the scheme — a login or payment page served over plain HTTP is a stop sign. Look for
          credentials embedded before an @ sign, for raw IP addresses instead of domain names, and
          for punycode that can make a lookalike domain render like a familiar brand. None of these
          alone proves harm, but each one raises the bar for what you should believe next.
        </p>
        <p className="text-base leading-relaxed">
          Next, consider what a browser can and cannot tell you. When a page on one origin fetches a
          URL on another, the destination may refuse to be read — cross-origin resource sharing
          rules are designed to stop exactly that. A failed fetch therefore proves nothing about
          whether the site is alive, dead, or dangerous. What a browser fetch can tell you is the
          final URL after redirects and whether a redirect was reported at all. That is useful but
          incomplete: the intermediate hops stay hidden from web pages by design, which is why this
          tool is explicit about its limits instead of inventing a chain.
        </p>
        <p className="text-base leading-relaxed">
          For a full chain, use a tool that is allowed to see it. From a terminal, a request with
          redirect-following and header output shows each hop, each status code, and each Location
          header in order. Watch for hops that cross from a trusted domain to an unrelated one, hops
          that downgrade HTTPS to HTTP, and chains that bounce through several unrelated tracking
          domains before landing. A short chain that stays on one organisation&apos;s domains is
          ordinary. A long chain that ends somewhere unexpected is reason to stop.
        </p>
        <p className="text-base leading-relaxed">
          The practical rule is simple: never authenticate through a chain you did not expect. If a
          QR code in a restaurant, poster, or email promises your bank, your inbox, or your payment
          provider, type the address yourself or use a bookmark instead of following the chain. And
          if you publish QR codes, keep your own chains short, keep them on domains you own, and
          check them on a schedule — because a redirect you set up two years ago may now point
          somewhere you no longer control.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Redirect Chains
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
