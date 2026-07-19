import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { ErrorState } from '../components/ErrorState'

describe('ErrorState', () => {
  it('renders the error message', () => {
    render(<ErrorState message="Something went wrong." />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.')
  })

  it('does not render a retry action when onRetry is not provided', () => {
    render(<ErrorState message="Something went wrong." />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders and invokes the retry action when onRetry is provided', () => {
    const onRetry = vi.fn()
    render(<ErrorState message="Something went wrong." onRetry={onRetry} />)

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
