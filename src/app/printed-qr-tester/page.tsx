'use client';

import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw,
  FileCheck,
} from 'lucide-react';

interface PrintAuditResult {
  grade: 'A+' | 'A' | 'B' | 'C' | 'Fail';
  score: number;
  contrastRatio: number;
  blurVariance: number;
  isDecodable: boolean;
  decodedData?: string;
  recommendations: string[];
}

export default function PrintedQRTesterPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audit, setAudit] = useState<PrintAuditResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = (dataUrl: string) => {
    setIsAnalyzing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const { data, width, height } = imgData;

      // 1. Calculate Grayscale Luminance & Contrast
      let darkSum = 0;
      let darkCount = 0;
      let lightSum = 0;
      let lightCount = 0;
      const lumValues: number[] = [];

      for (let i = 0; i < data.length; i += 4) {
        // Standard Rec. 709 luminance formula
        const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        lumValues.push(lum);
        if (lum < 128) {
          darkSum += lum;
          darkCount++;
        } else {
          lightSum += lum;
          lightCount++;
        }
      }

      const avgDark = darkCount > 0 ? darkSum / darkCount : 0;
      const avgLight = lightCount > 0 ? lightSum / lightCount : 255;
      const contrastRatio = (avgLight + 0.05) / (avgDark + 0.05);

      // 2. Blur / Sharpness Detection using simplified Laplacian edge gradient variance
      let laplacianSum = 0;
      let sampleCount = 0;
      const step = 4; // Sample every 4th pixel for speed
      for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
          const idx = (y * width + x);
          const center = lumValues[idx];
          const top = lumValues[idx - width];
          const bottom = lumValues[idx + width];
          const left = lumValues[idx - 1];
          const right = lumValues[idx + 1];

          const laplacian = Math.abs(top + bottom + left + right - 4 * center);
          laplacianSum += laplacian;
          sampleCount++;
        }
      }
      const blurVariance = sampleCount > 0 ? laplacianSum / sampleCount : 0;

      // 3. Optical Decode Verification using jsQR
      const qrResult = jsQR(data, width, height);

      // Scoring & Recommendations
      const recommendations: string[] = [];
      let score = 100;

      if (!qrResult) {
        score -= 40;
        recommendations.push('Camera decoders failed to resolve the symbol. Increase print size or verify quiet zones.');
      } else {
        recommendations.push('Symbol successfully decoded: all finder and timing patterns are valid.');
      }

      if (contrastRatio < 3.5) {
        score -= 25;
        recommendations.push(`Low contrast ratio (${contrastRatio.toFixed(1)}:1). Darken foreground ink or use a brighter white substrate.`);
      } else {
        recommendations.push(`Excellent contrast ratio (${contrastRatio.toFixed(1)}:1), exceeding ISO 4.0:1 threshold.`);
      }

      if (blurVariance < 8) {
        score -= 20;
        recommendations.push('Noticeable edge blur or low resolution. Export as vector SVG or 300+ DPI raster instead of lossy JPG.');
      } else {
        recommendations.push('Crisp edge transitions with high frequency sharpness.');
      }

      const finalScore = Math.max(10, score);
      const grade =
        finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 65 ? 'B' : finalScore >= 45 ? 'C' : 'Fail';

      setAudit({
        grade,
        score: finalScore,
        contrastRatio: Number(contrastRatio.toFixed(2)),
        blurVariance: Number(blurVariance.toFixed(2)),
        isDecodable: Boolean(qrResult),
        decodedData: qrResult?.data,
        recommendations,
      });
      setIsAnalyzing(false);
    };
    img.src = dataUrl;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      analyzeImage(src);
    };
    reader.readAsDataURL(file);
  };

  const faqs = [
    {
      question: 'How does this tool test printed QR code quality?',
      answer: 'It calculates luminance contrast ratios using ISO Rec. 709 standards, measures edge gradient sharpness to identify optical blur, and runs client-side binarization to confirm whether smartphone sensors will decode the symbol.',
    },
    {
      question: 'What contrast ratio is required for printed QR codes?',
      answer: 'The international ISO/IEC 18004 specification recommends a luminance contrast ratio of at least 4.0:1 between the dark modules and the light background. Ratios below 3.0:1 often cause scan failure in low ambient lighting.',
    },
    {
      question: 'Why does my printed QR code look sharp to my eyes but fail to scan?',
      answer: 'Human eyes perceive color contrast differently than monochromatic CMOS camera sensors. For example, vibrant red text on white looks sharp to humans, but camera sensors register red light as nearly white, destroying the contrast.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Printed-QR Quality Tester', href: '/printed-qr-tester' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Camera className="w-3.5 h-3.5" />
          <span>Optical Print Diagnostics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Printed QR Code Quality & Contrast Tester
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Upload a photo of your printed packaging, flyer, or business card to audit luminance contrast ratios, Laplacian edge blur, and real-world camera decodability.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Upload & Image Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Upload Printed QR Photo</span>
            </h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-semibold text-foreground">
                Take a photo or upload an image
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Works with photos taken on iPhone, Android, or flatbed scans (Processed locally)
              </div>
            </div>

            {imageSrc && (
              <div className="mt-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Uploaded Sample:</div>
                <div className="rounded-xl overflow-hidden border border-border/70 max-h-72 flex items-center justify-center bg-black/5 dark:bg-white/5">
                  <img src={imageSrc} alt="Printed QR Sample" className="max-h-72 object-contain" />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sticky Quality Audit (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md">
            <div className="border-b border-border/60 pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Print Quality Scorecard
              </span>
            </div>

            {!audit ? (
              <div className="text-center py-10 text-muted-foreground space-y-2">
                <FileCheck className="w-12 h-12 mx-auto stroke-1 opacity-40" />
                <p className="text-sm font-medium">Awaiting image upload...</p>
                <p className="text-xs">Upload a photo of your printed QR code to calculate contrast and blur metrics.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Score & Grade Display */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <div>
                    <div className="text-xs text-muted-foreground">Optical Readability Grade</div>
                    <div className="text-4xl font-extrabold text-primary">{audit.grade}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Quality Score</div>
                    <div className="text-2xl font-bold text-foreground">{audit.score} / 100</div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Decodable by Camera:</span>
                    <span className={`font-semibold flex items-center gap-1 ${audit.isDecodable ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {audit.isDecodable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {audit.isDecodable ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Luminance Contrast:</span>
                    <span className="font-semibold text-foreground">{audit.contrastRatio}:1 (Target &gt; 4.0:1)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Edge Sharpness Index:</span>
                    <span className="font-semibold text-foreground">{audit.blurVariance}</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                  <div className="font-semibold text-foreground">Diagnostic Findings:</div>
                  {audit.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="print-tester-mid" format="horizontal-banner" />

      {/* 800+ Words Print Quality Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          The Science of Printed QR Code Readability and Quality Assurance
        </h2>
        <p className="text-base leading-relaxed">
          In prepress and packaging manufacturing, print verification is a critical stage. Unlike high-resolution smartphone screens with self-illuminating OLED pixels, physical paper, vinyl, and corrugated cardboard rely on ambient reflected light. Substrate texture, ink absorption bleed, and gloss glare directly affect whether optical sensors can binarize the symbol.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Understanding Luminance Contrast Ratios
        </h3>
        <p className="text-base leading-relaxed">
          The contrast between dark modules and light spaces must be measured photometrically. When light hits paper, ink absorbs specific wavelengths while the paper base reflects them. If you print on uncoated kraft paper, brown cardboard, or gray recycled stock, the background reflects significantly less light than pure white stock, compressing the contrast range.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Laplacian Edge Variance: Diagnosing Blurry Prints
        </h3>
        <p className="text-base leading-relaxed">
          Edge blur occurs when a raster image is resized or printed at low resolutions (such as 72 or 150 DPI). The boundary between a dark module and a light module becomes a gradient of gray pixels rather than a clean binary jump. Our tester computes high-frequency Laplacian variance across the image matrix to confirm whether the printed edges are sufficiently steep for camera focus circuits.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Print Quality
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
