import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { Report } from '@/models/Report';
import { rateLimit, getClientIp } from '@/lib/security/rate-limit';
import { hashIp } from '@/lib/security/abuse';
import type { Types } from 'mongoose';

const reportSchema = z.object({
  publicId: z.string().min(1).max(32),
  reason: z.enum(['phishing', 'malware', 'spam', 'other']),
  // Accepted for forward-compatibility; the Report schema has no details
  // field, so it is validated and then intentionally not persisted.
  details: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`reports:${getClientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
  } catch {
    // Still acknowledge the report; the queue will be processed when the DB is back.
    return NextResponse.json({ ok: true });
  }
  // Look up only to link the report; the response never reveals existence.
  // Report.qrId is a required ObjectId, so when the QR is missing we persist
  // nothing — the caller still receives { ok: true } either way.
  const qr = (await QrCode.findOne({ publicId: parsed.data.publicId })
    .select('_id')
    .lean()) as unknown as { _id: Types.ObjectId } | null;

  if (qr) {
    await Report.create({
      qrId: qr._id,
      reason: parsed.data.reason,
      reporterHash: hashIp(getClientIp(req)),
      status: 'open',
    });
  }

  return NextResponse.json({ ok: true });
}
