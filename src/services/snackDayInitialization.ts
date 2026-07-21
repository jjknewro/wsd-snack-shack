import type { SnackRepository } from '@/repositories/snackRepository'
import type { SnackDay } from '@/types/snackDay'

// Initializes one active pickup record per roster bunk for `date`, snapshotting
// expected counts and special-requirement counts at this moment - so later
// edits to the roster/special-requirements seed data don't retroactively
// change an already-initialized day (see ARCHITECTURE.md, "Future: Editing
// Seed Data"). Idempotent: calling again for a date that's already
// initialized returns `existingDays` unchanged, never duplicating rows.
// Existing days (including completed historical ones) are always preserved.
export function initializeSnackDay(
  repository: SnackRepository,
  date: string,
  existingDays: SnackDay[] = [],
): SnackDay[] {
  if (existingDays.some((day) => day.date === date)) {
    return existingDays
  }

  const roster = repository.getRoster()

  const newDay: SnackDay = {
    date,
    dayStatus: 'active',
    bunks: roster.map((entry) => ({
      bunk: entry.bunk,
      expectedCount: entry.campers,
      specialRequirementCount: repository.getSpecialRequirementsForBunk(entry.bunk).length,
      status: 'pending',
    })),
  }

  return [...existingDays, newDay]
}
