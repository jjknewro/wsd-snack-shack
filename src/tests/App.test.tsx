import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import App from '../App'

describe('App', () => {
  it('renders the WSD Snack Shack branding and defaults to the Today page', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'WSD Snack Shack', level: 1 })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Today', level: 2 })).toBeVisible()
  })
})
