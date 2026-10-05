'use client';
import { useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { TypeSelector } from '@/components/TypeSelector';
import { DynamicForm } from '@/components/DynamicForm';
import { QRPreview } from '@/components/QRPreview';
import { ExportPanel } from '@/components/ExportPanel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import type { QRType, QRData, CustomizationOptions, QRState } from '@/types';
import { DEFAULT_CUSTOMIZATION } from '@/lib/defaults';
import { generateQRData, getTypeConfig } from '@/lib/qr-helpers';
import { useDebounce } from '@/hooks/useDebounce';

interface LandingData {
  title: string;
  description: string;
  howTo: string[];
  faqs: { q: string; a: string }[];
  relatedTypes: { type: QRType; label: string; slug: string }[];
}

interface LandingGeneratorProps {
  type: QRType;
  data: LandingData;
}

export function LandingGenerator({ type, data }: LandingGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrData, setQrData] = useState<QRData>({});
  const [customization] = useState<CustomizationOptions>(DEFAULT_CUSTOMIZATION);
  const debouncedData = useDebounce(qrData, 300);
  const config = getTypeConfig(type);

  const isValid = useMemo(() => {
    if (!config) return false;
    return config.fields.filter(f => f.required).every(f => { const val = debouncedData[f.name]; return val !== undefined && val.trim().length > 0; });
  }, [config, debouncedData]);

  const qrText = useMemo(() => { if (!isValid) return ''; return generateQRData(type, debouncedData); }, [type, debouncedData, isValid]);

  const landingState: QRState & { customization: CustomizationOptions } = useMemo(() => ({
    type, data: qrData, template: 'classic', customColor: '#000000', customization,
  }), [type, qrData, customization]);

  const handleTypeChange = useCallback((t: QRType) => {
    if (t !== type) { window.location.href = `/?type=${t}`; }
  }, [type]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{data.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
      </section>

      {/* Embedded generator */}
      <section aria-label="QR code generator" className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">
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
            <QRPreview qrText={qrText} canvasRef={canvasRef} options={customization} typeLabel={config?.label ?? ''} />
            <Separator className="my-3" />
            <ExportPanel qrText={qrText} canvasRef={canvasRef} type={type} state={landingState} />
          </div>
        </div>
      </section>

      {/* How-to */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">How to create a {config?.label} QR code</h2>
        <ol className="space-y-3">
          {data.howTo.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <p className="text-muted-foreground pt-0.5 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="multiple" className="space-y-2">
          {data.faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm font-medium py-3">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Related tools */}
      {data.relatedTypes.length > 0 && (
        <section className="space-y-3 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold">Related QR Code Tools</h2>
          <div className="flex flex-wrap gap-2">
            {data.relatedTypes.map(({ type: t, label, slug }) => (
              <Link key={t} href={slug} className="px-3 py-1.5 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">{label}</Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
