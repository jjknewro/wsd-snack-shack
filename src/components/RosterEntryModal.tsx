import { useState, type FormEvent } from 'react'

import type { MasterRosterEntry } from '@/types/roster'

import { Button } from './Button'
import { Modal } from './Modal'
import './RosterEntryModal.css'
import { TextField } from './TextField'

export type RosterEntryModalProps = {
  initialEntry?: MasterRosterEntry
  error?: string | null
  onSave: (entry: MasterRosterEntry) => void
  onClose: () => void
}

export function RosterEntryModal({
  initialEntry,
  error = null,
  onSave,
  onClose,
}: RosterEntryModalProps) {
  const [bunk, setBunk] = useState(initialEntry?.bunk ?? '')
  const [counselors, setCounselors] = useState(initialEntry?.counselors ?? '')
  const [campers, setCampers] = useState(
    initialEntry?.campers !== undefined ? String(initialEntry.campers) : '',
  )

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedCampers = campers.trim()
    onSave({
      bunk: bunk.trim(),
      counselors: counselors.trim(),
      campers: trimmedCampers === '' ? undefined : Number(trimmedCampers),
    })
  }

  return (
    <Modal title={initialEntry ? `Edit Bunk ${initialEntry.bunk}` : 'Add Bunk'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="roster-entry-modal__form">
        <TextField
          label="Bunk"
          value={bunk}
          onChange={(event) => setBunk(event.target.value)}
          required
        />
        <TextField
          label="Counselors"
          value={counselors}
          onChange={(event) => setCounselors(event.target.value)}
          required
        />
        <TextField
          label="# of Campers (optional)"
          type="number"
          inputMode="numeric"
          min={0}
          value={campers}
          onChange={(event) => setCampers(event.target.value)}
        />
        {error ? (
          <p role="alert" className="roster-entry-modal__error">
            {error}
          </p>
        ) : null}
        <Button type="submit">{initialEntry ? 'Save Changes' : 'Add Bunk'}</Button>
      </form>
    </Modal>
  )
}
