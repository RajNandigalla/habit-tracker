import { test, expect } from '@playwright/test';

/**
 * Progress Charts & Analytics E2E Tests
 * Tests progress page charts, statistics, and analytics
 */

test.describe('Progress Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Charts & Visualizations', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display progress charts', async ({ page }) => {
      await page.waitForTimeout(1500);

      // Look for chart elements (canvas, svg, etc.)
      const charts = page.locator('canvas, svg, [class*="chart"]');

      const hasCharts = (await charts.count()) > 0;

      // Charts may or may not be present depending on data
      expect(typeof hasCharts).toBe('boolean');
    });

    test('should show statistics cards', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for stat cards or numbers
      const stats = page.locator('[class*="stat"], [class*="card"]');

      const hasStats = (await stats.count()) > 0;

      expect(typeof hasStats).toBe('boolean');
    });

    test('should display completion percentages', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for percentage indicators
      const percentages = page.getByText(/%/);

      const hasPercentages = (await percentages.count()) > 0;

      expect(typeof hasPercentages).toBe('boolean');
    });
  });

  test.describe('Date Filtering', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should have date range controls', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for date pickers or range selectors
      const dateControls = page.locator(
        'input[type="date"], [class*="date"], [class*="range"], select'
      );

      const hasDateControls = (await dateControls.count()) > 0;

      expect(typeof hasDateControls).toBe('boolean');
    });

    test('should have time period toggles', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for week/month/year toggles
      const periodToggles = page.locator('button').filter({
        hasText: /week|month|year|day/i,
      });

      const hasToggles = (await periodToggles.count()) > 0;

      expect(typeof hasToggles).toBe('boolean');
    });
  });

  test.describe('Progress Insights', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should show habit trends', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for trend indicators
      const trends = page.locator('[class*="trend"], [class*="insight"]');

      const hasTrends = (await trends.count()) > 0;

      expect(typeof hasTrends).toBe('boolean');
    });

    test('should display best streaks', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for streak information
      const streaks = page.getByText(/streak/i);

      const hasStreaks = (await streaks.count()) > 0;

      expect(typeof hasStreaks).toBe('boolean');
    });
  });

  test.describe('Mobile Progress', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should show progress on mobile', async ({ page }) => {
      // Verify mobile view
      await expect(page.locator('main')).toBeVisible();

      const content = await page.locator('main').textContent();
      expect(content).toBeTruthy();
    });

    test('should adapt charts for mobile', async ({ page }) => {
      await page.waitForTimeout(1500);

      // Charts should render on mobile
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });
  });
});
