import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { StatusBadge } from '../components/StatusBadge'

describe('StatusBadge', () => {
  it('always renders a real text label, not just a color', () => {
    render(<StatusBadge variant="completed" label="Picked Up" />)

    expect(screen.getByText('Picked Up')).toBeVisible()
  })

  it.each([
    ['pending', 'Pending'],
    ['completed', 'Picked Up'],
    ['warning', 'Special Snack'],
    ['critical', 'Allergy'],
  ] as const)('renders the %s variant with its label', (variant, label) => {
    render(<StatusBadge variant={variant} label={label} />)

    expect(screen.getByText(label)).toBeVisible()
  })
})
