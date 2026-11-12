import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'Invoice Generator for Freelancers — Free, No Sign-Up',
  description:
    'Free invoice generator for freelancers: saved clients, per-project lines, deposits and partial payments, recurring retainers and late-payment tracking — no sign-up.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/invoice-for-freelancers' },
  openGraph: {
    title: 'Invoice Generator for Freelancers — Free, No Sign-Up',
    description:
      'Invoices freelancers actually need: deposits, milestones, partial payments, retainers and polite chasing — free in your browser.',
    url: 'https://invoicegenerator.freeqrcode.tools/invoice-for-freelancers',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function FreelancersPage() {
  return (
    <SeoLanding
      slug="/invoice-for-freelancers"
      title="Invoice Generator for Freelancers"
      standfirst="Freelance invoicing has its own shape: deposits before you start, milestones as you go, a balance on delivery, and the occasional client who needs a nudge. This free generator is built around that reality — it remembers your clients, tracks partial payments against each invoice, and turns retainers into fresh drafts on schedule, all without an account or a subscription."
      sections={[
        {
          heading: 'Bill the way freelance work actually happens',
          paragraphs: [
            'Most freelance projects are not a single payment at the end. There is a deposit to book the work, progress payments at agreed milestones, and a final balance when the files ship. The generator handles that with a real payments ledger: every payment is recorded against the invoice with its date, amount and method, and the invoice shows exactly where it stands — sent, partially paid, overdue, or paid in full with a PAID stamp on the PDF. Your client always sees one document and one remaining balance, never a confusing chain of separate bills.',
            'Line items carry the detail freelance clients approve against: a description, an optional detail line for scope notes, a quantity that accepts decimals (3.5 hours is a real thing), per-line discounts for the friendly rate you promised, and a taxable flag for mixed work. If you bill by the hour, the companion Timesheet Invoice Generator turns dated time entries into an invoice with a project summary; if you quote first, the Quote Generator converts an accepted quote into an invoice without retyping.',
          ],
        },
        {
          heading: 'Deposits, retainers and repeat clients',
          paragraphs: [
            'A deposit is just the first ledger payment: issue the full invoice, record the deposit when it lands, and the balance updates itself. Retainers and subscriptions map to recurring invoices — set a template to repeat weekly, monthly, quarterly or yearly and a correctly numbered draft is waiting when you open the app on the day. Nothing is ever sent automatically; you review and send each draft yourself, which is exactly the control you want over client communication.',
            'Repeat clients are where the time savings compound. Your address book stores each client once — company, contact person, address, tax ID, their default currency and their usual terms — and the next invoice to them starts half-written. A per-client statement PDF answers "what do I owe you in total?" with one document, which quietly makes you look like the most organised supplier they deal with.',
          ],
        },
        {
          heading: 'Late payment is a process, not an argument',
          paragraphs: [
            'The dashboard shows aging buckets — who owes what, and how long it has been owed — so a late invoice never hides inside a pile of sent mail. When a payment slips, work through the polite-reminder, firmer-reminder and final-notice templates in the Payment Reminder Letter Generator, each referencing the invoice number, the amount and the days overdue. Because your ledger has the real dates and amounts, every reminder is accurate, which keeps the conversation factual instead of emotional.',
            'Prevention beats chasing: state terms before work starts, put the due date and your payment details or payment QR on the invoice itself, and invoice on delivery rather than at month end. The generator supports all three habits — terms presets you can reuse, a payment QR printed beside the totals, and an invoice that takes two minutes to raise while the work is still fresh in the client\u2019s mind.',
          ],
        },
        {
          heading: 'Your data stays yours',
          paragraphs: [
            'There is no account because there is no server copy of your business: profiles, clients and invoices are stored in your own browser, and a full JSON backup (plus CSV export for your accountant) takes your data anywhere. Work in multiple currencies without fear — totals are kept per currency and never blended, and money is calculated in minor units so the PDF and the preview always agree to the last cent.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'How much should a freelancer charge as a deposit?',
          answer:
            'Thirty to fifty percent before starting is standard for project work, with the balance on delivery; for long projects, split into milestone payments (for example 40/30/30) so neither side carries too much risk. Whatever you agree, record the deposit as a payment on the invoice in this generator — the balance, the status and the PDF stamp all update automatically.',
        },
        {
          question: 'Can I invoice clients in different currencies?',
          answer:
            'Yes. Each invoice carries its own currency from a full ISO list, the dashboard reports totals per currency, and amounts in different currencies are never added together. Your client\u2019s default currency is saved in the address book, so repeat invoices start in the right currency automatically.',
        },
        {
          question: 'How do I invoice a monthly retainer?',
          answer:
            'Create the invoice once, mark it recurring monthly with the next issue date, and a fresh draft — new number, new dates — is prepared whenever you open the app on or after that date. You review and send it yourself each month; pause the template whenever the engagement pauses.',
        },
        {
          question: 'Is it really free for unlimited invoices?',
          answer:
            'Yes. There is no invoice limit, no watermark and no paid tier hiding the export button. The tool is part of QR Studio\u2019s free tools collection and is supported by the main site, not by charging freelancers per invoice.',
        },
      ]}
      related={[
        { href: '/invoice-for-small-business', label: 'Invoices for small businesses' },
        { href: '/recurring-invoice-generator', label: 'Recurring invoice generator' },
        { href: '/blog/how-to-chase-late-payments', label: 'Guide: how to chase late payments' },
        { href: '/blog/invoice-payment-terms-explained', label: 'Guide: payment terms explained' },
      ]}
    />
  );
}
