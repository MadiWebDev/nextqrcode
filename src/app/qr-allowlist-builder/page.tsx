'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ListChecks, CheckCircle2, XCircle, Download, Copy } from 'lucide-react';

interface Entry {
  domain: string;
}

function normalizeDomain(raw: string): string | null {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .split(':')[0]
    .replace(/^\.+/, '')
    .replace(/\.+$/, '');
  if (!cleaned || cleaned.includes(' ') || cleaned.includes('@') || !cleaned.includes('.'))
    return null;
  if (!/^[a-z0-9.-]+$/.test(cleaned)) return null;
  return cleaned;
}

const FAQS = [
  {
    question: 'Does an allowlist guarantee a QR code is safe?',
    answer:
      'No. An allowlist only guarantees the destination domain is one you approved. An approved site can still host a compromised page, a misleading form, or an open redirect. Use allowlists as one layer alongside content review, HTTPS, and monitoring of the pages you link to.',
  },
  {
    question: 'Should subdomains be allowed when a domain is listed?',
    answer:
      'Only when you mean it. Allowing subdomains of a large platform hands trust to every subdomain, including ones other people can create. Keep subdomain matching off by default, and list each subdomain you actually use. Turn it on only for domains you fully control.',
  },
  {
    question: 'What belongs on a QR allowlist?',
    answer:
      'The domains your organisation owns and operates, plus any redirect or shortener domains you run yourself. If a campaign needs a new domain, add it through a review step with an owner and an expiry date, rather than letting anyone add entries casually.',
  },
  {
    question: 'How often should an allowlist be reviewed?',
    answer:
      'Review it whenever a campaign ends, a domain is retired, or a vendor relationship changes, and on a fixed schedule — quarterly suits most teams. Remove entries nobody owns, and check that every remaining domain still resolves to the site you expect.',
  },
];

export default function QRAllowlistBuilderPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [allowSubdomains, setAllowSubdomains] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<{ allowed: boolean; reason: string } | null>(null);
  const [importText, setImportText] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);

  const jsonText = useMemo(
    () => JSON.stringify({ allowSubdomains, domains: entries.map((e) => e.domain) }, null, 2),
    [entries, allowSubdomains]
  );

  const addDomain = () => {
    const n = normalizeDomain(newDomain);
    if (!n) {
      setNotice('That does not look like a domain. Enter something like example.com.');
      return;
    }
    if (entries.some((e) => e.domain === n)) {
      setNotice(`${n} is already on the list.`);
      return;
    }
    setEntries((list) => [...list, { domain: n }]);
    setNewDomain('');
    setNotice(`Added ${n}.`);
  };

  const removeDomain = (d: string) => {
    setEntries((list) => list.filter((e) => e.domain !== d));
    setNotice(`Removed ${d}.`);
  };

  const testAgainstList = () => {
    const trimmed = testUrl.trim();
    let host = '';
    try {
      host = new URL(trimmed).hostname.toLowerCase();
    } catch {
      setTestResult({
        allowed: false,
        reason:
          'That does not parse as a valid absolute URL. Include the scheme, for example https://example.com/page.',
      });
      return;
    }
    const exact = entries.find((e) => e.domain === host);
    if (exact) {
      setTestResult({ allowed: true, reason: `${host} matches the listed domain exactly.` });
      return;
    }
    if (allowSubdomains) {
      const parent = entries.find((e) => host.endsWith(`.${e.domain}`));
      if (parent) {
        setTestResult({
          allowed: true,
          reason: `${host} is a subdomain of listed ${parent.domain}, and subdomain matching is on.`,
        });
        return;
      }
    }
    setTestResult({
      allowed: false,
      reason: `${host} is not on the list${allowSubdomains ? ', including as a subdomain' : ' (exact match only; subdomain matching is off)'}.`,
    });
  };

  const importJson = () => {
    try {
      const parsed: unknown = JSON.parse(importText);
      const list: string[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray((parsed as { domains?: unknown }).domains)
          ? ((parsed as { domains: unknown }).domains as unknown[])
          : [];
      const cleaned: string[] = [];
      for (const item of list) {
        if (typeof item === 'string') {
          const n = normalizeDomain(item);
          if (n && !cleaned.includes(n)) cleaned.push(n);
        }
      }
      if (cleaned.length === 0) {
        setNotice(
          'No valid domains found in that JSON. Use an array of domain strings or an object with a domains array.'
        );
        return;
      }
      setEntries(cleaned.map((domain) => ({ domain })));
      if (
        !Array.isArray(parsed) &&
        typeof (parsed as { allowSubdomains?: unknown }).allowSubdomains === 'boolean'
      ) {
        setAllowSubdomains((parsed as { allowSubdomains: boolean }).allowSubdomains);
      }
      setNotice(`Imported ${cleaned.length} domain(s).`);
    } catch {
      setNotice('That is not valid JSON. Check the syntax and try again.');
    }
  };

  const exportJson = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-allowlist.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Allowlist Builder',
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
          { label: 'QR Allowlist Builder', href: '/qr-allowlist-builder' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ListChecks className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Allowlist Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build a domain allowlist for your QR codes: add and remove domains, test URLs against the
          list, and import or export the list as JSON. Everything runs in your browser and nothing
          is uploaded.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Manage the list</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addDomain();
                }}
                inputMode="url"
              />
              <Button onClick={addDomain}>Add domain</Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Example: example.com — enter the bare domain, without a scheme or path.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allowSubdomains}
                onChange={(e) => setAllowSubdomains(e.target.checked)}
              />
              <span>Allow subdomains of listed domains</span>
            </label>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                The list is empty. Add your first domain above.
              </p>
            ) : (
              <ul className="space-y-2">
                {entries.map((e) => (
                  <li
                    key={e.domain}
                    className="flex items-center justify-between rounded-lg border p-2.5 text-sm"
                  >
                    <span className="font-mono">{e.domain}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeDomain(e.domain)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {notice && <p className="text-xs text-muted-foreground">{notice}</p>}
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">2. Test a URL against the list</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input value={testUrl} onChange={(e) => setTestUrl(e.target.value)} inputMode="url" />
              <Button variant="outline" onClick={testAgainstList}>
                Test URL
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Example: https://shop.example.com/offer
            </p>
            {testResult && (
              <p
                className={`flex gap-2 text-sm rounded-lg p-3 ${testResult.allowed ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}
              >
                {testResult.allowed ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>
                  <strong>{testResult.allowed ? 'ALLOWED' : 'BLOCKED'} — </strong>
                  {testResult.reason}
                </span>
              </p>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">3. Import / export JSON</h2>
            <div className="space-y-1.5">
              <Label htmlFor="import-json">Import JSON (replaces the current list)</Label>
              <Textarea
                id="import-json"
                rows={5}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: {`{"allowSubdomains": false, "domains": ["example.com"]}`}
              </p>
            </div>
            <Button variant="outline" onClick={importJson} className="w-full">
              Import JSON
            </Button>
            <div className="rounded-lg bg-muted p-3 max-h-56 overflow-auto">
              <pre className="text-[11px] font-mono whitespace-pre-wrap">{jsonText}</pre>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={exportJson} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download JSON
              </Button>
              <Button variant="outline" size="sm" onClick={copyJson} className="gap-1.5">
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy JSON'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This list lives only in this browser tab. Export it to keep a copy, and import it to
              restore one.
            </p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How a QR domain allowlist actually protects you
        </h2>
        <p className="text-base leading-relaxed">
          An allowlist is a simple promise: QR codes your organisation publishes may only point at
          domains you have approved. That sounds modest, but it closes a real failure mode.
          Campaigns accumulate redirect services, agency-owned domains, shortener links, and
          microsites that nobody remembers. When a domain lapses, an attacker can re-register it and
          inherit every printed code that points there. A reviewed list of approved domains turns
          that slow drift into a visible decision: if a domain is not on the list, the code does not
          ship.
        </p>
        <p className="text-base leading-relaxed">
          The hard part is not the list; it is the ownership. Every entry needs a named owner and a
          reason, even if that record lives outside this tool in your own tracker. An entry nobody
          owns is an entry nobody will remove when the campaign ends. Review the list whenever a
          campaign closes, a domain is retired, or a vendor relationship changes, and on a fixed
          schedule as well. Quarterly suits most teams. At each review, confirm that every domain
          still resolves to the site you expect — a domain that now serves a parking page or someone
          else&apos;s content has already failed the test.
        </p>
        <p className="text-base leading-relaxed">
          Subdomain matching is the decision most teams get wrong. Allowing subdomains of a domain
          you fully control is reasonable: your own team runs every subdomain. Allowing subdomains
          of a large shared platform is not, because other people can create subdomains there — your
          approval would extend to strangers. Keep subdomain matching off by default, and list each
          subdomain you actually use. The extra entries cost nothing; the blanket permission can
          cost a great deal.
        </p>
        <p className="text-base leading-relaxed">
          An allowlist is also not a safety verdict. It says the domain is approved, not that the
          page is safe. An approved site can host a compromised page, a misleading form, or an open
          redirect that bounces visitors elsewhere. Pair the list with content review of the pages
          you link to, HTTPS everywhere, and monitoring that notices when a linked page changes.
          Treat the allowlist as one gate in a chain — the gate that stops the obvious mistakes,
          like a code pointing at a personal file-sharing link or a lookalike domain a tired
          campaign manager typed from memory.
        </p>
        <p className="text-base leading-relaxed">
          Finally, make the workflow kind to the people who use it. If adding a legitimate domain
          takes a week of approvals, teams will route around the list with shorteners and personal
          domains, and you will have less control than before. Give campaigns a fast, reviewed path
          to add a domain with an expiry date, and an equally fast path to remove one. The goal is a
          list that reflects reality — every entry owned, current, and checked — not a longer list.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Allowlists
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
