'use client';

import { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Download,
  FileSpreadsheet,
  Info,
  Loader2,
  Play,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react';
import type {
  BulkErrorCorrectionLevel,
  BulkFormat,
  BulkQrMessage,
  BulkQrRequest,
  BulkRow,
} from '@/workers/bulkQr.worker';

const MAX_ROWS = 500;

const SAMPLE_ROWS = `https://example.com/menu,main-menu
https://example.com/promo,summer-promo
https://example.com/contact,contact-us
WIFI:T:WPA;S:CafeGuest;P:coffee123;;,cafe-wifi
Just a plain text payload`;

type RunStatus = 'idle' | 'running' | 'done';

interface GeneratedResult {
  index: number;
  dataUrl: string;
}

/** Keep only a–z, 0–9 and dashes; collapse repeats; fall back to `qr-<n>`. */
function sanitizeFilename(raw: string, index: number): string {
  const cleaned = raw
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return cleaned || `qr-${index + 1}`;
}

function stripQuotes(value: string): string {
  const v = value.trim();
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
  return v;
}

/**
 * Accepts either one payload per line, or CSV with `payload,filename`
 * columns (split on the first comma). Empty lines are skipped.
 */
function parseRows(raw: string): BulkRow[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, i) => {
      const comma = line.indexOf(',');
      if (comma > 0) {
        const payload = stripQuotes(line.slice(0, comma));
        const filename = stripQuotes(line.slice(comma + 1)) || `qr-${i + 1}`;
        return { payload, filename };
      }
      return { payload: line, filename: `qr-${i + 1}` };
    });
}

const EC_LEVELS: { value: BulkErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'L — Low (7% recovery)' },
  { value: 'M', label: 'M — Medium (15% recovery)' },
  { value: 'Q', label: 'Q — Quartile (25% recovery)' },
  { value: 'H', label: 'H — High (30% recovery)' },
];

export function BulkClient() {
  const [inputText, setInputText] = useState('');
  const [format, setFormat] = useState<BulkFormat>('png');
  const [size, setSize] = useState(512);
  const [ecLevel, setEcLevel] = useState<BulkErrorCorrectionLevel>('M');
  const [status, setStatus] = useState<RunStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const resultsRef = useRef<GeneratedResult[]>([]);
  const zipUrlRef = useRef<string | null>(null);

  const setZipUrlSafe = (url: string | null) => {
    zipUrlRef.current = url;
    setZipUrl(url);
  };

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
    };
  }, []);

  const parsedRows = parseRows(inputText);

  async function handleGenerate() {
    setError(null);
    if (zipUrlRef.current) {
      URL.revokeObjectURL(zipUrlRef.current);
    }
    setZipUrlSafe(null);
    if (parsedRows.length === 0) {
      setError('Enter at least one payload — one per line, or payload,filename per line.');
      return;
    }
    if (parsedRows.length > MAX_ROWS) {
      setError(
        `Too many rows: ${parsedRows.length}. This tool processes at most ${MAX_ROWS} QR codes at a time.`
      );
      return;
    }

    workerRef.current?.terminate();
    resultsRef.current = [];
    setFailed(0);
    setTotal(parsedRows.length);
    setProgress(0);
    setStatus('running');

    const worker = new Worker(new URL('@/workers/bulkQr.worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = async (event: MessageEvent<BulkQrMessage>) => {
      const message = event.data;
      if (message.type === 'progress') {
        resultsRef.current.push({ index: message.index, dataUrl: message.dataUrl });
        setProgress(message.index + 1);
      } else if (message.type === 'row-error') {
        setFailed((n) => n + 1);
      } else if (message.type === 'done') {
        setFailed(message.failed);
        await buildZip(worker, message.succeeded);
      }
    };

    worker.onerror = () => {
      setError('The generation worker failed to start. Try reloading the page.');
      setStatus('idle');
      worker.terminate();
      workerRef.current = null;
    };

    const request: BulkQrRequest = {
      rows: parsedRows,
      format,
      size,
      ecLevel,
    };
    worker.postMessage(request);
  }

  async function buildZip(worker: Worker, succeeded: number) {
    try {
      const zip = new JSZip();
      const usedNames = new Set<string>();
      const ordered = [...resultsRef.current].sort((a, b) => a.index - b.index);

      for (const result of ordered) {
        const row = parsedRows[result.index];
        let name = sanitizeFilename(row.filename, result.index);
        if (usedNames.has(name)) name = `${name}-${result.index + 1}`;
        usedNames.add(name);
        const fileName = `${name}.${format}`;
        if (format === 'svg') {
          zip.file(fileName, result.dataUrl);
        } else {
          const base64 = result.dataUrl.split(',')[1] ?? '';
          zip.file(fileName, base64, { base64: true });
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      setZipUrlSafe(url);
      setStatus('done');
      if (succeeded === 0) {
        setError('No QR codes could be generated from the input rows.');
      }
    } catch {
      setError('Failed to build the ZIP archive.');
      setStatus('idle');
    } finally {
      worker.terminate();
      workerRef.current = null;
    }
  }

  function handleReset() {
    workerRef.current?.terminate();
    workerRef.current = null;
    resultsRef.current = [];
    if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
    setZipUrlSafe(null);
    setStatus('idle');
    setProgress(0);
    setTotal(0);
    setFailed(0);
    setError(null);
  }

  const percent = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>100% in-browser</AlertTitle>
        <AlertDescription>
          Every QR code is generated on your device in a Web Worker. Your data never leaves the
          browser — nothing is uploaded to any server.
        </AlertDescription>
      </Alert>

      <Card className="p-6 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bulk-input">Payloads — one per line</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setInputText(SAMPLE_ROWS)}
              disabled={status === 'running'}
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              Load sample
            </Button>
          </div>
          <Textarea
            id="bulk-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            placeholder={`https://example.com/menu,main-menu\nhttps://example.com/promo,summer-promo\nJust a plain text payload`}
            disabled={status === 'running'}
            aria-describedby="bulk-input-help"
            className="font-mono text-sm"
          />
          <p id="bulk-input-help" className="text-sm text-muted-foreground">
            Two formats are supported: <strong>one payload per line</strong>, or CSV with{' '}
            <strong>payload,filename</strong> columns (filenames are sanitized to letters, numbers
            and dashes). Maximum {MAX_ROWS} rows.
          </p>
          {parsedRows.length > 0 && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {parsedRows.length} row{parsedRows.length === 1 ? '' : 's'} detected.
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="bulk-format">Format</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as BulkFormat)}
              disabled={status === 'running'}
            >
              <SelectTrigger id="bulk-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (raster)</SelectItem>
                <SelectItem value="svg">SVG (vector)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-ec">Error correction</Label>
            <Select
              value={ecLevel}
              onValueChange={(v) => setEcLevel(v as BulkErrorCorrectionLevel)}
              disabled={status === 'running'}
            >
              <SelectTrigger id="bulk-ec">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {EC_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-size">
              Size: <span className="font-semibold">{size}px</span>
            </Label>
            <Slider
              id="bulk-size"
              min={128}
              max={1024}
              step={64}
              value={[size]}
              onValueChange={(v) => setSize(v[0] ?? 512)}
              disabled={status === 'running'}
              aria-label="QR code size in pixels"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Couldn&apos;t generate</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleGenerate} disabled={status === 'running'}>
            {status === 'running' ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1.5" />
                Generate QR codes
              </>
            )}
          </Button>
          {status !== 'idle' && (
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
          )}
        </div>

        {status !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span aria-live="polite">
                {status === 'running'
                  ? `Generating… ${progress} of ${total}`
                  : `Done — ${total - failed} generated${failed > 0 ? `, ${failed} failed` : ''}`}
              </span>
              <span className="font-semibold">{percent}%</span>
            </div>
            <Progress value={percent} aria-label="Generation progress" />
          </div>
        )}

        {status === 'done' && zipUrl && (
          <Button type="button" asChild size="lg">
            <a href={zipUrl} download="qr-bulk.zip">
              <Download className="h-4 w-4 mr-1.5" />
              Download qr-bulk.zip
            </a>
          </Button>
        )}
      </Card>
    </div>
  );
}
