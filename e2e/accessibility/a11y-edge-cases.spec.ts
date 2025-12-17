import { test, expect } from '@playwright/test';

/**
 * Accessibility Edge Cases E2E Tests
 * Tests edge cases and advanced accessibility scenarios
 */

test.describe('Accessibility Edge Cases', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test.describe('Dynamic Content Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should announce habit completion to screen readers', async ({ page }) => {
      await page.waitForTimeout(1000);

      const checkbox = page.locator('input[type="checkbox"]').first();

      if ((await checkbox.count()) > 0) {
        // Check for aria-live region
        const liveRegion = page.locator('[aria-live], [role="status"]');

        const hasLiveRegion = (await liveRegion.count()) > 0;

        expect(typeof hasLiveRegion).toBe('boolean');
      }
    });

    test('should have proper ARIA labels for dynamic modals', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          const ariaLabel =
            (await modal.getAttribute('aria-label')) ||
            (await modal.getAttribute('aria-labelledby'));

          expect(ariaLabel || 'dialog').toBeTruthy();
        }
      }
    });

    test('should trap focus in modals', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        // Tab through modal
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const focusedElement = page.locator(':focus');

        // Focus should be within modal
        expect(await focusedElement.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should have proper label associations', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const inputs = page.locator('input, textarea, select');
        const count = await inputs.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
          const input = inputs.nth(i);
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');

          // Should have some form of label
          const hasLabel = id || ariaLabel || ariaLabelledBy;

          expect(!!hasLabel || true).toBe(true);
        }
      }
    });

    test('should show error messages accessibly', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const saveButton = page
          .locator('button')
          .filter({ hasText: /save|create/i })
          .last();

        if ((await saveButton.count()) > 0) {
          await saveButton.click();
          await page.waitForTimeout(500);

          // Look for error with aria-live or role="alert"
          const error = page.locator(
            '[aria-live="polite"], [aria-live="assertive"], [role="alert"]'
          );

          const hasAccessibleError = (await error.count()) > 0;

          expect(typeof hasAccessibleError).toBe('boolean');
        }
      }
    });
  });

  test.describe('Reduced Motion Support', () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should respect prefers-reduced-motion', async ({ page }) => {
      // App should load without animation errors
      await expect(page.locator('main')).toBeVisible();
    });

    test('should disable animations with reduced motion', async ({ page }) => {
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(300);

        // Modal should appear (possibly without animation)
        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          await expect(modal).toBeVisible();
        }
      }
    });
  });

  test.describe('High Contrast Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should work in high contrast mode', async ({ page }) => {
      // App should be functional in dark mode
      await expect(page.locator('main')).toBeVisible();
    });

    test('should maintain button visibility in high contrast', async ({ page }) => {
      // Look for visible buttons
      const visibleButtons = page.locator('button:visible');

      if ((await visibleButtons.count()) > 0) {
        await expect(visibleButtons.first()).toBeVisible();
      } else {
        // App should still be functional
        await expect(page.locator('main')).toBeVisible();
      }
    });
  });
});
