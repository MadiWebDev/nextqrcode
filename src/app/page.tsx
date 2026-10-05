import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeGenerator } from '@/components/HomeGenerator';
import { AdSlot } from '@/components/AdSlot';
import {
  Calculator,
  ShieldCheck,
  Camera,
  Wrench,
  Layers,
  Radio,
  HeartPulse,
  Wifi,
  CreditCard,
  Grid,
  Heart,
  Users,
  TrendingUp,
  Compass,
  Barcode,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Globe2,
  FileCheck,
  Tag,
  Smartphone,
  Building2,
  Ruler,
  Library,
  GitCompare,
  HelpCircle,
} from 'lucide-react';
import { getAllArticles } from '@/lib/articles';
import { getAllCountries } from '@/data/countries';
import { getAllPaymentSchemes } from '@/data/payments';
import { getAllLabelSheets } from '@/data/labels';

export const metadata: Metadata = {
  title: 'Free QR Code Generator & Optical Engineering Suite — QR Studio',
  description:
    'Generate beautiful, professional QR codes & barcodes 100% in your browser. 40+ types, instant vector SVG/PDF download, distance calculator, safety inspector, and offline file transfer. Zero tracking.',
  alternates: { canonical: 'https://freeqrcode.tools' },
  openGraph: {
    title: 'Free QR Code Generator & Optical Engineering Suite — QR Studio',
    description:
      'High-precision client-side QR studio: 40+ symbologies, print sizing calculator, anti-quishing safety checker, and air-gapped data transfer. No sign-up.',
    url: 'https://freeqrcode.tools',
    type: 'website',
  },
};

const FEATURED_TOOLS = [
  {
    title: 'QR Size & Distance Calculator',
    desc: 'Compute mathematically exact print dimensions using optical sensor focal physics and 10:1 viewing ratios.',
    href: '/qr-size-calculator',
    icon: Calculator,
    category: 'Optical Math',
    accent: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'QR Safety & Phishing Checker',
    desc: 'Inspect suspicious QR codes client-side. Expose hidden URL shorteners, homograph attacks, and quishing scams.',
    href: '/qr-safety-checker',
    icon: ShieldCheck,
    category: 'Security',
    accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Printed-QR Quality Tester',
    desc: 'Upload printed packaging photos to audit ISO luminance contrast, Laplacian edge blur, and camera decodability.',
    href: '/printed-qr-tester',
    icon: Camera,
    category: 'Prepress Audit',
    accent: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Error-Correction Damage Simulator',
    desc: 'Interactive scratch laboratory. Draw real-time physical damage across QR codes to test Reed-Solomon recovery.',
    href: '/error-correction-simulator',
    icon: Wrench,
    category: 'Interactive Lab',
    accent: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Large-Data Splitter & Scanner',
    desc: 'Split extensive text, certificates, or code into sequenced multi-part QR codes. Reassemble offline via camera.',
    href: '/qr-splitter-scanner',
    icon: Layers,
    category: 'Data Transfer',
    accent: 'from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400',
  },
  {
    title: 'Animated-QR Offline File Transfer',
    desc: 'Stream text and files across air-gapped computers via high-speed animated optical frames at 1-8 FPS.',
    href: '/animated-qr-transfer',
    icon: Radio,
    category: 'Air-Gap Stream',
    accent: 'from-rose-500/10 to-red-500/10 text-rose-600 dark:text-red-400',
  },
  {
    title: 'Emergency Medical ID QR Card',
    desc: 'Printable emergency wallet cards and lock-screen wallpaper with offline blood type, allergies, and ICE contacts.',
    href: '/medical-id-qr',
    icon: HeartPulse,
    category: 'Life Safety',
    accent: 'from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400',
  },
  {
    title: 'Printable WiFi Signs (RTL Support)',
    desc: 'Hospitality table tents and wall signs with native RTL Urdu and Arabic typography plus instant connect.',
    href: '/wifi-sign-generator',
    icon: Wifi,
    category: 'Hospitality',
    accent: 'from-sky-500/10 to-indigo-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    title: 'Regional Payment QR (UPI / Raast)',
    desc: 'Official EMVCo Raast (Pakistan), JazzCash, Easypaisa, and Indian UPI payment codes with zero fee intermediary.',
    href: '/pakistan-payment-qr',
    icon: CreditCard,
    category: 'Fintech Rails',
    accent: 'from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Avery Sticker Sheet Layout Printer',
    desc: 'Batch format QR codes on standard Avery 5160, 5163, and round stickers with sequential serial numbering.',
    href: '/qr-sticker-sheet-printer',
    icon: Grid,
    category: 'Batch Printing',
    accent: 'from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    title: 'Pet Tag Lost & Found QR',
    desc: 'Double-sided printable collar tags with punch-hole guides, owner contact numbers, and critical medical alerts.',
    href: '/pet-tag-qr',
    icon: Heart,
    category: 'Pet Safety',
    accent: 'from-pink-500/10 to-rose-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    title: 'Bulk vCard from CSV',
    desc: 'Convert employee and conference attendee spreadsheets into hundreds of individual vCard 3.0 QR codes.',
    href: '/bulk-vcard-qr',
    icon: Users,
    category: 'Enterprise',
    accent: 'from-blue-500/10 to-sky-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'UTM Campaign QR Builder',
    desc: 'Generate campaign-tagged URLs and instant QR codes tracked in Google Analytics 4 (GA4) with zero data loss.',
    href: '/utm-builder',
    icon: TrendingUp,
    category: 'Attribution',
    accent: 'from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Material Placement Checklist',
    desc: 'Pre-flight guidelines for printing on glass, stainless steel, natural wood, fabric, and curved cylinders.',
    href: '/qr-placement-guide',
    icon: Compass,
    category: 'Substrates',
    accent: 'from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400',
  },
  {
    title: '1D Barcode Generator with Checksum',
    desc: 'GS1-compliant EAN-13, UPC-A, Code 128, and ISBN barcodes with real-time Modulo-10 checksum validation.',
    href: '/barcode-generator',
    icon: Barcode,
    category: 'Retail 1D',
    accent: 'from-slate-500/10 to-zinc-500/10 text-slate-600 dark:text-slate-400',
  },
];

/** Programmatic content hub cards shown below tools */
const CONTENT_HUBS = [
  {
    title: 'Label & Sticker Sheet Library',
    desc: 'Print-ready QR sheet generators for 30+ Avery, Herma, Dymo, Brother, and Zebra label formats. Exact margin calibration, zero-drift layout.',
    href: '/qr-labels',
    icon: Tag,
    count: 'label sheets',
    accent: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    title: 'WhatsApp QR by Country',
    desc: 'Country-specific WhatsApp QR generators with calling code auto-detection, carrier prefix validation, and local regulatory notes.',
    href: '/whatsapp-qr',
    icon: Globe2,
    count: 'countries',
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Payment QR Scheme Library',
    desc: 'Official spec generators for Pix, UPI, Raast, SGQR, Swiss QR-Bill, SEPA, PromptPay, and 25+ more payment networks.',
    href: '/payment-qr',
    icon: CreditCard,
    count: 'payment schemes',
    accent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Device & OS Scanning Guides',
    desc: 'Tested troubleshooting guides for iPhone iOS 18, Android Pixel, Samsung Galaxy, Huawei HarmonyOS, Windows 11, and industrial Zebra scanners.',
    href: '/scan-guide',
    icon: Smartphone,
    count: 'device guides',
    accent: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    title: 'Industry Use-Case Generators',
    desc: 'Pre-configured QR generators for Retail, Healthcare, Logistics, Hospitality, Education, Manufacturing, and 4 more industries.',
    href: '/industries',
    icon: Building2,
    count: 'use-case pages',
    accent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Size & Distance Calculator Hub',
    desc: 'Pre-filled QR size calculators for 20 specific use cases: business cards, banners, wine labels, pill bottles, museum placards, and more.',
    href: '/qr-size-guide',
    icon: Ruler,
    count: 'size guides',
    accent: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  },
  {
    title: 'QR & Barcode Glossary',
    desc: 'Technical reference: Reed-Solomon, Galois Field, finder patterns, EMVCo TLV, Micro QR, Data Matrix, PDF417, and 25+ more defined with math.',
    href: '/glossary',
    icon: Library,
    count: 'terms defined',
    accent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
  {
    title: 'Format Comparisons',
    desc: 'Data-driven comparisons: QR vs NFC, static vs dynamic, SVG vs PNG vs PDF, iPhone vs Android scanner, UPI vs Raast vs PromptPay.',
    href: '/compare',
    icon: GitCompare,
    count: 'comparisons',
    accent: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
];

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);
  const countries = getAllCountries();
  const payments = getAllPaymentSchemes();
  const labels = getAllLabelSheets();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QR Studio',
    url: 'https://freeqrcode.tools',
    description:
      'Professional browser-based QR code generator and optical engineering platform.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://freeqrcode.tools/sitemap-page?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Studio',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    url: 'https://freeqrcode.tools',
    description:
      'Free online QR code generator suite with 40+ code types, optical size calculator, safety checker, and print-ready exports.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'QR Code Generator (40+ types)',
      'QR Size & Distance Calculator',
      'QR Safety & Phishing Checker',
      'Print-Ready SVG & PDF Export',
      'Label Sheet Grid Layout',
      'WhatsApp Country-Specific QR',
      'Payment QR (UPI, Raast, Pix, SGQR)',
      'Offline Animated File Transfer',
      'Error Correction Damage Simulator',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Main Interactive Studio Hero */}
      <HomeGenerator />

      {/* Zero-CLS Top Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot id="home-top" format="horizontal-banner" />
      </div>

      {/* Architectural Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground">100% Client-Side</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              No server uploads. WiFi passwords, contacts, and payment codes stay in your browser.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Zero Latency & Expiry</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Permanent static codes. No recurring subscriptions, paywalls, or broken redirects.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Vector SVG & Print PDF</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Lossless commercial print exports up to 4K resolution with exact quiet zone margins.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground">International Protocols</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Complies with ISO/IEC 18004, EMVCo, UPI, and native RTL Urdu/Arabic scripts.
            </p>
          </div>
        </div>
      </section>

      {/* 15 Specialized Optical & QR Engineering Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Engineering Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Specialized Optical & QR Tool Cluster
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-2xl">
              Every tool operates 100% client-side with zero cloud dependency. Designed for prepress
              designers, cybersecurity engineers, and international merchants.
            </p>
          </div>
          <Link
            href="/sitemap-page"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
          >
            <span>Explore Complete Sitemap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group border border-border/70 hover:border-primary/50 rounded-2xl p-5 bg-card hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center transition-transform group-hover:scale-105 ${t.accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {t.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{t.desc}</p>
                </div>
                <div className="pt-4 mt-3 border-t border-border/40 flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Mid-Page Compliant Ad Slot ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <AdSlot id="home-mid" format="horizontal-banner" />
      </div>

      {/* ── Programmatic Content Hub Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Specialized Knowledge Hubs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Deep-Dive Reference Libraries
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-2xl">
              Structured data libraries with working generators, calculators, and technical guides
              for every dimension of QR code deployment.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTENT_HUBS.map((hub) => {
            const Icon = hub.icon;
            // Resolve live counts from data
            const count =
              hub.href === '/qr-labels'
                ? labels.length
                : hub.href === '/whatsapp-qr'
                  ? countries.length
                  : hub.href === '/payment-qr'
                    ? payments.length
                    : null;

            return (
              <Link
                key={hub.href}
                href={hub.href}
                className="group border border-border/70 hover:border-primary/40 rounded-2xl p-5 bg-card hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${hub.accent} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                  {hub.title}
                </h3>
                {count !== null && (
                  <p className="text-[10px] font-bold text-primary mb-1">
                    {count} {hub.count}
                  </p>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed">{hub.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Country Quick-Links ── */}
      {countries.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                WhatsApp QR Generators by Country
              </h2>
              <p className="text-muted-foreground text-xs mt-1">
                Country-validated QR codes with correct calling codes, carrier prefixes, and local regulatory notes.
              </p>
            </div>
            <Link
              href="/whatsapp-qr"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
            >
              All {countries.length} countries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/whatsapp-qr/${c.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-medium text-foreground"
              >
                <span>{c.isoCode}</span>
                <span className="text-muted-foreground">{c.callingCode}</span>
                <span className="font-semibold">{c.name}</span>
              </Link>
            ))}
            <Link
              href="/whatsapp-qr"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
            >
              +40 more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Payment QR Quick-Links ── */}
      {payments.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Official Payment QR Standards
              </h2>
              <p className="text-muted-foreground text-xs mt-1">
                Spec-compliant payment QR generators for global instant payment networks — Pix, UPI, Raast, SGQR, and more.
              </p>
            </div>
            <Link
              href="/payment-qr"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
            >
              All {payments.length} schemes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {payments.map((p) => (
              <Link
                key={p.slug}
                href={`/payment-qr/${p.slug}`}
                className="group border border-border/70 hover:border-primary/40 rounded-xl p-4 bg-card hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {p.currency}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {p.governingBody} · {p.country}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cornerstone Guides & Research */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Standards & Research</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Technical Guides & Optical Standards
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Peer-reviewed technical tutorials on error correction mathematics, print sizing, and security.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
          >
            <span>View All {getAllArticles().length} Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => (
            <article
              key={art.slug}
              className="border border-border/70 rounded-2xl p-5 bg-card hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                  {art.category}
                </span>
                <h3 className="font-bold text-base text-foreground leading-snug hover:text-primary transition-colors">
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {art.description}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">{art.readTime}</span>
                <Link
                  href={`/blog/${art.slug}`}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Read Guide <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section — addresses common questions for SEO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/60">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Is QR Studio really free with no hidden subscriptions?',
              a: 'Yes. QR Studio generates all QR codes directly in your browser with zero server communication. Static QR codes generated here never expire, cannot be disabled, and require no account or subscription. The code you download is permanently yours.',
            },
            {
              q: 'What is the difference between static and dynamic QR codes?',
              a: 'A static QR code encodes data directly into the module matrix and works permanently offline. A dynamic QR code encodes a proxy redirect URL that depends on an external server staying active — if the vendor shuts down or you stop paying, all printed codes break. QR Studio only generates static, permanent codes.',
            },
            {
              q: 'What file formats can I download?',
              a: 'You can download lossless vector SVG (infinite scaling), print-ready PDF, high-resolution PNG (up to 4K), HD PNG, JPEG, or copy the raw data URI and embed HTML snippet. SVG and PDF are recommended for commercial printing.',
            },
            {
              q: 'Can I add my logo to a QR code?',
              a: 'Yes. Upload any PNG or SVG logo via the customization panel. QR Studio automatically switches to Error Correction Level H (30% recovery) and validates that your logo covers less than 20% of the symbol area, preserving full scannability.',
            },
            {
              q: 'Which payment QR standards are supported?',
              a: 'QR Studio generates spec-compliant payment codes for UPI (India), Raast (Pakistan), Pix BR Code (Brazil), SGQR (Singapore), Swiss QR-Bill, SEPA EPC QR Code, and more. Each generator validates fields per the official governing body specification.',
            },
          ].map((item, i) => (
            <details key={i} className="border border-border/60 rounded-xl bg-card">
              <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                {item.q}
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is QR Studio really free with no hidden subscriptions?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. QR Studio generates all QR codes directly in your browser. Static codes never expire and require no account or subscription.' },
                },
                {
                  '@type': 'Question',
                  name: 'What is the difference between static and dynamic QR codes?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Static QR codes encode data directly and work permanently offline. Dynamic codes depend on an external redirect server — if the vendor shuts down or you stop paying, all printed codes break.' },
                },
                {
                  '@type': 'Question',
                  name: 'What file formats can I download?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Vector SVG, print-ready PDF, high-resolution PNG (up to 4K), JPEG, and data URI embed code. SVG and PDF are recommended for commercial printing.' },
                },
                {
                  '@type': 'Question',
                  name: 'Can I add my logo to a QR code?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. Upload any PNG or SVG logo. QR Studio automatically switches to Error Correction Level H and validates that the logo covers less than 20% of the symbol area.' },
                },
                {
                  '@type': 'Question',
                  name: 'Which payment QR standards are supported?',
                  acceptedAnswer: { '@type': 'Answer', text: 'UPI (India), Raast (Pakistan), Pix BR Code (Brazil), SGQR (Singapore), Swiss QR-Bill, SEPA EPC QR Code, and more — each validated per official governing body specification.' },
                },
              ],
            }),
          }}
        />
      </section>

      {/* AdSlot before footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AdSlot id="home-bottom" format="horizontal-banner" />
      </div>
    </>
  );
}
