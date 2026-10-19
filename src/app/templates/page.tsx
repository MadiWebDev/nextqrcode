import type { Metadata } from 'next';
import Link from 'next/link';
import QRCode from 'qrcode';
import { getAllTemplates } from '@/data/templates-gallery';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'QR Code Design Templates Gallery | QR Studio',
  description:
    'Browse 30 professional QR code design templates — minimal, corporate, neon, luxury, wedding and more. Each with honest scanability guidance, palettes, and best-use advice.',
  alternates: { canonical: `${siteConfig.url}/templates` },
  openGraph: {
    title: 'QR Code Design Templates Gallery',
    description:
      'Browse 30 professional QR code design templates with honest scanability guidance.',
    type: 'website',
    url: `${siteConfig.url}/templates`,
  },
};

export default async function TemplatesHubPage() {
  const templates = getAllTemplates();
  const previews = await Promise.all(
    templates.map((t) =>
      QRCode.toString(`${siteConfig.url}/templates/${t.slug}`, {
        type: 'svg',
        errorCorrectionLevel: t.ecLevel,
        margin: 1,
        color: { dark: t.colorPalette[0], light: t.colorPalette[1] },
      })
    )
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: '/' },
          { name: 'QR Templates', url: '/templates' },
        ]}
        baseUrl={siteConfig.url}
      />
      <WebPageJsonLd
        name="QR Code Design Templates Gallery"
        url={`${siteConfig.url}/templates`}
        description="Browse 30 professional QR code design templates with honest scanability guidance."
      />

      <Breadcrumbs items={[{ label: 'QR Templates', href: '/templates' }]} />
      <AdSlot id="templates-top" format="horizontal-banner" />

      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
          QR Code Design Templates
        </h1>
        <p className="text-muted-foreground leading-7">
          Thirty production-ready QR code designs across industries and styles — from minimal
          business cards to neon nightlife. Every template ships with honest scanability guidance:
          contrast notes, minimum print sizes, and clear warnings where decorative choices (inverted
          colors, gradients, light palettes) trade reliability for style. Pick a template to see its
          full design specification, best-use advice, and FAQs.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <Link
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all"
          >
            <div className="p-6 flex justify-center bg-white">
              <div
                className="w-40 h-40 [&>svg]:w-full [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: previews[i] }}
                role="img"
                aria-label={`${t.name} template preview`}
              />
            </div>
            <div className="p-5">
              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary mb-2">
                {t.designStyle}
              </div>
              <h2 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {t.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.primaryUseCase}</p>
              <p className="text-xs text-muted-foreground mt-2">{t.targetIndustry}</p>
            </div>
          </Link>
        ))}
      </div>
      <AdSlot id="templates-bottom" format="horizontal-banner" />
    </div>
  );
}
