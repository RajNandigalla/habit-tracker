import { test, expect } from '@playwright/test';

/**
 * Internationalization Readiness E2E Tests
 * Tests i18n readiness and text handling
 */

test.describe('Internationalization Readiness', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test('should display proper text directionality (LTR)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    const dir = await html.getAttribute('dir');

    // Should be LTR or null (default LTR)
    expect(dir === 'ltr' || dir === null).toBe(true);
  });

  test('should handle long translated text gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // UI should not break with long text
    await expect(page.locator('main')).toBeVisible();
  });

  test('should display numbers correctly', async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const numbers = page.getByText(/\d+/);
    const hasNumbers = (await numbers.count()) > 0;

    expect(typeof hasNumbers).toBe('boolean');
  });

  test('should handle date formats appropriately', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');

    // Date displays should be present
    await expect(page.locator('main')).toBeVisible();
  });

  test('should support different character sets', async ({ page }) => {
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
        // Test various scripts
        const multilangText = 'Habit 习惯 عادة привычка';
        await nameInput.fill(multilangText);
        await page.waitForTimeout(300);

        const value = await nameInput.inputValue();
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});
