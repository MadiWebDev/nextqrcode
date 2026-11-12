import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'Invoice Generator for Contractors — Deposits, Progress & Retentions',
  description:
    'Free invoicing for contractors and trades: quote conversion, progress billing, deposits, materials and labour lines, delivery notes and payment tracking that survives real job sites.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/invoice-for-contractors' },
  openGraph: {
    title: 'Invoice Generator for Contractors — Deposits, Progress & Retentions',
    description:
      'Quotes that convert, progress invoices, deposits and balances — invoicing built for how contractors actually get paid.',
    url: 'https://invoicegenerator.freeqrcode.tools/invoice-for-contractors',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function ContractorsPage() {
  return (
    <SeoLanding
      slug="/invoice-for-contractors"
      title="Invoice Generator for Contractors"
      standfirst="Contracting runs on staged money: a quote the customer signs, a deposit before materials are ordered, progress invoices as stages complete, and a final balance — sometimes minus a retention — at handover. This free generator follows that flow end to end, from accepted quote to paid-in-full, using documents your customer\u2019s office can process without a phone call."
      sections={[
        {
          heading: 'From signed quote to first invoice in one click',
          paragraphs: [
            'Jobs start with a price the customer agrees to. The Quote Generator produces a professional quotation with optional extras shown separately, a validity window and an acceptance line; when the customer accepts, mark it accepted and convert it to an invoice — same lines, same prices, same tax, with the quote number referenced on the invoice. No re-typing, no transposed figures, and a paper trail that proves the final bill matches the approved price.',
            'On site, the paperwork continues: delivery notes (challans) record what actually arrived, purchase orders keep your own buying in the same numbering discipline, and proforma invoices handle customers who need a document before the work is done. Each tool is free and works the same way, so the whole job file tells one consistent story.',
          ],
        },
        {
          heading: 'Progress billing and deposits, tracked properly',
          paragraphs: [
            'For stage payments, invoice the stage as its own document or invoice the full contract value and record each stage payment in the ledger as it lands — deposit, progress, balance. Either way the generator tracks it: the invoice shows payments received with dates and methods, the remaining balance is always exact, and a PAID stamp appears only when the balance truly clears. Partial payments from awkward customers stop being an accounting headache; they are just lines in the ledger.',
            'Retentions are handled the honest way: invoice the full stage value, record what was actually paid, and the retained percentage simply remains as balance until the retention is released — then record that payment too. Your aging report keeps the retention visible instead of letting it evaporate from the books, which is where most small contractors lose it.',
          ],
        },
        {
          heading: 'Lines that describe real work',
          paragraphs: [
            'Contractor invoices mix labour, materials and plant: quantities in decimals (2.5 days, 0.5 loads), units you define, per-line discounts where you sharpened a price, and SKU or detail lines for the spec ("600×600 porcelain, batch B"). Taxable flags per line handle the common mixed case — labour taxed, some materials not, or the reverse under your local rules — with tax calculated after discount the way most regimes expect. Variations and extras belong on a debit note against the original invoice, so the contract sum\u2019s history stays auditable instead of quietly edited.',
          ],
        },
        {
          heading: 'Getting paid from site cabins and kitchen tables',
          paragraphs: [
            'The generator lives in the browser on your phone as happily as on the office PC: raise the invoice at handover, print the payment QR beside the totals so the customer can pay from the document itself, and send by email or WhatsApp from the invoice list. The dashboard\u2019s aging view tells you which balances need a call this week, and the reminder letter templates escalate politely, firmly, then finally — each one accurate because the ledger behind it is accurate.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'How do I show a retention on an invoice?',
          answer:
            'Invoice the full stage value and record the amount actually received as a payment; the retention simply remains as the outstanding balance, visible in your aging report until it is released and recorded. If your customer needs the retention itemised, add a note in the invoice notes naming the percentage and the release condition.',
        },
        {
          question: 'Can a quote become the invoice?',
          answer:
            'Yes — that is the designed flow. Set the quote\u2019s status to Accepted and use Convert to invoice: the invoice is created as a draft in this generator with identical lines, prices, discount and tax, referencing the quote number and taking the next number from your saved profile.',
        },
        {
          question: 'How should extras and variations be billed?',
          answer:
            'Agree them in writing first, then either add them to a stage invoice as their own lines or issue a debit note against the original invoice referencing the variation. Both keep the audit trail clean; silently editing an issued invoice does not.',
        },
        {
          question: 'Does it work on a phone on site?',
          answer:
            'Yes — it is a web app that runs in any modern mobile browser, and your data is stored on the device. Raise, preview and send the PDF before you leave the driveway; sync to the office later with the JSON backup and import.',
        },
      ]}
      related={[
        { href: '/invoice-for-small-business', label: 'Invoices for small businesses' },
        { href: '/printable-invoice-template', label: 'Printable invoice templates' },
        { href: '/blog/how-to-write-an-invoice', label: 'Guide: how to write an invoice' },
        { href: '/blog/how-to-chase-late-payments', label: 'Guide: chasing late payments' },
      ]}
    />
  );
}
