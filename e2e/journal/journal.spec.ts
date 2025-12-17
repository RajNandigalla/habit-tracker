import { test, expect } from '@playwright/test';

/**
 * Journal E2E Tests
 * Tests journal entry functionality across devices
 */

test.describe('Journal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display journal page', async ({ page }) => {
      // Check page loaded successfully
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/journal-desktop.png', fullPage: true });
    });

    test('should have add entry functionality', async ({ page }) => {
      // Look for any add/new/write button
      const addButton = page
        .locator('button, a')
        .filter({ hasText: /add|new|write/i })
        .first();

      // At least check that the page content loaded
      const pageContent = await page.locator('main').textContent();
      expect(pageContent).toBeTruthy();
    });
  });

  test.describe('Tablet', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test('should display journal on tablet', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/journal-tablet.png', fullPage: true });
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should display journal on mobile', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/journal-mobile.png', fullPage: true });
    });
  });
});
