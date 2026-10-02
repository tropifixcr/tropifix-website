// Every indexable page in both languages, each with its hreflang alternates.
import { siteUrl } from '../../site.config.mjs';
import { services, servicePath } from '../data/services';

const pairs = [
  { en: '/', es: '/es/' },
  { en: '/privacy', es: '/es/privacidad' },
  ...services.map((s) => ({ en: servicePath(s, 'en'), es: servicePath(s, 'es') })),
];

const entry = (path: string, pair: { en: string; es: string }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${pair.en}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}${pair.es}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${pair.en}"/>
  </url>`;

export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pairs.flatMap((pair) => [entry(pair.en, pair), entry(pair.es, pair)]).join('\n')}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
