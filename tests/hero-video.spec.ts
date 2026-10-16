import { test, expect } from '@playwright/test';

// The hero loop: loads after the page, only when motion and data are fine.
test('the hero video loads after the page, with the phone or desktop file', async ({ page, isMobile }) => {
  await page.goto('/');
  const sources = page.locator('.hero__video source');
  await expect(sources.first()).toHaveAttribute('src', isMobile ? '/video/home-hero-720.mp4' : '/video/home-hero-1280.webm');
  // The poster stays underneath as the page's main image.
  await expect(page.locator('.hero__media img')).toBeVisible();
});

test('with reduced motion, only the still shows and no video downloads', async ({ page }) => {
  const videoRequests: string[] = [];
  page.on('request', (req) => req.url().includes('/video/') && videoRequests.push(req.url()));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('load');
  await expect(page.locator('.hero__video source')).toHaveCount(0);
  expect(videoRequests).toEqual([]);
});
