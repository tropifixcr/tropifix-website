import { defineConfig, devices } from '@playwright/test';

// Browser tests run against the built site (npm run build first), at phone and desktop size.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  // Its own port, so it never picks up a dev server that happens to be running.
  use: { baseURL: 'http://localhost:4173' },
  // astro preview sometimes detaches into the background (no terminal), which Playwright reads as
  // "exited early". Stopping any old one first and holding the process open covers both cases.
  webServer: {
    command: 'npx astro preview stop; npx astro preview --port 4173; tail -f /dev/null',
    url: 'http://localhost:4173',
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
});
