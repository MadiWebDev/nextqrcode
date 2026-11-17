'use client';

import { useMemo, useRef, useState } from 'react';
import JsPDF from 'jspdf';
import { useStore } from '../_lib/store';
import { summarize, summarizePerformance } from '../_lib/analytics';
import {
  downloadBlob,
  downloadText,
  monthSheetSvg,
  postsToCsv,
  postsToIcs,
  postsToXlsxBlob,
} from '../_lib/exporters';
import {
  buildPerformanceFromRows,
  buildPostsFromRows,
  detectMapping,
  parseCsv,
  type ImportPreview,
  type PerformancePreview,
  type PostField,
} from '../_lib/importer';
import { getPlatform } from '../_lib/platforms';
import { nowIso, uid, type PerformanceEntry, type Post } from '../_lib/types';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';

export default function AnalyticsPanel() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const posts = useMemo(
    () => store.data.posts.filter((p) => p.workspaceId === ws.id),
    [store.data.posts, ws.id],
  );
  const entries = useMemo(
    () => store.data.performance.filter((e) => e.workspaceId === ws.id),
    [store.data.performance, ws.id],
  );
  const pillarName = (id: string) =>
    store.data.pillars.find((p) => p.id === id)?.name ?? 'Unknown pillar';
  const summary = useMemo(
    () => summarize(posts, ws.timezone, pillarName),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pillarName derives from store.data.pillars
    [posts, ws.timezone, store.data.pillars],
  );
  const performance = useMemo(() => summarizePerformance(posts, entries), [posts, entries]);

  return (
    <div className="space-y-8">
      <section aria-labelledby="an-overview">
        <h2 id="an-overview" className="text-lg font-semibold">
          Calendar analytics
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Computed from your real local calendar — this tool has no server analytics and invents
          nothing.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Total posts" value={summary.total} />
          <Stat label="Next 7 days" value={summary.scheduledNext7} />
          <Stat label="Next 30 days" value={summary.scheduledNext30} />
          <Stat label="Published" value={summary.published} />
          <Stat label="In review" value={summary.inReview} />
          <Stat label="Unscheduled" value={summary.unscheduled} />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold">Consistency — last 28 days</h3>
            <p className="mt-1 text-3xl font-bold">{summary.consistencyPct}%</p>
            <p className="text-sm text-muted-foreground">
              of days had at least one post. Longest empty stretch in the next 30 days:{' '}
              {summary.longestUpcomingGap} day{summary.longestUpcomingGap === 1 ? '' : 's'}.
            </p>
            <h3 className="mt-4 text-sm font-semibold">Weekly cadence</h3>
            <Bars
              rows={summary.weeklyCadence.map((w) => ({ key: `Week of ${w.weekStart}`, count: w.count }))}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold">By platform</h3>
            <Bars rows={summary.byPlatform.map((d) => ({ key: getPlatform(d.key)?.name ?? d.key, count: d.count }))} />
            <h3 className="mt-4 text-sm font-semibold">By status</h3>
            <Bars rows={summary.byStatus} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold">By content type</h3>
            <Bars rows={summary.byContentType} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold">By pillar</h3>
            {summary.byPillar.length ? (
              <Bars rows={summary.byPillar} />
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">No posts are tagged with a pillar yet.</p>
            )}
          </div>
        </div>
      </section>

      <PerformanceSection performance={performance} entries={entries} posts={posts} />
      <ExportsSection posts={posts} />
      <ImportSection />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/** Accessible bar list: every bar is also a text row, with a data-table alternative. */
function Bars({ rows }: { rows: { key: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) return <p className="mt-1 text-sm text-muted-foreground">No data yet.</p>;
  return (
    <div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-2 text-sm">
            <span className="w-36 shrink-0 truncate capitalize">{r.key}</span>
            <span className="h-2.5 flex-1 rounded bg-muted">
              <span className="block h-2.5 rounded bg-primary" style={{ width: `${(r.count / max) * 100}%` }} />
            </span>
            <span className="w-8 text-right font-medium">{r.count}</span>
          </li>
        ))}
      </ul>
      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-muted-foreground">View as data table</summary>
        <table className="mt-1 w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-border">
                <td className="py-1 capitalize">{r.key}</td>
                <td className="py-1 text-right">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function PerformanceSection({
  performance,
  entries,
  posts,
}: {
  performance: ReturnType<typeof summarizePerformance>;
  entries: PerformanceEntry[];
  posts: Post[];
}) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [postId, setPostId] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [date, setDate] = useState('');
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [perfPreview, setPerfPreview] = useState<PerformancePreview | null>(null);

  const selectedPost = posts.find((p) => p.id === postId);

  const saveEntry = async () => {
    if (!postId || !platformId) return;
    const parsed: PerformanceEntry['metrics'] = {};
    for (const [k, v] of Object.entries(metrics)) {
      const n = Number(v);
      if (v.trim() !== '' && Number.isFinite(n)) (parsed as Record<string, number>)[k] = n;
    }
    await store.put('performance', {
      id: uid(),
      workspaceId: ws.id,
      postId,
      platformId,
      date: date || new Date().toISOString().slice(0, 10),
      metrics: parsed,
      createdAt: nowIso(),
    } satisfies PerformanceEntry);
    setMetrics({});
  };

  const onPerfFile = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) return;
    setPerfPreview(
      buildPerformanceFromRows(rows.slice(1), rows[0], { workspaceId: ws.id, posts }),
    );
  };

  const applyPerfImport = async () => {
    if (!perfPreview) return;
    for (const e of perfPreview.entries) await store.put('performance', e);
    setPerfPreview(null);
  };

  const exportPerformanceCsv = () => {
    const header = 'postId,title,platform,date,reach,impressions,likes,comments,shares,saves,clicks,followersGained,videoViews,conversions';
    const titleOf = new Map(posts.map((p) => [p.id, p.title]));
    const lines = entries.map((e) =>
      [
        e.postId,
        (titleOf.get(e.postId) ?? '').replace(/,/g, ' '),
        e.platformId,
        e.date,
        e.metrics.reach ?? '',
        e.metrics.impressions ?? '',
        e.metrics.likes ?? '',
        e.metrics.comments ?? '',
        e.metrics.shares ?? '',
        e.metrics.saves ?? '',
        e.metrics.clicks ?? '',
        e.metrics.followersGained ?? '',
        e.metrics.videoViews ?? '',
        e.metrics.conversions ?? '',
      ].join(','),
    );
    downloadText('performance.csv', [header, ...lines].join('\r\n'), 'text/csv');
  };

  return (
    <section aria-labelledby="perf-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="perf-h" className="text-lg font-semibold">
        Performance (entered by you)
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This tool cannot see your social accounts, so results are never invented: type in the
        numbers from your platform analytics, or import them from CSV. Engagement score = likes +
        2×comments + 3×shares + 3×saves + 2×clicks + 10×conversions.
      </p>
      {entries.length > 0 ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Entries" value={performance.entries} />
            <Stat label="Total likes" value={performance.totals.likes} />
            <Stat label="Total reach" value={performance.totals.reach} />
            <Stat label="Total clicks" value={performance.totals.clicks} />
          </div>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Engagement by platform</h3>
              <Bars rows={performance.byPlatform.map((p) => ({ key: getPlatform(p.platformId)?.name ?? p.platformId, count: p.engagement }))} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Top posts</h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
                {performance.topPosts.map((t) => (
                  <li key={t.postId}>
                    {t.title} — <span className="font-medium">{t.engagement}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No performance entries yet — add your first one below.</p>
      )}

      <h3 className="mt-5 text-sm font-semibold">Add an entry</h3>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-medium">
          Post
          <select
            className={`${inputCls} mt-1`}
            value={postId}
            onChange={(e) => {
              setPostId(e.target.value);
              const p = posts.find((x) => x.id === e.target.value);
              if (p?.platformIds[0]) setPlatformId(p.platformIds[0]);
            }}
          >
            <option value="">Choose a post…</option>
            {posts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title || 'Untitled'}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Platform
          <select className={`${inputCls} mt-1`} value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
            <option value="">Choose…</option>
            {(selectedPost?.platformIds ?? ws.platformIds).map((pid) => (
              <option key={pid} value={pid}>
                {getPlatform(pid)?.name ?? pid}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Date
          <input type="date" className={`${inputCls} mt-1`} value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(['reach', 'impressions', 'likes', 'comments', 'shares', 'saves', 'clicks', 'followersGained', 'videoViews', 'conversions'] as const).map(
          (key) => (
            <label key={key} className="text-sm font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
              <input
                type="number"
                min={0}
                className={`${inputCls} mt-1`}
                value={metrics[key] ?? ''}
                onChange={(e) => setMetrics((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </label>
          ),
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={!postId || !platformId} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50" onClick={() => void saveEntry()}>
          Save entry
        </button>
        <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={() => fileRef.current?.click()}>
          Import performance CSV
        </button>
        <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onPerfFile(f); e.target.value = ''; }} />
        {entries.length > 0 && (
          <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={exportPerformanceCsv}>
            Export performance CSV
          </button>
        )}
      </div>
      {perfPreview && (
        <div className="mt-3 rounded-lg bg-muted p-4 text-sm" role="status">
          <p>
            Dry run: {perfPreview.entries.length} entries ready, {perfPreview.errors.length} rows skipped of{' '}
            {perfPreview.totalRows}.
          </p>
          {perfPreview.errors.slice(0, 5).map((e) => (
            <p key={e.row} className="text-muted-foreground">Row {e.row}: {e.message}</p>
          ))}
          <button type="button" className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void applyPerfImport()}>
            Import {perfPreview.entries.length} entries
          </button>
        </div>
      )}
      {entries.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium">All entries ({entries.length})</summary>
          <ul className="mt-2 space-y-1 text-sm">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-2">
                <span>
                  {posts.find((p) => p.id === e.postId)?.title || '(deleted post)'} ·{' '}
                  {getPlatform(e.platformId)?.name ?? e.platformId} · {e.date} ·{' '}
                  {Object.entries(e.metrics).map(([k, v]) => `${k} ${v}`).join(', ')}
                </span>
                <button type="button" className="text-xs text-destructive" onClick={() => void store.remove('performance', e.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function ExportsSection({ posts }: { posts: Post[] }) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const nameOf = {
    campaign: (id: string) => store.data.campaigns.find((c) => c.id === id)?.name ?? id,
    pillar: (id: string) => store.data.pillars.find((p) => p.id === id)?.name ?? id,
  };
  const stamp = new Date().toISOString().slice(0, 10);

  const exportPdf = () => {
    const doc = new JsPDF({ unit: 'pt', format: 'a4' });
    const brand = ws.brand;
    const hex = /^#[0-9a-fA-F]{6}$/.test(brand.primaryColor) ? brand.primaryColor : '#0ea5e9';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, 595, 54, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`${brand.brandName || ws.name} — Content calendar report`, 40, 34);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(10);
    let y = 84;
    doc.text(`Generated ${stamp} · ${posts.length} posts · Times shown in ${ws.timezone}`, 40, y);
    y += 22;
    const sorted = [...posts].sort((a, b2) => (a.scheduledAt ?? '9999') < (b2.scheduledAt ?? '9999') ? -1 : 1);
    for (const p of sorted) {
      if (y > 780) {
        doc.addPage();
        y = 60;
      }
      const when = p.scheduledAt
        ? `${p.scheduledAt.slice(0, 10)} ${p.scheduledAt.slice(11, 16)} UTC`
        : 'Unscheduled';
      doc.setFontSize(11);
      doc.text(`${when} — ${(p.title || 'Untitled').slice(0, 70)}`, 40, y);
      doc.setFontSize(9);
      doc.setTextColor(90, 90, 90);
      doc.text(`${p.status} · ${p.platformIds.map((id) => getPlatform(id)?.name ?? id).join(', ')}`, 40, y + 12);
      doc.setTextColor(20, 20, 20);
      y += 30;
    }
    doc.save(`social-calendar-report-${stamp}.pdf`);
  };

  const exportPng = () => {
    const [y, m] = month.split('-').map(Number);
    const svg = monthSheetSvg(y, m, ws.weekStart, posts, ws.brand, ws.timezone);
    const img = new Image();
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1120;
      canvas.height = 880;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(`calendar-${month}.png`, blob);
        }, 'image/png');
      }
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <section aria-labelledby="exports-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="exports-h" className="text-lg font-semibold">
        Export
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Generated on your device from this workspace&rsquo;s {posts.length} posts. Spreadsheet
        exports neutralize formula injection; the ICS file imports into Google, Apple and Outlook
        calendars.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={() => downloadText(`posts-${stamp}.csv`, postsToCsv(posts, nameOf), 'text/csv')}>
          CSV
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => void postsToXlsxBlob(posts, nameOf).then((blob) => downloadBlob(`posts-${stamp}.xlsx`, blob))}
        >
          XLSX
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => downloadText(`posts-${stamp}.json`, JSON.stringify(posts, null, 2), 'application/json')}
        >
          JSON
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => downloadText(`calendar-${stamp}.ics`, postsToIcs(posts, ws.brand.brandName || ws.name), 'text/calendar')}
        >
          ICS (calendar)
        </button>
        <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={exportPdf}>
          PDF report (A4)
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          Month sheet
          <input type="month" className={`${inputCls} mt-1 w-44`} value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => {
            const [y, m] = month.split('-').map(Number);
            downloadText(`calendar-${month}.svg`, monthSheetSvg(y, m, ws.weekStart, posts, ws.brand, ws.timezone), 'image/svg+xml');
          }}
        >
          SVG month sheet
        </button>
        <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={exportPng}>
          PNG month sheet
        </button>
      </div>
    </section>
  );
}

function ImportSection() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const fileRef = useRef<HTMLInputElement>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, PostField>>({});
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [lastImportIds, setLastImportIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const onFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseCsv(text);
    if (parsed.length < 1) return;
    const [head, ...data] = parsed;
    setHeaders(head);
    setRows(data);
    setMapping(detectMapping(head));
    setPreview(null);
    setMessage(`Loaded ${data.length} rows. Check the column mapping, then run the dry-run preview.`);
  };

  const runPreview = () => {
    setPreview(
      buildPostsFromRows(rows, headers, mapping, {
        workspaceId: ws.id,
        calendarId: store.data.calendars[0]?.id ?? '',
        timezone: ws.timezone,
        existing: store.data.posts.filter((p) => p.workspaceId === ws.id),
        defaultPlatformIds: ws.platformIds,
      }),
    );
  };

  const applyImport = async () => {
    if (!preview) return;
    for (const p of preview.posts) await store.savePost(p, 'CSV import');
    setLastImportIds(preview.posts.map((p) => p.id));
    setMessage(`Imported ${preview.posts.length} posts. You can undo this import below — it deletes exactly those posts.`);
    setPreview(null);
  };

  const undoImport = async () => {
    for (const id of lastImportIds) await store.deletePost(id);
    setMessage(`Undid the import: removed ${lastImportIds.length} posts.`);
    setLastImportIds([]);
  };

  const FIELDS: PostField[] = ['title', 'caption', 'date', 'time', 'platforms', 'status', 'contentType', 'tags', 'ignore'];

  return (
    <section aria-labelledby="import-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="import-h" className="text-lg font-semibold">
        Import posts from CSV
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Up to 1,000 rows. Dates must be yyyy-mm-dd and times HH:MM (24h), read in your workspace
        timezone ({ws.timezone}). Nothing is saved until you review the dry run and confirm.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => fileRef.current?.click()}>
          Choose CSV file
        </button>
        <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ''; }} />
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() =>
            downloadText(
              'posts-import-template.csv',
              'title,caption,date,time,platforms,status,tags\r\nProduct launch,Our new product is live,2026-12-01,10:30,Instagram;LinkedIn,scheduled,launch\r\n',
              'text/csv',
            )
          }
        >
          Download template
        </button>
      </div>
      {message && <p className="mt-2 text-sm" role="status">{message}</p>}
      {headers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Column mapping</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {headers.map((h) => (
              <label key={h} className="text-sm font-medium">
                “{h}” is
                <select
                  className={`${inputCls} mt-1`}
                  value={mapping[h] ?? 'ignore'}
                  onChange={(e) => setMapping((prev) => ({ ...prev, [h]: e.target.value as PostField }))}
                >
                  {FIELDS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button type="button" className="mt-3 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={runPreview}>
            Run dry-run preview
          </button>
        </div>
      )}
      {preview && (
        <div className="mt-4 rounded-lg bg-muted p-4 text-sm" role="status">
          <p>
            Dry run of {preview.totalRows} rows: <strong>{preview.posts.length} ready to import</strong>,{' '}
            {preview.duplicates.length} duplicates skipped, {preview.errors.length} rows with problems.
          </p>
          {preview.duplicates.slice(0, 5).map((d) => (
            <p key={d.row} className="text-muted-foreground">Row {d.row}: duplicate of an existing post (“{d.title}”) — skipped.</p>
          ))}
          {preview.errors.slice(0, 5).map((e) => (
            <p key={e.row} className="text-muted-foreground">Row {e.row}: {e.message}</p>
          ))}
          <div className="mt-3 flex gap-2">
            <button type="button" disabled={preview.posts.length === 0} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50" onClick={() => void applyImport()}>
              Import {preview.posts.length} posts
            </button>
            <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium" onClick={() => setPreview(null)}>
              Discard
            </button>
          </div>
        </div>
      )}
      {lastImportIds.length > 0 && (
        <button type="button" className="mt-3 rounded-md border border-input px-4 py-2 text-sm font-medium text-destructive hover:bg-accent" onClick={() => void undoImport()}>
          Undo last import ({lastImportIds.length} posts)
        </button>
      )}
    </section>
  );
}
