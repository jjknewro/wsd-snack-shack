import './EmptyState.css'

export type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return <p className="empty-state">{message}</p>
}
