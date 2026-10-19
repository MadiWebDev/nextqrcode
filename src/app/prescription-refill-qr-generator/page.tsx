'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Pill } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'pharmacyName', label: 'Pharmacy name', ph: 'Riverside Pharmacy', kind: 'text' },
    { key: 'rxNumber', label: 'Prescription (Rx) number', ph: 'RX-884102', kind: 'text' },
    {
      key: 'refillUrl',
      label: 'Refill page URL',
      ph: 'https://example.com/pharmacy/refill',
      kind: 'text',
    },
    { key: 'medication', label: 'Medication (optional)', ph: 'Atorvastatin 20mg', kind: 'text' },
  ];

const DEFAULTS = { pharmacyName: '', rxNumber: '', refillUrl: '', medication: '' };

function withParam(url: string, key: string, value: string) {
  try {
    const u = new URL(url);
    u.searchParams.set(key, value);
    return u.href;
  } catch {
    return '';
  }
}

function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

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
    if (!(f.pharmacyName || '').trim()) return 'Enter the pharmacy name.';
    if (!(f.rxNumber || '').trim()) return 'Enter the prescription (Rx) number.';
    if (!isValidUrl(f.refillUrl || ''))
      return 'Enter a valid refill page URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return withParam(f.refillUrl, 'rx', (f.rxNumber || '').trim());
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
    a.download = 'prescription-refill-qr-generator.png';
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
    a.download = 'prescription-refill-qr-generator.svg';
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
        'It contains your refill page URL with the Rx number added as an rx query parameter. The payload is shown verbatim on this page so you can check it before printing.',
    },
    {
      question: 'Does the code contain medication details?',
      answer:
        'Only if you put the medication name in the optional field, and the code itself only carries the refill link and the Rx number. The refill page should confirm the prescription from its own records after the scan. Keep printed health details minimal.',
    },
    {
      question: 'Does scanning the code submit a refill?',
      answer:
        'No. Scanning only opens the refill page for that prescription. The patient still reviews the prescription and confirms the refill. Nothing is ordered silently.',
    },
    {
      question: 'What if a patient loses the label?',
      answer:
        'Anyone with the code could open the refill page for that Rx number, so treat printed labels like other prescription paperwork. Your refill page should still require the patient to confirm identity before submitting.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Prescription Refill QR Generator',
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
          { label: 'Prescription Refill QR Generator', href: '/prescription-refill-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Pill className="w-3.5 h-3.5" />
          <span>Pharmacy QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Prescription Refill QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code to refill a prescription, carrying the pharmacy and Rx number, plus a
          refill card patients can scan from the label.
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
              The payload is your refill page URL with the Rx number added as an rx query parameter,
              so the page opens on this prescription&apos;s refill flow.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Prescription Refill QR</h2>
            <p className="text-sm text-muted-foreground">Scan to refill this prescription</p>
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
            <h2 className="text-lg font-bold">Refill card</h2>
            <p className="text-sm text-muted-foreground">
              What the patient checks before refilling.
            </p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                {form.pharmacyName || 'Pharmacy'}
              </p>
              <p className="mt-2 text-lg font-bold">Prescription refill</p>
              <p className="mt-1 font-mono text-sm tracking-wide">Rx: {form.rxNumber || '—'}</p>
              {form.medication && (
                <p className="mt-1 text-sm text-slate-600">Medication: {form.medication}</p>
              )}
              <p className="mt-3 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Scan to refill
              </p>
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

      {/* After-tool AdSlot */}
      <AdSlot id="prescription-refill-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Prescription Refill QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One scan instead of a phone call</h3>
        <p className="text-base leading-relaxed">
          Refills by phone mean spelling out an Rx number, waiting on hold, and hoping both sides
          heard the digits right. A refill code carries the Rx number, so the scan opens the refill
          flow for that prescription directly. Print it on the prescription label or the bag
          receipt, with the pharmacy name and Rx number in plain text beside it. Patients refill on
          time more often when refilling takes seconds, and pharmacies field fewer calls about the
          same task.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="prescription-refill-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Keep health details minimal</h3>
        <p className="text-base leading-relaxed">
          The code carries only the refill link and the Rx number. It does not need to carry the
          medication name, the dosage, or anything else about the patient, and the medication field
          here is optional for exactly that reason. Your refill page should confirm the prescription
          from its own records after the scan, and it should ask the patient to confirm the
          medication before submitting. A printed label can be lost or photographed, so the less it
          reveals, the better.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before labels go out</h3>
        <p className="text-base leading-relaxed">
          Print a sample label, scan it, and walk through a real refill for a test prescription,
          confirming the right prescription opens and the refill is recorded. Test a printed copy as
          well as the screen version, because most patients scan from paper. Keep the quiet zone
          around the code and print dark modules on a light background with strong contrast, and
          check the label survives the bag it travels in.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="prescription-refill-qr-generator-pre-related" format="horizontal-banner" />

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

      {/* Bottom AdSlot */}
      <AdSlot id="prescription-refill-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
