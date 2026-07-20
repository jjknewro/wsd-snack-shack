import { useMemo, useState } from 'react'

import { ErrorState } from '@/components/ErrorState'
import { Modal } from '@/components/Modal'
import '../components/SnapshotTable.css'
import { createJsonSnackRepository, DataValidationError } from '@/repositories/jsonSnackRepository'

export function MasterRoster() {
  const [selectedBunk, setSelectedBunk] = useState<string | null>(null)

  const { repository, loadError } = useMemo(() => {
    try {
      return { repository: createJsonSnackRepository(), loadError: null as string | null }
    } catch (error) {
      const message = error instanceof DataValidationError ? error.message : 'Failed to load Snack Shack data.'
      return { repository: null, loadError: message }
    }
  }, [])

  if (!repository) {
    return (
      <div>
        <h2>Master Roster</h2>
        <ErrorState message={loadError ?? 'Failed to load Snack Shack data.'} />
      </div>
    )
  }

  const roster = repository.getRoster()
  const selectedRequirements = selectedBunk ? repository.getSpecialRequirementsForBunk(selectedBunk) : []

  return (
    <div>
      <h2>Master Roster</h2>
      <p className="snapshot-note">Mock data. Click a bunk to view its special requirements.</p>

      <div className="snapshot-table-wrapper">
        <table className="snapshot-table">
          <thead>
            <tr>
              <th>Bunk</th>
              <th>Counselors</th>
              <th># of Campers</th>
              <th>Special Requirements</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((row) => (
              <tr key={row.bunk}>
                <td>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setSelectedBunk(row.bunk)}
                  >
                    {row.bunk}
                  </button>
                </td>
                <td>{row.counselors}</td>
                <td>{row.campers ?? '—'}</td>
                <td>{repository.getSpecialRequirementsForBunk(row.bunk).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBunk ? (
        <Modal
          title={`Bunk ${selectedBunk} — Special Requirements`}
          onClose={() => setSelectedBunk(null)}
        >
          {selectedRequirements.length === 0 ? (
            <p>No special requirements for this bunk.</p>
          ) : (
            <ul className="requirements-list">
              {selectedRequirements.map((r, index) => (
                <li key={index}>
                  <strong>{r.requirement}</strong> × {r.quantity}
                  {r.notes ? <span className="requirements-list__notes"> — {r.notes}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      ) : null}
    </div>
  )
}
