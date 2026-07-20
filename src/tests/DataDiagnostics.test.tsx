import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { DataDiagnostics } from '../components/DataDiagnostics'
import { DataValidationError } from '../repositories/jsonSnackRepository'

describe('DataDiagnostics', () => {
  it('shows record counts when the data loaded successfully', () => {
    render(
      <DataDiagnostics
        frontendVersion="1.2.3"
        diagnostics={{ loaded: true, rosterCount: 35, specialRequirementCount: 15 }}
      />,
    )

    expect(screen.getByText('1.2.3')).toBeVisible()
    expect(screen.getByText('Loaded and validated successfully')).toBeVisible()
    expect(screen.getByText('35')).toBeVisible()
    expect(screen.getByText('15')).toBeVisible()
  })

  it('shows the validation error message instead of record counts when the data failed to load', () => {
    const error = new DataValidationError([
      { file: 'masterRoster.json', index: 0, message: 'Missing or invalid "bunk".' },
    ])

    render(<DataDiagnostics frontendVersion="1.2.3" diagnostics={{ loaded: false, error }} />)

    expect(screen.getByText('Failed to load')).toBeVisible()
    expect(screen.getByText(error.message)).toBeVisible()
    expect(screen.queryByText('Bunks loaded')).not.toBeInTheDocument()
  })
})
