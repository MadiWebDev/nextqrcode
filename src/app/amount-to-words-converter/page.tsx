'use client';

import { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Copy, Type } from 'lucide-react';

const SMALL = [
  '',
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

const TENS = [
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

function wordsUnder100(n: number): string {
  if (n < 20) return SMALL[n];
  const tens = Math.floor(n / 10);
  const rest = n % 10;
  return rest === 0 ? TENS[tens] : `${TENS[tens]}-${SMALL[rest]}`;
}

function wordsUnder1000(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds === 0) return wordsUnder100(rest);
  if (rest === 0) return `${SMALL[hundreds]} Hundred`;
  return `${SMALL[hundreds]} Hundred ${wordsUnder100(rest)}`;
}

function intlWords(n: number): string {
  if (n === 0) return 'Zero';
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  const parts: string[] = [];
  let remaining = n;
  let scaleIndex = 0;
  while (remaining > 0) {
    const group = remaining % 1000;
    if (group > 0) {
      const groupWords = wordsUnder1000(group);
      parts.unshift(scales[scaleIndex] ? `${groupWords} ${scales[scaleIndex]}` : groupWords);
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex += 1;
  }
  return parts.join(' ');
}

function southAsianWords(n: number): string {
  if (n === 0) return 'Zero';
  if (n < 1000) return wordsUnder1000(n);
  const crore = Math.floor(n / 10000000);
  const rest = n % 10000000;
  const lakh = Math.floor(rest / 100000);
  const thousand = Math.floor((rest % 100000) / 1000);
  const hundredPart = rest % 1000;
  const parts: string[] = [];
  if (crore > 0) parts.push(`${southAsianWords(crore)} Crore`);
  if (lakh > 0) parts.push(`${wordsUnder100(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${wordsUnder100(thousand)} Thousand`);
  if (hundredPart > 0) parts.push(wordsUnder1000(hundredPart));
  return parts.join(' ');
}

function groupInternational(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function groupIndian(digits: string): string {
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const parts: string[] = [];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) parts.unshift(rest);
  return [...parts, lastThree].join(',');
}

interface CurrencyInfo {
  label: string;
  major: [string, string];
  minor: [string, string];
}

const currencyInfo: Record<string, CurrencyInfo> = {
  USD: { label: 'USD — US Dollar', major: ['Dollar', 'Dollars'], minor: ['Cent', 'Cents'] },
  PKR: {
    label: 'PKR — Pakistani Rupee',
    major: ['Rupee', 'Rupees'],
    minor: ['Paisa', 'Paisa'],
  },
  INR: { label: 'INR — Indian Rupee', major: ['Rupee', 'Rupees'], minor: ['Paisa', 'Paise'] },
  EUR: { label: 'EUR — Euro', major: ['Euro', 'Euros'], minor: ['Cent', 'Cents'] },
  GBP: {
    label: 'GBP — British Pound',
    major: ['Pound', 'Pounds'],
    minor: ['Penny', 'Pence'],
  },
  AED: { label: 'AED — UAE Dirham', major: ['Dirham', 'Dirhams'], minor: ['Fils', 'Fils'] },
};

interface ParsedAmount {
  valid: boolean;
  tooLarge: boolean;
  negative: boolean;
  wholeDigits: string;
  whole: number;
  minor: number;
  hasDecimal: boolean;
  decimalRaw: string;
}

const EMPTY_PARSED: ParsedAmount = {
  valid: false,
  tooLarge: false,
  negative: false,
  wholeDigits: '0',
  whole: 0,
  minor: 0,
  hasDecimal: false,
  decimalRaw: '',
};

function parseAmountInput(value: string): ParsedAmount {
  const raw = value.replace(/,/g, '').trim();
  if (!raw) return EMPTY_PARSED;
  const match = /^(-?)(\d*)(?:\.(\d*))?$/.exec(raw);
  if (!match) return EMPTY_PARSED;
  const wholeRaw = match[2];
  const decimalRaw = match[3] ?? '';
  if (wholeRaw === '' && decimalRaw === '') return EMPTY_PARSED;
  const wholeDigits = (wholeRaw || '0').replace(/^0+(?=\d)/, '');
  if (wholeDigits.length > 15 || Number(wholeDigits) > 999999999999999) {
    return { ...EMPTY_PARSED, valid: true, tooLarge: true };
  }
  const minorText = (decimalRaw + '00').slice(0, 2);
  const minor = decimalRaw === '' ? 0 : parseInt(minorText, 10) || 0;
  return {
    valid: true,
    tooLarge: false,
    negative: match[1] === '-',
    wholeDigits,
    whole: Number(wholeDigits),
    minor,
    hasDecimal: match[3] !== undefined,
    decimalRaw,
  };
}

const faqs = [
  {
    question: 'Which amount counts if the words and figures on a cheque differ?',
    answer:
      'On cheques, the amount written in words is generally treated as the authoritative one when the words and the figures disagree. The reasoning is practical: words take longer to write, are checked more carefully, and are much harder to alter without leaving visible traces. Rules differ between countries and banks, and a badly mismatched cheque may simply be returned unpaid, so treat this as a safety net rather than a licence to be careless. Write both, then read both once more before signing.',
  },
  {
    question: 'How do I write 1,50,000 in words?',
    answer:
      'In the South Asian lakh and crore system used across Pakistan and India, 1,50,000 is One Lakh Fifty Thousand. In the international system the same value, grouped as 150,000, is One Hundred Fifty Thousand. Both describe exactly 150 thousand; only the grouping and the vocabulary differ. Use the system your reader expects: lakh and crore for local cheques, invoices and property papers in Pakistan and India, and million-style wording for international documents.',
  },
  {
    question: 'What is the largest amount this converter supports?',
    answer:
      'The converter supports whole amounts up to 999,999,999,999,999 — just under one thousand trillion in the international system — plus two decimal digits for paise, cents or fils. In the South Asian system that ceiling produces a long string built from repeated crore groups, because the lakh and crore vocabulary was designed for everyday amounts rather than astronomical ones. For any realistic cheque, invoice, salary slip or property deal, the limit is far beyond what you will ever need.',
  },
  {
    question: 'Do I include paise or cents when I write an amount in words?',
    answer:
      'Yes, whenever the amount has a fractional part. Write the whole units first, then the word and, then the minor units in words, then Only: for example, One Thousand Rupees and Fifty Paise Only for 1,000.50. If the fraction is a single digit after the point, read it as two digits — 1,000.5 is 1,000.50, fifty paise, not five. When there is no fraction at all, leave the minor part out entirely and end the line with Only straight after the major currency name.',
  },
  {
    question: 'What are the hyphenation rules for numbers from 21 to 99?',
    answer:
      'Every compound number from twenty-one to ninety-nine takes a hyphen between the tens word and the ones word: Twenty-One, Thirty-Five, Forty-Two, Ninety-Nine. Round tens stand alone with no hyphen — Twenty, Sixty, Ninety — and the rule restarts inside every group of a large number, so 12,345 in the international system is Twelve Thousand Three Hundred Forty-Five. Numbers like One Hundred and One Thousand never take hyphens. This converter applies the rule automatically, which is one reason generated wording looks tidier than most handwriting.',
  },
];

export default function AmountToWordsConverterPage() {
  const [amount, setAmount] = useState('123456.50');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [system, setSystem] = useState<'international' | 'southAsian'>('international');
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseAmountInput(amount), [amount]);

  const wordsFor = (n: number): string =>
    system === 'international' ? intlWords(n) : southAsianWords(n);

  const baseWords = parsed.valid && !parsed.tooLarge ? wordsFor(parsed.whole) : '';
  const wholeWords =
    baseWords && parsed.negative ? `Minus ${baseWords}` : baseWords;

  const groupedDigits = parsed.valid
    ? system === 'international'
      ? groupInternational(parsed.wholeDigits)
      : groupIndian(parsed.wholeDigits)
    : '';
  const groupedDisplay =
    groupedDigits && parsed.hasDecimal
      ? `${parsed.negative ? '-' : ''}${groupedDigits}.${parsed.decimalRaw}`
      : groupedDigits
        ? `${parsed.negative ? '-' : ''}${groupedDigits}`
        : '';

  const info = currencyCode !== 'NONE' ? currencyInfo[currencyCode] : undefined;
  const chequeLine = (() => {
    if (!info || !wholeWords) return '';
    const majorName = parsed.whole === 1 ? info.major[0] : info.major[1];
    if (parsed.minor > 0) {
      const minorName = parsed.minor === 1 ? info.minor[0] : info.minor[1];
      return `${wholeWords} ${majorName} and ${wordsFor(parsed.minor)} ${minorName} Only`;
    }
    return `${wholeWords} ${majorName} Only`;
  })();

  const sentenceCase = wholeWords
    ? wholeWords.charAt(0).toUpperCase() + wholeWords.slice(1).toLowerCase()
    : '';

  const copyText = info ? chequeLine : wholeWords;

  const copyResult = () => {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const examples: Array<[string, string]> = [
    ['1,000', '1000'],
    ['55,000', '55000'],
    ['123,456', '123456'],
    ['10,000,000', '10000000'],
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[{ label: 'Amount to Words Converter', href: '/amount-to-words-converter' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Type className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Amount to Words Converter (Number to Words)
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Writing a cheque, an invoice or a receipt and stuck on how to spell the amount?
          Type the figure once and this converter writes it out in full, correctly
          hyphenated and ready to copy: One Lakh Fifty Thousand in the South Asian system,
          or One Hundred Fifty Thousand in the international system, with the currency
          name and the small change included. Switch systems with one tap, check how the
          digits group in each style, and paste the finished cheque line straight onto
          your document — no counting zeros on your fingers, no spelling doubts.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Convert an amount</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (figures)</Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="e.g. 123456.50"
                />
                {groupedDisplay ? (
                  <p className="text-sm text-muted-foreground">
                    Grouped in the selected system:{' '}
                    <span className="font-medium text-foreground">{groupedDisplay}</span>
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currencyCode} onValueChange={setCurrencyCode}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None — just the number</SelectItem>
                    {Object.entries(currencyInfo).map(([code, entry]) => (
                      <SelectItem key={code} value={code}>
                        {entry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Numbering system</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={system === 'international' ? 'default' : 'outline'}
                  onClick={() => setSystem('international')}
                >
                  International (Million/Billion)
                </Button>
                <Button
                  type="button"
                  variant={system === 'southAsian' ? 'default' : 'outline'}
                  onClick={() => setSystem('southAsian')}
                >
                  South Asian (Lakh/Crore)
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Try an example</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map(([label, value]) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Your amount in words</h2>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
              {!parsed.valid ? (
                <p className="text-slate-600">
                  Type an amount above to see it written out in words. Letters and symbols
                  other than digits, one decimal point and an optional leading minus sign
                  are not accepted.
                </p>
              ) : parsed.tooLarge ? (
                <p className="text-slate-600">
                  That amount is above the supported maximum of 999,999,999,999,999. Try a
                  smaller amount — every real cheque and invoice fits comfortably below it.
                </p>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      In words
                    </p>
                    <p className="text-lg font-semibold leading-relaxed">{wholeWords}</p>
                    {parsed.minor > 0 ? (
                      <p className="text-sm text-slate-600">
                        Plus {parsed.minor} hundredths ({wordsFor(parsed.minor)} in words)
                        — included in full in the cheque line below when a currency is
                        selected.
                      </p>
                    ) : null}
                  </div>
                  {info ? (
                    <div className="space-y-1 border-t pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Cheque line — copy this exactly
                      </p>
                      <p className="leading-relaxed font-medium">{chequeLine}</p>
                    </div>
                  ) : (
                    <div className="space-y-1 border-t pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sentence case
                      </p>
                      <p className="leading-relaxed">{sentenceCase}</p>
                    </div>
                  )}
                  {groupedDisplay ? (
                    <p className="text-sm text-slate-600 border-t pt-3">
                      Figures with{' '}
                      {system === 'international' ? 'international' : 'South Asian'}{' '}
                      grouping: <span className="font-medium">{groupedDisplay}</span>
                    </p>
                  ) : null}
                </>
              )}
            </div>
            <Button type="button" onClick={copyResult} disabled={!copyText}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied
                ? 'Copied'
                : info
                  ? 'Copy cheque line'
                  : 'Copy words'}
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="amount-to-words-converter-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Where amount in words is used — and why it matters</h2>
        <p className="text-muted-foreground leading-relaxed">
          Amounts in words appear wherever money changes hands on paper: on cheques and
          demand drafts, on invoices and receipts, in sale agreements and rental
          contracts, on salary slips, prize bonds and court documents. In each case the
          words sit next to the digits and do a job the digits cannot do alone. A figure
          is frighteningly easy to alter: a 1 becomes a 7, a 3 becomes an 8, and a spare
          zero slips onto the end, and 15,000 quietly becomes 150,000. Words resist that
          kind of editing. Changing Fifteen Thousand into One Hundred Fifty Thousand means
          rewriting a whole line in matching ink and handwriting, which is exactly the
          sort of tampering that gets spotted.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          That resistance is why document practice treats the two versions differently
          when they disagree. On cheques, the amount in words is generally treated as the
          authoritative one, on the logic that words are written slowly and read twice,
          while figures are scribbled in a hurry. The same caution runs through contract
          drafting, where sums that decide payments, deposits and penalties are spelled
          out in full so that no later argument can hinge on a smudged digit. Writing the
          words correctly is therefore not decoration. It is the part of the document most
          likely to be believed, and a converter removes the two usual sources of error:
          miscounted zeros and uncertain spelling.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How to write a cheque amount correctly</h2>
        <p className="text-muted-foreground leading-relaxed">
          Start right after the printed words label on the cheque and write in one
          unbroken line, leaving no gap at the beginning where an extra word could be
          inserted. Keep your normal handwriting size from the first word to the last —
          shrinking or stretching partway through is a classic sign of later alteration.
          When the amount ends, write the word Only immediately after the currency name,
          as this converter does: Rupees Five Thousand Only. Only is a full stop for
          money; it announces that nothing more can be added, because anything after it
          plainly does not belong to the amount.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Then protect the empty space. Draw a firm line from the end of the wording
          through to the edge of the amount box so no one can extend the line, and do the
          same in the figures box by writing the amount tight against the currency symbol
          and ending it with a clear marker such as /- where that is local custom. Never
          sign a cheque with the amount left blank, never use pencil or an erasable pen,
          and never correct a mistake by overwriting — a corrected cheque invites queries
          and may be refused, so tear it up and write a fresh one. Finally, match the
          words against the figures digit by digit before signing. The most common cheque
          error in the world is not fraud; it is a tired writer spelling one number and
          figuring another.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">International vs South Asian numbering, explained</h2>
        <p className="text-muted-foreground leading-relaxed">
          The two systems count the same numbers with different landmarks. The
          international system adds a new name every three zeros: thousand at three,
          million at six, billion at nine, trillion at twelve, and its commas follow the
          same rhythm — groups of three, as in 1,234,567. The South Asian system used in
          Pakistan, India, Bangladesh, Nepal and Sri Lanka keeps thousand at three zeros
          but then switches to two-digit groups: a lakh is 100,000 with five zeros, and a
          crore is 10,000,000 with seven zeros, equal to one hundred lakh. Its commas
          follow that rhythm too — the last three digits together, then pairs — so the
          same value is written 12,34,567 and read as Twelve Lakh Thirty-Four Thousand
          Five Hundred Sixty-Seven.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="py-2 px-3">Unit</th>
                <th className="py-2 px-3">In figures</th>
                <th className="py-2 px-3">Zeros</th>
                <th className="py-2 px-3">Same value in the other system</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3">One Thousand</td>
                <td className="py-2 px-3">1,000</td>
                <td className="py-2 px-3">3</td>
                <td className="py-2 px-3">One Thousand (same in both)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">One Lakh</td>
                <td className="py-2 px-3">100,000</td>
                <td className="py-2 px-3">5</td>
                <td className="py-2 px-3">One Hundred Thousand</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">One Million</td>
                <td className="py-2 px-3">1,000,000</td>
                <td className="py-2 px-3">6</td>
                <td className="py-2 px-3">Ten Lakh</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">One Crore</td>
                <td className="py-2 px-3">10,000,000</td>
                <td className="py-2 px-3">7</td>
                <td className="py-2 px-3">Ten Million</td>
              </tr>
              <tr>
                <td className="py-2 px-3">One Billion</td>
                <td className="py-2 px-3">1,000,000,000</td>
                <td className="py-2 px-3">9</td>
                <td className="py-2 px-3">One Hundred Crore</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Neither system is more correct; they are local conventions, like driving on
          different sides of the road. Problems start when a document mixes them — a
          Pakistani property price quoted as two crore read by a foreign buyer as two
          million, a factor-of-ten misunderstanding with real money attached. When a
          document will cross borders, write the figures with unambiguous grouping, spell
          the words in the system the receiving bank uses, and where there is any doubt,
          add the figure in plain digits with no commas at all in brackets. The toggle
          above exists for exactly this situation: enter the amount once, read it both
          ways, and choose deliberately.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Common mistakes when writing amounts in words</h2>
        <p className="text-muted-foreground leading-relaxed">
          The most frequent mistake is importing the wrong vocabulary for the system in
          use. One Hundred Thousand is perfectly good international English, but on a
          cheque written in the lakh system the same value belongs as One Lakh — and a
          writer who starts with One Hundred and then continues in lakh style can produce
          hybrids that confuse everyone. Pick one system for the whole line and stay in
          it. Close behind is the mismatched pair: words saying Fifty Thousand while the
          figures say 5,000, usually because a zero was dropped while copying. Read the
          finished cheque backwards, figures first and words second, and the mismatch
          jumps out.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Smaller slips matter too. Forgetting the hyphen in Forty-Two or Eighty-Seven
          looks untidy and, in strict document checking, can raise questions about whether
          a word was added later. Dropping the minor units is another regular error: an
          invoice for 2,499.99 written as Two Thousand Four Hundred Ninety-Nine Only
          underpays by 99 paise or cents and creates a petty but real accounting
          difference. And the oldest trap of all is leaving space — before the first word,
          between words, or after Only — because every gap on a financial document is an
          invitation. Write tightly, finish with Only, rule a line through the rest, and
          let the generated wording above be your spelling check before the pen comes out.
        </p>
      </section>

      <AdSlot id="amount-to-words-converter-in-content" format="in-article" />

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
