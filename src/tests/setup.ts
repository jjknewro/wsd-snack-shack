import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// @testing-library/react's auto-cleanup relies on a *global* afterEach,
// which isn't present since this project uses explicit vitest imports
// (test.globals is not enabled) - register it explicitly instead.
afterEach(() => {
  cleanup()
})
