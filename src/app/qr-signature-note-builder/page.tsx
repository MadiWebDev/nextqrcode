'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PenLine, Copy, CheckCircle2, Download } from 'lucide-react';
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
    question: 'What is a signed-URL note?',
    answer:
      'A short document that travels with a QR code and lets the recipient verify it: the exact payload, its SHA-256 checksum, who issued it, and the steps to check it. The recipient compares the decoded payload against the note instead of trusting the printed code on its own.',
  },
  {
    question: 'Does a checksum prove who issued the QR code?',
    answer:
      'No. A checksum proves the payload was not altered since it was hashed; it says nothing about who hashed it. If authorship matters, the issuer should digitally sign the checksum with a private key, and the note should tell the recipient which public key to verify against.',
  },
  {
    question: 'How should the note reach the recipient?',
    answer:
      'Through a channel independent of the code itself: a letter, an email from a known address, or a page the issuer controls. A verification note printed on the same label as the code proves nothing, because anyone who replaces the code can replace the note alongside it.',
  },
  {
    question: 'What should the recipient do if the checksum does not match?',
    answer:
      'Stop. Do not open the link, enter credentials, or send money. Contact the issuer through a channel you already trust — a known phone number or address, not one printed on the suspicious item — and report the mismatch with the date, location, and a photo if it is safe to take one.',
  },
];

export default function QRSignatureNoteBuilderPage() {
  const [payload, setPayload] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [contact, setContact] = useState('');
  const [hash, setHash] = useState('');
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
    return () => {
      live = false;
    };
  }, [payload]);

  const note = useMemo(() => {
    return [
      'Signed QR code — verification note',
      '',
      `Issuer: ${issuer || '(name of the organisation or person who issued this code)'}`,
      `Issued: ${issuedDate || '(issue date)'}`,
      contact
        ? `Issuer contact: ${contact}`
        : 'Issuer contact: (a phone number or address the recipient already trusts)',
      '',
      'Payload (exact text encoded in the QR code):',
      payload || '(enter the payload)',
      '',
      `SHA-256 checksum of the payload: ${payload && hash ? hash : '(computed from the payload above)'}`,
      '',
      'How to verify:',
      '1. Scan the QR code with a scanner that shows the decoded text (do not open the link yet).',
      '2. Compare the decoded text with the Payload above, character for character.',
      '3. Hash the decoded text with SHA-256 (UTF-8) and compare the result with the checksum above.',
      '4. If both match, the code is identical to what the issuer produced. If either differs, stop and contact the issuer through a trusted channel.',
      '',
      'Important: this note proves the payload was not altered since it was hashed. It does not by itself prove who hashed it. If authorship matters, ask the issuer how the checksum was signed and which key to verify against.',
    ].join('\n');
  }, [payload, issuer, issuedDate, contact, hash]);

  const copyNote = async () => {
    await navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadNote = () => {
    const blob = new Blob([note], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-signature-note.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Signature Note Builder',
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
          { label: 'QR Signature Note Builder', href: '/qr-signature-note-builder' },
        ]}
      />

      <AdSlot id="qr-signature-note-builder-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <PenLine className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Signature Note Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build a signed-URL verification note: the exact payload, its real SHA-256 checksum
          computed in your browser, the issuer, and step-by-step instructions a recipient can follow
          to check the code. Send the note through a channel separate from the code.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Describe the signed code</h2>
            <div className="space-y-1.5">
              <Label htmlFor="sig-payload">Exact payload encoded in the QR code</Label>
              <Textarea
                id="sig-payload"
                rows={3}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/ticket/REF-99104
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sig-issuer">Issuer name</Label>
                <Input id="sig-issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
                <p className="text-[11px] text-muted-foreground">Example: Riverside Museum</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sig-date">Issue date</Label>
                <Input
                  id="sig-date"
                  type="date"
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sig-contact">Issuer contact the recipient already trusts</Label>
              <Input
                id="sig-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: A published phone number — not one printed on the suspicious item.
              </p>
            </div>
            {payload && hash && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  SHA-256 checksum (computed live)
                </p>
                <p className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{hash}</p>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Verification note</h2>
            <div className="rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-auto">
              {note}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={copyNote} className="gap-1.5">
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}{' '}
                {copied ? 'Copied!' : 'Copy note'}
              </Button>
              <Button size="sm" variant="outline" onClick={downloadNote} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download (.txt)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Send this note through a channel independent of the code — a letter, a known email
              address, or a page you control.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-signature-note-builder-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How a verification note makes a QR code checkable
        </h2>
        <p className="text-base leading-relaxed">
          A QR code asks for blind trust: the recipient cannot read it, so they trust the context
          around it. A verification note replaces blind trust with a check anyone can perform. The
          note carries three things: the exact payload, its checksum, and the steps to compare them.
          The recipient decodes the code without opening the link, compares the decoded text against
          the note, hashes it, and compares the checksum. Two matches mean the code is identical to
          what the issuer produced. Any mismatch means stop.
        </p>
        <p className="text-base leading-relaxed">
          The independent channel is the part that makes the scheme work. A note printed on the same
          label as the code, or handed over in the same envelope with no other connection to the
          issuer, proves nothing — an attacker who replaces the code can replace the note. The note
          must arrive through a route the attacker does not control: a letter from an address the
          recipient knows, an email from a familiar sender, a page on the issuer&apos;s own site.
          The check compares two independent sources, and independence is what gives the comparison
          its power.
        </p>

        <AdSlot id="qr-signature-note-builder-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Precision matters as much as independence. A hash is computed over bytes, so the payload
          in the note must match the payload in the code exactly — same capitalisation, same
          punctuation, no trailing space, no line-break difference. That is why this tool computes
          the checksum from the payload you type, rather than letting you type a checksum from
          memory. When the recipient checks, they should hash the decoded text directly, not retype
          it: retyping introduces errors that produce false mismatches, and a verification system
          that cries wolf will soon be ignored.
        </p>
        <p className="text-base leading-relaxed">
          Be clear about what the note does not prove. A checksum proves integrity — the payload was
          not altered since it was hashed. It does not prove authorship. If the recipient needs to
          know who issued the code, the issuer must sign the checksum with a private key, and the
          note must say which public key verifies the signature. Many workflows do not need that: a
          ticket, a certificate, or a handover document where the recipient already knows the issuer
          only needs integrity. Use signatures when authorship is the question, and say so in the
          note.
        </p>
        <p className="text-base leading-relaxed">
          Keep the recipient&apos;s side of the workflow light. Four steps, plain language, no
          jargon, and a clear instruction for the mismatch case: stop, and contact the issuer
          through a trusted channel. A verification note that takes a minute to follow will be
          followed. One that reads like a security manual will be skipped — and a skipped check
          protects nobody.
        </p>
      </article>

      <AdSlot id="qr-signature-note-builder-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Signature Notes
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

      <AdSlot id="qr-signature-note-builder-bottom" format="horizontal-banner" />

    </div>
  );
}
