import { useMemo } from 'react'

import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import '../components/SnapshotTable.css'
import { createJsonSnackRepository, DataValidationError } from '@/repositories/jsonSnackRepository'
import type { SnackRepository } from '@/repositories/snackRepository'

import { TodayBunkRow } from '../components/TodayBunkRow'

export type TodayProps = {
  createRepository?: () => SnackRepository
}

export function Today({ createRepository = createJsonSnackRepository }: TodayProps = {}) {
  const { repository, loadError } = useMemo(() => {
    try {
      return { repository: createRepository(), loadError: null as string | null }
    } catch (error) {
      const message = error instanceof DataValidationError ? error.message : 'Failed to load Snack Shack data.'
      return { repository: null, loadError: message }
    }
  }, [createRepository])

  if (!repository) {
    return (
      <div>
        <h2>Today</h2>
        <ErrorState message={loadError ?? 'Failed to load Snack Shack data.'} />
      </div>
    )
  }

  const roster = repository.getRoster()

  return (
    <div>
      <h2>Today</h2>
      <p className="snapshot-note">
        Every bunk shown as pending — pickup completion isn't built yet (see EPIC 6). Pickup status
        will be tracked for the current session only, once that exists (see ARCHITECTURE.md,
        "Persistence — Current State").
      </p>

      {roster.length === 0 ? (
        <EmptyState message="No bunks found in the roster." />
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
              {roster.map((row) => (
                <TodayBunkRow
                  key={row.bunk}
                  bunk={row.bunk}
                  campers={row.campers}
                  status="pending"
                  specialRequirementCount={repository.getSpecialRequirementsForBunk(row.bunk).length}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
