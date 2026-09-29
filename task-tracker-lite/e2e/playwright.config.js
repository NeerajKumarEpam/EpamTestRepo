
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
      url: 'http://127.0.0.1:3000/api/health',
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm --prefix ../frontend run dev -- --host=127.0.0.1 --port=5173',
      url: 'http://127.0.0.1:5173/',
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
});