import { describe, expect, it } from 'vitest'

import { completePickup } from '../services/completePickup'
import type { SnackDay } from '../types/snackDay'

const now = () => '10:15:00 AM'

function buildDay(overrides: Partial<SnackDay> = {}): SnackDay {
  return {
    date: '2026-07-20',
    dayStatus: 'active',
    bunks: [
      { bunk: 'A1', counselors: 'Alex', expectedCount: 8, specialRequirements: [], status: 'pending' },
      { bunk: 'B2', counselors: 'Bailey', expectedCount: 10, specialRequirements: [], status: 'pending' },
    ],
    ...overrides,
  }
}

describe('completePickup', () => {
  it('marks the bunk completed, recording actual count, notes, and completion time', () => {
    const result = completePickup([buildDay()], '2026-07-20', 'A1', { actualCount: 7, notes: 'One absent' }, now)

    expect(result.success).toBe(true)
    if (!result.success) return

    const record = result.data[0].bunks.find((b) => b.bunk === 'A1')
    expect(record).toEqual({
      bunk: 'A1',
      counselors: 'Alex',
      expectedCount: 8,
      specialRequirements: [],
      status: 'completed',
      actualCount: 7,
      completedAt: '10:15:00 AM',
      pickupNotes: 'One absent',
    })
  })

  it('leaves every other bunk on the day untouched', () => {
    const result = completePickup([buildDay()], '2026-07-20', 'A1', {}, now)

    expect(result.success).toBe(true)
    if (!result.success) return

    const b2 = result.data[0].bunks.find((b) => b.bunk === 'B2')
    expect(b2?.status).toBe('pending')
  })

  it('does not mutate the input array or day (returns new objects)', () => {
    const days = [buildDay()]
    const result = completePickup(days, '2026-07-20', 'A1', {}, now)

    expect(days[0].bunks[0].status).toBe('pending')
    expect(result.success && result.data).not.toBe(days)
  })

  it('fails with day-not-found for an unknown date', () => {
    const result = completePickup([buildDay()], '2099-01-01', 'A1', {}, now)

    expect(result).toEqual({
      success: false,
      message: 'No active day found for this date.',
      errorCode: 'day-not-found',
    })
  })

  it('fails with day-closed for a closed day, without modifying anything', () => {
    const closedDay = buildDay({ dayStatus: 'closed' })
    const result = completePickup([closedDay], '2026-07-20', 'A1', {}, now)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('day-closed')
  })

  it('fails with bunk-not-found for a bunk not on the day', () => {
    const result = completePickup([buildDay()], '2026-07-20', 'ZZ9', {}, now)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('bunk-not-found')
  })

  it('fails with already-completed on a second attempt, protecting against duplicate submissions', () => {
    const firstResult = completePickup([buildDay()], '2026-07-20', 'A1', { actualCount: 8 }, now)
    expect(firstResult.success).toBe(true)
    if (!firstResult.success) return

    const secondResult = completePickup(firstResult.data, '2026-07-20', 'A1', { actualCount: 5 }, now)

    expect(secondResult.success).toBe(false)
    if (secondResult.success) return
    expect(secondResult.errorCode).toBe('already-completed')
    // The original completion (actualCount 8) must survive untouched.
    expect(firstResult.data[0].bunks.find((b) => b.bunk === 'A1')?.actualCount).toBe(8)
  })

  it('fails with invalid-count for a negative actual count', () => {
    const result = completePickup([buildDay()], '2026-07-20', 'A1', { actualCount: -1 }, now)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errorCode).toBe('invalid-count')
  })

  it('allows completion with no actual count provided at all', () => {
    const result = completePickup([buildDay()], '2026-07-20', 'A1', {}, now)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data[0].bunks.find((b) => b.bunk === 'A1')?.actualCount).toBeUndefined()
  })
})
