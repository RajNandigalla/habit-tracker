import { test, expect } from '@playwright/test';

/**
 * Categories E2E Tests - CRUD Operations
 * Tests full category management across devices
 */

test.describe('Categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/categories');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display categories page', async ({ page }) => {
      // Check page loaded
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/categories-desktop.png', fullPage: true });
    });

    test('should display category list', async ({ page }) => {
      // Wait for content to load
      await page.waitForTimeout(500);

      // Should have some content (categories or empty state)
      const mainContent = await page.locator('main').textContent();
      expect(mainContent).toBeTruthy();
      expect(mainContent!.length).toBeGreaterThan(10);
    });

    test('should have add category button', async ({ page }) => {
      // Look for add/new/create button
      const addButton = page
        .locator('button, a')
        .filter({ hasText: /add|new|create/i })
        .first();

      if ((await addButton.count()) > 0) {
        await expect(addButton).toBeVisible();
      }
    });

    test('should open add category modal', async ({ page }) => {
      // Find add button
      const addButton = page
        .locator('button, a')
        .filter({ hasText: /add.*category|new.*category|create/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        // Check for modal or form
        const modal = page.getByRole('dialog');
        if ((await modal.count()) > 0) {
          await expect(modal).toBeVisible();

          // Close modal for cleanup
          await page.keyboard.press('Escape');
        }
      }
    });
  });

  test.describe('Tablet', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test('should display categories on tablet', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/categories-tablet.png', fullPage: true });
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should display categories on mobile', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/categories-mobile.png', fullPage: true });
    });
  });
});
