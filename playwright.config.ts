import { defineConfig, devices } from '@playwright/test';

// Browser tests run against the built site (npm run build first), at phone and desktop size.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321' },
  webServer: { command: 'npm run preview', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
});
