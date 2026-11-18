import { PLATFORMS } from './platforms';
import { wallTimeToUtc } from './tz';
import {
  nowIso,
  uid,
  type PerformanceEntry,
  type Post,
  type PostStatus,
  POST_STATUSES,
} from './types';

/**
 * CSV import (spec §16): full parser, header detection, column mapping,
 * validation preview (dry run), duplicate detection, and an undoable
 * apply step (the caller deletes exactly the created ids to undo).
 */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      row.push(cur);
      cur = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cur);
      cur = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else cur += ch;
  }
  row.push(cur);
  if (row.length > 1 || row[0] !== '') rows.push(row);
  return rows;
}

export type PostField =
  | 'title'
  | 'caption'
  | 'date'
  | 'time'
  | 'platforms'
  | 'status'
  | 'contentType'
  | 'tags'
  | 'ignore';

const HEADER_SYNONYMS: Record<Exclude<PostField, 'ignore'>, string[]> = {
  title: ['title', 'post title', 'name', 'headline', 'subject'],
  caption: ['caption', 'text', 'body', 'content', 'description', 'copy'],
  date: ['date', 'scheduled date', 'publish date', 'day', 'scheduled'],
  time: ['time', 'scheduled time', 'publish time'],
  platforms: ['platforms', 'platform', 'channels', 'channel', 'network'],
  status: ['status', 'state'],
  contentType: ['contenttype', 'content type', 'type', 'format'],
  tags: ['tags', 'labels'],
};

export function detectMapping(headers: string[]): Record<string, PostField> {
  const mapping: Record<string, PostField> = {};
  for (const header of headers) {
    const norm = header.trim().toLowerCase();
    let field: PostField = 'ignore';
    for (const [candidate, synonyms] of Object.entries(HEADER_SYNONYMS)) {
      if (synonyms.includes(norm)) {
        field = candidate as PostField;
        break;
      }
    }
    mapping[header] = field;
  }
  return mapping;
}

export interface ImportPreview {
  posts: Post[];
  errors: { row: number; message: string }[];
  duplicates: { row: number; title: string }[];
  totalRows: number;
}

const MAX_IMPORT_ROWS = 1000;

export function buildPostsFromRows(
  rows: string[][],
  headers: string[],
  mapping: Record<string, PostField>,
  ctx: {
    workspaceId: string;
    calendarId: string;
    timezone: string;
    existing: Post[];
    defaultPlatformIds: string[];
  },
): ImportPreview {
  const errors: ImportPreview['errors'] = [];
  const duplicates: ImportPreview['duplicates'] = [];
  const posts: Post[] = [];
  const colIndex = new Map<PostField, number>();
  headers.forEach((h, i) => {
    const f = mapping[h];
    if (f && f !== 'ignore' && !colIndex.has(f)) colIndex.set(f, i);
  });
  const get = (row: string[], field: PostField): string => {
    const idx = colIndex.get(field);
    return idx === undefined ? '' : (row[idx] ?? '').trim();
  };
  const existingKeys = new Set(
    ctx.existing.map((p) => `${p.title.toLowerCase()}|${p.scheduledAt ?? ''}`),
  );
  const platformByName = new Map<string, string>();
  for (const p of PLATFORMS) {
    platformByName.set(p.name.toLowerCase(), p.id);
    platformByName.set(p.id, p.id);
  }

  const dataRows = rows.slice(0, MAX_IMPORT_ROWS);
  dataRows.forEach((row, i) => {
    const rowNum = i + 2; // 1-based + header
    const title = get(row, 'title');
    const caption = get(row, 'caption');
    if (!title && !caption) {
      errors.push({ row: rowNum, message: 'Row has neither a title nor a caption — skipped.' });
      return;
    }
    const date = get(row, 'date');
    const time = get(row, 'time') || '09:00';
    let scheduledAt: string | null = null;
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push({ row: rowNum, message: `Date "${date}" is not yyyy-mm-dd — row imported unscheduled.` });
      } else if (!/^\d{1,2}:\d{2}$/.test(time)) {
        errors.push({ row: rowNum, message: `Time "${time}" is not HH:MM — row imported unscheduled.` });
      } else {
        scheduledAt = wallTimeToUtc(ctx.timezone, date, time.padStart(5, '0')).toISOString();
      }
    }
    const platformRaw = get(row, 'platforms');
    const platformIds = platformRaw
      ? platformRaw
          .split(/[;|]/)
          .map((s) => platformByName.get(s.trim().toLowerCase()))
          .filter((x): x is string => Boolean(x))
      : ctx.defaultPlatformIds;
    const statusRaw = get(row, 'status').toLowerCase();
    const status: PostStatus = (POST_STATUSES as string[]).includes(statusRaw)
      ? (statusRaw as PostStatus)
      : scheduledAt
        ? 'scheduled'
        : 'draft';
    const post: Post = {
      id: uid(),
      workspaceId: ctx.workspaceId,
      calendarId: ctx.calendarId,
      title: title || 'Imported post',
      caption,
      description: '',
      platformCaptions: {},
      platformIds: platformIds.length ? platformIds : ctx.defaultPlatformIds,
      scheduledAt,
      timezone: ctx.timezone,
      status,
      contentType: 'text',
      priority: 'normal',
      tags: get(row, 'tags')
        ? get(row, 'tags').split(/[;|]/).map((t) => t.trim()).filter(Boolean)
        : ['imported'],
      assigneeLabel: '',
      internalNotes: 'Imported from CSV.',
      mediaIds: [],
      checklist: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const key = `${post.title.toLowerCase()}|${post.scheduledAt ?? ''}`;
    if (existingKeys.has(key)) {
      duplicates.push({ row: rowNum, title: post.title });
      return;
    }
    existingKeys.add(key);
    posts.push(post);
  });

  return { posts, errors, duplicates, totalRows: dataRows.length };
}

/* ---------------- Performance CSV import ---------------- */

export interface PerformancePreview {
  entries: PerformanceEntry[];
  errors: { row: number; message: string }[];
  totalRows: number;
}

const METRIC_KEYS = [
  'reach',
  'impressions',
  'likes',
  'comments',
  'shares',
  'saves',
  'clicks',
  'followersGained',
  'videoViews',
  'conversions',
] as const;

export function buildPerformanceFromRows(
  rows: string[][],
  headers: string[],
  ctx: { workspaceId: string; posts: Post[] },
): PerformancePreview {
  const errors: PerformancePreview['errors'] = [];
  const entries: PerformanceEntry[] = [];
  const norm = headers.map((h) => h.trim().toLowerCase());
  const col = (names: string[]) => norm.findIndex((h) => names.includes(h));
  const titleCol = col(['title', 'post title', 'post', 'name']);
  const idCol = col(['post id', 'postid', 'id']);
  const platformCol = col(['platform', 'platforms', 'channel']);
  const dateCol = col(['date', 'day']);
  const metricCols = new Map<string, number>();
  for (const key of METRIC_KEYS) {
    const idx = norm.findIndex(
      (h) => h === key.toLowerCase() || h === key.replace(/([A-Z])/g, ' $1').toLowerCase(),
    );
    if (idx >= 0) metricCols.set(key, idx);
  }
  const byTitle = new Map(ctx.posts.map((p) => [p.title.toLowerCase(), p]));
  const byId = new Map(ctx.posts.map((p) => [p.id, p]));
  const platformByName = new Map<string, string>();
  for (const p of PLATFORMS) {
    platformByName.set(p.name.toLowerCase(), p.id);
    platformByName.set(p.id, p.id);
  }

  rows.slice(0, MAX_IMPORT_ROWS).forEach((row, i) => {
    const rowNum = i + 2;
    const post =
      (idCol >= 0 ? byId.get((row[idCol] ?? '').trim()) : undefined) ??
      (titleCol >= 0 ? byTitle.get((row[titleCol] ?? '').trim().toLowerCase()) : undefined);
    if (!post) {
      errors.push({ row: rowNum, message: 'Could not match this row to a post by id or title — skipped.' });
      return;
    }
    const platformId =
      platformCol >= 0
        ? platformByName.get((row[platformCol] ?? '').trim().toLowerCase())
        : post.platformIds[0];
    if (!platformId) {
      errors.push({ row: rowNum, message: 'Unknown platform — skipped.' });
      return;
    }
    const dateRaw = dateCol >= 0 ? (row[dateCol] ?? '').trim() : '';
    const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)
      ? dateRaw
      : post.scheduledAt
        ? post.scheduledAt.slice(0, 10)
        : '';
    if (!date) {
      errors.push({ row: rowNum, message: 'No usable date — skipped.' });
      return;
    }
    const metrics: PerformanceEntry['metrics'] = {};
    for (const [key, idx] of metricCols) {
      const value = Number((row[idx] ?? '').replace(/[^0-9.\-]/g, ''));
      if (Number.isFinite(value) && (row[idx] ?? '').trim() !== '') {
        (metrics as Record<string, number>)[key] = value;
      }
    }
    entries.push({
      id: uid(),
      workspaceId: ctx.workspaceId,
      postId: post.id,
      platformId,
      date,
      metrics,
      createdAt: nowIso(),
    });
  });

  return { entries, errors, totalRows: Math.min(rows.length, MAX_IMPORT_ROWS) };
}
