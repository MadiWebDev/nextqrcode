'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Square } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'How wide should the quiet zone be?',
    answer:
      'At least 4 modules on all four sides, where a module is one small square of the QR grid. On busy backgrounds, 6 to 8 modules gives extra safety.',
  },
  {
    question: 'White or transparent padding \u2014 which is better?',
    answer:
      'White is safest everywhere. Use transparent only when the surface behind the code is light and uncluttered, so the blank margin stays readable to the camera.',
  },
  {
    question: 'Can I crop the quiet zone to fit a tight layout?',
    answer:
      'No. Cropping the quiet zone is one of the most common causes of scan failure. If the code plus margin does not fit, shorten the payload or move the code instead.',
  },
  {
    question: 'Does this tool change the QR code itself?',
    answer:
      'No. It only adds blank padding around your existing image. The modules, payload, and error-correction level of your code are untouched.',
  },
];

export default function QrQuietZoneAdderPage() {
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
  const [modules, setModules] = useState(4);
  const [mode, setMode] = useState<'white' | 'transparent'>('white');
  const [result, setResult] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setError('');
      setSrc(await fileToDataUrl(file));
      setResult('');
      setInfo('');
    } catch {
      setError('Could not read that file.');
    }
  }
  async function addZone() {
    try {
      if (!src) {
        setError('Upload a QR image first.');
        return;
      }
      const img = await loadImage(src);
      const pad = Math.round((img.naturalWidth / 25) * modules);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth + pad * 2;
      canvas.height = img.naturalHeight + pad * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (mode === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, pad, pad);
      setResult(canvas.toDataURL('image/png'));
      setInfo(
        `Added ${modules} modules of quiet zone (${pad}px on each side at this image size). Exported size: ${canvas.width} x ${canvas.height}px.`
      );
    } catch {
      setError('Could not process that image.');
    }
  }
  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'qr-quiet-zone.png';
    a.click();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Quiet Zone Adder',
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
          { label: 'QR Quiet Zone Adder', href: '/qr-quiet-zone-adder' },
        ]}
      />

      <AdSlot id="qr-quiet-zone-adder-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Square className="w-3.5 h-3.5" />
          <span>Image Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Quiet Zone Adder
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Add a correct quiet zone — white or transparent — around an uploaded QR image, and export
          the padded image.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="qz-file">Upload a QR image (PNG or JPG)</Label>
            <Input
              id="qz-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
          <div className="space-y-2">
            <Label>Quiet zone width: {modules} modules</Label>
            <Slider
              value={[modules]}
              min={4}
              max={12}
              step={1}
              onValueChange={([v]) => setModules(v)}
            />
            <p className="text-xs text-muted-foreground">
              The QR standard requires at least 4 modules. More is safer on busy backgrounds.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Padding color</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={mode === 'white' ? 'default' : 'outline'}
                onClick={() => setMode('white')}
              >
                White
              </Button>
              <Button
                size="sm"
                variant={mode === 'transparent' ? 'default' : 'outline'}
                onClick={() => setMode('transparent')}
              >
                Transparent
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={addZone}>Add quiet zone</Button>
          {info && <p className="text-xs text-muted-foreground">{info}</p>}
          {result && (
            <Button variant="outline" onClick={download}>
              Download padded PNG
            </Button>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Result</p>
          {result ? (
            <img
              src={result}
              alt="QR code with quiet zone added"
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
        </Card>
      </div>

      <AdSlot id="qr-quiet-zone-adder-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why the Quiet Zone Matters More Than the Code Itself
        </h2>
        <p className="text-base leading-relaxed">
          The quiet zone is the blank margin around a QR code, and it is not wasted space. Scanners
          find a code by looking for the three square finder patterns in the corners, and they can
          only recognize those squares when the area around them is empty. If text, a logo, a photo,
          or even a border touches the code, the camera cannot tell where the code ends and the
          design begins, and the scan fails or takes several frustrating seconds. The standard calls
          for a quiet zone at least four modules wide on all four sides, where a module is one of
          the small black or white squares in the grid. This tool adds exactly that margin, measured
          from your image, so you do not have to guess.
        </p>
        <p className="text-base leading-relaxed">
          White padding is the default because it is the safest choice in almost every situation. A
          white quiet zone works on white paper, on light packaging, and on screens, and it matches
          what scanners expect. Transparent padding is useful when the code sits on a colored or
          photographic background, because a white box would look like a sticker slapped on the
          design. The trade-off is that transparency only works if the background behind the code is
          light and uncluttered. If the surface behind a transparent-padded code is dark or busy,
          the quiet zone is effectively gone, and the scan can fail just as it would with no margin
          at all.
        </p>

        <AdSlot id="qr-quiet-zone-adder-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          More than four modules is not wrong. Designers sometimes add six or eight modules when a
          code sits on a patterned background, near other graphics, or on packaging where nearby
          text crowds the edges. Extra margin costs almost nothing in layout space and buys real
          scanning reliability, especially on curved or reflective surfaces where the camera is
          already working harder. The only mistake is going the other way: trimming the margin to
          squeeze a code into a tight layout. If the layout cannot fit the code plus its quiet zone,
          the code is too big for that layout, and the answer is a shorter payload or a different
          placement, not a cropped margin.
        </p>
        <p className="text-base leading-relaxed">
          This tool estimates module size from the uploaded image, assuming the code roughly fills
          the frame. That estimate is accurate for a clean export that was cropped to the code
          edges. If your upload already includes a wide margin, the added padding will be generous
          rather than exact, which is safe but can make the file larger than needed. If your upload
          is a photo of a printed code taken at an angle, straighten and crop it first, because
          padding a skewed photo will not fix the skew. After adding the zone, open the result and
          check all four sides: the margin should look even, and no part of the original image
          should touch the edge of the file.
        </p>
        <p className="text-base leading-relaxed">
          The final step is always a real scan test. Print the padded image at the size it will
          actually be used, place it on the real surface, and scan it from the real distance with a
          phone. Test in the worst light the location gets, not the best. If the code scans
          instantly, the quiet zone did its job. If it hesitates, add more margin, enlarge the code,
          or simplify whatever sits next to it. Never fix a scanning problem by removing margin:
          that trades a small layout inconvenience for a code that does not work.
        </p>
      </article>

      <AdSlot id="qr-quiet-zone-adder-pre-related" format="horizontal-banner" />

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

      <AdSlot id="qr-quiet-zone-adder-bottom" format="horizontal-banner" />

    </div>
  );
}
