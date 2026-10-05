'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  QrCode,
  Settings,
  Palette,
  Download,
  Wand2,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TypeSelector } from '@/components/TypeSelector';
import { DynamicForm } from '@/components/DynamicForm';
import { TemplateSelector } from '@/components/TemplateSelector';
import { CustomizationPanel } from '@/components/CustomizationPanel';
import { QRPreview } from '@/components/QRPreview';
import { ExportPanel } from '@/components/ExportPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDebounce } from '@/hooks/useDebounce';
import type {
  QRType,
  QRData,
  TemplateName,
  CustomizationOptions,
  QRState,
} from '@/types';
import { DEFAULT_CUSTOMIZATION } from '@/lib/defaults';
import { generateQRData, getTypeConfig } from '@/lib/qr-helpers';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

interface StepMeta {
  id: number;
  label: string;
  icon: LucideIcon;
  title: string;
  hint: string;
}

const MOBILE_STEPS: StepMeta[] = [
  {
    id: 0,
    label: 'Type',
    icon: Settings,
    title: 'Choose a QR type',
    hint: 'Pick what your code should do when someone scans it.',
  },
  {
    id: 1,
    label: 'Content',
    icon: QrCode,
    title: 'Add your content',
    hint: 'Fill in the details. Your code updates as you type.',
  },
  {
    id: 2,
    label: 'Design',
    icon: Palette,
    title: 'Style your code',
    hint: 'Choose a template, then fine-tune colors and shape.',
  },
  {
    id: 3,
    label: 'Download',
    icon: Download,
    title: 'Preview and download',
    hint: 'Check the preview, then save it in the format you need.',
  },
];

const LAST_STEP = MOBILE_STEPS.length - 1;
const DEBOUNCE_MS = 300;

type GeneratorState = QRState & { customization: CustomizationOptions };

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

interface StatsBarProps {
  typeLabel: string;
  characters: number;
  ecLevel: string | number;
  outputSize: string | number;
}

function StatsBar({ typeLabel, characters, ecLevel, outputSize }: StatsBarProps) {
  const items: [string, string][] = [
    ['Type', typeLabel || '-'],
    ['Characters', characters.toLocaleString()],
    ['Error correction', String(ecLevel)],
    ['Output size', `${outputSize}px`],
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      {items.map(([label, value]) => (
        <div key={label} className="flex min-w-0 items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="truncate font-medium tabular-nums text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function SectionCard({
  icon: Icon,
  title,
  description,
  action,
  className = 'shadow-sm',
  children,
}: SectionCardProps) {
  return (
    <Card className={`border-border/60 ${className}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ResetButton({ onClick, compact = false }: { onClick: () => void; compact?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label="Reset form"
      className={`text-muted-foreground hover:text-foreground ${compact ? 'h-7 px-2' : 'h-8 px-2'}`}
    >
      <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
      <span className="text-xs">Reset</span>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*  HomeGenerator                                                             */
/* -------------------------------------------------------------------------- */

export function HomeGenerator() {
  // One canvas ref, shared by QRPreview and ExportPanel. It is only attached
  // by QRPreview (no hidden duplicate canvas).
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStepRef = useRef(0);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const [mobileStep, setMobileStep] = useState(0);

  const [storedType, setStoredType] = useLocalStorage<QRType>('qr-last-type', 'url');
  const [storedTemplate, setStoredTemplate] = useLocalStorage<TemplateName>(
    'qr-last-template',
    'classic',
  );
  const [qrType, setQrTypeState] = useState<QRType>(storedType);
  const [qrData, setQrData] = useState<QRData>({});
  const [template, setTemplateState] = useState<TemplateName>(storedTemplate);
  const [customization, setCustomization] =
    useState<CustomizationOptions>(DEFAULT_CUSTOMIZATION);

  const debouncedData = useDebounce(qrData, DEBOUNCE_MS);
  const config = getTypeConfig(qrType);
  const typeLabel = config?.label ?? '';

  const setQrType = useCallback(
    (t: QRType) => {
      setQrTypeState(t);
      setStoredType(t);
      setQrData({});
    },
    [setStoredType],
  );

  const setTemplate = useCallback(
    (t: TemplateName) => {
      setTemplateState(t);
      setStoredTemplate(t);
    },
    [setStoredTemplate],
  );

  const handleReset = useCallback(() => setQrData({}), []);

  const isValid = useMemo(() => {
    if (!config) return false;
    return config.fields
      .filter((f) => f.required)
      .every((f) => {
        const val = debouncedData[f.name];
        return typeof val === 'string' && val.trim().length > 0;
      });
  }, [config, debouncedData]);

  const qrText = useMemo(
    () => (isValid ? generateQRData(qrType, debouncedData) : ''),
    [qrType, debouncedData, isValid],
  );
  const hasQR = qrText.length > 0;

  const state: GeneratorState = useMemo(
    () => ({
      type: qrType,
      data: qrData,
      template,
      customColor: customization.fgColor,
      customization,
    }),
    [qrType, qrData, template, customization],
  );

  const stats = (
    <StatsBar
      typeLabel={typeLabel}
      characters={qrText.length}
      ecLevel={customization.ecLevel}
      outputSize={customization.outputSize}
    />
  );

  /* ---- Mobile: step navigation helpers ---- */

  const goToStep = useCallback(
    (id: number) => {
      // The download step needs a valid code.
      if (id === LAST_STEP && !hasQR) return;
      setMobileStep(id);
    },
    [hasQR],
  );

  // If the code becomes invalid while on the download step, step back.
  useEffect(() => {
    if (mobileStep === LAST_STEP && !hasQR) setMobileStep(1);
  }, [mobileStep, hasQR]);

  // Move focus and scroll to the top when the step changes (keyboard and
  // screen-reader users land on the new step's heading).
  useEffect(() => {
    if (prevStepRef.current === mobileStep) return;
    prevStepRef.current = mobileStep;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [mobileStep, prefersReducedMotion]);

  /* ------------------------------------------------------------------------ */
  /*  Mobile layout: step-by-step flow                                        */
  /* ------------------------------------------------------------------------ */

  if (isMobile) {
    const step = MOBILE_STEPS[mobileStep];
    const nextStep = MOBILE_STEPS[mobileStep + 1];
    const needsContent = mobileStep >= 1 && !hasQR;

    return (
      <>
        {/* Compact status bar, visible once a code exists */}
        {hasQR && mobileStep !== LAST_STEP && (
          <div className="sticky top-14 z-40 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-2 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{typeLabel}</p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {qrText.length.toLocaleString()} characters
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 text-xs"
              onClick={() => goToStep(LAST_STEP)}
            >
              Preview
              <ChevronRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </Button>
          </div>
        )}

        <div className="mx-auto max-w-2xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4">
          {/* Progress */}
          <div className="mb-4 space-y-2">
            <div
              className="h-1 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={MOBILE_STEPS.length}
              aria-valuenow={mobileStep + 1}
              aria-label="Progress"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${((mobileStep + 1) / MOBILE_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Step {mobileStep + 1} of {MOBILE_STEPS.length}
            </p>
          </div>

          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-lg font-semibold leading-tight outline-none"
              >
                {step.title}
              </h2>
              <p className="text-sm text-muted-foreground">{step.hint}</p>
            </div>
            {mobileStep === 1 && <ResetButton onClick={handleReset} compact />}
          </div>

          {mobileStep === 0 && (
            <TypeSelector
              selected={qrType}
              onChange={(t) => {
                setQrType(t);
                setMobileStep(1);
              }}
            />
          )}

          {mobileStep === 1 && (
            <DynamicForm type={qrType} data={qrData} onChange={setQrData} />
          )}

          {mobileStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Template</p>
                <TemplateSelector selected={template} onChange={setTemplate} />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Advanced customization
                </p>
                <CustomizationPanel
                  options={customization}
                  onChange={setCustomization}
                  qrText={qrText}
                />
              </div>
            </div>
          )}

          {mobileStep === LAST_STEP && (
            <div className="space-y-4">
              <QRPreview
                qrText={qrText}
                canvasRef={canvasRef}
                options={customization}
                typeLabel={typeLabel}
              />
              <ExportPanel
                qrText={qrText}
                canvasRef={canvasRef}
                type={qrType}
                state={state}
              />
              {stats}
            </div>
          )}

          {/* Back / Next */}
          <div className="mt-6 space-y-2">
            {needsContent && mobileStep < LAST_STEP && (
              <p className="text-xs text-muted-foreground" role="status">
                Fill in the required fields to continue.
              </p>
            )}
            <div className="flex gap-2">
              {mobileStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => goToStep(mobileStep - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
                  Back
                </Button>
              )}
              {nextStep && (
                <Button
                  type="button"
                  className="flex-[2]"
                  disabled={mobileStep >= 1 && !hasQR}
                  onClick={() => goToStep(mobileStep + 1)}
                >
                  Next: {nextStep.label}
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom step navigation */}
        <nav
          aria-label="Steps"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
        >
          <ul className="flex">
            {MOBILE_STEPS.map(({ id, label, icon: Icon }) => {
              const isActive = mobileStep === id;
              const isLocked = id === LAST_STEP && !hasQR;
              return (
                <li key={id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goToStep(id)}
                    disabled={isLocked}
                    aria-current={isActive ? 'step' : undefined}
                    className={[
                      'flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 py-2 transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                      'disabled:cursor-not-allowed disabled:opacity-40',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="text-xs">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*  Desktop / tablet layout: controls left, sticky preview right            */
  /* ------------------------------------------------------------------------ */

  const fade = (delay = 0) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.3, delay },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
        <motion.div {...fade()} className="min-w-0 space-y-4">
          <SectionCard
            icon={Settings}
            title="QR code type"
            description="Choose what your code does when scanned."
          >
            <TypeSelector selected={qrType} onChange={setQrType} />
          </SectionCard>

          <SectionCard
            icon={QrCode}
            title="Content details"
            description="Your code updates as you type."
            action={<ResetButton onClick={handleReset} />}
          >
            <DynamicForm type={qrType} data={qrData} onChange={setQrData} />
          </SectionCard>

          <SectionCard
            icon={Wand2}
            title="Design"
            description="Pick a template, then fine-tune the look."
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Template</p>
                <TemplateSelector selected={template} onChange={setTemplate} />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Advanced</p>
                <CustomizationPanel
                  options={customization}
                  onChange={setCustomization}
                  qrText={qrText}
                />
              </div>
            </div>
          </SectionCard>
        </motion.div>

        <motion.aside
          {...fade(0.06)}
          aria-label="Live preview and download"
          className="space-y-4 lg:sticky lg:top-20 lg:self-start"
        >
          <SectionCard icon={QrCode} title="Live preview" className="shadow-lg">
            <div className="space-y-4">
              <QRPreview
                qrText={qrText}
                canvasRef={canvasRef}
                options={customization}
                typeLabel={typeLabel}
              />
              <Separator />
              <ExportPanel
                qrText={qrText}
                canvasRef={canvasRef}
                type={qrType}
                state={state}
              />
              <Separator />
              {stats}
            </div>
          </SectionCard>
        </motion.aside>
      </div>
    </div>
  );
}