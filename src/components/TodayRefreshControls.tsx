import { Button } from './Button'
import './TodayRefreshControls.css'

export type TodayRefreshControlsProps = {
  // Always set by the time this renders — the initial load (which happens
  // before any branch that renders this component) already counts as the
  // first "refresh". There is no reachable "never refreshed" state to show.
  lastRefreshedAt: string
  refreshError: string | null
  onRefresh: () => void
}

export function TodayRefreshControls({ lastRefreshedAt, refreshError, onRefresh }: TodayRefreshControlsProps) {
  return (
    <div className="today-refresh">
      <div className="today-refresh__row">
        <span className="today-refresh__timestamp">Last refreshed: {lastRefreshedAt}</span>
        <Button variant="secondary" onClick={onRefresh}>
          Clear All
        </Button>
      </div>

      {refreshError ? (
        <p className="today-refresh__error" role="alert">
          Refresh failed: {refreshError} Showing the last successfully loaded data.
        </p>
      ) : null}
    </div>
  )
}
