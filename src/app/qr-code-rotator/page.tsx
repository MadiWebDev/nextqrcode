'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RotateCw } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'Does rotating a QR code break it?',
    answer:
      'Quarter turns (90\u00b0, 180\u00b0, 270\u00b0) never break it \u2014 scanners read all four upright orientations. Arbitrary angles resample the pixels, so large ones can soften edges and should be re-checked by scanning.',
  },
  {
    question: 'Why would I rotate a QR code at all?',
    answer:
      'To fix a sideways photo, scan, or layout export, or to straighten a code photographed at a slight tilt. An upright code looks professional and is easier for people to recognize.',
  },
  {
    question: 'What fills the corners after an arbitrary rotation?',
    answer:
      'The background color you choose, defaulting to white. Exposed corners must be filled with the background color, never black, so the quiet zone stays readable.',
  },
  {
    question: 'Can I rotate a code 45 degrees for a diamond design?',
    answer:
      'You can, but it is risky for print: the resampled edges soften and the diamond corners waste space. For a decorative diamond layout, test-scan a printed proof before committing.',
  },
];

export default function QrCodeRotatorPage() {
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
  const [angle, setAngle] = useState(90);
  const [bg, setBg] = useState('#ffffff');
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
  async function rotate(deg: number) {
    try {
      if (!src) {
        setError('Upload a QR image first.');
        return;
      }
      const img = await loadImage(src);
      const rad = (deg * Math.PI) / 180;
      const quarter = ((deg % 360) + 360) % 360 === 0 || ((deg % 360) + 360) % 360 === 180;
      const w = quarter ? img.naturalWidth : img.naturalWidth;
      const h = quarter ? img.naturalHeight : img.naturalHeight;
      let outW = w;
      let outH = h;
      const isQuarter = ((deg % 90) + 90) % 90 === 0 && ((deg % 180) + 180) % 180 !== 0;
      if (isQuarter) {
        outW = h;
        outH = w;
      } else if (((deg % 90) + 90) % 90 !== 0) {
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        outW = Math.ceil(w * cos + h * sin);
        outH = Math.ceil(w * sin + h * cos);
      }
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, outW, outH);
      ctx.translate(outW / 2, outH / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      setResult(canvas.toDataURL('image/png'));
      setError('');
    } catch {
      setError('Could not rotate that image.');
    }
  }
  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `qr-rotated-${angle}deg.png`;
    a.click();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Code Rotator',
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
          { label: 'QR Code Rotator', href: '/qr-code-rotator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Image Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Rotator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Rotate a QR image by 90, 180, or 270 degrees, or any arbitrary angle, in-browser and
          download the result.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="rt-file">Upload a QR image (PNG or JPG)</Label>
            <Input
              id="rt-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
          <div className="space-y-2">
            <Label>Quick rotate</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setAngle(90);
                  rotate(90);
                }}
              >
                90°
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setAngle(180);
                  rotate(180);
                }}
              >
                180°
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setAngle(270);
                  rotate(270);
                }}
              >
                270°
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAngle(0);
                  rotate(360);
                }}
              >
                Reset (360°)
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Arbitrary angle: {angle}°</Label>
            <Slider
              value={[angle]}
              min={0}
              max={360}
              step={1}
              onValueChange={([v]) => setAngle(v)}
            />
            <Button size="sm" variant="outline" onClick={() => rotate(angle)}>
              Apply {angle}° rotation
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Background fill for exposed corners</Label>
            <Input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-10 p-1 w-24"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {result && <Button onClick={download}>Download rotated PNG</Button>}
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Result</p>
          {result ? (
            <img
              src={result}
              alt="Rotated QR code"
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
            Quarter turns (90°, 180°, 270°) keep every module perfectly square. Arbitrary angles are
            for straightening a skewed photo — always re-check the scan afterwards.
          </p>
        </Card>
      </div>
      {/* After-tool AdSlot */}
      <AdSlot id="qr-code-rotator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">When and How to Rotate a QR Code</h2>
        <p className="text-base leading-relaxed">
          Rotation is one of the safest edits you can make to a QR code, because the code itself is
          rotationally symmetric in a specific sense: scanners read it in any of the four upright
          orientations. A code rotated by 90, 180, or 270 degrees is exactly as scannable as the
          original, with every module still perfectly square and every finder pattern still intact.
          That makes rotation the right fix when a code arrives sideways from a camera, a scanner,
          or a layout tool, and it is why the quarter-turn buttons on this tool are the ones to
          reach for first.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="qr-code-rotator-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The practical use cases are mostly about fixing other people&apos;s orientation mistakes.
          A photo of a printed code taken with the phone sideways, a scan that saved the image
          rotated, or a label designed in landscape while the code was built in portrait all produce
          a sideways code that looks wrong to a human even though a scanner could still read it.
          Rotating the file back to upright makes it look professional and makes it easier for
          people to recognize as a code worth scanning. The same applies to codes printed on the
          side of a box or a bottle, where the artwork is correct for the package but sideways in
          the file.
        </p>
        <p className="text-base leading-relaxed">
          Arbitrary angles are a different tool with a different purpose. They exist to straighten a
          code photographed at a slight tilt, where the whole image is a few degrees off level. A
          small correction of two to ten degrees can turn a skewed photo into a usable image,
          because the rotation fills the exposed corners with the background color and leaves the
          modules intact. Large arbitrary angles are a bad idea for a code you intend to print,
          because rotating a square grid by, say, 37 degrees forces the pixels to be resampled,
          which softens the module edges. If a code needs a large arbitrary rotation for display,
          regenerate it at the correct orientation instead.
        </p>
        <p className="text-base leading-relaxed">
          Two details decide whether a rotation is safe. The first is the background fill: when an
          image rotates by an angle that is not a quarter turn, the corners of the canvas are
          exposed, and they must be filled with the background color, not left transparent over a
          dark page or filled with black. This tool fills exposed corners with your chosen
          background, defaulting to white. The second is the quiet zone: rotation never removes the
          quiet zone, but cropping after rotation can. If you rotate and then crop the result to
          remove the empty corners, you may cut into the margin, so check all four sides before you
          export.
        </p>
        <p className="text-base leading-relaxed">
          As with every image edit, finish by scanning the rotated file with a real phone and
          confirming the decoded content. Quarter turns should scan instantly, every time. If an
          arbitrary-angle rotation scans slowly or not at all, the resampling has softened the edges
          too much, and the fix is a smaller correction, a sharper source image, or a fresh
          generation of the code. Rotation is a repair for orientation, not a substitute for a clean
          original.
        </p>
      </article>
      {/* Pre-related AdSlot */}
      <AdSlot id="qr-code-rotator-pre-related" format="horizontal-banner" />

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
      <AdSlot id="qr-code-rotator-bottom" format="horizontal-banner" />
    </div>
  );
}
