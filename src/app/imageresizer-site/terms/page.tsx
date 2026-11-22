import type { Metadata } from 'next';
import Link from 'next/link';

const DESCRIPTION =
  'The terms of use for the free Image Resizer by QR Studio: what the tools do, what they do not do, and your responsibilities for the files you create with them.';

export const metadata: Metadata = {
  title: 'Terms of Use — Image Resizer',
  description: DESCRIPTION,
  alternates: { canonical: 'https://imageresizer.freeqrcode.tools/terms' },
  openGraph: {
    title: 'Terms of Use — Image Resizer',
    description: DESCRIPTION,
    url: 'https://imageresizer.freeqrcode.tools/terms',
    type: 'website',
    siteName: 'Free QR Code Tools – Image Resizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use — Image Resizer',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: '1. The service',
    paragraphs: [
      'The Image Resizer ("the tools") is a free, browser-based image application provided by QR Studio as part of the Free QR Code Tools family at freeqrcode.tools. It lets you resize, compress, convert, crop and edit images; process files in bulk; prepare social media, passport and ID photos; convert between images and PDFs; and inspect or remove image metadata — all on your own device. By using the tools you accept these terms. If you do not accept them, please do not use the tools.',
    ],
  },
  {
    heading: '2. Free means free',
    paragraphs: [
      'There is no charge for using the tools, no account to create, and no paid tier. We may support the wider freeqrcode.tools platform with advertising; ads never alter the files the tools produce, and downloaded images and documents contain no advertising and no watermark.',
    ],
  },
  {
    heading: '3. Your files are yours',
    paragraphs: [
      'You keep all rights in the images and documents you process and in the files you create with the tools. Only process files you own or have the right to edit, and check that your use of an output file — for a shop listing, a job application, an official form or anything else — is yours to make.',
      'Some outputs have rules set by other people. Passport and ID photo tools follow common official size and background templates, but the authority that issued your application decides what it accepts, and requirements differ by country. Social media sizes follow the platforms\u2019 published dimensions, which those platforms can change. Check the current requirement before you rely on a file.',
    ],
  },
  {
    heading: '4. Your data stays with you',
    paragraphs: [
      'As described in the privacy policy, processing happens in your browser and your files are never uploaded to us. You are responsible for keeping your own copies: the downloads you save are your records. We cannot recover a file you did not save, or one lost when a device fails, because we never held a copy.',
    ],
  },
  {
    heading: '5. Acceptable use',
    paragraphs: [
      'Use the tools only for lawful purposes, on files you have the right to work with. You must not use the tools to infringe another party\u2019s copyright or other rights, to create deceptive or fraudulent documents or images, or to attempt to disrupt, probe or overload the platform that serves the site. Removing metadata from a photo does not change who owns it or what it shows, and does not make an image yours.',
    ],
  },
  {
    heading: '6. No warranty',
    paragraphs: [
      'The tools are provided "as is" and "as available", without warranties of any kind, express or implied — including fitness for a particular purpose, uninterrupted availability, and freedom from errors. Browsers and devices handle large files and image formats differently; we work to keep the tools correct and reliable, but we do not guarantee that every file will process successfully on every device.',
    ],
  },
  {
    heading: '7. Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, QR Studio is not liable for any indirect or consequential loss arising from use of the tools — including a rejected application, a missed deadline, or a lost file — and our total liability in connection with the tools is limited to the amount you paid to use them, which is zero. Nothing in these terms limits liability that cannot lawfully be limited.',
    ],
  },
  {
    heading: '8. Changes',
    paragraphs: [
      'We may improve, change or withdraw features, and may update these terms; the current version will always be published on this page with its revision date. Continuing to use the tools after a change takes effect means you accept the updated terms. If a future change ever introduced uploads or accounts, it would be introduced as an explicit opt-in, not silently.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <h1 className="text-4xl font-extrabold tracking-tight">Terms of use</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: November 2026 · Image Resizer by QR Studio (imageresizer.freeqrcode.tools)
        </p>
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ))}
        <p className="mt-10 text-sm text-muted-foreground">
          Questions about these terms? See the{' '}
          <Link href="/contact" className="text-primary underline underline-offset-2">
            contact page
          </Link>{' '}
          and the{' '}
          <Link href="/privacy" className="text-primary underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
