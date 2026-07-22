import type { MasterRosterEntry, SpecialRequirementEntry } from '@/types/roster'

export type SnackRepository = {
  getRoster(): MasterRosterEntry[]
  getSpecialRequirementsForBunk(bunk: string): SpecialRequirementEntry[]
}

// A special-requirement entry as stored by a WritableSnackRepository - `id`
// is assigned by the repository (never read from masterRoster.json /
// specialRequirements.json, which have no natural unique key for a
// requirement row) so edits and deletes can target one specific entry even
// when a bunk has several requirements of the same type.
export type SpecialRequirementRecord = SpecialRequirementEntry & { id: string }

// Task 7.5 — Roster and Special Requirements Maintenance Workflow. Kept as a
// separate type (rather than adding these methods to SnackRepository
// itself) so every read-only fixture repository already used across the
// test suite keeps satisfying SnackRepository without modification; only
// the real, writable repository implements this.
export type WritableSnackRepository = SnackRepository & {
  addRosterEntry(entry: MasterRosterEntry): void
  updateRosterEntry(originalBunk: string, entry: MasterRosterEntry): void
  deleteRosterEntry(bunk: string): void
  getSpecialRequirements(): SpecialRequirementRecord[]
  addSpecialRequirement(entry: SpecialRequirementEntry): void
  updateSpecialRequirement(id: string, entry: SpecialRequirementEntry): void
  deleteSpecialRequirement(id: string): void
}

export function isWritableSnackRepository(
  repository: SnackRepository,
): repository is WritableSnackRepository {
  return 'addRosterEntry' in repository
}
