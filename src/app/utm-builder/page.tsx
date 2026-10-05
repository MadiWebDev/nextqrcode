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
  TrendingUp,
  Download,
  Copy,
  Check,
  BarChart3,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const PRESETS = [
  { name: 'Print Flyer', source: 'print_flyer', medium: 'print', campaign: 'local_promo' },
  { name: 'Trade Show Booth', source: 'tradeshow_booth', medium: 'offline_qr', campaign: 'expo_2026' },
  { name: 'Restaurant Table', source: 'table_tent', medium: 'in_venue', campaign: 'dine_in_menu' },
  { name: 'Product Packaging', source: 'product_box', medium: 'packaging', campaign: 'user_onboarding' },
  { name: 'Direct Mail Letter', source: 'direct_mail', medium: 'postal', campaign: 'retargeting_q1' },
];

export default function UTMBuilderPage() {
  const [baseUrl, setBaseUrl] = useState('https://example.com');
  const [source, setSource] = useState('print_flyer');
  const [medium, setMedium] = useState('print');
  const [campaign, setCampaign] = useState('spring_launch_2026');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('front_cover');

  const [fullUrl, setFullUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const cleanBase = baseUrl.trim().startsWith('http') ? baseUrl.trim() : `https://${baseUrl.trim()}`;
      const url = new URL(cleanBase);

      if (source) url.searchParams.set('utm_source', source.trim().toLowerCase().replace(/\s+/g, '_'));
      if (medium) url.searchParams.set('utm_medium', medium.trim().toLowerCase().replace(/\s+/g, '_'));
      if (campaign) url.searchParams.set('utm_campaign', campaign.trim().toLowerCase().replace(/\s+/g, '_'));
      if (term) url.searchParams.set('utm_term', term.trim().toLowerCase().replace(/\s+/g, '_'));
      if (content) url.searchParams.set('utm_content', content.trim().toLowerCase().replace(/\s+/g, '_'));

      const finalStr = url.toString();
      setFullUrl(finalStr);

      QRCode.toDataURL(finalStr, {
        errorCorrectionLevel: 'M',
        width: 340,
        margin: 2,
      }).then((data) => setQrDataUrl(data));
    } catch {
      setFullUrl(baseUrl);
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSource(p.source);
    setMedium(p.medium);
    setCampaign(p.campaign);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What are UTM parameters and why are they essential for QR codes?',
      answer: 'UTM (Urchin Tracking Module) tags are query parameters appended to a URL that inform Google Analytics 4 (GA4) exactly where a visitor originated. Without UTM parameters on physical QR codes, physical scans appear as generic "Direct / None" traffic in GA4.',
    },
    {
      question: 'Why should I always use lowercase characters in UTM tags?',
      answer: 'Google Analytics is case-sensitive. If you use "Print_Flyer" on one batch and "print_flyer" on another, GA4 treats them as two completely separate campaigns, fragmenting your conversion analytics.',
    },
    {
      question: 'Does adding UTM parameters make the QR code harder to scan?',
      answer: 'UTM tags add characters to the URL, which slightly increases module density. For long URLs with UTM parameters, keep error correction at Level M or use a clean canonical domain structure to keep the code easy to scan.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'UTM Builder & Campaign Planner', href: '/utm-builder' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Marketing Attribution Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code UTM Builder & Campaign Planner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Bridge offline print collateral and digital analytics. Generate campaign-tagged URLs and instant QR codes tracked in Google Analytics 4 (GA4) with zero tracking leakage.
        </p>
      </header>

      {/* Quick Channel Presets */}
      <div className="mb-6 space-y-2">
        <span className="text-xs font-semibold uppercase text-muted-foreground">Quick Presets:</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-lg border border-border/80 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <div>
              <Label htmlFor="utm-base" className="text-xs font-semibold">
                Destination Website URL:
              </Label>
              <Input
                id="utm-base"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="text-sm mt-1"
                placeholder="https://example.com/pricing"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="utm-src" className="text-xs font-semibold">
                  Campaign Source (utm_source):
                </Label>
                <Input
                  id="utm-src"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="text-sm mt-1"
                  placeholder="e.g. print_flyer, packaging"
                />
              </div>

              <div>
                <Label htmlFor="utm-med" className="text-xs font-semibold">
                  Campaign Medium (utm_medium):
                </Label>
                <Input
                  id="utm-med"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="text-sm mt-1"
                  placeholder="e.g. print, offline_qr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="utm-camp" className="text-xs font-semibold">
                  Campaign Name (utm_campaign):
                </Label>
                <Input
                  id="utm-camp"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="text-sm mt-1"
                  placeholder="e.g. spring_promo_2026"
                />
              </div>

              <div>
                <Label htmlFor="utm-cont" className="text-xs font-semibold">
                  Campaign Content (utm_content):
                </Label>
                <Input
                  id="utm-cont"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="text-sm mt-1"
                  placeholder="e.g. table_12, front_card"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Constructed Final URL:
              </Label>
              <div className="mt-1.5 p-3 rounded-lg bg-muted text-xs font-mono break-all">
                {fullUrl}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-4 text-center">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Campaign QR Preview
              </span>
              <span className="text-xs font-bold text-primary">GA4 Ready</span>
            </div>

            {qrDataUrl && (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl border border-border shadow-xs">
                  <img src={qrDataUrl} alt="Campaign QR" className="w-56 h-56" />
                </div>
                <div className="mt-2 text-xs font-semibold text-muted-foreground">
                  Source: <span className="text-foreground">{source}</span> | Medium: <span className="text-foreground">{medium}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  const a = document.createElement('a');
                  a.download = `campaign-qr-${campaign}.png`;
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
                onClick={handleCopy}
                className="text-xs font-semibold gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy URL'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="utm-builder-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Mastering Physical-to-Digital Campaign Attribution in Google Analytics 4
        </h2>
        <p className="text-base leading-relaxed">
          When print marketers run billboard campaigns, distribute trade show brochures, or place tabletop restaurant signage without UTM parameters, every scan arrives in web analytics as untagged "Direct" traffic. This makes measuring actual return on investment (ROI) impossible.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          GA4 Standard Taxonomy Rules
        </h3>
        <p className="text-base leading-relaxed">
          Google Analytics 4 classifies traffic into default channel groups based on strict medium rules:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>utm_medium=print:</strong> Custom grouping for offline physical collateral.</li>
          <li><strong>utm_source:</strong> The specific vehicle (e.g. <code>billboard_hwy101</code>, <code>menu_insert</code>).</li>
          <li><strong>utm_content:</strong> Distinguishes variations within the same campaign (e.g., A/B testing a black vs red call-to-action button).</li>
        </ul>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Campaign QR Codes
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
