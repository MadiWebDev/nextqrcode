'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage, type DecodedImage } from '../_lib/engine/decode';

export interface LoadedImage {
  file: File;
  name: string;
  sizeBytes: number;
  decoded: DecodedImage;
  previewUrl: string;
}

/**
 * Shared single-image loading state for tools: file → decode → preview,
 * with object-URL cleanup and honest error surfacing. Every tool uses the
 * same loader so behaviour (and privacy notes) stay consistent.
 */
export function useImageLoader() {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef<LoadedImage | null>(null);

  const load = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const decoded = await decodeImage(browserEnv, file);
      const next: LoadedImage = {
        file,
        name: file.name,
        sizeBytes: file.size,
        decoded,
        previewUrl: URL.createObjectURL(file),
      };
      if (loadedRef.current) URL.revokeObjectURL(loadedRef.current.previewUrl);
      loadedRef.current = next;
      setLoaded(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That file could not be opened.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (loadedRef.current) URL.revokeObjectURL(loadedRef.current.previewUrl);
    };
  }, []);

  return { loaded, loading, error, load, setError };
}

export interface ResultImage {
  blob: Blob;
  url: string;
  filename: string;
  width: number;
  height: number;
  note?: string;
}

/** Result state with object-URL lifecycle handled. */
export function useResultImage() {
  const [result, setResultState] = useState<ResultImage | null>(null);
  const urlRef = useRef<string | null>(null);

  const setResult = useCallback((next: Omit<ResultImage, 'url'> | null) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    if (next) {
      const url = URL.createObjectURL(next.blob);
      urlRef.current = url;
      setResultState({ ...next, url });
    } else {
      urlRef.current = null;
      setResultState(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  return { result, setResult };
}
