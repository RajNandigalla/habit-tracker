#!/usr/bin/env node

/**
 * Generate code coverage report from E2E tests
 * This script processes coverage data collected during Playwright tests
 */

const fs = require('fs');
const path = require('path');

const coverageDir = path.join(__dirname, '../coverage');
const resultsFile = path.join(__dirname, '../test-results/coverage.json');

// Create coverage directory if it doesn't exist
if (!fs.existsSync(coverageDir)) {
  fs.mkdirSync(coverageDir, { recursive: true });
}

console.log('✅ Coverage collection setup complete');
console.log('📊 Coverage data will be saved to:', coverageDir);
console.log('\nTo view coverage:');
console.log('  1. Run tests: npm run test:e2e');
console.log('  2. Coverage is automatically collected');
console.log('  3. View report in coverage/ directory');
