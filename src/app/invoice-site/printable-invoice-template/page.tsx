import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'Printable Invoice Template — Print-Ready PDFs in A4 & Letter',
  description:
    'Fill in a printable invoice template and download a print-perfect PDF: A4 or Letter, portrait or landscape, repeated headers and page numbers — no Word wrestling.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/printable-invoice-template' },
  openGraph: {
    title: 'Printable Invoice Template — Print-Ready PDFs in A4 & Letter',
    description:
      'A template that behaves like a document, not a spreadsheet: correct paper sizes, clean multi-page tables and a PDF that prints exactly as previewed.',
    url: 'https://invoicegenerator.freeqrcode.tools/printable-invoice-template',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function PrintablePage() {
  return (
    <SeoLanding
      slug="/printable-invoice-template"
      title="Printable Invoice Template"
      standfirst="A printable invoice template should do one thing perfectly: produce a document that comes out of any printer, on any desk, looking like it did on your screen. This free generator is that template — live preview on the left, a print-exact PDF on download, in A4 or Letter, portrait or landscape, with long invoices paginated properly instead of sliced in half."
      sections={[
        {
          heading: 'Why spreadsheet and document templates fail at printing',
          paragraphs: [
            'The classic failures are familiar: the totals slide onto page two alone, the table header vanishes after the first page so page three is a wall of orphaned numbers, margins differ between the office printer and the client\u2019s, and the "template" quietly recalculates a total differently from the quote the client approved. Each one makes a business look slightly careless at the exact moment it is asking to be paid.',
            'This generator is not a static file you wrestle — it is a form that fills a designed document. The preview is the document, rendered the same way the PDF will be: pick a template, watch your logo, brand colour and lines compose themselves, then download. The PDF engine repeats the items-table header on every page, numbers the pages, keeps your footer and payment details attached, and stamps PAID, OVERDUE or DRAFT across the page when the status calls for it.',
          ],
        },
        {
          heading: 'Paper, orientation and long invoices',
          paragraphs: [
            'Design settings live on each invoice: A4 or Letter paper, portrait for standard billing or landscape when your lines run wide (many columns, long descriptions, timesheet-style entries), one of ten templates, an accent colour and a font size scale for clients who print small text badly. A sixty-line invoice paginates cleanly across three pages with headers repeated and "Page 2 of 3" in the footer; a one-line invoice sits elegantly on a single page with no cavernous gaps.',
            'Printing straight from the browser works too — the editor\u2019s print action opens the generated PDF, which any printer driver handles predictably, instead of printing the web page with its buttons and navigation. Email the same PDF and the client\u2019s printout matches yours pixel for pixel; that consistency is what "printable template" should mean.',
          ],
        },
        {
          heading: 'Filling the template well',
          paragraphs: [
            'A template only carries the information you give it: business name and address, a tax number where you are registered, the client\u2019s full details, itemised lines with quantities and unit prices rather than one lump "services", the tax rate stated openly, payment terms and a due date as a date — not "on receipt" — and bank details or a payment QR so the printed page can be paid from directly. Save your profile and clients once and every future print starts complete; keep a paper copy policy simple — the PDF is the copy, stored with its invoice record, re-printable identically at any time because its calculation settings are stored with it.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'Is the PDF exactly what the preview shows?',
          answer:
            'Yes — the same template definition drives both, and the same calculation engine totals them, so amounts, layout and stamps agree. Fonts render in the PDF\u2019s standard faces, chosen to match the preview\u2019s character per template (sans or serif).',
        },
        {
          question: 'Can I print in Letter size or landscape?',
          answer:
            'Both are per-invoice design settings: A4 or Letter, portrait or landscape. The items table, headers and footers adapt to the page you choose, and multi-page invoices repeat the table header with page numbers throughout.',
        },
        {
          question: 'Do printed invoices show a watermark?',
          answer:
            'No watermark, ever. The only overlays are the status stamps that belong there — PAID, OVERDUE or DRAFT — which you can hide in the design settings when a template should print without them.',
        },
        {
          question: 'Can I keep my branding on every printout?',
          answer:
            'Yes: logo, brand colour, business details and footer text live in your profile and apply to every invoice; a per-invoice accent colour and template choice handle the rest. Your tenth printout looks as considered as your first.',
        },
      ]}
      related={[
        { href: '/invoice-template', label: 'Invoice templates — the ten designs' },
        { href: '/invoice-for-contractors', label: 'Invoices for contractors' },
        { href: '/blog/how-to-write-an-invoice', label: 'Guide: how to write an invoice' },
        { href: '/blog/invoice-mistakes-that-delay-payment', label: 'Guide: mistakes that delay payment' },
      ]}
    />
  );
}
