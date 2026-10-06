import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPaymentSchemes } from '@/data/payments';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { CreditCard, Building2, ArrowRight, ShieldCheck, Coins } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Payment QR Code Scheme Library — ISO 20022 & EMVCo Specs',
  description:
    'Official spec generators for Pix (Brazil), Swiss QR-Bill (ISO 20022), SGQR (Singapore), UPI (India), Raast (Pakistan), SEPA, and 25+ international payment networks.',
  alternates: { canonical: 'https://freeqrcode.tools/payment-qr' },
};

export default function PaymentHubPage() {
  const schemes = getAllPaymentSchemes();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Payment QR Schemes', href: '/payment-qr' }]} />

      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Global Payment Rails Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Payment QR Code Scheme Library
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Generate compliant ISO 20022, EMVCo TLV, and national standard payment QR codes for bank apps and digital wallets worldwide. Zero intermediary fees, 100% client-side data privacy.
        </p>
      </header>

      {/* Top Banner AdSlot */}
      <AdSlot id="payment-hub-top" format="horizontal-banner" />

      {/* Payment Schemes Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {schemes.map((scheme) => (
          <article
            key={scheme.slug}
            className="flex flex-col justify-between border border-border/70 rounded-2xl p-6 bg-card hover:shadow-lg transition-all hover:border-blue-500/40 group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Coins className="w-3 h-3" />
                  {scheme.currency}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[140px]">
                  {scheme.country}
                </span>
              </div>

              <h2 className="font-bold text-xl text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
                <Link href={`/payment-qr/${scheme.slug}`}>
                  {scheme.name}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {scheme.content.trim().slice(0, 140)}...
              </p>

              <div className="space-y-1.5 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{scheme.governingBody}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[150px]">
                {scheme.standardSpec}
              </span>
              <Link
                href={`/payment-qr/${scheme.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Generate Spec</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom AdSlot */}
      <div className="mt-12">
        <AdSlot id="payment-hub-bottom" format="horizontal-banner" />
      </div>
    </div>
  );
}
