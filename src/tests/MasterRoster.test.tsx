import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { MasterRoster } from '../pages/MasterRoster'

describe('MasterRoster', () => {
  it('renders the bunk list from mock data', () => {
    render(<MasterRoster />)

    expect(screen.getByRole('button', { name: 'K3' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'PN1' })).toBeVisible()
  })

  it('shows all special requirement entries for a bunk with multiple requirements', () => {
    render(<MasterRoster />)

    fireEvent.click(screen.getByRole('button', { name: 'K3' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('No Dairy')
    expect(dialog).toHaveTextContent('Cholov Yisroel')
    expect(dialog).toHaveTextContent('Gluten Free')
  })

  it('shows a no-requirements message for a bunk with none', () => {
    render(<MasterRoster />)

    fireEvent.click(screen.getByRole('button', { name: 'PN3' }))

    expect(screen.getByText('No special requirements for this bunk.')).toBeVisible()
  })

  it('closes the modal', () => {
    render(<MasterRoster />)

    fireEvent.click(screen.getByRole('button', { name: 'K3' }))
    expect(screen.getByRole('dialog')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
