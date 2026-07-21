import { StatusBadge } from './StatusBadge'

export type TodayBunkRowProps = {
  bunk: string
  campers?: number
  status: 'pending' | 'completed'
  specialRequirementCount: number
  pickupTime?: string
  // Omit to render the bunk as plain text (used by tests that don't care
  // about the interaction) — every real call site passes this (Task 6.1).
  onSelect?: () => void
}

// One row = everything the operator needs for this bunk at a glance, with no
// need to open a separate record (Task 5.1 acceptance criteria). Status is
// never conveyed by color alone — StatusBadge always pairs its dot with a
// text label (see Task 5.1's note, following the same rule established for
// Today/StatusBadge generally).
export function TodayBunkRow({ bunk, campers, status, specialRequirementCount, pickupTime, onSelect }: TodayBunkRowProps) {
  return (
    <tr>
      <td>
        <StatusBadge variant={status === 'completed' ? 'completed' : 'pending'} label={status === 'completed' ? 'Picked Up' : 'Pending'} />
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
    </tr>
  )
}
