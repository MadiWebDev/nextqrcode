'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Fingerprint, CheckCircle2, XCircle, Copy, Download } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const FAQS = [
  {
    question: 'What does a SHA-256 checksum prove?',
    answer:
      'It proves the text you received is byte-for-byte identical to the text that was hashed. If even one character changes, the checksum changes completely. It does not prove who wrote the text — for authorship you need a digital signature, not a checksum.',
  },
  {
    question: 'Why is the checksum shown in two forms?',
    answer:
      'The full 64-character hex checksum is the authoritative value for verification. The short 12-character form is for printing beside a code, where a full checksum would make the code denser or the label crowded. Verify against the full value whenever you can; the short form only catches casual errors.',
  },
  {
    question: 'Should the checksum live inside the QR payload or beside it?',
    answer:
      'Beside it, in readable print. A checksum inside the payload cannot detect tampering with the code itself, because an attacker who replaces the code would replace the embedded checksum too. A checksum printed separately — on a letter, a label, or a second channel — lets the recipient compare two independent sources.',
  },
  {
    question: 'Is SHA-256 still safe to use?',
    answer:
      'Yes for integrity checking. SHA-256 is a widely used, standard hash function with no practical preimage attack. The realistic risks are procedural: sending the checksum through the same channel as the payload, or comparing only part of it. Send the checksum separately and compare the full value.',
  },
];

export default function QRChecksumGeneratorPage() {
  const [payload, setPayload] = useState('');
  const [hash, setHash] = useState('');
  const [expected, setExpected] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    if (!payload) return;
    sha256Hex(payload)
      .then((h) => {
        if (live) setHash(h);
      })
      .catch(() => {
        if (live) setHash('');
      });
    QRCodeLib.toDataURL(payload, { errorCorrectionLevel: 'M', width: 512, margin: 2 })
      .then((u) => {
        if (live) setQrUrl(u);
      })
      .catch(() => {
        if (live) setQrUrl('');
      });
    return () => {
      live = false;
    };
  }, [payload]);

  const verify = () => {
    const clean = expected.trim().toLowerCase();
    if (!payload || !hash) {
      setVerifyMessage('Enter a payload first so there is a checksum to compare against.');
      return;
    }
    if (!/^[0-9a-f]{64}$/.test(clean)) {
      setVerifyMessage(
        'That does not look like a full SHA-256 checksum (64 hex characters). Paste the full value the sender gave you.'
      );
      return;
    }
    setVerifyMessage(
      clean === hash
        ? 'MATCH — the payload is byte-for-byte identical to what was hashed.'
        : 'MISMATCH — the payload differs from what was hashed. Do not trust it.'
    );
  };

  const verificationText = useMemo(() => {
    if (!payload || !hash) return '';
    return [
      'QR payload verification note',
      '',
      `Payload: ${payload}`,
      `SHA-256: ${hash}`,
      `Short checksum (first 12 characters): ${hash.slice(0, 12)}`,
      '',
      'To verify: hash the payload text exactly as printed (UTF-8, SHA-256) and compare the full 64-character checksum.',
    ].join('\n');
  }, [payload, hash]);

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadNote = () => {
    const blob = new Blob([verificationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-verification-note.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Checksum Generator',
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
          { label: 'QR Checksum Generator', href: '/qr-checksum-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Checksum Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate a real SHA-256 checksum for any QR payload with your browser&apos;s built-in
          cryptography, so a recipient can verify that a printed code has not been altered. Also
          verify a payload against a checksum someone sent you.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Generate a checksum</h2>
            <div className="space-y-1.5">
              <Label htmlFor="checksum-payload">Exact QR payload</Label>
              <Textarea
                id="checksum-payload"
                rows={4}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/ticket/REF-99104
              </p>
            </div>
            {payload && hash && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  SHA-256 checksum
                </p>
                <p className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{hash}</p>
                <p className="text-xs text-muted-foreground">
                  Short form for print:{' '}
                  <span className="font-mono font-semibold text-foreground">
                    {hash.slice(0, 12)}
                  </span>{' '}
                  (first 12 characters — verify against the full value when you can)
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(hash)}
                    className="gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy checksum
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(verificationText)}
                    className="gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy verification note'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadNote} className="gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download note (.txt)
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">2. Verify a payload against a checksum</h2>
            <div className="space-y-1.5">
              <Label htmlFor="expected-hash">Expected SHA-256 checksum (64 hex characters)</Label>
              <Input
                id="expected-hash"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                inputMode="text"
              />
            </div>
            <Button variant="outline" onClick={verify}>
              Verify match
            </Button>
            {payload && verifyMessage && (
              <p
                className={`flex gap-2 text-sm rounded-lg p-3 ${verifyMessage.startsWith('MATCH') ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}
              >
                {verifyMessage.startsWith('MATCH') ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                {verifyMessage}
              </p>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">The code itself</h2>
            {payload && qrUrl ? (
              <img
                src={qrUrl}
                alt="QR code preview for the payload"
                className="w-56 h-56 mx-auto rounded-lg border"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Enter a payload to see its QR code.
              </p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">
              The checksum is deliberately not embedded in this QR code. Print the checksum
              separately — on the letter, label, or page that accompanies the code — so the
              recipient can compare two independent sources.
            </p>
          </Card>
        </div>
      </div>

      {/* After-tool AdSlot */}
      <AdSlot id="qr-checksum-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Using checksums to prove a printed QR code was not altered
        </h2>
        <p className="text-base leading-relaxed">
          A printed QR code has a simple vulnerability: anyone who can reprint it can change it. A
          checksum closes that gap for the recipient. The sender hashes the exact payload with
          SHA-256 and shares the checksum through a separate channel — a letter, an email, a second
          label. The recipient decodes the printed code, hashes what they decoded, and compares. If
          the two checksums match, the payload is byte-for-byte identical to what the sender hashed.
          If a single character differs — a swapped digit, a changed letter, an extra space — the
          checksum changes completely, and the mismatch is obvious.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-checksum-generator-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The separate channel is the whole point, and it is where checksum schemes usually fail. A
          checksum printed on the same label as the code, or embedded inside the payload itself,
          proves nothing: an attacker who replaces the code can replace the checksum alongside it.
          The checksum must travel independently of the code it protects. For a mailed ticket, the
          checksum goes in the letter while the code goes on the ticket. For a posted notice, the
          checksum lives on a page the owner controls while the code hangs on the wall. Two
          channels, one comparison.
        </p>
        <p className="text-base leading-relaxed">
          Exactness matters. A hash is computed over bytes, not over the general idea of the text.
          Trailing spaces, line breaks, capitalisation, and non-ASCII characters all change the
          result. That is why verification notes should reproduce the payload exactly, and why the
          recipient should hash the decoded text rather than retyping it from memory. Retyping
          invites transcription errors that produce a mismatch on a genuine code — and a
          verification system that cries wolf will soon be ignored.
        </p>
        <p className="text-base leading-relaxed">
          Know what a checksum does not prove. It proves integrity, not authorship. A matching
          checksum says the payload was not altered since it was hashed; it says nothing about who
          hashed it. If you need to prove who created the payload, you need a digital signature,
          where a private key signs the hash and anyone can verify it with the public key. Checksums
          answer &quot;was this changed?&quot;; signatures answer &quot;who wrote this?&quot;. Use
          the tool that matches the question.
        </p>
        <p className="text-base leading-relaxed">
          In practice, checksums shine in low-volume, high-trust workflows: tickets, certificates,
          inspection labels, and handover documents where a recipient has reason to check. Keep the
          workflow light — full checksum in the accompanying note, short checksum in print where
          space is tight, and a verification step that takes seconds. A check nobody performs is
          decoration; a check that takes seconds gets done.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="qr-checksum-generator-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Checksums
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
      <AdSlot id="qr-checksum-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
