import { useState } from 'react'

import { Modal } from '@/components/Modal'
import '../components/SnapshotTable.css'
import masterRoster from '@/data/masterRoster.json'
import specialRequirements from '@/data/specialRequirements.json'
import { getRequirementCountForBunk } from '@/services/specialRequirements'
import type { MasterRosterEntry, SpecialRequirementEntry } from '@/types/roster'

const roster = masterRoster as MasterRosterEntry[]
const requirements = specialRequirements as SpecialRequirementEntry[]

export function MasterRoster() {
  const [selectedBunk, setSelectedBunk] = useState<string | null>(null)

  const selectedRequirements = requirements.filter((r) => r.bunk === selectedBunk)

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
                <td>{getRequirementCountForBunk(row.bunk, requirements)}</td>
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
