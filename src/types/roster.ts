export type RequirementType =
  | 'No Dairy'
  | 'Gluten Free'
  | 'No Red Dye'
  | 'Nurse'
  | 'No Corn Syrup'
  | 'No Soy/Dairy'
  | 'Cholov Yisroel'

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
