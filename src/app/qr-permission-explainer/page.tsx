'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRPermissionExplainerPage() {
  const [os, setOs] = useState('iOS (Camera app)');
  const [context, setContext] = useState('Open a website link');
  const table: Record<
    string,
    Record<string, Array<{ p: string; why: string; control: string }>>
  > = {
    'iOS (Camera app)': {
      'Open a website link': [
        {
          p: 'Camera',
          why: 'The Camera app reads the code image.',
          control: 'Granted once in Settings > Privacy & Security > Camera.',
        },
        {
          p: 'No location or contacts',
          why: 'Opening a plain link does not request location or contacts.',
          control: 'The site itself may ask later; you can decline.',
        },
      ],
      'Save a contact': [
        {
          p: 'Camera',
          why: 'The Camera app reads the code image.',
          control: 'Granted once in Settings > Privacy & Security > Camera.',
        },
        {
          p: 'Contacts (one-time prompt)',
          why: 'Adding the scanned contact writes to your address book.',
          control: 'iOS asks before saving; you can review the card first.',
        },
      ],
      'Join a Wi-Fi network': [
        {
          p: 'Camera',
          why: 'The Camera app reads the code image.',
          control: 'Granted once in Settings > Privacy & Security > Camera.',
        },
        {
          p: 'Wi-Fi join prompt',
          why: 'Joining needs your approval to switch networks.',
          control: 'iOS shows the network name; confirm it matches the sign.',
        },
      ],
      'Make a payment': [
        {
          p: 'Camera',
          why: 'The Camera app reads the code image.',
          control: 'Granted once in Settings > Privacy & Security > Camera.',
        },
        {
          p: 'Payment app approval',
          why: 'The payment app opens and asks you to confirm amount and recipient.',
          control: 'Never confirm a payment whose recipient or amount you did not check.',
        },
      ],
      'Download an app': [
        {
          p: 'Camera',
          why: 'The Camera app reads the code image.',
          control: 'Granted once in Settings > Privacy & Security > Camera.',
        },
        {
          p: 'App Store install',
          why: 'The store page opens; installing needs your normal install approval.',
          control: 'Check the developer name and reviews before installing.',
        },
      ],
    },
    'Android (Camera / Lens)': {
      'Open a website link': [
        {
          p: 'Camera',
          why: 'The camera reads the code image.',
          control: 'Granted once in Settings > Privacy > Camera.',
        },
        {
          p: 'Browser opens the link',
          why: 'The scanned link opens in your browser.',
          control: 'Check the address bar before signing in or paying.',
        },
      ],
      'Save a contact': [
        {
          p: 'Camera',
          why: 'The camera reads the code image.',
          control: 'Granted once in Settings > Privacy > Camera.',
        },
        {
          p: 'Contacts (one-time prompt)',
          why: 'Saving the scanned contact writes to your address book.',
          control: 'Android asks before saving; review the card first.',
        },
      ],
      'Join a Wi-Fi network': [
        {
          p: 'Camera',
          why: 'The camera reads the code image.',
          control: 'Granted once in Settings > Privacy > Camera.',
        },
        {
          p: 'Wi-Fi join prompt',
          why: 'Joining needs approval and may share the network password with the device.',
          control: 'Confirm the network name matches the venue.',
        },
      ],
      'Make a payment': [
        {
          p: 'Camera',
          why: 'The camera reads the code image.',
          control: 'Granted once in Settings > Privacy > Camera.',
        },
        {
          p: 'Payment app approval',
          why: 'The payment app opens and asks you to confirm amount and recipient.',
          control: 'Check recipient and amount before confirming.',
        },
      ],
      'Download an app': [
        {
          p: 'Camera',
          why: 'The camera reads the code image.',
          control: 'Granted once in Settings > Privacy > Camera.',
        },
        {
          p: 'Play Store install',
          why: 'The store page opens; installing needs your normal install approval.',
          control: 'Check the developer name and reviews before installing.',
        },
      ],
    },
    'In-app scanner (messaging / banking app)': {
      'Open a website link': [
        {
          p: 'Camera (in-app)',
          why: 'The app uses the camera only while its scanner is open.',
          control: 'Granted inside the app; revoke in system settings.',
        },
        {
          p: 'Link preview',
          why: 'Many apps show the destination before opening it.',
          control: 'Read the preview URL before tapping through.',
        },
      ],
      'Save a contact': [
        {
          p: 'Camera (in-app)',
          why: 'The app uses the camera only while its scanner is open.',
          control: 'Granted inside the app; revoke in system settings.',
        },
        {
          p: 'Contacts (one-time prompt)',
          why: 'Saving writes to your address book.',
          control: 'The app asks before saving; review the card first.',
        },
      ],
      'Join a Wi-Fi network': [
        {
          p: 'Camera (in-app)',
          why: 'The app uses the camera only while its scanner is open.',
          control: 'Granted inside the app; revoke in system settings.',
        },
        {
          p: 'Wi-Fi join prompt',
          why: 'Joining needs approval to switch networks.',
          control: 'Confirm the network name matches the venue.',
        },
      ],
      'Make a payment': [
        {
          p: 'Camera (in-app)',
          why: 'The app uses the camera only while its scanner is open.',
          control: 'Granted inside the app; revoke in system settings.',
        },
        {
          p: 'Payment confirmation',
          why: 'Banking and wallet apps ask for a PIN, fingerprint, or face check.',
          control: 'Never approve a payment you did not initiate and verify.',
        },
      ],
      'Download an app': [
        {
          p: 'Camera (in-app)',
          why: 'The app uses the camera only while its scanner is open.',
          control: 'Granted inside the app; revoke in system settings.',
        },
        {
          p: 'Store install',
          why: 'The store page opens outside the app.',
          control: 'Check the developer name before installing.',
        },
      ],
    },
    'Desktop webcam scanner': {
      'Open a website link': [
        {
          p: 'Camera (browser)',
          why: 'The browser page asks to use the webcam to read the code.',
          control: 'Allow per site; the browser shows a camera indicator while it runs.',
        },
        {
          p: 'Link opens in browser',
          why: 'The scanned link opens in a tab.',
          control: 'Check the address bar before signing in.',
        },
      ],
      'Save a contact': [
        {
          p: 'Camera (browser)',
          why: 'The browser page asks to use the webcam to read the code.',
          control: 'Allow per site; the browser shows a camera indicator while it runs.',
        },
        {
          p: 'Contact download',
          why: 'The contact file downloads; nothing is saved until you open it.',
          control: 'Review the downloaded file before importing.',
        },
      ],
      'Join a Wi-Fi network': [
        {
          p: 'Camera (browser)',
          why: 'The browser page asks to use the webcam to read the code.',
          control: 'Allow per site; the browser shows a camera indicator while it runs.',
        },
        {
          p: 'Wi-Fi credentials shown',
          why: 'A desktop scanner usually shows the network details rather than joining.',
          control: 'Do not share the shown password.',
        },
      ],
      'Make a payment': [
        {
          p: 'Camera (browser)',
          why: 'The browser page asks to use the webcam to read the code.',
          control: 'Allow per site; the browser shows a camera indicator while it runs.',
        },
        {
          p: 'Payment page',
          why: 'The payment page opens in the browser.',
          control: 'Check recipient and amount before paying.',
        },
      ],
      'Download an app': [
        {
          p: 'Camera (browser)',
          why: 'The browser page asks to use the webcam to read the code.',
          control: 'Allow per site; the browser shows a camera indicator while it runs.',
        },
        {
          p: 'Download',
          why: 'The installer file downloads to your computer.',
          control: 'Only run installers from sources you trust.',
        },
      ],
    },
  };
  const contexts = Object.keys(table[os] || {});
  const perms = (table[os] && table[os][context]) || [];
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const faqs = [
    {
      question: 'Does scanning a QR code give the code access to my phone?',
      answer:
        'No. A QR code is just text. Permissions are requested by the app that opens after the scan, and your device asks you before granting them.',
    },
    {
      question: 'Why does my camera ask for permission the first time I scan?',
      answer:
        'The scanner needs the camera to see the code. That permission is granted once to the scanning app and can be revoked in system settings.',
    },
    {
      question: 'Can a QR code turn on my location?',
      answer:
        'Not by itself. A website opened from a code can request location, but the browser asks you first and you can decline without the page breaking in most cases.',
    },
    {
      question: 'What should I do if a scan asks for an unexpected permission?',
      answer:
        'Decline it, close the prompt, and check the destination carefully. A menu code has no reason to ask for contacts, and a Wi-Fi code has no reason to install an app.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Permission Explainer',
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
          { label: 'QR Permission Explainer', href: '/qr-permission-explainer' },
        ]}
      />

      <AdSlot id="qr-permission-explainer-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Scan-Safety Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Permission Explainer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Pick your phone or scanner and what the code is supposed to do, and see exactly which
          permissions a scan requests, what each one is for, and where you control it.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Pick your setup</h2>
            <div className="space-y-2">
              <Label htmlFor="os">Operating system / scanner</Label>
              <select
                id="os"
                value={os}
                onChange={(e) => {
                  setOs(e.target.value);
                  setContext('Open a website link');
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.keys(table).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctx">What the code is supposed to do</Label>
              <select
                id="ctx"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {contexts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              A QR code itself cannot silently take permissions. Permissions are requested by the
              app that opens after the scan, and your device asks you first.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            {perms.map((x) => (
              <div key={x.p} className="rounded-lg border border-border/70 p-3">
                <p className="font-semibold text-sm">{x.p}</p>
                <p className="text-xs text-muted-foreground mt-1">{x.why}</p>
                <p className="text-xs mt-1">
                  <span className="font-semibold">Your control: </span>
                  {x.control}
                </p>
                <label className="flex items-center gap-2 text-xs mt-2">
                  <input
                    type="checkbox"
                    checked={!!checked[x.p]}
                    onChange={(e) => setChecked((p) => ({ ...p, [x.p]: e.target.checked }))}
                  />{' '}
                  I checked this before scanning
                </label>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              {Object.values(checked).filter(Boolean).length} of {perms.length} checks ticked.
            </p>
            <p className="text-xs text-muted-foreground">
              Rule of thumb: if a scan asks for a permission that does not match what the code
              promised — for example a menu code asking for contacts — stop and do not approve it.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-permission-explainer-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">What a Scan Can and Cannot Ask For</h2>
        <p className="text-base leading-relaxed">
          A QR code is only text: a link, a contact, Wi-Fi details, or similar. It has no power on
          its own. The moment you scan it, your phone hands that text to an app — the browser, the
          contacts app, the Wi-Fi settings, or a payment app — and that app may then ask for a
          permission. The permission belongs to the app, not to the code, which is why the same code
          can behave differently in the camera app, in a messaging app, or on a desktop browser.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          The only permission every scan needs
        </h3>
        <p className="text-base leading-relaxed">
          Every scan needs the camera, because the device has to see the code. On iOS and Android
          the camera permission is granted once to the camera app; in-app scanners ask for it inside
          that app; desktop scanners ask the browser for webcam access per site. If you have never
          granted it, the scanner simply shows a prompt instead of a viewfinder. Revoking camera
          access later stops scanning until you grant it again — it does not delete anything.
        </p>

        <AdSlot id="qr-permission-explainer-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          Permissions that come after the scan
        </h3>
        <p className="text-base leading-relaxed">
          Everything else is requested by whatever opens next. Saving a contact asks for contacts
          access. Joining Wi-Fi asks you to confirm the network. Paying asks your payment app for
          its own confirmation, such as a PIN or fingerprint. Downloading an app opens the store,
          which has its own install approval. None of these happen silently on a modern phone: each
          one shows a prompt naming the permission and the app that wants it.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Red flags worth stopping for</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            A code that promises one thing but asks for something unrelated — a menu code asking for
            contacts, or a Wi-Fi code asking to install an app.
          </li>
          <li>
            A payment prompt where the recipient name or amount differs from what the poster
            promised.
          </li>
          <li>A link preview whose domain does not match the business on the sign.</li>
          <li>
            A scanner app that demands broad permissions, such as full contacts or location, just to
            read a code.
          </li>
        </ul>
        <p className="text-base leading-relaxed">
          When in doubt, close the prompt, check the destination with the address bar or link
          preview, and re-scan only once the permission list matches what the code promised.
        </p>
      </article>

      <AdSlot id="qr-permission-explainer-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-permission-explainer-bottom" format="horizontal-banner" />

    </div>
  );
}
