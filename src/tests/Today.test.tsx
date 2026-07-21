import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

import { SnackDayProvider } from '../components/SnackDayProvider'
import { Today } from '../pages/Today'
import { DataValidationError } from '../repositories/jsonSnackRepository'
import type { SnackRepository } from '../repositories/snackRepository'
import type { SnackDay } from '../types/snackDay'
import type { MasterRosterEntry, SpecialRequirementEntry } from '../types/roster'

const FIXED_DATE = '2026-07-20'

const fixtureRoster: MasterRosterEntry[] = [
  { bunk: 'A1', counselors: 'Alex', campers: 8 },
  { bunk: 'B2', counselors: 'Bailey' },
]

const fixtureRequirements: SpecialRequirementEntry[] = [{ bunk: 'A1', requirement: 'No Dairy', quantity: 1 }]

function createFixtureRepository(): SnackRepository {
  return {
    getRoster: () => fixtureRoster,
    getSpecialRequirementsForBunk: (bunk) => fixtureRequirements.filter((entry) => entry.bunk === bunk),
  }
}

function renderToday(
  props: Partial<Parameters<typeof Today>[0]> = {},
  initialSnackDays: SnackDay[] = [],
) {
  return render(
    <SnackDayProvider initialSnackDays={initialSnackDays}>
      <Today createRepository={createFixtureRepository} today={() => FIXED_DATE} {...props} />
    </SnackDayProvider>,
  )
}

describe('Today', () => {
  it('starts not-initialized, with a clear next action', () => {
    renderToday()

    expect(screen.getByText("Today hasn't been started yet.")).toBeVisible()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start Today' })).toBeVisible()
  })

  it('initializes and shows the active day when Start Today is clicked, with no data left visible without opening a record', () => {
    renderToday()

    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    const a1Row = screen.getByText('A1').closest('tr') as HTMLElement
    expect(within(a1Row).getByText('Pending')).toBeVisible()
    expect(within(a1Row).getByText('8')).toBeVisible()
    expect(within(a1Row).getByText('1 special requirement')).toBeVisible()

    const b2Row = screen.getByText('B2').closest('tr') as HTMLElement
    expect(within(b2Row).getByText('None')).toBeVisible()

    expect(screen.queryByRole('button', { name: 'Start Today' })).not.toBeInTheDocument()
  })

  it('shows a read-only closed-day view for a day already marked closed', () => {
    const closedDay: SnackDay = {
      date: FIXED_DATE,
      dayStatus: 'closed',
      bunks: [{ bunk: 'A1', counselors: 'Alex', expectedCount: 8, specialRequirementCount: 1, status: 'completed' }],
    }

    renderToday({}, [closedDay])

    expect(screen.getByText('Day Closed')).toBeVisible()
    expect(screen.getByText('Picked Up')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Start Today' })).not.toBeInTheDocument()
  })

  it('filters the table by status, and clearing filters restores the full list', () => {
    renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    expect(screen.getByText('A1')).toBeVisible()
    expect(screen.getByText('B2')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Special Requirements' }))
    expect(screen.getByText('A1')).toBeVisible()
    expect(screen.queryByText('B2')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('A1')).toBeVisible()
    expect(screen.getByText('B2')).toBeVisible()
  })

  it('searches by bunk name, and shows an empty state distinct from "no bunks at all" when nothing matches', () => {
    renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'B2' } })
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
    expect(screen.getByText('B2')).toBeVisible()

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'nonexistent bunk' } })
    expect(screen.getByText('No bunks match your search or filter.')).toBeVisible()
    expect(screen.queryByText('No bunks found in the roster.')).not.toBeInTheDocument()
  })

  it('searches by counselor name', () => {
    renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Bailey' } })
    expect(screen.getByText('B2')).toBeVisible()
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
  })

  it('shows an empty state if an active day has no bunks', () => {
    const emptyDay: SnackDay = { date: FIXED_DATE, dayStatus: 'active', bunks: [] }

    renderToday({}, [emptyDay])

    expect(screen.getByText('No bunks found in the roster.')).toBeVisible()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('survives Today unmounting and remounting within the same provider, simulating navigating away and back', () => {
    function Wrapper({ showToday }: { showToday: boolean }) {
      return (
        <SnackDayProvider>
          {showToday ? (
            <Today createRepository={createFixtureRepository} today={() => FIXED_DATE} />
          ) : (
            <p>Elsewhere</p>
          )}
        </SnackDayProvider>
      )
    }

    const { rerender } = render(<Wrapper showToday={true} />)
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))
    expect(screen.getByText('A1')).toBeVisible()

    rerender(<Wrapper showToday={false} />)
    expect(screen.getByText('Elsewhere')).toBeVisible()

    rerender(<Wrapper showToday={true} />)
    expect(screen.getByText('A1')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Start Today' })).not.toBeInTheDocument()
  })

  it('shows a controlled error instead of the table when the repository fails to load', () => {
    const createFailingRepository = () => {
      throw new DataValidationError([{ file: 'masterRoster.json', index: 0, message: 'Missing or invalid "bunk".' }])
    }

    render(
      <SnackDayProvider>
        <Today createRepository={createFailingRepository} today={() => FIXED_DATE} />
      </SnackDayProvider>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('masterRoster.json')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
