import { createBrowserRouter, type RouteObject } from 'react-router'

import { AppShell } from './components/AppShell'
import { History } from './pages/History'
import { MasterRoster } from './pages/MasterRoster'
import { NotFound } from './pages/NotFound'
import { Requirements } from './pages/Requirements'
import { Settings } from './pages/Settings'
import { Today } from './pages/Today'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Today /> },
      { path: 'roster', element: <MasterRoster /> },
      { path: 'requirements', element: <Requirements /> },
      { path: 'history', element: <History /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
