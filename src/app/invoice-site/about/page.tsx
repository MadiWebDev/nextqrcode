import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Lock,
  PenLine,
  Receipt,
  ScrollText,
} from 'lucide-react';

const DESCRIPTION =
  'Meet the free Invoice Generator by QR Studio: why we built it, why it is free, and the principles behind it — private by design, no sign-up, pro results.';

export const metadata: Metadata = {
  title: 'About — Invoice Generator by QR Studio',
  description: DESCRIPTION,
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/about' },
  openGraph: {
    title: 'About — Invoice Generator by QR Studio',
    description: DESCRIPTION,
    url: 'https://invoicegenerator.freeqrcode.tools/about',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Invoice Generator by QR Studio',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const PRINCIPLES = [
  {
    icon: Lock,
    title: 'Private by design',
    text: 'Your business profile, your clients and your invoices are stored in your browser\u2019s local storage on your own device — never uploaded, never synced, never visible to us. Privacy here is not a policy promise; it is the architecture.',
  },
  {
    icon: CheckCircle2,
    title: 'No sign-up, no catch',
    text: 'No account, no email wall, no trial clock, no watermark on the PDF and no "premium" tier holding the useful features hostage. The whole product works the moment the page loads.',
  },
  {
    icon: FileText,
    title: 'Professional output',
    text: 'An invoice is a brand document that lands in someone else\u2019s finance department. Three considered templates, correct tax maths, your logo and colours, and a payment QR beside the totals — paperwork that gets approved, not queried.',
  },
];

const CAPABILITIES = [
  'Invoices with line items, discount, shipping, tax and part-payments',
  'Business profile with logo, brand colour and tax defaults',
  'Client address book and per-client statements',
  'Recurring invoices for retainers and subscriptions',
  'Dashboard: billed, collected, outstanding and overdue aging',
  'Three templates — Classic, Modern, Minimal — matched in the PDF',
  'Payment QR codes carrying your link or bank details',
  '150+ currencies, JSON backup and CSV export for your accountant',
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Invoicing software that respects your time — and your data
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          The Invoice Generator is built by <strong className="text-foreground">QR Studio</strong>,
          the small team behind{' '}
          <a href="https://freeqrcode.tools" className="text-primary underline underline-offset-2">
            freeqrcode.tools
          </a>{' '}
          — a suite of free, browser-based tools used by freelancers, shops, tutors, agencies and
          tradespeople in more than a hundred countries.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We built it because invoicing sits in an awkward gap. On one side, word-processor
          templates: free, but every invoice is typed from scratch, the totals are calculated by
          hand, and nothing tracks what is still unpaid. On the other side, accounting platforms:
          powerful, but built for bookkeepers, priced by the month, and hungry for your data — you
          create an account, upload your client list, and rent access to your own records forever.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Most one-person and small businesses need neither extreme. They need to raise a correct,
          good-looking invoice in two minutes, send it, know at a glance who has not paid, and get
          on with the work. That is the whole product: a proper little invoicing workspace that runs
          entirely in your browser tab.
        </p>
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Why is it free?</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Because it can be. A tool that runs in your browser has no servers storing your invoices,
          no database of your clients and no per-user infrastructure to pay for — our costs look
          like a static website, not a SaaS platform. The wider freeqrcode.tools suite is supported
          by the main site, and every tool in the family follows the same rule: free to use, in
          full, with no account. If the generator saves you an hour a month, it has done its job.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">The principles</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <p.icon className="w-5 h-5" />
              </span>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold tracking-tight">What it does</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <li key={c} className="flex gap-2.5 text-muted-foreground leading-relaxed">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          Alongside the main workspace, this site carries the family\u2019s single-document tools —
          a quick{' '}
          <Link href="/invoice-generator" className="text-primary underline underline-offset-2">
            invoice generator
          </Link>
          , a{' '}
          <Link href="/quote-generator" className="text-primary underline underline-offset-2">
            quote generator
          </Link>{' '}
          for pricing work before it starts, and a{' '}
          <Link href="/receipt-generator" className="text-primary underline underline-offset-2">
            receipt generator
          </Link>{' '}
          for proof of payment afterwards — plus a{' '}
          <Link href="/blog" className="text-primary underline underline-offset-2">
            blog
          </Link>{' '}
          of invoicing guides written from practice.
        </p>
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Who uses it</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Freelance designers, developers and consultants billing by the project. Agencies running
          monthly retainers. Tutors and coaches collecting term fees. Shops and workshops raising
          formal invoices their buyers\u2019 accounts departments will accept. Contractors juggling
          deposits, stage payments and final balances. What they share is not an industry — it is a
          size: small enough that the owner still sends the invoices, and busy enough that the
          invoices must not take all evening.
        </p>
        <div className="mt-10 rounded-3xl border border-border bg-card p-8 text-center">
          <LayoutDashboard className="w-8 h-8 text-primary mx-auto" />
          <h2 className="mt-3 text-2xl font-bold tracking-tight">Try it — it takes two minutes</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Set up your profile once, raise your first invoice, and download the PDF. No account,
            nothing to install, nothing uploaded.
          </p>
          <Link
            href="/#create"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <PenLine className="w-4 h-4" /> Create a free invoice
          </Link>
          <p className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Built by QR Studio
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ScrollText className="w-3.5 h-3.5" /> Guides on the blog
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" /> Part of freeqrcode.tools
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
