import { test, expect } from '@playwright/test';

/**
 * Progress Page E2E Tests
 * Tests progress tracking and statistics display
 */

test.describe('Progress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display progress page', async ({ page }) => {
      // Check page loaded
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/progress-desktop.png', fullPage: true });
    });

    test('should show statistics or empty state', async ({ page }) => {
      // Wait for content
      await page.waitForTimeout(1000);

      // Should have some content
      const content = await page.locator('main').textContent();
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(10);
    });

    test('should have interactive elements', async ({ page }) => {
      // Look for any interactive elements (buttons, filters, etc.)
      const interactive = page.locator('button, a, select, input');

      // Should have some interactive elements
      const count = await interactive.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Tablet', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test('should display progress on tablet', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/progress-tablet.png', fullPage: true });
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should display progress on mobile', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: 'test-results/progress-mobile.png', fullPage: true });
    });
  });
});
