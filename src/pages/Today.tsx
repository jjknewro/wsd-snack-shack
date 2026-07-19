import '../components/SnapshotTable.css'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { LoadingState } from '@/components/LoadingState'
import { StatusBadge } from '@/components/StatusBadge'
import { useWorkbookSnapshot } from '@/hooks/useWorkbookSnapshot'

export function Today() {
  const snapshot = useWorkbookSnapshot()

  return (
    <div>
      <h2>Today</h2>
      <p className="snapshot-note">
        Temporary local snapshot of the "snack shack today" worksheet, for reference only — not live
        data. The real daily dashboard and pickup workflow are built in a later epic. See
        WORKBOOK-SCHEMA.md.
      </p>

      {snapshot.status === 'loading' ? <LoadingState label="Loading today's sheet…" /> : null}
      {snapshot.status === 'error' ? <ErrorState message={snapshot.message} /> : null}
      {snapshot.status === 'ready' && snapshot.data.snackShackToday.length === 0 ? (
        <EmptyState message="No bunks found in today's sheet snapshot." />
      ) : null}

      {snapshot.status === 'ready' && snapshot.data.snackShackToday.length > 0 ? (
        <div className="snapshot-table-wrapper">
          <table className="snapshot-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Bunk</th>
                <th>Special Snack</th>
                <th>Notes</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.data.snackShackToday.map((row) => (
                <tr key={row.bunk}>
                  <td>
                    <StatusBadge
                      variant={row.pickedUp ? 'completed' : 'pending'}
                      label={row.pickedUp ? 'Picked Up' : 'Pending'}
                    />
                  </td>
                  <td>{row.bunk}</td>
                  <td>{row.specialSnack}</td>
                  <td>{row.notes}</td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
