
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: [
    {
      command: 'npm --prefix ../backend run dev',
      port: 3000,
      timeout: 120_000,
      reuseExistingServer: true,
    },
    {
      command: 'npm --prefix ../frontend run dev -- --host=127.0.0.1 --port=5175',
      port: 5175,
      timeout: 120_000,
      reuseExistingServer: true,
    },
  ],
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
});