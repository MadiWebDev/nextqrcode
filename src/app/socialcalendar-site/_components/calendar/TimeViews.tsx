'use client';

import { Fragment } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { addDays, monthGrid, monthLabel, parseDateStr, weekDates, weekdayOf } from '../../_lib/dates';
import { groupByDate, type PlacedPost } from '../../_lib/placed';
import { getPlatform } from '../../_lib/platforms';
import { toDateStrInZone } from '../../_lib/tz';
import type { Workspace } from '../../_lib/types';
import { PostChip } from './PostChip';

export interface ViewProps {
  placed: PlacedPost[];
  cursor: string; // yyyy-mm-dd in display zone
  workspace: Workspace;
  density: 'comfortable' | 'compact';
  onOpen: (placed: PlacedPost) => void;
  onQuickCreate: (date: string, hour?: number) => void;
}

function DropCell({
  id,
  children,
  className,
  label,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      aria-label={label}
      className={`${className ?? ''} ${isOver ? 'bg-primary/10' : ''}`}
    >
      {children}
    </div>
  );
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({ placed, cursor, workspace, density, onOpen, onQuickCreate }: ViewProps) {
  const { y, m } = parseDateStr(cursor);
  const cells = monthGrid(y, m, workspace.weekStart);
  const byDate = groupByDate(placed);
  const today = toDateStrInZone(workspace.timezone, new Date());
  const maxChips = density === 'compact' ? 2 : 4;
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">{monthLabel(y, m)}</h2>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {Array.from({ length: 7 }, (_, i) => (workspace.weekStart + i) % 7).map((wd) => (
          <div key={wd} className="bg-muted/40 px-2 py-1 text-xs font-medium">
            {WEEKDAY_SHORT[wd]}
          </div>
        ))}
        {cells.map((date) => {
          const dayPosts = byDate.get(date) ?? [];
          const inMonth = parseDateStr(date).m === m;
          return (
            <DropCell
              key={date}
              id={`date:${date}`}
              label={`${date}, ${dayPosts.length} posts. Activate the cell button to add a post.`}
              className={`min-h-20 bg-background p-1 ${inMonth ? '' : 'opacity-45'} ${date === today ? 'ring-1 ring-inset ring-primary' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="px-0.5 text-xs font-medium">{parseDateStr(date).d}</span>
                <button
                  type="button"
                  aria-label={`Add post on ${date}`}
                  className="rounded px-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => onQuickCreate(date)}
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {dayPosts.slice(0, maxChips).map((p) => (
                  <PostChip key={`${p.post.id}:${p.scheduledAt}`} placed={p} onOpen={onOpen} />
                ))}
                {dayPosts.length > maxChips && (
                  <p className="px-1 text-[11px] text-muted-foreground">
                    +{dayPosts.length - maxChips} more
                  </p>
                )}
              </div>
            </DropCell>
          );
        })}
      </div>
    </div>
  );
}

export function WeekView({ placed, cursor, workspace, onOpen, onQuickCreate }: ViewProps) {
  const days = weekDates(cursor, workspace.weekStart);
  const byDate = groupByDate(placed);
  const today = toDateStrInZone(workspace.timezone, new Date());
  const hours = Array.from({ length: 24 }, (_, h) => h);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-175">
        <div className="grid grid-cols-[3rem_repeat(7,1fr)] gap-px border border-border bg-border">
          <div className="bg-muted/40" />
          {days.map((date) => (
            <div
              key={date}
              className={`bg-muted/40 px-2 py-1 text-xs font-medium ${date === today ? 'text-primary' : ''}`}
            >
              {WEEKDAY_SHORT[weekdayOf(date)]} {date.slice(5)}
            </div>
          ))}
          {hours.map((hour) => (
            <Fragment key={hour}>
              <div className="bg-background px-1 py-1 text-right text-[11px] text-muted-foreground">
                {String(hour).padStart(2, '0')}:00
              </div>
              {days.map((date) => {
                const cellPosts = (byDate.get(date) ?? []).filter(
                  (p) => Number(p.localTime.slice(0, 2)) === hour,
                );
                return (
                  <DropCell
                    key={`${date}:${hour}`}
                    id={`date:${date}:${hour}`}
                    label={`${date} ${String(hour).padStart(2, '0')}:00, ${cellPosts.length} posts`}
                    className="min-h-8 bg-background p-0.5"
                  >
                    <button
                      type="button"
                      aria-label={`Add post on ${date} at ${String(hour).padStart(2, '0')}:00`}
                      className="block h-3 w-full text-left text-[10px] text-muted-foreground/50 hover:text-foreground"
                      onClick={() => onQuickCreate(date, hour)}
                    >
                      +
                    </button>
                    <div className="space-y-1">
                      {cellPosts.map((p) => (
                        <PostChip key={`${p.post.id}:${p.scheduledAt}`} placed={p} onOpen={onOpen} />
                      ))}
                    </div>
                  </DropCell>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <DaySummary placed={placed} days={days} />
    </div>
  );
}

function DaySummary({ placed, days }: { placed: PlacedPost[]; days: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground" aria-label="Daily workload summary">
      {days.map((date) => (
        <span key={date} className="rounded bg-muted px-2 py-1">
          {date.slice(5)}: {placed.filter((p) => p.localDate === date).length} posts
        </span>
      ))}
    </div>
  );
}

export function DayView({ placed, cursor, workspace, onOpen, onQuickCreate }: ViewProps) {
  const dayPosts = placed.filter((p) => p.localDate === cursor);
  const hours = Array.from({ length: 24 }, (_, h) => h);
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">
        {cursor} · {workspace.timezone}
      </h2>
      <div className="divide-y divide-border rounded-lg border border-border">
        {hours.map((hour) => {
          const cellPosts = dayPosts.filter((p) => Number(p.localTime.slice(0, 2)) === hour);
          const overlaps = cellPosts.length > 1;
          return (
            <DropCell
              key={hour}
              id={`date:${cursor}:${hour}`}
              label={`${cursor} ${String(hour).padStart(2, '0')}:00`}
              className="flex gap-3 bg-background p-2"
            >
              <span className="w-12 shrink-0 text-xs text-muted-foreground">
                {String(hour).padStart(2, '0')}:00
              </span>
              <div className="flex-1 space-y-1">
                {cellPosts.map((p) => (
                  <PostChip key={`${p.post.id}:${p.scheduledAt}`} placed={p} onOpen={onOpen} />
                ))}
                {overlaps && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    {cellPosts.length} posts share this hour — check for overlap.
                  </p>
                )}
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onQuickCreate(cursor, hour)}
                >
                  + Add post at {String(hour).padStart(2, '0')}:00
                </button>
              </div>
            </DropCell>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Workload: {dayPosts.length} post{dayPosts.length === 1 ? '' : 's'} this day.
      </p>
    </div>
  );
}

export function AgendaView({ placed, onOpen }: ViewProps) {
  const byDate = groupByDate(placed);
  const dates = [...byDate.keys()].sort();
  if (dates.length === 0) {
    return (
      <p className="rounded-lg border border-border p-6 text-center text-muted-foreground">
        Nothing scheduled in this range yet. Create a post to get started.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <section key={date} aria-label={`Posts on ${date}`}>
          <h3 className="sticky top-16 z-10 -mx-1 bg-background px-1 py-1 font-semibold">{date}</h3>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {(byDate.get(date) ?? []).map((p) => (
              <li key={`${p.post.id}:${p.scheduledAt}`}>
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="w-12 shrink-0 font-medium">{p.localTime}</span>
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: getPlatform(p.post.platformIds[0])?.color ?? '#64748b' }}
                  />
                  <span className="flex-1 truncate">
                    {p.post.title || p.post.caption.slice(0, 60) || 'Untitled'}
                  </span>
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

export function TimelineView({ placed, cursor, workspace, onOpen }: ViewProps) {
  const days = weekDates(cursor, workspace.weekStart);
  const enabled = workspace.platformIds;
  return (
    <div className="space-y-2 overflow-x-auto">
      <div className="min-w-175">
        <div className="grid grid-cols-[8rem_repeat(7,1fr)] gap-px border border-border bg-border text-xs">
          <div className="bg-muted/40 p-2 font-medium">Platform</div>
          {days.map((d) => (
            <div key={d} className="bg-muted/40 p-2 font-medium">
              {d.slice(5)}
            </div>
          ))}
          {enabled.map((pid) => (
            <Fragment key={pid}>
              <div className="flex items-center gap-2 bg-background p-2 font-medium">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: getPlatform(pid)?.color ?? '#64748b' }}
                />
                {getPlatform(pid)?.name ?? pid}
              </div>
              {days.map((date) => {
                const lanePosts = placed.filter(
                  (p) => p.localDate === date && p.post.platformIds.includes(pid),
                );
                return (
                  <DropCell
                    key={`${pid}:${date}`}
                    id={`date:${date}`}
                    label={`${getPlatform(pid)?.name ?? pid} on ${date}`}
                    className="min-h-10 bg-background p-1"
                  >
                    <div className="space-y-1">
                      {lanePosts.map((p) => (
                        <PostChip key={`${p.post.id}:${p.scheduledAt}`} placed={p} onOpen={onOpen} />
                      ))}
                    </div>
                  </DropCell>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        One lane per platform for the week of {days[0]} — drag a post to another day to reschedule it.
      </p>
    </div>
  );
}

export function addDaysToCursor(cursor: string, days: number): string {
  return addDays(cursor, days);
}
