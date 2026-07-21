import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { TodayBunkRow } from '../components/TodayBunkRow'

function renderRow(props: Parameters<typeof TodayBunkRow>[0]) {
  return render(
    <table>
      <tbody>
        <TodayBunkRow {...props} />
      </tbody>
    </table>,
  )
}

describe('TodayBunkRow', () => {
  it('shows the bunk, camper count, and a text-labeled Pending badge for a pending bunk', () => {
    renderRow({ bunk: 'A1', campers: 8, status: 'pending', specialRequirementCount: 0 })

    expect(screen.getByText('A1')).toBeVisible()
    expect(screen.getByText('8')).toBeVisible()
    expect(screen.getByText('Pending')).toBeVisible()
    expect(screen.queryByText('Picked Up')).not.toBeInTheDocument()
  })

  it('shows a distinct, text-labeled Picked Up badge for a completed bunk, distinguishable from pending', () => {
    renderRow({ bunk: 'A1', status: 'completed', specialRequirementCount: 0, pickupTime: '10:15 AM' })

    expect(screen.getByText('Picked Up')).toBeVisible()
    expect(screen.queryByText('Pending')).not.toBeInTheDocument()
    expect(screen.getByText('10:15 AM')).toBeVisible()
  })

  it('shows a dash for camper count when not provided', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0 })

    // Pending status also renders a dash for pickup time, so two dashes are expected here.
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('shows a dash for pickup time on a pending bunk, even if one were somehow provided', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0, pickupTime: '10:15 AM' })

    expect(screen.queryByText('10:15 AM')).not.toBeInTheDocument()
  })

  it('shows the special requirement count in words when present', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 1 })
    expect(screen.getByText('1 special requirement')).toBeVisible()
  })

  it('pluralizes multiple special requirements', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 3 })
    expect(screen.getByText('3 special requirements')).toBeVisible()
  })

  it('shows "None" when there are no special requirements', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0 })
    expect(screen.getByText('None')).toBeVisible()
  })

  it('renders the bunk as plain text when onSelect is not provided', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0 })
    expect(screen.queryByRole('button', { name: 'A1' })).not.toBeInTheDocument()
    expect(screen.getByText('A1')).toBeVisible()
  })

  it('renders the bunk as a clickable button and calls onSelect when provided', () => {
    const onSelect = vi.fn()
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0, onSelect })

    const button = screen.getByRole('button', { name: 'A1' })
    fireEvent.click(button)
    expect(onSelect).toHaveBeenCalledOnce()
  })
})
