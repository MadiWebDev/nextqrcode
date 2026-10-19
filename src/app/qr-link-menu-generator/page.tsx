'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Link2 } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'menuTitle', label: 'Menu title', ph: 'Your name or shop name', kind: 'text' },
    { key: 'menuUrl', label: 'Menu page URL', ph: 'https://example.com/links', kind: 'text' },
  ];

const DEFAULTS = { menuTitle: '', menuUrl: '' };

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
  const [links, setLinks] = useState([{ label: '', url: '' }]);
  const updateLink = (i: number, k: string, v: string) =>
    setLinks((prev) => prev.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  const addLink = () => setLinks((prev) => [...prev, { label: '', url: '' }]);
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, j) => j !== i));
  const validLinks = links.filter((l) => (l.label || '').trim() && isValidUrl(l.url || ''));
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!isValidUrl(f.menuUrl || '')) return 'Enter a valid menu page URL starting with https://.';
    for (const l of links) {
      if ((l.label || '').trim() && !isValidUrl(l.url || ''))
        return 'Each link with a label needs a valid URL.';
      if ((l.url || '').trim() && !(l.label || '').trim()) return 'Each link URL needs a label.';
    }
    return '';
  }, [form, links]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.menuUrl;
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
    a.download = 'qr-link-menu-generator.png';
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
    a.download = 'qr-link-menu-generator.svg';
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
        'It contains your menu page URL, exactly as shown in the encoded payload box. The links you list here are a preview of what that page should show. The code does not store the links themselves, so the page must exist and stay live.',
    },
    {
      question: 'How is this different from a single profile-link QR code?',
      answer:
        'A profile-link code opens one destination. This code opens a menu page with many links, so one printed code can send different scanners to different places. It suits creators and shops whose audience wants more than one option.',
    },
    {
      question: 'Can I change the links after printing?',
      answer:
        'Yes, if you edit the menu page itself. The printed code only stores the page address, so updating the links on that page changes what every printed copy leads to. Changing the page address would require reprinting.',
    },
    {
      question: 'Will this QR code work on iPhone and Android?',
      answer:
        'Yes. Modern iPhone and Android cameras read QR codes natively and open the menu page in the browser. Test on both platforms before a large print run if your audience is mixed.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Link Menu Generator',
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
          { label: 'QR Link Menu Generator', href: '/qr-link-menu-generator' },
        ]}
      />

      <AdSlot id="qr-link-menu-generator-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Link2 className="w-3.5 h-3.5" />
          <span>Creator QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Link Menu Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build a QR code that opens your link menu: one page where followers find every link that
          matters, from your shop and booking page to your newest post.
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
            <div className="space-y-3">
              <Label>Menu links</Label>
              {links.map((l, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={l.label}
                    onChange={(e) => updateLink(i, 'label', e.target.value)}
                    placeholder="Link label"
                    aria-label={`Link ${i + 1} label`}
                  />
                  <Input
                    value={l.url}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                    placeholder="https://..."
                    aria-label={`Link ${i + 1} URL`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLink(i)}
                    disabled={links.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addLink}>
                Add link
              </Button>
            </div>
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
              The QR encodes your menu page URL. The links listed here are the ones that page should
              show, so keep the page and this list in sync.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Link Menu QR</h2>
            <p className="text-sm text-muted-foreground">Scan to open the link menu</p>
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
            <h2 className="text-lg font-bold">Menu preview</h2>
            <p className="text-sm text-muted-foreground">
              What scanners see after opening your menu page.
            </p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-lg font-bold">{form.menuTitle || 'Your menu'}</p>
              <ul className="mt-3 space-y-2">
                {validLinks.map((l, i) => (
                  <li key={i}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg border px-3 py-2 text-sm font-medium text-blue-700 hover:underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                {validLinks.length === 0 && (
                  <li className="text-sm text-slate-500">Add links above to preview the menu.</li>
                )}
              </ul>
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

      <AdSlot id="qr-link-menu-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the QR Link Menu Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One code, every link</h3>
        <p className="text-base leading-relaxed">
          A link menu puts every destination you care about behind a single QR code. The code itself
          opens your menu page, and that page lists the links: shop, booking, newsletter, latest
          video, and anything else you want followers to reach. This works well on packaging,
          receipts, business cards, and market stalls, where one code is all the space you have.
          Keep the menu page address short and permanent, because every printed copy points at it.
        </p>

        <AdSlot id="qr-link-menu-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Order the links by value</h3>
        <p className="text-base leading-relaxed">
          Most scanners tap the first link they recognise, so put the action you want most at the
          top: booking for a service business, the shop for a maker, the newest release for a
          creator. Keep the list short. Five to seven links is a practical ceiling; beyond that,
          scanners start scrolling instead of tapping. Use plain labels that say what happens next,
          such as Book a table or Shop the collection, rather than clever names that need decoding.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size, stick it where it will actually live, and scan it with
          two different phones, one iPhone and one Android, in the real lighting. Check the whole
          journey, not just the scan: the menu page should load quickly, show the right links, and
          work without forcing an app install or a login. If any step fails, fix the page before
          reprinting the code. Keep the quiet zone around the code and print dark modules on a light
          background with strong contrast.
        </p>
      </article>

      <AdSlot id="qr-link-menu-generator-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-link-menu-generator-bottom" format="horizontal-banner" />

    </div>
  );
}
