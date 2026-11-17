'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { addDays, monthGrid, parseDateStr, shiftMonth, weekDates } from '../../_lib/dates';
import { placePosts, type PlacedPost } from '../../_lib/placed';
import { getPlatform } from '../../_lib/platforms';
import { useStore } from '../../_lib/store';
import { todayInZone, wallTimeToUtc } from '../../_lib/tz';
import { nowIso, type Post, type PostStatus } from '../../_lib/types';
import {
  AgendaView,
  DayView,
  MonthView,
  TimelineView,
  WeekView,
  type ViewProps,
} from './TimeViews';
import {
  CampaignCalendar,
  EditorialOverview,
  FeedPreview,
  KanbanView,
  PlanningBoard,
} from './BoardViews';
import type { EditorSeed } from './PostEditor';

export type CalendarView =
  | 'month'
  | 'week'
  | 'day'
  | 'agenda'
  | 'timeline'
  | 'kanban'
  | 'feed'
  | 'planning'
  | 'campaigns'
  | 'editorial';

export const VIEW_LABELS: Record<CalendarView, string> = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  timeline: 'Timeline',
  kanban: 'Kanban',
  feed: 'Feed preview',
  planning: 'Planning board',
  campaigns: 'Campaigns',
  editorial: 'Editorial',
};

function rangeFor(
  view: CalendarView,
  cursor: string,
  weekStart: number,
  today: string,
): { from: string; to: string } {
  switch (view) {
    case 'month':
    case 'campaigns':
    case 'editorial': {
      const { y, m } = parseDateStr(cursor);
      const cells = monthGrid(y, m, weekStart);
      return { from: cells[0], to: cells[41] };
    }
    case 'week':
    case 'timeline': {
      const days = weekDates(cursor, weekStart);
      return { from: days[0], to: days[6] };
    }
    case 'day':
      return { from: cursor, to: cursor };
    case 'agenda':
      return { from: cursor, to: addDays(cursor, 30) };
    case 'planning':
      return { from: addDays(cursor, -15), to: addDays(cursor, 45) };
    case 'feed':
      return { from: today, to: addDays(today, 60) };
    case 'kanban':
      return { from: today, to: today };
  }
}

function UnscheduledChip({ post, onOpen }: { post: Post; onOpen: (post: Post) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `post:${post.id}:unscheduled`,
    data: { post },
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={() => onOpen(post)}
      className={`touch-none rounded-full border border-border bg-card px-3 py-1 text-xs shadow-sm ${isDragging ? 'opacity-40' : ''}`}
      style={{ transform: CSS.Translate.toString(transform) }}
      aria-label={`Unscheduled post: ${post.title || 'Untitled'}. Drag onto a day to schedule, or activate to edit.`}
    >
      {post.title || 'Untitled'} · {post.status}
    </button>
  );
}

export function CalendarApp({
  view,
  setView,
  openEditor,
}: {
  view: CalendarView;
  setView: (v: CalendarView) => void;
  openEditor: (seed: EditorSeed) => void;
}) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const today = todayInZone(ws.timezone);
  const [cursor, setCursor] = useState<string>(today);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const setEditorSeed = openEditor;
  const [platformFilter, setPlatformFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const filteredPosts = useMemo(
    () =>
      store.data.posts.filter(
        (p) =>
          (platformFilter.length === 0 ||
            p.platformIds.some((id) => platformFilter.includes(id))) &&
          (statusFilter.length === 0 || statusFilter.includes(p.status)),
      ),
    [store.data.posts, platformFilter, statusFilter],
  );

  const range = rangeFor(view, cursor, ws.weekStart, today);
  const placed = useMemo(
    () => placePosts(filteredPosts, ws.timezone, range.from, range.to),
    [filteredPosts, ws.timezone, range.from, range.to],
  );
  const unscheduled = useMemo(
    () => filteredPosts.filter((p) => !p.scheduledAt),
    [filteredPosts],
  );

  const openPlaced = (p: PlacedPost) => setEditorSeed({ post: p.post });
  const openPost = (post: Post) => setEditorSeed({ post });
  const quickCreate = (date: string, hour?: number) => setEditorSeed({ date, hour });

  const viewProps: ViewProps = {
    placed,
    cursor,
    workspace: ws,
    density,
    onOpen: openPlaced,
    onQuickCreate: quickCreate,
  };

  const navigate = (dir: 1 | -1) => {
    if (view === 'month' || view === 'campaigns' || view === 'editorial') {
      const { y, m } = parseDateStr(cursor);
      const next = shiftMonth(y, m, dir);
      setCursor(`${next.y}-${String(next.m).padStart(2, '0')}-01`);
    } else if (view === 'week' || view === 'timeline') {
      setCursor(addDays(cursor, 7 * dir));
    } else if (view === 'agenda' || view === 'planning') {
      setCursor(addDays(cursor, 30 * dir));
    } else {
      setCursor(addDays(cursor, dir));
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overId = String(over.id);
    const activeId = String(active.id);
    const postId = activeId.split(':')[1];
    const post = store.data.posts.find((p) => p.id === postId);
    if (!post) return;

    if (overId.startsWith('status:')) {
      const status = overId.slice('status:'.length) as PostStatus;
      if (post.status !== status) {
        await store.savePost({ ...post, status, updatedAt: nowIso() }, `Move to ${status}`);
        await store.logActivity('post', post.id, 'status', `Status → ${status}`);
      }
      return;
    }
    if (overId.startsWith('date:')) {
      const [, date, hourStr] = overId.split(':');
      const currentLocal = post.scheduledAt
        ? new Intl.DateTimeFormat('en-GB', {
            timeZone: ws.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
          }).format(new Date(post.scheduledAt))
        : '09:00';
      const [h, mi] = hourStr
        ? [hourStr.padStart(2, '0'), '00']
        : currentLocal.split(':');
      const instant = wallTimeToUtc(ws.timezone, date, `${h}:${mi}`).toISOString();
      if (instant !== post.scheduledAt) {
        await store.savePost(
          {
            ...post,
            scheduledAt: instant,
            status: post.status === 'idea' || post.status === 'draft' ? 'scheduled' : post.status,
            updatedAt: nowIso(),
          },
          'Reschedule',
        );
        await store.logActivity('post', post.id, 'reschedule', `Moved to ${date} ${h}:${mi}`);
      }
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Calendar views">
          {(Object.keys(VIEW_LABELS) as CalendarView[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-md px-2.5 py-1.5 text-sm ${
                view === v ? 'bg-primary text-primary-foreground' : 'border border-border'
              }`}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <button type="button" className="rounded-md border border-border px-2.5 py-1.5 text-sm" onClick={() => navigate(-1)} aria-label="Previous period">
            ←
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-2.5 py-1.5 text-sm"
            onClick={() => setCursor(today)}
          >
            Today
          </button>
          <button type="button" className="rounded-md border border-border px-2.5 py-1.5 text-sm" onClick={() => navigate(1)} aria-label="Next period">
            →
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-2.5 py-1.5 text-sm"
            aria-pressed={density === 'compact'}
            onClick={() => setDensity((d) => (d === 'compact' ? 'comfortable' : 'compact'))}
          >
            {density === 'compact' ? 'Compact' : 'Comfortable'}
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-2.5 py-1.5 text-sm disabled:opacity-40"
            disabled={!store.canUndo}
            onClick={() => void store.undo()}
          >
            Undo
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-2.5 py-1.5 text-sm disabled:opacity-40"
            disabled={!store.canRedo}
            onClick={() => void store.redo()}
          >
            Redo
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground"
            onClick={() => openEditor({ date: cursor })}
          >
            + New post
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1 text-xs" aria-label="Quick filters">
        <span className="font-medium">Platforms:</span>
        {ws.platformIds.map((pid) => {
          const on = platformFilter.includes(pid);
          return (
            <button
              key={pid}
              type="button"
              aria-pressed={on}
              onClick={() =>
                setPlatformFilter((f) => (on ? f.filter((x) => x !== pid) : [...f, pid]))
              }
              className={`rounded-full border px-2 py-0.5 ${on ? 'border-primary bg-primary/10 font-medium' : 'border-border text-muted-foreground'}`}
            >
              {getPlatform(pid)?.name ?? pid}
            </button>
          );
        })}
        {(platformFilter.length > 0 || statusFilter.length > 0) && (
          <button
            type="button"
            className="underline"
            onClick={() => {
              setPlatformFilter([]);
              setStatusFilter([]);
            }}
          >
            Clear filters
          </button>
        )}
        <span className="ml-2 text-muted-foreground">
          Showing {placed.length} scheduled post{placed.length === 1 ? '' : 's'} · {ws.timezone}
        </span>
      </div>

      <DndContext sensors={sensors} onDragEnd={(e) => void onDragEnd(e)}>
        {view === 'month' && <MonthView {...viewProps} />}
        {view === 'week' && <WeekView {...viewProps} />}
        {view === 'day' && <DayView {...viewProps} />}
        {view === 'agenda' && <AgendaView {...viewProps} />}
        {view === 'timeline' && <TimelineView {...viewProps} />}
        {view === 'kanban' && <KanbanView posts={filteredPosts} onOpenPost={openPost} />}
        {view === 'feed' && <FeedPreview placed={placed} onOpen={openPlaced} />}
        {view === 'planning' && <PlanningBoard {...viewProps} />}
        {view === 'campaigns' && <CampaignCalendar {...viewProps} />}
        {view === 'editorial' && <EditorialOverview {...viewProps} />}

        {unscheduled.length > 0 && view !== 'kanban' && (
          <section aria-label="Unscheduled posts" className="mt-4 rounded-lg border border-dashed border-border p-3">
            <h3 className="mb-2 text-sm font-semibold">
              Unscheduled ({unscheduled.length}) — drag onto a day to schedule
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {unscheduled.map((p) => (
                <UnscheduledChip key={p.id} post={p} onOpen={openPost} />
              ))}
            </div>
          </section>
        )}
      </DndContext>
    </div>
  );
}
