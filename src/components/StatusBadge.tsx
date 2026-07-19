import './StatusBadge.css'

export type StatusVariant = 'pending' | 'completed' | 'warning' | 'critical'

export type StatusBadgeProps = {
  variant: StatusVariant
  label: string
}

// Status must never rely on color alone (see IMPLEMENTATION-PLAN-MVP.md
// Task 5.1) - always pass a real text label, never just a variant.
export function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${variant}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {label}
    </span>
  )
}
