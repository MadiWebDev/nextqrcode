'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Crop } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'How much can I safely crop a QR image?',
    answer:
      'Only the excess margin outside the quiet zone. For a typical generator export with a normal margin, stay under about 12% per side. The guard on this tool warns you beyond that point.',
  },
  {
    question: 'What happens if I crop into the quiet zone?',
    answer:
      'The scanner may fail to find the code, or scanning becomes slow and unreliable, because the finder patterns no longer have blank space around them.',
  },
  {
    question: 'Can cropping fix a code that is off-center in a photo?',
    answer:
      'Only partly. Cropping the roomy side cannot restore margin on the tight side. Add quiet-zone padding first to restore an even margin, then crop evenly if needed.',
  },
  {
    question: 'Should I crop in the design tool or here?',
    answer:
      'Crop once, here, and tell the designer the margin is final. A second crop inside a layout tool is a common cause of silent quiet-zone damage.',
  },
];

export default function QrCodeCropperPage() {
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

  const [src, setSrc] = useState('');
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const maxCrop = Math.max(left, top, right, bottom);
  const guardWarn = maxCrop > 12;
  const guardBad = maxCrop > 22;
  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const url = await fileToDataUrl(file);
      const img = await loadImage(url);
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      setSrc(url);
      setResult('');
      setError('');
      setLeft(0);
      setTop(0);
      setRight(0);
      setBottom(0);
    } catch {
      setError('Could not read that file.');
    }
  }
  async function crop() {
    try {
      if (!src) {
        setError('Upload a QR image first.');
        return;
      }
      const img = await loadImage(src);
      const x = Math.round((left / 100) * img.naturalWidth);
      const y = Math.round((top / 100) * img.naturalHeight);
      const w = img.naturalWidth - x - Math.round((right / 100) * img.naturalWidth);
      const h = img.naturalHeight - y - Math.round((bottom / 100) * img.naturalHeight);
      if (w < 20 || h < 20) {
        setError(
          'Crop is too aggressive — it would leave almost nothing. Reduce the crop amounts.'
        );
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      setResult(canvas.toDataURL('image/png'));
      setError('');
    } catch {
      setError('Could not crop that image.');
    }
  }
  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'qr-cropped.png';
    a.click();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Code Cropper',
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
          { label: 'QR Code Cropper', href: '/qr-code-cropper' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Crop className="w-3.5 h-3.5" />
          <span>Image Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Cropper
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Crop a QR image in-browser with a quiet-zone guard that warns if the crop would cut the
          margin.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="cr-file">Upload a QR image (PNG or JPG)</Label>
            <Input
              id="cr-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {natural.w > 0 && (
              <p className="text-xs text-muted-foreground">
                Original size: {natural.w} x {natural.h}px
              </p>
            )}
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Crop from left: {left}%</Label>
              <Slider
                value={[left]}
                min={0}
                max={40}
                step={1}
                onValueChange={([v]) => setLeft(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Crop from top: {top}%</Label>
              <Slider value={[top]} min={0} max={40} step={1} onValueChange={([v]) => setTop(v)} />
            </div>
            <div className="space-y-2">
              <Label>Crop from right: {right}%</Label>
              <Slider
                value={[right]}
                min={0}
                max={40}
                step={1}
                onValueChange={([v]) => setRight(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Crop from bottom: {bottom}%</Label>
              <Slider
                value={[bottom]}
                min={0}
                max={40}
                step={1}
                onValueChange={([v]) => setBottom(v)}
              />
            </div>
          </div>
          <div
            className={`rounded-lg border p-3 text-xs ${guardBad ? 'bg-red-500/10 border-red-500/30 text-red-700' : guardWarn ? 'bg-amber-500/10 border-amber-500/30 text-amber-800' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'}`}
          >
            {guardBad
              ? 'Stop: cropping this much will almost certainly cut into the quiet zone and break scanning. Reduce the crop.'
              : guardWarn
                ? 'Caution: cropping beyond about 12% on any side risks cutting the quiet zone. Check the result carefully and scan it before use.'
                : 'Quiet-zone guard: this crop stays within the safe range for a typical export with a normal margin.'}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={crop}>Crop image</Button>
            {result && (
              <Button variant="outline" onClick={download}>
                Download cropped PNG
              </Button>
            )}
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Cropped result
          </p>
          {result ? (
            <img
              src={result}
              alt="Cropped QR code"
              className="w-full max-w-sm mx-auto rounded border"
            />
          ) : src ? (
            <img
              src={src}
              alt="Uploaded QR code"
              className="w-full max-w-sm mx-auto rounded border opacity-70"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Upload a QR image to begin.</p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Crop only the excess margin around the code — never the modules, and never the quiet
            zone itself.
          </p>
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-code-cropper-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Crop a QR Image Without Cutting the Quiet Zone
        </h2>
        <p className="text-base leading-relaxed">
          Cropping a QR image is usually about removing excess space: a screenshot with too much
          white around the code, a photo with the code off-center, or an export with a generous
          margin that does not fit the layout. The crop itself is harmless as long as it only
          removes empty space outside the quiet zone. The moment it cuts into the quiet zone, or
          worse, into the modules, the code starts failing. The guard on this tool exists because
          that boundary is invisible in most images: the margin looks like blank space, and there is
          nothing in the file marking where the required four modules end and the disposable excess
          begins.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-code-cropper-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The safe way to think about it is in layers. The innermost layer is the module grid, which
          must never be touched. Around it sits the quiet zone, at least four modules wide on every
          side, which must also never be touched. Outside that sits any extra margin, which is the
          only part that is safe to crop. For a typical clean export, the extra margin is small,
          which is why the guard warns once any side passes about twelve percent. A screenshot of a
          code on a web page can have much more disposable space, but a tight export from a
          generator has almost none, so the same percentage means very different things depending on
          the source.
        </p>
        <p className="text-base leading-relaxed">
          Crop evenly and conservatively. Removing a little from all four sides keeps the code
          centered and preserves the margin on every side, while removing a lot from one side pushes
          the code against the edge of the file and leaves one side with no quiet zone at all. After
          cropping, inspect all four edges of the result before you use it: there should be a
          visible band of background around the entire code, even on the side you cropped most. If
          any side looks tight, undo the crop and start again with a smaller amount. The preview on
          this tool shows the result at full size, so check it there rather than trusting the slider
          numbers.
        </p>
        <p className="text-base leading-relaxed">
          Uneven originals need a different approach. If a photo has the code off-center with a lot
          of space on one side and none on the other, cropping the roomy side will not fix the tight
          side, and the code is already damaged. The right fix for that image is to add quiet zone
          padding first, which restores an even margin, and then crop the excess evenly if needed.
          Cropping is a finishing step for an image that already has a healthy margin, not a repair
          for an image that never had one.
        </p>
        <p className="text-base leading-relaxed">
          Finish by scanning the cropped file with a real phone, and scan it after it has been
          placed in its final layout. A crop that looked safe on screen can still fail if the layout
          tool crops the image again to fit a frame, which is a common silent second crop. If the
          code will sit inside a design, hand over the cropped file with a note that the margin is
          final and must not be trimmed further, and check the finished design before it ships.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-code-cropper-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-code-cropper-bottom" format="horizontal-banner" />
    </div>
  );
}
