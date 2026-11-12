'use client';

import { useMemo, useRef, useState } from 'react';
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
import { Clock3, Download, FileText, Plus, Trash2 } from 'lucide-react';
import JsPDF from 'jspdf';

interface TimeEntry {
  id: number;
  date: string;
  project: string;
  task: string;
  hours: string;
  rate: string;
}

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

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

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const faqs = [
  {
    question: 'Should the timesheet be part of the invoice or a separate document?',
    answer:
      'Attach it to the invoice — either as the invoice body itself, like this tool produces, or as a supporting page behind a summary invoice. Clients pay faster when the person approving the bill can see, without asking, which days the work happened and what was done. A bare total forces the approver to either trust you blindly or start an email thread; both slow payment down. Keep your own detailed time records behind the summary in case a line is ever questioned.',
  },
  {
    question: 'How should I round my time entries?',
    answer:
      'In consistent, disclosed increments — six minutes (0.1 hour) and fifteen minutes (0.25 hour) are the most common professional conventions. Round each entry, not the invoice total, and apply the same rule to short calls as to long sessions so the rounding is visibly neutral. What matters is that the method is agreed in advance and applied evenly; inventing hours at invoice time, or rounding every five-minute call up to an hour, is how freelancers lose clients and, in disputes, lose the argument.',
  },
  {
    question: 'Can I bill different rates for different kinds of work?',
    answer:
      'Yes — use the rate column per entry. Many freelancers charge a standard rate for production work, a higher rate for urgent or out-of-hours work, and a lower rate for routine administration. The invoice stays honest as long as each rate was agreed with the client beforehand. If rates vary, the project summary on the invoice becomes even more useful, because the client can see the blended cost of each project at a glance.',
  },
  {
    question: 'What if the client disputes hours on an invoice?',
    answer:
      'A dated, task-level timesheet is your evidence — which is why entries should be written the day the work happens, not reconstructed at month end. Walk the client through the disputed lines, offer the underlying records (commits, drafts, call logs, sent deliverables) for the largest entries, and fix genuine mistakes with a credit note rather than an argument. To stop disputes before they start, agree a weekly hours cap or send a mid-month timesheet snapshot on long engagements, so the final invoice never contains a surprise.',
  },
  {
    question: 'Is a timesheet invoice enough for tax purposes?',
    answer:
      'An invoice that lists dated entries, your business identity, the client, a unique invoice number, the tax charged and the total meets the documentary requirements in most jurisdictions — the timesheet detail is extra evidence, not a substitute for any required field. If you are registered for GST or VAT, make sure your registration number appears (add it to your business address block here) and that the tax is calculated on the full billed amount, including any entries at different rates. This tool is not tax advice; a local accountant can confirm your specific obligations in one short call.',
  },
];

export default function TimesheetInvoiceGeneratorPage() {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const [freelancerName, setFreelancerName] = useState('Ayesha Khan — Product Designer');
  const [freelancerDetails, setFreelancerDetails] = useState(
    'Lahore, Pakistan\nayesha@example.com'
  );
  const [clientName, setClientName] = useState('Northwind Traders');
  const [clientDetails, setClientDetails] = useState(
    'Office 402, Trade Centre, Karachi, Pakistan'
  );
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-031');
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(
    () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [currency, setCurrency] = useState('USD');
  const [defaultRate, setDefaultRate] = useState('45');

  const [entries, setEntries] = useState<TimeEntry[]>([
    { id: 1, date: today, project: 'Mobile app redesign', task: 'Onboarding flow wireframes', hours: '3.5', rate: '45' },
    { id: 2, date: today, project: 'Mobile app redesign', task: 'Design review call + revisions', hours: '1.25', rate: '45' },
    { id: 3, date: today, project: 'Brand refresh', task: 'Logo exploration, round 1', hours: '2', rate: '50' },
  ]);
  const nextId = useRef(4);
  const [taxPercent, setTaxPercent] = useState('0');
  const [taxLabel, setTaxLabel] = useState('Tax');
  const [notes, setNotes] = useState(
    'Hours are logged in 15-minute increments and were recorded on the day the work was done. Payment by bank transfer, quoting the invoice number.'
  );

  const totals = useMemo(() => {
    const subtotal = entries.reduce(
      (sum, e) => sum + parseAmount(e.hours) * parseAmount(e.rate),
      0
    );
    const totalHours = entries.reduce((sum, e) => sum + parseAmount(e.hours), 0);
    const taxRate = Math.min(Math.max(parseAmount(taxPercent), 0), 100);
    const taxAmount = (subtotal * taxRate) / 100;
    const byProject = new Map<string, { hours: number; amount: number }>();
    for (const e of entries) {
      const key = e.project.trim() || 'General';
      const row = byProject.get(key) ?? { hours: 0, amount: 0 };
      row.hours += parseAmount(e.hours);
      row.amount += parseAmount(e.hours) * parseAmount(e.rate);
      byProject.set(key, row);
    }
    return {
      subtotal,
      totalHours,
      taxRate,
      taxAmount,
      total: subtotal + taxAmount,
      byProject: [...byProject.entries()],
    };
  }, [entries, taxPercent]);

  const updateEntry = (id: number, field: keyof TimeEntry, value: string) => {
    setEntries((current) =>
      current.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addEntry = () => {
    const id = nextId.current;
    nextId.current += 1;
    setEntries((current) => [
      ...current,
      { id, date: today, project: '', task: '', hours: '1', rate: defaultRate },
    ]);
  };

  const removeEntry = (id: number) => {
    setEntries((current) =>
      current.length > 1 ? current.filter((e) => e.id !== id) : current
    );
  };

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
    [entries]
  );

  const downloadPdf = () => {
    const doc = new JsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('INVOICE', margin, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${invoiceNumber || '-'}`, pageWidth - margin, y, { align: 'right' });
    y += 6;
    doc.setFontSize(10);
    doc.text(`Issued: ${formatDate(issueDate)}`, pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.text(`Due: ${formatDate(dueDate)}`, pageWidth - margin, y, { align: 'right' });
    y += 6;
    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('From', margin, y);
    doc.text('Bill to', pageWidth / 2, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const from = doc.splitTextToSize([freelancerName, freelancerDetails].filter(Boolean).join('\n'), 82) as string[];
    const to = doc.splitTextToSize([clientName, clientDetails].filter(Boolean).join('\n'), 82) as string[];
    doc.text(from, margin, y);
    doc.text(to, pageWidth / 2, y);
    y += Math.max(from.length, to.length) * 4.6 + 4;
    const header = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y - 4.5, pageWidth - margin * 2, 7, 'F');
      doc.text('Date', margin + 1, y);
      doc.text('Project / task', 38, y);
      doc.text('Hours', 148, y, { align: 'right' });
      doc.text('Rate', 166, y, { align: 'right' });
      doc.text('Amount', pageWidth - margin, y, { align: 'right' });
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
    };
    header();
    for (const e of sortedEntries) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 18;
        header();
      }
      const label = [e.project.trim(), e.task.trim()].filter(Boolean).join(' — ') || 'Work';
      const desc = doc.splitTextToSize(label, 104) as string[];
      doc.text(formatDate(e.date), margin + 1, y);
      doc.text(desc, 38, y);
      doc.text(parseAmount(e.hours).toFixed(2), 148, y, { align: 'right' });
      doc.text(formatMoney(parseAmount(e.rate), currency), 166, y, { align: 'right' });
      doc.text(formatMoney(parseAmount(e.hours) * parseAmount(e.rate), currency), pageWidth - margin, y, { align: 'right' });
      y += Math.max(desc.length, 1) * 4.4 + 1.6;
    }
    y += 2;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Project summary', margin, y);
    y += 5.4;
    doc.setFont('helvetica', 'normal');
    for (const [project, row] of totals.byProject) {
      doc.text(`${project} — ${row.hours.toFixed(2)} hrs`, margin, y);
      doc.text(formatMoney(row.amount, currency), 120, y, { align: 'right' });
      y += 5;
    }
    y += 2;
    const lx = 128;
    const rx = pageWidth - margin;
    doc.text(`Total hours: ${totals.totalHours.toFixed(2)}`, margin, y);
    doc.text('Subtotal', lx, y);
    doc.text(formatMoney(totals.subtotal, currency), rx, y, { align: 'right' });
    y += 5.4;
    if (totals.taxRate > 0) {
      doc.text(`${taxLabel} (${totals.taxRate}%)`, lx, y);
      doc.text(formatMoney(totals.taxAmount, currency), rx, y, { align: 'right' });
      y += 5.4;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total due', lx, y);
    doc.text(formatMoney(totals.total, currency), rx, y, { align: 'right' });
    y += 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const nn = doc.splitTextToSize(notes, pageWidth - margin * 2) as string[];
    doc.text(nn, margin, y);
    y += nn.length * 4.6 + 6;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      'Timesheet invoice created with the free Timesheet Invoice Generator — freeqrcode.tools',
      margin,
      y
    );
    doc.save(`timesheet-invoice-${invoiceNumber || 'invoice'}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Timesheet Invoice Generator', href: '/timesheet-invoice-generator' },
        ]}
      />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Timesheet Invoice Generator for Freelancers
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Turn your timesheet straight into an invoice: dated entries with projects, tasks,
          hours and per-entry rates, an automatic project summary, tax and a payment-ready PDF.
          No more copying hours from a spreadsheet into a separate invoice at midnight.
          Everything runs in your browser; nothing is uploaded.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-semibold">You and your client</h2>
            <div className="space-y-2">
              <Label htmlFor="ts-name">Your name / business</Label>
              <Input id="ts-name" value={freelancerName} onChange={(e) => setFreelancerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-details">Your details (address, email, tax number)</Label>
              <Textarea id="ts-details" value={freelancerDetails} onChange={(e) => setFreelancerDetails(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-client">Client name</Label>
              <Input id="ts-client" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-client-details">Client address</Label>
              <Textarea id="ts-client-details" value={clientDetails} onChange={(e) => setClientDetails(e.target.value)} rows={2} />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="text-lg font-semibold">Invoice details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ts-number">Invoice number</Label>
                <Input id="ts-number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ts-issue">Issue date</Label>
                <Input id="ts-issue" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ts-due">Due date</Label>
                <Input id="ts-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ts-currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="ts-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ts-rate">Default rate (per hour)</Label>
                <Input id="ts-rate" type="number" min="0" step="0.01" value={defaultRate} onChange={(e) => setDefaultRate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ts-tax-label">Tax label</Label>
                <Input id="ts-tax-label" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ts-tax">Tax % (if registered)</Label>
                <Input id="ts-tax" type="number" min="0" max="100" step="0.1" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock3 className="h-5 w-5" /> Timesheet entries
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addEntry}>
                <Plus className="h-4 w-4 mr-1" /> Add entry
              </Button>
            </div>
            {entries.map((e) => (
              <div key={e.id} className="space-y-2 border-b border-border/50 pb-4 last:border-0">
                <div className="grid grid-cols-[140px_1fr_36px] gap-2 items-end">
                  <div className="space-y-1">
                    <Label htmlFor={`ts-date-${e.id}`}>Date</Label>
                    <Input id={`ts-date-${e.id}`} type="date" value={e.date} onChange={(ev) => updateEntry(e.id, 'date', ev.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`ts-project-${e.id}`}>Project</Label>
                    <Input id={`ts-project-${e.id}`} value={e.project} onChange={(ev) => updateEntry(e.id, 'project', ev.target.value)} />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeEntry(e.id)} aria-label="Remove entry">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-[1fr_80px_90px] gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`ts-task-${e.id}`}>Task / what was done</Label>
                    <Input id={`ts-task-${e.id}`} value={e.task} onChange={(ev) => updateEntry(e.id, 'task', ev.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`ts-hours-${e.id}`}>Hours</Label>
                    <Input id={`ts-hours-${e.id}`} type="number" min="0" step="0.25" value={e.hours} onChange={(ev) => updateEntry(e.id, 'hours', ev.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`ts-erate-${e.id}`}>Rate</Label>
                    <Input id={`ts-erate-${e.id}`} type="number" min="0" step="0.01" value={e.rate} onChange={(ev) => updateEntry(e.id, 'rate', ev.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="ts-notes">Notes (shown on the invoice)</Label>
              <Textarea id="ts-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
          </Card>
        </div>

        <section className="space-y-4" aria-label="Timesheet invoice preview">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> Live preview
            </h2>
            <Button type="button" onClick={downloadPdf}>
              <Download className="h-4 w-4 mr-2" /> Download PDF invoice
            </Button>
          </div>
          <div className="border rounded-lg bg-white text-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-2xl font-bold tracking-wide">INVOICE</p>
                <p className="text-sm text-slate-600">Timesheet attached — hours as logged.</p>
              </div>
              <div className="text-sm text-right">
                <p>
                  <span className="font-semibold">Invoice No:</span> {invoiceNumber || '—'}
                </p>
                <p>
                  <span className="font-semibold">Issued:</span> {formatDate(issueDate)}
                </p>
                <p>
                  <span className="font-semibold">Due:</span> {formatDate(dueDate)}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-1">From</p>
                <p className="font-medium">{freelancerName || 'Your name'}</p>
                {freelancerDetails ? (
                  <p className="whitespace-pre-line">{freelancerDetails}</p>
                ) : null}
              </div>
              <div>
                <p className="font-semibold mb-1">Bill to</p>
                <p className="font-medium">{clientName || 'Client'}</p>
                {clientDetails ? <p className="whitespace-pre-line">{clientDetails}</p> : null}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 font-semibold">Date</th>
                  <th className="py-2 font-semibold">Project / task</th>
                  <th className="py-2 font-semibold text-right">Hours</th>
                  <th className="py-2 font-semibold text-right">Rate</th>
                  <th className="py-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100">
                    <td className="py-2 whitespace-nowrap">{formatDate(e.date)}</td>
                    <td className="py-2">
                      {[e.project.trim(), e.task.trim()].filter(Boolean).join(' — ') || 'Work'}
                    </td>
                    <td className="py-2 text-right">{parseAmount(e.hours).toFixed(2)}</td>
                    <td className="py-2 text-right">{formatMoney(parseAmount(e.rate), currency)}</td>
                    <td className="py-2 text-right">
                      {formatMoney(parseAmount(e.hours) * parseAmount(e.rate), currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-sm">
              <p className="font-semibold mb-1.5">Project summary</p>
              {totals.byProject.map(([project, row]) => (
                <p key={project} className="flex justify-between py-0.5">
                  <span className="text-slate-600">
                    {project} — {row.hours.toFixed(2)} hrs
                  </span>
                  <span>{formatMoney(row.amount, currency)}</span>
                </p>
              ))}
            </div>
            <div className="ml-auto w-64 text-sm space-y-1.5">
              <p className="flex justify-between">
                <span>Total hours</span>
                <span>{totals.totalHours.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(totals.subtotal, currency)}</span>
              </p>
              {totals.taxRate > 0 && (
                <p className="flex justify-between">
                  <span>
                    {taxLabel} ({totals.taxRate}%)
                  </span>
                  <span>{formatMoney(totals.taxAmount, currency)}</span>
                </p>
              )}
              <p className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total due</span>
                <span>{formatMoney(totals.total, currency)}</span>
              </p>
            </div>
            {notes ? <p className="text-sm text-slate-600">{notes}</p> : null}
          </div>
        </section>
      </div>

      <AdSlot id="timesheet-invoice-generator-after-tool" format="horizontal-banner" />

      <section className="prose prose-neutral dark:prose-invert max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold">Why hourly billing lives or dies on the timesheet</h2>
        <p>
          When you sell time, the invoice is only as believable as the record behind it. A
          client who receives a single line — &quot;Consulting, 40 hours&quot; — has nothing to check
          the number against, so approval depends entirely on trust and on how busy the
          approver is. A dated, task-level timesheet turns the same bill into a document that
          can be verified in a minute: the days match the project calendar, the tasks match
          what was delivered, and the total is arithmetic rather than assertion. Freelancers
          who invoice this way are, in practice, simply paid faster and argued with less.
        </p>
        <p>
          The discipline that makes it work is logging time when it happens. Entries written
          the same day are accurate and specific (&quot;fixed checkout redirect bug, released
          v2.3&quot;); entries reconstructed at month end are neither. Clients can tell the
          difference, and so can you when a dispute surfaces three months later. Use a timer
          or a running note during the day, then transfer the entries here when you invoice —
          the tool keeps the format consistent month after month, which itself becomes part
          of your professional signal.
        </p>
        <h2 className="text-2xl font-bold">Structuring a timesheet invoice that gets approved</h2>
        <p>
          Keep entries small and concrete: one entry per task per day, named after the work
          product, not the effort (&quot;homepage hero redesign — draft 2&quot;, not &quot;design work&quot;).
          Group by project when you run several engagements for one client — the automatic
          project summary in this tool exists because approvers think in project budgets, and
          a summary lets them charge each total to the right cost centre without unpicking
          your entries. Quote hours to two decimals with a consistent increment (0.25 for
          quarter hours is the most readable), keep rates visible per entry if they vary, and
          put the total hours where a manager scanning for one number will find it.
        </p>
        <h2 className="text-2xl font-bold">Caps, retainers and other agreements to settle first</h2>
        <p>
          Most timesheet friction is really agreement friction discovered too late. Before the
          month starts, settle in writing: the rate (and any premium rate for urgent work),
          what counts as billable (calls? travel? revisions?), a weekly or monthly cap if the
          client needs one, and the invoicing rhythm. If you work on a retainer — a fixed
          block of hours bought in advance — the timesheet invoice becomes a draw-down
          statement: entries burn the block down, and the invoice shows hours used, hours
          remaining and any overage billed at the agreed rate. This generator handles the
          overage style out of the box; for a pure draw-down statement, zero-rate the entries
          inside the block and add the used-hours summary in the notes. Either way, the rule
          is the same: the client should never learn what they owe from the invoice itself.
          A short mid-month snapshot on big engagements removes the last source of surprise.
        </p>
      </section>

      <AdSlot id="timesheet-invoice-generator-in-content" format="in-article" />

      <section className="max-w-3xl space-y-4">
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
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="text-muted-foreground mt-1">{faq.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
