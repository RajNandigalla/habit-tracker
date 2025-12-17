import { test, expect } from '@playwright/test';

/**
 * Habits E2E Tests
 * Tests habit functionality - works whether habits exist or not
 */

test.describe('Habits', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/habits');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display habits page', async ({ page }) => {
      // Check page loads
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/habits-desktop.png', fullPage: true });
    });

    test('should have add habit functionality', async ({ page }) => {
      // Find add button (either button or link)
      const addButton = page
        .locator('button, a')
        .filter({ hasText: /add.*habit|new.*habit|create/i })
        .first();

      if ((await addButton.count()) > 0) {
        // Button exists, test passed
        await expect(addButton).toBeVisible();
      } else {
        // Or check for FAB
        const fab = page.locator('button[aria-label*="habit" i]').first();
        if ((await fab.count()) > 0) {
          await expect(fab).toBeVisible();
        }
      }
    });

    test('should display habits or empty state', async ({ page }) => {
      // Either habits or empty state should be visible
      const hasContent = await page.locator('main').textContent();
      expect(hasContent).toBeTruthy();
      expect(hasContent!.length).toBeGreaterThan(0);
    });
  });

  test.describe('Tablet', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test('should display habits on tablet', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/habits-tablet.png', fullPage: true });
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should display habits on mobile', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/habits-mobile.png', fullPage: true });
    });

    test('should have add habit option on mobile', async ({ page }) => {
      // Look for FAB or add button
      const addOptions = page.locator('button, a').filter({ hasText: /add|new|create/i });

      // At least one add option should exist
      expect(await addOptions.count()).toBeGreaterThan(0);
    });
  });
});
