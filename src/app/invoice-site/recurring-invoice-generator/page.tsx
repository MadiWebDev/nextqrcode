import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'Recurring Invoice Generator — Retainers, Rent & Subscriptions',
  description:
    'Set an invoice to repeat weekly, monthly, quarterly, yearly or every N periods and get a fresh numbered draft each cycle. You review and send every invoice.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/recurring-invoice-generator' },
  openGraph: {
    title: 'Recurring Invoice Generator — Retainers, Rent & Subscriptions',
    description:
      'Repeat billing without the subscription software: drafts prepared on schedule, numbered and dated, ready for your review.',
    url: 'https://invoicegenerator.freeqrcode.tools/recurring-invoice-generator',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RecurringPage() {
  return (
    <SeoLanding
      slug="/recurring-invoice-generator"
      title="Recurring Invoice Generator"
      standfirst="Rent, retainers, tuition, maintenance contracts, subscriptions — some invoices are the same every cycle, and re-typing them is pure waste. Mark any invoice as recurring here and a fresh draft, with the next number in sequence and the right dates, is prepared for you each cycle. The honest part: nothing is ever sent or charged automatically — you stay the sender of every invoice."
      sections={[
        {
          heading: 'How recurring billing works here',
          paragraphs: [
            'Create the invoice once — client, lines, tax, terms — then switch on recurring and choose the rhythm: weekly, monthly, quarterly or yearly, with a custom interval when the rhythm is unusual (every 2 weeks, every 3 months, every 6 weeks of a school term). Set the next issue date and the template does the rest: when you open the app on or after that date, the new draft exists, numbered from your sequence, dated for the new period, with the next date already advanced. If you were away and several cycles passed, up to twelve missed drafts are prepared so the sequence never has a hole.',
            'Each generated draft is an ordinary invoice: edit it (this month had two extra call-outs), record payments against it, pause the template when the work pauses and resume it when work restarts, or cancel the series entirely. The recurring list shows every template with its frequency and next issue date, so the month\u2019s expected billing is visible at a glance.',
          ],
        },
        {
          heading: 'Why drafts, not auto-send?',
          paragraphs: [
            'Because amounts change, clients change, and an invoice sent unseen is a liability: the month you were on holiday, the cycle after the client cancelled, the period the price went up. Server-side auto-billing also needs your clients\u2019 payment details and a merchant account — a different product with different risks. This generator runs entirely in your browser, so its truthful model is: the paperwork is prepared automatically; the sending stays a deliberate human act. In practice the draft workflow takes under a minute per cycle — open, glance, adjust if needed, send — and it catches the errors auto-send would have mailed.',
            'For genuinely hands-off subscriptions, pair the drafts with standing payment arrangements on the client\u2019s side (a recurring bank transfer referencing the invoice series) and record each arrival in the payments ledger; the invoice status then flips to paid on its own arithmetic, and your dashboard shows the subscription book\u2019s health — collected, outstanding and overdue per currency — without a billing platform\u2019s monthly fee.',
          ],
        },
        {
          heading: 'Good recurring-invoice hygiene',
          paragraphs: [
            'Name the period on the invoice itself ("March retainer", "Q3 maintenance") using the document-title or notes field, so clients can match invoices to periods without asking. Keep price reviews explicit: when the rate changes, edit the template and note the change on the first new invoice — never let a silent increase be the way a client learns about it. And reconcile quarterly: the recurring list against active contracts, the aging report against what actually arrived. Recurring revenue feels automatic right up to the month a zombie template bills a departed client; the review habit is the difference.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'Are recurring invoices sent automatically?',
          answer:
            'No — deliberately. Drafts are generated automatically when you open the app on or after the issue date; you review and send each one yourself. The app runs in your browser and never emails or charges anyone on its own, and the recurring screens say so plainly.',
        },
        {
          question: 'Can I set an invoice to repeat every 2 or 3 months?',
          answer:
            'Yes. Alongside weekly, monthly, quarterly and yearly frequencies there is a custom interval — every N of the chosen period, from 1 to 36 — so fortnightly retainers and six-weekly cycles are covered.',
        },
        {
          question: 'What happens if I don\u2019t open the app for two months?',
          answer:
            'The missed cycles are generated when you next open it (up to twelve), each with its own number and period dates, so your sequence and the client\u2019s records stay complete. You can then send, edit or delete each draft as appropriate.',
        },
        {
          question: 'Can I pause a recurring invoice?',
          answer:
            'Yes — every template has an active switch. Pause it when the engagement pauses; no drafts are generated while it is off, and resuming picks up from the next issue date you set.',
        },
      ]}
      related={[
        { href: '/invoice-for-freelancers', label: 'Invoices for freelancers' },
        { href: '/invoice-for-small-business', label: 'Invoices for small businesses' },
        { href: '/blog/recurring-invoices-guide', label: 'Guide: recurring invoices in depth' },
        { href: '/blog/invoice-payment-terms-explained', label: 'Guide: payment terms explained' },
      ]}
    />
  );
}
