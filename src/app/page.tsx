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
} from 'lucide-react';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Free QR Code Generator & Optical Engineering Suite — QR Studio',
  description: '100% free, client-side QR code generator and optical toolsuite. 40+ types, scan-distance calculator, safety checker, print quality tester, and offline file transfer. Zero sign-up.',
  alternates: { canonical: 'https://qrstudio.app' },
  openGraph: {
    title: 'Free QR Code Generator & Optical Engineering Suite — QR Studio',
    description: '100% client-side QR code generator with 15 specialized optical tools. No sign-up, zero data stored.',
    url: 'https://qrstudio.app',
  },
};

const FEATURED_TOOLS = [
  {
    title: 'QR Size & Distance Calculator',
    desc: 'Calculate mathematically optimal print dimensions based on camera sensor physics and viewing distance.',
    href: '/qr-size-calculator',
    icon: Calculator,
    tag: 'Optical Math',
  },
  {
    title: 'QR Safety & Phishing Checker',
    desc: 'Inspect suspicious QR codes client-side. Detect homograph spoofing, IP redirects, and short-link quishing.',
    href: '/qr-safety-checker',
    icon: ShieldCheck,
    tag: 'Cybersecurity',
  },
  {
    title: 'Printed-QR Quality Tester',
    desc: 'Upload printed photos to calculate luminance contrast ratios, Laplacian edge blur, and camera decodability.',
    href: '/printed-qr-tester',
    icon: Camera,
    tag: 'Prepress Audit',
  },
  {
    title: 'Error-Correction Damage Simulator',
    desc: 'Scratch and damage live QR codes to visualize real-time Reed-Solomon polynomial byte reconstruction.',
    href: '/error-correction-simulator',
    icon: Wrench,
    tag: 'Interactive Lab',
  },
  {
    title: 'Large-Data Splitter & Scanner',
    desc: 'Break extensive documents or crypto keys into sequenced multi-part QR codes and reassemble offline.',
    href: '/qr-splitter-scanner',
    icon: Layers,
    tag: 'Data Splitting',
  },
  {
    title: 'Animated-QR Offline File Transfer',
    desc: 'Transmit text and files across air-gapped computers via high-speed animated optical matrix stream.',
    href: '/animated-qr-transfer',
    icon: Radio,
    tag: 'Air-Gap Stream',
  },
  {
    title: 'Emergency Medical ID QR Card',
    desc: 'Generate printable emergency wallet cards and lock-screen wallpapers with offline blood type and allergies.',
    href: '/medical-id-qr',
    icon: HeartPulse,
    tag: 'Life Safety',
  },
  {
    title: 'Printable WiFi Signs (RTL Urdu/Arabic)',
    desc: 'Multilingual foldable table tents and wall signs with native Arabic and Urdu typography.',
    href: '/wifi-sign-generator',
    icon: Wifi,
    tag: 'Hospitality',
  },
  {
    title: 'Regional Payment QR (UPI / Raast)',
    desc: 'Generate official EMVCo Raast, JazzCash, Easypaisa, and Indian UPI payment codes with zero fees.',
    href: '/pakistan-payment-qr',
    icon: CreditCard,
    tag: 'Fintech Rails',
  },
  {
    title: 'Avery Sticker Sheet Layout Printer',
    desc: 'Batch format QR codes on standard Avery 5160, 5163, and round labels with sequential numbering.',
    href: '/qr-sticker-sheet-printer',
    icon: Grid,
    tag: 'Batch Printing',
  },
  {
    title: 'Pet Tag Lost & Found QR',
    desc: 'Double-sided printable pet collar tags with emergency contact numbers and medical alerts.',
    href: '/pet-tag-qr',
    icon: Heart,
    tag: 'Pet Safety',
  },
  {
    title: 'Bulk vCard from CSV',
    desc: 'Convert employee and attendee spreadsheets into hundreds of individual vCard 3.0 QR codes in seconds.',
    href: '/bulk-vcard-qr',
    icon: Users,
    tag: 'Enterprise',
  },
  {
    title: 'UTM Campaign QR Builder',
    desc: 'Generate campaign-tagged URLs and instant QR codes tracked in Google Analytics 4 (GA4).',
    href: '/utm-builder',
    icon: TrendingUp,
    tag: 'Attribution',
  },
  {
    title: 'Material Placement Checklist',
    desc: 'Pre-flight guidelines for printing on glass, metal, wood, apparel, and curved bottles.',
    href: '/qr-placement-guide',
    icon: Compass,
    tag: 'Substrates',
  },
  {
    title: '1D Barcode Generator with Checksum',
    desc: 'GS1-compliant EAN-13, UPC-A, Code 128, and ISBN barcodes with real-time Modulo-10 verification.',
    href: '/barcode-generator',
    icon: Barcode,
    tag: 'Retail 1D',
  },
];

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QR Studio',
    url: 'https://qrstudio.app',
    description: 'Free, client-side QR code generator and optical toolsuite.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Main Interactive Studio */}
      <HomeGenerator />

      {/* Zero-CLS Top Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot id="home-top" format="horizontal-banner" />
      </div>

      {/* Specialized Tools Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Engineering Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Specialized Optical & QR Tool Cluster
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Every tool runs 100% client-side in your browser. Zero tracking cookies, zero cloud storage, zero sign-up required.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group border border-border/70 hover:border-primary/50 rounded-2xl p-5 bg-card hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {t.tag}
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
              Engineering Guides & Best Practices
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Peer-reviewed technical tutorials on error correction mathematics, print sizing, and security.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
          >
            <span>View All Guides</span>
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
