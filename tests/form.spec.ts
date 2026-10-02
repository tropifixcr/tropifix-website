import { test, expect, type Page } from '@playwright/test';

// Run against `npm run build:test` (a production-style build with a fake GA4 ID).
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

/** Names of the GA4 events pushed so far. */
const sentEvents = (page: Page) =>
  page.evaluate(() =>
    (window.dataLayer as unknown as ArrayLike<unknown>[])
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === 'event')
      .map((entry) => entry[1]),
  );

const choose = (page: Page, name: string, value: string) =>
  page.locator(`label:has(input[name=${name}][value="${value}"])`).click();
const next = (page: Page) => page.locator('.rf__next').click();

/** Steps 1 and 2: pick the service, then describe the job. Leaves the form on step 2. */
async function fillStep1(page: Page, descriptionLabel = 'Describe the problem') {
  await choose(page, 'service', 'plumbing');
  await next(page);
  await choose(page, 'job_type', 'repair');
  await page.getByLabel(descriptionLabel).fill('Kitchen tap leaks under the sink.');
}

test('full run-through: validation, back and forward, photo, thank-you, WhatsApp', async ({ page }) => {
  const posts = await interceptSubmit(page);
  await page.goto('/?test');
  await expect(page.getByText('Step 1 of 5')).toBeVisible();

  // Step 1 is the service only; step 2 is the job. Errors show, then clear.
  await next(page);
  await expect(page.getByText('Pick a service')).toBeVisible();
  await choose(page, 'service', 'plumbing');
  await next(page);
  await expect(page.getByText('Step 2 of 5')).toBeVisible();
  await next(page);
  await expect(page.getByText('Pick the type of job.')).toBeVisible();
  await expect(page.getByText('Tell us a little about the problem.')).toBeVisible();
  await choose(page, 'job_type', 'repair');
  await page.getByLabel('Describe the problem').fill('Kitchen tap leaks under the sink.');
  const photo = await bigPhoto(page);
  await page.locator('#rf-photo-picker').setInputFiles(photo);
  await expect(page.locator('.rf__thumbs img')).toHaveCount(1);
  await next(page);

  // Step 3: Zone 1 shows the town list.
  await expect(page.getByText('Step 3 of 5')).toBeVisible();
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
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.locator('input[name=service][value=plumbing]')).toBeChecked();
  await next(page);
  await next(page);
  await expect(page.locator('#rf-town-select')).toHaveValue('Playa Flamingo');
  await next(page);

  // Step 4
  await next(page);
  await expect(page.getByText('Tell us how soon you need it.')).toBeVisible();
  await choose(page, 'urgency', 'week');
  await choose(page, 'budget', '250-1000');
  await next(page);

  // Step 5: consent is required, phone must be digits.
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
  expect(await sentEvents(page)).toEqual([]);
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

test('analytics events fire for visitors who accepted cookies, and a filled honeypot sends nothing', async ({ page }) => {
  const posts = await interceptSubmit(page);
  // Consent already given; the GA4 script itself is blocked so nothing reaches Google.
  await page.route('**/www.googletagmanager.com/**', (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem('tf-consent', 'granted'));
  await page.goto('/');
  await fillStep1(page);
  await next(page);
  expect(await sentEvents(page)).toEqual(['form_started', 'form_step_completed', 'form_step_completed']);

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

test('a service page has that service already selected', async ({ page }) => {
  await page.goto('/services/pool-care');
  await expect(page.locator('input[name=service][value=pool-care]')).toBeChecked();
  // With the service known, the form opens on the job step.
  await expect(page.getByText('Step 2 of 5')).toBeVisible();
  await page.goto('/es/servicios/mantenimiento-piscinas');
  await expect(page.locator('input[name=service][value=pool-care]')).toBeChecked();
});

test('the language toggle leads to the matching page, not the home page', async ({ page }) => {
  for (const [from, to] of [
    ['/', '/es/'],
    ['/services/ac-repair', '/es/servicios/reparacion-aire-acondicionado'],
    ['/privacy', '/es/privacidad'],
  ]) {
    await page.goto(from);
    await page.locator('[data-lang-switch]').click();
    await expect(page).toHaveURL(new RegExp(`${to}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await page.locator('[data-lang-switch]').click();
    await expect(page).toHaveURL(new RegExp(`${from}$`));
  }
});

test('the Spanish form works and sends the Spanish summary', async ({ page }) => {
  const posts = await interceptSubmit(page);
  await page.goto('/es/?test');
  await fillStep1(page, 'Describa el problema');
  await next(page);
  await page.getByLabel('Zona').selectOption('zone1');
  await page.locator('#rf-town-select').selectOption('Huacas');
  await choose(page, 'property_type', 'house');
  await choose(page, 'on_site', 'owner');
  await next(page);
  await choose(page, 'urgency', 'week');
  await choose(page, 'budget', 'unsure');
  await next(page);
  await page.getByLabel('Nombre').fill('TEST – automated');
  await page.getByLabel('Número de WhatsApp').fill('88881234');
  await page.locator('input[name=consent]').check();
  await page.getByRole('button', { name: 'Enviar mi solicitud' }).click();
  await expect(page.getByRole('heading', { name: 'Gracias, TEST – automated.' })).toBeVisible();
  expect(posts[0]).toContain('[TEST] Nueva solicitud: Fontanería, Huacas');
  const href = await page.getByRole('link', { name: 'Continuar por WhatsApp' }).getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('Servicio: Fontanería');
});

test('a made-up address shows the 404 page', async ({ page }) => {
  await page.goto('/404');
  await expect(page.getByRole('heading', { name: 'We can’t find that page' }).or(page.getByRole('heading', { name: "We can't find that page" }))).toBeVisible();
});
