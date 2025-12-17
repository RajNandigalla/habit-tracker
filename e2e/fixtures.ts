import { test as base, expect } from '@playwright/test';

/**
 * Extended Playwright test with code coverage collection
 */
export const test = base.extend({
  context: async ({ context }, use) => {
    // Enable JS coverage
    await Promise.all(
      context.pages().map(page => page.coverage.startJSCoverage({ resetOnNavigation: false }))
    );

    await use(context);

    // Collect coverage after each test
    for (const page of context.pages()) {
      const coverage = await page.coverage.stopJSCoverage();

      // Write coverage to window object for collection
      await page.evaluate(cov => {
        // @ts-ignore
        window.__coverage__ = window.__coverage__ || {};
        cov.forEach(entry => {
          // @ts-ignore
          window.__coverage__[entry.url] = entry;
        });
      }, coverage);
    }
  },
});

export { expect };
