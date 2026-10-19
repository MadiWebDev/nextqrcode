/**
 * DELETE /api/account — permanently delete the caller's account and all of
 * their data (QR codes, scan events, templates, user record).
 *
 * Auth.js issues JWT sessions, which cannot be revoked server-side, so after
 * a successful DELETE the client calls signOut() to clear the session cookie.
 */

import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { deleteUserData } from '@/app/dashboard/_lib/queries';

export const dynamic = 'force-dynamic';

export async function DELETE() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await deleteUserData(userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Account deletion failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
