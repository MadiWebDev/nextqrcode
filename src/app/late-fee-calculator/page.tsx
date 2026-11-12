'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, CalendarDays, Check, Copy, Percent } from 'lucide-react';

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

const basisOptions = [
  { value: 'percent-month', label: 'Percent per month' },
  { value: 'percent-year', label: 'Percent per year' },
  { value: 'flat-month', label: 'Flat amount per month' },
];

function parseAmount(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function parseDateValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function diffInDays(fromValue: string, toValue: string): number {
  const from = parseDateValue(fromValue);
  const to = parseDateValue(toValue);
  if (!from || !to) return 0;
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / 86400000);
}

function formatDateLong(value: string): string {
  const parsed = parseDateValue(value);
  if (!parsed) return value;
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed);
  } catch {
    return value;
  }
}

const faqs = [
  {
    question: 'Is the late fee from this calculator compound?',
    answer:
      'No. This calculator charges simple fees only: the fee is always worked out on the original invoice amount, never on a growing balance that includes earlier fees. Compounding — charging a fee on top of unpaid fees — is harder to justify, is restricted or disallowed for many kinds of debt, and surprises clients in a way that damages the relationship. If your contract genuinely specifies compound interest, you will need a spreadsheet or accountant to model it; for the standard late-fee clauses most freelancers and small businesses use, simple is the correct and defensible method.',
  },
  {
    question: 'How are partial months handled?',
    answer:
      'Pro-rata, by the day. The calculator converts chargeable days overdue into months by dividing by 30, so 42 chargeable days count as 1.40 months and attract 1.40 times the monthly fee — not one month rounded up to two. The same daily logic applies to the other bases: annual fees divide the year into 365 daily slices, and flat monthly fees are multiplied by days divided by 30. Counting by the day is fairer to the client than rounding every part-month up to a full month, and it is much easier to defend if the fee is ever questioned.',
  },
  {
    question: 'Can I charge a late fee I never agreed with the client?',
    answer:
      'Generally, no. A late fee is enforceable when it was agreed before the work started — written into the contract, the signed quote, or the payment terms the client accepted — or when the law in your area gives you a statutory right to charge interest on overdue commercial invoices. Adding a fee for the first time on the reminder letter itself rarely works and can make the original, perfectly valid invoice harder to collect. Charge what you agreed this time, and put a clear late-fee clause into your terms for the next job.',
  },
  {
    question: 'What is a reasonable late fee rate?',
    answer:
      'Between 1 and 2 percent per month is the range most commonly written into small-business terms — roughly 12 to 24 percent per year — with 1.5 percent per month a very typical middle choice. Some laws cap what can be charged, especially for consumers, and some statutory schemes for business-to-business invoices set their own rate, so check the rules that apply to you before printing a rate on your invoices. A rate that is modest, disclosed in advance and applied consistently is far more collectable than an aggressive rate a client can challenge.',
  },
  {
    question: 'Does a grace period change the due date?',
    answer:
      'No. The due date stays exactly where your invoice put it, and the invoice is still late from that date for every other purpose — credit decisions, your own records, and any pause-work clause. The grace period only delays the moment the fee starts accruing: with five grace days, an invoice ten days past due has five chargeable days. Grace periods exist because bank transfers clear slowly and honest clients miss by days, not weeks; they are a fairness cushion on the fee, not an extension of the terms.',
  },
];

export default function LateFeeCalculatorPage() {
  const [today] = useState(() => toISODate(new Date()));
  const [defaultDueDate] = useState(() =>
    toISODate(new Date(Date.now() - 47 * 24 * 60 * 60 * 1000))
  );

  const [amount, setAmount] = useState('1200');
  const [currency, setCurrency] = useState('USD');
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [basis, setBasis] = useState('percent-month');
  const [feeValue, setFeeValue] = useState('1.5');
  const [graceDays, setGraceDays] = useState('5');
  const [asOfDate, setAsOfDate] = useState(today);
  const [copied, setCopied] = useState(false);

  const calc = useMemo(() => {
    const principal = Math.max(parseAmount(amount), 0);
    const rate = Math.max(parseAmount(feeValue), 0);
    const grace = Math.max(0, Math.round(parseAmount(graceDays)));
    const rawDays = diffInDays(dueDate, asOfDate);
    const calendarDaysPastDue = Math.max(rawDays, 0);
    const chargeableDays = Math.max(rawDays - grace, 0);
    const months = chargeableDays / 30;
    const years = chargeableDays / 365;
    let fee = 0;
    if (basis === 'percent-month') {
      fee = principal * (rate / 100) * months;
    } else if (basis === 'percent-year') {
      fee = principal * (rate / 100) * years;
    } else {
      fee = rate * months;
    }
    return {
      principal,
      rate,
      grace,
      rawDays,
      calendarDaysPastDue,
      chargeableDays,
      months,
      years,
      fullMonths: Math.floor(chargeableDays / 30),
      extraDays: chargeableDays % 30,
      fee,
      total: principal + fee,
      notOverdue: rawDays <= 0,
    };
  }, [amount, asOfDate, basis, dueDate, feeValue, graceDays]);

  const basisLabel =
    basisOptions.find((option) => option.value === basis)?.label ?? 'Percent per month';

  const feeRateLabel =
    basis === 'flat-month'
      ? `${formatMoney(calc.rate, currency)} per month`
      : `${calc.rate}% ${basis === 'percent-year' ? 'per year' : 'per month'}`;

  const breakdownLines: string[] = calc.notOverdue
    ? [
        `Due date: ${formatDateLong(dueDate)}. Calculated as of: ${formatDateLong(asOfDate)}.`,
        'Not yet overdue: the as-of date is on or before the due date, so no late fee has accrued.',
        `Fee accrued: ${formatMoney(0, currency)}. Total now due: ${formatMoney(calc.principal, currency)}.`,
      ]
    : [
        `Calendar time past due: ${calc.calendarDaysPastDue} days, from the due date ${formatDateLong(dueDate)} to ${formatDateLong(asOfDate)}.`,
        `Chargeable period: ${calc.calendarDaysPastDue} days − ${calc.grace} grace days = ${calc.chargeableDays} days (${calc.months.toFixed(2)} months — that is ${calc.fullMonths} full month${calc.fullMonths === 1 ? '' : 's'} plus ${calc.extraDays} extra day${calc.extraDays === 1 ? '' : 's'}).`,
        basis === 'percent-month'
          ? `Fee: ${formatMoney(calc.principal, currency)} × ${calc.rate}% per month × ${calc.months.toFixed(2)} months = ${formatMoney(calc.fee, currency)}.`
          : basis === 'percent-year'
            ? `Fee: ${formatMoney(calc.principal, currency)} × ${calc.rate}% per year × ${calc.years.toFixed(4)} years (${calc.chargeableDays} ÷ 365) = ${formatMoney(calc.fee, currency)}.`
            : `Fee: ${formatMoney(calc.rate, currency)} per month × ${calc.months.toFixed(2)} months = ${formatMoney(calc.fee, currency)}.`,
        `Total now due: ${formatMoney(calc.principal, currency)} + ${formatMoney(calc.fee, currency)} = ${formatMoney(calc.total, currency)}.`,
      ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'Late Fee Calculator', href: '/late-fee-calculator' }]} />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Calculator className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Free Late Fee Calculator</h1>
        <p className="text-muted-foreground leading-relaxed">
          Work out exactly what an overdue invoice has accrued, down to the day. Enter the
          invoice amount, the due date, and the fee your terms specify — a percentage per month,
          a percentage per year, or a flat amount per month — add any grace days you allow, and
          this calculator counts the chargeable days, applies simple, non-compounding maths, and
          shows every step of the working so you can paste the breakdown straight into a reminder
          letter or hand it to your accountant.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Invoice and fee terms</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-amount">Invoice amount</Label>
                <Input
                  id="invoice-amount"
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="as-of-date">Calculate as of</Label>
                <Input
                  id="as-of-date"
                  type="date"
                  value={asOfDate}
                  onChange={(event) => setAsOfDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee-basis">Fee basis</Label>
                <Select value={basis} onValueChange={setBasis}>
                  <SelectTrigger id="fee-basis" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {basisOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee-value">
                  {basis === 'flat-month' ? 'Fee amount per month' : 'Fee rate (%)'}
                </Label>
                <Input
                  id="fee-value"
                  type="number"
                  min="0"
                  step="any"
                  value={feeValue}
                  onChange={(event) => setFeeValue(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grace-days">Grace days (no fee charged)</Label>
                <Input
                  id="grace-days"
                  type="number"
                  min="0"
                  step="1"
                  value={graceDays}
                  onChange={(event) => setGraceDays(event.target.value)}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the fee exactly as written in your agreed terms. The basis matters as much as
              the number: 1.5 percent per month and 1.5 percent per year differ by a factor of
              twelve, and confusing them is the most common late-fee mistake there is.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Result
            </h2>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Invoice amount</span>
                <span className="font-medium">{formatMoney(calc.principal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Due date</span>
                <span className="font-medium">{formatDateLong(dueDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Calculated as of</span>
                <span className="font-medium">{formatDateLong(asOfDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Calendar days past due</span>
                <span className="font-medium">{calc.calendarDaysPastDue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Grace days</span>
                <span className="font-medium">{calc.grace}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Chargeable days overdue</span>
                <span className="font-medium">{calc.chargeableDays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Fee basis</span>
                <span className="font-medium">
                  {basisLabel} — {feeRateLabel}
                </span>
              </div>
              {calc.notOverdue ? (
                <p className="text-sm rounded-md bg-emerald-50 text-emerald-900 px-3 py-2">
                  Not yet overdue: the as-of date is on or before the due date, so no late fee
                  has accrued. The invoice only starts accruing a fee once it passes the due
                  date plus your {calc.grace} grace days.
                </p>
              ) : null}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">Fee accrued</span>
                  <span className="text-xl font-bold">{formatMoney(calc.fee, currency)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">Total now due</span>
                  <span className="text-2xl font-bold">{formatMoney(calc.total, currency)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Step-by-step breakdown
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              {breakdownLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Every figure above is simple interest on the original invoice amount only. The fee
              never accrues on itself, so the daily cost of staying overdue is constant — for the
              default example on this page it is the monthly fee divided by 30, charged once per
              chargeable day.
            </p>
            <div className="space-y-2">
              <Label htmlFor="breakdown-text">
                Breakdown as text — copy it into your reminder letter
              </Label>
              <Textarea
                id="breakdown-text"
                value={breakdownLines.join('\n')}
                readOnly
                rows={4}
              />
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(breakdownLines.join('\n'));
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy breakdown'}
              </Button>
            </div>
          </section>
        </div>
      </Card>

      <AdSlot id="late-fee-calculator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How late fees work: the three common structures</h2>
        <p className="text-muted-foreground leading-relaxed">
          Almost every late-fee clause in a small-business contract uses one of three
          structures. The first, and by far the most common for freelancers and service
          businesses, is a percentage per month: the overdue amount grows by a fixed slice —
          often 1 to 2 percent — for each month, or part of a month, that it stays unpaid. The
          second is a percentage per year, the style banks, card issuers and larger suppliers
          prefer: the same idea expressed as an annual rate, so the fee for a period is the
          amount multiplied by the annual rate multiplied by the days divided by 365. The
          third is a flat amount per month — say 25 dollars for every month an invoice remains
          unpaid — which is simple to explain and does not scale with the size of the invoice,
          making it popular for small recurring bills such as rent, retainers and subscriptions.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Here is the monthly-percentage structure worked through in full, using exactly the
          numbers this calculator loads with. An invoice for USD 1,200.00 falls due, and the
          check is run 47 calendar days later. The terms allow 5 grace days, so the chargeable
          period is 47 − 5 = 42 days. Converted to months at 30 days per month, 42 days is 1.40
          months. The fee is therefore USD 1,200.00 × 1.5% per month × 1.40 months = USD 25.20,
          and the total now due is USD 1,200.00 + USD 25.20 = USD 1,225.20. Notice what the fee
          is calculated on: the original 1,200.00, once, for the whole period. Nothing in that
          sum charges a fee on a fee, and every number in it can be checked by the client with
          a pocket calculator — which is exactly why this style of breakdown, pasted into a
          reminder letter, ends arguments before they start.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Simple versus compound: why this calculator uses simple maths only</h2>
        <p className="text-muted-foreground leading-relaxed">
          A simple fee is charged only on the original invoice amount. A compound fee is charged
          on the amount plus the fees already added, so the balance — and the next fee — keeps
          growing on itself. Over a single month the difference is pennies; over a year of
          non-payment it becomes the difference between a fee a client accepts as fair and a
          number they dispute on sight. Compounding is also the version most likely to fall foul
          of the law: many jurisdictions restrict interest-on-interest for consumer debts, some
          standard contract rules treat unexplained compounding as an unfair term, and a client
          who agreed to “1.5 percent per month” almost certainly did not understand themselves
          to be agreeing to a rate that rises every month.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          That is why this calculator is deliberately simple-only. The daily cost of an overdue
          invoice stays constant — the monthly fee divided by 30, per chargeable day — so the
          figure you quote on day 20 and the figure you quote on day 50 come from the same
          straight line, and you can reconcile them in seconds. If your own signed agreement
          genuinely specifies compound interest, this tool is not the right instrument: model
          that in a spreadsheet period by period, and be ready to show the client the clause
          they signed. For the overwhelming majority of freelance and small-business terms —
          a flat percentage per month on the invoice amount — simple maths is not a limitation.
          It is the agreement, calculated correctly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Are late fees legal and enforceable? The honest answer</h2>
        <p className="text-muted-foreground leading-relaxed">
          A late fee is not something you are owed just because a payment is late. In most
          places it is enforceable for one of two reasons: either the client agreed to it in
          advance — it was written in the contract, the signed quote, or the payment terms they
          accepted before the work began — or a law gives you a statutory right to interest on
          overdue invoices, as some countries do for business-to-business trade. If neither of
          those is true, adding a fee after the event is usually just a request the client can
          decline, and insisting on it can slow down payment of the original invoice, which was
          never in dispute. This calculator takes no position on your specific situation: it
          does the arithmetic on whatever basis you enter, and it is your job to enter only a
          fee you are actually entitled to charge.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Etiquette supports the same conclusion as the law. Disclose the fee before the work
          starts, keep the rate modest — 1 to 2 percent per month is the range clients
          recognise as normal — apply it consistently rather than only to clients you dislike,
          and show the full working whenever you charge it, the way the breakdown panel above
          does. If a long-standing client pays a few days late for the first time, waiving the
          fee and saying so buys more goodwill than the fee was worth. Reserve actually charging
          fees for repeat late payers, and always warn in the reminder letter before the fee
          lands. Nothing in this page is legal advice; if a large amount turns on a fee, a
          short conversation with a local lawyer or accountant costs less than a disputed
          invoice.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Better than fees: how to get paid on time in the first place</h2>
        <p className="text-muted-foreground leading-relaxed">
          A late fee compensates you for waiting; it does not make the money arrive. Businesses
          that rarely chase payments usually prevent lateness instead. The strongest lever is
          money up front: a deposit of 30 to 50 percent before work starts, or milestone billing
          on long projects, means an overdue final invoice is an annoyance rather than a
          crisis. The second lever is shorter terms — Net 7 or Net 14 instead of Net 30 halves
          the time your cash spends in someone else’s bank account, and small clients rarely
          object when the terms are stated on the quote. The third is making payment effortless:
          a payment link or QR code on the invoice, bank details printed in full, and the
          invoice addressed to the person who can actually approve it.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Early-payment discounts work on the same psychology from the other side: “2/10 Net 30”
          — 2 percent off if paid within 10 days, full amount due in 30 — costs you a little
          margin and buys you payment weeks early, and unlike a fee it makes the client feel
          rewarded rather than punished. Combine that with a reminder rhythm — a friendly note
          before the due date, one on the day, one a week later — and a pause-work clause you
          are genuinely willing to use, and the late-fee calculator becomes what it should be:
          a tool you reach for rarely, whose main job is proving that the small number on your
          reminder letter was worked out fairly, in the open, day by day.
        </p>
      </section>

      <AdSlot id="late-fee-calculator-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          }}
        />
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="border rounded-lg p-4 space-y-2">
              <dt className="font-semibold">{faq.question}</dt>
              <dd className="text-muted-foreground leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
