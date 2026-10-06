import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCountries } from '@/data/countries';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Globe2, MessageCircle, ArrowRight, ShieldAlert, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WhatsApp QR Code Generator by Country — Instant Chat Links',
  description:
    'Country-specific WhatsApp QR code generators with calling code auto-detection, carrier prefix validation, domestic zero-stripping rules, and local regulatory notes.',
  alternates: { canonical: 'https://freeqrcode.tools/whatsapp-qr' },
};

export default function WhatsAppHubPage() {
  const countries = getAllCountries();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'WhatsApp QR by Country', href: '/whatsapp-qr' }]} />

      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
          <Globe2 className="w-3.5 h-3.5" />
          <span>Country-Specific Messaging Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          WhatsApp QR Code Generators by Country
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Select your destination country to generate ITU-T E.164 compliant WhatsApp QR codes. Automatic national prefix validation, domestic zero-stripping, and native pre-filled message templates for local business & customer service.
        </p>
      </header>

      {/* Top Banner AdSlot */}
      <AdSlot id="whatsapp-hub-top" format="horizontal-banner" />

      {/* Country Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {countries.map((country) => (
          <article
            key={country.slug}
            className="flex flex-col justify-between border border-border/70 rounded-2xl p-6 bg-card hover:shadow-lg transition-all hover:border-emerald-500/40 group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  {country.callingCode}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  ISO: {country.isoCode}
                </span>
              </div>

              <h2 className="font-bold text-xl text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug mb-2">
                <Link href={`/whatsapp-qr/${country.slug}`}>
                  WhatsApp QR {country.name}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {country.content.trim().slice(0, 140)}...
              </p>

              <div className="space-y-1.5 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Carriers: {country.localCarriers.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Sample: {country.callingCode} {country.sampleNumber}
              </span>
              <Link
                href={`/whatsapp-qr/${country.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Generate QR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom AdSlot */}
      <div className="mt-12">
        <AdSlot id="whatsapp-hub-bottom" format="horizontal-banner" />
      </div>
    </div>
  );
}
