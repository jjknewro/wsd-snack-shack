import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

import { MasterRoster } from '../pages/MasterRoster'
import type { SnackRepository } from '../repositories/snackRepository'
import type { MasterRosterEntry, SpecialRequirementEntry } from '../types/roster'

// Fixture data — deliberately not src/data/*.json, so these tests never
// depend on (or accidentally validate against) the real mock data used for
// local development display. Real-data behavior is covered separately in
// tests/jsonSnackRepository.test.ts.
const fixtureRoster: MasterRosterEntry[] = [
  { bunk: 'A1', counselors: 'Alex', campers: 5 },
  { bunk: 'B2', counselors: 'Bailey' },
]

const fixtureRequirements: SpecialRequirementEntry[] = [
  { bunk: 'A1', requirement: 'No Dairy', quantity: 2 },
  { bunk: 'A1', requirement: 'Cholov Yisroel', quantity: 1 },
  { bunk: 'A1', requirement: 'Gluten Free', quantity: 1 },
]

function createFixtureRepository(): SnackRepository {
  return {
    getRoster: () => fixtureRoster,
    getSpecialRequirementsForBunk: (bunk) => fixtureRequirements.filter((entry) => entry.bunk === bunk),
  }
}

describe('MasterRoster', () => {
  it('renders the bunk list from the repository', () => {
    render(<MasterRoster createRepository={createFixtureRepository} />)

    expect(screen.getByRole('button', { name: 'A1' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'B2' })).toBeVisible()
  })

  it('shows all special requirement entries for a bunk with multiple requirements', () => {
    render(<MasterRoster createRepository={createFixtureRepository} />)

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('No Dairy')
    expect(dialog).toHaveTextContent('Cholov Yisroel')
    expect(dialog).toHaveTextContent('Gluten Free')
  })

  it('shows a no-requirements message for a bunk with none', () => {
    render(<MasterRoster createRepository={createFixtureRepository} />)

    fireEvent.click(screen.getByRole('button', { name: 'B2' }))

    expect(screen.getByText('No special requirements for this bunk.')).toBeVisible()
  })

  it('closes the modal', () => {
    render(<MasterRoster createRepository={createFixtureRepository} />)

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))
    expect(screen.getByRole('dialog')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  describe('derived special-requirements count column', () => {
    // The counting logic itself (record count vs. sum of quantities, zero
    // handling, recomputation) is unit-tested against fixture data in
    // tests/specialRequirements.test.ts. These tests only confirm the count
    // actually reaches the right table cell when rendered.
    it('renders the count in the correct row of the table', () => {
      render(<MasterRoster createRepository={createFixtureRepository} />)

      const a1Row = screen.getByRole('button', { name: 'A1' }).closest('tr') as HTMLElement
      expect(within(a1Row).getByRole('cell', { name: '3' })).toBeVisible()

      const b2Row = screen.getByRole('button', { name: 'B2' }).closest('tr') as HTMLElement
      expect(within(b2Row).getByRole('cell', { name: '0' })).toBeVisible()
    })
  })
})
