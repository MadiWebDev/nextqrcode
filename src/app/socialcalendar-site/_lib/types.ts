/**
 * Social Media Calendar — shared data model (spec §6).
 *
 * Everything is local-first: these records live in the user's browser
 * (IndexedDB via Dexie, see db.ts). No record is ever transmitted
 * anywhere by this application unless the user explicitly exports it
 * or opts into a future SyncAdapter (see sync.ts — interface only).
 */

export type PostStatus =
  | 'idea'
  | 'draft'
  | 'in-review'
  | 'changes-requested'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export const POST_STATUSES: PostStatus[] = [
  'idea',
  'draft',
  'in-review',
  'changes-requested',
  'approved',
  'scheduled',
  'published',
  'archived',
];

/** Default Kanban pipeline (spec §7) — the workflow subset of PostStatus. */
export const PIPELINE_STATUSES: PostStatus[] = [
  'idea',
  'draft',
  'in-review',
  'approved',
  'scheduled',
  'published',
];

export type ContentType =
  | 'image'
  | 'carousel'
  | 'video'
  | 'reel'
  | 'short'
  | 'story'
  | 'text'
  | 'link'
  | 'poll'
  | 'live'
  | 'event'
  | 'announcement';

export const CONTENT_TYPES: ContentType[] = [
  'image',
  'carousel',
  'video',
  'reel',
  'short',
  'story',
  'text',
  'link',
  'poll',
  'live',
  'event',
  'announcement',
];

export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export const PRIORITIES: Priority[] = ['low', 'normal', 'high', 'urgent'];

export interface BrandKit {
  brandName: string;
  /** data: URL of an uploaded logo, stored locally only. */
  logoDataUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPreference: string;
  tone: string;
  description: string;
  website: string;
  socialLinks: Record<string, string>;
  hashtagPreferences: string[];
  guidelines: string;
}

export interface Workspace {
  id: string;
  name: string;
  /** IANA time-zone identifier, e.g. "Asia/Karachi". */
  timezone: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekStart: number;
  /** Enabled platform ids (see platforms.ts registry). */
  platformIds: string[];
  brand: BrandKit;
  /** Default kanban column order (PostStatus subset, customizable). */
  pipeline: PostStatus[];
  createdAt: string;
  updatedAt: string;
}

export interface Calendar {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface RecurrenceRule {
  freq: 'daily' | 'weekly' | 'monthly';
  interval: number;
  /** For weekly: weekdays 0–6. */
  weekdays?: number[];
  /** ISO date (yyyy-mm-dd) the series ends, inclusive. */
  until?: string;
  count?: number;
}

export interface ChecklistItemState {
  label: string;
  done: boolean;
}

export interface EvergreenMeta {
  reuseCount: number;
  lastUsedAt?: string;
  minIntervalDays: number;
  maxReuse: number;
  excludedDates: string[];
}

export interface Post {
  id: string;
  workspaceId: string;
  calendarId: string;
  title: string;
  caption: string;
  description: string;
  /** Per-platform caption overrides; absent key = use master caption. */
  platformCaptions: Record<string, string>;
  platformIds: string[];
  /** ISO instant (UTC) or null when unscheduled. */
  scheduledAt: string | null;
  /** IANA zone the scheduledAt wall-time was authored in. */
  timezone: string;
  status: PostStatus;
  contentType: ContentType;
  campaignId?: string;
  pillarId?: string;
  priority: Priority;
  tags: string[];
  assigneeLabel: string;
  internalNotes: string;
  mediaIds: string[];
  checklist: ChecklistItemState[];
  recurrence?: RecurrenceRule;
  /** Id of the recurrence master post when this is a generated occurrence. */
  recurrenceMasterId?: string;
  seriesId?: string;
  seriesSeq?: number;
  /** Repurposing: the post this one was derived from. */
  sourcePostId?: string;
  evergreen?: EvergreenMeta;
  utm?: UtmParams;
  createdAt: string;
  updatedAt: string;
}

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface MediaItem {
  id: string;
  workspaceId: string;
  name: string;
  mimeType: string;
  size: number;
  blob: Blob;
  thumbnailBlob?: Blob;
  altText: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export type CampaignStatus = 'planned' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  goal: string;
  /** yyyy-mm-dd */
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  color: string;
  budget?: number;
  budgetCurrency?: string;
  audienceNotes: string;
  utmDefaults: { source: string; medium: string; campaign: string };
  createdAt: string;
  updatedAt: string;
}

export interface Pillar {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  targetPercent: number;
  description: string;
}

export interface HashtagGroup {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  tags: string[];
}

export interface Template {
  id: string;
  /** null = built-in library template. */
  workspaceId: string | null;
  name: string;
  category: string;
  caption: string;
  contentType: ContentType;
  /** Placeholder keys found in the caption, e.g. ["product", "offer"]. */
  placeholders: string[];
  notes: string;
}

export interface Idea {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  platformId?: string;
  pillarId?: string;
  format?: string;
  hook?: string;
  cta?: string;
  hashtags: string[];
  difficulty: 'easy' | 'medium' | 'advanced';
  /** Built-in library idea this was saved from, when applicable. */
  libraryIdeaId?: string;
  createdAt: string;
}

export interface ChecklistTemplate {
  id: string;
  workspaceId: string;
  name: string;
  items: string[];
}

export type ApprovalCommentKind = 'comment' | 'approval' | 'change-request' | 'status-change';

/** Local workspace notes — NOT a multi-user system (spec §18 labelling rule). */
export interface ApprovalComment {
  id: string;
  workspaceId: string;
  postId: string;
  authorLabel: string;
  body: string;
  kind: ApprovalCommentKind;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  workspaceId: string;
  entityType: string;
  entityId: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface PerformanceMetrics {
  reach?: number;
  impressions?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  followersGained?: number;
  videoViews?: number;
  conversions?: number;
  custom?: Record<string, number>;
}

/** Manually entered or CSV-imported results — never invented (spec §16). */
export interface PerformanceEntry {
  id: string;
  workspaceId: string;
  postId: string;
  platformId: string;
  /** yyyy-mm-dd the results describe. */
  date: string;
  metrics: PerformanceMetrics;
  createdAt: string;
}

export interface Reminder {
  id: string;
  workspaceId: string;
  postId: string;
  offsetMinutes: number;
  firedAt?: string;
  snoozedUntil?: string;
  dismissed?: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  workspaceId: string;
  enabled: boolean;
  offsetsMinutes: number[];
}

export interface PlatformConfig {
  workspaceId: string;
  platformId: string;
  /** User-adjusted character limit overriding the registry guidance. */
  customCharLimit?: number;
  notes?: string;
}

export interface FilterState {
  query: string;
  platformIds: string[];
  statuses: PostStatus[];
  campaignId?: string;
  pillarId?: string;
  contentTypes: ContentType[];
  priorities: Priority[];
  assignee?: string;
  hasAttachments?: boolean;
  missingAltText?: boolean;
  hasWarnings?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export const EMPTY_FILTER: FilterState = {
  query: '',
  platformIds: [],
  statuses: [],
  contentTypes: [],
  priorities: [],
};

export interface SavedFilter {
  id: string;
  workspaceId: string;
  name: string;
  filter: FilterState;
  createdAt: string;
}

export interface BestTimeSlot {
  id: string;
  workspaceId: string;
  platformId: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  hour: number;
  source: 'manual' | 'guidance' | 'computed';
}

export interface PostRevision {
  id: string;
  postId: string;
  workspaceId: string;
  snapshot: Post;
  label: string;
  createdAt: string;
}

export type RuleTrigger =
  | 'status-changed'
  | 'post-created'
  | 'campaign-starting'
  | 'daily-check';

export interface AutomationRule {
  id: string;
  workspaceId: string;
  name: string;
  trigger: RuleTrigger;
  /** Status the trigger watches, for status-changed rules. */
  triggerStatus?: PostStatus;
  action: 'flag-missing-alt' | 'suggest-recycle' | 'gap-alert' | 'mark-ready' | 'remind-approval';
  enabled: boolean;
  /** Suggestion rules never mutate data; action rules do one labelled thing. */
  suggestionOnly: boolean;
  createdAt: string;
}

export interface RuleRun {
  id: string;
  ruleId: string;
  workspaceId: string;
  ranAt: string;
  outcome: 'ok' | 'error';
  detail: string;
}

export interface Series {
  id: string;
  workspaceId: string;
  name: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  weekday?: number;
  platformId?: string;
  templateId?: string;
  color: string;
  createdAt: string;
}

export interface LocalProfile {
  id: string;
  displayName: string;
  createdAt: string;
}

/** Full-database backup envelope (spec §6). */
export interface BackupFile {
  app: 'socialcalendar';
  schemaVersion: number;
  exportedAt: string;
  workspaceId?: string;
  data: Record<string, unknown[]>;
}

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const nowIso = (): string => new Date().toISOString();
