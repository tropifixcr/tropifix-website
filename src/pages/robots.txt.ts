import { siteUrl, indexable } from '../../site.config.mjs';

export const GET = () =>
  new Response(
    indexable ? `User-agent: *\nAllow: /\n` : `User-agent: *\nDisallow: /\n`,
  );
