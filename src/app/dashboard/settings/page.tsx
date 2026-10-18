/**
 * Settings & data: export your QR codes, delete your account.
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserId } from '@/lib/auth';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { DeleteAccountButton } from '@/components/dashboard/DeleteAccountButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Settings — QR Studio',
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const userId = await getUserId();
  if (!userId) redirect('/login');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings &amp; data</h1>

      <Card>
        <CardHeader>
          <CardTitle>Export your data</CardTitle>
          <CardDescription>
            Download a JSON copy of all your QR codes (up to 1,000).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExportButton />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Delete account</CardTitle>
          <CardDescription>
            Permanently removes your account, all QR codes, scan events, saved templates and your
            user record. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
