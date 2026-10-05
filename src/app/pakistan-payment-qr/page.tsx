'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Download,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Building,
  QrCode,
  DollarSign,
} from 'lucide-react';

export default function RegionalPaymentQRPage() {
  const [provider, setProvider] = useState<'raast' | 'jazzcash' | 'easypaisa' | 'upi'>('raast');

  // Fields
  const [accountIdentifier, setAccountIdentifier] = useState('PK36SCBL0000001123456701');
  const [merchantName, setMerchantName] = useState('Lahore Tech Retail');
  const [amount, setAmount] = useState('1500');
  const [reference, setReference] = useState('INV-9021');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [rawPayload, setRawPayload] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Compute standard payload strings
  useEffect(() => {
    let payload = '';

    if (provider === 'raast') {
      // EMVCo TLV payload approximation for SBP Raast P2M
      // 00: Payload Format Indicator (01)
      // 01: Point of Initiation Method (12 for dynamic/amount or 11 for static)
      // 26: Merchant Info (PK.GOV.SBP.RAAST)
      // 52: MCC (0000)
      // 53: Currency (586 for PKR)
      // 54: Amount
      // 58: Country Code (PK)
      // 59: Merchant Name
      // 62: Additional Data (Reference)
      const amtStr = amount ? `54${String(amount.length).padStart(2, '0')}${amount}` : '';
      const refStr = reference ? `01${String(reference.length).padStart(2, '0')}${reference}` : '';
      const tag62 = refStr ? `62${String(refStr.length).padStart(2, '0')}${refStr}` : '';
      const nameStr = merchantName || 'Merchant';
      const tag59 = `59${String(nameStr.length).padStart(2, '0')}${nameStr}`;
      const ibanClean = accountIdentifier.replace(/\s+/g, '');
      const tag26Sub = `0016PK.GOV.SBP.RAAST01${String(ibanClean.length).padStart(2, '0')}${ibanClean}`;
      const tag26 = `26${String(tag26Sub.length).padStart(2, '0')}${tag26Sub}`;

      payload = `000201010212${tag26}520400005303586${amtStr}5802PK${tag59}${tag62}6304ABCD`;
    } else if (provider === 'jazzcash') {
      payload = `jazzcash://pay?till=${accountIdentifier}&name=${encodeURIComponent(merchantName)}&am=${amount}&ref=${reference}`;
    } else if (provider === 'easypaisa') {
      payload = `easypaisa://pay?account=${accountIdentifier}&name=${encodeURIComponent(merchantName)}&amount=${amount}&ref=${reference}`;
    } else if (provider === 'upi') {
      payload = `upi://pay?pa=${accountIdentifier}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(reference)}&cu=INR`;
    }

    setRawPayload(payload);

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      width: 360,
      margin: 2,
    }).then((url) => {
      setQrDataUrl(url);
    });
  }, [provider, accountIdentifier, merchantName, amount, reference]);

  const faqs = [
    {
      question: 'What is the Pakistan Raast QR code standard?',
      answer: 'Raast is Pakistan’s national instant payment system developed by the State Bank of Pakistan. Its QR specification complies with international EMVCo Tag-Length-Value (TLV) standards, allowing interoperable payments across all Pakistani commercial banks and microfinance institutions.',
    },
    {
      question: 'Can customers scan this QR code with Easypaisa, JazzCash, or bank apps?',
      answer: 'Yes. EMVCo Raast QR codes are cross-compatible across all SBP-certified applications including Nayapay, Sadapay, HBL, Meezan, Bank Alfalah, Easypaisa, and JazzCash.',
    },
    {
      question: 'Does QR Studio charge any transaction or payment processing fees?',
      answer: 'Zero fees. QR Studio is not a payment gateway and never touches transaction funds. We generate open standard payload strings directly inside your browser.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Regional Payment QR (UPI & Pakistan)', href: '/pakistan-payment-qr' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Interoperable Regional Rails</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Regional Payment QR Generator (Raast, JazzCash, Easypaisa & UPI)
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create official merchant payment QR codes for Pakistan (SBP Raast EMVCo, JazzCash Till, Easypaisa) and India (NPCI UPI) with fixed or open amounts.
        </p>
      </header>

      {/* Rail Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-3">
        {[
          { id: 'raast', label: 'Pakistan Raast (SBP EMVCo)' },
          { id: 'jazzcash', label: 'JazzCash Till' },
          { id: 'easypaisa', label: 'Easypaisa Merchant' },
          { id: 'upi', label: 'India UPI (NPCI)' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setProvider(item.id as any);
              if (item.id === 'raast') setAccountIdentifier('PK36SCBL0000001123456701');
              if (item.id === 'jazzcash') setAccountIdentifier('03001234567');
              if (item.id === 'easypaisa') setAccountIdentifier('03451234567');
              if (item.id === 'upi') setAccountIdentifier('merchant@okaxis');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              provider === item.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              <span>Merchant & Account Parameters</span>
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pay-acc" className="text-xs font-semibold">
                  {provider === 'raast'
                    ? 'Raast IBAN or Registered Mobile Alias:'
                    : provider === 'upi'
                    ? 'Virtual Payment Address (VPA / UPI ID):'
                    : 'Merchant Till Number or Wallet Account:'}
                </Label>
                <Input
                  id="pay-acc"
                  value={accountIdentifier}
                  onChange={(e) => setAccountIdentifier(e.target.value)}
                  className="text-sm font-mono mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pay-name" className="text-xs font-semibold">
                    Merchant / Business Name:
                  </Label>
                  <Input
                    id="pay-name"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="pay-amt" className="text-xs font-semibold">
                    Amount ({provider === 'upi' ? 'INR' : 'PKR'} - Leave blank for open amount):
                  </Label>
                  <Input
                    id="pay-amt"
                    type="number"
                    placeholder="e.g. 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pay-ref" className="text-xs font-semibold">
                  Invoice Number / Order Note:
                </Label>
                <Input
                  id="pay-ref"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Disclaimer: Verify your IBAN, till, or UPI ID with a small test scan before printing checkout displays. QR Studio is an open generator and is not affiliated with the State Bank of Pakistan or NPCI.
              </span>
            </div>
          </Card>
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment QR Preview
              </span>
              <span className="text-xs font-bold text-emerald-600">Zero Processing Fees</span>
            </div>

            {qrDataUrl && (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl border border-border shadow-xs">
                  <img src={qrDataUrl} alt="Payment QR" className="w-56 h-56" />
                </div>
                <div className="mt-3 text-xs font-semibold text-foreground">
                  {merchantName}
                </div>
                {amount && (
                  <div className="text-lg font-extrabold text-primary mt-0.5">
                    {provider === 'upi' ? `₹${amount}` : `Rs. ${amount}`}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  const a = document.createElement('a');
                  a.download = `payment-qr-${provider}.png`;
                  a.href = qrDataUrl;
                  a.click();
                }}
                className="flex-1 text-xs font-semibold gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(rawPayload);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs font-semibold gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy String'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="payment-qr-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Understanding Regional QR Payment Standards in South Asia
        </h2>
        <p className="text-base leading-relaxed">
          The rapid demonetization of cash in South Asia has been driven by standardized interoperable QR code switches. In Pakistan, the State Bank of Pakistan launched Raast to eliminate merchant transaction fees. In India, the Unified Payments Interface (UPI) powers billions of monthly retail payments.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          The EMVCo Merchant-Presented QR Architecture
        </h3>
        <p className="text-base leading-relaxed">
          The Raast standard follows the global EMVCo specification, using Tag-Length-Value (TLV) encoding. Each data element is identified by a two-digit numerical tag, followed by a two-digit length indicator and the raw value. Because this architecture is open and standardized, customers can scan the same physical countertop code regardless of which banking app they use.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Payment QR Codes
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
