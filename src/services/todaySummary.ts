import type { SnackDayBunkRecord } from '@/types/snackDay'

export type TodaySummaryData = {
  totalBunks: number
  completedBunks: number
  pendingBunks: number
  expectedTotalCampers: number
  // null = not trackable yet: there is no per-bunk "actual count" field
  // until EPIC 6 (Pickup Workflow) defines how one gets captured.
  actualTotalServed: number | null
  specialRequirementCount: number
}

export function summarizeToday(bunks: SnackDayBunkRecord[]): TodaySummaryData {
  return {
    totalBunks: bunks.length,
    completedBunks: bunks.filter((record) => record.status === 'completed').length,
    pendingBunks: bunks.filter((record) => record.status === 'pending').length,
    expectedTotalCampers: bunks.reduce((sum, record) => sum + (record.expectedCount ?? 0), 0),
    actualTotalServed: null,
    specialRequirementCount: bunks.reduce((sum, record) => sum + record.specialRequirementCount, 0),
  }
}
