import type { SnackDayBunkRecord } from '@/types/snackDay'

export type TodaySummaryData = {
  totalBunks: number
  completedBunks: number
  pendingBunks: number
  expectedTotalCampers: number
  actualTotalServed: number
  specialRequirementCount: number
}

export function summarizeToday(bunks: SnackDayBunkRecord[]): TodaySummaryData {
  return {
    totalBunks: bunks.length,
    completedBunks: bunks.filter((record) => record.status === 'completed').length,
    pendingBunks: bunks.filter((record) => record.status === 'pending').length,
    expectedTotalCampers: bunks.reduce((sum, record) => sum + (record.expectedCount ?? 0), 0),
    actualTotalServed: bunks
      .filter((record) => record.status === 'completed')
      .reduce((sum, record) => sum + (record.actualCount ?? 0), 0),
    specialRequirementCount: bunks.reduce((sum, record) => sum + record.specialRequirements.length, 0),
  }
}
