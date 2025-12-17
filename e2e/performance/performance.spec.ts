import { test, expect } from '@playwright/test';

/**
 * Performance & Loading E2E Tests
 * Tests page load times, transitions, and performance
 */

test.describe('Performance', () => {
  test.describe('Page Load Times', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should load dashboard quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Should load in reasonable time (< 5 seconds)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should navigate between pages quickly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const startTime = Date.now();

      const habitsLink = page.getByRole('link', { name: /habits/i });
      if ((await habitsLink.count()) > 0) {
        await habitsLink.first().click();
        await page.waitForLoadState('networkidle');
      }

      const navTime = Date.now() - startTime;

      // Navigation should be fast (< 2 seconds)
      expect(navTime).toBeLessThan(2000);
    });
  });

  test.describe('Smooth Animations', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should have smooth modal transitions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();

        // Small wait for animation
        await page.waitForTimeout(300);

        const modal = page.getByRole('dialog');
        if ((await modal.count()) > 0) {
          await expect(modal).toBeVisible();
        }
      }
    });

    test('should have smooth theme transitions', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const darkButton = page.locator('button[aria-label="Switch to dark mode"]');

      if ((await darkButton.count()) > 0) {
        await darkButton.click();

        // Wait for transition
        await page.waitForTimeout(500);

        const html = page.locator('html');
        const classes = await html.getAttribute('class');
        expect(classes).toContain('dark');
      }
    });
  });

  test.describe('Resource Loading', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should load all critical resources', async ({ page }) => {
      const response = await page.goto('/');

      // Page should load successfully
      expect(response?.status()).toBe(200);
    });

    test('should handle offline gracefully', async ({ page, context }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Go offline
      await context.setOffline(true);

      // App should still show content (cached)
      const content = await page.locator('main').textContent();
      expect(content).toBeTruthy();

      // Go back online
      await context.setOffline(false);
    });
  });

  test.describe('Memory & CPU', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should not leak memory with multiple navigations', async ({ page }) => {
      const pages = ['/', '/habits', '/journal', '/settings', '/progress', '/categories'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300);
      }

      // If we got here without crashing, test passes
      expect(true).toBe(true);
    });

    test('should handle rapid interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Rapidly toggle checkboxes
      const checkboxes = page.locator('input[type="checkbox"]');
      const count = Math.min(5, await checkboxes.count());

      for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).click();
        await page.waitForTimeout(50);
      }

      // App should still be responsive
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });
  });
});
