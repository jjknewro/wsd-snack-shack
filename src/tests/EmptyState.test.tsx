import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { EmptyState } from '../components/EmptyState'

describe('EmptyState', () => {
  it('renders its message', () => {
    render(<EmptyState message="No bunks match your search." />)

    expect(screen.getByText('No bunks match your search.')).toBeVisible()
  })
})
