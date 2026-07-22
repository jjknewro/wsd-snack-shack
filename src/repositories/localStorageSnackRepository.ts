import masterRosterJson from '@/data/masterRoster.json'
import specialRequirementsJson from '@/data/specialRequirements.json'
import { validateData } from '@/services/dataValidation'
import type { MasterRosterEntry, SpecialRequirementEntry } from '@/types/roster'

import { DataValidationError } from './jsonSnackRepository'
import type { SpecialRequirementRecord, WritableSnackRepository } from './snackRepository'

// Task 7.5's write-back mechanism, decided once the app was actually
// deployed (GitHub Pages, phone-based, single operator - see
// ARCHITECTURE.md's "Future: Editing Seed Data"): a static production build
// has no server to write masterRoster.json/specialRequirements.json back
// to, and a phone can't reach a local dev server anyway, so edits persist
// in this browser's localStorage instead, seeded once from the bundled
// JSON. That makes edits device-scoped rather than synced across devices -
// acceptable for a single operator, and the same tradeoff already noted for
// pickup status in ARCHITECTURE.md's "Persistence — Current State".
const STORAGE_KEY = 'wsd-snack-shack:roster-data:v1'

type StoredState = {
  roster: MasterRosterEntry[]
  requirements: SpecialRequirementRecord[]
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `req-${Math.random().toString(36).slice(2)}`
}

function seedState(): StoredState {
  return {
    roster: masterRosterJson as MasterRosterEntry[],
    requirements: (specialRequirementsJson as SpecialRequirementEntry[]).map((entry) => ({
      ...entry,
      id: generateId(),
    })),
  }
}

function readStoredState(): StoredState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredState
  } catch {
    return null
  }
}

function writeStoredState(state: StoredState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function assertValid(roster: MasterRosterEntry[], requirements: SpecialRequirementRecord[]): void {
  const errors = validateData(roster, requirements)
  if (errors.length > 0) {
    throw new DataValidationError(errors)
  }
}

export function createLocalStorageSnackRepository(): WritableSnackRepository {
  const stored = readStoredState()
  let state: StoredState = stored ?? seedState()
  if (!stored) {
    writeStoredState(state)
  }

  function persist(next: StoredState): void {
    assertValid(next.roster, next.requirements)
    state = next
    writeStoredState(state)
  }

  return {
    getRoster: () => state.roster,
    getSpecialRequirementsForBunk: (bunk) =>
      state.requirements.filter((entry) => entry.bunk === bunk),
    getSpecialRequirements: () => state.requirements,

    addRosterEntry(entry) {
      persist({ ...state, roster: [...state.roster, entry] })
    },

    updateRosterEntry(originalBunk, entry) {
      const nextRoster = state.roster.map((r) => (r.bunk === originalBunk ? entry : r))
      const nextRequirements =
        entry.bunk === originalBunk
          ? state.requirements
          : state.requirements.map((r) =>
              r.bunk === originalBunk ? { ...r, bunk: entry.bunk } : r,
            )
      persist({ roster: nextRoster, requirements: nextRequirements })
    },

    deleteRosterEntry(bunk) {
      persist({
        roster: state.roster.filter((r) => r.bunk !== bunk),
        requirements: state.requirements.filter((r) => r.bunk !== bunk),
      })
    },

    addSpecialRequirement(entry) {
      persist({ ...state, requirements: [...state.requirements, { ...entry, id: generateId() }] })
    },

    updateSpecialRequirement(id, entry) {
      persist({
        ...state,
        requirements: state.requirements.map((r) => (r.id === id ? { ...entry, id } : r)),
      })
    },

    deleteSpecialRequirement(id) {
      persist({ ...state, requirements: state.requirements.filter((r) => r.id !== id) })
    },
  }
}
