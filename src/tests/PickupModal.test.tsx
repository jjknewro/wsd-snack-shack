import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { PickupModal } from '../components/PickupModal'
import type { SnackDayBunkRecord } from '../types/snackDay'

const pendingRecord: SnackDayBunkRecord = {
  bunk: 'A1',
  counselors: 'Alex Rivera',
  expectedCount: 8,
  specialRequirements: [
    { bunk: 'A1', requirement: 'No Dairy', quantity: 2 },
    { bunk: 'A1', requirement: 'Nurse', quantity: 1, notes: 'Daily medication' },
  ],
  status: 'pending',
}

describe('PickupModal', () => {
  it('shows bunk info, expected count, and full special-requirement detail', () => {
    render(<PickupModal record={pendingRecord} onClose={vi.fn()} onComplete={vi.fn()} />)

    expect(screen.getByText('Alex Rivera')).toBeVisible()
    expect(screen.getByText('8')).toBeVisible()
    expect(screen.getByText('No Dairy')).toBeVisible()
    expect(screen.getByText('Nurse')).toBeVisible()
    expect(screen.getByText(/Daily medication/)).toBeVisible()
  })

  it('shows a no-requirements message when there are none', () => {
    render(<PickupModal record={{ ...pendingRecord, specialRequirements: [] }} onClose={vi.fn()} onComplete={vi.fn()} />)

    expect(screen.getByText('No special requirements for this bunk.')).toBeVisible()
  })

  it('pre-fills the actual count with the expected count', () => {
    render(<PickupModal record={pendingRecord} onClose={vi.fn()} onComplete={vi.fn()} />)

    expect(screen.getByLabelText('Actual count')).toHaveValue(8)
  })

  it('leaves the actual count blank when there is no expected count', () => {
    render(
      <PickupModal
        record={{ ...pendingRecord, expectedCount: undefined }}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Actual count')).toHaveValue(null)
  })

  it('pre-fills notes from the record, so an unedited submit does not wipe out notes entered on Today\'s inline Notes column', () => {
    const onComplete = vi.fn()
    render(
      <PickupModal record={{ ...pendingRecord, pickupNotes: 'Left early' }} onClose={vi.fn()} onComplete={onComplete} />,
    )

    expect(screen.getByLabelText('Notes (optional)')).toHaveValue('Left early')

    fireEvent.click(screen.getByRole('button', { name: 'Complete Pickup' }))
    expect(onComplete).toHaveBeenCalledWith({ actualCount: 8, notes: 'Left early' })
  })

  it('calls onComplete with the adjusted count and trimmed notes on submit', () => {
    const onComplete = vi.fn()
    render(<PickupModal record={pendingRecord} onClose={vi.fn()} onComplete={onComplete} />)

    fireEvent.change(screen.getByLabelText('Actual count'), { target: { value: '6' } })
    fireEvent.change(screen.getByLabelText('Notes (optional)'), { target: { value: '  Ran late  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Complete Pickup' }))

    expect(onComplete).toHaveBeenCalledWith({ actualCount: 6, notes: 'Ran late' })
  })

  it('calls onComplete with undefined fields when left blank', () => {
    const onComplete = vi.fn()
    render(
      <PickupModal record={{ ...pendingRecord, expectedCount: undefined }} onClose={vi.fn()} onComplete={onComplete} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Complete Pickup' }))

    expect(onComplete).toHaveBeenCalledWith({ actualCount: undefined, notes: undefined })
  })

  it('calls onClose when the dialog is dismissed', () => {
    const onClose = vi.fn()
    render(<PickupModal record={pendingRecord} onClose={onClose} onComplete={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows a read-only note instead of the form for an already-completed bunk', () => {
    const completedRecord: SnackDayBunkRecord = {
      ...pendingRecord,
      status: 'completed',
      actualCount: 7,
      completedAt: '10:15:00 AM',
    }

    render(<PickupModal record={completedRecord} onClose={vi.fn()} onComplete={vi.fn()} />)

    expect(screen.getByText('Picked Up')).toBeVisible()
    expect(screen.getByText(/10:15:00 AM/)).toBeVisible()
    expect(screen.getByText(/corrections aren't supported yet/)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Complete Pickup' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Actual count')).not.toBeInTheDocument()
  })

  it('shows a submit error without losing the entered form values', () => {
    render(
      <PickupModal
        record={pendingRecord}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        submitError="This day is closed and cannot be modified."
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('This day is closed')
    // The form itself must still be usable, not replaced by the error.
    expect(screen.getByRole('button', { name: 'Complete Pickup' })).toBeVisible()
  })
})
