import type { SpecialRequirementEntry } from './roster'

export type PickupStatus = 'pending' | 'completed'

export type SnackDayBunkRecord = {
  bunk: string
  counselors: string
  expectedCount?: number
  // Full snapshot, not just a count — Task 6.1's pickup dialog needs to show
  // requirement type and notes, not only how many there are. Snapshotted at
  // initialization time for the same reason expectedCount is (Task 5.2).
  specialRequirements: SpecialRequirementEntry[]
  status: PickupStatus
  // Set only once the bunk is completed (Task 6.2).
  actualCount?: number
  completedAt?: string
  pickupNotes?: string
}

export type SnackDay = {
  date: string
  dayStatus: 'active' | 'closed'
  bunks: SnackDayBunkRecord[]
}
