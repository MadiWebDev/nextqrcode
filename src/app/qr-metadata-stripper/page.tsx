'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eraser, Download, Info, CheckCircle2 } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

interface StrippedInfo {
  name: string;
  originalSize: number;
  strippedSize: number;
  width: number;
  height: number;
  dataUrl: string;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} bytes`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

const FAQS = [
  {
    question: 'What metadata can a QR image carry?',
    answer:
      'A JPEG photo of a QR code can carry EXIF data (camera model, date, GPS location), thumbnails, colour profiles, and editing history. A PNG can carry text chunks, creation time, and colour profiles. A screenshot usually carries less, but it can still include colour and software information.',
  },
  {
    question: 'Does re-encoding through a canvas really remove metadata?',
    answer:
      'Yes for container metadata. Drawing an image to a canvas copies only the pixel grid; when the canvas is exported as a new PNG, the EXIF, XMP, thumbnail, and other metadata segments are not carried over, because they were never part of the pixels. The new file is a fresh PNG containing pixels plus a minimal header.',
  },
  {
    question: 'Will stripping change how the QR code looks or scans?',
    answer:
      'The pixels are copied at the original resolution, so the code itself is unchanged. The file size and colour profile may differ slightly. Always scan the stripped copy once before sharing it, as you should with any re-encoded image.',
  },
  {
    question: 'Is stripping metadata enough to make a photo private?',
    answer:
      'No. Metadata is only one leak. The photo itself may show faces, licence plates, screens, reflections, or location clues in the background. Crop or blur anything sensitive in the image itself, and remember that stripping cannot undo information visible in the pixels.',
  },
];

export default function QRMetadataStripperPage() {
  const [info, setInfo] = useState<StrippedInfo | null>(null);
  const [status, setStatus] = useState('');

  const handleFile = async (file: File) => {
    setStatus('Processing…');
    setInfo(null);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.drawImage(bitmap, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Re-encode failed');
      const dataUrl = URL.createObjectURL(blob);
      setInfo({
        name: file.name.replace(/\.[^.]+$/, '') + '-stripped.png',
        originalSize: file.size,
        strippedSize: blob.size,
        width: bitmap.width,
        height: bitmap.height,
        dataUrl,
      });
      setStatus('Done — the copy below is a fresh PNG built from pixels only.');
    } catch {
      setStatus('Could not process that file. Use a common image format (PNG, JPEG, or WebP).');
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Metadata Stripper',
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
          { label: 'QR Metadata Stripper', href: '/qr-metadata-stripper' },
        ]}
      />

      <AdSlot id="qr-metadata-stripper-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Eraser className="w-3.5 h-3.5" />
          <span>Privacy Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Metadata Stripper
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Strip EXIF and other container metadata from a QR image before you share it. The image is
          redrawn through a canvas in your browser and exported as a fresh PNG built from pixels
          only — nothing is uploaded.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Choose an image</h2>
            <div className="space-y-1.5">
              <Label htmlFor="strip-image">QR image file</Label>
              <input
                id="strip-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
            </div>
            {status && <p className="text-xs text-muted-foreground">{status}</p>}
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                What this tool honestly does: it rebuilds the image from pixels only, so the new PNG
                cannot contain the original file&apos;s EXIF, XMP, thumbnail, or colour-profile
                segments. It does not list the original metadata fields, because it never parses
                them — it discards the whole container. Check the image itself for visible sensitive
                content before sharing.
              </span>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-5 space-y-4">
          {info ? (
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Stripped copy</h2>
              <img
                src={info.dataUrl}
                alt="Stripped QR image preview"
                className="max-w-full max-h-64 mx-auto rounded-lg border"
              />
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-3 text-muted-foreground">Original file size</td>
                    <td className="py-2 font-semibold text-right">
                      {formatBytes(info.originalSize)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-3 text-muted-foreground">Stripped file size</td>
                    <td className="py-2 font-semibold text-right">
                      {formatBytes(info.strippedSize)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-3 text-muted-foreground">Dimensions kept</td>
                    <td className="py-2 font-semibold text-right">
                      {info.width} × {info.height} px
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-3 text-muted-foreground">Output format</td>
                    <td className="py-2 font-semibold text-right">PNG (fresh file)</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs flex gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Removed: EXIF, XMP, embedded thumbnail, colour profile, and all other container
                  metadata segments — the new file was built from pixels only.
                </span>
              </p>
              <Button asChild size="sm" className="w-full gap-1.5">
                <a href={info.dataUrl} download={info.name}>
                  <Download className="w-3.5 h-3.5" /> Download stripped PNG
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                Scan the stripped copy once before sharing it to confirm it still reads.
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                Choose an image to see its stripped copy and the before/after sizes here.
              </p>
            </Card>
          )}
        </div>
      </div>

      <AdSlot id="qr-metadata-stripper-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          What hides inside a QR image — and what stripping can and cannot fix
        </h2>
        <p className="text-base leading-relaxed">
          A QR code is a pattern of pixels, but the file that carries it can hold much more. A
          photograph taken on a phone often embeds EXIF data: the camera model, the date and time,
          and sometimes precise GPS coordinates. Editing software can add its own history, colour
          profiles, and thumbnail previews. A PNG exported from a design tool can carry text chunks
          naming the software, the author, or the creation time. None of this is visible in the
          image, which is exactly why it leaks: people share the picture they can see and forget the
          data riding along inside the file.
        </p>
        <p className="text-base leading-relaxed">
          Stripping works by refusing to copy the container. When this tool draws your image onto a
          canvas, it copies only the pixel grid — the colours of each point in the picture.
          Exporting that canvas as a new PNG produces a fresh file whose only contents are those
          pixels plus a minimal header. The EXIF block, the thumbnail, the XMP packet, and the
          colour profile are gone, not because they were individually deleted but because they were
          never part of the pixels and nothing carried them across. That is also why this tool does
          not print a list of the metadata it removed: it never parses the original metadata fields
          at all. It discards the whole container and says so plainly.
        </p>

        <AdSlot id="qr-metadata-stripper-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          The trade-offs are small but worth knowing. A re-encoded PNG may be larger or smaller than
          the original, and its colours may shift slightly if the original relied on a custom colour
          profile. The pixels themselves are copied at the original resolution, so the QR pattern is
          unchanged — but always scan the stripped copy before sharing it, because any re-encode
          deserves one verification pass. If you need a JPEG rather than a PNG for a specific
          workflow, convert the stripped PNG with your usual tool and strip again if that tool
          re-adds metadata.
        </p>
        <p className="text-base leading-relaxed">
          Stripping is necessary but not sufficient for privacy. The pixels themselves can give you
          away: faces, licence plates, screens, whiteboards, reflections in glass, street signs, and
          distinctive rooms all survive stripping untouched. If a photo of a QR code was taken in a
          sensitive place, the location may be obvious from the background even with GPS metadata
          removed. Crop the image to the code and its margin, blur or cover anything else, and
          consider whether a clean export of the code — rather than a photo of it — would serve
          better.
        </p>
        <p className="text-base leading-relaxed">
          For teams that publish QR artwork, the cleanest habit is to generate the code as a vector
          or PNG from a generator rather than photographing a screen or printout, and to strip any
          photo that must be shared. Make stripping part of the publishing checklist: generate,
          strip, scan the stripped copy, then share. It takes seconds, it runs entirely in the
          browser, and it removes a whole class of accidental disclosure.
        </p>
      </article>

      <AdSlot id="qr-metadata-stripper-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Metadata Stripping
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

      <AdSlot id="qr-metadata-stripper-bottom" format="horizontal-banner" />

    </div>
  );
}
