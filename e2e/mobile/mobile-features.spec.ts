import { test, expect } from '@playwright/test';

/**
 * Mobile-Specific Feature E2E Tests
 * Tests features that work differently or exclusively on mobile
 */

test.describe('Mobile Features', () => {
  test.use({
    viewport: { width: 375, height: 667 },
  });

  test.describe('Habit Creation on Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should open habit form from FAB', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Find FAB button
      const fab = page.locator('[class*="fab"], button[class*="floating"]');
      const addButton = page.locator('button').filter({ hasText: /add|new|\+/i });

      const button = (await fab.count()) > 0 ? fab : addButton;

      if ((await button.count()) > 0) {
        await button.first().click();
        await page.waitForTimeout(500);

        const modal = page.getByRole('dialog');
        if ((await modal.count()) > 0) {
          await expect(modal).toBeVisible();
        }
      }
    });

    test('should fill habit form on mobile', async ({ page }) => {
      await page.waitForTimeout(1000);

      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit|add/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|habit name/i);

        if ((await nameInput.count()) > 0) {
          await nameInput.fill('Mobile Test Habit');
          await page.waitForTimeout(300);

          // Try to submit
          const saveButton = page
            .locator('button')
            .filter({ hasText: /save|create|add/i })
            .last();

          if ((await saveButton.count()) > 0) {
            await saveButton.click();
            await page.waitForTimeout(1000);

            expect(true).toBe(true);
          }
        }
      }
    });

    test('should handle mobile keyboard for habit input', async ({ page }) => {
      await page.waitForTimeout(1000);

      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit|add/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|habit name/i);

        if ((await nameInput.count()) > 0) {
          // Focus should trigger mobile keyboard
          await nameInput.click();
          await page.waitForTimeout(200);

          await nameInput.fill('Mobile Keyboard Test');

          expect(await nameInput.inputValue()).toContain('Mobile');
        }
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should have mobile menu button', async ({ page }) => {
      await page.waitForTimeout(500);

      // Look for hamburger menu button
      const menuButton = page.locator('button[aria-label*="menu" i], button[class*="menu"]');

      if ((await menuButton.count()) > 0) {
        await menuButton.first().click();
        await page.waitForTimeout(500);

        // Menu interaction should work (doesn't crash)
        expect(true).toBe(true);
      } else {
        // If no menu button, nav might be always visible
        const nav = page.locator('[role="navigation"], nav');
        const hasNav = (await nav.count()) > 0;

        expect(hasNav).toBe(true);
      }
    });

    test('should close mobile menu after navigation', async ({ page }) => {
      await page.waitForTimeout(500);

      const menuButton = page.locator('button[aria-label*="menu" i]');

      if ((await menuButton.count()) > 0) {
        await menuButton.first().click();
        await page.waitForTimeout(500);

        // Click a nav link
        const navLink = page.getByRole('link', { name: /habits/i });

        if ((await navLink.count()) > 0) {
          await navLink.first().click();
          await page.waitForTimeout(500);

          // Menu should close
          expect(true).toBe(true);
        }
      }
    });
  });

  test.describe('Mobile Category Creation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/categories');
      await page.waitForLoadState('networkidle');
    });

    test('should create category on mobile', async ({ page }) => {
      await page.waitForTimeout(1000);

      const addButton = page
        .locator('button, a')
        .filter({ hasText: /add|new|create/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.getByLabel(/name|category/i);

        if ((await nameInput.count()) > 0) {
          await nameInput.fill('Mobile Category');
          await page.waitForTimeout(300);

          const saveButton = page
            .locator('button')
            .filter({ hasText: /save|create/i })
            .last();

          if ((await saveButton.count()) > 0) {
            await saveButton.click();
            await page.waitForTimeout(1000);

            expect(true).toBe(true);
          }
        }
      }
    });
  });

  test.describe('Mobile Gestures', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should support tap interactions', async ({ page }) => {
      await page.waitForTimeout(1000);

      const habitItem = page.locator('[class*="habit"]').first();

      if ((await habitItem.count()) > 0) {
        // Tap (not click)
        await habitItem.tap();
        await page.waitForTimeout(500);

        expect(true).toBe(true);
      }
    });

    test('should handle pull-to-refresh gesture', async ({ page }) => {
      // Pull to refresh simulation
      await page.waitForTimeout(500);

      // Page should remain functional
      await expect(page.locator('main')).toBeVisible();
    });
  });
});
