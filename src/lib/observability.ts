/**
 * Minimal env-gated error tracking + privacy-friendly analytics hooks.
 *
 * - Error tracking: forwards to Sentry only when `SENTRY_DSN`
 *   (server) or `NEXT_PUBLIC_SENTRY_DSN` (client) is configured.
 *   Without a DSN, errors are logged via `console.error` in
 *   development and silently dropped in production.
 * - Analytics: opt-in only. Events are recorded only when the
 *   visitor accepted cookies (`qrs_cookie_consent === 'accepted'`
 *   in localStorage), never include PII, and are batched and
 *   delivered with `navigator.sendBeacon` to `/api/analytics`
 *   when that route exists (checked once at runtime). When the
 *   route is absent, events are dropped (no-op).
 *
 * Server-safe: every browser API is guarded by `typeof window`.
 */

const CONSENT_KEY = 'qrs_cookie_consent';
const ANALYTICS_ENDPOINT = '/api/analytics';
const SENTRY_TIMEOUT_MS = 5000;

/** Event property values: primitives only, never PII. */
export type AnalyticsProps = Record<string, string | number | boolean>;

type SentryDsnParts = {
  scheme: string;
  host: string;
  publicKey: string;
  projectId: string;
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isDev(): boolean {
  return process.env.NODE_ENV !== 'production';
}

/**
 * Parse a Sentry DSN of the form
 * `https://<public-key>@<host>/<project-id>`.
 */
function parseDsn(dsn: string): SentryDsnParts | null {
  const match = /^(https?):\/\/([^@]+)@([^/]+)\/(\d+)\/?$/.exec(dsn.trim());
  if (!match) return null;
  return { scheme: match[1], host: match[3], publicKey: match[2], projectId: match[4] };
}

function getSentryDsn(): string | null {
  const dsn = (isBrowser() ? process.env.NEXT_PUBLIC_SENTRY_DSN : process.env.SENTRY_DSN) ?? '';
  return dsn.length > 0 ? dsn : null;
}

function serializeError(err: unknown): { message: string; stack: string | undefined } {
  if (err instanceof Error) return { message: err.message, stack: err.stack };
  if (typeof err === 'string') return { message: err, stack: undefined };
  try {
    return { message: JSON.stringify(err), stack: undefined };
  } catch {
    return { message: 'Unknown error', stack: undefined };
  }
}

/**
 * Forward an error payload to Sentry's store endpoint, fire-and-forget.
 * Any failure is swallowed so error tracking can never break the app.
 */
function sendToSentry(err: unknown, context: Record<string, unknown> | undefined): void {
  const rawDsn = getSentryDsn();
  if (!rawDsn) return;
  const parts = parseDsn(rawDsn);
  if (!parts) {
    if (isDev()) console.error('[observability] Invalid SENTRY_DSN format', rawDsn);
    return;
  }

  const { message, stack } = serializeError(err);
  const storeUrl =
    `${parts.scheme}://${parts.host}/api/${parts.projectId}/store/` +
    `?sentry_key=${encodeURIComponent(parts.publicKey)}&sentry_version=7`;
  const payload = JSON.stringify({
    platform: 'javascript',
    level: 'error',
    exception: {
      values: [
        {
          type: message.split(':')[0] || 'Error',
          value: message,
          stacktrace: stack
            ? { frames: [{ filename: 'unknown', lineno: 0, function: '?' }] }
            : undefined,
        },
      ],
    },
    extra: context ?? {},
  });

  if (isBrowser() && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      navigator.sendBeacon(storeUrl, new Blob([payload], { type: 'application/json' }));
      return;
    } catch {
      // fall through to fetch below
    }
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeout = controller ? setTimeout(() => controller.abort(), SENTRY_TIMEOUT_MS) : null;
  fetch(storeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    signal: controller?.signal,
    keepalive: true,
  })
    .catch(() => {
      /* error tracking must never throw */
    })
    .finally(() => {
      if (timeout) clearTimeout(timeout);
    });
}

/**
 * Report an error. With `SENTRY_DSN` set, the error is forwarded to
 * Sentry (fire-and-forget). Without one, it is logged in development
 * and ignored in production.
 *
 * @param err - the thrown value (Error, string, or anything)
 * @param context - optional structured context; keep it PII-free
 */
export function reportError(err: unknown, context?: Record<string, unknown>): void {
  if (getSentryDsn()) {
    sendToSentry(err, context);
    return;
  }
  if (isDev()) {
    console.error('[reportError]', serializeError(err).message, context ?? '');
  }
}

type QueuedEvent = { name: string; props: AnalyticsProps; at: number };

const eventQueue: QueuedEvent[] = [];
const FLUSH_INTERVAL_MS = 5000;
const MAX_QUEUE = 50;
let flushTimer: ReturnType<typeof setInterval> | null = null;
let analyticsRouteChecked = false;
let analyticsRouteExists = false;

/** True when the visitor opted into analytics via the cookie banner. */
function hasAnalyticsConsent(): boolean {
  if (!isBrowser()) return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

/**
 * One-time check for the presence of the `/api/analytics` ingestion route.
 * Events queue locally until the check resolves; if the route is absent
 * the queue is dropped.
 */
async function ensureAnalyticsRoute(): Promise<boolean> {
  if (analyticsRouteChecked) return analyticsRouteExists;
  analyticsRouteChecked = true;
  try {
    const res = await fetch(ANALYTICS_ENDPOINT, { method: 'HEAD' });
    analyticsRouteExists = res.ok;
  } catch {
    analyticsRouteExists = false;
  }
  return analyticsRouteExists;
}

function flushEvents(): void {
  if (!isBrowser() || eventQueue.length === 0) return;
  if (!analyticsRouteExists) return;
  if (!hasAnalyticsConsent()) {
    eventQueue.length = 0;
    return;
  }
  const batch = eventQueue.splice(0, eventQueue.length);
  try {
    navigator.sendBeacon(
      ANALYTICS_ENDPOINT,
      new Blob([JSON.stringify({ events: batch })], { type: 'application/json' })
    );
  } catch {
    /* analytics must never throw */
  }
}

function scheduleFlush(): void {
  if (flushTimer || !isBrowser()) return;
  flushTimer = setInterval(flushEvents, FLUSH_INTERVAL_MS);
  window.addEventListener('pagehide', flushEvents, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEvents();
  });
}

/**
 * Record a privacy-friendly analytics event.
 *
 * Requirements for callers:
 * - `name` and `props` must contain no personally identifiable
 *   information (no emails, names, IPs, full URLs, QR payloads).
 * - The visitor must have accepted cookies; otherwise the call is a no-op.
 * - The `/api/analytics` route must exist; otherwise the call is a no-op.
 *   (Checked at runtime — this repo does not ship that route today.)
 */
export function trackEvent(name: string, props: AnalyticsProps = {}): void {
  if (!isBrowser()) return;
  if (!hasAnalyticsConsent()) return;
  void ensureAnalyticsRoute().then((ok) => {
    if (!ok) return;
    if (eventQueue.length >= MAX_QUEUE) eventQueue.shift();
    eventQueue.push({ name, props, at: Date.now() });
    scheduleFlush();
  });
}
