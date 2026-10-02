# TropiFix website

The site for [TropiFix](https://tropifixcr.com): a request form that connects property owners, managers and hotels in Guanacaste, Costa Rica with local trade pros. Static site built with Astro, hosted on Netlify.

Brand rules live in `brand/BRAND.md`. Project rules for Claude Code live in `CLAUDE.md`.

## Run it locally

```bash
npm install
npm run dev
```

`npm run build` builds the site into `dist/` and then runs `scripts/check-dist.mjs`, which fails the build on any broken internal link, missing image or missing SEO tag.

## How deploys work

- Nobody pushes to `main`. Work happens on a branch and goes through a pull request.
- Every pull request gets a Netlify deploy preview and runs the `test` GitHub Action. Both must pass before merging.
- Merging to `main` deploys to production. If the build or its checks fail, Netlify keeps the last working version live.
- To roll back: Netlify → Deploys → pick the previous deploy → "Publish deploy".

## Settings (Netlify environment variables)

Values are set in Netlify, never in the code.

| Variable | What it is |
| --- | --- |
| `SITE_URL` | The public address. Unset while on `netlify.app`; search engines are blocked until it points at the real domain. |
