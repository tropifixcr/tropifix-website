import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Automated accessibility check (axe) on every page type and every form step, in both languages.
const pages = ['/', '/es/', '/services/pool-care', '/es/servicios/mantenimiento-piscinas', '/privacy', '/es/privacidad', '/404'];

async function expectNoViolations(page: Page, label: string) {
  // Let entrance animations finish: axe reads colours mid-fade as low contrast.
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible')));
  await page.waitForTimeout(700);
  const { violations } = await new AxeBuilder({ page }).analyze();
  const summary = violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`);
  expect(summary, label).toEqual([]);
}

for (const path of pages) {
  test(`no accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expectNoViolations(page, path);
  });
}

for (const path of ['/', '/es/']) {
  test(`no accessibility violations on each form step and its errors (${path})`, async ({ page }) => {
    await page.goto(path);
    const next = page.locator('.rf__next');
    const choose = (name: string, value: string) => page.locator(`label:has(input[name=${name}][value="${value}"])`).click();

    await next.click(); // step 1 with errors showing
    await expectNoViolations(page, 'step 1 errors');
    await choose('service', 'plumbing');
    await choose('job_type', 'repair');
    await page.locator('#rf-description').fill('Test');
    await next.click();

    await next.click();
    await expectNoViolations(page, 'step 2 errors');
    await page.locator('#rf-zone').selectOption('zone1');
    await page.locator('#rf-town-select').selectOption('Tamarindo');
    await choose('property_type', 'house');
    await choose('on_site', 'owner');
    await next.click();

    await next.click();
    await expectNoViolations(page, 'step 3 errors');
    await choose('urgency', 'week');
    await choose('budget', 'unsure');
    await next.click();

    await page.locator('.rf__submit').click();
    await expectNoViolations(page, 'step 4 errors');
  });
}
