import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { TodayRefreshControls } from '../components/TodayRefreshControls'

describe('TodayRefreshControls', () => {
  it('shows the last-refreshed timestamp', () => {
    render(<TodayRefreshControls lastRefreshedAt="10:15:00 AM" refreshError={null} onRefresh={vi.fn()} />)

    expect(screen.getByText('Last refreshed: 10:15:00 AM')).toBeVisible()
  })

  it('calls onRefresh when the button is clicked', () => {
    const onRefresh = vi.fn()
    render(<TodayRefreshControls lastRefreshedAt="10:00:00 AM" refreshError={null} onRefresh={onRefresh} />)

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(onRefresh).toHaveBeenCalledOnce()
  })

  it('shows no error message when refreshError is null', () => {
    render(<TodayRefreshControls lastRefreshedAt="10:15:00 AM" refreshError={null} onRefresh={vi.fn()} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a clear error message when a refresh attempt fails, without hiding the timestamp of the last successful one', () => {
    render(
      <TodayRefreshControls lastRefreshedAt="10:15:00 AM" refreshError="Something went wrong." onRefresh={vi.fn()} />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.')
    expect(screen.getByText('Last refreshed: 10:15:00 AM')).toBeVisible()
  })
})
