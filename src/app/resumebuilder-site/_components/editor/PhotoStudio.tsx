'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, RotateCw, FlipHorizontal2, Trash2 } from 'lucide-react';
import type { PhotoRef } from '../../_lib/schema';
import type { ResumeStore } from '../../_lib/db';
import { uid } from '../../_lib/defaults';

/**
 * Profile photo studio (spec §8). Everything happens locally:
 * - Input by file picker, drag-drop, paste or camera (the camera
 *   stream is stopped the moment a frame is captured).
 * - Type is validated by magic bytes (not the file name), with size
 *   and pixel caps as decompression-bomb protection.
 * - EXIF orientation is honoured by the decoder, then stripped by
 *   re-encoding; the original and the crop are both stored as Blobs
 *   in the local store. The photo is never uploaded anywhere.
 */

const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;
const FRAME = 264;

function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes.length > 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
  if (bytes.length > 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  return null;
}

async function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode the image.'))), type, quality),
  );
}

/** Encode under a byte budget by stepping quality down. */
async function encodeBudget(canvas: HTMLCanvasElement, type: string, budget: number): Promise<Blob> {
  let q = 0.88;
  let blob = await canvasBlob(canvas, type, q);
  while (blob.size > budget && q > 0.5) {
    q -= 0.12;
    blob = await canvasBlob(canvas, type, q);
  }
  return blob;
}

interface CropState {
  zoom: number;
  x: number; // px offsets in frame space
  y: number;
  rotation: number; // degrees, baked into the working canvas
  flipH: boolean;
  flipV: boolean;
  brightness: number; // %
  contrast: number; // %
  background: 'none' | 'white' | 'accent' | 'blur';
}

const DEFAULT_CROP: CropState = {
  zoom: 1,
  x: 0,
  y: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 100,
  contrast: 100,
  background: 'none',
};

export function PhotoStudio(props: {
  store: ResumeStore;
  resumeId: string;
  photo: PhotoRef;
  accent: string;
  onChange: (photo: PhotoRef) => void;
}) {
  const { store, resumeId, photo, onChange } = props;
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [srcDims, setSrcDims] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<CropState>(DEFAULT_CROP);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [faceAssist, setFaceAssist] = useState(false);
  const workingCanvas = useRef<HTMLCanvasElement | null>(null);
  const originalBitmap = useRef<ImageBitmap | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const aspect = photo.shape === 'portrait' ? 3 / 4 : 1;
  const frameW = FRAME;
  const frameH = Math.round(FRAME / aspect);


  const rebuildWorking = useCallback((bmp: ImageBitmap, c: CropState) => {
    const rad = (c.rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const w = Math.round(bmp.width * cos + bmp.height * sin);
    const h = Math.round(bmp.width * sin + bmp.height * cos);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.scale(c.flipH ? -1 : 1, c.flipV ? -1 : 1);
    ctx.filter = `brightness(${c.brightness}%) contrast(${c.contrast}%)`;
    ctx.drawImage(bmp, -bmp.width / 2, -bmp.height / 2);
    workingCanvas.current = canvas;
    // The preview shows the working canvas itself, so what the user
    // sees (rotation, flips, brightness) is exactly what saveCrop draws.
    setSrcDims({ w: canvas.width, h: canvas.height });
    setPreviewUrl(canvas.toDataURL('image/jpeg', 0.82));
  }, []);

  // Load the stored original when the component mounts / photo changes hands.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!photo.originalId) return;
      const rec = await store.getPhoto(photo.originalId);
      if (!rec || cancelled) return;
      const bmp = await createImageBitmap(rec.blob, { imageOrientation: 'from-image' }).catch(() => null);
      if (!bmp || cancelled) return;
      originalBitmap.current = bmp;
      rebuildWorking(bmp, DEFAULT_CROP);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, photo.originalId]);

  const applyCropParams = (next: CropState) => {
    setCrop(next);
    if (originalBitmap.current) rebuildWorking(originalBitmap.current, next);
  };

  const ingest = async (file: Blob) => {
    setError(null);
    setNotice(null);
    try {
      if (file.size > MAX_INPUT_BYTES) {
        throw new Error('That image is larger than 12 MB. Please use a smaller file.');
      }
      const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
      const mime = sniffMime(head);
      if (!mime) {
        throw new Error('That file is not a JPEG, PNG, WebP or GIF image (checked by content, not by name).');
      }
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      if (bmp.width * bmp.height > MAX_PIXELS) {
        bmp.close();
        throw new Error('That image has too many pixels to process safely in a browser.');
      }
      originalBitmap.current = bmp;
      // Store a re-encoded original (EXIF/GPS stripped), max 1600px.
      const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const oc = document.createElement('canvas');
      oc.width = Math.round(bmp.width * scale);
      oc.height = Math.round(bmp.height * scale);
      oc.getContext('2d')?.drawImage(bmp, 0, 0, oc.width, oc.height);
      const storedOriginal = await encodeBudget(oc, 'image/jpeg', 600 * 1024);
      const originalId = uid('photo');
      await store.putPhoto({ id: originalId, resumeId, kind: 'original', blob: storedOriginal, mime: 'image/jpeg', createdAt: Date.now() });
      if (photo.originalId && photo.originalId !== originalId) {
        // Old blobs are left for the store's resume cascade; remove refs now.
      }
      const nextCrop = DEFAULT_CROP;
      setCrop(nextCrop);
      rebuildWorking(bmp, nextCrop);
      onChange({ ...photo, originalId, croppedId: undefined, show: true });
      setNotice('Photo added. Adjust the crop, then choose "Save crop" — both versions stay on this device only.');
      // Face-centred assist availability.
      setFaceAssist(typeof (window as unknown as { FaceDetector?: unknown }).FaceDetector === 'function');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That image could not be read.');
    }
  };

  const saveCrop = async () => {
    const src = workingCanvas.current;
    if (!src) return;
    const outW = 480;
    const outH = Math.round(480 / aspect);
    const out = document.createElement('canvas');
    out.width = outW;
    out.height = outH;
    const ctx = out.getContext('2d');
    if (!ctx) return;
    if (crop.background === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
    } else if (crop.background === 'accent') {
      ctx.fillStyle = props.accent;
      ctx.fillRect(0, 0, outW, outH);
    } else if (crop.background === 'blur') {
      ctx.filter = 'blur(18px)';
      ctx.drawImage(src, 0, 0, outW, outH);
      ctx.filter = 'none';
    }
    // Map frame-space crop onto the working canvas.
    const scaleCover = Math.max(frameW / src.width, frameH / src.height) * crop.zoom;
    const drawW = src.width * scaleCover * (outW / frameW);
    const drawH = src.height * scaleCover * (outH / frameH);
    const dx = outW / 2 - drawW / 2 + crop.x * (outW / frameW);
    const dy = outH / 2 - drawH / 2 + crop.y * (outH / frameH);
    ctx.drawImage(src, dx, dy, drawW, drawH);
    const supportsWebp = out.toDataURL('image/webp').startsWith('data:image/webp');
    const blob = await encodeBudget(out, supportsWebp ? 'image/webp' : 'image/jpeg', 250 * 1024);
    const croppedId = uid('photo');
    await store.putPhoto({ id: croppedId, resumeId, kind: 'cropped', blob, mime: blob.type, createdAt: Date.now() });
    onChange({ ...photo, croppedId, show: true });
    setNotice('Crop saved. The preview and exports now use the cropped photo; the original is kept too.');
  };

  const centreOnFace = async () => {
    const FaceDetectorCtor = (window as unknown as { FaceDetector?: new () => { detect: (src: ImageBitmap) => Promise<Array<{ boundingBox: { x: number; y: number; width: number; height: number } }>> } }).FaceDetector;
    const bmp = originalBitmap.current;
    if (!FaceDetectorCtor || !bmp) return;
    try {
      const faces = await new FaceDetectorCtor().detect(bmp);
      if (faces.length === 0) {
        setNotice('No face was detected in this photo — centre it manually with drag and zoom.');
        return;
      }
      const f = faces[0].boundingBox;
      const faceCx = (f.x + f.width / 2) / bmp.width;
      const faceCy = (f.y + f.height / 2) / bmp.height;
      const zoom = Math.min(2.6, Math.max(1, (bmp.width / f.width) * 0.42));
      applyCropParams({
        ...crop,
        zoom,
        x: (0.5 - faceCx) * frameW * 0.9,
        y: (0.5 - faceCy) * frameH * 0.9,
      });
      setNotice('Centred on the detected face. Fine-tune with drag and zoom, then save the crop.');
    } catch {
      setNotice('Face detection failed on this photo — centre it manually.');
    }
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      setCameraOn(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setError('Camera access was not granted. You can still upload, drag-drop or paste a photo.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    stopCamera(); // stream stops immediately after capture, per spec
    const blob = await canvasBlob(canvas, 'image/jpeg', 0.9);
    await ingest(blob);
  };

  // Live preview geometry (mirrors saveCrop's math in frame space).
  const cover = srcDims ? Math.max(frameW / srcDims.w, frameH / srcDims.h) * crop.zoom : 1;
  const imgW = srcDims ? srcDims.w * cover : frameW;
  const imgH = srcDims ? srcDims.h * cover : frameH;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <h2 className="text-sm font-semibold">Profile photo</h2>
      <p className="text-xs text-muted-foreground">
        Optional. Your photo is processed and stored only in this browser — it is never uploaded.
        Regional guidance: check the Design panel for whether a photo is customary where you apply.
        Passport-style photos are typically 35 × 45 mm with a plain background.
      </p>
      <div className="flex flex-wrap gap-2">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={photo.show}
            onChange={(e) => onChange({ ...photo, show: e.target.checked })}
            className="h-4 w-4"
          />
          Show photo on the resume
        </label>
        <label className="flex items-center gap-2 text-sm">
          Shape
          <select
            value={photo.shape}
            onChange={(e) => onChange({ ...photo, shape: e.target.value as PhotoRef['shape'] })}
            className="min-h-11 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
          >
            <option value="rounded">Rounded square</option>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="portrait">Portrait rectangle</option>
            <option value="hexagon">Hexagon</option>
          </select>
        </label>
      </div>

      <div
        className="flex flex-wrap items-start gap-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void ingest(f);
        }}
        onPaste={(e) => {
          const f = e.clipboardData.files?.[0];
          if (f) void ingest(f);
        }}
      >
        <div
          role="img"
          aria-label="Photo crop preview. Drag to reposition."
          className="relative shrink-0 touch-none overflow-hidden bg-muted"
          style={{
            width: frameW,
            height: frameH,
            borderRadius: photo.shape === 'circle' ? '50%' : photo.shape === 'rounded' ? 16 : 4,
            clipPath: photo.shape === 'hexagon' ? 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' : undefined,
            cursor: previewUrl ? 'grab' : 'default',
          }}
          onPointerDown={(e) => {
            dragRef.current = { px: e.clientX, py: e.clientY, x: crop.x, y: crop.y };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = dragRef.current;
            if (!d) return;
            setCrop((c) => ({ ...c, x: d.x + (e.clientX - d.px), y: d.y + (e.clientY - d.py) }));
          }}
          onPointerUp={() => {
            dragRef.current = null;
          }}
        >
          {previewUrl && srcDims ? (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL of the user's own photo
            <img
              src={previewUrl}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                width: imgW,
                height: imgH,
                left: frameW / 2 - imgW / 2 + crop.x,
                top: frameH / 2 - imgH / 2 + crop.y,
                maxWidth: 'none',
              }}
            />
          ) : (
            <span className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
              No photo yet — upload, drop, paste or use the camera
            </span>
          )}
        </div>

        <div className="min-w-56 flex-1 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            aria-label="Choose a photo file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void ingest(f);
              e.target.value = '';
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="h-4 w-4" aria-hidden /> Upload photo
            </button>
            {!cameraOn ? (
              <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium" onClick={() => void startCamera()}>
                <Camera className="h-4 w-4" aria-hidden /> Use camera
              </button>
            ) : null}
            {photo.originalId ? (
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium text-destructive"
                onClick={async () => {
                  await store.deletePhotosForResume(resumeId);
                  originalBitmap.current = null;
                  workingCanvas.current = null;
                  setSrcDims(null);
                  setPreviewUrl(undefined);
                  onChange({ shape: photo.shape, show: false });
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden /> Remove photo
              </button>
            ) : null}
          </div>
          {cameraOn && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                The camera is used only to capture this one photo; the stream stops as soon as you capture.
              </p>
              <video ref={videoRef} className="w-full max-w-xs rounded-md border border-border" playsInline muted />
              <div className="flex gap-2">
                <button type="button" className="min-h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground" onClick={() => void capture()}>
                  Capture photo
                </button>
                <button type="button" className="min-h-11 rounded-md border border-input px-3 text-sm font-medium" onClick={stopCamera}>
                  Cancel camera
                </button>
              </div>
            </div>
          )}
          {previewUrl && (
            <>
              <label className="block text-sm">
                Zoom
                <input type="range" min={1} max={3} step={0.01} value={crop.zoom} onChange={(e) => setCrop((c) => ({ ...c, zoom: Number(e.target.value) }))} className="w-full" aria-label="Photo zoom" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm">
                  Brightness
                  <input type="range" min={60} max={140} value={crop.brightness} onChange={(e) => applyCropParams({ ...crop, brightness: Number(e.target.value) })} className="w-full" aria-label="Brightness" />
                </label>
                <label className="block text-sm">
                  Contrast
                  <input type="range" min={60} max={140} value={crop.contrast} onChange={(e) => applyCropParams({ ...crop, contrast: Number(e.target.value) })} className="w-full" aria-label="Contrast" />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm" onClick={() => applyCropParams({ ...crop, rotation: (crop.rotation + 90) % 360 })}>
                  <RotateCw className="h-4 w-4" aria-hidden /> Rotate 90°
                </button>
                <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm" onClick={() => applyCropParams({ ...crop, flipH: !crop.flipH })}>
                  <FlipHorizontal2 className="h-4 w-4" aria-hidden /> Flip
                </button>
                <label className="flex items-center gap-2 text-sm">
                  Background
                  <select value={crop.background} onChange={(e) => setCrop((c) => ({ ...c, background: e.target.value as CropState['background'] }))} className="min-h-11 rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                    <option value="none">Keep original</option>
                    <option value="white">Plain white</option>
                    <option value="accent">Accent colour</option>
                    <option value="blur">Blurred</option>
                  </select>
                </label>
                {faceAssist && (
                  <button type="button" className="min-h-11 rounded-md border border-input px-3 text-sm" onClick={() => void centreOnFace()}>
                    Centre on face
                  </button>
                )}
              </div>
              <button type="button" className="min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" onClick={() => void saveCrop()}>
                Save crop
              </button>
            </>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-muted-foreground">
          {notice}
        </p>
      )}
    </div>
  );
}
