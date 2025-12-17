import { Page, expect } from '@playwright/test';

/**
 * E2E Test Helpers
 * Reusable utilities for Playwright tests
 */

/**
 * Wait for app to be fully loaded
 */
export async function waitForAppLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body', { state: 'visible' });
}

/**
 * Navigate to a specific page
 */
export async function navigateTo(page: Page, path: string) {
  await page.goto(path);
  await waitForAppLoad(page);
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  const box = await element.boundingBox();

  if (!box) return false;

  const viewport = page.viewportSize();
  if (!viewport) return false;

  return (
    box.y >= 0 &&
    box.x >= 0 &&
    box.y + box.height <= viewport.height &&
    box.x + box.width <= viewport.width
  );
}

/**
 * Take a full page screenshot with a specific name
 */
export async function takeScreenshot(page: Page, name: string, fullPage = true) {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage,
  });
}

/**
 * Wait for modal to be visible
 */
export async function waitForModal(page: Page) {
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
}

/**
 * Close modal by clicking backdrop or close button
 */
export async function closeModal(page: Page) {
  const closeButton = page.locator('button[aria-label*="close" i]').first();

  if ((await closeButton.count()) > 0) {
    await closeButton.click();
  } else {
    // Try clicking backdrop
    await page.locator('[role="dialog"]').press('Escape');
  }

  await page.waitForSelector('[role="dialog"]', { state: 'hidden' });
}

/**
 * Fill form field by label
 */
export async function fillField(page: Page, label: string | RegExp, value: string) {
  await page.getByLabel(label).fill(value);
}

/**
 * Click button by text
 */
export async function clickButton(page: Page, text: string | RegExp) {
  await page.getByRole('button', { name: text }).click();
}

/**
 * Check if running on mobile viewport
 */
export function isMobile(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < 768 : false;
}

/**
 * Check if running on tablet viewport
 */
export function isTablet(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport ? viewport.width >= 768 && viewport.width < 1024 : false;
}

/**
 * Check if running on desktop viewport
 */
export function isDesktop(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport ? viewport.width >= 1024 : false;
}

/**
 * Wait for animation to complete
 */
export async function waitForAnimation(page: Page, ms = 500) {
  await page.waitForTimeout(ms);
}

/**
 * Get current theme (light/dark)
 */
export async function getTheme(page: Page): Promise<'light' | 'dark'> {
  const htmlClass = await page.locator('html').getAttribute('class');
  return htmlClass?.includes('dark') ? 'dark' : 'light';
}

/**
 * Toggle theme
 */
export async function toggleTheme(page: Page) {
  const themeButton = page
    .locator(
      'button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]'
    )
    .first();
  await themeButton.click();
  await waitForAnimation(page);
}

/**
 * Clear all test data (use with caution!)
 */
export async function clearTestData(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await waitForAppLoad(page);
}

/**
 * Create a test habit
 */
export async function createTestHabit(page: Page, name: string, description = 'Test habit') {
  // Open add habit modal
  const addButton = page.getByRole('button', { name: /add habit|new habit|create/i }).first();
  await addButton.click();
  await waitForModal(page);

  // Fill form
  await fillField(page, /name|habit name/i, name);
  await fillField(page, /description/i, description);

  // Submit
  await clickButton(page, /save|create|add/i);

  // Wait for modal to close
  await page.waitForSelector('[role="dialog"]', { state: 'hidden' });
}
