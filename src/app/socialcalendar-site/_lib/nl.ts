import * as chrono from 'chrono-node';
import { PLATFORMS } from './platforms';
import { zonedTimeToUtc } from './tz';
import type { RecurrenceRule } from './types';

/**
 * Natural-language scheduling (spec §10), powered by chrono-node.
 *
 * chrono extracts date/time *components* from the text; those wall-clock
 * components are then interpreted in the workspace's IANA zone (never
 * the device zone), so "next Tuesday at 6 PM" means 6 PM where the
 * workspace says it does. The caller always shows a confirmation
 * preview before saving.
 */
export interface ParsedSchedule {
  /** UTC instant ISO. */
  instant: string;
  /** yyyy-mm-dd in the target zone. */
  date: string;
  /** HH:MM in the target zone. */
  time: string;
  platformIds: string[];
  recurrence?: RecurrenceRule;
  /** Human-readable confirmation line. */
  preview: string;
}

const PLATFORM_ALIASES: Record<string, string> = {
  ig: 'instagram',
  insta: 'instagram',
  fb: 'facebook',
  yt: 'youtube',
  shorts: 'youtube-shorts',
  twitter: 'x',
  'google business': 'google-business',
  gbp: 'google-business',
  wa: 'whatsapp-status',
  whatsapp: 'whatsapp-status',
};

const WEEKDAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function extractPlatformIds(text: string): string[] {
  const lower = ` ${text.toLowerCase()} `;
  const found = new Set<string>();
  for (const p of PLATFORMS) {
    if (lower.includes(` ${p.name.toLowerCase()} `) || lower.includes(` ${p.id} `)) {
      found.add(p.id);
    }
  }
  for (const [alias, id] of Object.entries(PLATFORM_ALIASES)) {
    if (lower.includes(` ${alias} `) || lower.includes(` ${alias},`)) found.add(id);
  }
  return [...found];
}

export function parseScheduleText(
  text: string,
  timeZone: string,
  reference: Date = new Date(),
): ParsedSchedule | null {
  const results = chrono.parse(text, reference, { forwardDate: true });
  const first = results[0];
  if (!first) return null;
  const start = first.start;
  const year = start.get('year');
  const month = start.get('month');
  const day = start.get('day');
  if (!year || !month || !day) return null;
  const hour = start.get('hour') ?? 9;
  const minute = start.get('minute') ?? 0;
  const instant = zonedTimeToUtc(timeZone, year, month, day, hour, minute);
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  // Recurrence phrasing: "every Monday", "every day", "every week".
  let recurrence: RecurrenceRule | undefined;
  const every = text.toLowerCase().match(/every\s+(day|week|month|sunday|monday|tuesday|wednesday|thursday|friday|saturday)/);
  if (every) {
    const token = every[1];
    if (token === 'day') recurrence = { freq: 'daily', interval: 1 };
    else if (token === 'week') recurrence = { freq: 'weekly', interval: 1 };
    else if (token === 'month') recurrence = { freq: 'monthly', interval: 1 };
    else {
      recurrence = {
        freq: 'weekly',
        interval: 1,
        weekdays: [WEEKDAY_NAMES.indexOf(token)],
      };
    }
  }

  const platformIds = extractPlatformIds(text);
  const whenLabel = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(instant);
  const preview = [
    `${whenLabel} at ${time} (${timeZone})`,
    platformIds.length
      ? `for ${platformIds.map((id) => PLATFORMS.find((p) => p.id === id)?.name ?? id).join(', ')}`
      : '',
    recurrence ? `repeating ${recurrence.freq}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  return { instant: instant.toISOString(), date, time, platformIds, recurrence, preview };
}
