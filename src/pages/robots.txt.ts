import { siteUrl, indexable } from '../../site.config.mjs';

export const GET = () =>
  new Response(
    indexable
      ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
      : `User-agent: *\nDisallow: /\n`,
  );
