import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src', 'app');

// Read sitemap to get toolPaths and generatorPaths
const sitemapContent = fs.readFileSync(path.join(APP_DIR, 'sitemap.ts'), 'utf8');

const toolMatch = sitemapContent.match(/const toolPaths = \[([\s\S]*?)\];/);
const genMatch = sitemapContent.match(/const generatorPaths = \[([\s\S]*?)\];/);

const tools = toolMatch
  ? (toolMatch[1].match(/'\/[^']+'/g) || []).map((s) => s.replace(/['\/]/g, ''))
  : [];
const gens = genMatch
  ? (genMatch[1].match(/'\/[^']+'/g) || []).map((s) => s.replace(/['\/]/g, ''))
  : [];

const targetSlugs = [...tools, ...gens];

console.log(`Checking ${targetSlugs.length} slugs...`);

let createdCount = 0;

for (const slug of targetSlugs) {
  const dir = path.join(APP_DIR, slug);
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${slug}`);
    continue;
  }

  const layoutPath = path.join(dir, 'layout.tsx');
  const pagePath = path.join(dir, 'page.tsx');

  if (fs.existsSync(layoutPath)) {
    continue; // already has layout
  }

  let pageContent = '';
  if (fs.existsSync(pagePath)) {
    pageContent = fs.readFileSync(pagePath, 'utf8');
    if (
      pageContent.includes('export const metadata') ||
      pageContent.includes('export async function generateMetadata')
    ) {
      continue; // already exports metadata
    }
  }

  // Extract h1 and description from pageContent
  let title = '';
  let description = '';

  const h1Match = pageContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1Match) {
    title = h1Match[1]
      .replace(/<[^>]+>/g, '')
      .replace(/\{['"](.*?)['"]\}/g, '$1')
      .trim();
  }

  // Clean title
  if (!title || title.includes('{') || title.length < 3) {
    // Generate from slug
    title = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .replace(/Qr/g, 'QR')
      .replace(/Pdf/g, 'PDF')
      .replace(/Sms/g, 'SMS')
      .replace(/Url/g, 'URL')
      .replace(/Wifi/g, 'WiFi')
      .replace(/Dpi/g, 'DPI');
  }

  // Extract description
  const pMatch =
    pageContent.match(
      /<p[^>]*class(?:Name)?=["'][^"']*text-muted-foreground[^"']*["'][^>]*>([\s\S]*?)<\/p>/
    ) ||
    pageContent.match(
      /<p[^>]*class(?:Name)?=["'][^"']*text-slate-[^"']*["'][^>]*>([\s\S]*?)<\/p>/
    ) ||
    pageContent.match(/<p[^>]*>([\s\S]*?)<\/p>/);

  if (pMatch) {
    description = pMatch[1]
      .replace(/<[^>]+>/g, '')
      .replace(/\{['"](.*?)['"]\}/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!description || description.length < 20 || description.includes('{')) {
    description = `Free online ${title.toLowerCase()} tool. Fast, accurate, and completely client-side in your browser with instant preview and vector export.`;
  }

  // Ensure title has brand suffix if not already present
  const metaTitle = title.toLowerCase().includes('qr')
    ? `${title} — QR Studio`
    : `${title} QR Code Tool — QR Studio`;

  const layoutCode = `import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: ${JSON.stringify(metaTitle)},
  description: ${JSON.stringify(description)},
  alternates: {
    canonical: 'https://freeqrcode.tools/${slug}',
  },
  openGraph: {
    title: ${JSON.stringify(metaTitle)},
    description: ${JSON.stringify(description)},
    url: 'https://freeqrcode.tools/${slug}',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: ${JSON.stringify(metaTitle)},
    description: ${JSON.stringify(description)},
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
`;

  fs.writeFileSync(layoutPath, layoutCode, 'utf8');
  createdCount++;
}

console.log(`Successfully generated ${createdCount} layout.tsx files with complete SEO metadata!`);
