'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import JsPDF from 'jspdf';
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  Images,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ImageItem {
  id: string;
  name: string;
  url: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  type: string;
}

type PageSize = 'a4' | 'letter' | 'fit';
type MarginSize = '0' | '10' | '20';

const faqs = [
  {
    question: 'Are my images uploaded to a server when I use this converter?',
    answer:
      'No. Every step happens locally in your browser. Your images are read from your device, previewed on this page and written into the PDF on your own machine. Nothing is uploaded, stored or shared, which makes this tool suitable for ID documents, contracts and other private paperwork. Closing the tab removes everything from the page.',
  },
  {
    question: 'Which image formats can I convert to PDF?',
    answer:
      'You can add JPG and JPEG photos, PNG images and WebP files — the three formats produced by most phones, scanners and screenshot tools. Each image becomes one page of the PDF, in the exact order shown in the list. Transparent PNG images are placed on the page as they are, and screenshots keep their original sharpness when you choose a small margin.',
  },
  {
    question: 'Should I choose A4 or Letter page size?',
    answer:
      'Choose A4 (210 × 297 mm) if you are in Europe, Asia, Australia or most other regions, because it is the standard office and home printer size there. Choose Letter (216 × 279 mm) for the United States and Canada. Choose Fit to image when you do not plan to print and simply want each page to match the shape of the original picture, for example for a photo album shared on screen.',
  },
  {
    question: 'How do I change the order of pages in the PDF?',
    answer:
      'Use the up and down arrow buttons beside each image in the list. The image at the top of the list becomes page 1, the next becomes page 2, and so on. Check the order before converting, especially for scanned documents where the cover page, ID pages and supporting pages need to arrive in a logical sequence for the person reading them.',
  },
  {
    question: 'Will my photos lose quality in the PDF?',
    answer:
      'The converter embeds the image data you supplied instead of re-photographing or heavily re-compressing it, so a sharp original stays sharp. For the best print results, start from the original camera file rather than a thumbnail sent through a messaging app, keep margins small so the image prints larger, and remember that a photo needs roughly 150–300 pixels per printed inch for crisp results.',
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function loadDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = url;
  });
}

export default function ImageToPdfConverterPage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [margin, setMargin] = useState<MarginSize>('10');
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const totalSize = useMemo(() => items.reduce((sum, item) => sum + item.size, 0), [items]);

  const addFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setStatus('No image files were found in that selection. Please choose JPG, PNG or WebP files.');
      return;
    }
    const added: ImageItem[] = [];
    for (const file of imageFiles) {
      const url = URL.createObjectURL(file);
      try {
        const [dataUrl, dimensions] = await Promise.all([readAsDataUrl(file), loadDimensions(url)]);
        added.push({
          id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          url,
          dataUrl,
          width: dimensions.width,
          height: dimensions.height,
          size: file.size,
          type: file.type,
        });
      } catch {
        URL.revokeObjectURL(url);
      }
    }
    if (added.length > 0) {
      setItems((current) => [...current, ...added]);
      setStatus(
        `Added ${added.length} image${added.length === 1 ? '' : 's'}. Review the order, choose a page size, then convert.`,
      );
    }
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setItems(next);
  };

  const removeItem = (id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    setItems([]);
    setStatus('All images cleared. Add new images whenever you are ready.');
  };

  const convertToPdf = () => {
    if (items.length === 0) return;
    setIsConverting(true);
    setStatus('Building your PDF…');
    try {
      const marginMm = Number(margin);
      const pageDims = (item: ImageItem): { pageWidth: number; pageHeight: number; orientation: 'portrait' | 'landscape' } => {
        const isLandscape = item.width > item.height;
        let pageWidth: number;
        let pageHeight: number;
        if (pageSize === 'fit') {
          pageWidth = (item.width / 96) * 25.4 + marginMm * 2;
          pageHeight = (item.height / 96) * 25.4 + marginMm * 2;
        } else if (pageSize === 'a4') {
          pageWidth = isLandscape ? 297 : 210;
          pageHeight = isLandscape ? 210 : 297;
        } else {
          pageWidth = isLandscape ? 279 : 216;
          pageHeight = isLandscape ? 216 : 279;
        }
        return {
          pageWidth,
          pageHeight,
          orientation: pageWidth > pageHeight ? 'landscape' : 'portrait',
        };
      };

      const firstDims = pageDims(items[0]);
      const doc = new JsPDF({
        orientation: firstDims.orientation,
        unit: 'mm',
        format: [firstDims.pageWidth, firstDims.pageHeight],
      });

      items.forEach((item, index) => {
        const { pageWidth, pageHeight, orientation } = pageDims(item);
        if (index > 0) doc.addPage([pageWidth, pageHeight], orientation);

        const usableWidth = Math.max(10, pageWidth - marginMm * 2);
        const usableHeight = Math.max(10, pageHeight - marginMm * 2);
        const scale = Math.min(usableWidth / item.width, usableHeight / item.height);
        const drawWidth = item.width * scale;
        const drawHeight = item.height * scale;
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;
        const format: 'PNG' | 'WEBP' | 'JPEG' =
          item.type === 'image/png' ? 'PNG' : item.type === 'image/webp' ? 'WEBP' : 'JPEG';
        doc.addImage(item.dataUrl, format, x, y, drawWidth, drawHeight);
      });

      doc.save('images.pdf');
      setStatus(
        `Done — your PDF with ${items.length} page${items.length === 1 ? '' : 's'} has been downloaded as images.pdf.`,
      );
    } catch {
      setStatus('Something went wrong while building the PDF. Try fewer or smaller images and convert again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'Image to PDF Converter', href: '/image-to-pdf-converter' }]} />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Image to PDF Converter</h1>
        <p className="text-muted-foreground leading-relaxed">
          Turn JPG, PNG and WebP images into one tidy, print-ready PDF — in the order you choose, on
          A4 or Letter pages, with margins you control. It is built for everyday jobs that used to
          mean emailing yourself a pile of separate photos: a scanned form, a set of ID copies, a
          portfolio or a family album that needs to travel as a single file.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Everything runs entirely in your browser. Your images are never uploaded to a server, so
          private documents stay on your own device from the first click to the finished download.
        </p>
      </header>

      <Card className="p-5 sm:p-6">
        <div className="space-y-6">
          <div
            role="button"
            tabIndex={0}
            aria-label="Add images"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              void addFiles(event.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60'
            }`}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Drop images here, or click to browse</p>
            <p className="text-sm text-muted-foreground">
              JPG, PNG and WebP files are welcome. Add as many as you need — each image becomes one
              page, and you can add more in batches without starting again.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) void addFiles(event.target.files);
                event.target.value = '';
              }}
            />
          </div>

          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <Images className="h-5 w-5" /> Your pages, in order
                </h2>
                <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-1.5 h-4 w-4" /> Clear all
                </Button>
              </div>
              <ul className="divide-y rounded-lg border">
                {items.map((item, index) => (
                  <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        Page {index + 1}: {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.width} × {item.height} px · {formatBytes(item.size)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Move ${item.name} up`}
                        disabled={index === 0}
                        onClick={() => moveItem(index, -1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Move ${item.name} down`}
                        disabled={index === items.length - 1}
                        onClick={() => moveItem(index, 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="page-size">Page size</Label>
              <Select value={pageSize} onValueChange={(value) => setPageSize(value as PageSize)}>
                <SelectTrigger id="page-size" className="w-full">
                  <SelectValue placeholder="Choose a page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 — 210 × 297 mm</SelectItem>
                  <SelectItem value="letter">Letter — 216 × 279 mm</SelectItem>
                  <SelectItem value="fit">Fit to image — no fixed page</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Orientation is automatic: wide images get landscape pages and tall images get
                portrait pages when you pick A4 or Letter.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin-size">Margins</Label>
              <Select value={margin} onValueChange={(value) => setMargin(value as MarginSize)}>
                <SelectTrigger id="margin-size" className="w-full">
                  <SelectValue placeholder="Choose margins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None — fill the usable page</SelectItem>
                  <SelectItem value="10">Small — 10 mm</SelectItem>
                  <SelectItem value="20">Medium — 20 mm</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                A small margin is a safe default for home printers, which rarely print right to the
                edge of the sheet.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0" />
              <span>
                {items.length} page{items.length === 1 ? '' : 's'} · Estimated output size: about{' '}
                {formatBytes(totalSize)} (estimate based on your source files — the finished PDF is
                usually close to, and often a little smaller than, the combined image sizes)
              </span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0" /> No upload — processed on this device
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={items.length === 0 || isConverting}
            onClick={convertToPdf}
          >
            <Download className="mr-2 h-5 w-5" />
            {isConverting ? 'Building PDF…' : 'Convert to PDF and download images.pdf'}
          </Button>
          {status && (
            <p className="text-sm text-muted-foreground" role="status">
              {status}
            </p>
          )}
        </div>
      </Card>

      <AdSlot id="image-to-pdf-converter-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <p className="leading-relaxed text-muted-foreground">
          The converter follows the same simple logic a print shop would. First, add your images by
          dropping them onto the panel above or browsing for them. The tool reads each file locally,
          notes its pixel dimensions and shows you a thumbnail, so you can confirm you picked the
          right scan or photo before anything is built. Second, arrange the list. The order on
          screen is the order in the PDF, from page 1 onwards, so put a cover sheet, a signed form
          or the front of an ID card exactly where a reader expects to find it.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Third, choose a page size and margin. For A4 and Letter, the converter looks at each
          image&apos;s shape and picks portrait or landscape for that page automatically — a wide
          group photograph is never squeezed sideways onto a tall page, and a tall scanned letter
          is never shrunk to fit a wide one. Every image is then scaled to fit inside your chosen
          margins while keeping its original aspect ratio, and centred on the page, so nothing is
          stretched, cropped or distorted. Finally, press the convert button: the pages are written
          into a single PDF file called images.pdf and downloaded straight to your device, ready to
          print, email or upload to a portal that asks for one combined document.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Who uses it, and for what</h2>
        <p className="leading-relaxed text-muted-foreground">
          Scanned documents are the most common job. Many home scanners and phone scanning apps save
          each page as a separate JPG, yet schools, employers, banks and government portals usually
          insist on one PDF containing every page. Adding the pages here, in reading order, solves
          that mismatch in a minute. The same applies to ID documents: a front and back of a driving
          licence, a passport photo page and a proof-of-address letter become one clean file instead
          of three loose attachments with confusing camera filenames.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Photo albums are the second big use. A birthday, a school trip or a house renovation
          photographed step by step is far easier to share as one PDF than as forty separate images
          that arrive out of order in a chat thread. Choose Fit to image so each page matches the
          photo itself, and relatives can flick through the album on any device without a special
          app. Creatives use it for portfolios, too: designers, photographers and illustrators drop
          in finished pieces, add a cover image first, and send clients a single tidy file that
          looks deliberate on screen and on paper. Students and teachers use it to bundle worksheet
          photos, whiteboard snapshots and handwritten homework into one submission, and small
          businesses use it to combine product photos, invoices and delivery notes for a customer or
          an accountant.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Features and specifications</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y">
              <tr>
                <th className="px-4 py-3 font-medium">Accepted inputs</th>
                <td className="px-4 py-3 text-muted-foreground">
                  JPG and JPEG, PNG, and WebP images, added singly, in batches or by drag and drop
                </td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium">Page sizes</th>
                <td className="px-4 py-3 text-muted-foreground">
                  A4 at 210 × 297 mm, Letter at 216 × 279 mm, or Fit to image with a page matched to
                  each picture
                </td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium">Margins</th>
                <td className="px-4 py-3 text-muted-foreground">
                  None, Small at 10 mm, or Medium at 20 mm, applied evenly on all four sides
                </td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium">Orientation</th>
                <td className="px-4 py-3 text-muted-foreground">
                  Automatic per page for A4 and Letter, chosen from each image&apos;s width and height
                </td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium">Page order</th>
                <td className="px-4 py-3 text-muted-foreground">
                  Move any image up or down, remove single images, or clear the whole list and start
                  again
                </td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium">Output</th>
                <td className="px-4 py-3 text-muted-foreground">
                  One PDF named images.pdf, one image per page, scaled to fit and centred with its
                  proportions preserved
                </td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium">Privacy</th>
                <td className="px-4 py-3 text-muted-foreground">
                  Processing happens entirely in your browser — images are never uploaded, stored or
                  sent to a server
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          A note on print quality and DPI: a PDF page is measured in millimetres, but sharpness comes
          from the pixels in your original image. An A4 page printed at 150 DPI needs roughly 1,240 ×
          1,754 pixels, and a truly crisp 300 DPI print needs about 2,480 × 3,508 pixels. Most modern
          phone cameras comfortably exceed the 150 DPI mark for A4, which looks sharp at normal
          reading distance. Small web images and screenshots still convert perfectly well — they will
          simply look softer if printed very large, so keep the original file whenever print quality
          matters.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Practical tips for a better PDF</h2>
        <p className="leading-relaxed text-muted-foreground">
          Start from the best original you have. If a document was shared with you through a messaging
          app, ask for the original file instead, because those apps usually shrink photos before
          sending them. Photograph paper documents in bright, even light, square-on to the page, and
          check each thumbnail here for glare or a thumb in the corner before you convert — rebuilding
          takes seconds, but only if you spot the problem while the paper is still in front of you.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Match the settings to the destination. Sending a form to an office that will print it? Pick
          the paper size that office actually uses — A4 in most of the world, Letter in the United
          States and Canada — and keep at least a small 10 mm margin so no home printer clips the
          edges. Sharing photos on screen only? Fit to image avoids empty white borders entirely.
          Name your pages by ordering deliberately: put the most important page first, because many
          portals preview only the first page, and a reader who sees a blank or upside-down opening
          page may assume the whole file is wrong. Finally, open the downloaded images.pdf once before
          you send it anywhere. A ten-second check of page order, orientation and legibility is the
          cheapest insurance against a rejected application or a confused client.
        </p>
      </section>

      <AdSlot id="image-to-pdf-converter-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border px-4 py-3">
              <dt className="font-medium">{faq.question}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
    </div>
  );
}
