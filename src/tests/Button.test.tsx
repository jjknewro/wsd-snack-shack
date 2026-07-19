import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { Button } from '../components/Button'

describe('Button', () => {
  it('renders its label and calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Mark Picked Up</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Mark Picked Up' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Mark Picked Up
      </Button>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mark Picked Up' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows a loading state, is marked busy, and blocks clicks while loading', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} loading>
        Mark Picked Up
      </Button>,
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('Mark Picked Up')).not.toBeInTheDocument()

    fireEvent.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })
})
