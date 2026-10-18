import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserId } from '@/lib/auth';
import { signUploadParams } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  kind: z.enum(['logo', 'preview']),
});

// Simple in-memory per-user rate limit: 60 signing requests per minute.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
const hitsByUser = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const hits = (hitsByUser.get(userId) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    return true;
  }
  hits.push(now);
  hitsByUser.set(userId, hits);
  return false;
}

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  if (isRateLimited(userId)) {
    return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 });
  }

  const parsed = QuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request: kind must be "logo" or "preview".' },
      { status: 400 }
    );
  }

  const folder = `nextqrcode/${userId}/${parsed.data.kind === 'logo' ? 'logos' : 'previews'}`;

  try {
    return NextResponse.json(signUploadParams(folder));
  } catch {
    return NextResponse.json(
      { error: 'Upload signing is unavailable right now. Try again later.' },
      { status: 503 }
    );
  }
}
