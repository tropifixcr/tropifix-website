import { defineConfig } from 'astro/config';
import { siteUrl } from './site.config.mjs';

export default defineConfig({
  site: siteUrl,
  // /services/plumbing.html (served as /services/plumbing), while /es/ stays a folder.
  build: { format: 'preserve' },
});
