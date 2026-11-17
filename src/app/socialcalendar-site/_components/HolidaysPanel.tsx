'use client';

import { useMemo, useState } from 'react';
import { useStore } from '../_lib/store';
import {
  COUNTRIES,
  INTL_CODE,
  MOON_SIGHTING_DISCLAIMER,
  holidaysInRange,
  type Holiday,
} from '../_data/holidays';
import { addDays } from '../_lib/dates';
import { todayInZone, wallTimeToUtc } from '../_lib/tz';
import { nowIso, uid, type Post } from '../_lib/types';
import type { EditorSeed } from './calendar/PostEditor';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';

export default function HolidaysPanel({
  openEditor,
}: {
  openEditor: (seed: EditorSeed) => void;
}) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [country, setCountry] = useState('PK');
  const [message, setMessage] = useState('');
  const today = todayInZone(ws.timezone);
  const upcoming = useMemo(
    () => holidaysInRange(today, addDays(today, 120), [country, INTL_CODE]).slice(0, 30),
    [today, country],
  );
  const anyLunar = upcoming.some((h) => h.lunar);

  /** Spec §11: one click plans a teaser → day-of → follow-up sequence. */
  const planThree = async (h: Holiday) => {
    const calendarId = store.data.calendars[0]?.id ?? '';
    const mk = (title: string, date: string, caption: string): Post => ({
      id: uid(),
      workspaceId: ws.id,
      calendarId,
      title,
      caption,
      description: '',
      platformCaptions: {},
      platformIds: ws.platformIds,
      scheduledAt: wallTimeToUtc(ws.timezone, date, '10:00').toISOString(),
      timezone: ws.timezone,
      status: 'scheduled',
      contentType: 'image',
      priority: 'normal',
      tags: ['holiday'],
      assigneeLabel: '',
      internalNotes: `Planned from the holidays calendar for ${h.name} (${h.date}).`,
      mediaIds: [],
      checklist: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    const teaser = addDays(h.date, -3);
    const followUp = addDays(h.date, 1);
    await store.savePost(mk(`${h.name} — teaser`, teaser, h.suggestion), 'Holiday plan (teaser)');
    await store.savePost(mk(`${h.name} — on the day`, h.date, ''), 'Holiday plan (day-of)');
    await store.savePost(
      mk(`${h.name} — follow-up`, followUp, 'Share highlights and thank your audience.'),
      'Holiday plan (follow-up)',
    );
    setMessage(`Planned 3 posts around ${h.name}: teaser ${teaser}, day-of ${h.date}, follow-up ${followUp}. Find them on the calendar to add media and captions.`);
  };

  const planOne = (h: Holiday) => {
    openEditor({
      post: {
        id: uid(),
        workspaceId: ws.id,
        calendarId: store.data.calendars[0]?.id ?? '',
        title: h.name,
        caption: h.suggestion,
        description: '',
        platformCaptions: {},
        platformIds: ws.platformIds,
        scheduledAt: wallTimeToUtc(ws.timezone, h.date, '10:00').toISOString(),
        timezone: ws.timezone,
        status: 'scheduled',
        contentType: 'image',
        priority: 'normal',
        tags: ['holiday'],
        assigneeLabel: '',
        internalNotes: '',
        mediaIds: [],
        checklist: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    });
  };

  return (
    <section aria-labelledby="holidays-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="holidays-h" className="text-lg font-semibold">
        Holidays &amp; key dates
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Real public holidays and awareness days for 2026–2028. Dates for the next 120 days in the
        selected country, plus worldwide days.
      </p>
      <label className="mt-3 block max-w-xs text-sm font-medium">
        Country
        <select className={`${inputCls} mt-1`} value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {anyLunar && (
        <p className="mt-3 rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100" role="note">
          {MOON_SIGHTING_DISCLAIMER}
        </p>
      )}
      {message && (
        <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {message}
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {upcoming.map((h) => (
          <li key={h.id} className="rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">
                  {h.name} <span className="text-muted-foreground">· {h.date}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{h.suggestion}</p>
                <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{h.category}</span>
                  {h.country === INTL_CODE && <span className="rounded-full bg-muted px-2 py-0.5">Worldwide</span>}
                  {h.lunar && <span className="rounded-full bg-muted px-2 py-0.5">Expected date — moon sighting</span>}
                  {h.solemn && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-900 dark:bg-red-950 dark:text-red-100">
                      Solemn day — avoid promotions
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent"
                  onClick={() => planOne(h)}
                >
                  Plan a post
                </button>
                <button
                  type="button"
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  onClick={() => void planThree(h)}
                >
                  Plan 3-post sequence
                </button>
              </div>
            </div>
            {h.solemn && (
              <p className="mt-2 text-xs text-red-700 dark:text-red-300" role="note">
                This is a solemn observance. Schedule respectful, non-promotional content only —
                no offers, sales or celebratory framing.
              </p>
            )}
          </li>
        ))}
        {upcoming.length === 0 && (
          <li className="text-sm text-muted-foreground">No dates in the next 120 days for this selection.</li>
        )}
      </ul>
    </section>
  );
}
