import type { SnackDayBunkRecord } from '@/types/snackDay'

export type TodayStatusFilter = 'all' | 'pending' | 'completed' | 'special-requirements'

export function filterTodayBunks(
  bunks: SnackDayBunkRecord[],
  statusFilter: TodayStatusFilter,
  searchTerm: string,
): SnackDayBunkRecord[] {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return bunks.filter((record) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && record.status === 'pending') ||
      (statusFilter === 'completed' && record.status === 'completed') ||
      (statusFilter === 'special-requirements' && record.specialRequirementCount > 0)

    if (!matchesStatus) return false
    if (normalizedSearch === '') return true

    return (
      record.bunk.toLowerCase().includes(normalizedSearch) ||
      record.counselors.toLowerCase().includes(normalizedSearch)
    )
  })
}
