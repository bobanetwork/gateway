import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['dot'], ['html']],
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    headless: false,
    screenshot: 'on',
    video: 'on',
  },
  // start local web server before tests
  webServer: [
    {
      command: 'pnpm start:server',
      url: 'http://localhost:3000',
      timeout: 5000,
      reuseExistingServer: true,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
        // ...devices['Desktop Chrome']
      },
    },
  ],
  outputDir: 'test-results',
})
