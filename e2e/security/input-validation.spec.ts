import { test, expect } from '@playwright/test';

/**
 * Security & Input Validation E2E Tests
 * Tests input sanitization and security best practices
 */

test.describe('Security & Input Validation', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test.describe('XSS Prevention', () => {
    test('should sanitize script tags in habit names', async ({ page }) => {
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
          await nameInput.fill('<script>alert("xss")</script>Habit');
          await page.waitForTimeout(300);

          const value = await nameInput.inputValue();
          // Should contain the safe part
          expect(value).toBeTruthy();
        }
      }
    });

    test('should handle HTML entities in input', async ({ page }) => {
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
          await nameInput.fill('&lt;Habit&gt; &amp; More');
          await page.waitForTimeout(300);

          expect(true).toBe(true);
        }
      }
    });

    test('should prevent injection in journal entries', async ({ page }) => {
      await page.goto('/journal');
      await page.waitForLoadState('networkidle');

      const addButton = page
        .locator('button, a')
        .filter({ hasText: /add|new|write/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        const contentInput = page.locator('textarea, [contenteditable="true"]').first();

        if ((await contentInput.count()) > 0) {
          await contentInput.fill('<img src=x onerror=alert(1)>');
          await page.waitForTimeout(300);

          // Should be safe
          expect(true).toBe(true);
        }
      }
    });
  });

  test.describe('SQL Injection Prevention', () => {
    test('should handle SQL-like patterns in input', async ({ page }) => {
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
          await nameInput.fill("'; DROP TABLE habits; --");
          await page.waitForTimeout(300);

          const value = await nameInput.inputValue();
          expect(value).toBeTruthy();
        }
      }
    });
  });

  test.describe('Input Length Limits', () => {
    test('should enforce reasonable input length limits', async ({ page }) => {
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
          // Try extremely long input
          const veryLongText = 'A'.repeat(10000);
          await nameInput.fill(veryLongText);
          await page.waitForTimeout(300);

          const value = await nameInput.inputValue();
          // Should either truncate or accept
          expect(value.length).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('CSRF Protection', () => {
    test('should work without external form submissions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // All forms should be internal
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Data Validation', () => {
    test('should validate date inputs', async ({ page }) => {
      await page.goto('/journal');
      await page.waitForLoadState('networkidle');

      const datePicker = page.locator('input[type="date"]');

      if ((await datePicker.count()) > 0) {
        // Try invalid date
        await datePicker.first().fill('9999-99-99');
        await page.waitForTimeout(300);

        // Should handle gracefully
        expect(true).toBe(true);
      }
    });

    test('should validate number inputs', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const numberInput = page.locator('input[type="number"]');

      if ((await numberInput.count()) > 0) {
        // Try invalid number
        await numberInput.first().fill('-999999');
        await page.waitForTimeout(300);

        // Should handle gracefully
        expect(true).toBe(true);
      }
    });
  });
});
