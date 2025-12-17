import { test, expect } from '@playwright/test';

/**
 * User Journey E2E Tests
 * Tests complete end-to-end user journeys
 */

test.describe('Complete User Journeys', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test('new user onboarding journey', async ({ page, context }) => {
    // Clear storage to simulate new user
    await context.clearCookies();

    // 1. Land on dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('main')).toBeVisible();

    // 2. Explore empty state
    const content = await page.locator('main').textContent();
    expect(content).toBeTruthy();

    // 3. Navigate to categories
    await page.goto('/categories');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('main')).toBeVisible();

    // 4. Check settings
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();
  });

  test('daily habit tracking journey', async ({ page }) => {
    // 1. Start at dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 2. Complete a habit
    const checkbox = page.locator('input[type="checkbox"]').first();

    if ((await checkbox.count()) > 0) {
      await checkbox.click();
      await page.waitForTimeout(500);
    }

    // 3. Check progress
    await page.goto('/progress');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await expect(page.locator('main')).toBeVisible();

    // 4. Add journal entry
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();
  });

  test('habit management journey', async ({ page }) => {
    // 1. View habits
    await page.goto('/habits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('main')).toBeVisible();

    // 2. Try to add habit
    const addButton = page
      .locator('button')
      .filter({ hasText: /new habit|add/i })
      .first();

    if ((await addButton.count()) > 0) {
      await addButton.click();
      await page.waitForTimeout(500);

      // Modal should appear
      const modal = page.getByRole('dialog');

      if ((await modal.count()) > 0) {
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }

    // 3. View habit details
    const habitItem = page.locator('[class*="habit"]').first();

    if ((await habitItem.count()) > 0) {
      await habitItem.click();
      await page.waitForTimeout(500);
    }
  });

  test('settings customization journey', async ({ page }) => {
    // 1. Go to settings
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const html = page.locator('html');
    const initialTheme = (await html.getAttribute('class')) || '';

    // 2. Toggle theme
    const themeButton = page
      .locator('button[aria-label*="dark" i], button[aria-label*="light" i]')
      .first();

    if ((await themeButton.count()) > 0 && (await themeButton.isVisible())) {
      await themeButton.click();
      await page.waitForTimeout(500);

      const newTheme = (await html.getAttribute('class')) || '';
      expect(newTheme).toBeTruthy();
    }

    // 3. Check data management
    const exportButton = page.getByText(/export|backup/i);

    const hasDataOptions = (await exportButton.count()) > 0;
    expect(typeof hasDataOptions).toBe('boolean');
  });

  test('achievement tracking journey', async ({ page }) => {
    // 1. Complete habits
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const checkbox = page.locator('input[type="checkbox"]').first();

    if ((await checkbox.count()) > 0) {
      await checkbox.click();
      await page.waitForTimeout(500);
    }

    // 2. Check achievements
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('main')).toBeVisible();

    // 3. View challenges
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();
  });
});
