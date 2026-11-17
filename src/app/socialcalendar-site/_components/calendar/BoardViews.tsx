'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { monthGrid, parseDateStr } from '../../_lib/dates';
import { groupByDate, type PlacedPost } from '../../_lib/placed';
import { getPlatform } from '../../_lib/platforms';
import { useStore } from '../../_lib/store';
import { PIPELINE_STATUSES, type Post, type PostStatus } from '../../_lib/types';
import type { ViewProps } from './TimeViews';

function KanbanCard({
  post,
  onOpenPost,
}: {
  post: Post;
  onOpenPost: (post: Post) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `kanban:${post.id}`,
    data: { post },
  });
  const platform = getPlatform(post.platformIds[0]);
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={() => onOpenPost(post)}
      className={`block w-full touch-none rounded-md border border-border bg-card p-2 text-left text-sm shadow-sm hover:bg-muted ${isDragging ? 'opacity-40' : ''}`}
      style={{ transform: CSS.Translate.toString(transform) }}
      aria-label={`${post.title || 'Untitled post'}, priority ${post.priority}. Open to edit, or drag to another column.`}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: platform?.color ?? '#64748b' }}
        />
        <span className="flex-1 truncate font-medium">{post.title || 'Untitled'}</span>
      </span>
      <span className="mt-1 block truncate text-xs text-muted-foreground">
        {post.caption.slice(0, 70)}
      </span>
      <span className="mt-1 flex gap-1 text-[11px] text-muted-foreground">
        <span className="rounded bg-muted px-1.5 py-0.5">{post.contentType}</span>
        <span className="rounded bg-muted px-1.5 py-0.5">{post.priority}</span>
        {post.scheduledAt && (
          <span className="rounded bg-muted px-1.5 py-0.5">
            {new Date(post.scheduledAt).toLocaleDateString()}
          </span>
        )}
      </span>
    </button>
  );
}

function KanbanColumn({
  status,
  posts,
  onOpenPost,
}: {
  status: PostStatus;
  posts: Post[];
  onOpenPost: (post: Post) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `status:${status}` });
  return (
    <section
      ref={setNodeRef}
      aria-label={`${status} column, ${posts.length} posts`}
      className={`flex min-h-40 w-64 shrink-0 flex-col rounded-lg border border-border bg-muted/20 p-2 ${isOver ? 'ring-1 ring-primary' : ''}`}
    >
      <h3 className="mb-2 flex items-center justify-between px-1 text-sm font-semibold capitalize">
        {status.replace('-', ' ')}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{posts.length}</span>
      </h3>
      <div className="flex-1 space-y-2">
        {posts.map((p) => (
          <KanbanCard key={p.id} post={p} onOpenPost={onOpenPost} />
        ))}
        {posts.length === 0 && (
          <p className="px-1 text-xs text-muted-foreground">Drop posts here</p>
        )}
      </div>
    </section>
  );
}

export function KanbanView({
  posts,
  onOpenPost,
}: {
  posts: Post[];
  onOpenPost: (post: Post) => void;
}) {
  const { activeWorkspace } = useStore();
  const pipeline = activeWorkspace?.pipeline?.length
    ? activeWorkspace.pipeline
    : PIPELINE_STATUSES;
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {pipeline.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          posts={posts.filter((p) => p.status === status)}
          onOpenPost={onOpenPost}
        />
      ))}
    </div>
  );
}

export function FeedPreview({
  placed,
  onOpen,
}: {
  placed: PlacedPost[];
  onOpen: (placed: PlacedPost) => void;
}) {
  const { data } = useStore();
  const upcoming = placed.slice(0, 12);
  const mediaById = new Map(data.media.map((m) => [m.id, m]));
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">Feed preview</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Your next {upcoming.length} planned posts in posting order — a planning preview
        of visual rhythm, not a connection to any platform.
      </p>
      {upcoming.length === 0 ? (
        <p className="rounded-lg border border-border p-6 text-center text-muted-foreground">
          No upcoming posts to preview yet.
        </p>
      ) : (
        <div className="grid max-w-xl grid-cols-3 gap-1">
          {upcoming.map((p) => {
            const media = p.post.mediaIds.map((id) => mediaById.get(id)).find(Boolean);
            const thumb = media?.thumbnailBlob ?? media?.blob;
            const thumbUrl =
              thumb && typeof URL !== 'undefined' ? URL.createObjectURL(thumb) : null;
            return (
              <button
                key={`${p.post.id}:${p.scheduledAt}`}
                type="button"
                onClick={() => onOpen(p)}
                className="relative aspect-square overflow-hidden rounded bg-muted text-left"
                aria-label={`${p.post.title || 'Untitled'}, ${p.localDate}`}
              >
                {thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                  <img src={thumbUrl} alt={media?.altText ?? ''} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center p-2 text-center text-[11px] text-muted-foreground">
                    {p.post.contentType}
                    <br />
                    {p.post.title || p.post.caption.slice(0, 30)}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/55 px-1 py-0.5 text-[10px] text-white">
                  {p.localDate} · {p.post.contentType}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PlanningBoard({ placed, onOpen }: ViewProps) {
  const { data } = useStore();
  const campaignName = new Map(data.campaigns.map((c) => [c.id, c.name]));
  const groups = new Map<string, PlacedPost[]>();
  for (const p of placed) {
    const key = p.post.campaignId ? (campaignName.get(p.post.campaignId) ?? 'Campaign') : 'No campaign';
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  if (placed.length === 0) {
    return (
      <p className="rounded-lg border border-border p-6 text-center text-muted-foreground">
        Nothing planned in this range yet.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {[...groups.entries()].map(([name, posts]) => (
        <section key={name} aria-label={`Campaign group ${name}`}>
          <h3 className="mb-1 font-semibold">{name}</h3>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {posts.map((p) => (
              <li key={`${p.post.id}:${p.scheduledAt}`}>
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="w-24 shrink-0">{p.localDate}</span>
                  <span className="flex-1 truncate">{p.post.title || 'Untitled'}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">{p.post.status}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function CampaignCalendar({ placed, cursor, workspace, onOpen }: ViewProps) {
  const { data } = useStore();
  const { y, m } = parseDateStr(cursor);
  const cells = monthGrid(y, m, workspace.weekStart);
  const campaignPosts = placed.filter((p) => p.post.campaignId);
  const byDate = groupByDate(campaignPosts);
  const colorOf = new Map(data.campaigns.map((c) => [c.id, c.color]));
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">Campaign calendar</h2>
      {data.campaigns.length === 0 ? (
        <p className="rounded-lg border border-border p-6 text-center text-muted-foreground">
          No campaigns yet — create one in the Campaigns tab and assign posts to it.
        </p>
      ) : (
        <>
          <ul className="mb-3 flex flex-wrap gap-2 text-xs">
            {data.campaigns.map((c) => (
              <li key={c.id} className="flex items-center gap-1 rounded bg-muted px-2 py-1">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name} ({c.startDate} → {c.endDate})
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {cells.map((date) => (
              <div key={date} className="min-h-16 bg-background p-1">
                <span className="text-xs text-muted-foreground">{parseDateStr(date).d}</span>
                {(byDate.get(date) ?? []).map((p) => (
                  <button
                    key={`${p.post.id}:${p.scheduledAt}`}
                    type="button"
                    onClick={() => onOpen(p)}
                    className="mt-0.5 block w-full truncate rounded px-1 py-0.5 text-left text-[11px] text-white"
                    style={{ backgroundColor: colorOf.get(p.post.campaignId!) ?? '#64748b' }}
                  >
                    {p.post.title || 'Untitled'}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function EditorialOverview({ placed }: ViewProps) {
  const { data } = useStore();
  const total = placed.length || 1;
  const pillarName = new Map(data.pillars.map((p) => [p.id, p.name]));
  const byPillar = new Map<string, number>();
  const byStatus = new Map<string, number>();
  for (const p of placed) {
    byPillar.set(p.post.pillarId ? (pillarName.get(p.post.pillarId) ?? 'Unknown') : 'No pillar', (byPillar.get(p.post.pillarId ? (pillarName.get(p.post.pillarId) ?? 'Unknown') : 'No pillar') ?? 0) + 1);
    byStatus.set(p.post.status, (byStatus.get(p.post.status) ?? 0) + 1);
  }
  const Row = ({ label, n }: { label: string; n: number }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-36 shrink-0 truncate">{label}</span>
      <span className="h-3 flex-1 overflow-hidden rounded bg-muted">
        <span className="block h-full bg-primary" style={{ width: `${Math.round((n / total) * 100)}%` }} />
      </span>
      <span className="w-14 text-right text-muted-foreground">
        {n} · {Math.round((n / total) * 100)}%
      </span>
    </div>
  );
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section aria-label="Posts by content pillar" className="rounded-lg border border-border p-4">
        <h3 className="mb-3 font-semibold">By content pillar</h3>
        <div className="space-y-2">
          {[...byPillar.entries()].map(([label, n]) => (
            <Row key={label} label={label} n={n} />
          ))}
          {byPillar.size === 0 && <p className="text-sm text-muted-foreground">No posts in range.</p>}
        </div>
      </section>
      <section aria-label="Posts by status" className="rounded-lg border border-border p-4">
        <h3 className="mb-3 font-semibold">By status</h3>
        <div className="space-y-2">
          {[...byStatus.entries()].map(([label, n]) => (
            <Row key={label} label={label} n={n} />
          ))}
          {byStatus.size === 0 && <p className="text-sm text-muted-foreground">No posts in range.</p>}
        </div>
      </section>
    </div>
  );
}
