import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCountries, getCountryBySlug } from '@/data/countries';
import { LandingGenerator } from '@/components/LandingGenerator';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Phone, MessageCircle, ShieldAlert, ArrowLeft, Globe } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const countries = getAllCountries();
  return countries.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return { title: 'Country Not Found | QR Code Tools' };
  }

  return {
    title: `Free WhatsApp QR Code Generator for ${country.name} (${country.callingCode})`,
    description: `Create a WhatsApp QR code pre-formatted for ${country.name} with ${country.callingCode} country code. Includes carrier prefix validation, domestic zero-stripping rules, and pre-filled message templates.`,
    alternates: {
      canonical: `https://freeqrcode.tools/whatsapp-qr/${country.slug}`,
    },
    openGraph: {
      title: `WhatsApp QR Code Generator for ${country.name}`,
      description: `Generate instant WhatsApp chat QR codes for ${country.name} (${country.callingCode}). Fully compliant with local carrier prefixes and ITU-T standards.`,
      url: `https://freeqrcode.tools/whatsapp-qr/${country.slug}`,
    },
  };
}

export default async function WhatsAppCountryPage({ params }: Props) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const allCountries = getAllCountries();
  const otherCountries = allCountries.filter((c) => c.slug !== country.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'WhatsApp QR by Country', href: '/whatsapp-qr' },
          { label: country.name, href: `/whatsapp-qr/${country.slug}` },
        ]}
      />

      {/* Embedded Generator with Pre-configured Specs */}
      <LandingGenerator
        type="whatsapp"
        data={{
          title: `WhatsApp QR Code Generator for ${country.name} (${country.callingCode})`,
          description: `Generate instant, pre-filled WhatsApp chat QR codes for ${country.name}. Uses international ITU-T E.164 formatting (${country.callingCode}) with automatic leading-zero stripping for local mobile numbers.`,
          howTo: [
            `Enter your ${country.name} mobile phone number without the leading zero (e.g., ${country.sampleNumber}).`,
            'Select or type a pre-filled customer service message for your business.',
            'Customise colours or add your logo, then download your high-resolution PNG or SVG QR code.',
          ],
          faqs: country.faqs.map((f) => ({ q: f.question, a: f.answer })),
          relatedTypes: [
            { type: 'whatsapp', label: 'General WhatsApp QR', slug: '/whatsapp-qr-code-generator' },
            { type: 'vcard', label: 'vCard Contact QR', slug: '/vcard-qr-code-generator' },
            { type: 'phone', label: 'Phone Call QR', slug: '/phone' },
          ],
        }}
      />

      {/* AdSlot */}
      <AdSlot id={`whatsapp-${country.slug}-mid`} format="horizontal-banner" />

      {/* Deep-dive Country Guide & Regulatory Details */}
      <section className="bg-card border border-border/70 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-bold text-foreground">
            WhatsApp Integration in {country.name}
          </h2>
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {country.content.trim()}
        </div>

        {/* Regulatory Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Regulatory & Compliance Note ({country.isoCode})</span>
            {country.regulatoryNotes}
          </div>
        </div>

        {/* Local Carrier Networks */}
        <div className="pt-4 border-t border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-2">Supported Mobile Operators in {country.name}:</h3>
          <div className="flex flex-wrap gap-2">
            {country.localCarriers.map((carrier) => (
              <span key={carrier} className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground/80">
                {carrier}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Other Country Hub Links */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Explore WhatsApp QR Generators for Other Countries</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {otherCountries.map((c) => (
            <Link
              key={c.slug}
              href={`/whatsapp-qr/${c.slug}`}
              className="p-3 border border-border/60 rounded-xl bg-card hover:border-emerald-500/40 hover:shadow-sm transition-all text-xs font-medium text-foreground flex items-center justify-between group"
            >
              <span>{c.name}</span>
              <span className="text-muted-foreground group-hover:text-emerald-500 transition-colors">{c.callingCode}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
