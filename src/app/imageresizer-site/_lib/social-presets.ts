/**
 * Social media image size presets. Dimensions are the platforms' own
 * published upload recommendations, reviewed 2026-11-13 against each
 * platform's help documentation. Platforms change specs — every value here
 * is a *starting point* the user can adjust, and the UI shows the review
 * date honestly.
 */

export interface SocialPreset {
  label: string;
  width: number;
  height: number;
  note?: string;
}

export interface SocialPlatform {
  id: string;
  label: string;
  presets: SocialPreset[];
}

export const SOCIAL_PRESETS_REVIEWED_AT = '2026-11-13';

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    presets: [
      { label: 'Profile photo', width: 320, height: 320 },
      { label: 'Post — square', width: 1080, height: 1080 },
      { label: 'Post — portrait', width: 1080, height: 1350, note: '4:5, the largest feed footprint' },
      { label: 'Post — landscape', width: 1080, height: 566 },
      { label: 'Story / Reel cover', width: 1080, height: 1920 },
    ],
  },
  {
    id: 'facebook',
    label: 'Facebook',
    presets: [
      { label: 'Profile photo', width: 720, height: 720 },
      { label: 'Post / link image', width: 1200, height: 630 },
      { label: 'Page cover', width: 1640, height: 924, note: 'Displays at 851×315 desktop; keep text centred' },
      { label: 'Event cover', width: 1920, height: 1005 },
      { label: 'Group cover', width: 1640, height: 856 },
    ],
  },
  {
    id: 'youtube',
    label: 'YouTube',
    presets: [
      { label: 'Video thumbnail', width: 1280, height: 720 },
      { label: 'Channel banner', width: 2560, height: 1440, note: 'Keep key content in the centre 1546×423 safe area' },
      { label: 'Channel profile', width: 800, height: 800 },
    ],
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    presets: [
      { label: 'Video / photo post', width: 1080, height: 1920 },
      { label: 'Profile photo', width: 200, height: 200 },
    ],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    presets: [
      { label: 'Profile photo', width: 400, height: 400 },
      { label: 'Post image', width: 1200, height: 627 },
      { label: 'Personal background', width: 1584, height: 396 },
      { label: 'Company page cover', width: 1128, height: 191 },
    ],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    presets: [
      { label: 'Pin (2:3)', width: 1000, height: 1500 },
      { label: 'Square pin', width: 1000, height: 1000 },
      { label: 'Profile photo', width: 165, height: 165 },
    ],
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    presets: [
      { label: 'Profile photo', width: 400, height: 400 },
      { label: 'Header', width: 1500, height: 500 },
      { label: 'Post image', width: 1600, height: 900 },
    ],
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    presets: [
      { label: 'Profile photo', width: 640, height: 640 },
      { label: 'Status', width: 1080, height: 1920 },
    ],
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    presets: [{ label: 'Story / Snap', width: 1080, height: 1920 }],
  },
  {
    id: 'telegram',
    label: 'Telegram',
    presets: [{ label: 'Profile photo', width: 512, height: 512 }],
  },
  {
    id: 'discord',
    label: 'Discord',
    presets: [
      { label: 'Avatar', width: 128, height: 128 },
      { label: 'Server banner', width: 960, height: 540 },
    ],
  },
  {
    id: 'reddit',
    label: 'Reddit',
    presets: [
      { label: 'Community icon', width: 256, height: 256 },
      { label: 'Profile banner', width: 4000, height: 128 },
      { label: 'Post image', width: 1200, height: 628 },
    ],
  },
  {
    id: 'twitch',
    label: 'Twitch',
    presets: [
      { label: 'Profile picture', width: 800, height: 800 },
      { label: 'Offline banner', width: 1920, height: 1080 },
    ],
  },
  {
    id: 'shopify',
    label: 'Shopify',
    presets: [{ label: 'Product image', width: 2048, height: 2048, note: 'Square keeps zoom and grids consistent' }],
  },
  {
    id: 'etsy',
    label: 'Etsy',
    presets: [{ label: 'Listing image', width: 2700, height: 2025, note: '4:3; Etsy recommends at least 2000px on the short side for zoom' }],
  },
  {
    id: 'amazon',
    label: 'Amazon',
    presets: [{ label: 'Product image', width: 2000, height: 2000, note: 'At least 1000px on the longest side enables zoom' }],
  },
  {
    id: 'google-business',
    label: 'Google Business',
    presets: [{ label: 'Post / photo', width: 1200, height: 900 }],
  },
];
