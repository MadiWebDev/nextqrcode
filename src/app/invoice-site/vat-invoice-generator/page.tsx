import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'VAT Invoice Generator — Free Tax Invoices with VAT Breakdown',
  description:
    'Create VAT invoices free: seller and buyer VAT numbers, per-line taxable flags, net/VAT/gross breakdown, tax before or after discount, credit notes — with a guide to what a VAT invoice must show.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/vat-invoice-generator' },
  openGraph: {
    title: 'VAT Invoice Generator — Free Tax Invoices with VAT Breakdown',
    description:
      'VAT numbers, line-level tax treatment and a clean net/VAT/gross breakdown — VAT invoices done properly, free.',
    url: 'https://invoicegenerator.freeqrcode.tools/vat-invoice-generator',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function VatPage() {
  return (
    <SeoLanding
      slug="/vat-invoice-generator"
      title="VAT Invoice Generator"
      standfirst="A VAT invoice is a tax document first and a bill second: it must identify both parties\u2019 VAT numbers, show the net amount, the VAT rate and the VAT charged, line by line where rates differ. This free generator produces exactly that — and this page explains the rules it follows, in plain language."
      sections={[
        {
          heading: 'What a VAT invoice must show',
          paragraphs: [
            'Although details differ between VAT regimes (the EU, the UK, the Gulf states and others), a full VAT invoice generally requires: the words identifying it as a tax or VAT invoice where local law demands them; a unique sequential invoice number; the issue date (and the supply date, if different); the seller\u2019s name, address and VAT registration number; the buyer\u2019s name, address and — for business customers in most regimes — their VAT number; a description of the goods or services; per line, the quantity, unit price, VAT rate and net amount; the total net, the VAT broken down by rate, and the gross total. This generator captures all of it: your VAT number lives in your business profile, the buyer\u2019s in their client record, and both print on the document.',
            'Two habits protect you. First, sequential numbering with no silent edits — corrections go on credit or debit notes, never by rewriting an issued invoice. Second, consistency: the VAT treatment on a credit note mirrors the invoice it corrects, at the same rates, so your return and your customer\u2019s return tell the same story.',
          ],
        },
        {
          heading: 'Mixed rates, exempt lines and discounts — handled per line',
          paragraphs: [
            'Real invoices mix taxable, reduced-rate, zero-rated and exempt lines. Each line in the generator has its own taxable flag, so a zero-rated or exempt item never quietly absorbs VAT, and the invoice-level calculation spreads any percentage or fixed discount across the taxable lines in proportion before tax — the order of operations most VAT rules assume. If your regime taxes before discount instead, one setting flips it, and the choice is stored on the invoice itself so a reprint years later calculates identically.',
            'Reverse-charge supplies (common for B2B services across EU borders) are a wording exercise as much as a calculation: set the VAT rate to zero, mark the lines accordingly, and put the reverse-charge statement your regime requires into the invoice notes or terms — for example that VAT is accounted for by the recipient. The document then shows net equals gross with the legal note attached, which is what the customer\u2019s accountant needs to self-assess.',
          ],
        },
        {
          heading: 'Set it up once: your VAT defaults',
          paragraphs: [
            'In your business profile, store your VAT number, set the tax label to "VAT" and your standard rate; every new invoice inherits them. Clients who are VAT-registered get their number saved in the address book. Ten print templates present the same figures in different styles — the tax maths never changes with the design — and the client statement and dashboard aggregate per currency without ever mixing VAT-inclusive totals across currencies.',
            'A note on scope: this page is general educational information about how VAT invoices work, not tax or legal advice, and it does not certify compliance for any specific transaction. Registration thresholds, place-of-supply rules, digital-services rules and invoicing deadlines vary by country and change over time. The generator gives you an exact, well-formed document; your accountant or tax authority confirms the treatment behind it.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'What is the difference between a VAT invoice and a normal invoice?',
          answer:
            'A VAT invoice carries the extra tax particulars — both VAT numbers, the rate applied per line, and the VAT amount separated from the net — because the buyer uses it to reclaim input VAT and the seller uses it to declare output VAT. Only VAT-registered businesses issue them; if you are not registered, you issue ordinary invoices and must not charge or itemise VAT.',
        },
        {
          question: 'Do I need my customer\u2019s VAT number on the invoice?',
          answer:
            'For business customers, in most regimes yes — especially for cross-border and reverse-charge supplies, where the buyer\u2019s valid VAT number is a condition of zero-rating. Save it in the client record here and it prints automatically. For retail consumers, a simplified invoice with less buyer detail is usually acceptable.',
        },
        {
          question: 'Can I correct a VAT invoice after issuing it?',
          answer:
            'Not by editing it. Issue a credit note (to reduce) or debit note (to increase) that references the original invoice number and mirrors its VAT rates; the original and the correction together are the record. Both documents are available as companion tools and follow the same numbering discipline.',
        },
        {
          question: 'Does the generator file my VAT return?',
          answer:
            'No — it creates correct invoices and exports your data (CSV of every invoice, full JSON backup) for your accounting software or accountant. Filing rules and deadlines are set by your tax authority; nothing here submits anything on your behalf.',
        },
      ]}
      related={[
        { href: '/gst-invoice-generator', label: 'GST invoice generator' },
        { href: '/sales-tax-invoice-generator', label: 'Sales tax invoice generator' },
        { href: '/international-invoice-generator', label: 'International invoices' },
        { href: '/blog/proforma-invoice-vs-tax-invoice', label: 'Guide: proforma vs tax invoice' },
      ]}
    />
  );
}
