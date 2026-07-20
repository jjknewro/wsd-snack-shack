import { DataDiagnostics } from '@/components/DataDiagnostics'
import { getDataLoadDiagnostics } from '@/repositories/jsonSnackRepository'

import packageJson from '../../package.json'

export function Settings() {
  const diagnostics = getDataLoadDiagnostics()

  return (
    <div>
      <h2>Settings</h2>
      <DataDiagnostics frontendVersion={packageJson.version} diagnostics={diagnostics} />
    </div>
  )
}
