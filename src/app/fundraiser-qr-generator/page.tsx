'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HeartHandshake } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'campaignTitle', label: 'Campaign title', ph: 'New Community Library', kind: 'text' },
    {
      key: 'campaignUrl',
      label: 'Campaign page URL',
      ph: 'https://example.com/fundraiser',
      kind: 'text',
    },
    { key: 'goalAmount', label: 'Goal amount', ph: '5000', kind: 'number' },
    { key: 'raisedAmount', label: 'Raised so far', ph: '1875', kind: 'number' },
    { key: 'deadline', label: 'Deadline', ph: '', kind: 'date' },
  ];

const DEFAULTS = {
  campaignTitle: '',
  campaignUrl: '',
  goalAmount: '',
  raisedAmount: '',
  deadline: '',
};

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
  const [nowStamp, setNowStamp] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowStamp(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  const progress = useMemo(() => {
    const goal = parseFloat(form.goalAmount || '0');
    const raised = parseFloat(form.raisedAmount || '0');
    const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;
    const daysLeft = form.deadline
      ? Math.max(0, Math.ceil((Date.parse(form.deadline) - nowStamp) / 86400000))
      : null;
    return { pct, raised, goal, remaining: Math.max(0, goal - raised), daysLeft };
  }, [form.goalAmount, form.raisedAmount, form.deadline, nowStamp]);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.campaignTitle || '').trim()) return 'Enter the campaign title.';
    if (!isValidUrl(f.campaignUrl || ''))
      return 'Enter a valid campaign page URL starting with https://.';
    if (!(f.goalAmount || '').trim() || Number(f.goalAmount) <= 0)
      return 'Enter a goal amount greater than zero.';
    if ((f.raisedAmount || '').trim() === '' || Number(f.raisedAmount) < 0)
      return 'Enter a raised amount of zero or more.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.campaignUrl;
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
    a.download = 'fundraiser-qr-generator.png';
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
    a.download = 'fundraiser-qr-generator.svg';
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
        'It contains your campaign page URL, exactly as shown in the encoded payload box. The goal, raised amount, and deadline are shown in the preview and belong on the campaign page, where they stay up to date as donations come in.',
    },
    {
      question: 'How is this different from a donation QR code?',
      answer:
        'A donation code typically opens a payment form with suggested amounts. This code opens a campaign page built around a goal, a raised total, a progress bar, and a deadline, so donors see how close the campaign is to its target.',
    },
    {
      question: 'Do I need to update the code as donations come in?',
      answer:
        'No. The code only stores the campaign page address. Update the raised total on the campaign page itself, and every printed copy will keep pointing at the current numbers.',
    },
    {
      question: 'What happens after the deadline?',
      answer:
        'The code still opens the campaign page. Update the page after the deadline with the final total and what happens next, rather than leaving a stale countdown and an open donate button.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fundraiser QR Generator',
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
          { label: 'Fundraiser QR Generator', href: '/fundraiser-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Fundraising QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Fundraiser QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code for a fundraiser campaign page with a goal, raised amount, and deadline,
          plus a progress bar that shows how close the campaign is.
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
              The QR encodes the campaign page URL. The goal, raised amount, and deadline are shown
              in the preview here and belong on the campaign page itself, where they stay up to
              date.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Fundraiser QR</h2>
            <p className="text-sm text-muted-foreground">Scan to support the campaign</p>
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
            <h2 className="text-lg font-bold">Campaign progress</h2>
            <p className="text-sm text-muted-foreground">What donors see on the campaign page.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-lg font-bold">{form.campaignTitle || 'Your campaign'}</p>
              <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: progress.pct + '%' }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {progress.pct.toFixed(1)}% of goal
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {progress.raised} raised of {progress.goal} goal. {progress.remaining} still to go.
              </p>
              {progress.daysLeft !== null && (
                <p className="mt-1 text-sm text-slate-600">
                  {progress.daysLeft === 0
                    ? 'Deadline is today.'
                    : progress.daysLeft + ' days left.'}
                </p>
              )}
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

      <AdSlot id="fundraiser-qr-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Fundraiser QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">Show real progress</h3>
        <p className="text-base leading-relaxed">
          Donors give more when they can see where the campaign stands. A progress bar turns an
          abstract goal into a visible gap that one more donation can close. Keep the numbers honest
          and current: the raised figure on your campaign page should match what you have actually
          received, and the preview here should be refreshed every time you print a new batch of
          posters. A progress bar that never moves looks abandoned, and an inflated one destroys
          trust when donors find out.
        </p>
        <AdSlot id="fundraiser-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Where the code belongs</h3>
        <p className="text-base leading-relaxed">
          Fundraiser codes work anywhere people feel generous in the moment: event tables,
          collection boxes, community noticeboards, school gates, and the bottom of a newsletter.
          Pair the code with one line that says what the money buys, such as Every 25 buys a shelf
          of books, because a concrete outcome beats a bare total. Keep the code large enough to
          scan from a comfortable standing distance.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size, stick it where it will actually live, and scan it with
          two different phones, one iPhone and one Android, in the real lighting. Check the whole
          journey: the campaign page should load quickly, show the right totals, and let someone
          donate without forcing an account. Keep the quiet zone around the code and print dark
          modules on a light background with strong contrast.
        </p>
      </article>

      <AdSlot id="fundraiser-qr-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="fundraiser-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
