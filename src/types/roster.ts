export const REQUIREMENT_TYPES = [
  'No Dairy',
  'Gluten Free',
  'No Red Dye',
  'Nurse',
  'No Corn Syrup',
  'No Soy/Dairy',
  'Cholov Yisroel',
] as const

export type RequirementType = (typeof REQUIREMENT_TYPES)[number]

export type MasterRosterEntry = {
  bunk: string
  counselors: string
  campers?: number
}

export type SpecialRequirementEntry = {
  bunk: string
  requirement: RequirementType
  quantity: number
  notes?: string
}
