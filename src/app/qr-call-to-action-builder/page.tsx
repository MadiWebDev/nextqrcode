'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MousePointerClick } from 'lucide-react';
import QRCodeLib from 'qrcode';

const FAQS = [
  {
    question: 'What makes a good QR call to action?',
    answer:
      'A concrete benefit in one short line: Scan to see the menu, Scan for 10% off. Specificity beats generic wording like Scan me every time.',
  },
  {
    question: 'How long should the line be?',
    answer:
      'One line, ideally under 42 characters. If it wraps to three lines or needs a second clause, it is too long and will not be read at a glance.',
  },
  {
    question: 'Does urgency like Today only help?',
    answer:
      'Only when it is true and specific. A genuine deadline motivates action. Vague or false urgency gets ignored and teaches readers that your signs exaggerate.',
  },
  {
    question: 'Where should the call to action sit?',
    answer:
      'Directly under the code, in large high-contrast type. If the code and the text are separated on the page, add an arrow pointing at the code.',
  },
];

export default function QrCallToActionBuilderPage() {
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
  const [cta, setCta] = useState('Scan to see the menu');
  const [arrow, setArrow] = useState('↓');
  const [urgency, setUrgency] = useState('');
  const [ctaColor, setCtaColor] = useState('#4f46e5');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(22);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const fullLine = [arrow, cta.trim(), urgency.trim()].filter(Boolean).join(' ');
  async function render() {
    try {
      setError('');
      const dataUrl = await QRCodeLib.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: 'M',
        width: 320,
        margin: 1,
      });
      const qrImg = await loadImage(dataUrl);
      const w = 420;
      const h = 420 + 90;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(qrImg, 50, 20, 320, 320);
      ctx.fillStyle = ctaColor;
      ctx.font = `bold ${size}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((fullLine || 'Scan me').slice(0, 42), w / 2, 385, w - 32);
      setPreview(canvas.toDataURL('image/png'));
    } catch {
      setError('Could not build the preview. Shorten the content and try again.');
    }
  }
  useEffect(() => {
    const id = requestAnimationFrame(() => render());
    return () => cancelAnimationFrame(id);
  }, [text, cta, arrow, urgency, ctaColor, bgColor, size]);
  function downloadPNG() {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = 'qr-call-to-action.png';
    a.click();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Call to Action Builder',
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
          { label: 'QR Call to Action Builder', href: '/qr-call-to-action-builder' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Design Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Call to Action Builder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Write and style a call-to-action line for a QR code — text, arrow, urgency — with a live
          preview card.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="cta-text">Content (URL or text)</Label>
            <Input id="cta-text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-line">Call-to-action line</Label>
            <Input
              id="cta-line"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              maxLength={42}
            />
            <p className="text-xs text-muted-foreground">{cta.length}/42 characters</p>
          </div>
          <div className="space-y-2">
            <Label>Arrow</Label>
            <div className="flex gap-2">
              {['↓', '→', '↗', '👉', ''].map((a) => (
                <Button
                  key={a || 'none'}
                  size="sm"
                  variant={arrow === a ? 'default' : 'outline'}
                  onClick={() => setArrow(a)}
                >
                  {a === '' ? 'None' : a}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-urgency">Urgency tag (optional)</Label>
            <Input
              id="cta-urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              placeholder="Today only"
              maxLength={20}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>CTA color</Label>
              <Input
                type="color"
                value={ctaColor}
                onChange={(e) => setCtaColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Card background</Label>
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Text size: {size}px</Label>
            <Slider value={[size]} min={16} max={32} step={1} onValueChange={([v]) => setSize(v)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={downloadPNG}>Download CTA card PNG</Button>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Live preview card
          </p>
          {preview ? (
            <img
              src={preview}
              alt="QR code with call to action"
              className="w-full max-w-sm mx-auto rounded border"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Preview will appear here.</p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Preview line: <strong>{fullLine || 'Scan me'}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Read it from two metres away. If you cannot read it at a glance, shorten it or enlarge
            the text.
          </p>
        </Card>
      </div>
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Write a Call to Action People Actually Follow
        </h2>
        <p className="text-base leading-relaxed">
          A QR code without a call to action is a puzzle with no instructions. People see the
          pattern, wonder what it does, and walk past. A call to action answers the one question
          standing between seeing and scanning: what do I get if I point my phone at this. The
          strongest calls to action name a concrete benefit in plain words. Scan to see the menu
          beats scan me, because it tells the reader the reward. Scan for 10 percent off beats scan
          for an offer, because it names the number. Specificity is the whole technique; everything
          else is presentation.
        </p>
        <p className="text-base leading-relaxed">
          Length is the enemy. A call to action is read at a glance, from a distance, often while
          the reader is walking. One short line works. Two lines sometimes work if the type is
          large. A sentence that wraps to three lines will not be read at all. The 42-character
          limit on this tool is deliberate: it forces you to cut filler words and keep the verb and
          the benefit. Scan the menu, book a table, and get the discount are all complete calls to
          action in three words. If your line needs the word please, an explanation, or a second
          clause, it is too long, and the extra words are costing you scans.
        </p>
        <p className="text-base leading-relaxed">
          Arrows and urgency tags are seasoning, not substance. An arrow pointing at the code helps
          when the code and the text are separated on the page, because it resolves the question of
          what to scan. When the text already sits directly under the code, the arrow adds little.
          Urgency works only when it is true and specific: today only is a real deadline, while
          limited time is vague enough to be ignored. False urgency is worse than none, because a
          reader who scans and finds no deadline learns that your signs exaggerate, and the next
          sign gets ignored too. Use urgency for genuine deadlines and skip it otherwise.
        </p>
        <p className="text-base leading-relaxed">
          Color and size decide whether the line gets read at all. The call to action must contrast
          strongly with its background, and it must be large enough to read from the distance at
          which people will stand. A line that is legible on your monitor at arm&apos;s length may
          be illegible on a poster read from two metres. The preview card on this tool is a good
          place to test: step back from the screen and read the line at a glance. If you have to
          lean in or squint, shorten the line or enlarge the type. Never let the call to action
          shrink to make room for a bigger code; both need their full size, and a layout that cannot
          fit both needs a shorter line or a larger surface.
        </p>
        <p className="text-base leading-relaxed">
          Test the finished card with strangers, not colleagues. Colleagues already know what the
          code does, so they cannot tell you whether the line explains it. Show the card to someone
          who has not seen the campaign and ask them what they would get by scanning. If they answer
          correctly in a few seconds, the line works. If they hesitate, guess, or ask a question,
          rewrite it. One round of that test catches more problems than a week of internal review,
          because it measures the only thing that matters: whether a stranger understands the offer
          fast enough to act on it.
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
