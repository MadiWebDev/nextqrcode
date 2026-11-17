/**
 * Platform specification registry (spec §14).
 *
 * A typed, versioned snapshot of widely published platform limits and
 * creative sizes, compiled on PLATFORM_SPECS_REVIEWED. These values are
 * GUIDANCE for planning and validation in the UI — platforms change
 * their limits without notice, and nothing here is live-verified
 * against a platform API. Users can override a character limit per
 * workspace (see PlatformConfig in types.ts).
 */

import type { ContentType } from './types';

export interface ImageSpec {
  label: string;
  width: number;
  height: number;
}

export interface VideoSpec {
  label: string;
  width: number;
  height: number;
  maxDurationSec: number;
}

export interface PlatformSpec {
  id: string;
  name: string;
  /** Brand colour used for chips/dots in the UI (hex). */
  color: string;
  /**
   * Guidance character limit for a caption/post. 0 means the platform
   * is visual-first and has no caption field in this sense (any text
   * is overlaid on the media itself).
   */
  charLimit: number;
  /** Weighted length a URL counts as, or null when a URL counts at its real length. */
  urlCountsAs: number | null;
  /** Weighted cost of one emoji (2 on X, 1 everywhere else). */
  emojiWeight: number;
  hashtagGuidance: string;
  /** Recommended maximum hashtag count; exceeding it is a warning, not an error. */
  maxHashtagsGuidance: number;
  imageSpecs: ImageSpec[];
  videoSpecs: VideoSpec[];
  contentTypes: ContentType[];
  /** Honest guidance notes — never a claim of live verification. */
  notes: string;
}

export const PLATFORM_SPECS_VERSION = 1;

/** Date this registry was compiled (yyyy-mm-dd); shown in the UI as guidance provenance. */
export const PLATFORM_SPECS_REVIEWED = '2026-11-17';

export const PLATFORMS: PlatformSpec[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    charLimit: 2200,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Use a focused set of relevant hashtags; up to 30 are accepted as guidance.',
    maxHashtagsGuidance: 10,
    imageSpecs: [
      { label: 'Feed portrait', width: 1080, height: 1350 },
      { label: 'Feed square', width: 1080, height: 1080 },
      { label: 'Feed landscape', width: 1080, height: 566 },
      { label: 'Story / Reel cover', width: 1080, height: 1920 },
    ],
    videoSpecs: [
      { label: 'Reel', width: 1080, height: 1920, maxDurationSec: 90 },
      { label: 'Feed video', width: 1080, height: 1350, maxDurationSec: 60 },
      { label: 'Story video', width: 1080, height: 1920, maxDurationSec: 60 },
    ],
    contentTypes: ['image', 'carousel', 'video', 'reel', 'story', 'live'],
    notes:
      'Caption guidance limit is 2,200 characters. Links in captions are not clickable; point readers to the bio link or a story link sticker instead.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    charLimit: 5000,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'One to three hashtags is plenty; Facebook discovery is driven more by shares and comments.',
    maxHashtagsGuidance: 3,
    imageSpecs: [
      { label: 'Shared image / link image', width: 1200, height: 630 },
      { label: 'Square post', width: 1080, height: 1080 },
      { label: 'Story', width: 1080, height: 1920 },
    ],
    videoSpecs: [
      { label: 'Landscape video', width: 1920, height: 1080, maxDurationSec: 14400 },
      { label: 'Square video', width: 1080, height: 1080, maxDurationSec: 14400 },
      { label: 'Reel', width: 1080, height: 1920, maxDurationSec: 90 },
    ],
    contentTypes: ['image', 'carousel', 'video', 'reel', 'story', 'text', 'link', 'poll', 'live', 'event'],
    notes:
      'Facebook technically allows far longer posts (around 63,206 characters); 5,000 is used here as a practical guidance limit because engagement drops long before that.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#161823',
    charLimit: 2200,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Three to five targeted hashtags; mix one broad tag with niche tags.',
    maxHashtagsGuidance: 5,
    imageSpecs: [{ label: 'Photo mode', width: 1080, height: 1920 }],
    videoSpecs: [
      { label: 'Vertical video', width: 1080, height: 1920, maxDurationSec: 600 },
      { label: 'Landscape video', width: 1920, height: 1080, maxDurationSec: 600 },
    ],
    contentTypes: ['video', 'image', 'carousel', 'live'],
    notes:
      'Vertical 9:16 video is the native format. Caption guidance limit is 2,200 characters including hashtags; keep the hook in the first line and on screen.',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    charLimit: 5000,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Up to three hashtags in the description; the first ones may appear above the title.',
    maxHashtagsGuidance: 3,
    imageSpecs: [
      { label: 'Video thumbnail', width: 1280, height: 720 },
      { label: 'Community post image', width: 1080, height: 1080 },
    ],
    videoSpecs: [{ label: 'Landscape video', width: 1920, height: 1080, maxDurationSec: 43200 }],
    contentTypes: ['video', 'live', 'poll', 'image', 'text'],
    notes:
      'The 5,000-character guidance limit is for the video description; titles are limited separately to about 100 characters, so plan the title on its own line.',
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts',
    color: '#FF0033',
    charLimit: 5000,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'One to three hashtags; include #Shorts only if it fits the content honestly.',
    maxHashtagsGuidance: 3,
    imageSpecs: [{ label: 'Short thumbnail frame', width: 1080, height: 1920 }],
    videoSpecs: [{ label: 'Short', width: 1080, height: 1920, maxDurationSec: 60 }],
    contentTypes: ['short', 'video'],
    notes:
      'Shorts are vertical 9:16 and classically up to 60 seconds (longer Shorts have been rolling out as guidance changes). The 5,000-character guidance limit is the description; keep the Short title itself to about 100 characters.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    charLimit: 3000,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Three to five professional hashtags at the end of the post.',
    maxHashtagsGuidance: 5,
    imageSpecs: [
      { label: 'Shared image / link image', width: 1200, height: 627 },
      { label: 'Square post', width: 1080, height: 1080 },
      { label: 'Article cover', width: 1200, height: 644 },
    ],
    videoSpecs: [{ label: 'Landscape video', width: 1920, height: 1080, maxDurationSec: 600 }],
    contentTypes: ['image', 'carousel', 'video', 'text', 'link', 'poll', 'event', 'live'],
    notes:
      'Post guidance limit is 3,000 characters. The first couple of lines decide whether readers expand the post, so lead with the point, not the preamble.',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    color: '#14171A',
    charLimit: 280,
    urlCountsAs: 23,
    emojiWeight: 2,
    hashtagGuidance: 'One or two hashtags at most; more reads as spam on X.',
    maxHashtagsGuidance: 2,
    imageSpecs: [
      { label: 'In-stream image', width: 1600, height: 900 },
      { label: 'Square image', width: 1080, height: 1080 },
    ],
    videoSpecs: [{ label: 'Landscape video', width: 1920, height: 1080, maxDurationSec: 140 }],
    contentTypes: ['text', 'image', 'video', 'link', 'poll', 'live'],
    notes:
      '280 weighted characters on standard accounts: every URL counts as 23 characters regardless of its real length, and each emoji counts as 2. Paid tiers allow longer posts; this registry uses the standard guidance limit.',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#E60023',
    charLimit: 500,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Hashtags are not a primary discovery tool on Pinterest; spend the characters on searchable description keywords instead.',
    maxHashtagsGuidance: 10,
    imageSpecs: [
      { label: 'Standard Pin (2:3)', width: 1000, height: 1500 },
      { label: 'Square Pin', width: 1000, height: 1000 },
    ],
    videoSpecs: [{ label: 'Video Pin', width: 1080, height: 1920, maxDurationSec: 900 }],
    contentTypes: ['image', 'video', 'link'],
    notes:
      'The 500-character guidance limit covers the Pin description; Pin titles are limited separately to about 100 characters. The 2:3 portrait ratio is the classic feed-friendly size.',
  },
  {
    id: 'threads',
    name: 'Threads',
    color: '#333333',
    charLimit: 500,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Threads uses a single topic tag per post rather than hashtag lists; keep extra tags minimal.',
    maxHashtagsGuidance: 5,
    imageSpecs: [
      { label: 'Portrait post', width: 1080, height: 1350 },
      { label: 'Square post', width: 1080, height: 1080 },
    ],
    videoSpecs: [{ label: 'Vertical video', width: 1080, height: 1920, maxDurationSec: 300 }],
    contentTypes: ['text', 'image', 'carousel', 'video', 'link', 'poll'],
    notes: 'Post guidance limit is 500 characters. Longer ideas belong in a chained thread of connected posts.',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    color: '#FFFC00',
    charLimit: 0,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Hashtags are not a discovery feature here; keep any overlaid text short and legible.',
    maxHashtagsGuidance: 0,
    imageSpecs: [{ label: 'Snap / Story', width: 1080, height: 1920 }],
    videoSpecs: [{ label: 'Snap / Story video', width: 1080, height: 1920, maxDurationSec: 60 }],
    contentTypes: ['image', 'video', 'story'],
    notes:
      'Visual-first: there is no caption field in this sense, so the character limit is 0. Any text is overlaid on the photo or video itself — keep it brief and inside the safe zones away from the top and bottom UI.',
  },
  {
    id: 'whatsapp-status',
    name: 'WhatsApp Status',
    color: '#25D366',
    charLimit: 0,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Hashtags do not work in Status; use plain overlaid text and, for broadcasts, a normal message for links.',
    maxHashtagsGuidance: 0,
    imageSpecs: [{ label: 'Status image', width: 1080, height: 1920 }],
    videoSpecs: [{ label: 'Status video', width: 1080, height: 1920, maxDurationSec: 60 }],
    contentTypes: ['image', 'video', 'story', 'text'],
    notes:
      'Visual-first: Status has no caption field in this sense, so the character limit is 0. Text is overlaid on the media (or posted as a text status) and disappears after 24 hours as guidance stands.',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    charLimit: 300,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Hashtags do not work on Reddit; use the subreddit, its flair, and a clear title instead.',
    maxHashtagsGuidance: 0,
    imageSpecs: [
      { label: 'Image post', width: 1080, height: 1080 },
      { label: 'Link / preview image', width: 1200, height: 628 },
    ],
    videoSpecs: [{ label: 'Native video', width: 1920, height: 1080, maxDurationSec: 900 }],
    contentTypes: ['text', 'image', 'video', 'link', 'poll'],
    notes:
      'The 300-character guidance limit is the post TITLE limit; text-post bodies allow far more (around 40,000 characters as guidance). Each subreddit has its own rules — check them before posting, and disclose self-promotion.',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#229ED9',
    charLimit: 4096,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'A few hashtags help channel search; two or three is a sensible ceiling.',
    maxHashtagsGuidance: 3,
    imageSpecs: [{ label: 'Photo post', width: 1280, height: 960 }],
    videoSpecs: [{ label: 'Video post', width: 1920, height: 1080, maxDurationSec: 3600 }],
    contentTypes: ['text', 'image', 'video', 'link', 'poll', 'announcement'],
    notes:
      'Message guidance limit is 4,096 characters. Media captions are much shorter (about 1,024 characters as guidance, more on Premium), so long copy belongs in a text message with the media attached or linked.',
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    color: '#0085FF',
    charLimit: 300,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'One to three hashtags; they are clickable and searchable on Bluesky.',
    maxHashtagsGuidance: 3,
    imageSpecs: [
      { label: 'Post image', width: 1200, height: 630 },
      { label: 'Square image', width: 1080, height: 1080 },
    ],
    videoSpecs: [{ label: 'Post video', width: 1920, height: 1080, maxDurationSec: 180 }],
    contentTypes: ['text', 'image', 'video', 'link'],
    notes:
      'Post guidance limit is 300 graphemes. Always add alt text to images — it is a strong community norm on Bluesky and an accessibility requirement in this app.',
  },
  {
    id: 'google-business',
    name: 'Google Business Profile',
    color: '#4285F4',
    charLimit: 1500,
    urlCountsAs: null,
    emojiWeight: 1,
    hashtagGuidance: 'Hashtags do not help Google Business posts; spend the space on the offer, location keywords, and a call to action.',
    maxHashtagsGuidance: 3,
    imageSpecs: [
      { label: 'Post image (4:3)', width: 1200, height: 900 },
      { label: 'Square image', width: 1080, height: 1080 },
    ],
    videoSpecs: [{ label: 'Post video', width: 1920, height: 1080, maxDurationSec: 30 }],
    contentTypes: ['image', 'video', 'text', 'link', 'event', 'announcement'],
    notes:
      'Post guidance limit is 1,500 characters, but only the first lines show in search results — put the offer and call to action first and use the built-in action button for links.',
  },
];

export const PLATFORM_IDS: string[] = PLATFORMS.map((p) => p.id);

const BY_ID = new Map<string, PlatformSpec>(PLATFORMS.map((p) => [p.id, p]));

export function getPlatform(id: string): PlatformSpec | undefined {
  return BY_ID.get(id);
}
