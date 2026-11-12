import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'Sales Tax Invoice Generator — Free, Nexus-Aware by Design',
  description:
    'Create sales-tax invoices free: per-line taxable flags for mixed baskets, tax after discount, exemption notes and multi-state clients — with a plain guide.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/sales-tax-invoice-generator' },
  openGraph: {
    title: 'Sales Tax Invoice Generator — Free, Nexus-Aware by Design',
    description:
      'Per-line taxable flags, clean tax lines and exemption notes — sales tax invoices without the spreadsheet pain.',
    url: 'https://invoicegenerator.freeqrcode.tools/sales-tax-invoice-generator',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SalesTaxPage() {
  return (
    <SeoLanding
      slug="/sales-tax-invoice-generator"
      title="Sales Tax Invoice Generator"
      standfirst="US-style sales tax is a patchwork: rates set by state, county and city; some goods taxable in one state and exempt in the next; the buyer\u2019s location usually deciding the rate. This free generator gives you the invoice-level controls that patchwork demands — a tax label and rate you set per invoice, and a taxable flag on every line."
      sections={[
        {
          heading: 'How sales tax shows up on an invoice',
          paragraphs: [
            'Unlike VAT or GST, sales tax is charged once, to the final consumer, at the rate of the place the rules point to (often the delivery address in destination-sourcing states). On the invoice it appears as its own line after the discounted subtotal, with shipping taxed or not depending on the state and how it is stated. The generator mirrors that structure: the tax label reads "Sales Tax" (or your state\u2019s wording), the rate is set per invoice — because the next client may be in a different tax jurisdiction — and shipping is added after tax, with the per-line taxable flags deciding what the rate applies to.',
            'Keep the rate\u2019s source honest: use the combined rate for the delivery location, and if you regularly sell into several states, save the client\u2019s location in their address-book record and note the rate basis in the invoice notes. When a rate changes mid-year, new invoices use the new rate while old ones keep theirs — the rate is stored on each invoice, so history never rewrites itself.',
          ],
        },
        {
          heading: 'Mixed baskets, exemptions and resale',
          paragraphs: [
            'The taxable flag per line earns its keep on mixed invoices: taxable goods alongside exempt services, groceries or clothing-under-threshold items, each following its own rule while sharing one document and one tax line computed only on the taxable portion. For exempt buyers — nonprofits, government, resellers with a certificate on file — set the rate to zero and record the basis in the notes ("resale certificate on file", "exempt organisation"), so the invoice itself explains why no tax was charged if it is ever examined.',
            'Discounts interact simply: trade discounts reduce the taxable amount in most states, which matches the generator\u2019s default of taxing after discount; manufacturer coupons and rebates are treated differently in some states, and there the tax-before-discount setting exists. As with every page in this section: this is general educational information, not tax advice — nexus, sourcing and exemption rules are state law, and a state\u2019s own revenue department publishes the deciding word.',
          ],
        },
        {
          heading: 'Records that survive an audit',
          paragraphs: [
            'Sales-tax audits sample invoices, so each one should stand alone: sequential number, dates, both parties identified, lines itemised with tax treatment visible, the rate and tax amount stated, and payments recorded against it. The generator\u2019s habits give you that by default — automatic numbering, a payments ledger with dates and methods, credit notes for corrections instead of edits, and CSV export of every invoice when the auditor (or your accountant at filing time) wants the population, not a sample.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'Which rate should I use for an out-of-state customer?',
          answer:
            'It depends on nexus and the state\u2019s sourcing rule — commonly the rate at the delivery address when you have nexus in that state, and no tax collected when you do not (the buyer may owe use tax). The generator lets you set the rate per invoice precisely because the answer changes per customer; confirm your nexus position with your state or an accountant.',
        },
        {
          question: 'Is shipping taxable?',
          answer:
            'It varies by state and by how delivery is charged and stated. The generator adds shipping after tax by default; where your state taxes delivery on taxable goods, include it in a taxable line instead. Check your state\u2019s rule — it is one of the most commonly audited details.',
        },
        {
          question: 'How do I invoice a tax-exempt customer?',
          answer:
            'Set the tax rate to zero, keep their exemption or resale certificate on file, and note the basis on the invoice itself. The document then shows a deliberate zero with its reason, rather than a missing tax line.',
        },
        {
          question: 'Does the tool file sales tax returns?',
          answer:
            'No. It produces correct invoices and exports complete records (CSV and JSON) for your filing or your accountant. Filing periods, forms and remittance are handled with your state\u2019s revenue department.',
        },
      ]}
      related={[
        { href: '/vat-invoice-generator', label: 'VAT invoice generator' },
        { href: '/gst-invoice-generator', label: 'GST invoice generator' },
        { href: '/invoice-for-small-business', label: 'Invoices for small businesses' },
        { href: '/blog/what-to-include-on-an-invoice', label: 'Guide: what an invoice must include' },
      ]}
    />
  );
}
