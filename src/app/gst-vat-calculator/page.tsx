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
import { Calculator, Check, Copy } from 'lucide-react';

const currencies = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED'];

const ratePresets = ['0', '5', '10', '12', '18', '20', '25'];

const countryPicks = [
  { name: 'United Kingdom', taxLabel: 'VAT', rate: '20' },
  { name: 'Germany', taxLabel: 'VAT', rate: '19' },
  { name: 'Pakistan', taxLabel: 'GST', rate: '18' },
  { name: 'India', taxLabel: 'GST', rate: '18' },
  { name: 'United Arab Emirates', taxLabel: 'VAT', rate: '5' },
  { name: 'Australia', taxLabel: 'GST', rate: '10' },
  { name: 'Canada', taxLabel: 'GST', rate: '5' },
];

const worldRates: Array<[string, string, string]> = [
  ['United Kingdom', 'VAT', '20%'],
  ['Germany', 'VAT', '19%'],
  ['France', 'VAT', '20%'],
  ['Pakistan', 'GST', '18%'],
  ['India', 'GST', '18% standard — with 0%, 5%, 12% and 28% slabs for specific goods and services'],
  ['United Arab Emirates', 'VAT', '5%'],
  ['Saudi Arabia', 'VAT', '15%'],
  ['Australia', 'GST', '10%'],
  ['New Zealand', 'GST', '15%'],
  ['Canada', 'GST', '5% federal — provinces may add PST, HST or QST on top'],
  ['Singapore', 'GST', '9%'],
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

const faqs = [
  {
    question: 'Why is subtracting 20% from a VAT-inclusive price wrong?',
    answer:
      'Because the 20% was calculated on the net price, not on the gross price you are starting from. Take a gross price of 120 at 20% VAT: the tax inside it is 20, not 24. Subtracting 20% of 120 gives 96, which would imply tax of 24 — but 20% of 96 is only 19.20, so the numbers contradict themselves. The correct method is to divide the gross by 1 plus the rate: 120 divided by 1.20 equals 100 net, and 120 minus 100 leaves exactly 20 of tax. Percentages are always taken of the starting figure they were applied to, and VAT was applied to the net.',
  },
  {
    question: 'Is GST the same as VAT?',
    answer:
      'In substance, yes. GST (Goods and Services Tax) and VAT (Value Added Tax) are two names for the same kind of consumption tax: it is charged at each stage of the supply chain, businesses collect it on their sales, deduct the tax they paid on their purchases, and remit only the difference. The customer at the end of the chain bears the full amount. Countries simply chose different labels — VAT in the United Kingdom and European Union, GST in India, Pakistan, Australia, Canada and Singapore. Rates, exemptions and registration thresholds differ by country, but the arithmetic in this calculator is identical for both.',
  },
  {
    question: 'What rate does this calculator use for my country?',
    answer:
      'Whichever rate you give it. The country quick-picks load well-known standard rates — 20% VAT for the United Kingdom, 19% for Germany, 18% GST for Pakistan and India, 5% VAT for the UAE, 10% GST for Australia and 5% federal GST for Canada — but you can type any rate at all, including reduced rates for food, books or children’s clothing, and rates for countries not listed. Standard rates change from time to time and some goods are taxed differently from others, so confirm the rate that applies to your specific product or service with your tax authority or accountant before filing.',
  },
  {
    question: 'Can I calculate with two taxes combined, for example GST plus PST?',
    answer:
      'As an approximation, yes: add the two rates together and enter the combined percentage. In much of Canada, for example, 5% federal GST plus 7% provincial PST is often estimated as a combined 12%. Treat that as an estimate, not an exact figure, because in some provinces the provincial tax is charged on the price including GST, which compounds slightly, while in harmonised provinces a single HST rate replaces both. For a quick quote the added-together rate is close enough; for an invoice or a tax return, calculate each tax the way your province prescribes.',
  },
  {
    question: 'What is the reverse charge, in simple terms?',
    answer:
      'Under the reverse charge, the buyer — not the seller — accounts for the VAT or GST on a purchase. It is used mainly for cross-border business-to-business services: a company in one country buys services from a supplier in another, the supplier invoices without tax, and the buyer declares the tax and reclaims it in the same return, so no cash tax usually changes hands. The aim is to stop foreign suppliers having to register for tax in every customer’s country and to prevent fraud. If an invoice says “reverse charge applies”, that is what it means.',
  },
];

export default function GstVatCalculatorPage() {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState('100');
  const [rate, setRate] = useState('20');
  const [taxLabel, setTaxLabel] = useState('VAT');
  const [countryName, setCountryName] = useState('United Kingdom');
  const [currency, setCurrency] = useState('USD');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const inputAmount = parseAmount(amount);
    const taxRate = parseAmount(rate);
    if (mode === 'add') {
      const taxAmount = (inputAmount * taxRate) / 100;
      return {
        net: inputAmount,
        taxRate,
        taxAmount,
        gross: inputAmount + taxAmount,
      };
    }
    const divisor = 1 + taxRate / 100;
    const net = divisor === 0 ? 0 : inputAmount / divisor;
    return { net, taxRate, taxAmount: inputAmount - net, gross: inputAmount };
  }, [amount, rate, mode]);

  const breakdown = `${formatMoney(results.net, currency)} + ${results.taxRate}% ${taxLabel || 'Tax'} (${formatMoney(results.taxAmount, currency)}) = ${formatMoney(results.gross, currency)}`;

  const applyCountry = (pick: (typeof countryPicks)[number]) => {
    setRate(pick.rate);
    setTaxLabel(pick.taxLabel);
    setCountryName(pick.name);
  };

  const copyResults = () => {
    const summary = [
      `GST / VAT calculation — ${taxLabel || 'Tax'} at ${results.taxRate}% (${countryName})`,
      `Net amount (without tax): ${formatMoney(results.net, currency)}`,
      `Tax amount: ${formatMoney(results.taxAmount, currency)}`,
      `Gross amount (with tax): ${formatMoney(results.gross, currency)}`,
      breakdown,
    ].join('\n');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summary).catch(() => undefined);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'GST / VAT Calculator', href: '/gst-vat-calculator' }]} />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Calculator className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free GST / VAT Calculator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Work out GST or VAT in either direction, instantly. Add tax to a net price to get
          the gross amount your customer should pay, or strip tax out of a tax-inclusive
          price to find the net figure hiding inside it — the calculation most people get
          wrong by subtracting the percentage. Pick a preset rate or a country, choose how
          to format the money, and read the net, tax and gross amounts side by side, with a
          one-line breakdown you can copy straight into a quote, an invoice note or a
          message to your accountant.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Calculation mode</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={mode === 'add' ? 'default' : 'outline'}
                onClick={() => setMode('add')}
              >
                Add tax (net → gross)
              </Button>
              <Button
                type="button"
                variant={mode === 'remove' ? 'default' : 'outline'}
                onClick={() => setMode('remove')}
              >
                Remove tax (gross → net)
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {mode === 'add' ? 'Net amount (before tax)' : 'Gross amount (including tax)'}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  step="any"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
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
            <div className="space-y-2">
              <p className="text-sm font-medium">Rate presets</p>
              <div className="flex flex-wrap gap-2">
                {ratePresets.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={rate === preset ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRate(preset)}
                  >
                    {preset}%
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Country quick-pick</p>
              <div className="flex flex-wrap gap-2">
                {countryPicks.map((pick) => (
                  <Button
                    key={pick.name}
                    type="button"
                    variant={countryName === pick.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyCountry(pick)}
                  >
                    {pick.name} — {pick.taxLabel} {pick.rate}%
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Quick-picks set the rate and the tax label for {countryName}. The currency
                only changes how amounts are formatted — the maths of GST and VAT is
                identical worldwide.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Results
            </h2>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 space-y-3 shadow-sm">
              <div
                className={`flex flex-wrap justify-between items-center gap-2 rounded-md px-4 py-3 ${
                  mode === 'add' ? 'bg-amber-50 border border-amber-200' : ''
                }`}
              >
                <span className="text-sm font-medium">
                  Net amount (price without tax)
                  {mode === 'add' ? ' — your input' : ''}
                </span>
                <span className="text-xl font-bold">
                  {formatMoney(results.net, currency)}
                </span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2 rounded-md px-4 py-3">
                <span className="text-sm font-medium">
                  Tax amount — {taxLabel || 'Tax'} ({results.taxRate}%)
                </span>
                <span className="text-xl font-bold">
                  {formatMoney(results.taxAmount, currency)}
                </span>
              </div>
              <div
                className={`flex flex-wrap justify-between items-center gap-2 rounded-md px-4 py-3 ${
                  mode === 'remove' ? 'bg-amber-50 border border-amber-200' : ''
                }`}
              >
                <span className="text-sm font-medium">
                  Gross amount (price with tax)
                  {mode === 'remove' ? ' — your input' : ''}
                </span>
                <span className="text-xl font-bold">
                  {formatMoney(results.gross, currency)}
                </span>
              </div>
              <p className="text-sm text-slate-600 border-t pt-3">{breakdown}</p>
            </div>
            <Button type="button" onClick={copyResults} className="w-full sm:w-auto">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy results'}
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="gst-vat-calculator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">GST and VAT: the same idea with different names</h2>
        <p className="text-muted-foreground leading-relaxed">
          GST and VAT are not two different taxes that happen to look similar — they are the
          same mechanism wearing different labels in different countries. Both are a tax on
          consumption, charged as a percentage of price at every stage where value is added:
          the manufacturer charges it to the wholesaler, the wholesaler to the retailer, and
          the retailer to you. The clever part is the reclaim. Each registered business
          hands over only the difference between the tax it collected on its sales (output
          tax) and the tax it paid on its own purchases (input tax), so the tax sticks only
          to the value that business added. Businesses along the chain are, in effect,
          unpaid collection agents; the entire burden lands on the final consumer, who has
          nobody to reclaim it from.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          That is why the name on the label — VAT in the United Kingdom, Germany and the
          UAE, GST in Pakistan, India, Australia, Canada and Singapore — makes no difference
          to your arithmetic. A 20% VAT, a 20% GST and a 20% sales-stage tax all turn a net
          100 into a gross 120 in exactly the same way, and all are removed by the same
          division described below. What genuinely differs between countries is everything
          around the maths: the rate, which goods get reduced rates or exemptions, the
          turnover threshold at which registration becomes compulsory, and how often returns
          are filed. This calculator deliberately handles only the universal part — the
          percentage — and leaves those local rules to you and your accountant.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Inclusive and exclusive pricing, explained</h2>
        <p className="text-muted-foreground leading-relaxed">
          Whether a price tag already contains the tax depends on where in the world you are
          standing. In the United Kingdom and across the European Union, consumer prices are
          shown tax-inclusive by law: the 120 on the shelf label is what you pay at the till,
          and the receipt quietly reveals that 100 was the price and 20 was VAT. The same
          inclusive habit holds in Australia and New Zealand for GST. In the United States,
          by contrast, shelf prices are shown exclusive of sales tax, which is added at the
          checkout at a rate that varies by state, county and even city — a habit that still
          surprises visitors whose 100 dollar purchase rings up at 108 or 109.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Business-to-business pricing flips the convention almost everywhere: trade quotes,
          wholesale lists and freelance proposals are usually quoted net, plus tax, because
          registered buyers reclaim the tax anyway and care about the net cost. Confusion —
          and occasionally a lost margin — starts when the two conventions meet: a supplier
          quotes 500 meaning plus VAT, a buyer hears 500 all-in, and the 83 or so of tax
          inside the gross figure has to come out of somebody&apos;s pocket. Whenever money
          is agreed, say the quiet part out loud: state the net amount, the rate and the
          gross amount, exactly as the breakdown line above your results does.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How to remove tax from a gross price — without the classic mistake</h2>
        <p className="text-muted-foreground leading-relaxed">
          Adding tax is easy: multiply the net price by the rate. Removing it is where
          intuition fails. The common mistake is to subtract the same percentage from the
          gross price — to take 20% off a VAT-inclusive 120 and conclude the tax was 24 and
          the net price 96. That cannot be right, and you can prove it in one step: 20% VAT
          on a net price of 96 would be 19.20, giving a gross of 115.20, not the 120 you
          started with. Percentages are always a share of the figure they were originally
          applied to, and VAT was applied to the net price — a smaller number than the
          gross — so the tax inside a gross price is always less than that percentage of
          the gross.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The correct method is a single division: divide the gross price by one plus the
          rate expressed as a decimal. At 20%, divide by 1.20: 120 ÷ 1.20 = 100 net, and
          the tax is the remainder, 120 − 100 = 20. At Pakistan&apos;s 18% GST, divide by
          1.18; at the UAE&apos;s 5% VAT, divide by 1.05. A useful sanity check follows from
          the same logic: at 20%, the tax inside any gross price is exactly one sixth of
          that price, because 20 is one sixth of 120. At 5% it is one twenty-first, and at
          10% one eleventh. Switch this calculator to “Remove tax” mode and it performs the
          division for you — but knowing why it divides, rather than subtracts, is what
          stops the mistake creeping back in a spreadsheet.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Common standard rates around the world</h2>
        <p className="text-muted-foreground leading-relaxed">
          Standard rates cluster between 5% and 20% in most economies, with the Gulf states
          at the low end and much of Europe at the high end. The table below lists the
         headline standard rate for a spread of countries; reduced rates for essentials
          such as food, medicine, books and children&apos;s clothing exist almost everywhere
          and are not shown, so treat the table as a starting point for the quick-picks
          above, not as a substitute for checking your own product category.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 px-3">Country</th>
                <th className="py-2 px-3">Tax name</th>
                <th className="py-2 px-3">Standard rate</th>
              </tr>
            </thead>
            <tbody>
              {worldRates.map(([country, name, rateText]) => (
                <tr key={country} className="border-b">
                  <td className="py-2 px-3 font-medium">{country}</td>
                  <td className="py-2 px-3 text-muted-foreground">{name}</td>
                  <td className="py-2 px-3 text-muted-foreground">{rateText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Two entries deserve a footnote. India&apos;s GST is a slab system — 0%, 5%, 12%,
          18% and 28% depending on the item — with 18% as the most common rate for services
          and many goods. Canada&apos;s 5% is only the federal layer; provinces add their
          own tax or merge it into a harmonised rate that can reach 15% in total. Rates
          also change with budgets: Singapore moved from 7% to 9% in two steps across 2023
          and 2024, and Saudi Arabia tripled its VAT from 5% to 15% in 2020. Recheck the
          rate for the year you are filing in.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Who must register and charge GST or VAT?</h2>
        <p className="text-muted-foreground leading-relaxed">
          In most systems, registration becomes compulsory once a business passes a turnover
          threshold set by its country — and those thresholds vary enormously, from quite
          low in some economies to a comparatively generous level in the United Kingdom.
          Below the threshold, a small trader generally does not charge the tax at all:
          there is no VAT or GST line on their invoices, but in exchange they cannot
          reclaim the tax embedded in their own purchases. Above it, registration, charging
          the tax, keeping records and filing periodic returns are legal duties, and selling
          to consumers does not excuse a business from them because it is the seller&apos;s
          turnover that triggers registration, not the buyer&apos;s status.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Some businesses register voluntarily below the threshold, usually because their
          customers are other registered businesses who reclaim the tax anyway, and because
          reclaiming input tax on equipment and stock outweighs the paperwork. Others must
          think about place-of-supply rules: digital services sold across borders are often
          taxed where the customer lives, which can require registering in the
          customer&apos;s country or through a one-stop scheme. This is general guidance,
          not tax advice — thresholds, deadlines and schemes change, and the cost of
          getting registration wrong is back-tax plus penalties. If your turnover is
          anywhere near your country&apos;s threshold, an hour with a local accountant is
          money well spent.
        </p>
      </section>

      <AdSlot id="gst-vat-calculator-in-content" format="in-article" />

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
