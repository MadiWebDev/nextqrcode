import { NextResponse } from 'next/server';

/**
 * PWA manifest for the Social Media Calendar app
 * (socialcalendar.freeqrcode.tools). Served from the app root because
 * the subdomain proxy exempts extensioned paths from rewriting.
 */
export function GET() {
  return NextResponse.json(
    {
      name: 'Social Media Calendar',
      short_name: 'SocialCal',
      description:
        'Plan social media content with a free, privacy-first calendar. Everything is stored locally in your browser.',
      id: 'https://socialcalendar.freeqrcode.tools/app',
      start_url: 'https://socialcalendar.freeqrcode.tools/app',
      scope: 'https://socialcalendar.freeqrcode.tools/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0284c7',
      icons: [
        { src: '/socialcalendar-icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/socialcalendar-icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/socialcalendar-logo.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}
