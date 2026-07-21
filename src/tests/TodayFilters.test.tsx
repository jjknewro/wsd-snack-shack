import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { TodayFilters } from '../components/TodayFilters'

describe('TodayFilters', () => {
  it('calls onSearchTermChange as the operator types', () => {
    const onSearchTermChange = vi.fn()
    render(
      <TodayFilters
        statusFilter="all"
        onStatusFilterChange={vi.fn()}
        searchTerm=""
        onSearchTermChange={onSearchTermChange}
      />,
    )

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'A1' } })
    expect(onSearchTermChange).toHaveBeenCalledWith('A1')
  })

  it('calls onStatusFilterChange when a status button is clicked', () => {
    const onStatusFilterChange = vi.fn()
    render(
      <TodayFilters
        statusFilter="all"
        onStatusFilterChange={onStatusFilterChange}
        searchTerm=""
        onSearchTermChange={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Pending' }))
    expect(onStatusFilterChange).toHaveBeenCalledWith('pending')
  })

  it('marks the active status filter with aria-pressed, without relying on styling alone', () => {
    render(
      <TodayFilters
        statusFilter="completed"
        onStatusFilterChange={vi.fn()}
        searchTerm=""
        onSearchTermChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Pending' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('hides the Clear filters button when nothing is filtered', () => {
    render(
      <TodayFilters statusFilter="all" onStatusFilterChange={vi.fn()} searchTerm="" onSearchTermChange={vi.fn()} />,
    )

    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('shows Clear filters when a status filter is active, and resets both on click', () => {
    const onStatusFilterChange = vi.fn()
    const onSearchTermChange = vi.fn()
    render(
      <TodayFilters
        statusFilter="pending"
        onStatusFilterChange={onStatusFilterChange}
        searchTerm="alex"
        onSearchTermChange={onSearchTermChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onStatusFilterChange).toHaveBeenCalledWith('all')
    expect(onSearchTermChange).toHaveBeenCalledWith('')
  })
})
