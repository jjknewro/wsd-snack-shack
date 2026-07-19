import './LoadingState.css'

export type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status">
      {label}
    </div>
  )
}
