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
import { Download, FileText, Plus, Trash2, Wallet } from 'lucide-react';
import JsPDF from 'jspdf';

interface PayRow {
  id: number;
  label: string;
  amount: string;
}

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

const currencyNames: Record<string, string> = {
  PKR: 'Rupees',
  USD: 'Dollars',
  EUR: 'Euros',
  GBP: 'Pounds',
  INR: 'Rupees',
  AED: 'Dirhams',
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
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

function numberToWordsInternational(n: number): string {
  const ones = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const scales: Array<[number, string]> = [
    [1000000000, 'Billion'],
    [1000000, 'Million'],
    [1000, 'Thousand'],
    [100, 'Hundred'],
  ];

  const belowHundred = (value: number): string => {
    if (value < 20) return ones[value];
    const ten = Math.floor(value / 10);
    const rest = value % 10;
    return rest === 0 ? tens[ten] : `${tens[ten]}-${ones[rest]}`;
  };

  const convert = (value: number): string => {
    if (value < 100) return belowHundred(value);
    for (const [scaleValue, scaleName] of scales) {
      if (value >= scaleValue) {
        const head = Math.floor(value / scaleValue);
        const rest = value % scaleValue;
        const headWords =
          scaleValue === 100 ? ones[head] : convert(head);
        return rest === 0
          ? `${headWords} ${scaleName}`
          : `${headWords} ${scaleName} ${convert(rest)}`;
      }
    }
    return belowHundred(value);
  };

  const rounded = Math.round(Math.abs(n));
  if (rounded === 0) return 'Zero';
  const words = convert(rounded);
  return n < 0 ? `Minus ${words}` : words;
}

const faqs = [
  {
    question: 'Is a salary slip a legal document and proof of income?',
    answer:
      'A salary slip is an official record issued by an employer, and banks, landlords, embassies and tax authorities routinely accept it as proof of income and employment. It is not usually a statutory document in its own right like a tax return, but because it shows the employer name, the pay period, earnings and deductions on a consistent monthly record, it carries real evidential weight. For a large loan an institution may also ask for bank statements showing the same net amount arriving, or for an employment letter, so keep your slips together with those statements rather than relying on a single month.',
  },
  {
    question: 'Can I make salary slips for my own small business without payroll software?',
    answer:
      'Yes. Very small employers often run payroll in a spreadsheet or even on paper, and a generator like this one is enough provided the arithmetic is right and you issue a slip for every employee in every pay period. What matters is consistency and record-keeping: use the same format each month, keep a copy of every slip you issue, record the actual bank transfers that match the net pay figures, and register for and remit whatever tax and social contributions your country requires. If headcount or overtime and bonus calculations grow complicated, that is the point to move to dedicated payroll software.',
  },
  {
    question: 'What is the difference between CTC, gross pay and net pay?',
    answer:
      'CTC, or cost to company, is everything the employer spends on you in a year, including benefits you never receive as cash, such as the employer contribution to a provident fund, insurance premiums and sometimes bonuses. Gross pay is narrower: it is your earnings for the month before deductions — basic salary plus allowances. Net pay, also called take-home pay, is gross pay minus deductions such as income tax, your own provident fund contribution and social security. Net pay is the amount that should actually arrive in your bank account, and it is the figure to compare when a job offer quotes a salary.',
  },
  {
    question: 'Should a salary slip show leave or attendance?',
    answer:
      'It is optional, but helpful. Many employers add days worked, paid leave taken, unpaid leave and the loss-of-pay deduction, if any, because most pay disputes are really attendance disputes. Showing the day count explains at a glance why a month with unpaid leave pays less than the month before, and it gives the employee a chance to correct an attendance error while the records are fresh. If your payroll tracks leave separately, you can leave it off the slip, but the deduction for unpaid days must always be visible as its own line so the net pay can be checked.',
  },
  {
    question: 'How long should employers keep payroll records?',
    answer:
      'Keep them for years, not months. Tax and labour rules differ by country, but a safe working rule is to retain payroll registers, slips and payment proofs for at least five to seven years after the relevant tax year, and longer where local law demands it. Employees should keep their own slips just as carefully: they support tax filings, provident fund claims, visa applications and proof of employment long after leaving a job. Digital copies are fine in most places provided they are complete, legible and backed up — store the PDFs from this tool in a named folder by year and month.',
  },
];

function PayRowEditor({
  row,
  prefix,
  onUpdate,
  onRemove,
  labelFixed,
  removable,
}: {
  row: PayRow;
  prefix: string;
  onUpdate: (id: number, field: keyof PayRow, value: string) => void;
  onRemove: (id: number) => void;
  labelFixed?: boolean;
  removable?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-12 sm:col-span-6 space-y-1">
        <Label htmlFor={`${prefix}-label-${row.id}`}>Label</Label>
        <Input
          id={`${prefix}-label-${row.id}`}
          value={row.label}
          disabled={labelFixed}
          onChange={(event) => onUpdate(row.id, 'label', event.target.value)}
          placeholder="Allowance or deduction"
        />
      </div>
      <div className="col-span-9 sm:col-span-5 space-y-1">
        <Label htmlFor={`${prefix}-amount-${row.id}`}>Amount</Label>
        <Input
          id={`${prefix}-amount-${row.id}`}
          type="number"
          min="0"
          step="any"
          value={row.amount}
          onChange={(event) => onUpdate(row.id, 'amount', event.target.value)}
        />
      </div>
      <div className="col-span-3 sm:col-span-1 pb-1">
        {removable ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(row.id)}
            aria-label={`Remove ${row.label || 'row'}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function SalarySlipGeneratorPage() {
  const [defaultMonth] = useState(() => months[new Date().getMonth()]);
  const [defaultYear] = useState(() => String(new Date().getFullYear()));

  const [companyName, setCompanyName] = useState('Brightline Technologies (Pvt) Ltd');
  const [companyAddress, setCompanyAddress] = useState(
    'Level 4, Ocean Tower, Clifton Block 5, Karachi, Pakistan'
  );
  const [employeeName, setEmployeeName] = useState('Ahmed Raza');
  const [employeeId, setEmployeeId] = useState('EMP-1042');
  const [designation, setDesignation] = useState('Senior Accounts Executive');
  const [department, setDepartment] = useState('Finance');
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [currency, setCurrency] = useState('PKR');
  const [showWords, setShowWords] = useState(true);

  const [earnings, setEarnings] = useState<PayRow[]>([
    { id: 1, label: 'Basic salary', amount: '120000' },
    { id: 2, label: 'House rent allowance', amount: '48000' },
    { id: 3, label: 'Transport allowance', amount: '10000' },
    { id: 4, label: 'Medical allowance', amount: '8000' },
  ]);
  const nextEarningId = useRef(5);
  const [deductions, setDeductions] = useState<PayRow[]>([
    { id: 1, label: 'Income tax', amount: '9500' },
    { id: 2, label: 'Provident fund', amount: '9600' },
    { id: 3, label: 'EOBI / social security', amount: '370' },
  ]);
  const nextDeductionId = useRef(4);

  const totals = useMemo(() => {
    const gross = earnings.reduce((sum, row) => sum + parseAmount(row.amount), 0);
    const totalDeductions = deductions.reduce(
      (sum, row) => sum + parseAmount(row.amount),
      0
    );
    return { gross, totalDeductions, net: gross - totalDeductions };
  }, [earnings, deductions]);

  const netInWords = `${numberToWordsInternational(totals.net)} ${currencyNames[currency] ?? currency} Only`;

  const updateEarning = (id: number, field: keyof PayRow, value: string) => {
    setEarnings((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const updateDeduction = (id: number, field: keyof PayRow, value: string) => {
    setDeductions((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addEarning = () => {
    const id = nextEarningId.current;
    nextEarningId.current += 1;
    setEarnings((current) => [
      ...current,
      { id, label: 'Other allowance', amount: '0' },
    ]);
  };

  const addDeduction = () => {
    const id = nextDeductionId.current;
    nextDeductionId.current += 1;
    setDeductions((current) => [
      ...current,
      { id, label: 'Other deduction', amount: '0' },
    ]);
  };

  const removeEarning = (id: number) => {
    setEarnings((current) => current.filter((row) => row.id !== id));
  };

  const removeDeduction = (id: number) => {
    setDeductions((current) => current.filter((row) => row.id !== id));
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

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName || 'Company name', pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(companyAddress || '', pageWidth - 40) as string[];
    addressLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: 'center' });
      y += 5;
    });
    y += 4;
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY SLIP', pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`For the month of ${month} ${year}`, pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.line(15, y, pageWidth - 15, y);
    y += 8;

    const details: Array<[string, string]> = [
      ['Employee name', employeeName || '-'],
      ['Employee ID', employeeId || '-'],
      ['Designation', designation || '-'],
      ['Department', department || '-'],
    ];
    details.forEach(([label, value], index) => {
      const columnX = index % 2 === 0 ? 15 : 110;
      if (index % 2 === 0 && index > 0) y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, columnX, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, columnX + 32, y);
    });
    y += 12;

    const earningsX = 15;
    const deductionsX = 110;
    const rightEdge = pageWidth - 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Earnings', earningsX, y);
    doc.text('Amount', deductionsX - 10, y, { align: 'right' });
    doc.text('Deductions', deductionsX, y);
    doc.text('Amount', rightEdge, y, { align: 'right' });
    y += 2;
    doc.line(15, y, pageWidth - 15, y);
    y += 6;
    doc.setFont('helvetica', 'normal');

    const rowCount = Math.max(earnings.length, deductions.length);
    for (let index = 0; index < rowCount; index += 1) {
      ensureSpace(7);
      const earning = earnings[index];
      const deduction = deductions[index];
      if (earning) {
        doc.text(earning.label || '-', earningsX, y);
        doc.text(formatMoney(parseAmount(earning.amount), currency), deductionsX - 10, y, {
          align: 'right',
        });
      }
      if (deduction) {
        doc.text(deduction.label || '-', deductionsX, y);
        doc.text(formatMoney(parseAmount(deduction.amount), currency), rightEdge, y, {
          align: 'right',
        });
      }
      y += 6;
    }

    y += 2;
    doc.line(15, y, pageWidth - 15, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Gross pay', earningsX, y);
    doc.text(formatMoney(totals.gross, currency), deductionsX - 10, y, { align: 'right' });
    doc.text('Total deductions', deductionsX, y);
    doc.text(formatMoney(totals.totalDeductions, currency), rightEdge, y, {
      align: 'right',
    });
    y += 10;

    ensureSpace(14);
    doc.setFontSize(12);
    doc.rect(15, y - 6, pageWidth - 30, 11);
    doc.text('NET PAY', earningsX + 2, y + 2);
    doc.text(formatMoney(totals.net, currency), rightEdge - 2, y + 2, { align: 'right' });
    y += 14;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (showWords) {
      const wordLines = doc.splitTextToSize(
        `Net pay in words: ${netInWords}`,
        pageWidth - 30
      ) as string[];
      ensureSpace(wordLines.length * 5 + 4);
      wordLines.forEach((line) => {
        doc.text(line, 15, y);
        y += 5;
      });
      y += 4;
    }

    ensureSpace(20);
    doc.text('This is a computer-generated slip.', 15, y);
    y += 16;
    doc.line(pageWidth - 70, y, rightEdge, y);
    y += 5;
    doc.text('Authorised signature', pageWidth - 70, y);

    doc.save('salary-slip.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[{ label: 'Salary Slip Generator', href: '/salary-slip-generator' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Wallet className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Salary Slip Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Build a clear, professional salary slip in a couple of minutes — no payroll
          software, no spreadsheet formulas and no sign-up. Enter the employer and employee
          details, list the earnings and deductions for the month, and this tool totals the
          gross pay, subtracts the deductions and shows the net pay in figures and,
          optionally, in words. Check everything in the live payslip preview, then download
          a tidy PDF you can hand to the employee, file for your own records, or use as
          proof of income for a loan, a visa or a rental application.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Employer and employee</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-name">Employee name</Label>
                <Input
                  id="employee-name"
                  value={employeeName}
                  onChange={(event) => setEmployeeName(event.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="company-address">Company address</Label>
                <Textarea
                  id="company-address"
                  value={companyAddress}
                  onChange={(event) => setCompanyAddress(event.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-id">Employee ID</Label>
                <Input
                  id="employee-id"
                  value={employeeId}
                  onChange={(event) => setEmployeeId(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={designation}
                  onChange={(event) => setDesignation(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Pay period and currency</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pay-month">Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="pay-month" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-year">Year</Label>
                <Input
                  id="pay-year"
                  type="number"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
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
            </div>
            <div className="flex items-center gap-2">
              <input
                id="show-words"
                type="checkbox"
                className="h-4 w-4"
                checked={showWords}
                onChange={(event) => setShowWords(event.target.checked)}
              />
              <Label htmlFor="show-words">Show net pay in words</Label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Earnings</h2>
              <Button type="button" variant="outline" size="sm" onClick={addEarning}>
                <Plus className="w-4 h-4" />
                Add row
              </Button>
            </div>
            <div className="space-y-3">
              {earnings.map((row, index) => (
                <PayRowEditor
                  key={row.id}
                  row={row}
                  prefix="earning"
                  onUpdate={updateEarning}
                  onRemove={removeEarning}
                  labelFixed={index === 0}
                  removable={index !== 0}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Deductions</h2>
              <Button type="button" variant="outline" size="sm" onClick={addDeduction}>
                <Plus className="w-4 h-4" />
                Add row
              </Button>
            </div>
            <div className="space-y-3">
              {deductions.map((row) => (
                <PayRowEditor
                  key={row.id}
                  row={row}
                  prefix="deduction"
                  onUpdate={updateDeduction}
                  onRemove={removeDeduction}
                  removable
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Live preview
            </h2>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="text-center space-y-1">
                <p className="text-xl font-bold">{companyName || 'Company name'}</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">
                  {companyAddress}
                </p>
                <p className="text-lg font-bold tracking-wide pt-2">SALARY SLIP</p>
                <p className="text-sm text-slate-600">
                  For the month of {month} {year}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm border-t border-b py-3">
                <p>
                  <span className="font-semibold">Employee name:</span> {employeeName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Employee ID:</span> {employeeId || '-'}
                </p>
                <p>
                  <span className="font-semibold">Designation:</span> {designation || '-'}
                </p>
                <p>
                  <span className="font-semibold">Department:</span> {department || '-'}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-3">Earnings</th>
                        <th className="py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.map((row) => (
                        <tr key={row.id} className="border-b border-slate-100">
                          <td className="py-2 pr-3">{row.label || '-'}</td>
                          <td className="py-2 text-right">
                            {formatMoney(parseAmount(row.amount), currency)}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-semibold">
                        <td className="py-2 pr-3">Gross pay</td>
                        <td className="py-2 text-right">
                          {formatMoney(totals.gross, currency)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-3">Deductions</th>
                        <th className="py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deductions.map((row) => (
                        <tr key={row.id} className="border-b border-slate-100">
                          <td className="py-2 pr-3">{row.label || '-'}</td>
                          <td className="py-2 text-right">
                            {formatMoney(parseAmount(row.amount), currency)}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-semibold">
                        <td className="py-2 pr-3">Total deductions</td>
                        <td className="py-2 text-right">
                          {formatMoney(totals.totalDeductions, currency)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2 border-2 border-slate-900 rounded-md px-4 py-3">
                <span className="font-bold text-base">NET PAY</span>
                <span className="font-bold text-xl">
                  {formatMoney(totals.net, currency)}
                </span>
              </div>
              {showWords ? (
                <p className="text-sm text-slate-700">
                  Net pay in words: {netInWords}
                </p>
              ) : null}
              <div className="flex flex-wrap justify-between items-end gap-4 pt-2 text-sm text-slate-600">
                <p>This is a computer-generated slip.</p>
                <div className="text-center">
                  <div className="border-t border-slate-400 w-44 pt-1">
                    Authorised signature
                  </div>
                </div>
              </div>
            </div>
            <Button type="button" onClick={downloadPdf} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download salary slip as PDF
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="salary-slip-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What a salary slip is, and why employees need one</h2>
        <p className="text-muted-foreground leading-relaxed">
          A salary slip — also called a payslip or pay stub — is the monthly statement an
          employer gives an employee showing exactly how that month&apos;s pay was worked
          out. It lists what was earned, what was taken off, and what was finally paid. A
          bank transfer on its own only proves that money arrived; the slip explains the
          money, line by line, and ties it to a named employer, a named employee and a
          specific pay period. That explanation is why the document matters far beyond
          payday itself.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Employees need slips as proof of income in everyday life. A bank deciding a car
          loan or a credit card limit, a landlord checking that a tenant can afford the
          rent, an embassy assessing a visa application, and a tax officer reviewing a
          return all ask for the same evidence, and three to six recent slips are the
          standard answer. Slips also protect the employee inside the job: they are the
          first place to check that a raise was applied, that overtime was counted, and
          that provident fund and tax deductions match what the law and the contract say.
          Keeping every slip, month after month, builds a continuous employment and income
          history that is very hard to reconstruct later if it was never saved.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">What a payslip must show</h2>
        <p className="text-muted-foreground leading-relaxed">
          A useful slip answers five questions without the reader having to ask anyone.
          Who paid? The employer&apos;s full name and address belong at the top. Who was
          paid? The employee&apos;s name, ID, designation and department identify the
          person unambiguously, which matters in companies where two staff share a name.
          For which period? The month and year must be printed on the slip itself, not
          left to be guessed from a file name. What was earned and what was deducted?
          Every component needs its own line and amount — a single lump sum teaches the
          reader nothing and invites disputes. And finally, what was actually paid? The
          net pay should be the most prominent number on the page, because that is the
          figure that must match the bank transfer.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Writing the net pay in words, as cheque practice taught generations of clerks, is
          a small habit with a real purpose: words are harder to alter than digits and
          force a second reading of the amount. This generator adds that line at the tick
          of a box. Employers who show year-to-date totals, leave balances or bank account
          details can add those rows as extra earnings or deduction lines with zero
          amounts, or note them on the slip — the essential structure above should always
          stay visible and unchanged from month to month so employees can compare slips at
          a glance.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Earnings and deductions, explained plainly</h2>
        <p className="text-muted-foreground leading-relaxed">
          Earnings start with the basic salary, the fixed core of the pay package that is
          usually agreed in the employment contract and that many calculations key off —
          provident fund contributions and some allowances are commonly expressed as a
          percentage of basic. Around it sit allowances, each paying for a specific cost
          of working life: house rent allowance towards accommodation, transport or
          conveyance allowance towards the commute, medical allowance towards healthcare,
          and in some packages utility, mobile or special allowances. Add basic and all
          allowances together and you get gross pay — total earnings before anything is
          taken away. Bonuses, overtime and arrears for a backdated raise also belong on
          the earnings side in the month they are paid.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Deductions are the amounts lawfully taken from gross pay before payment. Income
          tax is withheld by the employer and paid to the tax authority on the
          employee&apos;s behalf, at whatever slab the salary falls into. Provident fund
          deductions are the employee&apos;s own contribution to a retirement fund, often
          matched by an equal employer contribution that does not pass through the slip as
          cash. Social security contributions — EOBI in Pakistan, EPF and ESI components
          in India, National Insurance in the United Kingdom — fund pensions and benefits.
          Other deductions, such as loan instalments, unpaid leave or a staff welfare
          fund, should only ever appear with the employee&apos;s knowledge and a paper
          trail. Net pay is simply gross pay minus total deductions, and it is the one
          number every reader checks first.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How to read your own slip and spot mistakes</h2>
        <p className="text-muted-foreground leading-relaxed">
          Read a new slip in the same order every month and errors stand out quickly. First
          confirm the basics: your name, employee ID and the pay period are correct, and
          the basic salary matches your current contract, including any raise that was due
          to start. Then add the earnings yourself — a phone calculator is enough — and
          compare your gross with the printed gross. Do the same for deductions: tax that
          jumps sharply in a month when nothing changed, a provident fund figure that is
          not the usual percentage of basic, or a deduction you do not recognise all
          deserve a polite question to payroll while the month is still fresh.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Finally, match the net pay on the slip to the amount that actually landed in your
          bank account; they should agree to the last rupee or cent. Honest payroll
          mistakes are common — a mis-keyed allowance, attendance marked wrong, arrears
          paid a month late — and most are corrected in the next run when they are raised
          promptly and in writing. Keep your question factual, attach the slip, and keep
          the reply. If you are the employer, treat those questions as a free audit: a
          workforce that reads its slips carefully is the best early-warning system a
          small payroll can have.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Employer obligations and record-keeping</h2>
        <p className="text-muted-foreground leading-relaxed">
          Issuing a slip is not just good manners. In many countries labour law requires
          employers to give employees a written statement of wages each pay period, and
          tax law requires the employer to withhold tax correctly, deposit it on time and
          be able to prove both the calculation and the deposit years later. Social
          contributions carry the same duty: the amounts on the slip, the amounts in the
          fund filings and the amounts actually paid over must tell one consistent story.
          A small business that issues a proper slip every month, from its very first
          hire, builds that story automatically instead of reconstructing it under pressure
          during an audit or a dispute.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Keep a payroll register alongside the slips — one line per employee per month
          showing gross, each deduction and net — together with the bank proof that the
          net amounts were transferred. Retain the whole set for at least five to seven
          years, or longer if your local rules say so, and store digital copies in two
          places. This generator runs entirely in your browser and keeps nothing, so the
          filing is yours to do: download each PDF, name it with the employee ID and
          month, and save it the day it is issued. That two-minute habit is the difference
          between payroll records and payroll archaeology.
        </p>
      </section>

      <AdSlot id="salary-slip-generator-in-content" format="in-article" />

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
