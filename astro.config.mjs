import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://lesdaronnesennord.fr',
  integrations: [
    sitemap({
      // /admin/ est une page Astro (pour que la route existe aussi en dev) :
      // sans ce filtre, l'interface d'administration se retrouve soumise aux
      // moteurs de recherche.
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  build: { format: 'directory' },
})
