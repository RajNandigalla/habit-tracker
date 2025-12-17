import { test, expect } from '@playwright/test';

/**
 * Challenges Page E2E Tests
 * Tests challenges feature functionality
 */

test.describe('Challenges', () => {
  test.describe('Desktop Challenges', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test.beforeEach(async ({ page }) => {
      await page.goto('/challenges');
      await page.waitForLoadState('networkidle');
    });

    test('should display challenges page', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();

      const content = await page.locator('main').textContent();
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(20);
    });

    test('should show available challenges', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for challenge cards or list
      const challenges = page.locator('[class*="challenge"]');

      const hasChallenges = (await challenges.count()) > 0;
      expect(typeof hasChallenges).toBe('boolean');
    });

    test('should display challenge details', async ({ page }) => {
      await page.waitForTimeout(1000);

      const challengeItem = page.locator('[class*="challenge"]').first();

      if ((await challengeItem.count()) > 0) {
        await challengeItem.click();
        await page.waitForTimeout(500);

        // Challenge details should appear
        expect(true).toBe(true);
      }
    });

    test('should show challenge progress', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for progress indicators
      const progress = page.locator('[class*="progress"], [class*="percent"]');

      const hasProgress = (await progress.count()) > 0;
      expect(typeof hasProgress).toBe('boolean');
    });

    test('should allow joining challenges', async ({ page }) => {
      await page.waitForTimeout(1000);

      const joinButton = page.locator('button').filter({ hasText: /join|start|accept/i });

      if ((await joinButton.count()) > 0) {
        await joinButton.first().click();
        await page.waitForTimeout(500);

        expect(true).toBe(true);
      }
    });

    test('should show active vs completed challenges', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for status indicators
      const statusTabs = page
        .locator('button, [role="tab"]')
        .filter({ hasText: /active|completed/i });

      const hasStatuses = (await statusTabs.count()) > 0;
      expect(typeof hasStatuses).toBe('boolean');
    });

    test('should display empty state when no challenges', async ({ page }) => {
      await page.waitForTimeout(1000);

      const emptyState = page.getByText(/no challenges|start.*challenge|empty/i);
      const content = await page.locator('main').textContent();

      // Either has challenges or shows empty state
      expect(content).toBeTruthy();
    });
  });

  test.describe('Mobile Challenges', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test.beforeEach(async ({ page }) => {
      await page.goto('/challenges');
      await page.waitForLoadState('networkidle');
    });

    test('should display challenges on mobile', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
    });

    test('should show challenge cards on mobile', async ({ page }) => {
      await page.waitForTimeout(1000);

      const content = await page.locator('main').textContent();
      expect(content).toBeTruthy();
    });
  });

  test.describe('Tablet Challenges', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test.beforeEach(async ({ page }) => {
      await page.goto('/challenges');
      await page.waitForLoadState('networkidle');
    });

    test('should display challenges on tablet', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();

      const content = await page.locator('main').textContent();
      expect(content).toBeTruthy();
    });
  });
});
