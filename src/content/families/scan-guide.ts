import type { ContentEntry } from '../schema';
import { DEVICE_GUIDES, type DeviceScanGuide } from '../../data/devices';

/**
 * Adapter: src/data/devices.ts → ContentEntry[].
 *
 * Maps each approved device scan guide to a schema-validated content entry.
 * The page body combines the guide's prose with generated sections built
 * from the structured interface fields (scanner path, failure modes,
 * tested payloads, performance notes) so every page clears the 400-word
 * minimum with unique content.
 */

const LAST_REVIEWED = '2026-10-19';

/** h1 = title up to the first colon (every guide title follows "Topic: Angle"). */
function deriveH1(title: string): string {
  const idx = title.indexOf(':');
  return (idx > 0 ? title.slice(0, idx) : title).trim();
}

function buildContent(g: DeviceScanGuide): string {
  const parts: string[] = [g.content.trim()];

  parts.push(
    [
      '',
      '## Where the scanner lives on this device',
      '',
      g.nativeScanner
        ? `**Built-in scanner:** ${g.nativeScannerApp}.`
        : `**Built-in scanner:** none — ${g.nativeScannerApp.charAt(0).toLowerCase()}${g.nativeScannerApp.slice(1)}.`,
      '',
      `**How to reach it:** ${g.scannerPath}`,
    ].join('\n')
  );

  parts.push(
    [
      '',
      '## Common failure modes and fixes',
      '',
      ...g.commonFailureModes.flatMap((m) => [
        `### ${m.symptom}`,
        '',
        `**Why it happens:** ${m.cause}`,
        '',
        `**Fix:** ${m.fix}`,
        '',
      ]),
    ].join('\n')
  );

  parts.push(
    ['', '## What this guide covers in testing', '', ...g.testedWith.map((t) => `- ${t}`)].join(
      '\n'
    )
  );

  parts.push(['', '## Performance notes', '', g.performanceNotes].join('\n'));

  return parts.join('\n');
}

/**
 * ≥5 contextual internal links, all real site paths:
 * core QR tools, two sibling scan guides, and relevant generators.
 */
function buildInternalLinks(slug: string, index: number): string[] {
  const n = DEVICE_GUIDES.length;
  const sib1 = DEVICE_GUIDES[(index + 1) % n].slug;
  const sib2 = DEVICE_GUIDES[(index + 2) % n].slug;
  return [
    '/qr-scanner',
    '/qr-safety-checker',
    '/qr-size-calculator',
    '/error-correction-simulator',
    `/scan-guide/${sib1}`,
    `/scan-guide/${sib2}`,
    '/url-qr-code-generator',
    '/wifi-qr-code-generator',
  ];
}

function toEntry(g: DeviceScanGuide, index: number): ContentEntry {
  return {
    slug: g.slug,
    title: g.title,
    metaDescription: g.metaDescription,
    h1: deriveH1(g.title),
    content: buildContent(g),
    faqs: g.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    internalLinks: buildInternalLinks(g.slug, index),
    author: g.author,
    lastReviewed: LAST_REVIEWED,
    // Content describes observable device behavior only; no external
    // factual claims requiring citations.
    sources: [],
    status: 'published',
  };
}

/** Adapter: src/data/devices.ts → ContentEntry[]. */
export function loadScanGuide(): ContentEntry[] {
  return DEVICE_GUIDES.filter((g) => g.status === 'approved').map(toEntry);
}
