'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MessageCircle } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS = [
  {
    key: 'phone',
    label: 'WhatsApp number (digits only, country code included)',
    ph: '15551234567',
    kind: 'text',
  },
  { key: 'product', label: 'Product', ph: 'Handmade ceramic mug', kind: 'text' },
  { key: 'qty', label: 'Quantity', ph: '1', kind: 'number' },
  {
    key: 'note',
    label: 'Note for the seller (optional)',
    ph: 'Please gift-wrap it',
    kind: 'textarea',
  },
];

const DEFAULTS = { phone: '', product: '', qty: '1', note: '' };

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    const digits = (f.phone || '').replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15)
      return 'Enter a WhatsApp number with 7–15 digits, country code included (digits only).';
    if (!(f.product || '').trim()) return 'Enter the product name.';
    const q = Number(f.qty);
    if (!Number.isFinite(q) || q < 1) return 'Enter a quantity of 1 or more.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    try {
      const digits = (f.phone || '').replace(/\D/g, '');
      const lines = [
        'Hello! I would like to place an order:',
        '',
        (f.qty || '1') + ' x ' + (f.product || '').trim(),
      ];
      if ((f.note || '').trim()) lines.push('', (f.note || '').trim());
      return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(lines.join('\n'));
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
    a.download = 'whatsapp-order-qr-generator.png';
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
    a.download = 'whatsapp-order-qr-generator.svg';
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
        'Scanning opens the destination with the details you entered already filled in or shown. The scanner reviews it before anything is sent or saved, so nothing happens silently.',
    },
    {
      question: 'Do buyers need my phone number saved to order?',
      answer:
        'No. The wa.me link opens a chat with the number in the code, so buyers do not need to save the number first. They do need WhatsApp installed and an internet connection.',
    },
    {
      question: 'Can I use this for more than one product?',
      answer:
        'Yes, but make one code per product. A code that names the exact product and quantity produces a clean, ready-to-send order; a generic code forces the buyer to type the details themselves.',
    },
    {
      question: 'Can I print this QR code on packaging and flyers?',
      answer:
        'Keep the quiet zone around the code, print dark modules on a light background with strong contrast, and use a size suited to the viewing distance \u2014 at least 2 cm wide for hand-held items and larger for posters. Always print a test copy and scan it in place before the full run.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WhatsApp Order QR Generator',
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
          { label: 'WhatsApp Order QR Generator', href: '/whatsapp-order-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Order QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          WhatsApp Order QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code that opens WhatsApp with a pre-filled order message — product, quantity
          and an optional note — so a buyer only has to press send.
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
              Encoded as a wa.me link with the order message pre-filled. Scanning opens WhatsApp
              with the message ready to send.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Order QR</h2>
            <p className="text-sm text-muted-foreground">Scan to open WhatsApp with this order</p>
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
              <div className="mt-3 text-left space-y-1">
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Product: </span>
                  {form.product}
                </p>
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Quantity: </span>
                  {form.qty}
                </p>
                {form.note.trim() && (
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Note: </span>
                    {form.note}
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
      <AdSlot id="whatsapp-order-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the WhatsApp Order QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">How this QR code works</h3>
        <p className="text-base leading-relaxed">
          This code stores a wa.me link: WhatsApp’s own short link format that opens a chat with a
          message already typed. The buyer scans, checks the order details, and presses send — they
          never have to type the product name or quantity themselves. Because the message is only
          pre-filled, the buyer can still edit it before sending, which keeps the order honest and
          avoids surprises.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Writing an order message that converts
        </h3>
        <p className="text-base leading-relaxed">
          Keep the message short and complete: quantity, product, and anything the seller needs to
          fulfil it, such as size, colour, or delivery area. Put the note to work for details that
          change the order, not for greetings or marketing copy. If you sell several products, make
          one code per product rather than one code that asks the buyer to type the product name —
          every extra step loses orders.
        </p>
        <AdSlot id="whatsapp-order-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size, stick it where it will actually live, and scan it with
          two different phones in the real lighting. Check the whole journey, not just the scan: the
          page that opens should load quickly and show the right content. If any step fails, fix the
          destination before reprinting the code.
        </p>
      </article>

      <AdSlot id="whatsapp-order-qr-generator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="whatsapp-order-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
