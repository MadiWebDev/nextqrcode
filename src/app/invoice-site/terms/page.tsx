import type { Metadata } from 'next';
import Link from 'next/link';

const DESCRIPTION =
  'The terms of use for the free Invoice Generator by QR Studio: what the tool does, what it does not do, and your responsibilities when using its documents.';

export const metadata: Metadata = {
  title: 'Terms of Use — Invoice Generator',
  description: DESCRIPTION,
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/terms' },
  openGraph: {
    title: 'Terms of Use — Invoice Generator',
    description: DESCRIPTION,
    url: 'https://invoicegenerator.freeqrcode.tools/terms',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use — Invoice Generator',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: '1. The service',
    paragraphs: [
      'The Invoice Generator ("the tool") is a free, browser-based invoicing application provided by QR Studio as part of the freeqrcode.tools family. It lets you create invoices, quotes-adjacent documents, receipts and client statements; keep a business profile and client list in your browser; track payments; and download PDF documents. By using the tool you accept these terms. If you do not accept them, please do not use the tool.',
    ],
  },
  {
    heading: '2. Free means free',
    paragraphs: [
      'There is no charge for using the tool, no account to create, and no paid tier. We may support the wider freeqrcode.tools platform with advertising; ads never alter the documents the tool produces, and generated PDFs contain no advertising and no watermark.',
    ],
  },
  {
    heading: '3. Your documents are your responsibility',
    paragraphs: [
      'The tool calculates totals, tax and balances from the figures you enter, and formats documents from the details you provide. You are responsible for the accuracy and legality of every document you issue with it — including the correct tax name, rate and registration number for your jurisdiction, the correct legal names of the parties, and compliance with your local invoicing, record-keeping and tax-filing requirements.',
      'The tool is a document and calculation aid. It is not accounting, tax or legal advice, and it does not file anything with any authority. Tax rules differ by country and change over time; for anything material, take advice from a qualified accountant or tax professional in your jurisdiction.',
    ],
  },
  {
    heading: '4. Your data stays with you',
    paragraphs: [
      'As described in the privacy policy, your profile, clients and invoices are stored only in your browser\u2019s local storage. You are responsible for keeping your own records: download the PDFs of documents you issue, and export backups regularly. We cannot recover data lost when browser storage is cleared, a device fails, or a backup file is misplaced, because we never held a copy.',
    ],
  },
  {
    heading: '5. Acceptable use',
    paragraphs: [
      'Use the tool only for lawful invoicing and record-keeping for real goods, services and transactions. You must not use it to create fraudulent, misleading or fictitious documents; to impersonate another business; to infringe another party\u2019s rights; or to attempt to disrupt, probe or overload the platform that serves it. Payment details and QR codes you place on documents are your own, and you are responsible for their accuracy.',
    ],
  },
  {
    heading: '6. No warranty',
    paragraphs: [
      'The tool is provided "as is" and "as available", without warranties of any kind, express or implied — including fitness for a particular purpose, uninterrupted availability, and freedom from errors. Browsers, devices and local storage behave differently; we work to keep the tool correct and reliable, but we do not guarantee that it will be error-free or that stored data will persist in your browser.',
    ],
  },
  {
    heading: '7. Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, QR Studio is not liable for any indirect or consequential loss arising from use of the tool — including lost payments, tax penalties, or lost records — and our total liability in connection with the tool is limited to the amount you paid to use it, which is zero. Nothing in these terms limits liability that cannot lawfully be limited.',
    ],
  },
  {
    heading: '8. Changes',
    paragraphs: [
      'We may improve, change or withdraw features, and may update these terms; the current version will always be published on this page with its revision date. Continuing to use the tool after a change takes effect means you accept the updated terms. If a future change ever introduced accounts or server storage, it would be introduced as an explicit opt-in, not silently.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <h1 className="text-4xl font-extrabold tracking-tight">Terms of use</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: November 2026 · Invoice Generator by QR Studio
          (invoicegenerator.freeqrcode.tools)
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
