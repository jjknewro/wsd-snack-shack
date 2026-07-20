import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Settings } from '../pages/Settings'

describe('Settings', () => {
  it('shows the data diagnostics section with a successful load status and record counts', () => {
    render(<Settings />)

    expect(screen.getByText('Data Diagnostics')).toBeVisible()
    expect(screen.getByText('Frontend version')).toBeVisible()
    expect(screen.getByText('Loaded and validated successfully')).toBeVisible()
    expect(screen.getByText('Bunks loaded')).toBeVisible()
    expect(screen.getByText('Special requirement entries loaded')).toBeVisible()
  })
})
