import type { TodayStatusFilter } from '@/services/todayFilters'

import './TodayFilters.css'
import { Button } from './Button'
import { TextField } from './TextField'

export type TodayFiltersProps = {
  statusFilter: TodayStatusFilter
  onStatusFilterChange: (filter: TodayStatusFilter) => void
  searchTerm: string
  onSearchTermChange: (term: string) => void
}

const STATUS_OPTIONS: { value: TodayStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'special-requirements', label: 'Special Requirements' },
]

export function TodayFilters({
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
}: TodayFiltersProps) {
  const isFiltered = statusFilter !== 'all' || searchTerm !== ''

  return (
    <div className="today-filters">
      <TextField
        label="Search"
        placeholder="Search by bunk or counselor"
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
      />

      <div className="today-filters__status" role="group" aria-label="Filter by status">
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? 'primary' : 'secondary'}
            aria-pressed={statusFilter === option.value}
            onClick={() => onStatusFilterChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {isFiltered ? (
        <Button
          variant="secondary"
          onClick={() => {
            onStatusFilterChange('all')
            onSearchTermChange('')
          }}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
