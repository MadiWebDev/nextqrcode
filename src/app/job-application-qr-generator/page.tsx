'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Briefcase } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'jobTitle', label: 'Job title', ph: 'Barista', kind: 'text' },
    { key: 'company', label: 'Company', ph: 'Riverside Coffee Co.', kind: 'text' },
    { key: 'location', label: 'Location', ph: 'Riverside, onsite', kind: 'text' },
    { key: 'jobRef', label: 'Job reference (optional)', ph: 'RC-2026-08', kind: 'text' },
    {
      key: 'applyUrl',
      label: 'Application form URL',
      ph: 'https://example.com/careers/apply',
      kind: 'text',
    },
  ];

const DEFAULTS = { jobTitle: '', company: '', location: '', jobRef: '', applyUrl: '' };

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
    if (!(f.jobTitle || '').trim()) return 'Enter the job title.';
    if (!(f.company || '').trim()) return 'Enter the company name.';
    if (!isValidUrl(f.applyUrl || ''))
      return 'Enter a valid application form URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.applyUrl;
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
    a.download = 'job-application-qr-generator.png';
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
    a.download = 'job-application-qr-generator.svg';
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
        'It contains the application form URL exactly as you entered it. The job title, company, and reference are shown in the preview and belong on the posting itself.',
    },
    {
      question: 'Should the application form work on a phone?',
      answer:
        'Yes. Most candidates scan on a phone, so the form must work on a small screen without an app install. Test it yourself on a phone before the posting goes up.',
    },
    {
      question: 'What happens when the role is filled?',
      answer:
        'The code still opens the form until you take the posting down. Remove printed postings when the role fills, and update the application page to say the role is closed.',
    },
    {
      question: 'Will this QR code work on iPhone and Android?',
      answer:
        'Yes. Modern iPhone and Android cameras read QR codes natively and open the application form in the browser. Test on both platforms before a large print run if your audience is mixed.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Job Application QR Generator',
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
          { label: 'Job Application QR Generator', href: '/job-application-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Hiring QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Job Application QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code on a job posting that opens the application form, plus a job card with
          the title, company, and location.
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
              The QR encodes the application form URL exactly as entered. The job title, company,
              and reference are shown in the preview here and belong on the posting itself.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Job Application QR</h2>
            <p className="text-sm text-muted-foreground">Scan to apply for this job</p>
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
            <h2 className="text-lg font-bold">Job card</h2>
            <p className="text-sm text-muted-foreground">What candidates check before applying.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-xl font-bold">{form.jobTitle || 'Job title'}</p>
              <p className="mt-1 text-sm text-slate-600">{form.company || 'Company'}</p>
              {form.location && (
                <p className="mt-1 text-sm text-slate-600">Location: {form.location}</p>
              )}
              {form.jobRef && (
                <p className="mt-1 text-sm text-slate-600">Reference: {form.jobRef}</p>
              )}
              <p className="mt-3 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Scan to apply
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

      <AdSlot id="job-application-qr-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Job Application QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">Postings people can act on</h3>
        <p className="text-base leading-relaxed">
          A job posting on a noticeboard, a shop window, or a careers-fair table is only useful if
          the reader can apply on the spot. The code opens the application form directly, so a
          candidate who is interested while standing in front of the poster can start applying
          before the moment passes. Pair the code with the job title, company, location, and
          reference in plain text, so the posting works even for someone who does not scan.
        </p>
        <AdSlot id="job-application-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Keep the form short</h3>
        <p className="text-base leading-relaxed">
          Most candidates scan on a phone, standing up, with little patience. If the application
          form asks for a full work history and a cover letter before it even says what the job
          pays, most scanners will close it. Put the essentials first: name, contact, availability,
          and a CV upload. Everything else can wait for the interview. Test the form on a phone
          yourself before the posting goes up.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Close the loop when the role fills
        </h3>
        <p className="text-base leading-relaxed">
          Take the posting down the moment the role is filled, and update the application page to
          say so. A printed code keeps working until it is removed, and nothing wastes a
          candidate&apos;s time like applying for a job that closed last month. Scan a sample before
          printing, confirm the form that opens is the right role with the right reference, and keep
          the quiet zone around the code.
        </p>
      </article>

      <AdSlot id="job-application-qr-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="job-application-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
