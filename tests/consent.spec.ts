import { test, expect, type Page } from '@playwright/test';

// Cookie consent: GA4 must not be requested until the visitor accepts.
async function watchAnalytics(page: Page) {
  const requests: string[] = [];
  await page.route('**/www.googletagmanager.com/**', (route) => {
    requests.push(route.request().url());
    return route.abort();
  });
  return requests;
}
const banner = (page: Page) => page.getByRole('region', { name: 'Cookies' });

test('no analytics before a choice, and none after declining', async ({ page }) => {
  const requests = await watchAnalytics(page);
  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  await page.locator('label:has(input[name=service][value="plumbing"])').click();
  expect(requests).toEqual([]);

  await page.getByRole('button', { name: 'Decline' }).click();
  await expect(banner(page)).toBeHidden();
  await page.reload();
  await expect(banner(page)).toBeHidden();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => window.tfAnalyticsOn)).toBeFalsy();
});

test('accepting loads GA4 once, with the choice remembered on other pages', async ({ page }) => {
  const requests = await watchAnalytics(page);
  await page.goto('/es/');
  await page.getByRole('button', { name: 'Aceptar' }).click();
  await expect(banner(page)).toBeHidden();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0]).toContain('gtag/js?id=G-TEST000000');

  await page.goto('/services/pool-care');
  await expect(banner(page)).toBeHidden();
  await expect.poll(() => requests.length).toBe(2);
});

test('test visits are never measured, even with consent', async ({ page }) => {
  const requests = await watchAnalytics(page);
  await page.addInitScript(() => localStorage.setItem('tf-consent', 'granted'));
  await page.goto('/?test=1');
  await page.locator('label:has(input[name=service][value="plumbing"])').click();
  expect(requests).toEqual([]);
});

test('the banner pushes the page down instead of covering it', async ({ page }) => {
  await page.goto('/');
  const bannerBox = (await banner(page).boundingBox())!;
  const headerBox = (await page.locator('header').boundingBox())!;
  expect(headerBox.y).toBeGreaterThanOrEqual(bannerBox.y + bannerBox.height - 1);
});

test('cookie settings in the footer brings the banner back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Accept' }).click();
  await page.getByRole('button', { name: 'Cookie settings' }).click();
  await expect(banner(page)).toBeVisible();
});
