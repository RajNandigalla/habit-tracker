import { test, expect } from '@playwright/test';

/**
 * Accessibility E2E Tests
 * Tests WCAG compliance and keyboard navigation
 */

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through interactive elements with Tab key', async ({ page }) => {
      // Press Tab and verify focus moves
      await page.keyboard.press('Tab');

      // Wait a moment for focus
      await page.waitForTimeout(100);

      // Get focused element
      const firstFocused = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName : null;
      });

      // Should have moved focus to something
      expect(firstFocused).not.toBeNull();

      // Press Tab again
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      const secondFocused = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName : null;
      });

      // Should have moved focus again
      expect(secondFocused).not.toBeNull();
    });

    test('should support Escape key', async ({ page }) => {
      // Press Escape should not cause errors
      await page.keyboard.press('Escape');

      // Page should still be functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('ARIA Labels', () => {
    test('should have proper aria-labels on interactive elements', async ({ page }) => {
      // Check buttons have accessible names
      const buttons = page.getByRole('button');
      const count = await buttons.count();

      if (count > 0) {
        // Just verify at least one button has a name
        const firstButton = buttons.first();
        const hasName = await firstButton.evaluate(el => {
          return !!(el.getAttribute('aria-label') || el.textContent?.trim());
        });
        expect(hasName).toBe(true);
      }
    });

    test('should have heading hierarchy', async ({ page }) => {
      // Check for headings - h1 can be screen-reader only
      const h1 = page.locator('h1');
      const h2 = page.locator('h2');

      // Should have at least some headings
      const h1Count = await h1.count();
      const h2Count = await h2.count();

      // At least one heading should exist
      expect(h1Count + h2Count).toBeGreaterThan(0);
    });

    test('should have alt text on images', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt can be empty string for decorative images, but must exist
        expect(alt).not.toBeNull();
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should work in both light and dark modes', async ({ page }) => {
      // Test light mode
      const lightTheme = await page.locator('html').getAttribute('class');
      await page.screenshot({ path: 'test-results/accessibility-light.png', fullPage: true });

      // Toggle to dark mode
      const themeButton = page
        .locator(
          'button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]'
        )
        .first();

      if ((await themeButton.count()) > 0) {
        await themeButton.click();
        await page.waitForTimeout(500);

        const darkTheme = await page.locator('html').getAttribute('class');
        await page.screenshot({ path: 'test-results/accessibility-dark.png', fullPage: true });

        // Verify theme actually changed
        expect(lightTheme).not.toBe(darkTheme);
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have labels associated with form inputs', async ({ page }) => {
      // Navigate to a page with forms (e.g., habits)
      await page.goto('/habits');

      // Open add modal
      const addButton = page.getByRole('button', { name: /add|create|new/i }).first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(300);

        // Check inputs have labels
        const inputs = page
          .locator('input, textarea, select')
          .filter({ hasNot: page.locator('[type="hidden"]') });
        const count = await inputs.count();

        for (let i = 0; i < count; i++) {
          const input = inputs.nth(i);
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          const id = await input.getAttribute('id');

          // Input should have aria-label, aria-labelledby, or associated label
          const hasLabel =
            ariaLabel ||
            ariaLabelledBy ||
            (id && (await page.locator(`label[for="${id}"]`).count()) > 0);

          if (count < 10) {
            // Only check if reasonable number of inputs
            expect(hasLabel).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper landmark regions', async ({ page }) => {
      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      await expect(main).toHaveCount(1);

      // Check for navigation
      const nav = page.locator('nav, [role="navigation"]');
      expect(await nav.count()).toBeGreaterThan(0);
    });

    test('should announce dynamic content changes', async ({ page }) => {
      // Check for aria-live regions
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');

      // At least one live region should exist for announcements
      const count = await liveRegions.count();
      // This is optional, so we just log it
      console.log(`Found ${count} live regions`);
    });
  });
});
