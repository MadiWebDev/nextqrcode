'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'platform', label: 'Platform', ph: '', kind: 'select', options: ['iOS', 'Android'] },
    { key: 'appName', label: 'App name', ph: 'My App', kind: 'text' },
    {
      key: 'appId',
      label: 'App ID (iOS) / package name (Android)',
      ph: '1234567890 or com.example.app',
      kind: 'text',
    },
  ];

const DEFAULTS = { platform: 'iOS', appName: '', appId: '' };

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
    if (!(f.appId || '').trim()) return 'Enter the app ID or package name.';
    if (f.platform === 'iOS' && !/^\d+$/.test((f.appId || '').trim()))
      return 'For iOS, the App ID is the number in the App Store URL.';
    if (
      f.platform === 'Android' &&
      !/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i.test((f.appId || '').trim())
    )
      return 'For Android, enter the package name, for example com.example.app.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    if (f.platform === 'iOS')
      return 'https://apps.apple.com/app/id' + (f.appId || '').trim() + '?action=write-review';
    return (
      'https://play.google.com/store/apps/details?id=' +
      encodeURIComponent((f.appId || '').trim()) +
      '&showAllReviews=true'
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
    a.download = 'app-review-link-qr-generator.png';
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
    a.download = 'app-review-link-qr-generator.svg';
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
        'Scanning opens the app store page for your app. On iOS the link includes action=write-review, which opens the review sheet directly. On Android it opens the Play listing, where the scanner taps to write a review.',
    },
    {
      question: 'Where do I find my iOS App ID?',
      answer:
        "Open your app's App Store page in a browser. The URL ends in /id followed by a number. That number is the App ID. Paste it here and the tool builds the review URL for you.",
    },
    {
      question: 'Where do I find my Android package name?',
      answer:
        "It is the applicationId in your app's build configuration, and it appears in the Play Store URL after id=. It looks like com.example.app. Enter it exactly, including the dots.",
    },
    {
      question: 'Will this QR code work on iPhone and Android?',
      answer:
        'The code itself scans on both. An iOS review link opens best on an iPhone and an Android link on an Android phone, so print the code for the platform your audience actually uses, or print one code per platform.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'App Review Link QR Generator',
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
          { label: 'App Review Link QR Generator', href: '/app-review-link-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Star className="w-3.5 h-3.5" />
          <span>App QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          App Review Link QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code that opens your app&apos;s store review sheet directly, so happy users
          can leave a rating without hunting for the listing.
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
              For iOS the payload is the App Store review URL with action=write-review. For Android
              it is the Play listing URL, which opens the store page where the review sheet lives.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">App Review QR</h2>
            <p className="text-sm text-muted-foreground">Scan to rate the app</p>
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
            <h2 className="text-lg font-bold">Review link preview</h2>
            <p className="text-sm text-muted-foreground">What scanners reach after scanning.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-lg font-bold">{form.appName || 'Your app'}</p>
              <p className="mt-1 text-sm text-slate-600">Platform: {form.platform}</p>
              <p className="mt-1 text-sm text-slate-600">
                Store ID: {(form.appId || '').trim() || 'Not entered yet'}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Scanning opens the store review sheet for this app, so the scanner can leave a
                rating and a review.
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

      <AdSlot id="app-review-link-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the App Review Link QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">Where to find the App ID</h3>
        <p className="text-base leading-relaxed">
          For iOS, the App ID is the number at the end of your App Store listing URL, after id. Open
          your listing in a browser, copy that number, and paste it here. For Android, the package
          name is the applicationId in your app build configuration, and it also appears in the Play
          Store URL after id=. The tool checks the shape of each one before generating the code, so
          a typo is caught here rather than on a printed card.
        </p>

        <AdSlot id="app-review-link-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">Ask at the right moment</h3>
        <p className="text-base leading-relaxed">
          A review code works best right after something went well: after a completed order, a
          finished lesson, or a support chat that ended happily. Print it on receipts, packing
          slips, and in-app thank-you screens. Pair the code with one honest line, such as Enjoying
          the app? A quick rating helps. Never offer rewards for positive reviews: both stores
          prohibit incentivised ratings, and a review that reads as bought helps nobody.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size and scan it with two different phones. Confirm the store
          page that opens is your app, that the review sheet is reachable, and that the page loads
          without forcing a login the scanner may not have. Keep the quiet zone around the code and
          print dark modules on a light background with strong contrast. If the listing moves or the
          app is renamed, the ID stays the same, so existing codes keep working.
        </p>
      </article>

      <AdSlot id="app-review-link-qr-generator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="app-review-link-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
