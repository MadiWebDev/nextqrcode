import type { Metadata } from 'next';
import Link from 'next/link';

const DESCRIPTION =
  'How the Invoice Generator handles your data: invoices, clients and profiles stay in your browser\u2019s local storage and are never uploaded. Read the full policy.';

export const metadata: Metadata = {
  title: 'Privacy Policy — Invoice Generator',
  description: DESCRIPTION,
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/privacy' },
  openGraph: {
    title: 'Privacy Policy — Invoice Generator',
    description: DESCRIPTION,
    url: 'https://invoicegenerator.freeqrcode.tools/privacy',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Invoice Generator',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; paragraphs: string[]; bullets?: string[] }[] = [
  {
    heading: 'The short version',
    paragraphs: [
      'The Invoice Generator has no accounts and no server-side database of your business. Everything you type into the tool — your business profile, your logo and stamp images, your client address book, your invoices, payments and settings — is stored only in your own browser\u2019s local storage, on your own device. It is never uploaded to us, never synced to a cloud account, and never visible to our team. We could not read your client list if we wanted to; the architecture does not give us a copy.',
    ],
  },
  {
    heading: 'What this means in practice',
    paragraphs: [
      'Browser-local storage has consequences you should understand, because they are the trade-off that buys the privacy above:',
    ],
    bullets: [
      'Your data lives on one device, in one browser. It does not follow you to your phone, another computer, or a different browser.',
      'Clearing your browser\u2019s site data, using private/incognito mode, or letting a cleaner tool wipe storage permanently deletes your invoices and settings. We cannot recover them — we never had them.',
      'Anyone who uses this browser on this device can open the tool and see the stored data. On a shared computer, treat it like a paper file left on the desk.',
      'The PDF documents you download are complete copies of your invoices. Keep them as your long-term records.',
    ],
  },
  {
    heading: 'Backups are your responsibility — and your control',
    paragraphs: [
      'Because nothing is stored on our side, the backup feature in Settings is the safety net: "Export backup" downloads a single JSON file containing your profile, clients and invoices, and "Import backup" restores it on any device. We recommend exporting before switching computers, before clearing browser data, and at the end of each month. Where you keep that file — and who can open it — is entirely up to you. The same applies to the CSV export of your invoices.',
    ],
  },
  {
    heading: 'The website itself: cookies, analytics and advertising',
    paragraphs: [
      'This site is served on the freeqrcode.tools platform and works like the rest of that platform. The pages themselves are delivered by our hosting provider, whose servers necessarily process standard technical information (such as your IP address and browser type) to serve the page and protect against abuse, in line with the hosting provider\u2019s own policies.',
      'The platform uses essential cookies required for the site to function, and — subject to the consent choices presented on the platform — analytics cookies that help us understand which tools are used, and advertising cookies used by ad partners to show and measure ads. None of these mechanisms receive the contents of your invoices, clients or profile: that data never leaves your browser\u2019s local storage in the first place. PDF generation, QR code generation and all calculations also happen locally in your browser.',
    ],
  },
  {
    heading: 'What we never do',
    paragraphs: [
      'We do not sell personal data — we hold none of yours to sell. We do not build profiles of the tool\u2019s users from their business data, we do not send your invoices or client details to third parties, and we do not use your content to train models. There is no account database to breach, subpoena or leak.',
    ],
  },
  {
    heading: 'Contacting us about privacy',
    paragraphs: [
      'If you email us — for example through the contact page — your message travels through your own email provider to our mailbox, and we keep the correspondence so we can answer and follow up. That is the only route by which information about you reaches us, and you control what you put in it. For any privacy question, write to us via the contact page and choose the "Privacy question" topic.',
    ],
  },
  {
    heading: 'Changes to this policy',
    paragraphs: [
      'If the way this site handles data ever changes — for example if an optional account feature were introduced — this page will be updated and the change made prominent before it takes effect. The current version reflects the product as it exists today: no accounts, no uploads, browser-local data.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: November 2026 · Applies to the Invoice Generator at
          invoicegenerator.freeqrcode.tools, provided by QR Studio.
        </p>
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed marker:text-primary">
                {section.bullets.map((b) => (
                  <li key={b.slice(0, 40)}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <p className="mt-10 text-sm text-muted-foreground">
          See also our{' '}
          <Link href="/terms" className="text-primary underline underline-offset-2">
            terms of use
          </Link>{' '}
          and{' '}
          <Link href="/contact" className="text-primary underline underline-offset-2">
            contact page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
