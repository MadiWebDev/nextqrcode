'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Copy, CheckCircle2 } from 'lucide-react';

const DATA_OPTIONS = [
  'Scan time and date',
  'Device type',
  'Approximate location',
  'Name or contact details',
  'Answers or preferences you enter',
] as const;

type Retention = 'session' | '30days' | '12months' | 'until-withdrawn';

const RETENTION_LABEL: Record<Retention, string> = {
  session: 'for this session only',
  '30days': 'for 30 days',
  '12months': 'for 12 months',
  'until-withdrawn': 'until you ask us to delete it',
};

const FAQS = [
  {
    question: 'Does a short consent note replace a privacy policy?',
    answer:
      'No. The note beside the code is a plain-language summary that helps people decide whether to scan. Your full privacy policy still needs to exist, and the note should link to it. Think of the note as the sign on the door and the policy as the document behind it.',
  },
  {
    question: 'What must a consent note say to be useful?',
    answer:
      'What happens when someone scans, what data is collected, how long it is kept, who to contact, and that scanning is optional. If any of those answers is missing, the note is decoration. Keep the language concrete: name the data, name the retention, name the contact.',
  },
  {
    question: 'Is scanning a QR code itself consent?',
    answer:
      'Not on its own. Consent needs to be informed and freely given, which means the person should understand what scanning will do before they scan. A clear note beside the code, plus a choice on the landing page, is far stronger than treating the scan as agreement.',
  },
  {
    question: 'Should the note promise that no data is collected?',
    answer:
      'Only if that is literally true. Server logs, analytics, and form submissions all collect something. If you claim no data is collected while your analytics tool records the visit, the note is false and the trust it bought is gone. Describe what actually happens.',
  },
];

export default function QRConsentNoteBuilderPage() {
  const [purpose, setPurpose] = useState('');
  const [selected, setSelected] = useState<string[]>(['Scan time and date']);
  const [retention, setRetention] = useState<Retention>('30days');
  const [contact, setContact] = useState('');
  const [policyUrl, setPolicyUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleData = (item: string) =>
    setSelected((prev) => (prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]));

  const note = useMemo(() => {
    const lines: string[] = [];
    lines.push(`About this QR code${purpose ? `: ${purpose}` : ''}`);
    lines.push('');
    lines.push('Scanning this code is optional. If you scan it, we will collect the following:');
    if (selected.length === 0) {
      lines.push('— Nothing beyond what is needed to load the page (standard server logs).');
    } else {
      for (const d of selected) lines.push(`— ${d}`);
    }
    lines.push('');
    lines.push(`We keep this information ${RETENTION_LABEL[retention]}.`);
    if (contact) lines.push(`Questions or deletion requests: ${contact}.`);
    if (policyUrl) lines.push(`Full privacy policy: ${policyUrl}`);
    lines.push('');
    lines.push(
      'You can choose not to scan. If you prefer, ask staff for the same information in another form.'
    );
    return lines.join('\n');
  }, [purpose, selected, retention, contact, policyUrl]);

  const wordCount = useMemo(() => note.split(/\s+/).filter(Boolean).length, [note]);

  const copyNote = async () => {
    await navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Consent Note Builder',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
          { label: 'QR Consent Note Builder', href: '/qr-consent-note-builder' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Privacy Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Consent Note Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build a short consent and privacy note to place beside a data-collecting QR code. Answer
          the purpose, data, and retention questions, and the tool drafts a plain-language note you
          can print next to the code.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">1. Answer the questions</h2>
            <div className="space-y-1.5">
              <Label htmlFor="consent-purpose">What happens when someone scans? (purpose)</Label>
              <Input
                id="consent-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">Example: Opens our feedback form</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                What data is collected?
              </Label>
              {DATA_OPTIONS.map((item) => (
                <label key={item} className="flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => toggleData(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
              <p className="text-[11px] text-muted-foreground">
                Tick only what is actually collected. If in doubt, check with whoever runs the
                landing page and its analytics.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                How long is it kept?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(RETENTION_LABEL) as Retention[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRetention(r)}
                    className={`p-3 text-left rounded-xl border text-xs ${retention === r ? 'border-primary bg-primary/5 font-semibold' : 'border-border text-muted-foreground'}`}
                  >
                    {RETENTION_LABEL[r].replace('for ', '').replace('until', 'Until')}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="consent-contact">Contact for questions or deletion requests</Label>
              <Input
                id="consent-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">Example: privacy@example.com</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="consent-policy">Full privacy policy URL (optional)</Label>
              <Input
                id="consent-policy"
                value={policyUrl}
                onChange={(e) => setPolicyUrl(e.target.value)}
                inputMode="url"
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/privacy
              </p>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Your consent note</h2>
            <div className="rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {note}
            </div>
            <p className="text-xs text-muted-foreground">
              {wordCount} words — short enough to read while standing beside the code.
            </p>
            <Button variant="outline" size="sm" onClick={copyNote} className="w-full gap-1.5">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy note text'}
            </Button>
            <p className="text-xs text-muted-foreground">
              This builder produces a plain-language draft, not legal advice. Have your own counsel
              or privacy lead review it before printing.
            </p>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Writing a consent note people actually read
        </h2>
        <p className="text-base leading-relaxed">
          A consent note beside a QR code has about five seconds to earn its place. The visitor is
          standing up, possibly in a queue, deciding whether to point their phone at a pattern they
          cannot read. If the note is a dense paragraph of legal language, it will be ignored — and
          a note that is ignored protects nobody. The note that works is short, concrete, and
          honest: what scanning does, what data it collects, how long the data is kept, who to
          contact, and the fact that scanning is optional.
        </p>
        <p className="text-base leading-relaxed">
          Concreteness is the difference between a note that informs and a note that decorates.
          &quot;We may collect certain information to improve your experience&quot; informs nobody.
          &quot;Scanning opens our feedback form. We collect your answers, the time of submission,
          and device type, and we keep them for 30 days&quot; tells the visitor exactly what they
          are agreeing to. Name the data. Name the retention. Name the contact. If you cannot name
          them, you do not yet understand your own data flow well enough to ask for consent — go and
          find out before printing the code.
        </p>
        <p className="text-base leading-relaxed">
          Retention deserves its own honesty. Every organisation has data it keeps &quot;just in
          case&quot; with no deletion date, and every such pile is a future incident. Picking a real
          retention period — session, 30 days, 12 months, until withdrawn — forces the useful
          conversation about why the data is kept at all. Shorter is usually better, both for
          privacy and for the team that has to secure the data. If the answer is &quot;we keep it
          forever because we always have,&quot; that is a policy decision worth revisiting, not a
          default worth defending.
        </p>
        <p className="text-base leading-relaxed">
          The note must also say what happens if the visitor does not scan. &quot;Ask staff for the
          same information in another form&quot; is a small sentence with a large effect: it tells
          visitors the code is a convenience, not a gate. People who cannot scan — dead battery, no
          phone, no signal, no desire — still deserve the service. A QR code that is the only route
          to a menu, a form, or a ticket is not a convenience; it is a barrier, and no consent note
          can fix that.
        </p>
        <p className="text-base leading-relaxed">
          Finally, remember that the note is a summary, not a substitute. Your full privacy policy
          must still exist, and the note should link to it. The note&apos;s job is to let a standing
          visitor make an informed choice in seconds. The policy&apos;s job is the detail. And the
          strongest test of both is simple: would you be comfortable if the visitor read the note,
          understood it fully, and still chose to scan? If the answer is yes, the note is doing its
          job.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Consent Notes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq, i) => (
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
