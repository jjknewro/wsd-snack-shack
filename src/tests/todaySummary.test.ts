import { describe, expect, it } from 'vitest'

import { summarizeToday } from '../services/todaySummary'
import type { SnackDayBunkRecord } from '../types/snackDay'

const bunks: SnackDayBunkRecord[] = [
  { bunk: 'A1', counselors: 'Alex', expectedCount: 8, specialRequirementCount: 2, status: 'completed' },
  { bunk: 'B2', counselors: 'Bailey', expectedCount: 10, specialRequirementCount: 0, status: 'pending' },
  { bunk: 'C3', counselors: 'Casey', specialRequirementCount: 1, status: 'pending' },
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

  it('reports actual total served as not-yet-trackable (null), not a fabricated number', () => {
    expect(summarizeToday(bunks).actualTotalServed).toBeNull()
  })

  it('returns all zeros (and null) for an empty day, not an error', () => {
    expect(summarizeToday([])).toEqual({
      totalBunks: 0,
      completedBunks: 0,
      pendingBunks: 0,
      expectedTotalCampers: 0,
      actualTotalServed: null,
      specialRequirementCount: 0,
    })
  })
})
