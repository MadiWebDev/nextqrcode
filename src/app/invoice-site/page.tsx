import Link from 'next/link';
import {
  Archive,
  Building2,
  CheckCircle2,
  FileDown,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  MousePointerClick,
  PenLine,
  QrCode,
  Repeat,
  Send,
  Users,
  Wallet,
} from 'lucide-react';
import { JsonLd } from '@/lib/seo/jsonld';
import { InvoiceApp } from './InvoiceApp';

const faqs = [
  {
    question: 'Is this invoice generator really free?',
    answer:
      'Yes — completely free, with no sign-up, no trial period and no watermark on your PDFs. It is part of the QR Studio family of browser tools. You can create as many invoices as you like, save your business profile and client list, track which invoices are paid and which are outstanding, and download polished PDFs. There is no premium tier hiding the useful features: templates, logos, tax, multi-currency totals and the payment QR are all included for everyone.',
  },
  {
    question: 'Where is my invoice data stored?',
    answer:
      'Only in your own browser. Your business profile, clients and invoices are saved in your browser\u2019s local storage on this device — nothing is uploaded to a server and we cannot see, recover or share your data. That also means your data does not follow you to another browser or computer, and clearing your browser storage permanently deletes it. For anything important, keep the downloaded PDFs as your records; they are complete, self-contained copies of every invoice you issue.',
  },
  {
    question: 'Can I add my logo, my tax rate and my own numbering?',
    answer:
      'Yes to all three. In Settings you can upload your logo (it appears on the preview and the PDF), set your default currency, name your tax exactly as your country does — GST, VAT, sales tax or anything else — and set its default rate. Every invoice can override the rate. Invoice numbers are editable on each invoice, and the Settings screen controls the next number in your sequence, so you can start from wherever your existing bookkeeping left off and keep an unbroken run.',
  },
  {
    question: 'Does the payment QR code work with my bank?',
    answer:
      'The QR code encodes exactly the payment text or link you provide — for example a payment page URL, a wallet address, or your IBAN and account title as plain text. When your client scans it with a phone camera, they land on that link or see those details, ready to paste into their own banking app. Because the code simply carries your text, it works alongside any bank in any country; it does not connect to your bank account itself, and no money moves through this tool.',
  },
  {
    question: 'How do I track unpaid invoices?',
    answer:
      'Every saved invoice carries a status: draft, sent or paid. Mark an invoice as sent when you email the PDF, record partial payments in the Amount Paid field as money arrives, and flip it to paid when the balance reaches zero. The Invoices tab totals everything up for you — total invoiced, total collected and total outstanding — so a single glance shows who still owes you money and how much, without opening a spreadsheet.',
  },
  {
    question: 'Can I invoice clients in other countries and currencies?',
    answer:
      'Yes. Each invoice has its own currency — ten are built in, including USD, EUR, GBP, PKR, INR, AED, SAR, QAR, CAD and AUD — and amounts are formatted properly for the currency you choose. The tax label is free text, so you can write VAT for European clients, GST for Pakistan, India or Australia, or sales tax for the United States. The summary on the Invoices tab groups totals per currency instead of mixing them, which keeps your outstanding figures honest.',
  },
  {
    question: 'How do recurring invoices work?',
    answer:
      'Tick "Make this a recurring invoice" on any invoice and choose weekly, monthly, quarterly or yearly, plus the next issue date. When that date arrives, a fresh draft of the invoice — new number, fresh dates, nothing paid against it — is created for you the next time you open the app. Honest detail: nothing is ever sent automatically, because there is no account and no server working in the background. You review each draft, adjust it if the amount changed, and send it yourself. Pause a template when a retainer is on hold, or stop it entirely when the work ends.',
  },
  {
    question: 'How do backups work, and when should I export one?',
    answer:
      'Because everything is stored in your browser, the Data section in Settings is your safety net. Export backup (JSON) downloads a single file containing your business profile, client list and every invoice; Import backup restores that file on any computer or browser, replacing what is stored there after you confirm. Export one before switching computers, before clearing browser data, and at the end of each month as a habit. There is also a CSV export of all your invoices — one row per invoice with totals, payments, balances and statuses — for your accountant or your own spreadsheet.',
  },
];

const features = [
  {
    icon: LayoutTemplate,
    title: 'Three print-ready templates',
    text: 'Classic, Modern and Minimal layouts that all survive the journey from screen to paper: clean margins, ruled tables and totals that line up. Switch templates on a finished invoice and watch the preview restyle itself instantly — your numbers never change, only the presentation.',
  },
  {
    icon: Building2,
    title: 'Business profile and logo',
    text: 'Save your business name, address, email, phone, tax defaults and logo once, in Settings. Every new invoice starts pre-filled, so the hundredth invoice takes no longer to brand than the first — and your logo prints on the PDF exactly as clients see it on screen.',
  },
  {
    icon: Users,
    title: 'Client address book',
    text: 'Stop retyping the same client details. Save each client once, then pick them from a list when you raise an invoice; their name, email and address land in the right places. Adding a new client takes seconds, either from Settings or directly while you are invoicing.',
  },
  {
    icon: CheckCircle2,
    title: 'Invoice tracking built in',
    text: 'Draft, sent and paid statuses, partial payments and a live outstanding total per currency. The Invoices tab answers the only question that matters on a Friday afternoon — who has not paid yet, and for how much — without a spreadsheet or a paid accounting subscription.',
  },
  {
    icon: QrCode,
    title: 'Payment QR on every invoice',
    text: 'Add a QR code carrying your payment link or bank details, printed right beside the totals where clients cannot miss it. Clients scan, land on your payment page or see your IBAN, and pay in under a minute. Fewer "how do I pay you?" emails, fewer excuses, faster money.',
  },
  {
    icon: Lock,
    title: 'Private by design',
    text: 'There is no account and no server copy of your data. Everything — profile, clients, invoices, even your logo — lives in your browser\u2019s local storage on your device. Close the tab and it is still there when you return; clear your browser data and it is gone for good. Your client list is nobody else\u2019s business.',
  },
  {
    icon: Repeat,
    title: 'Recurring invoices',
    text: 'Retainers, rent, tuition, subscriptions — set an invoice to repeat weekly, monthly, quarterly or yearly and a fresh draft is waiting for you when each date arrives, numbered and dated automatically. Nothing is sent without you: you review, tweak and send every draft yourself. Pause a template whenever the work pauses.',
  },
  {
    icon: Wallet,
    title: 'Payment tracking & partial payments',
    text: 'A real payments ledger, not a single "amount paid" box. Record every payment with its date, amount, method and a note — deposit by bank transfer, balance in cash — and the invoice labels itself accurately: partially paid, overdue, or paid in full, with a PAID stamp across the PDF when the balance clears.',
  },
  {
    icon: LayoutDashboard,
    title: 'Business dashboard',
    text: 'One screen that answers the money questions: how much you have billed, collected and are still owed, per currency; how old the unpaid money is, in 30-day aging buckets; a six-month billing chart; and your top five clients with what each still owes. Drafts stay out of the numbers until you actually send them.',
  },
  {
    icon: FileText,
    title: 'Client statements',
    text: 'When a client asks "what do I owe you, in total?", answer with one document: a statement PDF listing every invoice you have ever issued them — dates, totals, payments, balances and statuses — with the outstanding amount highlighted. Generated per client from the address book, in one click.',
  },
  {
    icon: Archive,
    title: 'Backup & export',
    text: 'Your data lives in your browser, so take it with you: export a complete JSON backup of your profile, clients and invoices, and import it on any other computer. There is a CSV export too — every invoice, one row each — ready for Excel, Google Sheets or your accountant.',
  },
];

export default function InvoiceSitePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />

      {/* ── Branded top bar ─────────────────────────────────────────── */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-bold text-lg leading-tight">Invoice Generator</span>
              <span className="block text-xs text-muted-foreground">
                Professional invoices in minutes — by QR Studio · freeqrcode.tools
              </span>
            </span>
          </div>
          <nav aria-label="On this page" className="flex flex-wrap gap-x-5 gap-y-1 text-sm ml-auto">
            <a href="#create" className="hover:text-primary transition-colors">
              Create invoice
            </a>
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#templates" className="hover:text-primary transition-colors">
              Templates
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Free Invoice Generator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create, send and track professional invoices in minutes — no sign-up, no subscription,
            no watermark. Your business profile, your clients and your invoices are saved privately
            in your own browser, so the next invoice is always half-written before you start.
            Download a polished PDF, print a payment QR beside the totals, and get back to the work
            you actually get paid for.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#create"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <PenLine className="w-4 h-4" /> Create an invoice
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              See what it does
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free forever · Works in any modern browser · Nothing you type leaves your device
          </p>
        </section>

        {/* ── The app ───────────────────────────────────────────────── */}
        <section id="create" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-6">
          <InvoiceApp />
        </section>

        {/* ── Features ──────────────────────────────────────────────── */}
        <section
          id="features"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 scroll-mt-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Everything a small business actually needs
          </h2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            Most invoice tools either stop at a pretty PDF or bury you in accounting features you
            will never open. This one covers the whole life of an invoice — writing it, branding
            it, sending it, chasing it and filing it — and then gets out of your way.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5" />
                </span>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <p className="rounded-xl bg-muted/60 px-4 py-3">
              <Wallet className="inline w-4 h-4 mr-2 text-primary" />
              <strong>Ten currencies</strong> with proper formatting, and discounts, tax and
              shipping handled in the right order.
            </p>
            <p className="rounded-xl bg-muted/60 px-4 py-3">
              <Send className="inline w-4 h-4 mr-2 text-primary" />
              <strong>Partial payments</strong> recorded against any invoice, with the balance due
              always up to date.
            </p>
            <p className="rounded-xl bg-muted/60 px-4 py-3">
              <MousePointerClick className="inline w-4 h-4 mr-2 text-primary" />
              <strong>One-click PDF</strong> that matches the on-screen preview, templates
              included, ready to email or print.
            </p>
          </div>
        </section>

        {/* ── Templates ─────────────────────────────────────────────── */}
        <section
          id="templates"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60 scroll-mt-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Three templates, three personalities
          </h2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            An invoice is a small piece of your brand that lands in someone else&apos;s accounts
            department. Pick the layout that sounds like your business — you can change your mind on
            any invoice, at any time, without retyping a single number.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Classic</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                A serif headline, ruled table lines and a formal two-column header — the invoice
                equivalent of a firm handshake. Classic suits accountants, law and consultancy
                practices, trades businesses invoicing larger firms, and anyone whose clients
                still print invoices and file them in a binder. It reads as established and
                careful, which is exactly the impression that gets invoices approved without
                questions.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Modern</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                A bold colour band in your brand colour across the top, clean sans-serif type and
                generous white space. Modern is built for designers, developers, agencies,
                photographers and online sellers — businesses whose work is visual and whose
                paperwork should look like it came from the same studio. Set your brand colour
                once in the editor and every invoice carries it.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Minimal</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Light grey lines, no colour band, nothing decorative at all — just the facts,
                beautifully spaced. Minimal suits tutors, therapists, cleaners, drivers and
                one-person services whose clients are individuals rather than companies. It also
                prints cheapest, using almost no ink, which matters when you hand over paper
                receipts at the door.
              </p>
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How it works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-2xl border border-border bg-card p-5">
              <span className="text-3xl font-extrabold text-primary">1</span>
              <h3 className="mt-2 font-semibold">Set up your profile once</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Open Settings, add your business details, logo, currency, tax name and rate, and
                your payment details. It takes two minutes and you never type them again.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-card p-5">
              <span className="text-3xl font-extrabold text-primary">2</span>
              <h3 className="mt-2 font-semibold">Write the invoice</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Pick a client, add your line items, and watch the preview build itself beside the
                form — discounts, tax, shipping and balance due calculated as you type.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-card p-5">
              <span className="text-3xl font-extrabold text-primary">3</span>
              <h3 className="mt-2 font-semibold">Save and download the PDF</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Save the invoice to your list, download the PDF in one click, and email it to your
                client. Mark it as sent so your outstanding total stays truthful.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-card p-5">
              <span className="text-3xl font-extrabold text-primary">4</span>
              <h3 className="mt-2 font-semibold">Track it to paid</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Record payments as they land — part-payments included — and flip the invoice to
                paid when the balance clears. Your totals update themselves.
              </p>
            </li>
          </ol>
        </section>

        {/* ── Who it's for ──────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Who it&apos;s for</h2>
          <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed max-w-4xl">
            <p>
              <strong className="text-foreground">Freelancers and consultants.</strong> You bill
              by the project or by the day, and every hour spent on admin is an hour you cannot
              bill. A saved profile and client list turn invoicing into a two-minute job: pick the
              client, describe the work, send the PDF. The payment QR removes the most common
              delay of all — the client who means to pay but cannot find your bank details.
            </p>
            <p>
              <strong className="text-foreground">Agencies and small studios.</strong> Retainers,
              milestones and ad-hoc extras mean several invoices a week, all needing to look like
              they came from the same brand. The Modern template with your colour and logo keeps
              them consistent, statuses keep account managers honest about what has actually been
              sent, and duplicates make next month&apos;s retainer invoice a ten-second job.
            </p>
            <p>
              <strong className="text-foreground">Shops, traders and workshops.</strong> You sell
              goods as well as time, so your invoices carry quantities, unit prices, delivery
              charges and tax. Line items with shipping and a named tax rate handle that properly,
              and the Classic template gives larger buyers the formal document their accounts
              departments expect before they release payment.
            </p>
            <p>
              <strong className="text-foreground">Tutors, coaches and trainers.</strong> Term
              fees, monthly packages and one-off sessions, usually invoiced to parents and
              individuals. The Minimal template keeps things friendly and unfussy, per-client
              records show instantly who has paid for this term, and a payment link QR on the PDF
              lets a parent settle from their phone the moment the invoice arrives.
            </p>
            <p>
              <strong className="text-foreground">Contractors and tradespeople.</strong> Deposits,
              stage payments and final balances on the same job. Record the deposit as an amount
              paid against the full invoice and the balance due stays correct on every copy you
              send; duplicate the invoice for the next stage instead of starting from a blank
              page, and keep the whole job&apos;s paperwork in one list.
            </p>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section
          id="faq"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60 scroll-mt-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.question} className="rounded-2xl border border-border bg-card p-5">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* ── Mini footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Invoice Generator</strong> — part of QR Studio, the
            free tools suite at freeqrcode.tools. Your data never leaves your browser.
          </p>
          <nav aria-label="More tools" className="flex gap-5 text-sm sm:ml-auto">
            <Link href="https://freeqrcode.tools/tools" className="hover:text-primary transition-colors">
              All free tools
            </Link>
            <Link
              href="https://freeqrcode.tools/invoice-generator"
              className="hover:text-primary transition-colors"
            >
              Invoice tool on the main site
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
