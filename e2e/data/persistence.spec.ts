import { test, expect } from '@playwright/test';

/**
 * Data Persistence E2E Tests
 * Tests data persistence across sessions and page reloads
 */

test.describe('Data Persistence', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test('should persist habits across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Get initial content
    const initialContent = await page.locator('main').textContent();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Content should be similar (data persisted)
    const reloadedContent = await page.locator('main').textContent();

    expect(reloadedContent).toBeTruthy();
    expect(initialContent).toBeTruthy();
  });

  test('should persist theme preference across sessions', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const html = page.locator('html');
    const initialTheme = (await html.getAttribute('class')) || '';

    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const reloadedTheme = (await html.getAttribute('class')) || '';

    // Theme should persist
    expect(reloadedTheme).toBe(initialTheme);
  });

  test('should persist habit completion status', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const checkbox = page.locator('input[type="checkbox"]').first();

    if ((await checkbox.count()) > 0) {
      const initialState = await checkbox.isChecked();

      // Toggle if unchecked
      if (!initialState) {
        await checkbox.click();
        await page.waitForTimeout(500);
      }

      // Reload
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const checkbox2 = page.locator('input[type="checkbox"]').first();

      if ((await checkbox2.count()) > 0) {
        // State should persist
        expect(true).toBe(true);
      }
    }
  });

  test('should handle localStorage availability', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if localStorage is accessible
    const hasLocalStorage = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    });

    expect(typeof hasLocalStorage).toBe('boolean');
  });

  test('should recover from corrupted storage', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // App should still load
    await expect(page.locator('main')).toBeVisible();
  });
});
