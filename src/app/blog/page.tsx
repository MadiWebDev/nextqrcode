import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'QR Code Resources & Blog — QR Studio',
  description: 'Guides, tutorials, and best practices for creating and using QR codes. Covering printing, sizing, error correction, WiFi QR codes, and more.',
  alternates: { canonical: 'https://qrstudio.app/blog' },
};

const ARTICLES = [
  { slug: 'how-qr-codes-work', title: 'How QR Codes Work: The Complete Technical Guide', teaser: 'QR codes store data in a two-dimensional matrix of black and white modules. Learn how the encoding algorithm works, what finder patterns are, and why error correction makes codes scannable even when damaged.' },
  { slug: 'qr-code-sizes-for-printing', title: 'QR Code Sizes for Printing: The Definitive Guide', teaser: 'The right print size depends on scan distance, data density, and substrate material. We cover minimum sizes for business cards, A4 flyers, posters, and product packaging — with real-world test results.' },
  { slug: 'static-vs-dynamic-qr-codes', title: 'Static vs Dynamic QR Codes: Which Should You Use?', teaser: 'Static QR codes encode data directly and last forever for free. Dynamic QR codes use a short-link redirect you can change after printing. We compare cost, use cases, and privacy implications.' },
  { slug: 'how-to-make-wifi-qr-code', title: 'How to Make a WiFi QR Code (Step by Step)', teaser: 'A WiFi QR code lets guests connect to your network with a single scan — no password sharing needed. Follow these steps to create one for your home, café, office, or hotel.' },
  { slug: 'qr-code-error-correction', title: 'QR Code Error Correction: What It Is and Why It Matters', teaser: 'QR codes have four error-correction levels (L, M, Q, H) that let them remain scannable even when partially obscured or damaged. Understand how to choose the right level for your use case.' },
  { slug: 'qr-codes-for-restaurants', title: 'Best QR Code Practices for Restaurants and Cafes', teaser: 'From contactless menus to review links and table-side ordering, QR codes have transformed the hospitality industry. Learn the best formats, placement strategies, and design tips for food-service businesses.' },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">QR Code Resources</h1>
        <p className="text-muted-foreground text-lg">Guides, tutorials, and best practices from the QR Studio team.</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {ARTICLES.map(article => (
          <article key={article.slug} className="border border-border/60 rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
            <h2 className="font-bold text-base mb-2 leading-snug">
              <Link href={`/blog/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{article.teaser}</p>
            <Link href={`/blog/${article.slug}`} className="text-xs font-medium text-primary hover:underline" aria-label={`Read more about ${article.title}`}>Read more →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
