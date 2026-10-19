'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { User } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'firstName', label: 'First name', ph: 'Alex', kind: 'text' },
    { key: 'lastName', label: 'Last name', ph: 'Rivera', kind: 'text' },
    { key: 'org', label: 'Organisation', ph: 'Rivera Design Studio', kind: 'text' },
    { key: 'jobTitle', label: 'Job title', ph: 'Designer', kind: 'text' },
    { key: 'phone', label: 'Phone', ph: '+1 555 010 1234', kind: 'text' },
    { key: 'email', label: 'Email', ph: 'alex@example.com', kind: 'text' },
    { key: 'website', label: 'Website', ph: 'https://example.com', kind: 'text' },
  ];

const DEFAULTS = {
  firstName: '',
  lastName: '',
  org: '',
  jobTitle: '',
  phone: '',
  email: '',
  website: '',
};

function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function inputTypeFor(kind: string) {
  if (kind === 'number' || kind === 'date' || kind === 'datetime-local') return kind;
  return 'text';
}

export default function Page() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [qrUrl, setQrUrl] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [copied, setCopied] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [photoNote, setPhotoNote] = useState('');
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoNote('Choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 240;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoDataUrl(dataUrl);
        setPhotoBase64(dataUrl.split(',')[1] || '');
        setPhotoNote('Photo resized for the QR payload. It never leaves this browser.');
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  };
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.firstName || '').trim() && !(f.lastName || '').trim())
      return 'Enter a first or last name.';
    if ((f.email || '').trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email || ''))
      return 'Enter a valid email address.';
    if ((f.website || '').trim() && !isValidUrl(f.website || ''))
      return 'Enter a valid website URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + (f.lastName || '') + ';' + (f.firstName || '') + ';;;',
      'FN:' + ((f.firstName || '') + ' ' + (f.lastName || '')).trim(),
    ];
    if (f.org) lines.push('ORG:' + f.org);
    if (f.jobTitle) lines.push('TITLE:' + f.jobTitle);
    if (f.phone) lines.push('TEL;TYPE=CELL:' + f.phone);
    if (f.email) lines.push('EMAIL:' + f.email);
    if (f.website) lines.push('URL:' + f.website);
    if (photoBase64) lines.push('PHOTO;ENCODING=b;TYPE=JPEG:' + photoBase64);
    lines.push('END:VCARD');
    return lines.join('\n');
  }, [form, error, photoBase64]);

  useEffect(() => {
    let live = true;
    if (!payload) return;
    QRCodeLib.toDataURL(payload, { width: 512, margin: 2, errorCorrectionLevel: 'M' })
      .then((u) => {
        if (live) setQrUrl(u);
      })
      .catch(() => {
        if (live) setQrUrl('');
      });
    return () => {
      live = false;
    };
  }, [payload]);

  const downloadPng = () => {
    if (!payload || !qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'vcard-photo-qr-generator.png';
    a.click();
  };
  const downloadSvg = async () => {
    if (!payload) return;
    const svg = await QRCodeLib.toString(payload, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vcard-photo-qr-generator.svg';
    a.click();
    URL.revokeObjectURL(url);
  };
  const copyPayload = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What happens when someone scans this QR code?',
      answer:
        "Scanning opens the phone's contact import screen with the name, organisation, phone, email, website, and photo already filled in. The scanner reviews the contact before saving it, so nothing is saved silently.",
    },
    {
      question: 'Why is my photo resized?',
      answer:
        'A full-size photo would make the QR payload so long that the code becomes too dense to scan reliably. The tool resizes the photo to at most 240 pixels on its longest side and compresses it as JPEG, which keeps the code printable at card size.',
    },
    {
      question: 'Is my photo uploaded anywhere?',
      answer:
        'No. The photo is read and resized entirely in your browser and embedded into the vCard payload locally. This page never sends the photo to a server.',
    },
    {
      question: "What if the scanner's phone does not show the photo?",
      answer:
        'Most modern phones import the PHOTO field from a vCard 3.0 code. A few older address books ignore it. The name, phone, and email still import normally, so the contact is never lost, only the photo.',
    },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'vCard Photo QR Generator',
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
          { label: 'vCard Photo QR Generator', href: '/vcard-photo-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <User className="w-3.5 h-3.5" />
          <span>Contact QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          vCard Photo QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a vCard QR code with your headshot photo embedded, plus a printable contact card
          preview, so people save your face along with your number.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold">Enter the details</h2>
            {FIELDS.map((fd) => (
              <div key={fd.key} className="space-y-2">
                <Label htmlFor={fd.key}>{fd.label}</Label>
                {fd.kind === 'textarea' ? (
                  <textarea
                    id={fd.key}
                    value={form[fd.key] || ''}
                    onChange={(e) => set(fd.key, e.target.value)}
                    placeholder={fd.ph}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                ) : fd.kind === 'select' ? (
                  <select
                    id={fd.key}
                    value={form[fd.key] || ''}
                    onChange={(e) => set(fd.key, e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {(fd.options || []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={fd.key}
                    type={inputTypeFor(fd.kind)}
                    value={form[fd.key] || ''}
                    onChange={(e) => set(fd.key, e.target.value)}
                    placeholder={fd.ph}
                  />
                )}
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="photo">Headshot photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={handlePhoto} />
              {photoNote && <p className="text-xs text-muted-foreground">{photoNote}</p>}
              {photoDataUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPhotoDataUrl('');
                    setPhotoBase64('');
                    setPhotoNote('');
                  }}
                >
                  Remove photo
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label>QR preview size: {qrSize}px</Label>
              <Slider
                value={[qrSize]}
                min={140}
                max={320}
                step={10}
                onValueChange={([v]) => setQrSize(v)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </Card>

          <Card className="p-6 border-border/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold">Encoded payload</h2>
            <p className="text-xs text-muted-foreground">
              This is exactly what the QR code contains. Check it before printing.
            </p>
            <pre className="whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs font-mono">
              {payload || 'Fill in the fields above to generate the payload.'}
            </pre>
            <p className="text-xs text-muted-foreground">
              The vCard is version 3.0. The photo is stored as a PHOTO line with base64 JPEG data,
              resized to at most 240 pixels on its longest side to keep the code scannable.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Contact Card QR</h2>
            <p className="text-sm text-muted-foreground">Scan to save the contact with photo</p>
            <div className="rounded-xl bg-white p-4 text-center border">
              {payload && qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt="Generated QR code"
                  style={{ width: qrSize, height: qrSize }}
                  className="mx-auto"
                />
              ) : (
                <div
                  className="flex items-center justify-center text-sm text-muted-foreground"
                  style={{ height: qrSize }}
                >
                  Enter valid details to generate your QR code.
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadPng} disabled={!payload || !qrUrl} className="text-xs">
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={downloadSvg}
                disabled={!payload}
                className="text-xs"
              >
                Download SVG
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG is best for everyday printing. SVG stays sharp at poster and banner sizes.
            </p>
          </Card>

          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold">Contact card preview</h2>
            <p className="text-sm text-muted-foreground">What the printed card looks like.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <div className="flex items-center gap-4">
                {photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoDataUrl}
                    alt="Headshot preview"
                    className="h-20 w-20 rounded-full object-cover border"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-slate-100 text-2xl font-bold text-slate-500">
                    {((form.firstName || '').charAt(0) || '?').toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold">
                    {((form.firstName || '') + ' ' + (form.lastName || '')).trim() || 'Your name'}
                  </p>
                  <p className="text-sm text-slate-600">{form.jobTitle || 'Job title'}</p>
                  <p className="text-sm text-slate-600">{form.org || 'Organisation'}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-slate-700">
                {form.phone && <p>Phone: {form.phone}</p>}
                {form.email && <p>Email: {form.email}</p>}
                {form.website && <p>Web: {form.website}</p>}
                <p>
                  vCard payload: {payload.length} characters
                  {photoBase64 ? ' (includes photo)' : ' (no photo yet)'}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              {FIELDS.filter((fd) => (form[fd.key] || '').trim()).map((fd) => (
                <p key={fd.key} className="text-xs text-slate-700">
                  <span className="font-semibold">{fd.label}: </span>
                  {form[fd.key]}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <AdSlot id="vcard-photo-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the vCard Photo QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">Why add a photo</h3>
        <p className="text-base leading-relaxed">
          A plain vCard saves a name and a number. A vCard with a photo saves a face, which is what
          people actually remember after a conference, a market, or a first meeting. When the
          scanner imports the contact, the headshot appears in their address book next to your name,
          so your follow-up message is recognised instead of ignored. Use a clear, front-facing
          headshot with a plain background: the photo is resized small, so anything busy or distant
          turns to mush.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Keeping the code scannable</h3>
        <p className="text-base leading-relaxed">
          Photos make QR payloads much longer, and long payloads make dense codes that need a bigger
          print size and better contrast. This tool resizes your photo to at most 240 pixels on its
          longest side and compresses it as JPEG before embedding it. Print photo vCards at
          business-card size or larger, never as a tiny sticker, and always test-scan the printed
          card on two phones. If the code will live somewhere small, leave the photo out and use a
          plain vCard code instead.
        </p>
        <AdSlot id="vcard-photo-qr-generator-in-content" format="in-article" />
        <h3 className="text-xl font-semibold text-foreground">Privacy and consent</h3>
        <p className="text-base leading-relaxed">
          Only use a photo of yourself or of someone who has agreed to have it shared this way.
          Anyone who scans the code can save the photo and pass it on, so treat it as public once
          printed. The photo is processed entirely in your browser: it is resized locally and is
          never uploaded to a server by this page. Print the card, test it, and check the imported
          contact shows the right name, number, and photo before handing out a stack.
        </p>
      </article>

      <AdSlot id="vcard-photo-qr-generator-pre-related" format="horizontal-banner" />
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
      <AdSlot id="vcard-photo-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
