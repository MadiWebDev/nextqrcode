/**
 * "My QR Codes" — list + stats + filters. Server component; filters arrive
 * via searchParams and are applied to the ownership-scoped Mongoose query.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { EyeIcon, PencilIcon, PlusIcon, QrCodeIcon } from 'lucide-react';
import { getUserId } from '@/lib/auth';
import { getDashboardStats, getQrCodes } from '@/app/dashboard/_lib/queries';
import { QrFilters } from '@/components/dashboard/QrFilters';
import { CopyButton } from '@/components/dashboard/CopyButton';
import { DeleteButton } from '@/components/dashboard/DeleteButton';
import {
  QR_MODES,
  QR_STATUSES,
  QR_VISIBILITIES,
  type DashboardFilters,
  type QrCodeSummary,
} from '@/components/dashboard/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard — QR Studio',
  robots: { index: false, follow: false },
};

interface SearchParams {
  q?: string;
  visibility?: string;
  status?: string;
  mode?: string;
}

function parseFilters(sp: SearchParams): DashboardFilters {
  return {
    q: typeof sp.q === 'string' ? sp.q.slice(0, 100) : '',
    visibility: (QR_VISIBILITIES as readonly string[]).includes(sp.visibility ?? '')
      ? (sp.visibility as DashboardFilters['visibility'])
      : '',
    status: (QR_STATUSES as readonly string[]).includes(sp.status ?? '')
      ? (sp.status as DashboardFilters['status'])
      : '',
    mode: (QR_MODES as readonly string[]).includes(sp.mode ?? '')
      ? (sp.mode as DashboardFilters['mode'])
      : '',
  };
}

function statusVariant(
  status: QrCodeSummary['status']
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'blocked':
      return 'destructive';
    case 'expired':
      return 'outline';
    default:
      return 'secondary';
  }
}

function visibilityVariant(visibility: QrCodeSummary['visibility']) {
  return visibility === 'public' ? 'outline' : 'secondary';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userId = await getUserId();
  // Layout already gates, but double-check for direct renders.
  if (!userId) redirect('/login');
  const filters = parseFilters(await searchParams);
  const [stats, codes] = await Promise.all([
    getDashboardStats(userId),
    getQrCodes(userId, filters),
  ]);

  const filtering =
    filters.q !== '' || filters.visibility !== '' || filters.status !== '' || filters.mode !== '';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">My QR Codes</h1>
        <Button asChild>
          <Link href="/">
            <PlusIcon className="size-4" aria-hidden />
            New QR code
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total codes" value={stats.total} />
        <StatCard label="Total scans" value={stats.totalScans} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Paused" value={stats.paused} />
      </div>

      <Suspense fallback={<div className="h-16 rounded-md bg-muted/50" aria-hidden />}>
        <QrFilters initial={filters} />
      </Suspense>

      {codes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <QrCodeIcon className="size-10 text-muted-foreground" aria-hidden />
            <p className="text-lg font-medium">
              {filtering ? 'No QR codes match your filters' : 'No QR codes yet'}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {filtering
                ? 'Try a different search or clear the filters above.'
                : 'Create your first QR code on the generator — it will show up here once saving is enabled for your account.'}
            </p>
            {!filtering && (
              <Button asChild className="mt-2">
                <Link href="/">
                  <PlusIcon className="size-4" aria-hidden />
                  Create a QR code
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Scans</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.publicId}>
                    <TableCell className="max-w-52">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{code.title || code.type}</span>
                        <CopyButton url={code.shortUrl} label={code.title || code.publicId} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground" title={code.shortUrl}>
                        {code.shortUrl.replace(/^https?:\/\//, '')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {code.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={visibilityVariant(code.visibility)} className="capitalize">
                        {code.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(code.status)} className="capitalize">
                        {code.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {code.scanCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(code.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/q/${encodeURIComponent(code.publicId)}`}
                            aria-label={`View ${code.title || code.publicId}`}
                          >
                            <EyeIcon className="size-4" aria-hidden />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/dashboard/${encodeURIComponent(code.publicId)}`}
                            aria-label={`Edit ${code.title || code.publicId}`}
                          >
                            <PencilIcon className="size-4" aria-hidden />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeleteButton
                          publicId={code.publicId}
                          title={code.title ?? code.publicId}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
