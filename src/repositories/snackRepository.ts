import type { MasterRosterEntry, SpecialRequirementEntry } from '@/types/roster'

export type SnackRepository = {
  getRoster(): MasterRosterEntry[]
  getSpecialRequirementsForBunk(bunk: string): SpecialRequirementEntry[]
}
