'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PawPrint } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

const FIELDS: Array<{ key: string; label: string; ph: string; kind: string; options?: string[] }> =
  [
    { key: 'petName', label: 'Pet name', ph: 'Biscuit', kind: 'text' },
    { key: 'breed', label: 'Breed', ph: 'Beagle mix', kind: 'text' },
    { key: 'age', label: 'Age', ph: '2 years', kind: 'text' },
    { key: 'sex', label: 'Sex', ph: '', kind: 'select', options: ['Female', 'Male', 'Unknown'] },
    { key: 'shelterName', label: 'Shelter or rescue', ph: 'Riverside Animal Rescue', kind: 'text' },
    {
      key: 'adoptionUrl',
      label: 'Adoption page URL',
      ph: 'https://example.com/adopt/biscuit',
      kind: 'text',
    },
    {
      key: 'description',
      label: 'About this pet',
      ph: 'Gentle, curious, and great with kids.',
      kind: 'textarea',
    },
  ];

const DEFAULTS = {
  petName: '',
  breed: '',
  age: '',
  sex: 'Female',
  shelterName: '',
  adoptionUrl: '',
  description: '',
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

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const error = useMemo(() => {
    const f = form;
    if (!(f.petName || '').trim()) return 'Enter the pet name.';
    if (!(f.breed || '').trim()) return 'Enter the breed.';
    if (!isValidUrl(f.adoptionUrl || ''))
      return 'Enter a valid adoption page URL starting with https://.';
    return '';
  }, [form]);

  const payload = useMemo(() => {
    const f = form;
    if (error) return '';
    return f.adoptionUrl;
  }, [form, error]);

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
    a.download = 'pet-adoption-qr-generator.png';
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
    a.download = 'pet-adoption-qr-generator.svg';
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
      question: 'What does the QR code actually contain?',
      answer:
        'It contains the adoption page URL for this pet, exactly as shown in the encoded payload box. The name, breed, and description are shown in the preview and belong on the adoption page itself.',
    },
    {
      question: 'How is this different from a pet tag QR code?',
      answer:
        'A pet tag code is for lost-and-found: it helps someone who finds a pet contact the owner. This code is for adoption: it helps someone meet a shelter pet and start an application.',
    },
    {
      question: 'What should I do when the pet is adopted?',
      answer:
        'Take the code down and update the adoption page to say the pet has found a home. A printed code keeps working until it is removed, so stale adoption codes are the most common mistake with this tool.',
    },
    {
      question: 'Can I put this code on a kennel card?',
      answer:
        "Yes. Print the pet's name, breed, and one honest line about temperament in plain text beside the code, so the card works even for visitors who do not scan.",
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pet Adoption QR Generator',
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
          { label: 'Pet Adoption QR Generator', href: '/pet-adoption-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <PawPrint className="w-3.5 h-3.5" />
          <span>Animal Rescue QR Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Pet Adoption QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create a QR code for a pet adoption profile, plus an adoption card with the pet&apos;s
          name, breed, and shelter link.
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
              The QR encodes the adoption page URL for this pet. The name, breed, and description
              are shown in the preview here and belong on the adoption page itself.
            </p>
            <Button variant="outline" size="sm" onClick={copyPayload} disabled={!payload}>
              {copied ? 'Copied!' : 'Copy payload'}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-primary/30 bg-card shadow-md space-y-5">
            <h2 className="text-lg font-bold">Pet Adoption QR</h2>
            <p className="text-sm text-muted-foreground">Scan to meet this pet</p>
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
            <h2 className="text-lg font-bold">Adoption profile card</h2>
            <p className="text-sm text-muted-foreground">What potential adopters see.</p>
            <div className="rounded-xl bg-white p-4 border text-slate-900">
              <p className="text-2xl font-bold">{form.petName || 'Pet name'}</p>
              <p className="mt-1 text-sm text-slate-600">
                {form.breed || 'Breed'} · {form.age || 'Age'} · {form.sex}
              </p>
              {form.shelterName && (
                <p className="mt-1 text-sm text-slate-600">Shelter: {form.shelterName}</p>
              )}
              {form.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{form.description}</p>
              )}
              <p className="mt-3 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Scan to adopt
              </p>
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

      {/* After-tool AdSlot */}
      <AdSlot id="pet-adoption-qr-generator-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How to use the Pet Adoption QR Generator
        </h2>
        <h3 className="text-xl font-semibold text-foreground">One code per pet</h3>
        <p className="text-base leading-relaxed">
          A pet adoption code turns a kennel card, an event poster, or a social post into a direct
          route to one animal&apos;s profile. The scan opens that pet&apos;s adoption page, where
          the adopter can read the full story and start an application. Generate one code per pet,
          and use the profile URL for that specific animal, not the shelter homepage. An adopter who
          lands on a homepage has to search again, and many will not bother.
        </p>

        {/* In-content AdSlot */}
        <AdSlot id="pet-adoption-qr-generator-in-content" format="in-article" />

        <h3 className="text-xl font-semibold text-foreground">Write the card for the adopter</h3>
        <p className="text-base leading-relaxed">
          The name, breed, age, and one honest line about temperament are what make someone stop and
          scan. Say what the pet is actually like, including the awkward parts: needs a garden, shy
          with strangers, not good with cats. Honest cards get fewer but better applications, and
          they keep animals from being returned. Update or remove the code the moment a pet is
          adopted, so nobody falls in love with an animal who already has a home.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Testing before you print</h3>
        <p className="text-base leading-relaxed">
          Print a sample at the real size and scan it with two different phones. Confirm the
          adoption page that opens is the right pet, with the right photos and the right application
          form. Keep the quiet zone around the code and print dark modules on a light background
          with strong contrast. At adoption events, test under the actual lighting, and keep a spare
          card for every pet.
        </p>
      </article>

      {/* Pre-related AdSlot */}
      <AdSlot id="pet-adoption-qr-generator-pre-related" format="horizontal-banner" />

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

      {/* Bottom AdSlot */}
      <AdSlot id="pet-adoption-qr-generator-bottom" format="horizontal-banner" />
    </div>
  );
}
