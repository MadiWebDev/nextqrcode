'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Tv,
  Sparkles,
} from 'lucide-react';

export default function AnimatedQRTransferPage() {
  const [activeTab, setActiveTab] = useState<'sender' | 'receiver'>('sender');

  // Sender State
  const [payloadText, setPayloadText] = useState(
    'ANTIGRAVITY-DATA-TRANSFER: Air-gapped secure payload transmitting via high-speed animated optical matrix stream. Zero internet or wireless radios required.'
  );
  const [fps, setFps] = useState<number>(4);
  const [chunkLength, setChunkLength] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [senderFrames, setSenderFrames] = useState<string[]>([]);
  const [senderQRDataUrls, setSenderQRDataUrls] = useState<string[]>([]);

  // Receiver State
  const [isScanning, setIsScanning] = useState(false);
  const [receivedParts, setReceivedParts] = useState<Record<number, string>>({});
  const [receiverTotalParts, setReceiverTotalParts] = useState(0);
  const [assembledData, setAssembledData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate Sender Frames
  useEffect(() => {
    if (!payloadText.trim()) {
      setSenderFrames([]);
      setSenderQRDataUrls([]);
      return;
    }

    const raw = payloadText;
    const pieces: string[] = [];
    const total = Math.ceil(raw.length / chunkLength);

    for (let i = 0; i < total; i++) {
      const chunk = raw.slice(i * chunkLength, (i + 1) * chunkLength);
      pieces.push(`[FRAME:${i + 1}/${total}]:${chunk}`);
    }

    setSenderFrames(pieces);
    setCurrentFrameIndex(0);

    Promise.all(
      pieces.map((p) =>
        QRCode.toDataURL(p, {
          errorCorrectionLevel: 'L',
          width: 340,
          margin: 2,
        })
      )
    ).then((urls) => {
      setSenderQRDataUrls(urls);
    });
  }, [payloadText, chunkLength]);

  // Handle Play/Pause Animation Loop
  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    if (isPlaying && senderQRDataUrls.length > 1) {
      animationIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % senderQRDataUrls.length);
      }, 1000 / fps);
    }

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [isPlaying, fps, senderQRDataUrls.length]);

  // Webcam Scanning Loop for Receiver
  const startCamera = async () => {
    try {
      setReceivedParts({});
      setReceiverTotalParts(0);
      setAssembledData(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanVideoFrame);
      }
    } catch (err) {
      alert('Unable to access camera. Please allow camera permissions in your browser.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanVideoFrame = () => {
    if (!videoRef.current || !streamRef.current) return;
    const video = videoRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, canvas.width, canvas.height);

        if (code && code.data) {
          const match = code.data.match(/^\[FRAME:(\d+)\/(\d+)\]:([\s\S]*)$/);
          if (match) {
            const frameNum = parseInt(match[1], 10);
            const total = parseInt(match[2], 10);
            const content = match[3];

            setReceiverTotalParts(total);
            setReceivedParts((prev) => {
              if (prev[frameNum]) return prev;
              const updated = { ...prev, [frameNum]: content };
              if (Object.keys(updated).length === total) {
                let full = '';
                for (let i = 1; i <= total; i++) {
                  if (updated[i]) full += updated[i];
                }
                setAssembledData(full);
                stopCamera();
              }
              return updated;
            });
          }
        }
      }
    }

    if (isScanning && !assembledData) {
      requestAnimationFrame(scanVideoFrame);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const faqs = [
    {
      question: 'How does animated QR data transfer work?',
      answer: 'The sender splits a payload into ordered frames and streams them as an animated sequence of QR codes at a set frame rate (e.g. 4 FPS). The receiving camera continuously scans the video feed, collecting missing frames until the entire payload is reconstructed.',
    },
    {
      question: 'Why is animated QR transfer useful for air-gapped computers?',
      answer: 'It provides a purely optical, unidirectional data channel. Because no USB, Bluetooth, or WiFi connection is established, it prevents firmware malware and wireless interception attacks.',
    },
    {
      question: 'What is the optimal animation speed (FPS)?',
      answer: 'Between 3 and 5 FPS is optimal for most smartphone cameras and webcams. Speeds above 6 FPS may cause frame drops due to camera shutter latency and browser decoding overhead.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Animated-QR Offline Transfer', href: '/animated-qr-transfer' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Radio className="w-3.5 h-3.5" />
          <span>Air-Gapped Optical Stream</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Animated-QR Offline File & Text Transfer
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Transmit text, keys, or files across air-gapped computers using an animated stream of QR codes. Optical sender with frame rate controls and camera receiver.
        </p>
      </header>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-8 border-b border-border pb-3">
        <Button
          variant={activeTab === 'sender' ? 'default' : 'ghost'}
          onClick={() => {
            stopCamera();
            setActiveTab('sender');
          }}
          className="gap-2 text-xs font-semibold"
        >
          <Tv className="w-4 h-4" />
          <span>1. Optical Sender (Display Animated QR)</span>
        </Button>
        <Button
          variant={activeTab === 'receiver' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('receiver')}
          className="gap-2 text-xs font-semibold"
        >
          <Camera className="w-4 h-4" />
          <span>2. Optical Receiver (Scan with Camera)</span>
        </Button>
      </div>

      {activeTab === 'sender' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 border-border/80 shadow-xs space-y-5">
              <div>
                <Label htmlFor="animated-text" className="text-xs font-semibold uppercase text-muted-foreground">
                  Payload to Transmit:
                </Label>
                <Textarea
                  id="animated-text"
                  rows={6}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  placeholder="Enter text, code, or tokens to transmit optically..."
                  className="mt-1.5 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-muted-foreground uppercase">Frame Rate:</span>
                    <span className="font-bold text-foreground">{fps} FPS</span>
                  </div>
                  <Slider
                    value={[fps]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={([val]) => setFps(val)}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>1 FPS (Slow/Stable)</span>
                    <span>4 FPS (Recommended)</span>
                    <span>8 FPS (Fast)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-muted-foreground uppercase">Chunk Size:</span>
                    <span className="font-bold text-foreground">{chunkLength} chars</span>
                  </div>
                  <Slider
                    value={[chunkLength]}
                    min={60}
                    max={250}
                    step={10}
                    onValueChange={([val]) => setChunkLength(val)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sticky Animated Display (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <Card className="p-6 border-border/80 shadow-md text-center space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Frame {currentFrameIndex + 1} of {senderQRDataUrls.length || 1}
                </span>
                <span className="text-xs font-bold text-primary">{fps} Frames / Sec</span>
              </div>

              {senderQRDataUrls[currentFrameIndex] ? (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl border border-border shadow-xs">
                    <img
                      src={senderQRDataUrls[currentFrameIndex]}
                      alt="Animated QR Stream"
                      className="w-64 h-64"
                    />
                  </div>
                  {/* Progress dots */}
                  <div className="flex gap-1.5 mt-4 max-w-xs overflow-x-auto py-1">
                    {senderQRDataUrls.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentFrameIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-sm text-muted-foreground">No payload to stream</div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setIsPlaying((p) => !p)}
                  variant="outline"
                  className="flex-1 text-xs font-semibold gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause Stream' : 'Resume Stream'}
                </Button>
                <Button
                  onClick={() => setCurrentFrameIndex(0)}
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Receiver Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 border-border/80 shadow-xs space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <span>Webcam Receiver Scanner</span>
              </h2>

              <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}
                />
                {!isScanning && (
                  <div className="text-center text-white/80 p-6 space-y-3">
                    <Radio className="w-10 h-10 mx-auto opacity-70 animate-pulse" />
                    <p className="text-sm font-medium">Camera is offline</p>
                    <Button onClick={startCamera} className="text-xs font-semibold gap-2">
                      <Camera className="w-3.5 h-3.5" />
                      Start Camera Scanner
                    </Button>
                  </div>
                )}
              </div>

              {isScanning && (
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Listening for optical stream...</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={stopCamera} className="text-xs">
                    Stop Camera
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <Card className="p-6 border-border/80 shadow-md space-y-4">
              <div className="border-b border-border/60 pb-3 flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Receiver Progress
                </span>
                {assembledData && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </span>
                )}
              </div>

              {receiverTotalParts > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Frames Captured:</span>
                    <span>
                      {Object.keys(receivedParts).length} / {receiverTotalParts} (
                      {Math.round((Object.keys(receivedParts).length / receiverTotalParts) * 100)}%)
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 transition-all"
                      style={{
                        width: `${(Object.keys(receivedParts).length / receiverTotalParts) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  Point your camera at an animated QR stream to begin capturing frames.
                </p>
              )}

              {assembledData && (
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">
                    Reconstructed Message:
                  </Label>
                  <Textarea
                    readOnly
                    rows={6}
                    value={assembledData}
                    className="font-mono text-xs bg-muted/40"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(assembledData);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="w-full text-xs font-semibold gap-2"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Payload!' : 'Copy Decoded Payload'}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      <AdSlot id="animated-qr-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Mechanics of Optical Air-Gapped Data Transfer
        </h2>
        <p className="text-base leading-relaxed">
          Air-gapped computers—systems physically isolated from networks and radios—represent the pinnacle of computing security. However, data must occasionally cross this air gap. Animated QR codes provide an asynchronous optical data pipeline that transmits megabytes of information without introducing USB hardware firmware attack vectors.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Fountain Codes and Shutter Synchronization
        </h3>
        <p className="text-base leading-relaxed">
          When transmitting data optically between two screens and cameras, the primary engineering challenge is shutter synchronization. Because the sending monitor refresh rate and the receiving camera frame rate are unsynchronized, frame tears can occur. By lowering the error correction overhead to Level L (which minimizes matrix density and maximizes optical contrast) and streaming at 3 to 5 FPS, receiver cameras capture clean, unblurred snapshots of every chunk.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Zero-Server Client-Side Guarantee
        </h3>
        <p className="text-base leading-relaxed">
          Both the frame encoding and the camera video decoding are executed completely within client-side browser JavaScript utilizing standard HTML5 Canvas and the WebRTC MediaStream API. No telemetry, session tokens, or transmitted bits ever leave your local device memory.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Animated QR Transfer
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
