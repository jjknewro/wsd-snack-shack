import { describe, expect, it } from 'vitest'

import { getRequirementCountForBunk } from '../services/specialRequirements'
import type { SpecialRequirementEntry } from '../types/roster'

const fixture: SpecialRequirementEntry[] = [
  { bunk: 'K3', requirement: 'No Dairy', quantity: 2 },
  { bunk: 'K3', requirement: 'Cholov Yisroel', quantity: 1 },
  { bunk: 'K3', requirement: 'Gluten Free', quantity: 1 },
  { bunk: 'N2', requirement: 'No Dairy', quantity: 1 },
]

describe('getRequirementCountForBunk', () => {
  it('counts requirement records, not the sum of their quantities', () => {
    // K3 has 3 records totalling 4 campers (2 + 1 + 1) - the count must be
    // the record count (3), not the sum of quantities (4).
    expect(getRequirementCountForBunk('K3', fixture)).toBe(3)
  })

  it('returns 1 for a bunk with a single requirement', () => {
    expect(getRequirementCountForBunk('N2', fixture)).toBe(1)
  })

  it('returns 0 for a bunk with no special requirements', () => {
    expect(getRequirementCountForBunk('PN3', fixture)).toBe(0)
  })

  it('recomputes correctly as the underlying data changes', () => {
    const growing: SpecialRequirementEntry[] = []
    expect(getRequirementCountForBunk('K6', growing)).toBe(0)

    growing.push({ bunk: 'K6', requirement: 'Gluten Free', quantity: 1 })
    expect(getRequirementCountForBunk('K6', growing)).toBe(1)

    growing.push({ bunk: 'K6', requirement: 'Nurse', quantity: 1 })
    expect(getRequirementCountForBunk('K6', growing)).toBe(2)
  })
})
