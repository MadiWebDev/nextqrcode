'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Terminal } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'Which error-correction level should I use?',
    answer:
      'M (~15%) is a good default for clean use. Use H (~30%) when the code carries a logo, lives outdoors, or may get scuffed. Higher levels add modules, so keep content short.',
  },
  {
    question: 'What margin should I request from a QR API?',
    answer:
      'At least 4 modules, the QR standard minimum. Many APIs default to less, so set margin explicitly rather than trusting the default.',
  },
  {
    question: 'Should I request SVG or PNG from the API?',
    answer:
      'SVG for print and anything that may be resized; PNG for web and app screens where a fixed pixel size is fine. Never enlarge a small PNG for a large print.',
  },
  {
    question: 'Can I rely on a public QR API in production?',
    answer:
      'For prototypes and low-stakes use, yes. For checkout, tickets, or anything critical, self-host generation or cache results, and handle API failures with a fallback so your flow still works.',
  },
];

export default function QrApiPlaygroundPage() {
  const [content, setContent] = useState('https://example.com');
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(2);
  const [ec, setEc] = useState('M');
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [preview, setPreview] = useState('');
  const [copied, setCopied] = useState('');
  const PARAMS = [
    {
      name: 'content',
      desc: 'The text or URL encoded in the code. Shorter content makes a sparser, easier-to-scan code. Keep URLs short: every extra character adds modules.',
    },
    {
      name: 'size',
      desc: 'Output width and height in pixels. For print, multiply the printed width in inches by 300. Never enlarge a small raster output.',
    },
    {
      name: 'margin',
      desc: 'Quiet-zone width in modules. The QR standard requires at least 4; many APIs use a smaller default, so set it explicitly.',
    },
    {
      name: 'errorCorrection',
      desc: 'How much damage the code tolerates: L (~7%), M (~15%), Q (~25%), H (~30%). Higher levels help with logos and wear, but add modules.',
    },
    {
      name: 'format',
      desc: 'png returns a fixed-pixel raster image; svg returns scalable vector shapes. Use svg for print and png for quick web use.',
    },
    {
      name: 'colors',
      desc: 'Foreground (modules) and background colors. Keep dark modules on a light background with at least 3:1 contrast.',
    },
  ];
  const snippet = `// Generate a QR code with the public QR Server API (api.qrserver.com)\n// This is a request template: adapt the base URL to your own service\n// if you self-host QR generation.\nconst params = new URLSearchParams({\n  data: ${JSON.stringify(content)},\n  size: ${JSON.stringify(size + 'x' + size)},\n  margin: String(${margin}),\n  ecc: ${JSON.stringify(ec)},\n  format: ${JSON.stringify(format)},\n  color: ${JSON.stringify(fg.replace('#', ''))},\n  bgcolor: ${JSON.stringify(bg.replace('#', ''))},\n});\nconst res = await fetch('https://api.qrserver.com/v1/create-qr-code/?' + params);\nif (!res.ok) throw new Error('QR request failed: ' + res.status);\nconst blob = await res.blob(); // ${format === 'svg' ? 'SVG image' : 'PNG image'} of the QR code`;
  async function render() {
    try {
      if (format === 'svg') {
        const svg = await QRCodeLib.toString(content || 'https://example.com', {
          type: 'svg',
          errorCorrectionLevel: ec as 'L' | 'M' | 'Q' | 'H',
          margin,
          color: { dark: fg, light: bg },
        });
        setPreview('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))));
      } else {
        const url = await QRCodeLib.toDataURL(content || 'https://example.com', {
          errorCorrectionLevel: ec as 'L' | 'M' | 'Q' | 'H',
          width: Math.min(size, 640),
          margin,
          color: { dark: fg, light: bg },
        });
        setPreview(url);
      }
    } catch {
      setPreview('');
    }
  }
  useEffect(() => {
    const id = requestAnimationFrame(() => render());
    return () => cancelAnimationFrame(id);
  }, [content, size, margin, ec, format, fg, bg]);
  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied('Fetch snippet copied.');
    } catch {
      setCopied('Copy failed — select the snippet and copy it manually.');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR API Playground',
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
          { label: 'QR API Playground', href: '/qr-api-playground' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Developer Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR API Playground
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Interactive API docs: build a QR-generation request from parameters, copy the fetch
          snippet, and learn what each parameter does.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ap-content">content — data to encode</Label>
            <Input id="ap-content" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>size — pixels: {size}</Label>
              <Slider
                value={[size]}
                min={128}
                max={1024}
                step={64}
                onValueChange={([v]) => setSize(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>margin — modules: {margin}</Label>
              <Slider
                value={[margin]}
                min={0}
                max={10}
                step={1}
                onValueChange={([v]) => setMargin(v)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>errorCorrection</Label>
              <div className="flex gap-1">
                {(['L', 'M', 'Q', 'H'] as const).map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={ec === v ? 'default' : 'outline'}
                    onClick={() => setEc(v)}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>format</Label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={format === 'png' ? 'default' : 'outline'}
                  onClick={() => setFormat('png')}
                >
                  PNG
                </Button>
                <Button
                  size="sm"
                  variant={format === 'svg' ? 'default' : 'outline'}
                  onClick={() => setFormat('svg')}
                >
                  SVG
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Foreground color</Label>
              <Input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Background color</Label>
              <Input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-10 p-1"
              />
            </div>
          </div>
          <Button onClick={copySnippet}>Copy fetch snippet</Button>
          {copied && <p className="text-sm text-emerald-600">{copied}</p>}
        </Card>
        <Card className="p-6 space-y-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Request snippet</p>
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap break-all">
            {snippet}
          </pre>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Live preview (generated locally with these parameters)
          </p>
          {preview ? (
            <img
              src={preview}
              alt="QR code generated with the playground parameters"
              className="w-full max-w-xs mx-auto rounded border"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Preview will appear here.</p>
          )}
          <div className="space-y-2">
            {PARAMS.map((p) => (
              <p key={p.name} className="text-xs leading-relaxed">
                <code className="font-mono font-semibold">{p.name}</code> — {p.desc}
              </p>
            ))}
          </div>
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-api-playground-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How QR Generation APIs Work, Parameter by Parameter
        </h2>
        <p className="text-base leading-relaxed">
          A QR generation API takes a handful of parameters and returns an image. That simplicity is
          deceptive, because each parameter carries a trade-off that shows up later as a code that
          scans slowly, prints blurry, or fails on a damaged label. The playground above builds a
          real request from your parameters, explains each one, and shows a live preview generated
          with the same values, so you can see the effect of every choice before you wire the API
          into your product. The snippet targets the public QR Server API as an example endpoint; if
          you self-host generation, the same parameter names map onto the same concepts in your own
          service.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-api-playground-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Content comes first, because it decides the density of the whole code. Every character you
          encode adds modules to the grid, and every module makes each square smaller at a fixed
          print size. A short URL produces a sparse, forgiving code; a long URL with tracking
          parameters produces a dense, fragile one. When the content is a URL, keep it short with a
          redirect or a short domain rather than pasting a full address with five query parameters.
          When the content is text, ask whether the scanner needs all of it, because trimming a
          sentence can drop the code an entire version level.
        </p>
        <p className="text-base leading-relaxed">
          Error correction and margin are the two parameters developers most often leave at defaults
          they have never read. Error correction decides how much of the code can be damaged or
          covered before it stops scanning, from about 7 percent at level L to about 30 percent at
          level H. Level M is a sensible default for clean digital use; level H is the right choice
          when the code will carry a logo, live outdoors, or be printed on a surface that scuffs.
          Margin is the quiet zone in modules, and the standard requires at least four. Many APIs
          default to a smaller margin or none at all, so set it explicitly, or the code will arrive
          cropped and unreliable.
        </p>
        <p className="text-base leading-relaxed">
          Size and format decide what you can do with the returned image. Size is the pixel width
          for raster output, and it must be chosen from the final print size: printed inches times
          300 DPI. Requesting a small image and enlarging it later is the most common API mistake,
          because the blur cannot be undone. Format is the other half: SVG returns vector shapes
          that scale cleanly to any size and are the right choice for print, while PNG returns fixed
          pixels that are convenient for web pages and app screens. Colors follow the same rule as
          everywhere else in QR work: dark modules, light background, strong contrast, and no
          inverted codes.
        </p>
        <p className="text-base leading-relaxed">
          Finally, treat any QR API as an external dependency with failure modes. Validate the
          response status before using the image, handle network failures with a retry or a cached
          fallback, and never build a checkout, ticket, or boarding flow that cannot function when
          the QR service is unreachable. Cache generated codes when the content is stable instead of
          calling the API on every page load, and keep the generation parameters next to the code in
          your own records so a reprint reproduces the same code exactly. A QR API is a small piece
          of infrastructure, and it deserves the same care as any other.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-api-playground-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-api-playground-bottom" format="horizontal-banner" />
    </div>
  );
}
