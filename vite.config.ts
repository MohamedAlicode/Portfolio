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

// Précharge les deux polices de l'écran d'intro et du hero, pour qu'elles
// soient là dès le premier affichage (pas de texte qui change de forme)
function preloadFonts(): Plugin {
  const wanted = [/instrument-serif-latin-400-normal-.*\.woff2$/, /geist-latin-wght-normal-.*\.woff2$/]
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html, ctx) => {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => wanted.some((re) => re.test(f)))
        const links = files
          .map((f) => `<link rel="preload" href="./${f}" as="font" type="font/woff2" crossorigin />`)
          .join('\n    ')
        return html.replace('</title>', `</title>\n    ${links}`)
      },
    },
  }
}

// base relative : le site fonctionne aussi bien à la racine d'un domaine (Vercel)
// que dans un sous-dossier (GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [seoFiles(), preloadFonts(), react(), tailwindcss()],
})
