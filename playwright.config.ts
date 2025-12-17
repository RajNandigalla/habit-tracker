import { PlaywrightTestConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing with coverage
 * Tests will run on Desktop, Tablet, and Mobile viewports
 */
const config: PlaywrightTestConfig = {
  testDir: './e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: [['html'], ['list'], ['json', { outputFile: 'test-results/results.json' }]],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers and devices */
  projects: [
    // Desktop - Chromium (ACTIVE - for development)
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Uncomment below for full cross-browser/device testing (CI/CD)

    // Desktop - Firefox
    // {
    //   name: 'Desktop Firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },

    // Desktop - Safari
    // {
    //   name: 'Desktop Safari',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },

    // Tablet - iPad Pro
    // {
    //   name: 'iPad Pro',
    //   use: {
    //     ...devices['iPad Pro'],
    //   },
    // },

    // Tablet - iPad Mini
    // {
    //   name: 'iPad Mini',
    //   use: {
    //     ...devices['iPad Mini'],
    //   },
    // },

    // Mobile - iPhone 14
    // {
    //   name: 'iPhone 14',
    //   use: {
    //     ...devices['iPhone 14'],
    //   },
    // },

    // Mobile - iPhone 14 Pro
    // {
    //   name: 'iPhone 14 Pro',
    //   use: {
    //     ...devices['iPhone 14 Pro'],
    //   },
    // },

    // Mobile - Pixel 7
    // {
    //   name: 'Pixel 7',
    //   use: {
    //     ...devices['Pixel 7'],
    //   },
    // },

    // Mobile - Samsung Galaxy S21
    // {
    //   name: 'Galaxy S21',
    //   use: {
    //     ...devices['Galaxy S21+'],
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
};

export default config;
