import type { SnackDay, SnackDayBunkRecord } from '@/types/snackDay'

export type UpdatePickupNotesErrorCode = 'day-not-found' | 'day-closed' | 'bunk-not-found'

export type UpdatePickupNotesResult =
  | { success: true; data: SnackDay[] }
  | { success: false; message: string; errorCode: UpdatePickupNotesErrorCode }

// Backs Today's inline per-row Notes column - unlike completePickup's
// pickupNotes (only ever set at the moment a pickup is completed, via the
// dialog), this can be set or changed at any time, for any bunk regardless
// of pending/completed status. Both write the same SnackDayBunkRecord.pickupNotes
// field - see PickupModal's pre-fill from that field for how the two stay
// in sync instead of one silently overwriting the other.
export function updatePickupNotes(snackDays: SnackDay[], date: string, bunk: string, notes: string): UpdatePickupNotesResult {
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

  const updatedRecord: SnackDayBunkRecord = {
    ...day.bunks[bunkIndex],
    pickupNotes: notes === '' ? undefined : notes,
  }

  const updatedBunks = [...day.bunks]
  updatedBunks[bunkIndex] = updatedRecord

  const updatedDays = [...snackDays]
  updatedDays[dayIndex] = { ...day, bunks: updatedBunks }

  return { success: true, data: updatedDays }
}
