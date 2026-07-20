import { describe, expect, it } from 'vitest'

import { initializeSnackDay } from '../services/snackDayInitialization'
import type { SnackRepository } from '../repositories/snackRepository'
import type { MasterRosterEntry, SpecialRequirementEntry } from '../types/roster'
import type { SnackDay } from '../types/snackDay'

const fixtureRoster: MasterRosterEntry[] = [
  { bunk: 'A1', counselors: 'Alex', campers: 8 },
  { bunk: 'B2', counselors: 'Bailey' },
]

const fixtureRequirements: SpecialRequirementEntry[] = [
  { bunk: 'A1', requirement: 'No Dairy', quantity: 1 },
  { bunk: 'A1', requirement: 'Nurse', quantity: 1 },
]

function createFixtureRepository(): SnackRepository {
  return {
    getRoster: () => fixtureRoster,
    getSpecialRequirementsForBunk: (bunk) => fixtureRequirements.filter((entry) => entry.bunk === bunk),
  }
}

describe('initializeSnackDay', () => {
  it('creates one pending record per roster bunk, snapshotting expected count and special-requirement count', () => {
    const days = initializeSnackDay(createFixtureRepository(), '2026-07-20')

    expect(days).toHaveLength(1)
    expect(days[0]).toEqual({
      date: '2026-07-20',
      bunks: [
        { bunk: 'A1', expectedCount: 8, specialRequirementCount: 2, status: 'pending' },
        { bunk: 'B2', expectedCount: undefined, specialRequirementCount: 0, status: 'pending' },
      ],
    })
  })

  it('is idempotent — initializing the same date twice does not duplicate rows', () => {
    const firstPass = initializeSnackDay(createFixtureRepository(), '2026-07-20')
    const secondPass = initializeSnackDay(createFixtureRepository(), '2026-07-20', firstPass)

    expect(secondPass).toHaveLength(1)
    expect(secondPass).toBe(firstPass)
    expect(secondPass[0].bunks).toHaveLength(2)
  })

  it('preserves existing (including completed) historical days when initializing a new date', () => {
    const historicalDay: SnackDay = {
      date: '2026-07-19',
      bunks: [{ bunk: 'A1', expectedCount: 8, specialRequirementCount: 2, status: 'completed' }],
    }

    const days = initializeSnackDay(createFixtureRepository(), '2026-07-20', [historicalDay])

    expect(days).toHaveLength(2)
    expect(days[0]).toBe(historicalDay)
    expect(days[0].bunks[0].status).toBe('completed')
    expect(days[1].date).toBe('2026-07-20')
  })

  it('does not snapshot a roster change made after initialization', () => {
    const roster: MasterRosterEntry[] = [{ bunk: 'A1', counselors: 'Alex', campers: 8 }]
    const repository: SnackRepository = {
      getRoster: () => roster,
      getSpecialRequirementsForBunk: () => [],
    }

    const days = initializeSnackDay(repository, '2026-07-20')
    expect(days[0].bunks[0].expectedCount).toBe(8)

    // Simulate a later seed-data edit (e.g. a future "edit roster" screen) —
    // the already-initialized day's snapshot must not change.
    roster[0] = { ...roster[0], campers: 20 }

    expect(days[0].bunks[0].expectedCount).toBe(8)
  })
})
