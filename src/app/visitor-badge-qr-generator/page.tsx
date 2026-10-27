'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BadgeCheck } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS = [
  { key: 'visitorName', label: 'Visitor name', ph: 'Jordan Lee', kind: 'text' },
  { key: 'hostName', label: 'Host name', ph: 'Priya Shah', kind: 'text' },
  { key: 'company', label: 'Company / organisation', ph: 'Acme Ltd', kind: 'text' },
  { key: 'expiry', label: 'Valid until', ph: '', kind: 'date' },
  { key: 'purpose', label: 'Purpose of visit (optional)', ph: 'Supplier meeting', kind: 'text' },
];

const DEFAULTS = { visitorName: '', hostName: '', company: '', expiry: '', purpose: '' };

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.visitorName || '').trim()) return 'Enter the visitor name.';
    if (!(f.hostName || '').trim()) return 'Enter the host name.';
    if (!(f.expiry || '').trim()) return 'Enter the date the badge is valid until.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    try {
      const lines = [
        'VISITOR BADGE',
        'Visitor: ' + (f.visitorName || '').trim(),
        'Host: ' + (f.hostName || '').trim(),
      ];
      if ((f.company || '').trim()) lines.push('Company: ' + (f.company || '').trim());
      lines.push('Valid until: ' + (f.expiry || '').trim());
      if ((f.purpose || '').trim()) lines.push('Purpose: ' + (f.purpose || '').trim());
      return lines.join('\n');
    } catch {
      return '';
    }
  }, [form, error]);

  useEffect(() => {
    let live = true;
    if (!payload) return;
    QRCodeLib.toDataURL(payload, { width: 512, margin: 2, errorCorrectionLevel: 'M' })
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

  const downloadPng = () => {
    if (!payload || !qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'visitor-badge-qr-generator.png';
    a.click();
  };
  const downloadSvg = async () => {
    if (!payload) return;
    const svg = await QRCodeLib.toString(payload, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitor-badge-qr-generator.svg';
    a.click();
    URL.revokeObjectURL(url);
  };
  const copyPayload = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What happens when someone scans this QR code?',
      answer:
        'Scanning shows the badge details as plain text: visitor, host, company, purpose, and expiry. Any phone camera can read it, with no special app.',
    },
    {
      question: 'How is this different from a bulk event badge?',
      answer:
        'Bulk event badges generate many codes at once for an attendee list. This tool makes one badge for one visitor, with a host and an expiry, which is what an office front desk needs.',
    },
    {
      question: 'Should the badge expire?',
      answer:
        'Yes. Every badge should carry a valid-until date, and multi-day visits should get a fresh badge each day. An open-ended badge is an open-ended invitation.',
    },
    {
      question: 'Can I print this QR code on a badge?',
      answer:
        'Yes. Print on card, keep the code at least 2 cm wide, and keep the visitor name and expiry readable as text so the badge works even without a scan.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Visitor Badge QR Generator',
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
          { label: 'Visitor Badge QR Generator', href: '/visitor-badge-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <BadgeCheck className="w-3.5 h-3.5" />
          <span>Office QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Visitor Badge QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a single visitor-badge QR with visitor, host, and expiry on it, plus a badge
          preview. Front desk staff can scan it to check who the visitor is here to see.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter the details</h2>
            {FIELDS.map(
              (fd: {
                key: string;
                label: string;
                ph: string;
                kind: string;
                options?: string[];
              }) => (
                <div key={fd.key} className="space-y-2">
                  <Label htmlFor={fd.key}>{fd.label}</Label>
                  {fd.kind === 'textarea' ? (
                    <textarea
                      id={fd.key}
                      value={form[fd.key] || ''}
                      onChange={(e) => set(fd.key, e.target.value)}
                      placeholder={fd.ph}
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  ) : fd.kind === 'select' ? (
                    <select
                      id={fd.key}
                      value={form[fd.key] || ''}
                      onChange={(e) => set(fd.key, e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {(fd.options || []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={fd.key}
                      type={
                        fd.kind === 'number'
                          ? 'number'
                          : fd.kind === 'datetime-local' || fd.kind === 'date'
                            ? fd.kind
                            : 'text'
                      }
                      value={form[fd.key] || ''}
                      onChange={(e) => set(fd.key, e.target.value)}
                      placeholder={fd.ph}
                    />
                  )}
                </div>
              )
            )}
            <div className="space-y-2">
              <Label>QR preview size: {qrSize}px</Label>
              <Slider
                value={[qrSize]}
                min={140}
                max={320}
                step={10}
                onValueChange={([v]) => setQrSize(v)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </Card>

          <Card className="p-6 border-border/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold">Encoded payload</h2>
            <p className="text-xs text-muted-foreground">
              This is exactly what the QR code contains. Check it before printing.
            </p>
            <pre className="whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs font-mono">
              {payload || 'Fill in the fields above to generate the payload.'}
            </pre>
            <p className="text-xs text-muted-foreground">
              Encoded as plain text with the badge details. Any QR scanner can read it — no special
              app is needed.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Visitor Badge</h2>
            <p className="text-sm text-muted-foreground">Scan to see the badge details</p>
            <div className="rounded-xl bg-white p-4 text-center border">
              {payload && qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt="Generated QR code"
                  style={{ width: qrSize, height: qrSize }}
                  className="mx-auto"
                />
              ) : (
                <div
                  className="flex items-center justify-center text-sm text-muted-foreground"
                  style={{ height: qrSize }}
                >
                  Enter valid details to generate your QR code.
                </div>
              )}
              <div className="mt-3 text-left space-y-1 border-t-4 border-primary pt-2">
                <p className="text-xs font-bold tracking-widest text-primary">VISITOR</p>
                <p className="text-base font-bold text-slate-900">{form.visitorName}</p>
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Host: </span>
                  {form.hostName}
                </p>
                {form.company.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Company: </span>
                    {form.company}
                  </p>
                )}
                {form.purpose.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Purpose: </span>
                    {form.purpose}
                  </p>
                )}
                {form.expiry && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Valid until: </span>
                    {new Date(form.expiry + 'T00:00:00').toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadPng} disabled={!payload || !qrUrl} className="text-xs">
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={downloadSvg}
                disabled={!payload}
                className="text-xs"
              >
                Download SVG
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG is best for everyday printing. SVG stays sharp at poster and banner sizes.
            </p>
          </Card>
        </div>
      </div>
      <AdSlot id="visitor-badge-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Visitor Badge QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this QR code works</h3>
        <p className="text-base leading-relaxed">
          This code stores the badge details as plain text: visitor, host, company, purpose, and
          expiry. Anyone at reception can scan it with an ordinary phone camera and see who the
          visitor is here to see and how long the badge lasts. Print the same details as readable
          text on the badge too, so it still works if the code is damaged.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Designing a badge that front desk can trust
        </h3>
        <p className="text-base leading-relaxed">
          A badge earns trust when the expiry is impossible to miss. Put the valid-until date in
          large type and the host name right under the visitor name, so reception can confirm the
          visit with one glance. For multi-day visits, issue a fresh badge each day rather than
          stretching one badge across the week.
        </p>
        <AdSlot id="visitor-badge-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print the badge at its real size, clip it to a lanyard, and scan it at the distance a
          receptionist stands from a visitor. Check the text stays readable after a day of wear, and
          confirm the expiry date prints exactly as entered.
        </p>
      </article>

      <AdSlot id="visitor-badge-qr-generator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="visitor-badge-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
