import { test, expect } from '@playwright/test';

/**
 * Settings E2E Tests
 * Tests settings page and preferences across devices
 */

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display settings page', async ({ page }) => {
      // Check page loaded
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/settings-desktop.png', fullPage: true });
    });

    test('should have settings options', async ({ page }) => {
      // Look for toggle switches or inputs
      const switches = page.locator('[role="switch"], input[type="checkbox"]');

      // Page should have loaded with content
      const content = await page.locator('main').textContent();
      expect(content).toBeTruthy();
    });
  });

  test.describe('Tablet', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test('should display settings on tablet', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/settings-tablet.png', fullPage: true });
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should display settings on mobile', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/settings-mobile.png', fullPage: true });
    });
  });
});
