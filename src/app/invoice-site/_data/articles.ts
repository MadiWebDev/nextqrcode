export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date, e.g. '2026-11-10'
  readingMinutes: number;
  category: string;
  excerpt: string;
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: 'invoice-mistakes-that-delay-payment',
    title: '9 Invoice Mistakes That Delay Your Payment',
    description:
      'Most late payments start with the invoice itself. These nine common invoicing mistakes — and how to fix each one — will get your invoices paid sooner.',
    date: '2026-11-10',
    readingMinutes: 4,
    category: 'Getting paid',
    excerpt:
      'When an invoice sits unpaid for weeks, the cause is often on the invoice itself — a missing reference, a vague line item, a total that invites a query. These are the nine mistakes we see most often, and the simple fix for each.',
    sections: [
      {
        heading: 'Mistakes that confuse the client',
        paragraphs: [
          'The first three mistakes all have the same effect: the person who received your invoice cannot process it without emailing you a question — and every question costs you a week. Mistake one is vague line items. "Consulting services — 5,000" tells an accounts department nothing. "Website copywriting, 12 pages, delivered 3–7 November" can be matched against the work, approved and paid. Describe the deliverable, the quantity and the period, not just the price.',
          'Mistake two is billing the wrong entity. Your contact may work for "Brightline", but the legal name on their purchase order might be "Brightline Marketing Ltd" — and invoices addressed to the wrong name bounce back for correction, restarting the payment clock. Mistake three is numbering chaos: duplicated numbers, or no number at all. Accounts systems reject duplicates automatically, and an unnumbered invoice cannot be referenced on the phone. Use one unbroken sequence and never reuse a number, even for a cancelled invoice.',
        ],
        bullets: [
          'Write line items as deliverable + quantity + dates, not a bare service name.',
          'Copy the client\u2019s legal company name from their purchase order or contract.',
          'Keep one continuous invoice number sequence; void numbers instead of reusing them.',
        ],
      },
      {
        heading: 'Mistakes that give clients an excuse to wait',
        paragraphs: [
          'Mistake four: no due date, or just the words "payable on receipt". A busy accounts team pays invoices in due-date order; an invoice without a date goes to the bottom of the pile and stays there. Always print both the issue date and the exact due date — "Due 14 December 2026" — so there is a day on the calendar when your payment becomes officially late.',
          'Mistake five is making the client hunt for how to pay. If your bank details, payment link or account reference are missing, paying you requires effort, and effort gets postponed. Print payment instructions right next to the totals; a payment QR code beside the balance due removes the last excuse entirely. Mistake six is ignoring the client\u2019s own process: many larger companies will not pay an invoice that lacks their purchase order number. Ask for the PO number before you start the work, print it on the invoice, and your bill sails through instead of stalling in a queries inbox.',
        ],
      },
      {
        heading: 'Mistakes in the maths',
        paragraphs: [
          'Mistake seven is arithmetic that does not add up: line items that sum to one total, a tax figure that matches neither the rate nor the subtotal, a discount applied twice. Even a one-unit discrepancy triggers a manual review in most finance departments, and manual reviews are slow. The safest fix is to let the invoice itself do the maths — when totals, tax and the balance due are calculated from the line items rather than typed by hand, the document cannot disagree with itself.',
          'The same section of the invoice is where currency mistakes live. Billing a foreign client in your currency when the quote was in theirs (or the reverse) turns a routine payment into an exchange-rate negotiation. State the currency once, clearly, use the one you agreed in the contract, and format the amounts properly for that currency so nothing looks like a typo.',
        ],
      },
      {
        heading: 'Mistakes in how you send — and what happens after',
        paragraphs: [
          'Mistake eight is sending the invoice late. Work finished on the 5th but invoiced on the 28th does not just delay payment by 23 days — it lands after the client\u2019s monthly payment run and waits for the next one. Invoice the day the work is delivered, or on the agreed milestone date, every time. The invoice clock starts when the invoice arrives, not when the work ended.',
          'Mistake nine is never following up. Polite, scheduled reminders — a nudge a few days before the due date, one on the day, one a week after — recover most "late" payments, which are usually forgotten rather than refused. But you can only chase what you can see: keep every invoice in one list with a status, record part-payments against it, and review the outstanding total weekly. If your current system is a sent-items folder and a memory, that is the real mistake underneath all the others.',
        ],
      },
      {
        heading: 'A five-minute pre-send check',
        paragraphs: [
          'Before any invoice leaves your desk, run through this list. It takes five minutes and prevents all nine mistakes above.',
        ],
        bullets: [
          'Correct legal name of the client, and their reference or PO number if they use one.',
          'Unique invoice number, issue date and a specific due date.',
          'Line items that describe deliverables, quantities and dates.',
          'Totals calculated, tax rate and tax name correct, currency stated.',
          'Payment details or payment link printed beside the balance due.',
          'Sent on the delivery day — and logged with a status so you can follow it up.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-write-an-invoice',
    title: 'How to Write an Invoice: A Step-by-Step Guide for Small Businesses',
    description:
      'Learn how to write an invoice step by step: what to include, how to number it, when to send it, and how to format it so clients pay you faster.',
    date: '2026-11-04',
    readingMinutes: 5,
    category: 'Invoicing basics',
    excerpt:
      'An invoice has one job: to get you paid without a single follow-up question. This step-by-step guide covers the number, the details, the line items, the tax and the terms — in the order you should write them.',
    sections: [
      {
        heading: 'Step 1: Title it, number it, date it',
        paragraphs: [
          'Start with the word "Invoice" at the top, in large type. It sounds obvious, but documents titled "Bill", "Statement" or nothing at all get misfiled — and a misfiled invoice is an unpaid one. Under the title, add a unique invoice number. Most businesses use a simple sequence such as INV-1042, or embed the year: 2026-042. Either system works; what matters is that numbers are unique, sequential and never reused, because your client\u2019s accounts system will reject a duplicate.',
          'Add two dates: the issue date (today, the day you send it) and the due date (the day payment is expected). Never write only "payable within 30 days" — do the arithmetic for the client and print the actual date. An accounts clerk should be able to schedule your invoice without opening a calendar.',
        ],
      },
      {
        heading: 'Step 2: Your details, then theirs',
        paragraphs: [
          'Your business block goes at the top: legal business name, postal address, email and phone. If you are registered for VAT, GST or sales tax, your tax registration number belongs here too — in many countries a tax invoice is not valid without it. Consistency matters: use the same name and address that appear on your bank account and contracts, so a client verifying you finds no discrepancies.',
          'Below that, the client block: the company\u2019s legal name (not just your contact\u2019s name), their billing address, and the name or department of the person who commissioned the work. If the client gave you a purchase order number or a reference code, print it here in bold. Larger organisations route invoices by that reference; leave it off and your invoice waits in a queue while someone figures out which budget it belongs to.',
        ],
      },
      {
        heading: 'Step 3: Describe the work so there is nothing to query',
        paragraphs: [
          'The line items are the heart of the invoice. Each line needs a clear description, a quantity, a unit price and a line total. Compare "Design work — 2,000" with "Homepage redesign, 2 concepts + final artwork, delivered 18–22 October — 2,000". The second version can be approved by someone who never met you; the first invites an email asking what the money was for, and that email costs you a payment cycle.',
          'Bill in the units your client thinks in: hours for consulting, items for products, milestones for projects. If the work was quoted as a fixed price, one line per deliverable is cleaner than a fake breakdown. Keep descriptions factual and matched to the words in your quote or contract — accounts departments approve documents that agree with each other.',
        ],
      },
      {
        heading: 'Step 4: Show the money clearly',
        paragraphs: [
          'Under the line items, stack the arithmetic in a fixed order: subtotal, then any discount, then shipping or expenses if you charge them, then tax calculated on the discounted subtotal, and finally the grand total in a larger, bold figure labelled "Total due" or "Balance due". If the client has already paid a deposit, show "Amount paid" and the remaining balance — the number they actually need to transfer.',
          'Name your tax properly. Write "VAT (20%)" for a British client, "GST (18%)" for Pakistan or India, "Sales tax (8.25%)" for Texas — whatever applies — and show the tax amount as its own line. Mixed-rate work (some items taxed, some exempt) should be split into separate line groups so the client\u2019s accountant can file it without redoing your maths.',
        ],
        bullets: [
          'Subtotal of all line items.',
          'Minus discount, if any.',
          'Plus shipping or billable expenses.',
          'Plus tax, calculated on the discounted subtotal.',
          'Minus any amount already paid — the remainder is the balance due.',
        ],
      },
      {
        heading: 'Step 5: State your terms and how to pay',
        paragraphs: [
          'An invoice without payment instructions is a request, not a bill. State your terms in one line — "Payment due within 14 days of the issue date" — and then make paying effortless: bank name, account title, account number or IBAN, and any reference the client should quote (usually the invoice number). If you accept card or wallet payments, include the payment link; a payment QR code printed beside the totals lets the client pay from their phone in under a minute.',
          'If your terms include a late fee or early-payment discount, say so on the invoice itself, in plain words, matching what your contract or quote already promised. Terms that appear for the first time on the final invoice are hard to enforce and easy to resent.',
        ],
      },
      {
        heading: 'Step 6: Send it promptly — and track it',
        paragraphs: [
          'Send the invoice the day the work is delivered, as a PDF attached to a short email that repeats the essentials: invoice number, total, due date. PDFs beat editable files because they cannot be altered accidentally and they print identically everywhere. Keep your own copy filed by number, and record the invoice somewhere with a status — sent, part-paid, paid — so you always know what is outstanding.',
          'That last habit is the one that separates businesses that get paid on time from those that drift. In this invoice generator, your profile and clients are saved in your browser, statuses and payments update the outstanding total automatically, and a dashboard shows what is owed and how overdue it is. However you do it — tool, spreadsheet or ledger — write the invoice once, write it completely, and never let it leave your sight until it is paid.',
        ],
      },
    ],
  },
  {
    slug: 'what-to-include-on-an-invoice',
    title: 'What to Include on an Invoice: The Complete Checklist',
    description:
      'Use this complete invoice checklist to make sure every invoice you send has the details clients and accountants need — so nothing delays your payment.',
    date: '2026-10-21',
    readingMinutes: 5,
    category: 'Invoicing basics',
    excerpt:
      'Leave one field off an invoice and it can bounce around a client\u2019s finance department for weeks. Here is the full checklist — the legal essentials, the practical details and the small things that speed payment up.',
    sections: [
      {
        heading: 'Your business details (the seller block)',
        paragraphs: [
          'Every invoice must say who is asking for the money. Include your legal business name, your trading name if you use one ("Studio North, trading as…"), a postal address, an email address and a phone number. If you are tax-registered, your VAT, GST or tax registration number is not decoration — in most jurisdictions a tax invoice is legally incomplete without it, and corporate clients will reject invoices that omit it.',
          'Use the same details everywhere. The name on the invoice should match the name on your bank account and your contract. When a finance team verifies a new payee, mismatched names are the most common reason a first payment gets stuck in "pending checks" for a fortnight.',
        ],
        bullets: [
          'Legal business name (and trading name, if different).',
          'Postal address, email, phone.',
          'Tax registration number, if you are registered.',
          'Your logo — optional, but it makes the document instantly recognisable.',
        ],
      },
      {
        heading: 'Your client\u2019s details (the buyer block)',
        paragraphs: [
          'Bill the entity, not the person. Your contact might be "Sara from marketing", but payment is authorised by a company, so the invoice should carry the company\u2019s full legal name and its billing address — which is sometimes a different office from where the work was delivered. Add "Attn: Sara Ahmed, Marketing" underneath so the document reaches the human who can approve it.',
          'If the client issued a purchase order, its number belongs in this block in a clearly labelled field of its own: "PO number: PO-88123". Many companies operate a strict "no PO, no pay" policy, and an invoice missing the number is returned unpaid no matter how perfect everything else is. Ask for the PO number when the work is agreed, not when you sit down to invoice.',
        ],
      },
      {
        heading: 'Number, dates and the document\u2019s identity',
        paragraphs: [
          'Three identifiers make an invoice trackable: a unique invoice number, the issue date and the due date. The number is your reference in every email, statement and phone call about this bill — keep a single unbroken sequence for your whole business, and never recycle a number from a cancelled invoice. Pair it with the actual calendar due date ("Due 2 December 2026"), not just the terms.',
          'For recurring or staged work, add one more line: the period the invoice covers ("Services for November 2026" or "Milestone 2 of 3"). It costs you one line and saves the client\u2019s accountant a reconciliation headache at month-end — the kind of small courtesy that quietly moves your invoice to the front of the approval queue.',
        ],
      },
      {
        heading: 'Line items that describe value',
        paragraphs: [
          'Each line needs four things: what was supplied, how many, at what unit price, and the line total. "1 × Project fee" fails the test; "1 × Brand identity package (logo suite + guidelines), fixed fee as quoted 5 October" passes it. For time-based work, give the rate and the quantity — "14 hours × 60 = 840" — and, if the client will want it, the dates the hours were worked.',
          'One line per deliverable is usually right. Bundling everything into a single line hides the value you delivered; exploding a simple job into twenty micro-lines looks like padding. And if different items carry different tax rates, group them so each tax treatment is visible — your client has to reclaim or report that tax correctly too.',
        ],
      },
      {
        heading: 'Totals, tax and payment instructions',
        paragraphs: [
          'The money block, in order: subtotal, discount, delivery or expenses, tax with its name and rate shown as a separate line, grand total, any amount already paid, and the balance due in the largest type on the page. If your country or your client expects the total in words as well as figures — standard on cheques and common on formal invoices in South Asia and the Middle East — include it; a mismatch between words and figures is a classic reason banks query documents.',
          'Finally, the part too many invoices forget: how to actually pay. Bank name, account title, account number or IBAN, and the reference to quote (your invoice number). Add a payment link or QR code if you have one. Then a single line of terms — "Payable within 14 days. Queries within 7 days, please." — so the expectations are printed on the document itself, not buried in an old email thread.',
        ],
        bullets: [
          'Subtotal → discount → shipping/expenses → tax → total → paid → balance due.',
          'Tax shown by name and rate (e.g. "GST 18%") as its own line.',
          'Full payment details, plus the reference the client should quote.',
          'One line of terms: the due date and where to send queries.',
        ],
      },
      {
        heading: 'The 60-second final check',
        paragraphs: [
          'Before sending, read the invoice as if you were the stranger in accounts who has never heard of you. Can they tell who you are, what you did, what it costs, when it is due and how to pay — without opening another document? If yes, send it. Templates help here: in this invoice generator, your seller block, tax defaults and payment details are saved in your profile and pre-filled on every invoice, and the client block comes from your address book, so the checklist above becomes the default rather than a chore.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-chase-late-payments',
    title: 'How to Chase Late Payments Politely (and Get Paid)',
    description:
      'Polite, firm, effective: a step-by-step approach to chasing late invoice payments, with a reminder timeline and word-for-word scripts you can copy.',
    date: '2026-10-08',
    readingMinutes: 5,
    category: 'Getting paid',
    excerpt:
      'Most late payments are forgotten, not refused — which means a calm, well-timed reminder sequence recovers most of them without damaging the relationship. Here is the timeline that works, with scripts for every stage.',
    sections: [
      {
        heading: 'First, prevent the lateness you can',
        paragraphs: [
          'The most effective chase happens before the invoice is overdue. When you send the invoice, your email should already contain the three facts a payer needs — invoice number, amount, due date — and a sentence that sets up the follow-up: "I\u2019ll check in a few days before the due date in case your team needs anything from me." That one line gives you permission to write again without sounding like you are chasing.',
          'Then, three to five days before the due date, send the pre-reminder. For a business client this is framed as service, not suspicion: "A quick note that invoice 1042 for 1,850 falls due on Friday. Let me know if your accounts team needs a copy of the PO or anything else to release it." A surprising share of invoices are "late" simply because a document was missing; this message finds that out while there is still time to fix it.',
        ],
      },
      {
        heading: 'Days 1–3 overdue: the friendly nudge',
        paragraphs: [
          'Assume an oversight. Accounts departments process hundreds of invoices; yours may be sitting in the wrong inbox. Keep the tone light, make it effortless to act, and always re-attach the invoice — the number one cause of "we never received it" delays is that, at some point, they genuinely didn\u2019t.',
        ],
        bullets: [
          '"Hi Sara — hope you\u2019re well. A quick flag that invoice 1042 (1,850) was due on Friday and I can\u2019t see it on our statement yet. I\u2019ve re-attached it here — could you check it\u2019s in the payment run? Happy to resend anything else your team needs."',
        ],
      },
      {
        heading: 'Days 7–14 overdue: the firmer follow-up',
        paragraphs: [
          'Now drop the small talk and add structure: restate the facts, ask for a specific commitment, and name a date. Vagueness is what lets a polite chase slide for another month; a direct question — "on what date will this be paid?" — is much harder to ignore, and most clients respect being asked plainly.',
          'If your contract or your invoice terms include a late fee, this is the message where you mention it exists, factually and without threats: "As per our terms, a late fee of X applies to invoices over 14 days; I\u2019d like to help you avoid that, so please let me know the payment date today." You are giving them a deadline that saves them money, which reads as a favour rather than a warning.',
        ],
        bullets: [
          '"Hi Sara — following up on invoice 1042 for 1,850, now 10 days overdue. I need to plan around this payment, so could you confirm the exact date it will be made? If there\u2019s a problem with the invoice itself, tell me today and I\u2019ll fix it the same day."',
        ],
      },
      {
        heading: 'Day 30: the final notice',
        paragraphs: [
          'At a month overdue, write to the person who can actually authorise payment — often not your day-to-day contact — and change the subject line to include "Final notice" and the invoice number. State the full history in dates: issued, due, reminded. Then set out the next step and its date: pausing ongoing work, applying the contractual late fee, or passing the debt to a collections service or small-claims process, whichever your jurisdiction and contract support.',
          'Keep every word professional. A final notice that stays factual is far more effective than an angry one, because it can be forwarded up the chain without embarrassing anyone — and forwarding it up the chain is exactly what you want to happen.',
        ],
        bullets: [
          '"This is a final notice for invoice 1042 (1,850), issued 1 October, due 15 October, and now 30 days overdue despite reminders on 18 and 25 October. Unless payment is received by 5 December, we will pause the current project and apply the late fee set out in our agreement. If payment has already been sent, please share the remittance advice so we can reconcile it."',
        ],
      },
      {
        heading: 'If they still do not pay',
        paragraphs: [
          'Escalate in proportion. For a client who is communicating but struggling, a written payment plan — half now, half on a fixed date — recovers more money than a court threat and sometimes saves the relationship. For silence or broken promises, your realistic options are a formal letter before action (cheap, and remarkably effective), a debt collection agency working on commission, or a small-claims/money claim through your local court, which for typical freelance sums is designed to be used without a lawyer.',
          'Whatever you choose, your records do the heavy lifting: the original invoice, the contract or email agreement, and the trail of reminders. This is another reason to keep every invoice in one tracked list with dates and statuses rather than scattered across inboxes — the evidence assembles itself.',
        ],
      },
      {
        heading: 'Protect the relationship while you chase',
        paragraphs: [
          'Chase the invoice, not the person. Separate the money conversation from the work conversation, keep delivering well for clients who are merely slow once, and never discuss one client\u2019s payment behaviour with another. Most businesses that pay late are disorganised rather than dishonest, and the freelancer who chases calmly and consistently is the one they prioritise when cash is tight.',
          'And tighten the system afterwards: shorter terms for slow payers, deposits before work starts, and a dashboard habit — five minutes a week reviewing what is outstanding while it is still young. The best chasing system is the one where invoices rarely get old enough to need chasing at all.',
        ],
      },
    ],
  },
  {
    slug: 'invoice-payment-terms-explained',
    title: 'Invoice Payment Terms Explained: Net 30, Due on Receipt & More',
    description:
      'Net 30, Net 14, due on receipt, 2/10 Net 30 — what invoice payment terms actually mean, which to choose, and how they change when your money arrives.',
    date: '2026-09-30',
    readingMinutes: 5,
    category: 'Invoicing basics',
    excerpt:
      'Payment terms look like boilerplate, but they decide whether you are paid this week or next quarter. This guide decodes the standard phrases, shows what they cost you, and helps you pick terms that fit your cash flow.',
    sections: [
      {
        heading: 'What "Net 30" and its cousins actually mean',
        paragraphs: [
          '"Net" terms are a countdown. Net 30 means the full (net) amount is due 30 calendar days after the invoice date; Net 14 and Net 7 are the same idea at two weeks and one week. Net 60 and Net 90 exist too — mostly imposed by large corporations with powerful procurement departments — and they mean your money arrives two or three months after you did the work.',
          'Two details catch people out. First, the clock starts on the invoice date, not the delivery date and not the day the client "processes" it — which is why you should invoice the moment work is delivered. Second, "days" means calendar days unless your contract says business days. Print the resulting due date on the invoice itself ("Due 28 November 2026") so nobody has to interpret anything.',
        ],
        bullets: [
          'Due on receipt — payment expected as soon as the invoice arrives.',
          'Net 7 / Net 14 — due 7 or 14 days after the invoice date.',
          'Net 30 — the most common business standard: due 30 days after the invoice date.',
          'Net 60 / Net 90 — long terms typical of large corporates; price them into your quote.',
          'EOM — due at the end of the month in which the invoice is issued.',
        ],
      },
      {
        heading: 'When short terms are fair — and when they backfire',
        paragraphs: [
          '"Due on receipt" suits small, one-off jobs and clients paying by card or wallet: the work is done, the amount is agreed, there is nothing to schedule. For individuals — parents paying a tutor, a homeowner paying a plumber — it is the natural default, and most pay within a day or two when the invoice carries a payment link or QR code they can act on immediately.',
          'For business clients, demanding receipt-level speed can backfire: their finance team pays in weekly or monthly runs regardless of what your invoice says, and terms they cannot meet just get ignored. Net 14 is often the sweet spot for small businesses invoicing other small businesses — short enough to protect your cash flow, realistic enough to be honoured. Whatever you choose, agree it before the work starts and print it on the quote, so the invoice terms are a reminder, not a surprise.',
        ],
      },
      {
        heading: 'Discounts for early payment: 2/10 Net 30',
        paragraphs: [
          'The notation "2/10 Net 30" means: take 2% off if you pay within 10 days; otherwise the full amount is due in 30. On a 10,000 invoice, the client saves 200 by paying 20 days early — and you effectively pay 200 for three weeks\u2019 faster cash. Annualised, that is an expensive way to borrow, which is why the discount exists mainly where it is industry custom (manufacturing, wholesale, construction supply).',
          'Offer it only if the maths works for you and only to clients whose normal behaviour is to pay at day 30 anyway — there is no sense discounting for a client who already pays in a week. If you do offer it, state it on the invoice in words, not just code: "2% discount if paid by 12 November; otherwise full amount due 2 December."',
        ],
      },
      {
        heading: 'Choosing terms that match your cash flow',
        paragraphs: [
          'Your terms should be set by your outgoings, not by habit. List your own fixed dates — rent, salaries, software, suppliers — and work backwards. If your costs land in the first week of the month, invoices issued mid-month on Net 30 will reliably arrive after them, and you will fund the gap forever. Shorter terms, deposits, or milestone billing (a third upfront, a third at midpoint, a third on delivery) reshape the same revenue into money that arrives when you need it.',
          'Staged payments deserve emphasis because they also reduce risk: a client who stops paying stops the project at the next milestone, not at the end. For any job longer than a month or larger than you can afford to lose, never let the full amount ride on a single end-of-project invoice, whatever its terms say.',
        ],
      },
      {
        heading: 'Late fees and interest: decide before you need them',
        paragraphs: [
          'Terms are also where late fees live. A typical clause charges 1–2% per month on overdue balances, or a flat administration fee. Some jurisdictions give you a statutory right to interest on late commercial payments; in others, you can only charge what the client agreed to in advance — which is why the fee must appear in your quote, contract or terms before the work, and then be repeated on the invoice.',
          'Used well, a late fee is mostly a deterrent: clients pay the invoices with consequences first. Apply it consistently rather than emotionally — waiving it "this once" for a good client who warned you is fine; never mentioning it until you are angry is not. And keep fees proportionate and lawful in your country; an unenforceable penalty clause protects nobody.',
        ],
      },
      {
        heading: 'Put the terms everywhere they need to be',
        paragraphs: [
          'Terms only work if they are visible at every step: in the quote the client accepts, in the contract or email agreement, on the invoice itself, and in your reminder messages, which should quote the due date exactly as printed. In this invoice generator, choosing a term like Net 14 or Net 30 sets the due date automatically from the issue date, and the terms line prints on the PDF — one less thing to calculate or forget when you are invoicing at speed.',
          'Review your standard terms once a year. If a client consistently pays at day 45 against Net 14 terms, the honest fix is either a conversation or new terms you both actually keep — quietly tolerating it teaches the market that your dates are decorative, and decorative dates are the most expensive terms of all.',
        ],
      },
    ],
  },
  {
    slug: 'recurring-invoices-guide',
    title: 'Recurring Invoices: The Retainer Billing Guide for Freelancers & Agencies',
    description:
      'Retainers, subscriptions and monthly packages billed without the monthly admin: how recurring invoices work, what to put in them, and how to set them up.',
    date: '2026-09-12',
    readingMinutes: 5,
    category: 'Guides',
    excerpt:
      'A retainer client should mean predictable money — yet many freelancers still retype the same invoice every month and send it late. Here is how recurring billing works, what to agree upfront, and how to run it without the admin.',
    sections: [
      {
        heading: 'What recurring billing is good for',
        paragraphs: [
          'A recurring invoice is the same bill, issued on a schedule: a monthly retainer for marketing support, a quarterly software maintenance fee, weekly cleaning, term-by-term tuition. The work repeats, the amount is fixed or nearly fixed, and the only thing that changes is the date and the invoice number. It suits any arrangement where the client has bought continuity rather than a one-off deliverable.',
          'The benefit is not just saved typing. Fixed billing dates make your income forecastable — you know that four retainers landing on the 1st cover the rent — and they make the client\u2019s life easier too, because their accounts team can diarise a predictable payment instead of processing a surprise. Predictability is why retainer clients churn less than project clients; the billing rhythm is part of the product.',
        ],
      },
      {
        heading: 'Agree the retainer properly first',
        paragraphs: [
          'Recurring invoices automate whatever you agreed — including a bad agreement. Before the first invoice, settle in writing: the fixed fee and exactly what it covers (hours, deliverables, response times), what happens to unused hours (expire, or roll over for one month — never silently bank forever), how extra work is billed, the billing date and payment terms, and how either side ends or pauses the arrangement.',
          'Price the rhythm, not just the work. A client paying monthly in advance is worth more to you than the same fee paid in arrears, because advance billing removes credit risk entirely. Many agencies offer exactly that trade: a slightly better rate for payment at the start of the period, standard rate at the end. Whichever you choose, the invoice should say which period it covers — "Retainer: December 2026" — so there is never a dispute about what a payment was for.',
        ],
        bullets: [
          'The fixed fee and the scope it covers, in plain words.',
          'The rule for unused hours and for work beyond scope.',
          'Billing date, due date and payment method.',
          'Notice period for pausing or ending the retainer.',
        ],
      },
      {
        heading: 'Setting up a recurring invoice that runs itself',
        paragraphs: [
          'Build the perfect invoice once: client details, the period line, line items describing the retainer and any standing extras, tax, terms, payment instructions. Then set its rhythm — weekly, monthly, quarterly or yearly — and its next issue date. A good recurring setup generates a fresh draft with a new number and correct dates when each date arrives, leaving you to review, adjust and send rather than rebuild.',
          'That human review step is a feature, not a flaw. Fully automatic sending bills a client who paused last week or charges last month\u2019s price after a renegotiation. In this invoice generator, recurring drafts are created when you open the app on or after the due date — nothing is ever emailed without you — so the workflow is: open, glance at the draft, tweak the period line if needed, send. Thirty seconds per client, per month.',
        ],
      },
      {
        heading: 'When the amount changes: usage and extras',
        paragraphs: [
          'Real retainers wobble: a support contract plus 3 extra hours; a social package plus an ad-hoc campaign. Handle it by keeping the recurring invoice as the fixed skeleton and adding variable line items to each draft before sending — extra hours at the agreed rate, expenses at cost, the one-off project milestone. The client sees one monthly bill with the retainer clearly separated from the extras, which is exactly what their accountant wants.',
          'Resist the opposite habit — sending the fixed invoice automatically and then a trail of small extra invoices through the month. Each separate invoice is a separate payment to chase, a separate chance for one to be missed, and a small erosion of the "one predictable bill" promise that made the retainer attractive in the first place.',
        ],
      },
      {
        heading: 'Pauses, endings and price rises',
        paragraphs: [
          'Retainers pause: a client\u2019s quiet season, a project freeze, maternity cover ending. Your system should let you suspend the rhythm without deleting the template, so resuming is one click and the history stays intact. When a retainer ends, issue the final invoice promptly with the period clearly closed out ("Final retainer invoice — services to 31 March"), and confirm in the same email that no further invoices will follow; ambiguity about whether billing has stopped is a common source of awkward refunds.',
          'And review retainer prices on a schedule — annually is typical. A small, explained rise ("from January, the monthly fee becomes 1,150, reflecting the expanded scope we added in September") is normal business and rarely refused. The recurring invoices simply continue at the new amount; five years of silent price-freeze, by contrast, is a pay cut you gave yourself.',
        ],
      },
      {
        heading: 'Recurring invoices vs subscriptions and direct debits',
        paragraphs: [
          'A recurring invoice is not a subscription payment. The invoice asks; a card subscription or direct debit mandate takes. Taking payment automatically is smoother still, and for high-volume, low-value billing it is the right tool — but it requires payment-processor accounts, mandates, and failure handling for declined cards, and clients in many markets (and most B2B clients everywhere) still prefer to pay against an invoice they can book.',
          'For freelancers and agencies with five to fifty regular clients, recurring invoices hit the sweet spot: the professionalism and audit trail of proper invoicing, the rhythm of a subscription, and none of the payment infrastructure. Track each template\u2019s status alongside the invoices themselves, and the monthly question "has everyone been billed?" answers itself.',
        ],
      },
    ],
  },
  {
    slug: 'proforma-invoice-vs-tax-invoice',
    title: "Proforma Invoice vs Tax Invoice: What's the Difference?",
    description:
      'A proforma invoice and a tax invoice look similar but do very different jobs. Learn when to send each one — and why mixing them up causes real problems.',
    date: '2026-08-26',
    readingMinutes: 5,
    category: 'Guides',
    excerpt:
      'They look almost identical, but one is a quotation in disguise and the other is a legal tax document. Sending the wrong one can stall customs, break a client\u2019s tax reclaim, or leave your own books wrong.',
    sections: [
      {
        heading: 'What a proforma invoice is (and is not)',
        paragraphs: [
          'A proforma invoice is a preliminary bill: a document that shows what a final invoice will look like, issued before the goods are shipped or the work is completed. "Pro forma" is Latin for "for the sake of form" — it has the form of an invoice, but it is not a demand for payment and it is not a record of a completed sale. Prices, quantities and dates on a proforma are commitments of intent, and the final figures can still change.',
          'Because nothing has been sold yet, a proforma invoice does not enter your sales ledger, does not create a tax liability, and cannot be used by your customer to reclaim VAT or GST. It should be clearly labelled "Proforma Invoice" — that label is what prevents it being mistaken for the real thing by a customs officer, a bank or an accounts department.',
        ],
      },
      {
        heading: 'What a tax invoice is',
        paragraphs: [
          'A tax invoice (called a VAT invoice in the UK and EU, a GST invoice in Pakistan, India, Australia and elsewhere, and simply a commercial invoice with tax details in some other systems) is the legal document of an actual sale. It is issued when goods or services have been supplied, it records the tax charged on that supply, and it is the evidence both sides use in their tax filings: the seller declares the output tax, and the buyer uses the document to reclaim input tax.',
          'That legal status comes with requirements. A valid tax invoice typically must show the seller\u2019s tax registration number, a unique sequential invoice number, the date of supply, the tax rate applied and the tax amount — the exact list varies by country, but missing elements can make the document invalid for reclaim purposes. It belongs in your accounts from the day it is issued, whether or not the client has paid yet.',
        ],
      },
      {
        heading: 'Side by side: the practical differences',
        paragraphs: [
          'The two documents deliberately share a layout — that is the point of the proforma, to preview the real invoice — but almost everything about their status differs.',
        ],
        bullets: [
          'Purpose — proforma: quote/confirm an upcoming sale. Tax invoice: record a completed sale and demand payment.',
          'When issued — proforma: before delivery. Tax invoice: at or after delivery.',
          'Tax — proforma: shows expected tax for information only; no tax is due. Tax invoice: the tax shown is legally charged and must be declared.',
          'Tax reclaim — proforma: the buyer cannot reclaim any tax from it. Tax invoice: the buyer\u2019s evidence for reclaiming input tax.',
          'Bookkeeping — proforma: stays out of the sales ledger. Tax invoice: recorded as revenue and a receivable.',
          'Numbering — proforma: often a separate series or marked "PRO". Tax invoice: your main sequential series.',
        ],
      },
      {
        heading: 'When to send a proforma',
        paragraphs: [
          'Send a proforma when the other side needs the full invoice picture before anything moves. The classic cases: a customer who must pay (or arrange payment) before you ship; customs and freight forwarders, who need values and descriptions for goods in transit; a bank processing a letter of credit or an advance payment; a client whose internal process requires an invoice-shaped document to raise a purchase order or release a deposit; and export orders generally, where the proforma doubles as the seller\u2019s formal offer.',
          'In services, the equivalent moment is the deposit invoice that is not yet a sale: a wedding venue confirming a booking, a developer starting on a 30% advance. If the money is an advance against future work rather than payment for work done, many businesses issue a proforma first and the tax invoice when the advance is applied or the work delivered — the exact treatment depends on your local rules for advance payments, which are worth one conversation with your accountant.',
        ],
      },
      {
        heading: 'When only a tax invoice will do',
        paragraphs: [
          'Once the goods have been delivered or the work completed, the document must be a tax invoice. Your client cannot reclaim their input tax from anything else, their auditors will ask for it by name, and your own tax return is built from these documents. Sending a proforma at this stage does not just look unprofessional — it can leave the client unable to book the cost properly, which delays your payment while they ask for the correct document.',
          'Timing matters too. Many tax systems require the tax invoice to be issued within a set window after the supply — days or weeks depending on the country. The practical habit is simple: delivery note signed or work signed off, tax invoice issued the same day, from your main numbering sequence, with your registration number on it.',
        ],
      },
      {
        heading: 'The common mistake: treating a proforma as the final bill',
        paragraphs: [
          'The mix-up we see most often is a business that sends a proforma, gets paid against it, and never issues the tax invoice at all. The client cannot reclaim the tax, the sale is missing from the seller\u2019s records, and the discrepancy surfaces at the worst possible time — a tax inspection or the client\u2019s audit. The reverse error exists too: issuing a full tax invoice for a sale that then falls through, which obliges you to cancel it formally with a credit note rather than quietly deleting it.',
          'Keep the two in separate lanes: proformas in their own clearly-labelled series for quotes, deposits and customs; tax invoices in your main sequence for completed work. This invoice generator handles the tax-invoice side — with your tax name, rate and registration details in the profile — and the quote generator covers the priced-offer stage before work begins. Use each document for the job its name describes, and your paperwork will survive anyone\u2019s audit.',
        ],
      },
    ],
  },
];
