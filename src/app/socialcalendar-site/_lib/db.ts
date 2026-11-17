import Dexie, { type Table } from 'dexie';
import type {
  ActivityEntry,
  ApprovalComment,
  AutomationRule,
  BackupFile,
  BestTimeSlot,
  Calendar,
  Campaign,
  ChecklistTemplate,
  HashtagGroup,
  Idea,
  LocalProfile,
  MediaItem,
  NotificationSettings,
  PerformanceEntry,
  Pillar,
  PlatformConfig,
  Post,
  PostRevision,
  Reminder,
  RuleRun,
  SavedFilter,
  Series,
  Template,
  Workspace,
} from './types';

/** Current schema version. Bump + add a Dexie upgrade step when it changes. */
export const SCHEMA_VERSION = 2;

export interface KvEntry {
  /** `${workspaceId}:${name}` */
  key: string;
  workspaceId: string;
  value: unknown;
}

export class SocialCalendarDB extends Dexie {
  profiles!: Table<LocalProfile, string>;
  workspaces!: Table<Workspace, string>;
  calendars!: Table<Calendar, string>;
  posts!: Table<Post, string>;
  media!: Table<MediaItem, string>;
  campaigns!: Table<Campaign, string>;
  pillars!: Table<Pillar, string>;
  hashtagGroups!: Table<HashtagGroup, string>;
  templates!: Table<Template, string>;
  ideas!: Table<Idea, string>;
  checklistTemplates!: Table<ChecklistTemplate, string>;
  comments!: Table<ApprovalComment, string>;
  activity!: Table<ActivityEntry, string>;
  performance!: Table<PerformanceEntry, string>;
  reminders!: Table<Reminder, string>;
  notificationSettings!: Table<NotificationSettings, string>;
  platformConfigs!: Table<PlatformConfig, [string, string]>;
  savedFilters!: Table<SavedFilter, string>;
  bestTimeSlots!: Table<BestTimeSlot, string>;
  revisions!: Table<PostRevision, string>;
  rules!: Table<AutomationRule, string>;
  ruleRuns!: Table<RuleRun, string>;
  series!: Table<Series, string>;
  kv!: Table<KvEntry, string>;

  constructor() {
    super('socialcalendar');
    this.version(1).stores({
      profiles: 'id',
      workspaces: 'id, createdAt',
      calendars: 'id, workspaceId',
      posts: 'id, workspaceId, calendarId, status, scheduledAt, campaignId, pillarId',
      media: 'id, workspaceId',
      campaigns: 'id, workspaceId, status',
      pillars: 'id, workspaceId',
      hashtagGroups: 'id, workspaceId',
      templates: 'id, workspaceId, category',
      ideas: 'id, workspaceId',
      checklistTemplates: 'id, workspaceId',
      comments: 'id, workspaceId, postId',
      activity: 'id, workspaceId, createdAt',
      performance: 'id, workspaceId, postId, platformId, date',
      reminders: 'id, workspaceId, postId',
      notificationSettings: 'workspaceId',
      platformConfigs: '[workspaceId+platformId]',
      savedFilters: 'id, workspaceId',
      bestTimeSlots: 'id, workspaceId, platformId',
      revisions: 'id, postId, workspaceId, createdAt',
      rules: 'id, workspaceId',
      ruleRuns: 'id, ruleId, workspaceId',
      series: 'id, workspaceId',
    });
    // v2: generic per-workspace key-value settings (UTM presets, banned
    // hashtag words, UI preferences, onboarding state).
    this.version(2).stores({
      kv: 'key, workspaceId',
    });
  }
}

/** Every table name, used by backup/restore and workspace deletion. */
export const TABLE_NAMES = [
  'profiles',
  'workspaces',
  'calendars',
  'posts',
  'media',
  'campaigns',
  'pillars',
  'hashtagGroups',
  'templates',
  'ideas',
  'checklistTemplates',
  'comments',
  'activity',
  'performance',
  'reminders',
  'notificationSettings',
  'platformConfigs',
  'savedFilters',
  'bestTimeSlots',
  'revisions',
  'rules',
  'ruleRuns',
  'series',
  'kv',
] as const;

export type TableName = (typeof TABLE_NAMES)[number];

/** Tables whose rows belong to a workspace (carry a workspaceId field). */
export const WORKSPACE_TABLES: TableName[] = TABLE_NAMES.filter(
  (t) => t !== 'profiles' && t !== 'workspaces',
) as TableName[];

export function isBackupFile(value: unknown): value is BackupFile {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.app === 'socialcalendar' &&
    typeof v.schemaVersion === 'number' &&
    typeof v.exportedAt === 'string' &&
    typeof v.data === 'object' &&
    v.data !== null
  );
}

/**
 * Validate an untrusted backup payload before it touches the database.
 * Returns a list of human-readable problems; empty = valid.
 */
export function validateBackup(value: unknown): string[] {
  const problems: string[] = [];
  if (!isBackupFile(value)) {
    return ['This file is not a Social Media Calendar backup.'];
  }
  if (value.schemaVersion > SCHEMA_VERSION) {
    problems.push(
      `Backup schema version ${value.schemaVersion} is newer than this app supports (${SCHEMA_VERSION}). Update the app first.`,
    );
  }
  for (const key of Object.keys(value.data)) {
    if (!(TABLE_NAMES as readonly string[]).includes(key)) {
      problems.push(`Unknown table in backup: ${key}`);
    }
    if (!Array.isArray(value.data[key])) {
      problems.push(`Backup table ${key} is not a list.`);
    }
  }
  return problems;
}
