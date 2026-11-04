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
    : // No Disallow line here: that is robots.txt syntax, not ads.txt, and
      // it confused the live file. When the env var is unset, return only
      // a comment so AdSense does not see a bogus authorised-sellers line.
      '# ads.txt pending: set ADSENSE_PUBLISHER_ID in Vercel, then redeploy\n';

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
