import { useState, type ReactNode } from 'react'

import { SnackDayContext } from '@/hooks/useSnackDays'
import type { SnackDay } from '@/types/snackDay'

export type SnackDayProviderProps = {
  children: ReactNode
  // Lets tests seed pre-existing days (e.g. a closed historical day) without
  // a real close-day mechanism to produce one. Defaults to empty, matching
  // real usage — nothing is initialized until the operator starts the day.
  initialSnackDays?: SnackDay[]
}

// Lives above route-level components (see AppShell) so it survives React
// Router navigation between pages, only resetting on an actual page reload -
// matching ARCHITECTURE.md's "Persistence — Current State" ("reset every
// time the page is reloaded", not merely navigated away from).
export function SnackDayProvider({ children, initialSnackDays = [] }: SnackDayProviderProps) {
  const [snackDays, setSnackDays] = useState<SnackDay[]>(initialSnackDays)

  return <SnackDayContext.Provider value={{ snackDays, setSnackDays }}>{children}</SnackDayContext.Provider>
}
