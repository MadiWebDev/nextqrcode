'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Download, Plus, Receipt, Trash2 } from 'lucide-react';
import JsPDF from 'jspdf';
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

interface LineItem {
  id: number;
  name: string;
  qty: string;
  price: string;
}

const CURRENCIES: Record<string, { symbol: string; label: string }> = {
  PKR: { symbol: 'Rs', label: 'PKR — Pakistani Rupee' },
  USD: { symbol: '$', label: 'USD — US Dollar' },
  EUR: { symbol: '€', label: 'EUR — Euro' },
  GBP: { symbol: '£', label: 'GBP — British Pound' },
  INR: { symbol: '₹', label: 'INR — Indian Rupee' },
  AED: { symbol: 'AED', label: 'AED — UAE Dirham' },
};

const faqs = [
  {
    question: 'What is the difference between a receipt, an invoice and a quote?',
    answer:
      "A quote is a price offered before any work happens, an invoice is a request for payment, and a receipt is proof that payment has already been made. A customer asks for a quote to decide, receives an invoice when money is owed, and keeps a receipt afterwards as evidence of a completed sale. This generator makes receipts only, so every document it produces confirms a finished, paid transaction.",
  },
  {
    question: 'Why is the receipt laid out at 80mm wide?',
    answer:
      '80mm is the standard paper width for thermal receipt printers used in shops, cafes and salons around the world. The printable area is about 72mm once margins are removed, which fits roughly 42 to 48 characters per line in a standard monospace font. Laying the receipt out at that width means the PDF on screen matches what a thermal printer produces at the till, with no cut-off prices.',
  },
  {
    question: 'How is change calculated for cash payments?',
    answer:
      'Enter the amount the customer hands over in the Amount Tendered field and the tool subtracts the receipt total automatically. If the customer pays 1,000 against a total of 840, the receipt shows 160 as change due. If the amount tendered is less than the total, a warning appears, the download is disabled, and no receipt can be produced showing negative change.',
  },
  {
    question: 'Can I reprint a receipt if a customer loses the original?',
    answer:
      'Yes. Keep the receipt number, date and item details in your sales record, enter the same details again, and download a fresh copy. Marking the reprint clearly, for example by telling the customer it is a copy, protects you against the same sale being claimed twice. Because receipt numbers stay unique in your records, a reprint never creates a second, conflicting transaction.',
  },
  {
    question: 'How long should a business keep copies of its receipts?',
    answer:
      'Most small businesses keep receipt records for at least five years, and many tax authorities expect five to seven years of sales records. A numbered sequence of receipts makes gaps easy to spot during bookkeeping, and a daily total that matches your cash drawer and card reports is the simplest check that every sale was recorded exactly once.',
  },
];

export default function ReceiptGeneratorPage() {
  const [shopName, setShopName] = useState('Fresh Mart Grocery');
  const [address, setAddress] = useState('Shop 4, Main Bazaar Road\nLahore, Pakistan');
  const [phone, setPhone] = useState('0300 1234567');
  const [receiptNo, setReceiptNo] = useState('R-1042');
  const [date, setDate] = useState('2026-11-11');
  const [time, setTime] = useState('14:30');
  const [cashier, setCashier] = useState('Ali');
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, name: 'Basmati Rice 5kg', qty: '1', price: '1450' },
    { id: 2, name: 'Fresh Milk 1L', qty: '2', price: '280' },
    { id: 3, name: 'Brown Eggs (12)', qty: '1', price: '420' },
  ]);
  const [nextId, setNextId] = useState(4);
  const [taxRate, setTaxRate] = useState('0');
  const [currency, setCurrency] = useState('PKR');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [tendered, setTendered] = useState('3000');
  const [footerMessage, setFooterMessage] = useState(
    'Thank you for shopping with us. Please visit again.'
  );

  const symbol = CURRENCIES[currency]?.symbol ?? currency;
  const isCash = paymentMethod === 'Cash';

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + qty * price;
    }, 0);
    const taxPercent = parseFloat(taxRate) || 0;
    const tax = (subtotal * taxPercent) / 100;
    const total = subtotal + tax;
    const tenderedNum = parseFloat(tendered) || 0;
    const change = isCash ? tenderedNum - total : 0;
    return { subtotal, tax, taxPercent, total, tenderedNum, change };
  }, [items, taxRate, tendered, isCash]);

  const insufficientCash =
    isCash && tendered.trim() !== '' && totals.tenderedNum < totals.total;

  const money = (value: number) => `${symbol} ${value.toFixed(2)}`;
  const moneyPdf = (value: number) => `${currency} ${value.toFixed(2)}`;

  const addItem = () => {
    setItems((prev) => [...prev, { id: nextId, name: '', qty: '1', price: '0' }]);
    setNextId((n) => n + 1);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof LineItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const downloadPdf = () => {
    if (insufficientCash) return;
    const addressLines = address.split('\n').filter((line) => line.trim() !== '');
    const lineCount =
      20 +
      addressLines.length +
      items.length * 2 +
      (cashier.trim() ? 1 : 0) +
      (totals.taxPercent > 0 ? 1 : 0) +
      (isCash ? 2 : 0);
    const height = Math.max(95, lineCount * 5.2 + 24);
    const doc = new JsPDF({ unit: 'mm', format: [80, height] });
    let y = 8;

    const center = (text: string, size: number, bold: boolean) => {
      doc.setFont('courier', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.text(text.slice(0, 44), 40, y, { align: 'center' });
      y += size * 0.52 + 1.6;
    };
    const separator = () => {
      doc.setLineDashPattern([1, 1], 0);
      doc.line(4, y, 76, y);
      doc.setLineDashPattern([], 0);
      y += 4;
    };
    const row = (left: string, right: string, bold: boolean) => {
      doc.setFont('courier', bold ? 'bold' : 'normal');
      doc.setFontSize(9);
      doc.text(left.slice(0, 30), 4, y);
      doc.text(right, 76, y, { align: 'right' });
      y += 4.6;
    };
    const leftLine = (text: string) => {
      doc.setFont('courier', 'normal');
      doc.setFontSize(9);
      doc.text(text.slice(0, 44), 4, y);
      y += 4.6;
    };

    center(shopName || 'Receipt', 13, true);
    addressLines.forEach((line) => center(line, 9, false));
    if (phone.trim()) center(`Tel: ${phone}`, 9, false);
    separator();
    leftLine(`Receipt No: ${receiptNo}`);
    leftLine(`Date: ${date}  Time: ${time}`);
    if (cashier.trim()) leftLine(`Cashier: ${cashier}`);
    separator();
    items.forEach((item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      leftLine(item.name || 'Item');
      row(`  ${qty} x ${moneyPdf(price)}`, moneyPdf(qty * price), false);
    });
    separator();
    row('Subtotal', moneyPdf(totals.subtotal), false);
    if (totals.taxPercent > 0) {
      row(`Tax (${totals.taxPercent}%)`, moneyPdf(totals.tax), false);
    }
    row('TOTAL', moneyPdf(totals.total), true);
    row('Payment', paymentMethod, false);
    if (isCash) {
      row('Tendered', moneyPdf(totals.tenderedNum), false);
      row('Change Due', moneyPdf(Math.max(0, totals.change)), true);
    }
    separator();
    footerMessage
      .split('\n')
      .filter((line) => line.trim() !== '')
      .forEach((line) => center(line, 9, false));

    doc.save(`receipt-${receiptNo || 'download'}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'Receipt Generator', href: '/receipt-generator' }]} />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Receipt className="w-8 h-8 shrink-0" />
          Receipt Generator
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          A receipt is the proof of payment a customer takes away after a sale, and it is
          often the only record either side keeps of what was bought, what was paid and how
          much change changed hands. This free generator builds a clean, correctly totalled
          receipt in the standard 80mm thermal format used by tills everywhere, with line
          items, an optional tax line, the payment method and the exact change due for cash
          sales. Fill in the sale, watch the narrow thermal preview update as you type, and
          download a print-ready PDF in seconds — no account, no software to install and no
          data ever leaves your browser.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="shop-name">Shop or business name</Label>
              <Input
                id="shop-name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Fresh Mart Grocery"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-address">Address</Label>
              <Textarea
                id="shop-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Shop 4, Main Bazaar Road"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="shop-phone">Phone</Label>
                <Input
                  id="shop-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt-no">Receipt number</Label>
                <Input
                  id="receipt-no"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  placeholder="R-1042"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt-date">Date</Label>
                <Input
                  id="receipt-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt-time">Time</Label>
                <Input
                  id="receipt-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cashier">Cashier name (optional)</Label>
                <Input
                  id="cashier"
                  value={cashier}
                  onChange={(e) => setCashier(e.target.value)}
                  placeholder="Ali"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Line items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add item
                </Button>
              </div>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_64px_96px_36px] gap-2">
                  <Input
                    aria-label="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                  <Input
                    aria-label="Quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                  />
                  <Input
                    aria-label="Unit price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Quantity is multiplied by the unit price for every line, exactly as a till
                calculates it. Remove a line with the trash icon and add as many lines as
                the basket needs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax % (optional)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isCash && (
              <div className="space-y-2">
                <Label htmlFor="tendered">Amount tendered (cash given by customer)</Label>
                <Input
                  id="tendered"
                  type="number"
                  min="0"
                  step="0.01"
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value)}
                  placeholder="3000"
                />
                {insufficientCash ? (
                  <p className="flex items-start gap-2 text-sm font-medium text-red-600">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    Amount tendered is less than the total of {money(totals.total)}. Ask
                    for the full amount before issuing this receipt — a receipt must never
                    show negative change.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Change due: <span className="font-semibold">{money(Math.max(0, totals.change))}</span>
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="footer-message">Footer message</Label>
              <Input
                id="footer-message"
                value={footerMessage}
                onChange={(e) => setFooterMessage(e.target.value)}
                placeholder="Thank you for shopping with us."
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">Live preview — 80mm thermal receipt</p>
            <div className="mx-auto w-full max-w-[320px] bg-white text-black border border-neutral-300 shadow-sm px-4 py-5 font-mono text-[12px] leading-relaxed">
              <div className="text-center space-y-0.5">
                <p className="font-bold text-[15px]">{shopName || 'Your Shop'}</p>
                {address
                  .split('\n')
                  .filter((line) => line.trim() !== '')
                  .map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                {phone.trim() && <p>Tel: {phone}</p>}
              </div>
              <div className="border-t border-dashed border-neutral-400 my-3" />
              <p>Receipt No: {receiptNo}</p>
              <p>
                Date: {date} Time: {time}
              </p>
              {cashier.trim() && <p>Cashier: {cashier}</p>}
              <div className="border-t border-dashed border-neutral-400 my-3" />
              <div className="space-y-1.5">
                {items.map((item) => {
                  const qty = parseFloat(item.qty) || 0;
                  const price = parseFloat(item.price) || 0;
                  return (
                    <div key={item.id}>
                      <p>{item.name || 'Item'}</p>
                      <p className="flex justify-between gap-2">
                        <span>
                          &nbsp;&nbsp;{qty} x {money(price)}
                        </span>
                        <span>{money(qty * price)}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-dashed border-neutral-400 my-3" />
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(totals.subtotal)}</span>
              </p>
              {totals.taxPercent > 0 && (
                <p className="flex justify-between">
                  <span>Tax ({totals.taxPercent}%)</span>
                  <span>{money(totals.tax)}</span>
                </p>
              )}
              <p className="flex justify-between font-bold text-[13px]">
                <span>TOTAL</span>
                <span>{money(totals.total)}</span>
              </p>
              <p className="flex justify-between">
                <span>Payment</span>
                <span>{paymentMethod}</span>
              </p>
              {isCash && (
                <>
                  <p className="flex justify-between">
                    <span>Tendered</span>
                    <span>{money(totals.tenderedNum)}</span>
                  </p>
                  <p className="flex justify-between font-bold">
                    <span>Change Due</span>
                    <span>{money(Math.max(0, totals.change))}</span>
                  </p>
                </>
              )}
              <div className="border-t border-dashed border-neutral-400 my-3" />
              <p className="text-center">{footerMessage}</p>
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={downloadPdf}
              disabled={insufficientCash}
            >
              <Download className="w-4 h-4 mr-2" />
              Download receipt PDF (80mm)
            </Button>
            {insufficientCash && (
              <p className="text-xs text-red-600 text-center">
                Download is disabled until the amount tendered covers the total.
              </p>
            )}
          </div>
        </div>
      </Card>

      <AdSlot id="receipt-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="leading-relaxed text-muted-foreground">
          Start with the header. The shop name, address and phone number at the top of the
          receipt tell the customer exactly who they paid, which matters hours later when
          they check a price, return a faulty item or simply try to remember where they
          bought something. Add a receipt number next — a simple running sequence such as
          R-1041, R-1042 and R-1043 turns loose slips of paper into a real sales record,
          because a missing number in the sequence is immediately visible at closing time.
          The date and time stamp each sale, and the optional cashier name shows which team
          member ran the till, which settles most till disputes before they start.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Next, add one line per product or service: a name, a quantity and a unit price.
          The generator multiplies quantity by unit price for every line, adds the lines
          into a subtotal, applies your optional tax percentage on top of that subtotal and
          produces the final total — the same order of operations a point-of-sale system
          uses. Finally, record how the customer paid. For card and online payments the
          total is the whole story. For cash, enter the amount tendered — the notes the
          customer actually handed over — and the change due is worked out for you and
          printed on the receipt, so the customer can check their change before leaving
          the counter and the cashier has a written figure to count back.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          When everything looks right in the preview, download the PDF. The file is built
          on a true 80mm-wide page in a monospace courier typeface, with its height
          calculated from the number of lines on your receipt, so a three-item cafe sale
          produces a short receipt and a forty-item grocery basket produces a long one —
          just like a real thermal printer, which simply keeps feeding paper until the
          sale ends. Print it on a thermal printer, a normal home printer, or save and
          share it digitally through any messaging app.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Who uses a receipt generator</h2>
        <p className="leading-relaxed text-muted-foreground">
          Retail shops are the most obvious users: a clothing store, mobile phone shop or
          pharmacy whose till is broken, not yet installed or simply too slow at peak hours
          can still hand every buyer a proper numbered receipt instead of a handwritten
          note. Cafes, bakeries and tea stalls use receipts for takeaway orders, table
          bills and daily catering pickups, where speed matters and the receipt doubles as
          the order ticket. Salons and barbers issue them for services that customers claim
          back from employers or compare against a price list on their next visit. Market
          stalls, food trucks and pop-up sellers — traders with no fixed till at all — use
          a generator on a phone to give weekend customers the same proof of payment a
          permanent shop provides.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The tool also fits work that happens away from any counter: a plumber, tutor,
          photographer or repair technician finishing a job at a customer home can produce
          a receipt on the spot confirming the amount received, rather than promising to
          send paperwork later. Small online sellers use it to include a printed receipt in
          every parcel, which reduces payment disputes and makes returns far easier to
          verify. In each case the value is the same: a clear, dated, numbered document
          that both sides can trust.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Features and specifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Paper format</td>
                <td className="py-2 text-muted-foreground">
                  80mm wide thermal receipt; about 72mm of printable width after margins
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Characters per line</td>
                <td className="py-2 text-muted-foreground">
                  Roughly 42 to 48 in the monospace layout, matching common thermal printers
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Line items</td>
                <td className="py-2 text-muted-foreground">
                  Unlimited items, each with name, quantity and unit price
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Currencies</td>
                <td className="py-2 text-muted-foreground">PKR, USD, EUR, GBP, INR and AED</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Payment methods</td>
                <td className="py-2 text-muted-foreground">
                  Cash with tendered amount and change due, Card, or Online
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Tax</td>
                <td className="py-2 text-muted-foreground">
                  Optional percentage applied to the subtotal and shown as its own line
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Output</td>
                <td className="py-2 text-muted-foreground">
                  PDF on an 80mm page whose height grows with the number of items
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Every figure on the receipt is calculated live, so the preview is never out of
          date: change the quantity of one item and the subtotal, tax, total and change all
          move together. The preview copies the conventions of a printed thermal receipt —
          centred shop header, dashed separators between sections, item quantities indented
          under the product name and every amount aligned to the right edge — because that
          familiar layout is what customers instinctively scan first for the total.
        </p>
      </section>

      <AdSlot id="receipt-generator-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Receipt, invoice or quote — which document do you need?</h2>
        <p className="leading-relaxed text-muted-foreground">
          These three documents are often confused, and using the wrong one creates real
          problems. A quote is written before work starts: it states a proposed price and
          is not proof of anything except an offer. An invoice is a demand for payment: it
          lists what is owed, by whom and by when, and it belongs to sales made on credit
          or paid later. A receipt comes last in the chain and proves the opposite of an
          invoice — that the money has already been received. Sending an invoice after a
          customer has paid invites them to pay twice; handing over only a quote leaves
          them with no proof of purchase at all. If the sale is finished and the money is
          in your hand or your account, the receipt is the correct document, and that is
          exactly what this generator produces.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Record-keeping is the other half of the story. A business that issues a numbered
          receipt for every sale can reconcile the day in minutes: add the receipt totals,
          compare them with the cash in the drawer and the card settlement report, and any
          difference has a specific receipt number to investigate. Receipts also protect
          customers, who need them for returns, warranty claims and expense claims, and
          they protect you when a customer disputes a price weeks later. Keep your own copy
          of the numbers — a notebook, spreadsheet or folder of downloaded PDFs is enough —
          for at least five years, because tax and consumer questions rarely arrive quickly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Practical tips for better receipts</h2>
        <p className="leading-relaxed text-muted-foreground">
          Keep item names short and recognisable: the name on the receipt should match the
          name on the shelf and the name the customer would use, so avoid internal codes as
          the main description. Count change back out loud using the change figure printed
          on the receipt — it is the fastest way to catch a wrong note before the customer
          leaves. If a customer loses a receipt, reprint it from your records with the same
          receipt number rather than issuing a new number, and say clearly that it is a
          copy; two different numbers for one sale will corrupt your daily totals. For
          refunds, write a short note against the original receipt number instead of
          deleting anything, so the sequence stays complete. Finally, check the printed
          total against the screen total once a day: a habit that takes a minute and
          catches rounding, tax and quantity errors while they are still easy to fix.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
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
        <dl className="space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-medium">{faq.question}</dt>
              <dd className="mt-1 leading-relaxed text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
