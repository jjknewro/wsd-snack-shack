import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// @testing-library/react's auto-cleanup relies on a *global* afterEach,
// which isn't present since this project uses explicit vitest imports
// (test.globals is not enabled) - register it explicitly instead.
afterEach(() => {
  cleanup()
  // Clears state written by localStorageSnackRepository so tests don't leak
  // into each other. Requires running with NODE_OPTIONS=--no-experimental-webstorage
  // (see package.json's "test" script) - Node 22+'s own global localStorage
  // otherwise shadows jsdom's working implementation with a non-functional
  // stub when no --localstorage-file is configured.
  window.localStorage.clear()
})
