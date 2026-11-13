/**
 * JSON-LD builders for the image site. Everything is generated from the
 * real registry/guide data — no invented ratings, reviews or prices
 * (the app is free; offers are stated plainly as price 0).
 */
import type { ToolDef } from './registry';
import { CATEGORY_LABELS } from './registry';
import type { Guide } from './guides';

export const SITE_URL = 'https://imageresizer.freeqrcode.tools';

export function toolJsonLd(tool: ToolDef): Record<string, unknown>[] {
  const url = `${SITE_URL}/${tool.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebApplication',
      name: tool.name,
      url,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (modern web browser)',
      browserRequirements: 'Requires a modern browser with canvas support',
      description: tool.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: CATEGORY_LABELS[tool.category],
          item: `${SITE_URL}/categories/${tool.category}`,
        },
        { '@type': 'ListItem', position: 3, name: tool.name, item: url },
      ],
    },
  ];
  if (tool.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }
  return graph;
}

export function homeJsonLd(faqs: Array<{ q: string; a: string }>): Record<string, unknown>[] {
  return [
    {
      '@type': 'WebApplication',
      name: 'Image Resizer — Free Online Image Tools',
      url: `${SITE_URL}/`,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (modern web browser)',
      description:
        'Resize, compress, crop, convert and edit images privately in your browser — bulk tools, an editor, passport photos, social sizes and more.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];
}

export function guideJsonLd(guide: Guide): Record<string, unknown>[] {
  const url = `${SITE_URL}/guides/${guide.slug}`;
  return [
    {
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      url,
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      author: { '@type': 'Organization', name: 'Free QR Code Tools', url: 'https://freeqrcode.tools/' },
      publisher: { '@type': 'Organization', name: 'Free QR Code Tools', url: 'https://freeqrcode.tools/' },
      mainEntityOfPage: url,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url },
      ],
    },
  ];
}

export function categoryJsonLd(
  category: string,
  label: string,
  tools: ToolDef[]
): Record<string, unknown>[] {
  const url = `${SITE_URL}/categories/${category}`;
  return [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: label, item: url },
      ],
    },
    {
      '@type': 'ItemList',
      name: `${label} tools`,
      itemListElement: tools.map((tool, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tool.name,
        url: `${SITE_URL}/${tool.slug}`,
      })),
    },
  ];
}
