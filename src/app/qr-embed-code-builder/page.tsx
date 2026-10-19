'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CodeXml } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'Should I wrap an embedded QR code in a link?',
    answer:
      "Yes, when the code has a destination URL. Desktop visitors cannot scan the screen, so a clickable link gives them the same path. Keep the link destination identical to the code's destination.",
  },
  {
    question: 'What should the alt text say?',
    answer:
      'What scanning achieves, in one sentence: QR code: scan to view the menu. Never use an empty alt or a filename for a functional QR code.',
  },
  {
    question: 'Can I set both width and height on the image?',
    answer:
      'Set only the width and let the height follow automatically. Forcing both can stretch the square modules into rectangles and make the code harder to scan.',
  },
  {
    question: 'When should I use iframe instead of img?',
    answer:
      'Almost never for a QR image. Use iframe only to embed a whole hosted page that contains a code. For the image itself, img or figure is lighter, more accessible, and less likely to be blocked.',
  },
];

export default function QrEmbedCodeBuilderPage() {
  const [imgUrl, setImgUrl] = useState('https://example.com/qr-code.png');
  const [linkUrl, setLinkUrl] = useState('https://example.com');
  const [alt, setAlt] = useState('QR code: scan to visit our site');
  const [width, setWidth] = useState(240);
  const [lazy, setLazy] = useState(true);
  const [wrapLink, setWrapLink] = useState(true);
  const [format, setFormat] = useState<'img' | 'iframe' | 'figure'>('img');
  const [copied, setCopied] = useState('');
  const imgTag = `<img src="${imgUrl}" alt="${alt.replace(/"/g, '&quot;')}" width="${width}"${lazy ? ' loading="lazy"' : ''} style="max-width:100%;height:auto;" />`;
  const snippet =
    format === 'img'
      ? wrapLink
        ? `<a href="${linkUrl}">\n  ${imgTag}\n</a>`
        : imgTag
      : format === 'iframe'
        ? `<iframe src="${imgUrl}" title="${alt.replace(/"/g, '&quot;')}" width="${width}" height="${width}" loading="lazy" style="border:0;max-width:100%;"></iframe>`
        : `<figure style="max-width:${width}px;margin:0;">\n  ${wrapLink ? `<a href="${linkUrl}">\n    ${imgTag}\n  </a>` : imgTag}\n  <figcaption>${alt.replace(/"/g, '&quot;')}</figcaption>\n</figure>`;
  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied('Copied to clipboard.');
    } catch {
      setCopied('Copy failed — select the code and copy it manually.');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Embed Code Builder',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'QR Embed Code Builder', href: '/qr-embed-code-builder' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <CodeXml className="w-3.5 h-3.5" />
          <span>Web Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Embed Code Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Build copy-paste HTML or iframe embed code for a QR image, with size, alt text, and link
          options.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ec-img">QR image URL</Label>
            <Input id="ec-img" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ec-link">
              Link URL (where the code points, for the clickable wrapper)
            </Label>
            <Input id="ec-link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ec-alt">Alt text (describes the code for screen readers)</Label>
            <Input id="ec-alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Display width: {width}px</Label>
            <Slider
              value={[width]}
              min={80}
              max={640}
              step={10}
              onValueChange={([v]) => setWidth(v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Embed format</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={format === 'img' ? 'default' : 'outline'}
                onClick={() => setFormat('img')}
              >
                Image (img)
              </Button>
              <Button
                size="sm"
                variant={format === 'figure' ? 'default' : 'outline'}
                onClick={() => setFormat('figure')}
              >
                Figure + caption
              </Button>
              <Button
                size="sm"
                variant={format === 'iframe' ? 'default' : 'outline'}
                onClick={() => setFormat('iframe')}
              >
                iframe
              </Button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wrapLink}
              onChange={(e) => setWrapLink(e.target.checked)}
            />{' '}
            Wrap in a clickable link to the destination
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={lazy} onChange={(e) => setLazy(e.target.checked)} />{' '}
            Lazy-load the image
          </label>
          <Button onClick={copySnippet}>Copy embed code</Button>
          {copied && <p className="text-sm text-emerald-600">{copied}</p>}
        </Card>
        <Card className="p-6 space-y-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Embed code</p>
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap break-all">
            {snippet}
          </pre>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Preview of the markup shape
          </p>
          <div className="rounded-lg border p-4 flex flex-col items-center gap-2">
            <div
              className="bg-slate-900 text-white grid place-items-center text-[10px] font-mono"
              style={{ width: Math.min(width, 280), height: Math.min(width, 280) }}
            >
              QR IMAGE
            </div>
            <p className="text-xs text-muted-foreground text-center">{alt}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste the code into your page HTML. Host the QR image at a stable URL you control; if
            the image URL moves, every embed breaks.
          </p>
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-embed-code-builder-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Embed a QR Code on a Web Page Properly
        </h2>
        <p className="text-base leading-relaxed">
          Embedding a QR code on a web page sounds trivial, but a careless embed fails in ways that
          are easy to miss: the image stretches and softens, screen readers announce a meaningless
          filename, the link wraps nothing, or the image is hotlinked from a URL that disappears. A
          good embed does four things. It points at a stable image URL you control, it sets a width
          that matches the layout without distorting the square, it carries alt text that tells a
          screen-reader user what the code does, and it optionally wraps the image in a link to the
          same destination, so desktop visitors who cannot scan can still click through.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-embed-code-builder-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Alt text deserves more care than it usually gets. A QR code is not decorative, so an empty
          alt attribute is wrong, and a filename such as qr-code-final-v3.png is worse. The alt text
          should say what scanning the code achieves: QR code: scan to visit our site, or QR code:
          scan to view the menu. That single sentence makes the embed usable for someone who cannot
          see the pattern, and it also gives search engines a truthful description of the image.
          Keep it to one short sentence; the surrounding page copy can carry the details.
        </p>
        <p className="text-base leading-relaxed">
          Width and aspect ratio are the two technical details that decide whether the embedded code
          stays scannable. Set only the width and let the height follow automatically, so the code
          stays perfectly square. Forcing both a width and a height, or stretching the image with
          CSS to fill a container, turns the square modules into rectangles and makes scanning
          unreliable. On responsive pages, the max-width rule in the generated code keeps the image
          from overflowing small screens while preserving the square. If the embed must sit in a
          fixed-size card, size the card to the image, not the image to the card.
        </p>
        <p className="text-base leading-relaxed">
          Choose the embed format from the job. A plain img tag is right for most pages: a blog
          post, a landing page, a footer. A figure with a caption is right when the code needs a
          visible label under it, such as Scan to view the menu, because the caption is visible to
          everyone, not just screen readers. An iframe is rarely the best choice for a QR image; it
          isolates the image from the page, adds loading overhead, and can be blocked by strict
          content-security policies. Use iframe only when you are embedding a whole hosted page that
          happens to contain a code, not the image itself.
        </p>
        <p className="text-base leading-relaxed">
          Finally, treat the image URL as a commitment. An embed that points at a temporary upload,
          a staging server, or a link shortener you do not control will break silently, leaving a
          broken-image icon where the code used to be. Host the QR image on your own domain, at a
          URL you intend to keep, and check the embed after publishing by loading the page in a
          fresh browser tab and scanning the code off the screen. If the destination ever changes,
          update the code image and the link wrapper together, because a clickable link that points
          to the old destination while the code points to the new one is a contradiction that
          confuses visitors and search engines alike.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-embed-code-builder-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom AdSlot */}
      <AdSlot id="qr-embed-code-builder-bottom" format="horizontal-banner" />
    </div>
  );
}
