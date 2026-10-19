'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScanSearch, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import jsQR from 'jsqr';

interface Field {
  key: string;
  value: string;
}

interface Inspection {
  type: string;
  summary: string;
  fields: Field[];
  warnings: string[];
}

function classify(payload: string): Inspection {
  const text = payload.trim();
  const warnings: string[] = [];
  if (/^https?:\/\//i.test(text)) {
    let host = '';
    let params: Field[] = [];
    try {
      const u = new URL(text);
      host = u.hostname;
      params = Array.from(u.searchParams.entries()).map(([k, v]) => ({
        key: `Query: ${k}`,
        value: v,
      }));
      if (u.protocol !== 'https:')
        warnings.push('This URL uses plain HTTP, so data sent to it is not encrypted.');
      if (u.username || u.password)
        warnings.push(
          'This URL embeds credentials before the @ sign — the visible host may not be the real one.'
        );
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host))
        warnings.push(
          'The host is a raw IP address, which is unusual for a legitimate public link.'
        );
    } catch {
      warnings.push('This looks like a URL but does not parse — treat it as untrusted.');
    }
    return {
      type: 'URL / link',
      summary: host ? `Opens a web page on ${host}.` : 'Opens a web page.',
      fields: [
        { key: 'Full URL', value: text },
        ...(host ? [{ key: 'Host', value: host }] : []),
        ...params,
      ],
      warnings,
    };
  }
  if (/^WIFI:/i.test(text)) {
    const get = (k: string) => {
      const m = text.match(new RegExp(`${k}:([^;]*)`, 'i'));
      return m ? m[1] : '';
    };
    const auth = get('T');
    if (!auth) warnings.push('No authentication type found in this Wi-Fi payload.');
    if (auth.toLowerCase() === 'nopass')
      warnings.push(
        'This network has no password — traffic on it can be observed by others nearby.'
      );
    return {
      type: 'Wi-Fi network',
      summary: 'Joins a Wi-Fi network automatically when scanned.',
      fields: [
        { key: 'Network name (SSID)', value: get('S') || '(not found)' },
        { key: 'Authentication', value: auth || '(not found)' },
        { key: 'Password present', value: get('P') ? 'Yes (hidden here for safety)' : 'No' },
        { key: 'Hidden network', value: get('H') || 'No' },
      ],
      warnings,
    };
  }
  if (/^BEGIN:VCARD/i.test(text)) {
    const lines = text.split(/\r?\n/);
    const pick = (prefix: string) => {
      const line = lines.find((l) => l.toUpperCase().startsWith(prefix));
      return line ? line.split(':').slice(1).join(':') : '';
    };
    return {
      type: 'vCard contact',
      summary: 'Adds a contact to the scanner address book.',
      fields: [
        { key: 'Full name', value: pick('FN:') || '(not found)' },
        { key: 'Organisation', value: pick('ORG:') || '(not found)' },
        { key: 'Phone', value: pick('TEL') || '(not found)' },
        { key: 'Email', value: pick('EMAIL') || '(not found)' },
        { key: 'Website', value: pick('URL:') || '(not found)' },
        { key: 'Total lines', value: String(lines.length) },
      ],
      warnings,
    };
  }
  if (/^MECARD:/i.test(text)) {
    const get = (k: string) => {
      const m = text.match(new RegExp(`${k}:([^;]*)`, 'i'));
      return m ? m[1] : '';
    };
    return {
      type: 'MeCard contact',
      summary: 'Adds a contact (compact MeCard format).',
      fields: [
        { key: 'Name', value: get('N') || '(not found)' },
        { key: 'Phone', value: get('TEL') || '(not found)' },
        { key: 'Email', value: get('EMAIL') || '(not found)' },
        { key: 'Website', value: get('URL') || '(not found)' },
      ],
      warnings,
    };
  }
  if (/^mailto:/i.test(text)) {
    const rest = text.slice(7);
    const [addr, query] = rest.split('?');
    const qp = new URLSearchParams(query ?? '');
    return {
      type: 'Email (mailto)',
      summary: 'Opens a pre-addressed email draft.',
      fields: [
        { key: 'To', value: addr },
        { key: 'Subject', value: qp.get('subject') ?? '(none)' },
        { key: 'Body preview', value: (qp.get('body') ?? '(none)').slice(0, 200) },
      ],
      warnings,
    };
  }
  if (/^(sms|smt?o):/i.test(text)) {
    return {
      type: 'SMS',
      summary: 'Opens a pre-addressed text message draft.',
      fields: [{ key: 'Full payload', value: text }],
      warnings: ['Check the recipient and message before sending — scanning pre-fills them.'],
    };
  }
  if (/^geo:/i.test(text)) {
    return {
      type: 'Geo location',
      summary: 'Opens a map location.',
      fields: [{ key: 'Coordinates', value: text.slice(4) }],
      warnings,
    };
  }
  if (/^tel:/i.test(text)) {
    return {
      type: 'Phone (tel)',
      summary: 'Dials a phone number.',
      fields: [{ key: 'Number', value: text.slice(4) }],
      warnings: ['Confirm the number before calling — premium-rate numbers can be costly.'],
    };
  }
  if (/^bitcoin:/i.test(text)) {
    return {
      type: 'Bitcoin payment',
      summary: 'Opens a Bitcoin payment request.',
      fields: [{ key: 'Full payload', value: text }],
      warnings: [
        'Cryptocurrency payments cannot be reversed. Verify the address through a second channel before sending.',
      ],
    };
  }
  return {
    type: 'Plain text',
    summary: `Unstructured text (${text.length} characters). Nothing will open automatically.`,
    fields: [
      { key: 'Length', value: `${text.length} characters` },
      { key: 'Contains a line break', value: /\n/.test(text) ? 'Yes' : 'No' },
      { key: 'Contains non-ASCII characters', value: /[^\x00-\x7F]/.test(text) ? 'Yes' : 'No' },
    ],
    warnings,
  };
}

const FAQS = [
  {
    question: 'Does uploading a QR image send it to a server?',
    answer:
      'No. The image is decoded in your browser with jsQR and never leaves this device. Nothing is uploaded, stored, or sent to any server by this tool.',
  },
  {
    question: 'Why does decoding fail on a blurry or tilted photo?',
    answer:
      'Decoders read the contrast pattern of dark and light modules. Blur, glare, perspective distortion, and low contrast all destroy that pattern. Retake the photo straight-on, in even light, and fill the frame with the code. Cropping tightly around the code, including its white margin, also helps.',
  },
  {
    question: 'Can a QR code do something harmful just by being scanned?',
    answer:
      'Scanning alone only reads text. Harm comes from what the scanner does next: opening a link, joining a network, or dialling a number. That is why inspecting the payload first matters — you get to see the destination before any app acts on it.',
  },
  {
    question: 'What should I check in a URL payload before opening it?',
    answer:
      'Read the host from the right, confirm the scheme is HTTPS for anything sensitive, look for credentials hidden before an @ sign, and be suspicious of raw IP hosts and lookalike domains. If the link arrived unexpectedly, verify it through a separate channel before opening it.',
  },
];

export default function QRPayloadInspectorPage() {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [raw, setRaw] = useState('');
  const [pasted, setPasted] = useState('');
  const [status, setStatus] = useState('');

  const handleFile = async (file: File) => {
    setStatus('Decoding…');
    setInspection(null);
    setRaw('');
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.drawImage(bitmap, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height);
      if (!code) {
        setStatus(
          'No QR code could be decoded from this image. Try a sharper, straighter photo that fills the frame.'
        );
        return;
      }
      setRaw(code.data);
      setInspection(classify(code.data));
      setStatus(`Decoded ${code.data.length} characters.`);
    } catch {
      setStatus(
        'Could not read that file. Use a common image format (PNG or JPEG) containing one QR code.'
      );
    }
  };

  const inspectPasted = () => {
    if (!pasted.trim()) {
      setStatus('Paste a payload first.');
      return;
    }
    setRaw(pasted.trim());
    setInspection(classify(pasted.trim()));
    setStatus('Classified the pasted payload.');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Payload Inspector',
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
          { label: 'QR Payload Inspector', href: '/qr-payload-inspector' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ScanSearch className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Payload Inspector
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Upload a QR image and this tool decodes it in your browser with jsQR, then classifies the
          payload and lists every field it contains — so you see what a code would do before any app
          acts on it. Nothing is uploaded; decoding happens on your device.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Upload a QR image</h2>
            <div className="space-y-1.5">
              <Label htmlFor="qr-image">Image file (PNG or JPEG)</Label>
              <input
                id="qr-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paste-payload">Or paste a payload to classify</Label>
              <Textarea
                id="paste-payload"
                rows={4}
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/welcome
              </p>
            </div>
            <Button onClick={inspectPasted}>Classify pasted payload</Button>
            {status && <p className="text-xs text-muted-foreground">{status}</p>}
            <p className="text-xs text-muted-foreground flex gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                The image is decoded locally in your browser. It is never uploaded or stored.
              </span>
            </p>
          </Card>
        </div>
        <div className="lg:col-span-7 space-y-4">
          {inspection ? (
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Inspection result</h2>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {inspection.type}
                </span>
                <span className="text-sm text-muted-foreground">{inspection.summary}</span>
              </div>
              {inspection.warnings.length > 0 && (
                <ul className="space-y-2">
                  {inspection.warnings.map((w, i) => (
                    <li
                      key={i}
                      className="text-xs flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              )}
              <table className="w-full text-xs">
                <tbody>
                  {inspection.fields.map((f, i) => (
                    <tr key={i} className="border-b border-border/50 align-top">
                      <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">{f.key}</td>
                      <td className="py-2 font-mono break-all">{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Raw payload
                </p>
                <p className="text-xs font-mono break-all">{raw}</p>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground flex gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Upload an image or paste a payload to see its type, fields, and warnings here.
                </span>
              </p>
            </Card>
          )}
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why inspecting a QR payload beats trusting the label next to it
        </h2>
        <p className="text-base leading-relaxed">
          A QR code is opaque by design: the pattern means nothing to the human eye, so people trust
          the sign, sticker, or message around it. Attackers exploit exactly that gap by placing a
          sticker with their own code over a legitimate one, or by sending a code in a message that
          promises something appealing. Inspecting the payload closes the gap. You learn what the
          code actually contains — a link, a Wi-Fi join, a contact, a payment request — before any
          app acts on it, and you can compare that reality against what you were told to expect.
        </p>
        <p className="text-base leading-relaxed">
          Each payload type carries its own risks. A URL payload opens a page, and the page may ask
          for credentials or payment; the danger is not the code but the destination. A Wi-Fi
          payload joins a network silently, which is convenient in a cafe and risky on an unknown
          network, since traffic on an open network can be observed. A contact payload adds data to
          your address book — mostly harmless, but a crafted contact can carry a misleading name or
          a premium-rate number. A payment payload asks your wallet to send money that cannot be
          reversed. Knowing the type tells you which question to ask next.
        </p>
        <p className="text-base leading-relaxed">
          For URL payloads, read the host from the right, because that is where the registrable
          domain lives. Everything left of it is a subdomain the owner controls, which is why
          familiar-brand-looking hosts such as login.example.com.attacker.com are attacker.com
          wearing a costume. Check the scheme: a page asking for a password over plain HTTP is a
          stop sign, not a quirk. Look for credentials embedded before an @ sign, for raw IP
          addresses standing in for domain names, and for punycode that renders a lookalike domain
          as a familiar brand. Query parameters deserve a glance too — tracking parameters are
          normal, but redirect parameters can bounce you onward to a different site.
        </p>
        <p className="text-base leading-relaxed">
          If you publish QR codes, inspection is also your quality control. Decode your own printed
          codes before they ship, compare the decoded payload against the intended one character by
          character, and repeat the check after any system migration. A single transposed character
          in a printed URL sends every scanner to the wrong place, and a Wi-Fi payload with a stale
          password locks every guest out. Inspection takes seconds; reprinting a run of labels takes
          days.
        </p>
        <p className="text-base leading-relaxed">
          Finally, keep perspective. Most QR codes are mundane: menus, tickets, forms, product
          pages. Inspection is not about suspicion of every code; it is about reserving trust for
          the codes that earn it. When a code arrives unexpectedly, promises urgency, or asks for
          credentials or money, inspect it, verify the sender through a separate channel, and walk
          away if the two stories do not match.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Payload Inspection
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
