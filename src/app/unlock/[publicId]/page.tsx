import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { dbConnect } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import UnlockForm from './UnlockForm';

export const metadata: Metadata = {
  title: 'Protected QR code',
  description: 'This QR code is password protected. Enter the password to continue.',
  robots: { index: false, follow: false },
};

export default async function UnlockPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;

  await dbConnect();
  const qr = (await QrCode.findOne({ publicId }).select('passwordHash').lean()) as unknown as {
    passwordHash?: string | null;
  } | null;

  if (!qr) notFound();
  if (!qr.passwordHash) {
    // Not actually protected — send the visitor straight to the redirect.
    redirect(`/r/${publicId}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          🔒 Protected QR code
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          This link is password protected. Enter the password to continue.
        </p>
        <UnlockForm publicId={publicId} />
      </div>
    </main>
  );
}
