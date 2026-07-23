import { useState } from 'react'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { PickupModal } from '@/components/PickupModal'
import { StatusBadge } from '@/components/StatusBadge'
import { TodayFilters } from '@/components/TodayFilters'
import { TodayRefreshControls } from '@/components/TodayRefreshControls'
import { TodaySummary } from '@/components/TodaySummary'
import '../components/SnapshotTable.css'
import { useSnackDays } from '@/hooks/useSnackDays'
import { loadRepositorySafely } from '@/repositories/jsonSnackRepository'
import { createLocalStorageSnackRepository } from '@/repositories/localStorageSnackRepository'
import type { SnackRepository } from '@/repositories/snackRepository'
import { completePickup } from '@/services/completePickup'
import { reopenPickup } from '@/services/reopenPickup'
import { initializeSnackDay, refreshSnackDay } from '@/services/snackDayInitialization'
import { filterTodayBunks, type TodayStatusFilter } from '@/services/todayFilters'
import { summarizeToday } from '@/services/todaySummary'
import { updatePickupNotes } from '@/services/updatePickupNotes'
import type { SnackDayBunkRecord } from '@/types/snackDay'

import { TodayBunkRow } from '../components/TodayBunkRow'

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function defaultNow(): string {
  return new Date().toLocaleTimeString()
}

export type TodayProps = {
  createRepository?: () => SnackRepository
  today?: () => string
  now?: () => string
}

// Note on the "loading" state required by this screen's design: repository
// creation reads bundled JSON synchronously (no network), so there is no
// real intermediate frame to render a loading indicator for today - it
// would be dead code exercised by nothing. See this task's log entry for
// the full reasoning; the states below (error / not-initialized / active /
// closed) are the ones actually reachable under the current architecture.
export function Today({
  createRepository = createLocalStorageSnackRepository,
  today = todayIsoDate,
  now = defaultNow,
}: TodayProps = {}) {
  const { snackDays, setSnackDays } = useSnackDays()
  const [statusFilter, setStatusFilter] = useState<TodayStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBunk, setSelectedBunk] = useState<string | null>(null)
  const [completeError, setCompleteError] = useState<string | null>(null)

  const [repositoryState, setRepositoryState] = useState(() => loadRepositorySafely(createRepository))
  // Set unconditionally at mount — the initial load already counts as the
  // first "refresh" (see TodayRefreshControls). If the load failed, this
  // value simply never gets rendered (the error branch below returns first).
  const [lastRefreshedAt, setLastRefreshedAt] = useState(now)
  const [refreshError, setRefreshError] = useState<string | null>(null)

  // Plain reload, no confirmation - used by the error state's "Try Again"
  // action, which has no recorded pickups to lose (it fires before any day
  // has ever loaded successfully).
  function reloadRepository() {
    const result = loadRepositorySafely(createRepository)
    if (result.repository) {
      setRepositoryState(result)
      setLastRefreshedAt(now())
      setRefreshError(null)
    } else {
      // Keep whatever was already loaded and displayed — a failed refresh
      // must not erase previously-good data, it just can't update it.
      setRefreshError(result.error)
    }
    return result
  }

  const { repository, error: loadError } = repositoryState
  const date = today()
  const activeDay = snackDays.find((day) => day.date === date)

  // The operator-facing "Refresh" button: confirms first, since a
  // successful refresh always re-pulls today from the master roster (see
  // refreshSnackDay) and discards any pickups already recorded today, not
  // just today's bunk list.
  function handleRefreshToday() {
    const confirmed = window.confirm(
      "Refresh today's list from the master roster? This will discard any pickups already recorded today.",
    )
    if (!confirmed) return

    const result = reloadRepository()
    if (result.repository && activeDay) {
      setSnackDays((current) => refreshSnackDay(result.repository, date, current))
    }
  }

  if (!repository) {
    return (
      <div>
        <h2>Today</h2>
        <ErrorState message={loadError} onRetry={reloadRepository} />
      </div>
    )
  }

  if (!activeDay) {
    return (
      <div>
        <h2>Today</h2>
        <EmptyState message="Today hasn't been started yet." />
        <Button onClick={() => setSnackDays((current) => initializeSnackDay(repository, date, current))}>
          Start Today
        </Button>
        <TodayRefreshControls
          lastRefreshedAt={lastRefreshedAt}
          refreshError={refreshError}
          onRefresh={handleRefreshToday}
        />
      </div>
    )
  }

  const filteredBunks = filterTodayBunks(activeDay.bunks, statusFilter, searchTerm)
  const selectedRecord = selectedBunk ? activeDay.bunks.find((record) => record.bunk === selectedBunk) : undefined

  function handleComplete(input: { actualCount?: number; notes?: string }) {
    if (!selectedBunk) return

    const result = completePickup(snackDays, date, selectedBunk, input, now)
    if (result.success) {
      setSnackDays(result.data)
      setSelectedBunk(null)
      setCompleteError(null)
    } else {
      setCompleteError(result.message)
    }
  }

  function closeModal() {
    setSelectedBunk(null)
    setCompleteError(null)
  }

  // The checkbox's quicker alternative to the pickup dialog: checking it
  // completes with the expected count (matching what submitting the
  // dialog's own pre-filled, unedited count would produce), unchecking
  // reopens. Both are structurally guaranteed to match the bunk's current
  // status, so the failure branch of each service call can never actually
  // be reached here (unlike handleComplete's dialog-driven path).
  function handleToggleComplete(record: SnackDayBunkRecord, checked: boolean) {
    if (checked) {
      const result = completePickup(snackDays, date, record.bunk, { actualCount: record.expectedCount }, now)
      if (result.success) setSnackDays(result.data)
    } else {
      const result = reopenPickup(snackDays, date, record.bunk)
      if (result.success) setSnackDays(result.data)
    }
  }

  // Notes are editable inline for any bunk, pending or completed - unlike
  // the checkbox and pickup dialog, this isn't tied to completion status.
  function handleNotesChange(record: SnackDayBunkRecord, notes: string) {
    const result = updatePickupNotes(snackDays, date, record.bunk, notes)
    if (result.success) setSnackDays(result.data)
  }

  return (
    <div>
      <h2>Today</h2>

      {activeDay.dayStatus === 'closed' ? (
        <p className="snapshot-note">
          <StatusBadge variant="completed" label="Day Closed" /> This day is closed and read-only.
        </p>
      ) : (
        <p className="snapshot-note">
          Click a bunk to record its pickup. Status is tracked for this session only and resets on page
          reload (see ARCHITECTURE.md, "Persistence — Current State").
        </p>
      )}

      <TodaySummary summary={summarizeToday(activeDay.bunks)} />

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
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBunks.map((record) => (
                    <TodayBunkRow
                      key={record.bunk}
                      bunk={record.bunk}
                      campers={record.expectedCount}
                      status={record.status}
                      specialRequirementCount={record.specialRequirements.length}
                      pickupTime={record.completedAt}
                      onSelect={() => setSelectedBunk(record.bunk)}
                      onToggleComplete={(checked) => handleToggleComplete(record, checked)}
                      toggleDisabled={activeDay.dayStatus === 'closed'}
                      notes={record.pickupNotes}
                      onNotesChange={(notes) => handleNotesChange(record, notes)}
                      notesDisabled={activeDay.dayStatus === 'closed'}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {selectedRecord ? (
        <PickupModal
          record={selectedRecord}
          onClose={closeModal}
          onComplete={handleComplete}
          submitError={completeError}
        />
      ) : null}

      <TodayRefreshControls lastRefreshedAt={lastRefreshedAt} refreshError={refreshError} onRefresh={handleRefreshToday} />
    </div>
  )
}
