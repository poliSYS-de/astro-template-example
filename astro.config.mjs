import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Site-Domain wird hier direkt gesetzt (muss zur site.config.ts passen)
// Astro Config kann kein TypeScript importieren, daher separater Wert.
const SITE_URL = 'https://example.de';

export default defineConfig({
  site: SITE_URL,
  integrations: [tailwind(), sitemap()],
  output: 'static',
  build: {
    format: 'directory',
  },
});
