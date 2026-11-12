'use client';

import { useRef, useState } from 'react';
import { BadgePercent, CalendarDays, Download, Megaphone, Palette, Store } from 'lucide-react';
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

interface Theme {
  label: string;
  bg: string;
  primary: string;
  headline: string;
  body: string;
  muted: string;
  badgeBg: string;
  badgeText: string;
  onPrimary: string;
}

const THEMES: Record<string, Theme> = {
  retail: {
    label: 'Retail red & white',
    bg: '#ffffff',
    primary: '#dc2626',
    headline: '#dc2626',
    body: '#111827',
    muted: '#6b7280',
    badgeBg: '#facc15',
    badgeText: '#111827',
    onPrimary: '#ffffff',
  },
  premium: {
    label: 'Premium black & gold',
    bg: '#141414',
    primary: '#c9a227',
    headline: '#f5efe0',
    body: '#f5efe0',
    muted: '#a8a29e',
    badgeBg: '#c9a227',
    badgeText: '#141414',
    onPrimary: '#141414',
  },
  fresh: {
    label: 'Fresh teal',
    bg: '#f0fdfa',
    primary: '#0f766e',
    headline: '#0f766e',
    body: '#134e4a',
    muted: '#5f7370',
    badgeBg: '#0f766e',
    badgeText: '#ffffff',
    onPrimary: '#ffffff',
  },
  trust: {
    label: 'Trust navy',
    bg: '#ffffff',
    primary: '#1e3a8a',
    headline: '#1e3a8a',
    body: '#0f2557',
    muted: '#64748b',
    badgeBg: '#f59e0b',
    badgeText: '#111827',
    onPrimary: '#ffffff',
  },
};

const POSTER_W = 794;
const POSTER_H = 1123;

const FAQS = [
  {
    q: 'Can I print this poster on US Letter paper instead of A4?',
    a: 'The poster is designed at the A4 ratio (210 x 297 mm). On a US Letter printer, choose "fit to page" in the print dialog: the whole design scales down slightly and gains a small white border, which looks fine in a window. If your shop stocks A4 paper — standard almost everywhere outside North America — print at 100% with no border at all.',
  },
  {
    q: 'Why do the colours look different on paper than on my screen?',
    a: 'Screens emit light (RGB) while printers lay down ink (CMYK), so saturated reds and teals usually print a shade deeper than they appear on a monitor. The four themes here were chosen to survive that shift: they rely on strong contrast between the headline, background and badge rather than on subtle shades that can wash out in print.',
  },
  {
    q: 'How large should the headline be to read from the street?',
    a: 'A useful rule is 25 mm of letter height for every 3 metres of viewing distance. The SALE headline in this design is roughly 45–60 mm tall depending on word length, so it reads from about 6 metres — across a pavement and a shopfront. If your window faces a road rather than a footpath, keep the headline to one short word and let the discount badge do the rest.',
  },
  {
    q: 'Can I share the poster on social media instead of printing it?',
    a: 'Yes — the downloaded PNG is a high-resolution image (1588 x 2246 pixels), so it works well as a feed post on Facebook or Instagram. It is a portrait poster ratio rather than a 9:16 story ratio, so for stories you would need to place it on a coloured background in your app of choice; the file itself is print-first by design.',
  },
  {
    q: 'How do I make a window poster last outdoors?',
    a: 'Print on the heaviest matte paper your printer accepts (160–250 gsm), mount it inside the glass rather than outside where rain reaches it, and keep it out of direct afternoon sun — red pigments fade fastest in sunlight. For a poster that must live outside, take the PNG to a copy shop and ask for lamination; the file resolution is high enough for an A3 enlargement as well.',
  },
];

function headlineSize(text: string): number {
  const len = text.trim().length;
  if (len <= 5) return 190;
  if (len <= 8) return 150;
  if (len <= 12) return 118;
  if (len <= 18) return 88;
  return 68;
}

function discountLines(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 2) return [text.trim()];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

export default function SalePosterMakerPage() {
  const [headline, setHeadline] = useState('SALE');
  const [discount, setDiscount] = useState('UP TO 50% OFF');
  const [subheading, setSubheading] = useState('On all winter clothing, shoes and accessories');
  const [storeName, setStoreName] = useState('City Mart');
  const [dates, setDates] = useState('12 – 20 November');
  const [footer, setFooter] = useState('In-store only. While stocks last.');
  const [themeKey, setThemeKey] = useState('retail');
  const [shape, setShape] = useState('band');
  const svgRef = useRef<SVGSVGElement>(null);

  const theme = THEMES[themeKey];
  const lines = discountLines(discount || 'SALE');
  const badgeFont = lines.some((l) => l.length > 8) ? 44 : 56;

  async function downloadPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const scale = 2;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(POSTER_W * scale));
    clone.setAttribute('height', String(POSTER_H * scale));
    const markup = new XMLSerializer().serializeToString(clone);
    const blobUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not render the poster'));
      img.src = blobUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = POSTER_W * scale;
    canvas.height = POSTER_H * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(blobUrl);
    canvas.toBlob((png) => {
      if (!png) return;
      const url = URL.createObjectURL(png);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sale-poster-a4.png';
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
          { label: 'Sale Poster Maker', href: '/sale-poster-maker' },
        ]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-primary" />
          Sale Poster Maker
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          A good shop-window poster has one job: make a passer-by understand the offer in under three
          seconds. This maker keeps you to the six lines that matter — headline, discount, a short
          subheading, your store name, the dates and one honest footer line — and lays them out at
          true A4 size in a colour theme matched to your kind of shop. Preview it live, download a
          print-ready PNG, and tape it in the window tonight. Everything happens in your browser;
          nothing is uploaded anywhere.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Design your poster</CardTitle>
          <CardDescription>
            A4 portrait, 794 x 1123 points. The download renders at double size (1588 x 2246 px) for
            a crisp print.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sp-headline">
                  <BadgePercent className="w-4 h-4 inline mr-1" /> Headline
                </Label>
                <Input
                  id="sp-headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="SALE"
                  maxLength={24}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-discount">Discount text</Label>
                <Input
                  id="sp-discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="UP TO 50% OFF"
                  maxLength={30}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-sub">Subheading</Label>
                <Input
                  id="sp-sub"
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  placeholder="On all winter clothing, shoes and accessories"
                  maxLength={70}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-store">
                    <Store className="w-4 h-4 inline mr-1" /> Store name
                  </Label>
                  <Input
                    id="sp-store"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="City Mart"
                    maxLength={34}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp-dates">
                    <CalendarDays className="w-4 h-4 inline mr-1" /> Date range
                  </Label>
                  <Input
                    id="sp-dates"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="12 – 20 November"
                    maxLength={34}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-footer">Footer line</Label>
                <Input
                  id="sp-footer"
                  value={footer}
                  onChange={(e) => setFooter(e.target.value)}
                  placeholder="In-store only. While stocks last."
                  maxLength={70}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-theme">
                    <Palette className="w-4 h-4 inline mr-1" /> Colour theme
                  </Label>
                  <Select value={themeKey} onValueChange={setThemeKey}>
                    <SelectTrigger id="sp-theme" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(THEMES).map(([key, t]) => (
                        <SelectItem key={key} value={key}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp-shape">Discount style</Label>
                  <Select value={shape} onValueChange={setShape}>
                    <SelectTrigger id="sp-shape" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="band">Diagonal band</SelectItem>
                      <SelectItem value="badge">Circle badge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="button" onClick={downloadPng} className="gap-2">
                <Download className="w-4 h-4" /> Download poster (PNG, 1588 x 2246)
              </Button>
            </div>

            <div className="rounded-xl border border-border p-3 bg-muted/40">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${POSTER_W} ${POSTER_H}`}
                className="w-full block"
                role="img"
                aria-label="Preview of your sale poster"
              >
                <rect x={0} y={0} width={POSTER_W} height={POSTER_H} fill={theme.bg} />
                <rect x={0} y={0} width={POSTER_W} height={16} fill={theme.primary} />
                {storeName.trim() && (
                  <text
                    x={POSTER_W / 2}
                    y={96}
                    textAnchor="middle"
                    fontSize={30}
                    letterSpacing={6}
                    fill={theme.muted}
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    {storeName.trim().toUpperCase()}
                  </text>
                )}
                <text
                  x={POSTER_W / 2}
                  y={300}
                  textAnchor="middle"
                  fontSize={headlineSize(headline || 'SALE')}
                  fontWeight={800}
                  fill={theme.headline}
                  fontFamily="Arial, Helvetica, sans-serif"
                >
                  {(headline || 'SALE').toUpperCase()}
                </text>

                {shape === 'band' ? (
                  <g>
                    <polygon
                      points={`0,392 ${POSTER_W},330 ${POSTER_W},520 0,582`}
                      fill={theme.primary}
                    />
                    {lines.map((line, i) => (
                      <text
                        key={i}
                        x={POSTER_W / 2}
                        y={452 + i * 74}
                        textAnchor="middle"
                        fontSize={62}
                        fontWeight={800}
                        fill={theme.onPrimary}
                        fontFamily="Arial, Helvetica, sans-serif"
                      >
                        {line.toUpperCase()}
                      </text>
                    ))}
                  </g>
                ) : (
                  <g>
                    <circle cx={POSTER_W / 2} cy={487} r={132} fill={theme.badgeBg} />
                    <circle
                      cx={POSTER_W / 2}
                      cy={487}
                      r={118}
                      fill="none"
                      stroke={theme.badgeText}
                      strokeWidth={2}
                      strokeDasharray="6 6"
                      opacity={0.5}
                    />
                    {lines.map((line, i) => (
                      <text
                        key={i}
                        x={POSTER_W / 2}
                        y={487 + (i - (lines.length - 1) / 2) * (badgeFont + 8) + badgeFont * 0.36}
                        textAnchor="middle"
                        fontSize={badgeFont}
                        fontWeight={800}
                        fill={theme.badgeText}
                        fontFamily="Arial, Helvetica, sans-serif"
                      >
                        {line.toUpperCase()}
                      </text>
                    ))}
                  </g>
                )}

                {subheading.trim() && (
                  <text
                    x={POSTER_W / 2}
                    y={700}
                    textAnchor="middle"
                    fontSize={33}
                    fill={theme.body}
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    {subheading.trim()}
                  </text>
                )}
                {dates.trim() && (
                  <g>
                    <rect
                      x={POSTER_W / 2 - 190}
                      y={748}
                      width={380}
                      height={64}
                      rx={32}
                      fill="none"
                      stroke={theme.primary}
                      strokeWidth={3}
                    />
                    <text
                      x={POSTER_W / 2}
                      y={790}
                      textAnchor="middle"
                      fontSize={30}
                      fontWeight={700}
                      fill={theme.primary}
                      fontFamily="Arial, Helvetica, sans-serif"
                    >
                      {dates.trim()}
                    </text>
                  </g>
                )}
                {footer.trim() && (
                  <text
                    x={POSTER_W / 2}
                    y={1035}
                    textAnchor="middle"
                    fontSize={24}
                    fill={theme.muted}
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    {footer.trim()}
                  </text>
                )}
                <rect x={0} y={POSTER_H - 16} width={POSTER_W} height={16} fill={theme.primary} />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdSlot id="sale-poster-maker-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How to make a sale poster that gets read</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Choose one headline word.</strong> SALE, CLEARANCE,
            or your event name — one word, as large as possible. The moment a headline becomes a
            sentence, people walking at normal speed have already passed your window.
          </li>
          <li>
            <strong className="text-foreground">State the best honest number.</strong> &ldquo;UP TO
            50% OFF&rdquo; only works if a real share of stock is genuinely at 50%. Shoppers forgive a
            modest discount; they do not forgive a fake one, and in many countries an untrue
            &ldquo;up to&rdquo; claim breaks advertising rules.
          </li>
          <li>
            <strong className="text-foreground">Pick the theme that matches the shop, not the
            season.</strong> Red retail for supermarkets and value stores, black and gold for
            boutiques, jewellers and salons, teal for pharmacies, grocery and fresh food, navy for
            electronics, services and anything bought on trust.
          </li>
          <li>
            <strong className="text-foreground">Dates create the urgency.</strong> A poster without
            dates quietly becomes wallpaper within a week. A visible end date gives people a reason
            to come in today — and reminds your own staff when to take it down.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Posters for every kind of promotion</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Seasonal sales.</strong> Eid, Diwali, Christmas,
            back-to-school and end-of-season clearances all follow the same anatomy: event headline,
            strongest discount, the departments included in the subheading, and the exact date range.
            Swap the theme colour and the same layout carries you through the whole retail calendar.
          </p>
          <p>
            <strong className="text-foreground">Grand openings.</strong> Replace SALE with
            &ldquo;NOW OPEN&rdquo; and the discount line with your opening offer — a free item, a
            first-week percentage, or a tasting day. The store name line does double duty here,
            because for an opening the name is the news.
          </p>
          <p>
            <strong className="text-foreground">Clearance and closing-down.</strong> The diagonal
            band in retail red is the classic clearance look worldwide. Keep the subheading factual —
            &ldquo;All remaining stock must go&rdquo; — and update the discount weekly by reprinting
            rather than crossing out numbers by hand, which destroys trust.
          </p>
          <p>
            <strong className="text-foreground">Cafés, salons and services.</strong> Posters are not
            only for shops with stock. A café&apos;s &ldquo;COMBO DEAL&rdquo;, a salon&apos;s
            weekday offer or a gym&apos;s January membership push all fit the same layout — the
            discount line becomes the deal, and the footer carries the condition that matters.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Poster specifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-3 font-semibold">Property</th>
                <th className="p-3 font-semibold">Value</th>
                <th className="p-3 font-semibold">Why it matters</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-t border-border">
                <td className="p-3">Finished size</td>
                <td className="p-3">A4 — 210 x 297 mm</td>
                <td className="p-3">Prints on any home or office printer, no trimming needed</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">Download size</td>
                <td className="p-3">1588 x 2246 px PNG</td>
                <td className="p-3">About 200 dpi at A4 — sharp text, and clean when enlarged to A3</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">Headline height</td>
                <td className="p-3">45–60 mm on paper</td>
                <td className="p-3">Readable from roughly 6 metres — pavement plus shopfront</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3">Recommended paper</td>
                <td className="p-3">160–250 gsm matte</td>
                <td className="p-3">Stays flat in the window and does not glare under lights</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground">
          Print at 100% scale for a true A4 poster. If you take the file to a copy shop for A3, ask
          them to scale proportionally — the ratio is identical, so nothing gets cropped. Mount the
          poster on a dark card backing if your window gets strong backlight; the extra contrast
          keeps the headline punchy at midday.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Design tips that separate offers from noise</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">One poster, one message.</strong> Two offers on one
            sheet halve the power of both. If you run a sale and a new arrival, print two posters and
            hang them side by side.
          </li>
          <li>
            <strong className="text-foreground">Odd numbers feel honest.</strong> &ldquo;37%
            OFF&rdquo; — because it came from real prices — often outperforms a rounded
            &ldquo;40%&rdquo; that shoppers suspect was invented. Use the number your pricing
            actually produces.
          </li>
          <li>
            <strong className="text-foreground">Contrast beats colourfulness.</strong> Every theme
            here pairs one strong colour with a neutral ground. Posters that use four bright colours
            at once read as clutter from three metres away.
          </li>
          <li>
            <strong className="text-foreground">Refresh before it fades into the background.</strong>{' '}
            Regulars stop seeing a poster after about ten days even if the sale still runs. Changing
            the theme colour while keeping the same offer resets attention for the cost of one sheet
            of paper.
          </li>
        </ul>
      </section>

      <AdSlot id="sale-poster-maker-in-content" format="in-article" />

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
