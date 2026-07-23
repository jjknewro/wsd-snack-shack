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
      actualTotalServed: 21,
      specialRequirementCount: 5,
    }

    render(<TodaySummary summary={summary} />)

    expect(screen.getByText('Total bunks')).toBeVisible()
    expect(screen.getByText('10')).toBeVisible()
    expect(screen.getByText('Bunks Done')).toBeVisible()
    expect(screen.getByText('3')).toBeVisible()
    expect(screen.getByText('Pending')).toBeVisible()
    expect(screen.getByText('7')).toBeVisible()
    expect(screen.getByText('Expected campers')).toBeVisible()
    expect(screen.getByText('84')).toBeVisible()
    expect(screen.getByText('Actual campers served')).toBeVisible()
    expect(screen.getByText('21')).toBeVisible()
    expect(screen.getByText('Special requirements')).toBeVisible()
    expect(screen.getByText('5')).toBeVisible()
  })

  it('shows 0 for actual served when nothing has been picked up yet, not a placeholder', () => {
    const summary: TodaySummaryData = {
      totalBunks: 1,
      completedBunks: 0,
      pendingBunks: 1,
      expectedTotalCampers: 8,
      actualTotalServed: 0,
      specialRequirementCount: 0,
    }

    render(<TodaySummary summary={summary} />)

    const actualServedRow = screen.getByText('Actual campers served').closest('div') as HTMLElement
    expect(actualServedRow).toHaveTextContent('0')
  })
})
