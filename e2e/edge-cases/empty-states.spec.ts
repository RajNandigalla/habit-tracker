import { test, expect } from '@playwright/test';

/**
 * Empty States E2E Tests
 * Tests how the app behaves with no data
 */

test.describe('Empty States', () => {
  test.describe('Dashboard Empty State', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should show meaningful content when empty', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Page should always have content (either habits or empty state)
      const mainContent = await page.locator('main').textContent();

      expect(mainContent).toBeTruthy();
      expect(mainContent!.length).toBeGreaterThan(20);
    });

    test('should have call-to-action in empty state', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should have add/create buttons
      const addButtons = page.locator('button, a').filter({ hasText: /add|create|new|start/i });

      expect(await addButtons.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Categories Empty', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should handle categories page gracefully', async ({ page }) => {
      await page.goto('/categories');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Should show content (categories or empty state)
      const content = await page.locator('main').textContent();

      expect(content).toBeTruthy();
    });
  });

  test.describe('Journal Empty', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should handle journal page gracefully', async ({ page }) => {
      await page.goto('/journal');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Should show content (entries or empty state)
      const content = await page.locator('main').textContent();

      expect(content).toBeTruthy();
    });
  });

  test.describe('Progress Empty', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should show progress page even without data', async ({ page }) => {
      await page.goto('/progress');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Should show something (stats or "no data yet" message)
      const content = await page.locator('main').textContent();

      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(10);
    });
  });
});
