'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'Is SVG or PNG better for printing QR codes?',
    answer:
      'SVG is better for professional print because it scales to any size without softening the module edges. Use PNG when the destination tool does not accept SVG, and export at a pixel size matched to the final print size at 300 DPI.',
  },
  {
    question: 'What PNG size do I need for print?',
    answer:
      'Multiply the printed width in inches by 300. A 2-inch code needs about 600 pixels, so the 1024px export covers it. Never enlarge a small PNG for a large print.',
  },
  {
    question: 'Why should I avoid JPEG for QR codes?',
    answer:
      'JPEG compression blurs the sharp edges between black and white modules, which makes scanning slower and less reliable. PNG and SVG keep edges crisp.',
  },
  {
    question: 'Does the PDF contain one code or many?',
    answer:
      'One code per A4 page, with the content printed above it and a scan note below. It is designed as a printable proof or handout; for production runs, hand the printer the SVG or a high-resolution PNG.',
  },
];

export default function QrSvgPngPdfExporterPage() {
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
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  async function render() {
    try {
      setError('');
      const url = await QRCodeLib.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: 'M',
        width: 512,
        margin: 2,
        color: { dark: fg, light: bg },
      });
      setPreview(url);
    } catch {
      setError('Could not generate this content. Shorten the text and try again.');
    }
  }
  useEffect(() => {
    const id = requestAnimationFrame(() => render());
    return () => cancelAnimationFrame(id);
  }, [text, fg, bg]);
  async function exportSVG() {
    try {
      const svg = await QRCodeLib.toString(text || 'https://example.com', {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 2,
        color: { dark: fg, light: bg },
      });
      downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qr-code.svg');
      setStatus('SVG downloaded.');
    } catch {
      setError('SVG export failed.');
    }
  }
  async function exportPNG(size: number) {
    try {
      const url = await QRCodeLib.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: 'M',
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${size}px.png`;
      a.click();
      setStatus(`PNG (${size}px) downloaded.`);
    } catch {
      setError('PNG export failed.');
    }
  }
  async function exportPDF() {
    try {
      const { jsPDF } = await import('jspdf');
      const url = await QRCodeLib.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: 'M',
        width: 1024,
        margin: 2,
        color: { dark: fg, light: bg },
      });
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      doc.setFontSize(16);
      doc.text('QR Code', 105, 24, { align: 'center' });
      doc.setFontSize(10);
      doc.text((text || 'https://example.com').slice(0, 90), 105, 33, { align: 'center' });
      doc.addImage(url, 'PNG', 55, 45, 100, 100);
      doc.setFontSize(9);
      doc.text(
        'Scan with your phone camera. Keep the white margin around the code clear.',
        105,
        158,
        { align: 'center' }
      );
      doc.save('qr-code.pdf');
      setStatus('PDF downloaded.');
    } catch {
      setError('PDF export failed.');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR SVG PNG PDF Exporter',
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
          { label: 'QR SVG PNG PDF Exporter', href: '/qr-svg-png-pdf-exporter' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Download className="w-3.5 h-3.5" />
          <span>Export Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR SVG PNG PDF Exporter
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Paste any text or URL and export the QR code as SVG, PNG at several sizes, or a one-page
          PDF.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ex-text">Content (URL or text)</Label>
            <Input id="ex-text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Foreground</Label>
              <Input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-emerald-600">{status}</p>}
          <div className="space-y-2">
            <Label>Export</Label>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={exportSVG}>
                SVG (vector)
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportPNG(512)}>
                PNG 512px
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportPNG(1024)}>
                PNG 1024px
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportPNG(2048)}>
                PNG 2048px
              </Button>
              <Button size="sm" variant="outline" onClick={exportPDF}>
                One-page PDF
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            SVG scales to any size without softening. PNG is fixed-pixel: pick the size closest to
            your final print size at 300 DPI. PDF is a single A4 page with the code centered and a
            scan note.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Preview</p>
          {preview ? (
            <img
              src={preview}
              alt="QR code preview"
              className="w-full max-w-sm mx-auto rounded border"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Preview will appear here.</p>
          )}
        </Card>
      </div>
      <AdSlot id="qr-svg-png-pdf-exporter-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Which Export Format Should You Choose for a QR Code
        </h2>
        <p className="text-base leading-relaxed">
          The format you export a QR code in decides whether it survives the journey from your
          screen to the printed page. A QR code is a grid of perfectly sharp squares, and any format
          that softens those edges makes the code harder to read. Vector formats keep edges
          mathematically sharp at every size, while raster formats store a fixed grid of pixels that
          can blur when enlarged. Understanding that single distinction will prevent most export
          mistakes, because the right choice is almost always the format that preserves sharp edges
          at the size you will actually print.
        </p>
        <p className="text-base leading-relaxed">
          SVG is the best choice for professional print, signage, packaging, and anything that might
          be resized later. Because SVG describes the code as shapes rather than pixels, a designer
          can place it on a business card or a billboard without any loss of sharpness. It also
          stays tiny in file size and can be recolored or edited in design software. The main
          limitation is that some simple tools, such as basic office programs or social media
          uploaders, do not accept SVG. In those cases, export a PNG at a generous pixel size
          instead of fighting the tool.
        </p>
        <AdSlot id="qr-svg-png-pdf-exporter-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          PNG is the right choice for web pages, slides, documents, and quick proofs. Pick the pixel
          size from the final use, not from habit. A good rule is to multiply the printed size in
          inches by 300 to get the pixels you need: a code printed two inches wide needs about 600
          pixels, so the 1024 pixel export covers it comfortably. Exporting a 512 pixel PNG and
          stretching it to six inches wide is one of the most common ways to produce a blurry,
          slow-scanning code. When in doubt, export larger than you need, because shrinking a sharp
          PNG is harmless while enlarging a small one is not.
        </p>
        <p className="text-base leading-relaxed">
          PDF is the right choice when you need a single self-contained page to print or email: a
          handout, a table tent, a noticeboard sheet, or a proof for a client. The PDF from this
          tool places one code on an A4 page with its content printed above it and a short scan note
          below, which makes it easy to check and file. For a full production print run, however,
          give the printer the SVG or a high-resolution PNG and let them place it in the layout,
          because a one-code-per-page PDF is a proofing format, not a press format. Avoid JPEG
          entirely for QR codes: its compression smears the sharp edges between black and white
          squares.
        </p>
        <p className="text-base leading-relaxed">
          Whichever format you choose, finish with the same verification. Open the exported file,
          not just the on-screen preview, and confirm the code looks crisp at its final size. Print
          one copy if it will be printed, and scan it with a real phone in the lighting where it
          will live. Check that the quiet zone survived the export: some design tools crop images to
          their content box, which can silently trim the white margin. If the margin looks thin or
          uneven in the exported file, add padding before you send it anywhere, because a cropped
          quiet zone is a broken code.
        </p>
      </article>
      <AdSlot id="qr-svg-png-pdf-exporter-pre-related" format="horizontal-banner" />
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
      <AdSlot id="qr-svg-png-pdf-exporter-bottom" format="horizontal-banner" />
    </div>
  );
}
