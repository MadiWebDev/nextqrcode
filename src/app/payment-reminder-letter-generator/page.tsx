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
import {
  Bell,
  Check,
  Copy,
  Download,
  FileText,
  Mail,
  MessageCircle,
} from 'lucide-react';
import JsPDF from 'jspdf';

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];
const tones = ['Friendly', 'Firm', 'Final notice'];

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

function addDays(value: string, days: number): string {
  const parsed = parseDateValue(value);
  if (!parsed) return value;
  parsed.setDate(parsed.getDate() + days);
  return toISODate(parsed);
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

interface LetterData {
  businessName: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  clientName: string;
  clientCompany: string;
  invoiceNumber: string;
  invoiceDateLabel: string;
  dueDateLabel: string;
  amountLabel: string;
  lateFee: number;
  lateFeeLabel: string;
  totalLabel: string;
  daysOverdue: number;
  paymentInstructions: string;
  firmDeadlineLabel: string;
  finalDeadlineLabel: string;
}

function signOffLines(data: LetterData, closing: string): string {
  return [
    closing,
    data.senderName,
    data.businessName,
    [data.senderEmail, data.senderPhone].filter(Boolean).join(' · '),
  ]
    .filter(Boolean)
    .join('\n');
}

function paymentBlock(data: LetterData): string {
  return data.paymentInstructions.trim()
    ? `How to pay:\n${data.paymentInstructions.trim()}`
    : '';
}

function friendlyLetter(data: LetterData): { subject: string; body: string } {
  const subject = `Friendly reminder: invoice ${data.invoiceNumber} for ${data.amountLabel}`;
  const dayWord = data.daysOverdue === 1 ? 'day' : 'days';
  const opening =
    data.daysOverdue > 0
      ? `I hope you are well. I am writing with a gentle reminder about invoice ${data.invoiceNumber}, issued on ${data.invoiceDateLabel} for ${data.amountLabel}. The invoice was due on ${data.dueDateLabel}, which makes it ${data.daysOverdue} ${dayWord} overdue today, so I wanted to check it has not simply slipped through the net. With busy inboxes, approval queues and staff changes, that happens more often than any of us would like, and there is no cause for embarrassment if that is all it is.`
      : `I hope you are well. I am writing with a gentle note about invoice ${data.invoiceNumber}, issued on ${data.invoiceDateLabel} for ${data.amountLabel}, which is due on ${data.dueDateLabel}. I am sending this a little ahead of the deadline so you have everything you need to process it smoothly, and so we can clear up anything that looks unclear while there is still plenty of time.`;
  const feeParagraph =
    data.lateFee > 0
      ? `One small detail: a late fee of ${data.lateFeeLabel} has been added, exactly as set out in the payment terms we agreed, which brings the total now due to ${data.totalLabel}. If your payment is already on its way, just tell me and I will check our account the same day — and if the payment crossed with this letter, I will remove the fee straight away.`
      : data.daysOverdue > 0
        ? `No late fee has been added, and I would much rather keep it that way, so a quick payment now — or even a quick reply telling me when to expect it — would be genuinely appreciated.`
        : `There is nothing else outstanding on your account, and no extra charges of any kind apply to this invoice.`;
  const helpParagraph = `If anything on the invoice looks wrong, if you need a fresh copy, a purchase-order reference added, or the file in a different format for your accounts system, just reply to this letter and I will sort it out the same day. And if a little extra time would help, please say so — I would far rather agree a realistic date with you than sit here guessing. If you have already paid in the last few days, please ignore this reminder entirely, and accept my thanks instead.`;
  const body = [
    `Dear ${data.clientName},`,
    opening,
    feeParagraph,
    helpParagraph,
    paymentBlock(data),
    `Thank you for your business, and for looking at this so promptly.`,
    signOffLines(data, 'Warm regards,'),
  ]
    .filter(Boolean)
    .join('\n\n');
  return { subject, body };
}

function firmLetter(data: LetterData): { subject: string; body: string } {
  const subject =
    data.daysOverdue > 0
      ? `Invoice ${data.invoiceNumber} is ${data.daysOverdue} days overdue — payment requested by ${data.firmDeadlineLabel}`
      : `Invoice ${data.invoiceNumber} — payment requested by ${data.firmDeadlineLabel}`;
  const dayWord = data.daysOverdue === 1 ? 'day' : 'days';
  const opening =
    data.daysOverdue > 0
      ? `I am writing about invoice ${data.invoiceNumber}, issued on ${data.invoiceDateLabel} for ${data.amountLabel}, which was due on ${data.dueDateLabel}. The invoice is now ${data.daysOverdue} ${dayWord} overdue, and our records show the balance is still unpaid despite the due date having passed.`
      : `I am writing about invoice ${data.invoiceNumber}, issued on ${data.invoiceDateLabel} for ${data.amountLabel}, which was due on ${data.dueDateLabel}. Our records show the balance is still unpaid, and this letter sets out the date by which it now needs to be settled.`;
  const feeParagraph =
    data.lateFee > 0
      ? `A late fee of ${data.lateFeeLabel} applies under the payment terms agreed before the work began, bringing the total now due to ${data.totalLabel}. Further late fees may continue to apply while the balance remains outstanding, as those same terms set out, so paying the full total now is the cheapest way to close this.`
      : `The full balance now due is ${data.amountLabel}, and no additional charges have been added at this stage.`;
  const deadlineParagraph = `Please arrange payment in full by ${data.firmDeadlineLabel}. If payment will not reach us by that date, contact me before the deadline rather than after it: a short message today gives us options, while silence leaves us very few. If payment has already been sent, send me the date and the payment reference so we can reconcile our records immediately and close the matter.`;
  const pauseParagraph = `Until the balance is cleared, we have paused new work on your account, including work already scheduled. I would much rather not let a payment delay interrupt ${data.clientCompany}’s projects, and clearing this invoice — or agreeing a written payment plan with me this week — is all it takes to restart everything in full.`;
  const disputeParagraph = `If you dispute any part of this invoice, set out the dispute in writing now, stating exactly which item is disputed and why, so it is on record and we can resolve it before the deadline. Disputes raised for the first time after escalation are much harder for both of us to untangle.`;
  const body = [
    `Dear ${data.clientName},`,
    opening,
    feeParagraph,
    deadlineParagraph,
    pauseParagraph,
    disputeParagraph,
    paymentBlock(data),
    signOffLines(data, 'Regards,'),
  ]
    .filter(Boolean)
    .join('\n\n');
  return { subject, body };
}

function finalNoticeLetter(data: LetterData): { subject: string; body: string } {
  const subject = `Final notice: invoice ${data.invoiceNumber} — immediate payment required`;
  const dayWord = data.daysOverdue === 1 ? 'day' : 'days';
  const opening =
    data.daysOverdue > 0
      ? `This letter is a final notice about invoice ${data.invoiceNumber}. Despite earlier reminders, the balance remains unpaid. The invoice was issued on ${data.invoiceDateLabel}, was due on ${data.dueDateLabel}, and is now ${data.daysOverdue} ${dayWord} overdue.`
      : `This letter is a final notice about invoice ${data.invoiceNumber}, issued on ${data.invoiceDateLabel} for ${data.amountLabel} and due on ${data.dueDateLabel}. We are writing now, formally and on the record, so there can be no misunderstanding about what follows if the balance is not paid.`;
  const amountParagraph =
    data.lateFee > 0
      ? `The amount outstanding is ${data.amountLabel}. A late fee of ${data.lateFeeLabel} also applies under our agreed payment terms, making the total now due ${data.totalLabel}.`
      : `The total amount now due is ${data.amountLabel}.`;
  const escalationParagraph = `Unless payment in full reaches us by ${data.finalDeadlineLabel}, we will escalate recovery of this debt without further notice. That may include instructing a debt collection agency, starting legal proceedings, and claiming any additional interest, late fees and recovery costs we are entitled to under our agreement and applicable law. This letter will form part of the record of the steps taken to recover the debt.`;
  const optionsParagraph = `If you cannot pay in full, contact us before ${data.finalDeadlineLabel} to propose a payment plan in writing. We would still rather reach an agreement than begin formal action, but any plan must be agreed before that date. If you dispute this invoice, write to us before the deadline stating exactly what is disputed and why, so the dispute is formally on record.`;
  const closingParagraph = `Please treat this letter as formal notice. If payment has already been made, send proof of payment immediately so we can close the matter today.`;
  const body = [
    `Dear ${data.clientName},`,
    opening,
    amountParagraph,
    escalationParagraph,
    optionsParagraph,
    closingParagraph,
    paymentBlock(data),
    signOffLines(data, 'Yours faithfully,'),
  ]
    .filter(Boolean)
    .join('\n\n');
  return { subject, body };
}

const faqs = [
  {
    question: 'When should I send the first payment reminder?',
    answer:
      'Earlier than most people think. A short, friendly note two or three days before the due date — framed as making sure the client has everything they need — prevents more late payments than any letter sent afterwards. Send the first overdue reminder on the day after the due date or within the first week, while the invoice is still fresh. Waiting a month before saying anything teaches the client that your deadlines are flexible, and it pushes your invoice to the back of their payment queue behind everyone who asked sooner.',
  },
  {
    question: 'How many reminders should I send before taking legal action?',
    answer:
      'Three written reminders is the pattern most small businesses and courts consider reasonable: a friendly reminder in the first week, a firm letter at around two to four weeks overdue with a specific payment deadline, and a final notice that names a short deadline and states plainly what happens next. Keep copies of all three with their dates. That paper trail shows you acted fairly and gave repeated chances to pay, which matters if the debt is later disputed or goes to a collection agency or court.',
  },
  {
    question: 'Can I charge a late fee on an overdue invoice?',
    answer:
      'Only if the fee was agreed in advance — in your contract, your signed quote, or the payment terms the client accepted before the work started — or if the law where you operate gives you a statutory right to charge one. You generally cannot invent a fee after the invoice is already overdue and expect it to be enforceable. If your current terms say nothing about late payment, send reminders without a fee this time, and add a clear late-fee clause to your terms for every future job.',
  },
  {
    question: 'Should I attach the invoice again with a reminder letter?',
    answer:
      'Yes, almost always. The most common honest reason for non-payment is that the invoice never reached the right person, was filed in the wrong folder, or is sitting in an approval queue waiting for the document itself. Attaching a fresh copy removes that excuse, saves the client a search, and means the accounts team has the invoice number, the exact amount and your bank details in the same email as your reminder. Name the file with the invoice number so it is easy to find later.',
  },
  {
    question: 'What should I do if the client disputes the invoice?',
    answer:
      'Stop the escalation clock and deal with the dispute on its own merits. Ask the client to state exactly what is disputed — the amount, an item, the quality of the work — and put your reply in writing. If part of the invoice is genuinely wrong, correct it, reissue it with a new date, and ask for payment of the undisputed part straight away. Never threaten collection action over an amount that is subject to a real, specific dispute: it damages your position, and in many places it is not permitted.',
  },
];

export default function PaymentReminderLetterGeneratorPage() {
  const [today] = useState(() => toISODate(new Date()));
  const [defaultInvoiceDate] = useState(() =>
    toISODate(new Date(Date.now() - 44 * 24 * 60 * 60 * 1000))
  );
  const [defaultDueDate] = useState(() =>
    toISODate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
  );

  const [businessName, setBusinessName] = useState('Ayesha Khan Design Studio');
  const [senderName, setSenderName] = useState('Ayesha Khan');
  const [senderEmail, setSenderEmail] = useState('billing@example.com');
  const [senderPhone, setSenderPhone] = useState('+92 300 1234567');
  const [clientName, setClientName] = useState('Imran Sheikh');
  const [clientCompany, setClientCompany] = useState('Northwind Traders');
  const [clientEmail, setClientEmail] = useState('accounts@northwind.example');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-1042');
  const [invoiceDate, setInvoiceDate] = useState(defaultInvoiceDate);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [amountDue, setAmountDue] = useState('1200');
  const [currency, setCurrency] = useState('USD');
  const [lateFee, setLateFee] = useState('18');
  const [tone, setTone] = useState('Friendly');
  const [paymentInstructions, setPaymentInstructions] = useState(
    'Bank transfer to Meezan Bank, IBAN PK36 MEZN 0001 2345 6789 0123, account title Ayesha Khan Design Studio. Please quote invoice INV-1042 with your payment.'
  );
  const [copied, setCopied] = useState(false);

  const letterData = useMemo<LetterData>(() => {
    const amount = parseAmount(amountDue);
    const fee = Math.max(parseAmount(lateFee), 0);
    return {
      businessName: businessName.trim() || 'Your Business',
      senderName: senderName.trim() || 'Your Name',
      senderEmail: senderEmail.trim(),
      senderPhone: senderPhone.trim(),
      clientName: clientName.trim() || 'Client',
      clientCompany: clientCompany.trim() || 'your company',
      invoiceNumber: invoiceNumber.trim() || 'INV-001',
      invoiceDateLabel: formatDateLong(invoiceDate),
      dueDateLabel: formatDateLong(dueDate),
      amountLabel: formatMoney(amount, currency),
      lateFee: fee,
      lateFeeLabel: formatMoney(fee, currency),
      totalLabel: formatMoney(amount + fee, currency),
      daysOverdue: Math.max(diffInDays(dueDate, today), 0),
      paymentInstructions,
      firmDeadlineLabel: formatDateLong(addDays(today, 7)),
      finalDeadlineLabel: formatDateLong(addDays(today, 3)),
    };
  }, [
    amountDue,
    businessName,
    clientCompany,
    clientName,
    currency,
    dueDate,
    invoiceDate,
    invoiceNumber,
    lateFee,
    paymentInstructions,
    senderEmail,
    senderName,
    senderPhone,
    today,
  ]);

  const letter = useMemo(() => {
    if (tone === 'Firm') return firmLetter(letterData);
    if (tone === 'Final notice') return finalNoticeLetter(letterData);
    return friendlyLetter(letterData);
  }, [letterData, tone]);

  const todayLabel = formatDateLong(today);
  const fullLetterText = `Subject: ${letter.subject}\n\n${letterData.businessName}\n${todayLabel}\n\n${letter.body}`;
  const mailtoHref = `mailto:${encodeURIComponent(clientEmail.trim())}?subject=${encodeURIComponent(letter.subject)}&body=${encodeURIComponent(fullLetterText)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(fullLetterText)}`;

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(fullLetterText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const downloadPdf = () => {
    const doc = new JsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 18;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 18;
      }
    };

    const printWrapped = (text: string, indent = 15) => {
      const lines = doc.splitTextToSize(text, pageWidth - indent - 15) as string[];
      lines.forEach((line) => {
        ensureSpace(6);
        doc.text(line, indent, y);
        y += 5;
      });
    };

    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    printWrapped(letterData.businessName);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactLine = [letterData.senderEmail, letterData.senderPhone]
      .filter(Boolean)
      .join(' · ');
    if (contactLine) printWrapped(contactLine);
    printWrapped(todayLabel);
    y += 5;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    printWrapped(`Subject: ${letter.subject}`);
    y += 4;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    letter.body.split('\n\n').forEach((block) => {
      block.split('\n').forEach((line) => {
        if (line.trim()) printWrapped(line);
      });
      y += 3;
    });

    doc.save(`payment-reminder-${letterData.invoiceNumber}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          {
            label: 'Payment Reminder Letter Generator',
            href: '/payment-reminder-letter-generator',
          },
        ]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Bell className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Payment Reminder Letter Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Chasing an unpaid invoice is awkward, and writing the chase-up letter from a blank
          page makes it worse. This generator does the wording for you: enter the invoice
          details once, pick a tone — friendly, firm or final notice — and it calculates how
          many days the invoice is overdue, writes a complete, correctly worded letter with
          the exact amount, dates and payment instructions, and lets you copy it, download it
          as a PDF, or send it straight away by email or WhatsApp.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Your details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Your business name</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-name">Your name</Label>
                <Input
                  id="sender-name"
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-email">Your email</Label>
                <Input
                  id="sender-email"
                  type="email"
                  value={senderEmail}
                  onChange={(event) => setSenderEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-phone">Your phone</Label>
                <Input
                  id="sender-phone"
                  value={senderPhone}
                  onChange={(event) => setSenderPhone(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Client and invoice</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client contact name</Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-company">Client company</Label>
                <Input
                  id="client-company"
                  value={clientCompany}
                  onChange={(event) => setClientCompany(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Client email (optional, for Send by email)</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientEmail}
                  onChange={(event) => setClientEmail(event.target.value)}
                  placeholder="accounts@client.example"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice number</Label>
                <Input
                  id="invoice-number"
                  value={invoiceNumber}
                  onChange={(event) => setInvoiceNumber(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-date">Invoice date</Label>
                <Input
                  id="invoice-date"
                  type="date"
                  value={invoiceDate}
                  onChange={(event) => setInvoiceDate(event.target.value)}
                />
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
                <Label htmlFor="amount-due">Amount due</Label>
                <Input
                  id="amount-due"
                  type="number"
                  min="0"
                  step="any"
                  value={amountDue}
                  onChange={(event) => setAmountDue(event.target.value)}
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
                <Label htmlFor="late-fee">Late fee amount (0 = none)</Label>
                <Input
                  id="late-fee"
                  type="number"
                  min="0"
                  step="any"
                  value={lateFee}
                  onChange={(event) => setLateFee(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tone of the letter</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Days overdue are calculated automatically from the due date:{' '}
              <strong className="text-foreground">
                {letterData.daysOverdue} {letterData.daysOverdue === 1 ? 'day' : 'days'} overdue
              </strong>{' '}
              as of today ({todayLabel}). If the due date is today or still ahead, the count is
              zero and the letter uses “due” wording instead of “overdue”.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">How the client should pay</h2>
            <div className="space-y-2">
              <Label htmlFor="payment-instructions">
                Payment instructions (bank details or payment link)
              </Label>
              <Textarea
                id="payment-instructions"
                value={paymentInstructions}
                onChange={(event) => setPaymentInstructions(event.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                These lines are printed in the letter exactly as written. A reminder that makes
                paying take effort rarely gets paid quickly, so include the bank, the account
                number or IBAN, and the reference the client should quote.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Live preview
            </h2>
            <p className="text-sm">
              <span className="font-semibold">Subject:</span> {letter.subject}
            </p>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <p className="font-bold">{letterData.businessName}</p>
                <p className="text-sm text-slate-600">
                  {[letterData.senderEmail, letterData.senderPhone].filter(Boolean).join(' · ')}
                </p>
                <p className="text-sm text-slate-600">{todayLabel}</p>
              </div>
              <p className="whitespace-pre-line leading-relaxed">{letter.body}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={copyLetter}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy letter'}
              </Button>
              <Button type="button" variant="outline" onClick={downloadPdf}>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.location.href = mailtoHref;
                }}
              >
                <Mail className="w-4 h-4" />
                Send by email
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.open(whatsappHref, '_blank', 'noopener,noreferrer');
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Share on WhatsApp
              </Button>
            </div>
          </section>
        </div>
      </Card>

      <AdSlot id="payment-reminder-letter-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">The polite escalation ladder: which reminder, and when</h2>
        <p className="text-muted-foreground leading-relaxed">
          Good credit control is a ladder, not a single angry letter. Each step is a little
          firmer than the one before, and each step gives the client a fresh, easy chance to
          pay before things become formal. Jumping straight to threats over a three-day delay
          burns a relationship over what is usually a lost email; staying friendly at ninety
          days overdue teaches the client that your invoices can wait forever. The ladder
          below is the rhythm most freelancers and small businesses settle on, and the three
          tones in this generator are built to match its middle steps exactly.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Before the due date (day −3 to −1).</strong>{' '}
            A courtesy note, not a reminder at all: confirm the invoice arrived, name the due
            date, and ask if anything else is needed for payment to be processed. Half of all
            “late” payments are actually paperwork problems discovered on the due date itself;
            this message finds them while there is still time to fix them.
          </li>
          <li>
            <strong className="text-foreground">Friendly (day 1 to 7 overdue).</strong>{' '}
            Assume an honest oversight, because it usually is. Keep the tone warm, restate the
            amount and the invoice number, attach the invoice again, and offer help — a fresh
            copy, a different format, a named person to talk to. Most invoices are paid at
            this step, and the relationship comes out of it undamaged, often stronger.
          </li>
          <li>
            <strong className="text-foreground">Firm (day 14 to 30 overdue).</strong>{' '}
            The goodwill assumption is replaced by a deadline. State exactly how many days
            overdue the invoice is, name the date payment must arrive by, mention any late fee
            your agreed terms allow, and say what changes if the date is missed — for most
            service businesses, pausing work. Everything is still polite, but nothing is
            vague, and the letter is addressed as a business communication, not a favour.
          </li>
          <li>
            <strong className="text-foreground">Final notice (day 30+ overdue).</strong>{' '}
            Short, formal and on the record. State that this is the last reminder before the
            debt is escalated to a collection agency or legal recovery, give a short final
            deadline, and leave one door open: a written payment plan agreed before that date.
            Send it by a channel that proves delivery where you can, and keep it with the
            earlier letters — together they show a court or agency that you behaved reasonably
            at every step.
          </li>
        </ol>
        <p className="text-muted-foreground leading-relaxed">
          Whatever step you are on, one rule never changes: only move up the ladder when the
          step below has actually been sent and its deadline has actually passed. A final
          notice that follows no earlier reminder reads as panic, and a firm letter sent while
          a friendly one is still within its deadline reads as disorganisation. The ladder
          works because it is predictable — the client learns that your dates mean what they
          say, which is precisely the lesson that gets the next invoice paid on time.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Anatomy of a reminder that actually gets paid</h2>
        <p className="text-muted-foreground leading-relaxed">
          Compare the reminders you have received yourself: the ones you acted on were short,
          specific and easy to comply with. Four ingredients do almost all of the work. First,
          a subject line that carries information on its own — the invoice number and the
          amount — because accounts staff triage by subject line, and “Invoice INV-1042 for
          USD 1,200.00, now 14 days overdue” survives triage in a way “Payment reminder” does
          not. Second, the exact facts in the first paragraph: invoice number, the date the
          invoice was issued, the date it was due, the exact amount, and how many days overdue
          it now is. A reader should never have to open another document to verify that the
          letter is about a real, correctly stated debt.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Third, an easy payment route inside the letter itself: bank name, account number or
          IBAN, the reference to quote, or a direct payment link. Every step you remove between
          reading the letter and making the payment raises the chance it happens today rather
          than next week. Fourth, a single clear ask. One letter should ask for one thing —
          pay in full by a named date, or reply proposing a plan — not three things at once.
          Letters that ask for payment, and an explanation, and a meeting, and confirmation of
          next month’s order tend to get filed under “deal with later”, which is the most
          expensive folder in any accounts department. End with your name, your business name
          and two ways to reach you, so a query takes one click instead of a search.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Sample subject lines for each tone</h2>
        <p className="text-muted-foreground leading-relaxed">
          The generator writes a subject line for you, but if you adapt letters by hand, these
          are the patterns that work. Friendly subjects stay light and helpful: “Friendly
          reminder: invoice INV-1042 for USD 1,200.00”, “Just checking in on invoice INV-1042”,
          or “Everything you need to pay invoice INV-1042 before Friday”. Firm subjects carry
          the fact and the deadline: “Invoice INV-1042 is 14 days overdue — payment requested
          by 19 November”, or “Second reminder: USD 1,200.00 outstanding on invoice INV-1042”.
          Final-notice subjects are formal and unmistakable: “Final notice: invoice INV-1042 —
          immediate payment required”, or “Final notice before escalation: invoice INV-1042”.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Two habits matter more than the exact words. Keep the invoice number in every subject
          line at every stage, so the whole conversation threads together in the client’s inbox
          and in yours. And never let the subject promise something the letter does not say: a
          subject shouting “final notice” over a friendly first reminder destroys the
          credibility of the real final notice later. The mismatch also cuts the other way —
          a gentle “quick question” subject on a genuinely final letter gets the letter opened
          last, not first.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What not to do — and the records to keep</h2>
        <p className="text-muted-foreground leading-relaxed">
          Three mistakes wreck reminder letters. The first is threatening something you cannot
          or will not actually do: promising legal action you have no intention of taking,
          inventing a collection agency, or claiming powers you do not have. As well as being
          dishonest, empty threats are self-defeating — once a client calls the bluff, every
          later letter from you is discounted. Only write the consequence you will genuinely
          carry out on the date you name. The second mistake is abusive or sarcastic language.
          A letter can be completely firm without a single insult, and it must be, because the
          letter may one day be read by a mediator, an agency or a judge, and it will be judged
          as a sample of how you do business. Write every reminder as if it will be read aloud
          in a room you are not in.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The third mistake is getting the facts wrong. A reminder quoting the wrong amount, the
          wrong invoice number or the wrong due date hands the client a legitimate reason to
          ignore the whole letter and quietly damages your credibility on the invoices that are
          correct — which is why this tool pulls every figure from the same fields you entered
          and counts the overdue days itself. Finally, keep records like a person who expects
          to need them: log every reminder you send with its date, its tone, the channel, and
          any reply or promise made, alongside copies of the invoice and the letters themselves.
          A simple line per invoice — number, amount, due date, reminders sent, promises made,
          date paid — takes a minute to maintain and is the difference between a debt you can
          prove and a debt you can only describe.
        </p>
      </section>

      <AdSlot id="payment-reminder-letter-generator-in-content" format="in-article" />

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
