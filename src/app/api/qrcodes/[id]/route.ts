import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Types } from 'mongoose';
import { getUserId } from '@/lib/auth';
import { dbConnect } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { ScanEvent } from '@/models/ScanEvent';
import { cloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
import {
  isBlockedScheme,
  isPrivateNetworkTarget,
  matchesLocalBlocklist,
  checkSafeBrowsing,
  hashPassword,
} from '@/lib/security/abuse';
import { qrToDto, toOwnerObjectId, type QrCodeLike } from '../route';

type RouteContext = { params: Promise<{ id: string }> };

function notFoundResponse() {
  // Ownership failures return 404 without leaking whether the QR exists.
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

async function findOwned(publicId: string, ownerId: Types.ObjectId) {
  await dbConnect();
  return QrCode.findOne({ publicId, ownerId });
}

/** Authenticate and resolve the owner's ObjectId; null response when unauthenticated. */
async function requireOwner(): Promise<{ ownerId: Types.ObjectId } | { response: NextResponse }> {
  const userId = await getUserId();
  const ownerId = userId ? toOwnerObjectId(userId) : null;
  if (!userId || !ownerId) {
    return { response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  }
  return { ownerId };
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const auth = await requireOwner();
  if ('response' in auth) return auth.response;
  const { id } = await ctx.params;
  const qr = await findOwned(id, auth.ownerId);
  if (!qr) return notFoundResponse();
  return NextResponse.json(qrToDto(qr.toObject() as unknown as QrCodeLike));
}

const patchSchema = z.object({
  title: z.string().max(120).optional(),
  tags: z.array(z.string().max(40)).max(10).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  status: z.enum(['active', 'paused']).optional(),
  destinationUrl: z.string().min(1).max(2048).optional(),
  design: z.record(z.unknown()).optional(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  password: z.string().max(200).optional(),
});

async function validateDestinationUrl(raw: string): Promise<string | null> {
  const trimmed = raw.trim();
  if (isBlockedScheme(trimmed)) return 'URL scheme not allowed';
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return 'destinationUrl must be a valid URL';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'destinationUrl must be an http(s) URL';
  }
  if (isPrivateNetworkTarget(trimmed)) {
    return 'destinationUrl must not target a private or loopback address';
  }
  if (matchesLocalBlocklist(trimmed)) return 'destinationUrl is on the local abuse blocklist';
  return null;
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const auth = await requireOwner();
  if ('response' in auth) return auth.response;
  const { id } = await ctx.params;
  const qr = await findOwned(id, auth.ownerId);
  if (!qr) return notFoundResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const input = parsed.data;

  if (input.destinationUrl !== undefined) {
    if (qr.mode !== 'dynamic') {
      return NextResponse.json(
        { error: 'destinationUrl can only be changed on dynamic QR codes' },
        { status: 400 }
      );
    }
    const error = await validateDestinationUrl(input.destinationUrl);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    const verdict = await checkSafeBrowsing(input.destinationUrl.trim());
    if (verdict === 'threat') {
      qr.set('moderation', {
        status: 'flagged',
        checkedAt: new Date(),
        reason: 'safe-browsing:threat',
      });
      qr.set('status', 'blocked');
      await qr.save();
      return NextResponse.json(
        { error: 'Destination flagged as unsafe by Google Safe Browsing' },
        { status: 400 }
      );
    }
    qr.set('destinationUrl', input.destinationUrl.trim());
  }

  if (input.title !== undefined) qr.set('title', input.title);
  if (input.tags !== undefined) qr.set('tags', input.tags);
  if (input.visibility !== undefined) qr.set('visibility', input.visibility);
  if (input.status !== undefined) qr.set('status', input.status);
  if (input.design !== undefined) qr.set('design', input.design);
  if (input.expiresAt !== undefined) {
    qr.set('expiresAt', input.expiresAt === null ? undefined : new Date(input.expiresAt));
  }
  if (input.password !== undefined) {
    // passwordHash is a declared schema field; normal set() persists it.
    if (input.password === '') {
      qr.set('passwordHash', undefined);
    } else {
      qr.set('passwordHash', hashPassword(input.password));
    }
  }

  await qr.save();
  return NextResponse.json(qrToDto(qr.toObject() as unknown as QrCodeLike));
}

function extractAssetIds(assets: unknown): string[] {
  if (!Array.isArray(assets)) return [];
  const ids: string[] = [];
  for (const a of assets) {
    if (typeof a === 'string' && a) ids.push(a);
    else if (a && typeof a === 'object') {
      const rec = a as Record<string, unknown>;
      const pid = rec.public_id ?? rec.publicId;
      if (typeof pid === 'string' && pid) ids.push(pid);
    }
  }
  return ids;
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const auth = await requireOwner();
  if ('response' in auth) return auth.response;
  const { id } = await ctx.params;
  const qr = await findOwned(id, auth.ownerId);
  if (!qr) return notFoundResponse();

  const assetIds = extractAssetIds((qr.toObject() as unknown as QrCodeLike).assets);

  await ScanEvent.deleteMany({ qrId: qr._id });
  await qr.deleteOne();

  // Best-effort Cloudinary cleanup: never fails the delete.
  if (isCloudinaryConfigured()) {
    for (const assetId of assetIds) {
      try {
        await cloudinary.uploader.destroy(assetId);
      } catch {
        // ignore individual asset failures
      }
    }
  }

  return NextResponse.json({ ok: true });
}
