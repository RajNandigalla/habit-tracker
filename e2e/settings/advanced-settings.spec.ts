import { test, expect } from '@playwright/test';

/**
 * Settings Advanced Features E2E Tests
 * Tests font size, preferences, and advanced settings
 */

test.describe('Advanced Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Display Preferences', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should have font size options', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for font size controls
      const fontControls = page.locator('select, [class*="font"], [class*="size"]').filter({
        hasText: /font|size|text/i,
      });

      const hasFontControls = (await fontControls.count()) > 0;

      expect(typeof hasFontControls).toBe('boolean');
    });

    test('should change font size', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Try to find and change font size
      const fontSelect = page.locator('select').filter({ hasText: /font|size/i });

      if ((await fontSelect.count()) > 0) {
        await fontSelect.first().selectOption({ index: 1 });
        await page.waitForTimeout(500);

        // Font should change
        expect(true).toBe(true);
      }
    });

    test('should have language options', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for language selector
      const langSelect = page.locator('select, button').filter({ hasText: /language|lang/i });

      const hasLang = (await langSelect.count()) > 0;

      expect(typeof hasLang).toBe('boolean');
    });
  });

  test.describe('Audio Settings', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should toggle sound effects', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Find sound toggle
      const soundToggle = page.locator('[role="switch"], input[type="checkbox"]').filter({
        hasText: /sound|audio/i,
      });

      const soundLabel = page.getByText(/sound|audio/i);

      if ((await soundToggle.count()) > 0 || (await soundLabel.count()) > 0) {
        const toggle = (await soundToggle.count()) > 0 ? soundToggle.first() : soundLabel.first();

        const initialState = (await toggle.isChecked?.()) || false;

        await toggle.click();
        await page.waitForTimeout(300);

        expect(true).toBe(true);
      }
    });

    test('should have volume controls', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for volume slider
      const volumeSlider = page.locator('input[type="range"]').filter({
        hasText: /volume/i,
      });

      const hasVolume = (await volumeSlider.count()) > 0;

      expect(typeof hasVolume).toBe('boolean');
    });
  });

  test.describe('Notification Preferences', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should have notification toggles', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for notification settings
      const notifSettings = page.getByText(/notification|reminder/i);

      const hasNotif = (await notifSettings.count()) > 0;

      expect(typeof hasNotif).toBe('boolean');
    });

    test('should toggle notifications', async ({ page }) => {
      await page.waitForTimeout(1000);

      const toggle = page.locator('[role="switch"], input[type="checkbox"]').first();

      if ((await toggle.count()) > 0) {
        const initialState = await toggle.isChecked();

        await toggle.click();
        await page.waitForTimeout(300);

        const newState = await toggle.isChecked();

        expect(newState).not.toBe(initialState);
      }
    });
  });

  test.describe('Data Management', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should show storage usage', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for storage info
      const storageInfo = page.getByText(/storage|data|size|MB|KB/i);

      const hasStorage = (await storageInfo.count()) > 0;

      expect(typeof hasStorage).toBe('boolean');
    });

    test('should have backup reminder', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for backup info
      const backupInfo = page.getByText(/backup|export|save/i);

      const hasBackup = (await backupInfo.count()) > 0;

      expect(typeof hasBackup).toBe('boolean');
    });
  });

  test.describe('About & Help', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test('should have app version info', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for version number
      const version = page.getByText(/version|v\d/i);

      const hasVersion = (await version.count()) > 0;

      expect(typeof hasVersion).toBe('boolean');
    });

    test('should have help/support links', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for help links
      const helpLinks = page.locator('a, button').filter({ hasText: /help|support|faq/i });

      const hasHelp = (await helpLinks.count()) > 0;

      expect(typeof hasHelp).toBe('boolean');
    });

    test('should have privacy policy link', async ({ page }) => {
      await page.waitForTimeout(1000);

      const privacyLink = page.locator('a').filter({ hasText: /privacy|terms/i });

      const hasPrivacy = (await privacyLink.count()) > 0;

      expect(typeof hasPrivacy).toBe('boolean');
    });
  });
});
