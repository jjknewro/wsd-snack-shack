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
  it('shows an unchecked checkbox for a pending bunk', () => {
    renderRow({ bunk: 'A1', campers: 8, status: 'pending', specialRequirementCount: 0 })

    expect(screen.getByText('A1')).toBeVisible()
    expect(screen.getByText('8')).toBeVisible()
    expect(screen.getByRole('checkbox', { name: 'Mark A1 picked up' })).not.toBeChecked()
  })

  it('shows a checked checkbox for a completed bunk, with the pickup time', () => {
    renderRow({ bunk: 'A1', status: 'completed', specialRequirementCount: 0, pickupTime: '10:15 AM' })

    expect(screen.getByRole('checkbox', { name: 'Mark A1 picked up' })).toBeChecked()
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

  it('calls onToggleComplete with true when checking a pending bunk', () => {
    const onToggleComplete = vi.fn()
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0, onToggleComplete })

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark A1 picked up' }))
    expect(onToggleComplete).toHaveBeenCalledOnce()
    expect(onToggleComplete).toHaveBeenCalledWith(true)
  })

  it('calls onToggleComplete with false when unchecking a completed bunk', () => {
    const onToggleComplete = vi.fn()
    renderRow({ bunk: 'A1', status: 'completed', specialRequirementCount: 0, onToggleComplete })

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark A1 picked up' }))
    expect(onToggleComplete).toHaveBeenCalledOnce()
    expect(onToggleComplete).toHaveBeenCalledWith(false)
  })

  it('disables the checkbox when toggleDisabled is set, for a read-only closed day', () => {
    renderRow({ bunk: 'A1', status: 'completed', specialRequirementCount: 0, toggleDisabled: true })

    expect(screen.getByRole('checkbox', { name: 'Mark A1 picked up' })).toBeDisabled()
  })

  it('shows an empty notes field by default', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0 })

    expect(screen.getByRole('textbox', { name: 'Notes for A1' })).toHaveValue('')
  })

  it('shows existing notes', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0, notes: 'Ran late' })

    expect(screen.getByRole('textbox', { name: 'Notes for A1' })).toHaveValue('Ran late')
  })

  it('calls onNotesChange as the notes field is edited', () => {
    const onNotesChange = vi.fn()
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0, onNotesChange })

    fireEvent.change(screen.getByRole('textbox', { name: 'Notes for A1' }), { target: { value: 'Left early' } })
    expect(onNotesChange).toHaveBeenCalledWith('Left early')
  })

  it('disables the notes field when notesDisabled is set, for a read-only closed day', () => {
    renderRow({ bunk: 'A1', status: 'pending', specialRequirementCount: 0, notesDisabled: true })

    expect(screen.getByRole('textbox', { name: 'Notes for A1' })).toBeDisabled()
  })
})
