import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

import type { SnackDay } from '@/types/snackDay'

export type SnackDayContextValue = {
  snackDays: SnackDay[]
  setSnackDays: Dispatch<SetStateAction<SnackDay[]>>
}

export const SnackDayContext = createContext<SnackDayContextValue | null>(null)

export function useSnackDays(): SnackDayContextValue {
  const context = useContext(SnackDayContext)
  if (!context) {
    throw new Error('useSnackDays must be used within a SnackDayProvider')
  }
  return context
}
