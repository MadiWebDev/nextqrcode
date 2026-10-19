'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CreditCard } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'memberName', label: 'Member name', ph: 'Alex Rivera', kind: 'text' },
    { key: 'memberNumber', label: 'Member number', ph: 'MBR-0042', kind: 'text' },
    {
      key: 'tier',
      label: 'Tier',
      ph: '',
      kind: 'select',
      options: ['Standard', 'Silver', 'Gold', 'Platinum'],
    },
    { key: 'expiry', label: 'Expiry date', ph: '', kind: 'date' },
    { key: 'org', label: 'Organisation', ph: 'Riverside Fitness Club', kind: 'text' },
  ];

const DEFAULTS = { memberName: '', memberNumber: '', tier: 'Standard', expiry: '', org: '' };

function inputTypeFor(kind: string) {
  if (kind === 'number' || kind === 'date' || kind === 'datetime-local') return kind;
  return 'text';
}

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.memberName || '').trim()) return 'Enter the member name.';
    if (!(f.memberNumber || '').trim()) return 'Enter the member number.';
    if (!(f.expiry || '').trim()) return 'Enter the expiry date.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return (
      'MEMBERSHIP:ORG=' +
      (f.org || '') +
      ';ID=' +
      (f.memberNumber || '').trim() +
      ';TIER=' +
      f.tier +
      ';EXP=' +
      (f.expiry || '') +
      ';NAME=' +
      (f.memberName || '').trim()
    );
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
    a.download = 'membership-card-qr-generator.png';
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
    a.download = 'membership-card-qr-generator.svg';
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
      question: 'What does the QR code actually contain?',
      answer:
        'It contains a structured membership record: organisation, member number, tier, expiry, and member name. The payload is shown verbatim on this page so you can check it before printing.',
    },
    {
      question: 'How is this different from a loyalty card?',
      answer:
        'A loyalty card tracks stamps or points earned per visit. A membership card proves identity, tier, and a valid-until date. This tool is for the second case: who the member is, what tier they hold, and when it expires.',
    },
    {
      question: 'What happens when a membership expires?',
      answer:
        'The code still scans, but the expiry date in the payload tells your check-in system the membership is no longer valid. Your system should refuse expired cards. Issue a new code with the new expiry when the member renews.',
    },
    {
      question: 'Can members carry this on their phone?',
      answer:
        'Yes. The downloaded PNG works as a phone lock-screen image or wallet pass image, and the printed card works at the door. Either way, print the name and number in plain text beside the code as a fallback.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Membership Card QR Generator',
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
          { label: 'Membership Card QR Generator', href: '/membership-card-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Membership QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Membership Card QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a membership-card QR code with the member number, tier, and expiry, plus a card
          preview members can carry on their phone.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter the details</h2>
            {FIELDS.map((fd) => (
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
                    type={inputTypeFor(fd.kind)}
                    value={form[fd.key] || ''}
                    onChange={(e) => set(fd.key, e.target.value)}
                    placeholder={fd.ph}
                  />
                )}
              </div>
            ))}

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
              The payload is a structured membership record: organisation, member number, tier,
              expiry, and member name.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Membership Card QR</h2>
            <p className="text-sm text-muted-foreground">Scan to verify membership</p>
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

          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold">Membership card preview</h2>
            <p className="text-sm text-muted-foreground">What the member card looks like.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <div className="rounded-xl bg-slate-900 p-5 text-white">
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-widest opacity-70">
                    {form.org || 'Your organisation'}
                  </p>
                  <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-slate-900">
                    {form.tier}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold">{form.memberName || 'Member name'}</p>
                <p className="mt-1 font-mono text-sm tracking-widest opacity-90">
                  {form.memberNumber || 'MBR-NUMBER'}
                </p>
                <p className="mt-3 text-xs opacity-70">Expires: {form.expiry || 'Not set'}</p>
              </div>
            </div>
            <div className="space-y-1">
              {FIELDS.filter((fd) => (form[fd.key] || '').trim()).map((fd) => (
                <p key={fd.key} className="text-xs text-slate-700">
                  <span className="font-semibold">{fd.label}: </span>
                  {form[fd.key]}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="membership-card-qr-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Membership Card QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One card per member</h3>
        <p className="text-base leading-relaxed">
          Give every member their own card with their own member number. The QR code carries the
          number, tier, and expiry, and your check-in system matches it against the member record.
          Never issue two members the same number, and never print a card without an expiry: a card
          with no end date is a card you can never retire. When a member renews, issue a fresh code
          with the new expiry rather than editing the old one.
        </p>
        <AdSlot id="membership-card-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          Tier means something, or it means nothing
        </h3>
        <p className="text-base leading-relaxed">
          A tier on the card is a promise. If Gold members get guest passes or off-peak access,
          staff must be able to see that from the scan and honour it the same way every time. Decide
          the benefits per tier before printing, write them down where staff can find them, and keep
          the tier in your member system as the source of truth. The card shows the tier; the system
          decides what it unlocks.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Checking cards at the door</h3>
        <p className="text-base leading-relaxed">
          Test the full check-in flow with a sample card: scan it, confirm the member record opens,
          and confirm an expired card is refused. Print the member name and number in plain text
          beside the code so staff can verify a card even when the scanner is busy. Keep the quiet
          zone around the code and print dark modules on a light background with strong contrast,
          and test under the actual lighting at your entrance.
        </p>
      </article>

      <AdSlot id="membership-card-qr-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="membership-card-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
