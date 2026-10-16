// schema.org structured data builders, shared by the home and service pages.
import { zone1Towns } from './zones';
import type { Lang } from './services';

const areaServed = zone1Towns.map((name) => ({ '@type': 'Place', name: `${name}, Guanacaste, Costa Rica` }));

export const organization = (site: URL, lang: Lang) => ({
  '@type': 'LocalBusiness',
  '@id': new URL('/#business', site).href,
  name: 'TropiFix',
  url: new URL(lang === 'en' ? '/' : '/es/', site).href,
  logo: new URL('/apple-touch-icon.png', site).href,
  image: new URL('/og-default.jpg', site).href,
  slogan: lang === 'en' ? 'Local pros for every fix.' : 'Profesionales locales para cada arreglo.',
  address: { '@type': 'PostalAddress', addressRegion: 'Guanacaste', addressCountry: 'CR' },
  areaServed,
  sameAs: ['https://www.instagram.com/tropifixcr', 'https://www.facebook.com/tropifixcr'],
});

export const faqSchema = (faqs: string[][]) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

export const serviceSchema = (site: URL, name: string, description: string, url: string) => ({
  '@type': 'Service',
  name,
  serviceType: name,
  description,
  url: new URL(url, site).href,
  provider: { '@id': new URL('/#business', site).href, '@type': 'LocalBusiness', name: 'TropiFix' },
  areaServed,
});

export const breadcrumbSchema = (site: URL, items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: new URL(path, site).href,
  })),
});
