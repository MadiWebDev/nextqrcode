'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Check,
  Copy,
  ExternalLink,
  ImageUp,
  QrCode,
  RotateCcw,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react';

const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'short.link',
];

/** ASCII character combos commonly used in lookalike (typosquat) domains. */
const LOOKALIKE_PATTERNS = ['rn', 'vv', 'cl', '0o', '1l'];

interface UrlAnalysis {
  isUrl: boolean;
  url: URL | null;
  host: string;
  warnings: string[];
}

function analyzePayload(text: string): UrlAnalysis {
  const trimmed = text.trim();
  let url: URL | null = null;
  try {
    const candidate = new URL(trimmed);
    if (candidate.protocol === 'http:' || candidate.protocol === 'https:') {
      url = candidate;
    }
  } catch {
    url = null;
  }

  if (!url) {
    return { isUrl: false, url: null, host: '', warnings: [] };
  }

  const host = url.hostname.toLowerCase();
  const warnings: string[] = [];

  if (URL_SHORTENERS.some((s) => host === s || host.endsWith(`.${s}`))) {
    warnings.push(
      'URL shortener — the real destination is hidden until you visit it. Verify the sender before opening.'
    );
  }
  if (url.protocol !== 'https:') {
    warnings.push(
      'Not HTTPS — anything you type or send on this page is not encrypted. Avoid entering passwords or payment details.'
    );
  }
  if (host.includes('xn--')) {
    warnings.push(
      'Punycode host — the domain uses non-Latin characters and may be a lookalike of a trusted site.'
    );
  } else if (/[^\x00-\x7F]/.test(host)) {
    warnings.push(
      'Non-Latin characters in the domain — lookalike domains often use them to impersonate trusted sites.'
    );
  }
  if (LOOKALIKE_PATTERNS.some((p) => host.includes(p))) {
    warnings.push(
      'Suspicious character combination in the domain — a common trick in lookalike (typosquat) URLs.'
    );
  }

  return { isUrl: true, url, host, warnings };
}

export function ScannerClient() {
  const [tab, setTab] = useState<'camera' | 'upload'>('camera');
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysis = useMemo(() => (decoded ? analyzePayload(decoded) : null), [decoded]);

  function stopCamera() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanning(false);
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function handleDecoded(text: string) {
    setDecoded(text);
    setCopied(false);
  }

  async function startCamera() {
    setCameraError(null);
    setDecoded(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Camera access is not available in this browser. Upload an image of the QR code instead.'
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      setScanning(true);

      const tick = () => {
        const currentVideo = videoRef.current;
        const canvas = scanCanvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (
          currentVideo &&
          canvas &&
          ctx &&
          currentVideo.readyState === currentVideo.HAVE_ENOUGH_DATA
        ) {
          canvas.width = currentVideo.videoWidth;
          canvas.height = currentVideo.videoHeight;
          ctx.drawImage(currentVideo, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            handleDecoded(code.data);
            stopCamera();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setCameraError(
          'Camera permission was denied. Allow camera access in your browser settings, or upload an image of the QR code instead.'
        );
      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        setCameraError('No suitable camera was found on this device. Upload an image instead.');
      } else {
        setCameraError(
          'Could not start the camera. Check that no other app is using it, or upload an image instead.'
        );
      }
    }
  }

  function decodeCanvasImage(img: HTMLImageElement, canvas: HTMLCanvasElement): string | null {
    const MAX_DIM = 1600;
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    return code?.data ?? null;
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUploadError(null);
    setDecoded(null);
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not load the image.'));
        img.src = objectUrl;
      });
      const canvas = uploadCanvasRef.current;
      const result = canvas ? decodeCanvasImage(img, canvas) : null;
      if (result) {
        handleDecoded(result);
      } else {
        setUploadError('No QR code found in this image. Try a sharper photo or a different file.');
      }
    } catch {
      setUploadError('Could not read that file. Please choose a valid image file.');
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function resetAll() {
    stopCamera();
    setDecoded(null);
    setCameraError(null);
    setUploadError(null);
    setUploadFileName(null);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'camera' | 'upload')}>
        <TabsList className="grid w-full grid-cols-2" aria-label="Scan method">
          <TabsTrigger value="camera">
            <Camera className="h-4 w-4 mr-1.5" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload">
            <ImageUp className="h-4 w-4 mr-1.5" />
            Upload image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
                aria-label="Camera preview for QR scanning"
              />
              <canvas ref={scanCanvasRef} className="hidden" aria-hidden="true" />
              {!scanning && !decoded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Point your camera at a QR code. Scanning stops automatically once a code is
                    found.
                  </p>
                </div>
              )}
            </div>

            {cameraError && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Camera unavailable</AlertTitle>
                <AlertDescription>
                  {cameraError}{' '}
                  <button
                    type="button"
                    className="underline font-medium"
                    onClick={() => setTab('upload')}
                  >
                    Switch to image upload
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-3">
              {!scanning ? (
                <Button type="button" onClick={startCamera}>
                  <Camera className="h-4 w-4 mr-1.5" />
                  Start camera scan
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={stopCamera}>
                  Stop camera
                </Button>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-upload">Choose an image containing a QR code</Label>
              <Input
                id="qr-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {uploadFileName && (
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  File: {uploadFileName}
                </p>
              )}
            </div>
            <canvas ref={uploadCanvasRef} className="hidden" aria-hidden="true" />
            {uploadError && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>No QR code found</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {decoded && analysis && (
        <Card className="p-6 space-y-5" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Scan result</h2>
            <Button type="button" variant="outline" size="sm" onClick={resetAll}>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Scan again
            </Button>
          </div>

          {analysis.isUrl && analysis.url ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Destination host</Label>
                <p className="text-2xl font-bold tracking-tight break-all">{analysis.host}</p>
                <div className="flex gap-2">
                  {analysis.warnings.length === 0 ? (
                    <Badge variant="secondary">
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Looks clean
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                      {analysis.warnings.length} warning
                      {analysis.warnings.length === 1 ? '' : 's'}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="decoded-url">Full URL</Label>
                <Input id="decoded-url" value={analysis.url.toString()} readOnly />
              </div>

              {analysis.warnings.map((warning) => (
                <Alert key={warning} variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Safety warning</AlertTitle>
                  <AlertDescription>{warning}</AlertDescription>
                </Alert>
              ))}

              <div className="flex flex-wrap gap-3">
                <Button type="button" asChild>
                  <a href={analysis.url.toString()} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    Open link
                  </a>
                </Button>
                <Button type="button" variant="outline" onClick={() => copyText(decoded)}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Links are never opened automatically — always check the destination before visiting.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="decoded-text">Decoded text</Label>
                <Textarea
                  id="decoded-text"
                  value={decoded}
                  readOnly
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              <Button type="button" variant="outline" onClick={() => copyText(decoded)}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      )}

      {!decoded && (
        <p className="text-sm text-muted-foreground">
          All decoding happens on your device — scanned images and results never leave your browser.
        </p>
      )}
    </div>
  );
}
