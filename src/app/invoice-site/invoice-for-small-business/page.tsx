import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'Invoice Generator for Small Businesses — Free & Professional',
  description:
    'Free invoicing for small businesses: multiple business profiles, client address book, tax-ready invoices, statements, aging reports and a cash-flow dashboard.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/invoice-for-small-business' },
  openGraph: {
    title: 'Invoice Generator for Small Businesses — Free & Professional',
    description:
      'Profiles, clients, tax, statements and an aging dashboard — the invoicing a small business needs, without the subscription.',
    url: 'https://invoicegenerator.freeqrcode.tools/invoice-for-small-business',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SmallBusinessPage() {
  return (
    <SeoLanding
      slug="/invoice-for-small-business"
      title="Invoice Generator for Small Businesses"
      standfirst="A small business outgrows spreadsheet invoices quickly: numbering drifts, tax is calculated three different ways, and nobody can say who owes what. This free generator gives you the discipline of accounting software — sequential numbering, saved clients, per-currency totals and an aging dashboard — with none of the subscription, setup or learning curve."
      sections={[
        {
          heading: 'Several trading names? Use business profiles',
          paragraphs: [
            'Many small businesses bill from more than one identity: the registered company, a trading name, a side venture. Business profiles keep each one separate — its own logo, address, tax numbers, bank details, brand colour, invoice numbering and default terms — and you pick the right profile when you create an invoice. A profile\u2019s defaults (currency, tax label and rate, payment terms, footer text) pre-fill every new document, so staff produce consistent invoices without memorising house rules.',
            'Numbering is automatic and sequential per profile, with your own prefix and suffix, which keeps auditors and your accountant happy: no gaps you cannot explain, no duplicates, and a clean sequence per entity.',
          ],
        },
        {
          heading: 'Cash flow you can actually see',
          paragraphs: [
            'The dashboard is the page owners open on Monday morning. It shows billed, collected and outstanding per currency; how the unpaid money ages (not yet due, 0–30, 31–60, 61–90 and over 90 days); a status view from draft to paid; average invoice value and collection rate; and revenue by month and by year. Date-range filters — today, the last 7 or 30 days, this month, last month, this year or a custom range — answer "how did we do?" without exporting anything.',
            'When a customer rings to ask what they owe, the client statement settles it in one PDF: every invoice, every payment, every balance. And when the accountant asks for the quarter, the CSV export gives them every invoice as a spreadsheet row, while the invoice list itself filters by status, client and text search.',
          ],
        },
        {
          heading: 'Tax-ready documents, in your terminology',
          paragraphs: [
            'The tax label and rate are yours to set per profile and per invoice — VAT, GST, sales tax or your local term — with per-line taxable flags for mixed supplies and a choice of taxing before or after discount. Seller and buyer tax IDs print on the document, and credit notes, debit notes, proforma invoices, purchase orders and delivery notes are one click away in the companion tools, all sharing the same numbering discipline. The VAT, GST and sales-tax pages on this site explain what each document must show; for anything beyond the basics, your accountant remains the authority — the tool\u2019s job is to make the paperwork exact.',
          ],
        },
        {
          heading: 'Grows with the business, costs nothing to run',
          paragraphs: [
            'Because there is no per-seat or per-invoice pricing, the generator fits a business at any size: a sole trader today, a small team tomorrow (share data between computers with the JSON backup and import), a second brand next year as another profile. Everything lives in the browser, works offline once loaded, and never puts a watermark on a customer-facing document. Your invoices look like they came from a business that has its act together — because with this paperwork, it does.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'Can different staff use it on different computers?',
          answer:
            'Yes. Data is stored per browser, and the Backup & data section exports everything — profiles, clients and invoices — as one JSON file you can import on another machine. Many small businesses keep one "office" browser as the master copy and share backups at week end.',
        },
        {
          question: 'Does it handle VAT or GST?',
          answer:
            'It handles the document side completely: your registration numbers on the invoice, per-line taxable flags, tax before or after discount, and credit/debit notes that mirror the original tax treatment. Registration thresholds and filing rules depend on your country — the VAT and GST guides on this site explain the paperwork, and your accountant advises on the rules.',
        },
        {
          question: 'Can I see who owes us money at a glance?',
          answer:
            'That is the dashboard\u2019s aging view: every outstanding balance bucketed by how overdue it is, per currency, plus a per-client history with invoiced, paid and outstanding totals in the address book. A statement PDF per client turns any "how much do I owe?" call into a one-minute answer.',
        },
        {
          question: 'What does it cost as we grow?',
          answer:
            'Nothing changes: the generator is free, with no invoice limits and no paid tier. Growth features — multiple profiles, recurring invoices, statements, exports — are all included from the first day.',
        },
      ]}
      related={[
        { href: '/invoice-for-freelancers', label: 'Invoices for freelancers' },
        { href: '/invoice-for-contractors', label: 'Invoices for contractors' },
        { href: '/vat-invoice-generator', label: 'VAT invoice generator' },
        { href: '/blog/what-to-include-on-an-invoice', label: 'Guide: what an invoice must include' },
      ]}
    />
  );
}
