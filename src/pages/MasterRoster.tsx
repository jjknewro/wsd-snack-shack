import '../components/SnapshotTable.css'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { LoadingState } from '@/components/LoadingState'
import { useWorkbookSnapshot } from '@/hooks/useWorkbookSnapshot'

export function MasterRoster() {
  const snapshot = useWorkbookSnapshot()

  return (
    <div>
      <h2>Master Roster</h2>
      <p className="snapshot-note">
        Temporary local snapshot of the "Master Roster" worksheet, for reference only — not live
        data. See WORKBOOK-SCHEMA.md.
      </p>

      {snapshot.status === 'loading' ? <LoadingState label="Loading roster…" /> : null}
      {snapshot.status === 'error' ? <ErrorState message={snapshot.message} /> : null}
      {snapshot.status === 'ready' && snapshot.data.masterRoster.length === 0 ? (
        <EmptyState message="No bunks found in the roster snapshot." />
      ) : null}

      {snapshot.status === 'ready' && snapshot.data.masterRoster.length > 0 ? (
        <div className="snapshot-table-wrapper">
          <table className="snapshot-table">
            <thead>
              <tr>
                <th>Division</th>
                <th>Bunk</th>
                <th>Counselors</th>
                <th>Special Snack</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.data.masterRoster.map((row) => (
                <tr key={row.bunk}>
                  <td>{row.division}</td>
                  <td>{row.bunk}</td>
                  <td>{row.counselors}</td>
                  <td>{row.specialSnack}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
