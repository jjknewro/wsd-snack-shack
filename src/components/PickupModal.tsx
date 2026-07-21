import { useState, type FormEvent } from 'react'

import type { SnackDayBunkRecord } from '@/types/snackDay'

import './PickupModal.css'
import { Button } from './Button'
import { Modal } from './Modal'
import { StatusBadge } from './StatusBadge'
import { TextField } from './TextField'

export type PickupModalProps = {
  record: SnackDayBunkRecord
  onClose: () => void
  onComplete: (input: { actualCount?: number; notes?: string }) => void
  submitError?: string | null
}

// Double-submit protection (Task 6.3's "blocks accidental repeated
// submission") isn't needed here beyond what completePickup's own
// already-completed guard provides: everything runs synchronously on the
// main thread, so a second click can't fire until the first click's handler
// (and the resulting re-render) has already finished — there's no async
// window for a race to happen in. Full optimistic/in-flight UI behavior is
// Task 6.6's job, for whenever a real write boundary (network or otherwise)
// exists to be "in flight" against.
export function PickupModal({ record, onClose, onComplete, submitError = null }: PickupModalProps) {
  const [actualCount, setActualCount] = useState(
    record.expectedCount !== undefined ? String(record.expectedCount) : '',
  )
  const [notes, setNotes] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedCount = actualCount.trim()
    onComplete({
      actualCount: trimmedCount === '' ? undefined : Number(trimmedCount),
      notes: notes.trim() === '' ? undefined : notes.trim(),
    })
  }

  return (
    <Modal title={`Bunk ${record.bunk} — Pickup`} onClose={onClose}>
      <dl className="pickup-modal__details">
        <div>
          <dt>Counselors</dt>
          <dd>{record.counselors}</dd>
        </div>
        <div>
          <dt>Expected count</dt>
          <dd>{record.expectedCount ?? '—'}</dd>
        </div>
      </dl>

      {record.specialRequirements.length === 0 ? (
        <p>No special requirements for this bunk.</p>
      ) : (
        <ul className="requirements-list">
          {record.specialRequirements.map((requirement, index) => (
            <li key={index}>
              <strong>{requirement.requirement}</strong> × {requirement.quantity}
              {requirement.notes ? <span className="requirements-list__notes"> — {requirement.notes}</span> : null}
            </li>
          ))}
        </ul>
      )}

      {record.status === 'completed' ? (
        <p className="pickup-modal__completed-note">
          <StatusBadge variant="completed" label="Picked Up" />
          {record.completedAt ? ` at ${record.completedAt}` : null} — corrections aren't supported yet (see EPIC 6,
          Task 6.4).
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="pickup-modal__form">
          <TextField
            label="Actual count"
            type="number"
            inputMode="numeric"
            min={0}
            value={actualCount}
            onChange={(event) => setActualCount(event.target.value)}
          />
          <TextField label="Notes (optional)" value={notes} onChange={(event) => setNotes(event.target.value)} />
          {submitError ? (
            <p role="alert" className="pickup-modal__error">
              {submitError}
            </p>
          ) : null}
          <Button type="submit">Complete Pickup</Button>
        </form>
      )}
    </Modal>
  )
}
