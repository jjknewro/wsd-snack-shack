import { NavLink, Outlet } from 'react-router'

import './AppShell.css'
import { SnackDayProvider } from './SnackDayProvider'

const NAV_LINKS = [
  { to: '/', label: 'Today', end: true },
  { to: '/roster', label: 'Master Roster', end: false },
  { to: '/requirements', label: 'Special Requirements', end: false },
  { to: '/history', label: 'Pickup History', end: false },
  { to: '/settings', label: 'Settings', end: false },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>WSD Snack Shack</h1>
        <nav className="app-shell__nav" aria-label="Primary">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? 'app-shell__link is-active' : 'app-shell__link'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-shell__content">
        <SnackDayProvider>
          <Outlet />
        </SnackDayProvider>
      </main>
    </div>
  )
}
