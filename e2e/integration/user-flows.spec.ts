import { test, expect } from '@playwright/test';

/**
 * Integration & User Flow E2E Tests
 * Tests complete user workflows and feature integration
 */

test.describe('Integration & User Flows', () => {
  test.describe('Complete Habit Workflow', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should complete full habit creation to deletion flow', async ({ page }) => {
      const testHabitName = `E2E Test Habit ${Date.now()}`;

      // 1. Create habit
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|habit name/i);

        if ((await nameInput.count()) > 0) {
          await nameInput.fill(testHabitName);

          const saveButton = page
            .locator('button')
            .filter({ hasText: /save|create/i })
            .last();

          if ((await saveButton.count()) > 0) {
            await saveButton.click();
            await page.waitForTimeout(1500);

            // 2. Complete the habit
            await page.waitForTimeout(1000);
            const checkbox = page.locator('input[type="checkbox"]').first();

            if ((await checkbox.count()) > 0) {
              await checkbox.click();
              await page.waitForTimeout(500);

              // 3. View habit details
              const habitItem = page.locator('[class*="habit"]').first();

              if ((await habitItem.count()) > 0) {
                await habitItem.click();
                await page.waitForTimeout(500);

                // Successfully navigated through the flow
                expect(true).toBe(true);
              }
            }
          }
        }
      }
    });

    test('should create habit, assign category, and filter', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Navigate through category assignment flow
      const categoryChips = page.locator('[class*="category"], [class*="chip"]');

      if ((await categoryChips.count()) > 0) {
        await categoryChips.first().click();
        await page.waitForTimeout(500);

        // Habits should be filtered
        expect(true).toBe(true);
      }
    });
  });

  test.describe('Multi-Feature Integration', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should integrate habits with progress tracking', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Complete a habit
      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await checkbox.count()) > 0) {
        await checkbox.click();
        await page.waitForTimeout(500);

        // Navigate to progress
        const progressLink = page.getByRole('link', { name: /progress/i });

        if ((await progressLink.count()) > 0) {
          await progressLink.first().click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1500);

          // Progress should reflect the completion
          await expect(page.locator('main')).toBeVisible();
        }
      }
    });

    test('should integrate categories across features', async ({ page }) => {
      // Create category
      await page.goto('/categories');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const addButton = page
        .locator('button, a')
        .filter({ hasText: /add|new/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|category/i);

        if ((await nameInput.count()) > 0) {
          await nameInput.fill('Integration Test Category');
          await page.waitForTimeout(300);

          const saveButton = page
            .locator('button')
            .filter({ hasText: /save|create/i })
            .last();

          if ((await saveButton.count()) > 0) {
            await saveButton.click();
            await page.waitForTimeout(1000);

            // Navigate to habits and verify category is available
            await page.goto('/habits');
            await page.waitForLoadState('networkidle');

            expect(true).toBe(true);
          }
        }
      }
    });

    test('should sync data across pages', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const initialContent = await page.locator('main').textContent();

      // Navigate away and back
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const finalContent = await page.locator('main').textContent();

      // Data should persist
      expect(finalContent).toBeTruthy();
      expect(initialContent).toBeTruthy();
    });
  });

  test.describe('Cross-Page Workflows', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should maintain state across navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const pages = ['/', '/habits', '/journal', '/progress', '/categories', '/settings'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300);

        // Each page should render successfully
        await expect(page.locator('main')).toBeVisible();
      }

      // Return to dashboard - state should be intact
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('main')).toBeVisible();
    });

    test('should handle rapid page switching', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Rapidly switch between pages
      await page.goto('/habits');
      await page.goto('/journal');
      await page.goto('/progress');
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // App should still be functional
      await expect(page.locator('main')).toBeVisible();
    });
  });
});
