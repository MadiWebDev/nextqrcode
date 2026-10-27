'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FileText } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FAQS = [
  {
    question: 'What size is the code in the PDF?',
    answer:
      '100 mm square, centered on an A4 page with wide safe margins. That size scans comfortably from about a metre away on noticeboards and reception desks.',
  },
  {
    question: 'Can I convert an existing QR image to PDF?',
    answer:
      'Yes. Choose the QR image source, upload a PNG or JPG, and the tool places your image on the one-page PDF with your title and instructions.',
  },
  {
    question: 'Should the PDF include the destination URL as text?',
    answer:
      'Yes. Printing the destination lets cautious readers see where the code leads, lets someone type the address if scanning fails, and gives staff a way to check the code without a phone.',
  },
  {
    question: 'Can I crop the PDF to make the code fit a layout?',
    answer:
      'Do not crop it. Cropping risks trimming the quiet zone and softening the modules. For layouts, use the SVG or high-resolution PNG export and place the code with its margin intact.',
  },
];

export default function QrToPdfConverterPage() {
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

  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('https://example.com');
  const [title, setTitle] = useState('Scan this QR code');
  const [instructions, setInstructions] = useState(
    'Open your phone camera, point it at the code, and tap the link that appears.'
  );
  const [imgSrc, setImgSrc] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setImgSrc(await fileToDataUrl(file));
      setError('');
    } catch {
      setError('Could not read that file.');
    }
  }
  async function makePdf() {
    try {
      setError('');
      setStatus('');
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      let dataUrl = imgSrc;
      if (mode === 'text') {
        dataUrl = await QRCodeLib.toDataURL(text || 'https://example.com', {
          errorCorrectionLevel: 'M',
          width: 1024,
          margin: 2,
        });
      }
      if (!dataUrl) {
        setError(
          mode === 'image' ? 'Upload a QR image first.' : 'Enter content for the QR code first.'
        );
        return;
      }
      doc.setFontSize(20);
      doc.text(title.trim() || 'Scan this QR code', 105, 30, { align: 'center' });
      doc.addImage(dataUrl, 'PNG', 55, 45, 100, 100);
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(
        instructions.trim() ||
          'Open your phone camera, point it at the code, and tap the link that appears.',
        160
      );
      doc.text(lines, 105, 160, { align: 'center' });
      if (mode === 'text') {
        doc.setFontSize(9);
        doc.text((text || '').slice(0, 110), 105, 185, { align: 'center' });
      }
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text('Keep the white margin around the code clear. Do not crop or cover it.', 105, 285, {
        align: 'center',
      });
      doc.save('qr-code.pdf');
      setStatus('One-page PDF downloaded.');
    } catch {
      setError('PDF conversion failed. Try a different image or shorter text.');
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR to PDF Converter',
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
          { label: 'QR to PDF Converter', href: '/qr-to-pdf-converter' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Export Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR to PDF Converter
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Convert a QR image or text into a printable one-page PDF with title, instructions, and
          quiet-zone-safe margins.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>Source</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={mode === 'text' ? 'default' : 'outline'}
                onClick={() => setMode('text')}
              >
                Text / URL
              </Button>
              <Button
                size="sm"
                variant={mode === 'image' ? 'default' : 'outline'}
                onClick={() => setMode('image')}
              >
                QR image
              </Button>
            </div>
          </div>
          {mode === 'text' ? (
            <div className="space-y-2">
              <Label htmlFor="tp-text">Content (URL or text)</Label>
              <Input id="tp-text" value={text} onChange={(e) => setText(e.target.value)} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="tp-file">Upload a QR image (PNG or JPG)</Label>
              <Input
                id="tp-file"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="tp-title">PDF title</Label>
            <Input id="tp-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tp-inst">Instructions line</Label>
            <Input
              id="tp-inst"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-emerald-600">{status}</p>}
          <Button onClick={makePdf}>Convert to PDF</Button>
          <p className="text-xs text-muted-foreground">
            The PDF is one A4 page: title, a 100 mm code centered with safe margins, instructions,
            and a quiet-zone reminder. Everything runs in your browser.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Preview</p>
          {mode === 'image' && imgSrc ? (
            <img
              src={imgSrc}
              alt="Uploaded QR code"
              className="w-full max-w-xs mx-auto rounded border"
            />
          ) : mode === 'text' ? (
            <p className="text-sm text-muted-foreground">
              A fresh QR code will be generated from your text when you convert.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Upload a QR image to preview it.</p>
          )}
        </Card>
      </div>
      <AdSlot id="qr-to-pdf-converter-after-tool" format="horizontal-banner" />
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to Turn a QR Code into a Printable PDF That Works
        </h2>
        <p className="text-base leading-relaxed">
          A QR code becomes useful in the physical world the moment it sits on a page someone can
          print, pin, and scan. The PDF format is the natural carrier for that job, because it
          freezes the layout: the code stays the same size, the title stays in place, and the page
          prints identically on any printer. A good one-page QR PDF has only four elements: a clear
          title, the code itself at a generous size with its quiet zone intact, one line of
          instructions, and the destination written out in small type for anyone who would rather
          type than scan. Anything more is clutter that competes with the code.
        </p>
        <p className="text-base leading-relaxed">
          Size and margins are the two decisions that decide whether the PDF prints well. The code
          on this tool&apos;s PDF is 100 millimeters square, centered on an A4 page, which leaves
          wide safe margins on every printer, including printers that cannot print to the edge. That
          size is scanned comfortably from a metre away, which covers noticeboards, reception desks,
          and classroom walls. If the page will be read from further away, print the PDF larger or
          generate a bigger code rather than scaling the page in the printer dialog, because printer
          scaling can soften the module edges and trim the margins unpredictably.
        </p>
        <AdSlot id="qr-to-pdf-converter-in-content" format="in-article" />
        <p className="text-base leading-relaxed">
          The instructions line should describe the action in plain language: open the camera, point
          it at the code, tap the link. Avoid telling readers to download an app, because modern
          phones scan with the built-in camera and the extra step loses people. Print the
          destination URL under the code as well, in small but legible type. That line serves three
          purposes: it lets someone type the address if scanning fails, it tells a cautious reader
          where the code leads before they scan, and it gives staff a way to check the code without
          a phone. If the URL is long, use a short redirect for the printed page and keep the long
          address behind it.
        </p>
        <p className="text-base leading-relaxed">
          The quiet-zone reminder at the foot of the page is there for a reason: the most common way
          a good QR PDF gets ruined is in the next step of the workflow. Someone crops the page in a
          design tool, photocopies it with the margins cut off, or pastes the code into a slide and
          trims the white space to make it fit. Any of those steps can silently remove the blank
          margin the scanner needs. Treat the PDF as the finished artifact. If the code must live
          inside a larger layout, hand the layout designer the SVG or high-resolution PNG and let
          them place it with its margin intact, rather than cropping the PDF.
        </p>
        <p className="text-base leading-relaxed">
          Before distributing a QR PDF, verify it the same way you would verify any printed code.
          Open the downloaded file, print one copy at the intended size, and scan the print from the
          real distance in the real light. Check that the title is spelled correctly, that the
          printed destination matches the code, and that the page number or footer, if any, does not
          crowd the code. A PDF that passes those checks can be emailed, posted, and reprinted with
          confidence, because what you tested is exactly what everyone else will receive.
        </p>
      </article>
      <AdSlot id="qr-to-pdf-converter-pre-related" format="horizontal-banner" />
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
      <AdSlot id="qr-to-pdf-converter-bottom" format="horizontal-banner" />
    </div>
  );
}
