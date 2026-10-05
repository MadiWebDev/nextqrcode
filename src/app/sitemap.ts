import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://qrstudio.app';
  const now = new Date();

  const coreTools = [
    '/qr-size-calculator',
    '/qr-safety-checker',
    '/printed-qr-tester',
    '/error-correction-simulator',
    '/qr-splitter-scanner',
    '/animated-qr-transfer',
    '/medical-id-qr',
    '/wifi-sign-generator',
    '/pakistan-payment-qr',
    '/regional-payment-qr',
    '/qr-sticker-sheet-printer',
    '/pet-tag-qr',
    '/bulk-vcard-qr',
    '/bulk-vcard-generator',
    '/utm-builder',
    '/qr-placement-guide',
    '/barcode-generator',
  ];

  const standardGenerators = [
    '/url-qr-code-generator',
    '/wifi-qr-code-generator',
    '/vcard-qr-code-generator',
    '/whatsapp-qr-code-generator',
    '/upi-qr-code-generator',
    '/bitcoin-qr-code-generator',
  ];

  const trustPages = [
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cookie-policy',
    '/disclaimer',
    '/sitemap-page',
    '/blog',
  ];

  const articles = getAllArticles();

  const toolEntries: MetadataRoute.Sitemap = coreTools.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const generatorEntries: MetadataRoute.Sitemap = standardGenerators.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${base}/blog/${art.slug}`,
    lastModified: new Date(art.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const trustEntries: MetadataRoute.Sitemap = trustPages.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...toolEntries,
    ...generatorEntries,
    ...articleEntries,
    ...trustEntries,
  ];
}
