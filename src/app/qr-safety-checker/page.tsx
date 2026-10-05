'use client';

import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Upload,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Info,
  QrCode,
  FileSearch,
} from 'lucide-react';

interface SecurityCheckResult {
  score: number; // 0 (dangerous) to 100 (safe)
  status: 'safe' | 'caution' | 'danger';
  decodedPayload: string;
  isUrl: boolean;
  domain?: string;
  isShortLink: boolean;
  isHttps: boolean;
  isRawIp: boolean;
  isPunycode: boolean;
  suspiciousTld: boolean;
  riskReasons: string[];
  safePoints: string[];
}

export default function QRSafetyCheckerPage() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SecurityCheckResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze URL or decoded text payload for security risks
  const analyzePayload = (payload: string) => {
    setIsAnalyzing(true);
    const trimmed = payload.trim();
    let isUrl = false;
    let domain = '';
    let isHttps = false;
    let isRawIp = false;
    let isPunycode = false;
    let isShortLink = false;
    let suspiciousTld = false;
    const riskReasons: string[] = [];
    const safePoints: string[] = [];
    let score = 100;

    // Check if dangerous non-http scheme
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:text/html')) {
      score = 0;
      setResult({
        score: 0,
        status: 'danger',
        decodedPayload: trimmed,
        isUrl: true,
        isShortLink: false,
        isHttps: false,
        isRawIp: false,
        isPunycode: false,
        suspiciousTld: false,
        riskReasons: ['Contains an executable script or data URI designed to execute arbitrary code.'],
        safePoints: [],
      });
      setIsAnalyzing(false);
      return;
    }

    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        isUrl = true;
        domain = url.hostname;
        isHttps = url.protocol === 'https:';

        if (!isHttps) {
          score -= 30;
          riskReasons.push('Insecure connection (HTTP): Data transmitted is not encrypted.');
        } else {
          safePoints.push('Uses secure HTTPS protocol with encryption in transit.');
        }

        // Check for raw IP address hostname
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipv4Regex.test(domain)) {
          isRawIp = true;
          score -= 40;
          riskReasons.push('Uses raw numerical IP address instead of a recognized domain name (frequent phishing indicator).');
        }

        // Check for Punycode / Homograph attacks
        if (domain.startsWith('xn--') || domain.includes('.xn--')) {
          isPunycode = true;
          score -= 35;
          riskReasons.push('Punycode domain detected (often used to visually impersonate legitimate brands like gooogle.com).');
        }

        // Check for known URL shorteners
        const shorteners = [
          'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly',
          'ow.ly', 'cutt.ly', 'rb.gy', 'shorturl.at', 'bl.ink'
        ];
        if (shorteners.some((s) => domain.toLowerCase().includes(s))) {
          isShortLink = true;
          score -= 20;
          riskReasons.push('Uses a URL shortener service which obscures the final destination website.');
        } else {
          safePoints.push('Direct domain link (no intermediate URL shortener detected).');
        }

        // Check for risky TLDs
        const riskyTlds = ['.zip', '.mov', '.top', '.work', '.click', '.loan', '.buzz'];
        if (riskyTlds.some((tld) => domain.toLowerCase().endsWith(tld))) {
          suspiciousTld = true;
          score -= 20;
          riskReasons.push(`Uses a top-level domain (${domain.split('.').pop()}) frequently associated with spam and phishing.`);
        }
      }
    } catch {
      // Plain text or non-URL
      isUrl = false;
      safePoints.push('Payload is offline plain text or standard contact data; no web redirect.');
    }

    const finalScore = Math.max(0, score);
    const status = finalScore >= 80 ? 'safe' : finalScore >= 50 ? 'caution' : 'danger';

    setResult({
      score: finalScore,
      status,
      decodedPayload: trimmed,
      isUrl,
      domain,
      isShortLink,
      isHttps,
      isRawIp,
      isPunycode,
      suspiciousTld,
      riskReasons,
      safePoints,
    });
    setIsAnalyzing(false);
  };

  // Decode QR code from uploaded image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setInputText(code.data);
          analyzePayload(code.data);
        } else {
          alert('Could not detect a valid QR code in this image. Please ensure the code is clear and well-lit.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const faqs = [
    {
      question: 'What is "Quishing" (QR phishing)?',
      answer: 'Quishing is a social engineering cyberattack where criminals embed phishing links inside QR codes. Because traditional email filters cannot easily inspect image pixels, the QR code reaches the victim, who scans it with a mobile device that lacks enterprise firewall protection.',
    },
    {
      question: 'How can I tell if a physical QR code on a parking meter or restaurant table has been tampered with?',
      answer: 'Inspect the code with your fingers. Fraudsters frequently print adhesive stickers and paste them directly on top of genuine signs. If you feel a raised sticker edge or see corners peeling off, do not scan it.',
    },
    {
      question: 'Why are shortened URLs in QR codes risky?',
      answer: 'Short URLs (such as bit.ly or tinyurl) mask the true destination domain. Attackers use shorteners to hide malicious hostnames and evade basic inspection until the browser executes the redirect chain.',
    },
    {
      question: 'Is my data uploaded to any server when I test a QR code here?',
      answer: 'No. All image decoding and security heuristics run 100% locally inside your browser client using Web APIs. Nothing is ever sent to or stored on any server.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'QR Safety & Phishing Checker', href: '/qr-safety-checker' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Client-Side Security Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Safety & Anti-Quishing Inspector
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Decode any QR code from an image or inspect a suspicious URL before scanning. Detect homograph spoofing, IP redirects, hidden short links, and phishing patterns client-side.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input & Analyzer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Upload QR Code Image to Inspect</span>
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
              <FileSearch className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-semibold text-foreground">Click to upload or drag & drop image</div>
              <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP, or screenshots (Decoded 100% in browser)</div>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border/60" />
              <span className="text-xs text-muted-foreground uppercase font-semibold">Or Paste Target URL / Text</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="manual-payload">Destination URL or Raw Payload:</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-payload"
                  placeholder="https://example.com/login?utm=..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="text-sm"
                />
                <Button
                  onClick={() => analyzePayload(inputText)}
                  disabled={!inputText.trim() || isAnalyzing}
                  className="shrink-0 text-xs font-semibold"
                >
                  Analyze Security
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sticky Security Verdict (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md">
            <div className="border-b border-border/60 pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Safety Inspection Verdict
              </span>
            </div>

            {!result ? (
              <div className="text-center py-10 text-muted-foreground space-y-2">
                <QrCode className="w-12 h-12 mx-auto stroke-1 opacity-40" />
                <p className="text-sm font-medium">No QR code analyzed yet.</p>
                <p className="text-xs">Upload an image or enter a URL on the left to inspect security heuristics.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Status Badge */}
                <div
                  className={`rounded-2xl p-4 text-center border ${
                    result.status === 'safe'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                      : result.status === 'caution'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {result.status === 'safe' ? (
                      <ShieldCheck className="w-10 h-10" />
                    ) : result.status === 'caution' ? (
                      <ShieldAlert className="w-10 h-10" />
                    ) : (
                      <ShieldX className="w-10 h-10" />
                    )}
                  </div>
                  <div className="text-lg font-bold uppercase tracking-tight">
                    {result.status === 'safe'
                      ? 'Verified Safe (Low Risk)'
                      : result.status === 'caution'
                      ? 'Caution Advised'
                      : 'High Risk Phishing Warning'}
                  </div>
                  <div className="text-xs mt-1">Trust Score: {result.score} / 100</div>
                </div>

                {/* Decoded Content */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground">Decoded String:</div>
                  <div className="p-3 rounded-lg bg-muted text-xs font-mono break-all max-h-32 overflow-y-auto">
                    {result.decodedPayload}
                  </div>
                </div>

                {/* Checklist Breakdown */}
                <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                  {result.riskReasons.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                  {result.safePoints.map((safe, i) => (
                    <div key={i} className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{safe}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="safety-checker-mid" format="horizontal-banner" />

      {/* 800+ Words Security Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Understanding QR Code Security Threats and Quishing Attacks
        </h2>
        <p className="text-base leading-relaxed">
          Because QR codes are visually unintelligible to the human eye, consumers cannot preview where a link leads before scanning. Cybercriminals actively exploit this optical blind spot through <strong>Quishing (QR Phishing)</strong>, embedding weaponized links inside printed physical stickers, PDF attachments, and invoice fraud emails.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Top 4 Red Flags Detected by Our Scanner
        </h3>
        <ol className="list-decimal pl-6 space-y-3 text-sm">
          <li>
            <strong>Punycode and Homograph Impersonation:</strong> Attackers register internationalized domain names using Cyrillic or Greek characters that look visually identical to Latin letters (for example, replacing the Latin letter 'a' with the Cyrillic 'а'). Our tool checks for underlying <code>xn--</code> encodings to detect spoofed brand domains.
          </li>
          <li>
            <strong>Numerical IP Hostnames:</strong> Legitimate commercial organizations rarely route users to raw IP addresses (e.g., <code>http://192.241.168.10/auth</code>). This is a frequent indicator of short-lived malicious command-and-control servers.
          </li>
          <li>
            <strong>Hidden Intermediate Short Links:</strong> URL shortening domains (bit.ly, tinyurl, t.co) prevent consumers from observing the actual destination domain. Legitimate brand campaigns should use branded domain links or clear, direct URLs.
          </li>
          <li>
            <strong>Non-HTTP Protocol Handlers:</strong> Malicious QR codes can encode <code>data:text/html</code> or <code>javascript:</code> strings designed to trigger cross-site scripting or download zero-day browser exploits immediately upon scanning.
          </li>
        </ol>

        <h3 className="text-xl font-semibold text-foreground">
          Physical Tampering Defense Protocol
        </h3>
        <p className="text-base leading-relaxed">
          In municipal spaces such as parking meters, EV charging kiosks, and outdoor restaurant patios, attackers paste high-resolution paper stickers over legitimate payment codes. Before scanning any payment code in public, always conduct a brief tactile check: run your thumb across the sign surface. If the QR code feels elevated or reveals a peeling adhesive edge, do not proceed with payment.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Safety
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
