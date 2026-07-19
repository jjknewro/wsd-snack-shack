import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 5173 (Vite's own default) is already in use by another project on this
  // machine (Schmucks Studio) - pinned to a distinct port to avoid colliding.
  server: {
    port: 5180,
    strictPort: true,
  },
})
