/**
 * Dashboard DTOs — plain serializable shapes passed from dashboard server
 * components to client components. They intentionally do NOT import the
 * Mongoose models; the mapping from model docs happens in
 * `src/app/dashboard/_lib/queries.ts`.
 *
 * Field enums (visibility / status / mode) mirror the documented QrCode
 * contract. If the data-layer agent ships different enum values, adapt the
 * allowlists here and in queries.ts.
 */

export type QrVisibility = 'public' | 'unlisted' | 'private';
/**
 * Full status enum from the QrCode model. Users typically toggle
 * active/paused; blocked (moderation) and expired are set by the system.
 */
export type QrStatus = 'active' | 'paused' | 'blocked' | 'expired';
export type QrMode = 'static' | 'dynamic';

export const QR_VISIBILITIES: readonly QrVisibility[] = ['public', 'unlisted', 'private'];
export const QR_STATUSES: readonly QrStatus[] = ['active', 'paused', 'blocked', 'expired'];
export const QR_MODES: readonly QrMode[] = ['static', 'dynamic'];

/** One row on the "My QR Codes" list. Dates are ISO strings. */
export interface QrCodeSummary {
  /** Shareable identifier used in /r/<id> and /dashboard/<id>. */
  publicId: string;
  title: string | null;
  type: string;
  mode: QrMode;
  visibility: QrVisibility;
  status: QrStatus;
  scanCount: number;
  updatedAt: string;
  shortUrl: string;
}

/** Full detail for the edit page. Dates are ISO strings. */
export interface QrCodeDetail extends QrCodeSummary {
  tags: string[];
  destinationUrl: string | null;
  expiresAt: string | null;
  createdAt: string;
  hasPassword: boolean;
}

export interface DashboardStats {
  total: number;
  totalScans: number;
  active: number;
  paused: number;
}

export interface DashboardFilters {
  q: string;
  visibility: '' | QrVisibility;
  status: '' | QrStatus;
  mode: '' | QrMode;
}

export interface DailyScans {
  /** YYYY-MM-DD (UTC bucket). */
  date: string;
  scans: number;
}

export interface CountItem {
  label: string;
  count: number;
}

export interface QrAnalytics {
  totalScans: number;
  daily: DailyScans[];
  countries: CountItem[];
  devices: CountItem[];
  referrers: CountItem[];
}
