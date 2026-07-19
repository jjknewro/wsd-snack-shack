import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { routes } from '../router'

function renderAt(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  return render(<RouterProvider router={router} />)
}

describe('router', () => {
  it('shows the Today page and all nav links at the index route', () => {
    renderAt('/')

    expect(screen.getByRole('heading', { name: 'Today', level: 2 })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Today' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Master Roster' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Special Requirements' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Pickup History' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Settings' })).toBeVisible()
  })

  it('navigates to Master Roster', () => {
    renderAt('/')

    fireEvent.click(screen.getByRole('link', { name: 'Master Roster' }))

    expect(screen.getByRole('heading', { name: 'Master Roster', level: 2 })).toBeVisible()
  })

  it('navigates to Special Requirements', () => {
    renderAt('/')

    fireEvent.click(screen.getByRole('link', { name: 'Special Requirements' }))

    expect(screen.getByRole('heading', { name: 'Special Requirements', level: 2 })).toBeVisible()
  })

  it('navigates to Pickup History', () => {
    renderAt('/')

    fireEvent.click(screen.getByRole('link', { name: 'Pickup History' }))

    expect(screen.getByRole('heading', { name: 'Pickup History', level: 2 })).toBeVisible()
  })

  it('navigates to Settings', () => {
    renderAt('/')

    fireEvent.click(screen.getByRole('link', { name: 'Settings' }))

    expect(screen.getByRole('heading', { name: 'Settings', level: 2 })).toBeVisible()
  })

  it('navigates back to Today from another page', () => {
    renderAt('/settings')

    fireEvent.click(screen.getByRole('link', { name: 'Today' }))

    expect(screen.getByRole('heading', { name: 'Today', level: 2 })).toBeVisible()
  })

  it('shows a controlled not-found state for an unknown route', () => {
    renderAt('/this-route-does-not-exist')

    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Return to Today' })).toBeVisible()
  })
})
