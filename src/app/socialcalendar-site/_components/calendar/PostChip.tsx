'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { getPlatform } from '../../_lib/platforms';
import type { PlacedPost } from '../../_lib/placed';

export const STATUS_STYLES: Record<string, string> = {
  idea: 'border-dashed',
  draft: 'opacity-90',
  'in-review': 'ring-1 ring-amber-400',
  'changes-requested': 'ring-1 ring-red-400',
  approved: 'ring-1 ring-emerald-400',
  scheduled: '',
  published: 'opacity-70',
  archived: 'opacity-50',
};

/** Compact draggable post chip used by the time-based views. */
export function PostChip({
  placed,
  onOpen,
}: {
  placed: PlacedPost;
  onOpen: (placed: PlacedPost) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `post:${placed.post.id}:${placed.scheduledAt}`,
    data: { placed },
  });
  const firstPlatform = placed.post.platformIds[0]
    ? getPlatform(placed.post.platformIds[0])
    : undefined;
  const color = firstPlatform?.color ?? '#64748b';
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={() => onOpen(placed)}
      aria-label={`${placed.post.title || 'Untitled post'}, ${placed.localTime}, status ${placed.post.status}. Press Enter to open, or use the editor to reschedule.`}
      className={`block w-full touch-none truncate rounded border border-border bg-card px-1.5 py-1 text-left text-[11px] leading-tight shadow-sm hover:bg-muted ${STATUS_STYLES[placed.post.status] ?? ''} ${isDragging ? 'opacity-40' : ''}`}
      style={{ transform: CSS.Translate.toString(transform), borderLeft: `3px solid ${color}` }}
    >
      <span className="font-medium">{placed.localTime}</span>{' '}
      {placed.post.title || placed.post.caption.slice(0, 40) || 'Untitled'}
      {placed.isRecurrenceOccurrence ? ' ↻' : ''}
    </button>
  );
}
