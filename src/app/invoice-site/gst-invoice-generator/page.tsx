import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'GST Invoice Generator — Free Tax Invoices (GSTIN, HSN/SAC)',
  description:
    'Create GST invoices free: GSTIN for seller and buyer, HSN/SAC detail lines, GST rate per line and tax after discount — plus a plain-language GST invoice guide.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/gst-invoice-generator' },
  openGraph: {
    title: 'GST Invoice Generator — Free Tax Invoices (GSTIN, HSN/SAC)',
    description:
      'GSTINs, HSN/SAC lines and per-line GST rates on a clean tax invoice — free, in your browser.',
    url: 'https://invoicegenerator.freeqrcode.tools/gst-invoice-generator',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function GstPage() {
  return (
    <SeoLanding
      slug="/gst-invoice-generator"
      title="GST Invoice Generator"
      standfirst="GST countries — India, Pakistan, Australia, Canada, Singapore and others — all ask for the same discipline: registered tax numbers on the document, itemised lines, the GST rate applied openly, and corrections by credit or debit note. This free generator is built to that discipline, and this page explains the requirements it follows."
      sections={[
        {
          heading: 'What a GST invoice must contain',
          paragraphs: [
            'A compliant GST tax invoice typically shows: the seller\u2019s legal name, address and GST registration number (GSTIN in India, GST number or NTN-linked registration elsewhere); the buyer\u2019s name, address and GST number for business supplies; a unique sequential invoice number and date; a description of goods or services with HSN codes for goods or SAC codes for services where required; quantity, unit price and line value; the GST rate per line and the tax amount; and the total payable. In this generator, your registration number lives in your business profile (the Tax ID field), the buyer\u2019s in their client record, and the per-line SKU field carries HSN/SAC codes — all printed on the invoice and the PDF.',
            'Place-of-supply and split-tax regimes (such as CGST/SGST versus IGST in India) are handled by wording and rates: itemise the components in the tax label and notes as your rules require, or run separate lines where your accountant prefers. The generator\u2019s job is exact arithmetic and a faithful document — the tax label, rate and taxable flag per line give you the controls to express your regime\u2019s treatment precisely.',
          ],
        },
        {
          heading: 'Rates, discounts and rounding under GST',
          paragraphs: [
            'GST is charged on the value of the supply after trade discounts shown on the invoice — which is why the generator\u2019s default calculates tax after discount, spreading an invoice-level discount across taxable lines in proportion and rounding each line once, in minor units. Cash discounts given after invoicing do not reduce GST in most regimes unless strict conditions are met; the safe route is a credit note, which this site\u2019s Credit Note Generator produces with the same rates as the original invoice, keeping your input-tax-credit chain — and your customer\u2019s — intact.',
            'Rounding deserves respect at filing time: a one-cent drift per invoice becomes a reconciliation finding across a thousand. Because the calculation here is integer-based, the preview, the PDF, the dashboard and the CSV export all quote the same figures — the numbers you file are the numbers your customer sees.',
          ],
        },
        {
          heading: 'Exports, reverse charge and special cases',
          paragraphs: [
            'Export supplies are commonly zero-rated, and services to overseas clients may fall under reverse charge or place-of-supply rules that put the tax in the buyer\u2019s country. In the generator that means: zero rate on the lines, the buyer\u2019s overseas details on the client record, and the statement your regime requires ("export under LUT", "reverse charge applies", as applicable) placed in the invoice notes. The International Invoice Generator page on this site covers the commercial side — currencies, Incoterms and customs documents — while this page covers the tax document itself.',
            'Scope note: this page is general educational information about GST invoicing, not tax or legal advice, and rates, thresholds and formats change — India alone revises HSN reporting requirements as turnover grows. Verify your obligations with your tax authority or accountant; use the generator to produce exact, well-formed documents once the treatment is decided.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'Where do the GSTINs go on the invoice?',
          answer:
            'Your own GSTIN goes in your business profile\u2019s Tax ID field and prints in the invoice header area; the buyer\u2019s GSTIN goes in their client record\u2019s Tax ID field and prints with their details. Both are stored, so repeat invoices include them automatically.',
        },
        {
          question: 'How are HSN or SAC codes shown?',
          answer:
            'Each line item has a SKU/code field that prints next to the description on the preview and the PDF — use it for the HSN code of goods or the SAC code of services, at the digit length your turnover requires.',
        },
        {
          question: 'Is GST charged before or after discount?',
          answer:
            'In most GST regimes, on the discounted value — discounts recorded on the invoice reduce the taxable value. That is the generator\u2019s default; a per-invoice setting switches to tax-before-discount where a specific rule or agreement requires it, and the choice is stored with the invoice.',
        },
        {
          question: 'Can I fix a wrong GST invoice?',
          answer:
            'By credit note (reduce) or debit note (increase) referencing the original — never by editing or deleting an issued invoice, which breaks the sequential record and the customer\u2019s credit chain. Both note generators are linked from this site\u2019s tools.',
        },
      ]}
      related={[
        { href: '/vat-invoice-generator', label: 'VAT invoice generator' },
        { href: '/sales-tax-invoice-generator', label: 'Sales tax invoice generator' },
        { href: '/international-invoice-generator', label: 'International invoices' },
        { href: '/blog/proforma-invoice-vs-tax-invoice', label: 'Guide: proforma vs tax invoice' },
      ]}
    />
  );
}
