import { test, expect } from '@playwright/test';

/**
 * Cross-Browser Compatibility E2E Tests
 * Tests browser-specific features and compatibility
 */

test.describe('Cross-Browser Compatibility', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test('should work with different viewport sizes', async ({ page }) => {
    // Test at desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();

    // Test at tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await expect(page.locator('main')).toBeVisible();

    // Test at mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(page.locator('main')).toBeVisible();
  });

  test('should handle different color schemes', async ({ page }) => {
    // Test light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();

    // Test dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);

    await expect(page.locator('main')).toBeVisible();
  });

  test('should work offline', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Go offline
    await context.setOffline(true);

    // Page should still be functional
    await expect(page.locator('main')).toBeVisible();

    // Go back online
    await context.setOffline(false);
  });

  test('should handle zoomed viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Zoom in
    await page.evaluate(() => {
      (document.body.style as any).zoom = '150%';
    });

    await page.waitForTimeout(500);

    // App should still be functional
    await expect(page.locator('main')).toBeVisible();
  });

  test('should support browser back/forward', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Go back
    await page.goBack();
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/');

    // Go forward
    await page.goForward();
    await page.waitForTimeout(500);

    expect(page.url()).toContain('settings');
  });
});
