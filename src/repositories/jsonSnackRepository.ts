import masterRosterJson from '@/data/masterRoster.json'
import specialRequirementsJson from '@/data/specialRequirements.json'
import { validateData, type ValidationError } from '@/services/dataValidation'
import type { MasterRosterEntry, SpecialRequirementEntry } from '@/types/roster'

import type { SnackRepository } from './snackRepository'

export class DataValidationError extends Error {
  readonly errors: ValidationError[]

  constructor(errors: ValidationError[]) {
    super(DataValidationError.formatMessage(errors))
    this.name = 'DataValidationError'
    this.errors = errors
  }

  private static formatMessage(errors: ValidationError[]): string {
    const details = errors
      .map((error) => `${error.file}[${error.index}]${error.bunk ? ` (bunk ${error.bunk})` : ''}: ${error.message}`)
      .join('; ')
    return `Snack Shack data failed validation (${errors.length} problem${errors.length === 1 ? '' : 's'}): ${details}`
  }
}

export function buildSnackRepository(masterRoster: unknown[], specialRequirements: unknown[]): SnackRepository {
  const errors = validateData(masterRoster, specialRequirements)
  if (errors.length > 0) {
    throw new DataValidationError(errors)
  }

  const roster = masterRoster as MasterRosterEntry[]
  const requirements = specialRequirements as SpecialRequirementEntry[]

  return {
    getRoster: () => roster,
    getSpecialRequirementsForBunk: (bunk) => requirements.filter((entry) => entry.bunk === bunk),
  }
}

export function createJsonSnackRepository(): SnackRepository {
  return buildSnackRepository(masterRosterJson, specialRequirementsJson)
}
