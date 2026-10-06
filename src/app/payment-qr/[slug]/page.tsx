import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPaymentSchemes, getPaymentSchemeBySlug } from '@/data/payments';
import { LandingGenerator } from '@/components/LandingGenerator';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { CreditCard, ShieldCheck, Building2, Coins, ArrowLeft, FileCheck } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const schemes = getAllPaymentSchemes();
  return schemes.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scheme = getPaymentSchemeBySlug(slug);

  if (!scheme) {
    return { title: 'Payment Scheme Not Found | QR Code Tools' };
  }

  return {
    title: `Free ${scheme.name} Generator — Compliant ${scheme.currency} QR`,
    description: `Generate official ${scheme.name} codes compliant with ${scheme.governingBody} specifications (${scheme.standardSpec}). Instant SVG & PDF export.`,
    alternates: {
      canonical: `https://freeqrcode.tools/payment-qr/${scheme.slug}`,
    },
    openGraph: {
      title: `${scheme.name} Generator — QR Code Tools`,
      description: `Create ${scheme.name} QR codes for ${scheme.country}. Adheres strictly to ${scheme.standardSpec}. Zero processing fees.`,
      url: `https://freeqrcode.tools/payment-qr/${scheme.slug}`,
    },
  };
}

export default async function PaymentSchemePage({ params }: Props) {
  const { slug } = await params;
  const scheme = getPaymentSchemeBySlug(slug);

  if (!scheme) {
    notFound();
  }

  const allSchemes = getAllPaymentSchemes();
  const otherSchemes = allSchemes.filter((p) => p.slug !== scheme.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Payment QR Schemes', href: '/payment-qr' },
          { label: scheme.name, href: `/payment-qr/${scheme.slug}` },
        ]}
      />

      {/* Embedded Generator for Payment Rails */}
      <LandingGenerator
        type="finance"
        data={{
          title: `Free ${scheme.name} Generator`,
          description: `Create official ${scheme.name} codes for ${scheme.country} (${scheme.currency}). Governed by ${scheme.governingBody} using official ${scheme.standardSpec} specifications.`,
          howTo: [
            `Fill in your merchant credentials (${scheme.fields.map((f) => f.label).slice(0, 2).join(', ')}).`,
            `Specify the transaction amount in ${scheme.currency} or leave blank for open customer input.`,
            'Download high-resolution SVG or PNG format to insert directly on paper invoices or point-of-sale displays.',
          ],
          faqs: scheme.faqs.map((f) => ({ q: f.question, a: f.answer })),
          relatedTypes: [
            { type: 'upi', label: 'India UPI Payment QR', slug: '/upi-qr-code-generator' },
            { type: 'bitcoin', label: 'Bitcoin Crypto QR', slug: '/bitcoin-qr-code-generator' },
            { type: 'sepa', label: 'SEPA Credit Transfer', slug: '/sepa-qr' },
          ],
        }}
      />

      {/* AdSlot */}
      <AdSlot id={`payment-${scheme.slug}-mid`} format="horizontal-banner" />

      {/* Technical Specifications & Regulatory Section */}
      <section className="bg-card border border-border/70 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-foreground">
            Technical Specification: {scheme.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-muted/60 space-y-1">
            <span className="text-muted-foreground block text-[11px]">Governing Body</span>
            <span className="font-semibold text-foreground">{scheme.governingBody}</span>
          </div>
          <div className="p-3 rounded-xl bg-muted/60 space-y-1">
            <span className="text-muted-foreground block text-[11px]">Standard Specification</span>
            <span className="font-semibold text-foreground font-mono">{scheme.standardSpec}</span>
          </div>
          <div className="p-3 rounded-xl bg-muted/60 space-y-1">
            <span className="text-muted-foreground block text-[11px]">Settlement Currency</span>
            <span className="font-semibold text-foreground">{scheme.currency} ({scheme.country})</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {scheme.content.trim()}
        </div>

        {/* Regulatory Note */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Regulatory Standard Compliance</span>
            {scheme.regulatoryNotes}
          </div>
        </div>
      </section>

      {/* Other Payment Schemes Grid */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Explore Other Payment QR Schemes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherSchemes.map((p) => (
            <Link
              key={p.slug}
              href={`/payment-qr/${p.slug}`}
              className="p-3.5 border border-border/60 rounded-xl bg-card hover:border-blue-500/40 hover:shadow-sm transition-all text-xs font-medium text-foreground flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold block">{p.name}</span>
                <span className="text-[11px] text-muted-foreground">{p.country} ({p.currency})</span>
              </div>
              <Coins className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
