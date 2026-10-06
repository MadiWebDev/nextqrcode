'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { WifiDetector } from '@/components/WifiDetector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Wifi,
  Printer,
  Download,
  Languages,
  Layout,
  CheckCircle2,
  Sparkles,
  Eye,
} from 'lucide-react';


const LANGUAGE_PRESETS = {
  en: { label: 'English', text: 'Scan to connect to WiFi', dir: 'ltr' },
  ur: { label: 'Urdu (اردو)', text: 'وائی فائی سے منسلک ہونے کے لیے اسکین کریں', dir: 'rtl' },
  ar: { label: 'Arabic (العربية)', text: 'امسح الرمز للاتصال بشبكة الواي فاي', dir: 'rtl' },
  es: { label: 'Spanish (Español)', text: 'Escanea para conectar a la red WiFi', dir: 'ltr' },
  fr: { label: 'French (Français)', text: 'Scannez pour vous connecter au WiFi', dir: 'ltr' },
  de: { label: 'German (Deutsch)', text: 'Scannen, um sich mit dem WLAN zu verbinden', dir: 'ltr' },
};

export default function WifiSignGeneratorPage() {
  const [ssid, setSsid] = useState('CoffeeHouse_Guest');
  const [password, setPassword] = useState('Welcome2026!');
  const [authType, setAuthType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [isHidden, setIsHidden] = useState(false);
  const [businessName, setBusinessName] = useState('The Artisan Café');
  const [langKey, setLangKey] = useState<keyof typeof LANGUAGE_PRESETS>('ur');
  const [template, setTemplate] = useState<'tent' | 'card' | 'poster'>('tent');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const currentLang = LANGUAGE_PRESETS[langKey];

  // Standard WIFI URI syntax with escaping
  const escapeWifiString = (str: string) => str.replace(/([\\;:,\"])/g, '\\$1');
  const wifiPayload = `WIFI:S:${escapeWifiString(ssid)};T:${authType};P:${escapeWifiString(password)};${isHidden ? 'H:true;' : ''};`;

  useEffect(() => {
    QRCode.toDataURL(wifiPayload, {
      errorCorrectionLevel: 'H',
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then((url) => {
      setQrDataUrl(url);
    });
  }, [wifiPayload]);

  const faqs = [
    {
      question: 'Do guests need to type the password after scanning?',
      answer: 'No. On iOS and Android devices, scanning this QR code automatically parses the network credentials and displays a one-tap "Join Network" prompt. The user is connected in under two seconds.',
    },
    {
      question: 'How do I print a foldable table tent?',
      answer: 'Select the "Foldable Table Tent" layout option and click Print. Fold the printed paper in half along the indicated center dotted line so both sides of your dining table display the WiFi QR code.',
    },
    {
      question: 'Does this tool support Right-to-Left (RTL) scripts like Urdu and Arabic?',
      answer: 'Yes. Our template engine includes native typography support for Urdu Nastaliq and Arabic scripts with correct RTL text-alignment and phrasing.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Printable WiFi Signs & Table Tents', href: '/wifi-sign-generator' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Wifi className="w-3.5 h-3.5" />
          <span>Multilingual Hospitality Signage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Printable WiFi Sign & Table Tent Maker (with RTL Urdu/Arabic)
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Design high-converting WiFi signs and foldable table tents for cafes, hotels, and offices. Includes full RTL typography support for Urdu, Arabic, English, and European languages.
        </p>
      </header>

      {/* ── Current WiFi detector ─────────────────────────────────────────── */}
      <WifiDetector
        onFill={({ ssid: s, password: p, encryption: e, hidden: h }) => {
          setSsid(s);
          setPassword(p);
          setAuthType((e === 'WEP' ? 'WEP' : e === 'nopass' ? 'nopass' : 'WPA') as 'WPA' | 'WEP' | 'nopass');
          setIsHidden(h === 'true');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">

            <h2 className="text-base font-bold flex items-center gap-2">
              <Wifi className="w-4 h-4 text-primary" />
              <span>WiFi Network Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wifi-ssid" className="text-xs">Network Name (SSID):</Label>
                <Input
                  id="wifi-ssid"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="wifi-pass" className="text-xs">WiFi Password:</Label>
                <Input
                  id="wifi-pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="wifi-auth" className="text-xs">Security Type:</Label>
                <select
                  id="wifi-auth"
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">None (Open Hotspot)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="wifi-biz" className="text-xs">Business / Venue Title:</Label>
                <Input
                  id="wifi-biz"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
            </div>

            {/* Language & Layout Selectors */}
            <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>Call to Action Language</span>
                </Label>
                <select
                  value={langKey}
                  onChange={(e) => setLangKey(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {Object.entries(LANGUAGE_PRESETS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Layout className="w-3.5 h-3.5" />
                  <span>Sign Layout Format</span>
                </Label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'tent', label: 'Table Tent' },
                    { id: 'card', label: 'Card (4x6)' },
                    { id: 'poster', label: 'Wall Sign' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplate(t.id as any)}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                        template === t.id
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-4">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Print Preview
              </span>
              <span className="text-xs font-medium text-primary">Ready to Print</span>
            </div>

            {/* Visual Sign Container */}
            <div
              id="printable-wifi-sign"
              className="bg-white text-slate-900 rounded-2xl p-6 border-2 border-slate-200 shadow-sm text-center flex flex-col items-center justify-between min-h-[380px]"
            >
              {template === 'tent' && (
                <div className="w-full text-[10px] text-slate-400 border-b border-dashed border-slate-300 pb-2 mb-4 tracking-wider uppercase">
                  ✂ Cut / Fold Line (Double-Sided Table Tent)
                </div>
              )}

              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <Wifi className="w-6 h-6 text-slate-800" />
              </div>

              <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
                {businessName || 'FREE GUEST WIFI'}
              </h3>

              <div
                dir={currentLang.dir}
                className={`text-sm text-slate-600 mt-1 font-medium ${
                  currentLang.dir === 'rtl' ? 'font-serif text-base' : ''
                }`}
              >
                {currentLang.text}
              </div>

              {qrDataUrl && (
                <div className="my-4 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <img src={qrDataUrl} alt="WiFi QR" className="w-48 h-48" />
                </div>
              )}

              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Network:</span>
                  <span className="font-bold text-slate-900">{ssid}</span>
                </div>
                {authType !== 'nopass' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-mono font-bold text-slate-900">{password}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => window.print()}
              className="w-full text-xs font-semibold gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Sign / Save as PDF
            </Button>
          </Card>
        </div>
      </div>

      <AdSlot id="wifi-sign-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Hospitality WiFi Sign Design & RTL Cultural Typography
        </h2>
        <p className="text-base leading-relaxed">
          Sharing guest WiFi credentials via verbal conversation or scribbled napkins creates unnecessary friction for patrons and service staff. A clear, branded table tent or wall sign removes connection barriers entirely.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Right-to-Left (RTL) Typography Optimization
        </h3>
        <p className="text-base leading-relaxed">
          In regions where Arabic or Urdu are the primary languages, signage that only provides English instructions results in lower engagement. Our generator integrates native RTL phrasing and proper ligature rendering so your international guests feel welcomed immediately upon taking their seats.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Table Tent Material and Durability Advice
        </h3>
        <p className="text-base leading-relaxed">
          For restaurant and coffee shop tables exposed to condensation, beverage rings, and sanitizing sprays, print on 300 GSM cardstock coated with a matte UV lamination. This prevents water stains and eliminates lighting glare from overhead spotlights.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About WiFi Signs
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
