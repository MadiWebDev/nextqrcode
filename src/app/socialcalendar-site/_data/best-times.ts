/**
 * General best-posting-time guidance (spec §17).
 *
 * These are broad, commonly published patterns compiled as *general
 * guidance* — they are NOT the user's analytics and the UI always
 * labels them as such. Users can override with their own slots, and
 * slots computed from their own logged performance take precedence in
 * the UI.
 */
export interface GuidanceSlot {
  platformId: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  /** Recommended start hours (24h). */
  hours: number[];
  note: string;
}

const WEEKDAYS = [1, 2, 3, 4, 5];

function forDays(
  platformId: string,
  days: number[],
  hours: number[],
  note: string,
): GuidanceSlot[] {
  return days.map((weekday) => ({ platformId, weekday, hours, note }));
}

export const BEST_TIME_GUIDANCE_LABEL =
  'General guidance, not your personal analytics. Compiled from widely published platform research; your own results may differ.';

export const BEST_TIME_GUIDANCE: GuidanceSlot[] = [
  ...forDays('instagram', WEEKDAYS, [7, 9, 12, 19], 'Weekday mornings and early evenings tend to perform well for feeds and Reels.'),
  ...forDays('instagram', [0, 6], [10, 19], 'Weekend late mornings and evenings are the safer windows.'),
  ...forDays('facebook', WEEKDAYS, [9, 13, 15], 'Mid-morning to mid-afternoon on weekdays is the classic Facebook window.'),
  ...forDays('facebook', [0, 6], [10, 12], 'Weekend late mornings catch leisure browsing.'),
  ...forDays('tiktok', WEEKDAYS, [7, 12, 19, 22], 'Early mornings and evenings; TikTok rewards testing late slots too.'),
  ...forDays('tiktok', [0, 6], [11, 20], 'Weekend midday and evening slots.'),
  ...forDays('youtube', WEEKDAYS, [14, 16], 'Publishing a few hours before the evening peak gives indexing time.'),
  ...forDays('youtube', [0, 6], [12, 15], 'Weekend afternoons are prime watch time for longer videos.'),
  ...forDays('youtube-shorts', WEEKDAYS, [12, 18, 21], 'Shorts ride the same peaks as other short video: lunch and evening.'),
  ...forDays('linkedin', [2, 3, 4], [8, 10, 12], 'Tuesday to Thursday, start-of-workday and lunch, is the professional window.'),
  ...forDays('linkedin', [1, 5], [9], 'Monday and Friday mornings are weaker but usable.'),
  ...forDays('x', WEEKDAYS, [8, 10, 12], 'Weekday mornings ride the news cycle.'),
  ...forDays('pinterest', [6, 0], [20, 21], 'Evenings and weekends, when planning and project browsing happens.'),
  ...forDays('pinterest', WEEKDAYS, [15, 20], 'Afternoon and evening pins for weekday audiences.'),
  ...forDays('threads', WEEKDAYS, [8, 12, 19], 'Threads follows a similar rhythm to X: mornings and evenings.'),
  ...forDays('reddit', [1, 2, 3], [9, 10], 'Subreddit-dependent; weekday mornings US time are a common default. Check your subreddit\u2019s own peak.'),
  ...forDays('telegram', WEEKDAYS, [10, 16, 20], 'Channel posts do well mid-morning and evening in the audience\u2019s zone.'),
  ...forDays('bluesky', WEEKDAYS, [8, 12, 18], 'Mornings and lunch hours mirror its text-first audience habits.'),
  ...forDays('google-business', WEEKDAYS, [10, 14], 'Late morning, when local search activity rises before lunch.'),
  ...forDays('snapchat', WEEKDAYS, [19, 22], 'Evenings, when its younger audience is most active.'),
  ...forDays('whatsapp-status', WEEKDAYS, [8, 20], 'Morning and evening bookends of the day.'),
];

export function guidanceFor(platformId: string, weekday: number): GuidanceSlot | undefined {
  return BEST_TIME_GUIDANCE.find((g) => g.platformId === platformId && g.weekday === weekday);
}
