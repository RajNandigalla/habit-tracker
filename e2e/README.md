# E2E Tests

End-to-end tests using Playwright for testing across Desktop, Tablet, and Mobile devices.

## Running Tests

### Run all tests

```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for development)

```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)

```bash
npm run test:e2e:headed
```

### Run tests for specific device

```bash
# Desktop only
npm run test:e2e:desktop

# Tablet only
npm run test:e2e:tablet

# Mobile only
npm run test:e2e:mobile
```

### Run specific test file

```bash
npx playwright test e2e/dashboard/dashboard.spec.ts
```

### Debug tests

```bash
npm run test:e2e:debug
```

### View test report

```bash
npm run test:e2e:report
```

## Test Structure

```
e2e/
├── dashboard/       # Dashboard tests
├── habits/          # Habit CRUD tests
├── journal/         # Journal tests
├── settings/        # Settings tests
├── categories/      # Categories tests
└── helpers.ts       # Shared test utilities
```

## Devices Tested

### Desktop

- Chrome (1920x1080)
- Firefox (1920x1080)
- Safari (1920x1080)

### Tablet

- iPad Pro
- iPad Mini

### Mobile

- iPhone 14
- iPhone 14 Pro
- Pixel 7
- Samsung Galaxy S21

## Test Coverage

Tests include:

- ✅ Page navigation
- ✅ Responsive design (Desktop/Tablet/Mobile)
- ✅ Theme toggle (Light/Dark mode)
- ✅ CRUD operations (Habits, Journal, Categories)
- ✅ Form validation
- ✅ Modal interactions
- ✅ Visual regression testing (screenshots)

## Writing Tests

Use the helpers from `e2e/helpers.ts` for common operations:

```typescript
import { test, expect } from '@playwright/test';
import { waitForAppLoad, createTestHabit, toggleTheme } from '../helpers';

test('my test', async ({ page }) => {
  await page.goto('/');
  await waitForAppLoad(page);

  // Create a test habit
  await createTestHabit(page, 'Morning Exercise');

  // Toggle theme
  await toggleTheme(page);

  // Assertions
  await expect(page.getByText('Morning Exercise')).toBeVisible();
});
```

## Best Practices

1. **Use semantic selectors**: Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
2. **Wait for network idle**: Use `waitForAppLoad()` helper after navigation
3. **Take screenshots**: Capture screenshots for visual regression testing
4. **Test across devices**: Ensure tests work on Desktop, Tablet, and Mobile
5. **Use helpers**: Leverage shared utilities in `helpers.ts` for common operations
6. **Clean up**: Use `clearTestData()` in `afterEach` if needed

## CI/CD

Tests are configured to run automatically on GitHub Actions with the `--gha` flag in `playwright.config.ts`.
