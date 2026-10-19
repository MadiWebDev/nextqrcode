'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Palette } from 'lucide-react';
import QRCodeLib from 'qrcode';

const FAQS = [
  {
    question: 'Are gradient QR codes safe to print?',
    answer:
      'Yes, when both gradient ends keep at least 3:1 contrast against the background and you test-scan a printed proof. If either end falls below that guardrail, darken it or choose a lighter background before printing.',
  },
  {
    question: 'Should the gradient be dark-to-light or dark-to-dark?',
    answer:
      'Dark-to-dark is safest. A gradient between two dark colors keeps every module clearly darker than a light background. Dark-to-light gradients are riskier because the light end can blend into the background.',
  },
  {
    question: 'Can I put a gradient behind the QR code too?',
    answer:
      'Avoid it. A gradient background makes contrast vary across the code and can hide modules. Use a solid light background behind the code and keep the gradient on the modules only.',
  },
  {
    question: 'Which file format should I export for print?',
    answer:
      'Use SVG for professional print and large signage, since it scales without softening edges. Use the PNG export for web pages, slides, and quick proofs where a fixed pixel size is fine.',
  },
];

export default function QrGradientMakerPage() {
  function downloadBlob(blob: Blob | null, filename: string): void {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = src;
    });
  }
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error('Could not read file'));
      r.readAsDataURL(file);
    });
  }
  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const v =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const n = parseInt(v, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function luminance(hex: string): number {
    const [r, g, b] = hexToRgb(hex).map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrastRatio(a: string, b: string): number {
    const l1 = luminance(a);
    const l2 = luminance(b);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  const [text, setText] = useState('https://example.com');
  const [c1, setC1] = useState('#0f172a');
  const [c2, setC2] = useState('#4f46e5');
  const [bg, setBg] = useState('#ffffff');
  const [angle, setAngle] = useState(135);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const ratio1 = useMemo(() => contrastRatio(c1, bg), [c1, bg]);
  const ratio2 = useMemo(() => contrastRatio(c2, bg), [c2, bg]);
  const safe = Math.min(ratio1, ratio2) >= 3;
  async function render() {
    try {
      setError('');
      const qr = QRCodeLib.create(text || 'https://example.com', { errorCorrectionLevel: 'M' });
      const mods = qr.modules;
      const n = mods.size;
      const size = 640;
      const cell = size / n;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      const rad = (angle * Math.PI) / 180;
      const grad = ctx.createLinearGradient(0, 0, Math.cos(rad) * size, Math.sin(rad) * size);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++) {
          if (mods.get(r, c)) ctx.fillRect(c * cell, r * cell, Math.ceil(cell), Math.ceil(cell));
        }
      setPreview(canvas.toDataURL('image/png'));
    } catch {
      setError('Could not generate this content as a QR code. Shorten the text and try again.');
    }
  }
  useEffect(() => {
    const id = requestAnimationFrame(() => render());
    return () => cancelAnimationFrame(id);
  }, [text, c1, c2, bg, angle]);
  function downloadPNG() {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = 'qr-gradient.png';
    a.click();
  }
  async function downloadSVG() {
    try {
      const qr = QRCodeLib.create(text || 'https://example.com', { errorCorrectionLevel: 'M' });
      const mods = qr.modules;
      const n = mods.size;
      const size = 640;
      const cell = size / n;
      let paths = '';
      for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++) {
          if (mods.get(r, c))
            paths += `<rect x="${c * cell}" y="${r * cell}" width="${Math.ceil(cell)}" height="${Math.ceil(cell)}"/>`;
        }
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${size}" height="${size}" fill="${bg}"/><g fill="url(#g)">${paths}</g></svg>`;
      downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qr-gradient.svg');
    } catch {
      setError('Could not build the SVG export.');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Gradient Maker',
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
          { label: 'QR Gradient Maker', href: '/qr-gradient-maker' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Palette className="w-3.5 h-3.5" />
          <span>Design Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Gradient Maker
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Design a QR code with a two-color gradient, checked against contrast guardrails, and
          export it as PNG or SVG.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="gm-text">Content (URL or text)</Label>
            <Input id="gm-text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Gradient start</Label>
              <Input
                type="color"
                value={c1}
                onChange={(e) => setC1(e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Gradient end</Label>
              <Input
                type="color"
                value={c2}
                onChange={(e) => setC2(e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Background</Label>
              <Input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-10 p-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Gradient angle: {angle}°</Label>
            <Slider
              value={[angle]}
              min={0}
              max={360}
              step={15}
              onValueChange={([v]) => setAngle(v)}
            />
          </div>
          <div className="rounded-lg border p-3 text-xs space-y-1">
            <p>
              Contrast vs background — start color: <strong>{ratio1.toFixed(2)}:1</strong>
            </p>
            <p>
              Contrast vs background — end color: <strong>{ratio2.toFixed(2)}:1</strong>
            </p>
            <p className={safe ? 'text-emerald-600' : 'text-amber-600'}>
              {safe
                ? 'Both gradient ends clear the 3:1 guardrail.'
                : 'Warning: one gradient end is below 3:1 contrast against the background. Darken that end or lighten the background before printing.'}
            </p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={downloadPNG}>Download PNG</Button>
            <Button variant="outline" onClick={downloadSVG}>
              Download SVG
            </Button>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Live preview</p>
          {preview ? (
            <img
              src={preview}
              alt="QR code with gradient"
              className="w-full max-w-sm mx-auto rounded border"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Preview will appear here.</p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Always test-scan the exported file on a real phone before printing. Gradients are
            decorative: the finder patterns must stay clearly darker than the background.
          </p>
        </Card>
      </div>
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Use a Gradient on a QR Code Without Breaking Scans
        </h2>
        <p className="text-base leading-relaxed">
          A gradient can make a QR code look like part of a brand instead of a black-and-white
          sticker, but it also removes the one thing scanners rely on most: consistent, high
          contrast between dark modules and the background. The safe way to use a gradient is to
          treat it as a constrained design choice. Both ends of the gradient must stay clearly
          darker than the background, and the darkest end should sit near the finder patterns in the
          corners, because those three large squares are what the camera locks onto first. If either
          end drifts toward the background color, part of the code can disappear into the page and
          scanning becomes slow or impossible.
        </p>
        <p className="text-base leading-relaxed">
          Start with a dark, saturated pair rather than two light pastels. A deep navy fading into a
          strong indigo or a dark teal fading into a forest green usually clears the contrast
          guardrail across the whole code. A pale blue fading into a pale pink will not, even if it
          looks attractive on screen. The tool above measures each gradient end against your
          background using the same relative-luminance math behind the WCAG contrast ratio, and it
          warns you when either end falls below 3:1. Treat that warning as a hard stop for print
          work, not a suggestion. Screens are forgiving; printed paper, sunlight, and budget phone
          cameras are not.
        </p>
        <p className="text-base leading-relaxed">
          Keep the background solid and light. A gradient background behind a gradient code is a
          common way to ruin an otherwise good design, because modules at the light end of the code
          can blend into dark patches of the background. White or near-white is the safest choice,
          and it also gives you the most freedom with the gradient itself. If your layout demands a
          colored background, test the lightest gradient end against the darkest part of that
          background, not against an average, and print a proof before committing to a full run.
        </p>
        <p className="text-base leading-relaxed">
          Angle matters more than people expect. A diagonal gradient spreads the color change across
          the whole code, so no single row becomes too light. A steep vertical gradient can leave an
          entire edge washed out if one end is marginal. When you are close to the guardrail, a
          diagonal angle plus a slightly darker end color is the simplest fix. Also keep the quiet
          zone, the blank margin around the code, in the solid background color. Extending the
          gradient into the quiet zone makes the code boundary harder for the camera to find.
        </p>
        <p className="text-base leading-relaxed">
          Before any print run, export the PNG, print one copy at the exact final size, and scan it
          with at least two different phones, including an older or cheaper one if you can. Scan in
          the lighting where the code will actually live: dim restaurant light, outdoor shade, or a
          glossy shop window. If the first scan is not fast and confident, darken the gradient,
          enlarge the code, or drop the gradient entirely. A plain black code that scans instantly
          always beats a beautiful gradient that scans sometimes. Keep the error-correction level in
          mind as well: this tool uses level M, which tolerates small damage, but it cannot rescue a
          code whose contrast has failed.
        </p>
      </article>
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
    </div>
  );
}
