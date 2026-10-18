import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { dbConnect, isDbConfigured } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { getUserId } from '@/lib/auth';
import { siteConfig } from '@/config/site';
import { getQrTypeMeta } from '@/lib/qr/type-meta';
import { qrPageEligibility } from '@/lib/ads/eligibility';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';
import { QrPageClient } from './QrPageClient';

export const dynamic = 'force-dynamic';

interface QrDoc {
  _id: mongoose.Types.ObjectId;
  publicId: string;
  ownerId: mongoose.Types.ObjectId;
  type: string;
  mode: 'static' | 'dynamic';
  payload?: string;
  destinationUrl?: string;
  design?: Record<string, unknown>;
  title?: string;
  visibility: string;
  status: string;
  scanCount: number;
  moderation: { status: string };
  createdAt: Date;
}

async function loadQr(publicId: string): Promise<QrDoc | null> {
  if (!isDbConfigured()) return null;
  await dbConnect();
  const doc = (await QrCode.findOne({ publicId }).lean()) as unknown as QrDoc | null;
  return doc;
}

/** The text encoded in the QR image. */
export function qrEncodedText(qr: QrDoc): string {
  if (qr.mode === 'dynamic') return `${siteConfig.url}/r/${qr.publicId}`;
  return qr.payload ?? '';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const qr = await loadQr(publicId);
  const canonical = `${siteConfig.url}/q/${publicId}`;
  if (!qr) return { title: 'QR code not found', robots: { index: false, follow: false } };

  const meta = getQrTypeMeta(qr.type);
  const { indexable } = qrPageEligibility({
    visibility: qr.visibility,
    moderationStatus: qr.moderation.status,
    title: qr.title,
  });
  const title = qr.title?.trim() || `${meta.label} QR Code`;
  return {
    title: `${title} — QR Studio`,
    description: `Scan this ${meta.label} QR code${qr.title ? ` — ${qr.title}` : ''}. Free ${meta.label} QR code created with QR Studio.`,
    alternates: { canonical },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${title} — QR Studio`,
      description: `Scan this ${meta.label} QR code.`,
      url: canonical,
      images: [
        { url: `${siteConfig.url}/q/${publicId}/opengraph-image`, width: 1200, height: 630 },
      ],
    },
  };
}

function StatusNotice({ status }: { status: string }) {
  const copy: Record<string, { heading: string; body: string }> = {
    paused: {
      heading: 'This QR code is paused',
      body: 'The owner has temporarily paused this QR code. Its link does not work right now.',
    },
    blocked: {
      heading: 'This QR code was removed',
      body: 'This QR code was removed for violating our acceptable-use policy.',
    },
    expired: {
      heading: 'This QR code has expired',
      body: 'The owner set an expiry date on this QR code and it has now passed.',
    },
  };
  const c = copy[status] ?? {
    heading: 'This QR code is unavailable',
    body: 'This QR code is not available right now.',
  };
  return (
    <div className="page-wrap">
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="page-h1">{c.heading}</h1>
        <p className="page-prose">{c.body}</p>
        <Link href="/" className="text-primary hover:underline">
          Create your own QR code instead
        </Link>
      </div>
    </div>
  );
}

export default async function QrPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const qr = await loadQr(publicId);
  if (!qr) notFound();

  // Deleted codes are hard-deleted by the API, so a missing document covers both
  // "never existed" and "deleted" — both render the helpful 404 page (D4.1).
  if (qr.status !== 'active') return <StatusNotice status={qr.status} />;

  const meta = getQrTypeMeta(qr.type);
  const encoded = qrEncodedText(qr);
  const userId = await getUserId();
  const isOwner = userId !== null && qr.ownerId.toString() === userId;
  const { indexable } = qrPageEligibility({
    visibility: qr.visibility,
    moderationStatus: qr.moderation.status,
    title: qr.title,
  });
  const title = qr.title?.trim() || `${meta.label} QR Code`;
  const pageUrl = `${siteConfig.url}/q/${publicId}`;

  return (
    <div className="page-wrap">
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[
          { name: 'Home', url: '/' },
          { name: `${meta.label} QR Codes`, url: meta.generatorHref },
          { name: title, url: `/q/${publicId}` },
        ]}
      />
      {indexable && (
        <WebPageJsonLd
          name={title}
          url={pageUrl}
          description={`Scan this ${meta.label} QR code created with QR Studio.`}
        />
      )}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Home
          </Link>{' '}
          /{' '}
          <Link href={meta.generatorHref} className="hover:underline">
            {meta.label} QR Codes
          </Link>{' '}
          / <span aria-current="page">{title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <QrPageClient
            publicId={publicId}
            encodedText={encoded}
            design={qr.design}
            title={title}
            pageUrl={pageUrl}
          />

          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {meta.label} QR Code
              </p>
              <h1 className="page-h1 mt-1">{title}</h1>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{qr.mode === 'dynamic' ? 'Dynamic' : 'Static'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Scans</dt>
                  <dd className="font-medium">{qr.scanCount.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="font-medium">
                    {new Date(qr.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Visibility</dt>
                  <dd className="font-medium capitalize">{qr.visibility}</dd>
                </div>
              </dl>
            </div>

            <section aria-labelledby="about-type">
              <h2 id="about-type" className="text-lg font-semibold">
                About {meta.label} QR codes
              </h2>
              <p className="page-prose mt-2">{meta.blurb}</p>
              <Link
                href={meta.generatorHref}
                className="mt-3 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Create your own like this
              </Link>
            </section>

            {isOwner && (
              <section
                aria-labelledby="owner-tools"
                className="rounded-xl border border-border p-4"
              >
                <h2 id="owner-tools" className="text-sm font-semibold">
                  Owner tools
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  You own this QR code. Changes apply instantly
                  {qr.mode === 'dynamic' ? ' — the printed code keeps working.' : '.'}
                </p>
                <div className="mt-3 flex gap-3 text-sm">
                  <Link href={`/dashboard/${publicId}`} className="text-primary hover:underline">
                    Edit & view analytics
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
