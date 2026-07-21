import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import { SnackDayProvider } from '../components/SnackDayProvider'
import { useSnackDays } from '../hooks/useSnackDays'
import type { SnackDay } from '../types/snackDay'

describe('useSnackDays', () => {
  it('throws a clear error when used outside a SnackDayProvider', () => {
    expect(() => renderHook(() => useSnackDays())).toThrow('useSnackDays must be used within a SnackDayProvider')
  })

  it('starts empty by default and updates via setSnackDays', () => {
    const { result } = renderHook(() => useSnackDays(), {
      wrapper: ({ children }) => <SnackDayProvider>{children}</SnackDayProvider>,
    })

    expect(result.current.snackDays).toEqual([])

    const day: SnackDay = { date: '2026-07-20', dayStatus: 'active', bunks: [] }
    act(() => result.current.setSnackDays([day]))

    expect(result.current.snackDays).toEqual([day])
  })

  it('accepts seeded initial days for testing', () => {
    const day: SnackDay = { date: '2026-07-19', dayStatus: 'closed', bunks: [] }

    const { result } = renderHook(() => useSnackDays(), {
      wrapper: ({ children }) => <SnackDayProvider initialSnackDays={[day]}>{children}</SnackDayProvider>,
    })

    expect(result.current.snackDays).toEqual([day])
  })
})
