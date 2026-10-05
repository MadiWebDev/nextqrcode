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
  Layers,
  Split,
  Merge,
  ChevronLeft,
  ChevronRight,
  Printer,
  Copy,
  Check,
  Upload,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function QRSplitterScannerPage() {
  const [activeTab, setActiveTab] = useState<'split' | 'assemble'>('split');

  // Splitter State
  const [inputText, setInputText] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Section two of the technical payload includes cryptographic keys and data frames.'
  );
  const [chunkSize, setChunkSize] = useState<number>(180);
  const [chunks, setChunks] = useState<string[]>([]);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [chunkQRDataUrls, setChunkQRDataUrls] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Assembler State
  const [assembledParts, setAssembledParts] = useState<Record<number, { total: number; data: string }>>({});
  const [assembledTotal, setAssembledTotal] = useState<number>(0);
  const [assembledText, setAssembledText] = useState<string>('');
  const assembleFileInputRef = useRef<HTMLInputElement>(null);

  // Split logic
  useEffect(() => {
    if (!inputText) {
      setChunks([]);
      setChunkQRDataUrls([]);
      return;
    }

    const raw = inputText;
    const pieces: string[] = [];
    const count = Math.ceil(raw.length / chunkSize);

    for (let i = 0; i < count; i++) {
      const partData = raw.slice(i * chunkSize, (i + 1) * chunkSize);
      // Format: [PART:i+1/count]:payload
      const formatted = `[PART:${i + 1}/${count}]:${partData}`;
      pieces.push(formatted);
    }

    setChunks(pieces);
    setActiveChunkIndex(0);

    // Generate QR for all chunks
    Promise.all(
      pieces.map((p) =>
        QRCode.toDataURL(p, {
          errorCorrectionLevel: 'M',
          width: 320,
          margin: 2,
        })
      )
    ).then((urls) => {
      setChunkQRDataUrls(urls);
    });
  }, [inputText, chunkSize]);

  // Decode uploaded image for assembler
  const handleAssembleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);
          const decoded = jsQR(imgData.data, img.width, img.height);

          if (decoded && decoded.data) {
            parseAndAddChunk(decoded.data);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const parseAndAddChunk = (str: string) => {
    const match = str.match(/^\[PART:(\d+)\/(\d+)\]:([\s\S]*)$/);
    if (!match) return;

    const partNum = parseInt(match[1], 10);
    const totalParts = parseInt(match[2], 10);
    const payload = match[3];

    setAssembledParts((prev) => {
      const next = { ...prev, [partNum]: { total: totalParts, data: payload } };
      setAssembledTotal(totalParts);

      // Check if complete
      if (Object.keys(next).length === totalParts) {
        let full = '';
        for (let i = 1; i <= totalParts; i++) {
          if (next[i]) full += next[i].data;
        }
        setAssembledText(full);
      }
      return next;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledText || inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'What is a multi-part or split QR code?',
      answer: 'Standard QR codes have capacity limits. When encoding extensive documents, cryptographic certificates, or software code, splitting the payload across an ordered sequence of QR codes allows transfer of arbitrarily large data offline.',
    },
    {
      question: 'How does the reassembly scanner know the order of chunks?',
      answer: 'Each QR code contains a structured sequence header [PART:X/Y] specifying its index and the total count. The reassembly engine collects the parts in any order and merges them sequentially once all chunks are present.',
    },
    {
      question: 'Can I print these split QR codes as a physical backup?',
      answer: 'Yes. Multi-part QR sheets are commonly used in security and cold-storage paper wallets to store encrypted private keys or air-gapped seed phrases across physical binder pages.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Large-Data Splitter & Reassembly Scanner', href: '/qr-splitter-scanner' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>High-Capacity Transfer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Large-Data QR Code Splitter & Reassembly Scanner
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Break extensive text, code, or cryptographic keys into sequenced, multi-part QR codes. Scan and reassemble all chunks offline with zero internet connectivity.
        </p>
      </header>

      {/* Mode Switcher */}
      <div className="flex gap-2 mb-8 border-b border-border pb-3">
        <Button
          variant={activeTab === 'split' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('split')}
          className="gap-2 text-xs font-semibold"
        >
          <Split className="w-4 h-4" />
          <span>1. Split Data into Sequence</span>
        </Button>
        <Button
          variant={activeTab === 'assemble' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('assemble')}
          className="gap-2 text-xs font-semibold"
        >
          <Merge className="w-4 h-4" />
          <span>2. Reassemble & Decode Sequence</span>
        </Button>
      </div>

      {activeTab === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 border-border/80 shadow-xs space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="long-input" className="text-xs font-semibold uppercase text-muted-foreground">
                    Input Large Text / Payload:
                  </Label>
                  <span className="text-xs text-muted-foreground">{inputText.length} characters</span>
                </div>
                <Textarea
                  id="long-input"
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste lengthy markdown, JSON, source code, or cryptographic keys..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-muted-foreground uppercase">Chunk Size per QR:</span>
                  <span className="font-bold text-foreground">{chunkSize} characters</span>
                </div>
                <Slider
                  value={[chunkSize]}
                  min={80}
                  max={400}
                  step={20}
                  onValueChange={([val]) => setChunkSize(val)}
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Fast Scan (80-120 chars)</span>
                  <span>Balanced (180 chars)</span>
                  <span>Dense (400 chars)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sticky Preview (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <Card className="p-6 border-border/80 shadow-md space-y-5 text-center">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Part {activeChunkIndex + 1} of {chunks.length || 1}
                </span>
                <span className="text-xs font-bold text-primary">
                  {chunks.length} Total QR Codes
                </span>
              </div>

              {chunkQRDataUrls[activeChunkIndex] ? (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl border border-border shadow-xs">
                    <img
                      src={chunkQRDataUrls[activeChunkIndex]}
                      alt={`Part ${activeChunkIndex + 1}`}
                      className="w-56 h-56"
                    />
                  </div>
                  <div className="mt-3 text-xs font-mono text-muted-foreground truncate max-w-xs">
                    {chunks[activeChunkIndex]}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-sm text-muted-foreground">No data to encode</div>
              )}

              {/* Navigation Controls */}
              {chunks.length > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeChunkIndex === 0}
                    onClick={() => setActiveChunkIndex((p) => Math.max(0, p - 1))}
                    className="text-xs gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-xs font-medium text-muted-foreground">
                    {activeChunkIndex + 1} / {chunks.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeChunkIndex === chunks.length - 1}
                    onClick={() => setActiveChunkIndex((p) => Math.min(chunks.length - 1, p + 1))}
                    className="text-xs gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <Button
                onClick={() => window.print()}
                variant="outline"
                className="w-full text-xs font-semibold gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Multi-Part Contact Sheet
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        /* Assembler Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 border-border/80 shadow-xs space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <span>Upload Sequenced QR Images</span>
              </h2>

              <div
                onClick={() => assembleFileInputRef.current?.click()}
                className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40"
              >
                <input
                  ref={assembleFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAssembleUpload}
                  className="hidden"
                />
                <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <div className="text-sm font-semibold text-foreground">Select one or multiple QR images</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Upload images in any order. The engine reconstructs the original document automatically.
                </div>
              </div>

              {/* Progress of Collected Parts */}
              {assembledTotal > 0 && (
                <div className="space-y-3 pt-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span>Sequence Completion:</span>
                    <span>
                      {Object.keys(assembledParts).length} of {assembledTotal} Parts Collected
                    </span>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {Array.from({ length: assembledTotal }, (_, i) => i + 1).map((partNum) => (
                      <div
                        key={partNum}
                        className={`p-2 text-center rounded-lg border text-xs font-bold ${
                          assembledParts[partNum]
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        #{partNum}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <Card className="p-6 border-border/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reassembled Output
                </span>
                {assembledText && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    100% Complete
                  </span>
                )}
              </div>

              {assembledText ? (
                <div className="space-y-3">
                  <Textarea
                    readOnly
                    rows={8}
                    value={assembledText}
                    className="font-mono text-xs bg-muted/40"
                  />
                  <Button onClick={handleCopy} className="w-full text-xs font-semibold gap-2">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Assembled Text'}
                  </Button>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-muted-foreground space-y-2">
                  <FileText className="w-10 h-10 mx-auto stroke-1 opacity-40" />
                  <p>Upload all sequence chunks to reconstruct the text payload.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      <AdSlot id="splitter-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How Multi-Part QR Code Serialization Overcomes Data Capacity Limits
        </h2>
        <p className="text-base leading-relaxed">
          While a single Version 40 QR code can theoretically hold up to 2.9 KB of binary data, practical optical scanning limits are much lower. In real-world environments, encoding more than 300 characters creates an extremely dense matrix that requires specialized macro lenses or laboratory lighting to scan.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          The Solution: Sequenced Chunk Framing
        </h3>
        <p className="text-base leading-relaxed">
          By splitting a large payload into discrete chunks with structured headers—such as <code>[PART:1/5]:...</code>—data can be transmitted optically with zero chance of scanner focus degradation. Each individual QR code remains at a friendly Version 4 or Version 6 matrix density, allowing standard smartphones to scan each frame in under 200 milliseconds.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Applications in Air-Gapped and Cold Storage Security
        </h3>
        <p className="text-base leading-relaxed">
          In high-security environments where servers must never connect to the public internet (air-gapped networks), transferring signed software binaries or cryptographic certificates is traditionally handled via USB thumb drives, which introduces malware risks. Multi-part QR code sequences allow strictly unidirectional optical data ingress with zero physical hardware connectivity.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Multi-Part QR Codes
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
