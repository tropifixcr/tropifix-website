# TropiFix website

The site for [TropiFix](https://tropifixcr.com): a request form that connects property owners, managers and hotels in Guanacaste, Costa Rica with local trade pros. Static site built with Astro, hosted on Netlify.

Brand rules live in `brand/BRAND.md`. Project rules for Claude Code live in `CLAUDE.md`.

## Run it locally

```bash
npm install
npm run dev
```

`npm run build` builds the site into `dist/` and then runs `scripts/check-dist.mjs`, which fails the build on any broken internal link, missing image or missing SEO tag.

`npm test` runs the request form end to end in a browser at phone and desktop size. Build first with `npm run build:test`, a production-style build with a fake GA4 ID so the cookie banner exists. The tests intercept the submission, so no test lead is ever sent. `npm test` also runs an accessibility check (axe) on every page type and form step. `npm run lighthouse` runs Lighthouse on mobile three times per page type and fails below 90 (median for performance, worst run for accessibility, best practices and SEO).

To try the form by hand without it counting as a real lead, open the page with `?test` at the end of the address: the email subject then starts with `[TEST]` and analytics are skipped.

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
| `PUBLIC_WHATSAPP_NUMBER` | The central WhatsApp number, digits only with country code (for example `506...`). |
| `PUBLIC_CONTACT_EMAIL` | The email shown in the footer and on the privacy page. |
| `PUBLIC_GA4_ID` | The Google Analytics 4 Measurement ID. The cookie banner and GA4 only exist on production deploys with this set; previews never load GA4. |
| `PUBLIC_LEGAL_ENTITY_NAME` | Who is responsible for the data, shown on the privacy page. |

The email that receives leads is set in Netlify under Forms → Form notifications, not in the code.
