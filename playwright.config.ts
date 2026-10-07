import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import os from 'node:os';

const chromeExecutablePaths = {
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
} as const;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, 'usersecrets.env') });

// debugger showing all pw api steps
//process.env.DEBUG = 'pw:api';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Entire script each Test timeout - currently 120 seconds */
  timeout: 500_000,
  /* Expect assertion global timeout */
  expect: { timeout: 10000 },

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFile: 'playwright-report/index.html', open: 'never' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],


  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* This limits how long each action like .click(), .fill(), or .hover() can take to perform */
    actionTimeout: 10000,
    trace: 'on',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    /* Support running in DDev which will have invalid browser TLS certificates */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects:
    [
      // {
      //   name: 'chromium',
      //   use: {
      //     ...devices['Desktop Chrome'],
      //     // It is important to define the `viewport` property after destructuring `devices`,
      //     // since devices also define the `viewport` for that device.
      //     viewport: { width: 1300, height: 800 }
      //     // viewport: null,
      //     // deviceScaleFactor: undefined,
      //     // launchOptions: {
      //     //   // 3. Pass the start-maximized argument to Chromium
      //     //   args: ['--start-maximized']
      //     // },
      //   },
      // },

      {
        name: 'chromium',
        use:
        {
          browserName: 'chromium',
          viewport: { width: 1300, height: 800 },
          //deviceScaleFactor: undefined,
          launchOptions: {
            executablePath: chromeExecutablePaths[os.platform() as keyof typeof chromeExecutablePaths],
            args: ['--disable-extensions',
              '--disable-background-networking',
              '--disable-component-update',
              '--disable-sync',
              '--metrics-recording-only',
              '--no-first-run',
              '--no-default-browser-check'],
          }
        },
      },


      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },

      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },

      /* Test against mobile viewports. */
      // {
      //   name: 'Mobile Chrome',
      //   use: { ...devices['Pixel 5'] },
      // },
      // {
      //   name: 'Mobile Safari',
      //   use: { ...devices['iPhone 12'] },
      // },

      /* Test against branded browsers. */
      // {
      //   name: 'Microsoft Edge',
      //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
      // },
      // {
      //   name: 'Google Chrome',
      //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      // },
    ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

});