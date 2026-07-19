import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 5173 (Vite's own default) is already in use by another project on this
  // machine (Schmucks Studio) - pinned to a distinct port to avoid colliding.
  server: {
    port: 5180,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
})
