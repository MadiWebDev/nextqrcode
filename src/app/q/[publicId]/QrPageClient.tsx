'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeLib from 'qrcode';
import { drawCustomQR } from '@/lib/canvas-qr';
import { DEFAULT_CUSTOMIZATION } from '@/lib/defaults';
import type { CustomizationOptions } from '@/types';
import { Button } from '@/components/ui/button';

interface QrPageClientProps {
  publicId: string;
  encodedText: string;
  design?: Record<string, unknown>;
  title: string;
  pageUrl: string;
}

function mergeDesign(design?: Record<string, unknown>): CustomizationOptions {
  return { ...DEFAULT_CUSTOMIZATION, ...(design ?? {}) } as CustomizationOptions;
}

export function QrPageClient({ publicId, encodedText, design, title, pageUrl }: QrPageClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState<'qr' | 'link' | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportState, setReportState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [reportReason, setReportReason] = useState('phishing');
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const opts = mergeDesign(design);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !encodedText) return;
    let cancelled = false;
    drawCustomQR(canvas, encodedText, { ...opts, outputSize: 640 })
      .then(() => {
        if (!cancelled) canvas.setAttribute('role', 'img');
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encodedText, publicId]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `qrcode-${publicId}.png`;
    a.click();
  };

  const downloadSvg = async () => {
    const svg = await QRCodeLib.toString(encodedText, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 4,
      width: 1024,
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${publicId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = async (text: string, which: 'qr' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setShareMsg('Copy failed — select the text manually.');
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: pageUrl });
      } catch {
        /* user dismissed */
      }
    } else {
      await copyText(pageUrl, 'link');
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportState('sending');
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, reason: reportReason }),
      });
    } catch {
      /* report failures are silent by design */
    }
    setReportState('done');
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
        <canvas
          ref={canvasRef}
          aria-label={`QR code for ${title}`}
          className="mx-auto h-auto w-full max-w-[420px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={downloadPng}>Download PNG</Button>
        <Button variant="outline" onClick={downloadSvg}>
          Download SVG
        </Button>
        <Button variant="outline" onClick={() => copyText(encodedText, 'qr')}>
          {copied === 'qr' ? 'Copied!' : 'Copy QR text'}
        </Button>
        <Button variant="outline" onClick={share}>
          Share
        </Button>
      </div>
      {shareMsg && (
        <p role="status" className="text-sm text-muted-foreground">
          {shareMsg}
        </p>
      )}

      <div className="rounded-xl border border-border p-4">
        {!reportOpen ? (
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Report this QR code
          </button>
        ) : reportState === 'done' ? (
          <p role="status" className="text-sm text-muted-foreground">
            Thanks — your report has been received and will be reviewed.
          </p>
        ) : (
          <form onSubmit={submitReport} className="space-y-3">
            <label className="block text-sm font-medium">
              Reason
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="phishing">Phishing / scam</option>
                <option value="malware">Malware</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
            </label>
            <Button type="submit" size="sm" disabled={reportState === 'sending'}>
              {reportState === 'sending' ? 'Sending…' : 'Submit report'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
