import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Caches the built app shell (JS/CSS/HTML) and the bundled data files
      // for offline reload — not "full offline data synchronization" (no
      // network sync exists to offer; see ARCHITECTURE.md's Offline
      // Behavior section, which already describes the app as fully
      // client-side with no network dependency after first load).
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
      },
      manifest: {
        name: 'WSD Snack Shack',
        short_name: 'Snack Shack',
        description: 'Camp snack distribution tracking for a single operator.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1a5fb4',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
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
