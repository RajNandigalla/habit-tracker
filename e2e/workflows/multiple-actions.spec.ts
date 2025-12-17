import { test, expect } from '@playwright/test';

/**
 * Multiple Actions E2E Tests
 * Tests performing multiple actions in sequence
 */

test.describe('Multiple Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Batch Habit Completion', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should complete multiple habits in sequence', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Find all habit checkboxes
      const checkboxes = page.locator('input[type="checkbox"]');
      const count = await checkboxes.count();

      if (count > 1) {
        // Complete first 2-3 habits
        const toComplete = Math.min(3, count);

        for (let i = 0; i < toComplete; i++) {
          const checkbox = checkboxes.nth(i);

          if (!(await checkbox.isChecked())) {
            await checkbox.click();
            await page.waitForTimeout(300);
          }
        }

        // All should be checked now
        for (let i = 0; i < toComplete; i++) {
          const checkbox = checkboxes.nth(i);
          expect(await checkbox.isChecked()).toBe(true);
        }
      }
    });

    test('should toggle habits on and off', async ({ page }) => {
      await page.waitForTimeout(1000);

      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await checkbox.count()) > 0) {
        // Toggle on
        if (!(await checkbox.isChecked())) {
          await checkbox.click();
          await page.waitForTimeout(300);
        }

        expect(await checkbox.isChecked()).toBe(true);

        // Toggle off
        await checkbox.click();
        await page.waitForTimeout(300);

        expect(await checkbox.isChecked()).toBe(false);
      }
    });
  });

  test.describe('Navigation Flow', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should navigate through multiple pages in sequence', async ({ page }) => {
      const pages = ['habits', 'journal', 'progress', 'settings'];

      for (const pageName of pages) {
        const link = page.getByRole('link', { name: new RegExp(pageName, 'i') });

        if ((await link.count()) > 0) {
          await link.first().click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(300);

          // Verify page loaded
          await expect(page.locator('main')).toBeVisible();
        }
      }

      // Return to dashboard
      const dashboardLink = page.getByRole('link', { name: /dashboard|home/i });
      if ((await dashboardLink.count()) > 0) {
        await dashboardLink.first().click();
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('Theme Switching', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should switch theme multiple times', async ({ page }) => {
      // Navigate to settings
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const lightButton = page.locator('button[aria-label="Switch to light mode"]');
      const darkButton = page.locator('button[aria-label="Switch to dark mode"]');

      const html = page.locator('html');

      // Toggle to dark
      if ((await darkButton.count()) > 0) {
        await darkButton.click();
        await page.waitForTimeout(500);

        let htmlClass = await html.getAttribute('class');
        expect(htmlClass).toContain('dark');
      }

      // Toggle to light
      if ((await lightButton.count()) > 0) {
        await lightButton.click();
        await page.waitForTimeout(500);

        let htmlClass = await html.getAttribute('class');
        expect(htmlClass || '').not.toContain('dark');
      }

      // Toggle back to dark
      if ((await darkButton.count()) > 0) {
        await darkButton.click();
        await page.waitForTimeout(500);

        let htmlClass = await html.getAttribute('class');
        expect(htmlClass).toContain('dark');
      }
    });
  });
});
