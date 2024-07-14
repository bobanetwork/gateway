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
  reporter: [['list'], ['dot'], ['html']],
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    headless: false,
    screenshot: 'on',
    video: 'on',
    contextOptions: {
      recordVideo: {
        dir: 'videos/',
        size: { width: 640, height: 480 },
      },
    },
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
        // viewport: null,
        ...devices['Desktop Chrome'],
        // It is important to define the `viewport` property after destructuring `devices`,
        // since devices also define the `viewport` for that device.
        viewport: { width: 1280, height: 850 },
      },
    },
  ],
  outputDir: 'test-results',
})
