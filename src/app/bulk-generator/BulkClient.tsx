'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Square,
  TriangleAlert,
  Upload,
} from 'lucide-react';
import type {
  BulkErrorCorrectionLevel,
  BulkFormat,
  BulkQrMessage,
  BulkQrRequest,
  BulkRow,
} from '@/workers/bulkQr.worker';

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_ROWS = 500;
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB import limit
const MAX_THUMBNAILS = 24;
const PREVIEW_ROWS = 8;
const SETTINGS_KEY = 'bulk-qr:settings:v1';

/** Max payload size in bytes (byte mode, version 40) per error-correction level. */
const CAPACITY_BYTES: Record<BulkErrorCorrectionLevel, number> = {
  L: 2953,
  M: 2331,
  Q: 1663,
  H: 1273,
};

const SAMPLE_ROWS = `payload,filename
https://example.com/menu,main-menu
https://example.com/promo,summer-promo
https://example.com/contact,contact-us
"WIFI:T:WPA;S:CafeGuest;P:coffee123;;",cafe-wifi
"Hello, world — plain text with a comma",greeting`;

const EC_LEVELS: { value: BulkErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'L — Low (7% recovery)' },
  { value: 'M', label: 'M — Medium (15% recovery)' },
  { value: 'Q', label: 'Q — Quartile (25% recovery)' },
  { value: 'H', label: 'H — High (30% recovery)' },
];

type InputMode = 'csv' | 'lines';
type RunStatus = 'idle' | 'running' | 'zipping' | 'done' | 'cancelled';

interface GeneratedResult {
  /** Index into the list of rows actually sent to the worker. */
  index: number;
  dataUrl: string;
}

interface ParsedRow {
  /** 0-based position among non-empty input rows. */
  position: number;
  payload: string;
  filename: string;
  bytes: number;
  /** Set when the row cannot be generated. */
  problem: string | null;
}

interface Settings {
  format: BulkFormat;
  size: number;
  ecLevel: BulkErrorCorrectionLevel;
  mode: InputMode;
  manifest: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  format: 'png',
  size: 512,
  ecLevel: 'M',
  mode: 'csv',
  manifest: true,
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Keep only a–z, 0–9 and dashes; collapse repeats; fall back to `qr-<n>`. */
function sanitizeFilename(raw: string, position: number): string {
  const cleaned = raw
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return cleaned || `qr-${position + 1}`;
}

/**
 * Minimal RFC 4180 parser: handles quoted fields, escaped quotes ("") and
 * commas / newlines inside quotes. Returns an array of records.
 */
function parseCsv(text: string): string[][] {
  const records: string[][] = [];
  let field = '';
  let record: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"' && field === '') {
      inQuotes = true;
    } else if (ch === ',') {
      record.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      record.push(field);
      records.push(record);
      record = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field !== '' || record.length > 0) {
    record.push(field);
    records.push(record);
  }
  return records;
}

/**
 * Turns raw input into rows. `csv` mode reads `payload,filename` (quotes
 * supported, optional header row). `lines` mode treats every line as one
 * payload, so commas are never special.
 */
function parseInput(raw: string, mode: InputMode, ec: BulkErrorCorrectionLevel): ParsedRow[] {
  const encoder = new TextEncoder();
  const capacity = CAPACITY_BYTES[ec];
  let pairs: { payload: string; filename: string }[];

  if (mode === 'lines') {
    pairs = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((payload) => ({ payload, filename: '' }));
  } else {
    let records = parseCsv(raw).filter((r) => r.some((c) => c.trim() !== ''));
    const first = records[0];
    if (
      first &&
      first[0]?.trim().toLowerCase() === 'payload' &&
      (first[1] === undefined || first[1].trim().toLowerCase() === 'filename')
    ) {
      records = records.slice(1);
    }
    pairs = records.map((r) => ({
      payload: (r[0] ?? '').trim(),
      filename: (r[1] ?? '').trim(),
    }));
  }

  return pairs.map(({ payload, filename }, position) => {
    const bytes = encoder.encode(payload).length;
    let problem: string | null = null;
    if (!payload) problem = 'Empty payload';
    else if (bytes > capacity) problem = `Too long for level ${ec} (${bytes} / ${capacity} bytes)`;
    return {
      position,
      payload,
      filename: sanitizeFilename(filename, position),
      bytes,
      problem,
    };
  });
}

/** Resolves duplicate filenames deterministically: name, name-2, name-3 … */
function uniqueNames(rows: { filename: string }[]): string[] {
  const used = new Set<string>();
  return rows.map((r) => {
    let name = r.filename;
    let n = 2;
    while (used.has(name.toLowerCase())) name = `${r.filename}-${n++}`;
    used.add(name.toLowerCase());
    return name;
  });
}

/** Worker returns PNG as a data URL; SVG may be raw markup or a data URL. */
function svgText(dataUrl: string): string {
  if (!dataUrl.startsWith('data:')) return dataUrl;
  const comma = dataUrl.indexOf(',');
  const meta = dataUrl.slice(0, comma);
  const body = dataUrl.slice(comma + 1);
  return meta.includes(';base64') ? atob(body) : decodeURIComponent(body);
}

function toImgSrc(dataUrl: string, format: BulkFormat): string {
  if (dataUrl.startsWith('data:')) return dataUrl;
  return format === 'svg'
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`
    : dataUrl;
}

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function BulkClient() {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<InputMode>(DEFAULT_SETTINGS.mode);
  const [format, setFormat] = useState<BulkFormat>(DEFAULT_SETTINGS.format);
  const [size, setSize] = useState(DEFAULT_SETTINGS.size);
  const [ecLevel, setEcLevel] = useState<BulkErrorCorrectionLevel>(DEFAULT_SETTINGS.ecLevel);
  const [manifest, setManifest] = useState(DEFAULT_SETTINGS.manifest);

  const [status, setStatus] = useState<RunStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zip, setZip] = useState<{ url: string; name: string; bytes: number } | null>(null);
  const [thumbs, setThumbs] = useState<{ src: string; label: string }[]>([]);
  const [dragging, setDragging] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const runIdRef = useRef(0);
  const startedAtRef = useRef(0);
  const resultsRef = useRef<GeneratedResult[]>([]);
  const failuresRef = useRef<Map<number, string>>(new Map());
  const processedRef = useRef(0);
  const zipUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const settingsLoadedRef = useRef(false);

  const running = status === 'running' || status === 'zipping';

  /* ---- settings persistence ---- */
  useEffect(() => {
    const s = loadSettings();
    setFormat(s.format);
    setSize(s.size);
    setEcLevel(s.ecLevel);
    setMode(s.mode);
    setManifest(s.manifest);
    settingsLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!settingsLoadedRef.current) return;
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ format, size, ecLevel, mode, manifest } satisfies Settings)
      );
    } catch {
      /* storage unavailable — ignore */
    }
  }, [format, size, ecLevel, mode, manifest]);

  /* ---- cleanup ---- */
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
    };
  }, []);

  /* ---- elapsed timer ---- */
  useEffect(() => {
    if (status !== 'running') return;
    const id = window.setInterval(() => setElapsed(Date.now() - startedAtRef.current), 250);
    return () => window.clearInterval(id);
  }, [status]);

  /* ---- derived data ---- */
  const rows = useMemo(() => parseInput(inputText, mode, ecLevel), [inputText, mode, ecLevel]);
  const validRows = useMemo(() => rows.filter((r) => !r.problem), [rows]);
  const invalidCount = rows.length - validRows.length;
  const finalNames = useMemo(() => uniqueNames(rows), [rows]);
  const renamedCount = useMemo(
    () => rows.filter((r, i) => r.filename !== finalNames[i]).length,
    [rows, finalNames]
  );

  const setZipSafe = (value: { url: string; name: string; bytes: number } | null) => {
    if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
    zipUrlRef.current = value?.url ?? null;
    setZip(value);
  };

  /* ---- file import ---- */
  const importFile = useCallback(async (file: File) => {
    setError(null);
    if (file.size > MAX_FILE_BYTES) {
      setError(`That file is ${formatBytes(file.size)}. The import limit is 2 MB.`);
      return;
    }
    if (!/\.(csv|txt|tsv)$/i.test(file.name) && !file.type.startsWith('text/')) {
      setError('Import a .csv or .txt file.');
      return;
    }
    const text = await file.text();
    setInputText(text);
    if (/\.csv$/i.test(file.name)) setMode('csv');
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (running) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void importFile(file);
  }

  /* ---- run ---- */
  function stopWorker() {
    workerRef.current?.terminate();
    workerRef.current = null;
  }

  function handleGenerate() {
    setError(null);
    setZipSafe(null);
    setThumbs([]);

    if (rows.length === 0) {
      setError('Add at least one payload — type, paste, or import a file.');
      return;
    }
    if (rows.length > MAX_ROWS) {
      setError(`Too many rows: ${rows.length}. This tool processes at most ${MAX_ROWS} at a time.`);
      return;
    }
    if (validRows.length === 0) {
      setError('None of the rows can be generated. Check the row list below for details.');
      return;
    }

    stopWorker();
    const runId = ++runIdRef.current;

    // Snapshot everything the run needs so edits mid-run can't desync results.
    const snapshotRows = validRows;
    const names = uniqueNames(rows);
    const snapshot = { rows: rows.slice(), names, format, manifest };

    resultsRef.current = [];
    failuresRef.current = new Map();
    processedRef.current = 0;
    startedAtRef.current = Date.now();
    setElapsed(0);
    setFailed(0);
    setProgress(0);
    setTotal(snapshotRows.length);
    setStatus('running');

    const worker = new Worker(new URL('@/workers/bulkQr.worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<BulkQrMessage>) => {
      if (runId !== runIdRef.current) return; // stale run
      const message = event.data;
      if (message.type === 'progress') {
        resultsRef.current.push({ index: message.index, dataUrl: message.dataUrl });
        processedRef.current += 1;
        setProgress(processedRef.current);
      } else if (message.type === 'row-error') {
        const loose = message as unknown as { index?: number; message?: string; error?: string };
        if (typeof loose.index === 'number') {
          failuresRef.current.set(loose.index, loose.message ?? loose.error ?? 'Generation failed');
        }
        processedRef.current += 1;
        setProgress(processedRef.current);
        setFailed((n) => n + 1);
      } else if (message.type === 'done') {
        setFailed(message.failed);
        void buildZip(runId, snapshotRows, snapshot, message.succeeded);
      }
    };

    worker.onerror = () => {
      if (runId !== runIdRef.current) return;
      setError('The generation worker crashed. Reload the page and try again.');
      setStatus('idle');
      stopWorker();
    };

    const request: BulkQrRequest = {
      rows: snapshotRows.map<BulkRow>((r) => ({ payload: r.payload, filename: r.filename })),
      format,
      size,
      ecLevel,
    };
    worker.postMessage(request);
  }

  async function buildZip(
    runId: number,
    sent: ParsedRow[],
    snap: { rows: ParsedRow[]; names: string[]; format: BulkFormat; manifest: boolean },
    succeeded: number
  ) {
    setStatus('zipping');
    try {
      const archive = new JSZip();
      const ordered = [...resultsRef.current].sort((a, b) => a.index - b.index);
      const nameByPosition = new Map<number, string>();
      snap.rows.forEach((r, i) => nameByPosition.set(r.position, snap.names[i]));

      for (const result of ordered) {
        const row = sent[result.index];
        const fileName = `${nameByPosition.get(row.position)}.${snap.format}`;
        if (snap.format === 'svg') {
          archive.file(fileName, svgText(result.dataUrl));
        } else {
          archive.file(fileName, result.dataUrl.split(',')[1] ?? '', { base64: true });
        }
      }

      if (snap.manifest) {
        const okIndexes = new Set(ordered.map((r) => r.index));
        const sentIndexByPosition = new Map(sent.map((r, i) => [r.position, i]));
        const lines = ['row,filename,status,message,payload'];
        for (const r of snap.rows) {
          const sentIndex = sentIndexByPosition.get(r.position);
          let state = 'failed';
          let note = r.problem ?? '';
          if (sentIndex !== undefined) {
            if (okIndexes.has(sentIndex)) {
              state = 'ok';
            } else {
              note = failuresRef.current.get(sentIndex) ?? 'Generation failed';
            }
          } else {
            state = 'skipped';
          }
          const file = state === 'ok' ? `${nameByPosition.get(r.position)}.${snap.format}` : '';
          lines.push(
            [r.position + 1, file, state, note, r.payload].map(csvCell).join(',')
          );
        }
        archive.file('manifest.csv', lines.join('\n'));
      }

      const blob = await archive.generateAsync({
        type: 'blob',
        compression: snap.format === 'svg' ? 'DEFLATE' : 'STORE',
      });
      if (runId !== runIdRef.current) return; // reset or restarted meanwhile

      const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      setZipSafe({
        url: URL.createObjectURL(blob),
        name: `qr-bulk-${stamp}.zip`,
        bytes: blob.size,
      });
      setThumbs(
        ordered.slice(0, MAX_THUMBNAILS).map((r) => ({
          src: toImgSrc(r.dataUrl, snap.format),
          label: nameByPosition.get(sent[r.index].position) ?? '',
        }))
      );
      setElapsed(Date.now() - startedAtRef.current);
      setStatus('done');
      if (succeeded === 0) setError('No QR codes could be generated from the input rows.');
    } catch {
      if (runId !== runIdRef.current) return;
      setError('Failed to build the ZIP archive.');
      setStatus('idle');
    } finally {
      if (runId === runIdRef.current) stopWorker();
    }
  }

  function handleCancel() {
    runIdRef.current++; // invalidate in-flight messages
    stopWorker();
    setStatus('cancelled');
  }

  function handleReset() {
    runIdRef.current++;
    stopWorker();
    resultsRef.current = [];
    failuresRef.current = new Map();
    processedRef.current = 0;
    setZipSafe(null);
    setThumbs([]);
    setStatus('idle');
    setProgress(0);
    setTotal(0);
    setFailed(0);
    setElapsed(0);
    setError(null);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !running) {
      e.preventDefault();
      handleGenerate();
    }
  }

  const percent = total > 0 ? Math.round((progress / total) * 100) : 0;
  const rate = elapsed > 0 ? progress / (elapsed / 1000) : 0;
  const eta = rate > 0 && status === 'running' ? ((total - progress) / rate) * 1000 : 0;

  /* ------------------------------------------------------------------------ */

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
        {/* ---------------- Input ---------------- */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="bulk-input">Payloads</Label>
            <div className="flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.tsv,text/plain,text/csv"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void importFile(file);
                  e.target.value = '';
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={running}
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Import file
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMode('csv');
                  setInputText(SAMPLE_ROWS);
                }}
                disabled={running}
              >
                <FileSpreadsheet className="h-4 w-4 mr-1.5" />
                Load sample
              </Button>
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!running) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`rounded-md transition-shadow ${
              dragging ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
          >
            <Textarea
              id="bulk-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={onKeyDown}
              rows={10}
              placeholder={
                mode === 'csv'
                  ? `payload,filename\nhttps://example.com/menu,main-menu\n"Hello, world",greeting`
                  : `https://example.com/menu\nhttps://example.com/promo\nJust a plain text payload`
              }
              disabled={running}
              aria-describedby="bulk-input-help"
              className="font-mono text-sm"
              spellCheck={false}
            />
          </div>

          <p id="bulk-input-help" className="text-sm text-muted-foreground">
            {mode === 'csv' ? (
              <>
                CSV with <strong>payload,filename</strong> columns. Wrap a payload in double quotes
                if it contains commas. A header row is optional.
              </>
            ) : (
              <>
                One payload per line — commas are treated as part of the payload. Files are named{' '}
                <strong>qr-1, qr-2…</strong>
              </>
            )}{' '}
            Filenames keep letters, numbers and dashes. Drop a .csv or .txt file onto the box to
            import it. Maximum {MAX_ROWS} rows. Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>Enter</kbd> to
            generate.
          </p>

          {rows.length > 0 && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {rows.length} row{rows.length === 1 ? '' : 's'} detected
              {invalidCount > 0 && (
                <span className="text-destructive">
                  {' '}
                  · {invalidCount} will be skipped
                </span>
              )}
              {renamedCount > 0 && ` · ${renamedCount} duplicate filename${renamedCount === 1 ? '' : 's'} will be numbered`}
              {rows.length > MAX_ROWS && (
                <span className="text-destructive"> · over the {MAX_ROWS}-row limit</span>
              )}
            </p>
          )}
        </div>

        {/* ---------------- Preview ---------------- */}
        {rows.length > 0 && !running && status !== 'done' && (
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Preview of the first rows</caption>
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium w-12">#</th>
                  <th scope="col" className="px-3 py-2 font-medium">Payload</th>
                  <th scope="col" className="px-3 py-2 font-medium">File</th>
                  <th scope="col" className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, PREVIEW_ROWS).map((r, i) => (
                  <tr key={r.position} className="border-t">
                    <td className="px-3 py-2 text-muted-foreground">{r.position + 1}</td>
                    <td className="px-3 py-2 font-mono max-w-[22rem] truncate" title={r.payload}>
                      {r.payload || <em className="text-muted-foreground">empty</em>}
                    </td>
                    <td className="px-3 py-2 font-mono">
                      {finalNames[i]}.{format}
                    </td>
                    <td className="px-3 py-2">
                      {r.problem ? (
                        <span className="text-destructive">{r.problem}</span>
                      ) : (
                        <span className="text-muted-foreground">Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > PREVIEW_ROWS && (
              <p className="border-t px-3 py-2 text-xs text-muted-foreground">
                Showing {PREVIEW_ROWS} of {rows.length} rows.
              </p>
            )}
          </div>
        )}

        {/* ---------------- Options ---------------- */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-mode">Input format</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as InputMode)} disabled={running}>
              <SelectTrigger id="bulk-mode">
                <SelectValue placeholder="Select input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (payload,filename)</SelectItem>
                <SelectItem value="lines">One payload per line</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-format">Output format</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as BulkFormat)}
              disabled={running}
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
              disabled={running}
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
              disabled={running || format === 'svg'}
              aria-label="QR code size in pixels"
            />
            {format === 'svg' && (
              <p className="text-xs text-muted-foreground">SVG scales to any size.</p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={manifest}
            onChange={(e) => setManifest(e.target.checked)}
            disabled={running}
            className="h-4 w-4 rounded border-input accent-primary"
          />
          Include <code className="font-mono">manifest.csv</code> (maps every row to its file and
          lists any failures)
        </label>

        {error && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Couldn&apos;t generate</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ---------------- Actions ---------------- */}
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleGenerate} disabled={running || rows.length === 0}>
            {running ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                {status === 'zipping' ? 'Packing ZIP…' : 'Generating…'}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1.5" />
                Generate {validRows.length > 0 ? `${validRows.length} ` : ''}QR code
                {validRows.length === 1 ? '' : 's'}
              </>
            )}
          </Button>
          {status === 'running' && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              <Square className="h-4 w-4 mr-1.5" />
              Cancel
            </Button>
          )}
          {status !== 'idle' && status !== 'running' && (
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
          )}
        </div>

        {/* ---------------- Progress ---------------- */}
        {status !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span aria-live="polite">
                {status === 'running' && `Generating… ${progress} of ${total}`}
                {status === 'zipping' && 'Packing ZIP…'}
                {status === 'cancelled' && `Cancelled at ${progress} of ${total}`}
                {status === 'done' &&
                  `Done in ${formatDuration(elapsed)} — ${total - failed} generated${
                    failed > 0 ? `, ${failed} failed` : ''
                  }${invalidCount > 0 ? `, ${invalidCount} skipped` : ''}`}
              </span>
              <span className="font-semibold tabular-nums">
                {status === 'running' && eta > 0 && (
                  <span className="mr-3 font-normal text-muted-foreground">
                    ~{formatDuration(eta)} left
                  </span>
                )}
                {percent}%
              </span>
            </div>
            <Progress value={percent} aria-label="Generation progress" />
          </div>
        )}

        {/* ---------------- Result ---------------- */}
        {status === 'done' && zip && (
          <div className="space-y-4">
            <Button type="button" asChild size="lg">
              <a href={zip.url} download={zip.name}>
                <Download className="h-4 w-4 mr-1.5" />
                Download {zip.name} ({formatBytes(zip.bytes)})
              </a>
            </Button>

            {thumbs.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Preview of the first {thumbs.length} code{thumbs.length === 1 ? '' : 's'}
                </p>
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {thumbs.map((t, i) => (
                    <li key={`${t.label}-${i}`} className="space-y-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.src}
                        alt={`QR code for ${t.label}`}
                        className="aspect-square w-full rounded border bg-white object-contain p-1"
                        loading="lazy"
                      />
                      <p className="truncate text-xs text-muted-foreground" title={t.label}>
                        {t.label}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
