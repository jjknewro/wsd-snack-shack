import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { TextField } from '../components/TextField'

describe('TextField', () => {
  it('associates the label with the input', () => {
    render(<TextField label="Camper count" />)

    expect(screen.getByLabelText('Camper count')).toBeVisible()
  })

  it('renders no error message by default', () => {
    render(<TextField label="Camper count" />)

    expect(screen.getByLabelText('Camper count')).toHaveAttribute('aria-invalid', 'false')
  })

  it('shows an error message and marks the input invalid when provided', () => {
    render(<TextField label="Camper count" errorMessage="Must be a positive number" />)

    const input = screen.getByLabelText('Camper count')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Must be a positive number')).toBeVisible()
    expect(input).toHaveAccessibleDescription('Must be a positive number')
  })
})
