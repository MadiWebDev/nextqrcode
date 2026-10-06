'use client';

/**
 * WiFi QR Code Generator Page
 *
 * Client wrapper that combines:
 *  - WifiDetector  → lets the user pre-fill their current network details
 *  - LandingGenerator → the full WiFi QR generator with export / customisation
 *
 * The metadata export lives in the sibling `layout.tsx` or is injected via the
 * parent Server Component root (see Next.js docs on mixed Server/Client trees).
 * Because `generateMetadata` cannot be used in a 'use client' file we keep
 * metadata in the page-level layout instead (or accept static OG from the root).
 */

import { useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { WifiDetector } from '@/components/WifiDetector';
import { TypeSelector } from '@/components/TypeSelector';
import { DynamicForm } from '@/components/DynamicForm';
import { QRPreview } from '@/components/QRPreview';
import { ExportPanel } from '@/components/ExportPanel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import type { QRType, QRData, CustomizationOptions, QRState } from '@/types';
import { DEFAULT_CUSTOMIZATION } from '@/lib/defaults';
import { generateQRData, getTypeConfig } from '@/lib/qr-helpers';
import { useDebounce } from '@/hooks/useDebounce';

const FAQS = [
  {
    q: 'Is my WiFi password stored anywhere?',
    a: 'No. All QR generation happens entirely in your browser using JavaScript. Your password never leaves your device and is never sent to any server.',
  },
  {
    q: 'Which devices can scan a WiFi QR code natively?',
    a: 'Android 10+ can scan WiFi QR codes with the built-in Camera app. iOS 11+ on iPhone and iPad also supports scanning WiFi QR codes natively without a third-party app.',
  },
  {
    q: 'Does the WiFi QR code work for hidden networks?',
    a: 'Yes. Expand "Advanced options" in the detector or toggle the Hidden Network field. The QR payload includes H:true so compatible devices automatically probe hidden SSIDs.',
  },
  {
    q: 'Can I print the WiFi QR code for my café or hotel?',
    a: 'Absolutely. Download the SVG version for the sharpest results at any print size. We recommend a minimum printed size of 2 cm × 2 cm for reliable scanning at a normal reading distance.',
  },
  {
    q: 'Why does the Detect WiFi button ask me to type my SSID?',
    a: 'Web browsers deliberately block access to WiFi network names and credentials for your security. The button still detects whether you are on a WiFi connection vs cellular, but the SSID must be entered manually — it is never transmitted.',
  },
];

export default function WifiQRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrData, setQrData] = useState<QRData>({});
  const [customization] = useState<CustomizationOptions>(DEFAULT_CUSTOMIZATION);
  const debouncedData = useDebounce(qrData, 300);
  const type: QRType = 'wifi';
  const config = getTypeConfig(type);

  const isValid = useMemo(() => {
    if (!config) return false;
    return config.fields
      .filter((f) => f.required)
      .every((f) => {
        const val = debouncedData[f.name];
        return val !== undefined && val.trim().length > 0;
      });
  }, [config, debouncedData]);

  const qrText = useMemo(
    () => (isValid ? generateQRData(type, debouncedData) : ''),
    [debouncedData, isValid]
  );

  const landingState: QRState & { customization: CustomizationOptions } = useMemo(
    () => ({ type, data: qrData, template: 'classic', customColor: '#000000', customization }),
    [qrData, customization]
  );

  const handleTypeChange = useCallback((t: QRType) => {
    if (t !== type) window.location.href = `/?type=${t}`;
  }, []);

  /** Called by WifiDetector when the user clicks "Generate QR for This Network" */
  const handleDetectorFill = useCallback(
    (values: { ssid: string; password: string; encryption: string; hidden: string }) => {
      setQrData((prev) => ({
        ...prev,
        ssid: values.ssid,
        password: values.password,
        encryption: values.encryption,
        hidden: values.hidden,
      }));
    },
    []
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Free WiFi QR Code Generator — Share Your Network Instantly
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Create a WiFi QR code that connects guests to your network in one scan — no password
          typing, no errors. Download PNG, SVG, or PDF for free. Works on every modern smartphone.
        </p>
      </section>

      {/* ── Detector banner ───────────────────────────────────────────────── */}
      <section aria-label="Detect current WiFi">
        <WifiDetector onFill={handleDetectorFill} />
      </section>

      {/* ── Generator ─────────────────────────────────────────────────────── */}
      <section
        aria-label="WiFi QR code generator"
        className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6"
      >
        <div className="space-y-4">
          <div className="p-4 border border-border/60 rounded-xl bg-card shadow-sm">
            <TypeSelector selected={type} onChange={handleTypeChange} />
          </div>
          <div className="p-4 border border-border/60 rounded-xl bg-card shadow-sm">
            <DynamicForm type={type} data={qrData} onChange={setQrData} />
          </div>
        </div>

        <div className="md:sticky md:top-20 md:self-start space-y-4">
          <div className="p-4 border border-border/60 rounded-xl bg-card shadow-lg">
            <QRPreview
              qrText={qrText}
              canvasRef={canvasRef}
              options={customization}
              typeLabel={config?.label ?? ''}
            />
            <Separator className="my-3" />
            <ExportPanel
              qrText={qrText}
              canvasRef={canvasRef}
              type={type}
              state={landingState}
            />
          </div>
        </div>
      </section>

      {/* ── How-to ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">How to create a WiFi QR code</h2>
        <ol className="space-y-3">
          {[
            'Click "Detect WiFi" above to pre-fill your current network name automatically.',
            'Confirm or edit the SSID, enter your WiFi password, and choose encryption type (WPA/WPA2 is most common).',
            'The QR code updates in real time. Download as PNG or SVG — when guests scan it, their device connects instantly.',
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-muted-foreground pt-0.5 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="multiple" className="space-y-2">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left text-sm font-medium py-3">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Related tools ─────────────────────────────────────────────────── */}
      <section className="space-y-3 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold">Related QR Code Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Printable WiFi Signs (RTL)', href: '/wifi-sign-generator' },
            { label: 'URL Generator', href: '/url-qr-code-generator' },
            { label: 'vCard Generator', href: '/vcard-qr-code-generator' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
