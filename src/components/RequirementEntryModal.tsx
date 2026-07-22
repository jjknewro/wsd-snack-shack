import { useState, type FormEvent } from 'react'

import {
  REQUIREMENT_TYPES,
  type RequirementType,
  type SpecialRequirementEntry,
} from '@/types/roster'

import { Button } from './Button'
import { Modal } from './Modal'
import './RosterEntryModal.css'
import { TextField } from './TextField'

export type RequirementEntryModalProps = {
  bunk: string
  initialEntry?: SpecialRequirementEntry
  error?: string | null
  onSave: (entry: SpecialRequirementEntry) => void
  onClose: () => void
}

export function RequirementEntryModal({
  bunk,
  initialEntry,
  error = null,
  onSave,
  onClose,
}: RequirementEntryModalProps) {
  const [requirement, setRequirement] = useState<RequirementType>(
    initialEntry?.requirement ?? REQUIREMENT_TYPES[0],
  )
  const [quantity, setQuantity] = useState(initialEntry ? String(initialEntry.quantity) : '1')
  const [notes, setNotes] = useState(initialEntry?.notes ?? '')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSave({
      bunk,
      requirement,
      quantity: Number(quantity.trim()),
      notes: notes.trim() === '' ? undefined : notes.trim(),
    })
  }

  return (
    <Modal
      title={initialEntry ? `Edit Requirement — Bunk ${bunk}` : `Add Requirement — Bunk ${bunk}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="roster-entry-modal__form">
        <div className="text-field">
          <label className="text-field__label" htmlFor="requirement-type">
            Requirement
          </label>
          <select
            id="requirement-type"
            className="text-field__input"
            value={requirement}
            onChange={(event) => setRequirement(event.target.value as RequirementType)}
          >
            {REQUIREMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <TextField
          label="Quantity"
          type="number"
          inputMode="numeric"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
        />
        <TextField
          label="Notes (optional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        {error ? (
          <p role="alert" className="roster-entry-modal__error">
            {error}
          </p>
        ) : null}
        <Button type="submit">{initialEntry ? 'Save Changes' : 'Add Requirement'}</Button>
      </form>
    </Modal>
  )
}
