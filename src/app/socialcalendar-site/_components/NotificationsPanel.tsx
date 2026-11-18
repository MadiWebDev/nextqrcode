'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore, type StoreValue } from '../_lib/store';
import { nowIso, uid, type NotificationSettings, type Reminder } from '../_lib/types';

const OFFSET_OPTIONS = [
  { minutes: 15, label: '15 minutes before' },
  { minutes: 60, label: '1 hour before' },
  { minutes: 240, label: '4 hours before' },
  { minutes: 1440, label: '1 day before' },
];

/**
 * Reminder engine (spec §18): checks every 45 seconds while the
 * workspace is open and fires due reminders exactly once per
 * (post, offset) — recording them as Reminder rows so the panel below
 * can show history, snooze and dismiss. Browser Notifications are used
 * only when the user has granted permission; the in-app list always
 * works. Nothing fires while the app is closed — stated in the UI.
 */
export function ReminderEngine() {
  const store = useStore();
  const storeRef = useRef<StoreValue>(store);
  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  useEffect(() => {
    const tick = async () => {
      const s = storeRef.current;
      const ws = s.activeWorkspace;
      const settings = s.data.notificationSettings;
      if (!ws || !settings?.enabled || settings.workspaceId !== ws.id) return;
      const now = Date.now();
      for (const post of s.data.posts) {
        if (post.workspaceId !== ws.id || !post.scheduledAt) continue;
        const start = new Date(post.scheduledAt).getTime();
        if (start < now - 3_600_000) continue; // more than 1h past — stale
        for (const offset of settings.offsetsMinutes) {
          const fireAt = start - offset * 60_000;
          if (now < fireAt) continue;
          const existing = s.data.reminders.find(
            (r) => r.postId === post.id && r.offsetMinutes === offset,
          );
          if (existing?.dismissed) continue;
          if (existing?.snoozedUntil && new Date(existing.snoozedUntil).getTime() > now) continue;
          if (existing?.firedAt && !existing.snoozedUntil) continue;
          const reminder: Reminder = existing
            ? { ...existing, firedAt: nowIso(), snoozedUntil: undefined }
            : {
                id: uid(),
                workspaceId: ws.id,
                postId: post.id,
                offsetMinutes: offset,
                firedAt: nowIso(),
                createdAt: nowIso(),
              };
          await s.put('reminders', reminder);
          if (
            typeof Notification !== 'undefined' &&
            Notification.permission === 'granted'
          ) {
            new Notification(`Upcoming post: ${post.title || 'Untitled'}`, {
              body: `Scheduled for ${new Date(post.scheduledAt).toLocaleString()} (${post.timezone}).`,
              icon: '/socialcalendar-icon-192.png',
            });
          }
        }
      }
    };
    const interval = setInterval(() => void tick(), 45_000);
    void tick();
    return () => clearInterval(interval);
  }, []);

  return null;
}

export default function NotificationsPanel() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const settings = store.data.notificationSettings;
  const [permission, setPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
  );
  const reminders = store.data.reminders
    .filter((r) => r.workspaceId === ws.id)
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 20);

  const saveSettings = async (patch: Partial<NotificationSettings>) => {
    await store.put('notificationSettings', {
      workspaceId: ws.id,
      enabled: settings?.enabled ?? false,
      offsetsMinutes: settings?.offsetsMinutes ?? [60],
      ...patch,
    } satisfies NotificationSettings);
  };

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const snooze = async (r: Reminder) => {
    await store.put('reminders', {
      ...r,
      snoozedUntil: new Date(new Date().getTime() + 10 * 60_000).toISOString(),
    });
  };
  const dismiss = async (r: Reminder) => {
    await store.put('reminders', { ...r, dismissed: true });
  };

  return (
    <section aria-labelledby="notif-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="notif-h" className="text-lg font-semibold">
        Reminders
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Reminders are checked while this workspace is open in a browser tab — this local-first app
        has no server to nudge you when it is closed. Keep a tab open near publishing time, or
        export the ICS file to your regular calendar for closed-app alerts.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={settings?.enabled ?? false}
            onChange={(e) => void saveSettings({ enabled: e.target.checked })}
          />
          Enable reminders
        </label>
        <fieldset className="flex flex-wrap gap-3">
          <legend className="sr-only">Remind me</legend>
          {OFFSET_OPTIONS.map((o) => (
            <label key={o.minutes} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={(settings?.offsetsMinutes ?? [60]).includes(o.minutes)}
                onChange={(e) => {
                  const current = settings?.offsetsMinutes ?? [60];
                  void saveSettings({
                    offsetsMinutes: e.target.checked
                      ? [...current, o.minutes]
                      : current.filter((m) => m !== o.minutes),
                  });
                }}
              />
              {o.label}
            </label>
          ))}
        </fieldset>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span>
          Browser notifications:{' '}
          <strong>
            {permission === 'granted'
              ? 'allowed'
              : permission === 'denied'
                ? 'blocked in browser settings'
                : permission === 'unsupported'
                  ? 'not supported in this browser'
                  : 'not yet allowed'}
          </strong>
        </span>
        {permission === 'default' && (
          <button
            type="button"
            className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent"
            onClick={() => void requestPermission()}
          >
            Allow browser notifications
          </button>
        )}
        <span className="text-muted-foreground">In-app reminders below work either way.</span>
      </div>
      {reminders.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Reminder history</h3>
          <ul className="mt-2 space-y-1.5">
            {reminders.map((r) => {
              const post = store.data.posts.find((p) => p.id === r.postId);
              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                >
                  <span>
                    <span className="font-medium">{post?.title || '(deleted post)'}</span> —{' '}
                    {r.offsetMinutes >= 60 ? `${r.offsetMinutes / 60}h` : `${r.offsetMinutes}m`} before
                    {r.firedAt ? ` · fired ${new Date(r.firedAt).toLocaleString()}` : ''}
                    {r.snoozedUntil && new Date(r.snoozedUntil).getTime() > new Date().getTime()
                      ? ` · snoozed until ${new Date(r.snoozedUntil).toLocaleTimeString()}`
                      : ''}
                    {r.dismissed ? ' · dismissed' : ''}
                  </span>
                  {!r.dismissed && (
                    <span className="flex gap-2">
                      <button type="button" className="rounded-md border border-input px-2.5 py-1 text-xs font-medium hover:bg-accent" onClick={() => void snooze(r)}>
                        Snooze 10 min
                      </button>
                      <button type="button" className="rounded-md border border-input px-2.5 py-1 text-xs font-medium hover:bg-accent" onClick={() => void dismiss(r)}>
                        Dismiss
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
