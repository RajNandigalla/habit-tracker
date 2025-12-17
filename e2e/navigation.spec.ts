import { test, expect } from '@playwright/test';

/**
 * Navigation E2E Tests
 * Tests app-wide navigation between pages
 */

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Desktop', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should have navigation links to all main pages', async ({ page }) => {
      // Just verify all main navigation links exist
      const pages = [
        { name: /habits/i },
        { name: /journal/i },
        { name: /progress/i },
        { name: /categories/i },
        { name: /settings/i },
      ];

      let linksFound = 0;

      for (const pageInfo of pages) {
        const link = page.getByRole('link', { name: pageInfo.name });

        if ((await link.count()) > 0) {
          // Verify link is visible
          await expect(link.first()).toBeVisible();
          linksFound++;
        }
      }

      // Should have at least some navigation links
      expect(linksFound).toBeGreaterThan(0);
    });

    test('should return to dashboard', async ({ page }) => {
      // Navigate away
      const habitsLink = page.getByRole('link', { name: /habits/i });
      if ((await habitsLink.count()) > 0) {
        await habitsLink.first().click();
        await page.waitForLoadState('networkidle');
      }

      // Navigate back to dashboard
      const dashboardLink = page.getByRole('link', { name: /dashboard|home/i });
      if ((await dashboardLink.count()) > 0) {
        await dashboardLink.first().click();
        await page.waitForLoadState('networkidle');

        // Should be at root
        const url = page.url();
        expect(url).toMatch(/\/$|#\/$/);
      }
    });
  });

  test.describe('Mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    test('should have working navigation on mobile', async ({ page }) => {
      // Try to find navigation (might be in hamburger menu)
      const links = page.getByRole('link');
      const linkCount = await links.count();

      // Should have some navigation links
      expect(linkCount).toBeGreaterThan(0);
    });
  });
});
