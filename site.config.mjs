// The one place the site's address is decided. To go live on the real domain,
// set SITE_URL=https://tropifixcr.com in Netlify (see docs/go-live-domain-checklist.md).
const env = process.env;

export const siteUrl = (
  env.CONTEXT === 'production'
    ? env.SITE_URL || env.URL
    : env.DEPLOY_PRIME_URL || 'http://localhost:4321'
).replace(/\/$/, '');

const host = new URL(siteUrl).hostname;

// Search engines stay blocked on netlify.app, previews and localhost.
export const indexable = !host.endsWith('netlify.app') && host !== 'localhost';
