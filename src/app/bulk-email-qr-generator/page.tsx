'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Mail } from 'lucide-react';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';

export default function BulkEmailQRGeneratorPage() {
  const [raw, setRaw] = useState(
    'support@example.com | Question about order 1234 | Hi team, I have a question about my order.\nsales@example.com | Request a quote | Hello, please send a quote for:'
  );
  const [items, setItems] = useState<Array<{ label: string; payload: string; dataUrl: string }>>(
    []
  );
  const [invalid, setInvalid] = useState<string[]>([]);
  const [parseError, setParseError] = useState('');
  const [busy, setBusy] = useState(false);

  const parseRows = () => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const ok: Array<{ label: string; payload: string }> = [];
    const bad: string[] = [];
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    lines.forEach((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const email = parts[0] || '';
      const subject = parts[1] || '';
      const body = parts.slice(2).join('|');
      if (!emailRe.test(email)) {
        bad.push(line);
        return;
      }
      const params = new URLSearchParams();
      if (subject) params.set('subject', subject);
      if (body) params.set('body', body);
      const qs = params.toString();
      ok.push({ label: email, payload: `mailto:${email}${qs ? `?${qs}` : ''}` });
    });
    return { ok, bad };
  };

  const generate = async () => {
    setParseError('');
    const { ok, bad } = parseRows();
    setInvalid(bad);
    if (ok.length === 0) {
      setParseError('No valid rows found. Check the format and try again.');
      setItems([]);
      return;
    }
    if (ok.length > 500) {
      setParseError('Limit is 500 rows per batch. Split larger lists into multiple batches.');
      return;
    }
    setBusy(true);
    try {
      const out: Array<{ label: string; payload: string; dataUrl: string }> = [];
      for (const row of ok) {
        const dataUrl = await QRCodeLib.toDataURL(row.payload, {
          errorCorrectionLevel: 'M',
          width: 512,
          margin: 2,
        });
        out.push({ ...row, dataUrl });
      }
      setItems(out);
    } catch {
      setParseError('Generation failed. Check that every payload is valid and try again.');
    } finally {
      setBusy(false);
    }
  };
  const downloadZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();
    const seen = new Set<string>();
    items.forEach((it, i) => {
      const base =
        it.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60) || 'qr';
      let name = `${String(i + 1).padStart(3, '0')}-${base}.png`;
      let n = 1;
      while (seen.has(name)) {
        n += 1;
        name = `${String(i + 1).padStart(3, '0')}-${base}-${n}.png`;
      }
      seen.add(name);
      zip.file(name, it.dataUrl.split(',')[1], { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: 'What format do the rows need?',
      answer:
        'One row per line: email | subject | body, using the vertical bar as the separator. Subject and body are optional; the address is required and must look like a valid email address.',
    },
    {
      question: 'What payload does an email QR code contain?',
      answer:
        'A mailto: link with the address and, when provided, subject and body as URL-encoded parameters. Scanning opens the mail app with everything prefilled.',
    },
    {
      question: 'Does validation check that the mailbox exists?',
      answer:
        'No. It checks the shape of the address, not whether the mailbox is real. Confirm addresses against your own directory before a large print run.',
    },
    {
      question: 'Are email QR codes good for urgent contact?',
      answer:
        'Not usually. Email is asynchronous, so urgent matters deserve a phone number. Email codes are best for support, quotes, warranty claims, feedback, and anything where a structured written message helps.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk Email QR Generator',
    applicationCategory: 'DesignApplication',
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
          { label: 'Bulk Email QR Generator', href: '/bulk-email-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk Email QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate many email QR codes at once from pasted address, subject, and body rows —
          validated, previewed, and downloaded as a ZIP of PNG files.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your rows</h2>
            <p className="text-xs text-muted-foreground">
              One row per line: email | subject | body, using the | separator. Subject and body are
              optional, but at least an address is required.
            </p>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={10}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={busy}>
                {busy ? 'Generating…' : 'Generate QR codes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRaw(
                    'support@example.com | Question about order 1234 | Hi team, I have a question about my order.\nsales@example.com | Request a quote | Hello, please send a quote for:'
                  );
                }}
              >
                Load sample rows
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRaw('');
                  setItems([]);
                }}
              >
                Clear
              </Button>
            </div>
            {parseError && <p className="text-sm text-red-600">{parseError}</p>}
            {invalid.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                <p className="font-semibold text-amber-700">
                  {invalid.length} row(s) skipped — fix and re-generate:
                </p>
                <ul className="list-disc pl-5 mt-1 text-amber-800">
                  {invalid.slice(0, 10).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm text-muted-foreground">
              {items.length > 0
                ? `${items.length} QR code(s) ready.`
                : 'Generate to see a preview grid and download a ZIP.'}
            </p>
            {items.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {items.slice(0, 12).map((it, i) => (
                    <div key={i} className="rounded-lg border p-2 text-center">
                      <img src={it.dataUrl} alt={it.label} className="w-full h-auto" />
                      <p className="text-[10px] text-muted-foreground truncate mt-1">{it.label}</p>
                    </div>
                  ))}
                </div>
                {items.length > 12 && (
                  <p className="text-xs text-muted-foreground">
                    Showing first 12 of {items.length}. The ZIP contains all of them.
                  </p>
                )}
                <Button onClick={downloadZip} className="w-full">
                  Download ZIP of PNGs
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Email QR Codes for Whole Teams and Campaigns
        </h2>
        <p className="text-base leading-relaxed">
          An email QR code opens the scanner&apos;s mail app with the address, subject, and body
          already filled in. For the customer, that removes the most error-prone step in contacting
          a business: typing an address from a sign. For a business, a batch of them covers every
          department, branch, or campaign with one consistent mechanism. Generating that batch by
          hand is slow and invites typos in the one field that matters most — the address. Bulk
          generation takes a pasted table and produces the whole set in one pass, with validation
          that catches malformed addresses before they reach print.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Writing rows that survive validation
        </h3>
        <p className="text-base leading-relaxed">
          Each line is an address, a vertical bar, a subject, another bar, and a body. The tool
          checks the address shape — characters, an at-sign, a domain, a dot — and reports lines
          that fail. Validation checks shape, not existence: it cannot tell whether a mailbox is
          real, so confirm the addresses against your own directory before a large run. Keep
          subjects short and specific, because the subject is what your team will sort and search by
          later. A subject like Question about order 1234 is useful; a subject like Feedback is not.
          In the body, prefill only what genuinely helps the sender — a greeting, a prompt, a
          reference label — and leave room for the person to write.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Where email codes earn their place
        </h3>
        <p className="text-base leading-relaxed">
          They shine anywhere a person needs to send a structured message: support desks, warranty
          claims, quote requests, feedback forms that deserve more than a star rating, and event
          RSVPs. They are less suited to urgent contact, because email is asynchronous — a customer
          with a leaking pipe needs a phone number, not a compose window. For each placement, ask
          what the sender gets: a prefilled subject that routes the message to the right queue is a
          real benefit, and it is worth saying so on the sign. A code with no explanation of what
          happens next gets scanned less, and answered less, than one with a single honest line
          beside it.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Before you print the batch</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            Scan a sample code on iPhone and Android and confirm the address, subject, and body
            prefill.
          </li>
          <li>
            Send a test email from the scanned code to confirm it reaches the right inbox and
            filters.
          </li>
          <li>
            Keep subjects consistent so incoming mail can be filtered and routed automatically.
          </li>
          <li>Keep a copy of the source list with the job file for reprints and corrections.</li>
          <li>Split lists over 500 rows into multiple batches and label each ZIP.</li>
        </ul>
        <p className="text-base leading-relaxed">
          A well-run batch of email codes turns a wall of contact details into a single gesture:
          point, scan, send.
        </p>
      </article>
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
    </div>
  );
}
