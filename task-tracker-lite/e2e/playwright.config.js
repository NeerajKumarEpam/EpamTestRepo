
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
});