// Runs after every build (locally, in CI and on Netlify). Any failure exits 1,
// which fails the build and keeps the live site on the last working deploy.
// Checks every built page for: broken internal links and anchors, missing
// files, and complete SEO (title, description, h1, canonical, hreflang pairs,
// share tags, valid JSON-LD, alt text, sitemap).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const DIST = 'dist';
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;
const errors = [];
const titles = new Map();
const descriptions = new Map();

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

/** The built file an internal URL points at, or null. */
const fileFor = (page, url) => {
  const path = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!path) return page; // same-page anchor
  const target = path.startsWith('/') ? join(DIST, path) : join(dirname(page), path);
  return [target, join(target, 'index.html'), `${target}.html`].find(
    (f) => existsSync(f) && statSync(f).isFile(),
  ) || null;
};

/** The built file for an absolute URL on this site (canonical, hreflang, sitemap). */
const fileForAbsolute = (url) => fileFor(join(DIST, 'index.html'), new URL(url).pathname);

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const html = Object.fromEntries(
  walk(DIST).filter((f) => f.endsWith('.html')).map((f) => [f, readFileSync(f, 'utf8')]),
);
const hasId = (file, id) => new RegExp(`\\sid="${id}"`).test(html[file] ?? '');
const alternates = (page) =>
  Object.fromEntries(
    [...html[page].matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
  );

for (const [page, source] of Object.entries(html)) {
  const fail = (msg) => errors.push(`${page}: ${msg}`);
  const is404 = page.endsWith('404.html');

  // Links, images, fonts, icons and video: every internal target must exist.
  const urls = [...source.matchAll(/\s(?:href|src|poster|data-src-[\w-]+)="([^"]+)"/g)].map((m) => m[1]);
  const srcsets = [...source.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
    m[1].split(',').map((s) => s.trim().split(/\s+/)[0]),
  );
  for (const url of [...urls, ...srcsets]) {
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const target = fileFor(page, url);
    if (!target) fail(`broken link or missing file: ${url}`);
    const anchor = url.split('#')[1];
    if (target?.endsWith('.html') && anchor && !hasId(target, anchor)) fail(`link to a missing anchor: ${url}`);
  }
  for (const tag of source.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []) {
    if (!/rel="[^"]*noopener/.test(tag)) fail(`new-tab link without rel="noopener": ${attr(tag, 'href')}`);
  }

  // Title and description: present, unique, within length.
  const title = source.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail('missing <title>');
  else {
    if (title.length > TITLE_MAX) fail(`title is ${title.length} characters (max ${TITLE_MAX}): ${title}`);
    if (titles.has(title)) fail(`duplicate title, also on ${titles.get(title)}`);
    titles.set(title, page);
  }
  const description = source.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!description) fail('missing meta description');
  else {
    if (description.length > DESCRIPTION_MAX) fail(`description is ${description.length} characters (max ${DESCRIPTION_MAX})`);
    if (descriptions.has(description)) fail(`duplicate description, also on ${descriptions.get(description)}`);
    descriptions.set(description, page);
  }

  const h1s = (source.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(`expected one h1, found ${h1s}`);
  for (const img of source.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt="/.test(img)) fail(`image without alt: ${img.slice(0, 80)}`);
  }
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) {
    if (!source.includes(`"${tag}"`)) fail(`missing ${tag}`);
  }

  // Canonical points at this page; hreflang lists en, es and x-default, and the other language links back.
  const canonical = source.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) fail('missing canonical');
  else if (!is404 && fileForAbsolute(canonical) !== page) fail(`canonical does not point at this page: ${canonical}`);
  const alt = alternates(page);
  for (const lang of ['en', 'es', 'x-default']) {
    if (!alt[lang]) fail(`missing hreflang ${lang}`);
    else if (!fileForAbsolute(alt[lang])) fail(`hreflang ${lang} points at a missing page: ${alt[lang]}`);
  }
  if (!is404 && alt.en && alt.es) {
    const other = fileForAbsolute(alt.en) === page ? fileForAbsolute(alt.es) : fileForAbsolute(alt.en);
    const back = other && alternates(other);
    if (back && (back.en !== alt.en || back.es !== alt.es)) fail(`hreflang pair does not match on ${other}`);
  }

  // Structured data must be valid JSON with a type.
  for (const [, json] of source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      if (!JSON.parse(json)['@type']) fail('JSON-LD block without @type');
    } catch {
      fail('invalid JSON-LD');
    }
  }
}

// Sitemap: every entry is a real page, and every indexable page is listed.
const sitemap = existsSync(join(DIST, 'sitemap.xml')) ? readFileSync(join(DIST, 'sitemap.xml'), 'utf8') : '';
if (!sitemap) errors.push('sitemap.xml is missing');
const listed = new Set();
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const file = fileForAbsolute(loc);
  if (!file) errors.push(`sitemap.xml lists a missing page: ${loc}`);
  else listed.add(file);
}
for (const page of Object.keys(html)) {
  if (!page.endsWith('404.html') && !listed.has(page)) errors.push(`${page}: not listed in sitemap.xml`);
}

if (errors.length) {
  console.error(`\ncheck-dist: ${errors.length} problem(s)\n` + errors.join('\n'));
  process.exit(1);
}
console.log(`check-dist: ${Object.keys(html).length} page(s) OK`);
