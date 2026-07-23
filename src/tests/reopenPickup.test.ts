import { describe, expect, it } from 'vitest'

import { reopenPickup } from '../services/reopenPickup'
import type { SnackDay } from '../types/snackDay'

function buildDay(overrides: Partial<SnackDay> = {}): SnackDay {
  return {
    date: '2026-07-20',
    dayStatus: 'active',
    bunks: [
      {
        bunk: 'A1',
        counselors: 'Alex',
        expectedCount: 8,
        specialRequirements: [],
        status: 'completed',
        actualCount: 8,
        completedAt: '10:15:00 AM',
        pickupNotes: 'One absent',
      },
      { bunk: 'B2', counselors: 'Bailey', expectedCount: 10, specialRequirements: [], status: 'pending' },
    ],
    ...overrides,
  }
}

describe('reopenPickup', () => {
  it('returns a completed bunk to pending, clearing actual count, completion time, and notes', () => {
    const result = reopenPickup([buildDay()], '2026-07-20', 'A1')

    expect(result.success).toBe(true)
    if (!result.success) return

    const record = result.data[0].bunks.find((b) => b.bunk === 'A1')
    expect(record).toEqual({
      bunk: 'A1',
      counselors: 'Alex',
      expectedCount: 8,
      specialRequirements: [],
      status: 'pending',
      actualCount: undefined,
      completedAt: undefined,
      pickupNotes: undefined,
    })
  })

  it('leaves every other bunk on the day untouched', () => {
    const result = reopenPickup([buildDay()], '2026-07-20', 'A1')

    expect(result.success).toBe(true)
    if (!result.success) return

    const b2 = result.data[0].bunks.find((b) => b.bunk === 'B2')
    expect(b2?.status).toBe('pending')
  })

  it('does not mutate the input array or day (returns new objects)', () => {
    const days = [buildDay()]
    const result = reopenPickup(days, '2026-07-20', 'A1')

    expect(days[0].bunks[0].status).toBe('completed')
    expect(result.success && result.data).not.toBe(days)
  })

  it('fails with day-not-found for an unknown date', () => {
    const result = reopenPickup([buildDay()], '2099-01-01', 'A1')

    expect(result).toEqual({
      success: false,
      message: 'No active day found for this date.',
      errorCode: 'day-not-found',
    })
  })

  it('fails with day-closed for a closed day, without modifying anything', () => {
    const closedDay = buildDay({ dayStatus: 'closed' })
    const result = reopenPickup([closedDay], '2026-07-20', 'A1')

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('day-closed')
  })

  it('fails with bunk-not-found for a bunk not on the day', () => {
    const result = reopenPickup([buildDay()], '2026-07-20', 'ZZ9')

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('bunk-not-found')
  })

  it('fails with not-completed for a bunk that is still pending', () => {
    const result = reopenPickup([buildDay()], '2026-07-20', 'B2')

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('not-completed')
  })
})
