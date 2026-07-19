import '../components/SnapshotTable.css'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { LoadingState } from '@/components/LoadingState'
import { useWorkbookSnapshot } from '@/hooks/useWorkbookSnapshot'

export function Requirements() {
  const snapshot = useWorkbookSnapshot()

  return (
    <div>
      <h2>Special Requirements</h2>
      <p className="snapshot-note">
        Temporary local snapshot of the "Allergies" worksheet, for reference only — not live data.
        See WORKBOOK-SCHEMA.md, including the two anomalous rows flagged there (an unresolved bunk
        and a stray total).
      </p>

      {snapshot.status === 'loading' ? (
        <LoadingState label="Loading special requirements…" />
      ) : null}
      {snapshot.status === 'error' ? <ErrorState message={snapshot.message} /> : null}
      {snapshot.status === 'ready' && snapshot.data.allergies.length === 0 ? (
        <EmptyState message="No special requirements found in the snapshot." />
      ) : null}

      {snapshot.status === 'ready' && snapshot.data.allergies.length > 0 ? (
        <div className="snapshot-table-wrapper">
          <table className="snapshot-table">
            <thead>
              <tr>
                <th>Bunk</th>
                <th>Requirement</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.data.allergies.map((row, index) => (
                <tr key={`${row.bunk ?? 'unknown'}-${index}`}>
                  <td>{row.bunk ?? '(unresolved)'}</td>
                  <td>{row.requirement ?? '(none)'}</td>
                  <td>{row.quantity ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
