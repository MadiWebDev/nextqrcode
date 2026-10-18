/**
 * Edit a single QR code (ownership-checked) + scan analytics.
 * Unknown / foreign ids → 404 via notFound().
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { getUserId } from '@/lib/auth';
import { getQrAnalytics, getQrCodeDetail } from '@/app/dashboard/_lib/queries';
import { QrEditForm } from '@/components/dashboard/QrEditForm';
import { DeleteButton } from '@/components/dashboard/DeleteButton';
import { ScanChart } from '@/components/dashboard/ScanChart';
import type { CountItem } from '@/components/dashboard/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

interface RouteParams {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const userId = await getUserId();
  const code = userId ? await getQrCodeDetail(userId, id) : null;
  return {
    title: code ? `Edit ${code.title || code.type} — QR Studio` : 'QR Code — QR Studio',
    robots: { index: false, follow: false },
  };
}

function LabelList({ title, items }: { title: string; items: CountItem[] }) {
  const max = items[0]?.count ?? 1;
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              <span className="w-32 shrink-0 truncate text-muted-foreground" title={item.label}>
                {item.label}
              </span>
              <span
                className="h-2 rounded-full bg-primary/70"
                style={{ width: `${Math.max(4, Math.round((item.count / max) * 100))}%` }}
                aria-hidden
              />
              <span className="tabular-nums">{item.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function QrDetailPage({ params }: { params: Promise<RouteParams> }) {
  const userId = await getUserId();
  if (!userId) redirect('/login');
  const { id } = await params;

  const [code, analytics] = await Promise.all([
    getQrCodeDetail(userId, id),
    getQrAnalytics(userId, id),
  ]);
  if (!code || !analytics) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          Back to My QR Codes
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{code.title || code.type}</h1>
          <Badge
            variant={code.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {code.status}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {code.mode}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Short link: <span className="font-mono">{code.shortUrl.replace(/^https?:\/\//, '')}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Update this QR code&apos;s metadata and behavior.</CardDescription>
        </CardHeader>
        <CardContent>
          <QrEditForm code={code} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            {analytics.totalScans.toLocaleString()} total scans · last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <ScanChart data={analytics.daily} />
          <div className="grid gap-8 md:grid-cols-3">
            <LabelList title="Top countries" items={analytics.countries} />
            <LabelList title="Device types" items={analytics.devices} />
            <LabelList title="Top referrers" items={analytics.referrers} />
          </div>
          <p className="text-xs text-muted-foreground">
            Privacy note: IPs are hashed daily and never stored raw.
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Deleting this QR code stops its short link from working. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <DeleteButton publicId={code.publicId} title={code.title ?? code.publicId} />
          <span className="text-sm text-muted-foreground">Delete this QR code permanently.</span>
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
}
