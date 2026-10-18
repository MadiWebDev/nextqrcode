/**
 * Dashboard shell: auth-gated sidebar + page container.
 * The whole /dashboard tree is noindex (metadata here + on each page).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserId } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getUserId();
  if (!userId) redirect('/login');

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
        <aside className="shrink-0 sm:w-52">
          <Link
            href="/dashboard"
            className="mb-4 hidden text-lg font-semibold tracking-tight sm:block"
          >
            QR Studio
          </Link>
          <DashboardNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
