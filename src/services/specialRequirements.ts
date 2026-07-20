import type { SpecialRequirementEntry } from '@/types/roster'

// Derived, not stored: count of specialRequirements *records* for a bunk
// (not the sum of their quantities). E.g. 3 entries totalling 4 campers -> 3.
export function getRequirementCountForBunk(
  bunk: string,
  requirements: SpecialRequirementEntry[],
): number {
  return requirements.filter((r) => r.bunk === bunk).length
}
