'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Plus, Printer, QrCode, Store, Tag, Trash2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface TagRow {
  name: string;
  price: string;
  unit: string;
  sku: string;
}

const CURRENCIES: Record<string, string> = {
  PKR: 'Rs ',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AED: 'AED ',
};

const TAG_SIZES: Record<string, { w: number; h: number; label: string; nameChars: number }> = {
  '90x50': { w: 90, h: 50, label: '90 x 50 mm — standard shelf edge tag', nameChars: 26 },
  '70x40': { w: 70, h: 40, label: '70 x 40 mm — compact shelf tag', nameChars: 20 },
  '50x30': { w: 50, h: 30, label: '50 x 30 mm — jewellery & small goods tag', nameChars: 15 },
};

const SHEET_W = 210;
const SHEET_H = 297;
const MARGIN = 10;
const GAP = 4;

const FAQS = [
  {
    q: 'What paper should I print price tags on?',
    a: 'For shelf edge strips and hand-held tags, 200–250 gsm matte card gives the best balance of stiffness and clean cutting. Glossy photo paper looks sharper but reflects light under store lighting and can be hard to read at an angle. If tags sit inside plastic shelf holders, plain 160 gsm card is enough because the holder provides the rigidity.',
  },
  {
    q: 'Which tag size should I choose for my shelves?',
    a: 'The 90 x 50 mm tag is the most common shelf edge size in supermarkets and pharmacies because the price stays readable from a normal standing distance. Choose 70 x 40 mm for cosmetics, electronics accessories and other small shelves. The 50 x 30 mm tag suits jewellery, watches, spectacles and gift items where the tag is read up close and space on the product is limited.',
  },
  {
    q: 'How many tags fit on one A4 sheet?',
    a: 'With 10 mm margins and 4 mm cutting gaps, one A4 sheet fits 8 tags at 90 x 50 mm, 15 tags at 70 x 40 mm, or 35 tags at 50 x 30 mm. The preview shows exactly how many of your rows fit on the first sheet; extra rows simply continue the same layout when you print a second sheet from a longer list.',
  },
  {
    q: 'What does the QR code on a price tag do?',
    a: 'If you paste a product page, catalogue or payment link into the shared product URL field, every tag on the sheet gets the same QR code beside the price. Customers can scan it on the shelf to see full specifications, stock information, a video, or a larger product photo — useful when the physical tag can only carry the name and price.',
  },
  {
    q: 'Is the Price Tag Maker really free, and where is my data stored?',
    a: 'Yes, it is free with no sign-up and no watermark. Everything runs in your browser: your product names, prices and SKUs never leave your device, and the PNG sheet is generated locally. Closing the tab removes the list, so download your sheet before you navigate away.',
  },
];

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default function PriceTagMakerPage() {
  const [storeName, setStoreName] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [tagSize, setTagSize] = useState('90x50');
  const [productUrl, setProductUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [rows, setRows] = useState<TagRow[]>([
    { name: 'Basmati Rice 5 kg Bag', price: '1,450', unit: 'per bag', sku: 'SKU-1001' },
    { name: 'Organic Honey 500 g Jar', price: '980', unit: 'per jar', sku: 'SKU-1002' },
    { name: 'Cold Pressed Olive Oil 250 ml', price: '1,275', unit: 'per bottle', sku: 'SKU-1003' },
  ]);
  const svgRef = useRef<SVGSVGElement>(null);

  const size = TAG_SIZES[tagSize];
  const cols = Math.floor((SHEET_W - MARGIN * 2 + GAP) / (size.w + GAP));
  const rowsFit = Math.floor((SHEET_H - MARGIN * 2 + GAP) / (size.h + GAP));
  const capacity = cols * rowsFit;
  const visibleRows = rows.slice(0, capacity);
  const symbol = CURRENCIES[currency];

  useEffect(() => {
    const url = productUrl.trim();
    if (!url) {
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(url, { width: 240, margin: 1 })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [productUrl]);
  const effectiveQrDataUrl = productUrl.trim() ? qrDataUrl : null;

  function updateRow(index: number, field: keyof TagRow, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, { name: '', price: '', unit: '', sku: '' }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function downloadPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const pxPerMm = 3.78 * 3;
    clone.setAttribute('width', String(Math.round(SHEET_W * pxPerMm)));
    clone.setAttribute('height', String(Math.round(SHEET_H * pxPerMm)));
    const markup = new XMLSerializer().serializeToString(clone);
    const blobUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not render the sheet'));
      img.src = blobUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(SHEET_W * pxPerMm);
    canvas.height = Math.round(SHEET_H * pxPerMm);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(blobUrl);
    canvas.toBlob((png) => {
      if (!png) return;
      const url = URL.createObjectURL(png);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'price-tags-a4-sheet.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Price Tag Maker', href: '/price-tag-maker' },
        ]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Tag className="w-8 h-8 text-primary" />
          Price Tag Maker
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Type your products once and get a full A4 sheet of clean, evenly spaced price tags you
          can print in the shop, cut with a paper trimmer and slide straight into shelf holders.
          Choose from the three tag sizes retailers actually use, show prices in rupees, dollars,
          euros, pounds or dirhams, and add one shared QR code when shoppers need more detail than
          a small tag can hold. No design software, no sign-up — the sheet is built entirely in
          your browser.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Build your tag sheet</CardTitle>
          <CardDescription>
            One A4 sheet at {tagSize.replace('x', ' x ')} mm fits {capacity} tags. The preview
            updates as you type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pt-store">
                <Store className="w-4 h-4 inline mr-1" /> Store name (optional)
              </Label>
              <Input
                id="pt-store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. City Mart"
                maxLength={30}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pt-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="pt-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PKR">PKR — Pakistani Rupee</SelectItem>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                  <SelectItem value="INR">INR — Indian Rupee</SelectItem>
                  <SelectItem value="AED">AED — UAE Dirham</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pt-size">Tag size</Label>
              <Select value={tagSize} onValueChange={setTagSize}>
                <SelectTrigger id="pt-size" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TAG_SIZES).map(([key, s]) => (
                    <SelectItem key={key} value={key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pt-url">
                <QrCode className="w-4 h-4 inline mr-1" /> Product URL for QR (optional)
              </Label>
              <Input
                id="pt-url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://yourshop.com/product"
                type="url"
              />
            </div>
          </div>

          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 lg:grid-cols-[1fr_110px_130px_120px_40px] gap-2 items-end">
                <div className="space-y-1">
                  {i === 0 && <Label htmlFor={`pt-name-${i}`}>Product name</Label>}
                  <Input
                    id={`pt-name-${i}`}
                    value={row.name}
                    onChange={(e) => updateRow(i, 'name', e.target.value)}
                    placeholder="Product name"
                    maxLength={60}
                  />
                </div>
                <div className="space-y-1">
                  {i === 0 && <Label htmlFor={`pt-price-${i}`}>Price</Label>}
                  <Input
                    id={`pt-price-${i}`}
                    value={row.price}
                    onChange={(e) => updateRow(i, 'price', e.target.value)}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-1">
                  {i === 0 && <Label htmlFor={`pt-unit-${i}`}>Unit / pack note</Label>}
                  <Input
                    id={`pt-unit-${i}`}
                    value={row.unit}
                    onChange={(e) => updateRow(i, 'unit', e.target.value)}
                    placeholder="per kg, pack of 6…"
                    maxLength={24}
                  />
                </div>
                <div className="space-y-1">
                  {i === 0 && <Label htmlFor={`pt-sku-${i}`}>SKU (optional)</Label>}
                  <Input
                    id={`pt-sku-${i}`}
                    value={row.sku}
                    onChange={(e) => updateRow(i, 'sku', e.target.value)}
                    placeholder="SKU-0000"
                    maxLength={16}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(i)}
                  disabled={rows.length === 1}
                  aria-label={`Remove row ${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addRow} className="gap-2">
              <Plus className="w-4 h-4" /> Add product
            </Button>
            {rows.length > capacity && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                You have {rows.length} products but one sheet holds {capacity} tags at this size.
                The first {capacity} are shown; print, then delete those rows to lay out the rest.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-white p-3 overflow-x-auto">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SHEET_W} ${SHEET_H}`}
              className="w-full max-w-[560px] mx-auto block"
              role="img"
              aria-label="Preview of your A4 price tag sheet"
            >
              <rect x={0} y={0} width={SHEET_W} height={SHEET_H} fill="#ffffff" />
              {visibleRows.map((row, i) => {
                const col = i % cols;
                const rowIdx = Math.floor(i / cols);
                const x = MARGIN + col * (size.w + GAP);
                const y = MARGIN + rowIdx * (size.h + GAP);
                const textW = effectiveQrDataUrl ? size.w - size.h - 2 : size.w - 6;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={y}
                      width={size.w}
                      height={size.h}
                      rx={1.5}
                      fill="#ffffff"
                      stroke="#c9c9cf"
                      strokeWidth={0.4}
                    />
                    {storeName.trim() && (
                      <text x={x + 3} y={y + 5.5} fontSize={3.1} fill="#71717a" fontFamily="Arial, Helvetica, sans-serif" letterSpacing={0.4}>
                        {truncate(storeName.trim().toUpperCase(), 34)}
                      </text>
                    )}
                    <text
                      x={x + 3}
                      y={y + (storeName.trim() ? 12.5 : 9)}
                      fontSize={size.h >= 40 ? 4.6 : 3.8}
                      fontWeight={600}
                      fill="#18181b"
                      fontFamily="Arial, Helvetica, sans-serif"
                    >
                      {truncate(row.name || 'Product name', Math.floor(textW / 2.05))}
                    </text>
                    <text
                      x={x + 3}
                      y={y + size.h - (row.sku ? 9.5 : 4.5)}
                      fontSize={size.h >= 40 ? 9 : 7}
                      fontWeight={700}
                      fill="#111827"
                      fontFamily="Arial, Helvetica, sans-serif"
                    >
                      {symbol}
                      {row.price || '0'}
                      {row.unit ? (
                        <tspan fontSize={size.h >= 40 ? 3.6 : 3} fontWeight={400} fill="#52525b">
                          {' '}
                          {truncate(row.unit, 18)}
                        </tspan>
                      ) : null}
                    </text>
                    {row.sku && (
                      <text x={x + 3} y={y + size.h - 3.5} fontSize={2.8} fill="#a1a1aa" fontFamily="Arial, Helvetica, sans-serif">
                        {truncate(row.sku, 20)}
                      </text>
                    )}
                    {effectiveQrDataUrl && (
                      <image
                        href={effectiveQrDataUrl}
                        x={x + size.w - (size.h - 12) - 3}
                        y={y + 6}
                        width={size.h - 12}
                        height={size.h - 12}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={downloadPng} className="gap-2">
              <Download className="w-4 h-4" /> Download A4 sheet (PNG, 300 dpi)
            </Button>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print at 100% scale — do not choose
              &ldquo;fit to page&rdquo;, or tag sizes will shrink.
            </p>
          </div>
        </CardContent>
      </Card>

      <AdSlot id="price-tag-maker-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How to make price tags in four steps</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Pick the tag size that matches your holders.</strong>{' '}
            Measure one existing shelf strip or tag before you start. Most supermarket and pharmacy
            shelving takes 90 x 50 mm; gift, jewellery and optical shops usually need 50 x 30 mm.
            Printing the wrong size is the number one cause of wasted sheets.
          </li>
          <li>
            <strong className="text-foreground">Type each product as one row.</strong> Keep the name
            short enough to read at arm&apos;s length — brand plus product plus pack size, such as
            &ldquo;Organic Honey 500 g Jar&rdquo;. Put the pack detail (&ldquo;per kg&rdquo;,
            &ldquo;pack of 6&rdquo;) in the unit field so shoppers can compare like with like.
          </li>
          <li>
            <strong className="text-foreground">Add a QR code only when it earns its space.</strong>{' '}
            A shared product URL works well for electronics, appliances and cosmetics where the full
            specification matters. For fast-moving groceries the bare price is clearer, so leave the
            field empty and the tag stays uncluttered.
          </li>
          <li>
            <strong className="text-foreground">Download, print at 100%, and cut on the guides.</strong>{' '}
            The PNG is rendered at 300 dpi, so edges and small SKU text stay crisp. Print one test
            sheet on plain paper first, check a tag against your holder, then run the full batch on
            card.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Where shops use tags from this maker</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Grocery and general stores</strong> reprice whole
            shelves after a supplier change. Because every tag on the sheet shares one layout, a
            price update for 30 products takes minutes instead of an afternoon of handwriting or
            fighting with a label printer&apos;s template software.
          </p>
          <p>
            <strong className="text-foreground">Bakeries and cafés</strong> use the 70 x 40 mm size
            for display-case cards — item name, price per piece, and an allergen note typed into the
            unit field. The matte layout stays legible behind glass, and a fresh sheet can be printed
            each morning for daily specials.
          </p>
          <p>
            <strong className="text-foreground">Clothing and shoe shops</strong> pin the 50 x 30 mm
            tags to folded stock and sale rails. Adding the store name keeps discount stock from
            looking anonymous, and the SKU line helps staff match a tag to the inventory list during
            a stocktake.
          </p>
          <p>
            <strong className="text-foreground">Market stalls and pop-up sellers</strong> who have no
            till system at all print a sheet the night before a market day. Prices stay consistent
            all day, customers stop asking, and the stall looks established next to handwritten
            cardboard signs.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Sizes and printing specifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-3 font-semibold">Tag size</th>
                <th className="p-3 font-semibold">Tags per A4 sheet</th>
                <th className="p-3 font-semibold">Best for</th>
                <th className="p-3 font-semibold">Readable from</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-t border-border">
                <td className="p-3">90 x 50 mm</td>
                <td className="p-3">8</td>
                <td className="p-3">Supermarket shelves, pharmacies, hardware</td>
                <td className="p-3">About 1 metre</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">70 x 40 mm</td>
                <td className="p-3">15</td>
                <td className="p-3">Bakery cases, cosmetics, electronics accessories</td>
                <td className="p-3">About 60 cm</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">50 x 30 mm</td>
                <td className="p-3">35</td>
                <td className="p-3">Jewellery, watches, gifts, spectacles</td>
                <td className="p-3">In hand</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground">
          Sheets are laid out with 10 mm page margins (safe for almost every desktop printer) and
          4 mm gaps between tags, which is enough room for a guillotine or rotary trimmer without
          nicking the printed area. The download is a 2480 x 3508 pixel PNG — true A4 at 300 dpi —
          so barcodes apps and phones read the optional QR code reliably even at the smallest tag
          size.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Price tag tips from real shop floors</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">One price format, everywhere.</strong> Decide whether
            you write 1,450 or 1450.00 and never mix the two on one shelf — mixed formats make
            shoppers suspicious that the higher-looking number hides a catch.
          </li>
          <li>
            <strong className="text-foreground">Unit pricing builds trust.</strong> &ldquo;Per
            kg&rdquo; or &ldquo;per 100 g&rdquo; notes let customers compare a 400 g pack against a
            1 kg pack fairly, and in many regions unit pricing on food is a legal requirement.
          </li>
          <li>
            <strong className="text-foreground">Date your print runs.</strong> Add a tiny batch note
            to one SKU field (for example &ldquo;SKU-1001 · Nov&rdquo;) so staff can spot a stale tag
            that survived a price change.
          </li>
          <li>
            <strong className="text-foreground">Avoid pure red prices on white.</strong> Red looks
            like a discount even when it is not, and red ink fades fastest in sunny window displays.
            This maker uses near-black prices for exactly that reason.
          </li>
          <li>
            <strong className="text-foreground">Laminate tags near freezers and entrances.</strong>{' '}
            Condensation and handling destroy plain card in days; a cheap matte laminating pouch
            extends a tag&apos;s life to months.
          </li>
        </ul>
      </section>

      <AdSlot id="price-tag-maker-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <dl className="space-y-3">
          {FAQS.map((f) => (
            <div key={f.q} className="border border-border/70 rounded-xl p-4 bg-card">
              <dt className="font-semibold text-foreground">{f.q}</dt>
              <dd className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
    </div>
  );
}
