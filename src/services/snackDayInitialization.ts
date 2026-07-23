import type { SnackRepository } from '@/repositories/snackRepository'
import type { SnackDay } from '@/types/snackDay'

function buildSnackDay(repository: SnackRepository, date: string): SnackDay {
  const roster = repository.getRoster()

  return {
    date,
    dayStatus: 'active',
    bunks: roster.map((entry) => ({
      bunk: entry.bunk,
      counselors: entry.counselors,
      expectedCount: entry.campers,
      specialRequirements: repository.getSpecialRequirementsForBunk(entry.bunk),
      status: 'pending',
    })),
  }
}

// Initializes one active pickup record per roster bunk for `date`, snapshotting
// expected counts and special-requirements at this moment - so later
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

  return [...existingDays, buildSnackDay(repository, date)]
}

// Unlike initializeSnackDay, this is never a no-op — it's the operator's
// explicit "Refresh" action re-pulling `date` from the master roster/special
// requirements, even if that date was already initialized (or edited since).
// Rebuilds every bunk from scratch, so it necessarily discards any pickups
// already recorded for `date` — the caller (Today's Refresh button) is
// expected to confirm that tradeoff with the operator first.
export function refreshSnackDay(repository: SnackRepository, date: string, existingDays: SnackDay[] = []): SnackDay[] {
  const refreshedDay = buildSnackDay(repository, date)

  if (!existingDays.some((day) => day.date === date)) {
    return [...existingDays, refreshedDay]
  }

  return existingDays.map((day) => (day.date === date ? refreshedDay : day))
}
