import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'

import { Today } from '../pages/Today'
import { DataValidationError } from '../repositories/jsonSnackRepository'
import type { SnackRepository } from '../repositories/snackRepository'
import type { MasterRosterEntry, SpecialRequirementEntry } from '../types/roster'

const fixtureRoster: MasterRosterEntry[] = [
  { bunk: 'A1', counselors: 'Alex', campers: 8 },
  { bunk: 'B2', counselors: 'Bailey' },
]

const fixtureRequirements: SpecialRequirementEntry[] = [{ bunk: 'A1', requirement: 'No Dairy', quantity: 1 }]

function createFixtureRepository(): SnackRepository {
  return {
    getRoster: () => fixtureRoster,
    getSpecialRequirementsForBunk: (bunk) => fixtureRequirements.filter((entry) => entry.bunk === bunk),
  }
}

describe('Today', () => {
  it('renders every roster bunk as pending, with campers and special requirements visible without opening a record', () => {
    render(<Today createRepository={createFixtureRepository} />)

    const a1Row = screen.getByText('A1').closest('tr') as HTMLElement
    expect(within(a1Row).getByText('Pending')).toBeVisible()
    expect(within(a1Row).getByText('8')).toBeVisible()
    expect(within(a1Row).getByText('1 special requirement')).toBeVisible()

    const b2Row = screen.getByText('B2').closest('tr') as HTMLElement
    expect(within(b2Row).getByText('Pending')).toBeVisible()
    expect(within(b2Row).getByText('None')).toBeVisible()
  })

  it('shows an empty state when the roster has no bunks', () => {
    const createEmptyRepository = (): SnackRepository => ({
      getRoster: () => [],
      getSpecialRequirementsForBunk: () => [],
    })

    render(<Today createRepository={createEmptyRepository} />)

    expect(screen.getByText('No bunks found in the roster.')).toBeVisible()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows a controlled error instead of the table when the repository fails to load', () => {
    const createFailingRepository = () => {
      throw new DataValidationError([{ file: 'masterRoster.json', index: 0, message: 'Missing or invalid "bunk".' }])
    }

    render(<Today createRepository={createFailingRepository} />)

    expect(screen.getByRole('alert')).toHaveTextContent('masterRoster.json')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
