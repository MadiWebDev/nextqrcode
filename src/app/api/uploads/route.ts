import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserId } from '@/lib/auth';
import { isCloudinaryConfigured, sanitizeSvg, uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'] as const;
type AllowedMime = (typeof ALLOWED_MIME)[number];

const BodySchema = z.object({
  kind: z.enum(['logo', 'preview']),
});

function isAllowedMime(mime: string): mime is AllowedMime {
  return (ALLOWED_MIME as readonly string[]).includes(mime);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Request must be multipart form data.' }, { status: 400 });
  }

  const kindRaw = form.get('kind');
  const parsed = BodySchema.safeParse({ kind: typeof kindRaw === 'string' ? kindRaw : undefined });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request: kind must be "logo" or "preview".' },
      { status: 400 }
    );
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A file is required.' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'File is too large. Maximum size is 2 MB.' },
      { status: 413 }
    );
  }

  if (!isAllowedMime(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Use PNG, JPEG, WebP or SVG.' },
      { status: 415 }
    );
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Upload service is unavailable right now. Try again later.' },
      { status: 503 }
    );
  }

  try {
    let buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === 'image/svg+xml') {
      buffer = Buffer.from(sanitizeSvg(buffer.toString('utf-8')), 'utf-8');
    }

    const result = await uploadToCloudinary(buffer, `nextqrcode/${userId}/logos`, 'image');

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch {
    return NextResponse.json(
      { error: 'Upload failed. Try again with a different file.' },
      { status: 502 }
    );
  }
}
