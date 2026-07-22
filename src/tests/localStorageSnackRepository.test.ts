import { beforeEach, describe, expect, it } from 'vitest'

import { createLocalStorageSnackRepository } from '../repositories/localStorageSnackRepository'
import { DataValidationError } from '../repositories/jsonSnackRepository'
import masterRosterJson from '../data/masterRoster.json'

describe('localStorageSnackRepository', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('seeds from the bundled JSON on first use', () => {
    const repository = createLocalStorageSnackRepository()

    expect(repository.getRoster()).toHaveLength(masterRosterJson.length)
  })

  it('persists an added roster entry across a simulated reload', () => {
    createLocalStorageSnackRepository().addRosterEntry({
      bunk: 'Z9',
      counselors: 'New Counselor',
      campers: 5,
    })

    const reloaded = createLocalStorageSnackRepository()
    expect(reloaded.getRoster()).toContainEqual({
      bunk: 'Z9',
      counselors: 'New Counselor',
      campers: 5,
    })
  })

  it('rejects adding a roster entry with a duplicate bunk and leaves existing data untouched', () => {
    const repository = createLocalStorageSnackRepository()
    const before = repository.getRoster()
    const existingBunk = before[0].bunk

    expect(() =>
      repository.addRosterEntry({ bunk: existingBunk, counselors: 'Someone Else' }),
    ).toThrow(DataValidationError)
    expect(repository.getRoster()).toEqual(before)
  })

  it('rejects a roster entry with a negative camper count', () => {
    const repository = createLocalStorageSnackRepository()

    expect(() =>
      repository.addRosterEntry({ bunk: 'Z9', counselors: 'Someone', campers: -1 }),
    ).toThrow(DataValidationError)
  })

  it('updates a roster entry in place, including renaming the bunk', () => {
    const repository = createLocalStorageSnackRepository()
    const original = repository.getRoster()[0]

    repository.updateRosterEntry(original.bunk, {
      bunk: 'RENAMED',
      counselors: original.counselors,
      campers: 3,
    })

    const roster = repository.getRoster()
    expect(roster.find((r) => r.bunk === original.bunk)).toBeUndefined()
    expect(roster.find((r) => r.bunk === 'RENAMED')).toEqual({
      bunk: 'RENAMED',
      counselors: original.counselors,
      campers: 3,
    })
  })

  it("cascades a bunk rename to that bunk's special-requirement entries", () => {
    const repository = createLocalStorageSnackRepository()
    const bunkWithRequirement = repository
      .getSpecialRequirements()
      .find((r) => repository.getRoster().some((entry) => entry.bunk === r.bunk))!.bunk

    repository.updateRosterEntry(bunkWithRequirement, { bunk: 'RENAMED-2', counselors: 'Someone' })

    expect(repository.getSpecialRequirementsForBunk('RENAMED-2').length).toBeGreaterThan(0)
    expect(repository.getSpecialRequirementsForBunk(bunkWithRequirement)).toHaveLength(0)
  })

  it('deleting a roster entry cascades to remove its special-requirement entries', () => {
    const repository = createLocalStorageSnackRepository()
    const bunkWithRequirement = repository.getSpecialRequirements()[0].bunk

    repository.deleteRosterEntry(bunkWithRequirement)

    expect(repository.getRoster().find((r) => r.bunk === bunkWithRequirement)).toBeUndefined()
    expect(repository.getSpecialRequirementsForBunk(bunkWithRequirement)).toHaveLength(0)
  })

  it('adds a special requirement and assigns it a stable id', () => {
    const repository = createLocalStorageSnackRepository()
    const bunk = repository.getRoster()[0].bunk

    repository.addSpecialRequirement({ bunk, requirement: 'Nurse', quantity: 2 })

    const added = repository
      .getSpecialRequirements()
      .find((r) => r.bunk === bunk && r.requirement === 'Nurse')
    expect(added).toBeDefined()
    expect(typeof added!.id).toBe('string')
  })

  it('rejects a special requirement referencing a bunk that does not exist', () => {
    const repository = createLocalStorageSnackRepository()

    expect(() =>
      repository.addSpecialRequirement({ bunk: 'NOPE', requirement: 'Nurse', quantity: 1 }),
    ).toThrow(DataValidationError)
  })

  it('rejects a special requirement with a non-positive quantity', () => {
    const repository = createLocalStorageSnackRepository()
    const bunk = repository.getRoster()[0].bunk

    expect(() =>
      repository.addSpecialRequirement({ bunk, requirement: 'Nurse', quantity: 0 }),
    ).toThrow(DataValidationError)
  })

  it('updates a special requirement by id', () => {
    const repository = createLocalStorageSnackRepository()
    const bunk = repository.getRoster()[0].bunk
    repository.addSpecialRequirement({ bunk, requirement: 'Nurse', quantity: 1 })
    const id = repository
      .getSpecialRequirements()
      .find((r) => r.bunk === bunk && r.requirement === 'Nurse')!.id

    repository.updateSpecialRequirement(id, {
      bunk,
      requirement: 'Nurse',
      quantity: 4,
      notes: 'updated',
    })

    const updated = repository.getSpecialRequirements().find((r) => r.id === id)
    expect(updated).toMatchObject({ quantity: 4, notes: 'updated' })
  })

  it('deletes a special requirement by id and persists the removal', () => {
    const repository = createLocalStorageSnackRepository()
    const bunk = repository.getRoster()[0].bunk
    repository.addSpecialRequirement({ bunk, requirement: 'Nurse', quantity: 1 })
    const id = repository
      .getSpecialRequirements()
      .find((r) => r.bunk === bunk && r.requirement === 'Nurse')!.id

    repository.deleteSpecialRequirement(id)

    expect(
      createLocalStorageSnackRepository()
        .getSpecialRequirements()
        .find((r) => r.id === id),
    ).toBeUndefined()
  })
})
