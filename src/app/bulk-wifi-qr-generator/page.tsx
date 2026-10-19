'use client';

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Wifi } from 'lucide-react';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';

export default function BulkWiFiQRGeneratorPage() {
  const [raw, setRaw] = useState(
    'Hotel-Guest | welcome-2024 | WPA\nHotel-Conference | conf-pass-88 | WPA\nHotel-Lobby |  | nopass'
  );
  const [items, setItems] = useState<Array<{ label: string; payload: string; dataUrl: string }>>(
    []
  );
  const [invalid, setInvalid] = useState<string[]>([]);
  const [parseError, setParseError] = useState('');
  const [busy, setBusy] = useState(false);

  const escapeWifi = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
  const parseRows = () => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const ok: Array<{ label: string; payload: string }> = [];
    const bad: string[] = [];
    lines.forEach((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const ssid = parts[0] || '';
      const password = parts[1] || '';
      const authRaw = (parts[2] || 'WPA').toUpperCase();
      const auth = authRaw === 'WEP' ? 'WEP' : authRaw === 'NOPASS' ? 'nopass' : 'WPA';
      if (!ssid) {
        bad.push(line);
        return;
      }
      if (auth !== 'nopass' && password.length < 8) {
        bad.push(line);
        return;
      }
      const payload =
        auth === 'nopass'
          ? `WIFI:T:nopass;S:${escapeWifi(ssid)};;`
          : `WIFI:T:${auth};S:${escapeWifi(ssid)};P:${escapeWifi(password)};;`;
      ok.push({ label: ssid, payload });
    });
    return { ok, bad };
  };

  const generate = async () => {
    setParseError('');
    const { ok, bad } = parseRows();
    setInvalid(bad);
    if (ok.length === 0) {
      setParseError('No valid rows found. Check the format and try again.');
      setItems([]);
      return;
    }
    if (ok.length > 500) {
      setParseError('Limit is 500 rows per batch. Split larger lists into multiple batches.');
      return;
    }
    setBusy(true);
    try {
      const out: Array<{ label: string; payload: string; dataUrl: string }> = [];
      for (const row of ok) {
        const dataUrl = await QRCodeLib.toDataURL(row.payload, {
          errorCorrectionLevel: 'M',
          width: 512,
          margin: 2,
        });
        out.push({ ...row, dataUrl });
      }
      setItems(out);
    } catch {
      setParseError('Generation failed. Check that every payload is valid and try again.');
    } finally {
      setBusy(false);
    }
  };
  const downloadZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();
    const seen = new Set<string>();
    items.forEach((it, i) => {
      const base =
        it.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60) || 'qr';
      let name = `${String(i + 1).padStart(3, '0')}-${base}.png`;
      let n = 1;
      while (seen.has(name)) {
        n += 1;
        name = `${String(i + 1).padStart(3, '0')}-${base}-${n}.png`;
      }
      seen.add(name);
      zip.file(name, it.dataUrl.split(',')[1], { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: 'What format do the rows need?',
      answer:
        'One row per line: SSID | password | auth, using the vertical bar as the separator. Auth is WPA, WEP, or nopass. WPA and WEP passwords need at least 8 characters; leave the password blank for nopass.',
    },
    {
      question: 'What payload does a WiFi QR code contain?',
      answer:
        'A WIFI: payload with the security type, network name, and password. Scanning it offers to join the network without typing anything, on phones that support WiFi QR codes.',
    },
    {
      question: 'Is it safe to print a WiFi password as a QR code?',
      answer:
        'Only with care: put codes where guests and staff can use them, never on street-facing glass, use an isolated guest network, rotate passwords on a schedule, and remove retired codes promptly.',
    },
    {
      question: 'Why give each branch or room its own password?',
      answer:
        'A single shared password means one leak compromises every site. Per-location passwords limit the blast radius, make rotation practical, and let you revoke one site without disrupting the others.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bulk WiFi QR Generator',
    applicationCategory: 'DesignApplication',
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
          { label: 'Bulk WiFi QR Generator', href: '/bulk-wifi-qr-generator' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Wifi className="w-3.5 h-3.5" />
          <span>Bulk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk WiFi QR Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate WiFi QR codes for many networks at once — hotel rooms, offices, branches — from
          pasted SSID rows, then download the batch as a ZIP of PNG files.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Paste your rows</h2>
            <p className="text-xs text-muted-foreground">
              One row per line: SSID | password | auth, using the | separator. Auth is WPA, WEP, or
              nopass. WPA/WEP passwords need at least 8 characters; leave the password blank for
              nopass.
            </p>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={10}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={busy}>
                {busy ? 'Generating…' : 'Generate QR codes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRaw(
                    'Hotel-Guest | welcome-2024 | WPA\nHotel-Conference | conf-pass-88 | WPA\nHotel-Lobby |  | nopass'
                  );
                }}
              >
                Load sample rows
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRaw('');
                  setItems([]);
                }}
              >
                Clear
              </Button>
            </div>
            {parseError && <p className="text-sm text-red-600">{parseError}</p>}
            {invalid.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                <p className="font-semibold text-amber-700">
                  {invalid.length} row(s) skipped — fix and re-generate:
                </p>
                <ul className="list-disc pl-5 mt-1 text-amber-800">
                  {invalid.slice(0, 10).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card className="p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Result
            </span>
            <p className="text-sm text-muted-foreground">
              {items.length > 0
                ? `${items.length} QR code(s) ready.`
                : 'Generate to see a preview grid and download a ZIP.'}
            </p>
            {items.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {items.slice(0, 12).map((it, i) => (
                    <div key={i} className="rounded-lg border p-2 text-center">
                      <img src={it.dataUrl} alt={it.label} className="w-full h-auto" />
                      <p className="text-[10px] text-muted-foreground truncate mt-1">{it.label}</p>
                    </div>
                  ))}
                </div>
                {items.length > 12 && (
                  <p className="text-xs text-muted-foreground">
                    Showing first 12 of {items.length}. The ZIP contains all of them.
                  </p>
                )}
                <Button onClick={downloadZip} className="w-full">
                  Download ZIP of PNGs
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          WiFi Codes for Every Room, Branch, and Floor
        </h2>
        <p className="text-base leading-relaxed">
          Typing a WiFi password from a card is a small humiliation everyone recognises: the long
          string, the ambiguous characters, the third failed attempt. A WiFi QR code removes it
          entirely — one scan joins the network. That is why hotels, offices, clinics, and cafes
          print them. The problem is scale: a hotel with two hundred rooms, or a company with thirty
          branches, needs a batch, not a one-off. Bulk generation takes a pasted table of networks
          and produces the whole set in one pass, with validation that catches short passwords and
          blank network names before they reach the printer.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          One network per line, honestly specified
        </h3>
        <p className="text-base leading-relaxed">
          Each line is a network name, a vertical bar, a password, and the security type. The tool
          requires at least eight characters for WPA and WEP passwords — the same floor the WiFi
          standard expects — and reports rows that fall short. For open networks, use nopass and
          leave the password blank. Special characters in names and passwords are escaped in the
          payload, so a network called Café-Guest or a password containing a semicolon still encodes
          correctly. Even so, prefer passwords without characters that guests will struggle to relay
          verbally, and keep each network&apos;s password distinct: a single shared password across
          all branches means one leak compromises every site.
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Security thinking for printed passwords
        </h3>
        <p className="text-base leading-relaxed">
          A WiFi QR code is a printed password, and it should be treated like one. Place codes where
          guests and staff can use them, not on street-facing glass where anyone passing by can join
          the network. Use a dedicated guest network, isolated from internal systems and printers,
          rather than the network your business runs on. Rotate guest passwords on a schedule, and
          reprint the affected codes when you do — the bulk tool makes that a minutes-long job. When
          a code is retired, remove the sign: an old code on a wall is a live credential, and people
          will keep scanning it long after you meant to revoke it.
        </p>
        <h3 className="text-xl font-semibold text-foreground">Before you print the batch</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Scan a sample code on iPhone and Android and confirm it joins the right network.</li>
          <li>
            Confirm the guest network is isolated from internal systems before printing any codes.
          </li>
          <li>
            Print one code per room or area from the ZIP and check the filename matches the
            location.
          </li>
          <li>Keep a copy of the source list somewhere safe — it contains live credentials.</li>
          <li>Split lists over 500 rows into multiple batches and label each ZIP.</li>
        </ul>
        <p className="text-base leading-relaxed">
          A WiFi code is a small courtesy with real security implications. Generate it in bulk,
          place it thoughtfully, and rotate it like the credential it is.
        </p>
      </article>
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
    </div>
  );
}
