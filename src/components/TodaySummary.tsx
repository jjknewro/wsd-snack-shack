import type { TodaySummaryData } from '@/services/todaySummary'

import './TodaySummary.css'

export type TodaySummaryProps = {
  summary: TodaySummaryData
}

export function TodaySummary({ summary }: TodaySummaryProps) {
  return (
    <dl className="today-summary">
      <div className="today-summary__row">
        <dt>Total bunks</dt>
        <dd>{summary.totalBunks}</dd>
      </div>
      <div className="today-summary__row">
        <dt>Bunks Done</dt>
        <dd>{summary.completedBunks}</dd>
      </div>
      <div className="today-summary__row">
        <dt>Pending</dt>
        <dd>{summary.pendingBunks}</dd>
      </div>
      <div className="today-summary__row">
        <dt>Expected campers</dt>
        <dd>{summary.expectedTotalCampers}</dd>
      </div>
      <div className="today-summary__row">
        <dt>Actual campers served</dt>
        <dd>{summary.actualTotalServed}</dd>
      </div>
      <div className="today-summary__row">
        <dt>Special requirements</dt>
        <dd>{summary.specialRequirementCount}</dd>
      </div>
    </dl>
  )
}
