import { describe, expect, it } from 'vitest'

import type { SnackRepository } from '../repositories/snackRepository'
import type { MasterRosterEntry, SpecialRequirementEntry } from '../types/roster'

const roster: MasterRosterEntry[] = [
  { bunk: 'K1', counselors: 'Finley', campers: 10 },
  { bunk: 'K2', counselors: 'Emerson' },
]

const requirements: SpecialRequirementEntry[] = [
  { bunk: 'K1', requirement: 'No Dairy', quantity: 1 },
  { bunk: 'K1', requirement: 'Nurse', quantity: 1 },
]

function createFixtureRepository(): SnackRepository {
  return {
    getRoster: () => roster,
    getSpecialRequirementsForBunk: (bunk) => requirements.filter((entry) => entry.bunk === bunk),
  }
}

describe('SnackRepository', () => {
  it('a fixture-backed implementation satisfies the interface without touching the real data files', () => {
    const repository = createFixtureRepository()

    expect(repository.getRoster()).toEqual(roster)
    expect(repository.getSpecialRequirementsForBunk('K1')).toEqual(requirements)
  })

  it('returns an empty array for a bunk with no special requirements', () => {
    const repository = createFixtureRepository()

    expect(repository.getSpecialRequirementsForBunk('K2')).toEqual([])
  })
})
