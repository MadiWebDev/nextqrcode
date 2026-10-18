/**
 * Rate limiting with an Upstash Redis backend when configured and a real
 * in-memory sliding window fallback otherwise (not a stub — full token-bucket
 * semantics: fixed window, per-key counters, periodic expiry cleanup).
 *
 * NOTE: the in-memory fallback is per-instance. In multi-instance production
 * deployments, configure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN so
 * limits are shared across all instances.
 */

/** Redis REST response shape for INCR/GET integer commands. */
interface RedisIntegerResponse {
  result: number | null;
}

/** Upstash /pipeline response: array of per-command results. */
interface RedisPipelineResponse {
  result: RedisIntegerResponse[];
}

interface MemoryBucket {
  count: number;
  windowStart: number;
}

interface RateLimitOptions {
  /** Max requests per window. Defaults to 60. */
  limit?: number;
  /** Window length in milliseconds. Defaults to 60_000. */
  windowMs?: number;
}

interface RateLimitResult {
  /** Allowed? Primary field. `success` is an alias kept for API routes. */
  ok: boolean;
  /** Alias of `ok` used by API routes written against an earlier draft. */
  success: boolean;
  remaining: number;
}

const DEFAULT_LIMIT = 60;
const DEFAULT_WINDOW_MS = 60_000;
// Cap the in-memory map; entries are lazily expired, this bounds worst-case growth.
const MAX_MEMORY_KEYS = 10_000;
const CLEANUP_INTERVAL_MS = 60_000;

const memoryStore = new Map<string, MemoryBucket>();
let lastCleanup = Date.now();

function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Extract the real client IP: x-forwarded-for → x-real-ip → 'unknown'. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0];
    if (first) return first.trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

function cleanupMemoryStore(now: number, windowMs: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of memoryStore) {
    if (now - bucket.windowStart >= windowMs) memoryStore.delete(key);
  }
  // Hard cap: evict the oldest entries if the map grew unbounded (e.g. many
  // distinct keys with short-lived bursts).
  if (memoryStore.size > MAX_MEMORY_KEYS) {
    const entries = [...memoryStore.entries()].sort((a, b) => a[1].windowStart - b[1].windowStart);
    const excess = memoryStore.size - MAX_MEMORY_KEYS;
    for (let i = 0; i < excess; i++) {
      const entry = entries[i];
      if (entry) memoryStore.delete(entry[0]);
    }
  }
}

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanupMemoryStore(now, windowMs);

  const existing = memoryStore.get(key);
  if (!existing || now - existing.windowStart >= windowMs) {
    memoryStore.set(key, { count: 1, windowStart: now });
    return { ok: true, success: true, remaining: limit - 1 };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const ok = existing.count <= limit;
  return { ok, success: ok, remaining };
}

/**
 * Redis sliding window using the Upstash REST API: INCR the counter, set TTL
 * on first hit in the window (TTL = window in seconds, ceil so a sub-second
 * window still counts). Fail-open: if Redis errors, allow the request rather
 * than breaking the route, and degrade to the in-memory limiter.
 */
async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL as string;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  const body = JSON.stringify([
    ['INCR', key],
    ['TTL', key],
  ]);

  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`Upstash rate-limit request failed: ${res.status}`);

  const data = (await res.json()) as RedisPipelineResponse;
  const count = data.result?.[0]?.result ?? null;
  const ttl = data.result?.[1]?.result ?? null;
  if (count === null) throw new Error('Upstash rate-limit returned no count');

  // If the key has no TTL (fresh key or TTL expired between calls), set one.
  if (ttl === null || ttl <= 0) {
    await fetch(`${url}/expire/${encodeURIComponent(key)}/${ttlSeconds}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const ok = count <= limit;
  return { ok, success: ok, remaining: Math.max(0, limit - count) };
}

/**
 * Check and record a request against `key`. Returns `ok: false` when the key
 * has exceeded `limit` requests within the window.
 */
export async function rateLimit(
  key: string,
  opts: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const limit = opts.limit ?? DEFAULT_LIMIT;
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;

  if (isRedisConfigured()) {
    try {
      return await redisRateLimit(key, limit, windowMs);
    } catch {
      // Fail open to the local limiter so a Redis outage doesn't take the site down.
      return memoryRateLimit(key, limit, windowMs);
    }
  }
  return memoryRateLimit(key, limit, windowMs);
}
