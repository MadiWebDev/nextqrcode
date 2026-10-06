'use client';

/**
 * WifiDetector
 *
 * Shows a contextual banner that lets users one-tap pre-fill the WiFi form
 * with the network they are currently on.
 *
 * Security reality: browsers deliberately hide SSID and credentials for
 * security — no web API can read them. What we *can* do:
 *   1. Detect connection type (wifi / cellular / ethernet) via navigator.connection
 *   2. If on WiFi, prompt the user to confirm or type their SSID (one word entry)
 *   3. Let them type their password — we never transmit it, it stays client-side
 *   4. Call onFill({ ssid, password, encryption }) to pre-fill the parent form
 */

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2, CheckCircle2, X, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface WifiFill {
  ssid: string;
  password: string;
  encryption: string;
  hidden: string;
}

interface WifiDetectorProps {
  /** Called when the user clicks "Generate QR for This Network" */
  onFill: (values: WifiFill) => void;
}

type Step = 'idle' | 'detecting' | 'form' | 'done' | 'no_wifi';

// Extend NavigatorUAData for TypeScript (experimental)
interface NetworkInformation {
  type?: string;
  effectiveType?: string;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export function WifiDetector({ onFill }: WifiDetectorProps) {
  const [step, setStep] = useState<Step>('idle');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState('false');
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Read connection type once (read-only, no SSID or password accessible)
  useEffect(() => {
    const conn = navigator?.connection;
    if (conn?.type) {
      setConnectionType(conn.type);
    }
  }, []);

  function handleDetect() {
    setStep('detecting');
    // Simulate a brief "detecting" UX then open the form
    setTimeout(() => {
      const conn = navigator?.connection;
      const type = conn?.type;
      if (type && type !== 'wifi' && type !== 'none' && type !== 'unknown') {
        // Clearly not WiFi (e.g. cellular)
        setStep('no_wifi');
      } else {
        // Could be WiFi or unknown — show the form
        setStep('form');
      }
    }, 800);
  }

  function handleFill() {
    if (!ssid.trim()) return;
    onFill({ ssid: ssid.trim(), password, encryption, hidden });
    setStep('done');
  }

  function handleReset() {
    setStep('idle');
    setSsid('');
    setPassword('');
    setEncryption('WPA');
    setHidden('false');
    setShowPassword(false);
  }

  // ── Idle state ───────────────────────────────────────────────────────────
  if (step === 'idle') {
    return (
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
            <Wifi className="w-4.5 h-4.5 text-sky-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">
              Generate QR for Your Current WiFi
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Pre-fill the form with your connected network — password stays on your device only.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDetect}
          className="shrink-0 border-sky-500/40 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/60"
        >
          <Wifi className="w-3.5 h-3.5" />
          Detect WiFi
        </Button>
      </div>
    );
  }

  // ── Detecting ────────────────────────────────────────────────────────────
  if (step === 'detecting') {
    return (
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-sky-500 animate-spin shrink-0" />
        <p className="text-sm text-muted-foreground">Detecting connection type…</p>
      </div>
    );
  }

  // ── Not on WiFi ──────────────────────────────────────────────────────────
  if (step === 'no_wifi') {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <WifiOff className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-muted-foreground">
            You appear to be on a <strong>cellular / non-WiFi</strong> connection. Switch to WiFi
            first, or type your network details below manually.
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setStep('form')} className="shrink-0 text-xs">
          Enter Manually
        </Button>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Form pre-filled with "{ssid}"</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              The QR code below will auto-connect devices when scanned.
            </p>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={handleReset} className="shrink-0 text-xs text-muted-foreground">
          <X className="w-3.5 h-3.5" />
          Clear
        </Button>
      </div>
    );
  }

  // ── Form step ─────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Enter Your WiFi Details</p>
            <p className="text-xs text-muted-foreground">
              Browsers can&apos;t read credentials — fill in below, nothing is stored or sent.
            </p>
          </div>
        </div>
        <Button size="icon-sm" variant="ghost" onClick={handleReset} className="shrink-0 text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Form */}
      <div className="px-4 pb-4 space-y-3">
        {/* SSID */}
        <div className="space-y-1.5">
          <Label htmlFor="wifi-det-ssid" className="text-xs font-medium">
            Network Name (SSID) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="wifi-det-ssid"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            placeholder="e.g. HomeNetwork_5G"
            className="bg-background"
            autoComplete="off"
          />
          <p className="text-[11px] text-muted-foreground">
            Find it in your device&apos;s WiFi settings — it&apos;s the name of the connected network.
          </p>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="wifi-det-pass" className="text-xs font-medium flex items-center gap-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="wifi-det-pass"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="WiFi password"
              className="bg-background pr-10"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded options toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} />
          Advanced options (encryption type, hidden network)
        </button>

        {expanded && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Encryption */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Encryption</Label>
              <Select value={encryption} onValueChange={setEncryption}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                  <SelectItem value="WEP">WEP (Legacy)</SelectItem>
                  <SelectItem value="nopass">None (Open)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hidden */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Hidden Network</Label>
              <Select value={hidden} onValueChange={setHidden}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No (Broadcasted)</SelectItem>
                  <SelectItem value="true">Yes (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleFill}
          disabled={!ssid.trim()}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white"
        >
          <Wifi className="w-4 h-4" />
          Generate QR for This Network
        </Button>

        <p className="text-[10px] text-center text-muted-foreground">
          🔒 Credentials never leave your browser — all QR generation is 100% local.
        </p>
      </div>
    </div>
  );
}
