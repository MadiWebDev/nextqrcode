'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileImage } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

export default function QRImageMetadataAuditorPage() {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [fields, setFields] = useState<Array<{ k: string; v: string; risk: string }>>([]);
  const [note, setNote] = useState('Choose an image file to audit it.');
  const [copied, setCopied] = useState(false);
  const readStr = (dv: DataView, off: number, len: number) => {
    let s = '';
    for (let i = 0; i < len; i++) s += String.fromCharCode(dv.getUint8(off + i));
    return s;
  };
  const parseExif = (buf: ArrayBuffer): Array<{ k: string; v: string; risk: string }> => {
    const out: Array<{ k: string; v: string; risk: string }> = [];
    const dv = new DataView(buf);
    if (dv.getUint16(0) !== 0xffd8) return out;
    let off = 2;
    while (off + 4 < dv.byteLength) {
      if (dv.getUint8(off) !== 0xff) break;
      const marker = dv.getUint8(off + 1);
      const len = dv.getUint16(off + 2);
      if (marker === 0xe1 && len > 6 && readStr(dv, off + 4, 6) === 'Exif\0\0') {
        const tiff = off + 10;
        const le = dv.getUint16(tiff) === 0x4949;
        const get16 = (o: number) => dv.getUint16(o, le);
        const get32 = (o: number) => dv.getUint32(o, le);
        const ifd0 = tiff + get32(tiff + 4);
        const names: Record<number, string> = {
          271: 'Camera make',
          272: 'Camera model',
          305: 'Software',
          306: 'Date taken',
          274: 'Orientation',
          282: 'X resolution',
          283: 'Y resolution',
          315: 'Artist',
          33432: 'Copyright',
          34853: 'GPS data (see GPS block)',
          34665: 'EXIF block',
        };
        const risks: Record<number, string> = {
          271: 'Device make can identify your phone model.',
          272: 'Device model can identify your phone model.',
          305: 'Software version can aid fingerprinting.',
          306: 'Date and time can reveal when you were somewhere.',
          315: 'Author name may be personal.',
          33432: 'Copyright text may contain a name.',
          34853: 'Location data is the highest privacy risk.',
        };
        const count = get16(ifd0);
        let gpsPtr = -1;
        let exifPtr = -1;
        for (let i = 0; i < count; i++) {
          const e = ifd0 + 2 + i * 12;
          const tag = get16(e);
          const type = get16(e + 2);
          const cnt = get32(e + 4);
          if (tag === 34853) {
            gpsPtr = tiff + get32(e + 8);
            continue;
          }
          if (tag === 34665) {
            exifPtr = tiff + get32(e + 8);
            continue;
          }
          if (!names[tag]) continue;
          const sizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
          const bytes = cnt * (sizes[type] || 1);
          const vo = bytes <= 4 ? e + 8 : tiff + get32(e + 8);
          let v = '';
          if (type === 2) v = readStr(dv, vo, cnt).replace(/\0+$/, '');
          else if (type === 3) v = String(get16(vo));
          else if (type === 4) v = String(get32(vo));
          out.push({ k: names[tag], v, risk: risks[tag] || '' });
        }
        if (exifPtr > 0) {
          const c2 = get16(exifPtr);
          for (let i = 0; i < c2; i++) {
            const e = exifPtr + 2 + i * 12;
            const tag = get16(e);
            const cnt = get32(e + 4);
            if (tag === 36867 || tag === 36868) {
              const bytes = cnt;
              const vo = bytes <= 4 ? e + 8 : tiff + get32(e + 8);
              out.push({
                k: tag === 36867 ? 'Date taken (original)' : 'Date digitised',
                v: readStr(dv, vo, cnt).replace(/\0+$/, ''),
                risk: 'Date and time can reveal when you were somewhere.',
              });
            }
          }
        }
        if (gpsPtr > 0) {
          const c3 = get16(gpsPtr);
          const gps: Record<number, string> = {};
          for (let i = 0; i < c3; i++) {
            const e = gpsPtr + 2 + i * 12;
            const tag = get16(e);
            const type = get16(e + 2);
            const cnt = get32(e + 4);
            const sizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8 };
            const bytes = cnt * (sizes[type] || 1);
            const vo = bytes <= 4 ? e + 8 : tiff + get32(e + 8);
            if (type === 2) gps[tag] = readStr(dv, vo, cnt).replace(/\0+$/, '');
            else if (type === 5 && cnt >= 1) {
              const num = dv.getUint32(vo, le) / (dv.getUint32(vo + 4, le) || 1);
              const num2 = dv.getUint32(vo + 8, le) / (dv.getUint32(vo + 12, le) || 1);
              const num3 = dv.getUint32(vo + 16, le) / (dv.getUint32(vo + 20, le) || 1);
              gps[tag] = (num + num2 / 60 + num3 / 3600).toFixed(6);
            }
          }
          if (gps[2] && gps[4]) {
            const lat = (gps[1] === 'S' ? -1 : 1) * parseFloat(gps[2]);
            const lon = (gps[3] === 'W' ? -1 : 1) * parseFloat(gps[4]);
            out.push({
              k: 'GPS coordinates',
              v: lat.toFixed(6) + ', ' + lon.toFixed(6),
              risk: 'Precise location where the photo was taken. Remove before sharing.',
            });
          }
          if (gps[6])
            out.push({
              k: 'GPS altitude',
              v: gps[6],
              risk: 'Altitude adds precision to the location.',
            });
        }
      }
      if (marker === 0xda) break;
      off += 2 + len;
    }
    return out;
  };
  const parsePng = (buf: ArrayBuffer): Array<{ k: string; v: string; risk: string }> => {
    const out: Array<{ k: string; v: string; risk: string }> = [];
    const dv = new DataView(buf);
    const bytes = new Uint8Array(buf);
    if (bytes[0] !== 0x89 || bytes[1] !== 0x50) return out;
    let off = 8;
    while (off + 8 < dv.byteLength) {
      const len = dv.getUint32(off);
      const type = readStr(dv, off + 4, 4);
      if (type === 'tEXt' || type === 'zTXt') {
        const raw = readStr(dv, off + 8, Math.min(len, 2000));
        const nul = raw.indexOf('\0');
        if (nul > 0)
          out.push({
            k: 'PNG text: ' + raw.slice(0, nul),
            v: raw.slice(nul + 1),
            risk: 'Text chunks can carry author names, software, or notes.',
          });
      }
      if (type === 'eXIf')
        out.push({
          k: 'PNG EXIF block',
          v: 'Present (' + len + ' bytes)',
          risk: 'EXIF inside PNG can carry the same fields as JPEG EXIF.',
        });
      if (type === 'IEND') break;
      off += 12 + len;
    }
    return out;
  };
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    setFileSize(f.size);
    setFileType(f.type || 'unknown');
    const buf = await f.arrayBuffer();
    const found = f.type === 'image/png' ? parsePng(buf) : parseExif(buf);
    setFields(found);
    setNote(
      found.length
        ? 'Metadata found in this file. Review the warnings before sharing it.'
        : 'No EXIF or PNG text metadata was found in this file. That does not prove it is clean — some tools store metadata elsewhere — but this file carries none of the common fields.'
    );
  };
  const warnings = fields.filter((f) => f.risk);
  const copyReport = async () => {
    const txt = [
      'Image metadata audit',
      'File: ' + fileName,
      'Size: ' + fileSize + ' bytes',
      'Type: ' + fileType,
      '',
      ...fields.map((f) => f.k + ': ' + f.v + (f.risk ? ' — ' + f.risk : '')),
    ].join('\n');
    await navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'Does this auditor upload my image?',
      answer:
        'No. The file is read in your browser with the File API and parsed locally. Nothing leaves your device.',
    },
    {
      question: 'My QR image shows no metadata. Is it safe to share?',
      answer:
        'It carries none of the common EXIF or PNG text fields, which is a good sign. It is not a proof that no tool anywhere stored extra data, so keep sensitive originals private.',
    },
    {
      question: 'What is EXIF?',
      answer:
        'EXIF is a metadata block inside JPEG files that can record camera make and model, date and time, software, and GPS coordinates.',
    },
    {
      question: 'How do I remove metadata before sharing?',
      answer:
        'Use a metadata-stripping tool or re-export the image without metadata, then re-run this auditor to confirm the fields are gone.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Image Metadata Auditor',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
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
          { label: 'QR Image Metadata Auditor', href: '/qr-image-metadata-auditor' },
        ]}
      />

      <AdSlot id="qr-image-metadata-auditor-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <FileImage className="w-3.5 h-3.5" />
          <span>Privacy Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Image Metadata Auditor
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Upload a QR image file and see the metadata actually stored inside it — camera, date,
          software, GPS — with a plain-language privacy warning for each field.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Upload the image</h2>
            <div className="space-y-2">
              <Label htmlFor="imgfile">QR image file (JPEG or PNG)</Label>
              <Input
                id="imgfile"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Everything runs in your browser. The file is read locally and is never uploaded.
            </p>
            {fileName && (
              <div className="text-xs space-y-1">
                <p>
                  <span className="font-semibold">File:</span> {fileName}
                </p>
                <p>
                  <span className="font-semibold">Size:</span> {fileSize.toLocaleString()} bytes
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {fileType}
                </p>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={copyReport} disabled={!fileName}>
              {copied ? 'Copied!' : 'Copy audit report'}
            </Button>
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm text-muted-foreground">{note}</p>
            {fields.length > 0 && (
              <div className="space-y-2">
                {fields.map((f, i) => (
                  <div key={i} className="rounded-lg border border-border/70 p-3">
                    <p className="font-semibold text-sm">{f.k}</p>
                    <p className="text-xs break-all font-mono">{f.v}</p>
                    {f.risk && <p className="text-xs text-amber-700 mt-1">Warning: {f.risk}</p>}
                  </div>
                ))}
              </div>
            )}
            {fileName && (
              <p className="text-sm font-semibold">
                {warnings.length} field(s) carry a privacy warning.
              </p>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="qr-image-metadata-auditor-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          What Is Hiding Inside a QR Image File
        </h2>
        <p className="text-base leading-relaxed">
          A QR image is not just black and white modules. JPEG files can carry an EXIF block with
          the camera make and model, the date and time, the software that saved the file, and — most
          sensitively — GPS coordinates. PNG files can carry text chunks with author names,
          software, or notes. This auditor parses the actual bytes of the file you upload and lists
          the fields it finds, so you can decide whether the file is safe to share.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Why GPS metadata matters most</h3>
        <p className="text-base leading-relaxed">
          GPS coordinates in a photo can reveal where the photo was taken to within a few metres — a
          home, a school, a clinic, or a workplace. That is why this auditor flags GPS first and
          loudest. If you see coordinates here, strip the metadata before posting the image anywhere
          public. The same applies to the date and time: combined with a location, a timestamp can
          reveal when someone was somewhere.
        </p>

        <AdSlot id="qr-image-metadata-auditor-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">
          What this auditor can and cannot see
        </h3>
        <p className="text-base leading-relaxed">
          It reads the standard EXIF fields in JPEG files (camera, software, dates, GPS) and the
          text and EXIF chunks in PNG files. It does not read proprietary maker-note blocks in full,
          and it cannot see metadata that a tool stored outside the image file itself. A clean
          result here means none of the common fields were present — a good sign, but not a
          guarantee for files that passed through unusual tools.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Before sharing a QR image publicly, run it through this auditor.</li>
          <li>
            If GPS or a date is present, strip the metadata or re-export the image without it.
          </li>
          <li>
            Keep the original file with metadata only in a private folder, not in a shared album.
          </li>
          <li>Re-check after editing: some editors re-add software or date fields on save.</li>
        </ul>
      </article>

      <AdSlot id="qr-image-metadata-auditor-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {faqs.map((faq, i) => (
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

      <AdSlot id="qr-image-metadata-auditor-bottom" format="horizontal-banner" />

    </div>
  );
}
