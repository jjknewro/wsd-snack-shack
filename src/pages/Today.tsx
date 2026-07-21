import { useMemo, useState } from 'react'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { TodayFilters } from '@/components/TodayFilters'
import '../components/SnapshotTable.css'
import { useSnackDays } from '@/hooks/useSnackDays'
import { createJsonSnackRepository, DataValidationError } from '@/repositories/jsonSnackRepository'
import type { SnackRepository } from '@/repositories/snackRepository'
import { initializeSnackDay } from '@/services/snackDayInitialization'
import { filterTodayBunks, type TodayStatusFilter } from '@/services/todayFilters'

import { TodayBunkRow } from '../components/TodayBunkRow'

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export type TodayProps = {
  createRepository?: () => SnackRepository
  today?: () => string
}

// Note on the "loading" state required by this screen's design: repository
// creation reads bundled JSON synchronously (no network), so there is no
// real intermediate frame to render a loading indicator for today - it
// would be dead code exercised by nothing. See this task's log entry for
// the full reasoning; the states below (error / not-initialized / active /
// closed) are the ones actually reachable under the current architecture.
export function Today({ createRepository = createJsonSnackRepository, today = todayIsoDate }: TodayProps = {}) {
  const { snackDays, setSnackDays } = useSnackDays()
  const [statusFilter, setStatusFilter] = useState<TodayStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { repository, loadError } = useMemo(() => {
    try {
      return { repository: createRepository(), loadError: null as string | null }
    } catch (error) {
      const message = error instanceof DataValidationError ? error.message : 'Failed to load Snack Shack data.'
      return { repository: null, loadError: message }
    }
  }, [createRepository])

  if (loadError || !repository) {
    return (
      <div>
        <h2>Today</h2>
        <ErrorState message={loadError ?? 'Failed to load Snack Shack data.'} />
      </div>
    )
  }

  const date = today()
  const activeDay = snackDays.find((day) => day.date === date)

  if (!activeDay) {
    return (
      <div>
        <h2>Today</h2>
        <EmptyState message="Today hasn't been started yet." />
        <Button onClick={() => setSnackDays((current) => initializeSnackDay(repository, date, current))}>
          Start Today
        </Button>
      </div>
    )
  }

  const filteredBunks = filterTodayBunks(activeDay.bunks, statusFilter, searchTerm)

  return (
    <div>
      <h2>Today</h2>

      {activeDay.dayStatus === 'closed' ? (
        <p className="snapshot-note">
          <StatusBadge variant="completed" label="Day Closed" /> This day is closed and read-only.
        </p>
      ) : (
        <p className="snapshot-note">
          Pickup completion isn't built yet (see EPIC 6) — every bunk shows pending for now. Status is
          tracked for this session only and resets on page reload (see ARCHITECTURE.md, "Persistence
          — Current State").
        </p>
      )}

      {activeDay.bunks.length === 0 ? (
        <EmptyState message="No bunks found in the roster." />
      ) : (
        <>
          <TodayFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />

          {filteredBunks.length === 0 ? (
            <EmptyState message="No bunks match your search or filter." />
          ) : (
            <div className="snapshot-table-wrapper">
              <table className="snapshot-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Bunk</th>
                    <th># of Campers</th>
                    <th>Special Requirements</th>
                    <th>Pickup Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBunks.map((record) => (
                    <TodayBunkRow
                      key={record.bunk}
                      bunk={record.bunk}
                      campers={record.expectedCount}
                      status={record.status}
                      specialRequirementCount={record.specialRequirementCount}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
