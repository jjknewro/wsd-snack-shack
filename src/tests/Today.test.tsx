import { afterEach, describe, expect, it, vi } from 'vitest'
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
  afterEach(() => {
    vi.restoreAllMocks()
  })

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
    expect(within(a1Row).getByRole('checkbox')).not.toBeChecked()
    expect(within(a1Row).getByText('8')).toBeVisible()
    expect(within(a1Row).getByText('1 special requirement')).toBeVisible()

    const b2Row = screen.getByText('B2').closest('tr') as HTMLElement
    expect(within(b2Row).getByText('None')).toBeVisible()

    expect(screen.queryByRole('button', { name: 'Start Today' })).not.toBeInTheDocument()
  })

  it('opens a pickup dialog showing bunk info and special requirements when a bunk is clicked', () => {
    renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Alex')).toBeVisible()
    expect(within(dialog).getByText('No Dairy')).toBeVisible()
    expect(within(dialog).getByLabelText('Actual count')).toHaveValue(8)
  })

  it('completes a pickup with the default (expected) count, updating status and pickup time', () => {
    renderToday({ now: () => '10:15:00 AM' })
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Complete Pickup' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const a1Row = screen.getByText('A1').closest('tr') as HTMLElement
    expect(within(a1Row).getByRole('checkbox')).toBeChecked()
    expect(within(a1Row).getByText('10:15:00 AM')).toBeVisible()
  })

  it('completes a pickup with an adjusted count and notes', () => {
    const { container } = renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))
    fireEvent.change(screen.getByLabelText('Actual count'), { target: { value: '6' } })
    fireEvent.change(screen.getByLabelText('Notes (optional)'), { target: { value: 'Two campers absent' } })
    fireEvent.click(screen.getByRole('button', { name: 'Complete Pickup' }))

    // Reflected in the summary, proving the adjusted count (not the
    // expected count) was actually recorded.
    const summary = container.querySelector('.today-summary') as HTMLElement
    const actualServedRow = within(summary).getByText('Actual campers served').closest('div') as HTMLElement
    expect(within(actualServedRow).getByText('6')).toBeVisible()
  })

  it('checking a bunk\'s checkbox completes it with the expected count, without opening the dialog', () => {
    renderToday({ now: () => '10:15:00 AM' })
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    const a1Row = screen.getByText('A1').closest('tr') as HTMLElement
    fireEvent.click(within(a1Row).getByRole('checkbox'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(within(a1Row).getByRole('checkbox')).toBeChecked()
    expect(within(a1Row).getByText('10:15:00 AM')).toBeVisible()

    // Expected count (8) was used as the actual count, same as submitting
    // the dialog's own pre-filled, unedited value would produce.
    const b2Row = screen.getByText('B2').closest('tr') as HTMLElement
    fireEvent.click(within(b2Row).getByRole('checkbox'))
    const summary = document.querySelector('.today-summary') as HTMLElement
    const actualServedRow = within(summary).getByText('Actual campers served').closest('div') as HTMLElement
    expect(within(actualServedRow).getByText('8')).toBeVisible()
  })

  it('unchecking a completed bunk\'s checkbox reopens it to pending, clearing its pickup time', () => {
    renderToday({ now: () => '10:15:00 AM' })
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    const a1Row = screen.getByText('A1').closest('tr') as HTMLElement
    fireEvent.click(within(a1Row).getByRole('checkbox'))
    expect(within(a1Row).getByRole('checkbox')).toBeChecked()

    fireEvent.click(within(a1Row).getByRole('checkbox'))

    expect(within(a1Row).getByRole('checkbox')).not.toBeChecked()
    expect(within(a1Row).getByText('—')).toBeVisible()
  })

  it('disables the checkbox on a closed (read-only) day', () => {
    const closedDay: SnackDay = {
      date: FIXED_DATE,
      dayStatus: 'closed',
      bunks: [{ bunk: 'A1', counselors: 'Alex', expectedCount: 8, specialRequirements: [], status: 'completed', actualCount: 8, completedAt: '9:00:00 AM' }],
    }

    renderToday({}, [closedDay])

    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('shows a read-only note instead of the form for an already-completed bunk, with no way to resubmit', () => {
    const closedDay: SnackDay = {
      date: FIXED_DATE,
      dayStatus: 'active',
      bunks: [
        {
          bunk: 'A1',
          counselors: 'Alex',
          expectedCount: 8,
          specialRequirements: [],
          status: 'completed',
          actualCount: 8,
          completedAt: '9:00:00 AM',
        },
      ],
    }

    renderToday({}, [closedDay])
    fireEvent.click(screen.getByRole('button', { name: 'A1' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/corrections aren't supported yet/)).toBeVisible()
    expect(within(dialog).queryByRole('button', { name: 'Complete Pickup' })).not.toBeInTheDocument()
  })

  it('closing the pickup dialog without completing leaves the bunk pending', () => {
    renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const a1Row = screen.getByText('A1').closest('tr') as HTMLElement
    expect(within(a1Row).getByRole('checkbox')).not.toBeChecked()
  })

  it('rejects completing a still-pending bunk on a closed day, keeping the dialog open with a clear error', () => {
    const closedDayWithPendingBunk: SnackDay = {
      date: FIXED_DATE,
      dayStatus: 'closed',
      bunks: [{ bunk: 'A1', counselors: 'Alex', expectedCount: 8, specialRequirements: [], status: 'pending' }],
    }

    renderToday({}, [closedDayWithPendingBunk])
    fireEvent.click(screen.getByRole('button', { name: 'A1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Complete Pickup' }))

    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('closed')

    const a1Row = screen.getByText('A1').closest('tr') as HTMLElement
    expect(within(a1Row).getByRole('checkbox')).not.toBeChecked()
  })

  it('shows a read-only closed-day view for a day already marked closed', () => {
    const closedDay: SnackDay = {
      date: FIXED_DATE,
      dayStatus: 'closed',
      bunks: [
        {
          bunk: 'A1',
          counselors: 'Alex',
          expectedCount: 8,
          specialRequirements: fixtureRequirements,
          status: 'completed',
          actualCount: 7,
          completedAt: '9:00:00 AM',
        },
      ],
    }

    renderToday({}, [closedDay])

    expect(screen.getByText('Day Closed')).toBeVisible()
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Start Today' })).not.toBeInTheDocument()
  })

  it('shows a summary matching the active records, independent of the current filter/search', () => {
    const { container } = renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    const summary = container.querySelector('.today-summary') as HTMLElement
    const totalRow = within(summary).getByText('Total bunks').closest('div') as HTMLElement
    expect(within(totalRow).getByText('2')).toBeVisible()

    const pendingRow = within(summary).getByText('Pending').closest('div') as HTMLElement
    expect(within(pendingRow).getByText('2')).toBeVisible()

    // Narrowing the visible table via search must not change the summary —
    // it reflects the whole active day, not the current filtered view.
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'A1' } })
    expect(within(totalRow).getByText('2')).toBeVisible()
  })

  it('reflects a completed bunk in the summary for a closed day', () => {
    const closedDay: SnackDay = {
      date: FIXED_DATE,
      dayStatus: 'closed',
      bunks: [
        {
          bunk: 'A1',
          counselors: 'Alex',
          expectedCount: 8,
          specialRequirements: fixtureRequirements,
          status: 'completed',
          actualCount: 7,
          completedAt: '9:00:00 AM',
        },
      ],
    }

    const { container } = renderToday({}, [closedDay])

    const summary = container.querySelector('.today-summary') as HTMLElement
    const completedRow = within(summary).getByText('Bunks Done').closest('div') as HTMLElement
    expect(within(completedRow).getByText('1')).toBeVisible()

    const actualServedRow = within(summary).getByText('Actual campers served').closest('div') as HTMLElement
    expect(within(actualServedRow).getByText('7')).toBeVisible()
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

  it('shows an empty state and a zero-value summary if an active day has no bunks, without crashing', () => {
    const emptyDay: SnackDay = { date: FIXED_DATE, dayStatus: 'active', bunks: [] }

    const { container } = renderToday({}, [emptyDay])

    expect(screen.getByText('No bunks found in the roster.')).toBeVisible()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    const summary = container.querySelector('.today-summary') as HTMLElement
    const totalRow = within(summary).getByText('Total bunks').closest('div') as HTMLElement
    expect(within(totalRow).getByText('0')).toBeVisible()
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

  it('shows the initial load time immediately, and updates it when the operator confirms a refresh', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    let clockValue = '10:00:00 AM'
    renderToday({ now: () => clockValue })

    expect(screen.getByText('Last refreshed: 10:00:00 AM')).toBeVisible()

    clockValue = '10:05:00 AM'
    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }))

    expect(window.confirm).toHaveBeenCalled()
    expect(screen.getByText('Last refreshed: 10:05:00 AM')).toBeVisible()
  })

  it('does nothing if the operator declines the refresh confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    let clockValue = '10:00:00 AM'
    renderToday({ now: () => clockValue })
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    clockValue = '10:05:00 AM'
    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }))

    expect(screen.getByText('Last refreshed: 10:00:00 AM')).toBeVisible()
  })

  it('a confirmed refresh always reloads today from the master roster, even though it was already initialized, discarding recorded pickups', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderToday()
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Complete Pickup' }))

    const a1RowBefore = screen.getByText('A1').closest('tr') as HTMLElement
    expect(within(a1RowBefore).getByRole('checkbox')).toBeChecked()

    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }))

    // Refresh always rebuilds today from the master roster, so the earlier
    // completion is gone and the bunk is back to pending — this is exactly
    // the tradeoff the confirmation above warns about.
    const a1RowAfter = screen.getByText('A1').closest('tr') as HTMLElement
    expect(within(a1RowAfter).getByRole('checkbox')).not.toBeChecked()
  })

  it('a confirmed refresh before Start Today only reloads the repository, without starting today', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderToday()

    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }))

    expect(screen.getByText("Today hasn't been started yet.")).toBeVisible()
    expect(screen.getByRole('button', { name: 'Start Today' })).toBeVisible()
  })

  it('retrying from the error state via the Refresh action recovers once the data loads successfully', () => {
    let shouldFail = true
    const createSometimesFailingRepository = () => {
      if (shouldFail) {
        throw new DataValidationError([{ file: 'masterRoster.json', index: 0, message: 'Missing or invalid "bunk".' }])
      }
      return createFixtureRepository()
    }

    renderToday({ createRepository: createSometimesFailingRepository })

    expect(screen.getByRole('alert')).toHaveTextContent('masterRoster.json')

    shouldFail = false
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(screen.getByText("Today hasn't been started yet.")).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('a failed refresh keeps the previously loaded data visible and reports the failure separately', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    let shouldFail = false
    const createSometimesFailingRepository = () => {
      if (shouldFail) {
        throw new DataValidationError([{ file: 'masterRoster.json', index: 0, message: 'Missing or invalid "bunk".' }])
      }
      return createFixtureRepository()
    }

    renderToday({ createRepository: createSometimesFailingRepository })
    fireEvent.click(screen.getByRole('button', { name: 'Start Today' }))
    expect(screen.getByText('A1')).toBeVisible()

    shouldFail = true
    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }))

    // The previously-loaded active day must still be fully visible...
    expect(screen.getByText('A1')).toBeVisible()
    expect(screen.getByText('B2')).toBeVisible()
    // ...alongside a clear report that the refresh itself failed.
    expect(screen.getByRole('alert')).toHaveTextContent('masterRoster.json')
  })
})
