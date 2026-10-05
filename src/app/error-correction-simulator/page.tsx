'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Wrench,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Paintbrush,
  Sparkles,
  Info,
} from 'lucide-react';

export default function ErrorCorrectionSimulatorPage() {
  const [text, setText] = useState('https://qrstudio.app');
  const [eccLevel, setEccLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brushColor, setBrushColor] = useState<'white' | 'black' | 'red'>('white');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDecodable, setIsDecodable] = useState(true);
  const [damagedPercent, setDamagedPercent] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Recovery capacity mapping
  const capacityMap = {
    L: 7,
    M: 15,
    Q: 25,
    H: 30,
  };

  // Generate base QR code onto the canvas
  const renderQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const size = 360;
      canvas.width = size;
      canvas.height = size;

      await QRCode.toCanvas(canvas, text, {
        errorCorrectionLevel: eccLevel,
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Save a pristine copy in an offscreen canvas
      const base = document.createElement('canvas');
      base.width = size;
      base.height = size;
      const bCtx = base.getContext('2d');
      bCtx?.drawImage(canvas, 0, 0);
      baseCanvasRef.current = base;

      testReadability();
      setDamagedPercent(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    renderQRCode();
  }, [text, eccLevel]);

  // Run jsQR on the active canvas
  const testReadability = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imgData.data, canvas.width, canvas.height);
    setIsDecodable(Boolean(code));

    // Calculate approximate % difference from pristine canvas
    if (baseCanvasRef.current) {
      const bCtx = baseCanvasRef.current.getContext('2d');
      if (bCtx) {
        const bData = bCtx.getImageData(0, 0, canvas.width, canvas.height);
        let diffPixels = 0;
        const total = imgData.data.length / 4;
        for (let i = 0; i < imgData.data.length; i += 4) {
          if (
            imgData.data[i] !== bData.data[i] ||
            imgData.data[i + 1] !== bData.data[i + 1] ||
            imgData.data[i + 2] !== bData.data[i + 2]
          ) {
            diffPixels++;
          }
        }
        setDamagedPercent(Number(((diffPixels / total) * 100).toFixed(1)));
      }
    }
  };

  // Drawing / Scratching mechanics
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = brushColor === 'white' ? '#ffffff' : brushColor === 'black' ? '#000000' : '#dc2626';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    testReadability();
  };

  const resetCanvas = () => {
    renderQRCode();
  };

  const faqs = [
    {
      question: 'How does Reed-Solomon error correction work in QR codes?',
      answer: 'Reed-Solomon is a mathematical error-correcting algorithm that operates in Galois Fields (GF(2^8)). It generates redundant polynomial check bytes that can reconstruct both missing modules (erasures) and corrupted bits without losing data.',
    },
    {
      question: 'Why can I scratch out almost a third of the QR code and it still scans?',
      answer: 'At Error Correction Level H (High), 30% of the code’s total data capacity is allocated purely to recovery parity bytes. As long as the three corner finder patterns remain intact, the math reconstructs the obliterated data modules.',
    },
    {
      question: 'What happens if a corner finder pattern is damaged?',
      answer: 'Finder patterns are the optical anchors that orient the code in 3D space. While Reed-Solomon can restore data modules, destroying the corner finder squares prevents the camera from detecting the matrix geometry, causing instant scan failure.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Error-Correction & Damage Simulator', href: '/error-correction-simulator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>Interactive Damage Lab</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Error-Correction & Damage Simulator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Scratch, obliterate, and test real-time Reed-Solomon error recovery. Experience firsthand how Level L (7%), M (15%), Q (25%), and H (30%) survive physical damage and tears.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls & Interactive Drawing Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-5">
            <div>
              <Label htmlFor="sim-text" className="text-xs font-semibold uppercase text-muted-foreground">
                QR Payload Content:
              </Label>
              <Input
                id="sim-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1.5 text-sm"
              />
            </div>

            {/* ECC Level Buttons */}
            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Error Correction Level (ECC):
              </Label>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEccLevel(lvl)}
                    className={`p-2.5 text-center rounded-xl border text-xs transition-all ${
                      eccLevel === lvl
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <div className="text-sm font-extrabold">Level {lvl}</div>
                    <div className="text-[10px] opacity-80">~{capacityMap[lvl]}% Recovery</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Damage Brush Tool Settings */}
            <div className="pt-2 border-t border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>Scratch & Damage Brush</span>
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCanvas}
                  className="text-xs h-7 gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Code
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {[
                    { id: 'white', label: 'Erase (White)', color: 'bg-white border-slate-300' },
                    { id: 'black', label: 'Smudge (Black)', color: 'bg-black text-white' },
                    { id: 'red', label: 'Stain (Red)', color: 'bg-red-600 text-white' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBrushColor(b.id as any)}
                      className={`px-3 py-1 text-xs rounded-lg border font-medium transition-all ${
                        brushColor === b.id ? 'ring-2 ring-primary ring-offset-1 font-bold' : 'opacity-80'
                      } ${b.color}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground shrink-0">Size:</span>
                  <Slider
                    value={[brushSize]}
                    min={6}
                    max={50}
                    step={2}
                    onValueChange={([val]) => setBrushSize(val)}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Scratch Canvas */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="p-3 bg-white rounded-2xl shadow-md border border-border inline-block cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={360}
                  height={360}
                  onMouseDown={() => setIsDrawing(true)}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  onMouseMove={draw}
                  className="rounded-lg touch-none"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Click and drag your mouse across the QR code to simulate physical scratches or stains.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Sticky Readability Verdict (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-5">
            <div className="border-b border-border/60 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Real-Time Reed-Solomon Status
              </span>
            </div>

            {/* Status Indicator */}
            <div
              className={`p-5 rounded-2xl text-center border ${
                isDecodable
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
              }`}
            >
              <div className="flex justify-center mb-2">
                {isDecodable ? (
                  <CheckCircle2 className="w-12 h-12" />
                ) : (
                  <XCircle className="w-12 h-12" />
                )}
              </div>
              <div className="text-lg font-extrabold uppercase">
                {isDecodable ? 'Decodable & Fully Recovered' : 'Unreadable / Corrupted'}
              </div>
              <div className="text-xs mt-1">
                {isDecodable
                  ? 'Reed-Solomon mathematics successfully reconstructed all missing bytes.'
                  : 'Damage has exceeded the mathematical recovery ceiling of this ECC level.'}
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Active ECC Level:</span>
                <span className="font-semibold text-foreground">
                  Level {eccLevel} (~{capacityMap[eccLevel]}% Max Recovery)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Surface Area Damaged:</span>
                <span className="font-semibold text-foreground">{damagedPercent}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Remaining Safe Margin:</span>
                <span className="font-semibold text-foreground">
                  {Math.max(0, capacityMap[eccLevel] - damagedPercent).toFixed(1)}%
                </span>
              </div>
            </div>

            <Button
              onClick={resetCanvas}
              variant="outline"
              className="w-full text-xs font-semibold gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset & Try Another Damage Pattern
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="damage-sim-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Mathematics of Reed-Solomon Error Correction in 2D Symbology
        </h2>
        <p className="text-base leading-relaxed">
          The defining feature of QR codes over traditional linear barcodes is their incredible resilience to physical wear and tear. When a barcode on a warehouse box is ripped or scratched horizontally, the scanner cannot read the bars. In contrast, QR codes use <strong>Galois Field GF(2^8) Reed-Solomon polynomial math</strong> to reconstruct corrupted data bytes on the fly.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Erasures vs Random Errors
        </h3>
        <p className="text-base leading-relaxed">
          In coding theory, there are two distinct categories of data loss:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>Erasures:</strong> Corrupted areas where the decoder knows the location of the damage (such as a ripped corner or an embedded corporate logo). Reed-Solomon can correct up to $R$ erasure codewords, where $R$ is the number of parity check codewords.</li>
          <li><strong>Random Errors:</strong> Corrupted modules where the location is unknown (such as random sensor noise or faint ink splatter). Reed-Solomon requires 2 parity codewords to correct 1 unknown error ($\lfloor R/2 \rfloor$).</li>
        </ul>

        <h3 className="text-xl font-semibold text-foreground">
          Why Finder Patterns Are the Single Point of Failure
        </h3>
        <p className="text-base leading-relaxed">
          As you test in the simulator above, you will notice that scratching out modules in the middle of the code allows it to remain scannable up to 30% damage at Level H. However, if you scratch out just one of the three <strong>corner finder pattern squares</strong>, the code immediately fails. This is because the camera relies on the three 1:1:3:1:1 geometric patterns to determine perspective, tilt, and the exact coordinate grid before Reed-Solomon decoding even begins.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Error Correction
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
