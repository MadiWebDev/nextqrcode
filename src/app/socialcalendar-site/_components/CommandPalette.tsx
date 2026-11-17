'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useStore } from '../_lib/store';
import { VIEW_LABELS, type CalendarView } from './calendar/CalendarApp';
import { useLocale } from './LocaleProvider';
import type { Post } from '../_lib/types';

export type WorkspaceTab =
  | 'calendar'
  | 'manage'
  | 'library'
  | 'intelligence'
  | 'analytics'
  | 'overview'
  | 'workspaces'
  | 'data';

const TAB_KEYS: Record<WorkspaceTab, Parameters<ReturnType<typeof useLocale>['t']>[0]> = {
  calendar: 'tab.calendar',
  manage: 'tab.manage',
  library: 'tab.library',
  intelligence: 'tab.intelligence',
  analytics: 'tab.analytics',
  overview: 'tab.overview',
  workspaces: 'tab.workspaces',
  data: 'tab.data',
};

/**
 * Command palette (Cmd/Ctrl+K): jump to any tab or calendar view, run
 * workspace actions, or open any post in the editor. Every entry does
 * exactly what it says — no decorative commands.
 */
export default function CommandPalette({
  open,
  onOpenChange,
  onGoTab,
  onGoView,
  onNewPost,
  onOpenPost,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoTab: (tab: WorkspaceTab) => void;
  onGoView: (view: CalendarView) => void;
  onNewPost: () => void;
  onOpenPost: (post: Post) => void;
}) {
  const store = useStore();
  const { t } = useLocale();
  const posts = store.data.posts
    .filter((p) => p.workspaceId === store.activeWorkspace?.id)
    .slice()
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 100);

  const run = (action: () => void) => () => {
    onOpenChange(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t('palette.placeholder')} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {(Object.keys(TAB_KEYS) as WorkspaceTab[]).map((tab) => (
            <CommandItem key={tab} value={`go ${tab}`} onSelect={run(() => onGoTab(tab))}>
              {t(TAB_KEYS[tab])}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Calendar views">
          {(Object.keys(VIEW_LABELS) as CalendarView[]).map((view) => (
            <CommandItem key={view} value={`view ${view}`} onSelect={run(() => onGoView(view))}>
              {VIEW_LABELS[view]} view
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="new post create" onSelect={run(onNewPost)}>
            {t('action.newPost')}
          </CommandItem>
          <CommandItem value="undo" disabled={!store.canUndo} onSelect={run(() => void store.undo())}>
            Undo
          </CommandItem>
          <CommandItem value="redo" disabled={!store.canRedo} onSelect={run(() => void store.redo())}>
            Redo
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Posts">
          {posts.map((p) => (
            <CommandItem
              key={p.id}
              value={`${p.title} ${p.caption} ${p.status}`}
              onSelect={run(() => onOpenPost(p))}
            >
              {p.title || 'Untitled'} · {p.status}
              {p.scheduledAt ? ` · ${p.scheduledAt.slice(0, 10)}` : ' · unscheduled'}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
