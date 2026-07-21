import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { TodaySummary } from '../components/TodaySummary'
import type { TodaySummaryData } from '../services/todaySummary'

describe('TodaySummary', () => {
  it('shows all the summary figures', () => {
    const summary: TodaySummaryData = {
      totalBunks: 10,
      completedBunks: 3,
      pendingBunks: 7,
      expectedTotalCampers: 84,
      actualTotalServed: null,
      specialRequirementCount: 5,
    }

    render(<TodaySummary summary={summary} />)

    expect(screen.getByText('Total bunks')).toBeVisible()
    expect(screen.getByText('10')).toBeVisible()
    expect(screen.getByText('Completed')).toBeVisible()
    expect(screen.getByText('3')).toBeVisible()
    expect(screen.getByText('Pending')).toBeVisible()
    expect(screen.getByText('7')).toBeVisible()
    expect(screen.getByText('Expected campers')).toBeVisible()
    expect(screen.getByText('84')).toBeVisible()
    expect(screen.getByText('Special requirements')).toBeVisible()
    expect(screen.getByText('5')).toBeVisible()
  })

  it('shows "Not tracked yet" instead of a fabricated number when actualTotalServed is null', () => {
    const summary: TodaySummaryData = {
      totalBunks: 1,
      completedBunks: 0,
      pendingBunks: 1,
      expectedTotalCampers: 8,
      actualTotalServed: null,
      specialRequirementCount: 0,
    }

    render(<TodaySummary summary={summary} />)

    expect(screen.getByText('Not tracked yet')).toBeVisible()
  })
})
