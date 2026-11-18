'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../_lib/store';
import { nowIso, uid, type MediaItem } from '../_lib/types';

export const MAX_MEDIA_BYTES = 50 * 1024 * 1024; // 50 MB per file
const ACCEPTED = /^image\/|^video\//;

async function imageThumbnail(file: File): Promise<Partial<MediaItem>> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const scale = Math.min(1, 320 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return { width: img.naturalWidth, height: img.naturalHeight };
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const thumb = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.8),
    );
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      thumbnailBlob: thumb ?? undefined,
    };
  } catch {
    return {};
  } finally {
    URL.revokeObjectURL(url);
  }
}

function useObjectUrl(blob: Blob | undefined): string | null {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}

function MediaThumb({ item }: { item: MediaItem }) {
  const url = useObjectUrl(item.thumbnailBlob ?? (item.mimeType.startsWith('image/') ? item.blob : undefined));
  if (item.mimeType.startsWith('video/')) {
    return (
      <span className="flex h-16 w-16 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground">
        VIDEO
        <br />
        {(item.size / 1024 / 1024).toFixed(1)} MB
      </span>
    );
  }
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element -- local blob thumbnail
    return <img src={url} alt="" className="h-16 w-16 rounded object-cover" />;
  }
  return <span className="flex h-16 w-16 items-center justify-center rounded bg-muted text-[10px]">FILE</span>;
}

/**
 * Local media attachments (spec §8). Files are stored as blobs in the
 * browser database — never uploaded anywhere.
 */
export function MediaManager({
  mediaIds,
  onChange,
}: {
  mediaIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const items = mediaIds
    .map((id) => store.data.media.find((m) => m.id === id))
    .filter((m): m is MediaItem => Boolean(m));
  const totalBytes = store.data.media.reduce((sum, m) => sum + m.size, 0);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    const newIds: string[] = [];
    for (const file of [...files]) {
      if (!ACCEPTED.test(file.type)) {
        setError(`"${file.name}" is not an image or video file and was skipped.`);
        continue;
      }
      if (file.size > MAX_MEDIA_BYTES) {
        setError(
          `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB — the per-file limit is 50 MB. It was skipped.`,
        );
        continue;
      }
      const extra = file.type.startsWith('image/') ? await imageThumbnail(file) : {};
      const item: MediaItem = {
        id: uid(),
        workspaceId: ws.id,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        blob: file,
        altText: '',
        createdAt: nowIso(),
        ...extra,
      };
      await store.put('media', item);
      newIds.push(item.id);
    }
    if (newIds.length) onChange([...mediaIds, ...newIds]);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...mediaIds];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <fieldset className="text-sm">
      <legend className="font-medium">
        Media attachments (stored on this device only)
      </legend>
      {error && (
        <p role="alert" className="mt-1 rounded bg-amber-100 px-2 py-1 text-xs text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
          {error}
        </p>
      )}
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex items-start gap-3 rounded-lg border border-border p-2">
            <MediaThumb item={item} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {(item.size / 1024).toFixed(0)} KB
                {item.width ? ` · ${item.width}×${item.height}` : ''} · {item.mimeType}
              </p>
              <input
                value={item.altText}
                onChange={(e) => void store.put('media', { ...item, altText: e.target.value })}
                placeholder="Alt text (accessibility)…"
                aria-label={`Alt text for ${item.name}`}
                className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
              {!item.altText && item.mimeType.startsWith('image/') && (
                <p className="mt-0.5 text-[11px] text-amber-600 dark:text-amber-400">
                  Missing alt text — add a short description for screen readers.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" aria-label={`Move ${item.name} earlier`} className="rounded border border-border px-1.5 text-xs" onClick={() => move(i, -1)}>↑</button>
              <button type="button" aria-label={`Move ${item.name} later`} className="rounded border border-border px-1.5 text-xs" onClick={() => move(i, 1)}>↓</button>
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                className="rounded border border-red-300 px-1.5 text-xs text-red-600"
                onClick={async () => {
                  onChange(mediaIds.filter((id) => id !== item.id));
                  await store.remove('media', item.id);
                }}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-muted-foreground">No media attached yet.</li>
        )}
      </ul>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5"
          onClick={() => fileRef.current?.click()}
        >
          Attach images / video
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          aria-label="Attach media files"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <span className="text-xs text-muted-foreground">
          Workspace media total: {(totalBytes / 1024 / 1024).toFixed(2)} MB
        </span>
      </div>
    </fieldset>
  );
}
