import { NextRequest, NextResponse } from 'next/server';
import { notFound, redirect } from 'next/navigation';
import type { Types } from 'mongoose';
import { dbConnect } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { ScanEvent } from '@/models/ScanEvent';
import { getClientIp } from '@/lib/security/rate-limit';
import { hashIp, parseUserAgent, verifyUnlockToken, isBlockedScheme } from '@/lib/security/abuse';
import { siteConfig } from '@/config/site';

/** Minimal view of a QR document for the redirect flow. */
interface QrForRedirect {
  _id: unknown;
  publicId: string;
  mode?: string;
  payload?: string | null;
  destinationUrl?: string | null;
  status?: string;
  expiresAt?: Date | string | null;
  passwordHash?: string | null;
  moderation?: { status?: string } | null;
}

function plain(status: number, message: string): NextResponse {
  return new NextResponse(message, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

/**
 * HTML interstitial shown when a QR was flagged for abuse and the visitor has
 * not acknowledged the warning yet. No ads, no tracking scripts — just the
 * warning, the destination, a continue link and a report note.
 */
function flaggedInterstitial(publicId: string, destination: string): NextResponse {
  const safeDest = escapeHtml(destination);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Warning: reported link — ${escapeHtml(siteConfig.name)}</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;background:#fff7ed;color:#431407;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px}
.card{max-width:560px;background:#fff;border:1px solid #fdba74;border-radius:12px;padding:32px;box-shadow:0 8px 30px rgba(0,0,0,.08)}
h1{font-size:22px;margin:0 0 12px}
p{line-height:1.6;margin:0 0 12px}
code{word-break:break-all;background:#ffedd5;padding:2px 6px;border-radius:4px;font-size:13px}
.actions{display:flex;gap:12px;margin-top:20px;flex-wrap:wrap}
a.btn{display:inline-block;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600}
a.continue{background:#ea580c;color:#fff}
a.back{background:#fed7aa;color:#7c2d12}
.note{font-size:13px;color:#9a3412;margin-top:16px}
</style>
</head>
<body>
<main class="card">
<h1>⚠️ This link was reported for abuse</h1>
<p>This destination was reported as phishing or malware. Only continue if you trust the source that shared this QR code with you.</p>
<p>Destination: <code>${safeDest}</code></p>
<div class="actions">
<a class="continue" href="/r/${escapeHtml(publicId)}?ack=1">Continue anyway</a>
<a class="back" href="${escapeHtml(siteConfig.url)}">Go back</a>
</div>
<p class="note">To report this link, send { "publicId": "${escapeHtml(publicId)}", "reason": "phishing" } to <code>POST ${escapeHtml(siteConfig.url)}/api/reports</code>.</p>
</main>
</body>
</html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

function referrerHost(req: NextRequest): string {
  const referer = req.headers.get('referer');
  if (!referer) return '';
  try {
    return new URL(referer).hostname;
  } catch {
    return '';
  }
}

/**
 * Fire-and-forget scan logging. Analytics must never break the redirect:
 * every failure is swallowed inside this function.
 */
async function logScan(qrId: unknown, req: NextRequest): Promise<void> {
  try {
    await dbConnect();
    const ua = req.headers.get('user-agent') ?? '';
    const parsed = parseUserAgent(ua);
    const objectId = qrId as Types.ObjectId;
    await ScanEvent.create({
      qrId: objectId,
      ts: new Date(),
      country: req.headers.get('x-vercel-ip-country') ?? 'unknown',
      deviceType: parsed.deviceType,
      os: parsed.os,
      browser: parsed.browser,
      referrerHost: referrerHost(req),
      ipHash: hashIp(getClientIp(req)),
    });
    await QrCode.updateOne({ _id: objectId }, { $inc: { scanCount: 1 } });
  } catch {
    // analytics never breaks redirects
  }
}

/** Resolve the final redirect target for a QR, or an error message. */
function resolveDestination(qr: QrForRedirect): { url: string } | { error: string } {
  if (qr.mode === 'static') {
    const payload = (qr.payload ?? '').trim();
    if (!payload || isBlockedScheme(payload)) {
      return { error: 'Static QR payload is not a link' };
    }
    try {
      const parsed = new URL(payload);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { error: 'Static QR payload is not a link' };
      }
      return { url: parsed.toString() };
    } catch {
      return { error: 'Static QR payload is not a link' };
    }
  }
  const dest = (qr.destinationUrl ?? '').trim();
  if (!dest) return { error: 'This QR code has no destination configured' };
  return { url: dest };
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await ctx.params;

  try {
    await dbConnect();
  } catch {
    // Short links require the database; without it this feature is unavailable.
    return plain(503, 'Dynamic links are not configured on this deployment.');
  }
  const qr = (await QrCode.findOne({ publicId }).lean()) as unknown as QrForRedirect | null;
  if (!qr) notFound();

  if (qr.status === 'paused') {
    return plain(410, 'This link is paused by its owner.');
  }
  if (qr.status === 'blocked') {
    return plain(410, 'This link was blocked for abuse.');
  }
  if (qr.expiresAt && new Date(qr.expiresAt).getTime() < Date.now()) {
    return plain(410, 'This link has expired.');
  }

  if (qr.passwordHash) {
    const token = req.nextUrl.searchParams.get('t');
    if (!token || !verifyUnlockToken(qr.publicId, token)) {
      redirect(`/unlock/${qr.publicId}`);
    }
  }

  const resolved = resolveDestination(qr);
  if ('error' in resolved) {
    return plain(400, resolved.error);
  }

  if (qr.moderation?.status === 'flagged' && req.nextUrl.searchParams.get('ack') !== '1') {
    return flaggedInterstitial(qr.publicId, resolved.url);
  }

  void logScan(qr._id, req);
  return NextResponse.redirect(resolved.url, 307);
}
