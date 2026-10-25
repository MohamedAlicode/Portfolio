import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seo, site } from './src/data/content'

// L'adresse du site n'est écrite qu'une fois, dans src/data/content.ts.
// Ce petit plugin la reporte dans index.html (balises de partage) et
// génère robots.txt et sitemap.xml au moment du build.
function seoFiles(): Plugin {
  const url = site.url.endsWith('/') ? site.url : `${site.url}/`
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${url}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${url}?lang=en" />
  </url>
  <url>
    <loc>${url}?lang=en</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${url}?lang=en" />
  </url>
</urlset>
`
  const person = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: 'Développeur web full-stack',
    url,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
    sameAs: [site.github, site.linkedin],
  })
  return {
    name: 'seo-files',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replaceAll('%SITE_URL%', url)
          .replaceAll('%SITE_TITLE%', seo.title.fr)
          .replaceAll('%SITE_DESCRIPTION%', seo.description.fr.replace(/"/g, '&quot;'))
          .replace('%PERSON_JSON%', person),
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n` })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

// base relative : le site fonctionne aussi bien à la racine d'un domaine (Vercel)
// que dans un sous-dossier (GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [seoFiles(), react(), tailwindcss()],
  build: { minify: process.env.NOMIN ? false : 'oxc' },
})
