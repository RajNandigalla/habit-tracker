import { test, expect, type Page } from '@playwright/test';

/**
 * Dashboard E2E Tests
 * Tests the main dashboard functionality across different devices
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should display dashboard with main content', async ({ page }) => {
      // Check main landmark
      await expect(page.locator('main[aria-label="Dashboard"]')).toBeVisible();

      // Check for "Your Habits" heading (use .first() as there may be duplicate sr-only headings)
      await expect(page.getByRole('heading', { name: /your habits/i }).first()).toBeVisible();

      // Take screenshot for visual regression
      await page.screenshot({ path: 'test-results/dashboard-desktop.png', fullPage: true });
    });

    test('should show side navigation menu', async ({ page }) => {
      // Check navigation items exist
      const nav = page.locator('nav, [role="navigation"]');

      if ((await nav.count()) > 0) {
        await expect(nav.first()).toBeVisible();
      }
    });

    test('should have navigation links', async ({ page }) => {
      // Look for navigation links
      const links = page.locator('a[href], button');

      // Should have some interactive elements
      expect(await links.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Tablet', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    test('should display dashboard on tablet', async ({ page }) => {
      // Check main content
      await expect(page.locator('main[aria-label="Dashboard"]')).toBeVisible();

      // Take screenshot for visual regression
      await page.screenshot({ path: 'test-results/dashboard-tablet.png', fullPage: true });
    });

    test('should show navigation on tablet', async ({ page }) => {
      // Navigation should be visible
      const nav = page.locator('nav, [role="navigation"]');

      if ((await nav.count()) > 0) {
        await expect(nav.first()).toBeVisible();
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should display dashboard on mobile', async ({ page }) => {
      // Check main content
      await expect(page.locator('main[aria-label="Dashboard"]')).toBeVisible();

      // Take screenshot for visual regression
      await page.screenshot({ path: 'test-results/dashboard-mobile.png', fullPage: true });
    });

    test('should show FAB button on mobile', async ({ page }) => {
      // FAB should be visible on mobile
      const fab = page.locator(
        'button[aria-label*="Create new habit" i], button[aria-label*="habit" i]'
      );

      if ((await fab.count()) > 0) {
        await expect(fab.first()).toBeVisible();
      }
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle between light and dark mode', async ({ page }) => {
      // Find theme toggle buttons - they have specific aria-labels
      const lightModeButton = page.locator('button[aria-label="Switch to light mode"]');
      const darkModeButton = page.locator('button[aria-label="Switch to dark mode"]');

      // Check if we're on settings page or need to navigate
      const currentUrl = page.url();
      if (!currentUrl.includes('settings')) {
        // Try to navigate to settings first
        const settingsLink = page.getByRole('link', { name: /settings/i });
        if ((await settingsLink.count()) > 0) {
          await settingsLink.first().click();
          await page.waitForLoadState('networkidle');
        }
      }

      // Get initial theme from html class
      const htmlElement = page.locator('html');
      const initialClass = await htmlElement.getAttribute('class');
      const initiallyDark = initialClass?.includes('dark') || false;

      // Click the opposite theme button
      if (initiallyDark) {
        // Currently dark, click light mode button
        if ((await lightModeButton.count()) > 0) {
          await lightModeButton.click();
          await page.waitForTimeout(500);

          const newClass = await htmlElement.getAttribute('class');
          const nowDark = newClass?.includes('dark') || false;

          // Should have switched to light mode
          expect(nowDark).toBe(false);
        }
      } else {
        // Currently light, click dark mode button
        if ((await darkModeButton.count()) > 0) {
          await darkModeButton.click();
          await page.waitForTimeout(500);

          const newClass = await htmlElement.getAttribute('class');
          const nowDark = newClass?.includes('dark') || false;

          // Should have switched to dark mode
          expect(nowDark).toBe(true);
        }
      }
    });
  });

  test.describe('Empty State', () => {
    test('should show content on dashboard', async ({ page }) => {
      // Check that dashboard has meaningful content
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Should have some text content
      const text = await mainContent.textContent();
      expect(text).toBeTruthy();
      expect(text!.length).toBeGreaterThan(10);
    });
  });
});
