import { REQUIREMENT_TYPES, type RequirementType } from '@/types/roster'

export type ValidationError = {
  file: 'masterRoster.json' | 'specialRequirements.json'
  index: number
  bunk?: string
  message: string
}

function isRequirementType(value: unknown): value is RequirementType {
  return typeof value === 'string' && (REQUIREMENT_TYPES as readonly string[]).includes(value)
}

function readBunk(record: Record<string, unknown>): string | undefined {
  return typeof record.bunk === 'string' && record.bunk.trim() !== '' ? record.bunk : undefined
}

export function validateMasterRoster(entries: unknown[]): ValidationError[] {
  const errors: ValidationError[] = []
  const firstIndexByBunk = new Map<string, number>()

  entries.forEach((entry, index) => {
    if (typeof entry !== 'object' || entry === null) {
      errors.push({ file: 'masterRoster.json', index, message: 'Entry is not a valid object.' })
      return
    }

    const record = entry as Record<string, unknown>
    const bunk = readBunk(record)

    if (bunk === undefined) {
      errors.push({
        file: 'masterRoster.json',
        index,
        message: 'Missing or invalid "bunk" (must be a non-empty string).',
      })
    } else {
      const firstIndex = firstIndexByBunk.get(bunk)
      if (firstIndex === undefined) {
        firstIndexByBunk.set(bunk, index)
      } else {
        errors.push({
          file: 'masterRoster.json',
          index,
          bunk,
          message: `Duplicate bunk "${bunk}" — also appears at index ${firstIndex}.`,
        })
      }
    }

    if (typeof record.counselors !== 'string' || record.counselors.trim() === '') {
      errors.push({
        file: 'masterRoster.json',
        index,
        bunk,
        message: 'Missing or invalid "counselors" (must be a non-empty string).',
      })
    }

    if (record.campers !== undefined) {
      const campers = record.campers
      if (typeof campers !== 'number' || !Number.isFinite(campers) || campers < 0) {
        errors.push({
          file: 'masterRoster.json',
          index,
          bunk,
          message: '"campers" must be a non-negative number when present.',
        })
      }
    }
  })

  return errors
}

export function validateSpecialRequirements(
  entries: unknown[],
  knownBunks: ReadonlySet<string>,
): ValidationError[] {
  const errors: ValidationError[] = []

  entries.forEach((entry, index) => {
    if (typeof entry !== 'object' || entry === null) {
      errors.push({ file: 'specialRequirements.json', index, message: 'Entry is not a valid object.' })
      return
    }

    const record = entry as Record<string, unknown>
    const bunk = readBunk(record)

    if (bunk === undefined) {
      errors.push({
        file: 'specialRequirements.json',
        index,
        message: 'Missing or invalid "bunk" (must be a non-empty string).',
      })
    } else if (!knownBunks.has(bunk)) {
      errors.push({
        file: 'specialRequirements.json',
        index,
        bunk,
        message: `Bunk "${bunk}" does not exist in masterRoster.json.`,
      })
    }

    if (!isRequirementType(record.requirement)) {
      errors.push({
        file: 'specialRequirements.json',
        index,
        bunk,
        message: `Invalid "requirement" value ${JSON.stringify(record.requirement)} — must be one of: ${REQUIREMENT_TYPES.join(', ')}.`,
      })
    }

    if (typeof record.quantity !== 'number' || !Number.isFinite(record.quantity) || record.quantity <= 0) {
      errors.push({
        file: 'specialRequirements.json',
        index,
        bunk,
        message: '"quantity" must be a positive number.',
      })
    }

    if (record.notes !== undefined && typeof record.notes !== 'string') {
      errors.push({
        file: 'specialRequirements.json',
        index,
        bunk,
        message: '"notes" must be a string when present.',
      })
    }
  })

  return errors
}

export function validateData(masterRoster: unknown[], specialRequirements: unknown[]): ValidationError[] {
  const rosterErrors = validateMasterRoster(masterRoster)

  const knownBunks = new Set<string>()
  masterRoster.forEach((entry) => {
    if (typeof entry === 'object' && entry !== null) {
      const bunk = readBunk(entry as Record<string, unknown>)
      if (bunk !== undefined) knownBunks.add(bunk)
    }
  })

  return [...rosterErrors, ...validateSpecialRequirements(specialRequirements, knownBunks)]
}
