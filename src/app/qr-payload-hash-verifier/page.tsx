'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hash } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRPayloadHashVerifierPage() {
  const [payload, setPayload] = useState('https://example.com/menu?location=main');
  const [expected, setExpected] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [computed, setComputed] = useState('');
  const [hashError, setHashError] = useState('');
  React.useEffect(() => {
    let live = true;
    (async () => {
      try {
        if (!window.crypto || !window.crypto.subtle) {
          if (live) setHashError('Web Crypto is not available in this browser.');
          return;
        }
        const data = new TextEncoder().encode(payload);
        const digest = await window.crypto.subtle.digest(algo, data);
        if (!live) return;
        setComputed(
          Array.from(new Uint8Array(digest))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
        );
        setHashError('');
      } catch {
        if (live) setHashError('Could not compute the hash in this browser.');
      }
    })();
    return () => {
      live = false;
    };
  }, [payload, algo]);
  const normExpected = expected.toLowerCase().replace(/[^a-f0-9]/g, '');
  const verdict = !normExpected
    ? 'Enter an expected hash to compare against.'
    : normExpected === computed
      ? 'MATCH — the payload is unchanged.'
      : 'MISMATCH — the payload differs from the expected hash.';
  const [copied, setCopied] = useState(false);
  const copyHash = async () => {
    await navigator.clipboard.writeText(computed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What does a mismatch mean?',
      answer:
        'The payload differs from the recorded one in at least one byte \u2014 a character, a space, or a line break. Treat the code as untrusted until the difference is explained.',
    },
    {
      question: 'Does a match prove the destination is safe?',
      answer:
        'No. It proves the payload is unchanged. A dynamic link can still point to a changed page, so check the destination separately.',
    },
    {
      question: 'Why SHA-1 and SHA-256 give different hashes?',
      answer:
        'They are different algorithms with different digest lengths. Always compare hashes made with the same algorithm.',
    },
    {
      question: 'Where does the hashing happen?',
      answer: 'In your browser with the Web Crypto API. The payload is never sent anywhere.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Payload Hash Verifier',
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
          { label: 'QR Payload Hash Verifier', href: '/qr-payload-hash-verifier' },
        ]}
      />

      <AdSlot id="qr-payload-hash-verifier-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Hash className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Payload Hash Verifier
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Hash a QR payload with real SHA-256 / SHA-384 / SHA-512 / SHA-1 in your browser via Web
          Crypto, then compare it against an expected hash to prove the code is unchanged.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Enter the payload and expected hash</h2>
            <div className="space-y-2">
              <Label htmlFor="payload">QR payload</Label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="algo">Hash algorithm</Label>
              <select
                id="algo"
                value={algo}
                onChange={(e) => setAlgo(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected">Expected hash (hex)</Label>
              <Input
                id="expected"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                placeholder="Paste the expected hex hash"
                className="font-mono"
              />
            </div>
            {hashError && (
              <p className="text-sm text-red-600" role="alert">
                {hashError}
              </p>
            )}
            <Button variant="outline" size="sm" onClick={copyHash} disabled={!computed}>
              {copied ? 'Copied!' : 'Copy computed hash'}
            </Button>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-xs text-muted-foreground">{algo} of the payload above</p>
            <p className="text-xs font-mono break-all bg-muted rounded-md p-3">
              {computed || 'Computing…'}
            </p>
            <p
              className={`font-semibold ${normExpected ? (normExpected === computed ? 'text-emerald-600' : 'text-red-600') : 'text-muted-foreground'}`}
            >
              {verdict}
            </p>
            {normExpected && normExpected !== computed && (
              <p className="text-sm text-muted-foreground">
                Any difference — even one character, a trailing space, or a changed letter case —
                produces a completely different hash. Re-check the payload and the expected hash
                character by character.
              </p>
            )}
            {normExpected && normExpected === computed && (
              <p className="text-sm text-muted-foreground">
                The payload matches the expected hash exactly for this algorithm.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Comparison ignores spaces and letter case in the expected hash, so pasted hashes with
              line breaks still compare correctly.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-payload-hash-verifier-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Proving a QR Code Has Not Changed</h2>
        <p className="text-base leading-relaxed">
          A printed QR code cannot be edited, but its payload can be copied, re-printed, or swapped.
          A hash is a fingerprint of the payload: change even one character and the fingerprint
          changes completely. If you recorded the hash when the code was created, comparing a fresh
          hash of the payload against that record proves whether the code in front of you is the one
          you issued.
        </p>
        <h3 className="text-xl font-semibold text-foreground">How to use the hash in practice</h3>
        <p className="text-base leading-relaxed">
          When you generate a code, record its payload and its SHA-256 hash in the job file. Later,
          scan the printed code, paste the decoded payload here, and paste the recorded hash as the
          expected value. A match means the payload is byte-for-byte the one you recorded. A
          mismatch means something changed — a retyped URL, a different code, or a substituted print
          — and the code should not be trusted until the difference is explained.
        </p>

        <AdSlot id="qr-payload-hash-verifier-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Which algorithm to pick</h3>
        <p className="text-base leading-relaxed">
          SHA-256 is the sensible default for verification records: widely supported, fast, and
          collision-resistant for this use. SHA-384 and SHA-512 give longer fingerprints; SHA-1 is
          shown for compatibility with older records but should not be used for new ones, because it
          is no longer considered collision-resistant.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Hash the exact payload, including every character — trailing spaces and line breaks
            count.
          </li>
          <li>Store the expected hash with the job file, not on the printed poster.</li>
          <li>
            A match proves the payload is unchanged; it does not prove the destination page is safe.
          </li>
          <li>
            If the destination is a dynamic link, the payload can match while the page it points to
            has changed.
          </li>
        </ul>
      </article>

      <AdSlot id="qr-payload-hash-verifier-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-payload-hash-verifier-bottom" format="horizontal-banner" />

    </div>
  );
}
