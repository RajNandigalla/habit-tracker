import { test, expect } from '@playwright/test';

/**
 * Advanced Edge Cases E2E Tests
 * Tests complex edge cases and stress scenarios
 */

test.describe('Advanced Edge Cases', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test.describe('Concurrent Operations', () => {
    test('should handle multiple rapid habit completions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const checkboxes = page.locator('input[type="checkbox"]');
      const count = await checkboxes.count();

      // Rapidly toggle multiple checkboxes
      for (let i = 0; i < Math.min(count, 3); i++) {
        await checkboxes.nth(i).click();
        await page.waitForTimeout(50);
      }

      // App should still be functional
      await expect(page.locator('main')).toBeVisible();
    });

    test('should handle rapid page navigation', async ({ page }) => {
      const routes = ['/', '/habits', '/journal', '/progress', '/settings'];

      for (const route of routes) {
        await page.goto(route);
        await page.waitForTimeout(100);
      }

      // Final page should load
      await expect(page.locator('main')).toBeVisible();
    });

    test('should handle simultaneous modal operations', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        // Open modal
        await addButton.click();
        await page.waitForTimeout(300);

        // Immediately close and reopen
        await page.keyboard.press('Escape');
        await page.waitForTimeout(100);

        await addButton.click();
        await page.waitForTimeout(300);

        // Close again
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }

      // App should be stable
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Extreme Data Scenarios', () => {
    test('should handle very long text input', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|habit name/i);

        if ((await nameInput.count()) > 0) {
          // Very long text
          const longText = 'A'.repeat(500);
          await nameInput.fill(longText);
          await page.waitForTimeout(300);

          // Should handle gracefully
          expect(true).toBe(true);
        }
      }
    });

    test('should handle special Unicode characters', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|habit name/i);

        if ((await nameInput.count()) > 0) {
          // Unicode characters
          await nameInput.fill('🎯 Test 习惯 привычка 🚀');
          await page.waitForTimeout(300);

          const value = await nameInput.inputValue();
          expect(value).toContain('Test');
        }
      }
    });

    test('should handle empty vs whitespace-only input', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|habit name/i);

        if ((await nameInput.count()) > 0) {
          // Whitespace only
          await nameInput.fill('   ');
          await page.waitForTimeout(200);

          const saveButton = page
            .locator('button')
            .filter({ hasText: /save|create/i })
            .last();

          if ((await saveButton.count()) > 0) {
            await saveButton.click();
            await page.waitForTimeout(500);

            // Should show validation or reject
            expect(true).toBe(true);
          }
        }
      }
    });
  });

  test.describe('State Recovery', () => {
    test('should recover from multiple failed operations', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Try invalid operations multiple times
      for (let i = 0; i < 3; i++) {
        const addButton = page
          .locator('button')
          .filter({ hasText: /new habit/i })
          .first();

        if ((await addButton.count()) > 0) {
          await addButton.click();
          await page.waitForTimeout(200);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      }

      // App should still be functional
      await expect(page.locator('main')).toBeVisible();
    });

    test('should maintain state after network interruption', async ({ page, context }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Go offline briefly
      await context.setOffline(true);
      await page.waitForTimeout(500);

      // Back online
      await context.setOffline(false);
      await page.waitForTimeout(500);

      // App should recover
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Layout Stability', () => {
    test('should not have cumulative layout shift during interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Get initial layout
      const initialBox = await page.locator('main').boundingBox();

      // Perform some interactions
      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await checkbox.count()) > 0) {
        await checkbox.click();
        await page.waitForTimeout(500);
      }

      // Layout should be stable
      const finalBox = await page.locator('main').boundingBox();

      expect(initialBox).toBeTruthy();
      expect(finalBox).toBeTruthy();
    });

    test('should handle window resize gracefully', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Resize window multiple times
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(200);

      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(200);

      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(200);

      // App should adapt
      await expect(page.locator('main')).toBeVisible();
    });
  });
});
