'use client';
import { useCallback } from 'react';
import type { CustomizationOptions } from '@/types';
import { drawCustomQR } from '@/lib/canvas-qr';

interface GenerateOptions {
  qrText: string;
  options: CustomizationOptions;
}

export function useQRGenerator() {
  const generateToCanvas = useCallback(
    async (canvas: HTMLCanvasElement, opts: GenerateOptions): Promise<boolean> => {
      if (!opts.qrText.trim()) return false;
      try {
        await drawCustomQR(canvas, opts.qrText, opts.options);
        return true;
      } catch {
        return false;
      }
    },
    []
  );
  return { generateToCanvas };
}
