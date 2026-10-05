'use client';
import type { RefObject } from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, AlertTriangle } from 'lucide-react';
import type { CustomizationOptions } from '@/types';
import { drawCustomQR } from '@/lib/canvas-qr';

interface QRPreviewProps {
  qrText: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  options: CustomizationOptions;
  typeLabel: string;
}

export function QRPreview({ qrText, canvasRef, options, typeLabel }: QRPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasQR, setHasQR] = useState(false);
  const isTooLong = qrText.length > 2953;

  useEffect(() => {
    if (!qrText.trim() || !canvasRef.current || isTooLong) { setHasQR(false); return; }
    let cancelled = false;
    setIsGenerating(true);
    drawCustomQR(canvasRef.current, qrText, options)
      .then(() => { if (!cancelled) setHasQR(true); })
      .catch(() => { if (!cancelled) setHasQR(false); })
      .finally(() => { if (!cancelled) setIsGenerating(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrText, options, isTooLong]);

  return (
    <div role="img" aria-label={`QR code for ${typeLabel}`} className="flex flex-col items-center gap-4">
      <AnimatePresence>
        {isTooLong && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="w-full rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400/80">Data is too long for a QR code (max 2,953 characters). Shorten your content.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative">
        <AnimatePresence>
          {!hasQR && !isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/50 rounded-xl" style={{ minWidth: 192, minHeight: 192 }}>
              <QrCode className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground text-center px-4">{isTooLong ? 'Content too long' : 'Fill in the fields to generate your QR code'}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-xl z-10">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
        <canvas ref={canvasRef} className="rounded-xl max-w-full" style={{ display: hasQR || isGenerating ? 'block' : 'none', maxWidth: '100%' }} aria-hidden="true" />
        {!hasQR && !isGenerating && <div className="rounded-xl bg-muted/30 border border-dashed border-border" style={{ width: 256, height: 256 }} aria-hidden="true" />}
      </div>
    </div>
  );
}
