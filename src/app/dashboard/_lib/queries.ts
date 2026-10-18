/**
 * Dashboard data access. Server-only: every function connects via the shared
 * `dbConnect()` and scopes queries to the user's `ownerId`, so users can never
 * read or aggregate another user's codes.
 *
 * NOTE (cross-agent contract): the QrCode model's `ownerId` is an ObjectId
 * (Auth.js user ids are ObjectId hex strings); `qrId` on ScanEvent is the
 * QrCode's ObjectId.
 */

import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { ScanEvent } from '@/models/ScanEvent';
import { siteConfig } from '@/config/site';
import type {
  CountItem,
  DailyScans,
  DashboardFilters,
  DashboardStats,
  QrAnalytics,
  QrCodeDetail,
  QrCodeSummary,
  QrMode,
  QrStatus,
  QrVisibility,
} from '@/components/dashboard/types';

/** Local view of a QrCode lean document (only fields the dashboard reads). */
interface QrCodeLean {
  _id: mongoose.Types.ObjectId;
  publicId: string;
  ownerId?: mongoose.Types.ObjectId;
  title?: string;
  type: string;
  mode: QrMode;
  visibility: QrVisibility;
  status: QrStatus;
  scanCount: number;
  tags: string[];
  destinationUrl?: string;
  expiresAt?: Date;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Auth.js user id → ObjectId used by the QrCode.ownerId field. */
function userObjectId(userId: string): mongoose.Types.ObjectId {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user id');
  }
  return new mongoose.Types.ObjectId(userId);
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function toSummary(doc: QrCodeLean): QrCodeSummary {
  return {
    publicId: doc.publicId,
    title: doc.title ?? null,
    type: doc.type,
    mode: doc.mode,
    visibility: doc.visibility,
    status: doc.status,
    scanCount: doc.scanCount ?? 0,
    updatedAt: toIso(doc.updatedAt) ?? new Date(0).toISOString(),
    shortUrl: `${siteConfig.url}/r/${doc.publicId}`,
  };
}

function toDetail(doc: QrCodeLean): QrCodeDetail {
  return {
    ...toSummary(doc),
    tags: Array.isArray(doc.tags) ? doc.tags.filter((t) => typeof t === 'string') : [],
    destinationUrl: typeof doc.destinationUrl === 'string' ? doc.destinationUrl : null,
    expiresAt: toIso(doc.expiresAt),
    createdAt: toIso(doc.createdAt) ?? new Date(0).toISOString(),
    hasPassword: typeof doc.passwordHash === 'string' && doc.passwordHash.length > 0,
  };
}

interface StatsRow {
  total: { n: number }[];
  scans: { n: number }[];
  active: { n: number }[];
  paused: { n: number }[];
}

/** Header stat cards for the dashboard. */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  await dbConnect();
  const oid = userObjectId(userId);
  const rows = (await QrCode.aggregate([
    { $match: { ownerId: oid } },
    {
      $facet: {
        total: [{ $count: 'n' }],
        scans: [{ $group: { _id: null, n: { $sum: '$scanCount' } } }],
        active: [{ $match: { status: 'active' } }, { $count: 'n' }],
        paused: [{ $match: { status: 'paused' } }, { $count: 'n' }],
      },
    },
  ])) as StatsRow[];
  const row = rows[0];
  return {
    total: row?.total[0]?.n ?? 0,
    totalScans: row?.scans[0]?.n ?? 0,
    active: row?.active[0]?.n ?? 0,
    paused: row?.paused[0]?.n ?? 0,
  };
}

/** Filtered list of the user's codes (ownership-scoped). */
export async function getQrCodes(
  userId: string,
  filters: DashboardFilters
): Promise<QrCodeSummary[]> {
  await dbConnect();
  const oid = userObjectId(userId);
  const query: Record<string, unknown> = { ownerId: oid };
  if (filters.q) {
    const rx = { $regex: filters.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    query.$or = [{ title: rx }, { publicId: rx }, { type: rx }];
  }
  if (filters.visibility) query.visibility = filters.visibility;
  if (filters.status) query.status = filters.status;
  if (filters.mode) query.mode = filters.mode;

  const docs = (await QrCode.find(query)
    .sort({ updatedAt: -1 })
    .limit(500)
    .lean()
    .exec()) as unknown as QrCodeLean[];
  return docs.map(toSummary);
}

/** Single code detail, or null when it doesn't exist / isn't the user's. */
export async function getQrCodeDetail(
  userId: string,
  publicId: string
): Promise<QrCodeDetail | null> {
  await dbConnect();
  const doc = (await QrCode.findOne({ publicId, ownerId: userObjectId(userId) })
    .lean()
    .exec()) as unknown as QrCodeLean | null;
  return doc ? toDetail(doc) : null;
}

interface DayBucket {
  _id: string;
  count: number;
}

interface LabelBucket {
  _id: string | null;
  count: number;
}

/** Last 30 days (UTC buckets) of scan counts for one code. */
async function getDailySeries(qrId: mongoose.Types.ObjectId): Promise<DailyScans[]> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - 29);

  const buckets = (await ScanEvent.aggregate([
    { $match: { qrId, ts: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$ts' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])) as DayBucket[];

  const byDay = new Map(buckets.map((b) => [b._id, b.count]));
  const days: DailyScans[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, scans: byDay.get(key) ?? 0 });
  }
  return days;
}

async function topLabels(
  qrId: mongoose.Types.ObjectId,
  field: string,
  limit: number
): Promise<CountItem[]> {
  const buckets = (await ScanEvent.aggregate([
    { $match: { qrId } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ])) as LabelBucket[];
  return buckets.filter((b) => b._id).map((b) => ({ label: String(b._id), count: b.count }));
}

/** Scan analytics for one code (ownership-checked). */
export async function getQrAnalytics(
  userId: string,
  publicId: string
): Promise<QrAnalytics | null> {
  await dbConnect();
  const doc = (await QrCode.findOne(
    { publicId, ownerId: userObjectId(userId) },
    { _id: 1, scanCount: 1 }
  )
    .lean()
    .exec()) as unknown as { _id: mongoose.Types.ObjectId; scanCount?: number } | null;
  if (!doc) return null;

  const [daily, countries, devices, referrers] = await Promise.all([
    getDailySeries(doc._id),
    topLabels(doc._id, 'country', 10),
    topLabels(doc._id, 'deviceType', 8),
    topLabels(doc._id, 'referrerHost', 10),
  ]);
  return {
    totalScans: typeof doc.scanCount === 'number' ? doc.scanCount : 0,
    daily,
    countries,
    devices,
    referrers,
  };
}

/** Delete every scan event, code, template row and the user document itself. */
export async function deleteUserData(userId: string): Promise<void> {
  await dbConnect();
  const oid = userObjectId(userId);
  const codes = (await QrCode.find({ ownerId: oid }, { _id: 1 }).lean().exec()) as unknown as {
    _id: mongoose.Types.ObjectId;
  }[];

  await ScanEvent.deleteMany({ qrId: { $in: codes.map((c) => c._id) } });
  await QrCode.deleteMany({ ownerId: oid });

  const db = mongoose.connection.db;
  if (db) {
    // Templates live in the data-layer agent's scope; delete by convention
    // (no-op when the collection doesn't exist yet).
    await db.collection('templates').deleteMany({ ownerId: oid });
    // Auth.js MongoDBAdapter stores users in the `users` collection.
    await db.collection('users').deleteOne({ _id: oid });
  }
}
