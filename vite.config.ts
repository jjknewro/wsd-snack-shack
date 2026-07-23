import { copyFile, rm } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// The local-only workbook-snapshot viewer (Requirements.tsx) reads real
// counselor names from public/data/workbook-snapshot.json — gitignored and
// never meant to leave this machine (see IMPLEMENTATION-LOG-MVP.md). Vite's
// public-dir copy has no "exclude" option, so without this the file would
// be silently included — and therefore publicly served — in every
// production build. Runs after the PWA plugin's own closeBundle (which
// generates the precache manifest; that manifest is told to skip this file
// via globIgnores below), so nothing in the shipped app ever references or
// serves it.
function excludeLocalWorkbookSnapshot(): Plugin {
  return {
    name: 'exclude-local-workbook-snapshot',
    apply: 'build',
    closeBundle: async () => {
      await rm(fileURLToPath(new URL('./dist/data/workbook-snapshot.json', import.meta.url)), { force: true })
    },
  }
}

// Static hosts like GitHub Pages have no server-side rewrite for
// client-side routes (React Router) — a direct visit or refresh on
// /roster would 404 without this. GitHub Pages specifically falls back to
// serving 404.html for any unmatched path, so a copy of index.html there
// lets the app boot and React Router take over from window.location as
// normal. Harmless for other static hosts too, so this always runs, not
// just for the GH_PAGES build.
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    closeBundle: async () => {
      await copyFile(
        fileURLToPath(new URL('./dist/index.html', import.meta.url)),
        fileURLToPath(new URL('./dist/404.html', import.meta.url)),
      )
    },
  }
}

// Set only for the GitHub Pages deploy build, which is served from a
// subpath (https://<user>.github.io/wsd-snack-shack/) rather than a domain
// root — unlike every other build target here (local dev, Netlify), which
// serve from '/'. Kept as an opt-in env var rather than always using the
// subpath, so `npm run dev`/`npm run build`/`npm run preview` keep working
// exactly as they always have.
const base = process.env.GH_PAGES ? '/wsd-snack-shack/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // main.tsx registers the service worker itself via virtual:pwa-register
      // (so it can force a reload on update) - injectRegister's own auto
      // <script> tag would otherwise register it a second time redundantly.
      injectRegister: false,
      // Caches the built app shell (JS/CSS/HTML) and the bundled data files
      // for offline reload — not "full offline data synchronization" (no
      // network sync exists to offer; see ARCHITECTURE.md's Offline
      // Behavior section, which already describes the app as fully
      // client-side with no network dependency after first load).
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
        globIgnores: ['data/workbook-snapshot.json'],
      },
      manifest: {
        name: 'WSD Snack Shack',
        short_name: 'Snack Shack',
        description: 'Camp snack distribution tracking for a single operator.',
        start_url: base,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1a5fb4',
        icons: [
          { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: `${base}icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
    excludeLocalWorkbookSnapshot(),
    spaFallback404(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 5173 (Vite's own default) is already in use by another project on this
  // machine (Schmucks Studio) - pinned to a distinct port to avoid colliding.
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
})
