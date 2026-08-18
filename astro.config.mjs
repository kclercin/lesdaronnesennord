import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://lesdaronnesennord.fr',
  integrations: [sitemap()],
  build: { format: 'directory' },
})
