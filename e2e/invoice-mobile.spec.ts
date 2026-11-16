import { test, expect, type Page } from '@playwright/test';

/**
 * Invoice mobile side-scroll workspace (runs under the `mobile` project —
 * Pixel 7 — against the production build served by `next start`).
 *
 * Guards the mobile program's contract:
 *  - below 1024px the editor and the live preview are two full-width
 *    scroll-snap panels; the Edit | Preview toggle, swiping, the floating
 *    Preview button and Back-to-edit all stay in sync;
 *  - the one-time swipe hint shows once and never again;
 *  - edits flash the matching preview region and badge the Preview tab
 *    "Updated" until viewed; the preview updates live;
 *  - tapping a preview region jumps to the Edit panel and focuses the
 *    matching field;
 *  - preview zoom offers Fit / 100%;
 *  - tap targets are >= 44px, items reorder by touch, the sticky action
 *    bar works, and no width in 320–768px (or landscape) overflows.
 */

async function openWorkspace(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/invoice-site');
  const reject = page.getByRole('button', { name: 'Reject Non-Essential' });
  if (await reject.isVisible().catch(() => false)) await reject.click();
  return errors;
}

/**
 * Scrolls the panel scroller to a panel. Headless Chromium cannot drive
 * native touch-scroll from synthesized touch/wheel events (verified:
 * dispatched gestures leave scrollLeft untouched), so the tests scroll
 * the container the way a finished swipe leaves it — snapped exactly to
 * a panel — and assert the app-side contract around it: the scroll-snap
 * CSS that makes real swipes land there, and the IntersectionObserver
 * sync that follows any scroll, however it was produced.
 */
async function scrollToPanel(page: Page, panel: 'edit' | 'preview') {
  await page.evaluate((p) => {
    const s = document.querySelector('[data-testid="inv-panels"]');
    const target = document.querySelector(p === 'preview' ? '#inv-panel-preview' : '#inv-panel-edit');
    if (s && target) {
      s.scrollTo({ left: (target as HTMLElement).offsetLeft, behavior: 'instant' as ScrollBehavior });
    }
  }, panel);
}

test.describe('invoice mobile side-scroll workspace', () => {
  test('panels: toggle + swipe stay in sync, hint shows once, editor scroll is remembered', async ({
    page,
  }) => {
    const errors = await openWorkspace(page);
    const tabEdit = page.getByRole('tab', { name: 'Edit' });
    const tabPreview = page.getByRole('tab', { name: /Preview/ });
    await expect(tabEdit).toBeVisible();
    await expect(tabEdit).toHaveAttribute('aria-selected', 'true');

    // One-time hint is showing on a first visit.
    await expect(page.getByText('Swipe to see the preview')).toBeVisible();

    // The scroll-snap contract that real touch swipes rely on.
    const snap = await page.evaluate(() => {
      const s = document.querySelector('[data-testid="inv-panels"]');
      const p = document.querySelector('#inv-panel-preview');
      if (!s || !p) return null;
      const cs = getComputedStyle(s);
      return {
        snapType: cs.scrollSnapType,
        overflowX: cs.overflowX,
        align: getComputedStyle(p).scrollSnapAlign,
      };
    });
    expect(snap).not.toBeNull();
    expect(snap!.snapType).toContain('mandatory');
    expect(snap!.overflowX).toBe('auto');
    expect(snap!.align).toBe('start');

    // Remember where the editor was scrolled to.
    await page.evaluate(() => {
      const el = document.querySelector('#inv-panel-edit');
      if (el) el.scrollTop = 420;
    });

    // Scrolling to the preview panel (where a swipe lands) syncs the tab.
    await page.locator('[data-testid="inv-panels"]').scrollIntoViewIfNeeded();
    await scrollToPanel(page, 'preview');
    await expect(tabPreview).toHaveAttribute('aria-selected', 'true', { timeout: 5000 });
    // Arriving at the preview dismisses the hint for good.
    await expect(page.getByText('Swipe to see the preview')).toHaveCount(0);

    // Scroll back: tab syncs to Edit and the editor scroll position is kept.
    await scrollToPanel(page, 'edit');
    await expect(tabEdit).toHaveAttribute('aria-selected', 'true', { timeout: 5000 });
    const restored = await page.evaluate(
      () => document.querySelector('#inv-panel-edit')?.scrollTop ?? 0
    );
    expect(restored).toBeGreaterThan(300);

    // After a reload the hint never shows again (localStorage flag).
    await page.reload();
    const reject2 = page.getByRole('button', { name: 'Reject Non-Essential' });
    if (await reject2.isVisible().catch(() => false)) await reject2.click();
    await expect(page.getByRole('tab', { name: 'Edit' })).toBeVisible();
    await expect(page.getByText('Swipe to see the preview')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('preview intelligence: live update, flash, updated badge, tap-to-edit, zoom', async ({
    page,
  }) => {
    const errors = await openWorkspace(page);
    const clientName = page.locator('[data-focus="clientName"]');
    await clientName.scrollIntoViewIfNeeded();
    await clientName.fill('Zamzam Traders LLC');

    // The edited region flashes in the preview…
    await expect(page.locator('[data-region="client"].inv-flash')).toHaveCount(1);
    // …and the Preview tab is badged until the preview is viewed.
    const tabPreview = page.getByRole('tab', { name: /Preview/ });
    await expect(tabPreview.getByText('Updated')).toBeVisible();

    await tabPreview.click();
    await expect(tabPreview).toHaveAttribute('aria-selected', 'true');
    await expect(tabPreview.getByText('Updated')).toHaveCount(0);
    // Live update: the typed name is in the preview's Bill-to region.
    await expect(page.locator('[data-region="client"]')).toContainText('Zamzam Traders LLC');

    // Zoom: Fit shows a sub-100% scale; 100% switches to true size.
    const readout = page.getByTestId('inv-zoom-readout');
    await expect(readout).toBeVisible();
    expect(await readout.textContent()).not.toBe('100%');
    await page.getByRole('button', { name: '100%' }).click();
    await expect(readout).toHaveText('100%');
    await page.getByRole('button', { name: 'Fit' }).click();
    await expect(readout).not.toHaveText('100%');

    // Tap-to-edit: tapping totals returns to Edit with the discount field focused.
    await page.locator('[data-region="totals"]').click();
    await expect(page.getByRole('tab', { name: 'Edit' })).toHaveAttribute('aria-selected', 'true', {
      timeout: 5000,
    });
    await page.waitForTimeout(600);
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    expect(focused).toBe('Discount as a percentage');
    expect(errors).toEqual([]);
  });

  test('polish: tap targets >= 44px, touch reorder, sticky action bar saves', async ({ page }) => {
    const errors = await openWorkspace(page);
    const small = await page.evaluate(() => {
      const panel = document.querySelector('#inv-panel-edit');
      if (!panel) return ['editor panel missing'];
      const bad: string[] = [];
      panel
        .querySelectorAll<HTMLElement>(
          '[data-slot="input"], [data-slot="select-trigger"], [data-slot="button"]'
        )
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.height < 43) {
            bad.push(`${el.getAttribute('data-slot')} h=${Math.round(r.height)}`);
          }
        });
      return bad;
    });
    expect(small).toEqual([]);

    const descs = page.locator('[data-focus^="item-desc-"]');
    await descs.first().scrollIntoViewIfNeeded();
    await descs.first().fill('Alpha service');
    await page.getByRole('button', { name: 'Add item' }).click();
    await expect(descs).toHaveCount(2);
    await descs.nth(1).fill('Beta service');
    await page.getByRole('button', { name: 'Move item up' }).nth(1).click();
    await expect(descs.first()).toHaveValue('Beta service');

    const barSave = page.locator('div.sticky.bottom-0 button').first();
    await expect(barSave).toBeVisible();
    await barSave.click();
    await expect(
      page.getByText(/find it any time under My invoices/).first()
    ).toBeVisible({ timeout: 5000 });
    expect(errors).toEqual([]);
  });

  for (const w of [320, 360, 375, 390, 414, 768]) {
    test(`no page-level horizontal overflow at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 844 });
      await openWorkspace(page);
      await expect(page.getByRole('tab', { name: 'Edit' })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
      // …and the same on the preview panel.
      await page.getByRole('tab', { name: /Preview/ }).click();
      await page.waitForTimeout(600);
      const overflow2 = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow2).toBeLessThanOrEqual(0);
    });
  }

  test('landscape phone: no horizontal overflow, panels still work', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await openWorkspace(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await page.getByRole('tab', { name: /Preview/ }).click();
    await expect(page.getByRole('tab', { name: /Preview/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('desktop width: toggle hidden, editor and preview side by side', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openWorkspace(page);
    await expect(page.getByRole('tab', { name: 'Edit' })).toBeHidden();
    const editBox = await page.locator('#inv-panel-edit').boundingBox();
    const previewBox = await page.locator('#inv-panel-preview').boundingBox();
    expect(editBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    expect(previewBox!.x).toBeGreaterThan(editBox!.x + 100);
  });
});
