import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../data/masterRoster.json', () => ({ default: [{ counselors: 'Missing the required bunk field' }] }))
vi.mock('../data/specialRequirements.json', () => ({ default: [] }))

const { MasterRoster } = await import('../pages/MasterRoster')

describe('MasterRoster — invalid data', () => {
  it('shows a controlled error instead of the table when the data fails validation', async () => {
    render(<MasterRoster />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('masterRoster.json')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
