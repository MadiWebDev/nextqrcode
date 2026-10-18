import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash, timingSafeEqual } from 'node:crypto';
import { dbConnect } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { rateLimit, getClientIp } from '@/lib/security/rate-limit';
import { createUnlockToken } from '@/lib/security/abuse';

const unlockSchema = z.object({
  password: z.string().min(1).max(200),
});

/** Minimal view of a QR document for the unlock check. */
interface QrWithPassword {
  publicId: string;
  destinationUrl?: string | null;
  passwordHash?: string | null;
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const rl = await rateLimit(`unlock:${getClientIp(req)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = unlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }

  const { id } = await ctx.params;
  try {
    await dbConnect();
  } catch {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const qr = (await QrCode.findOne({ publicId: id }).lean()) as unknown as QrWithPassword | null;
  if (!qr) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!qr.passwordHash || typeof qr.destinationUrl !== 'string') {
    return NextResponse.json({ error: 'This QR code is not password protected' }, { status: 400 });
  }

  const expected = Buffer.from(qr.passwordHash, 'hex');
  const actual = createHash('sha256').update(parsed.data.password, 'utf8').digest();
  const matches = expected.length === actual.length && timingSafeEqual(expected, actual);
  if (!matches) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 403 });
  }

  return NextResponse.json({
    destinationUrl: qr.destinationUrl,
    token: createUnlockToken(qr.publicId),
  });
}
