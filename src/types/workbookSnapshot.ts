// Shape of public/data/workbook-snapshot.json - a local-only, gitignored
// export of the real workbook, used for temporary visualization ahead of
// Task 2.2+ (see IMPLEMENTATION-LOG-MVP.md, Task 2.1 follow-up). Not the
// real data contract - EPIC 4 will replace this with the actual API/
// repository layer.

export type MasterRosterRow = {
  division: string | null
  bunk: string | null
  counselors: string | null
  specialSnack: string | null
  notes: string | null
}

export type SnackShackTodayRow = {
  pickedUp: boolean
  bunk: string | null
  specialSnack: string | null
  notes: string | null
  time: string | null
}

export type AllergyRow = {
  bunk: string | null
  requirement: string | null
  quantity: string | null
}

export type WorkbookSnapshot = {
  generatedAt: string
  sourceFile: string
  masterRoster: MasterRosterRow[]
  snackShackToday: SnackShackTodayRow[]
  allergies: AllergyRow[]
}
