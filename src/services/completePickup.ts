import type { SnackDay, SnackDayBunkRecord } from '@/types/snackDay'

export type CompletePickupInput = {
  actualCount?: number
  notes?: string
}

export type CompletePickupErrorCode = 'day-not-found' | 'day-closed' | 'bunk-not-found' | 'already-completed' | 'invalid-count'

export type CompletePickupResult =
  | { success: true; data: SnackDay[] }
  | { success: false; message: string; errorCode: CompletePickupErrorCode }

// The EPIC 6 equivalent of a "backend operation" under this architecture:
// a pure function over in-memory state rather than a network call. There is
// no separate history log to append to yet (EPIC 8 territory — see Task
// 2.4's deferral note) — for now the bunk's own record IS the record.
// "Duplicate submissions do not create duplicate history rows" is satisfied
// by the already-completed guard below: a second call for the same bunk
// fails safely instead of mutating anything further.
export function completePickup(
  snackDays: SnackDay[],
  date: string,
  bunk: string,
  input: CompletePickupInput,
  now: () => string,
): CompletePickupResult {
  const dayIndex = snackDays.findIndex((day) => day.date === date)
  if (dayIndex === -1) {
    return { success: false, message: 'No active day found for this date.', errorCode: 'day-not-found' }
  }

  const day = snackDays[dayIndex]
  if (day.dayStatus === 'closed') {
    return { success: false, message: 'This day is closed and cannot be modified.', errorCode: 'day-closed' }
  }

  const bunkIndex = day.bunks.findIndex((record) => record.bunk === bunk)
  if (bunkIndex === -1) {
    return { success: false, message: `Bunk "${bunk}" was not found in today's records.`, errorCode: 'bunk-not-found' }
  }

  const record = day.bunks[bunkIndex]
  if (record.status === 'completed') {
    return { success: false, message: `Bunk "${bunk}" has already been picked up.`, errorCode: 'already-completed' }
  }

  if (input.actualCount !== undefined && (!Number.isFinite(input.actualCount) || input.actualCount < 0)) {
    return { success: false, message: 'Actual count must be a non-negative number.', errorCode: 'invalid-count' }
  }

  const updatedRecord: SnackDayBunkRecord = {
    ...record,
    status: 'completed',
    actualCount: input.actualCount,
    completedAt: now(),
    pickupNotes: input.notes,
  }

  const updatedBunks = [...day.bunks]
  updatedBunks[bunkIndex] = updatedRecord

  const updatedDays = [...snackDays]
  updatedDays[dayIndex] = { ...day, bunks: updatedBunks }

  return { success: true, data: updatedDays }
}
