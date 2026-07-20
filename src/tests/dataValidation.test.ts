import { describe, expect, it } from 'vitest'

import { validateData, validateMasterRoster, validateSpecialRequirements } from '../services/dataValidation'

const validRoster = [
  { bunk: 'K1', counselors: 'Finley', campers: 10 },
  { bunk: 'K2', counselors: 'Emerson' },
]

const validRequirements = [
  { bunk: 'K1', requirement: 'No Dairy', quantity: 1 },
  { bunk: 'K1', requirement: 'Nurse', quantity: 1, notes: 'Optional note' },
]

describe('validateMasterRoster', () => {
  it('passes a valid fixture with no errors', () => {
    expect(validateMasterRoster(validRoster)).toEqual([])
  })

  it('flags a missing bunk', () => {
    const errors = validateMasterRoster([{ counselors: 'Finley' }])
    expect(errors).toEqual([
      expect.objectContaining({ file: 'masterRoster.json', index: 0, message: expect.stringContaining('bunk') }),
    ])
  })

  it('flags a missing counselors field', () => {
    const errors = validateMasterRoster([{ bunk: 'K1' }])
    expect(errors).toEqual([
      expect.objectContaining({ file: 'masterRoster.json', index: 0, bunk: 'K1', message: expect.stringContaining('counselors') }),
    ])
  })

  it('flags a negative campers value', () => {
    const errors = validateMasterRoster([{ bunk: 'K1', counselors: 'Finley', campers: -3 }])
    expect(errors).toEqual([
      expect.objectContaining({ file: 'masterRoster.json', index: 0, bunk: 'K1', message: expect.stringContaining('campers') }),
    ])
  })

  it('flags duplicate bunks and identifies both the record and the earlier index', () => {
    const errors = validateMasterRoster([
      { bunk: 'K1', counselors: 'Finley' },
      { bunk: 'K1', counselors: 'Riley' },
    ])
    expect(errors).toEqual([
      expect.objectContaining({ file: 'masterRoster.json', index: 1, bunk: 'K1', message: expect.stringContaining('Duplicate bunk "K1"') }),
    ])
  })
})

describe('validateSpecialRequirements', () => {
  const knownBunks = new Set(['K1', 'K2'])

  it('passes a valid fixture with no errors', () => {
    expect(validateSpecialRequirements(validRequirements, knownBunks)).toEqual([])
  })

  it('flags an invalid requirement value', () => {
    const errors = validateSpecialRequirements([{ bunk: 'K1', requirement: 'Medication', quantity: 1 }], knownBunks)
    expect(errors).toEqual([
      expect.objectContaining({ file: 'specialRequirements.json', index: 0, bunk: 'K1', message: expect.stringContaining('Invalid "requirement" value') }),
    ])
  })

  it('flags a non-positive quantity', () => {
    const errors = validateSpecialRequirements([{ bunk: 'K1', requirement: 'No Dairy', quantity: 0 }], knownBunks)
    expect(errors).toEqual([
      expect.objectContaining({ file: 'specialRequirements.json', index: 0, bunk: 'K1', message: expect.stringContaining('quantity') }),
    ])
  })

  it('flags a bunk that does not exist in the master roster', () => {
    const errors = validateSpecialRequirements([{ bunk: 'ZZ9', requirement: 'No Dairy', quantity: 1 }], knownBunks)
    expect(errors).toEqual([
      expect.objectContaining({ file: 'specialRequirements.json', index: 0, bunk: 'ZZ9', message: expect.stringContaining('does not exist in masterRoster.json') }),
    ])
  })
})

describe('validateData', () => {
  it('passes matching valid fixtures with no errors', () => {
    expect(validateData(validRoster, validRequirements)).toEqual([])
  })

  it('combines roster and requirement errors, catching an orphaned bunk reference across files', () => {
    const errors = validateData(validRoster, [{ bunk: 'ORPHAN', requirement: 'No Dairy', quantity: 1 }])
    expect(errors).toHaveLength(1)
    expect(errors[0]).toEqual(
      expect.objectContaining({ file: 'specialRequirements.json', bunk: 'ORPHAN', message: expect.stringContaining('does not exist') }),
    )
  })
})
