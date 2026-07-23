import type { SnackDay, SnackDayBunkRecord } from '@/types/snackDay'

export type ReopenPickupErrorCode = 'day-not-found' | 'day-closed' | 'bunk-not-found' | 'not-completed'

export type ReopenPickupResult =
  | { success: true; data: SnackDay[] }
  | { success: false; message: string; errorCode: ReopenPickupErrorCode }

// The inverse of completePickup - returns an already-completed bunk to
// pending, clearing its actual count, completion time, and notes. Used by
// Today's per-row checkbox: unchecking a "Picked Up" bunk calls this.
export function reopenPickup(snackDays: SnackDay[], date: string, bunk: string): ReopenPickupResult {
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
  if (record.status !== 'completed') {
    return { success: false, message: `Bunk "${bunk}" has not been picked up yet.`, errorCode: 'not-completed' }
  }

  const updatedRecord: SnackDayBunkRecord = {
    ...record,
    status: 'pending',
    actualCount: undefined,
    completedAt: undefined,
    pickupNotes: undefined,
  }

  const updatedBunks = [...day.bunks]
  updatedBunks[bunkIndex] = updatedRecord

  const updatedDays = [...snackDays]
  updatedDays[dayIndex] = { ...day, bunks: updatedBunks }

  return { success: true, data: updatedDays }
}
