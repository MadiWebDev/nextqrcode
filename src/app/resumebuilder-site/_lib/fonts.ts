/**
 * Font pairs (spec §7). Each pair is a heading stack + body stack built
 * from self-hosted next/font families (loaded in the site layout) with
 * system fallbacks, so resumes render identically in preview, print
 * PDF and PNG without any external font request at runtime.
 */
export interface FontPair {
  id: string;
  name: string;
  heading: string;
  body: string;
  /** Script families this pair is designed for. */
  scripts: Array<'latin' | 'arabic' | 'urdu'>;
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: 'source-inter',
    name: 'Source Serif + Inter',
    heading: "'Source Serif 4', Georgia, serif",
    body: "'Inter', 'Segoe UI', Arial, sans-serif",
    scripts: ['latin'],
  },
  {
    id: 'playfair-worksans',
    name: 'Playfair + Work Sans',
    heading: "'Playfair Display', Georgia, serif",
    body: "'Work Sans', 'Segoe UI', Arial, sans-serif",
    scripts: ['latin'],
  },
  {
    id: 'lora-plex',
    name: 'Lora + IBM Plex Sans',
    heading: "'Lora', Georgia, serif",
    body: "'IBM Plex Sans', 'Segoe UI', Arial, sans-serif",
    scripts: ['latin'],
  },
  {
    id: 'grotesk-inter',
    name: 'Space Grotesk + Inter',
    heading: "'Space Grotesk', 'Arial Narrow', sans-serif",
    body: "'Inter', 'Segoe UI', Arial, sans-serif",
    scripts: ['latin'],
  },
  {
    id: 'georgia-arial',
    name: 'Georgia + Arial (system)',
    heading: "Georgia, 'Times New Roman', serif",
    body: "Arial, 'Helvetica Neue', sans-serif",
    scripts: ['latin'],
  },
  {
    id: 'garamond-helvetica',
    name: 'EB Garamond + Helvetica (system)',
    heading: "'EB Garamond', Garamond, Georgia, serif",
    body: "'Helvetica Neue', Arial, sans-serif",
    scripts: ['latin'],
  },
  {
    id: 'naskh-sans',
    name: 'Noto Naskh Arabic',
    heading: "'Noto Naskh Arabic', 'Traditional Arabic', serif",
    body: "'Noto Naskh Arabic', 'Traditional Arabic', serif",
    scripts: ['arabic'],
  },
  {
    id: 'nastaliq-sans',
    name: 'Noto Nastaliq Urdu',
    heading: "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif",
    body: "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif",
    scripts: ['urdu', 'arabic'],
  },
];

export function fontPair(id: string): FontPair {
  return FONT_PAIRS.find((p) => p.id === id) ?? FONT_PAIRS[0];
}
