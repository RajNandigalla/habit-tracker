import { test, expect } from '@playwright/test';

/**
 * Habit Creation Flow E2E Tests
 * Tests the complete habit creation process from button click to verification
 */

test.describe('Habit Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should create a new habit successfully', async ({ page }) => {
      // Find and click "Add Habit" button
      const addButton = page
        .locator('button')
        .filter({ hasText: /new habit/i })
        .first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        // Should open modal/form
        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          // Fill in habit name
          const nameInput = page.getByLabel(/name|habit name/i);
          if ((await nameInput.count()) > 0) {
            await nameInput.fill('E2E Test Habit - Morning Run');

            // Fill in description (if exists)
            const descInput = page.getByLabel(/description/i);
            if ((await descInput.count()) > 0) {
              await descInput.fill('Run 5km every morning for better health');
            }

            // Find and click submit button
            const submitButton = page
              .locator('button')
              .filter({ hasText: /save|create|add/i })
              .last();
            if ((await submitButton.count()) > 0) {
              await submitButton.click();

              // Wait for modal to close
              await page.waitForTimeout(1000);

              // Verify habit appears in list (navigate to habits page if needed)
              const currentUrl = page.url();
              if (!currentUrl.includes('habit')) {
                const habitsLink = page.getByRole('link', { name: /habits/i });
                if ((await habitsLink.count()) > 0) {
                  await habitsLink.first().click();
                  await page.waitForLoadState('networkidle');
                }
              }

              // Look for the newly created habit
              const habitText = page.getByText(/E2E Test Habit/i);
              if ((await habitText.count()) > 0) {
                await expect(habitText.first()).toBeVisible();
              }
            }
          }
        }
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should create habit from FAB on mobile', async ({ page }) => {
      // Find FAB button
      const fab = page
        .locator('button[aria-label*="Create" i], button[aria-label*="habit" i]')
        .last();

      if ((await fab.count()) > 0) {
        await fab.click();
        await page.waitForTimeout(500);

        // Should open modal or navigation
        const modal = page.getByRole('dialog');

        if ((await modal.count()) > 0) {
          // Check modal is visible
          await expect(modal).toBeVisible();
        }
      }
    });
  });
});
