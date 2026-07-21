import { describe, expect, it } from 'vitest'

import { summarizeToday } from '../services/todaySummary'
import type { SnackDayBunkRecord } from '../types/snackDay'

const bunks: SnackDayBunkRecord[] = [
  {
    bunk: 'A1',
    counselors: 'Alex',
    expectedCount: 8,
    specialRequirements: [
      { bunk: 'A1', requirement: 'No Dairy', quantity: 1 },
      { bunk: 'A1', requirement: 'Nurse', quantity: 1 },
    ],
    status: 'completed',
    actualCount: 7,
  },
  { bunk: 'B2', counselors: 'Bailey', expectedCount: 10, specialRequirements: [], status: 'pending' },
  {
    bunk: 'C3',
    counselors: 'Casey',
    specialRequirements: [{ bunk: 'C3', requirement: 'Gluten Free', quantity: 1 }],
    status: 'pending',
  },
]

describe('summarizeToday', () => {
  it('counts total, completed, and pending bunks', () => {
    const summary = summarizeToday(bunks)

    expect(summary.totalBunks).toBe(3)
    expect(summary.completedBunks).toBe(1)
    expect(summary.pendingBunks).toBe(2)
  })

  it('sums expected campers, treating a missing count as 0 rather than fabricating one', () => {
    // C3 has no expectedCount (undefined) — must contribute 0, not throw or skip the bunk entirely.
    expect(summarizeToday(bunks).expectedTotalCampers).toBe(18)
  })

  it('sums the special-requirement count across all bunks', () => {
    expect(summarizeToday(bunks).specialRequirementCount).toBe(3)
  })

  it('sums actual served across completed bunks only, ignoring pending bunks entirely', () => {
    // Only A1 is completed (actualCount 7). B2/C3 are pending and must not
    // contribute, even though they have no actualCount of their own.
    expect(summarizeToday(bunks).actualTotalServed).toBe(7)
  })

  it('treats a completed bunk with no recorded actual count as contributing 0, not fabricating one', () => {
    const withUnrecordedActual: SnackDayBunkRecord[] = [
      { bunk: 'D4', counselors: 'Dana', specialRequirements: [], status: 'completed' },
    ]
    expect(summarizeToday(withUnrecordedActual).actualTotalServed).toBe(0)
  })

  it('returns all zeros for an empty day, not an error', () => {
    expect(summarizeToday([])).toEqual({
      totalBunks: 0,
      completedBunks: 0,
      pendingBunks: 0,
      expectedTotalCampers: 0,
      actualTotalServed: 0,
      specialRequirementCount: 0,
    })
  })
})
