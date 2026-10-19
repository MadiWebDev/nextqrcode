'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WandSparkles } from 'lucide-react';

const FAQS = [
  {
    question: 'Can enhancement fix any blurry QR photo?',
    answer:
      'No. It rescues faded, low-contrast, and slightly soft photos. It cannot rebuild modules that are missing, fully washed out, badly out of focus, or photographed at a steep angle.',
  },
  {
    question: 'What does thresholding do?',
    answer:
      'It forces every pixel to pure black or pure white based on a cutoff. Pixels darker than the threshold become black; lighter ones become white. That clean separation is what scanners need.',
  },
  {
    question: 'Why do the finder patterns matter when checking the result?',
    answer:
      'The three large corner squares are what the camera locks onto. If they are solid black with clean white borders after enhancement, the settings are close. If they are broken or bleeding, the settings are wrong.',
  },
  {
    question: 'Should I scan the enhanced image before using it?',
    answer:
      'Yes, always. Enhancement can occasionally flip a borderline module. Scan the result and confirm the decoded content matches the expected destination before relying on it.',
  },
];

export default function QrImageEnhancerPage() {
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
  const [contrast, setContrast] = useState(1.4);
  const [brightness, setBrightness] = useState(0);
  const [threshold, setThreshold] = useState(128);
  const [useThreshold, setUseThreshold] = useState(true);
  const [sharpen, setSharpen] = useState(true);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setSrc(await fileToDataUrl(file));
      setResult('');
      setError('');
    } catch {
      setError('Could not read that file.');
    }
  }
  async function enhance() {
    try {
      if (!src) {
        setError('Upload a QR photo first.');
        return;
      }
      const img = await loadImage(src);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        let r = d[i],
          g = d[i + 1],
          b = d[i + 2];
        r = (r - 128) * contrast + 128 + brightness;
        g = (g - 128) * contrast + 128 + brightness;
        b = (b - 128) * contrast + 128 + brightness;
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        if (useThreshold) gray = gray < threshold ? 0 : 255;
        d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, gray));
      }
      if (sharpen) {
        const srcData = new Uint8ClampedArray(d);
        const w = canvas.width;
        const h = canvas.height;
        for (let y = 1; y < h - 1; y++)
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            const center = srcData[idx];
            const up = srcData[((y - 1) * w + x) * 4];
            const down = srcData[((y + 1) * w + x) * 4];
            const left = srcData[(y * w + (x - 1)) * 4];
            const right = srcData[(y * w + (x + 1)) * 4];
            const v = Math.max(0, Math.min(255, center * 5 - up - down - left - right));
            d[idx] = d[idx + 1] = d[idx + 2] = v;
          }
      }
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    } catch {
      setError('Could not enhance that image.');
    }
  }
  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'qr-enhanced.png';
    a.click();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Image Enhancer',
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
          { label: 'QR Image Enhancer', href: '/qr-image-enhancer' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <WandSparkles className="w-3.5 h-3.5" />
          <span>Image Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Image Enhancer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Enhance a blurry or low-contrast QR photo in-browser — contrast, sharpen, threshold — to
          make it scannable again.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ie-file">Upload a QR photo (PNG or JPG)</Label>
            <Input
              id="ie-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
          <div className="space-y-2">
            <Label>Contrast: {contrast.toFixed(1)}x</Label>
            <Slider
              value={[contrast]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={([v]) => setContrast(v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Brightness: {brightness}</Label>
            <Slider
              value={[brightness]}
              min={-60}
              max={60}
              step={5}
              onValueChange={([v]) => setBrightness(v)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useThreshold}
              onChange={(e) => setUseThreshold(e.target.checked)}
            />{' '}
            Convert to pure black and white (threshold)
          </label>
          {useThreshold && (
            <div className="space-y-2">
              <Label>Threshold: {threshold}</Label>
              <Slider
                value={[threshold]}
                min={40}
                max={220}
                step={5}
                onValueChange={([v]) => setThreshold(v)}
              />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sharpen}
              onChange={(e) => setSharpen(e.target.checked)}
            />{' '}
            Sharpen edges
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={enhance}>Enhance image</Button>
            {result && (
              <Button variant="outline" onClick={download}>
                Download enhanced PNG
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Everything runs in your browser; the photo is never uploaded. Enhancement can rescue
            faded or unevenly lit photos, but it cannot rebuild modules that are missing or fully
            washed out.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Before / after
          </p>
          <div className="grid grid-cols-2 gap-3">
            {src ? (
              <img src={src} alt="Original QR photo" className="w-full rounded border" />
            ) : (
              <p className="text-sm text-muted-foreground">Original will appear here.</p>
            )}
            {result ? (
              <img src={result} alt="Enhanced QR photo" className="w-full rounded border" />
            ) : (
              <p className="text-sm text-muted-foreground">Enhanced result will appear here.</p>
            )}
          </div>
        </Card>
      </div>
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Rescue a Faded or Blurry QR Photo
        </h2>
        <p className="text-base leading-relaxed">
          A QR code that looks tired in a photo can often be rescued, because the scanner does not
          need a beautiful image. It needs a clean separation between dark and light squares.
          Enhancement works by pushing the photo toward that clean separation: contrast stretches
          the gap between the darkest and lightest pixels, brightness shifts the whole image so the
          background sits well above the threshold, thresholding forces every pixel to pure black or
          pure white, and sharpening tightens the edges between squares. Applied in that order,
          these four steps can turn a washed-out snapshot into a code that scans on the first try.
        </p>
        <p className="text-base leading-relaxed">
          Start with the gentlest settings that work, not the strongest. Contrast around 1.4 with
          thresholding enabled rescues most faded prints and unevenly lit photos without destroying
          detail. If the background is grey rather than white, raise brightness slightly before
          thresholding, so the background lands above the threshold and the modules stay below it.
          If the code is on a dark or colored surface, brightness alone will not help, because the
          background itself is dark; in that case the photo may be unrecoverable, and the right
          answer is a fresh print, not more processing.
        </p>
        <p className="text-base leading-relaxed">
          Threshold is the most powerful control and the easiest to get wrong. Set it too low and
          pale modules turn white and disappear; set it too high and grey background noise turns
          black and merges the squares together. The default of 128 splits the tonal range in half
          and suits most photos. If the code looks patchy after enhancement, move the threshold in
          small steps and re-check the result each time, watching the finder patterns in the
          corners: they should be solid black squares with clean white borders. If the finder
          patterns are broken or bleeding into the background, the settings are wrong for this
          photo.
        </p>
        <p className="text-base leading-relaxed">
          Sharpening helps with blur, but it cannot create information that is not there. A slightly
          soft photo sharpens well, because the module edges are still present, just spread over a
          few pixels. A photo that is badly out of focus, heavily compressed, or shot at a steep
          angle will not sharpen into a working code, because the modules have merged into each
          other. Perspective is the other hard limit: enhancement does not straighten a skewed
          photo. If the code was photographed at an angle, straighten and crop it first, then
          enhance, because thresholding a skewed code bakes the distortion in.
        </p>
        <p className="text-base leading-relaxed">
          Always verify the enhanced result by scanning it, and compare the decoded content against
          the expected destination. Enhancement can occasionally flip a module near the threshold,
          which changes the payload or breaks the code&apos;s error correction in a way that still
          looks fine. If the enhanced code scans but leads somewhere unexpected, discard it and use
          the original source file instead. Enhancement is a rescue tool for a photo of a code you
          no longer have the source for, not a substitute for keeping the original export.
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
