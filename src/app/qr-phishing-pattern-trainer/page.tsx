'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

interface Scenario {
  title: string;
  story: string;
  detail: string;
  unsafe: boolean;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    title: 'The cafe menu',
    story:
      'A QR code on your usual cafe table links to the menu. The printed frame matches the cafe branding, and the destination is the cafe’s own domain.',
    detail: 'Destination: https://rivercafe.example/menu',
    unsafe: false,
    explanation:
      'Safe. The code is in its expected place, the destination matches the business, and it leads to a menu — nothing sensitive is requested.',
  },
  {
    title: 'The parking meter sticker',
    story:
      'A sticker on a parking meter says "Scan to pay". It is slightly crooked, and the corner of an older code peeks out from underneath it.',
    detail: 'Destination: https://pay-parking-quick.example/session',
    unsafe: true,
    explanation:
      'Unsafe. A sticker placed over an existing code is the classic overlay attack. The domain is not the city’s parking domain, and payment is requested. Pay through the official machine or app instead.',
  },
  {
    title: 'The parcel text',
    story:
      'You receive a text saying a parcel could not be delivered, with a QR code to "reschedule". You are not expecting a parcel.',
    detail: 'Destination: https://delivery-reschedule.example/track',
    unsafe: true,
    explanation:
      'Unsafe. An unexpected message about a parcel you are not expecting is a red flag on its own. Delivery companies do not need you to scan a code to reschedule — and the domain is not a carrier you recognise.',
  },
  {
    title: 'The museum label',
    story:
      'A museum exhibit label has a QR code for an audio stop. The label looks professionally printed and matches the other labels in the gallery.',
    detail: 'Destination: https://museum.example/audio/stop-4',
    unsafe: false,
    explanation:
      'Safe. The code is part of a consistent, professionally printed set in a staffed venue, and it leads to the museum’s own domain for audio content.',
  },
  {
    title: 'The bank email',
    story:
      'An email that looks like it is from your bank contains a QR code and urges you to scan it "within 2 hours" to verify your account.',
    detail: 'Destination: https://secure-bank-verification.example/login',
    unsafe: true,
    explanation:
      'Unsafe. Urgency plus an unexpected verification request is a phishing pattern. Banks do not ask you to log in via a QR code in an email. Go to the bank’s site or app directly.',
  },
  {
    title: 'The conference badge',
    story:
      'At a conference you are attending, the badge pickup desk shows a QR code to join the event Wi-Fi. Staff point you to it.',
    detail: 'Destination: WIFI:T:WPA;S:ConfGuest;P:guest-wifi-key;;',
    unsafe: false,
    explanation:
      'Safe. The code is offered by staff at the venue, in context, for the purpose you expect. Joining an event network is normal — just avoid entering sensitive credentials while on shared Wi-Fi.',
  },
  {
    title: 'The lookalike login',
    story:
      'A QR code on a poster promises free Wi-Fi. The decoded URL shows a familiar streaming brand, but the domain ends in .co instead of .com and asks you to log in first.',
    detail: 'Destination: https://streaming-brand.co/login',
    unsafe: true,
    explanation:
      'Unsafe. A TLD swap of a familiar brand, combined with a login request, is a typosquat pattern. Free Wi-Fi never needs your streaming password — walk away.',
  },
  {
    title: 'The restaurant receipt',
    story:
      'Your restaurant receipt has a QR code for leaving feedback. It points to the restaurant’s own feedback page, and nothing else is requested.',
    detail: 'Destination: https://bistro.example/feedback',
    unsafe: false,
    explanation:
      'Safe. The code is on a receipt from a meal you just had, it matches the business, and it leads to a feedback form — a normal, low-risk use.',
  },
  {
    title: 'The crypto giveaway',
    story:
      'A social media post shows a QR code promising to double any cryptocurrency sent to it, with a countdown timer and screenshots of payouts.',
    detail: 'Destination: https://crypto-double.example/giveaway',
    unsafe: true,
    explanation:
      'Unsafe. Doubling schemes are fraud, and cryptocurrency payments cannot be reversed. The countdown and payout screenshots are pressure tactics. Never send funds to a code that promises returns.',
  },
  {
    title: 'The library poster',
    story:
      'A library poster advertises a children’s reading event. The QR code links to the library’s events page, where the event is listed with the same date and time as the poster.',
    detail: 'Destination: https://library.example/events/story-time',
    unsafe: false,
    explanation:
      'Safe. The code, the poster, and the destination all agree, and the destination is the library’s own domain. Cross-checking the event details against the poster is exactly the right habit.',
  },
];

const FAQS = [
  {
    question: 'What is the single best habit for judging a QR code?',
    answer:
      'Compare the code against its context: does the destination match the place, the sender, and the promise? A menu code in a cafe that leads to the cafe site is consistent. A parking code that leads to an unknown payment domain is not. Context mismatches catch more attacks than any technical check.',
  },
  {
    question: 'Should I ever scan a code I am unsure about?',
    answer:
      'Only with a scanner that shows you the decoded text before acting on it, and only to inspect the payload — never to open a link, join a network, or enter credentials from a code you distrust. If the decoded text looks wrong, stop there.',
  },
  {
    question: 'Why do attackers use urgency in QR scams?',
    answer:
      'Because urgency short-circuits the check. A countdown, a suspension warning, or a missed-delivery message pushes people to scan before they think. Treat any code that demands immediate action as suspicious by default, and verify through a separate channel.',
  },
  {
    question: 'What should I do if I already scanned a suspicious code?',
    answer:
      'Do not enter any credentials or payment details. If you did, change the password from a device you trust, enable two-factor authentication, and contact the real organisation. Note where the code was, photograph it if safe, and report it to the venue or the sender so others are protected.',
  },
];

export default function QRPhishingPatternTrainerPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(SCENARIOS.map(() => null));
  const [revealed, setRevealed] = useState(false);

  const scenario = SCENARIOS[index];
  const score = useMemo(
    () => answers.filter((a, i) => a !== null && a === SCENARIOS[i].unsafe).length,
    [answers]
  );
  const answered = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const finished = answered === SCENARIOS.length;

  const answer = (unsafe: boolean) => {
    setAnswers((prev) => prev.map((a, i) => (i === index ? unsafe : a)));
    setRevealed(true);
  };

  const next = () => {
    setRevealed(false);
    setIndex((i) => Math.min(i + 1, SCENARIOS.length - 1));
  };

  const prev = () => {
    setRevealed(false);
    setIndex((i) => Math.max(i - 1, 0));
  };

  const restart = () => {
    setAnswers(SCENARIOS.map(() => null));
    setIndex(0);
    setRevealed(false);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Phishing Pattern Trainer',
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
          { label: 'QR Phishing Pattern Trainer', href: '/qr-phishing-pattern-trainer' },
        ]}
      />

      <AdSlot id="qr-phishing-pattern-trainer-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Security Trainer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Phishing Pattern Trainer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Ten realistic QR scenarios. Judge each one safe or unsafe, then read the explanation. Your
          score is tracked as you go — the goal is the pattern recognition, not the number.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">
                Scenario {index + 1} of {SCENARIOS.length}: {scenario.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                Score: {score} / {answered} answered
              </p>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(answered / SCENARIOS.length) * 100}%` }}
              />
            </div>
            <p className="text-sm leading-relaxed">{scenario.story}</p>
            <p className="rounded-lg bg-muted p-3 text-xs font-mono break-all">{scenario.detail}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => answer(false)}
                disabled={revealed}
                variant={revealed && answers[index] === false ? 'default' : 'outline'}
                className="gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Safe
              </Button>
              <Button
                onClick={() => answer(true)}
                disabled={revealed}
                variant={revealed && answers[index] === true ? 'default' : 'outline'}
                className="gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Unsafe
              </Button>
            </div>
            {revealed && (
              <div
                className={`rounded-lg p-4 text-sm leading-relaxed ${answers[index] === scenario.unsafe ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/10 text-red-800 dark:text-red-200'}`}
              >
                <p className="font-semibold mb-1">
                  {answers[index] === scenario.unsafe ? 'Correct — ' : 'Not quite — '}
                  this scenario is {scenario.unsafe ? 'UNSAFE' : 'SAFE'}.
                </p>
                <p>{scenario.explanation}</p>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <Button variant="outline" size="sm" onClick={prev} disabled={index === 0}>
                Previous
              </Button>
              {index < SCENARIOS.length - 1 ? (
                <Button size="sm" onClick={next} disabled={!revealed}>
                  Next scenario
                </Button>
              ) : (
                <Button size="sm" onClick={restart} className="gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Restart trainer
                </Button>
              )}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">Your progress</h2>
            <div className="grid grid-cols-5 gap-1.5">
              {SCENARIOS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setRevealed(answers[i] !== null);
                  }}
                  className={`rounded-md py-2 text-xs font-semibold border ${
                    answers[i] === null
                      ? 'border-border text-muted-foreground'
                      : answers[i] === s.unsafe
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Green means you judged that scenario correctly; red means the explanation is worth
              re-reading.
            </p>
            {finished && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
                <p className="font-semibold">
                  Finished: {score} of {SCENARIOS.length} correct.
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {score === SCENARIOS.length
                    ? 'A perfect round. The habit to keep: always compare the code against its context before trusting it.'
                    : 'Revisit the red scenarios and read their explanations — the patterns repeat in real attacks.'}
                </p>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={restart} className="w-full gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-phishing-pattern-trainer-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Learning to see QR phishing before you scan
        </h2>
        <p className="text-base leading-relaxed">
          QR phishing works because the code is opaque. A link in an email can be hovered over and
          inspected; a QR code cannot be read by eye at all. Attackers exploit that gap with
          stickers over legitimate codes, messages that manufacture urgency, and domains that differ
          from the real thing by a single character. Training is not about memorising a list of bad
          domains — those change daily. It is about building a reflex: pause, check the context, and
          compare the code against what you expected.
        </p>
        <p className="text-base leading-relaxed">
          The first pattern to learn is the overlay. A sticker placed over a real code is the
          cheapest attack in the book: it takes seconds, needs no technical skill, and inherits the
          trust of the legitimate sign underneath. Look for crooked edges, a corner of an older code
          peeking out, a frame that does not match the surrounding signage, or a finish that differs
          from the rest of the poster. If anything looks added rather than printed, do not scan it —
          report it to whoever owns the sign.
        </p>

        <AdSlot id="qr-phishing-pattern-trainer-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The second pattern is manufactured urgency. Parcel problems, account suspensions, expiring
          verifications, and giveaway countdowns all push the same button: act now, think later.
          Legitimate organisations rarely demand immediate action through a QR code you did not
          expect. When a code arrives with a deadline, treat the deadline itself as the warning
          sign, and verify through a separate channel — the organisation&apos;s own app, site, or
          published number — before doing anything the message asks.
        </p>
        <p className="text-base leading-relaxed">
          The third pattern is the lookalike destination. Read the host from the right, because that
          is where the registrable domain lives. A TLD swap, a zero for an o, or a subdomain that
          wears a familiar brand as a costume all rely on the reader stopping halfway through the
          address. Combine that with the request itself: a free Wi-Fi code that asks for your
          streaming password, a parking code that leads to an unknown payment domain, a giveaway
          that asks you to send money first — each one is a context mismatch, and context mismatches
          catch more attacks than any technical check.
        </p>
        <p className="text-base leading-relaxed">
          The final habit is the response. If you scanned a suspicious code, do not enter
          credentials or payment details. If you already did, change the password from a device you
          trust, enable two-factor authentication, and contact the real organisation. Note where the
          code was, photograph it if it is safe, and report it so others are protected. A single
          report can take down a sticker, a domain, or a campaign — and the person who reports it is
          usually the person who paused long enough to notice.
        </p>
      </article>

      <AdSlot id="qr-phishing-pattern-trainer-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Phishing
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

      <AdSlot id="qr-phishing-pattern-trainer-bottom" format="horizontal-banner" />

    </div>
  );
}
