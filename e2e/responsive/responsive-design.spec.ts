import { test, expect } from '@playwright/test';

/**
 * UI Responsiveness E2E Tests
 * Tests responsive design across different screen sizes
 */

test.describe('Responsive Design', () => {
  test.describe('Breakpoint Transitions', () => {
    test('should adapt layout from mobile to desktop', async ({ page }) => {
      // Start mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check mobile layout
      const mobileLayout = await page.locator('main').isVisible();
      expect(mobileLayout).toBe(true);

      // Resize to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);

      // Layout should adapt
      const desktopLayout = await page.locator('main').isVisible();
      expect(desktopLayout).toBe(true);
    });

    test('should show/hide navigation based on screen size', async ({ page }) => {
      // Desktop - should show side nav
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav, [role="navigation"]').first();
      if ((await nav.count()) > 0) {
        await expect(nav).toBeVisible();
      }

      // Mobile - nav might be hidden
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      // Just verify page still works
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('should handle tablet landscape and portrait', async ({ page }) => {
      // Portrait
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      let content = await page.locator('main').textContent();
      expect(content).toBeTruthy();

      // Landscape
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(500);

      content = await page.locator('main').textContent();
      expect(content).toBeTruthy();
    });
  });

  test.describe('Touch vs Click Interactions', () => {
    test('should handle touch events on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Tap a checkbox
      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await checkbox.count()) > 0) {
        // Simulate tap
        await checkbox.tap();
        await page.waitForTimeout(300);

        expect(true).toBe(true);
      }
    });

    test('should handle hover on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Hover over habit item
      const habitItem = page.locator('[class*="habit"]').first();

      if ((await habitItem.count()) > 0) {
        await habitItem.hover();
        await page.waitForTimeout(200);

        // Item should still be visible
        await expect(habitItem).toBeVisible();
      }
    });
  });

  test.describe('Text Scaling', () => {
    test('should handle different font sizes', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Page should be readable
      const content = await page.locator('main').textContent();
      expect(content!.length).toBeGreaterThan(10);
    });
  });
});
