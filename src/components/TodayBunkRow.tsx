export type TodayBunkRowProps = {
  bunk: string
  campers?: number
  status: 'pending' | 'completed'
  specialRequirementCount: number
  pickupTime?: string
  // Omit to render the bunk as plain text (used by tests that don't care
  // about the interaction) — every real call site passes this (Task 6.1).
  onSelect?: () => void
  // The checkbox's second, quicker way to complete a pickup (or reopen one
  // by unchecking) - omit for the same reason as onSelect.
  onToggleComplete?: (checked: boolean) => void
  // True for a closed (read-only) day - the checkbox stays visible so
  // completed bunks still show as checked, but can't be toggled.
  toggleDisabled?: boolean
  notes?: string
  onNotesChange?: (notes: string) => void
  // Same closed-day read-only treatment as toggleDisabled, but independent
  // of it - notes can be entered for a pending bunk too.
  notesDisabled?: boolean
}

// One row = everything the operator needs for this bunk at a glance, with no
// need to open a separate record (Task 5.1 acceptance criteria). The
// checkbox's own checked/unchecked state (not color) is what conveys status
// here, consistent with this project's "never convey status by color alone"
// rule (see Task 5.1's note).
export function TodayBunkRow({
  bunk,
  campers,
  status,
  specialRequirementCount,
  pickupTime,
  onSelect,
  onToggleComplete,
  toggleDisabled,
  notes,
  onNotesChange,
  notesDisabled,
}: TodayBunkRowProps) {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={status === 'completed'}
          disabled={toggleDisabled}
          onChange={(event) => onToggleComplete?.(event.target.checked)}
          aria-label={`Mark ${bunk} picked up`}
        />
      </td>
      <td>
        {onSelect ? (
          <button type="button" className="link-button" onClick={onSelect}>
            {bunk}
          </button>
        ) : (
          bunk
        )}
      </td>
      <td>{campers ?? '—'}</td>
      <td>
        {specialRequirementCount > 0
          ? `${specialRequirementCount} special requirement${specialRequirementCount === 1 ? '' : 's'}`
          : 'None'}
      </td>
      <td>{status === 'completed' ? (pickupTime ?? '—') : '—'}</td>
      <td>
        <input
          type="text"
          className="today-bunk-row__notes-input"
          value={notes ?? ''}
          disabled={notesDisabled}
          onChange={(event) => onNotesChange?.(event.target.value)}
          aria-label={`Notes for ${bunk}`}
        />
      </td>
    </tr>
  )
}
