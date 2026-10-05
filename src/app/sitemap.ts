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
  ];
  return pages.map(p => ({ url: p.url, lastModified: now, changeFrequency: 'monthly' as const, priority: p.priority }));
}
