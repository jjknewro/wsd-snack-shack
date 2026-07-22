# ARCHITECTURE.md

# WSD Snack Shack MVP Architecture

## Status

MVP Architecture — revised 2026-07-19 (JSON files, no backend)

---

# Primary Objective

Create the fastest, simplest, and most reliable way for a Snack Shack operator to distribute snacks, manage special dietary requirements, record bunk pickups, and maintain operational records with as little effort as possible.

The MVP is intentionally designed for a **single operator** using a mobile device.

The application should require minimal setup while remaining easy to expand in the future.

---

# Architecture Revision Note

This is the **second** architecture revision. The original approved architecture used React Native + Expo + Supabase (retired — see `IMPLEMENTATION-LOG-MVP.md`). The first revision replaced that with a React + Vite PWA backed by Google Apps Script and the Snack Shack's existing Google Sheets workbook. **This revision removes the Google Sheets/Apps Script backend entirely** in favor of plain JSON files.

Any earlier wording referencing Apps Script, the Sheets API, or a live workbook connection is superseded by this document. `WORKBOOK-SCHEMA.md` remains valid as a historical record of the real spreadsheet's structure — it directly informed the JSON data shapes below — but the workbook itself is no longer read by the application.

This simplification was requested by the user after seeing a working mock-data prototype of the Master Roster screen (see `IMPLEMENTATION-LOG-MVP.md`).

---

# Guiding Principles

1. Simplicity over complexity.
2. Mobile-first design.
3. The bundled JSON files are the source of truth for roster and special-requirement data.
4. Business logic belongs in the application — not scattered across components.
5. Every read goes through a single repository layer, even though that layer is simple today.
6. Design for future growth without overengineering the MVP.

---

# High Level Architecture

```
                React + Vite PWA
       (iPhone / Android / iPad / desktop browser)

                      │
                reads directly
                      │

              Bundled JSON files
         (src/data/masterRoster.json,
        src/data/specialRequirements.json)
```

**No backend.** No network request is made to read operational data. The entire application runs client-side.

Today's per-bunk pickup status (pending vs. processed) is tracked as **in-memory application state only** — it is not written back to the JSON files and does not persist across a page reload. This is a deliberate, known simplification for the current stage, not an oversight — see "Persistence — Current State" below.

---

# Technology Stack

## Frontend

- React
- Vite
- TypeScript
- React Router
- React Hook Form (for the data-editing screens described under "Future: Editing Seed Data")

TanStack Query is **not** used — there is nothing to fetch over a network.

## Backend

None.

## Data Store

**Bundled JSON files**, read directly by the application:

- `src/data/masterRoster.json` — one record per bunk (`bunk`, `counselors`, optional `campers`)
- `src/data/specialRequirements.json` — zero-to-many records per bunk (`bunk`, `requirement`, `quantity`, optional `notes`)

These are the files used "on a daily basis" — they represent the current roster and requirements, and are expected to be kept up to date (manually today; via in-app editing screens later — see below). They are **not** a one-time seed that becomes irrelevant after first load: every time the app starts, it reads whatever is currently in these files.

---

# Application Layers

```
UI

↓

Pages

↓

Components

↓

Business Services

↓

Repository Interface

↓

JSON Data Repository
```

---

# Repository Pattern

The application must never import or reference the JSON data files directly from a component. Every read goes through a repository.

```
SnackRepository

├── getRoster()

├── getSpecialRequirementsForBunk(bunk)

├── getToday()          — in-memory pickup status (see below)

├── markPickedUp(bunk)  — in-memory only, for now

├── getHistory()         — not yet implemented
```

If the data source changes later (see "Future Expansion"), only the repository implementation changes — pages, components, and business services depend on the interface, not the storage mechanism.

---

# Data Model (confirmed so far)

Implemented in `src/types/roster.ts`; mock data in `src/data/*.json` (see `IMPLEMENTATION-LOG-MVP.md` for how the mock data was generated).

## Master Roster

One record per bunk.

| Field | Type | Required | Notes |
|---|---|---|---|
| `bunk` | string | Yes | Bunk code, e.g. `K3`. Acts as the natural key. |
| `counselors` | string | Yes | Free text; multiple counselors separated by `/`. |
| `campers` | number | No | Optional camper count. |

## Special Requirements

Zero to many records per bunk.

| Field | Type | Required | Notes |
|---|---|---|---|
| `bunk` | string | Yes | Joins to a Master Roster record. |
| `requirement` | enum | Yes | One of: `No Dairy`, `Gluten Free`, `No Red Dye`, `Nurse`, `No Corn Syrup`, `No Soy/Dairy`, `Cholov Yisroel`. |
| `quantity` | number | Yes | How many campers in the bunk need this specific requirement. |
| `notes` | string | No | Free text. |

Additional entities (pickup history, settings) are **not yet defined** — they'll be specified in `IMPLEMENTATION-PLAN-MVP.md` Task 2.2 once the pickup workflow epics are reached.

---

# Persistence — Current State

**Roster and special-requirements data**: seeded from the bundled JSON files on first use, then read from and written to this browser's `localStorage` (Task 7.5 — see "Future: Editing Seed Data" for how that mechanism was chosen). Edits made in the app persist across reloads on the same device, but are device-scoped: they never sync back to `masterRoster.json`/`specialRequirements.json` in git, and a different device (or a fresh browser profile on the same device) sees the original bundled seed data.

**Pickup status** (which bunks are pending vs. processed today): held in **React application state only**. It is:
- Reset every time the page is reloaded.
- Not written to the JSON files.
- Not persisted anywhere else (no `localStorage`, no server).

This is intentional for the current stage of the MVP — explicitly called out by the user as something that "might change later," not a final decision. When real day-to-day use requires pickup status to survive a page reload, that's a scoped follow-up task, not something to solve speculatively now.

---

# Future: Editing Seed Data

Implemented as Task 7.5 (2026-07-21). The write-back mechanism was left undecided until the app was actually deployed and in use: by the time this task started, the app was live on GitHub Pages and being used from a phone, which settled the question — a static production build has no server of its own to write `masterRoster.json`/`specialRequirements.json` back to, and a phone can't reach a local dev server either. `localStorage` was the only mechanism that actually works under those constraints, so `MasterRoster` now defaults to a `localStorage`-backed `WritableSnackRepository` (`src/repositories/localStorageSnackRepository.ts`) instead of the read-only JSON-backed one. Validation reuses the exact Task 2.6 rules (`src/services/dataValidation.ts`) against the proposed full next state before any write commits, so an invalid edit is rejected with the same `DataValidationError` messaging used elsewhere and never partially applied. Deleting a roster entry cascades to delete that bunk's special-requirement entries too (otherwise they'd fail validation by referencing a bunk that no longer exists); the UI surfaces that count before the operator confirms.

`SnackRepository` itself was left unchanged (read-only) so every existing fixture repository across the test suite keeps satisfying it without modification — the mutation methods live on a separate `WritableSnackRepository` type that only the real repository implements, and `MasterRoster` detects which one it got at runtime (`isWritableSnackRepository`) to decide whether to render edit controls at all, matching this task's acceptance criteria that the UI must not suggest editing is possible before it actually ships.

---

# Authentication

**None.** There is no backend to authenticate against, and no shared/multi-device access to protect. If the operator's device itself needs to be protected from unauthorized use, that is the device's own lock screen — an OS-level concern, not an application concern.

---

# Offline Behavior

The application works fully offline after the initial page load — there is no network dependency for data at all.

---

# Error Handling

Business services should return a consistent success/failure shape, even without a network boundary:

```
Success
{ success: true, data: ... }

Failure
{ success: false, message: "...", errorCode: "..." }
```

Realistic failure modes at this stage: malformed or missing JSON data (validated at load time — Task 2.6 territory). Raw parsing errors or stack traces must not be shown to the operator directly.

---

# Security

- No credentials, API keys, or service-role secrets exist anywhere in this architecture — there's no backend to hold them.
- Real people's names (counselors) and potentially sensitive dietary/medical notes live in the bundled JSON files and, transiently, in application memory. Mock/development data must stay fictional (see `IMPLEMENTATION-LOG-MVP.md`); real operational data introduces real privacy handling questions (e.g., should real data files be committed to git at all?) to be resolved before this app is used with real campers' information — flagged in `open-questions.md` if not already resolved by the time that matters.

---

# Testing Strategy

## Unit Tests

- Business services
- Repository
- Validation

## Component Tests

- Full repository → UI flow (already the pattern used for `MasterRoster` + `Modal` — see `IMPLEMENTATION-LOG-MVP.md`)

## Manual Tests

- Snack day workflow
- Pickup workflow
- History
- Special requirements

---

# Future Expansion

The repository pattern allows replacing the JSON-file data source later without rewriting the UI or business logic — for example:

- `localStorage`-backed persistence (if pickup status needs to survive reloads)
- A small local server that reads/writes the actual files on disk (if in-app editing needs real file write-back)
- A real backend (if multi-device sync becomes an actual requirement)

No UI changes should be required for such a swap, provided the repository interface is respected. Which of these gets built, and when, is decided task by task as real needs arise — not architected speculatively today.

---

# Architecture Rules

✔ UI never imports the JSON data files directly — only through the repository.

✔ UI communicates only with business services.

✔ Business services communicate only with the repository interface.

✔ Every historical record (once history exists) is append-only.

✔ MVP favors simplicity over scalability.

---

# Out of Scope (MVP)

- Multiple users
- Role-based permissions
- Multi-device / multi-browser sync
- Offline synchronization (moot — the app has no online dependency to begin with)
- Push notifications
- Inventory forecasting
- Realtime collaboration
- Native mobile applications
- App Store deployment
- Any server or database backend

These may be introduced after the MVP is validated.

---

# Deployment

Since there is no backend, deployment is static file hosting — `npm run build` produces `dist/`, servable from any static host. There is no server process to run and no backend deployment step. Covered in detail when `IMPLEMENTATION-PLAN-MVP.md`'s deployment epic is reached.
