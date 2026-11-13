'use client';

/**
 * Base64 tools, both directions:
 * - encode: image file → data URL string (with the real size overhead shown)
 * - decode: pasted data URL / raw base64 → preview + downloadable image,
 *   with the format detected from magic bytes, never from a claim.
 */
import { useState } from 'react';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';

function sniffExtension(bytes: Uint8Array): string {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'png';
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'gif';
  if (bytes[8] === 0x57 && bytes[9] === 0x45) return 'webp';
  return 'bin';
}

export function ImageToBase64Tool() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handle = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setDataUrl(reader.result as string);
      setFileInfo({ name: file.name, size: file.size });
    };
    reader.onerror = () => setError('That file could not be read.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={handle} label="Drop an image to encode as Base64" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">{error}</p>
      )}
      {dataUrl && fileInfo && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">{fileInfo.name}</span>
            <span className="text-muted-foreground">
              {formatBytes(fileInfo.size)} → {formatBytes(dataUrl.length)} as Base64 (
              {Math.round((dataUrl.length / Math.max(1, fileInfo.size) - 1) * 100)}% larger — Base64
              always costs about a third more)
            </span>
            <span className="ml-auto flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                onClick={() => {
                  void navigator.clipboard.writeText(dataUrl).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  });
                }}
              >
                {copied ? 'Copied!' : 'Copy data URL'}
              </button>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                onClick={() => {
                  const blob = new Blob([dataUrl], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${fileInfo.name}.base64.txt`;
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 5000);
                }}
              >
                Download .txt
              </button>
            </span>
          </div>
          <textarea
            readOnly
            value={dataUrl}
            rows={8}
            className="mt-3 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs break-all"
            aria-label="Base64 data URL"
            onFocus={(e) => e.target.select()}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            The string includes the <code>data:image/…;base64,</code> prefix, ready to paste into
            HTML <code>&lt;img src&gt;</code>, CSS or JSON. Very long strings can slow a page down —
            for big photos, a real file is better.
          </p>
        </div>
      )}
    </div>
  );
}

export function Base64ToImageTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ url: string; ext: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    setError(null);
    setResult(null);
    try {
      const trimmed = input.trim();
      if (!trimmed) {
        setError('Paste a data URL or raw Base64 string first.');
        return;
      }
      const base64 = trimmed.startsWith('data:') ? trimmed.split(',')[1] ?? '' : trimmed.replace(/\s/g, '');
      if (!base64 || /[^A-Za-z0-9+/=]/.test(base64)) {
        setError('That does not look like valid Base64 (unexpected characters).');
        return;
      }
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const ext = sniffExtension(bytes);
      if (ext === 'bin') {
        setError('Decoded successfully, but the bytes are not a JPG, PNG, GIF or WebP image.');
        return;
      }
      const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mime });
      setResult({ url: URL.createObjectURL(blob), ext, size: blob.size });
    } catch {
      setError('That string could not be decoded — check it was copied completely.');
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <label className="block">
          <span className="text-xs font-medium">Paste a data URL or raw Base64</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="data:image/png;base64,iVBORw0KGgo…"
            className="mt-1 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs break-all"
          />
        </label>
        <button type="button" onClick={convert} className="mt-3 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
          Decode to image
        </button>
        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
            {error}
          </p>
        )}
        {result && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Decoded from Base64" className="mx-auto block max-h-80 w-auto max-w-full rounded-lg border border-border object-contain" />
            <p className="mt-3 text-center text-sm">
              Detected format: <strong>{result.ext.toUpperCase()}</strong> · {formatBytes(result.size)}{' '}
              <a href={result.url} download={`decoded-image.${result.ext}`} className="ml-2 font-medium text-blue-700 underline">
                Download
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
