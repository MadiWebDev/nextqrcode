import { ImageResponse } from 'next/og';
import { loadScanGuide } from '@/content/families/scan-guide';
import { siteConfig } from '@/config/site';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const FAMILY_LABEL = 'SCAN GUIDE';
const FALLBACK_TITLE = 'QR Scanning Guides';

/**
 * OG image for industry guide entries: dark gradient, family label,
 * entry title and brand. Falls back to the family name for unknown slugs.
 */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = loadScanGuide().find((e) => e.slug === slug)?.title ?? FALLBACK_TITLE;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #0f172a 100%)',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: 80,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          Q
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 6, opacity: 0.85 }}>
          {FAMILY_LABEL}
        </div>
      </div>
      <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.15, maxWidth: 1020 }}>{title}</div>
      <div style={{ marginTop: 36, fontSize: 28, opacity: 0.7 }}>
        {siteConfig.name} · {siteConfig.url.replace('https://', '')}
      </div>
    </div>,
    { ...size }
  );
}
