import type { NextRequest } from 'next/server';
import { handlers, isAuthConfigured } from '@/lib/auth';

export const runtime = 'nodejs';

const { GET: authGet, POST: authPost } = handlers;

/**
 * Auth.js route handlers with a graceful 503 when auth is not configured
 * (missing MongoDB, providers, or AUTH_SECRET). This keeps `next build` and
 * production deploys from crashing — guests can still generate QR codes.
 */
async function notConfigured() {
  return Response.json({ error: 'Authentication is not configured' }, { status: 503 });
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!isAuthConfigured()) return notConfigured();
  return authGet(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!isAuthConfigured()) return notConfigured();
  return authPost(req);
}
