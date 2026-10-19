import { NextResponse } from 'next/server';

/**
 * GET /ads.txt — AdSense authorized-sellers declaration (IAB ads.txt spec).
 *
 * Reads the server-only ADSENSE_PUBLISHER_ID env var (never NEXT_PUBLIC_*,
 * never shipped to the client). Cached for one hour.
 */

export const runtime = 'nodejs';
export const revalidate = 3600;

const ADSENSE_RELATIONSHIP_ID = 'f0cb8b1d365ab739';

export function GET(): NextResponse {
  const publisherId = (process.env.ADSENSE_PUBLISHER_ID || '').trim();

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, ${ADSENSE_RELATIONSHIP_ID}\n`
    : '# ads.txt is not configured: set the ADSENSE_PUBLISHER_ID environment variable\n' +
      '# to your AdSense publisher ID (e.g. pub-0000000000000000).\n' +
      'Disallow: /\n';

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
