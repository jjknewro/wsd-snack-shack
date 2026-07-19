import { Button } from './Button'
import './ErrorState.css'

export type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__message">{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  )
}
