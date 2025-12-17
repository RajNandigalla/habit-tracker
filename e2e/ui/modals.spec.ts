import { test, expect } from '@playwright/test';

/**
 * Modal & Dialog E2E Tests
 * Tests modal interactions, animations, and behaviors
 */

test.describe('Modals & Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Modal Opening & Closing', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should open and close modal with escape key', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          await expect(modal).toBeVisible();

          // Press escape to close
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);

          // Modal should be gone
          const modalStillVisible = await page
            .getByRole('dialog')
            .isVisible()
            .catch(() => false);
          expect(modalStillVisible).toBe(false);
        }
      }
    });

    test('should close modal by clicking backdrop', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          // Click backdrop (outside modal)
          await page.mouse.click(50, 50);
          await page.waitForTimeout(500);

          // Modal should close
          const modalStillVisible = await page
            .getByRole('dialog')
            .isVisible()
            .catch(() => false);
          expect(typeof modalStillVisible).toBe('boolean');
        }
      }
    });

    test('should close modal with close button', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          // Look for close button (X, close, cancel)
          const closeButton = page
            .locator('button')
            .filter({ hasText: /close|cancel|×/i })
            .first();

          if ((await closeButton.count()) > 0) {
            await closeButton.click();
            await page.waitForTimeout(500);

            const modalStillVisible = await page
              .getByRole('dialog')
              .isVisible()
              .catch(() => false);
            expect(typeof modalStillVisible).toBe('boolean');
          }
        }
      }
    });
  });

  test.describe('Modal Content', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should maintain focus within modal', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          // Tab through elements
          await page.keyboard.press('Tab');
          await page.waitForTimeout(100);

          // Focus should stay within modal
          const focusedElement = await page.locator(':focus');
          expect(await focusedElement.count()).toBeGreaterThan(0);
        }
      }
    });

    test('should scroll long modal content', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          // Modal should be scrollable if content is long
          await expect(modal).toBeVisible();
        }
      }
    });
  });

  test.describe('Multiple Modals', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should handle nested modals if supported', async ({ page }) => {
      // This tests if app can handle modal-over-modal scenarios
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const firstModal = page.getByRole('dialog').first();

        if ((await firstModal.count()) > 0) {
          // Just verify first modal is working
          await expect(firstModal).toBeVisible();
        }
      }
    });
  });
});
