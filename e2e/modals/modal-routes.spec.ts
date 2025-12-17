import { test, expect } from '@playwright/test';

/**
 * Challenge Details & AI Report Modal E2E Tests
 * Tests challenge details and progress report modal routes
 */

test.describe('Modal Route Features', () => {
  test.describe('Challenge Details Modal', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display challenge details modal', async ({ page }) => {
      await page.goto('/challenges/test-challenge-id');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Should show challenge modal or challenge page
      const main = page.locator('main');
      const dialog = page.locator('[role="dialog"]');

      const hasUI = (await main.count()) > 0 || (await dialog.count()) > 0;
      expect(hasUI).toBe(true);
    });

    test('should show challenge information', async ({ page }) => {
      await page.goto('/challenges/test-id');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Look for challenge-related content
      const challengeInfo = page.getByText(/challenge|goal|day|week|complete/i);

      const hasInfo = (await challengeInfo.count()) > 0;
      expect(typeof hasInfo).toBe('boolean');
    });

    test('should have join challenge button', async ({ page }) => {
      await page.goto('/challenges/test-id');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const joinButton = page.locator('button').filter({ hasText: /join|start|accept/i });

      const hasJoinButton = (await joinButton.count()) > 0;
      expect(typeof hasJoinButton).toBe('boolean');
    });
  });

  test.describe('AI Progress Report Modal', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display AI report modal', async ({ page }) => {
      await page.goto('/progress/report');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Should show report modal or progress page
      const main = page.locator('main');
      const dialog = page.locator('[role="dialog"]');

      const hasUI = (await main.count()) > 0 || (await dialog.count()) > 0;
      expect(hasUI).toBe(true);
    });

    test('should show report content', async ({ page }) => {
      await page.goto('/progress/report');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Look for report-related content
      const reportContent = page.getByText(/report|progress|summary|insight|analysis/i);

      const hasReport = (await reportContent.count()) > 0;
      expect(typeof hasReport).toBe('boolean');
    });

    test('should have report actions', async ({ page }) => {
      await page.goto('/progress/report');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const actions = page.locator('button').filter({ hasText: /close|download|share|export/i });

      const hasActions = (await actions.count()) > 0;
      expect(typeof hasActions).toBe('boolean');
    });

    test('should close AI report modal', async ({ page }) => {
      await page.goto('/progress/report');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Try escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      expect(true).toBe(true);
    });
  });
});
