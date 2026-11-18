# Platform Specifications — Provenance

The registry in `src/app/socialcalendar-site/_lib/platforms.ts` covers
15 platforms: Instagram, Facebook, TikTok, YouTube, YouTube Shorts,
LinkedIn, X, Pinterest, Threads, Reddit, Telegram, Bluesky, Google
Business Profile, Snapchat and WhatsApp Status.

- `PLATFORM_SPECS_REVIEWED = '2026-11-17'` — the date the values were
  compiled from the platforms' public documentation and widely
  published limits.
- Values are **guidance for planning** (caption limits, weighted
  counting rules such as X's URL=23 / emoji=2, image and video sizes,
  hashtag guidance). They are labelled as guidance in the UI, never as
  live-verified facts, because platforms change limits without notice
  and some vary by account tier.
- Users can override the character limit per platform per workspace
  (Platform specs panel → PlatformConfig.customCharLimit); the post
  editor's counters enforce the user's value when one is set.
- When re-verifying: check each platform's official help/developer
  pages, update the registry and the review date together, and note
  the change in DECISIONS.md.
