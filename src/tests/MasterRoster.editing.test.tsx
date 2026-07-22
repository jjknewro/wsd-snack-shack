import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

import { MasterRoster } from '../pages/MasterRoster'

describe('MasterRoster — editing (Task 7.5)', () => {
  it('adds a new bunk that then persists across a fresh render', () => {
    const { unmount } = render(<MasterRoster />)

    fireEvent.click(screen.getByRole('button', { name: 'Add Bunk' }))
    fireEvent.change(screen.getByLabelText('Bunk'), { target: { value: 'Z9' } })
    fireEvent.change(screen.getByLabelText('Counselors'), { target: { value: 'New Counselor' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add Bunk' }))

    expect(screen.getByRole('button', { name: 'Z9' })).toBeVisible()
    unmount()

    render(<MasterRoster />)
    expect(screen.getByRole('button', { name: 'Z9' })).toBeVisible()
  })

  it('rejects adding a bunk with a duplicate name and shows the error without closing the form', () => {
    render(<MasterRoster />)
    const existingBunk = screen.getAllByRole('button', { name: /^[A-Z0-9]+$/ })[0].textContent!

    fireEvent.click(screen.getByRole('button', { name: 'Add Bunk' }))
    fireEvent.change(screen.getByLabelText('Bunk'), { target: { value: existingBunk } })
    fireEvent.change(screen.getByLabelText('Counselors'), { target: { value: 'Someone' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add Bunk' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Duplicate bunk')
    expect(screen.getByLabelText('Bunk')).toBeVisible()
  })

  it('edits an existing bunk', () => {
    render(<MasterRoster />)
    const row = screen
      .getAllByRole('button', { name: /^[A-Z0-9]+$/ })[0]
      .closest('tr') as HTMLElement

    fireEvent.click(within(row).getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Counselors'), {
      target: { value: 'Updated Counselor' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(screen.getByText('Updated Counselor')).toBeVisible()
  })

  it('deletes a bunk after confirmation, warning about cascading special requirements', () => {
    render(<MasterRoster />)
    // K3 has three special-requirement entries in the seed data.
    const row = screen.getByRole('button', { name: 'K3' }).closest('tr') as HTMLElement

    fireEvent.click(within(row).getByRole('button', { name: 'Delete' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('3 special requirement entries')

    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(screen.queryByRole('button', { name: 'K3' })).not.toBeInTheDocument()
  })

  it('adds, edits, and deletes a special requirement from within a bunk', () => {
    render(<MasterRoster />)

    fireEvent.click(screen.getByRole('button', { name: 'PN3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add Requirement' }))
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add Requirement' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('No Dairy')).toBeVisible()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Edit' }))
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '5' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(screen.getByRole('dialog')).toHaveTextContent('No Dairy')
    expect(screen.getByRole('dialog')).toHaveTextContent('× 5')

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))

    expect(screen.getByText('No special requirements for this bunk.')).toBeVisible()
  })
})
