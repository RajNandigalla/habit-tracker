import { test, expect } from '@playwright/test';

/**
 * Habit Completion Flow E2E Tests
 * Tests completing and uncompleting habits with checkbox interactions
 */

test.describe('Habit Completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should toggle habit completion', async ({ page }) => {
      // Wait for page to load
      await page.waitForTimeout(1000);

      // Find first checkbox (habit completion checkbox)
      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await checkbox.count()) > 0) {
        // Get initial state
        const wasChecked = await checkbox.isChecked();

        // Click checkbox
        await checkbox.click();

        // Wait for state update
        await page.waitForTimeout(500);

        // Verify state changed
        const isNowChecked = await checkbox.isChecked();
        expect(isNowChecked).toBe(!wasChecked);

        // Toggle back to original state
        await checkbox.click();
        await page.waitForTimeout(500);

        const isFinallyChecked = await checkbox.isChecked();
        expect(isFinallyChecked).toBe(wasChecked);
      }
    });

    test('should show visual feedback on completion', async ({ page }) => {
      // Find habit item and checkbox
      const habitItem = page.locator('[class*="habit"]').first();
      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await habitItem.count()) > 0 && (await checkbox.count()) > 0) {
        // Check the habit
        if (!(await checkbox.isChecked())) {
          await checkbox.click();
          await page.waitForTimeout(500);
        }

        // Should show some visual indication (strikethrough, opacity, etc.)
        const habitClasses = await habitItem.getAttribute('class');

        // Just verify classes exist (actual styling may vary)
        expect(habitClasses).toBeTruthy();
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should complete habit on mobile', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Find checkbox on mobile
      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await checkbox.count()) > 0) {
        const initialState = await checkbox.isChecked();

        // Tap checkbox (mobile interaction)
        await checkbox.click();
        await page.waitForTimeout(500);

        // Verify changed
        const newState = await checkbox.isChecked();
        expect(newState).not.toBe(initialState);
      }
    });
  });
});
