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
import { Calculator, Check, Copy, Percent } from 'lucide-react';

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

function clampPercent(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

const faqs = [
  {
    question: 'Should I use margin or markup for pricing?',
    answer:
      'Use margin when you think like a finance manager and markup when you think like a shopkeeper restocking shelves. Margin shows what share of the selling price survives as gross profit, so it connects directly to rent, salaries and other costs that are also measured against sales. Markup shows how much you added on top of cost, which is quick at the buying counter. Either works if you use it consistently, but never mix the two in one price list: a 25 percent markup is only a 20 percent margin, and confusing them quietly hands five points of profit to your customers.',
  },
  {
    question: 'Can margin exceed 100 percent, and can markup?',
    answer:
      'Margin can never exceed 100 percent, because profit is a part of the selling price and a part cannot be bigger than the whole. Even if an item costs you nothing at all, the margin tops out at exactly 100 percent. Markup has no ceiling at all: buy something for 10 and sell it for 110 and the markup is 1,000 percent, while the margin on that same deal is about 90.9 percent. If a spreadsheet ever shows you a margin above 100 percent, it is really a markup wearing the wrong label.',
  },
  {
    question: 'How do I convert margin to markup, and markup to margin?',
    answer:
      'Two short formulas cover every conversion. Markup percent equals margin divided by one minus the margin, so a 20 percent margin is 0.20 divided by 0.80, which is a 25 percent markup. Margin percent equals markup divided by one plus the markup, so a 25 percent markup is 0.25 divided by 1.25, which is a 20 percent margin. The target price calculator above does the first conversion for you: type a cost and a desired margin and it shows the selling price together with the markup that margin corresponds to.',
  },
  {
    question: 'What margin should a shop aim for?',
    answer:
      'There is no single right number because margins vary enormously by trade. Grocery and general retail often run on gross margins of 20 to 30 percent because stock turns over quickly, clothing commonly needs 45 to 55 percent to survive seasonal markdowns, restaurants target roughly 60 to 70 percent gross margin on food before wages and rent, and services with few material costs can run higher still. The honest test is local: your margin must cover rent, staff, spoilage and delivery on your actual sales volume, with something left over. Compare against your own costs and turnover speed, not against a headline number from another industry.',
  },
  {
    question: 'Is a discount calculated before or after tax?',
    answer:
      'It varies by country and sometimes by the type of tax, but the most common order is discount first and tax second: the discount reduces the taxable price, and GST or VAT is then charged on the reduced amount. That is the order most invoice rules in Pakistan, India, the United Kingdom and the European Union expect for a straightforward trade discount given at the time of sale. A cash discount for early payment can be treated differently, and promotional vouchers have their own rules in some places, so check your local tax guidance for anything beyond a simple percentage off the price.',
  },
];

export default function DiscountMarginCalculatorPage() {
  const [currency, setCurrency] = useState('USD');
  const [copied, setCopied] = useState<string | null>(null);

  const [price, setPrice] = useState('1000');
  const [discount1, setDiscount1] = useState('20');
  const [discount2, setDiscount2] = useState('10');

  const [marginCost, setMarginCost] = useState('80');
  const [marginSelling, setMarginSelling] = useState('100');

  const [targetCost, setTargetCost] = useState('80');
  const [targetMargin, setTargetMargin] = useState('20');

  const copySummary = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => undefined);
    setCopied(key);
    window.setTimeout(() => {
      setCopied((current) => (current === key ? null : current));
    }, 2000);
  };

  const discount = useMemo(() => {
    const original = parseAmount(price);
    const d1 = clampPercent(parseAmount(discount1));
    const d2 = clampPercent(parseAmount(discount2));
    const afterFirst = original * (1 - d1 / 100);
    const finalPrice = afterFirst * (1 - d2 / 100);
    const saved = original - finalPrice;
    const effective = original > 0 ? 100 * (1 - finalPrice / original) : 0;
    return { original, d1, d2, afterFirst, finalPrice, saved, effective };
  }, [price, discount1, discount2]);

  const margin = useMemo(() => {
    const cost = parseAmount(marginCost);
    const selling = parseAmount(marginSelling);
    const profit = selling - cost;
    const marginPct = selling !== 0 ? (profit / selling) * 100 : null;
    const markupPct = cost !== 0 ? (profit / cost) * 100 : null;
    return { cost, selling, profit, marginPct, markupPct };
  }, [marginCost, marginSelling]);

  const marginVerdict =
    margin.selling <= 0
      ? 'Enter a selling price above zero to see what this deal really earns.'
      : margin.profit >= 0
        ? `For every ${formatMoney(100, currency)} you sell, ${formatMoney(margin.marginPct ?? 0, currency)} is gross profit.`
        : `For every ${formatMoney(100, currency)} you sell, you lose ${formatMoney(-(margin.marginPct ?? 0), currency)} before any other costs.`;

  const target = useMemo(() => {
    const cost = parseAmount(targetCost);
    const rawMargin = parseAmount(targetMargin);
    const tooHigh = rawMargin >= 100;
    const usedMargin = Math.min(Math.max(rawMargin, 0), 99.99);
    const required = cost / (1 - usedMargin / 100);
    const profitPerUnit = required - cost;
    const equivMarkup = cost !== 0 ? (profitPerUnit / cost) * 100 : 0;
    return { cost, rawMargin, tooHigh, usedMargin, required, profitPerUnit, equivMarkup };
  }, [targetCost, targetMargin]);

  const discountSummary = [
    `Original price: ${formatMoney(discount.original, currency)}`,
    `After ${formatPercent(discount.d1)} discount: ${formatMoney(discount.afterFirst, currency)}`,
    discount.d2 > 0
      ? `After extra ${formatPercent(discount.d2)} discount: ${formatMoney(discount.finalPrice, currency)}`
      : null,
    `Final price: ${formatMoney(discount.finalPrice, currency)}`,
    `You save: ${formatMoney(discount.saved, currency)} (${formatPercent(discount.effective)} effective discount)`,
  ]
    .filter(Boolean)
    .join('\n');

  const marginSummary = [
    `Cost price: ${formatMoney(margin.cost, currency)}`,
    `Selling price: ${formatMoney(margin.selling, currency)}`,
    `Profit: ${formatMoney(margin.profit, currency)}`,
    `Gross margin: ${margin.marginPct === null ? '—' : formatPercent(margin.marginPct)}`,
    `Markup: ${margin.markupPct === null ? '—' : formatPercent(margin.markupPct)}`,
  ].join('\n');

  const targetSummary = [
    `Cost price: ${formatMoney(target.cost, currency)}`,
    `Desired margin: ${formatPercent(target.usedMargin)}`,
    `Required selling price: ${formatMoney(target.required, currency)}`,
    `Profit per unit: ${formatMoney(target.profitPerUnit, currency)}`,
    `Equivalent markup: ${formatPercent(target.equivMarkup)}`,
  ].join('\n');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[{ label: 'Discount & Margin Calculator', href: '/discount-margin-calculator' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Calculator className="w-3.5 h-3.5" />
          Free tool, no sign-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Free Discount &amp; Margin Calculator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Three pricing questions come up in every shop, stall and online store, usually in
          the middle of a negotiation: what does the customer actually pay after two
          discounts stack up, how much of a selling price is real profit, and what price
          must you charge to hit the margin you planned? This page answers all three at
          once. Every result updates as you type, the currency is shared across the three
          calculators, and each one has a copy button so you can paste the figures
          straight into a quote, a message or a spreadsheet.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-10">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency (applies to all three calculators)</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency" className="w-full sm:w-56">
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

          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="w-5 h-5" />
              1. Discount calculator — including stacked discounts
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Original price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount1">Discount (%)</Label>
                <Input
                  id="discount1"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={discount1}
                  onChange={(event) => setDiscount1(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount2">Second discount / coupon (%) — optional</Label>
                <Input
                  id="discount2"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={discount2}
                  onChange={(event) => setDiscount2(event.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 shadow-sm space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Original price</span>
                <span>{formatMoney(discount.original, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>After first discount ({formatPercent(discount.d1)} off)</span>
                <span>{formatMoney(discount.afterFirst, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>After second discount ({formatPercent(discount.d2)} off the reduced price)</span>
                <span>{formatMoney(discount.finalPrice, currency)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span>Final price</span>
                <span>{formatMoney(discount.finalPrice, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total you save</span>
                <span>
                  {formatMoney(discount.saved, currency)} ({formatPercent(discount.effective)}{' '}
                  effective discount)
                </span>
              </div>
              <p className="text-slate-600 pt-1">
                The effective discount is the honest combined figure. Two discounts of{' '}
                {formatPercent(discount.d1)} and {formatPercent(discount.d2)} are worth{' '}
                {formatPercent(discount.effective)} together, not{' '}
                {formatPercent(discount.d1 + discount.d2)}, because the second percentage is
                taken from the already reduced price.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => copySummary('discount', discountSummary)}
            >
              {copied === 'discount' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied === 'discount' ? 'Copied' : 'Copy discount result'}
            </Button>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">2. Margin and markup calculator</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="margin-cost">Cost price</Label>
                <Input
                  id="margin-cost"
                  type="number"
                  min="0"
                  step="any"
                  value={marginCost}
                  onChange={(event) => setMarginCost(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin-selling">Selling price</Label>
                <Input
                  id="margin-selling"
                  type="number"
                  min="0"
                  step="any"
                  value={marginSelling}
                  onChange={(event) => setMarginSelling(event.target.value)}
                />
              </div>
            </div>
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 shadow-sm space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Profit (selling price minus cost)</span>
                <span>{formatMoney(margin.profit, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gross margin (profit as a share of the selling price)</span>
                <span>
                  {margin.marginPct === null ? '—' : formatPercent(margin.marginPct)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Markup (profit as a share of the cost)</span>
                <span>
                  {margin.markupPct === null ? '—' : formatPercent(margin.markupPct)}
                </span>
              </div>
              <p className="font-medium border-t pt-2">{marginVerdict}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => copySummary('margin', marginSummary)}
            >
              {copied === 'margin' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied === 'margin' ? 'Copied' : 'Copy margin result'}
            </Button>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">3. Target price calculator</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-cost">Cost price</Label>
                <Input
                  id="target-cost"
                  type="number"
                  min="0"
                  step="any"
                  value={targetCost}
                  onChange={(event) => setTargetCost(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-margin">Desired gross margin (%)</Label>
                <Input
                  id="target-margin"
                  type="number"
                  min="0"
                  step="any"
                  value={targetMargin}
                  onChange={(event) => setTargetMargin(event.target.value)}
                />
              </div>
            </div>
            {target.tooHigh ? (
              <p className="text-sm text-red-600">
                Margin must be under 100% — a margin of 100% or more is impossible because
                profit cannot exceed the whole selling price. The calculation below uses
                99.99% so you can see how sharply the required price rises near the limit.
              </p>
            ) : null}
            <div className="border rounded-lg bg-white text-slate-900 p-5 sm:p-6 shadow-sm space-y-2 text-sm">
              <div className="flex justify-between text-base font-bold">
                <span>Required selling price</span>
                <span>{formatMoney(target.required, currency)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Profit per unit at that price</span>
                <span>{formatMoney(target.profitPerUnit, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Markup that a {formatPercent(target.usedMargin)} margin corresponds to</span>
                <span>{formatPercent(target.equivMarkup)}</span>
              </div>
              <p className="text-slate-600 pt-1">
                Formula: required price equals cost divided by one minus the margin as a
                decimal. For a cost of {formatMoney(target.cost, currency)} and a margin of{' '}
                {formatPercent(target.usedMargin)}, that is cost divided by{' '}
                {(1 - target.usedMargin / 100).toFixed(4)}.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => copySummary('target', targetSummary)}
            >
              {copied === 'target' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied === 'target' ? 'Copied' : 'Copy target price result'}
            </Button>
          </section>
        </div>
      </Card>

      <AdSlot id="discount-margin-calculator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Margin vs markup: the classic confusion</h2>
        <p className="text-muted-foreground leading-relaxed">
          Margin and markup describe the same profit with two different denominators, and
          mixing them up is probably the most expensive arithmetic mistake in small retail.
          Take the example already loaded in the second calculator: an item costs 80 and
          sells for 100, so the profit is 20. Margin divides that profit by the selling
          price — 20 divided by 100 — giving a gross margin of 20 percent. Markup divides
          the same profit by the cost — 20 divided by 80 — giving a markup of 25 percent.
          Same deal, same 20 of profit, two different percentages. Neither number is wrong;
          they simply answer different questions. Margin asks how much of each sale you
          keep. Markup asks how much you added to what you paid.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The table below converts common margins into the markup that produces exactly the
          same price. Read it once and the pattern sticks: markup is always the larger
          number, and the gap widens fast as margins rise. A trader who wants a 50 percent
          margin but applies a 50 percent markup instead will price at cost plus half,
          keep only a 33.3 percent margin, and wonder at the end of the season where the
          profit went. It went to the customer, five or ten points at a time, on every
          single sale.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="py-2 px-3">Gross margin you want</th>
                <th className="py-2 px-3">Markup you must apply</th>
                <th className="py-2 px-3">Price if cost is 100</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3">10%</td>
                <td className="py-2 px-3">11.1%</td>
                <td className="py-2 px-3">111.11</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">20%</td>
                <td className="py-2 px-3">25%</td>
                <td className="py-2 px-3">125.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">25%</td>
                <td className="py-2 px-3">33.3%</td>
                <td className="py-2 px-3">133.33</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">33.3%</td>
                <td className="py-2 px-3">50%</td>
                <td className="py-2 px-3">150.00</td>
              </tr>
              <tr>
                <td className="py-2 px-3">50%</td>
                <td className="py-2 px-3">100%</td>
                <td className="py-2 px-3">200.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          The conversion formulas are short enough to keep on a sticky note. Markup equals
          margin divided by one minus the margin, and margin equals markup divided by one
          plus the markup, with both written as decimals. The target price calculator above
          runs the first formula for you every time you set a price, so the two numbers
          always appear side by side and can never drift apart in a price list again.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Stacked discounts: why 20% plus 10% is 28% off, not 30%</h2>
        <p className="text-muted-foreground leading-relaxed">
          A second discount never applies to the original price. It applies to whatever is
          left after the first discount has done its work, and that single fact explains
          most arguments at the till. Start with a price of 1,000 — the example loaded in
          the first calculator. Twenty percent off leaves 800. The extra 10 percent coupon
          then takes 10 percent of 800, which is 80, not 100. The final price is 720, the
          total saving is 280, and 280 out of 1,000 is a 28 percent effective discount.
          The missing two points were never really offered: the coupon percentage shrank
          because the base it acted on had already shrunk.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Retailers use this on purpose, and honestly enough — a sale price plus an extra
          coupon genuinely is worth less than the headline numbers suggest, and knowing the
          effective rate lets you compare offers fairly. A straight 28 percent off at one
          shop is exactly equal to 20 percent plus an extra 10 percent at another, while
          a straight 30 percent beats both. The same maths protects sellers: when a buyer
          asks for 15 percent trade discount and then another 10 percent for paying cash,
          the true cost of agreeing is 23.5 percent, not 25 — still a serious concession,
          but one you can now price with your eyes open.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How retailers set prices from a margin target</h2>
        <p className="text-muted-foreground leading-relaxed">
          Professional buyers rarely price by feel. They start from the margin the business
          needs to survive — the percentage of each sale that must remain after paying for
          the goods themselves, to cover rent, wages, delivery, spoilage and tax — and
          work backwards to a shelf price. That is exactly what the third calculator does:
          divide the cost by one minus the target margin. Cost 80 with a 20 percent margin
          target gives a price of 100. Cost 80 with a 40 percent target gives 133.33, and
          notice how the required price accelerates as the target rises, because each extra
          point of margin must be carved out of a selling price that is itself growing.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Two habits separate good margin pricing from wishful pricing. First, the cost in
          the formula should be the full landed cost — purchase price plus freight,
          packaging, platform fees and expected returns — not the bare invoice figure from
          a supplier. A margin calculated on a partial cost is a fiction that only reveals
          itself at the end of the month. Second, set the target by category, not by shop.
          Fast-moving staples can thrive on thin margins because they turn over weekly,
          while slow, seasonal or fragile stock needs a fat margin on each unit to pay for
          the capital sitting on the shelf and the markdowns waiting at the end of the
          season.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">The hidden danger of discounting</h2>
        <p className="text-muted-foreground leading-relaxed">
          A price cut always sounds modest and always costs more than it sounds, because
          the entire cut comes out of profit, not out of cost. Work through one honest
          example. A product sells for 100 at a 30 percent gross margin, so it costs 70
          and earns 30 of profit per unit. Cut the price by 20 percent and the new price
          is 80 — but the cost is still 70, so profit per unit collapses from 30 to just
          10. To earn the same total profit as before the sale, you must now sell three
          times as many units: three units at 10 of profit merely replace one unit at 30.
          And that is before counting the extra packaging, delivery, staff time and
          returns that three times the volume drags along with it.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is why experienced retailers discount for a reason — clearing dead stock,
          rewarding a genuinely large order, matching a competitor on one hero product —
          and set a floor before the negotiation starts. Run the proposed discount through
          the first calculator, then feed the reduced price into the second one and look at
          the margin that survives. If the surviving margin cannot pay its share of rent
          and wages, the discount is not a promotion; it is a slow donation. Sometimes the
          stronger move is holding the price and adding value instead — free fitting, a
          longer warranty, a bundle — because value added costs you a fraction of what the
          same perceived benefit costs as a straight percentage off.
        </p>
      </section>

      <AdSlot id="discount-margin-calculator-in-content" format="in-article" />

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
