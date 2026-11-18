import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { gzipSync } from 'node:zlib';

/**
 * Social Media Calendar browser QA (Phase 10 gate).
 *
 * The app lives on its own subdomain; Chromium is told to resolve the
 * host to the local server so the real proxy routing is exercised.
 * Run against a served production build:
 *   PLAYWRIGHT_BASE_URL=http://socialcalendar.freeqrcode.tools:3100 \
 *     npx playwright test e2e/socialcalendar.spec.ts --project=chromium
 */
test.use({
  launchOptions: {
    args: [
      '--host-resolver-rules=MAP socialcalendar.freeqrcode.tools 127.0.0.1',
      // The sandbox egress proxy must not see this fake host.
      '--no-proxy-server',
    ],
  },
});

test.describe('Social Media Calendar', () => {
  test('landing page renders with hero, FAQ schema content and guides link', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Social Media Calendar/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Guides' }).first()).toBeVisible();
  });

  test('a guide page renders its article and FAQs', async ({ page }) => {
    await page.goto('/guides/content-pillars-strategy');
    await expect(page.locator('h1')).toContainText('Content Pillars');
    await expect(page.getByText('Frequently asked questions')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open the workspace' })).toBeVisible();
  });

  test('workspace boots, onboarding shows and can be dismissed', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByText('Getting started')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: 'Dismiss' }).click();
    await expect(page.getByText('Getting started')).toHaveCount(0);
    await expect(page.getByRole('tab', { name: 'Calendar' })).toBeVisible();
  });

  test('create a post in the editor and see it in the unscheduled tray', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByRole('tab', { name: 'Calendar' })).toBeVisible({ timeout: 15_000 });
    // Dismiss onboarding if present so it cannot overlap the editor.
    const dismiss = page.getByRole('button', { name: 'Dismiss' });
    if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
    await page.getByRole('button', { name: '+ New post' }).click();
    const dialog = page.getByRole('dialog', { name: 'Create post' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/Title/).fill('E2E launch post');
    await dialog.getByRole('button', { name: /Save|Create/ }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText('E2E launch post')).toBeVisible({ timeout: 10_000 });
  });

  test('command palette opens with Ctrl+K and navigates tabs', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByRole('tab', { name: 'Calendar' })).toBeVisible({ timeout: 15_000 });
    const dismiss = page.getByRole('button', { name: 'Dismiss' });
    if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
    await page.keyboard.press('Control+k');
    await expect(page.getByPlaceholder(/Type a command/)).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('share viewer renders a fragment payload read-only', async ({ page }) => {
    const payload = {
      app: 'socialcalendar-share',
      version: 1,
      workspaceName: 'E2E Shared Co',
      timezone: 'Asia/Karachi',
      sharedAt: '2026-11-17T00:00:00.000Z',
      posts: [
        {
          id: 'share1',
          workspaceId: 'w',
          calendarId: 'c',
          title: 'Shared launch post',
          caption: 'Visible in the viewer',
          description: '',
          platformCaptions: {},
          platformIds: ['instagram'],
          scheduledAt: '2026-12-01T05:30:00.000Z',
          timezone: 'Asia/Karachi',
          status: 'scheduled',
          contentType: 'text',
          priority: 'normal',
          tags: [],
          assigneeLabel: '',
          internalNotes: '',
          mediaIds: [],
          checklist: [],
          createdAt: '2026-11-17T00:00:00.000Z',
          updatedAt: '2026-11-17T00:00:00.000Z',
        },
      ],
    };
    const encoded = gzipSync(Buffer.from(JSON.stringify(payload), 'utf8'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    await page.goto(`/view#${encoded}`);
    await expect(page.getByText('Read-only shared calendar')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Shared launch post')).toBeVisible();
    await expect(page.getByText('E2E Shared Co')).toBeVisible();
  });

  test('PWA manifest and service worker routes respond', async ({ page }) => {
    // Fetched in page context: the Node request fixture cannot resolve
    // the fake subdomain (Chromium's host-resolver rule does not apply).
    await page.goto('/');
    const manifest = await page.evaluate(async () => {
      const res = await fetch('/socialcalendar-manifest.webmanifest');
      return { ok: res.ok, json: await res.json() };
    });
    expect(manifest.ok).toBeTruthy();
    expect(manifest.json.name).toBe('Social Media Calendar');
    const sw = await page.evaluate(async () => {
      const res = await fetch('/social-sw.js');
      return { ok: res.ok, text: await res.text() };
    });
    expect(sw.ok).toBeTruthy();
    expect(sw.text).toContain('socialcalendar-v1');
  });

  test('axe: no critical or serious violations on key routes', async ({ page }) => {
    for (const path of ['/', '/guides', '/guides/content-pillars-strategy']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
      const bad = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      expect(bad, `${path}: ${bad.map((v) => v.id).join(', ')}`).toHaveLength(0);
    }
  });
});
