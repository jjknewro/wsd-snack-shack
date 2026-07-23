import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// vite-plugin-pwa's auto-injected registerSW.js only calls
// navigator.serviceWorker.register() - it never checks for updates or
// reloads once a new one activates, so a phone can sit on a stale build
// indefinitely even after a fresh deploy. registerType: 'autoUpdate' (see
// vite.config.ts) only controls skipWaiting/clientsClaim on the *service
// worker* side; onNeedRefresh here is what actually reloads the *page* to
// pick up the new one, which is the missing half for a phone-only,
// no-app-store app where re-checking manually isn't realistic.
registerSW({
  immediate: true,
  onNeedRefresh() {
    window.location.reload()
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
