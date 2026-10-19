'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileWarning } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRIncidentReportBuilderPage() {
  const [f, setF] = useState({
    reporter: '',
    date: '',
    location: '',
    payload: '',
    context: 'Street poster',
    behaviour: '',
    device: '',
    actions: '',
    evidence: '',
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const [copied, setCopied] = useState(false);
  const report = useMemo(() => {
    const lines = [
      'MALICIOUS QR CODE — INCIDENT REPORT',
      '',
      'Reporter: ' + (f.reporter || '(not given)'),
      'Date / time found: ' + (f.date || '(not given)'),
      'Location found: ' + (f.location || '(not given)'),
      'Context: ' + f.context,
      '',
      'QR payload / destination:',
      f.payload || '(not given)',
      '',
      'Observed behaviour:',
      f.behaviour || '(not given)',
      '',
      'Device / OS:',
      f.device || '(not given)',
      '',
      'Actions taken:',
      f.actions || '(not given)',
      '',
      'Evidence preserved:',
      f.evidence || '(not given)',
      '',
      'Handling notes: Do not rescan the code on a personal device. Keep the original photo and the payload above with this report. Share the report with the venue owner or the security team, and with the platform or registrar if the destination is still live.',
    ];
    return lines.join('\n');
  }, [f]);
  const copyReport = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-incident-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  const filled = [f.payload, f.location, f.behaviour].filter(Boolean).length;

  const faqs = [
    {
      question: 'Should I scan the code again to gather evidence?',
      answer:
        'No. Use the payload and photos you already have. Re-scanning risks triggering the malicious page again.',
    },
    {
      question: 'What if I do not know the payload?',
      answer:
        'Note that in the payload field and include the photo. A security team can decode the payload from the photo.',
    },
    {
      question: 'Do I need to include my password in the report?',
      answer: 'Never. Describe what the page asked for, not the credentials themselves.',
    },
    {
      question: 'Is this report sent anywhere automatically?',
      answer:
        'No. It is generated in your browser. You choose who receives it by copying or downloading it.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Incident Report Builder',
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
          { label: 'QR Incident Report Builder', href: '/qr-incident-report-builder' },
        ]}
      />

      <AdSlot id="qr-incident-report-builder-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FileWarning className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Incident Report Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Record a malicious QR code properly: payload, location, timeline, behaviour, and evidence
          — then copy or download a structured incident report your security team can act on.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Enter the incident details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporter">Reporter</Label>
                <Input
                  id="reporter"
                  value={f.reporter}
                  onChange={(e) => set('reporter', e.target.value)}
                  placeholder="Name or team"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date / time found</Label>
                <Input
                  id="date"
                  value={f.date}
                  onChange={(e) => set('date', e.target.value)}
                  placeholder="2026-10-19 14:30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location found</Label>
              <Input
                id="location"
                value={f.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="Shop entrance, Main Street — north poster"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Context</Label>
              <select
                id="context"
                value={f.context}
                onChange={(e) => set('context', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {[
                  'Street poster',
                  'Email or message',
                  'Package or product',
                  'Restaurant table',
                  'Payment request',
                  'Event ticket',
                  'Other',
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payload">QR payload / destination</Label>
              <textarea
                id="payload"
                value={f.payload}
                onChange={(e) => set('payload', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="Paste the decoded payload or link"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="behaviour">Observed behaviour</Label>
              <textarea
                id="behaviour"
                value={f.behaviour}
                onChange={(e) => set('behaviour', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="What happened after the scan? What did the page ask for?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device">Device / OS</Label>
              <Input
                id="device"
                value={f.device}
                onChange={(e) => set('device', e.target.value)}
                placeholder="e.g. iPhone, iOS 18"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actions">Actions taken</Label>
              <textarea
                id="actions"
                value={f.actions}
                onChange={(e) => set('actions', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Code removed, venue notified, password changed…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence preserved</Label>
              <textarea
                id="evidence"
                value={f.evidence}
                onChange={(e) => set('evidence', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Photo of the code in place, screenshot of the page…"
              />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm text-muted-foreground">
              {filled} of 3 key fields filled (payload, location, behaviour). Those three make the
              report actionable.
            </p>
            <pre className="whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs font-mono max-h-96 overflow-auto">
              {report}
            </pre>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={copyReport}>
                {copied ? 'Copied!' : 'Copy report'}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadReport}>
                Download .txt
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Do not include passwords or full payment details in the report. Describe what was
              asked for, not the credentials themselves.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-incident-report-builder-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Reporting a Malicious QR Code Properly
        </h2>
        <p className="text-base leading-relaxed">
          A report that says &apos;there was a bad QR code&apos; cannot be acted on. A useful report
          answers six questions: what the code contained, where it was, when it was found, what it
          did, what was done about it, and what evidence survives. This builder structures those
          answers so a security team, a venue owner, or a platform can act without coming back for
          the missing detail.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          What to preserve before you report
        </h3>
        <p className="text-base leading-relaxed">
          Photograph the code in place before removing it — the photo proves the context and shows
          whether it was a sticker over a legitimate code. Save the decoded payload exactly as
          scanned, and screenshot the page it opened if it is safe to do so. Do not rescan the code
          on a personal device to gather more evidence, and do not enter any credentials on the
          page.
        </p>

        <AdSlot id="qr-incident-report-builder-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Who should receive the report</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>The venue or business owner, if the code was on their premises or packaging.</li>
          <li>Your security team or IT helpdesk, if the code targeted staff or customers.</li>
          <li>The platform hosting the destination, if it is a phishing page.</li>
          <li>The domain registrar, if the domain is impersonating a brand.</li>
        </ul>
        <p className="text-base leading-relaxed">
          If anyone entered credentials or payment details after scanning, treat that as a separate
          incident: change the affected password, review the account, and note it in the
          actions-taken section.
        </p>
      </article>

      <AdSlot id="qr-incident-report-builder-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-incident-report-builder-bottom" format="horizontal-banner" />

    </div>
  );
}
