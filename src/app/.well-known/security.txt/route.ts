/**
 * RFC 9116 security.txt — served at /.well-known/security.txt.
 *
 * NOTE: no dedicated security mailbox exists yet. The contact below is the
 * site's public security address (also published on /contact); point it at a
 * monitored security inbox as soon as one is created.
 */

/** Pre-rendered once, so Expires is generated at build time. */
export const dynamic = 'force-static';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export async function GET() {
  const expires = new Date(Date.now() + ONE_YEAR_MS).toISOString();
  const body = [
    'Contact: mailto:security@freeqrcode.tools',
    `Expires: ${expires}`,
    'Preferred-Languages: en',
  ].join('\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
