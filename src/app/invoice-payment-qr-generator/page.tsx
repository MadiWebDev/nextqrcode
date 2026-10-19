'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ReceiptText } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'invoiceNumber', label: 'Invoice number', ph: 'INV-2026-0147', kind: 'text' },
    { key: 'amount', label: 'Amount', ph: '240', kind: 'number' },
    {
      key: 'currency',
      label: 'Currency',
      ph: '',
      kind: 'select',
      options: ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED'],
    },
    { key: 'payUrl', label: 'Payment page URL', ph: 'https://example.com/pay', kind: 'text' },
    { key: 'dueDate', label: 'Due date', ph: '', kind: 'date' },
    { key: 'billTo', label: 'Bill to', ph: 'Riverside Cafe Ltd', kind: 'text' },
  ];

const DEFAULTS = {
  invoiceNumber: '',
  amount: '',
  currency: 'USD',
  payUrl: '',
  dueDate: '',
  billTo: '',
};

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
    if (!(f.invoiceNumber || '').trim()) return 'Enter the invoice number.';
    if (!(f.amount || '').trim() || Number(f.amount) <= 0)
      return 'Enter an amount greater than zero.';
    if (!isValidUrl(f.payUrl || ''))
      return 'Enter a valid payment page URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    const withInv = withParam(f.payUrl, 'invoice', (f.invoiceNumber || '').trim());
    return withParam(withInv, 'amount', (f.amount || '').trim());
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
    a.download = 'invoice-payment-qr-generator.png';
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
    a.download = 'invoice-payment-qr-generator.svg';
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
        'It contains your payment page URL with the invoice number and amount added as query parameters. The payload is shown verbatim on this page so you can check it before printing.',
    },
    {
      question: 'Does scanning the code charge the payer?',
      answer:
        'No. Scanning only opens the payment page. The payer still reviews the invoice and confirms the payment. Your payment page should show the amount from your own invoice records, not just the amount carried in the code.',
    },
    {
      question: 'What if the payer edits the amount in the URL?',
      answer:
        'Your payment page must look up the invoice by number and charge the amount from your own records. Treat the amount in the code as a cross-check, and refuse the payment if the two disagree.',
    },
    {
      question: 'Can I use this on emailed invoices too?',
      answer:
        'Yes. The code works on a PDF or an emailed invoice exactly as on paper. The payer scans it from the screen or the printout and lands on the same payment page.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Invoice Payment QR Generator',
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
          { label: 'Invoice Payment QR Generator', href: '/invoice-payment-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ReceiptText className="w-3.5 h-3.5" />
          <span>Billing QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Invoice Payment QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code printed on an invoice that opens payment for that invoice, plus an
          invoice summary the payer can check at a glance.
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
              The payload is your payment page URL with the invoice number and amount added as query
              parameters, so the payer lands on the right invoice with the right amount.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Invoice Payment QR</h2>
            <p className="text-sm text-muted-foreground">Scan to pay this invoice</p>
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
            <h2 className="text-lg font-bold">Invoice summary</h2>
            <p className="text-sm text-muted-foreground">What the payer checks before paying.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Invoice {form.invoiceNumber || '—'}
              </p>
              <p className="mt-2 text-4xl font-extrabold">
                {form.amount || '0'} {form.currency}
              </p>
              {form.billTo && <p className="mt-2 text-sm text-slate-600">Bill to: {form.billTo}</p>}
              {form.dueDate && <p className="mt-1 text-sm text-slate-600">Due: {form.dueDate}</p>}
              <p className="mt-3 text-sm text-slate-600">
                Scan to pay this invoice. Check the invoice number and amount match your records
                before paying.
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

      <AdSlot id="invoice-payment-qr-generator-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Invoice Payment QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">Make paying the easiest step</h3>
        <p className="text-base leading-relaxed">
          Invoices get paid fastest when paying takes one scan. The code carries the invoice number
          and amount, so the payer lands on the right invoice with the right amount already filled
          in, instead of retyping both from a PDF. Print the code on the invoice itself, next to the
          total, and keep the invoice number, amount, and due date readable in plain text beside it.
          A payer who can verify the amount before scanning trusts the code enough to use it.
        </p>
        <AdSlot id="invoice-payment-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          Your payment page must confirm the amount
        </h3>
        <p className="text-base leading-relaxed">
          Never trust the amount in the code alone. Your payment page should look up the invoice by
          its number and show the amount from your own records, using the code amount only as a
          cross-check. If the two disagree, the page should refuse the payment and say why. That way
          a damaged print, a tampered code, or a stale copy cannot quietly change what someone pays.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you send invoices</h3>
        <p className="text-base leading-relaxed">
          Before sending invoices with the code, scan a sample and walk through a real payment for a
          test invoice, confirming the right invoice opens with the right amount and the payment is
          recorded against it. Test a printed copy as well as the screen version, because most
          payers scan from paper. Keep the quiet zone around the code and print dark modules on a
          light background with strong contrast.
        </p>
      </article>

      <AdSlot id="invoice-payment-qr-generator-pre-related" format="horizontal-banner" />
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

      <AdSlot id="invoice-payment-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
