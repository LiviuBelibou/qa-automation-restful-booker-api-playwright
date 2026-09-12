import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const baseURL = process.env.API_BASE_URL;

if (!baseURL) {
  throw new Error('API_BASE_URL is missing. Check your .env file.');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  projects: [
    {
      name: 'api',
    },
  ],
});
