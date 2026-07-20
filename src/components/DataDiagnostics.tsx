import type { DataLoadDiagnostics } from '@/repositories/jsonSnackRepository'

import './DataDiagnostics.css'
import { StatusBadge } from './StatusBadge'

export type DataDiagnosticsProps = {
  frontendVersion: string
  diagnostics: DataLoadDiagnostics
}

export function DataDiagnostics({ frontendVersion, diagnostics }: DataDiagnosticsProps) {
  return (
    <section className="data-diagnostics" aria-labelledby="data-diagnostics-heading">
      <h3 id="data-diagnostics-heading">Data Diagnostics</h3>
      <dl className="data-diagnostics__list">
        <div className="data-diagnostics__row">
          <dt>Frontend version</dt>
          <dd>{frontendVersion}</dd>
        </div>

        <div className="data-diagnostics__row">
          <dt>Data load status</dt>
          <dd>
            {diagnostics.loaded ? (
              <StatusBadge variant="completed" label="Loaded and validated successfully" />
            ) : (
              <StatusBadge variant="critical" label="Failed to load" />
            )}
          </dd>
        </div>

        {diagnostics.loaded ? (
          <>
            <div className="data-diagnostics__row">
              <dt>Bunks loaded</dt>
              <dd>{diagnostics.rosterCount}</dd>
            </div>
            <div className="data-diagnostics__row">
              <dt>Special requirement entries loaded</dt>
              <dd>{diagnostics.specialRequirementCount}</dd>
            </div>
          </>
        ) : (
          <div className="data-diagnostics__row">
            <dt>Validation problem</dt>
            <dd>{diagnostics.error.message}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
