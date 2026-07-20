import { describe, expect, it } from 'vitest'

import {
  buildSnackRepository,
  createJsonSnackRepository,
  DataValidationError,
  getDataLoadDiagnostics,
} from '../repositories/jsonSnackRepository'

describe('createJsonSnackRepository', () => {
  it('loads the real bundled mock data successfully', () => {
    const repository = createJsonSnackRepository()

    const roster = repository.getRoster()
    expect(roster.length).toBeGreaterThan(0)
    expect(repository.getSpecialRequirementsForBunk('K3')).toHaveLength(3)
    expect(repository.getSpecialRequirementsForBunk('PN3')).toHaveLength(0)
  })
})

describe('buildSnackRepository', () => {
  it('builds a working repository from valid fixture data', () => {
    const repository = buildSnackRepository(
      [{ bunk: 'K1', counselors: 'Finley' }],
      [{ bunk: 'K1', requirement: 'No Dairy', quantity: 1 }],
    )

    expect(repository.getRoster()).toEqual([{ bunk: 'K1', counselors: 'Finley' }])
    expect(repository.getSpecialRequirementsForBunk('K1')).toHaveLength(1)
    expect(repository.getSpecialRequirementsForBunk('ZZ')).toEqual([])
  })

  it('throws a DataValidationError instead of returning invalid data', () => {
    expect(() => buildSnackRepository([{ counselors: 'Finley' }], [])).toThrow(DataValidationError)
  })

  it('the thrown error carries a clear, specific message and the underlying error list', () => {
    try {
      buildSnackRepository([{ counselors: 'Finley' }], [])
      expect.fail('expected buildSnackRepository to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(DataValidationError)
      const validationError = error as DataValidationError
      expect(validationError.message).toContain('masterRoster.json')
      expect(validationError.message).toContain('bunk')
      expect(validationError.errors).toHaveLength(1)
    }
  })
})

describe('getDataLoadDiagnostics', () => {
  it('reports success with record counts for the real bundled mock data', () => {
    const diagnostics = getDataLoadDiagnostics()

    expect(diagnostics.loaded).toBe(true)
    if (diagnostics.loaded) {
      expect(diagnostics.rosterCount).toBeGreaterThan(0)
      expect(diagnostics.specialRequirementCount).toBeGreaterThan(0)
    }
  })

  it('reports success with exact counts for valid fixture data', () => {
    const diagnostics = getDataLoadDiagnostics(
      [
        { bunk: 'K1', counselors: 'Finley' },
        { bunk: 'K2', counselors: 'Emerson' },
      ],
      [{ bunk: 'K1', requirement: 'No Dairy', quantity: 1 }],
    )

    expect(diagnostics).toEqual({ loaded: true, rosterCount: 2, specialRequirementCount: 1 })
  })

  it('reports failure with the validation error, not a thrown exception, for invalid fixture data', () => {
    const diagnostics = getDataLoadDiagnostics([{ counselors: 'Finley' }], [])

    expect(diagnostics.loaded).toBe(false)
    if (!diagnostics.loaded) {
      expect(diagnostics.error).toBeInstanceOf(DataValidationError)
      expect(diagnostics.error.message).toContain('masterRoster.json')
    }
  })
})
