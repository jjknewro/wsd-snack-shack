import { describe, expect, it } from 'vitest'

import { initializeSnackDay, refreshSnackDay } from '../services/snackDayInitialization'
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
  it('creates one pending record per roster bunk, snapshotting expected count and special requirements', () => {
    const days = initializeSnackDay(createFixtureRepository(), '2026-07-20')

    expect(days).toHaveLength(1)
    expect(days[0]).toEqual({
      date: '2026-07-20',
      dayStatus: 'active',
      bunks: [
        {
          bunk: 'A1',
          counselors: 'Alex',
          expectedCount: 8,
          specialRequirements: fixtureRequirements,
          status: 'pending',
        },
        { bunk: 'B2', counselors: 'Bailey', expectedCount: undefined, specialRequirements: [], status: 'pending' },
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
      dayStatus: 'closed',
      bunks: [
        {
          bunk: 'A1',
          counselors: 'Alex',
          expectedCount: 8,
          specialRequirements: fixtureRequirements,
          status: 'completed',
        },
      ],
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

describe('refreshSnackDay', () => {
  it('creates the day fresh from the master roster if it does not exist yet', () => {
    const days = refreshSnackDay(createFixtureRepository(), '2026-07-20')

    expect(days).toHaveLength(1)
    expect(days[0].date).toBe('2026-07-20')
    expect(days[0].bunks).toHaveLength(2)
  })

  it('unlike initializeSnackDay, rebuilds an already-initialized day from the current master roster instead of leaving it untouched', () => {
    const completedDay: SnackDay = {
      date: '2026-07-20',
      dayStatus: 'active',
      bunks: [
        {
          bunk: 'A1',
          counselors: 'Alex',
          expectedCount: 8,
          specialRequirements: fixtureRequirements,
          status: 'completed',
          actualCount: 8,
          completedAt: '9:00:00 AM',
        },
      ],
    }

    const refreshed = refreshSnackDay(createFixtureRepository(), '2026-07-20', [completedDay])

    expect(refreshed).toHaveLength(1)
    // Rebuilt from the roster, not the stale single-bunk snapshot - and the
    // earlier completion is gone, which is the whole point of a "refresh".
    expect(refreshed[0].bunks).toHaveLength(2)
    expect(refreshed[0].bunks.find((bunk) => bunk.bunk === 'A1')?.status).toBe('pending')
  })

  it('picks up a roster change made after the day was first initialized, unlike initializeSnackDay', () => {
    const roster: MasterRosterEntry[] = [{ bunk: 'A1', counselors: 'Alex', campers: 8 }]
    const repository: SnackRepository = {
      getRoster: () => roster,
      getSpecialRequirementsForBunk: () => [],
    }

    const initialized = initializeSnackDay(repository, '2026-07-20')
    roster[0] = { ...roster[0], campers: 20 }

    const refreshed = refreshSnackDay(repository, '2026-07-20', initialized)

    expect(refreshed[0].bunks[0].expectedCount).toBe(20)
  })

  it('leaves other dates (including historical, closed days) untouched', () => {
    const historicalDay: SnackDay = {
      date: '2026-07-19',
      dayStatus: 'closed',
      bunks: [
        {
          bunk: 'A1',
          counselors: 'Alex',
          expectedCount: 8,
          specialRequirements: fixtureRequirements,
          status: 'completed',
        },
      ],
    }

    const refreshed = refreshSnackDay(createFixtureRepository(), '2026-07-20', [historicalDay])

    expect(refreshed).toHaveLength(2)
    expect(refreshed[0]).toBe(historicalDay)
    expect(refreshed[1].date).toBe('2026-07-20')
  })
})
