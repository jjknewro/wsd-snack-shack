import { useState } from 'react'

import { Button } from '@/components/Button'
import { ConfirmModal } from '@/components/ConfirmModal'
import { ErrorState } from '@/components/ErrorState'
import { Modal } from '@/components/Modal'
import { RequirementEntryModal } from '@/components/RequirementEntryModal'
import { RosterEntryModal } from '@/components/RosterEntryModal'
import '../components/SnapshotTable.css'
import { createLocalStorageSnackRepository } from '@/repositories/localStorageSnackRepository'
import { DataValidationError } from '@/repositories/jsonSnackRepository'
import { loadRepositorySafely } from '@/repositories/jsonSnackRepository'
import {
  isWritableSnackRepository,
  type SnackRepository,
  type SpecialRequirementRecord,
} from '@/repositories/snackRepository'
import type { MasterRosterEntry, SpecialRequirementEntry } from '@/types/roster'

export type MasterRosterProps = {
  // Defaults to the real, writable, localStorage-backed repository; tests
  // inject a read-only fixture repository instead, so they never depend on
  // (or accidentally write to) real browser storage. A fixture repository
  // simply doesn't satisfy isWritableSnackRepository, which hides all the
  // add/edit/delete UI below without any extra test-only branching.
  createRepository?: () => SnackRepository
}

type RosterModalState = { mode: 'add' } | { mode: 'edit'; entry: MasterRosterEntry } | null
type RequirementModalState =
  { mode: 'add' } | { mode: 'edit'; record: SpecialRequirementRecord } | null

function formatError(error: unknown, fallback: string): string {
  return error instanceof DataValidationError ? error.message : fallback
}

export function MasterRoster({
  createRepository = createLocalStorageSnackRepository,
}: MasterRosterProps = {}) {
  const [selectedBunk, setSelectedBunk] = useState<string | null>(null)
  // Forces a re-render after a mutation so the table re-reads the
  // repository's now-updated data - createRepository() (below) isn't
  // memoized, so every render already reflects the latest localStorage
  // state; this state only exists to trigger that render.
  const [, setRefreshTick] = useState(0)

  const [rosterModal, setRosterModal] = useState<RosterModalState>(null)
  const [rosterFormError, setRosterFormError] = useState<string | null>(null)
  const [confirmDeleteBunk, setConfirmDeleteBunk] = useState<string | null>(null)

  const [requirementModal, setRequirementModal] = useState<RequirementModalState>(null)
  const [requirementFormError, setRequirementFormError] = useState<string | null>(null)
  const [confirmDeleteRequirementId, setConfirmDeleteRequirementId] = useState<string | null>(null)

  const { repository, error: loadError } = loadRepositorySafely(createRepository)

  if (!repository) {
    return (
      <div>
        <h2>Master Roster</h2>
        <ErrorState message={loadError} />
      </div>
    )
  }

  const writable = isWritableSnackRepository(repository) ? repository : null

  const roster = repository.getRoster()
  const selectedRequirements = selectedBunk
    ? repository.getSpecialRequirementsForBunk(selectedBunk)
    : []
  const selectedRequirementRecords = writable
    ? writable.getSpecialRequirements().filter((r) => r.bunk === selectedBunk)
    : []

  function refresh() {
    setRefreshTick((tick) => tick + 1)
  }

  function handleSaveRosterEntry(entry: MasterRosterEntry) {
    if (!writable) return
    try {
      if (rosterModal?.mode === 'edit') {
        writable.updateRosterEntry(rosterModal.entry.bunk, entry)
      } else {
        writable.addRosterEntry(entry)
      }
      setRosterModal(null)
      setRosterFormError(null)
      refresh()
    } catch (error) {
      setRosterFormError(formatError(error, 'Could not save that bunk.'))
    }
  }

  function handleDeleteBunk(bunk: string) {
    if (!writable) return
    writable.deleteRosterEntry(bunk)
    setConfirmDeleteBunk(null)
    if (selectedBunk === bunk) setSelectedBunk(null)
    refresh()
  }

  function handleSaveRequirement(entry: SpecialRequirementEntry) {
    if (!writable) return
    try {
      if (requirementModal?.mode === 'edit') {
        writable.updateSpecialRequirement(requirementModal.record.id, entry)
      } else {
        writable.addSpecialRequirement(entry)
      }
      setRequirementModal(null)
      setRequirementFormError(null)
      refresh()
    } catch (error) {
      setRequirementFormError(formatError(error, 'Could not save that requirement.'))
    }
  }

  function handleDeleteRequirement(id: string) {
    if (!writable) return
    writable.deleteSpecialRequirement(id)
    setConfirmDeleteRequirementId(null)
    refresh()
  }

  const bunkPendingDelete = confirmDeleteBunk
    ? {
        bunk: confirmDeleteBunk,
        requirementCount: repository.getSpecialRequirementsForBunk(confirmDeleteBunk).length,
      }
    : null

  return (
    <div>
      <h2>Master Roster</h2>
      <p className="snapshot-note">
        {writable
          ? 'Edits are saved on this device and persist across reloads. Click a bunk to view or edit its special requirements.'
          : 'Mock data. Click a bunk to view its special requirements.'}
      </p>

      {writable ? <Button onClick={() => setRosterModal({ mode: 'add' })}>Add Bunk</Button> : null}

      <div className="snapshot-table-wrapper">
        <table className="snapshot-table">
          <thead>
            <tr>
              <th>Bunk</th>
              <th>Counselors</th>
              <th># of Campers</th>
              <th>Special Requirements</th>
              {writable ? <th>Actions</th> : null}
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
                {writable ? (
                  <td>
                    <div className="snapshot-table__row-actions">
                      <Button
                        variant="secondary"
                        onClick={() => setRosterModal({ mode: 'edit', entry: row })}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => setConfirmDeleteBunk(row.bunk)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBunk && !requirementModal && !confirmDeleteRequirementId ? (
        <Modal
          title={`Bunk ${selectedBunk} — Special Requirements`}
          onClose={() => setSelectedBunk(null)}
        >
          {selectedRequirements.length === 0 ? (
            <p>No special requirements for this bunk.</p>
          ) : (
            <ul className="requirements-list">
              {(writable ? selectedRequirementRecords : selectedRequirements).map((r, index) => (
                <li key={writable ? (r as SpecialRequirementRecord).id : index}>
                  <strong>{r.requirement}</strong> × {r.quantity}
                  {r.notes ? <span className="requirements-list__notes"> — {r.notes}</span> : null}
                  {writable ? (
                    <div className="snapshot-table__row-actions">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setRequirementModal({
                            mode: 'edit',
                            record: r as SpecialRequirementRecord,
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          setConfirmDeleteRequirementId((r as SpecialRequirementRecord).id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {writable ? (
            <Button onClick={() => setRequirementModal({ mode: 'add' })}>Add Requirement</Button>
          ) : null}
        </Modal>
      ) : null}

      {rosterModal ? (
        <RosterEntryModal
          initialEntry={rosterModal.mode === 'edit' ? rosterModal.entry : undefined}
          error={rosterFormError}
          onSave={handleSaveRosterEntry}
          onClose={() => {
            setRosterModal(null)
            setRosterFormError(null)
          }}
        />
      ) : null}

      {bunkPendingDelete ? (
        <ConfirmModal
          title={`Delete Bunk ${bunkPendingDelete.bunk}?`}
          message={
            bunkPendingDelete.requirementCount > 0
              ? `This will also remove ${bunkPendingDelete.requirementCount} special requirement entr${bunkPendingDelete.requirementCount === 1 ? 'y' : 'ies'} for this bunk.`
              : 'This cannot be undone.'
          }
          onConfirm={() => handleDeleteBunk(bunkPendingDelete.bunk)}
          onCancel={() => setConfirmDeleteBunk(null)}
        />
      ) : null}

      {requirementModal && selectedBunk ? (
        <RequirementEntryModal
          bunk={selectedBunk}
          initialEntry={requirementModal.mode === 'edit' ? requirementModal.record : undefined}
          error={requirementFormError}
          onSave={handleSaveRequirement}
          onClose={() => {
            setRequirementModal(null)
            setRequirementFormError(null)
          }}
        />
      ) : null}

      {confirmDeleteRequirementId ? (
        <ConfirmModal
          title="Delete this requirement?"
          message="This cannot be undone."
          onConfirm={() => handleDeleteRequirement(confirmDeleteRequirementId)}
          onCancel={() => setConfirmDeleteRequirementId(null)}
        />
      ) : null}
    </div>
  )
}
