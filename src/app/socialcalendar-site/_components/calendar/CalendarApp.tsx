'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  CONTENT_TYPES,
  EMPTY_FILTER,
  POST_STATUSES,
  nowIso,
  uid,
  type FilterState,
  type Post,
  type PostStatus,
  type SavedFilter,
} from '../../_lib/types';
import { filterFromParams, filterPosts, filterToParams } from '../../_lib/search';
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
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [savedViewName, setSavedViewName] = useState('');

  // Shareable filter state: read once from the URL on mount…
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if ([...params.keys()].length > 0) setFilter(filterFromParams(params));
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  // …and write back (debounced) whenever it changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = filterToParams(filter);
      const query = params.toString();
      window.history.replaceState(
        null,
        '',
        query ? `${window.location.pathname}?${query}` : window.location.pathname,
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);



  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const mediaAlt = useMemo(
    () => new Map(store.data.media.map((m) => [m.id, Boolean(m.altText.trim())])),
    [store.data.media],
  );
  const filteredPosts = useMemo(
    () => filterPosts(store.data.posts, filter, mediaAlt),
    [store.data.posts, filter, mediaAlt],
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

  // Keyboard navigation events dispatched by the workspace shell.
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  });
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<-1 | 1 | 'today'>).detail;
      if (detail === 'today') setCursor(todayInZone(ws.timezone));
      else navigateRef.current(detail);
    };
    window.addEventListener('sc-cal-nav', handler);
    return () => window.removeEventListener('sc-cal-nav', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <div className="mb-3 space-y-2" aria-label="Search and filters">
        <div className="flex flex-wrap items-center gap-2">
          <label className="min-w-52 flex-1 text-sm">
            <span className="sr-only">Search posts</span>
            <input
              type="search"
              value={filter.query}
              onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
              placeholder="Search title, caption, tags… (accents optional)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <span className="text-xs text-muted-foreground">
            Showing {placed.length} scheduled · {filteredPosts.length} matching · {ws.timezone}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="font-medium">Platforms:</span>
          {ws.platformIds.map((pid) => {
            const on = filter.platformIds.includes(pid);
            return (
              <button
                key={pid}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setFilter((f) => ({
                    ...f,
                    platformIds: on
                      ? f.platformIds.filter((x) => x !== pid)
                      : [...f.platformIds, pid],
                  }))
                }
                className={`rounded-full border px-2 py-0.5 ${on ? 'border-primary bg-primary/10 font-medium' : 'border-border text-muted-foreground'}`}
              >
                {getPlatform(pid)?.name ?? pid}
              </button>
            );
          })}
          <span className="ml-2 font-medium">Status:</span>
          {POST_STATUSES.map((status) => {
            const on = filter.statuses.includes(status);
            return (
              <button
                key={status}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setFilter((f) => ({
                    ...f,
                    statuses: on
                      ? f.statuses.filter((x) => x !== status)
                      : [...f.statuses, status],
                  }))
                }
                className={`rounded-full border px-2 py-0.5 capitalize ${on ? 'border-primary bg-primary/10 font-medium' : 'border-border text-muted-foreground'}`}
              >
                {status}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label>
            Pillar{' '}
            <select
              value={filter.pillarId ?? ''}
              onChange={(e) => setFilter((f) => ({ ...f, pillarId: e.target.value || undefined }))}
              className="rounded-md border border-input bg-background px-2 py-1"
            >
              <option value="">Any</option>
              {store.data.pillars.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Campaign{' '}
            <select
              value={filter.campaignId ?? ''}
              onChange={(e) => setFilter((f) => ({ ...f, campaignId: e.target.value || undefined }))}
              className="rounded-md border border-input bg-background px-2 py-1"
            >
              <option value="">Any</option>
              {store.data.campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type{' '}
            <select
              value={filter.contentTypes[0] ?? ''}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  contentTypes: e.target.value ? [e.target.value as Post['contentType']] : [],
                }))
              }
              className="rounded-md border border-input bg-background px-2 py-1 capitalize"
            >
              <option value="">Any</option>
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filter.missingAltText ?? false}
              onChange={(e) => setFilter((f) => ({ ...f, missingAltText: e.target.checked }))}
            />
            Missing alt text
          </label>
          {(filter.query ||
            filter.platformIds.length > 0 ||
            filter.statuses.length > 0 ||
            filter.pillarId ||
            filter.campaignId ||
            filter.contentTypes.length > 0 ||
            filter.missingAltText) && (
            <button type="button" className="underline" onClick={() => setFilter(EMPTY_FILTER)}>
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium">Saved views:</span>
          {store.data.savedFilters
            .filter((s) => s.workspaceId === ws.id)
            .map((s) => (
              <span key={s.id} className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5">
                <button type="button" className="font-medium" onClick={() => setFilter(s.filter)}>
                  {s.name}
                </button>
                <button
                  type="button"
                  aria-label={`Delete saved view ${s.name}`}
                  className="text-destructive"
                  onClick={() => void store.remove('savedFilters', s.id)}
                >
                  ×
                </button>
              </span>
            ))}
          <input
            value={savedViewName}
            onChange={(e) => setSavedViewName(e.target.value)}
            placeholder="Name this view…"
            className="rounded-md border border-input bg-background px-2 py-1"
            aria-label="Name for the current filter view"
          />
          <button
            type="button"
            disabled={!savedViewName.trim()}
            className="rounded-md border border-input px-2 py-1 font-medium hover:bg-accent disabled:opacity-50"
            onClick={() => {
              void store.put('savedFilters', {
                id: uid(),
                workspaceId: ws.id,
                name: savedViewName.trim(),
                filter,
                createdAt: nowIso(),
              } satisfies SavedFilter);
              setSavedViewName('');
            }}
          >
            Save view
          </button>
          <span className="text-muted-foreground">
            Tip: the current filters are in the page URL — copy it to share this exact view.
          </span>
        </div>
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
