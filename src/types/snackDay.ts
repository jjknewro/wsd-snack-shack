export type PickupStatus = 'pending' | 'completed'

export type SnackDayBunkRecord = {
  bunk: string
  expectedCount?: number
  specialRequirementCount: number
  status: PickupStatus
}

export type SnackDay = {
  date: string
  dayStatus: 'active' | 'closed'
  bunks: SnackDayBunkRecord[]
}
