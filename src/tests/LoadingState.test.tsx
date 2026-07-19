import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { LoadingState } from '../components/LoadingState'

describe('LoadingState', () => {
  it('renders a default label', () => {
    render(<LoadingState />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading…')
  })

  it('renders a custom label', () => {
    render(<LoadingState label="Loading roster…" />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading roster…')
  })
})
