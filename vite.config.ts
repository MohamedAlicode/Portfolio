import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relative : le site fonctionne aussi bien à la racine d'un domaine (Vercel)
// que dans un sous-dossier (GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
