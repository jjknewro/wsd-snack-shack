import { useEffect, useState } from 'react'

import type { WorkbookSnapshot } from '@/types/workbookSnapshot'

export type WorkbookSnapshotState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: WorkbookSnapshot }

// Fetches the local-only workbook snapshot (see public/data/workbook-snapshot.json,
// gitignored - not present in a fresh clone). This is temporary visualization
// tooling, not the real data pipeline; EPIC 4 replaces it entirely.
export function useWorkbookSnapshot(): WorkbookSnapshotState {
  const [state, setState] = useState<WorkbookSnapshotState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetch('/data/workbook-snapshot.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Snapshot request failed with status ${response.status}`)
        }
        return response.json() as Promise<WorkbookSnapshot>
      })
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data })
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: 'error',
            message:
              'No local workbook snapshot found. Run the export script against the workbook export to generate public/data/workbook-snapshot.json.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
