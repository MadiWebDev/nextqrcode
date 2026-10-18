import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import { Types } from 'mongoose';
import { getUserId } from '@/lib/auth';
import { dbConnect } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { rateLimit } from '@/lib/security/rate-limit';
import {
  isBlockedScheme,
  isPrivateNetworkTarget,
  matchesLocalBlocklist,
  checkSafeBrowsing,
} from '@/lib/security/abuse';
import { siteConfig } from '@/config/site';

/** Minimal structural view of a QrCode document / lean object. */
export interface QrCodeLike {
  _id: unknown;
  publicId: string;
  ownerId?: unknown;
  type: string;
  mode: string;
  payload?: string | null;
  destinationUrl?: string | null;
  design?: unknown;
  title?: string | null;
  tags?: string[];
  visibility?: string;
  status?: string;
  expiresAt?: Date | string | null;
  scanCount?: number;
  moderation?: {
    status?: string;
    checkedAt?: Date | string | null;
    reason?: string | null;
  } | null;
  assets?: unknown;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Convert an authenticated user id string to the ObjectId the QrCode model
 * stores as ownerId. Returns null when the session id is not a valid ObjectId.
 */
export function toOwnerObjectId(userId: string): Types.ObjectId | null {
  return Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : null;
}

/** Serialize a QR document for API responses (never leaks passwordHash). */
export function qrToDto(qr: QrCodeLike) {
  return {
    id: String(qr._id),
    publicId: qr.publicId,
    ownerId: qr.ownerId ? String(qr.ownerId) : null,
    type: qr.type,
    mode: qr.mode,
    payload: qr.payload ?? null,
    destinationUrl: qr.destinationUrl ?? null,
    design: qr.design ?? null,
    title: qr.title ?? null,
    tags: qr.tags ?? [],
    visibility: qr.visibility ?? null,
    status: qr.status ?? null,
    expiresAt: qr.expiresAt ? new Date(qr.expiresAt).toISOString() : null,
    scanCount: qr.scanCount ?? 0,
    moderation: qr.moderation
      ? {
          status: qr.moderation.status ?? null,
          checkedAt: qr.moderation.checkedAt
            ? new Date(qr.moderation.checkedAt).toISOString()
            : null,
          reason: qr.moderation.reason ?? null,
        }
      : null,
    url: `${siteConfig.url}/r/${qr.publicId}`,
    createdAt: qr.createdAt ? new Date(qr.createdAt).toISOString() : null,
    updatedAt: qr.updatedAt ? new Date(qr.updatedAt).toISOString() : null,
  };
}

const VISIBILITY = z.enum(['public', 'private', 'unlisted']);

const createSchema = z
  .object({
    type: z.string().min(1).max(50),
    mode: z.enum(['static', 'dynamic']),
    payload: z.string().min(1).max(100000).optional(),
    destinationUrl: z.string().min(1).max(2048).optional(),
    design: z.record(z.unknown()).optional(),
    title: z.string().max(120).optional(),
    tags: z.array(z.string().max(40)).max(10).optional(),
    visibility: VISIBILITY.optional(),
    expiresAt: z.string().datetime({ offset: true }).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.mode === 'static' && !val.payload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payload'],
        message: 'payload is required for static QR codes',
      });
    }
    if (val.mode === 'dynamic' && !val.destinationUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destinationUrl'],
        message: 'destinationUrl is required for dynamic QR codes',
      });
    }
  });

const BASE62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generatePublicId(): string {
  const bytes = randomBytes(10);
  let id = '';
  for (const b of bytes) id += BASE62[b % 62];
  return id;
}

async function generateUniquePublicId(): Promise<string | null> {
  for (let i = 0; i < 5; i++) {
    const publicId = generatePublicId();
    const existing = await QrCode.exists({ publicId });
    if (!existing) return publicId;
  }
  return null;
}

/**
 * Validate a dynamic destination URL.
 * Returns an error message when rejected, null when acceptable.
 * Safe Browsing 'threat' verdicts must be handled by the caller (flag + 400).
 */
async function validateDestinationUrl(
  raw: string
): Promise<{ error: string | null; threat: boolean }> {
  const trimmed = raw.trim();
  if (isBlockedScheme(trimmed)) {
    return { error: 'URL scheme not allowed', threat: false };
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { error: 'destinationUrl must be a valid URL', threat: false };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { error: 'destinationUrl must be an http(s) URL', threat: false };
  }
  if (isPrivateNetworkTarget(trimmed)) {
    return { error: 'destinationUrl must not target a private or loopback address', threat: false };
  }
  if (matchesLocalBlocklist(trimmed)) {
    return { error: 'destinationUrl is on the local abuse blocklist', threat: false };
  }
  const verdict = await checkSafeBrowsing(trimmed);
  if (verdict === 'threat') {
    return { error: 'Destination flagged as unsafe by Google Safe Browsing', threat: true };
  }
  return { error: null, threat: false };
}

function validationError(e: z.ZodError) {
  return NextResponse.json(
    { error: 'Validation failed', details: e.flatten().fieldErrors },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const ownerObjectId = userId ? toOwnerObjectId(userId) : null;
  if (!userId || !ownerObjectId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const rl = await rateLimit(`qrcodes:create:${userId}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const input = parsed.data;

  let destinationUrl: string | undefined;
  let moderationStatus: 'pending' | 'flagged' = 'pending';
  let moderationReason: string | undefined;
  let blocked = false;

  if (input.mode === 'dynamic' && input.destinationUrl) {
    const check = await validateDestinationUrl(input.destinationUrl);
    if (check.error) {
      if (check.threat) {
        // Persist the flagged record for audit, but refuse the redirect.
        moderationStatus = 'flagged';
        moderationReason = 'safe-browsing:threat';
        blocked = true;
      } else {
        return NextResponse.json({ error: check.error }, { status: 400 });
      }
    } else {
      destinationUrl = input.destinationUrl.trim();
    }
  }

  await dbConnect();
  const publicId = await generateUniquePublicId();
  if (!publicId) {
    return NextResponse.json(
      { error: 'Could not generate a unique id, please retry' },
      { status: 500 }
    );
  }

  const qr = await QrCode.create({
    publicId,
    ownerId: ownerObjectId,
    type: input.type,
    mode: input.mode,
    ...(input.payload !== undefined ? { payload: input.payload } : {}),
    ...(destinationUrl !== undefined ? { destinationUrl } : {}),
    ...(input.design !== undefined ? { design: input.design } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.tags !== undefined ? { tags: input.tags } : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.expiresAt !== undefined ? { expiresAt: new Date(input.expiresAt) } : {}),
    status: blocked ? 'blocked' : 'active',
    scanCount: 0,
    moderation: {
      status: moderationStatus,
      checkedAt: new Date(),
      ...(moderationReason ? { reason: moderationReason } : {}),
    },
  });

  if (blocked) {
    return NextResponse.json(
      { error: 'Destination flagged as unsafe by Google Safe Browsing', publicId: qr.publicId },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { publicId: qr.publicId, url: `${siteConfig.url}/r/${qr.publicId}` },
    { status: 201 }
  );
}

const listQuerySchema = z.object({
  q: z.string().max(120).optional(),
  visibility: VISIBILITY.optional(),
  status: z.enum(['active', 'paused', 'blocked']).optional(),
  mode: z.enum(['static', 'dynamic']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  const ownerObjectId = userId ? toOwnerObjectId(userId) : null;
  if (!userId || !ownerObjectId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const rl = await rateLimit(`qrcodes:list:${userId}`, { limit: 120, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const parsed = listQuerySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return validationError(parsed.error);
  const { q, visibility, status, mode, page, limit } = parsed.data;

  const filter: Record<string, unknown> = { ownerId: ownerObjectId };
  if (q) {
    const rx = new RegExp(escapeRegExp(q), 'i');
    filter.$or = [{ title: rx }, { tags: rx }, { type: rx }];
  }
  if (visibility) filter.visibility = visibility;
  if (status) filter.status = status;
  if (mode) filter.mode = mode;

  await dbConnect();
  const total = await QrCode.countDocuments(filter);
  const docs = (await QrCode.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()) as unknown as QrCodeLike[];

  return NextResponse.json({
    items: docs.map(qrToDto),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  });
}
