import type { Metadata } from 'next';
import Link from 'next/link';

const DESCRIPTION =
  'How the Image Resizer handles your files: every tool runs in your browser, your images are processed on your own device and are never uploaded. Read the full policy.';

export const metadata: Metadata = {
  title: 'Privacy Policy — Image Resizer',
  description: DESCRIPTION,
  alternates: { canonical: 'https://imageresizer.freeqrcode.tools/privacy' },
  openGraph: {
    title: 'Privacy Policy — Image Resizer',
    description: DESCRIPTION,
    url: 'https://imageresizer.freeqrcode.tools/privacy',
    type: 'website',
    siteName: 'Free QR Code Tools – Image Resizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Image Resizer',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; paragraphs: string[]; bullets?: string[] }[] = [
  {
    heading: 'The short version',
    paragraphs: [
      'Every tool on this site runs entirely in your browser. When you open an image — to resize it, compress it, convert it, strip its metadata or turn it into a passport photo — the file is read and processed on your own device, by your browser\u2019s built-in image engine. Your images are never uploaded to our servers, never stored by us, and never seen by our team. There are no accounts, and there is no image library with your name on it, because nothing leaves your device in the first place.',
    ],
  },
  {
    heading: 'What happens when you use a tool',
    paragraphs: [
      'You pick a file, the browser loads it into the page\u2019s memory, the tool does its work locally, and the result is generated as a download on the spot. That is true for the single-file tools and for the bulk tools that process a folder of images at once. The PDF tools work the same way: PDF to Images renders each page inside your browser, and Images to PDF assembles the document locally before you save it.',
      'The Metadata Viewer deserves a specific mention, because it exists to show you data that is easy to forget: it reads the EXIF information stored inside your photo — camera model, timestamps, and often GPS coordinates — and displays it to you, locally. Reading it sends it nowhere. The EXIF Remover deletes that data from the copy you download, also locally.',
    ],
  },
  {
    heading: 'What this means in practice',
    paragraphs: [
      'Browser-based processing has consequences worth knowing, because they are the trade-off that buys the privacy above:',
    ],
    bullets: [
      'When you close the tab, the working copies in the page are gone. The only files that remain are the ones you chose to download, in your own downloads folder.',
      'We cannot recover an image for you, restore an earlier version, or delete a file from our side. We never had a copy.',
      'Your downloads folder and your browser are on your device, under your control. On a shared computer, treat downloaded files the way you would treat any document left on that machine.',
      'Very large files are limited by your device\u2019s memory, not by an upload quota. A phone may struggle with a file a desktop handles easily.',
    ],
  },
  {
    heading: 'The website itself: cookies, analytics and advertising',
    paragraphs: [
      'This site is served on the freeqrcode.tools platform and works like the rest of that platform. The pages themselves are delivered by our hosting provider, whose servers necessarily process standard technical information (such as your IP address and browser type) to serve the page and protect against abuse, in line with the hosting provider\u2019s own policies.',
      'The platform uses essential cookies required for the site to function, and — subject to the consent choices presented on the platform — analytics cookies that help us understand which tools are used, and advertising cookies used by ad partners to show and measure ads. None of these mechanisms receive your images or the contents of your files: that data never leaves your device in the first place.',
    ],
  },
  {
    heading: 'What we never do',
    paragraphs: [
      'We do not collect images, we do not build a library of user files, and we do not use your pictures to train models. We do not sell personal data — we hold none of yours to sell. There is no account database to breach, subpoena or leak.',
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
      'If the way this site handles data ever changes — for example if an optional account feature were introduced — this page will be updated and the change made prominent before it takes effect. The current version reflects the product as it exists today: no accounts, no uploads, processing on your device.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: November 2026 · Applies to the Image Resizer at
          imageresizer.freeqrcode.tools, provided by QR Studio as part of Free QR Code Tools.
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
