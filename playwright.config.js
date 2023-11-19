import { expect as baseExpect, defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import { SSR_PORT } from "./constants/api";
import { AUTH_PORT } from "./constants/auth";

dotenv.config({
  path: "./environment/.env.test",
});

// Custom Matchers:
export const expect = baseExpect.extend({
  // i.e. for Error Codes:
  toBeWithinRange(received, floor, ceiling) {
    let pass = received >= floor && received <= ceiling;
    let matcherResult;
    try {
      baseExpect(pass).toBeTruthy();
    } catch (e) {
      matcherResult = e.matcherResult;
    }
    return {
      message: pass
        ? () => `${received} in range ${floor}-${ceiling}`
        : () => `${received} not in range ${floor}-${ceiling}`,
      pass,
      name: "toBeWithinRange",
      expected: [ceiling, floor],
    };
  },

  // e.g. for input tags:
  async toBeValid(locator) {
    let pass = await locator.evaluate((node) => node.reportValidity());
    let matcherResult;
    try {
      baseExpect(pass).toBeTruthy();
    } catch (e) {
      matcherResult = e.matcherResult;
    }
    return {
      message: pass
        ? () => `${locator} is valid`
        : () => `${locator} is invalid`,
      pass,
      name: "toBeValid",
      expected: "Valid input",
    };
  },
});

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      testDir: "./api/auth",
      name: "auth",
      use: {
        baseURL: `http://127.0.0.1:${AUTH_PORT}`,
      },
    },
    {
      testDir: "./api/ssr",
      name: "ssr",
      use: {
        baseURL: `http://127.0.0.1:${SSR_PORT}`,
      },
    },
    {
      testDir: "./e2e",
      name: "e2e",
      use: {
        baseURL: `http://127.0.0.1:80`,
      },
    },
  ],
});
