import { describe, expect, it } from 'vitest'

import { updatePickupNotes } from '../services/updatePickupNotes'
import type { SnackDay } from '../types/snackDay'

function buildDay(overrides: Partial<SnackDay> = {}): SnackDay {
  return {
    date: '2026-07-20',
    dayStatus: 'active',
    bunks: [
      { bunk: 'A1', counselors: 'Alex', expectedCount: 8, specialRequirements: [], status: 'pending' },
      {
        bunk: 'B2',
        counselors: 'Bailey',
        expectedCount: 10,
        specialRequirements: [],
        status: 'completed',
        actualCount: 10,
        completedAt: '10:15:00 AM',
      },
    ],
    ...overrides,
  }
}

describe('updatePickupNotes', () => {
  it('sets notes on a pending bunk, independent of completion status', () => {
    const result = updatePickupNotes([buildDay()], '2026-07-20', 'A1', 'Counselor running late')

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data[0].bunks.find((b) => b.bunk === 'A1')?.pickupNotes).toBe('Counselor running late')
  })

  it('sets notes on an already-completed bunk', () => {
    const result = updatePickupNotes([buildDay()], '2026-07-20', 'B2', 'Two campers went home sick')

    expect(result.success).toBe(true)
    if (!result.success) return
    const record = result.data[0].bunks.find((b) => b.bunk === 'B2')
    expect(record?.pickupNotes).toBe('Two campers went home sick')
    // Completion fields must be untouched by a notes-only update.
    expect(record?.status).toBe('completed')
    expect(record?.actualCount).toBe(10)
  })

  it('clears notes back to undefined when set to an empty string', () => {
    const dayWithNotes = buildDay()
    dayWithNotes.bunks[0] = { ...dayWithNotes.bunks[0], pickupNotes: 'Old note' }

    const result = updatePickupNotes([dayWithNotes], '2026-07-20', 'A1', '')

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data[0].bunks.find((b) => b.bunk === 'A1')?.pickupNotes).toBeUndefined()
  })

  it('leaves every other bunk on the day untouched', () => {
    const result = updatePickupNotes([buildDay()], '2026-07-20', 'A1', 'A note')

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data[0].bunks.find((b) => b.bunk === 'B2')?.pickupNotes).toBeUndefined()
  })

  it('does not mutate the input array or day (returns new objects)', () => {
    const days = [buildDay()]
    const result = updatePickupNotes(days, '2026-07-20', 'A1', 'A note')

    expect(days[0].bunks[0].pickupNotes).toBeUndefined()
    expect(result.success && result.data).not.toBe(days)
  })

  it('fails with day-not-found for an unknown date', () => {
    const result = updatePickupNotes([buildDay()], '2099-01-01', 'A1', 'A note')

    expect(result).toEqual({
      success: false,
      message: 'No active day found for this date.',
      errorCode: 'day-not-found',
    })
  })

  it('fails with day-closed for a closed day, without modifying anything', () => {
    const closedDay = buildDay({ dayStatus: 'closed' })
    const result = updatePickupNotes([closedDay], '2026-07-20', 'A1', 'A note')

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('day-closed')
  })

  it('fails with bunk-not-found for a bunk not on the day', () => {
    const result = updatePickupNotes([buildDay()], '2026-07-20', 'ZZ9', 'A note')

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('bunk-not-found')
  })
})
