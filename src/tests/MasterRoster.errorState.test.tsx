import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { MasterRoster } from '../pages/MasterRoster'
import { DataValidationError } from '../repositories/jsonSnackRepository'

describe('MasterRoster — invalid data', () => {
  it('shows a controlled error instead of the table when the repository fails to load', () => {
    const createFailingRepository = () => {
      throw new DataValidationError([
        { file: 'masterRoster.json', index: 0, message: 'Missing or invalid "bunk".' },
      ])
    }

    render(<MasterRoster createRepository={createFailingRepository} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('masterRoster.json')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows a generic message if the repository throws something other than a DataValidationError', () => {
    const createBrokenRepository = (): never => {
      throw new Error('unexpected failure')
    }

    render(<MasterRoster createRepository={createBrokenRepository} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load Snack Shack data.')
  })
})
