'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Frame } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'Should the frame touch the QR code?',
    answer:
      'No. Keep a blank quiet zone of at least four modules between the code and any frame border, text, or graphic. Anything that touches the modules can break scanning.',
  },
  {
    question: 'What should the call to action say?',
    answer:
      'Say what the scanner gets: Scan for the menu, Scan to book, or Scan for 10% off. A specific benefit earns more scans than a generic Scan me.',
  },
  {
    question: 'Can I use a dark frame background?',
    answer:
      'Only if the QR code itself keeps a light background and strong contrast. A dark frame around a white-backed code works; a dark background directly behind the modules does not.',
  },
  {
    question: 'What size should the exported PNG be?',
    answer:
      'Export at the largest size offered and let the printer scale down. Enlarging a small PNG softens the sharp module edges that scanners need.',
  },
];

export default function QrFrameDesignerPage() {
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
  const [cta, setCta] = useState('Scan me to visit our site');
  const [frameColor, setFrameColor] = useState('#4f46e5');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ctaColor, setCtaColor] = useState('#111827');
  const [shape, setShape] = useState<'rounded' | 'square' | 'pill'>('rounded');
  const [qrSize, setQrSize] = useState(480);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  async function render() {
    try {
      setError('');
      const dataUrl = await QRCodeLib.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: 'M',
        width: qrSize,
        margin: 1,
      });
      const qrImg = await loadImage(dataUrl);
      const pad = 36;
      const ctaH = 64;
      const w = qrSize + pad * 2;
      const h = qrSize + pad * 2 + ctaH;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = bgColor;
      const radius = shape === 'square' ? 0 : shape === 'pill' ? 48 : 24;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, radius);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = frameColor;
      ctx.beginPath();
      ctx.roundRect(3, 3, w - 6, h - 6, radius);
      ctx.stroke();
      ctx.drawImage(qrImg, pad, pad, qrSize, qrSize);
      ctx.fillStyle = ctaColor;
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = cta.trim() || 'Scan me';
      ctx.fillText(label.slice(0, 34), w / 2, pad + qrSize + ctaH / 2, w - pad * 2);
      setPreview(canvas.toDataURL('image/png'));
    } catch {
      setError('Could not generate the framed QR code. Shorten the content and try again.');
    }
  }
  useEffect(() => {
    const id = requestAnimationFrame(() => render());
    return () => cancelAnimationFrame(id);
  }, [text, cta, frameColor, bgColor, ctaColor, shape, qrSize]);
  function downloadPNG() {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = 'qr-framed.png';
    a.click();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Frame Designer',
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
          { label: 'QR Frame Designer', href: '/qr-frame-designer' },
        ]}
      />

      <AdSlot id="qr-frame-designer-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Frame className="w-3.5 h-3.5" />
          <span>Design Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Frame Designer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Design a frame and call-to-action around a QR code — shape, text, and colors — with a live
          preview and PNG export.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fd-text">Content (URL or text)</Label>
            <Input id="fd-text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fd-cta">Call-to-action text</Label>
            <Input
              id="fd-cta"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              maxLength={34}
            />
            <p className="text-xs text-muted-foreground">{cta.length}/34 characters</p>
          </div>
          <div className="space-y-2">
            <Label>Frame shape</Label>
            <div className="flex gap-2">
              {(['rounded', 'square', 'pill'] as const).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={shape === s ? 'default' : 'outline'}
                  onClick={() => setShape(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Frame color</Label>
              <Input
                type="color"
                value={frameColor}
                onChange={(e) => setFrameColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Background</Label>
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>CTA text color</Label>
              <Input
                type="color"
                value={ctaColor}
                onChange={(e) => setCtaColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>QR size: {qrSize}px</Label>
            <Slider
              value={[qrSize]}
              min={240}
              max={720}
              step={40}
              onValueChange={([v]) => setQrSize(v)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={downloadPNG}>Download framed PNG</Button>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Live preview</p>
          {preview ? (
            <img
              src={preview}
              alt="Framed QR code preview"
              className="w-full max-w-sm mx-auto rounded"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Preview will appear here.</p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Keep the frame border clear of the quiet zone: the border sits outside the code, never
            overlapping its modules.
          </p>
        </Card>
      </div>

      <AdSlot id="qr-frame-designer-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Frame a QR Code So People Actually Scan It
        </h2>
        <p className="text-base leading-relaxed">
          A bare QR code on a poster is easy to ignore. People glance past it because nothing tells
          them why they should stop, open their camera, and scan. A frame changes that by doing two
          jobs at once: it separates the code from the surrounding design so the camera can find it,
          and it carries a short call to action that gives the scan a reason. The best frames are
          simple. A clean border, one line of text, and plenty of white space will outperform a busy
          decorative frame almost every time, because every extra element near the code is another
          chance for the camera to get confused.
        </p>
        <p className="text-base leading-relaxed">
          The call to action is the most important part of the frame. Vague wording such as scan me
          tells the reader nothing about what happens next, so it earns fewer scans than a specific
          promise. Scan for the menu, scan to book a table, and scan for 10 percent off all answer
          the same question: what do I get for the effort. Keep it to one short line, in large type,
          directly under the code where the eye lands after looking at the pattern. If the line
          wraps to two lines or shrinks to fit, shorten the words instead of shrinking the type.
        </p>

        <AdSlot id="qr-frame-designer-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Shape and color choices should serve readability, not decoration. A rounded rectangle
          reads as friendly and modern, a square reads as formal, and a pill shape works well on
          narrow packaging where space is tight. Whatever shape you choose, keep the frame border
          outside the quiet zone, the blank margin that surrounds the code. A border that touches or
          overlaps the modules can break scanning entirely. Frame colors should contrast with the
          background of the surface the code is printed on, and the call-to-action text needs strong
          contrast against the frame background so it stays legible at a distance.
        </p>
        <p className="text-base leading-relaxed">
          Size is the other half of the frame equation. A frame does not make a small code
          scannable; it only makes a correctly sized code more noticeable. Use the size rules for
          the viewing distance: roughly one unit of code width for every ten units of distance, with
          extra margin in dim light or behind glass. When you enlarge a framed design, enlarge the
          whole frame and text together. Shrinking the code to make room for a bigger headline is a
          false economy, because a headline nobody can act on is worse than a smaller headline above
          a code that works.
        </p>
        <p className="text-base leading-relaxed">
          Before you print, test the framed export the way a stranger would. Print one copy at final
          size, pin it where it will actually live, step back to the real viewing distance, and try
          to scan it with a phone you have not used for testing before. Time the scan. If it takes
          more than a couple of seconds, or if you have to move closer than the real audience will
          stand, fix the size, the contrast, or the clutter before you print the run. Also check the
          frame in the worst light the location gets, not the best, because glare and dim corners
          are where framed codes fail.
        </p>
      </article>

      <AdSlot id="qr-frame-designer-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-frame-designer-bottom" format="horizontal-banner" />

    </div>
  );
}
