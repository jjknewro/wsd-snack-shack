import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// vite-plugin-pwa's auto-injected registerSW.js only calls
// navigator.serviceWorker.register() - it never checks for updates or
// reloads once a new one activates, so a phone can sit on a stale build
// indefinitely even after a fresh deploy. registerType: 'autoUpdate' (see
// vite.config.ts) makes the *service worker* wait for an explicit
// SKIP_WAITING message rather than activating unprompted - the callback
// registerSW() returns is what actually sends that message (a bare
// window.location.reload() here would just re-fetch the page through the
// still-old active worker, forever). This is the missing half for a
// phone-only, no-app-store app where re-checking manually isn't realistic.
const updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateServiceWorker(true)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
