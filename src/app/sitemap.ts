import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://qrstudio.app';
  const now = new Date();
  const pages = [
    { url: base, priority: 1.0 },
    { url: `${base}/url-qr-code-generator`, priority: 0.9 },
    { url: `${base}/wifi-qr-code-generator`, priority: 0.9 },
    { url: `${base}/vcard-qr-code-generator`, priority: 0.9 },
    { url: `${base}/whatsapp-qr-code-generator`, priority: 0.9 },
    { url: `${base}/upi-qr-code-generator`, priority: 0.9 },
    { url: `${base}/bitcoin-qr-code-generator`, priority: 0.9 },
    { url: `${base}/blog`, priority: 0.7 },
    { url: `${base}/about`, priority: 0.5 },
    { url: `${base}/privacy`, priority: 0.3 },
    { url: `${base}/terms`, priority: 0.3 },
    { url: `${base}/contact`, priority: 0.4 },
    { url: `${base}/cookie-policy`, priority: 0.3 },
    { url: `${base}/disclaimer`, priority: 0.3 },
    { url: `${base}/sitemap-page`, priority: 0.3 },
    { url: `${base}/qr-size-calculator`, priority: 0.8 },
    { url: `${base}/wifi-sign-generator`, priority: 0.8 },
    { url: `${base}/barcode-generator`, priority: 0.8 },
    { url: `${base}/utm-builder`, priority: 0.8 },
    { url: `${base}/qr-safety-checker`, priority: 0.8 },
    { url: `${base}/medical-id-qr`, priority: 0.8 },
    { url: `${base}/pet-tag-qr`, priority: 0.8 },
    { url: `${base}/pakistan-payment-qr`, priority: 0.8 },
    { url: `${base}/bulk-vcard-qr`, priority: 0.8 },
  ];
  return pages.map(p => ({
    url: p.url,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p.priority,
  }));
}
