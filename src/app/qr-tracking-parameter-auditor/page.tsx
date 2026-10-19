'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Radar } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRTrackingParameterAuditorPage() {
  const [url, setUrl] = useState(
    'https://example.com/landing?utm_source=qr&utm_medium=poster&gclid=abc123&email=jane@example.com'
  );
  const audit = useMemo(() => {
    const TRACKING = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'gclid',
      'gbraid',
      'wbraid',
      'fbclid',
      'msclkid',
      'mc_cid',
      'mc_eid',
      'igshid',
      'vero_id',
      '_ga',
      '_gac',
      '_gcl_au',
      'dclid',
      'yclid',
      'twclid',
      'li_fat_id',
      'mc_cid',
    ];
    const PII = [
      'email',
      'e_mail',
      'mail',
      'phone',
      'tel',
      'mobile',
      'name',
      'firstname',
      'lastname',
      'fullname',
      'address',
      'dob',
      'birthdate',
      'ssn',
      'password',
      'passwd',
      'token',
      'session',
      'sessionid',
      'auth',
      'key',
      'secret',
      'creditcard',
      'card',
    ];
    try {
      const u = new URL(url);
      const rows = Array.from(u.searchParams.entries()).map(([k, v]) => {
        const kl = k.toLowerCase();
        const isTracking = TRACKING.some((t) => kl === t || kl.startsWith('utm_'));
        const isPii = PII.some((p) => kl === p || kl.includes(p));
        const looksEmail = /^[^^\s@]+@[^^\s@]+\.[^^\s@]+$/.test(v);
        const looksLongToken = v.length >= 32 && /^[A-Za-z0-9._-]+$/.test(v);
        return {
          k,
          v,
          isTracking,
          isPii,
          looksEmail,
          looksLongToken,
          kind:
            isPii || looksEmail
              ? 'Personal data'
              : isTracking
                ? 'Tracking'
                : looksLongToken
                  ? 'Possible identifier'
                  : 'Other',
        };
      });
      const tracking = rows.filter((r) => r.isTracking);
      const pii = rows.filter((r) => r.isPii || r.looksEmail);
      return { ok: true as const, rows, tracking, pii };
    } catch {
      return {
        ok: false as const,
        rows: [] as Array<{
          k: string;
          v: string;
          isTracking: boolean;
          isPii: boolean;
          looksEmail: boolean;
          looksLongToken: boolean;
          kind: string;
        }>,
        tracking: [] as Array<{
          k: string;
          v: string;
          isTracking: boolean;
          isPii: boolean;
          looksEmail: boolean;
          looksLongToken: boolean;
          kind: string;
        }>,
        pii: [] as Array<{
          k: string;
          v: string;
          isTracking: boolean;
          isPii: boolean;
          looksEmail: boolean;
          looksLongToken: boolean;
          kind: string;
        }>,
      };
    }
  }, [url]);
  const risk = !audit.ok
    ? 'Unparseable URL'
    : audit.pii.length > 0
      ? 'High — personal data in the URL'
      : audit.tracking.length > 0
        ? 'Medium — tracking parameters present'
        : 'Low — no tracking or personal-data parameters found';

  const faqs = [
    {
      question: 'Are UTM parameters dangerous?',
      answer:
        'Not by themselves. They attribute a visit to a campaign. They become a problem only when combined with personal data or when printed on sensitive material.',
    },
    {
      question: 'What is a click ID such as gclid?',
      answer:
        'An identifier added by an ad platform to match a visit to a specific ad click. It is tracking, not personal data, but it does link the scan to an ad interaction.',
    },
    {
      question: 'Should a QR code ever carry an email address?',
      answer:
        'No. Put a short anonymous reference in the link and resolve personal details server-side after the scan.',
    },
    {
      question: 'Does this tool send my URL anywhere?',
      answer: 'No. The URL is parsed locally in your browser and never fetched or uploaded.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Tracking Parameter Auditor',
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
          { label: 'QR Tracking Parameter Auditor', href: '/qr-tracking-parameter-auditor' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Radar className="w-3.5 h-3.5" />
          <span>Privacy Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Tracking Parameter Auditor
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste a QR destination URL and see every tracking parameter and every parameter that looks
          like personal data, classified one by one, with a privacy-risk note.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste the destination URL</h2>
            <div className="space-y-2">
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page?utm_source=qr"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Parsed locally. The URL is never fetched. Parameters are classified against a built-in
              list of known tracking and personal-data parameter names, plus checks for email-shaped
              values and long identifier-shaped values.
            </p>
            {!audit.ok && (
              <p className="text-sm text-red-600" role="alert">
                Could not parse this as a URL. Enter a complete URL starting with https://
              </p>
            )}
            {audit.ok && audit.rows.length === 0 && (
              <p className="text-sm text-muted-foreground">
                This URL has no query parameters at all.
              </p>
            )}
            {audit.ok && audit.rows.length > 0 && (
              <div className="space-y-2">
                {audit.rows.map((r, i) => (
                  <div key={i} className="rounded-lg border border-border/70 p-3">
                    <div className="flex justify-between gap-2">
                      <span className="font-mono text-xs font-semibold break-all">{r.k}</span>
                      <span className="text-xs font-semibold shrink-0">{r.kind}</span>
                    </div>
                    <p className="font-mono text-xs break-all text-muted-foreground mt-1">{r.v}</p>
                    {r.isTracking && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tracking: used to attribute this visit to a campaign, ad click, or referrer.
                      </p>
                    )}
                    {r.isPii && (
                      <p className="text-xs text-amber-700 mt-1">
                        Personal data: this parameter name suggests personal information travels in
                        the link.
                      </p>
                    )}
                    {r.looksEmail && (
                      <p className="text-xs text-amber-700 mt-1">
                        Value looks like an email address.
                      </p>
                    )}
                    {r.looksLongToken && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Long identifier-shaped value — may link this scan to a person or session.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm font-semibold">{risk}</p>
            {audit.ok && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <div className="text-2xl font-extrabold">{audit.rows.length}</div>
                  <div className="text-xs text-muted-foreground">Parameters</div>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <div className="text-2xl font-extrabold">{audit.tracking.length}</div>
                  <div className="text-xs text-muted-foreground">Tracking</div>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <div className="text-2xl font-extrabold">{audit.pii.length}</div>
                  <div className="text-xs text-muted-foreground">Personal data</div>
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Privacy note: parameters travel in server logs, referrer headers, and shared links.
              Keep personal data out of QR destinations entirely — use a short anonymous reference
              instead, and resolve it server-side. Tracking parameters such as utm_source are normal
              for campaigns, but strip them before printing a code on anything sensitive.
            </p>
          </Card>
        </div>
      </div>
      <AdSlot id="qr-tracking-parameter-auditor-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          What Hides in a URL&apos;s Parameters
        </h2>
        <p className="text-base leading-relaxed">
          A QR destination is rarely just a page address. Campaign links carry utm_source,
          utm_medium, and utm_campaign so marketers can attribute scans; ad links carry click IDs
          such as gclid or fbclid so platforms can match the visit to an ad. Those are normal for
          marketing, but the same mechanism can carry far more sensitive cargo: an email address, a
          name, a phone number, or a session token, all sitting in plain text in a link that anyone
          can photograph, forward, or find in a server log.
        </p>
        <AdSlot id="qr-tracking-parameter-auditor-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">
          Why personal data in a URL is a problem
        </h3>
        <p className="text-base leading-relaxed">
          URLs are logged everywhere: by the browser history, by analytics tools, by proxies, and by
          any site the link passes through. A password-reset token or a session ID in a URL can be
          replayed by anyone who copies it. An email address in a URL turns a printed poster into a
          list of addresses for whoever photographs it. The fix is structural: never put personal
          data in a QR destination. Use a short random reference and look the details up server-side
          after the scan.
        </p>
        <h3 className="text-xl font-semibold text-foreground">What to do with the audit result</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Tracking-only parameters: keep them if the campaign needs attribution, and document
            them.
          </li>
          <li>Personal-data parameters: remove them and re-issue the code.</li>
          <li>
            Long identifier-shaped values: check whether they identify a person or session; if so,
            replace them with an anonymous reference.
          </li>
          <li>
            After fixing the URL, regenerate the QR code — the printed code still carries the old
            parameters.
          </li>
        </ul>
      </article>
      <AdSlot id="qr-tracking-parameter-auditor-pre-related" format="horizontal-banner" />
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
      <AdSlot id="qr-tracking-parameter-auditor-bottom" format="horizontal-banner" />
    </div>
  );
}
