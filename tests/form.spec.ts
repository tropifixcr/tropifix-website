import { test, expect, type Page } from '@playwright/test';

// The submission is intercepted, never sent: no test lead can reach Netlify or the inbox.
async function interceptSubmit(page: Page) {
  const posts: string[] = [];
  await page.route('**/*', (route) => {
    const req = route.request();
    if (req.method() !== 'POST') return route.continue();
    posts.push(req.postData() || '');
    return route.fulfill({ status: 200, body: 'ok' });
  });
  return posts;
}

// A 2400x1800 PNG, large enough that compression must shrink it.
async function bigPhoto(page: Page) {
  const base64 = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 2400; c.height = 1800;
    const ctx = c.getContext('2d')!;
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `hsl(${i * 7}, 60%, 50%)`;
      ctx.fillRect((i * 97) % 2400, (i * 61) % 1800, 300, 200);
    }
    return c.toDataURL('image/png').split(',')[1];
  });
  return { name: 'leak.png', mimeType: 'image/png', buffer: Buffer.from(base64, 'base64') };
}

const choose = (page: Page, name: string, value: string) =>
  page.locator(`label:has(input[name=${name}][value="${value}"])`).click();
const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

async function fillStep1(page: Page) {
  await choose(page, 'service', 'plumbing');
  await choose(page, 'job_type', 'repair');
  await page.getByLabel('Describe the problem').fill('Kitchen tap leaks under the sink.');
}

test('full run-through: validation, back and forward, photo, thank-you, WhatsApp', async ({ page }) => {
  const posts = await interceptSubmit(page);
  await page.goto('/?test');
  await expect(page.getByText('Step 1 of 4')).toBeVisible();

  // Step 1: errors show, then clear.
  await next(page);
  await expect(page.getByText('Pick a service')).toBeVisible();
  await expect(page.getByText('Pick the type of job.')).toBeVisible();
  await expect(page.getByText('Tell us a little about the problem.')).toBeVisible();
  await fillStep1(page);
  const photo = await bigPhoto(page);
  await page.locator('#rf-photo-picker').setInputFiles(photo);
  await expect(page.locator('.rf__thumbs img')).toHaveCount(1);
  await next(page);

  // Step 2: Zone 1 shows the town list.
  await expect(page.getByText('Step 2 of 4')).toBeVisible();
  await next(page);
  await expect(page.getByText('Pick a zone.')).toBeVisible();
  await page.getByLabel('Zone').selectOption('zone1');
  await expect(page.locator('#rf-town-select')).toBeVisible();
  await expect(page.locator('#rf-town')).toBeHidden();
  await page.locator('#rf-town-select').selectOption('Playa Flamingo');
  await choose(page, 'property_type', 'rental');
  await choose(page, 'on_site', 'empty');

  // Back and forward keeps answers.
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByLabel('Describe the problem')).toHaveValue('Kitchen tap leaks under the sink.');
  await expect(page.locator('input[name=service][value=plumbing]')).toBeChecked();
  await next(page);
  await expect(page.locator('#rf-town-select')).toHaveValue('Playa Flamingo');
  await next(page);

  // Step 3
  await next(page);
  await expect(page.getByText('Tell us how soon you need it.')).toBeVisible();
  await choose(page, 'urgency', 'week');
  await choose(page, 'budget', '250-1000');
  await next(page);

  // Step 4: consent is required, phone must be digits.
  const send = page.getByRole('button', { name: 'Send my request' });
  await page.getByLabel('Name').fill('TEST – automated');
  await page.getByLabel('WhatsApp number').fill('abc');
  await send.click();
  await expect(page.getByText('Enter your WhatsApp number')).toBeVisible();
  await expect(page.getByText('We need your agreement')).toBeVisible();
  expect(posts).toHaveLength(0);
  await page.getByLabel('WhatsApp number').fill('8888 1234');
  await page.locator('input[name=consent]').check();
  await send.click();

  // Thank-you state promises 4 hours only in the live zone.
  await expect(page.getByRole('heading', { name: 'Thanks, TEST – automated.' })).toBeVisible();
  await expect(page.getByText('within 4 hours. We’ll check')).toBeVisible();

  // What was sent: every answer, the test flag, a [TEST] subject and a compressed WebP.
  expect(posts).toHaveLength(1);
  const body = posts[0];
  for (const part of ['name="form-name"', 'request', 'plumbing', 'zone1', 'Playa Flamingo', 'rental', 'week', '250-1000', '+506', '8888 1234', '[TEST] New request: Plumbing, Playa Flamingo']) {
    expect(body).toContain(part);
  }
  expect(body).toMatch(/name="test"\r\n\r\n1/);
  expect(body).toContain('filename="leak.webp"');
  expect(body).toContain('Content-Type: image/webp');
  expect(body).not.toContain('name="photo2"');
  expect(body.length).toBeLessThan(photo.buffer.length);

  // The WhatsApp link is built, not opened.
  const href = await page.getByRole('link', { name: 'Continue on WhatsApp' }).getAttribute('href');
  const text = decodeURIComponent(href!.split('?text=')[1]);
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  for (const part of ['Service: Plumbing', 'Zone: Tamarindo – Las Catalinas', 'Town: Playa Flamingo', 'Urgency: This week', 'Budget: $250–$1,000', 'Name: TEST – automated', 'Kitchen tap leaks']) {
    expect(text).toContain(part);
  }

  // Test runs never reach analytics.
  expect(await page.evaluate(() => window.dataLayer ?? [])).toHaveLength(0);
});

test('other zones get a text field and the honest confirmation', async ({ page }) => {
  await interceptSubmit(page);
  await page.goto('/?test');
  await fillStep1(page);
  await next(page);
  await page.getByLabel('Zone').selectOption('papagayo-coco');
  await expect(page.locator('#rf-town-select')).toBeHidden();
  await page.locator('#rf-town').fill('Playas del Coco');
  await choose(page, 'property_type', 'house');
  await choose(page, 'on_site', 'owner');
  await next(page);
  await choose(page, 'urgency', 'month');
  await choose(page, 'budget', 'unsure');
  await next(page);
  await page.getByLabel('Name').fill('TEST – automated');
  await page.getByLabel('WhatsApp number').fill('88881234');
  await page.locator('input[name=consent]').check();
  await page.getByRole('button', { name: 'Send my request' }).click();
  await expect(page.locator('[data-thanks=other]')).toBeVisible();
  await expect(page.locator('[data-thanks=live]')).toBeHidden();
});

test('analytics events fire for real visitors, and a filled honeypot sends nothing', async ({ page }) => {
  const posts = await interceptSubmit(page);
  await page.goto('/');
  await fillStep1(page);
  await next(page);
  const events = await page.evaluate(() => (window.dataLayer as { event: string }[]).map((e) => e.event));
  expect(events).toEqual(['form_started', 'form_step_completed']);

  await page.getByLabel('Zone').selectOption('zone1');
  await page.locator('#rf-town-select').selectOption('Tamarindo');
  await choose(page, 'property_type', 'house');
  await choose(page, 'on_site', 'owner');
  await next(page);
  await choose(page, 'urgency', 'week');
  await choose(page, 'budget', 'unsure');
  await next(page);
  await page.getByLabel('Name').fill('Bot');
  await page.getByLabel('WhatsApp number').fill('88881234');
  await page.locator('input[name=consent]').check();
  await page.locator('input[name=bot-field]').evaluate((el: HTMLInputElement) => (el.value = 'spam'));
  await page.getByRole('button', { name: 'Send my request' }).click();
  await expect(page.getByRole('heading', { name: 'Thanks, Bot.' })).toBeVisible();
  expect(posts).toHaveLength(0);
});

test('a service tile pre-selects that service in the form', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-pick-service=pool-care]').click();
  await expect(page.locator('input[name=service][value=pool-care]')).toBeChecked();
});
