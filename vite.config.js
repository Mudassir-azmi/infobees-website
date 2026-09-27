import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/**
 * Production-only build step:
 * - fails early if VITE_API_URL is missing (the site would call localhost)
 * - writes robots.txt (hides /admin, points to the sitemap)
 * - writes Netlify _redirects so /sitemap.xml is served live by the backend
 */
function seoFiles(env) {
  let outDir = 'dist'
  return {
    name: 'infobees-seo-files',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
      if (!env.VITE_API_URL) {
        throw new Error(
          'VITE_API_URL is not set. Add it to .env (local) or the Netlify environment variables, e.g. https://your-backend.onrender.com/api'
        )
      }
      // On Netlify (NETLIFY=true) a localhost API can never work for visitors.
      if (env.NETLIFY && /localhost|127\.0\.0\.1/.test(env.VITE_API_URL)) {
        throw new Error(`VITE_API_URL points to ${env.VITE_API_URL}; set it to the live backend URL in Netlify.`)
      }
    },
    closeBundle() {
      const siteUrl = (env.VITE_SITE_URL || 'https://infobees.in').replace(/\/$/, '')
      const apiUrl = env.VITE_API_URL.replace(/\/$/, '')

      fs.writeFileSync(
        path.join(outDir, 'robots.txt'),
        `User-agent: *\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`
      )
      // Processed before netlify.toml, so this wins over the SPA fallback.
      fs.writeFileSync(path.join(outDir, '_redirects'), `/sitemap.xml  ${apiUrl}/sitemap.xml  200\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  return {
    plugins: [react(), tailwindcss(), seoFiles(env)],
  }
})
