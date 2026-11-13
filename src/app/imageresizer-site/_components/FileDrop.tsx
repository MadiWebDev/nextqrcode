'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';

interface FileDropProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  /** Also accept images pasted from the clipboard (default true). */
  paste?: boolean;
  label?: string;
  hint?: string;
}

/**
 * Shared upload surface for every tool: drag & drop, browse, and clipboard
 * paste. Validation happens in the caller (the engine's inspectFile), so
 * this component stays dumb about formats.
 */
export function FileDrop({ onFiles, multiple = false, paste = true, label, hint }: FileDropProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const deliver = useCallback(
    (list: FileList | File[] | null) => {
      if (!list) return;
      const files = Array.from(list);
      if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
    },
    [multiple, onFiles]
  );

  useEffect(() => {
    if (!paste) return;
    const onPaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? []);
      if (files.length > 0) {
        event.preventDefault();
        deliver(files);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [paste, deliver]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label ?? 'Upload an image'}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        deliver(e.dataTransfer.files);
      }}
      className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        dragging ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <ImagePlus className="mx-auto w-9 h-9 text-primary" aria-hidden />
      <p className="mt-3 text-sm font-semibold">{label ?? 'Drop an image here, or click to browse'}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {hint ?? 'JPG, PNG, WebP, AVIF, GIF, BMP, TIFF, HEIC or SVG — processed locally, never uploaded'}
        {paste ? ' · You can also paste from the clipboard' : ''}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif,.tif,.tiff,.svg"
        multiple={multiple}
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          deliver(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
