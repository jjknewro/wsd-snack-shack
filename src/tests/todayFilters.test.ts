import { describe, expect, it } from 'vitest'

import { filterTodayBunks } from '../services/todayFilters'
import type { SnackDayBunkRecord } from '../types/snackDay'

const bunks: SnackDayBunkRecord[] = [
  {
    bunk: 'A1',
    counselors: 'Alex Rivera',
    expectedCount: 8,
    specialRequirements: [
      { bunk: 'A1', requirement: 'No Dairy', quantity: 1 },
      { bunk: 'A1', requirement: 'Nurse', quantity: 1 },
    ],
    status: 'pending',
  },
  { bunk: 'B2', counselors: 'Bailey Chen', expectedCount: 10, specialRequirements: [], status: 'completed' },
  { bunk: 'C3', counselors: 'Casey Park', expectedCount: 6, specialRequirements: [], status: 'pending' },
]

describe('filterTodayBunks', () => {
  it('returns everything for the "all" filter with no search term', () => {
    expect(filterTodayBunks(bunks, 'all', '')).toEqual(bunks)
  })

  it('filters to only pending bunks', () => {
    const result = filterTodayBunks(bunks, 'pending', '')
    expect(result.map((b) => b.bunk)).toEqual(['A1', 'C3'])
  })

  it('filters to only completed bunks', () => {
    const result = filterTodayBunks(bunks, 'completed', '')
    expect(result.map((b) => b.bunk)).toEqual(['B2'])
  })

  it('filters to only bunks with special requirements', () => {
    const result = filterTodayBunks(bunks, 'special-requirements', '')
    expect(result.map((b) => b.bunk)).toEqual(['A1'])
  })

  it('searches by bunk name, case-insensitively', () => {
    const result = filterTodayBunks(bunks, 'all', 'a1')
    expect(result.map((b) => b.bunk)).toEqual(['A1'])
  })

  it('searches by counselor name, case-insensitively and by substring', () => {
    const result = filterTodayBunks(bunks, 'all', 'chen')
    expect(result.map((b) => b.bunk)).toEqual(['B2'])
  })

  it('trims whitespace from the search term', () => {
    const result = filterTodayBunks(bunks, 'all', '  casey  ')
    expect(result.map((b) => b.bunk)).toEqual(['C3'])
  })

  it('combines status filter and search — both must match', () => {
    const result = filterTodayBunks(bunks, 'pending', 'casey')
    expect(result.map((b) => b.bunk)).toEqual(['C3'])

    // Bailey is completed, not pending, so a matching search term alone isn't enough.
    expect(filterTodayBunks(bunks, 'pending', 'bailey')).toEqual([])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterTodayBunks(bunks, 'all', 'nonexistent')).toEqual([])
  })
})
