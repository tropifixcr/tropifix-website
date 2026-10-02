// Runs after every build (locally, in CI and on Netlify). Any failure exits 1,
// which fails the build and keeps the live site on the last working deploy.
// Checks every built page for: broken internal links, missing images/assets,
// and the SEO basics (title, description, one h1, canonical).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const DIST = 'dist';
const errors = [];
const titles = new Map();

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const resolves = (page, url) => {
  const path = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!path) return true; // same-page anchor
  const target = path.startsWith('/') ? join(DIST, path) : join(dirname(page), path);
  return (
    (existsSync(target) && statSync(target).isFile()) ||
    existsSync(join(target, 'index.html')) ||
    existsSync(`${target}.html`)
  );
};

const pages = walk(DIST).filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const fail = (msg) => errors.push(`${page}: ${msg}`);

  const urls = [...html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)].map((m) => m[1]);
  const srcsets = [...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
    m[1].split(',').map((s) => s.trim().split(/\s+/)[0]),
  );
  for (const url of [...urls, ...srcsets]) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    if (!resolves(page, url)) fail(`broken link or missing file: ${url}`);
  }

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail('missing <title>');
  else if (titles.has(title)) fail(`duplicate title, also on ${titles.get(title)}`);
  else titles.set(title, page);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail('missing meta description');
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) fail('missing canonical');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(`expected one h1, found ${h1s}`);
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt="/.test(img)) fail(`image without alt: ${img.slice(0, 80)}`);
  }
}

if (errors.length) {
  console.error(`\ncheck-dist: ${errors.length} problem(s)\n` + errors.join('\n'));
  process.exit(1);
}
console.log(`check-dist: ${pages.length} page(s) OK`);
