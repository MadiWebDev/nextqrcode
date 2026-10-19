'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Droplets } from 'lucide-react';
import QRCodeLib from 'qrcode';

const FAQS = [
  {
    question: 'What contrast ratio is safe for a printed QR code?',
    answer:
      'Aim for 4.5:1 or better. Between 3:1 and 4.5:1 is risky and needs a printed test; below 3:1 is unsafe for production print.',
  },
  {
    question: 'Can I use brand colors for a QR code?',
    answer:
      'Yes, if the module color is dark and the background is light with a passing ratio. If the brand palette cannot pass, keep the code black on white and put brand colors in the frame and headline.',
  },
  {
    question: 'Why do inverted QR codes (white on black) fail?',
    answer:
      'Most scanner software expects dark modules on a light field. Inverted codes break that assumption, so many phones cannot read them even when the contrast ratio looks high.',
  },
  {
    question: 'Is a passing ratio a guarantee the code scans?',
    answer:
      'No. Gloss, metallic ink, curves, glare, and small print sizes can still defeat a passing pair. Always test-scan a printed proof in the real location.',
  },
];

export default function QrColorPairTesterPage() {
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

  const [fg, setFg] = useState('#1e3a8a');
  const [bg, setBg] = useState('#ffffff');
  const [text, setText] = useState('https://example.com');
  const [preview, setPreview] = useState('');
  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const fgLum = useMemo(() => luminance(fg), [fg]);
  const bgLum = useMemo(() => luminance(bg), [bg]);
  const verdict =
    ratio >= 4.5
      ? 'Safe for print'
      : ratio >= 3
        ? 'Risky — test before printing'
        : 'Unsafe — do not print';
  const verdictColor =
    ratio >= 4.5 ? 'text-emerald-600' : ratio >= 3 ? 'text-amber-600' : 'text-red-600';
  async function render() {
    try {
      const url = await QRCodeLib.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: 'M',
        width: 320,
        margin: 2,
        color: { dark: fg, light: bg },
      });
      setPreview(url);
    } catch {
      setPreview('');
    }
  }
  useEffect(() => {
    const id = requestAnimationFrame(() => render());
    return () => cancelAnimationFrame(id);
  }, [fg, bg, text]);
  function applyPreset(f: string, b: string) {
    setFg(f);
    setBg(b);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Color Pair Tester',
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
          { label: 'QR Color Pair Tester', href: '/qr-color-pair-tester' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Droplets className="w-3.5 h-3.5" />
          <span>Color Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Color Pair Tester
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Test foreground and background color pairs for scan safety: contrast ratio, verdict, and
          suggested fixes.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Foreground (modules)</Label>
              <Input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="h-12 p-1"
              />
              <Input
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Background</Label>
              <Input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-12 p-1"
              />
              <Input
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Try a preset pair</Label>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => applyPreset('#000000', '#ffffff')}>
                Black on white
              </Button>
              <Button size="sm" variant="outline" onClick={() => applyPreset('#1e3a8a', '#ffffff')}>
                Navy on white
              </Button>
              <Button size="sm" variant="outline" onClick={() => applyPreset('#14532d', '#fefce8')}>
                Green on cream
              </Button>
              <Button size="sm" variant="outline" onClick={() => applyPreset('#facc15', '#ffffff')}>
                Yellow on white (bad)
              </Button>
              <Button size="sm" variant="outline" onClick={() => applyPreset('#ffffff', '#000000')}>
                White on black (bad)
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-text">Preview content</Label>
            <Input id="cp-text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contrast ratio</span>
              <strong>{ratio.toFixed(2)}:1</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verdict</span>
              <strong className={verdictColor}>{verdict}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Foreground luminance</span>
              <span>{fgLum.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Background luminance</span>
              <span>{bgLum.toFixed(3)}</span>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-xs leading-relaxed">
            <p className="font-semibold mb-1">How to fix a failing pair</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Darken the foreground: move toward navy, dark green, dark brown, or black.</li>
              <li>Lighten the background: move toward white, off-white, or a pale tint.</li>
              <li>
                Never use a light color for the modules or a dark color for the background —
                scanners expect dark modules on a light field.
              </li>
              <li>
                Re-test after every change: a small shift in one color can move the ratio a full
                point.
              </li>
            </ul>
          </div>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Preview in these colors
          </p>
          {preview ? (
            <img
              src={preview}
              alt="QR code in tested colors"
              className="w-full max-w-xs mx-auto rounded border"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Preview will appear here.</p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            On-screen preview is a guide only. Print one copy and scan it before a full run.
          </p>
        </Card>
      </div>
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Choose QR Colors That Still Scan
        </h2>
        <p className="text-base leading-relaxed">
          Color is where well-designed QR codes most often fail. A code is not a picture that a
          person reads; it is a pattern a camera must separate into dark and light squares in a
          fraction of a second, in imperfect light, through a possibly smudged lens. The measure
          that predicts whether that separation succeeds is the contrast ratio between the module
          color and the background color, computed from their relative luminance. This tool computes
          that ratio with the same math used by the WCAG accessibility standard, and it gives you a
          verdict you can act on before anything goes to print.
        </p>
        <p className="text-base leading-relaxed">
          The thresholds in this tool are deliberately stricter than the bare minimum. A ratio of
          4.5:1 or better is the safe zone for print, because paper, ink, sunlight, and aging all
          eat into contrast after the file leaves your screen. Between 3:1 and 4.5:1 is the risky
          zone: the code may scan fine on a bright screen in a well-lit room and still fail on a
          matte package in a dim shop. Below 3:1 is unsafe for any production use. Yellow modules on
          a white background are the classic failure here; they look cheerful in a mockup and nearly
          invisible to a camera. White modules on a black background, the inverted code, are equally
          unreliable, because most scanner software assumes dark modules on a light field.
        </p>
        <p className="text-base leading-relaxed">
          When a pair fails, fix it by moving the two colors apart, not by adding effects. Darken
          the foreground first: a deep navy, forest green, dark brown, or plum will usually clear
          the bar while keeping the brand feel. Then lighten the background toward white or a pale
          tint. Avoid the temptation to add a drop shadow, an outline, or a glow to rescue a weak
          pair; those effects add edges the scanner has to work around and rarely fix the underlying
          contrast problem. If the brand palette genuinely cannot produce a passing pair, keep the
          code itself in black on white and put the brand colors in the frame, the headline, and the
          call to action around it.
        </p>
        <p className="text-base leading-relaxed">
          Context can still defeat a passing ratio, so treat the number as necessary but not
          sufficient. Metallic inks, glossy lamination, and textured stocks all change how contrast
          behaves in real light. A code on a curved bottle or a reflective window is harder to scan
          than the same code on flat matte paper, even at the same ratio. That is why the final step
          is always a printed proof scanned with a real phone in the real location. If the proof
          hesitates, the fix is a darker foreground, a lighter background, a larger code, or a
          simpler placement, in that order.
        </p>
        <p className="text-base leading-relaxed">
          One more habit will save you from the most embarrassing color failure: test the exact
          exported file, not a screenshot of it. Screenshots can shift colors, compress edges, and
          hide the quiet zone. Export the PNG or SVG, open that file, print it at final size, and
          scan the print. If your workflow passes the code through a design tool, check the code
          again after the handoff, because color profiles and background layers are exactly the kind
          of thing that changes silently between tools.
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
