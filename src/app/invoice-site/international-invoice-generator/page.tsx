import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'International Invoice Generator — Multi-Currency, Export-Ready',
  description:
    'Invoice overseas clients properly: full ISO currency support, bank and SWIFT details, IBAN payment text, per-currency reporting and commercial invoices.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/international-invoice-generator' },
  openGraph: {
    title: 'International Invoice Generator — Multi-Currency, Export-Ready',
    description:
      'Bill in your client\u2019s currency, show SWIFT/IBAN details, and keep every currency\u2019s totals separate — free.',
    url: 'https://invoicegenerator.freeqrcode.tools/international-invoice-generator',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function InternationalPage() {
  return (
    <SeoLanding
      slug="/international-invoice-generator"
      title="International Invoice Generator"
      standfirst="Invoicing across borders adds three problems domestic billing never meets: money in another currency with its own decimal rules, payment details a foreign bank can actually use, and tax wording that satisfies two countries at once. This free generator is built for all three — and it never pretends exchange rates away by blending your currencies into one meaningless total."
      sections={[
        {
          heading: 'Real currency support, not a dropdown of ten',
          paragraphs: [
            'Choose from the full list of widely used ISO currencies, formatted the way each currency is actually written — symbol placement and decimal digits included. Zero-decimal currencies like the yen are calculated and displayed with no decimals; three-decimal currencies like the Kuwaiti or Bahraini dinar keep all three. Because amounts are computed in each currency\u2019s minor units, a total in dinars is as exact as a total in dollars.',
            'Reporting respects the same boundary: the dashboard, client histories and statements keep a separate set of totals per currency — billed, collected, outstanding, aging — and never sum across currencies. If you need a single reporting figure for your accounts, convert in your accounting system at your bank\u2019s rate; an invoice tool that invents an exchange rate invents your revenue too.',
          ],
        },
        {
          heading: 'Payment details a foreign bank can use',
          paragraphs: [
            'Your business profile carries structured bank fields — bank name, account title, account number or IBAN, and SWIFT/BIC — which print in the payment section and feed the payment QR or details text on the invoice. International clients pay faster when the invoice answers the questions their bank will ask: whose account, which bank, which code, which currency, and which reference (the invoice number — which the client statement and your ledger both use to match the payment when it lands, fees and all).',
            'A practical note on amounts: intermediary banks deduct fees from international transfers, so the sum that arrives is often a few units short. The payments ledger handles that gracefully — record what actually arrived, and the small remaining balance stays visible until you agree it as a short payment or the client tops it up. Nothing is silently written off; the decision stays yours and stays documented.',
          ],
        },
        {
          heading: 'Tax wording for two jurisdictions',
          paragraphs: [
            'Cross-border services are frequently zero-rated at home with the tax accounted for by the buyer under reverse-charge rules; cross-border goods follow export rules and travel with a commercial invoice for customs (HS codes, origin, weights, Incoterms) rather than a services invoice. The generator supports both patterns: per-line taxable flags and rates for the invoice itself, your tax and VAT numbers in the profile and client records, and notes/terms space for the statements your regime requires. The Commercial Invoice Generator companion tool builds the customs document, and the VAT and GST pages here explain the tax-invoice side.',
            'This remains general educational information, not tax or customs advice: place-of-supply rules, digital-services regimes and withholding taxes differ by country pair and change often. Decide the treatment with your accountant once, encode it in your profile defaults and client records, and every invoice after that applies it consistently.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'Which currency should I invoice in?',
          answer:
            'Yours or the client\u2019s — the one your contract states. Billing in the client\u2019s currency wins goodwill and removes their conversion friction; billing in yours removes your exchange risk. Either way, the generator formats and calculates it exactly, and the client\u2019s default currency is saved in their record.',
        },
        {
          question: 'Does the tool convert currencies for reporting?',
          answer:
            'Deliberately not. Exchange rates move and banks apply their own, so blending currencies would fabricate figures. Totals, dashboards and statements are kept strictly per currency; convert in your accounting system at the rate you actually received.',
        },
        {
          question: 'What bank details should an international invoice show?',
          answer:
            'Bank name, account title, IBAN or account number, and SWIFT/BIC — plus the invoice number as the payment reference. All four fields live in your business profile and print on the invoice and its payment QR text.',
        },
        {
          question: 'Do I need a commercial invoice as well?',
          answer:
            'For goods crossing a border, yes: customs needs HS codes, origin, weights and Incoterms, which a services-style invoice does not carry. The free Commercial Invoice Generator on the main tools site produces it in the same style, and the two documents share the invoice number so the file stays coherent.',
        },
      ]}
      related={[
        { href: '/vat-invoice-generator', label: 'VAT invoice generator' },
        { href: '/gst-invoice-generator', label: 'GST invoice generator' },
        { href: '/invoice-for-freelancers', label: 'Invoices for freelancers' },
        { href: '/blog/how-to-write-an-invoice', label: 'Guide: how to write an invoice' },
      ]}
    />
  );
}
