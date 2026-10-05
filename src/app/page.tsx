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
  Cpu,
  Search,
} from 'lucide-react';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Free QR Code Generator & Optical Engineering Suite — QR Studio',
  description:
    'Generate beautiful, professional QR codes & barcodes 100% in your browser. 40+ types, instant vector SVG/PDF download, distance calculator, safety inspector, and offline file transfer. Zero tracking.',
  alternates: { canonical: 'https://qrstudio.app' },
  openGraph: {
    title: 'Free QR Code Generator & Optical Engineering Suite — QR Studio',
    description:
      'High-precision client-side QR studio: 40+ symbologies, print sizing calculator, anti-quishing safety checker, and air-gapped data transfer. No sign-up.',
    url: 'https://qrstudio.app',
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
    accent: 'from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400',
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

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QR Studio',
    url: 'https://qrstudio.app',
    description: 'Professional browser-based QR code generator and optical engineering platform.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://qrstudio.app/sitemap-page?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
              Complies with ISO/IEC 18004, EMVCo Raast, UPI, and native RTL Urdu/Arabic scripts.
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
              Every tool operates 100% client-side with zero cloud dependency. Designed for prepress designers, cybersecurity engineers, and international merchants.
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
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {t.desc}
                  </p>
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

      {/* AdSlot before footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AdSlot id="home-bottom" format="horizontal-banner" />
      </div>
    </>
  );
}
